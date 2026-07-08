import React from "react";
import { useApp } from "../context/AppContext";
import { DollarSign, FileText, AlertTriangle, Users2, ArrowRight } from "lucide-react";
import { RevenueOverviewChart, OrderStatusDoughnut } from "../components/charts/DashboardCharts";
import { OrdersTable } from "../components/tables/OrdersTable";
import { motion } from "motion/react";

export const DashboardPage: React.FC = () => {
  const { metrics, setCurrentPage, products } = useApp();

  const lowStockCount = products.filter((p) => p.stock < p.maxStock * 0.3).length;

  const cards = [
    {
      title: "Revenue (MTD)",
      value: "$482,300",
      change: "▲ 12.4% vs last month",
      isPositive: true,
      icon: DollarSign,
      colorClass: "text-[#2DD4BF]",
      bgClass: "bg-emerald-950/20 border-emerald-900/30",
    },
    {
      title: "Open Orders",
      value: "128",
      change: "▲ 6 new today",
      isPositive: true,
      icon: FileText,
      colorClass: "text-[#4F6FFF]",
      bgClass: "bg-[#141C2F]",
    },
    {
      title: "Low Stock Alerts",
      value: lowStockCount.toString(),
      change: "⚠ Needs reorder",
      isPositive: false,
      icon: AlertTriangle,
      colorClass: "text-[#FBBF24]",
      bgClass: "bg-amber-950/20 border-amber-900/30",
    },
    {
      title: "Active Customers",
      value: "964",
      change: "▲ 3.1% growth",
      isPositive: true,
      icon: Users2,
      colorClass: "text-[#2DD4BF]",
      bgClass: "bg-emerald-950/20 border-emerald-900/30",
    },
  ];

  return (
    <div className="space-y-8 text-left">
      {/* 1. Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, index) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`p-6 rounded-[20px] border border-[#1F2A44] bg-[#141C2F] flex flex-col justify-between shadow-lg hover:shadow-xl hover:translate-y-[-2px] transition-all duration-200 relative overflow-hidden`}
            >
              <div className="flex justify-between items-start mb-3">
                <span className="text-xs font-medium text-[#64748B]">{card.title}</span>
                <div className={`p-2 rounded-lg bg-[#0D1325] border border-[#1F2A44]/80 ${card.colorClass}`}>
                  <Icon size={14} />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <span className="text-2xl md:text-3xl font-display font-extrabold text-white tracking-tight leading-none">
                  {card.value}
                </span>
                <span
                  className={`text-[10px] font-mono font-semibold ${
                    card.isPositive ? "text-[#2DD4BF]" : "text-[#FBBF24]"
                  }`}
                >
                  {card.change}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* 2. Analytical Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Revenue Overview Line/Area Chart (Left side 7/12) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-7 border border-[#1F2A44] bg-[#141C2F] rounded-[24px] p-6 shadow-[0_10px_40px_rgba(0,0,0,0.3)] flex flex-col justify-between"
        >
          <div className="flex justify-between items-start mb-6">
            <div className="flex flex-col">
              <h3 className="text-sm font-semibold text-[#F8FAFC]">Revenue overview</h3>
              <span className="text-[10px] text-[#64748B] mt-0.5">Last 6 months, all channels</span>
            </div>
            <div className="flex items-center gap-4 text-[10px] font-mono font-semibold text-[#94A3B8]">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-[#4F6FFF]" />
                <span>Revenue</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-[#F59E0B]" />
                <span>Forecast</span>
              </div>
            </div>
          </div>
          <RevenueOverviewChart />
        </motion.div>

        {/* Order Status Doughnut (Right side 5/12) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="lg:col-span-5 border border-[#1F2A44] bg-[#141C2F] rounded-[24px] p-6 shadow-[0_10px_40px_rgba(0,0,0,0.3)] flex flex-col justify-between"
        >
          <div className="flex flex-col mb-4">
            <h3 className="text-sm font-semibold text-[#F8FAFC]">Order status</h3>
            <span className="text-[10px] text-[#64748B] mt-0.5">This week, 128 orders</span>
          </div>
          <OrderStatusDoughnut />
          <div className="flex items-center justify-around text-xs mt-3 border-t border-[#1F2A44]/40 pt-4 px-2">
            <div className="flex items-center gap-1.5 text-slate-400">
              <div className="w-2 h-2 rounded-full bg-[#2DD4BF]" />
              <span>Fulfilled: <strong className="text-white">79</strong></span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-400">
              <div className="w-2 h-2 rounded-full bg-[#4F6FFF]" />
              <span>Processing: <strong className="text-white">31</strong></span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-400">
              <div className="w-2 h-2 rounded-full bg-[#F59E0B]" />
              <span>Delayed: <strong className="text-white">18</strong></span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* 3. Recent Orders Log section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="border border-[#1F2A44] bg-[#141C2F] rounded-[24px] p-6 shadow-[0_10px_40px_rgba(0,0,0,0.3)] flex flex-col"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex flex-col">
            <h3 className="text-sm font-semibold text-[#F8FAFC]">Recent orders</h3>
            <span className="text-[10px] text-[#64748B] mt-0.5">Updated 2 minutes ago</span>
          </div>
          <button
            onClick={() => alert("Redirecting to the core order history pipeline...")}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-[#1F2A44] hover:bg-[#111827] text-xs font-semibold text-[#94A3B8] hover:text-[#F8FAFC] transition-all"
          >
            <span>View all</span>
            <ArrowRight size={13} />
          </button>
        </div>
        <OrdersTable />
      </motion.div>
    </div>
  );
};
