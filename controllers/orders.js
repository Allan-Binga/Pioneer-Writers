const client = require("../config/dbConfig");
const Joi = require("joi");

//Post Order
const postOrder = async (req, res) => {
  try {
    const schema = Joi.object({
      topic_field: Joi.string().required(),
      type_of_service: Joi.string().required(),
      document_type: Joi.string().required(),
      writer_level: Joi.string().required(),
      paper_format: Joi.string().required(),
      english_type: Joi.string().required(),
      pages: Joi.number().integer().min(1).required(),
      spacing: Joi.string().required(),
      number_of_words: Joi.number().integer().min(0),
      number_of_sources: Joi.number().integer().min(0),
      topic: Joi.string().required(),
      instructions: Joi.string().allow(""),
      writer_type: Joi.string().required(),
      deadline: Joi.date().iso().required(),
      base_price: Joi.number().min(0).required(),
      additional_fees: Joi.number().min(0),
      total_price: Joi.number().min(0).required(),
      amount_paid: Joi.number().min(0),
    });

    const { error, value } = schema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const uploadedFile = req.files?.[0]?.location || null;

    const query = `
      INSERT INTO orders (
        topic_field, type_of_service, document_type, writer_level,
        paper_format, english_type, pages, spacing, number_of_words,
        number_of_sources, topic, instructions, uploaded_file,
        writer_type, deadline, base_price, additional_fees, total_price
      )
      VALUES (
        $1, $2, $3, $4, $5,
        $6, $7, $8, $9, $10,
        $11, $12, $13, $14,
        $15, $16, $17, $18
      )
      RETURNING *;
    `;

    const values = [
      value.topic_field,
      value.type_of_service,
      value.document_type,
      value.writer_level,
      value.paper_format,
      value.english_type,
      value.pages,
      value.spacing,
      value.number_of_words,
      value.number_of_sources,
      value.topic,
      value.instructions,
      uploadedFile,
      value.writer_type,
      value.deadline,
      value.base_price,
      value.additional_fees,
      value.total_price,
    ];

    const { rows } = await client.query(query, values);
    res.status(201).json({
      message: "Order posted successfully. Proceed to checkout.",
      order: rows[0],
    });
  } catch (error) {
    console.error("Error posting order:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

//Step 2: Update order information
const completeOrderPost = async (req, res) => {
  try {
    const schema = Joi.object({
      writer_tip: Joi.number().min(0).allow(null),
      plagiarism_report: Joi.boolean().required(),
      payment_option: Joi.string().required(),
      coupon_code: Joi.string().allow(""),
      amount_paid: Joi.number().min(0).required(),
      total_price: Joi.number().min(0).required(),
    });

    const { error, value } = schema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const query = `
      UPDATE orders
      SET
        writer_tip = $1,
        plagiarism_report = $2,
        payment_option = $3,
        coupon_code = $4,
        amount_paid = $5,
        total_price = $6
      RETURNING *;
    `;

    const values = [
      value.writer_tip,
      value.plagiarism_report,
      value.payment_option,
      value.coupon_code,
      value.amount_paid,
      value.total_price,
    ];

    const { rows } = await client.query(query, values);

    if (!rows.length) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.status(200).json({
      message: "Order checkout updated successfully.",
      order: rows[0],
    });
  } catch (error) {
    console.error("Error updating checkout:", error);
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

//Update Order
const updateOrder = async (req, res) => {
  const userId = req.userId;
  try {
    const { orderId } = req.params;

    // Validation schema: all fields optional for PATCH
    const schema = Joi.object({
      topic_field: Joi.string(),
      type_of_service: Joi.string(),
      document_type: Joi.string(),
      writer_level: Joi.string(),
      paper_format: Joi.string(),
      english_type: Joi.string(),
      pages: Joi.number().integer().min(1),
      spacing: Joi.string(),
      number_of_words: Joi.number().integer().min(0),
      number_of_sources: Joi.number().integer().min(0),
      topic: Joi.string(),
      instructions: Joi.string().allow(""),
      writer_type: Joi.string(),
      deadline: Joi.date().iso(),
      writer_tip: Joi.number().min(0),
      plagiarism_report: Joi.boolean(),
      payment_option: Joi.string(),
      coupon_code: Joi.string().allow(""),
      base_price: Joi.number().min(0),
      additional_fees: Joi.number().min(0),
      total_price: Joi.number().min(0),
      amount_paid: Joi.number().min(0),
    }).min(1); // require at least one field

    const { error, value } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    // Add uploaded file if available
    const uploadedFiles = req.files || [];
    const fileUrls = uploadedFiles.map((file) => file.location);
    if (fileUrls.length > 0) {
      value.uploaded_file = fileUrls[0]; // Optional: adjust to support multiple URLs
    }

    // Build dynamic SQL SET clause
    const fields = Object.keys(value);
    const setClause = fields
      .map((field, idx) => `${field} = $${idx + 1}`)
      .join(", ");
    const values = Object.values(value);

    const query = `
      UPDATE orders
      SET ${setClause}
      WHERE order_id = $${fields.length + 1}
      RETURNING *;
    `;

    values.push(orderId); // Add orderId for WHERE clause

    const { rows } = await client.query(query, values);

    if (rows.length === 0) {
      return res.status(404).json({ error: "Order not found." });
    }

    res.status(200).json({
      message: "Order updated successfully.",
      order: rows[0],
    });
  } catch (error) {
    console.error("Error updating order:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

//Delete Order
const deleteOrder = async (req, res) => {
  const userId = req.userId;
  const { orderId } = req.params;

  try {
    // Optional: Check if order exists and belongs to the user
    const checkQuery = `SELECT * FROM orders WHERE order_id = $1`;
    const checkResult = await client.query(checkQuery, [orderId]);

    if (checkResult.rows.length === 0) {
      return res.status(404).json({ error: "Order not found." });
    }

    const order = checkResult.rows[0];

    // If you want to restrict deletion to the owner only
    // if (order.user_id !== userId) {
    //   return res.status(403).json({ error: "Unauthorized to delete this order." });
    // }

    // Proceed with deletion
    const deleteQuery = `DELETE FROM orders WHERE order_id = $1 RETURNING *`;
    const result = await client.query(deleteQuery, [orderId]);

    res.status(200).json({
      message: "Order deleted successfully.",
      deletedOrder: result.rows[0],
    });
  } catch (error) {
    console.error("Error deleting order:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  postOrder,
  completeOrderPost,
  getOrders,
  getUsersOrders,
  updateOrder,
  deleteOrder,
};
