require("dotenv").config();
const { checkSession } = require("../../../helpers/sessions/sessionActions");
const { verifySession } = require("../../roles/adminMiddlewareProducts");

const checkIfLoggedIn = async (req, res, next) => {
  try {
    const { sessionData } = await verifySession(req, res);

    // TODO: Cache the role value, and check if the session is still valid, use an in-memory store, maybe
    const isSessionValid = await checkSession(sessionData);
    if (isSessionValid) {
      return next();
    }
    return res.status(403).send({ success: false, msg: "Session Expired, Login again to continue" });
  } catch (error) {
    console.error("Error:", error);
    res.status(403).send({ success: false, msg: "Session Expired, Login again to continue" });
  }
};

module.exports = {
  checkIfLoggedIn,
};

