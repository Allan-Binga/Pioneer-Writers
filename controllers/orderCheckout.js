const client = require("../config/dbConfig");
const dotenv = require("dotenv");
const paypal = require("@paypal/checkout-server-sdk");
const Stripe = require("stripe");

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
      "Pending",
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
      payment_method_types: ["card"],
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

module.exports = {
  paypalCheckout,
  stripeCheckout,
};
