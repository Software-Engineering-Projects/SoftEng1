import axios from "axios";

export const baseURL =
  import.meta.env.VITE_BASE_URL;

export const addNewProduct = async (productData) => {
  try {
    const res = await axios.post(`${baseURL}/api/products/create`, productData);
    return res.data.productId;
  } catch (err) {
    return null;
  }
}

export const getAllProducts = async () => {
  try {
    const res = await axios.get(`${baseURL}/api/products/all`);
    console.log(res.data.data);
    return res.data.data;
  } catch (err) {
    console.error(err);
    return null;
  }
};

export const getProductById = async (productId) => {
  try {
    const res = await axios.get(`${baseURL}/api/products/${productId}`);
    return res.data.data;
  } catch (err) {
    console.error(err);
    return null;
  }
};