document.addEventListener("DOMContentLoaded", () => {
    // Mobile menu toggle
    document.getElementById('menu-toggle').addEventListener('click', function() {
        const menu = document.getElementById('mobile-menu');
        menu.classList.toggle('hidden');
        
        // Change icon based on state
        const isHidden = menu.classList.contains('hidden');
        this.innerHTML = isHidden ? feather.icons.menu.toSvg() : feather.icons.x.toSvg();
        feather.replace();
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            if (this.getAttribute('href') !== '#login') {
                e.preventDefault();
                
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
                
                // Close mobile menu if open
                const mobileMenu = document.getElementById('mobile-menu');
                if (!mobileMenu.classList.contains('hidden')) {
                    mobileMenu.classList.add('hidden');
                    document.getElementById('menu-toggle').innerHTML = feather.icons.menu.toSvg();
                    feather.replace();
                }
            }
        });
    });
});





// login 
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
                            password: this.hashPassword("admin123"),
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
                            password: this.hashPassword("mod123"),
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
                            password: this.hashPassword("user123"),
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
                    password: this.hashPassword(userData.password),
                    fullname: userData.fullname,
                    email: userData.email,
                    role: userData.role,
                    organization: userData.organization || '',
                    status: "active",
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
                    'admin': ["news", "reports", "respond", "users"],
                    'moderator': ["news", "reports", "respond"],
                    'rescuer': ["reports", "respond"],
                    'viewer': ["reports"]
                };
                return permissions[role] || ["reports"];
            },

            // Authenticate user with security features
            authenticate: function(username, password) {
                const users = this.getUsers();
                const user = users.find(u => u.username === username && u.status === 'active');
                
                if (!user) {
                    return { success: false, message: "Tên đăng nhập không tồn tại" };
                }

                // Check if account is locked
                if (user.lockedUntil && new Date() < new Date(user.lockedUntil)) {
                    const lockTime = Math.ceil((new Date(user.lockedUntil) - new Date()) / 60000);
                    return { 
                        success: false, 
                        message: `Tài khoản bị khóa tạm thời. Vui lòng thử lại sau ${lockTime} phút.` 
                    };
                }

                // Verify password
                if (user.password === this.hashPassword(password)) {
                    // Reset login attempts and update last login
                    user.loginAttempts = 0;
                    user.lockedUntil = null;
                    user.lastLogin = new Date().toISOString();
                    localStorage.setItem('systemUsers', JSON.stringify(users));
                    
                    // Store current user session
                    localStorage.setItem('currentUser', JSON.stringify(user));
                    return { success: true, user: user };
                } else {
                    // Increment login attempts
                    user.loginAttempts = (user.loginAttempts || 0) + 1;
                    
                    // Lock account after 5 failed attempts for 30 minutes
                    if (user.loginAttempts >= 5) {
                        user.lockedUntil = new Date(Date.now() + 30 * 60 * 1000).toISOString();
                    }
                    
                    localStorage.setItem('systemUsers', JSON.stringify(users));
                    
                    const attemptsLeft = 5 - user.loginAttempts;
                    if (attemptsLeft > 0) {
                        return { 
                            success: false, 
                            message: `Mật khẩu không đúng. Còn ${attemptsLeft} lần thử.` 
                        };
                    } else {
                        return { 
                            success: false, 
                            message: "Tài khoản đã bị khóa tạm thời do quá nhiều lần đăng nhập thất bại." 
                        };
                    }
                }
            },

            // Get current user
            getCurrentUser: function() {
                return JSON.parse(localStorage.getItem('currentUser'));
            },

            // Logout user
            logout: function() {
                localStorage.removeItem('currentUser');
            },

            // Check if user is logged in
            isLoggedIn: function() {
                return localStorage.getItem('currentUser') !== null;
            }
        };

        // Enhanced password strength checker
        function checkPasswordStrength(password) {
            const validation = SecurityManager.validatePassword(password);
            return validation.strength;
        }

        // Update password strength indicator with requirements
        function updatePasswordStrength(password) {
            const validation = SecurityManager.validatePassword(password);
            const bar = document.getElementById('password-strength-bar');
            const strength = validation.strength;
            
            // Reset bar
            bar.className = 'password-strength-bar';
            
            if (password.length === 0) {
                bar.style.width = '0%';
                // Reset all requirements to unmet
                document.querySelectorAll('.requirement').forEach(req => {
                    req.className = 'requirement unmet';
                    req.querySelector('i').setAttribute('data-feather', 'circle');
                });
                feather.replace();
                return;
            }
            
            // Update strength bar
            switch(strength) {
                case 1:
                    bar.classList.add('strength-weak');
                    break;
                case 2:
                case 3:
                    bar.classList.add('strength-medium');
                    break;
                case 4:
                    bar.classList.add('strength-strong');
                    break;
                case 5:
                    bar.classList.add('strength-very-strong');
                    break;
            }
            
            // Update requirement indicators
            const requirements = validation.requirements;
            document.getElementById('req-length').className = requirements.length ? 'requirement met' : 'requirement unmet';
            document.getElementById('req-lowercase').className = requirements.lowercase ? 'requirement met' : 'requirement unmet';
            document.getElementById('req-uppercase').className = requirements.uppercase ? 'requirement met' : 'requirement unmet';
            document.getElementById('req-number').className = requirements.number ? 'requirement met' : 'requirement unmet';
            document.getElementById('req-special').className = requirements.special ? 'requirement met' : 'requirement unmet';
            
            // Update icons
            document.querySelectorAll('.requirement.met i').forEach(icon => {
                icon.setAttribute('data-feather', 'check-circle');
            });
            document.querySelectorAll('.requirement.unmet i').forEach(icon => {
                icon.setAttribute('data-feather', 'circle');
            });
            feather.replace();
        }

        // Form validation functions
        function validateField(field, value) {
            let isValid = true;
            let errorMessage = '';

            switch(field) {
                case 'reg-fullname':
                    if (!value.trim()) {
                        errorMessage = 'Họ và tên không được để trống';
                        isValid = false;
                    } else if (!SecurityManager.validateFullname(value)) {
                        errorMessage = 'Họ và tên phải từ 2 đến 50 ký tự';
                        isValid = false;
                    }
                    break;
                    
                case 'reg-username':
                    if (!value.trim()) {
                        errorMessage = 'Tên đăng nhập không được để trống';
                        isValid = false;
                    } else if (!SecurityManager.validateUsername(value)) {
                        errorMessage = 'Tên đăng nhập phải từ 3-20 ký tự và chỉ chứa chữ cái, số và dấu gạch dưới';
                        isValid = false;
                    } else if (UserManager.usernameExists(value)) {
                        errorMessage = 'Tên đăng nhập đã tồn tại';
                        isValid = false;
                    }
                    break;
                    
                case 'reg-email':
                    if (!value.trim()) {
                        errorMessage = 'Email không được để trống';
                        isValid = false;
                    } else if (!SecurityManager.validateEmail(value)) {
                        errorMessage = 'Email không hợp lệ';
                        isValid = false;
                    } else if (UserManager.emailExists(value)) {
                        errorMessage = 'Email đã được sử dụng';
                        isValid = false;
                    }
                    break;
                    
                case 'reg-password':
                    if (!value) {
                        errorMessage = 'Mật khẩu không được để trống';
                        isValid = false;
                    } else if (value.length < 8) {
                        errorMessage = 'Mật khẩu phải có ít nhất 8 ký tự';
                        isValid = false;
                    } else {
                        const validation = SecurityManager.validatePassword(value);
                        if (validation.strength < 3) {
                            errorMessage = 'Mật khẩu không đủ mạnh';
                            isValid = false;
                        }
                    }
                    break;
                    
                case 'reg-confirm-password':
                    const password = document.getElementById('reg-password').value;
                    if (!value) {
                        errorMessage = 'Vui lòng xác nhận mật khẩu';
                        isValid = false;
                    } else if (value !== password) {
                        errorMessage = 'Mật khẩu xác nhận không khớp';
                        isValid = false;
                    }
                    break;
                    
                case 'reg-role':
                    if (!value) {
                        errorMessage = 'Vui lòng chọn vai trò';
                        isValid = false;
                    }
                    break;
            }

            return { isValid, errorMessage };
        }

        // DOM Elements
        const loginForm = document.getElementById('login-form');
        const registerForm = document.getElementById('register-form');
        const loginAlert = document.getElementById('login-alert');
        const alertMessage = document.getElementById('alert-message');
        const formTabs = document.querySelectorAll('.form-tab');
        const formContents = document.querySelectorAll('.form-content');
        const switchToRegister = document.querySelector('.switch-to-register');
        const switchToLogin = document.querySelector('.switch-to-login');

        // Initialize the application
        document.addEventListener('DOMContentLoaded', function() {
            // Initialize default users
            UserManager.initUsers();
            
            // Check if user is already logged in
            if (UserManager.isLoggedIn()) {
                // Redirect to admin page if already logged in
                window.location.href = 'admin.html';
            }
            
            // Initialize feather icons
            feather.replace();
            
            // Tab switching
            formTabs.forEach(tab => {
                tab.addEventListener('click', function() {
                    const tabName = this.getAttribute('data-tab');
                    
                    // Update active tab
                    formTabs.forEach(t => t.classList.remove('active'));
                    this.classList.add('active');
                    
                    // Update active form
                    formContents.forEach(content => {
                        content.classList.remove('active');
                        if (content.id === `${tabName}-form`) {
                            content.classList.add('active');
                        }
                    });
                    
                    // Reset alerts and forms
                    hideAlert();
                    resetFormValidation();
                });
            });

            // Switch between login and register
            switchToRegister.addEventListener('click', function(e) {
                e.preventDefault();
                formTabs[1].click();
            });

            switchToLogin.addEventListener('click', function(e) {
                e.preventDefault();
                formTabs[0].click();
            });

            // Password strength indicator
            document.getElementById('reg-password').addEventListener('input', function() {
                updatePasswordStrength(this.value);
                validateField('reg-password', this.value);
            });

            // Real-time validation for form fields
            const registerFields = ['reg-fullname', 'reg-username', 'reg-email', 'reg-password', 'reg-confirm-password', 'reg-role'];
            registerFields.forEach(fieldId => {
                const field = document.getElementById(fieldId);
                if (field) {
                    field.addEventListener('blur', function() {
                        const validation = validateField(fieldId, this.value);
                        showFieldError(fieldId, validation.errorMessage, validation.isValid);
                    });
                    
                    field.addEventListener('input', function() {
                        // Clear error on input
                        if (this.value.trim()) {
                            hideFieldError(fieldId);
                        }
                    });
                }
            });

            // Toggle password visibility
            document.querySelectorAll('.toggle-password').forEach(button => {
                button.addEventListener('click', function() {
                    const targetId = this.getAttribute('data-target');
                    const passwordInput = document.getElementById(targetId);
                    const icon = this.querySelector('i');
                    
                    if (passwordInput.type === 'password') {
                        passwordInput.type = 'text';
                        icon.setAttribute('data-feather', 'eye-off');
                    } else {
                        passwordInput.type = 'password';
                        icon.setAttribute('data-feather', 'eye');
                    }
                    feather.replace();
                });
            });

            // Login form submission
            loginForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const username = document.getElementById('username').value;
                const password = document.getElementById('password').value;
                
                // Basic validation
                if (!username || !password) {
                    showAlert('Vui lòng điền đầy đủ thông tin đăng nhập', 'error');
                    return;
                }
                
                // Show loading state
                setLoadingState('login', true);
                
                // Simulate API call delay
                setTimeout(() => {
                    const authResult = UserManager.authenticate(username, password);
                    
                    if (authResult.success) {
                        // Show success message
                        showAlert('Đăng nhập thành công! Đang chuyển hướng...', 'success');
                        
                        // Redirect to admin page after 1 second
                        setTimeout(() => {
                            window.location.href = 'admin.html';
                        }, 1000);
                    } else {
                        showAlert(authResult.message, 'error');
                        setLoadingState('login', false);
                    }
                }, 1000);
            });

            // Register form submission
            registerForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const fullname = document.getElementById('reg-fullname').value;
                const username = document.getElementById('reg-username').value;
                const email = document.getElementById('reg-email').value;
                const password = document.getElementById('reg-password').value;
                const confirmPassword = document.getElementById('reg-confirm-password').value;
                const role = document.getElementById('reg-role').value;
                const organization = document.getElementById('reg-organization').value;
                const acceptTerms = document.getElementById('accept-terms').checked;
                
                // Validate all fields
                let isValid = true;
                const fields = [
                    { id: 'reg-fullname', value: fullname },
                    { id: 'reg-username', value: username },
                    { id: 'reg-email', value: email },
                    { id: 'reg-password', value: password },
                    { id: 'reg-confirm-password', value: confirmPassword },
                    { id: 'reg-role', value: role }
                ];
                
                fields.forEach(field => {
                    const validation = validateField(field.id, field.value);
                    if (!validation.isValid) {
                        showFieldError(field.id, validation.errorMessage, false);
                        isValid = false;
                    } else {
                        hideFieldError(field.id);
                    }
                });
                
                // Validate terms acceptance
                if (!acceptTerms) {
                    showFieldError('accept-terms', 'Vui lòng đồng ý với Điều khoản dịch vụ và Chính sách bảo mật', false);
                    isValid = false;
                } else {
                    hideFieldError('accept-terms');
                }
                
                if (!isValid) {
                    showAlert('Vui lòng kiểm tra lại thông tin đăng ký', 'error');
                    return;
                }
                
                // Show loading state
                setLoadingState('register', true);
                
                // Simulate API call delay
                setTimeout(() => {
                    // Register new user
                    const newUser = UserManager.registerUser({
                        fullname,
                        username,
                        email,
                        password,
                        role,
                        organization
                    });
                    
                    showAlert('Đăng ký thành công! Vui lòng đăng nhập.', 'success');
                    setLoadingState('register', false);
                    
                    // Switch to login form after 2 seconds
                    setTimeout(() => {
                        formTabs[0].click();
                        loginForm.reset();
                        registerForm.reset();
                        document.getElementById('password-strength-bar').style.width = '0%';
                        resetFormValidation();
                    }, 2000);
                }, 1000);
            });

            // Mobile menu toggle
            document.getElementById('menu-toggle').addEventListener('click', function() {
                const menu = document.getElementById('mobile-menu');
                menu.classList.toggle('hidden');
                
                // Change icon based on state
                const isHidden = menu.classList.contains('hidden');
                this.innerHTML = isHidden ? feather.icons.menu.toSvg() : feather.icons.x.toSvg();
                feather.replace();
            });
        });

        // Show alert message
        function showAlert(message, type) {
            alertMessage.textContent = message;
            loginAlert.className = `alert alert-${type}`;
            loginAlert.style.display = 'flex';
            
            // Update icon based on alert type
            const icon = loginAlert.querySelector('i');
            if (type === 'error') {
                icon.setAttribute('data-feather', 'alert-circle');
            } else {
                icon.setAttribute('data-feather', 'check-circle');
            }
            feather.replace();
        }

        // Hide alert
        function hideAlert() {
            loginAlert.style.display = 'none';
        }

        // Show field error
        function showFieldError(fieldId, message, isValid) {
            const errorElement = document.getElementById(`${fieldId}-error`);
            const inputElement = document.getElementById(fieldId);
            
            if (errorElement && inputElement) {
                if (!isValid && message) {
                    errorElement.textContent = message;
                    errorElement.style.display = 'block';
                    inputElement.classList.add('error');
                    inputElement.classList.remove('success');
                } else {
                    errorElement.style.display = 'none';
                    inputElement.classList.remove('error');
                    inputElement.classList.add('success');
                }
            }
        }

        // Hide field error
        function hideFieldError(fieldId) {
            const errorElement = document.getElementById(`${fieldId}-error`);
            const inputElement = document.getElementById(fieldId);
            
            if (errorElement && inputElement) {
                errorElement.style.display = 'none';
                inputElement.classList.remove('error', 'success');
            }
        }

        // Reset form validation
        function resetFormValidation() {
            const errorElements = document.querySelectorAll('.error-message');
            const inputElements = document.querySelectorAll('.form-input');
            
            errorElements.forEach(el => el.style.display = 'none');
            inputElements.forEach(el => el.classList.remove('error', 'success'));
        }

        // Set loading state
        function setLoadingState(formType, isLoading) {
            const btn = document.getElementById(`${formType}-btn`);
            const spinner = document.getElementById(`${formType}-spinner`);
            const text = document.getElementById(`${formType}-text`);
            const icon = btn.querySelector('i[data-feather]');
            
            if (isLoading) {
                spinner.style.display = 'block';
                icon.style.display = 'none';
                text.textContent = 'Đang xử lý...';
                btn.disabled = true;
            } else {
                spinner.style.display = 'none';
                icon.style.display = 'inline-block';
                text.textContent = formType === 'login' ? 'Đăng Nhập' : 'Đăng Ký Tài Khoản';
                btn.disabled = false;
                feather.replace();
            }
        }

        // Auto-logout after 30 minutes of inactivity
        let inactivityTimer;
        function resetInactivityTimer() {
            clearTimeout(inactivityTimer);
            inactivityTimer = setTimeout(() => {
                if (UserManager.isLoggedIn()) {
                    UserManager.logout();
                    showAlert('Phiên đăng nhập đã hết hạn do không hoạt động', 'error');
                }
            }, 30 * 60 * 1000); // 30 minutes
        }

        // Reset timer on user activity
        document.addEventListener('mousemove', resetInactivityTimer);
        document.addEventListener('keypress', resetInactivityTimer);
        document.addEventListener('click', resetInactivityTimer);

        // Initialize timer
        resetInactivityTimer();