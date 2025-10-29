// Data Management System với đồng bộ dữ liệu hai chiều
const DataManager = {
    // Load data from localStorage hoặc khởi tạo với dữ liệu mẫu đầy đủ
    loadData: function() {
        return {
            news: JSON.parse(localStorage.getItem('newsData')) || [
                {
                    id: 1,
                    title: "Đà Nẵng: Chủ động ứng phó thiên tai những tháng cuối năm",
                    date: "2025-10-21",
                    type: "thien-tai",
                    location: "da-nang,mien-trung",
                    img: "https://media.daidoanket.vn/w1280/uploaded/images/2025/10/18/8898fcf6-b66a-433c-908c-72eb18bbdeb1.jpg",
                    content: `<p><strong>Tình hình:</strong> TP. Đà Nẵng đang hứng chịu thời tiết cực đoan, mưa lớn kéo dài gây sạt lở nghiêm trọng tại nhiều khu vực. Đáng chú ý, bờ biển phường Hội An Tây bị sóng đánh mạnh, sạt lở dài hơn 200m với vách đứng cao 5-6m, cây chắn sóng bật gốc, công trình ven biển nguy cơ sụp đổ. Tuyến đường ĐT606 (Km23+480) bị sụt lún sâu 18-30cm, dài 43m, vết nứt cắt ngang, taluy cao 50m có dấu hiệu trượt, đe dọa chia cắt giao thông miền núi.</p>
<p><strong>Thiệt hại ước tính:</strong> Chưa có con số thiệt hại cụ thể về người và tài sản. Các khu vực bị ảnh hưởng bao gồm sạt lở bờ biển sát khu dân cư và du lịch, đất cát cuốn trôi lớn, công trình nguy cơ sụp đổ, giao thông huyết mạch có nguy cơ đứt gãy hoàn toàn.</p>
<p><strong>Hành động ứng phó:</strong> UBND TP. Đà Nẵng ban hành Công điện số 07/CĐ-UBND, kích hoạt phương án ứng phó toàn diện trong 10 ngày tới và những tháng cuối năm 2025. Các biện pháp: theo dõi thời tiết, củng cố cảnh báo sớm, bố trí lực lượng canh gác, chốt chặn khu vực nguy cơ; chuẩn bị phương tiện cứu hộ theo phương châm "4 tại chỗ"; sơ tán dân vùng trũng thấp, ven biển; kiểm tra, vận hành hồ chứa, trạm bơm chống ngập; lực lượng vũ trang sẵn sàng hỗ trợ; tuyên truyền kỹ năng phòng tránh; kiểm tra công trình thi công và hệ thống thủy lợi, đê điều.</p>
<p><strong>Khuyến cáo:</strong> Người dân theo dõi bản tin dự báo, hạn chế di chuyển khi mưa lớn, di dời tài sản đến nơi cao ráo, đảm bảo an toàn tính mạng và tài sản. Chính quyền địa phương chuẩn bị phương án ứng phó, kiểm tra hệ thống tiêu thoát nước, cảnh giới khu vực sạt lở, hỗ trợ dân khi ngập lụt. Tăng cường tuyên truyền nâng cao nhận thức cộng đồng về phòng tránh thiên tai.</p>
<a href='https://thiennhienmoitruong.vn/da-nang-chu-dong-ung-pho-thien-tai-nhung-thang-cuoi-nam.html' target='_blank'>Nguồn gốc</a>`,
                    status: "published"
                }
            ],
            reports: JSON.parse(localStorage.getItem('emergencyReports')) || [],
            keys: JSON.parse(localStorage.getItem('rescueKeys')) || [],
            users: JSON.parse(localStorage.getItem('systemUsers')) || [],
            settings: JSON.parse(localStorage.getItem('systemSettings')) || {}
        };
    },

    // Save data to localStorage với đồng bộ hai chiều
    saveData: function(data) {
        localStorage.setItem('newsData', JSON.stringify(data.news));
        localStorage.setItem('emergencyReports', JSON.stringify(data.reports));
        localStorage.setItem('rescueKeys', JSON.stringify(data.keys));
        localStorage.setItem('systemUsers', JSON.stringify(data.users));
        localStorage.setItem('systemSettings', JSON.stringify(data.settings));
        
        // Đồng bộ với trang tin tức
        this.syncWithNewsPage();
        this.showSyncStatus('success', 'Dữ liệu đã đồng bộ');
    },

    // Đồng bộ với trang tin tức - CẢI THIỆN: Đồng bộ hai chiều
    syncWithNewsPage: function() {
        const systemData = this.loadData();
        
        // Cập nhật localStorage của trang news với dữ liệu mới nhất từ admin
        localStorage.setItem('newsData', JSON.stringify(systemData.news));
        
        console.log('Đã đồng bộ dữ liệu với trang tin tức');
    },

    // Đồng bộ toàn bộ dữ liệu từ trang tin tức - CẢI THIỆN: Đồng bộ hai chiều
    syncAllWithNewsPage: function() {
        const systemData = this.loadData();
        const newsPageData = localStorage.getItem('newsData');
        
        if (newsPageData) {
            const newsFromPage = JSON.parse(newsPageData);
            
            // Cập nhật ID để tránh trùng lặp
            let maxId = Math.max(...systemData.news.map(n => n.id), 0);
            
            let hasNewData = false;
            
            newsFromPage.forEach(news => {
                // Kiểm tra xem bản tin đã tồn tại chưa
                const existingNewsIndex = systemData.news.findIndex(n => 
                    n.id === news.id
                );
                
                if (existingNewsIndex !== -1) {
                    // CẢI THIỆN: Cập nhật bản tin đã tồn tại
                    systemData.news[existingNewsIndex] = news;
                    hasNewData = true;
                } else {
                    // Thêm bản tin mới
                    maxId++;
                    systemData.news.push({
                        ...news,
                        id: maxId,
                        status: 'published'
                    });
                    hasNewData = true;
                }
            });
            
            // CẢI THIỆN: Đồng bộ ngược lại các bản tin từ admin mà không có trong trang tin tức
            systemData.news.forEach(news => {
                const existsInPage = newsFromPage.some(n => n.id === news.id);
                if (!existsInPage) {
                    newsFromPage.push(news);
                }
            });
            
            // CẢI THIỆN: Cập nhật lại localStorage của trang tin tức với dữ liệu đầy đủ
            localStorage.setItem('newsData', JSON.stringify(newsFromPage));
            
            if (hasNewData) {
                this.saveData(systemData);
            }
            
            return true;
        }
        return false;
    },

    // CẢI THIỆN: Đồng bộ dữ liệu hai chiều khi chỉnh sửa bản tin
    syncNewsEdit: function(updatedNews) {
        const systemData = this.loadData();
        const newsPageData = localStorage.getItem('newsData');
        
        if (newsPageData) {
            const newsFromPage = JSON.parse(newsPageData);
            
            // Cập nhật bản tin trong cả hệ thống admin và trang tin tức
            const systemIndex = systemData.news.findIndex(n => n.id === updatedNews.id);
            if (systemIndex !== -1) {
                systemData.news[systemIndex] = updatedNews;
            }
            
            const pageIndex = newsFromPage.findIndex(n => n.id === updatedNews.id);
            if (pageIndex !== -1) {
                newsFromPage[pageIndex] = updatedNews;
            } else {
                // Nếu bản tin chưa có trong trang tin tức, thêm vào
                newsFromPage.push(updatedNews);
            }
            
            // Lưu cả hai bên
            localStorage.setItem('newsData', JSON.stringify(newsFromPage));
            this.saveData(systemData);
            
            return true;
        }
        return false;
    },

    // Show sync status
    showSyncStatus: function(type, message) {
        const statusEl = document.getElementById('sync-status');
        statusEl.className = `data-sync-status sync-${type}`;
        statusEl.innerHTML = `<i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'sync'} mr-2"></i><span>${message}</span>`;
        statusEl.classList.remove('hidden');
        
        setTimeout(() => {
            statusEl.classList.add('hidden');
        }, 3000);
    },

    // Export data
    exportData: function(type) {
        const data = this.loadData();
        let exportData, filename;
        
        switch(type) {
            case 'news':
                exportData = data.news;
                filename = 'ban-tin-khan-cap.csv';
                break;
            case 'reports':
                exportData = data.reports;
                filename = 'bao-cao-khan-cap.csv';
                break;
            case 'keys':
                exportData = data.keys;
                filename = 'key-id-he-thong.csv';
                break;
            case 'users':
                exportData = data.users;
                filename = 'tai-khoan-nguoi-dung.csv';
                break;
            default:
                return;
        }
        
        // Convert to CSV (simplified)
        const csv = this.convertToCSV(exportData);
        this.downloadCSV(csv, filename);
    },

    // Convert data to CSV
    convertToCSV: function(data) {
        if (data.length === 0) return '';
        
        const headers = Object.keys(data[0]);
        const csvRows = [headers.join(',')];
        
        for (const row of data) {
            const values = headers.map(header => {
                const escaped = ('' + row[header]).replace(/"/g, '""');
                return `"${escaped}"`;
            });
            csvRows.push(values.join(','));
        }
        
        return csvRows.join('\n');
    },

    // Download CSV file
    downloadCSV: function(csv, filename) {
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.setAttribute('hidden', '');
        a.setAttribute('href', url);
        a.setAttribute('download', filename);
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }
};

// Initialize the admin dashboard
document.addEventListener('DOMContentLoaded', function() {
    const dataManager = DataManager;
    let systemData = dataManager.loadData();
    
    // Tự động đồng bộ với trang tin tức khi khởi động
    dataManager.syncAllWithNewsPage();
    systemData = dataManager.loadData(); // Load lại data sau khi đồng bộ
    
    // Initialize charts
    initCharts();
    
    // Render all data
    renderNewsTable(systemData.news);
    renderReportsTable(systemData.reports);
    renderKeysTable(systemData.keys);
    renderUsersTable(systemData.users);
    updateDashboardStats(systemData);
    
    // Sidebar toggle
    document.getElementById('sidebar-toggle').addEventListener('click', function() {
        const sidebar = document.querySelector('.sidebar');
        const mainContent = document.querySelector('.main-content');
        
        sidebar.classList.toggle('collapsed');
        if (sidebar.classList.contains('collapsed')) {
            mainContent.classList.remove('ml-0');
            mainContent.classList.add('ml-20');
        } else {
            mainContent.classList.remove('ml-20');
            mainContent.classList.add('ml-0');
        }
    });

    // Tab navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all items
            document.querySelectorAll('.nav-item').forEach(i => {
                i.classList.remove('active');
                i.classList.remove('text-white');
                i.classList.add('text-gray-300');
            });
            
            // Add active class to clicked item
            this.classList.add('active');
            this.classList.add('text-white');
            this.classList.remove('text-gray-300');
            
            // Hide all tab contents
            document.querySelectorAll('.tab-content').forEach(tab => {
                tab.classList.remove('active');
            });
            
            // Show selected tab content
            const tabId = this.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
            
            // Update page title and description
            updatePageTitle(tabId);
        });
    });

    // Quick action buttons
    document.querySelectorAll('.quick-action-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const action = this.getAttribute('data-action');
            handleQuickAction(action);
        });
    });

    // News modal handlers
    document.getElementById('add-news-btn').addEventListener('click', function() {
        openNewsModal();
    });

    document.getElementById('close-news-modal').addEventListener('click', function() {
        closeNewsModal();
    });
    
    document.getElementById('cancel-news-btn').addEventListener('click', function() {
        closeNewsModal();
    });

    // News form submission - CẢI THIỆN: Đồng bộ khi lưu bản tin
    document.getElementById('news-form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const id = document.getElementById('news-id').value;
        const newNews = {
            id: id ? parseInt(id) : systemData.news.length + 1,
            title: document.getElementById('news-title').value,
            date: document.getElementById('news-date').value,
            type: document.getElementById('news-type').value,
            location: document.getElementById('news-location').value,
            img: document.getElementById('news-img').value,
            content: document.getElementById('news-content').value,
            status: document.getElementById('news-status').value
        };

        if (id) {
            // Edit existing news - CẢI THIỆN: Đồng bộ với trang tin tức
            const index = systemData.news.findIndex(n => n.id === parseInt(id));
            if (index !== -1) {
                systemData.news[index] = newNews;
                // Đồng bộ với trang tin tức
                DataManager.syncNewsEdit(newNews);
            }
        } else {
            // Add new news
            systemData.news.push(newNews);
            dataManager.saveData(systemData);
        }

        renderNewsTable(systemData.news);
        updateDashboardStats(systemData);
        closeNewsModal();
    });

    // Thêm sự kiện cho input hình ảnh để xem trước
    document.getElementById('news-img').addEventListener('input', function() {
        updateImagePreview(this.value);
    });

    // Key modal handlers
    document.getElementById('add-key-btn').addEventListener('click', function() {
        openKeyModal();
    });

    document.getElementById('close-key-modal').addEventListener('click', function() {
        closeKeyModal();
    });
    
    document.getElementById('cancel-key-btn').addEventListener('click', function() {
        closeKeyModal();
    });

    // Key form submission
    document.getElementById('key-form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const randomKey = 'RESCUE-KEY-' + Math.random().toString(36).substring(2, 10).toUpperCase() + 
                         '-' + Math.random().toString(36).substring(2, 6).toUpperCase();
        
        const newKey = {
            id: randomKey,
            type: document.getElementById('key-type').value,
            owner: document.getElementById('key-owner').value,
            created: new Date().toISOString().split('T')[0],
            expiry: calculateExpiryDate(parseInt(document.getElementById('key-expiry').value)),
            status: "active",
            permissions: getSelectedPermissions()
        };

        systemData.keys.push(newKey);
        dataManager.saveData(systemData);
        renderKeysTable(systemData.keys);
        updateDashboardStats(systemData);
        
        // Show generated key
        document.getElementById('new-key-value').textContent = randomKey;
        document.getElementById('generated-key-modal').classList.remove('hidden');
        closeKeyModal();
    });

    // Edit key modal handlers
    document.getElementById('close-edit-key-modal').addEventListener('click', function() {
        closeEditKeyModal();
    });
    
    document.getElementById('cancel-edit-key-btn').addEventListener('click', function() {
        closeEditKeyModal();
    });

    // Edit key form submission
    document.getElementById('edit-key-form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const keyId = document.getElementById('edit-key-id').value;
        const updatedKey = {
            id: keyId,
            type: document.getElementById('edit-key-type').value,
            owner: document.getElementById('edit-key-owner').value,
            created: document.getElementById('edit-key-created').value,
            expiry: document.getElementById('edit-key-expiry').value,
            status: document.getElementById('edit-key-status').value,
            permissions: getSelectedEditPermissions()
        };

        // Update key in system data
        const index = systemData.keys.findIndex(k => k.id === keyId);
        if (index !== -1) {
            systemData.keys[index] = updatedKey;
            dataManager.saveData(systemData);
            renderKeysTable(systemData.keys);
            updateDashboardStats(systemData);
            closeEditKeyModal();
        }
    });

    // User modal handlers
    document.getElementById('add-user-btn').addEventListener('click', function() {
        openUserModal();
    });

    document.getElementById('close-user-modal').addEventListener('click', function() {
        closeUserModal();
    });
    
    document.getElementById('cancel-user-btn').addEventListener('click', function() {
        closeUserModal();
    });

    // User form submission
    document.getElementById('user-form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const id = document.getElementById('user-id').value;
        const newUser = {
            id: id ? parseInt(id) : systemData.users.length + 1,
            username: document.getElementById('user-username').value,
            password: document.getElementById('user-password').value,
            fullname: document.getElementById('user-fullname').value,
            email: document.getElementById('user-email').value,
            role: document.getElementById('user-role').value,
            status: document.getElementById('user-status').value,
            permissions: getSelectedUserPermissions(),
            created: new Date().toISOString().split('T')[0]
        };

        if (id) {
            // Edit existing user
            const index = systemData.users.findIndex(u => u.id === parseInt(id));
            if (index !== -1) systemData.users[index] = newUser;
        } else {
            // Add new user
            systemData.users.push(newUser);
        }

        dataManager.saveData(systemData);
        renderUsersTable(systemData.users);
        updateDashboardStats(systemData);
        closeUserModal();
    });

    // Generated key modal handlers
    document.getElementById('close-generated-key-modal').addEventListener('click', function() {
        document.getElementById('generated-key-modal').classList.add('hidden');
    });

    document.getElementById('close-and-save-modal').addEventListener('click', function() {
        document.getElementById('generated-key-modal').classList.add('hidden');
    });

    document.getElementById('copy-key-btn').addEventListener('click', function() {
        const keyText = document.getElementById('new-key-value').textContent;
        navigator.clipboard.writeText(keyText)
            .then(() => {
                const btn = this;
                btn.innerHTML = '<i class="fas fa-check mr-2"></i> Đã sao chép';
                
                setTimeout(() => {
                    btn.innerHTML = '<i class="fas fa-copy mr-2"></i> Sao chép';
                }, 2000);
            });
    });

    // Export buttons
    document.getElementById('export-news-btn').addEventListener('click', function() {
        dataManager.exportData('news');
    });

    document.getElementById('export-reports-btn').addEventListener('click', function() {
        dataManager.exportData('reports');
    });

    // Sync data button - CẢI THIỆN: Đồng bộ hai chiều
    document.getElementById('sync-data-btn').addEventListener('click', function() {
        dataManager.showSyncStatus('pending', 'Đang đồng bộ dữ liệu...');
        setTimeout(() => {
            if (DataManager.syncAllWithNewsPage()) {
                const systemData = DataManager.loadData();
                renderNewsTable(systemData.news);
                updateDashboardStats(systemData);
                dataManager.showSyncStatus('success', 'Đã đồng bộ dữ liệu hai chiều');
            } else {
                dataManager.showSyncStatus('error', 'Không thể đồng bộ dữ liệu');
            }
        }, 1500);
    });

    // Quick action button
    document.getElementById('quick-action-btn').addEventListener('click', function() {
        openNewsModal();
    });

    // Sync news buttons - CẢI THIỆN: Đồng bộ hai chiều
    document.getElementById('sync-news-btn').addEventListener('click', function() {
        if (DataManager.syncAllWithNewsPage()) {
            const systemData = DataManager.loadData();
            renderNewsTable(systemData.news);
            updateDashboardStats(systemData);
            alert('Đã đồng bộ thành công dữ liệu hai chiều với trang tin tức!');
        } else {
            alert('Không tìm thấy dữ liệu từ trang tin tức để đồng bộ.');
        }
    });

    // News detail modal handlers
    document.getElementById('close-news-detail-modal').addEventListener('click', function() {
        document.getElementById('news-detail-modal').classList.add('hidden');
    });

    document.getElementById('close-detail-modal').addEventListener('click', function() {
        document.getElementById('news-detail-modal').classList.add('hidden');
    });

    document.getElementById('edit-from-detail-btn').addEventListener('click', function() {
        const id = parseInt(this.getAttribute('data-id'));
        const systemData = DataManager.loadData();
        const news = systemData.news.find(n => n.id === id);
        
        if (news) {
            document.getElementById('news-detail-modal').classList.add('hidden');
            openNewsModal(news);
        }
    });

    // Initialize page title
    updatePageTitle('dashboard');
});

function initCharts() {
    // Activity Chart
    const ctx = document.getElementById('activityChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'CN'],
            datasets: [{
                label: 'Sự cố mới',
                data: [12, 19, 8, 15, 14, 16, 10],
                borderColor: '#ef4444',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                tension: 0.4,
                fill: true
            }, {
                label: 'Sự cố đã giải quyết',
                data: [8, 12, 6, 10, 11, 14, 9],
                borderColor: '#10b981',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                tension: 0.4,
                fill: true
            }]
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

function renderNewsTable(newsData) {
    const tbody = document.getElementById('news-table-body');
    tbody.innerHTML = '';
    
    newsData.forEach(news => {
        const typeNames = {
            'thien-tai': 'Thiên tai',
            'tai-nan': 'Tai nạn',
            'cuu-ho': 'Cứu hộ',
            'canh-bao': 'Cảnh báo'
        };
        
        const statusBadge = news.status === 'published' 
            ? '<span class="badge badge-success">Đã đăng</span>'
            : '<span class="badge badge-warning">Bản nháp</span>';
        
        const typeBadge = news.type === 'thien-tai' 
            ? '<span class="badge badge-info">Thiên tai</span>'
            : news.type === 'tai-nan'
            ? '<span class="badge badge-danger">Tai nạn</span>'
            : news.type === 'cuu-ho'
            ? '<span class="badge badge-success">Cứu hộ</span>'
            : '<span class="badge badge-warning">Cảnh báo</span>';
        
        // Rút gọn tiêu đề nếu quá dài
        const shortTitle = news.title.length > 60 
            ? news.title.substring(0, 60) + '...' 
            : news.title;
        
        // Hiển thị địa điểm
        const locations = news.location.split(',').map(loc => {
            const locationNames = {
                'ha-noi': 'Hà Nội',
                'tp-hcm': 'TP.HCM',
                'da-nang': 'Đà Nẵng',
                'mien-bac': 'Miền Bắc',
                'mien-trung': 'Miền Trung',
                'tay-nguyen': 'Tây Nguyên',
                'dak-lak': 'Đắk Lắk',
                'binh-dinh': 'Bình Định',
                'thai-nguyen': 'Thái Nguyên',
                'lao-cai': 'Lào Cai',
                'toan-quoc': 'Toàn quốc'
            };
            return locationNames[loc] || loc;
        }).join(', ');
        
        const tr = document.createElement('tr');
        tr.className = 'table-row';
        tr.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${news.id}</td>
            <td class="px-6 py-4 text-sm text-gray-900 max-w-xs">
                <div class="font-medium">${shortTitle}</div>
                <div class="text-xs text-gray-500 mt-1">${locations}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${news.date}</td>
            <td class="px-6 py-4 whitespace-nowrap">${typeBadge}</td>
            <td class="px-6 py-4 whitespace-nowrap">${statusBadge}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button class="text-blue-600 hover:text-blue-900 mr-3 edit-news" data-id="${news.id}" title="Sửa">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="text-green-600 hover:text-green-900 mr-3 view-news" data-id="${news.id}" title="Xem chi tiết">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="text-red-600 hover:text-red-900 delete-news" data-id="${news.id}" title="Xóa">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
    
    // Thêm sự kiện cho nút xem chi tiết
    document.querySelectorAll('.view-news').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = parseInt(this.getAttribute('data-id'));
            const systemData = DataManager.loadData();
            const news = systemData.news.find(n => n.id === id);
            
            if (news) {
                openNewsDetailModal(news);
            }
        });
    });
    
    // SỬA LỖI: Thêm sự kiện cho nút sửa bản tin
    document.querySelectorAll('.edit-news').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = parseInt(this.getAttribute('data-id'));
            const systemData = DataManager.loadData();
            const news = systemData.news.find(n => n.id === id);
            
            if (news) {
                openNewsModal(news);
            }
        });
    });
    
    document.querySelectorAll('.delete-news').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = parseInt(this.getAttribute('data-id'));
            if (confirm('Bạn có chắc muốn xóa bản tin này?')) {
                const systemData = DataManager.loadData();
                systemData.news = systemData.news.filter(n => n.id !== id);
                DataManager.saveData(systemData);
                renderNewsTable(systemData.news);
                updateDashboardStats(systemData);
            }
        });
    });
}

function renderReportsTable(reportsData) {
    const tbody = document.getElementById('reports-table-body');
    tbody.innerHTML = '';
    
    reportsData.forEach(report => {
        const severityBadge = report.severity === 'critical' 
            ? '<span class="badge badge-danger">Khẩn cấp</span>'
            : report.severity === 'high'
            ? '<span class="badge badge-warning">Cao</span>'
            : '<span class="badge badge-info">Trung bình</span>';
        
        const statusBadge = report.status === 'active' 
            ? '<span class="badge badge-warning">Đang xử lý</span>'
            : report.status === 'resolved'
            ? '<span class="badge badge-success">Đã giải quyết</span>'
            : '<span class="badge badge-info">Đã tiếp nhận</span>';
        
        const typeNames = {
            'fire': 'Hỏa hoạn',
            'flood': 'Ngập lụt',
            'traffic': 'Tai nạn GT',
            'medical': 'Y tế',
            'disaster': 'Thiên tai'
        };
        
        const tr = document.createElement('tr');
        tr.className = 'table-row';
        tr.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${report.id}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${typeNames[report.type] || report.type}</td>
            <td class="px-6 py-4 text-sm text-gray-500">${report.location}</td>
            <td class="px-6 py-4 whitespace-nowrap">${severityBadge}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${new Date(report.timestamp).toLocaleTimeString()}</td>
            <td class="px-6 py-4 whitespace-nowrap">${statusBadge}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button class="text-blue-600 hover:text-blue-900 mr-4 view-report" data-id="${report.id}">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="text-green-600 hover:text-green-900 mr-4 resolve-report" data-id="${report.id}">
                    <i class="fas fa-check"></i>
                </button>
                <button class="text-red-600 hover:text-red-900 delete-report" data-id="${report.id}">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
    
    // Update reports count in sidebar
    document.getElementById('reports-count').textContent = reportsData.filter(r => r.status === 'active' || r.status === 'pending').length;
    
    // Add event listeners for report actions
    document.querySelectorAll('.resolve-report').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = parseInt(this.getAttribute('data-id'));
            const systemData = DataManager.loadData();
            const report = systemData.reports.find(r => r.id === id);
            
            if (report) {
                report.status = 'resolved';
                DataManager.saveData(systemData);
                renderReportsTable(systemData.reports);
                updateDashboardStats(systemData);
            }
        });
    });
    
    document.querySelectorAll('.delete-report').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = parseInt(this.getAttribute('data-id'));
            if (confirm('Bạn có chắc muốn xóa báo cáo này?')) {
                const systemData = DataManager.loadData();
                systemData.reports = systemData.reports.filter(r => r.id !== id);
                DataManager.saveData(systemData);
                renderReportsTable(systemData.reports);
                updateDashboardStats(systemData);
            }
        });
    });
}

function renderKeysTable(keysData) {
    const tbody = document.getElementById('keys-table-body');
    tbody.innerHTML = '';
    
    keysData.forEach(key => {
        const statusBadge = key.status === 'active' 
            ? '<span class="badge badge-success">Hoạt động</span>'
            : '<span class="badge badge-danger">Đã khóa</span>';
        
        const typeNames = {
            'fire': 'Cứu hỏa',
            'police': 'Công an',
            'medical': 'Y tế',
            'rescuer': 'Cứu hộ',
            'admin': 'Quản trị'
        };
        
        const tr = document.createElement('tr');
        tr.className = 'table-row';
        tr.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 font-mono">${key.id}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${typeNames[key.type] || key.type}</td>
            <td class="px-6 py-4 text-sm text-gray-500">${key.owner}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${key.created}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${key.expiry}</td>
            <td class="px-6 py-4 whitespace-nowrap">${statusBadge}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button class="text-blue-600 hover:text-blue-900 mr-4 edit-key" data-id="${key.id}">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="text-blue-600 hover:text-blue-900 mr-4 copy-key" data-id="${key.id}">
                    <i class="fas fa-copy"></i>
                </button>
                <button class="text-red-600 hover:text-red-900 delete-key" data-id="${key.id}">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
    
    // Add event listeners for key actions
    document.querySelectorAll('.edit-key').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            const systemData = DataManager.loadData();
            const key = systemData.keys.find(k => k.id === id);
            
            if (key) {
                openEditKeyModal(key);
            }
        });
    });
    
    document.querySelectorAll('.copy-key').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            navigator.clipboard.writeText(id)
                .then(() => {
                    alert('Key ID đã được sao chép: ' + id);
                });
        });
    });
    
    document.querySelectorAll('.delete-key').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            if (confirm('Bạn có chắc muốn xóa Key ID này?')) {
                const systemData = DataManager.loadData();
                systemData.keys = systemData.keys.filter(k => k.id !== id);
                DataManager.saveData(systemData);
                renderKeysTable(systemData.keys);
                updateDashboardStats(systemData);
            }
        });
    });
}

function renderUsersTable(usersData) {
    const tbody = document.getElementById('users-table-body');
    tbody.innerHTML = '';
    
    usersData.forEach(user => {
        const statusBadge = user.status === 'active' 
            ? '<span class="badge badge-success">Hoạt động</span>'
            : '<span class="badge badge-danger">Đã khóa</span>';
        
        const roleNames = {
            'admin': 'Quản trị viên',
            'moderator': 'Điều phối viên',
            'rescuer': 'Nhân viên cứu hộ',
            'viewer': 'Người xem'
        };
        
        const roleBadge = user.role === 'admin' 
            ? '<span class="badge badge-danger">Quản trị viên</span>'
            : user.role === 'moderator'
            ? '<span class="badge badge-warning">Điều phối viên</span>'
            : user.role === 'rescuer'
            ? '<span class="badge badge-info">Nhân viên cứu hộ</span>'
            : '<span class="badge badge-secondary">Người xem</span>';
        
        const tr = document.createElement('tr');
        tr.className = 'table-row';
        tr.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${user.id}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${user.username}</td>
            <td class="px-6 py-4 text-sm text-gray-500">${user.fullname}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${user.email}</td>
            <td class="px-6 py-4 whitespace-nowrap">${roleBadge}</td>
            <td class="px-6 py-4 whitespace-nowrap">${statusBadge}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button class="text-blue-600 hover:text-blue-900 mr-4 edit-user" data-id="${user.id}">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="text-red-600 hover:text-red-900 delete-user" data-id="${user.id}">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
    
    // Add event listeners for user actions
    document.querySelectorAll('.edit-user').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = parseInt(this.getAttribute('data-id'));
            const systemData = DataManager.loadData();
            const user = systemData.users.find(u => u.id === id);
            
            if (user) {
                openUserModal(user);
            }
        });
    });
    
    document.querySelectorAll('.delete-user').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = parseInt(this.getAttribute('data-id'));
            if (confirm('Bạn có chắc muốn xóa người dùng này?')) {
                const systemData = DataManager.loadData();
                systemData.users = systemData.users.filter(u => u.id !== id);
                DataManager.saveData(systemData);
                renderUsersTable(systemData.users);
                updateDashboardStats(systemData);
            }
        });
    });
}

function updateDashboardStats(systemData) {
    // Update stats cards
    document.getElementById('active-incidents').textContent = 
        systemData.reports.filter(r => r.status === 'active').length;
    document.getElementById('total-news').textContent = systemData.news.length;
    document.getElementById('active-users').textContent = systemData.users.filter(u => u.status === 'active').length;
    document.getElementById('active-keys').textContent = 
        systemData.keys.filter(k => k.status === 'active').length;
    
    document.getElementById('today-incidents').textContent = 
        systemData.reports.filter(r => {
            const reportDate = new Date(r.timestamp).toDateString();
            const today = new Date().toDateString();
            return reportDate === today;
        }).length;
    
    document.getElementById('resolved-incidents').textContent = 
        systemData.reports.filter(r => r.status === 'resolved').length;
    
    // Update recent reports
    const recentReportsContainer = document.getElementById('recent-reports');
    recentReportsContainer.innerHTML = '';
    
    const recentReports = systemData.reports
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .slice(0, 4);
    
    recentReports.forEach(report => {
        const typeIcons = {
            'fire': 'fire',
            'flood': 'tint',
            'traffic': 'car-crash',
            'medical': 'user-injured',
            'disaster': 'mountain'
        };
        
        const severityColors = {
            'critical': 'red',
            'high': 'yellow',
            'medium': 'blue'
        };
        
        const reportEl = document.createElement('div');
        reportEl.className = `flex items-start p-4 bg-${severityColors[report.severity]}-50 rounded-xl border-l-4 border-${severityColors[report.severity]}-500`;
        reportEl.innerHTML = `
            <div class="w-12 h-12 bg-${severityColors[report.severity]}-500 rounded-xl flex items-center justify-center text-white mr-4 flex-shrink-0">
                <i class="fas fa-${typeIcons[report.type]}"></i>
            </div>
            <div class="flex-1">
                <p class="font-semibold text-gray-800">${report.type === 'fire' ? 'Hỏa hoạn' : report.type === 'traffic' ? 'Tai nạn giao thông' : report.type === 'flood' ? 'Ngập lụt' : 'Sự cố'} tại ${report.location}</p>
                <p class="text-sm text-gray-600 mt-1">${report.location} • ${new Date(report.timestamp).toLocaleTimeString()}</p>
                <div class="flex items-center mt-2">
                    <span class="badge badge-${report.severity === 'critical' ? 'danger' : report.severity === 'high' ? 'warning' : 'info'}">${report.severity === 'critical' ? 'Khẩn cấp' : report.severity === 'high' ? 'Cao' : 'Trung bình'}</span>
                    <span class="text-xs text-gray-500 ml-2">${report.status === 'active' ? 'Đang xử lý' : report.status === 'resolved' ? 'Đã giải quyết' : 'Đã tiếp nhận'}</span>
                </div>
            </div>
        `;
        recentReportsContainer.appendChild(reportEl);
    });
}

function openNewsModal(news = null) {
    if (news) {
        document.getElementById('news-modal-title').textContent = 'Sửa Bản tin';
        document.getElementById('news-id').value = news.id;
        document.getElementById('news-title').value = news.title;
        document.getElementById('news-date').value = news.date;
        document.getElementById('news-type').value = news.type;
        document.getElementById('news-location').value = news.location;
        document.getElementById('news-img').value = news.img;
        document.getElementById('news-content').value = news.content;
        document.getElementById('news-status').value = news.status;
        
        // Thêm xem trước hình ảnh
        updateImagePreview(news.img);
    } else {
        document.getElementById('news-modal-title').textContent = 'Thêm Bản tin mới';
        document.getElementById('news-form').reset();
        document.getElementById('news-id').value = '';
        document.getElementById('news-status').value = 'published';
        document.getElementById('news-date').value = new Date().toISOString().split('T')[0];
        document.getElementById('image-preview').innerHTML = '';
    }
    document.getElementById('news-modal').classList.remove('hidden');
}

function closeNewsModal() {
    document.getElementById('news-modal').classList.add('hidden');
}

function openNewsDetailModal(news) {
    document.getElementById('detail-news-img').src = news.img;
    document.getElementById('detail-news-title').textContent = news.title;
    document.getElementById('detail-news-date').textContent = news.date;
    
    const typeNames = {
        'thien-tai': 'Thiên tai',
        'tai-nan': 'Tai nạn',
        'cuu-ho': 'Cứu hộ',
        'canh-bao': 'Cảnh báo'
    };
    document.getElementById('detail-news-type').textContent = typeNames[news.type] || news.type;
    
    // Định dạng địa điểm
    const locations = news.location.split(',').map(loc => {
        const locationNames = {
            'ha-noi': 'Hà Nội',
            'tp-hcm': 'TP.HCM',
            'da-nang': 'Đà Nẵng',
            'mien-bac': 'Miền Bắc',
            'mien-trung': 'Miền Trung',
            'tay-nguyen': 'Tây Nguyên',
            'dak-lak': 'Đắk Lắk',
            'binh-dinh': 'Bình Định',
            'thai-nguyen': 'Thái Nguyên',
            'lao-cai': 'Lào Cai',
            'toan-quoc': 'Toàn quốc'
        };
        return locationNames[loc] || loc;
    }).join(', ');
    document.getElementById('detail-news-location').textContent = locations;
    
    document.getElementById('detail-news-status').textContent = news.status === 'published' ? 'Đã đăng' : 'Bản nháp';
    document.getElementById('detail-news-content').innerHTML = news.content;
    
    // Lưu ID của bản tin đang xem để sửa
    document.getElementById('edit-from-detail-btn').setAttribute('data-id', news.id);
    
    document.getElementById('news-detail-modal').classList.remove('hidden');
}

function updateImagePreview(imgUrl) {
    const previewContainer = document.getElementById('image-preview');
    if (imgUrl) {
        previewContainer.innerHTML = `
            <div class="mt-2">
                <p class="text-sm text-gray-600 mb-2">Xem trước hình ảnh:</p>
                <img src="${imgUrl}" alt="Preview" class="max-w-full h-48 object-cover rounded-lg border">
            </div>
        `;
    } else {
        previewContainer.innerHTML = '';
    }
}

function openKeyModal() {
    document.getElementById('key-form').reset();
    document.getElementById('key-modal').classList.remove('hidden');
}

function closeKeyModal() {
    document.getElementById('key-modal').classList.add('hidden');
}

function openEditKeyModal(key) {
    document.getElementById('edit-key-id').value = key.id;
    document.getElementById('edit-key-type').value = key.type;
    document.getElementById('edit-key-owner').value = key.owner;
    document.getElementById('edit-key-created').value = key.created;
    document.getElementById('edit-key-expiry').value = key.expiry;
    document.getElementById('edit-key-status').value = key.status;
    
    // Set permissions checkboxes
    document.getElementById('edit-perm-reports').checked = key.permissions.includes('reports');
    document.getElementById('edit-perm-respond').checked = key.permissions.includes('respond');
    document.getElementById('edit-perm-create').checked = key.permissions.includes('create');
    document.getElementById('edit-perm-admin').checked = key.permissions.includes('admin');
    
    document.getElementById('edit-key-modal').classList.remove('hidden');
}

function closeEditKeyModal() {
    document.getElementById('edit-key-modal').classList.add('hidden');
}

function openUserModal(user = null) {
    if (user) {
        document.getElementById('user-modal-title').textContent = 'Sửa Người dùng';
        document.getElementById('user-id').value = user.id;
        document.getElementById('user-username').value = user.username;
        document.getElementById('user-password').value = user.password;
        document.getElementById('user-fullname').value = user.fullname;
        document.getElementById('user-email').value = user.email;
        document.getElementById('user-role').value = user.role;
        document.getElementById('user-status').value = user.status;
        
        // Set permissions checkboxes
        document.getElementById('user-perm-news').checked = user.permissions.includes('news');
        document.getElementById('user-perm-reports').checked = user.permissions.includes('reports');
        document.getElementById('user-perm-respond').checked = user.permissions.includes('respond');
        document.getElementById('user-perm-users').checked = user.permissions.includes('users');
    } else {
        document.getElementById('user-modal-title').textContent = 'Thêm Người dùng mới';
        document.getElementById('user-form').reset();
        document.getElementById('user-id').value = '';
        document.getElementById('user-status').value = 'active';
    }
    document.getElementById('user-modal').classList.remove('hidden');
}

function closeUserModal() {
    document.getElementById('user-modal').classList.add('hidden');
}

function handleQuickAction(action) {
    switch(action) {
        case 'add-news':
            openNewsModal();
            break;
        case 'add-key':
            openKeyModal();
            break;
        case 'add-user':
            openUserModal();
            break;
        case 'view-reports':
            document.querySelector('[data-tab="reports"]').click();
            break;
    }
}

function calculateExpiryDate(days) {
    if (days === 0) return 'Vĩnh viễn';
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toISOString().split('T')[0];
}

function getSelectedPermissions() {
    const permissions = [];
    if (document.getElementById('perm-reports').checked) permissions.push('reports');
    if (document.getElementById('perm-respond').checked) permissions.push('respond');
    if (document.getElementById('perm-create').checked) permissions.push('create');
    if (document.getElementById('perm-admin').checked) permissions.push('admin');
    return permissions;
}

function getSelectedEditPermissions() {
    const permissions = [];
    if (document.getElementById('edit-perm-reports').checked) permissions.push('reports');
    if (document.getElementById('edit-perm-respond').checked) permissions.push('respond');
    if (document.getElementById('edit-perm-create').checked) permissions.push('create');
    if (document.getElementById('edit-perm-admin').checked) permissions.push('admin');
    return permissions;
}

function getSelectedUserPermissions() {
    const permissions = [];
    if (document.getElementById('user-perm-news').checked) permissions.push('news');
    if (document.getElementById('user-perm-reports').checked) permissions.push('reports');
    if (document.getElementById('user-perm-respond').checked) permissions.push('respond');
    if (document.getElementById('user-perm-users').checked) permissions.push('users');
    return permissions;
}

function updatePageTitle(tabId) {
    const titles = {
        'dashboard': { 
            title: 'Tổng quan hệ thống', 
            desc: 'Thống kê và phân tích toàn bộ hệ thống cứu hộ quốc gia' 
        },
        'news': { 
            title: 'Quản lý Bản tin', 
            desc: 'Thêm, sửa, xóa và quản lý các bản tin khẩn cấp' 
        },
        'reports': { 
            title: 'Báo cáo khẩn cấp', 
            desc: 'Xem và xử lý các báo cáo khẩn cấp từ người dùng' 
        },
        'keys': { 
            title: 'Quản lý Key ID', 
            desc: 'Tạo và quản lý các Key ID cho đơn vị cứu hộ' 
        },
        'users': { 
            title: 'Quản lý Người dùng', 
            desc: 'Quản lý tài khoản người dùng và phân quyền' 
        }, 
        'settings': { 
            title: 'Cài đặt hệ thống', 
            desc: 'Cấu hình các thông số hệ thống' 
        }
    };
    
    document.getElementById('page-title').textContent = titles[tabId].title;
    document.getElementById('page-description').textContent = titles[tabId].desc;
}

// Auto-save functionality
setInterval(() => {
    const systemData = DataManager.loadData();
    DataManager.saveData(systemData);
}, 30000); // Auto-save every 30 seconds



