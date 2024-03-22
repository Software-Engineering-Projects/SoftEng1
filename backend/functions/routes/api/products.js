const router = require("express").Router();

const productController = require("../../controllers/productController");
const { checkAdminRole } = require("../../middleware/roles/adminMiddlewareProducts");

router.get("/", productController.productTestRouteServer);
router.post("/create", checkAdminRole, productController.addNewProductServer);
router.get("/all", productController.getAllProductsServer);
router.get("/:productId", productController.getProductByIdServer);
// TODO:
router.patch("/update/:productId", checkAdminRole, productController.updateProductByIdServer);
router.delete("/delete/:productId", checkAdminRole, productController.deleteProductByIdServer);

module.exports = router;
