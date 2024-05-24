import axios from "axios";

export const baseURL =
  import.meta.env.VITE_BASE_URL;
  
export const getAllOrders = async () => {
    try {
      const response = await axios.get(`${baseURL}/api/orders/all`);
      return response.data.data;
    } catch (error) {
      console.error("Error fetching orders:", error);
      return null;
    }
  };

  export const getOrderById = async (orderId) => {
    try {
      const response = await axios.get(`${baseURL}/api/orders/${orderId}`);
      return response.data.data;
    } catch (error) {
      console.error("Error fetching order:", error);
      return null;
    }
  };
  
  export const createOrder = async (orderData) => {
    try {
      const response = await axios.post(`${baseURL}/api/orders/create`, orderData);
      return response.data.productId;
    } catch (error) {
      console.error("Error creating order:", error);
      return null;
    }
  };
  
  export const updateOrderStatus = async (orderId, status) => {
    try {
      const response = await axios.patch(`${baseURL}/api/orders/update/${orderId}`, { status });
      return response.data;
    } catch (error) {
      console.error("Error updating order status:", error);
      return null;
    }
  };
  
  export const viewCustomerOrders = async (userId) => {
    try {
      const response = await axios.get(`${baseURL}/api/orders/view/${userId}`);
      return response.data.data;
    } catch (error) {
      console.error("Error fetching customer orders:", error);
      return null; 
    }
  };
  
