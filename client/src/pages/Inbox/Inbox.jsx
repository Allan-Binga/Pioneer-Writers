import {
  Mail,
  Send,
  Pencil,
  Trash2,
  Star,
  Archive,
  Search,
} from "lucide-react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";

function Inbox() {
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
              <aside className="w-64 pr-6 border-r border-slate-100">
                <button className="w-full flex items-center justify-center bg-slate-800 text-white px-4 py-2 rounded-lg hover:bg-slate-700 transition mb-6">
                  <Pencil className="w-4 h-4 mr-2" />
                  Compose
                </button>

                <div className="space-y-3 text-sm">
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
                  <select className="border border-slate-300 text-slate-700 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-slate-300">
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
                      className="w-full outline-none text-sm text-slate-700 bg-transparent placeholder-slate-400"
                    />
                  </div>

                  <button className="flex items-center px-4 py-2 bg-slate-800 text-white rounded-lg text-sm hover:bg-slate-700 transition">
                    <Pencil className="w-4 h-4 mr-2" />
                    Compose Message
                  </button>
                </div>

                {/* Content Area */}
                <div className="flex flex-1 overflow-hidden">
                  {/* Message List */}
                  <div className="w-1/3 border-r border-slate-100 overflow-y-auto bg-white rounded-lg">
                    <ul className="divide-y divide-slate-100">
                      {[...Array(10)].map((_, idx) => (
                        <li
                          key={idx}
                          className="px-4 py-4 hover:bg-slate-50 cursor-pointer transition"
                        >
                          <div className="flex justify-between mb-1">
                            <span className="font-semibold text-slate-800">
                              User {idx + 1}
                            </span>
                            <span className="text-xs text-slate-400">
                              2:45 PM
                            </span>
                          </div>
                          <div className="text-sm text-slate-600">
                            Subject of the message {idx + 1}
                          </div>
                          <div className="text-xs text-slate-400 truncate">
                            Lorem ipsum dolor sit amet, consectetur...
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Message Viewer / Composer */}
                  <div className="flex-1 px-6 bg-slate-50 overflow-y-auto">
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100 space-y-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h2 className="text-lg font-semibold text-slate-800">
                            Message Subject Here
                          </h2>
                          <p className="text-sm text-slate-500">
                            From: user@example.com
                          </p>
                        </div>
                        <button className="text-slate-400 hover:text-red-500">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                      <div className="text-sm text-slate-700 leading-relaxed">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        Donec vel suscipit orci. Mauris sodales, odio ac lacinia
                        faucibus...
                      </div>
                      <div className="border-t border-slate-100 pt-4">
                        <textarea
                          placeholder="Write a reply..."
                          className="w-full border border-slate-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-slate-300 text-sm text-slate-700 resize-none"
                          rows="5"
                        ></textarea>
                        <div className="mt-3 flex justify-end">
                          <button className="bg-slate-800 text-white px-4 py-2 rounded-lg hover:bg-slate-700 text-sm flex items-center">
                            <Send className="w-4 h-4 mr-2" />
                            Send
                          </button>
                        </div>
                      </div>
                    </div>
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
