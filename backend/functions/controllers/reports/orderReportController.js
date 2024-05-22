const admin = require("firebase-admin");
const db = admin.firestore();
const orderCollectionRef = db.collection("orders");

const fetchOrdersByStatuses = async (statuses) => {
  const ordersByStatus = {};
  for (let status of statuses) {
    const orders = await orderCollectionRef.where("status", "==", status).get();
    const completedOrders = orders.docs.map((order) => order.data());
    ordersByStatus[status] = completedOrders.length;
  }
  return ordersByStatus;
};
const orderStatusList = [
  "pending", "confirmed", "shipped", "delivered", "cancelled",
];

const orderStatusReportServer = async (req, res) => {
  try {
    const { statuses } = req.query;

    if (!statuses || !Array.isArray(statuses)) {
      return res.status(400).send({
        msg: "Order statuses are required and should be an array.",
      });
    }

    const invalidStatuses = statuses.filter((status) => !orderStatusList.includes(status));
    if (invalidStatuses.length > 0) {
      return res.status(400).send({
        msg: `Invalid order statuses: ${invalidStatuses.join(", ")}`,
      });
    }

    const orders = await fetchOrdersByStatuses(statuses);

    return res.status(200).send({ orders });
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
