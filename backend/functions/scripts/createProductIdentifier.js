const { app } = require("../index.js");
const admin = require("firebase-admin");
const db = admin.firestore();

// NOTE: Just testing this so i created the firebase instance here
// TODO: This will automatically run for any new product that is created and will be used to verify if the given product identifier of the product actually exists

const createProductIdentifier = (options) => {
  let identifiers = [];
  for (let option of options) {
    option = option.replace(/\s+/g, "-");
    identifiers.push(option);
  }
  return identifiers.join("-").toLowerCase();
};

const generateIdentifiers = (sizes, addons) => {
  let combinations = {};
  for (let size of sizes) {
    const identifier = createProductIdentifier([size.name]);
    combinations[identifier] = { size };
    console.log(`Generated combination sizes only: ${identifier}`);
    // Since sizes is required per the flow
  }
  for (let size of sizes) {
    for (let addon of addons) {
      const identifier = createProductIdentifier([size.name, addon.name]);
      combinations[identifier] = { size, addon };
      console.log(`Generated combination addons and sizes: ${identifier}`);
    }
  }
  return combinations;
};

const createCombination = (async (productId) => {
  // NOTE: Hardcoded for testing purposes for now
  productId = "yuZWfIavgJV6FoIkaA0s";// The productId you"re working with

  const productRef = db.collection("products").doc(productId);
  const productCombinationsRef = db.collection("product_identifiers").doc(productId);

  try {
    const doc = await productRef.get();
    if (doc.exists) {
      const productData = doc.data();
      const sizes = productData.sizes;
      const addons = productData.addons;

      // Check if the productCombinations document already exists
      const productCombinationsDoc = await productCombinationsRef.get();
      if (!productCombinationsDoc.exists) {
        const combinations = generateIdentifiers(sizes, addons);

        // Create a new document in the productCombinations collection with the generated combinations
        await productCombinationsRef.set({ productId, combinations });
        console.log("Done scripting.");
      } else {
        console.log("Product identifiers already exist for this product.");
      }
    } else {
      console.log("No such document!");
    }
  } catch (error) {
    console.log("Error getting document:", error);
  }

  process.exit();
})();

module.exports = {
  createCombination,
};
