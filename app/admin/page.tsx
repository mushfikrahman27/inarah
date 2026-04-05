"use client";

import { useEffect, useState } from "react";
import { PRODUCTS } from "../../data/products";

export default function Dashboard() {
  const [stats, setStats] = useState({
    revenue: 0,
    orders: 0,
    stock: PRODUCTS.length,
    demand: 0,
    history: 0,
    visitors: 0
  });

  const [liveOrders, setLiveOrders] = useState<any[]>([]);

  // Adjustment state properties
  const [adjustment, setAdjustment] = useState(0);
  const [isEditingAdj, setIsEditingAdj] = useState(false);
  const [tempAdj, setTempAdj] = useState("0");

  useEffect(() => {
    Promise.all([
      fetch("/api/orders").then(res => res.json()),
      fetch("/api/settings").then(res => res.json()).catch(() => ({}))
    ])
      .then(([data, settingsData]) => {
        let rev = 0;
        let activeOrders = 0;
        let historyCount = 0;
        
        data.forEach((o: any) => {
           if (o.status === "completed") {
               rev += Number(o.totalPrice || 0);
               historyCount++;
           } else if (o.status === "pending" || o.status === "shipped") {
               activeOrders++;
           }
        });
        
        setStats(prev => ({ 
          ...prev, 
          orders: activeOrders, 
          revenue: rev,
          history: historyCount 
        }));
        const initialAdj = settingsData.revenueAdjustment || 0;
        setAdjustment(initialAdj);
        setTempAdj("");
        
        // Only show active orders in the live list (like dashboard-new.html)
        setLiveOrders(data.filter((o: any) => o.status === "pending" || o.status === "shipped").reverse());
      })
      .catch(console.error);
  }, []);

  const handleAdjustmentSave = async () => {
    const val = parseInt(tempAdj, 10);
    if (!isNaN(val)) {
      const newAdjustment = adjustment + val; // Add to existing
      setAdjustment(newAdjustment); // Optimistic UI
      setIsEditingAdj(false);
      setTempAdj(""); // Reset input
      try {
        await fetch("/api/settings", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ revenueAdjustment: newAdjustment })
        });
      } catch (err) {
        alert("Failed to save revenue adjustment");
      }
    }
  };

  const handleAdjustmentReset = async () => {
    setAdjustment(0);
    setIsEditingAdj(false);
    setTempAdj("");
    try {
      await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ revenueAdjustment: 0 })
      });
    } catch (err) {
      alert("Failed to reset revenue adjustment");
    }
  };

  const updateStatus = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch("/api/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, status: newStatus }),
      });
      if (res.ok) {
        // Optimistically update live orders
        setLiveOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o).filter(o => o.status === "pending" || o.status === "shipped"));
        
        // Optimistically update stats
        if (newStatus === "completed") {
           setStats(prev => ({ 
             ...prev, 
             orders: Math.max(0, prev.orders - 1), 
             revenue: prev.revenue + (liveOrders.find(o => o.id === orderId)?.totalPrice || 0),
             history: prev.history + 1
           }));
        } else if (newStatus === "cancelled") {
           setStats(prev => ({ ...prev, orders: Math.max(0, prev.orders - 1) }));
        }
      }
    } catch {
      alert("Failed to update order status.");
    }
  };

  // Calculate final revenue based on actual orders + whatever manual adjustment is set
  const finalRevenue = stats.revenue + adjustment;

  return (
    <div className="dashboard-view animate-fade-in">
      <h2 className="text-3xl font-sans font-bold text-[#1a202c] mb-8 border-b border-slate-200 pb-4">Store Overview</h2>
      
      <div className="stat-grid grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-12">
        <div className="stat-card relative group">
          <div className="stat-label flex items-center justify-center gap-2">
            Revenue
            <button 
              onClick={() => setIsEditingAdj(!isEditingAdj)}
              className="text-slate-400 hover:text-[#4299e1] transition-colors p-1"
              title="Adjust Revenue"
            >
              <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path d="M12 20h9" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
          
          {isEditingAdj ? (
            <div className="flex items-center gap-2 mt-2">
              <input 
                type="number" 
                value={tempAdj}
                placeholder="+/- offset"
                onChange={(e) => setTempAdj(e.target.value)}
                className="w-20 px-2 py-1 text-sm border border-[#4299e1] rounded outline-none focus:ring-1 focus:ring-[#4299e1] placeholder:text-slate-300"
                autoFocus
              />
              <button 
                onClick={handleAdjustmentSave}
                className="bg-[#4299e1] text-white px-2 py-1 rounded text-sm font-bold hover:bg-[#3182ce]"
                title="Add to adjustment"
              >
                +
              </button>
              <button 
                onClick={handleAdjustmentReset}
                className="bg-slate-200 text-slate-700 px-2 py-1 rounded text-sm font-bold hover:bg-slate-300"
                title="Reset exactly to auto-calculated revenue"
              >
                Reset
              </button>
            </div>
          ) : (
            <div className="stat-value text-xl font-bold mt-1" title={`Auto: ${stats.revenue} | Adj: ${adjustment}`}>
              TK {finalRevenue.toLocaleString()}
            </div>
          )}
        </div>
        <div className="stat-card">
          <div className="stat-label">Active Orders</div>
          <div className="stat-value text-xl font-bold mt-1">{stats.orders}</div>
        </div>
        <div className="stat-card cursor-pointer border border-[#4299e1] bg-[#4299e1]/5 hover:bg-[#4299e1]/10 transition-colors">
          <div className="stat-label text-[#4299e1] font-bold">Product Stock <i className="fas fa-boxes ml-1"></i></div>
          <div className="stat-value text-xl font-bold text-[#4299e1] mt-1">{stats.stock} items</div>
        </div>
        <div className="stat-card cursor-pointer border border-green-500 bg-green-500/5 hover:bg-green-500/10 transition-colors">
          <div className="stat-label text-green-600 font-bold">Customer Demand <i className="fas fa-fire ml-1"></i></div>
          <div className="stat-value text-xl font-bold text-green-600 mt-1">{stats.demand} requests</div>
        </div>
        <div className="stat-card cursor-pointer border border-slate-300 bg-slate-50 hover:bg-slate-100 transition-colors">
          <div className="stat-label font-bold">Order History <i className="fas fa-chevron-right text-[10px] ml-1"></i></div>
          <div className="stat-value text-xl font-bold text-slate-700 mt-1">{stats.history}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Visitors Today</div>
          <div className="stat-value text-xl font-bold mt-1">{stats.visitors}</div>
        </div>
      </div>

      <div className="live-orders-section mt-12 bg-white md:bg-white p-0 md:p-6 rounded-2xl md:border border-slate-200 md:shadow-sm">
        <h3 className="text-2xl font-bold mb-6 text-[#1a202c] flex items-center">
          <span className="w-2 h-2 rounded-full bg-[#4299e1] mr-3 animate-pulse"></span>
          Active Orders
        </h3>
        
        <div className="space-y-4">
          {liveOrders.length === 0 ? (
            <div className="text-slate-500 text-center py-6 bg-slate-50 rounded-xl border border-slate-200">
              No active orders at the moment.
            </div>
          ) : (
            liveOrders.map(o => (
              <div key={o.id} className="bg-white border border-slate-200 rounded-xl p-5 hover:border-slate-300 transition-all shadow-sm order-card">
                <div className="flex justify-between items-center mb-3">
                  <span className="border border-[#4299e1] text-[#2b6cb0] px-2 py-1 rounded text-sm bg-[#ebf8ff] font-bold">
                    ID: {o.id}
                  </span>
                  <span className="text-[#2b6cb0] font-bold text-lg">
                    TK {o.totalPrice || 0}
                  </span>
                </div>
                <div className="font-bold text-[#1a202c] mb-1 text-lg">{o.customerName || 'N/A'}</div>
                <div className="text-slate-600 text-sm mb-4 font-medium">📞 {o.phone || ''}</div>
                <div className="text-slate-500 text-xs mb-3">
                  {o.items?.map((it: any, i: number) => (
                    <div key={i}>{it.quantity || 1}x {it.name || it.productName}</div>
                  ))}
                </div>
                
                <div className="action-group mt-4 flex gap-2 w-full border-t border-slate-100 pt-4">
                  {o.status === "pending" && (
                    <>
                      <button onClick={() => updateStatus(o.id, "shipped")} className="flex-1 bg-emerald-500 text-white font-bold hover:bg-emerald-600 transition-colors rounded-lg py-3 text-sm">Approve</button>
                      <button onClick={() => updateStatus(o.id, "cancelled")} className="bg-red-500 text-white font-bold hover:bg-red-600 transition-colors rounded-lg px-5 py-3 text-sm font-black">X</button>
                    </>
                  )}
                  {o.status === "shipped" && (
                     <button onClick={() => updateStatus(o.id, "completed")} className="w-full bg-[#4299e1] text-white font-bold hover:bg-[#3182ce] transition-colors rounded-lg py-3 text-sm">Mark Delivered</button>
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
