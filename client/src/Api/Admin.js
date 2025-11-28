import api from "./api";

export const AdminFectchOrders = async () => {
    try {
        const response = await api.get('/admin/recent-orders', { withCredentials: true });
        return response.data.orders;
    } catch (error) {
        console.log(error.messsage);
    }
}

