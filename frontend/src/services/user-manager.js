// User Management System
class UserManager {
    constructor() {
        this.users = this.loadUsers();
        this.initializeDefaultAccounts();
    }

    initializeDefaultAccounts() {
        const defaultUsers = [
            {
                id: this.generateId(),
                fullname: 'Quản Trị Viên Hệ Thống',
                username: 'admin',
                email: 'admin@cuuhocapquocgia.gov.vn',
                phone: '0901234567',
                password: this.hashPassword('Admin@123'),
                role: 'admin',
                organization: 'Bộ Công An',
                isActive: true,
                createdAt: new Date().toISOString(),
                verified: true
            },
            {
                id: this.generateId(),
                fullname: 'Trung Tá Nguyễn Văn A',
                username: 'cong_an_hanoi',
                email: 'congan.hanoi@cuuhocap.gov.vn',
                phone: '0912345678',
                password: this.hashPassword('CongAn@123'),
                role: 'rescuer',
                organization: 'Công An Hà Nội',
                isActive: true,
                createdAt: new Date().toISOString(),
                verified: true
            },
            {
                id: this.generateId(),
                fullname: 'Đại Úy Trần Văn B',
                username: 'quan_doi_bp',
                email: 'quandoi.bp@cuuhocap.gov.vn',
                phone: '0923456789',
                password: this.hashPassword('QuanDoi@123'),
                role: 'rescuer',
                organization: 'Quân Đội Biên Phòng',
                isActive: true,
                createdAt: new Date().toISOString(),
                verified: true
            },
            {
                id: this.generateId(),
                fullname: 'Đội Trưởng Lê Thị C',
                username: 'doi_cuuho_so1',
                email: 'cuuho.so1@cuuhocap.gov.vn',
                phone: '0934567890',
                password: this.hashPassword('CuuHo@123'),
                role: 'rescuer',
                organization: 'Đội Cứu Hộ Số 1',
                isActive: true,
                createdAt: new Date().toISOString(),
                verified: true
            }
        ];

        // Thêm tài khoản mặc định nếu chưa tồn tại
        defaultUsers.forEach(defaultUser => {
            const exists = this.users.some(user => 
                user.email === defaultUser.email || user.phone === defaultUser.phone
            );
            if (!exists) {
                this.users.push(defaultUser);
            }
        });

        this.saveUsers();
    }

    loadUsers() {
        const stored = localStorage.getItem('rescue_system_users');
        return stored ? JSON.parse(stored) : [];
    }

    saveUsers() {
        localStorage.setItem('rescue_system_users', JSON.stringify(this.users));
    }

    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    hashPassword(password) {
        // Trong thực tế nên sử dụng bcrypt, nhưng đây là demo đơn giản
        return btoa(unescape(encodeURIComponent(password)));
    }

    verifyPassword(inputPassword, storedPassword) {
        return this.hashPassword(inputPassword) === storedPassword;
    }

    usernameExists(username) {
        return this.users.some(user => user.username === username);
    }

    emailExists(email) {
        return this.users.some(user => user.email === email);
    }

    phoneExists(phone) {
        return this.users.some(user => user.phone === phone);
    }

    authenticate(username, password) {
        const user = this.users.find(u => 
            (u.username === username || u.email === username || u.phone === username) && 
            u.isActive
        );

        if (!user) {
            return { success: false, message: 'Tài khoản không tồn tại hoặc đã bị khóa' };
        }

        if (!this.verifyPassword(password, user.password)) {
            return { success: false, message: 'Mật khẩu không chính xác' };
        }

        // Tạo bản sao không bao gồm mật khẩu
        const { password: _, ...userWithoutPassword } = user;
        return { success: true, user: userWithoutPassword };
    }

    registerUser(userData) {
        // Kiểm tra email/số điện thoại đã tồn tại
        if (this.emailExists(userData.email)) {
            throw new Error('Email đã được sử dụng');
        }

        if (this.phoneExists(userData.phone)) {
            throw new Error('Số điện thoại đã được sử dụng');
        }

        if (this.usernameExists(userData.username)) {
            throw new Error('Tên đăng nhập đã tồn tại');
        }

        const newUser = {
            id: this.generateId(),
            fullname: userData.fullname,
            username: userData.username,
            email: userData.email,
            phone: userData.phone,
            password: this.hashPassword(userData.password),
            role: userData.role,
            organization: userData.organization || '',
            isActive: true,
            createdAt: new Date().toISOString(),
            verified: false // Cần xác thực email/số điện thoại
        };

        this.users.push(newUser);
        this.saveUsers();

        // Trả về user không bao gồm mật khẩu
        const { password: _, ...userWithoutPassword } = newUser;
        return userWithoutPassword;
    }

    getUserById(id) {
        const user = this.users.find(u => u.id === id);
        if (user) {
            const { password: _, ...userWithoutPassword } = user;
            return userWithoutPassword;
        }
        return null;
    }

    getAllUsers() {
        return this.users.map(user => {
            const { password: _, ...userWithoutPassword } = user;
            return userWithoutPassword;
        });
    }

    updateUser(id, updates) {
        const userIndex = this.users.findIndex(u => u.id === id);
        if (userIndex !== -1) {
            // Không cho phép cập nhật mật khẩu qua hàm này
            const { password, ...safeUpdates } = updates;
            this.users[userIndex] = { ...this.users[userIndex], ...safeUpdates };
            this.saveUsers();
            return true;
        }
        return false;
    }

    deleteUser(id) {
        const userIndex = this.users.findIndex(u => u.id === id);
        if (userIndex !== -1) {
            this.users.splice(userIndex, 1);
            this.saveUsers();
            return true;
        }
        return false;
    }
}

// Khởi tạo UserManager
const userManager = new UserManager();