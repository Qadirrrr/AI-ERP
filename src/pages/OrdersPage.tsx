import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { Order } from "../data";
import { Plus, Search, Filter, AlertTriangle, FileText, CheckCircle2, RotateCw, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export const OrdersPage: React.FC = () => {
  const { orders, setOrders } = useApp();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | "Fulfilled" | "Processing" | "Delayed">("All");
  const [showAddModal, setShowAddModal] = useState(false);

  // New Order Form State
  const [customer, setCustomer] = useState("");
  const [items, setItems] = useState("");
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState<"Fulfilled" | "Processing" | "Delayed">("Processing");

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.items.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customer.trim() || !items.trim() || !amount.trim()) {
      alert("Please fill in all fields.");
      return;
    }

    const newOrder: Order = {
      id: `#ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      customer: customer.trim(),
      items: items.trim(),
      amount: parseFloat(amount) || 0,
      status: status,
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    };

    setOrders((prev) => [newOrder, ...prev]);
    setShowAddModal(false);

    // Reset Form
    setCustomer("");
    setItems("");
    setAmount("");
    setStatus("Processing");
  };

  const handleUpdateStatus = (orderId: string, nextStatus: "Fulfilled" | "Processing" | "Delayed") => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: nextStatus } : o))
    );
  };

  // Metrics
  const totalOrders = orders.length;
  const processingCount = orders.filter((o) => o.status === "Processing").length;
  const delayedCount = orders.filter((o) => o.status === "Delayed").length;
  const fulfilledCount = orders.filter((o) => o.status === "Fulfilled").length;
  const totalSales = orders.reduce((sum, o) => sum + o.amount, 0);

  return (
    <div className="space-y-8 text-left">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white">Order Management</h2>
          <p className="text-sm text-[#64748B]">
            Process shipments, update delivery statuses, and create new client invoices.
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#4F6FFF] hover:bg-[#5B7DFF] text-white rounded-xl text-xs font-bold shadow-lg hover:shadow-xl transition-all"
        >
          <Plus size={16} />
          <span>Create New Order</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 rounded-[20px] border border-[#1F2A44] bg-[#141C2F] shadow-lg">
          <span className="text-xs font-medium text-[#64748B]">Total Volume</span>
          <h4 className="text-2xl font-extrabold text-white mt-2">${totalSales.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h4>
          <span className="text-[10px] text-emerald-500 font-mono mt-1 block">✓ All values synced with backend</span>
        </div>
        <div className="p-6 rounded-[20px] border border-[#1F2A44] bg-[#141C2F] shadow-lg">
          <span className="text-xs font-medium text-[#64748B]">Processing Orders</span>
          <h4 className="text-2xl font-extrabold text-amber-500 mt-2">{processingCount}</h4>
          <span className="text-[10px] text-[#64748B] font-mono mt-1 block">Awaiting package fulfillment</span>
        </div>
        <div className="p-6 rounded-[20px] border border-[#1F2A44] bg-[#141C2F] shadow-lg">
          <span className="text-xs font-medium text-[#64748B]">Delayed Alerts</span>
          <h4 className="text-2xl font-extrabold text-red-500 mt-2">{delayedCount}</h4>
          <span className="text-[10px] text-red-400 font-mono mt-1 block">⚠ Transit delays detected</span>
        </div>
        <div className="p-6 rounded-[20px] border border-[#1F2A44] bg-[#141C2F] shadow-lg">
          <span className="text-xs font-medium text-[#64748B]">Fulfilled Contracts</span>
          <h4 className="text-2xl font-extrabold text-emerald-500 mt-2">{fulfilledCount}</h4>
          <span className="text-[10px] text-[#64748B] font-mono mt-1 block">Successfully completed</span>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="border border-[#1F2A44] bg-[#141C2F] rounded-[24px] p-6 shadow-[0_10px_40px_rgba(0,0,0,0.3)] flex flex-col gap-6">
        {/* Controls */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Search bar */}
          <div className="relative w-full md:max-w-sm">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748B]" />
            <input
              type="text"
              placeholder="Search by Order ID, customer, items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#0D1325] border border-[#1F2A44] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:border-[#4F6FFF] transition-colors"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            {(["All", "Processing", "Delayed", "Fulfilled"] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setStatusFilter(filter)}
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
                  statusFilter === filter
                    ? "bg-[#4F6FFF]/20 text-[#4F6FFF] border border-[#4F6FFF]/30"
                    : "bg-[#0D1325] text-[#94A3B8] border border-[#1F2A44] hover:text-[#F8FAFC]"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Table representation */}
        <div className="w-full overflow-x-auto rounded-[16px] border border-[#1F2A44] bg-[#0D1325]/40">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#1F2A44] bg-[#0D1325] text-[10px] font-mono tracking-wider text-[#64748B] uppercase">
                <th className="py-4 px-5">ID</th>
                <th className="py-4 px-5">Customer</th>
                <th className="py-4 px-5">Items / Context</th>
                <th className="py-4 px-5">Amount</th>
                <th className="py-4 px-5">Date</th>
                <th className="py-4 px-5">Status</th>
                <th className="py-4 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-xs text-[#64748B] font-mono">
                    No orders matching the search or status query.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((o) => (
                  <tr key={o.id} className="border-b border-[#1F2A44]/50 hover:bg-[#141C2F]/50 transition-colors">
                    <td className="py-4 px-5 font-mono text-xs text-[#4F6FFF] font-bold">{o.id}</td>
                    <td className="py-4 px-5 font-medium text-xs text-[#F8FAFC]">{o.customer}</td>
                    <td className="py-4 px-5 text-xs text-[#94A3B8]">{o.items}</td>
                    <td className="py-4 px-5 font-mono text-xs text-[#F8FAFC] font-semibold">
                      ${o.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-4 px-5 text-xs text-[#64748B] font-mono">{o.date}</td>
                    <td className="py-4 px-5">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-semibold font-mono ${
                          o.status === "Fulfilled"
                            ? "bg-emerald-950 text-emerald-400 border border-emerald-900/30"
                            : o.status === "Delayed"
                            ? "bg-red-950 text-red-400 border border-red-900/30"
                            : "bg-amber-950 text-amber-400 border border-amber-900/30"
                        }`}
                      >
                        {o.status === "Fulfilled" ? (
                          <CheckCircle2 size={10} />
                        ) : o.status === "Delayed" ? (
                          <AlertTriangle size={10} />
                        ) : (
                          <RotateCw size={10} className="animate-spin" />
                        )}
                        {o.status}
                      </span>
                    </td>
                    <td className="py-4 px-5 text-right">
                      <div className="flex gap-1.5 justify-end">
                        {o.status !== "Fulfilled" && (
                          <button
                            onClick={() => handleUpdateStatus(o.id, "Fulfilled")}
                            className="text-[10px] px-2 py-1 rounded bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 font-semibold transition-colors"
                            title="Complete order"
                          >
                            Deliver
                          </button>
                        )}
                        {o.status !== "Delayed" && o.status !== "Fulfilled" && (
                          <button
                            onClick={() => handleUpdateStatus(o.id, "Delayed")}
                            className="text-[10px] px-2 py-1 rounded bg-red-500/10 text-red-400 hover:bg-red-500/20 font-semibold transition-colors"
                            title="Mark delayed"
                          >
                            Delay
                          </button>
                        )}
                        {o.status !== "Processing" && (
                          <button
                            onClick={() => handleUpdateStatus(o.id, "Processing")}
                            className="text-[10px] px-2 py-1 rounded bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 font-semibold transition-colors"
                            title="Mark processing"
                          >
                            Process
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Order Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddModal(false)}
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
                  <h3 className="text-lg font-bold text-white">Create Client Order</h3>
                  <p className="text-xs text-[#64748B]">Fill in client invoice information.</p>
                </div>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-1 rounded bg-[#0D1325] text-[#64748B] hover:text-[#94A3B8]"
                >
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleCreateOrder} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-mono tracking-widest text-[#64748B] uppercase mb-1.5">
                    Customer Name / Account
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="E.g., Northwind Traders"
                    value={customer}
                    onChange={(e) => setCustomer(e.target.value)}
                    className="w-full bg-[#0D1325] border border-[#1F2A44] rounded-lg px-3 py-2 text-xs text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:border-[#4F6FFF] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono tracking-widest text-[#64748B] uppercase mb-1.5">
                    Order Items Summary
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="E.g., 20x Chilled Oat Base 1L"
                    value={items}
                    onChange={(e) => setItems(e.target.value)}
                    className="w-full bg-[#0D1325] border border-[#1F2A44] rounded-lg px-3 py-2 text-xs text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:border-[#4F6FFF] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono tracking-widest text-[#64748B] uppercase mb-1.5">
                    Total Invoiced Amount ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="128.50"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full bg-[#0D1325] border border-[#1F2A44] rounded-lg px-3 py-2 text-xs text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:border-[#4F6FFF] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono tracking-widest text-[#64748B] uppercase mb-1.5">
                    Initial Fulfillment Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full bg-[#0D1325] border border-[#1F2A44] rounded-lg px-3 py-2 text-xs text-[#F8FAFC] focus:outline-none focus:border-[#4F6FFF] transition-all"
                  >
                    <option value="Processing">Processing</option>
                    <option value="Delayed">Delayed</option>
                    <option value="Fulfilled">Fulfilled</option>
                  </select>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 py-2 px-4 rounded-lg bg-[#0D1325] hover:bg-[#111827] text-[#94A3B8] border border-[#1F2A44] text-xs font-semibold transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 px-4 rounded-lg bg-[#4F6FFF] hover:bg-[#5B7DFF] text-white text-xs font-bold transition-all"
                  >
                    Submit Order
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
