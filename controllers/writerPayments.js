const client = require("../config/dbConfig");
const axios = require("axios");

//Fetch All Payments
const fetchAllPayments = async (req, res) => {
  const writerId = req.writerId;
  try {
    const result = await client.query(
      `SELECT * FROM writer_payouts WHERE writer_id = $1 ORDER BY created_at DESC`,
      [writerId]
    );

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching payouts:", error);
    res.status(500).json({ message: "Failed to fetch payouts." });
  }
};

//Add A Payout Account
const addPayoutAccount = async (req, res) => {
  const writerId = req.writerId;
  const { paypalEmail } = req.body;

  if (!paypalEmail) {
    return res.status(400).json({ message: "PayPal email is required" });
  }

  try {
    // Update the writer record
    const result = await client.query(
      `UPDATE writers
       SET paypal_email = $1
       WHERE writer_id = $2
       RETURNING writer_id, full_name, email, paypal_email`,
      [paypalEmail, writerId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Writer not found" });
    }

    return res.status(200).json({
      message: "PayPal account added successfully",
      writer: result.rows[0],
    });
  } catch (error) {
    console.error("Error adding PayPal account:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//Fetch Payouts Available For Withdrawal
const fetchMaturedPayouts = async (req, res) => {
  const writerId = req.writerId;
  try {
    const result = await client.query(
      `SELECT * FROM writer_payouts WHERE writer_id = $1 AND status = 'pending' AND matured_at <= NOW()`,
      [writerId]
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching payouts:", error);
    res.status(500).json({ message: "Failed to fetch payouts." });
  }
};

//Withdraw Payout
const withdrawPayouts = async (req, res) => {
  const writerId = req.writerId;
  try {
    // 1. Get matured, pending payouts
    const { rows: payouts } = await client.query(
      `SELECT payout_id, amount, order_id
       FROM writer_payouts
       WHERE writer_id = $1
         AND status = 'pending'
         AND matured_at <= NOW()`,
      [writerId]
    );

    if (payouts.length === 0) {
      return res.status(400).json({ message: "No matured payouts available." });
    }

    //2 Fetch Writer's Paypal Email
    const { rows: writer } = await client.query(
      `SELECT email FROM writers WHERE writer_id = $1`,
      [writerId]
    );

    if (!writer[0]?.email) {
      return res
        .status(400)
        .json({ message: "Writer has no PayPal email set." });
    }

    // 3. Build PayPal Payout request
    const items = payouts.map((p) => ({
      recipient_type: "EMAIL",
      amount: { value: Number(p.amount).toFixed(2), currency: "USD" },
      receiver: writer[0].email,
      note: `Payout for order ${p.order_id}`,
      sender_item_id: p.payout_id,
    }));

    const payload = {
      sender_batch_header: {
        sender_batch_id: "batch_" + Date.now(),
        email_subject: "You have a payout!",
      },
      items,
    };

    //4. Call PayPal API
    const tokenRes = await axios.post(
      "https://api-m.sandbox.paypal.com/v1/oauth2/token",
      "grant_type=client_credentials",
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        auth: {
          username: process.env.PAYPAL_CLIENT_ID,
          password: process.env.PAYPAL_CLIENT_SECRET,
        },
      }
    );

    const accessToken = tokenRes.data.access_token;

    const payoutRes = await axios.post(
      "https://api-m.sandbox.paypal.com/v1/payments/payouts",
      payload,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );

    // 5. Update DB as withdrawn
    const payoutIds = payouts.map((p) => p.payout_id);
    await client.query(
      `UPDATE writer_payouts
       SET status = 'withdrawn', withdrawn_at = NOW(), paypal_transaction_id = $1
       WHERE payout_id = ANY($2)`,
      [payoutRes.data.batch_header.payout_batch_id, payoutIds]
    );
    return res.status(200).json({
      message: "Payout successful",
      batchId: payoutRes.data.batch_header.payout_batch_id,
    });
  } catch (error) {
    console.error(
      "Error processing payout:",
      error.response?.data || error.message
    );
    return res.status(500).json({ message: "Server error during payout" });
  }
};

//Recent Withdrawals
const recentPayouts = async (req, res) => {
  const writerId = req.writerId;
  try {
    const result = await client.query(
      `SELECT * FROM writer_payouts WHERE writer_id = $1 AND status = 'withdrawn'`,
      [writerId]
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching payouts:", error);
    res.status(500).json({ message: "Failed to fetch payouts." });
  }
};

module.exports = {
  fetchAllPayments,
  addPayoutAccount,
  fetchMaturedPayouts,
  withdrawPayouts,
  recentPayouts,
};
