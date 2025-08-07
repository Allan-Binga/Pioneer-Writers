import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import {
  PenTool,
  FileText,
  GraduationCap,
  LayoutTemplate,
  Flag,
  BookOpenText,
  ClipboardList,
  CalendarClock,
  AlignJustify,
  LoaderCircle,
  Paperclip,
  Hourglass,
  Trash2,
  ShoppingCart,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { endpoint } from "../../server";
import axios from "axios";
import { useState, useEffect } from "react";
import { notify } from "../../utils/toast";
import moment from "moment";

function Drafts() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${endpoint}/drafts`, {
          withCredentials: true,
        });
        setOrders(response.data);
      } catch (error) {
        notify.error("Failed to fetch drafts");
        console.error("Error fetching drafts:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const getCountdownColor = (deadline) => {
    const now = moment();
    const due = moment(deadline);
    const hoursLeft = due.diff(now, "hours");

    if (hoursLeft < 6) return "text-red-600";
    if (hoursLeft < 24) return "text-amber-600";
    return "text-green-600";
  };

  const formatCountdown = (deadline) => {
    const now = moment();
    const due = moment(deadline);
    const duration = moment.duration(due.diff(now));
    if (duration.asSeconds() <= 0) return "Expired";
    return `${duration.days()}d ${duration.hours()}h ${duration.minutes()}m`;
  };

  const handleDeleteDraft = async (orderId) => {
    try {
      await axios.delete(`${endpoint}/draft/delete-draft/${orderId}`, {
        withCredentials: true,
      });
      setOrders(orders.filter((order) => order.id !== orderId));
      setExpandedOrder(null);
      notify.success("Draft deleted successfully");
    } catch (error) {
      notify.error("Failed to delete draft");
      console.error("Error deleting draft:", error);
    }
  };

  const handleContinueToCheckout = (orderId) => {
    window.location.href = `/checkout/${orderId}`;
  };

  const toggleExpand = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Navbar />
      <main className="flex-1 pt-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-slate-900 mb-8 mt-8">
            Drafts
          </h1>

          {loading ? (
            <div className="grid gap-4">
              {[...Array(3)].map((_, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 animate-pulse"
                >
                  <div className="h-6 bg-slate-200 rounded w-3/4 mb-4"></div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="h-4 bg-slate-200 rounded"></div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-96 bg-white rounded-lg shadow-sm border border-slate-200 p-8">
              <FileText className="w-16 h-16 text-slate-400 mb-4" />
              <p className="text-xl font-medium text-slate-700 mb-2">
                No Drafts Found
              </p>
              <p className="text-sm text-slate-500 mb-6">
                Start creating a new draft to get started.
              </p>
              <a
                href="/new-order"
                className="px-6 py-3 bg-sky-600 text-white rounded-md hover:bg-sky-700 transition-colors font-medium"
              >
                Create a Draft
              </a>
            </div>
          ) : (
            <div className="grid gap-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 transition-all duration-300 hover:shadow-md"
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === "Enter" && toggleExpand(order.id)}
                >
                  {/* Header */}
                  <div
                    className="flex justify-between items-start cursor-pointer"
                    onClick={() => toggleExpand(order.id)}
                  >
                    <h2 className="text-lg font-semibold text-slate-800">
                      {order.topic}
                    </h2>
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                          order.order_status === "Pending"
                            ? "bg-amber-100 text-amber-700"
                            : order.order_status === "Completed"
                            ? "bg-green-100 text-green-700"
                            : "bg-sky-100 text-sky-700"
                        }`}
                      >
                        {order.order_status}
                      </span>
                      {expandedOrder === order.id ? (
                        <ChevronUp className="w-5 h-5 text-slate-500" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-slate-500" />
                      )}
                    </div>
                  </div>

                  {/* Summary */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm text-slate-600 mt-4">
                    <OrderDetail icon={PenTool} label={order.type_of_service} />
                    <OrderDetail icon={FileText} label={order.document_type} />
                    <OrderDetail
                      icon={GraduationCap}
                      label={order.writer_level}
                    />
                  </div>

                  {/* Expanded Details */}
                  {expandedOrder === order.id && (
                    <div className="mt-6 pt-6 border-t border-slate-200">
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm text-slate-600">
                        <OrderDetail
                          icon={LayoutTemplate}
                          label={order.paper_format.toUpperCase()}
                        />
                        <OrderDetail
                          icon={Flag}
                          label={order.english_type.toUpperCase()}
                        />
                        <OrderDetail
                          icon={BookOpenText}
                          label={`${order.pages} pages`}
                        />
                        <OrderDetail
                          icon={ClipboardList}
                          label={`${order.number_of_sources} sources`}
                        />
                        <OrderDetail
                          icon={AlignJustify}
                          label={`${order.spacing} spacing`}
                        />
                      </div>
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-4 text-sm text-slate-600">
                        <div className="flex items-center gap-2">
                          <CalendarClock className="w-4 h-4 text-sky-600" />
                          {moment(order.deadline).format("MMM D, YYYY, h:mm A")}
                        </div>
                        <div
                          className={`flex items-center gap-2 font-medium ${getCountdownColor(
                            order.deadline
                          )}`}
                        >
                          <Hourglass className="w-4 h-4 text-sky-600" />
                          {formatCountdown(order.deadline)} remaining
                        </div>
                        {order.uploaded_file && (
                          <a
                            href={order.uploaded_file}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-sky-600 hover:text-sky-700 transition-colors"
                            download
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Paperclip className="w-4 h-4" />
                            Download File
                          </a>
                        )}
                      </div>
                      <div className="flex items-center justify-between mt-4">
                        <span className="text-lg font-semibold text-slate-800">
                          $
                          {isNaN(parseFloat(order.checkout_amount))
                            ? "N/A"
                            : parseFloat(order.checkout_amount).toFixed(2)}
                        </span>
                        <div className="flex gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteDraft(order.id);
                            }}
                            className="px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors flex items-center gap-2"
                            aria-label={`Delete draft: ${order.topic}`}
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleContinueToCheckout(order.id);
                            }}
                            className="px-4 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700 transition-colors flex items-center gap-2"
                            aria-label={`Continue to checkout for draft: ${order.topic}`}
                          >
                            <ShoppingCart className="w-4 h-4" />
                            Checkout
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

function OrderDetail({ icon: Icon, label }) {
  return (
    <span className="flex items-center gap-2 text-sm text-slate-600">
      <Icon className="w-4 h-4 text-sky-600" />
      {label}
    </span>
  );
}

export default Drafts;
