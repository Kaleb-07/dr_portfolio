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

// ------------------------------------------------------------------
// Reusable sub‑components
// ------------------------------------------------------------------
function EditorShell({
  title,
  saving,
  onSave,
  onUndo,
  message,
  error,
  children,
}: {
  title: string
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
              <div className="rounded-2xl border border-slate-200 bg-white/80 backdrop-blur-md p-6 shadow-sm hover:shadow-lg transition-all">
                <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                  <Eye size={14} className="text-emerald-500" /> Live Preview
                </h3>
                <div className="rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-slate-900 min-h-[160px]">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                    EDUCATION
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

interface EducationEntry {
  id: string
  institution: string
  degree: string
  field: string
  year: number
  description: string
  highlights: string[]
}

interface EducationDraft {
  eyebrow: string
  title: string
  description: string
  membershipsEyebrow: string
  membershipsTitle: string
  membershipsDescription: string
  education: EducationEntry[]
  memberships: string[]
}

function normalizeEducation(entry: any): EducationEntry {
  return {
    id: entry.id || `edu-${Math.random().toString(36).slice(2)}`,
    institution: entry.institution || '',
    degree: entry.degree || '',
    field: entry.field || '',
    year: entry.year || new Date().getFullYear(),
    description: entry.description || '',
    highlights: Array.isArray(entry.highlights) ? entry.highlights : [],
  }
}

// ------------------------------------------------------------------
// Main Component
// ------------------------------------------------------------------

export default function EducationEditor() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const [section, setSection] = useState<EducationDraft>({
    eyebrow: 'Credentials',
    title: 'Academic foundations',
    description: 'Academic training and professional credentials that shaped the journey.',
    membershipsEyebrow: 'Affiliations',
    membershipsTitle: 'Professional memberships',
    membershipsDescription:
      'Active roles across national and international professional bodies in healthcare leadership and community service.',
    education: [],
    memberships: [],
  })

  // Keep a pristine copy for undo
  const backupRef = useRef<EducationDraft | null>(null)

  const [expandedEducation, setExpandedEducation] = useState<string[]>([])
  const newRef = useRef<HTMLDivElement | null>(null)
  const [focusId, setFocusId] = useState<string | null>(null)

  // Confirm dialog state
  const [confirm, setConfirm] = useState<{
    open: boolean
    title?: string
    message?: string
    onConfirm?: () => void
  }>({ open: false })

  const askConfirm = (title: string, message: string, onConfirm: () => void) => {
    setConfirm({ open: true, title, message, onConfirm })
  }

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

  // Fetch data helper
  const fetchData = async () => {
    try {
      const response = await api.get('/cms/site-content')
      const aboutEducation = response.data?.sections?.about_education || {}
      const fresh: EducationDraft = {
        eyebrow: aboutEducation.eyebrow || section.eyebrow,
        title: aboutEducation.title || section.title,
        description: aboutEducation.description || section.description,
        membershipsEyebrow: String(
          aboutEducation.metadata?.membership_eyebrow || section.membershipsEyebrow,
        ),
        membershipsTitle: String(
          aboutEducation.metadata?.membership_title || section.membershipsTitle,
        ),
        membershipsDescription: String(
          aboutEducation.metadata?.membership_description || section.membershipsDescription,
        ),
        education:
          Array.isArray(aboutEducation.blocks) && aboutEducation.blocks.length > 0
            ? aboutEducation.blocks.map((block: any) => ({
                id: String(block.id),
                institution: block.title || '',
                degree: String(block.metadata?.degree || ''),
                field: String(block.metadata?.field || ''),
                year: Number(block.metadata?.year || new Date().getFullYear()),
                description: block.body || '',
                highlights: Array.isArray(block.metadata?.highlights)
                  ? block.metadata.highlights
                  : [],
              }))
            : section.education,
        memberships: Array.isArray(aboutEducation.metadata?.memberships)
          ? aboutEducation.metadata.memberships
          : section.memberships,
      }
      setSection(fresh)
      backupRef.current = structuredClone(fresh)
      return fresh
    } catch (err) {
      console.error('Failed to fetch education data', err)
      throw err
    }
  }

  // Initial load
  useEffect(() => {
    let active = true
    const load = async () => {
      setLoading(true)
      try {
        await fetchData()
      } catch {
        if (active) setError('Could not load education content. Using defaults.')
      } finally {
        if (active) setLoading(false)
      }
    }
    load()
    return () => {
      active = false
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Undo to last saved state
  const handleUndo = () => {
    if (backupRef.current) {
      setSection(structuredClone(backupRef.current))
      setExpandedEducation([])
      setMessage('↩ Reverted to last saved version')
      setTimeout(() => setMessage(''), 3000)
    }
  }

  // Save
  const save = async () => {
    setSaving(true)
    setMessage('')
    setError('')
    try {
      await api.put('/cms/sections/about_education', {
        section: {
          eyebrow: section.eyebrow,
          title: section.title,
          description: section.description,
          metadata: {
            membership_eyebrow: section.membershipsEyebrow,
            membership_title: section.membershipsTitle,
            membership_description: section.membershipsDescription,
            memberships: section.memberships,
          },
        },
        blocks: section.education.map((item) => ({
          title: item.institution,
          body: item.description,
          metadata: {
            degree: item.degree,
            field: item.field,
            year: item.year,
            highlights: item.highlights,
          },
        })),
      })
      // Refresh to get the latest state and update backup
      await fetchData()
      setMessage('✨ Education saved successfully!')
      setTimeout(() => setMessage(''), 3000)
    } catch {
      setError('Could not save education content.')
    } finally {
      setSaving(false)
    }
  }

  // Education entry operations
  const addEducation = () => {
    const newEdu = normalizeEducation({ id: `new-${Date.now()}` })
    setSection((prev) => ({
      ...prev,
      education: [...prev.education, newEdu],
    }))
    setExpandedEducation((prev) => [...prev, String(section.education.length)])
    setFocusId(newEdu.id)
  }

  const updateEducation = (index: number, patch: Partial<EducationEntry>) => {
    setSection((prev) => ({
      ...prev,
      education: prev.education.map((item, i) => (i === index ? { ...item, ...patch } : item)),
    }))
  }

  const confirmDeleteEducation = (index: number) => {
    askConfirm(
      'Delete education entry?',
      'This cannot be undone. Are you sure you want to remove this education entry?',
      () => {
        setSection((prev) => ({
          ...prev,
          education: prev.education.filter((_, i) => i !== index),
        }))
        setExpandedEducation((prev) => prev.filter((id) => id !== String(index)))
        setConfirm({ open: false })
      },
    )
  }

  const reorderEducation = (index: number, direction: number) => {
    setSection((prev) => {
      const list = [...prev.education]
      const target = index + direction
      if (target < 0 || target >= list.length) return prev
      ;[list[index], list[target]] = [list[target], list[index]]
      return { ...prev, education: list }
    })
  }

  // Memberships operations
  const addMembership = () => {
    setSection((prev) => ({ ...prev, memberships: [...prev.memberships, ''] }))
  }

  const updateMembership = (index: number, value: string) => {
    setSection((prev) => ({
      ...prev,
      memberships: prev.memberships.map((m, i) => (i === index ? value : m)),
    }))
  }

  const confirmDeleteMembership = (index: number) => {
    askConfirm(
      'Delete membership?',
      'Are you sure you want to remove this membership from the list?',
      () => {
        setSection((prev) => ({
          ...prev,
          memberships: prev.memberships.filter((_, i) => i !== index),
        }))
        setConfirm({ open: false })
      },
    )
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="animate-spin text-emerald-500" size={32} />
        <p className="ml-3 text-slate-600">Loading Education...</p>
      </div>
    )
  }

  return (
    <>
      <EditorShell
        title="Education"
        saving={saving}
        onSave={save}
        onUndo={handleUndo}
        message={message}
        error={error}
      >
        {/* Hero Card */}
        <Card title="Education Hero" description="Top section of the Education page.">
          <div className="grid gap-6 md:grid-cols-2">
            <Field label="Eyebrow">
              <input
                className={formInput}
                value={section.eyebrow}
                onChange={(e) => setSection((prev) => ({ ...prev, eyebrow: e.target.value }))}
              />
            </Field>
            <Field label="Title">
              <input
                className={formInput}
                value={section.title}
                onChange={(e) => setSection((prev) => ({ ...prev, title: e.target.value }))}
              />
            </Field>
            <div className="md:col-span-2">
              <Field label="Description">
                <textarea
                  className={formInput}
                  rows={4}
                  value={section.description}
                  onChange={(e) => setSection((prev) => ({ ...prev, description: e.target.value }))}
                />
              </Field>
            </div>
          </div>
        </Card>

        {/* Education Entries Card */}
        <Card
          title="Education Entries"
          description="Degree cards shown on the site."
          onAdd={addEducation}
        >
          {section.education.length === 0 ? (
            <EmptyState message="No education entries yet. Add one to get started." />
          ) : (
            section.education.map((item, idx) => (
              <ExpandableItem
                key={item.id}
                idx={idx}
                expanded={expandedEducation}
                setExpanded={setExpandedEducation}
                headerLabel={item.institution || 'Institution'}
                headerValue={item.degree || 'Degree'}
                isFocused={item.id === focusId}
                refProp={newRef}
                onUp={() => reorderEducation(idx, -1)}
                onDown={() => reorderEducation(idx, 1)}
                onDelete={() => confirmDeleteEducation(idx)}
                upDisabled={idx === 0}
                downDisabled={idx === section.education.length - 1}
              >
                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Institution">
                    <input
                      className={formInput}
                      value={item.institution}
                      onChange={(e) => updateEducation(idx, { institution: e.target.value })}
                    />
                  </Field>
                  <Field label="Degree">
                    <input
                      className={formInput}
                      value={item.degree}
                      onChange={(e) => updateEducation(idx, { degree: e.target.value })}
                    />
                  </Field>
                  <Field label="Field">
                    <input
                      className={formInput}
                      value={item.field}
                      onChange={(e) => updateEducation(idx, { field: e.target.value })}
                    />
                  </Field>
                  <Field label="Year">
                    <input
                      className={formInput}
                      type="number"
                      value={item.year}
                      onChange={(e) => updateEducation(idx, { year: Number(e.target.value) })}
                    />
                  </Field>
                  <div className="md:col-span-2">
                    <Field label="Description">
                      <textarea
                        className={formInput}
                        rows={4}
                        value={item.description}
                        onChange={(e) => updateEducation(idx, { description: e.target.value })}
                      />
                    </Field>
                  </div>
                  <div className="md:col-span-2">
                    <Field label="Highlights (one per line)">
                      <textarea
                        className={formInput}
                        rows={3}
                        value={item.highlights.join('\n')}
                        onChange={(e) =>
                          updateEducation(idx, { highlights: e.target.value.split('\n') })
                        }
                      />
                    </Field>
                  </div>
                </div>
              </ExpandableItem>
            ))
          )}
        </Card>

        {/* Memberships Card */}
        <Card title="Professional Memberships" description="Manage the membership list.">
          <div className="grid gap-6 md:grid-cols-2 mb-6">
            <Field label="Eyebrow">
              <input
                className={formInput}
                value={section.membershipsEyebrow}
                onChange={(e) =>
                  setSection((prev) => ({ ...prev, membershipsEyebrow: e.target.value }))
                }
              />
            </Field>
            <Field label="Title">
              <input
                className={formInput}
                value={section.membershipsTitle}
                onChange={(e) =>
                  setSection((prev) => ({ ...prev, membershipsTitle: e.target.value }))
                }
              />
            </Field>
            <div className="md:col-span-2">
              <Field label="Description">
                <textarea
                  className={formInput}
                  rows={4}
                  value={section.membershipsDescription}
                  onChange={(e) =>
                    setSection((prev) => ({ ...prev, membershipsDescription: e.target.value }))
                  }
                />
              </Field>
            </div>
          </div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold text-slate-700">Membership List</p>
            <button
              onClick={addMembership}
              className="inline-flex items-center gap-1 rounded-lg bg-emerald-500 px-3 py-1.5 text-xs font-semibold text-white"
            >
              <Plus size={14} /> Add
            </button>
          </div>
          {section.memberships.map((mem, idx) => (
            <div key={idx} className="flex gap-2 mb-2">
              <input
                className={formInput}
                value={mem}
                onChange={(e) => updateMembership(idx, e.target.value)}
                placeholder="Organization name"
              />
              <IconButton
                label="Delete"
                danger
                onClick={() => confirmDeleteMembership(idx)}
              >
                <Trash2 size={14} />
              </IconButton>
            </div>
          ))}
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
