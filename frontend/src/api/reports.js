import axios from "axios";

export const baseURL = import.meta.env.VITE_BASE_URL;

export const getOrderStatus = async (statuses) => {
  try {
    const res = await axios.get(`${baseURL}/api/reports/order-status`, {
      params: {
        statuses: statuses
      }
    });
    return res.data;
  } catch (err) {
    console.error(`Error fetching order report: ${err}`);
    return null;
  }
};