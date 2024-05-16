const router = require("express").Router();
const cartController = require("../../controllers/cartController");
// const { checkIfLoggedIn } = require("../../middleware/users/sessions/checkIfLoggedIn");

router.get("/", cartController.cartTestRouteServer);
router.get("/:userId", cartController.getUserCartServer);

router.post("/create/:userId", cartController.createCartServer);
router.post("/add/:cartId", cartController.addToCartServer);
router.post("/clear/:cartId", cartController.clearCartItems);

router.patch("/update/:cartId/:productId", cartController.updateCartItemQuantityServer);
// TODO: This will be invoked upon changing product options, i.e change size, addons, etc.
// router.patch("/update/:cartId/:productId", cartController.changeCartItemServer);

router.delete("/delete/:cartId/:productId", cartController.deleteCartItemServer);

module.exports = router;
