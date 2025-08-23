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
  X,
} from "lucide-react";
import { endpoint } from "../../server";
import axios from "axios";
import { useState, useEffect } from "react";
import { notify } from "../../utils/toast";
import moment from "moment";
import { useParams, Link } from "react-router-dom";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";

function MyOrders() {
  const { status } = useParams();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const selectedStatus = status?.toLowerCase() || "all";

  // Check if order is urgent (less than 24 hours)
  const isUrgent = (deadline) => {
    const total = new Date(deadline) - new Date();
    return total > 0 && total < 24 * 60 * 60 * 1000;
  };

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${endpoint}/orders/my-orders`, {
          params: {
            status: selectedStatus === "all" ? undefined : selectedStatus,
          },
          withCredentials: true,
        });
        setOrders(response.data);
      } catch (error) {
        notify.error("Failed to fetch orders");
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [selectedStatus]);

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
    if (duration.asSeconds() <= 0) return "Deadline Passed";
    return `${duration.days()}d ${duration.hours()}h ${duration.minutes()}m`;
  };

  const formatStatus = (status) => {
    const baseClass =
      "inline-block px-2 py-1 rounded-full text-[10px] font-medium capitalize";
    switch (status.toLowerCase()) {
      case "public":
        return `${baseClass} bg-blue-100 text-blue-800`;
      case "completed":
        return `${baseClass} bg-green-100 text-green-800`;
      case "failed":
        return `${baseClass} bg-red-100 text-red-800`;
      default:
        return `${baseClass} bg-slate-200 text-slate-600`;
    }
  };

  const openModal = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* Animated Background Waves */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Top wave */}
        <svg
          className="absolute top-0 left-0 w-full h-[200px] opacity-10"
          viewBox="0 0 1000 200"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="wave1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3B82F6" />
              <stop offset="100%" stopColor="#1D4ED8" />
            </linearGradient>
          </defs>
          <path
            d="M0,200 Q250,50 500,200 T1000,200 L1000,0 L0,0 Z"
            fill="url(#wave1)"
            className="animate-pulse"
          />
        </svg>

        {/* Bottom wave */}
        <svg
          className="absolute bottom-0 left-0 w-full h-[200px] opacity-5"
          viewBox="0 0 1000 200"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="wave2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8B5CF6" />
              <stop offset="100%" stopColor="#6366F1" />
            </linearGradient>
          </defs>
          <path
            d="M0,0 Q250,150 500,0 T1000,0 L1000,200 L0,200 Z"
            fill="url(#wave2)"
            className="animate-pulse"
            style={{ animationDelay: "2s" }}
          />
        </svg>

        {/* Floating Particles */}
        {/* Left side */}
        <div className="absolute top-20 left-20 w-2 h-2 bg-blue-400 rounded-full animate-bounce opacity-60"></div>
        <div className="absolute top-40 left-10 w-3 h-3 bg-pink-400 rounded-full animate-pulse opacity-50"></div>
        <div
          className="absolute bottom-28 left-16 w-2 h-2 bg-green-400 rounded-full animate-bounce opacity-40"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/5 w-4 h-4 bg-indigo-300 rounded-full animate-pulse opacity-30"
          style={{ animationDelay: "2s" }}
        ></div>

        {/* Right side */}
        <div
          className="absolute top-40 right-32 w-3 h-3 bg-amber-400 rounded-full animate-bounce opacity-40"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute bottom-32 left-1/4 w-2 h-2 bg-indigo-400 rounded-full animate-bounce opacity-50"
          style={{ animationDelay: "3s" }}
        ></div>
        <div className="absolute top-1/3 right-20 w-4 h-4 bg-green-300 rounded-full animate-pulse opacity-30"></div>
      </div>

      <Navbar />
      <main className="flex-1 pt-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-8 mb-6 capitalize">
            {selectedStatus === "all"
              ? "All Orders"
              : `${selectedStatus} Orders`}
          </h1>

          <div className="overflow-x-auto bg-white rounded-2xl shadow-md border border-slate-200">
            {loading ? (
              <div className="p-8 text-center text-slate-600 text-xs">
                Loading orders...
              </div>
            ) : orders.length === 0 ? (
              <div className="p-8 text-center text-slate-600 text-xs">
                No orders found.
                <a
                  href="/new-order"
                  className="ml-2 text-blue-600 hover:underline"
                >
                  Place an Order
                </a>
              </div>
            ) : (
              <table className="min-w-full divide-y divide-slate-200 text-sm text-slate-700">
                <thead className="bg-slate-100 text-slate-800">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-sm">
                      Order
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-sm">
                      Topic
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-sm">
                      Writer
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-sm">
                      Amount ($)
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-sm">
                      Deadline
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-sm">
                      Time Remaining
                    </th>
                    <th className="px-4 py-3 text-center font-semibold text-sm">
                      Submission Status
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 bg-white">
                  {orders.map((order, index) => (
                    <tr
                      key={index}
                      className="hover:bg-slate-50 cursor-pointer"
                      onClick={() => openModal(order)}
                    >
                      {/* Order ID */}
                      <td className="px-4 py-3 text-sky-500 font-medium">
                        <Link
                          to={`/order-details/${order.order_id}`}
                          onClick={(e) => e.stopPropagation()}
                        >
                          {order.order_id}
                        </Link>
                      </td>

                      {/* Topic */}
                      <td className="px-4 py-3">{order.topic}</td>

                      {/* Writer */}
                      <td className="px-4 py-3 font-semibold">
                        {order.writer_name || "N/A"}
                      </td>

                      {/* Amount */}
                      <td className="px-4 py-3">
                        ${parseFloat(order.checkout_amount).toFixed(2)}
                      </td>

                      {/* Deadline */}
                      <td className="px-4 py-3">
                        {moment(order.deadline).format("MMM D, YYYY, h:mm A")}
                      </td>

                      {/* Time Remaining */}
                      <td className="px-6 py-4 font-medium">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            isUrgent(order.deadline)
                              ? "bg-red-100 text-red-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {formatCountdown(order.deadline)}
                        </span>
                      </td>

                      {/* Submission Status */}
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-medium capitalize
              ${
                order.assignment_status === "submitted"
                  ? "bg-green-100 text-green-700"
                  : order.assignment_status === "completed"
                  ? "bg-emerald-100 text-emerald-700"
                  : order.assignment_status === "assigned"
                  ? "bg-blue-100 text-blue-700"
                  : order.assignment_status === "public"
                  ? "bg-amber-100 text-amber-700"
                  : "bg-slate-200 text-slate-700"
              }`}
                        >
                          {order.assignment_status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>

      {/* Modal for Order Details */}
      <Dialog open={isModalOpen} onClose={closeModal} className="relative z-50">
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <DialogPanel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all relative">
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 text-slate-500 hover:text-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5 hover:text-red-600" />
              </button>
              {selectedOrder && (
                <>
                  <DialogTitle
                    as="h3"
                    className="text-lg font-semibold text-slate-900 mb-4"
                  >
                    {selectedOrder.topic}
                  </DialogTitle>
                  <div className="grid gap-4">
                    <div className="grid grid-cols-2 gap-4 text-sm text-slate-600">
                      <OrderDetail
                        icon={PenTool}
                        label={selectedOrder.type_of_service}
                      />
                      <OrderDetail
                        icon={FileText}
                        label={selectedOrder.document_type}
                      />
                      <OrderDetail
                        icon={GraduationCap}
                        label={selectedOrder.writer_level}
                      />
                      <OrderDetail
                        icon={LayoutTemplate}
                        label={selectedOrder.paper_format.toUpperCase()}
                      />
                      <OrderDetail
                        icon={Flag}
                        label={selectedOrder.english_type.toUpperCase()}
                      />
                      <OrderDetail
                        icon={BookOpenText}
                        label={`${selectedOrder.pages} pages`}
                      />
                      <OrderDetail
                        icon={ClipboardList}
                        label={`${selectedOrder.number_of_sources} sources`}
                      />
                      <OrderDetail
                        icon={AlignJustify}
                        label={`${selectedOrder.spacing} spacing`}
                      />
                    </div>

                    {selectedOrder.uploaded_file && (
                      <a
                        href={selectedOrder.uploaded_file}
                        target="_blank"
                        rel="noopener noreferrer"
                        download
                        className="inline-flex items-center gap-2 text-sm text-sky-600 hover:text-sky-700 transition-colors"
                      >
                        <Paperclip className="w-4 h-4" />
                        Download File
                      </a>
                    )}

                    <div className="flex flex-col gap-2 text-sm">
                      <span
                        className={formatStatus(selectedOrder.order_status)}
                      >
                        {selectedOrder.order_status}
                      </span>
                      <span className="text-lg font-semibold text-slate-800">
                        ${parseFloat(selectedOrder.checkout_amount).toFixed(2)}
                      </span>
                      <div className="flex items-center gap-2 text-slate-600">
                        <CalendarClock className="w-4 h-4 text-sky-600" />
                        {moment(selectedOrder.deadline).format(
                          "MMM D, YYYY, h:mm A"
                        )}
                      </div>
                      <div
                        className={`flex items-center gap-2 font-medium ${getCountdownColor(
                          selectedOrder.deadline
                        )}`}
                      >
                        <Hourglass className="w-4 h-4" />
                        {formatCountdown(selectedOrder.deadline)} remaining
                      </div>
                    </div>
                  </div>
                </>
              )}
            </DialogPanel>
          </div>
        </div>
      </Dialog>

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

export default MyOrders;
