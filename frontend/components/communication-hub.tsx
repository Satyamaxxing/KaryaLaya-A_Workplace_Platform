"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MessageSquare, Hash, Users, Bell } from "lucide-react"

// Mock data for recent activity
const recentActivity = [
  {
    id: 1,
    type: "message",
    channel: "general",
    author: "Sarah Chen",
    content: "Updated the project timeline",
    timestamp: "2 min ago",
    unread: true,
  },
  {
    id: 2,
    type: "mention",
    channel: "development",
    author: "Mike Johnson",
    content: "Can you review the authentication code?",
    timestamp: "15 min ago",
    unread: true,
  },
  {
    id: 3,
    type: "message",
    channel: "design-review",
    author: "Alex Rivera",
    content: "New mockups are ready for feedback",
    timestamp: "1 hour ago",
    unread: false,
  },
]

const activeChannels = [
  { name: "general", members: 8, lastActivity: "2 min ago" },
  { name: "development", members: 4, lastActivity: "15 min ago" },
  { name: "design-review", members: 6, lastActivity: "1 hour ago" },
]

export function CommunicationHub() {
  const [unreadCount] = useState(2)

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center space-x-2">
            <MessageSquare className="w-4 h-4" />
            <span>Team Communication</span>
          </CardTitle>
          {unreadCount > 0 && (
            <Badge variant="destructive" className="text-xs">
              {unreadCount} new
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Recent Activity */}
        <div>
          <h4 className="text-sm font-medium mb-3 flex items-center space-x-1">
            <Bell className="w-3 h-3" />
            <span>Recent Activity</span>
          </h4>
          <ScrollArea className="h-32">
            <div className="space-y-2">
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className={`flex items-start space-x-2 p-2 rounded-lg text-sm ${
                    activity.unread ? "bg-accent/50" : "hover:bg-accent/20"
                  } transition-colors cursor-pointer`}
                >
                  <Hash className="w-3 h-3 text-muted-foreground mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-1">
                      <span className="font-medium text-xs">#{activity.channel}</span>
                      <span className="text-xs text-muted-foreground">•</span>
                      <span className="text-xs text-muted-foreground">{activity.timestamp}</span>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">
                      <span className="font-medium">{activity.author}:</span> {activity.content}
                    </p>
                  </div>
                  {activity.unread && <div className="w-2 h-2 bg-primary rounded-full mt-1"></div>}
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Active Channels */}
        <div>
          <h4 className="text-sm font-medium mb-3 flex items-center space-x-1">
            <Users className="w-3 h-3" />
            <span>Active Channels</span>
          </h4>
          <div className="space-y-2">
            {activeChannels.map((channel) => (
              <div key={channel.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <Hash className="w-3 h-3 text-muted-foreground" />
                  <span className="font-medium">#{channel.name}</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  {channel.members} members • {channel.lastActivity}
                </div>
              </div>
            ))}
          </div>
        </div>

        <Button variant="outline" size="sm" className="w-full bg-transparent">
          <MessageSquare className="w-4 h-4 mr-2" />
          Open Messages
        </Button>
      </CardContent>
    </Card>
  )
}
