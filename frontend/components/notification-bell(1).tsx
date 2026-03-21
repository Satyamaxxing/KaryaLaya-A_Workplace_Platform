"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Bell, CheckCircle2, MessageSquare, AlertTriangle, Settings } from "lucide-react"
import Link from "next/link"

// Mock recent notifications
const recentNotifications = [
  {
    id: 1,
    type: "task_assigned",
    title: "New task assigned",
    message: "Sarah Chen assigned you 'Set up authentication flow'",
    timestamp: "2 min ago",
    read: false,
    avatar: "/placeholder.svg?height=32&width=32",
    initials: "SC",
  },
  {
    id: 2,
    type: "mention",
    title: "You were mentioned",
    message: "Mike Johnson mentioned you in #development",
    timestamp: "15 min ago",
    read: false,
    avatar: "/placeholder.svg?height=32&width=32",
    initials: "MJ",
  },
  {
    id: 3,
    type: "deadline_approaching",
    title: "Deadline approaching",
    message: "Website Redesign project is due in 3 days",
    timestamp: "2 hours ago",
    read: true,
    avatar: null,
    initials: null,
  },
]

export function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false)
  const unreadCount = recentNotifications.filter((n) => !n.read).length

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "task_assigned":
        return <CheckCircle2 className="w-4 h-4 text-chart-3" />
      case "mention":
        return <MessageSquare className="w-4 h-4 text-secondary" />
      case "deadline_approaching":
        return <AlertTriangle className="w-4 h-4 text-destructive" />
      default:
        return <Bell className="w-4 h-4 text-muted-foreground" />
    }
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <Badge variant="destructive" className="absolute -top-1 -right-1 text-xs px-1.5 py-0.5 min-w-[1.25rem] h-5">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Notifications</h3>
            {unreadCount > 0 && (
              <Badge variant="secondary" className="text-xs">
                {unreadCount} new
              </Badge>
            )}
          </div>
        </div>

        <ScrollArea className="h-80">
          <div className="p-2">
            {recentNotifications.length > 0 ? (
              <div className="space-y-1">
                {recentNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-3 rounded-lg hover:bg-accent/50 transition-colors cursor-pointer ${
                      !notification.read ? "bg-accent/20" : ""
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        {notification.avatar ? (
                          <Avatar className="w-8 h-8">
                            <AvatarImage src={notification.avatar || "/placeholder.svg"} />
                            <AvatarFallback className="text-xs">{notification.initials}</AvatarFallback>
                          </Avatar>
                        ) : (
                          <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                            {getNotificationIcon(notification.type)}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{notification.title}</p>
                        <p className="text-xs text-muted-foreground text-balance mt-1">{notification.message}</p>
                        <p className="text-xs text-muted-foreground mt-1">{notification.timestamp}</p>
                      </div>
                      {!notification.read && <div className="w-2 h-2 bg-primary rounded-full mt-1"></div>}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Bell className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No notifications</p>
              </div>
            )}
          </div>
        </ScrollArea>

        <Separator />

        <div className="p-2">
          <Link href="/dashboard/notifications">
            <Button variant="ghost" className="w-full justify-start" onClick={() => setIsOpen(false)}>
              <Settings className="w-4 h-4 mr-2" />
              View All Notifications
            </Button>
          </Link>
        </div>
      </PopoverContent>
    </Popover>
  )
}
