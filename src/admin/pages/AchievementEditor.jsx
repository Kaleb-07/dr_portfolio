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
  Zap,
} from 'lucide-react'
import api from '../api'
import { awards as fallbackAwards } from '@/data/awards'
import { mediaItems as fallbackMedia } from '@/data/media'

/* --------------- helpers (identical to ImpactEditor) --------------- */
const formInput =
  'w-full rounded-xl border border-slate-200 bg-white/70 backdrop-blur px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/10 focus:bg-white shadow-sm hover:border-emerald-300 hover:shadow-md'

const labelClass = 'mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-600'

const Field = ({ label, children }) => (
  <label className="block">
    <span className={labelClass}>{label}</span>
    {children}
  </label>
)

const IconButton = ({ label, onClick, children, disabled, danger = false }) => (
  <button
    type="button"
    aria-label={label}
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

const Toast = ({ message, error }) => {
  if (!message && !error) return null
  return (
    <div
      className={`fixed bottom-6 right-6 flex items-center gap-3 rounded-lg px-5 py-3.5 text-sm font-medium shadow-lg transition-all duration-300 ${
        error ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-700'
      }`}
    >
      {error ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
      <span>{message || error}</span>
    </div>
  )
}

/* --------------- default item factories --------------- */
const emptyAward = () => ({
  id: `award-${Date.now()}`,
  title: 'New award title',
  organization: '',
  year: new Date().getFullYear(),
  description: '',
  image: '',
  category: 'professional',
})

const emptyMedia = () => ({
  id: `media-${Date.now()}`,
  title: 'New media item',
  type: 'interview',
  source: '',
  date: new Date().toISOString().slice(0, 10),
  description: '',
  url: '',
  thumbnail: '',
})

const reorderArray = (arr, idx, dir) => {
  const next = [...arr]
  const target = idx + dir
  if (target < 0 || target >= next.length) return arr
  ;[next[idx], next[target]] = [next[target], next[idx]]
  return next
}

const awardCategories = [
  { value: 'professional', label: 'Professional Excellence' },
  { value: 'alumni', label: 'Alumni Recognition' },
  { value: 'industry', label: 'Industry Honours' },
  { value: 'leadership', label: 'Leadership Awards' },
]

const mediaTypes = [
  { value: 'interview', label: 'Interview' },
  { value: 'conference', label: 'Conference' },
  { value: 'podcast', label: 'Podcast' },
  { value: 'press', label: 'Press' },
  { value: 'speech', label: 'Speech' },
  { value: 'video', label: 'Video' },
]

/* --------------- Main Component --------------- */
export default function AchievementEditor() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  // Awards section
  const [awardEyebrow, setAwardEyebrow] = useState('Awards & Recognition')
  const [awardTitle, setAwardTitle] = useState('Honours that reflect a life of impact')
  const [awardDescription, setAwardDescription] = useState(
    'Recognition from institutions and peers for sustained excellence in healthcare leadership, service, and innovation.',
  )
  const [awards, setAwards] = useState([])

  // Media section
  const [mediaEyebrow, setMediaEyebrow] = useState('Media & Speaking')
  const [mediaTitle, setMediaTitle] = useState('Voices of leadership')
  const [mediaDescription, setMediaDescription] = useState(
    'Interviews, keynotes, podcasts, and press coverage that amplify the vision for healthcare transformation.',
  )
  const [media, setMedia] = useState([])

  // Expand/collapse tracking
  const [expandedAwards, setExpandedAwards] = useState([])
  const [expandedMedia, setExpandedMedia] = useState([])

  const newRef = useRef(null)
  const [focusId, setFocusId] = useState(null)

  useEffect(() => {
    if (focusId && newRef.current) {
      newRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
      const timer = setTimeout(() => {
        newRef.current?.querySelector('input, textarea')?.focus()
      }, 350)
      return () => clearTimeout(timer)
    }
    const reset = setTimeout(() => setFocusId(null), 2500)
    return () => clearTimeout(reset)
  }, [focusId])

  /* --------------- Load data from API --------------- */
  useEffect(() => {
    let active = true
    const load = async () => {
      setLoading(true)
      setError('')
      try {
        const res = await api.get('/cms/site-content')
        if (!active) return
        const sections = res.data?.sections || {}

        const awardsData = sections.recognition_awards || {}
        if (awardsData.eyebrow) setAwardEyebrow(awardsData.eyebrow)
        if (awardsData.title) setAwardTitle(awardsData.title)
        if (awardsData.description) setAwardDescription(awardsData.description)
        if (awardsData.blocks?.length) {
          setAwards(
            awardsData.blocks.map((b, idx) => ({
              id: b.id || `award-${idx}`,
              title: b.title || '',
              organization: b.organization || '',
              year: b.year || new Date().getFullYear(),
              description: b.description || '',
              image: b.image || '',
              category: b.category || 'professional',
            })),
          )
        } else {
          setAwards(fallbackAwards.map((a) => ({ ...a })))
        }

        const mediaData = sections.media_speaking || {}
        if (mediaData.eyebrow) setMediaEyebrow(mediaData.eyebrow)
        if (mediaData.title) setMediaTitle(mediaData.title)
        if (mediaData.description) setMediaDescription(mediaData.description)
        if (mediaData.blocks?.length) {
          setMedia(
            mediaData.blocks.map((b, idx) => ({
              id: b.id || `media-${idx}`,
              title: b.title || '',
              type: b.type || 'interview',
              source: b.source || '',
              date: b.date || new Date().toISOString().slice(0, 10),
              description: b.description || '',
              url: b.url || '',
              thumbnail: b.thumbnail || '',
            })),
          )
        } else {
          setMedia(fallbackMedia.map((m) => ({ ...m })))
        }
      } catch (err) {
        console.warn('Could not load achievements, using fallback data', err)
        setAwards(fallbackAwards.map((a) => ({ ...a })))
        setMedia(fallbackMedia.map((m) => ({ ...m })))
      } finally {
        if (active) setLoading(false)
      }
    }
    load()
    return () => {
      active = false
    }
  }, [])

  /* --------------- Save --------------- */
  const handleSave = async () => {
    setSaving(true)
    setMessage('')
    setError('')
    try {
      await api.put('/cms/sections/recognition_awards', {
        section: {
          eyebrow: awardEyebrow,
          title: awardTitle,
          description: awardDescription,
        },
        blocks: awards.map((item) => ({
          ...item,
          year: Number(item.year) || new Date().getFullYear(),
        })),
      })

      await api.put('/cms/sections/media_speaking', {
        section: {
          eyebrow: mediaEyebrow,
          title: mediaTitle,
          description: mediaDescription,
        },
        blocks: media,
      })

      setMessage('✨ Achievements saved successfully!')
      setTimeout(() => setMessage(''), 3000)
    } catch (err) {
      console.error(err)
      setError('Save failed. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="animate-spin text-emerald-500" size={32} />
        <p className="ml-3 text-slate-600">Loading achievements...</p>
      </div>
    )
  }

  return (
    <EditorShell saving={saving} onSave={handleSave} message={message} error={error}>
      {/* ── Awards Hero ── */}
      <Card title="Awards Hero" description="Top section of the Awards page.">
        <div className="grid gap-6 md:grid-cols-2">
          <Field label="Eyebrow">
            <input
              className={formInput}
              value={awardEyebrow}
              onChange={(e) => setAwardEyebrow(e.target.value)}
            />
          </Field>
          <Field label="Title">
            <input
              className={formInput}
              value={awardTitle}
              onChange={(e) => setAwardTitle(e.target.value)}
            />
          </Field>
          <div className="md:col-span-2">
            <Field label="Description">
              <textarea
                className={formInput}
                rows={4}
                value={awardDescription}
                onChange={(e) => setAwardDescription(e.target.value)}
              />
            </Field>
          </div>
        </div>
      </Card>

      {/* ── Awards List ── */}
      <Card
        title="Awards Entries"
        description="Add, reorder, and edit each award card."
        onAdd={() => {
          const newAward = emptyAward()
          setAwards((prev) => [...prev, newAward])
          setExpandedAwards((prev) => [...prev, awards.length])
          setFocusId(newAward.id)
        }}
      >
        {awards.length === 0 ? (
          <EmptyState message="No awards yet. Add one to get started." />
        ) : (
          awards.map((award, idx) => (
            <ExpandableItem
              key={award.id}
              idx={idx}
              expanded={expandedAwards}
              setExpanded={setExpandedAwards}
              headerLabel={award.category}
              headerValue={award.title}
              isFocused={award.id === focusId}
              refProp={newRef}
              onUp={() => setAwards((prev) => reorderArray(prev, idx, -1))}
              onDown={() => setAwards((prev) => reorderArray(prev, idx, 1))}
              onDelete={() => {
                setAwards((prev) => prev.filter((_, i) => i !== idx))
                setExpandedAwards((prev) => prev.filter((id) => id !== String(idx)))
              }}
              upDisabled={idx === 0}
              downDisabled={idx === awards.length - 1}
            >
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Title">
                  <input
                    className={formInput}
                    value={award.title}
                    onChange={(e) => {
                      const updated = [...awards]
                      updated[idx] = { ...updated[idx], title: e.target.value }
                      setAwards(updated)
                    }}
                  />
                </Field>
                <Field label="Organization">
                  <input
                    className={formInput}
                    value={award.organization}
                    onChange={(e) => {
                      const updated = [...awards]
                      updated[idx] = { ...updated[idx], organization: e.target.value }
                      setAwards(updated)
                    }}
                  />
                </Field>
                <Field label="Year">
                  <input
                    className={formInput}
                    type="number"
                    value={award.year}
                    onChange={(e) => {
                      const updated = [...awards]
                      updated[idx] = { ...updated[idx], year: e.target.value }
                      setAwards(updated)
                    }}
                  />
                </Field>
                <Field label="Category">
                  <select
                    className={formInput}
                    value={award.category}
                    onChange={(e) => {
                      const updated = [...awards]
                      updated[idx] = { ...updated[idx], category: e.target.value }
                      setAwards(updated)
                    }}
                  >
                    {awardCategories.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </Field>
                <div className="md:col-span-2">
                  <Field label="Description">
                    <textarea
                      className={formInput}
                      rows={4}
                      value={award.description}
                      onChange={(e) => {
                        const updated = [...awards]
                        updated[idx] = { ...updated[idx], description: e.target.value }
                        setAwards(updated)
                      }}
                    />
                  </Field>
                </div>
                <div className="md:col-span-2">
                  <Field label="Image URL">
                    <input
                      className={formInput}
                      value={award.image}
                      onChange={(e) => {
                        const updated = [...awards]
                        updated[idx] = { ...updated[idx], image: e.target.value }
                        setAwards(updated)
                      }}
                      placeholder="/image.png"
                    />
                  </Field>
                </div>
              </div>
            </ExpandableItem>
          ))
        )}
      </Card>

      {/* ── Media Hero ── */}
      <Card title="Media Hero" description="Top section of the Media & Speaking page.">
        <div className="grid gap-6 md:grid-cols-2">
          <Field label="Eyebrow">
            <input
              className={formInput}
              value={mediaEyebrow}
              onChange={(e) => setMediaEyebrow(e.target.value)}
            />
          </Field>
          <Field label="Title">
            <input
              className={formInput}
              value={mediaTitle}
              onChange={(e) => setMediaTitle(e.target.value)}
            />
          </Field>
          <div className="md:col-span-2">
            <Field label="Description">
              <textarea
                className={formInput}
                rows={4}
                value={mediaDescription}
                onChange={(e) => setMediaDescription(e.target.value)}
              />
            </Field>
          </div>
        </div>
      </Card>

      {/* ── Media List ── */}
      <Card
        title="Media Entries"
        description="Add, reorder, and edit each media or speaking item."
        onAdd={() => {
          const newMedia = emptyMedia()
          setMedia((prev) => [...prev, newMedia])
          setExpandedMedia((prev) => [...prev, media.length])
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
              headerValue={item.title}
              isFocused={item.id === focusId}
              refProp={newRef}
              onUp={() => setMedia((prev) => reorderArray(prev, idx, -1))}
              onDown={() => setMedia((prev) => reorderArray(prev, idx, 1))}
              onDelete={() => {
                setMedia((prev) => prev.filter((_, i) => i !== idx))
                setExpandedMedia((prev) => prev.filter((id) => id !== String(idx)))
              }}
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
                    value={item.url || ''}
                    onChange={(e) => {
                      const updated = [...media]
                      updated[idx] = { ...updated[idx], url: e.target.value }
                      setMedia(updated)
                    }}
                    placeholder="https://..."
                  />
                </Field>
                <Field label="Thumbnail URL">
                  <input
                    className={formInput}
                    value={item.thumbnail || ''}
                    onChange={(e) => {
                      const updated = [...media]
                      updated[idx] = { ...updated[idx], thumbnail: e.target.value }
                      setMedia(updated)
                    }}
                    placeholder="/thumbnail.jpg"
                  />
                </Field>
              </div>
            </ExpandableItem>
          ))
        )}
      </Card>
    </EditorShell>
  )
}

/* --------------- Reusable sub‑components --------------- */
function EditorShell({ saving, onSave, message, error, children }) {
  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100/60">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-emerald-600 flex items-center gap-2">
              <Zap size={14} /> Achievements Editor
            </p>
            <h1 className="mt-3 text-4xl font-bold text-slate-900">Awards & Media</h1>
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
                    AWARDS & MEDIA
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

function Card({ title, description, onAdd, children }) {
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
        className={`overflow-hidden transition-all duration-500 ease-in-out ${
          isOpen ? 'max-h-[900px] opacity-100' : 'max-h-0 opacity-0'
        }`}
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

function EmptyState({ message }) {
  return (
    <div className="rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center hover:border-emerald-300 hover:bg-emerald-50 transition-all">
      <p className="text-slate-600">{message}</p>
    </div>
  )
}
