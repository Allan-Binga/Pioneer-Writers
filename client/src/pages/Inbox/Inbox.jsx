import { useState, useEffect } from "react";
import axios from "axios";
import {
  Mail,
  Send,
  SquarePen,
  Trash2,
  Star,
  Archive,
  Search,
  X,
  Paperclip,
} from "lucide-react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import { endpoint } from "../../server";
import { notify } from "../../utils/toast";

// Compose Modal
function ComposeModal({ onClose }) {
  const [subjectField, setSubjectField] = useState("");
  const [writers, setWriters] = useState([]);
  const [selectedWriters, setSelectedWriters] = useState([]);
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [isIndividual, setIsIndividual] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch writers when subject field changes
  useEffect(() => {
    if (!subjectField) return;

    const fetchWriters = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${endpoint}/writers/all?field=${subjectField.toLowerCase()}`,
          { withCredentials: true }
        );
        setWriters(response.data);
        // Auto-populate selected writers
        setSelectedWriters(
          response.data.map((writer) => ({
            id: writer.writer_id,
            email: writer.email,
            username: writer.username || writer.email,
          }))
        );
        setError("");
      } catch (err) {
        setWriters([]);
        setSelectedWriters([]);
        setError("No writers available for this field");
        notify.error("No writers available for this field");
      } finally {
        setLoading(false);
      }
    };

    fetchWriters();
  }, [subjectField]);

  // Handle sending message
  const handleSend = async () => {
    if (!selectedWriters.length) {
      setError("Please select at least one recipient");
      notify.error("Please select at least one recipient");
      return;
    }
    if (!subject || !content) {
      setError("Subject and message are required");
      notify.error("Subject and message are required");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        `${endpoint}/inbox/send/email/writer`,
        {
          receiver_ids: selectedWriters.map((writer) => writer.id),
          subject,
          content,
        },
        { withCredentials: true }
      );
      notify.success("Message sent successfully!");
      onClose();
    } catch (err) {
      const errorMessage =
        err.response?.data?.error || "Failed to send message";
      setError(errorMessage);
      notify.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Handle writer selection
  const handleWriterSelect = (writer) => {
    if (!selectedWriters.some((w) => w.id === writer.id)) {
      setSelectedWriters([...selectedWriters, writer]);
    }
  };

  // Remove writer from selection
  const removeWriter = (writerId) => {
    setSelectedWriters(selectedWriters.filter((w) => w.id !== writerId));
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
          <h2 className="text-2xl font-semibold text-slate-800">
            Compose Message
          </h2>

          {error && <div className="text-red-500 text-sm">{error}</div>}

          <div>
            <label className="block text-md font-medium text-slate-700">
              Subject Field
            </label>
            <select
              value={subjectField}
              onChange={(e) => setSubjectField(e.target.value)}
              className="w-full mt-1 border border-slate-300 rounded px-3 py-2"
            >
              <option value="">Select a field</option>
              {[
                "Math",
                "Ethics",
                "Computer Science",
                "History",
                "Physics",
                "Biology",
                "English",
                "Science",
                "Social Sciences",
                "Philosophy",
                "Law",
              ].map((field) => (
                <option key={field} value={field}>
                  {field}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="individual"
              checked={isIndividual}
              onChange={() => setIsIndividual(!isIndividual)}
              className="mr-2"
            />
            <label htmlFor="individual" className="text-md text-slate-700">
              Send an individual message to each recipient
            </label>
          </div>

          <div>
            <label className="block text-md font-medium text-slate-700">
              To *
            </label>
            <div className="flex flex-wrap border border-slate-300 rounded p-2 gap-2">
              {selectedWriters.map((writer) => (
                <div
                  key={writer.id}
                  className="bg-slate-100 px-2 py-1 rounded flex items-center"
                >
                  {writer.username}
                  <button
                    onClick={() => removeWriter(writer.id)}
                    className="ml-2 text-red-500"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <input
                type="text"
                placeholder={selectedWriters.length ? "" : "Select writers"}
                className="flex-1 px-3 py-2 outline-none min-w-[100px]"
                disabled
              />
            </div>
            {writers.length > 0 && (
              <div className="mt-2 max-h-40 overflow-y-auto border border-slate-200 rounded">
                {writers.map((writer) => (
                  <div
                    key={writer.writer_id}
                    onClick={() =>
                      handleWriterSelect({
                        id: writer.writer_id,
                        email: writer.email,
                        username: writer.username || writer.email,
                      })
                    }
                    className="px-3 py-2 hover:bg-slate-100 cursor-pointer"
                  >
                    {writer.username || writer.email}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block text-md font-medium text-slate-700">
              Subject
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Insert Subject"
              className="w-full border border-slate-300 rounded px-3 py-2 mt-1"
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
              className="w-full border border-slate-300 rounded px-3 py-2 mt-1 resize-none"
            />
          </div>

          <div className="flex justify-between items-center mt-4">
            <div className="space-x-2">
              {/* <button className="p-2 border rounded hover:bg-slate-100 cursor-pointer">
                <Paperclip className="w-6 h-6" />
              </button> */}
            </div>
            <div className="space-x-2">
              <button
                onClick={onClose}
                className="px-4 py-2 border rounded text-slate-700 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={handleSend}
                disabled={loading}
                className="px-4 py-2 bg-slate-700 text-white rounded hover:bg-slate-600 disabled:bg-slate-300 cursor-pointer"
              >
                {loading ? "Sending..." : "Send"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Inbox Component (remove unnecessary writers fetch)
function Inbox() {
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isComposeModalOpen, setIsComposeModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("inbox"); // Track selected filter

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const openComposeModal = () => setIsComposeModalOpen(true);
  const closeComposeModal = () => setIsComposeModalOpen(false);

  // Fetch messages based on filter
  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${endpoint}/inbox/messages/all?filter=${filter}`,
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
  }, [filter]); // Re-fetch when filter changes

  // Handle filter change from dropdown or sidebar
  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    setSelectedMessage(null); // Clear selected message when filter changes
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50">
      <Navbar toggleMobileSidebar={toggleSidebar} />
      <Sidebar isOpen={isSidebarOpen} />

      <main
        className={`transition-all duration-300 pt-16 px-6 ${
          isSidebarOpen ? "ml-64" : "ml-0 md:ml-72"
        }`}
      >
        <div className="max-w-screen-4xl mx-auto py-10">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 sm:p-6">
            <div className="flex flex-col lg:flex-row">
              {/* Sidebar */}
              <aside className="w-full lg:w-64 lg:pr-6 border-b lg:border-b-0 lg:border-r border-slate-100 pt-6 lg:pt-10 mb-6 lg:mb-0">
                <div className="text-xs uppercase font-medium text-slate-500 mb-4 tracking-wider px-2">
                  Folders
                </div>
                <div className="space-y-3 text-md">
                  {[
                    { icon: Mail, label: "Inbox", filter: "inbox" },
                    { icon: Star, label: "Starred", filter: "unread" }, // Adjust filter as needed
                    { icon: Send, label: "Sent", filter: "sent" },
                    { icon: Archive, label: "Archived", filter: "archived" },
                    {
                      icon: Trash2,
                      label: "Trash",
                      filter: "trash",
                      danger: true,
                    },
                  ].map(
                    ({ icon: Icon, label, filter: filterValue, danger }) => (
                      <div
                        key={label}
                        onClick={() => handleFilterChange(filterValue)}
                        className={`flex items-center px-3 py-2 rounded-lg cursor-pointer transition ${
                          filter === filterValue
                            ? "bg-slate-200 text-slate-800"
                            : danger
                            ? "text-red-600 hover:bg-red-50"
                            : "text-slate-700 hover:bg-slate-100"
                        }`}
                      >
                        <Icon className="w-4 h-4 mr-3" />
                        {label}
                      </div>
                    )
                  )}
                </div>
              </aside>

              {/* Main Panel */}
              <section className="flex-1 lg:pl-6 flex flex-col">
                {/* Toolbar */}
                <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-6">
                  <select
                    value={filter}
                    onChange={(e) => handleFilterChange(e.target.value)}
                    className="border border-slate-300 text-slate-700 rounded-lg px-3 py-2 text-md bg-white focus:outline-none focus:ring-2 focus:ring-slate-300"
                  >
                    <option value="inbox">Inbox</option>
                    <option value="sent">Sent</option>
                    <option value="unread">Unread</option>
                    <option value="archived">Archived</option>
                    <option value="trash">Trash</option>
                  </select>

                  <div className="flex items-center border border-slate-300 rounded-lg px-3 py-2 bg-white w-full md:w-auto flex-1 md:flex-initial">
                    <Search className="w-4 h-4 text-slate-500 mr-2" />
                    <input
                      type="text"
                      placeholder="Search messages..."
                      className="w-full outline-none text-md text-slate-700 bg-transparent placeholder-slate-400"
                    />
                  </div>

                  <button
                    onClick={openComposeModal}
                    className="flex items-center justify-center px-4 py-2 bg-slate-600 text-white rounded-lg text-md hover:bg-slate-500 transition whitespace-nowrap cursor-pointer"
                  >
                    <SquarePen className="w-4 h-4 mr-2" />
                    Compose
                  </button>
                </div>

                {/* Main Content */}
                <div className="flex flex-col lg:flex-row flex-1 overflow-hidden gap-4">
                  {/* Message List */}
                  <div className="lg:w-1/3 border border-slate-200 bg-white rounded-xl shadow-sm overflow-y-auto max-h-[30rem]">
                    {loading ? (
                      <div className="flex justify-center py-4">
                        <p className="text-slate-500">Loading...</p>
                      </div>
                    ) : messages.length === 0 ? (
                      <div className="flex justify-center py-4">
                        <p className="text-slate-500">No messages found</p>
                      </div>
                    ) : (
                      <ul className="divide-y divide-slate-100">
                        {messages.map((message) => (
                          <li
                            key={message.message_id}
                            onClick={() =>
                              setSelectedMessage((prev) =>
                                prev?.message_id === message.message_id
                                  ? null
                                  : message
                              )
                            }
                            className={`px-4 py-4 hover:bg-slate-50 cursor-pointer transition relative ${
                              selectedMessage?.message_id === message.message_id
                                ? "bg-slate-100"
                                : ""
                            }`}
                          >
                            <div
                              className={`absolute top-2 left-2 w-4 h-4 rounded-full border-2 z-10 ${
                                !message.is_read
                                  ? "bg-slate-800 border-slate-800"
                                  : "bg-white border-slate-300"
                              }`}
                            ></div>

                            <div className="pl-6">
                              <div className="flex justify-between mb-1">
                                <span className="font-semibold text-slate-800">
                                  {message.sender_email || "Unknown Sender"}
                                </span>
                                <span className="text-xs text-slate-400">
                                  {new Date(message.sent_at).toLocaleTimeString(
                                    [],
                                    {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    }
                                  )}
                                </span>
                              </div>
                              <div className="text-md text-slate-600">
                                {message.subject}
                              </div>
                              <div className="text-xs text-slate-400 truncate">
                                {message.content}
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {/* Message Viewer */}
                  <div className="flex-1 px-2 bg-gradient-to-br from-slate-50 to-white overflow-y-auto rounded-xl border border-slate-200">
                    {selectedMessage ? (
                      <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100 space-y-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <h2 className="text-lg font-semibold text-slate-800">
                              {selectedMessage.subject}
                            </h2>
                            <p className="text-md text-slate-500">
                              From: {selectedMessage.sender_email}
                            </p>
                            <p className="text-md text-slate-500">
                              To: {selectedMessage.receiver_email}
                            </p>
                          </div>
                          <button
                            onClick={() => setSelectedMessage(null)}
                            className="text-slate-400 hover:text-red-500"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                        <div className="text-md text-slate-700 leading-relaxed">
                          {selectedMessage.content}
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full space-y-4 text-center text-slate-400 p-8">
                        <Mail className="w-14 h-14 text-slate-300" />
                        <p className="text-md italic">No messages selected</p>
                      </div>
                    )}
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>

        {isComposeModalOpen && <ComposeModal onClose={closeComposeModal} />}
      </main>
    </div>
  );
}

export default Inbox;
