import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { departmentRevenueData, expenseBreakdownData } from "../../data";

// Generate rolling 14 days mock data for the Orders Trend
const ordersTrendMockData = [
  { day: "Day 1", Orders: 42 },
  { day: "Day 2", Orders: 38 },
  { day: "Day 3", Orders: 52 },
  { day: "Day 4", Orders: 46 },
  { day: "Day 5", Orders: 58 },
  { day: "Day 6", Orders: 62 },
  { day: "Day 7", Orders: 55 },
  { day: "Day 8", Orders: 71 },
  { day: "Day 9", Orders: 68 },
  { day: "Day 10", Orders: 82 },
  { day: "Day 11", Orders: 78 },
  { day: "Day 12", Orders: 85 },
  { day: "Day 13", Orders: 81 },
  { day: "Day 14", Orders: 94 },
];

export const DepartmentRevenueChart: React.FC = () => {
  return (
    <div className="w-full h-[280px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={departmentRevenueData}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#1F2A44" opacity={0.3} />
          <XAxis
            dataKey="department"
            stroke="#64748B"
            fontSize={10}
            tickLine={false}
            axisLine={false}
            dy={10}
          />
          <YAxis
            stroke="#64748B"
            fontSize={10}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `$${value}k`}
          />
          <Tooltip
            content={({ active, payload }: any) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-[#141C2F]/95 backdrop-blur border border-[#1F2A44] rounded-lg p-2.5 shadow-xl text-xs font-mono">
                    <span className="text-[#F8FAFC]">{payload[0].payload.department}: </span>
                    <span className="text-[#4F6FFF] font-bold">${payload[0].value}k</span>
                  </div>
                );
              }
              return null;
            }}
          />
          <Bar
            dataKey="value"
            fill="#4F6FFF"
            radius={[4, 4, 0, 0]}
            maxBarSize={32}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export const OrdersTrendChart: React.FC = () => {
  return (
    <div className="w-full h-[280px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={ordersTrendMockData}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#1F2A44" opacity={0.3} />
          <XAxis
            dataKey="day"
            stroke="#64748B"
            fontSize={10}
            tickLine={false}
            axisLine={false}
            dy={10}
            hide
          />
          <YAxis
            stroke="#64748B"
            fontSize={10}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            content={({ active, payload }: any) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-[#141C2F] border border-[#1F2A44] rounded-lg p-2.5 shadow-xl text-xs font-mono">
                    <span className="text-[#94A3B8]">Orders: </span>
                    <span className="text-[#2DD4BF] font-bold">{payload[0].value}</span>
                  </div>
                );
              }
              return null;
            }}
          />
          <Line
            type="monotone"
            dataKey="Orders"
            stroke="#2DD4BF"
            strokeWidth={3}
            dot={false}
            activeDot={{ r: 6, stroke: "#141C2F", strokeWidth: 2, fill: "#2DD4BF" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export const ExpenseBreakdownChart: React.FC = () => {
  const totalExpense = expenseBreakdownData.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="relative w-full h-[240px] flex items-center justify-center">
      <div className="absolute text-center flex flex-col items-center justify-center pointer-events-none mt-[-5px]">
        <span className="text-2xl font-display font-extrabold text-[#F8FAFC]">
          ${(totalExpense / 1000).toFixed(0)}k
        </span>
        <span className="text-[10px] font-mono tracking-widest text-[#64748B] uppercase">
          total
        </span>
      </div>

      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={expenseBreakdownData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={75}
            paddingAngle={4}
            dataKey="amount"
          >
            {expenseBreakdownData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} stroke="#141C2F" strokeWidth={2} />
            ))}
          </Pie>
          <Tooltip
            content={({ active, payload }: any) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload;
                return (
                  <div className="bg-[#141C2F] border border-[#1F2A44] rounded-lg p-2.5 shadow-xl text-xs font-mono">
                    <span style={{ color: data.color }} className="font-bold">
                      {data.name}: ${data.amount.toLocaleString()} ({data.value}%)
                    </span>
                  </div>
                );
              }
              return null;
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
