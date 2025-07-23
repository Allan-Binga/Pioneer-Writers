const client = require("../config/dbConfig");

// Fetch Dashboard Details
const getDashboard = async (req, res) => {
  const userId = req.userId;

  try {
    const { rows: orders } = await client.query(
      "SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC",
      [userId]
    );

    // Initialize counters
    const statusCounters = {
      completed: 0,
      inProgress: 0,
      all: orders.length,
      disputed: 0,
      unconfirmed: 0,
      draft: 0,
      paid: 0,
      cancelled: 0,
      submitted: 0,
    };

    // Count each order by status
    orders.forEach((order) => {
      const rawStatus = order.order_status?.toLowerCase();

      // Special case for 'Assigned' status
      if (rawStatus === "assigned") {
        statusCounters.inProgress++;
      } else {
        // Other statuses must match keys in the statusCounters
        const mappedKeys = [
          "completed",
          "disputed",
          "unconfirmed",
          "draft",
          "paid",
          "cancelled",
          "submitted",
        ];

        if (mappedKeys.includes(rawStatus)) {
          statusCounters[rawStatus]++;
        }
      }
    });

    // Prepare recent orders (limit to 3)
    const recentOrders = orders.slice(0, 3).map((order) => ({
      id: order.order_id,
      title: order.topic,
      status: formatStatus(order.order_status),
      date: new Date(order.created_at).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
    }));

    res.status(200).json({
      dashboardStats: statusCounters,
      recentOrders,
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//Fetch Administrator Details
const getAdminDashboard = async (req, res) => {
  try {
    // 1. Fetch all orders
    const { rows: orders } = await client.query(
      "SELECT * FROM orders ORDER BY created_at DESC"
    );

    // 2. Compute status counters
    const statusCounters = {
      completed: 0,
      inProgress: 0,
      all: orders.length,
      disputed: 0,
      unconfirmed: 0,
      draft: 0,
      paid: 0,
      cancelled: 0,
      submitted: 0,
    };

    orders.forEach((order) => {
      const rawStatus = order.order_status?.toLowerCase();

      if (rawStatus === "assigned") {
        statusCounters.inProgress++;
      } else if (statusCounters.hasOwnProperty(rawStatus)) {
        statusCounters[rawStatus]++;
      }
    });

    // 3. Get recent orders (latest 5)
    const recentOrders = orders.slice(0, 5).map((order) => ({
      id: order.order_id,
      title: order.topic,
      userId: order.user_id,
      writerId: order.writer_id,
      status: formatStatus(order.order_status),
      date: new Date(order.created_at).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
    }));

    // 4. Fetch total counts
    const [
      {
        rows: [{ total_users }],
      },
      {
        rows: [{ total_writers }],
      },
      {
        rows: [{ total_admins }],
      },
      {
        rows: [{ total_payments, total_revenue }],
      },
    ] = await Promise.all([
      client.query("SELECT COUNT(*)::int AS total_users FROM users"),
      client.query("SELECT COUNT(*)::int AS total_writers FROM writers"),
      client.query("SELECT COUNT(*)::int AS total_admins FROM administrators"),
      client.query(`
        SELECT COUNT(*)::int AS total_payments, COALESCE(SUM(amount), 0)::numeric(10,2) AS total_revenue
        FROM payments
        WHERE payment_status = 'completed'
      `),
    ]);

    // (Optional) Placeholder for future: Total messages
    // const { rows: [{ total_messages }] } = await client.query("SELECT COUNT(*) AS total_messages FROM messages");

    // 5. Send response
    res.status(200).json({
      dashboardStats: {
        orderStats: statusCounters,
        userCount: total_users,
        writerCount: total_writers,
        adminCount: total_admins,
        paymentCount: total_payments,
        totalRevenue: parseFloat(total_revenue),
      },
      recentOrders,
    });
  } catch (error) {
    console.error("Admin dashboard error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Utility to format statuses for display in recent orders
function formatStatus(status) {
  const lower = status?.toLowerCase();
  const map = {
    assigned: "In Progress",
    completed: "Completed",
    draft: "Draft",
    cancelled: "Cancelled",
    submitted: "Submitted",
    disputed: "Disputed",
    unconfirmed: "Unconfirmed",
    paid: "Paid",
  };
  return map[lower] || status;
}

module.exports = { getDashboard, getAdminDashboard };
