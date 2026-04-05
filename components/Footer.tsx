"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();

  if (pathname && pathname.startsWith("/admin")) {
    return null;
  }
  return (
    <footer className="mt-auto bg-[#0a0a0a] text-white pt-16 pb-8 border-t border-white/10 shrink-0">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        
        {/* Main Content Area */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-y-10 gap-x-4 mb-12">
          
          {/* Column 1: Brand (100% on mobile, 1 col on desktop) */}
          <div className="col-span-2 md:col-span-1 flex flex-col items-center md:items-start text-center md:text-left">
            <h3 className="text-3xl font-serif font-bold text-white mb-4 tracking-wider">INARAH</h3>
            <p className="text-[#a0a0a0] text-sm leading-relaxed max-w-sm mx-auto md:mx-0">
              Your trusted destination for Tech &amp; Fashion. Trendy styles and modern gadgets at best price in Bangladesh.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div className="col-span-1 flex flex-col items-center md:items-start text-center md:text-left">
            <h4 className="text-lg font-semibold mb-4 text-[#e0e0e0] tracking-wide uppercase text-sm">Quick Links</h4>
            <ul className="space-y-3 text-sm text-[#888888]">
              <li><Link href="/#hero-section" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Column 3: Contact Info */}
          <div className="col-span-1 flex flex-col items-center md:items-start text-center md:text-left">
            <h4 className="text-lg font-semibold mb-4 text-[#e0e0e0] tracking-wide uppercase text-sm">Contact Info</h4>
            <ul className="space-y-3 text-sm text-[#888888]">
              <li className="flex items-center gap-3 justify-center md:justify-start">
                <span className="text-white">📍</span>
                <span>Bangladesh</span>
              </li>
              <li className="flex items-center gap-3 justify-center md:justify-start">
                <span className="text-white">📞</span>
                <span>+880 1XXX-XXXXXX</span>
              </li>
              <li className="flex items-center gap-3 justify-center md:justify-start">
                <span className="text-white">📧</span>
                <span>support@inarah.com</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Divider */}
        <div className="w-full h-px bg-white/10 mb-8"></div>

        {/* Social & Copyright Area */}
        <div className="flex flex-col items-center justify-center gap-6">
          <div className="flex items-center gap-6">
            <a href="https://www.facebook.com/share/1Astjv72R5/" target="_blank" rel="noopener noreferrer" className="text-[#888888] hover:text-white transition-colors p-2 rounded-full hover:bg-white/5" aria-label="Facebook">
              <svg width={20} height={20} viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
            </a>
            <a href="https://www.instagram.com/inarah_mb?igsh=MTVqNzN5MmxwNXp3Yw==" target="_blank" rel="noopener noreferrer" className="text-[#888888] hover:text-white transition-colors p-2 rounded-full hover:bg-white/5" aria-label="Instagram">
              <svg width={20} height={20} viewBox="0 0 24 24" fill="currentColor"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.96 3.21-1.49.04-3-.41-4.15-1.3-1.05-.73-1.79-1.85-2.17-3.08-.25-.81-.39-1.66-.32-2.51.14-2.05 1.23-4 3.03-4.94.94-.47 2.02-.67 3.06-.54.97.12 1.87.57 2.54 1.28.69.73 1.08 1.72 1.08 2.73 0 .58-.08 1.16-.25 1.71-.27.78-.72 1.5-1.29 2.07-.76.76-1.78 1.26-2.85 1.42-.88.13-1.8-.01-2.6-.45-.54-.29-1.01-.71-1.37-1.22-.4-.58-.65-1.26-.74-1.96-.05-.34-.07-.69-.07-1.04.01-2.92.01-5.84.01-8.75.82.45 1.71.77 2.64.95.57.11 1.16.17 1.75.16.01-.66.02-1.32.02-1.98-.52-.01-1.04-.08-1.54-.21-.98-.25-1.87-.79-2.54-1.56-.63-.72-1.04-1.62-1.21-2.55-.14-.67-.16-1.35-.04-2.02z" /></svg>
            </a>
            <a href="mailto:inarah7824@gmail.com" className="text-[#888888] hover:text-white transition-colors p-2 rounded-full hover:bg-white/5" aria-label="Email">
              <svg width={20} height={20} viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" /></svg>
            </a>
          </div>
          
          <div className="text-xs text-[#888888] tracking-widest text-center mt-2 font-medium">
            © 2026 INARAH. ALL RIGHTS RESERVED.
          </div>
        </div>

      </div>
    </footer>
  );
}
