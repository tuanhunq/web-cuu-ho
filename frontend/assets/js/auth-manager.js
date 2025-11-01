// Emergency Report Functionality
class EmergencyReport {
    constructor() {
        this.init();
    }

    init() {
        this.bindEvents();
        this.checkAuthStatus();
    }

    bindEvents() {
        // Emergency Report Button
        const emergencyBtn = document.getElementById('emergency-report-btn');
        const emergencyModal = document.getElementById('emergency-modal');
        const closeEmergencyModal = document.getElementById('close-emergency-modal');
        const cancelEmergency = document.getElementById('cancel-emergency');
        const emergencyTypeBtns = document.querySelectorAll('.emergency-type-btn');

        if (emergencyBtn) {
            emergencyBtn.addEventListener('click', () => this.handleEmergencyReport());
        }

        // Close modal events
        if (closeEmergencyModal) {
            closeEmergencyModal.addEventListener('click', () => this.closeModal());
        }

        if (cancelEmergency) {
            cancelEmergency.addEventListener('click', () => this.closeModal());
        }

        // Emergency type selection
        emergencyTypeBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const emergencyType = e.currentTarget.getAttribute('data-type');
                this.handleEmergencyTypeSelect(emergencyType);
            });
        });

        // Close modal when clicking outside
        if (emergencyModal) {
            emergencyModal.addEventListener('click', (e) => {
                if (e.target === emergencyModal) {
                    this.closeModal();
                }
            });
        }

        // Handle keyboard events
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
            }
        });
    }

    handleEmergencyReport() {
        // Check if user is logged in
        if (!this.isUserLoggedIn()) {
            this.showLoginPrompt();
        } else {
            this.showEmergencyModal();
        }
    }

    isUserLoggedIn() {
        // Check various authentication methods
        return localStorage.getItem('userLoggedIn') === 'true' || 
               sessionStorage.getItem('userLoggedIn') === 'true' ||
               document.cookie.includes('userAuthenticated=true');
    }

    showLoginPrompt() {
        const modalHtml = `
            <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                    <div class="flex justify-between items-center mb-4">
                        <h3 class="text-xl font-bold text-red-600">Đăng Nhập Cần Thiết</h3>
                        <button class="text-gray-400 hover:text-gray-500 close-login-prompt">
                            <i data-feather="x"></i>
                        </button>
                    </div>
                    <div class="space-y-4">
                        <p class="text-gray-600">
                            Để báo tin khẩn cấp, bạn cần đăng nhập. Việc này giúp chúng tôi:
                        </p>
                        <ul class="list-disc list-inside text-gray-600 space-y-2">
                            <li>Xác minh thông tin báo cáo</li>
                            <li>Liên hệ lại khi cần thêm thông tin</li>
                            <li>Đảm bảo tính xác thực của thông tin</li>
                        </ul>
                        <div class="flex space-x-3 pt-4">
                            <button class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition close-login-prompt">
                                Hủy bỏ
                            </button>
                            <a href="login.html?redirect=emergency" class="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-center">
                                Đăng nhập ngay
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        `;

        const modalElement = document.createElement('div');
        modalElement.innerHTML = modalHtml;
        document.body.appendChild(modalElement);

        // Update Feather icons
        feather.replace();

        // Add event listeners to close buttons
        const closeButtons = modalElement.querySelectorAll('.close-login-prompt');
        closeButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                document.body.removeChild(modalElement);
            });
        });

        // Close when clicking outside
        modalElement.addEventListener('click', (e) => {
            if (e.target === modalElement) {
                document.body.removeChild(modalElement);
            }
        });
    }

    showEmergencyModal() {
        const emergencyModal = document.getElementById('emergency-modal');
        if (emergencyModal) {
            emergencyModal.classList.remove('hidden');
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
        }
    }

    closeModal() {
        const emergencyModal = document.getElementById('emergency-modal');
        if (emergencyModal) {
            emergencyModal.classList.add('hidden');
            document.body.style.overflow = ''; // Restore scrolling
        }
    }

    handleEmergencyTypeSelect(type) {
        // Add loading state
        const buttons = document.querySelectorAll('.emergency-type-btn');
        buttons.forEach(btn => btn.disabled = true);

        // Simulate processing delay
        setTimeout(() => {
            this.redirectToEmergencyReport(type);
        }, 500);
    }

    redirectToEmergencyReport(type) {
        const emergencyTypes = {
            'fire': 'Hỏa hoạn',
            'flood': 'Ngập lụt', 
            'accident': 'Tai nạn giao thông',
            'medical': 'Cấp cứu y tế'
        };

        const typeName = emergencyTypes[type] || 'Khẩn cấp';
        window.location.href = `post.html?type=${type}&emergency=true&typeName=${encodeURIComponent(typeName)}`;
    }

    checkAuthStatus() {
        // Check if user just logged in and needs to be redirected to emergency report
        const urlParams = new URLSearchParams(window.location.search);
        const redirectToEmergency = urlParams.get('redirect') === 'emergency';
        const isLoggedIn = this.isUserLoggedIn();

        if (redirectToEmergency && isLoggedIn) {
            // Remove redirect parameter
            const newUrl = window.location.pathname;
            window.history.replaceState({}, document.title, newUrl);
            
            // Show emergency modal
            setTimeout(() => {
                this.showEmergencyModal();
            }, 1000);
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    new EmergencyReport();
});