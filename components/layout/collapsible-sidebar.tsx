"use client"

import type React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import Image from "next/image"
import { Home, Droplet, Zap, Factory, Users, User } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { NotificationSidebar } from "./notification-sidebar"

export function CollapsibleSidebar({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  const navItems = [
    { name: "Dashboard", path: "/", icon: Home },
    { name: "Water Analysis", path: "/water", icon: Droplet },
    { name: "Electricity Analysis", path: "/electricity", icon: Zap },
    { name: "STP Plant", path: "/stp-plant", icon: Factory },
    { name: "Contractor Tracker", path: "/contractors", icon: Users },
  ]

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen">
        <Sidebar className="border-r border-border">
          <SidebarHeader className="flex items-center px-4 py-2">
            <div className="flex items-center gap-2">
              <Image src="/logo.png" alt="Muscat Bay Logo" width={36} height={36} />
              <h1 className="font-bold text-xl text-[#4E4456]">Muscat Bay</h1>
            </div>
          </SidebarHeader>

          <SidebarContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton asChild isActive={pathname === item.path} tooltip={item.name}>
                    <Link href={item.path} className="flex items-center gap-2">
                      <item.icon className="h-5 w-5" />
                      <span>{item.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>

          <SidebarFooter className="border-t border-border p-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-[#4E4456] flex items-center justify-center text-white">
                <User className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-medium">Admin User</p>
                <p className="text-xs text-muted-foreground">admin@muscatbay.com</p>
              </div>
            </div>
          </SidebarFooter>
        </Sidebar>

        <div className="flex-1 flex flex-col">
          <div className="sticky top-0 z-10 bg-white border-b border-border h-12 flex items-center px-4 justify-between">
            <div className="flex items-center">
              <SidebarTrigger className="mr-2" />
              <div className="text-sm font-medium">
                {navItems.find((item) => item.path === pathname)?.name || "Dashboard"}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <NotificationSidebar />
            </div>
          </div>

          <main className="flex-1 overflow-auto">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  )
}
