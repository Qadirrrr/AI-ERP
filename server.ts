import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini Client Lazily to prevent crash if key is missing on startup
let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    try {
      aiClient = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
    } catch (e) {
      console.error("Failed to initialize Gemini AI client", e);
    }
  }
  return aiClient;
}

// API Routes
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// Chat API leveraging the server-side Gemini API
app.post("/api/chat", async (req, res) => {
  const { messages, contextData } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Messages array is required." });
  }

  const userMessage = messages[messages.length - 1]?.content || "";

  // Prepare fallback simulation answers for instant responsive interaction if no Gemini key
  const normalizedMsg = userMessage.toLowerCase();
  let fallbackText = "";
  let fallbackWidget: any = null;

  if (normalizedMsg.includes("low stock") || normalizedMsg.includes("reorder") || normalizedMsg.includes("stock")) {
    fallbackText = `Found **7 items** below reorder point across 3 warehouses. Cold-chain SKUs in the West warehouse need attention first — lead time there is 11 days.

Here is a live view of key critical items:`;
    fallbackWidget = {
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
    };
  } else if (normalizedMsg.includes("order") || normalizedMsg.includes("revenue") || normalizedMsg.includes("sales")) {
    fallbackText = `Today's revenue stands at **$18,420** across 12 orders. Gross margins are holding steady at **42.8%** which is 2.1 pts higher than Q2. 

Our main delay risk is **#ORD-8839** from Northwind Supply due to container shipping backlogs.`;
    fallbackWidget = {
      type: "orders_widget",
      data: [
        { id: "#ORD-8841", customer: "Bluefield Retail", items: "12 items", status: "Fulfilled", amount: 4280 },
        { id: "#ORD-8840", customer: "Harmon & Co.", items: "3 items", status: "Processing", amount: 980 },
        { id: "#ORD-8839", customer: "Northwind Supply", items: "27 items", status: "Delayed", amount: 12650 }
      ]
    };
  } else {
    fallbackText = `I am Corvus AI, your enterprise ERP copilot. I am connected directly to your Inventory, Orders, Finance, and Reports data. 

How can I help you today? You can ask me to:
- Show products running low on stock
- Summarize today's active orders
- Analyze gross margin or revenue dips`;
  }

  const client = getAiClient();
  if (client) {
    try {
      // Build a comprehensive, high-context system instruction for Corvus AI
      const systemInstruction = `You are "Corvus AI Copilot", an elite ERP AI assistant connected to the Meridian Goods Co. workspace (Inventory, Orders, Finance, and Reports).
Context of current ERP State:
- Products: ${JSON.stringify(contextData?.products || [])}
- Orders: ${JSON.stringify(contextData?.orders || [])}
- Reports Metadata: Gross Margin: 42.8%, Average fulfillment time: 1.8 days, Return rate: 2.4%.
- Expenses: Logistics: 46% ($318k), Warehousing: 28%, Staffing: 26%.

RULES:
1. Always be professional, clear, succinct, and data-driven.
2. If the user asks for low stock or items below reorder point, talk about "Chilled Oat Base 1L" with 18 units in West, "Insulated Shipping Box M" with 64 units in West, and "Vacuum Seal Roll 40cm" with 112 units in Central.
3. You can format responses using markdown.
4. If appropriate, insert a JSON block at the end of your response starting with \`\`\`json-widget to request the UI to render an interactive ERP widget.
Example of a JSON widget format for low stock:
\`\`\`json-widget
{
  "type": "low_stock_table",
  "data": [
    {"product": "Chilled Oat Base 1L", "warehouse": "West", "qtyLeft": 18, "reorderPt": 120, "sku": "SKU-10432"},
    {"product": "Insulated Shipping Box M", "warehouse": "West", "qtyLeft": 64, "reorderPt": 300, "sku": "SKU-22981"},
    {"product": "Vacuum Seal Roll 40cm", "warehouse": "Central", "qtyLeft": 112, "reorderPt": 250, "sku": "SKU-30044"}
  ],
  "actions": [
    {"label": "Create purchase order", "actionId": "create_po"},
    {"label": "Notify warehouse manager", "actionId": "notify_manager"},
    {"label": "Show supplier lead times", "actionId": "supplier_leads"}
  ]
}
\`\`\`
Do not output other code blocks unless requested. Keep the widget JSON clean and compliant.`;

      // Structure conversation history for the SDK
      const contents = messages.map((m: any) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      }));

      const result = await client.models.generateContent({
        model: "gemini-3.5-flash",
        contents,
        config: {
          systemInstruction,
          temperature: 0.2,
        },
      });

      const responseText = result.text || "";
      
      // Parse if there's any custom json-widget block
      let finalResponseText = responseText;
      let widgetData: any = null;

      const widgetMatch = responseText.match(/```json-widget\s*([\s\S]*?)\s*```/);
      if (widgetMatch) {
        try {
          widgetData = JSON.parse(widgetMatch[1]);
          // Clean up the text response from displaying the raw widget block
          finalResponseText = responseText.replace(/```json-widget\s*[\s\S]*?\s*```/, "").trim();
        } catch (e) {
          console.error("Failed to parse json-widget block from Gemini response", e);
        }
      } else {
        // If the model responded with low stock but forgot the widget, append the fallback widget for perfect visual reproduction
        if (normalizedMsg.includes("low stock") || normalizedMsg.includes("reorder") || normalizedMsg.includes("stock")) {
          widgetData = fallbackWidget;
        }
      }

      return res.json({
        content: finalResponseText,
        widget: widgetData || null,
        poweredBy: "gemini",
      });
    } catch (err: any) {
      console.error("Gemini API call failed, using high-fidelity fallback.", err);
      // Fallback gracefully so the UI is completely robust and never breaks
      return res.json({
        content: fallbackText,
        widget: fallbackWidget,
        poweredBy: "fallback-simulator",
        errorInfo: err.message,
      });
    }
  } else {
    // Return high-fidelity simulated response if API key is not configured
    return res.json({
      content: fallbackText,
      widget: fallbackWidget,
      poweredBy: "local-simulator",
    });
  }
});

// Vite + Static Serving setup
async function setupServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server successfully started on http://0.0.0.0:${PORT}`);
  });
}

setupServer();
