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
  Paperclip,
  Hourglass,
  UserCheck,
  UploadCloud,
  Check,
  X,
  Star,
} from "lucide-react";
import { backend } from "../../backend";
import axios from "axios";
import { useEffect, useState } from "react";
import { notify } from "../../utils/toast";
import moment from "moment";
import { useParams } from "react-router-dom";
import Spinner from "../../components/Spinner";

function OrderDetails() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [ratingLoading, setRatingLoading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]); // files chosen but not yet submitted
  const [submissionNotes, setSubmissionNotes] = useState(""); // optional notes
  const [showConfirm, setShowConfirm] = useState(false); // control warning visibility
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;

    // Add to local selectedFiles state with additional metadata
    const newFiles = files.map((file) => ({
      file,
      originalname: file.name,
      uploadedAt: new Date().toISOString(),
      isPending: true, // mark as pending until submitted
    }));
    setSelectedFiles((prev) => [...prev, ...newFiles]);
    notify.info(`${files.length} file(s) selected for submission.`);
  };

  const handleRemoveFile = (indexToRemove) => {
    setSelectedFiles((prev) =>
      prev.filter((_, index) => index !== indexToRemove)
    );
    notify.info("File removed from selection.");
  };

  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${backend}/orders/order/${orderId}`, {
          withCredentials: true,
        });
        setOrder(response.data);
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

  const handleAssignmentSubmit = async () => {
    if (selectedFiles.length === 0) {
      notify.error("Please select at least one file before submitting.");
      return;
    }
    setShowConfirm(true); // Show confirmation div
  };

  const confirmSubmission = async () => {
    setUploading(true);
    setShowConfirm(false);
    try {
      const formData = new FormData();
      selectedFiles.forEach(({ file }) =>
        formData.append("uploadedFiles", file)
      );
      if (submissionNotes) formData.append("submissionNotes", submissionNotes);

      const response = await axios.post(
        `${backend}/orders/submit-assignment/${orderId}`,
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      // Merge submitted files into displayed list
      setUploadedFiles([
        ...uploadedFiles,
        ...(response.data.order.submitted_files || []).map((file) => ({
          ...file,
          isPending: false,
        })),
      ]);

      // Clear selected files and notes
      setSelectedFiles([]);
      setSubmissionNotes("");

      notify.success("Assignment submitted successfully!");
      setOrder(response.data.order); // update order status
    } catch (error) {
      console.error("Submission error:", error);
      notify.error("Failed to submit assignment.");
    } finally {
      setUploading(false);
    }
  };

  //Rate Client
  const handleRate = async () => {
    if (rating < 1 || rating > 5) {
      notify.error("Please select a rating between 1 and 5 stars.");
      return;
    }

    setRatingLoading(true);
    try {
      const rateClient = await axios.post(
        `${backend}/ratings/rate-client/${order.user_id}`,
        {
          order_id: orderId,
          rating,
          comment,
        },
        { withCredentials: true }
      );

      if (rateClient.status === 201) {
        notify.success("Client rated successfully.");
        setShowRatingModal(false);
        setRating(0);
        setComment("");
      }
    } catch (error) {
      notify.error(error.response?.data?.message || "Failed to rate client.");
    } finally {
      setRatingLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "assigned":
        return "bg-blue-100 text-blue-800";
      case "submitted":
        return "bg-green-100 text-green-800";
      case "completed":
        return "bg-teal-100 text-teal-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
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
          </div>

          <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-sm border border-slate-200 space-y-8">
            {loading ? (
              <div className="flex items-center justify-center gap-2 text-slate-600">
                <Spinner size="small" />
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
                      value: (() => {
                        const now = moment();
                        const deadlineMoment = moment(order.deadline);
                        const diff = moment.duration(deadlineMoment.diff(now));

                        if (diff.asMilliseconds() <= 0) {
                          return "Deadline passed";
                        }

                        const days = Math.floor(diff.asDays());
                        const hours = diff.hours();
                        const minutes = diff.minutes();

                        return `${days}d ${hours}h ${minutes}m`;
                      })(),
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
                      value: order.writer_assigned || "Public",
                      icon: <UserCheck className="text-slate-600" size={18} />,
                    },
                    {
                      label: "Price",
                      value: order.total_price
                        ? `$${parseFloat(order.total_price).toFixed(2)}`
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

                {/* Uploaded Files Section */}
                <div>
                  <h2 className="text-lg font-semibold text-slate-800 mb-3">
                    Uploaded Files
                  </h2>
                  {[
                    ...(order.submitted_files || []),
                    ...selectedFiles,
                    ...uploadedFiles,
                  ].length === 0 ? (
                    <div className="border border-dashed p-4 rounded text-center text-slate-500 bg-slate-50">
                      No files uploaded yet
                    </div>
                  ) : (
                    <ul className="space-y-2">
                      {[
                        ...(order.submitted_files || []),
                        ...selectedFiles,
                        ...uploadedFiles,
                      ].map((file, index) => {
                        const uploadedDate = new Date(
                          file.uploadedAt
                        ).toLocaleString();
                        const isPending = file.isPending || false;

                        return (
                          <li
                            key={index}
                            className="flex items-center justify-between gap-3 text-sm text-slate-600 bg-slate-50 p-2 rounded-md border border-slate-200"
                          >
                            <div className="flex items-center gap-3">
                              <Paperclip className="text-slate-600" size={18} />
                              <span
                                className={`font-medium ${
                                  isPending
                                    ? "text-slate-500 italic"
                                    : "text-slate-600"
                                }`}
                              >
                                {file.originalname || `File ${index + 1}`}
                                {isPending && " (Pending Submission)"}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-slate-400">
                                Uploaded {uploadedDate}
                              </span>
                              {isPending && (
                                <button
                                  onClick={() => handleRemoveFile(index)}
                                  className="text-slate-500 hover:text-red-600"
                                  aria-label={`Remove ${file.originalname}`}
                                >
                                  <X size={18} />
                                </button>
                              )}
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>

                {/* Submission Status Section */}
                <div className="relative">
                  <h2 className="text-lg font-semibold text-slate-800 mb-3">
                    Submission Status
                  </h2>

                  {order.assignment_status === "submitted" ? (
                    <div className="flex items-center gap-2 text-green-600 text-sm font-medium">
                      <Check size={16} className="flex-shrink-0" />
                      Assignment submitted successfully!
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3">
                      <textarea
                        placeholder="Add submission notes (optional)"
                        className="w-full border border-slate-300 rounded-md p-3 text-sm focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
                        rows={4}
                        value={submissionNotes}
                        onChange={(e) => setSubmissionNotes(e.target.value)}
                      />
                      <div className="flex items-center gap-3">
                        <label
                          htmlFor="submit-file"
                          className={`inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md cursor-pointer hover:bg-green-700 transition-colors ${
                            uploading || order.assignment_status === "submitted"
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                          }`}
                        >
                          <UploadCloud className="mr-2" size={18} />
                          {selectedFiles.length > 0
                            ? `${selectedFiles.length} file(s) selected`
                            : "Choose File"}
                        </label>
                        <input
                          type="file"
                          id="submit-file"
                          className="hidden"
                          onChange={handleFileSelect}
                          disabled={
                            uploading || order.assignment_status === "submitted"
                          }
                          multiple
                        />
                        <button
                          className={`px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors cursor-pointer ${
                            uploading || order.assignment_status === "submitted"
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                          }`}
                          onClick={handleAssignmentSubmit}
                          disabled={
                            uploading || order.assignment_status === "submitted"
                          }
                        >
                          {uploading ? "Submitting..." : "Submit"}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Confirmation Warning */}
                  {showConfirm && (
                    <div className="fixed inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center z-50">
                      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                        <h3 className="text-lg font-semibold text-slate-800 mb-4">
                          Confirm Submission
                        </h3>
                        <p className="text-sm text-slate-600 mb-6">
                          Are you sure you want to submit the selected file(s)?
                          This action cannot be undone.
                        </p>
                        <div className="flex justify-end gap-3">
                          <button
                            className="px-4 py-2 bg-slate-200 text-slate-700 rounded-md hover:bg-slate-300 transition-colors cursor-pointer"
                            onClick={() => setShowConfirm(false)}
                          >
                            Cancel
                          </button>
                          <button
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors cursor-pointer"
                            onClick={confirmSubmission}
                          >
                            Confirm
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Rate Client Section */}
                <div className="relative mt-8">
                  <h2 className="text-lg font-semibold text-slate-800 mb-3">
                    Rate Client
                  </h2>

                  <button
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                    onClick={() => setShowRatingModal(true)}
                  >
                    Leave a Rating
                  </button>

                  {/* Rating Modal */}
                  {showRatingModal && (
                    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
                      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full space-y-4">
                        <h3 className="text-lg font-semibold text-slate-800 mb-2">
                          Rate Client
                        </h3>

                        {/* Stars */}
                        <div className="flex gap-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              onClick={() => setRating(star)}
                              className={`text-2xl ${
                                star <= rating
                                  ? "text-yellow-400"
                                  : "text-slate-300"
                              }`}
                            >
                              ★
                            </button>
                          ))}
                        </div>

                        {/* Comment */}
                        <textarea
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                          rows={3}
                          placeholder="Leave a comment..."
                          className="w-full border border-slate-100 rounded-md p-3 text-sm focus:ring-2 focus:ring-gray-100 focus:border-gray-100"
                        />

                        {/* Actions */}
                        <div className="flex justify-end gap-3">
                          <button
                            className="px-4 py-2 bg-slate-200 text-slate-700 rounded-md hover:bg-slate-300 transition-colors cursor-pointer"
                            onClick={() => setShowRatingModal(false)}
                          >
                            Cancel
                          </button>
                          <button
                            className={`px-4 py-2 rounded-md text-white transition-colors cursor-pointer ${
                              ratingLoading
                                ? "bg-indigo-400 cursor-not-allowed"
                                : "bg-indigo-600 hover:bg-indigo-700"
                            }`}
                            onClick={handleRate}
                            disabled={ratingLoading}
                          >
                            {ratingLoading ? "Submitting..." : "Submit Rating"}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="text-center text-red-600">
                Order not found.
                <a
                  href="/public-orders"
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
      <Footer />
    </div>
  );
}

export default OrderDetails;
