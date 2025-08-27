import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { notify } from "../../utils/toast";
import moment from "moment";
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
  UserCheck,
  MoreVertical,
  X,
  ArrowRightFromLine,
  Check,
  Download,
  Star,
  AlertTriangle,
  ClockPlus,
} from "lucide-react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { endpoint } from "../../server";
import { fetchBids } from "../../utils/bids";

function OrderDetails() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [showDisputeModal, setShowDisputeModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [disputeReason, setDisputeReason] = useState("");
  const [ratingLoading, setRatingLoading] = useState(false);
  const [disputeLoading, setDisputeLoading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [bidCount, setBidCount] = useState([]);
  const [bidsLoading, setBidsLoading] = useState(false);

  // Fetch Order Details
  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${endpoint}/orders/order/${orderId}`,
          {
            withCredentials: true,
          }
        );
        setOrder(response.data);
        setUploadedFiles(response.data.submitted_files || []);
      } catch (error) {
        notify.error("Failed to fetch order details");
        console.error("Error fetching order details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

  // Fetch Bid Count
  useEffect(() => {
    setBidsLoading(true);
    fetchBids(orderId).then((bids) => {
      setBidCount(bids.length);
    });
    setBidsLoading(false);
  }, [orderId]);

  // Handle star rating click
  const handleStarClick = (value) => {
    setRating(value);
  };

  // Handle rating submission and order completion
  const handleRateAndComplete = async () => {
    if (rating < 1 || rating > 5) {
      notify.error("Please select a rating between 1 and 5 stars.");
      return;
    }

    setRatingLoading(true);
    try {
      const rateResponse = await axios.post(
        `${endpoint}/ratings/rate-writer/${order.writer_id}`,
        { order_id: orderId, rating, comment },
        { withCredentials: true }
      );

      if (rateResponse.status === 201) {
        const completeResponse = await axios.post(
          `${endpoint}/orders/order/complete/${orderId}`,
          {},
          { withCredentials: true }
        );

        if (completeResponse.status === 200) {
          setOrder({ ...order, assignment_status: "completed" });
          notify.success("Order completed successfully!");
          setShowRatingModal(false);
          setShowActions(false);
          setRating(0);
          setComment("");
        }
      }
    } catch (error) {
      notify.error(
        error.response?.data?.message ||
          "Failed to rate writer or complete order."
      );
      console.error("Error in rating or completing order:", error);
    } finally {
      setRatingLoading(false);
    }
  };

  // Handle dispute submission
  const handleDisputeSubmit = async () => {
    if (!disputeReason || disputeReason.trim().length === 0) {
      notify.error("Please provide a reason for the dispute.");
      return;
    }

    if (uploadedFiles.length > 5) {
      notify.error("You can only upload a maximum of 5 files.");
      return;
    }

    setDisputeLoading(true);
    try {
      const formData = new FormData();
      formData.append("reason", disputeReason);
      uploadedFiles.forEach((file) => {
        formData.append("disputeFiles", file);
      });

      const response = await axios.post(
        `${endpoint}/orders/order/dispute/${orderId}`,
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (response.status === 201) {
        setOrder({ ...order, assignment_status: "disputed" });
        notify.success("Dispute submitted successfully.");
        setShowDisputeModal(false);
        setShowActions(false);
        setDisputeReason("");
        setUploadedFiles([]);
      }
    } catch (error) {
      notify.error(
        error.response?.data?.message || "Failed to submit dispute."
      );
      console.error("Error submitting dispute:", error);
    } finally {
      setDisputeLoading(false);
    }
  };

  // Handle order actions
  const handleAction = async (action) => {
    if (action === "Complete Order") {
      setShowRatingModal(true);
    } else if (action === "Dispute Order") {
      setShowDisputeModal(true);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "submitted":
        return "bg-green-200 text-green-800";
      case "completed":
        return "bg-green-100 text-green-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      case "disputed":
        return "bg-amber-100 text-amber-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Navbar />
      {/* Animated Background Waves - Fixed z-index */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
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
      <main className="flex-1 pt-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mt-12">
              Order <span className="text-slate-600">#{orderId}</span>
            </h1>
            <button
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-md transition-colors mt-12 ${
                order?.assignment_status?.toLowerCase() === "completed"
                  ? "bg-slate-400 text-white cursor-not-allowed opacity-70"
                  : "bg-slate-600 text-white hover:bg-slate-700 cursor-pointer"
              }`}
              onClick={() => {
                if (order?.assignment_status?.toLowerCase() !== "completed") {
                  setShowActions(true);
                }
              }}
              aria-label="Open order actions"
              disabled={order?.assignment_status?.toLowerCase() === "completed"}
            >
              Order Actions
            </button>
          </div>

          <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-sm border border-slate-200 space-y-8">
            {loading ? (
              <div className="flex items-center justify-center gap-2 text-slate-600">
                <LoaderCircle className="animate-spin w-6 h-6" />
                <span>Loading order details...</span>
              </div>
            ) : order ? (
              <>
                {/* Order Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm text-slate-600">
                  {[
                    {
                      label: "Topic",
                      value: order.topic
                        ? order.topic.charAt(0).toUpperCase() +
                          order.topic.slice(1)
                        : "N/A",
                      icon: <FileText className="text-slate-600" size={18} />,
                    },
                    {
                      label: "Instructions",
                      value: order.instructions
                        ? order.instructions.charAt(0).toUpperCase() +
                          order.instructions.slice(1)
                        : "No instructions provided",
                      icon: <PenTool className="text-slate-600" size={18} />,
                    },
                    {
                      label: "Academic Level",
                      value: order.writer_level
                        ? order.writer_level.charAt(0).toUpperCase() +
                          order.writer_level.slice(1)
                        : "N/A",
                      icon: (
                        <GraduationCap className="text-slate-600" size={18} />
                      ),
                    },
                    {
                      label: "Format",
                      value: order.paper_format
                        ? order.paper_format.toUpperCase()
                        : "N/A",
                      icon: (
                        <LayoutTemplate className="text-slate-600" size={18} />
                      ),
                    },
                    {
                      label: "Language",
                      value: order.english_type
                        ? order.english_type.toUpperCase()
                        : "N/A",
                      icon: <Flag className="text-slate-600" size={18} />,
                    },
                    {
                      label: "Subject",
                      value: order.subject
                        ? order.subject.charAt(0).toUpperCase() +
                          order.subject.slice(1)
                        : "N/A",
                      icon: (
                        <BookOpenText className="text-slate-600" size={18} />
                      ),
                    },
                    {
                      label: "Pages",
                      value: order.pages || "N/A",
                      icon: (
                        <ClipboardList className="text-slate-600" size={18} />
                      ),
                    },
                    {
                      label: "Deadline",
                      value: moment(order.deadline).format(
                        "MMM D, YYYY, h:mm A"
                      ),
                      icon: (
                        <CalendarClock className="text-slate-600" size={18} />
                      ),
                    },
                    {
                      label: "Order Status",
                      value: (
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(
                            order.assignment_status
                          )}`}
                        >
                          {order.assignment_status || "N/A"}
                        </span>
                      ),
                      icon: (
                        <AlignJustify className="text-slate-600" size={18} />
                      ),
                    },
                    {
                      label: "Created At",
                      value: moment(order.created_at).format(
                        "MMM D, YYYY, h:mm A"
                      ),
                      icon: <Hourglass className="text-slate-600" size={18} />,
                    },
                    {
                      label: "Writer Assigned",
                      value: order.writer_name || "N/A",
                      icon: <UserCheck className="text-slate-600" size={18} />,
                    },
                    {
                      label: "Price",
                      value: order.checkout_amount
                        ? `$${parseFloat(order.checkout_amount).toFixed(2)}`
                        : "N/A",
                      icon: (
                        <ClipboardList className="text-slate-600" size={18} />
                      ),
                    },
                  ].map(({ label, value, icon }) => (
                    <div className="flex items-start gap-3" key={label}>
                      {icon}
                      <div>
                        <strong className="font-semibold text-slate-800">
                          {label}:
                        </strong>{" "}
                        {value}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Files Uploaded Section */}
                <div>
                  <h2 className="text-lg font-semibold text-slate-800 mb-3">
                    Uploaded Files
                  </h2>
                  {uploadedFiles.length === 0 ? (
                    <div className="border border-dashed p-4 rounded text-center text-slate-500 bg-slate-50">
                      No files uploaded yet
                    </div>
                  ) : (
                    <ul className="space-y-3">
                      {uploadedFiles.map((file, index) => {
                        const uploadedDate = new Date(
                          file.uploadedAt
                        ).toLocaleString();

                        return (
                          <li
                            key={index}
                            className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200 shadow-sm hover:bg-slate-100 transition"
                          >
                            <div className="flex items-center gap-3">
                              <Paperclip className="text-slate-600" size={18} />
                              <div>
                                <a
                                  href={file.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-slate-700 font-medium hover:text-slate-900 transition-colors"
                                >
                                  {file.originalname}
                                </a>
                                <div className="text-xs text-slate-500">
                                  Uploaded {uploadedDate}
                                </div>
                              </div>
                            </div>
                            <a
                              href={file.url}
                              download
                              className="text-slate-600 hover:text-slate-800"
                              aria-label={`Download ${file.originalname}`}
                            >
                              <Download size={20} />
                            </a>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>

                {/* Bids Section */}
                <div>
                  <h2 className="text-lg font-semibold text-slate-800 mb-3">
                    Bids
                  </h2>
                  {order?.writer_name ? (
                    <div className="flex items-center gap-2 text-green-600 text-sm font-medium">
                      <Check size={16} className="flex-shrink-0" />
                      <span>
                        This order has already been assigned to{" "}
                        <strong>{order.writer_name}</strong>.
                      </span>
                    </div>
                  ) : bidsLoading ? (
                    <div className="flex items-center gap-2 text-slate-600">
                      <LoaderCircle className="animate-spin w-5 h-5" />
                      <span>Loading bids...</span>
                    </div>
                  ) : bidCount === 0 ? (
                    <div className="text-slate-500 text-sm">
                      No bids have been placed yet.
                    </div>
                  ) : (
                    <Link
                      to={`/bids/order/${orderId}`}
                      className="inline-flex items-center gap-2 text-slate-700 hover:text-slate-900 font-bold text-sm"
                    >
                      {bidCount} {bidCount === 1 ? "bid" : "bids"} available
                      <ArrowRightFromLine
                        size={16}
                        className="text-slate-800"
                      />
                    </Link>
                  )}
                </div>
              </>
            ) : (
              <div className="text-center text-red-600">
                Order not found.
                <a
                  href="/orders"
                  className="ml-2 text-slate-600 hover:text-slate-700 underline"
                  aria-label="Return to orders list"
                >
                  Return to Orders
                </a>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Order Actions Modal */}
      {showActions && (
        <div className="fixed inset-0 flex items-center justify-center bg-slate-50/20 backdrop-blur-sm z-50">
          <div className="bg-white w-full max-w-md rounded-lg shadow-lg p-6 relative">
            <button
              className="absolute top-3 right-3 text-slate-500 hover:text-red-500 transition-colors cursor-pointer"
              onClick={() => setShowActions(false)}
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-semibold text-slate-800 mb-4">
              Order Actions
            </h2>
            <div className="space-y-3">
              <button
                onClick={() => handleAction("Complete Order")}
                className="flex items-center gap-3 w-full px-4 py-2 bg-teal-100 text-teal-700 rounded-md hover:bg-teal-200 transition-colors text-left"
              >
                <ClockPlus className="w-4 h-4" />
                Extend Deadline
              </button>
              <button
                onClick={() => handleAction("Complete Order")}
                className="flex items-center gap-3 w-full px-4 py-2 bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors text-left"
                aria-label="Complete order"
              >
                <Check className="w-4 h-4" />
                Complete This Order
              </button>
              <button
                onClick={() => handleAction("Dispute Order")}
                className="flex items-center gap-3 w-full px-4 py-2 bg-amber-100 text-amber-700 rounded-md hover:bg-amber-200 transition-colors text-left"
                aria-label="Dispute order"
              >
                <AlertTriangle className="w-4 h-4" />
                Dispute Order
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rating Modal */}
      {showRatingModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-slate-50/20 backdrop-blur-sm z-50">
          <div className="bg-white w-full max-w-md rounded-lg shadow-lg p-6 relative">
            <button
              className="absolute top-3 right-3 text-slate-500 hover:text-red-500 transition-colors cursor-pointer"
              onClick={() => setShowRatingModal(false)}
              aria-label="Close rating modal"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-semibold text-slate-800 mb-4">
              Rate Writer
            </h2>
            <p className="text-sm text-slate-600 mb-4">
              Please rate the writer for order #{orderId}.
            </p>
            <div className="flex items-center gap-1 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={24}
                  className={`cursor-pointer ${
                    star <= rating
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-slate-300"
                  }`}
                  onClick={() => handleStarClick(star)}
                />
              ))}
            </div>
            <div className="mb-4">
              <label
                htmlFor="comment"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                Comment (Optional)
              </label>
              <textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full p-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-100"
                rows="4"
                placeholder="Share your feedback..."
              />
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowRatingModal(false)}
                className="px-4 py-2 bg-slate-200 text-slate-700 rounded-md hover:bg-slate-300 transition-colors"
                aria-label="Cancel rating"
              >
                Cancel
              </button>
              <button
                onClick={handleRateAndComplete}
                disabled={ratingLoading}
                className={`px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center gap-2 ${
                  ratingLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
                aria-label="Submit rating and complete order"
              >
                {ratingLoading && (
                  <LoaderCircle className="animate-spin w-4 h-4" />
                )}
                Submit Rating
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dispute Modal */}
      {showDisputeModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-slate-50/20 backdrop-blur-sm z-50">
          <div className="bg-white w-full max-w-md rounded-lg shadow-lg p-6 relative">
            <button
              className="absolute top-3 right-3 text-slate-500 hover:text-red-500 transition-colors cursor-pointer"
              onClick={() => setShowDisputeModal(false)}
              aria-label="Close dispute modal"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-lg font-semibold text-slate-800 mb-4">
              Dispute Order
            </h2>
            <p className="text-xs text-slate-600 mb-4">
              Please provide a reason for disputing order #{orderId}.
            </p>
            <div className="mb-4">
              <label
                htmlFor="disputeReason"
                className="block text-xs font-medium text-slate-700 mb-1"
              >
                Dispute Reason
              </label>
              <textarea
                id="disputeReason"
                value={disputeReason}
                onChange={(e) => setDisputeReason(e.target.value)}
                className="w-full p-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-100 text-xs"
                rows="4"
                placeholder="Explain why you are disputing this order..."
                required
              />
              <div className="mb-4">
                <label
                  htmlFor="disputeFiles"
                  className="block text-xs font-medium text-slate-700 mb-1"
                >
                  Upload Evidence (Max 5 files)
                </label>
                <input
                  id="disputeFiles"
                  type="file"
                  multiple
                  onChange={(e) => {
                    const files = Array.from(e.target.files);
                    if (files.length > 5) {
                      notify.error("You can only upload a maximum of 5 files.");
                    } else {
                      setUploadedFiles(files);
                    }
                  }}
                  className="w-full text-xs text-slate-700 border border-slate-200 rounded-md cursor-pointer p-1"
                />
                {uploadedFiles.length > 0 && (
                  <ul className="mt-2 text-xs text-slate-600 list-disc list-inside">
                    {uploadedFiles.map((file, idx) => (
                      <li key={idx}>{file.name}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDisputeModal(false)}
                className="px-4 py-2 bg-slate-200 text-slate-700 rounded-md hover:bg-slate-300 transition-colors cursor-pointer text-sm"
                aria-label="Cancel dispute"
              >
                Cancel
              </button>
              <button
                onClick={handleDisputeSubmit}
                disabled={disputeLoading}
                className={`px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition-colors flex items-center gap-2 cursor-pointer text-sm ${
                  disputeLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
                aria-label="Submit dispute"
              >
                {disputeLoading && (
                  <LoaderCircle className="animate-spin w-4 h-4" />
                )}
                Submit Dispute
              </button>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}

export default OrderDetails;
