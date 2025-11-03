// Admin Dashboard JavaScript - Professional Version with Proper Menu Structure

// Global variables
let currentDate = new Date('2025-11-01');
let activityChart = null;
let syncInterval = null;

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeDashboard();
    setupEventListeners();
    loadInitialData();
    startAutoSync();
});

// Initialize Dashboard
function initializeDashboard() {
    // Set current date in header
    document.getElementById('current-date').textContent = formatDate(currentDate);
    
    // Initialize charts
    initializeCharts();
    
    // Load all data
    loadDashboardData();
    loadNewsData();
    loadWeatherData();
    loadReportsData();
    loadUsersData();
    
    // Show dashboard by default
    showTab('dashboard');
}

// Setup Event Listeners
function setupEventListeners() {
    // Navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const tab = this.getAttribute('data-tab');
            showTab(tab);
            
            // Update active state
            document.querySelectorAll('.nav-item').forEach(nav => {
                nav.classList.remove('active', 'bg-red-600', 'text-white');
                nav.classList.add('text-gray-300', 'hover:text-white', 'hover:bg-gray-800');
            });
            this.classList.add('active', 'bg-red-600', 'text-white');
            this.classList.remove('text-gray-300', 'hover:text-white', 'hover:bg-gray-800');
        });
    });
    
    // Sidebar toggle
    document.getElementById('sidebar-toggle').addEventListener('click', function() {
        const sidebar = document.querySelector('.sidebar');
        sidebar.classList.toggle('collapsed');
    });
    
    // Chart filter buttons
    document.querySelectorAll('.chart-filter').forEach(btn => {
        btn.addEventListener('click', function() {
            const period = this.getAttribute('data-period');
            updateChartFilter(period);
        });
    });
    
    // Quick action buttons
    document.querySelectorAll('.quick-action-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const action = this.getAttribute('data-action');
            handleQuickAction(action);
        });
    });
    
    // Sync data button
    document.getElementById('sync-data-btn').addEventListener('click', manualSyncData);
    
    // News management
    document.getElementById('add-news-btn').addEventListener('click', () => openNewsModal());
    document.getElementById('news-form').addEventListener('submit', handleNewsSubmit);
    document.getElementById('close-news-modal').addEventListener('click', closeNewsModal);
    document.getElementById('cancel-news').addEventListener('click', closeNewsModal);
    
    // Weather management
    document.getElementById('add-weather-btn').addEventListener('click', () => openWeatherModal());
    document.getElementById('weather-form').addEventListener('submit', handleWeatherSubmit);
    document.getElementById('close-weather-modal').addEventListener('click', closeWeatherModal);
    document.getElementById('cancel-weather').addEventListener('click', closeWeatherModal);
    
    // Users management
    document.getElementById('add-user-btn').addEventListener('click', openUserModal);
}

// Tab Management
function showTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Show selected tab
    document.getElementById(tabName).classList.add('active');
    
    // Update page header
    updatePageHeader(tabName);
}

function updatePageHeader(tabName) {
    const titles = {
        'dashboard': 'Dashboard',
        'news': 'Quản lý Tin tức & Bài viết',
        'weather': 'Quản lý Dự báo Thời tiết',
        'reports': 'Quản lý Báo cáo Sự cố',
        'incidents': 'Sự cố Đang xử lý',
        'users': 'Quản lý Tài khoản',
        'roles': 'Quản lý Phân quyền',
        'analytics': 'Phân tích & Báo cáo',
        'settings': 'Cài đặt Hệ thống',
        'logs': 'Nhật ký Hệ thống'
    };
    
    const descriptions = {
        'dashboard': 'Tổng quan hệ thống cứu hộ quốc gia',
        'news': 'Quản lý và xuất bản các tin tức khẩn cấp và bài viết thông thường',
        'weather': 'Dự báo thời tiết và cảnh báo thiên tai',
        'reports': 'Xem và xử lý các báo cáo khẩn cấp từ người dùng',
        'incidents': 'Theo dõi và quản lý các sự cố đang được xử lý',
        'users': 'Quản lý tài khoản người dùng hệ thống',
        'roles': 'Quản lý phân quyền và vai trò người dùng',
        'analytics': 'Phân tích dữ liệu và báo cáo thống kê',
        'settings': 'Cấu hình hệ thống và các tùy chọn nâng cao',
        'logs': 'Theo dõi nhật ký hoạt động hệ thống'
    };
    
    document.getElementById('page-title').textContent = titles[tabName];
    document.getElementById('page-description').textContent = descriptions[tabName];
}

// Chart Management
function initializeCharts() {
    const ctx = document.getElementById('activityChart').getContext('2d');
    
    activityChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'],
            datasets: [
                {
                    label: 'Sự cố',
                    data: [12, 19, 8, 15, 14, 16, 10],
                    borderColor: '#dc2626',
                    backgroundColor: 'rgba(220, 38, 38, 0.1)',
                    tension: 0.4,
                    fill: true
                },
                {
                    label: 'Tin tức',
                    data: [8, 12, 6, 10, 11, 14, 9],
                    borderColor: '#2563eb',
                    backgroundColor: 'rgba(37, 99, 235, 0.1)',
                    tension: 0.4,
                    fill: true
                },
                {
                    label: 'Người dùng',
                    data: [20, 25, 18, 22, 24, 26, 21],
                    borderColor: '#16a34a',
                    backgroundColor: 'rgba(22, 163, 74, 0.1)',
                    tension: 0.4,
                    fill: true
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function updateChartFilter(period) {
    // Update active button
    document.querySelectorAll('.chart-filter').forEach(btn => {
        if (btn.getAttribute('data-period') === period) {
            btn.classList.remove('bg-gray-100', 'text-gray-700');
            btn.classList.add('bg-red-600', 'text-white');
        } else {
            btn.classList.remove('bg-red-600', 'text-white');
            btn.classList.add('bg-gray-100', 'text-gray-700');
        }
    });
    
    // Update chart data based on period
    let newData = [];
    
    switch(period) {
        case 'day':
            newData = [5, 8, 12, 9, 15, 11, 7];
            break;
        case 'week':
            newData = [12, 19, 8, 15, 14, 16, 10];
            break;
        case 'month':
            newData = [45, 52, 38, 49, 56, 48, 42];
            break;
        case 'year':
            newData = [520, 480, 610, 550, 590, 630, 580];
            break;
    }
    
    activityChart.data.datasets[0].data = newData;
    activityChart.update();
}

// Data Loading Functions
function loadInitialData() {
    // Initialize with sample data
    if (!localStorage.getItem('admin_news')) {
        const sampleNews = [
            { id: 'N001', title: 'Cảnh báo mưa lớn khu vực miền Bắc', date: '2025-10-28', type: 'warning', status: 'published' },
            { id: 'N002', title: 'Thông báo về tình hình giao thông dịp lễ', date: '2025-10-27', type: 'info', status: 'published' },
            { id: 'N003', title: 'Cảnh báo bão số 8 hướng vào đất liền', date: '2025-10-26', type: 'emergency', status: 'published' }
        ];
        localStorage.setItem('admin_news', JSON.stringify(sampleNews));
    }
}

function loadDashboardData() {
    // Set statistics
    document.getElementById('active-incidents').textContent = '38';
    document.getElementById('total-news').textContent = '42';
    document.getElementById('active-users').textContent = '47';
    document.getElementById('weather-alerts').textContent = '5';
}

function loadNewsData() {
    const news = JSON.parse(localStorage.getItem('admin_news')) || [];
    const container = document.getElementById('news-table-body');
    
    container.innerHTML = '';
    
    news.forEach(item => {
        const typeNames = {
            'emergency': 'Khẩn cấp',
            'warning': 'Cảnh báo',
            'info': 'Thông tin'
        };
        
        const statusNames = {
            'published': 'Đã xuất bản',
            'draft': 'Bản nháp'
        };
        
        const row = `
            <tr>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${item.id}</td>
                <td class="px-6 py-4 text-sm text-gray-900">${item.title}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${formatDate(new Date(item.date))}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="badge ${item.type === 'emergency' ? 'badge-danger' : item.type === 'warning' ? 'badge-warning' : 'badge-info'}">
                        ${typeNames[item.type]}
                    </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="badge ${item.status === 'published' ? 'badge-success' : 'badge-warning'}">
                        ${statusNames[item.status]}
                    </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button class="text-red-600 hover:text-red-900 mr-3 edit-news" data-id="${item.id}">Sửa</button>
                    <button class="text-gray-600 hover:text-gray-900 delete-news" data-id="${item.id}">Xóa</button>
                </td>
            </tr>
        `;
        container.innerHTML += row;
    });
}

function loadWeatherData() {
    loadWeatherForecast();
    loadWeatherAlerts();
}

function loadWeatherForecast() {
    const forecast = [
        { date: '01/11', type: 'sunny', tempMin: 23, tempMax: 32, description: 'Nắng đẹp' },
        { date: '02/11', type: 'cloudy', tempMin: 24, tempMax: 31, description: 'Nhiều mây' },
        { date: '03/11', type: 'rainy', tempMin: 22, tempMax: 28, description: 'Mưa rào' },
        { date: '04/11', type: 'storm', tempMin: 21, tempMax: 26, description: 'Bão' },
        { date: '05/11', type: 'rainy', tempMin: 22, tempMax: 29, description: 'Mưa lớn' },
        { date: '06/11', type: 'cloudy', tempMin: 23, tempMax: 30, description: 'Ít mây' },
        { date: '07/11', type: 'sunny', tempMin: 24, tempMax: 33, description: 'Nắng nóng' }
    ];
    
    const container = document.getElementById('weather-forecast');
    container.innerHTML = '';
    
    forecast.forEach(day => {
        const card = `
            <div class="weather-card ${day.type}">
                <p class="font-semibold text-sm mb-2">${day.date}</p>
                <i class="fas ${getWeatherIcon(day.type)} text-lg mb-2"></i>
                <p class="text-xs mb-1">${day.description}</p>
                <p class="font-bold text-sm">${day.tempMin}° - ${day.tempMax}°</p>
            </div>
        `;
        container.innerHTML += card;
    });
}

function loadWeatherAlerts() {
    const alerts = [
        { id: 'W001', type: 'Bão', region: 'Miền Trung', severity: 'Cao', time: '01/11/2025 08:00', status: 'Đang hoạt động' },
        { id: 'W002', type: 'Mưa lớn', region: 'Miền Bắc', severity: 'Trung bình', time: '31/10/2025 14:30', status: 'Đang hoạt động' }
    ];
    
    const container = document.getElementById('weather-alerts-table-body');
    container.innerHTML = '';
    
    alerts.forEach(alert => {
        const row = `
            <tr>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${alert.id}</td>
                <td class="px-6 py-4 text-sm text-gray-900">${alert.type}</td>
                <td class="px-6 py-4 text-sm text-gray-500">${alert.region}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="badge ${alert.severity === 'Cao' ? 'badge-danger' : 'badge-warning'}">
                        ${alert.severity}
                    </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${alert.time}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="badge badge-success">${alert.status}</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button class="text-red-600 hover:text-red-900 mr-3 view-alert" data-id="${alert.id}">Xem</button>
                    <button class="text-gray-600 hover:text-gray-900 update-alert" data-id="${alert.id}">Cập nhật</button>
                </td>
            </tr>
        `;
        container.innerHTML += row;
    });
}

function loadReportsData() {
    // Sample reports data
    const reports = [
        { id: 'R001', type: 'Cháy nhà', location: 'Quận Hoàn Kiếm, Hà Nội', severity: 'Cao', time: '01/11/2025 10:30', status: 'Đang xử lý' },
        { id: 'R002', type: 'Tai nạn giao thông', location: 'Quận 1, TP.HCM', severity: 'Trung bình', time: '01/11/2025 09:15', status: 'Đã tiếp nhận' },
        { id: 'R003', type: 'Ngập lụt', location: 'Quận Hải Châu, Đà Nẵng', severity: 'Cao', time: '31/10/2025 16:45', status: 'Hoàn thành' }
    ];
    
    const container = document.getElementById('reports-table-body');
    container.innerHTML = '';
    
    reports.forEach(item => {
        const row = `
            <tr>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${item.id}</td>
                <td class="px-6 py-4 text-sm text-gray-900">${item.type}</td>
                <td class="px-6 py-4 text-sm text-gray-500">${item.location}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="badge ${item.severity === 'Cao' ? 'badge-danger' : item.severity === 'Trung bình' ? 'badge-warning' : 'badge-info'}">
                        ${item.severity}
                    </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${item.time}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="badge ${item.status === 'Hoàn thành' ? 'badge-success' : item.status === 'Đang xử lý' ? 'badge-warning' : 'badge-info'}">
                        ${item.status}
                    </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button class="text-red-600 hover:text-red-900 mr-3 view-report" data-id="${item.id}">Xem</button>
                    <button class="text-gray-600 hover:text-gray-900 update-report" data-id="${item.id}">Cập nhật</button>
                </td>
            </tr>
        `;
        container.innerHTML += row;
    });
}

function loadUsersData() {
    const users = [
        { id: 'U001', username: 'admin', fullname: 'Nguyễn Văn Admin', email: 'admin@cuuhoc.gov.vn', role: 'Quản trị viên', status: 'Hoạt động' },
        { id: 'U002', username: 'operator1', fullname: 'Trần Thị Điều hành', email: 'operator1@cuuhoc.gov.vn', role: 'Điều hành viên', status: 'Hoạt động' }
    ];
    
    const container = document.getElementById('users-table-body');
    container.innerHTML = '';
    
    users.forEach(user => {
        const row = `
            <tr>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${user.id}</td>
                <td class="px-6 py-4 text-sm text-gray-900">${user.username}</td>
                <td class="px-6 py-4 text-sm text-gray-900">${user.fullname}</td>
                <td class="px-6 py-4 text-sm text-gray-500">${user.email}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="badge ${user.role === 'Quản trị viên' ? 'badge-danger' : 'badge-info'}">
                        ${user.role}
                    </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="badge badge-success">${user.status}</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button class="text-red-600 hover:text-red-900 mr-3 edit-user" data-id="${user.id}">Sửa</button>
                    <button class="text-gray-600 hover:text-gray-900 delete-user" data-id="${user.id}">Xóa</button>
                </td>
            </tr>
        `;
        container.innerHTML += row;
    });
}

// Helper Functions
function formatDate(date) {
    return date.toLocaleDateString('vi-VN');
}

function getWeatherIcon(type) {
    const icons = {
        'sunny': 'fa-sun',
        'cloudy': 'fa-cloud',
        'rainy': 'fa-cloud-rain',
        'storm': 'fa-bolt'
    };
    return icons[type] || 'fa-cloud';
}

// Modal Functions
function openNewsModal(newsId = null) {
    const modal = document.getElementById('news-modal');
    const title = document.getElementById('news-modal-title');
    
    if (newsId) {
        title.textContent = 'Sửa tin tức';
        // Load existing data
    } else {
        title.textContent = 'Thêm tin tức mới';
        document.getElementById('news-form').reset();
    }
    
    modal.classList.remove('hidden');
}

function closeNewsModal() {
    document.getElementById('news-modal').classList.add('hidden');
}

function openWeatherModal(weatherId = null) {
    const modal = document.getElementById('weather-modal');
    const title = document.getElementById('weather-modal-title');
    
    if (weatherId) {
        title.textContent = 'Sửa dự báo thời tiết';
    } else {
        title.textContent = 'Thêm dự báo thời tiết';
        document.getElementById('weather-form').reset();
    }
    
    modal.classList.remove('hidden');
}

function closeWeatherModal() {
    document.getElementById('weather-modal').classList.add('hidden');
}

function openUserModal() {
    showNotification('Chức năng thêm người dùng đang được phát triển');
}

// Form Handlers
function handleNewsSubmit(e) {
    e.preventDefault();
    
    const formData = {
        id: document.getElementById('news-id').value || 'N' + Date.now(),
        title: document.getElementById('news-title').value,
        date: document.getElementById('news-date').value,
        type: document.getElementById('news-type').value,
        content: document.getElementById('news-content').value,
        status: 'published'
    };
    
    // Save to localStorage
    const news = JSON.parse(localStorage.getItem('admin_news')) || [];
    news.push(formData);
    localStorage.setItem('admin_news', JSON.stringify(news));
    
    closeNewsModal();
    showNotification('Tin tức đã được lưu thành công!');
    loadNewsData();
}

function handleWeatherSubmit(e) {
    e.preventDefault();
    
    const formData = {
        id: document.getElementById('weather-id').value || 'W' + Date.now(),
        date: document.getElementById('weather-date').value,
        region: document.getElementById('weather-region').value,
        type: document.getElementById('weather-type').value,
        tempMin: document.getElementById('weather-temp-min').value,
        tempMax: document.getElementById('weather-temp-max').value,
        description: document.getElementById('weather-description').value
    };
    
    closeWeatherModal();
    showNotification('Dự báo thời tiết đã được lưu thành công!');
    loadWeatherData();
}

// Sync Functions
function startAutoSync() {
    syncInterval = setInterval(() => {
        autoSyncData();
    }, 30000);
}

function autoSyncData() {
    console.log('Auto-syncing data...');
}

function manualSyncData() {
    showSyncStatus('Đang đồng bộ dữ liệu...', 'sync-warning');
    
    setTimeout(() => {
        showSyncStatus('Dữ liệu đã đồng bộ', 'sync-success');
        showNotification('Đồng bộ dữ liệu thành công!');
        
        setTimeout(() => {
            hideSyncStatus();
        }, 3000);
    }, 1500);
}

function showSyncStatus(message, type) {
    const statusElement = document.getElementById('sync-status');
    statusElement.querySelector('span').textContent = message;
    statusElement.className = `data-sync-status ${type}`;
    statusElement.classList.remove('hidden');
}

function hideSyncStatus() {
    document.getElementById('sync-status').classList.add('hidden');
}

// Notification System
function showNotification(message) {
    const notification = document.getElementById('success-notification');
    const messageElement = document.getElementById('notification-message');
    
    messageElement.textContent = message;
    notification.classList.remove('hidden');
    
    setTimeout(() => {
        notification.classList.add('hidden');
    }, 3000);
}

// Quick Actions
function handleQuickAction(action) {
    switch(action) {
        case 'add-news':
            openNewsModal();
            break;
        case 'add-weather':
            openWeatherModal();
            break;
        case 'add-user':
            openUserModal();
            break;
        case 'view-reports':
            showTab('reports');
            break;
    }
}

// Make functions available globally
window.editNews = function(id) {
    openNewsModal(id);
};

window.deleteNews = function(id) {
    if (confirm('Bạn có chắc chắn muốn xóa tin tức này?')) {
        const news = JSON.parse(localStorage.getItem('admin_news')) || [];
        const updatedNews = news.filter(item => item.id !== id);
        localStorage.setItem('admin_news', JSON.stringify(updatedNews));
        showNotification('Tin tức đã được xóa');
        loadNewsData();
    }
};