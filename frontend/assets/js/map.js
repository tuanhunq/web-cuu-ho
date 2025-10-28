
document.addEventListener("DOMContentLoaded", () => {
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

    // 🔹 Dữ liệu sự cố mẫu với tỉnh thành
    const emergencies = [
        { id: 1, name: "Cháy nhà dân", address: "Số 35 Trần Hưng Đạo, Hoàn Kiếm, Hà Nội", coords: [21.027, 105.85], type: "fire", province: "hanoi", status: "active", time: "10 phút trước" },
        { id: 2, name: "Ngập lụt khu dân cư", address: "Khu vực Định Công, Hoàng Mai, Hà Nội", coords: [20.98, 105.84], type: "flood", province: "hanoi", status: "active", time: "25 phút trước" },
        { id: 3, name: "Tai nạn giao thông", address: "QL1A - Phường Tân Tạo, Bình Tân, TP.HCM", coords: [10.76, 106.62], type: "accident", province: "hcm", status: "resolved", time: "1 giờ trước" },
        { id: 4, name: "Sạt lở đất", address: "Huyện Mường La, Sơn La", coords: [21.41, 104.11], type: "disaster", province: "sonla", status: "active", time: "2 giờ trước" },
        { id: 5, name: "Cháy rừng", address: "Vườn Quốc Gia Cúc Phương, Ninh Bình", coords: [20.31, 105.61], type: "fire", province: "ninhbinh", status: "active", time: "3 giờ trước" },
        { id: 6, name: "Ngập cục bộ", address: "Đường Nguyễn Văn Linh, Đà Nẵng", coords: [16.06, 108.21], type: "flood", province: "danang", status: "resolved", time: "4 giờ trước" }
    ];

    // 🗺️ Khởi tạo bản đồ
    const map = L.map("map").setView([16.0471, 108.2068], 6);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
    }).addTo(map);

    let currentMarkers = [];
    let currentFilters = { type: 'all', province: 'all', search: '' };

    // 🔹 Hàm cập nhật thống kê
    function updateStatistics() {
        const active = emergencies.filter(e => e.status === 'active').length;
        const resolved = emergencies.filter(e => e.status === 'resolved').length;
        
        document.getElementById('active-incidents').textContent = active;
        document.getElementById('resolved-incidents').textContent = resolved;
        
        // Cập nhật số lượng theo loại
        document.querySelectorAll('[id^="count-"]').forEach(el => {
            const type = el.id.replace('count-', '');
            const count = emergencies.filter(e => e.type === type).length;
            el.textContent = count;
        });

        // Cập nhật thời gian
        document.getElementById('last-update').textContent = new Date().toLocaleTimeString('vi-VN');
    }

    // 🔹 Hàm lọc sự cố
    function filterEmergencies() {
        return emergencies.filter(emg => {
            const typeMatch = currentFilters.type === 'all' || emg.type === currentFilters.type;
            const provinceMatch = currentFilters.province === 'all' || emg.province === currentFilters.province;
            const searchMatch = currentFilters.search === '' || 
                emg.name.toLowerCase().includes(currentFilters.search.toLowerCase()) ||
                emg.address.toLowerCase().includes(currentFilters.search.toLowerCase());
            
            return typeMatch && provinceMatch && searchMatch;
        });
    }

    // 🔹 Hàm chuyển đến tỉnh thành
    function flyToProvince(provinceCode) {
        if (provinceCode === 'all') {
            // Trở về bản đồ Việt Nam
            map.flyTo([16.0471, 108.2068], 6, {
                duration: 1.5,
                easeLinearity: 0.25
            });
        } else if (provinceCoordinates[provinceCode]) {
            // Bay đến tỉnh thành cụ thể
            const coords = provinceCoordinates[provinceCode];
            map.flyTo(coords, 11, {
                duration: 1.5,
                easeLinearity: 0.25
            });
            
            // Thêm marker trung tâm tỉnh
            const provinceMarker = L.marker(coords)
                .addTo(map)
                .bindPopup(`<b>${getProvinceName(provinceCode)}</b><br>Đang hiển thị sự cố trong khu vực`)
                .openPopup();
            
            // Tự động xóa marker sau 3 giây
            setTimeout(() => {
                map.removeLayer(provinceMarker);
            }, 3000);
        }
    }

    // 🔹 Hàm vẽ marker
    function drawMarkers() {
        // Xóa marker cũ
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
                    <div class="flex justify-between items-center text-xs">
                        <span class="px-2 py-1 bg-${color}-100 text-${color}-700 rounded">${getTypeName(emg.type)}</span>
                        <span class="text-gray-500">${emg.time}</span>
                    </div>
                    <div class="mt-3 flex gap-2">
                        <button onclick="viewEmergencyDetail(${emg.id})" class="flex-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition">
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
    }

    // 🔹 Hàm hỗ trợ
    function getColorByType(type) {
        const colors = {
            fire: 'red', flood: 'blue', accident: 'orange', 
            disaster: 'purple'
        };
        return colors[type] || 'gray';
    }

    function getIconByType(type) {
        const icons = {
            fire: '🔥', flood: '💧', accident: '🚗', 
            disaster: '🌪️'
        };
        return icons[type] || '⚠️';
    }

    function getTypeName(type) {
        const names = {
            fire: 'Hỏa hoạn', flood: 'Ngập lụt', accident: 'Tai nạn', 
            disaster: 'Thiên tai'
        };
        return names[type] || 'Khác';
    }

    function getProvinceName(code) {
        const names = {
            'hanoi': 'Hà Nội',
            'hcm': 'TP. Hồ Chí Minh',
            'danang': 'Đà Nẵng',
            'hue': 'Thừa Thiên Huế',
            'nghean': 'Nghệ An',
            'thanhhoa': 'Thanh Hóa',
            'haiphong': 'Hải Phòng',
            'cantho': 'Cần Thơ',
            'sonla': 'Sơn La',
            'ninhbinh': 'Ninh Bình'
        };
        return names[code] || code;
    }

    // 🔹 Event Listeners
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

    // Quick filter buttons
    document.querySelectorAll('.filter-quick').forEach(btn => {
        btn.addEventListener('click', () => {
            currentFilters.type = btn.dataset.type;
            document.getElementById('type-filter').value = currentFilters.type;
            drawMarkers();
        });
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
                map.flyTo([lat, lng], 13, {
                    duration: 1.5
                });
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

    document.getElementById('zoom-in-btn').addEventListener('click', () => {
        map.zoomIn();
    });

    document.getElementById('zoom-out-btn').addEventListener('click', () => {
        map.zoomOut();
    });

    // 🔹 Khởi tạo
    drawMarkers();
    updateStatistics();

    // Cập nhật thời gian thực mỗi 30 giây
    setInterval(updateStatistics, 30000);
});

// Hàm toàn cục để sử dụng trong popup
function viewEmergencyDetail(id) {
    alert(`Xem chi tiết sự cố #${id}`);
    // Có thể mở modal chi tiết ở đây
}

function shareEmergency(id) {
    if (navigator.share) {
        navigator.share({
            title: 'Thông tin sự cố khẩn cấp',
            text: 'Có sự cố khẩn cấp cần hỗ trợ',
            url: window.location.href
        });
    } else {
        alert('Chức năng chia sẻ không được hỗ trợ');
    }
}