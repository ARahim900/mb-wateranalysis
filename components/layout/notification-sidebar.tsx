"use client"

import { useState } from "react"
import { X, Bell, ArrowLeft } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface Notification {
  id: string
  title: string
  message: string
  time: string
  read: boolean
  type: "info" | "warning" | "error"
}

export function NotificationSidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      title: "Water Usage Alert",
      message: "Water consumption in Zone 3 is 15% higher than average",
      time: "10 minutes ago",
      read: false,
      type: "warning",
    },
    {
      id: "2",
      title: "Electricity System Update",
      message: "Monthly report for April 2025 is now available",
      time: "2 hours ago",
      read: false,
      type: "info",
    },
    {
      id: "3",
      title: "STP Plant Maintenance",
      message: "Scheduled maintenance completed successfully",
      time: "Yesterday",
      read: true,
      type: "info",
    },
  ])

  const markAsRead = (id: string) => {
    setNotifications(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })))
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <>
      <button onClick={() => setIsOpen(true)} className="relative" aria-label="Open notifications">
        <Bell className="h-5 w-5 text-muted-foreground" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex justify-end">
          <div className="w-full max-w-md bg-white h-full overflow-auto animate-in slide-in-from-right">
            <div className="sticky top-0 bg-white z-10 border-b border-border p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} aria-label="Close notifications">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <h2 className="font-semibold">Notifications</h2>
              </div>

              <Button variant="ghost" size="sm" onClick={markAllAsRead} disabled={unreadCount === 0}>
                Mark all as read
              </Button>
            </div>

            <div className="p-4 space-y-3">
              {notifications.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">No notifications</div>
              ) : (
                notifications.map((notification) => (
                  <Card
                    key={notification.id}
                    className={`p-3 ${notification.read ? "bg-muted/30" : "bg-white border-l-4 border-l-blue-500"}`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-sm">{notification.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                        <p className="text-xs text-muted-foreground mt-2">{notification.time}</p>
                      </div>

                      {!notification.read && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => markAsRead(notification.id)}
                          aria-label="Mark as read"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </Card>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
