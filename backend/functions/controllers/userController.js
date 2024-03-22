const admin = require("firebase-admin");
const db = admin.firestore();
const bcrypt = require("bcrypt");
require("dotenv").config();
const { verifyToken, generateToken, expireToken } = require("../helpers/tokens/tokenActions");
const { createSession } = require("../helpers/sessions/sessionActions");
const fetchRole = require("../helpers/fetchRole");
const userCollectionRef = db.collection("users");
// NOTE: To get a sample response from these API endpoints refer to the readme in the route directory

const userTestProductServer = (_req, res, next) => {
  res.status(200).send({ success: true, msg: "Inside user route" });
};

const getUserCountServer = async (_req, res, next) => {
  try {
    const listAllUsers = async (nextPageToken) => {
      let count = 0;
      let pageToken = nextPageToken;
      do {
        const listUserResults = await admin.auth().listUsers(1000, pageToken);
        count += listUserResults.users.length;
        pageToken = listUserResults.pageToken;
      } while (pageToken);
      return count;
    };

    const count = await listAllUsers();
    return res.status(200).send({ success: true, count });
  } catch (error) {
    console.log(`USER COUNT ERROR [SERVER] ${error.message}`);
    return res.status(500).send({
      success: false,
      msg: `USER COUNT ERROR [SERVER]`,
      error: error.message,
    });
  }
};

const getAllUsers = async (nextPageToken) => {
  let data = [];
  try {
    const userListResult = await admin.auth().listUsers(1000, nextPageToken);
    userListResult.users.forEach((record) => {
      data.push(record.toJSON());
    });
    if (userListResult.pageToken) {
      const nextPageData = await getAllUsers(userListResult.pageToken);
      data = data.concat(nextPageData);
    }
  } catch (error) {
    console.log(`GET ALL USERS ERROR [SERVER] ${error.message}`);
    throw new Error(`An error occurred while getting all users: ${error.message}`);
  }
  return data;
};

const getUserListServer = async (_req, res, next) => {
  try {
    const data = await getAllUsers();
    return res.status(200).send({ success: true, data });
  } catch (error) {
    console.log(`USER LIST ERROR [SERVER] ${error.message}`);
    return res.status(500).send({
      success: false,
      msg: `USER LIST ERROR [SERVER]`,
      error: error.message,
    });
  }
};

const deleteUserByIdServer = async (req, res, next) => {
  const id = req.params.userId;
  try {
    const user = await admin.auth().getUser(id);
    if (!user) {
      return res.status(404).send({ success: false, msg: "User not found" });
    }

    await admin.auth().deleteUser(id);

    return res.status(200).send({ success: true, msg: "User deleted successfully" });
  } catch (error) {
    console.error(`DELETE USER BY ID ERROR [SERVER] ${error.message}`);
    return res.status(500).send({
      success: false,
      msg: "DELETE USER BY ID ERROR [SERVER] ",
      error: error.message,
    });
  }
};

const getUserByIdServer = async (req, res, next) => {
  const id = req.params.userId;
  try {
    const user = await admin.auth().getUser(id);
    if (!user) {
      return res.status(404).send({ success: false, msg: "User not found" });
    }
    return res.status(200).send({ success: true, data: user });
  } catch (error) {
    console.log(`GET USER BY ID ERROR [SERVER] ${error.message}`);
    return res.status(500).send({
      success: false,
      msg: `GET USER BY ID ERROR [SERVER]`,
      error: error.message,
    });
  }
};

const setAdminRoleServer = async (req, res, next) => {
  const id = req.params.userId;
  const adminId = req.body.adminId;
  // TODO: Try to make a more descriptive error message, for why a user is not eligible for the certain role
  try {
    if (adminId === undefined || adminId === null) {
      return res.status(400).send({ success: false, msg: "Admin ID is required" });
    }

    const adminUser = await fetchRole(adminId);
    if (!adminUser || adminUser !== "admin") {
      console.error(`Admin not found with ID: ${adminId}`);
      return res.status(404).send({ success: false, msg: `User with id: ${adminId} is not an admin and cannot assign admin role` });
    }

    const user = await admin.auth().getUser(id);
    if (!user) {
      console.error(`User not found with ID: ${id}`);
      return res.status(404).send({ success: false, msg: "User not found" });
    }

    if (
      typeof user.email !== "string" ||
      typeof user.emailVerified !== "boolean" ||
      !user.emailVerified ||
      user.disabled
    ) {
      console.error(`User with email: ${user.email} isn't eligible for an admin role`);
      return res.status(400).send({ success: false, msg: `User with email: ${user.email} isn't eligible for an admin role` });
    }

    const userClaims = await fetchRole(id);
    if (userClaims && userClaims.admin) {
      console.error(`User is already an admin with ID: ${id}`);
      return res.status(400).send({ success: false, msg: "User is already an admin" });
    }

    await admin.auth().setCustomUserClaims(id, { admin: true });

    console.log(`User role updated successfully for ID: ${id}`);
    return res.status(200).send({ success: true, msg: "User role updated successfully" });
  } catch (error) {
    console.error(`SET ADMIN ROLE ERROR [SERVER] ${error.message}`);
    return res.status(500).send({
      success: false,
      msg: "SET ADMIN ROLE ERROR [SERVER]",
      error: error.message,
    });
  }
};

// TODO: This should be the default role set to a user upon creation of an account
const setUserRoleServer = async (req, res, next) => {
  const id = req.params.userId;
  const adminId = req.body.adminId;
  try {
    if (!adminId) {
      return res.status(400).send({ success: false, msg: "Admin ID is required" });
    }

    const adminUser = await fetchRole(adminId);
    if (!adminUser || adminUser !== "admin") {
      console.error(`Admin not found with ID: ${adminId}`);
      return res.status(404).send({ success: false, msg: `User with id: ${adminId} is not an admin and cannot assign admin role` });
    }

    const user = await admin.auth().getUser(id);
    if (!user) {
      console.error(`User not found with ID: ${id}`);
      return res.status(404).send({ success: false, msg: "User not found" });
    }

    if (
      typeof user.email !== "string" ||
      typeof user.emailVerified !== "boolean" ||
      !user.emailVerified || user.disabled
    ) {
      console.error(`User with email: ${user.email} isn't eligible for a role type of user`);
      return res.status(400).send({
        success: false, msg: "User isn't eligible for a role type of user",
      });
    }

    const userClaims = await fetchRole(id);
    if (userClaims && userClaims === "user") {
      console.error(`User is already a role of type "user" with ID: ${id}`);
      return res.status(400).send({ success: false, msg: "User is already a role of type user" });
    }

    await admin.auth().setCustomUserClaims(id, { user: true });

    console.log(`Role of type "user" updated successfully for ID: ${id}`);
    return res.status(200).send({ success: true, msg: "Role of type user updated successfully" });
  } catch (error) {
    console.error(`SET ROLE OF TYPE USER ERROR [SERVER] ${error.message}`);
    return res.status(500).send({
      success: false,
      msg: "SET ROLE OF TYPE USER ERROR [SERVER]",
      error: error.message,
    });
  }
};

const getUserRoleServer = async (req, res, next) => {
  try {
    const id = req.params.userId;
    const role = await fetchRole(id);
    const user = await admin.auth().getUser(id);

    if (!user) {
      return res.status(404).send({ success: false, msg: "User not found" });
    }

    if (!role) {
      return res.status(404).send({ success: false, msg: "User has no assigned role" });
    }

    return res.status(200).send({ success: true, role: role });
  } catch (error) {
    console.log(`GET USER ROLE ERROR [SERVER] ${error.message}`);
    return res.status(500).send({
      success: false,
      msg: `GET USER ROLE ERROR [SERVER]`,
      error: error.message,
    });
  }
};

const getUserByEmailServer = async (req, res, next) => {
  try {
    const email = req.body.email;

    if (!email) {
      return res.status(400).send({ success: false, msg: "Email is required" });
    }

    const user = await admin.auth().getUserByEmail(email);

    if (!user) {
      return res.status(404).send({ success: false, msg: "User not found" });
    }

    return res.status(200).send({ success: true, data: user });
  } catch (error) {
    console.log(`GET USER BY EMAIL ERROR [SERVER] ${error.message}`);
    return res.status(500).send({
      success: false,
      msg: `GET USER BY EMAIL ERROR [SERVER]`,
      error: error.message,
    });
  }
};

const registerUserServer = async (req, res) => {
  const { email, password, displayName } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required" });
    }

    const hashedPassword = await hashPassword(password);

    const userRecord = await admin.auth().createUser({
      email,
      password: hashedPassword,
      displayName: displayName || null,
    });

    const saveUserDataToFirestore = async (uid, email, hashedPassword, displayName) => {
      try {
        const existingUser = await userCollectionRef.where("email", "==", email).get();
        if (!existingUser.empty) {
          existingUser.docs[0].ref.delete();
          console.log(`User data deleted from Firestore for UID: ${existingUser.docs[0].id}`);
        }
        await userCollectionRef.doc(uid).set({
          email,
          hashedPassword,
          displayName,
        });
        console.log(`User data saved to Firestore for UID: ${uid}`);
      } catch (error) {
        console.error(`Error saving user data to Firestore:`, error);
      }
    };

    await saveUserDataToFirestore(userRecord.uid, email, hashedPassword, displayName);

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      data: [userRecord.toJSON()],
    });
  } catch (error) {
    console.error(`REGISTER USER ERROR [SERVER]`, error);
    return res.status(500).json({
      success: false,
      message: `REGISTER USER ERROR [SERVER]`,
      error: error.message,
    });
  }
};

const hashPassword = async (plainPassword) => {
  const saltRounds = 10;
  return bcrypt.hash(plainPassword, saltRounds);
};

// TODO: Create the session object
const loginUserServer = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required" });
    }

    const userSnapshot = await userCollectionRef.where("email", "==", email).get();

    if (userSnapshot.empty) {
      return res.status(401).json({ success: false, message: "User not found" });
    }

    const userDoc = userSnapshot.docs[0];
    const uid = userDoc.id;
    console.log(`User data fetched from Firestore for UID: ${uid}`);

    if (!uid || typeof uid !== "string") {
      return res.status(500).json({ success: false, message: "Invalid user data" });
    }

    const { hashedPassword } = userDoc.data();
    const passwordMatch = await comparePassword(password, hashedPassword);

    if (!passwordMatch) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    await fetchRole(uid);
    console.log(fetchRole(uid) === "admin" ? "Admin logged in successfully" : "User logged in successfully");

    let token;
    try {
      token = await generateToken(uid);
    } catch (error) {
      console.error(`Error generating token`, error);
      return res.status(500).json({
        success: false,
        message: `Error generating token`,
        error: error.message,
      });
    }
    let session;
    try {
      session = await createSession(token);
    } catch (error) {
      console.error(`Error creating session`, error);
      return res.status(500).json({
        success: false,
        message: `Error creating session`,
        error: error.message,
      });
    }

    return res.status(200).json({ success: true, message: "User logged in successfully", session: session });
  } catch (error) {
    console.error(`LOGIN USER ERROR [SERVER]`, error);
    return res.status(500).json({
      success: false,
      message: `LOGIN USER ERROR [SERVER]`,
      error: error.message,
    });
  }
};

const logOutUserServer = async (req, res) => {
  try {
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader) {
      return res.status(401).json({ success: false, message: "Authorization header missing" });
    }

    const token = authorizationHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ success: false, message: "Token missing" });
    }

    await verifyToken(token, res, req);
    await expireToken(token);
    return res.status(200).json({ success: true, message: "User logged out successfully" });
  } catch (error) {
    console.error(`LOGOUT USER ERROR [SERVER]`, error);
    return res.status(500).json({
      success: false,
      message: `LOGOUT USER ERROR [SERVER]`,
      error: error.message,
    });
  }
};

const comparePassword = async (plainPassword, hashedPassword) => {
  return bcrypt.compare(plainPassword, hashedPassword);
};

module.exports = {
  userTestProductServer, getUserCountServer, getUserListServer, getUserByIdServer, deleteUserByIdServer, setAdminRoleServer, getUserRoleServer, setUserRoleServer, getUserByEmailServer, loginUserServer, registerUserServer, logOutUserServer,
};
