"use client"

import { Sidebar } from "@/components/sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { useState, useEffect } from "react"
import { Search, Plus, Edit2, Trash2, Mail, Phone, Users } from "lucide-react"
import { MemberModal } from "@/components/member-modal"
import { ConfirmDialog } from "@/components/confirm-dialog"
import type { Member } from "@/lib/data"
import { membersData as initialMembersData } from "@/lib/data"
import { useToast } from "@/hooks/use-toast"

export default function MembersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [members, setMembers] = useState<Member[]>(initialMembersData)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingMember, setEditingMember] = useState<Member | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; memberId: string | null }>({
    isOpen: false,
    memberId: null,
  })
  const { addToast } = useToast()

  useEffect(() => {
    const saved = localStorage.getItem("library_members")
    if (saved) {
      try {
        setMembers(JSON.parse(saved))
      } catch (e) {
        console.error("Failed to load members from localStorage")
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("library_members", JSON.stringify(members))
  }, [members])

  const filteredMembers = members.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || member.membershipStatus === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleAddMember = (memberData: Omit<Member, "id">) => {
    const newMember: Member = {
      ...memberData,
      id: Date.now().toString(),
    }
    setMembers([...members, newMember])
    setIsModalOpen(false)
    addToast({
      title: "Success",
      description: `Member ${memberData.name} has been added successfully!`,
      type: "success",
    })
  }

  const handleEditMember = (memberData: Omit<Member, "id">) => {
    if (!editingMember) return
    const updated = members.map((m) => (m.id === editingMember.id ? { ...m, ...memberData } : m))
    setMembers(updated)
    setEditingMember(null)
    setIsModalOpen(false)
    addToast({
      title: "Success",
      description: `Member ${memberData.name} has been updated successfully!`,
      type: "success",
    })
  }

  const handleDeleteMember = () => {
    if (!deleteConfirm.memberId) return
    const member = members.find((m) => m.id === deleteConfirm.memberId)
    setMembers(members.filter((m) => m.id !== deleteConfirm.memberId))
    setDeleteConfirm({ isOpen: false, memberId: null })
    addToast({
      title: "Success",
      description: `Member ${member?.name} has been deleted successfully!`,
      type: "success",
    })
  }

  const openEditModal = (member: Member) => {
    setEditingMember(member)
    setIsModalOpen(true)
  }

  const openDeleteConfirm = (memberId: string) => {
    setDeleteConfirm({ isOpen: true, memberId })
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingMember(null)
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
                <Users size={24} className="text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Members</h1>
                <p className="text-muted-foreground mt-1">Manage library members ({members.length} total)</p>
              </div>
            </div>
            <button
              onClick={() => {
                setEditingMember(null)
                setIsModalOpen(true)
              }}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 active:scale-95 transition-all duration-200"
            >
              <Plus size={20} />
              Add Member
            </button>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 text-muted-foreground" size={20} />
              <input
                type="text"
                placeholder="Search by name or email..."
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
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {/* Members Table */}
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted border-b border-border">
                  <tr>
                    <th className="text-left py-4 px-6 font-semibold text-foreground">Name</th>
                    <th className="text-left py-4 px-6 font-semibold text-foreground">Email</th>
                    <th className="text-left py-4 px-6 font-semibold text-foreground">Phone</th>
                    <th className="text-left py-4 px-6 font-semibold text-foreground">Join Date</th>
                    <th className="text-left py-4 px-6 font-semibold text-foreground">Books</th>
                    <th className="text-left py-4 px-6 font-semibold text-foreground">Fines</th>
                    <th className="text-left py-4 px-6 font-semibold text-foreground">Status</th>
                    <th className="text-left py-4 px-6 font-semibold text-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMembers.map((member) => (
                    <tr key={member.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                      <td className="py-4 px-6 text-foreground font-medium">{member.name}</td>
                      <td className="py-4 px-6">
                        <a
                          href={`mailto:${member.email}`}
                          className="text-primary hover:underline flex items-center gap-2"
                        >
                          <Mail size={16} />
                          {member.email}
                        </a>
                      </td>
                      <td className="py-4 px-6">
                        <a
                          href={`tel:${member.phone}`}
                          className="text-primary hover:underline flex items-center gap-2"
                        >
                          <Phone size={16} />
                          {member.phone}
                        </a>
                      </td>
                      <td className="py-4 px-6 text-muted-foreground">{member.joinDate}</td>
                      <td className="py-4 px-6">
                        <span className="inline-block px-3 py-1 bg-accent/10 text-accent rounded-full text-sm font-medium">
                          {member.booksborrowed}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`font-semibold ${
                            member.totalFines > 0 ? "text-destructive" : "text-green-600 dark:text-green-400"
                          }`}
                        >
                          ${member.totalFines.toFixed(2)}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                            member.membershipStatus === "active"
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                              : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100"
                          }`}
                        >
                          {member.membershipStatus.charAt(0).toUpperCase() + member.membershipStatus.slice(1)}
                        </span>
                      </td>
                      <td className="py-4 px-6 flex gap-2">
                        <button
                          onClick={() => openEditModal(member)}
                          className="p-2 text-primary hover:bg-primary/10 active:scale-95 rounded transition-all"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => openDeleteConfirm(member.id)}
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

          {filteredMembers.length === 0 && (
            <div className="text-center py-12">
              <Users size={48} className="mx-auto text-muted-foreground mb-3 opacity-50" />
              <p className="text-muted-foreground text-lg">No members found</p>
            </div>
          )}
        </div>
      </main>

      <MemberModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={editingMember ? handleEditMember : handleAddMember}
        initialMember={editingMember}
        isEditing={!!editingMember}
      />

      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        title="Delete Member"
        message="Are you sure you want to delete this member? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        isDangerous={true}
        onConfirm={handleDeleteMember}
        onCancel={() => setDeleteConfirm({ isOpen: false, memberId: null })}
      />
    </div>
  )
}
