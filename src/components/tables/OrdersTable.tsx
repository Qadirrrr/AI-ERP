import React from "react";
import { useApp } from "../../context/AppContext";

export const OrdersTable: React.FC = () => {
  const { orders } = useApp();

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Fulfilled":
        return "bg-emerald-950/80 text-[#2DD4BF] border-emerald-800/50";
      case "Processing":
        return "bg-[#141C2F] text-[#4F6FFF] border-[#1F2A44]";
      case "Delayed":
        return "bg-amber-950/60 text-[#FBBF24] border-amber-800/40";
      default:
        return "bg-gray-800 text-gray-400 border-gray-700";
    }
  };

  return (
    <div className="w-full overflow-x-auto rounded-xl border border-[#1F2A44] bg-[#141C2F]/40">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-[#1F2A44] bg-[#0D1325]/40 text-[10px] font-mono tracking-wider text-[#64748B] uppercase">
            <th className="py-3 px-4 font-semibold">Order</th>
            <th className="py-3 px-4 font-semibold">Customer</th>
            <th className="py-3 px-4 font-semibold">Items</th>
            <th className="py-3 px-4 font-semibold">Status</th>
            <th className="py-3 px-4 font-semibold text-right">Amount</th>
            <th className="py-3 px-4 font-semibold text-right">Date</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#1F2A44]/40 text-xs text-[#94A3B8]">
          {orders.map((order) => (
            <tr
              key={order.id}
              className="hover:bg-[#111827]/40 transition-colors duration-150 group"
            >
              <td className="py-3.5 px-4 font-mono font-bold text-[#F8FAFC]">
                {order.id}
              </td>
              <td className="py-3.5 px-4 font-medium text-[#F8FAFC]">
                {order.customer}
              </td>
              <td className="py-3.5 px-4">
                {order.items}
              </td>
              <td className="py-3.5 px-4">
                <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold border ${getStatusStyle(order.status)}`}>
                  {order.status}
                </span>
              </td>
              <td className="py-3.5 px-4 text-right font-mono text-[#F8FAFC] font-semibold">
                ${order.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </td>
              <td className="py-3.5 px-4 text-right">
                {order.date}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
