import React, { useState } from 'react'
import { Bell, Check, X, AlertCircle, Zap } from 'lucide-react'
import { Button } from '../../components/ui/button'

interface Notification {
  id: number
  type: 'alert' | 'update' | 'success' | 'info'
  title: string
  message: string
  timestamp: string
  read: boolean
  action?: {
    label: string
    href?: string
  }
}

const notificationsData: Notification[] = [
  {
    id: 1,
    type: 'success',
    title: 'Agent Installed Successfully',
    message: 'Content Writer agent has been installed and is ready to use.',
    timestamp: '5 minutes ago',
    read: false,
    action: { label: 'View Agent' }
  },
  {
    id: 2,
    type: 'alert',
    title: 'New Updates Available',
    message: 'Data Pipeline agent has 2 new updates that improve performance.',
    timestamp: '2 hours ago',
    read: false,
    action: { label: 'Update Now' }
  },
  {
    id: 3,
    type: 'info',
    title: 'Research Completed',
    message: 'Your market research analysis has been completed successfully.',
    timestamp: '1 day ago',
    read: true,
    action: { label: 'View Results' }
  }
]

const NotificationIcon = ({ type }: { type: string }) => {
  const iconClass = 'w-5 h-5'
  switch (type) {
    case 'success':
      return <Check className={`${iconClass} text-primary`} />
    case 'alert':
      return <AlertCircle className={`${iconClass} text-primary`} />
    case 'update':
      return <Zap className={`${iconClass} text-primary`} />
    default:
      return <Bell className={`${iconClass} text-primary`} />
  }
}

const NotificationCard = ({ notification, onMarkRead }: { notification: Notification; onMarkRead: (id: number) => void }) => (
  <div className={`flex gap-4 p-4 rounded-lg transition-all ${
    notification.read 
      ? 'bg-foreground/3 hover:bg-foreground/5' 
      : 'bg-foreground/5 hover:bg-foreground/8'
  }`}>
    <div className="flex-shrink-0 pt-1">
      <NotificationIcon type={notification.type} />
    </div>

    <div className="flex-1 min-w-0">
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-medium text-sm text-foreground">{notification.title}</h3>
        {!notification.read && (
          <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-1.5" />
        )}
      </div>
      <p className="text-xs text-foreground/60 mt-1 line-clamp-2">{notification.message}</p>
      <div className="flex items-center justify-between gap-2 mt-3">
        <span className="text-xs text-foreground/50">{notification.timestamp}</span>
        {notification.action && (
          <Button size="sm" variant="outline" className="text-xs h-7 px-2">
            {notification.action.label}
          </Button>
        )}
      </div>
    </div>

    {!notification.read && (
      <button
        onClick={() => onMarkRead(notification.id)}
        className="flex-shrink-0 p-2 rounded-lg hover:bg-foreground/10 transition-colors"
      >
        <X size={16} className="text-foreground/50 hover:text-foreground" />
      </button>
    )}
  </div>
)

export function Notify() {
  const [notifications, setNotifications] = useState(notificationsData)
  const [filter, setFilter] = useState<'all' | 'unread'>('all')

  const handleMarkRead = (id: number) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ))
  }

  const handleMarkAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })))
  }

  const filteredNotifications = filter === 'unread' 
    ? notifications.filter(n => !n.read)
    : notifications

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <div className="flex flex-col h-full gap-5 p-8 mt-12 max-w-3xl mx-auto">
      {/* Header */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h1 className="text-5xl text-foreground">
            Notifications
          </h1>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-foreground/10">
            <Bell size={14} className="text-primary" />
            <span className="text-xs font-medium text-foreground">{unreadCount}</span>
          </div>
        </div>
        <p className="text-sm text-foreground/60">Stay updated with important events and activities</p>
      </div>

      {/* View Tabs */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
            filter === 'all'
              ? 'bg-foreground/15 text-foreground'
              : 'text-foreground/70 hover:text-foreground'
          }`}
        >
          All Notifications
        </button>
        <button
          onClick={() => setFilter('unread')}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
            filter === 'unread'
              ? 'bg-foreground/15 text-foreground'
              : 'text-foreground/70 hover:text-foreground'
          }`}
        >
          Unread ({unreadCount})
        </button>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            className="ml-auto text-xs text-foreground/60 hover:text-foreground transition-colors"
          >
            Mark all as read
          </button>
        )}
      </div>

      {/* Notifications List */}
      <div className="flex-1 overflow-y-auto space-y-3 min-h-0">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map(notification => (
            <NotificationCard
              key={notification.id}
              notification={notification}
              onMarkRead={handleMarkRead}
            />
          ))
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center space-y-2">
              <Bell size={32} className="mx-auto text-foreground/30" />
              <p className="text-sm text-foreground/60">
                {filter === 'unread' ? 'No unread notifications' : 'No notifications yet'}
              </p>
              <p className="text-xs text-foreground/40">
                {filter === 'unread' ? 'Check back later for updates' : 'You are all caught up!'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
