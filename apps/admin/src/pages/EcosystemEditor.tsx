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
  Zap,
} from 'lucide-react'
import api from '../api'
import ConfirmDialog from '../components/ConfirmDialog'
import UndoButton from '../components/UndoButton'

// ------------------------------------------------------------------
// Constants & Helpers
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
    className={`inline-flex h-9 w-9 items-center justify-center rounded-lg transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-40 ${danger
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
      className={`fixed bottom-6 right-6 flex items-center gap-3 rounded-lg px-5 py-3.5 text-sm font-medium shadow-lg ${error ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-700'
        }`}
    >
      {error ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
      <span>{message || error}</span>
    </div>
  )
}

// ------------------------------------------------------------------
// Reusable sub‑components (EditorShell with onUndo added)
// ------------------------------------------------------------------
function EditorShell({
  title,
  saving,
  onSave,
  onUndo,
  message,
  error,
  preview,
  children,
}: {
  title: string
  saving: boolean
  onSave: () => void
  onUndo?: () => void
  message: string
  error: string
  preview?: React.ReactNode
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
          <div className="flex items-center gap-4">
            {onUndo && <UndoButton onClick={onUndo} />}
            <button
              onClick={onSave}
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-6 py-3 font-semibold text-white transition-all hover:shadow-xl hover:shadow-emerald-500/30 active:scale-[0.98] disabled:opacity-50"
            >
              {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
              <span>{saving ? 'Saving...' : 'Save All Changes'}</span>
            </button>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
          <div className="space-y-8">{children}</div>

          <aside className="space-y-6">
            <div className="sticky top-8 space-y-6">
              {preview && (
                <div className="rounded-2xl border border-slate-200 bg-white/80 backdrop-blur-md p-6 shadow-sm hover:shadow-lg transition-all">
                  <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                    <Eye size={14} className="text-emerald-500" /> Live Preview
                  </h3>
                  {preview}
                </div>
              )}
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
      className={`rounded-2xl border bg-white/80 backdrop-blur-sm shadow-sm transition-all duration-300 hover:shadow-lg hover:border-emerald-300 hover:scale-[1.01] cursor-pointer ${isFocused
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
// Types matching the frontend's ecosystem metadata shape
// ------------------------------------------------------------------
interface EcoMetaStat {
  value: string
  label: string
}

interface NetworkSector {
  id?: string
  label: string
  title: string
  description: string
  metric: string
  category: string
  angle?: number
  x?: number
  y?: number
}

interface BreakdownSector {
  num: string
  category: string
  title: string
  description: string
  stats: string[]
  image: string | null
  accent: boolean
}

interface FinancingCallout {
  num: string
  category: string
  title: string
  description: string
}

// ------------------------------------------------------------------
// Default factories
// ------------------------------------------------------------------
const emptyMetaStat = (): EcoMetaStat => ({ value: '', label: '' })
const emptyNetworkSector = (): NetworkSector => ({
  label: 'NEW',
  title: 'New Sector',
  description: '',
  metric: '',
  category: 'hospital',
})
const emptyBreakdownSector = (): BreakdownSector => ({
  num: '',
  category: '',
  title: '',
  description: '',
  stats: [],
  image: null,
  accent: false,
})

const reorderArray = <T,>(arr: T[], idx: number, dir: number): T[] => {
  const next = [...arr]
  const target = idx + dir
  if (target < 0 || target >= next.length) return arr
    ;[next[idx], next[target]] = [next[target], next[idx]]
  return next
}

// ------------------------------------------------------------------
// Main Component
// ------------------------------------------------------------------
export default function EcosystemEditor() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  // Hero
  const [heroTag, setHeroTag] = useState('')
  const [heroTitle, setHeroTitle] = useState('')
  const [heroDescription, setHeroDescription] = useState('')
  const [heroMeta, setHeroMeta] = useState<EcoMetaStat[]>([])

  // Network Diagram
  const [networkTag, setNetworkTag] = useState('')
  const [networkTitle, setNetworkTitle] = useState('')
  const [networkDescription, setNetworkDescription] = useState('')
  const [networkSectors, setNetworkSectors] = useState<NetworkSector[]>([])

  // Vision Quote
  const [visionQuote, setVisionQuote] = useState('')
  const [visionAttribution, setVisionAttribution] = useState('')
  const [visionMarker, setVisionMarker] = useState('')

  // Breakdown
  const [breakdownTag, setBreakdownTag] = useState('')
  const [breakdownTitle, setBreakdownTitle] = useState('')
  const [breakdownDescription, setBreakdownDescription] = useState('')
  const [breakdownSectors, setBreakdownSectors] = useState<BreakdownSector[]>([])
  const [financingNum, setFinancingNum] = useState('')
  const [financingCategory, setFinancingCategory] = useState('')
  const [financingTitle, setFinancingTitle] = useState('')
  const [financingDescription, setFinancingDescription] = useState('')

  // Expand/collapse tracking
  const [expandedNetwork, setExpandedNetwork] = useState<string[]>([])
  const [expandedBreakdown, setExpandedBreakdown] = useState<string[]>([])

  const newRef = useRef<HTMLDivElement | null>(null)
  const [focusId, setFocusId] = useState<string | null>(null)

  // Backup for undo
  const backupRef = useRef<{
    heroTag: string
    heroTitle: string
    heroDescription: string
    heroMeta: EcoMetaStat[]
    networkTag: string
    networkTitle: string
    networkDescription: string
    networkSectors: NetworkSector[]
    visionQuote: string
    visionAttribution: string
    visionMarker: string
    breakdownTag: string
    breakdownTitle: string
    breakdownDescription: string
    breakdownSectors: BreakdownSector[]
    financingNum: string
    financingCategory: string
    financingTitle: string
    financingDescription: string
  } | null>(null)

  // Confirm dialog state
  const [confirm, setConfirm] = useState<{
    open: boolean
    title?: string
    message?: string
    onConfirm?: () => void
  }>({ open: false })

  const askConfirm = (title: string, message: string, onConfirm: () => void) => {
    setConfirm({
      open: true,
      title,
      message,
      onConfirm: () => {
        onConfirm()                     // do the actual delete
        setConfirm({ open: false })     // close the dialog
      },
    })
  }

  // Focus helper
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

  // --------------- Fetch data helper ---------------
  const fetchData = async () => {
    try {
      const res = await api.get('/cms/site-content')
      const section = res.data?.sections?.liyana_framework

      // If the section hasn't been created yet, just use defaults (no error)
      if (!section) {
        const defaults = {
          heroTag: 'Strategic Infrastructure',
          heroTitle: '',
          heroDescription: '',
          heroMeta: [] as EcoMetaStat[],
          networkTag: 'System Generated',
          networkTitle: '',
          networkDescription: '',
          networkSectors: [] as NetworkSector[],
          visionQuote: '',
          visionAttribution: '',
          visionMarker: '99',
          breakdownTag: 'Sector Breakdown',
          breakdownTitle: '',
          breakdownDescription: '',
          breakdownSectors: [] as BreakdownSector[],
          financingNum: '06',
          financingCategory: 'Financing',
          financingTitle: '',
          financingDescription: '',
        }
        // Set all states to defaults
        setHeroTag(defaults.heroTag)
        setHeroTitle(defaults.heroTitle)
        setHeroDescription(defaults.heroDescription)
        setHeroMeta(defaults.heroMeta)
        setNetworkTag(defaults.networkTag)
        setNetworkTitle(defaults.networkTitle)
        setNetworkDescription(defaults.networkDescription)
        setNetworkSectors(defaults.networkSectors)
        setVisionQuote(defaults.visionQuote)
        setVisionAttribution(defaults.visionAttribution)
        setVisionMarker(defaults.visionMarker)
        setBreakdownTag(defaults.breakdownTag)
        setBreakdownTitle(defaults.breakdownTitle)
        setBreakdownDescription(defaults.breakdownDescription)
        setBreakdownSectors(defaults.breakdownSectors)
        setFinancingNum(defaults.financingNum)
        setFinancingCategory(defaults.financingCategory)
        setFinancingTitle(defaults.financingTitle)
        setFinancingDescription(defaults.financingDescription)
        backupRef.current = defaults
        setError('')
        return defaults
      }

      // Parse metadata – the aggregated endpoint already returns it as an object,
      // but if for some reason it's still a string, we handle both.
      let metadata = section.metadata
      if (typeof metadata === 'string') {
        try {
          metadata = JSON.parse(metadata)
        } catch {
          metadata = {}
        }
      }
      const eco: any = metadata?.ecosystem || {}

      const fresh = {
        heroTag: eco.hero?.tag || 'Strategic Infrastructure',
        heroTitle: eco.hero?.title || '',
        heroDescription: eco.hero?.description || '',
        heroMeta: eco.hero?.meta || [],

        networkTag: eco.network?.hero?.tag || 'System Generated',
        networkTitle: eco.network?.hero?.title || '',
        networkDescription: eco.network?.hero?.description || '',
        networkSectors: eco.network?.sectors || [],

        visionQuote: eco.vision?.quote || '',
        visionAttribution: eco.vision?.attribution || '',
        visionMarker: eco.vision?.marker || '99',

        breakdownTag: eco.breakdown?.tag || 'Sector Breakdown',
        breakdownTitle: eco.breakdown?.title || '',
        breakdownDescription: eco.breakdown?.description || '',
        breakdownSectors: eco.breakdown?.sectors || [],
        financingNum: eco.breakdown?.financing?.num || '06',
        financingCategory: eco.breakdown?.financing?.category || 'Financing',
        financingTitle: eco.breakdown?.financing?.title || '',
        financingDescription: eco.breakdown?.financing?.description || '',
      }

      setHeroTag(fresh.heroTag)
      setHeroTitle(fresh.heroTitle)
      setHeroDescription(fresh.heroDescription)
      setHeroMeta(fresh.heroMeta)
      setNetworkTag(fresh.networkTag)
      setNetworkTitle(fresh.networkTitle)
      setNetworkDescription(fresh.networkDescription)
      setNetworkSectors(fresh.networkSectors)
      setVisionQuote(fresh.visionQuote)
      setVisionAttribution(fresh.visionAttribution)
      setVisionMarker(fresh.visionMarker)
      setBreakdownTag(fresh.breakdownTag)
      setBreakdownTitle(fresh.breakdownTitle)
      setBreakdownDescription(fresh.breakdownDescription)
      setBreakdownSectors(fresh.breakdownSectors)
      setFinancingNum(fresh.financingNum)
      setFinancingCategory(fresh.financingCategory)
      setFinancingTitle(fresh.financingTitle)
      setFinancingDescription(fresh.financingDescription)

      backupRef.current = fresh
      setError('')
      return fresh
    } catch (err: any) {
      console.error('Failed to fetch ecosystem data', err)
      throw err
    }
  }

  // Initial load
  useEffect(() => {
    let active = true
    const load = async () => {
      setLoading(true)
      try {
        if (active) await fetchData()
      } catch {
        if (active) setError('Could not load ecosystem content. Using defaults.')
      } finally {
        if (active) setLoading(false)
      }
    }
    load()
    return () => { active = false }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
  // Initial load
  useEffect(() => {
    let active = true
    const load = async () => {
      setLoading(true)
      try {
        if (active) {
          await fetchData()
        }
      } catch {
        if (active) setError('Could not load ecosystem content. Using defaults.')
      } finally {
        if (active) setLoading(false)
      }
    }
    load()
    return () => {
      active = false
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Undo
  const handleUndo = () => {
    if (backupRef.current) {
      const b = backupRef.current
      setHeroTag(b.heroTag)
      setHeroTitle(b.heroTitle)
      setHeroDescription(b.heroDescription)
      setHeroMeta(b.heroMeta)
      setNetworkTag(b.networkTag)
      setNetworkTitle(b.networkTitle)
      setNetworkDescription(b.networkDescription)
      setNetworkSectors(b.networkSectors)
      setVisionQuote(b.visionQuote)
      setVisionAttribution(b.visionAttribution)
      setVisionMarker(b.visionMarker)
      setBreakdownTag(b.breakdownTag)
      setBreakdownTitle(b.breakdownTitle)
      setBreakdownDescription(b.breakdownDescription)
      setBreakdownSectors(b.breakdownSectors)
      setFinancingNum(b.financingNum)
      setFinancingCategory(b.financingCategory)
      setFinancingTitle(b.financingTitle)
      setFinancingDescription(b.financingDescription)
      setExpandedNetwork([])
      setExpandedBreakdown([])
      setMessage('↩ Reverted to last saved version')
      setTimeout(() => setMessage(''), 3000)
    }
  }

  // --------------- Save ---------------
  const handleSave = async () => {
    setSaving(true)
    setMessage('')
    setError('')
    try {
      const payload = {
        section: {
          metadata: {
            ecosystem: {
              hero: {
                tag: heroTag,
                title: heroTitle,
                description: heroDescription,
                meta: heroMeta,
              },
              network: {
                hero: { tag: networkTag, title: networkTitle, description: networkDescription },
                sectors: networkSectors,
              },
              vision: { quote: visionQuote, attribution: visionAttribution, marker: visionMarker },
              breakdown: {
                tag: breakdownTag,
                title: breakdownTitle,
                description: breakdownDescription,
                sectors: breakdownSectors,
                financing: {
                  num: financingNum,
                  category: financingCategory,
                  title: financingTitle,
                  description: financingDescription,
                },
              },
            },
          },
        },
      }
      await api.put('/cms/sections/liyana_framework', payload)
      // Refresh to get the latest state and update backup
      await fetchData()
      setMessage('✨ Ecosystem saved successfully!')
      setTimeout(() => setMessage(''), 3000)
    } catch {
      setError('Save failed. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  // Preview content for the sidebar
  const previewContent = (
    <div className="rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-slate-900 min-h-[160px]">
      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">ECOSYSTEM</p>
      <p className="mt-2 text-sm font-semibold text-slate-900">{heroTitle}</p>
      <p className="mt-1 text-xs text-slate-600">{heroTag}</p>
      <div className="mt-4 border-t border-slate-200 pt-3">
        <p className="text-xs font-semibold text-slate-700">{networkTitle}</p>
        <p className="text-[11px] text-slate-500">{networkSectors.length} sectors</p>
        <p className="text-[11px] text-slate-500 mt-1">Vision: {visionQuote.slice(0, 60)}…</p>
        <p className="text-[11px] text-slate-500 mt-1">Breakdown: {breakdownTitle}</p>
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100/60">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 bg-gradient-to-r from-teal-400 to-cyan-400 rounded-full animate-spin opacity-20" />
            <Loader2 size={32} className="animate-spin text-teal-500 absolute inset-0 m-auto" />
          </div>
          <p className="text-sm text-slate-600 animate-pulse">Loading Ecosystem...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <EditorShell
        title="Ecosystem"
        saving={saving}
        onSave={handleSave}
        onUndo={handleUndo}
        message={message}
        error={error}
        preview={previewContent}
      >
        {/* 1. Hero Section */}
        <Card title="Hero Section" description="Top section of the Ecosystem page.">
          <div className="grid gap-6 md:grid-cols-2">
            <Field label="Tag">
              <input
                className={formInput}
                value={heroTag}
                onChange={(e) => setHeroTag(e.target.value)}
              />
            </Field>
            <Field label="Title">
              <input
                className={formInput}
                value={heroTitle}
                onChange={(e) => setHeroTitle(e.target.value)}
              />
            </Field>
            <div className="md:col-span-2">
              <Field label="Description">
                <textarea
                  className={formInput}
                  rows={4}
                  value={heroDescription}
                  onChange={(e) => setHeroDescription(e.target.value)}
                />
              </Field>
            </div>
          </div>

          <div className="mt-6">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold text-slate-700">Stats Grid</p>
              <button
                onClick={() => {
                  const s = emptyMetaStat()
                  setHeroMeta((prev) => [...prev, s])
                  setFocusId(s.value)
                }}
                className="inline-flex items-center gap-1 rounded-lg bg-emerald-500 px-3 py-1.5 text-xs font-semibold text-white"
              >
                <Plus size={14} /> Add Stat
              </button>
            </div>
            {heroMeta.map((stat, idx) => (
              <div key={idx} className="flex gap-3 items-center mb-2">
                <Field label="Value">
                  <input
                    className={formInput}
                    value={stat.value}
                    onChange={(e) => {
                      const updated = [...heroMeta]
                      updated[idx] = { ...updated[idx], value: e.target.value }
                      setHeroMeta(updated)
                    }}
                  />
                </Field>
                <Field label="Label">
                  <input
                    className={formInput}
                    value={stat.label}
                    onChange={(e) => {
                      const updated = [...heroMeta]
                      updated[idx] = { ...updated[idx], label: e.target.value }
                      setHeroMeta(updated)
                    }}
                  />
                </Field>
                <IconButton
                  label="Delete"
                  danger
                  onClick={() =>
                    askConfirm('Delete stat?', 'This cannot be undone.', () =>
                      setHeroMeta((prev) => prev.filter((_, i) => i !== idx))
                    )
                  }
                >
                  <Trash2 size={14} />
                </IconButton>
              </div>
            ))}
            {heroMeta.length === 0 && <EmptyState message="No stats yet. Add one to start." />}
          </div>
        </Card>

        {/* 2. Network Diagram */}
        <Card
          title="Network Diagram"
          description="'System Generated' section with interactive sectors."
        >
          <div className="grid gap-6 md:grid-cols-2 mb-6">
            <Field label="Tag">
              <input
                className={formInput}
                value={networkTag}
                onChange={(e) => setNetworkTag(e.target.value)}
              />
            </Field>
            <Field label="Title">
              <input
                className={formInput}
                value={networkTitle}
                onChange={(e) => setNetworkTitle(e.target.value)}
              />
            </Field>
            <div className="md:col-span-2">
              <Field label="Description">
                <textarea
                  className={formInput}
                  rows={3}
                  value={networkDescription}
                  onChange={(e) => setNetworkDescription(e.target.value)}
                />
              </Field>
            </div>
          </div>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-semibold text-slate-700">Sectors ({networkSectors.length})</p>
            <button
              onClick={() => {
                const s = emptyNetworkSector()
                setNetworkSectors((prev) => [...prev, s])
                setExpandedNetwork((prev) => [...prev, String(networkSectors.length)])
                setFocusId(s.label)
              }}
              className="inline-flex items-center gap-1 rounded-lg bg-emerald-500 px-3 py-1.5 text-xs font-semibold text-white"
            >
              <Plus size={14} /> Add Sector
            </button>
          </div>
          {networkSectors.length === 0 ? (
            <EmptyState message="No sectors yet. Add one to start." />
          ) : (
            networkSectors.map((sector, idx) => (
              <ExpandableItem
                key={idx}
                idx={idx}
                expanded={expandedNetwork}
                setExpanded={setExpandedNetwork}
                headerLabel={sector.label}
                headerValue={sector.title}
                isFocused={focusId === sector.label}
                refProp={newRef}
                onUp={() => setNetworkSectors((prev) => reorderArray(prev, idx, -1))}
                onDown={() => setNetworkSectors((prev) => reorderArray(prev, idx, 1))}
                onDelete={() =>
                  askConfirm('Delete sector?', 'This cannot be undone.', () => {
                    setNetworkSectors((prev) => prev.filter((_, i) => i !== idx))
                    setExpandedNetwork((prev) => prev.filter((id) => id !== String(idx)))
                  })
                }
                upDisabled={idx === 0}
                downDisabled={idx === networkSectors.length - 1}
              >
                <Field label="Label (short code)">
                  <input
                    className={formInput}
                    value={sector.label}
                    onChange={(e) => {
                      const updated = [...networkSectors]
                      updated[idx] = { ...updated[idx], label: e.target.value }
                      setNetworkSectors(updated)
                    }}
                  />
                </Field>
                <Field label="Title">
                  <input
                    className={formInput}
                    value={sector.title}
                    onChange={(e) => {
                      const updated = [...networkSectors]
                      updated[idx] = { ...updated[idx], title: e.target.value }
                      setNetworkSectors(updated)
                    }}
                  />
                </Field>
                <Field label="Description">
                  <textarea
                    className={formInput}
                    rows={3}
                    value={sector.description}
                    onChange={(e) => {
                      const updated = [...networkSectors]
                      updated[idx] = { ...updated[idx], description: e.target.value }
                      setNetworkSectors(updated)
                    }}
                  />
                </Field>
                <Field label="Metric">
                  <input
                    className={formInput}
                    value={sector.metric}
                    onChange={(e) => {
                      const updated = [...networkSectors]
                      updated[idx] = { ...updated[idx], metric: e.target.value }
                      setNetworkSectors(updated)
                    }}
                  />
                </Field>
                <Field label="Category (icon)">
                  <select
                    className={formInput}
                    value={sector.category}
                    onChange={(e) => {
                      const updated = [...networkSectors]
                      updated[idx] = { ...updated[idx], category: e.target.value }
                      setNetworkSectors(updated)
                    }}
                  >
                    <option value="hospital">Hospital</option>
                    <option value="education">Education</option>
                    <option value="manufacturing">Manufacturing</option>
                    <option value="research">Research</option>
                    <option value="digital-health">Digital Health</option>
                    <option value="insurance">Insurance</option>
                  </select>
                </Field>
              </ExpandableItem>
            ))
          )}
        </Card>

        {/* 4. Sector Breakdown */}
        <Card title="Sector Breakdown">
          <div className="grid gap-6 md:grid-cols-2 mb-6">
            <Field label="Tag">
              <input
                className={formInput}
                value={breakdownTag}
                onChange={(e) => setBreakdownTag(e.target.value)}
              />
            </Field>
            <Field label="Title">
              <input
                className={formInput}
                value={breakdownTitle}
                onChange={(e) => setBreakdownTitle(e.target.value)}
              />
            </Field>
            <div className="md:col-span-2">
              <Field label="Description">
                <textarea
                  className={formInput}
                  rows={3}
                  value={breakdownDescription}
                  onChange={(e) => setBreakdownDescription(e.target.value)}
                />
              </Field>
            </div>
          </div>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-semibold text-slate-700">
              Sectors ({breakdownSectors.length})
            </p>
            <button
              onClick={() => {
                const s = emptyBreakdownSector()
                setBreakdownSectors((prev) => [...prev, s])
                setExpandedBreakdown((prev) => [...prev, String(breakdownSectors.length)])
                setFocusId(s.num)
              }}
              className="inline-flex items-center gap-1 rounded-lg bg-emerald-500 px-3 py-1.5 text-xs font-semibold text-white"
            >
              <Plus size={14} /> Add Sector
            </button>
          </div>
          {breakdownSectors.length === 0 ? (
            <EmptyState message="No breakdown sectors yet. Add one to start." />
          ) : (
            breakdownSectors.map((sec, idx) => (
              <ExpandableItem
                key={idx}
                idx={idx}
                expanded={expandedBreakdown}
                setExpanded={setExpandedBreakdown}
                headerLabel={sec.num}
                headerValue={sec.title}
                isFocused={focusId === sec.num}
                refProp={newRef}
                onUp={() => setBreakdownSectors((prev) => reorderArray(prev, idx, -1))}
                onDown={() => setBreakdownSectors((prev) => reorderArray(prev, idx, 1))}
                onDelete={() =>
                  askConfirm('Delete sector?', 'This cannot be undone.', () => {
                    setBreakdownSectors((prev) => prev.filter((_, i) => i !== idx))
                    setExpandedBreakdown((prev) => prev.filter((id) => id !== String(idx)))
                  })
                }
                upDisabled={idx === 0}
                downDisabled={idx === breakdownSectors.length - 1}
              >
                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Number (e.g., 01)">
                    <input
                      className={formInput}
                      value={sec.num}
                      onChange={(e) => {
                        const updated = [...breakdownSectors]
                        updated[idx] = { ...updated[idx], num: e.target.value }
                        setBreakdownSectors(updated)
                      }}
                    />
                  </Field>
                  <Field label="Category">
                    <input
                      className={formInput}
                      value={sec.category}
                      onChange={(e) => {
                        const updated = [...breakdownSectors]
                        updated[idx] = { ...updated[idx], category: e.target.value }
                        setBreakdownSectors(updated)
                      }}
                    />
                  </Field>
                </div>
                <Field label="Title">
                  <input
                    className={formInput}
                    value={sec.title}
                    onChange={(e) => {
                      const updated = [...breakdownSectors]
                      updated[idx] = { ...updated[idx], title: e.target.value }
                      setBreakdownSectors(updated)
                    }}
                  />
                </Field>
                <Field label="Description">
                  <textarea
                    className={formInput}
                    rows={4}
                    value={sec.description}
                    onChange={(e) => {
                      const updated = [...breakdownSectors]
                      updated[idx] = { ...updated[idx], description: e.target.value }
                      setBreakdownSectors(updated)
                    }}
                  />
                </Field>
                <Field label="Stats (one per line)">
                  <textarea
                    className={formInput}
                    rows={2}
                    value={sec.stats.join('\n')}
                    onChange={(e) => {
                      const updated = [...breakdownSectors]
                      updated[idx] = { ...updated[idx], stats: e.target.value.split('\n') }
                      setBreakdownSectors(updated)
                    }}
                  />
                </Field>
                <Field label="Image URL (optional)">
                  <input
                    className={formInput}
                    value={sec.image || ''}
                    onChange={(e) => {
                      const updated = [...breakdownSectors]
                      updated[idx] = { ...updated[idx], image: e.target.value || null }
                      setBreakdownSectors(updated)
                    }}
                  />
                </Field>
                <label className="flex items-center gap-2 mt-2">
                  <input
                    type="checkbox"
                    checked={sec.accent}
                    onChange={(e) => {
                      const updated = [...breakdownSectors]
                      updated[idx] = { ...updated[idx], accent: e.target.checked }
                      setBreakdownSectors(updated)
                    }}
                  />
                  <span className="text-sm text-slate-600">
                    Accent background (highlight this sector)
                  </span>
                </label>
              </ExpandableItem>
            ))
          )}
        </Card>

        {/* 5. Financing Callout */}
        <Card title="Financing Callout" description="Dark featured block at the bottom.">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Number">
              <input
                className={formInput}
                value={financingNum}
                onChange={(e) => setFinancingNum(e.target.value)}
              />
            </Field>
            <Field label="Category">
              <input
                className={formInput}
                value={financingCategory}
                onChange={(e) => setFinancingCategory(e.target.value)}
              />
            </Field>
            <div className="md:col-span-2">
              <Field label="Title">
                <input
                  className={formInput}
                  value={financingTitle}
                  onChange={(e) => setFinancingTitle(e.target.value)}
                />
              </Field>
              <Field label="Description">
                <textarea
                  className={formInput}
                  rows={4}
                  value={financingDescription}
                  onChange={(e) => setFinancingDescription(e.target.value)}
                />
              </Field>
            </div>
          </div>
        </Card>

        {/* 3. Vision Quote */}
        <Card title="Vision Quote" description="Full‑width quote section.">
          <Field label="Quote Text">
            <textarea
              className={formInput}
              rows={5}
              value={visionQuote}
              onChange={(e) => setVisionQuote(e.target.value)}
            />
          </Field>
          <div className="grid gap-4 md:grid-cols-2 mt-4">
            <Field label="Attribution">
              <input
                className={formInput}
                value={visionAttribution}
                onChange={(e) => setVisionAttribution(e.target.value)}
              />
            </Field>
            <Field label="Marker (large number)">
              <input
                className={formInput}
                value={visionMarker}
                onChange={(e) => setVisionMarker(e.target.value)}
              />
            </Field>
          </div>
        </Card>

      </EditorShell>

      {/* Confirm Dialog */}
      <ConfirmDialog
        open={confirm.open}
        title={confirm.title || 'Confirm'}
        message={confirm.message || ''}
        onConfirm={() => confirm.onConfirm?.()}
        onCancel={() => setConfirm({ open: false })}
      />
    </>
  )
}
