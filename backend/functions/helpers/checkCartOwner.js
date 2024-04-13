const admin = require("firebase-admin");
const db = admin.firestore();

const isCartOwner = async (cartId, userId) => {
  try {
    const cart = await db.collection("carts").doc(cartId).get();

    if (!cart.exists) {
      return false;
    }

    return cart.data().userId === userId;
  } catch (error) {
    console.error(`IS CART OWNER ERROR [SERVER] ${error.message}`);
    return false;
  }
};

module.exports = isCartOwner;
