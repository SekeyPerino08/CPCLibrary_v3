"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { X } from "lucide-react"
import type { BorrowRecord } from "@/lib/data"
import { booksData, membersData } from "@/lib/data"

interface BorrowModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (record: Omit<BorrowRecord, "id">) => void
  initialRecord?: BorrowRecord | null
  isEditing?: boolean
}

export function BorrowModal({ isOpen, onClose, onSubmit, initialRecord, isEditing }: BorrowModalProps) {
  const [formData, setFormData] = useState<Omit<BorrowRecord, "id">>({
    bookId: "",
    bookTitle: "",
    memberId: "",
    memberName: "",
    borrowDate: new Date().toISOString().split("T")[0],
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    returnDate: null,
    status: "borrowed",
    fine: 0,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (initialRecord) {
      setFormData(initialRecord)
    } else {
      setFormData({
        bookId: "",
        bookTitle: "",
        memberId: "",
        memberName: "",
        borrowDate: new Date().toISOString().split("T")[0],
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        returnDate: null,
        status: "borrowed",
        fine: 0,
      })
    }
    setErrors({})
  }, [initialRecord, isOpen])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.bookId) newErrors.bookId = "Book is required"
    if (!formData.memberId) newErrors.memberId = "Member is required"
    if (!formData.borrowDate) newErrors.borrowDate = "Borrow date is required"
    if (!formData.dueDate) newErrors.dueDate = "Due date is required"
    return newErrors
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors = validateForm()
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    onSubmit(formData)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-in fade-in duration-200">
      <div className="bg-card border border-border rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-300">
        <div className="flex items-center justify-between p-6 border-b border-border sticky top-0 bg-card">
          <h2 className="text-xl font-bold text-foreground">
            {isEditing ? "Edit Borrow Record" : "Create Borrow Record"}
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-muted rounded transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Book *</label>
              <select
                value={formData.bookId}
                onChange={(e) => {
                  const book = booksData.find((b) => b.id === e.target.value)
                  setFormData({
                    ...formData,
                    bookId: e.target.value,
                    bookTitle: book?.title || "",
                  })
                }}
                className={`w-full px-3 py-2 bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all ${
                  errors.bookId ? "border-red-500" : "border-border"
                }`}
              >
                <option value="">Select a book...</option>
                {booksData.map((book) => (
                  <option key={book.id} value={book.id}>
                    {book.title}
                  </option>
                ))}
              </select>
              {errors.bookId && <p className="text-xs text-red-500 mt-1">{errors.bookId}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Member *</label>
              <select
                value={formData.memberId}
                onChange={(e) => {
                  const member = membersData.find((m) => m.id === e.target.value)
                  setFormData({
                    ...formData,
                    memberId: e.target.value,
                    memberName: member?.name || "",
                  })
                }}
                className={`w-full px-3 py-2 bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all ${
                  errors.memberId ? "border-red-500" : "border-border"
                }`}
              >
                <option value="">Select a member...</option>
                {membersData.map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.name}
                  </option>
                ))}
              </select>
              {errors.memberId && <p className="text-xs text-red-500 mt-1">{errors.memberId}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Borrow Date *</label>
              <input
                type="date"
                value={formData.borrowDate}
                onChange={(e) => setFormData({ ...formData, borrowDate: e.target.value })}
                className={`w-full px-3 py-2 bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all ${
                  errors.borrowDate ? "border-red-500" : "border-border"
                }`}
              />
              {errors.borrowDate && <p className="text-xs text-red-500 mt-1">{errors.borrowDate}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Due Date *</label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className={`w-full px-3 py-2 bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all ${
                  errors.dueDate ? "border-red-500" : "border-border"
                }`}
              />
              {errors.dueDate && <p className="text-xs text-red-500 mt-1">{errors.dueDate}</p>}
            </div>

            {isEditing && (
              <>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Return Date</label>
                  <input
                    type="date"
                    value={formData.returnDate || ""}
                    onChange={(e) => setFormData({ ...formData, returnDate: e.target.value || null })}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                  >
                    <option value="borrowed">Borrowed</option>
                    <option value="returned">Returned</option>
                    <option value="overdue">Overdue</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Fine ($)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.fine}
                    onChange={(e) => setFormData({ ...formData, fine: Number.parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                  />
                </div>
              </>
            )}
          </div>

          <div className="flex gap-3 justify-end pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-foreground hover:bg-muted rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-all transform hover:scale-105"
            >
              {isEditing ? "Update Record" : "Create Record"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
