// frontend/app/dashboard/messages/page.tsx
"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Plus, Search, Send, Paperclip, Hash, Users, Phone,
  Video, MoreHorizontal, Pin, Reply, ArrowLeft, X,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"

// ── Mock data ──────────────────────────────────────────────
const channels = [
  { id: 1, name: "general",      type: "channel", project: "Website Redesign",       unreadCount: 3, lastMessage: "Great work on the homepage!", lastActivity: "2 min ago" },
  { id: 2, name: "development",  type: "channel", project: "Website Redesign",       unreadCount: 0, lastMessage: "Auth flow ready for testing",  lastActivity: "1 hour ago" },
  { id: 3, name: "design-review",type: "channel", project: "Mobile App Development", unreadCount: 5, lastMessage: "Updated wireframes for feedback",lastActivity: "30 min ago" },
  { id: 4, name: "Sarah Chen",   type: "direct",  project: null,                     unreadCount: 1, lastMessage: "Can we schedule a quick call?",  lastActivity: "5 min ago" },
  { id: 5, name: "Mike Johnson", type: "direct",  project: null,                     unreadCount: 0, lastMessage: "Thanks for the code review!",    lastActivity: "2 hours ago" },
]

const messages = [
  { id: 1, author: { name: "Sarah Chen",   initials: "SC" }, content: "Hey team! I've uploaded the latest design mockups for the homepage. Would love your feedback.", timestamp: "10:30 AM", type: "text",  reactions: [{ emoji: "👍", count: 3 }, { emoji: "🎨", count: 1 }], replies: 2, mentions: [] },
  { id: 2, author: { name: "Alex Rivera",  initials: "AR" }, content: "Looks fantastic! The color scheme really works with our brand guidelines.", timestamp: "10:35 AM", type: "text",  reactions: [{ emoji: "💯", count: 2 }], replies: 0, mentions: [] },
  { id: 3, author: { name: "Mike Johnson", initials: "MJ" }, content: "Finished implementing the responsive navigation. Mobile experience is much smoother now.", timestamp: "11:15 AM", type: "text",  reactions: [{ emoji: "🚀", count: 4 }], replies: 1, mentions: [] },
  { id: 4, author: { name: "Emma Davis",   initials: "ED" }, content: "homepage-mockup-v3.png", timestamp: "11:45 AM", type: "file",  fileInfo: { name: "homepage-mockup-v3.png", size: "2.4 MB" }, reactions: [{ emoji: "👀", count: 2 }], replies: 0, mentions: [] },
  { id: 5, author: { name: "Sarah Chen",   initials: "SC" }, content: "Perfect timing! This version addresses all feedback from yesterday's review. @Mike Johnson can you check technical feasibility?", timestamp: "12:00 PM", type: "text",  reactions: [], replies: 0, mentions: ["Mike Johnson"] },
]

const teamMembers = [
  { name: "Sarah Chen",   initials: "SC", status: "online" },
  { name: "Mike Johnson", initials: "MJ", status: "away" },
  { name: "Alex Rivera",  initials: "AR", status: "online" },
  { name: "Emma Davis",   initials: "ED", status: "offline" },
  { name: "David Kim",    initials: "DK", status: "online" },
]

// ── Helpers ────────────────────────────────────────────────
function statusColor(s: string) {
  return s === "online" ? "#50c878" : s === "away" ? "#ff8a65" : "rgba(255,255,255,0.2)"
}

function authorColor(name: string) {
  const colors = ["#5CAFC4", "#c084fc", "#50c878", "#ff8a65", "#ffd700"]
  return colors[name.charCodeAt(0) % colors.length]
}

// ── Main ───────────────────────────────────────────────────
export default function MessagesPage() {
  const router = useRouter()
  const [selectedChannel, setSelectedChannel]         = useState(channels[0])
  const [newMessage, setNewMessage]                   = useState("")
  const [searchQuery, setSearchQuery]                 = useState("")
  const [isNewChannelOpen, setIsNewChannelOpen]       = useState(false)
  const [mobileSidebarOpen, setMobileSidebarOpen]     = useState(false)
  const [newChannel, setNewChannel]                   = useState({ name: "", type: "channel", project: "", description: "" })
  const [localMessages, setLocalMessages]             = useState(messages)
  const [reactingTo, setReactingTo]                   = useState<number | null>(null)

  const dark = true // inherits from dashboard theme; adjust if needed

  const pageBg  = "#060e16"
  const sideBg  = "#07121d"
  const navBg   = "rgba(6,14,22,0.96)"
  const bdr     = "rgba(92,124,137,0.18)"
  const txtPri  = "#ffffff"
  const txtMut  = "rgba(255,255,255,0.4)"
  const glassBg = "rgba(10,22,34,0.75)"
  const accent  = "#5CAFC4"
  const inSt    = {
    backgroundColor: "rgba(31,73,89,0.28)",
    border: "1px solid rgba(92,124,137,0.28)",
    color: txtPri,
    fontFamily: "'DM Sans',sans-serif",
    borderRadius: "0.75rem",
  }

  const filteredChannels = channels.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (c.project && c.project.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  const handleSend = () => {
    if (!newMessage.trim()) return
    const msg = {
      id: Date.now(),
      author: { name: "You", initials: "YO" },
      content: newMessage.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      type: "text" as const,
      reactions: [], replies: 0, mentions: [],
    }
    setLocalMessages(prev => [...prev, msg])
    setNewMessage("")
  }

  const handleReact = (msgId: number, emoji: string) => {
    setLocalMessages(prev => prev.map(m => {
      if (m.id !== msgId) return m
      const existing = m.reactions.find(r => r.emoji === emoji)
      if (existing) {
        return { ...m, reactions: m.reactions.map(r => r.emoji === emoji ? { ...r, count: r.count + 1 } : r) }
      }
      return { ...m, reactions: [...m.reactions, { emoji, count: 1 }] }
    }))
    setReactingTo(null)
  }

  const handleCreateChannel = () => {
    setIsNewChannelOpen(false)
    setNewChannel({ name: "", type: "channel", project: "", description: "" })
  }

  const SidebarInner = () => (
    <div className="flex flex-col h-full">
      {/* Sidebar header */}
      <div className="flex-shrink-0 px-4 py-4" style={{ borderBottom: `1px solid ${bdr}` }}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => router.push("/dashboard")}
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: "rgba(31,73,89,0.3)", color: txtMut, border: `1px solid ${bdr}` }}
            >
              <ArrowLeft size={14} />
            </button>
            <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "1.2rem", fontWeight: 700, fontStyle: "italic", color: txtPri }}>
              Messages
            </h1>
          </div>

          {/* New channel dialog */}
          <Dialog open={isNewChannelOpen} onOpenChange={setIsNewChannelOpen}>
            <DialogTrigger asChild>
              <button
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: "linear-gradient(135deg,#1F4959,#2d7a96)", color: "#fff", cursor: "pointer" }}
              >
                <Plus size={15} />
              </button>
            </DialogTrigger>
            <DialogContent style={{ backgroundColor: "#0a1a26", border: `1px solid ${bdr}`, color: txtPri }}>
              <DialogHeader>
                <DialogTitle style={{ color: txtPri, fontFamily: "'Cormorant Garamond',serif", fontSize: "1.4rem" }}>Create New Channel</DialogTitle>
                <DialogDescription style={{ color: txtMut }}>Start a new conversation with your team.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 mt-2">
                <div>
                  <label className="text-xs font-semibold tracking-widest uppercase" style={{ color: txtMut }}>Channel Type</label>
                  <Select value={newChannel.type} onValueChange={v => setNewChannel({ ...newChannel, type: v })}>
                    <SelectTrigger className="mt-1.5" style={{ ...inSt, height: "2.75rem" }}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent style={{ backgroundColor: "#0a1a26", border: `1px solid ${bdr}`, color: txtPri }}>
                      <SelectItem value="channel">Public Channel</SelectItem>
                      <SelectItem value="private">Private Channel</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-xs font-semibold tracking-widest uppercase" style={{ color: txtMut }}>Channel Name</label>
                  <input
                    placeholder="e.g. marketing-team"
                    value={newChannel.name}
                    onChange={e => setNewChannel({ ...newChannel, name: e.target.value })}
                    className="w-full mt-1.5 px-3 text-sm outline-none"
                    style={{ ...inSt, height: "2.75rem", display: "flex", alignItems: "center" }}
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold tracking-widest uppercase" style={{ color: txtMut }}>Project</label>
                  <Select value={newChannel.project} onValueChange={v => setNewChannel({ ...newChannel, project: v })}>
                    <SelectTrigger className="mt-1.5" style={{ ...inSt, height: "2.75rem" }}>
                      <SelectValue placeholder="Select project" />
                    </SelectTrigger>
                    <SelectContent style={{ backgroundColor: "#0a1a26", border: `1px solid ${bdr}`, color: txtPri }}>
                      <SelectItem value="Website Redesign">Website Redesign</SelectItem>
                      <SelectItem value="Mobile App Development">Mobile App Development</SelectItem>
                      <SelectItem value="Marketing Campaign">Marketing Campaign</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-xs font-semibold tracking-widest uppercase" style={{ color: txtMut }}>Description</label>
                  <textarea
                    placeholder="What's this channel about?"
                    value={newChannel.description}
                    onChange={e => setNewChannel({ ...newChannel, description: e.target.value })}
                    rows={3}
                    className="w-full mt-1.5 px-3 py-2 text-sm outline-none resize-none"
                    style={{ ...inSt, height: "auto" }}
                  />
                </div>
              </div>
              <DialogFooter className="mt-5 gap-2">
                <button onClick={() => setIsNewChannelOpen(false)}
                  className="px-4 py-2 rounded-xl text-sm font-medium"
                  style={{ border: `1px solid ${bdr}`, color: txtMut, cursor: "pointer" }}>
                  Cancel
                </button>
                <button onClick={handleCreateChannel}
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-white"
                  style={{ background: "linear-gradient(135deg,#1F4959,#2d7a96)", cursor: "pointer" }}>
                  Create
                </button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search */}
        <div className="flex items-center gap-2 px-3 rounded-xl"
          style={{ backgroundColor: "rgba(31,73,89,0.2)", border: `1px solid ${bdr}`, height: 38 }}>
          <Search size={13} style={{ color: txtMut, flexShrink: 0 }} />
          <input
            type="text" placeholder="Search conversations..."
            className="bg-transparent border-none outline-none text-sm flex-1"
            style={{ color: txtPri, fontFamily: "'DM Sans',sans-serif" }}
            value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")} style={{ color: txtMut, cursor: "pointer" }}>
              <X size={13} />
            </button>
          )}
        </div>
      </div>

      {/* Channel list */}
      <div className="flex-1 overflow-y-auto px-2 py-3">
        {/* Channels */}
        <p className="px-3 mb-1.5 text-xs font-semibold tracking-[0.18em] uppercase" style={{ color: txtMut }}>Channels</p>
        {filteredChannels.filter(c => c.type === "channel").map(channel => (
          <motion.button
            key={channel.id}
            whileTap={{ scale: 0.98 }}
            onClick={() => { setSelectedChannel(channel); setMobileSidebarOpen(false) }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left mb-0.5"
            style={{
              backgroundColor: selectedChannel.id === channel.id ? "rgba(31,73,89,0.55)" : "transparent",
              border: selectedChannel.id === channel.id ? `1px solid rgba(92,124,137,0.28)` : "1px solid transparent",
              transition: "all 0.1s ease", cursor: "pointer",
            }}
          >
            <Hash size={14} style={{ color: selectedChannel.id === channel.id ? accent : txtMut, flexShrink: 0 }} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium truncate" style={{ color: selectedChannel.id === channel.id ? accent : txtPri }}>{channel.name}</p>
                {channel.unreadCount > 0 && (
                  <span className="text-xs px-1.5 py-0.5 rounded-full font-semibold ml-1 flex-shrink-0"
                    style={{ backgroundColor: "rgba(239,68,68,0.85)", color: "#fff", fontSize: "0.6rem" }}>
                    {channel.unreadCount}
                  </span>
                )}
              </div>
              <p className="text-xs truncate" style={{ color: txtMut }}>{channel.project}</p>
            </div>
          </motion.button>
        ))}

        {/* DMs */}
        <p className="px-3 mt-4 mb-1.5 text-xs font-semibold tracking-[0.18em] uppercase" style={{ color: txtMut }}>Direct Messages</p>
        {filteredChannels.filter(c => c.type === "direct").map(channel => (
          <motion.button
            key={channel.id}
            whileTap={{ scale: 0.98 }}
            onClick={() => { setSelectedChannel(channel); setMobileSidebarOpen(false) }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left mb-0.5"
            style={{
              backgroundColor: selectedChannel.id === channel.id ? "rgba(31,73,89,0.55)" : "transparent",
              border: selectedChannel.id === channel.id ? `1px solid rgba(92,124,137,0.28)` : "1px solid transparent",
              transition: "all 0.1s ease", cursor: "pointer",
            }}
          >
            <div className="relative flex-shrink-0">
              <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
                style={{ background: `linear-gradient(135deg,#1F4959,#5C7C89)` }}>
                {channel.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2)}
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2"
                style={{ backgroundColor: "#50c878", borderColor: sideBg }} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium truncate" style={{ color: selectedChannel.id === channel.id ? accent : txtPri }}>{channel.name}</p>
                {channel.unreadCount > 0 && (
                  <span className="text-xs px-1.5 py-0.5 rounded-full font-semibold ml-1 flex-shrink-0"
                    style={{ backgroundColor: "rgba(239,68,68,0.85)", color: "#fff", fontSize: "0.6rem" }}>
                    {channel.unreadCount}
                  </span>
                )}
              </div>
              <p className="text-xs truncate" style={{ color: txtMut }}>{channel.lastActivity}</p>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Team online status */}
      <div className="flex-shrink-0 px-4 py-3" style={{ borderTop: `1px solid ${bdr}` }}>
        <p className="text-xs font-semibold tracking-[0.18em] uppercase mb-2.5" style={{ color: txtMut }}>
          Team · {teamMembers.filter(m => m.status === "online").length} online
        </p>
        <div className="space-y-2">
          {teamMembers.slice(0, 4).map(member => (
            <div key={member.name} className="flex items-center gap-2">
              <div className="relative flex-shrink-0">
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
                  style={{ background: "linear-gradient(135deg,#1F4959,#5C7C89)", fontSize: "0.6rem" }}>
                  {member.initials}
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border border-[#07121d]"
                  style={{ backgroundColor: statusColor(member.status) }} />
              </div>
              <span className="text-xs truncate" style={{ color: txtPri }}>{member.name}</span>
            </div>
          ))}
          {teamMembers.length > 4 && (
            <button className="text-xs" style={{ color: accent, cursor: "pointer" }}>
              +{teamMembers.length - 4} more
            </button>
          )}
        </div>
      </div>
    </div>
  )

  return (
    <div className="flex" style={{ height: "100dvh", overflow: "hidden", backgroundColor: pageBg, color: txtPri, fontFamily: "'DM Sans',sans-serif" }}>

      {/* ── Desktop Sidebar ── */}
      <div className="hidden lg:flex flex-col flex-shrink-0"
        style={{ width: 280, backgroundColor: sideBg, borderRight: `1px solid ${bdr}`, height: "100dvh", overflow: "hidden" }}>
        <SidebarInner />
      </div>

      {/* ── Mobile Sidebar Overlay ── */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/65 lg:hidden"
              onClick={() => setMobileSidebarOpen(false)}
            />
            <motion.div
              initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
              className="fixed top-0 left-0 bottom-0 z-50 flex flex-col lg:hidden"
              style={{ width: 280, backgroundColor: sideBg, borderRight: `1px solid ${bdr}` }}
            >
              <button
                onClick={() => setMobileSidebarOpen(false)}
                className="absolute top-3 right-3 w-7 h-7 rounded-lg flex items-center justify-center z-10"
                style={{ backgroundColor: "rgba(31,73,89,0.4)", color: txtMut, cursor: "pointer" }}>
                <X size={14} />
              </button>
              <SidebarInner />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Main chat area ── */}
      <div className="flex-1 flex flex-col min-w-0" style={{ height: "100dvh", overflow: "hidden" }}>

        {/* Chat header */}
        <div className="flex-shrink-0 flex items-center justify-between px-4 gap-3"
          style={{ height: 60, backgroundColor: navBg, borderBottom: `1px solid ${bdr}`, backdropFilter: "blur(24px)" }}>

          {/* Left */}
          <div className="flex items-center gap-3 min-w-0">
            {/* Mobile menu button */}
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: "rgba(31,73,89,0.3)", color: txtPri, border: `1px solid ${bdr}`, cursor: "pointer" }}>
              <Hash size={15} />
            </button>

            {selectedChannel.type === "channel" ? (
              <Hash size={16} style={{ color: txtMut, flexShrink: 0 }} />
            ) : (
              <div className="relative flex-shrink-0">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
                  style={{ background: "linear-gradient(135deg,#1F4959,#5C7C89)" }}>
                  {selectedChannel.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2)}
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2"
                  style={{ backgroundColor: "#50c878", borderColor: navBg }} />
              </div>
            )}

            <div className="min-w-0">
              <h2 className="font-semibold text-sm truncate" style={{ color: txtPri }}>
                {selectedChannel.type === "channel" ? "#" : ""}{selectedChannel.name}
              </h2>
              {selectedChannel.project && (
                <p className="text-xs truncate" style={{ color: txtMut }}>{selectedChannel.project}</p>
              )}
            </div>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            {[
              { icon: Phone,         tip: "Voice call",   fn: () => {} },
              { icon: Video,         tip: "Video call",   fn: () => {} },
              { icon: Users,         tip: "Members",      fn: () => {} },
              { icon: MoreHorizontal,tip: "More options", fn: () => {} },
            ].map(({ icon: Icon, tip, fn }) => (
              <motion.button
                key={tip}
                whileHover={{ scale: 1.08, backgroundColor: "rgba(92,124,137,0.18)" }}
                whileTap={{ scale: 0.92 }}
                onClick={fn}
                title={tip}
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ color: txtMut, cursor: "pointer", transition: "all 0.1s ease" }}>
                <Icon size={15} />
              </motion.button>
            ))}
          </div>
        </div>

        {/* Messages scroll area */}
        <div className="flex-1 overflow-y-auto px-4 py-4">
          <div className="space-y-1 max-w-3xl mx-auto">
            <AnimatePresence initial={false}>
              {localMessages.map((message, idx) => {
                const isYou = message.author.name === "You"
                const showAvatar = idx === 0 || localMessages[idx - 1]?.author.name !== message.author.name
                const color = authorColor(message.author.name)

                return (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                    className="group relative"
                    style={{ paddingTop: showAvatar ? "12px" : "2px" }}
                  >
                    <div className={`flex gap-3 ${isYou ? "flex-row-reverse" : "flex-row"}`}>
                      {/* Avatar */}
                      <div style={{ width: 36, flexShrink: 0 }}>
                        {showAvatar && (
                          <div
                            className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white"
                            style={{ background: `linear-gradient(135deg,${color}88,${color})` }}
                          >
                            {message.author.initials}
                          </div>
                        )}
                      </div>

                      {/* Bubble */}
                      <div className={`flex flex-col ${isYou ? "items-end" : "items-start"} max-w-[75%]`}>
                        {showAvatar && (
                          <div className={`flex items-baseline gap-2 mb-1 ${isYou ? "flex-row-reverse" : "flex-row"}`}>
                            <span className="text-xs font-semibold" style={{ color }}>{message.author.name}</span>
                            <span className="text-xs" style={{ color: txtMut }}>{message.timestamp}</span>
                          </div>
                        )}

                        {/* Text message */}
                        {message.type === "text" && (
                          <div
                            className="px-4 py-2.5 rounded-2xl text-sm leading-relaxed"
                            style={{
                              backgroundColor: isYou
                                ? "linear-gradient(135deg,#1F4959,#2d7a96)"
                                : glassBg,
                              background: isYou
                                ? "linear-gradient(135deg,#1F4959,#2d7a96)"
                                : glassBg,
                              border: `1px solid ${isYou ? "rgba(92,160,200,0.3)" : bdr}`,
                              color: txtPri,
                              borderRadius: isYou ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                            }}
                          >
                            {message.content.split(" ").map((word, i) =>
                              message.mentions?.includes(word.replace("@", "")) ? (
                                <span key={i} style={{ color: accent, fontWeight: 600 }}>{word} </span>
                              ) : (
                                <span key={i}>{word} </span>
                              )
                            )}
                          </div>
                        )}

                        {/* File message */}
                        {message.type === "file" && message.fileInfo && (
                          <div
                            className="flex items-center gap-3 px-4 py-3 rounded-2xl"
                            style={{ backgroundColor: glassBg, border: `1px solid ${bdr}`, minWidth: 220 }}
                          >
                            <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                              style={{ backgroundColor: "rgba(92,124,137,0.25)", border: `1px solid ${bdr}` }}>
                              <Paperclip size={16} style={{ color: accent }} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate" style={{ color: txtPri }}>{message.fileInfo.name}</p>
                              <p className="text-xs" style={{ color: txtMut }}>{message.fileInfo.size}</p>
                            </div>
                            <button
                              className="text-xs px-2.5 py-1.5 rounded-lg font-medium flex-shrink-0"
                              style={{ border: `1px solid ${bdr}`, color: accent, cursor: "pointer", transition: "all 0.1s ease" }}>
                              Download
                            </button>
                          </div>
                        )}

                        {/* Reactions */}
                        {message.reactions.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1.5">
                            {message.reactions.map(r => (
                              <motion.button
                                key={r.emoji}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleReact(message.id, r.emoji)}
                                className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs"
                                style={{ backgroundColor: "rgba(92,124,137,0.18)", border: `1px solid ${bdr}`, cursor: "pointer", transition: "all 0.1s ease" }}>
                                <span>{r.emoji}</span>
                                <span style={{ color: txtMut }}>{r.count}</span>
                              </motion.button>
                            ))}
                          </div>
                        )}

                        {/* Hover actions */}
                        <div
                          className="flex items-center gap-1 mt-1 opacity-0 group-hover:opacity-100"
                          style={{ transition: "opacity 0.15s ease" }}
                        >
                          {/* Quick react */}
                          {["👍", "❤️", "😂", "🚀"].map(emoji => (
                            <motion.button
                              key={emoji}
                              whileTap={{ scale: 0.85 }}
                              onClick={() => handleReact(message.id, emoji)}
                              className="w-6 h-6 rounded-lg flex items-center justify-center text-xs"
                              style={{ backgroundColor: "rgba(31,73,89,0.3)", cursor: "pointer" }}>
                              {emoji}
                            </motion.button>
                          ))}
                          <motion.button
                            whileTap={{ scale: 0.9 }}
                            className="w-6 h-6 rounded-lg flex items-center justify-center"
                            style={{ backgroundColor: "rgba(31,73,89,0.3)", color: txtMut, cursor: "pointer" }}>
                            <Reply size={11} />
                          </motion.button>
                          <motion.button
                            whileTap={{ scale: 0.9 }}
                            className="w-6 h-6 rounded-lg flex items-center justify-center"
                            style={{ backgroundColor: "rgba(31,73,89,0.3)", color: txtMut, cursor: "pointer" }}>
                            <Pin size={11} />
                          </motion.button>
                          <motion.button
                            whileTap={{ scale: 0.9 }}
                            className="w-6 h-6 rounded-lg flex items-center justify-center"
                            style={{ backgroundColor: "rgba(31,73,89,0.3)", color: txtMut, cursor: "pointer" }}>
                            <MoreHorizontal size={11} />
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>
        </div>

        {/* Message input */}
        <div className="flex-shrink-0 px-4 py-3" style={{ borderTop: `1px solid ${bdr}`, backgroundColor: navBg }}>
          <div className="max-w-3xl mx-auto">
            <div
              className="flex items-end gap-2 rounded-2xl px-3 py-2"
              style={{ backgroundColor: "rgba(31,73,89,0.22)", border: `1px solid ${bdr}` }}
            >
              {/* Attach */}
              <motion.button
                whileTap={{ scale: 0.9 }}
                className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mb-0.5"
                style={{ color: txtMut, cursor: "pointer", transition: "all 0.1s ease" }}>
                <Paperclip size={16} />
              </motion.button>

              {/* Textarea */}
              <textarea
                rows={1}
                placeholder={`Message ${selectedChannel.type === "channel" ? "#" + selectedChannel.name : selectedChannel.name}...`}
                value={newMessage}
                onChange={e => {
                  setNewMessage(e.target.value)
                  e.target.style.height = "auto"
                  e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px"
                }}
                onKeyDown={e => {
                  if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend() }
                }}
                className="flex-1 bg-transparent border-none outline-none text-sm resize-none py-1.5"
                style={{
                  color: txtPri, fontFamily: "'DM Sans',sans-serif",
                  minHeight: "36px", maxHeight: "120px", lineHeight: "1.5",
                }}
              />

              {/* Send */}
              <motion.button
                whileHover={newMessage.trim() ? { scale: 1.08 } : {}}
                whileTap={newMessage.trim() ? { scale: 0.92 } : {}}
                onClick={handleSend}
                className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mb-0.5"
                style={{
                  background: newMessage.trim()
                    ? "linear-gradient(135deg,#1F4959,#2d7a96)"
                    : "rgba(31,73,89,0.2)",
                  color: newMessage.trim() ? "#fff" : txtMut,
                  cursor: newMessage.trim() ? "pointer" : "default",
                  transition: "all 0.15s ease",
                  border: `1px solid ${newMessage.trim() ? "rgba(92,160,200,0.3)" : bdr}`,
                }}>
                <Send size={14} />
              </motion.button>
            </div>

            <p className="text-xs mt-1.5 text-center" style={{ color: "rgba(255,255,255,0.18)" }}>
              Enter to send · Shift+Enter for new line
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}