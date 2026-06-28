/* eslint-disable react-hooks/set-state-in-effect */
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
  Wallet,
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  Zap,
} from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../api'
import MediaPicker from '../components/MediaPicker'
import ConfirmDialog from '../components/ConfirmDialog'
import UndoButton from '../components/UndoButton'

/* ─── Interfaces ─────────────────────────────────────────── */
interface StorySection {
  slug: string
  title: string
  description: string
  backendSlug?: string
  type?: 'timeline'
  blockLabel?: string
  hint?: string
}

interface RawSectionData {
  eyebrow?: string
  title?: string
  subtitle?: string
  description?: string
  image_url?: string
  image_alt?: string
  metadata?: {
    title_highlight?: string
    cta?: Record<string, string>[]
    metrics?: { value: string; label: string }[]
    stats?: { value: string; label: string }[]
    icon?: string
  }
  blocks?: RawBlock[]
}

interface RawBlock {
  id?: number
  block_type: string
  eyebrow: string
  title: string
  body: string
  image_url: string
  image_alt: string
  metadata: Record<string, unknown>
  sort_order: number
}

interface RawTimelineEvent {
  id: number
  year?: string
  title?: string
  subtitle?: string
  description?: string
  category?: string
  icon?: string
  sort_order?: number
}

interface SiteContent {
  sections: Record<string, RawSectionData>
  timelineEvents?: RawTimelineEvent[]
}

interface SectionDraft {
  eyebrow: string
  title: string
  subtitle: string
  title_highlight: string
  description: string
  image_url: string
  image_alt: string
  buttons: Record<string, string>[]
  metrics: { value: string; label: string }[]
  stats: { value: string; label: string }[]
  blocks: DraftBlock[]
  icon: string
}

interface DraftBlock {
  id: string | number
  block_type: string
  eyebrow: string
  title: string
  body: string
  image_url: string
  image_alt: string
  metadata: Record<string, string>
  sort_order: number
}

interface TimelineEventDraft {
  id: string | number
  year: string
  title: string
  subtitle: string
  description: string
  category: string
  icon: string
  sort_order?: number
}

type Draft = { events: TimelineEventDraft[] } | SectionDraft | null

/* ─── Constants ──────────────────────────────────────────── */
const STORY_SECTIONS: StorySection[] = [
  {
    slug: 'vision-agenda',
    title: 'The Visionary Agenda',
    description: 'Hero story opener with identity cards and bold positioning.',
    backendSlug: 'vision_agenda',
    hint: 'Fill in each headline field separately using plain text only — no HTML or code.',
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
    hint: 'Edit the heading, intro text, pillars, and stat cards.',
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
] as const

const FOUNDATION_ICONS = [
  'heart-pulse',
  'graduation-cap',
  'hospital',
  'handshake',
  'landmark',
  'microscope',
  'sparkles',
] as const

function getIconComponent(iconValue: string) {
  const found = ICON_OPTIONS.find((opt) => opt.value === iconValue)
  return found ? found.Icon : Sparkles
}

function reorderArray<T>(arr: T[], idx: number, dir: number) {
  const next = [...arr]
  const target = idx + dir
  if (target < 0 || target >= next.length) return arr
  ;[next[idx], next[target]] = [next[target], next[idx]]
  return next
}

/* ─── Styles ─────────────────────────────────────────────── */
const formInput =
  'w-full rounded-xl border border-slate-200 bg-white/70 px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition-all placeholder:text-slate-400 hover:border-teal-300 hover:shadow-md focus:border-teal-400 focus:bg-white focus:ring-4 focus:ring-teal-500/10'

const labelClass = 'mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-600'

/* ─── Shared UI Components ──────── */
function Field({
  label,
  children,
  hint,
}: {
  label: string
  children: React.ReactNode
  hint?: string
}) {
  return (
    <label className="block">
      <span className={labelClass}>{label}</span>
      {children}
      {hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
    </label>
  )
}

function IconButton({
  label,
  onClick,
  children,
  disabled,
  danger = false,
}: {
  label: string
  onClick: () => void
  children: React.ReactNode
  disabled?: boolean
  danger?: boolean
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={onClick}
      className={`inline-flex h-9 w-9 items-center justify-center rounded-lg transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-40 ${
        danger
          ? 'bg-red-50 text-red-600 hover:scale-110 hover:bg-red-100 active:scale-95'
          : 'bg-slate-100 text-slate-600 hover:scale-110 hover:bg-slate-200 active:scale-95'
      }`}
    >
      {children}
    </button>
  )
}

function Toast({ message, error }: { message: string; error: string }) {
  if (!message && !error) return null
  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-lg px-5 py-3.5 text-sm font-medium shadow-lg transition-all duration-300 animate-in slide-in-from-right max-w-xs ${
        error ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-700'
      }`}
    >
      {error ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
      <span>{message || error}</span>
    </div>
  )
}

function IconPicker({
  value,
  onChange,
  allowedValues,
}: {
  value: string
  onChange: (v: string) => void
  allowedValues?: readonly string[]
}) {
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

function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center transition-all hover:border-teal-300 hover:bg-teal-50">
      <p className="text-slate-600">{message}</p>
    </div>
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
    <div className="rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur-sm transition-all duration-300 hover:border-teal-300 hover:shadow-lg sm:p-8">
      <div className="mb-6 flex items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
          {description && <p className="mt-2 text-sm text-slate-600">{description}</p>}
        </div>
        {onAdd && (
          <button
            type="button"
            onClick={onAdd}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-teal-500 to-teal-600 px-4 py-2 font-semibold text-white transition-all hover:shadow-xl hover:shadow-teal-500/30 active:scale-95"
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
  const itemKey = String(idx)
  const isOpen = expanded.includes(itemKey)

  return (
    <div
      ref={isFocused ? refProp : null}
      className={`cursor-pointer rounded-2xl border bg-white/80 shadow-sm backdrop-blur-sm transition-all duration-300 hover:scale-[1.01] hover:border-teal-300 hover:shadow-lg ${
        isFocused
          ? 'border-teal-400 shadow-xl shadow-teal-100/50 ring-2 ring-teal-400/30'
          : 'border-slate-200'
      }`}
    >
      <button
        type="button"
        onClick={() =>
          setExpanded((current) =>
            current.includes(itemKey)
              ? current.filter((item) => item !== itemKey)
              : [...current, itemKey],
          )
        }
        className="flex w-full items-center justify-between gap-4 p-5 text-left"
      >
        <div className="flex min-w-0 items-center gap-4">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-teal-400 to-teal-600 text-sm font-bold text-white shadow-md">
            {String(idx + 1).padStart(2, '0')}
          </span>
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wider text-teal-600">
              {headerLabel}
            </p>
            <h3 className="truncate text-base font-semibold text-slate-900">{headerValue}</h3>
          </div>
        </div>
        <ChevronDown
          size={18}
          className={`shrink-0 text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-[900px] opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <div className="space-y-4 border-t border-slate-100 bg-slate-50/50 p-5">
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

function EditorShell({
  saving,
  onSave,
  message,
  error,
  title,
  children,
  undoButton,
}: {
  saving: boolean
  onSave: () => void
  message: string
  error: string
  title: string
  children: React.ReactNode
  undoButton?: React.ReactNode
}) {
  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100/60">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-10 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-teal-600">
              <Zap size={14} /> {title} Editor
            </p>
            <h1 className="mt-3 text-4xl font-bold text-slate-900">{title}</h1>
          </div>
          <div className="flex items-center gap-3">
            {undoButton}
            <button
              type="button"
              onClick={onSave}
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-teal-500 to-teal-600 px-6 py-3 font-semibold text-white transition-all hover:shadow-xl hover:shadow-teal-500/30 active:scale-[0.98] disabled:opacity-50"
            >
              {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
              <span>{saving ? 'Saving...' : 'Save All Changes'}</span>
            </button>
          </div>
        </div>

        <div className="space-y-8">{children}</div>
      </div>
      <Toast message={message} error={error} />
    </section>
  )
}

/* ─── Helper ─────────────────────────────────────────────── */
function stripHtml(html = '') {
  return html.replace(/<[^>]*>/g, '').trim()
}

function buildSectionDraft(section: RawSectionData = {}): SectionDraft {
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
    blocks: (section.blocks || []).map(
      (b: RawBlock, idx: number): DraftBlock => ({
        id: b.id ?? `block-${idx}`,
        block_type: b.block_type,
        eyebrow: b.eyebrow,
        title: b.title,
        body: b.body,
        image_url: b.image_url,
        image_alt: b.image_alt,
        metadata: (b.metadata || {}) as Record<string, string>,
        sort_order: b.sort_order,
      }),
    ),
    icon: section.metadata?.icon || '',
  }
}

function buildTimelineEvents(events: RawTimelineEvent[] = []): TimelineEventDraft[] {
  return events.map((event) => ({
    id: event.id,
    year: event.year || '',
    title: event.title || '',
    subtitle: event.subtitle || '',
    description: event.description || '',
    category: event.category || 'milestone',
    icon: event.icon || '',
    sort_order: event.sort_order || 0,
  }))
}

/* ─── Main Component ─────────────────────────────────────── */
export default function StoryEditor() {
  const { sectionSlug } = useParams<{ sectionSlug: string }>()
  const navigate = useNavigate()
  const [content, setContent] = useState<SiteContent | null>(null)
  const [draft, setDraft] = useState<Draft>(null)
  const [backup, setBackup] = useState<Draft>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [deletedTimelineIds, setDeletedTimelineIds] = useState<number[]>([])
  const [newItemId, setNewItemId] = useState<string | null>(null)
  const newItemRef = useRef<HTMLDivElement | null>(null)

  const [deleteTimelineIdx, setDeleteTimelineIdx] = useState<number | null>(null)
  const [deleteBlockIdx, setDeleteBlockIdx] = useState<number | null>(null)
  const [deleteMetricIdx, setDeleteMetricIdx] = useState<number | null>(null)
  const [deleteStatIdx, setDeleteStatIdx] = useState<number | null>(null)

  const [expandedTimeline, setExpandedTimeline] = useState<string[]>([])
  const [expandedBlock, setExpandedBlock] = useState<string[]>([])

  const selectedSection = useMemo(
    () => STORY_SECTIONS.find((s) => s.slug === sectionSlug) ?? STORY_SECTIONS[0],
    [sectionSlug],
  )

  useEffect(() => {
    if (!sectionSlug) navigate(`/story/${STORY_SECTIONS[0].slug}`, { replace: true })
  }, [navigate, sectionSlug])

  useEffect(() => {
    setMessage('')
    setError('')
    setDeletedTimelineIds([])
    setNewItemId(null)
  }, [sectionSlug, selectedSection])

  useEffect(() => {
    let active = true
    const load = async () => {
      setIsLoading(true)
      setError('')
      try {
        const response = await api.get('/cms/site-content')
        if (!active) return
        setContent(response.data as SiteContent)
      } catch {
        if (!active) return
        setError('Unable to load Story content.')
      } finally {
        if (active) setIsLoading(false)
      }
    }
    load()
    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    if (!content) return
    let newDraft: Draft
    if (selectedSection.type === 'timeline') {
      const events = buildTimelineEvents(content.timelineEvents || [])
      newDraft = { events }
    } else if (selectedSection.backendSlug) {
      newDraft = buildSectionDraft(content.sections?.[selectedSection.backendSlug] || {})
    } else {
      newDraft = buildSectionDraft({})
    }
    setDraft(newDraft)
    setBackup(structuredClone(newDraft))
  }, [content, selectedSection])

  useEffect(() => {
    if (newItemId && newItemRef.current) {
      setTimeout(() => {
        newItemRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
        const firstInput = newItemRef.current?.querySelector(
          'input, textarea',
        ) as HTMLElement | null
        firstInput?.focus()
      }, 300)
      const reset = setTimeout(() => setNewItemId(null), 2500)
      return () => clearTimeout(reset)
    }
  }, [newItemId])

  const handleUndo = () => {
    if (backup) setDraft(structuredClone(backup))
  }

  /* Timeline handlers */
  const addTimelineEvent = () => {
    setDraft((c) => {
      if (!c || !('events' in c)) return c
      const idx = c.events.length
      const id = `new-${Date.now()}`
      setTimeout(() => {
        setExpandedTimeline((prev) => [...prev, String(idx)])
        setNewItemId(id)
      }, 0)
      return {
        ...c,
        events: [
          ...c.events,
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

  const updateTimelineEvent = (index: number, patch: Partial<TimelineEventDraft>) =>
    setDraft((c) => {
      if (!c || !('events' in c)) return c
      return {
        ...c,
        events: c.events.map((item, i) => (i === index ? { ...item, ...patch } : item)),
      }
    })

  const reorderTimeline = (index: number, direction: number) =>
    setDraft((c) => {
      if (!c || !('events' in c)) return c
      return { ...c, events: reorderArray(c.events, index, direction) }
    })

  /* Generic block handlers */
  const addBlock = () => {
    setDraft((c) => {
      if (!c || !('blocks' in c)) return c
      const idx = c.blocks.length
      const id = `new-${Date.now()}`
      setTimeout(() => {
        setExpandedBlock((prev) => [...prev, String(idx)])
        setNewItemId(id)
      }, 0)
      // Determine the correct block type for the current section
      const defaultBlockType =
        c.blocks.length > 0 ? c.blocks[0].block_type : isVision ? 'identity_card' : 'content'
      return {
        ...c,
        blocks: [
          ...c.blocks,
          {
            id,
            block_type: defaultBlockType,
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

  const updateBlock = (index: number, patch: Partial<DraftBlock>) =>
    setDraft((c) => {
      if (!c || !('blocks' in c)) return c
      return {
        ...c,
        blocks: c.blocks.map((b, i) => (i === index ? { ...b, ...patch } : b)),
      }
    })

  const updateBlockMetadata = (index: number, patch: Record<string, string>) =>
    setDraft((c) => {
      if (!c || !('blocks' in c)) return c
      return {
        ...c,
        blocks: c.blocks.map((b, i) =>
          i === index ? { ...b, metadata: { ...b.metadata, ...patch } } : b,
        ),
      }
    })

  const reorderBlocks = (index: number, direction: number) =>
    setDraft((c) => {
      if (!c || !('blocks' in c)) return c
      return { ...c, blocks: reorderArray(c.blocks, index, direction) }
    })

  /* Save */
  const saveSection = async () => {
    if (!draft || !selectedSection) return
    setMessage('')
    setError('')
    setIsSaving(true)
    try {
      if (selectedSection.type === 'timeline' && 'events' in draft) {
        for (const deletedId of deletedTimelineIds)
          await api.delete(`/cms/timeline-events/${deletedId}`)
        for (const [i, event] of draft.events.entries()) {
          const payload = { ...event, sort_order: i + 1 }
          if (typeof event.id === 'number') {
            await api.put(`/cms/timeline-events/${event.id}`, payload)
          } else {
            // Remove temporary id before POST
            const { id, ...p } = payload
            await api.post('/cms/timeline-events', p)
          }
        }
        setDeletedTimelineIds([])
      } else if ('blocks' in draft && selectedSection.backendSlug) {
        const cleanBlocks = draft.blocks.map((b) => {
          if (typeof b.id === 'string') {
            const { id, ...rest } = b
            return rest
          }
          return b
        })
        await api.put(`/cms/sections/${selectedSection.backendSlug}`, {
          section: {
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
          },
          blocks: cleanBlocks,
        })
      }
      const response = await api.get('/cms/site-content')
      setContent(response.data as SiteContent)
      setMessage('Saved successfully.')
    } catch {
      setError('Could not save. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading || !draft) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100/60">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-teal-500" size={32} />
          <p className="text-sm text-slate-600 animate-pulse">Loading story content...</p>
        </div>
      </div>
    )
  }

  const blocks = 'blocks' in draft ? draft.blocks : []
  const isLeadership = selectedSection.slug === 'leadership-philosophy'
  const isFoundation = selectedSection.slug === 'foundation'
  const isLiyana = selectedSection.slug === 'liyana-framework'
  const isRecognition = selectedSection.slug === 'recognition-awards'
  const isVision = selectedSection.slug === 'vision-agenda'

  return (
    <EditorShell
      saving={isSaving}
      onSave={saveSection}
      message={message}
      error={error}
      title="Story"
      undoButton={<UndoButton onClick={handleUndo} />}
    >
      {/* Timeline Editor */}
      {selectedSection.type === 'timeline' && 'events' in draft && (
        <Card
          title="Career Timeline"
          description={selectedSection.description}
          onAdd={addTimelineEvent}
        >
          {draft.events.length === 0 ? (
            <EmptyState message="No events yet. Add one to get started." />
          ) : (
            draft.events.map((event, index) => (
              <ExpandableItem
                key={event.id || index}
                idx={index}
                expanded={expandedTimeline}
                setExpanded={setExpandedTimeline}
                headerLabel={event.year || 'Year'}
                headerValue={event.title || 'Untitled Event'}
                isFocused={event.id === newItemId}
                refProp={newItemRef}
                onUp={() => reorderTimeline(index, -1)}
                onDown={() => reorderTimeline(index, 1)}
                onDelete={() => setDeleteTimelineIdx(index)}
                upDisabled={index === 0}
                downDisabled={index === draft.events.length - 1}
              >
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
                        onChange={(v: string) => updateTimelineEvent(index, { icon: v })}
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
              </ExpandableItem>
            ))
          )}
        </Card>
      )}

      {/* Generic sections */}
      {!selectedSection.type && 'blocks' in draft && (
        <div className="space-y-6">
          {/* Section Header Card */}
          <Card title={selectedSection.title} description={selectedSection.description}>
            {isVision && (
              <div className="grid gap-6">
                <Field label="Eyebrow / Section Label" hint="Short label above headline">
                  <input
                    className={formInput}
                    value={draft.eyebrow ?? ''}
                    onChange={(e) =>
                      setDraft((c) => (c && 'blocks' in c ? { ...c, eyebrow: e.target.value } : c))
                    }
                    placeholder="e.g., My Story"
                  />
                </Field>
                <Field label="Headline — Line 1 (Normal text)">
                  <input
                    className={formInput}
                    value={draft.title ?? ''}
                    onChange={(e) =>
                      setDraft((c) => (c && 'blocks' in c ? { ...c, title: e.target.value } : c))
                    }
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
                    onChange={(e) =>
                      setDraft((c) =>
                        c && 'blocks' in c ? { ...c, title_highlight: e.target.value } : c,
                      )
                    }
                    placeholder="e.g., self-sufficient healthcare Africa"
                  />
                </Field>
                <Field label="Hero Image">
                  <MediaPicker
                    currentUrl={draft.image_url}
                    onUpload={(url) =>
                      setDraft((c) => (c && 'blocks' in c ? { ...c, image_url: url } : c))
                    }
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
                    onChange={(e) =>
                      setDraft((c) => (c && 'blocks' in c ? { ...c, eyebrow: e.target.value } : c))
                    }
                    placeholder="e.g., Leadership Philosophy"
                  />
                </Field>
                <Field label="Quote Text">
                  <textarea
                    className={formInput}
                    rows={5}
                    value={draft.description ?? ''}
                    onChange={(e) =>
                      setDraft((c) =>
                        c && 'blocks' in c ? { ...c, description: e.target.value } : c,
                      )
                    }
                    placeholder="e.g., Healthcare is not a privilege..."
                  />
                </Field>
                <Field label="Attribution">
                  <input
                    className={formInput}
                    value={draft.subtitle ?? ''}
                    onChange={(e) =>
                      setDraft((c) => (c && 'blocks' in c ? { ...c, subtitle: e.target.value } : c))
                    }
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
                    onChange={(e) =>
                      setDraft((c) => (c && 'blocks' in c ? { ...c, eyebrow: e.target.value } : c))
                    }
                    placeholder="e.g., The Foundation"
                  />
                </Field>
                <Field label="Section Title">
                  <textarea
                    className={formInput}
                    rows={2}
                    value={draft.title ?? ''}
                    onChange={(e) =>
                      setDraft((c) => (c && 'blocks' in c ? { ...c, title: e.target.value } : c))
                    }
                    placeholder="Enter the main title"
                  />
                </Field>
                <Field label="Intro Paragraph">
                  <textarea
                    className={formInput}
                    rows={4}
                    value={draft.description ?? ''}
                    onChange={(e) =>
                      setDraft((c) =>
                        c && 'blocks' in c ? { ...c, description: e.target.value } : c,
                      )
                    }
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
                    onChange={(e) =>
                      setDraft((c) => (c && 'blocks' in c ? { ...c, eyebrow: e.target.value } : c))
                    }
                    placeholder="e.g., The Framework"
                  />
                </Field>
                <div className="sm:col-span-2">
                  <Field label="Title">
                    <textarea
                      className={formInput}
                      rows={2}
                      value={draft.title ?? ''}
                      onChange={(e) =>
                        setDraft((c) => (c && 'blocks' in c ? { ...c, title: e.target.value } : c))
                      }
                      placeholder="Enter the main title"
                    />
                  </Field>
                </div>
                <div className="sm:col-span-2">
                  <Field label="Subtitle / Supporting Text">
                    <input
                      className={formInput}
                      value={draft.subtitle ?? ''}
                      onChange={(e) =>
                        setDraft((c) =>
                          c && 'blocks' in c ? { ...c, subtitle: e.target.value } : c,
                        )
                      }
                      placeholder="Supporting subtitle"
                    />
                  </Field>
                </div>
              </div>
            )}
          </Card>

          {/* Foundation Stats Card */}
          {isFoundation && (
            <Card
              title="Foundation Stats"
              description="Key numbers displayed as stat cards"
              onAdd={() =>
                setDraft((c) =>
                  c && 'blocks' in c ? { ...c, stats: [...c.stats, { value: '', label: '' }] } : c,
                )
              }
            >
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {draft.stats.map((stat, index) => (
                  <div
                    key={index}
                    className="rounded-xl border border-slate-200 bg-slate-50 p-5 hover:shadow-md hover:border-teal-300 transition-all"
                  >
                    <Field label="Number / Value">
                      <input
                        className={formInput}
                        value={stat.value || ''}
                        onChange={(e) => {
                          const stats = [...draft.stats]
                          stats[index] = { ...stats[index], value: e.target.value }
                          setDraft((c) => (c && 'blocks' in c ? { ...c, stats } : c))
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
                            const stats = [...draft.stats]
                            stats[index] = { ...stats[index], label: e.target.value }
                            setDraft((c) => (c && 'blocks' in c ? { ...c, stats } : c))
                          }}
                          placeholder="e.g., Raised"
                        />
                      </Field>
                    </div>
                    <div className="mt-4 flex justify-end">
                      <IconButton
                        label="Delete stat"
                        danger
                        onClick={() => setDeleteStatIdx(index)}
                      >
                        <Trash2 size={16} />
                      </IconButton>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Blocks Card (framework items, pillars, awards, identity cards) */}
          {!isLeadership && (
            <Card
              title={selectedSection.blockLabel || 'Cards & Blocks'}
              description="Manage every visible card in this section"
              onAdd={addBlock}
            >
              {blocks.length === 0 ? (
                <EmptyState
                  message={`No ${selectedSection.blockLabel?.toLowerCase() || 'cards'} yet. Add one to get started.`}
                />
              ) : (
                blocks.map((block, index) => {
                  const cardLabel = block.eyebrow || block.metadata?.organization || ''
                  const cardTitle = block.title || 'Untitled'
                  // Only compute icon for sections that actually display one
                  const showIcon = isLiyana || isRecognition || isFoundation
                  const IconComp = showIcon
                    ? getIconComponent(block.metadata?.icon || 'sparkles')
                    : null

                  return (
                    <ExpandableItem
                      key={block.id || index}
                      idx={index}
                      expanded={expandedBlock}
                      setExpanded={setExpandedBlock}
                      headerLabel={
                        isFoundation
                          ? `Pillar ${index + 1}`
                          : isVision
                            ? `Identity ${index + 1}`
                            : cardLabel || 'Item'
                      }
                      headerValue={cardTitle}
                      isFocused={block.id === newItemId}
                      refProp={newItemRef}
                      onUp={() => reorderBlocks(index, -1)}
                      onDown={() => reorderBlocks(index, 1)}
                      onDelete={() => setDeleteBlockIdx(index)}
                      upDisabled={index === 0}
                      downDisabled={index === blocks.length - 1}
                    >
                      <div className="grid gap-4 sm:grid-cols-2">
                        {/* Liyana Framework fields */}
                        {isLiyana && (
                          <>
                            <Field label="Label">
                              <input
                                className={formInput}
                                value={block.eyebrow || ''}
                                onChange={(e) => updateBlock(index, { eyebrow: e.target.value })}
                                placeholder="e.g., 01"
                              />
                            </Field>
                            <Field label="Title">
                              <input
                                className={formInput}
                                value={block.title || ''}
                                onChange={(e) => updateBlock(index, { title: e.target.value })}
                                placeholder="Framework item title"
                              />
                            </Field>
                            <div className="sm:col-span-2">
                              <Field label="Description">
                                <textarea
                                  className={formInput}
                                  rows={3}
                                  value={stripHtml(block.body || '')}
                                  onChange={(e) => updateBlock(index, { body: e.target.value })}
                                  placeholder="Write a short description..."
                                />
                              </Field>
                            </div>
                            <div className="sm:col-span-2">
                              <Field label="Icon">
                                <IconPicker
                                  value={block.metadata?.icon || 'sparkles'}
                                  onChange={(v: string) => updateBlockMetadata(index, { icon: v })}
                                />
                              </Field>
                            </div>
                          </>
                        )}

                        {/* Recognition Awards fields */}
                        {isRecognition && (
                          <>
                            <div className="sm:col-span-2">
                              <Field label="Award Title">
                                <input
                                  className={formInput}
                                  value={block.title || ''}
                                  onChange={(e) => updateBlock(index, { title: e.target.value })}
                                  placeholder="e.g., Healthcare Leader of the Year"
                                />
                              </Field>
                            </div>
                            <div className="sm:col-span-2">
                              <Field label="Description">
                                <textarea
                                  className={formInput}
                                  rows={3}
                                  value={stripHtml(block.body || '')}
                                  onChange={(e) => updateBlock(index, { body: e.target.value })}
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
                                    updateBlockMetadata(index, {
                                      category: e.target.value,
                                    })
                                  }
                                  placeholder="Award category"
                                />
                              </Field>
                            </div>
                            <div className="sm:col-span-2">
                              <Field label="Award Image / Badge">
                                <MediaPicker
                                  currentUrl={block.image_url}
                                  onUpload={(url) => updateBlock(index, { image_url: url })}
                                />
                              </Field>
                            </div>
                          </>
                        )}

                        {/* Foundation Pillar fields */}
                        {isFoundation && (
                          <>
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
                                  onChange={(v: string) => updateBlockMetadata(index, { icon: v })}
                                  allowedValues={FOUNDATION_ICONS}
                                />
                              </Field>
                            </div>
                          </>
                        )}

                        {/* Identity cards (Vision Agenda) – only Title, forced block_type */}
                        {!isLiyana && !isRecognition && !isFoundation && (
                          <div className="sm:col-span-2">
                            <Field label="Title">
                              <input
                                className={formInput}
                                value={block.title || ''}
                                onChange={(e) => {
                                  // Ensure block_type stays identity_card
                                  updateBlock(index, {
                                    title: e.target.value,
                                    block_type: 'identity_card',
                                  })
                                }}
                                placeholder="Identity card title"
                              />
                            </Field>
                          </div>
                        )}
                      </div>
                    </ExpandableItem>
                  )
                })
              )}
            </Card>
          )}
        </div>
      )}

      {/* Confirm Dialogs */}
      <ConfirmDialog
        open={deleteTimelineIdx !== null}
        title="Delete Event"
        message="Are you sure you want to delete this event? This action cannot be undone."
        onConfirm={() => {
          if (deleteTimelineIdx !== null && 'events' in draft) {
            const events = [...draft.events]
            events.splice(deleteTimelineIdx, 1)
            setDraft({ events })
            setDeleteTimelineIdx(null)
          }
        }}
        onCancel={() => setDeleteTimelineIdx(null)}
      />
      <ConfirmDialog
        open={deleteBlockIdx !== null}
        title="Delete Block"
        message="Are you sure you want to delete this block? This action cannot be undone."
        onConfirm={() => {
          if (deleteBlockIdx !== null && 'blocks' in draft) {
            const blocks = [...draft.blocks]
            blocks.splice(deleteBlockIdx, 1)
            setDraft({ ...draft, blocks })
            setDeleteBlockIdx(null)
          }
        }}
        onCancel={() => setDeleteBlockIdx(null)}
      />
      <ConfirmDialog
        open={deleteMetricIdx !== null}
        title="Delete Metric"
        message="Are you sure?"
        onConfirm={() => {
          if (deleteMetricIdx !== null && 'metrics' in draft) {
            const metrics = [...draft.metrics]
            metrics.splice(deleteMetricIdx, 1)
            setDraft({ ...draft, metrics })
            setDeleteMetricIdx(null)
          }
        }}
        onCancel={() => setDeleteMetricIdx(null)}
      />
      <ConfirmDialog
        open={deleteStatIdx !== null}
        title="Delete Stat"
        message="Are you sure?"
        onConfirm={() => {
          if (deleteStatIdx !== null && 'stats' in draft) {
            const stats = [...draft.stats]
            stats.splice(deleteStatIdx, 1)
            setDraft({ ...draft, stats })
            setDeleteStatIdx(null)
          }
        }}
        onCancel={() => setDeleteStatIdx(null)}
      />
    </EditorShell>
  )
}
