// === CONFIGURATION ===
const CONFIG = {
    totalSteps: 2,
    maxMediaFiles: 3,
    phoneRegex: /^(0[3|5|7|8|9])[0-9]{8}$/,
    cccdRegex: /^[0-9]{12}$/,
    emergencyTypes: {
        fire: 'Hỏa hoạn',
        flood: 'Ngập lụt', 
        traffic: 'Tai nạn giao thông',
        medical: 'Cấp cứu y tế',
        disaster: 'Thiên tai',
        other: 'Sự cố khác'
    },
    typeMapping: {
        fire: 'tai-nan',
        flood: 'thien-tai',
        traffic: 'tai-nan',
        medical: 'cuu-ho',
        disaster: 'thien-tai',
        other: 'canh-bao'
    }
};

// === STATE MANAGEMENT ===
let currentStep = 1;

// === INITIALIZATION ===
document.addEventListener('DOMContentLoaded', function() {
    // Khởi tạo Feather Icons
    feather.replace();
    
    // Hiển thị bước đầu tiên
    showStep(1);
    
    // Thiết lập event listeners
    setupEventListeners();
    setupMediaPreview();
    setupRealTimeValidation();
    setupFormSubmission();
});

// === PROGRESS MANAGEMENT ===
function updateProgress() {
    const progressBar = document.getElementById('progress-bar');
    if (progressBar) {
        progressBar.style.width = `${(currentStep / CONFIG.totalSteps) * 100}%`;
    }
}

function showStep(step) {
    // Ẩn tất cả các bước
    document.querySelectorAll('.step').forEach(s => {
        s.classList.remove('active');
    });
    
    // Hiển thị bước hiện tại
    const stepElement = document.getElementById(`step-${step}`);
    if (stepElement) {
        stepElement.classList.add('active');
        currentStep = step;
        updateProgress();
        
        // Cuộn mượt đến đầu form
        stepElement.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start',
            inline: 'nearest'
        });
    }
}

// === STEP NAVIGATION ===
function nextStep(targetStep) {
    if (validateStep(currentStep)) {
        // Kiểm tra checkbox cam kết ở bước 1
        if (currentStep === 1) {
            const confirmCheckbox = document.getElementById('confirm-truthful');
            if (!confirmCheckbox.checked) {
                showError('Vui lòng xác nhận cam kết thông tin trung thực trước khi tiếp tục.');
                confirmCheckbox.focus();
                return;
            }
        }
        showStep(targetStep);
    }
}

function prevStep(targetStep) {
    showStep(targetStep);
}

// === VALIDATION ===
function validateStep(step) {
    const stepElement = document.getElementById(`step-${step}`);
    if (!stepElement) return true;

    const requiredFields = stepElement.querySelectorAll(
        'input[required], select[required], textarea[required]'
    );
    
    let isValid = true;
    let firstInvalidField = null;

    requiredFields.forEach(field => {
        const value = field.value.trim();
        let fieldValid = true;

        // Kiểm tra trống
        if (!value) {
            fieldValid = false;
        }
        
        // Kiểm tra số điện thoại
        else if (field.type === 'tel' && field.id === 'emergency-phone') {
            fieldValid = validatePhone(value);
            if (!fieldValid) {
                showFieldError(field, 'Số điện thoại không hợp lệ. Vui lòng nhập số 10 chữ số bắt đầu bằng 0.');
            }
        }
        
        // Kiểm tra CCCD
        else if (field.id === 'cccd') {
            fieldValid = validateCCCD(value);
            if (!fieldValid) {
                showFieldError(field, 'Số CCCD không hợp lệ. Vui lòng nhập đúng 12 chữ số.');
            }
        }

        if (!fieldValid) {
            field.classList.add('border-red-500', 'input-error');
            isValid = false;
            if (!firstInvalidField) firstInvalidField = field;
        } else {
            field.classList.remove('border-red-500', 'input-error');
            clearFieldError(field);
        }
    });

    if (!isValid && firstInvalidField) {
        showError('Vui lòng điền đầy đủ và đúng thông tin bắt buộc (*).');
        firstInvalidField.focus();
    }

    return isValid;
}

function validatePhone(phone) {
    return CONFIG.phoneRegex.test(phone);
}

function validateCCCD(cccd) {
    return CONFIG.cccdRegex.test(cccd);
}

function showFieldError(field, message) {
    // Xóa thông báo lỗi cũ
    clearFieldError(field);
    
    // Thêm thông báo lỗi mới
    const errorElement = document.createElement('p');
    errorElement.className = 'text-red-500 text-xs mt-1';
    errorElement.textContent = message;
    errorElement.id = `${field.id}-error`;
    
    field.parentNode.appendChild(errorElement);
}

function clearFieldError(field) {
    const existingError = document.getElementById(`${field.id}-error`);
    if (existingError) {
        existingError.remove();
    }
}

// === MEDIA PREVIEW ===
function setupMediaPreview() {
    const mediaInput = document.getElementById('emergency-media');
    const preview = document.getElementById('media-preview');
    if (!mediaInput || !preview) return;

    mediaInput.addEventListener('change', e => {
        preview.innerHTML = '';
        const files = Array.from(e.target.files).slice(0, CONFIG.maxMediaFiles);
        
        files.forEach((file, index) => {
            const div = document.createElement('div');
            div.className = 'media-preview-item relative';

            let mediaEl;
            if (file.type.startsWith('image/')) {
                mediaEl = document.createElement('img');
                mediaEl.src = URL.createObjectURL(file);
                mediaEl.className = 'w-full h-24 object-cover rounded-lg';
            } else if (file.type.startsWith('video/')) {
                mediaEl = document.createElement('video');
                mediaEl.src = URL.createObjectURL(file);
                mediaEl.className = 'w-full h-24 object-cover rounded-lg';
                mediaEl.controls = true;
            }
            
            if (mediaEl) div.appendChild(mediaEl);

            const removeBtn = document.createElement('button');
            removeBtn.type = 'button';
            removeBtn.className = 'remove-btn';
            removeBtn.innerHTML = '×';
            removeBtn.onclick = () => {
                div.remove();
                const dt = new DataTransfer();
                const filesArr = Array.from(mediaInput.files);
                filesArr.splice(index, 1);
                filesArr.forEach(f => dt.items.add(f));
                mediaInput.files = dt.files;
            };
            div.appendChild(removeBtn);

            preview.appendChild(div);
        });
    });
}

// === REAL-TIME VALIDATION ===
function setupRealTimeValidation() {
    document.querySelectorAll('input[required], select[required], textarea[required]').forEach(input => {
        input.addEventListener('input', () => {
            input.classList.remove('border-red-500', 'input-error');
            clearFieldError(input);
        });
    });

    const phoneInput = document.getElementById('emergency-phone');
    if (phoneInput) {
        phoneInput.addEventListener('blur', function() {
            if (this.value && !validatePhone(this.value)) {
                this.classList.add('border-red-500', 'input-error');
                showFieldError(this, 'Số điện thoại không hợp lệ. Vui lòng nhập số 10 chữ số bắt đầu bằng 0.');
            }
        });
    }

    const cccdInput = document.getElementById('cccd');
    if (cccdInput) {
        cccdInput.addEventListener('blur', function() {
            if (this.value && !validateCCCD(this.value)) {
                this.classList.add('border-red-500', 'input-error');
                showFieldError(this, 'Số CCCD không hợp lệ. Vui lòng nhập đúng 12 chữ số.');
            }
        });
    }
}

// === FORM SUBMISSION ===
function setupFormSubmission() {
    const form = document.getElementById('emergency-report-form');
    if (!form) return;

    form.addEventListener('submit', async e => {
        e.preventDefault();
        if (!validateStep(currentStep)) return;

        // Kiểm tra checkbox xác nhận cuối cùng
        const confirmEmergency = document.getElementById('confirm-emergency');
        if (!confirmEmergency.checked) {
            showError('Vui lòng xác nhận đây là tình huống khẩn cấp thực sự trước khi gửi báo cáo.');
            confirmEmergency.focus();
            return;
        }

        // Hiển thị cảnh báo cuối cùng trước khi gửi
        const isConfirmed = confirm(
            "CẢNH BÁO PHÁP LÝ CUỐI CÙNG:\n\n" +
            "Bạn sắp gửi báo cáo khẩn cấp. Việc cung cấp thông tin sai sự thật:\n" +
            "• Gây lãng phí nguồn lực cứu hộ\n" +
            "• Có thể bị xử phạt hành chính hoặc truy cứu trách nhiệm hình sự\n" +
            "• Ảnh hưởng đến công tác cứu hộ thực sự\n\n" +
            "Bạn có CHẮC CHẮN đây là tình huống khẩn cấp thực sự và thông tin cung cấp là hoàn toàn chính xác?"
        );

        if (!isConfirmed) {
            return;
        }

        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<span class="animate-spin mr-2">⟳</span> Đang gửi...';
        submitBtn.disabled = true;

        try {
            const reportData = await createReportData();
            const success = saveReportToAdmin(reportData);

            if (success) {
                showPendingModal();
            } else {
                throw new Error('Lỗi lưu dữ liệu');
            }
        } catch (err) {
            console.error(err);
            showError('❌ Có lỗi xảy ra khi gửi báo cáo. Vui lòng thử lại.');
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });
}

// === TẠO DỮ LIỆU BÁO CÁO ===
async function createReportData() {
    const type = document.getElementById('emergency-type').value;
    const location = document.getElementById('emergency-location').value;
    const mediaFiles = document.getElementById('emergency-media').files;
    const img = mediaFiles.length > 0
        ? URL.createObjectURL(mediaFiles[0])
        : 'https://images.unsplash.com/photo-1614732414444-096e5f1122d5?w=600&h=400&fit=crop';

    return {
        id: 'user_' + Date.now(),
        title: `[BÁO CÁO] ${CONFIG.emergencyTypes[type] || 'Sự cố khẩn cấp'} tại ${location}`,
        date: new Date().toISOString().split('T')[0],
        type: CONFIG.typeMapping[type] || 'canh-bao',
        location: generateLocationCode(location),
        img,
        content: document.getElementById('emergency-description').value,
        reporter: {
            name: document.getElementById('emergency-name').value,
            cccd: document.getElementById('cccd').value,
            phone: document.getElementById('emergency-phone').value,
            email: document.getElementById('emergency-email').value || '',
            legalConfirmed: true,
            timestamp: new Date().toISOString()
        },
        timestamp: new Date().toISOString(),
        status: 'pending',
        verified: false,
        source: 'user_report',
        admin_notes: '',
        admin_action: 'pending'
    };
}

function generateLocationCode(locationText) {
    return locationText
        ? locationText.split(',')[0].trim().toLowerCase().replace(/\s+/g, '-').normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        : 'toan-quoc';
}

function saveReportToAdmin(report) {
    try {
        // Lưu vào localStorage cho admin xử lý
        const pendingReports = JSON.parse(localStorage.getItem('admin_pending_reports') || '[]');
        report.admin_id = 'ADMIN_' + Date.now();
        pendingReports.unshift(report);
        
        // Giới hạn số lượng báo cáo lưu trữ
        if (pendingReports.length > 100) pendingReports.splice(100);
        
        localStorage.setItem('admin_pending_reports', JSON.stringify(pendingReports));
        
        // Cũng lưu vào lịch sử báo cáo của user
        const userReports = JSON.parse(localStorage.getItem('user_reports_history') || '[]');
        userReports.unshift({
            ...report,
            user_viewable: true
        });
        if (userReports.length > 50) userReports.splice(50);
        localStorage.setItem('user_reports_history', JSON.stringify(userReports));
        
        return true;
    } catch (err) {
        console.error(err);
        return false;
    }
}

// === LOCATION SERVICES ===
async function getCurrentLocation() {
    if (navigator.geolocation) {
        const locationInput = document.getElementById('emergency-location');
        const locationBtn = document.querySelector('.location-btn');
        const originalText = locationBtn.innerHTML;
        
        // Hiển thị trạng thái loading
        locationBtn.innerHTML = '<div class="location-loading"></div> Đang lấy vị trí...';
        locationBtn.classList.add('loading');
        locationBtn.disabled = true;
        
        const originalPlaceholder = locationInput.placeholder;
        locationInput.placeholder = 'Đang lấy vị trí...';
        
        try {
            const position = await new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject, {
                    timeout: 15000,
                    enableHighAccuracy: true
                });
            });
            
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            
            // Hiển thị tọa độ tạm thời
            locationInput.value = `Đang lấy địa chỉ... (${latitude.toFixed(6)}, ${longitude.toFixed(6)})`;
            
            // Gọi API để lấy địa chỉ
            const address = await getAddressFromCoordinates(latitude, longitude);
            
            if (address) {
                locationInput.value = address;
                showSuccess('✅ Đã lấy địa chỉ thành công!');
            } else {
                locationInput.value = `Vị trí: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
                showSuccess('✅ Đã lấy tọa độ! Vui lòng bổ sung địa chỉ nếu cần.');
            }
            
        } catch (error) {
            console.error("Lỗi khi lấy vị trí:", error);
            handleLocationError(error);
        } finally {
            // Khôi phục trạng thái ban đầu
            locationBtn.innerHTML = originalText;
            locationBtn.classList.remove('loading');
            locationBtn.disabled = false;
            locationInput.placeholder = originalPlaceholder;
        }
    } else {
        showError('❌ Trình duyệt không hỗ trợ định vị. Vui lòng nhập thủ công.');
    }
}

// === GEOCODING SERVICE ===
async function getAddressFromCoordinates(lat, lng) {
    try {
        // Sử dụng OpenStreetMap Nominatim API (miễn phí)
        const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
        );
        
        if (!response.ok) {
            throw new Error('Lỗi kết nối dịch vụ địa chỉ');
        }
        
        const data = await response.json();
        
        if (data && data.address) {
            return formatAddress(data);
        }
        
        return null;
    } catch (error) {
        console.error('Lỗi khi lấy địa chỉ:', error);
        return null;
    }
}

// === FORMAT ADDRESS ===
function formatAddress(data) {
    const address = data.address;
    let formattedAddress = '';
    
    // Xây dựng địa chỉ từ chi tiết đến tổng quát
    if (address.road) {
        formattedAddress += address.road;
    }
    
    if (address.house_number) {
        formattedAddress += ' số ' + address.house_number;
    }
    
    if (address.suburb && !formattedAddress.includes(address.suburb)) {
        formattedAddress += formattedAddress ? ', ' + address.suburb : address.suburb;
    }
    
    if (address.quarter && !formattedAddress.includes(address.quarter)) {
        formattedAddress += formattedAddress ? ', ' + address.quarter : address.quarter;
    }
    
    if (address.neighbourhood && !formattedAddress.includes(address.neighbourhood)) {
        formattedAddress += formattedAddress ? ', ' + address.neighbourhood : address.neighbourhood;
    }
    
    if (address.city_district && !formattedAddress.includes(address.city_district)) {
        formattedAddress += formattedAddress ? ', ' + address.city_district : address.city_district;
    }
    
    if (address.district && !formattedAddress.includes(address.district)) {
        formattedAddress += formattedAddress ? ', ' + address.district : address.district;
    }
    
    if (address.city && !formattedAddress.includes(address.city)) {
        formattedAddress += formattedAddress ? ', ' + address.city : address.city;
    }
    
    if (address.town && !formattedAddress.includes(address.town)) {
        formattedAddress += formattedAddress ? ', ' + address.town : address.town;
    }
    
    if (address.province && !formattedAddress.includes(address.province)) {
        formattedAddress += formattedAddress ? ', ' + address.province : address.province;
    }
    
    if (address.state && !formattedAddress.includes(address.state)) {
        formattedAddress += formattedAddress ? ', ' + address.state : address.state;
    }
    
    if (address.country && !formattedAddress.includes(address.country)) {
        formattedAddress += formattedAddress ? ', ' + address.country : address.country;
    }
    
    return formattedAddress || data.display_name || '';
}

// === HANDLE LOCATION ERRORS ===
function handleLocationError(error) {
    let errorMessage = '❌ Không thể lấy vị trí. Vui lòng nhập thủ công.';
    
    switch(error.code) {
        case error.PERMISSION_DENIED:
            errorMessage = '❌ Quyền truy cập vị trí bị từ chối. Vui lòng cho phép truy cập vị trí.';
            break;
        case error.POSITION_UNAVAILABLE:
            errorMessage = '❌ Thông tin vị trí không khả dụng.';
            break;
        case error.TIMEOUT:
            errorMessage = '❌ Hết thời gian lấy vị trí. Vui lòng thử lại.';
            break;
    }
    
    showError(errorMessage);
}

// === EMERGENCY CALL ===
function makeEmergencyCall() {
    if (confirm("Bạn có chắc chắn muốn gọi số cứu hộ khẩn cấp 114?")) {
        // Trong thực tế: window.location.href = "tel:114";
        alert("Đang kết nối với số cứu hộ khẩn cấp 114...");
    }
}

// === PENDING MODAL ===
function showPendingModal() {
    document.getElementById('pending-modal').style.display = 'flex';
    feather.replace();
}

function closePendingModal() {
    document.getElementById('pending-modal').style.display = 'none';
    // Reset form và quay về bước 1
    document.getElementById('emergency-report-form').reset();
    document.getElementById('media-preview').innerHTML = '';
    showStep(1);
    
    // Chuyển hướng đến trang theo dõi
    setTimeout(() => {
        window.location.href = 'tracking.html';
    }, 2000);
}

function goToAdminPage() {
    // Trong thực tế, đây sẽ là trang admin hoặc trang theo dõi trạng thái
    window.location.href = 'tracking.html';
}

// === NOTIFICATION SYSTEM ===
function showError(msg) { 
    showNotification(msg, 'error'); 
}

function showSuccess(msg) { 
    showNotification(msg, 'success'); 
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `custom-notification ${
        type === 'error' ? 'bg-red-500' : 
        type === 'success' ? 'bg-green-500' : 'bg-blue-500'
    } text-white`;
    
    notification.innerHTML = `
        <div class="flex justify-between items-center">
            <span>${message}</span>
            <button class="ml-4 text-white hover:text-gray-200">×</button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Tự động xóa sau 5 giây
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 5000);
    
    // Xóa khi click
    notification.querySelector('button').addEventListener('click', () => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    });
}

// === EVENT LISTENERS SETUP ===
function setupEventListeners() {
    // Navigation buttons
    document.getElementById('next-step-1').addEventListener('click', () => nextStep(2));
    document.getElementById('prev-step-2').addEventListener('click', () => prevStep(1));
    
    // Mobile menu
    document.getElementById('menu-toggle').addEventListener('click', function() {
        const mobileMenu = document.getElementById('mobile-menu');
        mobileMenu.classList.toggle('hidden');
    });
}

// Xuất global functions cho HTML
window.nextStep = nextStep;
window.prevStep = prevStep;
window.showStep = showStep;
window.getCurrentLocation = getCurrentLocation;
window.makeEmergencyCall = makeEmergencyCall;
window.closePendingModal = closePendingModal;
window.goToAdminPage = goToAdminPage;