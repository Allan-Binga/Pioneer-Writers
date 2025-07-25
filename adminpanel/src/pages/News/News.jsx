import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { endpoint } from "../../server";
import axios from "axios";
import { useState, useEffect } from "react";
import { notify } from "../../utils/toast";
import { LoaderCircle, FileText } from "lucide-react";
import UserImage from "../../assets/user.png";
import { useNavigate } from "react-router-dom";

function News() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${endpoint}/news/news`, {
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

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Navbar />
      <main className="flex-1 pt-24 px-4 sm:px-6 lg:px-8"></main>
      <Footer />
    </div>
  );
}

export default News;
