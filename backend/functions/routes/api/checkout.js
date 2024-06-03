const router = require("express").Router();
require("dotenv").config();
const checkoutController = require("../../controllers/checkoutController");

router.get("/", checkoutController.checkoutTestRouteServer);
router.get("/:sessionId", checkoutController.getCheckoutSessionByIdServer);
router.get("/:sessionId/line_items", checkoutController.getSessionLineItemsServer);

// FIXME: This route is not working

router.post("/create-checkout-session", checkoutController.createStripeCheckoutSessionServer);

// NOTE: Not a webhook
router.post("/checkout-intent", checkoutController.createCheckoutIntentServer);
router.post("/create-checkout-status", checkoutController.checkCheckoutStatusServer);
router.post("/webhook", checkoutController.webhookEventHandler);

module.exports = router;
