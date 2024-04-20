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
    const querySnapshot = await orderCollectionRef.get();

    const response = querySnapshot.docs.map((doc) => {
      return { id: doc.id, ...doc.data() };
    });

    return res.status(200).send({ data: response });
  } catch (error) {
    return res.status(400).send({ msg: `GET ALL ORDERS ERROR [SERVER] ${error.message}` });
  }
};

// TODO:
const createOrderServer = async (req, res) => {
  const userId = req.params.userId;

  try {
    const { id, cartId } = req.body;

    const newOrder = await orderCollectionRef.add({
      id,
      cartId,
      userId,
      status: "pending",
    });

    return res.status(200).send({ data: newOrder });
  } catch (error) {
    return res.status(400).send({ msg: `CREATE ORDER ERROR [SERVER] ${error.message}` });
  }
};

// TODO:
const updateOrderStatusServer = async (req, res, next) => {
  const orderId = req.params.orderId;

  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).send({ msg: "Status is required" });
    }
    // TODO: Reference this from Joi from the order models schema
    const allowedStatus = ["pending", "confirmed", "shipped", "delivered", "cancelled"];

    if (!allowedStatus.includes(status)) {
      return res.status(400).send({ msg: "Invalid status" });
    }

    const orderRef = orderCollectionRef.doc(orderId);
    const order = await orderRef.get();

    if (!order.exists) {
      return res.status(404).send({ msg: "Order not found" });
    }

    const currentStatus = order.data().status;

    if (currentStatus === status) {
      return res.status(400).send({ msg: "Order status is already the same" });
    }

    await orderRef.update({
      status,
    });

    return res.status(200).send({ msg: "Order status updated successfully", data: order.data() });
  } catch (error) {
    return res.status(400).send({ msg: `UPDATE ORDER STATUS ERROR [SERVER] ${error.message}` });
  }
};
// NOTE: Now fetches all the orders of a given user not just a single order as that is already given by the getOrderById
const viewCustomerOrders = async (req, res, next) => {
  const userId = req.params.userId;

  try {
    const orders = await orderCollectionRef.where("userId", "==", userId).get();

    if (orders.empty) {
      return res.status(404).send({ msg: "No orders found for this user" });
    }

    const ordersData = orders.docs.map((doc) => doc.data());

    return res.status(200).send({ data: ordersData });
  } catch (error) {
    return res.status(400).send({ msg: `VIEW ORDERS ERROR [SERVER] ${error.message}` });
  }
};

const getOrderByIdServer = async (req, res, next) => {
  const orderId = req.params.orderId;

  try {
    const order = await orderCollectionRef.doc(orderId).get();

    if (!order.exists) {
      return res.status(404).send({ msg: "Order not found" });
    }

    return res.status(200).send({ data: order.data() });
  } catch (error) {
    return res.status(200).send({ msg: `GET ORDER BY ID ERROR [SERVER] ${error.message}` });
  }
};

module.exports = {
  orderTestRouteServer,
  getAllOrdersServer,
  createOrderServer,
  updateOrderStatusServer,
  viewCustomerOrders,
  getOrderByIdServer,
};
