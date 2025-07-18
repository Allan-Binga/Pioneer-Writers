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
  UserCheck,
  UploadCloud,
  MoreVertical,
  X,
} from "lucide-react";
import { endpoint } from "../../server";
import axios from "axios";
import { useState, useEffect } from "react";
import { notify } from "../../utils/toast";
import moment from "moment";
import { useParams } from "react-router-dom";

function OrderDetails() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);

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
        // Assuming the API returns an array of uploaded files
        setUploadedFiles(response.data.uploaded_files || []);
      } catch (error) {
        notify.error("Failed to fetch order details");
        console.error("Error fetching order details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

  const handleAction = async (action) => {
    try {
      if (action === "Cancel Order") {
        await axios.post(
          `${endpoint}/orders/${orderId}/cancel`,
          {},
          { withCredentials: true }
        );
        setOrder({ ...order, order_status: "Cancelled" });
        notify.success("Order cancelled successfully");
      } else if (action === "Create Duplicate") {
        const response = await axios.post(
          `${endpoint}/orders/${orderId}/duplicate`,
          {},
          { withCredentials: true }
        );
        notify.success(`Duplicate order created: #${response.data.id}`);
      } else if (action === "Dispute Order") {
        await axios.post(
          `${endpoint}/orders/${orderId}/dispute`,
          {},
          { withCredentials: true }
        );
        notify.success("Dispute submitted successfully");
      }
      setShowActions(false);
    } catch (error) {
      notify.error(`Failed to perform ${action.toLowerCase()}`);
      console.error(`Error performing ${action}:`, error);
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await axios.post(
        `${endpoint}/orders/${orderId}/upload`,
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setUploadedFiles([...uploadedFiles, response.data.file]);
      notify.success("File uploaded successfully");
    } catch (error) {
      notify.error("Failed to upload file");
      console.error("Error uploading file:", error);
    } finally {
      setUploading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "bg-amber-100 text-amber-700";
      case "completed":
        return "bg-green-100 text-green-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Navbar />
      <main className="flex-1 pt-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mt-12">
              Order <span className="text-slate-600">#{orderId}</span>
            </h1>
            <button
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-600 text-white rounded-md hover:bg-slate-700 transition-colors cursor-pointer mt-12"
              onClick={() => setShowActions(true)}
              aria-label="Open order actions"
            >
              
              Order Actions
              <MoreVertical className="w-4 h-4" />
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm text-slate-600">
                  {[
                    {
                      label: "Topic",
                      value: order.topic || "N/A",
                      icon: <FileText className="text-slate-600" size={18} />,
                    },
                    {
                      label: "Instructions",
                      value: order.instructions || "No instructions provided",
                      icon: <PenTool className="text-slate-600" size={18} />,
                    },
                    {
                      label: "Academic Level",
                      value: order.writer_level || "N/A",
                      icon: (
                        <GraduationCap className="text-slate-600" size={18} />
                      ),
                    },
                    {
                      label: "Format",
                      value: order.paper_format?.toUpperCase() || "N/A",
                      icon: (
                        <LayoutTemplate className="text-slate-600" size={18} />
                      ),
                    },
                    {
                      label: "Language",
                      value: order.english_type?.toUpperCase() || "N/A",
                      icon: <Flag className="text-slate-600" size={18} />,
                    },
                    {
                      label: "Subject",
                      value: order.subject || "N/A",
                      icon: <BookOpenText className="text-slate-600" size={18} />,
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
                      label: "Status",
                      value: (
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(
                            order.order_status
                          )}`}
                        >
                          {order.order_status || "N/A"}
                        </span>
                      ),
                      icon: <AlignJustify className="text-slate-600" size={18} />,
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
                      value: order.writer_assigned || "N/A",
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
                    <div
                      className="flex items-start gap-3"
                      key={label}
                      aria-label={`${label}: ${value}`}
                    >
                      {icon}
                      <div>
                        <strong className="font-semibold text-slate-800">
                          {label}:
                        </strong>{" "}
                        {value}
                      </div>
                    </div>
                  ))}
                  {order.attachment_url && (
                    <div className="flex items-center gap-3">
                      <Paperclip className="text-slate-600" size={18} />
                      <a
                        href={order.attachment_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-600 hover:text-slate-700 transition-colors"
                        aria-label="View attached file"
                      >
                        View Attachment
                      </a>
                    </div>
                  )}
                </div>

                {/* Files Uploaded Section */}
                <div>
                  <h2 className="text-lg font-semibold text-slate-800 mb-3">
                    Files Uploaded
                  </h2>
                  {uploadedFiles.length === 0 ? (
                    <div className="border border-dashed p-4 rounded text-center text-slate-500 bg-slate-50">
                      No files uploaded yet
                    </div>
                  ) : (
                    <ul className="space-y-2">
                      {uploadedFiles.map((file, index) => (
                        <li
                          key={index}
                          className="flex items-center gap-3 text-sm text-slate-600"
                        >
                          <Paperclip className="text-slate-600" size={18} />
                          <a
                            href={file.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-slate-600 hover:text-slate-700 transition-colors"
                            aria-label={`View uploaded file ${file.name}`}
                          >
                            {file.name || `File ${index + 1}`}
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Attach File Section */}
                <div>
                  <h2 className="text-lg font-semibold text-slate-800 mb-3">
                    Attach a File
                  </h2>
                  <div className="flex items-center gap-3">
                    <label
                      htmlFor="attach-file"
                      className={`inline-flex items-center px-4 py-2 bg-slate-600 text-white rounded-md cursor-pointer hover:bg-slate-700 transition-colors ${
                        uploading ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                      aria-label="Choose file to upload"
                    >
                      <UploadCloud className="mr-2" size={18} />
                      {uploading ? "Uploading..." : "Choose File"}
                    </label>
                    <input
                      type="file"
                      id="attach-file"
                      className="hidden"
                      onChange={handleFileUpload}
                      disabled={uploading}
                    />
                  </div>
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
            <h2 className="text-xl font-semibold text-slate-800 mb-4 cursor-pointer">
              Order Actions
            </h2>
            <div className="space-y-3">
              <button
                onClick={() => handleAction("Cancel Order")}
                className="flex items-center gap-3 w-full px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors text-left cursor-pointer"
                aria-label="Cancel order"
              >
                <Flag className="w-4 h-4" />
                Cancel Order
              </button>
              <button
                onClick={() => handleAction("Create Duplicate")}
                className="flex items-center gap-3 w-full px-4 py-2 bg-slate-100 text-slate-700 rounded-md hover:bg-slate-200 transition-colors text-left cursor-pointer"
                aria-label="Create duplicate order"
              >
                <ClipboardList className="w-4 h-4" />
                Create Duplicate
              </button>
              <button
                onClick={() => handleAction("Dispute Order")}
                className="flex items-center gap-3 w-full px-4 py-2 bg-amber-100 text-amber-700 rounded-md hover:bg-amber-200 transition-colors text-left cursor-pointer"
                aria-label="Dispute order"
              >
                <AlignJustify className="w-4 h-4" />
                Dispute Order
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
