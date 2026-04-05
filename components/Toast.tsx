"use client";

import { useEffect, useState } from "react";

export interface ToastMessage {
  id: string;
  message: string;
  type: "success" | "error" | "info";
  duration?: number;
}

interface ToastProps {
  toast: ToastMessage;
  onRemove: (id: string) => void;
}

function Toast({ toast, onRemove }: ToastProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    const timer = setTimeout(() => setIsVisible(true), 10);

    // Auto remove after duration
    const duration = toast.duration || 3000;
    const removeTimer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onRemove(toast.id), 300);
    }, duration);

    return () => {
      clearTimeout(timer);
      clearTimeout(removeTimer);
    };
  }, [toast, onRemove]);

  const getToastStyles = () => {
    const baseStyles = {
      position: "fixed" as const,
      top: "20px",
      right: "20px",
      padding: "16px 20px",
      borderRadius: "8px",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
      zIndex: 9999,
      display: "flex",
      alignItems: "center",
      gap: "12px",
      minWidth: "300px",
      maxWidth: "400px",
      transform: isVisible ? "translateX(0)" : "translateX(100%)",
      opacity: isVisible ? 1 : 0,
      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      fontFamily: "system-ui, -apple-system, sans-serif",
      fontSize: "14px",
      fontWeight: 500,
    };

    const typeStyles = {
      success: {
        backgroundColor: "#10b981",
        color: "#ffffff",
        borderLeft: "4px solid #059669",
      },
      error: {
        backgroundColor: "#ef4444",
        color: "#ffffff",
        borderLeft: "4px solid #dc2626",
      },
      info: {
        backgroundColor: "#3b82f6",
        color: "#ffffff",
        borderLeft: "4px solid #2563eb",
      },
    };

    return { ...baseStyles, ...typeStyles[toast.type] };
  };

  const getIcon = () => {
    switch (toast.type) {
      case "success":
        return (
          <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path d="M20 6L9 17l-5-5" />
          </svg>
        );
      case "error":
        return (
          <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <circle cx={12} cy={12} r={10} />
            <line x1={15} y1={9} x2={9} y2={15} />
            <line x1={9} y1={9} x2={15} y2={15} />
          </svg>
        );
      case "info":
        return (
          <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <circle cx={12} cy={12} r={10} />
            <line x1={12} y1={16} x2={12} y2={12} />
            <line x1={12} y1={8} x2={12.01} y2={8} />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div style={getToastStyles()}>
      <div style={{ flexShrink: 0 }}>{getIcon()}</div>
      <div style={{ flex: 1 }}>{toast.message}</div>
      <button
        onClick={() => {
          setIsVisible(false);
          setTimeout(() => onRemove(toast.id), 300);
        }}
        style={{
          background: "none",
          border: "none",
          color: "inherit",
          cursor: "pointer",
          padding: "2px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "4px",
          opacity: 0.8,
          transition: "opacity 0.2s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.opacity = "1";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.opacity = "0.8";
        }}
        aria-label="Close notification"
      >
        <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <line x1={18} y1={6} x2={6} y2={18} />
          <line x1={6} y1={6} x2={18} y2={18} />
        </svg>
      </button>
    </div>
  );
}

interface ToastContainerProps {
  toasts: ToastMessage[];
  onRemove: (id: string) => void;
}

export function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        right: 0,
        zIndex: 9998,
        pointerEvents: "none",
      }}
    >
      {toasts.map((toast) => (
        <div key={toast.id} style={{ pointerEvents: "auto", marginBottom: "10px" }}>
          <Toast toast={toast} onRemove={onRemove} />
        </div>
      ))}
    </div>
  );
}

export default Toast;
