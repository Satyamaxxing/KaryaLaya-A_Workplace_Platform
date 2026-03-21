// app/page.tsx
"use client"

import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { useEffect, useState } from "react"

const sarcasticMessages = [
  "Oh wow, a scroller. Bold choice. 🙄",
  "There's nothing down there. Just... us. 👀",
  "Scrolling won't make the deadline go away. 😂",
  "Ah yes, the classic scroll-instead-of-working move. 🏆",
  "You could be building something. But here we are. ☕",
  "Sir/Ma'am, this is a landing page. 💀",
]

export default function LandingPage() {
  const router = useRouter()
  const [toast, setToast] = useState<string | null>(null)
  const [toastVisible, setToastVisible] = useState(false)
  const [hasScrolled, setHasScrolled] = useState(false)

  // Sarcastic scroll toast
  useEffect(() => {
    const handleScroll = () => {
      if (!hasScrolled && window.scrollY > 10) {
        setHasScrolled(true)
        const msg = sarcasticMessages[Math.floor(Math.random() * sarcasticMessages.length)]
        setToast(msg)
        setToastVisible(true)
        setTimeout(() => setToastVisible(false), 3500)
      }
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [hasScrolled])

  // Floating code lines data
  const codeLines = [
    { x: "4%", y: "18%", width: 110, color: "#3c8fc0", delay: 0 },
    { x: "4%", y: "22%", width: 75, color: "#50c878", delay: 0.3 },
    { x: "4%", y: "26%", width: 140, color: "#ffd700", delay: 0.6 },
    { x: "4%", y: "30%", width: 60, color: "#ff6b6b", delay: 0.2 },
    { x: "4%", y: "34%", width: 120, color: "#3c8fc0", delay: 0.8 },
    { x: "4%", y: "38%", width: 90, color: "#50c878", delay: 0.4 },
    { x: "4%", y: "42%", width: 155, color: "#ffd700", delay: 1.0 },
    { x: "4%", y: "46%", width: 70, color: "#ff6b6b", delay: 0.1 },
    { x: "4%", y: "50%", width: 130, color: "#3c8fc0", delay: 0.7 },
    { x: "4%", y: "54%", width: 85, color: "#c084fc", delay: 0.5 },

    { x: "78%", y: "18%", width: 95, color: "#50c878", delay: 0.2 },
    { x: "78%", y: "22%", width: 130, color: "#3c8fc0", delay: 0.5 },
    { x: "78%", y: "26%", width: 70, color: "#ffd700", delay: 0.9 },
    { x: "78%", y: "30%", width: 115, color: "#ff6b6b", delay: 0.3 },
    { x: "78%", y: "34%", width: 80, color: "#50c878", delay: 0.7 },
    { x: "78%", y: "38%", width: 140, color: "#c084fc", delay: 0.1 },
    { x: "78%", y: "42%", width: 65, color: "#3c8fc0", delay: 0.6 },
    { x: "78%", y: "46%", width: 100, color: "#ffd700", delay: 0.4 },
    { x: "78%", y: "50%", width: 88, color: "#ff6b6b", delay: 0.8 },
    { x: "78%", y: "54%", width: 125, color: "#50c878", delay: 0.2 },
  ]

  return (
    <main className="relative min-h-screen w-full overflow-hidden" style={{ fontFamily: "'DM Sans', sans-serif" }}>

      {/* ── Hero Image ── */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: "url('/hero.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center center",
          backgroundRepeat: "no-repeat",
        }}
      />

      {/* ── Dark overlay ── */}
      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          background: "linear-gradient(to bottom, rgba(7,17,26,0.52) 0%, rgba(7,17,26,0.25) 38%, rgba(7,17,26,0.78) 100%)",
        }}
      />

      {/* ── Animated floating code lines overlay ── */}
      <div className="absolute inset-0 z-15 pointer-events-none overflow-hidden">
        {codeLines.map((line, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              left: line.x,
              top: line.y,
              width: line.width,
              height: 5,
              backgroundColor: line.color,
              opacity: 0.7,
              boxShadow: `0 0 8px ${line.color}88`,
            }}
            animate={{
              x: [0, Math.random() > 0.5 ? 8 : -8, 0, Math.random() > 0.5 ? -5 : 5, 0],
              opacity: [0.5, 0.9, 0.6, 0.85, 0.5],
              width: [line.width, line.width + 15, line.width - 8, line.width + 10, line.width],
              boxShadow: [
                `0 0 6px ${line.color}66`,
                `0 0 14px ${line.color}cc`,
                `0 0 8px ${line.color}88`,
                `0 0 12px ${line.color}aa`,
                `0 0 6px ${line.color}66`,
              ],
            }}
            transition={{
              duration: 2.2 + (i % 5) * 0.4,
              delay: line.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* ── NAVBAR ── */}
      <motion.nav
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.15 }}
        className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-8 py-5"
      >
        {/* Logo */}
        <div className="flex items-center gap-3">
          {/* Stylish K badge */}
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center relative overflow-hidden"
            style={{
              background: "linear-gradient(135deg, #0B2E3A 0%, #1F4959 50%, #5C7C89 100%)",
              boxShadow: "0 4px 20px rgba(31,73,89,0.6), inset 0 1px 0 rgba(255,255,255,0.15)",
              border: "1px solid rgba(92,124,137,0.5)",
            }}
          >
            {/* Sheen effect */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: "linear-gradient(135deg, rgba(255,255,255,0.18) 0%, transparent 60%)",
              }}
            />
            <span
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "1.3rem",
                fontWeight: 700,
                fontStyle: "italic",
                color: "#ffffff",
                letterSpacing: "-0.02em",
                textShadow: "0 2px 8px rgba(0,0,0,0.4)",
                lineHeight: 1,
              }}
            >
              K
            </span>
          </div>

          {/* KaryaLaya wordmark */}
          <span
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "1.45rem",
              fontWeight: 600,
              fontStyle: "italic",
              color: "#ffffff",
              letterSpacing: "0.04em",
              textShadow: "0 2px 16px rgba(0,0,0,0.5)",
              background: "linear-gradient(90deg, #ffffff 0%, #a8cfd8 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            KaryaLaya
          </span>
        </div>

        {/* Sign In button */}
        <motion.button
          whileHover={{
            scale: 1.05,
            backgroundColor: "rgba(92,124,137,0.25)",
            boxShadow: "0 8px 28px rgba(31,73,89,0.4)",
          }}
          whileTap={{ scale: 0.96 }}
          onClick={() => router.push("/auth")}
          className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-lg text-white cursor-pointer"
          style={{
            backgroundColor: "rgba(11,46,58,0.55)",
            border: "1px solid rgba(92,124,137,0.4)",
            backdropFilter: "blur(14px)",
            WebkitBackdropFilter: "blur(14px)",
            fontFamily: "'DM Sans', sans-serif",
            letterSpacing: "0.04em",
            transition: "background-color 0.3s, box-shadow 0.3s",
          }}
        >
          Sign In
          <motion.span
            animate={{ x: [0, 3, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <ArrowRight size={14} />
          </motion.span>
        </motion.button>
      </motion.nav>

      {/* ── HERO CONTENT ── */}
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-end pb-20 px-4 pointer-events-none">

        {/* Eyebrow — highlighted pill */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="mb-5"
        >
          <div
            className="px-5 py-2 rounded-full text-xs font-semibold tracking-[0.28em] uppercase"
            style={{
              background: "linear-gradient(135deg, rgba(31,73,89,0.75), rgba(92,124,137,0.5))",
              color: "#a8dce8",
              border: "1px solid rgba(92,180,200,0.45)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              boxShadow: "0 4px 20px rgba(31,73,89,0.4), inset 0 1px 0 rgba(255,255,255,0.1)",
              letterSpacing: "0.22em",
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            ✦ &nbsp;Team Collaboration Platform&nbsp; ✦
          </div>
        </motion.div>

        {/* Main heading */}
        <motion.h1
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.78, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-4"
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "clamp(2.4rem, 5.5vw, 4rem)",
            fontWeight: 700,
            color: "#ffffff",
            lineHeight: 1.12,
            letterSpacing: "-0.02em",
            textShadow: "0 2px 40px rgba(0,0,0,0.65), 0 0 80px rgba(0,0,0,0.3)",
            maxWidth: "620px",
          }}
        >
          Where great teams{" "}
          <span style={{ color: "#5CAFC4", fontStyle: "italic" }}>build</span>{" "}
          great things.
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.95 }}
          className="text-center mb-9"
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "clamp(0.85rem, 1.6vw, 0.97rem)",
            color: "rgba(255,255,255,0.5)",
            maxWidth: "400px",
            lineHeight: 1.75,
          }}
        >
          Manage projects, track tasks, and collaborate —
          all in one clean workspace.
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.1 }}
          className="pointer-events-auto mb-12"
        >
          <motion.button
            whileHover={{
              scale: 1.06,
              boxShadow: "0 20px 56px rgba(31,73,89,0.7)",
            }}
            whileTap={{ scale: 0.97 }}
            onClick={() => router.push("/auth")}
            className="flex items-center gap-3 px-10 py-4 text-sm font-semibold rounded-xl text-white cursor-pointer"
            style={{
              background: "linear-gradient(135deg, #1F4959 0%, #2d7a96 100%)",
              fontFamily: "'DM Sans', sans-serif",
              letterSpacing: "0.09em",
              boxShadow: "0 8px 32px rgba(11,46,58,0.6), inset 0 1px 0 rgba(255,255,255,0.12)",
              border: "1px solid rgba(92,124,137,0.35)",
              textTransform: "uppercase",
            }}
          >
            Start Your Karya
            <motion.span
              animate={{ x: [0, 4, 0] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
            >
              <ArrowRight size={15} />
            </motion.span>
          </motion.button>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.3 }}
          className="flex items-center gap-2"
        >
          {[
            ["1,200+", "Teams"],
            ["98%", "Uptime"],
            ["40+", "Integrations"],
          ].map(([num, label], i) => (
            <div key={label} className="flex items-center">
              <div className="text-center px-6">
                <div
                  className="text-xl font-bold text-white"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  {num}
                </div>
                <div
                  className="text-xs tracking-[0.18em] uppercase mt-0.5"
                  style={{ color: "rgba(255,255,255,0.35)", fontFamily: "'DM Sans', sans-serif" }}
                >
                  {label}
                </div>
              </div>
              {i < 2 && (
                <div className="h-8 w-px" style={{ backgroundColor: "rgba(92,124,137,0.3)" }} />
              )}
            </div>
          ))}
        </motion.div>
      </div>

      {/* ── Copyright ── */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.5 }}
        className="absolute bottom-5 left-1/2 -translate-x-1/2 z-30 text-xs tracking-[0.18em] uppercase"
        style={{ color: "rgba(255,255,255,0.18)", fontFamily: "'DM Sans', sans-serif" }}
      >
        © 2025 KaryaLaya
      </motion.p>

      {/* ── Sarcastic scroll toast ── */}
      <AnimatePresence>
        {toastVisible && toast && (
          <motion.div
            key="toast"
            initial={{ opacity: 0, y: 40, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-8 left-1/2 z-50 px-6 py-3.5 rounded-2xl text-sm font-medium text-white"
            style={{
              transform: "translateX(-50%)",
              background: "rgba(11,30,46,0.88)",
              border: "1px solid rgba(92,124,137,0.4)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              boxShadow: "0 12px 40px rgba(0,0,0,0.4)",
              fontFamily: "'DM Sans', sans-serif",
              whiteSpace: "nowrap",
              letterSpacing: "0.01em",
            }}
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}