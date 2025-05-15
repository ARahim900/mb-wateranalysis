"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type Theme = "light" | "dark"

interface User {
  id: string
  name: string
  email: string
  role: string
}

interface Notification {
  id: string
  message: string
  type: "info" | "warning" | "success" | "error"
  timestamp: string
  read: boolean
}

interface AppContextType {
  user: User | null
  theme: Theme
  notifications: Notification[]
  setUser: (user: User | null) => void
  setTheme: (theme: Theme) => void
  addNotification: (notification: Omit<Notification, "id" | "timestamp" | "read">) => void
  markNotificationAsRead: (id: string) => void
  clearNotifications: () => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [theme, setTheme] = useState<Theme>("light")
  const [notifications, setNotifications] = useState<Notification[]>([])

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    // Check if localStorage is available (client-side)
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("theme") as Theme | null

      if (savedTheme) {
        setTheme(savedTheme)
      } else if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
        setTheme("dark")
      }
    }
  }, [])

  // Update localStorage and apply theme when it changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("theme", theme)

      if (theme === "dark") {
        document.documentElement.classList.add("dark")
      } else {
        document.documentElement.classList.remove("dark")
      }
    }
  }, [theme])

  // Add a new notification
  const addNotification = (notification: Omit<Notification, "id" | "timestamp" | "read">) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      read: false,
    }

    setNotifications((prev) => [newNotification, ...prev])
  }

  // Mark a notification as read
  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
    )
  }

  // Clear all notifications
  const clearNotifications = () => {
    setNotifications([])
  }

  return (
    <AppContext.Provider
      value={{
        user,
        theme,
        notifications,
        setUser,
        setTheme,
        addNotification,
        markNotificationAsRead,
        clearNotifications,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider")
  }
  return context
}
