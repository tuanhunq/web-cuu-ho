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