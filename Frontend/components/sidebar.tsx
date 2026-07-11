"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BookOpen, Users, RotateCw, BarChart3, Menu, X } from "lucide-react"
import { useState } from "react"

export function Sidebar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  const navItems = [
    {
      href: "/",
      label: "Dashboard",
      icon: BarChart3,
    },
    {
      href: "/books",
      label: "Books",
      icon: BookOpen,
    },
    {
      href: "/members",
      label: "Members",
      icon: Users,
    },
    {
      href: "/borrows",
      label: "Borrow Requests",
      icon: RotateCw,
    },
  ]

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden p-2 rounded-lg bg-primary text-primary-foreground"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {isOpen && <div className="fixed inset-0 z-40 lg:hidden bg-background/80" onClick={() => setIsOpen(false)} />}

      <aside
        className={`fixed left-0 top-0 z-40 h-screen w-64 bg-sidebar border-r border-sidebar-border transition-transform lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center gap-3 px-6 py-8 border-b border-sidebar-border">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <BookOpen className="text-primary-foreground" size={24} />
            </div>
            <div>
              <h1 className="font-bold text-lg text-sidebar-foreground">Cordova Public College</h1>
              <p className="text-xs text-sidebar-foreground/60">Library Management System</p>
            </div>
          </div>

          <nav className="flex-1 px-4 py-6 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? "bg-sidebar-primary text-sidebar-primary-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </Link>
              )
            })}
          </nav>

          <div className="px-6 py-4 border-t border-sidebar-border">
            <p className="text-xs text-sidebar-foreground/60">© 2026 Cordova Public College. All rights reserved.</p>
          </div>
        </div>
      </aside>
    </>
  )
}
