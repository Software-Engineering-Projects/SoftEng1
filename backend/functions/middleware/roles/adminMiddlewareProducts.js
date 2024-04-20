const admin = require("firebase-admin");
const db = admin.firestore();
const sessionsCollectionRef = db.collection("sessions");
require("dotenv").config();
const { checkSession } = require("../../helpers/sessions/sessionActions");

const verifySession = async (req, res) => {
  try {
    const sessionId = req.headers.sessionId;

    if (!sessionId) {
      return res.status(401).send({ msg: "Session ID required for Authorization" });
    }

    const sessionDoc = await sessionsCollectionRef.doc(sessionId).get(sessionId);

    if (!sessionDoc.exists) {
      return res.status(404).send({ msg: "Session not found" });
    }

    const sessionData = sessionDoc.data();
    console.log("sessionData", sessionData);
    const isSessionValid = await checkSession(sessionData);
    console.log("isSessionValid", isSessionValid);

    if (!isSessionValid) {
      return res.status(403).send({ msg: "Session is not valid or its expired" });
    }

    return { sessionData };
  } catch (error) {
    console.error("Error:", error);
    res.status(403).send({ msg: "You are not authorized" });
  }
};

const checkAdminRole = async (req, res, next) => {
  try {
    const { sessionData } = await verifySession(req, res);

    // TODO: Cache the role value, and check if the session is still valid, use an in-memory store, maybe
    const role = sessionData.role;
    const isAdmin = role === "admin";

    if (isAdmin) {
      return next();
    }
    return res.status(403).send({ msg: "You are not authorized!" });
  } catch (error) {
    console.error("Error:", error);
    res.status(403).send({ msg: "You are not authorized" });
  }
};

module.exports = {
  checkAdminRole, verifySession,
};
