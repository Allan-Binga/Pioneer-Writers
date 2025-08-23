const dotenv = require("dotenv");
const paypal = require("@paypal/checkout-server-sdk");
const client = require("../config/dbConfig");
const { orderPaymentEmail } = require("./emailService");

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
    console.log("❌ Missing PayPal token in request body");
    return res.status(400).json({ error: "Missing PayPal token." });
  }

  try {
    console.log("🚀 Starting payment capture for token:", token);

    // Capture the payment
    const request = new paypal.orders.OrdersCaptureRequest(token);
    request.requestBody({});
    const capture = await paypalClient.execute(request);
    const captureData = capture.result;

    console.log("✅ Payment captured successfully");

    const orderId =
      captureData.purchase_units[0]?.payments?.captures[0]?.custom_id;
    const transactionId =
      captureData.purchase_units[0]?.payments?.captures[0]?.id;

    if (!orderId || !transactionId) {
      console.error(
        "❌ Missing orderId or transactionId in capture response:",
        captureData
      );
      return res.status(400).json({ error: "Invalid capture response." });
    }

    console.log("📌 Order ID:", orderId);
    console.log("📌 Transaction ID:", transactionId);

    // Check if payment already exists
    console.log(
      "🔍 Checking for existing payment with transactionId:",
      transactionId
    );
    const existsQuery = `SELECT * FROM payments WHERE transaction_reference = $1`;
    const { rows: existing } = await client.query(existsQuery, [transactionId]);

    if (existing.length === 0) {
      console.log("✅ No existing payment found, proceeding with processing");

      // Fetch order details
      console.log("🔍 Fetching order for orderId:", orderId);
      const { rows } = await client.query(
        `SELECT * FROM orders WHERE order_id = $1`,
        [orderId]
      );

      if (rows.length === 0) {
        console.error("❌ Order not found for orderId:", orderId);
        return res.status(404).json({ error: "Order not found." });
      }

      const order = rows[0];
      const userId = order.user_id;
      const amount = order.checkout_amount;
      const paymentType = order.payment_option || "full";

      console.log("✅ Order found:", order);
      console.log("👤 User ID:", userId);
      console.log("💵 Payment Amount:", amount);

      // Update order status
      console.log(
        "🔄 Updating order status to:",
        paymentType === "half" ? "Partially Paid" : "Paid"
      );
      await client.query(
        `UPDATE orders SET order_status = $1 WHERE order_id = $2`,
        [paymentType === "half" ? "Partially Paid" : "Paid", orderId]
      );
      console.log("✅ Order status updated");

      // Fetch user email
      console.log("🔍 Fetching user email for userId:", userId);
      const userRes = await client.query(
        `SELECT email FROM users WHERE user_id = $1`,
        [userId]
      );
      console.log("📬 Raw userRes.rows:", userRes.rows);
      const userEmail = userRes.rows[0]?.email || null;
      console.log("📧 User Email:", userEmail || "No email found");

      // Send confirmation email
      if (userEmail) {
        console.log("📩 Attempting to send email to:", userEmail);
        try {
          await orderPaymentEmail(userEmail, order, amount, transactionId);
          console.log("✅ Email sent successfully to:", userEmail);
        } catch (emailError) {
          console.error(
            "❌ Email sending failed:",
            emailError.message,
            emailError.stack
          );
          // Continue processing even if email fails
        }
      } else {
        console.warn("⚠️ No email found for userId:", userId, "skipping email");
      }

      // Save inbox message
      console.log("💬 Saving inbox message for orderId:", orderId);
      const subject = `Payment Received for Order #${order.order_id}`;
      const content = `
        Hi there,

        We’ve received your payment of $${amount} for Order #${order.order_id}.

        Writers will now start working on your order. You can track its progress via your account.

        Thank you for choosing Pioneer Writers!
      `;
      const adminId = "9631899f-1dbb-4a16-887e-52f10e9c4c16";
      await client.query(
        `INSERT INTO messages (
          sender_id, receiver_id, sender_type, subject, content, order_id
        ) VALUES ($1, $2, 'admin', $3, $4, $5)`,
        [adminId, userId, subject, content.trim(), orderId]
      );
      console.log("✅ Inbox message saved");

      // Insert into payments table
      console.log("💾 Inserting payment record for orderId:", orderId);
      await client.query(
        `INSERT INTO payments (
          order_id, user_id, amount, payment_type,
          payment_status, payment_method, transaction_reference,
          paid_at, created_at, updated_at
        ) VALUES (
          $1, $2, $3, $4, 'completed', 'PayPal', $5, NOW(), NOW(), NOW()
        )`,
        [orderId, userId, amount, paymentType, transactionId]
      );
      console.log("✅ Payment recorded");
    } else {
      console.log(
        "⚠️ Payment already recorded for transactionId:",
        transactionId
      );
    }

    console.log("🎉 Payment capture and processing completed successfully");
    res.status(200).json({ success: true, capture: captureData, orderId });
  } catch (error) {
    console.error("❌ PayPal capture failed:", error.message, error.stack);
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
