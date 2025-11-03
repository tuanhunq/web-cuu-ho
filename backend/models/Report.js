import mongoose from "mongoose";

const reportSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    type: {
        type: String,
        required: true,
        enum: ["xe-may", "oto", "thientai", "yte", "dongvat"],
        default: "xe-may"
    },
    phone: {
        type: String,
        required: true
    },
    location: {
        text: {
            type: String,
            required: [true, 'Địa chỉ là bắt buộc']
        },
        coords: {
            type: {
                type: String,
                enum: ['Point'],
                required: true,
                default: 'Point'
            },
            coordinates: {
                type: [Number],
                required: [true, 'Tọa độ là bắt buộc'],
                validate: {
                    validator: function(v) {
                        return Array.isArray(v) && 
                               v.length === 2 && 
                               v[0] >= -180 && v[0] <= 180 && // longitude
                               v[1] >= -90 && v[1] <= 90;     // latitude
                    },
                    message: 'Tọa độ không hợp lệ'
                }
            }
        }
    },
    description: {
        type: String,
        required: [true, 'Mô tả là bắt buộc'],
        minlength: [10, 'Mô tả phải có ít nhất 10 ký tự']
    },
    images: [{
        type: String,
        validate: {
            validator: function(v) {
                return /\.(jpg|jpeg|png|gif)$/i.test(v);
            },
            message: 'URL hình ảnh không hợp lệ'
        }
    }],
    expectedTime: {
        type: Date
    },
    feedback: {
        rating: {
            type: Number,
            min: 1,
            max: 5
        },
        comment: String
    },
    status: {
        type: String,
        enum: ["pending", "assigned", "in_progress", "done", "cancelled"],
        default: "pending"
    },
    priority: {
        type: String,
        enum: ["low", "medium", "high", "urgent"],
        default: "medium"
    },
    assignedTeam: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Team"
    }
}, {
    timestamps: true
});

export default mongoose.model("Report", reportSchema);
