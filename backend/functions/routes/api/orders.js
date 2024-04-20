const router = require("express").Router();
const orderController = require("../../controllers/orderController");
const { checkAdminRole } = require("../../middleware/roles/adminMiddlewareProducts");

router.get("/", orderController.orderTestRouteServer);
router.get("/all", orderController.getAllOrdersServer);
router.get("/:orderId", orderController.getOrderByIdServer);
router.get("/view/:userId", orderController.viewCustomerOrders);

router.post("/create", checkAdminRole, orderController.createOrderServer);

router.patch("/update/:orderId", orderController.updateOrderStatusServer);

module.exports = router;
