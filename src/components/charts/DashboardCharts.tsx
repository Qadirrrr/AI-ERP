import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { revenueOverviewData, orderStatusData } from "../../data";

// Custom Tooltip component for a clean premium glassmorphic UI
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#141C2F]/90 backdrop-blur-md border border-[#1F2A44] rounded-lg p-3 shadow-xl">
        <p className="text-xs font-mono font-semibold text-[#F8FAFC] mb-1">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-[11px]" style={{ color: entry.color }}>
            {entry.name}: <span className="font-mono font-bold">${entry.value.toLocaleString()}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export const RevenueOverviewChart: React.FC = () => {
  return (
    <div className="w-full h-[280px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={revenueOverviewData}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#4F6FFF" stopOpacity={0.35} />
              <stop offset="95%" stopColor="#4F6FFF" stopOpacity={0.0} />
            </linearGradient>
            <linearGradient id="colorForecast" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1F2A44" opacity={0.4} />
          <XAxis
            dataKey="name"
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
            tickFormatter={(value) => `$${value / 1000}k`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            name="Revenue"
            type="monotone"
            dataKey="Revenue"
            stroke="#4F6FFF"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorRevenue)"
          />
          <Area
            name="Forecast"
            type="monotone"
            dataKey="Forecast"
            stroke="#F59E0B"
            strokeWidth={2}
            strokeDasharray="4 4"
            fillOpacity={1}
            fill="url(#colorForecast)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export const OrderStatusDoughnut: React.FC = () => {
  const totalOrders = orderStatusData.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <div className="relative w-full h-[240px] flex items-center justify-center">
      {/* Absolute centered count */}
      <div className="absolute text-center flex flex-col items-center justify-center pointer-events-none mt-[-10px]">
        <span className="text-3xl font-display font-extrabold text-[#F8FAFC]">
          {totalOrders}
        </span>
        <span className="text-[10px] font-mono tracking-widest text-[#64748B] uppercase">
          orders
        </span>
      </div>

      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={orderStatusData}
            cx="50%"
            cy="50%"
            innerRadius={65}
            outerRadius={80}
            paddingAngle={3}
            dataKey="value"
          >
            {orderStatusData.map((entry, index) => (
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
                      {data.name}: {data.value} ({Math.round((data.value / totalOrders) * 100)}%)
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
