import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import {
  FaLinkedinIn,
  FaXTwitter,
  FaInstagram,
  FaFacebook,
  FaLocationDot,
  FaPhone,
  FaEnvelope,
} from 'react-icons/fa6'
import { footerSections } from '@/constants/navigation'
import { Container } from '@/components/shared'

const TAGLINE = 'Physician · Entrepreneur · Nation Builder · Philanthropist'

const socialLinks = [
  { icon: FaLinkedinIn, label: 'LinkedIn',    href: '#' },
  { icon: FaXTwitter,   label: 'X / Twitter', href: '#' },
  { icon: FaInstagram,  label: 'Instagram',   href: '#' },
  { icon: FaFacebook,   label: 'Facebook',    href: '#' },
]

const contactInfo = [
  { icon: FaLocationDot, text: 'Addis Ababa, Ethiopia' },
  { icon: FaPhone,       text: '+251 911 000 000' },
  { icon: FaEnvelope,    text: 'info@liyanahealthcare.com' },
]

export default function Footer() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const year = new Date().getFullYear()

  return (
    <footer ref={ref} className="bg-ink text-white relative overflow-hidden">

      {/* ── Ambient background glows ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.6 }}
          animate={inView ? { opacity: 0.08, scale: 1.2 } : {}}
          transition={{ duration: 2.5, ease: 'easeOut' }}
          className="absolute -top-20 right-1/4 w-[500px] h-[500px] rounded-full blur-[130px] bg-teal"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.6 }}
          animate={inView ? { opacity: 0.06, scale: 1 } : {}}
          transition={{ duration: 3, ease: 'easeOut', delay: 0.4 }}
          className="absolute bottom-0 -left-20 w-[400px] h-[400px] rounded-full blur-[120px] bg-gold-light"
        />
      </div>

      {/* ── Gold top accent line ── */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={inView ? { scaleX: 1 } : {}}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        className="h-px bg-gradient-to-r from-transparent via-gold to-transparent origin-left"
      />

      {/* ══════════════════════════════════════════════
          CTA SECTION
      ══════════════════════════════════════════════ */}
      <div className="relative border-b border-white/8 py-14 lg:py-18">
        <Container className="relative z-10">
          <div className="text-center max-w-3xl mx-auto">

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="section-header justify-center mb-6"
            >
              <span className="section-rule !bg-white/10" />
              <span className="section-tag">Let's Connect</span>
              <span className="section-rule !bg-white/10" />
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.75, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
              className="font-serif text-4xl md:text-5xl lg:text-6xl font-light text-white mb-5 leading-[1.15]"
            >
              Let's build the future of{' '}
              <em className="text-teal-mid not-italic">healthcare</em> together.
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.28 }}
              className="text-sm font-light text-white/45 max-w-md mx-auto mb-8 leading-relaxed"
            >
              Open to partnerships, speaking engagements, media collaborations, and foundation inquiries.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.38 }}
            >
              <Link
                to="/contact"
                className="inline-flex items-center gap-3 border border-white/20 px-8 py-3.5 font-mono text-xs tracking-widest uppercase text-white/70 hover:border-teal hover:text-teal hover:bg-teal/5 transition-all duration-300 group"
              >
                Get in Touch
                <span className="w-4 h-px bg-white/40 group-hover:w-6 group-hover:bg-teal transition-all duration-300" />
              </Link>
            </motion.div>

          </div>
        </Container>
      </div>

      {/* ══════════════════════════════════════════════
          NAVIGATION GRID
          Connect column gets contact info appended below its links
      ══════════════════════════════════════════════ */}
      <div className="relative py-12 border-b border-white/8">
        <Container className="relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 lg:gap-16">
            {footerSections.map((section, colIndex) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.55, delay: 0.3 + colIndex * 0.08, ease: [0.22, 1, 0.36, 1] }}
              >
                {/* Column title */}
                <div className="flex items-center gap-3 mb-5">
                  <p className="font-mono text-xs tracking-[0.25em] uppercase text-gold shrink-0">
                    {section.title}
                  </p>
                  <div className="h-px flex-1 bg-white/8" />
                </div>

                {/* Nav links */}
                <ul className="space-y-3">
                  {section.links.map((link, linkIndex) => (
                    <motion.li
                      key={link.path}
                      initial={{ opacity: 0, x: -8 }}
                      animate={inView ? { opacity: 1, x: 0 } : {}}
                      transition={{ duration: 0.4, delay: 0.4 + colIndex * 0.08 + linkIndex * 0.05 }}
                    >
                      <Link
                        to={link.path}
                        className="font-sans text-sm font-light text-white/35 hover:text-white expanding-line pb-0.5 transition-colors duration-200"
                      >
                        {link.label}
                      </Link>
                    </motion.li>
                  ))}
                </ul>

                {/* Contact info — appended only under the Connect column */}
                {section.title === 'Connect' && (
                  <ul className="mt-6 space-y-3 border-t border-white/8 pt-5">
                    {contactInfo.map(({ icon: Icon, text }, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -8 }}
                        animate={inView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.4, delay: 0.6 + i * 0.06 }}
                        className="flex items-start gap-2.5"
                      >
                        <Icon className="text-teal mt-0.5 shrink-0" size={12} />
                        <span className="text-sm font-light text-white/40 leading-snug">
                          {text}
                        </span>
                      </motion.li>
                    ))}
                  </ul>
                )}
              </motion.div>
            ))}
          </div>
        </Container>
      </div>

      {/* ══════════════════════════════════════════════
          BOTTOM BAR
      ══════════════════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.6, delay: 0.65 }}
        className="relative py-5"
      >
        <Container className="relative z-10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-5">

            {/* Logo + tagline */}
            <div className="flex flex-col items-center sm:items-start gap-1">
              <Link
                to="/"
                className="font-serif italic text-xl text-white/80 hover:text-white transition-colors duration-200"
              >
                Dr. Girma Ababi
              </Link>
              <p className="font-mono text-xs tracking-[0.15em] uppercase text-white/40">
                {TAGLINE}
              </p>
            </div>

            {/* Social icons */}
            <div className="flex items-center gap-3">
              {socialLinks.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 border border-white/10 flex items-center justify-center text-white/30 hover:border-teal hover:text-teal hover:bg-teal/5 transition-all duration-300"
                >
                  <Icon size={13} />
                </a>
              ))}
            </div>

            <p className="font-mono text-xs tracking-widest uppercase text-white/40">
              &copy; {year} All Rights Reserved
            </p>

          </div>
        </Container>
      </motion.div>

    </footer>
  )
}
