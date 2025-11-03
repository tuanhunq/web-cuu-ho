// index.js
// index.js - Map functionality for Emergency Rescue System

class EmergencyMap {
    constructor() {
        this.map = null;
        this.incidents = [];
        this.markers = [];
        this.currentFilters = {
            type: 'all',
            province: 'all',
            status: 'all',
            search: ''
        };
        
        this.init();
    }
    
    init() {
        this.initializeMap();
        this.loadIncidents();
        this.setupEventListeners();
        this.setupMapControls();
        this.initStatistics();
        this.initRecentIncidents();
    }
    
    initializeMap() {
        // Kiểm tra xem phần tử map có tồn tại không
        const mapElement = document.getElementById('incident-map');
        if (!mapElement) {
            console.error('Không tìm thấy phần tử incident-map');
            return;
        }

        // Initialize Leaflet map centered on Vietnam
        this.map = L.map('incident-map').setView([16.047079, 108.206230], 6);
        
        // Add tile layer (using OpenStreetMap)
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 18
        }).addTo(this.map);
        
        // Add custom styles for different map types
        this.addMapLayers();
        
        // Add scale control
        L.control.scale({ imperial: false }).addTo(this.map);

        console.log('Bản đồ đã được khởi tạo thành công');
    }
    
    addMapLayers() {
        // Add satellite layer option
        const satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
            attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
            maxZoom: 18
        });
        
        // Add base maps
        const baseMaps = {
            "Bản đồ đường": L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'),
            "Ảnh vệ tinh": satelliteLayer
        };
        
        // Add layer control
        L.control.layers(baseMaps).addTo(this.map);
    }
    
    async loadIncidents() {
        try {
            this.showLoading(true);
            
            // Get incidents from API or mock data
            const data = await this.fetchIncidents();
            this.incidents = data.incidents || [];
            
            this.applyFilters();
            this.renderIncidents();
            this.updateStatistics();
            this.updateRecentIncidents();
            
        } catch (error) {
            console.error('Error loading incidents:', error);
            this.showError('Không thể tải dữ liệu sự cố');
        } finally {
            this.showLoading(false);
        }
    }
    
    async fetchIncidents() {
        // Mock data - replace with actual API call
        return {
            incidents: [
               {
    id: 1,
    type: 'fire',
    title: 'Cháy căn hộ chung cư',
    description: 'Cháy lớn tại tòa nhà chung cư cao tầng, nhiều người mắc kẹt',
    location: 'TP.HCM',
    address: '123 Nguyễn Huệ, Quận 1',
    coordinates: [10.7769, 106.7009],
    status: 'active',
    severity: 'high',
    timestamp: new Date(Date.now() - 30 * 60000).toISOString(),
    reporter: 'Nguyễn Văn A',
    affectedPeople: 15,
    rescueTeams: ['PCCC Quận 1', 'Cứu hộ 114']
},
{
    id: 2,
    type: 'flood',
    title: 'Ngập nước đường Nguyễn Huệ',
    description: 'Ngập sâu 0.5m do mưa lớn kéo dài',
    location: 'TP.HCM',
    address: 'Đường Nguyễn Huệ, Quận 1',
    coordinates: [10.7730, 106.7030],
    status: 'active',
    severity: 'medium',
    timestamp: new Date(Date.now() - 45 * 60000).toISOString(),
    reporter: 'Trần Thị B',
    affectedPeople: 0,
    rescueTeams: ['Công an phường']
},
{
    id: 3,
    type: 'accident',
    title: 'Tai nạn giao thông liên hoàn',
    description: 'Va chạm giữa 5 xe ô tô trên cao tốc',
    location: 'Hà Nội',
    address: 'Cao tốc Hà Nội - Hải Phòng',
    coordinates: [21.0278, 105.8342],
    status: 'active',
    severity: 'high',
    timestamp: new Date(Date.now() - 60 * 60000).toISOString(),
    reporter: 'Lê Văn C',
    affectedPeople: 8,
    rescueTeams: ['CSCĐ Hà Nội', 'Cứu thương 115']
},
{
    id: 4,
    type: 'disaster',
    title: 'Sạt lở đất vùng núi',
    description: 'Sạt lở lớn sau mưa bão, nhiều hộ dân bị ảnh hưởng',
    location: 'Lào Cai',
    address: 'Xã Tả Van, Sa Pa',
    coordinates: [22.3364, 103.8440],
    status: 'active',
    severity: 'high',
    timestamp: new Date(Date.now() - 120 * 60000).toISOString(),
    reporter: 'Mai Thị D',
    affectedPeople: 25,
    rescueTeams: ['Cứu hộ Quân đội', 'Cứu nạn Lào Cai']
},
{
    id: 5,
    type: 'fire',
    title: 'Cháy nhà dân',
    description: 'Cháy nhà 2 tầng do chập điện',
    location: 'Đà Nẵng',
    address: '123 Trần Phú, Hải Châu',
    coordinates: [16.0544, 108.2022],
    status: 'resolved',
    severity: 'medium',
    timestamp: new Date(Date.now() - 180 * 60000).toISOString(),
    reporter: 'Phạm Văn E',
    affectedPeople: 4,
    rescueTeams: ['PCCC Đà Nẵng']
},
{
    id: 6,
    type: 'disaster',
    title: 'Động đất nhẹ tại khu vực miền núi',
    description: 'Động đất cường độ 4.5 Richter, nhiều nhà bị nứt tường',
    location: 'Sơn La',
    address: 'Huyện Mộc Châu',
    coordinates: [20.8543, 104.6313],
    status: 'active',
    severity: 'medium',
    timestamp: new Date(Date.now() - 25 * 60000).toISOString(),
    reporter: 'Hoàng Văn F',
    affectedPeople: 12,
    rescueTeams: ['Cứu hộ Sơn La', 'Quân đội']
},
{
    id: 7,
    type: 'flood',
    title: 'Lũ quét tại thượng nguồn',
    description: 'Lũ quét sau mưa lớn, nước dâng cao 2m',
    location: 'Yên Bái',
    address: 'Xã Nậm Có, Huyện Mù Cang Chải',
    coordinates: [21.7524, 104.1243],
    status: 'active',
    severity: 'high',
    timestamp: new Date(Date.now() - 40 * 60000).toISOString(),
    reporter: 'Lý Thị G',
    affectedPeople: 30,
    rescueTeams: ['Cứu hộ Yên Bái', 'Cứu nạn sông nước']
},
{
    id: 8,
    type: 'accident',
    title: 'Tai nạn xe khách trên đèo',
    description: 'Xe khách lao xuống vực, nhiều người bị thương',
    location: 'Lâm Đồng',
    address: 'Đèo Prenn, Đà Lạt',
    coordinates: [11.9404, 108.4373],
    status: 'active',
    severity: 'high',
    timestamp: new Date(Date.now() - 55 * 60000).toISOString(),
    reporter: 'Võ Văn H',
    affectedPeople: 18,
    rescueTeams: ['Cứu hộ Lâm Đồng', 'Cấp cứu 115']
},
{
    id: 9,
    type: 'fire',
    title: 'Cháy kho hàng hóa',
    description: 'Cháy lớn tại kho chứa hàng điện tử',
    location: 'Bình Dương',
    address: 'KCN Mỹ Phước, Thị xã Bến Cát',
    coordinates: [11.1423, 106.6099],
    status: 'active',
    severity: 'high',
    timestamp: new Date(Date.now() - 70 * 60000).toISOString(),
    reporter: 'Đặng Thị I',
    affectedPeople: 0,
    rescueTeams: ['PCCC Bình Dương', 'Cứu hộ công nghiệp']
},
{
    id: 10,
    type: 'disaster',
    title: 'Lốc xoáy tại đồng bằng',
    description: 'Lốc xoáy làm tốc mái nhiều nhà dân',
    location: 'Cần Thơ',
    address: 'Huyện Phong Điền',
    coordinates: [10.1159, 105.5975],
    status: 'active',
    severity: 'medium',
    timestamp: new Date(Date.now() - 85 * 60000).toISOString(),
    reporter: 'Ngô Văn K',
    affectedPeople: 20,
    rescueTeams: ['Cứu hộ Cần Thơ', 'Công an huyện']
},
{
    id: 11,
    type: 'accident',
    title: 'Sập giàn giáo công trình',
    description: 'Sập giàn giáo tầng 10 công trình xây dựng',
    location: 'Hải Phòng',
    address: 'Dự án Vincom, Quận Hồng Bàng',
    coordinates: [20.8580, 106.6821],
    status: 'active',
    severity: 'high',
    timestamp: new Date(Date.now() - 100 * 60000).toISOString(),
    reporter: 'Bùi Thị L',
    affectedPeople: 15,
    rescueTeams: ['Cứu hộ Hải Phòng', 'Cấp cứu 115']
},
{
    id: 12,
    type: 'flood',
    title: 'Vỡ đê sông Hồng',
    description: 'Vỡ đê đoạn qua địa phận huyện',
    location: 'Hưng Yên',
    address: 'Xã Bảo Khê, Thành phố Hưng Yên',
    coordinates: [20.6464, 106.0511],
    status: 'active',
    severity: 'high',
    timestamp: new Date(Date.now() - 115 * 60000).toISOString(),
    reporter: 'Trịnh Văn M',
    affectedPeople: 50,
    rescueTeams: ['Cứu hộ Hưng Yên', 'Quân đội']
},
{
    id: 13,
    type: 'fire',
    title: 'Cháy rừng phòng hộ',
    description: 'Cháy lan rộng tại khu rừng phòng hộ',
    location: 'Kiên Giang',
    address: 'Vườn Quốc gia U Minh Thượng',
    coordinates: [9.6036, 105.0617],
    status: 'active',
    severity: 'high',
    timestamp: new Date(Date.now() - 130 * 60000).toISOString(),
    reporter: 'Phan Thị N',
    affectedPeople: 0,
    rescueTeams: ['Kiểm lâm', 'PCCC Kiên Giang']
},
{
    id: 14,
    type: 'accident',
    title: 'Đắm tàu du lịch',
    description: 'Tàu du lịch bị lật do sóng lớn',
    location: 'Quảng Ninh',
    address: 'Vịnh Hạ Long',
    coordinates: [20.9524, 107.0730],
    status: 'active',
    severity: 'high',
    timestamp: new Date(Date.now() - 145 * 60000).toISOString(),
    reporter: 'Lâm Văn O',
    affectedPeople: 25,
    rescueTeams: ['Cứu hộ biển', 'Cảnh sát biển']
},
{
    id: 15,
    type: 'disaster',
    title: 'Sụt lún đất đô thị',
    description: 'Sụt lún đường phố do thi công ngầm',
    location: 'TP.HCM',
    address: 'Đường Lê Văn Việt, Quận 9',
    coordinates: [10.8449, 106.7870],
    status: 'active',
    severity: 'medium',
    timestamp: new Date(Date.now() - 160 * 60000).toISOString(),
    reporter: 'Hồ Thị P',
    affectedPeople: 0,
    rescueTeams: ['Cứu hộ đô thị', 'Công an Quận 9']
},
{
    id: 16,
    type: 'fire',
    title: 'Cháy chợ truyền thống',
    description: 'Cháy lan nhanh tại khu chợ cũ',
    location: 'Nam Định',
    address: 'Chợ Rồng, Thành phố Nam Định',
    coordinates: [20.4269, 106.1746],
    status: 'resolved',
    severity: 'medium',
    timestamp: new Date(Date.now() - 200 * 60000).toISOString(),
    reporter: 'Vũ Văn Q',
    affectedPeople: 8,
    rescueTeams: ['PCCC Nam Định']
},
{
    id: 17,
    type: 'flood',
    title: 'Triều cường dâng cao',
    description: 'Triều cường vượt báo động 3',
    location: 'Cà Mau',
    address: 'Thành phố Cà Mau',
    coordinates: [9.1769, 105.1500],
    status: 'active',
    severity: 'medium',
    timestamp: new Date(Date.now() - 90 * 60000).toISOString(),
    reporter: 'Trương Thị R',
    affectedPeople: 35,
    rescueTeams: ['Cứu hộ Cà Mau', 'Công an thành phố']
},
{
    id: 18,
    type: 'accident',
    title: 'Rơi thang máy tòa nhà',
    description: 'Thang máy rơi tự do từ tầng 15',
    location: 'Hà Nội',
    address: 'Tòa nhà Keangnam, Quận Nam Từ Liêm',
    coordinates: [21.0169, 105.7850],
    status: 'active',
    severity: 'high',
    timestamp: new Date(Date.now() - 35 * 60000).toISOString(),
    reporter: 'Đỗ Văn S',
    affectedPeople: 6,
    rescueTeams: ['Cứu hộ Hà Nội', 'Cấp cứu 115']
},
{
    id: 19,
    type: 'disaster',
    title: 'Mưa đá kèm gió giật',
    description: 'Mưa đá kèm gió giật mạnh gây thiệt hại',
    location: 'Lạng Sơn',
    address: 'Thành phố Lạng Sơn',
    coordinates: [21.8537, 106.7613],
    status: 'active',
    severity: 'medium',
    timestamp: new Date(Date.now() - 50 * 60000).toISOString(),
    reporter: 'Mạc Thị T',
    affectedPeople: 10,
    rescueTeams: ['Cứu hộ Lạng Sơn', 'Công an thành phố']
},
{
    id: 20,
    type: 'fire',
    title: 'Cháy nhà máy dệt',
    description: 'Cháy kho nguyên liệu nhà máy dệt',
    location: 'Thái Nguyên',
    address: 'KCN Sông Công',
    coordinates: [21.4693, 105.8560],
    status: 'active',
    severity: 'high',
    timestamp: new Date(Date.now() - 65 * 60000).toISOString(),
    reporter: 'Triệu Văn U',
    affectedPeople: 12,
    rescueTeams: ['PCCC Thái Nguyên', 'Cứu hộ công nghiệp']
},
{
    id: 21,
    type: 'flood',
    title: 'Ngập lụt khu du lịch',
    description: 'Ngập nước do triều cường dâng cao',
    location: 'Bà Rịa - Vũng Tàu',
    address: 'Bãi Sau, TP. Vũng Tàu',
    coordinates: [10.3460, 107.0843],
    status: 'active',
    severity: 'medium',
    timestamp: new Date(Date.now() - 75 * 60000).toISOString(),
    reporter: 'Võ Văn V',
    affectedPeople: 0,
    rescueTeams: ['Cứu hộ du lịch', 'Cảnh sát biển']
},
{
    id: 22,
    type: 'accident',
    title: 'Tai nạn tại ngã tư trung tâm',
    description: 'Va chạm giữa xe container và xe máy',
    location: 'Bắc Ninh',
    address: 'Ngã tư đường Ngô Gia Tự - Lê Chân',
    coordinates: [21.1861, 106.0763],
    status: 'resolved',
    severity: 'medium',
    timestamp: new Date(Date.now() - 95 * 60000).toISOString(),
    reporter: 'Nguyễn Thị W',
    affectedPeople: 1,
    rescueTeams: ['Cứu thương 115', 'Cảnh sát giao thông']
},
{
    id: 23,
    type: 'disaster',
    title: 'Lũ lụt diện rộng',
    description: 'Lũ lụt diện rộng, nhiều xã bị cô lập',
    location: 'Quảng Nam',
    address: 'Huyện Đại Lộc',
    coordinates: [15.8801, 108.3380],
    status: 'active',
    severity: 'high',
    timestamp: new Date(Date.now() - 110 * 60000).toISOString(),
    reporter: 'Trần Văn X',
    affectedPeople: 45,
    rescueTeams: ['Cứu hộ lũ lụt', 'Quân đội địa phương']
},
{
    id: 24,
    type: 'fire',
    title: 'Cháy khách sạn tại trung tâm',
    description: 'Cháy lớn tại tầng 5 khách sạn',
    location: 'Khánh Hòa',
    address: 'Đường Trần Phú, TP. Nha Trang',
    coordinates: [12.2388, 109.1967],
    status: 'active',
    severity: 'high',
    timestamp: new Date(Date.now() - 125 * 60000).toISOString(),
    reporter: 'Lê Thị Y',
    affectedPeople: 20,
    rescueTeams: ['PCCC Nha Trang', 'Cứu thương 115']
},
{
    id: 25,
    type: 'flood',
    title: 'Ngập lụt khu vực nông thôn',
    description: 'Ngập nước sâu 0.6m ảnh hưởng nông nghiệp',
    location: 'Tiền Giang',
    address: 'Xã Mỹ Phước, Huyện Cái Bè',
    coordinates: [10.3765, 106.3432],
    status: 'active',
    severity: 'medium',
    timestamp: new Date(Date.now() - 140 * 60000).toISOString(),
    reporter: 'Phan Văn Z',
    affectedPeople: 15,
    rescueTeams: ['Cứu hộ nông nghiệp', 'Chính quyền địa phương']
},
{
    id: 26,
    type: 'accident',
    title: 'Tai nạn xe tải chở hóa chất',
    description: 'Xe tải chở hóa chất bị lật, nguy cơ rò rỉ',
    location: 'Hải Dương',
    address: 'Quốc lộ 5, Km38',
    coordinates: [20.9401, 106.3330],
    status: 'active',
    severity: 'high',
    timestamp: new Date(Date.now() - 155 * 60000).toISOString(),
    reporter: 'Nguyễn Văn AA',
    affectedPeople: 3,
    rescueTeams: ['Đội đặc biệt hóa chất', 'Cảnh sát môi trường']
},
{
    id: 27,
    type: 'disaster',
    title: 'Lốc xoáy tại huyện',
    description: 'Lốc xoáy làm tốc mái nhiều nhà dân',
    location: 'Nghệ An',
    address: 'Huyện Quỳnh Lưu',
    coordinates: [19.0532, 104.8372],
    status: 'active',
    severity: 'high',
    timestamp: new Date(Date.now() - 170 * 60000).toISOString(),
    reporter: 'Trần Thị BB',
    affectedPeople: 18,
    rescueTeams: ['Cứu hộ thiên tai', 'Quân đội địa phương']
},
{
    id: 28,
    type: 'fire',
    title: 'Cháy rừng phòng hộ',
    description: 'Cháy rừng quy mô nhỏ, đã khống chế',
    location: 'Ninh Thuận',
    address: 'Rừng phòng hộ Ninh Sơn',
    coordinates: [11.5682, 108.9771],
    status: 'resolved',
    severity: 'medium',
    timestamp: new Date(Date.now() - 185 * 60000).toISOString(),
    reporter: 'Lê Văn CC',
    affectedPeople: 0,
    rescueTeams: ['Kiểm lâm', 'Lực lượng địa phương']
},
{
    id: 29,
    type: 'flood',
    title: 'Ngập lụt khu vực ven biển',
    description: 'Ngập nước do triều cường dâng cao',
    location: 'Sóc Trăng',
    address: 'Huyện Trần Đề',
    coordinates: [9.6025, 105.9732],
    status: 'active',
    severity: 'medium',
    timestamp: new Date(Date.now() - 200 * 60000).toISOString(),
    reporter: 'Phạm Thị DD',
    affectedPeople: 8,
    rescueTeams: ['Cứu hộ thủy sản', 'Chính quyền địa phương']
},
{
    id: 30,
    type: 'accident',
    title: 'Tai nạn xe khách trên cao tốc',
    description: 'Xe khách va chạm với xe tải, 10 người bị thương',
    location: 'Đồng Nai',
    address: 'Cao tốc TP.HCM - Long Thành - Dầu Giây, Km50',
    coordinates: [10.9574, 106.8429],
    status: 'active',
    severity: 'high',
    timestamp: new Date(Date.now() - 215 * 60000).toISOString(),
    reporter: 'Nguyễn Văn EE',
    affectedPeople: 10,
    rescueTeams: ['Cứu thương 115', 'Cảnh sát giao thông']
},
{
    id: 31,
    type: 'disaster',
    title: 'Sạt lở núi',
    description: 'Sạt lở đất chặn đường liên xã',
    location: 'Bình Định',
    address: 'Huyện Vĩnh Thạnh',
    coordinates: [14.1665, 108.9027],
    status: 'active',
    severity: 'high',
    timestamp: new Date(Date.now() - 230 * 60000).toISOString(),
    reporter: 'Trần Văn FF',
    affectedPeople: 25,
    rescueTeams: ['Cứu hộ khẩn cấp', 'Quân đội địa phương']
},
{
    id: 32,
    type: 'fire',
    title: 'Cháy xưởng gỗ',
    description: 'Cháy tại xưởng sản xuất đồ gỗ',
    location: 'Thái Nguyên',
    address: 'TP. Thái Nguyên',
    coordinates: [21.5944, 105.8482],
    status: 'active',
    severity: 'medium',
    timestamp: new Date(Date.now() - 245 * 60000).toISOString(),
    reporter: 'Lê Thị GG',
    affectedPeople: 5,
    rescueTeams: ['PCCC Thái Nguyên', 'Cảnh sát phòng cháy']
},
{
    id: 33,
    type: 'flood',
    title: 'Ngập cục bộ sau mưa',
    description: 'Ngập nước nhẹ do hệ thống thoát nước quá tải',
    location: 'Nam Định',
    address: 'Đường Trần Hưng Đạo, TP. Nam Định',
    coordinates: [20.4260, 106.1717],
    status: 'active',
    severity: 'low',
    timestamp: new Date(Date.now() - 260 * 60000).toISOString(),
    reporter: 'Phạm Văn HH',
    affectedPeople: 0,
    rescueTeams: ['Đội thoát nước', 'Công ty môi trường']
},
{
    id: 34,
    type: 'accident',
    title: 'Tai nạn tàu thủy trên sông',
    description: 'Va chạm giữa tàu chở hàng và tàu cá',
    location: 'Long An',
    address: 'Sông Vàm Cỏ, Huyện Cần Giuộc',
    coordinates: [10.6084, 106.6710],
    status: 'active',
    severity: 'high',
    timestamp: new Date(Date.now() - 275 * 60000).toISOString(),
    reporter: 'Nguyễn Thị II',
    affectedPeople: 3,
    rescueTeams: ['Cứu hộ sông nước', 'Cảnh sát biển']
},
{
    id: 35,
    type: 'disaster',
    title: 'Lở đất tại Sa Pa',
    description: 'Sạt lở đất do mưa lớn kéo dài',
    location: 'Lào Cai',
    address: 'Xã San Sả Hồ, Huyện Sa Pa',
    coordinates: [22.3364, 103.8444],
    status: 'active',
    severity: 'high',
    timestamp: new Date(Date.now() - 290 * 60000).toISOString(),
    reporter: 'Trần Văn JJ',
    affectedPeople: 12,
    rescueTeams: ['Cứu hộ khẩn cấp', 'Quân đội địa phương']
}
                
            ]
        };
    }
    
    applyFilters() {
        this.filteredIncidents = this.incidents.filter(incident => {
            // Filter by type
            if (this.currentFilters.type !== 'all' && incident.type !== this.currentFilters.type) {
                return false;
            }
            
            // Filter by province
            if (this.currentFilters.province !== 'all' && incident.location !== this.currentFilters.province) {
                return false;
            }
            
            // Filter by status
            if (this.currentFilters.status !== 'all' && incident.status !== this.currentFilters.status) {
                return false;
            }
            
            // Filter by search
            if (this.currentFilters.search) {
                const searchTerm = this.currentFilters.search.toLowerCase();
                const searchableText = `${incident.title} ${incident.description} ${incident.location} ${incident.address}`.toLowerCase();
                if (!searchableText.includes(searchTerm)) {
                    return false;
                }
            }
            
            return true;
        });
    }
    
    renderIncidents() {
        // Clear existing markers
        this.clearMarkers();
        
        // Add markers for each filtered incident
        this.filteredIncidents.forEach(incident => {
            const marker = this.createIncidentMarker(incident);
            this.markers.push(marker);
        });
        
        // Fit map to show all markers if there are any
        if (this.filteredIncidents.length > 0) {
            const group = new L.featureGroup(this.markers);
            this.map.fitBounds(group.getBounds().pad(0.1));
        }
    }
    
    createIncidentMarker(incident) {
        const icon = this.getIconForIncident(incident);
        
        const marker = L.marker(incident.coordinates, { icon: icon })
            .addTo(this.map)
            .bindPopup(this.createPopupContent(incident));
        
        // Add click handler
        marker.on('click', () => {
            this.onIncidentClick(incident);
        });
        
        return marker;
    }
    
    getIconForIncident(incident) {
        const iconColors = {
            fire: '#ef4444',
            flood: '#3b82f6', 
            accident: '#f97316',
            disaster: '#8b5cf6'
        };
        
        const statusClass = incident.status === 'active' ? 'active' : 'resolved';
        const color = iconColors[incident.type] || '#6b7280';
        
        const iconHtml = `
            <div class="incident-marker ${incident.type} ${statusClass}" 
                 style="background-color: ${color}; border-color: ${color}">
                <i data-feather="${this.getIconForType(incident.type)}"></i>
            </div>
        `;
        
        return L.divIcon({
            html: iconHtml,
            className: 'incident-marker-container',
            iconSize: [32, 32],
            iconAnchor: [16, 16]
        });
    }
    
    getIconForType(type) {
        const icons = {
            fire: 'flame',
            flood: 'droplet',
            accident: 'activity',
            disaster: 'alert-octagon'
        };
        
        return icons[type] || 'alert-circle';
    }
    
    createPopupContent(incident) {
        return `
            <div class="incident-popup p-3 min-w-[250px]">
                <div class="flex justify-between items-start mb-2">
                    <span class="px-2 py-1 rounded text-xs font-medium ${this.getStatusColor(incident.status)}">
                        ${this.getTypeLabel(incident.type)}
                    </span>
                    <span class="px-2 py-1 rounded text-xs font-medium ${
                        incident.status === 'active' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                    }">
                        ${incident.status === 'active' ? 'Đang xử lý' : 'Đã giải quyết'}
                    </span>
                </div>
                <h3 class="font-bold text-gray-900 mb-2">${incident.title}</h3>
                <div class="text-sm text-gray-600 mb-2">
                    <div class="flex items-center mb-1">
                        <i data-feather="map-pin" class="w-3 h-3 mr-1"></i>
                        ${incident.address}
                    </div>
                    <div class="flex items-center mb-1">
                        <i data-feather="clock" class="w-3 h-3 mr-1"></i>
                        ${this.formatTimeAgo(incident.timestamp)}
                    </div>
                    <div class="flex items-center">
                        <i data-feather="users" class="w-3 h-3 mr-1"></i>
                        ${incident.affectedPeople} người ảnh hưởng
                    </div>
                </div>
                <div class="flex space-x-2 mt-3">
                    <button onclick="window.emergencyMap.viewIncidentDetails(${incident.id})" 
                            class="flex-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition">
                        Chi tiết
                    </button>
                    <button onclick="window.emergencyMap.shareIncident(${incident.id})" 
                            class="flex-1 border border-gray-300 hover:bg-gray-50 px-3 py-1 rounded text-sm transition">
                        Chia sẻ
                    </button>
                </div>
            </div>
        `;
    }
    
    getStatusColor(status) {
        const colors = {
            active: 'bg-red-100 text-red-800',
            resolved: 'bg-green-100 text-green-800'
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    }
    
    getTypeLabel(type) {
        const labels = {
            fire: '🔥 Hỏa hoạn',
            flood: '💧 Ngập lụt', 
            accident: '🚗 Tai nạn',
            disaster: '🌪️ Thiên tai'
        };
        return labels[type] || 'Sự cố';
    }

    formatTimeAgo(date) {
        const now = new Date();
        const diffMs = now - new Date(date);
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);
        
        if (diffMins < 1) return 'Vừa xong';
        if (diffMins < 60) return `${diffMins} phút trước`;
        if (diffHours < 24) return `${diffHours} giờ trước`;
        if (diffDays < 7) return `${diffDays} ngày trước`;
        
        return new Date(date).toLocaleDateString('vi-VN');
    }
    
    onIncidentClick(incident) {
        // Update statistics panel
        this.updateActiveIncident(incident);
        
        // Log analytics
        this.trackIncidentView(incident);
    }
    
    updateStatistics() {
        const activeCount = this.incidents.filter(i => i.status === 'active').length;
        const resolvedCount = this.incidents.filter(i => i.status === 'resolved').length;
        const totalCount = this.incidents.length;
        
        // Update counters
        const activeEl = document.getElementById('active-incidents');
        const resolvedEl = document.getElementById('resolved-incidents');
        const totalEl = document.getElementById('total-incidents');
        
        if (activeEl) activeEl.textContent = activeCount;
        if (resolvedEl) resolvedEl.textContent = resolvedCount;
        if (totalEl) totalEl.textContent = totalCount;
        
        // Update recent incidents counters
        const recentActiveEl = document.getElementById('recent-active-incidents');
        const recentResolvedEl = document.getElementById('recent-resolved-incidents');
        const recentTotalEl = document.getElementById('recent-total-incidents');
        const recentTodayEl = document.getElementById('recent-today-incidents');
        
        if (recentActiveEl) recentActiveEl.textContent = activeCount;
        if (recentResolvedEl) recentResolvedEl.textContent = resolvedCount;
        if (recentTotalEl) recentTotalEl.textContent = totalCount;
        
        // Calculate today's incidents
        const todayCount = this.incidents.filter(i => {
            const incidentDate = new Date(i.timestamp);
            const today = new Date();
            return incidentDate.toDateString() === today.toDateString();
        }).length;
        
        if (recentTodayEl) recentTodayEl.textContent = todayCount;
        
        // Update type-specific counters
        this.updateTypeCounters();
    }
    
    updateTypeCounters() {
        const types = ['fire', 'flood', 'accident', 'disaster'];
        
        types.forEach(type => {
            const count = this.incidents.filter(i => i.type === type && i.status === 'active').length;
            const counterElement = document.getElementById(`count-${type}`);
            if (counterElement) {
                counterElement.textContent = count;
            }
        });
    }
    
    updateActiveIncident(incident) {
        // Update any active incident details panel if exists
        console.log('Active incident:', incident);
    }
    
    initStatistics() {
        // Initialize statistics with default values
        this.updateStatistics();
    }
    
    initRecentIncidents() {
        this.updateRecentIncidentsList();
        this.setupRecentIncidentsFilters();
    }
    
    updateRecentIncidentsList(incidents = this.incidents) {
        const container = document.getElementById('recent-incidents-list');
        if (!container) return;
        
        // Sort incidents by timestamp (newest first)
        const sortedIncidents = [...incidents].sort((a, b) => 
            new Date(b.timestamp) - new Date(a.timestamp)
        );
        
        // Take only first 6 incidents for display
        const displayIncidents = sortedIncidents.slice(0, 6);
        
        if (displayIncidents.length === 0) {
            container.innerHTML = `
                <div class="col-span-2 text-center py-8">
                    <i data-feather="inbox" class="w-12 h-12 text-gray-400 mx-auto mb-4"></i>
                    <p class="text-gray-500">Không có sự cố nào để hiển thị</p>
                </div>
            `;
        } else {
            container.innerHTML = displayIncidents.map(incident => `
                <div class="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
                    <div class="flex justify-between items-start mb-2">
                        <span class="px-2 py-1 rounded text-xs font-medium ${this.getStatusColor(incident.status)}">
                            ${this.getTypeLabel(incident.type)}
                        </span>
                        <span class="text-xs text-gray-500">${this.formatTimeAgo(incident.timestamp)}</span>
                    </div>
                    <h4 class="font-semibold text-gray-900 mb-2">${incident.title}</h4>
                    <p class="text-sm text-gray-600 mb-3 line-clamp-2">${incident.description}</p>
                    <div class="flex justify-between items-center">
                        <span class="text-xs text-gray-500">${incident.location}</span>
                        <button onclick="window.emergencyMap.viewIncidentDetails(${incident.id})" 
                                class="text-red-600 hover:text-red-700 text-sm font-medium">
                            Xem chi tiết →
                        </button>
                    </div>
                </div>
            `).join('');
        }
        
        // Refresh feather icons
        if (typeof feather !== 'undefined') {
            feather.replace();
        }
    }
    
    setupRecentIncidentsFilters() {
        const searchInput = document.getElementById('search-recent-incidents');
        const typeFilter = document.getElementById('recent-type-filter');
        const statusFilter = document.getElementById('recent-status-filter');
        const resetBtn = document.getElementById('reset-recent-filters');
        
        if (searchInput) {
            searchInput.addEventListener('input', this.debounce(() => {
                this.filterRecentIncidents();
            }, 300));
        }
        
        if (typeFilter) {
            typeFilter.addEventListener('change', () => {
                this.filterRecentIncidents();
            });
        }
        
        if (statusFilter) {
            statusFilter.addEventListener('change', () => {
                this.filterRecentIncidents();
            });
        }
        
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                this.resetRecentFilters();
            });
        }
    }
    
    filterRecentIncidents() {
        const searchTerm = document.getElementById('search-recent-incidents')?.value.toLowerCase() || '';
        const typeFilter = document.getElementById('recent-type-filter')?.value || 'all';
        const statusFilter = document.getElementById('recent-status-filter')?.value || 'all';
        
        const filtered = this.incidents.filter(incident => {
            // Search filter
            if (searchTerm) {
                const searchable = `${incident.title} ${incident.description} ${incident.location}`.toLowerCase();
                if (!searchable.includes(searchTerm)) return false;
            }
            
            // Type filter
            if (typeFilter !== 'all' && incident.type !== typeFilter) return false;
            
            // Status filter
            if (statusFilter !== 'all' && incident.status !== statusFilter) return false;
            
            return true;
        });
        
        this.updateRecentIncidentsList(filtered);
    }
    
    resetRecentFilters() {
        const searchInput = document.getElementById('search-recent-incidents');
        const typeFilter = document.getElementById('recent-type-filter');
        const statusFilter = document.getElementById('recent-status-filter');
        
        if (searchInput) searchInput.value = '';
        if (typeFilter) typeFilter.value = 'all';
        if (statusFilter) statusFilter.value = 'all';
        
        this.updateRecentIncidentsList();
    }
    
    setupEventListeners() {
        // Province filter
        const provinceFilter = document.getElementById('province-filter');
        if (provinceFilter) {
            provinceFilter.addEventListener('change', (e) => {
                this.currentFilters.province = e.target.value;
                this.loadIncidents();
            });
        }
        
        // Type filter buttons
        document.querySelectorAll('.type-filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const type = e.currentTarget.dataset.type;
                
                // Update active state
                document.querySelectorAll('.type-filter-btn').forEach(b => b.classList.remove('active'));
                e.currentTarget.classList.add('active');
                
                this.currentFilters.type = type;
                this.loadIncidents();
            });
        });
        
        // Reset filters
        const resetBtn = document.getElementById('reset-filters');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                this.resetFilters();
            });
        }
        
        // Incident type legend clicks
        document.querySelectorAll('[data-type]').forEach(element => {
            if (element.classList.contains('cursor-pointer')) {
                element.addEventListener('click', (e) => {
                    const type = e.currentTarget.dataset.type;
                    this.filterByType(type);
                });
            }
        });
    }
    
    setupMapControls() {
        // Locate button
        const locateBtn = document.getElementById('locate-btn');
        if (locateBtn) {
            locateBtn.addEventListener('click', () => {
                this.locateUser();
            });
        }
        
        // Zoom in button
        const zoomInBtn = document.getElementById('zoom-in-btn');
        if (zoomInBtn) {
            zoomInBtn.addEventListener('click', () => {
                this.map.zoomIn();
            });
        }
        
        // Zoom out button
        const zoomOutBtn = document.getElementById('zoom-out-btn');
        if (zoomOutBtn) {
            zoomOutBtn.addEventListener('click', () => {
                this.map.zoomOut();
            });
        }
    }
    
    locateUser() {
        if (!navigator.geolocation) {
            alert('Trình duyệt của bạn không hỗ trợ định vị.');
            return;
        }
        
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                this.map.setView([latitude, longitude], 15);
                
                // Add user location marker
                L.marker([latitude, longitude])
                    .addTo(this.map)
                    .bindPopup('Vị trí của bạn')
                    .openPopup();
            },
            (error) => {
                console.error('Error getting location:', error);
                alert('Không thể xác định vị trí của bạn. Vui lòng kiểm tra cài đặt quyền truy cập vị trí.');
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 60000
            }
        );
    }
    
    filterByType(type) {
        this.currentFilters.type = type;
        
        // Update type filter buttons
        document.querySelectorAll('.type-filter-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.type === type);
        });
        
        this.loadIncidents();
    }
    
    resetFilters() {
        this.currentFilters = {
            type: 'all',
            province: 'all',
            status: 'all',
            search: ''
        };
        
        // Reset form elements
        const provinceFilter = document.getElementById('province-filter');
        if (provinceFilter) provinceFilter.value = 'all';
        
        document.querySelectorAll('.type-filter-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.type === 'all');
        });
        
        this.loadIncidents();
    }
    
    clearMarkers() {
        this.markers.forEach(marker => {
            this.map.removeLayer(marker);
        });
        this.markers = [];
    }
    
    showLoading(show) {
        const mapElement = document.getElementById('incident-map');
        if (mapElement) {
            if (show) {
                mapElement.classList.add('loading');
            } else {
                mapElement.classList.remove('loading');
            }
        }
    }
    
    showError(message) {
        // Simple error notification
        const errorDiv = document.createElement('div');
        errorDiv.className = 'fixed top-4 right-4 bg-red-500 text-white p-4 rounded-lg shadow-lg z-50';
        errorDiv.textContent = message;
        document.body.appendChild(errorDiv);
        
        setTimeout(() => {
            if (document.body.contains(errorDiv)) {
                document.body.removeChild(errorDiv);
            }
        }, 5000);
    }
    
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    trackIncidentView(incident) {
        // Analytics tracking
        if (typeof gtag !== 'undefined') {
            gtag('event', 'view_incident', {
                'event_category': 'engagement',
                'event_label': incident.type,
                'value': incident.id
            });
        }
    }
    
    // Public methods
    viewIncidentDetails(incidentId) {
        const incident = this.incidents.find(i => i.id === incidentId);
        if (incident) {
            // In a real application, this would open a modal or navigate to details page
            alert(`Chi tiết sự cố: ${incident.title}\n\nMô tả: ${incident.description}\nĐịa chỉ: ${incident.address}\nTrạng thái: ${incident.status === 'active' ? 'Đang xử lý' : 'Đã giải quyết'}`);
        }
    }
    
    shareIncident(incidentId) {
        const incident = this.incidents.find(i => i.id === incidentId);
        if (incident && navigator.share) {
            navigator.share({
                title: incident.title,
                text: `Sự cố: ${incident.title} - ${incident.description}`,
                url: `${window.location.origin}/incident-details.html?id=${incidentId}`
            });
        } else {
            // Fallback: copy to clipboard
            const url = `${window.location.origin}/incident-details.html?id=${incidentId}`;
            navigator.clipboard.writeText(url).then(() => {
                alert('Đã sao chép liên kết vào clipboard');
            });
        }
    }
}

// Initialize map when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing EmergencyMap...');
    
    // Wait a bit for the page to fully load
    setTimeout(() => {
        try {
            window.emergencyMap = new EmergencyMap();
            console.log('EmergencyMap initialized successfully');
            
            // Refresh feather icons
            if (typeof feather !== 'undefined') {
                feather.replace();
            }
        } catch (error) {
            console.error('Error initializing EmergencyMap:', error);
        }
    }, 100);
});

// Add CSS for map markers
document.addEventListener('DOMContentLoaded', function() {
    const style = document.createElement('style');
    style.textContent = `
        .incident-marker {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            border: 3px solid;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        }
        
        .incident-marker.active {
            animation: pulse 2s infinite;
        }
        
        .incident-marker.resolved {
            opacity: 0.7;
        }
        
        .line-clamp-2 {
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
        }
        
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); }
        }
        
        .type-filter-btn.active {
            background-color: #ef4444;
            color: white;
        }
        
        .sticky-panel {
            position: sticky;
            top: 100px;
        }

        .map-container {
            height: 600px;
            border-radius: 1rem;
            overflow: hidden;
        }

        .incident-popup .leaflet-popup-content-wrapper {
            border-radius: 0.75rem;
        }
    `;
    document.head.appendChild(style);
});

// Utility function for main.js compatibility
function formatTimeAgo(date) {
    const now = new Date();
    const diffMs = now - new Date(date);
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return 'Vừa xong';
    if (diffMins < 60) return `${diffMins} phút trước`;
    if (diffHours < 24) return `${diffHours} giờ trước`;
    if (diffDays < 7) return `${diffDays} ngày trước`;
    
    return new Date(date).toLocaleDateString('vi-VN');
}

// Debug function
function debugEmergencyMap() {
    console.log('=== DEBUG EmergencyMap ===');
    console.log('EmergencyMap instance:', window.emergencyMap);
    if (window.emergencyMap) {
        console.log('Map object:', window.emergencyMap.map);
        console.log('Incidents:', window.emergencyMap.incidents);
        console.log('Markers:', window.emergencyMap.markers);
    }
    console.log('Map container:', document.getElementById('incident-map'));
}

// Call debug after initialization
setTimeout(debugEmergencyMap, 3000);
















 //map// Khởi tạo bản đồ// map.js
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
                    <button onclick="showIncidentDetail('${incident.id}')" 
                            class="w-full bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition">
                        Xem chi tiết
                    </button>
                </div>
            `);

            // Lưu thông tin sự cố vào marker
            marker.incidentData = incident;
            markers.push(marker);
        });

        // Cập nhật thống kê
        updateStatistics(incidentsToShow);
    }

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
            // ... thêm các tỉnh thành khác
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
});







//tự zoom map
// map-new.js
class EmergencyMapSystem {
    constructor() {
        this.map = null;
        this.incidentData = [];
        this.mapMarkers = [];
        this.currentPopup = null;
        this.init();
    }

    init() {
        this.createMap();
        this.loadEmergencyData();
        this.setupEventListeners();
        this.setupMapControls();
    }

    createMap() {
        this.map = L.map('incident-map').setView([16.0471, 108.2062], 6);
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 18
        }).addTo(this.map);
    }

    loadEmergencyData() {
        this.incidentData = [
            {
        id: 'EM001',
        category: 'fire',
        state: 'active',
        severity: 'high',
        coordinates: [21.0278, 105.8342],
        name: 'Cháy chung cư tại Cầu Giấy',
        location: '123 Trần Duy Hưng, Cầu Giấy, Hà Nội',
        region: 'hanoi',
        reportedAt: '15:30, 12/11/2023',
        details: 'Cháy lớn tại tầng 12 chung cư Golden West, nhiều người mắc kẹt bên trong. Lực lượng cứu hộ đang có mặt tại hiện trường.',
        reporterInfo: {
            fullname: 'Nguyễn Văn A',
            mobile: '0912 345 678',
            reportTime: '15:25, 12/11/2023'
        },
        responseUnits: [
            { unitName: 'Đội PCCC Quận Cầu Giấy', unitStatus: 'Đang di chuyển' },
            { unitName: 'Xe cứu thương 115', unitStatus: 'Có mặt tại hiện trường' }
        ],
        progress: [
            { timestamp: '15:25', event: 'Tiếp nhận báo cáo sự cố' },
            { timestamp: '15:28', event: 'Điều động đội PCCC' },
            { timestamp: '15:35', event: 'Lực lượng có mặt tại hiện trường' }
        ]
    },
    {
        id: 'EM002',
        category: 'flood',
        state: 'active',
        severity: 'medium',
        coordinates: [10.8231, 106.6297],
        name: 'Ngập nước nghiêm trọng tại Quận 1',
        location: 'Đường Nguyễn Huệ, Quận 1, TP.HCM',
        region: 'hochiminh',
        reportedAt: '14:15, 12/11/2023',
        details: 'Ngập nước sâu 0.5m sau cơn mưa lớn, nhiều phương tiện bị kẹt. Đội cứu hộ đang hỗ trợ người dân di chuyển.',
        reporterInfo: {
            fullname: 'Trần Thị B',
            mobile: '0934 567 890',
            reportTime: '14:10, 12/11/2023'
        },
        responseUnits: [
            { unitName: 'Đội cứu hộ đô thị', unitStatus: 'Có mặt tại hiện trường' },
            { unitName: 'Cảnh sát giao thông', unitStatus: 'Phân luồng giao thông' }
        ],
        progress: [
            { timestamp: '14:10', event: 'Tiếp nhận báo cáo sự cố' },
            { timestamp: '14:12', event: 'Cảnh báo người dân' },
            { timestamp: '14:20', event: 'Triển khai lực lượng ứng phó' }
        ]
    },
    {
        id: 'EM003',
        category: 'accident',
        state: 'resolved',
        severity: 'high',
        coordinates: [16.0544, 108.2022],
        name: 'Tai nạn giao thông trên cầu Sông Hàn',
        location: 'Cầu Sông Hàn, Đà Nẵng',
        region: 'danang',
        reportedAt: '10:45, 12/11/2023',
        details: 'Va chạm giữa xe tải và xe máy, một người bị thương nặng. Sự cố đã được xử lý, giao thông thông suốt trở lại.',
        reporterInfo: {
            fullname: 'Lê Văn C',
            mobile: '0978 901 234',
            reportTime: '10:40, 12/11/2023'
        },
        responseUnits: [
            { unitName: 'Xe cứu thương 115', unitStatus: 'Đã hoàn thành' },
            { unitName: 'Cảnh sát giao thông', unitStatus: 'Đã giải tỏa' }
        ],
        progress: [
            { timestamp: '10:40', event: 'Tiếp nhận báo cáo sự cố' },
            { timestamp: '10:43', event: 'Điều động xe cứu thương' },
            { timestamp: '10:50', event: 'Lực lượng có mặt tại hiện trường' },
            { timestamp: '11:15', event: 'Sự cố đã được giải quyết' }
        ]
    },
    {
        id: 'EM004',
        category: 'disaster',
        state: 'active',
        severity: 'high',
        coordinates: [16.4637, 107.5909],
        name: 'Sạt lở đất tại huyện A Lưới',
        location: 'Xã Hồng Vân, Huyện A Lưới, Thừa Thiên Huế',
        region: 'hue',
        reportedAt: '09:20, 12/11/2023',
        details: 'Sạt lở đất sau mưa lớn, nhiều hộ dân bị ảnh hưởng. Lực lượng cứu hộ đang tiến hành sơ tán người dân.',
        reporterInfo: {
            fullname: 'Phạm Thị D',
            mobile: '0901 234 567',
            reportTime: '09:15, 12/11/2023'
        },
        responseUnits: [
            { unitName: 'Đội cứu hộ khẩn cấp', unitStatus: 'Đang sơ tán' },
            { unitName: 'Quân đội địa phương', unitStatus: 'Hỗ trợ' }
        ],
        progress: [
            { timestamp: '09:15', event: 'Tiếp nhận báo cáo sự cố' },
            { timestamp: '09:18', event: 'Cảnh báo và sơ tán người dân' },
            { timestamp: '09:30', event: 'Triển khai lực lượng cứu hộ' }
        ]
    },
    {
        id: 'EM005',
        category: 'fire',
        state: 'active',
        severity: 'high',
        coordinates: [20.9814, 105.7942],
        name: 'Cháy nhà máy sản xuất',
        location: 'Khu công nghiệp Vĩnh Tuy, Hà Đông, Hà Nội',
        region: 'hanoi',
        reportedAt: '13:10, 12/11/2023',
        details: 'Cháy lớn tại nhà máy sản xuất linh kiện điện tử, khói đen bao phủ khu vực. Đang điều động thêm lực lượng.',
        reporterInfo: {
            fullname: 'Hoàng Văn E',
            mobile: '0987 654 321',
            reportTime: '13:05, 12/11/2023'
        },
        responseUnits: [
            { unitName: 'Đội PCCC Hà Đông', unitStatus: 'Đang chữa cháy' },
            { unitName: 'Xe chữa cháy 114', unitStatus: 'Có mặt tại hiện trường' }
        ],
        progress: [
            { timestamp: '13:05', event: 'Tiếp nhận báo cáo sự cố' },
            { timestamp: '13:08', event: 'Điều động 5 xe chữa cháy' },
            { timestamp: '13:15', event: 'Lực lượng có mặt tại hiện trường' }
        ]
    },
    {
        id: 'EM006',
        category: 'flood',
        state: 'active',
        severity: 'medium',
        coordinates: [10.0454, 105.7469],
        name: 'Ngập lụt khu vực trung tâm',
        location: 'Đường 30/4, Quận Ninh Kiều, Cần Thơ',
        region: 'cantho',
        reportedAt: '11:30, 12/11/2023',
        details: 'Ngập nước sâu 0.7m do triều cường kết hợp mưa lớn. Đang tiến hành hút nước và phân luồng giao thông.',
        reporterInfo: {
            fullname: 'Lý Thị F',
            mobile: '0965 432 109',
            reportTime: '11:25, 12/11/2023'
        },
        responseUnits: [
            { unitName: 'Đội thoát nước đô thị', unitStatus: 'Đang hút nước' },
            { unitName: 'Cảnh sát giao thông', unitStatus: 'Phân luồng' }
        ],
        progress: [
            { timestamp: '11:25', event: 'Tiếp nhận báo cáo sự cố' },
            { timestamp: '11:28', event: 'Cảnh báo người dân' },
            { timestamp: '11:35', event: 'Triển khai lực lượng ứng phó' }
        ]
    },
    {
        id: 'EM007',
        category: 'accident',
        state: 'active',
        severity: 'high',
        coordinates: [20.8561, 106.6820],
        name: 'Tai nạn liên hoàn trên cao tốc',
        location: 'Cao tốc Hà Nội - Hải Phòng, Km25',
        region: 'haiphong',
        reportedAt: '08:45, 12/11/2023',
        details: 'Va chạm liên hoàn giữa 5 xe ô tô, nhiều người bị thương. Đang điều động xe cứu thương.',
        reporterInfo: {
            fullname: 'Vũ Văn G',
            mobile: '0943 218 765',
            reportTime: '08:40, 12/11/2023'
        },
        responseUnits: [
            { unitName: 'Xe cứu thương 115', unitStatus: 'Đang di chuyển' },
            { unitName: 'Cảnh sát giao thông', unitStatus: 'Có mặt tại hiện trường' }
        ],
        progress: [
            { timestamp: '08:40', event: 'Tiếp nhận báo cáo sự cố' },
            { timestamp: '08:43', event: 'Điều động 3 xe cứu thương' },
            { timestamp: '08:50', event: 'Lực lượng có mặt tại hiện trường' }
        ]
    },
    {
        id: 'EM008',
        category: 'disaster',
        state: 'active',
        severity: 'high',
        coordinates: [20.1291, 105.3130],
        name: 'Lũ quét tại huyện miền núi',
        location: 'Xã Trung Sơn, Huyện Quan Hóa, Thanh Hóa',
        region: 'thanhhoa',
        reportedAt: '07:20, 12/11/2023',
        details: 'Lũ quét sau mưa lớn, nhiều nhà cửa bị cuốn trôi. Đang tiến hành cứu hộ khẩn cấp.',
        reporterInfo: {
            fullname: 'Đặng Thị H',
            mobile: '0918 765 432',
            reportTime: '07:15, 12/11/2023'
        },
        responseUnits: [
            { unitName: 'Đội cứu hộ khẩn cấp', unitStatus: 'Đang cứu hộ' },
            { unitName: 'Quân đội địa phương', unitStatus: 'Hỗ trợ' }
        ],
        progress: [
            { timestamp: '07:15', event: 'Tiếp nhận báo cáo sự cố' },
            { timestamp: '07:18', event: 'Cảnh báo và sơ tán người dân' },
            { timestamp: '07:30', event: 'Triển khai lực lượng cứu hộ' }
        ]
    },
    {
        id: 'EM009',
        category: 'fire',
        state: 'resolved',
        severity: 'medium',
        coordinates: [19.0532, 104.8372],
        name: 'Cháy rừng tại Vườn Quốc gia',
        location: 'Vườn Quốc gia Pù Mát, Con Cuông, Nghệ An',
        region: 'nghean',
        reportedAt: '16:40, 11/11/2023',
        details: 'Cháy rừng quy mô nhỏ, đã được khống chế. Không có thiệt hại về người.',
        reporterInfo: {
            fullname: 'Bùi Văn I',
            mobile: '0976 543 210',
            reportTime: '16:35, 11/11/2023'
        },
        responseUnits: [
            { unitName: 'Đội kiểm lâm', unitStatus: 'Đã hoàn thành' },
            { unitName: 'Lực lượng địa phương', unitStatus: 'Đã hỗ trợ' }
        ],
        progress: [
            { timestamp: '16:35', event: 'Tiếp nhận báo cáo sự cố' },
            { timestamp: '16:38', event: 'Điều động lực lượng' },
            { timestamp: '17:10', event: 'Dập tắt đám cháy' },
            { timestamp: '17:30', event: 'Sự cố đã được giải quyết' }
        ]
    },
    {
        id: 'EM010',
        category: 'accident',
        state: 'active',
        severity: 'medium',
        coordinates: [21.1861, 106.0763],
        name: 'Tai nạn xe container',
        location: 'Quốc lộ 1A, Thành phố Bắc Ninh',
        region: 'bacninh',
        reportedAt: '12:15, 12/11/2023',
        details: 'Xe container mất lái đâm vào nhà dân. Đang xử lý hiện trường.',
        reporterInfo: {
            fullname: 'Ngô Văn K',
            mobile: '0932 109 876',
            reportTime: '12:10, 12/11/2023'
        },
        responseUnits: [
            { unitName: 'Cảnh sát giao thông', unitStatus: 'Có mặt tại hiện trường' },
            { unitName: 'Đội cứu hộ', unitStatus: 'Đang xử lý' }
        ],
        progress: [
            { timestamp: '12:10', event: 'Tiếp nhận báo cáo sự cố' },
            { timestamp: '12:13', event: 'Điều động cảnh sát GT' },
            { timestamp: '12:20', event: 'Lực lượng có mặt tại hiện trường' }
        ]
    },
    {
        id: 'EM011',
        category: 'flood',
        state: 'active',
        severity: 'high',
        coordinates: [10.3765, 106.3432],
        name: 'Ngập lụt diện rộng tại huyện Cái Bè',
        location: 'Huyện Cái Bè, Tiền Giang',
        region: 'tiengiang',
        reportedAt: '09:45, 12/11/2023',
        details: 'Ngập nước sâu 1m do vỡ đê, nhiều hộ dân bị cô lập. Đang cứu hộ khẩn cấp.',
        reporterInfo: {
            fullname: 'Trần Văn L',
            mobile: '0915 678 432',
            reportTime: '09:40, 12/11/2023'
        },
        responseUnits: [
            { unitName: 'Đội cứu hộ lũ lụt', unitStatus: 'Đang cứu hộ' },
            { unitName: 'Quân đội địa phương', unitStatus: 'Hỗ trợ' }
        ],
        progress: [
            { timestamp: '09:40', event: 'Tiếp nhận báo cáo sự cố' },
            { timestamp: '09:43', event: 'Cảnh báo và sơ tán người dân' },
            { timestamp: '09:50', event: 'Triển khai lực lượng cứu hộ' }
        ]
    },
    {
        id: 'EM012',
        category: 'disaster',
        state: 'active',
        severity: 'high',
        coordinates: [11.9404, 108.4587],
        name: 'Sạt lở đất tại Đà Lạt',
        location: 'Đường Hồ Tùng Mậu, Đà Lạt, Lâm Đồng',
        region: 'lamdong',
        reportedAt: '08:30, 12/11/2023',
        details: 'Sạt lở đất sau mưa lớn, một số nhà bị vùi lấp. Đang tìm kiếm người mất tích.',
        reporterInfo: {
            fullname: 'Phan Thị M',
            mobile: '0986 543 210',
            reportTime: '08:25, 12/11/2023'
        },
        responseUnits: [
            { unitName: 'Đội cứu hộ khẩn cấp', unitStatus: 'Đang tìm kiếm' },
            { unitName: 'Cảnh sát PCCC', unitStatus: 'Hỗ trợ' }
        ],
        progress: [
            { timestamp: '08:25', event: 'Tiếp nhận báo cáo sự cố' },
            { timestamp: '08:28', event: 'Điều động lực lượng cứu hộ' },
            { timestamp: '08:35', event: 'Lực lượng có mặt tại hiện trường' }
        ]
    },
    {
        id: 'EM013',
        category: 'fire',
        state: 'active',
        severity: 'high',
        coordinates: [12.2388, 109.1967],
        name: 'Cháy kho xưởng tại Nha Trang',
        location: 'Khu công nghiệp Bắc Nha Trang, Khánh Hòa',
        region: 'khanhhoa',
        reportedAt: '16:20, 12/11/2023',
        details: 'Cháy lớn tại kho chứa vật liệu xây dựng, khói đen dày đặc. Đang chữa cháy.',
        reporterInfo: {
            fullname: 'Lê Văn N',
            mobile: '0975 432 109',
            reportTime: '16:15, 12/11/2023'
        },
        responseUnits: [
            { unitName: 'Đội PCCC Nha Trang', unitStatus: 'Đang chữa cháy' },
            { unitName: 'Xe chữa cháy 114', unitStatus: 'Có mặt tại hiện trường' }
        ],
        progress: [
            { timestamp: '16:15', event: 'Tiếp nhận báo cáo sự cố' },
            { timestamp: '16:18', event: 'Điều động 4 xe chữa cháy' },
            { timestamp: '16:25', event: 'Lực lượng có mặt tại hiện trường' }
        ]
    },
    {
        id: 'EM014',
        category: 'accident',
        state: 'active',
        severity: 'medium',
        coordinates: [20.9401, 106.3330],
        name: 'Tai nạn giao thông trên Quốc lộ 5',
        location: 'Quốc lộ 5, Km45, Hải Dương',
        region: 'haiduong',
        reportedAt: '14:50, 12/11/2023',
        details: 'Va chạm giữa xe khách và xe tải, 5 người bị thương. Đang cấp cứu.',
        reporterInfo: {
            fullname: 'Nguyễn Thị O',
            mobile: '0967 890 123',
            reportTime: '14:45, 12/11/2023'
        },
        responseUnits: [
            { unitName: 'Xe cứu thương 115', unitStatus: 'Đang cấp cứu' },
            { unitName: 'Cảnh sát giao thông', unitStatus: 'Có mặt tại hiện trường' }
        ],
        progress: [
            { timestamp: '14:45', event: 'Tiếp nhận báo cáo sự cố' },
            { timestamp: '14:48', event: 'Điều động 2 xe cứu thương' },
            { timestamp: '14:55', event: 'Lực lượng có mặt tại hiện trường' }
        ]
    },
    {
        id: 'EM015',
        category: 'flood',
        state: 'resolved',
        severity: 'low',
        coordinates: [9.1768, 105.1520],
        name: 'Ngập cục bộ tại trung tâm thành phố',
        location: 'Đường Phan Ngọc Hiển, TP. Cà Mau',
        region: 'camau',
        reportedAt: '10:15, 11/11/2023',
        details: 'Ngập nước nhẹ do triều cường, đã rút hết. Giao thông thông suốt.',
        reporterInfo: {
            fullname: 'Võ Văn P',
            mobile: '0933 444 555',
            reportTime: '10:10, 11/11/2023'
        },
        responseUnits: [
            { unitName: 'Đội thoát nước', unitStatus: 'Đã hoàn thành' },
            { unitName: 'Công ty môi trường', unitStatus: 'Đã xử lý' }
        ],
        progress: [
            { timestamp: '10:10', event: 'Tiếp nhận báo cáo sự cố' },
            { timestamp: '10:12', event: 'Thông báo cho công ty thoát nước' },
            { timestamp: '11:30', event: 'Nước đã rút hết' }
        ]
    },
    {
        id: 'EM016',
        category: 'fire',
        state: 'active',
        severity: 'high',
        coordinates: [10.0454, 105.7469],
        name: 'Cháy chợ nổi Cái Răng',
        location: 'Chợ nổi Cái Răng, Quận Cái Răng, Cần Thơ',
        region: 'cantho',
        reportedAt: '03:15, 13/11/2023',
        details: 'Cháy lớn tại khu vực chợ nổi, nhiều thuyền buôn bị thiêu rụi. Đang chữa cháy.',
        reporterInfo: {
            fullname: 'Lâm Văn Q',
            mobile: '0919 876 543',
            reportTime: '03:10, 13/11/2023'
        },
        responseUnits: [
            { unitName: 'Đội PCCC Cần Thơ', unitStatus: 'Đang chữa cháy' },
            { unitName: 'Cảnh sát sông nước', unitStatus: 'Hỗ trợ' }
        ],
        progress: [
            { timestamp: '03:10', event: 'Tiếp nhận báo cáo sự cố' },
            { timestamp: '03:13', event: 'Điều động 3 xe chữa cháy' },
            { timestamp: '03:20', event: 'Lực lượng có mặt tại hiện trường' }
        ]
    },
    {
        id: 'EM017',
        category: 'flood',
        state: 'active',
        severity: 'high',
        coordinates: [16.4637, 107.5909],
        name: 'Ngập lụt khu vực trung tâm thành phố Huế',
        location: 'Đường Lê Lợi, TP. Huế, Thừa Thiên Huế',
        region: 'hue',
        reportedAt: '17:45, 13/11/2023',
        details: 'Ngập nước sâu 0.8m do mưa lớn kết hợp triều cường. Đang hỗ trợ người dân.',
        reporterInfo: {
            fullname: 'Trần Thị R',
            mobile: '0935 678 901',
            reportTime: '17:40, 13/11/2023'
        },
        responseUnits: [
            { unitName: 'Đội cứu hộ đô thị', unitStatus: 'Đang hỗ trợ' },
            { unitName: 'Cảnh sát giao thông', unitStatus: 'Phân luồng' }
        ],
        progress: [
            { timestamp: '17:40', event: 'Tiếp nhận báo cáo sự cố' },
            { timestamp: '17:43', event: 'Cảnh báo người dân' },
            { timestamp: '17:50', event: 'Triển khai lực lượng ứng phó' }
        ]
    },
    {
        id: 'EM018',
        category: 'accident',
        state: 'active',
        severity: 'high',
        coordinates: [21.0278, 105.8342],
        name: 'Tai nạn xe buýt trên cầu Vĩnh Tuy',
        location: 'Cầu Vĩnh Tuy, Hà Nội',
        region: 'hanoi',
        reportedAt: '08:20, 13/11/2023',
        details: 'Xe buýt mất lái đâm vào lan can cầu, nhiều hành khách bị thương. Đang cấp cứu.',
        reporterInfo: {
            fullname: 'Nguyễn Văn S',
            mobile: '0971 234 567',
            reportTime: '08:15, 13/11/2023'
        },
        responseUnits: [
            { unitName: 'Xe cứu thương 115', unitStatus: 'Đang cấp cứu' },
            { unitName: 'Cảnh sát giao thông', unitStatus: 'Có mặt tại hiện trường' }
        ],
        progress: [
            { timestamp: '08:15', event: 'Tiếp nhận báo cáo sự cố' },
            { timestamp: '08:18', event: 'Điều động 4 xe cứu thương' },
            { timestamp: '08:25', event: 'Lực lượng có mặt tại hiện trường' }
        ]
    },
    {
        id: 'EM019',
        category: 'disaster',
        state: 'active',
        severity: 'high',
        coordinates: [11.9404, 108.4587],
        name: 'Lở đất tại đèo Prenn',
        location: 'Đèo Prenn, Đà Lạt, Lâm Đồng',
        region: 'lamdong',
        reportedAt: '14:30, 13/11/2023',
        details: 'Sạt lở đất chặn hoàn toàn quốc lộ 20, nhiều xe bị mắc kẹt. Đang thông đường.',
        reporterInfo: {
            fullname: 'Phạm Văn T',
            mobile: '0982 345 678',
            reportTime: '14:25, 13/11/2023'
        },
        responseUnits: [
            { unitName: 'Đội cứu hộ giao thông', unitStatus: 'Đang thông đường' },
            { unitName: 'Công ty xây dựng', unitStatus: 'Hỗ trợ' }
        ],
        progress: [
            { timestamp: '14:25', event: 'Tiếp nhận báo cáo sự cố' },
            { timestamp: '14:28', event: 'Cảnh báo và chặn đường' },
            { timestamp: '14:35', event: 'Triển khai lực lượng cứu hộ' }
        ]
    },
    {
        id: 'EM020',
        category: 'fire',
        state: 'active',
        severity: 'medium',
        coordinates: [20.8561, 106.6820],
        name: 'Cháy kho hàng tại cảng',
        location: 'Cảng Hải Phòng, Quận Hải An, Hải Phòng',
        region: 'haiphong',
        reportedAt: '22:10, 13/11/2023',
        details: 'Cháy tại kho chứa hàng hóa xuất khẩu, thiệt hại ban đầu khoảng 2 tỷ đồng.',
        reporterInfo: {
            fullname: 'Lê Thị U',
            mobile: '0916 789 012',
            reportTime: '22:05, 13/11/2023'
        },
        responseUnits: [
            { unitName: 'Đội PCCC Hải Phòng', unitStatus: 'Đang chữa cháy' },
            { unitName: 'Cảnh sát cảng', unitStatus: 'Hỗ trợ' }
        ],
        progress: [
            { timestamp: '22:05', event: 'Tiếp nhận báo cáo sự cố' },
            { timestamp: '22:08', event: 'Điều động 2 xe chữa cháy' },
            { timestamp: '22:15', event: 'Lực lượng có mặt tại hiện trường' }
        ]
    },
    {
        id: 'EM021',
        category: 'flood',
        state: 'active',
        severity: 'medium',
        coordinates: [10.3460, 107.0843],
        name: 'Ngập lụt khu du lịch Bãi Sau',
        location: 'Bãi Sau, TP. Vũng Tàu, Bà Rịa - Vũng Tàu',
        region: 'bariavungtau',
        reportedAt: '16:45, 13/11/2023',
        details: 'Ngập nước do triều cường dâng cao kết hợp mưa lớn.',
        reporterInfo: {
            fullname: 'Võ Văn V',
            mobile: '0936 789 123',
            reportTime: '16:40, 13/11/2023'
        },
        responseUnits: [
            { unitName: 'Đội cứu hộ du lịch', unitStatus: 'Có mặt tại hiện trường' },
            { unitName: 'Cảnh sát biển', unitStatus: 'Hỗ trợ' }
        ],
        progress: [
            { timestamp: '16:40', event: 'Tiếp nhận báo cáo sự cố' },
            { timestamp: '16:43', event: 'Cảnh báo du khách' },
            { timestamp: '16:50', event: 'Triển khai lực lượng ứng phó' }
        ]
    },
    {
        id: 'EM022',
        category: 'accident',
        state: 'resolved',
        severity: 'medium',
        coordinates: [21.1861, 106.0763],
        name: 'Tai nạn tại ngã tư trung tâm',
        location: 'Ngã tư đường Ngô Gia Tự - Lê Chân, TP. Bắc Ninh',
        region: 'bacninh',
        reportedAt: '11:30, 13/11/2023',
        details: 'Va chạm giữa xe container và xe máy, một người bị thương nhẹ.',
        reporterInfo: {
            fullname: 'Nguyễn Thị W',
            mobile: '0972 345 678',
            reportTime: '11:25, 13/11/2023'
        },
        responseUnits: [
            { unitName: 'Xe cứu thương 115', unitStatus: 'Đã hoàn thành' },
            { unitName: 'Cảnh sát giao thông', unitStatus: 'Đã giải tỏa' }
        ],
        progress: [
            { timestamp: '11:25', event: 'Tiếp nhận báo cáo sự cố' },
            { timestamp: '11:28', event: 'Điều động xe cứu thương' },
            { timestamp: '11:35', event: 'Lực lượng có mặt tại hiện trường' },
            { timestamp: '12:00', event: 'Sự cố đã được giải quyết' }
        ]
    },
    {
        id: 'EM023',
        category: 'disaster',
        state: 'active',
        severity: 'high',
        coordinates: [15.8801, 108.3380],
        name: 'Lũ lụt tại huyện Đại Lộc',
        location: 'Huyện Đại Lộc, Quảng Nam',
        region: 'quangnam',
        reportedAt: '09:15, 13/11/2023',
        details: 'Lũ lụt diện rộng, nhiều xã bị cô lập, cần cứu hộ khẩn cấp.',
        reporterInfo: {
            fullname: 'Trần Văn X',
            mobile: '0917 890 123',
            reportTime: '09:10, 13/11/2023'
        },
        responseUnits: [
            { unitName: 'Đội cứu hộ lũ lụt', unitStatus: 'Đang cứu hộ' },
            { unitName: 'Quân đội địa phương', unitStatus: 'Hỗ trợ' }
        ],
        progress: [
            { timestamp: '09:10', event: 'Tiếp nhận báo cáo sự cố' },
            { timestamp: '09:13', event: 'Cảnh báo và sơ tán người dân' },
            { timestamp: '09:20', event: 'Triển khai lực lượng cứu hộ' }
        ]
    },
    {
        id: 'EM024',
        category: 'fire',
        state: 'active',
        severity: 'high',
        coordinates: [12.2388, 109.1967],
        name: 'Cháy khách sạn tại trung tâm Nha Trang',
        location: 'Khách sạn A, đường Trần Phú, TP. Nha Trang',
        region: 'khanhhoa',
        reportedAt: '02:30, 14/11/2023',
        details: 'Cháy lớn tại tầng 5 khách sạn, nhiều du khách mắc kẹt.',
        reporterInfo: {
            fullname: 'Lê Thị Y',
            mobile: '0983 456 789',
            reportTime: '02:25, 14/11/2023'
        },
        responseUnits: [
            { unitName: 'Đội PCCC Nha Trang', unitStatus: 'Đang chữa cháy' },
            { unitName: 'Xe cứu thương 115', unitStatus: 'Có mặt tại hiện trường' }
        ],
        progress: [
            { timestamp: '02:25', event: 'Tiếp nhận báo cáo sự cố' },
            { timestamp: '02:28', event: 'Điều động 4 xe chữa cháy' },
            { timestamp: '02:35', event: 'Lực lượng có mặt tại hiện trường' }
        ]
    },
    {
        id: 'EM025',
        category: 'flood',
        state: 'active',
        severity: 'medium',
        coordinates: [10.3765, 106.3432],
        name: 'Ngập lụt khu vực nông thôn',
        location: 'Xã Mỹ Phước, Huyện Cái Bè, Tiền Giang',
        region: 'tiengiang',
        reportedAt: '13:20, 14/11/2023',
        details: 'Ngập nước sâu 0.6m ảnh hưởng đến sản xuất nông nghiệp.',
        reporterInfo: {
            fullname: 'Phan Văn Z',
            mobile: '0937 890 123',
            reportTime: '13:15, 14/11/2023'
        },
        responseUnits: [
            { unitName: 'Đội cứu hộ nông nghiệp', unitStatus: 'Đang đánh giá' },
            { unitName: 'Chính quyền địa phương', unitStatus: 'Hỗ trợ' }
        ],
        progress: [
            { timestamp: '13:15', event: 'Tiếp nhận báo cáo sự cố' },
            { timestamp: '13:18', event: 'Đánh giá thiệt hại' },
            { timestamp: '13:25', event: 'Triển khai lực lượng ứng phó' }
        ]
    },
    {
        id: 'EM026',
        category: 'accident',
        state: 'active',
        severity: 'high',
        coordinates: [20.9401, 106.3330],
        name: 'Tai nạn xe tải chở hóa chất',
        location: 'Quốc lộ 5, Km38, Hải Dương',
        region: 'haiduong',
        reportedAt: '10:45, 14/11/2023',
        details: 'Xe tải chở hóa chất bị lật, có nguy cơ rò rỉ hóa chất.',
        reporterInfo: {
            fullname: 'Nguyễn Văn AA',
            mobile: '0918 901 234',
            reportTime: '10:40, 14/11/2023'
        },
        responseUnits: [
            { unitName: 'Đội đặc biệt hóa chất', unitStatus: 'Đang xử lý' },
            { unitName: 'Cảnh sát môi trường', unitStatus: 'Hỗ trợ' }
        ],
        progress: [
            { timestamp: '10:40', event: 'Tiếp nhận báo cáo sự cố' },
            { timestamp: '10:43', event: 'Cảnh báo khu vực xung quanh' },
            { timestamp: '10:50', event: 'Triển khai lực lượng đặc biệt' }
        ]
    },
    {
        id: 'EM027',
        category: 'disaster',
        state: 'active',
        severity: 'high',
        coordinates: [19.0532, 104.8372],
        name: 'Lốc xoáy tại huyện Quỳnh Lưu',
        location: 'Huyện Quỳnh Lưu, Nghệ An',
        region: 'nghean',
        reportedAt: '15:30, 14/11/2023',
        details: 'Lốc xoáy làm tốc mái nhiều nhà dân, cây cối đổ ngã.',
        reporterInfo: {
            fullname: 'Trần Thị BB',
            mobile: '0984 567 890',
            reportTime: '15:25, 14/11/2023'
        },
        responseUnits: [
            { unitName: 'Đội cứu hộ thiên tai', unitStatus: 'Đang cứu hộ' },
            { unitName: 'Quân đội địa phương', unitStatus: 'Hỗ trợ' }
        ],
        progress: [
            { timestamp: '15:25', event: 'Tiếp nhận báo cáo sự cố' },
            { timestamp: '15:28', event: 'Đánh giá thiệt hại' },
            { timestamp: '15:35', event: 'Triển khai lực lượng cứu hộ' }
        ]
    },
    {
        id: 'EM028',
        category: 'fire',
        state: 'resolved',
        severity: 'medium',
        coordinates: [11.5682, 108.9771],
        name: 'Cháy rừng phòng hộ',
        location: 'Rừng phòng hộ Ninh Sơn, Ninh Thuận',
        region: 'ninhthuan',
        reportedAt: '12:15, 14/11/2023',
        details: 'Cháy rừng quy mô nhỏ, đã được khống chế thành công.',
        reporterInfo: {
            fullname: 'Lê Văn CC',
            mobile: '0938 901 234',
            reportTime: '12:10, 14/11/2023'
        },
        responseUnits: [
            { unitName: 'Đội kiểm lâm', unitStatus: 'Đã hoàn thành' },
            { unitName: 'Lực lượng địa phương', unitStatus: 'Đã hỗ trợ' }
        ],
        progress: [
            { timestamp: '12:10', event: 'Tiếp nhận báo cáo sự cố' },
            { timestamp: '12:13', event: 'Điều động lực lượng' },
            { timestamp: '12:40', event: 'Dập tắt đám cháy' },
            { timestamp: '13:00', event: 'Sự cố đã được giải quyết' }
        ]
    },
    {
        id: 'EM029',
        category: 'flood',
        state: 'active',
        severity: 'medium',
        coordinates: [9.6025, 105.9732],
        name: 'Ngập lụt khu vực ven biển',
        location: 'Huyện Trần Đề, Sóc Trăng',
        region: 'soctrang',
        reportedAt: '18:30, 14/11/2023',
        details: 'Ngập nước do triều cường dâng cao, ảnh hưởng đến nuôi trồng thủy sản.',
        reporterInfo: {
            fullname: 'Phạm Thị DD',
            mobile: '0919 012 345',
            reportTime: '18:25, 14/11/2023'
        },
        responseUnits: [
            { unitName: 'Đội cứu hộ thủy sản', unitStatus: 'Đang đánh giá' },
            { unitName: 'Chính quyền địa phương', unitStatus: 'Hỗ trợ' }
        ],
        progress: [
            { timestamp: '18:25', event: 'Tiếp nhận báo cáo sự cố' },
            { timestamp: '18:28', event: 'Đánh giá thiệt hại' },
            { timestamp: '18:35', event: 'Triển khai lực lượng ứng phó' }
        ]
    },
    {
        id: 'EM030',
        category: 'accident',
        state: 'active',
        severity: 'high',
        coordinates: [10.9574, 106.8429],
        name: 'Tai nạn xe khách trên cao tốc',
        location: 'Cao tốc TP.HCM - Long Thành - Dầu Giây, Km50',
        region: 'dongnai',
        reportedAt: '07:45, 15/11/2023',
        details: 'Xe khách va chạm với xe tải, 10 người bị thương.',
        reporterInfo: {
            fullname: 'Nguyễn Văn EE',
            mobile: '0973 456 789',
            reportTime: '07:40, 15/11/2023'
        },
        responseUnits: [
            { unitName: 'Xe cứu thương 115', unitStatus: 'Đang cấp cứu' },
            { unitName: 'Cảnh sát giao thông', unitStatus: 'Có mặt tại hiện trường' }
        ],
        progress: [
            { timestamp: '07:40', event: 'Tiếp nhận báo cáo sự cố' },
            { timestamp: '07:43', event: 'Điều động 3 xe cứu thương' },
            { timestamp: '07:50', event: 'Lực lượng có mặt tại hiện trường' }
        ]
    },
    {
        id: 'EM031',
        category: 'disaster',
        state: 'active',
        severity: 'high',
        coordinates: [14.1665, 108.9027],
        name: 'Sạt lở núi tại huyện Vĩnh Thạnh',
        location: 'Huyện Vĩnh Thạnh, Bình Định',
        region: 'binhdinh',
        reportedAt: '11:20, 15/11/2023',
        details: 'Sạt lở đất chặn đường liên xã, nhiều hộ dân bị cô lập.',
        reporterInfo: {
            fullname: 'Trần Văn FF',
            mobile: '0985 678 901',
            reportTime: '11:15, 15/11/2023'
        },
        responseUnits: [
            { unitName: 'Đội cứu hộ khẩn cấp', unitStatus: 'Đang sơ tán' },
            { unitName: 'Quân đội địa phương', unitStatus: 'Hỗ trợ' }
        ],
        progress: [
            { timestamp: '11:15', event: 'Tiếp nhận báo cáo sự cố' },
            { timestamp: '11:18', event: 'Cảnh báo và sơ tán người dân' },
            { timestamp: '11:25', event: 'Triển khai lực lượng cứu hộ' }
        ]
    },
    {
        id: 'EM032',
        category: 'fire',
        state: 'active',
        severity: 'medium',
        coordinates: [21.5944, 105.8482],
        name: 'Cháy xưởng gỗ',
        location: 'Xưởng sản xuất đồ gỗ, TP. Thái Nguyên',
        region: 'thainguyen',
        reportedAt: '14:10, 15/11/2023',
        details: 'Cháy tại xưởng sản xuất đồ gỗ, thiệt hại khoảng 500 triệu đồng.',
        reporterInfo: {
            fullname: 'Lê Thị GG',
            mobile: '0939 012 345',
            reportTime: '14:05, 15/11/2023'
        },
        responseUnits: [
            { unitName: 'Đội PCCC Thái Nguyên', unitStatus: 'Đang chữa cháy' },
            { unitName: 'Cảnh sát phòng cháy', unitStatus: 'Hỗ trợ' }
        ],
        progress: [
            { timestamp: '14:05', event: 'Tiếp nhận báo cáo sự cố' },
            { timestamp: '14:08', event: 'Điều động 2 xe chữa cháy' },
            { timestamp: '14:15', event: 'Lực lượng có mặt tại hiện trường' }
        ]
    },
    {
        id: 'EM033',
        category: 'flood',
        state: 'active',
        severity: 'low',
        coordinates: [20.4260, 106.1717],
        name: 'Ngập cục bộ sau mưa',
        location: 'Đường Trần Hưng Đạo, TP. Nam Định',
        region: 'namdinh',
        reportedAt: '19:30, 15/11/2023',
        details: 'Ngập nước nhẹ do hệ thống thoát nước quá tải.',
        reporterInfo: {
            fullname: 'Phạm Văn HH',
            mobile: '0912 345 678',
            reportTime: '19:25, 15/11/2023'
        },
        responseUnits: [
            { unitName: 'Đội thoát nước', unitStatus: 'Đang xử lý' },
            { unitName: 'Công ty môi trường', unitStatus: 'Hỗ trợ' }
        ],
        progress: [
            { timestamp: '19:25', event: 'Tiếp nhận báo cáo sự cố' },
            { timestamp: '19:28', event: 'Kiểm tra hệ thống thoát nước' },
            { timestamp: '19:35', event: 'Xử lý điểm ngập' }
        ]
    },
    {
        id: 'EM034',
        category: 'accident',
        state: 'active',
        severity: 'high',
        coordinates: [10.6084, 106.6710],
        name: 'Tai nạn tàu thủy trên sông Vàm Cỏ',
        location: 'Sông Vàm Cỏ, Huyện Cần Giuộc, Long An',
        region: 'longan',
        reportedAt: '09:15, 16/11/2023',
        details: 'Va chạm giữa tàu chở hàng và tàu cá, 3 người mất tích.',
        reporterInfo: {
            fullname: 'Nguyễn Thị II',
            mobile: '0986 789 012',
            reportTime: '09:10, 16/11/2023'
        },
        responseUnits: [
            { unitName: 'Đội cứu hộ sông nước', unitStatus: 'Đang tìm kiếm' },
            { unitName: 'Cảnh sát biển', unitStatus: 'Hỗ trợ' }
        ],
        progress: [
            { timestamp: '09:10', event: 'Tiếp nhận báo cáo sự cố' },
            { timestamp: '09:13', event: 'Điều động tàu cứu hộ' },
            { timestamp: '09:20', event: 'Lực lượng có mặt tại hiện trường' }
        ]
    },
    {
        id: 'EM035',
        category: 'disaster',
        state: 'active',
        severity: 'high',
        coordinates: [22.3364, 103.8444],
        name: 'Lở đất tại Sa Pa',
        location: 'Xã San Sả Hồ, Huyện Sa Pa, Lào Cai',
        region: 'laocai',
        reportedAt: '13:45, 16/11/2023',
        details: 'Sạt lở đất do mưa lớn kéo dài, nhiều nhà bị vùi lấp.',
        reporterInfo: {
            fullname: 'Trần Văn JJ',
            mobile: '0913 456 789',
            reportTime: '13:40, 16/11/2023'
        },
        responseUnits: [
            { unitName: 'Đội cứu hộ khẩn cấp', unitStatus: 'Đang tìm kiếm' },
            { unitName: 'Quân đội địa phương', unitStatus: 'Hỗ trợ' }
        ],
        progress: [
            { timestamp: '13:40', event: 'Tiếp nhận báo cáo sự cố' },
            { timestamp: '13:43', event: 'Cảnh báo và sơ tán người dân' },
            { timestamp: '13:50', event: 'Triển khai lực lượng cứu hộ' }
        ]
    },
     {
        "id": "EM036",
        "category": "fire",
        "state": "active",
        "severity": "high",
        "coordinates": [21.0278, 105.8342],
        "name": "Cháy chung cư cao tầng tại Hai Bà Trưng",
        "location": "Số 125 Minh Khai, Hai Bà Trưng, Hà Nội",
        "region": "hanoi",
        "reportedAt": "14:20, 17/11/2023",
        "details": "Cháy lớn tại tầng 15 chung cư Hateco, nhiều cư dân mắc kẹt. Khói đen bốc lên dày đặc.",
        "reporterInfo": {
            "fullname": "Nguyễn Thị Mai",
            "mobile": "0912 345 678",
            "reportTime": "14:15, 17/11/2023"
        },
        "responseUnits": [
            { "unitName": "Đội PCCC quận Hai Bà Trưng", "unitStatus": "Đang chữa cháy" },
            { "unitName": "Cảnh sát giao thông", "unitStatus": "Phân luồng" },
            { "unitName": "Xe cứu thương", "unitStatus": "Sẵn sàng" }
        ],
        "progress": [
            { "timestamp": "14:15", "event": "Tiếp nhận báo cáo sự cố" },
            { "timestamp": "14:18", "event": "Điều động 4 xe chữa cháy" },
            { "timestamp": "14:25", "event": "Lực lượng có mặt tại hiện trường" },
            { "timestamp": "14:40", "event": "Đang tiến hành sơ tán người dân" }
        ]
    },
    {
        "id": "EM037",
        "category": "flood",
        "state": "active",
        "severity": "medium",
        "coordinates": [10.8231, 106.6297],
        "name": "Ngập nước nghiêm trọng khu vực Quận 1",
        "location": "Đường Nguyễn Huệ, Quận 1, TP.HCM",
        "region": "hochiminh",
        "reportedAt": "15:30, 17/11/2023",
        "details": "Ngập nước sâu 0.6m do mưa lớn kết hợp triều cường, nhiều phương tiện bị chết máy.",
        "reporterInfo": {
            "fullname": "Trần Văn Nam",
            "mobile": "0934 567 890",
            "reportTime": "15:25, 17/11/2023"
        },
        "responseUnits": [
            { "unitName": "Đội ứng phó ngập lụt", "unitStatus": "Hút nước" },
            { "unitName": "Cảnh sát cơ động", "unitStatus": "Hỗ trợ người dân" },
            { "unitName": "Công ty thoát nước", "unitStatus": "Thông tắc cống" }
        ],
        "progress": [
            { "timestamp": "15:25", "event": "Tiếp nhận báo cáo sự cố" },
            { "timestamp": "15:28", "event": "Cảnh báo người dân" },
            { "timestamp": "15:35", "event": "Triển khai lực lượng ứng phó" },
            { "timestamp": "16:00", "event": "Đang hút nước và phân luồng" }
        ]
    },
    {
        "id": "EM038",
        "category": "accident",
        "state": "active",
        "severity": "high",
        "coordinates": [16.0472, 108.2062],
        "name": "Tai nạn giao thông nghiêm trọng trên cầu Rồng",
        "location": "Cầu Rồng, Quận Sơn Trà, Đà Nẵng",
        "region": "danang",
        "reportedAt": "09:15, 17/11/2023",
        "details": "Va chạm giữa xe container và 3 xe ô tô, ít nhất 5 người bị thương nặng.",
        "reporterInfo": {
            "fullname": "Lê Văn Hùng",
            "mobile": "0978 901 234",
            "reportTime": "09:10, 17/11/2023"
        },
        "responseUnits": [
            { "unitName": "Xe cứu thương cấp cứu", "unitStatus": "Đang cấp cứu" },
            { "unitName": "Cảnh sát giao thông", "unitStatus": "Điều tiết" },
            { "unitName": "Đội cứu hộ", "unitStatus": "Giải cứu" }
        ],
        "progress": [
            { "timestamp": "09:10", "event": "Tiếp nhận báo cáo sự cố" },
            { "timestamp": "09:13", "event": "Điều động 3 xe cứu thương" },
            { "timestamp": "09:20", "event": "Lực lượng có mặt tại hiện trường" },
            { "timestamp": "09:45", "event": "Đang giải cứu người mắc kẹt" }
        ]
    },
    {
        "id": "EM039",
        "category": "disaster",
        "state": "active",
        "severity": "high",
        "coordinates": [11.9404, 108.4423],
        "name": "Sạt lở đất tại Đà Lạt",
        "location": "Đường Hồ Tùng Mậu, Đà Lạt, Lâm Đồng",
        "region": "lamdong",
        "reportedAt": "08:30, 17/11/2023",
        "details": "Sạt lở đất sau mưa lớn, một số nhà bị vùi lấp. Đang tìm kiếm người mất tích.",
        "reporterInfo": {
            "fullname": "Phan Thị M",
            "mobile": "0986 543 210",
            "reportTime": "08:25, 17/11/2023"
        },
        "responseUnits": [
            { "unitName": "Đội cứu hộ đặc biệt", "unitStatus": "Tìm kiếm" },
            { "unitName": "Quân đội", "unitStatus": "Hỗ trợ" },
            { "unitName": "Y tế", "unitStatus": "Sẵn sàng" }
        ],
        "progress": [
            { "timestamp": "08:25", "event": "Tiếp nhận báo cáo sự cố" },
            { "timestamp": "08:28", "event": "Điều động lực lượng cứu hộ" },
            { "timestamp": "08:35", "event": "Lực lượng có mặt tại hiện trường" },
            { "timestamp": "09:00", "event": "Đang tìm kiếm người mất tích" }
        ]
    },
    {
        "id": "EM040",
        "category": "fire",
        "state": "active",
        "severity": "high",
        "coordinates": [12.2388, 109.1967],
        "name": "Cháy kho xưởng tại Nha Trang",
        "location": "Khu công nghiệp Bắc Nha Trang, Khánh Hòa",
        "region": "khanhhoa",
        "reportedAt": "16:20, 17/11/2023",
        "details": "Cháy lớn tại kho chứa vật liệu xây dựng, khói đen dày đặc. Đang chữa cháy.",
        "reporterInfo": {
            "fullname": "Lê Văn N",
            "mobile": "0975 432 109",
            "reportTime": "16:15, 17/11/2023"
        },
        "responseUnits": [
            { "unitName": "Đội PCCC Nha Trang", "unitStatus": "Chữa cháy" },
            { "unitName": "Cảnh sát", "unitStatus": "Phong tỏa" },
            { "unitName": "Xe cứu hỏa", "unitStatus": "Tiếp nước" }
        ],
        "progress": [
            { "timestamp": "16:15", "event": "Tiếp nhận báo cáo sự cố" },
            { "timestamp": "16:18", "event": "Điều động 4 xe chữa cháy" },
            { "timestamp": "16:25", "event": "Lực lượng có mặt tại hiện trường" },
            { "timestamp": "16:50", "event": "Đang khống chế đám cháy" }
        ]
    },
    {
        "id": "EM041",
        "category": "flood",
        "state": "active",
        "severity": "high",
        "coordinates": [10.0452, 105.7469],
        "name": "Ngập lụt diện rộng tại huyện Cái Bè",
        "location": "Huyện Cái Bè, Tiền Giang",
        "region": "tiengiang",
        "reportedAt": "09:45, 18/11/2023",
        "details": "Ngập nước sâu 1m do vỡ đê, nhiều hộ dân bị cô lập. Đang cứu hộ khẩn cấp.",
        "reporterInfo": {
            "fullname": "Trần Văn L",
            "mobile": "0915 678 432",
            "reportTime": "09:40, 18/11/2023"
        },
        "responseUnits": [
            { "unitName": "Đội cứu hộ lũ lụt", "unitStatus": "Cứu hộ" },
            { "unitName": "Quân đội", "unitStatus": "Vận chuyển" },
            { "unitName": "Y tế", "unitStatus": "Khám chữa" }
        ],
        "progress": [
            { "timestamp": "09:40", "event": "Tiếp nhận báo cáo sự cố" },
            { "timestamp": "09:43", "event": "Cảnh báo và sơ tán người dân" },
            { "timestamp": "09:50", "event": "Triển khai lực lượng cứu hộ" },
            { "timestamp": "10:15", "event": "Đang sơ tán người dân" }
        ]
    },
    {
        "id": "EM042",
        "category": "accident",
        "state": "active",
        "severity": "medium",
        "coordinates": [20.9605, 105.7845],
        "name": "Tai nạn giao thông trên Quốc lộ 5",
        "location": "Quốc lộ 5, Km45, Hải Dương",
        "region": "haiduong",
        "reportedAt": "14:50, 18/11/2023",
        "details": "Va chạm giữa xe khách và xe tải, 5 người bị thương. Đang cấp cứu.",
        "reporterInfo": {
            "fullname": "Nguyễn Thị O",
            "mobile": "0967 890 123",
            "reportTime": "14:45, 18/11/2023"
        },
        "responseUnits": [
            { "unitName": "Xe cứu thương", "unitStatus": "Cấp cứu" },
            { "unitName": "Cảnh sát GT", "unitStatus": "Điều tra" },
            { "unitName": "Cứu hộ", "unitStatus": "Hỗ trợ" }
        ],
        "progress": [
            { "timestamp": "14:45", "event": "Tiếp nhận báo cáo sự cố" },
            { "timestamp": "14:48", "event": "Điều động 2 xe cứu thương" },
            { "timestamp": "14:55", "event": "Lực lượng có mặt tại hiện trường" },
            { "timestamp": "15:20", "event": "Đang điều tra hiện trường" }
        ]
    },
    {
        "id": "EM043",
        "category": "disaster",
        "state": "active",
        "severity": "high",
        "coordinates": [14.0583, 108.2772],
        "name": "Lũ quét tại huyện miền núi",
        "location": "Xã Trung Sơn, Huyện Quan Hóa, Thanh Hóa",
        "region": "thanhhoa",
        "reportedAt": "07:20, 18/11/2023",
        "details": "Lũ quét sau mưa lớn, nhiều nhà cửa bị cuốn trôi. Đang tiến hành cứu hộ khẩn cấp.",
        "reporterInfo": {
            "fullname": "Đặng Thị H",
            "mobile": "0918 765 432",
            "reportTime": "07:15, 18/11/2023"
        },
        "responseUnits": [
            { "unitName": "Đội cứu hộ lũ quét", "unitStatus": "Tìm kiếm" },
            { "unitName": "Quân đội", "unitStatus": "Hỗ trợ" },
            { "unitName": "Y tế", "unitStatus": "Sơ cứu" }
        ],
        "progress": [
            { "timestamp": "07:15", "event": "Tiếp nhận báo cáo sự cố" },
            { "timestamp": "07:18", "event": "Cảnh báo và sơ tán người dân" },
            { "timestamp": "07:30", "event": "Triển khai lực lượng cứu hộ" },
            { "timestamp": "08:00", "event": "Đang tìm kiếm người mất tích" }
        ]
    },
    {
        "id": "EM044",
        "category": "fire",
        "state": "resolved",
        "severity": "medium",
        "coordinates": [19.1075, 104.6328],
        "name": "Cháy rừng tại Vườn Quốc gia",
        "location": "Vườn Quốc gia Pù Mát, Con Cuông, Nghệ An",
        "region": "nghean",
        "reportedAt": "16:40, 18/11/2023",
        "details": "Cháy rừng quy mô nhỏ, đã được khống chế. Không có thiệt hại về người.",
        "reporterInfo": {
            "fullname": "Bùi Văn I",
            "mobile": "0976 543 210",
            "reportTime": "16:35, 18/11/2023"
        },
        "responseUnits": [
            { "unitName": "Kiểm lâm", "unitStatus": "Hoàn thành" },
            { "unitName": "Đội chữa cháy rừng", "unitStatus": "Đã xong" }
        ],
        "progress": [
            { "timestamp": "16:35", "event": "Tiếp nhận báo cáo sự cố" },
            { "timestamp": "16:38", "event": "Điều động lực lượng" },
            { "timestamp": "17:10", "event": "Dập tắt đám cháy" },
            { "timestamp": "17:30", "event": "Sự cố đã được giải quyết" }
        ]
    },
    {
        "id": "EM045",
        "category": "accident",
        "state": "active",
        "severity": "medium",
        "coordinates": [21.1861, 106.0763],
        "name": "Tai nạn xe container",
        "location": "Quốc lộ 1A, Thành phố Bắc Ninh",
        "region": "bacninh",
        "reportedAt": "12:15, 18/11/2023",
        "details": "Xe container mất lái đâm vào nhà dân. Đang xử lý hiện trường.",
        "reporterInfo": {
            "fullname": "Ngô Văn K",
            "mobile": "0932 109 876",
            "reportTime": "12:10, 18/11/2023"
        },
        "responseUnits": [
            { "unitName": "Cảnh sát GT", "unitStatus": "Điều tra" },
            { "unitName": "Cứu hộ", "unitStatus": "Giải quyết" },
            { "unitName": "Xe cẩu", "unitStatus": "Di dời" }
        ],
        "progress": [
            { "timestamp": "12:10", "event": "Tiếp nhận báo cáo sự cố" },
            { "timestamp": "12:13", "event": "Điều động cảnh sát GT" },
            { "timestamp": "12:20", "event": "Lực lượng có mặt tại hiện trường" },
            { "timestamp": "12:45", "event": "Đang di dời container" }
        ]
    }
        ];

        this.displayEmergencyMarkers();
    }

    createEmergencyIcon(emergency) {
        const typeColors = {
            fire: '#e53e3e',
            flood: '#3182ce',
            accident: '#dd6b20',
            disaster: '#805ad5'
        };

        const statusStyles = {
            active: 'emergency-marker-active',
            resolved: 'emergency-marker-resolved'
        };

        const color = typeColors[emergency.category] || '#718096';
        const statusClass = statusStyles[emergency.state] || '';

        return L.divIcon({
            className: `emergency-marker ${statusClass}`,
            html: `
                <div class="emergency-icon" style="background-color: ${color};">
                    <span class="emergency-icon-inner">
                        ${this.getEmergencySymbol(emergency.category)}
                    </span>
                </div>
            `,
            iconSize: [36, 36],
            iconAnchor: [18, 18]
        });
    }

    getEmergencySymbol(type) {
        const symbols = {
            fire: '🔥',
            flood: '💧',
            accident: '🚗',
            disaster: '🌪️'
        };
        return symbols[type] || '⚠️';
    }

    displayEmergencyMarkers() {
        this.clearExistingMarkers();

        this.incidentData.forEach(emergency => {
            const marker = L.marker(emergency.coordinates, {
                icon: this.createEmergencyIcon(emergency)
            }).addTo(this.map);

            marker.emergencyInfo = emergency;

            // Tạo popup thông tin
            const popupContent = this.createPopupContent(emergency);
            marker.bindPopup(popupContent, {
                className: 'emergency-popup',
                maxWidth: 300
            });

            // Sự kiện click marker - ZOOM đến vị trí
            marker.on('click', (e) => {
                this.zoomToEmergencyLocation(emergency);
                this.highlightEmergencyMarker(marker);
            });

            // Sự kiện mở popup
            marker.on('popupopen', () => {
                this.currentPopup = marker;
                this.addPopupActions(marker, emergency);
            });

            this.mapMarkers.push(marker);
        });

        this.updateDashboardStats();
    }

    zoomToEmergencyLocation(emergency) {
        const [lat, lng] = emergency.coordinates;
        
        // Zoom và pan đến vị trí với hiệu ứng mượt
        this.map.flyTo([lat, lng], 14, {
            duration: 1,
            easeLinearity: 0.25
        });

        // Thêm hiệu ứng pulse cho marker
        this.addLocationPulseEffect(emergency.coordinates);
        
        // Highlight emergency trên danh sách
        this.highlightEmergencyInList(emergency.id);
    }

    addLocationPulseEffect(coordinates) {
        // Tạo circle pulse effect
        const pulseCircle = L.circle(coordinates, {
            color: '#e53e3e',
            fillColor: '#fed7d7',
            fillOpacity: 0.3,
            radius: 100
        }).addTo(this.map);

        // Animation circle
        let radius = 100;
        const animatePulse = () => {
            radius += 20;
            pulseCircle.setRadius(radius);
            
            if (radius < 300) {
                requestAnimationFrame(animatePulse);
            } else {
                this.map.removeLayer(pulseCircle);
            }
        };
        
        animatePulse();

        // Tự động xóa circle sau 2 giây
        setTimeout(() => {
            if (this.map.hasLayer(pulseCircle)) {
                this.map.removeLayer(pulseCircle);
            }
        }, 2000);
    }

    highlightEmergencyMarker(marker) {
        // Reset tất cả markers về trạng thái ban đầu
        this.mapMarkers.forEach(m => {
            const iconElement = m.getElement();
            if (iconElement) {
                iconElement.classList.remove('emergency-marker-highlighted');
            }
        });

        // Highlight marker được click
        const clickedIcon = marker.getElement();
        if (clickedIcon) {
            clickedIcon.classList.add('emergency-marker-highlighted');
            
            // Tự động bỏ highlight sau 3 giây
            setTimeout(() => {
                clickedIcon.classList.remove('emergency-marker-highlighted');
            }, 3000);
        }
    }

    highlightEmergencyInList(emergencyId) {
        // Tìm và highlight emergency trong danh sách (nếu có)
        const emergencyElements = document.querySelectorAll('[data-emergency-id]');
        emergencyElements.forEach(element => {
            element.classList.remove('emergency-item-active');
            if (element.dataset.emergencyId === emergencyId) {
                element.classList.add('emergency-item-active');
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        });
    }

    createPopupContent(emergency) {
        return `
            <div class="emergency-popup-content">
                <div class="popup-header">
                    <h4 class="popup-title">${emergency.name}</h4>
                    <div class="popup-badges">
                        <span class="status-badge ${emergency.state}">${this.getStatusText(emergency.state)}</span>
                        <span class="severity-badge ${emergency.severity}">${this.getSeverityText(emergency.severity)}</span>
                    </div>
                </div>
                <div class="popup-body">
                    <p class="popup-location">📍 ${emergency.location}</p>
                    <p class="popup-time">🕒 ${emergency.reportedAt}</p>
                    <p class="popup-description">${emergency.details}</p>
                </div>
                <div class="popup-actions">
                    <button class="popup-btn zoom-btn" onclick="emergencyMap.focusOnEmergency('${emergency.id}')">
                        🔍 Phóng to
                    </button>
                    <button class="popup-btn details-btn" onclick="emergencyMap.showEmergencyDetails('${emergency.id}')">
                        📋 Chi tiết
                    </button>
                </div>
            </div>
        `;
    }

    addPopupActions(marker, emergency) {
        // Thêm sự kiện sau khi popup mở
        setTimeout(() => {
            const popup = marker.getPopup();
            const popupElement = popup.getElement();
            
            if (popupElement) {
                const zoomBtn = popupElement.querySelector('.zoom-btn');
                const detailsBtn = popupElement.querySelector('.details-btn');
                
                if (zoomBtn) {
                    zoomBtn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        this.zoomToEmergencyLocation(emergency);
                    });
                }
                
                if (detailsBtn) {
                    detailsBtn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        this.showEmergencyDetails(emergency.id);
                    });
                }
            }
        }, 100);
    }

    focusOnEmergency(emergencyId) {
        const emergency = this.incidentData.find(em => em.id === emergencyId);
        if (emergency) {
            this.zoomToEmergencyLocation(emergency);
            
            // Mở popup nếu có marker
            const marker = this.mapMarkers.find(m => m.emergencyInfo.id === emergencyId);
            if (marker) {
                marker.openPopup();
            }
        }
    }

    showEmergencyDetails(emergencyId) {
        const emergency = this.incidentData.find(em => em.id === emergencyId);
        if (emergency) {
            // Đóng popup hiện tại
            if (this.currentPopup) {
                this.currentPopup.closePopup();
            }
            
            // Hiển thị modal chi tiết
            this.displayEmergencyModal(emergency);
        }
    }

    displayEmergencyModal(emergency) {
        // Tạo và hiển thị modal chi tiết
        const modalHtml = `
            <div class="emergency-modal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>${emergency.name}</h3>
                        <button class="modal-close" onclick="this.closest('.emergency-modal').remove()">×</button>
                    </div>
                    <div class="modal-body">
                        <div class="emergency-info">
                            <p><strong>Địa điểm:</strong> ${emergency.location}</p>
                            <p><strong>Thời gian:</strong> ${emergency.reportedAt}</p>
                            <p><strong>Mô tả:</strong> ${emergency.details}</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHtml);
    }

    clearExistingMarkers() {
        this.mapMarkers.forEach(marker => {
            this.map.removeLayer(marker);
        });
        this.mapMarkers = [];
    }

    updateDashboardStats() {
        const total = this.incidentData.length;
        const active = this.incidentData.filter(em => em.state === 'active').length;
        const resolved = this.incidentData.filter(em => em.state === 'resolved').length;

        // Cập nhật thống kê
        const statsElements = {
            total: document.getElementById('total-incidents'),
            active: document.getElementById('active-incidents'),
            resolved: document.getElementById('resolved-incidents')
        };

        if (statsElements.total) statsElements.total.textContent = total;
        if (statsElements.active) statsElements.active.textContent = active;
        if (statsElements.resolved) statsElements.resolved.textContent = resolved;
    }

    getStatusText(status) {
        return status === 'active' ? 'Đang xử lý' : 'Đã giải quyết';
    }

    getSeverityText(severity) {
        const levels = {
            high: 'Cao',
            medium: 'Trung bình',
            low: 'Thấp'
        };
        return levels[severity] || 'Không xác định';
    }

    setupEventListeners() {
        // Lọc theo tỉnh thành
        const provinceFilter = document.getElementById('province-filter');
        if (provinceFilter) {
            provinceFilter.addEventListener('change', (e) => {
                this.filterByProvince(e.target.value);
            });
        }

        // Lọc theo loại sự cố
        const typeFilter = document.getElementById('type-filter');
        if (typeFilter) {
            typeFilter.addEventListener('change', (e) => {
                this.filterByType(e.target.value);
            });
        }

        // Nút reset bộ lọc
        const resetBtn = document.getElementById('reset-filters');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                this.resetAllFilters();
            });
        }

        // Nút định vị vị trí hiện tại
        const locateBtn = document.getElementById('locate-btn');
        if (locateBtn) {
            locateBtn.addEventListener('click', () => {
                this.locateCurrentPosition();
            });
        }
    }

    filterByProvince(province) {
        if (province === 'all') {
            this.displayEmergencyMarkers();
        } else {
            const filtered = this.incidentData.filter(em => em.region === province);
            this.displayFilteredEmergencies(filtered);
        }
    }

    filterByType(type) {
        if (type === 'all') {
            this.displayEmergencyMarkers();
        } else {
            const filtered = this.incidentData.filter(em => em.category === type);
            this.displayFilteredEmergencies(filtered);
        }
    }

    displayFilteredEmergencies(emergencies) {
        this.clearExistingMarkers();
        
        emergencies.forEach(emergency => {
            const marker = L.marker(emergency.coordinates, {
                icon: this.createEmergencyIcon(emergency)
            }).addTo(this.map);

            marker.emergencyInfo = emergency;
            marker.bindPopup(this.createPopupContent(emergency));
            
            marker.on('click', (e) => {
                this.zoomToEmergencyLocation(emergency);
                this.highlightEmergencyMarker(marker);
            });

            this.mapMarkers.push(marker);
        });
    }

    resetAllFilters() {
        document.getElementById('province-filter').value = 'all';
        document.getElementById('type-filter').value = 'all';
        this.displayEmergencyMarkers();
    }

    locateCurrentPosition() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    this.map.flyTo([latitude, longitude], 13);
                    
                    // Thêm marker vị trí hiện tại
                    L.marker([latitude, longitude])
                        .addTo(this.map)
                        .bindPopup('Vị trí của bạn')
                        .openPopup();
                },
                (error) => {
                    alert('Không thể lấy vị trí: ' + error.message);
                }
            );
        } else {
            alert('Trình duyệt không hỗ trợ định vị');
        }
    }

    setupMapControls() {
        // Zoom controls
        const zoomInBtn = document.getElementById('zoom-in-btn');
        const zoomOutBtn = document.getElementById('zoom-out-btn');

        if (zoomInBtn) {
            zoomInBtn.addEventListener('click', () => {
                this.map.zoomIn();
            });
        }

        if (zoomOutBtn) {
            zoomOutBtn.addEventListener('click', () => {
                this.map.zoomOut();
            });
        }
    }
}

// Khởi tạo hệ thống bản đồ
const emergencyMap = new EmergencyMapSystem();





// map.js
window.focusOnMap = function(coordinates, title) {
    // Code để fly đến vị trí trên bản đồ
    if (window.map) {
        map.flyTo({
            center: coordinates,
            zoom: 14
        });
        
        // Hiển thị popup hoặc marker
        // ... code hiển thị thông tin sự cố trên bản đồ
    }
};