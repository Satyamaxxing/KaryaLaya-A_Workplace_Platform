"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  Bell,
  CheckCircle2,
  MessageSquare,
  Users,
  Calendar,
  AlertTriangle,
  Settings,
  KanbanSquareDashed as MarkAsUnread,
  Trash2,
  Filter,
} from "lucide-react"

// Mock notifications data
const notifications = [
  {
    id: 1,
    type: "task_assigned",
    title: "New task assigned",
    message: "Sarah Chen assigned you 'Set up authentication flow'",
    timestamp: "2 minutes ago",
    read: false,
    priority: "high",
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "SC",
    project: "Website Redesign",
  },
  {
    id: 2,
    type: "mention",
    title: "You were mentioned",
    message: "Mike Johnson mentioned you in #development: 'Can you review the API integration?'",
    timestamp: "15 minutes ago",
    read: false,
    priority: "medium",
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "MJ",
    project: "Mobile App Development",
  },
  {
    id: 3,
    type: "task_completed",
    title: "Task completed",
    message: "Alex Rivera completed 'Design homepage mockup'",
    timestamp: "1 hour ago",
    read: true,
    priority: "low",
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "AR",
    project: "Website Redesign",
  },
  {
    id: 4,
    type: "deadline_approaching",
    title: "Deadline approaching",
    message: "Website Redesign project is due in 3 days",
    timestamp: "2 hours ago",
    read: false,
    priority: "high",
    avatar: null,
    initials: null,
    project: "Website Redesign",
  },
  {
    id: 5,
    type: "project_update",
    title: "Project milestone reached",
    message: "Marketing Campaign has reached 90% completion",
    timestamp: "1 day ago",
    read: true,
    priority: "medium",
    avatar: null,
    initials: null,
    project: "Marketing Campaign",
  },
  {
    id: 6,
    type: "team_joined",
    title: "New team member",
    message: "Emma Davis joined the Mobile App Development project",
    timestamp: "2 days ago",
    read: true,
    priority: "low",
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "ED",
    project: "Mobile App Development",
  },
]

const notificationSettings = [
  {
    category: "Task Updates",
    description: "Get notified when tasks are assigned, completed, or updated",
    settings: [
      { key: "task_assigned", label: "Task assignments", enabled: true },
      { key: "task_completed", label: "Task completions", enabled: true },
      { key: "task_overdue", label: "Overdue tasks", enabled: true },
      { key: "task_comments", label: "Task comments", enabled: false },
    ],
  },
  {
    category: "Project Updates",
    description: "Stay informed about project progress and milestones",
    settings: [
      { key: "project_milestones", label: "Project milestones", enabled: true },
      { key: "deadline_reminders", label: "Deadline reminders", enabled: true },
      { key: "project_status", label: "Status changes", enabled: false },
    ],
  },
  {
    category: "Team Communication",
    description: "Notifications for messages and mentions",
    settings: [
      { key: "mentions", label: "When mentioned", enabled: true },
      { key: "direct_messages", label: "Direct messages", enabled: true },
      { key: "channel_messages", label: "Channel messages", enabled: false },
    ],
  },
]

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState("all")
  const [filterRead, setFilterRead] = useState("all")
  const [settings, setSettings] = useState(notificationSettings)

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "task_assigned":
      case "task_completed":
        return <CheckCircle2 className="w-5 h-5 text-chart-3" />
      case "mention":
      case "direct_message":
        return <MessageSquare className="w-5 h-5 text-secondary" />
      case "deadline_approaching":
        return <AlertTriangle className="w-5 h-5 text-destructive" />
      case "project_update":
        return <Calendar className="w-5 h-5 text-primary" />
      case "team_joined":
        return <Users className="w-5 h-5 text-chart-2" />
      default:
        return <Bell className="w-5 h-5 text-muted-foreground" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "border-l-destructive"
      case "medium":
        return "border-l-secondary"
      case "low":
        return "border-l-muted-foreground"
      default:
        return "border-l-muted"
    }
  }

  const filteredNotifications = notifications.filter((notification) => {
    if (activeTab !== "all" && notification.type !== activeTab) return false
    if (filterRead === "unread" && notification.read) return false
    if (filterRead === "read" && !notification.read) return false
    return true
  })

  const unreadCount = notifications.filter((n) => !n.read).length

  const handleMarkAsRead = (id: number) => {
    console.log("Marking notification as read:", id)
  }

  const handleMarkAllAsRead = () => {
    console.log("Marking all notifications as read")
  }

  const handleDeleteNotification = (id: number) => {
    console.log("Deleting notification:", id)
  }

  const handleSettingChange = (categoryIndex: number, settingIndex: number, enabled: boolean) => {
    const newSettings = [...settings]
    newSettings[categoryIndex].settings[settingIndex].enabled = enabled
    setSettings(newSettings)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="font-heading text-2xl font-bold text-primary">Notifications</h1>
              {unreadCount > 0 && (
                <Badge variant="destructive" className="text-xs">
                  {unreadCount} unread
                </Badge>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" onClick={handleMarkAllAsRead}>
                <MarkAsUnread className="w-4 h-4 mr-2" />
                Mark All Read
              </Button>
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex items-center justify-between mb-6">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="task_assigned">Tasks</TabsTrigger>
              <TabsTrigger value="mention">Mentions</TabsTrigger>
              <TabsTrigger value="deadline_approaching">Deadlines</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            {activeTab !== "settings" && (
              <div className="flex items-center space-x-2">
                <Button
                  variant={filterRead === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterRead("all")}
                >
                  All
                </Button>
                <Button
                  variant={filterRead === "unread" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterRead("unread")}
                >
                  Unread
                </Button>
                <Button
                  variant={filterRead === "read" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterRead("read")}
                >
                  Read
                </Button>
              </div>
            )}
          </div>

          <TabsContent value="all" className="space-y-4">
            <ScrollArea className="h-[600px]">
              <div className="space-y-3">
                {filteredNotifications.map((notification) => (
                  <Card
                    key={notification.id}
                    className={`hover:shadow-md transition-shadow border-l-4 ${getPriorityColor(notification.priority)} ${
                      !notification.read ? "bg-accent/20" : ""
                    }`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                          {notification.avatar ? (
                            <Avatar className="w-10 h-10">
                              <AvatarImage src={notification.avatar || "/placeholder.svg"} />
                              <AvatarFallback>{notification.initials}</AvatarFallback>
                            </Avatar>
                          ) : (
                            <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                              {getNotificationIcon(notification.type)}
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-semibold text-sm">{notification.title}</h3>
                              <p className="text-sm text-muted-foreground text-balance mt-1">{notification.message}</p>
                              <div className="flex items-center space-x-2 mt-2">
                                <span className="text-xs text-muted-foreground">{notification.timestamp}</span>
                                {notification.project && (
                                  <>
                                    <span className="text-xs text-muted-foreground">•</span>
                                    <Badge variant="outline" className="text-xs">
                                      {notification.project}
                                    </Badge>
                                  </>
                                )}
                                <Badge
                                  variant={notification.priority === "high" ? "destructive" : "secondary"}
                                  className="text-xs"
                                >
                                  {notification.priority}
                                </Badge>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              {!notification.read && (
                                <Button variant="ghost" size="sm" onClick={() => handleMarkAsRead(notification.id)}>
                                  <MarkAsUnread className="w-4 h-4" />
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteNotification(notification.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="task_assigned">
            <ScrollArea className="h-[600px]">
              <div className="space-y-3">
                {filteredNotifications
                  .filter((n) => n.type === "task_assigned" || n.type === "task_completed")
                  .map((notification) => (
                    <Card
                      key={notification.id}
                      className={`hover:shadow-md transition-shadow border-l-4 ${getPriorityColor(notification.priority)} ${
                        !notification.read ? "bg-accent/20" : ""
                      }`}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start space-x-4">
                          <div className="flex-shrink-0">
                            <Avatar className="w-10 h-10">
                              <AvatarImage src={notification.avatar || "/placeholder.svg"} />
                              <AvatarFallback>{notification.initials}</AvatarFallback>
                            </Avatar>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-sm">{notification.title}</h3>
                            <p className="text-sm text-muted-foreground text-balance mt-1">{notification.message}</p>
                            <div className="flex items-center space-x-2 mt-2">
                              <span className="text-xs text-muted-foreground">{notification.timestamp}</span>
                              <Badge variant="outline" className="text-xs">
                                {notification.project}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="mention">
            <ScrollArea className="h-[600px]">
              <div className="space-y-3">
                {filteredNotifications
                  .filter((n) => n.type === "mention")
                  .map((notification) => (
                    <Card
                      key={notification.id}
                      className={`hover:shadow-md transition-shadow border-l-4 ${getPriorityColor(notification.priority)} ${
                        !notification.read ? "bg-accent/20" : ""
                      }`}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start space-x-4">
                          <div className="flex-shrink-0">
                            <Avatar className="w-10 h-10">
                              <AvatarImage src={notification.avatar || "/placeholder.svg"} />
                              <AvatarFallback>{notification.initials}</AvatarFallback>
                            </Avatar>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-sm">{notification.title}</h3>
                            <p className="text-sm text-muted-foreground text-balance mt-1">{notification.message}</p>
                            <div className="flex items-center space-x-2 mt-2">
                              <span className="text-xs text-muted-foreground">{notification.timestamp}</span>
                              <Badge variant="outline" className="text-xs">
                                {notification.project}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="deadline_approaching">
            <ScrollArea className="h-[600px]">
              <div className="space-y-3">
                {filteredNotifications
                  .filter((n) => n.type === "deadline_approaching")
                  .map((notification) => (
                    <Card
                      key={notification.id}
                      className={`hover:shadow-md transition-shadow border-l-4 ${getPriorityColor(notification.priority)} ${
                        !notification.read ? "bg-accent/20" : ""
                      }`}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start space-x-4">
                          <div className="flex-shrink-0">
                            <div className="w-10 h-10 bg-destructive/10 rounded-full flex items-center justify-center">
                              <AlertTriangle className="w-5 h-5 text-destructive" />
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-sm">{notification.title}</h3>
                            <p className="text-sm text-muted-foreground text-balance mt-1">{notification.message}</p>
                            <div className="flex items-center space-x-2 mt-2">
                              <span className="text-xs text-muted-foreground">{notification.timestamp}</span>
                              <Badge variant="destructive" className="text-xs">
                                {notification.project}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="w-5 h-5" />
                  <span>Notification Preferences</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {settings.map((category, categoryIndex) => (
                  <div key={category.category}>
                    <div className="mb-4">
                      <h3 className="font-semibold text-base">{category.category}</h3>
                      <p className="text-sm text-muted-foreground">{category.description}</p>
                    </div>
                    <div className="space-y-3">
                      {category.settings.map((setting, settingIndex) => (
                        <div key={setting.key} className="flex items-center justify-between">
                          <span className="text-sm">{setting.label}</span>
                          <Switch
                            checked={setting.enabled}
                            onCheckedChange={(enabled) => handleSettingChange(categoryIndex, settingIndex, enabled)}
                          />
                        </div>
                      ))}
                    </div>
                    {categoryIndex < settings.length - 1 && <Separator className="mt-6" />}
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
