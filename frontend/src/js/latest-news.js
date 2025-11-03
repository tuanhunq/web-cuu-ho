// assets/js/latest-news.js

// Dữ liệu tin tức (giống với code hiện tại)
const newsData = [
    {
        title: "Đà Nẵng: Chủ động ứng phó thiên tai những tháng cuối năm",
        date: "2025-10-21",
        type: "thien-tai",
        location: "da-nang,mien-trung",
        img: "https://media.daidoanket.vn/w1280/uploaded/images/2025/10/18/8898fcf6-b66a-433c-908c-72eb18bbdeb1.jpg",
        content: "<p><strong>Tình hình:</strong> TP. Đà Nẵng đang hứng chịu thời tiết cực đoan, mưa lớn kéo dài gây sạt lở nghiêm trọng tại nhiều khu vực.</p>"
    },
    {
        title: "Vai trò y tế cơ sở trong chăm sóc sức khỏe tinh thần cho cộng đồng sau thiên tai",
        date: "2025-10-21",
        type: "cuu-ho",
        location: "lao-cai,thai-nguyen,mien-bac",
        img: "https://benhvientamthanhanoi.com/wp-content/uploads/2025/10/image.jpeg",
        content: "<p><strong>Tình hình:</strong> Sau thiên tai như bão lũ năm 2024 tại Lào Cai và Thái Nguyên, người dân đối mặt với nỗi ám ảnh tinh thần kéo dài.</p>"
    },
    {
        title: "Tai nạn giao thông mới nhất 19/10/2025",
        date: "2025-10-19",
        type: "tai-nan",
        location: "dak-lak,tp-hcm,binh-dinh,tay-nguyen",
        img: "https://cdnphoto.dantri.com.vn/fT-JEopnjSnsEkgTdgpPSX-an_8=/thumb_w/1020/2025/10/19/z7132063905158f9b65fad4a12b3160200c0a32ca66181-edited-1760843872053.jpg",
        content: "<p><strong>Tình hình:</strong> Ngày 19/10/2025, xảy ra ba vụ tai nạn giao thông nghiêm trọng.</p>"
    },
    {
        title: "Thiên tai đã vượt quá sức chịu đựng của người dân",
        date: "2025-10-10",
        type: "thien-tai",
        location: "thai-nguyen,bac-ninh,cao-bang,lang-son,mien-bac,mien-trung",
        img: "https://premedia.vneconomy.vn/files/uploads/2025/10/10/c999b83a970f40588b4d060116ebed76-20061.png?w=900",
        content: "<p><strong>Tình hình:</strong> Năm 2025, Việt Nam xảy ra 20 loại hình thiên tai với diễn biến dồn dập, khốc liệt.</p>"
    }
];

// Hàm timeAgo
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

// Hàm hiển thị tin tức
function renderLatestNews() {
    const grid = document.getElementById('news-grid');
    if (!grid) return;

    grid.innerHTML = '';
    
    // Lấy 4 tin mới nhất
    const latestNews = newsData
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 4);

    latestNews.forEach(news => {
        const badgeColor = news.type === 'thien-tai' ? 'bg-blue-600' : 
                          news.type === 'tai-nan' ? 'bg-red-600' : 
                          news.type === 'cuu-ho' ? 'bg-green-600' : 'bg-yellow-600';
        
        const badgeText = news.type === 'thien-tai' ? 'Thiên tai' : 
                         news.type === 'tai-nan' ? 'Tai nạn' : 
                         news.type === 'cuu-ho' ? 'Cứu hộ' : 'Cảnh báo';
        
        const locBadge = news.location.split(',')[0].replace('-', ' ').toUpperCase();
        
        const card = document.createElement('div');
        card.className = 'news-card bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1';
        
        card.innerHTML = `
            <div class="relative">
                <img src="${news.img}" alt="${news.title}" class="w-full h-40 object-cover" loading="lazy">
                <span class="absolute top-3 left-3 ${badgeColor} text-white text-xs px-2 py-1 rounded-full font-bold">${badgeText}</span>
                <span class="absolute top-3 right-3 bg-purple-600 text-white text-xs px-2 py-1 rounded-full font-bold">${locBadge}</span>
            </div>
            <div class="p-5">
                <div class="flex items-center text-sm text-gray-500 mb-2">
                    <i data-feather="clock" class="mr-1 w-4 h-4"></i>
                    <span>${timeAgo(news.date)}</span>
                </div>
                <h3 class="text-lg font-bold mb-2">${news.title}</h3>
                <p class="text-gray-600 mb-3 text-sm">${news.content.replace(/<[^>]+>/g, '').substring(0, 80)}...</p>
                <button onclick="openNewsModal(${newsData.indexOf(news)})" class="text-red-600 hover:text-red-800 font-medium flex items-center text-sm">
                    Xem chi tiết
                    <i data-feather="arrow-right" class="ml-1 w-4 h-4"></i>
                </button>
            </div>
        `;
        
        grid.appendChild(card);
    });
    
    // Refresh feather icons
    if (typeof feather !== 'undefined') {
        feather.replace();
    }
}

// Hàm mở modal
function openNewsModal(index) {
    const news = newsData[index];
    const modal = document.getElementById('news-modal');
    if (!modal) return;

    document.getElementById('modal-title').textContent = news.title;
    document.getElementById('modal-content').innerHTML = `
        <img src="${news.img}" alt="${news.title}" class="w-full h-48 object-cover rounded-md mb-4">
        ${news.content}
    `;
    
    modal.classList.remove('hidden');
}

// Hàm đóng modal
function closeNewsModal() {
    const modal = document.getElementById('news-modal');
    if (modal) {
        modal.classList.add('hidden');
    }
}

// Hàm khởi tạo
function initLatestNews() {
    renderLatestNews();
    
    // Thêm event listener cho nút đóng modal
    const closeBtn = document.getElementById('close-modal');
    if (closeBtn) {
        closeBtn.addEventListener('click', closeNewsModal);
    }
    
    // Đóng modal khi click bên ngoài
    const modal = document.getElementById('news-modal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeNewsModal();
            }
        });
    }
}

// Khởi chạy khi DOM ready
document.addEventListener('DOMContentLoaded', initLatestNews);