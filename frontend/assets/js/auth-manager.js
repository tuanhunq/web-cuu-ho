// Auth Manager for cross-page authentication state
class AuthManager {
    constructor() {
        this.currentUser = null;
        this.init();
    }

    init() {
        this.loadCurrentUser();
        this.setupStorageListener();
    }

    loadCurrentUser() {
        const userData = localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser');
        if (userData) {
            this.currentUser = JSON.parse(userData);
        }
    }

    setupStorageListener() {
        // Lắng nghe thay đổi từ các tab khác
        window.addEventListener('storage', (e) => {
            if (e.key === 'currentUser') {
                this.loadCurrentUser();
                this.dispatchAuthChange();
            }
        });
    }

    dispatchAuthChange() {
        // Phát sự kiện khi trạng thái auth thay đổi
        const event = new CustomEvent('authChange', { 
            detail: { user: this.currentUser } 
        });
        window.dispatchEvent(event);
    }

    // Các phương thức static để sử dụng dễ dàng
    static getCurrentUser() {
        const userData = localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser');
        return userData ? JSON.parse(userData) : null;
    }

    static isLoggedIn() {
        return !!this.getCurrentUser();
    }

    static getUserRole() {
        const user = this.getCurrentUser();
        return user ? user.role : null;
    }

    static logout() {
        localStorage.removeItem('currentUser');
        sessionStorage.removeItem('currentUser');
        
        // Phát sự kiện logout
        const event = new CustomEvent('authChange', { 
            detail: { user: null } 
        });
        window.dispatchEvent(event);
        
        window.location.href = 'index.html';
    }
}

// Khởi tạo AuthManager
const authManager = new AuthManager();