import axios from "axios";
import { toast } from 'react-toastify';


const api = axios.create({
    baseURL: 'http://localhost:3000/api',
    timeout: 10000, // Timeout after 10 seconds
});

export const getProducts = async (query) => {    
    console.log('get prodcuts fun');
    
    const queryString = new URLSearchParams(query).toString(); // converts object to ?key=value&...    
    const response = await api.get(`/products?${queryString}`);  
    console.log(response.data);
    return response.data; 
}; 

export const getpageCount = async () => {
    const response = await api.get(`/products/pageCount`);
    return response.data.pageCount;
};

export const getSingleProduct = async (id) => {
    const response = await api.get(`/products/${id}`);
    return response.data.data;
}

export const contactUs = async (data) => {
    await api.post(`/contact`, data);
    toast('we will contact you soon thanks for contacting us');

}

export const loginFunction = async (data) => {
    try {
        let response = await api.post(`/auth/login`, data, { withCredentials: true });
        return response.data.user;
    } catch (error) {
        console.log(error.message);
    }
}


export const signupFunction = async (data) => {
    try {
        let response = await api.post(`/auth/register`, data);
        return response.data.user;
    } catch (error) {
        console.log(error.message);
    }
};

export const FetchOrders = async (data) => {
    try {
        const response = await api.get('/orders', { withCredentials: true });
        return response.data.orders;
    } catch (error) {
        console.log(error.message);
    }
}

export const addCart = async (data) => {
    try {
        const response = await api.post('/cart', { productId: data }, { withCredentials: true });
        return response.data.cartData;
    } catch (error) {
        console.log('triggred');

        throw Error(error.message);
    }
}

export const removeCartItem = async ({ cartId, productId }) => {
    try {
        console.log('fun ');

        await api.patch(`/cart/${cartId}`, { productId }, { withCredentials: true });
        toast.success('product removed from the cart');
    } catch (error) {
        console.log(error.message);

    }
}


export const fetchCart = async (userId) => {
    try {
        console.log(userId);
        const response = await api.get(`/cart/user/${userId}`, { withCredentials: true });
        return response.data.cartData;
    } catch (error) {
        console.log(error.message);
    }
}

export const getreviews = async ({ productId, page }) => {
    try {
        console.log(page);
        const response = await api.get(`/products/${productId}/reviews?page=${page}`);
        return response.data;
    } catch (error) {

    }
}


export const updateUser = async (data) => {
    try {
        const { _id } = data;
        delete data._id;        
        const response = await api.put(`/auth/${_id}`, data);
        return response.data.user;
    } catch (error) {
       throw Error(error);
    }

}

export const predictPrice = async (data) => {
    try {
        const response = await api.post('/v1/predict', data);
        return response.data;
    } catch (error) {
        throw Error(error.response?.data?.message || error.message || 'Prediction failed');
    }
}

export default api;