"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { PRODUCTS } from "../../../data/products";

export default function InventoryPage() {
  const [search, setSearch] = useState("");
  // Initialize state with products so we can logically mutate stock and visibility on the client
  const [products, setProducts] = useState(PRODUCTS.map(p => ({ ...p, isHidden: false })));

  useEffect(() => {
    fetch("/api/inventory")
      .then(res => res.json())
      .then(data => {
        setProducts(prev => prev.map(p => {
          if (data[p.id]) {
             return { ...p, stock: data[p.id].stock ?? p.stock, isHidden: data[p.id].isHidden ?? false };
          }
          return p;
        }));
      })
      .catch(console.error);
  }, []);

  const handleEdit = async (id: number) => {
    const item = products.find(p => p.id === id);
    if (!item) return;
    
    // Quick stock update prompt mimics the dashboard-new.html behavior
    const newStockRow = prompt(`Update stock for ${item.name}:`, String(item.stock || 0));
    if (newStockRow !== null) {
      const parsedStock = parseInt(newStockRow, 10);
      if (!isNaN(parsedStock)) {
         try {
           await fetch("/api/inventory", {
             method: "PATCH",
             headers: { "Content-Type": "application/json" },
             body: JSON.stringify({ productId: id, stock: parsedStock })
           });
           setProducts(prev => prev.map(p => p.id === id ? { ...p, stock: parsedStock } : p));
         } catch(e) {
           alert("Failed to save stock update.");
         }
      }
    }
  };

  const toggleHide = async (id: number) => {
    const item = products.find(p => p.id === id);
    if (!item) return;

    try {
      await fetch("/api/inventory", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: id, isHidden: !item.isHidden })
      });
      setProducts(prev => prev.map(p => p.id === id ? { ...p, isHidden: !p.isHidden } : p));
    } catch(e) {
       alert("Failed to save visibility toggle.");
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    p.category?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="inventory-view animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 border-b border-slate-200 pb-4">
        <h2 className="text-3xl font-sans font-bold text-[#1a202c]">Stock Inventory</h2>
        <div className="flex w-full md:w-auto gap-3">
          <input 
            type="text" 
            placeholder="Search products..." 
            className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 w-full md:w-64 focus:outline-none focus:border-[#4299e1] focus:ring-1 focus:ring-[#4299e1] transition-shadow placeholder:text-slate-400"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="px-4 py-2 bg-[#4299e1] text-white font-bold rounded-lg hover:bg-[#3182ce] transition-colors whitespace-nowrap shadow-sm">
            + Add New
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-semibold tracking-wider">Product</th>
                <th className="px-6 py-4 font-semibold tracking-wider">Category</th>
                <th className="px-6 py-4 font-semibold tracking-wider">Price</th>
                <th className="px-6 py-4 font-semibold tracking-wider">Stock</th>
                <th className="px-6 py-4 font-semibold tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map(p => (
                <tr key={p.id} className={`border-b border-slate-100 transition-colors ${p.isHidden ? 'bg-slate-50 opacity-60' : 'hover:bg-slate-50'}`}>
                  <td className="px-6 py-4 font-medium text-slate-800 flex items-center gap-4">
                    <div className="w-12 h-12 rounded bg-slate-100 overflow-hidden relative border border-slate-200 shrink-0">
                      <Image src={p.img} alt={p.name} fill className="object-cover" />
                    </div>
                    <div>
                      <span className="truncate max-w-[200px] block font-bold text-[#1a202c]">{p.name}</span>
                      {p.isHidden && <span className="text-[10px] text-red-500 uppercase tracking-widest font-bold">Hidden from website</span>}
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium">{p.category}</td>
                  <td className="px-6 py-4 font-medium">Tk {p.price}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold border ${Number(p.stock) > 5 ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : Number(p.stock) > 0 ? 'bg-amber-50 text-amber-600 border-amber-200' : 'bg-red-50 text-red-600 border-red-200'}`}>
                      {Number(p.stock) > 0 ? `${p.stock} in stock` : 'Out of stock'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => handleEdit(p.id)} className="text-[#4299e1] hover:text-[#3182ce] font-bold transition-colors mr-4">Edit</button>
                    <button onClick={() => toggleHide(p.id)} className={`${p.isHidden ? 'text-emerald-600 hover:text-emerald-500' : 'text-red-500 hover:text-red-600'} font-bold transition-colors`}>
                      {p.isHidden ? 'Unhide' : 'Hide'}
                    </button>
                  </td>
                </tr>
              ))}
              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500 font-medium">
                    No products found matching "{search}"
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
