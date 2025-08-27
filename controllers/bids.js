const client = require("../config/dbConfig");
const {
  sendBidStatusEmail,
  sendWriterOrderAssignmentEmail,
} = require("./emailService");

//Place Bids
const placeBid = async (req, res) => {
  const writerId = req.writerId;
  const { order_id, message } = req.body;

  try {
    //Check order existance
    const checkQuery = await client.query(
      `SELECT * FROM orders WHERE order_id = $1 AND assignment_status = 'public'`,
      [order_id]
    );

    if (checkQuery.rows.length === 0) {
      return res.status(404).json({ error: "Order not open for bidding." });
    }

    //Insert Bid
    await client.query(
      `INSERT INTO bids (order_id, writer_id, message)
       VALUES ($1, $2, $3)`,
      [order_id, writerId, message]
    );

    // Fetch client email
    const userId = checkQuery.rows[0].user_id;
    const emailResult = await client.query(
      `SELECT email FROM users WHERE user_id = $1`,
      [userId]
    );

    if (emailResult.rows.length > 0) {
      // Send email without blocking response
      sendBidStatusEmail(emailResult.rows[0].email, order_id);
    }

    res.status(201).json({ message: "Bid placed successfully." });
  } catch (error) {
    if (error.code === "23505") {
      // Unique violation
      return res
        .status(400)
        .json({ error: "You already placed a bid for this order" });
    }
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

//Remove Bid
const removeBid = async (req, res) => {
  const writerId = req.writerId;
  const { orderId } = req.params;

  try {
    // Check if bid exists for this writer & order
    const bidCheck = await client.query(
      `SELECT * FROM bids WHERE order_id = $1 AND writer_id = $2`,
      [orderId, writerId]
    );

    if (bidCheck.rows.length === 0) {
      return res.status(404).json({ error: "No bid found for this order." });
    }

    //Delete Bid
    await client.query(
      `DELETE FROM bids WHERE order_id = $1 AND writer_id = $2`,
      [orderId, writerId]
    );

    res.status(200).json({ message: "Bid removed successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Fetch bids with role-based filtering
const getBids = async (req, res) => {
  try {
    let query;
    let params = [];

    if (req.user.role === "Writer") {
      // Writers: only their own bids
      query = `
        SELECT b.bid_id, b.order_id, b.message, b.bid_status, b.created_at,
               o.subject, o.topic, o.deadline, o.total_price
        FROM bids b
        JOIN orders o ON b.order_id = o.order_id
        WHERE b.writer_id = $1
        ORDER BY b.created_at DESC
      `;
      params = [req.user.id];
    } else if (req.user.role === "Client") {
      // Clients: bids on their orders
      query = `
        SELECT b.bid_id, b.order_id, b.message, b.bid_status, b.created_at,
               w.writer_id, w.full_name, w.rating,
               o.subject, o.topic, o.deadline, o.total_price
        FROM bids b
        JOIN orders o ON b.order_id = o.order_id
        JOIN writers w ON b.writer_id = w.writer_id
        WHERE o.user_id = $1
        ORDER BY b.created_at DESC
      `;
      params = [req.user.id];
    } else if (req.user.role === "Admin") {
      // Admins: all bids
      query = `
        SELECT b.bid_id, b.order_id, b.message, b.bid_status, b.created_at,
               w.full_name, w.rating,
               o.subject, o.topic, o.deadline, o.total_price
        FROM bids b
        JOIN orders o ON b.order_id = o.order_id
        JOIN writers w ON b.writer_id = w.writer_id
        ORDER BY b.created_at DESC
      `;
    } else {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const bids = await client.query(query, params);
    res.status(200).json(bids.rows);
  } catch (error) {
    console.error("Error fetching bids:", error);
    res.status(500).json({ message: "Failed to fetch bids." });
  }
};

// Fetch Bids for a single order
const getBidsForOrder = async (req, res) => {
  const { orderId } = req.params;

  try {
    // First check the order status
    const orderResult = await client.query(
      `SELECT assignment_status FROM orders WHERE order_id = $1`,
      [orderId]
    );

    if (orderResult.rowCount === 0) {
      return res.status(404).json({ message: "Order not found." });
    }

    const { assignment_status } = orderResult.rows[0];

    // If order is not public, return empty/no bids
    if (assignment_status !== "public") {
      return res.status(200).json([]);
    }

    // Otherwise fetch bids normally
    const bids = await client.query(
      `SELECT b.bid_id, b.order_id, b.message, b.bid_status, b.created_at,
              w.full_name, w.rating
       FROM bids b
       JOIN writers w ON b.writer_id = w.writer_id
       WHERE b.order_id = $1
       ORDER BY b.created_at DESC`,
      [orderId]
    );

    res.status(200).json(bids.rows);
  } catch (error) {
    console.error("Error fetching bids for order:", error);
    res.status(500).json({ message: "Failed to fetch bids for this order." });
  }
};

//Assign Writer or Accept Bids
const assignWriter = async (req, res) => {
  const userId = req.userId;
  const { bidId } = req.params;
  console.log(bidId);
  try {
    //Find bid and verify ownership
    const bidData = await client.query(
      `SELECT b.order_id, 
          b.writer_id, 
          o.user_id, 
          w.email AS writer_email
   FROM bids b
   JOIN orders o ON b.order_id = o.order_id
   JOIN writers w ON b.writer_id = w.writer_id
   WHERE b.bid_id = $1`,
      [bidId]
    );

    if (bidData.rows.length === 0) {
      return res.status(404).json({ error: "Bid not found." });
    }

    const {
      order_id,
      writer_id,
      user_id: orderOwner,
      writer_email,
    } = bidData.rows[0];

    if (orderOwner !== userId) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    //Assign Writer and Update Bid Status
    await client.query("BEGIN");

    await client.query(
      `UPDATE orders
       SET writer_id = $1, assignment_status = 'assigned'
       WHERE order_id = $2`,
      [writer_id, order_id]
    );

    await client.query(
      `UPDATE bids SET bid_status = 'accepted' WHERE bid_id = $1`,
      [bidId]
    );

    await client.query(
      `UPDATE bids SET bid_status = 'rejected'
       WHERE order_id = $1 AND bid_id <> $2`,
      [order_id, bidId]
    );

    await client.query("COMMIT");

    // Fire-and-forget email (no await)
    sendWriterOrderAssignmentEmail(writer_email, order_id);

    res.json({ message: "Writer assigned successfully" });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  placeBid,
  removeBid,
  getBids,
  getBidsForOrder,
  assignWriter,
};
