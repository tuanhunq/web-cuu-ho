import Joi from 'joi';

// User validation schemas
export const registerSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    name: Joi.string().min(2).required(),
    phone: Joi.string().pattern(/^[0-9]{10}$/).required(),
    role: Joi.string().valid('user', 'admin', 'rescue')
});

export const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
});

// Report validation schema
export const reportSchema = Joi.object({
    title: Joi.string().min(5).max(100).required(),
    type: Joi.string().valid('xe-may', 'oto', 'thientai', 'yte', 'dongvat').required(),
    phone: Joi.string().pattern(/^[0-9]{10}$/).required(),
    location: Joi.object({
        text: Joi.string().required(),
        coords: Joi.object({
            lat: Joi.number().min(-90).max(90).required(),
            lon: Joi.number().min(-180).max(180).required()
        }).required()
    }).required(),
    description: Joi.string().min(10).required(),
    images: Joi.array().items(Joi.string().uri()),
    priority: Joi.string().valid('low', 'medium', 'high', 'urgent')
});

// Team validation schema
export const teamSchema = Joi.object({
    name: Joi.string().min(2).max(50).required(),
    phone: Joi.string().pattern(/^[0-9]{10}$/).required(),
    specialties: Joi.array().items(
        Joi.string().valid('xe-may', 'oto', 'thientai', 'yte', 'dongvat')
    ).min(1).required(),
    members: Joi.array().items(Joi.string().hex().length(24)),
    location: Joi.object({
        text: Joi.string(),
        coords: Joi.object({
            lat: Joi.number().min(-90).max(90),
            lon: Joi.number().min(-180).max(180)
        })
    }),
    available: Joi.boolean().default(true)
});