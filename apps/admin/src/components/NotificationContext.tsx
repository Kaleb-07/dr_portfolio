import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import api from '../api'

interface NotificationContextType {
  unreadCount: number
  refreshUnreadCount: () => void
}

const NotificationContext = createContext<NotificationContextType>({
  unreadCount: 0,
  refreshUnreadCount: () => {},
})

export const useNotifications = () => useContext(NotificationContext)

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [unreadCount, setUnreadCount] = useState(0)

  const fetchUnreadCount = useCallback(async () => {
    try {
      const res = await api.get('/contact/messages')
      const messages = res.data || []
      const saved = localStorage.getItem('luxury_messages_read_status')
      const readSet: Set<number> = saved ? new Set(JSON.parse(saved)) : new Set()
      const unread = messages.filter((m: { id: number }) => !readSet.has(m.id)).length
      setUnreadCount(unread)
    } catch {
      // silently fail
    }
  }, [])

  useEffect(() => {
    fetchUnreadCount()
  }, [fetchUnreadCount])

  return (
    <NotificationContext.Provider value={{ unreadCount, refreshUnreadCount: fetchUnreadCount }}>
      {children}
    </NotificationContext.Provider>
  )
}
