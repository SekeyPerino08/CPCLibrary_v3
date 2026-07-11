"use client"

import { Sidebar } from "@/components/sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { StatCard } from "@/components/stat-card"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { BookOpen, Users, RotateCw, AlertCircle } from "lucide-react"
import { booksData, membersData, borrowRecordsData } from "@/lib/data"

const borrowTrendData = [
  { month: "Jan", borrows: 24, returns: 18 },
  { month: "Feb", borrows: 32, returns: 28 },
  { month: "Mar", borrows: 28, returns: 25 },
  { month: "Apr", borrows: 35, returns: 32 },
  { month: "May", borrows: 42, returns: 38 },
  { month: "Jun", borrows: 38, returns: 35 },
]

const categoryData = [
  { name: "Fiction", value: 45 },
  { name: "Non-Fiction", value: 25 },
  { name: "Dystopian", value: 15 },
  { name: "Memoir", value: 15 },
]

const COLORS = ["oklch(0.35 0.15 231.5)", "oklch(0.55 0.12 231.5)", "oklch(0.65 0.15 41.5)", "oklch(0.45 0.12 270.5)"]

export default function Dashboard() {
  const totalBooks = booksData.reduce((acc, book) => acc + book.totalCopies, 0)
  const availableBooks = booksData.reduce((acc, book) => acc + book.availableCopies, 0)
  const activeMembers = membersData.filter((m) => m.membershipStatus === "active").length
  const overdueBooks = borrowRecordsData.filter((r) => r.status === "overdue").length

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 lg:ml-64">
        <DashboardHeader />
        <div className="p-6 max-w-7xl mx-auto space-y-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Total Books"
              value={totalBooks}
              description={`${availableBooks} available`}
              icon={<BookOpen size={24} />}
              trend={{ value: 12, isPositive: true }}
            />
            <StatCard
              title="Active Members"
              value={activeMembers}
              description={`${membersData.length} total members`}
              icon={<Users size={24} />}
              trend={{ value: 8, isPositive: true }}
            />
            <StatCard
              title="Books Borrowed"
              value={borrowRecordsData.filter((r) => r.status === "borrowed").length}
              description="Currently out"
              icon={<RotateCw size={24} />}
              trend={{ value: 3, isPositive: false }}
            />
            <StatCard
              title="Overdue Books"
              value={overdueBooks}
              description="Action required"
              icon={<AlertCircle size={24} />}
              trend={{ value: 2, isPositive: false }}
            />
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Borrow Trend Chart */}
            <div className="lg:col-span-2 bg-card border border-border rounded-lg p-6">
              <h2 className="text-lg font-bold text-foreground mb-6">Borrow Trends</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={borrowTrendData}>
                  <CartesianGrid stroke="var(--color-border)" />
                  <XAxis stroke="var(--color-muted-foreground)" />
                  <YAxis stroke="var(--color-muted-foreground)" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--color-card)",
                      border: "1px solid var(--color-border)",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="borrows" stroke="var(--color-primary)" strokeWidth={2} />
                  <Line type="monotone" dataKey="returns" stroke="var(--color-accent)" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Category Distribution */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-lg font-bold text-foreground mb-6">Category Distribution</h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--color-card)",
                      border: "1px solid var(--color-border)",
                      borderRadius: "8px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-lg font-bold text-foreground mb-6">Recent Borrow Activity</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Book</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Member</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Borrow Date</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Due Date</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {borrowRecordsData.slice(0, 5).map((record) => (
                    <tr key={record.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                      <td className="py-3 px-4 text-foreground">{record.bookTitle}</td>
                      <td className="py-3 px-4 text-foreground">{record.memberName}</td>
                      <td className="py-3 px-4 text-muted-foreground">{record.borrowDate}</td>
                      <td className="py-3 px-4 text-muted-foreground">{record.dueDate}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                            record.status === "borrowed"
                              ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
                              : record.status === "returned"
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                                : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                          }`}
                        >
                          {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
