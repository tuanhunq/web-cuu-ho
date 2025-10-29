

//map
console.log('News module loaded');


//index
// News functionality for Emergency Rescue System

class NewsManager {
    constructor() {
        this.news = [];
        this.currentPage = 1;
        this.itemsPerPage = 8;
        this.init();
    }
    
    async init() {
        await this.loadNews();
        this.renderNews();
        this.setupEventListeners();
    }
    
    async loadNews() {
        try {
            this.news = await ApiService.getNews();
        } catch (error) {
            console.error('Error loading news:', error);
            this.news = this.getMockNews();
        }
    }
    
    renderNews() {
        const newsGrid = document.getElementById('news-grid');
        if (!newsGrid) return;
        
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const newsToShow = this.news.slice(startIndex, endIndex);
        
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
    }
    
    createNewsCard(newsItem) {
        const timeAgo = formatTimeAgo(newsItem.publishedAt);
        const typeIcon = this.getTypeIcon(newsItem.type);
        const severityClass = this.getSeverityClass(newsItem.severity);
        
        return `
            <div class="news-card bg-white rounded-xl shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-300"
                 onclick="newsManager.openNewsModal(${newsItem.id})">
                <div class="relative">
                    <img src="${newsItem.image}" alt="${newsItem.title}" class="w-full h-48 object-cover">
                    <div class="absolute top-3 right-3 ${severityClass} px-2 py-1 rounded-full text-xs font-semibold text-white">
                        ${this.getSeverityLabel(newsItem.severity)}
                    </div>
                    <div class="absolute bottom-3 left-3 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                        ${typeIcon} ${this.getTypeLabel(newsItem.type)}
                    </div>
                </div>
                <div class="p-4">
                    <h3 class="font-bold text-lg mb-2 line-clamp-2 text-gray-800">${newsItem.title}</h3>
                    <p class="text-gray-600 text-sm mb-3 line-clamp-2">${newsItem.summary}</p>
                    <div class="flex justify-between items-center text-xs text-gray-500">
                        <span>${timeAgo}</span>
                        <span>${newsItem.location}</span>
                    </div>
                </div>
            </div>
        `;
    }
    
    getTypeIcon(type) {
        const icons = {
            warning: '⚠️',
            info: 'ℹ️',
            emergency: '🚨',
            update: '📢'
        };
        return icons[type] || '📰';
    }
    
    getTypeLabel(type) {
        const labels = {
            warning: 'Cảnh báo',
            info: 'Thông tin',
            emergency: 'Khẩn cấp',
            update: 'Cập nhật'
        };
        return labels[type] || 'Tin tức';
    }
    
    getSeverityClass(severity) {
        const classes = {
            high: 'bg-red-500',
            medium: 'bg-orange-500',
            low: 'bg-yellow-500',
            info: 'bg-blue-500'
        };
        return classes[severity] || 'bg-gray-500';
    }
    
    getSeverityLabel(severity) {
        const labels = {
            high: 'Cao',
            medium: 'Trung bình',
            low: 'Thấp',
            info: 'Thông tin'
        };
        return labels[severity] || 'Không xác định';
    }
    
    setupEventListeners() {
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
    }
    
    openNewsModal(newsId) {
        const newsItem = this.news.find(item => item.id === newsId);
        if (!newsItem) return;
        
        const modal = document.getElementById('news-modal');
        const title = document.getElementById('modal-title');
        const content = document.getElementById('modal-content');
        const mapLink = document.getElementById('map-link');
        const relatedNews = document.getElementById('related-news').querySelector('.space-y-2');
        
        if (!modal || !title || !content) return;
        
        // Set modal content
        title.textContent = newsItem.title;
        content.innerHTML = this.createModalContent(newsItem);
        
        // Set map link
        if (mapLink && newsItem.coordinates) {
            mapLink.href = `emergency_map.html?lat=${newsItem.coordinates[0]}&lng=${newsItem.coordinates[1]}&zoom=15`;
        }
        
        // Show related news
        const related = this.getRelatedNews(newsItem);
        relatedNews.innerHTML = related.map(item => `
            <div class="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded cursor-pointer" 
                 onclick="newsManager.openNewsModal(${item.id})">
                <img src="${item.image}" alt="${item.title}" class="w-12 h-12 object-cover rounded">
                <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium text-gray-900 truncate">${item.title}</p>
                    <p class="text-xs text-gray-500">${formatTimeAgo(item.publishedAt)}</p>
                </div>
            </div>
        `).join('');
        
        // Show modal
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        
        // Update Feather icons in modal
        feather.replace();
        
        // Track view
        this.trackNewsView(newsItem);
    }
    
    createModalContent(newsItem) {
        return `
            <div class="mb-4">
                <img src="${newsItem.image}" alt="${newsItem.title}" class="w-full h-64 object-cover rounded-lg">
            </div>
            <div class="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                <span class="flex items-center">
                    <i data-feather="clock" class="w-4 h-4 mr-1"></i>
                    ${formatDate(newsItem.publishedAt)}
                </span>
                <span class="flex items-center">
                    <i data-feather="map-pin" class="w-4 h-4 mr-1"></i>
                    ${newsItem.location}
                </span>
                <span class="flex items-center">
                    <i data-feather="alert-circle" class="w-4 h-4 mr-1"></i>
                    ${this.getSeverityLabel(newsItem.severity)}
                </span>
            </div>
            <div class="prose max-w-none">
                ${newsItem.content || newsItem.summary}
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
            url: `${window.location.origin}/news.html?id=${newsItem.id}`
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
        // Analytics tracking
        if (typeof gtag !== 'undefined') {
            gtag('event', 'view_news', {
                'event_category': 'engagement',
                'event_label': newsItem.type,
                'value': newsItem.id
            });
        }
    }
    
    getMockNews() {
        return [
            {
                id: 1,
                title: "Cảnh báo mưa lớn diện rộng tại miền Trung",
                summary: "Mưa lớn kéo dài gây ngập lụt nhiều khu vực tại các tỉnh miền Trung",
                content: "Theo Trung tâm Dự báo Khí tượng Thủy văn Quốc gia, mưa lớn diện rộng đang xảy ra tại các tỉnh miền Trung...",
                type: "warning",
                severity: "high",
                location: "Miền Trung",
                image: "https://images.unsplash.com/photo-1599058917765-7805dd3c0a56?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
                coordinates: [16.047079, 108.206230],
                affectedAreas: "Các tỉnh từ Thừa Thiên Huế đến Khánh Hòa",
                safetyInstructions: "Người dân hạn chế ra đường, chuẩn bị sẵn sàng phương án sơ tán"
            },
            {
                id: 2,
                title: "Hỏa hoạn tại chung cư Quận 1",
                summary: "Đám cháy bùng phát tại tầng hầm chung cư cao cấp",
                content: "Một vụ hỏa hoạn đã xảy ra tại tầng hầm chung cư...",
                type: "emergency",
                severity: "high",
                location: "Quận 1, TP.HCM",
                image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
                coordinates: [10.7769, 106.7009]
            }
        ];
    }
}

// Initialize news manager when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.newsManager = new NewsManager();
});

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { NewsManager };
}