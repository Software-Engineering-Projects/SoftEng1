const admin = require("firebase-admin");
const db = admin.firestore();
const realtimeDb = admin.database();

require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SECRET);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

const validateDateYearRange = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    throw new Error("Invalid date format");
  }
  if (start.getTime() >= end.getTime()) {
    throw new Error("The start date must be before the end date");
  }
};

// TODO: This is causing an api rate limit due to having to retrieve each session data, then retrieve the line items and check whether the session is marked as complete
const fetchAllCompletedSessions = async (startTimestamp, endTimestamp) => {
  let allSessions = [];
  for await (const session of stripe.checkout.sessions.list({
    limit: 100,
    created: {
      gte: startTimestamp,
      lte: endTimestamp,
    },
    status: "complete",
  })) {
    allSessions.push(session);
  }
  return allSessions;
};

// TODO: This is very inefficient, and needs to be optimized
const completedCheckoutSessionReportServer = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).send({ msg: "Start date and end date are required" });
    }

    validateDateYearRange(startDate, endDate);

    const startTimestamp = Math.floor(new Date(startDate).getTime() / 1000);
    const endTimestamp = Math.floor(new Date(endDate).getTime() / 1000);

    const completedSessions = await fetchAllCompletedSessions(startTimestamp, endTimestamp);
    const completedSessionsLength = completedSessions.length;

    return res.status(200).send({ length: completedSessionsLength });
  } catch (error) {
    console.error(`COMPLETED CHECKOUT SESSION REPORT ERROR [SERVER] ${error.message}`);
    return res.status(500).send({

      msg: "COMPLETED CHECKOUT SESSION REPORT ERROR [SERVER]",
      error: error.message,
    });
  }
};


module.exports = {
  completedCheckoutSessionReportServer,
};

