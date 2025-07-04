import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import {
  History,
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
  CheckCircle,
  XCircle,
  Paperclip,
} from "lucide-react";
import { endpoint } from "../../server";
import axios from "axios";
import { useState, useEffect } from "react";
import { notify } from "../../utils/toast";
import moment from "moment";

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${endpoint}/orders/my-orders`, {
          withCredentials: true,
        });
        setOrders(response.data);
      } catch (error) {
        notify.info("Failed to fetch orders");
        console.error("Failed to fetch orders.");
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
    if (hoursLeft < 24) return "text-yellow-500";
    return "text-green-600";
  };

  const formatCountdown = (deadline) => {
    const now = moment();
    const due = moment(deadline);
    const duration = moment.duration(due.diff(now));
    return `${duration.days()}d ${duration.hours()}h ${duration.minutes()}m`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Sidebar />

      <div className="p-6 ml-64 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-sky-800 mb-8 flex items-center gap-3">
          <History className="w-8 h-8 text-sky-600" />
          My Orders
        </h1>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <LoaderCircle className="animate-spin w-12 h-12 text-sky-600" />
            <span className="ml-3 text-lg text-gray-600">
              Loading orders...
            </span>
          </div>
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 bg-white rounded-xl shadow-sm border border-gray-200">
            <p className="text-lg text-gray-500">No orders found.</p>
            <button
              onClick={() => (window.location.href = "/new-order")}
              className="mt-4 px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors"
            >
              Create New Order
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300 p-5 flex flex-col lg:flex-row items-start gap-6"
              >
                {/* Left Column */}
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2 text-sky-800 text-lg font-semibold">
                    <History className="w-5 h-5 text-sky-600" /> {order.topic}
                  </div>

                  <div className="flex flex-wrap gap-4 text-sm text-gray-700">
                    <span className="flex items-center gap-1">
                      <PenTool className="w-4 h-4 text-teal-600" />{" "}
                      {order.type_of_service}
                    </span>
                    <span className="flex items-center gap-1">
                      <FileText className="w-4 h-4 text-teal-600" />{" "}
                      {order.document_type}
                    </span>
                    <span className="flex items-center gap-1">
                      <GraduationCap className="w-4 h-4 text-teal-600" />{" "}
                      {order.writer_level}
                    </span>
                    <span className="flex items-center gap-1">
                      <LayoutTemplate className="w-4 h-4 text-teal-600" />{" "}
                      {order.paper_format.toUpperCase()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Flag className="w-4 h-4 text-teal-600" />{" "}
                      {order.english_type.toUpperCase()}
                    </span>
                    <span className="flex items-center gap-1">
                      <BookOpenText className="w-4 h-4 text-teal-600" />{" "}
                      {order.pages} pages
                    </span>
                    <span className="flex items-center gap-1">
                      <ClipboardList className="w-4 h-4 text-teal-600" />{" "}
                      {order.number_of_sources} sources
                    </span>
                    <span className="flex items-center gap-1">
                      <AlignJustify className="w-4 h-4 text-teal-600" />{" "}
                      {order.spacing} spacing
                    </span>
                  </div>

                  {order.uploaded_file && (
                    <a
                      href={order.uploaded_file}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-sky-600 hover:underline"
                      download
                    >
                      <Paperclip className="w-4 h-4" /> Download File
                    </a>
                  )}
                </div>

                {/* Right Column */}
                <div className="flex flex-col items-start gap-3">
                  <div className="flex items-center gap-2 text-sm">
                    <CalendarClock className="w-5 h-5 text-teal-600" />
                    <span>
                      Due:{" "}
                      {moment(order.deadline).format("MMM Do YYYY, h:mm a")}
                    </span>
                  </div>

                  <div
                    className={`flex items-center gap-2 font-medium text-sm ${getCountdownColor(
                      order.deadline
                    )}`}
                  >
                    ⏳ {formatCountdown(order.deadline)} left
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    {order.order_status === "Pending" ? (
                      <LoaderCircle className="w-4 h-4 text-yellow-500 animate-spin" />
                    ) : order.order_status === "Completed" ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-500" />
                    )}
                    <span className="text-gray-700">{order.order_status}</span>
                  </div>

                  <button
                    className="mt-3 px-4 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700 text-sm"
                    onClick={() =>
                      (window.location.href = `/order-details/${order.id}`)
                    }
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyOrders;
