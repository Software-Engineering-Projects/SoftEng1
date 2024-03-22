const admin = require("firebase-admin");
const db = admin.firestore();
const tokenCollectionRef = db.collection("tokens");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const jwtWebTokenSecretKey = process.env.JWT_WEB_TOKEN_SECRET_KEY;
const tokenSchema = require("../../models/tokenModel");
const fetchRole = require("../fetchRole");

const generateToken = async (userId) => {
  const firebaseUserId = await admin.auth().getUser(userId);
  const uid = firebaseUserId.uid;
  const email = firebaseUserId.email;
  const role = await fetchRole(uid);
  const token = jwt.sign({
    id: uid,
    email: email,
    role: role,
  }, jwtWebTokenSecretKey, {
    expiresIn: 60 * 15, // 15 minutes
  });

  const tokenRef = tokenCollectionRef.doc(token);
  tokenRef.set({
    userId: uid,
    email: email,
    role: role,
    // This isn't actually fetched from the jwt token, but I will just make a note of it here as it does expire 15 minutes from when it was created.
    // TODO: Just get this from the jwt payload
    validUntil: new Date(Date.now() + 60 * 15 * 1000),
  });
  console.log("token", token);
  return token;
};

// TODO: Create the middleware for any route that requires a token to be verified, later to be added down the line, check also the customClaims for the user to see if they are an admin or not.
const verifyToken = async (token, res, req) => {
  try {
    const decodedToken = jwt.verify(token, jwtWebTokenSecretKey);
    const { error } = tokenSchema.validate(decodedToken);
    if (error) {
      throw new Error("Invalid token");
    }
    return decodedToken.userId;
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      res.status(401).send({ success: false, msg: "Token expired" });
    } else if (error.name === "JsonWebTokenError") {
      res.status(401).send({ success: false, msg: "Invalid token" });
    } else if (error.name === "NotBeforeError") {
      res.status(401).send({ success: false, msg: "Token not yet valid" });
    } else if (error.name === "InvalidTokenError") {
      res.status(401).send({ success: false, msg: "The header or payload could not be parsed" });
    } else {
      console.error("Error:", error);
      return null;
    }
  }
};

// FIXME: There are some issues with this function further checks are needed
const expireToken = async (token) => {
  try {
    const decodedToken = jwt.verify(token, jwtWebTokenSecretKey);
    if (decodedToken.exp <= Math.floor(Date.now() / 1000)) {
      throw new Error("Token already expired. User is logged out.");
    }
    const expiredToken = jwt.sign(
      { ...decodedToken, exp: Math.floor(Date.now() / 1000) },
      jwtWebTokenSecretKey,
    );
    const tokenRef = tokenCollectionRef.doc(token);
    await tokenRef.update({ expired: true });
    console.log("Expired token:", expiredToken);
  } catch (error) {
    console.error("Error:", error);
  }
};

module.exports = {
  generateToken,
  verifyToken,
  expireToken,
};

