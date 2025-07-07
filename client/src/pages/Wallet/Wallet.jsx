import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import { useState } from "react";
import {
  Wallet2,
  PlusCircle,
  ArrowDownCircle,
  Banknote,
  CreditCard,
  Loader2,
} from "lucide-react";

function Wallet() {
  const [showSidebar, setShowSidebar] = useState(false);

  // Dummy wallet data
  const balance = 128.75;
  const recentTransactions = [
    {
      id: "TXN001",
      type: "Deposit",
      amount: 100,
      date: "2025-07-01",
      method: "Mpesa",
    },
    {
      id: "TXN002",
      type: "Withdrawal",
      amount: 50,
      date: "2025-07-03",
      method: "Bank Transfer",
    },
    {
      id: "TXN003",
      type: "Deposit",
      amount: 78.75,
      date: "2025-07-05",
      method: "PayPal",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Navbar />
      <Sidebar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />
      <div className="flex">
        {/* Main */}
        <main className="flex-1 transition-all duration-300 md:ml-64 pt-20 px-4">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold text-slate-800 mb-6">
              My Wallet
            </h1>

            {/* Balance Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <div>
                <h2 className="text-gray-600 text-sm">Current Balance</h2>
                <p className="text-3xl font-bold text-green-600 mt-1 flex items-center gap-2">
                  <Wallet2 className="w-6 h-6 text-sky-500" />$
                  {balance.toFixed(2)}
                </p>
              </div>

              <div className="flex gap-4">
                <button className="flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-xl transition">
                  <PlusCircle className="w-5 h-5" />
                  Deposit
                </button>
                <button className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl transition">
                  <ArrowDownCircle className="w-5 h-5" />
                  Withdraw
                </button>
              </div>
            </div>

            {/* Transactions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-xl font-semibold text-slate-700 mb-4">
                Recent Transactions
              </h3>

              {recentTransactions.length === 0 ? (
                <div className="text-gray-500 flex items-center gap-2">
                  <Loader2 className="animate-spin w-4 h-4" />
                  Loading transactions...
                </div>
              ) : (
                <div className="space-y-4">
                  {recentTransactions.map((txn) => (
                    <div
                      key={txn.id}
                      className="flex justify-between items-center border-b border-gray-100 pb-3"
                    >
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-800">
                          {txn.type}
                        </span>
                        <span className="text-xs text-gray-400">
                          {txn.date}
                        </span>
                      </div>
                      <span
                        className={`text-sm font-semibold ${
                          txn.type === "Deposit"
                            ? "text-green-600"
                            : "text-red-500"
                        }`}
                      >
                        {txn.type === "Deposit" ? "+" : "-"}$
                        {txn.amount.toFixed(2)}
                      </span>
                      <span className="flex items-center gap-1 text-sm text-gray-500">
                        {getPaymentIcon(txn.method)}
                        {txn.method}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

// Map method name to icon
function getPaymentIcon(method) {
  switch (method) {
    case "Mpesa":
      return <Banknote className="w-4 h-4 text-green-500" />;
    case "PayPal":
      return <CreditCard className="w-4 h-4 text-blue-600" />;
    case "Bank Transfer":
      return <Banknote className="w-4 h-4 text-gray-600" />;
    default:
      return <Wallet2 className="w-4 h-4 text-gray-500" />;
  }
}

export default Wallet;
