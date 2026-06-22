import { ArrowUpRight, Clock3, Crown, Sparkles, Trophy } from 'lucide-react'
import { Link } from 'react-router-dom'

const sections = [
  {
    title: 'Hero Section',
    description: 'Homepage identity, headline, CTA copy, and background imagery.',
    path: '/admin/hero',
    icon: Sparkles,
    accent: 'text-teal bg-teal-light',
  },
  {
    title: 'Awards',
    description: 'Recognition entries, ordering, and editorial highlights.',
    path: '/admin/awards',
    icon: Trophy,
    accent: 'text-gold bg-gold-light',
  },
  {
    title: 'Leadership',
    description: 'Executive profiles, leadership roles, and board content.',
    path: '/admin/leadership',
    icon: Crown,
    accent: 'text-teal bg-teal-light',
  },
  {
    title: 'Timeline',
    description: 'Milestones, career history, and dated story beats.',
    path: '/admin/timeline',
    icon: Clock3,
    accent: 'text-gold bg-gold-light',
  },
]

export default function Dashboard() {
  return (
    <section className="mx-auto max-w-6xl">
      <div className="mb-8 flex flex-col justify-between gap-4 border-b border-rule pb-7 md:flex-row md:items-end">
        <div>
          <p className="section-tag">Dashboard</p>
          <h1 className="mt-3 font-serif text-4xl font-light text-ink sm:text-5xl">CMS Sections</h1>
        </div>
        <p className="max-w-xl text-sm font-light leading-relaxed text-ink-mid">
          Choose a content area to edit the portfolio pages from one focused workspace.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {sections.map((section) => {
          const Icon = section.icon

          return (
            <Link
              key={section.title}
              to={section.path}
              className="group flex min-h-64 flex-col justify-between border border-rule bg-paper-card p-5 transition-colors hover:bg-paper-warm"
            >
              <div>
                <div className={`mb-7 flex h-12 w-12 items-center justify-center ${section.accent}`}>
                  <Icon size={20} />
                </div>
                <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-muted">Editor</p>
                <h2 className="mt-3 font-serif text-3xl font-light text-ink">{section.title}</h2>
                <p className="mt-4 text-sm font-light leading-relaxed text-ink-mid">{section.description}</p>
              </div>

              <div className="mt-8 flex items-center justify-between border-t border-rule pt-4">
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-teal">Open</span>
                <ArrowUpRight size={18} className="text-ink-muted transition-colors group-hover:text-teal" />
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
