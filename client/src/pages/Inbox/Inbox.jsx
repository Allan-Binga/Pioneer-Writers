import {
  Mail,
  Send,
  SquarePen,
  Pencil,
  Trash2,
  Star,
  Archive,
  Search,
} from "lucide-react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import { useState } from "react";

function Inbox() {
  const [selectedMessage, setSelectedMessage] = useState(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50">
      <Navbar />
      <Sidebar />
      <main className="flex-1 pt-16 ml-64">
        <div className="container mx-auto px-4 py-8">
          {/* Inbox Wrapper Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            {/* Main Layout */}
            <div className="flex">
              {/* Folder Sidebar */}
              <aside className="w-64 pr-6 border-r border-slate-100 pt-10">
                <div className="space-y-3 text-lg">
                  {[
                    { icon: Mail, label: "Inbox" },
                    { icon: Star, label: "Starred" },
                    { icon: Send, label: "Sent" },
                    { icon: Archive, label: "Archived" },
                    { icon: Trash2, label: "Trash", danger: true },
                  ].map(({ icon: Icon, label, danger }) => (
                    <div
                      key={label}
                      className={`flex items-center cursor-pointer transition ${
                        danger
                          ? "text-slate-700 hover:text-red-600"
                          : "text-slate-700 hover:text-slate-900"
                      }`}
                    >
                      <Icon className="w-5 h-5 mr-3" />
                      {label}
                    </div>
                  ))}
                </div>
              </aside>

              {/* Main Content */}
              <section className="flex-1 pl-6 flex flex-col">
                {/* Toolbar */}
                <div className="flex items-center justify-between space-x-4 mb-6">
                  <select className="border border-slate-300 text-slate-700 rounded-lg px-3 py-2 text-md bg-white focus:outline-none focus:ring-2 focus:ring-slate-300">
                    <option value="inbox">Inbox</option>
                    <option value="sent">Sent</option>
                    <option value="unread">Unread</option>
                    <option value="archived">Archived</option>
                    <option value="trash">Trash</option>
                  </select>

                  <div className="flex items-center border border-slate-300 rounded-lg px-3 py-2 bg-white w-full max-w-md">
                    <Search className="w-4 h-4 text-slate-500 mr-2" />
                    <input
                      type="text"
                      placeholder="Search messages..."
                      className="w-full outline-none text-md text-slate-700 bg-transparent placeholder-slate-400"
                    />
                  </div>

                  <button className="flex items-center px-4 py-2 bg-slate-800 text-white rounded-lg text-md hover:bg-slate-700 transition">
                    <SquarePen className="w-4 h-4 mr-2" />
                    Compose Message
                  </button>
                </div>

                {/* Content Area */}
                <div className="flex flex-1 overflow-hidden">
                  {/* Message List */}
                  <div className="w-1/3 border-r border-slate-100 overflow-y-auto bg-white rounded-lg">
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
                          {/* Stylish radio indicator */}
                          <div
                            className={`absolute top-2 left-2 w-4 h-4 rounded-full border-2 z-10 ${
                              selectedMessage?.id === idx
                                ? "bg-slate-800 border-slate-800"
                                : "bg-white border-slate-300"
                            }`}
                          ></div>

                          {/* Message Content */}
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

                  {/* Message Viewer / Composer */}
                  <div className="flex-1 px-6 bg-slate-50 overflow-y-auto">
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
                      <div className="flex flex-col items-center justify-center h-full space-y-4 text-center text-slate-400">
                        <Mail className="w-14 h-14 text-slate-300" />{" "}
                        {/* 56px size */}
                        <p className="text-md italic">
                          No messages selected
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Inbox;
