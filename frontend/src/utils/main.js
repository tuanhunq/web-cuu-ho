    // Main JavaScript for Emergency Rescue System

    // Initialize Feather Icons
    document.addEventListener('DOMContentLoaded', function() {
        feather.replace();
        
        // Initialize mobile menu
        initMobileMenu();
        
        // Initialize smooth scrolling
        initSmoothScrolling();
        
        // Initialize emergency button
        initEmergencyButton();
        
        // Update last update time
        updateLastUpdateTime();
    });

    // Mobile Menu Functionality
    function initMobileMenu() {
        const menuToggle = document.getElementById('menu-toggle');
        const mobileMenu = document.getElementById('mobile-menu');
        
        if (menuToggle && mobileMenu) {
            menuToggle.addEventListener('click', function() {
                mobileMenu.classList.toggle('hidden');
                // Update icon
                const icon = menuToggle.querySelector('i');
                if (icon) {
                    if (mobileMenu.classList.contains('hidden')) {
                        icon.setAttribute('data-feather', 'menu');
                    } else {
                        icon.setAttribute('data-feather', 'x');
                    }
                    feather.replace();
                }
            });
        }
    }

    // Smooth Scrolling for Navigation Links
    function initSmoothScrolling() {
        const navLinks = document.querySelectorAll('a[href^="#"]');
        
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    const offsetTop = targetElement.offsetTop - 80; // Adjust for fixed header
                    
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                    
                    // Close mobile menu if open
                    const mobileMenu = document.getElementById('mobile-menu');
                    if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                        mobileMenu.classList.add('hidden');
                        const menuToggle = document.getElementById('menu-toggle');
                        const icon = menuToggle.querySelector('i');
                        icon.setAttribute('data-feather', 'menu');
                        feather.replace();
                    }
                }
            });
        });
    }

   

    // Check if user is logged in (mock function)
    function isUserLoggedIn() {
        // In a real application, this would check authentication status
        return localStorage.getItem('userLoggedIn') === 'true';
    }

    // Show Login Modal
    function showLoginModal() {
        // Redirect to login page or show modal
        window.location.href = 'login.html';
    }

    // Confirm Emergency Report
    function confirmEmergencyReport() {
        const confirmed = confirm('Bạn có chắc chắn muốn báo cáo tình huống khẩn cấp? Đây là thao tác quan trọng, chỉ sử dụng trong trường hợp thực sự khẩn cấp.');
        
        if (confirmed) {
            // Proceed to emergency reporting page
            window.location.href = 'post.html?type=emergency';
        }
    }

    // Update Last Update Time
    function updateLastUpdateTime() {
        const lastUpdateElement = document.getElementById('last-update');
        if (lastUpdateElement) {
            const now = new Date();
            const timeString = now.toLocaleTimeString('vi-VN');
            lastUpdateElement.textContent = timeString;
        }
    }

    // Utility Functions
    function formatDate(date) {
        return new Date(date).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    function formatTimeAgo(date) {
        const now = new Date();
        const diffMs = now - new Date(date);
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);
        
        if (diffMins < 1) return 'Vừa xong';
        if (diffMins < 60) return `${diffMins} phút trước`;
        if (diffHours < 24) return `${diffHours} giờ trước`;
        if (diffDays < 7) return `${diffDays} ngày trước`;
        
        return formatDate(date);
    }

    // API Service Functions
    class ApiService {
        static async getIncidents(filters = {}) {
                try {
                    // Use reports endpoint for incidents
                    const qs = new URLSearchParams(filters).toString();
                    const url = qs ? `/api/reports?${qs}` : '/api/reports';
                    const response = await fetch(url, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });

                    if (!response.ok) {
                        throw new Error('Failed to fetch incidents');
                    }

                    return await response.json();
                } catch (error) {
                    console.error('Error fetching incidents:', error);
                    // Return mock data for demo
                    return this.getMockIncidents();
                }
            }
        
        static async getNews() {
            try {
                const response = await fetch('data/emergencies.json');
                if (!response.ok) {
                    throw new Error('Failed to fetch news');
                }
                return await response.json();
            } catch (error) {
                console.error('Error fetching news:', error);
                return [];
            }
        }
        
        static getMockIncidents() {
            // Return mock incident data for demo
            return {
                incidents: [
                    {
                        id: 1,
                        type: 'fire',
                        title: 'Cháy căn hộ chung cư',
                        location: 'Quận 1, TP.HCM',
                        coordinates: [10.7769, 106.7009],
                        status: 'active',
                        timestamp: new Date(Date.now() - 30 * 60000).toISOString(),
                        severity: 'high'
                    },
                    {
                        id: 2,
                        type: 'flood',
                        title: 'Ngập nước đường Nguyễn Huệ',
                        location: 'Quận 1, TP.HCM',
                        coordinates: [10.7730, 106.7030],
                        status: 'active',
                        timestamp: new Date(Date.now() - 45 * 60000).toISOString(),
                        severity: 'medium'
                    }
                ]
            };
        }
    }

    // Error Handling
    window.addEventListener('error', function(e) {
        console.error('Global error:', e.error);
        // You can add error reporting service here
    });

    // Service Worker Registration (for PWA)
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', function() {
            navigator.serviceWorker.register('/sw.js')
                .then(function(registration) {
                    console.log('ServiceWorker registration successful');
                })
                .catch(function(error) {
                    console.log('ServiceWorker registration failed: ', error);
                });
        });
    }

    // Export for use in other modules
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = { ApiService, formatDate, formatTimeAgo };
    }

    //map.html
    // Main Application Script
    document.addEventListener('DOMContentLoaded', function() {
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
            if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                if (!menuToggle.contains(event.target) && !mobileMenu.contains(event.target)) {
                    mobileMenu.classList.add('hidden');
                    const icon = menuToggle.querySelector('i');
                    icon.setAttribute('data-feather', 'menu');
                    feather.replace();
                }
            }
        });

        // Smooth scrolling for anchor links
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

        // Add loading states to buttons
        document.querySelectorAll('button').forEach(button => {
            if (button.type === 'submit') {
                button.addEventListener('click', function() {
                    if (this.form && this.form.checkValidity()) {
                        this.classList.add('loading');
                    }
                });
            }
        });

        // Form validation enhancements
        document.querySelectorAll('input, select, textarea').forEach(input => {
            input.addEventListener('blur', function() {
                this.classList.add('touched');
                validateField(this);
            });

            input.addEventListener('input', function() {
                if (this.classList.contains('touched')) {
                    validateField(this);
                }
            });
        });

        // Password strength indicator
        const passwordInputs = document.querySelectorAll('input[type="password"]');
        passwordInputs.forEach(input => {
            input.addEventListener('input', function() {
                if (this.value.length > 0) {
                    this.classList.add('has-value');
                } else {
                    this.classList.remove('has-value');
                }
            });
        });

        // Auto-hide alerts
        const alerts = document.querySelectorAll('.alert');
        alerts.forEach(alert => {
            if (!alert.classList.contains('alert-persistent')) {
                setTimeout(() => {
                    alert.style.display = 'none';
                }, 5000);
            }
        });

        // Add fade-in animation to elements
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in-visible');
                }
            });
        }, observerOptions);

        // Observe elements with fade-in class
        document.querySelectorAll('.fade-in').forEach(el => {
            observer.observe(el);
        });

        // Enhanced error handling
        window.addEventListener('error', function(e) {
            console.error('Application error:', e.error);
            // You can add error reporting here
        });

        // Performance monitoring
        if ('performance' in window) {
            window.addEventListener('load', function() {
                const perfData = performance.timing;
                const loadTime = perfData.loadEventEnd - perfData.navigationStart;
                console.log('Page load time:', loadTime + 'ms');
            });
        }
    });

    // Field validation function
    function validateField(field) {
        const value = field.value.trim();
        const isValid = field.checkValidity();

        if (isValid) {
            field.classList.remove('error');
            field.classList.add('success');
        } else {
            field.classList.remove('success');
            field.classList.add('error');
        }

        return isValid;
    }

    // Utility function for API calls
    async function apiCall(url, options = {}) {
        try {
            const response = await fetch(url, {
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                },
                ...options
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('API call failed:', error);
            throw error;
        }
    }

    // Local storage utilities
    const Storage = {
        set: function(key, value) {
            try {
                localStorage.setItem(key, JSON.stringify(value));
                return true;
            } catch (error) {
                console.error('Storage set failed:', error);
                return false;
            }
        },

        get: function(key, defaultValue = null) {
            try {
                const item = localStorage.getItem(key);
                return item ? JSON.parse(item) : defaultValue;
            } catch (error) {
                console.error('Storage get failed:', error);
                return defaultValue;
            }
        },

        remove: function(key) {
            try {
                localStorage.removeItem(key);
                return true;
            } catch (error) {
                console.error('Storage remove failed:', error);
                return false;
            }
        },

        clear: function() {
            try {
                localStorage.clear();
                return true;
            } catch (error) {
                console.error('Storage clear failed:', error);
                return false;
            }
        }
    };


    //login
    // Date formatting utilities
    const DateUtils = {
        format: function(date, format = 'dd/MM/yyyy') {
            const d = new Date(date);
            const day = d.getDate().toString().padStart(2, '0');
            const month = (d.getMonth() + 1).toString().padStart(2, '0');
            const year = d.getFullYear();
            const hours = d.getHours().toString().padStart(2, '0');
            const minutes = d.getMinutes().toString().padStart(2, '0');

            return format
                .replace('dd', day)
                .replace('MM', month)
                .replace('yyyy', year)
                .replace('HH', hours)
                .replace('mm', minutes);
        },

        relativeTime: function(date) {
            const now = new Date();
            const diffMs = now - new Date(date);
            const diffMins = Math.floor(diffMs / 60000);
            const diffHours = Math.floor(diffMs / 3600000);
            const diffDays = Math.floor(diffMs / 86400000);

            if (diffMins < 1) return 'Vừa xong';
            if (diffMins < 60) return `${diffMins} phút trước`;
            if (diffHours < 24) return `${diffHours} giờ trước`;
            if (diffDays < 7) return `${diffDays} ngày trước`;
            
            return this.format(date, 'dd/MM/yyyy');
        }
    };

    // Export for use in other modules
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = { Storage, DateUtils, apiCall };
    }


    // map.js
    // Khởi tạo Feather Icons
    feather.replace();

    // Mobile menu toggle
    document.getElementById('menu-toggle')?.addEventListener('click', function() {
        const menu = document.getElementById('mobile-menu');
        menu.classList.toggle('hidden');
        
        const isHidden = menu.classList.contains('hidden');
        this.innerHTML = isHidden ? feather.icons.menu.toSvg() : feather.icons.x.toSvg();
    });

    // Load navbar và footer
    function loadNavbarAndFooter() {
    // Load navbar
    fetch('/src/components/navbar.html')
            .then(response => response.text())
            .then(data => {
                document.getElementById('navbar-container').innerHTML = data;
                feather.replace();
                
                // Re-attach event listener after loading
                document.getElementById('menu-toggle')?.addEventListener('click', function() {
                    const menu = document.getElementById('mobile-menu');
                    menu.classList.toggle('hidden');
                    
                    const isHidden = menu.classList.contains('hidden');
                    this.innerHTML = isHidden ? feather.icons.menu.toSvg() : feather.icons.x.toSvg();
                });
            })
            .catch(error => console.error('Error loading navbar:', error));

    // Load footer
    fetch('/src/components/footer.html')
            .then(response => response.text())
            .then(data => {
                document.getElementById('footer-container').innerHTML = data;
                feather.replace();
            })
            .catch(error => console.error('Error loading footer:', error));
    }

    // Hàm timeAgo (đồng bộ với news.html)
    // Khởi tạo Feather Icons
    feather.replace();

    // Mobile menu toggle
    document.getElementById('menu-toggle')?.addEventListener('click', function() {
        const menu = document.getElementById('mobile-menu');
        menu.classList.toggle('hidden');
        
        const isHidden = menu.classList.contains('hidden');
        this.innerHTML = isHidden ? feather.icons.menu.toSvg() : feather.icons.x.toSvg();
    });

    // Load navbar và footer
    function loadNavbarAndFooter() {
    // Load navbar
    fetch('/src/components/navbar.html')
            .then(response => response.text())
            .then(data => {
                document.getElementById('navbar-container').innerHTML = data;
                feather.replace();
                
                // Re-attach event listener after loading
                document.getElementById('menu-toggle')?.addEventListener('click', function() {
                    const menu = document.getElementById('mobile-menu');
                    menu.classList.toggle('hidden');
                    
                    const isHidden = menu.classList.contains('hidden');
                    this.innerHTML = isHidden ? feather.icons.menu.toSvg() : feather.icons.x.toSvg();
                });
            })
            .catch(error => console.error('Error loading navbar:', error));

    // Load footer
    fetch('/src/components/footer.html')
            .then(response => response.text())
            .then(data => {
                document.getElementById('footer-container').innerHTML = data;
                feather.replace();
            })
            .catch(error => console.error('Error loading footer:', error));
    }

    // Hàm timeAgo (đồng bộ với news.html)
    function timeAgo(dateString) {
        const now = new Date();
        const date = new Date(dateString);
        const seconds = Math.floor((now - date) / 1000);
        
        let interval = Math.floor(seconds / 31536000);
        if (interval > 1) return `${interval} năm trước`;
        interval = Math.floor(seconds / 2592000);
        if (interval > 1) return `${interval} tháng trước`;
        interval = Math.floor(seconds / 86400);
        if (interval > 1) return `${interval} ngày trước`;
        interval = Math.floor(seconds / 3600);
        if (interval > 1) return `${interval} giờ trước`;
        interval = Math.floor(seconds / 60);
        if (interval > 1) return `${interval} phút trước`;
        return "Vừa xong";
    }

    // Hàm hỗ trợ chuyển đổi
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN') + ' ' + date.toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'});
    }

    function formatTime(dateString) {
        const date = new Date(dateString);
        return date.toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'});
    }

    // Khởi tạo khi trang load
    document.addEventListener('DOMContentLoaded', function() {
        loadNavbarAndFooter();
    });




    //request.html// Main JavaScript for common functionality across all pages

    // Mobile menu functionality
    document.addEventListener('DOMContentLoaded', function() {
        // Mobile menu toggle
        const menuToggle = document.getElementById('menu-toggle');
        const mobileMenu = document.getElementById('mobile-menu');
        
        if (menuToggle && mobileMenu) {
            menuToggle.addEventListener('click', function() {
                mobileMenu.classList.toggle('hidden');
            });
        }

        // Close mobile menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!event.target.closest('nav') && !mobileMenu.classList.contains('hidden')) {
                mobileMenu.classList.add('hidden');
            }
        });

        // Initialize Feather icons
        if (typeof feather !== 'undefined') {
            feather.replace();
        }

        // Smooth scrolling for anchor links
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

        // Add active class to current page in navigation
        const currentPage = window.location.pathname.split('/').pop();
        document.querySelectorAll('.nav-link').forEach(link => {
            const linkHref = link.getAttribute('href');
            if (linkHref === currentPage || (currentPage === '' && linkHref === 'index.html')) {
                link.classList.add('text-red-500', 'font-bold');
                link.classList.remove('text-gray-700', 'hover:text-red-500');
            }
        });
    });

    // Utility functions
    const Utils = {
        // Format date
        formatDate: (dateString) => {
            const options = { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            };
            return new Date(dateString).toLocaleDateString('vi-VN', options);
        },

        // Debounce function for search inputs
        debounce: (func, wait) => {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        },

        // Show notification
        showNotification: (message, type = 'info') => {
            // Implementation for showing notifications
            console.log(`${type.toUpperCase()}: ${message}`);
        }
    };




    //login+index đăng nhập-đăng xuất
    // Main Application Script
    class MainApp {
        constructor() {
            this.currentUser = null;
            this.init();
        }

        init() {
            this.loadCurrentUser();
            this.updateNavigation();
            this.bindEvents();
            
            // Kiểm tra chuyển hướng sau khi đăng nhập
            this.checkRedirectAfterLogin();
            
            feather.replace();
        }

        loadCurrentUser() {
            const userData = localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser');
            if (userData) {
                this.currentUser = JSON.parse(userData);
            }
        }

        updateNavigation() {
            const loginButton = document.querySelector('a[href="login.html"]');
            const mobileLoginButton = document.querySelector('#mobile-menu a[href="login.html"]');
            
            if (this.currentUser) {
                // Thay thế nút đăng nhập bằng thông tin user và nút đăng xuất
                if (loginButton) {
                    loginButton.innerHTML = `
                        <div class="flex items-center space-x-2">
                            <div class="flex items-center space-x-2">
                                <div class="w-8 h-8 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                                    ${this.getUserInitials()}
                                </div>
                                <span class="text-gray-700 font-medium">${this.currentUser.fullname}</span>
                            </div>
                            <button id="logout-btn" class="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 rounded-lg font-medium transition-all text-sm">
                                Đăng xuất
                            </button>
                        </div>
                    `;
                    loginButton.href = "#";
                    loginButton.classList.remove('bg-gradient-to-r', 'from-red-500', 'to-orange-500', 'hover:from-red-600', 'hover:to-orange-600', 'text-white');
                    loginButton.classList.add('bg-transparent', 'hover:bg-transparent');
                }

                // Cập nhật mobile menu
                if (mobileLoginButton) {
                    mobileLoginButton.innerHTML = `
                        <div class="flex items-center justify-between w-full">
                            <div class="flex items-center space-x-2">
                                <div class="w-6 h-6 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                    ${this.getUserInitials()}
                                </div>
                                <span>${this.currentUser.fullname}</span>
                            </div>
                            <button id="mobile-logout-btn" class="text-red-600 font-medium text-sm">
                                Đăng xuất
                            </button>
                        </div>
                    `;
                    mobileLoginButton.href = "#";
                    mobileLoginButton.classList.remove('text-white', 'bg-red-600');
                    mobileLoginButton.classList.add('text-gray-700', 'bg-transparent');
                }

                // Thêm sự kiện cho nút đăng xuất
                this.bindLogoutEvents();

                // Thêm nút vào Dashboard nếu user có quyền
                this.addDashboardLinks();
            }
        }

        checkRedirectAfterLogin() {
            if (this.currentUser) {
                const urlParams = new URLSearchParams(window.location.search);
                const loginSuccess = urlParams.get('login') === 'success';
                
                if (loginSuccess) {
                    // Nếu đăng nhập thành công và user có quyền admin/rescuer, chuyển hướng đến dashboard
                    if (this.shouldRedirectToDashboard()) {
                        this.showLoginSuccessMessage();
                        
                        setTimeout(() => {
                            this.redirectToDashboard();
                        }, 2000);
                    } else {
                        // Nếu là viewer, hiển thị thông báo đăng nhập thành công
                        this.showLoginSuccessMessage('Đăng nhập thành công!', false);
                    }
                }
            }
        }

        shouldRedirectToDashboard() {
            if (!this.currentUser) return false;
            
            return this.currentUser.role === 'admin' || 
                ['rescuer', 'moderator', 'coordinator'].includes(this.currentUser.role);
        }

        redirectToDashboard() {
            if (this.currentUser.role === 'admin') {
                window.location.href = 'admin-dashboard.html';
            } else {
                window.location.href = 'rescuer-dashboard.html';
            }
        }

        showLoginSuccessMessage(message = null, showRedirect = true) {
            const successMessage = message || 'Đăng nhập thành công! Đang chuyển hướng đến trang quản trị...';
            
            const toast = document.createElement('div');
            toast.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transform translate-x-full transition-transform duration-300';
            toast.innerHTML = `
                <div class="flex items-center space-x-2">
                    <i data-feather="check-circle" class="w-5 h-5"></i>
                    <span>${successMessage}</span>
                </div>
            `;
            document.body.appendChild(toast);

            // Hiển thị toast
            setTimeout(() => {
                toast.classList.remove('translate-x-full');
            }, 100);

            // Ẩn toast sau 3s
            setTimeout(() => {
                toast.classList.add('translate-x-full');
                setTimeout(() => {
                    if (document.body.contains(toast)) {
                        document.body.removeChild(toast);
                    }
                }, 300);
            }, 3000);

            feather.replace();
        }

        addDashboardLinks() {
            // Thêm link đến dashboard trong navigation nếu user có quyền
            if (this.shouldRedirectToDashboard()) {
                const navLinks = document.querySelector('.hidden.md\\:flex.items-center.space-x-8');
                const mobileMenu = document.getElementById('mobile-menu');
                
                if (navLinks) {
                    const dashboardLink = document.createElement('a');
                    dashboardLink.href = this.currentUser.role === 'admin' ? 'admin-dashboard.html' : 'rescuer-dashboard.html';
                    dashboardLink.className = 'nav-link text-gray-700 hover:text-red-500 font-medium transition';
                    dashboardLink.innerHTML = `
                        <i data-feather="layout" class="w-4 h-4 mr-1 inline"></i>
                        Dashboard
                    `;
                    
                    // Chèn trước nút đăng nhập
                    const loginButton = navLinks.querySelector('a[href="login.html"]');
                    if (loginButton) {
                        navLinks.insertBefore(dashboardLink, loginButton);
                    }
                }

                // Thêm vào mobile menu
                if (mobileMenu) {
                    const mobileDashboardLink = document.createElement('a');
                    mobileDashboardLink.href = this.currentUser.role === 'admin' ? 'admin-dashboard.html' : 'rescuer-dashboard.html';
                    mobileDashboardLink.className = 'block py-2 text-gray-700 hover:text-red-600 transition flex items-center';
                    mobileDashboardLink.innerHTML = `
                        <i data-feather="layout" class="w-4 h-4 mr-2"></i>
                        Dashboard
                    `;
                    
                    // Chèn trước nút đăng nhập trong mobile menu
                    const mobileLoginButton = mobileMenu.querySelector('a[href="login.html"]');
                    if (mobileLoginButton) {
                        mobileMenu.insertBefore(mobileDashboardLink, mobileLoginButton);
                    }
                }

                feather.replace();
            }
        }

        getUserInitials() {
            if (!this.currentUser || !this.currentUser.fullname) return 'U';
            return this.currentUser.fullname
                .split(' ')
                .map(word => word[0])
                .join('')
                .toUpperCase()
                .substring(0, 2);
        }

        bindLogoutEvents() {
            // Desktop logout
            const logoutBtn = document.getElementById('logout-btn');
            if (logoutBtn) {
                logoutBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    this.logout();
                });
            }

            // Mobile logout
            const mobileLogoutBtn = document.getElementById('mobile-logout-btn');
            if (mobileLogoutBtn) {
                mobileLogoutBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    this.logout();
                });
            }

            // Ngăn sự kiện click trên toàn bộ phần tử login
            const loginButton = document.querySelector('a[href="login.html"]');
            if (loginButton && this.currentUser) {
                loginButton.addEventListener('click', (e) => {
                    e.preventDefault();
                });
            }
        }

        bindEvents() {
            // Menu toggle for mobile
            const menuToggle = document.getElementById('menu-toggle');
            const mobileMenu = document.getElementById('mobile-menu');
            
            if (menuToggle && mobileMenu) {
                menuToggle.addEventListener('click', () => {
                    mobileMenu.classList.toggle('hidden');
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
            document.addEventListener('click', (e) => {
                if (mobileMenu && !mobileMenu.contains(e.target) && menuToggle && !menuToggle.contains(e.target)) {
                    mobileMenu.classList.add('hidden');
                    const icon = menuToggle.querySelector('i');
                    icon.setAttribute('data-feather', 'menu');
                    feather.replace();
                }
            });

            // Xử lý scroll cho navbar
            this.handleNavbarScroll();
        }

        handleNavbarScroll() {
            const navbar = document.getElementById('navbar');
            if (!navbar) return;

            window.addEventListener('scroll', () => {
                if (window.scrollY > 0) {
                    navbar.classList.add('bg-white', 'shadow-md');
                    navbar.classList.remove('bg-transparent');
                } else {
                    navbar.classList.remove('bg-white', 'shadow-md');
                    navbar.classList.add('bg-transparent');
                }
            });

            // Khởi tạo ban đầu
            if (window.scrollY === 0) {
                navbar.classList.add('bg-transparent');
                navbar.classList.remove('bg-white', 'shadow-md');
            }
        }

        logout() {
            // Xóa thông tin user
            localStorage.removeItem('currentUser');
            sessionStorage.removeItem('currentUser');
            this.currentUser = null;

            // Hiển thị thông báo
            this.showLogoutMessage();

            // Reload page để cập nhật UI
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        }

        showLogoutMessage() {
            // Tạo toast message
            const toast = document.createElement('div');
            toast.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transform translate-x-full transition-transform duration-300';
            toast.innerHTML = `
                <div class="flex items-center space-x-2">
                    <i data-feather="check-circle" class="w-5 h-5"></i>
                    <span>Đã đăng xuất thành công</span>
                </div>
            `;
            document.body.appendChild(toast);

            // Hiển thị toast
            setTimeout(() => {
                toast.classList.remove('translate-x-full');
            }, 100);

            // Ẩn toast sau 3s
            setTimeout(() => {
                toast.classList.add('translate-x-full');
                setTimeout(() => {
                    if (document.body.contains(toast)) {
                        document.body.removeChild(toast);
                    }
                }, 300);
            }, 3000);

            feather.replace();
        }

        // Kiểm tra quyền truy cập cho các trang
        checkAccess(requiredRole = null) {
            if (!this.currentUser) {
                window.location.href = 'login.html';
                return false;
            }

            if (requiredRole && this.currentUser.role !== requiredRole) {
                this.showAccessDenied();
                return false;
            }

            return true;
        }

        showAccessDenied() {
            alert('Bạn không có quyền truy cập trang này!');
            window.location.href = 'index.html';
        }

        // Lấy thông tin user hiện tại
        getCurrentUser() {
            return this.currentUser;
        }

        // Kiểm tra đã đăng nhập chưa
        isLoggedIn() {
            return this.currentUser !== null;
        }

        // Lấy role của user
        getUserRole() {
            return this.currentUser ? this.currentUser.role : null;
        }

        // Phương thức tiện ích để kiểm tra role
        isAdmin() {
            return this.currentUser && this.currentUser.role === 'admin';
        }

        isRescuer() {
            return this.currentUser && ['rescuer', 'moderator', 'coordinator'].includes(this.currentUser.role);
        }

        isViewer() {
            return this.currentUser && this.currentUser.role === 'viewer';
        }
    }

    // Khởi tạo ứng dụng
    let mainApp;

    document.addEventListener('DOMContentLoaded', function() {
        mainApp = new MainApp();
        
        // Cập nhật feather icons
        feather.replace();
    });

    // Khởi tạo ứng dụng






    // header
    window.addEventListener('scroll', function() {
            const navbar = document.getElementById('navbar');
            const heroSection = document.querySelector('.hero-section');
            const heroHeight = heroSection.offsetHeight;
            
            if (window.scrollY > heroHeight * 0.1) {
                navbar.classList.add('bg-white', 'shadow-md');
                navbar.classList.remove('bg-transparent');
            } else {
                navbar.classList.remove('bg-white', 'shadow-md');
                navbar.classList.add('bg-transparent');
            }
        });

        // Khởi tạo ban đầu - đảm bảo header trong suốt
        document.addEventListener('DOMContentLoaded', function() {
            const navbar = document.getElementById('navbar');
            navbar.classList.add('bg-transparent');
            navbar.classList.remove('bg-white', 'shadow-md');
        });




    // form đăng ký
    document.addEventListener('DOMContentLoaded', function() {
        // Khởi tạo Feather Icons
        if (typeof feather !== 'undefined') {
            feather.replace();
        }
        
        // Xử lý form đăng ký
        const registrationForm = document.getElementById('rescue-registration-form');
        const successMessage = document.getElementById('success-message');
        
        if (registrationForm) {
            registrationForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // Thu thập dữ liệu form
                const formData = new FormData(registrationForm);
                const data = {
                    fullname: formData.get('fullname'),
                    phone: formData.get('phone'),
                    email: formData.get('email'),
                    id_number: formData.get('id_number'),
                    province: formData.get('province'),
                    district: formData.get('district'),
                    address: formData.get('address'),
                    role: formData.get('role'),
                    experience: formData.get('experience'),
                    equipment: formData.getAll('equipment'),
                    agreement: formData.get('agreement')
                };
                
                // Gửi dữ liệu đến admin (ở đây chỉ mô phỏng)
                console.log('Dữ liệu đăng ký:', data);
                
                // Hiển thị thông báo thành công
                if (successMessage) {
                    successMessage.classList.remove('hidden');
                    registrationForm.reset();
                    
                    // Cuộn đến thông báo thành công
                    successMessage.scrollIntoView({ behavior: 'smooth' });
                }
                
                // Ở đây bạn có thể thêm code để gửi dữ liệu đến server
                // fetch('/api/register-rescuer', {
                //     method: 'POST',
                //     headers: {
                //         'Content-Type': 'application/json',
                //     },
                //     body: JSON.stringify(data)
                // })
                // .then(response => response.json())
                // .then(data => {
                //     console.log('Success:', data);
                //     successMessage.classList.remove('hidden');
                //     registrationForm.reset();
                //     successMessage.scrollIntoView({ behavior: 'smooth' });
                // })
                // .catch((error) => {
                //     console.error('Error:', error);
                //     alert('Có lỗi xảy ra khi gửi đăng ký. Vui lòng thử lại.');
                // });
            });
        }
    });







    // chuyển trang của index 
    // Hàm xử lý khi click vào service card
function filterByIncidentType(incidentType) {
    // Lưu loại sự cố vào localStorage để trang map có thể đọc
    localStorage.setItem('selectedIncidentType', incidentType);
    
    // Chuyển hướng đến trang map
    window.location.href = 'pages/map.html';
}

// Hàm áp dụng bộ lọc khi trang map được tải
function applyIncidentFilter() {
    const selectedType = localStorage.getItem('selectedIncidentType');
    
    if (selectedType) {
        // Tìm dropdown loại sự cố và chọn giá trị tương ứng
        const typeFilter = document.getElementById('type-filter');
        if (typeFilter) {
            // Map loại sự cố từ service card sang giá trị trong dropdown
            const typeMapping = {
                'disaster': 'disaster',
                'fire': 'fire', 
                'accident': 'accident',
                'medical': 'medical' // Cần thêm option 'medical' vào dropdown nếu chưa có
            };
            
            const filterValue = typeMapping[selectedType] || selectedType;
            typeFilter.value = filterValue;
            
            // Kích hoạt sự kiện change để áp dụng bộ lọc
            const event = new Event('change');
            typeFilter.dispatchEvent(event);
            
            // Cuộn đến phần bản đồ
            setTimeout(() => {
                document.getElementById('incident-map').scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
            }, 500);
        }
        
        // Xóa bộ lọc đã lưu sau khi áp dụng
        localStorage.removeItem('selectedIncidentType');
    }
}

// Gọi hàm này khi trang map được tải
if (window.location.pathname.includes('map.html')) {
    document.addEventListener('DOMContentLoaded', applyIncidentFilter);
}







// Xử lý tab switching cho panel
document.addEventListener('DOMContentLoaded', function() {
    // Tab switching
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            
            // Remove active class from all tabs
            tabButtons.forEach(btn => {
                btn.classList.remove('border-red-500', 'text-red-500');
                btn.classList.add('text-gray-500');
            });
            
            // Hide all tab contents
            tabContents.forEach(content => {
                content.classList.remove('active');
                content.classList.add('hidden');
            });
            
            // Activate current tab
            this.classList.add('border-red-500', 'text-red-500');
            this.classList.remove('text-gray-500');
            
            // Show target content
            const targetContent = document.getElementById(targetTab);
            targetContent.classList.remove('hidden');
            targetContent.classList.add('active');
        });
    });
    
    // Filter by incident type from service cards
    document.querySelectorAll('.service-card').forEach(card => {
        card.addEventListener('click', function() {
            const incidentType = this.getAttribute('data-incident-type');
            filterByIncidentType(incidentType);
        });
    });
    
    // Reset filters
    document.getElementById('reset-filters').addEventListener('click', function() {
        document.getElementById('province-filter').value = 'all';
        document.getElementById('type-filter').value = 'all';
        resetAllFilters();
    });
});

function filterByIncidentType(type) {
    console.log('Filtering by incident type:', type);
    // Logic filter sẽ được thêm sau
    // Cập nhật select box
    document.getElementById('type-filter').value = type;
    
    // Filter markers trên map
    // filterMapMarkers(type);
}

function resetAllFilters() {
    console.log('Resetting all filters');
    // Reset map view
    // resetMapView();
}




// Hàm chuyển hướng đến trang map với filter
function filterByIncidentType(type) {
    // Lưu loại sự cố vào localStorage
    localStorage.setItem('selectedIncidentType', type);
    
    // Chuyển hướng đến trang map
    window.location.href = 'pages/map.html';
}

// Xử lý khi trang load
document.addEventListener('DOMContentLoaded', function() {
    // Thêm sự kiện click cho các service card
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.addEventListener('click', function() {
            const incidentType = this.getAttribute('data-incident-type');
            filterByIncidentType(incidentType);
        });
    });

    // Khởi tạo feather icons
    if (typeof feather !== 'undefined') {
        feather.replace();
    }
});











// Enhanced Video Controller Class
class VideoController {
    constructor() {
        this.backgroundVideo = document.getElementById('background-video');
        this.modalVideo = document.getElementById('modal-video');
        this.videoModal = document.getElementById('video-modal');
        this.muteButton = document.getElementById('video-mute');
        this.expandButton = document.getElementById('video-expand');
        this.closeModalButton = document.getElementById('close-video-modal');
        this.isMuted = true;
        this.isLoading = false;
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.setupVideo();
        this.addLoadingState();
    }

    bindEvents() {
        // Mute/Unmute toggle
        if (this.muteButton) {
            this.muteButton.addEventListener('click', () => this.toggleMute());
        }

        // Expand to modal
        if (this.expandButton) {
            this.expandButton.addEventListener('click', () => this.expandVideo());
        }

        // Close modal
        if (this.closeModalButton) {
            this.closeModalButton.addEventListener('click', () => this.closeModal());
        }

        // Close modal on background click
        if (this.videoModal) {
            this.videoModal.addEventListener('click', (e) => {
                if (e.target === this.videoModal) {
                    this.closeModal();
                }
            });
        }

        // Close modal on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !this.videoModal.classList.contains('hidden')) {
                this.closeModal();
            }
        });

        // Video event listeners
        if (this.backgroundVideo) {
            this.backgroundVideo.addEventListener('loadstart', () => this.showLoading());
            this.backgroundVideo.addEventListener('canplay', () => this.hideLoading());
            this.backgroundVideo.addEventListener('ended', () => this.handleVideoEnded());
            this.backgroundVideo.addEventListener('error', () => this.handleVideoError());
        }
    }

    addLoadingState() {
        if (this.backgroundVideo) {
            const videoContainer = this.backgroundVideo.parentElement;
            const loadingDiv = document.createElement('div');
            loadingDiv.className = 'video-loading hidden';
            loadingDiv.innerHTML = '<div class="video-loading-spinner"></div>';
            videoContainer.style.position = 'relative';
            videoContainer.appendChild(loadingDiv);
        }
    }

    showLoading() {
        this.isLoading = true;
        const loadingElement = document.querySelector('.video-loading');
        if (loadingElement) {
            loadingElement.classList.remove('hidden');
        }
    }

    hideLoading() {
        this.isLoading = false;
        const loadingElement = document.querySelector('.video-loading');
        if (loadingElement) {
            loadingElement.classList.add('hidden');
        }
    }

    setupVideo() {
        if (this.backgroundVideo) {
            this.backgroundVideo.muted = true;
            this.backgroundVideo.loop = true;
            this.backgroundVideo.preload = "auto";
            
            this.playVideo().catch(error => {
                console.log('Video autoplay failed:', error);
                this.showFallbackContent();
            });
        }
    }

    async playVideo() {
        if (this.backgroundVideo) {
            try {
                await this.backgroundVideo.play();
                // Add quality indicator after video starts playing
                this.addQualityIndicator();
            } catch (error) {
                this.showPlayButton();
                throw error;
            }
        }
    }

    addQualityIndicator() {
        const videoContainer = this.backgroundVideo.parentElement;
        const qualityDiv = document.createElement('div');
        qualityDiv.className = 'video-quality';
        qualityDiv.textContent = 'HD';
        videoContainer.appendChild(qualityDiv);
    }

    toggleMute() {
        if (this.backgroundVideo) {
            this.backgroundVideo.muted = !this.backgroundVideo.muted;
            this.isMuted = this.backgroundVideo.muted;
            
            const icon = this.muteButton.querySelector('i');
            if (icon) {
                icon.setAttribute('data-feather', this.isMuted ? 'volume-x' : 'volume-2');
                feather.replace();
            }
        }
    }

    expandVideo() {
        if (this.backgroundVideo && this.modalVideo && this.videoModal) {
            this.modalVideo.src = this.backgroundVideo.src;
            this.modalVideo.muted = false;
            this.modalVideo.controls = true;
            this.modalVideo.currentTime = this.backgroundVideo.currentTime;
            
            this.videoModal.classList.remove('hidden');
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
            
            this.modalVideo.play().catch(console.error);
            this.backgroundVideo.pause();
        }
    }

    closeModal() {
        if (this.videoModal) {
            this.videoModal.classList.add('hidden');
            document.body.style.overflow = ''; // Restore scrolling
            
            if (this.modalVideo) {
                this.modalVideo.pause();
                // Sync current time back to background video
                if (this.backgroundVideo) {
                    this.backgroundVideo.currentTime = this.modalVideo.currentTime;
                }
            }
            
            if (this.backgroundVideo) {
                this.backgroundVideo.play().catch(console.error);
            }
        }
    }

    handleVideoEnded() {
        if (this.backgroundVideo) {
            this.backgroundVideo.currentTime = 0;
            this.backgroundVideo.play().catch(console.error);
        }
    }

    handleVideoError() {
        console.error('Video loading error');
        this.showFallbackContent();
    }

    showFallbackContent() {
        const videoContainer = document.querySelector('.video-container');
        if (videoContainer) {
            videoContainer.innerHTML = `
                <div class="bg-black bg-opacity-80 rounded-xl p-4 shadow-2xl backdrop-blur-sm border border-white border-opacity-20">
                    <div class="w-80 h-52 rounded-lg bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center text-white relative">
                        <div class="text-center">
                            <i data-feather="video" class="w-12 h-12 mx-auto mb-3 text-red-400"></i>
                            <p class="text-sm font-semibold">Đang tải video cứu hộ</p>
                            <p class="text-xs text-gray-300 mt-1">Vui lòng chờ trong giây lát...</p>
                        </div>
                        <div class="absolute -top-3 -left-3 bg-red-500 text-white text-sm px-3 py-1 rounded-full font-semibold shadow-lg">
                            <i data-feather="refresh-cw" class="w-3 h-3 inline mr-1 animate-spin"></i>
                            ĐANG TẢI
                        </div>
                    </div>
                </div>
            `;
            feather.replace();
            
            // Try to reload after 5 seconds
            setTimeout(() => {
                if (this.backgroundVideo) {
                    this.backgroundVideo.load();
                    this.backgroundVideo.play().catch(console.error);
                }
            }, 5000);
        }
    }

    showPlayButton() {
        const videoContainer = document.querySelector('.video-container');
        if (videoContainer) {
            const playOverlay = document.createElement('div');
            playOverlay.className = 'absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center rounded-lg cursor-pointer transition-all duration-300 hover:bg-opacity-60';
            playOverlay.innerHTML = `
                <div class="text-center">
                    <div class="bg-red-500 hover:bg-red-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 transform hover:scale-110 transition-transform">
                        <i data-feather="play" class="w-8 h-8 text-white"></i>
                    </div>
                    <p class="text-white text-sm font-semibold">Nhấn để phát video</p>
                </div>
            `;
            playOverlay.addEventListener('click', () => {
                this.backgroundVideo.play();
                playOverlay.remove();
            });
            
            const videoWrapper = videoContainer.querySelector('div');
            videoWrapper.style.position = 'relative';
            videoWrapper.appendChild(playOverlay);
            feather.replace();
        }
    }
}

// Initialize video controller
document.addEventListener('DOMContentLoaded', function() {
    if (document.querySelector('.hero-section')) {
        window.videoController = new VideoController();
    }
});