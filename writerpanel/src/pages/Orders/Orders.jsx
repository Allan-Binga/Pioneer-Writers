import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import axios from "axios";
import { notify } from "../../utils/toast";
import { backend } from "../../backend";
import { useEffect, useMemo, useState } from "react";
import { Search, Grid, List, X, Paperclip } from "lucide-react";
import Spinner from "../../components/Spinner";

// Calculate remaining time in days/hours/minutes
const getTimeRemaining = (deadline) => {
  const total = new Date(deadline) - new Date();
  if (total <= 0) return "Expired";

  const days = Math.floor(total / (1000 * 60 * 60 * 24));
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((total / (1000 * 60)) % 60);

  if (days > 0) return `${days}d ${hours}h ${minutes}m`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
};

// Check if order is urgent (less than 24 hours)
const isUrgent = (deadline) => {
  const total = new Date(deadline) - new Date();
  return total > 0 && total < 24 * 60 * 60 * 1000;
};

function Orders() {
  const [bidData, setBidData] = useState({
    orderId: "",
    message: "",
  });
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("table");
  const [now, setNow] = useState(new Date());
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [placedBids, setPlacedBids] = useState(new Set());

  // Live update countdown every minute
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Fetch orders
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(`${backend}/orders/all/orders`, {
          withCredentials: true,
        });
        setOrders(data);
        // Initialize placedBids based on has_bid
        const bids = new Set(
          data.filter((order) => order.has_bid).map((order) => order.order_id)
        );
        setPlacedBids(bids);
      } catch (error) {
        notify.error("Failed to fetch public orders.");
        console.error("Error fetching public orders:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  // Fetch order details when modal opens
  useEffect(() => {
    if (selectedOrder) {
      const fetchOrderDetails = async () => {
        setModalLoading(true);
        try {
          const { data } = await axios.get(
            `${backend}/orders/public/${selectedOrder.order_id}`,
            { withCredentials: true }
          );
          setOrderDetails(data);
          // Update placedBids if the writer has bid on this order
          if (data.has_bid) {
            setPlacedBids((prev) => new Set(prev).add(data.order_id));
          }
        } catch (error) {
          notify.error("Failed to fetch order details.");
          console.error("Error fetching order details:", error);
        } finally {
          setModalLoading(false);
        }
      };
      fetchOrderDetails();
    }
  }, [selectedOrder]);

  // Extract unique subjects for filter tabs
  const subjects = useMemo(() => {
    const uniqueSubjects = Array.from(new Set(orders.map((o) => o.subject)));
    return ["all", ...uniqueSubjects];
  }, [orders]);

  // Filter orders by subject and search query
  const filteredOrders = useMemo(() => {
    let result = orders;
    if (activeTab !== "all") {
      result = result.filter(
        (order) => order.subject.toLowerCase() === activeTab.toLowerCase()
      );
    }
    if (searchQuery) {
      result = result.filter(
        (order) =>
          order.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order.order_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order.subject.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return result;
  }, [orders, activeTab, searchQuery]);

  const handlePlaceBid = async (e) => {
    e.preventDefault();
    setModalLoading(true);

    try {
      const response = await axios.post(
        `${backend}/bids/place-bid`,
        {
          order_id: bidData.orderId,
          message: bidData.message,
        },
        { withCredentials: true }
      );

      notify.success(response.data.message);

      //Track biding on an order
      setPlacedBids((prev) => new Set(prev).add(bidData.orderId));

      setBidData({ orderId: "", message: "" });

      // Close modal after success
      setTimeout(() => {
        closeModal();
      }, 300);
    } catch (error) {
      notify.error(error.response?.data?.error || "Failed to place bid");
      console.error("Error placing bid:", error);
    } finally {
      setModalLoading(false);
    }
  };

  const handleRemoveBid = async () => {
    setModalLoading(true);
    try {
      const response = await axios.delete(
        `${backend}/bids/remove-bid/${selectedOrder.order_id}`,
        { withCredentials: true }
      );

      notify.success(response.data.message || "Bid removed successfully.");

      // Update placedBids set
      setPlacedBids((prev) => {
        const updated = new Set(prev);
        updated.delete(selectedOrder.order_id);
        return updated;
      });

      // Close modal
      setTimeout(() => {
        closeModal();
      }, 300);
    } catch (error) {
      notify.error(error.response?.data?.error || "Failed to remove bid");
      console.error("Error removing bid:", error);
    } finally {
      setModalLoading(false);
    }
  };

  const openOrderModal = (order) => {
    setSelectedOrder(order);
    setBidData({ ...bidData, orderId: order.order_id });
  };

  const closeModal = () => {
    setSelectedOrder(null);
    setOrderDetails(null);
    setBidData({ orderId: "", message: "" });
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-slate-50 to-gray-100">
      <Navbar />
      <main className="flex-1 pt-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-slate-900 mt-12">
              Available Orders
            </h1>
            <div className="flex gap-4">
              <button
                onClick={() =>
                  setViewMode(viewMode === "table" ? "card" : "table")
                }
                className="p-2 rounded-full bg-white text-slate-600 hover:bg-slate-100 transition-colors"
                title={
                  viewMode === "table"
                    ? "Switch to card view"
                    : "Switch to table view"
                }
              >
                {viewMode === "table" ? <Grid size={20} /> : <List size={20} />}
              </button>
            </div>
          </div>

          {/* Search and Filter Section */}
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              {subjects.map((subj) => (
                <button
                  key={subj}
                  onClick={() => setActiveTab(subj)}
                  className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition-all duration-200 ${
                    activeTab === subj
                      ? "bg-blue-600 text-white shadow-md"
                      : "bg-white text-slate-700 border border-slate-300 hover:bg-blue-50 hover:border-blue-400"
                  }`}
                >
                  {subj}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:max-w-xs">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search by ID, topic, or subject..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-gray-00 bg-white text-sm"
              />
            </div>
          </div>

          {/* Orders Display */}
          {loading ? (
            <div className="p-8 text-center">
              <Spinner size="medium" />
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="p-8 text-center text-slate-600 text-base bg-white rounded-2xl shadow-md border border-slate-200">
              Nothing to bid for at the moment. Please check back later.
            </div>
          ) : viewMode === "table" ? (
            <div className="overflow-x-auto bg-white rounded-2xl shadow-md border border-slate-200">
              <table className="min-w-full divide-y divide-slate-200 text-sm">
                <thead className="bg-slate-100 text-slate-800">
                  <tr>
                    <th className="px-6 py-4 text-left font-semibold text-sm">
                      Order ID
                    </th>
                    <th className="px-6 py-4 text-left font-semibold text-sm">
                      Subject
                    </th>
                    <th className="px-6 py-4 text-left font-semibold text-sm">
                      Topic
                    </th>
                    <th className="px-6 py-4 text-left font-semibold text-sm">
                      Deadline
                    </th>
                    <th className="px-6 py-4 text-left font-semibold text-sm">
                      Pages
                    </th>
                    <th className="px-6 py-4 text-left font-semibold text-sm">
                      Price
                    </th>
                    <th className="px-6 py-4 text-left font-semibold text-sm">
                      Bid Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredOrders.map((order) => (
                    <tr
                      key={order.order_id}
                      className="hover:bg-blue-50 transition-colors duration-150 cursor-pointer"
                      onClick={() => openOrderModal(order)}
                    >
                      <td className="px-6 py-4 font-medium">
                        {order.order_id}
                      </td>
                      <td className="px-6 py-4 capitalize">{order.subject}</td>
                      <td className="px-6 py-4">{order.topic}</td>
                      <td className="px-6 py-4 font-medium">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            isUrgent(order.deadline)
                              ? "bg-red-100 text-red-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {getTimeRemaining(order.deadline)}
                          {isUrgent(order.deadline) && (
                            <span className="ml-2 text-red-600">Urgent</span>
                          )}
                        </span>
                      </td>
                      <td className="px-6 py-4">{order.pages}</td>
                      <td className="px-6 py-4 font-semibold">
                        ${parseFloat(order.total_price).toFixed(2)}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => openOrderModal(order)}
                          disabled={placedBids.has(order.order_id)}
                          className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors cursor-pointer ${
                            placedBids.has(order.order_id)
                              ? "bg-amber-500 text-white cursor-pointer"
                              : "bg-blue-500 text-white hover:bg-blue-600"
                          }`}
                        >
                          {placedBids.has(order.order_id)
                            ? "Bid Placed"
                            : "Place Bid"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredOrders.map((order) => (
                <div
                  key={order.order_id}
                  className="bg-white rounded-2xl shadow-md border border-slate-200 p-6 hover:shadow-lg transition-shadow duration-200 cursor-pointer"
                  onClick={() => openOrderModal(order)}
                >
                  <div className="flex justify-between items-start">
                    <span className="text-blue-600 font-semibold text-base">
                      {order.order_id}
                    </span>
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        isUrgent(order.deadline)
                          ? "bg-red-100 text-red-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {getTimeRemaining(order.deadline)}
                    </span>
                  </div>
                  <h3 className="mt-2 text-sm font-medium text-slate-900 capitalize">
                    {order.subject}
                  </h3>
                  <p className="mt-1 text-sm text-slate-600">{order.topic}</p>
                  <div className="mt-4 flex justify-between items-center">
                    <span className="text-sm text-slate-600">
                      {order.pages} Pages
                    </span>
                    <span className="text-lg font-semibold text-slate-900">
                      ${parseFloat(order.total_price).toFixed(2)}
                    </span>
                  </div>
                  {isUrgent(order.deadline) && (
                    <span className="mt-2 inline-block text-xs text-red-600 font-medium">
                      Urgent
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto border border-slate-200">
              <div className="p-5">
                {/* Header */}
                <div className="flex justify-between items-center border-b border-slate-200 pb-3 mb-4">
                  <h2 className="text-lg font-semibold text-slate-900 tracking-tight">
                    Order {selectedOrder.order_id}
                  </h2>
                  <button
                    onClick={closeModal}
                    className="text-slate-500 hover:text-red-500 transition-colors cursor-pointer"
                  >
                    <X size={24} />
                  </button>
                </div>

                {modalLoading ? (
                  <div className="p-8 text-center">
                    <Spinner size="medium" />
                  </div>
                ) : orderDetails ? (
                  <div className="space-y-6">
                    {/* Order Details */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 text-sm">
                      <div>
                        <h3 className="font-semibold text-slate-600">
                          Subject
                        </h3>
                        <p className="text-slate-900 capitalize">
                          {orderDetails.subject}
                        </p>
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-600">Topic</h3>
                        <p className="text-slate-900">{orderDetails.topic}</p>
                      </div>

                      <div>
                        <h3 className="font-semibold text-slate-600">
                          Deadline
                        </h3>
                        <p
                          className={`${
                            isUrgent(orderDetails.deadline)
                              ? "text-red-600 font-medium"
                              : "text-slate-900"
                          }`}
                        >
                          {getTimeRemaining(orderDetails.deadline)}
                          {isUrgent(orderDetails.deadline) && " (Urgent)"}
                        </p>
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-600">
                          Number of Words
                        </h3>
                        <p className="text-slate-900">
                          {orderDetails.number_of_words}
                        </p>
                      </div>

                      <div>
                        <h3 className="font-semibold text-slate-600">Pages</h3>
                        <p className="text-slate-900">{orderDetails.pages}</p>
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-600">
                          Plagiarism Report
                        </h3>
                        <p className="text-slate-900">
                          {orderDetails.plagiarism_report
                            ? "Required"
                            : "Not Required"}
                        </p>
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-600">
                          Sources
                        </h3>
                        <p className="text-slate-900">
                          {orderDetails.number_of_sources}
                        </p>
                      </div>

                      <div className="col-span-1 sm:col-span-2">
                        <h3 className="font-semibold text-slate-600">
                          Instructions
                        </h3>
                        <p className="text-slate-700 leading-relaxed">
                          {orderDetails.instructions ||
                            "No description provided"}
                        </p>
                      </div>

                      {orderDetails.uploaded_file && (
                        <div className="col-span-1 sm:col-span-2">
                          <h3 className="font-semibold text-slate-600">
                            File Attachment(s)
                          </h3>
                          <a
                            href={orderDetails.uploaded_file}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 mt-1 px-3 py-2 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-colors text-slate-700 group max-w-full"
                          >
                            <Paperclip
                              size={16}
                              className="text-slate-500 group-hover:text-blue-600"
                            />
                            <span className="truncate max-w-[220px] sm:max-w-[300px]">
                              {orderDetails.uploaded_file.split("/").pop()}
                            </span>
                          </a>
                        </div>
                      )}
                    </div>

                    {/* Bid Form */}
                    <form
                      onSubmit={handlePlaceBid}
                      className="space-y-4 text-sm"
                    >
                      <div>
                        <label
                          htmlFor="message"
                          className="font-semibold text-slate-600"
                        >
                          Message to Client
                        </label>
                        <textarea
                          id="message"
                          value={bidData.message}
                          onChange={(e) =>
                            setBidData({ ...bidData, message: e.target.value })
                          }
                          className="mt-1 w-full p-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-100 resize-none"
                          rows="4"
                          placeholder="Enter your message to the client..."
                        />
                      </div>
                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={closeModal}
                          className="flex-1 px-4 py-2 bg-slate-200 text-slate-700 rounded-md hover:bg-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-300 text-sm font-medium cursor-pointer"
                        >
                          Cancel
                        </button>
                        {placedBids.has(selectedOrder.order_id) ? (
                          <button
                            type="button"
                            onClick={handleRemoveBid}
                            disabled={modalLoading}
                            className={`flex-1 px-4 py-2 rounded-md text-sm font-medium cursor-pointer transition-colors bg-red-600 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400 ${
                              modalLoading
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                            }`}
                          >
                            {modalLoading ? (
                              <Spinner size="small" />
                            ) : (
                              "Remove Bid"
                            )}
                          </button>
                        ) : (
                          <button
                            type="submit"
                            disabled={modalLoading}
                            className={`flex-1 px-4 py-2 rounded-md text-sm font-medium cursor-pointer transition-colors bg-emerald-600 text-white hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-400 ${
                              modalLoading
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                            }`}
                          >
                            {modalLoading ? (
                              <Spinner size="small" />
                            ) : (
                              "Place Bid"
                            )}
                          </button>
                        )}
                      </div>
                    </form>
                  </div>
                ) : (
                  <p className="text-center text-slate-600 text-sm">
                    Failed to load order details.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default Orders;
