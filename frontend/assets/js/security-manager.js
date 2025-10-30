// Security and Validation Manager
class SecurityManager {
    static validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    static validatePhone(phone) {
        const phoneRegex = /^(0[3|5|7|8|9])+([0-9]{8})$/;
        return phoneRegex.test(phone);
    }

    static validateUsername(username) {
        const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
        return usernameRegex.test(username);
    }

    static validateFullname(fullname) {
        return fullname.length >= 2 && fullname.length <= 50;
    }

    static validatePassword(password) {
        const requirements = {
            length: password.length >= 8,
            lowercase: /[a-z]/.test(password),
            uppercase: /[A-Z]/.test(password),
            number: /[0-9]/.test(password),
            special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
        };

        // Tính điểm strength
        const strength = Object.values(requirements).filter(Boolean).length;
        
        return {
            requirements,
            strength,
            isValid: strength >= 4 // Cần ít nhất 4/5 yêu cầu
        };
    }

    static validateOrganization(organization) {
        return organization ? organization.length <= 100 : true;
    }

    static sanitizeInput(input) {
        if (typeof input !== 'string') return input;
        
        const div = document.createElement('div');
        div.textContent = input;
        return div.innerHTML;
    }

    static generateStrongPassword() {
        const lowercase = 'abcdefghijklmnopqrstuvwxyz';
        const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const numbers = '0123456789';
        const special = '!@#$%^&*()_+-=[]{};:,.<>?';
        
        const allChars = lowercase + uppercase + numbers + special;
        let password = '';
        
        // Đảm bảo ít nhất mỗi loại 1 ký tự
        password += lowercase[Math.floor(Math.random() * lowercase.length)];
        password += uppercase[Math.floor(Math.random() * uppercase.length)];
        password += numbers[Math.floor(Math.random() * numbers.length)];
        password += special[Math.floor(Math.random() * special.length)];
        
        // Thêm các ký tự ngẫu nhiên để đủ 12 ký tự
        for (let i = 0; i < 8; i++) {
            password += allChars[Math.floor(Math.random() * allChars.length)];
        }
        
        // Xáo trộn password
        return password.split('').sort(() => 0.5 - Math.random()).join('');
    }
}