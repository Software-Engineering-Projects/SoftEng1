// TODO: This is not yet final
const Joi = require("joi");

const orderStatusList = [
  "pending", "confirmed", "shipped", "delivered", "cancelled",
];

const paymentChannelList = ["stripe", "cash"];

// NOTE: This will account for cash on delivery and stripe payments, so check thoroughly
// TODO: I need to throughyly check which fields i'll actually validate for stripe payments
const stripeOrderSchema = Joi.object({
  paymentChannel: Joi.string().valid(...paymentChannelList).default("stripe"),
  userId: Joi.string().required(),
  cartId: Joi.string().required(),
  orderDate: Joi.string().default(new Date().toISOString()),
  customerName: Joi.string(),
  customerEmail: Joi.string().email(),
  // shippingAddress: (Joi.object({
  //   city: Joi.string(),
  //   country: Joi.string(),
  //   line1: Joi.string(),
  //   line2: Joi.string(),
  //   postalCode: Joi.string(),
  //   state: Joi.string(),
  // })).optional(),
  // lineItems: Joi.array().items(Joi.object({
  //   productId: Joi.string().required(),
  //   productIdentifier: Joi.string().required(),
  //   productQuantity: Joi.number().required(),
  //   productPrice: Joi.number().required(),
  //   productName: Joi.string(),
  // })).optional(),
  status: Joi.string().valid(...orderStatusList).default("pending"),
  totalPrice: Joi.number(),
});

const cashOnDeliverySchema = Joi.object({
  paymentChannel: Joi.string().valid(...paymentChannelList).default("cash"),
  userId: Joi.string().required(),
  cartId: Joi.string().required(),
  orderDate: Joi.string().default(new Date().toISOString()),
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
  // TODO: I would need to deparse the product identifier to determine the addons and sizes
  lineItems: Joi.array().items(Joi.object({
    productId: Joi.string().required(),
    productIdentifier: Joi.string().required(),
    productQuantity: Joi.number().required(),
    productPrice: Joi.number().required(),
    productName: Joi.string(),
  })).required(),
  status: Joi.string().valid(...orderStatusList).default("pending"),
  totalPrice: Joi.number(),
});

module.exports = {
  stripeOrderSchema, cashOnDeliverySchema,
};
