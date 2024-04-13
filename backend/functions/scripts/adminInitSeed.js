const { app } = require("../index.js");
const admin = require("firebase-admin");
const { Resend } = require("resend");
// NOTE: This is the api key, make sure to replace this with your own api key from resend
const resendApiKey = "your-api-key-here";
const resend = new Resend(resendApiKey);
// NOTE: MAKE SURE TO REPLACE THIS PLACEHOLDER WITH YOUR OWN EMAIL ADDRESS, as for testing environments this require your own email address associated with it
const yourEmailAddress = "your-email-address-here";
/**
 * Initializes the admin role.
// NOTE: This is a script that will seed firebase auth with an admin user, this is only for development purposes, and is hardcoded for now.
 * @return {Promise<Object>} The user record.
 */
async function initializeAdminRole() {
  const defaultName = "admin-user";
  const defaultEmail = yourEmailAddress;
  const defaultPassword = "admin1234";
  // const emailVerified = true;

  try {
    const userRecord = await admin.auth().createUser({
      displayName: defaultName,
      email: defaultEmail,
      password: defaultPassword,
      // emailVerified: emailVerified,
    });
    await admin.auth().setCustomUserClaims(userRecord.uid, { admin: true });
    return userRecord;
  } catch (error) {
    console.error("Error initializing admin:", error);
    throw error;
  }
}

/**
 * Sends an email using the resend library.
 * @param {string} email - The email address to send the verification link to.
 * @param {string} verificationLink - The email verification link to send.
 * @param {string} emailName - The email to send the verification link to.
 */
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

/**
 * Sends an email verification link to the specified email address.
 *
 * @param {string} email - The email address to send the verification link to.
 * @return {Promise<void>} A promise that resolves when the email verification link is sent successfully.
 * @throws {Error} If there is an error sending the email verification link.
 */
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

initializeAdminRole()
  .then((userRecord) => {
    console.log("Admin role initialized successfully. User ID:", userRecord.uid);
    try {
      return sendEmailVerification(userRecord.email);
    } catch (error) {
      console.error("Error sending email verification:", error.message);
      throw error;
    }
  })
  .catch((error) => {
    console.error("Error initializing admin role:", error);
  });


module.exports = {
  initializeAdminRole,
};
