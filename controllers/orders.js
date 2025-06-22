const client = require("../config/dbConfig");

//Post an order
const postOrder = async (req, res) => {
  try {
    const {
      topic_field,
      type_of_service,
      document_type,
      writer_level,
      paper_format,
      english_type,
      pages,
      spacing,
      number_of_words,
      number_of_sources,
      topic,
      instructions,
      writer_type,
      deadline,
      writer_tip,
      plagiarism_report,
      payment_option,
      coupon_code,
      base_price,
      additional_fees,
      total_price,
      amount_paid,
    } = req.body;

    // Optional file path from multer (if file is uploaded)
    const uploadedFile = req.file ? req.file.path : null;

    // Create the order
    const query = `
      INSERT INTO orders (
        topic_field, type_of_service, document_type, writer_level,
        paper_format, english_type, pages, spacing, number_of_words,
        number_of_sources, topic, instructions, uploaded_file,
        writer_type, deadline, writer_tip, plagiarism_report,
        payment_option, coupon_code, base_price, additional_fees,
        total_price, amount_paid
      )
      VALUES (
        $1, $2, $3, $4,
        $5, $6, $7, $8, $9,
        $10, $11, $12, $13,
        $14, $15, $16, $17,
        $18, $19, $20, $21,
        $22, $23
      )
      RETURNING *;
    `;

    const values = [
      topic_field,
      type_of_service,
      document_type,
      writer_level,
      paper_format,
      english_type,
      pages,
      spacing,
      number_of_words,
      number_of_sources,
      topic,
      instructions,
      uploadedFile,
      writer_type,
      deadline,
      writer_tip,
      plagiarism_report,
      payment_option,
      coupon_code,
      base_price,
      additional_fees,
      total_price,
      amount_paid,
    ];

    const { rows } = await client.query(query, values);

    res.status(201).json({
      message: "Order posted successfully, awaiting checkout.",
      order: rows[0],
    });
  } catch (error) {
    console.error("Error posting order:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

//Fetch orders
const getOrders = async (req, res) => {
  const orders = await client.query("SELECT * FROM orders");
  res.status(200).json(orders.rows);
  try {
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch orders." });
  }
};

//Fetch my orders
const getUsersOrders = async (req, res) => {
  const userId = req.userId;
  const usersOrders = await client.query(
    "SELECT * FROM orders WHERE user_id = $1"
  );
  const result = await client.query(usersOrders, [userId]);
  res.status(200).json(result.rows);
  try {
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch orders." });
  }
};

module.exports = { postOrder, getOrders, getUsersOrders };
