import React from "react";
import { useApp, PageType } from "../../context/AppContext";
import {
  LayoutDashboard,
  Boxes,
  FileSpreadsheet,
  Coins,
  Users2,
  BarChart3,
  Sparkles,
  Settings,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export const Sidebar: React.FC = () => {
  const {
    currentPage,
    setCurrentPage,
    sidebarCollapsed,
    setSidebarCollapsed,
    user,
    products,
    orders,
  } = useApp();

  const lowStockCount = products.filter(p => p.stock < p.maxStock * 0.3).length;

  const menuItems = [
    {
      id: "dashboard" as PageType,
      label: "Dashboard",
      icon: LayoutDashboard,
      section: "WORKSPACE",
    },
    {
      id: "inventory" as PageType,
      label: "Inventory",
      icon: Boxes,
      badge: lowStockCount > 0 ? lowStockCount : undefined,
      section: "WORKSPACE",
    },
    {
      id: "orders" as PageType,
      label: "Orders",
      icon: FileSpreadsheet,
      badge: 128,
      section: "WORKSPACE",
    },
    {
      id: "finance" as PageType,
      label: "Finance",
      icon: Coins,
      section: "WORKSPACE",
    },
    {
      id: "customers" as PageType,
      label: "Customers",
      icon: Users2,
      section: "WORKSPACE",
    },
    {
      id: "reports" as PageType,
      label: "Reports",
      icon: BarChart3,
      section: "WORKSPACE",
    },
    {
      id: "chat" as PageType,
      label: "Corvus AI",
      icon: Sparkles,
      section: "TOOLS",
      sparkle: true,
    },
    {
      id: "settings" as PageType,
      label: "Settings",
      icon: Settings,
      section: "TOOLS",
    },
  ];

  const workspaceSection = menuItems.filter((i) => i.section === "WORKSPACE");
  const toolsSection = menuItems.filter((i) => i.section === "TOOLS");

  const renderNavGroup = (items: typeof menuItems, title: string) => (
    <div className="mb-6">
      <AnimatePresence>
        {!sidebarCollapsed && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="px-4 text-[10px] font-bold tracking-widest text-[#64748B] mb-2 uppercase"
          >
            {title}
          </motion.p>
        )}
      </AnimatePresence>
      <div className="space-y-1">
        {items.map((item) => {
          const isActive = currentPage === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => {
                setCurrentPage(item.id);
              }}
              className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${
                isActive
                  ? "bg-[#141C2F] text-[#4F6FFF] border-l-2 border-[#4F6FFF]"
                  : "text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#111827]"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  size={18}
                  className={`transition-transform duration-200 group-hover:scale-110 ${
                    item.sparkle ? "text-[#6C63FF]" : isActive ? "text-[#4F6FFF]" : "text-[#64748B] group-hover:text-[#94A3B8]"
                  }`}
                />
                {!sidebarCollapsed && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    className="truncate"
                  >
                    {item.label}
                  </motion.span>
                )}
              </div>
              {!sidebarCollapsed && item.badge && (
                <span
                  className={`text-[11px] px-1.5 py-0.5 rounded font-mono font-bold ${
                    item.id === "inventory"
                      ? "bg-amber-950 text-[#FBBF24]"
                      : "bg-[#1F2A44] text-[#94A3B8]"
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Sidebar Backdrop */}
      {!sidebarCollapsed && (
        <div
          onClick={() => setSidebarCollapsed(true)}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-30 lg:hidden"
        />
      )}

      <aside
        className={`h-screen bg-[#0D1325] border-r border-[#1F2A44] flex flex-col justify-between transition-all duration-300 fixed lg:relative z-40 ${
          sidebarCollapsed
            ? "-translate-x-full lg:translate-x-0 lg:w-16"
            : "translate-x-0 w-64 lg:w-64"
        }`}
      >
      {/* Sidebar Header */}
      <div>
        <div className="flex items-center justify-between p-4 border-b border-[#1F2A44] h-16">
          <div className="flex items-center gap-3 overflow-hidden">
            {/* Elegant Corvus Logo matching Page 1/2 */}
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#4F6FFF] to-[#6C63FF] flex items-center justify-center text-white font-extrabold shrink-0 shadow-md">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-white"
              >
                <path d="M3 20h18L12 4z" />
              </svg>
            </div>
            {!sidebarCollapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                className="flex flex-col text-left shrink-0"
              >
                <span className="font-display font-bold text-lg text-[#F8FAFC] tracking-tight leading-none">
                  Corvus
                </span>
                <span className="text-[9px] font-mono tracking-widest text-[#64748B] mt-0.5 uppercase">
                  MERIDIAN GOODS CO.
                </span>
              </motion.div>
            )}
          </div>
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="w-6 h-6 rounded-md border border-[#1F2A44] bg-[#141C2F] text-[#94A3B8] hover:text-[#F8FAFC] flex items-center justify-center transition-colors duration-150 absolute -right-3 top-5"
          >
            {sidebarCollapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="p-3">
          {renderNavGroup(workspaceSection, "WORKSPACE")}
          {renderNavGroup(toolsSection, "TOOLS")}
        </nav>
      </div>

      {/* Sidebar Footer Info */}
      <div className="p-3 border-t border-[#1F2A44]">
        {/* Ask Corvus Upgrade Card (Matching bottom left of Screen 2/4/5) */}
        {!sidebarCollapsed && currentPage !== "chat" && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-3.5 rounded-xl bg-gradient-to-br from-[#141C2F] to-[#0D1325] border border-[#1F2A44] relative overflow-hidden"
          >
            {/* Small Glowing Amber Dot */}
            <div className="absolute top-3 right-3 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
            </div>

            <div className="flex items-start gap-1.5 mb-2.5">
              <Sparkles size={14} className="text-[#FBBF24] mt-0.5 shrink-0" />
              <span className="text-[11px] font-semibold text-[#FBBF24]">Ask Corvus AI</span>
            </div>
            <p className="text-[11px] text-[#94A3B8] leading-normal mb-3">
              "Summarize this week's fulfillment delays."
            </p>
            <button
              onClick={() => setCurrentPage("chat")}
              className="w-full text-left py-1.5 px-3 rounded bg-amber-500/10 hover:bg-amber-500/20 text-[#FBBF24] font-medium text-xs transition-colors duration-200"
            >
              Open copilot →
            </button>
          </motion.div>
        )}

        {/* User Card matching bottom-left profile */}
        <div className="flex items-center gap-3 px-2.5 py-2 rounded-lg bg-[#111827] border border-[#1F2A44]/60">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#4F6FFF] to-[#6C63FF] flex items-center justify-center font-display font-bold text-xs text-white shadow">
            {user.avatar}
          </div>
          {!sidebarCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col text-left overflow-hidden"
            >
              <span className="text-xs font-semibold text-[#F8FAFC] truncate">{user.name}</span>
              <span className="text-[10px] font-mono text-[#64748B]">{user.role}</span>
            </motion.div>
          )}
        </div>
      </div>
    </aside>
    </>
  );
};
