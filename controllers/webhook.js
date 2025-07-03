const client = require("../config/dbConfig");

//PayPal Webhook Handler
const handlePaypalWebhook = async (req, res) => {
  const event = req.body;

  switch (event.event_type) {
    case "PAYMENT.CAPTURE.COMPLETED": {
      const capture = event.resource;
      const orderId = capture.supplementary_data?.related_ids?.order_id;
      const transactionId = capture.id;

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
        const paymentType = order.payment_option || "Full";

        // 1. Update order status
        await client.query(
          `UPDATE orders SET order_status = $1 WHERE order_id = $2`,
          ["Paid", orderId]
        );

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
          "Completed",
          "PayPal",
          transactionId,
        ]);

        console.log(`Payment recorded for order ${orderId}`);
      } catch (error) {
        console.error("Error handling completed webhook:", error);
      }

      break;
    }

    case "PAYMENT.CAPTURE.DENIED": {
      const capture = event.resource;
      const orderId = capture.supplementary_data?.related_ids?.order_id;

      try {
        // 1. Mark order as failed
        await client.query(
          `UPDATE orders SET payment_status = $1 WHERE order_id = $2`,
          ["Failed", orderId]
        );

        console.warn(`❌ Payment failed for order ${orderId}`);
      } catch (error) {
        console.error("Error handling denied webhook:", error);
      }

      break;
    }

    default:
      console.log("Unhandled webhook event:", event.event_type);
  }

  res.status(200).send("Webhook received");
};

module.exports = { handlePaypalWebhook };
