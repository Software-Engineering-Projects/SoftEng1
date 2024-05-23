import axios from "axios";

export const baseURL =
  import.meta.env.VITE_BASE_URL;

export const getProductById = async (productId) => {
  try {
    const res = await axios.get(`${baseURL}/api/products/${productId}`);
    return res.data.data;
  } catch (err) {
    console.error(err);
    return null;
  }
};

// NOTE: All below are for admin

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

export const deleteProduct = async (productId) => {
  try {
    const res = await axios.delete(`${baseURL}/api/products/delete/${productId}`);
    return res.data;
  } catch (err) {
    return null;
  }
};

export const updateProduct = async (productId, productData) => {
  try {
    const res = await axios.patch(`${baseURL}/api/products/update/${productId}`, productData);
    return res.data;
  } catch (err) {
    return null;
  }
};

