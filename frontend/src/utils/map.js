// map.js - Code JavaScript hoàn chỉnh
document.addEventListener('DOMContentLoaded', function() {
    // Khởi tạo bản đồ
    const map = L.map('incident-map').setView([16.0, 108.0], 6);
    
    // Thêm tile layer (bản đồ nền)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 18
    }).addTo(map);

    // Dữ liệu sự cố
    const incidents = [
          {
            id: 'INC001',
            type: 'fire',
            status: 'active',
            priority: 'high',
            position: [21.0278, 105.8342],
            title: 'Cháy chung cư tại Cầu Giấy',
            address: '123 Trần Duy Hưng, Cầu Giấy, Hà Nội',
            province: 'hanoi',
            time: '15:30, 12/11/2023',
            description: 'Cháy lớn tại tầng 12 chung cư Golden West, nhiều người mắc kẹt bên trong. Lực lượng cứu hộ đang có mặt tại hiện trường.',
            reporter: {
                name: 'Nguyễn Văn A',
                phone: '0912 345 678',
                time: '15:25, 12/11/2023'
            },
            responseTeams: [
                { name: 'Đội PCCC Quận Cầu Giấy', status: 'Đang di chuyển' },
                { name: 'Xe cứu thương 115', status: 'Có mặt tại hiện trường' }
            ],
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
            position: [10.8231, 106.6297],
            title: 'Ngập nước nghiêm trọng tại Quận 1',
            address: 'Đường Nguyễn Huệ, Quận 1, TP.HCM',
            province: 'hochiminh',
            time: '14:15, 12/11/2023',
            description: 'Ngập nước sâu 0.5m sau cơn mưa lớn, nhiều phương tiện bị kẹt. Đội cứu hộ đang hỗ trợ người dân di chuyển.',
            reporter: {
                name: 'Trần Thị B',
                phone: '0934 567 890',
                time: '14:10, 12/11/2023'
            },
            responseTeams: [
                { name: 'Đội cứu hộ đô thị', status: 'Có mặt tại hiện trường' },
                { name: 'Cảnh sát giao thông', status: 'Phân luồng giao thông' }
            ],
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
            position: [16.0544, 108.2022],
            title: 'Tai nạn giao thông trên cầu Sông Hàn',
            address: 'Cầu Sông Hàn, Đà Nẵng',
            province: 'danang',
            time: '10:45, 12/11/2023',
            description: 'Va chạm giữa xe tải và xe máy, một người bị thương nặng. Sự cố đã được xử lý, giao thông thông suốt trở lại.',
            reporter: {
                name: 'Lê Văn C',
                phone: '0978 901 234',
                time: '10:40, 12/11/2023'
            },
            responseTeams: [
                { name: 'Xe cứu thương 115', status: 'Đã hoàn thành' },
                { name: 'Cảnh sát giao thông', status: 'Đã giải tỏa' }
            ],
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
            position: [16.4637, 107.5909],
            title: 'Sạt lở đất tại huyện A Lưới',
            address: 'Xã Hồng Vân, Huyện A Lưới, Thừa Thiên Huế',
            province: 'hue',
            time: '09:20, 12/11/2023',
            description: 'Sạt lở đất sau mưa lớn, nhiều hộ dân bị ảnh hưởng. Lực lượng cứu hộ đang tiến hành sơ tán người dân.',
            reporter: {
                name: 'Phạm Thị D',
                phone: '0901 234 567',
                time: '09:15, 12/11/2023'
            },
            responseTeams: [
                { name: 'Đội cứu hộ khẩn cấp', status: 'Đang sơ tán' },
                { name: 'Quân đội địa phương', status: 'Hỗ trợ' }
            ],
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
            position: [20.9814, 105.7942],
            title: 'Cháy nhà máy sản xuất',
            address: 'Khu công nghiệp Vĩnh Tuy, Hà Đông, Hà Nội',
            province: 'hanoi',
            time: '13:10, 12/11/2023',
            description: 'Cháy lớn tại nhà máy sản xuất linh kiện điện tử, khói đen bao phủ khu vực. Đang điều động thêm lực lượng.',
            reporter: {
                name: 'Hoàng Văn E',
                phone: '0987 654 321',
                time: '13:05, 12/11/2023'
            },
            responseTeams: [
                { name: 'Đội PCCC Hà Đông', status: 'Đang chữa cháy' },
                { name: 'Xe chữa cháy 114', status: 'Có mặt tại hiện trường' }
            ],
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
            position: [10.0454, 105.7469],
            title: 'Ngập lụt khu vực trung tâm',
            address: 'Đường 30/4, Quận Ninh Kiều, Cần Thơ',
            province: 'cantho',
            time: '11:30, 12/11/2023',
            description: 'Ngập nước sâu 0.7m do triều cường kết hợp mưa lớn. Đang tiến hành hút nước và phân luồng giao thông.',
            reporter: {
                name: 'Lý Thị F',
                phone: '0965 432 109',
                time: '11:25, 12/11/2023'
            },
            responseTeams: [
                { name: 'Đội thoát nước đô thị', status: 'Đang hút nước' },
                { name: 'Cảnh sát giao thông', status: 'Phân luồng' }
            ],
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
            position: [20.8561, 106.6820],
            title: 'Tai nạn liên hoàn trên cao tốc',
            address: 'Cao tốc Hà Nội - Hải Phòng, Km25',
            province: 'haiphong',
            time: '08:45, 12/11/2023',
            description: 'Va chạm liên hoàn giữa 5 xe ô tô, nhiều người bị thương. Đang điều động xe cứu thương.',
            reporter: {
                name: 'Vũ Văn G',
                phone: '0943 218 765',
                time: '08:40, 12/11/2023'
            },
            responseTeams: [
                { name: 'Xe cứu thương 115', status: 'Đang di chuyển' },
                { name: 'Cảnh sát giao thông', status: 'Có mặt tại hiện trường' }
            ],
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
            position: [20.1291, 105.3130],
            title: 'Lũ quét tại huyện miền núi',
            address: 'Xã Trung Sơn, Huyện Quan Hóa, Thanh Hóa',
            province: 'thanhhoa',
            time: '07:20, 12/11/2023',
            description: 'Lũ quét sau mưa lớn, nhiều nhà cửa bị cuốn trôi. Đang tiến hành cứu hộ khẩn cấp.',
            reporter: {
                name: 'Đặng Thị H',
                phone: '0918 765 432',
                time: '07:15, 12/11/2023'
            },
            responseTeams: [
                { name: 'Đội cứu hộ khẩn cấp', status: 'Đang cứu hộ' },
                { name: 'Quân đội địa phương', status: 'Hỗ trợ' }
            ],
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
            position: [19.0532, 104.8372],
            title: 'Cháy rừng tại Vườn Quốc gia',
            address: 'Vườn Quốc gia Pù Mát, Con Cuông, Nghệ An',
            province: 'nghean',
            time: '16:40, 11/11/2023',
            description: 'Cháy rừng quy mô nhỏ, đã được khống chế. Không có thiệt hại về người.',
            reporter: {
                name: 'Bùi Văn I',
                phone: '0976 543 210',
                time: '16:35, 11/11/2023'
            },
            responseTeams: [
                { name: 'Đội kiểm lâm', status: 'Đã hoàn thành' },
                { name: 'Lực lượng địa phương', status: 'Đã hỗ trợ' }
            ],
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
            position: [21.1861, 106.0763],
            title: 'Tai nạn xe container',
            address: 'Quốc lộ 1A, Thành phố Bắc Ninh',
            province: 'bacninh',
            time: '12:15, 12/11/2023',
            description: 'Xe container mất lái đâm vào nhà dân. Đang xử lý hiện trường.',
            reporter: {
                name: 'Ngô Văn K',
                phone: '0932 109 876',
                time: '12:10, 12/11/2023'
            },
            responseTeams: [
                { name: 'Cảnh sát giao thông', status: 'Có mặt tại hiện trường' },
                { name: 'Đội cứu hộ', status: 'Đang xử lý' }
            ],
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
            position: [10.3765, 106.3432],
            title: 'Ngập lụt diện rộng tại huyện Cái Bè',
            address: 'Huyện Cái Bè, Tiền Giang',
            province: 'tiengiang',
            time: '09:45, 12/11/2023',
            description: 'Ngập nước sâu 1m do vỡ đê, nhiều hộ dân bị cô lập. Đang cứu hộ khẩn cấp.',
            reporter: {
                name: 'Trần Văn L',
                phone: '0915 678 432',
                time: '09:40, 12/11/2023'
            },
            responseTeams: [
                { name: 'Đội cứu hộ lũ lụt', status: 'Đang cứu hộ' },
                { name: 'Quân đội địa phương', status: 'Hỗ trợ' }
            ],
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
            position: [11.9404, 108.4587],
            title: 'Sạt lở đất tại Đà Lạt',
            address: 'Đường Hồ Tùng Mậu, Đà Lạt, Lâm Đồng',
            province: 'lamdong',
            time: '08:30, 12/11/2023',
            description: 'Sạt lở đất sau mưa lớn, một số nhà bị vùi lấp. Đang tìm kiếm người mất tích.',
            reporter: {
                name: 'Phan Thị M',
                phone: '0986 543 210',
                time: '08:25, 12/11/2023'
            },
            responseTeams: [
                { name: 'Đội cứu hộ khẩn cấp', status: 'Đang tìm kiếm' },
                { name: 'Cảnh sát PCCC', status: 'Hỗ trợ' }
            ],
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
            position: [12.2388, 109.1967],
            title: 'Cháy kho xưởng tại Nha Trang',
            address: 'Khu công nghiệp Bắc Nha Trang, Khánh Hòa',
            province: 'khanhhoa',
            time: '16:20, 12/11/2023',
            description: 'Cháy lớn tại kho chứa vật liệu xây dựng, khói đen dày đặc. Đang chữa cháy.',
            reporter: {
                name: 'Lê Văn N',
                phone: '0975 432 109',
                time: '16:15, 12/11/2023'
            },
            responseTeams: [
                { name: 'Đội PCCC Nha Trang', status: 'Đang chữa cháy' },
                { name: 'Xe chữa cháy 114', status: 'Có mặt tại hiện trường' }
            ],
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
            position: [20.9401, 106.3330],
            title: 'Tai nạn giao thông trên Quốc lộ 5',
            address: 'Quốc lộ 5, Km45, Hải Dương',
            province: 'haiduong',
            time: '14:50, 12/11/2023',
            description: 'Va chạm giữa xe khách và xe tải, 5 người bị thương. Đang cấp cứu.',
            reporter: {
                name: 'Nguyễn Thị O',
                phone: '0967 890 123',
                time: '14:45, 12/11/2023'
            },
            responseTeams: [
                { name: 'Xe cứu thương 115', status: 'Đang cấp cứu' },
                { name: 'Cảnh sát giao thông', status: 'Có mặt tại hiện trường' }
            ],
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
            position: [9.1768, 105.1520],
            title: 'Ngập cục bộ tại trung tâm thành phố',
            address: 'Đường Phan Ngọc Hiển, TP. Cà Mau',
            province: 'camau',
            time: '10:15, 11/11/2023',
            description: 'Ngập nước nhẹ do triều cường, đã rút hết. Giao thông thông suốt.',
            reporter: {
                name: 'Võ Văn P',
                phone: '0933 444 555',
                time: '10:10, 11/11/2023'
            },
            responseTeams: [
                { name: 'Đội thoát nước', status: 'Đã hoàn thành' },
                { name: 'Công ty môi trường', status: 'Đã xử lý' }
            ],
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
            position: [10.0454, 105.7469],
            title: 'Cháy chợ nổi Cái Răng',
            address: 'Chợ nổi Cái Răng, Quận Cái Răng, Cần Thơ',
            province: 'cantho',
            time: '03:15, 13/11/2023',
            description: 'Cháy lớn tại khu vực chợ nổi, nhiều thuyền buôn bị thiêu rụi. Đang chữa cháy.',
            reporter: {
                name: 'Lâm Văn Q',
                phone: '0919 876 543',
                time: '03:10, 13/11/2023'
            },
            responseTeams: [
                { name: 'Đội PCCC Cần Thơ', status: 'Đang chữa cháy' },
                { name: 'Cảnh sát sông nước', status: 'Hỗ trợ' }
            ],
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
            position: [16.4637, 107.5909],
            title: 'Ngập lụt khu vực trung tâm thành phố Huế',
            address: 'Đường Lê Lợi, TP. Huế, Thừa Thiên Huế',
            province: 'hue',
            time: '17:45, 13/11/2023',
            description: 'Ngập nước sâu 0.8m do mưa lớn kết hợp triều cường. Đang hỗ trợ người dân.',
            reporter: {
                name: 'Trần Thị R',
                phone: '0935 678 901',
                time: '17:40, 13/11/2023'
            },
            responseTeams: [
                { name: 'Đội cứu hộ đô thị', status: 'Đang hỗ trợ' },
                { name: 'Cảnh sát giao thông', status: 'Phân luồng' }
            ],
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
            position: [21.0278, 105.8342],
            title: 'Tai nạn xe buýt trên cầu Vĩnh Tuy',
            address: 'Cầu Vĩnh Tuy, Hà Nội',
            province: 'hanoi',
            time: '08:20, 13/11/2023',
            description: 'Xe buýt mất lái đâm vào lan can cầu, nhiều hành khách bị thương. Đang cấp cứu.',
            reporter: {
                name: 'Nguyễn Văn S',
                phone: '0971 234 567',
                time: '08:15, 13/11/2023'
            },
            responseTeams: [
                { name: 'Xe cứu thương 115', status: 'Đang cấp cứu' },
                { name: 'Cảnh sát giao thông', status: 'Có mặt tại hiện trường' }
            ],
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
            position: [11.9404, 108.4587],
            title: 'Lở đất tại đèo Prenn',
            address: 'Đèo Prenn, Đà Lạt, Lâm Đồng',
            province: 'lamdong',
            time: '14:30, 13/11/2023',
            description: 'Sạt lở đất chặn hoàn toàn quốc lộ 20, nhiều xe bị mắc kẹt. Đang thông đường.',
            reporter: {
                name: 'Phạm Văn T',
                phone: '0982 345 678',
                time: '14:25, 13/11/2023'
            },
            responseTeams: [
                { name: 'Đội cứu hộ giao thông', status: 'Đang thông đường' },
                { name: 'Công ty xây dựng', status: 'Hỗ trợ' }
            ],
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
            position: [20.8561, 106.6820],
            title: 'Cháy kho hàng tại cảng',
            address: 'Cảng Hải Phòng, Quận Hải An, Hải Phòng',
            province: 'haiphong',
            time: '22:10, 13/11/2023',
            description: 'Cháy tại kho chứa hàng hóa xuất khẩu, thiệt hại ban đầu khoảng 2 tỷ đồng.',
            reporter: {
                name: 'Lê Thị U',
                phone: '0916 789 012',
                time: '22:05, 13/11/2023'
            },
            responseTeams: [
                { name: 'Đội PCCC Hải Phòng', status: 'Đang chữa cháy' },
                { name: 'Cảnh sát cảng', status: 'Hỗ trợ' }
            ],
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
            position: [10.3460, 107.0843],
            title: 'Ngập lụt khu du lịch Bãi Sau',
            address: 'Bãi Sau, TP. Vũng Tàu, Bà Rịa - Vũng Tàu',
            province: 'bariavungtau',
            time: '16:45, 13/11/2023',
            description: 'Ngập nước do triều cường dâng cao kết hợp mưa lớn.',
            reporter: {
                name: 'Võ Văn V',
                phone: '0936 789 123',
                time: '16:40, 13/11/2023'
            },
            responseTeams: [
                { name: 'Đội cứu hộ du lịch', status: 'Có mặt tại hiện trường' },
                { name: 'Cảnh sát biển', status: 'Hỗ trợ' }
            ],
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
            position: [21.1861, 106.0763],
            title: 'Tai nạn tại ngã tư trung tâm',
            address: 'Ngã tư đường Ngô Gia Tự - Lê Chân, TP. Bắc Ninh',
            province: 'bacninh',
            time: '11:30, 13/11/2023',
            description: 'Va chạm giữa xe container và xe máy, một người bị thương nhẹ.',
            reporter: {
                name: 'Nguyễn Thị W',
                phone: '0972 345 678',
                time: '11:25, 13/11/2023'
            },
            responseTeams: [
                { name: 'Xe cứu thương 115', status: 'Đã hoàn thành' },
                { name: 'Cảnh sát giao thông', status: 'Đã giải tỏa' }
            ],
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
            position: [15.8801, 108.3380],
            title: 'Lũ lụt tại huyện Đại Lộc',
            address: 'Huyện Đại Lộc, Quảng Nam',
            province: 'quangnam',
            time: '09:15, 13/11/2023',
            description: 'Lũ lụt diện rộng, nhiều xã bị cô lập, cần cứu hộ khẩn cấp.',
            reporter: {
                name: 'Trần Văn X',
                phone: '0917 890 123',
                time: '09:10, 13/11/2023'
            },
            responseTeams: [
                { name: 'Đội cứu hộ lũ lụt', status: 'Đang cứu hộ' },
                { name: 'Quân đội địa phương', status: 'Hỗ trợ' }
            ],
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
            position: [12.2388, 109.1967],
            title: 'Cháy khách sạn tại trung tâm Nha Trang',
            address: 'Khách sạn A, đường Trần Phú, TP. Nha Trang',
            province: 'khanhhoa',
            time: '02:30, 14/11/2023',
            description: 'Cháy lớn tại tầng 5 khách sạn, nhiều du khách mắc kẹt.',
            reporter: {
                name: 'Lê Thị Y',
                phone: '0983 456 789',
                time: '02:25, 14/11/2023'
            },
            responseTeams: [
                { name: 'Đội PCCC Nha Trang', status: 'Đang chữa cháy' },
                { name: 'Xe cứu thương 115', status: 'Có mặt tại hiện trường' }
            ],
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
            position: [10.3765, 106.3432],
            title: 'Ngập lụt khu vực nông thôn',
            address: 'Xã Mỹ Phước, Huyện Cái Bè, Tiền Giang',
            province: 'tiengiang',
            time: '13:20, 14/11/2023',
            description: 'Ngập nước sâu 0.6m ảnh hưởng đến sản xuất nông nghiệp.',
            reporter: {
                name: 'Phan Văn Z',
                phone: '0937 890 123',
                time: '13:15, 14/11/2023'
            },
            responseTeams: [
                { name: 'Đội cứu hộ nông nghiệp', status: 'Đang đánh giá' },
                { name: 'Chính quyền địa phương', status: 'Hỗ trợ' }
            ],
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
            position: [20.9401, 106.3330],
            title: 'Tai nạn xe tải chở hóa chất',
            address: 'Quốc lộ 5, Km38, Hải Dương',
            province: 'haiduong',
            time: '10:45, 14/11/2023',
            description: 'Xe tải chở hóa chất bị lật, có nguy cơ rò rỉ hóa chất.',
            reporter: {
                name: 'Nguyễn Văn AA',
                phone: '0918 901 234',
                time: '10:40, 14/11/2023'
            },
            responseTeams: [
                { name: 'Đội đặc biệt hóa chất', status: 'Đang xử lý' },
                { name: 'Cảnh sát môi trường', status: 'Hỗ trợ' }
            ],
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
            position: [19.0532, 104.8372],
            title: 'Lốc xoáy tại huyện Quỳnh Lưu',
            address: 'Huyện Quỳnh Lưu, Nghệ An',
            province: 'nghean',
            time: '15:30, 14/11/2023',
            description: 'Lốc xoáy làm tốc mái nhiều nhà dân, cây cối đổ ngã.',
            reporter: {
                name: 'Trần Thị BB',
                phone: '0984 567 890',
                time: '15:25, 14/11/2023'
            },
            responseTeams: [
                { name: 'Đội cứu hộ thiên tai', status: 'Đang cứu hộ' },
                { name: 'Quân đội địa phương', status: 'Hỗ trợ' }
            ],
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
            position: [11.5682, 108.9771],
            title: 'Cháy rừng phòng hộ',
            address: 'Rừng phòng hộ Ninh Sơn, Ninh Thuận',
            province: 'ninhthuan',
            time: '12:15, 14/11/2023',
            description: 'Cháy rừng quy mô nhỏ, đã được khống chế thành công.',
            reporter: {
                name: 'Lê Văn CC',
                phone: '0938 901 234',
                time: '12:10, 14/11/2023'
            },
            responseTeams: [
                { name: 'Đội kiểm lâm', status: 'Đã hoàn thành' },
                { name: 'Lực lượng địa phương', status: 'Đã hỗ trợ' }
            ],
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
            position: [9.6025, 105.9732],
            title: 'Ngập lụt khu vực ven biển',
            address: 'Huyện Trần Đề, Sóc Trăng',
            province: 'soctrang',
            time: '18:30, 14/11/2023',
            description: 'Ngập nước do triều cường dâng cao, ảnh hưởng đến nuôi trồng thủy sản.',
            reporter: {
                name: 'Phạm Thị D',
                phone: '0919 012 345',
                time: '18:25, 14/11/2023'
            },
            responseTeams: [
                { name: 'Đội cứu hộ thủy sản', status: 'Đang đánh giá' },
                { name: 'Chính quyền địa phương', status: 'Hỗ trợ' }
            ],
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
            position: [10.9574, 106.8429],
            title: 'Tai nạn xe khách trên cao tốc',
            address: 'Cao tốc TP.HCM - Long Thành - Dầu Giây, Km50',
            province: 'dongnai',
            time: '07:45, 15/11/2023',
            description: 'Xe khách va chạm với xe tải, 10 người bị thương.',
            reporter: {
                name: 'Nguyễn Văn EE',
                phone: '0973 456 789',
                time: '07:40, 15/11/2023'
            },
            responseTeams: [
                { name: 'Xe cứu thương 115', status: 'Đang cấp cứu' },
                { name: 'Cảnh sát giao thông', status: 'Có mặt tại hiện trường' }
            ],
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
            position: [14.1665, 108.9027],
            title: 'Sạt lở núi tại huyện Vĩnh Thạnh',
            address: 'Huyện Vĩnh Thạnh, Bình Định',
            province: 'binhdinh',
            time: '11:20, 15/11/2023',
            description: 'Sạt lở đất chặn đường liên xã, nhiều hộ dân bị cô lập.',
            reporter: {
                name: 'Trần Văn FF',
                phone: '0985 678 901',
                time: '11:15, 15/11/2023'
            },
            responseTeams: [
                { name: 'Đội cứu hộ khẩn cấp', status: 'Đang sơ tán' },
                { name: 'Quân đội địa phương', status: 'Hỗ trợ' }
            ],
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
            position: [21.5944, 105.8482],
            title: 'Cháy xưởng gỗ',
            address: 'Xưởng sản xuất đồ gỗ, TP. Thái Nguyên',
            province: 'thainguyen',
            time: '14:10, 15/11/2023',
            description: 'Cháy tại xưởng sản xuất đồ gỗ, thiệt hại khoảng 500 triệu đồng.',
            reporter: {
                name: 'Lê Thị GG',
                phone: '0939 012 345',
                time: '14:05, 15/11/2023'
            },
            responseTeams: [
                { name: 'Đội PCCC Thái Nguyên', status: 'Đang chữa cháy' },
                { name: 'Cảnh sát phòng cháy', status: 'Hỗ trợ' }
            ],
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
            position: [20.4260, 106.1717],
            title: 'Ngập cục bộ sau mưa',
            address: 'Đường Trần Hưng Đạo, TP. Nam Định',
            province: 'namdinh',
            time: '19:30, 15/11/2023',
            description: 'Ngập nước nhẹ do hệ thống thoát nước quá tải.',
            reporter: {
                name: 'Phạm Văn HH',
                phone: '0912 345 678',
                time: '19:25, 15/11/2023'
            },
            responseTeams: [
                { name: 'Đội thoát nước', status: 'Đang xử lý' },
                { name: 'Công ty môi trường', status: 'Hỗ trợ' }
            ],
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
            position: [10.6084, 106.6710],
            title: 'Tai nạn tàu thủy trên sông Vàm Cỏ',
            address: 'Sông Vàm Cỏ, Huyện Cần Giuộc, Long An',
            province: 'longan',
            time: '09:15, 16/11/2023',
            description: 'Va chạm giữa tàu chở hàng và tàu cá, 3 người mất tích.',
            reporter: {
                name: 'Nguyễn Thị II',
                phone: '0986 789 012',
                time: '09:10, 16/11/2023'
            },
            responseTeams: [
                { name: 'Đội cứu hộ sông nước', status: 'Đang tìm kiếm' },
                { name: 'Cảnh sát biển', status: 'Hỗ trợ' }
            ],
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
            position: [22.3364, 103.8444],
            title: 'Lở đất tại Sa Pa',
            address: 'Xã San Sả Hồ, Huyện Sa Pa, Lào Cai',
            province: 'laocai',
            time: '13:45, 16/11/2023',
            description: 'Sạt lở đất do mưa lớn kéo dài, nhiều nhà bị vùi lấp.',
            reporter: {
                name: 'Trần Văn JJ',
                phone: '0913 456 789',
                time: '13:40, 16/11/2023'
            },
            responseTeams: [
                { name: 'Đội cứu hộ khẩn cấp', status: 'Đang tìm kiếm' },
                { name: 'Quân đội địa phương', status: 'Hỗ trợ' }
            ],
            timeline: [
                { time: '13:40', action: 'Tiếp nhận báo cáo sự cố' },
                { time: '13:43', action: 'Cảnh báo và sơ tán người dân' },
                { time: '13:50', action: 'Triển khai lực lượng cứu hộ' }
            ]
        },
        {
            id: 'INC036',
            type: 'fire',
            status: 'active',
            priority: 'high',
            position: [10.7626, 106.6604],
            title: 'Cháy chung cư cao cấp Quận 3',
            address: '123 Lý Chính Thắng, Quận 3, TP.HCM',
            province: 'hochiminh',
            time: '20:15, 16/11/2023',
            description: 'Cháy bùng phát tại tầng hầm chung cư, khói lan nhanh các tầng. Đang sơ tán cư dân.',
            reporter: {
                name: 'Lâm Văn K',
                phone: '0914 567 890',
                time: '20:10, 16/11/2023'
            },
            responseTeams: [
                { name: 'Đội PCCC Quận 3', status: 'Đang chữa cháy' },
                { name: 'Xe cứu thương 115', status: 'Sẵn sàng hỗ trợ' }
            ],
            timeline: [
                { time: '20:10', action: 'Tiếp nhận báo cáo sự cố' },
                { time: '20:13', action: 'Điều động 4 xe chữa cháy' },
                { time: '20:20', action: 'Lực lượng có mặt tại hiện trường' }
            ]
        },
        {
            id: 'INC037',
            type: 'flood',
            status: 'active',
            priority: 'medium',
            position: [21.0245, 105.8412],
            title: 'Ngập nước khu vực Hồ Tây',
            address: 'Đường Thanh Niên, Quận Tây Hồ, Hà Nội',
            province: 'hanoi',
            time: '18:20, 16/11/2023',
            description: 'Ngập nước cục bộ do mưa lớn kéo dài, giao thông ùn tắc nghiêm trọng.',
            reporter: {
                name: 'Nguyễn Thị L',
                phone: '0934 567 123',
                time: '18:15, 16/11/2023'
            },
            responseTeams: [
                { name: 'Đội thoát nước Hà Nội', status: 'Đang hút nước' },
                { name: 'Cảnh sát giao thông', status: 'Phân luồng' }
            ],
            timeline: [
                { time: '18:15', action: 'Tiếp nhận báo cáo sự cố' },
                { time: '18:18', action: 'Cảnh báo người dân' },
                { time: '18:25', action: 'Triển khai lực lượng ứng phó' }
            ]
        },
        {
            id: 'INC038',
            type: 'accident',
            status: 'active',
            priority: 'high',
            position: [16.0680, 108.2120],
            title: 'Tai nạn xe du lịch trên đèo Hải Vân',
            address: 'Đèo Hải Vân, Đà Nẵng',
            province: 'danang',
            time: '14:30, 16/11/2023',
            description: 'Xe du lịch mất lái rơi xuống vực, nhiều hành khách mắc kẹt.',
            reporter: {
                name: 'Trần Văn M',
                phone: '0975 678 123',
                time: '14:25, 16/11/2023'
            },
            responseTeams: [
                { name: 'Đội cứu hộ đèo Hải Vân', status: 'Đang cứu hộ' },
                { name: 'Xe cứu thương 115', status: 'Có mặt tại hiện trường' }
            ],
            timeline: [
                { time: '14:25', action: 'Tiếp nhận báo cáo sự cố' },
                { time: '14:28', action: 'Điều động lực lượng cứu hộ' },
                { time: '14:35', action: 'Lực lượng có mặt tại hiện trường' }
            ]
        },
        {
            id: 'INC039',
            type: 'disaster',
            status: 'active',
            priority: 'high',
            position: [11.5639, 108.9970],
            title: 'Hạn hán nghiêm trọng tại Ninh Thuận',
            address: 'Huyện Ninh Sơn, Ninh Thuận',
            province: 'ninhthuan',
            time: '09:00, 17/11/2023',
            description: 'Hạn hán kéo dài, nhiều hộ dân thiếu nước sinh hoạt trầm trọng.',
            reporter: {
                name: 'Phạm Thị N',
                phone: '0987 654 123',
                time: '08:55, 17/11/2023'
            },
            responseTeams: [
                { name: 'Đội cấp nước khẩn cấp', status: 'Đang vận chuyển nước' },
                { name: 'Chính quyền địa phương', status: 'Hỗ trợ' }
            ],
            timeline: [
                { time: '08:55', action: 'Tiếp nhận báo cáo sự cố' },
                { time: '08:58', action: 'Đánh giá tình hình' },
                { time: '09:05', action: 'Triển khai lực lượng ứng phó' }
            ]
        },
        {
            id: 'INC040',
            type: 'fire',
            status: 'active',
            priority: 'medium',
            position: [20.4565, 106.1160],
            title: 'Cháy nhà dân do chập điện',
            address: 'Thôn 5, Xã Nam Cường, Nam Định',
            province: 'namdinh',
            time: '22:45, 17/11/2023',
            description: 'Cháy nhà nhà do chập điện, 2 người già bị mắc kẹt bên trong.',
            reporter: {
                name: 'Lê Văn O',
                phone: '0916 789 234',
                time: '22:40, 17/11/2023'
            },
            responseTeams: [
                { name: 'Đội PCCC địa phương', status: 'Đang chữa cháy' },
                { name: 'Xe cứu thương', status: 'Sẵn sàng hỗ trợ' }
            ],
            timeline: [
                { time: '22:40', action: 'Tiếp nhận báo cáo sự cố' },
                { time: '22:43', action: 'Điều động 2 xe chữa cháy' },
                { time: '22:50', action: 'Lực lượng có mặt tại hiện trường' }
            ]
        },
        {
            id: 'INC041',
            type: 'flood',
            status: 'active',
            priority: 'high',
            position: [9.9516, 105.6419],
            title: 'Vỡ đê sông Hậu',
            address: 'Xã Vĩnh Viễn, Huyện Long Mỹ, Hậu Giang',
            province: 'haugiang',
            time: '16:10, 17/11/2023',
            description: 'Đê sông Hậu bị vỡ, nước tràn vào nhiều khu dân cư.',
            reporter: {
                name: 'Võ Thị P',
                phone: '0935 678 234',
                time: '16:05, 17/11/2023'
            },
            responseTeams: [
                { name: 'Đội cứu hộ lũ lụt', status: 'Đang sơ tán' },
                { name: 'Quân đội địa phương', status: 'Hỗ trợ' }
            ],
            timeline: [
                { time: '16:05', action: 'Tiếp nhận báo cáo sự cố' },
                { time: '16:08', action: 'Cảnh báo khẩn cấp' },
                { time: '16:15', action: 'Triển khai lực lượng cứu hộ' }
            ]
        },
        {
            id: 'INC042',
            type: 'accident',
            status: 'resolved',
            priority: 'medium',
            position: [21.1565, 106.0580],
            title: 'Tai nạn tại ngã ba đường',
            address: 'Ngã ba đường Quang Trung - Nguyễn Du, Bắc Ninh',
            province: 'bacninh',
            time: '11:20, 18/11/2023',
            description: 'Va chạm giữa xe máy và xe đạp, một người bị thương nhẹ.',
            reporter: {
                name: 'Nguyễn Văn Q',
                phone: '0976 789 345',
                time: '11:15, 18/11/2023'
            },
            responseTeams: [
                { name: 'Xe cứu thương 115', status: 'Đã hoàn thành' },
                { name: 'Cảnh sát giao thông', status: 'Đã giải tỏa' }
            ],
            timeline: [
                { time: '11:15', action: 'Tiếp nhận báo cáo sự cố' },
                { time: '11:18', action: 'Điều động xe cứu thương' },
                { time: '11:25', action: 'Lực lượng có mặt tại hiện trường' },
                { time: '11:45', action: 'Sự cố đã được giải quyết' }
            ]
        },
        {
            id: 'INC043',
            type: 'disaster',
            status: 'active',
            priority: 'high',
            position: [22.7984, 104.9787],
            title: 'Lũ ống tại Mường Tè',
            address: 'Huyện Mường Tè, Lai Châu',
            province: 'laichau',
            time: '07:30, 18/11/2023',
            description: 'Lũ ống cuốn trôi nhiều nhà cửa, nhiều người mất tích.',
            reporter: {
                name: 'Trần Thị R',
                phone: '0988 765 432',
                time: '07:25, 18/11/2023'
            },
            responseTeams: [
                { name: 'Đội cứu hộ khẩn cấp', status: 'Đang tìm kiếm' },
                { name: 'Quân đội địa phương', status: 'Hỗ trợ' }
            ],
            timeline: [
                { time: '07:25', action: 'Tiếp nhận báo cáo sự cố' },
                { time: '07:28', action: 'Cảnh báo và sơ tán người dân' },
                { time: '07:35', action: 'Triển khai lực lượng cứu hộ' }
            ]
        },
        {
            id: 'INC044',
            type: 'fire',
            status: 'active',
            priority: 'high',
            position: [12.2596, 109.1033],
            title: 'Cháy tàu du lịch tại vịnh Nha Trang',
            address: 'Vịnh Nha Trang, Khánh Hòa',
            province: 'khanhhoa',
            time: '19:45, 18/11/2023',
            description: 'Cháy trên tàu du lịch chở 50 khách, đang sơ tán khẩn cấp.',
            reporter: {
                name: 'Lê Văn S',
                phone: '0917 890 456',
                time: '19:40, 18/11/2023'
            },
            responseTeams: [
                { name: 'Đội cứu hộ biển', status: 'Đang cứu hộ' },
                { name: 'Cảnh sát biển', status: 'Hỗ trợ' }
            ],
            timeline: [
                { time: '19:40', action: 'Tiếp nhận báo cáo sự cố' },
                { time: '19:43', action: 'Điều động tàu cứu hộ' },
                { time: '19:50', action: 'Lực lượng có mặt tại hiện trường' }
            ]
        },
        {
            id: 'INC045',
            type: 'flood',
            status: 'active',
            priority: 'medium',
            position: [10.2927, 105.7587],
            title: 'Ngập lụt khu vực nông thôn',
            address: 'Xã Mỹ Hòa, Huyện Tháp Mười, Đồng Tháp',
            province: 'dongthap',
            time: '14:15, 19/11/2023',
            description: 'Ngập nước ảnh hưởng đến sản xuất nông nghiệp.',
            reporter: {
                name: 'Phan Văn T',
                phone: '0936 789 456',
                time: '14:10, 19/11/2023'
            },
            responseTeams: [
                { name: 'Đội cứu hộ nông nghiệp', status: 'Đang đánh giá' },
                { name: 'Chính quyền địa phương', status: 'Hỗ trợ' }
            ],
            timeline: [
                { time: '14:10', action: 'Tiếp nhận báo cáo sự cố' },
                { time: '14:13', action: 'Đánh giá thiệt hại' },
                { time: '14:20', action: 'Triển khai lực lượng ứng phó' }
            ]
        },
        {
            id: 'INC046',
            type: 'accident',
            status: 'active',
            priority: 'high',
            position: [20.6781, 105.9786],
            title: 'Tai nạn xe container chở gas',
            address: 'Quốc lộ 6, Hòa Bình',
            province: 'hoabinh',
            time: '10:30, 19/11/2023',
            description: 'Xe container chở gas bị lật, có nguy cơ cháy nổ cao.',
            reporter: {
                name: 'Nguyễn Thị U',
                phone: '0918 901 567',
                time: '10:25, 19/11/2023'
            },
            responseTeams: [
                { name: 'Đội đặc biệt PCCC', status: 'Đang xử lý' },
                { name: 'Cảnh sát giao thông', status: 'Chặn đường' }
            ],
            timeline: [
                { time: '10:25', action: 'Tiếp nhận báo cáo sự cố' },
                { time: '10:28', action: 'Sơ tán khu vực xung quanh' },
                { time: '10:35', action: 'Triển khai lực lượng đặc biệt' }
            ]
        },
        {
            id: 'INC047',
            type: 'disaster',
            status: 'active',
            priority: 'high',
            position: [14.0583, 108.2772],
            title: 'Bão số 8 đổ bộ vào Quảng Ngãi',
            address: 'Huyện Bình Sơn, Quảng Ngãi',
            province: 'quangngai',
            time: '13:00, 19/11/2023',
            description: 'Bão mạnh cấp 12, gió giật cấp 14, gây thiệt hại nặng nề.',
            reporter: {
                name: 'Trần Văn V',
                phone: '0989 876 543',
                time: '12:55, 19/11/2023'
            },
            responseTeams: [
                { name: 'Đội cứu hộ bão lụt', status: 'Đang ứng phó' },
                { name: 'Quân đội địa phương', status: 'Hỗ trợ' }
            ],
            timeline: [
                { time: '12:55', action: 'Tiếp nhận báo cáo sự cố' },
                { time: '12:58', action: 'Cảnh báo khẩn cấp' },
                { time: '13:05', action: 'Triển khai lực lượng cứu hộ' }
            ]
        },
        {
            id: 'INC048',
            type: 'fire',
            status: 'resolved',
            priority: 'low',
            position: [11.9304, 108.4260],
            title: 'Cháy nhỏ tại quán cafe',
            address: 'Quán cafe A, Đà Lạt',
            province: 'lamdong',
            time: '21:30, 19/11/2023',
            description: 'Cháy nhỏ do nổ bình gas, đã được dập tắt.',
            reporter: {
                name: 'Lê Thị W',
                phone: '0937 890 567',
                time: '21:25, 19/11/2023'
            },
            responseTeams: [
                { name: 'Đội PCCC địa phương', status: 'Đã hoàn thành' },
                { name: 'Cảnh sát phòng cháy', status: 'Đã xử lý' }
            ],
            timeline: [
                { time: '21:25', action: 'Tiếp nhận báo cáo sự cố' },
                { time: '21:28', action: 'Điều động xe chữa cháy' },
                { time: '21:35', action: 'Dập tắt đám cháy' }
            ]
        },
        {
            id: 'INC049',
            type: 'flood',
            status: 'active',
            priority: 'medium',
            position: [9.1841, 105.1460],
            title: 'Triều cường dâng cao tại Cà Mau',
            address: 'Thành phố Cà Mau',
            province: 'camau',
            time: '17:45, 20/11/2023',
            description: 'Triều cường kết hợp mưa lớn gây ngập nhiều tuyến đường.',
            reporter: {
                name: 'Phạm Văn X',
                phone: '0919 012 678',
                time: '17:40, 20/11/2023'
            },
            responseTeams: [
                { name: 'Đội thoát nước', status: 'Đang xử lý' },
                { name: 'Công ty môi trường', status: 'Hỗ trợ' }
            ],
            timeline: [
                { time: '17:40', action: 'Tiếp nhận báo cáo sự cố' },
                { time: '17:43', action: 'Kiểm tra hệ thống thoát nước' },
                { time: '17:50', action: 'Triển khai lực lượng ứng phó' }
            ]
        },
        {
            id: 'INC050',
            type: 'accident',
            status: 'active',
            priority: 'high',
            position: [10.0331, 105.7832],
            title: 'Tai nạn tàu cao tốc trên sông',
            address: 'Sông Hậu, Cần Thơ',
            province: 'cantho',
            time: '08:20, 20/11/2023',
            description: 'Tàu cao tốc va chạm với phà, nhiều hành khách bị thương.',
            reporter: {
                name: 'Nguyễn Văn Y',
                phone: '0978 901 678',
                time: '08:15, 20/11/2023'
            },
            responseTeams: [
                { name: 'Đội cứu hộ sông nước', status: 'Đang cứu hộ' },
                { name: 'Xe cứu thương 115', status: 'Có mặt tại hiện trường' }
            ],
            timeline: [
                { time: '08:15', action: 'Tiếp nhận báo cáo sự cố' },
                { time: '08:18', action: 'Điều động tàu cứu hộ' },
                { time: '08:25', action: 'Lực lượng có mặt tại hiện trường' }
            ]
        },
        {
            id: 'INC051',
            type: 'fire',
            status: 'active',
            priority: 'high',
            position: [10.8231, 106.6297],
            title: 'Cháy trung tâm thương mại Quận 1',
            address: 'Trung tâm thương mại A, Quận 1, TP.HCM',
            province: 'hochiminh',
            time: '15:45, 20/11/2023',
            description: 'Cháy lớn tại tầng hầm để xe, khói lan toàn tòa nhà.',
            reporter: {
                name: 'Nguyễn Văn Z',
                phone: '0915 678 901',
                time: '15:40, 20/11/2023'
            },
            responseTeams: [
                { name: 'Đội PCCC Quận 1', status: 'Đang chữa cháy' },
                { name: 'Xe cứu thương 115', status: 'Sẵn sàng hỗ trợ' }
            ],
            timeline: [
                { time: '15:40', action: 'Tiếp nhận báo cáo sự cố' },
                { time: '15:43', action: 'Điều động 5 xe chữa cháy' },
                { time: '15:50', action: 'Lực lượng có mặt tại hiện trường' }
            ]
        },
        {
            id: 'INC052',
            type: 'flood',
            status: 'active',
            priority: 'medium',
            position: [21.0278, 105.8342],
            title: 'Ngập nước sau mưa lớn tại Cầu Giấy',
            address: 'Đường Xuân Thủy, Cầu Giấy, Hà Nội',
            province: 'hanoi',
            time: '19:30, 20/11/2023',
            description: 'Ngập nước sâu 0.4m, nhiều phương tiện chết máy.',
            reporter: {
                name: 'Trần Thị AA',
                phone: '0938 901 234',
                time: '19:25, 20/11/2023'
            },
            responseTeams: [
                { name: 'Đội thoát nước Hà Nội', status: 'Đang hút nước' },
                { name: 'Cảnh sát giao thông', status: 'Phân luồng' }
            ],
            timeline: [
                { time: '19:25', action: 'Tiếp nhận báo cáo sự cố' },
                { time: '19:28', action: 'Cảnh báo người dân' },
                { time: '19:35', action: 'Triển khai lực lượng ứng phó' }
            ]
        },
        {
            id: 'INC053',
            type: 'accident',
            status: 'active',
            priority: 'high',
            position: [16.0544, 108.2022],
            title: 'Tai nạn xe khách trên cầu Thuận Phước',
            address: 'Cầu Thuận Phước, Đà Nẵng',
            province: 'danang',
            time: '13:15, 21/11/2023',
            description: 'Xe khách va chạm với container, 8 người bị thương.',
            reporter: {
                name: 'Lê Văn BB',
                phone: '0979 012 345',
                time: '13:10, 21/11/2023'
            },
            responseTeams: [
                { name: 'Xe cứu thương 115', status: 'Đang cấp cứu' },
                { name: 'Cảnh sát giao thông', status: 'Có mặt tại hiện trường' }
            ],
            timeline: [
                { time: '13:10', action: 'Tiếp nhận báo cáo sự cố' },
                { time: '13:13', action: 'Điều động 3 xe cứu thương' },
                { time: '13:20', action: 'Lực lượng có mặt tại hiện trường' }
            ]
        },
        {
            id: 'INC054',
            type: 'disaster',
            status: 'active',
            priority: 'high',
            position: [12.2388, 109.1967],
            title: 'Sụt lún đất tại Cam Ranh',
            address: 'Khu vực Cam Ranh, Khánh Hòa',
            province: 'khanhhoa',
            time: '10:20, 21/11/2023',
            description: 'Sụt lún đất làm sập nhiều nhà dân.',
            reporter: {
                name: 'Phạm Thị CC',
                phone: '0980 123 456',
                time: '10:15, 21/11/2023'
            },
            responseTeams: [
                { name: 'Đội cứu hộ khẩn cấp', status: 'Đang tìm kiếm' },
                { name: 'Quân đội địa phương', status: 'Hỗ trợ' }
            ],
            timeline: [
                { time: '10:15', action: 'Tiếp nhận báo cáo sự cố' },
                { time: '10:18', action: 'Cảnh báo và sơ tán người dân' },
                { time: '10:25', action: 'Triển khai lực lượng cứu hộ' }
            ]
        },
        {
            id: 'INC055',
            type: 'fire',
            status: 'active',
            priority: 'medium',
            position: [20.4565, 106.1160],
            title: 'Cháy xưởng may',
            address: 'Xưởng may A, Nam Định',
            province: 'namdinh',
            time: '23:10, 21/11/2023',
            description: 'Cháy do chập điện tại xưởng may, thiệt hại ước tính 2 tỷ.',
            reporter: {
                name: 'Lê Văn DD',
                phone: '0916 789 345',
                time: '23:05, 21/11/2023'
            },
            responseTeams: [
                { name: 'Đội PCCC địa phương', status: 'Đang chữa cháy' },
                { name: 'Cảnh sát phòng cháy', status: 'Hỗ trợ' }
            ],
            timeline: [
                { time: '23:05', action: 'Tiếp nhận báo cáo sự cố' },
                { time: '23:08', action: 'Điều động 2 xe chữa cháy' },
                { time: '23:15', action: 'Lực lượng có mặt tại hiện trường' }
            ]
        },
        {
            id: 'INC056',
            type: 'flood',
            status: 'active',
            priority: 'high',
            position: [10.2927, 105.7587],
            title: 'Vỡ đê sông Tiền',
            address: 'Huyện Cao Lãnh, Đồng Tháp',
            province: 'dongthap',
            time: '17:40, 22/11/2023',
            description: 'Đê sông Tiền bị vỡ, nước tràn vào nhiều khu dân cư.',
            reporter: {
                name: 'Võ Thị EE',
                phone: '0939 012 456',
                time: '17:35, 22/11/2023'
            },
            responseTeams: [
                { name: 'Đội cứu hộ lũ lụt', status: 'Đang sơ tán' },
                { name: 'Quân đội địa phương', status: 'Hỗ trợ' }
            ],
            timeline: [
                { time: '17:35', action: 'Tiếp nhận báo cáo sự cố' },
                { time: '17:38', action: 'Cảnh báo khẩn cấp' },
                { time: '17:45', action: 'Triển khai lực lượng cứu hộ' }
            ]
        },
        {
            id: 'INC057',
            type: 'accident',
            status: 'resolved',
            priority: 'medium',
            position: [21.1565, 106.0580],
            title: 'Tai nạn giao thông tại ngã tư',
            address: 'Ngã tư đường Lê Lợi - Nguyễn Tất Thành, Bắc Ninh',
            province: 'bacninh',
            time: '12:30, 22/11/2023',
            description: 'Va chạm giữa ô tô con và xe máy, một người bị thương nhẹ.',
            reporter: {
                name: 'Nguyễn Văn FF',
                phone: '0977 890 456',
                time: '12:25, 22/11/2023'
            },
            responseTeams: [
                { name: 'Xe cứu thương 115', status: 'Đã hoàn thành' },
                { name: 'Cảnh sát giao thông', status: 'Đã giải tỏa' }
            ],
            timeline: [
                { time: '12:25', action: 'Tiếp nhận báo cáo sự cố' },
                { time: '12:28', action: 'Điều động xe cứu thương' },
                { time: '12:35', action: 'Lực lượng có mặt tại hiện trường' },
                { time: '13:00', action: 'Sự cố đã được giải quyết' }
            ]
        },
        {
            id: 'INC058',
            type: 'disaster',
            status: 'active',
            priority: 'high',
            position: [22.7984, 104.9787],
            title: 'Lũ quét tại Sìn Hồ',
            address: 'Huyện Sìn Hồ, Lai Châu',
            province: 'laichau',
            time: '08:45, 23/11/2023',
            description: 'Lũ quét cuốn trôi nhiều nhà cửa, nhiều người mất tích.',
            reporter: {
                name: 'Trần Thị GG',
                phone: '0981 234 567',
                time: '08:40, 23/11/2023'
            },
            responseTeams: [
                { name: 'Đội cứu hộ khẩn cấp', status: 'Đang tìm kiếm' },
                { name: 'Quân đội địa phương', status: 'Hỗ trợ' }
            ],
            timeline: [
                { time: '08:40', action: 'Tiếp nhận báo cáo sự cố' },
                { time: '08:43', action: 'Cảnh báo và sơ tán người dân' },
                { time: '08:50', action: 'Triển khai lực lượng cứu hộ' }
            ]
        },
        {
            id: 'INC059',
            type: 'fire',
            status: 'active',
            priority: 'high',
            position: [10.0331, 105.7832],
            title: 'Cháy chợ nông sản',
            address: 'Chợ nông sản Cần Thơ',
            province: 'cantho',
            time: '20:30, 23/11/2023',
            description: 'Cháy lớn tại khu vực chợ nông sản, nhiều sạp hàng bị thiêu rụi.',
            reporter: {
                name: 'Lê Văn HH',
                phone: '0917 890 567',
                time: '20:25, 23/11/2023'
            },
            responseTeams: [
                { name: 'Đội PCCC Cần Thơ', status: 'Đang chữa cháy' },
                { name: 'Cảnh sát phòng cháy', status: 'Hỗ trợ' }
            ],
            timeline: [
                { time: '20:25', action: 'Tiếp nhận báo cáo sự cố' },
                { time: '20:28', action: 'Điều động 4 xe chữa cháy' },
                { time: '20:35', action: 'Lực lượng có mặt tại hiện trường' }
            ]
        },
        {
            id: 'INC060',
            type: 'flood',
            status: 'active',
            priority: 'medium',
            position: [9.6025, 105.9732],
            title: 'Ngập lụt khu vực nuôi cá',
            address: 'Huyện Mỹ Xuyên, Sóc Trăng',
            province: 'soctrang',
            time: '15:20, 24/11/2023',
            description: 'Ngập nước ảnh hưởng đến diện tích nuôi cá.',
            reporter: {
                name: 'Phan Văn II',
                phone: '0940 123 567',
                time: '15:15, 24/11/2023'
            },
            responseTeams: [
                { name: 'Đội cứu hộ thủy sản', status: 'Đang đánh giá' },
                { name: 'Chính quyền địa phương', status: 'Hỗ trợ' }
            ],
            timeline: [
                { time: '15:15', action: 'Tiếp nhận báo cáo sự cố' },
                { time: '15:18', action: 'Đánh giá thiệt hại' },
                { time: '15:25', action: 'Triển khai lực lượng ứng phó' }
            ]
        },
        {
            id: 'INC061',
            type: 'accident',
            status: 'active',
            priority: 'high',
            position: [20.6781, 105.9786],
            title: 'Tai nạn xe chở xăng',
            address: 'Quốc lộ 6, Hòa Bình',
            province: 'hoabinh',
            time: '11:45, 24/11/2023',
            description: 'Xe chở xăng bị lật, có nguy cơ cháy nổ cao.',
            reporter: {
                name: 'Nguyễn Thị JJ',
                phone: '0918 901 678',
                time: '11:40, 24/11/2023'
            },
            responseTeams: [
                { name: 'Đội đặc biệt PCCC', status: 'Đang xử lý' },
                { name: 'Cảnh sát giao thông', status: 'Chặn đường' }
            ],
            timeline: [
                { time: '11:40', action: 'Tiếp nhận báo cáo sự cố' },
                { time: '11:43', action: 'Sơ tán khu vực xung quanh' },
                { time: '11:50', action: 'Triển khai lực lượng đặc biệt' }
            ]
        },
        {
            id: 'INC062',
            type: 'disaster',
            status: 'active',
            priority: 'high',
            position: [14.0583, 108.2772],
            title: 'Bão số 9 đổ bộ vào Phú Yên',
            address: 'Huyện Tuy An, Phú Yên',
            province: 'phuyen',
            time: '14:30, 24/11/2023',
            description: 'Bão mạnh cấp 13, gió giật cấp 15, gây thiệt hại lớn.',
            reporter: {
                name: 'Trần Văn KK',
                phone: '0982 345 678',
                time: '14:25, 24/11/2023'
            },
            responseTeams: [
                { name: 'Đội cứu hộ bão lụt', status: 'Đang ứng phó' },
                { name: 'Quân đội địa phương', status: 'Hỗ trợ' }
            ],
            timeline: [
                { time: '14:25', action: 'Tiếp nhận báo cáo sự cố' },
                { time: '14:28', action: 'Cảnh báo khẩn cấp' },
                { time: '14:35', action: 'Triển khai lực lượng cứu hộ' }
            ]
        },
        {
            id: 'INC063',
            type: 'fire',
            status: 'resolved',
            priority: 'low',
            position: [11.9304, 108.4260],
            title: 'Cháy nhỏ tại nhà hàng',
            address: 'Nhà hàng A, Đà Lạt',
            province: 'lamdong',
            time: '22:15, 24/11/2023',
            description: 'Cháy nhỏ do nổ bình gas trong bếp, đã được dập tắt.',
            reporter: {
                name: 'Lê Thị LL',
                phone: '0941 234 678',
                time: '22:10, 24/11/2023'
            },
            responseTeams: [
                { name: 'Đội PCCC địa phương', status: 'Đã hoàn thành' },
                { name: 'Cảnh sát phòng cháy', status: 'Đã xử lý' }
            ],
            timeline: [
                { time: '22:10', action: 'Tiếp nhận báo cáo sự cố' },
                { time: '22:13', action: 'Điều động xe chữa cháy' },
                { time: '22:20', action: 'Dập tắt đám cháy' }
            ]
        },
        {
            id: 'INC064',
            type: 'flood',
            status: 'active',
            priority: 'medium',
            position: [9.1841, 105.1460],
            title: 'Triều cường tại bờ biển Tây',
            address: 'Thành phố Cà Mau',
            province: 'camau',
            time: '18:30, 25/11/2023',
            description: 'Triều cường kết hợp gió mùa gây ngập nhiều tuyến đường.',
            reporter: {
                name: 'Phạm Văn MM',
                phone: '0920 123 789',
                time: '18:25, 25/11/2023'
            },
            responseTeams: [
                { name: 'Đội thoát nước', status: 'Đang xử lý' },
                { name: 'Công ty môi trường', status: 'Hỗ trợ' }
            ],
            timeline: [
                { time: '18:25', action: 'Tiếp nhận báo cáo sự cố' },
                { time: '18:28', action: 'Kiểm tra hệ thống thoát nước' },
                { time: '18:35', action: 'Triển khai lực lượng ứng phó' }
            ]
        },
        {
            id: 'INC065',
            type: 'accident',
            status: 'active',
            priority: 'high',
            position: [10.0331, 105.7832],
            title: 'Tai nạn tàu cá trên biển',
            address: 'Vùng biển Cần Thơ',
            province: 'cantho',
            time: '09:45, 25/11/2023',
            description: 'Tàu cá bị sóng đánh chìm, 5 ngư dân mất tích.',
            reporter: {
                name: 'Nguyễn Văn NN',
                phone: '0978 901 789',
                time: '09:40, 25/11/2023'
            },
            responseTeams: [
                { name: 'Đội cứu hộ biển', status: 'Đang tìm kiếm' },
                { name: 'Cảnh sát biển', status: 'Hỗ trợ' }
            ],
            timeline: [
                { time: '09:40', action: 'Tiếp nhận báo cáo sự cố' },
                { time: '09:43', action: 'Điều động tàu cứu hộ' },
                { time: '09:50', action: 'Lực lượng có mặt tại hiện trường' }
            ]
        },
        {
            id: 'INC066',
            type: 'fire',
            status: 'active',
            priority: 'high',
            position: [10.7626, 106.6604],
            title: 'Cháy cao ốc văn phòng',
            address: 'Cao ốc B, Quận 3, TP.HCM',
            province: 'hochiminh',
            time: '16:20, 25/11/2023',
            description: 'Cháy tại tầng 15 cao ốc văn phòng, nhiều người mắc kẹt.',
            reporter: {
                name: 'Lâm Văn OO',
                phone: '0915 678 012',
                time: '16:15, 25/11/2023'
            },
            responseTeams: [
                { name: 'Đội PCCC Quận 3', status: 'Đang chữa cháy' },
                { name: 'Xe cứu thương 115', status: 'Sẵn sàng hỗ trợ' }
            ],
            timeline: [
                { time: '16:15', action: 'Tiếp nhận báo cáo sự cố' },
                { time: '16:18', action: 'Điều động 6 xe chữa cháy' },
                { time: '16:25', action: 'Lực lượng có mặt tại hiện trường' }
            ]
        },
        {
            id: 'INC067',
            type: 'flood',
            status: 'active',
            priority: 'medium',
            position: [21.0245, 105.8412],
            title: 'Ngập nước khu vực Ba Đình',
            address: 'Đường Điện Biên Phủ, Ba Đình, Hà Nội',
            province: 'hanoi',
            time: '20:15, 25/11/2023',
            description: 'Ngập nước cục bộ do mưa lớn, giao thông ùn tắc.',
            reporter: {
                name: 'Nguyễn Thị PP',
                phone: '0967 890 123',
                time: '20:10, 25/11/2023'
            },
            responseTeams: [
                { name: 'Đội thoát nước Hà Nội', status: 'Đang hút nước' },
                { name: 'Cảnh sát giao thông', status: 'Phân luồng' }
            ],
            timeline: [
                { time: '20:10', action: 'Tiếp nhận báo cáo sự cố' },
                { time: '20:13', action: 'Cảnh báo người dân' },
                { time: '20:20', action: 'Triển khai lực lượng ứng phó' }
            ]
        },
        {
            id: 'INC068',
            type: 'accident',
            status: 'active',
            priority: 'high',
            position: [16.0680, 108.2120],
            title: 'Tai nạn xe tải chở hàng',
            address: 'Đường Nguyễn Hữu Thọ, Đà Nẵng',
            province: 'danang',
            time: '14:50, 26/11/2023',
            description: 'Xe tải mất lái đâm vào nhà dân, 2 người bị thương.',
            reporter: {
                name: 'Trần Văn QQ',
                phone: '0983 456 789',
                time: '14:45, 26/11/2023'
            },
            responseTeams: [
                { name: 'Xe cứu thương 115', status: 'Đang cấp cứu' },
                { name: 'Cảnh sát giao thông', status: 'Có mặt tại hiện trường' }
            ],
            timeline: [
                { time: '14:45', action: 'Tiếp nhận báo cáo sự cố' },
                { time: '14:48', action: 'Điều động 2 xe cứu thương' },
                { time: '14:55', action: 'Lực lượng có mặt tại hiện trường' }
            ]
        },
        {
            id: 'INC069',
            type: 'disaster',
            status: 'active',
            priority: 'high',
            position: [11.5639, 108.9970],
            title: 'Hạn hán tại Bác Ái',
            address: 'Huyện Bác Ái, Ninh Thuận',
            province: 'ninhthuan',
            time: '10:45, 26/11/2023',
            description: 'Hạn hán nghiêm trọng, nhiều hộ dân thiếu nước sinh hoạt.',
            reporter: {
                name: 'Phạm Thị RR',
                phone: '0984 567 890',
                time: '10:40, 26/11/2023'
            },
            responseTeams: [
                { name: 'Đội cấp nước khẩn cấp', status: 'Đang vận chuyển nước' },
                { name: 'Chính quyền địa phương', status: 'Hỗ trợ' }
            ],
            timeline: [
                { time: '10:40', action: 'Tiếp nhận báo cáo sự cố' },
                { time: '10:43', action: 'Đánh giá tình hình' },
                { time: '10:50', action: 'Triển khai lực lượng ứng phó' }
            ]
        },
        {
            id: 'INC070',
            type: 'fire',
            status: 'active',
            priority: 'medium',
            position: [20.4565, 106.1160],
            title: 'Cháy xưởng gỗ',
            address: 'Xưởng gỗ B, Nam Định',
            province: 'namdinh',
            time: '23:45, 26/11/2023',
            description: 'Cháy do chập điện tại xưởng gỗ, thiệt hại ước tính 1.5 tỷ.',
            reporter: {
                name: 'Lê Văn SS',
                phone: '0916 789 456',
                time: '23:40, 26/11/2023'
            },
            responseTeams: [
                { name: 'Đội PCCC địa phương', status: 'Đang chữa cháy' },
                { name: 'Cảnh sát phòng cháy', status: 'Hỗ trợ' }
            ],
            timeline: [
                { time: '23:40', action: 'Tiếp nhận báo cáo sự cố' },
                { time: '23:43', action: 'Điều động 3 xe chữa cháy' },
                { time: '23:50', action: 'Lực lượng có mặt tại hiện trường' }
            ]
        },
        {
            id: 'INC071',
            type: 'flood',
            status: 'active',
            priority: 'high',
            position: [10.2927, 105.7587],
            title: 'Vỡ đê sông Vàm Cỏ',
            address: 'Huyện Thủ Thừa, Long An',
            province: 'longan',
            time: '18:20, 27/11/2023',
            description: 'Đê sông Vàm Cỏ bị vỡ, nước tràn vào nhiều khu dân cư.',
            reporter: {
                name: 'Võ Thị TT',
                phone: '0943 456 890',
                time: '18:15, 27/11/2023'
            },
            responseTeams: [
                { name: 'Đội cứu hộ lũ lụt', status: 'Đang sơ tán' },
                { name: 'Quân đội địa phương', status: 'Hỗ trợ' }
            ],
            timeline: [
                { time: '18:15', action: 'Tiếp nhận báo cáo sự cố' },
                { time: '18:18', action: 'Cảnh báo khẩn cấp' },
                { time: '18:25', action: 'Triển khai lực lượng cứu hộ' }
            ]
        },
        {
            id: 'INC072',
            type: 'accident',
            status: 'resolved',
            priority: 'medium',
            position: [21.1565, 106.0580],
            title: 'Tai nạn giao thông tại vòng xoay',
            address: 'Vòng xoay đường Lê Văn Thịnh, Bắc Ninh',
            province: 'bacninh',
            time: '13:15, 27/11/2023',
            description: 'Va chạm giữa xe máy và xe đạp điện, một người bị thương nhẹ.',
            reporter: {
                name: 'Nguyễn Văn UU',
                phone: '0978 901 234',
                time: '13:10, 27/11/2023'
            },
            responseTeams: [
                { name: 'Xe cứu thương 115', status: 'Đã hoàn thành' },
                { name: 'Cảnh sát giao thông', status: 'Đã giải tỏa' }
            ],
            timeline: [
                { time: '13:10', action: 'Tiếp nhận báo cáo sự cố' },
                { time: '13:13', action: 'Điều động xe cứu thương' },
                { time: '13:20', action: 'Lực lượng có mặt tại hiện trường' },
                { time: '13:45', action: 'Sự cố đã được giải quyết' }
            ]
        },
        {
            id: 'INC073',
            type: 'disaster',
            status: 'active',
            priority: 'high',
            position: [22.7984, 104.9787],
            title: 'Lũ quét tại Mường Lay',
            address: 'Huyện Mường Lay, Điện Biên',
            province: 'dienbien',
            time: '09:30, 28/11/2023',
            description: 'Lũ quét cuốn trôi nhiều nhà cửa, nhiều người mất tích.',
            reporter: {
                name: 'Trần Thị VV',
                phone: '0985 678 901',
                time: '09:25, 28/11/2023'
            },
            responseTeams: [
                { name: 'Đội cứu hộ khẩn cấp', status: 'Đang tìm kiếm' },
                { name: 'Quân đội địa phương', status: 'Hỗ trợ' }
            ],
            timeline: [
                { time: '09:25', action: 'Tiếp nhận báo cáo sự cố' },
                { time: '09:28', action: 'Cảnh báo và sơ tán người dân' },
                { time: '09:35', action: 'Triển khai lực lượng cứu hộ' }
            ]
        },
        {
            id: 'INC074',
            type: 'fire',
            status: 'active',
            priority: 'high',
            position: [10.0331, 105.7832],
            title: 'Cháy chợ đầu mối',
            address: 'Chợ đầu mối Cần Thơ',
            province: 'cantho',
            time: '21:15, 28/11/2023',
            description: 'Cháy lớn tại khu vực chợ đầu mối, nhiều sạp hàng bị thiêu rụi.',
            reporter: {
                name: 'Lê Văn WW',
                phone: '0917 890 678',
                time: '21:10, 28/11/2023'
            },
            responseTeams: [
                { name: 'Đội PCCC Cần Thơ', status: 'Đang chữa cháy' },
                { name: 'Cảnh sát phòng cháy', status: 'Hỗ trợ' }
            ],
            timeline: [
                { time: '21:10', action: 'Tiếp nhận báo cáo sự cố' },
                { time: '21:13', action: 'Điều động 5 xe chữa cháy' },
                { time: '21:20', action: 'Lực lượng có mặt tại hiện trường' }
            ]
        },
        {
            id: 'INC075',
            type: 'flood',
            status: 'active',
            priority: 'medium',
            position: [9.6025, 105.9732],
            title: 'Ngập lụt khu vực nuôi tôm',
            address: 'Huyện Vĩnh Châu, Sóc Trăng',
            province: 'soctrang',
            time: '16:45, 29/11/2023',
            description: 'Ngập nước ảnh hưởng đến diện tích nuôi tôm.',
            reporter: {
                name: 'Phan Văn XX',
                phone: '0944 567 901',
                time: '16:40, 29/11/2023'
            },
            responseTeams: [
                { name: 'Đội cứu hộ thủy sản', status: 'Đang đánh giá' },
                { name: 'Chính quyền địa phương', status: 'Hỗ trợ' }
            ],
            timeline: [
                { time: '16:40', action: 'Tiếp nhận báo cáo sự cố' },
                { time: '16:43', action: 'Đánh giá thiệt hại' },
                { time: '16:50', action: 'Triển khai lực lượng ứng phó' }
            ]
        },
        {
            id: 'INC076',
            type: 'accident',
            status: 'active',
            priority: 'high',
            position: [20.6781, 105.9786],
            title: 'Tai nạn xe chở dầu',
            address: 'Quốc lộ 6, Hòa Bình',
            province: 'hoabinh',
            time: '12:20, 29/11/2023',
            description: 'Xe chở dầu bị lật, có nguy cơ cháy nổ cao.',
            reporter: {
                name: 'Nguyễn Thị YY',
                phone: '0918 901 789',
                time: '12:15, 29/11/2023'
            },
            responseTeams: [
                { name: 'Đội đặc biệt PCCC', status: 'Đang xử lý' },
                { name: 'Cảnh sát giao thông', status: 'Chặn đường' }
            ],
            timeline: [
                { time: '12:15', action: 'Tiếp nhận báo cáo sự cố' },
                { time: '12:18', action: 'Sơ tán khu vực xung quanh' },
                { time: '12:25', action: 'Triển khai lực lượng đặc biệt' }
            ]
        },
        {
            id: 'INC077',
            type: 'disaster',
            status: 'active',
            priority: 'high',
            position: [14.0583, 108.2772],
            title: 'Bão số 10 đổ bộ vào Khánh Hòa',
            address: 'Huyện Vạn Ninh, Khánh Hòa',
            province: 'khanhhoa',
            time: '15:45, 29/11/2023',
            description: 'Bão mạnh cấp 14, gió giật cấp 16, gây thiệt hại rất lớn.',
            reporter: {
                name: 'Trần Văn ZZ',
                phone: '0986 789 012',
                time: '15:40, 29/11/2023'
            },
            responseTeams: [
                { name: 'Đội cứu hộ bão lụt', status: 'Đang ứng phó' },
                { name: 'Quân đội địa phương', status: 'Hỗ trợ' }
            ],
            timeline: [
                { time: '15:40', action: 'Tiếp nhận báo cáo sự cố' },
                { time: '15:43', action: 'Cảnh báo khẩn cấp' },
                { time: '15:50', action: 'Triển khai lực lượng cứu hộ' }
            ]
        },
        {
            id: 'INC078',
            type: 'fire',
            status: 'resolved',
            priority: 'low',
            position: [11.9304, 108.4260],
            title: 'Cháy nhỏ tại khách sạn',
            address: 'Khách sạn B, Đà Lạt',
            province: 'lamdong',
            time: '23:30, 29/11/2023',
            description: 'Cháy nhỏ do chập điện trong phòng, đã được dập tắt.',
            reporter: {
                name: 'Lê Thị AAA',
                phone: '0945 678 012',
                time: '23:25, 29/11/2023'
            },
            responseTeams: [
                { name: 'Đội PCCC địa phương', status: 'Đã hoàn thành' },
                { name: 'Cảnh sát phòng cháy', status: 'Đã xử lý' }
            ],
            timeline: [
                { time: '23:25', action: 'Tiếp nhận báo cáo sự cố' },
                { time: '23:28', action: 'Điều động xe chữa cháy' },
                { time: '23:35', action: 'Dập tắt đám cháy' }
            ]
        },
        {
            id: 'INC079',
            type: 'flood',
            status: 'active',
            priority: 'medium',
            position: [9.1841, 105.1460],
            title: 'Triều cường tại bờ biển Đông',
            address: 'Thành phố Cà Mau',
            province: 'camau',
            time: '19:15, 30/11/2023',
            description: 'Triều cường kết hợp gió mùa gây ngập nhiều tuyến đường.',
            reporter: {
                name: 'Phạm Văn BBB',
                phone: '0921 234 890',
                time: '19:10, 30/11/2023'
            },
            responseTeams: [
                { name: 'Đội thoát nước', status: 'Đang xử lý' },
                { name: 'Công ty môi trường', status: 'Hỗ trợ' }
            ],
            timeline: [
                { time: '19:10', action: 'Tiếp nhận báo cáo sự cố' },
                { time: '19:13', action: 'Kiểm tra hệ thống thoát nước' },
                { time: '19:20', action: 'Triển khai lực lượng ứng phó' }
            ]
        },
        {
            id: 'INC080',
            type: 'accident',
            status: 'active',
            priority: 'high',
            position: [10.0331, 105.7832],
            title: 'Tai nạn tàu du lịch trên sông',
            address: 'Sông Hậu, Cần Thơ',
            province: 'cantho',
            time: '10:30, 30/11/2023',
            description: 'Tàu du lịch va chạm với cầu, nhiều hành khách bị thương.',
            reporter: {
                name: 'Nguyễn Văn CCC',
                phone: '0979 012 345',
                time: '10:25, 30/11/2023'
            },
            responseTeams: [
                { name: 'Đội cứu hộ sông nước', status: 'Đang cứu hộ' },
                { name: 'Xe cứu thương 115', status: 'Có mặt tại hiện trường' }
            ],
            timeline: [
                { time: '10:25', action: 'Tiếp nhận báo cáo sự cố' },
                { time: '10:28', action: 'Điều động tàu cứu hộ' },
                { time: '10:35', action: 'Lực lượng có mặt tại hiện trường' }
            ]
        },
        {
            id: 'INC081',
            type: 'fire',
            status: 'active',
            priority: 'high',
            position: [10.7626, 106.6604],
            title: 'Cháy trung tâm thương mại Quận 10',
            address: 'Trung tâm thương mại C, Quận 10, TP.HCM',
            province: 'hochiminh',
            time: '17:10, 01/12/2023',
            description: 'Cháy lớn tại tầng hầm để xe, khói lan toàn tòa nhà.',
            reporter: {
                name: 'Lâm Văn DDD',
                phone: '0915 678 123',
                time: '17:05, 01/12/2023'
            },
            responseTeams: [
                { name: 'Đội PCCC Quận 10', status: 'Đang chữa cháy' },
                { name: 'Xe cứu thương 115', status: 'Sẵn sàng hỗ trợ' }
            ],
            timeline: [
                { time: '17:05', action: 'Tiếp nhận báo cáo sự cố' },
                { time: '17:08', action: 'Điều động 6 xe chữa cháy' },
                { time: '17:15', action: 'Lực lượng có mặt tại hiện trường' }
            ]
        },
        {
            id: 'INC082',
            type: 'flood',
            status: 'active',
            priority: 'medium',
            position: [21.0245, 105.8412],
            title: 'Ngập nước sau mưa lớn tại Hoàn Kiếm',
            address: 'Đường Tràng Tiền, Hoàn Kiếm, Hà Nội',
            province: 'hanoi',
            time: '21:20, 01/12/2023',
            description: 'Ngập nước sâu 0.3m, nhiều phương tiện chết máy.',
            reporter: {
                name: 'Nguyễn Thị EEE',
                phone: '0946 789 123',
                time: '21:15, 01/12/2023'
            },
            responseTeams: [
                { name: 'Đội thoát nước Hà Nội', status: 'Đang hút nước' },
                { name: 'Cảnh sát giao thông', status: 'Phân luồng' }
            ],
            timeline: [
                { time: '21:15', action: 'Tiếp nhận báo cáo sự cố' },
                { time: '21:18', action: 'Cảnh báo người dân' },
                { time: '21:25', action: 'Triển khai lực lượng ứng phó' }
            ]
        },
        {
            id: 'INC083',
            type: 'accident',
            status: 'active',
            priority: 'high',
            position: [16.0680, 108.2120],
            title: 'Tai nạn xe container trên cầu Rồng',
            address: 'Cầu Rồng, Đà Nẵng',
            province: 'danang',
            time: '15:40, 02/12/2023',
            description: 'Xe container va chạm với xe buýt, 10 người bị thương.',
            reporter: {
                name: 'Trần Văn FFF',
                phone: '0987 890 123',
                time: '15:35, 02/12/2023'
            },
            responseTeams: [
                { name: 'Xe cứu thương 115', status: 'Đang cấp cứu' },
                { name: 'Cảnh sát giao thông', status: 'Có mặt tại hiện trường' }
            ],
            timeline: [
                { time: '15:35', action: 'Tiếp nhận báo cáo sự cố' },
                { time: '15:38', action: 'Điều động 4 xe cứu thương' },
                { time: '15:45', action: 'Lực lượng có mặt tại hiện trường' }
            ]
        },
        {
            id: 'INC084',
            type: 'disaster',
            status: 'active',
            priority: 'high',
            position: [11.5639, 108.9970],
            title: 'Hạn hán tại Ninh Phước',
            address: 'Huyện Ninh Phước, Ninh Thuận',
            province: 'ninhthuan',
            time: '11:30, 02/12/2023',
            description: 'Hạn hán nghiêm trọng, nhiều hộ dân thiếu nước sinh hoạt.',
            reporter: {
                name: 'Phạm Thị GGG',
                phone: '0988 901 234',
                time: '11:25, 02/12/2023'
            },
            responseTeams: [
                { name: 'Đội cấp nước khẩn cấp', status: 'Đang vận chuyển nước' },
                { name: 'Chính quyền địa phương', status: 'Hỗ trợ' }
            ],
            timeline: [
                { time: '11:25', action: 'Tiếp nhận báo cáo sự cố' },
                { time: '11:28', action: 'Đánh giá tình hình' },
                { time: '11:35', action: 'Triển khai lực lượng ứng phó' }
            ]
        },
        {
            id: 'INC085',
            type: 'fire',
            status: 'active',
            priority: 'medium',
            position: [20.4565, 106.1160],
            title: 'Cháy xưởng da',
            address: 'Xưởng da C, Nam Định',
            province: 'namdinh',
            time: '00:20, 03/12/2023',
            description: 'Cháy do chập điện tại xưởng da, thiệt hại ước tính 1 tỷ.',
            reporter: {
                name: 'Lê Văn HHH',
                phone: '0916 789 567',
                time: '00:15, 03/12/2023'
            },
            responseTeams: [
                { name: 'Đội PCCC địa phương', status: 'Đang chữa cháy' },
                { name: 'Cảnh sát phòng cháy', status: 'Hỗ trợ' }
            ],
            timeline: [
                { time: '00:15', action: 'Tiếp nhận báo cáo sự cố' },
                { time: '00:18', action: 'Điều động 2 xe chữa cháy' },
                { time: '00:25', action: 'Lực lượng có mặt tại hiện trường' }
            ]
        },
        {
            id: 'INC086',
            type: 'flood',
            status: 'active',
            priority: 'high',
            position: [10.2927, 105.7587],
            title: 'Vỡ đê sông Cửu Long',
            address: 'Huyện Châu Thành, Đồng Tháp',
            province: 'dongthap',
            time: '19:05, 03/12/2023',
            description: 'Đê sông Cửu Long bị vỡ, nước tràn vào nhiều khu dân cư.',
            reporter: {
                name: 'Võ Thị III',
                phone: '0947 890 234',
                time: '19:00, 03/12/2023'
            },
            responseTeams: [
                { name: 'Đội cứu hộ lũ lụt', status: 'Đang sơ tán' },
                { name: 'Quân đội địa phương', status: 'Hỗ trợ' }
            ],
            timeline: [
                { time: '19:00', action: 'Tiếp nhận báo cáo sự cố' },
                { time: '19:03', action: 'Cảnh báo khẩn cấp' },
                { time: '19:10', action: 'Triển khai lực lượng cứu hộ' }
            ]
        },
        {
            id: 'INC087',
            type: 'accident',
            status: 'resolved',
            priority: 'medium',
            position: [21.1565, 106.0580],
            title: 'Tai nạn giao thông tại đường vành đai',
            address: 'Đường vành đai Bắc Ninh',
            province: 'bacninh',
            time: '14:25, 04/12/2023',
            description: 'Va chạm giữa xe tải và xe máy, một người bị thương nhẹ.',
            reporter: {
                name: 'Nguyễn Văn JJJ',
                phone: '0979 012 456',
                time: '14:20, 04/12/2023'
            },
            responseTeams: [
                { name: 'Xe cứu thương 115', status: 'Đã hoàn thành' },
                { name: 'Cảnh sát giao thông', status: 'Đã giải tỏa' }
            ],
            timeline: [
                { time: '14:20', action: 'Tiếp nhận báo cáo sự cố' },
                { time: '14:23', action: 'Điều động xe cứu thương' },
                { time: '14:30', action: 'Lực lượng có mặt tại hiện trường' },
                { time: '15:00', action: 'Sự cố đã được giải quyết' }
            ]
        },
        {
            id: 'INC088',
            type: 'disaster',
            status: 'active',
            priority: 'high',
            position: [22.7984, 104.9787],
            title: 'Lũ quét tại Tuần Giáo',
            address: 'Huyện Tuần Giáo, Điện Biên',
            province: 'dienbien',
            time: '10:15, 04/12/2023',
            description: 'Lũ quét cuốn trôi nhiều nhà cửa, nhiều người mất tích.',
            reporter: {
                name: 'Trần Thị KKK',
                phone: '0989 012 345',
                time: '10:10, 04/12/2023'
            },
            responseTeams: [
                { name: 'Đội cứu hộ khẩn cấp', status: 'Đang tìm kiếm' },
                { name: 'Quân đội địa phương', status: 'Hỗ trợ' }
            ],
            timeline: [
                { time: '10:10', action: 'Tiếp nhận báo cáo sự cố' },
                { time: '10:13', action: 'Cảnh báo và sơ tán người dân' },
                { time: '10:20', action: 'Triển khai lực lượng cứu hộ' }
            ]
        },
        {
            id: 'INC089',
            type: 'fire',
            status: 'active',
            priority: 'high',
            position: [10.0331, 105.7832],
            title: 'Cháy chợ hải sản',
            address: 'Chợ hải sản Cần Thơ',
            province: 'cantho',
            time: '22:45, 04/12/2023',
            description: 'Cháy lớn tại khu vực chợ hải sản, nhiều sạp hàng bị thiêu rụi.',
            reporter: {
                name: 'Lê Văn LLL',
                phone: '0917 890 789',
                time: '22:40, 04/12/2023'
            },
            responseTeams: [
                { name: 'Đội PCCC Cần Thơ', status: 'Đang chữa cháy' },
                { name: 'Cảnh sát phòng cháy', status: 'Hỗ trợ' }
            ],
            timeline: [
                { time: '22:40', action: 'Tiếp nhận báo cáo sự cố' },
                { time: '22:43', action: 'Điều động 4 xe chữa cháy' },
                { time: '22:50', action: 'Lực lượng có mặt tại hiện trường' }
            ]
        },
        {
            id: 'INC090',
            type: 'flood',
            status: 'active',
            priority: 'medium',
            position: [9.6025, 105.9732],
            title: 'Ngập lụt khu vực nuôi tôm sú',
            address: 'Huyện Mỹ Tú, Sóc Trăng',
            province: 'soctrang',
            time: '17:30, 05/12/2023',
            description: 'Ngập nước ảnh hưởng đến diện tích nuôi tôm sú.',
            reporter: {
                name: 'Phan Văn MMM',
                phone: '0948 901 345',
                time: '17:25, 05/12/2023'
            },
            responseTeams: [
                { name: 'Đội cứu hộ thủy sản', status: 'Đang đánh giá' },
                { name: 'Chính quyền địa phương', status: 'Hỗ trợ' }
            ],
            timeline: [
                { time: '17:25', action: 'Tiếp nhận báo cáo sự cố' },
                { time: '17:28', action: 'Đánh giá thiệt hại' },
                { time: '17:35', action: 'Triển khai lực lượng ứng phó' }
            ]
        },
        {
            id: 'INC091',
            type: 'accident',
            status: 'active',
            priority: 'high',
            position: [20.6781, 105.9786],
            title: 'Tai nạn xe chở gas',
            address: 'Quốc lộ 6, Hòa Bình',
            province: 'hoabinh',
            time: '13:10, 05/12/2023',
            description: 'Xe chở gas bị lật, có nguy cơ cháy nổ cao.',
            reporter: {
                name: 'Nguyễn Thị NNN',
                phone: '0918 901 890',
                time: '13:05, 05/12/2023'
            },
            responseTeams: [
                { name: 'Đội đặc biệt PCCC', status: 'Đang xử lý' },
                { name: 'Cảnh sát giao thông', status: 'Chặn đường' }
            ],
            timeline: [
                { time: '13:05', action: 'Tiếp nhận báo cáo sự cố' },
                { time: '13:08', action: 'Sơ tán khu vực xung quanh' },
                { time: '13:15', action: 'Triển khai lực lượng đặc biệt' }
            ]
        },
        {
            id: 'INC092',
            type: 'disaster',
            status: 'active',
            priority: 'high',
            position: [14.0583, 108.2772],
            title: 'Bão số 11 đổ bộ vào Bình Định',
            address: 'Huyện Hoài Nhơn, Bình Định',
            province: 'binhdinh',
            time: '16:20, 05/12/2023',
            description: 'Bão mạnh cấp 15, gió giật cấp 17, gây thiệt hại rất lớn.',
            reporter: {
                name: 'Trần Văn OOO',
                phone: '0990 123 456',
                time: '16:15, 05/12/2023'
            },
            responseTeams: [
                { name: 'Đội cứu hộ bão lụt', status: 'Đang ứng phó' },
                { name: 'Quân đội địa phương', status: 'Hỗ trợ' }
            ],
            timeline: [
                { time: '16:15', action: 'Tiếp nhận báo cáo sự cố' },
                { time: '16:18', action: 'Cảnh báo khẩn cấp' },
                { time: '16:25', action: 'Triển khai lực lượng cứu hộ' }
            ]
        },
        {
            id: 'INC093',
            type: 'fire',
            status: 'resolved',
            priority: 'low',
            position: [11.9304, 108.4260],
            title: 'Cháy nhỏ tại nhà dân',
            address: 'Nhà dân Đà Lạt',
            province: 'lamdong',
            time: '00:45, 06/12/2023',
            description: 'Cháy nhỏ do chập điện trong nhà, đã được dập tắt.',
            reporter: {
                name: 'Phan Thị PPP',
                phone: '0949 012 456',
                time: '00:40, 06/12/2023'
            },
            responseTeams: [
                { name: 'Đội PCCC địa phương', status: 'Đã hoàn thành' },
                { name: 'Cảnh sát phòng cháy', status: 'Đã xử lý' }
            ],
            timeline: [
                { time: '00:40', action: 'Tiếp nhận báo cáo sự cố' },
                { time: '00:43', action: 'Điều động xe chữa cháy' },
                { time: '00:50', action: 'Dập tắt đám cháy' }
            ]
        },
        {
            id: 'INC094',
            type: 'flood',
            status: 'active',
            priority: 'medium',
            position: [9.1841, 105.1460],
            title: 'Triều cường tại bờ biển Nam',
            address: 'Thành phố Cà Mau',
            province: 'camau',
            time: '20:05, 06/12/2023',
            description: 'Triều cường kết hợp gió mùa gây ngập nhiều tuyến đường.',
            reporter: {
                name: 'Phạm Văn QQQ',
                phone: '0922 345 901',
                time: '20:00, 06/12/2023'
            },
            responseTeams: [
                { name: 'Đội thoát nước', status: 'Đang xử lý' },
                { name: 'Công ty môi trường', status: 'Hỗ trợ' }
            ],
            timeline: [
                { time: '20:00', action: 'Tiếp nhận báo cáo sự cố' },
                { time: '20:03', action: 'Kiểm tra hệ thống thoát nước' },
                { time: '20:10', action: 'Triển khai lực lượng ứng phó' }
            ]
        },
        {
            id: 'INC095',
            type: 'accident',
            status: 'active',
            priority: 'high',
            position: [10.0331, 105.7832],
            title: 'Tai nạn tàu chở hàng trên sông',
            address: 'Sông Hậu, Cần Thơ',
            province: 'cantho',
            time: '11:15, 07/12/2023',
            description: 'Tàu chở hàng va chạm với cầu, nhiều hành khách bị thương.',
            reporter: {
                name: 'Nguyễn Văn RRR',
                phone: '0980 123 567',
                time: '11:10, 07/12/2023'
            },
            responseTeams: [
                { name: 'Đội cứu hộ sông nước', status: 'Đang cứu hộ' },
                { name: 'Xe cứu thương 115', status: 'Có mặt tại hiện trường' }
            ],
            timeline: [
                { time: '11:10', action: 'Tiếp nhận báo cáo sự cố' },
                { time: '11:13', action: 'Điều động tàu cứu hộ' },
                { time: '11:20', action: 'Lực lượng có mặt tại hiện trường' }
            ]
        },
        {
            id: 'INC096',
            type: 'fire',
            status: 'active',
            priority: 'high',
            position: [10.7626, 106.6604],
            title: 'Cháy trung tâm thương mại Quận 5',
            address: 'Trung tâm thương mại D, Quận 5, TP.HCM',
            province: 'hochiminh',
            time: '18:30, 07/12/2023',
            description: 'Cháy lớn tại tầng hầm để xe, khói lan toàn tòa nhà.',
            reporter: {
                name: 'Lâm Văn SSS',
                phone: '0915 678 234',
                time: '18:25, 07/12/2023'
            },
            responseTeams: [
                { name: 'Đội PCCC Quận 5', status: 'Đang chữa cháy' },
                { name: 'Xe cứu thương 115', status: 'Sẵn sàng hỗ trợ' }
            ],
            timeline: [
                { time: '18:25', action: 'Tiếp nhận báo cáo sự cố' },
                { time: '18:28', action: 'Điều động 5 xe chữa cháy' },
                { time: '18:35', action: 'Lực lượng có mặt tại hiện trường' }
            ]
        },
        {
            id: 'INC097',
            type: 'flood',
            status: 'active',
            priority: 'medium',
            position: [21.0245, 105.8412],
            title: 'Ngập nước sau mưa lớn tại Đống Đa',
            address: 'Đường Tây Sơn, Đống Đa, Hà Nội',
            province: 'hanoi',
            time: '22:10, 07/12/2023',
            description: 'Ngập nước sâu 0.2m, nhiều phương tiện chết máy.',
            reporter: {
                name: 'Nguyễn Thị TTT',
                phone: '0950 123 567',
                time: '22:05, 07/12/2023'
            },
            responseTeams: [
                { name: 'Đội thoát nước Hà Nội', status: 'Đang hút nước' },
                { name: 'Cảnh sát giao thông', status: 'Phân luồng' }
            ],
            timeline: [
                { time: '22:05', action: 'Tiếp nhận báo cáo sự cố' },
                { time: '22:08', action: 'Cảnh báo người dân' },
                { time: '22:15', action: 'Triển khai lực lượng ứng phó' }
            ]
        },
        {
            id: 'INC098',
            type: 'accident',
            status: 'active',
            priority: 'high',
            position: [16.0680, 108.2120],
            title: 'Tai nạn xe khách trên cầu Sông Hàn',
            address: 'Cầu Sông Hàn, Đà Nẵng',
            province: 'danang',
            time: '16:55, 08/12/2023',
            description: 'Xe khách va chạm với xe tải, 12 người bị thương.',
            reporter: {
                name: 'Trần Văn UUU',
                phone: '0991 234 567',
                time: '16:50, 08/12/2023'
            },
            responseTeams: [
                { name: 'Xe cứu thương 115', status: 'Đang cấp cứu' },
                { name: 'Cảnh sát giao thông', status: 'Có mặt tại hiện trường' }
            ],
            timeline: [
                { time: '16:50', action: 'Tiếp nhận báo cáo sự cố' },
                { time: '16:53', action: 'Điều động 3 xe cứu thương' },
                { time: '17:00', action: 'Lực lượng có mặt tại hiện trường' }
            ]
        },
        {
            id: 'INC099',
            type: 'disaster',
            status: 'active',
            priority: 'high',
            position: [11.5639, 108.9970],
            title: 'Hạn hán tại Thuận Bắc',
            address: 'Huyện Thuận Bắc, Ninh Thuận',
            province: 'ninhthuan',
            time: '12:45, 08/12/2023',
            description: 'Hạn hán nghiêm trọng, nhiều hộ dân thiếu nước sinh hoạt.',
            reporter: {
                name: 'Phạm Thị VVV',
                phone: '0992 345 678',
                time: '12:40, 08/12/2023'
            },
            responseTeams: [
                { name: 'Đội cấp nước khẩn cấp', status: 'Đang vận chuyển nước' },
                { name: 'Chính quyền địa phương', status: 'Hỗ trợ' }
            ],
            timeline: [
                { time: '12:40', action: 'Tiếp nhận báo cáo sự cố' },
                { time: '12:43', action: 'Đánh giá tình hình' },
                { time: '12:50', action: 'Triển khai lực lượng ứng phó' }
            ]
        },
        {
            id: 'INC100',
            type: 'fire',
            status: 'active',
            priority: 'medium',
            position: [20.4565, 106.1160],
            title: 'Cháy xưởng nhựa',
            address: 'Xưởng nhựa D, Nam Định',
            province: 'namdinh',
            time: '01:30, 09/12/2023',
            description: 'Cháy do chập điện tại xưởng nhựa, thiệt hại ước tính 800 triệu.',
            reporter: {
                name: 'Lê Văn WWW',
                phone: '0916 789 678',
                time: '01:25, 09/12/2023'
            },
            responseTeams: [
                { name: 'Đội PCCC địa phương', status: 'Đang chữa cháy' },
                { name: 'Cảnh sát phòng cháy', status: 'Hỗ trợ' }
            ],
            timeline: [
                { time: '01:25', action: 'Tiếp nhận báo cáo sự cố' },
                { time: '01:28', action: 'Điều động 2 xe chữa cháy' },
                { time: '01:35', action: 'Lực lượng có mặt tại hiện trường' }
            ]
        }
    ];

    // Biến lưu trữ các marker
    let markers = [];
    let currentFilteredIncidents = [...incidents];
    let currentPulseCircle = null;

    // Hàm tạo icon cho marker dựa trên loại sự cố và trạng thái
    function createIncidentIcon(incident) {
        const iconColors = {
            fire: '#dc2626',
            flood: '#2563eb',
            accident: '#ea580c',
            disaster: '#7c3aed'
        };

        const statusColors = {
            active: '#ef4444',
            resolved: '#10b981'
        };

        const color = iconColors[incident.type] || '#6b7280';
        const pulse = incident.status === 'active' ? 'incident-marker-pulse' : '';

        return L.divIcon({
            className: `incident-marker ${pulse}`,
            html: `
                <div class="incident-marker-inner" style="background-color: ${color}; border-color: ${statusColors[incident.status] || '#6b7280'};">
                    <i data-feather="${getIconForType(incident.type)}"></i>
                </div>
            `,
            iconSize: [32, 32],
            iconAnchor: [16, 16]
        });
    }

    // Hàm lấy icon tương ứng với loại sự cố
    function getIconForType(type) {
        const icons = {
            fire: 'flame',
            flood: 'droplet',
            accident: 'activity',
            disaster: 'alert-octagon'
        };
        return icons[type] || 'alert-circle';
    }

    // Hàm hiển thị tất cả sự cố lên bản đồ
    function displayIncidentsOnMap(incidentsToShow) {
        // Xóa các marker cũ
        markers.forEach(marker => map.removeLayer(marker));
        markers = [];

        // Thêm marker mới
        incidentsToShow.forEach(incident => {
            const marker = L.marker(incident.position, {
                icon: createIncidentIcon(incident)
            }).addTo(map);

            // Thêm popup thông tin
            marker.bindPopup(`
                <div class="incident-popup">
                    <h3 class="font-bold text-lg mb-2">${incident.title}</h3>
                    <div class="flex items-center mb-2">
                        <span class="inline-block px-2 py-1 text-xs rounded-full ${getStatusClass(incident.status)}">
                            ${getStatusText(incident.status)}
                        </span>
                        <span class="inline-block px-2 py-1 text-xs rounded-full ml-2 ${getPriorityClass(incident.priority)}">
                            ${getPriorityText(incident.priority)}
                        </span>
                    </div>
                    <p class="text-sm text-gray-600 mb-2">${incident.address}</p>
                    <p class="text-sm mb-3">${incident.description.substring(0, 100)}...</p>
                    <div class="flex space-x-2">
                        <button onclick="focusOnEmergency('${incident.id}')" 
                                class="flex-1 bg-blue-500 text-white py-2 px-3 rounded-lg hover:bg-blue-600 transition text-sm">
                            🔍 Phóng to
                        </button>
                        <button onclick="showIncidentDetail('${incident.id}')" 
                                class="flex-1 bg-red-500 text-white py-2 px-3 rounded-lg hover:bg-red-600 transition text-sm">
                            📋 Chi tiết
                        </button>
                    </div>
                </div>
            `);

            // Lưu thông tin sự cố vào marker
            marker.incidentData = incident;
            markers.push(marker);
        });

        // Cập nhật thống kê
        updateStatistics(incidentsToShow);
    }

    // Hàm fly to emergency location với hiệu ứng
    window.focusOnEmergency = function(incidentId) {
        const incident = incidents.find(inc => inc.id === incidentId);
        if (!incident) return;

        const [lat, lng] = incident.position;
        
        // Fly to location với hiệu ứng mượt
        map.flyTo([lat, lng], 14, {
            duration: 1,
            easeLinearity: 0.25
        });

        // Tìm và mở popup marker
        const marker = markers.find(m => m.incidentData.id === incidentId);
        if (marker) {
            setTimeout(() => {
                marker.openPopup();
                
                // Thêm hiệu ứng highlight cho marker
                const iconElement = marker.getElement();
                if (iconElement) {
                    iconElement.classList.add('incident-marker-highlight');
                    setTimeout(() => {
                        iconElement.classList.remove('incident-marker-highlight');
                    }, 3000);
                }
            }, 1000);
        }

        // Xóa circle pulse cũ nếu có
        if (currentPulseCircle) {
            map.removeLayer(currentPulseCircle);
        }

        // Thêm circle pulse effect mới
        currentPulseCircle = L.circle([lat, lng], {
            color: '#dc2626',
            fillColor: '#fecaca',
            fillOpacity: 0.3,
            radius: 100
        }).addTo(map);

        // Animation pulse
        let radius = 100;
        const animatePulse = () => {
            radius += 15;
            currentPulseCircle.setRadius(radius);
            
            if (radius < 250) {
                requestAnimationFrame(animatePulse);
            }
        };
        animatePulse();

        // Tự động xóa circle sau 2 giây
        setTimeout(() => {
            if (currentPulseCircle) {
                map.removeLayer(currentPulseCircle);
                currentPulseCircle = null;
            }
        }, 2000);
    };

    // Hàm lọc sự cố
    function filterIncidents() {
        const provinceFilter = document.getElementById('province-filter').value;
        const typeFilter = document.getElementById('type-filter').value;

        let filtered = incidents;

        if (provinceFilter !== 'all') {
            filtered = filtered.filter(incident => incident.province === provinceFilter);
        }

        if (typeFilter !== 'all') {
            filtered = filtered.filter(incident => incident.type === typeFilter);
        }

        currentFilteredIncidents = filtered;
        displayIncidentsOnMap(filtered);
    }

    // Hàm cập nhật thống kê
    function updateStatistics(incidentsData) {  
        const total = incidentsData.length;
        const active = incidentsData.filter(incident => incident.status === 'active').length;
        const resolved = incidentsData.filter(incident => incident.status === 'resolved').length;

        // Cập nhật số liệu thống kê chính
        document.getElementById('total-incidents').textContent = total;
        document.getElementById('active-incidents').textContent = active;
        document.getElementById('resolved-incidents').textContent = resolved;

        // Cập nhật thống kê theo loại
        const typeCounts = {
            fire: incidentsData.filter(incident => incident.type === 'fire').length,
            flood: incidentsData.filter(incident => incident.type === 'flood').length,
            accident: incidentsData.filter(incident => incident.type === 'accident').length,
            disaster: incidentsData.filter(incident => incident.type === 'disaster').length
        };

        document.getElementById('count-fire').textContent = typeCounts.fire;
        document.getElementById('count-flood').textContent = typeCounts.flood;
        document.getElementById('count-accident').textContent = typeCounts.accident;
        document.getElementById('count-disaster').textContent = typeCounts.disaster;
    }

    // Hàm hiển thị modal chi tiết sự cố
    window.showIncidentDetail = function(incidentId) {
        const incident = incidents.find(inc => inc.id === incidentId);
        if (!incident) return;

        // Điền thông tin vào modal
        document.getElementById('modal-title').textContent = incident.title;
        document.getElementById('modal-id').textContent = incident.id;
        document.getElementById('modal-type').textContent = getTypeText(incident.type);
        document.getElementById('modal-status').innerHTML = getStatusBadge(incident.status);
        document.getElementById('modal-priority').innerHTML = getPriorityBadge(incident.priority);
        document.getElementById('modal-time').textContent = incident.time;
        document.getElementById('modal-address').textContent = incident.address;
        document.getElementById('modal-province').textContent = getProvinceText(incident.province);
        document.getElementById('modal-coords').textContent = `${incident.position[0].toFixed(4)}, ${incident.position[1].toFixed(4)}`;
        document.getElementById('modal-description').textContent = incident.description;
        document.getElementById('modal-reporter-name').textContent = incident.reporter.name;
        document.getElementById('modal-reporter-phone').textContent = incident.reporter.phone;
        document.getElementById('modal-report-time').textContent = incident.reporter.time;

        // Điền thông tin lực lượng ứng phó
        const responseTeamsContainer = document.getElementById('modal-response-teams');
        responseTeamsContainer.innerHTML = incident.responseTeams.map(team => `
            <div class="flex justify-between items-center py-2 border-b border-gray-200">
                <span class="font-medium">${team.name}</span>
                <span class="px-2 py-1 text-xs rounded-full ${getTeamStatusClass(team.status)}">
                    ${team.status}
                </span>
            </div>
        `).join('');

        // Điền timeline
        const timelineContainer = document.getElementById('modal-timeline');
        timelineContainer.innerHTML = incident.timeline.map(item => `
            <div class="flex items-start space-x-3">
                <div class="flex-shrink-0 w-2 h-2 mt-2 bg-red-500 rounded-full"></div>
                <div class="flex-1">
                    <div class="flex justify-between">
                        <span class="font-medium text-gray-900">${item.time}</span>
                    </div>
                    <p class="text-gray-600">${item.action}</p>
                </div>
            </div>
        `).join('');

        // Hiển thị modal
        const modal = document.getElementById('emergency-detail-modal');
        modal.classList.remove('hidden');
    }

    // Các hàm hỗ trợ
    function getStatusClass(status) {
        return status === 'active' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800';
    }

    function getStatusText(status) {
        return status === 'active' ? 'Đang xử lý' : 'Đã giải quyết';
    }

    function getStatusBadge(status) {
        const className = status === 'active' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800';
        const text = getStatusText(status);
        return `<span class="px-2 py-1 text-xs rounded-full ${className}">${text}</span>`;
    }

    function getPriorityClass(priority) {
        const classes = {
            high: 'bg-red-100 text-red-800',
            medium: 'bg-orange-100 text-orange-800',
            low: 'bg-yellow-100 text-yellow-800'
        };
        return classes[priority] || 'bg-gray-100 text-gray-800';
    }

    function getPriorityText(priority) {
        const texts = {
            high: 'Cao',
            medium: 'Trung bình',
            low: 'Thấp'
        };
        return texts[priority] || 'Không xác định';
    }

    function getPriorityBadge(priority) {
        const className = getPriorityClass(priority);
        const text = getPriorityText(priority);
        return `<span class="px-2 py-1 text-xs rounded-full ${className}">${text}</span>`;
    }

    function getTypeText(type) {
        const texts = {
            fire: 'Hỏa hoạn',
            flood: 'Ngập lụt',
            accident: 'Tai nạn giao thông',
            disaster: 'Thiên tai'
        };
        return texts[type] || 'Không xác định';
    }

    function getProvinceText(province) {
        const provinces = {
            hanoi: 'Hà Nội',
            hochiminh: 'TP. Hồ Chí Minh',
            danang: 'Đà Nẵng',
            hue: 'Thừa Thiên Huế',
            cantho: 'Cần Thơ',
            haiphong: 'Hải Phòng',
            thanhhoa: 'Thanh Hóa',
            nghean: 'Nghệ An',
            bacninh: 'Bắc Ninh',
            tiengiang: 'Tiền Giang',
            lamdong: 'Lâm Đồng',
            khanhhoa: 'Khánh Hòa',
            haiduong: 'Hải Dương',
            bariavungtau: 'Bà Rịa - Vũng Tàu',
            quangnam: 'Quảng Nam',
            ninhthuan: 'Ninh Thuận',
            soctrang: 'Sóc Trăng',
            longan: 'Long An',
            laocai: 'Lào Cai',
            hoabinh: 'Hòa Bình',
            dongnai: 'Đồng Nai',
            binhdinh: 'Bình Định',
            thainguyen: 'Thái Nguyên',
            namdinh: 'Nam Định',
            haugiang: 'Hậu Giang',
            dongthap: 'Đồng Tháp',
            laichau: 'Lai Châu',
            dienbien: 'Điện Biên',
            phuyen: 'Phú Yên',
            camau: 'Cà Mau'
        };
        return provinces[province] || province;
    }

    function getTeamStatusClass(status) {
        if (status.includes('Đang') || status.includes('di chuyển')) return 'bg-blue-100 text-blue-800';
        if (status.includes('Có mặt') || status.includes('hoàn thành')) return 'bg-green-100 text-green-800';
        return 'bg-gray-100 text-gray-800';
    }

    // Xử lý sự kiện
    document.getElementById('province-filter').addEventListener('change', filterIncidents);
    document.getElementById('type-filter').addEventListener('change', filterIncidents);

    document.getElementById('reset-filters').addEventListener('click', function() {
        document.getElementById('province-filter').value = 'all';
        document.getElementById('type-filter').value = 'all';
        filterIncidents();
    });

    document.getElementById('locate-btn').addEventListener('click', function() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                position => {
                    const { latitude, longitude } = position.coords;
                    map.setView([latitude, longitude], 13);
                    
                    // Thêm marker vị trí hiện tại
                    L.marker([latitude, longitude])
                        .addTo(map)
                        .bindPopup('Vị trí của bạn')
                        .openPopup();
                },
                error => {
                    alert('Không thể lấy vị trí hiện tại: ' + error.message);
                }
            );
        } else {
            alert('Trình duyệt không hỗ trợ định vị');
        }
    });

    // Xử lý nút đóng modal
    document.getElementById('close-modal').addEventListener('click', closeModal);
    document.getElementById('modal-close-btn').addEventListener('click', closeModal);

    function closeModal() {
        document.getElementById('emergency-detail-modal').classList.add('hidden');
    }

    // Xử lý nút phóng to/thu nhỏ
    document.getElementById('zoom-in-btn').addEventListener('click', () => map.zoomIn());
    document.getElementById('zoom-out-btn').addEventListener('click', () => map.zoomOut());

    // Xử lý click vào chú thích để lọc
    document.querySelectorAll('.quick-stat, .flex.items-center.p-3').forEach(element => {
        element.addEventListener('click', function() {
            const type = this.getAttribute('data-type');
            if (type) {
                document.getElementById('type-filter').value = type;
                filterIncidents();
            }
        });
    });

    // Khởi tạo bản đồ với tất cả sự cố
    displayIncidentsOnMap(incidents);

    // Khởi tạo feather icons
    if (typeof feather !== 'undefined') {
        feather.replace();
    }

    // Thêm CSS động
    const style = document.createElement('style');
    style.textContent = `
        .incident-marker-highlight {
            animation: pulse-highlight 1.5s ease-in-out;
            transform: scale(1.2);
            z-index: 1000;
        }
        
        @keyframes pulse-highlight {
            0% { transform: scale(1); }
            50% { transform: scale(1.3); }
            100% { transform: scale(1.2); }
        }
        
        .incident-marker-pulse::before {
            content: '';
            position: absolute;
            top: -8px;
            left: -8px;
            right: -8px;
            bottom: -8px;
            border-radius: 50%;
            background: inherit;
            opacity: 0.4;
            animation: pulse-ring 2s ease-in-out infinite;
        }
        
        @keyframes pulse-ring {
            0% { transform: scale(0.8); opacity: 0.4; }
            50% { transform: scale(1.2); opacity: 0.2; }
            100% { transform: scale(1.4); opacity: 0; }
        }
        
        .incident-popup .leaflet-popup-content-wrapper {
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
    `;
    document.head.appendChild(style);
});

// Hàm focusOnMap cho compatibility
window.focusOnMap = function(coordinates, title) {
    // Tìm sự cố gần với coordinates nhất
    const incident = window.incidents?.find(inc => 
        inc.position[0] === coordinates[0] && inc.position[1] === coordinates[1]
    );
    
    if (incident && window.focusOnEmergency) {
        window.focusOnEmergency(incident.id);
    }
};






// Thêm vào cuối file map.js để đồng bộ dữ liệu
console.log('Map incidents loaded:', incidents.length);

// Đồng bộ dữ liệu với recent incidents nếu hàm tồn tại
setTimeout(() => {
    if (typeof updateRecentIncidentsFromMap === 'function') {
        updateRecentIncidentsFromMap(incidents);
        console.log('✅ Đã đồng bộ dữ liệu với recent incidents');
    } else {
        console.log('⚠️ Hàm updateRecentIncidentsFromMap chưa khả dụng');
    }
}, 1000);