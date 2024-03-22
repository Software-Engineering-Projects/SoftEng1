// NOTE: This is a helper function there is also a get role via the api endpoint
const admin = require("firebase-admin");
const fetchRole = async (uid) => {
  const user = await admin.auth().getUser(uid);
  if (!user) {
    return null;
  }
  return user.customClaims && user.customClaims.admin === true ? "admin" : "user";
};

module.exports = fetchRole;
