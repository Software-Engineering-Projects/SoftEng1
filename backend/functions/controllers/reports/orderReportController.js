const admin = require("firebase-admin");
const db = admin.firestore();
const orderCollectionRef = db.collection("orders");

const fetchOrdersByStatus = async (status) => {
  const orders = await orderCollectionRef.where("status", "==", status).get();
  const completedOrders = orders.docs.map((order) => order.data());
  return completedOrders;
};
const orderStatusList = [
  "pending", "confirmed", "shipped", "delivered", "cancelled",
];

const orderStatusReportServer = async (req, res) => {
  try {
    const { status } = req.query;

    if (!status) {
      return res.status(400).send({

        msg: "Order status is required.",
      });
    }
    if (!orderStatusList.includes(status)) {
      return res.status(400).send({

        msg: `Invalid order status: ${status}`,
      });
    }
    const orders = await fetchOrdersByStatus(status);
    const ordersLength = orders.length;

    return res.status(200).send({ length: ordersLength, orderStatus: status });
  } catch (error) {
    console.error(`ORDERS REPORT ERROR [SERVER] ${error.message}`);
    return res.status(500).send({

      msg: "ORDERS REPORT ERROR [SERVER]",
    });
  }
};

module.exports = {
  orderStatusReportServer,
};
