// TODO: This is not yet final
const Joi = require("joi");

const orderStatusList = [
  "pending", "confirmed", "shipped", "delivered", "cancelled",
];

const orderSchema = Joi.object({
  checkoutSessionId: Joi.string().required(),
  userId: Joi.string().required(),
  cartId: Joi.string().required(),
  orderDate: Joi.string().required(),
  customerName: Joi.string(),
  customerEmail: Joi.string().email(),
  shippingAddress: (Joi.object({
    city: Joi.string(),
    country: Joi.string(),
    line1: Joi.string(),
    line2: Joi.string(),
    postalCode: Joi.string(),
    state: Joi.string(),
  })).optional(),
  status: Joi.string().valid(...orderStatusList).required(),
  totalPrice: Joi.number().required(),
});

module.exports = orderSchema;
