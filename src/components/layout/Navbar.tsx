import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { Search, Bell, Download, Calendar, Menu, X } from "lucide-react";

export const Navbar: React.FC = () => {
  const { currentPage, user, products, sidebarCollapsed, setSidebarCollapsed } = useApp();
  const [searchQuery, setSearchQuery] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    { id: "1", text: "7 products have fallen below reorder point", time: "2 min ago", unread: true },
    { id: "2", text: "Order #ORD-8839 is delayed in central hub", time: "1 hr ago", unread: true },
    { id: "3", text: "Weekly replenishment sheet generated", time: "1 day ago", unread: false },
  ];

  // Derive page heading and details based on active page state
  const getHeaderDetails = () => {
    switch (currentPage) {
      case "dashboard":
        return {
          breadcrumb: "Workspace / Meridian Goods Co.",
          title: `Good morning, ${user.name.split(" ")[0]}`,
          emoji: "👋",
        };
      case "inventory":
        return {
          breadcrumb: "Workspace / Inventory",
          title: "Inventory",
        };
      case "orders":
        return {
          breadcrumb: "Workspace / Orders",
          title: "Order Fulfillment",
        };
      case "finance":
        return {
          breadcrumb: "Workspace / Finance",
          title: "Financial Ledger & Profit",
        };
      case "customers":
        return {
          breadcrumb: "Workspace / CRM",
          title: "Customer Directory",
        };
      case "reports":
        return {
          breadcrumb: "Workspace / Reports",
          title: "Reports & analytics",
        };
      case "chat":
        return {
          breadcrumb: "Corvus AI Copilot",
          title: "Connected to Inventory, Orders & Finance",
        };
      case "settings":
        return {
          breadcrumb: "Workspace / Settings",
          title: "System Settings",
        };
      default:
        return {
          breadcrumb: "Workspace / Command Center",
          title: "Corvus ERP",
        };
    }
  };

  const { breadcrumb, title, emoji } = getHeaderDetails();

  return (
    <header className="h-20 border-b border-[#1F2A44] bg-[#0A1020] px-4 sm:px-10 flex items-center justify-between relative z-20">
      {/* Page Info / Breadcrumb */}
      <div className="flex items-center gap-3">
        {/* Toggle hamburger button for tablet/mobile */}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="lg:hidden p-1.5 rounded-lg border border-[#1F2A44] bg-[#111827] text-[#94A3B8] hover:text-[#F8FAFC] transition-colors"
        >
          {sidebarCollapsed ? <Menu size={18} /> : <X size={18} />}
        </button>

        <div className="flex flex-col text-left">
          <span className="text-[10px] font-mono tracking-wider text-[#64748B] uppercase">
            {breadcrumb}
          </span>
          <h1 className="text-sm sm:text-lg font-display font-semibold text-[#F8FAFC] flex items-center gap-1.5 leading-tight">
            {title} {emoji && <span>{emoji}</span>}
          </h1>
        </div>
      </div>

      {/* Global Controls & Actions */}
      <div className="flex items-center gap-4">
        {/* Search Input (Dynamic Search across SKU/Name if on inventory/dashboard) */}
        {currentPage !== "chat" && (
          <div className="relative hidden md:block w-72">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B]" />
            <input
              type="text"
              placeholder="Search orders, SKUs, customers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#111827] border border-[#1F2A44] rounded-lg pl-9 pr-4 py-1.5 text-xs text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:ring-1 focus:ring-[#4F6FFF] focus:border-[#4F6FFF] transition-all duration-150"
            />
          </div>
        )}

        {/* Date Controls & Export specifically for Reports Page (Matching Screen 5) */}
        {currentPage === "reports" && (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#1F2A44] bg-[#111827] text-xs font-medium text-[#94A3B8]">
              <Calendar size={13} className="text-[#64748B]" />
              <span>Jan 1 – Jul 8, 2026</span>
            </div>
            <button
              onClick={() => alert("Replenishment PDF generated and download triggered. Reports include: Expense Breakdown, Top Products, and Department revenue.")}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#4F6FFF] hover:bg-[#5B7DFF] text-xs font-semibold text-[#F8FAFC] transition-all duration-150"
            >
              <Download size={13} />
              <span>Export</span>
            </button>
          </div>
        )}

        {/* Notifications Icon */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-lg border border-[#1F2A44] bg-[#111827]/80 text-[#94A3B8] hover:text-[#F8FAFC] transition-colors duration-150 relative"
          >
            <Bell size={16} />
            <span className="absolute top-1 right-1 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
          </button>

          {/* Interactive Notification dropdown */}
          {showNotifications && (
            <div className="absolute right-0 top-11 w-80 bg-[#141C2F] border border-[#1F2A44] rounded-xl shadow-2xl p-2 z-50 animate-in fade-in duration-150">
              <div className="p-2 border-b border-[#1F2A44] flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-[#F8FAFC]">Notifications</span>
                <span className="text-[10px] text-[#4F6FFF] cursor-pointer" onClick={() => alert("Marked all as read.")}>Mark all read</span>
              </div>
              <div className="space-y-1 max-h-60 overflow-y-auto">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`p-2 rounded-lg text-left transition-colors duration-150 cursor-pointer ${
                      n.unread ? "bg-[#111827] border-l-2 border-[#4F6FFF]" : "hover:bg-[#111827]/50"
                    }`}
                  >
                    <p className="text-[11px] text-[#94A3B8] leading-normal">{n.text}</p>
                    <span className="text-[9px] text-[#64748B] mt-1 block">{n.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Small Profile Header Pill */}
        <div className="flex items-center gap-2 border border-[#1F2A44] bg-[#111827]/60 rounded-full px-2 py-1 shrink-0">
          <div className="w-6 h-6 rounded-full bg-[#4F6FFF] flex items-center justify-center text-[10px] font-bold text-white shadow">
            {user.avatar}
          </div>
          <span className="text-[11px] font-medium text-[#94A3B8] pr-1 hidden sm:inline">
            {user.name}
          </span>
        </div>
      </div>
    </header>
  );
};
