import { useState } from "react";
import { Badge } from "../common";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "success" | "error" | "info" | "warning";
  timestamp: string;
  read: boolean;
  icon: string;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      title: "Data Sync Complete",
      message: "Your institution data has been successfully synchronized.",
      type: "success",
      timestamp: "2 hours ago",
      read: false,
      icon: "cloud_done",
    },
    {
      id: "2",
      title: "Quality Check Alert",
      message:
        "Data quality issue detected in student records. Review required.",
      type: "warning",
      timestamp: "5 hours ago",
      read: false,
      icon: "warning",
    },
    {
      id: "3",
      title: "System Maintenance",
      message: "Scheduled maintenance will occur on April 15, 2026.",
      type: "info",
      timestamp: "1 day ago",
      read: true,
      icon: "build",
    },
    {
      id: "4",
      title: "New Report Available",
      message: "Your monthly analytics report is ready for download.",
      type: "success",
      timestamp: "2 days ago",
      read: true,
      icon: "description",
    },
    {
      id: "5",
      title: "Security Alert",
      message: "New login from unfamiliar location. Review account activity.",
      type: "error",
      timestamp: "3 days ago",
      read: true,
      icon: "security_alert",
    },
  ]);

  const markAsRead = (id: string) => {
    setNotifications(
      notifications.map((notif) =>
        notif.id === id ? { ...notif, read: true } : notif,
      ),
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter((notif) => notif.id !== id));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map((notif) => ({ ...notif, read: true })));
  };

  const getTypeStyles = (type: string) => {
    const styles: Record<string, string> = {
      success: "bg-secondary/10 border-secondary",
      error: "bg-error/10 border-error",
      info: "bg-tertiary/10 border-tertiary",
      warning: "bg-warning/10 border-warning",
    };
    return styles[type];
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      success: "text-secondary",
      error: "text-error",
      info: "text-tertiary",
      warning: "text-warning",
    };
    return colors[type];
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen bg-surface p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-on-surface">
              Notifications
            </h1>
            <p className="text-on-surface-variant mt-1">
              {unreadCount > 0
                ? `You have ${unreadCount} unread notification${unreadCount !== 1 ? "s" : ""}`
                : "All caught up!"}
            </p>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="px-4 py-2 text-sm font-semibold text-secondary hover:underline transition-colors"
            >
              Mark all as read
            </button>
          )}
        </div>

        {/* Notifications List */}
        {notifications.length === 0 ? (
          <div className="text-center py-16">
            <span className="material-symbols-outlined text-6xl text-outline-variant mb-4 block">
              notifications_off
            </span>
            <p className="text-on-surface-variant text-lg">No notifications</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-5 rounded-lg border-l-4 transition-all cursor-pointer ${getTypeStyles(
                  notification.type,
                )} ${!notification.read ? "bg-opacity-20" : "opacity-75"}`}
                onClick={() => markAsRead(notification.id)}
              >
                <div className="flex items-start gap-4">
                  <span
                    className={`material-symbols-outlined text-2xl flex-shrink-0 ${getTypeColor(
                      notification.type,
                    )}`}
                  >
                    {notification.icon}
                  </span>

                  <div className="flex-grow min-w-0">
                    <div className="flex items-start justify-between gap-3 mb-1">
                      <h3 className="font-semibold text-on-surface">
                        {notification.title}
                      </h3>
                      {!notification.read && (
                        <Badge variant="secondary" className="text-xs">
                          New
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-on-surface-variant mb-2">
                      {notification.message}
                    </p>
                    <p className="text-xs text-on-surface-variant">
                      {notification.timestamp}
                    </p>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNotification(notification.id);
                    }}
                    className="text-outline-variant hover:text-error transition-colors p-1 flex-shrink-0"
                    aria-label="Delete notification"
                  >
                    <span className="material-symbols-outlined">close</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
