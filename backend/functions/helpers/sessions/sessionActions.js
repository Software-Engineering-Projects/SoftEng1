const admin = require("firebase-admin");
const db = admin.firestore();
const sessionCollectionRef = db.collection("sessions");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const jwtWebTokenSecretKey = process.env.JWT_WEB_TOKEN_SECRET_KEY;
const getTokenPayload = (token) => {
  try {
    const decoded = jwt.verify(token, jwtWebTokenSecretKey);
    return decoded;
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};
const createSession = async (tokenId) => {
  const tokenPayload = getTokenPayload(tokenId);

  if (!tokenPayload) {
    console.error("Invalid token");
    return null;
  }
  console.log("tokenPayload", tokenPayload);
  console.log("tokenId from sessions", tokenId);
  const session = {
    metaData: {
      createdAt: tokenPayload.iat,
      tokenId: tokenId,
      // TODO: These fields are not yet finalized
      userAgent: "user-agent",
      lastActivityAt: new Date(),
    },
    userData: {
      role: tokenPayload.role,
      userId: tokenPayload.id,
    },
    validUntil: tokenPayload.exp,
  };

  // Add logic here to save the session (e.g., store it in a database or cache)
  sessionCollectionRef.add(session)
    .then((docRef) => {
      console.log("Session saved with ID: ", docRef.id);
    })
    .catch((error) => {
      console.error("Error saving session: ", error);
    });

  return session;
};

const checkSession = async (sessionData) => {
  const validUntil = sessionData.validUntil;
  const now = Math.floor(Date.now() / 1000);
  return validUntil > now;
};

const retireSession = async (sessionData) => {
  // TODO: Delete session from firestore
  // TODO: call the expire token session to automatically expire the token
};

module.exports = {
  createSession,
  checkSession,
  retireSession,
};
