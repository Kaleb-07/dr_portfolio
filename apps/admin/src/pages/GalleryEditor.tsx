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
                    GALLERY
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

interface GalleryItem {
  id: string
  src: string
  alt: string
  caption: string
  category: string
  date: string
  location: string
}

interface GalleryDraft {
  eyebrow: string
  title: string
  description: string
  items: GalleryItem[]
}

const normalizeGallery = (entry: any): GalleryItem => ({
  id: entry.id || `gallery-${Math.random().toString(36).slice(2)}`,
  src: entry.src || '',
  alt: entry.alt || '',
  caption: entry.caption || '',
  category: entry.category || 'community',
  date: entry.date || '',
  location: entry.location || '',
})

const emptyGallery = (): GalleryItem => normalizeGallery({ id: `new-${Date.now()}` })

// ------------------------------------------------------------------
// Main Component
// ------------------------------------------------------------------

export default function GalleryEditor() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const [section, setSection] = useState<GalleryDraft>({
    eyebrow: 'Visual Archive',
    title: 'A visual journey',
    description:
      'A curated archive of milestones, leadership moments, and community impact captured over the years.',
    items: [],
  })

  // Keep a pristine copy for undo
  const backupRef = useRef<GalleryDraft | null>(null)

  const [expandedItems, setExpandedItems] = useState<string[]>([])
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
      const aboutGallery = response.data?.sections?.about_gallery || {}
      const fresh: GalleryDraft = {
        eyebrow: aboutGallery.eyebrow || section.eyebrow,
        title: aboutGallery.title || section.title,
        description: aboutGallery.description || section.description,
        items:
          Array.isArray(aboutGallery.blocks) && aboutGallery.blocks.length > 0
            ? aboutGallery.blocks.map((block: any) => ({
                id: String(block.id),
                src: block.image_url || '',
                alt: block.image_alt || block.title || '',
                caption: block.body || '',
                category: String(block.metadata?.category || 'community'),
                date: String(block.metadata?.date || ''),
                location: String(block.metadata?.location || ''),
              }))
            : section.items,
      }
      setSection(fresh)
      backupRef.current = structuredClone(fresh)
      return fresh
    } catch (err) {
      console.error('Failed to fetch gallery data', err)
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
        if (active) setError('Could not load gallery content. Using defaults.')
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
      setExpandedItems([])
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
      await api.put('/cms/sections/about_gallery', {
        section: {
          eyebrow: section.eyebrow,
          title: section.title,
          description: section.description,
        },
        blocks: section.items.map((item) => ({
          title: item.alt || item.caption,
          body: item.caption,
          image_url: item.src,
          image_alt: item.alt,
          metadata: {
            category: item.category,
            date: item.date,
            location: item.location,
          },
        })),
      })
      // Refresh to get the latest state and update backup
      await fetchData()
      setMessage('✨ Gallery saved successfully!')
      setTimeout(() => setMessage(''), 3000)
    } catch {
      setError('Could not save gallery content.')
    } finally {
      setSaving(false)
    }
  }

  // Item operations
  const addItem = () => {
    const newItem = emptyGallery()
    setSection((prev) => ({
      ...prev,
      items: [...prev.items, newItem],
    }))
    setExpandedItems((prev) => [...prev, String(section.items.length)])
    setFocusId(newItem.id)
  }

  const updateItem = (index: number, patch: Partial<GalleryItem>) => {
    setSection((prev) => ({
      ...prev,
      items: prev.items.map((item, i) => (i === index ? { ...item, ...patch } : item)),
    }))
  }

  const confirmDeleteItem = (index: number) => {
    askConfirm(
      'Delete gallery item?',
      'This cannot be undone. Are you sure you want to remove this item from the gallery?',
      () => {
        setSection((prev) => ({
          ...prev,
          items: prev.items.filter((_, i) => i !== index),
        }))
        setExpandedItems((prev) => prev.filter((id) => id !== String(index)))
        setConfirm({ open: false })
      },
    )
  }

  const reorderItem = (index: number, direction: number) => {
    setSection((prev) => {
      const items = [...prev.items]
      const target = index + direction
      if (target < 0 || target >= items.length) return prev
      ;[items[index], items[target]] = [items[target], items[index]]
      return { ...prev, items }
    })
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="animate-spin text-emerald-500" size={32} />
        <p className="ml-3 text-slate-600">Loading Gallery...</p>
      </div>
    )
  }

  return (
    <>
      <EditorShell
        title="Gallery"
        saving={saving}
        onSave={save}
        onUndo={handleUndo}
        message={message}
        error={error}
      >
        {/* Hero Card */}
        <Card title="Gallery Hero" description="Top section of the Gallery page.">
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
                  onChange={(e) =>
                    setSection((prev) => ({ ...prev, description: e.target.value }))
                  }
                />
              </Field>
            </div>
          </div>
        </Card>

        {/* Gallery Entries Card */}
        <Card title="Gallery Entries" description="Image cards displayed publicly." onAdd={addItem}>
          {section.items.length === 0 ? (
            <EmptyState message="No gallery items yet. Add one to get started." />
          ) : (
            section.items.map((item, idx) => (
              <ExpandableItem
                key={item.id}
                idx={idx}
                expanded={expandedItems}
                setExpanded={setExpandedItems}
                headerLabel={item.category}
                headerValue={item.caption || item.alt || 'Untitled'}
                isFocused={item.id === focusId}
                refProp={newRef}
                onUp={() => reorderItem(idx, -1)}
                onDown={() => reorderItem(idx, 1)}
                onDelete={() => confirmDeleteItem(idx)}
                upDisabled={idx === 0}
                downDisabled={idx === section.items.length - 1}
              >
                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Image URL">
                    <input
                      className={formInput}
                      value={item.src}
                      onChange={(e) => updateItem(idx, { src: e.target.value })}
                    />
                  </Field>
                  <Field label="Alt Text">
                    <input
                      className={formInput}
                      value={item.alt}
                      onChange={(e) => updateItem(idx, { alt: e.target.value })}
                    />
                  </Field>
                  <Field label="Category">
                    <select
                      className={formInput}
                      value={item.category}
                      onChange={(e) => updateItem(idx, { category: e.target.value })}
                    >
                      {[
                        'leadership',
                        'healthcare',
                        'education',
                        'awards',
                        'community',
                        'conferences',
                      ].map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Date">
                    <input
                      className={formInput}
                      value={item.date}
                      onChange={(e) => updateItem(idx, { date: e.target.value })}
                    />
                  </Field>
                  <Field label="Location">
                    <input
                      className={formInput}
                      value={item.location}
                      onChange={(e) => updateItem(idx, { location: e.target.value })}
                    />
                  </Field>
                  <div className="md:col-span-2">
                    <Field label="Caption">
                      <textarea
                        className={formInput}
                        rows={3}
                        value={item.caption}
                        onChange={(e) => updateItem(idx, { caption: e.target.value })}
                      />
                    </Field>
                  </div>
                </div>
              </ExpandableItem>
            ))
          )}
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
