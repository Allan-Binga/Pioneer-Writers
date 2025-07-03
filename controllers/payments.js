const client = require("../config/dbConfig");

//Make a payment
const makePayment = async (req, res) => {
  try {
  } catch (error) {}
};

//Fetch Payments
const getPayments = async (req, res) => {
  try {
    const payments = await client.query("SELECT * FROM payments");
    res.status(200).json(payments.rows);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch payments" });
  }
};

module.exports = { makePayment, getPayments };
