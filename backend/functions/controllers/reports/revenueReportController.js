require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SECRET);

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

const fetchAllCompletedSessions = async (startTimestamp, endTimestamp) => {
  let totalRevenue = 0;
  const sessions = await stripe.checkout.sessions.list({
    limit: 100,
    created: {
      gte: startTimestamp,
      lte: endTimestamp,
    },
    status: "complete",
  });

  sessions.data.forEach((session) => {
    totalRevenue += session.amount_total / 100;
  });

  return { totalRevenue: totalRevenue.toFixed(2) };
};

const grossRevenueReportServer = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).send({ msg: "Start date and end date are required" });
    }

    validateDateYearRange(startDate, endDate);

    const startTimestamp = Math.floor(new Date(startDate).getTime() / 1000);
    const endTimestamp = Math.floor(new Date(endDate).getTime() / 1000);

    const { totalRevenue } = await fetchAllCompletedSessions(startTimestamp, endTimestamp);

    return res.status(200).send({ totalRevenue });
  } catch (error) {
    console.error(`COMPLETED CHECKOUT SESSION REPORT ERROR [SERVER] ${error.message}`);
    return res.status(500).send({

      msg: "COMPLETED CHECKOUT SESSION REPORT ERROR [SERVER]",
      error: error.message,
    });
  }
};

module.exports = {
  grossRevenueReportServer,
};
