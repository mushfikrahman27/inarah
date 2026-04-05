export default function SettingsPage() {
  return (
    <div className="settings-view animate-fade-in max-w-4xl mx-auto">
      <div className="flex flex-col justify-between items-start mb-8 border-b border-slate-200 pb-4">
        <h2 className="text-3xl font-sans font-bold text-[#1a202c]">Admin Settings</h2>
        <p className="text-slate-500 text-sm mt-2 font-medium">Manage your e-commerce system configuration</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-xl font-bold mb-6 flex items-center border-b border-slate-100 pb-3 text-[#1a202c]">
            <span className="mr-3">🔥</span> Firebase Configuration
          </h3>
          <div className="space-y-5">
            <div>
              <label className="block text-xs uppercase tracking-widest text-slate-500 mb-2 font-bold">Project ID</label>
              <input type="text" placeholder="Enter Project ID..." className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-slate-800 focus:outline-none focus:border-[#4299e1] focus:ring-1 focus:ring-[#4299e1] shadow-inner placeholder:text-slate-400" />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-slate-500 mb-2 font-bold">Database URL</label>
              <input type="text" placeholder="https://..." className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-slate-800 focus:outline-none focus:border-[#4299e1] focus:ring-1 focus:ring-[#4299e1] shadow-inner placeholder:text-slate-400" />
            </div>
            <button className="px-5 py-3 mt-4 border border-[#4299e1] text-[#2b6cb0] bg-white hover:bg-[#ebf8ff] rounded-lg font-bold w-full transition-colors shadow-sm">
              Save Configuration
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-xl font-bold mb-6 flex items-center border-b border-slate-100 pb-3 text-[#1a202c]">
            <span className="mr-3">🧑‍💼</span> Administrator Profile
          </h3>
          <div className="space-y-4">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-[#4299e1] text-2xl font-bold shadow-sm">?</div>
              <div>
                <div className="text-lg font-bold text-[#1a202c]">Not Logged In</div>
                <div className="text-sm text-slate-500 font-medium">Please authenticate</div>
              </div>
            </div>
            <button className="px-5 py-3 w-full bg-[#ebf8ff] text-[#2b6cb0] hover:bg-[#bee3f8] border border-[#bee3f8] shadow-sm rounded-lg font-bold transition-colors">
              Sign In
            </button>
          </div>
        </div>

        <div className="md:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-xl font-bold mb-6 flex items-center border-b border-slate-100 pb-3 text-[#1a202c]">
            <span className="mr-3">⚙️</span> Store Preferences
          </h3>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-bold text-[#1a202c] mb-1">Auto-Restock on Cancellation</div>
                <div className="text-sm text-slate-500 font-medium">Automatically adds stock back to inventory when an order is cancelled.</div>
              </div>
              <div className="w-12 h-6 rounded-full bg-slate-200 border border-slate-300 relative cursor-pointer shadow-inner">
                <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full shadow-sm"></div>
              </div>
            </div>
            <div className="flex items-center justify-between border-t border-slate-100 pt-6">
              <div>
                <div className="font-bold text-[#1a202c] mb-1">Enable "Notify Me" Requests</div>
                <div className="text-sm text-slate-500 font-medium">Capture customer SMS numbers when stock drops to 0.</div>
              </div>
              <div className="w-12 h-6 rounded-full bg-slate-200 border border-slate-300 relative cursor-pointer shadow-inner">
                <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full shadow-sm"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
