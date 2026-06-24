import {
  BarChart3,
  ChevronDown,
  Crown,
  FolderTree,
  Home,
  Layers,
  LogOut,
  Mail,
  Menu,
  Sparkles,
  Trophy,
  X,
} from 'lucide-react'
import { useState } from 'react'
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom'

const navItems = [
  {
    label: 'Story',
    icon: Sparkles,
    children: [
      { label: 'The Visionary Agenda', path: '/admin/story/vision-agenda' },
      { label: 'Career Timeline', path: '/admin/story/career-timeline' },
      { label: 'The Liyana Healthcare Framework', path: '/admin/story/liyana-framework' },
      { label: 'Foundation', path: '/admin/story/foundation' },
      { label: 'Recognition & Awards', path: '/admin/story/recognition-awards' },
      { label: 'Leadership Philosophy', path: '/admin/story/leadership-philosophy' },
      { label: 'Testimonials', path: '/admin/story/testimonials' },
    ],
  },
  {
    label: 'Profile',
    icon: FolderTree,
    children: [
      { label: 'Journey', path: '/admin/profile/journey' },
      { label: 'Education', path: '/admin/profile/education' },
      { label: 'Gallery', path: '/admin/profile/gallery' },
    ],
  },
  {
    label: 'Ecosystem',
    icon: Layers,
    children: [
      { label: 'Network', path: '/admin/ecosystem' },
      { label: 'Vision', path: '/admin/ecosystem/vision' },
      { label: 'Breakdown', path: '/admin/ecosystem/breakdown' },
    ],
  },
  {
    label: 'Impact',
    icon: Crown,
    children: [
      { label: 'Public Service', path: '/admin/impact/public-service' },
      { label: 'Leadership', path: '/admin/impact/leadership' },
      { label: 'Foundation', path: '/admin/impact/foundation' },
    ],
  },
  {
    label: 'Achievements',
    icon: Trophy,
    children: [
      { label: 'Awards & Recognition', path: '/admin/achievements/awards' },
      { label: 'Media & Speaking', path: '/admin/achievements/media' },
    ],
  },
  {
    label: 'Contact',
    icon: Mail,
    children: [
      { label: 'Contact Details', path: '/admin/contact' },
      { label: 'Messages', path: '/admin/contact/messages' },
    ],
  },
]

export default function AdminLayout() {
  const [isOpen, setIsOpen] = useState(false)
  const [expandedMenus, setExpandedMenus] = useState(['Story'])
  const location = useLocation()
  const navigate = useNavigate()

  const logout = () => {
    localStorage.removeItem('token')
    navigate('/admin/login')
  }

  // Removed type annotations: (item) instead of (item: any)
  const isMenuActive = (item) => {
    if (item.path && location.pathname === item.path) return true
    if (item.children) {
      return item.children.some((child) => location.pathname.startsWith(child.path))
    }
    return false
  }

  // Removed type annotation: (label) instead of (label: string)
  const toggleMenu = (label) => {
    setExpandedMenus((current) =>
      current.includes(label) ? current.filter((item) => item !== label) : [...current, label],
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{
          boxShadow: isOpen ? '8px 0 32px rgba(0, 0, 0, 0.08)' : 'none',
        }}
      >
        <div className="flex h-full flex-col">
          {/* Sidebar Header */}
          <div className="px-6 py-8">
            <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 text-white shadow-lg">
              <BarChart3 size={20} />
            </div>
            <p className="text-xs font-semibold uppercase tracking-wider text-teal-600">CMS</p>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">Admin</h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
            {navItems.map((item) => {
              const Icon = item.icon
              const activeMenu = isMenuActive(item)

              return item.children ? (
                <div key={item.label}>
                  <button
                    type="button"
                    onClick={() => toggleMenu(item.label)}
                    className={`group flex w-full items-center justify-between gap-3 rounded-lg px-4 py-3 text-sm font-semibold transition-all duration-200 ${
                      activeMenu
                        ? 'bg-teal-50 text-teal-700'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <span className="inline-flex items-center gap-3">
                      <Icon size={18} strokeWidth={1.5} />
                      {item.label}
                    </span>
                    <ChevronDown
                      size={16}
                      className={`transition-transform duration-300 ${expandedMenus.includes(item.label) ? 'rotate-180' : ''}`}
                    />
                  </button>

                  {expandedMenus.includes(item.label) && (
                    <div className="mt-2 space-y-1 overflow-y-auto pl-2">
                      {item.children.map((child) => (
                        <NavLink
                          key={child.path}
                          to={child.path}
                          onClick={() => setIsOpen(false)}
                          className={({ isActive }) =>
                            `block rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
                              isActive
                                ? 'bg-teal-500 text-white shadow-md shadow-teal-500/20'
                                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                            }`
                          }
                        >
                          {child.label}
                        </NavLink>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <NavLink
                  key={item.label}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold transition-all duration-200 ${
                      isActive
                        ? 'bg-teal-50 text-teal-700'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`
                  }
                >
                  <Icon size={18} strokeWidth={1.5} />
                  <span>{item.label}</span>
                </NavLink>
              )
            })}
          </nav>

          {/* Sidebar Footer */}
          <div className="border-t border-slate-200 p-4">
            <NavLink
              to="/"
              className="flex items-center gap-3 rounded-lg px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-600 transition-all duration-200 hover:bg-slate-100 hover:text-slate-900"
            >
              <Home size={16} strokeWidth={1.5} />
              <span>Public Site</span>
            </NavLink>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isOpen && (
        <button
          type="button"
          aria-label="Close admin menu"
          className="fixed inset-0 z-30 bg-black/20 transition-opacity duration-300 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Header */}
        <header
          className="sticky top-0 z-20 bg-white/80 backdrop-blur-xl"
          style={{
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
          }}
        >
          <div className="flex min-h-16 items-center justify-between gap-4 px-6 sm:px-8">
            <div className="flex items-center gap-4">
              <button
                type="button"
                aria-label="Open admin menu"
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-600 transition-all duration-200 hover:bg-slate-200 lg:hidden"
                onClick={() => setIsOpen(true)}
              >
                <Menu size={20} strokeWidth={1.5} />
              </button>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Content Management
                </p>
                <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">Portfolio CMS</h2>
              </div>
            </div>

            <button
              type="button"
              onClick={logout}
              className="inline-flex items-center gap-2 rounded-lg bg-slate-100 px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-slate-600 transition-all duration-200 hover:bg-slate-200 hover:text-slate-900"
            >
              <LogOut size={16} strokeWidth={1.5} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </header>

        {/* Main */}
        <main className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-slate-50 to-slate-100 px-6 py-8 sm:px-8 lg:px-10">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
