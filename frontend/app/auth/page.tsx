// frontend/app/auth/page.tsx
"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Users, Target, MessageSquare, BarChart3,
  CheckCircle, AlertCircle, ArrowRight, Eye, EyeOff, Loader2
} from "lucide-react"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

export default function AuthPage() {
  const [activeTab, setActiveTab]     = useState<"signin" | "signup">("signin")
  const [isLoading, setIsLoading]     = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [message, setMessage]         = useState<{ type: "success" | "error"; text: string } | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage(null)

    const formData = new FormData(e.currentTarget)
    const email    = formData.get("email")    as string
    const password = formData.get("password") as string
    const name     = formData.get("name")     as string

    try {
      let res
      if (activeTab === "signup") {
        res = await fetch(`${API_URL}/api/auth/signup`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, name }),
        })
      } else {
        res = await fetch(`${API_URL}/api/auth/signin`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        })
      }

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || `Request failed with status ${res.status}`)

      if (activeTab === "signup") {
        setMessage({ type: "success", text: "Account created! Please sign in." })
        setTimeout(() => { setActiveTab("signin"); setMessage(null) }, 2000)
      } else {
        setMessage({ type: "success", text: "Welcome back! Redirecting..." })

        // ── UPDATED: avatar_url bhi save karo localStorage mein ──
        localStorage.setItem("karyalaya_user", JSON.stringify({
          id:        data.id,
          email:     email,
          name:      data.name || email.split("@")[0],
          avatar:    data.avatar_url || "",
          loginTime: new Date().toISOString(),
        }))

        setTimeout(() => router.push("/dashboard"), 1500)
      }
    } catch (err: any) {
      setMessage({ type: "error", text: err.message })
    } finally {
      setIsLoading(false)
    }
  }

  const features = [
    { icon: Target,        label: "Project Management", desc: "Organize and track projects" },
    { icon: Users,         label: "Team Collaboration",  desc: "Connect and coordinate"      },
    { icon: MessageSquare, label: "Communication",       desc: "Threaded discussions"         },
    { icon: BarChart3,     label: "Progress Tracking",   desc: "Visual insights"              },
  ]

  const floatingLines = [
    { left: "2%",  top: "15%", width: 100, color: "#3c8fc0", delay: 0   },
    { left: "2%",  top: "22%", width: 70,  color: "#50c878", delay: 0.3 },
    { left: "2%",  top: "29%", width: 130, color: "#ffd700", delay: 0.6 },
    { left: "2%",  top: "36%", width: 55,  color: "#ff6b6b", delay: 0.2 },
    { left: "2%",  top: "43%", width: 110, color: "#c084fc", delay: 0.8 },
    { left: "2%",  top: "50%", width: 85,  color: "#3c8fc0", delay: 0.4 },
    { left: "2%",  top: "57%", width: 145, color: "#50c878", delay: 1.0 },
    { left: "2%",  top: "64%", width: 65,  color: "#ffd700", delay: 0.1 },
    { left: "2%",  top: "71%", width: 120, color: "#ff6b6b", delay: 0.7 },
    { left: "2%",  top: "78%", width: 80,  color: "#c084fc", delay: 0.5 },
    { left: "88%", top: "15%", width: 90,  color: "#50c878", delay: 0.2 },
    { left: "88%", top: "22%", width: 125, color: "#3c8fc0", delay: 0.5 },
    { left: "88%", top: "29%", width: 65,  color: "#ffd700", delay: 0.9 },
    { left: "88%", top: "36%", width: 110, color: "#ff6b6b", delay: 0.3 },
    { left: "88%", top: "43%", width: 75,  color: "#c084fc", delay: 0.7 },
    { left: "88%", top: "50%", width: 135, color: "#50c878", delay: 0.1 },
    { left: "88%", top: "57%", width: 60,  color: "#3c8fc0", delay: 0.6 },
    { left: "88%", top: "64%", width: 95,  color: "#ffd700", delay: 0.4 },
    { left: "88%", top: "71%", width: 85,  color: "#ff6b6b", delay: 0.8 },
    { left: "88%", top: "78%", width: 115, color: "#c084fc", delay: 0.2 },
  ]

  const AuthCard = () => (
    <div
      className="relative rounded-2xl overflow-hidden w-full"
      style={{
        backgroundColor: "rgba(7,17,26,0.75)",
        border: "1px solid rgba(92,124,137,0.25)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        boxShadow: "0 24px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)",
      }}
    >
      <div className="absolute top-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, rgba(92,180,200,0.5), transparent)" }} />
      <div className="p-8">
        <div className="text-center mb-7">
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.9rem", fontWeight: 700, color: "#ffffff", letterSpacing: "-0.01em" }}>
            {activeTab === "signin" ? "Welcome back" : "Join KaryaLaya"}
          </h2>
          <p className="text-sm mt-1.5" style={{ color: "rgba(255,255,255,0.4)", fontFamily: "'DM Sans', sans-serif" }}>
            {activeTab === "signin" ? "Sign in to continue to your workspace" : "Create your account and start collaborating"}
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex rounded-xl p-1 mb-7"
          style={{ backgroundColor: "rgba(11,46,58,0.6)", border: "1px solid rgba(92,124,137,0.2)" }}>
          {(["signin", "signup"] as const).map((tab) => (
            <button key={tab}
              onClick={() => { setActiveTab(tab); setMessage(null) }}
              className="relative flex-1 py-2.5 text-sm font-medium rounded-lg transition-all duration-300"
              style={{ color: activeTab === tab ? "#ffffff" : "rgba(255,255,255,0.4)", fontFamily: "'DM Sans', sans-serif" }}>
              {activeTab === tab && (
                <motion.div layoutId="activeTabMobile" className="absolute inset-0 rounded-lg"
                  style={{ background: "linear-gradient(135deg, #1F4959, #2d7a96)", boxShadow: "0 4px 14px rgba(31,73,89,0.4)" }}
                  transition={{ type: "spring", stiffness: 500, damping: 35 }} />
              )}
              <span className="relative z-10">{tab === "signin" ? "Sign In" : "Sign Up"}</span>
            </button>
          ))}
        </div>

        {/* Alert */}
        <AnimatePresence>
          {message && (
            <motion.div initial={{ opacity: 0, y: -8, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8, scale: 0.97 }} transition={{ duration: 0.3 }} className="mb-5">
              <Alert className="border rounded-xl py-3"
                style={{ backgroundColor: message.type === "success" ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)", borderColor: message.type === "success" ? "rgba(34,197,94,0.3)" : "rgba(239,68,68,0.3)" }}>
                {message.type === "success" ? <CheckCircle className="h-4 w-4 text-green-400" /> : <AlertCircle className="h-4 w-4 text-red-400" />}
                <AlertDescription className="text-sm" style={{ color: message.type === "success" ? "#86efac" : "#fca5a5", fontFamily: "'DM Sans', sans-serif" }}>
                  {message.text}
                </AlertDescription>
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Form */}
        <AnimatePresence mode="wait">
          <motion.form key={activeTab}
            initial={{ opacity: 0, x: activeTab === "signin" ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: activeTab === "signin" ? 20 : -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            onSubmit={handleSubmit} className="space-y-4">

            {activeTab === "signup" && (
              <div className="space-y-1.5">
                <Label htmlFor="name" className="text-xs font-medium tracking-wide" style={{ color: "rgba(255,255,255,0.55)", fontFamily: "'DM Sans', sans-serif" }}>Full Name</Label>
                <Input id="name" name="name" type="text" placeholder="Enter your full name" required
                  className="h-11 rounded-xl text-sm text-white placeholder:text-white/25"
                  style={{ backgroundColor: "rgba(31,73,89,0.3)", border: "1px solid rgba(92,124,137,0.3)", fontFamily: "'DM Sans', sans-serif" }}
                  onFocus={e => { e.target.style.borderColor = "rgba(92,180,200,0.6)"; e.target.style.boxShadow = "0 0 0 3px rgba(92,180,200,0.1)" }}
                  onBlur={e => { e.target.style.borderColor = "rgba(92,124,137,0.3)"; e.target.style.boxShadow = "none" }} />
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-medium tracking-wide" style={{ color: "rgba(255,255,255,0.55)", fontFamily: "'DM Sans', sans-serif" }}>Email Address</Label>
              <Input id="email" name="email" type="email" placeholder="Enter your email" required
                className="h-11 rounded-xl text-sm text-white placeholder:text-white/25"
                style={{ backgroundColor: "rgba(31,73,89,0.3)", border: "1px solid rgba(92,124,137,0.3)", fontFamily: "'DM Sans', sans-serif" }}
                onFocus={e => { e.target.style.borderColor = "rgba(92,180,200,0.6)"; e.target.style.boxShadow = "0 0 0 3px rgba(92,180,200,0.1)" }}
                onBlur={e => { e.target.style.borderColor = "rgba(92,124,137,0.3)"; e.target.style.boxShadow = "none" }} />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-xs font-medium tracking-wide" style={{ color: "rgba(255,255,255,0.55)", fontFamily: "'DM Sans', sans-serif" }}>Password</Label>
              <div className="relative">
                <Input id="password" name="password" type={showPassword ? "text" : "password"}
                  placeholder={activeTab === "signup" ? "Create a password" : "Enter your password"} required
                  className="h-11 rounded-xl text-sm text-white placeholder:text-white/25 pr-11"
                  style={{ backgroundColor: "rgba(31,73,89,0.3)", border: "1px solid rgba(92,124,137,0.3)", fontFamily: "'DM Sans', sans-serif" }}
                  onFocus={e => { e.target.style.borderColor = "rgba(92,180,200,0.6)"; e.target.style.boxShadow = "0 0 0 3px rgba(92,180,200,0.1)" }}
                  onBlur={e => { e.target.style.borderColor = "rgba(92,124,137,0.3)"; e.target.style.boxShadow = "none" }} />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: "rgba(255,255,255,0.35)" }}>
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {activeTab === "signin" && (
              <div className="flex justify-end">
                <button type="button" className="text-xs transition-colors duration-200" style={{ color: "rgba(92,180,200,0.7)" }}
                  onMouseEnter={e => (e.currentTarget.style.color = "#5CAFC4")}
                  onMouseLeave={e => (e.currentTarget.style.color = "rgba(92,180,200,0.7)")}>
                  Forgot password?
                </button>
              </div>
            )}

            <motion.button type="submit" disabled={isLoading}
              whileHover={!isLoading ? { scale: 1.02, boxShadow: "0 16px 40px rgba(31,73,89,0.65)" } : {}}
              whileTap={!isLoading ? { scale: 0.98 } : {}}
              className="w-full h-12 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 mt-2"
              style={{ background: isLoading ? "rgba(31,73,89,0.5)" : "linear-gradient(135deg, #1F4959 0%, #2d7a96 100%)", border: "1px solid rgba(92,124,137,0.35)", boxShadow: "0 8px 28px rgba(11,46,58,0.5), inset 0 1px 0 rgba(255,255,255,0.1)", fontFamily: "'DM Sans', sans-serif", letterSpacing: "0.07em", textTransform: "uppercase", cursor: isLoading ? "not-allowed" : "pointer" }}>
              {isLoading ? (
                <><Loader2 size={16} className="animate-spin" />{activeTab === "signin" ? "Signing in..." : "Creating account..."}</>
              ) : (
                <>{activeTab === "signin" ? "Sign In" : "Create Account"}<ArrowRight size={15} /></>
              )}
            </motion.button>

            <p className="text-center text-xs pt-1" style={{ color: "rgba(255,255,255,0.3)", fontFamily: "'DM Sans', sans-serif" }}>
              {activeTab === "signin" ? "Don't have an account? " : "Already have an account? "}
              <button type="button"
                onClick={() => { setActiveTab(activeTab === "signin" ? "signup" : "signin"); setMessage(null) }}
                className="font-medium transition-colors duration-200" style={{ color: "#5CAFC4" }}
                onMouseEnter={e => (e.currentTarget.style.color = "#7dcfdf")}
                onMouseLeave={e => (e.currentTarget.style.color = "#5CAFC4")}>
                {activeTab === "signin" ? "Sign up" : "Sign in"}
              </button>
            </p>
          </motion.form>
        </AnimatePresence>
      </div>
    </div>
  )

  return (
    <main className="relative w-full" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <div className="fixed inset-0 z-0" style={{ backgroundImage: "url('/hero.jpg')", backgroundSize: "cover", backgroundPosition: "center center", backgroundRepeat: "no-repeat" }} />
      <div className="fixed inset-0 z-10 pointer-events-none" style={{ background: "linear-gradient(to bottom, rgba(7,17,26,0.7) 0%, rgba(7,17,26,0.55) 50%, rgba(7,17,26,0.82) 100%)" }} />

      <div className="fixed inset-0 z-[15] pointer-events-none overflow-hidden">
        {floatingLines.map((line, i) => (
          <motion.div key={i} className="absolute rounded-full"
            style={{ left: line.left, top: line.top, width: line.width, height: 4, backgroundColor: line.color, boxShadow: `0 0 8px ${line.color}88` }}
            animate={{ x: [0, i % 2 === 0 ? 10 : -10, 0, i % 2 === 0 ? -6 : 6, 0], opacity: [0.45, 0.85, 0.55, 0.8, 0.45], width: [line.width, line.width + 18, line.width - 10, line.width + 12, line.width], boxShadow: [`0 0 6px ${line.color}55`, `0 0 16px ${line.color}cc`, `0 0 8px ${line.color}77`, `0 0 13px ${line.color}aa`, `0 0 6px ${line.color}55`] }}
            transition={{ duration: 2.2 + (i % 5) * 0.4, delay: line.delay, repeat: Infinity, ease: "easeInOut" }} />
        ))}
      </div>

      <motion.nav initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}
        className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-6 py-4"
        style={{ backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)", borderBottom: "1px solid rgba(92,124,137,0.1)" }}>
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => router.push("/")}>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center relative overflow-hidden"
            style={{ background: "linear-gradient(135deg, #0B2E3A 0%, #1F4959 50%, #5C7C89 100%)", boxShadow: "0 4px 20px rgba(31,73,89,0.6), inset 0 1px 0 rgba(255,255,255,0.15)", border: "1px solid rgba(92,124,137,0.5)" }}>
            <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.18) 0%, transparent 60%)" }} />
            <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.2rem", fontWeight: 700, fontStyle: "italic", color: "#ffffff", position: "relative", zIndex: 1, lineHeight: 1 }}>K</span>
          </div>
          <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.3rem", fontWeight: 600, fontStyle: "italic", letterSpacing: "0.04em", background: "linear-gradient(90deg, #ffffff 0%, #a8cfd8 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>KaryaLaya</span>
        </div>
        <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} onClick={() => router.push("/")}
          className="text-sm font-medium px-4 py-2 rounded-lg text-white"
          style={{ backgroundColor: "rgba(11,46,58,0.5)", border: "1px solid rgba(92,124,137,0.35)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", fontFamily: "'DM Sans', sans-serif" }}>
          ← Back
        </motion.button>
      </motion.nav>

      {/* Desktop */}
      <div className="hidden lg:flex relative z-20 min-h-screen items-center justify-center px-6 pt-20">
        <div className="w-full max-w-6xl mx-auto grid lg:grid-cols-2 gap-10 items-center">
          <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }} className="flex flex-col gap-8">
            <div>
              <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                className="text-xs font-semibold tracking-[0.25em] uppercase mb-4" style={{ color: "#5CAFC4" }}>
                ✦ Welcome to KaryaLaya
              </motion.p>
              <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2.2rem, 4vw, 3.2rem)", fontWeight: 700, color: "#ffffff", lineHeight: 1.15, letterSpacing: "-0.02em", textShadow: "0 2px 40px rgba(0,0,0,0.6)" }}>
                Your team's <span style={{ color: "#5CAFC4", fontStyle: "italic" }}>command</span> center.
              </h1>
              <p className="mt-4 text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.45)", maxWidth: "380px" }}>
                Everything your team needs — projects, tasks, conversations and progress — unified in one elegant workspace.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {features.map(({ icon: Icon, label, desc }, i) => (
                <motion.div key={label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 + i * 0.1 }}
                  className="flex items-start gap-3 p-4 rounded-xl"
                  style={{ backgroundColor: "rgba(11,46,58,0.5)", border: "1px solid rgba(92,124,137,0.2)", backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)" }}>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: "linear-gradient(135deg, rgba(31,73,89,0.8), rgba(92,124,137,0.5))", border: "1px solid rgba(92,124,137,0.3)" }}>
                    <Icon size={15} style={{ color: "#5CAFC4" }} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-white">{label}</p>
                    <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>{desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="flex items-center gap-2">
              {[["1,200+", "Teams"], ["98%", "Uptime"], ["40+", "Integrations"]].map(([num, label], i) => (
                <div key={label} className="flex items-center">
                  <div className="px-5 text-center">
                    <div className="text-lg font-bold text-white" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{num}</div>
                    <div className="text-xs tracking-[0.15em] uppercase" style={{ color: "rgba(255,255,255,0.3)" }}>{label}</div>
                  </div>
                  {i < 2 && <div className="h-8 w-px" style={{ backgroundColor: "rgba(92,124,137,0.25)" }} />}
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 40, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }} className="w-full max-w-md mx-auto">
            <AuthCard />
          </motion.div>
        </div>
      </div>

      {/* Mobile */}
      <div className="lg:hidden relative z-20 flex flex-col">
        <div className="flex flex-col items-center justify-center text-center px-6 py-8" style={{ minHeight: "100svh", paddingTop: "80px" }}>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.2 }} className="flex flex-col items-center gap-6">
            <div className="px-4 py-2 rounded-full text-xs font-semibold tracking-[0.22em] uppercase"
              style={{ background: "linear-gradient(135deg, rgba(31,73,89,0.75), rgba(92,124,137,0.5))", color: "#a8dce8", border: "1px solid rgba(92,180,200,0.45)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }}>
              ✦ Welcome to KaryaLaya ✦
            </div>
            <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2.4rem, 10vw, 3.5rem)", fontWeight: 700, color: "#ffffff", lineHeight: 1.15, letterSpacing: "-0.02em", textShadow: "0 2px 40px rgba(0,0,0,0.65)" }}>
              Your team's <span style={{ color: "#5CAFC4", fontStyle: "italic" }}>command</span> center.
            </h1>
            <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.5)", maxWidth: "320px" }}>
              Everything your team needs — projects, tasks, conversations and progress — unified in one elegant workspace.
            </p>
            <div className="grid grid-cols-2 gap-2.5 w-full max-w-xs mt-2">
              {features.map(({ icon: Icon, label }, i) => (
                <motion.div key={label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 + i * 0.1 }}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-xl"
                  style={{ backgroundColor: "rgba(11,46,58,0.55)", border: "1px solid rgba(92,124,137,0.2)", backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)" }}>
                  <Icon size={13} style={{ color: "#5CAFC4", flexShrink: 0 }} />
                  <span className="text-xs font-medium text-white">{label}</span>
                </motion.div>
              ))}
            </div>
            <div className="flex items-center gap-2 mt-2">
              {[["1,200+", "Teams"], ["98%", "Uptime"], ["40+", "Integrations"]].map(([num, label], i) => (
                <div key={label} className="flex items-center">
                  <div className="px-3 text-center">
                    <div className="text-base font-bold text-white" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{num}</div>
                    <div className="text-xs tracking-[0.12em] uppercase" style={{ color: "rgba(255,255,255,0.3)" }}>{label}</div>
                  </div>
                  {i < 2 && <div className="h-6 w-px" style={{ backgroundColor: "rgba(92,124,137,0.25)" }} />}
                </div>
              ))}
            </div>
            <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }} className="flex flex-col items-center gap-1 mt-4">
              <span className="text-xs tracking-widest uppercase" style={{ color: "rgba(255,255,255,0.25)" }}>scroll to sign in</span>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 3L8 13M8 13L4 9M8 13L12 9" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </motion.div>
          </motion.div>
        </div>

        <div className="flex flex-col items-center justify-center px-5 py-12" style={{ minHeight: "100svh" }}>
          <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }} viewport={{ once: true, amount: 0.2 }} className="w-full max-w-sm">
            <AuthCard />
          </motion.div>
        </div>
      </div>

      <div className="relative z-30 text-center pb-6 hidden lg:block">
        <p className="text-xs tracking-[0.18em] uppercase" style={{ color: "rgba(255,255,255,0.15)", fontFamily: "'DM Sans', sans-serif" }}>© 2025 KaryaLaya</p>
      </div>
    </main>
  )
}