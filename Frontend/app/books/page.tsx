"use client"

import { Sidebar } from "@/components/sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { BookModal } from "@/components/book-modal"
import { useToast } from "@/components/toast-provider"
import type { Book } from "@/lib/data"
import { useState, useEffect } from "react"
import { Search, Plus, Edit2, Trash2, Eye, LayoutGrid, List } from "lucide-react"

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"


export default function BooksPage() {
  const { addToast } = useToast()
  const [books, setBooks] = useState<Book[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid")

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingBook, setEditingBook] = useState<Book | null>(null)

  // Load books from localStorage on mount
  useEffect(() => {
    const savedBooks = localStorage.getItem("libraryBooks")

    if (!savedBooks) {
      loadDefaultBooks()
      return
    }

    try {
      const parsed = JSON.parse(savedBooks)

      const isValidArray = Array.isArray(parsed) && parsed.length > 0
      const hasRequiredFields =
        isValidArray &&
        parsed.some(
          (b: Partial<Book>) =>
            typeof b?.title === "string" &&
            typeof b?.author === "string" &&
            typeof b?.coverImage === "string" &&
            typeof b?.publishedYear === "number" &&
            typeof b?.totalCopies === "number" &&
            typeof b?.availableCopies === "number" &&
            typeof b?.category === "string" &&
            typeof b?.isbn === "string" &&
            typeof b?.id === "string",
        )

      if (!isValidArray || !hasRequiredFields) {
        loadDefaultBooks()
        return
      }

      setBooks(parsed as Book[])
    } catch (e) {
      console.error("Failed to load books:", e)
      loadDefaultBooks()
    }
  }, [])

  // In case localStorage contains valid data but the page still ends up empty
  useEffect(() => {
    if (books.length === 0) loadDefaultBooks()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [books.length])



  // Save books to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("libraryBooks", JSON.stringify(books))
  }, [books])

  const loadDefaultBooks = () => {
    // Keep UI sample data in sync with lib/data.ts (used across the app)
    const defaultBooks: Book[] = [
      {
        id: "1",
        title: "The Great Gatsby",
        author: "F. Scott Fitzgerald",
        isbn: "978-0-7432-7356-5",
        category: "Fiction",
        totalCopies: 5,
        availableCopies: 2,
        publishedYear: 1925,
        description: "A novel of the Jazz Age set in New York.",
        coverImage: "/great-gatsby-book-cover.png",
      },
      {
        id: "2",
        title: "To Kill a Mockingbird",
        author: "Harper Lee",
        isbn: "978-0-06-112008-4",
        category: "Fiction",
        totalCopies: 4,
        availableCopies: 1,
        publishedYear: 1960,
        description: "A gripping tale of racial injustice and childhood innocence.",
        coverImage: "/to-kill-a-mockingbird-cover.png",
      },
      {
        id: "3",
        title: "1984",
        author: "George Orwell",
        isbn: "978-0-451-52493-2",
        category: "Dystopian",
        totalCopies: 6,
        availableCopies: 3,
        publishedYear: 1949,
        description: "A totalitarian state and individual freedom.",
        coverImage: "/1984-book-cover.png",
      },
      {
        id: "4",
        title: "Sapiens",
        author: "Yuval Noah Harari",
        isbn: "978-0-06-231609-7",
        category: "Non-Fiction",
        totalCopies: 5,
        availableCopies: 4,
        publishedYear: 2011,
        description: "A brief history of humankind.",
        coverImage: "/sapiens-book-cover.png",
      },
      {
        id: "5",
        title: "Educated",
        author: "Tara Westover",
        isbn: "978-0-399-59028-8",
        category: "Memoir",
        totalCopies: 4,
        availableCopies: 2,
        publishedYear: 2018,
        description: "A memoir about a woman who leaves her survivalist family.",
        coverImage: "/educated-book-cover.png",
      },
      {
        id: "6",
        title: "The Catcher in the Rye",
        author: "J.D. Salinger",
        isbn: "978-0-316-76948-0",
        category: "Fiction",
        totalCopies: 3,
        availableCopies: 1,
        publishedYear: 1951,
        description: "A story of teenage rebellion and alienation.",
        coverImage: "/catcher-in-the-rye-cover.png",
      },
    ]
    setBooks(defaultBooks)
  }


  const categories = ["all", ...Array.from(new Set(books.map((b) => b.category)))]

  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || book.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 6

  const totalPages = Math.max(1, Math.ceil(filteredBooks.length / pageSize))

  const paginatedBooks = filteredBooks.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  )

  // Reset to the first page when the filter/search changes
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, selectedCategory])

  // Clamp current page when filtered result count changes
  useEffect(() => {
    setCurrentPage((p) => Math.min(p, totalPages))
  }, [totalPages])


  const handleAddBook = (bookData: Omit<Book, "id">) => {
    const newBook: Book = {
      ...bookData,
      id: Date.now().toString(),
    }
    setBooks([...books, newBook])
    addToast({
      title: "Success!",
      description: `"${bookData.title}" has been added to the library.`,
      type: "success",
    })
  }

  const handleEditBook = (bookData: Omit<Book, "id">) => {
    if (!editingBook) return
    const updatedBooks = books.map((book) => (book.id === editingBook.id ? { ...book, ...bookData } : book))
    setBooks(updatedBooks)
    setEditingBook(null)
    addToast({
      title: "Updated!",
      description: `"${bookData.title}" has been updated successfully.`,
      type: "success",
    })
  }

  const handleDeleteBook = (id: string, title: string) => {
    setBooks(books.filter((book) => book.id !== id))
    addToast({
      title: "Deleted!",
      description: `"${title}" has been removed from the library.`,
      type: "info",
    })
  }

  const handleOpenModal = (book?: Book) => {
    if (book) {
      setEditingBook(book)
    } else {
      setEditingBook(null)
    }
    setIsModalOpen(true)
  }

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 lg:ml-64">
        <DashboardHeader />
        <div className="p-6 max-w-7xl mx-auto space-y-6">
          {/* Header with Add Button */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Books Collection</h1>
              <p className="text-muted-foreground mt-1">Manage your library's book collection</p>
            </div>
            <button
              onClick={() => handleOpenModal()}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-all transform hover:scale-105 active:scale-95"
            >
              <Plus size={20} />
              Add Book
            </button>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 text-muted-foreground" size={20} />
              <input
                type="text"
                placeholder="Search by title or author..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-card border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
              />
            </div>

            {/* View Toggle */}
            <div className="flex items-center gap-3">
              <div className="inline-flex items-center rounded-lg border border-border bg-card p-1 shadow-sm">
                <button
                  type="button"
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === "grid" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"
                  }`}
                  aria-pressed={viewMode === "grid"}
                  title="Grid view"
                >
                  <LayoutGrid size={18} />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("table")}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === "table" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"
                  }`}
                  aria-pressed={viewMode === "table"}
                  title="Table view"
                >
                  <List size={18} />
                </button>
              </div>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>


          {/* Books Grid / Table */}
          {viewMode === "grid" ? (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedBooks.map((book) => (
                  <div
                    key={book.id}
                    className="bg-card border border-border/70 rounded-xl overflow-hidden hover:shadow-md hover:border-primary/40 transition-all duration-300"
                  >
                    <div className="relative h-48 bg-muted overflow-hidden">
                      <img
                        src={book.coverImage || "/placeholder.svg"}
                        alt={book.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/0 hover:bg-black/50 transition-colors flex items-center justify-center opacity-0 hover:opacity-100 duration-200">
                        <button className="p-2 bg-primary text-primary-foreground rounded-lg hover:bg-opacity-90 transform hover:scale-110 transition-all">
                          <Eye size={20} />
                        </button>
                      </div>
                    </div>

                    <div className="p-4 space-y-3">
                      <div>
                        <h3 className="font-bold text-foreground text-sm leading-tight line-clamp-2">
                          {book.title}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-1">{book.author}</p>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center rounded-full bg-primary/10 text-primary px-3 py-1 text-[11px] font-semibold">
                          {book.category}
                        </span>
                        <span className="text-xs font-medium text-muted-foreground">{book.publishedYear}</span>
                      </div>

                      <div className="flex items-center justify-between gap-3 py-2 border-y border-border/60">
                        <span
                          className={`text-xs font-semibold ${
                            book.availableCopies > 0 ? "text-primary" : "text-muted-foreground"
                          }`}
                        >
                          {book.availableCopies > 0 ? "Available" : "Borrowed"}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {book.availableCopies > 0
                            ? `${book.availableCopies} left`
                            : `${book.totalCopies} total`}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="bg-muted/50 p-2 rounded-lg text-center">
                          <p className="text-muted-foreground">Available</p>
                          <p className="font-bold text-foreground">{book.availableCopies}</p>
                        </div>
                        <div className="bg-muted/50 p-2 rounded-lg text-center">
                          <p className="text-muted-foreground">Total</p>
                          <p className="font-bold text-foreground">{book.totalCopies}</p>
                        </div>
                      </div>

                      <div className="flex gap-2 pt-1">
                        <button
                          onClick={() => handleOpenModal(book)}
                          className="flex-1 p-2 bg-primary/10 text-primary rounded hover:bg-primary/20 transition-all transform hover:scale-105 active:scale-95 text-sm font-medium"
                        >
                          <Edit2 size={16} className="inline mr-1" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteBook(book.id, book.title)}
                          className="flex-1 p-2 bg-destructive/10 text-destructive rounded hover:bg-destructive/20 transition-all transform hover:scale-105 active:scale-95 text-sm font-medium"
                        >
                          <Trash2 size={16} className="inline mr-1" />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filteredBooks.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No books found</p>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-card border border-border/70 rounded-xl overflow-hidden">
              {filteredBooks.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No books found</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead className="bg-muted/30">
                      <tr className="text-xs text-muted-foreground">
                        <th className="text-left font-semibold px-4 py-3">Book</th>
                        <th className="text-left font-semibold px-4 py-3">Genre</th>
                        <th className="text-left font-semibold px-4 py-3">Year</th>
                        <th className="text-left font-semibold px-4 py-3">Status</th>
                        <th className="text-right font-semibold px-4 py-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/70">
                      {paginatedBooks.map((book) => (
                        <tr key={book.id} className="hover:bg-muted/20">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-12 rounded-md overflow-hidden border border-border/70 bg-muted">
                                <img
                                  src={book.coverImage || "/placeholder.svg"}
                                  alt={book.title}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div>
                                <div className="text-sm font-semibold text-foreground line-clamp-1">
                                  {book.title}
                                </div>
                                <div className="text-xs text-muted-foreground line-clamp-1">{book.author}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className="inline-flex items-center rounded-full bg-primary/10 text-primary px-3 py-1 text-[11px] font-semibold">
                              {book.category}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-muted-foreground">{book.publishedYear}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <span
                                className={`text-xs font-semibold ${
                                  book.availableCopies > 0 ? "text-primary" : "text-muted-foreground"
                                }`}
                              >
                                {book.availableCopies > 0 ? "Available" : "Borrowed"}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {book.availableCopies > 0
                                  ? `${book.availableCopies} left`
                                  : `${book.totalCopies} total`}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => handleOpenModal(book)}
                                className="p-2 bg-primary/10 text-primary rounded hover:bg-primary/20 transition-all transform hover:scale-105 active:scale-95"
                                aria-label={`Edit ${book.title}`}
                              >
                                <Edit2 size={16} />
                              </button>
                              <button
                                onClick={() => handleDeleteBook(book.id, book.title)}
                                className="p-2 bg-destructive/10 text-destructive rounded hover:bg-destructive/20 transition-all transform hover:scale-105 active:scale-95"
                                aria-label={`Delete ${book.title}`}
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}



          {/* Debug (safe): ensure hydration and localStorage loads */}
          {typeof window === "undefined" ? null : null}


          {/* Pagination */}
          {filteredBooks.length > 0 && totalPages > 1 && (
            <div className="pt-4 flex justify-center">
              <Pagination>
                <PaginationContent>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      setCurrentPage((p) => Math.max(1, p - 1))
                    }}
                    aria-disabled={currentPage <= 1}
                    style={{
                      pointerEvents: currentPage <= 1 ? "none" : undefined,
                      opacity: currentPage <= 1 ? 0.5 : 1,
                    }}
                  />

                  {totalPages <= 7
                    ? Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <PaginationLink
                          key={page}
                          href="#"
                          isActive={page === currentPage}
                          onClick={(e) => {
                            e.preventDefault()
                            setCurrentPage(page)
                          }}
                        >
                          {page}
                        </PaginationLink>
                      ))
                    : (
                        <>
                          {[1, 2].map((page) => (
                            <PaginationLink
                              key={page}
                              href="#"
                              isActive={page === currentPage}
                              onClick={(e) => {
                                e.preventDefault()
                                setCurrentPage(page)
                              }}
                            >
                              {page}
                            </PaginationLink>
                          ))}

                          {currentPage > 3 && <PaginationEllipsis />}

                          {Math.max(3, currentPage - 1) <= Math.min(totalPages - 2, currentPage + 1) &&
                            Array.from(
                              {
                                length:
                                  Math.min(totalPages - 2, currentPage + 1) -
                                    Math.max(3, currentPage - 1) +
                                  1,
                              },
                              (_, idx) => {
                                const page = Math.max(3, currentPage - 1) + idx
                                return page
                              },
                            ).map((page) => (
                              <PaginationLink
                                key={page}
                                href="#"
                                isActive={page === currentPage}
                                onClick={(e) => {
                                  e.preventDefault()
                                  setCurrentPage(page)
                                }}
                              >
                                {page}
                              </PaginationLink>
                            ))}

                          {currentPage < totalPages - 2 && <PaginationEllipsis />}

                          {[totalPages - 1, totalPages].map((page) => (
                            <PaginationLink
                              key={page}
                              href="#"
                              isActive={page === currentPage}
                              onClick={(e) => {
                                e.preventDefault()
                                setCurrentPage(page)
                              }}
                            >
                              {page}
                            </PaginationLink>
                          ))}
                        </>
                      )}

                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }}
                    aria-disabled={currentPage >= totalPages}
                    style={{
                      pointerEvents: currentPage >= totalPages ? "none" : undefined,
                      opacity: currentPage >= totalPages ? 0.5 : 1,
                    }}
                  />
                </PaginationContent>
              </Pagination>
            </div>
          )}

        </div>
      </main>

      <BookModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingBook(null)
        }}
        onSubmit={editingBook ? handleEditBook : handleAddBook}
        initialBook={editingBook}
        isEditing={!!editingBook}
      />
    </div>
  )
}
