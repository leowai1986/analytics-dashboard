"use client";

import { useState, useCallback } from "react";
import { Bell, Search, Menu } from "lucide-react";
import { SearchModal } from "@/components/search-modal";
import { NotificationsPanel } from "@/components/notifications-panel";

export function Header() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(3);

  const handleUnreadChange = useCallback((count: number) => {
    setUnreadCount(count);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/95 px-6 backdrop-blur">
        <button className="lg:hidden p-2 -ml-2 hover:bg-accent rounded-md">
          <Menu className="h-5 w-5" />
        </button>

        <div className="flex-1">
          <h1 className="text-xl font-semibold tracking-tight hidden sm:block">
            Dashboard
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSearchOpen(true)}
            className="relative flex h-9 w-9 items-center justify-center rounded-md border bg-transparent hover:bg-accent transition-colors"
          >
            <Search className="h-4 w-4" />
            <span className="sr-only">Search</span>
          </button>

          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="relative flex h-9 w-9 items-center justify-center rounded-md border bg-transparent hover:bg-accent transition-colors"
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground">
                {unreadCount}
              </span>
            )}
            <span className="sr-only">Notifications</span>
          </button>
        </div>
      </header>

      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
      <NotificationsPanel
        open={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
        onUnreadChange={handleUnreadChange}
      />
    </>
  );
}
