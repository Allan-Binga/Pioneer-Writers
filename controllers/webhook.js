const client = require("../config/dbConfig");
const dotenv = require("dotenv");
const Stripe = require("stripe");

dotenv.config();

//Stripe SDK setup
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

//PayPal Webhook Handler
const handlePaypalWebhook = async (req, res) => {
  const event = req.body;
  // console.log("Webhook received: ", event.event_type);
  // console.log(event)

  switch (event.event_type) {
    case "PAYMENT.CAPTURE.COMPLETED": {
      const capture = event.resource;
      const orderId = capture.custom_id;
      const transactionId = capture.id;
      // console.log(orderId)

      try {
        // Fetch order details
        const { rows } = await client.query(
          `SELECT * FROM orders WHERE order_id = $1`,
          [orderId]
        );

        if (rows.length === 0) {
          return res.status(404).send("Order not found");
        }

        const order = rows[0];
        const userId = order.user_id;
        const amount = order.checkout_amount;
        const paymentType = order.payment_option || "full";

        console.log("🧾 Order found:", order);

        // 1. Update order status
        await client.query(
          `UPDATE orders SET order_status = $1 WHERE order_id = $2`,
          ["Paid", orderId]
        );
        // console.log(
        //   `✅ Order status updated for order ${orderId}`,
        //   updateResult.rowCount
        // );

        // 2. Insert into payments table
        const insertQuery = `
          INSERT INTO payments (
            order_id, user_id, amount, payment_type,
            payment_status, payment_method, transaction_reference,
            paid_at, created_at, updated_at
          ) VALUES (
            $1, $2, $3, $4,
            $5, $6, $7,
            NOW(), NOW(), NOW()
          )
        `;

        await client.query(insertQuery, [
          orderId,
          userId,
          amount,
          paymentType,
          "completed",
          "PayPal",
          transactionId,
        ]);

        console.log(`Payment recorded for order ${orderId}`);
      } catch (error) {
        console.error("Error handling completed webhook:", error);
      }

      break;
    }

    case "PAYMENT.CAPTURE.FAILED": {
      const capture = event.resource;
      const orderId = capture.supplementary_data?.related_ids?.order_id;
      const transactionId = capture.id;

      try {
        // 1. Fetch order details
        const { rows } = await client.query(
          `SELECT * FROM orders WHERE order_id = $1`,
          [orderId]
        );

        if (rows.length === 0) {
          return res.status(404).send("Order not found");
        }

        // 2. Update order status
        await client.query(
          `UPDATE orders SET payment_status = $1, order_status = $2 WHERE order_id = $3`,
          ["Failed", "Failed", orderId]
        );

        // 3. Insert into payments table
        const insertQuery = `
      INSERT INTO payments (
        order_id, user_id, amount, payment_type,
        payment_status, payment_method, transaction_reference,
        created_at, updated_at
      ) VALUES (
        $1, $2, $3, $4,
        $5, $6, $7,
        NOW(), NOW()
      )
    `;

        await client.query(insertQuery, [
          orderId,
          rows[0].user_id,
          rows[0].checkout_amount,
          rows[0].payment_option || "Full",
          "failed",
          "PayPal",
          transactionId,
        ]);

        console.warn(`❌ Payment failed for order ${orderId}`);
      } catch (error) {
        console.error("Error handling failed webhook:", error);
      }

      break;
    }

    default:
      console.log("Unhandled webhook event:", event.event_type);
  }

  res.status(200).send("Webhook received");
};

//Handle Stripe Webhook
const handleStripeWebhook = async (req, res) => {
  const endpointSecret = process.env.STRIPE_WEBHOOK;
  const sig = req.headers["stripe-signature"];

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (error) {
    console.error("Webhook signature verification failed:", error.message);
    return res.status(400).send("Webhook error.");
  }

  // Handle different event types
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    const paymentId = session.metadata?.paymentId;
    const userId = session.metadata?.userId;
    const orderNumber = session.metadata?.orderNumber;
    const userEmail = session.metadata?.userEmail;

    try {
      if (!paymentId || !orderNumber || !userId) {
        throw new Error("Required metadata missing.");
      }

      // Optional: Retrieve the PaymentIntent if you want exact amounts or status
      const paymentIntent = await stripe.paymentIntents.retrieve(
        session.payment_intent
      );

      // Update payment record to "Paid"
      const updateQuery = `UPDATE payments SET payment_status = $1, updated_at = $2 WHERE payment_id = $3`;
      await client.query(updateQuery, ["completed", new Date(), paymentId]);

      // console.log(
      //   `✅ Payment ${paymentId} marked as paid for order ${orderNumber}.`
      // );
      return res.status(200).send("Webhook received and processed.");
    } catch (error) {
      console.error("Webhook processing error:", error.message);
      return res.status(500).send("Internal error processing payment.");
    }
  } else {
    // For other events, respond with 200
    return res.status(200).send("Event received.");
  }
};

module.exports = { handlePaypalWebhook, handleStripeWebhook };
