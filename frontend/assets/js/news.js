

//map
console.log('News module loaded');


//index
// News functionality for Emergency Rescue System
// assets/js/news.js - Phiên bản dành riêng cho trang chủ
console.log('News module loaded for homepage');

class NewsManager {
    constructor() {
        this.news = [];
        this.currentPage = 1;
        this.itemsPerPage = 8;
        this.init();
    }
    
    async init() {
        console.log('Initializing NewsManager...');
        await this.loadNews();
        this.renderNews();
        this.setupEventListeners();
        this.startAutoRefresh();
    }
    
    async loadNews() {
        try {
            console.log('Loading news data...');
            // Thử load từ API trước
            if (typeof ApiService !== 'undefined' && ApiService.getNews) {
                this.news = await ApiService.getNews();
            } else {
                // Fallback về mock data
                throw new Error('ApiService not available');
            }
        } catch (error) {
            console.log('Using mock news data:', error.message);
            this.news = this.getMockNews();
        }
        console.log(`Loaded ${this.news.length} news items`);
    }
    
    renderNews() {
        const newsGrid = document.getElementById('news-grid');
        if (!newsGrid) {
            console.error('News grid element not found!');
            return;
        }
        
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const newsToShow = this.news.slice(startIndex, endIndex);
        
        console.log(`Rendering ${newsToShow.length} news items`);
        
        if (newsToShow.length === 0) {
            newsGrid.innerHTML = `
                <div class="col-span-full text-center py-12">
                    <i data-feather="file-text" class="w-12 h-12 text-gray-400 mx-auto mb-4"></i>
                    <p class="text-gray-500">Không có bản tin nào.</p>
                </div>
            `;
            feather.replace();
            return;
        }
        
        newsGrid.innerHTML = newsToShow.map(newsItem => this.createNewsCard(newsItem)).join('');
        feather.replace();
        
        // Thêm hiệu ứng xuất hiện
        this.animateNewsCards();
    }
    
    createNewsCard(newsItem) {
        const timeAgo = this.formatTimeAgo(newsItem.publishedAt);
        const typeIcon = this.getTypeIcon(newsItem.type);
        const severityClass = this.getSeverityClass(newsItem.severity);
        
        return `
            <div class="news-card bg-white rounded-xl shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 opacity-0"
                 onclick="newsManager.openNewsModal(${newsItem.id})">
                <div class="relative">
                    <img src="${newsItem.image}" alt="${newsItem.title}" 
                         class="w-full h-48 object-cover" 
                         onerror="this.src='https://images.unsplash.com/photo-1583324113626-70df0f4deaab?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'">
                    <div class="absolute top-3 right-3 ${severityClass} px-2 py-1 rounded-full text-xs font-semibold text-white">
                        ${this.getSeverityLabel(newsItem.severity)}
                    </div>
                    <div class="absolute bottom-3 left-3 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs">
                        ${typeIcon} ${this.getTypeLabel(newsItem.type)}
                    </div>
                </div>
                <div class="p-4">
                    <h3 class="font-bold text-lg mb-2 line-clamp-2 text-gray-800 leading-tight">${newsItem.title}</h3>
                    <p class="text-gray-600 text-sm mb-3 line-clamp-2 leading-relaxed">${newsItem.summary}</p>
                    <div class="flex justify-between items-center text-xs text-gray-500">
                        <span class="flex items-center">
                            <i data-feather="clock" class="w-3 h-3 mr-1"></i>
                            ${timeAgo}
                        </span>
                        <span class="flex items-center">
                            <i data-feather="map-pin" class="w-3 h-3 mr-1"></i>
                            ${newsItem.location}
                        </span>
                    </div>
                </div>
            </div>
        `;
    }
    
    animateNewsCards() {
        const cards = document.querySelectorAll('.news-card');
        cards.forEach((card, index) => {
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }
    
    formatTimeAgo(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);
        
        if (diffInSeconds < 60) return 'Vừa xong';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} phút trước`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} giờ trước`;
        if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} ngày trước`;
        
        return date.toLocaleDateString('vi-VN');
    }
    
    getTypeIcon(type) {
        const icons = {
            warning: '⚠️',
            info: 'ℹ️',
            emergency: '🚨',
            update: '📢',
            fire: '🔥',
            flood: '💧',
            accident: '🚗',
            disaster: '🌪️',
            medical: '🏥'
        };
        return icons[type] || '📰';
    }
    
    getTypeLabel(type) {
        const labels = {
            warning: 'Cảnh báo',
            info: 'Thông tin',
            emergency: 'Khẩn cấp',
            update: 'Cập nhật',
            fire: 'Hỏa hoạn',
            flood: 'Ngập lụt',
            accident: 'Tai nạn',
            disaster: 'Thiên tai',
            medical: 'Y tế'
        };
        return labels[type] || 'Tin tức';
    }
    
    getSeverityClass(severity) {
        const classes = {
            critical: 'bg-red-600',
            high: 'bg-red-500',
            medium: 'bg-orange-500',
            low: 'bg-yellow-500',
            info: 'bg-blue-500'
        };
        return classes[severity] || 'bg-gray-500';
    }
    
    getSeverityLabel(severity) {
        const labels = {
            critical: 'Khẩn cấp',
            high: 'Cao',
            medium: 'Trung bình',
            low: 'Thấp',
            info: 'Thông tin'
        };
        return labels[severity] || 'Không xác định';
    }
    
    setupEventListeners() {
        console.log('Setting up event listeners...');
        
        // Modal close button
        const closeModal = document.getElementById('close-modal');
        if (closeModal) {
            closeModal.addEventListener('click', () => this.closeNewsModal());
        }
        
        // Modal backdrop click
        const modal = document.getElementById('news-modal');
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeNewsModal();
                }
            });
        }
        
        // Share button
        const shareBtn = document.getElementById('share-news');
        if (shareBtn) {
            shareBtn.addEventListener('click', () => this.shareCurrentNews());
        }
        
        // Escape key to close modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeNewsModal();
            }
        });
        
        console.log('Event listeners setup completed');
    }
    
    openNewsModal(newsId) {
        console.log('Opening news modal for ID:', newsId);
        const newsItem = this.news.find(item => item.id === newsId);
        if (!newsItem) {
            console.error('News item not found:', newsId);
            return;
        }
        
        const modal = document.getElementById('news-modal');
        const title = document.getElementById('modal-title');
        const content = document.getElementById('modal-content');
        const mapLink = document.getElementById('map-link');
        const relatedContainer = document.querySelector('#related-news .space-y-2');
        
        if (!modal || !title || !content) {
            console.error('Modal elements not found');
            return;
        }
        
        // Set modal content
        title.textContent = newsItem.title;
        content.innerHTML = this.createModalContent(newsItem);
        
        // Set map link
        if (mapLink && newsItem.coordinates) {
            mapLink.href = `map.html?lat=${newsItem.coordinates[0]}&lng=${newsItem.coordinates[1]}&zoom=15`;
            mapLink.style.display = 'inline-flex';
        } else {
            mapLink.style.display = 'none';
        }
        
        // Show related news
        if (relatedContainer) {
            const related = this.getRelatedNews(newsItem);
            relatedContainer.innerHTML = related.map(item => `
                <div class="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded cursor-pointer transition-colors" 
                     onclick="newsManager.openNewsModal(${item.id})">
                    <img src="${item.image}" alt="${item.title}" 
                         class="w-12 h-12 object-cover rounded"
                         onerror="this.src='https://images.unsplash.com/photo-1583324113626-70df0f4deaab?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80'">
                    <div class="flex-1 min-w-0">
                        <p class="text-sm font-medium text-gray-900 truncate">${item.title}</p>
                        <p class="text-xs text-gray-500">${this.formatTimeAgo(item.publishedAt)}</p>
                    </div>
                </div>
            `).join('');
        }
        
        // Show modal
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        
        // Update Feather icons in modal
        feather.replace();
        
        // Track view
        this.trackNewsView(newsItem);
    }
    
    createModalContent(newsItem) {
        const formattedDate = new Date(newsItem.publishedAt).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        return `
            <div class="mb-4">
                <img src="${newsItem.image}" alt="${newsItem.title}" 
                     class="w-full h-64 object-cover rounded-lg"
                     onerror="this.src='https://images.unsplash.com/photo-1583324113626-70df0f4deaab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'">
            </div>
            <div class="flex items-center space-x-4 text-sm text-gray-600 mb-4 flex-wrap gap-2">
                <span class="flex items-center bg-gray-100 px-3 py-1 rounded-full">
                    <i data-feather="clock" class="w-4 h-4 mr-1"></i>
                    ${formattedDate}
                </span>
                <span class="flex items-center bg-gray-100 px-3 py-1 rounded-full">
                    <i data-feather="map-pin" class="w-4 h-4 mr-1"></i>
                    ${newsItem.location}
                </span>
                <span class="flex items-center ${this.getSeverityClass(newsItem.severity)} text-white px-3 py-1 rounded-full">
                    <i data-feather="alert-circle" class="w-4 h-4 mr-1"></i>
                    ${this.getSeverityLabel(newsItem.severity)}
                </span>
            </div>
            <div class="prose max-w-none text-gray-700 leading-relaxed">
                <p class="text-lg font-semibold mb-4 text-gray-900">${newsItem.summary}</p>
                ${newsItem.content ? `<div class="mt-4">${newsItem.content}</div>` : ''}
            </div>
            ${newsItem.affectedAreas ? `
                <div class="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <h4 class="font-semibold text-yellow-800 mb-2 flex items-center">
                        <i data-feather="alert-triangle" class="w-4 h-4 mr-2"></i>
                        Khu vực ảnh hưởng
                    </h4>
                    <p class="text-yellow-700">${newsItem.affectedAreas}</p>
                </div>
            ` : ''}
            ${newsItem.safetyInstructions ? `
                <div class="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 class="font-semibold text-blue-800 mb-2 flex items-center">
                        <i data-feather="shield" class="w-4 h-4 mr-2"></i>
                        Hướng dẫn an toàn
                    </h4>
                    <p class="text-blue-700">${newsItem.safetyInstructions}</p>
                </div>
            ` : ''}
            ${newsItem.contactInfo ? `
                <div class="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <h4 class="font-semibold text-green-800 mb-2 flex items-center">
                        <i data-feather="phone" class="w-4 h-4 mr-2"></i>
                        Thông tin liên hệ
                    </h4>
                    <p class="text-green-700">${newsItem.contactInfo}</p>
                </div>
            ` : ''}
        `;
    }
    
    getRelatedNews(currentNews) {
        return this.news
            .filter(item => 
                item.id !== currentNews.id && 
                (item.type === currentNews.type || item.location === currentNews.location)
            )
            .slice(0, 3);
    }
    
    closeNewsModal() {
        const modal = document.getElementById('news-modal');
        if (modal) {
            modal.classList.add('hidden');
            document.body.style.overflow = '';
        }
    }
    
    shareCurrentNews() {
        const modal = document.getElementById('news-modal');
        const title = document.getElementById('modal-title');
        
        if (!modal.classList.contains('hidden') && title) {
            const newsItem = this.news.find(item => item.title === title.textContent);
            if (newsItem) {
                this.shareNews(newsItem);
            }
        }
    }
    
    shareNews(newsItem) {
        const shareData = {
            title: newsItem.title,
            text: newsItem.summary,
            url: window.location.href
        };
        
        if (navigator.share) {
            navigator.share(shareData)
                .then(() => console.log('News shared successfully'))
                .catch(error => console.log('Error sharing news:', error));
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(shareData.url).then(() => {
                alert('Đã sao chép liên kết vào clipboard');
            });
        }
    }
    
    trackNewsView(newsItem) {
        console.log('News viewed:', newsItem.title);
        // Có thể thêm analytics tracking ở đây
    }
    
    startAutoRefresh() {
        // Tự động cập nhật tin mới mỗi 2 phút
        setInterval(async () => {
            console.log('Auto-refreshing news...');
            const oldCount = this.news.length;
            await this.loadNews();
            
            if (this.news.length > oldCount) {
                console.log(`Found ${this.news.length - oldCount} new news items`);
                this.renderNews();
                this.showNewNewsNotification(this.news.length - oldCount);
            }
        }, 2 * 60 * 1000); // 2 phút
    }
    
    showNewNewsNotification(count) {
        // Hiển thị thông báo có tin mới
        const notification = document.createElement('div');
        notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 transform transition-transform duration-300';
        notification.innerHTML = `
            <div class="flex items-center">
                <i data-feather="refresh-cw" class="w-4 h-4 mr-2"></i>
                <span>Có ${count} bản tin mới</span>
                <button onclick="this.parentElement.parentElement.remove()" class="ml-2">
                    <i data-feather="x" class="w-4 h-4"></i>
                </button>
            </div>
        `;
        
        document.body.appendChild(notification);
        feather.replace();
        
        // Tự động ẩn sau 5 giây
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }
    
    getMockNews() {
        return [
            {
                id: 1,
                title: "Cảnh báo mưa lớn diện rộng tại miền Trung",
                summary: "Mưa lớn kéo dài gây ngập lụt nhiều khu vực tại các tỉnh miền Trung, người dân cần đề phòng",
                content: "Theo Trung tâm Dự báo Khí tượng Thủy văn Quốc gia, mưa lớn diện rộng đang xảy ra tại các tỉnh miền Trung. Lượng mưa phổ biến từ 100-200mm, có nơi trên 250mm. Tình trạng ngập lụt cục bộ có thể xảy ra tại các khu vực trũng thấp.",
                type: "flood",
                severity: "high",
                location: "Miền Trung",
                image: "https://images.unsplash.com/photo-1599058917765-7805dd3c0a56?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
                coordinates: [16.047079, 108.206230],
                affectedAreas: "Các tỉnh từ Thừa Thiên Huế đến Khánh Hòa",
                safetyInstructions: "Người dân hạn chế ra đường, chuẩn bị sẵn sàng phương án sơ tán, theo dõi thông tin cảnh báo",
                contactInfo: "Đường dây nóng: 024.382.218.83"
            },
            {
                id: 2,
                title: "Hỏa hoạn tại chung cư Quận 1, TP.HCM",
                summary: "Đám cháy bùng phát tại tầng hầm chung cư cao cấp, lực lượng cứu hộ đang có mặt hiện trường",
                content: "Một vụ hỏa hoạn đã xảy ra tại tầng hầm chung cư cao cấp trên đường Lê Duẩn, Quận 1. Nguyên nhân ban đầu được xác định do chập điện. Lực lượng PCCC đã có mặt và đang nỗ lực dập lửa.",
                type: "fire",
                severity: "critical",
                location: "Quận 1, TP.HCM",
                image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
                coordinates: [10.7769, 106.7009],
                safetyInstructions: "Người dân xung quanh di chuyển ra khu vực an toàn, nhường đường cho xe cứu hỏa",
                contactInfo: "Cảnh sát PCCC: 114"
            },
            {
                id: 3,
                title: "Tai nạn giao thông nghiêm trọng trên cao tốc Hà Nội - Hải Phòng",
                summary: "Va chạm liên hoàn giữa 5 xe ô tô, một số người bị thương",
                type: "accident",
                severity: "high",
                location: "Hải Phòng",
                image: "https://images.unsplash.com/photo-1558618666-fcd25856cd63?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
                coordinates: [20.8445, 106.6881],
                safetyInstructions: "Các phương tiện nên chọn tuyến đường thay thế"
            },
            {
                id: 4,
                title: "Cập nhật tình hình bão số 5",
                summary: "Bão đang di chuyển với sức gió mạnh, dự kiến đổ bộ vào đất liền trong 24h tới",
                type: "disaster",
                severity: "critical",
                location: "Vùng biển Đông",
                image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
                publishedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
                coordinates: [15.5, 112.0],
                affectedAreas: "Các tỉnh từ Quảng Ninh đến Quảng Ngãi",
                safetyInstructions: "Tàu thuyền vào nơi trú ẩn, người dân ven biển sơ tán"
            }
        ];
    }
}

// Khởi tạo ngay khi DOM ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing news manager...');
    window.newsManager = new NewsManager();
});

// Fallback: khởi tạo nếu DOM đã sẵn sàng
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        window.newsManager = new NewsManager();
    });
} else {
    window.newsManager = new NewsManager();
}




// Hàm lấy 4 tin mới nhất
function getLatestNews(count = 4) {
    return emergenciesData
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .slice(0, count);
}

// Hàm hiển thị tin tức lên grid (sửa lại)
function displayNews(newsArray, limit = null) {
    const newsGrid = document.getElementById('news-grid');
    
    if (!newsGrid) return;

    // Clear existing content
    newsGrid.innerHTML = '';

    // Hiển thị tin theo limit hoặc tất cả
    const displayNews = limit ? newsArray.slice(0, limit) : newsArray;

    displayNews.forEach(emergency => {
        const newsCard = createNewsCard(emergency);
        newsGrid.appendChild(newsCard);
    });
    
    // Refresh feather icons
    feather.replace();
}





// Hàm fetch dữ liệu từ JSON
async function fetchLatestEmergencies() {
    try {
        const response = await fetch('data/emergencies.json');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data.emergencies;
    } catch (error) {
        console.error('Error fetching emergencies data:', error);
        return [];
    }
}

// Hàm hiển thị 4 tin mới nhất
function displayLatestEmergencies(emergencies) {
    const grid = document.getElementById('latest-emergencies-grid');
    if (!grid) return;

    // Lấy 4 tin mới nhất
    const latestNews = emergencies
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .slice(0, 4);

    grid.innerHTML = '';

    latestNews.forEach(emergency => {
        const card = createEmergencyCard(emergency);
        grid.appendChild(card);
    });
    
    // Refresh feather icons
    if (typeof feather !== 'undefined') {
        feather.replace();
    }
}

// Hàm tạo card tin khẩn cấp
function createEmergencyCard(emergency) {
    const card = document.createElement('div');
    card.className = 'bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer border border-gray-200';
    
    // Map type to Vietnamese and colors
    const typeMap = {
        'fire': { name: 'Hỏa hoạn', color: 'red', icon: 'flame' },
        'flood': { name: 'Ngập lụt', color: 'blue', icon: 'droplet' },
        'accident': { name: 'Tai nạn', color: 'orange', icon: 'activity' },
        'disaster': { name: 'Thiên tai', color: 'purple', icon: 'alert-octagon' },
        'medical': { name: 'Y tế', color: 'green', icon: 'heart' }
    };

    const typeInfo = typeMap[emergency.type] || { name: 'Khẩn cấp', color: 'gray', icon: 'alert-triangle' };
    
    // Format date
    const date = new Date(emergency.timestamp);
    const formattedDate = date.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });

    // Status badge
    const statusMap = {
        'active': { text: 'Đang xử lý', color: 'bg-red-100 text-red-800' },
        'resolved': { text: 'Đã giải quyết', color: 'bg-green-100 text-green-800' },
        'warning': { text: 'Cảnh báo', color: 'bg-yellow-100 text-yellow-800' }
    };
    const statusInfo = statusMap[emergency.status] || { text: 'Không xác định', color: 'bg-gray-100 text-gray-800' };

    card.innerHTML = `
        <div class="relative">
            <img src="${emergency.image}" alt="${emergency.title}" class="w-full h-40 object-cover">
            <div class="absolute top-2 left-2">
                <span class="px-2 py-1 ${statusInfo.color} rounded-full text-xs font-medium">
                    ${statusInfo.text}
                </span>
            </div>
            <div class="absolute top-2 right-2">
                <span class="px-2 py-1 bg-${typeInfo.color}-100 text-${typeInfo.color}-800 rounded-full text-xs font-medium flex items-center">
                    <i data-feather="${typeInfo.icon}" class="w-3 h-3 mr-1"></i>
                    ${typeInfo.name}
                </span>
            </div>
        </div>
        <div class="p-4">
            <h3 class="font-bold text-sm mb-2 text-gray-800 line-clamp-2 leading-tight">${emergency.title}</h3>
            <p class="text-gray-600 text-xs mb-3 line-clamp-2">${emergency.summary}</p>
            <div class="flex items-center justify-between text-xs text-gray-500">
                <div class="flex items-center">
                    <i data-feather="map-pin" class="w-3 h-3 mr-1"></i>
                    <span class="truncate">${emergency.location.split(',')[0]}</span>
                </div>
                <div class="flex items-center">
                    <i data-feather="clock" class="w-3 h-3 mr-1"></i>
                    <span>${formattedDate}</span>
                </div>
            </div>
            ${emergency.casualties > 0 ? `
                <div class="mt-2 p-2 bg-red-50 rounded text-xs text-red-700 flex items-center">
                    <i data-feather="alert-triangle" class="w-3 h-3 mr-1"></i>
                    <span>${emergency.casualties} người bị thương</span>
                </div>
            ` : ''}
        </div>
    `;

    // Add click event to redirect to request page
    card.addEventListener('click', () => {
        window.location.href = `request.html#emergency-${emergency.id}`;
    });

    return card;
}

// Hàm khởi tạo
async function initLatestNews() {
    try {
        const emergencies = await fetchLatestEmergencies();
        displayLatestEmergencies(emergencies);
    } catch (error) {
        console.error('Error initializing latest news:', error);
        
        // Fallback: Hiển thị thông báo lỗi
        const grid = document.getElementById('latest-emergencies-grid');
        if (grid) {
            grid.innerHTML = `
                <div class="col-span-4 text-center py-8">
                    <i data-feather="alert-circle" class="w-12 h-12 text-gray-400 mx-auto mb-4"></i>
                    <p class="text-gray-500">Không thể tải tin khẩn cấp. Vui lòng thử lại sau.</p>
                </div>
            `;
            if (typeof feather !== 'undefined') {
                feather.replace();
            }
        }
    }
}

// Khởi chạy khi DOM loaded
document.addEventListener('DOMContentLoaded', initLatestNews);