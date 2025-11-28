import { FetchOrders } from "../Api/api";
import { useQuery } from "@tanstack/react-query";
import OrderCard from "./OrderCard";
import Skeleton from "react-loading-skeleton";


const Orders = () => {

    const { data: orders = [], isLoading, error } = useQuery({
        queryKey: ['orders'],
        queryFn: FetchOrders,
    });


    if (isLoading) {
        return (
            <div className="orders-section">
                <h2>Order History</h2>
                <div className="orders-list">
                    {[...Array(3)].map((_, i) => (
                        <Skeleton key={i} height={80} style={{ marginBottom: '12px' }} />
                    ))}
                </div>
            </div>
        );
    }

    if (error) return <p>Error loading orders</p>;

    return (
        <div className="orders-section">
            <h2>Order History</h2>
            <div className="orders-list">
                {
                    orders.length <= 0 ? (
                        <div className="NoOrder">
                            <span role="img" aria-label="package">📦</span> There are no orders.
                        </div>

                    ) :
                        orders?.map(order => (
                            <OrderCard key={order.id} order={order} />
                        ))
                }
            </div>
        </div>
    );
};


export default Orders;