"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { X } from "lucide-react"
import type { Member } from "@/lib/data"

interface MemberModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (member: Omit<Member, "id">) => void
  initialMember?: Member | null
  isEditing?: boolean
}

export function MemberModal({ isOpen, onClose, onSubmit, initialMember, isEditing }: MemberModalProps) {
  const [formData, setFormData] = useState<Omit<Member, "id">>({
    name: "",
    email: "",
    phone: "",
    joinDate: new Date().toISOString().split("T")[0],
    membershipStatus: "active",
    booksborrowed: 0,
    totalFines: 0,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (initialMember) {
      const { id, ...rest } = initialMember
      setFormData(rest)
    } else {
      setFormData({
        name: "",
        email: "",
        phone: "",
        joinDate: new Date().toISOString().split("T")[0],
        membershipStatus: "active",
        booksborrowed: 0,
        totalFines: 0,
      })
    }
    setErrors({})
  }, [initialMember, isOpen])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.name.trim()) newErrors.name = "Name is required"
    if (!formData.email.trim()) newErrors.email = "Email is required"
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Invalid email format"
    if (!formData.phone.trim()) newErrors.phone = "Phone is required"
    if (!formData.joinDate) newErrors.joinDate = "Join date is required"
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
          <h2 className="text-xl font-bold text-foreground">{isEditing ? "Edit Member" : "Add New Member"}</h2>
          <button onClick={onClose} className="p-1 hover:bg-muted rounded transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-foreground mb-2">Full Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={`w-full px-3 py-2 bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all ${
                  errors.name ? "border-red-500" : "border-border"
                }`}
                placeholder="Member full name"
              />
              {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Email *</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={`w-full px-3 py-2 bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all ${
                  errors.email ? "border-red-500" : "border-border"
                }`}
                placeholder="member@example.com"
              />
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Phone *</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className={`w-full px-3 py-2 bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all ${
                  errors.phone ? "border-red-500" : "border-border"
                }`}
                placeholder="+1-555-0000"
              />
              {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Join Date *</label>
              <input
                type="date"
                value={formData.joinDate}
                onChange={(e) => setFormData({ ...formData, joinDate: e.target.value })}
                className={`w-full px-3 py-2 bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all ${
                  errors.joinDate ? "border-red-500" : "border-border"
                }`}
              />
              {errors.joinDate && <p className="text-xs text-red-500 mt-1">{errors.joinDate}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Membership Status</label>
              <select
                value={formData.membershipStatus}
                onChange={(e) =>
                  setFormData({ ...formData, membershipStatus: e.target.value as "active" | "inactive" })
                }
                className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            {isEditing && (
              <>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Books Borrowed</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.booksborrowed}
                    onChange={(e) => setFormData({ ...formData, booksborrowed: Number.parseInt(e.target.value) })}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Total Fines ($)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.totalFines}
                    onChange={(e) => setFormData({ ...formData, totalFines: Number.parseFloat(e.target.value) })}
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
              {isEditing ? "Update Member" : "Add Member"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
