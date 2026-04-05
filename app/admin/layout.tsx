import Link from "next/link";
import "./admin.css";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="admin-layout flex flex-col lg:flex-row min-h-screen bg-[#f8fafc] text-[#1a202c]">
      {/* Sidebar Navigation */}
      <aside className="sidebar fixed bottom-0 lg:top-0 lg:left-0 w-full lg:w-[260px] h-[70px] lg:h-screen bg-white flex lg:flex-col justify-around lg:justify-start items-center lg:items-stretch z-50 border-t lg:border-t-0 lg:border-r border-slate-200 shadow-sm">
        <div className="sidebar-brand hidden lg:flex h-[70px] items-center justify-center font-sans font-bold text-2xl tracking-widest text-[#4299e1] border-b border-slate-200">
          INARAH
        </div>
        <div className="flex lg:flex-col flex-1 w-full lg:mt-6 px-2 lg:px-4 justify-around lg:justify-start gap-2 lg:gap-4 items-center lg:items-stretch">
          <Link href="/admin" className="nav-item flex lg:justify-start items-center p-3 lg:px-6 rounded-xl hover:bg-slate-100 transition-colors text-sm lg:text-base font-semibold text-slate-700 hover:text-[#4299e1]">
            <span className="lg:mr-3">🏠</span>
            <span className="hidden lg:block">Home</span>
          </Link>
          <Link href="/admin/orders" className="nav-item flex lg:justify-start items-center p-3 lg:px-6 rounded-xl hover:bg-slate-100 transition-colors text-sm lg:text-base font-semibold text-slate-700 hover:text-[#4299e1]">
            <span className="lg:mr-3">📦</span>
            <span className="hidden lg:block">Orders</span>
          </Link>
          <Link href="/admin/inventory" className="nav-item flex lg:justify-start items-center p-3 lg:px-6 rounded-xl hover:bg-slate-100 transition-colors text-sm lg:text-base font-semibold text-slate-700 hover:text-[#4299e1]">
            <span className="lg:mr-3">🏷️</span>
            <span className="hidden lg:block">Stock</span>
          </Link>
          <Link href="/admin/settings" className="nav-item flex lg:justify-start items-center p-3 lg:px-6 rounded-xl hover:bg-slate-100 transition-colors text-sm lg:text-base font-semibold text-slate-700 hover:text-[#4299e1]">
            <span className="lg:mr-3">⚙️</span>
            <span className="hidden lg:block">Admin</span>
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="main-content flex-1 lg:ml-[260px] overflow-y-auto pb-[90px] lg:pb-0 p-4 lg:p-8">
        {children}
      </main>
    </div>
  );
}
