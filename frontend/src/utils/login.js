// Authentication System
class AuthSystem {
    constructor() {
        this.currentUser = null;
        this.init();
    }

    init() {
        this.loadCurrentUser();
        this.bindEvents();
        this.updateUI();
    }

    bindEvents() {
        // Login form submission
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }

        // Register form submission
        const registerForm = document.getElementById('register-form');
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => this.handleRegister(e));
        }

        // Tab switching
        const loginTab = document.querySelector('[data-tab="login"]');
        const registerTab = document.querySelector('[data-tab="register"]');
        const switchToRegisterLinks = document.querySelectorAll('.switch-to-register');
        const switchToLoginLinks = document.querySelectorAll('.switch-to-login');

        if (loginTab) loginTab.addEventListener('click', () => this.switchTab('login'));
        if (registerTab) registerTab.addEventListener('click', () => this.switchTab('register'));
        switchToRegisterLinks.forEach(link => link.addEventListener('click', (e) => {
            e.preventDefault();
            this.switchTab('register');
        }));
        switchToLoginLinks.forEach(link => link.addEventListener('click', (e) => {
            e.preventDefault();
            this.switchTab('login');
        }));

        // Password toggle
        document.querySelectorAll('.toggle-password').forEach(button => {
            button.addEventListener('click', (e) => this.togglePassword(e));
        });

        // Real-time password validation
        const passwordInput = document.getElementById('reg-password');
        if (passwordInput) {
            passwordInput.addEventListener('input', (e) => this.validatePasswordStrength(e.target.value));
        }

        // Real-time form validation
        this.setupRealTimeValidation();
    }

    setupRealTimeValidation() {
        // Username validation
        const usernameInput = document.getElementById('reg-username');
        if (usernameInput) {
            usernameInput.addEventListener('blur', () => this.validateUsername());
        }

        // Email validation
        const emailInput = document.getElementById('reg-email');
        if (emailInput) {
            emailInput.addEventListener('blur', () => this.validateEmail());
        }

        // Fullname validation
        const fullnameInput = document.getElementById('reg-fullname');
        if (fullnameInput) {
            fullnameInput.addEventListener('blur', () => this.validateFullname());
        }

        // Confirm password validation
        const confirmPasswordInput = document.getElementById('reg-confirm-password');
        if (confirmPasswordInput) {
            confirmPasswordInput.addEventListener('blur', () => this.validateConfirmPassword());
        }
    }

    async handleLogin(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const rememberMe = document.getElementById('remember-me').checked;

        // Show loading state
        this.setLoadingState('login', true);

        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        const result = UserManager.authenticate(username, password);

        if (result.success) {
            this.login(result.user, rememberMe);
        } else {
            this.showAlert(result.message, 'error');
            this.setLoadingState('login', false);
        }
    }

    async handleRegister(e) {
        e.preventDefault();
        
        const formData = {
            fullname: document.getElementById('reg-fullname').value,
            username: document.getElementById('reg-username').value,
            email: document.getElementById('reg-email').value,
            password: document.getElementById('reg-password').value,
            confirmPassword: document.getElementById('reg-confirm-password').value,
            role: document.getElementById('reg-role').value,
            organization: document.getElementById('reg-organization').value,
            acceptTerms: document.getElementById('accept-terms').checked
        };

        // Validate form
        if (!this.validateRegistration(formData)) {
            return;
        }

        // Show loading state
        this.setLoadingState('register', true);

        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        try {
            const newUser = UserManager.registerUser(formData);
            this.showAlert('Đăng ký thành công! Tài khoản của bạn đang chờ được kích hoạt.', 'success');
            
            // Switch to login tab after successful registration
            setTimeout(() => {
                this.switchTab('login');
                this.setLoadingState('register', false);
                // Pre-fill username
                document.getElementById('username').value = formData.username;
            }, 2000);

        } catch (error) {
            this.showAlert('Có lỗi xảy ra khi đăng ký. Vui lòng thử lại.', 'error');
            this.setLoadingState('register', false);
        }
    }

    validateRegistration(formData) {
        let isValid = true;

        // Reset all errors
        this.clearAllErrors();

        // Validate fullname
        if (!SecurityManager.validateFullname(formData.fullname)) {
            this.showError('reg-fullname', 'Họ và tên phải từ 2 đến 50 ký tự');
            isValid = false;
        }

        // Validate username
        if (!SecurityManager.validateUsername(formData.username)) {
            this.showError('reg-username', 'Tên đăng nhập phải từ 3-20 ký tự và chỉ chứa chữ cái, số và dấu gạch dưới');
            isValid = false;
        } else if (UserManager.usernameExists(formData.username)) {
            this.showError('reg-username', 'Tên đăng nhập đã tồn tại');
            isValid = false;
        }

        // Validate email
        if (!SecurityManager.validateEmail(formData.email)) {
            this.showError('reg-email', 'Email không hợp lệ');
            isValid = false;
        } else if (UserManager.emailExists(formData.email)) {
            this.showError('reg-email', 'Email đã được sử dụng');
            isValid = false;
        }

        // Validate password
        const passwordValidation = SecurityManager.validatePassword(formData.password);
        if (passwordValidation.strength < 3) {
            this.showError('reg-password', 'Mật khẩu không đủ mạnh');
            isValid = false;
        }

        // Validate confirm password
        if (formData.password !== formData.confirmPassword) {
            this.showError('reg-confirm-password', 'Mật khẩu xác nhận không khớp');
            isValid = false;
        }

        // Validate role
        if (!formData.role) {
            this.showError('reg-role', 'Vui lòng chọn vai trò');
            isValid = false;
        }

        // Validate terms
        if (!formData.acceptTerms) {
            this.showError('accept-terms', 'Bạn phải đồng ý với điều khoản dịch vụ');
            isValid = false;
        }

        return isValid;
    }

    validateUsername() {
        const username = document.getElementById('reg-username').value;
        const errorElement = document.getElementById('reg-username-error');
        
        if (!username) return;

        if (!SecurityManager.validateUsername(username)) {
            this.showError('reg-username', 'Tên đăng nhập phải từ 3-20 ký tự và chỉ chứa chữ cái, số và dấu gạch dưới');
        } else if (UserManager.usernameExists(username)) {
            this.showError('reg-username', 'Tên đăng nhập đã tồn tại');
        } else {
            this.showSuccess('reg-username');
        }
    }

    validateEmail() {
        const email = document.getElementById('reg-email').value;
        const errorElement = document.getElementById('reg-email-error');
        
        if (!email) return;

        if (!SecurityManager.validateEmail(email)) {
            this.showError('reg-email', 'Email không hợp lệ');
        } else if (UserManager.emailExists(email)) {
            this.showError('reg-email', 'Email đã được sử dụng');
        } else {
            this.showSuccess('reg-email');
        }
    }

    validateFullname() {
        const fullname = document.getElementById('reg-fullname').value;
        
        if (!fullname) return;

        if (!SecurityManager.validateFullname(fullname)) {
            this.showError('reg-fullname', 'Họ và tên phải từ 2 đến 50 ký tự');
        } else {
            this.showSuccess('reg-fullname');
        }
    }

    validateConfirmPassword() {
        const password = document.getElementById('reg-password').value;
        const confirmPassword = document.getElementById('reg-confirm-password').value;
        
        if (!confirmPassword) return;

        if (password !== confirmPassword) {
            this.showError('reg-confirm-password', 'Mật khẩu xác nhận không khớp');
        } else {
            this.showSuccess('reg-confirm-password');
        }
    }

    validatePasswordStrength(password) {
        const validation = SecurityManager.validatePassword(password);
        const strengthBar = document.getElementById('password-strength-bar');
        const requirements = {
            length: document.getElementById('req-length'),
            lowercase: document.getElementById('req-lowercase'),
            uppercase: document.getElementById('req-uppercase'),
            number: document.getElementById('req-number'),
            special: document.getElementById('req-special')
        };

        // Update strength bar
        strengthBar.className = 'password-strength-bar';
        if (password.length === 0) {
            strengthBar.style.width = '0%';
        } else {
            const strengthClasses = ['strength-weak', 'strength-medium', 'strength-strong', 'strength-very-strong'];
            strengthBar.classList.add(strengthClasses[Math.min(validation.strength - 1, 3)]);
        }

        // Update requirements
        Object.keys(requirements).forEach(key => {
            const element = requirements[key];
            if (element) {
                if (validation.requirements[key]) {
                    element.classList.add('met');
                    element.classList.remove('unmet');
                    element.querySelector('i').setAttribute('data-feather', 'check-circle');
                } else {
                    element.classList.add('unmet');
                    element.classList.remove('met');
                    element.querySelector('i').setAttribute('data-feather', 'circle');
                }
            }
        });

        feather.replace();
    }

    login(user, rememberMe = false) {
        this.currentUser = user;
        
        // Store user session
        if (rememberMe) {
            localStorage.setItem('currentUser', JSON.stringify(user));
        } else {
            sessionStorage.setItem('currentUser', JSON.stringify(user));
        }

        // Update UI
        this.updateUI();

        // Show success message and redirect
        this.showAlert(`Đăng nhập thành công! Chào mừng ${user.fullname}`, 'success');
        
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    }

    logout() {
        this.currentUser = null;
        localStorage.removeItem('currentUser');
        sessionStorage.removeItem('currentUser');
        this.updateUI();
        
        // Redirect to login page
        window.location.href = 'login.html';
    }

    loadCurrentUser() {
        const userData = localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser');
        if (userData) {
            this.currentUser = JSON.parse(userData);
        }
    }

    isLoggedIn() {
        return this.currentUser !== null;
    }

    updateUI() {
        // This will be implemented in main.js for navigation updates
    }

    switchTab(tabName) {
        // Update tabs
        document.querySelectorAll('.form-tab').forEach(tab => {
            tab.classList.toggle('active', tab.dataset.tab === tabName);
        });

        // Update forms
        document.querySelectorAll('.form-content').forEach(form => {
            form.classList.toggle('active', form.id === `${tabName}-form`);
        });

        // Clear form and errors when switching tabs
        this.clearAllErrors();
        this.hideAlert();

        if (tabName === 'login') {
            document.getElementById('login-form').reset();
        } else {
            document.getElementById('register-form').reset();
            this.validatePasswordStrength('');
        }
    }

    togglePassword(e) {
        const button = e.currentTarget;
        const targetId = button.dataset.target;
        const passwordInput = document.getElementById(targetId);
        const icon = button.querySelector('i');

        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            icon.setAttribute('data-feather', 'eye-off');
        } else {
            passwordInput.type = 'password';
            icon.setAttribute('data-feather', 'eye');
        }
        feather.replace();
    }

    setLoadingState(formType, isLoading) {
        const button = document.getElementById(`${formType}-btn`);
        const spinner = document.getElementById(`${formType}-spinner`);
        const text = document.getElementById(`${formType}-text`);

        if (isLoading) {
            button.disabled = true;
            spinner.style.display = 'block';
            text.textContent = formType === 'login' ? 'Đang đăng nhập...' : 'Đang đăng ký...';
        } else {
            button.disabled = false;
            spinner.style.display = 'none';
            text.textContent = formType === 'login' ? 'Đăng Nhập' : 'Đăng Ký Tài Khoản';
        }
    }

    showAlert(message, type = 'error') {
        const alert = document.getElementById('login-alert');
        const messageElement = document.getElementById('alert-message');

        alert.className = `alert alert-${type}`;
        messageElement.textContent = message;
        alert.style.display = 'flex';

        // Auto hide success messages
        if (type === 'success') {
            setTimeout(() => {
                this.hideAlert();
            }, 5000);
        }
    }

    hideAlert() {
        const alert = document.getElementById('login-alert');
        alert.style.display = 'none';
    }

    showError(fieldId, message) {
        const input = document.getElementById(fieldId);
        const errorElement = document.getElementById(`${fieldId}-error`);

        if (input && errorElement) {
            input.classList.add('error');
            input.classList.remove('success');
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }
    }

    showSuccess(fieldId) {
        const input = document.getElementById(fieldId);
        const errorElement = document.getElementById(`${fieldId}-error`);

        if (input && errorElement) {
            input.classList.remove('error');
            input.classList.add('success');
            errorElement.style.display = 'none';
        }
    }

    clearAllErrors() {
        document.querySelectorAll('.error-message').forEach(el => {
            el.style.display = 'none';
        });
        document.querySelectorAll('.form-input').forEach(el => {
            el.classList.remove('error', 'success');
        });
    }
}

// Initialize authentication system
let authSystem;

document.addEventListener('DOMContentLoaded', function() {
    authSystem = new AuthSystem();
});




//request.js// Login functionality
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            // Basic validation
            if (!email || !password) {
                alert('Vui lòng điền đầy đủ thông tin đăng nhập');
                return;
            }
            
            // Simulate login process
            console.log('Login attempt:', { email, password });
            
            // Here you would typically make an API call
            // For demo purposes, we'll just redirect
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1000);
        });
    }
});