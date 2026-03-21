"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, Send, Paperclip, Hash, Users, Phone, Video, MoreHorizontal, Pin, Reply } from "lucide-react"

// Mock data
const channels = [
  {
    id: 1,
    name: "general",
    type: "channel",
    project: "Website Redesign",
    unreadCount: 3,
    lastMessage: "Great work on the homepage design!",
    lastActivity: "2 min ago",
  },
  {
    id: 2,
    name: "development",
    type: "channel",
    project: "Website Redesign",
    unreadCount: 0,
    lastMessage: "Authentication flow is ready for testing",
    lastActivity: "1 hour ago",
  },
  {
    id: 3,
    name: "design-review",
    type: "channel",
    project: "Mobile App Development",
    unreadCount: 5,
    lastMessage: "Updated the wireframes based on feedback",
    lastActivity: "30 min ago",
  },
  {
    id: 4,
    name: "Sarah Chen",
    type: "direct",
    project: null,
    unreadCount: 1,
    lastMessage: "Can we schedule a quick call about the project timeline?",
    lastActivity: "5 min ago",
  },
  {
    id: 5,
    name: "Mike Johnson",
    type: "direct",
    project: null,
    unreadCount: 0,
    lastMessage: "Thanks for the code review!",
    lastActivity: "2 hours ago",
  },
]

const messages = [
  {
    id: 1,
    author: { name: "Sarah Chen", initials: "SC", avatar: "/placeholder.svg?height=40&width=40" },
    content:
      "Hey team! I've just uploaded the latest design mockups for the homepage. Would love to get your feedback.",
    timestamp: "10:30 AM",
    type: "text",
    reactions: [
      { emoji: "👍", count: 3 },
      { emoji: "🎨", count: 1 },
    ],
    replies: 2,
  },
  {
    id: 2,
    author: { name: "Alex Rivera", initials: "AR", avatar: "/placeholder.svg?height=40&width=40" },
    content: "Looks fantastic! The color scheme really works well with our brand guidelines.",
    timestamp: "10:35 AM",
    type: "text",
    reactions: [{ emoji: "💯", count: 2 }],
    replies: 0,
  },
  {
    id: 3,
    author: { name: "Mike Johnson", initials: "MJ", avatar: "/placeholder.svg?height=40&width=40" },
    content: "I've finished implementing the responsive navigation. The mobile experience is much smoother now.",
    timestamp: "11:15 AM",
    type: "text",
    reactions: [{ emoji: "🚀", count: 4 }],
    replies: 1,
  },
  {
    id: 4,
    author: { name: "Emma Davis", initials: "ED", avatar: "/placeholder.svg?height=40&width=40" },
    content: "homepage-mockup-v3.png",
    timestamp: "11:45 AM",
    type: "file",
    fileInfo: { name: "homepage-mockup-v3.png", size: "2.4 MB", type: "image" },
    reactions: [{ emoji: "👀", count: 2 }],
    replies: 0,
  },
  {
    id: 5,
    author: { name: "Sarah Chen", initials: "SC", avatar: "/placeholder.svg?height=40&width=40" },
    content:
      "Perfect timing! This version addresses all the feedback from yesterday's review. @Mike Johnson can you take a look at the technical feasibility?",
    timestamp: "12:00 PM",
    type: "text",
    mentions: ["Mike Johnson"],
    reactions: [],
    replies: 0,
  },
]

const teamMembers = [
  { name: "Sarah Chen", initials: "SC", status: "online" },
  { name: "Mike Johnson", initials: "MJ", status: "away" },
  { name: "Alex Rivera", initials: "AR", status: "online" },
  { name: "Emma Davis", initials: "ED", status: "offline" },
  { name: "David Kim", initials: "DK", status: "online" },
]

export default function MessagesPage() {
  const [selectedChannel, setSelectedChannel] = useState(channels[0])
  const [newMessage, setNewMessage] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [isNewChannelDialogOpen, setIsNewChannelDialogOpen] = useState(false)
  const [newChannel, setNewChannel] = useState({
    name: "",
    type: "channel",
    project: "",
    description: "",
  })

  const filteredChannels = channels.filter(
    (channel) =>
      channel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (channel.project && channel.project.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      console.log("Sending message:", newMessage)
      setNewMessage("")
    }
  }

  const handleCreateChannel = () => {
    console.log("Creating channel:", newChannel)
    setIsNewChannelDialogOpen(false)
    setNewChannel({ name: "", type: "channel", project: "", description: "" })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-chart-3"
      case "away":
        return "bg-chart-2"
      case "offline":
        return "bg-muted-foreground"
      default:
        return "bg-muted-foreground"
    }
  }

  return (
    <div className="h-screen bg-background flex">
      {/* Sidebar */}
      <div className="w-80 border-r bg-card/50 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-4">
            <h1 className="font-heading text-xl font-bold text-primary">Messages</h1>
            <Dialog open={isNewChannelDialogOpen} onOpenChange={setIsNewChannelDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="w-4 h-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Create New Channel</DialogTitle>
                  <DialogDescription>Start a new conversation with your team members.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Channel Type</label>
                    <Select
                      value={newChannel.type}
                      onValueChange={(value) => setNewChannel({ ...newChannel, type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="channel">Public Channel</SelectItem>
                        <SelectItem value="private">Private Channel</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Channel Name</label>
                    <Input
                      placeholder="e.g. marketing-team"
                      value={newChannel.name}
                      onChange={(e) => setNewChannel({ ...newChannel, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Project</label>
                    <Select
                      value={newChannel.project}
                      onValueChange={(value) => setNewChannel({ ...newChannel, project: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select project" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Website Redesign">Website Redesign</SelectItem>
                        <SelectItem value="Mobile App Development">Mobile App Development</SelectItem>
                        <SelectItem value="Marketing Campaign">Marketing Campaign</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Description</label>
                    <Textarea
                      placeholder="What's this channel about?"
                      value={newChannel.description}
                      onChange={(e) => setNewChannel({ ...newChannel, description: e.target.value })}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsNewChannelDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateChannel}>Create Channel</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search conversations..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Channels List */}
        <ScrollArea className="flex-1">
          <div className="p-2">
            <div className="space-y-1">
              <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Channels
              </div>
              {filteredChannels
                .filter((channel) => channel.type === "channel")
                .map((channel) => (
                  <button
                    key={channel.id}
                    onClick={() => setSelectedChannel(channel)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left hover:bg-accent/50 transition-colors ${
                      selectedChannel.id === channel.id ? "bg-accent" : ""
                    }`}
                  >
                    <Hash className="w-4 h-4 text-muted-foreground" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium truncate">{channel.name}</p>
                        {channel.unreadCount > 0 && (
                          <Badge variant="destructive" className="text-xs px-1.5 py-0.5 min-w-[1.25rem] h-5">
                            {channel.unreadCount}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground truncate">{channel.project}</p>
                    </div>
                  </button>
                ))}

              <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-4">
                Direct Messages
              </div>
              {filteredChannels
                .filter((channel) => channel.type === "direct")
                .map((channel) => (
                  <button
                    key={channel.id}
                    onClick={() => setSelectedChannel(channel)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left hover:bg-accent/50 transition-colors ${
                      selectedChannel.id === channel.id ? "bg-accent" : ""
                    }`}
                  >
                    <div className="relative">
                      <Avatar className="w-6 h-6">
                        <AvatarImage src="/placeholder.svg?height=24&width=24" />
                        <AvatarFallback className="text-xs">
                          {channel.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-chart-3 rounded-full border-2 border-background"></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium truncate">{channel.name}</p>
                        {channel.unreadCount > 0 && (
                          <Badge variant="destructive" className="text-xs px-1.5 py-0.5 min-w-[1.25rem] h-5">
                            {channel.unreadCount}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground truncate">{channel.lastActivity}</p>
                    </div>
                  </button>
                ))}
            </div>
          </div>
        </ScrollArea>

        {/* Team Members */}
        <div className="border-t p-4">
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Team ({teamMembers.filter((m) => m.status === "online").length} online)
          </div>
          <div className="space-y-2">
            {teamMembers.slice(0, 3).map((member) => (
              <div key={member.name} className="flex items-center space-x-2">
                <div className="relative">
                  <Avatar className="w-6 h-6">
                    <AvatarImage src="/placeholder.svg?height=24&width=24" />
                    <AvatarFallback className="text-xs">{member.initials}</AvatarFallback>
                  </Avatar>
                  <div
                    className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 ${getStatusColor(member.status)} rounded-full border-2 border-background`}
                  ></div>
                </div>
                <span className="text-sm truncate">{member.name}</span>
              </div>
            ))}
            {teamMembers.length > 3 && (
              <button className="text-xs text-muted-foreground hover:text-foreground">
                +{teamMembers.length - 3} more
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="border-b bg-card/50 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {selectedChannel.type === "channel" ? (
                <Hash className="w-5 h-5 text-muted-foreground" />
              ) : (
                <Avatar className="w-8 h-8">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" />
                  <AvatarFallback className="text-xs">
                    {selectedChannel.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
              )}
              <div>
                <h2 className="font-semibold">{selectedChannel.name}</h2>
                {selectedChannel.project && <p className="text-sm text-muted-foreground">{selectedChannel.project}</p>}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="icon">
                <Phone className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <Video className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <Users className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div key={message.id} className="group hover:bg-accent/20 -mx-4 px-4 py-2 rounded-lg transition-colors">
                <div className="flex space-x-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={message.author.avatar || "/placeholder.svg"} />
                    <AvatarFallback className="text-sm">{message.author.initials}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <p className="text-sm font-semibold">{message.author.name}</p>
                      <p className="text-xs text-muted-foreground">{message.timestamp}</p>
                    </div>

                    {message.type === "text" && (
                      <div className="space-y-2">
                        <p className="text-sm text-balance">{message.content}</p>
                        {message.mentions && message.mentions.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {message.mentions.map((mention) => (
                              <Badge key={mention} variant="secondary" className="text-xs">
                                @{mention}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {message.type === "file" && message.fileInfo && (
                      <Card className="w-fit">
                        <CardContent className="p-3">
                          <div className="flex items-center space-x-3">
                            <Paperclip className="w-4 h-4 text-muted-foreground" />
                            <div>
                              <p className="text-sm font-medium">{message.fileInfo.name}</p>
                              <p className="text-xs text-muted-foreground">{message.fileInfo.size}</p>
                            </div>
                            <Button variant="outline" size="sm">
                              Download
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Reactions and Actions */}
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center space-x-2">
                        {message.reactions.map((reaction) => (
                          <button
                            key={reaction.emoji}
                            className="flex items-center space-x-1 px-2 py-1 bg-accent/50 rounded-full text-xs hover:bg-accent transition-colors"
                          >
                            <span>{reaction.emoji}</span>
                            <span>{reaction.count}</span>
                          </button>
                        ))}
                        <button className="opacity-0 group-hover:opacity-100 px-2 py-1 text-xs text-muted-foreground hover:text-foreground transition-all">
                          +
                        </button>
                      </div>
                      <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="sm" className="h-6 px-2">
                          <Reply className="w-3 h-3 mr-1" />
                          {message.replies > 0 && <span className="text-xs">{message.replies}</span>}
                        </Button>
                        <Button variant="ghost" size="sm" className="h-6 px-2">
                          <Pin className="w-3 h-3" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-6 px-2">
                          <MoreHorizontal className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Message Input */}
        <div className="border-t p-4">
          <div className="flex items-end space-x-3">
            <div className="flex-1">
              <Textarea
                placeholder={`Message ${selectedChannel.type === "channel" ? "#" + selectedChannel.name : selectedChannel.name}...`}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    handleSendMessage()
                  }
                }}
                rows={1}
                className="resize-none"
              />
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm">
                    <Paperclip className="w-4 h-4" />
                  </Button>
                  <span className="text-xs text-muted-foreground">Press Enter to send, Shift+Enter for new line</span>
                </div>
                <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
