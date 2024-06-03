const admin = require("firebase-admin");
const db = admin.firestore();
const realtimeDb = admin.database();

require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SECRET);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

const cartCollectionRef = db.collection("cart");
const orderCollectionRef = db.collection("orders");
const checkoutSessionSchema = require("../models/checkoutModel");
const Joi = require("joi");
const orderSchema = require("../models/orderModel");
const isCartOwner = require("../helpers/checkCartOwner");
const clearCartItems = require("../controllers/cartController").clearCartItems;

// TODO: Create a checkout function that will handle the payment intent
// TODO: Create a createCheckoutSession function that will handle the checkout session
// TODO: Create a function that will handle the webhook for the checkout session
// TODO: Create a function that will handle the webhook for the payment intent
// TODO: Create a function that will handle the webhook for the payment method

const checkoutTestRouteServer = (_req, res, next) => {
  return res.send("Inside the checkout router");
};

const webhookEventHandler = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  const rawBody = req.rawBody;
  let event = {};

  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, endpointSecret);
  } catch (error) {
    console.error(`Webhook Error: ${error.message}`);
    return res.status(400).send(`Webhook Error: ${error.message}`);
  }

  try {
    switch (event.type) {
      case "charge.succeeded":
        event.charge = event.data.object;
        await realtimeDb.ref("charges_webhook").child(event.charge.id).set({
          chargeId: event.charge.id,
          amount: event.charge.amount,
        });
        // console.log(event.charge.receipt_email, "Your payment was successful", "Here is your receipt");
        break;
      case "payment_intent.created":
        event.paymentIntent = event.data.object;
        await realtimeDb.ref("payment_intents_webhook").child(event.paymentIntent.id).set({
          paymentIntentId: event.paymentIntent.id,
          amount: event.paymentIntent.amount,
        });
        // console.log(event.paymentIntent.receipt_email, "Your payment is being processed", "We will notify you once your payment is confirmed");
        break;
      case "charge.failed":
        event.charge = event.data.object;
        await realtimeDb.ref("charges_webhook").child(event.charge.id).update({
          chargeStatus: event.charge.status,
          paid: false,
        });
        console.log(event.charge.receipt_email, "Your payment failed", "Please try again or contact us for support");
        break;
      case "payment_intent.succeeded":
        event.paymentIntent = event.data.object;
        await realtimeDb.ref("payment_intents_webhook").child(event.paymentIntent.id).update({
          paymentStatus: event.paymentIntent.status,
          paid: event.paymentIntent.status === "succeeded",
        });
        break;
      case "payment_intent.canceled":
        event.paymentIntent = event.data.object;
        break;
      case "payment_intent.payment_failed":
        event.failedPaymentIntent = event.data.object;
        await realtimeDb.ref("payment_intents_webhook").child(event.failedPaymentIntent.id).update({
          paymentStatus: event.failedPaymentIntent.status,
          paid: false,
        });
        break;
      case "product.created":
        break;
      case "price.created":
        break;
      // TODO: Validate this based on the order schema, and then create the order, and also verify the checkout schema
      case "checkout.session.completed":
        const session = event.data.object;
        console.log("Checkout session completed", session.id, session.payment_status);
        // TODO: Don't know if this is workign properly, need to test
        clearCartItems(session.metadata.userId);
        if (session.payment_status !== "paid") {
          console.log("Checkout session is not paid.");
          res.status(409).send({ msg: "Checkout session is not paid" });
          return;
        }

        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.status(200).send({ received: true, event });
  } catch (error) {
    console.error("Error processing webhook event:", error.message);
    return res.status(500).send({ msg: `Error processing webhook event[SERVER] ${error.message}` });
  }
};

// TODO:
// TODO: Assign the total price to the payment intent, based on the cart doc
// TODO: Expire the checkout session if the amount given is exactly the same as the total price, which means the payment intent is successful, too avoid creating a payment intent for the same checkout session
// FIXME: "status": "requires_payment_method", FROM THE RESPONSE BODY OF THE PAYMENT INTENT
// FIXME: If the payment intent is successful, then the checkout session is successful, and must be updated for the stripe api as well as the realtime database
// FIXME: Upon updating the checkout session payment_status successfully to "paid", the payment intent must be updated as well
// FIXME: Disable the checkout session if the payment intent is successful, to avoid creating a payment intent for the same checkout session
// NOTE: This will be not be needed test with the given url from the checkout session object
// FIXME: A payment intent is created but since the status is not a part of paymentIntent object apparently(it should be don't know why its not working), i cant update the payment intent status to "succeeded", to match the checkout session status, tf?! for now i can just use the checkout session url to checkout
const createPaymentIntent = async (amount) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: "usd",
    });
    return paymentIntent;
  } catch (error) {
    console.error(`Error creating payment intent: ${error.message}`);
    throw error;
  }
};

const chargePaymentIntent = async (paymentIntentId) => {
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    if (paymentIntent.amount < paymentIntent.amount_received) {
      throw new Error("Not enough funds");
    }
    // NOTE: The status is apparently only read-only and cannot be updated, so i can't update the status to "succeeded" to match the checkout session status, which can cause some false positives, so just use the checkout session url to checkout
    // await stripe.paymentIntents.update(paymentIntentId, {
    //   status: "succeeded",
    // });
    return paymentIntent;
  } catch (error) {
    console.error(`Error charging payment intent[SERVER]: ${error.message}`);
    throw error;
  }
};

// NOTE: I can't seem to allow stripe to create a payment intent and update it's status since its only read-only, i will just use the checkout session url to checkout, and the check for if the given checkout session is paid for will be checked in the realtime database not the stripe api, this will be fixed later
const createCheckoutIntentServer = async (req, res) => {
  const { sessionId, totalPrice } = req.body;

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (!session) {
      res.status(404).send({ msg: "Checkout session not found" });
      return;
    }

    if (session.payment_status === "paid") {
      res.status(409).send({ id: session.payment_intent, msg: "Checkout session is already paid for" });
      return;
    }

    const customerId = session.customer;
    const customer = await stripe.customers.retrieve(customerId);

    if (!customer) {
      res.status(404).send({ msg: "Customer not found" });
      return;
    }

    const { customer_email, name } = customer;

    if (totalPrice >= session.amount_total) {
      const paymentIntent = await createPaymentIntent(totalPrice);

      if (!paymentIntent) {
        res.status(500).send({ msg: "Failed to create payment intent" });
        return;
      }

      await chargePaymentIntent(paymentIntent.id);

      const sessionRef = realtimeDb.ref().child(`checkout_sessions/${sessionId}`);
      const sessionSnapshot = await sessionRef.once("value");
      const sessionData = sessionSnapshot.val();

      if (sessionData && sessionData.session && sessionData.session.payment_status === "paid") {
        res.status(409).send({ id: paymentIntent.id, msg: "Checkout session is already paid for" });
        return;
      }

      await sessionRef.set({
        session: {
          payment_status: "paid",
          id: session.id,
        },
        paymentIntent: {
          id: paymentIntent.id,
          amount: paymentIntent.amount,
          currency: paymentIntent.currency,
          metadata: paymentIntent.metadata,
        },
      });

      res.status(200).send({ id: paymentIntent.id });
    } else {
      res.status(400).send({ msg: "Not enough funds" });
    }

  } catch (error) {
    console.error(`Error creating checkout payment intent: ${error.message}`);
    res.status(500).send(error.message);
  }
};

// TODO: Assign the total price to the checkout session, based on the cart doc, and the items, majority of the items from the request body must come from the session object
// TODO: Complete the check from the checkoutSchema
// TODO: Create cart middleware to check if the user is the owner of the cart
// TODO: Fix the customer fields to be included properly in the checkout session object
// NOTE: To complete the checkout session just taking url from the response body of the checkout session object, then checking out via that url
// TODO: Just checkout for the cart owner instead of assigning the userId directly to the checkout session object, this will be done later
// NOTE: Creating 2 separate calls to the realtime database and stripe's api to create a checkout session, and then updating the checkout session in the realtime database and stripe's api with the same data might slow things down, this will be changed later
// REVIEW: Check for an existing session that is unpaid, and if it is unpaid, then return that session and persist it, if not create a new session
// FIXME: There are some issues with the header values
// ">  Error creating or retrieving checkout session: Cannot set headers after they are sent to the client"
// TODO: Make it so that the user id is no longer needed, and the cart id is the only thing needed to create a checkout session

// TODO: Create a checkout session using the stripe api, and then return the url to the client
// TODO: Assign the correct values to the checkout session object
const createStripeCheckoutSessionServer = async (req, res) => {
  const { cartId, userId } = req.body;

  if (!userId || !cartId) {
    return res.status(400).send({ msg: "User ID and Cart ID are required" });
  }

  if (!isCartOwner(cartId, userId)) {
    return res.status(403).send({ msg: "Unauthorized" });
  }

  try {
    const user = await admin.auth().getUser(userId);
    if (!user) {
      return res.status(404).send({ msg: `User not found for ID: ${userId}` });
    }

    const cartDoc = await cartCollectionRef.doc(cartId).get();
    if (!cartDoc.exists) {
      return res.status(404).send({ msg: `Cart not found for ID: ${cartId}` });
    }

    const cartData = cartDoc.data();
    if (!cartData.items || !Array.isArray(cartData.items) || cartData.items.length === 0) {
      return res.status(400).send({ msg: "Cart is empty" });
    }

    const customerName = user.providerData[0]?.displayName || user.email;
    req.body.customerName = customerName;

    const { error, value } = checkoutSessionSchema.validate(req.body);
    if (error) {
      console.error(`Validation error: ${error.message}`);
      return res.status(400).send({ msg: error.message });
    }

    let customer;
    const existingCustomers = await stripe.customers.list({ email: value.customerEmail, limit: 1 });

    if (existingCustomers.data.length > 0) {
      customer = existingCustomers.data[0];
    } else {
      customer = await stripe.customers.create({
        email: value.customerEmail,
        name: customerName,
      });
    }

    const lineItems = cartDoc.data().items.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.productIdentifier,
          description: item.productAddons.join(", "),
        },
        unit_amount: Math.round(item.productPrice * 100),
      },
      quantity: item.productQuantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.APP_URL}/checkout/success`,
      cancel_url: `${process.env.APP_URL}/checkout/cancel`,
    });

    res.status(200).send({ url: session.url });

  } catch (error) {
    console.error("Checkout failed:", error);
    res.status(500).send({ msg: error.message });
  }
};


// TODO: Set as an API Action instead of a webhook
// TODO: Create more validations
// FIXME: Some fields may actually be null if a payment intent is not yet been made
// FIXME: The payment intent id is not yet been made, so it is null, and may be causing issues, this will be fixed later
// TODO: When creating a payment intent through the api instead of the webhook, the payment intent id is not yet been made, so it is null and can't be referenced, and may be causing issues, this will be fixed later, when using the url its fine though
const checkCheckoutStatusServer = async (req, res, next) => {
  const { sessionId } = req.body;

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const paymentIntentId = session?.payment_intent;

    if (!paymentIntentId) {
      return res.status(200).send({ msg: `No payment intent has been made for Session: ${sessionId}` });
    }

    const paymentIntent = await stripe.paymentIntents?.retrieve(paymentIntentId);
    if ((session.payment_status === "paid" || paymentIntent?.status === "succeeded") && session.status === "complete" && session.url === null) {
      return res.status(200).send({ msg: "Checkout session completed" });
    }

    if (session.payment_status === "unpaid" || paymentIntent?.status === "requires_payment_method") {
      try {
        const cartDoc = await cartCollectionRef.doc(session.cart_id).get();
        const totalPrice = cartDoc.data().total_price;
        const paymentIntent = await createPaymentIntent(totalPrice);
        await chargePaymentIntent(paymentIntent.id);
        await cartCollectionRef.doc(session.cart_id).update({ payment_status: "paid" });
        await stripe.checkout.sessions.update(sessionId, { payment_status: "paid" });
        return res.status(200).send({ msg: "Checkout session completed" });
      } catch (error) {
        console.error(`Error processing payment: ${error.message}`);
        return res.status(400).send({ msg: "Not enough funds" });
      }
    }

    return res.status(400).send("Invalid payment status");
  } catch (error) {
    console.error(`GET CHECKOUT STATUS [SERVER] ${error.message}`);
    return res.status(500).send({

      msg: `GET CHECKOUT STATUS [SERVER] ${error.message}`,
    });
  }
}

const getCheckoutSessionByIdServer = async (req, res, next) => {
  const sessionId = req.params.sessionId;
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (!session) {
      return res.status(404).send({ msg: "Session not found" });
    }
    return res.status(200).send({ data: session });
  } catch (error) {
    return res.status(500).send({ msg: `GET SESSION BY ID ERROR [SERVER] ${error.message}` });
  }
};

const getSessionLineItemsServer = async (req, res, next) => {
  const sessionId = req.params.sessionId;
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (!session) {
      return res.status(404).send({ msg: "Session not found" });
    }
    const lineItems = await stripe.checkout.sessions.listLineItems(sessionId);
    return res.status(200).send({ data: lineItems });
  } catch (error) {
    return res.status(500).send({ msg: `GET SESSION LINE ITEMS ERROR [SERVER] ${error.message}` });
  }
};

module.exports = {
  createCheckoutIntentServer, checkoutTestRouteServer, webhookEventHandler, checkCheckoutStatusServer, getCheckoutSessionByIdServer, getSessionLineItemsServer, createStripeCheckoutSessionServer
}
