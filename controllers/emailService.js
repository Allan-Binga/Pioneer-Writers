const nodemailer = require("nodemailer");
const client = require("../config/dbConfig");
const crypto = require("crypto");
const dotenv = require("dotenv");
const fs = require("fs");
const path = require("path");

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "Zoho", // or Gmail or your SMTP
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Password Reset Email
const sendPasswordResetEmail = async (email, token) => {
  const resetUrl = `${process.env.CLIENT_URL}/password/reset?token=${token}`;
  const logoUrl =
    "https://pioneer-writers-bucket.s3.eu-north-1.amazonaws.com/pioneer-writers/logo.webp";

  const mailOptions = {
    from: `"Pioneer Writers Team" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Password Reset Request",
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); overflow: hidden;">
          <!-- Header with Logo -->
          <div style="background-color: #ffffff; padding: 20px; text-align: center;">
            <img src="${logoUrl}" alt="Pioneer Writers Logo" style="max-width: 180px; height: auto; display: block; margin: 0 auto;" />
          </div>
          <!-- Content -->
          <div style="padding: 20px 30px; text-align: center;">
            <h2 style="font-size: 24px; font-weight: 600; color: #1a1a1a; margin: 0 0 16px;">Password Reset Request</h2>
            <p style="font-size: 16px; color: #4a4a4a; line-height: 1.5; margin: 0 0 24px;">
              We received a request to reset your password. Click the button below to set a new password.
            </p>
            <a href="${resetUrl}" 
               style="display: inline-block; padding: 12px 24px; background-color: #ff9800; color: #ffffff; font-size: 16px; font-weight: 500; text-decoration: none; border-radius: 6px; transition: background-color 0.2s;">
              Reset Your Password
            </a>
            <p style="font-size: 14px; color: #6b7280; line-height: 1.5; margin: 24px 0 0;">
              If you didn’t request a password reset, you can safely ignore this email. Your account remains secure.
            </p>
          </div>
          <!-- Footer -->
          <div style="background-color: #f8fafc; padding: 16px; text-align: center; font-size: 12px; color: #6b7280;">
            <p style="margin: 0;">&copy; ${new Date().getFullYear()} Pioneer Writers. All rights reserved.</p>
            <p style="margin: 8px 0 0;">
              <a href="https://yourdomain.com" style="color: #ff9800; text-decoration: none;">Visit our website</a>
            </p>
          </div>
        </div>
      </div>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Password reset email sent to ${email}`);
  } catch (error) {
    console.error(`Error sending password reset email:`, error);
    throw error;
  }
};

//Order Status Email
const sendOrderPlacementEmail = async (email) => {
  try {
  } catch (error) {}
};

module.exports = { sendPasswordResetEmail, sendOrderPlacementEmail };
