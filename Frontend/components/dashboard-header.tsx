"use client"

import Link from "next/link"
import { Bell, Settings, User, LogOut } from "lucide-react"

import { ThemeToggle } from "./theme-toggle"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function DashboardHeader() {
  return (
    <div className="bg-card border-b border-border px-6 py-4">
      <div className="flex items-center justify-between max-w-full">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Library Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">Welcome back! Here's your library overview.</p>
        </div>

        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-muted rounded-lg transition-colors">
            <Bell size={20} className="text-foreground" />
          </button>
          <button className="p-2 hover:bg-muted rounded-lg transition-colors">
            <Settings size={20} className="text-foreground" />
          </button>
          <ThemeToggle />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="p-2 hover:bg-muted rounded-lg transition-colors"
                aria-label="Open profile menu"
              >
                <User size={20} className="text-foreground" />
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem asChild>
                <Link href="/members">Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/books">Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onSelect={(e) => {
                  // prevent Radix default navigation
                  e.preventDefault()
                  localStorage.removeItem("library_auth_mock")
                  localStorage.removeItem("library_login_mock")
                  window.location.href = "/login"
                }}
              >
                <span className="inline-flex items-center gap-2">
                  <LogOut size={16} />
                  Logout
                </span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  )
}

