// assets/js/request.js - Xử lý chức năng cho trang bản tin khẩn cấp

document.addEventListener('DOMContentLoaded', function() {
    // Khởi tạo feather icons
    feather.replace();
    
    // Biến toàn cục
    let currentPage = 1;
    const itemsPerPage = 9;
    let allNews = [];
    let filteredNews = [];
    
    // Elements
    const newsGrid = document.getElementById('news-grid');
    const loadingIndicator = document.getElementById('loading-indicator');
    const emptyState = document.getElementById('empty-state');
    const pagination = document.getElementById('pagination');
    const filterType = document.getElementById('filter-type');
    const filterLocation = document.getElementById('filter-location');
    const refreshBtn = document.getElementById('refresh-news');
    const filterTabs = document.querySelectorAll('.filter-tab');
    const resetFiltersBtn = document.getElementById('reset-filters');
    const newsModal = document.getElementById('news-modal');
    const closeModal = document.getElementById('close-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalContent = document.getElementById('modal-content');
    
    // Mobile menu toggle
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
            const icon = menuToggle.querySelector('i');
            if (mobileMenu.classList.contains('hidden')) {
                feather.replace();
            } else {
                icon.setAttribute('data-feather', 'x');
                feather.replace();
            }
        });
    }
    
    // Dữ liệu mẫu theo form mới
    const sampleNewsData = [
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
    {
        id: 'INC003',
        type: 'accident',
        status: 'resolved',
        priority: 'high',
        title: 'Tai nạn giao thông trên cầu Sông Hàn',
        address: 'Cầu Sông Hàn, Đà Nẵng',
        province: 'Đà Nẵng',
        time: '10:45, 12/11/2023',
        description: 'Va chạm giữa xe tải và xe máy, một người bị thương nặng. Sự cố đã được xử lý, giao thông thông suốt trở lại.',
        reporter: { name: 'Lê Văn C', phone: '0978 901 234' },
        timeline: [
            { time: '10:40', action: 'Tiếp nhận báo cáo sự cố' },
            { time: '10:43', action: 'Điều động xe cứu thương' },
            { time: '10:50', action: 'Lực lượng có mặt tại hiện trường' },
            { time: '11:15', action: 'Sự cố đã được giải quyết' }
        ]
    },
    {
        id: 'INC004',
        type: 'disaster',
        status: 'active',
        priority: 'high',
        title: 'Sạt lở đất tại huyện A Lưới',
        address: 'Xã Hồng Vân, Huyện A Lưới, Thừa Thiên Huế',
        province: 'Thừa Thiên Huế',
        time: '09:20, 12/11/2023',
        description: 'Sạt lở đất sau mưa lớn, nhiều hộ dân bị ảnh hưởng. Lực lượng cứu hộ đang tiến hành sơ tán người dân.',
        reporter: { name: 'Phạm Thị D', phone: '0901 234 567' },
        timeline: [
            { time: '09:15', action: 'Tiếp nhận báo cáo sự cố' },
            { time: '09:18', action: 'Cảnh báo và sơ tán người dân' },
            { time: '09:30', action: 'Triển khai lực lượng cứu hộ' }
        ]
    },
    {
        id: 'INC005',
        type: 'fire',
        status: 'active',
        priority: 'high',
        title: 'Cháy nhà máy sản xuất',
        address: 'Khu công nghiệp Vĩnh Tuy, Hà Đông, Hà Nội',
        province: 'Hà Nội',
        time: '13:10, 12/11/2023',
        description: 'Cháy lớn tại nhà máy sản xuất linh kiện điện tử, khói đen bao phủ khu vực. Đang điều động thêm lực lượng.',
        reporter: { name: 'Hoàng Văn E', phone: '0987 654 321' },
        timeline: [
            { time: '13:05', action: 'Tiếp nhận báo cáo sự cố' },
            { time: '13:08', action: 'Điều động 5 xe chữa cháy' },
            { time: '13:15', action: 'Lực lượng có mặt tại hiện trường' }
        ]
    },
    {
        id: 'INC006',
        type: 'flood',
        status: 'active',
        priority: 'medium',
        title: 'Ngập lụt khu vực trung tâm',
        address: 'Đường 30/4, Quận Ninh Kiều, Cần Thơ',
        province: 'Cần Thơ',
        time: '11:30, 12/11/2023',
        description: 'Ngập nước sâu 0.7m do triều cường kết hợp mưa lớn. Đang tiến hành hút nước và phân luồng giao thông.',
        reporter: { name: 'Lý Thị F', phone: '0965 432 109' },
        timeline: [
            { time: '11:25', action: 'Tiếp nhận báo cáo sự cố' },
            { time: '11:28', action: 'Cảnh báo người dân' },
            { time: '11:35', action: 'Triển khai lực lượng ứng phó' }
        ]
    },
    {
        id: 'INC007',
        type: 'accident',
        status: 'active',
        priority: 'high',
        title: 'Tai nạn liên hoàn trên cao tốc',
        address: 'Cao tốc Hà Nội - Hải Phòng, Km25',
        province: 'Hải Phòng',
        time: '08:45, 12/11/2023',
        description: 'Va chạm liên hoàn giữa 5 xe ô tô, nhiều người bị thương. Đang điều động xe cứu thương.',
        reporter: { name: 'Vũ Văn G', phone: '0943 218 765' },
        timeline: [
            { time: '08:40', action: 'Tiếp nhận báo cáo sự cố' },
            { time: '08:43', action: 'Điều động 3 xe cứu thương' },
            { time: '08:50', action: 'Lực lượng có mặt tại hiện trường' }
        ]
    },
    {
        id: 'INC008',
        type: 'disaster',
        status: 'active',
        priority: 'high',
        title: 'Lũ quét tại huyện miền núi',
        address: 'Xã Trung Sơn, Huyện Quan Hóa, Thanh Hóa',
        province: 'Thanh Hóa',
        time: '07:20, 12/11/2023',
        description: 'Lũ quét sau mưa lớn, nhiều nhà cửa bị cuốn trôi. Đang tiến hành cứu hộ khẩn cấp.',
        reporter: { name: 'Đặng Thị H', phone: '0918 765 432' },
        timeline: [
            { time: '07:15', action: 'Tiếp nhận báo cáo sự cố' },
            { time: '07:18', action: 'Cảnh báo và sơ tán người dân' },
            { time: '07:30', action: 'Triển khai lực lượng cứu hộ' }
        ]
    },
    {
        id: 'INC009',
        type: 'fire',
        status: 'resolved',
        priority: 'medium',
        title: 'Cháy rừng tại Vườn Quốc gia',
        address: 'Vườn Quốc gia Pù Mát, Con Cuông, Nghệ An',
        province: 'Nghệ An',
        time: '16:40, 11/11/2023',
        description: 'Cháy rừng quy mô nhỏ, đã được khống chế. Không có thiệt hại về người.',
        reporter: { name: 'Bùi Văn I', phone: '0976 543 210' },
        timeline: [
            { time: '16:35', action: 'Tiếp nhận báo cáo sự cố' },
            { time: '16:38', action: 'Điều động lực lượng' },
            { time: '17:10', action: 'Dập tắt đám cháy' },
            { time: '17:30', action: 'Sự cố đã được giải quyết' }
        ]
    },
    {
        id: 'INC010',
        type: 'accident',
        status: 'active',
        priority: 'medium',
        title: 'Tai nạn xe container',
        address: 'Quốc lộ 1A, Thành phố Bắc Ninh',
        province: 'Bắc Ninh',
        time: '12:15, 12/11/2023',
        description: 'Xe container mất lái đâm vào nhà dân. Đang xử lý hiện trường.',
        reporter: { name: 'Ngô Văn K', phone: '0932 109 876' },
        timeline: [
            { time: '12:10', action: 'Tiếp nhận báo cáo sự cố' },
            { time: '12:13', action: 'Điều động cảnh sát GT' },
            { time: '12:20', action: 'Lực lượng có mặt tại hiện trường' }
        ]
    },
    {
        id: 'INC011',
        type: 'flood',
        status: 'active',
        priority: 'high',
        title: 'Ngập lụt diện rộng tại huyện Cái Bè',
        address: 'Huyện Cái Bè, Tiền Giang',
        province: 'Tiền Giang',
        time: '09:45, 12/11/2023',
        description: 'Ngập nước sâu 1m do vỡ đê, nhiều hộ dân bị cô lập. Đang cứu hộ khẩn cấp.',
        reporter: { name: 'Trần Văn L', phone: '0915 678 432' },
        timeline: [
            { time: '09:40', action: 'Tiếp nhận báo cáo sự cố' },
            { time: '09:43', action: 'Cảnh báo và sơ tán người dân' },
            { time: '09:50', action: 'Triển khai lực lượng cứu hộ' }
        ]
    },
    {
        id: 'INC012',
        type: 'disaster',
        status: 'active',
        priority: 'high',
        title: 'Sạt lở đất tại Đà Lạt',
        address: 'Đường Hồ Tùng Mậu, Đà Lạt, Lâm Đồng',
        province: 'Lâm Đồng',
        time: '08:30, 12/11/2023',
        description: 'Sạt lở đất sau mưa lớn, một số nhà bị vùi lấp. Đang tìm kiếm người mất tích.',
        reporter: { name: 'Phan Thị M', phone: '0986 543 210' },
        timeline: [
            { time: '08:25', action: 'Tiếp nhận báo cáo sự cố' },
            { time: '08:28', action: 'Điều động lực lượng cứu hộ' },
            { time: '08:35', action: 'Lực lượng có mặt tại hiện trường' }
        ]
    },
    {
        id: 'INC013',
        type: 'fire',
        status: 'active',
        priority: 'high',
        title: 'Cháy kho xưởng tại Nha Trang',
        address: 'Khu công nghiệp Bắc Nha Trang, Khánh Hòa',
        province: 'Khánh Hòa',
        time: '16:20, 12/11/2023',
        description: 'Cháy lớn tại kho chứa vật liệu xây dựng, khói đen dày đặc. Đang chữa cháy.',
        reporter: { name: 'Lê Văn N', phone: '0975 432 109' },
        timeline: [
            { time: '16:15', action: 'Tiếp nhận báo cáo sự cố' },
            { time: '16:18', action: 'Điều động 4 xe chữa cháy' },
            { time: '16:25', action: 'Lực lượng có mặt tại hiện trường' }
        ]
    },
    {
        id: 'INC014',
        type: 'accident',
        status: 'active',
        priority: 'medium',
        title: 'Tai nạn giao thông trên Quốc lộ 5',
        address: 'Quốc lộ 5, Km45, Hải Dương',
        province: 'Hải Dương',
        time: '14:50, 12/11/2023',
        description: 'Va chạm giữa xe khách và xe tải, 5 người bị thương. Đang cấp cứu.',
        reporter: { name: 'Nguyễn Thị O', phone: '0967 890 123' },
        timeline: [
            { time: '14:45', action: 'Tiếp nhận báo cáo sự cố' },
            { time: '14:48', action: 'Điều động 2 xe cứu thương' },
            { time: '14:55', action: 'Lực lượng có mặt tại hiện trường' }
        ]
    },
    {
        id: 'INC015',
        type: 'flood',
        status: 'resolved',
        priority: 'low',
        title: 'Ngập cục bộ tại trung tâm thành phố',
        address: 'Đường Phan Ngọc Hiển, TP. Cà Mau',
        province: 'Cà Mau',
        time: '10:15, 11/11/2023',
        description: 'Ngập nước nhẹ do triều cường, đã rút hết. Giao thông thông suốt.',
        reporter: { name: 'Võ Văn P', phone: '0933 444 555' },
        timeline: [
            { time: '10:10', action: 'Tiếp nhận báo cáo sự cố' },
            { time: '10:12', action: 'Thông báo cho công ty thoát nước' },
            { time: '11:30', action: 'Nước đã rút hết' }
        ]
    },
    {
        id: 'INC016',
        type: 'fire',
        status: 'active',
        priority: 'high',
        title: 'Cháy chợ nổi Cái Răng',
        address: 'Chợ nổi Cái Răng, Quận Cái Răng, Cần Thơ',
        province: 'Cần Thơ',
        time: '03:15, 13/11/2023',
        description: 'Cháy lớn tại khu vực chợ nổi, nhiều thuyền buôn bị thiêu rụi. Đang chữa cháy.',
        reporter: { name: 'Lâm Văn Q', phone: '0919 876 543' },
        timeline: [
            { time: '03:10', action: 'Tiếp nhận báo cáo sự cố' },
            { time: '03:13', action: 'Điều động 3 xe chữa cháy' },
            { time: '03:20', action: 'Lực lượng có mặt tại hiện trường' }
        ]
    },
    {
        id: 'INC017',
        type: 'flood',
        status: 'active',
        priority: 'high',
        title: 'Ngập lụt khu vực trung tâm thành phố Huế',
        address: 'Đường Lê Lợi, TP. Huế, Thừa Thiên Huế',
        province: 'Thừa Thiên Huế',
        time: '17:45, 13/11/2023',
        description: 'Ngập nước sâu 0.8m do mưa lớn kết hợp triều cường. Đang hỗ trợ người dân.',
        reporter: { name: 'Trần Thị R', phone: '0935 678 901' },
        timeline: [
            { time: '17:40', action: 'Tiếp nhận báo cáo sự cố' },
            { time: '17:43', action: 'Cảnh báo người dân' },
            { time: '17:50', action: 'Triển khai lực lượng ứng phó' }
        ]
    },
    {
        id: 'INC018',
        type: 'accident',
        status: 'active',
        priority: 'high',
        title: 'Tai nạn xe buýt trên cầu Vĩnh Tuy',
        address: 'Cầu Vĩnh Tuy, Hà Nội',
        province: 'Hà Nội',
        time: '08:20, 13/11/2023',
        description: 'Xe buýt mất lái đâm vào lan can cầu, nhiều hành khách bị thương. Đang cấp cứu.',
        reporter: { name: 'Nguyễn Văn S', phone: '0971 234 567' },
        timeline: [
            { time: '08:15', action: 'Tiếp nhận báo cáo sự cố' },
            { time: '08:18', action: 'Điều động 4 xe cứu thương' },
            { time: '08:25', action: 'Lực lượng có mặt tại hiện trường' }
        ]
    },
    {
        id: 'INC019',
        type: 'disaster',
        status: 'active',
        priority: 'high',
        title: 'Lở đất tại đèo Prenn',
        address: 'Đèo Prenn, Đà Lạt, Lâm Đồng',
        province: 'Lâm Đồng',
        time: '14:30, 13/11/2023',
        description: 'Sạt lở đất chặn hoàn toàn quốc lộ 20, nhiều xe bị mắc kẹt. Đang thông đường.',
        reporter: { name: 'Phạm Văn T', phone: '0982 345 678' },
        timeline: [
            { time: '14:25', action: 'Tiếp nhận báo cáo sự cố' },
            { time: '14:28', action: 'Cảnh báo và chặn đường' },
            { time: '14:35', action: 'Triển khai lực lượng cứu hộ' }
        ]
    },
    {
        id: 'INC020',
        type: 'fire',
        status: 'active',
        priority: 'medium',
        title: 'Cháy kho hàng tại cảng',
        address: 'Cảng Hải Phòng, Quận Hải An, Hải Phòng',
        province: 'Hải Phòng',
        time: '22:10, 13/11/2023',
        description: 'Cháy tại kho chứa hàng hóa xuất khẩu, thiệt hại ban đầu khoảng 2 tỷ đồng.',
        reporter: { name: 'Lê Thị U', phone: '0916 789 012' },
        timeline: [
            { time: '22:05', action: 'Tiếp nhận báo cáo sự cố' },
            { time: '22:08', action: 'Điều động 2 xe chữa cháy' },
            { time: '22:15', action: 'Lực lượng có mặt tại hiện trường' }
        ]
    },
    {
        id: 'INC021',
        type: 'flood',
        status: 'active',
        priority: 'medium',
        title: 'Ngập lụt khu du lịch Bãi Sau',
        address: 'Bãi Sau, TP. Vũng Tàu, Bà Rịa - Vũng Tàu',
        province: 'Bà Rịa - Vũng Tàu',
        time: '16:45, 13/11/2023',
        description: 'Ngập nước do triều cường dâng cao kết hợp mưa lớn.',
        reporter: { name: 'Võ Văn V', phone: '0936 789 123' },
        timeline: [
            { time: '16:40', action: 'Tiếp nhận báo cáo sự cố' },
            { time: '16:43', action: 'Cảnh báo du khách' },
            { time: '16:50', action: 'Triển khai lực lượng ứng phó' }
        ]
    },
    {
        id: 'INC022',
        type: 'accident',
        status: 'resolved',
        priority: 'medium',
        title: 'Tai nạn tại ngã tư trung tâm',
        address: 'Ngã tư đường Ngô Gia Tự - Lê Chân, TP. Bắc Ninh',
        province: 'Bắc Ninh',
        time: '11:30, 13/11/2023',
        description: 'Va chạm giữa xe container và xe máy, một người bị thương nhẹ.',
        reporter: { name: 'Nguyễn Thị W', phone: '0972 345 678' },
        timeline: [
            { time: '11:25', action: 'Tiếp nhận báo cáo sự cố' },
            { time: '11:28', action: 'Điều động xe cứu thương' },
            { time: '11:35', action: 'Lực lượng có mặt tại hiện trường' },
            { time: '12:00', action: 'Sự cố đã được giải quyết' }
        ]
    },
    {
        id: 'INC023',
        type: 'disaster',
        status: 'active',
        priority: 'high',
        title: 'Lũ lụt tại huyện Đại Lộc',
        address: 'Huyện Đại Lộc, Quảng Nam',
        province: 'Quảng Nam',
        time: '09:15, 13/11/2023',
        description: 'Lũ lụt diện rộng, nhiều xã bị cô lập, cần cứu hộ khẩn cấp.',
        reporter: { name: 'Trần Văn X', phone: '0917 890 123' },
        timeline: [
            { time: '09:10', action: 'Tiếp nhận báo cáo sự cố' },
            { time: '09:13', action: 'Cảnh báo và sơ tán người dân' },
            { time: '09:20', action: 'Triển khai lực lượng cứu hộ' }
        ]
    },
    {
        id: 'INC024',
        type: 'fire',
        status: 'active',
        priority: 'high',
        title: 'Cháy khách sạn tại trung tâm Nha Trang',
        address: 'Khách sạn A, đường Trần Phú, TP. Nha Trang',
        province: 'Khánh Hòa',
        time: '02:30, 14/11/2023',
        description: 'Cháy lớn tại tầng 5 khách sạn, nhiều du khách mắc kẹt.',
        reporter: { name: 'Lê Thị Y', phone: '0983 456 789' },
        timeline: [
            { time: '02:25', action: 'Tiếp nhận báo cáo sự cố' },
            { time: '02:28', action: 'Điều động 4 xe chữa cháy' },
            { time: '02:35', action: 'Lực lượng có mặt tại hiện trường' }
        ]
    },
    {
        id: 'INC025',
        type: 'flood',
        status: 'active',
        priority: 'medium',
        title: 'Ngập lụt khu vực nông thôn',
        address: 'Xã Mỹ Phước, Huyện Cái Bè, Tiền Giang',
        province: 'Tiền Giang',
        time: '13:20, 14/11/2023',
        description: 'Ngập nước sâu 0.6m ảnh hưởng đến sản xuất nông nghiệp.',
        reporter: { name: 'Phan Văn Z', phone: '0937 890 123' },
        timeline: [
            { time: '13:15', action: 'Tiếp nhận báo cáo sự cố' },
            { time: '13:18', action: 'Đánh giá thiệt hại' },
            { time: '13:25', action: 'Triển khai lực lượng ứng phó' }
        ]
    },
    {
        id: 'INC026',
        type: 'accident',
        status: 'active',
        priority: 'high',
        title: 'Tai nạn xe tải chở hóa chất',
        address: 'Quốc lộ 5, Km38, Hải Dương',
        province: 'Hải Dương',
        time: '10:45, 14/11/2023',
        description: 'Xe tải chở hóa chất bị lật, có nguy cơ rò rỉ hóa chất.',
        reporter: { name: 'Nguyễn Văn AA', phone: '0918 901 234' },
        timeline: [
            { time: '10:40', action: 'Tiếp nhận báo cáo sự cố' },
            { time: '10:43', action: 'Cảnh báo khu vực xung quanh' },
            { time: '10:50', action: 'Triển khai lực lượng đặc biệt' }
        ]
    },
    {
        id: 'INC027',
        type: 'disaster',
        status: 'active',
        priority: 'high',
        title: 'Lốc xoáy tại huyện Quỳnh Lưu',
        address: 'Huyện Quỳnh Lưu, Nghệ An',
        province: 'Nghệ An',
        time: '15:30, 14/11/2023',
        description: 'Lốc xoáy làm tốc mái nhiều nhà dân, cây cối đổ ngã.',
        reporter: { name: 'Trần Thị BB', phone: '0984 567 890' },
        timeline: [
            { time: '15:25', action: 'Tiếp nhận báo cáo sự cố' },
            { time: '15:28', action: 'Đánh giá thiệt hại' },
            { time: '15:35', action: 'Triển khai lực lượng cứu hộ' }
        ]
    },
    {
        id: 'INC028',
        type: 'fire',
        status: 'resolved',
        priority: 'medium',
        title: 'Cháy rừng phòng hộ',
        address: 'Rừng phòng hộ Ninh Sơn, Ninh Thuận',
        province: 'Ninh Thuận',
        time: '12:15, 14/11/2023',
        description: 'Cháy rừng quy mô nhỏ, đã được khống chế thành công.',
        reporter: { name: 'Lê Văn CC', phone: '0938 901 234' },
        timeline: [
            { time: '12:10', action: 'Tiếp nhận báo cáo sự cố' },
            { time: '12:13', action: 'Điều động lực lượng' },
            { time: '12:40', action: 'Dập tắt đám cháy' },
            { time: '13:00', action: 'Sự cố đã được giải quyết' }
        ]
    },
    {
        id: 'INC029',
        type: 'flood',
        status: 'active',
        priority: 'medium',
        title: 'Ngập lụt khu vực ven biển',
        address: 'Huyện Trần Đề, Sóc Trăng',
        province: 'Sóc Trăng',
        time: '18:30, 14/11/2023',
        description: 'Ngập nước do triều cường dâng cao, ảnh hưởng đến nuôi trồng thủy sản.',
        reporter: { name: 'Phạm Thị DD', phone: '0919 012 345' },
        timeline: [
            { time: '18:25', action: 'Tiếp nhận báo cáo sự cố' },
            { time: '18:28', action: 'Đánh giá thiệt hại' },
            { time: '18:35', action: 'Triển khai lực lượng ứng phó' }
        ]
    },
    {
        id: 'INC030',
        type: 'accident',
        status: 'active',
        priority: 'high',
        title: 'Tai nạn xe khách trên cao tốc',
        address: 'Cao tốc TP.HCM - Long Thành - Dầu Giây, Km50',
        province: 'Đồng Nai',
        time: '07:45, 15/11/2023',
        description: 'Xe khách va chạm với xe tải, 10 người bị thương.',
        reporter: { name: 'Nguyễn Văn EE', phone: '0973 456 789' },
        timeline: [
            { time: '07:40', action: 'Tiếp nhận báo cáo sự cố' },
            { time: '07:43', action: 'Điều động 3 xe cứu thương' },
            { time: '07:50', action: 'Lực lượng có mặt tại hiện trường' }
        ]
    },
    {
        id: 'INC031',
        type: 'disaster',
        status: 'active',
        priority: 'high',
        title: 'Sạt lở núi tại huyện Vĩnh Thạnh',
        address: 'Huyện Vĩnh Thạnh, Bình Định',
        province: 'Bình Định',
        time: '11:20, 15/11/2023',
        description: 'Sạt lở đất chặn đường liên xã, nhiều hộ dân bị cô lập.',
        reporter: { name: 'Trần Văn FF', phone: '0985 678 901' },
        timeline: [
            { time: '11:15', action: 'Tiếp nhận báo cáo sự cố' },
            { time: '11:18', action: 'Cảnh báo và sơ tán người dân' },
            { time: '11:25', action: 'Triển khai lực lượng cứu hộ' }
        ]
    },
    {
        id: 'INC032',
        type: 'fire',
        status: 'active',
        priority: 'medium',
        title: 'Cháy xưởng gỗ',
        address: 'Xưởng sản xuất đồ gỗ, TP. Thái Nguyên',
        province: 'Thái Nguyên',
        time: '14:10, 15/11/2023',
        description: 'Cháy tại xưởng sản xuất đồ gỗ, thiệt hại khoảng 500 triệu đồng.',
        reporter: { name: 'Lê Thị GG', phone: '0939 012 345' },
        timeline: [
            { time: '14:05', action: 'Tiếp nhận báo cáo sự cố' },
            { time: '14:08', action: 'Điều động 2 xe chữa cháy' },
            { time: '14:15', action: 'Lực lượng có mặt tại hiện trường' }
        ]
    },
    {
        id: 'INC033',
        type: 'flood',
        status: 'active',
        priority: 'low',
        title: 'Ngập cục bộ sau mưa',
        address: 'Đường Trần Hưng Đạo, TP. Nam Định',
        province: 'Nam Định',
        time: '19:30, 15/11/2023',
        description: 'Ngập nước nhẹ do hệ thống thoát nước quá tải.',
        reporter: { name: 'Phạm Văn HH', phone: '0912 345 678' },
        timeline: [
            { time: '19:25', action: 'Tiếp nhận báo cáo sự cố' },
            { time: '19:28', action: 'Kiểm tra hệ thống thoát nước' },
            { time: '19:35', action: 'Xử lý điểm ngập' }
        ]
    },
    {
        id: 'INC034',
        type: 'accident',
        status: 'active',
        priority: 'high',
        title: 'Tai nạn tàu thủy trên sông Vàm Cỏ',
        address: 'Sông Vàm Cỏ, Huyện Cần Giuộc, Long An',
        province: 'Long An',
        time: '09:15, 16/11/2023',
        description: 'Va chạm giữa tàu chở hàng và tàu cá, 3 người mất tích.',
        reporter: { name: 'Nguyễn Thị II', phone: '0986 789 012' },
        timeline: [
            { time: '09:10', action: 'Tiếp nhận báo cáo sự cố' },
            { time: '09:13', action: 'Điều động tàu cứu hộ' },
            { time: '09:20', action: 'Lực lượng có mặt tại hiện trường' }
        ]
    },
    {
        id: 'INC035',
        type: 'disaster',
        status: 'active',
        priority: 'high',
        title: 'Lở đất tại Sa Pa',
        address: 'Xã San Sả Hồ, Huyện Sa Pa, Lào Cai',
        province: 'Lào Cai',
        time: '13:45, 16/11/2023',
        description: 'Sạt lở đất do mưa lớn kéo dài, nhiều nhà bị vùi lấp.',
        reporter: { name: 'Trần Văn JJ', phone: '0913 456 789' },
        timeline: [
            { time: '13:40', action: 'Tiếp nhận báo cáo sự cố' },
            { time: '13:43', action: 'Cảnh báo và sơ tán người dân' },
            { time: '13:50', action: 'Triển khai lực lượng cứu hộ' }
        ]
    }
    ];

    // Khởi tạo
    function initialize() {
        allNews = [...sampleNewsData];
        filteredNews = [...allNews];
        displayNews();
        setupEventListeners();
    }

    // Thiết lập event listeners
    function setupEventListeners() {
        // Lọc theo loại
        filterType.addEventListener('change', applyFilters);
        
        // Lọc theo khu vực
        filterLocation.addEventListener('change', applyFilters);
        
        // Làm mới
        refreshBtn.addEventListener('click', refreshNews);
        
        // Tab lọc nhanh
        filterTabs.forEach(tab => {
            tab.addEventListener('click', function() {
                const filter = this.getAttribute('data-filter');
                handleQuickFilter(filter, this);
            });
        });
        
        // Đặt lại bộ lọc
        resetFiltersBtn.addEventListener('click', resetFilters);
        
        // Đóng modal
        closeModal.addEventListener('click', closeNewsModal);
        
        // Đóng modal khi click bên ngoài
        newsModal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeNewsModal();
            }
        });
        
        // Đóng modal bằng phím ESC
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                closeNewsModal();
            }
        });
    }

    // Hiển thị bản tin
    function displayNews() {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const newsToShow = filteredNews.slice(startIndex, endIndex);

        if (newsToShow.length === 0) {
            newsGrid.innerHTML = '';
            emptyState.classList.remove('hidden');
            pagination.innerHTML = '';
            return;
        }

        emptyState.classList.add('hidden');
        
        newsGrid.innerHTML = newsToShow.map(news => `
            <div class="news-card bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-200">
                <div class="p-6">
                    <div class="flex justify-between items-start mb-3">
                        <div class="flex flex-wrap gap-2">
                            <span class="${getTypeBadgeClass(news.type)} px-3 py-1 rounded-full text-xs font-medium text-white">
                                ${getTypeText(news.type)}
                            </span>
                            <span class="${getPriorityBadgeClass(news.priority)} px-3 py-1 rounded-full text-xs font-medium text-white">
                                ${getPriorityText(news.priority)}
                            </span>
                            ${news.status === 'resolved' ? `
                            <span class="bg-green-500 px-3 py-1 rounded-full text-xs font-medium text-white">
                                Đã giải quyết
                            </span>
                            ` : `
                            <span class="bg-red-500 px-3 py-1 rounded-full text-xs font-medium text-white">
                                Đang xử lý
                            </span>
                            `}
                        </div>
                        <span class="text-xs text-gray-500">${news.time}</span>
                    </div>
                    
                    <h3 class="text-xl font-bold text-gray-900 mb-3 line-clamp-2">${news.title}</h3>
                    
                    <div class="flex items-center text-gray-500 text-sm mb-3">
                        <i data-feather="map-pin" class="w-4 h-4 mr-1"></i>
                        <span class="mr-4">${news.province}</span>
                        <i data-feather="user" class="w-4 h-4 mr-1"></i>
                        <span>${news.reporter.name}</span>
                    </div>
                    
                    <p class="text-gray-600 mb-4 line-clamp-3">${news.description}</p>
                    
                    <div class="grid grid-cols-2 gap-4 mb-4 text-sm">
                        <div class="flex items-center text-gray-600">
                            <i data-feather="users" class="w-4 h-4 mr-2 text-red-500"></i>
                            <span>${news.casualties || 'Đang cập nhật'}</span>
                        </div>
                        <div class="flex items-center text-gray-600">
                            <i data-feather="alert-triangle" class="w-4 h-4 mr-2 text-orange-500"></i>
                            <span>${getPriorityText(news.priority)}</span>
                        </div>
                    </div>
                    
                    <div class="flex justify-between items-center">
                        <button class="view-on-map-btn px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition text-sm font-medium flex items-center" data-id="${news.id}">
                            <i data-feather="map" class="w-4 h-4 mr-2"></i>
                            Xem trên bản đồ
                        </button>
                        <button class="view-details-btn px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition text-sm font-medium" data-id="${news.id}">
                            Chi tiết sự cố
                        </button>
                    </div>
                </div>
            </div>
        `).join('');

        // Thêm event listeners cho các nút xem chi tiết
        document.querySelectorAll('.view-details-btn').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                const newsId = this.getAttribute('data-id');
                openNewsModal(newsId);
            });
        });

        // Thêm event listeners cho các nút xem trên bản đồ
        document.querySelectorAll('.view-on-map-btn').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                const newsId = this.getAttribute('data-id');
                const newsItem = allNews.find(item => item.id === newsId);
                if (newsItem && newsItem.coordinates) {
                    // Chuyển hướng đến trang bản đồ với thông tin sự cố
                    window.location.href = `map.html?lat=${newsItem.coordinates.lat}&lng=${newsItem.coordinates.lng}&title=${encodeURIComponent(newsItem.title)}`;
                } else {
                    alert('Không có thông tin tọa độ cho sự cố này');
                }
            });
        });

        // Thêm event listeners cho toàn bộ card
        document.querySelectorAll('.news-card').forEach(card => {
            card.addEventListener('click', function() {
                const btn = this.querySelector('.view-details-btn');
                if (btn) {
                    const newsId = btn.getAttribute('data-id');
                    openNewsModal(newsId);
                }
            });
        });

        renderPagination();
        feather.replace();
    }

    // Mở modal chi tiết
    function openNewsModal(newsId) {
        const newsItem = allNews.find(item => item.id === newsId);
        
        if (!newsItem) {
            console.error('News item not found for ID:', newsId);
            return;
        }

        modalTitle.textContent = newsItem.title;
        modalContent.innerHTML = generateModalContent(newsItem);
        
        newsModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        
        setupModalButtons(newsItem);
        feather.replace();
    }

    // Tạo nội dung modal
    function generateModalContent(newsItem) {
        return `
            <div class="flex flex-wrap gap-4 mb-6">
                <span class="${getTypeBadgeClass(newsItem.type)} px-3 py-1 rounded-full text-sm font-medium text-white">
                    ${getTypeText(newsItem.type)}
                </span>
                <span class="${getPriorityBadgeClass(newsItem.priority)} px-3 py-1 rounded-full text-sm font-medium text-white">
                    ${getPriorityText(newsItem.priority)}
                </span>
                <span class="${newsItem.status === 'resolved' ? 'bg-green-500' : 'bg-red-500'} px-3 py-1 rounded-full text-sm font-medium text-white">
                    ${newsItem.status === 'resolved' ? 'Đã giải quyết' : 'Đang xử lý'}
                </span>
                <span class="bg-blue-500 px-3 py-1 rounded-full text-sm font-medium text-white">
                    ${getLocationText(newsItem.location)}
                </span>
            </div>
            
            <div class="flex items-center text-gray-600 mb-6">
                <i data-feather="clock" class="w-5 h-5 mr-2"></i>
                <span>${newsItem.time}</span>
            </div>
            
            <div class="prose max-w-none mb-6">
                <p class="text-gray-700 text-lg leading-relaxed">${newsItem.description}</p>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div class="bg-gray-50 rounded-lg p-4">
                    <h4 class="font-bold text-gray-800 mb-3 flex items-center">
                        <i data-feather="map-pin" class="w-5 h-5 mr-2"></i>
                        Thông tin địa điểm
                    </h4>
                    <p class="text-gray-700 mb-2"><strong>Địa chỉ:</strong> ${newsItem.address}</p>
                    <p class="text-gray-700 mb-2"><strong>Tỉnh/Thành phố:</strong> ${newsItem.province}</p>
                    <p class="text-gray-700"><strong>Khu vực ảnh hưởng:</strong> ${newsItem.affectedAreas}</p>
                </div>
                
                <div class="bg-gray-50 rounded-lg p-4">
                    <h4 class="font-bold text-gray-800 mb-3 flex items-center">
                        <i data-feather="user" class="w-5 h-5 mr-2"></i>
                        Thông tin báo cáo
                    </h4>
                    <p class="text-gray-700 mb-2"><strong>Người báo cáo:</strong> ${newsItem.reporter.name}</p>
                    <p class="text-gray-700 mb-2"><strong>Điện thoại:</strong> ${newsItem.reporter.phone}</p>
                    <p class="text-gray-700"><strong>Thương vong:</strong> ${newsItem.casualties}</p>
                </div>
            </div>
            
            <div class="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
                <h4 class="font-bold text-red-800 mb-4 flex items-center">
                    <i data-feather="alert-circle" class="w-5 h-5 mr-2"></i>
                    Thông tin hỗ trợ cần thiết
                </h4>
                <div class="flex flex-wrap gap-2">
                    ${(newsItem.requiredSupport || []).map(support => `
                        <span class="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm">
                            ${support}
                        </span>
                    `).join('')}
                </div>
            </div>
            
            <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <h4 class="font-bold text-yellow-800 mb-4 flex items-center">
                    <i data-feather="activity" class="w-5 h-5 mr-2"></i>
                    Lịch sử xử lý sự cố
                </h4>
                <div class="space-y-3">
                    ${newsItem.timeline.map(item => `
                        <div class="flex items-start">
                            <div class="bg-yellow-100 text-yellow-800 rounded-full p-2 mr-3 flex-shrink-0">
                                <i data-feather="clock" class="w-4 h-4"></i>
                            </div>
                            <div class="flex-grow">
                                <p class="font-medium text-yellow-800">${item.time}</p>
                                <p class="text-yellow-700">${item.action}</p>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    // Thiết lập nút trong modal
    function setupModalButtons(newsItem) {
        // Xem trên bản đồ
        document.querySelector('.view-on-map').onclick = () => {
            if (newsItem.coordinates) {
                window.location.href = `map.html?lat=${newsItem.coordinates.lat}&lng=${newsItem.coordinates.lng}&title=${encodeURIComponent(newsItem.title)}`;
            } else {
                alert('Không có thông tin tọa độ cho sự cố này');
            }
        };
        
        // Báo cáo sự cố
        document.querySelector('.report-incident').onclick = () => {
            window.location.href = 'post.html#report';
        };
        
        // Ủng hộ
        document.querySelector('.donate-btn').onclick = () => {
            alert(`Chuyển hướng đến trang ủng hộ cho: ${newsItem.title}`);
        };
        
        // Chia sẻ
        document.querySelector('.share-btn').onclick = () => {
            if (navigator.share) {
                navigator.share({
                    title: newsItem.title,
                    text: newsItem.description,
                    url: window.location.href
                });
            } else {
                navigator.clipboard.writeText(window.location.href).then(() => {
                    alert('Đã sao chép liên kết vào clipboard!');
                });
            }
        };
        
        // Liên hệ tình nguyện
        const contactBtn = document.querySelector('.contact-volunteer');
        contactBtn.onclick = () => {
            alert(`Liên hệ người báo cáo: ${newsItem.reporter.name} - ${newsItem.reporter.phone}`);
        };
    }

    // Đóng modal
    function closeNewsModal() {
        newsModal.classList.add('hidden');
        document.body.style.overflow = 'auto';
    }

    // Áp dụng bộ lọc
    function applyFilters() {
        currentPage = 1;
        const typeValue = filterType.value;
        const locationValue = filterLocation.value;

        filteredNews = allNews.filter(news => {
            const typeMatch = typeValue === 'all' || news.type === typeValue;
            const locationMatch = locationValue === 'all' || news.location === locationValue;
            return typeMatch && locationMatch;
        });

        displayNews();
    }

    // Xử lý lọc nhanh
    function handleQuickFilter(filter, element) {
        filterTabs.forEach(tab => tab.classList.remove('filter-active'));
        element.classList.add('filter-active');

        if (filter === 'all') {
            filterType.value = 'all';
            filterLocation.value = 'all';
        } else if (filter === 'high-priority') {
            filteredNews = allNews.filter(news => news.priority === 'high');
        } else {
            filterType.value = filter;
        }

        currentPage = 1;
        applyFilters();
    }

    // Đặt lại bộ lọc
    function resetFilters() {
        filterType.value = 'all';
        filterLocation.value = 'all';
        filterTabs.forEach(tab => tab.classList.remove('filter-active'));
        document.querySelector('.filter-tab[data-filter="all"]').classList.add('filter-active');
        
        currentPage = 1;
        filteredNews = [...allNews];
        displayNews();
    }

    // Làm mới tin
    function refreshNews() {
        const originalHtml = refreshBtn.innerHTML;
        refreshBtn.innerHTML = '<i data-feather="refresh-cw" class="w-4 h-4 animate-spin"></i> Đang làm mới...';
        refreshBtn.disabled = true;
        
        setTimeout(() => {
            filteredNews = [...allNews];
            currentPage = 1;
            displayNews();
            
            refreshBtn.innerHTML = originalHtml;
            refreshBtn.disabled = false;
            feather.replace();
            
            showNotification('Đã cập nhật bản tin mới nhất!', 'success');
        }, 1000);
    }

    // Hiển thị phân trang
    function renderPagination() {
        const totalPages = Math.ceil(filteredNews.length / itemsPerPage);
        
        if (totalPages <= 1) {
            pagination.innerHTML = '';
            return;
        }

        let paginationHTML = '';
        
        // Nút Previous
        if (currentPage > 1) {
            paginationHTML += `
                <button class="pagination-btn px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition" data-page="${currentPage - 1}">
                    <i data-feather="chevron-left" class="w-4 h-4"></i>
                </button>
            `;
        }
        
        // Các trang
        for (let i = 1; i <= totalPages; i++) {
            if (i === currentPage) {
                paginationHTML += `
                    <button class="pagination-btn px-4 py-2 bg-red-500 text-white border border-red-500 rounded-md font-medium" data-page="${i}">
                        ${i}
                    </button>
                `;
            } else {
                paginationHTML += `
                    <button class="pagination-btn px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition" data-page="${i}">
                        ${i}
                    </button>
                `;
            }
        }
        
        // Nút Next
        if (currentPage < totalPages) {
            paginationHTML += `
                <button class="pagination-btn px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition" data-page="${currentPage + 1}">
                    <i data-feather="chevron-right" class="w-4 h-4"></i>
                </button>
            `;
        }
        
        pagination.innerHTML = paginationHTML;
        
        // Thêm event listeners
        document.querySelectorAll('.pagination-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                currentPage = parseInt(this.getAttribute('data-page'));
                displayNews();
                document.getElementById('news-section').scrollIntoView({ behavior: 'smooth' });
            });
        });
        
        feather.replace();
    }

    // Hiển thị thông báo
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg transition-all duration-300 transform translate-x-full ${
            type === 'success' ? 'bg-green-500 text-white' : 
            type === 'error' ? 'bg-red-500 text-white' : 
            'bg-blue-500 text-white'
        }`;
        notification.innerHTML = `
            <div class="flex items-center">
                <i data-feather="${type === 'success' ? 'check-circle' : type === 'error' ? 'alert-circle' : 'info'}" class="w-5 h-5 mr-2"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => notification.classList.remove('translate-x-full'), 100);
        setTimeout(() => {
            notification.classList.add('translate-x-full');
            setTimeout(() => document.body.removeChild(notification), 300);
        }, 3000);
        
        feather.replace();
    }

    // Utility functions
    function getTypeBadgeClass(type) {
        switch (type) {
            case 'fire': return 'bg-red-500';
            case 'flood': return 'bg-blue-500';
            case 'accident': return 'bg-orange-500';
            case 'disaster': return 'bg-purple-500';
            case 'assistance': return 'bg-green-500';
            case 'volunteer': return 'bg-teal-500';
            default: return 'bg-gray-500';
        }
    }

    function getTypeText(type) {
        switch (type) {
            case 'fire': return 'Cháy';
            case 'flood': return 'Lũ lụt';
            case 'accident': return 'Tai nạn';
            case 'disaster': return 'Thiên tai';
            case 'assistance': return 'Cứu trợ';
            case 'volunteer': return 'Tình nguyện';
            default: return 'Khác';
        }
    }

    function getPriorityBadgeClass(priority) {
        switch (priority) {
            case 'high': return 'bg-red-600';
            case 'medium': return 'bg-yellow-500';
            case 'low': return 'bg-green-500';
            default: return 'bg-gray-500';
        }
    }

    function getPriorityText(priority) {
        switch (priority) {
            case 'high': return 'Ưu tiên cao';
            case 'medium': return 'Ưu tiên trung';
            case 'low': return 'Ưu tiên thấp';
            default: return 'Không xác định';
        }
    }

    function getLocationText(location) {
        const locations = {
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
        return locations[location] || location;
    }

    // Khởi chạy
    initialize();
});


