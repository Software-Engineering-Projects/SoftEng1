export const createCheckoutSession = async (cartId) => {
  const res = await axios.post(`${baseURL}/api/checkout/create-checkout-session`, cartId);
  return res.data.sessionId;
}