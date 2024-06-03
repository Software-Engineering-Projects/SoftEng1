const admin = require("firebase-admin");
const db = admin.firestore();
const cartCollectionRef = db.collection("cart");
const productsCollectionRef = db.collection("products");
const { cartSchema, createCartSchema } = require("../models/cartModel");

const cartTestRouteServer = (_req, res, next) => {
  return res.send("Inside the cart router");
};

const calculateTotalPrice = (items) => {
  const totalPrice = items.reduce((total, item) => {
    const { productPrice, productQuantity } = item;
    if (typeof productPrice === "number" && typeof productQuantity === "number") {
      return total + productPrice * productQuantity;
    }
    return total;
  }, 0);
  return Number(totalPrice.toFixed(2));
};

// REVIEW: This finally adds products with same id's and identifiers
// TODO: Add the product name to the cart items
const addToCartServer = async (req, res) => {
  const { cartId } = req.params;
  const { items } = req.body;

  if (!cartId || !items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).send({ msg: "Invalid or missing parameters" });
  }

  try {
    const cartDoc = await cartCollectionRef.doc(cartId).get();

    if (!cartDoc.exists) {
      return res.status(404).send({ msg: "Cart not found" });
    }

    const productIds = items.map((item) => item.productId);
    const productDocs = await Promise.all(productIds.map((productId) => productsCollectionRef.doc(productId).get()));

    if (!productDocs.every((doc) => doc.exists)) {
      return res.status(404).send({ msg: "One or more products do not exist" });
    }

    const existingItems = cartDoc.data().items || [];

    const newItems = items.map((item) => {
      const productDoc = productDocs.find((doc) => doc.id === item.productId);
      const productData = productDoc.data();

      const imageUrl = productData.imageUrl;
      const productName = productData.productName;

      const productSize = productData.sizes.find((size) => size.name === item.productSize);
      if (!productSize) {
        throw new Error(`Size ${item.productSize} not found for product ${item.productId}`);
      }

      const productAddons = item.productAddons.map((addonName) => {
        const addon = productData.addons.find((addon) => addon.name === addonName);
        if (!addon) {
          throw new Error(`Addon ${addonName} not found for product ${item.productId}`);
        }
        return addon;
      });

      const productPrice = productData.basePrice + productSize.price + productAddons.reduce((total, addon) => total + addon.price, 0);

      const sortedAddonNames = productAddons.map((addon) => addon.name).sort();
      const productIdentifier = `${item.productId}-${productSize.name}-${sortedAddonNames.join("-")}`;

      return {
        productId: item.productId,
        imageUrl: imageUrl,
        productName,
        productSize: productSize.name,
        productAddons: productAddons.map((addon) => addon.name),
        productIdentifier: productIdentifier,
        productQuantity: item.productQuantity,
        productPrice: productPrice,
      };
    });

    const finalItems = [...existingItems];
    newItems.forEach((newItem) => {
      const existingItem = finalItems.find((item) => item.productIdentifier === newItem.productIdentifier);
      if (existingItem) {
        existingItem.productQuantity += newItem.productQuantity;
      } else {
        finalItems.push(newItem);
      }
    });

    const totalPrice = calculateTotalPrice(finalItems);

    const cart = {
      ...req.body,
      userId: cartDoc.data().userId,
      items: finalItems,
      totalPrice: parseFloat(totalPrice.toFixed(2)),
      cartId: cartId,
    };

    const { error } = cartSchema.validate(cart);
    if (error) {
      console.error(`VALIDATION ERROR: ${error.message}`);
      return res.status(400).send({ msg: `VALIDATION ERROR: ${error.message}` });
    }

    await cartCollectionRef.doc(cartId).set(cart, { merge: true });

    return res.status(200).send({ data: cart });
  } catch (error) {
    console.error(`ADD TO CART ERROR [SERVER] ${error.message}`);
    return res.status(500).send({ msg: `ADD TO CART ERROR [SERVER] ${error.message}` });
  }
};

// NOTE: This just allow for product quantity to be updated, the product identifier and options will be added later
const updateCartItemQuantityServer = async (req, res, next) => {
  const { cartId, productId } = req.params;
  const { productIdentifier, productQuantity } = req.body;

  // Validate inputs
  if (!cartId || !productId || !productIdentifier || !Number.isInteger(productQuantity) || productQuantity <= 0) {
    return res.status(400).send({ msg: "Invalid or missing parameters" });
  }

  try {
    const cartDoc = await cartCollectionRef.doc(cartId).get();

    // Check if the cart exists
    if (!cartDoc.exists) {
      return res.status(404).send({ msg: "Cart not found" });
    }

    const productDoc = await productsCollectionRef.doc(productId).get();

    // Check if the product exists
    if (!productDoc.exists) {
      await cartCollectionRef.doc(cartId).update({
        items: admin.firestore.FieldValue.arrayRemove({ productId, productIdentifier }),
      });
      return res.status(200).send({ msg: "Product not found, item removed from cart" });
    }

    const cartItems = cartDoc.data().items;
    const itemIndex = cartItems.findIndex((item) => item.productId === productId && item.productIdentifier === productIdentifier);

    // Check if the item exists in the cart
    if (itemIndex === -1) {
      return res.status(404).send({ msg: "Item not found in the cart" });
    }

    // Update the quantity of the item
    cartItems[itemIndex].productQuantity = productQuantity;

    // Calculate total price
    const totalPrice = calculateTotalPrice(cartItems);

    // Update cart items and total price in a single transaction
    await cartCollectionRef.doc(cartId).update({
      items: cartItems,
      totalPrice: totalPrice,
    });

    return res.status(200).send({ msg: "Cart item quantity updated", productQuantity: productQuantity, totalPrice: totalPrice });
  } catch (error) {
    console.error(`UPDATE CART ITEM QUANTITY ERROR [SERVER] ${error.message}`);
    return res.status(500).send({ msg: `UPDATE CART ITEM QUANTITY ERROR [SERVER] ${error.message}` });
  }
};

// TODO: Add middleware to check for the owner of the cart or admin, if not the user cannot view that cart
// NOTE: There is already a helper function check for the cart owner
// TODO: Will just change so this can just fetch using the user id
const getUserCartServer = async (req, res, next) => {
  const { userId } = req.params;
  try {
    if (!userId || typeof userId !== "string") {
      return res.status(400).json({ msg: "Invalid ID parameter" });
    }

    const userCartRef = await cartCollectionRef.where("userId", "==", userId).limit(1).get();
    if (userCartRef.empty) {
      return res.status(404).json({ msg: "CART NOT FOUND [SERVER]" });
    }

    const doc = userCartRef.docs[0];
    const { items } = doc.data();

    if (!Array.isArray(items)) {
      return res.status(400).json({ msg: "Invalid items array in cart data" });
    }

    const totalPrice = calculateTotalPrice(items);
    if (typeof totalPrice !== "number" || isNaN(totalPrice)) {
      return res.status(400).json({ msg: "Invalid total price in cart data" });
    }

    const { error, value } = cartSchema.validate({
      items, userId, totalPrice, cartId: doc.id,
    });
    if (error) {
      console.error(`VALIDATION ERROR: ${error.message}`);
      return res.status(400).json({ msg: `VALIDATION ERROR: ${error.message}` });
    }

    const response = {
      ...value,
      length: items.length || 0,
    };

    return res.status(200).json({ data: response });
  } catch (error) {
    console.error(`GET USER CART BY ID ERROR [SERVER] ${error.message}`);
    return res.status(500).json({ msg: `Internal server error` });
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
      return res.status(409).json({ msg: "User already has a cart", cartId });
    }

    const items = [];
    const { error, value } = createCartSchema.validate({ ...req.body, userId, items });
    if (error) {
      console.error(`VALIDATION ERROR: ${error.message}`);
      return res.status(400).json({ msg: `VALIDATION ERROR: ${error.message}` });
    }

    const cartRef = await cartCollectionRef.add(value);
    if (!cartRef.id) {
      return res.status(500).json({ msg: "Failed to create cart" });
    }

    return res.status(200).json({ msg: "Cart created successfully", data: value, cartId: cartRef.id });
  } catch (error) {
    console.error(`ERROR CREATE CART [SERVER]: ${error.message}`);
    return res.status(500).json({ msg: `ERROR CREATE CART [SERVER]: ${error.message}` });
  }
};

const deleteCartItemServer = async (req, res, next) => {
  const { cartId, productId } = req.params;
  const { productIdentifier } = req.body;

  if (!cartId || !productId || !productIdentifier) {
    return res.status(400).send({ msg: "Missing or invalid parameters" });
  }

  try {
    const cartDoc = await cartCollectionRef.doc(cartId).get();

    if (!cartDoc.exists) {
      return res.status(404).send({ msg: "Cart not found" });
    }

    const cartItems = cartDoc.data().items;
    const itemIndex = cartItems.findIndex((item) => item.productId === productId && item.productIdentifier === productIdentifier);

    if (itemIndex === -1) {
      return res.status(404).send({ msg: "Item not found in the cart" });
    }

    cartItems.splice(itemIndex, 1);
    const totalPrice = calculateTotalPrice(cartItems);

    const updateCart = await cartCollectionRef.doc(cartId).update({
      items: cartItems,
      totalPrice: totalPrice,
    });

    if (!updateCart) {
      return res.status(500).send({ msg: "Failed to remove item from cart and update total price" });
    }

    return res.status(200).send({ msg: "Item removed from cart", totalPrice: totalPrice });
  } catch (error) {
    console.error(`DELETE CART ITEM ERROR [SERVER] ${error.message}`);
    return res.status(500).send({ msg: `DELETE CART ITEM ERROR [SERVER] ${error.message}` });
  }
};

// TODO: Upon checkout, the cart items will be cleared
// TODO: This can be assigned to alongside the redux action to clear the cart items
const clearCartItems = async (req, res, next) => {
  const cartId = req.params.cartId;
  try {
    const cartDoc = await cartCollectionRef.doc(cartId).get();
    if (!cartDoc.exists) {
      return res.status(404).send({ msg: "Cart not found" });
    }

    const updatedCartDoc = await cartCollectionRef.doc(cartId).update({
      items: [],
      totalPrice: 0,
    });

    if (!updatedCartDoc) {
      return res.status(500).send({ msg: "Failed to clear cart items" });
    }

    return res.status(200).send({ msg: "Cart items cleared", totalPrice: 0 });
  } catch (error) {
    console.error(`CLEAR CART ITEMS ERROR [SERVER] ${error.message}`);
    return res.status(500).send({ msg: `CLEAR CART ITEMS ERROR [SERVER] ${error.message}` });
  }
};

module.exports = {
  cartTestRouteServer, addToCartServer, updateCartItemQuantityServer, getUserCartServer, createCartServer, deleteCartItemServer, clearCartItems,
};
