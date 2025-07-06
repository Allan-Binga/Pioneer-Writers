import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleMobileSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

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

    if (hoursLeft < 6) return "text-orange-600";
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Navbar toggleMobileSidebar={toggleMobileSidebar} />

      <div className="flex">
        {/* Sidebar: show on large screens or mobile toggle */}
        <div
          className={`fixed z-40 md:static ${
            isSidebarOpen ? "block" : "hidden"
          } md:block`}
        >
          <Sidebar />
        </div>

        {/* Main Content Area */}
        <main className="flex-1 transition-all duration-300 md:ml-64 pt-20 px-4">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold text-slate-800 mb-4">
              My Orders
            </h1>

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <LoaderCircle className="animate-spin w-12 h-12 text-slate-600" />
              </div>
            ) : orders.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 bg-white rounded-xl shadow-sm border border-gray-200">
                <p className="text-lg text-gray-500">No orders found.</p>
              </div>
            ) : (
              <div className="space-y-8">
                {orders.map((order, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow p-6 flex flex-col lg:flex-row justify-between gap-4"
                  >
                    {/* Left Side */}
                    <div className="space-y-3 w-full lg:w-3/4">
                      <h2 className="text-lg font-semibold text-sky-800">
                        {order.topic}
                      </h2>

                      <div className="flex flex-wrap gap-3 text-md text-gray-700">
                        <OrderDetail
                          icon={PenTool}
                          label={order.type_of_service}
                        />
                        <OrderDetail
                          icon={FileText}
                          label={order.document_type}
                        />
                        <OrderDetail
                          icon={GraduationCap}
                          label={order.writer_level}
                        />
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

                      {order.uploaded_file && (
                        <a
                          href={order.uploaded_file}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-md text-sky-600 hover:underline"
                          download
                        >
                          <Paperclip className="w-4 h-4" /> Download File
                        </a>
                      )}
                    </div>

                    {/* Right Side */}
                    <div className="flex flex-col items-start lg:items-end gap-2 text-md w-full lg:w-1/4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                          order.order_status === "Pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : order.order_status === "Completed"
                            ? "bg-green-100 text-green-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {order.order_status}
                      </span>

                      <span className="text-lg font-bold text-green-600">
                        ${parseFloat(order.checkout_amount).toFixed(2)}
                      </span>

                      <div className="flex items-center gap-2 text-gray-600">
                        <CalendarClock className="w-4 h-4 text-teal-600" />
                        {moment(order.deadline).format("MMM D, YYYY, h:mm A")}
                      </div>

                      <div
                        className={`flex items-center gap-2 font-medium ${getCountdownColor(
                          order.deadline
                        )}`}
                      >
                        <Hourglass className="w-4 h-4 text-slate-700" />
                        {formatCountdown(order.deadline)} remaining
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

function OrderDetail({ icon: Icon, label }) {
  return (
    <span className="flex items-center gap-1">
      <Icon className="w-4 h-4 text-teal-600" />
      {label}
    </span>
  );
}

export default MyOrders;
