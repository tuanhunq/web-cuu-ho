import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import config from '../config/index.js';

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Email là bắt buộc'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Email không hợp lệ']
    },
    password: {
        type: String,
        required: [true, 'Mật khẩu là bắt buộc'],
        minlength: [6, 'Mật khẩu phải có ít nhất 6 ký tự']
    },
    name: {
        type: String,
        required: [true, 'Tên là bắt buộc'],
        trim: true,
        minlength: [2, 'Tên phải có ít nhất 2 ký tự']
    },
    phone: {
        type: String,
        required: [true, 'Số điện thoại là bắt buộc'],
        match: [/^[0-9]{10}$/, 'Số điện thoại không hợp lệ']
    },
    role: {
        type: String,
        enum: {
            values: ['user', 'admin', 'rescue'],
            message: '{VALUE} không phải là role hợp lệ'
        },
        default: 'user'
    },
    active: {
        type: Boolean,
        default: true
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    lastLogin: Date,
    loginAttempts: {
        type: Number,
        default: 0
    },
    lockUntil: Date
}, {
    timestamps: true
});

// Indexes
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ phone: 1 });
userSchema.index({ role: 1 });

// Hash password before saving
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    
    try {
        const salt = await bcrypt.genSalt(config.password.saltRounds);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (err) {
        next(err);
    }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
    try {
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (err) {
        throw new Error('Lỗi khi so sánh mật khẩu');
    }
};

// Generate JWT token
userSchema.methods.generateAuthToken = function() {
    return jwt.sign(
        { 
            id: this._id,
            email: this.email,
            role: this.role
        },
        config.jwt.secret,
        { expiresIn: config.jwt.expiresIn }
    );
};

// Generate reset password token
userSchema.methods.generateResetPasswordToken = function() {
    const resetToken = crypto.randomBytes(32).toString('hex');

    this.resetPasswordToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

    this.resetPasswordExpire = Date.now() + config.password.resetTokenExpires;

    return resetToken;
};

// Check if user can login (not locked)
userSchema.methods.canLogin = function() {
    return !this.lockUntil || this.lockUntil < Date.now();
};

// Increment login attempts
userSchema.methods.incrementLoginAttempts = async function() {
    // If lock has expired, reset attempts and remove lock
    if (this.lockUntil && this.lockUntil < Date.now()) {
        await this.updateOne({
            $set: {
                loginAttempts: 1,
                lockUntil: null
            }
        });
        return;
    }

    const updates = {
        $inc: { loginAttempts: 1 }
    };

    // Lock account if too many attempts
    if (this.loginAttempts + 1 >= 5) {
        updates.$set = {
            lockUntil: Date.now() + 3600000 // Lock for 1 hour
        };
    }

    await this.updateOne(updates);
};

// Reset login attempts
userSchema.methods.resetLoginAttempts = async function() {
    await this.updateOne({
        loginAttempts: 0,
        lockUntil: null,
        lastLogin: new Date()
    });
};

// Static method to find by email
userSchema.statics.findByEmail = function(email) {
    return this.findOne({ email: email.toLowerCase() });
};

const User = mongoose.model('User', userSchema);
export default User;
