
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
    
    async loadIncidents() {
        try {
            // Show loading state
            this.showLoading(true);
            
            const data = await ApiService.getIncidents(this.currentFilters);
            this.incidents = data.incidents || [];
            
            this.renderIncidents();
            this.updateStatistics();
            this.showLoading(false);
            
        } catch (error) {
            console.error('Error loading incidents:', error);
            this.showLoading(false);
            this.showError('Không thể tải dữ liệu sự cố. Vui lòng thử lại sau.');
        }
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


//map// Dữ liệu tin tức từ trang news (đồng bộ)// ===== THÊM CÁC HÀM HỖ TRỢ BỊ THIẾU =====
function timeAgo(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 60) {
        return `${diffMins} phút trước`;
    } else if (diffHours < 24) {
        return `${diffHours} giờ trước`;
    } else {
        return `${diffDays} ngày trước`;
    }
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

function formatTime(dateString) {
    const date = new Date(dateString);
    return date.toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit'
    });
}

// ===== SỬA LẠI HÀM VẼ MARKER =====
function drawMarkers() {
    // Xóa các marker cũ
    currentMarkers.forEach(marker => map.removeLayer(marker));
    currentMarkers = [];

    const filteredEmergencies = filterEmergencies();
    
    console.log('Filtered emergencies:', filteredEmergencies); // Debug log
    
    filteredEmergencies.forEach(emg => {
        const color = getColorByType(emg.type);
        const icon = getIconByType(emg.type);
        
        // Tạo marker với inline styles thay vì Tailwind classes
        const marker = L.marker(emg.coords, {
            icon: L.divIcon({
                html: `
                    <div style="position: relative;">
                        <div style="
                            width: 40px; 
                            height: 40px; 
                            background-color: ${getColorHex(emg.type)}; 
                            border-radius: 50%; 
                            display: flex; 
                            align-items: center; 
                            justify-content: center; 
                            color: white; 
                            font-size: 16px; 
                            box-shadow: 0 2px 8px rgba(0,0,0,0.3); 
                            border: 2px solid white;
                            cursor: pointer;
                            ${emg.status === 'resolved' ? 'opacity: 0.7;' : ''}
                        ">
                            ${icon}
                        </div>
                        ${emg.status === 'active' ? 
                            '<div style="position: absolute; top: -2px; right: -2px; width: 12px; height: 12px; background-color: #ef4444; border-radius: 50%; animation: pulse 1.5s infinite;"></div>' : 
                            ''
                        }
                    </div>
                    <style>
                        @keyframes pulse {
                            0% { opacity: 1; }
                            50% { opacity: 0.4; }
                            100% { opacity: 1; }
                        }
                    </style>
                `,
                className: 'custom-marker',
                iconSize: [40, 40],
                iconAnchor: [20, 20]
            })
        })
        .addTo(map)
        .bindPopup(`
            <div style="padding: 12px; min-width: 250px; font-family: sans-serif;">
                <div style="display: flex; align-items: center; margin-bottom: 8px;">
                    <div style="width: 24px; height: 24px; background-color: ${getColorHex(emg.type)}; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 8px; color: white; font-size: 12px;">
                        ${icon}
                    </div>
                    <h4 style="font-weight: bold; color: #1f2937; margin: 0;">${emg.name}</h4>
                </div>
                <p style="font-size: 14px; color: #4b5563; margin-bottom: 8px;">${emg.address}</p>
                <p style="font-size: 14px; color: #6b7280; margin-bottom: 12px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">${emg.description}</p>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; font-size: 12px;">
                    <span style="padding: 4px 8px; background-color: ${getColorHex(emg.type)}20; color: ${getColorHex(emg.type)}; border-radius: 4px;">${getTypeName(emg.type)}</span>
                    <span style="color: #6b7280;">${emg.time}</span>
                </div>
                <div style="margin-top: 12px; display: flex; gap: 8px;">
                    <button onclick="showEmergencyDetail(${emg.id})" style="flex: 1; background-color: #ef4444; color: white; padding: 6px 12px; border: none; border-radius: 4px; font-size: 12px; cursor: pointer; transition: background-color 0.2s;" onmouseover="this.style.backgroundColor='#dc2626'" onmouseout="this.style.backgroundColor='#ef4444'">
                        Chi tiết
                    </button>
                    <button onclick="shareEmergency(${emg.id})" style="flex: 1; background-color: #3b82f6; color: white; padding: 6px 12px; border: none; border-radius: 4px; font-size: 12px; cursor: pointer; transition: background-color 0.2s;" onmouseover="this.style.backgroundColor='#2563eb'" onmouseout="this.style.backgroundColor='#3b82f6'">
                        Chia sẻ
                    </button>
                </div>
            </div>
        `);

        currentMarkers.push(marker);
    });

    updateStatistics();
    updateRecentIncidents();
}

// ===== THÊM HÀM LẤY MÀU HEX =====
function getColorHex(type) {
    const colors = {
        fire: '#ef4444',
        flood: '#3b82f6', 
        accident: '#f97316',
        disaster: '#8b5cf6',
        rescue: '#10b981',
        warning: '#eab308'
    };
    return colors[type] || '#6b7280';
}

// ===== SỬA LẠI HÀM KHỞI TẠO MAP =====
function initializeMap() {
    // Đảm bảo container map tồn tại
    const mapContainer = document.getElementById('map');
    if (!mapContainer) {
        console.error('Map container not found!');
        return;
    }

    // Khởi tạo map
    map = L.map("map").setView([16.0471, 108.2068], 6);
    
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: '© OpenStreetMap'
    }).addTo(map);

    // Debug: Kiểm tra dữ liệu
    console.log('Original emergencies:', emergencies);
    console.log('News emergencies:', newsEmergencies);
    console.log('All emergencies:', [...emergencies, ...newsEmergencies]);

    // Vẽ markers sau khi map đã load
    map.whenReady(() => {
        drawMarkers();
        updateStatistics();
        updateRecentIncidents();
    });

    // Thêm event listeners
    setupEventListeners();
}

// ===== TÁCH RIÊNG PHẦN EVENT LISTENERS =====
function setupEventListeners() {
    // Filter events
    const typeFilter = document.getElementById('type-filter');
    const provinceFilter = document.getElementById('province-filter');
    const searchInput = document.getElementById('search-incidents');
    const resetBtn = document.getElementById('reset-filters');

    if (typeFilter) {
        typeFilter.addEventListener('change', (e) => {
            currentFilters.type = e.target.value;
            drawMarkers();
        });
    }

    if (provinceFilter) {
        provinceFilter.addEventListener('change', (e) => {
            currentFilters.province = e.target.value;
            flyToProvince(e.target.value);
            drawMarkers();
        });
    }

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            currentFilters.search = e.target.value;
            drawMarkers();
        });
    }

    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            currentFilters = { type: 'all', province: 'all', search: '' };
            if (typeFilter) typeFilter.value = 'all';
            if (provinceFilter) provinceFilter.value = 'all';
            if (searchInput) searchInput.value = '';
            flyToProvince('all');
            drawMarkers();
        });
    }

    // Map controls
    const locateBtn = document.getElementById('locate-btn');
    const zoomInBtn = document.getElementById('zoom-in-btn');
    const zoomOutBtn = document.getElementById('zoom-out-btn');

    if (locateBtn) {
        locateBtn.addEventListener('click', locateUser);
    }

    if (zoomInBtn) {
        zoomInBtn.addEventListener('click', () => map.zoomIn());
    }

    if (zoomOutBtn) {
        zoomOutBtn.addEventListener('click', () => map.zoomOut());
    }

    // Modal events
    setupModalEvents();
}

// ===== HÀM ĐỊNH VỊ NGƯỜI DÙNG =====
function locateUser() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            pos => {
                const lat = pos.coords.latitude;
                const lng = pos.coords.longitude;
                map.flyTo([lat, lng], 13, { duration: 1.5 });
                
                L.marker([lat, lng])
                    .addTo(map)
                    .bindPopup("📍 Vị trí của bạn")
                    .openPopup();
            },
            error => {
                console.error('Geolocation error:', error);
                alert("Không thể lấy vị trí của bạn. Vui lòng kiểm tra quyền truy cập vị trí.");
            }
        );
    } else {
        alert("Trình duyệt không hỗ trợ định vị!");
    }
}

// ===== SETUP MODAL EVENTS =====
function setupModalEvents() {
    const closeModal = document.getElementById('close-modal');
    const modalCloseBtn = document.getElementById('modal-close-btn');
    const modalShareBtn = document.getElementById('modal-share-btn');
    const modalNavigateBtn = document.getElementById('modal-navigate-btn');
    const modalReportBtn = document.getElementById('modal-report-btn');
    const modalElement = document.getElementById('emergency-detail-modal');

    if (closeModal) {
        closeModal.addEventListener('click', closeEmergencyDetail);
    }

    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', closeEmergencyDetail);
    }

    if (modalShareBtn) {
        modalShareBtn.addEventListener('click', () => {
            const emergencyId = document.getElementById('modal-id').textContent;
            shareEmergency(parseInt(emergencyId.replace('#', '')));
        });
    }

    if (modalNavigateBtn) {
        modalNavigateBtn.addEventListener('click', () => {
            const emergencyId = document.getElementById('modal-id').textContent;
            viewEmergencyOnMap(parseInt(emergencyId.replace('#', '')));
            closeEmergencyDetail();
        });
    }

    if (modalReportBtn) {
        modalReportBtn.addEventListener('click', () => {
            alert('Cảm ơn bạn đã báo cáo. Chúng tôi sẽ kiểm tra thông tin này.');
        });
    }

    if (modalElement) {
        modalElement.addEventListener('click', (e) => {
            if (e.target.id === 'emergency-detail-modal') {
                closeEmergencyDetail();
            }
        });
    }
}

// ===== KHỞI TẠO KHI TRANG LOAD =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing map...');
    initializeMap();
    
    // Cập nhật thời gian thực mỗi 30 giây
    setInterval(updateStatistics, 30000);
});

// ===== ĐẢM BẢO CÁC HÀM TOÀN CỤC =====
window.showEmergencyDetail = showEmergencyDetail;
window.closeEmergencyDetail = closeEmergencyDetail;
window.shareEmergency = shareEmergency;
window.viewEmergencyOnMap = viewEmergencyOnMap;
// Khởi tạo Feather Icons
feather.replace();

// Mobile menu toggle
document.getElementById('menu-toggle').addEventListener('click', function() {
    const menu = document.getElementById('mobile-menu');
    menu.classList.toggle('hidden');
    const isHidden = menu.classList.contains('hidden');
    this.innerHTML = isHidden ? feather.icons.menu.toSvg() : feather.icons.x.toSvg();
});

// 🔹 Dữ liệu tin tức từ trang news (để mô phỏng đồng bộ)
const newsData = [
    {
        title: "Đà Nẵng: Chủ động ứng phó thiên tai những tháng cuối năm",
        date: "2025-10-21",
        type: "thien-tai",
        location: "da-nang,mien-trung",
        img: "https://media.daidoanket.vn/w1280/uploaded/images/2025/10/18/8898fcf6-b66a-433c-908c-72eb18bbdeb1.jpg",
        content: "<p><strong>Tình hình:</strong> TP. Đà Nẵng đang hứng chịu thời tiết cực đoan, mưa lớn kéo dài gây sạt lở nghiêm trọng tại nhiều khu vực. Đáng chú ý, bờ biển phường Hội An Tây bị sóng đánh mạnh, sạt lở dài hơn 200m với vách đứng cao 5-6m, cây chắn sóng bật gốc, công trình ven biển nguy cơ sụp đổ.</p>"
    },
    {
        title: "Tai nạn giao thông mới nhất 19/10/2025: xe cứu hộ gây tai nạn liên hoàn trên quốc lộ 26",
        date: "2025-10-19",
        type: "tai-nan",
        location: "dak-lak,tp-hcm,binh-dinh,tay-nguyen",
        img: "https://cdnphoto.dantri.com.vn/fT-JEopnjSnsEkgTdgpPSX-an_8=/thumb_w/1020/2025/10/19/z7132063905158f9b65fad4a12b3160200c0a32ca66181-edited-1760843872053.jpg",
        content: "<p><strong>Tình hình:</strong> Ngày 19/10/2025, xảy ra ba vụ tai nạn giao thông nghiêm trọng: Xe cứu hộ gây tai nạn liên hoàn tại km146+400 quốc lộ 26 (Đắk Lắk), người đàn ông tử vong do mất lái xe máy ở dốc cầu Bình Lợi (TP Hồ Chí Minh), và xe máy va chạm xe tải chở gỗ khiến cô gái tử vong trên tỉnh lộ 639 (Bình Định).</p>"
    },
    {
        title: "Thiên tai đã vượt quá sức chịu đựng của người dân",
        date: "2025-10-10",
        type: "thien-tai",
        location: "thai-nguyen,bac-ninh,cao-bang,lang-son,mien-bac,mien-trung",
        img: "https://premedia.vneconomy.vn/files/uploads/2025/10/10/c999b83a970f40588b4d060116ebed76-20061.png?w=900",
        content: "<p><strong>Tình hình:</strong> Năm 2025, Việt Nam xảy ra 20 loại hình thiên tai với diễn biến dồn dập, khốc liệt, bất thường, vượt mức lịch sử, ảnh hưởng rộng lớn đến miền Bắc và miền Trung.</p>"
    },
    {
        title: "Việt Nam kêu gọi quốc tế hỗ trợ khắc phục hậu quả thiên tai",
        date: "2025-10-09",
        type: "cuu-ho",
        location: "ha-noi,mien-bac,mien-trung",
        img: "https://image.phunuonline.com.vn/fckeditor/upload/2025/20251009/images/lien-hop-quoc-keu-goi-ho-_241760006840.jpg",
        content: "<p><strong>Tình hình:</strong> Trong hai tháng 9 và 10/2025, Việt Nam liên tiếp hứng chịu bão số 8, 9, 10 và 11 cùng mưa lũ lớn. Bão số 10 đổ bộ vào Nghệ An - Hà Tĩnh đêm 28 và rạng sáng 29/9 với tốc độ nhanh, cường độ mạnh, phạm vi rộng.</p>"
    },
    {
        title: "Lực lượng Công an nhân dân chủ động ứng phó với bão số 12 và nguy cơ mưa lớn",
        date: "2025-10-20",
        type: "canh-bao",
        location: "mien-trung,mien-bac",
        img: "https://dbnd.1cdn.vn/2025/10/20/dbqgxtnd202510201700-17609581259941101885533.jpg",
        content: "<p><strong>Tình hình:</strong> Bão số 12 (Fengshen) đi vào Biển Đông chiều 19/10/2025, sức gió cấp 9 giật cấp 11, di chuyển hướng Tây Bắc 25km/h.</p>"
    }
];

// 🔹 Hàm timeAgo (đồng bộ với news.html)
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

// 🔹 Tọa độ trung tâm các tỉnh thành
const provinceCoordinates = {
    'hanoi': [21.0278, 105.8342],
    'hcm': [10.8231, 106.6297],
    'danang': [16.0544, 108.2022],
    'hue': [16.4637, 107.5909],
    'nghean': [18.6796, 105.6813],
    'thanhhoa': [19.8076, 105.7766],
    'haiphong': [20.8449, 106.6881],
    'cantho': [10.0452, 105.7469],
    'sonla': [21.3257, 103.9160],
    'ninhbinh': [20.2506, 105.9745]
};

// 🔹 Dữ liệu sự cố mẫu (đang xử lý và đã giải quyết)
const emergencies = [
    { 
        id: 1, 
        name: "Cháy nhà dân", 
        address: "Số 35 Trần Hưng Đạo, Hoàn Kiếm, Hà Nội", 
        coords: [21.027, 105.85], 
        type: "fire", 
        province: "hanoi", 
        status: "active", 
        time: "10 phút trước", 
        description: "Cháy bùng phát tại tòa nhà 5 tầng, đang có người mắc kẹt bên trong. Lửa bắt đầu từ tầng 2 và đang lan nhanh lên các tầng trên.",
        priority: "high",
        reporter: { name: "Nguyễn Văn A", phone: "0912345678", reportTime: "14:20 15/06/2023" },
        responseTeams: [{ name: "Đội PCCC Quận Hoàn Kiếm", status: "Đang di chuyển", eta: "5 phút" }],
        timeline: [{ time: "14:20", event: "Tiếp nhận báo cáo sự cố", status: "completed" }, { time: "14:25", event: "Lực lượng đầu tiên đến hiện trường", status: "in-progress" }]
    },
    { 
        id: 2, 
        name: "Ngập lụt khu dân cư", 
        address: "Khu vực Định Công, Hoàng Mai, Hà Nội", 
        coords: [20.98, 105.84], 
        type: "flood", 
        province: "hanoi", 
        status: "active", 
        time: "25 phút trước", 
        description: "Ngập sâu 0.5-0.7m do mưa lớn kéo dài. Nhiều phương tiện bị chết máy, người dân không thể di chuyển.",
        priority: "medium",
        reporter: { name: "Trần Thị B", phone: "0923456789", reportTime: "14:05 15/06/2023" },
        responseTeams: [{ name: "Đội cứu hộ Quận Hoàng Mai", status: "Có mặt tại hiện trường", eta: "0 phút" }],
        timeline: [{ time: "14:05", event: "Tiếp nhận báo cáo sự cố", status: "completed" }, { time: "14:20", event: "Lực lượng đầu tiên đến hiện trường", status: "completed" }]
    },
    // Thêm một sự cố đã giải quyết
    { 
        id: 3, 
        name: "Tai nạn giao thông trên QL1A", 
        address: "Ngã ba Vũng Tàu, Đồng Nai", 
        coords: [10.957, 106.84], 
        type: "accident", 
        province: "hcm", // gần TPHCM
        status: "resolved", 
        time: "1 giờ trước", 
        description: "Xe container va chạm với xe máy, đã xử lý xong, giao thông thông suốt.",
        priority: "low",
        reporter: { name: "Lê Văn C", phone: "0934567890", reportTime: "13:00 15/06/2023" },
        responseTeams: [{ name: "CSGT Đồng Nai", status: "Hoàn thành", eta: "0 phút" }],
        timeline: [{ time: "13:00", event: "Tiếp nhận", status: "completed" }, { time: "14:00", event: "Giải quyết", status: "completed" }]
    }
];

// 🔹 Hàm chuyển đổi dữ liệu từ news sang emergencies (tạo marker từ tin tức)
function convertNewsToEmergencies(newsData) {
    const typeMapping = {
        'thien-tai': 'disaster',
        'tai-nan': 'accident', 
        'cuu-ho': 'rescue',
        'canh-bao': 'warning'
    };

    const locationMapping = {
        'ha-noi': [21.0278, 105.8342],
        'tp-hcm': [10.8231, 106.6297],
        'da-nang': [16.0544, 108.2022],
        'mien-bac': [21.5, 105.5],
        'mien-trung': [16.0, 108.0],
        'tay-nguyen': [12.0, 108.0],
        'dak-lak': [12.6667, 108.05],
        'binh-dinh': [14.1667, 109.0],
        'thai-nguyen': [21.6, 105.85],
        'toan-quoc': [16.0, 108.0]
    };
    
    // Tích hợp dữ liệu báo cáo từ người dùng (nếu có)
    const userReportsString = localStorage.getItem('newsData_user_reports');
    const userReports = userReportsString ? JSON.parse(userReportsString) : [];
    
    // Lọc ra các tin tức thật để tránh trùng lặp
    const filteredNewsData = newsData.filter(news => !userReports.some(report => report.newsData && report.newsData.title === news.title));

    // Kết hợp và map data
    const allNews = [...filteredNewsData, ...userReports];

    return allNews.map((news, index) => {
        // Nếu là báo cáo từ user, ưu tiên location_full
        const locationKey = news.location.split(',')[0];
        const coords = locationMapping[locationKey] || [16.0, 108.0];
        
        // Tạo mô tả ngắn từ content
        const shortDescription = news.content.replace(/<[^>]+>/g, '').substring(0, 150) + '...';
        const isUserReport = news.isUserReport;
        
        return {
            id: 1000 + index, // ID bắt đầu từ 1000
            name: news.title.replace('[BÁO CÁO]', isUserReport ? '[BC Người Dùng]' : '[Tin Tức]'),
            address: news.location_full || getAddressFromNews(news),
            coords: coords,
            type: typeMapping[news.type] || 'disaster',
            province: getProvinceCodeFromLocation(news.location),
            status: news.status || 'active', // 'active' cho tin tức/báo cáo
            time: timeAgo(news.date),
            description: shortDescription,
            priority: getPriorityFromNews(news),
            reporter: {
                name: isUserReport ? news.reporter.name : 'Hệ thống (Báo chí)',
                phone: isUserReport ? news.reporter.phone : 'N/A',
                reportTime: formatDate(news.date)
            },
            responseTeams: isUserReport 
                ? [{ name: "Đội ứng phó (Đang xác minh)", status: "Đang điều phối", eta: "Đang chờ" }]
                : [{ name: "Lực lượng cứu hộ địa phương", status: "Sẵn sàng", eta: "Đang điều phối" }],
            timeline: [
                { time: formatTime(news.date), event: `Tiếp nhận ${isUserReport ? 'báo cáo' : 'tin tức'}`, status: "completed" },
                { time: "Đang cập nhật", event: `Điều phối lực lượng`, status: isUserReport ? "pending" : "in-progress" }
            ],
            newsData: news // Giữ nguyên dữ liệu gốc
        };
    });
}

// 🔹 Các hàm hỗ trợ chuyển đổi
function getAddressFromNews(news) {
    const primaryLocation = news.location.split(',')[0];
    const locationNames = {
        'ha-noi': 'Hà Nội', 'tp-hcm': 'Thành phố Hồ Chí Minh', 'da-nang': 'Đà Nẵng', 'mien-bac': 'Miền Bắc', 'mien-trung': 'Miền Trung',
        'tay-nguyen': 'Tây Nguyên', 'dak-lak': 'Đắk Lắk', 'binh-dinh': 'Bình Định', 'thai-nguyen': 'Thái Nguyên', 'toan-quoc': 'Toàn quốc'
    };
    return locationNames[primaryLocation] || news.location.replace(/,/g, ', ');
}

function getProvinceCodeFromLocation(location) {
    const map = {
        'ha-noi': 'hanoi', 'tp-hcm': 'hcm', 'da-nang': 'danang', 'thai-nguyen': 'thai-nguyen', 'dak-lak': 'dak-lak', 'binh-dinh': 'binh-dinh',
        'mien-bac': 'hanoi', 'mien-trung': 'danang'
    };
    const key = location.split(',')[0];
    return map[key] || 'all';
}

function getPriorityFromNews(news) {
    const priorityMap = { 'thien-tai': 'high', 'tai-nan': 'medium', 'cuu-ho': 'medium', 'canh-bao': 'high' };
    return priorityMap[news.type] || 'medium';
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN') + ' ' + date.toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'});
}

function formatTime(dateString) {
    const date = new Date(dateString);
    return date.toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'});
}

// 🔹 Khởi tạo dữ liệu sự cố tổng hợp
const newsEmergencies = convertNewsToEmergencies(newsData);
const allInitialEmergencies = [...emergencies, ...newsEmergencies];

// 🗺️ Khởi tạo bản đồ Leaflet
const map = L.map("map").setView([16.0471, 108.2068], 6);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
}).addTo(map);

let currentMarkers = [];
let currentFilters = { type: 'all', province: 'all', search: '' };

// === MAP & RENDER LOGIC ===
function showEmergencyDetail(id) {
    const emergency = allInitialEmergencies.find(e => e.id === id);
    if (!emergency) return;
    
    // Logic cập nhật modal (giữ nguyên từ code gốc)
    document.getElementById('modal-id').textContent = `#${emergency.id}`;
    document.getElementById('modal-title').textContent = emergency.name;
    document.getElementById('modal-type').textContent = getTypeName(emergency.type);
    document.getElementById('modal-status').textContent = emergency.status === 'active' ? 'Đang xử lý' : 'Đã giải quyết';
    document.getElementById('modal-status').className = `status-badge ${emergency.status === 'active' ? 'priority-high' : 'priority-low'}`;
    document.getElementById('modal-priority').textContent = getPriorityName(emergency.priority);
    document.getElementById('modal-priority').className = `status-badge priority-${emergency.priority}`;
    document.getElementById('modal-time').textContent = emergency.time;
    document.getElementById('modal-address').textContent = emergency.address;
    document.getElementById('modal-province').textContent = getProvinceName(emergency.province);
    document.getElementById('modal-coords').textContent = `${emergency.coords[0].toFixed(4)}, ${emergency.coords[1].toFixed(4)}`;
    document.getElementById('modal-description').textContent = emergency.description;
    document.getElementById('modal-reporter-name').textContent = emergency.reporter.name;
    document.getElementById('modal-reporter-phone').textContent = emergency.reporter.phone;
    document.getElementById('modal-report-time').textContent = emergency.reporter.reportTime;

    // Thêm nguồn tin nếu là từ news
    const descriptionEl = document.getElementById('modal-description');
    if (emergency.newsData) {
        const cleanContent = emergency.newsData.content.replace(/<[^>]+>/g, '');
        descriptionEl.innerHTML = emergency.description + `<br><br><strong>Nguồn tin:</strong> ${cleanContent.substring(0, 300)}...`;
    } else {
        descriptionEl.textContent = emergency.description;
    }

    // Cập nhật lực lượng ứng phó
    const responseTeamsContainer = document.getElementById('modal-response-teams');
    responseTeamsContainer.innerHTML = emergency.responseTeams.map(team => `
        <div class="flex justify-between items-center p-2 bg-white rounded border">
            <div>
                <div class="font-medium">${team.name}</div>
                <div class="text-sm text-gray-600">${team.status}</div>
            </div>
            <div class="text-sm font-semibold ${team.eta === '0 phút' || team.eta === 'Đang điều phối' || team.eta === 'Đang chờ' ? 'text-orange-600' : 'text-green-600'}">
                ${team.eta}
            </div>
        </div>
    `).join('');

    // Cập nhật timeline
    const timelineContainer = document.getElementById('modal-timeline');
    timelineContainer.innerHTML = emergency.timeline.map(item => `
        <div class="flex items-center space-x-3">
            <div class="flex-shrink-0 w-3 h-3 rounded-full ${
                item.status === 'completed' ? 'bg-green-500' :
                item.status === 'in-progress' ? 'bg-yellow-500 animate-pulse' : 'bg-gray-300'
            }"></div>
            <div class="flex-1">
                <div class="flex justify-between">
                    <span class="font-medium">${item.event}</span>
                    <span class="text-sm text-gray-500">${item.time}</span>
                </div>
            </div>
        </div>
    `).join('');

    document.getElementById('emergency-detail-modal').classList.remove('hidden');
    feather.replace();
}

function closeEmergencyDetail() {
    document.getElementById('emergency-detail-modal').classList.add('hidden');
}

function filterEmergencies() {
    return allInitialEmergencies.filter(emg => {
        const typeMatch = currentFilters.type === 'all' || emg.type === currentFilters.type;
        const provinceMatch = currentFilters.province === 'all' || emg.province === currentFilters.province || emg.address.toLowerCase().includes(getProvinceName(currentFilters.province).toLowerCase());
        const searchMatch = currentFilters.search === '' || 
            emg.name.toLowerCase().includes(currentFilters.search.toLowerCase()) ||
            emg.address.toLowerCase().includes(currentFilters.search.toLowerCase());
        
        return typeMatch && provinceMatch && searchMatch;
    });
}

function flyToProvince(provinceCode) {
    if (provinceCode === 'all') {
        map.flyTo([16.0471, 108.2068], 6, { duration: 1.5, easeLinearity: 0.25 });
    } else if (provinceCoordinates[provinceCode]) {
        const coords = provinceCoordinates[provinceCode];
        map.flyTo(coords, 11, { duration: 1.5, easeLinearity: 0.25 });
        
        const provinceMarker = L.marker(coords)
            .addTo(map)
            .bindPopup(`<b>${getProvinceName(provinceCode)}</b><br>Đang hiển thị sự cố trong khu vực`)
            .openPopup();
        
        setTimeout(() => { map.removeLayer(provinceMarker); }, 3000);
    }
}

function drawMarkers() {
    currentMarkers.forEach(marker => map.removeLayer(marker));
    currentMarkers = [];

    const filteredEmergencies = filterEmergencies();
    
    filteredEmergencies.forEach(emg => {
        const color = getColorByType(emg.type);
        const icon = getIconByType(emg.type);
        
        const marker = L.marker(emg.coords, {
            icon: L.divIcon({
                html: `
                    <div class="relative">
                        <div class="w-10 h-10 bg-${color}-500 rounded-full flex items-center justify-center text-white shadow-lg border-2 border-white transform hover:scale-110 transition-transform cursor-pointer ${emg.status === 'resolved' ? 'opacity-70' : ''}">
                            <span class="text-lg">${icon}</span>
                        </div>
                        ${emg.status === 'active' ? '<div class="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>' : ''}
                    </div>
                `,
                className: 'custom-marker',
                iconSize: [40, 40],
                iconAnchor: [20, 20]
            })
        })
        .addTo(map)
        .bindPopup(`
            <div class="p-3 min-w-[250px]">
                <div class="flex items-center mb-2">
                    <div class="w-6 h-6 bg-${color}-500 rounded-full flex items-center justify-center mr-2 text-white">
                        <span>${icon}</span>
                    </div>
                    <h4 class="font-bold text-gray-800">${emg.name}</h4>
                </div>
                <p class="text-sm text-gray-600 mb-2">${emg.address}</p>
                <p class="text-sm text-gray-500 mb-3 line-clamp-2">${emg.description}</p>
                <div class="flex justify-between items-center text-xs mb-3">
                    <span class="px-2 py-1 bg-${color}-100 text-${color}-700 rounded">${getTypeName(emg.type)}</span>
                    <span class="text-gray-500">${emg.time}</span>
                </div>
                <div class="mt-3 flex gap-2">
                    <button onclick="showEmergencyDetail(${emg.id})" class="flex-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition">
                        Chi tiết
                    </button>
                    <button onclick="shareEmergency(${emg.id})" class="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm transition">
                        Chia sẻ
                    </button>
                </div>
            </div>
        `);

        currentMarkers.push(marker);
    });

    updateStatistics();
    updateRecentIncidents();
}

// 🔹 Hàm cập nhật thống kê
function updateStatistics() {
    const active = allInitialEmergencies.filter(e => e.status === 'active').length;
    const resolved = allInitialEmergencies.filter(e => e.status === 'resolved').length;
    const total = allInitialEmergencies.length;
    
    document.getElementById('active-incidents').textContent = active;
    document.getElementById('resolved-incidents').textContent = resolved;
    document.getElementById('total-incidents').textContent = total;
    
    // Cập nhật số lượng theo loại
    const typeCounts = { fire: 0, flood: 0, accident: 0, disaster: 0, rescue: 0, warning: 0 };
    allInitialEmergencies.forEach(emg => { if (typeCounts.hasOwnProperty(emg.type)) { typeCounts[emg.type]++; } });
    
    Object.keys(typeCounts).forEach(type => {
        const element = document.getElementById(`count-${type}`);
        if (element) { element.textContent = typeCounts[type]; }
    });

    // Cập nhật thời gian
    document.getElementById('last-update').textContent = new Date().toLocaleTimeString('vi-VN');
}

// 🔹 Hàm cập nhật danh sách sự cố gần đây
function updateRecentIncidents() {
    const container = document.getElementById('recent-incidents');
    
    // Sắp xếp theo ID (ID cao hơn là mới hơn)
    const recentEmergencies = [...allInitialEmergencies]
        .sort((a, b) => b.id - a.id)
        .slice(0, 6);
    
    container.innerHTML = recentEmergencies.map(emg => {
        const isFromNews = emg.id >= 1000;
        const typeClass = getTypeClass(emg.type);
        const icon = getIconByType(emg.type);
        
        return `
            <div class="emergency-card bg-white p-4 rounded-lg border-l-4 ${typeClass.border} hover:shadow-md transition-all cursor-pointer" 
                  onclick="showEmergencyDetail(${emg.id})">
                <div class="flex items-start justify-between mb-2">
                    <div class="flex items-center">
                        <h4 class="font-bold text-gray-800 mr-2">${emg.name}</h4>
                        ${isFromNews ? '<span class="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded">TIN TỨC</span>' : ''}
                    </div>
                    <span class="px-2 py-1 text-xs rounded ${
                        emg.status === 'active' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                    }">
                        ${emg.status === 'active' ? 'Đang xử lý' : 'Đã giải quyết'}
                    </span>
                </div>
                <div class="flex items-center text-sm text-gray-600 mb-2">
                    <span class="mr-3">${icon}</span>
                    <span>${emg.address}</span>
                </div>
                <p class="text-sm text-gray-500 mb-3 line-clamp-2">${emg.description}</p>
                <div class="flex justify-between items-center text-xs">
                    <span class="text-gray-500">${emg.time}</span>
                    <button class="text-blue-600 hover:text-blue-800 font-medium flex items-center">
                        Chi tiết
                        <i data-feather="arrow-right" class="ml-1 w-3 h-3"></i>
                    </button>
                </div>
            </div>
        `;
    }).join('');
    
    feather.replace();
}

// 🔹 Hàm hỗ trợ (Cần là Global để sử dụng trong Leaflet Popup HTML)
window.shareEmergency = function(id) {
    const emergency = allInitialEmergencies.find(e => e.id === id);
    if (emergency && navigator.share) {
        navigator.share({
            title: `Sự cố: ${emergency.name}`,
            text: `${emergency.name} - ${emergency.address}\n${emergency.description}`,
            url: window.location.href
        });
    } else {
        alert('Chức năng chia sẻ không được hỗ trợ trên thiết bị này.');
    }
}

window.viewEmergencyOnMap = function(id) {
    const emergency = allInitialEmergencies.find(e => e.id === id);
    if (emergency) {
        map.flyTo(emergency.coords, 15, { duration: 1.5 });
        // Mở popup tương ứng
        currentMarkers.forEach(marker => {
            const markerCoords = marker.getLatLng();
            if (markerCoords.lat === emergency.coords[0] && markerCoords.lng === emergency.coords[1]) {
                marker.openPopup();
            }
        });
    }
}

window.showEmergencyDetail = showEmergencyDetail;

// === EVENT LISTENERS ===
document.getElementById('type-filter').addEventListener('change', (e) => {
    currentFilters.type = e.target.value;
    drawMarkers();
});

document.getElementById('province-filter').addEventListener('change', (e) => {
    currentFilters.province = e.target.value;
    flyToProvince(e.target.value);
    drawMarkers();
});

document.getElementById('search-incidents').addEventListener('input', (e) => {
    currentFilters.search = e.target.value;
    drawMarkers();
});

document.getElementById('reset-filters').addEventListener('click', () => {
    currentFilters = { type: 'all', province: 'all', search: '' };
    document.getElementById('type-filter').value = 'all';
    document.getElementById('province-filter').value = 'all';
    document.getElementById('search-incidents').value = '';
    flyToProvince('all');
    drawMarkers();
});

// Click vào chú thích để lọc
document.querySelectorAll('[data-type]').forEach(item => {
    item.addEventListener('click', () => {
        currentFilters.type = item.dataset.type;
        document.getElementById('type-filter').value = currentFilters.type;
        drawMarkers();
    });
});

// Map controls
document.getElementById('locate-btn').addEventListener('click', () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(pos => {
            const lat = pos.coords.latitude;
            const lng = pos.coords.longitude;
            map.flyTo([lat, lng], 13, { duration: 1.5 });
            L.marker([lat, lng]).addTo(map)
                .bindPopup("📍 Vị trí của bạn")
                .openPopup();
        }, () => {
            alert("Không thể lấy vị trí của bạn. Vui lòng kiểm tra quyền truy cập vị trí.");
        });
    } else {
        alert("Trình duyệt không hỗ trợ định vị!");
    }
});

document.getElementById('zoom-in-btn').addEventListener('click', () => { map.zoomIn(); });
document.getElementById('zoom-out-btn').addEventListener('click', () => { map.zoomOut(); });

// Modal Event Listeners
document.getElementById('close-modal').addEventListener('click', closeEmergencyDetail);
document.getElementById('modal-close-btn').addEventListener('click', closeEmergencyDetail);
document.getElementById('emergency-detail-modal').addEventListener('click', (e) => {
    if (e.target.id === 'emergency-detail-modal' || e.target.classList.contains('modal-overlay')) {
        closeEmergencyDetail();
    }
});

// Khởi tạo
function initializeMap() {
    // Đảm bảo các hàm phụ trợ cần thiết cho Leaflet popup được khai báo trước khi drawMarkers
    drawMarkers();
    updateStatistics();
    updateRecentIncidents();
}

initializeMap();
setInterval(updateStatistics, 30000); // Cập nhật thời gian thực mỗi 30 giây
