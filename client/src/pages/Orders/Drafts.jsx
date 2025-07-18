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
  X,
  ShoppingCart,
} from "lucide-react";
import { endpoint } from "../../server";
import axios from "axios";
import { useState, useEffect } from "react";
import { notify } from "../../utils/toast";
import moment from "moment";

function Drafts() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${endpoint}/orders/my-orders`, {
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

    if (hoursLeft < 6) return "text-red-500";
    if (hoursLeft < 24) return "text-amber-500";
    return "text-green-500";
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
      await axios.delete(`${endpoint}/orders/${orderId}`, {
        withCredentials: true,
      });
      setOrders(orders.filter((order) => order.id !== orderId));
      setSelectedOrder(null);
      notify.success("Draft deleted successfully");
    } catch (error) {
      notify.error("Failed to delete draft");
      console.error("Error deleting draft:", error);
    }
  };

  const handleContinueToCheckout = (orderId) => {
    // Replace with your checkout route or logic
    window.location.href = `/checkout/${orderId}`;
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
            <div className="flex justify-center items-center h-64">
              <LoaderCircle className="animate-spin w-10 h-10 text-slate-500" />
            </div>
          ) : orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 bg-white rounded-lg shadow-sm border border-slate-200">
              <p className="text-lg text-slate-500">No drafts found.</p>
              <a
                href="/new-order"
                className="mt-4 px-4 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700 transition-colors"
              >
                Create a Draft
              </a>
            </div>
          ) : (
            <div className="grid gap-6">
              {orders.map((order, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => setSelectedOrder(order)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) =>
                    e.key === "Enter" && setSelectedOrder(order)
                  }
                  aria-label={`View details for draft: ${order.topic}`}
                >
                  {/* Left: Draft Details */}
                  <div className="lg:col-span-2 space-y-4">
                    <h2 className="text-xl font-semibold text-slate-800">
                      {order.topic}
                    </h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm text-slate-600">
                      <OrderDetail
                        icon={PenTool}
                        label={order.type_of_service}
                        aria-label={`Service Type: ${order.type_of_service}`}
                      />
                      <OrderDetail
                        icon={FileText}
                        label={order.document_type}
                        aria-label={`Document Type: ${order.document_type}`}
                      />
                      <OrderDetail
                        icon={GraduationCap}
                        label={order.writer_level}
                        aria-label={`Writer Level: ${order.writer_level}`}
                      />
                      <OrderDetail
                        icon={LayoutTemplate}
                        label={order.paper_format.toUpperCase()}
                        aria-label={`Paper Format: ${order.paper_format.toUpperCase()}`}
                      />
                      <OrderDetail
                        icon={Flag}
                        label={order.english_type.toUpperCase()}
                        aria-label={`English Type: ${order.english_type.toUpperCase()}`}
                      />
                      <OrderDetail
                        icon={BookOpenText}
                        label={`${order.pages} pages`}
                        aria-label={`Pages: ${order.pages}`}
                      />
                      <OrderDetail
                        icon={ClipboardList}
                        label={`${order.number_of_sources} sources`}
                        aria-label={`Sources: ${order.number_of_sources}`}
                      />
                      <OrderDetail
                        icon={AlignJustify}
                        label={`${order.spacing} spacing`}
                        aria-label={`Spacing: ${order.spacing}`}
                      />
                    </div>
                    {order.uploaded_file && (
                      <a
                        href={order.uploaded_file}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-600 transition-colors"
                        download
                        aria-label="Download attached file"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Paperclip className="w-4 h-4 text-sky-600" />
                        Download File
                      </a>
                    )}
                  </div>

                  {/* Right: Draft Status and Metadata */}
                  <div className="flex flex-col items-start lg:items-end gap-4 text-sm">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
                        order.order_status === "Pending"
                          ? "bg-amber-100 text-amber-700"
                          : order.order_status === "Completed"
                          ? "bg-green-100 text-green-700"
                          : "bg-sky-100 text-sky-700"
                      }`}
                    >
                      {order.order_status}
                    </span>
                    <span className="text-lg font-semibold text-slate-800">
                      $
                      {isNaN(parseFloat(order.checkout_amount))
                        ? "N/A"
                        : parseFloat(order.checkout_amount).toFixed(2)}
                    </span>
                    <div className="flex items-center gap-2 text-slate-600">
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
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      {/* Draft Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 flex items-center justify-center bg-slate-50/20 backdrop-blur-sm z-50">
          <div className="relative bg-white rounded-lg shadow-lg p-6 w-full max-w-xl border border-slate-200">
            {/* Top-right Close Button */}
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute top-4 right-4 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full p-2 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>

            <h2 className="text-2xl font-semibold text-slate-800 mb-4">
              {selectedOrder.topic}
            </h2>

            <div className="grid grid-cols-2 gap-4 text-sm text-slate-600 mb-6">
              <OrderDetail
                icon={PenTool}
                label={selectedOrder.type_of_service}
                ariaLabel={`Service Type: ${selectedOrder.type_of_service}`}
              />
              <OrderDetail
                icon={FileText}
                label={selectedOrder.document_type}
                ariaLabel={`Document Type: ${selectedOrder.document_type}`}
              />
              <OrderDetail
                icon={GraduationCap}
                label={selectedOrder.writer_level}
                ariaLabel={`Writer Level: ${selectedOrder.writer_level}`}
              />
              <OrderDetail
                icon={LayoutTemplate}
                label={selectedOrder.paper_format.toUpperCase()}
                ariaLabel={`Paper Format: ${selectedOrder.paper_format.toUpperCase()}`}
              />
              <OrderDetail
                icon={Flag}
                label={selectedOrder.english_type.toUpperCase()}
                ariaLabel={`English Type: ${selectedOrder.english_type.toUpperCase()}`}
              />
              <OrderDetail
                icon={BookOpenText}
                label={`${selectedOrder.pages} pages`}
                ariaLabel={`Pages: ${selectedOrder.pages}`}
              />
              <OrderDetail
                icon={ClipboardList}
                label={`${selectedOrder.number_of_sources} sources`}
                ariaLabel={`Sources: ${selectedOrder.number_of_sources}`}
              />
              <OrderDetail
                icon={AlignJustify}
                label={`${selectedOrder.spacing} spacing`}
                ariaLabel={`Spacing: ${selectedOrder.spacing}`}
              />
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-2 text-sm text-slate-600 mb-6">
              <div className="flex items-center gap-2">
                <CalendarClock className="w-4 h-4 text-sky-600" />
                {moment(selectedOrder.deadline).format("MMM D, YYYY, h:mm A")}
              </div>
              <div
                className={`flex items-center gap-2 font-medium ${getCountdownColor(
                  selectedOrder.deadline
                )}`}
              >
                <Hourglass className="w-4 h-4 text-sky-600" />
                {formatCountdown(selectedOrder.deadline)} remaining
              </div>
              {selectedOrder.uploaded_file && (
                <a
                  href={selectedOrder.uploaded_file}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sky-600 hover:text-sky-700 transition-colors"
                  download
                  aria-label="Download attached file"
                >
                  <Paperclip className="w-4 h-4 font-bold" />
                  Download File
                </a>
              )}
            </div>

            {/* Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleDeleteDraft(selectedOrder.id)}
                className="w-full px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors flex items-center justify-center gap-2"
                aria-label="Delete draft"
              >
                <Trash2 className="w-4 h-4" />
                Delete Draft
              </button>
              <button
                onClick={() => handleContinueToCheckout(selectedOrder.id)}
                className="w-full px-4 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700 transition-colors flex items-center justify-center gap-2"
                aria-label="Continue to checkout"
              >
                <ShoppingCart className="w-4 h-4" />
                Continue to Checkout
              </button>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}

function OrderDetail({ icon: Icon, label, ariaLabel }) {
  return (
    <span
      className="flex items-center gap-2 text-sm text-slate-600"
      aria-label={ariaLabel}
    >
      <Icon className="w-4 h-4 text-sky-600" />
      {label}
    </span>
  );
}

export default Drafts;
