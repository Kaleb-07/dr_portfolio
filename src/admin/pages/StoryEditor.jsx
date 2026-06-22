import { ArrowDown, ArrowUp, Image, Loader2, Plus, Save, Trash2 } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../api'

const STORY_SECTIONS = [
  {
    slug: 'vision-agenda',
    title: 'The Visionary Agenda',
    description: 'Hero story opener with identity cards and bold positioning.',
    backendSlug: 'vision_agenda',
    hint: 'Edit the hero headline, supporting image, and identity blocks.',
  },
  {
    slug: 'career-timeline',
    title: 'Career Timeline',
    description: 'Chronologically manage story beats and milestone events.',
    type: 'timeline',
    hint: 'Add, reorder, and update career timeline events.',
  },
  {
    slug: 'liyana-healthcare',
    title: 'Liyana Healthcare',
    description: 'Brand story tile with headline, description and visual assets.',
    hint: 'Manage messaging, section imagery, buttons, and layout details.',
  },
  {
    slug: 'foundation',
    title: 'Foundation',
    description: 'Foundation narrative and philanthropic messaging.',
    hint: 'Update headings, descriptive copy, button links, and imagery.',
  },
  {
    slug: 'recognition',
    title: 'Recognition',
    description: 'Editorial recognition stories and awards narrative.',
    hint: 'Describe honors, media highlights, and social proof assets.',
  },
  {
    slug: 'leadership-philosophy',
    title: 'Leadership Philosophy',
    description: 'Leadership voice and mission-driven perspective.',
    hint: 'Refine philosophy copy, iconography, and CTA messaging.',
  },
  {
    slug: 'testimonials',
    title: 'Testimonials',
    description: 'Manage story-first testimonial cards and author notes.',
    hint: 'Add and reorder testimonials for the brand story experience.',
  },
  {
    slug: 'connect',
    title: 'Connect',
    description: 'Contact and connection messaging for the Story section.',
    hint: 'Adjust heading, description, button links, and image assets.',
  },
  {
    slug: 'footer',
    title: 'Footer',
    description: 'Footer copy, links and brand credentials.',
    hint: 'Control footer headings, links, and brand closing statements.',
  },
]

const baseField =
  'w-full border border-rule bg-paper px-3 py-2.5 text-sm text-ink outline-none transition-colors placeholder:text-ink-faint focus:border-teal'
const labelClass = 'mb-1.5 block font-mono text-[9px] uppercase tracking-[0.18em] text-ink-muted'

function Field({ label, children }) {
  return (
    <label>
      <span className={labelClass}>{label}</span>
      {children}
    </label>
  )
}

function IconButton({ label, onClick, children, disabled, danger = false }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={onClick}
      className={`inline-flex h-9 w-9 items-center justify-center rounded border text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
        danger
          ? 'border-red-200 text-red-700 hover:bg-red-50'
          : 'border-rule text-ink-muted hover:bg-paper-warm hover:text-ink'
      }`}
    >
      {children}
    </button>
  )
}

function buildSectionDraft(section = {}) {
  return {
    eyebrow: section.eyebrow || '',
    title: section.title || '',
    subtitle: section.subtitle || '',
    description: section.description || '',
    image_url: section.image_url || '',
    image_alt: section.image_alt || '',
    buttons: section.metadata?.cta || [],
    blocks: section.blocks || [],
    color: section.metadata?.color || '#0d9488',
    icon: section.metadata?.icon || '',
  }
}

function buildTimelineEvents(events = []) {
  return events.map((event) => ({
    ...event,
    year: event.year || '',
    title: event.title || '',
    subtitle: event.subtitle || '',
    description: event.description || '',
    category: event.category || 'milestone',
    icon: event.icon || '',
  }))
}

export default function StoryEditor() {
  const { sectionSlug } = useParams()
  const navigate = useNavigate()
  const [content, setContent] = useState(null)
  const [draft, setDraft] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const selectedSection = useMemo(
    () => STORY_SECTIONS.find((section) => section.slug === sectionSlug) ?? STORY_SECTIONS[0],
    [sectionSlug],
  )

  useEffect(() => {
    if (!sectionSlug) {
      navigate(`/admin/story/${STORY_SECTIONS[0].slug}`, { replace: true })
    }
  }, [navigate, sectionSlug])

  // When the route section changes, reset draft/loading state briefly
  useEffect(() => {
    let active = true

    setMessage('')
    setError('')
    setDraft(null)
    setIsLoading(true)

    const run = async () => {
      if (!content) {
        try {
          const response = await api.get('/cms/site-content')
          if (!active) return
          setContent(response.data)
        } catch {
          if (!active) return
          setError('Unable to load Story content.')
        }
      }

      if (!active) return
      // small delay so UI shows a loading state when switching
      setTimeout(() => active && setIsLoading(false), 120)
    }

    run()

    return () => {
      active = false
    }
  }, [sectionSlug])

  useEffect(() => {
    let active = true

    const load = async () => {
      setIsLoading(true)
      setError('')
      try {
        const response = await api.get('/cms/site-content')
        if (!active) return
        setContent(response.data)
      } catch {
        if (!active) return
        setError('Unable to load Story content.')
      } finally {
        if (!active) return
        setIsLoading(false)
      }
    }

    load()

    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    if (!content) return

    if (selectedSection.type === 'timeline') {
      setDraft({ events: buildTimelineEvents(content.timelineEvents || []) })
      return
    }

    if (selectedSection.backendSlug) {
      setDraft(buildSectionDraft(content.sections[selectedSection.backendSlug] || {}))
      return
    }

    setDraft(buildSectionDraft({}))
  }, [content, selectedSection])


  const updateDraft = (patch) => {
    setDraft((current) => ({ ...current, ...patch }))
  }

  const updateBlock = (index, patch) => {
    if (!draft) return
    setDraft((current) => {
      const blocks = current.blocks.map((block, blockIndex) => (blockIndex === index ? { ...block, ...patch } : block))
      return { ...current, blocks }
    })
  }

  const reorderBlocks = (index, direction) => {
    if (!draft) return
    setDraft((current) => {
      const next = [...current.blocks]
      const target = index + direction
      if (target < 0 || target >= next.length) return current
      const item = next[index]
      next[index] = next[target]
      next[target] = item
      return { ...current, blocks: next }
    })
  }

  const addButton = () => {
    updateDraft({ buttons: [...(draft?.buttons || []), { label: '', path: '', variant: 'primary' }] })
  }

  const removeButton = (index) => {
    setDraft((current) => ({ ...current, buttons: current.buttons.filter((_, itemIndex) => itemIndex !== index) }))
  }

  const updateButton = (index, patch) => {
    setDraft((current) => ({
      ...current,
      buttons: current.buttons.map((button, itemIndex) => (itemIndex === index ? { ...button, ...patch } : button)),
    }))
  }

  const addTimelineEvent = () => {
    setDraft((current) => ({
      ...current,
      events: [
        ...current.events,
        {
          id: `new-${Date.now()}`,
          year: '',
          title: '',
          subtitle: '',
          description: '',
          category: 'milestone',
          icon: '',
          sort_order: current.events.length + 1,
        },
      ],
    }))
  }

  const updateTimelineEvent = (index, patch) => {
    setDraft((current) => ({
      ...current,
      events: current.events.map((item, itemIndex) => (itemIndex === index ? { ...item, ...patch } : item)),
    }))
  }

  const saveSection = async () => {
    if (!draft || !selectedSection) return

    setMessage('')
    setError('')
    setIsSaving(true)

    try {
      if (selectedSection.type === 'timeline') {
        for (const event of draft.events) {
          if (typeof event.id === 'number') {
            await api.put(`/cms/timeline-events/${event.id}`, event)
          } else {
            const { id, ...payload } = event
            await api.post('/cms/timeline-events', payload)
          }
        }
        setMessage('Timeline saved.')
        await refreshContent()
      } else if (selectedSection.backendSlug) {
        const sectionPatch = {
          eyebrow: draft.eyebrow,
          title: draft.title,
          subtitle: draft.subtitle,
          description: draft.description,
          image_url: draft.image_url,
          image_alt: draft.image_alt,
          metadata: { cta: draft.buttons, color: draft.color, icon: draft.icon },
        }
        await api.put(`/cms/sections/${selectedSection.backendSlug}`, { section: sectionPatch, blocks: draft.blocks })
        setMessage('Section saved.')
        await refreshContent()
      } else {
        setMessage('This section is editable in the interface, but backend mapping is not connected yet.')
      }
    } catch {
      setError('Could not save this section.')
    } finally {
      setIsSaving(false)
    }
  }

  const refreshContent = async () => {
    try {
      const response = await api.get('/cms/site-content')
      setContent(response.data)
    } catch {
      setError('Could not refresh content after save.')
    }
  }

  const renderTimelineEditor = () => {
    if (!draft) return null

    return (
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-rule pb-4">
          <div>
            <p className="section-tag">Timeline Editor</p>
            <h2 className="mt-3 font-serif text-3xl font-light text-ink">Career Timeline</h2>
            <p className="max-w-2xl text-sm font-light leading-relaxed text-ink-mid">{selectedSection.description}</p>
          </div>
          <button type="button" className="inline-flex items-center gap-2 rounded bg-teal px-4 py-2.5 text-xs uppercase tracking-[0.16em] text-white" onClick={addTimelineEvent}>
            <Plus size={15} /> Add Event
          </button>
        </div>

        <div className="space-y-4">
          {draft.events.map((event, index) => (
            <div key={event.id || index} className="border border-rule bg-paper-card p-5">
              <div className="grid gap-4 md:grid-cols-[120px_minmax(0,1fr)]">
                <Field label="Year">
                  <input className={baseField} value={event.year} onChange={(e) => updateTimelineEvent(index, { year: e.target.value })} />
                </Field>
                <Field label="Title">
                  <input className={baseField} value={event.title} onChange={(e) => updateTimelineEvent(index, { title: e.target.value })} />
                </Field>
                <Field label="Subtitle">
                  <input className={baseField} value={event.subtitle} onChange={(e) => updateTimelineEvent(index, { subtitle: e.target.value })} />
                </Field>
                <Field label="Category">
                  <input className={baseField} value={event.category} onChange={(e) => updateTimelineEvent(index, { category: e.target.value })} />
                </Field>
                <Field label="Icon">
                  <input className={baseField} value={event.icon} onChange={(e) => updateTimelineEvent(index, { icon: e.target.value })} placeholder="icon name or label" />
                </Field>
                <Field label="Description">
                  <textarea className={baseField} rows={3} value={event.description} onChange={(e) => updateTimelineEvent(index, { description: e.target.value })} />
                </Field>
              </div>
              <div className="mt-4 flex items-center justify-between gap-2">
                <div className="flex gap-2">
                  <IconButton label="Move up" disabled={index === 0} onClick={() => reorderTimeline(index, -1)}>
                    <ArrowUp size={15} />
                  </IconButton>
                  <IconButton label="Move down" disabled={index === draft.events.length - 1} onClick={() => reorderTimeline(index, 1)}>
                    <ArrowDown size={15} />
                  </IconButton>
                </div>
                <IconButton label="Delete" danger onClick={() => removeTimelineEvent(index)}>
                  <Trash2 size={15} />
                </IconButton>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const reorderTimeline = (index, direction) => {
    setDraft((current) => {
      const next = [...current.events]
      const target = index + direction
      if (target < 0 || target >= next.length) return current
      const item = next[index]
      next[index] = next[target]
      next[target] = item
      return { ...current, events: next }
    })
  }

  const removeTimelineEvent = (index) => {
    setDraft((current) => ({ ...current, events: current.events.filter((_, itemIndex) => itemIndex !== index) }))
  }

  const renderGenericEditor = () => {
    if (!draft) return null

    return (
      <div className="space-y-6">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-4">
            <div className="rounded-3xl border border-rule bg-paper-card p-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="section-tag">Section Content</p>
                  <h2 className="mt-3 font-serif text-3xl font-light text-ink">{selectedSection.title}</h2>
                  <p className="mt-2 text-sm text-ink-mid">{selectedSection.description}</p>
                </div>
                <span className="rounded-full border border-rule bg-paper px-3 py-1 text-[10px] uppercase tracking-[0.24em] text-ink-muted">
                  Visual hero & cards
                </span>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <Field label="Eyebrow">
                  <input className={baseField} value={draft.eyebrow} onChange={(e) => updateDraft({ eyebrow: e.target.value })} />
                </Field>
                <Field label="Subtitle">
                  <input className={baseField} value={draft.subtitle} onChange={(e) => updateDraft({ subtitle: e.target.value })} />
                </Field>
                <Field label="Title">
                  <textarea className={baseField} rows={3} value={draft.title} onChange={(e) => updateDraft({ title: e.target.value })} />
                </Field>
                <Field label="Description">
                  <textarea className={baseField} rows={4} value={draft.description} onChange={(e) => updateDraft({ description: e.target.value })} />
                </Field>
                <Field label="Image URL">
                  <input className={baseField} value={draft.image_url} onChange={(e) => updateDraft({ image_url: e.target.value })} />
                </Field>
                <Field label="Image Alt">
                  <input className={baseField} value={draft.image_alt} onChange={(e) => updateDraft({ image_alt: e.target.value })} />
                </Field>
                <Field label="Brand Color">
                  <input type="color" className="h-11 w-full rounded border border-rule bg-paper p-1" value={draft.color} onChange={(e) => updateDraft({ color: e.target.value })} />
                </Field>
                <Field label="Icon">
                  <input className={baseField} value={draft.icon} onChange={(e) => updateDraft({ icon: e.target.value })} placeholder="Icon name or keyword" />
                </Field>
              </div>
            </div>

            <div className="rounded-3xl border border-rule bg-paper-card p-6">
              <div className="mb-5 flex items-center justify-between gap-4">
                <div>
                  <h3 className="font-serif text-2xl font-light text-ink">Buttons</h3>
                  <p className="text-sm text-ink-mid">Manage CTA labels and destinations.</p>
                </div>
                <button type="button" className="inline-flex items-center gap-2 rounded bg-paper border border-rule px-3 py-2 text-xs uppercase tracking-[0.16em] text-ink" onClick={addButton}>
                  <Plus size={14} /> Add Button
                </button>
              </div>
              <div className="space-y-4">
                {draft.buttons.map((button, index) => (
                  <div key={index} className="grid gap-3 rounded-2xl border border-rule bg-paper p-4 md:grid-cols-[1fr_1fr_120px]">
                    <Field label="Label">
                      <input className={baseField} value={button.label} onChange={(e) => updateButton(index, { label: e.target.value })} />
                    </Field>
                    <Field label="Path">
                      <input className={baseField} value={button.path} onChange={(e) => updateButton(index, { path: e.target.value })} />
                    </Field>
                    <div className="flex items-end justify-end">
                      <IconButton label="Delete button" danger onClick={() => removeButton(index)}>
                        <Trash2 size={15} />
                      </IconButton>
                    </div>
                  </div>
                ))}
                {draft.buttons.length === 0 && <p className="text-sm text-ink-mid">No buttons added yet.</p>}
              </div>
            </div>
          </div>

          <aside className="space-y-4">
            <div className="rounded-3xl border border-rule bg-paper-card p-6">
              <p className="section-tag">Preview</p>
              <div className="mt-5 rounded-3xl border border-dashed border-rule bg-paper px-5 py-6 text-ink">
                <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-muted">{draft.eyebrow || 'Section label'}</p>
                <h3 className="mt-3 text-2xl font-light text-ink">{draft.title || selectedSection.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-mid">{draft.description || selectedSection.description}</p>
                {draft.image_url ? (
                  <div className="mt-5 overflow-hidden rounded-3xl border border-rule bg-paper">
                    <img src={draft.image_url} alt={draft.image_alt || ''} className="h-48 w-full object-cover" />
                  </div>
                ) : (
                  <div className="mt-5 flex h-48 items-center justify-center rounded-3xl border border-dashed border-rule bg-paper text-ink-muted">
                    <Image size={28} />
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-3xl border border-rule bg-paper-card p-6">
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-muted">Section Notes</p>
              <p className="mt-3 text-sm leading-relaxed text-ink-mid">{selectedSection.hint}</p>
            </div>
          </aside>
        </div>
      </div>
    )
  }

  if (isLoading || !draft) {
    return (
      <div className="flex min-h-[28rem] items-center justify-center border border-rule bg-paper-card">
        <Loader2 size={26} className="animate-spin text-teal" />
      </div>
    )
  }

  return (
    <section className="mx-auto max-w-7xl space-y-8">
      <div className="flex flex-col justify-between gap-4 border-b border-rule pb-7 lg:flex-row lg:items-end">
        <div>
          <p className="section-tag">Story Editor</p>
          <h1 className="mt-3 font-serif text-4xl font-light text-ink sm:text-5xl">{selectedSection.title}</h1>
          <p className="mt-3 max-w-3xl text-sm font-light leading-relaxed text-ink-mid">{selectedSection.description}</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm font-light text-ink-mid">
            {message && <p className="text-teal">{message}</p>}
            {error && <p className="text-red-700">{error}</p>}
          </div>
          <div>
            <button
              type="button"
              onClick={saveSection}
              disabled={isSaving}
              className="inline-flex items-center gap-2 rounded bg-teal px-4 py-2.5 font-sans text-xs font-medium uppercase tracking-[0.18em] text-white transition-colors hover:bg-teal-mid disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={14} />}
              <span>{isSaving ? 'Saving' : 'Save Section'}</span>
            </button>
          </div>
        </div>
      </div>

      {selectedSection.type === 'timeline' ? renderTimelineEditor() : renderGenericEditor()}

      
    </section>
  )
}
