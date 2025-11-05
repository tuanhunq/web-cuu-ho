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
      // Initialize reports management
    setupReportsManagement();
    loadReportsData();
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
    
    document.getElementById('add-report-btn').addEventListener('click', () => openReportModal());

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































//báo cáo sự cố
// Enhanced Reports Management JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Extended reports data with more diverse incidents
    const reportsData = [
        // Fire incidents
        {
            id: 'RPT001',
            title: 'Cháy nhà dân tại Quận 1',
            type: 'fire',
            location: '123 Nguyễn Huệ, Quận 1, TP.HCM',
            priority: 'high',
            time: '2025-01-15 10:30',
            status: 'processing',
            reporter: 'Nguyễn Văn A',
            phone: '0901234567',
            description: 'Cháy bùng phát từ tầng 2, đang lan rộng. Đã có 2 người bị thương.',
            casualties: 2,
            severity: 'medium',
            region: 'south',
            assignedTeam: 'Đội PCCC Quận 1'
        },
        {
            id: 'RPT002',
            title: 'Cháy chung cư cao tầng',
            type: 'fire',
            location: 'Chung cư Sunrise, Quận 7, TP.HCM',
            priority: 'critical',
            time: '2025-01-14 22:15',
            status: 'processing',
            reporter: 'Trần Thị B',
            phone: '0912345678',
            description: 'Cháy tại tầng hầm để xe, khói lan lên các tầng cao.',
            casualties: 0,
            severity: 'high',
            region: 'south',
            assignedTeam: 'Đội PCCC Quận 7'
        },
        
        // Flood incidents
        {
            id: 'RPT003',
            title: 'Ngập lụt đường Nguyễn Văn Linh',
            type: 'flood',
            location: 'Đường Nguyễn Văn Linh, Quận 7, TP.HCM',
            priority: 'medium',
            time: '2025-01-15 09:15',
            status: 'pending',
            reporter: 'Lê Văn C',
            phone: '0923456789',
            description: 'Ngập sâu 0.5m, nhiều xe bị chết máy.',
            casualties: 0,
            severity: 'low',
            region: 'south',
            assignedTeam: 'Đội cứu hộ đô thị'
        },
        {
            id: 'RPT004',
            title: 'Ngập lụt khu dân cư Hà Đông',
            type: 'flood',
            location: 'Khu đô thị Văn Quán, Hà Đông, Hà Nội',
            priority: 'high',
            time: '2025-01-14 16:20',
            status: 'processing',
            reporter: 'Phạm Thị D',
            phone: '0934567890',
            description: 'Ngập nặng do mưa lớn kéo dài, nhiều nhà bị ngập.',
            casualties: 0,
            severity: 'medium',
            region: 'north',
            assignedTeam: 'Đội cứu hộ Hà Nội'
        },
        
        // Accident incidents
        {
            id: 'RPT005',
            title: 'Tai nạn giao thông tại ngã tư',
            type: 'accident',
            location: 'Ngã tư Hàng Xanh, Quận Bình Thạnh, TP.HCM',
            priority: 'critical',
            time: '2025-01-15 08:45',
            status: 'resolved',
            reporter: 'Hoàng Văn E',
            phone: '0945678901',
            description: 'Va chạm giữa xe tải và xe máy, 1 người tử vong.',
            casualties: 1,
            severity: 'high',
            region: 'south',
            assignedTeam: 'Cảnh sát giao thông'
        },
        {
            id: 'RPT006',
            title: 'Tai nạn xe khách trên cao tốc',
            type: 'accident',
            location: 'Cao tốc Hà Nội - Hải Phòng, km 45',
            priority: 'critical',
            time: '2025-01-14 14:10',
            status: 'processing',
            reporter: 'Vũ Văn F',
            phone: '0956789012',
            description: 'Xe khách lật trên cao tốc, nhiều người bị thương.',
            casualties: 12,
            severity: 'high',
            region: 'north',
            assignedTeam: 'Đội cứu hộ giao thông'
        },
        
        // Medical incidents
        {
            id: 'RPT007',
            title: 'Người bị thương cần hỗ trợ y tế',
            type: 'medical',
            location: 'Công viên 23/9, Quận 1, TP.HCM',
            priority: 'high',
            time: '2025-01-14 14:10',
            status: 'resolved',
            reporter: 'Ngô Thị G',
            phone: '0967890123',
            description: 'Người già bị ngất xỉu trong công viên.',
            casualties: 1,
            severity: 'medium',
            region: 'south',
            assignedTeam: 'Trung tâm cấp cứu 115'
        },
        {
            id: 'RPT008',
            title: 'Hàng loạt người ngộ độc thực phẩm',
            type: 'medical',
            location: 'Nhà hàng ABC, Quận 3, TP.HCM',
            priority: 'high',
            time: '2025-01-13 20:30',
            status: 'resolved',
            reporter: 'Đặng Văn H',
            phone: '0978901234',
            description: '15 người có triệu chứng ngộ độc sau khi ăn tối.',
            casualties: 15,
            severity: 'medium',
            region: 'south',
            assignedTeam: 'Trung tâm chống độc'
        },
        
        // Disaster incidents
        {
            id: 'RPT009',
            title: 'Cây đổ sau cơn bão',
            type: 'disaster',
            location: 'Đường Lê Văn Việt, Quận 9, TP.HCM',
            priority: 'medium',
            time: '2025-01-14 16:20',
            status: 'processing',
            reporter: 'Bùi Thị I',
            phone: '0989012345',
            description: 'Cây cổ thụ đổ chắn ngang đường, giao thông ùn tắc.',
            casualties: 0,
            severity: 'low',
            region: 'south',
            assignedTeam: 'Công ty cây xanh đô thị'
        },
        {
            id: 'RPT010',
            title: 'Sạt lở đất tại miền núi',
            type: 'disaster',
            location: 'Xã A, Huyện B, Tỉnh Yên Bái',
            priority: 'critical',
            time: '2025-01-13 05:30',
            status: 'processing',
            reporter: 'Phan Văn K',
            phone: '0990123456',
            description: 'Sạt lở đất chôn vùi 3 nhà dân, nhiều người mất tích.',
            casualties: 8,
            severity: 'high',
            region: 'north',
            assignedTeam: 'Đội cứu hộ miền núi'
        },
        
        // Other incidents
        {
            id: 'RPT011',
            title: 'Sự cố đường ống nước sạch',
            type: 'other',
            location: 'Đường Cộng Hòa, Quận Tân Bình, TP.HCM',
            priority: 'medium',
            time: '2025-01-15 07:00',
            status: 'pending',
            reporter: 'Lý Thị L',
            phone: '0901122334',
            description: 'Đường ống nước chính bị vỡ, nước tràn ra đường.',
            casualties: 0,
            severity: 'low',
            region: 'south',
            assignedTeam: 'Công ty cấp nước'
        },
        {
            id: 'RPT012',
            title: 'Sập giàn giáo công trình',
            type: 'other',
            location: 'Công trình chung cư M, Quận 2, TP.HCM',
            priority: 'critical',
            time: '2025-01-14 13:45',
            status: 'processing',
            reporter: 'Mai Văn M',
            phone: '0912233445',
            description: 'Giàn giáo tầng 10 bị sập, nhiều công nhân bị mắc kẹt.',
            casualties: 5,
            severity: 'high',
            region: 'south',
            assignedTeam: 'Đội cứu hộ công trường'
        },
        
        // Additional diverse incidents
        {
            id: 'RPT013',
            title: 'Cháy rừng tại Vườn Quốc gia',
            type: 'fire',
            location: 'Vườn Quốc gia Cát Tiên, Đồng Nai',
            priority: 'critical',
            time: '2025-01-12 14:20',
            status: 'processing',
            reporter: 'Hồ Văn N',
            phone: '0923344556',
            description: 'Cháy rừng lan rộng do nắng nóng kéo dài.',
            casualties: 0,
            severity: 'high',
            region: 'south',
            assignedTeam: 'Kiểm lâm và cứu hộ rừng'
        },
        {
            id: 'RPT014',
            title: 'Lũ quét tại miền Trung',
            type: 'flood',
            location: 'Huyện A, Tỉnh Quảng Bình',
            priority: 'critical',
            time: '2025-01-11 18:00',
            status: 'processing',
            reporter: 'Trịnh Thị O',
            phone: '0934455667',
            description: 'Lũ quét sau mưa lớn, nhiều làng bị cô lập.',
            casualties: 3,
            severity: 'high',
            region: 'central',
            assignedTeam: 'Đội cứu hộ lũ lụt'
        },
        {
            id: 'RPT015',
            title: 'Sự cố hóa chất rò rỉ',
            type: 'other',
            location: 'Khu công nghiệp B, Bình Dương',
            priority: 'critical',
            time: '2025-01-10 09:30',
            status: 'resolved',
            reporter: 'Đỗ Văn P',
            phone: '0945566778',
            description: 'Rò rỉ khí amoniac tại nhà máy, khu vực sơ tán.',
            casualties: 2,
            severity: 'high',
            region: 'south',
            assignedTeam: 'Đội phòng chống hóa chất'
        }
    ];

    // DOM Elements
    const reportsTableBody = document.getElementById('reports-table-body');
    const searchReportsInput = document.getElementById('search-reports-input');
    const typeReportsFilter = document.getElementById('type-reports-filter');
    const statusReportsFilter = document.getElementById('status-reports-filter');
    const toggleReportsFilters = document.getElementById('toggle-reports-filters');
    const advancedReportsFilters = document.getElementById('advanced-reports-filters');
    const addReportBtn = document.getElementById('add-report-btn');
    const syncReportsBtn = document.getElementById('sync-reports-btn');
    const exportReportsBtn = document.getElementById('export-reports-btn');
    const startDateFilter = document.getElementById('start-date-filter');
    const endDateFilter = document.getElementById('end-date-filter');
    const priorityReportsFilter = document.getElementById('priority-reports-filter');
    const regionReportsFilter = document.getElementById('region-reports-filter');
    const reportsShowingFrom = document.getElementById('reports-showing-from');
    const reportsShowingTo = document.getElementById('reports-showing-to');
    const reportsTotalItems = document.getElementById('reports-total-items');
    const reportsPagination = document.getElementById('reports-pagination');

    // Pagination variables
    let currentPage = 1;
    const itemsPerPage = 8;
    let filteredReports = [];

    // Initialize reports table
    function initializeReportsTable() {
        filteredReports = [...reportsData];
        renderReportsTable();
        updateReportsStats();
        setupPagination();
    }

    // Render reports table with pagination
    function renderReportsTable() {
        reportsTableBody.innerHTML = '';
        
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const currentReports = filteredReports.slice(startIndex, endIndex);
        
        if (currentReports.length === 0) {
            reportsTableBody.innerHTML = `
                <tr>
                    <td colspan="7" class="px-6 py-4 text-center text-gray-500">
                        <i class="fas fa-search mb-2 text-2xl text-gray-400"></i>
                        <p>Không có báo cáo nào phù hợp với tiêu chí tìm kiếm</p>
                    </td>
                </tr>
            `;
            return;
        }
        
        currentReports.forEach(report => {
            const row = document.createElement('tr');
            row.className = 'hover:bg-gray-50 transition-colors';
            
            // Determine status badge class
            const statusConfig = getStatusConfig(report.status);
            
            // Determine priority badge class
            const priorityConfig = getPriorityConfig(report.priority);
            
            // Determine type icon and text
            const typeConfig = getTypeConfig(report.type);
            
            row.innerHTML = `
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900">${report.id}</div>
                    <div class="text-xs text-gray-500">${formatDate(report.time)}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                        <div class="w-8 h-8 ${typeConfig.bgColor} rounded-full flex items-center justify-center mr-2">
                            <i class="fas ${typeConfig.icon} ${typeConfig.textColor} text-sm"></i>
                        </div>
                        <div>
                            <span class="text-sm font-medium text-gray-900">${typeConfig.text}</span>
                            <div class="text-xs text-gray-500">${report.assignedTeam}</div>
                        </div>
                    </div>
                </td>
                <td class="px-6 py-4">
                    <div class="text-sm font-medium text-gray-900">${report.title}</div>
                    <div class="text-sm text-gray-500 truncate max-w-xs">${report.location}</div>
                    <div class="text-xs text-gray-400 mt-1">${report.casualties > 0 ? `👥 ${report.casualties} người ảnh hưởng` : 'Không có thương vong'}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${priorityConfig.class}">
                        <i class="fas ${priorityConfig.icon} mr-1"></i>
                        ${priorityConfig.text}
                    </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${formatDateTime(report.time)}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig.class}">
                        <i class="fas ${statusConfig.icon} mr-1"></i>
                        ${statusConfig.text}
                    </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div class="flex space-x-2">
                        <button class="text-blue-600 hover:text-blue-900 p-1 rounded view-report-btn" data-id="${report.id}" title="Xem chi tiết">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="text-green-600 hover:text-green-900 p-1 rounded edit-report-btn" data-id="${report.id}" title="Chỉnh sửa">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="text-red-600 hover:text-red-900 p-1 rounded delete-report-btn" data-id="${report.id}" title="Xóa">
                            <i class="fas fa-trash"></i>
                        </button>
                        <button class="text-purple-600 hover:text-purple-900 p-1 rounded assign-team-btn" data-id="${report.id}" title="Phân công đội">
                            <i class="fas fa-users"></i>
                        </button>
                    </div>
                </td>
            `;
            
            reportsTableBody.appendChild(row);
        });
        
        // Update pagination info
        updatePaginationInfo();
        
        // Add event listeners to action buttons
        addReportEventListeners();
    }

    // Add event listeners to report action buttons
    function addReportEventListeners() {
        document.querySelectorAll('.view-report-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const reportId = this.getAttribute('data-id');
                viewReport(reportId);
            });
        });
        
        document.querySelectorAll('.edit-report-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const reportId = this.getAttribute('data-id');
                editReport(reportId);
            });
        });
        
        document.querySelectorAll('.delete-report-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const reportId = this.getAttribute('data-id');
                deleteReport(reportId);
            });
        });
        
        document.querySelectorAll('.assign-team-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const reportId = this.getAttribute('data-id');
                assignTeam(reportId);
            });
        });
    }

    // Filter reports based on criteria
    function filterReports() {
        const searchTerm = searchReportsInput.value.toLowerCase();
        const typeFilter = typeReportsFilter.value;
        const statusFilter = statusReportsFilter.value;
        const priorityFilter = priorityReportsFilter.value;
        const regionFilter = regionReportsFilter.value;
        const startDate = startDateFilter.value;
        const endDate = endDateFilter.value;
        
        filteredReports = reportsData.filter(report => {
            // Search filter
            const matchesSearch = searchTerm === '' || 
                report.title.toLowerCase().includes(searchTerm) ||
                report.location.toLowerCase().includes(searchTerm) ||
                report.id.toLowerCase().includes(searchTerm) ||
                report.reporter.toLowerCase().includes(searchTerm) ||
                report.assignedTeam.toLowerCase().includes(searchTerm);
            
            // Type filter
            const matchesType = typeFilter === 'all' || report.type === typeFilter;
            
            // Status filter
            const matchesStatus = statusFilter === 'all' || report.status === statusFilter;
            
            // Priority filter
            const matchesPriority = priorityFilter === 'all' || report.priority === priorityFilter;
            
            // Region filter
            const matchesRegion = regionFilter === 'all' || report.region === regionFilter;
            
            // Date filter
            const reportDate = new Date(report.time).toISOString().split('T')[0];
            const matchesStartDate = !startDate || reportDate >= startDate;
            const matchesEndDate = !endDate || reportDate <= endDate;
            
            return matchesSearch && matchesType && matchesStatus && matchesPriority && 
                   matchesRegion && matchesStartDate && matchesEndDate;
        });
        
        currentPage = 1; // Reset to first page when filtering
        renderReportsTable();
        updateReportsStats();
        setupPagination();
    }

    // Update reports statistics
    function updateReportsStats() {
        const totalReports = document.querySelector('.stats-card:nth-child(1) .text-2xl');
        const pendingReports = document.querySelector('.stats-card:nth-child(2) .text-2xl');
        const resolvedReports = document.querySelector('.stats-card:nth-child(3) .text-2xl');
        const emergencyReports = document.querySelector('.stats-card:nth-child(4) .text-2xl');
        
        if (totalReports) totalReports.textContent = filteredReports.length;
        if (pendingReports) {
            const pendingCount = filteredReports.filter(r => r.status === 'pending').length;
            pendingReports.textContent = pendingCount;
        }
        if (resolvedReports) {
            const resolvedCount = filteredReports.filter(r => r.status === 'resolved').length;
            resolvedReports.textContent = resolvedCount;
        }
        if (emergencyReports) {
            const emergencyCount = filteredReports.filter(r => r.priority === 'critical' || r.priority === 'high').length;
            emergencyReports.textContent = emergencyCount;
        }
    }

    // Setup pagination
    function setupPagination() {
        const totalPages = Math.ceil(filteredReports.length / itemsPerPage);
        reportsPagination.innerHTML = '';
        
        if (totalPages <= 1) return;
        
        // Previous button
        const prevButton = document.createElement('button');
        prevButton.className = `px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`;
        prevButton.innerHTML = '<i class="fas fa-chevron-left"></i>';
        prevButton.disabled = currentPage === 1;
        prevButton.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                renderReportsTable();
            }
        });
        reportsPagination.appendChild(prevButton);
        
        // Page numbers
        for (let i = 1; i <= totalPages; i++) {
            const pageButton = document.createElement('button');
            pageButton.className = `px-3 py-2 border rounded-lg ${currentPage === i ? 'bg-red-600 text-white border-red-600' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`;
            pageButton.textContent = i;
            pageButton.addEventListener('click', () => {
                currentPage = i;
                renderReportsTable();
            });
            reportsPagination.appendChild(pageButton);
        }
        
        // Next button
        const nextButton = document.createElement('button');
        nextButton.className = `px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`;
        nextButton.innerHTML = '<i class="fas fa-chevron-right"></i>';
        nextButton.disabled = currentPage === totalPages;
        nextButton.addEventListener('click', () => {
            if (currentPage < totalPages) {
                currentPage++;
                renderReportsTable();
            }
        });
        reportsPagination.appendChild(nextButton);
    }

    // Update pagination info
    function updatePaginationInfo() {
        const startIndex = (currentPage - 1) * itemsPerPage + 1;
        const endIndex = Math.min(startIndex + itemsPerPage - 1, filteredReports.length);
        
        reportsShowingFrom.textContent = startIndex;
        reportsShowingTo.textContent = endIndex;
        reportsTotalItems.textContent = filteredReports.length;
    }

    // Helper functions for configuration
    function getStatusConfig(status) {
        const configs = {
            'pending': { class: 'bg-yellow-100 text-yellow-800', icon: 'fa-clock', text: 'Đang chờ' },
            'processing': { class: 'bg-blue-100 text-blue-800', icon: 'fa-sync-alt', text: 'Đang xử lý' },
            'resolved': { class: 'bg-green-100 text-green-800', icon: 'fa-check-circle', text: 'Đã giải quyết' },
            'cancelled': { class: 'bg-red-100 text-red-800', icon: 'fa-times-circle', text: 'Đã hủy' }
        };
        return configs[status] || configs.pending;
    }

    function getPriorityConfig(priority) {
        const configs = {
            'low': { class: 'bg-gray-100 text-gray-800', icon: 'fa-arrow-down', text: 'Thấp' },
            'medium': { class: 'bg-yellow-100 text-yellow-800', icon: 'fa-minus', text: 'Trung bình' },
            'high': { class: 'bg-orange-100 text-orange-800', icon: 'fa-arrow-up', text: 'Cao' },
            'critical': { class: 'bg-red-100 text-red-800', icon: 'fa-exclamation-triangle', text: 'Rất cao' }
        };
        return configs[priority] || configs.medium;
    }

    function getTypeConfig(type) {
        const configs = {
            'fire': { icon: 'fa-fire', text: 'Cháy', bgColor: 'bg-red-100', textColor: 'text-red-600' },
            'flood': { icon: 'fa-water', text: 'Ngập lụt', bgColor: 'bg-blue-100', textColor: 'text-blue-600' },
            'accident': { icon: 'fa-car-crash', text: 'Tai nạn', bgColor: 'bg-orange-100', textColor: 'text-orange-600' },
            'medical': { icon: 'fa-first-aid', text: 'Y tế', bgColor: 'bg-green-100', textColor: 'text-green-600' },
            'disaster': { icon: 'fa-wind', text: 'Thiên tai', bgColor: 'bg-purple-100', textColor: 'text-purple-600' },
            'other': { icon: 'fa-exclamation-triangle', text: 'Khác', bgColor: 'bg-gray-100', textColor: 'text-gray-600' }
        };
        return configs[type] || configs.other;
    }

    // Format date time for display
    function formatDateTime(dateTimeString) {
        const date = new Date(dateTimeString);
        return date.toLocaleString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    function formatDate(dateTimeString) {
        const date = new Date(dateTimeString);
        return date.toLocaleDateString('vi-VN');
    }

    // View report details
    function viewReport(reportId) {
        const report = reportsData.find(r => r.id === reportId);
        if (report) {
            const modalContent = `
                <div class="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                    <div class="p-6 border-b border-gray-200">
                        <div class="flex justify-between items-center">
                            <h3 class="text-lg font-semibold text-gray-900">Chi tiết báo cáo: ${report.id}</h3>
                            <button class="text-gray-400 hover:text-gray-500 close-modal">
                                <i class="fas fa-times text-lg"></i>
                            </button>
                        </div>
                    </div>
                    <div class="p-6">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div class="space-y-4">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">Tiêu đề</label>
                                    <p class="text-gray-900 font-medium">${report.title}</p>
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">Địa điểm</label>
                                    <p class="text-gray-900">${report.location}</p>
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
                                    <p class="text-gray-900">${report.description}</p>
                                </div>
                                <div class="grid grid-cols-2 gap-4">
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-1">Người báo cáo</label>
                                        <p class="text-gray-900">${report.reporter}</p>
                                    </div>
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                                        <p class="text-gray-900">${report.phone}</p>
                                    </div>
                                </div>
                            </div>
                            <div class="space-y-4">
                                <div class="grid grid-cols-2 gap-4">
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-1">Loại sự cố</label>
                                        <p class="text-gray-900">${getTypeConfig(report.type).text}</p>
                                    </div>
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-1">Mức độ ưu tiên</label>
                                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityConfig(report.priority).class}">
                                            ${getPriorityConfig(report.priority).text}
                                        </span>
                                    </div>
                                </div>
                                <div class="grid grid-cols-2 gap-4">
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
                                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusConfig(report.status).class}">
                                            ${getStatusConfig(report.status).text}
                                        </span>
                                    </div>
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-1">Thương vong</label>
                                        <p class="text-gray-900">${report.casualties} người</p>
                                    </div>
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">Đội xử lý</label>
                                    <p class="text-gray-900">${report.assignedTeam}</p>
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">Thời gian báo cáo</label>
                                    <p class="text-gray-900">${formatDateTime(report.time)}</p>
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">Khu vực</label>
                                    <p class="text-gray-900">${getRegionText(report.region)}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            showModal(modalContent);
        }
    }

    // Edit report - UPDATED VERSION
function editReport(reportId) {
    const report = reportsData.find(r => r.id === reportId);
    if (report) {
        const modalContent = `
            <div class="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div class="p-6 border-b border-gray-200">
                    <div class="flex justify-between items-center">
                        <h3 class="text-lg font-semibold text-gray-900">Chỉnh sửa báo cáo: ${report.id}</h3>
                        <button class="text-gray-400 hover:text-gray-500 close-modal">
                            <i class="fas fa-times text-lg"></i>
                        </button>
                    </div>
                </div>
                <div class="p-6">
                    <form id="edit-report-form" class="space-y-6">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div class="space-y-4">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">Tiêu đề *</label>
                                    <input type="text" name="title" value="${report.title}" 
                                           class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500" required>
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">Địa điểm *</label>
                                    <input type="text" name="location" value="${report.location}" 
                                           class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500" required>
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">Mô tả chi tiết</label>
                                    <textarea name="description" rows="3" 
                                              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500">${report.description}</textarea>
                                </div>
                                <div class="grid grid-cols-2 gap-4">
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-1">Người báo cáo</label>
                                        <input type="text" name="reporter" value="${report.reporter}" 
                                               class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500">
                                    </div>
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                                        <input type="tel" name="phone" value="${report.phone}" 
                                               class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500">
                                    </div>
                                </div>
                            </div>
                            <div class="space-y-4">
                                <div class="grid grid-cols-2 gap-4">
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-1">Loại sự cố *</label>
                                        <select name="type" class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500">
                                            <option value="fire" ${report.type === 'fire' ? 'selected' : ''}>Cháy</option>
                                            <option value="flood" ${report.type === 'flood' ? 'selected' : ''}>Ngập lụt</option>
                                            <option value="accident" ${report.type === 'accident' ? 'selected' : ''}>Tai nạn</option>
                                            <option value="medical" ${report.type === 'medical' ? 'selected' : ''}>Y tế</option>
                                            <option value="disaster" ${report.type === 'disaster' ? 'selected' : ''}>Thiên tai</option>
                                            <option value="other" ${report.type === 'other' ? 'selected' : ''}>Khác</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-1">Mức độ ưu tiên *</label>
                                        <select name="priority" class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500">
                                            <option value="low" ${report.priority === 'low' ? 'selected' : ''}>Thấp</option>
                                            <option value="medium" ${report.priority === 'medium' ? 'selected' : ''}>Trung bình</option>
                                            <option value="high" ${report.priority === 'high' ? 'selected' : ''}>Cao</option>
                                            <option value="critical" ${report.priority === 'critical' ? 'selected' : ''}>Rất cao</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="grid grid-cols-2 gap-4">
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-1">Trạng thái *</label>
                                        <select name="status" class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500">
                                            <option value="pending" ${report.status === 'pending' ? 'selected' : ''}>Đang chờ</option>
                                            <option value="processing" ${report.status === 'processing' ? 'selected' : ''}>Đang xử lý</option>
                                            <option value="resolved" ${report.status === 'resolved' ? 'selected' : ''}>Đã giải quyết</option>
                                            <option value="cancelled" ${report.status === 'cancelled' ? 'selected' : ''}>Đã hủy</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-1">Số người thương vong</label>
                                        <input type="number" name="casualties" value="${report.casualties}" min="0"
                                               class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500">
                                    </div>
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">Đội xử lý *</label>
                                    <input type="text" name="assignedTeam" value="${report.assignedTeam}" 
                                           class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500" required>
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">Khu vực</label>
                                    <select name="region" class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500">
                                        <option value="north" ${report.region === 'north' ? 'selected' : ''}>Miền Bắc</option>
                                        <option value="central" ${report.region === 'central' ? 'selected' : ''}>Miền Trung</option>
                                        <option value="south" ${report.region === 'south' ? 'selected' : ''}>Miền Nam</option>
                                    </select>
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">Thời gian báo cáo</label>
                                    <input type="datetime-local" name="time" value="${report.time.replace(' ', 'T')}" 
                                           class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500">
                                </div>
                            </div>
                        </div>
                        <div class="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                            <button type="button" class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 close-modal">
                                Hủy bỏ
                            </button>
                            <button type="submit" class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                                <i class="fas fa-save mr-2"></i>
                                Lưu thay đổi
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        `;
        
        const modal = showModal(modalContent);
        
        // Add form submit handler
        const form = document.getElementById('edit-report-form');
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const updatedReport = {
                id: report.id,
                title: formData.get('title'),
                type: formData.get('type'),
                location: formData.get('location'),
                priority: formData.get('priority'),
                time: formData.get('time').replace('T', ' '),
                status: formData.get('status'),
                reporter: formData.get('reporter'),
                phone: formData.get('phone'),
                description: formData.get('description'),
                casualties: parseInt(formData.get('casualties')),
                severity: report.severity, // Keep original for now
                region: formData.get('region'),
                assignedTeam: formData.get('assignedTeam')
            };
            
            // Update the report in the data array
            const index = reportsData.findIndex(r => r.id === reportId);
            if (index !== -1) {
                reportsData[index] = updatedReport;
                filterReports(); // Re-render the table
                showNotification('Đã cập nhật báo cáo thành công!', 'success');
                
                // Close modal
                document.body.removeChild(modal);
            }
        });
    }
}

// Show modal function - UPDATED to return the modal element
function showModal(content) {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
    modal.innerHTML = content;
    
    // Close modal handlers
    const closeModal = () => document.body.removeChild(modal);
    
    modal.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', closeModal);
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    document.body.appendChild(modal);
    return modal; // Return the modal element for further manipulation
}

    // Delete report
    function deleteReport(reportId) {
        if (confirm('Bạn có chắc chắn muốn xóa báo cáo này?')) {
            const index = reportsData.findIndex(r => r.id === reportId);
            if (index !== -1) {
                reportsData.splice(index, 1);
                filterReports(); // Re-filter to update the table
                showNotification('Đã xóa báo cáo thành công!', 'success');
            }
        }
    }

    // Assign team to report
    function assignTeam(reportId) {
        const report = reportsData.find(r => r.id === reportId);
        if (report) {
            const teams = ['Đội PCCC Quận 1', 'Đội cứu hộ đô thị', 'Cảnh sát giao thông', 'Trung tâm cấp cứu 115', 'Đội cứu hộ miền núi'];
            const selectedTeam = prompt(`Phân công đội xử lý cho báo cáo ${reportId}:\n\n${teams.join('\n')}\n\nNhập tên đội:`, report.assignedTeam);
            
            if (selectedTeam && selectedTeam.trim() !== '') {
                report.assignedTeam = selectedTeam.trim();
                filterReports(); // Re-render the table
                showNotification(`Đã phân công ${selectedTeam} cho báo cáo ${reportId}`, 'success');
            }
        }
    }

    // Get region text
    function getRegionText(region) {
        const regions = {
            'north': 'Miền Bắc',
            'central': 'Miền Trung',
            'south': 'Miền Nam'
        };
        return regions[region] || region;
    }

    // Show modal
    function showModal(content) {
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
        modal.innerHTML = content;
        
        modal.querySelector('.close-modal').addEventListener('click', () => {
            document.body.removeChild(modal);
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });
        
        document.body.appendChild(modal);
    }

    // Show notification
    function showNotification(message, type = 'success') {
        const notification = document.getElementById('success-notification');
        const messageElement = document.getElementById('notification-message');
        
        if (notification && messageElement) {
            messageElement.textContent = message;
            
            // Update notification color based on type
            if (type === 'error') {
                notification.classList.remove('bg-green-500', 'bg-blue-500');
                notification.classList.add('bg-red-500');
            } else if (type === 'info') {
                notification.classList.remove('bg-green-500', 'bg-red-500');
                notification.classList.add('bg-blue-500');
            } else {
                notification.classList.remove('bg-red-500', 'bg-blue-500');
                notification.classList.add('bg-green-500');
            }
            
            notification.classList.remove('hidden');
            
            setTimeout(() => {
                notification.classList.add('hidden');
            }, 3000);
        }
    }

    // Event Listeners
    searchReportsInput.addEventListener('input', filterReports);
    typeReportsFilter.addEventListener('change', filterReports);
    statusReportsFilter.addEventListener('change', filterReports);
    priorityReportsFilter.addEventListener('change', filterReports);
    regionReportsFilter.addEventListener('change', filterReports);
    startDateFilter.addEventListener('change', filterReports);
    endDateFilter.addEventListener('change', filterReports);
    
    toggleReportsFilters.addEventListener('click', function() {
        advancedReportsFilters.classList.toggle('hidden');
        this.querySelector('i').classList.toggle('fa-filter');
        this.querySelector('i').classList.toggle('fa-times');
    });
    
    addReportBtn.addEventListener('click', function() {
        showNotification('Mở modal thêm báo cáo mới', 'info');
        // In a real application, this would open the report modal
    });
    
    syncReportsBtn.addEventListener('click', function() {
        showNotification('Đã đồng bộ dữ liệu báo cáo!', 'success');
    });
    
    exportReportsBtn.addEventListener('click', function() {
        showNotification('Đã xuất dữ liệu báo cáo ra Excel!', 'success');
    });

    // Initialize the reports table
    initializeReportsTable();
});









//bản tin
// Admin Dashboard JavaScript - Professional Version with Proper Menu Structure

// Global variables


// News management variables
let currentNewsPage = 1;
const newsPerPage = 6;
let allNewsData = [];
let currentEditingNews = null;

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
    
    // Initialize reports management
    setupReportsManagement();
    
    // Initialize news data
    initializeNewsData();
    
    // Load all data
    loadDashboardData();
    loadWeatherData();
    loadReportsData();
    loadUsersData();
    
    // Show dashboard by default
    showTab('dashboard');
}

// Setup Event Listeners
function setupEventListeners() {
    // Navigation - SỬA LẠI PHẦN NÀY
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

    document.getElementById('add-report-btn').addEventListener('click', () => openReportModal());

    // Quick action buttons
    document.querySelectorAll('.quick-action-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const action = this.getAttribute('data-action');
            handleQuickAction(action);
        });
    });
    
    // Sync data button
    document.getElementById('sync-data-btn').addEventListener('click', manualSyncData);
    
    // News management - THÊM EVENT LISTENERS CHO NEWS
    setupNewsEventListeners();
    
    // Weather management
    document.getElementById('add-weather-btn').addEventListener('click', () => openWeatherModal());
    document.getElementById('weather-form').addEventListener('submit', handleWeatherSubmit);
    document.getElementById('close-weather-modal').addEventListener('click', closeWeatherModal);
    document.getElementById('cancel-weather').addEventListener('click', closeWeatherModal);
    
    // Users management
    document.getElementById('add-user-btn').addEventListener('click', openUserModal);
}

// THÊM HÀM SETUP NEWS EVENT LISTENERS
function setupNewsEventListeners() {
    // News form submit
    const newsForm = document.getElementById('news-form');
    if (newsForm) {
        newsForm.addEventListener('submit', handleNewsSubmit);
    }
    
    // News modal controls
    const closeNewsModalBtn = document.getElementById('close-news-modal');
    if (closeNewsModalBtn) {
        closeNewsModalBtn.addEventListener('click', closeNewsModal);
    }
    
    const cancelNewsBtn = document.getElementById('cancel-news');
    if (cancelNewsBtn) {
        cancelNewsBtn.addEventListener('click', closeNewsModal);
    }
    
    // News filters
    const searchNewsInput = document.getElementById('search-news-input');
    if (searchNewsInput) {
        searchNewsInput.addEventListener('input', debounce(() => {
            currentNewsPage = 1;
            loadNewsData(currentNewsPage, getCurrentFilters());
        }, 300));
    }
    
    const categoryNewsFilter = document.getElementById('category-news-filter');
    if (categoryNewsFilter) {
        categoryNewsFilter.addEventListener('change', () => {
            currentNewsPage = 1;
            loadNewsData(currentNewsPage, getCurrentFilters());
        });
    }
    
    const statusNewsFilter = document.getElementById('status-news-filter');
    if (statusNewsFilter) {
        statusNewsFilter.addEventListener('change', () => {
            currentNewsPage = 1;
            loadNewsData(currentNewsPage, getCurrentFilters());
        });
    }
    
    // News status change for schedule field
    const newsStatusSelect = document.getElementById('news-status');
    if (newsStatusSelect) {
        newsStatusSelect.addEventListener('change', function() {
            const scheduleField = document.getElementById('schedule-field');
            if (this.value === 'scheduled') {
                scheduleField.classList.remove('hidden');
            } else {
                scheduleField.classList.add('hidden');
            }
        });
    }
    
    // Image upload
    const newsImageUpload = document.getElementById('news-image');
    if (newsImageUpload) {
        newsImageUpload.addEventListener('change', handleImageUpload);
    }
}

// Tab Management - SỬA LẠI HÀM NÀY
function showTab(tabName) {
    console.log('Showing tab:', tabName);
    
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
        tab.classList.add('hidden');
    });
    
    // Show selected tab
    const targetTab = document.getElementById(tabName);
    if (targetTab) {
        targetTab.classList.add('active');
        targetTab.classList.remove('hidden');
    }
    
    // Load specific data for each tab
    switch(tabName) {
        case 'news':
            loadNewsData(currentNewsPage);
            break;
        case 'weather':
            loadWeatherData();
            break;
        case 'reports':
            loadReportsData();
            break;
        case 'users':
            loadUsersData();
            break;
    }
    
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
    
    const pageTitle = document.getElementById('page-title');
    const pageDescription = document.getElementById('page-description');
    
    if (pageTitle) pageTitle.textContent = titles[tabName] || 'Dashboard';
    if (pageDescription) pageDescription.textContent = descriptions[tabName] || 'Tổng quan hệ thống';
}

// Chart Management (giữ nguyên)
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

// WEATHER, REPORTS, USERS functions (giữ nguyên)
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
    if (!container) return;
    
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
    if (!container) return;
    
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
    if (!container) return;
    
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
    if (!container) return;
    
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

// ==================== NEWS MANAGEMENT SYSTEM ====================

// Khởi tạo dữ liệu mẫu cho bản tin
function initializeNewsData() {
    allNewsData = [
        {
            id: 'N001',
            title: 'Cảnh báo bão số 8 hướng vào đất liền',
            category: 'emergency',
            status: 'published',
            excerpt: 'Bão số 8 dự kiến đổ bộ vào các tỉnh miền Trung với sức gió mạnh cấp 10-11, giật cấp 13. Người dân cần chủ động các biện pháp phòng tránh.',
            content: 'Bão số 8 đang di chuyển với tốc độ nhanh và dự kiến sẽ đổ bộ vào các tỉnh miền Trung trong 24 giờ tới. Sức gió mạnh cấp 10-11, giật cấp 13. Các địa phương cần khẩn trương triển khai các biện pháp phòng chống bão.',
            views: 2400,
            time: '2 giờ trước',
            author: 'Admin System',
            priority: 'high',
            imageUrl: '',
            scheduleDate: '',
            createdAt: '2024-01-15T10:30:00'
        },
        {
            id: 'N002',
            title: 'Hướng dẫn sơ cứu khi bị điện giật',
            category: 'guidance', 
            status: 'published',
            excerpt: 'Các bước sơ cứu cơ bản khi gặp nạn nhân bị điện giật cần thực hiện ngay lập tức để tránh nguy hiểm tính mạng.',
            content: 'Khi gặp nạn nhân bị điện giật, cần thực hiện các bước sau: 1. Ngắt nguồn điện ngay lập tức, 2. Kiểm tra ý thức nạn nhân, 3. Gọi cấp cứu 115, 4. Thực hiện hồi sức tim phổi nếu cần.',
            views: 1800,
            time: '5 giờ trước',
            author: 'Nguyễn Văn A',
            priority: 'medium',
            imageUrl: '',
            scheduleDate: '',
            createdAt: '2024-01-15T08:15:00'
        },
        {
            id: 'N003',
            title: 'Thông báo lịch cứu hộ dịp lễ 30/4',
            category: 'info',
            status: 'scheduled',
            excerpt: 'Lịch trực và phương án cứu hộ được triển khai trong dịp lễ 30/4 - 1/5 để đảm bảo an toàn cho người dân.',
            content: 'Trong dịp lễ 30/4 - 1/5, lực lượng cứu hộ sẽ được bố trí trực 24/24 tại các điểm nóng. Phương án cứu hộ khẩn cấp đã được xây dựng và sẵn sàng triển khai.',
            views: 950,
            time: '1 ngày trước',
            author: 'Trần Thị B',
            priority: 'low',
            imageUrl: '',
            scheduleDate: '2024-04-28T08:00:00',
            createdAt: '2024-01-14T14:20:00'
        }
        // ... thêm các bài viết khác nếu cần
    ];
}

// Cập nhật hàm loadNewsData
function loadNewsData(page = 1, filters = {}) {
    const container = document.getElementById('news-grid-container');
    if (!container) return;
    
    container.innerHTML = '';

    // Áp dụng filters
    let filteredNews = applyNewsFilters(allNewsData, filters);
    
    // Tính toán phân trang
    const startIndex = (page - 1) * newsPerPage;
    const endIndex = startIndex + newsPerPage;
    const paginatedNews = filteredNews.slice(startIndex, endIndex);

    // Cập nhật thông tin hiển thị
    updateNewsPaginationInfo(filteredNews.length, page);

    if (paginatedNews.length === 0) {
        container.innerHTML = `
            <div class="col-span-full text-center py-12">
                <i class="fas fa-inbox text-gray-400 text-4xl mb-4"></i>
                <h3 class="text-lg font-medium text-gray-900 mb-2">Không có bài viết nào</h3>
                <p class="text-gray-500">Không tìm thấy bài viết nào phù hợp với tiêu chí của bạn.</p>
                <button onclick="openNewsModal()" class="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition">
                    <i class="fas fa-plus mr-2"></i>
                    Thêm bài viết mới
                </button>
            </div>
        `;
        return;
    }

    // Render danh sách bài viết
    renderNewsList(paginatedNews);
    
    // Render phân trang
    renderNewsPagination(filteredNews.length, page);
    
    // Thêm event listeners
    addNewsActionListeners();
}

// Hàm áp dụng filters
function applyNewsFilters(news, filters) {
    let filtered = [...news];
    
    // Filter theo category
    if (filters.category && filters.category !== 'all') {
        filtered = filtered.filter(item => item.category === filters.category);
    }
    
    // Filter theo status
    if (filters.status && filters.status !== 'all') {
        filtered = filtered.filter(item => item.status === filters.status);
    }
    
    // Filter theo search
    if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        filtered = filtered.filter(item => 
            item.title.toLowerCase().includes(searchTerm) ||
            item.excerpt.toLowerCase().includes(searchTerm) ||
            item.author.toLowerCase().includes(searchTerm)
        );
    }
    
    return filtered;
}

// Hàm render danh sách bài viết
function renderNewsList(newsList) {
    const container = document.getElementById('news-grid-container');
    
    newsList.forEach(news => {
        const categoryNames = {
            'emergency': 'Khẩn cấp',
            'warning': 'Cảnh báo', 
            'info': 'Thông tin',
            'guidance': 'Hướng dẫn',
            'news': 'Tin tức'
        };

        const statusNames = {
            'published': 'Đã xuất bản',
            'draft': 'Bản nháp',
            'scheduled': 'Lên lịch',
            'archived': 'Đã lưu trữ'
        };

        const categoryColors = {
            'emergency': 'bg-red-100 text-red-800 border-red-200',
            'warning': 'bg-orange-100 text-orange-800 border-orange-200',
            'info': 'bg-blue-100 text-blue-800 border-blue-200',
            'guidance': 'bg-green-100 text-green-800 border-green-200',
            'news': 'bg-purple-100 text-purple-800 border-purple-200'
        };

        const statusColors = {
            'published': 'bg-green-100 text-green-800',
            'draft': 'bg-yellow-100 text-yellow-800',
            'scheduled': 'bg-blue-100 text-blue-800',
            'archived': 'bg-gray-100 text-gray-800'
        };

        const priorityIcons = {
            'high': 'fas fa-exclamation-circle text-red-500',
            'medium': 'fas fa-info-circle text-yellow-500',
            'low': 'fas fa-flag text-green-500'
        };

        const card = document.createElement('div');
        card.className = `bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200 hover:shadow-md transition-all duration-200 transform hover:-translate-y-1`;
        card.innerHTML = `
            <div class="p-6">
                <div class="flex justify-between items-start mb-3">
                    <div class="flex items-center space-x-2">
                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${categoryColors[news.category]} border">
                            ${categoryNames[news.category]}
                        </span>
                        <i class="${priorityIcons[news.priority]}" title="Ưu tiên ${news.priority}"></i>
                    </div>
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[news.status]}">
                        ${statusNames[news.status]}
                    </span>
                </div>
                
                <h3 class="font-bold text-lg mb-2 text-gray-900 line-clamp-2 hover:text-red-600 cursor-pointer view-news" data-id="${news.id}">
                    ${news.title}
                </h3>
                
                <p class="text-gray-600 text-sm mb-4 line-clamp-3">${news.excerpt}</p>
                
                <div class="flex items-center justify-between text-sm text-gray-500 mb-3">
                    <div class="flex items-center space-x-4">
                        <div class="flex items-center">
                            <i class="fas fa-eye mr-1"></i>
                            <span>${news.views.toLocaleString()}</span>
                        </div>
                        <div class="flex items-center">
                            <i class="fas fa-clock mr-1"></i>
                            <span>${news.time}</span>
                        </div>
                    </div>
                    <div class="text-xs text-gray-400">
                        ${formatDate(news.createdAt)}
                    </div>
                </div>
                
                <div class="flex items-center justify-between pt-3 border-t border-gray-100">
                    <span class="text-sm text-gray-500">Bởi <strong class="text-gray-700">${news.author}</strong></span>
                    <div class="flex space-x-1">
                        <button class="text-blue-600 hover:text-blue-800 p-2 rounded-lg hover:bg-blue-50 transition view-news" data-id="${news.id}" title="Xem chi tiết">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="text-green-600 hover:text-green-800 p-2 rounded-lg hover:bg-green-50 transition edit-news" data-id="${news.id}" title="Chỉnh sửa">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-50 transition delete-news" data-id="${news.id}" title="Xóa">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

// Hàm cập nhật thông tin phân trang
function updateNewsPaginationInfo(totalItems, currentPage) {
    const showingFrom = document.getElementById('showing-from');
    const showingTo = document.getElementById('showing-to');
    const totalItemsElement = document.getElementById('total-items');
    
    if (showingFrom && showingTo && totalItemsElement) {
        const startIndex = (currentPage - 1) * newsPerPage + 1;
        const endIndex = Math.min(currentPage * newsPerPage, totalItems);
        
        showingFrom.textContent = startIndex;
        showingTo.textContent = endIndex;
        totalItemsElement.textContent = totalItems;
    }
}

// Hàm render phân trang
function renderNewsPagination(totalItems, currentPage) {
    const paginationContainer = document.querySelector('#news .flex.justify-between.items-center');
    if (!paginationContainer) return;
    
    const totalPages = Math.ceil(totalItems / newsPerPage);
    
    // Tìm phần tử pagination buttons
    let paginationButtons = paginationContainer.querySelector('.flex.space-x-2');
    if (!paginationButtons) {
        paginationButtons = document.createElement('div');
        paginationButtons.className = 'flex space-x-2';
        paginationContainer.appendChild(paginationButtons);
    }
    
    paginationButtons.innerHTML = '';
    
    // Nút Previous
    const prevButton = document.createElement('button');
    prevButton.className = `px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition ${
        currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''
    }`;
    prevButton.innerHTML = '<i class="fas fa-chevron-left"></i>';
    prevButton.disabled = currentPage === 1;
    prevButton.addEventListener('click', () => {
        if (currentPage > 1) {
            currentNewsPage = currentPage - 1;
            loadNewsData(currentNewsPage, getCurrentFilters());
        }
    });
    paginationButtons.appendChild(prevButton);
    
    // Các nút trang
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    // Nút trang đầu
    if (startPage > 1) {
        const firstPageButton = document.createElement('button');
        firstPageButton.className = 'px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition';
        firstPageButton.textContent = '1';
        firstPageButton.addEventListener('click', () => {
            currentNewsPage = 1;
            loadNewsData(currentNewsPage, getCurrentFilters());
        });
        paginationButtons.appendChild(firstPageButton);
        
        if (startPage > 2) {
            const ellipsis = document.createElement('span');
            ellipsis.className = 'px-3 py-2 text-gray-500';
            ellipsis.textContent = '...';
            paginationButtons.appendChild(ellipsis);
        }
    }
    
    // Các nút trang chính
    for (let i = startPage; i <= endPage; i++) {
        const pageButton = document.createElement('button');
        pageButton.className = `px-3 py-2 border rounded-lg font-medium transition ${
            i === currentPage 
                ? 'bg-red-600 text-white border-red-600' 
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
        }`;
        pageButton.textContent = i;
        pageButton.addEventListener('click', () => {
            currentNewsPage = i;
            loadNewsData(currentNewsPage, getCurrentFilters());
        });
        paginationButtons.appendChild(pageButton);
    }
    
    // Nút trang cuối
    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            const ellipsis = document.createElement('span');
            ellipsis.className = 'px-3 py-2 text-gray-500';
            ellipsis.textContent = '...';
            paginationButtons.appendChild(ellipsis);
        }
        
        const lastPageButton = document.createElement('button');
        lastPageButton.className = 'px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition';
        lastPageButton.textContent = totalPages;
        lastPageButton.addEventListener('click', () => {
            currentNewsPage = totalPages;
            loadNewsData(currentNewsPage, getCurrentFilters());
        });
        paginationButtons.appendChild(lastPageButton);
    }
    
    // Nút Next
    const nextButton = document.createElement('button');
    nextButton.className = `px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition ${
        currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''
    }`;
    nextButton.innerHTML = '<i class="fas fa-chevron-right"></i>';
    nextButton.disabled = currentPage === totalPages;
    nextButton.addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentNewsPage = currentPage + 1;
            loadNewsData(currentNewsPage, getCurrentFilters());
        }
    });
    paginationButtons.appendChild(nextButton);
}

// Hàm lấy filters hiện tại
function getCurrentFilters() {
    return {
        category: document.getElementById('category-news-filter')?.value || 'all',
        status: document.getElementById('status-news-filter')?.value || 'all',
        search: document.getElementById('search-news-input')?.value || ''
    };
}

// Hàm thêm event listeners
function addNewsActionListeners() {
    // Event listeners cho các nút hành động
    document.querySelectorAll('.view-news').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.currentTarget.getAttribute('data-id');
            viewNews(id);
        });
    });

    document.querySelectorAll('.edit-news').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.currentTarget.getAttribute('data-id');
            editNews(id);
        });
    });

    document.querySelectorAll('.delete-news').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.currentTarget.getAttribute('data-id');
            deleteNews(id);
        });
    });
}

// Hàm mở modal thêm bài viết
function openNewsModal() {
    currentEditingNews = null;
    document.getElementById('news-modal-title').textContent = 'Thêm bài viết mới';
    resetNewsForm();
    document.getElementById('news-modal').classList.remove('hidden');
}

// Hàm đóng modal bài viết
function closeNewsModal() {
    document.getElementById('news-modal').classList.add('hidden');
    resetNewsForm();
}

// Hàm reset form bài viết
function resetNewsForm() {
    const form = document.getElementById('news-form');
    if (form) {
        form.reset();
    }
    const scheduleField = document.getElementById('schedule-field');
    if (scheduleField) {
        scheduleField.classList.add('hidden');
    }
    const imagePreview = document.getElementById('image-preview');
    if (imagePreview) {
        imagePreview.classList.add('hidden');
    }
    const newsId = document.getElementById('news-id');
    if (newsId) {
        newsId.value = '';
    }
    currentEditingNews = null;
}

// Hàm chỉnh sửa bài viết
function editNews(id) {
    const news = allNewsData.find(item => item.id === id);
    
    if (news) {
        currentEditingNews = id;
        document.getElementById('news-modal-title').textContent = 'Chỉnh sửa bài viết';
        
        // Điền dữ liệu vào form
        document.getElementById('news-title').value = news.title || '';
        document.getElementById('news-category').value = news.category || '';
        document.getElementById('news-status').value = news.status || 'draft';
        document.getElementById('news-priority').value = news.priority || 'medium';
        document.getElementById('news-excerpt').value = news.excerpt || '';
        document.getElementById('news-content').value = news.content || '';
        
        // Xử lý trường lịch trình
        const scheduleField = document.getElementById('schedule-field');
        if (news.status === 'scheduled' && news.scheduleDate) {
            scheduleField.classList.remove('hidden');
            // Format datetime-local
            const scheduleDate = new Date(news.scheduleDate);
            const formattedDate = scheduleDate.toISOString().slice(0, 16);
            document.getElementById('news-schedule').value = formattedDate;
        } else {
            scheduleField.classList.add('hidden');
        }
        
        // Xử lý hình ảnh preview nếu có
        const imagePreview = document.getElementById('image-preview');
        if (news.imageUrl) {
            imagePreview.classList.remove('hidden');
            imagePreview.querySelector('img').src = news.imageUrl;
        } else {
            imagePreview.classList.add('hidden');
        }
        
        document.getElementById('news-modal').classList.remove('hidden');
    } else {
        showNotification('Không tìm thấy bài viết để chỉnh sửa', 'error');
    }
}

// Hàm xem chi tiết bài viết
function viewNews(id) {
    const news = allNewsData.find(item => item.id === id);
    if (news) {
        // Tạo modal xem chi tiết
        const modalHtml = `
            <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div class="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                    <div class="p-6 border-b border-gray-200">
                        <div class="flex justify-between items-center">
                            <h3 class="text-lg font-semibold text-gray-900">${news.title}</h3>
                            <button onclick="closeNewsDetailModal()" class="text-gray-400 hover:text-gray-500">
                                <i class="fas fa-times text-lg"></i>
                            </button>
                        </div>
                    </div>
                    <div class="p-6">
                        <div class="flex flex-wrap gap-2 mb-4">
                            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                ${getCategoryName(news.category)}
                            </span>
                            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                ${getStatusName(news.status)}
                            </span>
                            <span class="text-sm text-gray-500">Lượt xem: ${news.views.toLocaleString()}</span>
                        </div>
                        <div class="prose max-w-none">
                            <p class="text-gray-600 mb-4">${news.excerpt}</p>
                            <div class="text-gray-700 whitespace-pre-line">${news.content}</div>
                        </div>
                        <div class="mt-6 pt-6 border-t border-gray-200">
                            <div class="flex justify-between text-sm text-gray-500">
                                <span>Tác giả: <strong>${news.author}</strong></span>
                                <span>Đăng lúc: ${formatDateTime(news.createdAt)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Tạo và hiển thị modal
        const modalContainer = document.createElement('div');
        modalContainer.id = 'news-detail-modal';
        modalContainer.innerHTML = modalHtml;
        document.body.appendChild(modalContainer);
    }
}

// Hàm đóng modal chi tiết
function closeNewsDetailModal() {
    const modal = document.getElementById('news-detail-modal');
    if (modal) {
        modal.remove();
    }
}

// Hàm xóa bài viết
function deleteNews(id) {
    if (confirm('Bạn có chắc chắn muốn xóa bài viết này? Hành động này không thể hoàn tác.')) {
        allNewsData = allNewsData.filter(item => item.id !== id);
        loadNewsData(currentNewsPage, getCurrentFilters());
        showNotification('Bài viết đã được xóa thành công!');
    }
}

// Helper functions cho news
function getCategoryName(category) {
    const categoryNames = {
        'emergency': 'Khẩn cấp',
        'warning': 'Cảnh báo', 
        'info': 'Thông tin',
        'guidance': 'Hướng dẫn',
        'news': 'Tin tức'
    };
    return categoryNames[category] || category;
}

function getStatusName(status) {
    const statusNames = {
        'published': 'Đã xuất bản',
        'draft': 'Bản nháp',
        'scheduled': 'Lên lịch',
        'archived': 'Đã lưu trữ'
    };
    return statusNames[status] || status;
}

function formatDateTime(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Xử lý upload ảnh
function handleImageUpload(event) {
    const file = event.target.files[0];
    const imagePreview = document.getElementById('image-preview');
    
    if (file && imagePreview) {
        const previewImg = imagePreview.querySelector('img');
        const reader = new FileReader();
        
        reader.onload = function(e) {
            if (previewImg) {
                previewImg.src = e.target.result;
            }
            imagePreview.classList.remove('hidden');
        };
        
        reader.readAsDataURL(file);
    }
}

// Xử lý form submit news
function handleNewsSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const newsData = {
        id: currentEditingNews || 'N' + String(allNewsData.length + 1).padStart(3, '0'),
        title: formData.get('title'),
        category: formData.get('category'),
        status: formData.get('status'),
        priority: formData.get('priority'),
        excerpt: formData.get('excerpt'),
        content: formData.get('content'),
        author: 'Current User',
        views: currentEditingNews ? allNewsData.find(n => n.id === currentEditingNews)?.views || 0 : 0,
        time: currentEditingNews ? allNewsData.find(n => n.id === currentEditingNews)?.time || 'Vừa xong' : 'Vừa xong',
        imageUrl: '',
        scheduleDate: formData.get('status') === 'scheduled' ? formData.get('schedule') : '',
        createdAt: currentEditingNews ? allNewsData.find(n => n.id === currentEditingNews)?.createdAt : new Date().toISOString()
    };
    
    if (currentEditingNews) {
        // Cập nhật bài viết
        const index = allNewsData.findIndex(item => item.id === currentEditingNews);
        if (index !== -1) {
            allNewsData[index] = { ...allNewsData[index], ...newsData };
        }
        showNotification('Bài viết đã được cập nhật thành công!');
    } else {
        // Thêm bài viết mới
        allNewsData.unshift(newsData);
        showNotification('Bài viết đã được thêm thành công!');
    }
    
    closeNewsModal();
    loadNewsData(currentNewsPage, getCurrentFilters());
}

// Hàm debounce cho search
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ==================== CÁC HÀM KHÁC GIỮ NGUYÊN ====================

// Helper Functions (giữ nguyên)
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

// Modal Functions (giữ nguyên)
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

// Form Handlers (giữ nguyên)
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

// Sync Functions (giữ nguyên)
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

// Notification System (giữ nguyên)
function showNotification(message, type = 'success') {
    // Tạo toast notification đơn giản
    const toast = document.createElement('div');
    toast.className = `fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg text-white ${
        type === 'success' ? 'bg-green-500' : 'bg-red-500'
    }`;
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    // Tự động xóa sau 3 giây
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// Quick Actions (giữ nguyên)
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
    editNews(id);
};

window.deleteNews = function(id) {
    deleteNews(id);
};

window.openNewsModal = function() {
    openNewsModal();
};

window.closeNewsModal = function() {
    closeNewsModal();
};

// Reports management function (giữ nguyên)
function setupReportsManagement() {
    // Thêm event listeners cho reports nếu cần
}

// Thêm CSS cho line-clamp nếu chưa có
const style = document.createElement('style');
style.textContent = `
    .line-clamp-2 {
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }
    .line-clamp-3 {
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }
    .hidden {
        display: none !important;
    }
`;
document.head.appendChild(style);










































//sự cố đang sử lý
// admin.js

document.addEventListener('DOMContentLoaded', function() {
    // Khởi tạo tab system
    initTabSystem();
    
    // Khởi tạo các chức năng khác
    initDashboard();
    initNewsManagement();
    initWeatherManagement();
    initReportsManagement();
    initIncidentsManagement();
    initUsersManagement();
});

// Hàm khởi tạo hệ thống tab
function initTabSystem() {
    const navItems = document.querySelectorAll('.nav-item');
    const tabContents = document.querySelectorAll('.tab-content');
    
    // Ẩn tất cả tab content trừ tab đầu tiên
    tabContents.forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Hiển thị tab đầu tiên (dashboard)
    const firstTab = document.getElementById('dashboard');
    if (firstTab) {
        firstTab.classList.add('active');
    }
    
    // Xử lý sự kiện click trên menu
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Xóa active class từ tất cả nav items
            navItems.forEach(nav => {
                nav.classList.remove('active', 'bg-red-600', 'text-white');
                nav.classList.add('text-gray-300', 'hover:text-white', 'hover:bg-gray-800');
            });
            
            // Thêm active class cho nav item được click
            this.classList.add('active', 'bg-red-600', 'text-white');
            this.classList.remove('text-gray-300', 'hover:text-white', 'hover:bg-gray-800');
            
            // Ẩn tất cả tab content
            tabContents.forEach(tab => {
                tab.classList.remove('active');
            });
            
            // Hiển thị tab content tương ứng
            const tabName = this.getAttribute('data-tab');
            const targetTab = document.getElementById(tabName);
            if (targetTab) {
                targetTab.classList.add('active');
                
                // Cập nhật tiêu đề trang
                updatePageTitle(tabName);
            }
        });
    });
}

// Hàm cập nhật tiêu đề trang
function updatePageTitle(tabName) {
    const pageTitle = document.getElementById('page-title');
    const pageDescription = document.getElementById('page-description');
    
    const titles = {
        'dashboard': {
            title: 'Dashboard',
            description: 'Tổng quan hệ thống cứu hộ quốc gia'
        },
        'news': {
            title: 'Quản lý Tin tức',
            description: 'Quản lý tin tức và bài viết hệ thống'
        },
        'weather': {
            title: 'Quản lý Thời tiết',
            description: 'Dự báo thời tiết và cảnh báo thiên tai'
        },
        'reports': {
            title: 'Báo cáo Sự cố',
            description: 'Quản lý báo cáo sự cố từ người dùng'
        },
        'incidents': {
            title: 'Sự cố Đang xử lý',
            description: 'Theo dõi và quản lý các sự cố đang được xử lý'
        },
        'users': {
            title: 'Quản lý Tài khoản',
            description: 'Quản lý tài khoản người dùng hệ thống'
        },
        'roles': {
            title: 'Quản lý Phân quyền',
            description: 'Quản lý phân quyền và vai trò người dùng'
        },
        'analytics': {
            title: 'Phân tích & Báo cáo',
            description: 'Phân tích dữ liệu và báo cáo hệ thống'
        },
        'settings': {
            title: 'Cài đặt Hệ thống',
            description: 'Cấu hình hệ thống và các tùy chọn nâng cao'
        },
        'logs': {
            title: 'Nhật ký Hệ thống',
            description: 'Nhật ký hoạt động hệ thống'
        }
    };
    
    if (titles[tabName]) {
        pageTitle.textContent = titles[tabName].title;
        pageDescription.textContent = titles[tabName].description;
    }
}

// Hàm khởi tạo dashboard
function initDashboard() {
    // Khởi tạo biểu đồ
    initActivityChart();
    
    // Xử lý filter biểu đồ
    document.querySelectorAll('.chart-filter').forEach(button => {
        button.addEventListener('click', function() {
            document.querySelectorAll('.chart-filter').forEach(btn => {
                btn.classList.remove('active', 'bg-red-600', 'text-white');
                btn.classList.add('bg-gray-100', 'text-gray-700');
            });
            
            this.classList.add('active', 'bg-red-600', 'text-white');
            this.classList.remove('bg-gray-100', 'text-gray-700');
            
            // Cập nhật biểu đồ theo period
            const period = this.getAttribute('data-period');
            updateActivityChart(period);
        });
    });
    
    // Xử lý quick actions
    document.querySelectorAll('.quick-action-btn').forEach(button => {
        button.addEventListener('click', function() {
            const action = this.getAttribute('data-action');
            handleQuickAction(action);
        });
    });
}

// Hàm xử lý quick actions
function handleQuickAction(action) {
    switch(action) {
        case 'add-news':
            showNewsModal();
            break;
        case 'add-weather':
            showWeatherModal();
            break;
        case 'add-user':
            showUserModal();
            break;
        case 'view-reports':
            // Chuyển đến tab reports
            document.querySelector('[data-tab="reports"]').click();
            break;
    }
}

// Hàm khởi tạo biểu đồ
function initActivityChart() {
    const ctx = document.getElementById('activityChart').getContext('2d');
    
    // Dữ liệu mẫu cho biểu đồ
    const data = {
        labels: ['6:00', '8:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00'],
        datasets: [
            {
                label: 'Báo cáo sự cố',
                data: [12, 19, 3, 5, 2, 3, 15, 8, 4],
                borderColor: '#ef4444',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                tension: 0.4,
                fill: true
            },
            {
                label: 'Tin tức đăng',
                data: [2, 3, 10, 8, 5, 7, 4, 6, 3],
                borderColor: '#3b82f6',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                tension: 0.4,
                fill: true
            }
        ]
    };
    
    const config = {
        type: 'line',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                },
                tooltip: {
                    mode: 'index',
                    intersect: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        drawBorder: false
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    };
    
    new Chart(ctx, config);
}

function updateActivityChart(period) {
    // Cập nhật biểu đồ theo period
    console.log('Cập nhật biểu đồ với period:', period);
}

// Hàm khởi tạo quản lý tin tức
function initNewsManagement() {
    // Toggle advanced filters
    document.getElementById('toggle-news-filters').addEventListener('click', function() {
        const filters = document.getElementById('advanced-news-filters');
        filters.classList.toggle('hidden');
    });
    
    // Xử lý thêm tin tức
    document.getElementById('add-news-btn').addEventListener('click', showNewsModal);
    
    // Xử lý đóng modal
    document.getElementById('close-news-modal').addEventListener('click', hideNewsModal);
    document.getElementById('cancel-news').addEventListener('click', hideNewsModal);
    
    // Xử lý upload ảnh
    document.getElementById('image-upload').addEventListener('change', handleImageUpload);
    
    // Xử lý lưu tin tức
    document.getElementById('publish-news-btn').addEventListener('click', publishNews);
    document.getElementById('save-draft-btn').addEventListener('click', saveNewsAsDraft);
    
    // Xử lý thay đổi trạng thái
    document.getElementById('news-status').addEventListener('change', function() {
        const scheduleField = document.getElementById('schedule-field');
        if (this.value === 'scheduled') {
            scheduleField.classList.remove('hidden');
        } else {
            scheduleField.classList.add('hidden');
        }
    });
    
    // Tải dữ liệu tin tức
    loadNewsData();
}

function showNewsModal() {
    document.getElementById('news-modal').classList.remove('hidden');
    document.getElementById('news-modal-title').textContent = 'Thêm bài viết mới';
    document.getElementById('news-form').reset();
    document.getElementById('schedule-field').classList.add('hidden');
    document.getElementById('image-preview').classList.add('hidden');
}

function hideNewsModal() {
    document.getElementById('news-modal').classList.add('hidden');
}

function handleImageUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const preview = document.getElementById('image-preview');
            const img = preview.querySelector('img');
            img.src = e.target.result;
            preview.classList.remove('hidden');
        }
        reader.readAsDataURL(file);
    }
}

function publishNews() {
    // Xử lý xuất bản tin tức
    const formData = new FormData(document.getElementById('news-form'));
    console.log('Xuất bản tin tức:', formData);
    showNotification('Đã xuất bản tin tức thành công!', 'success');
    hideNewsModal();
}

function saveNewsAsDraft() {
    // Xử lý lưu nháp
    const formData = new FormData(document.getElementById('news-form'));
    console.log('Lưu nháp tin tức:', formData);
    showNotification('Đã lưu tin tức vào bản nháp!', 'success');
    hideNewsModal();
}

function loadNewsData() {
    // Tải dữ liệu tin tức từ API
    // Đây là dữ liệu mẫu
    const newsData = [
        {
            id: 1,
            title: 'Cảnh báo mưa lớn tại miền Trung',
            category: 'warning',
            status: 'published',
            views: 1247,
            date: '2025-01-10'
        },
        {
            id: 2,
            title: 'Hướng dẫn sơ cứu khi gặp tai nạn',
            category: 'guidance',
            status: 'published',
            views: 856,
            date: '2025-01-09'
        }
    ];
    
    // Hiển thị dữ liệu lên grid
    renderNewsGrid(newsData);
}

function renderNewsGrid(news) {
    const container = document.getElementById('news-grid-container');
    // Code để render news grid
}

// Hàm khởi tạo quản lý thời tiết
function initWeatherManagement() {
    document.getElementById('add-weather-btn').addEventListener('click', showWeatherModal);
    document.getElementById('close-weather-modal').addEventListener('click', hideWeatherModal);
    document.getElementById('cancel-weather').addEventListener('click', hideWeatherModal);
    document.getElementById('weather-form').addEventListener('submit', saveWeather);
    
    loadWeatherData();
}

function showWeatherModal() {
    document.getElementById('weather-modal').classList.remove('hidden');
}

function hideWeatherModal() {
    document.getElementById('weather-modal').classList.add('hidden');
}

function saveWeather(e) {
    e.preventDefault();
    // Xử lý lưu dự báo thời tiết
    showNotification('Đã lưu dự báo thời tiết thành công!', 'success');
    hideWeatherModal();
}

function loadWeatherData() {
    // Tải dữ liệu thời tiết
}

// Hàm khởi tạo quản lý báo cáo
function initReportsManagement() {
    document.getElementById('toggle-reports-filters').addEventListener('click', function() {
        const filters = document.getElementById('advanced-reports-filters');
        filters.classList.toggle('hidden');
    });
    
    document.getElementById('add-report-btn').addEventListener('click', showReportModal);
    document.getElementById('close-report-modal').addEventListener('click', hideReportModal);
    document.getElementById('cancel-report').addEventListener('click', hideReportModal);
    document.getElementById('report-form').addEventListener('submit', saveReport);
    
    // Xử lý upload ảnh cho báo cáo
    document.getElementById('report-image-upload').addEventListener('change', handleReportImageUpload);
    
    loadReportsData();
}

function showReportModal() {
    document.getElementById('report-modal').classList.remove('hidden');
}

function hideReportModal() {
    document.getElementById('report-modal').classList.add('hidden');
}

function handleReportImageUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const preview = document.getElementById('report-image-preview');
            const img = preview.querySelector('img');
            img.src = e.target.result;
            preview.classList.remove('hidden');
        }
        reader.readAsDataURL(file);
    }
}

function saveReport(e) {
    e.preventDefault();
    // Xử lý lưu báo cáo
    showNotification('Đã lưu báo cáo thành công!', 'success');
    hideReportModal();
}

function loadReportsData() {
    // Tải dữ liệu báo cáo
}

// Hàm khởi tạo quản lý sự cố
function initIncidentsManagement() {
    document.getElementById('toggle-incidents-filters').addEventListener('click', function() {
        const filters = document.getElementById('advanced-incidents-filters');
        filters.classList.toggle('hidden');
    });
    
    // Xử lý các nút thao tác sự cố
    document.querySelectorAll('.verify-incident-btn').forEach(button => {
        button.addEventListener('click', function() {
            const incidentId = this.getAttribute('data-id');
            verifyIncident(incidentId);
        });
    });
    
    document.querySelectorAll('.reject-incident-btn').forEach(button => {
        button.addEventListener('click', function() {
            const incidentId = this.getAttribute('data-id');
            rejectIncident(incidentId);
        });
    });
    
    document.querySelectorAll('.view-incident-btn').forEach(button => {
        button.addEventListener('click', function() {
            const incidentId = this.getAttribute('data-id');
            viewIncident(incidentId);
        });
    });
    
    document.querySelectorAll('.assign-incident-btn').forEach(button => {
        button.addEventListener('click', function() {
            const incidentId = this.getAttribute('data-id');
            assignIncident(incidentId);
        });
    });
    
    document.querySelectorAll('.request-info-btn').forEach(button => {
        button.addEventListener('click', function() {
            const incidentId = this.getAttribute('data-id');
            requestInfoIncident(incidentId);
        });
    });
}

// Hàm khởi tạo quản lý người dùng
function initUsersManagement() {
    document.getElementById('add-user-btn').addEventListener('click', showUserModal);
    loadUsersData();
}

function showUserModal() {
    // Hiển thị modal thêm người dùng
    alert('Modal thêm người dùng sẽ được hiển thị ở đây');
}

function loadUsersData() {
    // Tải dữ liệu người dùng
}

// Hàm hiển thị thông báo
function showNotification(message, type = 'success') {
    const notification = document.getElementById('success-notification');
    const messageEl = document.getElementById('notification-message');
    
    messageEl.textContent = message;
    
    // Thay đổi màu sắc theo type
    if (type === 'error') {
        notification.classList.remove('bg-green-500');
        notification.classList.add('bg-red-500');
    } else {
        notification.classList.remove('bg-red-500');
        notification.classList.add('bg-green-500');
    }
    
    notification.classList.remove('hidden');
    
    // Tự động ẩn sau 3 giây
    setTimeout(() => {
        notification.classList.add('hidden');
    }, 3000);
}

// Hàm xử lý đồng bộ dữ liệu
document.getElementById('sync-data-btn').addEventListener('click', function() {
    showNotification('Đang đồng bộ dữ liệu...', 'success');
    // Gọi API đồng bộ
    setTimeout(() => {
        showNotification('Đồng bộ dữ liệu thành công!', 'success');
    }, 2000);
});

// Hàm toggle sidebar trên mobile
document.getElementById('sidebar-toggle').addEventListener('click', function() {
    const sidebar = document.querySelector('.sidebar');
    sidebar.classList.toggle('hidden');
    sidebar.classList.toggle('md:flex');
});