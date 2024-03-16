const { app } = require("../index.js");
const admin = require("firebase-admin");

const resendApiKey = "re_DuGQ3ZnZ_PSy8JYLy5HHvahemRU9BQEur"
const resend = new Resend(resendApiKey);
const yourEmailAddress = "cuy4207@gmailcom";


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

    const adminUser = await admin.auth().getUser(adminId);
    const isAdmin = adminUser.customClaims && adminUser.customClaims.admin === true;
    if (!isAdmin) {
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

    const userClaims = await admin.auth().getUser(id).customClaims;
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

    const adminUser = await admin.auth().getUser(adminId);
    if (!adminUser.customClaims || !adminUser.customClaims.admin) {
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
      return res.status(400).send({ success: false, msg: "User isn't eligible for a role type of user" });
    }

    const userClaims = user.customClaims;
    if (userClaims && userClaims.user) {
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
    const user = await admin.auth().getUser(id);

    if (!user) {
      return res.status(404).send({ success: false, msg: "User not found" });
    }

    if (!user.customClaims || (!user.customClaims.admin && !user.customClaims.user)) {
      return res.status(404).send({ success: false, data: null, msg: "User has no assigned role" });
    }

    return res.status(200).send({ success: true, data: user.customClaims });
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

const createAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Create the user
    const userRecord = await admin.auth().createUser({
      email,
      password
    });

    /* Set custom claims for the user
    const { uid } = userRecord;
    await admin.auth().setCustomUserClaims(uid, { admin: true });
*/


      return sendEmailVerification(userRecord.email);
   } catch (error) {
      console.error("Error sending email verification:", error.message);
      return res.status(400).json({ success: false, msg: `Error creating admin account: ${error.message}` });

    }
  };




async function sendEmail(email, verificationLink, emailName = yourEmailAddress) {
  try {
    const { data, error } = await resend.emails.send({
      // NOTE: This is the default email address that will be used to send the email, without the need to create your own custom domain.
      from: "noreply@ordering.com <onboarding@resend.dev>",
      to: [email],
      subject: `Verify your email address`,
      html: `
        <h1>Welcome to Ordering System!</h1>
        <p>Thank you for joining us, <strong> ${emailName}</strong>, <br>
        To get started, please verify your email address by clicking the button below:</p>
        <a href="${verificationLink}" target="_blank" rel="noopener noreferrer" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: #fff; text-decoration: none; border-radius: 5px;">Verify Email</a>
        <p>If you have any questions or need assistance, feel free to contact our support team.</p>
        <p>Best regards,</p>
        <p>Ordering System Team</p>
      `,
    });

    if (error) {
      console.error("Error sending email:", error);
      throw new Error("Email sending failed");
    }

    console.log("Email sent successfully:", data);
  } catch (error) {
    console.error("Error sending email:", error.message);
    throw error;
  }
}

async function sendEmailVerification(email) {
  try {
    const verificationLink = await admin.auth().generateEmailVerificationLink(email);
    await sendEmail(email, verificationLink);
    console.log("Email verification link sent to:", email);
  } catch (error) {
    console.error("Error sending email verification:", error.message);
    throw error;
  }
}


// TODO: Create user endpoint, this should be handled by firebase authentication. Upon creation of an account this should create a user collection in firestore based on the uuid of the firebase authentication from the current user

module.exports = {
  userTestProductServer, getUserCountServer, getUserListServer, getUserByIdServer, deleteUserByIdServer, setAdminRoleServer, getUserRoleServer, setUserRoleServer, getUserByEmailServer,createAdmin
};
