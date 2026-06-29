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
import UndoButton from '../components/UndoButton'

// ------------------------------------------------------------------
// Helpers
// ------------------------------------------------------------------
export const formInput =
  'w-full rounded-xl border border-slate-200 bg-white/70 backdrop-blur px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/10 focus:bg-white shadow-sm hover:border-emerald-300 hover:shadow-md'

export const labelClass =
  'mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-600'

export interface FieldProps {
  label: string
  children: React.ReactNode
  hint?: string
}
export const Field = ({ label, children, hint }: FieldProps) => (
  <label className="block">
    <span className={labelClass}>{label}</span>
    {children}
    {hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
  </label>
)

export interface IconButtonProps {
  label: string
  onClick: () => void
  children: React.ReactNode
  disabled?: boolean
  danger?: boolean
}
export const IconButton = ({
  label,
  onClick,
  children,
  disabled,
  danger = false,
}: IconButtonProps) => (
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

export interface ToastProps {
  message: string
  error: string
}
export const Toast = ({ message, error }: ToastProps) => {
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
// Reusable sub‑components
// ------------------------------------------------------------------
export function EditorShell({
  slug,
  saving,
  onSave,
  onUndo,
  message,
  error,
  children,
}: {
  slug: string
  saving: boolean
  onSave: () => void
  onUndo?: () => void
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

export function Card({
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

export function ExpandableItem({
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

export function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center hover:border-emerald-300 hover:bg-emerald-50 transition-all">
      <p className="text-slate-600">{message}</p>
    </div>
  )
}

// ------------------------------------------------------------------
// Types
// ------------------------------------------------------------------
export interface Overview {
  title: string
  subtitle: string
  description: string
  vision?: string
  mission?: string
}

export interface Stat {
  id: string
  label: string
  value: string
}

export interface Program {
  id: string
  title: string
  description: string
  impact: string
  beneficiaries: string
  status: string
  icon: string
}

export interface Story {
  id: string
  title: string
  description: string
  beneficiary: string
}

export interface Role {
  id: string
  title: string
  organization: string
  period: string
  description: string
  highlights: string | string[]
  category: string
  icon: string
}

export interface Education {
  id: string
  degree: string
  institution: string
  footer: string
  highlight: boolean
}

export interface FoundationItem {
  id: string
  title: string
  description: string
  icon: string
}

export interface QuickFact {
  id: string
  label: string
  value: string
}

// ------------------------------------------------------------------
// Default factories
// ------------------------------------------------------------------
export const createStat = (): Stat => ({
  id: `stat-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
  label: 'New Stat',
  value: '0',
})
export const createProgram = (): Program => ({
  id: `prog-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
  title: 'New Program',
  description: '',
  impact: '',
  beneficiaries: '',
  status: 'active',
  icon: 'FaHeartbeat',
})
export const createStory = (): Story => ({
  id: `story-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
  title: 'New Story',
  description: '',
  beneficiary: '',
})
export const createRole = (category = 'board'): Role => ({
  id: `role-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
  title: 'New Role',
  organization: '',
  period: '',
  description: '',
  highlights: '',
  category,
  icon: 'FaBuilding',
})
export const createEducation = (): Education => ({
  id: `edu-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
  degree: 'New Degree',
  institution: '',
  footer: '',
  highlight: false,
})
export const createFoundationItem = (): FoundationItem => ({
  id: `found-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
  title: 'New Item',
  description: '',
  icon: 'FaHandshake',
})

export const reorderArray = <T,>(arr: T[], idx: number, dir: number): T[] => {
  const next = [...arr]
  const target = idx + dir
  if (target < 0 || target >= next.length) return arr
  ;[next[idx], next[target]] = [next[target], next[idx]]
  return next
}

export const iconOptions = [
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