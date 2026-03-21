// frontend/app/dashboard/notifications/page.tsx
"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import {
  Bell, CheckCircle2, MessageSquare, Users, Calendar,
  AlertTriangle, Settings, Trash2, Filter, ArrowLeft,
  CheckCheck, X, ChevronDown,
} from "lucide-react"

// ── Types ──────────────────────────────────────────────────
type Priority = "high" | "medium" | "low"
type NotifType = "task_assigned" | "task_completed" | "mention" | "deadline_approaching" | "project_update" | "team_joined"

interface Notification {
  id: number
  type: NotifType
  title: string
  message: string
  timestamp: string
  read: boolean
  priority: Priority
  initials: string | null
  project: string | null
}

interface Setting { key: string; label: string; enabled: boolean }
interface Category { category: string; description: string; settings: Setting[] }

// ── Mock data ──────────────────────────────────────────────
const initialNotifications: Notification[] = [
  { id: 1, type: "task_assigned",        title: "New task assigned",         message: "Sarah Chen assigned you 'Set up authentication flow'",                            timestamp: "2 minutes ago",  read: false, priority: "high",   initials: "SC", project: "Website Redesign" },
  { id: 2, type: "mention",              title: "You were mentioned",        message: "Mike Johnson mentioned you in #development: 'Can you review the API integration?'", timestamp: "15 minutes ago", read: false, priority: "medium", initials: "MJ", project: "Mobile App" },
  { id: 3, type: "task_completed",       title: "Task completed",            message: "Alex Rivera completed 'Design homepage mockup'",                                  timestamp: "1 hour ago",     read: true,  priority: "low",    initials: "AR", project: "Website Redesign" },
  { id: 4, type: "deadline_approaching", title: "Deadline approaching",      message: "Website Redesign project is due in 3 days",                                       timestamp: "2 hours ago",    read: false, priority: "high",   initials: null, project: "Website Redesign" },
  { id: 5, type: "project_update",       title: "Project milestone reached", message: "Marketing Campaign has reached 90% completion",                                   timestamp: "1 day ago",      read: true,  priority: "medium", initials: null, project: "Marketing Campaign" },
  { id: 6, type: "team_joined",          title: "New team member",           message: "Emma Davis joined the Mobile App Development project",                             timestamp: "2 days ago",     read: true,  priority: "low",    initials: "ED", project: "Mobile App" },
]

const initialSettings: Category[] = [
  {
    category: "Task Updates",
    description: "Get notified when tasks are assigned, completed, or updated",
    settings: [
      { key: "task_assigned",  label: "Task assignments",  enabled: true  },
      { key: "task_completed", label: "Task completions",  enabled: true  },
      { key: "task_overdue",   label: "Overdue tasks",     enabled: true  },
      { key: "task_comments",  label: "Task comments",     enabled: false },
    ],
  },
  {
    category: "Project Updates",
    description: "Stay informed about project progress and milestones",
    settings: [
      { key: "project_milestones",  label: "Project milestones",  enabled: true  },
      { key: "deadline_reminders",  label: "Deadline reminders",  enabled: true  },
      { key: "project_status",      label: "Status changes",      enabled: false },
    ],
  },
  {
    category: "Team Communication",
    description: "Notifications for messages and mentions",
    settings: [
      { key: "mentions",          label: "When mentioned",   enabled: true  },
      { key: "direct_messages",   label: "Direct messages",  enabled: true  },
      { key: "channel_messages",  label: "Channel messages", enabled: false },
    ],
  },
]

// ── Helpers ────────────────────────────────────────────────
function priorityAccent(p: Priority, dark: boolean) {
  if (p === "high")   return dark ? "#ff6b6b" : "#dc2626"
  if (p === "medium") return dark ? "#ffd700" : "#d97706"
  return dark ? "rgba(255,255,255,0.3)" : "rgba(11,46,58,0.3)"
}

function typeIcon(type: NotifType, dark: boolean) {
  const c = (col: string) => ({ color: col })
  const iconColor = dark ? "#A7D0E3" : "#1F4959"
  switch (type) {
    case "task_assigned":
    case "task_completed":       return <CheckCircle2 size={18} style={c("#50c878")} />
    case "mention":              return <MessageSquare size={18} style={c(iconColor)} />
    case "deadline_approaching": return <AlertTriangle size={18} style={c("#ff6b6b")} />
    case "project_update":       return <Calendar size={18} style={c("#c084fc")} />
    case "team_joined":          return <Users size={18} style={c("#ffd700")} />
    default:                     return <Bell size={18} style={c(iconColor)} />
  }
}

function authorColor(initials: string) {
  const colors = ["#5CAFC4", "#c084fc", "#50c878", "#ff8a65", "#ffd700", "#ff6b6b"]
  return colors[(initials?.charCodeAt(0) || 0) % colors.length]
}

// ── Toggle Switch ──────────────────────────────────────────
function Toggle({ enabled, onChange, dark }: { enabled: boolean; onChange: (v: boolean) => void; dark: boolean }) {
  return (
    <button
      onClick={() => onChange(!enabled)}
      className="relative flex-shrink-0"
      style={{
        width: 44, height: 24,
        backgroundColor: enabled ? "#1F4959" : (dark ? "rgba(31,73,89,0.25)" : "rgba(92,160,200,0.2)"),
        border: `1px solid ${enabled ? "rgba(92,160,200,0.4)" : (dark ? "rgba(92,124,137,0.3)" : "rgba(92,160,200,0.3)")}`,
        borderRadius: 99, cursor: "pointer",
        transition: "background-color 0.2s ease, border-color 0.2s ease",
      }}
    >
      <motion.div
        animate={{ x: enabled ? 22 : 2 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        style={{
          position: "absolute", top: 2,
          width: 18, height: 18,
          borderRadius: "50%",
          backgroundColor: enabled ? "#A7D0E3" : (dark ? "rgba(255,255,255,0.3)" : "rgba(11,46,58,0.3)"),
        }}
      />
    </button>
  )
}

// ── Notification Card ──────────────────────────────────────
function NotifCard({
  notif, dark, onMarkRead, onDelete,
}: {
  notif: Notification; dark: boolean;
  onMarkRead: (id: number) => void;
  onDelete: (id: number) => void;
}) {
  const bdr     = dark ? "rgba(92,124,137,0.18)" : "rgba(92,160,200,0.28)"
  const txtPri  = dark ? "#ffffff" : "#0B2E3A"
  const txtMut  = dark ? "rgba(255,255,255,0.42)" : "rgba(11,46,58,0.48)"
  const glassBg = dark ? "rgba(10,22,34,0.75)" : "rgba(195,228,244,0.7)"
  const accent  = priorityAccent(notif.priority, dark)
  const color   = notif.initials ? authorColor(notif.initials) : "#5CAFC4"

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -30, scale: 0.97 }}
      transition={{ duration: 0.28 }}
      whileHover={{ y: -1 }}
      className="relative rounded-2xl overflow-hidden"
      style={{
        backgroundColor: notif.read ? glassBg : (dark ? "rgba(15,45,70,0.85)" : "rgba(180,220,240,0.82)"),
        border: `1px solid ${notif.read ? bdr : (dark ? "rgba(92,160,200,0.22)" : "rgba(31,73,89,0.22)")}`,
        backdropFilter: "blur(16px)",
        boxShadow: notif.read ? "none" : (dark ? "0 4px 20px rgba(0,0,0,0.2)" : "0 4px 20px rgba(31,73,89,0.08)"),
        transition: "all 0.2s ease",
      }}
    >
      {/* Priority left bar */}
      <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl" style={{ backgroundColor: accent }} />

      {/* Unread dot */}
      {!notif.read && (
        <div className="absolute top-4 right-14 w-2 h-2 rounded-full" style={{ backgroundColor: "#5CAFC4" }} />
      )}

      <div className="pl-5 pr-4 py-4">
        <div className="flex items-start gap-3">
          {/* Icon / Avatar */}
          <div className="flex-shrink-0 mt-0.5">
            {notif.initials ? (
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white"
                style={{ background: `linear-gradient(135deg,${color}88,${color})` }}
              >
                {notif.initials}
              </div>
            ) : (
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: dark ? "rgba(31,73,89,0.35)" : "rgba(92,160,200,0.2)", border: `1px solid ${bdr}` }}
              >
                {typeIcon(notif.type, dark)}
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h3 className="text-sm font-semibold truncate" style={{ color: txtPri }}>{notif.title}</h3>
                <p className="text-xs mt-0.5 leading-relaxed" style={{ color: txtMut }}>{notif.message}</p>

                {/* Meta row */}
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <span className="text-xs" style={{ color: txtMut }}>{notif.timestamp}</span>
                  {notif.project && (
                    <>
                      <span style={{ color: txtMut, fontSize: "0.6rem" }}>•</span>
                      <span
                        className="text-xs px-2 py-0.5 rounded-lg font-medium"
                        style={{ backgroundColor: dark ? "rgba(31,73,89,0.4)" : "rgba(92,160,200,0.2)", color: dark ? "#A7D0E3" : "#1F4959", border: `1px solid ${bdr}` }}
                      >
                        {notif.project}
                      </span>
                    </>
                  )}
                  <span
                    className="text-xs px-2 py-0.5 rounded-lg font-semibold"
                    style={{
                      backgroundColor: notif.priority === "high" ? "rgba(239,68,68,0.15)" : notif.priority === "medium" ? "rgba(234,179,8,0.15)" : "rgba(100,100,100,0.15)",
                      color: accent,
                      border: `1px solid ${accent}30`,
                    }}
                  >
                    {notif.priority}
                  </span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-1 flex-shrink-0">
                {!notif.read && (
                  <motion.button
                    whileHover={{ scale: 1.1, backgroundColor: "rgba(92,124,137,0.2)" }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => onMarkRead(notif.id)}
                    title="Mark as read"
                    className="w-7 h-7 rounded-lg flex items-center justify-center"
                    style={{ color: "#5CAFC4", cursor: "pointer", transition: "all 0.1s ease" }}
                  >
                    <CheckCheck size={14} />
                  </motion.button>
                )}
                <motion.button
                  whileHover={{ scale: 1.1, backgroundColor: "rgba(239,68,68,0.15)" }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => onDelete(notif.id)}
                  title="Delete"
                  className="w-7 h-7 rounded-lg flex items-center justify-center"
                  style={{ color: dark ? "rgba(255,100,100,0.6)" : "rgba(180,30,30,0.5)", cursor: "pointer", transition: "all 0.1s ease" }}
                >
                  <Trash2 size={13} />
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// ── Main ───────────────────────────────────────────────────
export default function NotificationsPage() {
  const router = useRouter()
  const [dark, setDark] = useState(true)
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications)
  const [settings, setSettings] = useState<Category[]>(initialSettings)
  const [activeTab, setActiveTab] = useState<"all" | "tasks" | "mentions" | "deadlines" | "settings">("all")
  const [filterRead, setFilterRead] = useState<"all" | "unread" | "read">("all")
  const [filterOpen, setFilterOpen] = useState(false)

  // Sync dark/light from localStorage (same key as dashboard)
  useEffect(() => {
    const th = localStorage.getItem("karyalaya_theme")
    if (th) setDark(th === "dark")
  }, [])

  const unread = notifications.filter(n => !n.read).length

  const filtered = notifications.filter(n => {
    if (activeTab === "tasks"     && n.type !== "task_assigned" && n.type !== "task_completed") return false
    if (activeTab === "mentions"  && n.type !== "mention")              return false
    if (activeTab === "deadlines" && n.type !== "deadline_approaching") return false
    if (filterRead === "unread"   && n.read)  return false
    if (filterRead === "read"     && !n.read) return false
    return true
  })

  const markRead   = (id: number) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
  const markAllRead = ()         => setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  const deleteNotif = (id: number) => setNotifications(prev => prev.filter(n => n.id !== id))
  const clearAll    = ()           => setNotifications([])

  const toggleSetting = (ci: number, si: number, val: boolean) => {
    setSettings(prev => {
      const next = prev.map((c, i) => i !== ci ? c : {
        ...c,
        settings: c.settings.map((s, j) => j !== si ? s : { ...s, enabled: val }),
      })
      return next
    })
  }

  // Theme tokens
  const pageBg  = dark ? "#060e16" : "#d5ecf8"
  const navBg   = dark ? "rgba(6,14,22,0.96)" : "rgba(213,236,248,0.96)"
  const sideBg  = dark ? "#07121d" : "#c5e2f0"
  const bdr     = dark ? "rgba(92,124,137,0.18)" : "rgba(92,160,200,0.3)"
  const txtPri  = dark ? "#ffffff" : "#0B2E3A"
  const txtMut  = dark ? "rgba(255,255,255,0.4)" : "rgba(11,46,58,0.48)"
  const glassBg = dark ? "rgba(10,22,34,0.75)" : "rgba(195,228,244,0.7)"
  const accent  = "#5CAFC4"

  const tabs: { key: typeof activeTab; label: string }[] = [
    { key: "all",       label: "All" },
    { key: "tasks",     label: "Tasks" },
    { key: "mentions",  label: "Mentions" },
    { key: "deadlines", label: "Deadlines" },
    { key: "settings",  label: "Settings" },
  ]

  return (
    <div
      style={{
        minHeight: "100dvh",
        backgroundColor: pageBg,
        color: txtPri,
        fontFamily: "'DM Sans',sans-serif",
        transition: "background-color 0.4s ease",
      }}
    >
      {/* ── Background blobs ── */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full" style={{ background: dark ? "radial-gradient(circle,rgba(31,73,89,0.3) 0%,transparent 70%)" : "radial-gradient(circle,rgba(92,160,200,0.18) 0%,transparent 70%)", filter: "blur(60px)" }} />
        <div className="absolute -bottom-20 -right-20 w-96 h-96 rounded-full" style={{ background: dark ? "radial-gradient(circle,rgba(11,46,58,0.35) 0%,transparent 70%)" : "radial-gradient(circle,rgba(31,100,140,0.12) 0%,transparent 70%)", filter: "blur(60px)" }} />
        <div className="absolute inset-0" style={{ backgroundImage: `linear-gradient(${dark ? "rgba(92,124,137,0.04)" : "rgba(31,73,89,0.03)"} 1px,transparent 1px),linear-gradient(90deg,${dark ? "rgba(92,124,137,0.04)" : "rgba(31,73,89,0.03)"} 1px,transparent 1px)`, backgroundSize: "48px 48px" }} />
      </div>

      {/* ── Sticky Header ── */}
      <motion.header
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="sticky top-0 z-30 flex items-center justify-between gap-3 px-5 lg:px-8"
        style={{ height: 64, backgroundColor: navBg, borderBottom: `1px solid ${bdr}`, backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)", position: "relative", zIndex: 10 }}
      >
        {/* Left */}
        <div className="flex items-center gap-3">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => router.push("/dashboard")}
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: dark ? "rgba(31,73,89,0.3)" : "rgba(92,160,200,0.2)", color: txtMut, border: `1px solid ${bdr}`, cursor: "pointer" }}
          >
            <ArrowLeft size={16} />
          </motion.button>

          <div className="flex items-center gap-2.5">
            <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "1.4rem", fontWeight: 700, fontStyle: "italic", color: txtPri }}>
              Notifications
            </h1>
            {unread > 0 && (
              <motion.span
                initial={{ scale: 0 }} animate={{ scale: 1 }}
                className="text-xs px-2 py-0.5 rounded-full font-semibold"
                style={{ backgroundColor: "rgba(239,68,68,0.85)", color: "#fff" }}
              >
                {unread} unread
              </motion.span>
            )}
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2">
          {/* Mark all read */}
          {unread > 0 && (
            <motion.button
              whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
              onClick={markAllRead}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium"
              style={{ backgroundColor: dark ? "rgba(31,73,89,0.35)" : "rgba(92,160,200,0.22)", border: `1px solid ${bdr}`, color: accent, cursor: "pointer", transition: "all 0.1s ease" }}
            >
              <CheckCheck size={14} />
              <span className="hidden md:inline">Mark all read</span>
            </motion.button>
          )}

          {/* Filter dropdown */}
          {activeTab !== "settings" && (
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                onClick={() => setFilterOpen(p => !p)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium"
                style={{ backgroundColor: dark ? "rgba(31,73,89,0.35)" : "rgba(92,160,200,0.22)", border: `1px solid ${bdr}`, color: txtMut, cursor: "pointer", transition: "all 0.1s ease" }}
              >
                <Filter size={14} />
                <span className="hidden sm:inline">{filterRead === "all" ? "All" : filterRead === "unread" ? "Unread" : "Read"}</span>
                <ChevronDown size={12} style={{ transform: filterOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s ease" }} />
              </motion.button>

              <AnimatePresence>
                {filterOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -6, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -6, scale: 0.97 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 rounded-xl overflow-hidden z-50"
                    style={{ backgroundColor: dark ? "#0a1a26" : "#d5ecf8", border: `1px solid ${bdr}`, boxShadow: "0 8px 24px rgba(0,0,0,0.25)", minWidth: 140 }}
                  >
                    {(["all", "unread", "read"] as const).map(f => (
                      <button
                        key={f}
                        onClick={() => { setFilterRead(f); setFilterOpen(false) }}
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-left"
                        style={{
                          backgroundColor: filterRead === f ? (dark ? "rgba(31,73,89,0.5)" : "rgba(92,160,200,0.2)") : "transparent",
                          color: filterRead === f ? accent : txtMut,
                          cursor: "pointer", transition: "all 0.1s ease",
                        }}
                      >
                        {filterRead === f && <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: accent }} />}
                        <span>{f.charAt(0).toUpperCase() + f.slice(1)}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Clear all */}
          {notifications.length > 0 && activeTab !== "settings" && (
            <motion.button
              whileHover={{ scale: 1.04, backgroundColor: "rgba(239,68,68,0.15)" }}
              whileTap={{ scale: 0.96 }}
              onClick={clearAll}
              title="Clear all"
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: dark ? "rgba(31,73,89,0.22)" : "rgba(92,160,200,0.14)", border: `1px solid ${bdr}`, color: dark ? "rgba(255,100,100,0.6)" : "rgba(180,30,30,0.5)", cursor: "pointer", transition: "all 0.1s ease" }}
            >
              <Trash2 size={15} />
            </motion.button>
          )}
        </div>
      </motion.header>

      {/* ── Page body ── */}
      <div className="relative z-10 px-5 lg:px-8 py-6 max-w-4xl mx-auto">

        {/* ── Tab bar ── */}
        <div
          className="flex items-center gap-1 p-1 rounded-2xl mb-6 overflow-x-auto"
          style={{ backgroundColor: dark ? "rgba(10,22,34,0.75)" : "rgba(195,228,244,0.7)", border: `1px solid ${bdr}`, backdropFilter: "blur(16px)" }}
        >
          {tabs.map(t => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className="relative flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium"
              style={{
                color: activeTab === t.key ? (dark ? "#fff" : "#0B2E3A") : txtMut,
                cursor: "pointer", transition: "color 0.15s ease",
                zIndex: 1,
              }}
            >
              {activeTab === t.key && (
                <motion.div
                  layoutId="activeNotifTab"
                  className="absolute inset-0 rounded-xl"
                  style={{ background: "linear-gradient(135deg,#1F4959,#2d7a96)", boxShadow: "0 4px 14px rgba(31,73,89,0.4)", zIndex: -1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 35 }}
                />
              )}
              <span className="relative">{t.label}</span>
              {/* Unread badge on tab */}
              {t.key !== "settings" && (() => {
                const count = initialNotifications.filter(n => {
                  if (!n.read) {
                    if (t.key === "all")       return true
                    if (t.key === "tasks")     return n.type === "task_assigned" || n.type === "task_completed"
                    if (t.key === "mentions")  return n.type === "mention"
                    if (t.key === "deadlines") return n.type === "deadline_approaching"
                  }
                  return false
                }).length
                return count > 0 ? (
                  <span className="ml-1.5 text-xs px-1.5 py-0.5 rounded-full font-semibold"
                    style={{ backgroundColor: activeTab === t.key ? "rgba(255,255,255,0.25)" : "rgba(239,68,68,0.8)", color: "#fff", fontSize: "0.6rem" }}>
                    {count}
                  </span>
                ) : null
              })()}
            </button>
          ))}
        </div>

        {/* ── Notifications list ── */}
        <AnimatePresence mode="wait">
          {activeTab !== "settings" ? (
            <motion.div
              key={activeTab + filterRead}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              {filtered.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="rounded-2xl p-12 text-center"
                  style={{ backgroundColor: glassBg, border: `2px dashed ${bdr}`, backdropFilter: "blur(16px)" }}
                >
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
                    style={{ background: "linear-gradient(135deg,rgba(31,73,89,0.4),rgba(92,124,137,0.25))", border: `1px solid ${bdr}` }}>
                    <Bell size={24} style={{ color: accent }} />
                  </div>
                  <h3 className="font-semibold text-base mb-1" style={{ color: txtPri }}>All caught up!</h3>
                  <p className="text-sm" style={{ color: txtMut }}>
                    {filterRead === "unread" ? "No unread notifications." : "No notifications here."}
                  </p>
                </motion.div>
              ) : (
                <div className="space-y-2.5">
                  <AnimatePresence>
                    {filtered.map(n => (
                      <NotifCard
                        key={n.id}
                        notif={n}
                        dark={dark}
                        onMarkRead={markRead}
                        onDelete={deleteNotif}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </motion.div>
          ) : (
            /* ── Settings tab ── */
            <motion.div
              key="settings"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              {/* Settings header card */}
              <div
                className="rounded-2xl p-5 flex items-center gap-4"
                style={{ backgroundColor: glassBg, border: `1px solid ${bdr}`, backdropFilter: "blur(16px)" }}
              >
                <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: "linear-gradient(135deg,#1F4959,#2d7a96)", border: "1px solid rgba(92,124,137,0.3)" }}>
                  <Settings size={20} style={{ color: "#fff" }} />
                </div>
                <div>
                  <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "1.15rem", fontWeight: 700, color: txtPri }}>Notification Preferences</h2>
                  <p className="text-xs mt-0.5" style={{ color: txtMut }}>Control what you get notified about</p>
                </div>
              </div>

              {/* Settings categories */}
              {settings.map((cat, ci) => (
                <motion.div
                  key={cat.category}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: ci * 0.08 }}
                  className="rounded-2xl overflow-hidden"
                  style={{ backgroundColor: glassBg, border: `1px solid ${bdr}`, backdropFilter: "blur(16px)" }}
                >
                  {/* Category header */}
                  <div className="px-5 py-4" style={{ borderBottom: `1px solid ${bdr}` }}>
                    <h3 className="font-semibold text-sm" style={{ color: txtPri }}>{cat.category}</h3>
                    <p className="text-xs mt-0.5" style={{ color: txtMut }}>{cat.description}</p>
                  </div>

                  {/* Settings rows */}
                  <div className="divide-y" style={{ borderColor: bdr }}>
                    {cat.settings.map((setting, si) => (
                      <motion.div
                        key={setting.key}
                        className="flex items-center justify-between px-5 py-3.5"
                        whileHover={{ backgroundColor: dark ? "rgba(31,73,89,0.1)" : "rgba(92,160,200,0.08)" }}
                        transition={{ duration: 0.1 }}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="w-2 h-2 rounded-full flex-shrink-0"
                            style={{ backgroundColor: setting.enabled ? "#50c878" : (dark ? "rgba(255,255,255,0.2)" : "rgba(11,46,58,0.2)"), transition: "background-color 0.2s ease" }}
                          />
                          <span className="text-sm" style={{ color: setting.enabled ? txtPri : txtMut, transition: "color 0.2s ease" }}>
                            {setting.label}
                          </span>
                        </div>
                        <Toggle
                          enabled={setting.enabled}
                          onChange={val => toggleSetting(ci, si, val)}
                          dark={dark}
                        />
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              ))}

              {/* Save button */}
              <motion.button
                whileHover={{ scale: 1.02, boxShadow: "0 8px 24px rgba(31,73,89,0.4)" }}
                whileTap={{ scale: 0.97 }}
                className="w-full py-3 rounded-xl text-sm font-semibold text-white"
                style={{ background: "linear-gradient(135deg,#1F4959,#2d7a96)", border: "1px solid rgba(92,124,137,0.3)", cursor: "pointer" }}
              >
                Save Preferences
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Click outside to close filter */}
      {filterOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setFilterOpen(false)} />
      )}
    </div>
  )
}