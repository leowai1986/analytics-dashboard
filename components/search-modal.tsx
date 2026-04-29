"use client";

import { useEffect, useRef } from "react";
import { Search, X, ArrowRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useSearch } from "@/hooks/use-search";

interface SearchModalProps {
  open: boolean;
  onClose: () => void;
}

export function SearchModal({ open, onClose }: SearchModalProps) {
  const { query, setQuery, results } = useSearch();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
    }
  }, [open, setQuery]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) onClose();
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        open ? onClose() : null;
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 pt-[15vh] backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-lg rounded-xl border bg-card shadow-2xl overflow-hidden">
        <div className="flex items-center gap-3 border-b px-4 py-3">
          <Search className="h-5 w-5 text-muted-foreground shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search pages, reports, settings..."
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
          <button
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-md hover:bg-accent transition-colors"
          >
            <X className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>

        <div className="max-h-[320px] overflow-y-auto">
          {results.length === 0 && query.trim() !== "" && (
            <div className="px-4 py-8 text-center text-sm text-muted-foreground">
              No results found for "{query}"
            </div>
          )}

          {results.length === 0 && query.trim() === "" && (
            <div className="px-4 py-6 space-y-1">
              <p className="px-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Quick access
              </p>
              {[
                { title: "Dashboard Overview", href: "/dashboard" },
                { title: "Analytics", href: "/dashboard/analytics" },
                { title: "Customers", href: "/dashboard/customers" },
                { title: "Reports", href: "/dashboard/reports" },
                { title: "Settings", href: "/dashboard/settings" },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className="flex items-center gap-3 rounded-lg px-2 py-2 text-sm hover:bg-accent transition-colors"
                >
                  <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
                  {item.title}
                </Link>
              ))}
            </div>
          )}

          {results.length > 0 && (
            <div className="py-2">
              <p className="px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                Results
              </p>
              {results.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={onClose}
                  className="flex items-center justify-between px-4 py-2.5 text-sm hover:bg-accent transition-colors"
                >
                  <div className="flex flex-col">
                    <span className="font-medium">{item.title}</span>
                    <span className="text-xs text-muted-foreground">{item.category}</span>
                  </div>
                  <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="border-t px-4 py-2.5 flex items-center justify-between text-xs text-muted-foreground bg-muted/30">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="rounded border bg-card px-1.5 py-0.5 text-[10px] font-mono">↑↓</kbd>
              <span>Navigate</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="rounded border bg-card px-1.5 py-0.5 text-[10px] font-mono">↵</kbd>
              <span>Select</span>
            </span>
          </div>
          <span className="flex items-center gap-1">
            <kbd className="rounded border bg-card px-1.5 py-0.5 text-[10px] font-mono">Esc</kbd>
            <span>Close</span>
          </span>
        </div>
      </div>
    </div>
  );
}
