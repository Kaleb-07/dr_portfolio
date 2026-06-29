import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react'
import api from '../api'

interface NotificationContextType {
  unreadCount: number
  refreshUnreadCount: () => void
}

const NotificationContext = createContext<NotificationContextType>({
  unreadCount: 0,
  refreshUnreadCount: () => {},
})

// eslint-disable-next-line react-refresh/only-export-components
export const useNotifications = () => useContext(NotificationContext)

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [unreadCount, setUnreadCount] = useState(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const refreshUnreadCount = useCallback(async () => {
    try {
      const res = await api.get('/contact/messages/unread-count')
      setUnreadCount(res.data.count || 0)
    } catch (error) {
      console.error('Failed to fetch unread count:', error)
    }
  }, [])

  // Initial fetch (does not call refreshUnreadCount to avoid sync setState warning)
  useEffect(() => {
    api
      .get('/contact/messages/unread-count')
      .then((res) => setUnreadCount(res.data.count || 0))
      .catch((err) => console.error('Failed to fetch unread count:', err))
  }, [])

  // Polling every 5 seconds
  useEffect(() => {
    intervalRef.current = setInterval(refreshUnreadCount, 5000)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [refreshUnreadCount])

  return (
    <NotificationContext.Provider value={{ unreadCount, refreshUnreadCount }}>
      {children}
    </NotificationContext.Provider>
  )
}
