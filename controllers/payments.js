const dotenv = require("dotenv");
const paypal = require("@paypal/checkout-server-sdk");
const client = require("../config/dbConfig");

dotenv.config();

//  PayPal SDK Configuration
const environment = new paypal.core.SandboxEnvironment(
  process.env.PAYPAL_CLIENT_ID,
  process.env.PAYPAL_CLIENT_SECRET
);
const paypalClient = new paypal.core.PayPalHttpClient(environment);

//  Get Payments for Logged-in User
const getMyPayments = async (req, res) => {
  const userId = req.userId;

  try {
    const result = await client.query(
      `SELECT * FROM payments WHERE user_id = $1 ORDER BY created_at DESC`,
      [userId]
    );

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching payments:", error);
    res.status(500).json({ message: "Failed to fetch payments." });
  }
};

// Capture PayPal Payment
const capturePayment = async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ error: "Missing PayPal token." });
  }

  try {
    const request = new paypal.orders.OrdersCaptureRequest(token);
    request.requestBody({});

    const capture = await paypalClient.execute(request);
    const captureData = capture.result;

    console.log("PayPal capture successful:", captureData);

    // Optional: Save captureData to DB here if needed

    res.status(200).json({ success: true, capture: captureData });
  } catch (error) {
    console.error("PayPal capture failed:", error.message || error);
    res.status(500).json({ error: "Capture failed." });
  }
};

module.exports = {
  getMyPayments,
  capturePayment,
};
