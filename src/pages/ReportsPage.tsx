import React from "react";
import { reportsMetrics, topPerformingProducts, expenseBreakdownData } from "../data";
import {
  DepartmentRevenueChart,
  OrdersTrendChart,
  ExpenseBreakdownChart,
} from "../components/charts/ReportsCharts";
import { motion } from "motion/react";

export const ReportsPage: React.FC = () => {
  // Sparkline mini SVG generator for visual lists
  const renderSparkline = (data: number[], color: string) => {
    const width = 80;
    const height = 16;
    const maxVal = Math.max(...data);
    const minVal = Math.min(...data);
    const range = maxVal - minVal || 1;

    const points = data
      .map((val, index) => {
        const x = (index / (data.length - 1)) * width;
        const y = height - ((val - minVal) / range) * height;
        return `${x},${y}`;
      })
      .join(" ");

    return (
      <svg width={width} height={height} className="overflow-visible">
        <polyline
          fill="none"
          stroke={color}
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
        />
      </svg>
    );
  };

  const getSparklineColor = (index: number) => {
    switch (index) {
      case 0:
        return "#2DD4BF"; // Green
      case 1:
        return "#4F6FFF"; // Blue
      case 2:
        return "#F59E0B"; // Gold
      default:
        return "#6C63FF"; // Purple
    }
  };

  return (
    <div className="space-y-8 text-left">
      {/* 1. Reports Key Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {reportsMetrics.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="p-6 rounded-[20px] border border-[#1F2A44] bg-[#141C2F] flex flex-col justify-between shadow-lg hover:shadow-xl hover:translate-y-[-2px] transition-all duration-200"
          >
            <span className="text-xs font-medium text-[#64748B] mb-3">
              {stat.title}
            </span>
            <div className="flex flex-col gap-1.5">
              <span className="text-2xl md:text-3xl font-display font-extrabold text-white tracking-tight leading-none">
                {stat.value}
              </span>
              <span
                className={`text-[10px] font-mono font-semibold ${
                  stat.isPositive ? "text-[#2DD4BF]" : "text-[#FBBF24]"
                }`}
              >
                {stat.change}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* 2. Primary Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Department Revenue Vertical Bars (Left 6/12) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="lg:col-span-6 border border-[#1F2A44] bg-[#141C2F] rounded-[24px] p-6 shadow-[0_10px_40px_rgba(0,0,0,0.3)]"
        >
          <div className="flex flex-col mb-6">
            <h3 className="text-sm font-semibold text-[#F8FAFC]">Refined revenue by department</h3>
            <span className="text-[10px] text-[#64748B] mt-0.5">Current quarter, in thousands</span>
          </div>
          <DepartmentRevenueChart />
        </motion.div>

        {/* Orders Rolling Trend Line (Right 6/12) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-6 border border-[#1F2A44] bg-[#141C2F] rounded-[24px] p-6 shadow-[0_10px_40px_rgba(0,0,0,0.3)]"
        >
          <div className="flex flex-col mb-6">
            <h3 className="text-sm font-semibold text-[#F8FAFC]">Orders trend</h3>
            <span className="text-[10px] text-[#64748B] mt-0.5">Daily, last 14 days</span>
          </div>
          <OrdersTrendChart />
        </motion.div>
      </div>

      {/* 3. Secondary Analytics Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Top Products sparklines lists (Left 7/12) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="lg:col-span-7 border border-[#1F2A44] bg-[#141C2F] rounded-[24px] p-6 shadow-[0_10px_40px_rgba(0,0,0,0.3)] flex flex-col justify-between"
        >
          <div className="flex flex-col mb-4">
            <h3 className="text-sm font-semibold text-[#F8FAFC]">Top performing products</h3>
            <span className="text-[10px] text-[#64748B] mt-0.5">By revenue, this quarter</span>
          </div>

          <div className="divide-y divide-[#1F2A44]/40">
            {topPerformingProducts.map((p, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-3.5 hover:bg-[#111827]/30 px-2 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-4">
                  <span className="font-mono text-xs text-[#64748B] font-bold">
                    {p.rank}
                  </span>
                  <span className="text-xs font-semibold text-[#F8FAFC]">
                    {p.name}
                  </span>
                </div>

                <div className="flex items-center gap-8">
                  {/* Miniature glowing SVG Sparklines */}
                  <div className="hidden sm:block">
                    {renderSparkline(p.change, getSparklineColor(index))}
                  </div>
                  <span className="font-mono text-xs font-bold text-[#F8FAFC]">
                    {p.value}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Expenses Cost breakdown doughnut (Right 5/12) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-5 border border-[#1F2A44] bg-[#141C2F] rounded-[24px] p-6 shadow-[0_10px_40px_rgba(0,0,0,0.3)] flex flex-col justify-between"
        >
          <div className="flex flex-col mb-4">
            <h3 className="text-sm font-semibold text-[#F8FAFC]">Expense breakdown</h3>
            <span className="text-[10px] text-[#64748B] mt-0.5">This quarter</span>
          </div>

          <ExpenseBreakdownChart />

          {/* Color-Coded Percentage Legend */}
          <div className="flex flex-col gap-2 mt-4 text-xs font-mono border-t border-[#1F2A44]/40 pt-4">
            {expenseBreakdownData.map((item, index) => (
              <div key={index} className="flex items-center justify-between px-2">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-[#94A3B8] font-semibold">{item.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[#64748B]">${(item.amount / 1000).toFixed(0)}k total</span>
                  <span className="text-[#F8FAFC] font-extrabold">{item.value}%</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};
