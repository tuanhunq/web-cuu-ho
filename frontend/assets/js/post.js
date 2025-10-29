
// Multi-step form logic
let currentStep = 1;
const progressBar = document.getElementById('progress-bar');
const totalSteps = 3;

// Initialize the form
document.addEventListener('DOMContentLoaded', function() {
    updateProgress();
    feather.replace();
    loadComponents();
    setupEventListeners();
});

function updateProgress() {
    if (progressBar) {
        const width = (currentStep / totalSteps) * 100;
        progressBar.style.width = `${width}%`;
    }
}

function showStep(step) {
    document.querySelectorAll('.step').forEach(s => s.classList.remove('active'));
    const stepElement = document.getElementById(`step-${step}`);
    if (stepElement) {
        stepElement.classList.add('active');
        currentStep = step;
        updateProgress();
        
        // Scroll to top of form when changing steps
        stepElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

function nextStep(step) {
    if (validateStep(currentStep)) {
        showStep(step);
    }
}

function prevStep(step) {
    showStep(step);
}

function validateStep(step) {
    const stepElement = document.getElementById(`step-${step}`);
    if (!stepElement) return false;
    
    const inputs = stepElement.querySelectorAll('input[required], select[required], textarea[required]');
    let valid = true;
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            input.classList.add('input-error');
            valid = false;
        } else {
            input.classList.remove('input-error');
        }
        
        // Special validation for phone number
        if (input.id === 'emergency-phone' && input.value.trim()) {
            const phoneRegex = /^(0[3|5|7|8|9])+([0-9]{8})$/;
            if (!phoneRegex.test(input.value.trim())) {
                input.classList.add('input-error');
                valid = false;
                showError('Số điện thoại không hợp lệ. Vui lòng nhập số điện thoại Việt Nam (10 số, bắt đầu bằng 0).');
            }
        }
    });
    
    if (!valid) {
        showError('Vui lòng điền đầy đủ thông tin bắt buộc (*).');
    }
    
    return valid;
}

// Media preview functionality
function setupMediaPreview() {
    const mediaInput = document.getElementById('emergency-media');
    const preview = document.getElementById('media-preview');
    
    if (mediaInput && preview) {
        mediaInput.addEventListener('change', function(e) {
            preview.innerHTML = '';
            const files = Array.from(e.target.files).slice(0, 3);
            
            files.forEach((file, index) => {
                const div = document.createElement('div');
                div.className = 'media-preview-item relative';
                
                if (file.type.startsWith('image/')) {
                    const img = document.createElement('img');
                    img.src = URL.createObjectURL(file);
                    img.className = 'w-full h-24 object-cover rounded-lg';
                    img.alt = 'Preview image';
                    div.appendChild(img);
                } else if (file.type.startsWith('video/')) {
                    const video = document.createElement('video');
                    video.src = URL.createObjectURL(file);
                    video.className = 'w-full h-24 object-cover rounded-lg';
                    video.controls = true;
                    div.appendChild(video);
                }
                
                // Remove button
                const removeBtn = document.createElement('button');
                removeBtn.type = 'button';
                removeBtn.className = 'remove-btn';
                removeBtn.innerHTML = feather.icons.x.toSvg();
                removeBtn.onclick = function() {
                    div.remove();
                    // Remove file from input
                    const dt = new DataTransfer();
                    const filesArray = Array.from(mediaInput.files);
                    filesArray.splice(index, 1);
                    filesArray.forEach(file => dt.items.add(file));
                    mediaInput.files = dt.files;
                };
                div.appendChild(removeBtn);
                
                preview.appendChild(div);
            });
            
            feather.replace();
        });
        
        // Drag and drop functionality
        const uploadArea = mediaInput.closest('label');
        if (uploadArea) {
            ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
                uploadArea.addEventListener(eventName, preventDefaults, false);
            });
            
            function preventDefaults(e) {
                e.preventDefault();
                e.stopPropagation();
            }
            
            ['dragenter', 'dragover'].forEach(eventName => {
                uploadArea.addEventListener(eventName, highlight, false);
            });
            
            ['dragleave', 'drop'].forEach(eventName => {
                uploadArea.addEventListener(eventName, unhighlight, false);
            });
            
            function highlight() {
                uploadArea.classList.add('dragover');
            }
            
            function unhighlight() {
                uploadArea.classList.remove('dragover');
            }
            
            uploadArea.addEventListener('drop', handleDrop, false);
            
            function handleDrop(e) {
                const dt = e.dataTransfer;
                const files = dt.files;
                mediaInput.files = files;
                mediaInput.dispatchEvent(new Event('change'));
            }
        }
    }
}

// Real-time validation
function setupRealTimeValidation() {
    document.querySelectorAll('input[required], select[required], textarea[required]').forEach(input => {
        input.addEventListener('input', function() {
            if (this.value.trim()) {
                this.classList.remove('input-error');
            }
        });
        
        input.addEventListener('blur', function() {
            if (this.value.trim()) {
                this.classList.remove('input-error');
            }
        });
    });
    
    // Phone number validation
    const phoneInput = document.getElementById('emergency-phone');
    if (phoneInput) {
        phoneInput.addEventListener('blur', function() {
            const phone = this.value.trim();
            const phoneRegex = /^(0[3|5|7|8|9])+([0-9]{8})$/;
            
            if (phone && !phoneRegex.test(phone)) {
                this.classList.add('input-error');
                showError('Số điện thoại không hợp lệ. Vui lòng nhập số điện thoại Việt Nam (10 số, bắt đầu bằng 0).');
            } else {
                this.classList.remove('input-error');
            }
        });
    }
}

// Form submission
function setupFormSubmission() {
    const form = document.getElementById('emergency-report-form');
    if (!form) return;
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        if (!validateStep(currentStep)) return;
        
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i data-feather="loader" class="animate-spin mr-2 w-4 h-4"></i> Đang gửi...';
        submitBtn.disabled = true;
        
        try {
            // Create report data
            const reportData = await createReportData();
            
            // Save to news page
            const saveSuccess = saveReportToNewsPage(reportData);
            
            if (saveSuccess) {
                showSuccess('✅ Báo cáo đã được gửi thành công! Chuyển đến trang bản tin...');
                setTimeout(() => {
                    window.location.href = 'news.html';
                }, 2000);
            } else {
                throw new Error('Lỗi lưu báo cáo');
            }
        } catch (error) {
            console.error('Lỗi gửi báo cáo:', error);
            showError('❌ Có lỗi xảy ra khi gửi báo cáo. Vui lòng thử lại.');
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            feather.replace();
        }
    });
}

// Create report data
async function createReportData() {
    const emergencyType = document.getElementById('emergency-type').value;
    const locationText = document.getElementById('emergency-location').value;
    
    return {
        id: 'user_report_' + Date.now(),
        title: `[BÁO CÁO] ${getEmergencyTypeText(emergencyType)} tại ${locationText}`,
        date: new Date().toISOString().split('T')[0],
        type: mapEmergencyTypeToNewsType(emergencyType),
        location: generateLocationCode(locationText),
        location_full: locationText,
        img: 'https://images.unsplash.com/photo-1614732414444-096e5f1122d5?w=600&h=400&fit=crop',
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

// Save report to news page
function saveReportToNewsPage(reportData) {
    try {
        // Get existing reports from localStorage
        const existingReports = JSON.parse(localStorage.getItem('user_emergency_reports') || '[]');
        
        // Add new report to the beginning of the list
        existingReports.unshift({
            ...reportData,
            status: 'pending',
            isVerified: false,
            createdAt: new Date().toISOString(),
            reportId: 'user_' + Date.now()
        });
        
        // Limit to 100 reports to avoid performance issues
        if (existingReports.length > 100) {
            existingReports.splice(100);
        }
        
        // Save to localStorage with fixed key
        localStorage.setItem('user_emergency_reports', JSON.stringify(existingReports));
        
        console.log('✅ Báo cáo đã lưu vào trang bản tin:', reportData.id);
        return true;
        
    } catch (error) {
        console.error('❌ Lỗi khi lưu báo cáo:', error);
        return false;
    }
}

// Utility functions
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
        'other': 'canh-bao'
    };
    return typeMap[emergencyType] || 'canh-bao';
}

function generateLocationCode(locationText) {
    return locationText.split(',')[0]
        .trim()
        .toLowerCase()
        .replace(/\s+/g, '-')
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

// Notification functions
function showError(message) {
    showNotification(message, 'error');
}

function showSuccess(message) {
    showNotification(message, 'success');
}

function showNotification(message, type = 'info') {
    // Remove existing notification
    const existingNotification = document.querySelector('.custom-notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    const notification = document.createElement('div');
    notification.className = `custom-notification fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transform transition-transform duration-300 ${
        type === 'success' ? 'bg-green-500 text-white' :
        type === 'error' ? 'bg-red-500 text-white' :
        'bg-blue-500 text-white'
    }`;
    
    notification.innerHTML = `
        <div class="flex items-center justify-between">
            <span>${message}</span>
            <button class="ml-4 text-white hover:text-gray-200 close-notification">
                ${feather.icons.x.toSvg()}
            </button>
        </div>
    `;
    
    document.body.appendChild(notification);
    feather.replace();

    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => notification.remove(), 300);
    }, 5000);

    // Close button event
    notification.querySelector('.close-notification').addEventListener('click', () => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => notification.remove(), 300);
    });
}

// Load components
function loadComponents() {
    Promise.all([
        fetch('components/navbar.html')
            .then(res => {
                if (!res.ok) throw new Error('Không thể tải navbar.html');
                return res.text();
            }),
        fetch('components/footer.html')
            .then(res => {
                if (!res.ok) throw new Error('Không thể tải footer.html');
                return res.text();
            })
    ])
    .then(([navbar, footer]) => {
        document.getElementById('navbar-container').innerHTML = navbar;
        document.getElementById('footer-container').innerHTML = footer;
        feather.replace();
    })
    .catch(err => {
        console.error('❌ Lỗi tải component:', err);
        document.getElementById('navbar-container').innerHTML =
            `<div class="bg-red-100 text-red-600 p-4 text-center">
                ⚠️ Không thể tải thanh điều hướng (navbar). Hãy chạy bằng localhost.
            </div>`;
    });
}

// Setup all event listeners
function setupEventListeners() {
    setupMediaPreview();
    setupRealTimeValidation();
    setupFormSubmission();
}

// Make functions globally available for onclick handlers
window.nextStep = nextStep;
window.prevStep = prevStep;