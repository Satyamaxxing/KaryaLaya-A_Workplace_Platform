// frontend/app/dashboard/tasks/page.tsx
"use client"

import { useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog"
import {
  Plus, Search, Filter, Calendar, User, Flag,
  CheckCircle2, Clock, AlertCircle, MoreHorizontal,
  Kanban, List, ArrowLeft, X, Trash2, Edit,
  ChevronDown, ChevronUp,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"

// ── Mock data ──────────────────────────────────────────────
const initialTasks = [
  { id: 1, title: "Design homepage mockup",           description: "Create wireframes and high-fidelity mockups for the new homepage design",             status: "completed",  priority: "high",   assignee: { name: "Alex Rivera",  initials: "AR" }, project: "Website Redesign",        dueDate: "2024-01-05", tags: ["design", "ui/ux"] },
  { id: 2, title: "Implement responsive navigation",  description: "Build mobile-first navigation with hamburger menu and smooth animations",              status: "completed",  priority: "medium", assignee: { name: "Mike Johnson", initials: "MJ" }, project: "Website Redesign",        dueDate: "2024-01-07", tags: ["frontend", "responsive"] },
  { id: 3, title: "Set up authentication flow",       description: "Implement user registration, login, and password reset functionality",                 status: "in-progress",priority: "high",   assignee: { name: "Mike Johnson", initials: "MJ" }, project: "Website Redesign",        dueDate: "2024-01-10", tags: ["backend", "security"] },
  { id: 4, title: "Create user dashboard wireframes", description: "Design wireframes for user dashboard with project overview and task management",       status: "in-progress",priority: "medium", assignee: { name: "Alex Rivera",  initials: "AR" }, project: "Website Redesign",        dueDate: "2024-01-12", tags: ["design", "wireframes"] },
  { id: 5, title: "Write test cases for login",       description: "Create comprehensive test suite for authentication functionality",                     status: "todo",       priority: "low",    assignee: { name: "Emma Davis",   initials: "ED" }, project: "Website Redesign",        dueDate: "2024-01-15", tags: ["testing", "qa"] },
  { id: 6, title: "API integration for user data",   description: "Connect frontend with backend API for user profile and settings management",            status: "todo",       priority: "high",   assignee: { name: "Sarah Chen",   initials: "SC" }, project: "Mobile App Development", dueDate: "2024-01-18", tags: ["api", "integration"] },
  { id: 7, title: "Performance optimization",         description: "Optimize app performance, reduce bundle size and improve load times",                  status: "review",     priority: "medium", assignee: { name: "David Kim",    initials: "DK" }, project: "Mobile App Development", dueDate: "2024-01-20", tags: ["performance"] },
]

const projectList = ["All Projects", "Website Redesign", "Mobile App Development", "Marketing Campaign"]
const assignees   = ["all", "Sarah Chen", "Mike Johnson", "Alex Rivera", "Emma Davis", "David Kim"]

// ── Helpers ────────────────────────────────────────────────
function authorColor(name: string) {
  const c = ["#5CAFC4","#c084fc","#50c878","#ff8a65","#ffd700","#f472b6"]
  return c[name.charCodeAt(0) % c.length]
}
function priorityColor(p: string) {
  return p === "high" ? "#ff8a65" : p === "medium" ? "#ffd700" : "rgba(255,255,255,0.3)"
}
function statusConfig(s: string, dark: boolean) {
  const cfg: Record<string, { bg: string; txt: string; icon: any }> = {
    "completed":   { bg: dark ? "rgba(80,200,120,0.15)"  : "rgba(30,120,60,0.1)",  txt: dark ? "#50c878" : "#1a7040", icon: CheckCircle2 },
    "in-progress": { bg: dark ? "rgba(92,160,200,0.18)"  : "rgba(31,73,89,0.12)",  txt: dark ? "#5CAFC4" : "#1F4959", icon: Clock },
    "review":      { bg: dark ? "rgba(255,200,80,0.15)"  : "rgba(150,100,0,0.1)",  txt: dark ? "#ffd700" : "#8a6000", icon: AlertCircle },
    "todo":        { bg: dark ? "rgba(92,124,137,0.2)"   : "rgba(31,73,89,0.1)",   txt: dark ? "rgba(255,255,255,0.5)" : "rgba(11,46,58,0.5)", icon: AlertCircle },
  }
  return cfg[s] || cfg["todo"]
}

const BOARD_COLS = [
  { key: "todo",        label: "To Do",       accent: "rgba(92,124,137,0.5)" },
  { key: "in-progress", label: "In Progress", accent: "#5CAFC4" },
  { key: "review",      label: "Review",      accent: "#ffd700" },
  { key: "completed",   label: "Completed",   accent: "#50c878" },
]

// ── Main ───────────────────────────────────────────────────
export default function TasksPage() {
  const router = useRouter()
  const [dark, setDark]                         = useState(true)
  const [tasks, setTasks]                       = useState(initialTasks)
  const [viewMode, setViewMode]                 = useState<"list" | "board">("list")
  const [searchQuery, setSearchQuery]           = useState("")
  const [filterProject, setFilterProject]       = useState("All Projects")
  const [filterStatus, setFilterStatus]         = useState("all")
  const [filterPriority, setFilterPriority]     = useState("all")
  const [filterAssignee, setFilterAssignee]     = useState("all")
  const [isCreateOpen, setIsCreateOpen]         = useState(false)
  const [editingTask, setEditingTask]           = useState<any>(null)
  const [deletingId, setDeletingId]             = useState<number | null>(null)
  const [expandedId, setExpandedId]             = useState<number | null>(null)
  const [newTask, setNewTask]                   = useState({ title: "", description: "", priority: "medium", assignee: "", project: "", dueDate: "" })

  // Sync dark mode
  useEffect(() => {
    const th = localStorage.getItem("karyalaya_theme")
    if (th) setDark(th === "dark")
    const handler = (e: StorageEvent) => { if (e.key === "karyalaya_theme") setDark(e.newValue === "dark") }
    window.addEventListener("storage", handler)
    return () => window.removeEventListener("storage", handler)
  }, [])

  // Theme tokens
  const pageBg  = dark ? "#060e16"               : "#d5ecf8"
  const navBg   = dark ? "rgba(6,14,22,0.96)"    : "rgba(213,236,248,0.96)"
  const cardBg  = dark ? "rgba(10,22,34,0.78)"   : "rgba(195,228,244,0.72)"
  const colBg   = dark ? "rgba(7,18,29,0.6)"     : "rgba(180,220,240,0.5)"
  const bdr     = dark ? "rgba(92,124,137,0.18)" : "rgba(92,160,200,0.3)"
  const txtPri  = dark ? "#ffffff"               : "#0B2E3A"
  const txtMut  = dark ? "rgba(255,255,255,0.4)" : "rgba(11,46,58,0.5)"
  const glassBg = dark ? "rgba(10,22,34,0.7)"    : "rgba(195,228,244,0.65)"
  const dlgBg   = dark ? "#0a1a26"               : "#d5ecf8"
  const inSt    = {
    backgroundColor: dark ? "rgba(31,73,89,0.28)" : "rgba(92,160,200,0.15)",
    border: `1px solid ${dark ? "rgba(92,124,137,0.28)" : "rgba(92,160,200,0.32)"}`,
    color: txtPri, fontFamily: "'DM Sans',sans-serif", borderRadius: "0.75rem",
  }

  const filtered = tasks.filter(t => {
    const q = searchQuery.toLowerCase()
    return (
      (t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q)) &&
      (filterProject === "All Projects" || t.project === filterProject) &&
      (filterStatus   === "all" || t.status   === filterStatus) &&
      (filterPriority === "all" || t.priority === filterPriority) &&
      (filterAssignee === "all" || t.assignee.name === filterAssignee)
    )
  })

  const byStatus = {
    todo:          filtered.filter(t => t.status === "todo"),
    "in-progress": filtered.filter(t => t.status === "in-progress"),
    review:        filtered.filter(t => t.status === "review"),
    completed:     filtered.filter(t => t.status === "completed"),
  }

  const statsArr = [
    { label: "To Do",       value: byStatus.todo.length,           color: txtMut },
    { label: "In Progress", value: byStatus["in-progress"].length, color: "#5CAFC4" },
    { label: "Review",      value: byStatus.review.length,         color: "#ffd700" },
    { label: "Done",        value: byStatus.completed.length,      color: "#50c878" },
  ]

  const handleCreate = () => {
    if (!newTask.title.trim()) return
    const t = {
      id: Date.now(),
      title: newTask.title,
      description: newTask.description,
      status: "todo",
      priority: newTask.priority,
      assignee: { name: newTask.assignee || "Unassigned", initials: (newTask.assignee || "UN").split(" ").map((n:string) => n[0]).join("").slice(0,2) },
      project: newTask.project || "General",
      dueDate: newTask.dueDate,
      tags: [],
    }
    setTasks(prev => [t, ...prev])
    setNewTask({ title: "", description: "", priority: "medium", assignee: "", project: "", dueDate: "" })
    setIsCreateOpen(false)
  }

  const handleEdit = () => {
    if (!editingTask) return
    setTasks(prev => prev.map(t => t.id === editingTask.id ? editingTask : t))
    setEditingTask(null)
  }

  const handleDelete = (id: number) => {
    setTasks(prev => prev.filter(t => t.id !== id))
    setDeletingId(null)
  }

  const handleStatusChange = (id: number, status: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status } : t))
  }

  // ── Task Form ──
  const TaskForm = ({ value, onChange }: { value: any; onChange: (v: any) => void }) => (
    <div className="space-y-4 mt-3">
      <div>
        <label className="text-xs font-semibold tracking-widest uppercase block mb-1.5" style={{ color: txtMut }}>Task Title</label>
        <input placeholder="Enter task title" value={value.title}
          onChange={e => onChange({ ...value, title: e.target.value })}
          className="w-full px-3 text-sm outline-none"
          style={{ ...inSt, height: "2.75rem", display: "block" }} />
      </div>
      <div>
        <label className="text-xs font-semibold tracking-widest uppercase block mb-1.5" style={{ color: txtMut }}>Description</label>
        <textarea placeholder="Describe the task" value={value.description}
          onChange={e => onChange({ ...value, description: e.target.value })}
          rows={3} className="w-full px-3 py-2 text-sm outline-none resize-none"
          style={{ ...inSt, height: "auto" }} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-semibold tracking-widest uppercase block mb-1.5" style={{ color: txtMut }}>Project</label>
          <Select value={value.project} onValueChange={v => onChange({ ...value, project: v })}>
            <SelectTrigger style={{ ...inSt, height: "2.75rem" }}><SelectValue placeholder="Select project" /></SelectTrigger>
            <SelectContent style={{ backgroundColor: dlgBg, border: `1px solid ${bdr}`, color: txtPri }}>
              {projectList.slice(1).map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-xs font-semibold tracking-widest uppercase block mb-1.5" style={{ color: txtMut }}>Priority</label>
          <Select value={value.priority} onValueChange={v => onChange({ ...value, priority: v })}>
            <SelectTrigger style={{ ...inSt, height: "2.75rem" }}><SelectValue /></SelectTrigger>
            <SelectContent style={{ backgroundColor: dlgBg, border: `1px solid ${bdr}`, color: txtPri }}>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-semibold tracking-widest uppercase block mb-1.5" style={{ color: txtMut }}>Assignee</label>
          <Select value={value.assignee} onValueChange={v => onChange({ ...value, assignee: v })}>
            <SelectTrigger style={{ ...inSt, height: "2.75rem" }}><SelectValue placeholder="Assign to..." /></SelectTrigger>
            <SelectContent style={{ backgroundColor: dlgBg, border: `1px solid ${bdr}`, color: txtPri }}>
              {assignees.slice(1).map(a => <SelectItem key={a} value={a}>{a}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-xs font-semibold tracking-widest uppercase block mb-1.5" style={{ color: txtMut }}>Due Date</label>
          <input type="date" value={value.dueDate}
            onChange={e => onChange({ ...value, dueDate: e.target.value })}
            className="w-full px-3 text-sm outline-none"
            style={{ ...inSt, height: "2.75rem", display: "block" }} />
        </div>
      </div>
      {value.status !== undefined && (
        <div>
          <label className="text-xs font-semibold tracking-widest uppercase block mb-1.5" style={{ color: txtMut }}>Status</label>
          <Select value={value.status} onValueChange={v => onChange({ ...value, status: v })}>
            <SelectTrigger style={{ ...inSt, height: "2.75rem" }}><SelectValue /></SelectTrigger>
            <SelectContent style={{ backgroundColor: dlgBg, border: `1px solid ${bdr}`, color: txtPri }}>
              <SelectItem value="todo">To Do</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="review">Review</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  )

  // ── List Task Row ──
  const TaskRow = ({ task }: { task: any }) => {
    const sc = statusConfig(task.status, dark)
    const Icon = sc.icon
    const expanded = expandedId === task.id

    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, x: -10 }}
        transition={{ duration: 0.25 }}
        className="relative rounded-2xl overflow-hidden group"
        style={{ backgroundColor: cardBg, border: `1px solid ${bdr}`, backdropFilter: "blur(16px)", transition: "all 0.2s ease" }}
      >
        <div className="absolute top-0 inset-x-0 h-px" style={{ background: "linear-gradient(90deg,transparent,rgba(92,180,200,0.18),transparent)" }} />

        {/* Main row */}
        <div className="flex items-center gap-3 px-4 py-3.5">
          {/* Status icon */}
          <div className="flex-shrink-0">
            <Icon size={18} style={{ color: sc.txt }} />
          </div>

          {/* Title + meta */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-0.5">
              <span className="font-semibold text-sm" style={{ color: txtPri }}>{task.title}</span>
              <span className="text-xs px-2 py-0.5 rounded-full"
                style={{ backgroundColor: sc.bg, color: sc.txt }}>
                {task.status.replace("-", " ")}
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full flex items-center gap-1"
                style={{ backgroundColor: dark ? "rgba(92,124,137,0.15)" : "rgba(31,73,89,0.08)", color: priorityColor(task.priority) }}>
                <Flag size={10} />{task.priority}
              </span>
            </div>
            <div className="flex items-center gap-3 flex-wrap text-xs" style={{ color: txtMut }}>
              <span>{task.project}</span>
              <div className="flex items-center gap-1"><Calendar size={10} />{task.dueDate || "—"}</div>
              <div className="flex items-center gap-1"><User size={10} />{task.assignee.name}</div>
            </div>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            {/* Quick status change */}
            <Select value={task.status} onValueChange={v => handleStatusChange(task.id, v)}>
              <SelectTrigger
                className="hidden sm:flex items-center gap-1 text-xs rounded-lg px-2"
                style={{ ...inSt, height: 30, minWidth: 110, fontSize: "0.72rem" }}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent style={{ backgroundColor: dlgBg, border: `1px solid ${bdr}`, color: txtPri }}>
                <SelectItem value="todo">To Do</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="review">Review</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>

            {/* Avatar */}
            <div title={task.assignee.name}
              className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
              style={{ background: `linear-gradient(135deg,${authorColor(task.assignee.name)}88,${authorColor(task.assignee.name)})`, fontSize: "0.62rem" }}>
              {task.assignee.initials}
            </div>

            {/* Expand */}
            <motion.button whileTap={{ scale: 0.85 }}
              onClick={() => setExpandedId(expanded ? null : task.id)}
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ color: txtMut, cursor: "pointer", backgroundColor: dark ? "rgba(31,73,89,0.2)" : "rgba(92,160,200,0.12)", transition: "all 0.1s" }}>
              {expanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
            </motion.button>

            {/* Edit */}
            <motion.button whileTap={{ scale: 0.85 }}
              onClick={() => setEditingTask(task)}
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ color: dark ? "#A7D0E3" : "#1F4959", cursor: "pointer", backgroundColor: dark ? "rgba(31,73,89,0.2)" : "rgba(92,160,200,0.12)", transition: "all 0.1s" }}>
              <Edit size={13} />
            </motion.button>

            {/* Delete */}
            <motion.button
              whileHover={{ backgroundColor: "rgba(239,68,68,0.2)" }}
              whileTap={{ scale: 0.85 }}
              onClick={() => setDeletingId(task.id)}
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ color: "#ef4444", cursor: "pointer", backgroundColor: dark ? "rgba(239,68,68,0.1)" : "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", transition: "all 0.1s" }}>
              <Trash2 size={13} />
            </motion.button>
          </div>
        </div>

        {/* Expanded description + tags */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <div className="px-14 pb-4 pt-1">
                <p className="text-sm leading-relaxed mb-3" style={{ color: txtMut }}>{task.description}</p>
                {task.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {task.tags.map((tag: string) => (
                      <span key={tag} className="text-xs px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: dark ? "rgba(92,124,137,0.18)" : "rgba(31,73,89,0.1)", color: dark ? "#A7D0E3" : "#1F4959", border: `1px solid ${bdr}` }}>
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    )
  }

  // ── Board Card ──
  const BoardCard = ({ task }: { task: any }) => {
    const sc = statusConfig(task.status, dark)
    return (
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        whileHover={{ y: -2 }}
        transition={{ duration: 0.2 }}
        className="relative rounded-xl p-3.5 group"
        style={{ backgroundColor: cardBg, border: `1px solid ${bdr}`, backdropFilter: "blur(16px)", cursor: "pointer" }}
      >
        <div className="absolute top-0 inset-x-0 h-px" style={{ background: "linear-gradient(90deg,transparent,rgba(92,180,200,0.15),transparent)" }} />

        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <p className="text-xs font-semibold leading-snug flex-1" style={{ color: txtPri }}>{task.title}</p>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <motion.button whileTap={{ scale: 0.85 }}
              onClick={() => setEditingTask(task)}
              className="w-6 h-6 rounded-lg flex items-center justify-center"
              style={{ color: dark ? "#A7D0E3" : "#1F4959", cursor: "pointer", backgroundColor: dark ? "rgba(31,73,89,0.3)" : "rgba(92,160,200,0.2)" }}>
              <Edit size={11} />
            </motion.button>
            <motion.button whileTap={{ scale: 0.85 }}
              onClick={() => setDeletingId(task.id)}
              className="w-6 h-6 rounded-lg flex items-center justify-center"
              style={{ color: "#ef4444", cursor: "pointer", backgroundColor: "rgba(239,68,68,0.1)" }}>
              <Trash2 size={11} />
            </motion.button>
          </div>
        </div>

        {/* Description */}
        <p className="text-xs mb-3 line-clamp-2" style={{ color: txtMut }}>{task.description}</p>

        {/* Tags */}
        {task.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {task.tags.slice(0, 2).map((tag: string) => (
              <span key={tag} className="text-xs px-1.5 py-0.5 rounded-full"
                style={{ backgroundColor: dark ? "rgba(92,124,137,0.18)" : "rgba(31,73,89,0.1)", color: dark ? "#A7D0E3" : "#1F4959" }}>
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="text-xs px-2 py-0.5 rounded-full flex items-center gap-1"
              style={{ backgroundColor: dark ? "rgba(92,124,137,0.15)" : "rgba(31,73,89,0.08)", color: priorityColor(task.priority) }}>
              <Flag size={9} />{task.priority}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            {task.dueDate && (
              <div className="flex items-center gap-1 text-xs" style={{ color: txtMut }}>
                <Calendar size={10} />{task.dueDate.slice(5)}
              </div>
            )}
            <div title={task.assignee.name}
              className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
              style={{ background: `linear-gradient(135deg,${authorColor(task.assignee.name)}88,${authorColor(task.assignee.name)})`, fontSize: "0.55rem" }}>
              {task.assignee.initials}
            </div>
          </div>
        </div>

        {/* Quick status move */}
        <div className="mt-2.5 pt-2.5 border-t opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ borderColor: bdr }}>
          <Select value={task.status} onValueChange={v => handleStatusChange(task.id, v)}>
            <SelectTrigger className="w-full text-xs rounded-lg" style={{ ...inSt, height: 28, fontSize: "0.7rem" }}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent style={{ backgroundColor: dlgBg, border: `1px solid ${bdr}`, color: txtPri }}>
              <SelectItem value="todo">To Do</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="review">Review</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </motion.div>
    )
  }

  return (
    <div className="flex flex-col"
      style={{ minHeight: "100dvh", backgroundColor: pageBg, color: txtPri, fontFamily: "'DM Sans',sans-serif", transition: "background-color 0.4s ease" }}>

      {/* ── Navbar ── */}
      <header className="sticky top-0 z-30 flex items-center gap-3 px-5 flex-shrink-0"
        style={{ height: 60, backgroundColor: navBg, borderBottom: `1px solid ${bdr}`, backdropFilter: "blur(24px)" }}>

        <motion.button whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.94 }}
          onClick={() => router.push("/dashboard")}
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: dark ? "rgba(31,73,89,0.3)" : "rgba(92,160,200,0.2)", color: txtPri, border: `1px solid ${bdr}`, cursor: "pointer" }}>
          <ArrowLeft size={16} />
        </motion.button>

        <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "1.3rem", fontWeight: 700, fontStyle: "italic", color: txtPri, whiteSpace: "nowrap" }}>
          Tasks
        </h1>

        {/* Search */}
        <div className="flex items-center gap-2 px-3 rounded-xl flex-1"
          style={{ backgroundColor: dark ? "rgba(31,73,89,0.18)" : "rgba(92,160,200,0.14)", border: `1px solid ${bdr}`, height: 38, maxWidth: 360 }}>
          <Search size={14} style={{ color: txtMut, flexShrink: 0 }} />
          <input type="text" placeholder="Search tasks..."
            className="bg-transparent border-none outline-none text-sm flex-1 min-w-0"
            style={{ color: txtPri, fontFamily: "'DM Sans',sans-serif" }}
            value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")} style={{ color: txtMut, cursor: "pointer" }}><X size={13} /></button>
          )}
        </div>

        {/* Right */}
        <div className="flex items-center gap-2 ml-auto flex-shrink-0">
          {/* View toggle */}
          <div className="flex rounded-xl overflow-hidden" style={{ border: `1px solid ${bdr}` }}>
            {(["list", "board"] as const).map(mode => (
              <button key={mode} onClick={() => setViewMode(mode)}
                className="w-9 h-9 flex items-center justify-center"
                style={{
                  backgroundColor: viewMode === mode ? (dark ? "rgba(31,73,89,0.6)" : "rgba(31,73,89,0.15)") : "transparent",
                  color: viewMode === mode ? (dark ? "#A7D0E3" : "#1F4959") : txtMut,
                  cursor: "pointer", transition: "all 0.1s ease",
                }}>
                {mode === "list" ? <List size={15} /> : <Kanban size={15} />}
              </button>
            ))}
          </div>

          {/* New task */}
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white"
                style={{ background: "linear-gradient(135deg,#1F4959,#2d7a96)", border: "1px solid rgba(92,124,137,0.3)", boxShadow: "0 4px 14px rgba(11,46,58,0.35)", cursor: "pointer" }}>
                <Plus size={15} /><span className="hidden sm:inline">New Task</span>
              </motion.button>
            </DialogTrigger>
            <DialogContent style={{ backgroundColor: dlgBg, border: `1px solid ${bdr}`, color: txtPri }}>
              <DialogHeader>
                <DialogTitle style={{ color: txtPri, fontFamily: "'Cormorant Garamond',serif", fontSize: "1.4rem" }}>Create New Task</DialogTitle>
                <DialogDescription style={{ color: txtMut }}>Add a task and assign it to a team member.</DialogDescription>
              </DialogHeader>
              <TaskForm value={newTask} onChange={setNewTask} />
              <DialogFooter className="mt-5 gap-2">
                <button onClick={() => setIsCreateOpen(false)} className="px-4 py-2 rounded-xl text-sm font-medium" style={{ border: `1px solid ${bdr}`, color: txtMut, cursor: "pointer" }}>Cancel</button>
                <button onClick={handleCreate} className="px-4 py-2 rounded-xl text-sm font-semibold text-white" style={{ background: "linear-gradient(135deg,#1F4959,#2d7a96)", cursor: "pointer" }}>Create Task</button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      {/* ── Content ── */}
      <main className="flex-1 overflow-y-auto">
        <div style={{ padding: "20px 16px 24px", maxWidth: 1400, margin: "0 auto" }} className="lg:px-8">

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
            {statsArr.map((s, i) => (
              <motion.div key={s.label}
                initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                whileHover={{ y: -2 }}
                className="relative rounded-2xl p-4"
                style={{ backgroundColor: cardBg, border: `1px solid ${bdr}`, backdropFilter: "blur(16px)" }}>
                <div className="absolute top-0 inset-x-0 h-px" style={{ background: "linear-gradient(90deg,transparent,rgba(92,180,200,0.2),transparent)" }} />
                <p className="text-xs font-semibold tracking-wide uppercase mb-1" style={{ color: txtMut, fontSize: "0.62rem" }}>{s.label}</p>
                <p className="text-2xl font-bold" style={{ color: s.color, fontFamily: "'Cormorant Garamond',serif" }}>{s.value}</p>
              </motion.div>
            ))}
          </div>

          {/* Filters row */}
          <div className="flex flex-wrap items-center gap-2 mb-5">
            <Select value={filterProject} onValueChange={setFilterProject}>
              <SelectTrigger className="text-sm rounded-xl" style={{ ...inSt, height: 36, minWidth: 160 }}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent style={{ backgroundColor: dlgBg, border: `1px solid ${bdr}`, color: txtPri }}>
                {projectList.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
              </SelectContent>
            </Select>

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="text-sm rounded-xl" style={{ ...inSt, height: 36, minWidth: 130 }}>
                <Filter size={12} style={{ marginRight: 4 }} /><SelectValue />
              </SelectTrigger>
              <SelectContent style={{ backgroundColor: dlgBg, border: `1px solid ${bdr}`, color: txtPri }}>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="todo">To Do</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="review">Review</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterPriority} onValueChange={setFilterPriority}>
              <SelectTrigger className="text-sm rounded-xl" style={{ ...inSt, height: 36, minWidth: 130 }}>
                <Flag size={12} style={{ marginRight: 4 }} /><SelectValue />
              </SelectTrigger>
              <SelectContent style={{ backgroundColor: dlgBg, border: `1px solid ${bdr}`, color: txtPri }}>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterAssignee} onValueChange={setFilterAssignee}>
              <SelectTrigger className="text-sm rounded-xl" style={{ ...inSt, height: 36, minWidth: 140 }}>
                <User size={12} style={{ marginRight: 4 }} /><SelectValue />
              </SelectTrigger>
              <SelectContent style={{ backgroundColor: dlgBg, border: `1px solid ${bdr}`, color: txtPri }}>
                <SelectItem value="all">All Assignees</SelectItem>
                {assignees.slice(1).map(a => <SelectItem key={a} value={a}>{a}</SelectItem>)}
              </SelectContent>
            </Select>

            {/* Clear filters */}
            {(filterProject !== "All Projects" || filterStatus !== "all" || filterPriority !== "all" || filterAssignee !== "all" || searchQuery) && (
              <motion.button initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                onClick={() => { setFilterProject("All Projects"); setFilterStatus("all"); setFilterPriority("all"); setFilterAssignee("all"); setSearchQuery("") }}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs"
                style={{ color: "#5CAFC4", backgroundColor: "rgba(92,160,200,0.1)", border: "1px solid rgba(92,160,200,0.2)", cursor: "pointer" }}>
                <X size={11} /> Clear all
              </motion.button>
            )}

            <p className="text-xs ml-auto" style={{ color: txtMut }}>
              <span style={{ color: txtPri, fontWeight: 600 }}>{filtered.length}</span> / {tasks.length} tasks
            </p>
          </div>

          {/* ── LIST VIEW ── */}
          <AnimatePresence mode="wait">
            {viewMode === "list" ? (
              <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex flex-col gap-2">
                <AnimatePresence>
                  {filtered.length > 0 ? filtered.map((task, i) => (
                    <motion.div key={task.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                      <TaskRow task={task} />
                    </motion.div>
                  )) : (
                    <EmptyState searchQuery={searchQuery} filterProject={filterProject} filterStatus={filterStatus} onCreate={() => setIsCreateOpen(true)} glassBg={glassBg} bdr={bdr} txtPri={txtPri} txtMut={txtMut} dark={dark} />
                  )}
                </AnimatePresence>
              </motion.div>
            ) : (
              // ── BOARD VIEW ──
              <motion.div key="board" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                {BOARD_COLS.map(col => {
                  const colTasks = (byStatus as any)[col.key] || []
                  return (
                    <div key={col.key} className="flex flex-col gap-3">
                      {/* Column header */}
                      <div className="flex items-center justify-between px-1">
                        <div className="flex items-center gap-2">
                          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: col.accent }} />
                          <h3 className="text-sm font-semibold" style={{ color: txtPri }}>{col.label}</h3>
                        </div>
                        <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
                          style={{ backgroundColor: dark ? "rgba(92,124,137,0.2)" : "rgba(31,73,89,0.1)", color: txtMut }}>
                          {colTasks.length}
                        </span>
                      </div>

                      {/* Column body */}
                      <div className="rounded-2xl p-3 flex flex-col gap-2.5 min-h-[200px]"
                        style={{ backgroundColor: colBg, border: `1px solid ${bdr}`, backdropFilter: "blur(12px)" }}>
                        <AnimatePresence>
                          {colTasks.map((task: any) => (
                            <BoardCard key={task.id} task={task} />
                          ))}
                        </AnimatePresence>
                        {colTasks.length === 0 && (
                          <div className="flex-1 flex items-center justify-center py-6">
                            <p className="text-xs" style={{ color: txtMut }}>No tasks</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="px-8 py-4" style={{ borderTop: `1px solid ${bdr}` }}>
          <div className="flex items-center justify-center gap-3">
            <p className="text-xs tracking-[0.15em] uppercase" style={{ color: dark ? "rgba(255,255,255,0.18)" : "rgba(11,46,58,0.25)" }}>© 2025 KaryaLaya</p>
            <div className="w-px h-3" style={{ backgroundColor: dark ? "rgba(92,124,137,0.35)" : "rgba(31,73,89,0.2)" }} />
            <p style={{ color: dark ? "rgba(167,208,227,0.3)" : "rgba(31,73,89,0.3)", fontStyle: "italic", fontFamily: "'Cormorant Garamond',serif", fontSize: "0.82rem" }}>Crafted by Satyam Kumar</p>
          </div>
        </div>
      </main>

      {/* ── Edit dialog ── */}
      <AnimatePresence>
        {editingTask && (
          <Dialog open={!!editingTask} onOpenChange={v => !v && setEditingTask(null)}>
            <DialogContent style={{ backgroundColor: dlgBg, border: `1px solid ${bdr}`, color: txtPri }}>
              <DialogHeader>
                <DialogTitle style={{ color: txtPri, fontFamily: "'Cormorant Garamond',serif", fontSize: "1.4rem" }}>Edit Task</DialogTitle>
                <DialogDescription style={{ color: txtMut }}>Update task details.</DialogDescription>
              </DialogHeader>
              <TaskForm
                value={editingTask}
                onChange={v => setEditingTask({ ...editingTask, ...v })}
              />
              <DialogFooter className="mt-5 gap-2">
                <button onClick={() => setEditingTask(null)} className="px-4 py-2 rounded-xl text-sm font-medium" style={{ border: `1px solid ${bdr}`, color: txtMut, cursor: "pointer" }}>Cancel</button>
                <button onClick={handleEdit} className="px-4 py-2 rounded-xl text-sm font-semibold text-white" style={{ background: "linear-gradient(135deg,#1F4959,#2d7a96)", cursor: "pointer" }}>Save Changes</button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>

      {/* ── Delete confirm ── */}
      <AnimatePresence>
        {deletingId && (
          <Dialog open={!!deletingId} onOpenChange={v => !v && setDeletingId(null)}>
            <DialogContent style={{ backgroundColor: dlgBg, border: "1px solid rgba(239,68,68,0.3)", color: txtPri, maxWidth: 400 }}>
              <DialogHeader>
                <DialogTitle style={{ color: "#ef4444", fontFamily: "'Cormorant Garamond',serif", fontSize: "1.4rem" }}>Delete Task</DialogTitle>
                <DialogDescription style={{ color: txtMut }}>
                  Permanently delete <strong style={{ color: txtPri }}>{tasks.find(t => t.id === deletingId)?.title}</strong>? This cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="mt-5 gap-2">
                <button onClick={() => setDeletingId(null)} className="px-4 py-2 rounded-xl text-sm font-medium" style={{ border: `1px solid ${bdr}`, color: txtMut, cursor: "pointer" }}>Cancel</button>
                <button onClick={() => handleDelete(deletingId!)} className="px-4 py-2 rounded-xl text-sm font-semibold text-white" style={{ background: "linear-gradient(135deg,#8b0000,#ef4444)", cursor: "pointer" }}>Delete Task</button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </div>
  )
}

// ── Empty State ────────────────────────────────────────────
function EmptyState({ searchQuery, filterProject, filterStatus, onCreate, glassBg, bdr, txtPri, txtMut, dark }: any) {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
      className="rounded-2xl p-16 text-center"
      style={{ backgroundColor: glassBg, border: `2px dashed ${dark ? "rgba(92,124,137,0.22)" : "rgba(92,160,200,0.3)"}`, backdropFilter: "blur(16px)" }}>
      <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
        style={{ background: "linear-gradient(135deg,rgba(31,73,89,0.4),rgba(92,124,137,0.25))", border: `1px solid ${bdr}` }}>
        <CheckCircle2 size={28} style={{ color: "#5CAFC4" }} />
      </div>
      <h3 className="font-semibold text-base mb-1.5" style={{ color: txtPri }}>No tasks found</h3>
      <p className="text-sm mb-5" style={{ color: txtMut }}>
        {searchQuery || filterProject !== "All Projects" || filterStatus !== "all"
          ? "Try adjusting your filters."
          : "Create your first task to get started."}
      </p>
      {!searchQuery && filterProject === "All Projects" && filterStatus === "all" && (
        <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} onClick={onCreate}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
          style={{ background: "linear-gradient(135deg,#1F4959,#2d7a96)", cursor: "pointer" }}>
          <Plus size={14} /> Create Task
        </motion.button>
      )}
    </motion.div>
  )
}