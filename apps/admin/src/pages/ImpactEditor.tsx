/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
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

// ------------------------------------------------------------------
// Helpers (consistent with other editors)
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

// ------------------------------------------------------------------
// Types (matching the old editor's data shapes)
// ------------------------------------------------------------------
interface Overview {
  title: string
  subtitle: string
  description: string
  vision?: string
  mission?: string
}

interface Stat {
  id: string
  label: string
  value: string
}

interface Program {
  id: string
  title: string
  description: string
  impact: string
  beneficiaries: string
  status: string
  icon: string
}

interface Story {
  id: string
  title: string
  description: string
  beneficiary: string
}

interface Role {
  id: string
  title: string
  organization: string
  period: string
  description: string
  highlights: string
  category: string
  icon: string
}

interface Education {
  id: string
  degree: string
  institution: string
  footer: string
  highlight: boolean
}

interface FoundationItem {
  id: string
  title: string
  description: string
  icon: string
}

interface QuickFact {
  id: string
  label: string
  value: string
}

// ------------------------------------------------------------------
// Reusable sub‑components (from old editor)
// ------------------------------------------------------------------
function EditorShell({
  slug,
  saving,
  onSave,
  message,
  error,
  children,
}: {
  slug: string
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
              <Zap size={14} /> {slug.replace(/-/g, ' ')} Editor
            </p>
            <h1 className="mt-3 text-4xl font-bold text-slate-900 sm:text-5xl capitalize">
              {slug.replace(/-/g, ' ')}
            </h1>
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
                    {slug.replace(/-/g, ' ').toUpperCase()}
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
  item,
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
  item: { id: string }
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
  const isOpen = expanded.includes(item.id)
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
            prev.includes(item.id) ? prev.filter((i) => i !== item.id) : [...prev, item.id],
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
// Default item factories (generates unique IDs)
// ------------------------------------------------------------------
const createStat = (): Stat => ({
  id: `stat-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
  label: 'New Stat',
  value: '0',
})
const createProgram = (): Program => ({
  id: `prog-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
  title: 'New Program',
  description: '',
  impact: '',
  beneficiaries: '',
  status: 'active',
  icon: 'FaHeartbeat',
})
const createStory = (): Story => ({
  id: `story-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
  title: 'New Story',
  description: '',
  beneficiary: '',
})
const createRole = (category = 'board'): Role => ({
  id: `role-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
  title: 'New Role',
  organization: '',
  period: '',
  description: '',
  highlights: '',
  category,
  icon: 'FaBuilding',
})
const createEducation = (): Education => ({
  id: `edu-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
  degree: 'New Degree',
  institution: '',
  footer: '',
  highlight: false,
})
const createFoundationItem = (): FoundationItem => ({
  id: `found-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
  title: 'New Item',
  description: '',
  icon: 'FaHandshake',
})

const reorderArray = <T,>(arr: T[], idx: number, dir: number): T[] => {
  const next = [...arr]
  const target = idx + dir
  if (target < 0 || target >= next.length) return arr
  ;[next[idx], next[target]] = [next[target], next[idx]]
  return next
}

const iconOptions = [
  'FaHeartbeat',
  'FaGraduationCap',
  'FaHospital',
  'FaHandshake',
  'FaBuilding',
  'FaMapMarkerAlt',
  'FaBookOpen',
  'FaUsers',
  'FaMicroscope',
  'FaStar',
]

// ------------------------------------------------------------------
// Main Component
// ------------------------------------------------------------------
export default function ImpactEditor() {
  const { slug = 'public-service' } = useParams<{ slug: string }>()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  // Foundation states
  const [foundOverview, setFoundOverview] = useState<Overview>({
    title: '',
    subtitle: '',
    description: '',
    vision: '',
    mission: '',
  })
  const [foundStats, setFoundStats] = useState<Stat[]>([])
  const [foundPrograms, setFoundPrograms] = useState<Program[]>([])
  const [foundStories, setFoundStories] = useState<Story[]>([])
  const [foundVisionQuote, setFoundVisionQuote] = useState('')

  // Leadership states
  const [leadOverview, setLeadOverview] = useState<Overview>({
    title: '',
    subtitle: '',
    description: '',
  })
  const [executiveRoles, setExecutiveRoles] = useState<Role[]>([])
  const [governanceRoles, setGovernanceRoles] = useState<Role[]>([])

  // Public Service states
  const [pubOverview, setPubOverview] = useState<Overview>({
    title: '',
    subtitle: '',
    description: '',
  })
  const [pubQuickFacts, setPubQuickFacts] = useState<QuickFact[]>([])
  const [pubRoles, setPubRoles] = useState<Role[]>([])
  const [pubEducation, setPubEducation] = useState<Education[]>([])
  const [pubFoundationItems, setPubFoundationItems] = useState<FoundationItem[]>([])

  // Expand/collapse tracking
  const [expandedFoundStats, setExpandedFoundStats] = useState<string[]>([])
  const [expandedFoundPrograms, setExpandedFoundPrograms] = useState<string[]>([])
  const [expandedFoundStories, setExpandedFoundStories] = useState<string[]>([])
  const [expandedExecRoles, setExpandedExecRoles] = useState<string[]>([])
  const [expandedGovRoles, setExpandedGovRoles] = useState<string[]>([])
  const [expandedPubRoles, setExpandedPubRoles] = useState<string[]>([])
  const [expandedPubEducation, setExpandedPubEducation] = useState<string[]>([])
  const [expandedPubFoundation, setExpandedPubFoundation] = useState<string[]>([])

  const newRef = useRef<HTMLDivElement | null>(null)
  const [focusId, setFocusId] = useState<string | null>(null)

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

  // --------------- Load data from API ---------------
  useEffect(() => {
    let active = true
    const load = async () => {
      setLoading(true)
      setError('')
      try {
        const apiSlug = slug === 'foundation' ? 'foundation_story' : slug
        const res = await api.get(`/impact/${apiSlug}`)
        if (!active) return
        const data = res.data || {}
        applySectionData(data)
      } catch {
        if (active) setError('Could not load impact data. Using empty defaults.')
      } finally {
        if (active) setLoading(false)
      }
    }
    load()
    return () => {
      active = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug])

  const applySectionData = (data: any) => {
    // Reset to empty defaults first
    resetAllSections()
    if (!data || Object.keys(data).length === 0) return

    switch (slug) {
      case 'foundation': {
        if (data.overview) setFoundOverview(data.overview)
        if (Array.isArray(data.stats)) setFoundStats(data.stats)
        if (Array.isArray(data.programs)) setFoundPrograms(data.programs)
        if (Array.isArray(data.impactStories)) setFoundStories(data.impactStories)
        if (data.futureVision) setFoundVisionQuote(data.futureVision)
        break
      }
      case 'leadership': {
        if (data.overview) setLeadOverview(data.overview)
        if (Array.isArray(data.executiveRoles)) setExecutiveRoles(data.executiveRoles)
        if (Array.isArray(data.governanceRoles)) setGovernanceRoles(data.governanceRoles)
        break
      }
      case 'public-service': {
        if (data.overview) setPubOverview(data.overview)
        if (Array.isArray(data.quickFacts)) setPubQuickFacts(data.quickFacts)
        if (Array.isArray(data.roles)) setPubRoles(data.roles)
        if (Array.isArray(data.education)) setPubEducation(data.education)
        if (Array.isArray(data.foundationItems)) setPubFoundationItems(data.foundationItems)
        break
      }
    }
  }

  const resetAllSections = () => {
    setFoundOverview({ title: '', subtitle: '', description: '', vision: '', mission: '' })
    setFoundStats([])
    setFoundPrograms([])
    setFoundStories([])
    setFoundVisionQuote('')
    setLeadOverview({ title: '', subtitle: '', description: '' })
    setExecutiveRoles([])
    setGovernanceRoles([])
    setPubOverview({ title: '', subtitle: '', description: '' })
    setPubQuickFacts([])
    setPubRoles([])
    setPubEducation([])
    setPubFoundationItems([])
    setExpandedFoundStats([])
    setExpandedFoundPrograms([])
    setExpandedFoundStories([])
    setExpandedExecRoles([])
    setExpandedGovRoles([])
    setExpandedPubRoles([])
    setExpandedPubEducation([])
    setExpandedPubFoundation([])
  }

  // --------------- Save ---------------
  const saveAll = async () => {
    setSaving(true)
    setMessage('')
    setError('')
    try {
      let payload: any = {}
      if (slug === 'foundation') {
        payload = {
          overview: foundOverview,
          stats: foundStats,
          programs: foundPrograms,
          impactStories: foundStories,
          futureVision: foundVisionQuote,
        }
      } else if (slug === 'leadership') {
        payload = {
          overview: leadOverview,
          executiveRoles,
          governanceRoles,
        }
      } else if (slug === 'public-service') {
        payload = {
          overview: pubOverview,
          quickFacts: pubQuickFacts,
          roles: pubRoles,
          education: pubEducation,
          foundationItems: pubFoundationItems,
        }
      }
      const apiSlug = slug === 'foundation' ? 'foundation_story' : slug
      await api.put(`/impact/${apiSlug}`, payload)
      setMessage(`✨ Saved ${slug.replace(/-/g, ' ')} successfully!`)
      setTimeout(() => setMessage(''), 3000)
    } catch {
      setError('Save failed. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100/60">
        <Loader2 size={32} className="animate-spin text-emerald-500" />
        <p className="ml-3 text-sm text-slate-600">Loading {slug}...</p>
      </div>
    )
  }

  // --------------- Render per section ---------------
  if (slug === 'foundation') {
    return (
      <EditorShell
        slug="foundation"
        saving={saving}
        onSave={saveAll}
        message={message}
        error={error}
      >
        <Card title="Overview" description="Main title and description.">
          <div className="grid gap-6 md:grid-cols-2">
            <Field label="Title">
              <input
                className={formInput}
                value={foundOverview.title}
                onChange={(e) => setFoundOverview((p) => ({ ...p, title: e.target.value }))}
              />
            </Field>
            <Field label="Description">
              <textarea
                className={formInput}
                rows={4}
                value={foundOverview.description}
                onChange={(e) => setFoundOverview((p) => ({ ...p, description: e.target.value }))}
              />
            </Field>
          </div>
        </Card>
        <Card title="Vision & Mission" description="Core statements.">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="border-l-2 border-teal pl-4">
              <Field label="Vision">
                <textarea
                  className={formInput}
                  rows={4}
                  value={foundOverview.vision}
                  onChange={(e) => setFoundOverview((p) => ({ ...p, vision: e.target.value }))}
                />
              </Field>
            </div>
            <div className="border-l-2 border-gold pl-4">
              <Field label="Mission">
                <textarea
                  className={formInput}
                  rows={4}
                  value={foundOverview.mission}
                  onChange={(e) => setFoundOverview((p) => ({ ...p, mission: e.target.value }))}
                />
              </Field>
            </div>
          </div>
        </Card>

        <Card
          title="Stats"
          description="Key numbers displayed on the page."
          onAdd={() => {
            const s = createStat()
            setFoundStats((prev) => [...prev, s])
            setExpandedFoundStats((prev) => [...prev, s.id])
            setFocusId(s.id)
          }}
        >
          {foundStats.length === 0 ? (
            <EmptyState message="No stats yet." />
          ) : (
            foundStats.map((stat, idx) => (
              <ExpandableItem
                key={stat.id}
                item={stat}
                idx={idx}
                expanded={expandedFoundStats}
                setExpanded={setExpandedFoundStats}
                headerLabel={stat.label}
                headerValue={stat.value}
                isFocused={stat.id === focusId}
                refProp={newRef}
                onUp={() => setFoundStats((prev) => reorderArray(prev, idx, -1))}
                onDown={() => setFoundStats((prev) => reorderArray(prev, idx, 1))}
                onDelete={() => {
                  setFoundStats((prev) => prev.filter((s) => s.id !== stat.id))
                  setExpandedFoundStats((prev) => prev.filter((id) => id !== stat.id))
                }}
                upDisabled={idx === 0}
                downDisabled={idx === foundStats.length - 1}
              >
                <Field label="Label">
                  <input
                    className={formInput}
                    value={stat.label}
                    onChange={(e) =>
                      setFoundStats((prev) =>
                        prev.map((s) => (s.id === stat.id ? { ...s, label: e.target.value } : s)),
                      )
                    }
                  />
                </Field>
                <Field label="Value">
                  <input
                    className={formInput}
                    value={stat.value}
                    onChange={(e) =>
                      setFoundStats((prev) =>
                        prev.map((s) => (s.id === stat.id ? { ...s, value: e.target.value } : s)),
                      )
                    }
                  />
                </Field>
              </ExpandableItem>
            ))
          )}
        </Card>

        <Card
          title="Programs"
          description="Foundation programs and initiatives."
          onAdd={() => {
            const p = createProgram()
            setFoundPrograms((prev) => [...prev, p])
            setExpandedFoundPrograms((prev) => [...prev, p.id])
            setFocusId(p.id)
          }}
        >
          {foundPrograms.length === 0 ? (
            <EmptyState message="No programs yet." />
          ) : (
            foundPrograms.map((prog, idx) => (
              <ExpandableItem
                key={prog.id}
                item={prog}
                idx={idx}
                expanded={expandedFoundPrograms}
                setExpanded={setExpandedFoundPrograms}
                headerLabel="Program"
                headerValue={prog.title}
                isFocused={prog.id === focusId}
                refProp={newRef}
                onUp={() => setFoundPrograms((prev) => reorderArray(prev, idx, -1))}
                onDown={() => setFoundPrograms((prev) => reorderArray(prev, idx, 1))}
                onDelete={() => {
                  setFoundPrograms((prev) => prev.filter((p) => p.id !== prog.id))
                  setExpandedFoundPrograms((prev) => prev.filter((id) => id !== prog.id))
                }}
                upDisabled={idx === 0}
                downDisabled={idx === foundPrograms.length - 1}
              >
                <Field label="Title">
                  <input
                    className={formInput}
                    value={prog.title}
                    onChange={(e) =>
                      setFoundPrograms((prev) =>
                        prev.map((p) => (p.id === prog.id ? { ...p, title: e.target.value } : p)),
                      )
                    }
                  />
                </Field>
                <Field label="Description">
                  <textarea
                    className={formInput}
                    rows={4}
                    value={prog.description}
                    onChange={(e) =>
                      setFoundPrograms((prev) =>
                        prev.map((p) =>
                          p.id === prog.id ? { ...p, description: e.target.value } : p,
                        ),
                      )
                    }
                  />
                </Field>
                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Impact">
                    <input
                      className={formInput}
                      value={prog.impact}
                      onChange={(e) =>
                        setFoundPrograms((prev) =>
                          prev.map((p) =>
                            p.id === prog.id ? { ...p, impact: e.target.value } : p,
                          ),
                        )
                      }
                    />
                  </Field>
                  <Field label="Beneficiaries">
                    <input
                      className={formInput}
                      value={prog.beneficiaries}
                      onChange={(e) =>
                        setFoundPrograms((prev) =>
                          prev.map((p) =>
                            p.id === prog.id ? { ...p, beneficiaries: e.target.value } : p,
                          ),
                        )
                      }
                    />
                  </Field>
                </div>
                <Field label="Status">
                  <select
                    className={formInput}
                    value={prog.status}
                    onChange={(e) =>
                      setFoundPrograms((prev) =>
                        prev.map((p) => (p.id === prog.id ? { ...p, status: e.target.value } : p)),
                      )
                    }
                  >
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                    <option value="planned">Planned</option>
                  </select>
                </Field>
                <Field label="Icon (react-icons/fa)">
                  <select
                    className={formInput}
                    value={prog.icon || 'FaHeartbeat'}
                    onChange={(e) =>
                      setFoundPrograms((prev) =>
                        prev.map((p) => (p.id === prog.id ? { ...p, icon: e.target.value } : p)),
                      )
                    }
                  >
                    {iconOptions.map((icon) => (
                      <option key={icon} value={icon}>
                        {icon}
                      </option>
                    ))}
                  </select>
                </Field>
              </ExpandableItem>
            ))
          )}
        </Card>

        <Card
          title="Impact Stories"
          description="Real stories of change and impact."
          onAdd={() => {
            const s = createStory()
            setFoundStories((prev) => [...prev, s])
            setExpandedFoundStories((prev) => [...prev, s.id])
            setFocusId(s.id)
          }}
        >
          {foundStories.length === 0 ? (
            <EmptyState message="No stories yet." />
          ) : (
            foundStories.map((story, idx) => (
              <ExpandableItem
                key={story.id}
                item={story}
                idx={idx}
                expanded={expandedFoundStories}
                setExpanded={setExpandedFoundStories}
                headerLabel="Story"
                headerValue={story.title}
                isFocused={story.id === focusId}
                refProp={newRef}
                onUp={() => setFoundStories((prev) => reorderArray(prev, idx, -1))}
                onDown={() => setFoundStories((prev) => reorderArray(prev, idx, 1))}
                onDelete={() => {
                  setFoundStories((prev) => prev.filter((s) => s.id !== story.id))
                  setExpandedFoundStories((prev) => prev.filter((id) => id !== story.id))
                }}
                upDisabled={idx === 0}
                downDisabled={idx === foundStories.length - 1}
              >
                <Field label="Title">
                  <input
                    className={formInput}
                    value={story.title}
                    onChange={(e) =>
                      setFoundStories((prev) =>
                        prev.map((s) => (s.id === story.id ? { ...s, title: e.target.value } : s)),
                      )
                    }
                  />
                </Field>
                <Field label="Description">
                  <textarea
                    className={formInput}
                    rows={4}
                    value={story.description}
                    onChange={(e) =>
                      setFoundStories((prev) =>
                        prev.map((s) =>
                          s.id === story.id ? { ...s, description: e.target.value } : s,
                        ),
                      )
                    }
                  />
                </Field>
                <Field label="Beneficiary">
                  <input
                    className={formInput}
                    value={story.beneficiary}
                    onChange={(e) =>
                      setFoundStories((prev) =>
                        prev.map((s) =>
                          s.id === story.id ? { ...s, beneficiary: e.target.value } : s,
                        ),
                      )
                    }
                  />
                </Field>
              </ExpandableItem>
            ))
          )}
        </Card>

        <Card title="Future Vision Quote" description="The closing quote on the Foundation page.">
          <Field label="Quote">
            <textarea
              className={formInput}
              rows={6}
              value={foundVisionQuote}
              onChange={(e) => setFoundVisionQuote(e.target.value)}
            />
          </Field>
        </Card>
      </EditorShell>
    )
  }

  if (slug === 'leadership') {
    return (
      <EditorShell
        slug="leadership"
        saving={saving}
        onSave={saveAll}
        message={message}
        error={error}
      >
        <Card title="Hero Section" description="Title, subtitle, and description.">
          <Field label="Title">
            <input
              className={formInput}
              value={leadOverview.title}
              onChange={(e) => setLeadOverview((p) => ({ ...p, title: e.target.value }))}
            />
          </Field>
          <Field label="Subtitle">
            <input
              className={formInput}
              value={leadOverview.subtitle}
              onChange={(e) => setLeadOverview((p) => ({ ...p, subtitle: e.target.value }))}
            />
          </Field>
          <Field label="Description">
            <textarea
              className={formInput}
              rows={3}
              value={leadOverview.description}
              onChange={(e) => setLeadOverview((p) => ({ ...p, description: e.target.value }))}
            />
          </Field>
        </Card>

        <Card
          title="Executive Leadership"
          description="Founder & executive positions."
          onAdd={() => {
            const r = createRole('executive')
            setExecutiveRoles((prev) => [...prev, r])
            setExpandedExecRoles((prev) => [...prev, r.id])
            setFocusId(r.id)
          }}
        >
          {executiveRoles.length === 0 ? (
            <EmptyState message="No executive roles." />
          ) : (
            executiveRoles.map((role, idx) => (
              <ExpandableItem
                key={role.id}
                item={role}
                idx={idx}
                expanded={expandedExecRoles}
                setExpanded={setExpandedExecRoles}
                headerLabel={role.category}
                headerValue={role.title}
                isFocused={role.id === focusId}
                refProp={newRef}
                onUp={() => setExecutiveRoles((prev) => reorderArray(prev, idx, -1))}
                onDown={() => setExecutiveRoles((prev) => reorderArray(prev, idx, 1))}
                onDelete={() => {
                  setExecutiveRoles((prev) => prev.filter((r) => r.id !== role.id))
                  setExpandedExecRoles((prev) => prev.filter((id) => id !== role.id))
                }}
                upDisabled={idx === 0}
                downDisabled={idx === executiveRoles.length - 1}
              >
                <Field label="Title">
                  <input
                    className={formInput}
                    value={role.title}
                    onChange={(e) =>
                      setExecutiveRoles((prev) =>
                        prev.map((r) => (r.id === role.id ? { ...r, title: e.target.value } : r)),
                      )
                    }
                  />
                </Field>
                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Organization">
                    <input
                      className={formInput}
                      value={role.organization}
                      onChange={(e) =>
                        setExecutiveRoles((prev) =>
                          prev.map((r) =>
                            r.id === role.id ? { ...r, organization: e.target.value } : r,
                          ),
                        )
                      }
                    />
                  </Field>
                  <Field label="Period">
                    <input
                      className={formInput}
                      value={role.period}
                      onChange={(e) =>
                        setExecutiveRoles((prev) =>
                          prev.map((r) =>
                            r.id === role.id ? { ...r, period: e.target.value } : r,
                          ),
                        )
                      }
                    />
                  </Field>
                </div>
                <Field label="Description">
                  <textarea
                    className={formInput}
                    rows={4}
                    value={role.description}
                    onChange={(e) =>
                      setExecutiveRoles((prev) =>
                        prev.map((r) =>
                          r.id === role.id ? { ...r, description: e.target.value } : r,
                        ),
                      )
                    }
                  />
                </Field>
                <Field label="Highlights (one per line)">
                  <textarea
                    className={formInput}
                    rows={3}
                    value={role.highlights}
                    onChange={(e) =>
                      setExecutiveRoles((prev) =>
                        prev.map((r) =>
                          r.id === role.id ? { ...r, highlights: e.target.value } : r,
                        ),
                      )
                    }
                  />
                </Field>
                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Category">
                    <select
                      className={formInput}
                      value={role.category}
                      onChange={(e) =>
                        setExecutiveRoles((prev) =>
                          prev.map((r) =>
                            r.id === role.id ? { ...r, category: e.target.value } : r,
                          ),
                        )
                      }
                    >
                      <option value="executive">executive</option>
                      <option value="founder">founder</option>
                    </select>
                  </Field>
                  <Field label="Icon">
                    <select
                      className={formInput}
                      value={role.icon}
                      onChange={(e) =>
                        setExecutiveRoles((prev) =>
                          prev.map((r) => (r.id === role.id ? { ...r, icon: e.target.value } : r)),
                        )
                      }
                    >
                      {iconOptions.map((icon) => (
                        <option key={icon} value={icon}>
                          {icon}
                        </option>
                      ))}
                    </select>
                  </Field>
                </div>
              </ExpandableItem>
            ))
          )}
        </Card>

        <Card
          title="Governance & Advisory"
          description="Board and advisory memberships."
          onAdd={() => {
            const r = createRole('board')
            setGovernanceRoles((prev) => [...prev, r])
            setExpandedGovRoles((prev) => [...prev, r.id])
            setFocusId(r.id)
          }}
        >
          {governanceRoles.length === 0 ? (
            <EmptyState message="No governance roles." />
          ) : (
            governanceRoles.map((role, idx) => (
              <ExpandableItem
                key={role.id}
                item={role}
                idx={idx}
                expanded={expandedGovRoles}
                setExpanded={setExpandedGovRoles}
                headerLabel={role.category}
                headerValue={role.title}
                isFocused={role.id === focusId}
                refProp={newRef}
                onUp={() => setGovernanceRoles((prev) => reorderArray(prev, idx, -1))}
                onDown={() => setGovernanceRoles((prev) => reorderArray(prev, idx, 1))}
                onDelete={() => {
                  setGovernanceRoles((prev) => prev.filter((r) => r.id !== role.id))
                  setExpandedGovRoles((prev) => prev.filter((id) => id !== role.id))
                }}
                upDisabled={idx === 0}
                downDisabled={idx === governanceRoles.length - 1}
              >
                <Field label="Title">
                  <input
                    className={formInput}
                    value={role.title}
                    onChange={(e) =>
                      setGovernanceRoles((prev) =>
                        prev.map((r) => (r.id === role.id ? { ...r, title: e.target.value } : r)),
                      )
                    }
                  />
                </Field>
                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Organization">
                    <input
                      className={formInput}
                      value={role.organization}
                      onChange={(e) =>
                        setGovernanceRoles((prev) =>
                          prev.map((r) =>
                            r.id === role.id ? { ...r, organization: e.target.value } : r,
                          ),
                        )
                      }
                    />
                  </Field>
                  <Field label="Period">
                    <input
                      className={formInput}
                      value={role.period}
                      onChange={(e) =>
                        setGovernanceRoles((prev) =>
                          prev.map((r) =>
                            r.id === role.id ? { ...r, period: e.target.value } : r,
                          ),
                        )
                      }
                    />
                  </Field>
                </div>
                <Field label="Description">
                  <textarea
                    className={formInput}
                    rows={4}
                    value={role.description}
                    onChange={(e) =>
                      setGovernanceRoles((prev) =>
                        prev.map((r) =>
                          r.id === role.id ? { ...r, description: e.target.value } : r,
                        ),
                      )
                    }
                  />
                </Field>
                <Field label="Highlights (one per line)">
                  <textarea
                    className={formInput}
                    rows={3}
                    value={role.highlights}
                    onChange={(e) =>
                      setGovernanceRoles((prev) =>
                        prev.map((r) =>
                          r.id === role.id ? { ...r, highlights: e.target.value } : r,
                        ),
                      )
                    }
                  />
                </Field>
                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Category">
                    <select
                      className={formInput}
                      value={role.category}
                      onChange={(e) =>
                        setGovernanceRoles((prev) =>
                          prev.map((r) =>
                            r.id === role.id ? { ...r, category: e.target.value } : r,
                          ),
                        )
                      }
                    >
                      <option value="board">board</option>
                      <option value="advisory">advisory</option>
                    </select>
                  </Field>
                  <Field label="Icon">
                    <select
                      className={formInput}
                      value={role.icon}
                      onChange={(e) =>
                        setGovernanceRoles((prev) =>
                          prev.map((r) => (r.id === role.id ? { ...r, icon: e.target.value } : r)),
                        )
                      }
                    >
                      {iconOptions.map((icon) => (
                        <option key={icon} value={icon}>
                          {icon}
                        </option>
                      ))}
                    </select>
                  </Field>
                </div>
              </ExpandableItem>
            ))
          )}
        </Card>
      </EditorShell>
    )
  }

  if (slug === 'public-service') {
    return (
      <EditorShell
        slug="public-service"
        saving={saving}
        onSave={saveAll}
        message={message}
        error={error}
      >
        <Card title="Hero Section" description="Title, subtitle, and description.">
          <div className="grid gap-6 md:grid-cols-2">
            <Field label="Title">
              <input
                className={formInput}
                value={pubOverview.title}
                onChange={(e) => setPubOverview((p) => ({ ...p, title: e.target.value }))}
              />
            </Field>
            <Field label="Subtitle">
              <input
                className={formInput}
                value={pubOverview.subtitle}
                onChange={(e) => setPubOverview((p) => ({ ...p, subtitle: e.target.value }))}
              />
            </Field>
            <div className="md:col-span-2">
              <Field label="Description">
                <textarea
                  className={formInput}
                  rows={4}
                  value={pubOverview.description}
                  onChange={(e) => setPubOverview((p) => ({ ...p, description: e.target.value }))}
                />
              </Field>
            </div>
          </div>
        </Card>

        <Card
          title="Hero Quick Facts"
          description="Three summary facts displayed under the hero copy."
          onAdd={() => {
            const fact: QuickFact = { id: `fact-${Date.now()}`, label: 'New Fact', value: '' }
            setPubQuickFacts((prev) => [...prev, fact])
            setExpandedPubRoles((prev) => [...prev, fact.id])
            setFocusId(fact.id)
          }}
        >
          {pubQuickFacts.length === 0 ? (
            <EmptyState message="No quick facts yet." />
          ) : (
            pubQuickFacts.map((fact, idx) => (
              <ExpandableItem
                key={fact.id}
                item={fact}
                idx={idx}
                expanded={expandedPubRoles}
                setExpanded={setExpandedPubRoles}
                headerLabel="Quick Fact"
                headerValue={fact.label}
                isFocused={fact.id === focusId}
                refProp={newRef}
                onUp={() => setPubQuickFacts((prev) => reorderArray(prev, idx, -1))}
                onDown={() => setPubQuickFacts((prev) => reorderArray(prev, idx, 1))}
                onDelete={() => {
                  setPubQuickFacts((prev) => prev.filter((f) => f.id !== fact.id))
                  setExpandedPubRoles((prev) => prev.filter((id) => id !== fact.id))
                }}
                upDisabled={idx === 0}
                downDisabled={idx === pubQuickFacts.length - 1}
              >
                <Field label="Label">
                  <input
                    className={formInput}
                    value={fact.label}
                    onChange={(e) =>
                      setPubQuickFacts((prev) =>
                        prev.map((f) => (f.id === fact.id ? { ...f, label: e.target.value } : f)),
                      )
                    }
                  />
                </Field>
                <Field label="Value">
                  <input
                    className={formInput}
                    value={fact.value}
                    onChange={(e) =>
                      setPubQuickFacts((prev) =>
                        prev.map((f) => (f.id === fact.id ? { ...f, value: e.target.value } : f)),
                      )
                    }
                  />
                </Field>
              </ExpandableItem>
            ))
          )}
        </Card>

        <Card
          title="Policy & Leadership Roles"
          description="Advisory, federation, innovation, and policy roles."
          onAdd={() => {
            const r = createRole('advisory')
            setPubRoles((prev) => [...prev, r])
            setExpandedPubRoles((prev) => [...prev, r.id])
            setFocusId(r.id)
          }}
        >
          {pubRoles.length === 0 ? (
            <EmptyState message="No roles." />
          ) : (
            pubRoles.map((role, idx) => (
              <ExpandableItem
                key={role.id}
                item={role}
                idx={idx}
                expanded={expandedPubRoles}
                setExpanded={setExpandedPubRoles}
                headerLabel={role.category}
                headerValue={role.title}
                isFocused={role.id === focusId}
                refProp={newRef}
                onUp={() => setPubRoles((prev) => reorderArray(prev, idx, -1))}
                onDown={() => setPubRoles((prev) => reorderArray(prev, idx, 1))}
                onDelete={() => {
                  setPubRoles((prev) => prev.filter((r) => r.id !== role.id))
                  setExpandedPubRoles((prev) => prev.filter((id) => id !== role.id))
                }}
                upDisabled={idx === 0}
                downDisabled={idx === pubRoles.length - 1}
              >
                <Field label="Title">
                  <input
                    className={formInput}
                    value={role.title}
                    onChange={(e) =>
                      setPubRoles((prev) =>
                        prev.map((r) => (r.id === role.id ? { ...r, title: e.target.value } : r)),
                      )
                    }
                  />
                </Field>
                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Organization">
                    <input
                      className={formInput}
                      value={role.organization}
                      onChange={(e) =>
                        setPubRoles((prev) =>
                          prev.map((r) =>
                            r.id === role.id ? { ...r, organization: e.target.value } : r,
                          ),
                        )
                      }
                    />
                  </Field>
                  <Field label="Period">
                    <input
                      className={formInput}
                      value={role.period}
                      onChange={(e) =>
                        setPubRoles((prev) =>
                          prev.map((r) =>
                            r.id === role.id ? { ...r, period: e.target.value } : r,
                          ),
                        )
                      }
                    />
                  </Field>
                </div>
                <Field label="Description">
                  <textarea
                    className={formInput}
                    rows={4}
                    value={role.description}
                    onChange={(e) =>
                      setPubRoles((prev) =>
                        prev.map((r) =>
                          r.id === role.id ? { ...r, description: e.target.value } : r,
                        ),
                      )
                    }
                  />
                </Field>
                <Field label="Highlights (one per line)">
                  <textarea
                    className={formInput}
                    rows={3}
                    value={role.highlights}
                    onChange={(e) =>
                      setPubRoles((prev) =>
                        prev.map((r) =>
                          r.id === role.id ? { ...r, highlights: e.target.value } : r,
                        ),
                      )
                    }
                  />
                </Field>
                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Category">
                    <select
                      className={formInput}
                      value={role.category}
                      onChange={(e) =>
                        setPubRoles((prev) =>
                          prev.map((r) =>
                            r.id === role.id ? { ...r, category: e.target.value } : r,
                          ),
                        )
                      }
                    >
                      <option value="advisory">advisory</option>
                      <option value="federation">federation</option>
                      <option value="innovation">innovation</option>
                      <option value="policy">policy</option>
                    </select>
                  </Field>
                  <Field label="Icon">
                    <select
                      className={formInput}
                      value={role.icon}
                      onChange={(e) =>
                        setPubRoles((prev) =>
                          prev.map((r) => (r.id === role.id ? { ...r, icon: e.target.value } : r)),
                        )
                      }
                    >
                      {iconOptions.map((icon) => (
                        <option key={icon} value={icon}>
                          {icon}
                        </option>
                      ))}
                    </select>
                  </Field>
                </div>
              </ExpandableItem>
            ))
          )}
        </Card>

        <Card
          title="Academic Pedigree"
          description="Degrees and qualifications."
          onAdd={() => {
            const e = createEducation()
            setPubEducation((prev) => [...prev, e])
            setExpandedPubEducation((prev) => [...prev, e.id])
            setFocusId(e.id)
          }}
        >
          {pubEducation.length === 0 ? (
            <EmptyState message="No degrees." />
          ) : (
            pubEducation.map((edu, idx) => (
              <ExpandableItem
                key={edu.id}
                item={edu}
                idx={idx}
                expanded={expandedPubEducation}
                setExpanded={setExpandedPubEducation}
                headerLabel="Degree"
                headerValue={edu.degree}
                isFocused={edu.id === focusId}
                refProp={newRef}
                onUp={() => setPubEducation((prev) => reorderArray(prev, idx, -1))}
                onDown={() => setPubEducation((prev) => reorderArray(prev, idx, 1))}
                onDelete={() => {
                  setPubEducation((prev) => prev.filter((e) => e.id !== edu.id))
                  setExpandedPubEducation((prev) => prev.filter((id) => id !== edu.id))
                }}
                upDisabled={idx === 0}
                downDisabled={idx === pubEducation.length - 1}
              >
                <Field label="Degree">
                  <input
                    className={formInput}
                    value={edu.degree}
                    onChange={(e) =>
                      setPubEducation((prev) =>
                        prev.map((ed) =>
                          ed.id === edu.id ? { ...ed, degree: e.target.value } : ed,
                        ),
                      )
                    }
                  />
                </Field>
                <Field label="Institution">
                  <input
                    className={formInput}
                    value={edu.institution}
                    onChange={(e) =>
                      setPubEducation((prev) =>
                        prev.map((ed) =>
                          ed.id === edu.id ? { ...ed, institution: e.target.value } : ed,
                        ),
                      )
                    }
                  />
                </Field>
                <Field label="Footer">
                  <input
                    className={formInput}
                    value={edu.footer}
                    onChange={(e) =>
                      setPubEducation((prev) =>
                        prev.map((ed) =>
                          ed.id === edu.id ? { ...ed, footer: e.target.value } : ed,
                        ),
                      )
                    }
                  />
                </Field>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={edu.highlight}
                    onChange={(e) =>
                      setPubEducation((prev) =>
                        prev.map((ed) =>
                          ed.id === edu.id ? { ...ed, highlight: e.target.checked } : ed,
                        ),
                      )
                    }
                  />
                  <span className="text-sm text-slate-600">Highlight this degree</span>
                </label>
              </ExpandableItem>
            ))
          )}
        </Card>

        <Card
          title="Foundation Items"
          description="Key focus areas."
          onAdd={() => {
            const f = createFoundationItem()
            setPubFoundationItems((prev) => [...prev, f])
            setExpandedPubFoundation((prev) => [...prev, f.id])
            setFocusId(f.id)
          }}
        >
          {pubFoundationItems.length === 0 ? (
            <EmptyState message="No foundation items." />
          ) : (
            pubFoundationItems.map((item, idx) => (
              <ExpandableItem
                key={item.id}
                item={item}
                idx={idx}
                expanded={expandedPubFoundation}
                setExpanded={setExpandedPubFoundation}
                headerLabel="Item"
                headerValue={item.title}
                isFocused={item.id === focusId}
                refProp={newRef}
                onUp={() => setPubFoundationItems((prev) => reorderArray(prev, idx, -1))}
                onDown={() => setPubFoundationItems((prev) => reorderArray(prev, idx, 1))}
                onDelete={() => {
                  setPubFoundationItems((prev) => prev.filter((i) => i.id !== item.id))
                  setExpandedPubFoundation((prev) => prev.filter((id) => id !== item.id))
                }}
                upDisabled={idx === 0}
                downDisabled={idx === pubFoundationItems.length - 1}
              >
                <Field label="Title">
                  <input
                    className={formInput}
                    value={item.title}
                    onChange={(e) =>
                      setPubFoundationItems((prev) =>
                        prev.map((i) => (i.id === item.id ? { ...i, title: e.target.value } : i)),
                      )
                    }
                  />
                </Field>
                <Field label="Description">
                  <textarea
                    className={formInput}
                    rows={3}
                    value={item.description}
                    onChange={(e) =>
                      setPubFoundationItems((prev) =>
                        prev.map((i) =>
                          i.id === item.id ? { ...i, description: e.target.value } : i,
                        ),
                      )
                    }
                  />
                </Field>
                <Field label="Icon">
                  <select
                    className={formInput}
                    value={item.icon}
                    onChange={(e) =>
                      setPubFoundationItems((prev) =>
                        prev.map((i) => (i.id === item.id ? { ...i, icon: e.target.value } : i)),
                      )
                    }
                  >
                    {iconOptions.map((icon) => (
                      <option key={icon} value={icon}>
                        {icon}
                      </option>
                    ))}
                  </select>
                </Field>
              </ExpandableItem>
            ))
          )}
        </Card>
      </EditorShell>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100/60">
      <p className="text-lg text-slate-600">
        Editor for <strong>{slug?.replace(/-/g, ' ')}</strong> not available.
      </p>
    </div>
  )
}
