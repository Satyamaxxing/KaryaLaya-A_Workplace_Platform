"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  Edit,
  Save,
  X,
  MessageSquare,
  Paperclip,
} from "lucide-react"
import Link from "next/link"

// Mock task data
const task = {
  id: 3,
  title: "Set up authentication flow",
  description:
    "Implement user registration, login, and password reset functionality with proper validation and security measures",
  status: "in-progress",
  priority: "high",
  assignee: { name: "Mike Johnson", initials: "MJ", avatar: "/placeholder.svg?height=40&width=40" },
  project: "Website Redesign",
  dueDate: "2024-01-10",
  createdAt: "2023-12-25",
  updatedAt: "2024-01-03",
  tags: ["backend", "security"],
  attachments: [
    { id: 1, name: "auth-flow-diagram.png", size: "2.4 MB", type: "image" },
    { id: 2, name: "security-requirements.pdf", size: "1.1 MB", type: "document" },
  ],
}

const comments = [
  {
    id: 1,
    author: { name: "Sarah Chen", initials: "SC", avatar: "/placeholder.svg?height=32&width=32" },
    content: "Great progress on the authentication flow! The security implementation looks solid.",
    timestamp: "2 hours ago",
  },
  {
    id: 2,
    author: { name: "Mike Johnson", initials: "MJ", avatar: "/placeholder.svg?height=32&width=32" },
    content: "Thanks! I've added two-factor authentication support as well. Should be ready for review by tomorrow.",
    timestamp: "1 hour ago",
  },
  {
    id: 3,
    author: { name: "Emma Davis", initials: "ED", avatar: "/placeholder.svg?height=32&width=32" },
    content: "I'll prepare the test cases once this is ready for QA.",
    timestamp: "30 minutes ago",
  },
]

const activityLog = [
  { id: 1, action: "Status changed from 'todo' to 'in-progress'", user: "Mike Johnson", timestamp: "2 days ago" },
  { id: 2, action: "Task assigned to Mike Johnson", user: "Sarah Chen", timestamp: "3 days ago" },
  { id: 3, action: "Task created", user: "Sarah Chen", timestamp: "1 week ago" },
]

export default function TaskDetailPage() {
  const [isEditing, setIsEditing] = useState(false)
  const [editedTask, setEditedTask] = useState(task)
  const [newComment, setNewComment] = useState("")

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="w-5 h-5 text-chart-3" />
      case "in-progress":
        return <Clock className="w-5 h-5 text-secondary" />
      case "review":
        return <AlertCircle className="w-5 h-5 text-chart-2" />
      case "todo":
        return <AlertCircle className="w-5 h-5 text-muted-foreground" />
      default:
        return <Clock className="w-5 h-5 text-muted-foreground" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-destructive"
      case "medium":
        return "text-secondary"
      case "low":
        return "text-muted-foreground"
      default:
        return "text-muted-foreground"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "default"
      case "in-progress":
        return "secondary"
      case "review":
        return "outline"
      case "todo":
        return "outline"
      default:
        return "outline"
    }
  }

  const handleSave = () => {
    console.log("Saving task:", editedTask)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditedTask(task)
    setIsEditing(false)
  }

  const handleAddComment = () => {
    if (newComment.trim()) {
      console.log("Adding comment:", newComment)
      setNewComment("")
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard/tasks">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              </Link>
              <div>
                <h1 className="font-heading text-2xl font-bold text-primary">Task Details</h1>
                <p className="text-sm text-muted-foreground">{task.project}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {isEditing ? (
                <>
                  <Button variant="outline" onClick={handleCancel}>
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                  <Button onClick={handleSave}>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </Button>
                </>
              ) : (
                <Button onClick={() => setIsEditing(true)}>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Task
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Task Details */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(editedTask.status)}
                    <div>
                      {isEditing ? (
                        <Input
                          value={editedTask.title}
                          onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
                          className="text-xl font-bold"
                        />
                      ) : (
                        <CardTitle className="text-xl text-balance">{task.title}</CardTitle>
                      )}
                      <div className="flex items-center space-x-2 mt-2">
                        <Badge variant={getStatusColor(editedTask.status)}>{editedTask.status.replace("-", " ")}</Badge>
                        <Badge variant="outline" className={getPriorityColor(editedTask.priority)}>
                          {editedTask.priority} priority
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Description</Label>
                  {isEditing ? (
                    <Textarea
                      value={editedTask.description}
                      onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
                      className="mt-2"
                      rows={4}
                    />
                  ) : (
                    <p className="text-sm text-muted-foreground mt-2 text-balance">{task.description}</p>
                  )}
                </div>

                {isEditing && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label className="text-sm font-medium">Status</Label>
                      <Select
                        value={editedTask.status}
                        onValueChange={(value) => setEditedTask({ ...editedTask, status: value })}
                      >
                        <SelectTrigger className="mt-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="todo">To Do</SelectItem>
                          <SelectItem value="in-progress">In Progress</SelectItem>
                          <SelectItem value="review">Review</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Priority</Label>
                      <Select
                        value={editedTask.priority}
                        onValueChange={(value) => setEditedTask({ ...editedTask, priority: value })}
                      >
                        <SelectTrigger className="mt-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Due Date</Label>
                      <Input
                        type="date"
                        value={editedTask.dueDate}
                        onChange={(e) => setEditedTask({ ...editedTask, dueDate: e.target.value })}
                        className="mt-2"
                      />
                    </div>
                  </div>
                )}

                {/* Tags */}
                <div>
                  <Label className="text-sm font-medium">Tags</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {task.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Attachments */}
                <div>
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Attachments</Label>
                    <Button variant="outline" size="sm">
                      <Paperclip className="w-4 h-4 mr-2" />
                      Add File
                    </Button>
                  </div>
                  <div className="space-y-2 mt-2">
                    {task.attachments.map((attachment) => (
                      <div key={attachment.id} className="flex items-center space-x-3 p-2 bg-muted/50 rounded-lg">
                        <Paperclip className="w-4 h-4 text-muted-foreground" />
                        <div className="flex-1">
                          <p className="text-sm font-medium">{attachment.name}</p>
                          <p className="text-xs text-muted-foreground">{attachment.size}</p>
                        </div>
                        <Button variant="ghost" size="sm">
                          Download
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Comments */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Comments</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  {comments.map((comment) => (
                    <div key={comment.id} className="flex space-x-3">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={comment.author.avatar || "/placeholder.svg"} />
                        <AvatarFallback className="text-xs">{comment.author.initials}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <p className="text-sm font-medium">{comment.author.name}</p>
                          <p className="text-xs text-muted-foreground">{comment.timestamp}</p>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1 text-balance">{comment.content}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator />

                <div className="flex space-x-3">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src="/placeholder.svg?height=32&width=32" />
                    <AvatarFallback className="text-xs">JD</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-2">
                    <Textarea
                      placeholder="Add a comment..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      rows={3}
                    />
                    <Button onClick={handleAddComment} disabled={!newComment.trim()}>
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Add Comment
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Task Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Task Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Assignee</span>
                  <div className="flex items-center space-x-2">
                    <Avatar className="w-6 h-6">
                      <AvatarImage src={task.assignee.avatar || "/placeholder.svg"} />
                      <AvatarFallback className="text-xs">{task.assignee.initials}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">{task.assignee.name}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Due Date</span>
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium">{task.dueDate}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Created</span>
                  <span className="text-sm font-medium">{task.createdAt}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Updated</span>
                  <span className="text-sm font-medium">{task.updatedAt}</span>
                </div>
              </CardContent>
            </Card>

            {/* Activity Log */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {activityLog.map((activity) => (
                  <div key={activity.id} className="text-sm">
                    <p className="text-balance">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">
                      by {activity.user} • {activity.timestamp}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
