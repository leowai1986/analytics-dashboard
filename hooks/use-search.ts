"use client";

import { useState, useMemo } from "react";

export interface SearchResult {
  id: string;
  title: string;
  category: string;
  href: string;
}

const allItems: SearchResult[] = [
  { id: "1", title: "Revenue Overview", category: "Dashboard", href: "/dashboard" },
  { id: "2", title: "Traffic Sources", category: "Analytics", href: "/dashboard/analytics" },
  { id: "3", title: "Weekly Visitors", category: "Analytics", href: "/dashboard/analytics" },
  { id: "4", title: "Regional Performance", category: "Analytics", href: "/dashboard/analytics" },
  { id: "5", title: "Customer List", category: "Customers", href: "/dashboard/customers" },
  { id: "6", title: "Active Subscriptions", category: "Customers", href: "/dashboard/customers" },
  { id: "7", title: "Monthly Revenue Report", category: "Reports", href: "/dashboard/reports" },
  { id: "8", title: "User Growth Analysis", category: "Reports", href: "/dashboard/reports" },
  { id: "9", title: "Traffic Source Report", category: "Reports", href: "/dashboard/reports" },
  { id: "10", title: "Profile Settings", category: "Settings", href: "/dashboard/settings" },
  { id: "11", title: "Notification Preferences", category: "Settings", href: "/dashboard/settings" },
  { id: "12", title: "Security & Privacy", category: "Settings", href: "/dashboard/settings" },
];

export function useSearch() {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const lower = query.toLowerCase();
    return allItems.filter(
      (item) =>
        item.title.toLowerCase().includes(lower) ||
        item.category.toLowerCase().includes(lower)
    );
  }, [query]);

  return { query, setQuery, results };
}
