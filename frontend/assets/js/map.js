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





//map// Khởi tạo bản đồ
//map// Khởi tạo bản đồ
let map;
let markers = [];
let currentIncidents = [];
function initMap() {
    console.log('Đang khởi tạo bản đồ...');
    
    // Khởi tạo bản đồ chính
    initMainMap();
    
    // Khởi tạo bản đồ sự cố (nếu tồn tại)
    initIncidentMap();
    
    console.log('Khởi tạo bản đồ hoàn tất');
}

function initMainMap() {
    // Đảm bảo phần tử map tồn tại
    const mapElement = document.getElementById('map');
    if (!mapElement) {
        console.error('Không tìm thấy phần tử map!');
        return;
    }
    
    // Tạo bản đồ với trung tâm là Việt Nam
    map = L.map('map').setView([16.0, 108.0], 6);
    console.log('Bản đồ đã được khởi tạo');
    
    // Thêm tile layer (OpenStreetMap)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    
    // Thêm các marker giả lập
    currentIncidents = generateMockIncidents();
    console.log('Đã tạo', currentIncidents.length, 'sự cố mẫu');
    
    // Tạo marker cho mỗi sự cố
    currentIncidents.forEach(incident => {
        createIncidentMarker(incident);
    });
    
    console.log('Đã tạo', markers.length, 'marker trên bản đồ');
    
    // Cập nhật thống kê
    updateStatistics(currentIncidents);
    
    // Hiển thị sự cố gần đây
    displayRecentIncidents(currentIncidents);
    
    // Thêm sự kiện cho các nút điều khiển bản đồ
    document.getElementById('zoom-in-btn').addEventListener('click', () => {
        map.zoomIn();
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
    
    // Khởi tạo phần sự cố gần đây
    initRecentIncidents();
    setupRecentEventListeners();
    
    // Khởi tạo feather icons
    if (typeof feather !== 'undefined') {
        feather.replace();
    }
}

function initIncidentMap() {
    const incidentMapElement = document.getElementById('incident-map');
    if (!incidentMapElement) {
        console.log('Không tìm thấy bản đồ sự cố, bỏ qua khởi tạo');
        return;
    }
    
    console.log('Đang khởi tạo bản đồ sự cố...');
    
    // Tạo bản đồ sự cố với trung tâm là Việt Nam
    const incidentMap = L.map('incident-map').setView([16.0, 108.0], 6);
    console.log('Bản đồ sự cố đã được khởi tạo');
    
    // Thêm tile layer (OpenStreetMap)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(incidentMap);
    
    // Thêm các marker giả lập cho bản đồ sự cố
    const incidentMapIncidents = generateMockIncidents();
    console.log('Đã tạo', incidentMapIncidents.length, 'sự cố mẫu cho bản đồ sự cố');
    
    // Tạo marker cho mỗi sự cố trên bản đồ sự cố
    incidentMapIncidents.forEach(incident => {
        createIncidentMarkerForMap(incident, incidentMap);
    });
    
    console.log('Đã tạo marker trên bản đồ sự cố');
}

// Hàm tạo marker cho bản đồ sự cố
function createIncidentMarkerForMap(incident, targetMap) {
    let iconColor;
    let iconSymbol;
    
    switch(incident.type) {
        case 'fire':
            iconColor = '#ef4444';
            iconSymbol = '🔥';
            break;
        case 'flood':
            iconColor = '#3b82f6';
            iconSymbol = '💧';
            break;
        case 'accident':
            iconColor = '#f97316';
            iconSymbol = '🚗';
            break;
        case 'disaster':
            iconColor = '#8b5cf6';
            iconSymbol = '⚠️';
            break;
        default:
            iconColor = '#6b7280';
            iconSymbol = '📍';
    }
    
    const customIcon = L.divIcon({
        html: `<div style="width: 40px; height: 40px; border-radius: 50%; background-color: ${iconColor}; display: flex; align-items: center; justify-content: center; color: white; font-size: 16px; box-shadow: 0 2px 5px rgba(0,0,0,0.3); border: 3px solid white;">${iconSymbol}</div>`,
        className: 'custom-marker',
        iconSize: [40, 40],
        iconAnchor: [20, 20]
    });
    
    const marker = L.marker(incident.position, { icon: customIcon }).addTo(targetMap);
    
    // Thêm popup thông tin đơn giản
    marker.bindPopup(`
        <div style="min-width: 250px; padding: 10px;">
            <h4 style="margin: 0 0 8px 0; font-weight: bold; font-size: 16px;">${incident.title}</h4>
            <div style="display: flex; gap: 8px; margin-bottom: 8px;">
                <span style="padding: 4px 8px; border-radius: 6px; font-size: 12px; font-weight: 600; background-color: #fef3c7; color: #d97706;">
                    ${incident.status === 'active' ? 'Đang xử lý' : 'Đã giải quyết'}
                </span>
            </div>
            <p style="margin: 0 0 5px 0; color: #666; font-size: 14px;">${incident.address}</p>
            <p style="margin: 0; font-size: 12px; color: #999;">${incident.time}</p>
            <div style="margin-top: 10px;">
                <button class="view-incident-details" data-id="${incident.id}" style="width: 100%; padding: 8px; background-color: #ef4444; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 12px;">
                    Xem chi tiết
                </button>
            </div>
        </div>
    `);
    
    marker.on('click', function() {
        targetMap.setView(incident.position, 15);
    });
    
    // Thêm sự kiện cho popup
    marker.on('popupopen', function() {
        // Sự kiện cho nút xem chi tiết
        document.querySelectorAll('.view-incident-details').forEach(button => {
            button.addEventListener('click', function() {
                const incidentId = this.getAttribute('data-id');
                const incident = currentIncidents.find(i => i.id === incidentId);
                if (incident) {
                    openIncidentModal(incident);
                    targetMap.closePopup();
                }
            });
        });
    });
}

// Tạo dữ liệu sự cố mẫu
function generateMockIncidents() {
    return [
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
            name: 'Phạm Thị DD',
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
    }
];
}

// Tạo marker cho sự cố - ĐƠN GIẢN HÓA
function createIncidentMarker(incident) {
    console.log('Đang tạo marker cho sự cố:', incident.id, incident.position);
    
    let iconColor;
    let iconSymbol;
    
    switch(incident.type) {
        case 'fire':
            iconColor = '#ef4444';
            iconSymbol = '🔥';
            break;
        case 'flood':
            iconColor = '#3b82f6';
            iconSymbol = '💧';
            break;
        case 'accident':
            iconColor = '#f97316';
            iconSymbol = '🚗';
            break;
        case 'disaster':
            iconColor = '#8b5cf6';
            iconSymbol = '⚠️';
            break;
        default:
            iconColor = '#6b7280';
            iconSymbol = '📍';
    }
    
    const customIcon = L.divIcon({
        html: `<div style="width: 40px; height: 40px; border-radius: 50%; background-color: ${iconColor}; display: flex; align-items: center; justify-content: center; color: white; font-size: 16px; box-shadow: 0 2px 5px rgba(0,0,0,0.3); border: 3px solid white;">${iconSymbol}</div>`,
        className: 'custom-marker',
        iconSize: [40, 40],
        iconAnchor: [20, 20]
    });
    
    try {
        const marker = L.marker(incident.position, { icon: customIcon }).addTo(map);
        markers.push(marker);
        
        // Popup đơn giản hóa
        marker.bindPopup(`
            <div style="min-width: 250px; padding: 10px;">
                <h4 style="margin: 0 0 8px 0; font-weight: bold; font-size: 16px;">${incident.title}</h4>
                <div style="display: flex; gap: 8px; margin-bottom: 8px;">
                    <span style="padding: 4px 8px; border-radius: 6px; font-size: 12px; font-weight: 600; background-color: #fef3c7; color: #d97706;">
                        ${incident.status === 'active' ? 'Đang xử lý' : 'Đã giải quyết'}
                    </span>
                </div>
                <p style="margin: 0 0 5px 0; color: #666; font-size: 14px;">${incident.address}</p>
                <p style="margin: 0; font-size: 12px; color: #999;">${incident.time}</p>
                <div style="margin-top: 10px; display: flex; gap: 8px;">
                    <button class="view-details-btn" data-id="${incident.id}" style="flex: 1; padding: 8px; background-color: #ef4444; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 12px;">
                        Chi tiết
                    </button>
                    <button class="zoom-to-btn" data-lat="${incident.position[0]}" data-lng="${incident.position[1]}" style="flex: 1; padding: 8px; background-color: #3b82f6; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 12px;">
                        Xem bản đồ
                    </button>
                </div>
            </div>
        `);
        
        // Thêm sự kiện click để zoom
        marker.on('click', function() {
            map.setView(incident.position, 15);
        });
        
        // Thêm sự kiện cho popup
        marker.on('popupopen', function() {
            // Sự kiện cho nút xem chi tiết
            document.querySelectorAll('.view-details-btn').forEach(button => {
                button.addEventListener('click', function() {
                    const incidentId = this.getAttribute('data-id');
                    const incident = currentIncidents.find(i => i.id === incidentId);
                    if (incident) {
                        openIncidentModal(incident);
                        map.closePopup();
                    }
                });
            });
            
            // Sự kiện cho nút xem bản đồ
            document.querySelectorAll('.zoom-to-btn').forEach(button => {
                button.addEventListener('click', function() {
                    const lat = parseFloat(this.getAttribute('data-lat'));
                    const lng = parseFloat(this.getAttribute('data-lng'));
                    map.setView([lat, lng], 15);
                    map.closePopup();
                });
            });
        });
        
        console.log('Đã tạo marker thành công cho:', incident.id);
        return marker;
    } catch (error) {
        console.error('Lỗi khi tạo marker:', error, incident);
        return null;
    }
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

// Hiển thị sự cố gần đây - ĐƠN GIẢN HÓA
function displayRecentIncidents(incidents) {
    const container = document.getElementById('recent-incidents');
    if (!container) return;
    
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
            </div>
            <p class="text-gray-600 mb-3">${incident.address}</p>
            <div class="flex justify-between items-center text-sm text-gray-500">
                <span>${incident.time}</span>
                <div class="flex gap-2">
                    <button class="text-blue-500 hover:text-blue-700 font-medium view-on-map" data-lat="${incident.position[0]}" data-lng="${incident.position[1]}">
                        Xem bản đồ
                    </button>
                    <button class="text-red-500 hover:text-red-700 font-medium view-details" data-id="${incident.id}">
                        Chi tiết
                    </button>
                </div>
            </div>
        `;
        
        container.appendChild(incidentCard);
        
        // Thêm sự kiện click để mở modal chi tiết
        incidentCard.querySelector('.view-details').addEventListener('click', function() {
            const incidentId = this.getAttribute('data-id');
            const incident = currentIncidents.find(i => i.id === incidentId);
            if (incident) {
                openIncidentModal(incident);
            }
        });
        
        // Thêm sự kiện cho nút "Xem bản đồ"
        incidentCard.querySelector('.view-on-map').addEventListener('click', function() {
            const lat = parseFloat(this.getAttribute('data-lat'));
            const lng = parseFloat(this.getAttribute('data-lng'));
            map.setView([lat, lng], 15);
            
            // Chuyển sang tab bản đồ nếu đang ở tab khác
            const mapTab = document.querySelector('[data-tab="map"]');
            if (mapTab && !mapTab.classList.contains('active')) {
                mapTab.click();
            }
        });
    });
    
    if (typeof feather !== 'undefined') {
        feather.replace();
    }
}

// Mở modal chi tiết sự cố - ĐƠN GIẢN HÓA
function openIncidentModal(incident) {
    const modal = document.getElementById('emergency-detail-modal');
    const modalTitle = document.getElementById('modal-title');
    
    if (!modal || !modalTitle) {
        console.error('Không tìm thấy modal elements');
        return;
    }
    
    // Cập nhật thông tin cơ bản - đơn giản hóa
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
    
    // Cập nhật mô tả ngắn gọn
    document.getElementById('modal-description').textContent = incident.description;
    
    // Cập nhật thông tin người báo cáo
    document.getElementById('modal-reporter-name').textContent = incident.reporter.name;
    document.getElementById('modal-reporter-phone').textContent = incident.reporter.phone;
    
    // Cập nhật lực lượng ứng phó - chỉ hiển thị tên
    const responseTeamsContainer = document.getElementById('modal-response-teams');
    if (responseTeamsContainer) {
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
    }
    
    // Timeline đơn giản
    const timelineContainer = document.getElementById('modal-timeline');
    if (timelineContainer) {
        timelineContainer.innerHTML = '';
        
        incident.timeline.slice(-3).forEach(item => { // Chỉ hiển thị 3 sự kiện gần nhất
            const timelineItem = document.createElement('div');
            timelineItem.className = 'timeline-item';
            timelineItem.innerHTML = `
                <div class="font-medium text-gray-900">${item.time}</div>
                <div class="text-gray-600">${item.action}</div>
            `;
            timelineContainer.appendChild(timelineItem);
        });
    }
    
    // Cập nhật tiêu đề modal
    modalTitle.textContent = incident.title;
    
    // Hiển thị modal
    modal.classList.remove('hidden');
    
    // Ngăn chặn cuộn trang nền
    document.body.style.overflow = 'hidden';
    
    // Cập nhật sự kiện cho nút "Xem trên bản đồ" trong modal
    const navigateBtn = document.getElementById('modal-navigate-btn');
    if (navigateBtn) {
        navigateBtn.onclick = function() {
            map.setView(incident.position, 15);
            closeModal();
        };
        
        // Đảm bảo nút hiển thị rõ ràng
        navigateBtn.innerHTML = '<i data-feather="map" class="w-4 h-4 mr-2"></i>Xem trên bản đồ';
        navigateBtn.className = 'px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition flex items-center justify-center';
    }
    
    // Cập nhật feather icons trong modal
    if (typeof feather !== 'undefined') {
        feather.replace();
    }
}

// Đóng modal
function closeModal() {
    const modal = document.getElementById('emergency-detail-modal');
    if (modal) {
        modal.classList.add('hidden');
    }
    document.body.style.overflow = 'auto';
}

// Áp dụng bộ lọc
function applyFilters() {
    const provinceFilter = document.getElementById('province-filter')?.value || 'all';
    const typeFilter = document.getElementById('type-filter')?.value || 'all';
    const searchTerm = document.getElementById('search-input')?.value.toLowerCase() || '';
    
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
        default: return 'Không xác định';
    }
}

// ========== PHẦN SỰ CỐ GẦN ĐÂY ==========

function initRecentIncidents() {
    displayRecentIncidentsList();
    updateRecentStatistics();
}

function displayRecentIncidentsList(incidents = getRecentIncidents()) {
    const container = document.getElementById('recent-incidents-list');
    if (!container) return;
    
    container.innerHTML = '';

    if (incidents.length === 0) {
        container.innerHTML = `
            <div class="col-span-2 text-center py-12">
                <i data-feather="search" class="w-16 h-16 text-gray-400 mx-auto mb-4"></i>
                <h3 class="text-lg font-medium text-gray-900 mb-2">Không tìm thấy sự cố nào</h3>
                <p class="text-gray-500">Hãy thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
            </div>
        `;
        if (typeof feather !== 'undefined') {
            feather.replace();
        }
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
                    <button class="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition flex items-center view-on-map-recent" data-lat="${incident.position[0]}" data-lng="${incident.position[1]}">
                        <i data-feather="map" class="w-4 h-4 mr-1"></i>
                        Bản đồ
                    </button>
                    <button class="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition flex items-center view-recent-details" data-id="${incident.id}">
                        <i data-feather="eye" class="w-4 h-4 mr-1"></i>
                        Chi tiết
                    </button>
                </div>
            </div>
        `;
        
        container.appendChild(incidentCard);
    });
    
    if (typeof feather !== 'undefined') {
        feather.replace();
    }
    
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
    
    // Thêm sự kiện cho nút "Xem bản đồ"
    document.querySelectorAll('.view-on-map-recent').forEach(button => {
        button.addEventListener('click', function() {
            const lat = parseFloat(this.getAttribute('data-lat'));
            const lng = parseFloat(this.getAttribute('data-lng'));
            map.setView([lat, lng], 15);
            
            // Chuyển sang tab bản đồ
            const mapTab = document.querySelector('[data-tab="map"]');
            if (mapTab && !mapTab.classList.contains('active')) {
                mapTab.click();
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
    
    const recentTotalEl = document.getElementById('recent-total-incidents');
    const recentActiveEl = document.getElementById('recent-active-incidents');
    const recentResolvedEl = document.getElementById('recent-resolved-incidents');
    const recentTodayEl = document.getElementById('recent-today-incidents');
    
    if (recentTotalEl) recentTotalEl.textContent = total;
    if (recentActiveEl) recentActiveEl.textContent = active;
    if (recentResolvedEl) recentResolvedEl.textContent = resolved;
    if (recentTodayEl) recentTodayEl.textContent = today;
}

function setupRecentEventListeners() {
    // Bộ lọc tìm kiếm
    const searchRecentEl = document.getElementById('search-recent-incidents');
    const recentTypeFilterEl = document.getElementById('recent-type-filter');
    const recentStatusFilterEl = document.getElementById('recent-status-filter');
    const sortByEl = document.getElementById('sort-by');
    const resetRecentFiltersEl = document.getElementById('reset-recent-filters');
    
    if (searchRecentEl) {
        searchRecentEl.addEventListener('input', applyRecentFilters);
    }
    if (recentTypeFilterEl) {
        recentTypeFilterEl.addEventListener('change', applyRecentFilters);
    }
    if (recentStatusFilterEl) {
        recentStatusFilterEl.addEventListener('change', applyRecentFilters);
    }
    if (sortByEl) {
        sortByEl.addEventListener('change', applyRecentFilters);
    }
    if (resetRecentFiltersEl) {
        resetRecentFiltersEl.addEventListener('click', resetRecentFilters);
    }
}

function applyRecentFilters() {
    const searchTerm = document.getElementById('search-recent-incidents')?.value.toLowerCase() || '';
    const typeFilter = document.getElementById('recent-type-filter')?.value || 'all';
    const statusFilter = document.getElementById('recent-status-filter')?.value || 'all';
    const sortBy = document.getElementById('sort-by')?.value || 'newest';
    
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
    
    displayRecentIncidentsList(filteredIncidents);
    updateRecentStatistics();
}

function resetRecentFilters() {
    const searchRecentEl = document.getElementById('search-recent-incidents');
    const recentTypeFilterEl = document.getElementById('recent-type-filter');
    const recentStatusFilterEl = document.getElementById('recent-status-filter');
    const sortByEl = document.getElementById('sort-by');
    
    if (searchRecentEl) searchRecentEl.value = '';
    if (recentTypeFilterEl) recentTypeFilterEl.value = 'all';
    if (recentStatusFilterEl) recentStatusFilterEl.value = 'all';
    if (sortByEl) sortByEl.value = 'newest';
    
    displayRecentIncidentsList();
    updateRecentStatistics();
}

function getRecentIncidents() {
    // Sử dụng dữ liệu từ currentIncidents hoặc tạo dữ liệu mẫu
    if (typeof currentIncidents !== 'undefined' && currentIncidents.length > 0) {
        return currentIncidents.slice(0, 8); // Giới hạn 8 sự cố gần đây
    }
    
    // Dữ liệu mẫu nếu không có từ map.js
    return generateMockIncidents().slice(0, 8);
}

// Khởi tạo bản đồ khi trang được tải
document.addEventListener('DOMContentLoaded', initMap);

// Hàm debug để kiểm tra
function debugMap() {
    console.log('=== DEBUG MAP ===');
    console.log('Map object:', map);
    console.log('Markers:', markers);
    console.log('Current incidents:', currentIncidents);
    console.log('Map container:', document.getElementById('map'));
    if (map) {
        console.log('Map bounds:', map.getBounds());
        console.log('Map center:', map.getCenter());
        console.log('Map zoom:', map.getZoom());
    }
}

// Gọi hàm debug sau khi khởi tạo (có thể xóa sau khi debug xong)
setTimeout(debugMap, 2000);