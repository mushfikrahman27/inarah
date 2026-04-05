"use client";

import { createContext, useCallback, useContext, useMemo, useState, useEffect, type ReactNode } from "react";
import type { Product } from "../data/products";

type SearchSuggestion = {
  id: number;
  name: string;
  img: string;
};

type SearchContextValue = {
  searchText: string;
  setSearchText: (v: string) => void;
  suggestions: SearchSuggestion[];
  isSearching: boolean;
  showSuggestions: boolean;
  setShowSuggestions: (show: boolean) => void;
  handleSuggestionClick: (id: number) => void;
};

const SearchContext = createContext<SearchContextValue | null>(null);

export function SearchProvider({ children }: { children: ReactNode }) {
  const [searchText, setSearchTextState] = useState("");
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [debouncedSearchText, setDebouncedSearchText] = useState("");
  const [allProducts, setAllProducts] = useState<Product[]>([]);

  // Load products from window or context
  useEffect(() => {
    if (typeof window !== "undefined" && (window as any).allProducts) {
      setAllProducts((window as any).allProducts);
    }
  }, []);

  // 250ms debounce logic (similar to old startSearch IIFE)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchText(searchText);
    }, 250);

    return () => clearTimeout(timer);
  }, [searchText]);

  // Filter products based on debounced search text
  useEffect(() => {
    if (debouncedSearchText.trim().length < 2) {
      setSuggestions([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    
    const term = debouncedSearchText.toLowerCase().trim();
    const matches = allProducts
      .filter((product) => {
        const name = (product.name || "").toLowerCase();
        const category = (product.category || "").toLowerCase();
        const subCategory = (product.subCategory || "").toLowerCase();
        
        return name.includes(term) || category.includes(term) || subCategory.includes(term);
      })
      .slice(0, 7)
      .map((product) => ({
        id: product.id,
        name: product.name || "Product",
        img: product.img || "",
      }));

    setSuggestions(matches);
    setIsSearching(false);
  }, [debouncedSearchText, allProducts]);

  const setSearchText = useCallback((v: string) => {
    setSearchTextState(v);
    if (v.trim().length >= 2) {
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  }, []);

  const handleSuggestionClick = useCallback((id: number) => {
    // Close suggestion panels
    setShowSuggestions(false);
    
    // Clear search text
    setSearchTextState("");

    // Removing redirect from context so we can use ProductDetailsContext locally
    // if (typeof window !== "undefined") {
    //   window.location.href = `/product/${id}`;
    // }
  }, []);

  const value = useMemo(
    () => ({
      searchText,
      setSearchText,
      suggestions,
      isSearching,
      showSuggestions,
      setShowSuggestions,
      handleSuggestionClick,
    }),
    [searchText, setSearchText, suggestions, isSearching, showSuggestions, handleSuggestionClick],
  );

  return <SearchContext.Provider value={value}>{children}</SearchContext.Provider>;
}

export function useSearch() {
  const ctx = useContext(SearchContext);
  if (!ctx) {
    throw new Error("useSearch must be used within SearchProvider");
  }
  return ctx;
}
