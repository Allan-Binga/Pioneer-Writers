import { useState, useEffect } from "react";
import axios from "axios";
import { X, FileText, Trash2, Eye } from "lucide-react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { endpoint } from "../../server";
import { notify } from "../../utils/toast";

// PostNewsModal Component
function PostNewsModal({ onClose }) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!title || !body) {
      setError("Title and content are required");
      notify.error("Title and content are required");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(
        `${endpoint}/news/post-news`,
        { title, body },
        { withCredentials: true }
      );
      notify.success(res.data.message);
      onClose(res.data.news); // Pass new news item back to parent
    } catch (err) {
      const errorMessage = err.response?.data?.error || "Failed to post news";
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
          onClick={() => onClose(null)}
          className="absolute top-4 right-4 text-slate-500 hover:text-red-500 cursor-pointer"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="p-6 space-y-4">
          <h2 className="text-2xl font-semibold text-slate-800 flex items-center">
            <FileText className="w-6 h-6 mr-2" />
            Post News
          </h2>

          {error && <div className="text-red-500 text-sm">{error}</div>}

          <div>
            <label className="block text-md font-medium text-slate-700">
              Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter news title"
              className="w-full border border-slate-300 rounded-lg px-3 py-2 mt-1 focus:outline-none focus:border-gray-200 focus:ring-1 focus:ring-gray-200 transition"
            />
          </div>

          <div>
            <label className="block text-md font-medium text-slate-700">
              Content *
            </label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Type your news content..."
              rows={5}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 mt-1 resize-none focus:outline-none focus:border-gray-200 focus:ring-1 focus:ring-gray-200"
            />
          </div>

          <div className="flex justify-end space-x-2 mt-4">
            <button
              onClick={() => onClose(null)}
              className="px-4 py-2 border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
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
                  Posting...
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4 mr-2" />
                  Post
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// News Component
function News() {
  const [news, setNews] = useState([]);
  const [selectedNews, setSelectedNews] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);

  // Fetch News
  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${endpoint}/news/fetch-news`, {
          withCredentials: true,
        });
        setNews(response.data);
      } catch (error) {
        notify.error("Failed to fetch news");
        console.error("Error fetching news:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  // Handle news deletion
  const handleDeleteNews = async (newsId) => {
    try {
      await axios.delete(`${endpoint}/news/delete-news/${newsId}`, {
        withCredentials: true,
      });
      notify.success("News deleted successfully!");
      setNews(news.filter((n) => n.news_id !== newsId));
      if (selectedNews?.news_id === newsId) {
        setSelectedNews(null);
      }
    } catch (error) {
      notify.error("Failed to delete news.");
    }
  };

  // Handle modal close and add new news
  const handleModalClose = (newNews) => {
    setIsPostModalOpen(false);
    if (newNews) {
      setNews((prev) => [newNews, ...prev]);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50">
      <Navbar />
      <main className="flex-1 pt-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-semibold text-slate-800 mb-6 mt-8 flex items-center">
            News Management
          </h1>
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <p className="text-md text-slate-600 mb-6 text-center">
              Share updates and announcements
            </p>
            <div className="flex justify-center">
              <button
                onClick={() => setIsPostModalOpen(true)}
                className="flex flex-col items-center p-4 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 shadow-sm transition hover:shadow-md cursor-pointer"
              >
                <FileText className="w-8 h-8 text-slate-600 mb-2" />
                <h3 className="text-lg font-semibold text-slate-800">
                  Post News
                </h3>
                <p className="text-sm text-slate-500 text-center">
                  Create a new news post for all users
                </p>
              </button>
            </div>
          </div>

          {/* Recent News Section */}
          <div className="mt-10">
            <h2 className="text-3xl font-semibold text-slate-800 mb-6 flex items-center">
              Recent News
            </h2>
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
                  <span className="ml-2 text-slate-600">Loading news...</span>
                </div>
              ) : news.length === 0 ? (
                <p className="text-slate-500 text-center py-8">
                  No news found.
                </p>
              ) : (
                <div className="space-y-4">
                  {news.map((n) => (
                    <div
                      key={n.news_id}
                      className={`flex items-start p-4 rounded-lg border transition-all duration-200 ${
                        selectedNews?.news_id === n.news_id
                          ? "bg-amber-50 border-amber-200 shadow-md"
                          : "bg-white border-slate-200 hover:bg-slate-50 hover:shadow"
                      } cursor-pointer`}
                      onClick={() => setSelectedNews(n)}
                    >
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-semibold text-slate-800">
                            {n.title}
                          </span>
                          <span className="text-xs text-slate-500">
                            {new Date(n.date).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-sm text-slate-500 line-clamp-2">
                          {n.body}
                        </p>
                      </div>
                      <div className="ml-4 flex flex-col space-y-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedNews(n);
                          }}
                          className="text-slate-600 hover:text-amber-600"
                          title="View News"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteNews(n.news_id);
                          }}
                          className="text-slate-600 hover:text-red-600"
                          title="Delete News"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {selectedNews && (
              <div className="mt-6 bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-slate-800">
                    {selectedNews.title}
                  </h3>
                  <button
                    onClick={() => setSelectedNews(null)}
                    className="text-slate-500 hover:text-red-500"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-slate-600">
                    <strong>Date:</strong>{" "}
                    {new Date(selectedNews.date).toLocaleString()}
                  </p>
                  <div className="border-t border-slate-200 pt-4 mt-4">
                    <p className="text-sm text-slate-700 whitespace-pre-wrap">
                      {selectedNews.body}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {isPostModalOpen && <PostNewsModal onClose={handleModalClose} />}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default News;
