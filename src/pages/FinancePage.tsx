import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { Plus, Search, Coins, TrendingUp, DollarSign, Wallet, FileText, ArrowUpRight, ArrowDownRight, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface LedgerEntry {
  id: string;
  category: string;
  description: string;
  type: "Income" | "Expense";
  amount: number;
  date: string;
}

const initialLedger: LedgerEntry[] = [
  { id: "TX-9021", category: "Client Invoice", description: "Fulfillment delivery order ORD-8839", type: "Income", amount: 14500.0, date: "Jul 7, 2026" },
  { id: "TX-9022", category: "Warehouse lease", description: "Central depot lease payment", type: "Expense", amount: 3200.0, date: "Jul 5, 2026" },
  { id: "TX-9023", category: "Logistics provider", description: "Ocean freight customs & cargo duties", type: "Expense", amount: 5400.0, date: "Jul 4, 2026" },
  { id: "TX-9024", category: "Client Invoice", description: "Fulfillment delivery order ORD-8720", type: "Income", amount: 8900.0, date: "Jul 2, 2026" },
  { id: "TX-9025", category: "Cloud services", description: "Monthly server hosting fees", type: "Expense", amount: 450.0, date: "Jun 30, 2026" },
];

const chartData = [
  { name: "Jan", Revenue: 34000, Expenses: 18000 },
  { name: "Feb", Revenue: 41000, Expenses: 22000 },
  { name: "Mar", Revenue: 39000, Expenses: 21000 },
  { name: "Apr", Revenue: 47000, Expenses: 25000 },
  { name: "May", Revenue: 55000, Expenses: 28000 },
  { name: "Jun", Revenue: 62000, Expenses: 31000 },
  { name: "Jul", Revenue: 68000, Expenses: 34000 },
];

export const FinancePage: React.FC = () => {
  const { orders } = useApp();
  const [ledger, setLedger] = useState<LedgerEntry[]>(initialLedger);
  const [showLogModal, setShowLogModal] = useState(false);

  // Form states
  const [category, setCategory] = useState("Logistics");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<"Income" | "Expense">("Expense");
  const [amount, setAmount] = useState("");

  const handleLogTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || !amount.trim()) {
      alert("Please fill in description and amount.");
      return;
    }

    const newTx: LedgerEntry = {
      id: `TX-${Math.floor(9000 + Math.random() * 1000)}`,
      category,
      description: description.trim(),
      type,
      amount: parseFloat(amount) || 0,
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    };

    setLedger((prev) => [newTx, ...prev]);
    setShowLogModal(false);

    // Reset Form
    setDescription("");
    setAmount("");
  };

  // Math calculated states
  const baseIncome = ledger.filter((l) => l.type === "Income").reduce((sum, l) => sum + l.amount, 0);
  const totalExpenses = ledger.filter((l) => l.type === "Expense").reduce((sum, l) => sum + l.amount, 0);
  
  // Dynamic order integration: count all fulfilled orders as Income!
  const orderIncome = orders.filter(o => o.status === "Fulfilled").reduce((sum, o) => sum + o.amount, 0);
  const totalIncome = baseIncome + orderIncome;
  const netProfit = totalIncome - totalExpenses;

  return (
    <div className="space-y-8 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white">Financial Ledger & Profit</h2>
          <p className="text-sm text-[#64748B]">
            Review total sales, track operational expenses, and audit cash flow logs.
          </p>
        </div>
        <button
          onClick={() => setShowLogModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#4F6FFF] hover:bg-[#5B7DFF] text-white rounded-xl text-xs font-bold shadow-lg hover:shadow-xl transition-all"
        >
          <Plus size={16} />
          <span>Log Ledger Entry</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 rounded-[20px] border border-[#1F2A44] bg-[#141C2F] shadow-lg">
          <div className="flex justify-between items-start mb-3">
            <span className="text-xs font-medium text-[#64748B]">Cash Balance</span>
            <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
              <Wallet size={14} />
            </span>
          </div>
          <h4 className="text-2xl font-extrabold text-white mt-2">
            ${(totalIncome + 45000 - totalExpenses).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </h4>
          <span className="text-[10px] text-emerald-500 font-mono mt-1 block">✓ Safe cash reserve</span>
        </div>

        <div className="p-6 rounded-[20px] border border-[#1F2A44] bg-[#141C2F] shadow-lg">
          <div className="flex justify-between items-start mb-3">
            <span className="text-xs font-medium text-[#64748B]">Total Inflow (Revenue)</span>
            <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400">
              <ArrowUpRight size={14} />
            </span>
          </div>
          <h4 className="text-2xl font-extrabold text-[#4F6FFF] mt-2">
            ${totalIncome.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </h4>
          <span className="text-[10px] text-[#64748B] font-mono mt-1 block">Includes ${orderIncome.toLocaleString("en-US")} from orders</span>
        </div>

        <div className="p-6 rounded-[20px] border border-[#1F2A44] bg-[#141C2F] shadow-lg">
          <div className="flex justify-between items-start mb-3">
            <span className="text-xs font-medium text-[#64748B]">Total Expenses</span>
            <span className="p-1.5 rounded-lg bg-red-500/10 text-red-400">
              <ArrowDownRight size={14} />
            </span>
          </div>
          <h4 className="text-2xl font-extrabold text-red-400 mt-2">
            ${totalExpenses.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </h4>
          <span className="text-[10px] text-red-400/85 font-mono mt-1 block">Outflow logged</span>
        </div>

        <div className="p-6 rounded-[20px] border border-[#1F2A44] bg-[#141C2F] shadow-lg">
          <div className="flex justify-between items-start mb-3">
            <span className="text-xs font-medium text-[#64748B]">Net Profit Ledger</span>
            <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
              <Coins size={14} />
            </span>
          </div>
          <h4 className={`text-2xl font-extrabold mt-2 ${netProfit >= 0 ? "text-emerald-400" : "text-red-400"}`}>
            ${netProfit.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </h4>
          <span className="text-[10px] text-[#64748B] font-mono mt-1 block">Net margin</span>
        </div>
      </div>

      {/* Main Grid: Visual Chart & Ledger Table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Cash Flow Chart */}
        <div className="lg:col-span-7 border border-[#1F2A44] bg-[#141C2F] rounded-[24px] p-6 shadow-[0_10px_40px_rgba(0,0,0,0.3)] flex flex-col justify-between">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-sm font-semibold text-[#F8FAFC]">Cash Flow Performance</h3>
              <span className="text-[10px] text-[#64748B] mt-0.5">Month-by-month revenue vs expense comparison</span>
            </div>
            <div className="flex items-center gap-4 text-[10px] font-mono">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#4F6FFF]" />
                <span className="text-[#94A3B8]">Revenue</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                <span className="text-[#94A3B8]">Expenses</span>
              </div>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4F6FFF" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#4F6FFF" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorExp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1F2A44" opacity={0.3} />
                <XAxis dataKey="name" stroke="#64748B" fontSize={10} fontClassName="font-mono" />
                <YAxis stroke="#64748B" fontSize={10} fontClassName="font-mono" />
                <Tooltip
                  contentStyle={{ backgroundColor: "#0D1325", borderColor: "#1F2A44", borderRadius: "8px" }}
                  labelStyle={{ color: "#F8FAFC", fontSize: "11px", fontWeight: "bold" }}
                  itemStyle={{ fontSize: "11px" }}
                />
                <Area type="monotone" dataKey="Revenue" stroke="#4F6FFF" strokeWidth={2} fillOpacity={1} fill="url(#colorRev)" />
                <Area type="monotone" dataKey="Expenses" stroke="#ef4444" strokeWidth={2} fillOpacity={1} fill="url(#colorExp)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Expense Category Breakdown */}
        <div className="lg:col-span-5 border border-[#1F2A44] bg-[#141C2F] rounded-[24px] p-6 shadow-[0_10px_40px_rgba(0,0,0,0.3)] flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-semibold text-[#F8FAFC]">Financial Indicators</h3>
            <span className="text-[10px] text-[#64748B] mt-0.5">Automated operations budget audits</span>
          </div>

          <div className="space-y-4 my-6">
            <div>
              <div className="flex justify-between text-xs text-[#94A3B8] mb-1.5">
                <span>Fulfillment Cost Ratio</span>
                <span className="font-mono text-white">41.2%</span>
              </div>
              <div className="w-full bg-[#0D1325] h-1.5 rounded-full overflow-hidden">
                <div className="bg-[#4F6FFF] h-full rounded-full" style={{ width: "41.2%" }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs text-[#94A3B8] mb-1.5">
                <span>Customs & Port Duties Buffer</span>
                <span className="font-mono text-white">88% utilized</span>
              </div>
              <div className="w-full bg-[#0D1325] h-1.5 rounded-full overflow-hidden">
                <div className="bg-amber-500 h-full rounded-full" style={{ width: "88%" }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs text-[#94A3B8] mb-1.5">
                <span>Supplier Lead Time Cover Cost</span>
                <span className="font-mono text-white">12.8% savings</span>
              </div>
              <div className="w-full bg-[#0D1325] h-1.5 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: "12.8%" }} />
              </div>
            </div>
          </div>

          <div className="p-3 bg-[#0D1325] border border-[#1F2A44] rounded-xl text-[11px] text-[#94A3B8] leading-relaxed">
            🌿 <strong>Pro-Tip:</strong> High velocity beverages have 4x margin compared to standard dry box materials. Optimize West warehouse cold-chain space to maximize EBIT.
          </div>
        </div>
      </div>

      {/* Ledger Log Transactions Table */}
      <div className="border border-[#1F2A44] bg-[#141C2F] rounded-[24px] p-6 shadow-[0_10px_40px_rgba(0,0,0,0.3)]">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-sm font-semibold text-[#F8FAFC]">Auditable Inflow/Outflow ledger</h3>
            <span className="text-[10px] text-[#64748B] mt-0.5">Real-time ledger entries from all warehouses</span>
          </div>
        </div>

        <div className="w-full overflow-x-auto rounded-[16px] border border-[#1F2A44] bg-[#0D1325]/40">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#1F2A44] bg-[#0D1325] text-[10px] font-mono tracking-wider text-[#64748B] uppercase">
                <th className="py-4 px-5">Reference</th>
                <th className="py-4 px-5">Category</th>
                <th className="py-4 px-5">Description</th>
                <th className="py-4 px-5">Type</th>
                <th className="py-4 px-5">Ledger Date</th>
                <th className="py-4 px-5 text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {ledger.map((l) => (
                <tr key={l.id} className="border-b border-[#1F2A44]/50 hover:bg-[#141C2F]/50 transition-colors">
                  <td className="py-4 px-5 font-mono text-xs text-[#94A3B8]">{l.id}</td>
                  <td className="py-4 px-5">
                    <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-[#1F2A44] text-[#F8FAFC]">
                      {l.category}
                    </span>
                  </td>
                  <td className="py-4 px-5 text-xs text-[#F8FAFC]">{l.description}</td>
                  <td className="py-4 px-5">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-semibold font-mono ${
                        l.type === "Income"
                          ? "bg-emerald-950 text-emerald-400 border border-emerald-900/30"
                          : "bg-red-950 text-red-400 border border-red-900/30"
                      }`}
                    >
                      {l.type === "Income" ? "INFLOW" : "OUTFLOW"}
                    </span>
                  </td>
                  <td className="py-4 px-5 text-xs text-[#64748B] font-mono">{l.date}</td>
                  <td className={`py-4 px-5 text-right font-mono text-xs font-semibold ${l.type === "Income" ? "text-emerald-400" : "text-red-400"}`}>
                    {l.type === "Income" ? "+" : "-"}${l.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Log Transaction Modal */}
      <AnimatePresence>
        {showLogModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLogModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md bg-[#141C2F] border border-[#1F2A44] rounded-[24px] p-6 shadow-2xl text-left"
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-lg font-bold text-white">Log Ledger Transaction</h3>
                  <p className="text-xs text-[#64748B]">Commit double-entry financial record.</p>
                </div>
                <button
                  onClick={() => setShowLogModal(false)}
                  className="p-1 rounded bg-[#0D1325] text-[#64748B] hover:text-[#94A3B8]"
                >
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleLogTransaction} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-mono tracking-widest text-[#64748B] uppercase mb-1.5">
                    Category Group
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-[#0D1325] border border-[#1F2A44] rounded-lg px-3 py-2 text-xs text-[#F8FAFC] focus:outline-none focus:border-[#4F6FFF] transition-all"
                  >
                    <option value="Client Invoice">Client Invoice</option>
                    <option value="Logistics">Logistics Provider</option>
                    <option value="Warehouse lease">Warehouse Depot lease</option>
                    <option value="Cloud services">Cloud / IT servers</option>
                    <option value="Marketing">Growth / Promo spend</option>
                    <option value="Supplies">Fulfillment packaging</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-mono tracking-widest text-[#64748B] uppercase mb-1.5">
                    Description Context
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="E.g., Customs clearance agent fees Seattle depot"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-[#0D1325] border border-[#1F2A44] rounded-lg px-3 py-2 text-xs text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:border-[#4F6FFF] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono tracking-widest text-[#64748B] uppercase mb-1.5">
                    Transaction Type
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setType("Expense")}
                      className={`py-2 px-3 rounded-lg text-xs font-semibold border transition-all text-center ${
                        type === "Expense"
                          ? "bg-red-500/15 text-red-400 border-red-500/30 font-bold"
                          : "bg-[#0D1325] text-[#94A3B8] border-[#1F2A44]"
                      }`}
                    >
                      Expense (Outflow)
                    </button>
                    <button
                      type="button"
                      onClick={() => setType("Income")}
                      className={`py-2 px-3 rounded-lg text-xs font-semibold border transition-all text-center ${
                        type === "Income"
                          ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30 font-bold"
                          : "bg-[#0D1325] text-[#94A3B8] border-[#1F2A44]"
                      }`}
                    >
                      Income (Inflow)
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-mono tracking-widest text-[#64748B] uppercase mb-1.5">
                    Amount ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="1500.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full bg-[#0D1325] border border-[#1F2A44] rounded-lg px-3 py-2 text-xs text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:border-[#4F6FFF] transition-all"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowLogModal(false)}
                    className="flex-1 py-2 px-4 rounded-lg bg-[#0D1325] hover:bg-[#111827] text-[#94A3B8] border border-[#1F2A44] text-xs font-semibold transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 px-4 rounded-lg bg-[#4F6FFF] hover:bg-[#5B7DFF] text-white text-xs font-bold transition-all"
                  >
                    Commit Entry
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
