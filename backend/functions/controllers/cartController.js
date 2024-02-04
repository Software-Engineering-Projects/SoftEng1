/* eslint-disable linebreak-style */
/* eslint-disable block-spacing */
/* eslint-disable semi */
/* eslint-disable brace-style */
/* eslint-disable object-curly-spacing */
/* eslint-disable max-len */

const admin = require("firebase-admin");
const db = admin.firestore();
const cartCollectionRef = db.collection("cart");
const { cartSchema, createCartSchema } = require("../models/cartModel");
const productsCollectionRef = db.collection("products");
const { checkProductExists } = require("../helpers/checkProductExists");

const cartTestRouteServer = (_req, res, next) => {
  return res.send("Inside the cart router");
};

// TODO: Store all these instances to Redux(if applicable)

// TODO:
// TODO: Verify products existence,
// TODO: Calculate the total price of the items in the cart

// FIXME: If the array is initially empty the price doesn't display the updated price
const calculateTotalPrice = (items) => {
  let totalPrice = 0;
  if (items.length === 0) {
    return totalPrice;
  }
  items.forEach((item) => {
    const { productPrice, productQuantity } = item;
    if (typeof productPrice === "number" && typeof productQuantity === "number") {
      totalPrice += productPrice * productQuantity;
    }
  });
  return Number(totalPrice.toFixed(2));
};

// REVIEW: This finally adds products with same id's and identifiers
// NOTE: The product identifier still hasn't yet been assigned to this and must derived from the chosen options
const addToCartServer = async (req, res) => {
  const id = req.params.cartId;
  try {
    // NOTE: This can just be set as a helper function
    const cartDoc = await cartCollectionRef.doc(id).get();
    if (!cartDoc.exists) {
      return res.status(404).send({ success: false, msg: `CART NOT FOUND [SERVER]` });
    }

    // NOTE: This can just be set as a helper function
    if (!id || typeof id !== "string") {
      return res.status(400).send({ success: false, msg: "Invalid ID parameter" });
    }

    // NOTE: This can just be set as a helper function
    if (!req.body || !req.body.items || !Array.isArray(req.body.items) || req.body.items.length === 0) {
      return res.status(404).send({ success: false, msg: "CART ADD CANNOT ADD EMPTY REQUEST [SERVER]" });
    }

    // NOTE: Try to make this a function
    const productIds = req.body.items.map((item) => {
      return item.productId
    });

    // NOTE: This can just be set as a helper function
    const productExists = await Promise.all(productIds.map(checkProductExists));
    if (productExists.includes(false)) {
      return res.status(404).send({ success: false, msg: "PRODUCT DOES NOT EXIST [SERVER]" });
    }

    // TODO: Instead of assigning the product price in the request body assign it by looking through the products doc
    // NOTE: This is more annoying than i thought the price in the products are only based prices and increase based on the chosen options, i'll account this later, it shouldn't be mapped from the request body and should be derived from the products doc
    const productItemPrice = req.body.items.map((item) => {
      return item.productPrice
    });

    // TODO: Create a product identifier based on the chosen options
    const productDoc = await productsCollectionRef.doc(req.body.items[0].productId).get();
    // console.log(productDoc.data().addons[1].name);
    // console.log(productDoc.data().sizes[0].name);
    // console.log(productDoc.data().sizes[0].name);
    console.log(productDoc.data(), "Product Doc")
    // console.log(productDoc.data().basePrice, "Product Price")

    const { userId, items: existingItems } = cartDoc.data();

    const newItems = (req.body.items || []).map((item) => {
      return {
        productId: item.productId,
        // FIXME: This should be derived from the added product to cart...
        productIdentifier: item.productIdentifier,
        productQuantity: item.productQuantity,
        productPrice: item.productPrice,
      };
    });

    // If the item doesn't exists in the cart yet, filter it out and add a new item to the array
    const newItemsToAdd = newItems.filter((newItem) => {
      return !existingItems.some((existingItem) => existingItem.productId === newItem.productId && existingItem.productIdentifier === newItem.productIdentifier);
    });

    // If the item already exists in the items array just reduce the existing items to a new array with updated quantities.
    const updatedItems = existingItems.reduce((acc, existingItem) => {
      const newItem = newItems.find((newItem) => newItem.productId === existingItem.productId && newItem.productIdentifier === existingItem.productIdentifier);
      if (newItem) {
        // Update the quantity of the existing item
        existingItem.productQuantity += newItem.productQuantity;
      }
      // Add the existing item
      acc.push(existingItem);
      return acc;
    }, []);

    // Concatenate the new items to add with the updated items
    const finalItems = updatedItems.concat(newItemsToAdd);
    console.log("Final Items:", finalItems)
    console.log("New Items to Add", newItemsToAdd)


    const totalPrice = parseFloat(calculateTotalPrice(finalItems));

    req.body.totalPrice = totalPrice;

    // FIXME: This should be an array of objects
    // FIXME: Validate the items array
    const { error, value } = cartSchema.validate({ ...req.body, userId: userId, items: finalItems, totalPrice: totalPrice, cartId: id });
    if (error) {
      console.error(`VALIDATION ERROR: ${error.message}`);
      return res.status(400).send({ success: false, msg: `VALIDATION ERROR: ${error.message}` });
    } else {
      const cart = {
        ...value,
      };

      cartCollectionRef.doc(id).set(cart, { merge: true }).then(() => {
        return res.status(200).send({ success: true, data: cart });
      }).catch((error) => {
        return res.status(400).send({ success: false, msg: `ADD TO CART ERROR [SERVER] ${error.message}` });
      });
    }
  } catch (error) {
    return res.status(400).send({ success: false, msg: `ADD TO CART ERROR [SERVER] ${error.message}` });
  }
};

// TODO: Update Cart based on cart logic
// --Increment & Decrement Items
// --Same items but different options are separated, product identifier will be created based on the selected options
// --Adding a product to the cart whilst there already is an instance of the items will add x quantity from the current items selected
// TODO:
// REVIEW:
const updateCartItemQuantityServer = async (req, res, next) => {
  try {
    const cartId = req.params.cartId;
    const productId = req.params.productId;
    const productIdentifier = req.body.productIdentifier;
    const productQuantity = req.body.productQuantity;

    if (!cartId || typeof cartId !== "string" || !productId || typeof productId !== "string") {
      return res.status(400).send({ success: false, msg: "Invalid ID parameter" });
    }

    // NOTE: This can just be set as a helper function
    const cartDoc = await cartCollectionRef.doc(cartId).get();
    if (!cartDoc.exists) {
      return res.status(404).send({ success: false, msg: "Cart not found" });
    }

    if (!productIdentifier || typeof productIdentifier !== "string") {
      return res.status(404).send({ success: false, msg: "Missing product identifier" });
    }

    // Check if the product exists and if not automatically remove from cart
    const productDoc = await productsCollectionRef.doc(productId).get();
    if (!productDoc.exists) {
      // Remove the item from the cart if the product doesn't exist
      await cartCollectionRef.doc(cartId).update({
        items: admin.firestore.FieldValue.arrayRemove({ productId, productIdentifier }),
      });
      return res.status(200).send({ success: true, msg: "Product not found, item removed from cart" });
    }

    // Check if the item with the given productIdentifier and productId exists in the cart
    const cartItems = cartDoc.data().items;
    const itemIndex = cartItems.findIndex((item) => item.productId === productId && item.productIdentifier === productIdentifier);
    if (itemIndex === -1) {
      return res.status(404).send({ success: false, msg: "Item not found in the cart" });
    }

    // Update the quantity of the cart item
    const item = cartItems[itemIndex];
    item.productQuantity = productQuantity <= 0 ? 1 : productQuantity;

    // Update the cart item in the cart
    cartItems[itemIndex] = item;
    await cartCollectionRef.doc(cartId).update({ items: cartItems });

    const totalPrice = calculateTotalPrice(cartItems);
    await cartCollectionRef.doc(cartId).update({ totalPrice });
    return res.status(200).send({ success: true, msg: "Cart item quantity updated", productQuantity: item.productQuantity, totalPrice: totalPrice });
  } catch (error) {
    console.error(`UPDATE CART ITEM QUANTITY ERROR [SERVER] ${error.message}`);
    return res.status(400).send({ success: false, msg: `UPDATE CART ITEM QUANTITY ERROR [SERVER] ${error.message}` });
  }
};

// REVIEW:
// TODO: Add middleware to check for the owner of the cart or admin, if not the user cannot view that cart
const getUserCartServer = async (req, res, next) => {
  const id = req.params.cartId;
  try {
    // NOTE: This can just be set as a helper function
    if (!id || typeof id !== "string") {
      return res.status(400).send({ success: false, msg: "Invalid ID parameter" });
    }

    // NOTE: This can just be set as a helper function
    const doc = await cartCollectionRef.doc(id).get();
    if (!doc.exists) {
      return res.status(404).send({ success: false, msg: "CART NOT FOUND [SERVER]" });
    }

    const { userId, items } = doc.data();
    const totalPrice = calculateTotalPrice(items);

    req.body.totalPrice = parseFloat(totalPrice);
    const { error, value } = cartSchema.validate({
      items, userId, totalPrice, cartId: doc.id,
    });
    if (error) {
      console.error(`VALIDATION ERROR: ${error.message}`);
      return res.status(400).send({ success: false, msg: `VALIDATION ERROR: ${error.message}` });
    }

    const response = {
      ...value,
    };

    return res.status(200).send({ success: true, data: response });
  } catch (error) {
    console.error(`GET USER CART BY ID ERROR [SERVER] ${error.message}`);
    return res.status(400).send({ success: false, msg: `GET USER CART BY ID ERROR [SERVER] ${error.message}` });
  }
};

// REVIEW:
// NOTE: This can actually just be a helper function and can be invoked upon creation of an account, but for now just leave it here
const createCartServer = async (req, res, next) => {
  try {
    const user = await admin.auth().getUser(req.params.userId);
    console.log(user.uid);
    const userId = user.uid;
    req.params.userId = userId;

    // NOTE: This can just be set as a helper function
    if (!userId || typeof userId !== "string") {
      return res.status(400).send({ success: false, msg: "Invalid ID parameter" });
    }

    const userCartRef = await cartCollectionRef.where("userId", "==", userId).limit(1).get();
    if (!userCartRef.empty) {
      const cartId = userCartRef.docs[0].id;
      return res.status(409).send({ success: true, msg: "User already has a cart", cartId: cartId });
    }

    // NOTE: Initialize the empty array of objects
    const items = [];
    const { error, value } = createCartSchema.validate({ ...req.body, userId: userId, items: items });
    console.log(value)
    if (error) {
      console.error(`VALIDATION ERROR: ${error.message}`);
      return res.status(400).send({ success: false, msg: `VALIDATION ERROR: ${error.message}` });
    }

    const createCart = {
      ...value,
    };

    const cartRef = await cartCollectionRef.add(createCart);
    return res.status(200).send({ success: true, msg: "Cart created successfully", data: createCart, cartId: cartRef.id });
  } catch (error) {
    return res.status(400).send({ success: false, msg: `ERROR CREATE CART [SERVER]: ${error.message}` });
  }
};

// TODO:
// REVIEW:
const deleteCartItemServer = async (req, res, next) => {
  const cartId = req.params.cartId;
  const productId = req.params.productId;
  const productIdentifier = req.body.productIdentifier;
  try {
    // NOTE: This can just be set as a helper function
    if (!cartId || typeof cartId !== "string" || !productId || typeof productId !== "string") {
      return res.status(400).send({ success: false, msg: "Invalid ID parameter" });
    }

    // NOTE: This can just be set as a helper function
    // Check if the cart exists
    const cartDoc = await cartCollectionRef.doc(cartId).get();
    if (!cartDoc.exists) {
      return res.status(404).send({ success: false, msg: "Cart not found" });
    }

    // NOTE: This can just be set as a helper function
    if (!productIdentifier || typeof productIdentifier !== "string") {
      return res.status(400).send({ success: false, msg: "Missing product identifier" });
    }

    // Check if the product exists
    const productDoc = await productsCollectionRef.doc(productId).get();
    if (!productDoc.exists) {
      await cartCollectionRef.doc(cartId).update({
        items: admin.firestore.FieldValue.arrayRemove({ productId, productIdentifier }),
      });
      return res.status(200).send({ success: true, msg: "Product not found, item removed from cart" });
    }

    // Check if the item with the given productIdentifier and productId exists in the cart
    const cartItems = cartDoc.data().items;
    const itemIndex = cartItems.findIndex((item) => item.productId === productId && item.productIdentifier === productIdentifier);
    if (itemIndex === -1) {
      return res.status(404).send({ success: false, msg: "Item not found in the cart" });
    }

    // Remove the item from the cart
    cartItems.splice(itemIndex, 1);
    await cartCollectionRef.doc(cartId).update({ items: cartItems });

    // Recalculate the total price to properly update it for the removed items
    const updatedCartDoc = await cartCollectionRef.doc(cartId).get();
    const updatedCartItems = updatedCartDoc.data().items;
    const totalPrice = calculateTotalPrice(updatedCartItems);
    await cartCollectionRef.doc(cartId).update({ totalPrice });
    return res.status(200).send({ success: true, msg: "Item removed from cart", totalPrice: totalPrice });
  } catch (error) {
    console.error(`DELETE CART ITEM ERROR [SERVER] ${error.message}`);
    return res.status(400).send({ success: false, msg: `DELETE CART ITEM ERROR [SERVER] ${error.message}` });
  }
};

module.exports = {
  cartTestRouteServer, addToCartServer, updateCartItemQuantityServer, getUserCartServer, createCartServer, deleteCartItemServer,
};
