
// Map functionality for Emergency Rescue System

class EmergencyMap {
    constructor() {
        this.map = null;
        this.incidents = [];
        this.markers = [];
        this.currentFilters = {
            type: 'all',
            province: 'all',
            status: 'all'
        };
        
        this.init();
    }
    
    init() {
        this.initializeMap();
        this.loadIncidents();
        this.setupEventListeners();
        this.setupMapControls();
    }
    
    initializeMap() {
        // Initialize Leaflet map
        this.map = L.map('map').setView([10.762622, 106.660172], 13); // Default to Ho Chi Minh City
        
        // Add tile layer (using OpenStreetMap)
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 18
        }).addTo(this.map);
        
        // Add custom styles for different map types
        this.addMapLayers();
        
        // Add scale control
        L.control.scale({ imperial: false }).addTo(this.map);
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
    
    renderIncidents() {
        // Clear existing markers
        this.clearMarkers();
        
        // Add markers for each incident
        this.incidents.forEach(incident => {
            const marker = this.createIncidentMarker(incident);
            this.markers.push(marker);
        });
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
            fire: 'red',
            flood: 'blue',
            accident: 'orange',
            disaster: 'purple'
        };
        
        const iconHtml = `
            <div class="incident-marker ${incident.type} ${incident.status}" 
                 style="background-color: ${this.getColorForType(incident.type)}">
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
    
    getColorForType(type) {
        const colors = {
            fire: '#ef4444',
            flood: '#3b82f6',
            accident: '#f97316',
            disaster: '#8b5cf6'
        };
        
        return colors[type] || '#6b7280';
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
            <div class="incident-popup">
                <div class="popup-header">
                    <span class="popup-type">${this.getTypeLabel(incident.type)}</span>
                    <span class="popup-status ${incident.status}">${incident.status === 'active' ? 'Đang xử lý' : 'Đã giải quyết'}</span>
                </div>
                <div class="popup-title">${incident.title}</div>
                <div class="popup-location">
                    <i data-feather="map-pin" class="w-3 h-3 mr-1"></i>
                    ${incident.location}
                </div>
                <div class="popup-time">
                    <i data-feather="clock" class="w-3 h-3 mr-1"></i>
                    ${formatTimeAgo(incident.timestamp)}
                </div>
                <div class="popup-actions">
                    <button class="popup-btn primary" onclick="emergencyMap.viewIncidentDetails(${incident.id})">
                        Xem chi tiết
                    </button>
                    <button class="popup-btn secondary" onclick="emergencyMap.shareIncident(${incident.id})">
                        Chia sẻ
                    </button>
                </div>
            </div>
        `;
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
    
    onIncidentClick(incident) {
        // Update statistics panel
        this.updateActiveIncident(incident);
        
        // Log analytics
        this.trackIncidentView(incident);
    }
    
    updateStatistics() {
        const activeCount = this.incidents.filter(i => i.status === 'active').length;
        const resolvedCount = this.incidents.filter(i => i.status === 'resolved').length;
        
        // Update counters
        document.getElementById('active-incidents').textContent = activeCount;
        document.getElementById('resolved-incidents').textContent = resolvedCount;
        
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
        // This would update a details panel if we had one
        console.log('Active incident:', incident);
    }
    
    setupEventListeners() {
        // Search functionality
        const searchInput = document.getElementById('search-incidents');
        if (searchInput) {
            searchInput.addEventListener('input', this.debounce(() => {
                this.currentFilters.search = searchInput.value;
                this.loadIncidents();
            }, 300));
        }
        
        // Province filter
        const provinceFilter = document.getElementById('province-filter');
        if (provinceFilter) {
            provinceFilter.addEventListener('change', (e) => {
                this.currentFilters.province = e.target.value;
                this.loadIncidents();
            });
        }
        
        // Type filter
        const typeFilter = document.getElementById('type-filter');
        if (typeFilter) {
            typeFilter.addEventListener('change', (e) => {
                this.currentFilters.type = e.target.value;
                this.loadIncidents();
            });
        }
        
        // Reset filters
        const resetBtn = document.getElementById('reset-filters');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                this.resetFilters();
            });
        }
        
        // Type card clicks
        document.querySelectorAll('.incident-type-card').forEach(card => {
            card.addEventListener('click', (e) => {
                const type = card.dataset.type;
                this.filterByType(type);
            });
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
            }
        );
    }
    
    filterByType(type) {
        this.currentFilters.type = type;
        document.getElementById('type-filter').value = type;
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
        document.getElementById('search-incidents').value = '';
        document.getElementById('province-filter').value = 'all';
        document.getElementById('type-filter').value = 'all';
        
        this.loadIncidents();
    }
    
    clearMarkers() {
        this.markers.forEach(marker => {
            this.map.removeLayer(marker);
        });
        this.markers = [];
    }
    
    showLoading(show) {
        const mapElement = document.getElementById('map');
        if (show) {
            mapElement.classList.add('loading');
        } else {
            mapElement.classList.remove('loading');
        }
    }
    
    showError(message) {
        // You could implement a toast notification system here
        console.error('Map error:', message);
        alert(message);
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
            // Open incident details in modal or new page
            window.location.href = `incident-details.html?id=${incidentId}`;
        }
    }
    
    shareIncident(incidentId) {
        const incident = this.incidents.find(i => i.id === incidentId);
        if (incident && navigator.share) {
            navigator.share({
                title: incident.title,
                text: `Sự cố: ${incident.title}`,
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
    window.emergencyMap = new EmergencyMap();
});

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { EmergencyMap };
}


//map// Khởi tạo bản đồ
let map;
let markers = [];
let currentIncidents = [];

function initMap() {
    // Tạo bản đồ với trung tâm là Việt Nam
    map = L.map('map').setView([16.0, 108.0], 6);
    
    // Thêm tile layer (OpenStreetMap)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    
    // Thêm các marker giả lập
    currentIncidents = generateMockIncidents();
    
    // Tạo marker cho mỗi sự cố
    currentIncidents.forEach(incident => {
        createIncidentMarker(incident);
    });
    
    // Cập nhật thống kê
    updateStatistics(currentIncidents);
    
    // Hiển thị sự cố gần đây
    displayRecentIncidents(currentIncidents);
    
    // Thêm sự kiện cho các nút điều khiển bản đồ
    document.getElementById('zoom-in-btn').addEventListener('click', () => {
        map.zoomIn();
    });
    // Thêm sự kiện cho tab switching
    document.querySelectorAll('.panel-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            const tabName = this.getAttribute('data-tab');
            
            // Xóa active class từ tất cả các tab
            document.querySelectorAll('.panel-tab').forEach(t => {
                t.classList.remove('active');
            });
            
            // Ẩn tất cả nội dung tab
            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });
            
            // Thêm active class cho tab được chọn
            this.classList.add('active');
            
            // Hiển thị nội dung tab tương ứng
            document.getElementById(`${tabName}-tab`).classList.add('active');
        });
    });
    
    document.getElementById('zoom-out-btn').addEventListener('click', () => {
        map.zoomOut();
    });
    
    document.getElementById('locate-btn').addEventListener('click', () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                position => {
                    const { latitude, longitude } = position.coords;
                    map.setView([latitude, longitude], 13);
                    L.marker([latitude, longitude])
                        .addTo(map)
                        .bindPopup('Vị trí của bạn')
                        .openPopup();
                },
                error => {
                    alert('Không thể xác định vị trí của bạn: ' + error.message);
                }
            );
        } else {
            alert('Trình duyệt của bạn không hỗ trợ định vị.');
        }
    });
    
    // Thêm sự kiện cho bộ lọc
    document.getElementById('province-filter').addEventListener('change', applyFilters);
    document.getElementById('type-filter').addEventListener('change', applyFilters);
    document.getElementById('reset-filters').addEventListener('click', resetFilters);
    
    // Thêm sự kiện cho các nút lọc loại sự cố
    document.querySelectorAll('.type-filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            // Xóa active class từ tất cả các nút
            document.querySelectorAll('.type-filter-btn').forEach(b => {
                b.classList.remove('active');
            });
            
            // Thêm active class cho nút được nhấn
            this.classList.add('active');
            
            // Cập nhật bộ lọc loại sự cố
            const type = this.getAttribute('data-type');
            document.getElementById('type-filter').value = type;
            
            // Áp dụng bộ lọc
            applyFilters();
        });
    });
    
    // Thêm sự kiện cho các nút trong modal
    document.getElementById('close-modal').addEventListener('click', closeModal);
    document.getElementById('modal-close-btn').addEventListener('click', closeModal);
    
    // Thêm sự kiện đóng modal khi click vào overlay
    document.querySelector('.modal-overlay').addEventListener('click', closeModal);
    
    // Thêm sự kiện cho tìm kiếm
    document.getElementById('search-input').addEventListener('input', applyFilters);
    
    // Thêm sự kiện cho các nút chú thích bản đồ
    document.querySelectorAll('[data-type]').forEach(item => {
        if (item.classList.contains('cursor-pointer')) {
            item.addEventListener('click', function() {
                const type = this.getAttribute('data-type');
                document.querySelectorAll('.type-filter-btn').forEach(b => {
                    b.classList.remove('active');
                    if (b.getAttribute('data-type') === type) {
                        b.classList.add('active');
                    }
                });
                
                document.getElementById('type-filter').value = type;
                applyFilters();
            });
        }
    });
    
    // Khởi tạo feather icons
    feather.replace();
}

// Tạo dữ liệu sự cố mẫu
function generateMockIncidents() {
    return [
        {
            id: 'INC001',
            type: 'fire',
            status: 'active',
            priority: 'high',
            position: [21.0278, 105.8342], // Hà Nội
            title: 'Cháy chung cư tại Cầu Giấy',
            address: '123 Trần Duy Hưng, Cầu Giấy, Hà Nội',
            province: 'hanoi',
            time: '15:30, 12/11/2023',
            description: 'Cháy lớn tại tầng 12 chung cư Golden West, nhiều người mắc kẹt bên trong.',
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
            position: [10.8231, 106.6297], // TP.HCM
            title: 'Ngập nước nghiêm trọng tại Quận 1',
            address: 'Đường Nguyễn Huệ, Quận 1, TP.HCM',
            province: 'hcm',
            time: '14:15, 12/11/2023',
            description: 'Ngập nước sâu 0.5m sau cơn mưa lớn, nhiều phương tiện bị kẹt.',
            reporter: {
                name: 'Trần Thị B',
                phone: '0934 567 890',
                time: '14:10, 12/11/2023'
            },
            responseTeams: [
                { name: 'Đội cứu hộ đô thị', status: 'Đang di chuyển' },
                { name: 'Cảnh sát giao thông', status: 'Có mặt tại hiện trường' }
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
            position: [16.0544, 108.2022], // Đà Nẵng
            title: 'Tai nạn giao thông trên cầu Sông Hàn',
            address: 'Cầu Sông Hàn, Đà Nẵng',
            province: 'danang',
            time: '10:45, 12/11/2023',
            description: 'Va chạm giữa xe tải và xe máy, một người bị thương nặng.',
            reporter: {
                name: 'Lê Văn C',
                phone: '0978 901 234',
                time: '10:40, 12/11/2023'
            },
            responseTeams: [
                { name: 'Xe cứu thương 115', status: 'Đã hoàn thành' },
                { name: 'Cảnh sát giao thông', status: 'Đã hoàn thành' }
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
            position: [16.4637, 107.5909], // Huế
            title: 'Sạt lở đất tại huyện A Lưới',
            address: 'Xã Hồng Vân, Huyện A Lưới, Thừa Thiên Huế',
            province: 'hue',
            time: '09:20, 12/11/2023',
            description: 'Sạt lở đất sau mưa lớn, nhiều hộ dân bị ảnh hưởng.',
            reporter: {
                name: 'Phạm Thị D',
                phone: '0901 234 567',
                time: '09:15, 12/11/2023'
            },
            responseTeams: [
                { name: 'Đội cứu hộ tỉnh', status: 'Đang di chuyển' },
                { name: 'Hội Chữ thập đỏ', status: 'Chuẩn bị hỗ trợ' }
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
            position: [20.9874, 105.5324], // Hà Đông
            title: 'Cháy nhà máy sản xuất',
            address: 'Khu công nghiệp Vĩnh Tuy, Hà Đông, Hà Nội',
            province: 'hanoi',
            time: '13:10, 12/11/2023',
            description: 'Cháy lớn tại nhà máy sản xuất linh kiện điện tử, khói đen bao phủ khu vực.',
            reporter: {
                name: 'Hoàng Văn E',
                phone: '0987 654 321',
                time: '13:05, 12/11/2023'
            },
            responseTeams: [
                { name: 'Đội PCCC Hà Đông', status: 'Có mặt tại hiện trường' },
                { name: 'Cảnh sát PCCC', status: 'Đang di chuyển' }
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
            position: [10.0452, 105.7469], // Cần Thơ
            title: 'Ngập lụt khu vực trung tâm',
            address: 'Đường 30/4, Quận Ninh Kiều, Cần Thơ',
            province: 'cantho',
            time: '11:30, 12/11/2023',
            description: 'Ngập nước sâu 0.7m do triều cường kết hợp mưa lớn.',
            reporter: {
                name: 'Lý Thị F',
                phone: '0965 432 109',
                time: '11:25, 12/11/2023'
            },
            responseTeams: [
                { name: 'Đội cứu hộ thành phố', status: 'Có mặt tại hiện trường' },
                { name: 'Công an giao thông', status: 'Phân luồng giao thông' }
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
            position: [20.8561, 106.6820], // Hải Phòng
            title: 'Tai nạn liên hoàn trên cao tốc',
            address: 'Cao tốc Hà Nội - Hải Phòng, Km25',
            province: 'haiphong',
            time: '08:45, 12/11/2023',
            description: 'Va chạm liên hoàn giữa 5 xe ô tô, nhiều người bị thương.',
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
            position: [19.8065, 105.7853], // Thanh Hóa
            title: 'Lũ quét tại huyện miền núi',
            address: 'Xã Trung Sơn, Huyện Quan Hóa, Thanh Hóa',
            province: 'thanhhoa',
            time: '07:20, 12/11/2023',
            description: 'Lũ quét sau mưa lớn, nhiều nhà cửa bị cuốn trôi.',
            reporter: {
                name: 'Đặng Thị H',
                phone: '0918 765 432',
                time: '07:15, 12/11/2023'
            },
            responseTeams: [
                { name: 'Đội cứu hộ tỉnh', status: 'Đang di chuyển' },
                { name: 'Quân đội', status: 'Chuẩn bị hỗ trợ' }
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
            position: [18.6796, 105.6813], // Nghệ An
            title: 'Cháy rừng tại Vườn Quốc gia',
            address: 'Vườn Quốc gia Pù Mát, Con Cuông, Nghệ An',
            province: 'nghean',
            time: '16:40, 11/11/2023',
            description: 'Cháy rừng quy mô nhỏ, đã được khống chế.',
            reporter: {
                name: 'Bùi Văn I',
                phone: '0976 543 210',
                time: '16:35, 11/11/2023'
            },
            responseTeams: [
                { name: 'Kiểm lâm', status: 'Đã hoàn thành' },
                { name: 'Đội PCCC huyện', status: 'Đã hoàn thành' }
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
            position: [21.1565, 106.0587], // Bắc Ninh
            title: 'Tai nạn xe container',
            address: 'Quốc lộ 1A, Thành phố Bắc Ninh',
            province: 'bacninh',
            time: '12:15, 12/11/2023',
            description: 'Xe container mất lái đâm vào nhà dân.',
            reporter: {
                name: 'Ngô Văn K',
                phone: '0932 109 876',
                time: '12:10, 12/11/2023'
            },
            responseTeams: [
                { name: 'Cảnh sát giao thông', status: 'Có mặt tại hiện trường' },
                { name: 'Xe cứu hộ', status: 'Đang di chuyển' }
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
            position: [10.345, 106.365], // Tiền Giang
            title: 'Ngập lụt diện rộng tại huyện Cái Bè',
            address: 'Huyện Cái Bè, Tiền Giang',
            province: 'tiengiang',
            time: '09:45, 12/11/2023',
            description: 'Ngập nước sâu 1m do vỡ đê, nhiều hộ dân bị cô lập.',
            reporter: {
                name: 'Trần Văn L',
                phone: '0915 678 432',
                time: '09:40, 12/11/2023'
            },
            responseTeams: [
                { name: 'Đội cứu hộ tỉnh', status: 'Đang di chuyển' },
                { name: 'Quân đội', status: 'Chuẩn bị hỗ trợ' }
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
            position: [11.942, 108.438], // Lâm Đồng
            title: 'Sạt lở đất tại Đà Lạt',
            address: 'Đường Hồ Tùng Mậu, Đà Lạt, Lâm Đồng',
            province: 'lamdong',
            time: '08:30, 12/11/2023',
            description: 'Sạt lở đất sau mưa lớn, một số nhà bị vùi lấp.',
            reporter: {
                name: 'Phan Thị M',
                phone: '0986 543 210',
                time: '08:25, 12/11/2023'
            },
            responseTeams: [
                { name: 'Đội cứu hộ thành phố', status: 'Có mặt tại hiện trường' },
                { name: 'Xe cứu thương', status: 'Đang di chuyển' }
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
            position: [12.245, 109.194], // Khánh Hòa
            title: 'Cháy kho xưởng tại Nha Trang',
            address: 'Khu công nghiệp Bắc Nha Trang, Khánh Hòa',
            province: 'khanhhoa',
            time: '16:20, 12/11/2023',
            description: 'Cháy lớn tại kho chứa vật liệu xây dựng, khói đen dày đặc.',
            reporter: {
                name: 'Lê Văn N',
                phone: '0975 432 109',
                time: '16:15, 12/11/2023'
            },
            responseTeams: [
                { name: 'Đội PCCC Nha Trang', status: 'Có mặt tại hiện trường' },
                { name: 'Cảnh sát PCCC', status: 'Đang di chuyển' }
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
            position: [20.941, 106.320], // Hải Dương
            title: 'Tai nạn giao thông trên Quốc lộ 5',
            address: 'Quốc lộ 5, Km45, Hải Dương',
            province: 'haiduong',
            time: '14:50, 12/11/2023',
            description: 'Va chạm giữa xe khách và xe tải, 5 người bị thương.',
            reporter: {
                name: 'Nguyễn Thị O',
                phone: '0967 890 123',
                time: '14:45, 12/11/2023'
            },
            responseTeams: [
                { name: 'Xe cứu thương 115', status: 'Đang di chuyển' },
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
            position: [9.177, 105.150], // Cà Mau
            title: 'Ngập cục bộ tại trung tâm thành phố',
            address: 'Đường Phan Ngọc Hiển, TP. Cà Mau',
            province: 'camau',
            time: '10:15, 11/11/2023',
            description: 'Ngập nước nhẹ do triều cường, đã rút hết.',
            reporter: {
                name: 'Võ Văn P',
                phone: '0933 444 555',
                time: '10:10, 11/11/2023'
            },
            responseTeams: [
                { name: 'Công ty thoát nước', status: 'Đã hoàn thành' }
            ],
            timeline: [
                { time: '10:10', action: 'Tiếp nhận báo cáo sự cố' },
                { time: '10:12', action: 'Thông báo cho công ty thoát nước' },
                { time: '11:30', action: 'Nước đã rút hết' }
            ]
        }
    ];
}
// Tạo marker cho sự cố
function createIncidentMarker(incident) {
    let iconColor;
    let iconSymbol;
    
    switch(incident.type) {
        case 'fire':
            iconColor = '#ef4444'; // red-500
            iconSymbol = 'flame';
            break;
        case 'flood':
            iconColor = '#3b82f6'; // blue-500
            iconSymbol = 'droplet';
            break;
        case 'accident':
            iconColor = '#f97316'; // orange-500
            iconSymbol = 'activity';
            break;
        case 'disaster':
            iconColor = '#8b5cf6'; // purple-500
            iconSymbol = 'alert-octagon';
            break;
    }
    
    // Tạo custom icon với màu sắc và trạng thái
    const iconHtml = `
        <div style="width: 40px; height: 40px; border-radius: 50%; background-color: ${iconColor}; display: flex; align-items: center; justify-content: center; color: white; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); ${incident.status === 'active' ? 'animation: pulse 2s infinite;' : ''}">
            <i data-feather="${iconSymbol}" style="width: 20px; height: 20px;"></i>
        </div>
    `;
    
    const customIcon = L.divIcon({
        html: iconHtml,
        className: 'custom-marker',
        iconSize: [40, 40],
        iconAnchor: [20, 20]
    });
    
    const marker = L.marker(incident.position, { icon: customIcon }).addTo(map);
    markers.push(marker);
    
    // Thêm popup thông tin
    marker.bindPopup(`
        <div class="p-2 min-w-[250px]">
            <h4 class="font-bold text-lg mb-2">${incident.title}</h4>
            <div class="flex items-center mb-2">
                <span class="status-badge ${incident.status === 'active' ? 'status-active' : 'status-resolved'} mr-2">
                    ${incident.status === 'active' ? 'Đang xử lý' : 'Đã giải quyết'}
                </span>
                <span class="status-badge ${incident.priority === 'high' ? 'priority-high' : incident.priority === 'medium' ? 'priority-medium' : 'priority-low'}">
                    ${incident.priority === 'high' ? 'Cao' : incident.priority === 'medium' ? 'Trung bình' : 'Thấp'}
                </span>
            </div>
            <p class="text-gray-600 mb-2">${incident.address}</p>
            <p class="text-sm text-gray-500">${incident.time}</p>
            <div class="mt-3 flex gap-2">
                <button class="flex-1 bg-red-500 text-white py-1 px-3 rounded-lg hover:bg-red-600 transition view-details" data-id="${incident.id}">
                    Xem chi tiết
                </button>
                <button class="flex-1 bg-blue-500 text-white py-1 px-3 rounded-lg hover:bg-blue-600 transition zoom-to-location" data-lat="${incident.position[0]}" data-lng="${incident.position[1]}">
                    Phóng to
                </button>
            </div>
        </div>
    `, {className: 'custom-popup'});
    
    // Thêm sự kiện click để mở modal chi tiết
    marker.on('popupopen', function() {
        document.querySelectorAll('.view-details').forEach(button => {
            button.addEventListener('click', function() {
                const incidentId = this.getAttribute('data-id');
                const incident = currentIncidents.find(i => i.id === incidentId);
                if (incident) {
                    openIncidentModal(incident);
                    map.closePopup();
                }
            });
        });
        
        // Thêm sự kiện cho nút phóng to
        document.querySelectorAll('.zoom-to-location').forEach(button => {
            button.addEventListener('click', function() {
                const lat = parseFloat(this.getAttribute('data-lat'));
                const lng = parseFloat(this.getAttribute('data-lng'));
                map.setView([lat, lng], 15);
            });
        });
        
        feather.replace();
    });
    
    // Thêm sự kiện click vào marker để zoom đến vị trí
    marker.on('click', function() {
        map.setView(incident.position, 15);
    });
    
    return marker;
}

// Cập nhật thống kê
function updateStatistics(incidents) {
    const active = incidents.filter(i => i.status === 'active').length;
    const resolved = incidents.filter(i => i.status === 'resolved').length;
    const total = incidents.length;
    
    document.getElementById('active-incidents').textContent = active;
    document.getElementById('resolved-incidents').textContent = resolved;
    document.getElementById('total-incidents').textContent = total;
    
    // Cập nhật số lượng theo loại sự cố
    document.getElementById('count-fire').textContent = incidents.filter(i => i.type === 'fire').length;
    document.getElementById('count-flood').textContent = incidents.filter(i => i.type === 'flood').length;
    document.getElementById('count-accident').textContent = incidents.filter(i => i.type === 'accident').length;
    document.getElementById('count-disaster').textContent = incidents.filter(i => i.type === 'disaster').length;
}

// Hiển thị sự cố gần đây
function displayRecentIncidents(incidents) {
    const container = document.getElementById('recent-incidents');
    container.innerHTML = '';
    
    incidents.slice(0, 6).forEach(incident => {
        let typeClass = '';
        let typeIcon = '';
        
        switch(incident.type) {
            case 'fire':
                typeClass = 'incident-fire';
                typeIcon = 'flame';
                break;
            case 'flood':
                typeClass = 'incident-flood';
                typeIcon = 'droplet';
                break;
            case 'accident':
                typeClass = 'incident-accident';
                typeIcon = 'activity';
                break;
            case 'disaster':
                typeClass = 'incident-disaster';
                typeIcon = 'alert-octagon';
                break;
        }
        
        const incidentCard = document.createElement('div');
        incidentCard.className = `incident-card bg-white rounded-xl p-4 shadow-md ${typeClass}`;
        incidentCard.innerHTML = `
            <div class="flex justify-between items-start mb-2">
                <h4 class="font-bold text-lg">${incident.title}</h4>
                <div class="w-8 h-8 rounded-full flex items-center justify-center bg-opacity-20 ${typeClass.replace('incident-', 'bg-')}">
                    <i data-feather="${typeIcon}" class="w-4 h-4"></i>
                </div>
            </div>
            <div class="flex items-center mb-2">
                <span class="status-badge ${incident.status === 'active' ? 'status-active' : 'status-resolved'} mr-2">
                    ${incident.status === 'active' ? 'Đang xử lý' : 'Đã giải quyết'}
                </span>
                <span class="status-badge ${incident.priority === 'high' ? 'priority-high' : incident.priority === 'medium' ? 'priority-medium' : 'priority-low'}">
                    ${incident.priority === 'high' ? 'Cao' : incident.priority === 'medium' ? 'Trung bình' : 'Thấp'}
                </span>
            </div>
            <p class="text-gray-600 mb-3">${incident.address}</p>
            <div class="flex justify-between items-center text-sm text-gray-500">
                <span>${incident.time}</span>
                <div class="flex gap-2">
                    <button class="text-blue-500 hover:text-blue-700 font-medium zoom-to-location" data-lat="${incident.position[0]}" data-lng="${incident.position[1]}">
                        Phóng to
                    </button>
                    <button class="text-red-500 hover:text-red-700 font-medium view-details" data-id="${incident.id}">
                        Chi tiết
                    </button>
                </div>
            </div>
        `;
        
        container.appendChild(incidentCard);
        
        // Thêm sự kiện click để mở modal
        incidentCard.querySelector('.view-details').addEventListener('click', function() {
            const incidentId = this.getAttribute('data-id');
            const incident = currentIncidents.find(i => i.id === incidentId);
            if (incident) {
                openIncidentModal(incident);
            }
        });
        
        // Thêm sự kiện cho nút phóng to
        incidentCard.querySelector('.zoom-to-location').addEventListener('click', function() {
            const lat = parseFloat(this.getAttribute('data-lat'));
            const lng = parseFloat(this.getAttribute('data-lng'));
            map.setView([lat, lng], 15);
        });
    });
    
    feather.replace();
}

// Mở modal chi tiết sự cố
function openIncidentModal(incident) {
    const modal = document.getElementById('emergency-detail-modal');
    const modalTitle = document.getElementById('modal-title');
    
    // Cập nhật thông tin cơ bản
    document.getElementById('modal-id').textContent = incident.id;
    document.getElementById('modal-type').textContent = getIncidentTypeText(incident.type);
    document.getElementById('modal-status').textContent = incident.status === 'active' ? 'Đang xử lý' : 'Đã giải quyết';
    document.getElementById('modal-status').className = `status-badge ${incident.status === 'active' ? 'status-active' : 'status-resolved'}`;
    document.getElementById('modal-priority').textContent = getPriorityText(incident.priority);
    document.getElementById('modal-priority').className = `status-badge ${incident.priority === 'high' ? 'priority-high' : incident.priority === 'medium' ? 'priority-medium' : 'priority-low'}`;
    document.getElementById('modal-time').textContent = incident.time;
    
    // Cập nhật thông tin địa điểm
    document.getElementById('modal-address').textContent = incident.address;
    document.getElementById('modal-province').textContent = getProvinceText(incident.province);
    document.getElementById('modal-coords').textContent = `${incident.position[0].toFixed(4)}, ${incident.position[1].toFixed(4)}`;
    
    // Cập nhật mô tả
    document.getElementById('modal-description').textContent = incident.description;
    
    // Cập nhật thông tin người báo cáo
    document.getElementById('modal-reporter-name').textContent = incident.reporter.name;
    document.getElementById('modal-reporter-phone').textContent = incident.reporter.phone;
    document.getElementById('modal-report-time').textContent = incident.reporter.time;
    
    // Cập nhật lực lượng ứng phó
    const responseTeamsContainer = document.getElementById('modal-response-teams');
    responseTeamsContainer.innerHTML = '';
    
    incident.responseTeams.forEach(team => {
        const teamElement = document.createElement('div');
        teamElement.className = 'flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0';
        teamElement.innerHTML = `
            <span class="font-medium">${team.name}</span>
            <span class="text-sm ${team.status === 'Có mặt tại hiện trường' || team.status === 'Đã hoàn thành' ? 'text-green-600' : 'text-orange-600'}">${team.status}</span>
        `;
        responseTeamsContainer.appendChild(teamElement);
    });
    
    // Cập nhật timeline
    const timelineContainer = document.getElementById('modal-timeline');
    timelineContainer.innerHTML = '';
    
    incident.timeline.forEach(item => {
        const timelineItem = document.createElement('div');
        timelineItem.className = 'timeline-item';
        timelineItem.innerHTML = `
            <div class="font-medium text-gray-900">${item.time}</div>
            <div class="text-gray-600">${item.action}</div>
        `;
        timelineContainer.appendChild(timelineItem);
    });
    
    // Cập nhật tiêu đề modal
    modalTitle.textContent = incident.title;
    
    // Hiển thị modal
    modal.classList.remove('hidden');
    
    // Ngăn chặn cuộn trang nền
    document.body.style.overflow = 'hidden';
    
    // Thêm sự kiện cho nút phóng to trong modal
    document.getElementById('modal-navigate-btn').onclick = function() {
        map.setView(incident.position, 15);
        closeModal();
    };
    
    // Cập nhật feather icons trong modal
    feather.replace();
}

// Đóng modal
function closeModal() {
    const modal = document.getElementById('emergency-detail-modal');
    modal.classList.add('hidden');
    document.body.style.overflow = 'auto';
}

// Áp dụng bộ lọc
function applyFilters() {
    const provinceFilter = document.getElementById('province-filter').value;
    const typeFilter = document.getElementById('type-filter').value;
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    
    // Ẩn tất cả markers
    markers.forEach(marker => {
        map.removeLayer(marker);
    });
    
    // Lọc và hiển thị lại markers
    const incidents = generateMockIncidents();
    const filteredIncidents = incidents.filter(incident => {
        const provinceMatch = provinceFilter === 'all' || incident.province === provinceFilter;
        const typeMatch = typeFilter === 'all' || incident.type === typeFilter;
        const searchMatch = searchTerm === '' || 
            incident.title.toLowerCase().includes(searchTerm) ||
            incident.address.toLowerCase().includes(searchTerm) ||
            incident.description.toLowerCase().includes(searchTerm);
        return provinceMatch && typeMatch && searchMatch;
    });
    
    // Cập nhật currentIncidents để sử dụng trong modal
    currentIncidents = filteredIncidents;
    
    // Tạo lại markers
    markers = [];
    filteredIncidents.forEach(incident => {
        createIncidentMarker(incident);
    });
    
    // Cập nhật thống kê
    updateStatistics(filteredIncidents);
    
    // Hiển thị sự cố gần đây
    displayRecentIncidents(filteredIncidents);
}

// Đặt lại bộ lọc
function resetFilters() {
    document.getElementById('province-filter').value = 'all';
    document.getElementById('type-filter').value = 'all';
    document.getElementById('search-input').value = '';
    
    // Reset các nút lọc loại sự cố
    document.querySelectorAll('.type-filter-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-type') === 'all') {
            btn.classList.add('active');
        }
    });
    
    applyFilters();
}

// Hàm trợ giúp
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

function getProvinceText(province) {
    switch(province) {
        case 'hanoi': return 'Hà Nội';
        case 'hcm': return 'TP.Hồ Chí Minh';
        case 'danang': return 'Đà Nẵng';
        case 'hue': return 'Thừa Thiên Huế';
        case 'nghean': return 'Nghệ An';
        case 'thanhhoa': return 'Thanh Hóa';
        case 'haiphong': return 'Hải Phòng';
        case 'cantho': return 'Cần Thơ';
        case 'bacninh': return 'Bắc Ninh';
        case 'haiduong': return 'Hải Dương';
        case 'quangninh': return 'Quảng Ninh';
        case 'thuathienhue': return 'Thừa Thiên Huế';
        case 'binhdinh': return 'Bình Định';
        case 'khanhhoa': return 'Khánh Hòa';
        case 'lamdong': return 'Lâm Đồng';
        case 'dongnai': return 'Đồng Nai';
        case 'baria-vungtau': return 'Bà Rịa - Vũng Tàu';
        case 'tiengiang': return 'Tiền Giang';
        case 'bentre': return 'Bến Tre';
        case 'soc trang': return 'Sóc Trăng';
        case 'camau': return 'Cà Mau'; 
        case 'quangnam': return 'Quảng Nam';
        case 'ninhthuan': return 'Ninh Thuận';
        case 'namdinh': return 'Nam Định';
        case 'longan': return 'Long An';
        case 'laocai': return 'Lào Cai';
        case 'thainguyen': return 'Thái Nguyên';
        default: return 'Không xác định';
    }
}

// Khởi tạo bản đồ khi trang được tải
document.addEventListener('DOMContentLoaded', initMap);



// sự cố bản đồ
 // JavaScript cho phần Sự Cố Gần Đây mới
        document.addEventListener('DOMContentLoaded', function() {
            initRecentIncidents();
            setupRecentEventListeners();
            feather.replace();
        });

        function initRecentIncidents() {
            displayRecentIncidents();
            updateRecentStatistics();
        }

        function displayRecentIncidents(incidents = getRecentIncidents()) {
            const container = document.getElementById('recent-incidents-list');
            container.innerHTML = '';

            if (incidents.length === 0) {
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

            incidents.forEach(incident => {
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
                            <button class="px-4 py-2 bg-${typeColor}-500 text-white rounded-lg hover:bg-${typeColor}-600 transition flex items-center view-recent-details" data-id="${incident.id}">
                                <i data-feather="eye" class="w-4 h-4 mr-1"></i>
                                Chi tiết
                            </button>
                        </div>
                    </div>
                `;
                
                container.appendChild(incidentCard);
            });
            
            feather.replace();
            
            // Thêm sự kiện click để mở modal
            document.querySelectorAll('.view-recent-details').forEach(button => {
                button.addEventListener('click', function() {
                    const incidentId = this.getAttribute('data-id');
                    const incident = getRecentIncidents().find(i => i.id === incidentId);
                    if (incident) {
                        openIncidentModal(incident);
                    }
                });
            });
        }

        function updateRecentStatistics() {
            const incidents = getRecentIncidents();
            const total = incidents.length;
            const active = incidents.filter(i => i.status === 'active').length;
            const resolved = incidents.filter(i => i.status === 'resolved').length;
            const today = incidents.filter(i => i.time.includes('12/11/2023')).length;
            
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
        }

        function applyRecentFilters() {
            const searchTerm = document.getElementById('search-recent-incidents').value.toLowerCase();
            const typeFilter = document.getElementById('recent-type-filter').value;
            const statusFilter = document.getElementById('recent-status-filter').value;
            const sortBy = document.getElementById('sort-by').value;
            
            let filteredIncidents = getRecentIncidents().filter(incident => {
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
            
            displayRecentIncidents(filteredIncidents);
            updateRecentStatistics();
        }

        function resetRecentFilters() {
            document.getElementById('search-recent-incidents').value = '';
            document.getElementById('recent-type-filter').value = 'all';
            document.getElementById('recent-status-filter').value = 'all';
            document.getElementById('sort-by').value = 'newest';
            
            displayRecentIncidents();
            updateRecentStatistics();
        }

        function getRecentIncidents() {
            // Lấy dữ liệu từ map.js hoặc tạo dữ liệu mẫu
            if (typeof currentIncidents !== 'undefined' && currentIncidents.length > 0) {
                return currentIncidents.slice(0, 8); // Giới hạn 8 sự cố gần đây
            }
            
            // Dữ liệu mẫu nếu không có từ map.js
            return [
                {
                    id: 'INC001',
                    type: 'fire',
                    status: 'active',
                    priority: 'high',
                    title: 'Cháy chung cư tại Cầu Giấy',
                    address: '123 Trần Duy Hưng, Cầu Giấy, Hà Nội',
                    time: '15:30, 12/11/2023',
                    description: 'Cháy lớn tại tầng 12 chung cư Golden West, nhiều người mắc kẹt bên trong.'
                },
                {
                    id: 'INC002',
                    type: 'flood',
                    status: 'active',
                    priority: 'medium',
                    title: 'Ngập nước nghiêm trọng tại Quận 1',
                    address: 'Đường Nguyễn Huệ, Quận 1, TP.HCM',
                    time: '14:15, 12/11/2023',
                    description: 'Ngập nước sâu 0.5m sau cơn mưa lớn, nhiều phương tiện bị kẹt.'
                },
                {
                    id: 'INC003',
                    type: 'accident',
                    status: 'resolved',
                    priority: 'high',
                    title: 'Tai nạn giao thông trên cầu Sông Hàn',
                    address: 'Cầu Sông Hàn, Đà Nẵng',
                    time: '10:45, 12/11/2023',
                    description: 'Va chạm giữa xe tải và xe máy, một người bị thương nặng.'
                }
            ];
        }