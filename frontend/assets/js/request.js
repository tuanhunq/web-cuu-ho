
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
// Dữ liệu tin tức (Nên đặt dữ liệu này trong assets/data hoặc fetch từ api.js/news.js nếu có API)
const newsData = [
    {
        title: "Đà Nẵng: Chủ động ứng phó thiên tai những tháng cuối năm",
        date: "2025-10-21",
        type: "thien-tai",
        location: "da-nang,mien-trung",
        img: "https://media.daidoanket.vn/w1280/uploaded/images/2025/10/18/8898fcf6-b66a-433c-908c-72eb18bbdeb1.jpg",
        content: "<p><strong>Tình hình:</strong> TP. Đà Nẵng đang hứng chịu thời tiết cực đoan, mưa lớn kéo dài...</p><a href='https://thiennhienmoitruong.vn/da-nang-chu-dong-ung-pho-thien-tai-nhung-thang-cuoi-nam.html' target='_blank'>Nguồn gốc</a>"
    },
    {
        title: "Vai trò y tế cơ sở trong chăm sóc sức khỏe tinh thần cho cộng đồng sau thiên tai",
        date: "2025-10-21",
        type: "cuu-ho",
        location: "lao-cai,thai-nguyen,mien-bac",
        img: "https://benhvientamthanhanoi.com/wp-content/uploads/2025/10/image.jpeg",
        content: "<p><strong>Tình hình:</strong> Sau thiên tai như bão lũ năm 2024 tại Lào Cai và Thái Nguyên, người dân đối mặt...</p><a href='https://vov2.vov.vn/suc-khoe/vai-tro-y-te-co-so-trong-cham-soc-suc-khoe-tinh-than-cho-cong-dong-sau-thien-tai-55411' target='_blank'>Nguồn gốc</a>"
    },
    {
        title: "Tai nạn giao thông mới nhất 19/10/2025: xe cứu hộ gây tai nạn liên hoàn trên quốc lộ 26",
        date: "2025-10-19",
        type: "tai-nan",
        location: "dak-lak,tp-hcm,binh-dinh,tay-nguyen",
        img: "https://cdnphoto.dantri.com.vn/fT-JEopnjSnsEkgTdgpPSX-an_8=/thumb_w/1020/2025/10/19/z7132063905158f9b65fad4a12b3160200c0a32ca66181-edited-1760843872053.jpg",
        content: "<p><strong>Tình hình:</strong> Ngày 19/10/2025, xảy ra ba vụ tai nạn giao thông nghiêm trọng: Xe cứu hộ gây tai nạn liên hoàn...</p><a href='https://baomoi.com/tai-nan-giao-thong-moi-nhat-19-10-2025-xe-cuu-ho-gay-tai-nan-lien-hoan-tren-quoc-lo-26-c53531244.epi' target='_blank'>Nguồn gốc</a>"
    },
    {
        title: "Thiên tai đã vượt quá sức chịu đựng của người dân",
        date: "2025-10-10",
        type: "thien-tai",
        location: "thai-nguyen,bac-ninh,cao-bang,lang-son,mien-bac,mien-trung",
        img: "https://premedia.vneconomy.vn/files/uploads/2025/10/10/c999b83a970f40588b4d060116ebed76-20061.png?w=900",
        content: "<p><strong>Tình hình:</strong> Năm 2025, Việt Nam xảy ra 20 loại hình thiên tai với diễn biến dồn dập, khốc liệt, bất thường...</p><a href='https://vneconomy.vn/thien-tai-da-vuot-qua-suc-chiu-dung-cua-nguoi-dan.htm' target='_blank'>Nguồn gốc</a>"
    },
    {
        title: "Việt Nam kêu gọi quốc tế hỗ trợ khắc phục hậu quả thiên tai",
        date: "2025-10-09",
        type: "thien-tai",
        location: "ha-noi,thai-nguyen,bac-ninh,cao-bang,lang-son,mien-bac,mien-trung",
        img: "https://mediaptq.mediatech.vn/upload/image/202510/medium/82710_55315046013060509712616981946138100992575692n_1760004748097379436332_09221910.jpg?id=82710",
        content: "<p><strong>Tình hình:</strong> 20 loại thiên tai, 11 cơn bão gây 238 chết, thiệt hại 35.000 tỷ đồng. Bộ Nông nghiệp họp đối tác quốc tế...</p><a href='https://vnexpress.net/viet-nam-keu-goi-quoc-te-ho-tro-khac-phuc-hau-qua-thien-tai-4949397.html' target='_blank'>Nguồn gốc</a>"
    },
    {
        title: "Việt Nam kêu gọi cứu trợ khẩn cấp từ cộng đồng quốc tế",
        date: "2025-10-09",
        type: "cuu-ho",
        location: "ha-noi,mien-bac,mien-trung",
        img: "https://image.phunuonline.com.vn/fckeditor/upload/2025/20251009/images/lien-hop-quoc-keu-goi-ho-_241760006840.jpg",
        content: "<p><strong>Tình hình:</strong> Trong hai tháng 9 và 10/2025, Việt Nam liên tiếp hứng chịu bão số 8, 9, 10 và 11...</p><a href='https://mae.gov.vn/viet-nam-keu-goi-cuu-tro-khan-cap-tu-cong-dong-quoc-te-19944.htm' target='_blank'>Nguồn gốc</a>"
    },
    {
        title: "Thanh tra Chính phủ phát động quyên góp ủng hộ đồng bào bị thiệt hại nặng nề bởi thiên tai",
        date: "2025-10-14",
        type: "cuu-ho",
        location: "ha-noi,mien-bac,mien-trung",
        img: "https://bcp.cdnchinhphu.vn/334894974524682240/2025/10/14/phat-dong-3-17604142941321461810469.jpg",
        content: "<p><strong>Tình hình:</strong> Trong tháng 9 và 10/2025, Việt Nam hứng chịu 5 cơn bão, đặc biệt bão số 10 (BUALOI) và số 11 (MATMO)...</p><a href='https://baochinhphu.vn/thanh-tra-chinh-phu-phat-dong-quyen-gop-ung-ho-dong-bao-bi-thiet-hai-nang-ne-boi-thien-tai-102251014110224359.htm' target='_blank'>Nguồn gốc</a>"
    },
    {
        title: "Đoàn kết, chung sức vượt qua thiên tai",
        date: "2025-10-21",
        type: "thien-tai",
        location: "toan-quoc,mien-bac,mien-trung",
        img: "https://cdn.nhandan.vn/images/22f099ca8bc7ae81aa2a8d3416a84bf88164db7334089fd96cd92fb40ba5a5c416d1915411a36da149b3cda42b8716dd3d30e798dd294ae2e7036a1cdf939bd04bdf9eb112ac72b82740920805aa185fd637c5797f36c62cfeeadbce01c03c493c7c4f229359aba580a4e2f637103b66/z7138573067041-93f4e3ff2488379b42c2a1c06fb01e83-9502.jpg.webp",
        content: "<p><strong>Tình hình:</strong> Năm 2025, Việt Nam hứng chịu khoảng 20 loại hình thiên tai, với các đợt “bão chồng bão, lũ chồng lũ”...</p><a href='https://nhandan.vn/doan-ket-chung-suc-vuot-qua-thien-tai-post916808.html' target='_blank'>Nguồn gốc</a>"
    },
    {
        title: "Hơn 1.066 tỷ đồng hỗ trợ đồng bào gặp thiên tai, bão lũ",
        date: "2025-10-22",
        type: "cuu-ho",
        location: "toan-quoc,mien-bac,mien-trung",
        img: "https://cdnmedia.baotintuc.vn/Upload/DmtgOUlHWBO5POIHzIwr1A/files/2025/10/21/ho-tro-dong-bao-21102025-01.jpg",
        content: "<p><strong>Tình hình:</strong> Tính đến 17 giờ ngày 21/10, Ban Vận động Cứu trợ Trung ương, Ủy ban Trung ương MTTQ Việt Nam đã nhận ủng hộ...</p><a href='https://baotintuc.vn/thoi-su/hon-1066-ty-dong-ho-tro-dong-bao-gap-thien-tai-bao-lu-20251021200854276.htm' target='_blank'>Nguồn gốc</a>"
    },
    {
        title: "Lực lượng Công an nhân dân chủ động ứng phó với bão số 12 và nguy cơ mưa lớn",
        date: "2025-10-20",
        type: "canh-bao",
        location: "mien-trung,mien-bac",
        img: "https://dbnd.1cdn.vn/2025/10/20/dbqgxtnd202510201700-17609581259941101885533.jpg",
        content: "<p><strong>Tình hình:</strong> Bão số 12 (Fengshen) đi vào Biển Đông chiều 19/10/2025, sức gió cấp 9 giật cấp 11...</p><a href='https://bocongan.gov.vn/bai-viet/luc-luong-cong-an-nhan-dan-chu-dong-ung-pho-voi-bao-so-12-va-nguy-co-mua-lon-dien-rong-1760964108' target='_blank'>Nguồn gốc</a>"
    },
    {
        title: "Đoàn kết, chung sức vượt qua thiên tai - Báo An Giang",
        date: "2025-10-21",
        type: "thien-tai",
        location: "toan-quoc,mien-nam",
        img: "https://dangcongsan.org.vn/upload/2006988/20250624/881c364829c571ae3de256c3328d5fb01_2_.webp",
        content: "<p><strong>Tình hình:</strong> Năm 2025, Việt Nam hứng chịu khoảng 20 loại hình thiên tai, với các đợt “bão chồng bão, lũ chồng lũ”...</p><a href='https://baoangiang.com.vn/doan-ket-chung-suc-vuot-qua-thien-tai-a464618.html' target='_blank'>Nguồn gốc</a>"
    },
    {
        title: "Thiên tai cuối năm 2025 phức tạp: Bắc Bộ vẫn có thể chịu ảnh hưởng của bão",
        date: "2025-10-08",
        type: "canh-bao",
        location: "mien-bac,mien-trung",
        img: "https://c.baothanhhoa.vn/img/mobile/news/2540/177d4090408t1820l1-51.webp",
        content: "<p><strong>Tình hình:</strong> Thiên tai cuối năm 2025 diễn biến phức tạp, với 2-4 cơn bão/áp thấp nhiệt đới trên Biển Đông...</p><a href='https://www.vietnamplus.vn/thien-tai-cuoi-nam-2025-phuc-tap-bac-bo-van-co-the-chiu-anh-huong-cua-bao-post1069070.vnp' target='_blank'>Nguồn gốc</a>"
    },
    {
        title: "Thủ tướng Chính phủ yêu cầu chủ động ứng phó với bão số 12 và mưa lũ",
        date: "2025-10-22",
        type: "canh-bao",
        location: "mien-trung,quang-tri,quang-ngai",
        img: "https://nld.mediacdn.vn/291774122806476800/2025/10/22/pho-thu-tuong--1761126520218734304839.jpg",
        content: "<p><strong>Tình hình:</strong> Bão Fengshen (bão số 12) diễn biến phức tạp, di chuyển hướng Tây Nam, ảnh hưởng vùng biển...</p><a href='https://baomoi.com/thu-tuong-chinh-phu-yeu-cau-chu-dong-ung-pho-voi-bao-fengshen-bao-so-12-va-mua-lu-c53546684.epi' target='_blank'>Nguồn gốc</a>"
    },
    {
        title: "Các nước, tổ chức quốc tế chung tay hỗ trợ Việt Nam khắc phục hậu quả thiên tai",
        date: "2025-10-15",
        type: "cuu-ho",
        location: "toan-quoc,mien-bac,mien-trung",
        img: "https://bcp.cdnchinhphu.vn/334894974524682240/2025/10/15/base64-1760496468629305052261.png",
        content: "<p><strong>Tình hình:</strong> Việt Nam liên tiếp hứng chịu thiên tai nghiêm trọng trong tháng 9 và 10/2025...</p><a href='https://baochinhphu.vn/cac-nuoc-to-chuc-quoc-te-chung-tay-ho-tro-viet-nam-khac-phuc-hau-qua-thien-tai-102251015091444105.htm' target='_blank'>Nguồn gốc</a>"
    }
];

// Biến trạng thái
const itemsPerPage = 6;
let currentPage = 1;
let debounceTimer;

// === HELPER FUNCTIONS ===
function timeAgo(dateString) {
    const now = new Date();
    const date = new Date(dateString);
    const seconds = Math.floor((now - date) / 1000);
    // Logic tính thời gian (giữ nguyên)
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

function showSkeleton() {
    const grid = document.getElementById('news-grid');
    grid.innerHTML = '';
    for (let i = 0; i < itemsPerPage; i++) {
        const skeletonCard = document.createElement('div');
        skeletonCard.className = 'news-card bg-white rounded-xl overflow-hidden shadow-md';
        skeletonCard.innerHTML = `
            <div class="w-full h-48 skeleton"></div>
            <div class="p-6">
                <div class="h-4 w-24 skeleton mb-4"></div>
                <div class="h-6 w-full skeleton mb-2"></div>
                <div class="h-4 w-3/4 skeleton mb-4"></div>
                <div class="h-4 w-32 skeleton"></div>
            </div>
        `;
        grid.appendChild(skeletonCard);
    }
}

// === RENDER FUNCTIONS ===
function renderPagination(totalItems, page) {
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement('button');
        btn.textContent = i;
        btn.className = `px-4 py-2 border ${i === page ? 'bg-red-600 text-white' : 'border-red-600 text-red-600'} rounded-md hover:bg-red-50 transition font-medium`;
        btn.onclick = () => filterNews(i);
        pagination.appendChild(btn);
    }
}

function renderNews(filteredData = newsData, page = 1) {
    const grid = document.getElementById('news-grid');
    grid.innerHTML = '';
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const paginatedData = filteredData.slice(start, end);
    
    paginatedData.forEach(news => {
        const badgeColor = news.type === 'thien-tai' ? 'bg-blue-600' : news.type === 'tai-nan' ? 'bg-red-600' : news.type === 'cuu-ho' ? 'bg-green-600' : 'bg-yellow-600';
        const badgeText = news.type === 'thien-tai' ? 'Thiên tai' : news.type === 'tai-nan' ? 'Tai nạn' : news.type === 'cuu-ho' ? 'Cứu hộ' : 'Cảnh báo';
        const locBadge = news.location.split(',')[0].replace('-', ' ').toUpperCase();
        const card = document.createElement('div');
        card.className = 'news-card bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300';
        
        // Cần tìm index của news trong mảng gốc newsData để truyền vào openModal
        const originalIndex = newsData.findIndex(item => item.title === news.title && item.date === news.date); 
        
        card.innerHTML = `
            <img src="${news.img}" alt="${news.title}" class="w-full h-48 object-cover" loading="lazy">
            <span class="absolute top-4 left-4 ${badgeColor} text-white text-xs px-3 py-1 rounded-full font-bold">${badgeText}</span>
            <span class="absolute top-4 right-4 bg-purple-600 text-white text-xs px-3 py-1 rounded-full font-bold">${locBadge}</span>
            <div class="p-6">
                <div class="flex items-center text-sm text-gray-500 mb-2">
                    <i data-feather="clock" class="mr-1 w-4 h-4"></i>
                    <span>${timeAgo(news.date)}</span>
                </div>
                <h3 class="text-xl font-bold mb-3">${news.title}</h3>
                <p class="text-gray-600 mb-4">${news.content.replace(/<[^>]+>/g, '').substring(0, 100)}...</p>
                <button onclick="openModal(${originalIndex})" class="text-red-600 hover:text-red-800 font-medium flex items-center">
                    Xem chi tiết
                    <i data-feather="arrow-right" class="ml-2 w-4 h-4"></i>
                </button>
            </div>
        `;
        grid.appendChild(card);
    });
    feather.replace();
    renderPagination(filteredData.length, page);
}

// === MAIN LOGIC ===
function filterNews(page = 1) {
    const searchInput = document.getElementById('search-news');
    const filterType = document.getElementById('filter-type');
    const filterLocation = document.getElementById('filter-location');
    const sortBy = document.getElementById('sort-by');

    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
        showSkeleton();
        setTimeout(() => {
            let filtered = newsData.slice();
            const search = searchInput.value.toLowerCase();
            const type = filterType.value;
            const loc = filterLocation.value;
            
            // Filtering
            filtered = filtered.filter(news => {
                const titleMatch = news.title.toLowerCase().includes(search);
                const typeMatch = type === 'all' || news.type === type;
                const locMatch = loc === 'all' || news.location.split(',').some(l => l.trim() === loc);
                return titleMatch && typeMatch && locMatch;
            });
            
            // Sorting
            if (sortBy.value === 'newest') {
                filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
            } else if (sortBy.value === 'oldest') {
                filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
            }
            
            currentPage = page; 
            renderNews(filtered, page);
        }, 500);
    }, 300);
}

function refreshNews() {
    showSkeleton();
    setTimeout(() => {
        // Giả lập: reload với data hiện tại và giữ nguyên filter/sort/pagination
        filterNews(currentPage); 
    }, 1000);
}

// === MODAL LOGIC (Global scope cho onclick) ===
window.openModal = function(index) {
    const news = newsData[index];
    const modal = document.getElementById('news-modal');
    document.getElementById('modal-title').textContent = news.title;
    document.getElementById('modal-content').innerHTML = `<img src="${news.img}" alt="${news.title}" class="w-full h-48 object-cover rounded-md mb-4">` + news.content;
    document.getElementById('map-link').href = `map.html?location=${news.location.split(',')[0]}`;
    
    // Tin liên quan
    const related = document.getElementById('related-news').querySelector('.space-y-2');
    related.innerHTML = '';
    newsData.filter((n, i) => i !== index && n.type === news.type).slice(0, 5).forEach(n => {
        const link = document.createElement('a');
        link.href = '#';
        link.onclick = () => { closeModal(); openModal(newsData.indexOf(n)); return false; };
        link.className = 'block text-sm text-gray-700 hover:text-red-600';
        link.textContent = `→ ${n.title}`;
        related.appendChild(link);
    });
    
    // Share button
    document.getElementById('share-news').onclick = () => {
        if (navigator.share) {
            navigator.share({
                title: news.title,
                text: news.content.replace(/<[^>]+>/g, '').substring(0, 100) + '...',
                url: window.location.href
            });
        } else {
            alert('Chức năng chia sẻ không được hỗ trợ trên thiết bị này.');
        }
    };
    modal.classList.remove('hidden');
}

function closeModal() {
    document.getElementById('news-modal').classList.add('hidden');
}

// === INITIALIZATION & EVENT LISTENERS ===
document.addEventListener('DOMContentLoaded', () => {
    // Event listeners
    document.getElementById('search-news').addEventListener('input', () => filterNews());
    document.getElementById('filter-type').addEventListener('change', () => filterNews());
    document.getElementById('filter-location').addEventListener('change', () => filterNews());
    document.getElementById('sort-by').addEventListener('change', () => filterNews());
    document.getElementById('refresh-news').addEventListener('click', refreshNews);
    document.getElementById('close-modal').addEventListener('click', closeModal);

    // Auto refresh every 2 minutes
    setInterval(refreshNews, 120000); 

    // Mobile menu toggle (chuyển logic từ HTML vào đây)
    document.getElementById('menu-toggle').addEventListener('click', function() {
        const menu = document.getElementById('mobile-menu');
        menu.classList.toggle('hidden');
        const isHidden = menu.classList.contains('hidden');
        this.innerHTML = isHidden ? feather.icons.menu.toSvg() : feather.icons.x.toSvg();
    });

    // Smooth scrolling & mobile menu close (giữ nguyên)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({ behavior: 'smooth' });
            const mobileMenu = document.getElementById('mobile-menu');
            if (!mobileMenu.classList.contains('hidden')) {
                mobileMenu.classList.add('hidden');
                document.getElementById('menu-toggle').innerHTML = feather.icons.menu.toSvg();
            }
        });
    });

    // Initialize feather icons
    feather.replace();

    // Check for new report from post.html (sử dụng localStorage)
    const newReport = localStorage.getItem('new_report');
    if (newReport) {
        const report = JSON.parse(newReport);
        const reportTitle = report.title && report.title.trim() !== '' ? report.title : 'Báo cáo khẩn cấp mới';

        const newsItem = {
            title: reportTitle,
            date: report.date || new Date().toISOString().substring(0, 10),
            type: report.type || 'cuu-ho',
            location: report.location || 'toan-quoc',
            img: report.img || 'https://via.placeholder.com/640x360?text=Báo+cáo+mới',
            content: `<p><strong>Địa điểm:</strong> ${report.location || 'Chưa xác định'}</p><p><strong>Thời gian:</strong> ${new Date(report.date || new Date()).toLocaleDateString('vi-VN')}</p><p><strong>Nội dung:</strong> ${report.description || 'Không có mô tả chi tiết.'}</p><p><strong>Nguồn:</strong> Báo cáo từ cộng đồng</p>`
        };
        newsData.unshift(newsItem); 
        localStorage.removeItem('new_report'); 
        
        setTimeout(() => {
            document.getElementById('news-section').scrollIntoView({ behavior: 'smooth' });
            alert('Báo cáo của bạn đã được thêm vào đầu bản tin và đang chờ xử lý!');
        }, 500);
    }
    
    // Khởi tạo hiển thị tin tức
    filterNews();
});
