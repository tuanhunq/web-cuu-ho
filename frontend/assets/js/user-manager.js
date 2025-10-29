// Enhanced Password Security and Validation System
const SecurityManager = {
    // Hash password (simplified version - in production use proper hashing)
    hashPassword: function(password) {
        // This is a simplified version. In production, use proper hashing like bcrypt
        let hash = 0;
        for (let i = 0; i < password.length; i++) {
            const char = password.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return Math.abs(hash).toString(36) + password.length;
    },

    // Validate password strength
    validatePassword: function(password) {
        const requirements = {
            length: password.length >= 8,
            lowercase: /[a-z]/.test(password),
            uppercase: /[A-Z]/.test(password),
            number: /[0-9]/.test(password),
            special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
        };

        const strength = Object.values(requirements).filter(Boolean).length;
        return { requirements, strength };
    },

    // Validate email format
    validateEmail: function(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },

    // Validate username format
    validateUsername: function(username) {
        const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
        return usernameRegex.test(username);
    },

    // Validate fullname format
    validateFullname: function(fullname) {
        return fullname.length >= 2 && fullname.length <= 50;
    }
};

// Enhanced User Management System
const UserManager = {
    // Initialize default users if not exists
    initUsers: function() {
        if (!localStorage.getItem('systemUsers')) {
            const defaultUsers = [
                {
                    id: 1,
                    username: "admin",
                    password: SecurityManager.hashPassword("admin123"),
                    fullname: "Nguyễn Văn Admin",
                    email: "admin@cuuhocquocgia.vn",
                    role: "admin",
                    status: "active",
                    permissions: ["news", "reports", "respond", "users"],
                    created: new Date().toISOString().split('T')[0],
                    lastLogin: null,
                    loginAttempts: 0,
                    lockedUntil: null
                },
                {
                    id: 2,
                    username: "moderator",
                    password: SecurityManager.hashPassword("mod123"),
                    fullname: "Trần Thị Điều phối",
                    email: "moderator@cuuhocquocgia.vn",
                    role: "moderator",
                    status: "active",
                    permissions: ["news", "reports", "respond"],
                    created: new Date().toISOString().split('T')[0],
                    lastLogin: null,
                    loginAttempts: 0,
                    lockedUntil: null
                },
                {
                    id: 3,
                    username: "user",
                    password: SecurityManager.hashPassword("user123"),
                    fullname: "Lê Văn Người dùng",
                    email: "user@cuuhocquocgia.vn",
                    role: "rescuer",
                    status: "active",
                    permissions: ["reports"],
                    created: new Date().toISOString().split('T')[0],
                    lastLogin: null,
                    loginAttempts: 0,
                    lockedUntil: null
                }
            ];
            localStorage.setItem('systemUsers', JSON.stringify(defaultUsers));
        }
    },

    // Get all users
    getUsers: function() {
        return JSON.parse(localStorage.getItem('systemUsers')) || [];
    },

    // Check if username exists
    usernameExists: function(username) {
        const users = this.getUsers();
        return users.some(u => u.username === username);
    },

    // Check if email exists
    emailExists: function(email) {
        const users = this.getUsers();
        return users.some(u => u.email === email);
    },

    // Register new user
    registerUser: function(userData) {
        const users = this.getUsers();
        const newUser = {
            id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
            username: userData.username,
            password: SecurityManager.hashPassword(userData.password),
            fullname: userData.fullname,
            email: userData.email,
            role: userData.role,
            organization: userData.organization || '',
            status: "pending", // New users need approval
            permissions: this.getDefaultPermissions(userData.role),
            created: new Date().toISOString().split('T')[0],
            lastLogin: null,
            loginAttempts: 0,
            lockedUntil: null
        };

        users.push(newUser);
        localStorage.setItem('systemUsers', JSON.stringify(users));
        return newUser;
    },

    // Get default permissions based on role
    getDefaultPermissions: function(role) {
        const permissions = {
            'admin': ['news', 'reports', 'respond', 'users', 'settings'],
            'moderator': ['news', 'reports', 'respond'],
            'rescuer': ['reports', 'respond'],
            'viewer': ['reports']
        };
        return permissions[role] || ['reports'];
    },

    // Authenticate user
    authenticate: function(username, password) {
        const users = this.getUsers();
        const user = users.find(u => u.username === username);
        
        if (!user) {
            return { success: false, message: "Tên đăng nhập không tồn tại" };
        }

        // Check if account is locked
        if (user.lockedUntil && new Date() < new Date(user.lockedUntil)) {
            const remainingTime = Math.ceil((new Date(user.lockedUntil) - new Date()) / 60000);
            return { 
                success: false, 
                message: `Tài khoản bị khóa tạm thời. Vui lòng thử lại sau ${remainingTime} phút.` 
            };
        }

        // Check password
        if (user.password !== SecurityManager.hashPassword(password)) {
            // Increment login attempts
            user.loginAttempts = (user.loginAttempts || 0) + 1;
            
            // Lock account after 5 failed attempts
            if (user.loginAttempts >= 5) {
                user.lockedUntil = new Date(Date.now() + 30 * 60000); // 30 minutes
                this.updateUser(user);
                return { 
                    success: false, 
                    message: "Tài khoản đã bị khóa tạm thời do quá nhiều lần đăng nhập thất bại. Vui lòng thử lại sau 30 phút." 
                };
            }
            
            this.updateUser(user);
            const remainingAttempts = 5 - user.loginAttempts;
            return { 
                success: false, 
                message: `Mật khẩu không đúng. Bạn còn ${remainingAttempts} lần thử.` 
            };
        }

        // Check if account is active
        if (user.status !== 'active') {
            return { 
                success: false, 
                message: "Tài khoản của bạn chưa được kích hoạt. Vui lòng liên hệ quản trị viên." 
            };
        }

        // Reset login attempts and update last login
        user.loginAttempts = 0;
        user.lockedUntil = null;
        user.lastLogin = new Date().toISOString();
        this.updateUser(user);

        return { success: true, user: user };
    },

    // Update user data
    updateUser: function(updatedUser) {
        const users = this.getUsers();
        const index = users.findIndex(u => u.id === updatedUser.id);
        if (index !== -1) {
            users[index] = updatedUser;
            localStorage.setItem('systemUsers', JSON.stringify(users));
        }
    },

    // Get user by ID
    getUserById: function(id) {
        const users = this.getUsers();
        return users.find(u => u.id === id);
    },

    // Get user by username
    getUserByUsername: function(username) {
        const users = this.getUsers();
        return users.find(u => u.username === username);
    },

    // Delete user
    deleteUser: function(id) {
        const users = this.getUsers();
        const filteredUsers = users.filter(u => u.id !== id);
        localStorage.setItem('systemUsers', JSON.stringify(filteredUsers));
    },

    // Change user status
    changeUserStatus: function(id, status) {
        const users = this.getUsers();
        const user = users.find(u => u.id === id);
        if (user) {
            user.status = status;
            localStorage.setItem('systemUsers', JSON.stringify(users));
            return true;
        }
        return false;
    }
};

// Initialize default users when script loads
document.addEventListener('DOMContentLoaded', function() {
    UserManager.initUsers();
});