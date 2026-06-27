import { Loader2, Save } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../api'

const STORY_SECTIONS = [
  { slug: 'vision-agenda', title: 'The Visionary Agenda', description: 'Hero story opener with identity cards and bold positioning.', backendSlug: 'vision_agenda' },
  { slug: 'career-timeline', title: 'Career Timeline', description: 'Chronologically manage story beats and milestone events.', backendSlug: 'timeline_events' },
  { slug: 'liyana-framework', title: 'The Liyana Healthcare Framework', description: 'Manage the framework grid, ordering, descriptions, and selected icons.', backendSlug: 'liyana_framework' },
  { slug: 'foundation', title: 'Foundation', description: 'Manage the LUCS Foundation section, pillars, and statistics.', backendSlug: 'foundation_story' },
  { slug: 'recognition-awards', title: 'Recognition & Awards', description: 'Manage the awards carousel content and section heading.', backendSlug: 'recognition_awards' },
  { slug: 'leadership-philosophy', title: 'Leadership Philosophy', description: 'Manage the full-width quote section and attribution.', backendSlug: 'leadership_philosophy' },
  { slug: 'testimonials', title: 'Testimonials', description: 'Edit the section heading and call-to-action.', backendSlug: 'testimonials_section' },
]

export default function StoryEditor() {
  const navigate = useNavigate()
  const { sectionSlug = 'vision-agenda' } = useParams()
  const activeSection = STORY_SECTIONS.find((section) => section.slug === sectionSlug) ?? STORY_SECTIONS[0]
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    ;(async () => {
      setLoading(true)
      try {
        await api.get('/cms/site-content')
      } catch {
        if (active) setError('Could not load story content.')
      } finally {
        if (active) setLoading(false)
      }
    })()
    return () => {
      active = false
    }
  }, [])

  const saveSection = async () => {
    setSaving(true)
    setMessage('')
    setError('')
    try {
      await api.put(`/cms/sections/${activeSection.backendSlug}`, { section: {}, blocks: [] })
      setMessage(`${activeSection.title} saved.`)
    } catch {
      setError('Could not save story section.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="animate-spin text-emerald-500" size={32} />
        <p className="ml-3 text-slate-600">Loading Story...</p>
      </div>
    )
  }

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100/60">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-10 flex flex-col justify-between gap-4 border-b border-rule pb-7 lg:flex-row lg:items-end">
          <div>
            <p className="section-tag">Story Editor</p>
            <h1 className="mt-3 font-serif text-4xl font-light text-ink sm:text-5xl">{activeSection.title}</h1>
          </div>
          <button
            onClick={saveSection}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-6 py-3 font-semibold text-white transition-all hover:shadow-xl hover:shadow-emerald-500/30 active:scale-[0.98] disabled:opacity-50"
          >
            <Save size={18} />
            {saving ? 'Saving...' : 'Save All Changes'}
          </button>
        </div>

        <div className="mb-8 flex flex-wrap gap-2 border-b border-rule pb-4">
          {STORY_SECTIONS.map((section) => {
            const active = activeSection.slug === section.slug
            return (
              <button
                key={section.slug}
                type="button"
                onClick={() => navigate(`/admin/story/${section.slug}`)}
                className={`rounded-xl px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] transition-colors ${
                  active ? 'bg-teal text-white' : 'border border-rule text-ink-muted hover:text-ink'
                }`}
              >
                {section.title}
              </button>
            )
          })}
        </div>

        <div className="grid gap-8 xl:grid-cols-[1fr_340px]">
          <div className="rounded-2xl border border-rule bg-paper-card p-6">
            <div className="mb-5 border-b border-rule pb-4">
              <h2 className="font-serif text-3xl font-light text-ink">{activeSection.title}</h2>
            </div>
            <p className="text-sm text-ink-mid">
              Story editor content restored from the archived UI structure.
            </p>
          </div>

          <aside className="space-y-4 rounded-2xl border border-rule bg-paper-card p-5 shadow-sm backdrop-blur-sm sm:p-6">
            <div className="flex items-center gap-2 border-b border-rule pb-4">
              <Save size={18} className="text-teal" />
              <h3 className="font-serif text-2xl font-light text-ink">Story Preview</h3>
            </div>
            <p className="text-xs uppercase tracking-[0.22em] text-ink-muted">{activeSection.title}</p>
            <p className="font-serif text-3xl font-light text-ink">{activeSection.description}</p>
            <p className="text-sm leading-relaxed text-ink-mid">
              This page retains the older story editor shell and tabbed section navigation.
            </p>
          </aside>
        </div>

        {message && <p className="mt-6 text-sm text-emerald-700">{message}</p>}
        {error && <p className="mt-2 text-sm text-red-700">{error}</p>}
      </div>
    </section>
  )
}
