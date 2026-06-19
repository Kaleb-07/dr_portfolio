import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { LanguageSelector } from '@/components/ui/LanguageSelector'


interface NavChildLink {
  label: string
  path: string
}

interface NavLink {
  label: string
  path?: string
  children?: NavChildLink[]
}

const navLinks: NavLink[] = [
  { label: 'Story', path: '/' },
  {
    label: 'Profile',
    children: [
      { label: 'Journey', path: '/about' },
      { label: 'Education', path: '/education' },
      { label: 'Gallery', path: '/gallery' },
    ],
  },
  { label: 'Ecosystem', path: '/ecosystem' },
  {
    label: 'Impact',
    children: [
      { label: 'Public Service', path: '/public-service' },
      { label: 'Leadership', path: '/leadership' },
      { label: 'Foundation', path: '/foundation' },
    ],
  },
  {
    label: 'Achievements',
    children: [
      { label: 'Awards & Recognition', path: '/awards-recognition' },
      { label: 'Media & Speaking', path: '/media-speaking' },
    ],
  },
  { label: 'Contact', path: '/contact' },
]

export default function Navbar() {
  const { pathname } = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [hoveredLink, setHoveredLink] = useState<string | null>(null)
  const [mobileSubmenuOpen, setMobileSubmenuOpen] = useState<Record<string, boolean>>({})
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  // Close menus on path change
  useEffect(() => {
    setMobileOpen(false)
    setActiveDropdown(null)
  }, [pathname])

  const toggleMobileSubmenu = (label: string) => {
    setMobileSubmenuOpen((prev) => ({
      ...prev,
      [label]: !prev[label],
    }))
  }

  // Animation variants for mobile menu stagger
  const mobileContainerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.04,
      },
    },
  }

  const mobileItemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring' as const, stiffness: 260, damping: 22 },
    },
  }

  const renderNavLink = (link: NavLink) => {
    if (link.children) {
      const isActive = link.children.some((child) => pathname === child.path)
      const isOpen = activeDropdown === link.label

      return (
        <div
          key={link.label}
          className="relative flex items-center h-full"
          onMouseEnter={() => {
            setActiveDropdown(link.label)
            setHoveredLink(link.label)
          }}
          onMouseLeave={() => {
            setActiveDropdown(null)
            setHoveredLink(null)
          }}
        >
          <button
            type="button"
            className={cn(
              'relative flex items-center gap-1 font-mono text-[length:var(--text-nav)] tracking-widest uppercase transition-colors duration-200 cursor-pointer h-full px-2',
              isActive ? 'text-teal font-medium' : 'text-ink-muted hover:text-teal',
              isOpen && 'text-teal'
            )}
          >
            {link.label}
            <ChevronDown
              size={12}
              className={cn('transition-transform duration-200', isOpen && 'rotate-180')}
            />
            {(hoveredLink === link.label || (isActive && hoveredLink === null)) && (
              <motion.div
                layoutId="navbar-underline"
                className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-teal"
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
          </button>

          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, y: 12, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 12, scale: 0.96 }}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="absolute left-1/2 -translate-x-1/2 top-full mt-0 w-56 bg-paper-card border border-rule shadow-lg p-1.5 flex flex-col z-50 rounded"
              >
                {link.children.map((child) => {
                  const isChildActive = pathname === child.path
                  return (
                    <Link
                      key={child.path}
                      to={child.path}
                      className={cn(
                        'px-3 py-2 text-xs font-sans tracking-wide rounded transition-colors duration-150',
                        isChildActive
                          ? 'text-teal bg-teal-light/50 font-medium'
                          : 'text-ink-mid hover:text-teal hover:bg-paper-warm'
                      )}
                    >
                      {child.label}
                    </Link>
                  )
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )
    }

    const isActive = pathname === link.path
    return (
      <div
        key={link.path}
        className="relative flex items-center h-full"
        onMouseEnter={() => setHoveredLink(link.label)}
        onMouseLeave={() => setHoveredLink(null)}
      >
        <Link
          to={link.path!}
          className={cn(
            'relative flex items-center font-mono text-[length:var(--text-nav)] tracking-widest uppercase transition-colors duration-200 h-full px-2',
            isActive ? 'text-teal font-medium' : 'text-ink-muted hover:text-teal'
          )}
        >
          {link.label}
          {(hoveredLink === link.label || (isActive && hoveredLink === null)) && (
            <motion.div
              layoutId="navbar-underline"
              className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-teal"
              transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            />
          )}
        </Link>
      </div>
    )
  }

  return (
    <>
    <header
      className={cn(
        'fixed top-0 z-50 transition-all duration-300',
        // Mobile style: full width, 16 height, standard background
        'w-full left-0 right-0 border-b border-rule h-16 bg-paper/95 backdrop-blur-md',
        // Desktop style: centered, bridge style, static background, dynamic height & shadow
        'lg:w-[90%] lg:max-w-6xl lg:left-1/2 lg:-translate-x-1/2 lg:rounded-b-2xl lg:border-x lg:border-b lg:border-rule lg:bg-paper-card',
        scrolled
          ? 'lg:shadow-md lg:h-14 lg:top-0'
          : 'lg:shadow-sm lg:h-16 lg:top-0'
      )}
    >
      <div className="mx-auto flex h-full items-center justify-between px-4 sm:px-6 lg:px-10 xl:px-16 relative">
        {/* Concave corners for bridge look (hidden on mobile, absolute top of header) */}
        <div className="absolute top-0 right-full w-4 h-4 bg-transparent rounded-tr-2xl shadow-[8px_-8px_0_8px_var(--color-paper-card)] pointer-events-none hidden lg:block" />
        <div className="absolute top-0 left-full w-4 h-4 bg-transparent rounded-tl-2xl shadow-[-8px_-8px_0_8px_var(--color-paper-card)] pointer-events-none hidden lg:block" />

        {/* Mobile Left: Logo */}
        <div className="flex lg:hidden items-center">
          <Link
            to="/"
            onClick={() => setMobileOpen(false)}
            className="font-serif text-base sm:text-lg font-medium text-ink"
          >
            Dr.<em className="text-teal not-italic"> Girma Ababi</em>
          </Link>
        </div>

        {/* Desktop Left Nav Links */}
        <div className="hidden lg:flex items-center gap-4 xl:gap-8 h-full justify-start flex-1">
          {navLinks.slice(0, 3).map((link) => renderNavLink(link))}
        </div>

        {/* Desktop Center Logo */}
        <div className="hidden lg:flex items-center justify-center shrink-0 mx-4 xl:mx-8">
          <Link
            to="/"
            className="font-serif text-base lg:text-lg font-medium text-ink transition-transform duration-200 hover:scale-[1.02]"
          >
            Dr.<em className="text-teal not-italic"> Girma Ababi</em>
          </Link>
        </div>

        {/* Desktop Right Nav Links */}
        <div className="hidden lg:flex items-center gap-4 xl:gap-8 h-full justify-end flex-1">
          {navLinks.slice(3, 5).map((link) => renderNavLink(link))}
          {/* Contact action button */}
          <Link to="/contact">
            <button
              type="button"
              className={cn(
                'font-mono text-[length:var(--text-nav)] tracking-widest uppercase transition-all duration-200 cursor-pointer px-4 py-2 rounded-full border border-teal text-teal hover:bg-teal hover:text-white active:bg-teal active:text-white active:scale-[0.97]',
                pathname === '/contact' && 'bg-teal text-white'
              )}
            >
              Contact
            </button>
          </Link>
          <LanguageSelector />
        </div>

        {/* Mobile menu toggle */}
        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="lg:hidden p-2 text-ink-muted hover:text-teal transition-colors cursor-pointer"
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

    </header>

    {/* Mobile Navigation — rendered OUTSIDE header to avoid stacking context clip */}
    <AnimatePresence>
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, x: '100%' }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: '100%' }}
          transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
          className="fixed inset-0 top-16 z-[48] bg-paper lg:hidden overflow-y-auto"
        >
          <motion.nav
            variants={mobileContainerVariants}
            initial="hidden"
            animate="show"
            className="flex flex-col items-center py-12 gap-8 px-6"
          >
            {navLinks.map((link) => {
              if (link.children) {
                const isOpen = !!mobileSubmenuOpen[link.label]
                const isActive = link.children.some((child) => pathname === child.path)

                return (
                  <motion.div key={link.label} variants={mobileItemVariants} className="w-full text-center">
                    <button
                      type="button"
                      onClick={() => toggleMobileSubmenu(link.label)}
                      className={cn(
                        'flex items-center justify-center gap-1.5 mx-auto font-mono text-sm tracking-widest uppercase transition-colors duration-200 cursor-pointer',
                        isActive ? 'text-teal' : 'text-ink-muted hover:text-teal'
                      )}
                    >
                      {link.label}
                      <ChevronDown
                        size={14}
                        className={cn('transition-transform duration-200', isOpen && 'rotate-180')}
                      />
                    </button>

                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2, ease: 'easeInOut' }}
                          className="overflow-hidden flex flex-col gap-4 mt-3 bg-paper-warm/40 py-4 px-2 rounded"
                        >
                          {link.children.map((child) => {
                            const isChildActive = pathname === child.path
                            return (
                              <Link
                                key={child.path}
                                to={child.path}
                                onClick={() => setMobileOpen(false)}
                                className={cn(
                                  'font-mono text-xs tracking-widest uppercase transition-colors duration-200',
                                  isChildActive ? 'text-teal font-medium' : 'text-ink-muted hover:text-teal'
                                )}
                              >
                                {child.label}
                              </Link>
                            )
                          })}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )
              }

              const isActive = pathname === link.path
              return (
                <motion.div key={link.path} variants={mobileItemVariants} className="w-full text-center">
                  <Link
                    to={link.path!}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      'font-mono text-sm tracking-widest uppercase transition-colors duration-200',
                      isActive ? 'text-teal' : 'text-ink-muted hover:text-teal'
                    )}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              )
            })}
            <motion.div variants={mobileItemVariants} className="mt-4 w-full flex justify-center">
              <LanguageSelector />
            </motion.div>
          </motion.nav>
        </motion.div>
      )}
    </AnimatePresence>
    </>
  )
}
