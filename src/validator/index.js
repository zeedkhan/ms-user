const Joi = require('joi')


const createUserSchema = Joi.object({
    name: Joi.string().required().min(2),
    password: Joi.string().required().min(8),
    email: Joi.string().email().required(),
    domain: Joi.string().uri().required()
});


const blogSchema = Joi.object({
    id: Joi.string().optional(),
    title: Joi.string().required().min(2),
    content: Joi.object().required(),
    userId: Joi.string().required(),
    description: Joi.string().default(""),
    seoPath: Joi.string().required().min(2),
});

const signInSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required().min(8),
});

const avatarSchema = Joi.object({
    path: Joi.string().required().min(6),
    id: Joi.string().optional()
});

const UserRole = {
    ADMIN: 'ADMIN',
    USER: 'USER',
};

const LoginSchema = Joi.object({
    email: Joi.string().email().required().messages({
        'string.email': 'Email is required',
        'any.required': 'Email is required',
    }),
    password: Joi.string().min(1).required().messages({
        'string.min': 'Password is required',
        'any.required': 'Password is required',
    }),
    code: Joi.string().optional(),
});

const RegisterSchema = Joi.object({
    email: Joi.string().email().required().messages({
        'string.email': 'Email is required',
        'any.required': 'Email is required',
    }),
    password: Joi.string().min(6).required().messages({
        'string.min': 'Minimum 6 characters required',
        'any.required': 'Password is required',
    }),
    name: Joi.string().min(1).required().messages({
        'string.min': 'Name is required',
        'any.required': 'Name is required',
    }),
});

const ResetSchema = Joi.object({
    email: Joi.string().email().required().messages({
        'string.email': 'Email is required',
        'any.required': 'Email is required',
    }),
    domain: Joi.string().uri().required()
});

const UpdateSchema = Joi.object({
    id: Joi.string().optional(),
    email: Joi.string().email().required().messages({
        'string.email': 'Email is required',
        'any.required': 'Email is required',
    }),
    name: Joi.string().required().min(2),
})

const SettingsSchema = Joi.object({
    name: Joi.string().optional(),
    role: Joi.string().valid(UserRole.ADMIN, UserRole.USER).required(),
    email: Joi.string().email().optional(),
    password: Joi.string().min(6).optional(),
    newPassword: Joi.string().min(6).optional(),
}).custom((value, helpers) => {
    if (value.password && !value.newPassword) {
        return helpers.message({ custom: 'New password is required!' });
    }
    if (value.newPassword && !value.password) {
        return helpers.message({ custom: 'Password is required!' });
    }
    return value;
});

const NewPasswordSchema = Joi.object({
    password: Joi.string().min(6).required().messages({
        'string.min': 'Minimum 6 characters required!',
        'any.required': 'Password is required!',
    }),
});

module.exports = {
    LoginSchema,
    RegisterSchema,
    ResetSchema,
    SettingsSchema,
    NewPasswordSchema,
    blogSchema,
    UpdateSchema,
    createUserSchema,
    signInSchema,
    avatarSchema
}