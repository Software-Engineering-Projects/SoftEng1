const router = require("express").Router();
const orderController = require("../../controllers/orderController");
const { checkAdminRole } = require("../../middleware/roles/adminMiddlewareProducts");

router.get("/", orderController.orderTestRouteServer);
router.get("/all", checkAdminRole, orderController.getAllOrdersServer);
router.get("/:orderId", checkAdminRole, orderController.getOrderByIdServer);

router.post("/create", checkAdminRole, orderController.createOrderServer);

router.patch("/update/:orderId", orderController.updateOrderStatusServer);

module.exports = router;
