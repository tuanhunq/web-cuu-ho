// Biến toàn cục để lưu trữ tất cả sự cố
let allIncidents = [];
let currentPage = 1;
const incidentsPerPage = 6;

// Hàm khởi tạo phần sự cố gần đây
function initRecentIncidents() {
    // Lấy dữ liệu sự cố từ bản đồ (giả sử có biến global mapIncidents)
    if (typeof mapIncidents !== 'undefined') {
        allIncidents = [...mapIncidents];
    } else {
        // Nếu không có dữ liệu từ bản đồ, tạo dữ liệu mẫu
        allIncidents = generateSampleIncidents();
    }
    
    // Hiển thị sự cố
    displayRecentIncidents();
    
    // Cập nhật thống kê
    updateRecentStats();
    
    // Thêm sự kiện cho bộ lọc và tìm kiếm
    setupRecentFilters();
}

// Hàm tạo dữ liệu mẫu (chỉ dùng khi không có dữ liệu từ bản đồ)
function generateSampleIncidents() {
    const incidentTypes = ['fire', 'flood', 'accident', 'disaster'];
    const provinces = ['Hà Nội', 'TP.Hồ Chí Minh', 'Đà Nẵng', 'Cần Thơ', 'Hải Phòng'];
    const statuses = ['active', 'resolved'];
    
    const incidents = [];
    
    for (let i = 1; i <= 12; i++) {
        const type = incidentTypes[Math.floor(Math.random() * incidentTypes.length)];
        const status = statuses[Math.floor(Math.random() * statuses.length)];
        const province = provinces[Math.floor(Math.random() * provinces.length)];
        
        incidents.push({
            id: `SC${String(i).padStart(4, '0')}`,
            title: `Sự cố ${type} tại ${province}`,
            type: type,
            status: status,
            priority: Math.floor(Math.random() * 3) + 1, // 1-3
            address: `Số ${Math.floor(Math.random() * 100) + 1}, Đường ABC, ${province}`,
            province: province,
            time: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000), // Trong 7 ngày qua
            description: `Mô tả chi tiết về sự cố ${type} tại ${province}. Đây là mô tả mẫu cho sự cố số ${i}.`,
            reporter: {
                name: `Người báo cáo ${i}`,
                phone: `0123.456.78${String(i).padStart(2, '0')}`
            },
            coordinates: {
                lat: 21.0 + Math.random() * 5,
                lng: 105.0 + Math.random() * 5
            }
        });
    }
    
    return incidents;
}

// Hàm hiển thị sự cố gần đây
function displayRecentIncidents(filteredIncidents = null) {
    const incidentsList = document.getElementById('recent-incidents-list');
    const pagination = document.getElementById('recent-pagination');
    
    if (!incidentsList) return;
    
    // Sử dụng dữ liệu đã lọc hoặc tất cả sự cố
    const incidentsToShow = filteredIncidents || allIncidents;
    
    // Sắp xếp sự cố
    const sortedIncidents = sortIncidents(incidentsToShow);
    
    // Tính toán phân trang
    const totalPages = Math.ceil(sortedIncidents.length / incidentsPerPage);
    const startIndex = (currentPage - 1) * incidentsPerPage;
    const endIndex = startIndex + incidentsPerPage;
    const paginatedIncidents = sortedIncidents.slice(startIndex, endIndex);
    
    // Hiển thị sự cố
    incidentsList.innerHTML = '';
    
    if (paginatedIncidents.length === 0) {
        incidentsList.innerHTML = `
            <div class="col-span-2 text-center py-12">
                <i data-feather="alert-circle" class="w-16 h-16 text-gray-400 mx-auto mb-4"></i>
                <h3 class="text-xl font-semibold text-gray-600 mb-2">Không có sự cố nào</h3>
                <p class="text-gray-500">Không tìm thấy sự cố phù hợp với bộ lọc của bạn.</p>
            </div>
        `;
        feather.replace();
        return;
    }
    
    paginatedIncidents.forEach(incident => {
        const incidentCard = createIncidentCard(incident);
        incidentsList.appendChild(incidentCard);
    });
    
    // Hiển thị phân trang
    displayPagination(totalPages, pagination);
    
    // Cập nhật biểu tượng feather
    feather.replace();
}

// Hàm tạo thẻ sự cố
function createIncidentCard(incident) {
    const card = document.createElement('div');
    card.className = 'bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition cursor-pointer';
    card.setAttribute('data-incident-id', incident.id);
    
    // Xác định màu sắc dựa trên loại sự cố
    let typeColor, typeIcon, typeText;
    switch (incident.type) {
        case 'fire':
            typeColor = 'red';
            typeIcon = 'flame';
            typeText = 'Hỏa hoạn';
            break;
        case 'flood':
            typeColor = 'blue';
            typeIcon = 'droplet';
            typeText = 'Ngập lụt';
            break;
        case 'accident':
            typeColor = 'orange';
            typeIcon = 'activity';
            typeText = 'Tai nạn';
            break;
        case 'disaster':
            typeColor = 'purple';
            typeIcon = 'alert-octagon';
            typeText = 'Thiên tai';
            break;
        default:
            typeColor = 'gray';
            typeIcon = 'alert-triangle';
            typeText = 'Khác';
    }
    
    // Định dạng thời gian
    const timeAgo = formatTimeAgo(incident.time);
    
    card.innerHTML = `
        <div class="p-5">
            <div class="flex justify-between items-start mb-3">
                <div class="flex items-center">
                    <div class="w-10 h-10 bg-${typeColor}-100 rounded-full flex items-center justify-center mr-3">
                        <i data-feather="${typeIcon}" class="text-${typeColor}-600 w-5 h-5"></i>
                    </div>
                    <div>
                        <h4 class="font-bold text-gray-800">${incident.title}</h4>
                        <span class="text-sm text-gray-500">${timeAgo}</span>
                    </div>
                </div>
                <span class="status-badge status-${incident.status}">${incident.status === 'active' ? 'Đang xử lý' : 'Đã giải quyết'}</span>
            </div>
            
            <div class="mb-4">
                <div class="flex items-center text-sm text-gray-600 mb-1">
                    <i data-feather="map-pin" class="w-4 h-4 mr-2"></i>
                    <span>${incident.address}</span>
                </div>
                <div class="flex items-center text-sm text-gray-600">
                    <i data-feather="calendar" class="w-4 h-4 mr-2"></i>
                    <span>${formatDate(incident.time)}</span>
                </div>
            </div>
            
            <p class="text-gray-600 text-sm mb-4 line-clamp-2">${incident.description}</p>
            
            <div class="flex justify-between items-center">
                <div class="flex items-center">
                    <div class="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center mr-2">
                        <i data-feather="user" class="w-3 h-3 text-gray-600"></i>
                    </div>
                    <span class="text-sm text-gray-600">${incident.reporter.name}</span>
                </div>
                <button class="text-${typeColor}-600 hover:text-${typeColor}-700 font-medium text-sm flex items-center">
                    Xem chi tiết
                    <i data-feather="chevron-right" class="w-4 h-4 ml-1"></i>
                </button>
            </div>
        </div>
    `;
    
    // Thêm sự kiện click để hiển thị modal chi tiết
    card.addEventListener('click', () => {
        showIncidentDetail(incident);
    });
    
    return card;
}

// Hàm sắp xếp sự cố
function sortIncidents(incidents) {
    const sortBy = document.getElementById('sort-by').value;
    
    switch (sortBy) {
        case 'newest':
            return [...incidents].sort((a, b) => new Date(b.time) - new Date(a.time));
        case 'oldest':
            return [...incidents].sort((a, b) => new Date(a.time) - new Date(b.time));
        case 'priority':
            return [...incidents].sort((a, b) => b.priority - a.priority);
        default:
            return incidents;
    }
}

// Hàm hiển thị phân trang
function displayPagination(totalPages, paginationElement) {
    paginationElement.innerHTML = '';
    
    if (totalPages <= 1) return;
    
    // Nút Previous
    const prevButton = document.createElement('button');
    prevButton.className = `px-3 py-2 border border-gray-300 rounded-lg ${currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'}`;
    prevButton.innerHTML = '<i data-feather="chevron-left" class="w-4 h-4"></i>';
    prevButton.disabled = currentPage === 1;
    prevButton.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            displayRecentIncidents();
        }
    });
    paginationElement.appendChild(prevButton);
    
    // Các nút trang
    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.className = `px-3 py-2 border rounded-lg ${currentPage === i ? 'bg-red-500 text-white border-red-500' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`;
        pageButton.textContent = i;
        pageButton.addEventListener('click', () => {
            currentPage = i;
            displayRecentIncidents();
        });
        paginationElement.appendChild(pageButton);
    }
    
    // Nút Next
    const nextButton = document.createElement('button');
    nextButton.className = `px-3 py-2 border border-gray-300 rounded-lg ${currentPage === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'}`;
    nextButton.innerHTML = '<i data-feather="chevron-right" class="w-4 h-4"></i>';
    nextButton.disabled = currentPage === totalPages;
    nextButton.addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            displayRecentIncidents();
        }
    });
    paginationElement.appendChild(nextButton);
    
    feather.replace();
}

// Hàm cập nhật thống kê
function updateRecentStats() {
    const totalIncidents = allIncidents.length;
    const activeIncidents = allIncidents.filter(incident => incident.status === 'active').length;
    const resolvedIncidents = allIncidents.filter(incident => incident.status === 'resolved').length;
    
    // Tính số sự cố hôm nay
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayIncidents = allIncidents.filter(incident => {
        const incidentDate = new Date(incident.time);
        incidentDate.setHours(0, 0, 0, 0);
        return incidentDate.getTime() === today.getTime();
    }).length;
    
    // Cập nhật DOM
    document.getElementById('recent-total-incidents').textContent = totalIncidents;
    document.getElementById('recent-active-incidents').textContent = activeIncidents;
    document.getElementById('recent-resolved-incidents').textContent = resolvedIncidents;
    document.getElementById('recent-today-incidents').textContent = todayIncidents;
}

// Hàm thiết lập bộ lọc
function setupRecentFilters() {
    const searchInput = document.getElementById('search-recent-incidents');
    const typeFilter = document.getElementById('recent-type-filter');
    const statusFilter = document.getElementById('recent-status-filter');
    const resetButton = document.getElementById('reset-recent-filters');
    const sortSelect = document.getElementById('sort-by');
    
    // Hàm lọc sự cố
    function filterIncidents() {
        const searchTerm = searchInput.value.toLowerCase();
        const typeValue = typeFilter.value;
        const statusValue = statusFilter.value;
        
        const filtered = allIncidents.filter(incident => {
            const matchesSearch = searchTerm === '' || 
                incident.title.toLowerCase().includes(searchTerm) ||
                incident.address.toLowerCase().includes(searchTerm) ||
                incident.description.toLowerCase().includes(searchTerm);
            
            const matchesType = typeValue === 'all' || incident.type === typeValue;
            const matchesStatus = statusValue === 'all' || incident.status === statusValue;
            
            return matchesSearch && matchesType && matchesStatus;
        });
        
        currentPage = 1;
        displayRecentIncidents(filtered);
    }
    
    // Thêm sự kiện
    searchInput.addEventListener('input', filterIncidents);
    typeFilter.addEventListener('change', filterIncidents);
    statusFilter.addEventListener('change', filterIncidents);
    sortSelect.addEventListener('change', () => {
        displayRecentIncidents();
    });
    
    resetButton.addEventListener('click', () => {
        searchInput.value = '';
        typeFilter.value = 'all';
        statusFilter.value = 'all';
        currentPage = 1;
        displayRecentIncidents();
    });
}

// Hàm định dạng thời gian
function formatTimeAgo(date) {
    const now = new Date();
    const diffMs = now - new Date(date);
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffMins < 1) return 'Vừa xong';
    if (diffMins < 60) return `${diffMins} phút trước`;
    if (diffHours < 24) return `${diffHours} giờ trước`;
    if (diffDays < 7) return `${diffDays} ngày trước`;
    
    return formatDate(date);
}

// Hàm định dạng ngày tháng
function formatDate(date) {
    return new Date(date).toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

// Hàm hiển thị modal chi tiết sự cố
function showIncidentDetail(incident) {
    // Điền thông tin vào modal
    document.getElementById('modal-id').textContent = incident.id;
    document.getElementById('modal-type').textContent = getIncidentTypeText(incident.type);
    document.getElementById('modal-status').textContent = incident.status === 'active' ? 'Đang xử lý' : 'Đã giải quyết';
    document.getElementById('modal-priority').textContent = `Cấp ${incident.priority}`;
    document.getElementById('modal-time').textContent = formatDate(incident.time);
    document.getElementById('modal-address').textContent = incident.address;
    document.getElementById('modal-province').textContent = incident.province;
    document.getElementById('modal-coords').textContent = `${incident.coordinates.lat.toFixed(4)}, ${incident.coordinates.lng.toFixed(4)}`;
    document.getElementById('modal-description').textContent = incident.description;
    document.getElementById('modal-reporter-name').textContent = incident.reporter.name;
    document.getElementById('modal-reporter-phone').textContent = incident.reporter.phone;
    document.getElementById('modal-report-time').textContent = formatDate(incident.time);
    
    // Cập nhật lớp CSS cho status và priority
    const statusBadge = document.getElementById('modal-status');
    statusBadge.className = 'status-badge status-' + incident.status;
    
    const priorityBadge = document.getElementById('modal-priority');
    priorityBadge.className = 'status-badge priority-' + incident.priority;
    
    // Hiển thị modal
    const modal = document.getElementById('emergency-detail-modal');
    modal.classList.remove('hidden');
    
    // Thêm sự kiện đóng modal
    const closeButtons = [
        document.getElementById('close-modal'),
        document.getElementById('modal-close-btn')
    ];
    
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            modal.classList.add('hidden');
        });
    });
    
    // Cập nhật biểu tượng feather
    feather.replace();
}

// Hàm lấy văn bản loại sự cố
function getIncidentTypeText(type) {
    switch (type) {
        case 'fire': return 'Hỏa hoạn';
        case 'flood': return 'Ngập lụt';
        case 'accident': return 'Tai nạn giao thông';
        case 'disaster': return 'Thiên tai';
        default: return 'Khác';
    }
}

// Khởi tạo khi trang được tải
document.addEventListener('DOMContentLoaded', function() {
    initRecentIncidents();
});

// Hàm để cập nhật sự cố từ bản đồ (có thể gọi từ file map.js)
function updateRecentIncidentsFromMap(incidents) {
    allIncidents = [...incidents];
    currentPage = 1;
    displayRecentIncidents();
    updateRecentStats();
}