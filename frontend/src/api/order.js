import axios from "axios";

export const baseURL =
  import.meta.env.VITE_BASE_URL;

export const getOrderById = async (orderId) => {
  try {
    const res = await axios.get(`${baseURL}/api/orders/${orderId}`);
    return res.data.data;
  } catch (err) {
    return null;
  }
}

export const createOrder = async (orderData) => {
  try {
    const res = await axios.post(`${baseURL}/api/orders/create`, orderData);
    console.log(res.data.data);
    return res.data.data;
  } catch (err) {
    return null;
  }
}
