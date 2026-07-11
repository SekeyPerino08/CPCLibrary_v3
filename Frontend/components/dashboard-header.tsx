"use client"

import { Bell, Settings, User } from "lucide-react"
import { ThemeToggle } from "./theme-toggle"

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
          <button className="p-2 hover:bg-muted rounded-lg transition-colors">
            <User size={20} className="text-foreground" />
          </button>
        </div>
      </div>
    </div>
  )
}
