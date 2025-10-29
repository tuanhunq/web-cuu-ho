// assets/js/news.js

let emergenciesData = [];

// Hàm fetch dữ liệu từ JSON
async function fetchEmergenciesData() {
    try {
        const response = await fetch('data/emergencies.json');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        emergenciesData = data.emergencies;
        return emergenciesData;
    } catch (error) {
        console.error('Error fetching emergencies data:', error);
        return [];
    }
}

// Hàm hiển thị tin tức lên grid
function displayNews(newsArray) {
    const newsGrid = document.getElementById('news-grid');
    
    if (!newsGrid) return;

    // Clear existing content
    newsGrid.innerHTML = '';

    // Hiển thị 4 tin mới nhất
    const latestNews = newsArray.slice(0, 4);

    latestNews.forEach(emergency => {
        const newsCard = createNewsCard(emergency);
        newsGrid.appendChild(newsCard);
    });
}

// Hàm tạo card tin tức
function createNewsCard(emergency) {
    const card = document.createElement('div');
    card.className = 'bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer news-card';
    card.setAttribute('data-id', emergency.id);
    
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
        year: 'numeric',
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
            <img src="${emergency.image}" alt="${emergency.title}" class="w-full h-48 object-cover">
            <div class="absolute top-4 left-4">
                <span class="px-3 py-1 ${statusInfo.color} rounded-full text-xs font-medium">
                    ${statusInfo.text}
                </span>
            </div>
            <div class="absolute top-4 right-4">
                <span class="px-3 py-1 bg-${typeInfo.color}-100 text-${typeInfo.color}-800 rounded-full text-xs font-medium flex items-center">
                    <i data-feather="${typeInfo.icon}" class="w-3 h-3 mr-1"></i>
                    ${typeInfo.name}
                </span>
            </div>
        </div>
        <div class="p-6">
            <h3 class="font-bold text-lg mb-2 text-gray-800 line-clamp-2">${emergency.title}</h3>
            <p class="text-gray-600 text-sm mb-4 line-clamp-2">${emergency.summary}</p>
            <div class="flex items-center justify-between text-sm text-gray-500">
                <div class="flex items-center">
                    <i data-feather="map-pin" class="w-4 h-4 mr-1"></i>
                    <span>${emergency.location}</span>
                </div>
                <div class="flex items-center">
                    <i data-feather="clock" class="w-4 h-4 mr-1"></i>
                    <span>${formattedDate}</span>
                </div>
            </div>
            ${emergency.casualties > 0 ? `
                <div class="mt-3 p-2 bg-red-50 rounded-lg">
                    <div class="flex items-center text-red-700 text-sm">
                        <i data-feather="alert-triangle" class="w-4 h-4 mr-2"></i>
                        <span>${emergency.casualties} người bị thương</span>
                    </div>
                </div>
            ` : ''}
        </div>
    `;

    // Add click event
    card.addEventListener('click', () => openNewsModal(emergency));

    return card;
}

// Hàm mở modal chi tiết
function openNewsModal(emergency) {
    const modal = document.getElementById('news-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalContent = document.getElementById('modal-content');
    const mapLink = document.getElementById('map-link');
    const relatedNews = document.querySelector('#related-news .space-y-2');

    if (!modal || !modalTitle || !modalContent) return;

    // Map type to Vietnamese
    const typeMap = {
        'fire': { name: 'Hỏa hoạn', color: 'red', icon: 'flame' },
        'flood': { name: 'Ngập lụt', color: 'blue', icon: 'droplet' },
        'accident': { name: 'Tai nạn giao thông', color: 'orange', icon: 'activity' },
        'disaster': { name: 'Thiên tai', color: 'purple', icon: 'alert-octagon' },
        'medical': { name: 'Y tế', color: 'green', icon: 'heart' }
    };

    const typeInfo = typeMap[emergency.type] || { name: 'Khẩn cấp', color: 'gray', icon: 'alert-triangle' };

    // Format date
    const date = new Date(emergency.timestamp);
    const formattedDate = date.toLocaleDateString('vi-VN', {
        weekday: 'long',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    // Status badge
    const statusMap = {
        'active': { text: 'Đang xử lý', color: 'bg-red-100 text-red-800 border-red-200' },
        'resolved': { text: 'Đã giải quyết', color: 'bg-green-100 text-green-800 border-green-200' },
        'warning': { text: 'Cảnh báo', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' }
    };
    const statusInfo = statusMap[emergency.status] || { text: 'Không xác định', color: 'bg-gray-100 text-gray-800 border-gray-200' };

    // Set modal content
    modalTitle.textContent = emergency.title;
    
    modalContent.innerHTML = `
        <div class="flex flex-wrap gap-2 mb-4">
            <span class="px-3 py-1 ${statusInfo.color} border rounded-full text-sm font-medium">
                ${statusInfo.text}
            </span>
            <span class="px-3 py-1 bg-${typeInfo.color}-100 text-${typeInfo.color}-800 border border-${typeInfo.color}-200 rounded-full text-sm font-medium flex items-center">
                <i data-feather="${typeInfo.icon}" class="w-4 h-4 mr-1"></i>
                ${typeInfo.name}
            </span>
        </div>

        <div class="bg-gray-50 rounded-lg p-4 mb-4">
            <div class="grid grid-cols-2 gap-4 text-sm">
                <div class="flex items-center">
                    <i data-feather="map-pin" class="w-4 h-4 mr-2 text-gray-600"></i>
                    <span class="font-medium">Địa điểm:</span>
                    <span class="ml-1">${emergency.location}</span>
                </div>
                <div class="flex items-center">
                    <i data-feather="clock" class="w-4 h-4 mr-2 text-gray-600"></i>
                    <span class="font-medium">Thời gian:</span>
                    <span class="ml-1">${formattedDate}</span>
                </div>
                ${emergency.casualties > 0 ? `
                    <div class="flex items-center">
                        <i data-feather="alert-triangle" class="w-4 h-4 mr-2 text-red-600"></i>
                        <span class="font-medium">Thương vong:</span>
                        <span class="ml-1 text-red-600">${emergency.casualties} người</span>
                    </div>
                ` : ''}
                <div class="flex items-center">
                    <i data-feather="users" class="w-4 h-4 mr-2 text-blue-600"></i>
                    <span class="font-medium">Lực lượng:</span>
                    <span class="ml-1 text-blue-600">${emergency.rescue_teams} đội</span>
                </div>
            </div>
        </div>

        <img src="${emergency.image}" alt="${emergency.title}" class="w-full h-64 object-cover rounded-lg mb-4">

        <div class="prose max-w-none">
            <p class="text-gray-700 leading-relaxed">${emergency.content}</p>
        </div>

        ${emergency.affected_areas && emergency.affected_areas.length > 0 ? `
            <div class="mt-4 p-4 bg-blue-50 rounded-lg">
                <h5 class="font-semibold text-blue-800 mb-2 flex items-center">
                    <i data-feather="navigation" class="w-4 h-4 mr-2"></i>
                    Khu vực ảnh hưởng:
                </h5>
                <div class="flex flex-wrap gap-2">
                    ${emergency.affected_areas.map(area => `
                        <span class="px-3 py-1 bg-white text-blue-700 rounded-full text-sm border border-blue-200">
                            ${area}
                        </span>
                    `).join('')}
                </div>
            </div>
        ` : ''}
    `;

    // Set map link
    if (mapLink) {
        mapLink.href = `emergency_map.html?id=${emergency.id}&lat=${emergency.coordinates[0]}&lng=${emergency.coordinates[1]}`;
    }

    // Show related news
    if (relatedNews) {
        const related = getRelatedNews(emergency.id, emergency.type);
        relatedNews.innerHTML = related.map(news => `
            <div class="flex items-start p-3 hover:bg-gray-50 rounded-lg cursor-pointer" onclick="openNewsModalById(${news.id})">
                <img src="${news.image}" alt="${news.title}" class="w-16 h-16 object-cover rounded mr-3">
                <div class="flex-1">
                    <h6 class="font-medium text-sm text-gray-800 line-clamp-2">${news.title}</h6>
                    <p class="text-xs text-gray-500 mt-1">${new Date(news.timestamp).toLocaleDateString('vi-VN')}</p>
                </div>
            </div>
        `).join('');
    }

    // Show modal
    modal.classList.remove('hidden');
    modal.classList.add('flex');

    // Refresh icons
    feather.replace();
}

// Hàm lấy tin liên quan
function getRelatedNews(currentId, currentType) {
    return emergenciesData
        .filter(emergency => emergency.id !== currentId && emergency.type === currentType)
        .slice(0, 3);
}

// Hàm mở modal bằng ID
function openNewsModalById(id) {
    const emergency = emergenciesData.find(emergency => emergency.id === id);
    if (emergency) {
        openNewsModal(emergency);
    }
}

// Hàm đóng modal
function setupModalClose() {
    const modal = document.getElementById('news-modal');
    const closeBtn = document.getElementById('close-modal');

    if (closeBtn && modal) {
        closeBtn.addEventListener('click', () => {
            modal.classList.add('hidden');
            modal.classList.remove('flex');
        });

        // Close modal when clicking outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.add('hidden');
                modal.classList.remove('flex');
            }
        });
    }
}

// Hàm chia sẻ tin tức
function setupShareButton() {
    const shareBtn = document.getElementById('share-news');
    if (shareBtn) {
        shareBtn.addEventListener('click', () => {
            if (navigator.share) {
                navigator.share({
                    title: document.getElementById('modal-title').textContent,
                    text: 'Thông tin sự cố khẩn cấp',
                    url: window.location.href,
                });
            } else {
                // Fallback: copy to clipboard
                const modalTitle = document.getElementById('modal-title').textContent;
                navigator.clipboard.writeText(modalTitle + ' - ' + window.location.href);
                alert('Đã sao chép liên kết tin tức!');
            }
        });
    }
}

// Hàm khởi tạo
async function initNews() {
    await fetchEmergenciesData();
    displayNews(emergenciesData);
    setupModalClose();
    setupShareButton();
    feather.replace();
}

// Khởi chạy khi DOM loaded
document.addEventListener('DOMContentLoaded', initNews);
