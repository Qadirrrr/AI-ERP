import React, { useState, useRef, useEffect } from "react";
import { useApp } from "../../context/AppContext";
import {
  Sparkles,
  Send,
  MessageSquare,
  Plus,
  RefreshCw,
  Clock,
  ArrowRight,
} from "lucide-react";
import { motion } from "motion/react";

export const ChatInterface: React.FC = () => {
  const {
    chats,
    activeChatId,
    setActiveChatId,
    messages,
    sendMessage,
    isGeneratingResponse,
    triggerLowStockAction,
  } = useApp();

  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeMessages = messages[activeChatId] || [];

  // Scroll to bottom when message arrives
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeMessages, isGeneratingResponse]);

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    if (!textToSend) setInput("");
    await sendMessage(query);
  };

  const suggestedPrompts = [
    "Summarize today's orders",
    "Draft a reorder email",
    "Explain the revenue dip",
  ];

  // Helper to parse double asterisk bold markers in markdown text
  const renderMessageContent = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={i} className="text-[#F8FAFC] font-bold">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  return (
    <div className="flex flex-1 h-[calc(100vh-4rem)] overflow-hidden">
      {/* 1. Conversations Sidebar */}
      <div className="w-64 border-r border-[#1F2A44] bg-[#0D1325]/80 flex flex-col justify-between shrink-0 h-full hidden md:flex">
        <div className="p-4 flex flex-col h-full overflow-hidden">
          {/* New conversation button */}
          <button
            onClick={() => {
              alert("Starting a fresh sandbox conversation with Corvus AI. Current session state resides here.");
            }}
            className="w-full py-2 px-3 rounded-lg border border-[#1F2A44] bg-[#141C2F]/50 hover:bg-[#141C2F] text-[#94A3B8] hover:text-[#F8FAFC] text-xs font-semibold flex items-center justify-center gap-2 transition-all duration-150 mb-6"
          >
            <Plus size={14} />
            <span>New conversation</span>
          </button>

          {/* List grouped by days */}
          <div className="flex-1 overflow-y-auto space-y-4 pr-1 text-left">
            <div>
              <span className="text-[10px] font-mono tracking-widest text-[#64748B] uppercase mb-2 block">
                Today
              </span>
              <div className="space-y-1">
                {chats.slice(0, 2).map((c) => {
                  const isActive = activeChatId === c.id;
                  return (
                    <button
                      key={c.id}
                      onClick={() => setActiveChatId(c.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors flex items-center gap-2.5 ${
                        isActive
                          ? "bg-[#141C2F] text-[#4F6FFF] border-l-2 border-[#4F6FFF]"
                          : "text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#111827]"
                      }`}
                    >
                      <MessageSquare size={13} className={isActive ? "text-[#4F6FFF]" : "text-[#64748B]"} />
                      <div className="flex flex-col truncate">
                        <span className="truncate leading-none">{c.title}</span>
                        <span className="text-[9px] text-[#64748B] mt-0.5">{c.time}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <span className="text-[10px] font-mono tracking-widest text-[#64748B] uppercase mb-2 block">
                Yesterday
              </span>
              <div className="space-y-1">
                {chats.slice(2).map((c) => {
                  const isActive = activeChatId === c.id;
                  return (
                    <button
                      key={c.id}
                      onClick={() => setActiveChatId(c.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors flex items-center gap-2.5 ${
                        isActive
                          ? "bg-[#141C2F] text-[#4F6FFF] border-l-2 border-[#4F6FFF]"
                          : "text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#111827]"
                      }`}
                    >
                      <MessageSquare size={13} className={isActive ? "text-[#4F6FFF]" : "text-[#64748B]"} />
                      <div className="flex flex-col truncate">
                        <span className="truncate leading-none">{c.title}</span>
                        <span className="text-[9px] text-[#64748B] mt-0.5">{c.time}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Chat Feed Area */}
      <div className="flex-1 flex flex-col bg-[#0A1020] h-full justify-between relative overflow-hidden">
        {/* Header Title bar in Screen 3 */}
        <div className="h-14 border-b border-[#1F2A44] px-6 flex items-center justify-between bg-[#0A1020] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-white">
              <Sparkles size={16} />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-xs font-bold text-[#F8FAFC]">Corvus AI Copilot</span>
              <span className="text-[10px] font-mono text-[#64748B]">Connected to Inventory, Orders & Finance</span>
            </div>
          </div>

          <button
            onClick={() => {
              alert("Sandbox refreshed. Clean contextual vectors initialized.");
            }}
            className="flex items-center gap-1 text-[11px] font-mono text-[#64748B] hover:text-[#94A3B8] transition-colors"
          >
            <RefreshCw size={11} />
            <span>New chat</span>
          </button>
        </div>

        {/* Scrollable messages space */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeMessages.map((msg) => {
            const isAI = msg.role === "assistant";
            return (
              <div
                key={msg.id}
                className={`flex gap-4 max-w-3xl ${
                  isAI ? "mr-auto text-left" : "ml-auto flex-row-reverse text-right"
                }`}
              >
                {/* Avatar */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-display font-bold text-xs shrink-0 shadow-sm ${
                    isAI
                      ? "bg-gradient-to-tr from-[#6C63FF] to-[#4F6FFF] text-white"
                      : "bg-[#111827] border border-[#1F2A44] text-[#94A3B8]"
                  }`}
                >
                  {isAI ? <Sparkles size={13} /> : "HO"}
                </div>

                {/* Content block */}
                <div className="flex flex-col gap-3 max-w-[90%]">
                  <div
                    className={`rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                      isAI
                        ? "bg-[#141C2F]/70 border border-[#1F2A44]/60 text-[#94A3B8]"
                        : "bg-[#4F6FFF] text-white"
                    }`}
                  >
                    <p className="whitespace-pre-line">{renderMessageContent(msg.content)}</p>
                  </div>

                  {/* Render interactive widgets if specified inside message object (Matching Screen 3) */}
                  {isAI && msg.widget && msg.widget.type === "low_stock_table" && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="border border-[#1F2A44] rounded-xl bg-[#141C2F] overflow-hidden w-full max-w-lg mt-1"
                    >
                      {/* Widget Header */}
                      <div className="px-4 py-2 bg-[#0D1325]/60 border-b border-[#1F2A44] flex items-center justify-between">
                        <span className="text-xs font-semibold text-[#FBBF24] flex items-center gap-1.5">
                          <Clock size={12} /> Low stock — live view
                        </span>
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-950/40 text-[#FBBF24] font-mono font-bold tracking-wider uppercase">
                          Auto-refreshed
                        </span>
                      </div>

                      {/* Widget Table */}
                      <div className="p-2 overflow-x-auto">
                        <table className="w-full text-left border-collapse text-[11px]">
                          <thead>
                            <tr className="border-b border-[#1F2A44]/40 text-[#64748B] font-mono uppercase text-[9px]">
                              <th className="p-2">Product</th>
                              <th className="p-2">Warehouse</th>
                              <th className="p-2 text-right">Qty Left</th>
                              <th className="p-2 text-right">Reorder Pt.</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[#1F2A44]/30 text-[#94A3B8]">
                            {msg.widget.data.map((item: any, i: number) => (
                              <tr key={i} className="hover:bg-[#111827]/40">
                                <td className="p-2 font-semibold text-[#F8FAFC]">
                                  {item.product}
                                </td>
                                <td className="p-2">{item.warehouse}</td>
                                <td className="p-2 text-right font-mono text-red-400 font-semibold">
                                  {item.qtyLeft}
                                </td>
                                <td className="p-2 text-right font-mono">{item.reorderPt}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {/* Widget action row links */}
                      <div className="px-4 py-2.5 bg-[#0D1325]/30 border-t border-[#1F2A44]/60 flex flex-wrap gap-2 justify-start">
                        {msg.widget.actions.map((act: any, i: number) => (
                          <button
                            key={i}
                            onClick={() => triggerLowStockAction(act.actionId)}
                            className="px-2.5 py-1 rounded bg-[#1F2A44] hover:bg-[#4F6FFF] text-[#94A3B8] hover:text-white text-[10px] font-semibold transition-all duration-150 border border-transparent hover:border-[#4F6FFF]/30"
                          >
                            {act.actionId === "notify_manager" ? "✉ " : act.actionId === "supplier_leads" ? "🕐 " : "+ "}
                            {act.label}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Typing Animation Loader */}
          {isGeneratingResponse && (
            <div className="flex gap-4 mr-auto text-left max-w-md">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#6C63FF] to-[#4F6FFF] text-white flex items-center justify-center text-xs shrink-0 shadow">
                <Sparkles size={13} />
              </div>
              <div className="flex flex-col gap-2">
                <div className="rounded-2xl px-4 py-3 bg-[#141C2F]/70 border border-[#1F2A44]/60 text-[#64748B] flex items-center gap-1.5 h-9 w-16 justify-center">
                  <span className="w-1.5 h-1.5 bg-[#4F6FFF] rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-1.5 h-1.5 bg-[#4F6FFF] rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-1.5 h-1.5 bg-[#4F6FFF] rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested prompts row + custom text input */}
        <div className="p-6 border-t border-[#1F2A44] bg-[#0A1020] shrink-0">
          {/* Prompt chips */}
          <div className="flex flex-wrap items-center gap-2 mb-4 justify-start max-w-3xl mx-auto">
            {suggestedPrompts.map((p) => (
              <button
                key={p}
                onClick={() => handleSend(p)}
                className="px-3 py-1.5 rounded-full bg-[#111827]/80 hover:bg-[#141C2F] border border-[#1F2A44] text-xs font-semibold text-[#94A3B8] hover:text-[#F8FAFC] transition-colors duration-150"
              >
                {p}
              </button>
            ))}
          </div>

          {/* Custom Input Wrapper */}
          <div className="max-w-3xl mx-auto relative flex items-center rounded-xl bg-[#111827] border border-[#1F2A44] focus-within:border-[#4F6FFF] focus-within:ring-1 focus-within:ring-[#4F6FFF] pl-4 pr-2 py-2 transition-all duration-150">
            {/* Soft Diamond Icon representing Corvus ERP Command Centre */}
            <div className="w-5 h-5 rounded rotate-45 border-2 border-[#64748B] shrink-0 mr-3 flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-[#64748B] rounded-sm" />
            </div>

            <input
              type="text"
              placeholder="Ask Corvus about your operations..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              className="flex-1 bg-transparent text-xs text-[#F8FAFC] placeholder-[#64748B] focus:outline-none"
            />

            <button
              onClick={() => handleSend()}
              disabled={isGeneratingResponse || !input.trim()}
              className="w-8 h-8 rounded-lg bg-[#4F6FFF] hover:bg-[#5B7DFF] text-white flex items-center justify-center transition-all duration-150 shrink-0 shadow-md disabled:bg-[#1F2A44] disabled:text-[#64748B] disabled:cursor-not-allowed"
            >
              <Send size={13} className="ml-0.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
