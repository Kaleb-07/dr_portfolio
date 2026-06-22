import { BarChart3, ChevronDown, Crown, FolderTree, Home, Layers, LogOut, Mail, Menu, Sparkles, Trophy } from 'lucide-react'
import { useState } from 'react'
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom'

const navItems = [
  {
    label: 'Story',
    icon: Sparkles,
    children: [
      { label: 'The Visionary Agenda', path: '/admin/story/vision-agenda' },
      { label: 'Career Timeline', path: '/admin/story/career-timeline' },
      { label: 'Liyana Healthcare', path: '/admin/story/liyana-healthcare' },
      { label: 'Foundation', path: '/admin/story/foundation' },
      { label: 'Recognition', path: '/admin/story/recognition' },
      { label: 'Leadership Philosophy', path: '/admin/story/leadership-philosophy' },
      { label: 'Testimonials', path: '/admin/story/testimonials' },
      { label: 'Connect', path: '/admin/story/connect' },
      { label: 'Footer', path: '/admin/story/footer' },
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
  { label: 'Ecosystem', path: '/admin/ecosystem', icon: Layers },
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
  { label: 'Contact', path: '/admin/contact', icon: Mail },
]

export default function AdminLayout() {
  const [isOpen, setIsOpen] = useState(false)
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

  const [expandedMenus, setExpandedMenus] = useState(['Story'])

  return (
    <div className="min-h-screen bg-paper text-ink">
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-72 border-r border-rule bg-paper-card transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-full flex-col">
          <div className="border-b border-rule px-6 py-6">
            <div className="mb-5 flex h-11 w-11 items-center justify-center border border-rule bg-paper">
              <BarChart3 size={19} className="text-teal" />
            </div>
            <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-teal">CMS Workspace</p>
            <h1 className="mt-2 font-serif text-3xl font-light text-ink">Admin Panel</h1>
          </div>

          <nav className="flex-1 px-3 py-5">
            {navItems.map((item) => {
              const Icon = item.icon
              const activeMenu = isMenuActive(item)

              return item.children ? (
                <div key={item.label} className="mb-1">
                  <button
                    type="button"
                    onClick={() => toggleMenu(item.label)}
                    className={`group flex w-full items-center justify-between gap-3 border border-transparent px-4 py-3 font-sans text-[13px] font-medium uppercase tracking-[0.12em] transition-colors ${
                      activeMenu
                        ? 'border-rule bg-teal-light text-teal'
                        : 'text-ink-mid hover:border-rule hover:bg-paper-warm hover:text-ink'
                    }`}
                  >
                    <span className="inline-flex items-center gap-3">
                      <Icon size={17} />
                      {item.label}
                    </span>
                    <ChevronDown size={15} className={`transition-transform ${expandedMenus.includes(item.label) ? 'rotate-180' : ''}`} />
                  </button>
                  {expandedMenus.includes(item.label) && (
                    <div className="mt-2 space-y-1 rounded-xl border border-rule bg-paper-card p-2 shadow-sm">
                      {item.children.map((child) => (
                        <NavLink
                          key={child.path}
                          to={child.path}
                          onClick={() => setIsOpen(false)}
                          className={({ isActive }) =>
                            `flex items-center gap-2 rounded-lg px-4 py-3 text-sm transition-colors ${
                              isActive ? 'bg-teal text-white' : 'text-ink-mid hover:bg-paper-warm hover:text-ink'
                            }`
                          }
                        >
                          <span className="h-2.5 w-2.5 rounded-full bg-ink-muted" />
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
                    `mb-1 flex items-center gap-3 border border-transparent px-4 py-3 font-sans text-[13px] font-medium uppercase tracking-[0.12em] transition-colors ${
                      isActive
                        ? 'border-rule bg-teal-light text-teal'
                        : 'text-ink-mid hover:border-rule hover:bg-paper-warm hover:text-ink'
                    }`
                  }
                >
                  <Icon size={17} />
                  <span>{item.label}</span>
                </NavLink>
              )
            })}
          </nav>

          <div className="border-t border-rule p-4">
            <NavLink
              to="/"
              className="flex items-center gap-3 px-4 py-3 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-muted transition-colors hover:bg-paper-warm hover:text-ink"
            >
              <Home size={16} />
              Public Site
            </NavLink>
          </div>
        </div>
      </aside>

      {isOpen && (
        <button
          type="button"
          aria-label="Close admin menu"
          className="fixed inset-0 z-30 bg-ink/30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div className="lg:pl-72">
        <header className="sticky top-0 z-20 border-b border-rule bg-paper/95 backdrop-blur">
          <div className="flex min-h-20 items-center justify-between gap-4 px-5 sm:px-8">
            <div className="flex items-center gap-4">
              <button
                type="button"
                aria-label="Open admin menu"
                className="inline-flex h-10 w-10 items-center justify-center border border-rule bg-paper-card text-ink transition-colors hover:bg-paper-warm lg:hidden"
                onClick={() => setIsOpen(true)}
              >
                <Menu size={18} />
              </button>
              <div>
                <p className="font-mono text-[9px] uppercase tracking-[0.24em] text-ink-muted">Content Management</p>
                <h2 className="font-serif text-2xl font-light text-ink sm:text-3xl">Portfolio CMS</h2>
              </div>
            </div>

            <button
              type="button"
              onClick={logout}
              className="inline-flex items-center gap-2 border border-rule bg-paper-card px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-mid transition-colors hover:bg-paper-warm hover:text-ink"
            >
              <LogOut size={15} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </header>

        <main className="px-5 py-8 sm:px-8 lg:px-10">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
