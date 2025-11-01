// request.js - Xử lý chức năng cho trang bản tin khẩn cấp

// Dữ liệu mẫu cho bản tin
const newsData = [
    // Sự cố khẩn cấp
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