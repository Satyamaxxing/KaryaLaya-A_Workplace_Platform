// frontend/app/dashboard/projects/page.tsx
"use client"

import { useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog"
import {
  Plus, Users, Calendar, AlertCircle, MoreHorizontal,
  Search, Filter, Grid3X3, List, Eye, Edit, ArrowLeft,
  CheckCircle2, Clock, X, Trash2, Star, StarOff,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"

// ── Mock data ──────────────────────────────────────────────
const initialProjects = [
  {
    id: 1,
    name: "Website Redesign",
    description: "Complete overhaul of company website with modern design and improved UX",
    progress: 75,
    members: [
      { id: 1, name: "Sarah Chen",   initials: "SC" },
      { id: 2, name: "Mike Johnson", initials: "MJ" },
      { id: 3, name: "Alex Rivera",  initials: "AR" },
      { id: 4, name: "Emma Davis",   initials: "ED" },
    ],
    tasks: { total: 12, completed: 9, inProgress: 2, pending: 1 },
    dueDate: "2024-01-15",
    status: "active",
    priority: "high",
    starred: false,
  },
  {
    id: 2,
    name: "Mobile App Development",
    description: "iOS and Android app for customer portal with real-time notifications",
    progress: 45,
    members: [
      { id: 1, name: "Sarah Chen", initials: "SC" },
      { id: 5, name: "David Kim",  initials: "DK" },
      { id: 6, name: "Lisa Wang",  initials: "LW" },
    ],
    tasks: { total: 24, completed: 11, inProgress: 8, pending: 5 },
    dueDate: "2024-02-28",
    status: "active",
    priority: "medium",
    starred: true,
  },
  {
    id: 3,
    name: "Marketing Campaign",
    description: "Q1 digital marketing strategy implementation across all channels",
    progress: 90,
    members: [
      { id: 3, name: "Alex Rivera", initials: "AR" },
      { id: 7, name: "Tom Wilson",  initials: "TW" },
    ],
    tasks: { total: 8, completed: 7, inProgress: 1, pending: 0 },
    dueDate: "2024-01-10",
    status: "review",
    priority: "high",
    starred: false,
  },
  {
    id: 4,
    name: "Database Migration",
    description: "Migrate legacy database to new cloud infrastructure with zero downtime",
    progress: 20,
    members: [
      { id: 2, name: "Mike Johnson", initials: "MJ" },
      { id: 5, name: "David Kim",    initials: "DK" },
    ],
    tasks: { total: 15, completed: 3, inProgress: 2, pending: 10 },
    dueDate: "2024-03-15",
    status: "planning",
    priority: "low",
    starred: false,
  },
]

// ── Helpers ────────────────────────────────────────────────
function authorColor(name: string) {
  const colors = ["#5CAFC4", "#c084fc", "#50c878", "#ff8a65", "#ffd700", "#f472b6"]
  return colors[name.charCodeAt(0) % colors.length]
}

function priorityColor(p: string) {
  return p === "high" ? "#ff8a65" : p === "medium" ? "#ffd700" : "rgba(255,255,255,0.35)"
}

function statusBg(s: string, dark: boolean) {
  if (s === "active")   return dark ? "rgba(80,200,120,0.18)"  : "rgba(30,120,60,0.12)"
  if (s === "review")   return dark ? "rgba(255,200,80,0.18)"  : "rgba(150,100,0,0.12)"
  if (s === "planning") return dark ? "rgba(92,124,137,0.25)"  : "rgba(31,73,89,0.12)"
  return "transparent"
}
function statusTxt(s: string, dark: boolean) {
  if (s === "active")   return dark ? "#50c878" : "#1a7040"
  if (s === "review")   return dark ? "#ffd700" : "#8a6000"
  if (s === "planning") return dark ? "#A7D0E3" : "#1F4959"
  return "#aaa"
}

// ── Main ───────────────────────────────────────────────────
export default function ProjectsPage() {
  const router = useRouter()
  const [dark, setDark]                     = useState(true)
  const [projects, setProjects]             = useState(initialProjects)
  const [searchQuery, setSearchQuery]       = useState("")
  const [viewMode, setViewMode]             = useState<"grid" | "list">("grid")
  const [filterStatus, setFilterStatus]     = useState("all")
  const [filterPriority, setFilterPriority] = useState("all")
  const [isCreateOpen, setIsCreateOpen]     = useState(false)
  const [editingProject, setEditingProject] = useState<any>(null)
  const [deletingId, setDeletingId]         = useState<number | null>(null)
  const [newProject, setNewProject]         = useState({ name: "", description: "", dueDate: "", priority: "medium" })

  // Sync dark mode from localStorage (same key as dashboard)
  useEffect(() => {
    const th = localStorage.getItem("karyalaya_theme")
    if (th) setDark(th === "dark")
    const handleStorage = (e: StorageEvent) => {
      if (e.key === "karyalaya_theme") setDark(e.newValue === "dark")
    }
    window.addEventListener("storage", handleStorage)
    return () => window.removeEventListener("storage", handleStorage)
  }, [])

  // Theme tokens
  const pageBg  = dark ? "#060e16" : "#d5ecf8"
  const navBg   = dark ? "rgba(6,14,22,0.96)"   : "rgba(213,236,248,0.96)"
  const cardBg  = dark ? "rgba(10,22,34,0.78)"  : "rgba(195,228,244,0.72)"
  const bdr     = dark ? "rgba(92,124,137,0.18)" : "rgba(92,160,200,0.3)"
  const txtPri  = dark ? "#ffffff"               : "#0B2E3A"
  const txtMut  = dark ? "rgba(255,255,255,0.4)" : "rgba(11,46,58,0.5)"
  const glassBg = dark ? "rgba(10,22,34,0.7)"   : "rgba(195,228,244,0.65)"
  const inSt    = {
    backgroundColor: dark ? "rgba(31,73,89,0.28)" : "rgba(92,160,200,0.15)",
    border: `1px solid ${dark ? "rgba(92,124,137,0.28)" : "rgba(92,160,200,0.32)"}`,
    color: txtPri, fontFamily: "'DM Sans',sans-serif",
    borderRadius: "0.75rem",
  }
  const dlgBg = dark ? "#0a1a26" : "#d5ecf8"

  const filtered = projects.filter(p => {
    const q = searchQuery.toLowerCase()
    const matchQ = p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
    const matchS = filterStatus === "all"   || p.status   === filterStatus
    const matchP = filterPriority === "all" || p.priority === filterPriority
    return matchQ && matchS && matchP
  })

  const stats = {
    total:   projects.length,
    active:  projects.filter(p => p.status === "active").length,
    review:  projects.filter(p => p.status === "review").length,
    avgProg: Math.round(projects.reduce((a, p) => a + p.progress, 0) / projects.length),
  }

  const handleCreate = () => {
    if (!newProject.name.trim()) return
    const p = {
      id: Date.now(),
      name: newProject.name,
      description: newProject.description,
      progress: 0,
      members: [],
      tasks: { total: 0, completed: 0, inProgress: 0, pending: 0 },
      dueDate: newProject.dueDate,
      status: "planning",
      priority: newProject.priority,
      starred: false,
    }
    setProjects(prev => [p, ...prev])
    setNewProject({ name: "", description: "", dueDate: "", priority: "medium" })
    setIsCreateOpen(false)
  }

  const handleEdit = () => {
    if (!editingProject) return
    setProjects(prev => prev.map(p => p.id === editingProject.id ? editingProject : p))
    setEditingProject(null)
  }

  const handleDelete = (id: number) => {
    setProjects(prev => prev.filter(p => p.id !== id))
    setDeletingId(null)
  }

  const handleStar = (id: number) => {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, starred: !p.starred } : p))
  }

  const Btn = ({ children, onClick, style, className = "" }: any) => (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.96 }}
      onClick={onClick}
      className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium cursor-pointer ${className}`}
      style={{ transition: "all 0.1s ease", ...style }}
    >
      {children}
    </motion.button>
  )

  // Project form (shared for create + edit)
  const ProjectForm = ({ value, onChange }: { value: typeof newProject, onChange: (v: any) => void }) => (
    <div className="space-y-4 mt-3">
      <div>
        <label className="text-xs font-semibold tracking-widest uppercase block mb-1.5" style={{ color: txtMut }}>Project Name</label>
        <input placeholder="Enter project name" value={value.name}
          onChange={e => onChange({ ...value, name: e.target.value })}
          className="w-full px-3 text-sm outline-none"
          style={{ ...inSt, height: "2.75rem", display: "flex", alignItems: "center" }} />
      </div>
      <div>
        <label className="text-xs font-semibold tracking-widest uppercase block mb-1.5" style={{ color: txtMut }}>Description</label>
        <textarea placeholder="Describe your project" value={value.description}
          onChange={e => onChange({ ...value, description: e.target.value })}
          rows={3} className="w-full px-3 py-2 text-sm outline-none resize-none"
          style={{ ...inSt, height: "auto" }} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-semibold tracking-widest uppercase block mb-1.5" style={{ color: txtMut }}>Due Date</label>
          <input type="date" value={value.dueDate}
            onChange={e => onChange({ ...value, dueDate: e.target.value })}
            className="w-full px-3 text-sm outline-none"
            style={{ ...inSt, height: "2.75rem", display: "block" }} />
        </div>
        <div>
          <label className="text-xs font-semibold tracking-widest uppercase block mb-1.5" style={{ color: txtMut }}>Priority</label>
          <Select value={value.priority} onValueChange={v => onChange({ ...value, priority: v })}>
            <SelectTrigger style={{ ...inSt, height: "2.75rem" }}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent style={{ backgroundColor: dlgBg, border: `1px solid ${bdr}`, color: txtPri }}>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )

  // Project Card (grid)
  const ProjectCard = ({ project }: { project: any }) => (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -3 }}
      transition={{ duration: 0.3 }}
      className="relative rounded-2xl overflow-hidden group flex flex-col"
      style={{
        backgroundColor: cardBg,
        border: `1px solid ${bdr}`,
        backdropFilter: "blur(16px)",
        boxShadow: dark ? "0 4px 24px rgba(0,0,0,0.2)" : "0 4px 24px rgba(31,73,89,0.08)",
        transition: "all 0.25s ease",
      }}
    >
      {/* Top shine */}
      <div className="absolute top-0 inset-x-0 h-px" style={{ background: "linear-gradient(90deg,transparent,rgba(92,180,200,0.25),transparent)" }} />
      {/* Hover overlay */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-300"
        style={{ background: dark ? "linear-gradient(135deg,rgba(31,73,89,0.08),transparent)" : "linear-gradient(135deg,rgba(92,160,200,0.06),transparent)" }} />

      <div className="p-5 flex flex-col gap-4 flex-1">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h3 className="font-semibold text-sm" style={{ color: txtPri }}>{project.name}</h3>
              <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                style={{ backgroundColor: statusBg(project.status, dark), color: statusTxt(project.status, dark) }}>
                {project.status}
              </span>
            </div>
            <p className="text-xs leading-relaxed line-clamp-2" style={{ color: txtMut }}>{project.description}</p>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            <motion.button whileTap={{ scale: 0.85 }} onClick={() => handleStar(project.id)}
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ color: project.starred ? "#ffd700" : txtMut, cursor: "pointer", transition: "color 0.15s" }}>
              {project.starred ? <Star size={14} fill="#ffd700" /> : <StarOff size={14} />}
            </motion.button>
            <motion.button whileTap={{ scale: 0.85 }}
              className="w-7 h-7 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100"
              style={{ color: txtMut, cursor: "pointer", transition: "all 0.15s" }}
              onClick={() => setEditingProject(project)}>
              <MoreHorizontal size={14} />
            </motion.button>
          </div>
        </div>

        {/* Progress */}
        <div>
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span style={{ color: txtMut }}>Progress</span>
            <span className="font-semibold" style={{ color: dark ? "#A7D0E3" : "#1F4959" }}>{project.progress}%</span>
          </div>
          <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: dark ? "rgba(92,124,137,0.2)" : "rgba(92,160,200,0.2)" }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${project.progress}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="h-full rounded-full"
              style={{ background: "linear-gradient(90deg,#1F4959,#5C7C89,#A7D0E3)" }}
            />
          </div>
        </div>

        {/* Members + Tasks */}
        <div className="flex items-center justify-between">
          <div className="flex -space-x-1.5">
            {project.members.slice(0, 4).map((m: any) => (
              <div key={m.id} title={m.name}
                className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white border-2"
                style={{ background: `linear-gradient(135deg,${authorColor(m.name)}88,${authorColor(m.name)})`, borderColor: dark ? "#07121d" : "#c5e2f0" }}>
                {m.initials}
              </div>
            ))}
            {project.members.length > 4 && (
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold border-2"
                style={{ backgroundColor: dark ? "rgba(31,73,89,0.5)" : "rgba(92,160,200,0.3)", color: txtPri, borderColor: dark ? "#07121d" : "#c5e2f0" }}>
                +{project.members.length - 4}
              </div>
            )}
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold" style={{ color: txtPri }}>{project.tasks.completed}/{project.tasks.total}</p>
            <p className="text-xs" style={{ color: txtMut }}>tasks done</p>
          </div>
        </div>

        {/* Meta */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1" style={{ color: txtMut }}>
            <Calendar size={12} />
            <span>{project.dueDate || "No due date"}</span>
          </div>
          <div className="flex items-center gap-1" style={{ color: priorityColor(project.priority) }}>
            <AlertCircle size={12} />
            <span className="capitalize">{project.priority}</span>
          </div>
        </div>

        {/* Task breakdown pills */}
        <div className="flex gap-2 flex-wrap">
          <span className="text-xs px-2 py-0.5 rounded-full flex items-center gap-1"
            style={{ backgroundColor: "rgba(80,200,120,0.15)", color: "#50c878" }}>
            <CheckCircle2 size={10} /> {project.tasks.completed} done
          </span>
          <span className="text-xs px-2 py-0.5 rounded-full flex items-center gap-1"
            style={{ backgroundColor: "rgba(255,200,80,0.15)", color: "#ffd700" }}>
            <Clock size={10} /> {project.tasks.inProgress} active
          </span>
          {project.tasks.pending > 0 && (
            <span className="text-xs px-2 py-0.5 rounded-full flex items-center gap-1"
              style={{ backgroundColor: dark ? "rgba(92,124,137,0.2)" : "rgba(31,73,89,0.12)", color: txtMut }}>
              {project.tasks.pending} pending
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-1">
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
            onClick={() => setEditingProject(project)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-medium"
            style={{ backgroundColor: dark ? "rgba(31,73,89,0.35)" : "rgba(92,160,200,0.2)", border: `1px solid ${bdr}`, color: dark ? "#A7D0E3" : "#1F4959", cursor: "pointer", transition: "all 0.1s" }}>
            <Eye size={13} /> View
          </motion.button>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
            onClick={() => setEditingProject(project)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-medium"
            style={{ background: "linear-gradient(135deg,#1F4959,#2d7a96)", color: "#fff", cursor: "pointer", transition: "all 0.1s" }}>
            <Edit size={13} /> Edit
          </motion.button>
          <motion.button whileHover={{ scale: 1.02, backgroundColor: "rgba(239,68,68,0.2)" }} whileTap={{ scale: 0.97 }}
            onClick={() => setDeletingId(project.id)}
            className="w-9 flex items-center justify-center rounded-xl"
            style={{ backgroundColor: dark ? "rgba(239,68,68,0.1)" : "rgba(239,68,68,0.08)", border: `1px solid rgba(239,68,68,0.25)`, color: "#ef4444", cursor: "pointer", transition: "all 0.1s" }}>
            <Trash2 size={13} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  )

  // Project Row (list)
  const ProjectRow = ({ project }: { project: any }) => (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 10 }}
      transition={{ duration: 0.25 }}
      className="relative rounded-2xl p-4 group"
      style={{ backgroundColor: cardBg, border: `1px solid ${bdr}`, backdropFilter: "blur(16px)", transition: "all 0.2s ease" }}
    >
      <div className="absolute top-0 inset-x-0 h-px" style={{ background: "linear-gradient(90deg,transparent,rgba(92,180,200,0.2),transparent)" }} />

      <div className="flex items-center gap-4 flex-wrap lg:flex-nowrap">
        {/* Name + desc */}
        <div className="min-w-0 flex-1" style={{ minWidth: 180 }}>
          <div className="flex items-center gap-2 flex-wrap mb-0.5">
            <span className="font-semibold text-sm" style={{ color: txtPri }}>{project.name}</span>
            <span className="text-xs px-2 py-0.5 rounded-full"
              style={{ backgroundColor: statusBg(project.status, dark), color: statusTxt(project.status, dark) }}>
              {project.status}
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: dark ? "rgba(92,124,137,0.18)" : "rgba(31,73,89,0.08)", color: priorityColor(project.priority) }}>
              {project.priority}
            </span>
          </div>
          <p className="text-xs line-clamp-1" style={{ color: txtMut }}>{project.description}</p>
        </div>

        {/* Progress */}
        <div style={{ width: 130, flexShrink: 0 }}>
          <div className="flex items-center justify-between text-xs mb-1">
            <span style={{ color: txtMut }}>Progress</span>
            <span style={{ color: dark ? "#A7D0E3" : "#1F4959" }}>{project.progress}%</span>
          </div>
          <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: dark ? "rgba(92,124,137,0.18)" : "rgba(92,160,200,0.18)" }}>
            <motion.div
              initial={{ width: 0 }} animate={{ width: `${project.progress}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="h-full rounded-full"
              style={{ background: "linear-gradient(90deg,#1F4959,#5C7C89,#A7D0E3)" }}
            />
          </div>
        </div>

        {/* Members */}
        <div className="flex -space-x-1.5 flex-shrink-0">
          {project.members.slice(0, 4).map((m: any) => (
            <div key={m.id} title={m.name}
              className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white border"
              style={{ background: `linear-gradient(135deg,${authorColor(m.name)}88,${authorColor(m.name)})`, borderColor: dark ? "#07121d" : "#c5e2f0", fontSize: "0.6rem" }}>
              {m.initials}
            </div>
          ))}
          {project.members.length > 4 && (
            <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs border"
              style={{ backgroundColor: dark ? "rgba(31,73,89,0.4)" : "rgba(92,160,200,0.3)", color: txtPri, borderColor: dark ? "#07121d" : "#c5e2f0", fontSize: "0.6rem" }}>
              +{project.members.length - 4}
            </div>
          )}
        </div>

        {/* Tasks */}
        <div className="text-center flex-shrink-0" style={{ width: 70 }}>
          <p className="text-sm font-semibold" style={{ color: txtPri }}>{project.tasks.completed}/{project.tasks.total}</p>
          <p className="text-xs" style={{ color: txtMut }}>tasks</p>
        </div>

        {/* Due + priority */}
        <div className="flex-shrink-0" style={{ width: 100 }}>
          <div className="flex items-center gap-1 text-xs mb-0.5" style={{ color: txtMut }}>
            <Calendar size={11} />{project.dueDate || "—"}
          </div>
          <div className="flex items-center gap-1 text-xs" style={{ color: priorityColor(project.priority) }}>
            <AlertCircle size={11} />{project.priority}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <motion.button whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.9 }}
            onClick={() => handleStar(project.id)}
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ color: project.starred ? "#ffd700" : txtMut, cursor: "pointer", backgroundColor: dark ? "rgba(31,73,89,0.2)" : "rgba(92,160,200,0.12)" }}>
            {project.starred ? <Star size={14} fill="#ffd700" /> : <StarOff size={14} />}
          </motion.button>
          <motion.button whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.9 }}
            onClick={() => setEditingProject(project)}
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ color: dark ? "#A7D0E3" : "#1F4959", cursor: "pointer", backgroundColor: dark ? "rgba(31,73,89,0.2)" : "rgba(92,160,200,0.12)" }}>
            <Eye size={14} />
          </motion.button>
          <motion.button whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.9 }}
            onClick={() => setEditingProject(project)}
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ cursor: "pointer", background: "linear-gradient(135deg,#1F4959,#2d7a96)", color: "#fff" }}>
            <Edit size={14} />
          </motion.button>
          <motion.button whileHover={{ scale: 1.08, backgroundColor: "rgba(239,68,68,0.2)" }} whileTap={{ scale: 0.9 }}
            onClick={() => setDeletingId(project.id)}
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ cursor: "pointer", backgroundColor: dark ? "rgba(239,68,68,0.1)" : "rgba(239,68,68,0.08)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.2)", transition: "all 0.1s" }}>
            <Trash2 size={14} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  )

  return (
    <div className="flex flex-col"
      style={{ minHeight: "100dvh", backgroundColor: pageBg, color: txtPri, fontFamily: "'DM Sans',sans-serif", transition: "background-color 0.4s ease" }}>

      {/* ── Navbar ── */}
      <header className="sticky top-0 z-30 flex items-center gap-3 px-5 flex-shrink-0"
        style={{ height: 60, backgroundColor: navBg, borderBottom: `1px solid ${bdr}`, backdropFilter: "blur(24px)" }}>

        {/* Back */}
        <motion.button whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.94 }}
          onClick={() => router.push("/dashboard")}
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: dark ? "rgba(31,73,89,0.3)" : "rgba(92,160,200,0.2)", color: txtPri, border: `1px solid ${bdr}`, cursor: "pointer" }}>
          <ArrowLeft size={16} />
        </motion.button>

        {/* Title */}
        <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "1.3rem", fontWeight: 700, fontStyle: "italic", color: txtPri, whiteSpace: "nowrap" }}>
          Projects
        </h1>

        {/* Search */}
        <div className="flex items-center gap-2 px-3 rounded-xl flex-1"
          style={{ backgroundColor: dark ? "rgba(31,73,89,0.18)" : "rgba(92,160,200,0.14)", border: `1px solid ${bdr}`, height: 38, maxWidth: 360 }}>
          <Search size={14} style={{ color: txtMut, flexShrink: 0 }} />
          <input type="text" placeholder="Search projects..."
            className="bg-transparent border-none outline-none text-sm flex-1 min-w-0"
            style={{ color: txtPri, fontFamily: "'DM Sans',sans-serif" }}
            value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")} style={{ color: txtMut, cursor: "pointer" }}><X size={13} /></button>
          )}
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-2 ml-auto flex-shrink-0">
          {/* Status filter */}
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="hidden sm:flex items-center gap-1.5 text-sm rounded-xl px-3"
              style={{ backgroundColor: dark ? "rgba(31,73,89,0.28)" : "rgba(92,160,200,0.18)", border: `1px solid ${bdr}`, color: dark ? "#A7D0E3" : "#1F4959", height: 36, minWidth: 110 }}>
              <Filter size={13} />
              <SelectValue />
            </SelectTrigger>
            <SelectContent style={{ backgroundColor: dlgBg, border: `1px solid ${bdr}`, color: txtPri }}>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="review">Review</SelectItem>
              <SelectItem value="planning">Planning</SelectItem>
            </SelectContent>
          </Select>

          {/* Priority filter */}
          <Select value={filterPriority} onValueChange={setFilterPriority}>
            <SelectTrigger className="hidden md:flex items-center gap-1.5 text-sm rounded-xl px-3"
              style={{ backgroundColor: dark ? "rgba(31,73,89,0.28)" : "rgba(92,160,200,0.18)", border: `1px solid ${bdr}`, color: dark ? "#A7D0E3" : "#1F4959", height: 36, minWidth: 110 }}>
              <AlertCircle size={13} />
              <SelectValue />
            </SelectTrigger>
            <SelectContent style={{ backgroundColor: dlgBg, border: `1px solid ${bdr}`, color: txtPri }}>
              <SelectItem value="all">All Priority</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>

          {/* View toggle */}
          <div className="flex rounded-xl overflow-hidden" style={{ border: `1px solid ${bdr}` }}>
            {(["grid", "list"] as const).map(mode => (
              <button key={mode} onClick={() => setViewMode(mode)}
                className="w-9 h-9 flex items-center justify-center"
                style={{
                  backgroundColor: viewMode === mode
                    ? (dark ? "rgba(31,73,89,0.6)" : "rgba(31,73,89,0.15)")
                    : "transparent",
                  color: viewMode === mode ? (dark ? "#A7D0E3" : "#1F4959") : txtMut,
                  cursor: "pointer", transition: "all 0.1s ease",
                }}>
                {mode === "grid" ? <Grid3X3 size={15} /> : <List size={15} />}
              </button>
            ))}
          </div>

          {/* New project */}
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white"
                style={{ background: "linear-gradient(135deg,#1F4959,#2d7a96)", border: "1px solid rgba(92,124,137,0.3)", boxShadow: "0 4px 14px rgba(11,46,58,0.35)", cursor: "pointer" }}>
                <Plus size={15} /> <span className="hidden sm:inline">New Project</span>
              </motion.button>
            </DialogTrigger>
            <DialogContent style={{ backgroundColor: dlgBg, border: `1px solid ${bdr}`, color: txtPri }}>
              <DialogHeader>
                <DialogTitle style={{ color: txtPri, fontFamily: "'Cormorant Garamond',serif", fontSize: "1.4rem" }}>Create New Project</DialogTitle>
                <DialogDescription style={{ color: txtMut }}>Set up a new project to start collaborating.</DialogDescription>
              </DialogHeader>
              <ProjectForm value={newProject} onChange={setNewProject} />
              <DialogFooter className="mt-5 gap-2">
                <button onClick={() => setIsCreateOpen(false)} className="px-4 py-2 rounded-xl text-sm font-medium"
                  style={{ border: `1px solid ${bdr}`, color: txtMut, cursor: "pointer" }}>Cancel</button>
                <button onClick={handleCreate} className="px-4 py-2 rounded-xl text-sm font-semibold text-white"
                  style={{ background: "linear-gradient(135deg,#1F4959,#2d7a96)", cursor: "pointer" }}>Create Project</button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      {/* ── Content ── */}
      <main className="flex-1 overflow-y-auto">
        <div style={{ padding: "24px 20px", maxWidth: 1400, margin: "0 auto" }} className="lg:px-8">

          {/* Stats row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-7">
            {[
              { label: "Total Projects", value: stats.total,   color: "#5CAFC4" },
              { label: "Active",         value: stats.active,  color: "#50c878" },
              { label: "In Review",      value: stats.review,  color: "#ffd700" },
              { label: "Avg Progress",   value: `${stats.avgProg}%`, color: "#c084fc" },
            ].map((s, i) => (
              <motion.div key={s.label}
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06, duration: 0.4 }}
                whileHover={{ y: -2 }}
                className="relative rounded-2xl p-4 overflow-hidden"
                style={{ backgroundColor: cardBg, border: `1px solid ${bdr}`, backdropFilter: "blur(16px)" }}>
                <div className="absolute top-0 inset-x-0 h-px" style={{ background: "linear-gradient(90deg,transparent,rgba(92,180,200,0.25),transparent)" }} />
                <p className="text-xs font-semibold tracking-wide uppercase mb-1.5" style={{ color: txtMut, fontSize: "0.62rem" }}>{s.label}</p>
                <p className="text-2xl font-bold" style={{ color: s.color, fontFamily: "'Cormorant Garamond',serif" }}>{s.value}</p>
              </motion.div>
            ))}
          </div>

          {/* Results count */}
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm" style={{ color: txtMut }}>
              Showing <span style={{ color: txtPri, fontWeight: 600 }}>{filtered.length}</span> of {projects.length} projects
            </p>
            {(searchQuery || filterStatus !== "all" || filterPriority !== "all") && (
              <button
                onClick={() => { setSearchQuery(""); setFilterStatus("all"); setFilterPriority("all") }}
                className="text-xs flex items-center gap-1 px-2.5 py-1.5 rounded-lg"
                style={{ color: "#5CAFC4", backgroundColor: "rgba(92,160,200,0.1)", border: "1px solid rgba(92,160,200,0.2)", cursor: "pointer" }}>
                <X size={11} /> Clear filters
              </button>
            )}
          </div>

          {/* Grid / List */}
          <AnimatePresence mode="wait">
            {filtered.length > 0 ? (
              viewMode === "grid" ? (
                <motion.div key="grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                  <AnimatePresence>
                    {filtered.map((p, i) => (
                      <motion.div key={p.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}>
                        <ProjectCard project={p} />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
              ) : (
                <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="flex flex-col gap-3">
                  <AnimatePresence>
                    {filtered.map((p, i) => (
                      <motion.div key={p.id} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.04 }}>
                        <ProjectRow project={p} />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
              )
            ) : (
              <motion.div key="empty" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
                className="rounded-2xl p-16 text-center"
                style={{ backgroundColor: glassBg, border: `2px dashed ${dark ? "rgba(92,124,137,0.22)" : "rgba(92,160,200,0.3)"}`, backdropFilter: "blur(16px)" }}>
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
                  style={{ background: "linear-gradient(135deg,rgba(31,73,89,0.4),rgba(92,124,137,0.25))", border: `1px solid ${bdr}` }}>
                  <Users size={28} style={{ color: "#5CAFC4" }} />
                </div>
                <h3 className="font-semibold text-base mb-1.5" style={{ color: txtPri }}>No projects found</h3>
                <p className="text-sm mb-5" style={{ color: txtMut }}>
                  {searchQuery || filterStatus !== "all" || filterPriority !== "all"
                    ? "Try adjusting your search or filter criteria."
                    : "Create your first project to get started."}
                </p>
                {!searchQuery && filterStatus === "all" && filterPriority === "all" && (
                  <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                    onClick={() => setIsCreateOpen(true)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
                    style={{ background: "linear-gradient(135deg,#1F4959,#2d7a96)", cursor: "pointer" }}>
                    <Plus size={14} /> Create Project
                  </motion.button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="px-8 py-4" style={{ borderTop: `1px solid ${bdr}` }}>
          <div className="flex items-center justify-center gap-3">
            <p className="text-xs tracking-[0.15em] uppercase" style={{ color: dark ? "rgba(255,255,255,0.18)" : "rgba(11,46,58,0.25)" }}>
              © 2025 KaryaLaya
            </p>
            <div className="w-px h-3" style={{ backgroundColor: dark ? "rgba(92,124,137,0.35)" : "rgba(31,73,89,0.2)" }} />
            <p style={{ color: dark ? "rgba(167,208,227,0.3)" : "rgba(31,73,89,0.3)", fontStyle: "italic", fontFamily: "'Cormorant Garamond',serif", fontSize: "0.82rem" }}>
              Crafted by Satyam Kumar
            </p>
          </div>
        </div>
      </main>

      {/* ── Edit dialog ── */}
      <AnimatePresence>
        {editingProject && (
          <Dialog open={!!editingProject} onOpenChange={v => !v && setEditingProject(null)}>
            <DialogContent style={{ backgroundColor: dlgBg, border: `1px solid ${bdr}`, color: txtPri }}>
              <DialogHeader>
                <DialogTitle style={{ color: txtPri, fontFamily: "'Cormorant Garamond',serif", fontSize: "1.4rem" }}>Edit Project</DialogTitle>
                <DialogDescription style={{ color: txtMut }}>Update project details.</DialogDescription>
              </DialogHeader>
              <ProjectForm
                value={{ name: editingProject.name, description: editingProject.description, dueDate: editingProject.dueDate, priority: editingProject.priority }}
                onChange={v => setEditingProject({ ...editingProject, ...v })}
              />
              {/* Status selector in edit */}
              <div className="mt-3">
                <label className="text-xs font-semibold tracking-widest uppercase block mb-1.5" style={{ color: txtMut }}>Status</label>
                <Select value={editingProject.status} onValueChange={v => setEditingProject({ ...editingProject, status: v })}>
                  <SelectTrigger style={{ ...inSt, height: "2.75rem" }}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent style={{ backgroundColor: dlgBg, border: `1px solid ${bdr}`, color: txtPri }}>
                    <SelectItem value="planning">Planning</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="review">Review</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <DialogFooter className="mt-5 gap-2">
                <button onClick={() => setEditingProject(null)} className="px-4 py-2 rounded-xl text-sm font-medium"
                  style={{ border: `1px solid ${bdr}`, color: txtMut, cursor: "pointer" }}>Cancel</button>
                <button onClick={handleEdit} className="px-4 py-2 rounded-xl text-sm font-semibold text-white"
                  style={{ background: "linear-gradient(135deg,#1F4959,#2d7a96)", cursor: "pointer" }}>Save Changes</button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>

      {/* ── Delete confirm dialog ── */}
      <AnimatePresence>
        {deletingId && (
          <Dialog open={!!deletingId} onOpenChange={v => !v && setDeletingId(null)}>
            <DialogContent style={{ backgroundColor: dlgBg, border: `1px solid rgba(239,68,68,0.3)`, color: txtPri, maxWidth: 400 }}>
              <DialogHeader>
                <DialogTitle style={{ color: "#ef4444", fontFamily: "'Cormorant Garamond',serif", fontSize: "1.4rem" }}>Delete Project</DialogTitle>
                <DialogDescription style={{ color: txtMut }}>
                  This will permanently delete <strong style={{ color: txtPri }}>{projects.find(p => p.id === deletingId)?.name}</strong>. This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="mt-5 gap-2">
                <button onClick={() => setDeletingId(null)} className="px-4 py-2 rounded-xl text-sm font-medium"
                  style={{ border: `1px solid ${bdr}`, color: txtMut, cursor: "pointer" }}>Cancel</button>
                <button onClick={() => handleDelete(deletingId!)} className="px-4 py-2 rounded-xl text-sm font-semibold text-white"
                  style={{ background: "linear-gradient(135deg,#8b0000,#ef4444)", cursor: "pointer" }}>Delete Project</button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </div>
  )
}