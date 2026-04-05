"use client";

import { useEffect, useState } from "react";

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"active" | "completed" | "cancelled">("active");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchOrders = () => {
    fetch("/api/orders")
      .then(res => res.json())
      .then(data => {
        setOrders(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 5000); // Polling for real-time feel
    return () => clearInterval(interval);
  }, []);

  const updateStatus = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch("/api/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, status: newStatus }),
      });
      if (res.ok) {
        // Optimistically update
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      }
    } catch {
      alert("Failed to update order status.");
    }
  };

  // 1. Search Filtering
  let displayedOrders = orders.filter(o => 
    o.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (o.customerName && o.customerName.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (o.phone && o.phone.includes(searchQuery))
  );

  // 2. Tab Filtering based on Lifecycle state
  displayedOrders = displayedOrders.filter(o => {
    if (activeTab === "active") return o.status === "pending" || o.status === "shipped";
    if (activeTab === "completed") return o.status === "completed";
    if (activeTab === "cancelled") return o.status === "cancelled";
    return true;
  });

  return (
    <div className="orders-view animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 border-b border-slate-200 pb-4">
        <h2 className="text-3xl font-sans font-bold text-[#1a202c]">Order Management</h2>
        <div className="flex w-full md:w-auto gap-3">
          <input 
            type="text" 
            placeholder="Search Order ID, Customer..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 w-full md:w-64 focus:outline-none focus:border-[#4299e1] focus:ring-1 focus:ring-[#4299e1] transition-shadow placeholder:text-slate-400"
          />
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 min-h-[400px] flex flex-col shadow-sm">
        <div className="flex flex-col md:flex-row gap-4 mb-6 sticky top-0 bg-white p-2 -mx-2 rounded-lg z-10 border-b border-slate-100">
          <button onClick={() => setActiveTab("active")} className={`px-4 py-2 font-bold rounded-lg text-sm w-full md:w-auto transition-colors ${activeTab === 'active' ? 'bg-[#4299e1] text-white shadow-sm' : 'bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100'}`}>Active Orders</button>
          <button onClick={() => setActiveTab("completed")} className={`px-4 py-2 font-bold rounded-lg text-sm w-full md:w-auto transition-colors ${activeTab === 'completed' ? 'bg-[#4299e1] text-white shadow-sm' : 'bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100'}`}>Completed</button>
          <button onClick={() => setActiveTab("cancelled")} className={`px-4 py-2 font-bold rounded-lg text-sm w-full md:w-auto transition-colors ${activeTab === 'cancelled' ? 'bg-[#4299e1] text-white shadow-sm' : 'bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100'}`}>Cancelled</button>
        </div>

        <div className="space-y-4">
          {loading ? (
             <div className="text-slate-400 text-center py-10 animate-pulse font-medium">Loading orders...</div>
          ) : displayedOrders.length === 0 ? (
            <div className="text-slate-500 text-center py-10 bg-slate-50 rounded-xl border border-slate-100">
              No orders found in {activeTab} stage.
            </div>
          ) : (
            displayedOrders.slice().reverse().map((o, index) => (
              <div key={o.id} className="order-card flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white border border-slate-200 hover:border-slate-300 transition-all p-5 rounded-xl shadow-sm" style={{animationDelay: `${index * 0.05}s`}}>
               <div className="flex-1">
                 <div className="flex items-center gap-3 mb-2">
                   <h3 className="font-bold text-[#2b6cb0] border border-[#4299e1] px-2 py-1 rounded text-sm bg-[#ebf8ff]">ID: {o.id}</h3>
                   <span className="font-bold text-lg text-[#2b6cb0]">TK {o.totalPrice || 0}</span>
                 </div>
                 <div className="text-slate-500 text-xs mb-2 font-medium">📅 {new Date(o.createdAt).toLocaleString()}</div>
                 <div className="text-[#1a202c] font-bold text-lg mt-2">{o.customerName || 'N/A'}</div>
                 <div className="text-slate-600 mb-3 font-medium">📞 {o.phone || ''}</div>
                 <div className="text-slate-600 text-sm mt-3 border-t border-slate-100 pt-3">
                   {o.items.map((it: any, i: number) => (
                     <div key={i}>{it.quantity || 1}x {it.name || it.productName} (TK {it.price}) {it.selectedSize ? ` - Size: ${it.selectedSize}` : ''}</div>
                   ))}
                 </div>
               </div>
               <div className="action-group md:w-auto w-full flex flex-col gap-2 shrink-0 self-start md:self-auto">
                 {o.status === "pending" && (
                   <div className="flex gap-2 w-full">
                     <button onClick={() => updateStatus(o.id, "shipped")} className="btn-action bg-emerald-500 text-white font-bold hover:bg-emerald-600 transition-colors rounded-lg px-6 py-2 text-sm flex-1 shadow-sm">Approve</button>
                     <button onClick={() => updateStatus(o.id, "cancelled")} className="btn-action bg-red-500 text-white font-bold hover:bg-red-600 transition-colors rounded-lg px-4 py-2 text-sm font-black shadow-sm">X</button>
                   </div>
                 )}
                 {o.status === "shipped" && (
                   <button onClick={() => updateStatus(o.id, "completed")} className="btn-action bg-[#4299e1] text-white font-bold hover:bg-[#3182ce] transition-colors rounded-lg px-6 py-2 text-sm w-full shadow-sm">Mark Delivered</button>
                 )}
                 {o.status === "completed" && (
                   <div className="text-right text-emerald-600 font-bold uppercase tracking-widest text-sm py-2">DELIVERED</div>
                 )}
                 {o.status === "cancelled" && (
                   <div className="text-right text-red-500 font-bold uppercase tracking-widest text-sm py-2">CANCELLED</div>
                 )}
               </div>
             </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
