import { useEffect, useRef, useState, type ReactNode, type RefObject } from 'react'
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

type Award = {
  id: string
  title: string
  organization: string
  year: number | string
  description: string
  image: string
  category: string
}

const fallbackAwards: Award[] = [
  {
    id: 'award-1',
    title: 'University Recognition',
    organization: 'Academic Institution',
    year: new Date().getFullYear(),
    description: 'Recognition for sustained contribution.',
    image: '',
    category: 'professional',
  },
]

const formInput =
  'w-full rounded-xl border border-slate-200 bg-white/70 px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition-all placeholder:text-slate-400 hover:border-emerald-300 hover:shadow-md focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-500/10'

const labelClass = 'mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-600'

const awardCategories = [
  { value: 'professional', label: 'Professional Excellence' },
  { value: 'alumni', label: 'Alumni Recognition' },
  { value: 'industry', label: 'Industry Honours' },
  { value: 'leadership', label: 'Leadership Awards' },
]

const emptyAward = (): Award => ({
  id: `award-${Date.now()}`,
  title: 'New award title',
  organization: '',
  year: new Date().getFullYear(),
  description: '',
  image: '',
  category: 'professional',
})

const reorderArray = <T,>(arr: T[], idx: number, dir: number) => {
  const next = [...arr]
  const target = idx + dir
  if (target < 0 || target >= next.length) return arr
  ;[next[idx], next[target]] = [next[target], next[idx]]
  return next
}

export default function AwardsEditor() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const [awardEyebrow, setAwardEyebrow] = useState('Awards & Recognition')
  const [awardTitle, setAwardTitle] = useState('Honours that reflect a life of impact')
  const [awardDescription, setAwardDescription] = useState(
    'Recognition from institutions and peers for sustained excellence in healthcare leadership, service, and innovation.',
  )
  const [awards, setAwards] = useState<Award[]>([])

  const [expandedAwards, setExpandedAwards] = useState<string[]>([])
  const newRef = useRef<HTMLDivElement>(null)
  const [focusId, setFocusId] = useState<string | null>(null)

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
        const awardsData = res.data?.sections?.recognition_awards || {}
        setAwardEyebrow(awardsData.eyebrow || 'Awards & Recognition')
        setAwardTitle(awardsData.title || 'Honours that reflect a life of impact')
        setAwardDescription(
          awardsData.description ||
            'Recognition from institutions and peers for sustained excellence in healthcare leadership, service, and innovation.',
        )
        setAwards(
          (awardsData.blocks?.length ? awardsData.blocks : fallbackAwards).map(
            (item: any, idx: number) => ({
              id: item.id || `award-${idx}`,
              title: item.title || '',
              organization: item.organization || '',
              year: item.year || new Date().getFullYear(),
              description: item.description || '',
              image: item.image || '',
              category: item.category || 'professional',
            }),
          ),
        )
      } catch (loadError) {
        console.warn('Could not load awards, using fallback data', loadError)
        if (!active) return
        setAwards(fallbackAwards.map((item) => ({ ...item })))
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
      setMessage('Awards saved successfully.')
      setTimeout(() => setMessage(''), 3000)
    } catch (saveError) {
      console.error(saveError)
      setError('Save failed. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="animate-spin text-emerald-500" size={32} />
        <p className="ml-3 text-slate-600">Loading awards...</p>
      </div>
    )
  }

  return (
    <EditorShell saving={saving} onSave={handleSave} message={message} error={error} title="Awards">
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

      <Card
        title="Awards Entries"
        description="Add, reorder, and edit each award card."
        onAdd={() => {
          const newAward = emptyAward()
          setAwards((prev) => [...prev, newAward])
          setExpandedAwards((prev) => [...prev, String(awards.length)])
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
              headerValue={award.title || `Award ${idx + 1}`}
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
    </EditorShell>
  )
}

// ---------------- Shared sub-components (copied for independence) ----------------

function EditorShell({
  saving,
  onSave,
  message,
  error,
  title,
  children,
}: {
  saving: boolean
  onSave: () => void
  message: string
  error: string
  title: string
  children: ReactNode
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

        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
          <div className="space-y-8">{children}</div>

          <aside className="space-y-6">
            <div className="sticky top-8 space-y-6">
              <div className="rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur-md transition-all hover:shadow-lg">
                <h3 className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
                  <Eye size={14} className="text-emerald-500" /> Live Preview
                </h3>
                <div className="min-h-[160px] rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-slate-900">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                    {title.toUpperCase()}
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

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className={labelClass}>{label}</span>
      {children}
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
