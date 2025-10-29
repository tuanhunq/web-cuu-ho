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

// Emergency Button Functionality
function initEmergencyButton() {
    const emergencyBtn = document.querySelector('.emergency-btn');
    
    if (emergencyBtn) {
        emergencyBtn.addEventListener('click', function(e) {
            // Check if user is logged in
            if (!isUserLoggedIn()) {
                e.preventDefault();
                showLoginModal();
                return;
            }
            
            // If logged in, proceed to emergency reporting
            // Additional emergency confirmation can be added here
            confirmEmergencyReport();
        });
    }
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
            // Mock API call - replace with actual API endpoint
            const response = await fetch('/api/incidents', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(filters)
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
    fetch('navbar.html')
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
    fetch('footer.html')
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
    fetch('navbar.html')
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
    fetch('footer.html')
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




//post.js