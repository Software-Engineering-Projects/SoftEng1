import axios from "axios";

export const baseURL =
  import.meta.env.VITE_BASE_URL;

export const createCart = async (userId) => {
  try {
    const res = await axios.post(`${baseURL}/api/cart/create/${userId}`);
    return res.data;
  } catch (err) {
    return null;
  }
};

export const getUserCart = async (userId) => {
  try {
    const res = await axios.get(`${baseURL}/api/cart/${userId}`);
    return res.data;
  } catch (err) {
    return null;
  }
};

export const addToCartApi = async (cartId, item) => {
  try {
    // Ensure item is in an array
    const items = Array.isArray(item) ? item : [item];

    const res = await axios.post(`${baseURL}/api/cart/add/${cartId}`, { items });
    console.log(res.data)
    return res.data;
  } catch (err) {
    console.log(err);
    return null;
  }
};

// TODO: After the api action is done detect changes live
export const updateCartItemQuantity = async (cartId, productId, productQuantity, productIdentifier) => {
  try {
    const res = await axios.patch(`${baseURL}/api/cart/update/${cartId}/${productId}`, { productQuantity, productIdentifier });
    console.log(res.data)
    return res.data;
  } catch (err) {
    return null;
  }
};

// TODO: After the api action is done detect changes live
export const deleteCartItem = async (cartId, productId, productIdentifier) => {
  try {
    const res = await axios.delete(`${baseURL}/api/cart/delete/${cartId}/${productId}`, { data: { productIdentifier } });
    console.log(res.data)
    return res.data;
  } catch (err) {
    return null;
  }
};

export const clearCartItems = async (cartId) => {
  try {
    const res = await axios.post(`${baseURL}/api/cart/clear/${cartId}`);
    console.log(res.data)
    return res.data;
  } catch (err) {
    return null;
  }
};
