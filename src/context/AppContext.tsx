import React, { createContext, useContext, useState, useEffect } from "react";
import {
  Product,
  Order,
  initialProducts,
  initialOrders,
  conversationHistory,
  initialMetrics,
} from "../data";

export type PageType = "landing" | "dashboard" | "chat" | "inventory" | "reports" | "finance" | "customers" | "settings";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  widget?: any;
}

interface AppContextType {
  currentPage: PageType;
  setCurrentPage: (page: PageType) => void;
  isLoggedIn: boolean;
  setIsLoggedIn: (val: boolean) => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (val: boolean) => void;
  user: {
    name: string;
    email: string;
    role: string;
    avatar: string;
  };
  setUser: React.Dispatch<React.SetStateAction<{ name: string; email: string; role: string; avatar: string }>>;
  registeredUsers: { email: string; password: string; name: string }[];
  setRegisteredUsers: React.Dispatch<React.SetStateAction<{ email: string; password: string; name: string }[]>>;
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  activeChatId: string;
  setActiveChatId: (id: string) => void;
  chats: { id: string; title: string; time: string; active?: boolean }[];
  setChats: React.Dispatch<React.SetStateAction<{ id: string; title: string; time: string; active?: boolean }[]>>;
  messages: Record<string, ChatMessage[]>;
  setMessages: React.Dispatch<React.SetStateAction<Record<string, ChatMessage[]>>>;
  sendMessage: (text: string) => Promise<void>;
  isGeneratingResponse: boolean;
  metrics: typeof initialMetrics;
  setMetrics: React.Dispatch<React.SetStateAction<typeof initialMetrics>>;
  triggerLowStockAction: (actionId: string) => void;
  selectedInventoryProduct: Product | null;
  setSelectedInventoryProduct: (product: Product | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentPage, setCurrentPage] = useState<PageType>("landing");
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(true);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSidebarCollapsed(true);
      } else {
        setSidebarCollapsed(false);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [activeChatId, setActiveChatId] = useState<string>("1");
  const [chats, setChats] = useState(conversationHistory);
  const [isGeneratingResponse, setIsGeneratingResponse] = useState<boolean>(false);
  const [selectedInventoryProduct, setSelectedInventoryProduct] = useState<Product | null>(initialProducts[0]);
  const [metrics, setMetrics] = useState<typeof initialMetrics>(initialMetrics);

  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>({
    "1": [
      {
        id: "m1",
        role: "user",
        content: "Which products are running low on stock across all warehouses?",
        timestamp: "2 min ago",
      },
      {
        id: "m2",
        role: "assistant",
        content: "Found **7 items** below reorder point across 3 warehouses. Cold-chain SKUs in the West warehouse need attention first — lead time there is 11 days.",
        timestamp: "2 min ago",
        widget: {
          type: "low_stock_table",
          data: [
            { product: "Chilled Oat Base 1L", warehouse: "West", qtyLeft: 18, reorderPt: 120, sku: "SKU-10432" },
            { product: "Insulated Shipping Box M", warehouse: "West", qtyLeft: 64, reorderPt: 300, sku: "SKU-22981" },
            { product: "Vacuum Seal Roll 40cm", warehouse: "Central", qtyLeft: 112, reorderPt: 250, sku: "SKU-30044" }
          ],
          actions: [
            { label: "Create purchase order", actionId: "create_po" },
            { label: "Notify warehouse manager", actionId: "notify_manager" },
            { label: "Show supplier lead times", actionId: "supplier_leads" }
          ]
        },
      },
    ],
    "2": [
      {
        id: "m3",
        role: "user",
        content: "What's causing the delay in our recent orders?",
        timestamp: "1 hr ago",
      },
      {
        id: "m4",
        role: "assistant",
        content: "The primary delay is with **#ORD-8839** from Northwind Supply. Container congestion at the West Coast port has set back delivery of packaging materials. Estimated customs clearance is Jul 10, 2026.",
        timestamp: "1 hr ago",
      }
    ],
  });

  const [user, setUser] = useState({
    name: "Hannah Osei",
    email: "hannah.osei@meridiangoods.com",
    role: "Ops Manager",
    avatar: "HO",
  });

  const [registeredUsers, setRegisteredUsers] = useState<{ email: string; password: string; name: string }[]>(() => {
    const saved = localStorage.getItem("corvus_registered_users");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return [{ email: "hannah.osei@meridiangoods.com", password: "password123456", name: "Hannah Osei" }];
  });

  useEffect(() => {
    localStorage.setItem("corvus_registered_users", JSON.stringify(registeredUsers));
  }, [registeredUsers]);

  // Keep metrics in sync with products/orders
  useEffect(() => {
    const lowStockCount = products.filter(p => p.stock < p.maxStock * 0.3).length;
    setMetrics(prev => ({
      ...prev,
      lowStock: {
        title: "Low Stock Alerts",
        value: lowStockCount.toString(),
        change: lowStockCount > 5 ? "⚠ Needs reorder" : "✓ Levels normal",
        isPositive: lowStockCount <= 3,
      }
    }));
  }, [products]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    const timestamp = "Just now";
    const userMsgId = `u-${Date.now()}`;
    const assistantMsgId = `a-${Date.now()}`;

    // 1. Add User Message
    const newUserMsg: ChatMessage = {
      id: userMsgId,
      role: "user",
      content: text,
      timestamp,
    };

    setMessages((prev) => ({
      ...prev,
      [activeChatId]: [...(prev[activeChatId] || []), newUserMsg],
    }));

    setIsGeneratingResponse(true);

    try {
      // 2. Query server-side Gemini route
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            ...(messages[activeChatId] || []).map((m) => ({ role: m.role, content: m.content })),
            { role: "user", content: text },
          ],
          contextData: {
            products,
            orders,
          },
        }),
      });

      const data = await response.json();

      const newAssistantMsg: ChatMessage = {
        id: assistantMsgId,
        role: "assistant",
        content: data.content,
        timestamp: "Just now",
        widget: data.widget || undefined,
      };

      setMessages((prev) => ({
        ...prev,
        [activeChatId]: [...(prev[activeChatId] || []), newAssistantMsg],
      }));
    } catch (err) {
      console.error("Error communicating with Corvus AI server:", err);
      // Fallback
      const newAssistantMsg: ChatMessage = {
        id: assistantMsgId,
        role: "assistant",
        content: "I'm having a connection issue with my database context right now. Please verify your connection or try again.",
        timestamp: "Just now",
      };
      setMessages((prev) => ({
        ...prev,
        [activeChatId]: [...(prev[activeChatId] || []), newAssistantMsg],
      }));
    } finally {
      setIsGeneratingResponse(false);
    }
  };

  const triggerLowStockAction = (actionId: string) => {
    if (actionId === "create_po") {
      // Create order for Chilled Oat Base
      const oatBase = products.find(p => p.sku === "SKU-10432");
      if (oatBase) {
        // Mock creating purchase order
        const newOrder: Order = {
          id: `#ORD-${Math.floor(1000 + Math.random() * 9000)}`,
          customer: oatBase.supplier || "Supplier",
          items: "120 items (Reorder)",
          status: "Processing",
          amount: oatBase.price * 120,
          date: "Jul 8, 2026",
        };
        setOrders(prev => [newOrder, ...prev]);
        
        // Update product stock levels simulation
        setProducts(prev => prev.map(p => {
          if (p.sku === "SKU-10432") {
            return { ...p, status: "Reorder soon", stock: p.stock + 60 };
          }
          return p;
        }));

        alert("Successfully created purchase order for Chilled Oat Base 1L! Stock levels will update shortly.");
      }
    } else if (actionId === "notify_manager") {
      alert("Notification sent to West Warehouse Hub Manager regarding Chilled Oat Base and Shipping Boxes!");
    } else if (actionId === "supplier_leads") {
      alert("Supplier Lead Times loaded:\n- Northfield Dairy: 11 Days (Sea-freight)\n- PackCorp: 5 Days (Local Road)\n- SealTech: 8 Days (Air-express)");
    }
  };

  return (
    <AppContext.Provider
      value={{
        currentPage,
        setCurrentPage,
        isLoggedIn,
        setIsLoggedIn,
        sidebarCollapsed,
        setSidebarCollapsed,
        user,
        setUser,
        registeredUsers,
        setRegisteredUsers,
        products,
        setProducts,
        orders,
        setOrders,
        activeChatId,
        setActiveChatId,
        chats,
        setChats,
        messages,
        setMessages,
        sendMessage,
        isGeneratingResponse,
        metrics,
        setMetrics,
        triggerLowStockAction,
        selectedInventoryProduct,
        setSelectedInventoryProduct,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
