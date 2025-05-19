import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { CollapsibleSidebar } from "@/components/layout/collapsible-sidebar"
import { ToastProvider } from "@/components/toast-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Muscat Bay Utility Management",
  description: "Utility Management System for Muscat Bay",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ToastProvider>
          <CollapsibleSidebar>{children}</CollapsibleSidebar>
        </ToastProvider>
      </body>
    </html>
  )
}
