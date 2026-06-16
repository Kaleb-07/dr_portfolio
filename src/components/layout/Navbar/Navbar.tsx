import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'

const navLinks = [
  { label: 'Story', path: '/' },
  { label: 'Journey', path: '/about' },
  { label: 'Ecosystem', path: '/ecosystem' },
  { label: 'Public Service', path: '/public-service' },
  { label: 'Education', path: '/education' },
  { label: 'Foundation', path: '/foundation' },
  { label: 'Contact', path: '/contact' },
]

export default function Navbar() {
  const { pathname } = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50',
        'bg-paper/92 backdrop-blur-md',
        'border-b border-rule',
        'h-16'
      )}
    >
      <div className="mx-auto flex h-full items-center justify-between px-6 sm:px-12 lg:px-16">
        <Link
          to="/"
          onClick={() => setMobileOpen(false)}
          className="font-serif text-lg font-medium text-ink"
        >
          Dr.<em className="text-teal">Liyana</em>
        </Link>

        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = pathname === link.path
            return (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  'font-mono text-xs tracking-widest uppercase transition-colors duration-200',
                  isActive ? 'text-teal' : 'text-ink-muted hover:text-teal'
                )}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>

        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="lg:hidden p-2 text-ink-muted hover:text-teal transition-colors"
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            className="fixed inset-0 top-16 z-40 bg-paper lg:hidden"
          >
            <nav className="flex flex-col items-center justify-center h-full gap-6 px-4">
              {navLinks.map((link) => {
                const isActive = pathname === link.path
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      'font-mono text-sm tracking-widest uppercase transition-colors duration-200',
                      isActive ? 'text-teal' : 'text-ink-muted hover:text-teal'
                    )}
                  >
                    {link.label}
                  </Link>
                )
              })}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
