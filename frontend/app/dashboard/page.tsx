// frontend/app/dashboard/page.tsx
"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CommunicationHub } from "@/components/communication-hub"
import { NotificationBell } from "@/components/notification-bell"
import { ProgressTracker } from "@/components/progress-tracker"
import {
  Plus, Users, Calendar, CheckCircle2, MoreHorizontal,
  Search, Settings, ArrowLeft, ArrowRight, RotateCcw,
  UserPlus, Sun, Moon, Menu, X, LayoutDashboard,
  FolderOpen, ListTodo, MessageSquare, BarChart3, Bell, LogOut,
} from "lucide-react"
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useRouter, usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"

const NAV = [
  { icon: LayoutDashboard, label: "Dashboard",     path: "/dashboard" },
  { icon: FolderOpen,      label: "Projects",      path: "/dashboard/projects" },
  { icon: ListTodo,        label: "Tasks",         path: "/dashboard/tasks" },
  { icon: MessageSquare,   label: "Messages",      path: "/dashboard/messages" },
  { icon: BarChart3,       label: "Analytics",     path: "/dashboard/analytics" },
  { icon: Bell,            label: "Notifications", path: "/dashboard/notifications" },
  { icon: Settings,        label: "Settings",      path: "/dashboard/settings" },
]

// ── Background ─────────────────────────────────────────────
function BgEffects({ dark }: { dark: boolean }) {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      <motion.div
        animate={{ x: [0, 40, 0], y: [0, -30, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-32 -left-32 w-96 h-96 rounded-full"
        style={{
          background: dark
            ? "radial-gradient(circle,rgba(31,73,89,0.35) 0%,transparent 70%)"
            : "radial-gradient(circle,rgba(92,160,200,0.22) 0%,transparent 70%)",
          filter: "blur(60px)",
        }}
      />
      <motion.div
        animate={{ x: [0, -30, 0], y: [0, 40, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut", delay: 5 }}
        className="absolute -bottom-20 -right-20 w-96 h-96 rounded-full"
        style={{
          background: dark
            ? "radial-gradient(circle,rgba(11,46,58,0.4) 0%,transparent 70%)"
            : "radial-gradient(circle,rgba(31,100,140,0.15) 0%,transparent 70%)",
          filter: "blur(60px)",
        }}
      />
      <motion.div
        animate={{ x: [0, 25, 0], y: [0, -20, 0] }}
        transition={{ duration: 26, repeat: Infinity, ease: "easeInOut", delay: 10 }}
        className="absolute top-1/2 left-1/3 w-80 h-80 rounded-full"
        style={{
          background: dark
            ? "radial-gradient(circle,rgba(92,124,137,0.15) 0%,transparent 70%)"
            : "radial-gradient(circle,rgba(92,160,200,0.12) 0%,transparent 70%)",
          filter: "blur(50px)",
        }}
      />

      {/* Slow moving grid */}
      <motion.div
        animate={{ x: [0, -48, 0], y: [0, -48, 0] }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        className="absolute"
        style={{
          inset: "-100px",
          backgroundImage: dark
            ? `linear-gradient(rgba(92,124,137,0.07) 1px,transparent 1px),linear-gradient(90deg,rgba(92,124,137,0.07) 1px,transparent 1px)`
            : `linear-gradient(rgba(31,73,89,0.07) 1px,transparent 1px),linear-gradient(90deg,rgba(31,73,89,0.07) 1px,transparent 1px)`,
          backgroundSize: "48px 48px",
        }}
      />

      {/* Large drifting textured squares */}
      {[
        { size: 180, x: "8%",  y: "12%", delay: 0,  dur: 28, rx: [0, 15, 0],  ry: [0, 12, 0]  },
        { size: 120, x: "78%", y: "8%",  delay: 4,  dur: 22, rx: [0, -10, 0], ry: [0, 18, 0]  },
        { size: 200, x: "65%", y: "55%", delay: 8,  dur: 32, rx: [0, 12, 0],  ry: [0, -15, 0] },
        { size: 90,  x: "15%", y: "65%", delay: 2,  dur: 24, rx: [0, -8, 0],  ry: [0, 10, 0]  },
        { size: 140, x: "42%", y: "80%", delay: 12, dur: 26, rx: [0, 10, 0],  ry: [0, -8, 0]  },
        { size: 100, x: "88%", y: "40%", delay: 6,  dur: 20, rx: [0, -12, 0], ry: [0, 14, 0]  },
        { size: 160, x: "30%", y: "20%", delay: 15, dur: 35, rx: [0, 8, 0],   ry: [0, -10, 0] },
        { size: 80,  x: "55%", y: "10%", delay: 9,  dur: 19, rx: [0, -6, 0],  ry: [0, 8, 0]   },
      ].map((block, i) => (
        <motion.div
          key={i}
          animate={{ x: block.rx, y: block.ry }}
          transition={{ duration: block.dur, delay: block.delay, repeat: Infinity, ease: "easeInOut" }}
          className="absolute"
          style={{
            left: block.x, top: block.y,
            width: block.size, height: block.size,
            borderRadius: "16px",
            border: dark ? "1px solid rgba(92,124,137,0.12)" : "1px solid rgba(31,73,89,0.1)",
            background: dark
              ? `repeating-linear-gradient(0deg,rgba(92,124,137,0.04) 0px,rgba(92,124,137,0.04) 1px,transparent 1px,transparent 12px),repeating-linear-gradient(90deg,rgba(92,124,137,0.04) 0px,rgba(92,124,137,0.04) 1px,transparent 1px,transparent 12px),rgba(31,73,89,0.06)`
              : `repeating-linear-gradient(0deg,rgba(31,73,89,0.04) 0px,rgba(31,73,89,0.04) 1px,transparent 1px,transparent 12px),repeating-linear-gradient(90deg,rgba(31,73,89,0.04) 0px,rgba(31,73,89,0.04) 1px,transparent 1px,transparent 12px),rgba(92,160,200,0.05)`,
            backdropFilter: "blur(1px)",
          }}
        />
      ))}

      {/* Small accent squares */}
      {[
        { size: 32, x: "22%", y: "35%", delay: 3,  dur: 16 },
        { size: 20, x: "70%", y: "22%", delay: 7,  dur: 14 },
        { size: 28, x: "48%", y: "70%", delay: 11, dur: 18 },
        { size: 16, x: "85%", y: "75%", delay: 1,  dur: 12 },
        { size: 24, x: "5%",  y: "48%", delay: 5,  dur: 20 },
        { size: 18, x: "60%", y: "88%", delay: 9,  dur: 15 },
      ].map((dot, i) => (
        <motion.div
          key={`dot-${i}`}
          animate={{
            x: [0, i % 2 === 0 ? 8 : -8, 0],
            y: [0, i % 2 === 0 ? -6 : 6, 0],
            opacity: [0.4, 0.8, 0.4],
            rotate: [0, 45, 0],
          }}
          transition={{ duration: dot.dur, delay: dot.delay, repeat: Infinity, ease: "easeInOut" }}
          className="absolute"
          style={{
            left: dot.x, top: dot.y,
            width: dot.size, height: dot.size,
            border: dark ? "1px solid rgba(92,180,200,0.18)" : "1px solid rgba(31,73,89,0.14)",
            borderRadius: "4px",
            background: dark ? "rgba(31,73,89,0.08)" : "rgba(92,160,200,0.06)",
          }}
        />
      ))}

      {/* Vignette */}
      <div className="absolute inset-0" style={{
        background: dark
          ? "radial-gradient(ellipse 85% 80% at 50% 50%,transparent 40%,rgba(4,10,18,0.55) 100%)"
          : "radial-gradient(ellipse 85% 80% at 50% 50%,transparent 40%,rgba(180,220,240,0.45) 100%)",
      }} />
    </div>
  )
}

// ── Sidebar Content ────────────────────────────────────────
function SidebarContent({ dark, user, onNav }: { dark: boolean; user: any; onNav?: () => void }) {
  const router   = useRouter()
  const pathname = usePathname()
  const bdr   = dark ? "rgba(92,124,137,0.18)" : "rgba(92,160,200,0.3)"
  const muted = dark ? "rgba(255,255,255,0.4)" : "rgba(11,46,58,0.48)"

  const go = (path: string) => {
    onNav?.()
    router.push(path)
  }

  return (
    <>
      <button
        onClick={() => go("/")}
        className="flex items-center gap-2.5 px-4 w-full flex-shrink-0 text-left"
        style={{ height: 64, borderBottom: `1px solid ${bdr}`, cursor: "pointer" }}
      >
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center relative overflow-hidden flex-shrink-0"
          style={{
            background: "linear-gradient(135deg,#0B2E3A,#1F4959,#5C7C89)",
            border: "1px solid rgba(92,124,137,0.4)",
            boxShadow: "0 4px 12px rgba(31,73,89,0.45)",
          }}
        >
          <div className="absolute inset-0" style={{ background: "linear-gradient(135deg,rgba(255,255,255,0.14),transparent)" }} />
          <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "1.05rem", fontWeight: 700, fontStyle: "italic", color: "#fff", position: "relative", zIndex: 1, lineHeight: 1 }}>K</span>
        </div>
        <span style={{
          fontFamily: "'Cormorant Garamond',serif",
          fontSize: "1.15rem", fontWeight: 700, fontStyle: "italic",
          color: dark ? "#ffffff" : "#0B2E3A",
          whiteSpace: "nowrap",
          textShadow: dark ? "0 0 20px rgba(167,208,227,0.35)" : "none",
        }}>
          KaryaLaya
        </span>
      </button>

      <div className="px-3 pt-3 pb-1 flex-shrink-0">
        <div
          className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl"
          style={{ backgroundColor: dark ? "rgba(31,73,89,0.25)" : "rgba(92,160,200,0.18)", border: `1px solid ${bdr}` }}
        >
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
            style={{ background: "linear-gradient(135deg,#1F4959,#5C7C89)" }}
          >
            {user?.name ? user.name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2) : "U"}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold truncate" style={{ color: dark ? "#fff" : "#0B2E3A" }}>{user?.name || "User"}</p>
            <p className="text-xs truncate" style={{ color: muted }}>{user?.email || "—"}</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto">
        {NAV.map(({ icon: Icon, label, path }) => {
          const active = pathname === path || (path !== "/dashboard" && pathname?.startsWith(path))
          return (
            <button
              key={label}
              onClick={() => go(path)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-left"
              style={{
                backgroundColor: active ? (dark ? "rgba(31,73,89,0.55)" : "rgba(31,73,89,0.11)") : "transparent",
                color: active ? (dark ? "#A7D0E3" : "#1F4959") : muted,
                border: active ? `1px solid ${dark ? "rgba(92,124,137,0.28)" : "rgba(31,73,89,0.18)"}` : "1px solid transparent",
                transition: "all 0.1s ease",
                cursor: "pointer",
              }}
            >
              <Icon size={16} style={{ flexShrink: 0 }} />
              <span className="flex-1">{label}</span>
              {active && <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: "#A7D0E3" }} />}
            </button>
          )
        })}
      </nav>

      <div className="px-3 pb-4 pt-2 flex-shrink-0" style={{ borderTop: `1px solid ${bdr}` }}>
        <button
          onClick={() => {
            localStorage.removeItem("karyalaya_user")
            localStorage.removeItem("synergysphere_user")
            router.push("/")
          }}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium"
          style={{ color: dark ? "rgba(255,100,100,0.65)" : "rgba(180,30,30,0.55)", cursor: "pointer", transition: "all 0.1s ease" }}
        >
          <LogOut size={15} /> Sign Out
        </button>
      </div>
    </>
  )
}

// ── Stat Card ──────────────────────────────────────────────
function StatCard({ label, value, icon: Icon, color, dark, delay }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }} whileHover={{ y: -2 }}
      className="relative rounded-2xl p-4 overflow-hidden"
      style={{
        backgroundColor: dark ? "rgba(10,22,34,0.75)" : "rgba(195,228,244,0.7)",
        border: `1px solid ${dark ? "rgba(92,124,137,0.18)" : "rgba(92,160,200,0.28)"}`,
        backdropFilter: "blur(16px)",
      }}
    >
      <div className="absolute top-0 inset-x-0 h-px" style={{ background: "linear-gradient(90deg,transparent,rgba(92,180,200,0.3),transparent)" }} />
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="font-semibold tracking-wide uppercase mb-1.5 truncate"
            style={{ color: dark ? "rgba(255,255,255,0.38)" : "rgba(11,46,58,0.48)", fontSize: "0.62rem" }}>
            {label}
          </p>
          <p className="text-2xl font-bold leading-none"
            style={{ color: dark ? "#fff" : "#0B2E3A", fontFamily: "'Cormorant Garamond',serif" }}>
            {value}
          </p>
        </div>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: `${color}18`, border: `1px solid ${color}30` }}>
          <Icon size={18} style={{ color }} />
        </div>
      </div>
    </motion.div>
  )
}

// ── Project Card ───────────────────────────────────────────
function ProjectCard({ project, dark, delay }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay }} whileHover={{ y: -2 }}
      className="relative rounded-2xl p-4 overflow-hidden group"
      style={{
        backgroundColor: dark ? "rgba(10,22,34,0.7)" : "rgba(195,228,244,0.65)",
        border: `1px solid ${dark ? "rgba(92,124,137,0.16)" : "rgba(92,160,200,0.25)"}`,
        backdropFilter: "blur(16px)",
        transition: "all 0.25s ease",
      }}
    >
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{ background: dark ? "linear-gradient(135deg,rgba(31,73,89,0.1),transparent)" : "linear-gradient(135deg,rgba(92,160,200,0.07),transparent)" }} />
      <div className="absolute top-0 inset-x-0 h-px"
        style={{ background: "linear-gradient(90deg,transparent,rgba(92,180,200,0.2),transparent)" }} />

      <div className="flex items-start justify-between mb-3 gap-2">
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-sm truncate mb-0.5" style={{ color: dark ? "#fff" : "#0B2E3A" }}>{project.name}</h4>
          <p className="text-xs line-clamp-1" style={{ color: dark ? "rgba(255,255,255,0.38)" : "rgba(11,46,58,0.45)" }}>{project.description}</p>
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <Badge className="text-xs px-2 py-0.5 rounded-lg border-0"
            style={{
              backgroundColor: project.status === "active" ? "rgba(31,73,89,0.5)" : "rgba(92,124,137,0.25)",
              color: project.status === "active" ? "#A7D0E3" : dark ? "rgba(255,255,255,0.4)" : "#5C7C89",
            }}>
            {project.status}
          </Badge>
          <button
            className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ color: dark ? "rgba(255,255,255,0.3)" : "rgba(11,46,58,0.3)", backgroundColor: dark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)", cursor: "pointer" }}>
            <MoreHorizontal size={14} />
          </button>
        </div>
      </div>

      <div className="mb-3">
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span style={{ color: dark ? "rgba(255,255,255,0.35)" : "rgba(11,46,58,0.42)" }}>Progress</span>
          <span className="font-semibold" style={{ color: dark ? "#A7D0E3" : "#1F4959" }}>{project.progress}%</span>
        </div>
        <div className="h-1.5 rounded-full overflow-hidden"
          style={{ backgroundColor: dark ? "rgba(92,124,137,0.18)" : "rgba(92,160,200,0.2)" }}>
          <motion.div
            initial={{ width: 0 }} animate={{ width: `${project.progress}%` }}
            transition={{ duration: 0.9, delay: delay + 0.2, ease: "easeOut" }}
            className="h-full rounded-full"
            style={{ background: "linear-gradient(90deg,#1F4959,#5C7C89,#A7D0E3)" }}
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs"
        style={{ color: dark ? "rgba(255,255,255,0.3)" : "rgba(11,46,58,0.4)" }}>
        <div className="flex items-center gap-1"><Users size={11} /><span>{project.members} members</span></div>
        <div className="flex items-center gap-1"><CheckCircle2 size={11} /><span>{project.tasks?.completed || 0}/{project.tasks?.total || 0}</span></div>
        <div className="flex items-center gap-1"><Calendar size={11} /><span>{project.dueDate || "—"}</span></div>
      </div>
    </motion.div>
  )
}

// ── Bottom Nav (mobile) ────────────────────────────────────
function BottomNav({ dark }: { dark: boolean }) {
  const router   = useRouter()
  const pathname = usePathname()
  const bg    = dark ? "rgba(6,14,22,0.97)" : "rgba(213,236,248,0.97)"
  const bdr   = dark ? "rgba(92,124,137,0.2)" : "rgba(92,160,200,0.3)"
  const muted = dark ? "rgba(255,255,255,0.35)" : "rgba(11,46,58,0.4)"

  return (
    <div className="flex items-center justify-around px-2 flex-shrink-0"
      style={{ height: 60, backgroundColor: bg, borderTop: `1px solid ${bdr}`, backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)" }}>
      {NAV.slice(0, 5).map(({ icon: Icon, label, path }) => {
        const active = pathname === path || (path !== "/dashboard" && pathname?.startsWith(path))
        return (
          <button
            key={label}
            onClick={() => router.push(path)}
            className="relative flex flex-col items-center justify-center gap-0.5 flex-1 py-2 rounded-xl"
            style={{
              color: active ? (dark ? "#A7D0E3" : "#1F4959") : muted,
              backgroundColor: active ? (dark ? "rgba(31,73,89,0.3)" : "rgba(31,73,89,0.08)") : "transparent",
              transition: "all 0.1s ease",
              border: "none",
              cursor: "pointer",
            }}
          >
            <Icon size={20} />
            <span style={{ fontSize: "0.6rem", fontWeight: active ? 600 : 400 }}>{label}</span>
            {active && <div className="absolute bottom-1 w-1 h-1 rounded-full" style={{ backgroundColor: "#A7D0E3" }} />}
          </button>
        )
      })}
    </div>
  )
}

// ── Widget Wrapper — overrides shadcn Card CSS variables ───
function WidgetWrapper({ dark, children }: { dark: boolean; children: React.ReactNode }) {
  return (
    <div
      className="rounded-2xl overflow-hidden widget-theme"
      style={{
        // Override shadcn CSS variables so Card bg becomes transparent
        "--card":            dark ? "8 35 60"      : "190 225 242",
        "--card-foreground": dark ? "255 255 255"  : "11 46 58",
        "--background":      dark ? "8 35 60"      : "190 225 242",
        "--foreground":      dark ? "255 255 255"  : "11 46 58",
        "--muted":           dark ? "15 50 80"     : "170 210 232",
        "--muted-foreground":dark ? "148 163 184"  : "71 106 122",
        "--border":          dark ? "31 73 89"     : "92 160 200",
        "--accent":          dark ? "20 55 80"     : "160 210 235",
        "--accent-foreground":dark ? "255 255 255" : "11 46 58",
        "--primary":         dark ? "92 160 200"   : "31 73 89",
        "--primary-foreground": dark ? "11 46 58"  : "255 255 255",
        "--destructive":     "239 68 68",
        "--destructive-foreground": "255 255 255",
        "--ring":            dark ? "92 124 137"   : "31 73 89",
        // Outer box styling
        background: dark
          ? "linear-gradient(145deg, rgba(8,35,60,0.95) 0%, rgba(12,45,72,0.92) 100%)"
          : "linear-gradient(145deg, rgba(185,222,240,0.92) 0%, rgba(170,212,235,0.90) 100%)",
        border: `1px solid ${dark ? "rgba(92,160,200,0.22)" : "rgba(31,73,89,0.2)"}`,
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        boxShadow: dark
          ? "0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(92,160,200,0.12)"
          : "0 8px 32px rgba(31,73,89,0.1), inset 0 1px 0 rgba(255,255,255,0.6)",
      } as React.CSSProperties}
    >
      {children}
    </div>
  )
}

// ── Main ───────────────────────────────────────────────────
export default function DashboardPage() {
  const [searchQuery,        setSearchQuery]        = useState("")
  const [user,               setUser]               = useState<any>({ name: "", email: "" })
  const [projects,           setProjects]           = useState<any[]>([])
  const [teamMembers,        setTeamMembers]        = useState<any[]>([])
  const [isNewProjectOpen,   setIsNewProjectOpen]   = useState(false)
  const [isInviteMemberOpen, setIsInviteMemberOpen] = useState(false)
  const [newProject,         setNewProject]         = useState({ name: "", description: "", dueDate: "" })
  const [inviteEmail,        setInviteEmail]        = useState("")
  const [dark,               setDark]               = useState(true)
  const [mobileNav,          setMobileNav]          = useState(false)
  const [searchOpen,         setSearchOpen]         = useState(false)
  const router = useRouter()

  useEffect(() => {
    const ud = localStorage.getItem("karyalaya_user") || localStorage.getItem("synergysphere_user")
    const pd = localStorage.getItem("synergy_projects")
    const md = localStorage.getItem("synergy_members")
    const th = localStorage.getItem("karyalaya_theme")
    if (ud) setUser(JSON.parse(ud))
    if (pd) setProjects(JSON.parse(pd))
    if (md) setTeamMembers(JSON.parse(md))
    if (th) setDark(th === "dark")
  }, [])

  const toggleDark = () => {
    const n = !dark; setDark(n)
    localStorage.setItem("karyalaya_theme", n ? "dark" : "light")
  }

  const stats = {
    activeProjects: projects.filter(p => p.status === "active").length,
    completedTasks: projects.reduce((a, p) => a + (p.tasks?.completed || 0), 0),
    dueThisWeek: projects.filter(p => {
      if (!p.dueDate) return false
      const d = new Date(p.dueDate), w = new Date()
      w.setDate(w.getDate() + 7)
      return d <= w && d >= new Date()
    }).length,
    teamMembers: teamMembers.length,
  }

  const handleCreateProject = () => {
    if (!newProject.name.trim()) return
    const p = {
      id: Date.now(), name: newProject.name, description: newProject.description,
      progress: 0, members: 1, tasks: { total: 0, completed: 0 },
      dueDate: newProject.dueDate, status: "active", createdAt: new Date().toISOString(),
    }
    const u = [...projects, p]
    setProjects(u); localStorage.setItem("synergy_projects", JSON.stringify(u))
    setNewProject({ name: "", description: "", dueDate: "" }); setIsNewProjectOpen(false)
  }

  const handleInviteMember = () => {
    if (!inviteEmail.trim()) return
    const m = { id: Date.now(), email: inviteEmail, name: inviteEmail.split("@")[0], role: "member", joinedAt: new Date().toISOString() }
    const u = [...teamMembers, m]
    setTeamMembers(u); localStorage.setItem("synergy_members", JSON.stringify(u))
    setInviteEmail(""); setIsInviteMemberOpen(false)
  }

  const pageBg  = dark ? "#060e16" : "#d5ecf8"
  const navBg   = dark ? "rgba(6,14,22,0.96)" : "rgba(213,236,248,0.96)"
  const sideBg  = dark ? "#07121d" : "#c5e2f0"
  const bdr     = dark ? "rgba(92,124,137,0.18)" : "rgba(92,160,200,0.3)"
  const txtPri  = dark ? "#ffffff" : "#0B2E3A"
  const txtMut  = dark ? "rgba(255,255,255,0.4)" : "rgba(11,46,58,0.48)"
  const glassBg = dark ? "rgba(10,22,34,0.7)" : "rgba(195,228,244,0.65)"
  const inSt    = {
    backgroundColor: dark ? "rgba(31,73,89,0.28)" : "rgba(92,160,200,0.15)",
    border: `1px solid ${dark ? "rgba(92,124,137,0.28)" : "rgba(92,160,200,0.32)"}`,
    color: txtPri, fontFamily: "'DM Sans',sans-serif",
    borderRadius: "0.75rem", height: "2.75rem",
  }
  const dlgSt = { backgroundColor: dark ? "#0a1a26" : "#d5ecf8", border: `1px solid ${bdr}`, color: txtPri }

  const filtered = projects.filter(p =>
    !searchQuery ||
    p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.description?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <>
      <BgEffects dark={dark} />

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileNav && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/65 lg:hidden"
              onClick={() => setMobileNav(false)}
            />
            <motion.div
              initial={{ x: -260 }} animate={{ x: 0 }} exit={{ x: -260 }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
              className="fixed top-0 left-0 bottom-0 z-50 flex flex-col lg:hidden"
              style={{ width: 260, backgroundColor: sideBg, borderRight: `1px solid ${bdr}` }}
            >
              <button
                onClick={() => setMobileNav(false)}
                className="absolute top-3 right-3 w-8 h-8 rounded-lg flex items-center justify-center z-10"
                style={{ backgroundColor: dark ? "rgba(31,73,89,0.4)" : "rgba(92,160,200,0.2)", color: txtMut, cursor: "pointer" }}
              >
                <X size={15} />
              </button>
              <SidebarContent dark={dark} user={user} onNav={() => setMobileNav(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Mobile search overlay */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed top-0 left-0 right-0 z-50 lg:hidden"
            style={{ backgroundColor: navBg, borderBottom: `1px solid ${bdr}`, backdropFilter: "blur(24px)", padding: "12px 16px" }}
          >
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 px-3 rounded-xl flex-1"
                style={{ backgroundColor: dark ? "rgba(31,73,89,0.25)" : "rgba(92,160,200,0.18)", border: `1px solid ${bdr}`, height: 42 }}>
                <Search size={15} style={{ color: txtMut }} />
                <input autoFocus type="text" placeholder="Search projects, tasks..."
                  className="bg-transparent border-none outline-none text-sm flex-1"
                  style={{ color: txtPri, fontFamily: "'DM Sans',sans-serif" }}
                  value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
                {searchQuery && (
                  <button onClick={() => setSearchQuery("")} style={{ color: txtMut, cursor: "pointer" }}>
                    <X size={14} />
                  </button>
                )}
              </div>
              <button onClick={() => setSearchOpen(false)}
                className="px-3 py-2 rounded-xl text-sm font-medium"
                style={{ color: txtMut, cursor: "pointer" }}>
                Cancel
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Root layout */}
      <div style={{
        display: "flex", height: "100dvh", overflow: "hidden",
        backgroundColor: pageBg, color: txtPri,
        fontFamily: "'DM Sans',sans-serif",
        transition: "background-color 0.4s ease",
        position: "relative", zIndex: 10,
      }}>

        {/* Desktop sidebar */}
        <div className="hidden lg:flex flex-col flex-shrink-0"
          style={{ width: 240, backgroundColor: sideBg, borderRight: `1px solid ${bdr}`, height: "100dvh", overflow: "hidden" }}>
          <SidebarContent dark={dark} user={user} />
        </div>

        {/* Main column */}
        <div className="flex flex-col flex-1 min-w-0" style={{ height: "100dvh", overflow: "hidden" }}>

          {/* Navbar */}
          <header className="flex-shrink-0 flex items-center gap-2 px-4"
            style={{ height: 60, backgroundColor: navBg, borderBottom: `1px solid ${bdr}`, backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)", zIndex: 20 }}>

            {/* Mobile: hamburger + logo */}
            <div className="flex items-center gap-2 lg:hidden flex-shrink-0">
              <button onClick={() => setMobileNav(true)}
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: dark ? "rgba(31,73,89,0.3)" : "rgba(92,160,200,0.2)", color: txtPri, border: `1px solid ${bdr}`, cursor: "pointer" }}>
                <Menu size={17} />
              </button>
              <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "1.1rem", fontWeight: 700, fontStyle: "italic", color: dark ? "#ffffff" : "#0B2E3A" }}>
                KaryaLaya
              </span>
            </div>

            {/* Desktop: history buttons */}
            <div className="hidden lg:flex items-center gap-2 flex-shrink-0">
              {[
                { icon: ArrowLeft,  fn: () => window.history.back() },
                { icon: ArrowRight, fn: () => window.history.forward() },
                { icon: RotateCcw,  fn: () => window.location.reload() },
              ].map(({ icon: Icon, fn }, i) => (
                <button key={i} onClick={fn}
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: dark ? "rgba(31,73,89,0.22)" : "rgba(92,160,200,0.14)", color: txtMut, border: `1px solid ${bdr}`, cursor: "pointer", transition: "all 0.1s ease" }}>
                  <Icon size={14} />
                </button>
              ))}
            </div>

            {/* Desktop search */}
            <div className="hidden lg:flex items-center gap-2 px-3 rounded-xl flex-1"
              style={{ backgroundColor: dark ? "rgba(31,73,89,0.18)" : "rgba(92,160,200,0.14)", border: `1px solid ${bdr}`, height: 38, maxWidth: 420 }}>
              <Search size={14} style={{ color: txtMut, flexShrink: 0 }} />
              <input type="text" placeholder="Search projects, tasks..."
                className="bg-transparent border-none outline-none text-sm flex-1 min-w-0"
                style={{ color: txtPri, fontFamily: "'DM Sans',sans-serif" }}
                value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
            </div>

            {/* Right group */}
            <div className="flex items-center gap-2 ml-auto flex-shrink-0">

              {/* Mobile search */}
              <button onClick={() => setSearchOpen(true)}
                className="lg:hidden w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: dark ? "rgba(31,73,89,0.22)" : "rgba(92,160,200,0.14)", color: txtMut, border: `1px solid ${bdr}`, cursor: "pointer" }}>
                <Search size={16} />
              </button>

              {/* Invite */}
              <Dialog open={isInviteMemberOpen} onOpenChange={setIsInviteMemberOpen}>
                <DialogTrigger asChild>
                  <button
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium"
                    style={{ backgroundColor: dark ? "rgba(31,73,89,0.35)" : "rgba(92,160,200,0.22)", border: `1px solid ${bdr}`, color: dark ? "#A7D0E3" : "#1F4959", cursor: "pointer", transition: "all 0.1s ease" }}>
                    <UserPlus size={14} />
                    <span className="hidden sm:inline">Invite</span>
                  </button>
                </DialogTrigger>
                <DialogContent style={dlgSt}>
                  <DialogHeader>
                    <DialogTitle style={{ color: txtPri, fontFamily: "'Cormorant Garamond',serif", fontSize: "1.4rem" }}>Invite Team Member</DialogTitle>
                    <DialogDescription style={{ color: txtMut }}>Send an invitation to collaborate.</DialogDescription>
                  </DialogHeader>
                  <div className="mt-3">
                    <Label style={{ color: txtMut, fontSize: "0.72rem", letterSpacing: "0.06em", textTransform: "uppercase" }}>Email Address</Label>
                    <Input type="email" placeholder="colleague@company.com" value={inviteEmail}
                      onChange={e => setInviteEmail(e.target.value)} className="mt-1.5" style={inSt} />
                  </div>
                  <DialogFooter className="mt-5 gap-2">
                    <button onClick={() => setIsInviteMemberOpen(false)}
                      className="px-4 py-2 rounded-xl text-sm font-medium"
                      style={{ border: `1px solid ${bdr}`, color: txtMut, cursor: "pointer" }}>
                      Cancel
                    </button>
                    <button onClick={handleInviteMember}
                      className="px-4 py-2 rounded-xl text-sm font-semibold text-white"
                      style={{ background: "linear-gradient(135deg,#1F4959,#2d7a96)", cursor: "pointer" }}>
                      Send
                    </button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <NotificationBell />

              {/* Theme toggle */}
              <button onClick={toggleDark}
                className="relative flex items-center px-1 rounded-full flex-shrink-0"
                style={{ width: 48, height: 26, backgroundColor: dark ? "#1F4959" : "#93c5da", border: `1px solid ${dark ? "rgba(92,124,137,0.5)" : "rgba(31,73,89,0.3)"}`, transition: "background-color 0.35s ease", cursor: "pointer" }}>
                <motion.div layout animate={{ x: dark ? 0 : 22 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  className="w-5 h-5 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: dark ? "#5C7C89" : "#1F4959" }}>
                  {dark ? <Moon size={10} color="#fff" /> : <Sun size={10} color="#fff" />}
                </motion.div>
              </button>

              {/* Settings */}
              <button onClick={() => router.push("/dashboard/settings")}
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: dark ? "rgba(31,73,89,0.22)" : "rgba(92,160,200,0.14)", border: `1px solid ${bdr}`, color: txtMut, cursor: "pointer", transition: "all 0.1s ease" }}>
                <Settings size={16} />
              </button>

              {/* Avatar */}
              <Avatar className="w-8 h-8 flex-shrink-0 cursor-pointer"
                style={{ boxShadow: `0 0 0 2px ${dark ? "rgba(92,124,137,0.4)" : "rgba(31,73,89,0.25)"}` }}>
                <AvatarImage src="/placeholder.svg?height=32&width=32" />
                <AvatarFallback style={{ background: "linear-gradient(135deg,#1F4959,#5C7C89)", color: "#fff", fontSize: "0.65rem", fontWeight: 700 }}>
                  {user?.name ? user.name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2) : "U"}
                </AvatarFallback>
              </Avatar>
            </div>
          </header>

          {/* Scrollable body */}
          <div className="flex-1 overflow-y-auto">
            <div style={{ padding: "20px 16px 24px", maxWidth: 1400, margin: "0 auto" }}
              className="lg:px-8 lg:py-7">

              {/* Welcome */}
              <div className="mb-5 lg:mb-7">
                <div className="flex items-center gap-2 mb-1">
                  <div className="h-px w-6" style={{ background: `linear-gradient(90deg,${dark ? "rgba(92,124,137,0.6)" : "rgba(92,160,200,0.7)"},transparent)` }} />
                  <span className="text-xs font-semibold tracking-[0.2em] uppercase" style={{ color: "#5CAFC4" }}>Dashboard</span>
                </div>
                <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(1.5rem,5vw,2.4rem)", fontWeight: 700, color: txtPri, letterSpacing: "-0.015em", lineHeight: 1.2 }}>
                  Welcome back,{" "}
                  <span style={{ color: "#5CAFC4", fontStyle: "italic" }}>{user?.name || "User"}</span>
                </h2>
                <p className="mt-1 text-sm" style={{ color: txtMut }}>Here's what's happening with your projects today.</p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5 lg:mb-7">
                {[
                  { label: "Active Projects", value: stats.activeProjects,  icon: FolderOpen,   color: "#5CAFC4" },
                  { label: "Tasks Completed", value: stats.completedTasks,  icon: CheckCircle2, color: "#50c878" },
                  { label: "Due This Week",   value: stats.dueThisWeek,     icon: Calendar,     color: "#ff8a65" },
                  { label: "Team Members",    value: stats.teamMembers,     icon: Users,        color: "#c084fc" },
                ].map((s, i) => <StatCard key={s.label} {...s} dark={dark} delay={0.08 + i * 0.06} />)}
              </div>

              {/* Projects header */}
              <div className="flex items-center justify-between mb-3 gap-2">
                <h3 style={{ color: txtPri, fontFamily: "'Cormorant Garamond',serif", fontSize: "1.15rem", fontWeight: 600 }}>
                  Your Projects
                </h3>
                <Dialog open={isNewProjectOpen} onOpenChange={setIsNewProjectOpen}>
                  <DialogTrigger asChild>
                    <button
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold text-white flex-shrink-0"
                      style={{ background: "linear-gradient(135deg,#1F4959,#2d7a96)", border: "1px solid rgba(92,124,137,0.3)", boxShadow: "0 4px 14px rgba(11,46,58,0.35)", cursor: "pointer", transition: "all 0.1s ease" }}>
                      <Plus size={14} />
                      <span className="hidden sm:inline">New Project</span>
                      <span className="sm:hidden">New</span>
                    </button>
                  </DialogTrigger>
                  <DialogContent style={dlgSt}>
                    <DialogHeader>
                      <DialogTitle style={{ color: txtPri, fontFamily: "'Cormorant Garamond',serif", fontSize: "1.4rem" }}>Create New Project</DialogTitle>
                      <DialogDescription style={{ color: txtMut }}>Start a new project to organize your team's work.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 mt-3">
                      <div>
                        <Label style={{ color: txtMut, fontSize: "0.72rem", letterSpacing: "0.06em", textTransform: "uppercase" }}>Project Name</Label>
                        <Input placeholder="Enter project name" value={newProject.name}
                          onChange={e => setNewProject({ ...newProject, name: e.target.value })}
                          className="mt-1.5" style={inSt} />
                      </div>
                      <div>
                        <Label style={{ color: txtMut, fontSize: "0.72rem", letterSpacing: "0.06em", textTransform: "uppercase" }}>Description</Label>
                        <Textarea placeholder="Describe your project" value={newProject.description}
                          onChange={e => setNewProject({ ...newProject, description: e.target.value })}
                          className="mt-1.5 rounded-xl" style={{ ...inSt, height: "auto", minHeight: 80 }} />
                      </div>
                      <div>
                        <Label style={{ color: txtMut, fontSize: "0.72rem", letterSpacing: "0.06em", textTransform: "uppercase" }}>Due Date</Label>
                        <Input type="date" value={newProject.dueDate}
                          onChange={e => setNewProject({ ...newProject, dueDate: e.target.value })}
                          className="mt-1.5" style={inSt} />
                      </div>
                    </div>
                    <DialogFooter className="mt-5 gap-2">
                      <button onClick={() => setIsNewProjectOpen(false)}
                        className="px-4 py-2 rounded-xl text-sm font-medium"
                        style={{ border: `1px solid ${bdr}`, color: txtMut, cursor: "pointer" }}>
                        Cancel
                      </button>
                      <button onClick={handleCreateProject}
                        className="px-4 py-2 rounded-xl text-sm font-semibold text-white"
                        style={{ background: "linear-gradient(135deg,#1F4959,#2d7a96)", cursor: "pointer" }}>
                        Create Project
                      </button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              {/* Main grid */}
              <div className="flex flex-col lg:grid lg:grid-cols-5 gap-5">

                {/* Projects list */}
                <div className="lg:col-span-3">
                  {filtered.length === 0 ? (
                    <div className="rounded-2xl p-8 text-center"
                      style={{ backgroundColor: glassBg, border: `2px dashed ${dark ? "rgba(92,124,137,0.22)" : "rgba(92,160,200,0.3)"}`, backdropFilter: "blur(16px)" }}>
                      <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3"
                        style={{ background: "linear-gradient(135deg,rgba(31,73,89,0.4),rgba(92,124,137,0.25))", border: "1px solid rgba(92,124,137,0.28)" }}>
                        <Plus size={22} style={{ color: "#5CAFC4" }} />
                      </div>
                      <h3 className="font-semibold text-sm mb-1" style={{ color: txtPri }}>No projects yet</h3>
                      <p className="text-xs mb-4" style={{ color: txtMut }}>
                        {searchQuery ? "No projects match your search." : "Create your first project to get started."}
                      </p>
                      {!searchQuery && (
                        <button onClick={() => setIsNewProjectOpen(true)}
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white"
                          style={{ background: "linear-gradient(135deg,#1F4959,#2d7a96)", cursor: "pointer" }}>
                          <Plus size={13} /> Create First Project
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {filtered.map((p, i) => (
                        <ProjectCard key={p.id} project={p} dark={dark} delay={0.1 + i * 0.06} />
                      ))}
                    </div>
                  )}
                </div>

                {/* ── Widgets with WidgetWrapper ── */}
                <div className="lg:col-span-2 flex flex-col gap-4">
                  {[
                    { title: "Recent Activity",   comp: <CommunicationHub /> },
                    { title: "Progress Overview", comp: <ProgressTracker /> },
                  ].map(({ title, comp }) => (
                    <div key={title}>
                      <h3 className="font-semibold mb-2"
                        style={{ color: txtPri, fontFamily: "'Cormorant Garamond',serif", fontSize: "1.05rem" }}>
                        {title}
                      </h3>
                      {/* WidgetWrapper overrides --card CSS var so shadcn Cards inside become blueish */}
                      <WidgetWrapper dark={dark}>
                        {comp}
                      </WidgetWrapper>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="hidden lg:block px-8 py-5" style={{ borderTop: `1px solid ${bdr}` }}>
              <div className="flex items-center justify-center gap-3">
                <p className="text-xs tracking-[0.15em] uppercase"
                  style={{ color: dark ? "rgba(255,255,255,0.22)" : "rgba(11,46,58,0.28)" }}>
                  © 2025 KaryaLaya
                </p>
                <div className="w-px h-3"
                  style={{ backgroundColor: dark ? "rgba(92,124,137,0.4)" : "rgba(31,73,89,0.25)" }} />
                <p style={{
                  color: dark ? "rgba(167,208,227,0.38)" : "rgba(31,73,89,0.35)",
                  fontStyle: "italic",
                  fontFamily: "'Cormorant Garamond',serif",
                  fontSize: "0.85rem",
                  letterSpacing: "0.04em",
                }}>
                  Designed by Satyam Kumar
                </p>
              </div>
            </div>
          </div>

          {/* Mobile bottom nav */}
          <div className="lg:hidden flex-shrink-0">
            <BottomNav dark={dark} />
          </div>
        </div>
      </div>
    </>
  )
}