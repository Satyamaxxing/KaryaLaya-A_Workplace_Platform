"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
import { Tabs, TabsContent } from "@/components/ui/tabs"
import {
  Plus,
  Search,
  Filter,
  Calendar,
  User,
  Flag,
  CheckCircle2,
  Clock,
  AlertCircle,
  MoreHorizontal,
  Kanban,
  List,
} from "lucide-react"

// Mock data
const tasks = [
  {
    id: 1,
    title: "Design homepage mockup",
    description: "Create wireframes and high-fidelity mockups for the new homepage design",
    status: "completed",
    priority: "high",
    assignee: { name: "Alex Rivera", initials: "AR", avatar: "/placeholder.svg?height=32&width=32" },
    project: "Website Redesign",
    dueDate: "2024-01-05",
    createdAt: "2023-12-20",
    tags: ["design", "ui/ux"],
  },
  {
    id: 2,
    title: "Implement responsive navigation",
    description: "Build mobile-first navigation component with hamburger menu and smooth animations",
    status: "completed",
    priority: "medium",
    assignee: { name: "Mike Johnson", initials: "MJ", avatar: "/placeholder.svg?height=32&width=32" },
    project: "Website Redesign",
    dueDate: "2024-01-07",
    createdAt: "2023-12-22",
    tags: ["frontend", "responsive"],
  },
  {
    id: 3,
    title: "Set up authentication flow",
    description: "Implement user registration, login, and password reset functionality",
    status: "in-progress",
    priority: "high",
    assignee: { name: "Mike Johnson", initials: "MJ", avatar: "/placeholder.svg?height=32&width=32" },
    project: "Website Redesign",
    dueDate: "2024-01-10",
    createdAt: "2023-12-25",
    tags: ["backend", "security"],
  },
  {
    id: 4,
    title: "Create user dashboard wireframes",
    description: "Design wireframes for user dashboard with project overview and task management",
    status: "in-progress",
    priority: "medium",
    assignee: { name: "Alex Rivera", initials: "AR", avatar: "/placeholder.svg?height=32&width=32" },
    project: "Website Redesign",
    dueDate: "2024-01-12",
    createdAt: "2023-12-28",
    tags: ["design", "wireframes"],
  },
  {
    id: 5,
    title: "Write test cases for login",
    description: "Create comprehensive test suite for authentication functionality",
    status: "todo",
    priority: "low",
    assignee: { name: "Emma Davis", initials: "ED", avatar: "/placeholder.svg?height=32&width=32" },
    project: "Website Redesign",
    dueDate: "2024-01-15",
    createdAt: "2024-01-02",
    tags: ["testing", "qa"],
  },
  {
    id: 6,
    title: "API integration for user data",
    description: "Connect frontend with backend API for user profile and settings management",
    status: "todo",
    priority: "high",
    assignee: { name: "Sarah Chen", initials: "SC", avatar: "/placeholder.svg?height=32&width=32" },
    project: "Mobile App Development",
    dueDate: "2024-01-18",
    createdAt: "2024-01-03",
    tags: ["api", "integration"],
  },
  {
    id: 7,
    title: "Performance optimization",
    description: "Optimize app performance and reduce bundle size",
    status: "review",
    priority: "medium",
    assignee: { name: "David Kim", initials: "DK", avatar: "/placeholder.svg?height=32&width=32" },
    project: "Mobile App Development",
    dueDate: "2024-01-20",
    createdAt: "2024-01-01",
    tags: ["performance", "optimization"],
  },
]

const projects = ["All Projects", "Website Redesign", "Mobile App Development", "Marketing Campaign"]
const statuses = ["all", "todo", "in-progress", "review", "completed"]
const priorities = ["all", "low", "medium", "high"]

export default function TasksPage() {
  const [viewMode, setViewMode] = useState<"list" | "board">("list")
  const [searchQuery, setSearchQuery] = useState("")
  const [filterProject, setFilterProject] = useState("All Projects")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterPriority, setFilterPriority] = useState("all")
  const [filterAssignee, setFilterAssignee] = useState("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "medium",
    assignee: "",
    project: "",
    dueDate: "",
  })

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesProject = filterProject === "All Projects" || task.project === filterProject
    const matchesStatus = filterStatus === "all" || task.status === filterStatus
    const matchesPriority = filterPriority === "all" || task.priority === filterPriority
    const matchesAssignee = filterAssignee === "all" || task.assignee.name === filterAssignee

    return matchesSearch && matchesProject && matchesStatus && matchesPriority && matchesAssignee
  })

  const tasksByStatus = {
    todo: filteredTasks.filter((task) => task.status === "todo"),
    "in-progress": filteredTasks.filter((task) => task.status === "in-progress"),
    review: filteredTasks.filter((task) => task.status === "review"),
    completed: filteredTasks.filter((task) => task.status === "completed"),
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="w-4 h-4 text-chart-3" />
      case "in-progress":
        return <Clock className="w-4 h-4 text-secondary" />
      case "review":
        return <AlertCircle className="w-4 h-4 text-chart-2" />
      case "todo":
        return <AlertCircle className="w-4 h-4 text-muted-foreground" />
      default:
        return <Clock className="w-4 h-4 text-muted-foreground" />
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

  const handleCreateTask = () => {
    console.log("Creating task:", newTask)
    setIsCreateDialogOpen(false)
    setNewTask({
      title: "",
      description: "",
      priority: "medium",
      assignee: "",
      project: "",
      dueDate: "",
    })
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="font-heading text-2xl font-bold text-primary">Tasks</h1>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Search className="w-4 h-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search tasks..."
                  className="w-64"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex items-center border rounded-md">
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                >
                  <List className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "board" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("board")}
                >
                  <Kanban className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Filters and Stats */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
          <div className="flex flex-wrap items-center gap-4">
            <Select value={filterProject} onValueChange={setFilterProject}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {projects.map((project) => (
                  <SelectItem key={project} value={project}>
                    {project}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-32">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                {statuses.slice(1).map((status) => (
                  <SelectItem key={status} value={status}>
                    {status.replace("-", " ")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filterPriority} onValueChange={setFilterPriority}>
              <SelectTrigger className="w-32">
                <Flag className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                {priorities.slice(1).map((priority) => (
                  <SelectItem key={priority} value={priority}>
                    {priority}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-4">
            <div className="grid grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-lg font-bold">{tasksByStatus.todo.length}</p>
                <p className="text-xs text-muted-foreground">To Do</p>
              </div>
              <div>
                <p className="text-lg font-bold">{tasksByStatus["in-progress"].length}</p>
                <p className="text-xs text-muted-foreground">In Progress</p>
              </div>
              <div>
                <p className="text-lg font-bold">{tasksByStatus.review.length}</p>
                <p className="text-xs text-muted-foreground">Review</p>
              </div>
              <div>
                <p className="text-lg font-bold">{tasksByStatus.completed.length}</p>
                <p className="text-xs text-muted-foreground">Done</p>
              </div>
            </div>

            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  New Task
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Create New Task</DialogTitle>
                  <DialogDescription>Add a new task to your project and assign it to a team member.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="task-title">Task Title</Label>
                    <Input
                      id="task-title"
                      placeholder="Enter task title"
                      value={newTask.title}
                      onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="task-description">Description</Label>
                    <Textarea
                      id="task-description"
                      placeholder="Describe the task"
                      value={newTask.description}
                      onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="task-project">Project</Label>
                      <Select
                        value={newTask.project}
                        onValueChange={(value) => setNewTask({ ...newTask, project: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select project" />
                        </SelectTrigger>
                        <SelectContent>
                          {projects.slice(1).map((project) => (
                            <SelectItem key={project} value={project}>
                              {project}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="task-priority">Priority</Label>
                      <Select
                        value={newTask.priority}
                        onValueChange={(value) => setNewTask({ ...newTask, priority: value })}
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
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="task-assignee">Assignee</Label>
                      <Select
                        value={newTask.assignee}
                        onValueChange={(value) => setNewTask({ ...newTask, assignee: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Assign to..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Sarah Chen">Sarah Chen</SelectItem>
                          <SelectItem value="Mike Johnson">Mike Johnson</SelectItem>
                          <SelectItem value="Alex Rivera">Alex Rivera</SelectItem>
                          <SelectItem value="Emma Davis">Emma Davis</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="task-due-date">Due Date</Label>
                      <Input
                        id="task-due-date"
                        type="date"
                        value={newTask.dueDate}
                        onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateTask}>Create Task</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Task Views */}
        <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as "list" | "board")}>
          <TabsContent value="list" className="space-y-4">
            {filteredTasks.map((task) => (
              <Card key={task.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 flex-1">
                      {getStatusIcon(task.status)}
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-semibold text-balance">{task.title}</h3>
                          <Badge variant={getStatusColor(task.status)} className="text-xs">
                            {task.status.replace("-", " ")}
                          </Badge>
                          <Badge variant="outline" className={`text-xs ${getPriorityColor(task.priority)}`}>
                            {task.priority}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground text-balance mb-2">{task.description}</p>
                        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                          <span>{task.project}</span>
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-3 h-3" />
                            <span>Due {task.dueDate}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <User className="w-3 h-3" />
                            <span>{task.assignee.name}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={task.assignee.avatar || "/placeholder.svg"} />
                        <AvatarFallback className="text-xs">{task.assignee.initials}</AvatarFallback>
                      </Avatar>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="board">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Object.entries(tasksByStatus).map(([status, statusTasks]) => (
                <div key={status} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-heading font-semibold capitalize">
                      {status.replace("-", " ")} ({statusTasks.length})
                    </h3>
                  </div>
                  <div className="space-y-3">
                    {statusTasks.map((task) => (
                      <Card key={task.id} className="hover:shadow-md transition-shadow cursor-pointer">
                        <CardContent className="p-4">
                          <div className="space-y-3">
                            <div className="flex items-start justify-between">
                              <h4 className="font-medium text-sm text-balance">{task.title}</h4>
                              <Button variant="ghost" size="icon" className="w-6 h-6">
                                <MoreHorizontal className="w-3 h-3" />
                              </Button>
                            </div>
                            <p className="text-xs text-muted-foreground text-balance">{task.description}</p>
                            <div className="flex items-center justify-between">
                              <Badge variant="outline" className={`text-xs ${getPriorityColor(task.priority)}`}>
                                {task.priority}
                              </Badge>
                              <Avatar className="w-6 h-6">
                                <AvatarImage src={task.assignee.avatar || "/placeholder.svg"} />
                                <AvatarFallback className="text-xs">{task.assignee.initials}</AvatarFallback>
                              </Avatar>
                            </div>
                            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                              <Calendar className="w-3 h-3" />
                              <span>{task.dueDate}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {filteredTasks.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-12 h-12 text-muted-foreground" />
            </div>
            <h3 className="font-heading text-lg font-semibold mb-2">No tasks found</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery || filterProject !== "All Projects" || filterStatus !== "all"
                ? "Try adjusting your search or filter criteria."
                : "Create your first task to get started with project management."}
            </p>
            {!searchQuery && filterProject === "All Projects" && filterStatus === "all" && (
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create Task
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
