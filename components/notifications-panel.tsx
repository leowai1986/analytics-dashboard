"use client";

import { useState, useEffect } from "react";
import { X, CheckCircle2, AlertTriangle, Info, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "success" | "warning" | "info";
  time: string;
  read: boolean;
}

const initialNotifications: Notification[] = [
  {
    id: "1",
    title: "Revenue milestone reached",
    message: "Monthly revenue exceeded $45K for the first time.",
    type: "success",
    time: "2 minutes ago",
    read: false,
  },
  {
    id: "2",
    title: "High bounce rate alert",
    message: "Latin America region bounce rate is above 50%.",
    type: "warning",
    time: "15 minutes ago",
    read: false,
  },
  {
    id: "3",
    title: "New customer signup",
    message: "Alice Morgan upgraded to Enterprise plan.",
    type: "info",
    time: "1 hour ago",
    read: false,
  },
  {
    id: "4",
    title: "Weekly report ready",
    message: "Your weekly analytics report is available for download.",
    type: "info",
    time: "3 hours ago",
    read: true,
  },
  {
    id: "5",
    title: "Server maintenance completed",
    message: "Scheduled maintenance finished with no issues.",
    type: "success",
    time: "5 hours ago",
    read: true,
  },
];

const typeConfig = {
  success: { icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50" },
  warning: { icon: AlertTriangle, color: "text-amber-600", bg: "bg-amber-50" },
  info: { icon: Info, color: "text-blue-600", bg: "bg-blue-50" },
};

interface NotificationsPanelProps {
  open: boolean;
  onClose: () => void;
  onUnreadChange: (count: number) => void;
}

export function NotificationsPanel({
  open,
  onClose,
  onUnreadChange,
}: NotificationsPanelProps) {
  const [notifications, setNotifications] = useState(initialNotifications);

  // Calcular unread y notificar al padre via useEffect (no durante render)
  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    onUnreadChange(unreadCount);
  }, [unreadCount, onUnreadChange]);

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, read: true }))
    );
  };

  const dismiss = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="absolute right-4 top-16 w-full max-w-sm rounded-xl border bg-card shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-sm">Notifications</h3>
            {unreadCount > 0 && (
              <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-destructive px-1.5 text-[10px] font-medium text-destructive-foreground">
                {unreadCount}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1"
              >
                Mark all read
              </button>
            )}
            <button
              onClick={onClose}
              className="flex h-7 w-7 items-center justify-center rounded-md hover:bg-accent transition-colors"
            >
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>
        </div>

        <div className="max-h-[360px] overflow-y-auto">
          {notifications.length === 0 && (
            <div className="px-4 py-12 text-center">
              <Clock className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No notifications</p>
            </div>
          )}

          {notifications.map((notification) => {
            const config = typeConfig[notification.type];
            const Icon = config.icon;

            return (
              <div
                key={notification.id}
                className={cn(
                  "relative flex gap-3 px-4 py-3 border-b last:border-b-0 transition-colors",
                  !notification.read && "bg-muted/30"
                )}
              >
                <div className={cn("mt-0.5 h-8 w-8 shrink-0 rounded-full flex items-center justify-center", config.bg)}>
                  <Icon className={cn("h-4 w-4", config.color)} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-medium leading-tight">{notification.title}</p>
                    <button
                      onClick={() => dismiss(notification.id)}
                      className="shrink-0 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                    {notification.message}
                  </p>
                  <div className="flex items-center justify-between mt-1.5">
                    <span className="text-[10px] text-muted-foreground">{notification.time}</span>
                    {!notification.read && (
                      <button
                        onClick={() => markAsRead(notification.id)}
                        className="text-[10px] font-medium text-primary hover:underline"
                      >
                        Mark as read
                      </button>
                    )}
                  </div>
                </div>
                {!notification.read && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-primary" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
