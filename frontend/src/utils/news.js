    // Bản Tin Sự Cố - Main JavaScript - request.js
    class EmergencyNewsSystem {
        constructor() {
            this.currentPage = 1;
            this.itemsPerPage = 10;
            this.filteredData = [];
            this.searchTerm = '';
            this.typeFilter = 'all';
            this.statusFilter = 'all';
            this.priorityFilter = 'all';
            this.init();
        }

        init() {
            this.initializeComponents();
            this.setupEventListeners();
            this.renderEmergencyList();
            this.updateSummaryStats();
        }

        initializeComponents() {
            // Khởi tạo Feather Icons
            if (typeof feather !== 'undefined') {
                feather.replace();
            }
        }

        setupEventListeners() {
            // Sự kiện tìm kiếm
            const searchInput = document.getElementById('search-incidents');
            if (searchInput) {
                searchInput.addEventListener('input', (e) => {
                    this.searchTerm = e.target.value.toLowerCase();
                    this.applyFilters();
                });
            }

            // Sự kiện bộ lọc
            const typeFilter = document.getElementById('type-filter');
            const statusFilter = document.getElementById('status-filter');
            const priorityFilter = document.getElementById('priority-filter');

            if (typeFilter) {
                typeFilter.addEventListener('change', (e) => {
                    this.typeFilter = e.target.value;
                    this.applyFilters();
                });
            }

            if (statusFilter) {
                statusFilter.addEventListener('change', (e) => {
                    this.statusFilter = e.target.value;
                    this.applyFilters();
                });
            }

            if (priorityFilter) {
                priorityFilter.addEventListener('change', (e) => {
                    this.priorityFilter = e.target.value;
                    this.applyFilters();
                });
            }

            // Sự kiện reset bộ lọc
            const resetButton = document.getElementById('reset-filters');
            if (resetButton) {
                resetButton.addEventListener('click', () => {
                    this.resetAllFilters();
                });
            }

            // Sự kiện menu mobile
            const menuToggle = document.getElementById('menu-toggle');
            if (menuToggle) {
                menuToggle.addEventListener('click', () => {
                    const mobileMenu = document.getElementById('mobile-menu');
                    if (mobileMenu) {
                        mobileMenu.classList.toggle('hidden');
                    }
                });
            }
        }

        applyFilters() {
            this.filteredData = window.emergencyData.filter(item => {
                const matchesSearch = 
                    item.name.toLowerCase().includes(this.searchTerm) ||
                    item.location.toLowerCase().includes(this.searchTerm) ||
                    item.id.toLowerCase().includes(this.searchTerm);
                
                const matchesType = this.typeFilter === 'all' || item.category === this.typeFilter;
                const matchesStatus = this.statusFilter === 'all' || item.state === this.statusFilter;
                const matchesPriority = this.priorityFilter === 'all' || item.severity === this.priorityFilter;
                
                return matchesSearch && matchesType && matchesStatus && matchesPriority;
            });

            this.currentPage = 1;
            this.renderEmergencyList();
            this.renderPageNavigation();
        }

        resetAllFilters() {
            this.searchTerm = '';
            this.typeFilter = 'all';
            this.statusFilter = 'all';
            this.priorityFilter = 'all';

            const searchInput = document.getElementById('search-incidents');
            const typeFilter = document.getElementById('type-filter');
            const statusFilter = document.getElementById('status-filter');
            const priorityFilter = document.getElementById('priority-filter');

            if (searchInput) searchInput.value = '';
            if (typeFilter) typeFilter.value = 'all';
            if (statusFilter) statusFilter.value = 'all';
            if (priorityFilter) priorityFilter.value = 'all';

            this.applyFilters();
        }

        renderEmergencyList() {
            const container = document.getElementById('incidents-list');
            if (!container) return;

            const startIndex = (this.currentPage - 1) * this.itemsPerPage;
            const endIndex = startIndex + this.itemsPerPage;
            const currentItems = this.filteredData.slice(startIndex, endIndex);

            if (currentItems.length === 0) {
                container.innerHTML = this.getEmptyStateHTML();
                return;
            }

            container.innerHTML = currentItems.map(item => this.createEmergencyCard(item)).join('');
            
            // Khởi tạo lại icons
            if (typeof feather !== 'undefined') {
                feather.replace();
            }
        }

        createEmergencyCard(emergency) {
            const categoryInfo = this.getCategoryInfo(emergency.category);
            
            return `
                <div class="emergency-item emergency-item-${emergency.category} bg-white rounded-2xl shadow-lg p-6">
                    <div class="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                        <div class="flex-1">
                            <div class="flex items-start mb-4">
                                <div class="category-symbol ${categoryInfo.class}">
                                    <i data-feather="${categoryInfo.icon}"></i>
                                </div>
                                <div class="flex-1">
                                    <div class="flex flex-wrap items-center gap-2 mb-2">
                                        <h3 class="text-xl font-bold text-gray-900">${emergency.name}</h3>
                                        <span class="condition-tag ${emergency.state === 'active' ? 'condition-active' : 'condition-resolved'}">
                                            ${emergency.state === 'active' ? 'Đang xử lý' : 'Đã giải quyết'}
                                        </span>
                                        <span class="urgency-tag urgency-${emergency.severity}">
                                            ${this.getUrgencyText(emergency.severity)}
                                        </span>
                                    </div>
                                    <div class="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                                        <span class="flex items-center">
                                            <i data-feather="hash" class="w-4 h-4 mr-1"></i>
                                            ${emergency.id}
                                        </span>
                                        <span class="flex items-center">
                                            <i data-feather="map-pin" class="w-4 h-4 mr-1"></i>
                                            ${emergency.location}
                                        </span>
                                        <span class="flex items-center">
                                            <i data-feather="clock" class="w-4 h-4 mr-1"></i>
                                            ${emergency.reportedAt}
                                        </span>
                                    </div>
                                    <p class="text-gray-700 mb-4">${emergency.details}</p>
                                </div>
                            </div>
                        </div>
                        <div class="flex flex-col gap-2 lg:ml-4 lg:mt-0 mt-4">
                            <button onclick="emergencyNews.viewOnMap('${emergency.id}')" 
                                    class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition flex items-center justify-center">
                                <i data-feather="map" class="mr-2 w-4 h-4"></i>
                                Xem trên bản đồ
                            </button>
                            <button onclick="emergencyNews.showDetails('${emergency.id}')" 
                                    class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition flex items-center justify-center">
                                <i data-feather="eye" class="mr-2 w-4 h-4"></i>
                                Xem chi tiết
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }

        getEmptyStateHTML() {
            return `
                <div class="text-center py-12">
                    <i data-feather="alert-circle" class="w-16 h-16 text-gray-400 mx-auto mb-4"></i>
                    <h3 class="text-xl font-semibold text-gray-600">Không tìm thấy sự cố nào</h3>
                    <p class="text-gray-500 mt-2">Hãy thử điều chỉnh bộ lọc hoặc từ khóa tìm kiếm</p>
                </div>
            `;
        }

        renderPageNavigation() {
            const container = document.getElementById('pagination');
            if (!container) return;

            const totalPages = Math.ceil(this.filteredData.length / this.itemsPerPage);
            
            if (totalPages <= 1) {
                container.innerHTML = '';
                return;
            }

            let paginationHTML = '';

            // Nút Previous
            if (this.currentPage > 1) {
                paginationHTML += `
                    <button class="page-button" onclick="emergencyNews.goToPage(${this.currentPage - 1})">
                        <i data-feather="chevron-left" class="w-4 h-4"></i>
                    </button>
                `;
            }

            // Các nút trang
            for (let i = 1; i <= totalPages; i++) {
                const isActive = i === this.currentPage;
                paginationHTML += `
                    <button class="page-button ${isActive ? 'active' : ''}" 
                            onclick="emergencyNews.goToPage(${i})">
                        ${i}
                    </button>
                `;
            }

            // Nút Next
            if (this.currentPage < totalPages) {
                paginationHTML += `
                    <button class="page-button" onclick="emergencyNews.goToPage(${this.currentPage + 1})">
                        <i data-feather="chevron-right" class="w-4 h-4"></i>
                    </button>
                `;
            }

            container.innerHTML = paginationHTML;
            
            // Khởi tạo lại icons
            if (typeof feather !== 'undefined') {
                feather.replace();
            }
        }

        goToPage(pageNumber) {
            this.currentPage = pageNumber;
            this.renderEmergencyList();
            this.renderPageNavigation();
            
            // Scroll to top of list
            const container = document.getElementById('incidents-list');
            if (container) {
                container.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }

        updateSummaryStats() {
            const total = window.emergencyData.length;
            const active = window.emergencyData.filter(item => item.state === 'active').length;
            const resolved = window.emergencyData.filter(item => item.state === 'resolved').length;
            const today = this.getTodayCount();

            this.updateStatElement('total-incidents', total);
            this.updateStatElement('active-incidents', active);
            this.updateStatElement('resolved-incidents', resolved);
            this.updateStatElement('today-incidents', today);
        }

        getTodayCount() {
            const today = new Date().toLocaleDateString('vi-VN');
            return window.emergencyData.filter(item => {
                return item.reportedAt.includes(today.split('/').reverse().join('/'));
            }).length;
        }

        updateStatElement(elementId, value) {
            const element = document.getElementById(elementId);
            if (element) {
                element.textContent = value;
            }
        }

        getCategoryInfo(category) {
            const categories = {
                fire: { icon: 'flame', class: 'category-fire', text: 'Hỏa hoạn' },
                flood: { icon: 'droplet', class: 'category-flood', text: 'Ngập lụt' },
                accident: { icon: 'activity', class: 'category-accident', text: 'Tai nạn' },
                disaster: { icon: 'alert-octagon', class: 'category-disaster', text: 'Thiên tai' }
            };
            return categories[category] || { icon: 'alert-circle', class: 'category-other', text: 'Khác' };
        }

        getUrgencyText(urgency) {
            const levels = {
                high: 'Ưu tiên cao',
                medium: 'Ưu tiên trung bình',
                low: 'Ưu tiên thấp'
            };
            return levels[urgency] || 'Không xác định';
        }

        // Hàm xem trên bản đồ
        viewOnMap(emergencyId) {
            const emergency = window.emergencyData.find(item => item.id === emergencyId);
            if (!emergency) return;

            // Lưu ID vào localStorage để trang map đọc
            localStorage.setItem('selectedEmergency', emergencyId);
            
            // Chuyển hướng đến trang bản đồ
            window.location.href = 'map.html';
        }

        // Hàm hiển thị chi tiết
        showDetails(emergencyId) {
            const emergency = window.emergencyData.find(item => item.id === emergencyId);
            if (!emergency) return;

            this.displayEmergencyModal(emergency);
        }

        displayEmergencyModal(emergency) {
            const categoryInfo = this.getCategoryInfo(emergency.category);
            
            const modalHTML = `
                <div class="fixed inset-0 z-50 overflow-y-auto emergency-modal-overlay">
                    <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div class="fixed inset-0 transition-opacity" aria-hidden="true">
                            <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
                        </div>
                        
                        <div class="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full emergency-info-modal">
                            <div class="bg-white px-6 pt-6 pb-4">
                                <div class="flex items-center justify-between mb-4">
                                    <h3 class="text-2xl font-bold text-gray-900">${emergency.name}</h3>
                                    <button onclick="emergencyNews.closeModal()" class="text-gray-400 hover:text-gray-600 transition">
                                        <i data-feather="x" class="w-6 h-6"></i>
                                    </button>
                                </div>
                                
                                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    <div class="space-y-4">
                                        <div class="bg-gray-50 rounded-xl p-4">
                                            <h4 class="font-semibold text-lg mb-3 text-gray-800 flex items-center">
                                                <i data-feather="info" class="text-blue-500 mr-2 w-5 h-5"></i>
                                                Thông Tin Cơ Bản
                                            </h4>
                                            <div class="space-y-3">
                                                <div class="flex justify-between items-center">
                                                    <span class="text-gray-600">Mã sự cố:</span>
                                                    <span class="font-semibold">${emergency.id}</span>
                                                </div>
                                                <div class="flex justify-between items-center">
                                                    <span class="text-gray-600">Loại sự cố:</span>
                                                    <span class="font-semibold">${categoryInfo.text}</span>
                                                </div>
                                                <div class="flex justify-between items-center">
                                                    <span class="text-gray-600">Trạng thái:</span>
                                                    <span class="condition-tag ${emergency.state === 'active' ? 'condition-active' : 'condition-resolved'}">
                                                        ${emergency.state === 'active' ? 'Đang xử lý' : 'Đã giải quyết'}
                                                    </span>
                                                </div>
                                                <div class="flex justify-between items-center">
                                                    <span class="text-gray-600">Mức độ ưu tiên:</span>
                                                    <span class="urgency-tag urgency-${emergency.severity}">
                                                        ${this.getUrgencyText(emergency.severity)}
                                                    </span>
                                                </div>
                                                <div class="flex justify-between items-center">
                                                    <span class="text-gray-600">Thời gian báo cáo:</span>
                                                    <span class="font-semibold">${emergency.reportedAt}</span>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div class="bg-gray-50 rounded-xl p-4">
                                            <h4 class="font-semibold text-lg mb-3 text-gray-800 flex items-center">
                                                <i data-feather="map-pin" class="text-green-500 mr-2 w-5 h-5"></i>
                                                Thông Tin Địa Điểm
                                            </h4>
                                            <div class="space-y-3">
                                                <div>
                                                    <span class="text-gray-600 block mb-1">Địa chỉ:</span>
                                                    <span class="font-semibold">${emergency.location}</span>
                                                </div>
                                                <div>
                                                    <span class="text-gray-600 block mb-1">Tỉnh/Thành phố:</span>
                                                    <span class="font-semibold">${this.getRegionText(emergency.region)}</span>
                                                </div>
                                                <div>
                                                    <span class="text-gray-600 block mb-1">Tọa độ:</span>
                                                    <span class="font-semibold">${emergency.coordinates[0].toFixed(4)}, ${emergency.coordinates[1].toFixed(4)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div class="space-y-4">
                                        <div class="bg-gray-50 rounded-xl p-4">
                                            <h4 class="font-semibold text-lg mb-3 text-gray-800 flex items-center">
                                                <i data-feather="file-text" class="text-purple-500 mr-2 w-5 h-5"></i>
                                                Mô Tả Sự Cố
                                            </h4>
                                            <p class="text-gray-700">${emergency.details}</p>
                                        </div>
                                        
                                        <div class="bg-gray-50 rounded-xl p-4">
                                            <h4 class="font-semibold text-lg mb-3 text-gray-800 flex items-center">
                                                <i data-feather="user" class="text-orange-500 mr-2 w-5 h-5"></i>
                                                Thông Tin Người Báo Cáo
                                            </h4>
                                            <div class="space-y-3">
                                                <div class="flex justify-between items-center">
                                                    <span class="text-gray-600">Họ tên:</span>
                                                    <span class="font-semibold">${emergency.reporterInfo.fullname}</span>
                                                </div>
                                                <div class="flex justify-between items-center">
                                                    <span class="text-gray-600">Số điện thoại:</span>
                                                    <span class="font-semibold">${emergency.reporterInfo.mobile}</span>
                                                </div>
                                                <div class="flex justify-between items-center">
                                                    <span class="text-gray-600">Thời gian báo cáo:</span>
                                                    <span class="font-semibold">${emergency.reporterInfo.reportTime}</span>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div class="bg-gray-50 rounded-xl p-4">
                                            <h4 class="font-semibold text-lg mb-3 text-gray-800 flex items-center">
                                                <i data-feather="users" class="text-red-500 mr-2 w-5 h-5"></i>
                                                Lực Lượng Ứng Phó
                                            </h4>
                                            <div class="space-y-2">
                                                ${emergency.responseUnits.map(unit => `
                                                    <div class="flex justify-between items-center py-1">
                                                        <span class="text-gray-700">${unit.unitName}</span>
                                                        <span class="text-sm ${unit.unitStatus.includes('Đang') ? 'text-orange-500' : 'text-green-500'}">
                                                            ${unit.unitStatus}
                                                        </span>
                                                    </div>
                                                `).join('')}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="mt-6 bg-gray-50 rounded-xl p-4">
                                    <h4 class="font-semibold text-lg mb-3 text-gray-800 flex items-center">
                                        <i data-feather="clock" class="text-indigo-500 mr-2 w-5 h-5"></i>
                                        Tiến Trình Xử Lý
                                    </h4>
                                    <div class="space-y-3">
                                        ${emergency.progress.map(item => `
                                            <div class="flex items-center">
                                                <div class="w-3 h-3 bg-indigo-500 rounded-full mr-3"></div>
                                                <div class="flex-1">
                                                    <span class="font-semibold text-gray-800">${item.timestamp}</span>
                                                    <span class="text-gray-600 ml-2">${item.event}</span>
                                                </div>
                                            </div>
                                        `).join('')}
                                    </div>
                                </div>
                                
                                <div class="mt-6 flex flex-wrap gap-3 justify-end">
                                    <button onclick="emergencyNews.closeModal()" 
                                            class="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition">
                                        Đóng
                                    </button>
                                    <button onclick="emergencyNews.viewOnMap('${emergency.id}')" 
                                            class="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition flex items-center">
                                        <i data-feather="map" class="mr-2 w-4 h-4"></i>
                                        Xem trên bản đồ
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            document.body.insertAdjacentHTML('beforeend', modalHTML);
            
            // Khởi tạo lại icons
            if (typeof feather !== 'undefined') {
                feather.replace();
            }
        }

        closeModal() {
            const modal = document.querySelector('.emergency-modal-overlay');
            if (modal) {
                modal.remove();
            }
        }

        getRegionText(region) {
            const regions = {
                'hanoi': 'Hà Nội',
                'hochiminh': 'TP. Hồ Chí Minh',
                'danang': 'Đà Nẵng',
                'hue': 'Thừa Thiên Huế',
                'nghean': 'Nghệ An',
                'thanhhoa': 'Thanh Hóa',
                'haiphong': 'Hải Phòng',
                'cantho': 'Cần Thơ',
                'bacninh': 'Bắc Ninh',
                'haiduong': 'Hải Dương',
                'quangninh': 'Quảng Ninh',
                'binhdinh': 'Bình Định',
                'khanhhoa': 'Khánh Hòa',
                'lamdong': 'Lâm Đồng',
                'dongnai': 'Đồng Nai',
                'bariavungtau': 'Bà Rịa - Vũng Tàu',
                'tiengiang': 'Tiền Giang',
                'bentre': 'Bến Tre',
                'soctrang': 'Sóc Trăng',
                'camau': 'Cà Mau',
                'quangnam': 'Quảng Nam',
                'ninhthuan': 'Ninh Thuận',
                'namdinh': 'Nam Định',
                'longan': 'Long An',
                'laocai': 'Lào Cai',
                'thainguyen': 'Thái Nguyên'
            };
            return regions[region] || region;
        }
    }

    // Khởi tạo hệ thống khi DOM ready
    document.addEventListener('DOMContentLoaded', function() {
        // Kiểm tra xem dữ liệu đã được tải chưa
        if (typeof window.emergencyData !== 'undefined') {
            window.emergencyNews = new EmergencyNewsSystem();
            window.emergencyNews.filteredData = [...window.emergencyData];
        } else {
            console.error('Emergency data not found. Please ensure emergency-data.js is loaded.');
        }
    });