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
 // Initialize Quill Editor
        let quill;
        
        // Sample news data
        const sampleNews = [
            {
                id: 'N001',
                title: 'Cảnh báo bão số 8 hướng vào đất liền',
                category: 'emergency',
                status: 'published',
                excerpt: 'Bão số 8 dự kiến đổ bộ vào các tỉnh miền Trung với sức gió mạnh cấp 10-11, giật cấp 13...',
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
                excerpt: 'Các bước sơ cứu cơ bản khi gặp nạn nhân bị điện giật cần thực hiện ngay lập tức...',
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
                excerpt: 'Lịch trực và phương án cứu hộ được triển khai trong dịp lễ 30/4 - 1/5...',
                views: 950,
                time: '1 ngày trước',
                author: 'Trần Thị B',
                priority: 'low'
            }
        ];

        // DOM Content Loaded
        document.addEventListener('DOMContentLoaded', function() {
            initializeNewsManagement();
            loadNewsData();
        });

        function initializeNewsManagement() {
            // Initialize Quill editor
            quill = new Quill('#editor-container', {
                theme: 'snow',
                modules: {
                    toolbar: [
                        [{ 'header': [1, 2, 3, false] }],
                        ['bold', 'italic', 'underline', 'strike'],
                        [{ 'color': [] }, { 'background': [] }],
                        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                        ['link', 'image', 'video'],
                        ['clean']
                    ]
                },
                placeholder: 'Nhập nội dung bài viết...'
            });

            // Event listeners for news management
            document.getElementById('add-news-btn').addEventListener('click', openNewsModal);
            document.getElementById('close-news-modal').addEventListener('click', closeNewsModal);
            document.getElementById('cancel-news').addEventListener('click', closeNewsModal);
            document.getElementById('toggle-filters').addEventListener('click', toggleAdvancedFilters);
            document.getElementById('news-status').addEventListener('change', handleStatusChange);
            document.getElementById('upload-trigger').addEventListener('click', triggerImageUpload);
            document.getElementById('image-upload').addEventListener('change', handleImageUpload);
            document.getElementById('publish-news-btn').addEventListener('click', publishNews);
            document.getElementById('save-draft-btn').addEventListener('click', saveDraft);
            
            // Filter events
            document.getElementById('search-input').addEventListener('input', applyFilters);
            document.getElementById('category-filter').addEventListener('change', applyFilters);
            document.getElementById('status-filter').addEventListener('change', applyFilters);
        }

        function loadNewsData() {
            const container = document.getElementById('news-grid-container');
            container.innerHTML = '';

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
                card.className = `news-card ${news.category} bg-white rounded-xl shadow-sm overflow-hidden`;
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