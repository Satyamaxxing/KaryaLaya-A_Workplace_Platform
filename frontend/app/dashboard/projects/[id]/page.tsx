"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  AlertCircle,
  Plus,
  MessageSquare,
  FileText,
  Settings,
  MoreHorizontal,
} from "lucide-react"
import Link from "next/link"

// Mock project data
const project = {
  id: 1,
  name: "Website Redesign",
  description:
    "Complete overhaul of company website with modern design and improved UX. This project involves redesigning the entire user interface, improving performance, and implementing new features based on user feedback.",
  progress: 75,
  members: [
    { id: 1, name: "Sarah Chen", avatar: "/placeholder.svg?height=40&width=40", initials: "SC", role: "Project Lead" },
    { id: 2, name: "Mike Johnson", avatar: "/placeholder.svg?height=40&width=40", initials: "MJ", role: "Developer" },
    { id: 3, name: "Alex Rivera", avatar: "/placeholder.svg?height=40&width=40", initials: "AR", role: "Designer" },
    { id: 4, name: "Emma Davis", avatar: "/placeholder.svg?height=40&width=40", initials: "ED", role: "QA Tester" },
  ],
  tasks: { total: 12, completed: 9, inProgress: 2, pending: 1 },
  dueDate: "2024-01-15",
  status: "active",
  priority: "high",
  createdAt: "2023-12-01",
}

const tasks = [
  { id: 1, title: "Design homepage mockup", status: "completed", assignee: "Alex Rivera", dueDate: "2024-01-05" },
  {
    id: 2,
    title: "Implement responsive navigation",
    status: "completed",
    assignee: "Mike Johnson",
    dueDate: "2024-01-07",
  },
  {
    id: 3,
    title: "Set up authentication flow",
    status: "in-progress",
    assignee: "Mike Johnson",
    dueDate: "2024-01-10",
  },
  {
    id: 4,
    title: "Create user dashboard wireframes",
    status: "in-progress",
    assignee: "Alex Rivera",
    dueDate: "2024-01-12",
  },
  { id: 5, title: "Write test cases for login", status: "pending", assignee: "Emma Davis", dueDate: "2024-01-15" },
]

const discussions = [
  {
    id: 1,
    title: "Homepage design feedback",
    author: "Sarah Chen",
    replies: 5,
    lastActivity: "2 hours ago",
  },
  {
    id: 2,
    title: "Authentication requirements",
    author: "Mike Johnson",
    replies: 3,
    lastActivity: "1 day ago",
  },
  {
    id: 3,
    title: "Testing strategy discussion",
    author: "Emma Davis",
    replies: 7,
    lastActivity: "2 days ago",
  },
]

export default function ProjectDetailPage() {
  const [activeTab, setActiveTab] = useState("overview")

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="w-4 h-4 text-chart-3" />
      case "in-progress":
        return <Clock className="w-4 h-4 text-secondary" />
      case "pending":
        return <AlertCircle className="w-4 h-4 text-destructive" />
      default:
        return <Clock className="w-4 h-4 text-muted-foreground" />
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard/projects">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              </Link>
              <div>
                <h1 className="font-heading text-2xl font-bold text-primary">{project.name}</h1>
                <p className="text-sm text-muted-foreground">Project Details</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Task
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="tasks">Tasks</TabsTrigger>
                <TabsTrigger value="discussions">Discussions</TabsTrigger>
                <TabsTrigger value="files">Files</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Project Overview</CardTitle>
                    <CardDescription>{project.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">{project.progress}%</div>
                        <p className="text-sm text-muted-foreground">Complete</p>
                        <Progress value={project.progress} className="mt-2" />
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-secondary">{project.tasks.completed}</div>
                        <p className="text-sm text-muted-foreground">Tasks Done</p>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-chart-3">{project.members.length}</div>
                        <p className="text-sm text-muted-foreground">Team Members</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-semibold">Recent Activity</h4>
                      <div className="space-y-3">
                        {tasks.slice(0, 3).map((task) => (
                          <div key={task.id} className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                            {getStatusIcon(task.status)}
                            <div className="flex-1">
                              <p className="text-sm font-medium">{task.title}</p>
                              <p className="text-xs text-muted-foreground">Assigned to {task.assignee}</p>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {task.status.replace("-", " ")}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="tasks" className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-heading text-lg font-semibold">Project Tasks</h3>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Task
                  </Button>
                </div>
                <div className="space-y-3">
                  {tasks.map((task) => (
                    <Card key={task.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            {getStatusIcon(task.status)}
                            <div>
                              <h4 className="font-medium">{task.title}</h4>
                              <p className="text-sm text-muted-foreground">
                                Assigned to {task.assignee} • Due {task.dueDate}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline" className="text-xs">
                              {task.status.replace("-", " ")}
                            </Badge>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="discussions" className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-heading text-lg font-semibold">Team Discussions</h3>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    New Discussion
                  </Button>
                </div>
                <div className="space-y-3">
                  {discussions.map((discussion) => (
                    <Card key={discussion.id} className="hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <MessageSquare className="w-5 h-5 text-primary" />
                            <div>
                              <h4 className="font-medium">{discussion.title}</h4>
                              <p className="text-sm text-muted-foreground">
                                Started by {discussion.author} • {discussion.replies} replies •{" "}
                                {discussion.lastActivity}
                              </p>
                            </div>
                          </div>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="files" className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-heading text-lg font-semibold">Project Files</h3>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Upload File
                  </Button>
                </div>
                <div className="text-center py-12">
                  <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h4 className="font-semibold mb-2">No files uploaded yet</h4>
                  <p className="text-muted-foreground mb-4">Upload project files to share with your team.</p>
                  <Button>Upload First File</Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Project Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Project Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <Badge variant="default">{project.status}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Priority</span>
                  <Badge variant="destructive">{project.priority}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Due Date</span>
                  <span className="text-sm font-medium">{project.dueDate}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Created</span>
                  <span className="text-sm font-medium">{project.createdAt}</span>
                </div>
              </CardContent>
            </Card>

            {/* Team Members */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Team Members</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {project.members.map((member) => (
                  <div key={member.id} className="flex items-center space-x-3">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={member.avatar || "/placeholder.svg"} />
                      <AvatarFallback className="text-xs">{member.initials}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{member.name}</p>
                      <p className="text-xs text-muted-foreground">{member.role}</p>
                    </div>
                  </div>
                ))}
                <Button variant="outline" size="sm" className="w-full mt-3 bg-transparent">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Member
                </Button>
              </CardContent>
            </Card>

            {/* Task Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Task Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-chart-3" />
                    <span className="text-sm">Completed</span>
                  </div>
                  <span className="text-sm font-medium">{project.tasks.completed}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-secondary" />
                    <span className="text-sm">In Progress</span>
                  </div>
                  <span className="text-sm font-medium">{project.tasks.inProgress}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 text-destructive" />
                    <span className="text-sm">Pending</span>
                  </div>
                  <span className="text-sm font-medium">{project.tasks.pending}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
