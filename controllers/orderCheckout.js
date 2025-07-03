const client = require("../config/dbConfig");
const dotenv = require("dotenv");
const paypal = require("@paypal/checkout-server-sdk");

dotenv.config();

// PayPal SDK setup
const environment = new paypal.core.SandboxEnvironment(
  process.env.PAYPAL_CLIENT_ID,
  process.env.PAYPAL_CLIENT_SECRET
);
const paypalClient = new paypal.core.PayPalHttpClient(environment);

//Create Paypal Checkout
const paypalCheckout = async (req, res) => {
  const userId = req.userId;

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

module.exports = {
  paypalCheckout,
};
