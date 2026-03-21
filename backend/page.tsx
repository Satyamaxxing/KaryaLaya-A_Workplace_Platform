"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { CommunicationHub } from "@/components/communication-hub"
import { NotificationBell } from "@/components/notification-bell"
import { ProgressTracker } from "@/components/progress-tracker"
import {
  Plus,
  Users,
  Calendar,
  CheckCircle2,
  MoreHorizontal,
  Search,
  Settings,
  ArrowLeft,
  ArrowRight,
  RotateCcw,
  UserPlus,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useRouter } from "next/navigation"

export default function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [user, setUser] = useState({ name: "", email: "" })
  const [projects, setProjects] = useState([])
  const [teamMembers, setTeamMembers] = useState([])
  const [isNewProjectOpen, setIsNewProjectOpen] = useState(false)
  const [isInviteMemberOpen, setIsInviteMemberOpen] = useState(false)
  const [newProject, setNewProject] = useState({ name: "", description: "", dueDate: "" })
  const [inviteEmail, setInviteEmail] = useState("")
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem("synergysphere_user")
    const projectsData = localStorage.getItem("synergy_projects")
    const membersData = localStorage.getItem("synergy_members")

    if (userData) {
      setUser(JSON.parse(userData))
    }

    if (projectsData) {
      setProjects(JSON.parse(projectsData))
    }

    if (membersData) {
      setTeamMembers(JSON.parse(membersData))
    }
  }, [])

  const stats = {
    activeProjects: projects.filter((p) => p.status === "active").length,
    completedTasks: projects.reduce((acc, p) => acc + (p.tasks?.completed || 0), 0),
    dueThisWeek: projects.filter((p) => {
      const dueDate = new Date(p.dueDate)
      const weekFromNow = new Date()
      weekFromNow.setDate(weekFromNow.getDate() + 7)
      return dueDate <= weekFromNow && dueDate >= new Date()
    }).length,
    teamMembers: teamMembers.length,
  }

  const handleCreateProject = () => {
    if (!newProject.name.trim()) return

    const project = {
      id: Date.now(),
      name: newProject.name,
      description: newProject.description,
      progress: 0,
      members: 1,
      tasks: { total: 0, completed: 0 },
      dueDate: newProject.dueDate,
      status: "active",
      createdAt: new Date().toISOString(),
    }

    const updatedProjects = [...projects, project]
    setProjects(updatedProjects)
    localStorage.setItem("synergy_projects", JSON.stringify(updatedProjects))

    setNewProject({ name: "", description: "", dueDate: "" })
    setIsNewProjectOpen(false)
  }

  const handleInviteMember = () => {
    if (!inviteEmail.trim()) return

    const member = {
      id: Date.now(),
      email: inviteEmail,
      name: inviteEmail.split("@")[0],
      role: "member",
      joinedAt: new Date().toISOString(),
    }

    const updatedMembers = [...teamMembers, member]
    setTeamMembers(updatedMembers)
    localStorage.setItem("synergy_members", JSON.stringify(updatedMembers))

    setInviteEmail("")
    setIsInviteMemberOpen(false)
  }

  const handleBack = () => window.history.back()
  const handleForward = () => window.history.forward()
  const handleReload = () => window.location.reload()
  const handleSettings = () => router.push("/dashboard/settings")

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 mr-4">
                <Button variant="ghost" size="icon" onClick={handleBack}>
                  <ArrowLeft className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={handleForward}>
                  <ArrowRight className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={handleReload}>
                  <RotateCcw className="w-4 h-4" />
                </Button>
              </div>
              <h1 className="font-heading text-2xl font-bold text-primary">SynergySphere</h1>
              <div className="hidden md:flex items-center space-x-2">
                <Search className="w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search projects, tasks..."
                  className="bg-transparent border-none outline-none text-sm w-64"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Dialog open={isInviteMemberOpen} onOpenChange={setIsInviteMemberOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Invite
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Invite Team Member</DialogTitle>
                    <DialogDescription>Send an invitation to collaborate on your projects.</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="colleague@company.com"
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsInviteMemberOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleInviteMember}>Send Invitation</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <NotificationBell />
              <Button variant="ghost" size="icon" onClick={handleSettings}>
                <Settings className="w-4 h-4" />
              </Button>
              <Avatar className="w-8 h-8">
                <AvatarImage src="/placeholder.svg?height=32&width=32" />
                <AvatarFallback>
                  {user.name
                    ? user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()
                    : "U"}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="font-heading text-3xl font-bold mb-2">Welcome, {user.name || "User"}!</h2>
          <p className="text-muted-foreground">Here's what's happening with your projects today.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Projects</p>
                  <p className="text-2xl font-bold">{stats.activeProjects}</p>
                </div>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Tasks Completed</p>
                  <p className="text-2xl font-bold">{stats.completedTasks}</p>
                </div>
                <div className="w-12 h-12 bg-chart-3/10 rounded-lg flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-chart-3" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Due This Week</p>
                  <p className="text-2xl font-bold">{stats.dueThisWeek}</p>
                </div>
                <div className="w-12 h-12 bg-destructive/10 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-destructive" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Team Members</p>
                  <p className="text-2xl font-bold">{stats.teamMembers}</p>
                </div>
                <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-secondary" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Projects Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-heading text-xl font-semibold">Your Projects</h3>
              <Dialog open={isNewProjectOpen} onOpenChange={setIsNewProjectOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    New Project
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Project</DialogTitle>
                    <DialogDescription>Start a new project to organize your team's work.</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">Project Name</Label>
                      <Input
                        id="name"
                        placeholder="Enter project name"
                        value={newProject.name}
                        onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        placeholder="Describe your project"
                        value={newProject.description}
                        onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="dueDate">Due Date</Label>
                      <Input
                        id="dueDate"
                        type="date"
                        value={newProject.dueDate}
                        onChange={(e) => setNewProject({ ...newProject, dueDate: e.target.value })}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsNewProjectOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreateProject}>Create Project</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            {projects.length === 0 ? (
              <Card className="p-8 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Plus className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">No projects yet</h3>
                <p className="text-muted-foreground mb-4">
                  Create your first project to get started with team collaboration.
                </p>
                <Button onClick={() => setIsNewProjectOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Project
                </Button>
              </Card>
            ) : (
              <div className="space-y-4">
                {projects.map((project) => (
                  <Card key={project.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{project.name}</CardTitle>
                          <CardDescription className="mt-1">{project.description}</CardDescription>
                        </div>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between text-sm">
                          <span>Progress</span>
                          <span className="font-medium">{project.progress}%</span>
                        </div>
                        <Progress value={project.progress} className="h-2" />

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <div className="flex items-center space-x-1">
                              <Users className="w-4 h-4" />
                              <span>{project.members} members</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <CheckCircle2 className="w-4 h-4" />
                              <span>
                                {project.tasks.completed}/{project.tasks.total} tasks
                              </span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-4 h-4" />
                              <span>Due {project.dueDate}</span>
                            </div>
                          </div>
                          <Badge variant={project.status === "active" ? "default" : "secondary"}>
                            {project.status}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <div>
                <h3 className="font-heading text-xl font-semibold mb-6">Recent Activity</h3>
                <CommunicationHub />
              </div>

              <div>
                <h3 className="font-heading text-xl font-semibold mb-6">Progress Overview</h3>
                <ProgressTracker />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
