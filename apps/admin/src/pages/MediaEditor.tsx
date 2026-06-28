import { useEffect, useRef, useState, type ReactNode, type RefObject } from 'react'
import {
  AlertCircle,
  ArrowDown,
  ArrowUp,
  CheckCircle2,
  ChevronDown,
  Loader2,
  Plus,
  Save,
  Sparkles,
  Trash2,
  Zap,
} from 'lucide-react'
import api from '../api'
import MediaPicker from '../components/MediaPicker'
import ConfirmDialog from '../components/ConfirmDialog'
import UndoButton from '../components/UndoButton'

interface RawMediaBlock {
  id?: number
  title?: string | null
  body?: string | null
  image_url?: string | null
  metadata?: {
    type?: string
    source?: string
    date?: string
    url?: string
    [key: string]: unknown
  }
}

type MediaItem = {
  id: string
  title: string
  type: string
  source: string
  date: string
  description: string
  url: string
  thumbnail: string
}

const fallbackMedia: MediaItem[] = [
  {
    id: 'media-1',
    title: 'Press Interview',
    type: 'interview',
    source: 'Newsroom',
    date: new Date().toISOString().slice(0, 10),
    description: 'Interview feature.',
    url: '',
    thumbnail: '',
  },
]

const formInput =
  'w-full rounded-xl border border-slate-200 bg-white/70 px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition-all placeholder:text-slate-400 hover:border-emerald-300 hover:shadow-md focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-500/10'

const labelClass = 'mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-600'

const mediaTypes = [
  { value: 'interview', label: 'Interview' },
  { value: 'conference', label: 'Conference' },
  { value: 'podcast', label: 'Podcast' },
  { value: 'press', label: 'Press' },
  { value: 'speech', label: 'Speech' },
  { value: 'video', label: 'Video' },
]

const emptyMedia = (): MediaItem => ({
  id: `media-${Date.now()}`,
  title: 'New media item',
  type: 'interview',
  source: '',
  date: new Date().toISOString().slice(0, 10),
  description: '',
  url: '',
  thumbnail: '',
})

const reorderArray = <T,>(arr: T[], idx: number, dir: number) => {
  const next = [...arr]
  const target = idx + dir
  if (target < 0 || target >= next.length) return arr
  ;[next[idx], next[target]] = [next[target], next[idx]]
  return next
}

export default function MediaEditor() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const [media, setMedia] = useState<MediaItem[]>([])
  const [sectionEyebrow, setSectionEyebrow] = useState('Media & Speaking')
  const [sectionTitle, setSectionTitle] = useState(
    'Voices of <em class="text-teal-mid not-italic">leadership</em>',
  )
  const [sectionDescription, setSectionDescription] = useState(
    'Interviews, keynotes, podcasts, and press coverage that amplify the vision for healthcare transformation.',
  )

  const [backupMedia, setBackupMedia] = useState<MediaItem[]>([])
  const [backupSectionEyebrow, setBackupSectionEyebrow] = useState('Media & Speaking')
  const [backupSectionTitle, setBackupSectionTitle] = useState(
    'Voices of <em class="text-teal-mid not-italic">leadership</em>',
  )
  const [backupSectionDescription, setBackupSectionDescription] = useState(
    'Interviews, keynotes, podcasts, and press coverage that amplify the vision for healthcare transformation.',
  )

  const [expandedMedia, setExpandedMedia] = useState<string[]>([])
  const newRef = useRef<HTMLDivElement>(null)
  const [focusId, setFocusId] = useState<string | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null)

  useEffect(() => {
    if (!focusId || !newRef.current) return undefined
    newRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
    const focusTimer = setTimeout(() => {
      newRef.current
        ?.querySelector<
          HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >('input, textarea, select')
        ?.focus()
    }, 350)
    const resetTimer = setTimeout(() => setFocusId(null), 2500)
    return () => {
      clearTimeout(focusTimer)
      clearTimeout(resetTimer)
    }
  }, [focusId])

  useEffect(() => {
    let active = true
    const load = async () => {
      setLoading(true)
      setError('')
      try {
        const res = await api.get('/cms/site-content')
        if (!active) return
        const mediaData = res.data?.sections?.media_speaking || {}
        const sectionMeta = mediaData.metadata || {}

        setSectionEyebrow(sectionMeta.sectionEyebrow || 'Media & Speaking')
        setSectionTitle(
          sectionMeta.sectionTitle ||
            'Voices of <em class="text-teal-mid not-italic">leadership</em>',
        )
        setSectionDescription(
          sectionMeta.sectionDescription ||
            'Interviews, keynotes, podcasts, and press coverage that amplify the vision for healthcare transformation.',
        )
        setBackupSectionEyebrow(sectionMeta.sectionEyebrow || 'Media & Speaking')
        setBackupSectionTitle(
          sectionMeta.sectionTitle ||
            'Voices of <em class="text-teal-mid not-italic">leadership</em>',
        )
        setBackupSectionDescription(
          sectionMeta.sectionDescription ||
            'Interviews, keynotes, podcasts, and press coverage that amplify the vision for healthcare transformation.',
        )

        const rawBlocks: RawMediaBlock[] = mediaData.blocks?.length
          ? mediaData.blocks
          : fallbackMedia.map((m, i) => ({
              id: i,
              title: m.title,
              body: m.description,
              image_url: m.thumbnail,
              metadata: { type: m.type, source: m.source, date: m.date, url: m.url },
            }))

        const loadedMedia = rawBlocks.map((item, idx) => ({
          id: item.id !== undefined ? String(item.id) : `media-${idx}`,
          title: item.title || '',
          type: item.metadata?.type || 'interview',
          source: item.metadata?.source || '',
          date: item.metadata?.date || new Date().toISOString().slice(0, 10),
          description: item.body || '',
          url: item.metadata?.url || '',
          thumbnail: item.image_url || '',
        }))
        setMedia(loadedMedia)
        setBackupMedia(loadedMedia)
      } catch (loadError) {
        console.warn('Could not load media, using fallback data', loadError)
        if (!active) return
        setMedia(fallbackMedia.map((item) => ({ ...item })))
        setBackupMedia(fallbackMedia.map((item) => ({ ...item })))
      } finally {
        if (active) setLoading(false)
      }
    }
    load()
    return () => {
      active = false
    }
  }, [])

  const handleSave = async () => {
    setSaving(true)
    setMessage('')
    setError('')
    try {
      await api.put('/cms/sections/media_speaking', {
        section: {
          metadata: {
            sectionEyebrow,
            sectionTitle,
            sectionDescription,
          },
        },
        blocks: media.map((item, index) => ({
          block_type: 'media',
          title: item.title,
          body: item.description,
          image_url: item.thumbnail,
          metadata: {
            type: item.type,
            source: item.source,
            date: item.date,
            url: item.url,
          },
          sort_order: index + 1,
        })),
      })
      setMessage('Media saved successfully.')
      setTimeout(() => setMessage(''), 3000)
      setBackupMedia(media)
      setBackupSectionEyebrow(sectionEyebrow)
      setBackupSectionTitle(sectionTitle)
      setBackupSectionDescription(sectionDescription)
    } catch (saveError) {
      console.error(saveError)
      setError('Save failed. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleUndo = () => {
    setMedia(backupMedia)
    setSectionEyebrow(backupSectionEyebrow)
    setSectionTitle(backupSectionTitle)
    setSectionDescription(backupSectionDescription)
    setMessage('Changes reverted.')
    setTimeout(() => setMessage(''), 2000)
  }

  const confirmDelete = () => {
    if (deleteTarget !== null) {
      setMedia((prev) => prev.filter((_, i) => i !== deleteTarget))
      setExpandedMedia((prev) => prev.filter((id) => id !== String(deleteTarget)))
      setDeleteTarget(null)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="animate-spin text-emerald-500" size={32} />
        <p className="ml-3 text-slate-600">Loading media...</p>
      </div>
    )
  }

  return (
    <EditorShell
      saving={saving}
      onSave={handleSave}
      message={message}
      error={error}
      title="Media & Speaking"
      undoButton={<UndoButton onClick={handleUndo} />}
    >
      <Card title="Section Header" description="The heading shown above the list of media items.">
        <div className="grid gap-6 md:grid-cols-2">
          <Field label="Eyebrow">
            <input
              className={formInput}
              value={sectionEyebrow}
              onChange={(e) => setSectionEyebrow(e.target.value)}
            />
          </Field>
          <Field label="Title (HTML allowed)" hint="Use &lt;em&gt; tags for styled words.">
            <input
              className={formInput}
              value={sectionTitle}
              onChange={(e) => setSectionTitle(e.target.value)}
            />
          </Field>
          <div className="md:col-span-2">
            <Field label="Description">
              <textarea
                className={formInput}
                rows={3}
                value={sectionDescription}
                onChange={(e) => setSectionDescription(e.target.value)}
              />
            </Field>
          </div>
        </div>
      </Card>

      <Card
        title="Media Entries"
        description="Add, reorder, and edit each media or speaking item."
        onAdd={() => {
          const newMedia = emptyMedia()
          setMedia((prev) => [...prev, newMedia])
          setExpandedMedia((prev) => [...prev, String(media.length)])
          setFocusId(newMedia.id)
        }}
      >
        {media.length === 0 ? (
          <EmptyState message="No media items yet. Add one to get started." />
        ) : (
          media.map((item, idx) => (
            <ExpandableItem
              key={item.id}
              idx={idx}
              expanded={expandedMedia}
              setExpanded={setExpandedMedia}
              headerLabel={item.type}
              headerValue={item.title || `Media ${idx + 1}`}
              isFocused={item.id === focusId}
              refProp={newRef}
              onUp={() => setMedia((prev) => reorderArray(prev, idx, -1))}
              onDown={() => setMedia((prev) => reorderArray(prev, idx, 1))}
              onDelete={() => setDeleteTarget(idx)}
              upDisabled={idx === 0}
              downDisabled={idx === media.length - 1}
            >
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Title">
                  <input
                    className={formInput}
                    value={item.title}
                    onChange={(e) => {
                      const updated = [...media]
                      updated[idx] = { ...updated[idx], title: e.target.value }
                      setMedia(updated)
                    }}
                  />
                </Field>
                <Field label="Type">
                  <select
                    className={formInput}
                    value={item.type}
                    onChange={(e) => {
                      const updated = [...media]
                      updated[idx] = { ...updated[idx], type: e.target.value }
                      setMedia(updated)
                    }}
                  >
                    {mediaTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Source">
                  <input
                    className={formInput}
                    value={item.source}
                    onChange={(e) => {
                      const updated = [...media]
                      updated[idx] = { ...updated[idx], source: e.target.value }
                      setMedia(updated)
                    }}
                  />
                </Field>
                <Field label="Date">
                  <input
                    className={formInput}
                    type="date"
                    value={item.date}
                    onChange={(e) => {
                      const updated = [...media]
                      updated[idx] = { ...updated[idx], date: e.target.value }
                      setMedia(updated)
                    }}
                  />
                </Field>
                <div className="md:col-span-2">
                  <Field label="Description">
                    <textarea
                      className={formInput}
                      rows={4}
                      value={item.description}
                      onChange={(e) => {
                        const updated = [...media]
                        updated[idx] = { ...updated[idx], description: e.target.value }
                        setMedia(updated)
                      }}
                    />
                  </Field>
                </div>
                <Field label="Source URL">
                  <input
                    className={formInput}
                    value={item.url}
                    onChange={(e) => {
                      const updated = [...media]
                      updated[idx] = { ...updated[idx], url: e.target.value }
                      setMedia(updated)
                    }}
                    placeholder="https://..."
                  />
                </Field>
                <Field label="Thumbnail">
                  <MediaPicker
                    currentUrl={item.thumbnail}
                    onUpload={(url) => {
                      const updated = [...media]
                      updated[idx] = { ...updated[idx], thumbnail: url }
                      setMedia(updated)
                    }}
                  />
                </Field>
              </div>
            </ExpandableItem>
          ))
        )}
      </Card>

      <ConfirmDialog
        open={deleteTarget !== null}
        title="Delete Media Item"
        message="Are you sure you want to delete this media entry?"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </EditorShell>
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
  children: ReactNode
  undoButton?: ReactNode
}) {
  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100/60">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-10 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-emerald-600">
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
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-6 py-3 font-semibold text-white transition-all hover:shadow-xl hover:shadow-emerald-500/30 active:scale-[0.98] disabled:opacity-50"
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

function Card({
  title,
  description,
  onAdd,
  children,
}: {
  title: string
  description?: string
  onAdd?: () => void
  children: ReactNode
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur-sm transition-all duration-300 hover:border-emerald-300 hover:shadow-lg sm:p-8">
      <div className="mb-6 flex items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
          {description && <p className="mt-2 text-sm text-slate-600">{description}</p>}
        </div>
        {onAdd && (
          <button
            type="button"
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
  children: ReactNode
  onUp: () => void
  onDown: () => void
  onDelete: () => void
  upDisabled: boolean
  downDisabled: boolean
  isFocused: boolean
  refProp: RefObject<HTMLDivElement | null>
}) {
  const itemKey = String(idx)
  const isOpen = expanded.includes(itemKey)

  return (
    <div
      ref={isFocused ? refProp : null}
      className={`cursor-pointer rounded-2xl border bg-white/80 shadow-sm backdrop-blur-sm transition-all duration-300 hover:scale-[1.01] hover:border-emerald-300 hover:shadow-lg ${
        isFocused
          ? 'border-emerald-400 shadow-xl shadow-emerald-100/50 ring-2 ring-emerald-400/30'
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
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 text-sm font-bold text-white shadow-md">
            {String(idx + 1).padStart(2, '0')}
          </span>
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600">
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

function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center transition-all hover:border-emerald-300 hover:bg-emerald-50">
      <p className="text-slate-600">{message}</p>
    </div>
  )
}

function Field({ label, children, hint }: { label: string; children: ReactNode; hint?: string }) {
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
  children: ReactNode
  disabled?: boolean
  danger?: boolean
}) {
  return (
    <button
      type="button"
      aria-label={label}
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
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-lg px-5 py-3.5 text-sm font-medium shadow-lg transition-all duration-300 ${
        error ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-700'
      }`}
    >
      {error ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
      <span>{message || error}</span>
    </div>
  )
}
