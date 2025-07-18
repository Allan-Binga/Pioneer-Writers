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

module.exports = { getDashboard };
