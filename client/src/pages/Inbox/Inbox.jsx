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
import { useState } from "react";

// Compose Modal
function ComposeModal({ onClose }) {
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

          <div>
            <label className="block text-md font-medium text-slate-700">
              Course
            </label>
            <select className="w-full mt-1 border border-slate-300 rounded px-3 py-2">
              <option>Select Course</option>
              <option>Math</option>
              <option>Science</option>
            </select>
          </div>

          <div className="flex items-center">
            <input type="checkbox" id="individual" className="mr-2" />
            <label htmlFor="individual" className="text-md text-slate-700">
              Send an individual message to each recipient
            </label>
          </div>

          <div>
            <label className="block text-md font-medium text-slate-700">
              To *
            </label>
            <div className="flex border border-slate-300 rounded overflow-hidden">
              <input
                type="text"
                placeholder="Insert or Select Names"
                className="flex-1 px-3 py-2 outline-none"
              />
              <button className="px-3 bg-slate-100 hover:bg-slate-200 cursor-pointer">
                <svg
                  className="w-5 h-5 text-slate-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M13 7h4v2h-4v4h-2V9H7V7h4V3h2v4z" />
                </svg>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-md font-medium text-slate-700">
              Subject
            </label>
            <input
              type="text"
              placeholder="Insert Subject"
              className="w-full border border-slate-300 rounded px-3 py-2 mt-1"
            />
          </div>

          <div>
            <label className="block text-md font-medium text-slate-700">
              Message *
            </label>
            <textarea
              placeholder="Type your message..."
              rows={5}
              className="w-full border border-slate-300 rounded px-3 py-2 mt-1 resize-none"
            />
          </div>

          <div className="flex justify-between items-center mt-4">
            <div className="space-x-2">
              <button className="p-2 border rounded hover:bg-slate-100 cursor-pointer">
                <Paperclip className="w-6 h-6" />
              </button>
            </div>
            <div className="space-x-2">
              <button
                onClick={onClose}
                className="px-4 py-2 border rounded text-slate-700 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500">
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Inbox Component
function Inbox() {
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isComposeModalOpen, setIsComposeModalOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const openComposeModal = () => setIsComposeModalOpen(true);
  const closeComposeModal = () => setIsComposeModalOpen(false);

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
                    { icon: Mail, label: "Inbox" },
                    { icon: Star, label: "Starred" },
                    { icon: Send, label: "Sent" },
                    { icon: Archive, label: "Archived" },
                    { icon: Trash2, label: "Trash", danger: true },
                  ].map(({ icon: Icon, label, danger }) => (
                    <div
                      key={label}
                      className={`flex items-center px-3 py-2 rounded-lg cursor-pointer transition ${
                        danger
                          ? "text-red-600 hover:bg-red-50"
                          : "text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      <Icon className="w-4 h-4 mr-3" />
                      {label}
                    </div>
                  ))}
                </div>
              </aside>

              {/* Main Panel */}
              <section className="flex-1 lg:pl-6 flex flex-col">
                {/* Toolbar */}
                <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-6">
                  <select className="border border-slate-300 text-slate-700 rounded-lg px-3 py-2 text-md bg-white focus:outline-none focus:ring-2 focus:ring-slate-300">
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
                    className="flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-lg text-md hover:bg-indigo-500 transition whitespace-nowrap"
                  >
                    <SquarePen className="w-4 h-4 mr-2" />
                    Compose
                  </button>
                </div>

                {/* Main Content */}
                <div className="flex flex-col lg:flex-row flex-1 overflow-hidden gap-4">
                  {/* Message List */}
                  <div className="lg:w-1/3 border border-slate-200 bg-white rounded-xl shadow-sm overflow-y-auto max-h-[30rem]">
                    <ul className="divide-y divide-slate-100">
                      {[...Array(5)].map((_, idx) => (
                        <li
                          key={idx}
                          onClick={() =>
                            setSelectedMessage((prev) =>
                              prev?.id === idx
                                ? null
                                : {
                                    id: idx,
                                    sender: `user${idx + 1}@example.com`,
                                    subject: `Subject of the message ${
                                      idx + 1
                                    }`,
                                    content:
                                      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vel suscipit orci. Mauris sodales...",
                                  }
                            )
                          }
                          className={`px-4 py-4 hover:bg-slate-50 cursor-pointer transition relative ${
                            selectedMessage?.id === idx ? "bg-slate-100" : ""
                          }`}
                        >
                          <div
                            className={`absolute top-2 left-2 w-4 h-4 rounded-full border-2 z-10 ${
                              selectedMessage?.id === idx
                                ? "bg-slate-800 border-slate-800"
                                : "bg-white border-slate-300"
                            }`}
                          ></div>

                          <div className="pl-6">
                            <div className="flex justify-between mb-1">
                              <span className="font-semibold text-slate-800">
                                User {idx + 1}
                              </span>
                              <span className="text-xs text-slate-400">
                                2:45 PM
                              </span>
                            </div>
                            <div className="text-md text-slate-600">
                              Subject of the message {idx + 1}
                            </div>
                            <div className="text-xs text-slate-400 truncate">
                              Lorem ipsum dolor sit amet, consectetur...
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
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
                              From: {selectedMessage.sender}
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
