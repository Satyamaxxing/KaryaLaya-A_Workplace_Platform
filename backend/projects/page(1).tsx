"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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
import {
  Plus,
  Users,
  Calendar,
  AlertCircle,
  MoreHorizontal,
  Search,
  Filter,
  Grid3X3,
  List,
  Eye,
  Edit,
} from "lucide-react"

// Mock data
const projects = [
  {
    id: 1,
    name: "Website Redesign",
    description: "Complete overhaul of company website with modern design and improved UX",
    progress: 75,
    members: [
      { id: 1, name: "Sarah Chen", avatar: "/placeholder.svg?height=32&width=32", initials: "SC" },
      { id: 2, name: "Mike Johnson", avatar: "/placeholder.svg?height=32&width=32", initials: "MJ" },
      { id: 3, name: "Alex Rivera", avatar: "/placeholder.svg?height=32&width=32", initials: "AR" },
      { id: 4, name: "Emma Davis", avatar: "/placeholder.svg?height=32&width=32", initials: "ED" },
    ],
    tasks: { total: 12, completed: 9, inProgress: 2, pending: 1 },
    dueDate: "2024-01-15",
    status: "active",
    priority: "high",
    createdAt: "2023-12-01",
  },
  {
    id: 2,
    name: "Mobile App Development",
    description: "iOS and Android app for customer portal with real-time notifications",
    progress: 45,
    members: [
      { id: 1, name: "Sarah Chen", avatar: "/placeholder.svg?height=32&width=32", initials: "SC" },
      { id: 5, name: "David Kim", avatar: "/placeholder.svg?height=32&width=32", initials: "DK" },
      { id: 6, name: "Lisa Wang", avatar: "/placeholder.svg?height=32&width=32", initials: "LW" },
    ],
    tasks: { total: 24, completed: 11, inProgress: 8, pending: 5 },
    dueDate: "2024-02-28",
    status: "active",
    priority: "medium",
    createdAt: "2023-11-15",
  },
  {
    id: 3,
    name: "Marketing Campaign",
    description: "Q1 digital marketing strategy implementation across all channels",
    progress: 90,
    members: [
      { id: 3, name: "Alex Rivera", avatar: "/placeholder.svg?height=32&width=32", initials: "AR" },
      { id: 7, name: "Tom Wilson", avatar: "/placeholder.svg?height=32&width=32", initials: "TW" },
    ],
    tasks: { total: 8, completed: 7, inProgress: 1, pending: 0 },
    dueDate: "2024-01-10",
    status: "review",
    priority: "high",
    createdAt: "2023-12-10",
  },
  {
    id: 4,
    name: "Database Migration",
    description: "Migrate legacy database to new cloud infrastructure",
    progress: 20,
    members: [
      { id: 2, name: "Mike Johnson", avatar: "/placeholder.svg?height=32&width=32", initials: "MJ" },
      { id: 5, name: "David Kim", avatar: "/placeholder.svg?height=32&width=32", initials: "DK" },
    ],
    tasks: { total: 15, completed: 3, inProgress: 2, pending: 10 },
    dueDate: "2024-03-15",
    status: "planning",
    priority: "low",
    createdAt: "2024-01-05",
  },
]

export default function ProjectsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [filterStatus, setFilterStatus] = useState("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newProject, setNewProject] = useState({
    name: "",
    description: "",
    dueDate: "",
    priority: "medium",
  })

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filterStatus === "all" || project.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const handleCreateProject = () => {
    // Handle project creation logic here
    console.log("Creating project:", newProject)
    setIsCreateDialogOpen(false)
    setNewProject({ name: "", description: "", dueDate: "", priority: "medium" })
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
      case "active":
        return "default"
      case "review":
        return "secondary"
      case "planning":
        return "outline"
      default:
        return "outline"
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="font-heading text-2xl font-bold text-primary">Projects</h1>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Search className="w-4 h-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search projects..."
                  className="w-64"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-32">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="review">Review</SelectItem>
                  <SelectItem value="planning">Planning</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex items-center border rounded-md">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats and Create Button */}
        <div className="flex items-center justify-between mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center md:text-left">
              <p className="text-2xl font-bold">{projects.length}</p>
              <p className="text-sm text-muted-foreground">Total Projects</p>
            </div>
            <div className="text-center md:text-left">
              <p className="text-2xl font-bold">{projects.filter((p) => p.status === "active").length}</p>
              <p className="text-sm text-muted-foreground">Active</p>
            </div>
            <div className="text-center md:text-left">
              <p className="text-2xl font-bold">{projects.filter((p) => p.status === "review").length}</p>
              <p className="text-sm text-muted-foreground">In Review</p>
            </div>
            <div className="text-center md:text-left">
              <p className="text-2xl font-bold">
                {Math.round(projects.reduce((acc, p) => acc + p.progress, 0) / projects.length)}%
              </p>
              <p className="text-sm text-muted-foreground">Avg Progress</p>
            </div>
          </div>

          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                New Project
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Create New Project</DialogTitle>
                <DialogDescription>Set up a new project to start collaborating with your team.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="project-name">Project Name</Label>
                  <Input
                    id="project-name"
                    placeholder="Enter project name"
                    value={newProject.name}
                    onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="project-description">Description</Label>
                  <Textarea
                    id="project-description"
                    placeholder="Describe your project"
                    value={newProject.description}
                    onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="project-due-date">Due Date</Label>
                    <Input
                      id="project-due-date"
                      type="date"
                      value={newProject.dueDate}
                      onChange={(e) => setNewProject({ ...newProject, dueDate: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="project-priority">Priority</Label>
                    <Select
                      value={newProject.priority}
                      onValueChange={(value) => setNewProject({ ...newProject, priority: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateProject}>Create Project</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Projects Grid/List */}
        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <Card key={project.id} className="hover:shadow-lg transition-all duration-200 group">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <CardTitle className="text-lg text-balance">{project.name}</CardTitle>
                        <Badge variant={getStatusColor(project.status)} className="text-xs">
                          {project.status}
                        </Badge>
                      </div>
                      <CardDescription className="text-balance">{project.description}</CardDescription>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Progress</span>
                      <span className="font-medium">{project.progress}%</span>
                    </div>
                    <Progress value={project.progress} className="h-2" />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex -space-x-2">
                      {project.members.slice(0, 3).map((member) => (
                        <Avatar key={member.id} className="w-8 h-8 border-2 border-background">
                          <AvatarImage src={member.avatar || "/placeholder.svg"} />
                          <AvatarFallback className="text-xs">{member.initials}</AvatarFallback>
                        </Avatar>
                      ))}
                      {project.members.length > 3 && (
                        <div className="w-8 h-8 rounded-full bg-muted border-2 border-background flex items-center justify-center">
                          <span className="text-xs font-medium">+{project.members.length - 3}</span>
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        {project.tasks.completed}/{project.tasks.total}
                      </p>
                      <p className="text-xs text-muted-foreground">tasks done</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>Due {project.dueDate}</span>
                    </div>
                    <div className={`flex items-center space-x-1 ${getPriorityColor(project.priority)}`}>
                      <AlertCircle className="w-4 h-4" />
                      <span className="capitalize">{project.priority}</span>
                    </div>
                  </div>

                  <div className="flex space-x-2 pt-2">
                    <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                      <Eye className="w-4 h-4 mr-2" />
                      View
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredProjects.map((project) => (
              <Card key={project.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-6 gap-4 items-center">
                      <div className="md:col-span-2">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-semibold text-balance">{project.name}</h3>
                          <Badge variant={getStatusColor(project.status)} className="text-xs">
                            {project.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground text-balance">{project.description}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Progress value={project.progress} className="flex-1 h-2" />
                        <span className="text-sm font-medium w-12">{project.progress}%</span>
                      </div>
                      <div className="flex -space-x-2">
                        {project.members.slice(0, 4).map((member) => (
                          <Avatar key={member.id} className="w-6 h-6 border border-background">
                            <AvatarImage src={member.avatar || "/placeholder.svg"} />
                            <AvatarFallback className="text-xs">{member.initials}</AvatarFallback>
                          </Avatar>
                        ))}
                        {project.members.length > 4 && (
                          <div className="w-6 h-6 rounded-full bg-muted border border-background flex items-center justify-center">
                            <span className="text-xs">+{project.members.length - 4}</span>
                          </div>
                        )}
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium">
                          {project.tasks.completed}/{project.tasks.total}
                        </p>
                        <p className="text-xs text-muted-foreground">tasks</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm">{project.dueDate}</p>
                        <p className={`text-xs capitalize ${getPriorityColor(project.priority)}`}>
                          {project.priority} priority
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-12 h-12 text-muted-foreground" />
            </div>
            <h3 className="font-heading text-lg font-semibold mb-2">No projects found</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery || filterStatus !== "all"
                ? "Try adjusting your search or filter criteria."
                : "Create your first project to get started with team collaboration."}
            </p>
            {!searchQuery && filterStatus === "all" && (
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create Project
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
