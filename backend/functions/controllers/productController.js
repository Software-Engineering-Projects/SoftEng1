const admin = require("firebase-admin");
const db = admin.firestore();
const productsCollectionRef = db.collection("products");
const { productSchema, updateProductSchema } = require("../models/productModel");
const { productClickTrackerIncrement } = require("./reports/productReportController");
const { createCombination } = require("../scripts/createProductIdentifier");
// NOTE: All of these endpoints are working as expected, further test should still be made to ensure that the data is being stored and retrieved correctly.

// NOTE: To get a sample response from these API endpoints refer to the readme in the route directory
const productTestRouteServer = (_req, res, next) => {
  res.status(200).send({ msg: "Inside Products Route" });
};

// TODO: Add authentication middleware
const addNewProductServer = async (req, res, next) => {
  try {
    const { error, value } = productSchema.validate(req.body);

    if (error) {
      console.error(`VALIDATION ERROR: ${error.message}`);
      return res.status(400).send({ msg: `VALIDATION ERROR: ${error.message}` });
    } else {
      const product = {
        ...value,
      };

      productsCollectionRef.add(product).then((docRef) => {
        console.log("Document written with ID: ", docRef.id);
        createCombination(docRef.id);
        return res.status(201).send({ msg: "Product created successfully", data: product, id: docRef.id });
      }).catch((error) => {
        console.error("Error adding document: ", error);
        return res.status(400).send({ msg: `CREATE PRODUCT ERROR [SERVER] ${error.message}` });
      });
    }
  } catch (error) {
    return res.status(400).send({ msg: `CREATE PRODUCT ERROR [SERVER] ${error.message}` });
  }
};

const getAllProductsServer = async (_req, res, next) => {
  try {
    const querySnapshot = await productsCollectionRef.get();
    const response = [];
    querySnapshot.forEach((doc) => {
      const productData = {
        productId: doc.id,
        ...doc.data(),
      };
      response.push(productData);
    });
    res.status(200).send({ data: response });
  } catch (error) {
    console.error(`GET ALL PRODUCTS ERROR [SERVER] ${error.message}`);
    return res.status(400).send({ msg: `GET ALL PRODUCTS ERROR [SERVER] ${error.message}` });
  }
};


const getProductByIdServer = async (req, res, next) => {
  try {
    const id = req.params.productId;
    if (!id || typeof id !== "string") {
      return res.status(400).send({ msg: "Invalid ID parameter" });
    }
    const doc = await productsCollectionRef.doc(id).get();

    if (!doc.exists) {
      return res.status(404).send({ msg: `PRODUCT NOT FOUND [SERVER]` });
    } else {
      const response = {
        productId: doc.id,
        ...doc.data(),
      };

      // Map sizes and addons if they exist
      if (response.sizes) {
        response.sizes = response.sizes.map((size) => ({
          price: size.price,
          name: size.name,
        }));
      }
      if (response.addons) {
        response.addons = response.addons.map((addon) => ({
          name: addon.name,
          price: addon.price,
        }));
      }

      await productClickTrackerIncrement(id);
      return res.status(200).send({ data: response });
    }
  } catch (error) {
    console.error(`GET PRODUCT BY ID ERROR [SERVER] ${error.message}`);
    return res.status(400).send({ msg: `GET PRODUCT BY ID ERROR [SERVER] ${error.message}` });
  }
};


// TODO: Add authentication middleware
// TODO: Fork and fetch the current product details and update the fields that were changed only
const updateProductByIdServer = async (req, res, next) => {
  try {
    const id = req.params.productId;
    const doc = await productsCollectionRef.doc(id).get();
    const { error, value } = updateProductSchema.validate(req.body);
    if (!doc.exists) {
      return res.status(404).send({ msg: `PRODUCT NOT FOUND [SERVER]` });
    }
    if (error) {
      console.error(`VALIDATION ERROR: [UPDATE BY ID] ${error.message}`);
      return res.status(400).send({ msg: `VALIDATION ERROR: ${error.message}` });
    } else {
      productsCollectionRef.doc(id).update(value).then(() => {
        return res.status(201).send({ data: value });
      }).catch((error) => {
        console.error("Error updating document: ", error);
        return res.status(400).send({ msg: `UPDATE PRODUCT ERROR [SERVER] ${error.message}` });
      });
    }
  } catch (error) {
    return res.status(400).send({ msg: `UPDATE PRODUCT ERROR [SERVER] ${error.message}` });
  }
};


// TODO: Add authentication middleware
const deleteProductByIdServer = async (req, res, next) => {
  try {
    const id = req.params.productId;
    const doc = await productsCollectionRef.doc(id).get();

    if (!doc.exists) {
      return res.status(404).send({ msg: `PRODUCT NOT FOUND [SERVER]` });
    } else {
      const response = await productsCollectionRef.doc(id).delete();
      return res.status(200).send({ msg: `Product with ID:${id} deleted successfully`, data: response });
    }
  } catch (error) {
    console.log(`DELETE PRODUCT ERROR [SERVER] ${error.message}`);
    return res.status(400).send({ msg: `DELETE PRODUCT ERROR [SERVER] ${error.message}` });
  }
};

module.exports = {
  getAllProductsServer, addNewProductServer, productTestRouteServer, getProductByIdServer, updateProductByIdServer, deleteProductByIdServer,
};
