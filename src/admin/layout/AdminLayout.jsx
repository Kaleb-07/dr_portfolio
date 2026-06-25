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
    path: '/admin/ecosystem',
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
  const [expandedMenus, setExpandedMenus] = useState([])
  const location = useLocation()
  const navigate = useNavigate()

  const logout = () => {
    localStorage.removeItem('token')
    navigate('/admin/login')
  }

  const isMenuActive = (item) => {
    if (item.path && location.pathname === item.path) return true
    if (item.children) {
      return item.children.some((child) => location.pathname.startsWith(child.path))
    }
    return false
  }

  const toggleMenu = (label) => {
    setExpandedMenus((current) =>
      current.includes(label) ? current.filter((item) => item !== label) : [...current, label],
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-slate-100 text-slate-900">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-80 bg-white/95 backdrop-blur-2xl transition-transform duration-300 border-r border-slate-200/60 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.08)',
        }}
      >
        <div className="flex h-full flex-col">
          {/* Sidebar Header */}
          <div className="px-8 py-10 border-b border-slate-200/60">
            <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600 text-white shadow-xl shadow-emerald-500/20">
              <BarChart3 size={28} strokeWidth={1.8} />
            </div>
            <p className="text-xs font-bold uppercase tracking-widest text-emerald-600 mt-4">
              Dashboard
            </p>
            <h1 className="mt-2 text-4xl font-light tracking-tight text-slate-900">Admin</h1>
            <p className="text-sm text-slate-500 mt-3 font-medium">Manage your portfolio</p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-2 overflow-y-auto px-6 py-8">
            {navItems.map((item) => {
              const Icon = item.icon
              const activeMenu = isMenuActive(item)
              const isExpanded = expandedMenus.includes(item.label)

              return item.children ? (
                <div key={item.label}>
                  <button
                    type="button"
                    onClick={() => toggleMenu(item.label)}
                    className={`group w-full flex items-center justify-between gap-4 rounded-xl px-5 py-3.5 text-sm font-semibold transition-all duration-200 ${
                      activeMenu
                        ? 'bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-700 border border-emerald-200/50 shadow-sm shadow-emerald-100/50'
                        : 'text-slate-600 hover:bg-gradient-to-r hover:from-slate-100 hover:to-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <span className="inline-flex items-center gap-4">
                      <Icon
                        size={22}
                        strokeWidth={1.5}
                        className="opacity-70 group-hover:opacity-90 transition-opacity"
                      />
                      <span>{item.label}</span>
                    </span>
                    <ChevronDown
                      size={18}
                      className={`transition-transform duration-300 opacity-50 group-hover:opacity-70 ${
                        isExpanded ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {isExpanded && (
                    <div className="mt-2.5 space-y-2 overflow-y-auto pl-3 animate-in fade-in slide-in-from-top-2 duration-200">
                      {item.children.map((child) => (
                        <NavLink
                          key={child.path}
                          to={child.path}
                          onClick={() => setIsOpen(false)}
                          className={({ isActive }) =>
                            `block rounded-lg px-5 py-2.5 text-sm font-medium transition-all duration-200 relative ${
                              isActive
                                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md shadow-emerald-500/20 border-l-3 border-emerald-700'
                                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
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
                    `flex items-center gap-4 rounded-xl px-5 py-3.5 text-sm font-semibold transition-all duration-200 ${
                      isActive
                        ? 'bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-700 border border-emerald-200/50 shadow-sm shadow-emerald-100/50'
                        : 'text-slate-600 hover:bg-gradient-to-r hover:from-slate-100 hover:to-slate-50 hover:text-slate-900'
                    }`
                  }
                >
                  <Icon size={22} strokeWidth={1.5} className="opacity-70" />
                  <span>{item.label}</span>
                </NavLink>
              )
            })}
          </nav>

          {/* Sidebar Footer */}
          <div className="border-t border-slate-200/60 p-6 space-y-3">
            <NavLink
              to="/"
              className="flex items-center gap-4 rounded-xl px-5 py-3 text-xs font-semibold uppercase tracking-widest text-slate-600 transition-all duration-200 hover:bg-slate-100/60 hover:text-emerald-600 border border-transparent hover:border-slate-200"
            >
              <Home size={20} strokeWidth={1.5} />
              <span>Back to Site</span>
            </NavLink>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isOpen && (
        <button
          type="button"
          aria-label="Close admin menu"
          className="fixed inset-0 z-30 bg-black/15 backdrop-blur-sm transition-opacity duration-300 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="lg:pl-80">
        {/* Header */}
        <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-2xl border-b border-slate-200/60">
          <div className="flex min-h-20 items-center justify-between gap-6 px-8 sm:px-10">
            <div className="flex items-center gap-6">
              <button
                type="button"
                aria-label="Open admin menu"
                className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-slate-100 to-slate-50 text-slate-600 transition-all duration-200 hover:bg-gradient-to-br hover:from-emerald-100 hover:to-teal-50 hover:text-emerald-600 hover:shadow-md hover:shadow-emerald-100/50 lg:hidden border border-slate-200/60"
                onClick={() => setIsOpen(true)}
              >
                <Menu size={22} strokeWidth={1.8} />
              </button>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-emerald-600">
                  Content Management
                </p>
                <h2 className="text-2xl font-light text-slate-900 sm:text-2xl tracking-tight mt-1">
                  Portfolio CMS
                </h2>
              </div>
            </div>

            <button
              type="button"
              onClick={logout}
              className="inline-flex items-center gap-3 rounded-xl bg-gradient-to-r from-red-50 to-rose-50 px-6 py-3 text-xs font-bold uppercase tracking-wider text-red-600 transition-all duration-200 border border-red-200/60 hover:bg-gradient-to-r hover:from-red-100 hover:to-rose-100 hover:border-red-300/80 hover:text-red-700 hover:shadow-md hover:shadow-red-100/50"
            >
              <LogOut size={18} strokeWidth={2} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="min-h-[calc(100vh-80px)] bg-gradient-to-br from-white via-slate-50 to-slate-100/50 px-8 py-10 sm:px-10 lg:px-12">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
