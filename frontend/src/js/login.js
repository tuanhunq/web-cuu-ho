// assets/js/login.js - Enhanced Login System with Default Accounts

// User Management System
class UserManager {
    constructor() {
        this.currentUser = null;
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

    // Lưu thông tin user đã đăng nhập
    setCurrentUser(user) {
        this.currentUser = user;
        localStorage.setItem('rescue_system_current_user', JSON.stringify(user));
    }

    getCurrentUser() {
        if (!this.currentUser) {
            const savedUser = localStorage.getItem('rescue_system_current_user');
            if (savedUser) {
                this.currentUser = JSON.parse(savedUser);
            }
        }
        return this.currentUser;
    }

    logout() {
        this.currentUser = null;
        localStorage.removeItem('rescue_system_current_user');
    }

    isLoggedIn() {
        return this.getCurrentUser() !== null;
    }

    // Kiểm tra quyền admin
    isAdmin() {
        const user = this.getCurrentUser();
        return user && user.role === 'admin';
    }

    // Kiểm tra quyền rescuer
    isRescuer() {
        const user = this.getCurrentUser();
        return user && user.role === 'rescuer';
    }
}

// Main functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize User Manager
    window.userManager = new UserManager();

    // Kiểm tra nếu đã đăng nhập thì chuyển hướng đến admin
    if (window.userManager.isLoggedIn() && !window.location.href.includes('login.html')) {
        window.location.href = 'admin.html';
    }

    // Initialize Feather icons
    if (typeof feather !== 'undefined') {
        feather.replace();
    }

    // Mobile menu toggle
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');

    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
            
            // Update menu icon
            const icon = menuToggle.querySelector('i');
            if (mobileMenu.classList.contains('hidden')) {
                icon.setAttribute('data-feather', 'menu');
            } else {
                icon.setAttribute('data-feather', 'x');
            }
            feather.replace();
        });
    }

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        if (mobileMenu && !mobileMenu.contains(event.target) && 
            menuToggle && !menuToggle.contains(event.target) && 
            !mobileMenu.classList.contains('hidden')) {
            mobileMenu.classList.add('hidden');
            
            // Reset menu icon
            const icon = menuToggle.querySelector('i');
            icon.setAttribute('data-feather', 'menu');
            feather.replace();
        }
    });

    // Login Page Specific Functionality
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const loginAlert = document.getElementById('login-alert');
    const alertMessage = document.getElementById('alert-message');
    const formTabs = document.querySelectorAll('.form-tab');
    const switchToRegister = document.querySelector('.switch-to-register');
    const switchToLogin = document.querySelector('.switch-to-login');
    const togglePasswordButtons = document.querySelectorAll('.toggle-password');
    const generatePasswordBtn = document.getElementById('generate-password');
    const passwordStrengthBar = document.getElementById('password-strength-bar');

    // Thêm demo accounts info
    const demoAccountsInfo = document.createElement('div');
    demoAccountsInfo.className = 'demo-accounts-info bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4';
    demoAccountsInfo.innerHTML = `
        <h4 class="font-semibold text-blue-800 mb-2">📋 Tài khoản demo để thử nghiệm:</h4>
        <div class="space-y-1 text-sm text-blue-700">
            <div><strong>Admin:</strong> admin / Admin@123</div>
            <div><strong>Công an:</strong> cong_an_hanoi / CongAn@123</div>
            <div><strong>Quân đội:</strong> quan_doi_bp / QuanDoi@123</div>
            <div><strong>Cứu hộ:</strong> doi_cuuho_so1 / CuuHo@123</div>
        </div>
    `;

    // Chèn demo accounts info vào form đăng nhập
    if (loginForm) {
        loginForm.parentNode.insertBefore(demoAccountsInfo, loginForm.nextSibling);
    }

    // Only initialize login functionality if on login page
    if (loginForm && registerForm) {
        // Tab Switching
        formTabs.forEach(tab => {
            tab.addEventListener('click', function() {
                const targetTab = this.getAttribute('data-tab');
                
                // Update active tab
                formTabs.forEach(t => t.classList.remove('active'));
                this.classList.add('active');
                
                // Show corresponding form
                if (targetTab === 'login') {
                    showLoginForm();
                    demoAccountsInfo.style.display = 'block';
                } else {
                    showRegisterForm();
                    demoAccountsInfo.style.display = 'none';
                }
                
                // Hide any existing alerts
                hideAlert();
            });
        });

        // Switch to Register
        switchToRegister?.addEventListener('click', function(e) {
            e.preventDefault();
            formTabs.forEach(tab => tab.classList.remove('active'));
            document.querySelector('[data-tab="register"]').classList.add('active');
            showRegisterForm();
            hideAlert();
            demoAccountsInfo.style.display = 'none';
        });

        // Switch to Login
        switchToLogin?.addEventListener('click', function(e) {
            e.preventDefault();
            formTabs.forEach(tab => tab.classList.remove('active'));
            document.querySelector('[data-tab="login"]').classList.add('active');
            showLoginForm();
            hideAlert();
            demoAccountsInfo.style.display = 'block';
        });

        // Toggle Password Visibility
        togglePasswordButtons.forEach(button => {
            button.addEventListener('click', function() {
                const targetId = this.getAttribute('data-target');
                const passwordInput = document.getElementById(targetId);
                const icon = this.querySelector('i');
                
                if (passwordInput.type === 'password') {
                    passwordInput.type = 'text';
                    feather.replace();
                    icon.setAttribute('data-feather', 'eye-off');
                } else {
                    passwordInput.type = 'password';
                    feather.replace();
                    icon.setAttribute('data-feather', 'eye');
                }
                feather.replace();
            });
        });

        // Generate Strong Password
        generatePasswordBtn?.addEventListener('click', function() {
            const password = generateStrongPassword();
            document.getElementById('reg-password').value = password;
            document.getElementById('reg-confirm-password').value = password;
            
            // Update password strength
            checkPasswordStrength(password);
            
            // Show success message
            showAlert('Mật khẩu mạnh đã được tạo tự động!', 'success');
            
            // Refresh icons
            feather.replace();
        });

        // Password Strength Checker
        const regPasswordInput = document.getElementById('reg-password');
        regPasswordInput?.addEventListener('input', function() {
            checkPasswordStrength(this.value);
        });

        // Form Validation and Submission
        loginForm.addEventListener('submit', handleLogin);
        registerForm.addEventListener('submit', handleRegister);

        // Auto-fill demo account for testing
        const demoFillBtn = document.createElement('button');
        demoFillBtn.type = 'button';
        demoFillBtn.className = 'text-xs text-green-600 hover:text-green-800 font-medium mt-2';
        demoFillBtn.textContent = 'Điền tài khoản Admin demo';
        demoFillBtn.addEventListener('click', function() {
            document.getElementById('username').value = 'admin';
            document.getElementById('password').value = 'Admin@123';
            showAlert('Đã điền thông tin tài khoản Admin demo', 'success');
        });

        const usernameGroup = document.querySelector('#username').closest('.form-group');
        usernameGroup.appendChild(demoFillBtn);

        // Initialize password strength for existing password
        if (regPasswordInput?.value) {
            checkPasswordStrength(regPasswordInput.value);
        }
    }

    // General Utility Functions
    function showLoginForm() {
        loginForm.classList.add('active');
        registerForm.classList.remove('active');
    }

    function showRegisterForm() {
        registerForm.classList.add('active');
        loginForm.classList.remove('active');
    }

    function showAlert(message, type = 'error') {
        if (!loginAlert || !alertMessage) return;
        
        alertMessage.textContent = message;
        loginAlert.className = `alert alert-${type}`;
        loginAlert.style.display = 'flex';
        
        // Auto hide success messages after 5 seconds
        if (type === 'success') {
            setTimeout(hideAlert, 5000);
        }
        
        // Refresh icons
        feather.replace();
    }

    function hideAlert() {
        if (loginAlert) {
            loginAlert.style.display = 'none';
        }
    }

    function checkPasswordStrength(password) {
        if (!passwordStrengthBar) return;
        
        let strength = 0;
        
        if (password.length >= 8) strength++;
        if (/[a-z]/.test(password)) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^A-Za-z0-9]/.test(password)) strength++;
        
        passwordStrengthBar.className = 'password-strength-bar';
        
        if (password.length === 0) {
            passwordStrengthBar.style.width = '0';
        } else if (strength <= 2) {
            passwordStrengthBar.classList.add('weak');
        } else if (strength <= 4) {
            passwordStrengthBar.classList.add('medium');
        } else {
            passwordStrengthBar.classList.add('strong');
        }
    }

    function generateStrongPassword() {
        const length = 12;
        const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
        let password = "";
        
        // Ensure at least one of each required character type
        password += "ABCDEFGHIJKLMNOPQRSTUVWXYZ".charAt(Math.floor(Math.random() * 26));
        password += "abcdefghijklmnopqrstuvwxyz".charAt(Math.floor(Math.random() * 26));
        password += "0123456789".charAt(Math.floor(Math.random() * 10));
        password += "!@#$%^&*".charAt(Math.floor(Math.random() * 8));
        
        // Fill the rest
        for (let i = password.length; i < length; i++) {
            password += charset.charAt(Math.floor(Math.random() * charset.length));
        }
        
        // Shuffle the password
        return password.split('').sort(() => 0.5 - Math.random()).join('');
    }

    function validateLoginForm(formData) {
        const errors = {};
        
        if (!formData.username.trim()) {
            errors.username = 'Vui lòng nhập tên đăng nhập, email hoặc số điện thoại';
        }
        
        if (!formData.password) {
            errors.password = 'Vui lòng nhập mật khẩu';
        } else if (formData.password.length < 6) {
            errors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
        }
        
        return errors;
    }

    function validateRegisterForm(formData) {
        const errors = {};
        
        // Full name validation
        if (!formData.fullname.trim()) {
            errors.fullname = 'Vui lòng nhập họ và tên';
        } else if (formData.fullname.trim().length < 2) {
            errors.fullname = 'Họ và tên phải có ít nhất 2 ký tự';
        }
        
        // Username validation
        if (!formData.username.trim()) {
            errors.username = 'Vui lòng nhập tên đăng nhập';
        } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
            errors.username = 'Tên đăng nhập chỉ được chứa chữ cái, số và dấu gạch dưới';
        }
        
        // Email validation
        if (!formData.email.trim()) {
            errors.email = 'Vui lòng nhập email';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            errors.email = 'Email không hợp lệ';
        }
        
        // Phone validation
        if (!formData.phone.trim()) {
            errors.phone = 'Vui lòng nhập số điện thoại';
        } else if (!/^(0[3|5|7|8|9])+([0-9]{8})$/.test(formData.phone)) {
            errors.phone = 'Số điện thoại không hợp lệ';
        }
        
        // Password validation
        if (!formData.password) {
            errors.password = 'Vui lòng nhập mật khẩu';
        } else if (formData.password.length < 8) {
            errors.password = 'Mật khẩu phải có ít nhất 8 ký tự';
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(formData.password)) {
            errors.password = 'Mật khẩu phải chứa ít nhất một chữ hoa, một chữ thường, một số và một ký tự đặc biệt';
        }
        
        // Confirm password validation
        if (!formData.confirmPassword) {
            errors.confirmPassword = 'Vui lòng xác nhận mật khẩu';
        } else if (formData.password !== formData.confirmPassword) {
            errors.confirmPassword = 'Mật khẩu xác nhận không khớp';
        }
        
        // Role validation
        if (!formData.role) {
            errors.role = 'Vui lòng chọn vai trò';
        }
        
        // Terms validation
        if (!formData.acceptTerms) {
            errors.acceptTerms = 'Bạn phải đồng ý với điều khoản dịch vụ';
        }
        
        return errors;
    }

    function displayErrors(errors, formType) {
        // Clear previous errors
        document.querySelectorAll('.error-message').forEach(el => {
            el.style.display = 'none';
        });
        
        // Display new errors
        Object.keys(errors).forEach(field => {
            const errorElement = document.getElementById(`${formType}-${field}-error`);
            if (errorElement) {
                errorElement.textContent = errors[field];
                errorElement.style.display = 'block';
            }
        });
    }

    async function handleLogin(e) {
        e.preventDefault();
        
        const formData = {
            username: document.getElementById('username').value,
            password: document.getElementById('password').value,
            rememberMe: document.getElementById('remember-me').checked
        };
        
        // Validate form
        const errors = validateLoginForm(formData);
        if (Object.keys(errors).length > 0) {
            displayErrors(errors, 'login');
            return;
        }
        
        // Clear errors
        displayErrors({}, 'login');
        
        // Show loading state
        const loginBtn = document.getElementById('login-btn');
        loginBtn.classList.add('loading');
        loginBtn.disabled = true;
        
        try {
            // Use UserManager for authentication
            const result = window.userManager.authenticate(formData.username, formData.password);
            
            if (result.success) {
                // Lưu thông tin user đã đăng nhập
                window.userManager.setCurrentUser(result.user);
                
                // Show success message
                showAlert('Đăng nhập thành công! Đang chuyển hướng đến trang quản trị...', 'success');
                
                // Redirect to admin page after delay
                setTimeout(() => {
                    window.location.href = 'admin.html';
                }, 2000);
            } else {
                throw new Error(result.message);
            }
            
        } catch (error) {
            showAlert(error.message);
        } finally {
            loginBtn.classList.remove('loading');
            loginBtn.disabled = false;
        }
    }

    async function handleRegister(e) {
        e.preventDefault();
        
        const formData = {
            fullname: document.getElementById('reg-fullname').value,
            username: document.getElementById('reg-username').value,
            email: document.getElementById('reg-email').value,
            phone: document.getElementById('reg-phone').value,
            password: document.getElementById('reg-password').value,
            confirmPassword: document.getElementById('reg-confirm-password').value,
            role: document.getElementById('reg-role').value,
            organization: document.getElementById('reg-organization').value,
            acceptTerms: document.getElementById('accept-terms').checked
        };
        
        // Validate form
        const errors = validateRegisterForm(formData);
        if (Object.keys(errors).length > 0) {
            displayErrors(errors, 'reg');
            return;
        }
        
        // Clear errors
        displayErrors({}, 'reg');
        
        // Show loading state
        const registerBtn = document.getElementById('register-btn');
        registerBtn.classList.add('loading');
        registerBtn.disabled = true;
        
        try {
            // Use UserManager for registration
            const newUser = window.userManager.registerUser(formData);
            
            // Show success message
            showAlert('Đăng ký thành công! Vui lòng kiểm tra email để xác thực tài khoản.', 'success');
            
            // Switch to login form after delay
            setTimeout(() => {
                formTabs.forEach(tab => tab.classList.remove('active'));
                document.querySelector('[data-tab="login"]').classList.add('active');
                showLoginForm();
                hideAlert();
                
                // Auto-fill the new username
                document.getElementById('username').value = formData.username;
            }, 3000);
            
        } catch (error) {
            showAlert(error.message);
        } finally {
            registerBtn.classList.remove('loading');
            registerBtn.disabled = false;
        }
    }

    // General utility functions for other pages
    window.makeApiCall = async function(url, options = {}) {
        const defaultOptions = {
            headers: {
                'Content-Type': 'application/json',
            },
        };

        const mergedOptions = {
            ...defaultOptions,
            ...options,
            headers: {
                ...defaultOptions.headers,
                ...options.headers,
            },
        };

        try {
            const response = await fetch(url, mergedOptions);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('API call failed:', error);
            throw error;
        }
    };

    window.showNotification = function(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transform transition-transform duration-300 ${
            type === 'success' ? 'bg-green-500 text-white' :
            type === 'error' ? 'bg-red-500 text-white' :
            type === 'warning' ? 'bg-yellow-500 text-white' :
            'bg-blue-500 text-white'
        }`;
        notification.textContent = message;

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.classList.add('translate-x-0');
        }, 100);

        // Remove after 5 seconds
        setTimeout(() => {
            notification.classList.remove('translate-x-0');
            notification.classList.add('translate-x-full');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 5000);
    };

    // Add smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    console.log('Enhanced Login System loaded successfully');
    console.log('Default accounts initialized:', window.userManager.getAllUsers());
});