import React from "react";
import { AppProvider, useApp } from "./context/AppContext";
import { Sidebar } from "./components/layout/Sidebar";
import { Navbar } from "./components/layout/Navbar";
import { LandingPage } from "./pages/LandingPage";
import { DashboardPage } from "./pages/DashboardPage";
import { ChatPage } from "./pages/ChatPage";
import { InventoryPage } from "./pages/InventoryPage";
import { ReportsPage } from "./pages/ReportsPage";
import { OrdersPage } from "./pages/OrdersPage";
import { FinancePage } from "./pages/FinancePage";
import { CustomersPage } from "./pages/CustomersPage";
import { SettingsPage } from "./pages/SettingsPage";
import { motion, AnimatePresence } from "motion/react";

const MainLayout: React.FC = () => {
  const { currentPage, isLoggedIn } = useApp();

  if (!isLoggedIn || currentPage === "landing") {
    return <LandingPage />;
  }

  const renderActivePage = () => {
    switch (currentPage) {
      case "dashboard":
        return <DashboardPage />;
      case "chat":
        return <ChatPage />;
      case "inventory":
        return <InventoryPage />;
      case "reports":
        return <ReportsPage />;
      case "orders":
        return <OrdersPage />;
      case "finance":
        return <FinancePage />;
      case "customers":
        return <CustomersPage />;
      case "settings":
        return <SettingsPage />;
      default:
        return <DashboardPage />;
    }
  };

  const isChat = currentPage === "chat";

  return (
    <div className="flex h-screen bg-[#0A1020] text-[#F8FAFC] overflow-hidden font-sans">
      {/* Collapsible Left Navigation Rail */}
      <Sidebar />

      {/* Main Screen Panel with Header */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <Navbar />

        {/* Selected Viewport */}
        <main className={`flex-1 overflow-y-auto ${isChat ? "p-0" : "p-8"}`}>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="h-full w-full"
            >
              {renderActivePage()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
