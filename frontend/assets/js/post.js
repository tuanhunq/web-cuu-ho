// === LOGIC CỐ ĐỊNH CHO FORM ĐA BƯỚC ===
let currentStep = 1;
const totalSteps = 3;

function updateProgress() {
    const progressBar = document.getElementById('progress-bar');
    if (progressBar) {
        const width = (currentStep / totalSteps) * 100;
        progressBar.style.width = `${width}%`;
    }
}

function showStep(step) {
    document.querySelectorAll('.step').forEach(s => s.classList.remove('active'));
    const targetStep = document.getElementById(`step-${step}`);
    if (targetStep) {
        targetStep.classList.add('active');
        currentStep = step;
        updateProgress();
    }
}

function validateStep(step) {
    const stepElement = document.getElementById(`step-${step}`);
    if (!stepElement) return true;

    const inputs = stepElement.querySelectorAll('input[required], select[required], textarea[required]');
    let valid = true;
    let firstInvalid = null;

    inputs.forEach(input => {
        if (!input.value.trim() || (input.type === 'tel' && input.checkValidity() === false)) {
            input.classList.add('border-red-500');
            valid = false;
            if (!firstInvalid) firstInvalid = input;
        } else {
            input.classList.remove('border-red-500');
        }
    });

    if (!valid && firstInvalid) {
        alert('Vui lòng điền đầy đủ và đúng thông tin bắt buộc (*).');
        firstInvalid.focus();
    }
    return valid;
}

// === HELPER MAPPING FUNCTIONS (Cần cho việc tạo data tin tức) ===
function getEmergencyTypeText(type) {
    const typeMap = {
        'fire': 'Hỏa hoạn',
        'flood': 'Ngập lụt',
        'traffic': 'Tai nạn giao thông',
        'medical': 'Cấp cứu y tế',
        'disaster': 'Thiên tai',
        'other': 'Sự cố khác'
    };
    return typeMap[type] || 'Sự cố khẩn cấp';
}

function getSeverityText(severity) {
    const severityMap = {
        'low': 'Thấp',
        'medium': 'Trung bình',
        'high': 'Cao',
        'critical': 'Rất cao (Khẩn cấp)'
    };
    return severityMap[severity] || 'Không xác định';
}

function mapEmergencyTypeToNewsType(emergencyType) {
    const typeMap = {
        'fire': 'tai-nan',
        'flood': 'thien-tai', 
        'traffic': 'tai-nan',
        'medical': 'cuu-ho',
        'disaster': 'thien-tai',
        'other': 'canh-bao' // Báo cáo từ user ban đầu coi là cảnh báo/cứu hộ
    };
    return typeMap[emergencyType] || 'canh-bao';
}

function generateLocationCode(locationText) {
    if (!locationText) return 'toan-quoc';
    // Lấy phần đầu của địa chỉ (tên tỉnh/thành) và chuyển thành slug
    return locationText.split(',')[0]
        .trim()
        .toLowerCase()
        .replace(/\s+/g, '-')
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

// === LOGIC GỬI VÀ LƯU BÁO CÁO (Tích hợp với trang request.html) ===

/**
 * Hàm tạo cấu trúc dữ liệu báo cáo hoàn chỉnh cho trang tin tức.
 */
async function createReportData() {
    const emergencyType = document.getElementById('emergency-type').value;
    const locationText = document.getElementById('emergency-location').value;
    const reportId = 'user_' + Date.now();
    
    // Giả lập ảnh đại diện (nếu có file upload, sẽ thay bằng URL của file đầu tiên)
    let imageUrl = 'https://images.unsplash.com/photo-1614732414444-096e5f1122d5?w=600&h=400&fit=crop'; 
    const mediaFiles = document.getElementById('emergency-media').files;
    if (mediaFiles.length > 0) {
        // Trong môi trường thực, file sẽ được upload lên server. Ở đây, ta dùng placeholder.
        imageUrl = URL.createObjectURL(mediaFiles[0]); 
    }
    
    return {
        id: reportId,
        title: `[BÁO CÁO] ${getEmergencyTypeText(emergencyType)} tại ${locationText}`,
        date: new Date().toISOString().split('T')[0],
        type: mapEmergencyTypeToNewsType(emergencyType), // Loại tin tức
        location: generateLocationCode(locationText), // Mã địa điểm (slug)
        location_full: locationText,
        img: imageUrl,
        content: `
            <div class="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                <div class="flex">
                    <i data-feather="alert-circle" class="text-yellow-400 mr-2"></i>
                    <div>
                        <p class="text-sm text-yellow-700 font-medium">BÁO CÁO TỪ NGƯỜI DÂN - CHỜ XÁC MINH</p>
                        <p class="text-xs text-yellow-600">Thông tin chưa được kiểm chứng bởi cơ quan chức năng</p>
                    </div>
                </div>
            </div>
            <p><strong>🔸 Tình hình:</strong> ${document.getElementById('emergency-description').value}</p>
            <p><strong>🔸 Loại sự cố:</strong> ${getEmergencyTypeText(emergencyType)}</p>
            <p><strong>🔸 Địa điểm:</strong> ${locationText}</p>
            <p><strong>🔸 Mức độ nghiêm trọng:</strong> ${getSeverityText(document.getElementById('emergency-severity').value)}</p>
            <p><strong>🔸 Số người liên quan:</strong> ${document.getElementById('emergency-people').value}</p>
            <p><strong>🔸 Người báo cáo:</strong> ${document.getElementById('emergency-name').value} - ${document.getElementById('emergency-phone').value}</p>
            <p><strong>🔸 Trạng thái:</strong> <span class="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-sm">Đang chờ xác minh</span></p>
            <div class="mt-4 p-3 bg-gray-50 rounded">
                <p class="text-xs text-gray-600"><strong>Lưu ý:</strong> Thông tin này được gửi bởi người dân và đang chờ xác minh từ lực lượng chức năng.</p>
            </div>
        `,
        timestamp: new Date().toISOString(),
        isUserReport: true,
        status: 'pending',
        severity: document.getElementById('emergency-severity').value,
        peopleInvolved: parseInt(document.getElementById('emergency-people').value),
        reporter: {
            name: document.getElementById('emergency-name').value,
            phone: document.getElementById('emergency-phone').value,
            email: document.getElementById('emergency-email').value || ''
        },
        source: 'user_report',
        verified: false
    };
}

/**
 * Lưu báo cáo mới vào localStorage để trang news.html (hoặc request.html) có thể đọc.
 * @param {object} reportData - Dữ liệu báo cáo đã tạo.
 * @returns {boolean} - Trả về true nếu lưu thành công.
 */
function saveReportToNewsPage(reportData) {
    try {
        // Key này nên khớp với key được đọc bởi request.js
        const existingReports = JSON.parse(localStorage.getItem('newsData_user_reports') || '[]');
        
        // Thêm báo cáo mới vào đầu danh sách
        existingReports.unshift(reportData);
        
        // Giới hạn số lượng (giữ 100 tin mới nhất)
        if (existingReports.length > 100) {
            existingReports.splice(100);
        }
        
        localStorage.setItem('newsData_user_reports', JSON.stringify(existingReports));
        return true;
        
    } catch (error) {
        console.error('❌ Lỗi khi lưu báo cáo vào localStorage:', error);
        return false;
    }
}

// === MAIN EVENT HANDLERS ===
document.addEventListener('DOMContentLoaded', () => {
    // Load Navigation và Footer (giả định)
    const loadComponents = () => {
        // Đây là nơi bạn sẽ Fetch/Import Navbar và Footer HTML vào các container
        document.getElementById('navbar-container').innerHTML = `
            <nav class="bg-white shadow-md sticky top-0 z-50 backdrop-blur-sm bg-opacity-80">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div class="flex justify-between h-20 items-center">
                        <div class="flex items-center space-x-2">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                            <span class="text-2xl font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">CỨU HỘ QUỐC GIA</span>
                        </div>
                        <div class="hidden md:flex items-center space-x-8">
                            <a href="indexx.html#home" class="nav-link text-gray-700 hover:text-red-500 font-medium transition">Trang chủ</a>
                            <a href="map.html" class="nav-link text-gray-700 hover:text-red-500 font-medium transition">Bản đồ cứu hộ</a>
                            <a href="request.html" class="nav-link text-gray-700 hover:text-red-500 font-medium transition">Bản tin</a>
                            <a href="post.html" class="nav-link text-red-500 font-bold transition">Báo tin</a>
                            <div class="flex space-x-4">
                                <a href="admin.html" class="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-lg font-medium transition-all shadow hover:shadow-lg">Admin</a>
                                <a href="login.html" class="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white px-4 py-2 rounded-lg font-medium transition-all shadow hover:shadow-lg">Đăng nhập</a>
                            </div>
                        </div>
                        <div class="md:hidden flex items-center">
                            <button id="menu-toggle" class="text-gray-700 hover:text-red-600" aria-label="Toggle menu">
                                <i data-feather="menu"></i>
                            </button>
                        </div>
                    </div>
                </div>
                <div id="mobile-menu" class="hidden md:hidden bg-white py-2 px-4 shadow-lg">
                    <a href="indexx.html#home" class="block py-2 text-gray-700 hover:text-red-600 transition">Trang chủ</a>
                    <a href="map.html" class="block py-2 text-gray-700 hover:text-red-600 transition">Bản đồ cứu hộ</a>
                    <a href="request.html" class="block py-2 text-gray-700 hover:text-red-600 transition">Bản tin</a>
                    <a href="post.html" class="block py-2 text-red-600 font-bold transition">Báo tin</a>
                    <a href="admin.html" class="block py-2 text-white bg-gray-800 rounded-md text-center">Admin</a>
                    <a href="login.html" class="block py-2 text-white bg-red-600 rounded-md text-center mt-2">Đăng nhập</a>
                </div>
            </nav>
        `;
        document.getElementById('footer-container').innerHTML = `
            <footer class="bg-gray-900 text-white py-16">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div class="grid grid-cols-1 md:grid-cols-4 gap-12">
                        <div>
                            <div class="flex items-center mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-red-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                                <span class="text-2xl font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">CỨU HỘ QUỐC GIA</span>
                            </div>
                            <p class="text-gray-400 leading-relaxed">Kết nối người dân với lực lượng cứu hộ trong các tình huống khẩn cấp.</p>
                        </div>
                        <div>
                            <h4 class="font-bold mb-4">Dịch Vụ</h4>
                            <ul class="space-y-2">
                                <li><a href="index.html#services" class="text-gray-400 hover:text-white transition">Cứu hỏa</a></li>
                                <li><a href="index.html#services" class="text-gray-400 hover:text-white transition">Cứu hộ giao thông</a></li>
                                <li><a href="index.html#services" class="text-gray-400 hover:text-white transition">Y tế khẩn cấp</a></li>
                                <li><a href="index.html#services" class="text-gray-400 hover:text-white transition">Ứng phó thiên tai</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 class="font-bold mb-4">Liên Kết</h4>
                            <ul class="space-y-2">
                                <li><a href="#" class="text-gray-400 hover:text-white transition">Bộ Công An</a></li>
                                <li><a href="#" class="text-gray-400 hover:text-white transition">Bộ Y Tế</a></li>
                                <li><a href="#" class="text-gray-400 hover:text-white transition">Ban Chỉ Đạo PCTT</a></li>
                                <li><a href="#" class="text-gray-400 hover:text-white transition">Cục Cứu Hộ Cứu Nạn</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 class="font-bold mb-4">Hỗ Trợ</h4>
                            <ul class="space-y-2">
                                <li><a href="#" class="text-gray-400 hover:text-white transition">Câu hỏi thường gặp</a></li>
                                <li><a href="#" class="text-gray-400 hover:text-white transition">Hướng dẫn sử dụng</a></li>
                                <li><a href="#" class="text-gray-400 hover:text-white transition">Chính sách bảo mật</a></li>
                                <li><a href="#" class="text-gray-400 hover:text-white transition">Điều khoản dịch vụ</a></li>
                            </ul>
                        </div>
                    </div>
                    <div class="border-t border-gray-700 mt-12 pt-8 text-center text-gray-400">
                        <p>© 2025 Hệ Thống Cứu Hộ Quốc Gia. Bản quyền thuộc về Bộ Công An.</p>
                    </div>
                </div>
            </footer>
        `;
        // Re-initialize feather icons after DOM update
        feather.replace();
    };

    // Gọi hàm load component
    loadComponents(); 

    // Event Listeners cho nút chuyển bước
    document.getElementById('next-step-1').addEventListener('click', () => nextStep(2));
    document.getElementById('prev-step-2').addEventListener('click', () => showStep(1));
    document.getElementById('next-step-2').addEventListener('click', () => nextStep(3));
    document.getElementById('prev-step-3').addEventListener('click', () => showStep(2));

    // Media preview
    document.getElementById('emergency-media').addEventListener('change', function(e) {
        const preview = document.getElementById('media-preview');
        preview.innerHTML = '';
        Array.from(e.target.files).slice(0, 3).forEach(file => {
            const div = document.createElement('div');
            // Logic preview
            if (file.type.startsWith('image/')) {
                const img = document.createElement('img');
                img.src = URL.createObjectURL(file);
                img.className = 'w-full h-24 object-cover rounded';
                div.appendChild(img);
            } else if (file.type.startsWith('video/')) {
                const video = document.createElement('video');
                video.src = URL.createObjectURL(file);
                video.className = 'w-full h-24 object-cover rounded';
                video.controls = true;
                div.appendChild(video);
            }
            preview.appendChild(div);
        });
    });

    // Real-time validation
    document.querySelectorAll('input[required], select[required], textarea[required]').forEach(input => {
        input.addEventListener('input', function() {
            if (this.value.trim() && this.checkValidity()) {
                this.classList.remove('border-red-500');
            }
        });
    });

    // Final Submission Logic
    document.getElementById('emergency-report-form').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        if (!validateStep(currentStep)) return;
        
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i data-feather="loader" class="animate-spin mr-2 w-4 h-4"></i> Đang gửi...';
        submitBtn.disabled = true;
        feather.replace();

        try {
            // 1. Tạo báo cáo
            const reportData = await createReportData();
            
            // 2. LƯU BÁO CÁO VÀO LOCAL STORAGE CHO TRANG BẢN TIN ĐỌC
            const saveSuccess = saveReportToNewsPage(reportData);
            
            if (saveSuccess) {
                alert('✅ Báo cáo đã được gửi thành công và chuyển đến trang Bản tin để chờ xác minh!');
                setTimeout(() => {
                    // Chuyển hướng đến trang bản tin
                    window.location.href = 'request.html'; 
                }, 1500);
            } else {
                throw new Error('Lỗi lưu báo cáo nội bộ.');
            }
        } catch (error) {
            console.error('Lỗi gửi báo cáo:', error);
            alert('❌ Có lỗi xảy ra khi gửi báo cáo. Vui lòng thử lại.');
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            feather.replace();
        }
    });

    // Khởi tạo trạng thái ban đầu
    showStep(1); 
});

// Gán các hàm chuyển bước ra global scope (để HTML có thể gọi)
window.nextStep = (step) => { if (validateStep(currentStep)) showStep(step); };
window.showStep = showStep;