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
    if (!stepElement) return true;

    const inputs = stepElement.querySelectorAll('input[required], select[required], textarea[required]');
    let valid = true;
    let firstInvalid = null;

    inputs.forEach(input => {
        if (!input.value.trim() || (input.type === 'tel' && !validatePhone(input.value.trim()))) {
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
    const phoneRegex = /^(0[3|5|7|8|9])+([0-9]{8})$/;
    return phoneRegex.test(phone);
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
                removeBtn.innerHTML = '×';
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
                this.classList.remove('border-red-500', 'input-error');
            }
        });
        
        input.addEventListener('blur', function() {
            if (this.value.trim()) {
                this.classList.remove('border-red-500', 'input-error');
            }
        });
    });
    
    // Phone number validation
    const phoneInput = document.getElementById('emergency-phone');
    if (phoneInput) {
        phoneInput.addEventListener('blur', function() {
            const phone = this.value.trim();
            
            if (phone && !validatePhone(phone)) {
                this.classList.add('border-red-500', 'input-error');
                showError('Số điện thoại không hợp lệ. Vui lòng nhập số điện thoại Việt Nam (10 số, bắt đầu bằng 0).');
            } else {
                this.classList.remove('border-red-500', 'input-error');
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
        submitBtn.innerHTML = '<span class="animate-spin mr-2">⟳</span> Đang gửi...';
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
        }
    });
}

// === HELPER MAPPING FUNCTIONS ===
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
    if (!locationText) return 'toan-quoc';
    return locationText.split(',')[0]
        .trim()
        .toLowerCase()
        .replace(/\s+/g, '-')
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

// === LOGIC GỬI VÀ LƯU BÁO CÁO ===
async function createReportData() {
    const emergencyType = document.getElementById('emergency-type').value;
    const locationText = document.getElementById('emergency-location').value;
    const reportId = 'user_' + Date.now();
    
    // Get media files
    let imageUrl = 'https://images.unsplash.com/photo-1614732414444-096e5f1122d5?w=600&h=400&fit=crop'; 
    const mediaFiles = document.getElementById('emergency-media').files;
    if (mediaFiles.length > 0) {
        imageUrl = URL.createObjectURL(mediaFiles[0]);
    }
    
    return {
        id: reportId,
        title: `[BÁO CÁO] ${getEmergencyTypeText(emergencyType)} tại ${locationText}`,
        date: new Date().toISOString().split('T')[0],
        type: mapEmergencyTypeToNewsType(emergencyType),
        location: generateLocationCode(locationText),
        location_full: locationText,
        img: imageUrl,
        content: `
            <div class="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                <div class="flex">
                    <div class="text-yellow-400 mr-2">⚠️</div>
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
        peopleInvolved: parseInt(document.getElementById('emergency-people').value) || 0,
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
                ×
            </button>
        </div>
    `;
    
    document.body.appendChild(notification);

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

// Setup all event listeners
function setupEventListeners() {
    setupMediaPreview();
    setupRealTimeValidation();
    setupFormSubmission();
}

// Make functions globally available for onclick handlers
window.nextStep = nextStep;
window.prevStep = prevStep;
window.showStep = showStep;

// === MAIN INITIALIZATION ===
document.addEventListener('DOMContentLoaded', () => {
    // Initialize the first step
    showStep(1);
    
    // Setup all event listeners
    setupEventListeners();
    
    // Setup step navigation buttons
    const nextStep1 = document.getElementById('next-step-1');
    const prevStep2 = document.getElementById('prev-step-2');
    const nextStep2 = document.getElementById('next-step-2');
    const prevStep3 = document.getElementById('prev-step-3');
    
    if (nextStep1) nextStep1.addEventListener('click', () => nextStep(2));
    if (prevStep2) prevStep2.addEventListener('click', () => prevStep(1));
    if (nextStep2) nextStep2.addEventListener('click', () => nextStep(3));
    if (prevStep3) prevStep3.addEventListener('click', () => prevStep(2));
});