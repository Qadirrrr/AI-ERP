import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { User, Shield, Warehouse, Bell, Key, LogOut, Check, Save } from "lucide-react";
import { motion } from "motion/react";

export const SettingsPage: React.FC = () => {
  const { user, setUser, setIsLoggedIn, setCurrentPage } = useApp();

  // Profile Form States
  const [profileName, setProfileName] = useState(user.name);
  const [profileEmail, setProfileEmail] = useState(user.email);
  const [profileRole, setProfileRole] = useState(user.role);

  // Configuration States
  const [allowNotifications, setAllowNotifications] = useState(true);
  const [autoSummarize, setAutoSummarize] = useState(true);
  const [geminiKey, setGeminiKey] = useState("••••••••••••••••••••••••••••••••");
  const [isSaved, setIsSaved] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setUser({
      name: profileName,
      email: profileEmail,
      role: profileRole,
      avatar: profileName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) || "US"
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentPage("landing");
  };

  return (
    <div className="space-y-8 text-left max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white">System Settings</h2>
          <p className="text-sm text-[#64748B]">
            Configure operational profiles, database keys, notifications, and core integrations.
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2.5 bg-red-950/40 border border-red-900/40 hover:bg-red-900/20 text-red-400 rounded-xl text-xs font-bold transition-all"
        >
          <LogOut size={14} />
          <span>Logout of Workspace</span>
        </button>
      </div>

      {isSaved && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-900/30 text-emerald-400 text-xs font-semibold flex items-center gap-2"
        >
          <Check size={16} />
          <span>Profile updated successfully! All sidebar avatars and names are synced in the current state.</span>
        </motion.div>
      )}

      {/* Grid Settings Panels */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Left Side: Profile Information */}
        <div className="md:col-span-7 border border-[#1F2A44] bg-[#141C2F] rounded-[24px] p-6 shadow-lg">
          <div className="flex items-center gap-2.5 mb-6 border-b border-[#1F2A44]/60 pb-4">
            <User className="text-[#4F6FFF]" size={18} />
            <h3 className="text-sm font-semibold text-[#F8FAFC]">Workplace Profile</h3>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-5">
            <div>
              <label className="block text-[10px] font-mono tracking-widest text-[#64748B] uppercase mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                required
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                className="w-full bg-[#0D1325] border border-[#1F2A44] rounded-lg px-3 py-2 text-xs text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:border-[#4F6FFF] transition-all"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono tracking-widest text-[#64748B] uppercase mb-1.5">
                Work Email Address
              </label>
              <input
                type="email"
                required
                value={profileEmail}
                onChange={(e) => setProfileEmail(e.target.value)}
                className="w-full bg-[#0D1325] border border-[#1F2A44] rounded-lg px-3 py-2 text-xs text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:border-[#4F6FFF] transition-all"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono tracking-widest text-[#64748B] uppercase mb-1.5">
                Workspace Role
              </label>
              <input
                type="text"
                required
                value={profileRole}
                onChange={(e) => setProfileRole(e.target.value)}
                className="w-full bg-[#0D1325] border border-[#1F2A44] rounded-lg px-3 py-2 text-xs text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:border-[#4F6FFF] transition-all"
              />
            </div>

            <button
              type="submit"
              className="flex items-center justify-center gap-2 px-4 py-2 bg-[#4F6FFF] hover:bg-[#5B7DFF] text-white rounded-lg text-xs font-bold transition-all"
            >
              <Save size={14} />
              <span>Update Profile State</span>
            </button>
          </form>
        </div>

        {/* Right Side: Integrations and Configurations */}
        <div className="md:col-span-5 flex flex-col gap-8">
          {/* Corvus AI Integration API Keys */}
          <div className="border border-[#1F2A44] bg-[#141C2F] rounded-[24px] p-6 shadow-lg">
            <div className="flex items-center gap-2.5 mb-6 border-b border-[#1F2A44]/60 pb-4">
              <Key className="text-[#4F6FFF]" size={18} />
              <h3 className="text-sm font-semibold text-[#F8FAFC]">API Integrations</h3>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-[10px] font-mono tracking-widest text-[#64748B] uppercase">
                    GEMINI API KEY
                  </label>
                  <span className="text-[9px] font-semibold text-emerald-500 bg-emerald-950/20 px-1.5 py-0.5 rounded font-mono">
                    ACTIVE
                  </span>
                </div>
                <input
                  type="password"
                  disabled
                  value={geminiKey}
                  className="w-full bg-[#0D1325]/50 border border-[#1F2A44] rounded-lg px-3 py-2 text-xs text-[#64748B] cursor-not-allowed font-mono"
                />
                <p className="text-[10px] text-[#64748B] mt-1.5 leading-relaxed">
                  The Gemini API key is managed server-side inside secure environment variables, proxying all copilot requests safely.
                </p>
              </div>
            </div>
          </div>

          {/* Feature toggles */}
          <div className="border border-[#1F2A44] bg-[#141C2F] rounded-[24px] p-6 shadow-lg">
            <div className="flex items-center gap-2.5 mb-6 border-b border-[#1F2A44]/60 pb-4">
              <Bell className="text-[#4F6FFF]" size={18} />
              <h3 className="text-sm font-semibold text-[#F8FAFC]">Preferences</h3>
            </div>

            <div className="space-y-4 text-xs">
              <label className="flex items-center justify-between cursor-pointer select-none">
                <div className="flex flex-col text-left pr-2">
                  <span className="font-semibold text-[#F8FAFC]">Allow stock level notifications</span>
                  <span className="text-[10px] text-[#64748B] mt-0.5">Alerts when items fall below reorder point.</span>
                </div>
                <input
                  type="checkbox"
                  checked={allowNotifications}
                  onChange={(e) => setAllowNotifications(e.target.checked)}
                  className="rounded bg-[#0D1325] border-[#1F2A44] text-[#4F6FFF] focus:ring-0 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer select-none">
                <div className="flex flex-col text-left pr-2">
                  <span className="font-semibold text-[#F8FAFC]">Copilot overnight summary</span>
                  <span className="text-[10px] text-[#64748B] mt-0.5">Summarize inbound logistics changes on login.</span>
                </div>
                <input
                  type="checkbox"
                  checked={autoSummarize}
                  onChange={(e) => setAutoSummarize(e.target.checked)}
                  className="rounded bg-[#0D1325] border-[#1F2A44] text-[#4F6FFF] focus:ring-0 cursor-pointer"
                />
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
