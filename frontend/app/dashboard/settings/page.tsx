// frontend/app/dashboard/settings/page.tsx
"use client"

import { useState, useEffect, useRef } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import {
  ArrowLeft, User, Bell, Shield, Camera, Save,
  Key, Smartphone, Download, Trash2, Eye, EyeOff,
  CheckCircle2, AlertCircle, Sun, Moon, Palette,
  Globe, Clock, LogOut, ChevronRight,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"

// ── Toast ──────────────────────────────────────────────────
function Toast({ message, type, onClose }: { message: string; type: "success" | "error"; onClose: () => void }) {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t) }, [onClose])
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.92 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="fixed bottom-6 left-1/2 z-50 flex items-center gap-3 px-5 py-3 rounded-2xl text-sm font-medium"
      style={{
        transform: "translateX(-50%)",
        backgroundColor: type === "success" ? "rgba(20,60,35,0.95)" : "rgba(60,20,20,0.95)",
        border: `1px solid ${type === "success" ? "rgba(80,200,120,0.4)" : "rgba(239,68,68,0.4)"}`,
        backdropFilter: "blur(16px)",
        color: type === "success" ? "#50c878" : "#ff8a65",
        boxShadow: "0 12px 40px rgba(0,0,0,0.4)",
        whiteSpace: "nowrap",
      }}
    >
      {type === "success" ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
      {message}
    </motion.div>
  )
}

// ── Section Card ───────────────────────────────────────────
function SectionCard({ children, dark, delay = 0 }: { children: React.ReactNode; dark: boolean; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] }}
      className="relative rounded-2xl overflow-hidden"
      style={{
        backgroundColor: dark ? "rgba(10,22,34,0.78)" : "rgba(195,228,244,0.72)",
        border: `1px solid ${dark ? "rgba(92,124,137,0.18)" : "rgba(92,160,200,0.3)"}`,
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        boxShadow: dark ? "0 4px 24px rgba(0,0,0,0.2)" : "0 4px 24px rgba(31,73,89,0.06)",
      }}
    >
      <div className="absolute top-0 inset-x-0 h-px"
        style={{ background: "linear-gradient(90deg,transparent,rgba(92,180,200,0.25),transparent)" }} />
      {children}
    </motion.div>
  )
}

// ── Section Header ─────────────────────────────────────────
function SectionHeader({ icon: Icon, title, desc, color = "#5CAFC4", txtPri, txtMut }: any) {
  return (
    <div className="flex items-start gap-3 px-6 py-5 pb-0">
      <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
        style={{ backgroundColor: `${color}18`, border: `1px solid ${color}28` }}>
        <Icon size={16} style={{ color }} />
      </div>
      <div>
        <h2 className="font-semibold text-sm" style={{ color: txtPri, fontFamily: "'Cormorant Garamond',serif", fontSize: "1.05rem", fontWeight: 700 }}>{title}</h2>
        <p className="text-xs mt-0.5" style={{ color: txtMut }}>{desc}</p>
      </div>
    </div>
  )
}

// ── Main ───────────────────────────────────────────────────
export default function SettingsPage() {
  const router = useRouter()
  const fileRef = useRef<HTMLInputElement>(null)

  const [dark, setDark]             = useState(true)
  const [activeTab, setActiveTab]   = useState("profile")
  const [toast, setToast]           = useState<{ msg: string; type: "success" | "error" } | null>(null)
  const [showOldPw, setShowOldPw]   = useState(false)
  const [showNewPw, setShowNewPw]   = useState(false)
  const [showConfPw, setShowConfPw] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState("")
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [show2FAModal, setShow2FAModal]       = useState(false)

  const [user, setUser] = useState({
    name: "", email: "", bio: "", role: "",
    location: "", website: "", avatar: "",
  })
  const [notifications, setNotifications] = useState({
    email: true, push: true, mentions: true,
    projects: true, weeklyDigest: false, taskReminders: true,
  })
  const [privacy, setPrivacy] = useState({
    profileVisible: true, activityVisible: false, showOnlineStatus: true,
  })
  const [passwords, setPasswords] = useState({ old: "", new: "", confirm: "" })
  const [appearance, setAppearance] = useState({
    theme: dark ? "dark" : "light",
    language: "en", timezone: "UTC+5:30",
  })

  // Sync dark mode from localStorage
  useEffect(() => {
    const th = localStorage.getItem("karyalaya_theme")
    if (th) { setDark(th === "dark"); setAppearance(a => ({ ...a, theme: th })) }
    const handler = (e: StorageEvent) => {
      if (e.key === "karyalaya_theme") { setDark(e.newValue === "dark"); setAppearance(a => ({ ...a, theme: e.newValue || "dark" })) }
    }
    window.addEventListener("storage", handler)
    return () => window.removeEventListener("storage", handler)
  }, [])

  // Load saved user
  useEffect(() => {
    const ud = localStorage.getItem("karyalaya_user") || localStorage.getItem("synergysphere_user")
    if (ud) { const u = JSON.parse(ud); setUser(prev => ({ ...prev, ...u })) }
    const nd = localStorage.getItem("karyalaya_notifications")
    if (nd) setNotifications(JSON.parse(nd))
    const pd = localStorage.getItem("karyalaya_privacy")
    if (pd) setPrivacy(JSON.parse(pd))
  }, [])

  const showToast = (msg: string, type: "success" | "error" = "success") => setToast({ msg, type })

  // Photo upload
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) { showToast("File too large. Max 5MB.", "error"); return }
    const reader = new FileReader()
    reader.onload = ev => {
      const avatar = ev.target?.result as string
      setUser(u => ({ ...u, avatar }))
      showToast("Photo updated successfully!")
    }
    reader.readAsDataURL(file)
  }

  const handleSaveProfile = () => {
    if (!user.name.trim()) { showToast("Name cannot be empty.", "error"); return }
    if (!user.email.trim()) { showToast("Email cannot be empty.", "error"); return }
    localStorage.setItem("karyalaya_user", JSON.stringify(user))
    showToast("Profile saved successfully!")
  }

  const handleSaveNotifications = () => {
    localStorage.setItem("karyalaya_notifications", JSON.stringify(notifications))
    showToast("Notification preferences saved!")
  }

  const handleSavePrivacy = () => {
    localStorage.setItem("karyalaya_privacy", JSON.stringify(privacy))
    showToast("Privacy settings saved!")
  }

  const handleChangePassword = () => {
    if (!passwords.old) { showToast("Enter your current password.", "error"); return }
    if (passwords.new.length < 8) { showToast("New password must be at least 8 characters.", "error"); return }
    if (passwords.new !== passwords.confirm) { showToast("Passwords do not match.", "error"); return }
    setPasswords({ old: "", new: "", confirm: "" })
    showToast("Password changed successfully!")
  }

  const handleThemeToggle = () => {
    const next = dark ? "light" : "dark"
    setDark(!dark)
    setAppearance(a => ({ ...a, theme: next }))
    localStorage.setItem("karyalaya_theme", next)
  }

  const handleDownload = () => {
    const data = {
      profile: user,
      notifications,
      privacy,
      exportedAt: new Date().toISOString(),
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url; a.download = "karyalaya_data.json"; a.click()
    URL.revokeObjectURL(url)
    showToast("Data downloaded!")
  }

  const handleDeleteAccount = () => {
    if (deleteConfirm !== "DELETE") { showToast("Type DELETE to confirm.", "error"); return }
    localStorage.clear()
    router.push("/")
  }

  const handleSignOut = () => {
    localStorage.removeItem("karyalaya_user")
    localStorage.removeItem("synergysphere_user")
    router.push("/")
  }

  // Theme tokens
  const pageBg  = dark ? "#060e16"               : "#d5ecf8"
  const navBg   = dark ? "rgba(6,14,22,0.96)"    : "rgba(213,236,248,0.96)"
  const bdr     = dark ? "rgba(92,124,137,0.18)" : "rgba(92,160,200,0.3)"
  const txtPri  = dark ? "#ffffff"               : "#0B2E3A"
  const txtMut  = dark ? "rgba(255,255,255,0.4)" : "rgba(11,46,58,0.5)"
  const inSt    = {
    backgroundColor: dark ? "rgba(31,73,89,0.28)" : "rgba(92,160,200,0.15)",
    border: `1px solid ${dark ? "rgba(92,124,137,0.28)" : "rgba(92,160,200,0.32)"}`,
    color: txtPri, fontFamily: "'DM Sans',sans-serif",
    borderRadius: "0.75rem", outline: "none",
    transition: "border-color 0.2s, box-shadow 0.2s",
  }

  const tabs = [
    { key: "profile",      label: "Profile",      icon: User },
    { key: "notifications",label: "Notifications",icon: Bell },
    { key: "appearance",   label: "Appearance",   icon: Palette },
    { key: "privacy",      label: "Privacy",      icon: Shield },
    { key: "security",     label: "Security",     icon: Key },
  ]

  // Reusable input
  const Field = ({ label, id, value, onChange, type = "text", placeholder = "" }: any) => (
    <div>
      <label htmlFor={id} className="block text-xs font-semibold tracking-widest uppercase mb-1.5"
        style={{ color: txtMut }}>{label}</label>
      <input id={id} type={type} value={value} onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 text-sm"
        style={{ ...inSt, height: "2.75rem", display: "block" }}
        onFocus={e => { e.target.style.borderColor = "rgba(92,180,200,0.6)"; e.target.style.boxShadow = "0 0 0 3px rgba(92,180,200,0.1)" }}
        onBlur={e => { e.target.style.borderColor = dark ? "rgba(92,124,137,0.28)" : "rgba(92,160,200,0.32)"; e.target.style.boxShadow = "none" }}
      />
    </div>
  )

  // Reusable save button
  const SaveBtn = ({ onClick, label = "Save Changes" }: any) => (
    <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
      style={{ background: "linear-gradient(135deg,#1F4959,#2d7a96)", border: "1px solid rgba(92,124,137,0.3)", cursor: "pointer", boxShadow: "0 4px 14px rgba(11,46,58,0.35)" }}>
      <Save size={14} />{label}
    </motion.button>
  )

  // Toggle row
  const ToggleRow = ({ label, desc, checked, onChange }: any) => (
    <div className="flex items-center justify-between py-3" style={{ borderBottom: `1px solid ${bdr}` }}>
      <div className="flex-1 pr-4">
        <p className="text-sm font-medium" style={{ color: txtPri }}>{label}</p>
        <p className="text-xs mt-0.5" style={{ color: txtMut }}>{desc}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onChange}
        className="flex-shrink-0"
        style={{ cursor: "pointer" }} />
    </div>
  )

  // Danger button
  const DangerBtn = ({ onClick, icon: Icon, label, subtle = false }: any) => (
    <motion.button whileHover={{ scale: 1.02, backgroundColor: subtle ? "rgba(239,68,68,0.12)" : "rgba(180,0,0,0.85)" }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium w-full"
      style={{
        backgroundColor: subtle ? "rgba(239,68,68,0.08)" : "rgba(239,68,68,0.15)",
        border: "1px solid rgba(239,68,68,0.25)",
        color: subtle ? "rgba(239,68,68,0.7)" : "#ef4444",
        cursor: "pointer", transition: "all 0.15s ease",
      }}>
      <Icon size={15} />{label}
      <ChevronRight size={13} className="ml-auto" style={{ color: "rgba(239,68,68,0.4)" }} />
    </motion.button>
  )

  // Outline button
  const OutlineBtn = ({ onClick, icon: Icon, label }: any) => (
    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium w-full"
      style={{
        backgroundColor: dark ? "rgba(31,73,89,0.25)" : "rgba(92,160,200,0.15)",
        border: `1px solid ${bdr}`,
        color: dark ? "#A7D0E3" : "#1F4959",
        cursor: "pointer", transition: "all 0.15s ease",
      }}>
      <Icon size={15} />{label}
      <ChevronRight size={13} className="ml-auto" style={{ color: txtMut }} />
    </motion.button>
  )

  const userInitials = user.name
    ? user.name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)
    : "U"

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
        <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "1.3rem", fontWeight: 700, fontStyle: "italic", color: txtPri }}>
          Settings
        </h1>
        {/* Theme toggle in navbar */}
        <div className="ml-auto">
          <motion.button whileTap={{ scale: 0.9 }} onClick={handleThemeToggle}
            className="relative flex items-center px-1 rounded-full"
            style={{ width: 48, height: 26, backgroundColor: dark ? "#1F4959" : "#93c5da", border: `1px solid ${dark ? "rgba(92,124,137,0.5)" : "rgba(31,73,89,0.3)"}`, transition: "background-color 0.35s ease", cursor: "pointer" }}>
            <motion.div layout animate={{ x: dark ? 0 : 22 }} transition={{ type: "spring", stiffness: 500, damping: 30 }}
              className="w-5 h-5 rounded-full flex items-center justify-center"
              style={{ backgroundColor: dark ? "#5C7C89" : "#1F4959" }}>
              {dark ? <Moon size={10} color="#fff" /> : <Sun size={10} color="#fff" />}
            </motion.div>
          </motion.button>
        </div>
      </header>

      {/* ── Layout ── */}
      <div className="flex-1 overflow-y-auto">
        <div style={{ maxWidth: 960, margin: "0 auto", padding: "28px 16px 48px" }} className="lg:px-8">
          <div className="flex flex-col lg:flex-row gap-6">

            {/* ── Sidebar Tabs ── */}
            <div className="lg:w-52 flex-shrink-0">
              <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
                className="rounded-2xl overflow-hidden"
                style={{ backgroundColor: dark ? "rgba(10,22,34,0.78)" : "rgba(195,228,244,0.72)", border: `1px solid ${bdr}`, backdropFilter: "blur(16px)" }}>

                {/* User mini-card */}
                <div className="flex items-center gap-3 px-4 py-4" style={{ borderBottom: `1px solid ${bdr}` }}>
                  <div className="relative flex-shrink-0">
                    <div className="w-10 h-10 rounded-full overflow-hidden"
                      style={{ border: `2px solid ${dark ? "rgba(92,124,137,0.4)" : "rgba(31,73,89,0.25)"}` }}>
                      {user.avatar ? (
                        <img src={user.avatar} alt="avatar" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs font-bold text-white"
                          style={{ background: "linear-gradient(135deg,#1F4959,#5C7C89)" }}>
                          {userInitials}
                        </div>
                      )}
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2"
                      style={{ backgroundColor: "#50c878", borderColor: dark ? "#07121d" : "#c5e2f0" }} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold truncate" style={{ color: txtPri }}>{user.name || "Your Name"}</p>
                    <p className="text-xs truncate" style={{ color: txtMut }}>{user.role || "Team Member"}</p>
                  </div>
                </div>

                {/* Tab buttons */}
                <nav className="p-2 space-y-0.5">
                  {tabs.map(({ key, label, icon: Icon }) => (
                    <motion.button key={key} whileTap={{ scale: 0.97 }}
                      onClick={() => setActiveTab(key)}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-left"
                      style={{
                        backgroundColor: activeTab === key ? (dark ? "rgba(31,73,89,0.55)" : "rgba(31,73,89,0.11)") : "transparent",
                        color: activeTab === key ? (dark ? "#A7D0E3" : "#1F4959") : txtMut,
                        border: activeTab === key ? `1px solid ${dark ? "rgba(92,124,137,0.28)" : "rgba(31,73,89,0.18)"}` : "1px solid transparent",
                        cursor: "pointer", transition: "all 0.1s ease",
                      }}>
                      <Icon size={15} style={{ flexShrink: 0 }} />
                      <span className="flex-1">{label}</span>
                      {activeTab === key && <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "#A7D0E3" }} />}
                    </motion.button>
                  ))}
                </nav>

                {/* Sign out */}
                <div className="px-2 pb-2 pt-1" style={{ borderTop: `1px solid ${bdr}` }}>
                  <motion.button whileTap={{ scale: 0.97 }} onClick={handleSignOut}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium"
                    style={{ color: dark ? "rgba(255,100,100,0.65)" : "rgba(180,30,30,0.55)", cursor: "pointer", transition: "all 0.1s ease" }}>
                    <LogOut size={15} /> Sign Out
                  </motion.button>
                </div>
              </motion.div>
            </div>

            {/* ── Content ── */}
            <div className="flex-1 min-w-0">
              <AnimatePresence mode="wait">

                {/* ── PROFILE ── */}
                {activeTab === "profile" && (
                  <motion.div key="profile" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.3 }}
                    className="space-y-5">
                    <SectionCard dark={dark} delay={0}>
                      <SectionHeader icon={User} title="Profile Settings" desc="Manage your personal information and public profile." txtPri={txtPri} txtMut={txtMut} />
                      <div className="px-6 py-5 space-y-5">

                        {/* Avatar upload */}
                        <div className="flex items-center gap-5">
                          <div className="relative flex-shrink-0">
                            <div className="w-20 h-20 rounded-2xl overflow-hidden"
                              style={{ border: `2px solid ${dark ? "rgba(92,124,137,0.4)" : "rgba(31,73,89,0.25)"}`, boxShadow: "0 4px 16px rgba(0,0,0,0.2)" }}>
                              {user.avatar ? (
                                <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-lg font-bold text-white"
                                  style={{ background: "linear-gradient(135deg,#1F4959,#5C7C89)" }}>
                                  {userInitials}
                                </div>
                              )}
                            </div>
                            {/* Camera overlay */}
                            <motion.button
                              whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                              onClick={() => fileRef.current?.click()}
                              className="absolute -bottom-1.5 -right-1.5 w-7 h-7 rounded-full flex items-center justify-center"
                              style={{ background: "linear-gradient(135deg,#1F4959,#2d7a96)", border: "2px solid #060e16", cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,0.3)" }}>
                              <Camera size={12} color="#fff" />
                            </motion.button>
                            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
                          </div>
                          <div>
                            <p className="text-sm font-semibold mb-1" style={{ color: txtPri }}>Profile Photo</p>
                            <p className="text-xs mb-3" style={{ color: txtMut }}>JPG, PNG or GIF · Max 5MB</p>
                            <div className="flex gap-2">
                              <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                                onClick={() => fileRef.current?.click()}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium"
                                style={{ background: "linear-gradient(135deg,#1F4959,#2d7a96)", color: "#fff", cursor: "pointer" }}>
                                <Camera size={12} /> Upload Photo
                              </motion.button>
                              {user.avatar && (
                                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                                  onClick={() => setUser(u => ({ ...u, avatar: "" }))}
                                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium"
                                  style={{ border: `1px solid ${bdr}`, color: txtMut, cursor: "pointer" }}>
                                  Remove
                                </motion.button>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Form fields */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <Field label="Full Name" id="name" value={user.name} onChange={(v: string) => setUser(u => ({ ...u, name: v }))} placeholder="Enter your full name" />
                          <Field label="Email Address" id="email" value={user.email} type="email" onChange={(v: string) => setUser(u => ({ ...u, email: v }))} placeholder="Enter your email" />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <Field label="Role / Title" id="role" value={user.role || ""} onChange={(v: string) => setUser(u => ({ ...u, role: v }))} placeholder="e.g. Frontend Developer" />
                          <Field label="Location" id="location" value={user.location || ""} onChange={(v: string) => setUser(u => ({ ...u, location: v }))} placeholder="e.g. Mumbai, India" />
                        </div>
                        <Field label="Website" id="website" value={user.website || ""} onChange={(v: string) => setUser(u => ({ ...u, website: v }))} placeholder="https://yourwebsite.com" />
                        <div>
                          <label className="block text-xs font-semibold tracking-widest uppercase mb-1.5" style={{ color: txtMut }}>Bio</label>
                          <textarea id="bio" value={user.bio} rows={3}
                            onChange={e => setUser(u => ({ ...u, bio: e.target.value }))}
                            placeholder="Tell us about yourself..."
                            className="w-full px-3 py-2 text-sm resize-none"
                            style={{ ...inSt, height: "auto" }}
                            onFocus={e => { e.target.style.borderColor = "rgba(92,180,200,0.6)"; e.target.style.boxShadow = "0 0 0 3px rgba(92,180,200,0.1)" }}
                            onBlur={e => { e.target.style.borderColor = dark ? "rgba(92,124,137,0.28)" : "rgba(92,160,200,0.32)"; e.target.style.boxShadow = "none" }}
                          />
                        </div>
                        <SaveBtn onClick={handleSaveProfile} label="Save Profile" />
                      </div>
                    </SectionCard>
                  </motion.div>
                )}

                {/* ── NOTIFICATIONS ── */}
                {activeTab === "notifications" && (
                  <motion.div key="notifications" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.3 }}
                    className="space-y-5">
                    <SectionCard dark={dark}>
                      <SectionHeader icon={Bell} title="Notification Preferences" desc="Choose how and when you want to be notified." color="#c084fc" txtPri={txtPri} txtMut={txtMut} />
                      <div className="px-6 py-5 space-y-0">
                        {[
                          { key: "email",          label: "Email Notifications",    desc: "Receive important updates via email" },
                          { key: "push",           label: "Push Notifications",     desc: "Browser push notifications in real-time" },
                          { key: "mentions",       label: "Mentions & Comments",    desc: "Get notified when someone mentions you" },
                          { key: "projects",       label: "Project Updates",        desc: "Notifications about project status changes" },
                          { key: "taskReminders",  label: "Task Reminders",         desc: "Reminders for upcoming due dates" },
                          { key: "weeklyDigest",   label: "Weekly Digest",          desc: "A weekly summary of your team's activity" },
                        ].map(({ key, label, desc }) => (
                          <ToggleRow key={key} label={label} desc={desc}
                            checked={(notifications as any)[key]}
                            onChange={(v: boolean) => setNotifications(n => ({ ...n, [key]: v }))} />
                        ))}
                        <div className="pt-4">
                          <SaveBtn onClick={handleSaveNotifications} label="Save Preferences" />
                        </div>
                      </div>
                    </SectionCard>
                  </motion.div>
                )}

                {/* ── APPEARANCE ── */}
                {activeTab === "appearance" && (
                  <motion.div key="appearance" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.3 }}
                    className="space-y-5">
                    <SectionCard dark={dark}>
                      <SectionHeader icon={Palette} title="Appearance" desc="Customise how KaryaLaya looks for you." color="#ffd700" txtPri={txtPri} txtMut={txtMut} />
                      <div className="px-6 py-5 space-y-6">

                        {/* Theme */}
                        <div>
                          <label className="block text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: txtMut }}>Theme</label>
                          <div className="grid grid-cols-2 gap-3">
                            {[
                              { key: "dark",  label: "Dark",  icon: Moon,  preview: "#060e16" },
                              { key: "light", label: "Light", icon: Sun,   preview: "#d5ecf8" },
                            ].map(({ key, label, icon: Icon, preview }) => (
                              <motion.button key={key} whileTap={{ scale: 0.97 }}
                                onClick={() => { setAppearance(a => ({ ...a, theme: key })); setDark(key === "dark"); localStorage.setItem("karyalaya_theme", key) }}
                                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium"
                                style={{
                                  backgroundColor: appearance.theme === key ? (dark ? "rgba(31,73,89,0.55)" : "rgba(31,73,89,0.12)") : (dark ? "rgba(31,73,89,0.18)" : "rgba(92,160,200,0.12)"),
                                  border: `1px solid ${appearance.theme === key ? "rgba(92,160,200,0.4)" : bdr}`,
                                  color: appearance.theme === key ? (dark ? "#A7D0E3" : "#1F4959") : txtMut,
                                  cursor: "pointer", transition: "all 0.15s ease",
                                }}>
                                <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                                  style={{ backgroundColor: preview, border: "1px solid rgba(255,255,255,0.1)" }}>
                                  <Icon size={13} color={key === "dark" ? "#A7D0E3" : "#1F4959"} />
                                </div>
                                {label}
                                {appearance.theme === key && <CheckCircle2 size={14} className="ml-auto" style={{ color: "#A7D0E3" }} />}
                              </motion.button>
                            ))}
                          </div>
                        </div>

                        {/* Language */}
                        <div>
                          <label className="block text-xs font-semibold tracking-widest uppercase mb-1.5" style={{ color: txtMut }}>Language</label>
                          <select value={appearance.language}
                            onChange={e => setAppearance(a => ({ ...a, language: e.target.value }))}
                            className="w-full px-3 text-sm"
                            style={{ ...inSt, height: "2.75rem", display: "block", cursor: "pointer" }}>
                            <option value="en">English</option>
                            <option value="hi">Hindi</option>
                            <option value="es">Spanish</option>
                            <option value="fr">French</option>
                            <option value="de">German</option>
                          </select>
                        </div>

                        {/* Timezone */}
                        <div>
                          <label className="block text-xs font-semibold tracking-widest uppercase mb-1.5" style={{ color: txtMut }}>Timezone</label>
                          <select value={appearance.timezone}
                            onChange={e => setAppearance(a => ({ ...a, timezone: e.target.value }))}
                            className="w-full px-3 text-sm"
                            style={{ ...inSt, height: "2.75rem", display: "block", cursor: "pointer" }}>
                            {["UTC-8:00","UTC-5:00","UTC+0:00","UTC+1:00","UTC+5:30","UTC+8:00","UTC+9:00"].map(tz => (
                              <option key={tz} value={tz}>{tz}</option>
                            ))}
                          </select>
                        </div>

                        <SaveBtn onClick={() => showToast("Appearance settings saved!")} label="Save Appearance" />
                      </div>
                    </SectionCard>
                  </motion.div>
                )}

                {/* ── PRIVACY ── */}
                {activeTab === "privacy" && (
                  <motion.div key="privacy" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.3 }}
                    className="space-y-5">
                    <SectionCard dark={dark}>
                      <SectionHeader icon={Globe} title="Privacy Settings" desc="Control who can see your profile and activity." color="#50c878" txtPri={txtPri} txtMut={txtMut} />
                      <div className="px-6 py-5 space-y-0">
                        {[
                          { key: "profileVisible",  label: "Public Profile",       desc: "Allow other team members to view your profile" },
                          { key: "activityVisible", label: "Activity Visibility",  desc: "Show your recent activity to teammates" },
                          { key: "showOnlineStatus",label: "Show Online Status",   desc: "Let others see when you're active" },
                        ].map(({ key, label, desc }) => (
                          <ToggleRow key={key} label={label} desc={desc}
                            checked={(privacy as any)[key]}
                            onChange={(v: boolean) => setPrivacy(p => ({ ...p, [key]: v }))} />
                        ))}
                        <div className="pt-4">
                          <SaveBtn onClick={handleSavePrivacy} label="Save Privacy Settings" />
                        </div>
                      </div>
                    </SectionCard>
                  </motion.div>
                )}

                {/* ── SECURITY ── */}
                {activeTab === "security" && (
                  <motion.div key="security" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.3 }}
                    className="space-y-5">

                    {/* Change password */}
                    <SectionCard dark={dark}>
                      <SectionHeader icon={Key} title="Change Password" desc="Update your account password regularly to stay secure." color="#ff8a65" txtPri={txtPri} txtMut={txtMut} />
                      <div className="px-6 py-5 space-y-4">
                        {[
                          { label: "Current Password", key: "old",     show: showOldPw, toggle: () => setShowOldPw(v => !v) },
                          { label: "New Password",     key: "new",     show: showNewPw, toggle: () => setShowNewPw(v => !v) },
                          { label: "Confirm Password", key: "confirm", show: showConfPw,toggle: () => setShowConfPw(v => !v) },
                        ].map(({ label, key, show, toggle }) => (
                          <div key={key}>
                            <label className="block text-xs font-semibold tracking-widest uppercase mb-1.5" style={{ color: txtMut }}>{label}</label>
                            <div className="relative">
                              <input
                                type={show ? "text" : "password"}
                                value={(passwords as any)[key]}
                                onChange={e => setPasswords(p => ({ ...p, [key]: e.target.value }))}
                                placeholder={key === "old" ? "Enter current password" : key === "new" ? "Min 8 characters" : "Repeat new password"}
                                className="w-full px-3 pr-10 text-sm"
                                style={{ ...inSt, height: "2.75rem", display: "block" }}
                                onFocus={e => { e.target.style.borderColor = "rgba(92,180,200,0.6)"; e.target.style.boxShadow = "0 0 0 3px rgba(92,180,200,0.1)" }}
                                onBlur={e => { e.target.style.borderColor = dark ? "rgba(92,124,137,0.28)" : "rgba(92,160,200,0.32)"; e.target.style.boxShadow = "none" }}
                              />
                              <button type="button" onClick={toggle}
                                className="absolute right-3 top-1/2 -translate-y-1/2"
                                style={{ color: txtMut, cursor: "pointer" }}>
                                {show ? <EyeOff size={15} /> : <Eye size={15} />}
                              </button>
                            </div>
                          </div>
                        ))}

                        {/* Password strength */}
                        {passwords.new && (
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs" style={{ color: txtMut }}>Strength</span>
                              <span className="text-xs font-medium" style={{ color: passwords.new.length >= 12 ? "#50c878" : passwords.new.length >= 8 ? "#ffd700" : "#ff8a65" }}>
                                {passwords.new.length >= 12 ? "Strong" : passwords.new.length >= 8 ? "Medium" : "Weak"}
                              </span>
                            </div>
                            <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: "rgba(92,124,137,0.2)" }}>
                              <motion.div
                                animate={{ width: passwords.new.length >= 12 ? "100%" : passwords.new.length >= 8 ? "60%" : "25%" }}
                                transition={{ duration: 0.3 }}
                                className="h-full rounded-full"
                                style={{ background: passwords.new.length >= 12 ? "#50c878" : passwords.new.length >= 8 ? "#ffd700" : "#ff8a65" }}
                              />
                            </div>
                          </div>
                        )}

                        <SaveBtn onClick={handleChangePassword} label="Change Password" />
                      </div>
                    </SectionCard>

                    {/* 2FA + other actions */}
                    <SectionCard dark={dark} delay={0.1}>
                      <SectionHeader icon={Smartphone} title="Two-Factor Authentication" desc="Add an extra layer of security to your account." color="#c084fc" txtPri={txtPri} txtMut={txtMut} />
                      <div className="px-6 py-5 space-y-3">
                        <OutlineBtn onClick={() => setShow2FAModal(true)} icon={Smartphone} label="Enable Two-Factor Authentication" />
                        <OutlineBtn onClick={handleDownload} icon={Download} label="Download Account Data" />
                      </div>
                    </SectionCard>

                    {/* Danger zone */}
                    <SectionCard dark={dark} delay={0.2}>
                      <div className="px-6 py-5">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                            style={{ backgroundColor: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.25)" }}>
                            <AlertCircle size={16} style={{ color: "#ef4444" }} />
                          </div>
                          <div>
                            <h2 className="text-sm font-bold" style={{ color: "#ef4444" }}>Danger Zone</h2>
                            <p className="text-xs" style={{ color: txtMut }}>These actions are permanent and cannot be undone.</p>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <DangerBtn onClick={() => setShowDeleteModal(true)} icon={Trash2} label="Delete Account" />
                        </div>
                      </div>
                    </SectionCard>
                  </motion.div>
                )}

              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-4" style={{ borderTop: `1px solid ${bdr}` }}>
          <div className="flex items-center justify-center gap-3">
            <p className="text-xs tracking-[0.15em] uppercase" style={{ color: dark ? "rgba(255,255,255,0.18)" : "rgba(11,46,58,0.25)" }}>© 2025 KaryaLaya</p>
            <div className="w-px h-3" style={{ backgroundColor: dark ? "rgba(92,124,137,0.35)" : "rgba(31,73,89,0.2)" }} />
            <p style={{ color: dark ? "rgba(167,208,227,0.3)" : "rgba(31,73,89,0.3)", fontStyle: "italic", fontFamily: "'Cormorant Garamond',serif", fontSize: "0.82rem" }}>
              Crafted by Satyam Kumar
            </p>
          </div>
        </div>
      </div>

      {/* ── 2FA Modal ── */}
      <AnimatePresence>
        {show2FAModal && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/65" onClick={() => setShow2FAModal(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 20 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 z-50 flex items-center justify-center px-4"
            >
              <div className="w-full max-w-sm rounded-2xl p-6"
                style={{ backgroundColor: dark ? "#0a1a26" : "#d5ecf8", border: `1px solid ${bdr}`, boxShadow: "0 24px 80px rgba(0,0,0,0.5)" }}>
                <div className="flex items-center justify-between mb-4">
                  <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "1.2rem", fontWeight: 700, color: txtPri }}>Enable 2FA</h3>
                  <button onClick={() => setShow2FAModal(false)} style={{ color: txtMut, cursor: "pointer" }}><X size={18} /></button>
                </div>
                <p className="text-sm mb-4" style={{ color: txtMut }}>
                  Two-factor authentication adds an extra layer of security. You'll need an authenticator app like Google Authenticator.
                </p>
                <div className="rounded-xl p-4 mb-4 text-center text-sm" style={{ backgroundColor: dark ? "rgba(31,73,89,0.3)" : "rgba(92,160,200,0.15)", color: txtMut }}>
                  📱 QR code setup coming soon
                </div>
                <div className="flex gap-2 justify-end">
                  <button onClick={() => setShow2FAModal(false)} className="px-4 py-2 rounded-xl text-sm" style={{ border: `1px solid ${bdr}`, color: txtMut, cursor: "pointer" }}>Cancel</button>
                  <button onClick={() => { setShow2FAModal(false); showToast("2FA setup initiated!") }} className="px-4 py-2 rounded-xl text-sm font-semibold text-white"
                    style={{ background: "linear-gradient(135deg,#1F4959,#2d7a96)", cursor: "pointer" }}>Set Up 2FA</button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Delete Account Modal ── */}
      <AnimatePresence>
        {showDeleteModal && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/70" onClick={() => setShowDeleteModal(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 20 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 z-50 flex items-center justify-center px-4"
            >
              <div className="w-full max-w-sm rounded-2xl p-6"
                style={{ backgroundColor: dark ? "#0a1a26" : "#d5ecf8", border: "1px solid rgba(239,68,68,0.3)", boxShadow: "0 24px 80px rgba(0,0,0,0.5)" }}>
                <div className="flex items-center justify-between mb-3">
                  <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "1.2rem", fontWeight: 700, color: "#ef4444" }}>Delete Account</h3>
                  <button onClick={() => { setShowDeleteModal(false); setDeleteConfirm("") }} style={{ color: txtMut, cursor: "pointer" }}><X size={18} /></button>
                </div>
                <p className="text-sm mb-4" style={{ color: txtMut }}>
                  This will permanently delete your account and all associated data. This action <strong style={{ color: txtPri }}>cannot be undone</strong>.
                </p>
                <div className="mb-4">
                  <label className="block text-xs font-semibold tracking-widest uppercase mb-1.5" style={{ color: "#ef4444" }}>
                    Type DELETE to confirm
                  </label>
                  <input
                    value={deleteConfirm}
                    onChange={e => setDeleteConfirm(e.target.value)}
                    placeholder="DELETE"
                    className="w-full px-3 text-sm"
                    style={{ ...inSt, height: "2.75rem", display: "block", borderColor: "rgba(239,68,68,0.3)" }}
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <button onClick={() => { setShowDeleteModal(false); setDeleteConfirm("") }} className="px-4 py-2 rounded-xl text-sm" style={{ border: `1px solid ${bdr}`, color: txtMut, cursor: "pointer" }}>Cancel</button>
                  <motion.button
                    whileHover={deleteConfirm === "DELETE" ? { scale: 1.02 } : {}}
                    whileTap={deleteConfirm === "DELETE" ? { scale: 0.97 } : {}}
                    onClick={handleDeleteAccount}
                    className="px-4 py-2 rounded-xl text-sm font-semibold text-white"
                    style={{
                      background: deleteConfirm === "DELETE" ? "linear-gradient(135deg,#8b0000,#ef4444)" : "rgba(239,68,68,0.25)",
                      cursor: deleteConfirm === "DELETE" ? "pointer" : "not-allowed",
                      opacity: deleteConfirm === "DELETE" ? 1 : 0.5,
                    }}>
                    Delete Account
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Toast ── */}
      <AnimatePresence>
        {toast && <Toast key="toast" message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
      </AnimatePresence>
    </div>
  )
}

// Missing import fix
function X({ size, ...props }: any) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}