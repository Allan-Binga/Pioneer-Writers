import { useState, useEffect } from "react";
import axios from "axios";
import {
  Send,
  X,
  User,
  Users,
  BookOpen,
  PenSquare,
  GraduationCap,
  Eye,
  Archive,
  Trash2,
} from "lucide-react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { endpoint } from "../../server";
import { notify } from "../../utils/toast";

// Compose Modal Component (unchanged)
function ComposeModal({ onClose, defaultTargetType }) {
  const [targetType, setTargetType] = useState(defaultTargetType || "");
  const [targetValue, setTargetValue] = useState([]);
  const [clients, setClients] = useState([]);
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (targetType !== "specific_client") {
      setClients([]);
      setTargetValue([]);
      return;
    }

    const fetchClients = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${endpoint}/users/clients`, {
          withCredentials: true,
        });
        setClients(response.data);
        setError("");
      } catch (err) {
        setClients([]);
        setError("Failed to fetch clients");
        notify.error("Failed to fetch clients");
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, [targetType]);

  const handleClientSelect = (client) => {
    if (!targetValue.some((c) => c.id === client.id)) {
      setTargetValue([...targetValue, client]);
    }
  };

  const removeClient = (clientId) => {
    setTargetValue(targetValue.filter((c) => c.id !== clientId));
  };

  const handleSend = async () => {
    if (targetType === "specific_client" && !targetValue.length) {
      setError("Please select at least one client");
      notify.error("Please select at least one client");
      return;
    }
    if (!targetType) {
      setError("Please select a target type");
      notify.error("Please select a target type");
      return;
    }
    if (!subject || !content) {
      setError("Subject and message are required");
      notify.error("Subject and message are required");
      return;
    }

    try {
      setLoading(true);
      const payload = {
        target_type: targetType,
        target_value:
          targetType === "specific_client"
            ? targetValue.map((client) => client.id)
            : targetType === "client_category"
            ? targetValue
            : null,
        subject,
        content,
      };

      await axios.post(`${endpoint}/inbox/send-email/administrator`, payload, {
        withCredentials: true,
      });

      notify.success("Emails sent successfully!");
      onClose();
    } catch (err) {
      const errorMessage = err.response?.data?.error || "Failed to send emails";
      setError(errorMessage);
      notify.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 backdrop-blur-md bg-white/30 flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-2xl rounded-xl shadow-xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-500 hover:text-red-500 cursor-pointer"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="p-6 space-y-4">
          <h2 className="text-2xl font-semibold text-slate-800 flex items-center">
            <PenSquare className="w-6 h-6 mr-2" />
            Compose Email
          </h2>

          {error && <div className="text-red-500 text-sm">{error}</div>}

          <div>
            <label className="block text-md font-medium text-slate-700">
              Receiver *
            </label>
            <select
              value={targetType}
              onChange={(e) => setTargetType(e.target.value)}
              disabled={!!defaultTargetType}
              className="w-full mt-1 border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:border-gray-200 focus:ring-1 focus:ring-gray-200 transition"
            >
              <option value="">Select a target type</option>
              <option value="specific_client">Specific Client</option>
              <option value="client_category">Client Category</option>
              <option value="all_clients">All Clients</option>
              <option value="all_writers">All Writers</option>
            </select>
          </div>

          {targetType === "specific_client" && (
            <div>
              <label className="block text-md font-medium text-slate-700">
                Select Clients *
              </label>
              <div className="flex flex-wrap border border-slate-300 rounded-lg p-2 gap-2">
                {targetValue.map((client) => (
                  <div
                    key={client.id}
                    className="bg-slate-100 px-2 py-1 rounded flex items-center"
                  >
                    {client.email}
                    <button
                      onClick={() => removeClient(client.id)}
                      className="ml-2 text-red-500"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <input
                  type="text"
                  placeholder={targetValue.length ? "" : "Select clients"}
                  className="flex-1 px-3 py-2 outline-none min-w-[100px]"
                  disabled
                />
              </div>

              {clients.length > 0 && (
                <select
                  onChange={(e) => {
                    const selected = clients.find(
                      (c) => c.user_id === e.target.value
                    );
                    if (selected) {
                      handleClientSelect({
                        id: selected.user_id,
                        email: selected.email,
                      });
                    }
                  }}
                  className="w-full mt-2 border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:border-gray-200 focus:ring-1 focus:ring-gray-200"
                >
                  <option value="">-- Select Client --</option>
                  {clients.map((client) => (
                    <option key={client.user_id} value={client.user_id}>
                      {client.email}
                    </option>
                  ))}
                </select>
              )}
            </div>
          )}

          {targetType === "client_category" && (
            <div>
              <label className="block text-md font-medium text-slate-700">
                Client Category *
              </label>
              <select
                value={targetValue}
                onChange={(e) => setTargetValue(e.target.value)}
                className="w-full mt-1 border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:border-gray-200 focus:ring-1 focus:ring-gray-200"
              >
                <option value="">Select a category</option>
                <option value="assignment">Assignment</option>
                <option value="online_class">Online Class</option>
              </select>
            </div>
          )}

          <div>
            <label className="block text-md font-medium text-slate-700">
              Subject *
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Enter subject"
              className="w-full border border-slate-300 rounded-lg px-3 py-2 mt-1 focus:outline-none focus:border-gray-200 focus:ring-1 focus:ring-gray-200"
            />
          </div>

          <div>
            <label className="block text-md font-medium text-slate-700">
              Message *
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Type your message..."
              rows={5}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 mt-1 resize-none focus:outline-none focus:border-gray-200 focus:ring-1 focus:ring-gray-200"
            />
          </div>

          <div className="flex justify-end space-x-2 mt-4">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              onClick={handleSend}
              disabled={loading}
              className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 disabled:bg-slate-300 flex items-center"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4 mr-2 text-white"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8z"
                    />
                  </svg>
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Send
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// MessageCenter Component
function MessageCenter() {
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("inbox");
  const [isComposeModalOpen, setIsComposeModalOpen] = useState(false);
  const [selectedTargetType, setSelectedTargetType] = useState("");

  // Fetch Messages
  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${endpoint}/inbox/administrator/messages/all?filter=${filter}`,
          {
            withCredentials: true,
          }
        );
        console.log("Fetched messages:", response.data);
        setMessages(response.data.messages || []);
      } catch (error) {
        console.error("Failed to fetch messages:", error);
        notify.info("Failed to fetch messages.");
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, [filter]);

  // Handle filter change
  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    setSelectedMessage(null);
  };

  // Handle message actions (archive, delete)
  const handleMessageAction = async (messageId, action) => {
    try {
      await axios.post(
        `${endpoint}/inbox/administrator/messages/${action}`,
        { message_id: messageId },
        { withCredentials: true }
      );
      notify.success(
        `${action.charAt(0).toUpperCase() + action.slice(1)}d successfully!`
      );
      setMessages(messages.filter((msg) => msg.message_id !== messageId));
      if (selectedMessage?.message_id === messageId) {
        setSelectedMessage(null);
      }
    } catch (error) {
      notify.error(`Failed to ${action} message.`);
    }
  };

  const openComposeModal = (targetType) => {
    setSelectedTargetType(targetType);
    setIsComposeModalOpen(true);
  };

  const closeComposeModal = () => {
    setIsComposeModalOpen(false);
    setSelectedTargetType("");
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50">
      <Navbar />
      <main className="flex-1 pt-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-semibold text-slate-800 mb-6 mt-8 flex items-center">
            Email Marketing Service
          </h1>
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <p className="text-md text-slate-600 mb-6 text-center">
              Choose a recipient group to send your email
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                {
                  targetType: "specific_client",
                  icon: User,
                  title: "Specific Client",
                  description: "Send an email to one or more selected clients",
                },
                {
                  targetType: "client_category",
                  icon: BookOpen,
                  title: "Client Category",
                  description:
                    "Target clients by category (e.g., Assignment, Online Class)",
                },
                {
                  targetType: "all_clients",
                  icon: Users,
                  title: "All Clients",
                  description: "Send an email to all registered clients",
                },
                {
                  targetType: "all_writers",
                  icon: GraduationCap,
                  title: "All Writers",
                  description: "Send an email to all registered writers",
                },
              ].map(({ targetType, icon: Icon, title, description }) => (
                <button
                  key={targetType}
                  onClick={() => openComposeModal(targetType)}
                  className="flex flex-col items-center p-4 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 shadow-sm transition hover:shadow-md cursor-pointer"
                >
                  <Icon className="w-8 h-8 text-slate-600 mb-2" />
                  <h3 className="text-lg font-semibold text-slate-800">
                    {title}
                  </h3>
                  <p className="text-sm text-slate-500 text-center">
                    {description}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Recent Emails Section */}
          <div className="mt-10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-semibold text-slate-800 flex items-center">
                Recent Emails
              </h2>
              {/* Filter Tabs */}
              <div className="flex justify-center flex-wrap gap-3 mt-4 mb-6">
                {[
                  { label: "Inbox", value: "inbox" },
                  { label: "Sent", value: "sent_by_admin" },
                  { label: "Unread", value: "unread" },
                  { label: "Archived", value: "archived" },
                  { label: "Trash", value: "trash" },
                  { label: "All", value: "all" },
                ].map(({ label, value }) => (
                  <button
                    key={value}
                    onClick={() => handleFilterChange(value)}
                    className={`px-4 py-2 rounded-full text-sm font-medium border transition ${
                      filter === value
                        ? "bg-amber-100 text-amber-800 border-amber-300"
                        : "bg-white text-slate-600 border-slate-300 hover:bg-slate-100"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              {loading ? (
                <div className="flex justify-center items-center py-8">
                  <svg
                    className="animate-spin h-6 w-6 text-slate-600"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8z"
                    />
                  </svg>
                  <span className="ml-2 text-slate-600">
                    Loading messages...
                  </span>
                </div>
              ) : messages.length === 0 ? (
                <p className="text-slate-500 text-center py-8">
                  No messages found.
                </p>
              ) : (
                <div className="space-y-4">
                  {messages.map((msg) => (
                    <div
                      key={msg.message_id}
                      className={`flex items-start p-4 rounded-lg border transition-all duration-200 ${
                        selectedMessage?.message_id === msg.message_id
                          ? "bg-amber-50 border-amber-200 shadow-md"
                          : "bg-white border-slate-200 hover:bg-slate-50 hover:shadow"
                      } cursor-pointer`}
                      onClick={() => setSelectedMessage(msg)}
                    >
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex items-center space-x-2">
                            <span className="font-semibold text-slate-800">
                              {msg.receiver_email || "Unknown Recipient"}
                            </span>
                            <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">
                              ID: {msg.receiver_id || "N/A"}
                            </span>
                          </div>
                          <span className="text-xs text-slate-500">
                            {new Date(msg.sent_at).toLocaleString()}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-sm text-slate-600">
                            From: {msg.sender_email || "Unknown Sender"}
                          </span>
                          <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">
                            ID: {msg.sender_id || "N/A"}
                          </span>
                        </div>
                        <p className="text-sm font-medium text-slate-700">
                          {msg.subject || "No Subject"}
                        </p>
                        <p className="text-sm text-slate-500 line-clamp-2">
                          {msg.content}
                        </p>
                      </div>
                      <div className="ml-4 flex flex-col space-y-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedMessage(msg);
                          }}
                          className="text-slate-600 hover:text-amber-600"
                          title="View Message"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMessageAction(msg.message_id, "archive");
                          }}
                          className="text-slate-600 hover:text-blue-600"
                          title="Archive Message"
                        >
                          <Archive className="w-5 h-5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMessageAction(msg.message_id, "trash");
                          }}
                          className="text-slate-600 hover:text-red-600"
                          title="Delete Message"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {selectedMessage && (
              <div className="mt-6 bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-slate-800">
                    {selectedMessage.subject || "No Subject"}
                  </h3>
                  <button
                    onClick={() => setSelectedMessage(null)}
                    className="text-slate-500 hover:text-red-500"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-slate-600">
                    <strong>From:</strong>{" "}
                    {selectedMessage.sender_email || "Unknown Sender"} (ID:{" "}
                    {selectedMessage.sender_id || "N/A"})
                  </p>
                  <p className="text-sm text-slate-600">
                    <strong>To:</strong>{" "}
                    {selectedMessage.receiver_email || "Unknown Recipient"} (ID:{" "}
                    {selectedMessage.receiver_id || "N/A"})
                  </p>
                  <p className="text-sm text-slate-600">
                    <strong>Date:</strong>{" "}
                    {new Date(selectedMessage.sent_at).toLocaleString()}
                  </p>
                  <div className="border-t border-slate-200 pt-4 mt-4">
                    <p className="text-sm text-slate-700 whitespace-pre-wrap">
                      {selectedMessage.content}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {isComposeModalOpen && (
            <ComposeModal
              onClose={closeComposeModal}
              defaultTargetType={selectedTargetType}
            />
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default MessageCenter;
