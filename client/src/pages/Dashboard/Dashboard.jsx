import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import {
  CheckCircle,
  LoaderCircle,
  FileText,
  Ban,
  AlertTriangle,
  FileClock,
  FileEdit,
  DollarSign,
  Inbox,
} from "lucide-react";
import { useState, useEffect } from "react";

const dashboardItems = [
  {
    label: "Completed Orders",
    icon: CheckCircle,
    count: 132,
    color: "bg-emerald-100 text-emerald-600",
  },
  {
    label: "Orders In Progress",
    icon: LoaderCircle,
    count: 45,
    color: "bg-blue-100 text-blue-600",
  },
  {
    label: "All Orders",
    icon: FileText,
    count: 210,
    color: "bg-slate-100 text-slate-600",
  },
  {
    label: "Disputed Orders",
    icon: AlertTriangle,
    count: 6,
    color: "bg-red-100 text-red-600",
  },
  {
    label: "Unconfirmed Orders",
    icon: FileClock,
    count: 12,
    color: "bg-yellow-100 text-yellow-600",
  },
  {
    label: "Draft Orders",
    icon: FileEdit,
    count: 9,
    color: "bg-indigo-100 text-indigo-600",
  },
  {
    label: "Paid Orders",
    icon: DollarSign,
    count: 128,
    color: "bg-green-100 text-green-600",
  },
  {
    label: "Canceled Orders",
    icon: Ban,
    count: 14,
    color: "bg-rose-100 text-rose-600",
  },
  {
    label: "Submitted Orders",
    icon: Inbox,
    count: 82,
    color: "bg-sky-100 text-sky-600",
  },
];

function Dashboard() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Sync main content margin with sidebar collapse state
  useEffect(() => {
    const handleResize = () => {
      // Collapse sidebar for tablet and smaller screens (768px and below)
      if (window.innerWidth <= 768) {
        setIsSidebarCollapsed(true);
      } else {
        setIsSidebarCollapsed(false);
      }
    };

    // Run on mount and when window is resized
    handleResize();
    window.addEventListener("resize", handleResize);

    // Cleanup listener on unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Navbar />
      <Sidebar />
      <main
        className={`pt-20 px-8 transition-all duration-300 ${
          isSidebarCollapsed ? "ml-20" : "ml-72"
        } md:ml-72`}
      >
        <h1 className="text-3xl font-semibold text-slate-800 mb-8">
          Dashboard
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {dashboardItems.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition-all border border-slate-100 flex items-center space-x-5 group"
              >
                <div
                  className={`p-4 rounded-full ${item.color} transition-all duration-300`}
                >
                  <Icon className="w-8 h-8" />
                </div>
                <div>
                  <p className="text-xl font-semibold text-slate-800 group-hover:text-slate-900">
                    {item.label}
                  </p>
                  <p className="text-3xl font-bold text-slate-700">
                    {item.count}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
