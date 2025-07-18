const client = require("../config/dbConfig");
const Joi = require("joi");

const updateDraft = async (req, res) => {
  const userId = req.userId;
  const orderId = req.params.order_id;

  const schema = Joi.object({
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
    payment_option: Joi.string().allow(""),
    coupon_code: Joi.string().allow(""),
  });

  const { error, value } = schema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  try {
    const checkQuery = `SELECT * FROM orders WHERE order_id = $1 AND user_id = $2 AND order_status = 'draft'`;
    const checkResult = await client.query(checkQuery, [orderId, userId]);

    if (checkResult.rows.length === 0) {
      return res.status(404).json({ error: "Draft not found or unauthorized" });
    }

    const uploadedFile = req.files?.[0]?.location || null;

    const updateQuery = `
      UPDATE orders SET
        subject = $1, type_of_service = $2, document_type = $3,
        writer_level = $4, paper_format = $5, english_type = $6,
        pages = $7, spacing = $8, number_of_words = $9,
        number_of_sources = $10, topic = $11, instructions = $12,
        uploaded_file = $13, writer_category = $14, deadline = $15,
        total_price = $16, checkout_amount = $17, writer_tip = $18,
        plagiarism_report = $19, payment_option = $20, coupon_code = $21,
        updated_at = NOW()
      WHERE order_id = $22 AND user_id = $23
      RETURNING *;
    `;

    const values = [
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
      orderId,
      userId,
    ];

    const result = await client.query(updateQuery, values);
    res.json({
      message: "Draft updated successfully.",
      draft: result.rows[0],
    });
  } catch (err) {
    console.error("Error updating draft:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

//Get Drafts
const getDrafts = async (req, res) => {
  try {
    const drafts = await client.query(
      "SELECT * FROM orders WHERE order_status = 'draft'"
    );
    res.status(200).json(drafts.rows);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch drafts" });
  }
};

//Delete Drafts
const deleteDrafts = async (req, res) => {};

module.exports = { updateDraft, getDrafts, deleteDrafts };
