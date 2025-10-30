// request.js - Xử lý chức năng cho trang bản tin khẩn cấp

// Dữ liệu mẫu cho bản tin
const newsData = [
    // Sự cố khẩn cấp
    {
        id: 1,
        title: "SẠT LỞ ĐẤT: 3 hộ dân bị vùi lấp tại huyện Mù Cang Chải",
        summary: "Mưa lớn kéo dài gây sạt lở đất tại xã La Pán Tẩn, huyện Mù Cang Chải, tỉnh Yên Bái.",
        content: `
            <p class="text-lg font-semibold text-red-600 mb-4">THÔNG BÁO KHẨN CẤP từ Ban Chỉ huy PCTT&TKCN tỉnh Yên Bái</p>
            <p class="mb-4">Vào lúc 03h30 sáng nay, một vụ sạt lở đất đã xảy ra tại thôn Pá Mỳ, xã La Pán Tẩn, huyện Mù Cang Chải, tỉnh Yên Bái.</p>
            <p class="mb-4">Theo thông tin ban đầu, có 3 hộ dân với 12 nhân khẩu bị vùi lấp. Lực lượng cứu hộ đang khẩn trương tìm kiếm, cứu nạn.</p>
            
            <div class="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
                <p class="font-semibold">THÔNG TIN CHI TIẾT:</p>
                <ul class="list-disc ml-5 mt-2 space-y-2">
                    <li><strong>Địa điểm:</strong> Thôn Pá Mỳ, xã La Pán Tẩn, huyện Mù Cang Chải</li>
                    <li><strong>Thời gian:</strong> 03h30 ngày 25/09/2023</li>
                    <li><strong>Số người bị ảnh hưởng:</strong> 3 hộ dân (12 nhân khẩu)</li>
                    <li><strong>Nguyên nhân:</strong> Mưa lớn kéo dài nhiều ngày</li>
                    <li><strong>Diện tích sạt lở:</strong> Khoảng 500m²</li>
                </ul>
            </div>
            
            <div class="bg-orange-50 border-l-4 border-orange-400 p-4 mb-4">
                <p class="font-semibold">CÔNG TÁC ỨNG PHÓ:</p>
                <ul class="list-disc ml-5 mt-2 space-y-2">
                    <li>Huy động 50 cán bộ, chiến sĩ tham gia cứu hộ</li>
                    <li>Điều phương tiện máy xúc, máy ủi đến hiện trường</li>
                    <li>Sơ tán 15 hộ dân xung quanh khu vực nguy hiểm</li>
                    <li>Thiết lập các điểm cảnh báo xung quanh khu vực</li>
                </ul>
            </div>
            
            <div class="map-preview">
                <div class="text-center">
                    <i data-feather="map" class="w-12 h-12 mx-auto mb-2"></i>
                    <p>Bản đồ hiển thị vị trí sự cố sạt lở đất</p>
                    <p class="text-sm text-gray-500 mt-1">Tọa độ: 21.85, 104.10</p>
                </div>
            </div>
            
            <div class="flex justify-between mt-4">
                <button class="flex items-center px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition report-incident">
                    <i data-feather="alert-triangle" class="mr-2 w-4 h-4"></i> Báo cáo sự cố
                </button>
                <button class="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition view-on-map" data-location="21.85,104.10">
                    <i data-feather="map" class="mr-2 w-4 h-4"></i> Xem trên bản đồ
                </button>
            </div>
        `,
        type: "emergency",
        location: "mien-bac",
        date: "2023-09-25",
        time: "04:15",
        priority: "high",
        coordinates: { lat: 21.85, lng: 104.10 }
    },
    {
        id: 2,
        title: "CHÁY LỚN: Kho hàng tại KCN Bắc Thăng Long bốc cháy dữ dội",
        summary: "Một kho hàng tại Khu công nghiệp Bắc Thăng Long, Hà Nội bất ngờ bốc cháy vào rạng sáng.",
        content: `
            <p class="text-lg font-semibold mb-4">THÔNG BÁO từ Cảnh sát PCCC Hà Nội</p>
            <p class="mb-4">Vào lúc 02h30 sáng nay, một kho hàng chứa vật liệu xây dựng tại Khu công nghiệp Bắc Thăng Long, huyện Đông Anh, Hà Nội đã bốc cháy.</p>
            
            <div class="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
                <p class="font-semibold">THÔNG TIN CHI TIẾT:</p>
                <ul class="list-disc ml-5 mt-2 space-y-2">
                    <li><strong>Địa điểm:</strong> Kho số A5, KCN Bắc Thăng Long, Đông Anh, Hà Nội</li>
                    <li><strong>Thời gian:</strong> 02h30 ngày 25/09/2023</li>
                    <li><strong>Loại hàng hóa:</strong> Vật liệu xây dựng, nhựa đường</li>
                    <li><strong>Diện tích cháy:</strong> Khoảng 1.000m²</li>
                    <li><strong>Thiệt hại ban đầu:</strong> Hàng trăm tỷ đồng</li>
                </ul>
            </div>
            
            <div class="bg-orange-50 border-l-4 border-orange-400 p-4 mb-4">
                <p class="font-semibold">CÔNG TÁC CHỮA CHÁY:</p>
                <ul class="list-disc ml-5 mt-2 space-y-2">
                    <li>Huy động 10 xe chữa cháy, 50 cán bộ chiến sĩ</li>
                    <li>Thiết lập vùng cách ly 500m xung quanh</li>
                    <li>Sơ tán toàn bộ công nhân trong khu vực</li>
                    <li>Phối hợp với lực lượng y tế sẵn sàng ứng phó</li>
                </ul>
            </div>
            
            <div class="bg-green-50 border-l-4 border-green-400 p-4 mb-4">
                <p class="font-semibold">TÌNH HÌNH HIỆN TẠI:</p>
                <ul class="list-disc ml-5 mt-2 space-y-2">
                    <li>Đám cháy đã được khống chế 90%</li>
                    <li>Chưa ghi nhận thiệt hại về người</li>
                    <li>Nguyên nhân đang được điều tra làm rõ</li>
                    <li>Khói đen bao phủ khu vực bán kính 2km</li>
                </ul>
            </div>
            
            <div class="map-preview">
                <div class="text-center">
                    <i data-feather="map" class="w-12 h-12 mx-auto mb-2"></i>
                    <p>Bản đồ hiển thị vị trí đám cháy</p>
                    <p class="text-sm text-gray-500 mt-1">Tọa độ: 21.12, 105.85</p>
                </div>
            </div>
            
            <div class="flex justify-between mt-4">
                <button class="flex items-center px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition report-incident">
                    <i data-feather="alert-triangle" class="mr-2 w-4 h-4"></i> Báo cáo sự cố
                </button>
                <button class="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition view-on-map" data-location="21.12,105.85">
                    <i data-feather="map" class="mr-2 w-4 h-4"></i> Xem trên bản đồ
                </button>
            </div>
        `,
        type: "emergency",
        location: "ha-noi",
        date: "2023-09-25",
        time: "03:00",
        priority: "high",
        coordinates: { lat: 21.12, lng: 105.85 }
    },
    {
        id: 7,
        title: "NGẬP LỤT: Nhiều tuyến đường tại TP.HCM ngập sâu 0.5-1m",
        summary: "Mưa lớn kết hợp triều cường khiến nhiều khu vực tại TP.HCM chìm trong biển nước.",
        content: `
            <p class="text-lg font-semibold text-red-600 mb-4">THÔNG BÁO KHẨN từ Ban Chỉ huy PCTT TP.HCM</p>
            <p class="mb-4">Do ảnh hưởng của mưa lớn kết hợp với triều cường dâng cao, nhiều tuyến đường tại TP.HCM đang chìm trong biển nước với mực nước ngập từ 0.5-1m.</p>
            
            <div class="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
                <p class="font-semibold">THÔNG TIN CHI TIẾT:</p>
                <ul class="list-disc ml-5 mt-2 space-y-2">
                    <li><strong>Thời gian:</strong> Từ 06h00 đến nay (25/09/2023)</li>
                    <li><strong>Mực nước triều:</strong> Đạt đỉnh 1.65m</li>
                    <li><strong>Lượng mưa:</strong> 150mm trong 3 giờ</li>
                    <li><strong>Khu vực ảnh hưởng:</strong> 12 quận, huyện</li>
                </ul>
            </div>
            
            <div class="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4">
                <p class="font-semibold">CÁC TUYẾN ĐƯỜNG NGẬP NẶNG:</p>
                <ul class="list-disc ml-5 mt-2 space-y-2">
                    <li>Nguyễn Hữu Cảnh (Quận 1): ngập 0.8m</li>
                    <li>Kinh Dương Vương (Quận 6): ngập 1.0m</li>
                    <li>Lê Văn Việt (Quận 9): ngập 0.6m</li>
                    <li>Nguyễn Văn Linh (Quận 7): ngập 0.7m</li>
                    <li>Xa lộ Hà Nội (Quận 2): ngập 0.5m</li>
                </ul>
            </div>
            
            <div class="bg-orange-50 border-l-4 border-orange-400 p-4 mb-4">
                <p class="font-semibold">BIỆN PHÁP ỨNG PHÓ:</p>
                <ul class="list-disc ml-5 mt-2 space-y-2">
                    <li>Huy động 20 trạm bơm hoạt động hết công suất</li>
                    <li>Phân luồng giao thông tại 35 điểm ngập</li>
                    <li>Cử 150 cán bộ túc trực hỗ trợ người dân</li>
                    <li>Sẵn sàng phương án sơ tán khi cần thiết</li>
                </ul>
            </div>
            
            <div class="flex justify-between mt-4">
                <button class="flex items-center px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition report-incident">
                    <i data-feather="alert-triangle" class="mr-2 w-4 h-4"></i> Báo cáo sự cố
                </button>
                <button class="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition view-on-map" data-location="10.75,106.65">
                    <i data-feather="map" class="mr-2 w-4 h-4"></i> Xem trên bản đồ
                </button>
            </div>
        `,
        type: "emergency",
        location: "tp-hcm",
        date: "2023-09-25",
        time: "07:30",
        priority: "high",
        coordinates: { lat: 10.75, lng: 106.65 }
    },
    // Kêu gọi cứu trợ (giữ nguyên)
    {
        id: 3,
        title: "KÊU GỌI: Chung tay cứu trợ đồng bào vùng lũ Quảng Bình",
        summary: "Hàng ngàn hộ dân tại Quảng Bình đang chịu ảnh hưởng nặng nề từ trận lũ lịch sử.",
        content: `
            <div class="mb-4">
                <img src="https://images.unsplash.com/photo-1583337130417-0c94cddc0e82?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" alt="Cứu trợ lũ lụt" class="w-full h-64 object-cover rounded-lg">
            </div>
            <p class="text-lg font-semibold mb-4">KÊU GỌI CỨU TRỢ từ Quỹ Từ thiện Vì Cộng đồng</p>
            <p class="mb-4">Trận lũ lịch sử tại Quảng Bình đã khiến hàng ngàn hộ dân mất nhà cửa, thiệt hại nặng nề về tài sản và hoa màu.</p>
            
            <div class="donation-info">
                <div class="flex justify-between mb-2">
                    <span class="font-medium">Mục tiêu quyên góp:</span>
                    <span class="font-bold">500,000,000 VNĐ</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: 65%"></div>
                </div>
                <div class="flex justify-between text-sm text-gray-600">
                    <span>Đã quyên góp: 325,000,000 VNĐ</span>
                    <span>65%</span>
                </div>
            </div>
            
            <div class="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4">
                <p class="font-semibold">NHU CẦU CỨU TRỢ:</p>
                <ul class="list-disc ml-5 mt-2">
                    <li>Lương thực: Gạo, mì tôm, nước uống</li>
                    <li>Vật dụng: Chăn màn, quần áo ấm, thuốc men</li>
                    <li>Vật tư xây dựng: Tôn, gỗ, xi măng</li>
                </ul>
            </div>
            
            <div class="flex space-x-4 mt-6">
                <button class="flex-1 bg-green-500 text-white py-3 rounded-md hover:bg-green-600 transition font-medium donate-btn">
                    Ủng hộ ngay
                </button>
                <button class="flex-1 bg-blue-500 text-white py-3 rounded-md hover:bg-blue-600 transition font-medium share-btn">
                    Chia sẻ
                </button>
            </div>
        `,
        type: "assistance",
        location: "mien-trung",
        date: "2023-09-24",
        time: "09:30",
        priority: "medium"
    },
    {
        id: 4,
        title: "HỖ TRỢ: Cần gấp máy phát điện cho trạm y tế vùng lũ",
        summary: "Trạm y tế xã Hải Lộc, huyện Hải Hậu cần máy phát điện khẩn cấp để duy trì hoạt động.",
        content: `
            <div class="mb-4">
                <img src="https://images.unsplash.com/photo-1582750433449-648ed127bb54?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" alt="Trạm y tế" class="w-full h-64 object-cover rounded-lg">
            </div>
            <p class="text-lg font-semibold mb-4">KÊU GỌI HỖ TRỢ từ Trạm Y tế xã Hải Lộc</p>
            <p class="mb-4">Do mất điện kéo dài sau bão, trạm y tế xã Hải Lộc không thể vận hành các thiết bị y tế thiết yếu, ảnh hưởng đến việc khám chữa bệnh cho người dân.</p>
            
            <div class="donation-info">
                <div class="flex justify-between mb-2">
                    <span class="font-medium">Mục tiêu quyên góp:</span>
                    <span class="font-bold">50,000,000 VNĐ</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: 40%"></div>
                </div>
                <div class="flex justify-between text-sm text-gray-600">
                    <span>Đã quyên góp: 20,000,000 VNĐ</span>
                    <span>40%</span>
                </div>
            </div>
            
            <div class="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                <p class="font-semibold">NHU CẦU HỖ TRỢ:</p>
                <ul class="list-disc ml-5 mt-2">
                    <li>Máy phát điện công suất 5-10KVA</li>
                    <li>Thuốc men thiết yếu</li>
                    <li>Vật tư y tế: bông, băng, gạc</li>
                </ul>
            </div>
            
            <div class="flex space-x-4 mt-6">
                <button class="flex-1 bg-green-500 text-white py-3 rounded-md hover:bg-green-600 transition font-medium donate-btn">
                    Ủng hộ ngay
                </button>
                <button class="flex-1 bg-blue-500 text-white py-3 rounded-md hover:bg-blue-600 transition font-medium share-btn">
                    Chia sẻ
                </button>
            </div>
        `,
        type: "assistance",
        location: "mien-bac",
        date: "2023-09-23",
        time: "14:20",
        priority: "high"
    },
    // Đoàn thiện nguyện (giữ nguyên)
    {
        id: 5,
        title: "THIỆN NGUYỆN: Đoàn từ thiện Hoa Mặt Trời đang trên đường đến Quảng Bình",
        summary: "Đoàn gồm 15 tình nguyện viên mang theo 5 tấn hàng cứu trợ đang di chuyển đến vùng lũ.",
        content: `
            <div class="mb-4">
                <img src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" alt="Đoàn thiện nguyện" class="w-full h-64 object-cover rounded-lg">
            </div>
            <p class="text-lg font-semibold mb-4">THÔNG TIN ĐOÀN THIỆN NGUYỆN</p>
            <p class="mb-4">Đoàn từ thiện Hoa Mặt Trời xuất phát từ Hà Nội, dự kiến sẽ đến Quảng Bình vào chiều nay với 5 tấn hàng cứu trợ gồm lương thực, thuốc men và vật dụng thiết yếu.</p>
            
            <div class="flex items-center mb-4">
                <span class="volunteer-status status-en-route">
                    <i data-feather="truck" class="mr-1 w-4 h-4"></i> Đang di chuyển
                </span>
                <span class="ml-4 text-sm text-gray-600">Dự kiến đến nơi: 15:30 chiều nay</span>
            </div>
            
            <div class="bg-green-50 border-l-4 border-green-400 p-4 mb-4">
                <p class="font-semibold">THÔNG TIN HÀNG CỨU TRỢ:</p>
                <ul class="list-disc ml-5 mt-2">
                    <li>2 tấn gạo, 1 tấn mì tôm</li>
                    <li>500 chai nước uống, 200 thùng sữa</li>
                    <li>Thuốc men và vật tư y tế</li>
                    <li>500 bộ quần áo ấm, chăn màn</li>
                </ul>
            </div>
            
            <div class="map-preview">
                <div class="text-center">
                    <i data-feather="map" class="w-12 h-12 mx-auto mb-2"></i>
                    <p>Bản đồ hiển thị lộ trình đoàn thiện nguyện</p>
                </div>
            </div>
            
            <div class="flex justify-between mt-4">
                <button class="flex items-center px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition contact-volunteer">
                    <i data-feather="phone" class="mr-2 w-4 h-4"></i> Liên hệ đoàn
                </button>
                <button class="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition view-on-map" data-location="18.50,105.50">
                    <i data-feather="map" class="mr-2 w-4 h-4"></i> Theo dõi lộ trình
                </button>
            </div>
        `,
        type: "volunteer",
        location: "mien-trung",
        date: "2023-09-24",
        time: "10:45",
        priority: "medium"
    },
    {
        id: 6,
        title: "THIỆN NGUYỆN: Nhóm bác sĩ tình nguyện đã có mặt tại Đắk Lắk",
        summary: "Nhóm 8 bác sĩ từ TP.HCM đã đến Đắk Lắk để khám chữa bệnh miễn phí cho đồng bào vùng sâu.",
        content: `
            <div class="mb-4">
                <img src="https://images.unsplash.com/photo-1551601651-2a8555f1a136?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" alt="Bác sĩ tình nguyện" class="w-full h-64 object-cover rounded-lg">
            </div>
            <p class="text-lg font-semibold mb-4">THÔNG TIN ĐOÀN BÁC SĨ TÌNH NGUYỆN</p>
            <p class="mb-4">Nhóm 8 bác sĩ chuyên khoa từ các bệnh viện tại TP.HCM đã đến xã Ea Tul, huyện Cư M'gar, tỉnh Đắk Lắk để tổ chức khám chữa bệnh miễn phí cho đồng bào dân tộc thiểu số.</p>
            
            <div class="flex items-center mb-4">
                <span class="volunteer-status status-arrived">
                    <i data-feather="check-circle" class="mr-1 w-4 h-4"></i> Đã đến nơi
                </span>
                <span class="ml-4 text-sm text-gray-600">Đang hoạt động tại trường Tiểu học Ea Tul</span>
            </div>
            
            <div class="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4">
                <p class="font-semibold">DỊCH VỤ CUNG CẤP:</p>
                <ul class="list-disc ml-5 mt-2">
                    <li>Khám bệnh miễn phí các chuyên khoa</li>
                    <li>Phát thuốc miễn phí</li>
                    <li>Tư vấn sức khỏe cộng đồng</li>
                    <li>Hướng dẫn phòng chống dịch bệnh</li>
                </ul>
            </div>
            
            <div class="flex justify-between mt-4">
                <button class="flex items-center px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition contact-volunteer">
                    <i data-feather="phone" class="mr-2 w-4 h-4"></i> Liên hệ đoàn
                </button>
                <button class="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition view-on-map" data-location="12.75,108.05">
                    <i data-feather="map" class="mr-2 w-4 h-4"></i> Xem vị trí
                </button>
            </div>
        `,
        type: "volunteer",
        location: "dak-lak",
        date: "2023-09-23",
        time: "08:30",
        priority: "medium"
    }
];

// Cấu hình phân trang
const ITEMS_PER_PAGE = 6;
let currentPage = 1;
let filteredNews = [...newsData];

// Hàm hiển thị bản tin với phân trang
function displayNews(newsArray, page = 1) {
    const newsGrid = document.getElementById('news-grid');
    newsGrid.innerHTML = '';

    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const newsToShow = newsArray.slice(startIndex, endIndex);

    if (newsToShow.length === 0) {
        newsGrid.innerHTML = `
            <div class="col-span-3 text-center py-12">
                <i data-feather="alert-circle" class="w-16 h-16 text-gray-400 mx-auto mb-4"></i>
                <p class="text-gray-500 text-lg">Không tìm thấy bản tin nào phù hợp</p>
            </div>
        `;
        feather.replace();
        return;
    }

    newsToShow.forEach(news => {
        const priorityColor = news.priority === 'high' ? 'priority-high' : 
                            news.priority === 'medium' ? 'priority-medium' : 'priority-low';
        
        const typeClass = news.type === 'emergency' ? 'urgent-news' : 
                        news.type === 'assistance' ? 'assistance-news' : 'volunteer-news';
        
        const typeLabel = news.type === 'emergency' ? 'Sự cố' : 
                        news.type === 'assistance' ? 'Cứu trợ' : 'Thiện nguyện';

        const newsCard = document.createElement('div');
        newsCard.className = `news-card ${typeClass}`;
        newsCard.innerHTML = `
            <div class="p-6 flex-1">
                <div class="flex justify-between items-start mb-2">
                    <span class="source-badge ${priorityColor}">${typeLabel}</span>
                    <span class="text-xs text-gray-500">${news.date} ${news.time}</span>
                </div>
                <h3 class="text-xl font-bold mb-3 text-gray-800 line-clamp-2">${news.title}</h3>
                <p class="text-gray-600 mb-4 line-clamp-3">${news.summary}</p>
                <div class="flex justify-between items-center mt-auto">
                    <span class="type-label">${getLocationLabel(news.location)}</span>
                    <button class="view-details text-red-500 hover:text-red-700 font-medium flex items-center" data-id="${news.id}">
                        Chi tiết <i data-feather="arrow-right" class="ml-1 w-4 h-4"></i>
                    </button>
                </div>
            </div>
        `;
        newsGrid.appendChild(newsCard);
    });

    // Cập nhật feather icons
    feather.replace();
    
    // Thêm sự kiện click cho các nút chi tiết
    document.querySelectorAll('.view-details').forEach(button => {
        button.addEventListener('click', function() {
            const newsId = this.getAttribute('data-id');
            showNewsDetails(newsId);
        });
    });

    // Cập nhật thông tin phân trang
    updatePagination(newsArray.length, page);
}

// Hàm cập nhật phân trang
function updatePagination(totalItems, currentPage) {
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';

    if (totalPages <= 1) return;

    // Nút Previous
    const prevButton = document.createElement('button');
    prevButton.className = `pagination-btn ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`;
    prevButton.innerHTML = '<i data-feather="chevron-left" class="w-4 h-4"></i>';
    prevButton.disabled = currentPage === 1;
    prevButton.addEventListener('click', () => {
        if (currentPage > 1) {
            displayNews(filteredNews, currentPage - 1);
        }
    });
    pagination.appendChild(prevButton);

    // Các nút trang
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, currentPage + 2);

    for (let i = startPage; i <= endPage; i++) {
        const pageButton = document.createElement('button');
        pageButton.className = `pagination-btn ${i === currentPage ? 'active' : ''}`;
        pageButton.textContent = i;
        pageButton.addEventListener('click', () => {
            displayNews(filteredNews, i);
        });
        pagination.appendChild(pageButton);
    }

    // Nút Next
    const nextButton = document.createElement('button');
    nextButton.className = `pagination-btn ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`;
    nextButton.innerHTML = '<i data-feather="chevron-right" class="w-4 h-4"></i>';
    nextButton.disabled = currentPage === totalPages;
    nextButton.addEventListener('click', () => {
        if (currentPage < totalPages) {
            displayNews(filteredNews, currentPage + 1);
        }
    });
    pagination.appendChild(nextButton);

    feather.replace();
}

// Hàm hiển thị chi tiết bản tin
function showNewsDetails(newsId) {
    const news = newsData.find(item => item.id == newsId);
    if (!news) return;

    const modal = document.getElementById('news-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalContent = document.getElementById('modal-content');

    modalTitle.textContent = news.title;
    
    const typeLabel = news.type === 'emergency' ? 'Sự cố khẩn cấp' : 
                    news.type === 'assistance' ? 'Kêu gọi cứu trợ' : 'Đoàn thiện nguyện';

    modalContent.innerHTML = `
        <div class="flex justify-between items-center mb-4">
            <span class="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">${typeLabel}</span>
            <span class="text-gray-500">${news.date} ${news.time}</span>
        </div>
        ${news.content}
        <div class="flex items-center text-sm text-gray-600 mt-4">
            <i data-feather="map-pin" class="mr-1 w-4 h-4"></i>
            <span>Khu vực: ${getLocationLabel(news.location)}</span>
        </div>
    `;

    modal.classList.remove('hidden');
    
    // Cập nhật feather icons trong modal
    feather.replace();
    
    // Thêm sự kiện cho các nút trong modal
    setupModalButtons();
}

// Hàm thiết lập sự kiện cho các nút trong modal
function setupModalButtons() {
    // Nút xem trên bản đồ
    document.querySelectorAll('.view-on-map').forEach(button => {
        button.addEventListener('click', function() {
            const location = this.getAttribute('data-location');
            window.location.href = `map.html?location=${location}`;
        });
    });
    
    // Nút báo cáo sự cố
    document.querySelectorAll('.report-incident').forEach(button => {
        button.addEventListener('click', function() {
            window.location.href = 'post.html#report';
        });
    });
    
    // Nút ủng hộ
    document.querySelectorAll('.donate-btn').forEach(button => {
        button.addEventListener('click', function() {
            alert('Chức năng ủng hộ sẽ được kích hoạt. Trong thực tế, đây sẽ là liên kết đến trang thanh toán.');
        });
    });
    
    // Nút chia sẻ
    document.querySelectorAll('.share-btn').forEach(button => {
        button.addEventListener('click', function() {
            if (navigator.share) {
                navigator.share({
                    title: document.title,
                    text: 'Hãy cùng chung tay hỗ trợ những người gặp khó khăn',
                    url: window.location.href
                });
            } else {
                alert('Chức năng chia sẻ đã được kích hoạt. Trên thiết bị di động, bạn có thể chia sẻ trang web này.');
            }
        });
    });
    
    // Nút liên hệ đoàn thiện nguyện
    document.querySelectorAll('.contact-volunteer').forEach(button => {
        button.addEventListener('click', function() {
            alert('Thông tin liên hệ của đoàn thiện nguyện sẽ được hiển thị tại đây.');
        });
    });
}

// Hàm lấy nhãn địa điểm
function getLocationLabel(location) {
    const locationLabels = {
        'all': 'Toàn quốc',
        'ha-noi': 'Hà Nội',
        'tp-hcm': 'TP.HCM',
        'da-nang': 'Đà Nẵng',
        'mien-bac': 'Miền Bắc',
        'mien-trung': 'Miền Trung',
        'tay-nguyen': 'Tây Nguyên',
        'dak-lak': 'Đắk Lắk',
        'binh-dinh': 'Bình Định',
        'thai-nguyen': 'Thái Nguyên'
    };
    return locationLabels[location] || location;
}

// Hàm lọc bản tin
function filterNews() {
    const typeFilter = document.getElementById('filter-type').value;
    const locationFilter = document.getElementById('filter-location').value;
    const sortBy = document.getElementById('sort-by').value;

    filteredNews = newsData.filter(news => {
        const matchesType = typeFilter === 'all' || news.type === typeFilter;
        const matchesLocation = locationFilter === 'all' || news.location === locationFilter;

        return matchesType && matchesLocation;
    });

    // Sắp xếp
    if (sortBy === 'newest') {
        filteredNews.sort((a, b) => new Date(b.date + ' ' + b.time) - new Date(a.date + ' ' + a.time));
    } else if (sortBy === 'oldest') {
        filteredNews.sort((a, b) => new Date(a.date + ' ' + a.time) - new Date(b.date + ' ' + b.time));
    } else if (sortBy === 'priority') {
        // Sắp xếp theo mức độ ưu tiên (high > medium > low)
        const priorityOrder = { 'high': 3, 'medium': 2, 'low': 1 };
        filteredNews.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority] || 
            new Date(b.date + ' ' + b.time) - new Date(a.date + ' ' + a.time));
    }

    currentPage = 1;
    displayNews(filteredNews, currentPage);
}

// Hàm làm mới dữ liệu
function refreshNews() {
    // Hiển thị loading indicator
    const loadingIndicator = document.getElementById('loading-indicator');
    loadingIndicator.style.display = 'block';
    
    // Giả lập tải dữ liệu mới
    setTimeout(() => {
        loadingIndicator.style.display = 'none';
        displayNews(newsData, 1);
        alert('Đã làm mới dữ liệu bản tin');
    }, 1000);
}

// Khởi tạo sự kiện khi DOM đã tải xong
document.addEventListener('DOMContentLoaded', function() {
    // Khởi tạo feather icons
    feather.replace();
    
    // Hiển thị bản tin ban đầu
    displayNews(newsData, currentPage);

    // Thêm sự kiện cho các bộ lọc
    document.getElementById('filter-type').addEventListener('change', filterNews);
    document.getElementById('filter-location').addEventListener('change', filterNews);
    document.getElementById('sort-by').addEventListener('change', filterNews);
    
    // Sự kiện cho nút làm mới
    document.getElementById('refresh-news').addEventListener('click', refreshNews);

    // Sự kiện cho các tab lọc nhanh
    document.querySelectorAll('.filter-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active class from all tabs
            document.querySelectorAll('.filter-tab').forEach(t => {
                t.classList.remove('filter-active');
            });
            // Add active class to clicked tab
            this.classList.add('filter-active');
            
            // Apply filter
            const filterValue = this.getAttribute('data-filter');
            if (filterValue === 'all') {
                document.getElementById('filter-type').value = 'all';
            } else {
                document.getElementById('filter-type').value = filterValue;
            }
            filterNews();
        });
    });

    // Đóng modal
    document.getElementById('close-modal').addEventListener('click', function() {
        document.getElementById('news-modal').classList.add('hidden');
    });

    // Đóng modal khi click bên ngoài
    document.getElementById('news-modal').addEventListener('click', function(e) {
        if (e.target === this) {
            this.classList.add('hidden');
        }
    });

    // Đóng modal khi nhấn phím ESC
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && !document.getElementById('news-modal').classList.contains('hidden')) {
            document.getElementById('news-modal').classList.add('hidden');
        }
    });

    // Xử lý menu mobile
    document.getElementById('menu-toggle').addEventListener('click', function() {
        const mobileMenu = document.getElementById('mobile-menu');
        mobileMenu.classList.toggle('hidden');
        feather.replace();
    });
});