const admin = require("firebase-admin");
const db = admin.firestore();
const orderCollectionRef = db.collection("orders");
const { orderSchema } = require("../models/orderModel");

// TODO: Add Joi for validation

const orderTestRouteServer = (_req, res, next) => {
  return res.send("Inside the orders router");
};

// TODO:
const getAllOrdersServer = async (_req, res, next) => {
  try {
    const querySnapshot = await db.collection("orders").get();

    const response = querySnapshot.docs.map((doc) => {
      return { id: doc.id, ...doc.data() };
    });

    return res.status(200).send({ success: true, data: response });
  } catch (error) {
    return res.status(400).send({ success: false, msg: `GET ALL ORDERS ERROR [SERVER] ${error.message}` });
  }
};

// TODO:
const createOrderServer = async (req, res) => {
  const userId = req.params.userId;

  try {
    const { id, cartId } = req.body;

    const newOrder = await db.collection("orders").add({
      id,
      cartId,
      userId,
      status: "pending",
    });

    return res.status(200).send({ success: true, data: newOrder });
  } catch (error) {
    return res.status(400).send({ success: false, msg: `CREATE ORDER ERROR [SERVER] ${error.message}` });
  }
};

const updateOrderStatusServer = async (req, res, next) => {
  const orderId = req.params.orderId;

  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).send({ success: false, msg: "Status is required" });
    }
// TODO: Reference this from Joi from the order models schema
    const allowedStatus = ["pending", "confirmed", "shipped", "delivered", "cancelled"];

    if (!allowedStatus.includes(status)) {
      return res.status(400).send({ success: false, msg: "Invalid status" });
    }

    await db.collection("orders").doc(orderId).update({
      status,
    });

    return res.status(200).send({ success: true, msg: "Order status updated successfully", data: order });
  } catch (error) {
    return res.status(400).send({ success: false, msg: `UPDATE ORDER STATUS ERROR [SERVER] ${error.message}` });
  }
};


// TODO:
const getOrderByIdServer = async (req, res, next) => {
  const orderId = req.params.orderId;

  try {
    const order = await db.collection("orders").doc(orderId).get();

    if (!order.exists) {
      return res.status(404).send({ success: false, msg: "Order not found" });
    }

    return res.status(200).send({ success: true, data: order.data() });
  } catch (error) {
    return res.status(200).send({ success: true, msg: `GET ORDER BY ID ERROR [SERVER] ${error.message}` });
  }
};

/**
 * This will be where the order api endpoints will go
 * Update orders(status, details, etc)
 *  Get orders
 * Get all orders
 * Get order by id, users, etc
 */

module.exports = {
  orderTestRouteServer, getAllOrdersServer, createOrderServer, updateOrderStatusServer, getOrderByIdServer,
};
