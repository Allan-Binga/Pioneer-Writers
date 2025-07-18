import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useState } from "react";
import { CalendarDays } from "lucide-react";

function News() {
  const [activeTab, setActiveTab] = useState("unread");

  const allNews = [
    {
      id: 1,
      title: "New Writer Dashboard Released",
      body: "We’ve launched a new interface to streamline your workflow!",
      date: "2025-07-01",
      isUnread: true,
    },
    {
      id: 2,
      title: "Payout Schedule Updated",
      body: "Payouts will now be processed every Friday instead of Monday.",
      date: "2025-06-28",
      isUnread: true,
    },
    {
      id: 3,
      title: "Maintenance Downtime",
      body: "The platform will be down for updates on July 10 from 1AM to 3AM UTC.",
      date: "2025-06-25",
      isUnread: false,
    },
    {
      id: 4,
      title: "New Features: SMS Notifications",
      body: "You can now receive real-time order updates via SMS.",
      date: "2025-06-20",
      isUnread: false,
    },
  ];

  const unreadNews = allNews.filter((item) => item.isUnread);

  const displayedNews = activeTab === "unread" ? unreadNews : allNews;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-slate-100">
      <Navbar />

      <main className="flex-1 transition-all duration-300 pt-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-8 mt-10">
            News & Updates
          </h1>

          {/* Tabs */}
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab("unread")}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                activeTab === "unread"
                  ? "bg-slate-600 text-white"
                  : "bg-white text-slate-600 border border-slate-300"
              }`}
            >
              Unread News
            </button>
            <button
              onClick={() => setActiveTab("all")}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                activeTab === "all"
                  ? "bg-slate-600 text-white"
                  : "bg-white text-slate-600 border border-slate-300"
              }`}
            >
              All News
            </button>
          </div>

          {/* News Cards */}
          <div className="space-y-4">
            {displayedNews.length === 0 ? (
              <div className="text-gray-600 text-center py-16">
                No news in this section.
              </div>
            ) : (
              displayedNews.map((news) => (
                <div
                  key={news.id}
                  className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition"
                >
                  <div className="flex justify-between items-start">
                    <h2 className="text-lg font-semibold text-slate-800">
                      {news.title}
                    </h2>
                    {news.isUnread && (
                      <span className="bg-orange-100 text-orange-600 text-xs px-2 py-1 rounded-full font-medium">
                        New
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-700 mt-2">{news.body}</p>
                  <div className="flex items-center gap-1 mt-3 text-xs text-gray-500">
                    <CalendarDays className="w-4 h-4" />
                    <span>{news.date}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default News;
