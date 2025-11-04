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





// banr tinn 
 // Dữ liệu mẫu theo form mới
        const sampleNewsData = [
            // ... (dữ liệu bạn đã cung cấp)
            // Để tiết kiệm không gian, tôi đã rút gọn dữ liệu ở đây
            // Trong thực tế, bạn có thể dán toàn bộ dữ liệu vào đây
            {
                id: 'INC001',
                type: 'fire',
                status: 'active',
                priority: 'high',
                title: 'Cháy chung cư tại Cầu Giấy',
                address: '123 Trần Duy Hưng, Cầu Giấy, Hà Nội',
                province: 'Hà Nội',
                time: '15:30, 12/11/2023',
                description: 'Cháy lớn tại tầng 12 chung cư Golden West, nhiều người mắc kẹt bên trong. Lực lượng cứu hộ đang có mặt tại hiện trường.',
                reporter: { name: 'Nguyễn Văn A', phone: '0912 345 678' },
                timeline: [
                    { time: '15:25', action: 'Tiếp nhận báo cáo sự cố' },
                    { time: '15:28', action: 'Điều động đội PCCC' },
                    { time: '15:35', action: 'Lực lượng có mặt tại hiện trường' }
                ]
            },
            {
                id: 'INC002',
                type: 'flood',
                status: 'active',
                priority: 'medium',
                title: 'Ngập nước nghiêm trọng tại Quận 1',
                address: 'Đường Nguyễn Huệ, Quận 1, TP.HCM',
                province: 'TP.HCM',
                time: '14:15, 12/11/2023',
                description: 'Ngập nước sâu 0.5m sau cơn mưa lớn, nhiều phương tiện bị kẹt. Đội cứu hộ đang hỗ trợ người dân di chuyển.',
                reporter: { name: 'Trần Thị B', phone: '0934 567 890' },
                timeline: [
                    { time: '14:10', action: 'Tiếp nhận báo cáo sự cố' },
                    { time: '14:12', action: 'Cảnh báo người dân' },
                    { time: '14:20', action: 'Triển khai lực lượng ứng phó' }
                ]
            },
            // ... thêm các mục khác
        ];

        // Biến toàn cục
        let currentNewsData = [...sampleNewsData];
        let currentEditingId = null;
        let currentPage = 1;
        const itemsPerPage = 10;

        // Khởi tạo ứng dụng
        document.addEventListener('DOMContentLoaded', function() {
            renderNewsTable();
            setupEventListeners();
        });

        // Render bảng tin tức
        function renderNewsTable(data = currentNewsData) {
            const tableBody = document.getElementById('news-table-body');
            tableBody.innerHTML = '';

            if (data.length === 0) {
                tableBody.innerHTML = `
                    <tr>
                        <td colspan="8">
                            <div class="empty-state">
                                <i class="fas fa-inbox"></i>
                                <h3>Không có dữ liệu</h3>
                                <p>Không tìm thấy sự cố nào phù hợp với bộ lọc của bạn.</p>
                            </div>
                        </td>
                    </tr>
                `;
                return;
            }

            // Tính toán phân trang
            const startIndex = (currentPage - 1) * itemsPerPage;
            const endIndex = startIndex + itemsPerPage;
            const paginatedData = data.slice(startIndex, endIndex);

            paginatedData.forEach(item => {
                const row = document.createElement('tr');
                
                // Xác định class cho badge dựa trên loại sự cố
                let typeClass = '';
                let typeText = '';
                switch(item.type) {
                    case 'fire':
                        typeClass = 'badge-fire';
                        typeText = 'Cháy';
                        break;
                    case 'flood':
                        typeClass = 'badge-flood';
                        typeText = 'Ngập lụt';
                        break;
                    case 'accident':
                        typeClass = 'badge-accident';
                        typeText = 'Tai nạn';
                        break;
                    case 'disaster':
                        typeClass = 'badge-disaster';
                        typeText = 'Thiên tai';
                        break;
                }
                
                // Xác định class cho trạng thái
                let statusClass = item.status === 'active' ? 'badge-active' : 'badge-resolved';
                let statusText = item.status === 'active' ? 'Đang hoạt động' : 'Đã giải quyết';
                
                // Xác định class cho mức độ ưu tiên
                let priorityClass = '';
                let priorityText = '';
                switch(item.priority) {
                    case 'high':
                        priorityClass = 'badge-high';
                        priorityText = 'Cao';
                        break;
                    case 'medium':
                        priorityClass = 'badge-medium';
                        priorityText = 'Trung bình';
                        break;
                    case 'low':
                        priorityClass = 'badge-low';
                        priorityText = 'Thấp';
                        break;
                }
                
                row.innerHTML = `
                    <td>${item.id}</td>
                    <td>${item.title}</td>
                    <td>${item.address}</td>
                    <td>${item.time}</td>
                    <td><span class="badge ${typeClass}">${typeText}</span></td>
                    <td><span class="badge ${statusClass}">${statusText}</span></td>
                    <td><span class="badge ${priorityClass}">${priorityText}</span></td>
                    <td>
                        <div class="actions">
                            <button class="action-btn action-view" data-id="${item.id}">
                                <i class="fas fa-eye"></i> Xem
                            </button>
                            <button class="action-btn action-edit" data-id="${item.id}">
                                <i class="fas fa-edit"></i> Sửa
                            </button>
                            <button class="action-btn action-delete" data-id="${item.id}">
                                <i class="fas fa-trash"></i> Xóa
                            </button>
                        </div>
                    </td>
                `;
                
                tableBody.appendChild(row);
            });
            
            renderPagination(data.length);
        }

        // Render phân trang
        function renderPagination(totalItems) {
            const pagination = document.getElementById('pagination');
            pagination.innerHTML = '';
            
            const totalPages = Math.ceil(totalItems / itemsPerPage);
            
            if (totalPages <= 1) return;
            
            // Nút Previous
            const prevButton = document.createElement('button');
            prevButton.innerHTML = '<i class="fas fa-chevron-left"></i>';
            prevButton.disabled = currentPage === 1;
            prevButton.addEventListener('click', () => {
                if (currentPage > 1) {
                    currentPage--;
                    renderNewsTable();
                }
            });
            pagination.appendChild(prevButton);
            
            // Các nút trang
            for (let i = 1; i <= totalPages; i++) {
                const pageButton = document.createElement('button');
                pageButton.textContent = i;
                pageButton.classList.toggle('active', i === currentPage);
                pageButton.addEventListener('click', () => {
                    currentPage = i;
                    renderNewsTable();
                });
                pagination.appendChild(pageButton);
            }
            
            // Nút Next
            const nextButton = document.createElement('button');
            nextButton.innerHTML = '<i class="fas fa-chevron-right"></i>';
            nextButton.disabled = currentPage === totalPages;
            nextButton.addEventListener('click', () => {
                if (currentPage < totalPages) {
                    currentPage++;
                    renderNewsTable();
                }
            });
            pagination.appendChild(nextButton);
        }

        // Thiết lập event listeners
        function setupEventListeners() {
            // Nút thêm tin tức
            document.getElementById('add-news-btn').addEventListener('click', openAddModal);
            
            // Nút đóng modal
            document.getElementById('close-detail-modal').addEventListener('click', closeDetailModal);
            document.getElementById('close-detail-btn').addEventListener('click', closeDetailModal);
            document.getElementById('close-edit-modal').addEventListener('click', closeEditModal);
            document.getElementById('cancel-edit-btn').addEventListener('click', closeEditModal);
            
            // Nút lưu tin tức
            document.getElementById('save-news-btn').addEventListener('click', saveNews);
            
            // Nút thêm mốc thời gian
            document.getElementById('add-timeline-btn').addEventListener('click', addTimelineItem);
            
            // Bộ lọc
            document.getElementById('type-filter').addEventListener('change', applyFilters);
            document.getElementById('status-filter').addEventListener('change', applyFilters);
            document.getElementById('priority-filter').addEventListener('change', applyFilters);
            document.getElementById('search').addEventListener('input', applyFilters);
            
            // Nút đồng bộ và xuất Excel
            document.getElementById('sync-btn').addEventListener('click', syncData);
            document.getElementById('export-btn').addEventListener('click', exportToExcel);
            
            // Xử lý sự kiện click trên bảng (cho các nút xem, sửa, xóa)
            document.getElementById('news-table-body').addEventListener('click', function(e) {
                const target = e.target.closest('button');
                if (!target) return;
                
                const id = target.getAttribute('data-id');
                if (!id) return;
                
                if (target.classList.contains('action-view')) {
                    viewNewsDetail(id);
                } else if (target.classList.contains('action-edit')) {
                    editNews(id);
                } else if (target.classList.contains('action-delete')) {
                    deleteNews(id);
                }
            });
        }

        // Mở modal thêm tin tức
        function openAddModal() {
            currentEditingId = null;
            document.getElementById('edit-modal-title').textContent = 'Thêm sự cố mới';
            document.getElementById('news-form').reset();
            
            // Xóa tất cả các mục timeline trừ mẫu đầu tiên
            const timelineContainer = document.getElementById('timeline-container');
            timelineContainer.innerHTML = `
                <div class="timeline-item">
                    <div class="form-group" style="margin-bottom: 10px;">
                        <input type="text" class="timeline-time" placeholder="Thời gian" required>
                    </div>
                    <div class="form-group" style="margin-bottom: 10px; flex: 1;">
                        <input type="text" class="timeline-action" placeholder="Hành động" required>
                    </div>
                    <button type="button" class="action-btn action-delete remove-timeline-btn" style="margin-left: 10px;">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            `;
            
            // Thêm event listener cho nút xóa timeline
            document.querySelectorAll('.remove-timeline-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    this.closest('.timeline-item').remove();
                });
            });
            
            document.getElementById('edit-modal').style.display = 'flex';
        }

        // Đóng modal chi tiết
        function closeDetailModal() {
            document.getElementById('detail-modal').style.display = 'none';
        }

        // Đóng modal chỉnh sửa
        function closeEditModal() {
            document.getElementById('edit-modal').style.display = 'none';
        }

        // Xem chi tiết tin tức
        function viewNewsDetail(id) {
            const newsItem = currentNewsData.find(item => item.id === id);
            if (!newsItem) return;
            
            const modalBody = document.getElementById('detail-modal-body');
            
            let typeText = '';
            switch(newsItem.type) {
                case 'fire':
                    typeText = 'Cháy';
                    break;
                case 'flood':
                    typeText = 'Ngập lụt';
                    break;
                case 'accident':
                    typeText = 'Tai nạn';
                    break;
                case 'disaster':
                    typeText = 'Thiên tai';
                    break;
            }
            
            let statusText = newsItem.status === 'active' ? 'Đang hoạt động' : 'Đã giải quyết';
            
            let priorityText = '';
            switch(newsItem.priority) {
                case 'high':
                    priorityText = 'Cao';
                    break;
                case 'medium':
                    priorityText = 'Trung bình';
                    break;
                case 'low':
                    priorityText = 'Thấp';
                    break;
            }
            
            modalBody.innerHTML = `
                <div class="form-group">
                    <label>ID sự cố</label>
                    <p>${newsItem.id}</p>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Loại sự cố</label>
                        <p>${typeText}</p>
                    </div>
                    <div class="form-group">
                        <label>Trạng thái</label>
                        <p>${statusText}</p>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Mức độ ưu tiên</label>
                        <p>${priorityText}</p>
                    </div>
                    <div class="form-group">
                        <label>Thời gian</label>
                        <p>${newsItem.time}</p>
                    </div>
                </div>
                <div class="form-group">
                    <label>Tiêu đề</label>
                    <p>${newsItem.title}</p>
                </div>
                <div class="form-group">
                    <label>Địa chỉ</label>
                    <p>${newsItem.address}</p>
                </div>
                <div class="form-group">
                    <label>Tỉnh/Thành phố</label>
                    <p>${newsItem.province}</p>
                </div>
                <div class="form-group">
                    <label>Mô tả</label>
                    <p>${newsItem.description}</p>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Người báo cáo</label>
                        <p>${newsItem.reporter.name}</p>
                    </div>
                    <div class="form-group">
                        <label>Số điện thoại</label>
                        <p>${newsItem.reporter.phone}</p>
                    </div>
                </div>
                <div class="form-group">
                    <label>Dòng thời gian</label>
                    <div class="timeline">
                        ${newsItem.timeline.map(item => `
                            <div class="timeline-item">
                                <div class="timeline-time">${item.time}</div>
                                <div class="timeline-action">${item.action}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
            
            document.getElementById('detail-modal').style.display = 'flex';
        }

        // Chỉnh sửa tin tức
        function editNews(id) {
            const newsItem = currentNewsData.find(item => item.id === id);
            if (!newsItem) return;
            
            currentEditingId = id;
            document.getElementById('edit-modal-title').textContent = 'Chỉnh sửa sự cố';
            
            // Điền dữ liệu vào form
            document.getElementById('incident-id').value = newsItem.id;
            document.getElementById('incident-type').value = newsItem.type;
            document.getElementById('incident-status').value = newsItem.status;
            document.getElementById('incident-priority').value = newsItem.priority;
            document.getElementById('incident-title').value = newsItem.title;
            document.getElementById('incident-address').value = newsItem.address;
            document.getElementById('incident-province').value = newsItem.province;
            document.getElementById('incident-time').value = newsItem.time;
            document.getElementById('incident-description').value = newsItem.description;
            document.getElementById('reporter-name').value = newsItem.reporter.name;
            document.getElementById('reporter-phone').value = newsItem.reporter.phone;
            
            // Điền dữ liệu timeline
            const timelineContainer = document.getElementById('timeline-container');
            timelineContainer.innerHTML = '';
            
            newsItem.timeline.forEach(item => {
                const timelineItem = document.createElement('div');
                timelineItem.className = 'timeline-item';
                timelineItem.innerHTML = `
                    <div class="form-group" style="margin-bottom: 10px;">
                        <input type="text" class="timeline-time" value="${item.time}" required>
                    </div>
                    <div class="form-group" style="margin-bottom: 10px; flex: 1;">
                        <input type="text" class="timeline-action" value="${item.action}" required>
                    </div>
                    <button type="button" class="action-btn action-delete remove-timeline-btn" style="margin-left: 10px;">
                        <i class="fas fa-times"></i>
                    </button>
                `;
                timelineContainer.appendChild(timelineItem);
            });
            
            // Thêm event listener cho nút xóa timeline
            document.querySelectorAll('.remove-timeline-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    this.closest('.timeline-item').remove();
                });
            });
            
            document.getElementById('edit-modal').style.display = 'flex';
        }

        // Thêm mốc thời gian
        function addTimelineItem() {
            const timelineContainer = document.getElementById('timeline-container');
            const timelineItem = document.createElement('div');
            timelineItem.className = 'timeline-item';
            timelineItem.innerHTML = `
                <div class="form-group" style="margin-bottom: 10px;">
                    <input type="text" class="timeline-time" placeholder="Thời gian" required>
                </div>
                <div class="form-group" style="margin-bottom: 10px; flex: 1;">
                    <input type="text" class="timeline-action" placeholder="Hành động" required>
                </div>
                <button type="button" class="action-btn action-delete remove-timeline-btn" style="margin-left: 10px;">
                    <i class="fas fa-times"></i>
                </button>
            `;
            timelineContainer.appendChild(timelineItem);
            
            // Thêm event listener cho nút xóa timeline mới
            timelineItem.querySelector('.remove-timeline-btn').addEventListener('click', function() {
                this.closest('.timeline-item').remove();
            });
        }

        // Lưu tin tức
        function saveNews() {
            const form = document.getElementById('news-form');
            if (!form.checkValidity()) {
                form.reportValidity();
                return;
            }
            
            // Thu thập dữ liệu từ form
            const newsData = {
                id: document.getElementById('incident-id').value,
                type: document.getElementById('incident-type').value,
                status: document.getElementById('incident-status').value,
                priority: document.getElementById('incident-priority').value,
                title: document.getElementById('incident-title').value,
                address: document.getElementById('incident-address').value,
                province: document.getElementById('incident-province').value,
                time: document.getElementById('incident-time').value,
                description: document.getElementById('incident-description').value,
                reporter: {
                    name: document.getElementById('reporter-name').value,
                    phone: document.getElementById('reporter-phone').value
                },
                timeline: []
            };
            
            // Thu thập dữ liệu timeline
            const timelineItems = document.querySelectorAll('.timeline-item');
            timelineItems.forEach(item => {
                const time = item.querySelector('.timeline-time').value;
                const action = item.querySelector('.timeline-action').value;
                if (time && action) {
                    newsData.timeline.push({ time, action });
                }
            });
            
            if (currentEditingId) {
                // Cập nhật tin tức hiện có
                const index = currentNewsData.findIndex(item => item.id === currentEditingId);
                if (index !== -1) {
                    currentNewsData[index] = newsData;
                }
            } else {
                // Thêm tin tức mới
                currentNewsData.unshift(newsData);
            }
            
            // Đóng modal và render lại bảng
            closeEditModal();
            renderNewsTable();
            
            // Hiển thị thông báo thành công
            alert(currentEditingId ? 'Cập nhật sự cố thành công!' : 'Thêm sự cố mới thành công!');
        }

        // Xóa tin tức
        function deleteNews(id) {
            if (confirm('Bạn có chắc chắn muốn xóa sự cố này?')) {
                currentNewsData = currentNewsData.filter(item => item.id !== id);
                renderNewsTable();
                alert('Xóa sự cố thành công!');
            }
        }

        // Áp dụng bộ lọc
        function applyFilters() {
            const typeFilter = document.getElementById('type-filter').value;
            const statusFilter = document.getElementById('status-filter').value;
            const priorityFilter = document.getElementById('priority-filter').value;
            const searchTerm = document.getElementById('search').value.toLowerCase();
            
            let filteredData = [...sampleNewsData];
            
            // Lọc theo loại sự cố
            if (typeFilter !== 'all') {
                filteredData = filteredData.filter(item => item.type === typeFilter);
            }
            
            // Lọc theo trạng thái
            if (statusFilter !== 'all') {
                filteredData = filteredData.filter(item => item.status === statusFilter);
            }
            
            // Lọc theo mức độ ưu tiên
            if (priorityFilter !== 'all') {
                filteredData = filteredData.filter(item => item.priority === priorityFilter);
            }
            
            // Lọc theo từ khóa tìm kiếm
            if (searchTerm) {
                filteredData = filteredData.filter(item => 
                    item.title.toLowerCase().includes(searchTerm) ||
                    item.address.toLowerCase().includes(searchTerm) ||
                    item.province.toLowerCase().includes(searchTerm) ||
                    item.description.toLowerCase().includes(searchTerm)
                );
            }
            
            currentNewsData = filteredData;
            currentPage = 1;
            renderNewsTable();
        }

        // Đồng bộ dữ liệu
        function syncData() {
            // Giả lập đồng bộ dữ liệu
            alert('Đang đồng bộ dữ liệu...');
            setTimeout(() => {
                alert('Đồng bộ dữ liệu thành công!');
            }, 1000);
        }

        // Xuất Excel
        function exportToExcel() {
            // Giả lập xuất Excel
            alert('Đang xuất dữ liệu ra Excel...');
            setTimeout(() => {
                alert('Xuất dữ liệu thành công!');
            }, 1000);
        }



























        
// quản lý bài viết bản tin
// Thêm biến toàn cục cho phân trang
let currentNewsPage = 1;
const newsPerPage = 6; // Hiển thị 6 bài mỗi trang

// Cập nhật hàm loadNewsData để hỗ trợ phân trang
function loadNewsData(page = 1) {
    const container = document.getElementById('news-grid-container');
    if (!container) return;
    
    container.innerHTML = '';

    // Dữ liệu mẫu mở rộng (thêm nhiều bài viết)
    const sampleNews = [
        {
            id: 'N001',
            title: 'Cảnh báo bão số 8 hướng vào đất liền',
            category: 'emergency',
            status: 'published',
            excerpt: 'Bão số 8 dự kiến đổ bộ vào các tỉnh miền Trung với sức gió mạnh cấp 10-11, giật cấp 13. Người dân cần chủ động các biện pháp phòng tránh.',
            views: 2400,
            time: '2 giờ trước',
            author: 'Admin System',
            priority: 'high'
        },
        {
            id: 'N002',
            title: 'Hướng dẫn sơ cứu khi bị điện giật',
            category: 'guidance', 
            status: 'published',
            excerpt: 'Các bước sơ cứu cơ bản khi gặp nạn nhân bị điện giật cần thực hiện ngay lập tức để tránh nguy hiểm tính mạng.',
            views: 1800,
            time: '5 giờ trước',
            author: 'Nguyễn Văn A',
            priority: 'medium'
        },
        {
            id: 'N003',
            title: 'Thông báo lịch cứu hộ dịp lễ 30/4',
            category: 'info',
            status: 'scheduled',
            excerpt: 'Lịch trực và phương án cứu hộ được triển khai trong dịp lễ 30/4 - 1/5 để đảm bảo an toàn cho người dân.',
            views: 950,
            time: '1 ngày trước',
            author: 'Trần Thị B',
            priority: 'low'
        },
        // Thêm nhiều bài viết hơn
        {
            id: 'N004',
            title: 'Cảnh báo lũ quét tại khu vực miền núi phía Bắc',
            category: 'emergency',
            status: 'published',
            excerpt: 'Mưa lớn kéo dài có nguy cơ gây lũ quét tại các tỉnh miền núi phía Bắc. Người dân cần đề phòng.',
            views: 3200,
            time: '3 giờ trước',
            author: 'Admin System',
            priority: 'high'
        },
        {
            id: 'N005',
            title: 'Hướng dẫn phòng chống cháy nổ mùa khô',
            category: 'guidance',
            status: 'published',
            excerpt: 'Các biện pháp phòng chống cháy nổ hiệu quả trong mùa khô hanh cần được thực hiện nghiêm ngặt.',
            views: 2100,
            time: '6 giờ trước',
            author: 'Lê Văn C',
            priority: 'medium'
        },
        {
            id: 'N006',
            title: 'Thông tin về tình hình giao thông dịp nghỉ lễ',
            category: 'info',
            status: 'published',
            excerpt: 'Cập nhật tình hình giao thông và các tuyến đường hay xảy ra ùn tắc trong dịp nghỉ lễ sắp tới.',
            views: 1500,
            time: '1 ngày trước',
            author: 'Phạm Thị D',
            priority: 'low'
        },
        {
            id: 'N007',
            title: 'Cảnh báo nguy cơ sạt lở đất tại miền Trung',
            category: 'warning',
            status: 'published',
            excerpt: 'Mưa lớn kéo dài làm tăng nguy cơ sạt lở đất tại các tỉnh miền Trung. Người dân cần cảnh giác.',
            views: 2800,
            time: '4 giờ trước',
            author: 'Admin System',
            priority: 'high'
        },
        {
            id: 'N008',
            title: 'Hướng dẫn sơ tán khi có thiên tai',
            category: 'guidance',
            status: 'draft',
            excerpt: 'Quy trình sơ tán an toàn khi có thiên tai xảy ra, đảm bảo an toàn tính mạng cho người dân.',
            views: 1200,
            time: '2 ngày trước',
            author: 'Nguyễn Văn E',
            priority: 'medium'
        },
        {
            id: 'N009',
            title: 'Thông báo về việc tập huấn cứu hộ',
            category: 'info',
            status: 'scheduled',
            excerpt: 'Lịch tập huấn kỹ năng cứu hộ cho tình nguyện viên sẽ được tổ chức vào cuối tháng.',
            views: 800,
            time: '3 ngày trước',
            author: 'Trần Thị F',
            priority: 'low'
        },
        {
            id: 'N010',
            title: 'Cảnh báo triều cường tại khu vực ven biển',
            category: 'warning',
            status: 'published',
            excerpt: 'Triều cường dâng cao gây ngập lụt tại các khu vực ven biển. Người dân cần đề phòng.',
            views: 1900,
            time: '5 giờ trước',
            author: 'Admin System',
            priority: 'medium'
        }
    ];

    // Tính toán phân trang
    const startIndex = (page - 1) * newsPerPage;
    const endIndex = startIndex + newsPerPage;
    const paginatedNews = sampleNews.slice(startIndex, endIndex);

    // Cập nhật thông tin hiển thị
    updateNewsPaginationInfo(sampleNews.length, page);

    if (paginatedNews.length === 0) {
        container.innerHTML = `
            <div class="col-span-full text-center py-12">
                <i class="fas fa-inbox text-gray-400 text-4xl mb-4"></i>
                <h3 class="text-lg font-medium text-gray-900 mb-2">Không có bài viết nào</h3>
                <p class="text-gray-500">Không tìm thấy bài viết nào phù hợp với tiêu chí của bạn.</p>
            </div>
        `;
        return;
    }

    paginatedNews.forEach(news => {
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

        const card = document.createElement('div');
        card.className = `bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200 hover:shadow-md transition-shadow duration-200`;
        card.innerHTML = `
            <div class="p-6">
                <div class="flex justify-between items-start mb-3">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${categoryColors[news.category]} border">
                        ${categoryNames[news.category]}
                    </span>
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[news.status]}">
                        ${statusNames[news.status]}
                    </span>
                </div>
                <h3 class="font-bold text-lg mb-2 text-gray-900 line-clamp-2">${news.title}</h3>
                <p class="text-gray-600 text-sm mb-4 line-clamp-3">${news.excerpt}</p>
                
                <div class="flex items-center justify-between text-sm text-gray-500 mb-3">
                    <div class="flex items-center">
                        <i class="fas fa-eye mr-1"></i>
                        <span>${news.views.toLocaleString()}</span>
                    </div>
                    <div class="flex items-center">
                        <i class="fas fa-clock mr-1"></i>
                        <span>${news.time}</span>
                    </div>
                </div>
                
                <div class="flex items-center justify-between">
                    <span class="text-sm text-gray-500">Bởi <strong>${news.author}</strong></span>
                    <div class="flex space-x-2">
                        <button class="text-blue-600 hover:text-blue-800 p-1 view-news" data-id="${news.id}" title="Xem chi tiết">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="text-green-600 hover:text-green-800 p-1 edit-news" data-id="${news.id}" title="Chỉnh sửa">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="text-red-600 hover:text-red-800 p-1 delete-news" data-id="${news.id}" title="Xóa">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
        container.appendChild(card);
    });

    // Render phân trang
    renderNewsPagination(sampleNews.length, page);
    
    // Thêm event listeners cho các nút hành động
    addNewsActionListeners();
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
    const paginationContainer = document.querySelector('.flex.justify-between.items-center');
    if (!paginationContainer) return;
    
    const totalPages = Math.ceil(totalItems / newsPerPage);
    
    // Tìm phần tử pagination buttons
    const paginationButtons = paginationContainer.querySelector('.flex.space-x-2');
    if (!paginationButtons) return;
    
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
            loadNewsData(currentNewsPage);
        }
    });
    paginationButtons.appendChild(prevButton);
    
    // Các nút trang
    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.className = `px-3 py-2 border rounded-lg font-medium transition ${
            i === currentPage 
                ? 'bg-red-600 text-white border-red-600' 
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
        }`;
        pageButton.textContent = i;
        pageButton.addEventListener('click', () => {
            currentNewsPage = i;
            loadNewsData(currentNewsPage);
        });
        paginationButtons.appendChild(pageButton);
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
            loadNewsData(currentNewsPage);
        }
    });
    paginationButtons.appendChild(nextButton);
}

// Hàm thêm event listeners cho các nút hành động
function addNewsActionListeners() {
    const container = document.getElementById('news-grid-container');
    if (!container) return;
    
    container.querySelectorAll('.view-news').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.currentTarget.getAttribute('data-id');
            viewNews(id);
        });
    });

    container.querySelectorAll('.edit-news').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.currentTarget.getAttribute('data-id');
            editNews(id);
        });
    });

    container.querySelectorAll('.delete-news').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.currentTarget.getAttribute('data-id');
            deleteNews(id);
        });
    });
}

// Cập nhật hàm editNews để mở modal chỉnh sửa
function editNews(id) {
    // Tìm bài viết theo ID
    const sampleNews = []; // Thay bằng dữ liệu thực tế
    const news = sampleNews.find(item => item.id === id);
    
    if (news) {
        currentEditingNews = id;
        document.getElementById('news-modal-title').textContent = 'Chỉnh sửa bài viết';
        
        // Điền dữ liệu vào form
        document.getElementById('news-title').value = news.title;
        document.getElementById('news-category').value = news.category;
        document.getElementById('news-status').value = news.status;
        document.getElementById('news-priority').value = news.priority;
        document.getElementById('news-excerpt').value = news.excerpt;
        document.getElementById('news-content').value = news.excerpt; // Giả sử nội dung giống excerpt
        
        // Xử lý trường lịch trình
        if (news.status === 'scheduled') {
            document.getElementById('schedule-field').classList.remove('hidden');
        } else {
            document.getElementById('schedule-field').classList.add('hidden');
        }
        
        document.getElementById('news-modal').classList.remove('hidden');
    } else {
        showNotification('Không tìm thấy bài viết để chỉnh sửa', 'error');
    }
}
        function openNewsModal() {
            document.getElementById('news-modal-title').textContent = 'Thêm bài viết mới';
            document.getElementById('news-form').reset();
            quill.setText('');
            document.getElementById('image-preview').classList.add('hidden');
            document.getElementById('schedule-field').classList.add('hidden');
            document.getElementById('news-modal').classList.remove('hidden');
        }

        function closeNewsModal() {
            document.getElementById('news-modal').classList.add('hidden');
        }

        function toggleAdvancedFilters() {
            const filters = document.getElementById('advanced-filters');
            filters.classList.toggle('hidden');
        }

        function handleStatusChange(e) {
            const scheduleField = document.getElementById('schedule-field');
            if (e.target.value === 'scheduled') {
                scheduleField.classList.remove('hidden');
            } else {
                scheduleField.classList.add('hidden');
            }
        }

        function triggerImageUpload() {
            document.getElementById('image-upload').click();
        }

        function handleImageUpload(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    document.getElementById('image-preview').querySelector('img').src = e.target.result;
                    document.getElementById('image-preview').classList.remove('hidden');
                };
                reader.readAsDataURL(file);
            }
        }

        function publishNews() {
            // Validate form
            const title = document.getElementById('news-title').value;
            const category = document.getElementById('news-category').value;
            
            if (!title || !category) {
                showNotification('Vui lòng điền đầy đủ thông tin bắt buộc', 'error');
                return;
            }

            // Simulate saving news
            showNotification('Bài viết đã được xuất bản thành công!');
            closeNewsModal();
            // In real application, you would send data to server here
        }

        function saveDraft() {
            showNotification('Đã lưu bản nháp thành công!');
            closeNewsModal();
        }

        function viewNews(id) {
            const news = sampleNews.find(item => item.id === id);
            if (news) {
                alert(`Xem chi tiết: ${news.title}`);
                // In real application, you would open a detail modal
            }
        }

        function editNews(id) {
            const news = sampleNews.find(item => item.id === id);
            if (news) {
                document.getElementById('news-modal-title').textContent = 'Chỉnh sửa bài viết';
                document.getElementById('news-title').value = news.title;
                document.getElementById('news-category').value = news.category;
                document.getElementById('news-status').value = news.status;
                document.getElementById('news-priority').value = news.priority;
                document.getElementById('news-excerpt').value = news.excerpt;
                quill.setText(news.excerpt);
                
                if (news.status === 'scheduled') {
                    document.getElementById('schedule-field').classList.remove('hidden');
                }
                
                document.getElementById('news-modal').classList.remove('hidden');
            }
        }

        function deleteNews(id) {
            if (confirm('Bạn có chắc chắn muốn xóa bài viết này?')) {
                showNotification('Bài viết đã được xóa thành công!');
                // In real application, you would remove from array and re-render
            }
        }

        function applyFilters() {
            // Filter logic would be implemented here
            console.log('Applying filters...');
        }

        function showNotification(message, type = 'success') {
            const notification = document.getElementById('success-notification');
            const messageElement = document.getElementById('notification-message');
            
            messageElement.textContent = message;
            
            if (type === 'error') {
                notification.className = 'hidden fixed top-4 right-4 bg-red-500 text-white px-4 py-3 rounded-lg shadow-lg z-50';
            } else {
                notification.className = 'hidden fixed top-4 right-4 bg-green-500 text-white px-4 py-3 rounded-lg shadow-lg z-50';
            }
            
            notification.classList.remove('hidden');
            
            setTimeout(() => {
                notification.classList.add('hidden');
            }, 3000);
        }





        // News Management JavaScript
    document.addEventListener('DOMContentLoaded', function() {
        initializeNewsManagement();
        loadNewsData();
    });

    function initializeNewsManagement() {
        // Event listeners for news management
        document.getElementById('add-news-btn').addEventListener('click', openNewsModal);
        document.getElementById('close-news-modal').addEventListener('click', closeNewsModal);
        document.getElementById('cancel-news').addEventListener('click', closeNewsModal);
        document.getElementById('toggle-news-filters').addEventListener('click', toggleAdvancedFilters);
        document.getElementById('news-status').addEventListener('change', handleStatusChange);
        document.getElementById('image-upload').addEventListener('change', handleImageUpload);
        document.getElementById('publish-news-btn').addEventListener('click', publishNews);
        document.getElementById('save-draft-btn').addEventListener('click', saveDraft);
        
        // Filter events
        document.getElementById('search-news-input').addEventListener('input', applyNewsFilters);
        document.getElementById('category-news-filter').addEventListener('change', applyNewsFilters);
        document.getElementById('status-news-filter').addEventListener('change', applyNewsFilters);
    }


    // Tab Management System
document.addEventListener('DOMContentLoaded', function() {
    initializeTabSystem();
    initializeNewsManagement();
    loadNewsData();
});

function initializeTabSystem() {
    // Navigation click handlers
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const tabName = this.getAttribute('data-tab');
            showTab(tabName);
            
            // Update active state in sidebar
            document.querySelectorAll('.nav-item').forEach(nav => {
                nav.classList.remove('active', 'bg-red-600', 'text-white');
                nav.classList.add('text-gray-300', 'hover:text-white', 'hover:bg-gray-800');
            });
            this.classList.add('active', 'bg-red-600', 'text-white');
            this.classList.remove('text-gray-300', 'hover:text-white', 'hover:bg-gray-800');
        });
    });
}

function showTab(tabName) {
    // Hide all tab contents
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Show selected tab
    const selectedTab = document.getElementById(tabName);
    if (selectedTab) {
        selectedTab.classList.add('active');
    }
    
    // Update page header based on tab
    updatePageHeader(tabName);
    
    // Load specific data for the tab
    loadTabData(tabName);
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
    
    const titleElement = document.getElementById('page-title');
    const descriptionElement = document.getElementById('page-description');
    
    if (titleElement && descriptionElement) {
        titleElement.textContent = titles[tabName] || 'Dashboard';
        descriptionElement.textContent = descriptions[tabName] || 'Tổng quan hệ thống cứu hộ quốc gia';
    }
}

function loadTabData(tabName) {
    switch(tabName) {
        case 'news':
            loadNewsData();
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
        // Add other cases as needed
    }
}

let currentEditingNews = null;

function initializeNewsManagement() {
    // Event listeners cho quản lý tin tức
    const addNewsBtn = document.getElementById('add-news-btn');
    const closeNewsModal = document.getElementById('close-news-modal');
    const cancelNews = document.getElementById('cancel-news');
    const toggleFilters = document.getElementById('toggle-news-filters');
    const newsStatus = document.getElementById('news-status');
    const imageUpload = document.getElementById('image-upload');
    const publishNewsBtn = document.getElementById('publish-news-btn');
    const saveDraftBtn = document.getElementById('save-draft-btn');
    
    if (addNewsBtn) addNewsBtn.addEventListener('click', () => openNewsModal());
    if (closeNewsModal) closeNewsModal.addEventListener('click', closeNewsModal);
    if (cancelNews) cancelNews.addEventListener('click', closeNewsModal);
    if (toggleFilters) toggleFilters.addEventListener('click', toggleAdvancedFilters);
    if (newsStatus) newsStatus.addEventListener('change', handleStatusChange);
    if (imageUpload) imageUpload.addEventListener('change', handleImageUpload);
    if (publishNewsBtn) publishNewsBtn.addEventListener('click', publishNews);
    if (saveDraftBtn) saveDraftBtn.addEventListener('click', saveDraft);
    
    // Filter events
    const searchInput = document.getElementById('search-news-input');
    const categoryFilter = document.getElementById('category-news-filter');
    const statusFilter = document.getElementById('status-news-filter');
    
    if (searchInput) searchInput.addEventListener('input', applyNewsFilters);
    if (categoryFilter) categoryFilter.addEventListener('change', applyNewsFilters);
    if (statusFilter) statusFilter.addEventListener('change', applyNewsFilters);
    
    // Thêm event listener để đóng modal khi click bên ngoài
    document.addEventListener('click', function(e) {
        const newsModal = document.getElementById('news-modal');
        if (e.target === newsModal) {
            closeNewsModal();
        }
    });
}

function loadNewsData() {
    const container = document.getElementById('news-grid-container');
    if (!container) return;
    
    container.innerHTML = '';

    // Sample news data
    const sampleNews = [
        {
            id: 'N001',
            title: 'Cảnh báo bão số 8 hướng vào đất liền',
            category: 'emergency',
            status: 'published',
            excerpt: 'Bão số 8 dự kiến đổ bộ vào các tỉnh miền Trung với sức gió mạnh cấp 10-11, giật cấp 13. Người dân cần chủ động các biện pháp phòng tránh.',
            views: 2400,
            time: '2 giờ trước',
            author: 'Admin System',
            priority: 'high'
        },
        {
            id: 'N002',
            title: 'Hướng dẫn sơ cứu khi bị điện giật',
            category: 'guidance', 
            status: 'published',
            excerpt: 'Các bước sơ cứu cơ bản khi gặp nạn nhân bị điện giật cần thực hiện ngay lập tức để tránh nguy hiểm tính mạng.',
            views: 1800,
            time: '5 giờ trước',
            author: 'Nguyễn Văn A',
            priority: 'medium'
        },
        {
            id: 'N003',
            title: 'Thông báo lịch cứu hộ dịp lễ 30/4',
            category: 'info',
            status: 'scheduled',
            excerpt: 'Lịch trực và phương án cứu hộ được triển khai trong dịp lễ 30/4 - 1/5 để đảm bảo an toàn cho người dân.',
            views: 950,
            time: '1 ngày trước',
            author: 'Trần Thị B',
            priority: 'low'
        }
    ];

    sampleNews.forEach(news => {
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
            'emergency': 'bg-red-100 text-red-800',
            'warning': 'bg-orange-100 text-orange-800',
            'info': 'bg-blue-100 text-blue-800',
            'guidance': 'bg-green-100 text-green-800',
            'news': 'bg-purple-100 text-purple-800'
        };

        const statusColors = {
            'published': 'status-published',
            'draft': 'status-draft',
            'scheduled': 'status-scheduled',
            'archived': 'status-archived'
        };

        const card = document.createElement('div');
        card.className = `news-card ${news.category} bg-white rounded-xl shadow-sm overflow-hidden border`;
        card.innerHTML = `
            <div class="p-6">
                <div class="flex justify-between items-start mb-3">
                    <span class="category-badge ${categoryColors[news.category]}">
                        ${categoryNames[news.category]}
                    </span>
                    <div class="flex items-center text-sm text-gray-500">
                        <span class="status-dot ${statusColors[news.status]}"></span>
                        ${statusNames[news.status]}
                    </div>
                </div>
                <h3 class="font-bold text-lg mb-2 text-gray-900 line-clamp-2">${news.title}</h3>
                <p class="text-gray-600 text-sm mb-4 line-clamp-3">${news.excerpt}</p>
                
                <div class="flex items-center justify-between text-sm text-gray-500 mb-3">
                    <div class="flex items-center">
                        <i class="fas fa-eye mr-1"></i>
                        <span>${news.views.toLocaleString()}</span>
                    </div>
                    <div class="flex items-center">
                        <i class="fas fa-clock mr-1"></i>
                        <span>${news.time}</span>
                    </div>
                </div>
                
                <div class="flex items-center justify-between">
                    <span class="text-sm text-gray-500">Bởi <strong>${news.author}</strong></span>
                    <div class="flex space-x-2">
                        <button class="text-blue-600 hover:text-blue-800 p-1 view-news" data-id="${news.id}" title="Xem chi tiết">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="text-green-600 hover:text-green-800 p-1 edit-news" data-id="${news.id}" title="Chỉnh sửa">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="text-red-600 hover:text-red-800 p-1 delete-news" data-id="${news.id}" title="Xóa">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
        container.appendChild(card);
    });

    // Add event listeners to action buttons
    container.querySelectorAll('.view-news').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.currentTarget.getAttribute('data-id');
            viewNews(id);
        });
    });

    container.querySelectorAll('.edit-news').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.currentTarget.getAttribute('data-id');
            editNews(id);
        });
    });

    container.querySelectorAll('.delete-news').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.currentTarget.getAttribute('data-id');
            deleteNews(id);
        });
    });
}

function openNewsModal() {
    document.getElementById('news-modal-title').textContent = 'Thêm bài viết mới';
    document.getElementById('news-form').reset();
    document.getElementById('image-preview').classList.add('hidden');
    document.getElementById('schedule-field').classList.add('hidden');
    document.getElementById('news-modal').classList.remove('hidden');
}

function closeNewsModal() {
    document.getElementById('news-modal').classList.add('hidden');
}

function toggleAdvancedFilters() {
    const filters = document.getElementById('advanced-news-filters');
    if (filters) {
        filters.classList.toggle('hidden');
    }
}

function handleStatusChange(e) {
    const scheduleField = document.getElementById('schedule-field');
    if (scheduleField) {
        if (e.target.value === 'scheduled') {
            scheduleField.classList.remove('hidden');
        } else {
            scheduleField.classList.add('hidden');
        }
    }
}

function handleImageUpload(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const imagePreview = document.getElementById('image-preview');
            if (imagePreview) {
                imagePreview.querySelector('img').src = e.target.result;
                imagePreview.classList.remove('hidden');
            }
        };
        reader.readAsDataURL(file);
    }
}

function publishNews() {
    const title = document.getElementById('news-title').value;
    const category = document.getElementById('news-category').value;
    
    if (!title || !category) {
        showNotification('Vui lòng điền đầy đủ thông tin bắt buộc', 'error');
        return;
    }

    showNotification('Bài viết đã được xuất bản thành công!');
    closeNewsModal();
}

function saveDraft() {
    showNotification('Đã lưu bản nháp thành công!');
    closeNewsModal();
}

function viewNews(id) {
    alert(`Xem chi tiết bài viết ID: ${id}`);
}

function editNews(id) {
    alert(`Chỉnh sửa bài viết ID: ${id}`);
    openNewsModal();
}

function deleteNews(id) {
    if (confirm('Bạn có chắc chắn muốn xóa bài viết này?')) {
        showNotification('Bài viết đã được xóa thành công!');
    }
}

function applyNewsFilters() {
    console.log('Applying news filters...');
}

function showNotification(message, type = 'success') {
    const notification = document.getElementById('success-notification');
    const messageElement = document.getElementById('notification-message');
    
    if (notification && messageElement) {
        messageElement.textContent = message;
        
        if (type === 'error') {
            notification.className = 'hidden fixed top-4 right-4 bg-red-500 text-white px-4 py-3 rounded-lg shadow-lg z-50';
        } else {
            notification.className = 'hidden fixed top-4 right-4 bg-green-500 text-white px-4 py-3 rounded-lg shadow-lg z-50';
        }
        
        notification.classList.remove('hidden');
        
        setTimeout(() => {
            notification.classList.add('hidden');
        }, 3000);
    }
}

// Placeholder functions for other tabs
function loadWeatherData() {
    console.log('Loading weather data...');
}

function loadReportsData() {
    console.log('Loading reports data...');
}

function loadUsersData() {
    console.log('Loading users data...');
}








//close model
function closeNewsModal() {
    const modal = document.getElementById('news-modal');
    if (modal) {
        modal.classList.add('hidden');
    }
    currentEditingNews = null;
}

// Cập nhật event listeners trong initializeNewsManagement:
function initializeNewsManagement() {
    // Event listeners cho quản lý tin tức
    const addNewsBtn = document.getElementById('add-news-btn');
    const closeNewsModalBtn = document.getElementById('close-news-modal');
    const cancelNewsBtn = document.getElementById('cancel-news');
    const toggleFilters = document.getElementById('toggle-news-filters');
    const newsStatus = document.getElementById('news-status');
    const imageUpload = document.getElementById('image-upload');
    const publishNewsBtn = document.getElementById('publish-news-btn');
    const saveDraftBtn = document.getElementById('save-draft-btn');
    
    if (addNewsBtn) addNewsBtn.addEventListener('click', () => openNewsModal());
    if (closeNewsModalBtn) closeNewsModalBtn.addEventListener('click', closeNewsModal);
    if (cancelNewsBtn) cancelNewsBtn.addEventListener('click', closeNewsModal);
    if (toggleFilters) toggleFilters.addEventListener('click', toggleAdvancedFilters);
    if (newsStatus) newsStatus.addEventListener('change', handleStatusChange);
    if (imageUpload) imageUpload.addEventListener('change', handleImageUpload);
    if (publishNewsBtn) publishNewsBtn.addEventListener('click', publishNews);
    if (saveDraftBtn) saveDraftBtn.addEventListener('click', saveDraft);
    
    // Filter events
    const searchInput = document.getElementById('search-news-input');
    const categoryFilter = document.getElementById('category-news-filter');
    const statusFilter = document.getElementById('status-news-filter');
    
    if (searchInput) searchInput.addEventListener('input', applyNewsFilters);
    if (categoryFilter) categoryFilter.addEventListener('change', applyNewsFilters);
    if (statusFilter) statusFilter.addEventListener('change', applyNewsFilters);
    
    // Thêm event listener để đóng modal khi click bên ngoài
    document.addEventListener('click', function(e) {
        const newsModal = document.getElementById('news-modal');
        if (e.target === newsModal) {
            closeNewsModal();
        }
    });
    
    // Thêm event listener để đóng modal bằng phím ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeNewsModal();
        }
    });
}









// Reports Management Functions
function setupReportsManagement() {
    // Event listeners for reports
    document.getElementById('add-report-btn').addEventListener('click', () => openReportModal());
    document.getElementById('toggle-reports-filters').addEventListener('click', toggleReportsFilters);
    document.getElementById('sync-reports-btn').addEventListener('click', syncReportsData);
    document.getElementById('export-reports-btn').addEventListener('click', exportReportsToExcel);
    
    // Report modal events
    document.getElementById('close-report-modal').addEventListener('click', closeReportModal);
    document.getElementById('cancel-report').addEventListener('click', closeReportModal);
    document.getElementById('report-form').addEventListener('submit', handleReportSubmit);
    
    // Filter events
    document.getElementById('search-reports-input').addEventListener('input', applyReportsFilters);
    document.getElementById('type-reports-filter').addEventListener('change', applyReportsFilters);
    document.getElementById('status-reports-filter').addEventListener('change', applyReportsFilters);
    document.getElementById('priority-reports-filter').addEventListener('change', applyReportsFilters);
    document.getElementById('region-reports-filter').addEventListener('change', applyReportsFilters);
    document.getElementById('start-date-filter').addEventListener('change', applyReportsFilters);
    document.getElementById('end-date-filter').addEventListener('change', applyReportsFilters);
    
    // Image upload
    document.getElementById('report-image-upload').addEventListener('change', handleReportImageUpload);
}

function loadReportsData() {
    let reports = JSON.parse(localStorage.getItem('admin_reports')) || [];
    
    // If no data, initialize with sample data
    if (reports.length === 0) {
        reports = getSampleReportsData();
        localStorage.setItem('admin_reports', JSON.stringify(reports));
    }
    
    renderReportsTable(reports);
    updateReportsStats(reports);
}

function getSampleReportsData() {
    return [
        {
            id: 'R001',
            title: 'Cháy chung cư tại Cầu Giấy',
            type: 'fire',
            priority: 'high',
            status: 'processing',
            address: '123 Trần Duy Hưng, Cầu Giấy',
            province: 'hanoi',
            time: '2025-11-01T10:30',
            description: 'Cháy lớn tại tầng 12 chung cư Golden West, nhiều người mắc kẹt bên trong.',
            reporter: { name: 'Nguyễn Văn A', phone: '0912345678' },
            image: '',
            createdAt: new Date().toISOString()
        },
        {
            id: 'R002',
            title: 'Ngập nước nghiêm trọng tại Quận 1',
            type: 'flood',
            priority: 'medium',
            status: 'pending',
            address: 'Đường Nguyễn Huệ, Quận 1',
            province: 'hcm',
            time: '2025-11-01T14:15',
            description: 'Ngập nước sâu 0.5m sau cơn mưa lớn, nhiều phương tiện bị kẹt.',
            reporter: { name: 'Trần Thị B', phone: '0934567890' },
            image: '',
            createdAt: new Date().toISOString()
        },
        {
            id: 'R003',
            title: 'Tai nạn giao thông nghiêm trọng',
            type: 'accident',
            priority: 'critical',
            status: 'processing',
            address: 'QL1A, Quận Bình Thạnh',
            province: 'hcm',
            time: '2025-10-31T08:20',
            description: 'Va chạm giữa xe tải và xe máy, 2 người bị thương nặng.',
            reporter: { name: 'Lê Văn C', phone: '0945678901' },
            image: '',
            createdAt: new Date().toISOString()
        }
    ];
}

function renderReportsTable(reports) {
    const container = document.getElementById('reports-table-body');
    container.innerHTML = '';

    if (reports.length === 0) {
        container.innerHTML = `
            <tr>
                <td colspan="7" class="px-6 py-4 text-center text-sm text-gray-500">
                    <div class="flex flex-col items-center justify-center py-8">
                        <i class="fas fa-inbox text-4xl text-gray-300 mb-2"></i>
                        <p class="text-gray-500">Không có báo cáo nào</p>
                    </div>
                </td>
            </tr>
        `;
        return;
    }

    reports.forEach(report => {
        const typeNames = {
            'fire': 'Cháy',
            'flood': 'Ngập lụt',
            'accident': 'Tai nạn',
            'medical': 'Y tế',
            'disaster': 'Thiên tai',
            'other': 'Khác'
        };
        
        const priorityNames = {
            'low': 'Thấp',
            'medium': 'Trung bình',
            'high': 'Cao',
            'critical': 'Rất cao'
        };
        
        const statusNames = {
            'pending': 'Đang chờ',
            'processing': 'Đang xử lý',
            'resolved': 'Đã giải quyết',
            'cancelled': 'Đã hủy'
        };
        
        const provinceNames = {
            'hanoi': 'Hà Nội',
            'hcm': 'TP. Hồ Chí Minh',
            'danang': 'Đà Nẵng',
            'haiphong': 'Hải Phòng',
            'cantho': 'Cần Thơ'
        };
        
        const priorityColors = {
            'low': 'bg-green-100 text-green-800',
            'medium': 'bg-yellow-100 text-yellow-800',
            'high': 'bg-orange-100 text-orange-800',
            'critical': 'bg-red-100 text-red-800'
        };
        
        const statusColors = {
            'pending': 'bg-gray-100 text-gray-800',
            'processing': 'bg-blue-100 text-blue-800',
            'resolved': 'bg-green-100 text-green-800',
            'cancelled': 'bg-red-100 text-red-800'
        };

        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${report.id}</td>
            <td class="px-6 py-4 text-sm text-gray-900">
                <div class="flex items-center">
                    <i class="fas ${getReportTypeIcon(report.type)} mr-2 text-gray-400"></i>
                    ${typeNames[report.type]}
                </div>
            </td>
            <td class="px-6 py-4 text-sm text-gray-500">
                <div>${report.address}</div>
                <div class="text-xs text-gray-400">${provinceNames[report.province]}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${priorityColors[report.priority]}">
                    ${priorityNames[report.priority]}
                </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                ${formatDateTime(new Date(report.time))}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[report.status]}">
                    ${statusNames[report.status]}
                </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div class="flex space-x-2">
                    <button onclick="viewReport('${report.id}')" class="text-blue-600 hover:text-blue-900 transition">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button onclick="editReport('${report.id}')" class="text-green-600 hover:text-green-900 transition">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button onclick="deleteReport('${report.id}')" class="text-red-600 hover:text-red-900 transition">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        container.appendChild(row);
    });
}

function getReportTypeIcon(type) {
    const icons = {
        'fire': 'fa-fire',
        'flood': 'fa-water',
        'accident': 'fa-car-crash',
        'medical': 'fa-ambulance',
        'disaster': 'fa-mountain',
        'other': 'fa-exclamation-triangle'
    };
    return icons[type] || 'fa-exclamation-triangle';
}

function updateReportsStats(reports) {
    const total = reports.length;
    const pending = reports.filter(r => r.status === 'pending').length;
    const resolved = reports.filter(r => r.status === 'resolved').length;
    const critical = reports.filter(r => r.priority === 'critical').length;

    document.getElementById('reports-total-items').textContent = total;
    // Update stats cards if they exist
    const statsCards = document.querySelectorAll('#reports .stats-card');
    if (statsCards.length >= 4) {
        statsCards[0].querySelector('.text-2xl').textContent = total;
        statsCards[1].querySelector('.text-2xl').textContent = pending;
        statsCards[2].querySelector('.text-2xl').textContent = resolved;
        statsCards[3].querySelector('.text-2xl').textContent = critical;
    }
}

// Modal Functions for Reports
function openReportModal(reportId = null) {
    const modal = document.getElementById('report-modal');
    const title = document.getElementById('report-modal-title');
    
    if (reportId) {
        title.textContent = 'Chỉnh sửa báo cáo sự cố';
        loadReportData(reportId);
    } else {
        title.textContent = 'Thêm báo cáo sự cố mới';
        document.getElementById('report-form').reset();
        document.getElementById('report-id').value = '';
        document.getElementById('report-image-preview').classList.add('hidden');
    }
    
    modal.classList.remove('hidden');
}

function closeReportModal() {
    document.getElementById('report-modal').classList.add('hidden');
}

function loadReportData(reportId) {
    const reports = JSON.parse(localStorage.getItem('admin_reports')) || [];
    const report = reports.find(r => r.id === reportId);
    
    if (report) {
        document.getElementById('report-id').value = report.id;
        document.getElementById('report-title').value = report.title;
        document.getElementById('report-type').value = report.type;
        document.getElementById('report-priority').value = report.priority;
        document.getElementById('report-status').value = report.status;
        document.getElementById('report-address').value = report.address;
        document.getElementById('report-province').value = report.province;
        document.getElementById('report-time').value = report.time.replace(' ', 'T').substring(0, 16);
        document.getElementById('report-description').value = report.description;
        document.getElementById('reporter-name').value = report.reporter.name;
        document.getElementById('reporter-phone').value = report.reporter.phone;
        
        if (report.image) {
            document.getElementById('report-image-preview').classList.remove('hidden');
            document.getElementById('report-image-preview').querySelector('img').src = report.image;
        }
    }
}

function handleReportSubmit(e) {
    e.preventDefault();
    
    const reportId = document.getElementById('report-id').value;
    const formData = {
        id: reportId || 'R' + Date.now(),
        title: document.getElementById('report-title').value,
        type: document.getElementById('report-type').value,
        priority: document.getElementById('report-priority').value,
        status: document.getElementById('report-status').value,
        address: document.getElementById('report-address').value,
        province: document.getElementById('report-province').value,
        time: document.getElementById('report-time').value,
        description: document.getElementById('report-description').value,
        reporter: {
            name: document.getElementById('reporter-name').value,
            phone: document.getElementById('reporter-phone').value
        },
        image: document.getElementById('report-image-preview').classList.contains('hidden') ? 
               '' : document.getElementById('report-image-preview').querySelector('img').src,
        createdAt: reportId ? getReportCreateTime(reportId) : new Date().toISOString()
    };
    
    saveReport(formData);
}

function getReportCreateTime(reportId) {
    const reports = JSON.parse(localStorage.getItem('admin_reports')) || [];
    const report = reports.find(r => r.id === reportId);
    return report ? report.createdAt : new Date().toISOString();
}

function saveReport(reportData) {
    let reports = JSON.parse(localStorage.getItem('admin_reports')) || [];
    
    const existingIndex = reports.findIndex(r => r.id === reportData.id);
    if (existingIndex >= 0) {
        reports[existingIndex] = reportData;
    } else {
        reports.unshift(reportData);
    }
    
    localStorage.setItem('admin_reports', JSON.stringify(reports));
    closeReportModal();
    showNotification(reportData.id ? 'Cập nhật báo cáo thành công!' : 'Thêm báo cáo mới thành công!');
    loadReportsData();
}

function viewReport(reportId) {
    const reports = JSON.parse(localStorage.getItem('admin_reports')) || [];
    const report = reports.find(r => r.id === reportId);
    
    if (report) {
        // For now, just show an alert with report details
        // In a real application, you might want to open a detailed view modal
        alert(`Chi tiết báo cáo:\n\nID: ${report.id}\nTiêu đề: ${report.title}\nLoại: ${report.type}\nMức độ: ${report.priority}\nTrạng thái: ${report.status}\nĐịa chỉ: ${report.address}\nMô tả: ${report.description}`);
    }
}

function editReport(reportId) {
    openReportModal(reportId);
}

function deleteReport(reportId) {
    if (confirm('Bạn có chắc chắn muốn xóa báo cáo này?')) {
        let reports = JSON.parse(localStorage.getItem('admin_reports')) || [];
        reports = reports.filter(r => r.id !== reportId);
        localStorage.setItem('admin_reports', JSON.stringify(reports));
        showNotification('Đã xóa báo cáo thành công!');
        loadReportsData();
    }
}

function handleReportImageUpload(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const preview = document.getElementById('report-image-preview');
            preview.classList.remove('hidden');
            preview.querySelector('img').src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
}

function toggleReportsFilters() {
    document.getElementById('advanced-reports-filters').classList.toggle('hidden');
}

function applyReportsFilters() {
    const searchTerm = document.getElementById('search-reports-input').value.toLowerCase();
    const typeFilter = document.getElementById('type-reports-filter').value;
    const statusFilter = document.getElementById('status-reports-filter').value;
    const priorityFilter = document.getElementById('priority-reports-filter').value;
    const regionFilter = document.getElementById('region-reports-filter').value;
    const startDate = document.getElementById('start-date-filter').value;
    const endDate = document.getElementById('end-date-filter').value;
    
    let reports = JSON.parse(localStorage.getItem('admin_reports')) || [];
    
    // Apply filters
    let filteredReports = reports.filter(report => {
        // Search filter
        if (searchTerm && !report.title.toLowerCase().includes(searchTerm) && 
            !report.description.toLowerCase().includes(searchTerm) &&
            !report.address.toLowerCase().includes(searchTerm)) {
            return false;
        }
        
        // Type filter
        if (typeFilter !== 'all' && report.type !== typeFilter) {
            return false;
        }
        
        // Status filter
        if (statusFilter !== 'all' && report.status !== statusFilter) {
            return false;
        }
        
        // Priority filter
        if (priorityFilter !== 'all' && report.priority !== priorityFilter) {
            return false;
        }
        
        // Region filter
        if (regionFilter !== 'all' && report.province !== regionFilter) {
            return false;
        }
        
        // Date range filter
        if (startDate && new Date(report.time) < new Date(startDate)) {
            return false;
        }
        
        if (endDate && new Date(report.time) > new Date(endDate + 'T23:59:59')) {
            return false;
        }
        
        return true;
    });
    
    renderReportsTable(filteredReports);
}

function syncReportsData() {
    showSyncStatus('Đang đồng bộ dữ liệu báo cáo...', 'sync-warning');
    
    setTimeout(() => {
        showSyncStatus('Đã đồng bộ dữ liệu báo cáo', 'sync-success');
        showNotification('Đồng bộ dữ liệu báo cáo thành công!');
        
        setTimeout(() => {
            hideSyncStatus();
        }, 3000);
    }, 2000);
}

function exportReportsToExcel() {
    showNotification('Đang xuất dữ liệu báo cáo ra Excel...');
    // In a real application, you would implement actual Excel export functionality
}

function formatDateTime(date) {
    return date.toLocaleString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}




























//close
// Enhanced Modal Management
function setupModalHandlers() {
    // Close modals when clicking X button
    document.getElementById('close-news-modal').addEventListener('click', closeNewsModal);
    document.getElementById('close-weather-modal').addEventListener('click', closeWeatherModal);
    document.getElementById('close-report-modal').addEventListener('click', closeReportModal);
    
    // Close modals when clicking cancel buttons
    document.getElementById('cancel-news').addEventListener('click', closeNewsModal);
    document.getElementById('cancel-weather').addEventListener('click', closeWeatherModal);
    document.getElementById('cancel-report').addEventListener('click', closeReportModal);
    
    // Close modals when clicking outside
    setupClickOutsideToClose();
    
    // Close modals with Escape key
    setupEscapeKeyToClose();
}

function setupClickOutsideToClose() {
    // Close modal when clicking on overlay
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal-overlay')) {
            closeAllModals();
        }
    });
}

function setupEscapeKeyToClose() {
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeAllModals();
        }
    });
}

function closeAllModals() {
    closeNewsModal();
    closeWeatherModal();
    closeReportModal();
}

// Enhanced Modal Functions
function openNewsModal(newsId = null) {
    closeAllModals(); // Close any other open modals first
    
    const modal = document.getElementById('news-modal');
    const title = document.getElementById('news-modal-title');
    
    if (newsId) {
        title.textContent = 'Sửa tin tức';
        loadNewsData(newsId);
    } else {
        title.textContent = 'Thêm tin tức mới';
        document.getElementById('news-form').reset();
        document.getElementById('news-id').value = '';
        document.getElementById('image-preview').classList.add('hidden');
    }
    
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
}

function closeNewsModal() {
    const modal = document.getElementById('news-modal');
    modal.classList.add('hidden');
    document.body.style.overflow = ''; // Restore scrolling
}

function openWeatherModal(weatherId = null) {
    closeAllModals();
    
    const modal = document.getElementById('weather-modal');
    const title = document.getElementById('weather-modal-title');
    
    if (weatherId) {
        title.textContent = 'Sửa dự báo thời tiết';
        loadWeatherData(weatherId);
    } else {
        title.textContent = 'Thêm dự báo thời tiết';
        document.getElementById('weather-form').reset();
        document.getElementById('weather-id').value = '';
    }
    
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function closeWeatherModal() {
    const modal = document.getElementById('weather-modal');
    modal.classList.add('hidden');
    document.body.style.overflow = '';
}

function openReportModal(reportId = null) {
    closeAllModals();
    
    const modal = document.getElementById('report-modal');
    const title = document.getElementById('report-modal-title');
    
    if (reportId) {
        title.textContent = 'Chỉnh sửa báo cáo sự cố';
        loadReportData(reportId);
    } else {
        title.textContent = 'Thêm báo cáo sự cố mới';
        document.getElementById('report-form').reset();
        document.getElementById('report-id').value = '';
        document.getElementById('report-image-preview').classList.add('hidden');
    }
    
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function closeReportModal() {
    const modal = document.getElementById('report-modal');
    modal.classList.add('hidden');
    document.body.style.overflow = '';
}

// Prevent modal content clicks from closing the modal
function setupModalClickPrevention() {
    const modals = document.querySelectorAll('.modal-content');
    modals.forEach(modal => {
        modal.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    });
}





























function loadNewsData(newsId) {
    const news = JSON.parse(localStorage.getItem('admin_news')) || [];
    const newsItem = news.find(n => n.id === newsId);
    
    if (newsItem) {
        // Fill form with existing data
        document.getElementById('news-id').value = newsItem.id;
        document.getElementById('news-title').value = newsItem.title;
        document.getElementById('news-category').value = newsItem.category;
        document.getElementById('news-status').value = newsItem.status;
        document.getElementById('news-priority').value = newsItem.priority;
        document.getElementById('news-excerpt').value = newsItem.excerpt;
        document.getElementById('news-content').value = newsItem.content;
        
        // Handle schedule field visibility
        if (newsItem.status === 'scheduled') {
            document.getElementById('schedule-field').classList.remove('hidden');
            document.getElementById('news-schedule').value = newsItem.schedule;
        }
        
        // Handle image preview
        if (newsItem.image) {
            document.getElementById('image-preview').classList.remove('hidden');
            document.getElementById('image-preview').querySelector('img').src = newsItem.image;
        }
    }
}

function loadWeatherData(weatherId) {
    const weather = JSON.parse(localStorage.getItem('admin_weather')) || [];
    const weatherItem = weather.find(w => w.id === weatherId);
    
    if (weatherItem) {
        document.getElementById('weather-id').value = weatherItem.id;
        document.getElementById('weather-date').value = weatherItem.date;
        document.getElementById('weather-region').value = weatherItem.region;
        document.getElementById('weather-type').value = weatherItem.type;
        document.getElementById('weather-temp-min').value = weatherItem.tempMin;
        document.getElementById('weather-temp-max').value = weatherItem.tempMax;
        document.getElementById('weather-description').value = weatherItem.description;
    }
}



















































//Tự động đóng modal khác khi mở modal mới

// Add this to setupEventListeners() or setupModalHandlers()
document.getElementById('news-status').addEventListener('change', function() {
    const scheduleField = document.getElementById('schedule-field');
    if (this.value === 'scheduled') {
        scheduleField.classList.remove('hidden');
    } else {
        scheduleField.classList.add('hidden');
    }
});