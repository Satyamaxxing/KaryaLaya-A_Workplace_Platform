"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Target, Calendar, CheckCircle2 } from "lucide-react"

// Mock progress data
const progressData = {
  overall: {
    completion: 68,
    trend: "up",
    change: "+12%",
    period: "this week",
  },
  projects: [
    {
      name: "Website Redesign",
      progress: 75,
      trend: "up",
      change: "+15%",
      dueDate: "Jan 15",
      status: "on-track",
    },
    {
      name: "Mobile App Development",
      progress: 45,
      trend: "up",
      change: "+8%",
      dueDate: "Feb 28",
      status: "on-track",
    },
    {
      name: "Marketing Campaign",
      progress: 90,
      trend: "down",
      change: "-2%",
      dueDate: "Jan 10",
      status: "at-risk",
    },
  ],
  tasks: {
    completed: 27,
    inProgress: 8,
    pending: 12,
    overdue: 2,
  },
  team: {
    productivity: 85,
    collaboration: 92,
    satisfaction: 78,
  },
}

export function ProgressTracker() {
  const getTrendIcon = (trend: string) => {
    return trend === "up" ? (
      <TrendingUp className="w-4 h-4 text-chart-3" />
    ) : (
      <TrendingDown className="w-4 h-4 text-destructive" />
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "on-track":
        return "text-chart-3"
      case "at-risk":
        return "text-destructive"
      case "delayed":
        return "text-chart-2"
      default:
        return "text-muted-foreground"
    }
  }

  return (
    <div className="space-y-6">
      {/* Overall Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="w-5 h-5" />
            <span>Overall Progress</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold">{progressData.overall.completion}%</p>
              <p className="text-sm text-muted-foreground">Complete</p>
            </div>
            <div className="flex items-center space-x-2">
              {getTrendIcon(progressData.overall.trend)}
              <span className="text-sm font-medium">{progressData.overall.change}</span>
              <span className="text-sm text-muted-foreground">{progressData.overall.period}</span>
            </div>
          </div>
          <Progress value={progressData.overall.completion} className="h-3" />
        </CardContent>
      </Card>

      {/* Project Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Project Progress</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {progressData.projects.map((project) => (
            <div key={project.name} className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">{project.name}</p>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-3 h-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Due {project.dueDate}</span>
                    <Badge variant="outline" className={`text-xs ${getStatusColor(project.status)}`}>
                      {project.status.replace("-", " ")}
                    </Badge>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{project.progress}%</p>
                  <div className="flex items-center space-x-1">
                    {getTrendIcon(project.trend)}
                    <span className="text-xs">{project.change}</span>
                  </div>
                </div>
              </div>
              <Progress value={project.progress} className="h-2" />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Task Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>Task Summary</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <p className="text-lg font-bold text-chart-3">{progressData.tasks.completed}</p>
              <p className="text-xs text-muted-foreground">Completed</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-secondary">{progressData.tasks.inProgress}</p>
              <p className="text-xs text-muted-foreground">In Progress</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-muted-foreground">{progressData.tasks.pending}</p>
              <p className="text-xs text-muted-foreground">Pending</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-destructive">{progressData.tasks.overdue}</p>
              <p className="text-xs text-muted-foreground">Overdue</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Team Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Team Metrics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm">Productivity</span>
              <span className="text-sm font-medium">{progressData.team.productivity}%</span>
            </div>
            <Progress value={progressData.team.productivity} className="h-2" />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm">Collaboration</span>
              <span className="text-sm font-medium">{progressData.team.collaboration}%</span>
            </div>
            <Progress value={progressData.team.collaboration} className="h-2" />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm">Satisfaction</span>
              <span className="text-sm font-medium">{progressData.team.satisfaction}%</span>
            </div>
            <Progress value={progressData.team.satisfaction} className="h-2" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
