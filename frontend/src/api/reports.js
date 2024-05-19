import axios from "axios";

export const baseURL = import.meta.env.VITE_BASE_URL;

//{{baseUrl}}/api/reports/order-status?status=delivered

export const getOrderStatus = async (status) => {
  try {
    const res = await axios.get(`${baseURL}/api/reports/order-status`, {
      params: {
        status: status
      }
    });
    return res.data;
  } catch (err) {
    console.error(`Error fetching order report: ${err}`);
    return null;
  }
};