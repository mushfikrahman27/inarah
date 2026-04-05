import type { Product } from "../data/products";
import { effectivePriceForFilter } from "../data/products";

export type FilterState = {
  category: string | null;
  subCategory: string | null;
  priceMin: number | null;
  priceMax: number | null;
  searchText: string;
};

export function applyProductFilters(products: Product[], state: FilterState): Product[] {
  return products.filter((product) => {
    if (state.category && state.category !== "All") {
      if (product.category !== state.category) return false;
      if (state.subCategory && state.subCategory !== "All" && product.subCategory !== state.subCategory) {
        return false;
      }
    }

    if (!state.category || state.category === "All") {
      if (state.subCategory && state.subCategory !== "All" && product.subCategory !== state.subCategory) {
        return false;
      }
    }

    const productPriceNum = effectivePriceForFilter(product);
    if (state.priceMin !== null && productPriceNum < state.priceMin) return false;
    if (state.priceMax !== null && productPriceNum > state.priceMax) return false;

    if (state.searchText?.trim()) {
      const searchTerm = state.searchText.toLowerCase().trim();
      const matchesName = product.name.toLowerCase().includes(searchTerm);
      const matchesCategory = product.category.toLowerCase().includes(searchTerm);
      const matchesSubCategory = product.subCategory
        ? product.subCategory.toLowerCase().includes(searchTerm)
        : false;
      if (!matchesName && !matchesCategory && !matchesSubCategory) return false;
    }

    return true;
  });
}
