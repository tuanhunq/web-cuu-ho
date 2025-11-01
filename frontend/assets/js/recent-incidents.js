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


// Biến toàn cục
let currentNews = [];
let currentPage = 1;
const itemsPerPage = 6;
let currentFilters = {
    type: 'all',
    location: 'all',
    priority: 'all'
};

// Khởi tạo trang
document.addEventListener('DOMContentLoaded', function() {
    initializePage();
    setupEventListeners();
});

function initializePage() {
    // Khởi tạo Feather Icons
    if (typeof feather !== 'undefined') {
        feather.replace();
    }
    
    // Tải dữ liệu ban đầu
    loadNewsData();
    
    // Hiển thị bản tin đầu tiên
    displayNews(currentPage);
}

function setupEventListeners() {
    // Lọc theo loại tin
    document.getElementById('filter-type').addEventListener('change', function(e) {
        currentFilters.type = e.target.value;
        applyFilters();
    });
    
    // Lọc theo khu vực
    document.getElementById('filter-location').addEventListener('change', function(e) {
        currentFilters.location = e.target.value;
        applyFilters();
    });
    
    // Làm mới bản tin
    document.getElementById('refresh-news').addEventListener('click', function() {
        refreshNews();
    });
    
    // Tab lọc nhanh
    document.querySelectorAll('.filter-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            handleQuickFilter(filter);
        });
    });
    
    // Đặt lại bộ lọc
    document.getElementById('reset-filters').addEventListener('click', function() {
        resetFilters();
    });
    
    // Đóng modal
    document.getElementById('close-modal').addEventListener('click', closeModal);
    
    // Đóng modal khi click bên ngoài
    document.getElementById('news-modal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeModal();
        }
    });
}

function loadNewsData() {
    // Trong thực tế, đây sẽ là API call
    // Hiện tại sử dụng dữ liệu mẫu
    currentNews = [...sampleNewsData];
}

function displayNews(page = 1) {
    const newsGrid = document.getElementById('news-grid');
    const loadingIndicator = document.getElementById('loading-indicator');
    const emptyState = document.getElementById('empty-state');
    
    // Hiển thị loading
    showLoading(true);
    
    // Giả lập delay loading
    setTimeout(() => {
        const filteredNews = getFilteredNews();
        const paginatedNews = paginateNews(filteredNews, page);
        
        if (paginatedNews.data.length === 0) {
            newsGrid.classList.add('hidden');
            emptyState.classList.remove('hidden');
        } else {
            newsGrid.classList.remove('hidden');
            emptyState.classList.add('hidden');
            renderNewsCards(paginatedNews.data);
        }
        
        renderPagination(paginatedNews.totalPages, page);
        showLoading(false);
        
        // Cập nhật Feather Icons cho các thẻ mới
        if (typeof feather !== 'undefined') {
            feather.replace();
        }
    }, 500);
}

function getFilteredNews() {
    return currentNews.filter(news => {
        const typeMatch = currentFilters.type === 'all' || news.type === currentFilters.type;
        const locationMatch = currentFilters.location === 'all' || news.location === currentFilters.location;
        const priorityMatch = currentFilters.priority === 'all' || 
                             (currentFilters.priority === 'high-priority' && news.priority === 'high');
        
        return typeMatch && locationMatch && priorityMatch;
    });
}

function paginateNews(news, page) {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedData = news.slice(startIndex, endIndex);
    const totalPages = Math.ceil(news.length / itemsPerPage);
    
    return {
        data: paginatedData,
        totalPages: totalPages,
        currentPage: page
    };
}

function renderNewsCards(news) {
    const newsGrid = document.getElementById('news-grid');
    
    newsGrid.innerHTML = news.map(item => `
        <div class="news-card bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer border border-gray-200" data-id="${item.id}">
            <div class="relative">
                <img src="${item.image}" alt="${item.title}" class="w-full h-48 object-cover">
                <div class="absolute top-4 left-4 flex flex-wrap gap-2">
                    <span class="type-badge ${getTypeBadgeClass(item.type)} px-3 py-1 rounded-full text-xs font-medium text-white">
                        ${getTypeText(item.type)}
                    </span>
                    ${item.priority === 'high' ? `
                    <span class="priority-badge bg-red-500 px-3 py-1 rounded-full text-xs font-medium text-white">
                        Ưu tiên cao
                    </span>
                    ` : ''}
                    ${item.verified ? `
                    <span class="verified-badge bg-green-500 px-3 py-1 rounded-full text-xs font-medium text-white">
                        Đã xác minh
                    </span>
                    ` : ''}
                </div>
            </div>
            <div class="p-6">
                <h3 class="text-xl font-bold text-gray-900 mb-3 line-clamp-2">${item.title}</h3>
                <div class="flex items-center text-gray-500 text-sm mb-4">
                    <i data-feather="map-pin" class="w-4 h-4 mr-1"></i>
                    <span class="mr-4">${getLocationText(item.location)}</span>
                    <i data-feather="clock" class="w-4 h-4 mr-1"></i>
                    <span>${formatTimeAgo(item.timestamp)}</span>
                </div>
                <p class="text-gray-600 mb-4 line-clamp-3">${item.description}</p>
                <div class="flex justify-between items-center">
                    <button class="view-details-btn px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition text-sm font-medium">
                        Xem chi tiết
                    </button>
                    <span class="status-indicator ${item.status === 'active' ? 'text-green-500' : 'text-gray-400'} text-sm">
                        ${item.status === 'active' ? 'Đang hoạt động' : 'Đã kết thúc'}
                    </span>
                </div>
            </div>
        </div>
    `).join('');
    
    // Thêm event listeners cho các thẻ tin
    document.querySelectorAll('.news-card').forEach(card => {
        card.addEventListener('click', function() {
            const newsId = parseInt(this.getAttribute('data-id'));
            openNewsModal(newsId);
        });
    });
    
    document.querySelectorAll('.view-details-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const card = this.closest('.news-card');
            const newsId = parseInt(card.getAttribute('data-id'));
            openNewsModal(newsId);
        });
    });
}

function renderPagination(totalPages, currentPage) {
    const paginationContainer = document.getElementById('pagination');
    
    if (totalPages <= 1) {
        paginationContainer.innerHTML = '';
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
    
    paginationContainer.innerHTML = paginationHTML;
    
    // Thêm event listeners cho phân trang
    document.querySelectorAll('.pagination-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const page = parseInt(this.getAttribute('data-page'));
            currentPage = page;
            displayNews(page);
            
            // Scroll to top
            document.getElementById('news-section').scrollIntoView({ 
                behavior: 'smooth' 
            });
        });
    });
    
    // Cập nhật Feather Icons
    if (typeof feather !== 'undefined') {
        feather.replace();
    }
}

function openNewsModal(newsId) {
    const newsItem = currentNews.find(item => item.id === newsId);
    if (!newsItem) return;
    
    const modal = document.getElementById('news-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalContent = document.getElementById('modal-content');
    
    modalTitle.textContent = newsItem.title;
    modalContent.innerHTML = generateModalContent(newsItem);
    
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    
    // Thêm event listeners cho các nút trong modal
    setupModalButtons(newsItem);
    
    // Cập nhật Feather Icons
    if (typeof feather !== 'undefined') {
        feather.replace();
    }
}

function generateModalContent(newsItem) {
    let content = `
        <div class="flex flex-wrap gap-4 mb-6">
            <span class="${getTypeBadgeClass(newsItem.type)} px-3 py-1 rounded-full text-sm font-medium text-white">
                ${getTypeText(newsItem.type)}
            </span>
            ${newsItem.priority === 'high' ? `
            <span class="bg-red-500 px-3 py-1 rounded-full text-sm font-medium text-white">
                Ưu tiên cao
            </span>
            ` : ''}
            ${newsItem.verified ? `
            <span class="bg-green-500 px-3 py-1 rounded-full text-sm font-medium text-white">
                Đã xác minh
            </span>
            ` : ''}
            <span class="bg-blue-500 px-3 py-1 rounded-full text-sm font-medium text-white">
                ${getLocationText(newsItem.location)}
            </span>
        </div>
        
        <div class="flex items-center text-gray-600 mb-6">
            <i data-feather="clock" class="w-5 h-5 mr-2"></i>
            <span>${formatDateTime(newsItem.timestamp)}</span>
        </div>
        
        <div class="prose max-w-none">
            <p class="text-gray-700 text-lg leading-relaxed">${newsItem.description}</p>
        </div>
    `;
    
    // Nội dung cụ thể theo loại tin
    switch (newsItem.type) {
        case 'emergency':
            content += `
                <div class="bg-red-50 border border-red-200 rounded-lg p-6 mt-6">
                    <h4 class="font-bold text-red-800 mb-4 flex items-center">
                        <i data-feather="alert-triangle" class="w-5 h-5 mr-2"></i>
                        Thông tin khẩn cấp
                    </h4>
                    <div class="space-y-3">
                        <div class="flex items-start">
                            <i data-feather="users" class="w-4 h-4 mr-2 mt-1 text-red-600"></i>
                            <span class="text-red-700"><strong>Thương vong:</strong> ${newsItem.casualties}</span>
                        </div>
                        <div class="flex items-start">
                            <i data-feather="map" class="w-4 h-4 mr-2 mt-1 text-red-600"></i>
                            <span class="text-red-700"><strong>Khu vực ảnh hưởng:</strong> ${newsItem.affectedAreas}</span>
                        </div>
                        <div class="flex items-start">
                            <i data-feather="tool" class="w-4 h-4 mr-2 mt-1 text-red-600"></i>
                            <span class="text-red-700"><strong>Hỗ trợ cần thiết:</strong> ${newsItem.requiredSupport.join(', ')}</span>
                        </div>
                        <div class="flex items-start">
                            <i data-feather="phone" class="w-4 h-4 mr-2 mt-1 text-red-600"></i>
                            <span class="text-red-700"><strong>Liên hệ:</strong> ${newsItem.contact}</span>
                        </div>
                    </div>
                </div>
            `;
            break;
            
        case 'assistance':
            content += `
                <div class="bg-orange-50 border border-orange-200 rounded-lg p-6 mt-6">
                    <h4 class="font-bold text-orange-800 mb-4 flex items-center">
                        <i data-feather="heart" class="w-5 h-5 mr-2"></i>
                        Thông tin cứu trợ
                    </h4>
                    <div class="space-y-3">
                        <div class="flex items-start">
                            <i data-feather="package" class="w-4 h-4 mr-2 mt-1 text-orange-600"></i>
                            <span class="text-orange-700"><strong>Vật phẩm cần thiết:</strong> ${newsItem.donationsNeeded.join(', ')}</span>
                        </div>
                        <div class="flex items-start">
                            <i data-feather="map-pin" class="w-4 h-4 mr-2 mt-1 text-orange-600"></i>
                            <span class="text-orange-700"><strong>Điểm tập kết:</strong><br>${newsItem.collectionPoints.join('<br>')}</span>
                        </div>
                        <div class="flex items-start">
                            <i data-feather="phone" class="w-4 h-4 mr-2 mt-1 text-orange-600"></i>
                            <span class="text-orange-700"><strong>Liên hệ:</strong> ${newsItem.contact}</span>
                        </div>
                    </div>
                </div>
            `;
            break;
            
        case 'volunteer':
            content += `
                <div class="bg-green-50 border border-green-200 rounded-lg p-6 mt-6">
                    <h4 class="font-bold text-green-800 mb-4 flex items-center">
                        <i data-feather="users" class="w-5 h-5 mr-2"></i>
                        Thông tin tình nguyện
                    </h4>
                    <div class="space-y-3">
                        <div class="flex items-start">
                            <i data-feather="user-check" class="w-4 h-4 mr-2 mt-1 text-green-600"></i>
                            <span class="text-green-700"><strong>Cần tình nguyện viên:</strong> ${newsItem.volunteerNeeds.join(', ')}</span>
                        </div>
                        <div class="flex items-start">
                            <i data-feather="map-pin" class="w-4 h-4 mr-2 mt-1 text-green-600"></i>
                            <span class="text-green-700"><strong>Điểm hẹn:</strong> ${newsItem.meetingPoint}</span>
                        </div>
                        <div class="flex items-start">
                            <i data-feather="phone" class="w-4 h-4 mr-2 mt-1 text-green-600"></i>
                            <span class="text-green-700"><strong>Liên hệ:</strong> ${newsItem.contact}</span>
                        </div>
                    </div>
                </div>
            `;
            break;
    }
    
    return content;
}

function setupModalButtons(newsItem) {
    // Xem trên bản đồ
    document.querySelector('.view-on-map').addEventListener('click', function() {
        alert(`Chuyển hướng đến bản đồ: ${newsItem.title}`);
        // Trong thực tế: window.location.href = `map.html?news=${newsItem.id}`;
    });
    
    // Báo cáo sự cố
    document.querySelector('.report-incident').addEventListener('click', function() {
        window.location.href = 'post.html#report';
    });
    
    // Ủng hộ
    document.querySelector('.donate-btn').addEventListener('click', function() {
        alert(`Chuyển hướng đến trang ủng hộ cho: ${newsItem.title}`);
    });
    
    // Chia sẻ
    document.querySelector('.share-btn').addEventListener('click', function() {
        if (navigator.share) {
            navigator.share({
                title: newsItem.title,
                text: newsItem.description,
                url: window.location.href
            });
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(window.location.href).then(() => {
                alert('Đã sao chép liên kết vào clipboard!');
            });
        }
    });
    
    // Liên hệ tình nguyện (chỉ hiển thị với loại volunteer)
    const contactBtn = document.querySelector('.contact-volunteer');
    if (newsItem.type === 'volunteer') {
        contactBtn.style.display = 'flex';
        contactBtn.addEventListener('click', function() {
            alert(`Liên hệ: ${newsItem.contact}`);
        });
    } else {
        contactBtn.style.display = 'none';
    }
}

function closeModal() {
    const modal = document.getElementById('news-modal');
    modal.classList.add('hidden');
    document.body.style.overflow = 'auto';
}

function applyFilters() {
    currentPage = 1;
    displayNews(currentPage);
    updateActiveFilterTabs();
}

function handleQuickFilter(filter) {
    // Cập nhật active tab
    document.querySelectorAll('.filter-tab').forEach(tab => {
        tab.classList.remove('filter-active');
    });
    event.target.classList.add('filter-active');
    
    // Áp dụng bộ lọc
    if (filter === 'all') {
        currentFilters = { type: 'all', location: 'all', priority: 'all' };
    } else if (filter === 'high-priority') {
        currentFilters = { type: 'all', location: 'all', priority: 'high-priority' };
    } else {
        currentFilters = { type: filter, location: 'all', priority: 'all' };
    }
    
    // Cập nhật dropdowns
    document.getElementById('filter-type').value = currentFilters.type;
    document.getElementById('filter-location').value = currentFilters.location;
    
    currentPage = 1;
    displayNews(currentPage);
}

function updateActiveFilterTabs() {
    // Reset all tabs
    document.querySelectorAll('.filter-tab').forEach(tab => {
        tab.classList.remove('filter-active');
    });
    
    // Find and activate matching tab
    let activeTab = document.querySelector('.filter-tab[data-filter="all"]');
    
    if (currentFilters.priority === 'high-priority') {
        activeTab = document.querySelector('.filter-tab[data-filter="high-priority"]');
    } else if (currentFilters.type !== 'all') {
        activeTab = document.querySelector(`.filter-tab[data-filter="${currentFilters.type}"]`);
    }
    
    if (activeTab) {
        activeTab.classList.add('filter-active');
    }
}

function resetFilters() {
    currentFilters = { type: 'all', location: 'all', priority: 'all' };
    document.getElementById('filter-type').value = 'all';
    document.getElementById('filter-location').value = 'all';
    
    document.querySelectorAll('.filter-tab').forEach(tab => {
        tab.classList.remove('filter-active');
    });
    document.querySelector('.filter-tab[data-filter="all"]').classList.add('filter-active');
    
    currentPage = 1;
    displayNews(currentPage);
}

function refreshNews() {
    const refreshBtn = document.getElementById('refresh-news');
    refreshBtn.disabled = true;
    refreshBtn.innerHTML = '<i data-feather="refresh-cw" class="w-4 h-4 animate-spin"></i> Đang làm mới...';
    
    // Giả lập refresh data
    setTimeout(() => {
        loadNewsData();
        displayNews(currentPage);
        
        refreshBtn.disabled = false;
        refreshBtn.innerHTML = '<i data-feather="refresh-cw" class="w-4 h-4"></i> Làm mới';
        
        if (typeof feather !== 'undefined') {
            feather.replace();
        }
        
        // Hiển thị thông báo
        showNotification('Đã cập nhật bản tin mới nhất!', 'success');
    }, 1000);
}

function showLoading(show) {
    const loadingIndicator = document.getElementById('loading-indicator');
    if (show) {
        loadingIndicator.classList.remove('hidden');
    } else {
        loadingIndicator.classList.add('hidden');
    }
}

function showNotification(message, type = 'info') {
    // Tạo notification element
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
    
    // Hiển thị notification
    setTimeout(() => {
        notification.classList.remove('translate-x-full');
    }, 100);
    
    // Ẩn notification sau 3 giây
    setTimeout(() => {
        notification.classList.add('translate-x-full');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
    
    // Cập nhật Feather Icons
    if (typeof feather !== 'undefined') {
        feather.replace();
    }
}

// Utility functions
function getTypeBadgeClass(type) {
    switch (type) {
        case 'emergency': return 'bg-red-500';
        case 'assistance': return 'bg-orange-500';
        case 'volunteer': return 'bg-green-500';
        default: return 'bg-gray-500';
    }
}

function getTypeText(type) {
    switch (type) {
        case 'emergency': return 'Sự cố khẩn cấp';
        case 'assistance': return 'Kêu gọi cứu trợ';
        case 'volunteer': return 'Đoàn thiện nguyện';
        default: return 'Khác';
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

function formatTimeAgo(timestamp) {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInSeconds = Math.floor((now - time) / 1000);
    
    if (diffInSeconds < 60) return 'Vừa xong';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} phút trước`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} giờ trước`;
    return `${Math.floor(diffInSeconds / 86400)} ngày trước`;
}

function formatDateTime(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Xử lý responsive menu
document.getElementById('menu-toggle')?.addEventListener('click', function() {
    const mobileMenu = document.getElementById('mobile-menu');
    mobileMenu.classList.toggle('hidden');
});

// Đóng mobile menu khi click ra ngoài
document.addEventListener('click', function(e) {
    const mobileMenu = document.getElementById('mobile-menu');
    const menuToggle = document.getElementById('menu-toggle');
    
    if (mobileMenu && !mobileMenu.contains(e.target) && menuToggle && !menuToggle.contains(e.target)) {
        mobileMenu.classList.add('hidden');
    }
});