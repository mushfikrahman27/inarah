"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface BackButtonProps {
  fallbackHref?: string;
  className?: string;
  children?: React.ReactNode;
  showLabel?: boolean;
  variant?: "default" | "minimal" | "large";
}

export default function BackButton({ 
  fallbackHref = "/", 
  className = "", 
  children,
  showLabel = true,
  variant = "default"
}: BackButtonProps) {
  const router = useRouter();
  const [canGoBack, setCanGoBack] = useState(false);

  useEffect(() => {
    // Check if there's history to go back to
    if (typeof window !== "undefined") {
      setCanGoBack(window.history.length > 1);
    }
  }, []);

  const handleBack = () => {
    if (canGoBack) {
      router.back();
    } else if (fallbackHref) {
      router.push(fallbackHref);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleBack();
    }
  };

  const variantStyles = {
    default: "inline-flex items-center gap-2 text-sm text-[#888] hover:text-white transition-colors duration-200 p-2 rounded-lg hover:bg-white/5",
    minimal: "inline-flex items-center gap-1 text-xs text-[#666] hover:text-white transition-colors duration-150",
    large: "inline-flex items-center gap-3 text-base text-[#888] hover:text-white transition-colors duration-200 p-3 rounded-xl hover:bg-white/5"
  };

  const defaultChildren = (
    <>
      <svg width={variant === "large" ? 28 : 20} height={variant === "large" ? 28 : 20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden>
        <path d="M19 12H5M12 19l-7-7 7-7" />
      </svg>
      {showLabel && <span>{variant === "minimal" ? "BACK" : "BACK"}</span>}
    </>
  );

  return (
    <button
      type="button"
      onClick={handleBack}
      onKeyDown={handleKeyDown}
      className={`cool-back-btn ${variantStyles[variant]} ${className}`}
      aria-label={canGoBack ? "Go back to previous page" : "Go to homepage"}
      title={canGoBack ? "Go back" : "Go to homepage"}
    >
      {children || defaultChildren}
    </button>
  );
}
