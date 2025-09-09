const client = require("../config/dbConfig");
const { sendPayoutWithdrawalEmail } = require("./emailService");
const dotenv = require("dotenv");
const Stripe = require("stripe");

dotenv.config();

//Stripe SDK setup
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

//PayPal Webhook Handler
const handlePaypalWebhook = async (req, res) => {
  const event = req.body;
  // console.log("Webhook received: ", event.event_type);
  // console.log(event);

  switch (event.event_type) {
    case "PAYMENT.CAPTURE.COMPLETED": {
      const capture = event.resource;
      const orderId = capture.custom_id;
      const transactionId = capture.id;

      try {
        // Check if payment already exists in either payments table
        const existingRegularCheck = await client.query(
          `SELECT * FROM payments WHERE transaction_reference = $1`,
          [transactionId]
        );
        const existingClassHelpCheck = await client.query(
          `SELECT * FROM class_help_payments WHERE transaction_reference = $1`,
          [transactionId]
        );

        if (
          existingRegularCheck.rows.length > 0 ||
          existingClassHelpCheck.rows.length > 0
        ) {
          return res.status(200).send("Already processed.");
        }

        // Try to find the order in regular orders first
        const { rows: regularOrders } = await client.query(
          `SELECT *, 'regular' as order_type FROM orders WHERE order_id = $1`,
          [orderId]
        );

        // If not found in regular orders, try class_help_orders
        let order = null;
        let orderType = null;

        if (regularOrders.length > 0) {
          order = regularOrders[0];
          orderType = "regular";
        } else {
          const { rows: classHelpOrders } = await client.query(
            `SELECT *, 'class_help' as order_type FROM class_help_orders WHERE class_help_id = $1`,
            [orderId]
          );

          if (classHelpOrders.length > 0) {
            order = classHelpOrders[0];
            orderType = "class_help";
          }
        }

        if (!order) {
          return res.status(404).send("Order not found");
        }

        const userId = order.user_id;
        const amount =
          orderType === "regular" ? order.checkout_amount : order.budget;
        const paymentType =
          orderType === "regular" ? order.payment_option || "full" : "full";

        // Update order status based on type
        if (orderType === "regular") {
          const updatedStatus =
            paymentType === "half" ? "Partially Paid" : "Paid";
          await client.query(
            `UPDATE orders SET payment_status = $1 WHERE order_id = $2`,
            [updatedStatus, orderId]
          );
        } else {
          await client.query(
            `UPDATE class_help_orders SET payment_status = $1 WHERE class_help_id = $2`,
            ["Paid", orderId]
          );
        }

        // Insert into appropriate payments table
        if (orderType === "regular") {
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
        } else {
          const insertQuery = `
            INSERT INTO class_help_payments (
              class_help_id, user_id, amount, payment_type,
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
            "full", // class help orders are always full payment
            "completed",
            "PayPal",
            transactionId,
          ]);
        }
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
        // Try to find the order in regular orders first
        const { rows: regularOrders } = await client.query(
          `SELECT *, 'regular' as order_type FROM orders WHERE order_id = $1`,
          [orderId]
        );

        let order = null;
        let orderType = null;

        if (regularOrders.length > 0) {
          order = regularOrders[0];
          orderType = "regular";
        } else {
          const { rows: classHelpOrders } = await client.query(
            `SELECT *, 'class_help' as order_type FROM class_help_orders WHERE class_help_id = $1`,
            [orderId]
          );

          if (classHelpOrders.length > 0) {
            order = classHelpOrders[0];
            orderType = "class_help";
          }
        }

        if (!order) {
          return res.status(404).send("Order not found");
        }

        // Update order status based on type
        if (orderType === "regular") {
          await client.query(
            `UPDATE orders SET payment_status = $1 WHERE order_id = $2`,
            ["Failed", orderId]
          );
        } else {
          await client.query(
            `UPDATE class_help_orders SET payment_status = $1 WHERE class_help_id = $2`,
            ["Failed", orderId]
          );
        }

        // Insert into appropriate payments table
        const amount =
          orderType === "regular" ? order.checkout_amount : order.budget;
        const paymentType =
          orderType === "regular" ? order.payment_option || "full" : "full";

        if (orderType === "regular") {
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
            order.user_id,
            amount,
            paymentType,
            "failed",
            "PayPal",
            transactionId,
          ]);
        } else {
          const insertQuery = `
            INSERT INTO class_help_payments (
              class_help_id, user_id, amount, payment_type,
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
            order.user_id,
            amount,
            "full",
            "failed",
            "PayPal",
            transactionId,
          ]);
        }

        console.warn(`Payment failed for ${orderType} order ${orderId}`);
      } catch (error) {
        console.error("Error handling failed webhook:", error);
      }

      break;
    }

    case "PAYMENT.PAYOUTS-ITEM.SUCCEEDED": {
      const payout = event.resource;
      const payoutId = payout.payout_item?.sender_item_id; //writer_payouts.payout_id
      const transactionId = payout.transaction_id;

      await client.query(
        `UPDATE writer_payouts
     SET status = 'withdrawn',
         withdrawn_at = NOW(),
         paypal_transaction_id = $1
     WHERE payout_id = $2`,
        [transactionId, payoutId]
      );

      if (rows.length > 0) {
        const writerPayout = rows[0];

        // Fetch writer email
        const { rows: writerRows } = await client.query(
          `SELECT full_name, email, paypal_email FROM writers WHERE writer_id = $1`,
          [writerPayout.writer_id]
        );

        if (writerRows.length > 0) {
          await sendPayoutWithdrawalEmail(
            writerRows[0].email,
            writerRows[0].full_name,
            writerRows[0].paypal_email,
            writerPayout.amount,
            writerPayout.order_id
          );
        }
      }

      console.log(`✅ Payout ${payoutId} succeeded.`);
      break;
    }

    case "PAYMENT.PAYOUTS-ITEM.UNCLAIMED": {
      const payout = event.resource;
      const payoutId = payout.sender_item_id;

      await client.query(
        `UPDATE writer_payouts
     SET status = 'unclaimed'
     WHERE payout_id = $1`,
        [payoutId]
      );

      console.warn(
        `⚠️ Payout ${payoutId} unclaimed. Writer may need to accept or fix email.`
      );
      break;
    }

    case "PAYMENT.PAYOUTS-ITEM.FAILED": {
      const payout = event.resource;
      const payoutId = payout.sender_item_id;

      await client.query(
        `UPDATE writer_payouts
     SET status = 'failed'
     WHERE payout_id = $1`,
        [payoutId]
      );

      console.error(`❌ Payout ${payoutId} failed.`);
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

      //Update payment re

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
