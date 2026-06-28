/* eslint-disable @typescript-eslint/no-explicit-any, react-hooks/set-state-in-effect */
import { useEffect, useRef, useState } from 'react'
import {
  AlertCircle,
  ArrowDown,
  ArrowUp,
  CheckCircle2,
  ChevronDown,
  Eye,
  Loader2,
  Plus,
  Save,
  Sparkles,
  Trash2,
  Upload,
  Zap,
} from 'lucide-react'
import api from '../api'

// ------------------------------------------------------------------
// Helpers
// ------------------------------------------------------------------
const formInput =
  'w-full rounded-xl border border-slate-200 bg-white/70 backdrop-blur px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/10 focus:bg-white shadow-sm hover:border-emerald-300 hover:shadow-md'

const labelClass = 'mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-600'

interface FieldProps {
  label: string
  children: React.ReactNode
  hint?: string
}

const Field = ({ label, children, hint }: FieldProps) => (
  <label className="block">
    <span className={labelClass}>{label}</span>
    {children}
    {hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
  </label>
)

interface IconButtonProps {
  label: string
  onClick: () => void
  children: React.ReactNode
  disabled?: boolean
  danger?: boolean
}

const IconButton = ({ label, onClick, children, disabled, danger = false }: IconButtonProps) => (
  <button
    type="button"
    aria-label={label}
    disabled={disabled}
    onClick={onClick}
    className={`inline-flex h-9 w-9 items-center justify-center rounded-lg transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-40 ${
      danger
        ? 'bg-red-50 text-red-600 hover:bg-red-100'
        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
    }`}
  >
    {children}
  </button>
)

interface ToastProps {
  message: string
  error: string
}

const Toast = ({ message, error }: ToastProps) => {
  if (!message && !error) return null
  return (
    <div
      className={`fixed bottom-6 right-6 flex items-center gap-3 rounded-lg px-5 py-3.5 text-sm font-medium shadow-lg ${
        error ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-700'
      }`}
    >
      {error ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
      <span>{message || error}</span>
    </div>
  )
}

const readLocalImage = (
  file: File | undefined,
  onLoad: (url: string) => void,
  onError: () => void,
) => {
  if (!file) return
  const reader = new FileReader()
  reader.onload = () => onLoad(String(reader.result || ''))
  reader.onerror = onError
  reader.readAsDataURL(file)
}

// ------------------------------------------------------------------
// Reusable sub‑components
// ------------------------------------------------------------------
function EditorShell({
  title,
  saving,
  onSave,
  message,
  error,
  children,
}: {
  title: string
  saving: boolean
  onSave: () => void
  message: string
  error: string
  children: React.ReactNode
}) {
  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100/60">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-emerald-600 flex items-center gap-2">
              <Zap size={14} /> {title} Editor
            </p>
            <h1 className="mt-3 text-4xl font-bold text-slate-900">{title}</h1>
          </div>
          <button
            onClick={onSave}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-6 py-3 font-semibold text-white transition-all hover:shadow-xl hover:shadow-emerald-500/30 active:scale-[0.98] disabled:opacity-50"
          >
            {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            <span>{saving ? 'Saving...' : 'Save All Changes'}</span>
          </button>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
          <div className="space-y-8">{children}</div>

          <aside className="space-y-6">
            <div className="sticky top-8 space-y-6">
              <div className="rounded-2xl border border-slate-200 bg-white/80 backdrop-blur-md p-6 shadow-sm hover:shadow-lg transition-all">
                <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                  <Eye size={14} className="text-emerald-500" /> Live Preview
                </h3>
                <div className="rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-slate-900 min-h-[160px]">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                    JOURNEY
                  </p>
                  <p className="mt-2 text-sm text-slate-600">
                    All changes are stored in the database.
                  </p>
                </div>
              </div>
              <div className="rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-emerald-100 p-6">
                <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-emerald-900">
                  <Sparkles size={16} className="text-emerald-600" /> Editing Guide
                </h3>
                <p className="text-sm leading-relaxed text-emerald-800">
                  Click <strong>Save All Changes</strong> to persist your edits.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
      <Toast message={message} error={error} />
    </section>
  )
}

function Card({
  title,
  description,
  onAdd,
  children,
}: {
  title: string
  description?: string
  onAdd?: () => void
  children: React.ReactNode
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white/80 backdrop-blur-sm p-6 sm:p-8 shadow-sm transition-all duration-300 hover:shadow-lg hover:border-emerald-300">
      <div className="mb-6 flex items-center justify-between border-b border-slate-200 pb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
          {description && <p className="mt-2 text-sm text-slate-600">{description}</p>}
        </div>
        {onAdd && (
          <button
            onClick={onAdd}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-4 py-2 font-semibold text-white transition-all hover:shadow-xl hover:shadow-emerald-500/30 active:scale-95"
          >
            <Plus size={18} /> Add
          </button>
        )}
      </div>
      {children}
    </div>
  )
}

function ExpandableItem({
  idx,
  expanded,
  setExpanded,
  headerLabel,
  headerValue,
  children,
  onUp,
  onDown,
  onDelete,
  upDisabled,
  downDisabled,
  isFocused,
  refProp,
}: {
  idx: number
  expanded: string[]
  setExpanded: React.Dispatch<React.SetStateAction<string[]>>
  headerLabel: string
  headerValue: string
  children: React.ReactNode
  onUp: () => void
  onDown: () => void
  onDelete: () => void
  upDisabled: boolean
  downDisabled: boolean
  isFocused: boolean
  refProp: React.RefObject<HTMLDivElement | null>
}) {
  const isOpen = expanded.includes(String(idx))
  return (
    <div
      ref={isFocused ? refProp : null}
      className={`rounded-2xl border bg-white/80 backdrop-blur-sm shadow-sm transition-all duration-300 hover:shadow-lg hover:border-emerald-300 hover:scale-[1.01] cursor-pointer ${
        isFocused
          ? 'border-emerald-400 ring-2 ring-emerald-400/30 shadow-xl shadow-emerald-100/50'
          : 'border-slate-200'
      }`}
    >
      <button
        onClick={() =>
          setExpanded((prev) =>
            prev.includes(String(idx))
              ? prev.filter((i) => i !== String(idx))
              : [...prev, String(idx)],
          )
        }
        className="flex w-full items-center justify-between p-5 text-left"
      >
        <div className="flex items-center gap-4">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 text-sm font-bold text-white shadow-md">
            {String(idx + 1).padStart(2, '0')}
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600">
              {headerLabel}
            </p>
            <h3 className="text-base font-semibold text-slate-900 line-clamp-1">{headerValue}</h3>
          </div>
        </div>
        <ChevronDown
          size={18}
          className={`text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-[900px] opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <div className="border-t border-slate-100 bg-slate-50/50 p-5 space-y-4">
          {children}
          <div className="flex items-center justify-between gap-2 border-t border-slate-200 pt-4">
            <div className="flex gap-2">
              <IconButton label="Move up" disabled={upDisabled} onClick={onUp}>
                <ArrowUp size={16} />
              </IconButton>
              <IconButton label="Move down" disabled={downDisabled} onClick={onDown}>
                <ArrowDown size={16} />
              </IconButton>
            </div>
            <IconButton label="Delete" danger onClick={onDelete}>
              <Trash2 size={16} />
            </IconButton>
          </div>
        </div>
      </div>
    </div>
  )
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center hover:border-emerald-300 hover:bg-emerald-50 transition-all">
      <p className="text-slate-600">{message}</p>
    </div>
  )
}

// ------------------------------------------------------------------
// Types
// ------------------------------------------------------------------

interface Block {
  id: string | number
  block_type: string
  title: string
  body: string
  metadata?: Record<string, string>
  sort_order: number
  image_url?: string
  image_alt?: string
}

interface JourneyDraft {
  events: {
    id: string | number
    year: string
    title: string
    sort_order: number
    image_url?: string
  }[]
  about: {
    eyebrow: string
    title: string
    description: string
    image_url: string
    image_alt: string
    blocks: Block[]
  }
  principles: {
    eyebrow: string
    title: string
    description: string
    blocks: Block[]
  }
  vision: {
    eyebrow: string
    title: string
    description: string
    blocks: Block[]
  }
  philosophy: {
    eyebrow: string
    title: string
    description: string
    subtitle: string
    blocks: Block[]
  }
}

// ------------------------------------------------------------------
// Main Component
// ------------------------------------------------------------------

export default function JourneyEditor() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [deletedIds, setDeletedIds] = useState<(string | number)[]>([])
  const [draft, setDraft] = useState<JourneyDraft | null>(null)

  // Expand/collapse states
  const [expandedChapters, setExpandedChapters] = useState<string[]>([])
  const [expandedPrinciples, setExpandedPrinciples] = useState<string[]>([])
  const [expandedQuotes, setExpandedQuotes] = useState<string[]>([])
  const [expandedEvents, setExpandedEvents] = useState<string[]>([])

  const newRef = useRef<HTMLDivElement | null>(null)
  const [focusId, setFocusId] = useState<string | null>(null)

  // Focus effect
  useEffect(() => {
    if (focusId && newRef.current) {
      newRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
      const timer = setTimeout(() => {
        const firstInput = newRef.current?.querySelector('input, textarea') as HTMLElement | null
        firstInput?.focus()
      }, 350)
      return () => clearTimeout(timer)
    }
    const reset = setTimeout(() => setFocusId(null), 2500)
    return () => clearTimeout(reset)
  }, [focusId])

  // Fetch data
  useEffect(() => {
    let active = true
    const load = async () => {
      setLoading(true)
      try {
        const response = await api.get('/cms/site-content')
        if (!active) return
        const data = response.data
        const timeline = (data.timelineEvents || []).map((event: any) => ({
          id: event.id,
          year: event.year || '',
          title: event.title || '',
          sort_order: event.sort_order || 0,
          image_url: event.image_url || '',
        }))
        const about = data.sections?.about_story || {}
        const philosophy = data.sections?.leadership_philosophy || {}
        const principles = data.sections?.about_values || {}
        const vision = data.sections?.about_vision || {}
        setDraft({
          events: timeline,
          about: {
            eyebrow: about.eyebrow || '',
            title: about.title || '',
            description: about.description || '',
            image_url: about.image_url || '',
            image_alt: about.image_alt || '',
            blocks: about.blocks || [],
          },
          principles: {
            eyebrow: principles.eyebrow || '',
            title: principles.title || '',
            description: principles.description || '',
            blocks: principles.blocks || [],
          },
          vision: {
            eyebrow: vision.eyebrow || '',
            title: vision.title || '',
            description: vision.description || '',
            blocks: vision.blocks || [],
          },
          philosophy: {
            eyebrow: philosophy.eyebrow || '',
            title: philosophy.title || '',
            description: philosophy.description || '',
            subtitle: philosophy.subtitle || '',
            blocks: philosophy.blocks || [],
          },
        })
      } catch {
        if (active) setError('Unable to load Journey content.')
      } finally {
        if (active) setLoading(false)
      }
    }
    load()
    return () => {
      active = false
    }
  }, [])

  // --------------- Helper functions for each section ---------------
  const updateAbout = (patch: Partial<JourneyDraft['about']>) =>
    setDraft((current) => current && { ...current, about: { ...current.about, ...patch } })

  const addChapter = () => {
    setDraft((current) => {
      if (!current) return current
      const newBlock: Block = {
        id: `new-${Date.now()}`,
        block_type: 'chapter',
        title: 'New Chapter',
        body: '',
        sort_order: (current.about.blocks || []).length + 1,
      }
      setExpandedChapters((prev) => [...prev, String(current.about.blocks.length)])
      setFocusId(newBlock.id as string)
      return {
        ...current,
        about: {
          ...current.about,
          blocks: [...current.about.blocks, newBlock],
        },
      }
    })
  }

  const updateChapter = (index: number, patch: Partial<Block>) =>
    setDraft((current) => {
      if (!current) return current
      return {
        ...current,
        about: {
          ...current.about,
          blocks: current.about.blocks.map((b, i) => (i === index ? { ...b, ...patch } : b)),
        },
      }
    })

  const removeChapter = (index: number) =>
    setDraft((current) => {
      if (!current) return current
      return {
        ...current,
        about: { ...current.about, blocks: current.about.blocks.filter((_, i) => i !== index) },
      }
    })

  const reorderChapter = (index: number, direction: number) =>
    setDraft((current) => {
      if (!current) return current
      const blocks = [...current.about.blocks]
      const target = index + direction
      if (target < 0 || target >= blocks.length) return current
      ;[blocks[index], blocks[target]] = [blocks[target], blocks[index]]
      return { ...current, about: { ...current.about, blocks } }
    })

  // Principles
  const updatePrinciples = (patch: Partial<JourneyDraft['principles']>) =>
    setDraft(
      (current) => current && { ...current, principles: { ...current.principles, ...patch } },
    )

  const addPrinciple = () => {
    setDraft((current) => {
      if (!current) return current
      const newBlock: Block = {
        id: `new-${Date.now()}`,
        block_type: 'value',
        title: 'New Principle',
        body: '',
        sort_order: (current.principles.blocks || []).length + 1,
      }
      setExpandedPrinciples((prev) => [...prev, String(current.principles.blocks.length)])
      setFocusId(newBlock.id as string)
      return {
        ...current,
        principles: {
          ...current.principles,
          blocks: [...current.principles.blocks, newBlock],
        },
      }
    })
  }

  const updatePrinciple = (index: number, patch: Partial<Block>) =>
    setDraft((current) => {
      if (!current) return current
      return {
        ...current,
        principles: {
          ...current.principles,
          blocks: current.principles.blocks.map((b, i) => (i === index ? { ...b, ...patch } : b)),
        },
      }
    })

  const removePrinciple = (index: number) =>
    setDraft((current) => {
      if (!current) return current
      return {
        ...current,
        principles: {
          ...current.principles,
          blocks: current.principles.blocks.filter((_, i) => i !== index),
        },
      }
    })

  const reorderPrinciple = (index: number, direction: number) =>
    setDraft((current) => {
      if (!current) return current
      const blocks = [...current.principles.blocks]
      const target = index + direction
      if (target < 0 || target >= blocks.length) return current
      ;[blocks[index], blocks[target]] = [blocks[target], blocks[index]]
      return { ...current, principles: { ...current.principles, blocks } }
    })

  // Leadership Philosophy
  const updatePhilosophy = (patch: Partial<JourneyDraft['philosophy']>) =>
    setDraft(
      (current) => current && { ...current, philosophy: { ...current.philosophy, ...patch } },
    )

  const addQuote = () => {
    setDraft((current) => {
      if (!current) return current
      const newBlock: Block = {
        id: `new-${Date.now()}`,
        block_type: 'quote',
        body: '',
        title: '',
        sort_order: (current.philosophy.blocks || []).length + 1,
      }
      setExpandedQuotes((prev) => [...prev, String(current.philosophy.blocks.length)])
      setFocusId(newBlock.id as string)
      return {
        ...current,
        philosophy: {
          ...current.philosophy,
          blocks: [...current.philosophy.blocks, newBlock],
        },
      }
    })
  }

  const updateQuote = (index: number, patch: Partial<Block>) =>
    setDraft((current) => {
      if (!current) return current
      return {
        ...current,
        philosophy: {
          ...current.philosophy,
          blocks: current.philosophy.blocks.map((b, i) => (i === index ? { ...b, ...patch } : b)),
        },
      }
    })

  const removeQuote = (index: number) =>
    setDraft((current) => {
      if (!current) return current
      return {
        ...current,
        philosophy: {
          ...current.philosophy,
          blocks: current.philosophy.blocks.filter((_, i) => i !== index),
        },
      }
    })

  const reorderQuote = (index: number, direction: number) =>
    setDraft((current) => {
      if (!current) return current
      const blocks = [...current.philosophy.blocks]
      const target = index + direction
      if (target < 0 || target >= blocks.length) return current
      ;[blocks[index], blocks[target]] = [blocks[target], blocks[index]]
      return { ...current, philosophy: { ...current.philosophy, blocks } }
    })

  // Vision
  const updateVision = (patch: Partial<JourneyDraft['vision']>) =>
    setDraft((current) => current && { ...current, vision: { ...current.vision, ...patch } })

  // Timeline Events
  const addEvent = () => {
    setDraft((current) => {
      if (!current) return current
      const newEvent = {
        id: `new-${Date.now()}`,
        year: '',
        title: '',
        sort_order: (current.events || []).length + 1,
        image_url: '',
      }
      setExpandedEvents((prev) => [...prev, String(current.events.length)])
      setFocusId(newEvent.id as string)
      return { ...current, events: [...current.events, newEvent] }
    })
  }

  const updateEvent = (index: number, patch: Partial<JourneyDraft['events'][number]>) =>
    setDraft((current) => {
      if (!current) return current
      return {
        ...current,
        events: current.events.map((item, i) => (i === index ? { ...item, ...patch } : item)),
      }
    })

  const removeEvent = (index: number) => {
    setDraft((current) => {
      if (!current) return current
      const removed = current.events[index]
      if (typeof removed?.id === 'number') setDeletedIds((ids) => [...ids, removed.id])
      return { ...current, events: current.events.filter((_, i) => i !== index) }
    })
  }

  const reorderEvent = (index: number, direction: number) =>
    setDraft((current) => {
      if (!current) return current
      const next = [...current.events]
      const target = index + direction
      if (target < 0 || target >= next.length) return current
      ;[next[index], next[target]] = [next[target], next[index]]
      return { ...current, events: next }
    })

  const updateEventImage = (index: number, file: File | undefined) =>
    readLocalImage(
      file,
      (url) => updateEvent(index, { image_url: url }),
      () => setError('Could not read image.'),
    )

  const updateAboutImage = (file: File | undefined) =>
    readLocalImage(
      file,
      (url) => updateAbout({ image_url: url }),
      () => setError('Could not read image.'),
    )

  // --------------- Save ---------------
  const save = async () => {
    if (!draft) return
    setMessage('')
    setError('')
    setSaving(true)
    try {
      for (const id of deletedIds) {
        await api.delete(`/cms/timeline-events/${id}`)
      }
      for (const [index, event] of (draft.events || []).entries()) {
        const payload = {
          year: event.year || null,
          title: event.title || '',
          sort_order: index + 1,
        }
        if (typeof event.id === 'number') await api.put(`/cms/timeline-events/${event.id}`, payload)
        else await api.post('/cms/timeline-events', payload)
      }
      if (draft.about) {
        await api.put('/cms/sections/about_story', {
          section: {
            eyebrow: draft.about.eyebrow,
            title: draft.about.title,
            description: draft.about.description,
            image_url: draft.about.image_url,
            image_alt: draft.about.image_alt,
          },
          blocks: draft.about.blocks || [],
        })
      }
      if (draft.vision) {
        await api.put('/cms/sections/about_vision', {
          section: {
            eyebrow: draft.vision.eyebrow,
            title: draft.vision.title,
            description: draft.vision.description,
          },
          blocks: draft.vision.blocks || [],
        })
      }
      if (draft.philosophy) {
        await api.put('/cms/sections/leadership_philosophy', {
          section: {
            eyebrow: draft.philosophy.eyebrow,
            title: draft.philosophy.title,
            description: draft.philosophy.description,
            subtitle: draft.philosophy.subtitle,
          },
          blocks: draft.philosophy.blocks || [],
        })
      }
      if (draft.principles) {
        await api.put('/cms/sections/about_values', {
          section: {
            eyebrow: draft.principles.eyebrow,
            title: draft.principles.title,
            description: draft.principles.description,
          },
          blocks: draft.principles.blocks || [],
        })
      }

      setMessage('✨ Journey saved successfully!')
      setDeletedIds([])
      setTimeout(() => setMessage(''), 3000)

      // Refresh
      const response = await api.get('/cms/site-content')
      const data = response.data
      const timeline = (data.timelineEvents || []).map((event: any) => ({
        id: event.id,
        year: event.year || '',
        title: event.title || '',
        sort_order: event.sort_order || 0,
        image_url: event.image_url || '',
      }))
      const about = data.sections?.about_story || {}
      const philosophy = data.sections?.leadership_philosophy || {}
      const principles = data.sections?.about_values || {}
      const vision = data.sections?.about_vision || {}
      setDraft({
        events: timeline,
        about: {
          eyebrow: about.eyebrow || '',
          title: about.title || '',
          description: about.description || '',
          image_url: about.image_url || '',
          image_alt: about.image_alt || '',
          blocks: about.blocks || [],
        },
        principles: {
          eyebrow: principles.eyebrow || '',
          title: principles.title || '',
          description: principles.description || '',
          blocks: principles.blocks || [],
        },
        vision: {
          eyebrow: vision.eyebrow || '',
          title: vision.title || '',
          description: vision.description || '',
          blocks: vision.blocks || [],
        },
        philosophy: {
          eyebrow: philosophy.eyebrow || '',
          title: philosophy.title || '',
          description: philosophy.description || '',
          subtitle: philosophy.subtitle || '',
          blocks: philosophy.blocks || [],
        },
      })
    } catch {
      setError('Could not save Journey. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  if (loading || !draft) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="animate-spin text-emerald-500" size={32} />
        <p className="ml-3 text-slate-600">Loading Journey...</p>
      </div>
    )
  }

  return (
    <EditorShell title="Journey" saving={saving} onSave={save} message={message} error={error}>
      {/* About Story Card */}
      <Card title="About Story" description="Header and chapter blocks." onAdd={addChapter}>
        <div className="grid gap-6 md:grid-cols-2 mb-6">
          <Field label="Eyebrow">
            <input
              className={formInput}
              value={draft.about.eyebrow}
              onChange={(e) => updateAbout({ eyebrow: e.target.value })}
            />
          </Field>
          <Field label="Title (HTML)">
            <input
              className={formInput}
              value={draft.about.title}
              onChange={(e) => updateAbout({ title: e.target.value })}
            />
          </Field>
          <Field label="Image URL">
            <div className="flex gap-2">
              <input
                className={formInput}
                value={draft.about.image_url || ''}
                onChange={(e) => updateAbout({ image_url: e.target.value })}
              />
              <label className="inline-flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-slate-200 bg-slate-100 text-slate-600 transition-all hover:bg-slate-200">
                <Upload size={18} />
                <input
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={(e) => updateAboutImage(e.target.files?.[0])}
                />
              </label>
            </div>
          </Field>
          <Field label="Image Alt">
            <input
              className={formInput}
              value={draft.about.image_alt || ''}
              onChange={(e) => updateAbout({ image_alt: e.target.value })}
            />
          </Field>
          <div className="md:col-span-2">
            <Field label="Description">
              <textarea
                className={formInput}
                rows={4}
                value={draft.about.description}
                onChange={(e) => updateAbout({ description: e.target.value })}
              />
            </Field>
          </div>
        </div>

        {draft.about.blocks.length === 0 ? (
          <EmptyState message="No chapters yet. Add one to get started." />
        ) : (
          draft.about.blocks.map((block, idx) => (
            <ExpandableItem
              key={block.id || idx}
              idx={idx}
              expanded={expandedChapters}
              setExpanded={setExpandedChapters}
              headerLabel={`Chapter ${idx + 1}`}
              headerValue={block.title || 'Untitled'}
              isFocused={focusId === String(block.id)}
              refProp={newRef}
              onUp={() => reorderChapter(idx, -1)}
              onDown={() => reorderChapter(idx, 1)}
              onDelete={() => removeChapter(idx)}
              upDisabled={idx === 0}
              downDisabled={idx === draft.about.blocks.length - 1}
            >
              <Field label="Title">
                <input
                  className={formInput}
                  value={block.title}
                  onChange={(e) => updateChapter(idx, { title: e.target.value })}
                />
              </Field>
              <Field label="Body">
                <textarea
                  className={formInput}
                  rows={5}
                  value={block.body}
                  onChange={(e) => updateChapter(idx, { body: e.target.value })}
                />
              </Field>
              <Field label="Order">
                <input
                  className={formInput}
                  type="number"
                  value={block.sort_order || idx + 1}
                  onChange={(e) => updateChapter(idx, { sort_order: Number(e.target.value) })}
                />
              </Field>
            </ExpandableItem>
          ))
        )}
      </Card>

      {/* Principles Card */}
      <Card
        title="Principles (Values)"
        description="Core principles and values."
        onAdd={addPrinciple}
      >
        <div className="grid gap-6 md:grid-cols-2 mb-6">
          <Field label="Eyebrow">
            <input
              className={formInput}
              value={draft.principles.eyebrow}
              onChange={(e) => updatePrinciples({ eyebrow: e.target.value })}
            />
          </Field>
          <Field label="Title (HTML)">
            <input
              className={formInput}
              value={draft.principles.title}
              onChange={(e) => updatePrinciples({ title: e.target.value })}
            />
          </Field>
          <div className="md:col-span-2">
            <Field label="Description">
              <textarea
                className={formInput}
                rows={4}
                value={draft.principles.description}
                onChange={(e) => updatePrinciples({ description: e.target.value })}
              />
            </Field>
          </div>
        </div>

        {draft.principles.blocks.length === 0 ? (
          <EmptyState message="No principles yet." />
        ) : (
          draft.principles.blocks.map((block, idx) => (
            <ExpandableItem
              key={block.id || idx}
              idx={idx}
              expanded={expandedPrinciples}
              setExpanded={setExpandedPrinciples}
              headerLabel="Principle"
              headerValue={block.title || 'Untitled'}
              isFocused={focusId === String(block.id)}
              refProp={newRef}
              onUp={() => reorderPrinciple(idx, -1)}
              onDown={() => reorderPrinciple(idx, 1)}
              onDelete={() => removePrinciple(idx)}
              upDisabled={idx === 0}
              downDisabled={idx === draft.principles.blocks.length - 1}
            >
              <Field label="Title">
                <input
                  className={formInput}
                  value={block.title}
                  onChange={(e) => updatePrinciple(idx, { title: e.target.value })}
                />
              </Field>
              <Field label="Description">
                <textarea
                  className={formInput}
                  rows={4}
                  value={block.body}
                  onChange={(e) => updatePrinciple(idx, { body: e.target.value })}
                />
              </Field>
              <Field label="Order">
                <input
                  className={formInput}
                  type="number"
                  value={block.sort_order || idx + 1}
                  onChange={(e) => updatePrinciple(idx, { sort_order: Number(e.target.value) })}
                />
              </Field>
            </ExpandableItem>
          ))
        )}
      </Card>

      {/* Leadership Philosophy Card */}
      <Card
        title="Leadership Philosophy"
        description="Quotes and philosophy section."
        onAdd={addQuote}
      >
        <div className="grid gap-6 md:grid-cols-2 mb-6">
          <Field label="Eyebrow">
            <input
              className={formInput}
              value={draft.philosophy.eyebrow}
              onChange={(e) => updatePhilosophy({ eyebrow: e.target.value })}
            />
          </Field>
          <Field label="Title">
            <input
              className={formInput}
              value={draft.philosophy.title}
              onChange={(e) => updatePhilosophy({ title: e.target.value })}
            />
          </Field>
          <div className="md:col-span-2">
            <Field label="Primary Quote">
              <textarea
                className={formInput}
                rows={4}
                value={draft.philosophy.description}
                onChange={(e) => updatePhilosophy({ description: e.target.value })}
              />
            </Field>
          </div>
          <Field label="Attribution">
            <input
              className={formInput}
              value={draft.philosophy.subtitle}
              onChange={(e) => updatePhilosophy({ subtitle: e.target.value })}
            />
          </Field>
        </div>

        {draft.philosophy.blocks.length === 0 ? (
          <EmptyState message="No quotes yet." />
        ) : (
          draft.philosophy.blocks.map((block, idx) => (
            <ExpandableItem
              key={block.id || idx}
              idx={idx}
              expanded={expandedQuotes}
              setExpanded={setExpandedQuotes}
              headerLabel="Quote"
              headerValue={block.body ? block.body.slice(0, 50) + '...' : 'Untitled'}
              isFocused={focusId === String(block.id)}
              refProp={newRef}
              onUp={() => reorderQuote(idx, -1)}
              onDown={() => reorderQuote(idx, 1)}
              onDelete={() => removeQuote(idx)}
              upDisabled={idx === 0}
              downDisabled={idx === draft.philosophy.blocks.length - 1}
            >
              <Field label="Quote Text">
                <textarea
                  className={formInput}
                  rows={4}
                  value={block.body}
                  onChange={(e) => updateQuote(idx, { body: e.target.value })}
                />
              </Field>
              <Field label="Attribution">
                <input
                  className={formInput}
                  value={block.title}
                  onChange={(e) => updateQuote(idx, { title: e.target.value })}
                />
              </Field>
            </ExpandableItem>
          ))
        )}
      </Card>

      {/* Vision Card */}
      <Card title="Vision">
        <div className="grid gap-6 md:grid-cols-2">
          <Field label="Eyebrow">
            <input
              className={formInput}
              value={draft.vision.eyebrow}
              onChange={(e) => updateVision({ eyebrow: e.target.value })}
            />
          </Field>
          <Field label="Title">
            <input
              className={formInput}
              value={draft.vision.title}
              onChange={(e) => updateVision({ title: e.target.value })}
            />
          </Field>
          <div className="md:col-span-2">
            <Field label="Quote / Description">
              <textarea
                className={formInput}
                rows={4}
                value={draft.vision.description}
                onChange={(e) => updateVision({ description: e.target.value })}
              />
            </Field>
          </div>
        </div>
      </Card>

      {/* Timeline Events Card */}
      <Card title="Timeline Events" description="Chronological events." onAdd={addEvent}>
        {draft.events.length === 0 ? (
          <EmptyState message="No events yet." />
        ) : (
          draft.events.map((event, idx) => (
            <ExpandableItem
              key={event.id || idx}
              idx={idx}
              expanded={expandedEvents}
              setExpanded={setExpandedEvents}
              headerLabel={event.year || 'Year'}
              headerValue={event.title || 'Untitled Event'}
              isFocused={focusId === String(event.id)}
              refProp={newRef}
              onUp={() => reorderEvent(idx, -1)}
              onDown={() => reorderEvent(idx, 1)}
              onDelete={() => removeEvent(idx)}
              upDisabled={idx === 0}
              downDisabled={idx === draft.events.length - 1}
            >
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Year">
                  <input
                    className={formInput}
                    value={event.year}
                    onChange={(e) => updateEvent(idx, { year: e.target.value })}
                  />
                </Field>
                <Field label="Title">
                  <input
                    className={formInput}
                    value={event.title}
                    onChange={(e) => updateEvent(idx, { title: e.target.value })}
                  />
                </Field>
              </div>
              {/* Image upload */}
              <div className="flex items-center gap-3">
                <Field label="Image URL">
                  <input
                    className={formInput}
                    value={event.image_url || ''}
                    onChange={(e) => updateEvent(idx, { image_url: e.target.value })}
                    placeholder="Image URL"
                  />
                </Field>
                <label className="inline-flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-slate-200 bg-slate-100 text-slate-600 transition-all hover:bg-slate-200 mt-5">
                  <Upload size={18} />
                  <input
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={(e) => updateEventImage(idx, e.target.files?.[0])}
                  />
                </label>
              </div>
            </ExpandableItem>
          ))
        )}
      </Card>
    </EditorShell>
  )
}
