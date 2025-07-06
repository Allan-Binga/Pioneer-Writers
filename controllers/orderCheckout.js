const client = require("../config/dbConfig");
const dotenv = require("dotenv");
const paypal = require("@paypal/checkout-server-sdk");
const Stripe = require("stripe");
const Joi = require("joi")

dotenv.config();

// PayPal SDK setup
const environment = new paypal.core.SandboxEnvironment(
  process.env.PAYPAL_CLIENT_ID,
  process.env.PAYPAL_CLIENT_SECRET
);
const paypalClient = new paypal.core.PayPalHttpClient(environment);

//Stripe SDK Setup
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

//Create Paypal Checkout
const paypalCheckout = async (req, res) => {
  const userId = req.userId;
  console.log(userId);
  try {
    // Get the order from your DB
    const orderQuery = `SELECT * FROM orders WHERE user_id = $1 AND order_status = 'Pending'`;
    const { rows } = await client.query(orderQuery, [userId]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "Order not found." });
    }

    const order = rows[0];
    const totalAmount = order.checkout_amount;
    const orderId = order.order_id;

    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer("return=representation");
    request.requestBody({
      intent: "CAPTURE",
      purchase_units: [
        {
          reference_id: orderId.toString(),
          amount: {
            currency_code: "USD",
            value: totalAmount.toString(),
          },
        },
      ],
      application_context: {
        return_url: `${process.env.CLIENT_URL}/payment/successful`,
        cancel_url: `${process.env.CLIENT_URL}/payment/failed`,
      },
    });

    const paypalResponse = await paypalClient.execute(request);
    const approvalUrl = paypalResponse.result.links.find(
      (link) => link.rel === "approve"
    ).href;

    res.status(200).json({ approvalUrl });
  } catch (error) {
    console.error("Error creating PayPal order:", error);
    res.status(500).json({ error: "Failed to create PayPal order." });
  }
};

//Stripe Checkout
const stripeCheckout = async (req, res) => {
  const userId = req.userId;

  try {
    // 1. Fetch user's pending order
    const orderQuery = `SELECT * FROM orders WHERE user_id = $1 AND order_status = 'Pending'`;
    const orderResult = await client.query(orderQuery, [userId]);

    if (orderResult.rows.length === 0) {
      return res.status(404).json({ error: "Order not found" });
    }

    const order = orderResult.rows[0];
    const orderNumber = order.order_id;
    const paymentType = order.payment_option || "Full";
    const orderAmount = order.checkout_amount;

    // 2. Fetch user's email and username
    const userQuery = `SELECT email, username FROM users WHERE user_id = $1`;
    const userResult = await client.query(userQuery, [userId]);

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const { email, username } = userResult.rows[0];

    // 3. Insert a new pending payment
    const now = new Date();
    const insertQuery = `
      INSERT INTO payments (order_id, user_id, amount, payment_type, payment_status, payment_method, transaction_reference, paid_at, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING payment_id
    `;
    const insertValues = [
      orderNumber,
      userId,
      orderAmount,
      paymentType,
      "pending",
      "Google Pay",
      orderNumber, // Assuming this doubles as reference
      now,
      now,
      now,
    ];
    const paymentInsertResult = await client.query(insertQuery, insertValues);
    const paymentId = paymentInsertResult.rows[0].payment_id;

    // 4. Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      // payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Order #${orderNumber} Payment`,
            },
            unit_amount: Math.round(orderAmount * 100),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/payment/successful`,
      cancel_url: `${process.env.CLIENT_URL}/payment/failed`,
      metadata: {
        paymentId: paymentId.toString(),
        userId: userId.toString(),
        orderNumber: orderNumber.toString(),
        userEmail: email,
      },
    });

    return res.status(200).json({ sessionUrl: session.url });
  } catch (error) {
    console.error("Stripe checkout error:", error.message);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

// Google Pay Intent
const handleGooglePayIntent = async (req, res) => {
  const { paymentMethodId } = req.body;
  const userId = req.userId;

  try {
    // Validate request body
    const schema = Joi.object({
      paymentMethodId: Joi.string().required(),
    });

    const { error } = schema.validate({ paymentMethodId });
    if (error) return res.status(400).json({ error: error.details[0].message });

    // 1. Get user's pending order
    const orderResult = await client.query(
      `SELECT * FROM orders WHERE user_id = $1 AND order_status = 'Pending' ORDER BY created_at DESC LIMIT 1`,
      [userId]
    );

    if (orderResult.rows.length === 0) {
      return res
        .status(404)
        .json({ error: "No pending order found for this user" });
    }

    const order = orderResult.rows[0];
    const orderId = order.order_id;
    const orderAmount = order.checkout_amount;
    const paymentType = order.payment_option || "Full";

    // 2. Create and confirm the PaymentIntent
    const intent = await stripe.paymentIntents.create({
      amount: Math.round(orderAmount * 100), // Convert to cents
      currency: "usd",
      payment_method: paymentMethodId,
      payment_method_types: ["card"], // Google Pay uses 'card' type
      confirmation_method: "manual",
      confirm: true,
      metadata: {
        order_id: orderId,
        user_id: userId,
      },
      return_url: `${process.env.FRONTEND_URL}/order-payment`,
    });

    if (intent.status === "requires_action") {
      return res.json({
        requiresAction: true,
        clientSecret: intent.client_secret,
        orderId: orderId,
      });
    } else if (intent.status === "succeeded") {
      // 3. Save payment as Paid
      const now = new Date();
      await client.query(
        `
        INSERT INTO payments (
          order_id, user_id, amount, payment_type,
          payment_status, payment_method, transaction_reference,
          paid_at, created_at, updated_at
        )
        VALUES ($1, $23, $4, $5, $6, $7, $8, $9, $10)
      `,
        [
          orderId,
          userId,
          orderAmount,
          paymentType,
          "Paid",
          "Google Pay",
          intent.id,
          now,
          now,
          now,
        ]
      );

      // 4. Update order status
      await client.query(
        `UPDATE orders SET order_status = $1, updated_at = $2 WHERE order_id = $3 AND user_id = $4`,
        ["Paid", now, orderId, userId]
      );

      return res.json({ success: true, orderId: orderId });
    } else {
      return res.status(400).json({ error: "Payment failed" });
    }
  } catch (err) {
    console.error("Google Pay Intent Error:", err.message);
    return res.status(500).json({
      error: err.type === "StripeCardError" ? err.message : "Payment failed",
    });
  }
};

module.exports = {
  paypalCheckout,
  handleGooglePayIntent,
  stripeCheckout,
};
