const client = require("../config/dbConfig");
const Joi = require("joi");

// Post/Update an order
const postOrder = async (req, res) => {
  const userId = req.userId; // From middleware
  try {
    const schema = Joi.object({
      order_id: Joi.string()
        .guid({ version: ["uuidv4"] }) // Validate as UUID v4
        .optional(), // Add order_id to schema
      subject: Joi.string().required(),
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
      writer_category: Joi.string().required(),
      deadline: Joi.date().iso().required(),
      total_price: Joi.number().min(0).required(),
      checkout_amount: Joi.number().min(0).required(),
      writer_tip: Joi.number().min(0).allow(null),
      plagiarism_report: Joi.boolean(),
      order_status: Joi.string()
        .valid("draft", "pending", "paid", "cancelled")
        .optional(),

      payment_option: Joi.string().allow(""),
      coupon_code: Joi.string().allow(""),
    });

    const { error, value } = schema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const uploadedFile = req.files?.[0]?.location || null;

    let query;
    let values;

    if (value.order_id) {
      // Check if the order exists and belongs to the user
      const checkQuery = `
        SELECT 1 FROM orders WHERE order_id = $1 AND user_id = $2
      `;
      const checkResult = await client.query(checkQuery, [
        value.order_id,
        userId,
      ]);
      if (checkResult.rows.length === 0) {
        return res
          .status(404)
          .json({ error: "Order not found or unauthorized" });
      }

      // Update existing order
      query = `
  INSERT INTO orders (
    subject, type_of_service, document_type, writer_level,
    paper_format, english_type, pages, spacing, number_of_words,
    number_of_sources, topic, instructions, uploaded_file,
    writer_category, deadline, total_price, checkout_amount,
    writer_tip, plagiarism_report, payment_option, coupon_code,
    user_id, order_status
  )
  VALUES (
    $1, $2, $3, $4, $5,
    $6, $7, $8, $9, $10,
    $11, $12, $13, $14,
    $15, $16, $17, $18, $19, $20,
    $21, $22, $23
  )
  RETURNING *;
`;

      values = [
        value.subject,
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
        value.writer_category,
        value.deadline,
        value.total_price,
        value.checkout_amount,
        value.writer_tip || null,
        value.plagiarism_report ?? false,
        value.payment_option || "",
        value.coupon_code || "",
        userId,
        value.order_status || "pending", // This is the key line
      ];
    } else {
      // Insert new order
      query = `
        INSERT INTO orders (
          subject, type_of_service, document_type, writer_level,
          paper_format, english_type, pages, spacing, number_of_words,
          number_of_sources, topic, instructions, uploaded_file,
          writer_category, deadline, total_price, checkout_amount,
          writer_tip, plagiarism_report, payment_option, coupon_code,
          user_id
        )
        VALUES (
          $1, $2, $3, $4, $5,
          $6, $7, $8, $9, $10,
          $11, $12, $13, $14,
          $15, $16, $17, $18, $19, $20,
          $21, $22
        )
        RETURNING *;
      `;
      values = [
        value.subject,
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
        value.writer_category,
        value.deadline,
        value.total_price,
        value.checkout_amount,
        value.writer_tip || null,
        value.plagiarism_report ?? false,
        value.payment_option || "",
        value.coupon_code || "",
        userId,
      ];
    }

    const { rows } = await client.query(query, values);

    if (rows.length === 0) {
      return res.status(404).json({ error: "Order not found or unauthorized" });
    }

    res.status(value.order_id ? 200 : 201).json({
      message: value.order_id
        ? "Order updated successfully."
        : "Order posted successfully. Proceed to checkout.",
      order: rows[0],
    });
  } catch (error) {
    console.error("Error processing order:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

//Fetch orders
const getOrders = async (req, res) => {
  try {
    const orders = await client.query("SELECT * FROM orders");
    res.status(200).json(orders.rows);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch orders." });
  }
};

//Fetch single order
const getSingleOrder = async (req, res) => {
  const userId = req.userId; // from authUser middleware
  const { orderId } = req.params;

  try {
    const { rows } = await client.query(
      "SELECT * FROM orders WHERE order_id = $1 AND user_id = $2",
      [orderId, userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Order not found." });
    }

    const order = rows[0];

    res.status(200).json(order);
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Fetch Single Admin Order
const getAdminSingleOrder = async (req, res) => {
  const { orderId } = req.params;

  try {
    const { rows } = await client.query(
      "SELECT * FROM orders WHERE order_id = $1",
      [orderId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Order not found." });
    }

    const order = rows[0];
    res.status(200).json(order);
  } catch (error) {
    console.error("Error fetching admin single order:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Fetch my orders
const getUsersOrders = async (req, res) => {
  const userId = req.userId;

  try {
    const result = await client.query(
      "SELECT * FROM orders WHERE user_id = $1",
      [userId]
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching user orders:", error.message);
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
      writer_category: Joi.string(),
      deadline: Joi.date().iso(),
      writer_tip: Joi.number().min(0),
      plagiarism_report: Joi.boolean(),
      payment_option: Joi.string(),
      coupon_code: Joi.string().allow(""),
      base_price: Joi.number().min(0),
      additional_fees: Joi.number().min(0),
      total_price: Joi.number().min(0),
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

    // Restrict deletion to owner
    if (order.user_id !== userId) {
      return res
        .status(403)
        .json({ error: "Unauthorized to delete this order." });
    }

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
  getOrders,
  getUsersOrders,
  updateOrder,
  deleteOrder,
  getSingleOrder,
  getAdminSingleOrder,
};
