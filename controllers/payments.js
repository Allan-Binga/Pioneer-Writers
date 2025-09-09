const dotenv = require("dotenv");
const paypal = require("@paypal/checkout-server-sdk");
const client = require("../config/dbConfig");
const { orderPaymentEmail, classHelpPaymentEmail } = require("./emailService");

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

//Get Class Payments
const getClassPayments = async (req, res) => {
  const userId = req.userId;

  try {
    const result = await client.query(
      `SELECT * FROM class_help_payments WHERE user_id = $1 ORDER BY created_at DESC`,
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
        `UPDATE orders SET payment_status = $1 WHERE order_id = $2`,
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

//Capture Class Help Orders payments
const captureClassHelpPayment = async (req, res) => {
  const { token } = req.body;
  if (!token) {
    console.log("❌ Missing PayPal token in request body");
    return res.status(400).json({ error: "Missing PayPal token." });
  }

  try {
    console.log("🚀 Starting class help payment capture for token:", token);

    // Capture the payment
    const request = new paypal.orders.OrdersCaptureRequest(token);
    request.requestBody({});
    const capture = await paypalClient.execute(request);
    const captureData = capture.result;

    console.log("✅ Class help payment captured successfully");

    const classHelpId =
      captureData.purchase_units[0]?.payments?.captures[0]?.custom_id;
    const transactionId =
      captureData.purchase_units[0]?.payments?.captures[0]?.id;

    if (!classHelpId || !transactionId) {
      console.error(
        "❌ Missing classHelpId or transactionId in capture response:",
        captureData
      );
      return res.status(400).json({ error: "Invalid capture response." });
    }

    console.log("📌 Class Help ID:", classHelpId);
    console.log("📌 Transaction ID:", transactionId);

    // Check if payment already exists
    const existsQuery = `SELECT * FROM class_help_payments WHERE transaction_reference = $1`;
    const { rows: existing } = await client.query(existsQuery, [transactionId]);

    if (existing.length === 0) {
      console.log("✅ No existing payment found, proceeding with processing");

      // Fetch class help order details
      console.log("🔍 Fetching class help order for classHelpId:", classHelpId);
      const { rows } = await client.query(
        `SELECT * FROM class_help_orders WHERE class_help_id = $1`,
        [classHelpId]
      );

      if (rows.length === 0) {
        console.error(
          "❌ Class help order not found for classHelpId:",
          classHelpId
        );
        return res.status(404).json({ error: "Class help order not found." });
      }

      const order = rows[0];
      const userId = order.user_id;
      const amount = order.budget;

      console.log("✅ Class help order found:", order);
      console.log("👤 User ID:", userId);
      console.log("💵 Payment Amount:", amount);

      // Update order payment status
      console.log("🔄 Updating class help order payment status to Paid");
      await client.query(
        `UPDATE class_help_orders SET payment_status = $1 WHERE class_help_id = $2`,
        ["Paid", classHelpId]
      );
      console.log("✅ Class help order payment status updated");

      // Fetch user email
      console.log("🔍 Fetching user email for userId:", userId);
      const userRes = await client.query(
        `SELECT email FROM users WHERE user_id = $1`,
        [userId]
      );
      const userEmail = userRes.rows[0]?.email || null;
      console.log("📧 User Email:", userEmail || "No email found");

      // Send confirmation email (you'll need to create a class help specific email template)
      if (userEmail) {
        console.log(
          "📩 Attempting to send class help payment confirmation email to:",
          userEmail
        );
        try {
          await classHelpPaymentEmail(userEmail, order, amount, transactionId);
          console.log(
            "✅ Class help payment email sent successfully to:",
            userEmail
          );
        } catch (emailError) {
          console.error(
            "❌ Email sending failed:",
            emailError.message,
            emailError.stack
          );
        }
      } else {
        console.warn("⚠️ No email found for userId:", userId, "skipping email");
      }

      // Save inbox message for class help payment
      console.log("💬 Saving inbox message for class help order:", classHelpId);
      const subject = `Payment Received for Class Help Order #${order.class_help_id}`;
      const content = `
        Hi there,

        We've received your payment of $${amount} for Class Help Order #${order.class_help_id} (${order.subject} - ${order.course_code}).

        Our writers will now start working on your class. You can track its progress via your account.

        Thank you for choosing Pioneer Writers!
      `;
      const adminId = "9631899f-1dbb-4a16-887e-52f10e9c4c16";
      await client.query(
        `INSERT INTO messages (
          sender_id, receiver_id, sender_type, subject, content, class_help_id
        ) VALUES ($1, $2, 'admin', $3, $4, $5)`,
        [adminId, userId, subject, content.trim(), classHelpId]
      );
      console.log("✅ Class help inbox message saved");

      // Insert into class_help_payments table
      console.log(
        "💾 Inserting class help payment record for classHelpId:",
        classHelpId
      );
      await client.query(
        `INSERT INTO class_help_payments (
          class_help_id, user_id, amount, payment_type,
          payment_status, payment_method, transaction_reference,
          paid_at, created_at, updated_at
        ) VALUES (
          $1, $2, $3, $4, 'completed', 'PayPal', $5, NOW(), NOW(), NOW()
        )`,
        [classHelpId, userId, amount, "full", transactionId]
      );
      console.log("✅ Class help payment recorded");
    } else {
      console.log(
        "⚠️ Class help payment already recorded for transactionId:",
        transactionId
      );
    }

    console.log(
      "🎉 Class help payment capture and processing completed successfully"
    );
    res.status(200).json({ success: true, capture: captureData, classHelpId });
  } catch (error) {
    console.error(
      "❌ Class help PayPal capture failed:",
      error.message,
      error.stack
    );
    res.status(500).json({ error: "Class help capture failed." });
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
  getClassPayments,
  capturePayment,
  captureClassHelpPayment,
  getAllPayments,
};
