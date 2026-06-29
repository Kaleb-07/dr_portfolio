import {
  ArrowDown,
  ArrowUp,
  BriefcaseBusiness,
  GraduationCap,
  Handshake,
  HeartPulse,
  Hospital,
  Landmark,
  Loader2,
  Microscope,
  Plus,
  Save,
  Smartphone,
  Sparkles,
  Hammer,
  Trash2,
  Trophy,
  Upload,
  Wallet,
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  Zap,
  X,
} from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../api'

// ------------------------------------------------------------------
// CONSTANTS & HELPERS
// ------------------------------------------------------------------

const STORY_SECTIONS = [
  {
    slug: 'vision-agenda',
    title: 'The Visionary Agenda',
    description: 'Hero story opener with identity cards and bold positioning.',
    backendSlug: 'vision_agenda',
    hint: 'Fill in each headline field separately using plain text only — no HTML or code. The "Highlighted" word(s) will appear in a custom colour automatically.',
  },
  {
    slug: 'career-timeline',
    title: 'Career Timeline',
    description: 'Chronologically manage story beats and milestone events.',
    type: 'timeline',
    hint: 'Add, reorder, and update career timeline events.',
  },
  {
    slug: 'liyana-framework',
    title: 'The Liyana Healthcare Framework',
    description: 'Manage the framework grid, ordering, descriptions, and selected icons.',
    backendSlug: 'liyana_framework',
    blockLabel: 'Framework Item',
    hint: 'Each framework card has a label, title, description, and icon. Write plain text only.',
  },
  {
    slug: 'foundation',
    title: 'Foundation',
    description: 'Manage the LUCS Foundation section, pillars, and statistics.',
    backendSlug: 'foundation_story',
    blockLabel: 'Foundation Pillar',
    hint: 'Edit the heading, intro text, pillars, and stat cards. Each pillar has a title and an icon.',
  },
  {
    slug: 'recognition-awards',
    title: 'Recognition & Awards',
    description: 'Manage the awards carousel content and section heading.',
    backendSlug: 'recognition_awards',
    blockLabel: 'Award Card',
    hint: 'Fill in every field for each award — title, description, organization, year, category, and image.',
  },
  {
    slug: 'leadership-philosophy',
    title: 'Leadership Philosophy',
    description: 'Manage the full-width quote section and attribution.',
    backendSlug: 'leadership_philosophy',
    hint: 'Write the quote and attribution as plain text. The styling is applied automatically on the website.',
  },
  {
    slug: 'testimonials',
    title: 'Testimonials',
    description: 'Edit the section heading and call‑to‑action.',
    backendSlug: 'testimonials_section',
    type: 'testimonials',
    hint: 'Edit the tag, headline, body, and the "Share Your Story" button. The testimonials themselves will be managed later from user submissions.',
  },
]

const ICON_OPTIONS = [
  { value: 'hospital', label: 'Hospital', Icon: Hospital },
  { value: 'graduation-cap', label: 'Education', Icon: GraduationCap },
  { value: 'hammer', label: 'Manufacturing', Icon: Hammer },
  { value: 'microscope', label: 'Research', Icon: Microscope },
  { value: 'smartphone', label: 'Digital Health', Icon: Smartphone },
  { value: 'wallet', label: 'Financing', Icon: Wallet },
  { value: 'heart-pulse', label: 'Community Health', Icon: HeartPulse },
  { value: 'handshake', label: 'Mentorship', Icon: Handshake },
  { value: 'briefcase', label: 'Career', Icon: BriefcaseBusiness },
  { value: 'trophy', label: 'Award', Icon: Trophy },
  { value: 'landmark', label: 'Policy', Icon: Landmark },
  { value: 'sparkles', label: 'Milestone', Icon: Sparkles },
]

const FOUNDATION_ICONS = [
  'heart-pulse',
  'graduation-cap',
  'hospital',
  'handshake',
  'landmark',
  'microscope',
  'sparkles',
]

const getIconComponent = (iconValue) => {
  const found = ICON_OPTIONS.find((opt) => opt.value === iconValue)
  return found ? found.Icon : Sparkles
}

// ------------------------------------------------------------------
// STYLES
// ------------------------------------------------------------------

const formInput =
  'w-full rounded-xl border border-slate-200 bg-white/70 backdrop-blur px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:border-teal-400 focus:ring-4 focus:ring-teal-500/10 focus:bg-white shadow-sm hover:border-teal-300 hover:shadow-md'

const labelClass = 'mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-600'

function Field({ label, children, hint }) {
  return (
    <label className="block">
      <span className={labelClass}>{label}</span>
      {children}
      {hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
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
      className={`inline-flex h-9 w-9 items-center justify-center rounded-lg transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-40 ${
        danger
          ? 'bg-red-50 text-red-600 hover:bg-red-100 hover:scale-110 active:scale-95'
          : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:scale-110 active:scale-95'
      }`}
    >
      {children}
    </button>
  )
}

function Toast({ message, error }) {
  if (!message && !error) return null
  return (
    <div
      className={`fixed bottom-6 right-6 flex items-center gap-3 rounded-lg px-5 py-3.5 text-sm font-medium shadow-lg transition-all duration-300 animate-in slide-in-from-right z-50 max-w-xs ${
        error ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-700'
      }`}
    >
      {error ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
      <span>{message || error}</span>
    </div>
  )
}

function IconPicker({ value, onChange, allowedValues }) {
  const icons = allowedValues
    ? ICON_OPTIONS.filter((opt) => allowedValues.includes(opt.value))
    : ICON_OPTIONS

  return (
    <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
      {icons.map(({ value: optionValue, label, Icon }) => {
        const isSelected = value === optionValue
        return (
          <button
            key={optionValue}
            type="button"
            onClick={() => onChange(optionValue)}
            className={`flex flex-col items-center justify-center gap-2 rounded-lg border-2 px-3 py-4 text-center transition-all duration-200 transform hover:scale-105 active:scale-95 ${
              isSelected
                ? 'border-teal-500 bg-gradient-to-br from-teal-50 to-teal-100 text-teal-700 shadow-lg scale-105'
                : 'border-slate-200 bg-white text-slate-600 hover:border-teal-300 hover:bg-teal-50'
            }`}
          >
            <Icon size={20} strokeWidth={1.5} />
            <span className="text-[10px] font-semibold leading-tight">{label}</span>
          </button>
        )
      })}
    </div>
  )
}

function ImageUploadField({ label, value, onChange, onError }) {
  const [preview, setPreview] = useState(value)
  const fileInputRef = useRef(null)

  const handleFileSelect = (file) => {
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const dataUrl = String(reader.result || '')
      setPreview(dataUrl)
      onChange(dataUrl)
    }
    reader.onerror = () => onError('Could not read image.')
    reader.readAsDataURL(file)
  }

  const clearImage = () => {
    setPreview('')
    onChange('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  return (
    <div className="space-y-3">
      <Field label={label}>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={(e) => handleFileSelect(e.target.files?.[0])}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className={`w-full flex items-center justify-center gap-2 rounded-lg border-2 border-dashed px-4 py-6 transition-all ${
                preview
                  ? 'border-teal-300 bg-teal-50 text-teal-700 hover:bg-teal-100'
                  : 'border-slate-300 bg-slate-50 text-slate-600 hover:border-teal-300 hover:bg-teal-50'
              }`}
            >
              <Upload size={18} />
              <span className="text-sm font-medium">
                {preview ? 'Change Image' : 'Select Image'}
              </span>
            </button>
          </div>
          {preview && (
            <button
              type="button"
              onClick={clearImage}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
              title="Remove image"
            >
              <X size={20} />
            </button>
          )}
        </div>
      </Field>
      {preview && (
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-slate-50 hover:shadow-md transition-all">
          <img src={preview} alt="Preview" className="h-40 w-full object-cover" />
        </div>
      )}
    </div>
  )
}

function stripHtml(html = '') {
  return html.replace(/<[^>]*>/g, '').trim()
}

// ------------------------------------------------------------------
// DRAFT BUILDERS
// ------------------------------------------------------------------

function buildSectionDraft(section = {}) {
  return {
    eyebrow: section.eyebrow || '',
    title: stripHtml(section.title || ''),
    subtitle: stripHtml(section.subtitle || ''),
    title_highlight: section.metadata?.title_highlight || '',
    description: stripHtml(section.description || ''),
    image_url: section.image_url || '',
    image_alt: section.image_alt || '',
    buttons: section.metadata?.cta || [],
    metrics: section.metadata?.metrics || [],
    stats: section.metadata?.stats || [],
    blocks: section.blocks || [],
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

function buildIdentityItems(items = []) {
  return items.map((item) => ({
    ...item,
    label: item.label || '',
    title: item.title || '',
    description: item.description || '',
    icon: item.icon || '',
    image_url: item.image_url || '',
    sort_order: item.sort_order || 0,
    is_active: item.is_active === 0 ? 0 : 1,
  }))
}

function buildTestimonialSectionDraft(section = {}) {
  return {
    eyebrow: section.eyebrow || '',
    title: stripHtml(section.title || ''),
    description: stripHtml(section.description || ''),
    cta_text: section.metadata?.cta_text || '',
    cta_link: section.metadata?.cta_link || '',
  }
}

// ------------------------------------------------------------------
// STORY EDITOR COMPONENT
// ------------------------------------------------------------------

export default function StoryEditor() {
  const { sectionSlug } = useParams()
  const navigate = useNavigate()
  const [content, setContent] = useState(null)
  const [draft, setDraft] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [deletedIdentityIds, setDeletedIdentityIds] = useState([])
  const [deletedTimelineIds, setDeletedTimelineIds] = useState([])
  const [newItemId, setNewItemId] = useState(null)
  const newItemRef = useRef(null)

  // Accordion states
  const [expandedTimeline, setExpandedTimeline] = useState([])
  const [expandedIdentity, setExpandedIdentity] = useState([])
  const [expandedBlock, setExpandedBlock] = useState([])

  const selectedSection = useMemo(
    () => STORY_SECTIONS.find((s) => s.slug === sectionSlug) ?? STORY_SECTIONS[0],
    [sectionSlug],
  )

  useEffect(() => {
    if (!sectionSlug) navigate(`/admin/story/${STORY_SECTIONS[0].slug}`, { replace: true })
  }, [navigate, sectionSlug])

  useEffect(() => {
    setMessage('')
    setError('')
    setDeletedIdentityIds([])
    setDeletedTimelineIds([])
    setNewItemId(null)

    if (selectedSection.type === 'timeline') {
      setDraft({ events: buildTimelineEvents([]) })
      return
    }
    if (selectedSection.type === 'identities') {
      setDraft({ identities: buildIdentityItems([]) })
      return
    }
    if (selectedSection.type === 'testimonials') {
      setDraft(buildTestimonialSectionDraft({}))
      return
    }
    setDraft(buildSectionDraft({}))
  }, [sectionSlug, selectedSection])

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
    if (selectedSection.type === 'identities') {
      setDraft({ identities: buildIdentityItems(content.identityItems || []) })
      return
    }
    if (selectedSection.type === 'testimonials') {
      const sectionData = content.sections?.[selectedSection.backendSlug] || {}
      setDraft(buildTestimonialSectionDraft(sectionData))
      return
    }
    if (selectedSection.backendSlug) {
      setDraft(buildSectionDraft(content.sections[selectedSection.backendSlug] || {}))
      return
    }
    setDraft(buildSectionDraft({}))
  }, [content, selectedSection])

  // Scroll & focus new item
  useEffect(() => {
    if (newItemId && newItemRef.current) {
      setTimeout(() => {
        newItemRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
        const firstInput = newItemRef.current?.querySelector('input, textarea')
        firstInput?.focus()
      }, 300)
      const reset = setTimeout(() => setNewItemId(null), 2500)
      return () => clearTimeout(reset)
    }
  }, [newItemId])

  // Toggle helpers
  const toggleTimeline = (index) => {
    setExpandedTimeline((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index],
    )
  }
  const toggleIdentity = (index) => {
    setExpandedIdentity((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index],
    )
  }
  const toggleBlock = (index) => {
    setExpandedBlock((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index],
    )
  }

  // ---------------------- Timeline handlers ----------------------
  const addTimelineEvent = () => {
    const id = `new-${Date.now()}`
    setDraft((c) => {
      const events = Array.isArray(c?.events) ? c.events : []
      const idx = events.length
      setTimeout(() => {
        setExpandedTimeline((prev) => [...prev, idx])
        setNewItemId(id)
      }, 0)
      return {
        ...c,
        events: [
          ...events,
          {
            id,
            year: '',
            title: '',
            subtitle: '',
            description: '',
            category: 'milestone',
            icon: 'sparkles',
            sort_order: idx + 1,
          },
        ],
      }
    })
  }

  const updateTimelineEvent = (index, patch) =>
    setDraft((c) => {
      if (!Array.isArray(c?.events)) return c
      return {
        ...c,
        events: c.events.map((item, i) => (i === index ? { ...item, ...patch } : item)),
      }
    })

  const reorderTimeline = (index, direction) => {
    setDraft((c) => {
      if (!Array.isArray(c?.events)) return c
      const next = [...c.events]
      const target = index + direction
      if (target < 0 || target >= next.length) return c
      ;[next[index], next[target]] = [next[target], next[index]]
      return { ...c, events: next }
    })
  }

  const removeTimelineEvent = (index) => {
    setDraft((c) => {
      if (!Array.isArray(c?.events)) return c
      const removed = c.events[index]
      if (typeof removed?.id === 'number') setDeletedTimelineIds((ids) => [...ids, removed.id])
      return { ...c, events: c.events.filter((_, i) => i !== index) }
    })
  }

  // ---------------------- Identity handlers ----------------------
  const addIdentity = () => {
    const newId = `new-${Date.now()}`
    setDraft((c) => {
      const identities = Array.isArray(c?.identities) ? c.identities : []
      const idx = identities.length
      setTimeout(() => {
        setExpandedIdentity((prev) => [...prev, idx])
        setNewItemId(newId)
      }, 0)
      return {
        ...c,
        identities: [
          ...identities,
          {
            id: newId,
            label: String(idx + 1).padStart(2, '0'),
            title: '',
            description: '',
            icon: '',
            image_url: '',
            sort_order: idx + 1,
            is_active: 1,
          },
        ],
      }
    })
  }

  const updateIdentity = (index, patch) =>
    setDraft((c) => {
      if (!Array.isArray(c?.identities)) return c
      return {
        ...c,
        identities: c.identities.map((item, i) => (i === index ? { ...item, ...patch } : item)),
      }
    })

  const reorderIdentities = (index, direction) => {
    setDraft((c) => {
      if (!Array.isArray(c?.identities)) return c
      const next = [...c.identities]
      const target = index + direction
      if (target < 0 || target >= next.length) return c
      ;[next[index], next[target]] = [next[target], next[index]]
      return { ...c, identities: next.map((item, i) => ({ ...item, sort_order: i + 1 })) }
    })
  }

  const removeIdentity = (index) => {
    setDraft((c) => {
      if (!Array.isArray(c?.identities)) return c
      const removed = c.identities[index]
      if (typeof removed?.id === 'number') setDeletedIdentityIds((ids) => [...ids, removed.id])
      return { ...c, identities: c.identities.filter((_, i) => i !== index) }
    })
  }

  // ---------------------- Generic blocks ----------------------
  const addBlock = () => {
    const id = `new-${Date.now()}`
    setDraft((c) => {
      const blocks = Array.isArray(c.blocks) ? c.blocks : []
      const idx = blocks.length
      setTimeout(() => {
        setExpandedBlock((prev) => [...prev, idx])
        setNewItemId(id)
      }, 0)
      return {
        ...c,
        blocks: [
          ...blocks,
          {
            id,
            block_type: c.blocks?.[0]?.block_type || 'content',
            eyebrow: '',
            title: '',
            body: '',
            image_url: '',
            image_alt: '',
            metadata: { icon: 'sparkles' },
            sort_order: idx + 1,
          },
        ],
      }
    })
  }

  const updateBlock = (index, patch) =>
    setDraft((c) => ({
      ...c,
      blocks: c.blocks.map((b, i) => (i === index ? { ...b, ...patch } : b)),
    }))

  const updateBlockMetadata = (index, patch) =>
    setDraft((c) => ({
      ...c,
      blocks: c.blocks.map((b, i) =>
        i === index ? { ...b, metadata: { ...(b.metadata || {}), ...patch } } : b,
      ),
    }))

  const removeBlock = (index) =>
    setDraft((c) => ({ ...c, blocks: c.blocks.filter((_, i) => i !== index) }))

  const reorderBlocks = (index, direction) => {
    setDraft((c) => {
      const next = [...c.blocks]
      const target = index + direction
      if (target < 0 || target >= next.length) return c
      ;[next[index], next[target]] = [next[target], next[index]]
      return { ...c, blocks: next }
    })
  }

  // ---------------------- Save section ----------------------
  const saveSection = async () => {
    if (!draft || !selectedSection) return
    setMessage('')
    setError('')
    setIsSaving(true)
    try {
      if (selectedSection.type === 'timeline') {
        if (!Array.isArray(draft.events)) throw new Error('No events')
        for (const id of deletedTimelineIds) await api.delete(`/cms/timeline-events/${id}`)
        for (const [i, event] of draft.events.entries()) {
          const payload = { ...event, sort_order: i + 1 }
          if (typeof event.id === 'number')
            await api.put(`/cms/timeline-events/${event.id}`, payload)
          else {
            const { id, ...p } = payload
            await api.post('/cms/timeline-events', p)
          }
        }
        setDeletedTimelineIds([])
        const refreshed = await refreshContent()
        if (!refreshed) throw new Error('refresh failed')
      } else if (selectedSection.type === 'identities') {
        if (!Array.isArray(draft.identities)) throw new Error('No identities')
        for (const id of deletedIdentityIds) await api.delete(`/cms/identity-items/${id}`)
        for (const [i, identity] of draft.identities.entries()) {
          const payload = { ...identity, sort_order: i + 1 }
          if (typeof identity.id === 'number')
            await api.put(`/cms/identity-items/${identity.id}`, payload)
          else {
            const { id, ...p } = payload
            await api.post('/cms/identity-items', p)
          }
        }
        setDeletedIdentityIds([])
        const refreshed = await refreshContent()
        if (!refreshed) throw new Error('refresh failed')
      } else if (selectedSection.type === 'testimonials') {
        const sectionPatch = {
          eyebrow: draft.eyebrow,
          title: draft.title,
          description: draft.description,
          metadata: {
            cta_text: draft.cta_text,
            cta_link: draft.cta_link,
          },
        }
        await api.put(`/cms/sections/${selectedSection.backendSlug}`, {
          section: sectionPatch,
        })
        const refreshed = await refreshContent()
        if (!refreshed) throw new Error('refresh failed')
      } else if (selectedSection.backendSlug) {
        const sectionPatch = {
          eyebrow: draft.eyebrow,
          title: draft.title,
          subtitle: draft.subtitle,
          description: draft.description,
          image_url: draft.image_url,
          image_alt: draft.image_alt,
          metadata: {
            cta: draft.buttons,
            icon: draft.icon,
            metrics: draft.metrics,
            stats: draft.stats,
            title_highlight: draft.title_highlight,
          },
        }
        await api.put(`/cms/sections/${selectedSection.backendSlug}`, {
          section: sectionPatch,
          blocks: draft.blocks,
        })
        const refreshed = await refreshContent()
        if (!refreshed) throw new Error('refresh failed')
      }
      setMessage('Saved successfully.')
    } catch {
      setError('Could not save. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const refreshContent = async () => {
    try {
      const response = await api.get('/cms/site-content')
      setContent(response.data)
      return true
    } catch {
      setError('Could not refresh content after save.')
      return false
    }
  }

  // ------------------------------------------------------------------
  // RENDERERS
  // ------------------------------------------------------------------

  const renderTimelineEditor = () => {
    if (!draft || !Array.isArray(draft.events)) return null
    return (
      <div className="space-y-6">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Career Timeline</h2>
            <p className="mt-2 text-sm text-slate-600">{selectedSection.description}</p>
          </div>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-teal-500 to-teal-600 px-5 py-2.5 font-semibold text-white transition-all hover:shadow-xl hover:shadow-teal-500/30 hover:scale-105 active:scale-95"
            onClick={addTimelineEvent}
          >
            <Plus size={18} /> Add Event
          </button>
        </div>

        <div className="space-y-3">
          {draft.events.map((event, index) => {
            const isOpen = expandedTimeline.includes(index)
            return (
              <div
                key={event.id || index}
                ref={event.id === newItemId ? newItemRef : null}
                className={`rounded-2xl border bg-white/80 backdrop-blur-sm shadow-sm transition-all duration-300 hover:shadow-lg hover:border-teal-300 ${
                  event.id === newItemId
                    ? 'border-teal-400 ring-2 ring-teal-400/30 shadow-xl shadow-teal-100/50'
                    : 'border-slate-200'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleTimeline(index)}
                  className="flex w-full items-center justify-between gap-3 p-4 sm:p-5 text-left"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-teal-400 to-teal-600 text-sm font-bold text-white shadow-md">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold uppercase tracking-wider text-teal-500">
                        {event.year || 'Year'}
                      </p>
                      <h3 className="text-sm sm:text-base font-semibold text-slate-900 line-clamp-1">
                        {event.title || 'Untitled Event'}
                      </h3>
                    </div>
                  </div>
                  <ChevronDown
                    size={18}
                    className={`flex-shrink-0 text-slate-400 transition-transform duration-300 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-500 ease-in-out ${
                    isOpen ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="border-t border-slate-100 bg-slate-50/50 p-4 sm:p-5 space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Field label="Year">
                        <input
                          className={formInput}
                          value={event.year}
                          onChange={(e) => updateTimelineEvent(index, { year: e.target.value })}
                          placeholder="2024"
                        />
                      </Field>
                      <Field label="Title">
                        <input
                          className={formInput}
                          value={event.title}
                          onChange={(e) => updateTimelineEvent(index, { title: e.target.value })}
                          placeholder="Event title"
                        />
                      </Field>
                      <Field label="Subtitle">
                        <input
                          className={formInput}
                          value={event.subtitle}
                          onChange={(e) => updateTimelineEvent(index, { subtitle: e.target.value })}
                          placeholder="Subtitle"
                        />
                      </Field>
                      <Field label="Category">
                        <select
                          className={formInput}
                          value={event.category}
                          onChange={(e) => updateTimelineEvent(index, { category: e.target.value })}
                        >
                          <option value="education">Education</option>
                          <option value="career">Career</option>
                          <option value="milestone">Milestone</option>
                          <option value="award">Award</option>
                        </select>
                      </Field>
                      <div className="sm:col-span-2">
                        <Field label="Icon">
                          <IconPicker
                            value={event.icon || 'sparkles'}
                            onChange={(v) => updateTimelineEvent(index, { icon: v })}
                          />
                        </Field>
                      </div>
                      <div className="sm:col-span-2">
                        <Field label="Description">
                          <textarea
                            className={formInput}
                            rows={3}
                            value={event.description}
                            onChange={(e) =>
                              updateTimelineEvent(index, { description: e.target.value })
                            }
                            placeholder="Event description"
                          />
                        </Field>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-200 pt-4">
                      <div className="flex gap-2">
                        <IconButton
                          label="Move up"
                          disabled={index === 0}
                          onClick={() => reorderTimeline(index, -1)}
                        >
                          <ArrowUp size={16} />
                        </IconButton>
                        <IconButton
                          label="Move down"
                          disabled={index === draft.events.length - 1}
                          onClick={() => reorderTimeline(index, 1)}
                        >
                          <ArrowDown size={16} />
                        </IconButton>
                      </div>
                      <IconButton label="Delete" danger onClick={() => removeTimelineEvent(index)}>
                        <Trash2 size={16} />
                      </IconButton>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  const renderIdentityEditor = () => {
    if (!draft || !Array.isArray(draft.identities)) return null
    return (
      <div className="space-y-6">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Identity Items</h2>
            <p className="mt-2 text-sm text-slate-600">{selectedSection.description}</p>
          </div>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-teal-500 to-teal-600 px-5 py-2.5 font-semibold text-white transition-all hover:shadow-xl hover:shadow-teal-500/30 hover:scale-105 active:scale-95"
            onClick={addIdentity}
          >
            <Plus size={18} /> Add Identity
          </button>
        </div>

        <div className="space-y-3">
          {draft.identities.map((identity, index) => {
            const isOpen = expandedIdentity.includes(index)
            return (
              <div
                key={identity.id || index}
                ref={identity.id === newItemId ? newItemRef : null}
                className={`rounded-2xl border bg-white/80 backdrop-blur-sm shadow-sm transition-all duration-300 hover:shadow-lg hover:border-teal-300 ${
                  identity.id === newItemId
                    ? 'border-teal-400 ring-2 ring-teal-400/30 shadow-xl shadow-teal-100/50'
                    : 'border-slate-200'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleIdentity(index)}
                  className="flex w-full items-center justify-between gap-3 p-4 sm:p-5 text-left"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-teal-400 to-teal-600 text-sm font-bold text-white shadow-md">
                      {identity.label.padStart(2, '0')}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold uppercase tracking-wider text-teal-500">
                        Identity {index + 1}
                      </p>
                      <h3 className="text-sm sm:text-base font-semibold text-slate-900 line-clamp-1">
                        {identity.title || 'Untitled'}
                      </h3>
                    </div>
                  </div>
                  <ChevronDown
                    size={18}
                    className={`flex-shrink-0 text-slate-400 transition-transform duration-300 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-500 ease-in-out ${
                    isOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="border-t border-slate-100 bg-slate-50/50 p-4 sm:p-5 space-y-4">
                    <Field label="Label">
                      <input
                        className={formInput}
                        value={identity.label}
                        onChange={(e) => updateIdentity(index, { label: e.target.value })}
                        placeholder="01"
                      />
                    </Field>
                    <Field label="Title">
                      <input
                        className={formInput}
                        value={identity.title}
                        onChange={(e) => updateIdentity(index, { title: e.target.value })}
                        placeholder="Identity title"
                      />
                    </Field>
                    <ImageUploadField
                      label="Identity Image"
                      value={identity.image_url}
                      onChange={(url) => updateIdentity(index, { image_url: url })}
                      onError={(err) => setError(err)}
                    />
                    <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-200 pt-4">
                      <div className="flex gap-2">
                        <IconButton
                          label="Move up"
                          disabled={index === 0}
                          onClick={() => reorderIdentities(index, -1)}
                        >
                          <ArrowUp size={16} />
                        </IconButton>
                        <IconButton
                          label="Move down"
                          disabled={index === draft.identities.length - 1}
                          onClick={() => reorderIdentities(index, 1)}
                        >
                          <ArrowDown size={16} />
                        </IconButton>
                      </div>
                      <IconButton label="Delete" danger onClick={() => removeIdentity(index)}>
                        <Trash2 size={16} />
                      </IconButton>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        {draft.identities.length === 0 && (
          <div className="rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-4 sm:px-8 py-12 text-center hover:border-teal-300 hover:bg-teal-50 transition-all">
            <p className="text-slate-600">No identity items yet. Add one to get started.</p>
          </div>
        )}
      </div>
    )
  }

  const renderTestimonialsEditor = () => {
    if (!draft) return null
    return (
      <div className="space-y-8">
        <div className="group rounded-2xl border border-slate-200 bg-white/80 backdrop-blur-sm p-5 sm:p-8 shadow-sm transition-all duration-300 hover:shadow-lg hover:border-teal-300">
          <div className="mb-6 border-b border-slate-200 pb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="text-teal-500 flex-shrink-0" size={28} />
              Testimonials Section
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Edit the tag, headline, description, and the call‑to‑action button.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            <Field label="Eyebrow (tag)" hint="Small label above the headline">
              <input
                className={formInput}
                value={draft.eyebrow || ''}
                onChange={(e) => setDraft((c) => ({ ...c, eyebrow: e.target.value }))}
                placeholder="Testimonials"
              />
            </Field>
            <Field label="Headline" hint="The big headline. Plain text only.">
              <input
                className={formInput}
                value={draft.title || ''}
                onChange={(e) => setDraft((c) => ({ ...c, title: e.target.value }))}
                placeholder="Trusted by Leaders Across Africa"
              />
            </Field>
            <div className="sm:col-span-2">
              <Field label="Description" hint="Supporting paragraph below the headline.">
                <textarea
                  className={formInput}
                  rows={4}
                  value={draft.description || ''}
                  onChange={(e) => setDraft((c) => ({ ...c, description: e.target.value }))}
                  placeholder="From government ministers to academic pioneers..."
                />
              </Field>
            </div>
            <Field label="CTA Button Text" hint="e.g. 'Share Your Story'">
              <input
                className={formInput}
                value={draft.cta_text || ''}
                onChange={(e) => setDraft((c) => ({ ...c, cta_text: e.target.value }))}
                placeholder="Share Your Story"
              />
            </Field>
            <Field label="CTA Button Link" hint="e.g. '/contact'">
              <input
                className={formInput}
                value={draft.cta_link || ''}
                onChange={(e) => setDraft((c) => ({ ...c, cta_link: e.target.value }))}
                placeholder="/contact"
              />
            </Field>
          </div>
        </div>

        {/* Live Preview */}
        <div className="rounded-2xl border border-teal-200 bg-gradient-to-br from-teal-50 to-cyan-50 p-6 sm:p-8">
          <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-teal-600 mb-4">
            Preview
          </p>
          <p className="text-xs font-semibold uppercase tracking-widest text-teal-700 mb-2">
            {draft.eyebrow || 'Testimonials'}
          </p>
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3">
            {draft.title || 'Trusted by Leaders Across Africa'}
          </h3>
          <p className="text-slate-600 text-sm mb-6">
            {draft.description || 'From government ministers to academic pioneers...'}
          </p>
          <button className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2 text-white font-semibold text-sm hover:bg-teal-700 transition-all">
            {draft.cta_text || 'Share Your Story'} →
          </button>
        </div>
      </div>
    )
  }

  // Generic editor for Vision, Framework, Leadership, Foundation, Awards
  const renderGenericEditor = () => {
    if (!draft) return null

    const blocks = Array.isArray(draft.blocks) ? draft.blocks : []
    const isLeadership = selectedSection.slug === 'leadership-philosophy'
    const isFoundation = selectedSection.slug === 'foundation'
    const isLiyana = selectedSection.slug === 'liyana-framework'
    const isRecognition = selectedSection.slug === 'recognition-awards'
    const isVision = selectedSection.slug === 'vision-agenda'

    return (
      <div className="space-y-8">
        <div className="space-y-6 lg:space-y-0 lg:grid lg:grid-cols-[1fr_320px] lg:gap-8">
          <div className="space-y-6">
            {/* Section Heading */}
            <div className="rounded-2xl border border-slate-200 bg-white/80 backdrop-blur-sm p-5 sm:p-8 shadow-sm transition-all duration-300 hover:shadow-lg hover:border-teal-300">
              <div className="mb-6 border-b border-slate-200 pb-6">
                <h2 className="text-2xl font-bold text-slate-900">{selectedSection.title}</h2>
                <p className="mt-2 text-sm text-slate-600">{selectedSection.description}</p>
              </div>

              {isVision && (
                <div className="grid gap-6">
                  <Field label="Eyebrow / Section Label" hint="Short label above headline">
                    <input
                      className={formInput}
                      value={draft.eyebrow ?? ''}
                      onChange={(e) => setDraft((c) => ({ ...c, eyebrow: e.target.value }))}
                      placeholder="e.g., My Story"
                    />
                  </Field>
                  <Field label="Headline — Line 1 (Normal text)">
                    <input
                      className={formInput}
                      value={draft.title ?? ''}
                      onChange={(e) => setDraft((c) => ({ ...c, title: e.target.value }))}
                      placeholder="e.g., One doctor's blueprint for a"
                    />
                  </Field>
                  <Field
                    label="Headline — Highlighted Text"
                    hint="This text will appear in the custom colour #0f6e56 on the site."
                  >
                    <input
                      className={formInput}
                      value={draft.title_highlight ?? ''}
                      onChange={(e) => setDraft((c) => ({ ...c, title_highlight: e.target.value }))}
                      placeholder="e.g., self-sufficient healthcare Africa"
                    />
                  </Field>
                </div>
              )}

              {isLeadership && (
                <div className="grid gap-6">
                  <Field label="Section Label">
                    <input
                      className={formInput}
                      value={draft.eyebrow ?? ''}
                      onChange={(e) => setDraft((c) => ({ ...c, eyebrow: e.target.value }))}
                      placeholder="e.g., Leadership Philosophy"
                    />
                  </Field>
                  <Field label="Quote Text">
                    <textarea
                      className={formInput}
                      rows={5}
                      value={draft.description ?? ''}
                      onChange={(e) => setDraft((c) => ({ ...c, description: e.target.value }))}
                      placeholder="e.g., Healthcare is not a privilege..."
                    />
                  </Field>
                  <Field label="Attribution">
                    <input
                      className={formInput}
                      value={draft.subtitle ?? ''}
                      onChange={(e) => setDraft((c) => ({ ...c, subtitle: e.target.value }))}
                      placeholder="e.g., Dr. Liyana, Founder & CEO"
                    />
                  </Field>
                </div>
              )}

              {isFoundation && (
                <div className="grid gap-6">
                  <Field label="Section Label">
                    <input
                      className={formInput}
                      value={draft.eyebrow ?? ''}
                      onChange={(e) => setDraft((c) => ({ ...c, eyebrow: e.target.value }))}
                      placeholder="e.g., The Foundation"
                    />
                  </Field>
                  <Field label="Section Title">
                    <textarea
                      className={formInput}
                      rows={2}
                      value={draft.title ?? ''}
                      onChange={(e) => setDraft((c) => ({ ...c, title: e.target.value }))}
                      placeholder="Enter the main title"
                    />
                  </Field>
                  <Field label="Intro Paragraph">
                    <textarea
                      className={formInput}
                      rows={4}
                      value={draft.description ?? ''}
                      onChange={(e) => setDraft((c) => ({ ...c, description: e.target.value }))}
                      placeholder="Write an introductory paragraph..."
                    />
                  </Field>
                </div>
              )}

              {!isVision && !isLeadership && !isFoundation && (
                <div className="grid gap-6 sm:grid-cols-2">
                  <Field label="Eyebrow / Section Label">
                    <input
                      className={formInput}
                      value={draft.eyebrow ?? ''}
                      onChange={(e) => setDraft((c) => ({ ...c, eyebrow: e.target.value }))}
                      placeholder="e.g., The Framework"
                    />
                  </Field>
                  <div className="sm:col-span-2">
                    <Field label="Title">
                      <textarea
                        className={formInput}
                        rows={2}
                        value={draft.title ?? ''}
                        onChange={(e) => setDraft((c) => ({ ...c, title: e.target.value }))}
                        placeholder="Enter the main title"
                      />
                    </Field>
                  </div>
                  <div className="sm:col-span-2">
                    <Field label="Subtitle / Supporting Text">
                      <input
                        className={formInput}
                        value={draft.subtitle ?? ''}
                        onChange={(e) => setDraft((c) => ({ ...c, subtitle: e.target.value }))}
                        placeholder="Supporting subtitle"
                      />
                    </Field>
                  </div>
                </div>
              )}
            </div>

            {/* Foundation Stats & Pillars */}
            {isFoundation && (
              <>
                {/* Stats */}
                <div className="rounded-2xl border border-slate-200 bg-white/80 backdrop-blur-sm p-5 sm:p-8 shadow-sm transition-all duration-300 hover:shadow-lg hover:border-teal-300">
                  <div className="mb-6 flex items-center justify-between border-b border-slate-200 pb-6">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">Foundation Stats</h3>
                      <p className="mt-1 text-sm text-slate-600">
                        Key numbers displayed as stat cards
                      </p>
                    </div>
                    <button
                      type="button"
                      className="inline-flex items-center gap-2 rounded-xl bg-teal-500 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-teal-600 hover:shadow-lg hover:scale-105 active:scale-95"
                      onClick={() =>
                        setDraft((c) => ({
                          ...c,
                          stats: [...(c.stats || []), { value: '', label: '' }],
                        }))
                      }
                    >
                      <Plus size={16} /> Add Stat
                    </button>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {(draft.stats || []).map((stat, index) => (
                      <div
                        key={index}
                        className="rounded-xl border border-slate-200 bg-slate-50 p-4 sm:p-5 hover:shadow-md hover:border-teal-300 transition-all"
                      >
                        <Field label="Number / Value">
                          <input
                            className={formInput}
                            value={stat.value || ''}
                            onChange={(e) => {
                              const stats = [...(draft.stats || [])]
                              stats[index] = { ...stats[index], value: e.target.value }
                              setDraft((c) => ({ ...c, stats }))
                            }}
                            placeholder="e.g., $10M"
                          />
                        </Field>
                        <div className="mt-3">
                          <Field label="Label">
                            <input
                              className={formInput}
                              value={stat.label || ''}
                              onChange={(e) => {
                                const stats = [...(draft.stats || [])]
                                stats[index] = { ...stats[index], label: e.target.value }
                                setDraft((c) => ({ ...c, stats }))
                              }}
                              placeholder="e.g., Raised"
                            />
                          </Field>
                        </div>
                        <div className="mt-4 flex justify-end">
                          <IconButton
                            label="Delete"
                            danger
                            onClick={() =>
                              setDraft((c) => ({
                                ...c,
                                stats: (c.stats || []).filter((_, i) => i !== index),
                              }))
                            }
                          >
                            <Trash2 size={16} />
                          </IconButton>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pillars – Accordion */}
                <div className="rounded-2xl border border-slate-200 bg-white/80 backdrop-blur-sm p-5 sm:p-8 shadow-sm transition-all duration-300 hover:shadow-lg hover:border-teal-300">
                  <div className="mb-6 flex items-center justify-between border-b border-slate-200 pb-6">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">Pillars</h3>
                      <p className="mt-1 text-sm text-slate-600">Manage foundation pillars</p>
                    </div>
                    <button
                      type="button"
                      className="inline-flex items-center gap-2 rounded-xl bg-teal-500 px-3 sm:px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-teal-600 hover:shadow-lg hover:scale-105 active:scale-95"
                      onClick={addBlock}
                    >
                      <Plus size={16} /> Add Pillar
                    </button>
                  </div>
                  <div className="space-y-3">
                    {blocks.length === 0 ? (
                      <div className="rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-4 sm:px-6 py-12 text-center hover:border-teal-300 hover:bg-teal-50 transition-all">
                        <p className="text-slate-600">
                          No pillars yet. Click "Add Pillar" to get started.
                        </p>
                      </div>
                    ) : (
                      blocks.map((block, index) => {
                        const isOpen = expandedBlock.includes(index)
                        const IconComp = getIconComponent(block.metadata?.icon || 'sparkles')
                        return (
                          <div
                            key={block.id || index}
                            ref={block.id === newItemId ? newItemRef : null}
                            className={`rounded-2xl border bg-white/80 backdrop-blur-sm shadow-sm transition-all duration-300 hover:shadow-lg hover:border-teal-300 ${
                              block.id === newItemId
                                ? 'border-teal-400 ring-2 ring-teal-400/30 shadow-xl shadow-teal-100/50'
                                : 'border-slate-200'
                            }`}
                          >
                            <button
                              type="button"
                              onClick={() => toggleBlock(index)}
                              className="flex w-full items-center justify-between gap-3 p-4 sm:p-5 text-left"
                            >
                              <div className="flex items-center gap-3 min-w-0 flex-1">
                                <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-teal-400 to-teal-600 text-sm font-bold text-white shadow-md">
                                  {String(index + 1).padStart(2, '0')}
                                </span>
                                <div className="flex items-center gap-2 min-w-0 flex-1">
                                  <IconComp size={16} className="text-teal-600 flex-shrink-0" />
                                  <div className="min-w-0 flex-1">
                                    <p className="text-xs font-semibold uppercase tracking-wider text-teal-500">
                                      Pillar {index + 1}
                                    </p>
                                    <h3 className="text-sm sm:text-base font-semibold text-slate-900 line-clamp-1">
                                      {block.title || 'Untitled Pillar'}
                                    </h3>
                                  </div>
                                </div>
                              </div>
                              <ChevronDown
                                size={18}
                                className={`flex-shrink-0 text-slate-400 transition-transform duration-300 ${
                                  isOpen ? 'rotate-180' : ''
                                }`}
                              />
                            </button>
                            <div
                              className={`overflow-hidden transition-all duration-500 ease-in-out ${
                                isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                              }`}
                            >
                              <div className="border-t border-slate-100 bg-slate-50/50 p-4 sm:p-5 space-y-4">
                                <Field label="Pillar Title">
                                  <input
                                    className={formInput}
                                    value={block.title || ''}
                                    onChange={(e) => updateBlock(index, { title: e.target.value })}
                                    placeholder="e.g., Community Health"
                                  />
                                </Field>
                                <div>
                                  <Field label="Icon">
                                    <IconPicker
                                      value={block.metadata?.icon || 'sparkles'}
                                      onChange={(v) => updateBlockMetadata(index, { icon: v })}
                                      allowedValues={FOUNDATION_ICONS}
                                    />
                                  </Field>
                                </div>
                                <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-200 pt-4">
                                  <div className="flex gap-2">
                                    <IconButton
                                      label="Move up"
                                      disabled={index === 0}
                                      onClick={() => reorderBlocks(index, -1)}
                                    >
                                      <ArrowUp size={16} />
                                    </IconButton>
                                    <IconButton
                                      label="Move down"
                                      disabled={index === blocks.length - 1}
                                      onClick={() => reorderBlocks(index, 1)}
                                    >
                                      <ArrowDown size={16} />
                                    </IconButton>
                                  </div>
                                  <IconButton
                                    label="Delete"
                                    danger
                                    onClick={() => removeBlock(index)}
                                  >
                                    <Trash2 size={16} />
                                  </IconButton>
                                </div>
                              </div>
                            </div>
                          </div>
                        )
                      })
                    )}
                  </div>
                </div>
              </>
            )}

            {/* Generic blocks (Framework, Awards, etc.) – Accordion */}
            {!isLeadership && !isFoundation && (
              <div className="rounded-2xl border border-slate-200 bg-white/80 backdrop-blur-sm p-5 sm:p-8 shadow-sm transition-all duration-300 hover:shadow-lg hover:border-teal-300">
                <div className="mb-6 flex items-center justify-between border-b border-slate-200 pb-6">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">
                      {selectedSection.blockLabel || 'Cards & Blocks'}
                    </h3>
                    <p className="mt-1 text-sm text-slate-600">
                      Manage every visible card in this section
                    </p>
                  </div>
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 rounded-xl bg-teal-500 px-3 sm:px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-teal-600 hover:shadow-lg hover:scale-105 active:scale-95"
                    onClick={addBlock}
                  >
                    <Plus size={16} /> Add {selectedSection.blockLabel || 'Card'}
                  </button>
                </div>

                <div className="space-y-3">
                  {blocks.length === 0 ? (
                    <div className="rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-4 sm:px-6 py-12 text-center hover:border-teal-300 hover:bg-teal-50 transition-all">
                      <p className="text-slate-600">
                        No cards yet. Click "Add {selectedSection.blockLabel || 'Card'}" to get
                        started.
                      </p>
                    </div>
                  ) : (
                    blocks.map((block, index) => {
                      const isOpen = expandedBlock.includes(index)
                      const cardLabel = block.eyebrow || block.metadata?.organization || ''
                      const cardTitle = block.title || 'Untitled'
                      const iconValue = block.metadata?.icon || 'sparkles'
                      const IconComp = getIconComponent(iconValue)

                      return (
                        <div
                          key={block.id || index}
                          ref={block.id === newItemId ? newItemRef : null}
                          className={`rounded-2xl border bg-white/80 backdrop-blur-sm shadow-sm transition-all duration-300 hover:shadow-lg hover:border-teal-300 ${
                            block.id === newItemId
                              ? 'border-teal-400 ring-2 ring-teal-400/30 shadow-xl shadow-teal-100/50'
                              : 'border-slate-200'
                          }`}
                        >
                          <button
                            type="button"
                            onClick={() => toggleBlock(index)}
                            className="flex w-full items-center justify-between gap-3 p-4 sm:p-5 text-left"
                          >
                            <div className="flex items-center gap-3 min-w-0 flex-1">
                              <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-teal-400 to-teal-600 text-sm font-bold text-white shadow-md">
                                {String(index + 1).padStart(2, '0')}
                              </span>
                              <div className="min-w-0 flex-1">
                                {cardLabel && (
                                  <p className="text-xs font-semibold uppercase tracking-wider text-teal-500">
                                    {cardLabel}
                                  </p>
                                )}
                                <div className="flex items-center gap-2 min-w-0">
                                  <IconComp size={16} className="text-teal-600 flex-shrink-0" />
                                  <h3 className="text-sm sm:text-base font-semibold text-slate-900 line-clamp-1">
                                    {cardTitle}
                                  </h3>
                                </div>
                              </div>
                            </div>
                            <ChevronDown
                              size={18}
                              className={`flex-shrink-0 text-slate-400 transition-transform duration-300 ${
                                isOpen ? 'rotate-180' : ''
                              }`}
                            />
                          </button>
                          <div
                            className={`overflow-hidden transition-all duration-500 ease-in-out ${
                              isOpen ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'
                            }`}
                          >
                            <div className="border-t border-slate-100 bg-slate-50/50 p-4 sm:p-5">
                              <div className="grid gap-4 sm:grid-cols-2">
                                {isVision && (
                                  <>
                                    <Field label="Label">
                                      <input
                                        className={formInput}
                                        value={block.eyebrow || ''}
                                        onChange={(e) =>
                                          updateBlock(index, { eyebrow: e.target.value })
                                        }
                                        placeholder="Card label"
                                      />
                                    </Field>
                                    <Field label="Title">
                                      <input
                                        className={formInput}
                                        value={block.title || ''}
                                        onChange={(e) =>
                                          updateBlock(index, { title: e.target.value })
                                        }
                                        placeholder="Card title"
                                      />
                                    </Field>
                                  </>
                                )}

                                {isLiyana && (
                                  <>
                                    <Field label="Label">
                                      <input
                                        className={formInput}
                                        value={block.eyebrow || ''}
                                        onChange={(e) =>
                                          updateBlock(index, { eyebrow: e.target.value })
                                        }
                                        placeholder="e.g., 01"
                                      />
                                    </Field>
                                    <Field label="Title">
                                      <input
                                        className={formInput}
                                        value={block.title || ''}
                                        onChange={(e) =>
                                          updateBlock(index, { title: e.target.value })
                                        }
                                        placeholder="Framework item title"
                                      />
                                    </Field>
                                    <div className="sm:col-span-2">
                                      <Field label="Description">
                                        <textarea
                                          className={formInput}
                                          rows={3}
                                          value={stripHtml(
                                            block.body || block.metadata?.description || '',
                                          )}
                                          onChange={(e) =>
                                            updateBlock(index, { body: e.target.value })
                                          }
                                          placeholder="Write a short description..."
                                        />
                                      </Field>
                                    </div>
                                    <div className="sm:col-span-2">
                                      <Field label="Icon">
                                        <IconPicker
                                          value={block.metadata?.icon || 'sparkles'}
                                          onChange={(v) => updateBlockMetadata(index, { icon: v })}
                                        />
                                      </Field>
                                    </div>
                                  </>
                                )}

                                {isRecognition && (
                                  <>
                                    <div className="sm:col-span-2">
                                      <Field label="Award Title">
                                        <input
                                          className={formInput}
                                          value={block.title || ''}
                                          onChange={(e) =>
                                            updateBlock(index, { title: e.target.value })
                                          }
                                          placeholder="e.g., Healthcare Leader of the Year"
                                        />
                                      </Field>
                                    </div>
                                    <div className="sm:col-span-2">
                                      <Field label="Description">
                                        <textarea
                                          className={formInput}
                                          rows={3}
                                          value={stripHtml(
                                            block.body || block.metadata?.description || '',
                                          )}
                                          onChange={(e) =>
                                            updateBlock(index, { body: e.target.value })
                                          }
                                          placeholder="Write a short description..."
                                        />
                                      </Field>
                                    </div>
                                    <Field label="Awarding Organization">
                                      <input
                                        className={formInput}
                                        value={block.metadata?.organization || ''}
                                        onChange={(e) =>
                                          updateBlockMetadata(index, {
                                            organization: e.target.value,
                                          })
                                        }
                                        placeholder="Organization name"
                                      />
                                    </Field>
                                    <Field label="Year Received">
                                      <input
                                        className={formInput}
                                        value={block.metadata?.year || ''}
                                        onChange={(e) =>
                                          updateBlockMetadata(index, { year: e.target.value })
                                        }
                                        placeholder="e.g., 2023"
                                      />
                                    </Field>
                                    <div className="sm:col-span-2">
                                      <Field label="Category">
                                        <input
                                          className={formInput}
                                          value={block.metadata?.category || ''}
                                          onChange={(e) =>
                                            updateBlockMetadata(index, { category: e.target.value })
                                          }
                                          placeholder="Award category"
                                        />
                                      </Field>
                                    </div>
                                    <div className="sm:col-span-2">
                                      <ImageUploadField
                                        label="Award Image / Badge"
                                        value={block.image_url}
                                        onChange={(url) => updateBlock(index, { image_url: url })}
                                        onError={(err) => setError(err)}
                                      />
                                    </div>
                                  </>
                                )}
                              </div>

                              <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-slate-200 pt-4">
                                <div className="flex gap-2">
                                  <IconButton
                                    label="Move up"
                                    disabled={index === 0}
                                    onClick={() => reorderBlocks(index, -1)}
                                  >
                                    <ArrowUp size={16} />
                                  </IconButton>
                                  <IconButton
                                    label="Move down"
                                    disabled={index === blocks.length - 1}
                                    onClick={() => reorderBlocks(index, 1)}
                                  >
                                    <ArrowDown size={16} />
                                  </IconButton>
                                </div>
                                <IconButton
                                  label="Delete"
                                  danger
                                  onClick={() => removeBlock(index)}
                                >
                                  <Trash2 size={16} />
                                </IconButton>
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    })
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Live Preview Sidebar - Hidden on mobile, visible on lg */}
          <aside className="hidden lg:block space-y-6">
            <div className="sticky top-8 space-y-6">
              <div className="rounded-2xl border border-slate-200 bg-white/80 backdrop-blur-md p-6 shadow-sm hover:shadow-lg transition-all">
                <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                  <Zap size={14} className="text-amber-500" /> Live Preview
                </h3>
                {isVision && (
                  <div className="rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-4 py-6 hover:bg-teal-50 hover:border-teal-300 transition-all">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                      {draft.eyebrow || 'Section label'}
                    </p>
                    <h4 className="mt-3 text-lg font-bold leading-snug text-slate-900">
                      {draft.title || 'Headline line 1'}
                      <br />
                      {draft.title_highlight ? (
                        <span style={{ color: '#0f6e56' }} className="font-black">
                          {draft.title_highlight}
                        </span>
                      ) : (
                        <span className="text-slate-300">Highlighted text</span>
                      )}
                    </h4>
                  </div>
                )}
                {isLeadership && (
                  <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-teal-900 to-teal-700 px-6 py-8 text-white hover:shadow-lg transition-all">
                    <p className="mb-4 font-mono text-[9px] tracking-[0.3em] uppercase text-white/50">
                      {draft.eyebrow || 'Future Vision'}
                    </p>
                    <div className="mx-auto mb-6 h-px w-12 bg-white/20" />
                    <blockquote className="font-serif text-base italic font-light leading-relaxed text-white/85">
                      &ldquo;{draft.description || 'Your quote will appear here'}&rdquo;
                    </blockquote>
                    {draft.subtitle && <div className="mt-6 h-px w-16 bg-amber-400/40 mx-auto" />}
                    {draft.subtitle && (
                      <p className="mt-4 text-center text-xs font-semibold tracking-wider text-white/60">
                        — {draft.subtitle}
                      </p>
                    )}
                  </div>
                )}
                {isFoundation && (
                  <div className="rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-4 py-5 hover:bg-teal-50 hover:border-teal-300 transition-all">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                      {draft.eyebrow || 'Section label'}
                    </p>
                    <h4 className="mt-2 text-base font-bold text-slate-900">
                      {draft.title || 'Title'}
                    </h4>
                    {draft.description && (
                      <p className="mt-2 text-xs text-slate-600 line-clamp-3">
                        {draft.description}
                      </p>
                    )}
                  </div>
                )}
                {!isVision && !isLeadership && !isFoundation && (
                  <div className="rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-4 py-6 hover:bg-teal-50 hover:border-teal-300 transition-all">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                      {draft.eyebrow || 'Section label'}
                    </p>
                    <h4 className="mt-3 text-lg font-bold text-slate-900">
                      {draft.title || selectedSection.title}
                    </h4>
                    {draft.subtitle && (
                      <p className="mt-1 text-sm text-slate-500">{draft.subtitle}</p>
                    )}
                  </div>
                )}
              </div>
              <div className="rounded-2xl border border-teal-100 bg-gradient-to-br from-teal-50 to-cyan-50 p-6 hover:shadow-lg hover:border-teal-300 transition-all">
                <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-teal-900">
                  <Sparkles size={16} className="text-teal-600" /> Editing Guide
                </h3>
                <p className="text-sm leading-relaxed text-teal-800">{selectedSection.hint}</p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    )
  }

  // ------------------------------------------------------------------
  // MAIN RENDER
  // ------------------------------------------------------------------
  if (isLoading || !draft) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100/60">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 bg-gradient-to-r from-teal-400 to-cyan-400 rounded-full animate-spin opacity-20" />
            <Loader2 size={32} className="animate-spin text-teal-500 absolute inset-0 m-auto" />
          </div>
          <p className="text-sm text-slate-600 animate-pulse">Loading story content...</p>
        </div>
      </div>
    )
  }

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6 sm:py-10">
        <div className="mb-8 sm:mb-10 flex flex-col items-start justify-between gap-4 sm:gap-6">
          <div className="w-full">
            <p className="text-xs font-bold uppercase tracking-widest text-teal-600 flex items-center gap-2">
              <Zap size={14} /> Story Editor
            </p>
            <h1 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900">
              {selectedSection.title}
            </h1>
            <p className="mt-3 max-w-3xl text-sm sm:text-base text-slate-600">
              {selectedSection.description}
            </p>
          </div>
          <button
            type="button"
            onClick={saveSection}
            disabled={isSaving}
            className="w-full sm:w-auto inline-flex items-center justify-center sm:justify-start gap-2 rounded-xl bg-gradient-to-r from-teal-500 to-teal-600 px-6 py-3 font-semibold text-white transition-all hover:shadow-xl hover:shadow-teal-500/30 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 duration-200"
          >
            {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>

        {selectedSection.type === 'timeline'
          ? renderTimelineEditor()
          : selectedSection.type === 'identities'
            ? renderIdentityEditor()
            : selectedSection.type === 'testimonials'
              ? renderTestimonialsEditor()
              : renderGenericEditor()}

        <Toast message={message} error={error} />
      </div>
    </section>
  )
}
