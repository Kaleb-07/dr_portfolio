import { ArrowUpRight, Clock3, Crown, Sparkles, Trophy, Zap } from 'lucide-react'
import { Link } from 'react-router-dom'

const sections = [
  {
    title: 'Hero Section',
    description: 'Homepage identity, headline, CTA copy, and background imagery.',
    path: '/admin/hero',
    icon: Sparkles,
    accent: 'from-emerald-500 to-teal-500',
    bgAccent: 'from-emerald-50 to-teal-50',
    count: '12',
    label: 'Assets',
  },
  {
    title: 'Awards',
    description: 'Recognition entries, ordering, and editorial highlights.',
    path: '/admin/awards',
    icon: Trophy,
    accent: 'from-amber-500 to-yellow-500',
    bgAccent: 'from-amber-50 to-yellow-50',
    count: '24',
    label: 'Awards',
  },
  {
    title: 'Leadership',
    description: 'Executive profiles, leadership roles, and board content.',
    path: '/admin/leadership',
    icon: Crown,
    accent: 'from-purple-500 to-pink-500',
    bgAccent: 'from-purple-50 to-pink-50',
    count: '8',
    label: 'Profiles',
  },
  {
    title: 'Timeline',
    description: 'Milestones, career history, and dated story beats.',
    path: '/admin/timeline',
    icon: Clock3,
    accent: 'from-blue-500 to-cyan-500',
    bgAccent: 'from-blue-50 to-cyan-50',
    count: '18',
    label: 'Events',
  },
]

export default function Dashboard() {
  return (
    <section className="mx-auto max-w-7xl">
      {/* Header Section */}
      <div className="mb-12">
        <div className="mb-6 flex items-center gap-3">
          <div className="h-1 w-12 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500"></div>
          <p className="text-xs font-bold uppercase tracking-widest text-emerald-600">Dashboard</p>
        </div>

        <div className="mb-8">
          <h1 className="text-5xl font-light tracking-tight text-slate-900 mb-4">CMS Sections</h1>
          <p className="max-w-2xl text-lg font-light leading-relaxed text-slate-600">
            Choose a content area to edit the portfolio pages from one focused workspace.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200/50 p-6">
            <p className="text-xs font-bold uppercase tracking-widest text-emerald-600 mb-2">
              Total Items
            </p>
            <p className="text-4xl font-light text-slate-900">62</p>
          </div>
          <div className="rounded-2xl bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-200/50 p-6">
            <p className="text-xs font-bold uppercase tracking-widest text-amber-600 mb-2">
              Sections
            </p>
            <p className="text-4xl font-light text-slate-900">4</p>
          </div>
          <div className="rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200/50 p-6">
            <p className="text-xs font-bold uppercase tracking-widest text-purple-600 mb-2">
              Last Updated
            </p>
            <p className="text-sm font-light text-slate-600 mt-2">Today</p>
          </div>
          <div className="rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200/50 p-6">
            <p className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-2">Status</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse"></span>
              <p className="text-sm font-medium text-slate-900">Active</p>
            </div>
          </div>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {sections.map((section) => {
          const Icon = section.icon

          return (
            <Link
              key={section.title}
              to={section.path}
              className="group relative overflow-hidden rounded-2xl border border-slate-200/60 bg-white/70 backdrop-blur-lg transition-all duration-300 hover:border-slate-300 hover:shadow-xl hover:shadow-slate-200/50"
            >
              {/* Background Gradient Accent */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${section.bgAccent} opacity-0 transition-opacity duration-300 group-hover:opacity-40`}
              ></div>

              {/* Content */}
              <div className="relative z-10 flex min-h-72 flex-col justify-between p-8">
                {/* Top Section */}
                <div>
                  {/* Icon Box */}
                  <div
                    className={`mb-8 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${section.accent} text-white shadow-lg shadow-slate-200/50 transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl`}
                  >
                    <Icon size={28} strokeWidth={1.5} />
                  </div>

                  {/* Text Content */}
                  <div className="mb-6">
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">
                      Content Editor
                    </p>
                    <h2 className="text-3xl font-light text-slate-900 mb-4 leading-tight">
                      {section.title}
                    </h2>
                    <p className="text-sm font-light leading-relaxed text-slate-600">
                      {section.description}
                    </p>
                  </div>
                </div>

                {/* Bottom Section */}
                <div className="flex items-center justify-between pt-6 border-t border-slate-200/60">
                  <div className="flex flex-col gap-1">
                    <p className="text-3xl font-light text-slate-900">{section.count}</p>
                    <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                      {section.label}
                    </p>
                  </div>

                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${section.accent} text-white transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg`}
                  >
                    <ArrowUpRight size={20} strokeWidth={2} />
                  </div>
                </div>
              </div>

              {/* Border Animation on Hover */}
              <div className="absolute inset-0 rounded-2xl border border-gradient opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none"></div>
            </Link>
          )
        })}
      </div>

      {/* Footer Info */}
      <div className="mt-12 rounded-2xl bg-gradient-to-r from-slate-100 to-slate-50 border border-slate-200/60 p-8">
        <div className="flex items-start gap-4">
          <Zap className="h-6 w-6 text-emerald-600 flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Pro Tips</h3>
            <p className="text-sm font-light text-slate-600 leading-relaxed">
              All changes are saved automatically. You can manage multiple content sections
              simultaneously. Use the sidebar navigation to jump between different portfolio areas
              quickly.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
