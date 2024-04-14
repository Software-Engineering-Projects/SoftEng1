const admin = require("firebase-admin");
const realtimeDb = admin.database();
const productReportsRef = realtimeDb.ref("product_reports");
const productRef = admin.firestore().collection("products");

const productsFetched = 3;

const productClickTrackerIncrement = async (productId) => {
  try {
    const productSearchCountRef = productReportsRef.child("product_count_data");
    const productRef = productSearchCountRef.child(productId);
    // Increment the count for the specified product.
    await productRef.transaction((currentCount) => {
      return (currentCount || 0) + 1;
    });
  } catch (error) {
    console.error(`PRODUCT INCREMENT ERROR: ${error.message}`);
    throw error;
  }
};

// const getProductDetails = async (productId) => {
//   try {
//     const productSnapshot = await productRef.doc(productId).get();
//     return productSnapshot.data();
//   } catch (error) {
//     console.error(`GET PRODUCT DETAILS ERROR: ${error.message}`);
//     throw error;
//   }
// };

const getMostTrendingProducts = async () => {
  try {
    const snapshot = await productReportsRef.child("product_count_data").once("value");
    const productCounts = snapshot.val();

    // Create an array of products with their search counts.
    const productsWithCounts = Object.keys(productCounts).map((productId) => ({
      id: productId,
      searchCount: productCounts[productId] || 0,
    }));

    // Sort the array by search count in descending order.
    productsWithCounts.sort((a, b) => b.searchCount - a.searchCount);

    // Fetch the product details for the top trending products.
    const trendingProductDetails = await Promise.all(
      productsWithCounts.slice(0, productsFetched).map(async (product) => ({
        // ...await getProductDetails(product.id),
        searchCount: product.searchCount, productId: product.id,
      })),
    );

    return trendingProductDetails;
  } catch (error) {
    console.error(`GET TRENDING PRODUCTS ERROR: ${error.message}`);
    throw error;
  }
};

const trendingProductsReportServer = async (_req, res, next) => {
  try {
    const data = await getMostTrendingProducts();
    return res.status(200).send({ data: data });
  } catch (error) {
    console.error(`TRENDING PRODUCTS REPORT ERROR [SERVER] ${error.message}`);
    return res.status(500).send({

      msg: "TRENDING PRODUCTS REPORT ERROR [SERVER]",
      error: error.message,
    });
  }
};

module.exports = {
  trendingProductsReportServer,
  productClickTrackerIncrement,
};
