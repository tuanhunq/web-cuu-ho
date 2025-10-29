// === LOGIC CỐ ĐỊNH CHO FORM ĐA BƯỚC ===
let currentStep = 1;
const totalSteps = 3;

function updateProgress() {
    const progressBar = document.getElementById('progress-bar');
    if (progressBar) progressBar.style.width = `${(currentStep / totalSteps) * 100}%`;
}

function showStep(step) {
    document.querySelectorAll('.step').forEach(s => s.classList.remove('active'));
    const stepElement = document.getElementById(`step-${step}`);
    if (stepElement) {
        stepElement.classList.add('active');
        currentStep = step;
        updateProgress();
        stepElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

function nextStep(step) {
    if (validateStep(currentStep)) showStep(step);
}

function prevStep(step) {
    showStep(step);
}

function validateStep(step) {
    const stepElement = document.getElementById(`step-${step}`);
    if (!stepElement) return true;

    const inputs = stepElement.querySelectorAll('input[required], select[required], textarea[required]');
    let valid = true;
    let firstInvalid = null;

    inputs.forEach(input => {
        const isEmpty = !input.value.trim();
        const isInvalidPhone = input.type === 'tel' && !validatePhone(input.value.trim());

        if (isEmpty || isInvalidPhone) {
            input.classList.add('border-red-500', 'input-error');
            valid = false;
            if (!firstInvalid) firstInvalid = input;
        } else {
            input.classList.remove('border-red-500', 'input-error');
        }
    });

    if (!valid && firstInvalid) {
        showError('Vui lòng điền đầy đủ và đúng thông tin bắt buộc (*).');
        firstInvalid.focus();
    }
    return valid;
}

function validatePhone(phone) {
    return /^(0[3|5|7|8|9])[0-9]{8}$/.test(phone);
}

// === MEDIA PREVIEW ===
function setupMediaPreview() {
    const mediaInput = document.getElementById('emergency-media');
    const preview = document.getElementById('media-preview');
    if (!mediaInput || !preview) return;

    mediaInput.addEventListener('change', e => {
        preview.innerHTML = '';
        const files = Array.from(e.target.files).slice(0, 3);
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
        input.addEventListener('input', () => input.classList.remove('border-red-500', 'input-error'));
    });

    const phoneInput = document.getElementById('emergency-phone');
    if (phoneInput) {
        phoneInput.addEventListener('blur', function() {
            if (this.value && !validatePhone(this.value)) {
                this.classList.add('border-red-500', 'input-error');
                showError('Số điện thoại không hợp lệ. Vui lòng nhập số 10 chữ số bắt đầu bằng 0.');
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

        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<span class="animate-spin mr-2">⟳</span> Đang gửi...';
        submitBtn.disabled = true;

        try {
            const reportData = await createReportData();
            const success = saveReportToNewsPage(reportData);

            if (success) {
                showSuccess('✅ Báo cáo đã được gửi thành công!');
                setTimeout(() => (window.location.href = 'request.html'), 2000);
            } else throw new Error();
        } catch (err) {
            console.error(err);
            showError('❌ Có lỗi xảy ra khi gửi báo cáo. Vui lòng thử lại.');
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });
}

// === HELPER FUNCTIONS ===
function getEmergencyTypeText(type) {
    return {
        fire: 'Hỏa hoạn',
        flood: 'Ngập lụt',
        traffic: 'Tai nạn giao thông',
        medical: 'Cấp cứu y tế',
        disaster: 'Thiên tai',
        other: 'Sự cố khác'
    }[type] || 'Sự cố khẩn cấp';
}

function getSeverityText(severity) {
    return {
        low: 'Thấp',
        medium: 'Trung bình',
        high: 'Cao',
        critical: 'Rất cao (Khẩn cấp)'
    }[severity] || 'Không xác định';
}

function mapEmergencyTypeToNewsType(type) {
    return {
        fire: 'tai-nan',
        flood: 'thien-tai',
        traffic: 'tai-nan',
        medical: 'cuu-ho',
        disaster: 'thien-tai',
        other: 'canh-bao'
    }[type] || 'canh-bao';
}

function generateLocationCode(locationText) {
    return locationText
        ? locationText.split(',')[0].trim().toLowerCase().replace(/\s+/g, '-').normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        : 'toan-quoc';
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
        title: `[BÁO CÁO] ${getEmergencyTypeText(type)} tại ${location}`,
        date: new Date().toISOString().split('T')[0],
        type: mapEmergencyTypeToNewsType(type),
        location: generateLocationCode(location),
        img,
        content: document.getElementById('emergency-description').value,
        severity: document.getElementById('emergency-severity').value,
        peopleInvolved: parseInt(document.getElementById('emergency-people').value) || 0,
        reporter: {
            name: document.getElementById('emergency-name').value,
            phone: document.getElementById('emergency-phone').value,
            email: document.getElementById('emergency-email').value || ''
        },
        timestamp: new Date().toISOString(),
        status: 'pending',
        verified: false,
        source: 'user_report'
    };
}

function saveReportToNewsPage(report) {
    try {
        const reports = JSON.parse(localStorage.getItem('newsData_user_reports') || '[]');
        reports.unshift(report);
        if (reports.length > 100) reports.splice(100);
        localStorage.setItem('newsData_user_reports', JSON.stringify(reports));
        return true;
    } catch (err) {
        console.error(err);
        return false;
    }
}

// === THÔNG BÁO ===
function showError(msg) { showNotification(msg, 'error'); }
function showSuccess(msg) { showNotification(msg, 'success'); }
function showNotification(message, type = 'info') {
    const n = document.createElement('div');
    n.className = `custom-notification fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transition-all duration-300 ${
        type === 'error' ? 'bg-red-500' : type === 'success' ? 'bg-green-500' : 'bg-blue-500'
    } text-white`;
    n.innerHTML = `<div class="flex justify-between"><span>${message}</span><button class="ml-4 text-white">×</button></div>`;
    document.body.appendChild(n);
    setTimeout(() => n.remove(), 5000);
    n.querySelector('button').addEventListener('click', () => n.remove());
}

// === INIT ===
document.addEventListener('DOMContentLoaded', () => {
    showStep(1);
    setupMediaPreview();
    setupRealTimeValidation();
    setupFormSubmission();
    if (document.getElementById('next-step-1')) document.getElementById('next-step-1').onclick = () => nextStep(2);
    if (document.getElementById('prev-step-2')) document.getElementById('prev-step-2').onclick = () => prevStep(1);
    if (document.getElementById('next-step-2')) document.getElementById('next-step-2').onclick = () => nextStep(3);
    if (document.getElementById('prev-step-3')) document.getElementById('prev-step-3').onclick = () => prevStep(2);
});

// Xuất global cho HTML
window.nextStep = nextStep;
window.prevStep = prevStep;
window.showStep = showStep;
