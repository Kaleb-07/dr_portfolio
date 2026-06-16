import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'

const footerLinks = [
  { label: 'Story', path: '/' },
  { label: 'Journey', path: '/about' },
  { label: 'Ecosystem', path: '/ecosystem' },
  { label: 'Public Service', path: '/public-service' },
  { label: 'Education', path: '/education' },
  { label: 'Foundation', path: '/foundation' },
  { label: 'Contact', path: '/contact' },
]

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-ink text-white">
      <div className="mx-auto max-w-6xl px-6 sm:px-12 lg:px-16 py-16 lg:py-20">
        <div className="flex flex-col items-center text-center">
          <Link to="/" className="font-serif italic text-2xl text-white">
            Dr. Liyana
          </Link>
          <p className="mt-3 text-xs tracking-widest uppercase opacity-35">
            Physician · Entrepreneur · Nation Builder · Philanthropist
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-2">
            {footerLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  'font-mono text-xs tracking-widest uppercase transition-colors duration-200',
                  'text-white/35 hover:text-teal'
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>
          <p className="mt-10 text-xs opacity-35">
            &copy; {year} Dr. Liyana · Liyana Healthcare · All Rights Reserved
          </p>
        </div>
      </div>
    </footer>
  )
}
