// TODO: These is not yet final
const Joi = require("joi");

// Define a schema for the Cart class using Joi
const cartSchema = Joi.object({
  // REVIEW: These id's are no longer needed as they will derive from firestore
  cartId: Joi.string(),
  userId: Joi.string().required(),
  items: Joi.array().items(Joi.object({
    // TODO: These are required im removing them for now
    // imageUrl: Joi.string().required(),
    productId: Joi.string().required(),
    // This will be derived from the chosen addons,sizes,etc different from the productId
    // Example: "large_cheese" derived from size and possible addons to help distinguish it from the same items from the cart if any
    productIdentifier: Joi.string().required(),
    productQuantity: Joi.number().required(),
    productPrice: Joi.number().required(),
    productName: Joi.string(),
  })).optional(),
  totalPrice: Joi.number().required(),
});

const createCartSchema = Joi.object({
  id: Joi.string(),
  userId: Joi.string().required(),
  items: Joi.array().items(Joi.object({
    productId: Joi.string(),
    productIdentifier: Joi.string(),
    productQuantity: Joi.number(),
    productPrice: Joi.number(),
    productName: Joi.string(),
  })).optional(),
  totalPrice: Joi.number(),
});

const cartItemsSchema = Joi.object({
  items: Joi.array().items(Joi.object({
    productId: Joi.string(),
    productIdentifier: Joi.string(),
    productQuantity: Joi.number(),
    productPrice: Joi.number(),
    productName: Joi.string(),
  })).optional(),
});

module.exports = {
  cartSchema, createCartSchema, cartItemsSchema,
};
