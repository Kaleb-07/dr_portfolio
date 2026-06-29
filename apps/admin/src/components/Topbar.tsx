import { Bell, ChevronDown } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useNotifications } from './NotificationContext'
import ProfileModal from './ProfileModal'
import api from '../api'

export function Topbar() {
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [profileModalOpen, setProfileModalOpen] = useState(false)

  const [adminName, setAdminName] = useState('Admin User')
  const [adminEmail, setAdminEmail] = useState('admin@example.com')

  const navigate = useNavigate()
  const { unreadCount } = useNotifications()

  // Load admin data from backend on mount
  useEffect(() => {
    let active = true
    const fetchProfile = async () => {
      try {
        const res = await api.get('/auth/profile')
        if (active && res.data) {
          setAdminName(res.data.name || res.data.email || 'Admin User')
          setAdminEmail(res.data.email || 'admin@example.com')
        }
      } catch {
        // keep current state
      }
    }
    fetchProfile()
    return () => {
      active = false
    }
  }, [])

  const handleProfileUpdate = (name: string, email: string) => {
    setAdminName(name)
    setAdminEmail(email)
  }

  return (
    <>
      <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-end px-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/contact-messages')}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative"
            title="View messages"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          <div className="relative pl-4 border-l border-gray-200">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 py-1 px-1 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center text-white font-semibold">
                {adminName.charAt(0).toUpperCase()}
              </div>
              <ChevronDown size={16} className="text-gray-400" />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-700">{adminName}</p>
                  <p className="text-xs text-gray-500">{adminEmail}</p>
                </div>
                <button
                  onClick={() => {
                    setShowUserMenu(false)
                    setProfileModalOpen(true)
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Edit Profile
                </button>
                <button
                  onClick={() => {
                    localStorage.removeItem('token')
                    window.location.reload()
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <ProfileModal
        open={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        currentName={adminName}
        currentEmail={adminEmail}
        onProfileUpdate={handleProfileUpdate}
      />
    </>
  )
}
