import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { Sparkles, Eye, EyeOff, ShieldCheck, Mail, Lock, ArrowRight, User } from "lucide-react";
import { motion } from "motion/react";
import { landingStats, landingChartData } from "../data";

export const LandingPage: React.FC = () => {
  const { setIsLoggedIn, setCurrentPage, registeredUsers, setRegisteredUsers, setUser } = useApp();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("hannah.osei@meridiangoods.com");
  const [password, setPassword] = useState("password123456");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState("Operations Director");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (mode === "signin") {
      const found = registeredUsers.find(
        (u) => u.email.toLowerCase().trim() === email.toLowerCase().trim() && u.password === password
      );

      if (found) {
        setUser({
          name: found.name,
          email: found.email,
          role: found.email === "hannah.osei@meridiangoods.com" ? "Ops Manager" : "Administrator",
          avatar: found.name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2) || "US"
        });
        setIsLoggedIn(true);
        setCurrentPage("dashboard");
      } else {
        setErrorMessage("Invalid email or password. Try signing up or check credentials.");
      }
    } else {
      // Sign Up mode
      if (!fullName.trim() || !email.trim() || !password.trim()) {
        setErrorMessage("All fields are required.");
        return;
      }

      const exists = registeredUsers.some(
        (u) => u.email.toLowerCase().trim() === email.toLowerCase().trim()
      );

      if (exists) {
        setErrorMessage("Email is already registered. Please sign in instead.");
        return;
      }

      const newUser = {
        name: fullName.trim(),
        email: email.toLowerCase().trim(),
        password: password,
      };

      setRegisteredUsers((prev) => [...prev, newUser]);
      setUser({
        name: newUser.name,
        email: newUser.email,
        role: role || "Administrator",
        avatar: newUser.name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2) || "US"
      });

      setIsLoggedIn(true);
      setCurrentPage("dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-[#0A1020] text-[#F8FAFC] flex items-center justify-center relative overflow-hidden px-4 py-8 md:px-12 lg:px-16">
      {/* Decorative background grid and glowing orbs */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#141C2F_1px,transparent_1px),linear-gradient(to_bottom,#141C2F_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-[#4F6FFF]/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-[#6C63FF]/10 blur-[120px] pointer-events-none" />

      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center relative z-10">
        {/* LEFT COLUMN - Marketing and Product Mockup */}
        <div className="lg:col-span-7 flex flex-col text-left">
          {/* Logo */}
          <div className="flex items-center gap-2.5 mb-14">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#4F6FFF] to-[#6C63FF] flex items-center justify-center text-white font-extrabold shadow-md">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 20h18L12 4z" />
              </svg>
            </div>
            <span className="font-display font-bold text-xl text-white tracking-tight">Corvus</span>
          </div>

          {/* Heading */}
          <h2 className="text-4xl md:text-5xl font-display font-extrabold tracking-tight text-white mb-6 leading-[1.15]">
            Run every operation from <span className="text-[#4F6FFF] bg-clip-text">one command center.</span>
          </h2>

          {/* Description */}
          <p className="text-sm md:text-base text-[#94A3B8] leading-relaxed max-w-lg mb-10">
            Inventory, orders, finance and your people — unified in a single workspace, with an AI copilot that already knows your data.
          </p>

          {/* Statistics Row */}
          <div className="grid grid-cols-3 gap-6 border-b border-[#1F2A44]/60 pb-8 mb-10">
            {landingStats.map((stat, i) => (
              <div key={i} className="flex flex-col">
                <span className="text-2xl md:text-3xl font-display font-extrabold text-white tracking-tight">
                  {stat.value}
                </span>
                <span className="text-[10px] font-mono tracking-widest text-[#64748B] uppercase mt-1">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>

          {/* Bottom Analytics Chart Mockup matching Page 1 */}
          <div className="w-full max-w-md p-5 rounded-2xl bg-[#141C2F]/80 border border-[#1F2A44] relative shadow-2xl backdrop-blur-md">
            {/* Built-in Floating badge */}
            <div className="absolute -top-3 right-4 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold text-[10px] flex items-center gap-1.5 shadow-lg border border-amber-400/40">
              <Sparkles size={11} />
              <span>AI Copilot built-in</span>
              <span className="text-white/80 font-mono font-bold">+18.2%</span>
            </div>

            <div className="flex flex-col text-left mb-5">
              <span className="text-[10px] font-mono tracking-wider text-[#64748B] uppercase">
                Revenue — last 6 months
              </span>
            </div>

            {/* Simulated bar chart items */}
            <div className="flex items-end justify-between gap-3 h-20 px-2 mt-4">
              {landingChartData.map((data, idx) => {
                const heightVal = `${data.value}%`;
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
                    <div className="w-full bg-[#1F2A44]/40 hover:bg-[#4F6FFF]/30 rounded-t h-20 flex items-end overflow-hidden transition-colors">
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: heightVal }}
                        transition={{ delay: idx * 0.1, duration: 0.8 }}
                        className="w-full bg-[#4F6FFF] rounded-t"
                      />
                    </div>
                    <span className="text-[10px] font-mono text-[#64748B] group-hover:text-[#94A3B8] transition-colors">
                      {data.month}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN - Glass Login Card */}
        <div className="lg:col-span-5 flex justify-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-md bg-[#141C2F] border border-[#1F2A44] rounded-2xl p-8 shadow-2xl flex flex-col text-left relative overflow-hidden backdrop-blur-lg"
          >
            {/* Header branding */}
            <div className="flex items-center gap-2 mb-6 text-[#94A3B8]">
              <div className="w-5 h-5 rounded bg-[#4F6FFF]/20 flex items-center justify-center text-[#4F6FFF]">
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3.5"
                >
                  <path d="M3 20h18L12 4z" />
                </svg>
              </div>
              <span className="text-xs font-semibold tracking-wider font-mono text-[#4F6FFF]">
                CORVUS ERP
              </span>
            </div>

            <h3 className="text-2xl font-display font-extrabold text-white mb-1">
              {mode === "signin" ? "Welcome back" : "Create workspace"}
            </h3>
            <p className="text-xs text-[#64748B] mb-8">
              {mode === "signin"
                ? "Sign in to continue to your workspace."
                : "Register a secure administrator profile."}
            </p>

            {errorMessage && (
              <div className="mb-4 p-3 rounded-lg bg-red-950/40 border border-red-900/60 text-red-400 text-xs font-semibold leading-relaxed">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              {mode === "signup" && (
                <>
                  <div>
                    <label className="block text-[11px] font-mono tracking-wider text-[#64748B] uppercase mb-1.5">
                      Full Name
                    </label>
                    <div className="relative">
                      <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B]" />
                      <input
                        type="text"
                        required
                        placeholder="Hannah Osei"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full bg-[#0D1325] border border-[#1F2A44] rounded-lg pl-9 pr-3 py-2 text-xs text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:border-[#4F6FFF] transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono tracking-wider text-[#64748B] uppercase mb-1.5">
                      Operations Role
                    </label>
                    <div className="relative">
                      <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B]" />
                      <input
                        type="text"
                        placeholder="Operations Director"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="w-full bg-[#0D1325] border border-[#1F2A44] rounded-lg pl-9 pr-3 py-2 text-xs text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:border-[#4F6FFF] transition-all"
                      />
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="block text-[11px] font-mono tracking-wider text-[#64748B] uppercase mb-1.5">
                  Work email
                </label>
                <div className="relative">
                  <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B]" />
                  <input
                    type="email"
                    required
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#0D1325] border border-[#1F2A44] rounded-lg pl-9 pr-3 py-2 text-xs text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:border-[#4F6FFF] transition-all"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1.5">
                  <label className="block text-[11px] font-mono tracking-wider text-[#64748B] uppercase">
                    Password
                  </label>
                </div>
                <div className="relative">
                  <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B]" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="•••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[#0D1325] border border-[#1F2A44] rounded-lg pl-9 pr-10 py-2 text-xs text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:border-[#4F6FFF] transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#94A3B8]"
                  >
                    {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>

              {mode === "signin" && (
                <div className="flex items-center justify-between text-xs pt-1.5 pb-2">
                  <label className="flex items-center gap-2 cursor-pointer text-[#94A3B8] select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded bg-[#0D1325] border-[#1F2A44] text-[#4F6FFF] focus:ring-0 cursor-pointer"
                    />
                    <span>Remember me</span>
                  </label>
                  <a
                    href="#forgot"
                    onClick={(e) => {
                      e.preventDefault();
                      alert("Instructions to reset password have been sent to your registered domain workspace.");
                    }}
                    className="text-[#4F6FFF] hover:text-[#5B7DFF] font-semibold"
                  >
                    Forgot password?
                  </a>
                </div>
              )}

              {/* Submit CTA button */}
              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-lg bg-[#4F6FFF] hover:bg-[#5B7DFF] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all"
              >
                <span>{mode === "signin" ? "Sign in" : "Complete Registration"}</span>
                <ArrowRight size={14} />
              </button>

              <div className="relative my-6 flex items-center justify-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#1F2A44]/60"></div>
                </div>
                <span className="relative bg-[#141C2F] px-3 text-[10px] font-mono text-[#64748B] uppercase">
                  or continue with
                </span>
              </div>

              {/* Single Sign On button */}
              <button
                type="button"
                onClick={() => {
                  setUser({
                    name: "Hannah Osei",
                    email: "hannah.osei@meridiangoods.com",
                    role: "Ops Manager",
                    avatar: "HO"
                  });
                  setIsLoggedIn(true);
                  setCurrentPage("dashboard");
                }}
                className="w-full py-2 px-4 rounded-lg border border-[#1F2A44] bg-transparent hover:bg-[#111827] text-[#94A3B8] hover:text-[#F8FAFC] text-xs font-semibold flex items-center justify-center gap-2 transition-all"
              >
                <ShieldCheck size={14} className="text-[#4F6FFF]" />
                <span>Single sign-on (SSO)</span>
              </button>
            </form>

            {/* Warning Announcement built into Screen 1 login card */}
            <div className="mt-6 p-3.5 rounded-xl bg-amber-950/20 border border-amber-900/30 flex items-start gap-2.5">
              <Sparkles size={14} className="text-[#FBBF24] shrink-0 mt-0.5 animate-pulse" />
              <p className="text-[11px] text-[#FBBF24]/95 leading-normal">
                <strong>New</strong> — ask Corvus AI to summarize what changed overnight, right after you sign in.
              </p>
            </div>

            <div className="mt-8 text-center text-xs text-[#64748B]">
              <span>
                {mode === "signin" ? "Don't have a workspace? " : "Already have a workspace? "}
              </span>
              <button
                onClick={() => {
                  setErrorMessage("");
                  setMode(mode === "signin" ? "signup" : "signin");
                }}
                className="text-[#4F6FFF] hover:text-[#5B7DFF] font-semibold underline bg-transparent border-none cursor-pointer"
              >
                {mode === "signin" ? "Create one free" : "Sign in here"}
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
