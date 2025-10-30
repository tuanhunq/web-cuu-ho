// Dữ liệu đầy đủ 35 sự cố
const allIncidents = [
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

let currentPage = 1;
const incidentsPerPage = 8;

// Khởi tạo phần Sự Cố Gần Đây
function initRecentIncidents() {
    displayRecentIncidents();
    updateRecentStatistics();
    setupRecentEventListeners();
    initMap(); // Khởi tạo bản đồ
}

// Khởi tạo bản đồ
function initMap() {
    // Tạo bản đồ với trung tâm là Việt Nam
    const map = L.map('incident-map').setView([16.0, 108.0], 6);
    
    // Thêm layer bản đồ
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);
    
    // Lưu bản đồ vào biến toàn cục để sử dụng sau
    window.incidentMap = map;
    
    // Thêm marker cho tất cả sự cố
    addIncidentsToMap(map, allIncidents);
}

// Thêm các sự cố lên bản đồ
function addIncidentsToMap(map, incidents) {
    // Xóa các marker cũ (nếu có)
    if (window.incidentMarkers) {
        window.incidentMarkers.clearLayers();
    }
    
    // Tạo layer group mới
    window.incidentMarkers = L.layerGroup().addTo(map);
    
    // Tọa độ mẫu cho các tỉnh thành (trong thực tế cần API geocoding)
    const provinceCoordinates = {
        'Hà Nội': [21.0278, 105.8342],
        'TP.HCM': [10.8231, 106.6297],
        'Đà Nẵng': [16.0544, 108.2022],
        'Thừa Thiên Huế': [16.4637, 107.5909],
        'Cần Thơ': [10.0458, 105.7469],
        'Hải Phòng': [20.8449, 106.6881],
        'Thanh Hóa': [19.8076, 105.7764],
        'Nghệ An': [18.6796, 105.6813],
        'Bắc Ninh': [21.1861, 106.0763],
        'Tiền Giang': [10.4493, 106.3425],
        'Lâm Đồng': [11.9404, 108.4583],
        'Khánh Hòa': [12.2388, 109.1967],
        'Hải Dương': [20.9373, 106.3146],
        'Cà Mau': [9.1776, 105.1521],
        'Bà Rịa - Vũng Tàu': [10.4114, 107.1362],
        'Quảng Nam': [15.5394, 108.0191],
        'Ninh Thuận': [11.6739, 108.8638],
        'Sóc Trăng': [9.6025, 105.9739],
        'Đồng Nai': [11.0041, 107.0750],
        'Bình Định': [13.7696, 109.2319],
        'Thái Nguyên': [21.5925, 105.8442],
        'Nam Định': [20.2581, 106.1789],
        'Long An': [10.6956, 106.1741],
        'Lào Cai': [22.3402, 104.1479]
    };
    
    incidents.forEach(incident => {
        // Lấy tọa độ từ tên tỉnh/thành phố
        const coords = provinceCoordinates[incident.province] || [16.0, 108.0];
        
        // Tạo icon dựa trên loại sự cố
        let iconColor, iconType;
        switch(incident.type) {
            case 'fire':
                iconColor = 'red';
                iconType = 'flame';
                break;
            case 'flood':
                iconColor = 'blue';
                iconType = 'droplet';
                break;
            case 'accident':
                iconColor = 'orange';
                iconType = 'activity';
                break;
            case 'disaster':
                iconColor = 'purple';
                iconType = 'alert-octagon';
                break;
        }
        
        // Tạo custom icon
        const customIcon = L.divIcon({
            className: `custom-marker ${incident.type}`,
            html: `
                <div class="marker-icon bg-${iconColor}-500 border-2 border-white shadow-lg rounded-full w-8 h-8 flex items-center justify-center text-white text-xs font-bold">
                    <i data-feather="${iconType}" class="w-3 h-3"></i>
                </div>
            `,
            iconSize: [32, 32],
            iconAnchor: [16, 16]
        });
        
        // Tạo marker
        const marker = L.marker(coords, { icon: customIcon }).addTo(window.incidentMarkers);
        
        // Thêm popup thông tin
        marker.bindPopup(`
            <div class="incident-popup">
                <h4 class="font-bold text-lg mb-2">${incident.title}</h4>
                <div class="space-y-1 text-sm">
                    <p><strong>ID:</strong> ${incident.id}</p>
                    <p><strong>Loại:</strong> ${getIncidentTypeText(incident.type)}</p>
                    <p><strong>Trạng thái:</strong> ${incident.status === 'active' ? 'Đang xử lý' : 'Đã giải quyết'}</p>
                    <p><strong>Ưu tiên:</strong> ${getPriorityText(incident.priority)}</p>
                    <p><strong>Địa chỉ:</strong> ${incident.address}</p>
                    <p><strong>Thời gian:</strong> ${incident.time}</p>
                </div>
                <button onclick="focusOnIncident('${incident.id}')" class="mt-3 w-full bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition">
                    Xem chi tiết
                </button>
            </div>
        `);
        
        // Lưu thông tin incident vào marker
        marker.incidentId = incident.id;
    });
    
    feather.replace();
}

// Hiển thị danh sách sự cố
function displayRecentIncidents(incidents = allIncidents) {
    const container = document.getElementById('recent-incidents-list');
    container.innerHTML = '';

    // Phân trang
    const startIndex = (currentPage - 1) * incidentsPerPage;
    const endIndex = startIndex + incidentsPerPage;
    const paginatedIncidents = incidents.slice(startIndex, endIndex);

    if (paginatedIncidents.length === 0) {
        container.innerHTML = `
            <div class="col-span-2 text-center py-12">
                <i data-feather="search" class="w-16 h-16 text-gray-400 mx-auto mb-4"></i>
                <h3 class="text-lg font-medium text-gray-900 mb-2">Không tìm thấy sự cố nào</h3>
                <p class="text-gray-500">Hãy thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
            </div>
        `;
        feather.replace();
        return;
    }

    paginatedIncidents.forEach(incident => {
        let typeClass = '';
        let typeIcon = '';
        let typeColor = '';
        
        switch(incident.type) {
            case 'fire':
                typeClass = 'incident-fire';
                typeIcon = 'flame';
                typeColor = 'red';
                break;
            case 'flood':
                typeClass = 'incident-flood';
                typeIcon = 'droplet';
                typeColor = 'blue';
                break;
            case 'accident':
                typeClass = 'incident-accident';
                typeIcon = 'activity';
                typeColor = 'orange';
                break;
            case 'disaster':
                typeClass = 'incident-disaster';
                typeIcon = 'alert-octagon';
                typeColor = 'purple';
                break;
        }
        
        const incidentCard = document.createElement('div');
        incidentCard.className = `incident-card bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 ${typeClass}`;
        incidentCard.innerHTML = `
            <div class="flex justify-between items-start mb-4">
                <div class="flex-1">
                    <h4 class="font-bold text-lg text-gray-900 mb-2">${incident.title}</h4>
                    <div class="flex items-center space-x-2 mb-3">
                        <span class="status-badge ${incident.status === 'active' ? 'status-active' : 'status-resolved'}">
                            ${incident.status === 'active' ? 'Đang xử lý' : 'Đã giải quyết'}
                        </span>
                        <span class="status-badge ${incident.priority === 'high' ? 'priority-high' : incident.priority === 'medium' ? 'priority-medium' : 'priority-low'}">
                            ${incident.priority === 'high' ? 'Ưu tiên cao' : incident.priority === 'medium' ? 'Ưu tiên trung bình' : 'Ưu tiên thấp'}
                        </span>
                    </div>
                </div>
                <div class="w-12 h-12 rounded-full flex items-center justify-center bg-${typeColor}-100 text-${typeColor}-600">
                    <i data-feather="${typeIcon}" class="w-6 h-6"></i>
                </div>
            </div>
            
            <p class="text-gray-600 mb-4 line-clamp-2">${incident.description}</p>
            
            <div class="space-y-2 mb-4">
                <div class="flex items-center text-sm text-gray-500">
                    <i data-feather="map-pin" class="w-4 h-4 mr-2"></i>
                    <span>${incident.address}</span>
                </div>
                <div class="flex items-center text-sm text-gray-500">
                    <i data-feather="clock" class="w-4 h-4 mr-2"></i>
                    <span>${incident.time}</span>
                </div>
            </div>
            
            <div class="flex justify-between items-center pt-4 border-t border-gray-100">
                <span class="text-sm text-gray-500">${incident.id}</span>
                <div class="flex space-x-2">
                    <button class="px-4 py-2 bg-${typeColor}-500 text-white rounded-lg hover:bg-${typeColor}-600 transition flex items-center view-on-map" data-id="${incident.id}">
                        <i data-feather="map" class="w-4 h-4 mr-1"></i>
                        Xem trên bản đồ
                    </button>
                </div>
            </div>
        `;
        
        container.appendChild(incidentCard);
    });
    
    setupPagination(incidents.length);
    feather.replace();
    
    // Thêm sự kiện click để hiển thị trên bản đồ
    document.querySelectorAll('.view-on-map').forEach(button => {
        button.addEventListener('click', function() {
            const incidentId = this.getAttribute('data-id');
            focusOnIncident(incidentId);
        });
    });
}

// Tập trung vào sự cố trên bản đồ
function focusOnIncident(incidentId) {
    const incident = allIncidents.find(i => i.id === incidentId);
    if (!incident || !window.incidentMap) return;
    
    // Tìm marker tương ứng
    let targetMarker = null;
    window.incidentMarkers.eachLayer(layer => {
        if (layer.incidentId === incidentId) {
            targetMarker = layer;
        }
    });
    
    if (targetMarker) {
        // Phóng to và di chuyển bản đồ đến marker
        window.incidentMap.setView(targetMarker.getLatLng(), 13);
        
        // Mở popup
        targetMarker.openPopup();
        
        // Highlight marker
        highlightMarker(targetMarker);
    }
    
    // Chuyển sang tab bản đồ
    switchToMapView();
}

// Highlight marker
function highlightMarker(marker) {
    // Reset tất cả markers
    window.incidentMarkers.eachLayer(layer => {
        const icon = layer.getElement();
        if (icon) {
            icon.classList.remove('marker-highlight');
            icon.classList.add('marker-normal');
        }
    });
    
    // Highlight marker được chọn
    const icon = marker.getElement();
    if (icon) {
        icon.classList.remove('marker-normal');
        icon.classList.add('marker-highlight');
        
        // Thêm hiệu ứng pulse
        icon.classList.add('animate-pulse');
        setTimeout(() => {
            icon.classList.remove('animate-pulse');
        }, 2000);
    }
}

// Chuyển sang chế độ xem bản đồ
function switchToMapView() {
    // Ẩn danh sách, hiện bản đồ
    document.getElementById('recent-incidents-container').classList.add('hidden');
    document.getElementById('map-view-container').classList.remove('hidden');
    
    // Cập nhật nút
    document.getElementById('show-list-view').classList.remove('hidden');
    document.getElementById('show-map-view').classList.add('hidden');
}

// Chuyển sang chế độ xem danh sách
function switchToListView() {
    // Ẩn bản đồ, hiện danh sách
    document.getElementById('map-view-container').classList.add('hidden');
    document.getElementById('recent-incidents-container').classList.remove('hidden');
    
    // Cập nhật nút
    document.getElementById('show-map-view').classList.remove('hidden');
    document.getElementById('show-list-view').classList.add('hidden');
}

// Áp dụng bộ lọc cho cả danh sách và bản đồ
function applyRecentFilters() {
    const searchTerm = document.getElementById('search-recent-incidents').value.toLowerCase();
    const typeFilter = document.getElementById('recent-type-filter').value;
    const statusFilter = document.getElementById('recent-status-filter').value;
    const sortBy = document.getElementById('sort-by').value;
    
    let filteredIncidents = allIncidents.filter(incident => {
        const searchMatch = searchTerm === '' || 
            incident.title.toLowerCase().includes(searchTerm) ||
            incident.address.toLowerCase().includes(searchTerm) ||
            incident.description.toLowerCase().includes(searchTerm);
        
        const typeMatch = typeFilter === 'all' || incident.type === typeFilter;
        const statusMatch = statusFilter === 'all' || incident.status === statusFilter;
        
        return searchMatch && typeMatch && statusMatch;
    });
    
    // Sắp xếp
    switch(sortBy) {
        case 'newest':
            filteredIncidents.sort((a, b) => new Date(b.time) - new Date(a.time));
            break;
        case 'oldest':
            filteredIncidents.sort((a, b) => new Date(a.time) - new Date(b.time));
            break;
        case 'priority':
            const priorityOrder = { high: 3, medium: 2, low: 1 };
            filteredIncidents.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);
            break;
    }
    
    currentPage = 1;
    displayRecentIncidents(filteredIncidents);
    
    // Cập nhật bản đồ với các sự cố đã lọc
    if (window.incidentMap) {
        addIncidentsToMap(window.incidentMap, filteredIncidents);
    }
    
    updateRecentStatistics();
}

// Các hàm còn lại giữ nguyên...
function setupPagination(totalIncidents) {
    const paginationContainer = document.getElementById('recent-pagination');
    const totalPages = Math.ceil(totalIncidents / incidentsPerPage);
    
    paginationContainer.innerHTML = '';
    
    if (totalPages <= 1) return;
    
    // Nút Previous
    if (currentPage > 1) {
        const prevButton = document.createElement('button');
        prevButton.className = 'px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center';
        prevButton.innerHTML = '<i data-feather="chevron-left" class="w-4 h-4"></i>';
        prevButton.addEventListener('click', () => {
            currentPage--;
            displayRecentIncidents();
        });
        paginationContainer.appendChild(prevButton);
    }
    
    // Các nút trang
    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.className = `px-3 py-2 border rounded-lg ${
            i === currentPage 
            ? 'bg-red-500 text-white border-red-500' 
            : 'border-gray-300 hover:bg-gray-50'
        }`;
        pageButton.textContent = i;
        pageButton.addEventListener('click', () => {
            currentPage = i;
            displayRecentIncidents();
        });
        paginationContainer.appendChild(pageButton);
    }
    
    // Nút Next
    if (currentPage < totalPages) {
        const nextButton = document.createElement('button');
        nextButton.className = 'px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center';
        nextButton.innerHTML = '<i data-feather="chevron-right" class="w-4 h-4"></i>';
        nextButton.addEventListener('click', () => {
            currentPage++;
            displayRecentIncidents();
        });
        paginationContainer.appendChild(nextButton);
    }
    
    feather.replace();
}

function updateRecentStatistics() {
    const total = allIncidents.length;
    const active = allIncidents.filter(i => i.status === 'active').length;
    const resolved = allIncidents.filter(i => i.status === 'resolved').length;
    const today = allIncidents.filter(i => i.time.includes('12/11/2023') || i.time.includes('13/11/2023')).length;
    
    document.getElementById('recent-total-incidents').textContent = total;
    document.getElementById('recent-active-incidents').textContent = active;
    document.getElementById('recent-resolved-incidents').textContent = resolved;
    document.getElementById('recent-today-incidents').textContent = today;
}

function setupRecentEventListeners() {
    // Bộ lọc tìm kiếm
    document.getElementById('search-recent-incidents').addEventListener('input', applyRecentFilters);
    document.getElementById('recent-type-filter').addEventListener('change', applyRecentFilters);
    document.getElementById('recent-status-filter').addEventListener('change', applyRecentFilters);
    document.getElementById('sort-by').addEventListener('change', applyRecentFilters);
    
    // Nút đặt lại
    document.getElementById('reset-recent-filters').addEventListener('click', resetRecentFilters);
    
    // Nút chuyển đổi giữa danh sách và bản đồ
    document.getElementById('show-map-view').addEventListener('click', switchToMapView);
    document.getElementById('show-list-view').addEventListener('click', switchToListView);
}

function resetRecentFilters() {
    document.getElementById('search-recent-incidents').value = '';
    document.getElementById('recent-type-filter').value = 'all';
    document.getElementById('recent-status-filter').value = 'all';
    document.getElementById('sort-by').value = 'newest';
    
    currentPage = 1;
    displayRecentIncidents();
    
    // Reset bản đồ
    if (window.incidentMap) {
        addIncidentsToMap(window.incidentMap, allIncidents);
    }
    
    updateRecentStatistics();
}

function getIncidentTypeText(type) {
    switch(type) {
        case 'fire': return 'Hỏa hoạn';
        case 'flood': return 'Ngập lụt';
        case 'accident': return 'Tai nạn giao thông';
        case 'disaster': return 'Thiên tai';
        default: return 'Không xác định';
    }
}

function getPriorityText(priority) {
    switch(priority) {
        case 'high': return 'Cao';
        case 'medium': return 'Trung bình';
        case 'low': return 'Thấp';
        default: return 'Không xác định';
    }
}

// Khởi tạo khi DOM loaded
document.addEventListener('DOMContentLoaded', function() {
    initRecentIncidents();
});