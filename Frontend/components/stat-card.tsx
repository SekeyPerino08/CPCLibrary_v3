import type { ReactNode } from "react"

interface StatCardProps {
  title: string
  value: string | number
  description?: string
  icon: ReactNode
  trend?: {
    value: number
    isPositive: boolean
  }
}

export function StatCard({ title, value, description, icon, trend }: StatCardProps) {
  return (
    <div className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
          <p className="text-3xl font-bold text-foreground">{value}</p>
          {description && <p className="text-xs text-muted-foreground mt-2">{description}</p>}
        </div>
        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
          <div className="text-primary">{icon}</div>
        </div>
      </div>
      {trend && (
        <div className={`text-xs font-medium ${trend.isPositive ? "text-green-600" : "text-red-600"}`}>
          {trend.isPositive ? "↑" : "↓"} {trend.value}% from last month
        </div>
      )}
    </div>
  )
}
