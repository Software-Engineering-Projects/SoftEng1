const admin = require("firebase-admin");
const db = admin.firestore();
const cartCollectionRef = db.collection("cart");
const productsCollectionRef = db.collection("products");
const { cartSchema, createCartSchema } = require("../models/cartModel");

const cartTestRouteServer = (_req, res, next) => {
  return res.send("Inside the cart router");
};

// TODO: Store all these instances to Redux(if applicable)

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
// FIXME: This doesn't account for multiple product options just the base price, for now...
const addToCartServer = async (req, res) => {
  const id = req.params.cartId;
  try {
    if (!id || typeof id !== "string") {
      return res.status(400).send({ msg: "Invalid ID parameter" });
    }

    const cartDoc = await cartCollectionRef.doc(id).get();
    if (!cartDoc.exists) {
      return res.status(404).send({ msg: "CART NOT FOUND [SERVER]" });
    }

    if (!req.body || !req.body.items || !Array.isArray(req.body.items) || req.body.items.length === 0) {
      return res.status(400).send({ msg: "CART ADD CANNOT ADD EMPTY REQUEST [SERVER]" });
    }

    const productIds = req.body.items.map((item) => item.productId);
    const productDocs = await Promise.all(productIds.map((productId) => productsCollectionRef.doc(productId).get()));
    const productExists = productDocs.every((doc) => doc.exists);
    if (!productExists) {
      return res.status(404).send({ msg: "PRODUCT DOES NOT EXIST [SERVER]" });
    }

    const cartData = cartDoc.data();
    const existingItems = cartData.items || [];

    const newItems = req.body.items.map((item) => {
      const productDoc = productDocs.find((doc) => doc.id === item.productId);
      if (!productDoc) {
        throw new Error(`Product with ID ${item.productId} not found`);
      }
      const productData = productDoc.data();
      return {
        productId: item.productId,
        productIdentifier: item.productIdentifier,
        productQuantity: item.productQuantity,
        productPrice: productData.basePrice, // Taken from firestore not assigned by the user in the req.body.items
      };
    });

    let finalItems = [];
    if (existingItems.length > 0) {
      finalItems = existingItems.reduce((acc, existingItem) => {
        const newItem = newItems.find((newItem) => newItem.productId === existingItem.productId && newItem.productIdentifier === existingItem.productIdentifier);
        if (newItem) {
          existingItem.productQuantity += newItem.productQuantity;
        }
        acc.push(existingItem);
        return acc;
      }, []);

      const newItemsToAdd = newItems.filter((newItem) => {
        return !existingItems.some((existingItem) => existingItem.productId === newItem.productId && existingItem.productIdentifier === newItem.productIdentifier);
      });

      finalItems = finalItems.concat(newItemsToAdd);
    } else {
      finalItems = newItems;
    }

    const totalPrice = calculateTotalPrice(finalItems);
    const updatedTotalPrice = parseFloat(totalPrice.toFixed(2));

    const { error, value } = cartSchema.validate({
      ...req.body,
      userId: cartData.userId,
      items: finalItems,
      totalPrice: updatedTotalPrice,
      cartId: id,
    });

    if (error) {
      console.error(`VALIDATION ERROR: ${error.message}`);
      return res.status(400).send({ msg: `VALIDATION ERROR: ${error.message}` });
    }

    const cart = {
      ...value,
    };

    await cartCollectionRef.doc(id).set(cart, { merge: true });
    return res.status(200).send({ data: cart });
  } catch (error) {
    console.error(`ADD TO CART ERROR [SERVER] ${error.message}`);
    return res.status(400).send({ msg: `ADD TO CART ERROR [SERVER] ${error.message}` });
  }
};

// NOTE: This just allow for product quantity to be updated, the product identifier and options will be added later
const updateCartItemQuantityServer = async (req, res, next) => {
  try {
    const cartId = req.params.cartId;
    const productId = req.params.productId;
    const productIdentifier = req.body.productIdentifier;
    const productQuantity = req.body.productQuantity;

    if (!cartId || typeof cartId !== "string" || !productId || typeof productId !== "string") {
      return res.status(400).send({ msg: "Invalid ID parameter" });
    }

    const cartDoc = await cartCollectionRef.doc(cartId).get();
    if (!cartDoc.exists) {
      return res.status(404).send({ msg: "Cart not found" });
    }

    if (!productIdentifier || typeof productIdentifier !== "string") {
      return res.status(400).send({ msg: "Missing or invalid product identifier" });
    }

    if (!Number.isInteger(productQuantity) || productQuantity <= 0) {
      return res.status(400).send({ msg: "Invalid product quantity" });
    }

    // Check if the product exists and if not automatically remove from cart
    const productDoc = await productsCollectionRef.doc(productId).get();
    if (!productDoc.exists) {
      await cartCollectionRef.doc(cartId).update({
        items: admin.firestore.FieldValue.arrayRemove({ productId, productIdentifier }),
      });
      return res.status(200).send({ msg: "Product not found, item removed from cart" });
    }

    // Check if the item with the given productIdentifier and productId exists in the cart
    const cartItems = cartDoc.data().items;
    const itemIndex = cartItems.findIndex((item) => item.productId === productId && item.productIdentifier === productIdentifier);
    if (itemIndex === -1) {
      return res.status(404).send({ msg: "Item not found in the cart" });
    }

    const item = cartItems[itemIndex];
    item.productQuantity = productQuantity;

    // Update the cart item in the cart
    cartItems[itemIndex] = item;
    await cartCollectionRef.doc(cartId).update({ items: cartItems });

    const totalPrice = calculateTotalPrice(cartItems);
    await cartCollectionRef.doc(cartId).update({ totalPrice });
    return res.status(200).send({ msg: "Cart item quantity updated", productQuantity: item.productQuantity, totalPrice: totalPrice });
  } catch (error) {
    console.error(`UPDATE CART ITEM QUANTITY ERROR [SERVER] ${error.message}`);
    return res.status(500).send({ msg: "Internal server error" });
  }
};

// TODO: Add middleware to check for the owner of the cart or admin, if not the user cannot view that cart
const getUserCartServer = async (req, res, next) => {
  const id = req.params.cartId;
  try {
    if (!id || typeof id !== "string") {
      return res.status(400).send({ msg: "Invalid ID parameter" });
    }

    const doc = await cartCollectionRef.doc(id).get();
    if (!doc.exists) {
      return res.status(404).send({ msg: "CART NOT FOUND [SERVER]" });
    }

    const { userId, items } = doc.data();
    if (!userId || typeof userId !== "string") {
      return res.status(400).send({ msg: "Invalid user ID in cart data" });
    }
    if (!Array.isArray(items)) {
      return res.status(400).send({ msg: "Invalid items array in cart data" });
    }

    const totalPrice = calculateTotalPrice(items);
    if (typeof totalPrice !== "number" || isNaN(totalPrice)) {
      return res.status(400).send({ msg: "Invalid total price in cart data" });
    }

    req.body.totalPrice = parseFloat(totalPrice);
    const { error, value } = cartSchema.validate({
      items, userId, totalPrice, cartId: doc.id,
    });
    if (error) {
      console.error(`VALIDATION ERROR: ${error.message}`);
      return res.status(400).send({ msg: `VALIDATION ERROR: ${error.message}` });
    }

    const response = {
      ...value,
    };

    return res.status(200).send({ data: response });
  } catch (error) {
    console.error(`GET USER CART BY ID ERROR [SERVER] ${error.message}`);
    return res.status(500).send({ msg: `Internal server error` });
  }
};

// REVIEW:
// NOTE: This can actually just be a helper function, or webhook and can be invoked upon creation of an account, but for now just leave it here
const createCartServer = async (req, res, next) => {
  try {
    const user = await admin.auth().getUser(req.params.userId);
    const userId = user.uid;
    req.params.userId = userId;

    if (!userId || typeof userId !== "string") {
      return res.status(400).send({ msg: "Invalid ID parameter" });
    }

    const userCartRef = await cartCollectionRef.where("userId", "==", userId).limit(1).get();
    if (!userCartRef.empty) {
      const cartId = userCartRef.docs[0].id;
      return res.status(409).send({ msg: "User already has a cart", cartId: cartId });
    }

    // NOTE: Initialize the empty array of objects
    const items = [];
    const { error, value } = createCartSchema.validate({ ...req.body, userId: userId, items: items });
    if (error) {
      console.error(`VALIDATION ERROR: ${error.message}`);
      return res.status(400).send({ msg: `VALIDATION ERROR: ${error.message}` });
    }

    const createCart = {
      ...value,
    };

    const cartRef = await cartCollectionRef.add(createCart);
    if (!cartRef.id) {
      return res.status(500).send({ msg: "Failed to create cart" });
    }

    return res.status(200).send({ msg: "Cart created successfully", data: createCart, cartId: cartRef.id });
  } catch (error) {
    console.error(`ERROR CREATE CART [SERVER]: ${error.message}`);
    return res.status(500).send({ msg: `ERROR CREATE CART [SERVER]: ${error.message}` });
  }
};

// TODO:
// REVIEW:
const deleteCartItemServer = async (req, res, next) => {
  const cartId = req.params.cartId;
  const productId = req.params.productId;
  const productIdentifier = req.body.productIdentifier;
  try {
    if (!cartId || typeof cartId !== "string" || !productId || typeof productId !== "string") {
      return res.status(400).send({ msg: "Invalid ID parameter" });
    }

    const cartDoc = await cartCollectionRef.doc(cartId).get();
    if (!cartDoc.exists) {
      return res.status(404).send({ msg: "Cart not found" });
    }

    if (!productIdentifier || typeof productIdentifier !== "string") {
      return res.status(400).send({ msg: "Missing product identifier" });
    }

    const productDoc = await productsCollectionRef.doc(productId).get();
    if (!productDoc.exists) {
      const updatedCartDoc = await cartCollectionRef.doc(cartId).update({
        items: admin.firestore.FieldValue.arrayRemove({ productId, productIdentifier }),
      });
      if (!updatedCartDoc) {
        return res.status(500).send({ msg: "Failed to remove item from cart" });
      }
      return res.status(200).send({ msg: "Product not found, item removed from cart" });
    }

    // Check if the item with the given productIdentifier and productId exists in the cart
    const cartItems = cartDoc.data().items;
    const itemIndex = cartItems.findIndex((item) => item.productId === productId && item.productIdentifier === productIdentifier);
    if (itemIndex === -1) {
      return res.status(404).send({ msg: "Item not found in the cart" });
    }

    // Remove the item from the cart
    cartItems.splice(itemIndex, 1);
    const updateCartItems = await cartCollectionRef.doc(cartId).update({ items: cartItems });
    if (!updateCartItems) {
      return res.status(500).send({ msg: "Failed to remove item from cart" });
    }

    // Recalculate the total price to properly update it for the removed items
    const updatedCartDoc = await cartCollectionRef.doc(cartId).get();
    const updatedCartItems = updatedCartDoc.data().items;
    const totalPrice = calculateTotalPrice(updatedCartItems);

    const updateTotalPrice = await cartCollectionRef.doc(cartId).update({ totalPrice });
    if (!updateTotalPrice) {
      return res.status(500).send({ msg: "Failed to update total price" });
    }

    return res.status(200).send({ msg: "Item removed from cart", totalPrice: totalPrice });
  } catch (error) {
    console.error(`DELETE CART ITEM ERROR [SERVER] ${error.message}`);
    return res.status(500).send({ msg: `DELETE CART ITEM ERROR [SERVER] ${error.message}` });
  }
};

// TODO: Upon checkout, the cart items will be cleared
const clearCartItems = async (cartId) => {
  const cartDoc = await cartCollectionRef.doc(cartId).get();
  if (!cartDoc.exists) {
    return false;
  }

  const updatedCartDoc = await cartCollectionRef.doc(cartId).update({ items: [] });
  if (!updatedCartDoc) {
    return false;
  }

  const updatedCartItems = await cartCollectionRef.doc(cartId).get();
  const totalPrice = calculateTotalPrice(updatedCartItems.data().items);

  const updateTotalPrice = await cartCollectionRef.doc(cartId).update({ totalPrice });
  if (!updateTotalPrice) {
    return false;
  }

  return true;
};

module.exports = {
  cartTestRouteServer, addToCartServer, updateCartItemQuantityServer, getUserCartServer, createCartServer, deleteCartItemServer, clearCartItems,
};
