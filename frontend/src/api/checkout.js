import axios from 'axios';

export const baseURL =
  import.meta.env.VITE_BASE_URL;
// TODO: Implement Stripe here
// TODO: This will automatically redirect the user to the Stripe Checkout page given the id

export const createStripeCheckoutSession = async (cartId, userId) => {
  try {
    const res = await axios.post(`${baseURL}/api/checkout/create-checkout-session`, { cartId, userId });
    return res.data.url;
  } catch (err) {
    return null;
  }
};
