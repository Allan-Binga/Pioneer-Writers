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
  if (!token) return res.status(400).json({ error: "Missing PayPal token." });

  try {
    const request = new paypal.orders.OrdersCaptureRequest(token);
    request.requestBody({});
    const capture = await paypalClient.execute(request);

    const captureData = capture.result;
    const orderId =
      captureData.purchase_units[0]?.payments?.captures[0]?.custom_id;

    const transactionId =
      captureData.purchase_units[0].payments?.captures[0]?.id;

    // console.log("CaptureData:", JSON.stringify(captureData, null, 2));

    // Check if payment already exists
    const existsQuery = `SELECT * FROM payments WHERE transaction_reference = $1`;
    const { rows: existing } = await client.query(existsQuery, [transactionId]);

    if (existing.length === 0) {
      const { rows } = await client.query(
        `SELECT * FROM orders WHERE order_id = $1`,
        [orderId]
      );
      if (rows.length > 0) {
        const order = rows[0];

        await client.query(
          `INSERT INTO payments (
            order_id, user_id, amount, payment_type,
            payment_status, payment_method, transaction_reference,
            paid_at, created_at, updated_at
          ) VALUES (
            $1, $2, $3, $4, 'completed', 'PayPal', $5, NOW(), NOW(), NOW()
          )`,
          [
            orderId,
            order.user_id,
            order.checkout_amount,
            order.payment_option || "full",
            transactionId,
          ]
        );
        // console.log(
        //   `Payment for order ${orderId} recorded with the capture handler.`
        // );

        await client.query(
          `UPDATE orders SET order_status = $1 WHERE order_id = $2`,
          [
            (order.payment_option || "full") === "half"
              ? "Partially Paid"
              : "Paid",
            orderId,
          ]
        );
      }
    }

    res.status(200).json({ success: true, capture: captureData, orderId });
  } catch (error) {
    console.error("PayPal capture failed:", error.message || error);
    res.status(500).json({ error: "Capture failed." });
  }
};

//Get All Payments
const getAllPayments = async (req, res) => {
  try {
    const payments = await client.query("SELECT * FROM payments");
    res.status(200).json(payments.rows);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch payments." });
  }
};

module.exports = {
  getMyPayments,
  capturePayment,
  getAllPayments,
};
