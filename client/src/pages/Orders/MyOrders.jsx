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
        notify.error("Failed to fetch orders");
        console.error("Error fetching orders:", error);
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

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Navbar />
      <main className="flex-1 pt-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-slate-900 mb-8 mt-8">
            My Orders
          </h1>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <LoaderCircle className="animate-spin w-10 h-10 text-slate-500" />
            </div>
          ) : orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 bg-white rounded-lg shadow-sm border border-slate-200">
              <p className="text-lg text-slate-500">No orders found.</p>
              <a
                href="/new-order"
                className="mt-4 px-4 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700 transition-colors"
              >
                Place an Order
              </a>
            </div>
          ) : (
            <div className="grid gap-6">
              {orders.map((order, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 hover:shadow-md transition-shadow"
                >
                  {/* Left: Order Details */}
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
                        className="inline-flex items-center gap-2 text-sm text-sky-600 hover:text-sky-700 transition-colors"
                        download
                        aria-label="Download attached file"
                      >
                        <Paperclip className="w-4 h-4" />
                        Download File
                      </a>
                    )}
                  </div>

                  {/* Right: Order Status and Metadata */}
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
                      ${parseFloat(order.checkout_amount).toFixed(2)}
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
                      <Hourglass className="w-4 h-4" />
                      {formatCountdown(order.deadline)} remaining
                    </div>
                  </div>
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
