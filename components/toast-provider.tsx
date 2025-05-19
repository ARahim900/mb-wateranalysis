"use client"

import type React from "react"

import { useToast } from "@/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider as Provider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const { toasts, dismissToast } = useToast()

  return (
    <Provider>
      {children}
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          variant={toast.type === "success" ? "success" : toast.type === "error" ? "destructive" : "default"}
        >
          <div className="grid gap-1">
            <ToastTitle>{toast.title}</ToastTitle>
            {toast.description && <ToastDescription>{toast.description}</ToastDescription>}
          </div>
          <ToastClose onClick={() => dismissToast(toast.id)} />
        </Toast>
      ))}
      <ToastViewport />
    </Provider>
  )
}
