const admin = require("firebase-admin");
const db = admin.firestore();
const auth = admin.auth();
const cartCollectionRef = db.collection("cart");

const isCartOwner = async (cartId, userId) => {
  try {
    const user = await auth.getUser(userId);

    const cartSnapshot = await cartCollectionRef.doc(cartId).get();

    if (!user || !cartSnapshot.exists) {
      console.error("User or cart does not exist");
      return false;
    }

    const cartData = cartSnapshot.data();

    return cartData.userId === userId;
  } catch (error) {
    console.error(`IS CART OWNER ERROR [SERVER]: ${error.message}`);
    return false;
  }
};

module.exports = isCartOwner;
