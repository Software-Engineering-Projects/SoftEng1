const Joi = require("joi");

const validCategories = [
  "Appetizers",
  "Soups",
  "Salads",
  "Burgers",
  "Sandwiches",
  "Wraps",
  "Pizza",
  "Pasta",
  "Noodles",
  "Rice",
  "Seafood",
  "Chicken",
  "Beef",
  "Pork",
  "Vegetarian",
  "Vegan",
  "Gluten-Free",
  "Desserts",
  "Beverages",
  "Cocktails",
  "Wine",
  "Beer",
  "Coffee",
  "Tea",
  "Juice",
  "Smoothies",
];

const productSchema = Joi.object({
  productId: Joi.string(),
  productName: Joi.string().required(),
  basePrice: Joi.number().required(),
  sizes: Joi.array().items(
    Joi.object({
      price: Joi.number().required(),
      name: Joi.string().required(),
    }),
  ).optional(),
  addons: Joi.array().items(
    Joi.object({
      name: Joi.string().required(),
      price: Joi.number().required(),
    }),
  ).optional(),
  ingredients: Joi.array().items(Joi.string()),
  description: Joi.string().min(1),
  category: Joi.string().valid(...validCategories).required(),
  // NOTE: This will be given by firebase storage
  // TODO: This needs to be required but will be optional for now, need to setup firebase storage
  imageUrl: Joi.string(),
  isFeatured: Joi.boolean().default(false),
  isPublished: Joi.boolean().default(false),
  nutritionalInfo: Joi.object({
    calories: Joi.number().required(),
    carbohydrates: Joi.number().required(),
    fat: Joi.number().required(),
    fiber: Joi.number().required(),
    protein: Joi.number().required(),
    sugar: Joi.number().required(),
  }).optional(),
  preparationTime: Joi.number().required(),
});

// TODO: Create fork of the main product schema to be used for updating products
const updateProductSchema = productSchema.fork(["productName", "basePrice", "category", "isFeatured", "isPublished", "nutritionalInfo", "preparationTime"], (schema) => schema.optional());

module.exports = {
  productSchema, updateProductSchema,
};
