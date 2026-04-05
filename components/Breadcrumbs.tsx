"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface BreadcrumbsProps {
  items?: BreadcrumbItem[];
  className?: string;
}

export default function Breadcrumbs({ items, className = "" }: BreadcrumbsProps) {
  const pathname = usePathname();

  // Generate breadcrumbs automatically if not provided
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    if (items) return items;

    const pathSegments = pathname.split("/").filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [
      { label: "HOME", href: "/" }
    ];

    // Handle product pages
    if (pathSegments[0] === "product" && pathSegments[1]) {
      breadcrumbs.push({ label: "PRODUCTS", href: "/" });
      breadcrumbs.push({ label: "PRODUCT DETAILS", href: pathname });
    }
    // Handle other dynamic routes
    else {
      let currentPath = "";
      pathSegments.forEach((segment, index) => {
        currentPath += `/${segment}`;
        const label = segment.toUpperCase().replace(/-/g, " ");
        breadcrumbs.push({ label, href: currentPath });
      });
    }

    return breadcrumbs;
  };

  const breadcrumbItems = generateBreadcrumbs();

  return (
    <nav className={`breadcrumbs flex items-center gap-2 text-sm text-[#666] mb-6 ${className}`} aria-label="Breadcrumb navigation">
      {breadcrumbItems.map((item, index) => (
        <div key={item.href} className="flex items-center gap-2">
          {index > 0 && (
            <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden>
              <path d="M9 18l6-6-6-6" />
            </svg>
          )}
          {index === breadcrumbItems.length - 1 ? (
            <span className="text-[#888] font-medium">{item.label}</span>
          ) : (
            <Link
              href={item.href}
              className="hover:text-white transition-colors duration-200"
            >
              {item.label}
            </Link>
          )}
        </div>
      ))}
    </nav>
  );
}
