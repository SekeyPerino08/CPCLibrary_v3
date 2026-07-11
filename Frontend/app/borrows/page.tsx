"use client"

import { Sidebar } from "@/components/sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { useState, useEffect } from "react"
import { Search, Plus, Edit2, Trash2, CheckCircle, RotateCw, AlertCircle, Calendar } from "lucide-react"
import { BorrowModal } from "@/components/borrow-modal"
import { ConfirmDialog } from "@/components/confirm-dialog"
import type { BorrowRecord } from "@/lib/data"
import { borrowRecordsData as initialBorrowsData } from "@/lib/data"
import { useToast } from "@/hooks/use-toast"

export default function BorrowsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [borrows, setBorrows] = useState<BorrowRecord[]>(initialBorrowsData)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingRecord, setEditingRecord] = useState<BorrowRecord | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; recordId: string | null }>({
    isOpen: false,
    recordId: null,
  })
  const { addToast } = useToast()

  useEffect(() => {
    const saved = localStorage.getItem("library_borrows")
    if (saved) {
      try {
        setBorrows(JSON.parse(saved))
      } catch (e) {
        console.error("Failed to load borrows from localStorage")
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("library_borrows", JSON.stringify(borrows))
  }, [borrows])

  const filteredRecords = borrows.filter((record) => {
    const matchesSearch =
      record.bookTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.memberName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || record.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "borrowed":
        return <RotateCw size={16} className="text-blue-600 dark:text-blue-400" />
      case "returned":
        return <CheckCircle size={16} className="text-green-600 dark:text-green-400" />
      case "overdue":
        return <AlertCircle size={16} className="text-red-600 dark:text-red-400" />
      default:
        return null
    }
  }

  const handleAddRecord = (recordData: Omit<BorrowRecord, "id">) => {
    const newRecord: BorrowRecord = {
      ...recordData,
      id: Date.now().toString(),
    }
    setBorrows([...borrows, newRecord])
    setIsModalOpen(false)
    addToast({
      title: "Success",
      description: `Borrow record for "${recordData.bookTitle}" has been created!`,
      type: "success",
    })
  }

  const handleEditRecord = (recordData: Omit<BorrowRecord, "id">) => {
    if (!editingRecord) return
    const updated = borrows.map((r) => (r.id === editingRecord.id ? { ...r, ...recordData } : r))
    setBorrows(updated)
    setEditingRecord(null)
    setIsModalOpen(false)
    addToast({
      title: "Success",
      description: `Borrow record has been updated successfully!`,
      type: "success",
    })
  }

  const handleDeleteRecord = () => {
    if (!deleteConfirm.recordId) return
    const record = borrows.find((r) => r.id === deleteConfirm.recordId)
    setBorrows(borrows.filter((r) => r.id !== deleteConfirm.recordId))
    setDeleteConfirm({ isOpen: false, recordId: null })
    addToast({
      title: "Success",
      description: `Borrow record for "${record?.bookTitle}" has been deleted!`,
      type: "success",
    })
  }

  const handleMarkReturned = (record: BorrowRecord) => {
    const updated = borrows.map((r) =>
      r.id === record.id
        ? {
            ...r,
            status: "returned" as const,
            returnDate: new Date().toISOString().split("T")[0],
            fine: 0,
          }
        : r,
    )
    setBorrows(updated)
    addToast({
      title: "Success",
      description: `"${record.bookTitle}" marked as returned!`,
      type: "success",
    })
  }

  const handleCollectFine = (record: BorrowRecord) => {
    const updated = borrows.map((r) =>
      r.id === record.id
        ? {
            ...r,
            fine: 0,
          }
        : r,
    )
    setBorrows(updated)
    addToast({
      title: "Success",
      description: `Fine of $${record.fine.toFixed(2)} has been collected!`,
      type: "success",
    })
  }

  const openEditModal = (record: BorrowRecord) => {
    setEditingRecord(record)
    setIsModalOpen(true)
  }

  const openDeleteConfirm = (recordId: string) => {
    setDeleteConfirm({ isOpen: true, recordId })
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingRecord(null)
  }

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 lg:ml-64">
        <DashboardHeader />
        <div className="p-6 max-w-7xl mx-auto space-y-6">
          {/* Header with Add Button */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Calendar size={24} className="text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Borrow Records</h1>
                <p className="text-muted-foreground mt-1">Track book borrowing and returns ({borrows.length} total)</p>
              </div>
            </div>
            <button
              onClick={() => {
                setEditingRecord(null)
                setIsModalOpen(true)
              }}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 active:scale-95 transition-all duration-200"
            >
              <Plus size={20} />
              New Record
            </button>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 text-muted-foreground" size={20} />
              <input
                type="text"
                placeholder="Search by book or member..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-card border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
            >
              <option value="all">All Status</option>
              <option value="borrowed">Borrowed</option>
              <option value="returned">Returned</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>

          {/* Records Table */}
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted border-b border-border">
                  <tr>
                    <th className="text-left py-4 px-6 font-semibold text-foreground">Book</th>
                    <th className="text-left py-4 px-6 font-semibold text-foreground">Member</th>
                    <th className="text-left py-4 px-6 font-semibold text-foreground">Borrow Date</th>
                    <th className="text-left py-4 px-6 font-semibold text-foreground">Due Date</th>
                    <th className="text-left py-4 px-6 font-semibold text-foreground">Return Date</th>
                    <th className="text-left py-4 px-6 font-semibold text-foreground">Status</th>
                    <th className="text-left py-4 px-6 font-semibold text-foreground">Fine</th>
                    <th className="text-left py-4 px-6 font-semibold text-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRecords.map((record) => (
                    <tr key={record.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                      <td className="py-4 px-6 text-foreground font-medium">{record.bookTitle}</td>
                      <td className="py-4 px-6 text-foreground">{record.memberName}</td>
                      <td className="py-4 px-6 text-muted-foreground">{record.borrowDate}</td>
                      <td className="py-4 px-6 text-muted-foreground">{record.dueDate}</td>
                      <td className="py-4 px-6 text-muted-foreground">{record.returnDate || "-"}</td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(record.status)}
                          <span
                            className={`text-xs font-semibold px-2 py-1 rounded-full ${
                              record.status === "borrowed"
                                ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
                                : record.status === "returned"
                                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                                  : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                            }`}
                          >
                            {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`font-semibold ${record.fine > 0 ? "text-destructive" : "text-green-600 dark:text-green-400"}`}
                        >
                          {record.fine > 0 ? `$${record.fine.toFixed(2)}` : "Free"}
                        </span>
                      </td>
                      <td className="py-4 px-6 flex gap-2">
                        {record.status === "borrowed" && (
                          <button
                            onClick={() => handleMarkReturned(record)}
                            className="px-3 py-1 bg-primary text-primary-foreground rounded text-sm font-medium hover:opacity-90 active:scale-95 transition-all"
                          >
                            Mark Returned
                          </button>
                        )}
                        {record.status === "overdue" && record.fine > 0 && (
                          <button
                            onClick={() => handleCollectFine(record)}
                            className="px-3 py-1 bg-destructive text-destructive-foreground rounded text-sm font-medium hover:opacity-90 active:scale-95 transition-all"
                          >
                            Collect Fine
                          </button>
                        )}
                        <button
                          onClick={() => openEditModal(record)}
                          className="p-2 text-primary hover:bg-primary/10 active:scale-95 rounded transition-all"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => openDeleteConfirm(record.id)}
                          className="p-2 text-destructive hover:bg-destructive/10 active:scale-95 rounded transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {filteredRecords.length === 0 && (
            <div className="text-center py-12">
              <Calendar size={48} className="mx-auto text-muted-foreground mb-3 opacity-50" />
              <p className="text-muted-foreground text-lg">No records found</p>
            </div>
          )}
        </div>
      </main>

      <BorrowModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={editingRecord ? handleEditRecord : handleAddRecord}
        initialRecord={editingRecord}
        isEditing={!!editingRecord}
      />

      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        title="Delete Borrow Record"
        message="Are you sure you want to delete this borrow record? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        isDangerous={true}
        onConfirm={handleDeleteRecord}
        onCancel={() => setDeleteConfirm({ isOpen: false, recordId: null })}
      />
    </div>
  )
}
