import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { Search, Plus, Box, ShieldAlert, CheckCircle, PackageOpen, X } from "lucide-react";
import { Product } from "../../data";

export const InventoryTable: React.FC = () => {
  const {
    products,
    setProducts,
    selectedInventoryProduct,
    setSelectedInventoryProduct,
    triggerLowStockAction,
  } = useApp();

  const [activeTab, setActiveTab] = useState<"all" | "category" | "warehouse" | "low_stock">("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedWarehouse, setSelectedWarehouse] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New item form state
  const [newName, setNewName] = useState("");
  const [newSku, setNewSku] = useState("");
  const [newCategory, setNewCategory] = useState("Beverages");
  const [newWarehouse, setNewWarehouse] = useState("West");
  const [newStock, setNewStock] = useState("");
  const [newMaxStock, setNewMaxStock] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newSupplier, setNewSupplier] = useState("");

  // Filtering logic
  const filteredProducts = products.filter((p) => {
    // Search query matches SKU or name
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase());

    // Tab active filters
    let matchesTab = true;
    if (activeTab === "low_stock") {
      matchesTab = p.stock < p.maxStock * 0.3;
    } else if (activeTab === "category" && selectedCategory !== "All") {
      matchesTab = p.category === selectedCategory;
    } else if (activeTab === "warehouse" && selectedWarehouse !== "All") {
      matchesTab = p.warehouse === selectedWarehouse;
    }

    return matchesSearch && matchesTab;
  });

  // Get status badge classes
  const getStatusStyle = (status: string) => {
    switch (status) {
      case "In stock":
        return "bg-emerald-950/80 text-[#2DD4BF] border-emerald-800/50";
      case "Low stock":
        return "bg-amber-950/60 text-[#FBBF24] border-amber-800/40";
      case "Backorder":
        return "bg-rose-950/80 text-[#EF4444] border-rose-800/40";
      case "Reorder soon":
        return "bg-indigo-950/60 text-[#4F6FFF] border-indigo-800/40";
      default:
        return "bg-gray-800 text-gray-400 border-gray-700";
    }
  };

  const categories = ["All", "Beverages", "Packaging", "Foodservice"];
  const warehouses = ["All", "West", "Central", "East"];

  // Add Item handler
  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newSku || !newStock || !newMaxStock || !newPrice) {
      alert("Please fill in all required fields");
      return;
    }

    const stockNum = parseInt(newStock);
    const maxStockNum = parseInt(newMaxStock);
    let status: Product["status"] = "In stock";
    if (stockNum === 0) status = "Backorder";
    else if (stockNum < maxStockNum * 0.3) status = "Low stock";
    else if (stockNum < maxStockNum * 0.5) status = "Reorder soon";

    const newProduct: Product = {
      sku: newSku.toUpperCase(),
      name: newName,
      category: newCategory,
      warehouse: newWarehouse,
      stock: stockNum,
      maxStock: maxStockNum,
      status,
      price: parseFloat(newPrice),
      supplier: newSupplier || "Direct Wholesale Hub",
      weeklyVelocity: Math.floor(50 + Math.random() * 200),
      daysOfCover: parseFloat(((stockNum / (50 + Math.random() * 100)) * 7).toFixed(1)),
      leadTime: Math.floor(3 + Math.random() * 10),
    };

    setProducts((prev) => [newProduct, ...prev]);
    setSelectedInventoryProduct(newProduct);
    setIsAddModalOpen(false);

    // Reset fields
    setNewName("");
    setNewSku("");
    setNewStock("");
    setNewMaxStock("");
    setNewPrice("");
    setNewSupplier("");
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-stretch w-full">
      {/* Left section: Filter controls & table */}
      <div className="flex-1 flex flex-col gap-6">
        {/* Sub-Header controls & tabs */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-[#111827] rounded-lg border border-[#1F2A44]">
            <button
              onClick={() => {
                setActiveTab("all");
                setSelectedCategory("All");
                setSelectedWarehouse("All");
              }}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                activeTab === "all" ? "bg-[#141C2F] text-[#4F6FFF] shadow-sm" : "text-[#94A3B8] hover:text-[#F8FAFC]"
              }`}
            >
              All items <span className="font-mono text-[10px] ml-1 text-[#64748B]">{products.length}</span>
            </button>

            {/* Category selection */}
            <div className="relative">
              <button
                onClick={() => setActiveTab("category")}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1 ${
                  activeTab === "category" ? "bg-[#141C2F] text-[#4F6FFF]" : "text-[#94A3B8]"
                }`}
              >
                Category {selectedCategory !== "All" && `: ${selectedCategory}`}
              </button>
              {activeTab === "category" && (
                <div className="absolute left-0 mt-2 w-36 bg-[#141C2F] border border-[#1F2A44] rounded-lg shadow-xl py-1 z-30">
                  {categories.map((c) => (
                    <button
                      key={c}
                      onClick={() => {
                        setSelectedCategory(c);
                        setActiveTab("category");
                      }}
                      className="w-full text-left px-3 py-1.5 text-xs text-[#94A3B8] hover:bg-[#111827] hover:text-[#F8FAFC]"
                    >
                      {c}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Warehouse selection */}
            <div className="relative">
              <button
                onClick={() => setActiveTab("warehouse")}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1 ${
                  activeTab === "warehouse" ? "bg-[#141C2F] text-[#4F6FFF]" : "text-[#94A3B8]"
                }`}
              >
                Warehouse {selectedWarehouse !== "All" && `: ${selectedWarehouse}`}
              </button>
              {activeTab === "warehouse" && (
                <div className="absolute left-0 mt-2 w-36 bg-[#141C2F] border border-[#1F2A44] rounded-lg shadow-xl py-1 z-30">
                  {warehouses.map((w) => (
                    <button
                      key={w}
                      onClick={() => {
                        setSelectedWarehouse(w);
                        setActiveTab("warehouse");
                      }}
                      className="w-full text-left px-3 py-1.5 text-xs text-[#94A3B8] hover:bg-[#111827] hover:text-[#F8FAFC]"
                    >
                      {w}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => setActiveTab("low_stock")}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                activeTab === "low_stock" ? "bg-amber-950/40 text-[#FBBF24]" : "text-[#94A3B8]"
              }`}
            >
              ⚠ Low stock only
            </button>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {/* Search filter input */}
            <div className="relative flex-1 sm:flex-none">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B]" />
              <input
                type="text"
                placeholder="Search SKU, name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#111827] border border-[#1F2A44] rounded-lg pl-8 pr-3 py-1.5 text-xs text-[#F8FAFC] placeholder-[#64748B] focus:outline-none"
              />
            </div>

            {/* Add Item Trigger */}
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#4F6FFF] hover:bg-[#5B7DFF] text-xs font-semibold text-white transition-all shrink-0"
            >
              <Plus size={14} />
              <span>Add item</span>
            </button>
          </div>
        </div>

        {/* Inventory list items table */}
        <div className="w-full overflow-x-auto rounded-[24px] border border-[#1F2A44] bg-[#141C2F] shadow-[0_10px_40px_rgba(0,0,0,0.3)]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#1F2A44] bg-[#0D1325]/40 text-[10px] font-mono tracking-wider text-[#64748B] uppercase">
                <th className="py-3 px-4 font-semibold">Product</th>
                <th className="py-3 px-4 font-semibold">Category</th>
                <th className="py-3 px-4 font-semibold">Warehouse</th>
                <th className="py-3 px-4 font-semibold">Stock</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold text-right">Unit Price</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1F2A44]/30 text-xs text-[#94A3B8]">
              {filteredProducts.map((product) => {
                const isSelected = selectedInventoryProduct?.sku === product.sku;
                const stockPct = Math.min((product.stock / product.maxStock) * 100, 100);
                const isLow = product.stock < product.maxStock * 0.3;

                return (
                  <tr
                    key={product.sku}
                    onClick={() => setSelectedInventoryProduct(product)}
                    className={`cursor-pointer transition-all duration-150 ${
                      isSelected ? "bg-[#141C2F] border-l-2 border-[#4F6FFF] text-white" : "hover:bg-[#111827]/40"
                    }`}
                  >
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded bg-[#111827] border border-[#1F2A44] text-[#64748B] shrink-0">
                          <Box size={14} />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-semibold text-sm text-[#F8FAFC] group-hover:text-white leading-tight">
                            {product.name}
                          </span>
                          <span className="font-mono text-[10px] text-[#64748B] mt-0.5 uppercase tracking-wider">
                            {product.sku}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">{product.category}</td>
                    <td className="py-3.5 px-4">
                      <span className="font-medium text-[#F8FAFC]/90">{product.warehouse}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex flex-col gap-1 w-24">
                        <div className="flex items-center justify-between text-[10px] font-mono">
                          <span className="font-bold text-[#F8FAFC]">
                            {product.stock.toLocaleString()}
                          </span>
                          <span className="text-[#64748B]">/ {product.maxStock}</span>
                        </div>
                        <div className="h-1 w-full bg-[#111827] rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${isLow ? "bg-red-500" : "bg-[#2DD4BF]"}`}
                            style={{ width: `${stockPct}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold border ${getStatusStyle(product.status)}`}>
                        {product.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono text-[#F8FAFC] font-semibold">
                      ${product.price.toFixed(2)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Right section: Detailed view panel */}
      {selectedInventoryProduct && (
        <div className="w-full lg:w-80 shrink-0 flex flex-col gap-5 border border-[#1F2A44] bg-[#141C2F] rounded-[24px] p-6 text-left h-fit self-start shadow-[0_10px_40px_rgba(0,0,0,0.3)]">
          {/* Box Illustration mockup */}
          <div className="w-full h-32 rounded-xl bg-[#0D1325]/80 border border-[#1F2A44]/60 flex items-center justify-center text-[#64748B]">
            <PackageOpen size={48} className="stroke-[1.2]" />
          </div>

          <div className="flex flex-col gap-1">
            <h3 className="font-display font-bold text-lg text-[#F8FAFC]">
              {selectedInventoryProduct.name}
            </h3>
            <p className="text-xs text-[#64748B] flex items-center gap-1.5 uppercase tracking-wider font-mono">
              <span>{selectedInventoryProduct.sku}</span>
              <span className="h-1 w-1 bg-[#1F2A44] rounded-full" />
              <span>{selectedInventoryProduct.category}</span>
            </p>
          </div>

          {/* Quantity progress visual card */}
          <div className="p-3 bg-[#0D1325]/50 border border-[#1F2A44]/40 rounded-xl">
            <div className="flex justify-between items-center text-xs text-[#94A3B8] mb-1">
              <span>Stock level</span>
              <span className="font-mono">
                {selectedInventoryProduct.stock} of {selectedInventoryProduct.maxStock} min
              </span>
            </div>
            <div className="h-2 w-full bg-[#111827] rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${
                  selectedInventoryProduct.stock < selectedInventoryProduct.maxStock * 0.3
                    ? "bg-red-500"
                    : "bg-[#2DD4BF]"
                }`}
                style={{
                  width: `${Math.min(
                    (selectedInventoryProduct.stock / selectedInventoryProduct.maxStock) * 100,
                    100
                  )}%`,
                }}
              />
            </div>
          </div>

          {/* Product metric detail checklist */}
          <div className="space-y-3.5 text-xs text-[#94A3B8]">
            <div className="flex justify-between py-1 border-b border-[#1F2A44]/40">
              <span>Warehouse</span>
              <span className="text-[#F8FAFC] font-semibold">
                {selectedInventoryProduct.warehouse} Distribution Hub
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#1F2A44]/40">
              <span>Unit price</span>
              <span className="text-[#F8FAFC] font-semibold font-mono">
                ${selectedInventoryProduct.price.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#1F2A44]/40">
              <span>Weekly velocity</span>
              <span className="text-[#F8FAFC] font-semibold">
                {selectedInventoryProduct.weeklyVelocity || 142} units
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#1F2A44]/40">
              <span>Days of cover</span>
              <span
                className={`font-semibold ${
                  (selectedInventoryProduct.daysOfCover || 15) < 3
                    ? "text-[#EF4444]"
                    : "text-[#2DD4BF]"
                }`}
              >
                {selectedInventoryProduct.daysOfCover || 1.3} days
              </span>
            </div>

            {/* Supplier Information section */}
            {selectedInventoryProduct.supplier && (
              <div className="pt-2">
                <p className="text-[10px] font-mono tracking-wider text-[#64748B] uppercase mb-1.5">
                  Primary Supplier
                </p>
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#0D1325]/40 border border-[#1F2A44]">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#6C63FF]" />
                  <div className="flex flex-col leading-tight">
                    <span className="text-xs text-[#F8FAFC] font-semibold">
                      {selectedInventoryProduct.supplier}
                    </span>
                    <span className="text-[10px] text-[#64748B]">
                      Lead time: {selectedInventoryProduct.leadTime || 11} days
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action trigger reorder button */}
          <button
            onClick={() => triggerLowStockAction("create_po")}
            className="w-full text-center py-2.5 rounded-xl bg-[#4F6FFF] hover:bg-[#5B7DFF] text-white text-xs font-semibold transition-all shadow-md mt-2"
          >
            Create purchase order
          </button>
        </div>
      )}

      {/* Add Item Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-[#0A1020]/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#141C2F] border border-[#1F2A44] w-full max-w-md rounded-2xl shadow-2xl p-6 relative animate-in zoom-in duration-150">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute right-4 top-4 text-[#64748B] hover:text-[#F8FAFC]"
            >
              <X size={18} />
            </button>

            <h3 className="text-lg font-display font-bold text-[#F8FAFC] mb-4">
              Add New Product
            </h3>

            <form onSubmit={handleAddItem} className="space-y-4 text-left">
              <div>
                <label className="block text-[11px] font-mono tracking-wider text-[#64748B] uppercase mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Organic Oatmilk Base"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-[#0D1325] border border-[#1F2A44] rounded-lg px-3 py-2 text-xs text-[#F8FAFC] focus:outline-none focus:border-[#4F6FFF]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-mono tracking-wider text-[#64748B] uppercase mb-1">
                    SKU code *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. SKU-12093"
                    value={newSku}
                    onChange={(e) => setNewSku(e.target.value)}
                    className="w-full bg-[#0D1325] border border-[#1F2A44] rounded-lg px-3 py-2 text-xs text-[#F8FAFC] focus:outline-none focus:border-[#4F6FFF]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono tracking-wider text-[#64748B] uppercase mb-1">
                    Category
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full bg-[#0D1325] border border-[#1F2A44] rounded-lg px-3 py-2 text-xs text-[#F8FAFC] focus:outline-none"
                  >
                    <option value="Beverages">Beverages</option>
                    <option value="Packaging">Packaging</option>
                    <option value="Foodservice">Foodservice</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-mono tracking-wider text-[#64748B] uppercase mb-1">
                    Initial Stock *
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="0"
                    value={newStock}
                    onChange={(e) => setNewStock(e.target.value)}
                    className="w-full bg-[#0D1325] border border-[#1F2A44] rounded-lg px-3 py-2 text-xs text-[#F8FAFC] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono tracking-wider text-[#64748B] uppercase mb-1">
                    Max Stock *
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="100"
                    value={newMaxStock}
                    onChange={(e) => setNewMaxStock(e.target.value)}
                    className="w-full bg-[#0D1325] border border-[#1F2A44] rounded-lg px-3 py-2 text-xs text-[#F8FAFC] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-mono tracking-wider text-[#64748B] uppercase mb-1">
                    Unit Price ($) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="0.00"
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    className="w-full bg-[#0D1325] border border-[#1F2A44] rounded-lg px-3 py-2 text-xs text-[#F8FAFC] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono tracking-wider text-[#64748B] uppercase mb-1">
                    Warehouse
                  </label>
                  <select
                    value={newWarehouse}
                    onChange={(e) => setNewWarehouse(e.target.value)}
                    className="w-full bg-[#0D1325] border border-[#1F2A44] rounded-lg px-3 py-2 text-xs text-[#F8FAFC] focus:outline-none"
                  >
                    <option value="West">West</option>
                    <option value="Central">Central</option>
                    <option value="East">East</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono tracking-wider text-[#64748B] uppercase mb-1">
                  Supplier Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Northfield Dairy Co."
                  value={newSupplier}
                  onChange={(e) => setNewSupplier(e.target.value)}
                  className="w-full bg-[#0D1325] border border-[#1F2A44] rounded-lg px-3 py-2 text-xs text-[#F8FAFC] focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-[#1F2A44] hover:bg-[#111827] text-xs text-[#94A3B8]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#4F6FFF] hover:bg-[#5B7DFF] text-xs font-semibold text-white transition-all"
                >
                  Create Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
