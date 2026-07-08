import React, { useState } from "react";
import { Plus, Search, Mail, Phone, Users, ShieldAlert, Star, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  ordersCount: number;
  totalSpend: number;
  status: "Active" | "Inactive" | "VIP";
  joinDate: string;
}

const initialCustomers: Customer[] = [
  { id: "CUST-3021", name: "Sarah Jenkins", email: "sarah@northwind.com", phone: "+1 (555) 019-2831", company: "Northwind Traders", ordersCount: 18, totalSpend: 24500.0, status: "VIP", joinDate: "Jan 12, 2025" },
  { id: "CUST-3022", name: "David Miller", email: "d.miller@packcorp.com", phone: "+1 (555) 014-9982", company: "PackCorp Industries", ordersCount: 12, totalSpend: 8900.5, status: "Active", joinDate: "Feb 28, 2025" },
  { id: "CUST-3023", name: "Elena Rostova", email: "elena@sealtech.io", phone: "+1 (555) 018-4491", company: "SealTech LLC", ordersCount: 5, totalSpend: 3120.0, status: "Active", joinDate: "May 15, 2025" },
  { id: "CUST-3024", name: "Marcus Brody", email: "marcus@eco-solutions.com", phone: "+1 (555) 011-7732", company: "EcoPack Solutions", ordersCount: 22, totalSpend: 31500.0, status: "VIP", joinDate: "Aug 02, 2024" },
  { id: "CUST-3025", name: "Amir Al-Hassan", email: "amir@meridianretail.com", phone: "+1 (555) 013-1120", company: "Meridian Retail Corp", ordersCount: 2, totalSpend: 420.0, status: "Inactive", joinDate: "Oct 22, 2025" },
];

export const CustomersPage: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | "Active" | "Inactive" | "VIP">("All");
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [status, setStatus] = useState<"Active" | "Inactive" | "VIP">("Active");

  const filteredCustomers = customers.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAddCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      alert("Name and email are required.");
      return;
    }

    const newCust: Customer = {
      id: `CUST-${Math.floor(3000 + Math.random() * 1000)}`,
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim() || "+1 (555) 010-0000",
      company: company.trim() || "Independent Retailer",
      ordersCount: 0,
      totalSpend: 0,
      status: status,
      joinDate: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    };

    setCustomers((prev) => [newCust, ...prev]);
    setShowAddModal(false);

    // Reset Form
    setName("");
    setEmail("");
    setPhone("");
    setCompany("");
    setStatus("Active");
  };

  const totalClients = customers.length;
  const vipCount = customers.filter(c => c.status === "VIP").length;
  const totalCRMValue = customers.reduce((sum, c) => sum + c.totalSpend, 0);

  return (
    <div className="space-y-8 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white">Customer Directory (CRM)</h2>
          <p className="text-sm text-[#64748B]">
            Manage client profiles, check account total spends, and track fulfillment satisfaction.
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#4F6FFF] hover:bg-[#5B7DFF] text-white rounded-xl text-xs font-bold shadow-lg hover:shadow-xl transition-all"
        >
          <Plus size={16} />
          <span>Add Client Profile</span>
        </button>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="p-6 rounded-[20px] border border-[#1F2A44] bg-[#141C2F] shadow-lg flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-[#64748B]">Active Clients</span>
            <h4 className="text-2xl font-extrabold text-white mt-2">{totalClients}</h4>
          </div>
          <div className="p-3 rounded-xl bg-[#4F6FFF]/10 text-[#4F6FFF]">
            <Users size={20} />
          </div>
        </div>

        <div className="p-6 rounded-[20px] border border-[#1F2A44] bg-[#141C2F] shadow-lg flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-[#64748B]">VIP Flagged Accounts</span>
            <h4 className="text-2xl font-extrabold text-amber-500 mt-2">{vipCount}</h4>
          </div>
          <div className="p-3 rounded-xl bg-amber-500/10 text-amber-500">
            <Star size={20} />
          </div>
        </div>

        <div className="p-6 rounded-[20px] border border-[#1F2A44] bg-[#141C2F] shadow-lg flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-[#64748B]">Total Contract Value</span>
            <h4 className="text-2xl font-extrabold text-emerald-400 mt-2">${totalCRMValue.toLocaleString("en-US", { minimumFractionDigits: 2 })}</h4>
          </div>
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400">
            <Star size={20} className="fill-emerald-400/20" />
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="border border-[#1F2A44] bg-[#141C2F] rounded-[24px] p-6 shadow-[0_10px_40px_rgba(0,0,0,0.3)] flex flex-col gap-6">
        {/* Filter Controls */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Search bar */}
          <div className="relative w-full md:max-w-sm">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748B]" />
            <input
              type="text"
              placeholder="Search by client name, email, company..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#0D1325] border border-[#1F2A44] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:border-[#4F6FFF] transition-colors"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            {(["All", "Active", "Inactive", "VIP"] as const).map((filter) => (
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

        {/* Directory List Table */}
        <div className="w-full overflow-x-auto rounded-[16px] border border-[#1F2A44] bg-[#0D1325]/40">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#1F2A44] bg-[#0D1325] text-[10px] font-mono tracking-wider text-[#64748B] uppercase">
                <th className="py-4 px-5">Client ID</th>
                <th className="py-4 px-5">Name / Company</th>
                <th className="py-4 px-5">Contact Info</th>
                <th className="py-4 px-5 font-mono">Fulfillments</th>
                <th className="py-4 px-5 font-mono">Total Spend</th>
                <th className="py-4 px-5">Status</th>
                <th className="py-4 px-5 text-right">Join Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-xs text-[#64748B] font-mono">
                    No customers match current query terms.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((c) => (
                  <tr key={c.id} className="border-b border-[#1F2A44]/50 hover:bg-[#141C2F]/50 transition-colors">
                    <td className="py-4 px-5 font-mono text-xs text-[#94A3B8]">{c.id}</td>
                    <td className="py-4 px-5">
                      <div className="flex flex-col text-left">
                        <span className="text-xs font-semibold text-[#F8FAFC]">{c.name}</span>
                        <span className="text-[10px] text-[#64748B] font-mono mt-0.5">{c.company}</span>
                      </div>
                    </td>
                    <td className="py-4 px-5 text-xs">
                      <div className="flex flex-col text-left text-[#94A3B8] gap-1">
                        <span className="flex items-center gap-1">
                          <Mail size={11} className="text-[#64748B]" />
                          {c.email}
                        </span>
                        <span className="flex items-center gap-1 font-mono text-[10px]">
                          <Phone size={11} className="text-[#64748B]" />
                          {c.phone}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-5 font-mono text-xs text-[#F8FAFC] font-semibold">
                      {c.ordersCount} contracts
                    </td>
                    <td className="py-4 px-5 font-mono text-xs text-[#4F6FFF] font-bold">
                      ${c.totalSpend.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-4 px-5">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold font-mono ${
                          c.status === "VIP"
                            ? "bg-amber-950 text-amber-400 border border-amber-900/30"
                            : c.status === "Inactive"
                            ? "bg-[#1F2A44] text-[#64748B]"
                            : "bg-emerald-950 text-emerald-400 border border-emerald-900/30"
                        }`}
                      >
                        {c.status}
                      </span>
                    </td>
                    <td className="py-4 px-5 text-right text-xs text-[#64748B] font-mono">
                      {c.joinDate}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Customer Modal */}
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
                  <h3 className="text-lg font-bold text-white">Register Customer</h3>
                  <p className="text-xs text-[#64748B]">Fill in client account directories.</p>
                </div>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-1 rounded bg-[#0D1325] text-[#64748B] hover:text-[#94A3B8]"
                >
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleAddCustomer} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-mono tracking-widest text-[#64748B] uppercase mb-1.5">
                    Contact Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="E.g., Jessica Alba"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#0D1325] border border-[#1F2A44] rounded-lg px-3 py-2 text-xs text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:border-[#4F6FFF] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono tracking-widest text-[#64748B] uppercase mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="jessica@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#0D1325] border border-[#1F2A44] rounded-lg px-3 py-2 text-xs text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:border-[#4F6FFF] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono tracking-widest text-[#64748B] uppercase mb-1.5">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    placeholder="+1 (555) 000-0000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-[#0D1325] border border-[#1F2A44] rounded-lg px-3 py-2 text-xs text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:border-[#4F6FFF] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono tracking-widest text-[#64748B] uppercase mb-1.5">
                    Company Name
                  </label>
                  <input
                    type="text"
                    placeholder="E.g., PackCorp Industries"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full bg-[#0D1325] border border-[#1F2A44] rounded-lg px-3 py-2 text-xs text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:border-[#4F6FFF] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono tracking-widest text-[#64748B] uppercase mb-1.5">
                    Tier Grouping
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full bg-[#0D1325] border border-[#1F2A44] rounded-lg px-3 py-2 text-xs text-[#F8FAFC] focus:outline-none focus:border-[#4F6FFF] transition-all"
                  >
                    <option value="Active">Active (Standard)</option>
                    <option value="VIP">VIP (High priority)</option>
                    <option value="Inactive">Inactive</option>
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
                    Save CRM Profile
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
