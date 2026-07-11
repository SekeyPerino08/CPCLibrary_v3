"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import type { Book } from "@/lib/data"

interface BookModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (book: Omit<Book, "id">) => void
  initialBook?: Book | null
  isEditing?: boolean
}

export function BookModal({ isOpen, onClose, onSubmit, initialBook, isEditing }: BookModalProps) {
  const [formData, setFormData] = useState<Omit<Book, "id">>({
    title: "",
    author: "",
    isbn: "",
    category: "Fiction",
    totalCopies: 1,
    availableCopies: 1,
    publishedYear: new Date().getFullYear(),
    description: "",
    coverImage: "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (initialBook) {
      const { id, ...rest } = initialBook
      setFormData(rest)
    } else {
      setFormData({
        title: "",
        author: "",
        isbn: "",
        category: "Fiction",
        totalCopies: 1,
        availableCopies: 1,
        publishedYear: new Date().getFullYear(),
        description: "",
        coverImage: "",
      })
    }
    setErrors({})
  }, [initialBook, isOpen])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.title.trim()) newErrors.title = "Title is required"
    if (!formData.author.trim()) newErrors.author = "Author is required"
    if (!formData.isbn.trim()) newErrors.isbn = "ISBN is required"
    if (formData.totalCopies < 1) newErrors.totalCopies = "Must have at least 1 copy"
    if (formData.availableCopies > formData.totalCopies) {
      newErrors.availableCopies = "Available copies cannot exceed total copies"
    }
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
          <h2 className="text-xl font-bold text-foreground">{isEditing ? "Edit Book" : "Add New Book"}</h2>
          <button onClick={onClose} className="p-1 hover:bg-muted rounded transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className={`w-full px-3 py-2 bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all ${
                  errors.title ? "border-red-500" : "border-border"
                }`}
                placeholder="Book title"
              />
              {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Author *</label>
              <input
                type="text"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                className={`w-full px-3 py-2 bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all ${
                  errors.author ? "border-red-500" : "border-border"
                }`}
                placeholder="Author name"
              />
              {errors.author && <p className="text-xs text-red-500 mt-1">{errors.author}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">ISBN *</label>
              <input
                type="text"
                value={formData.isbn}
                onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
                className={`w-full px-3 py-2 bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all ${
                  errors.isbn ? "border-red-500" : "border-border"
                }`}
                placeholder="ISBN number"
              />
              {errors.isbn && <p className="text-xs text-red-500 mt-1">{errors.isbn}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all"
              >
                <option>Fiction</option>
                <option>Non-Fiction</option>
                <option>Dystopian</option>
                <option>Memoir</option>
                <option>Science</option>
                <option>History</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Total Copies *</label>
              <input
                type="number"
                min="1"
                value={formData.totalCopies}
                onChange={(e) => setFormData({ ...formData, totalCopies: Number.parseInt(e.target.value) })}
                className={`w-full px-3 py-2 bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all ${
                  errors.totalCopies ? "border-red-500" : "border-border"
                }`}
              />
              {errors.totalCopies && <p className="text-xs text-red-500 mt-1">{errors.totalCopies}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Available Copies</label>
              <input
                type="number"
                min="0"
                value={formData.availableCopies}
                onChange={(e) => setFormData({ ...formData, availableCopies: Number.parseInt(e.target.value) })}
                className={`w-full px-3 py-2 bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all ${
                  errors.availableCopies ? "border-red-500" : "border-border"
                }`}
              />
              {errors.availableCopies && <p className="text-xs text-red-500 mt-1">{errors.availableCopies}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Published Year</label>
              <input
                type="number"
                min="1000"
                max={new Date().getFullYear()}
                value={formData.publishedYear}
                onChange={(e) => setFormData({ ...formData, publishedYear: Number.parseInt(e.target.value) })}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Cover Image URL</label>
              <input
                type="url"
                value={formData.coverImage}
                onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                placeholder="https://example.com/cover.jpg"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all resize-none"
              placeholder="Book description..."
              rows={4}
            />
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
              {isEditing ? "Update Book" : "Add Book"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
