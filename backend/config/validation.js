const Joi = require('joi');

//register validation of the user
const registerValidation = Joi.object({
    name: Joi.string().max(100).required().messages({
        'string.empty': 'Name is required',
        'string.max': 'Name must be under 100 characters'
    }),
    email: Joi.string().email().required().messages({
        'string.email': 'Please provide a valid email',
        'string.empty': 'Email is required'
    }),
    password: Joi.string()
        .min(8)
        .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$"))
        .required()
        .messages({
            'string.pattern.base': 'Password must include at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)',
            'string.min': 'Password must be at least 8 characters long',
            'string.empty': 'Password is required',
        }),
    role: Joi.string().valid('customer').optional(),
    phone: Joi.string()
        .pattern(/^[6-9]\d{9}$/)
        .optional()
        .messages({
            'string.pattern.base': 'Phone number must be a valid 10-digit Indian mobile number starting with 6-9',
        })
}).unknown(true);
    


//product validaton while creating product 
const productValidationSchema = Joi.object({
    name: Joi.string().max(100).required(),
    storage: Joi.number().min(1).required().messages({
        'number.base': 'Storage must be a number',
        'number.min': 'Storage must be at least 1GB',
        'any.required': 'Please provide storage information'
    }),
    color: Joi.string().required().messages({
        'string.base': 'Color must be a string',
        'any.required': 'Please provide the product color'
    }),
    description: Joi.string().max(500).required().messages({
        'string.base': 'Description must be a string',
        'string.max': 'Description cannot exceed 500 characters',
        'any.required': 'Please provide a product description'
    }),
    price: Joi.number().min(1000).required().messages({
        'number.base': 'Price must be a number',
        'number.min': 'Price must be at least 1',
        'number.max': 'Price cannot exceed 10000',
        'any.required': 'Please provide the product price'
    }),
    stock: Joi.number().min(0).required().messages({
        'number.base': 'Stock must be a number',
        'number.min': 'Stock cannot be negative',
        'any.required': 'Please provide the stock count'
    }),
    category: Joi.string().valid('mobile', 'electronics').required().messages({
        'string.base': 'Category must be a string',
        'any.only': 'Category must be either mobile or electronics',
        'any.required': 'Please provide the product category'
    }),
    images: Joi.array().items(Joi.string()),
    isActive: Joi.boolean().default(true),
    features: Joi.array().max(10).items(Joi.string()).optional().messages({
        'array.max': 'Features cannot exceed 10 items'
    }),
    specifications: Joi.array().max(6).items(Joi.object({
        key: Joi.string().max(20).required(),
        value: Joi.string().max(50).required()
    })).optional().messages({
        'array.max': 'Specifications cannot exceed 6 items'
    })
}).unknown(true);


// //update  product validation 
// const updateProductSchema = Joi.object({
//     name: Joi.string().max(100),
//     storage: Joi.number(),
//     color: Joi.string(),
//     description: Joi.string().max(500),
//     price: Joi.number().min(1),
//     stock: Joi.number().min(0),
//     category: Joi.string().valid('mobile', 'electronics'),
//     images: Joi.array().items(Joi.string()),
//     video: Joi.string(),
//     isActive: Joi.boolean(),
//     features: Joi.array().items(Joi.string()).max(10),
//     specifications: Joi.array().items(
//       Joi.object({
//         key: Joi.string().max(20).required(),
//         value: Joi.string().max(50).required(),
//       })
//     ).max(6),
//   });



//order validation 
const orderValidationSchema = Joi.object({
    items: Joi.array()
        .items(
            Joi.object({
                product: Joi.string().required(),
                quantity: Joi.number().integer().min(1).required(),
            })
        )
        .min(1)
        .required(),
    status: Joi.string().valid('pending', 'processing', 'shipped', 'delivered', 'cancelled'),
    shippingAddress: Joi.object({
        address: Joi.string().allow('', null),
        street: Joi.string().allow('', null),
        city: Joi.string().allow('', null),
        state: Joi.string().allow('', null),
        country: Joi.string().allow('', null),
        zipCode: Joi.string().allow('', null)
    }),
    paymentStatus: Joi.string().valid('pending', 'completed', 'failed')
});

module.exports = { registerValidation, productValidationSchema, orderValidationSchema };
