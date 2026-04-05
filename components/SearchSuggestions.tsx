"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { useSearch } from "../context/SearchContext";
import { useProductDetails } from "../context/ProductDetailsContext";

interface SearchSuggestionsProps {
  isMobile?: boolean;
}

export default function SearchSuggestions({ isMobile = false }: SearchSuggestionsProps) {
  const { searchText, suggestions, isSearching, showSuggestions, handleSuggestionClick, setShowSuggestions } = useSearch();
  const { openProductDetails } = useProductDetails();
  const panelRef = useRef<HTMLDivElement>(null);

  // Close on outside click (similar to old startSearch logic)
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Element;
      // If click is inside ANY suggestion panel or search input, ignore it
      if (target.closest(".suggestion-panel") || target.closest(".stylish-search")) {
        return;
      }
      setShowSuggestions(false);
    }

    if (showSuggestions) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showSuggestions, setShowSuggestions]);

  if (!showSuggestions || searchText.trim().length < 2) return null;

  const panelId = isMobile ? "mobileSuggestionPanel" : "suggestionPanel";

  return (
    <div
      ref={panelRef}
      id={panelId}
      className={`suggestion-panel ${showSuggestions ? "open" : ""}`}
      style={{
        display: showSuggestions ? "block" : "none",
        position: "absolute",
        top: "100%",
        marginTop: "60px",
        left: isMobile ? 0 : "50%",
        transform: isMobile ? "none" : "translateX(-50%)",
        width: isMobile ? "100%" : "420px",
        maxHeight: "320px",
        overflowY: "auto",
        background: "#ffffff",
        border: "1px solid #e5e7eb",
        borderRadius: "12px",
        boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05)",
        zIndex: 999,
        animation: "sgFade 0.15s ease",
      }}
    >
      {isSearching ? (
        <div className="sg-empty" style={{ padding: "20px", textAlign: "center", color: "#aaa" }}>
          Searching...
        </div>
      ) : suggestions.length === 0 ? (
        <div className="sg-empty" style={{ padding: "20px", textAlign: "center", color: "#aaa" }}>
          No products found
        </div>
      ) : (
        suggestions.map((suggestion) => (
          <div
            key={suggestion.id}
            className="sg-row"
            onClick={() => {
              handleSuggestionClick(suggestion.id);
              openProductDetails(suggestion.id);
            }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: isMobile ? "13px 18px" : "10px 15px",
              borderBottom: "1px solid #f3f4f6",
              cursor: "pointer",
              background: "#ffffff",
              transition: "background 0.15s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#f5f3ff";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#ffffff";
            }}
          >
            <div
              className="sg-img"
              style={{
                width: isMobile ? "52px" : "46px",
                height: isMobile ? "52px" : "46px",
                borderRadius: "6px",
                overflow: "hidden",
                flexShrink: 0,
              }}
            >
              <Image
                src={suggestion.img}
                alt={suggestion.name}
                width={isMobile ? 52 : 46}
                height={isMobile ? 52 : 46}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
                onError={(e) => {
                  // Fallback to placeholder on error
                  (e.target as HTMLImageElement).src = "/images/placeholder.png";
                }}
              />
            </div>
            <span
              className="sg-name"
              style={{
                flex: 1,
                fontSize: isMobile ? "15px" : "14px",
                fontWeight: 600,
                color: "#374151",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {suggestion.name}
            </span>
          </div>
        ))
      )}
      
      <style jsx>{`
        @keyframes sgFade {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .sg-row:last-child {
          border-bottom: none;
        }

        .sg-row:hover .sg-name {
          color: #6366f1;
        }

        @media (max-width: 768px) {
          #mobileSuggestionPanel {
            position: absolute;
            top: calc(100% + 50px);
            left: 0;
            width: 100%;
            max-width: none;
            border-radius: 0;
            z-index: 999;
          }
        }
      `}</style>
    </div>
  );
}
