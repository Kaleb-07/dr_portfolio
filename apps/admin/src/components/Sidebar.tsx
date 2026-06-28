/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useMemo, useEffect } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import {
  BarChart3,
  ChevronDown,
  Crown,
  FolderTree,
  Home,
  Layers,
  Mail,
  Sparkles,
  Trophy,
  X,
} from 'lucide-react'

const navItems = [
  {
    label: 'Story',
    icon: Sparkles,
    children: [
      { label: 'The Visionary Agenda', path: '/story/vision-agenda' },
      { label: 'Career Timeline', path: '/story/career-timeline' },
      { label: 'The Liyana Healthcare Framework', path: '/story/liyana-framework' },
      { label: 'Foundation', path: '/story/foundation' },
      { label: 'Recognition & Awards', path: '/story/recognition-awards' },
      { label: 'Leadership Philosophy', path: '/story/leadership-philosophy' },
    ],
  },
  {
    label: 'Profile',
    icon: FolderTree,
    children: [
      { label: 'Journey', path: '/journey' },
      { label: 'Education', path: '/education' },
      { label: 'Gallery', path: '/gallery' },
    ],
  },
  { label: 'Ecosystem', icon: Layers, path: '/ecosystem' },
  {
    label: 'Impact',
    icon: Crown,
    children: [
      { label: 'Public Service', path: '/impact/public-service' },
      { label: 'Leadership', path: '/impact/leadership' },
      { label: 'Foundation', path: '/impact/foundation' },
    ],
  },
  {
    label: 'Achievements',
    icon: Trophy,
    children: [
      { label: 'Awards & Recognition', path: '/achievements' },
      { label: 'Media & Speaking', path: '/media' },
    ],
  },
  {
    label: 'Contact',
    icon: Mail,
    children: [
      { label: 'Contact Details', path: '/contact' },
      { label: 'Messages', path: '/contact-messages' },
    ],
  },
]

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(true)
  const [expandedMenus, setExpandedMenus] = useState<string[]>([])

  const location = useLocation()

  const autoExpandParents = useMemo(() => {
    const parents: string[] = []
    navItems.forEach((item) => {
      if (item.children?.some((child) => child.path === location.pathname)) {
        parents.push(item.label)
      }
    })
    return parents
  }, [location.pathname])

  useEffect(() => {
    setExpandedMenus((prev) => {
      const next = new Set([...prev, ...autoExpandParents])
      return Array.from(next)
    })
  }, [autoExpandParents])

  const toggleMenu = (label: string) => {
    setExpandedMenus((current) =>
      current.includes(label) ? current.filter((item) => item !== label) : [...current, label],
    )
  }

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 w-80 bg-white/95 backdrop-blur-2xl transition-transform duration-300 border-r border-slate-200/60 lg:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
      style={{ boxShadow: '0 20px 40px rgba(0, 0, 0, 0.08)' }}
    >
      <div className="flex h-full flex-col">
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

        <nav className="flex-1 space-y-2 overflow-y-auto px-6 py-8">
          {navItems.map((item) => {
            const Icon = item.icon
            const isExpanded = expandedMenus.includes(item.label)
            return item.children?.length ? (
              <div key={item.label}>
                <button
                  type="button"
                  onClick={() => toggleMenu(item.label)}
                  className="group w-full flex items-center justify-between gap-4 rounded-xl px-5 py-3.5 text-sm font-semibold text-slate-600 hover:bg-gradient-to-r hover:from-slate-100 hover:to-slate-50 hover:text-slate-900"
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
                    className={`transition-transform duration-300 opacity-50 ${isExpanded ? 'rotate-180' : ''}`}
                  />
                </button>
                {isExpanded && (
                  <div className="mt-2.5 space-y-2 pl-3">
                    {(item.children || []).map((child) => (
                      <NavLink
                        key={child.path}
                        to={child.path}
                        className={({ isActive }) =>
                          `block rounded-lg px-5 py-2.5 text-sm font-medium ${isActive ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'}`
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
                to={item.path || '/'}
                className={({ isActive }) =>
                  `flex items-center gap-4 rounded-xl px-5 py-3.5 text-sm font-semibold ${isActive ? 'bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-700 border border-emerald-200/50' : 'text-slate-600 hover:bg-gradient-to-r hover:from-slate-100 hover:to-slate-50 hover:text-slate-900'}`
                }
              >
                <Icon size={22} strokeWidth={1.5} className="opacity-70" />
                <span>{item.label}</span>
              </NavLink>
            )
          })}
        </nav>

        <div className="border-t border-slate-200/60 p-6 space-y-3">
          <NavLink
            to="/"
            className="flex items-center gap-4 rounded-xl px-5 py-3 text-xs font-semibold uppercase tracking-widest text-slate-600 transition-all duration-200 hover:bg-slate-100/60 hover:text-emerald-600 border border-transparent hover:border-slate-200"
          >
            <Home size={20} strokeWidth={1.5} />
            <span>Back to Site</span>
          </NavLink>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-4 rounded-xl px-5 py-3 text-xs font-semibold uppercase tracking-widest text-slate-600 lg:hidden"
          >
            <X size={20} strokeWidth={1.5} />
            <span>Close</span>
          </button>
        </div>
      </div>
    </aside>
  )
}
