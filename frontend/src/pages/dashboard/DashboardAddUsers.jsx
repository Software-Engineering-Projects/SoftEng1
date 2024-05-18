import React, { useEffect, useState } from "react";
import { getOrderById } from "@/api/order";

export const DashboardAddUsers = () => {
  const [order, setOrder] = useState(null);

  useEffect(() => {
    getOrderById("6MKGNbX8imV52JjaQdGk").then((data) => {
      setOrder(data);
    });
  }, []);

  return (
    <div>
      {order ? (
        <div>
          <p>Order ID: {order.totalPrice}</p>
        </div>
      ) : (
        <p>Loading order data...</p>
      )}
    </div>
  );
};