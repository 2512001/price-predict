import * as Yup from 'yup';

const signupSchema = Yup.object().shape({
    name: Yup.string().required().min(2, 'To short').max(50, 'To max'),
    email: Yup.string().email('Invalid Email').required('Email is required'),
    password: Yup.string().required('password must required')
        .min(8, 'password length must be geater then 8')
        .matches(/[a-z]/, 'must include a lowercase letter')
        .matches(/[A-Z]/, 'must include a upppercase letter')
        .matches(/[!@#$%^&*?]/, 'must include a speacer charcter'),

    ConfirmPassword: Yup.string().required('conform passwod required')
        .oneOf([Yup.ref('password')], 'Passwords must match')
});


const checkoutSchema = Yup.object().shape({
    firstName: Yup.string()
        .required('First name is required')
        .min(2, 'First name must be at least 2 characters'),

    lastName: Yup.string()
        .required('Last name is required')
        .min(2, 'Last name must be at least 2 characters'),

    email: Yup.string()
        .email('Invalid email format')
        .required('Email is required'),

    street: Yup.string()
        .required('Street address is required'),

    city: Yup.string()
        .required('City is required'),

    state: Yup.string()
        .required('State is required'),

    zipCode: Yup.string()
        .required('Zip code is required')
        .matches(/^\d{5,}$/, 'Zip code must be at least 5 digits'),

    country: Yup.string()
        .required('Country is required'),

    paymentMethod: Yup.string()
        .required('Payment method is required')
        .oneOf(['cod', 'Razorpay', 'bank_transfer'], 'Invalid payment method')
});

export { signupSchema , checkoutSchema }