import MediaPicker from '../components/MediaPicker'
import { useEffect, useRef, useState } from 'react'
import {
  AlertCircle,
  ArrowDown,
  ArrowUp,
  CheckCircle2,
  ChevronDown,
  Loader2,
  Plus,
  Save,
  Trash2,
  Zap,
} from 'lucide-react'
import api from '../api'
import ConfirmDialog from '../components/ConfirmDialog'
import UndoButton from '../components/UndoButton'

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
    title={label}
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

interface ToastProps {
  message: string
  error: string
}

const Toast = ({ message, error }: ToastProps) => {
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

const defaultSettings = {
  heading: 'Get in touch',
  email: 'info@liyanahealthcare.com',
  phone: '+251-11-XXX-XXXX',
  location: 'Addis Ababa, Ethiopia',
  image_url: '',
  image_caption: '',
}

interface InquiryType {
  id: string | number
  value: string
  label: string
}

const defaultInquiryTypes: InquiryType[] = [
  { id: 'default-1', value: 'partnership', label: 'Partnerships' },
  { id: 'default-2', value: 'media', label: 'Media' },
  { id: 'default-3', value: 'speaking', label: 'Speaking' },
  { id: 'default-4', value: 'other', label: 'Policy' },
  { id: 'default-5', value: 'foundation', label: 'Foundation' },
]

export default function ContactEditor() {
  const [settings, setSettings] = useState(defaultSettings)
  const [inquiryTypes, setInquiryTypes] = useState<InquiryType[]>(defaultInquiryTypes)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [deletedTypeIds, setDeletedTypeIds] = useState<(string | number)[]>([])
  const [expandedTypes, setExpandedTypes] = useState<string[]>([])
  const [newItemId, setNewItemId] = useState<string | null>(null)
  const newItemRef = useRef<HTMLDivElement | null>(null)

  const [backupSettings, setBackupSettings] = useState(defaultSettings)
  const [backupInquiryTypes, setBackupInquiryTypes] = useState<InquiryType[]>(defaultInquiryTypes)

  const [deleteTarget, setDeleteTarget] = useState<string | number | null>(null)

  const toggleType = (id: string | number) =>
    setExpandedTypes((prev) =>
      prev.includes(String(id)) ? prev.filter((i) => i !== String(id)) : [...prev, String(id)],
    )

  useEffect(() => {
    ;(async () => {
      try {
        const [settingsRes, typesRes] = await Promise.all([
          api.get('/contact/settings'),
          api.get('/contact/inquiry-types'),
        ])
        const loadedSettings =
          settingsRes.data && Object.keys(settingsRes.data).length
            ? { ...defaultSettings, ...settingsRes.data }
            : defaultSettings
        const loadedTypes = typesRes.data?.length
          ? typesRes.data.map((t: { id: number; value: string; label: string }) => ({
              id: t.id,
              value: t.value,
              label: t.label,
            }))
          : defaultInquiryTypes

        setSettings(loadedSettings)
        setBackupSettings(loadedSettings)
        setInquiryTypes(loadedTypes)
        setBackupInquiryTypes(loadedTypes)
      } catch {
        setError('Failed to load contact data – using defaults.')
        setBackupSettings(defaultSettings)
        setBackupInquiryTypes(defaultInquiryTypes)
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  useEffect(() => {
    if (newItemId && newItemRef.current) {
      newItemRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
      const timer = setTimeout(() => {
        const firstInput = newItemRef.current?.querySelector('input')
        firstInput?.focus()
      }, 350)
      const reset = setTimeout(() => setNewItemId(null), 2500)
      return () => {
        clearTimeout(timer)
        clearTimeout(reset)
      }
    }
  }, [newItemId])

  const updateField = (field: string, value: string) =>
    setSettings((prev) => ({ ...prev, [field]: value }))

  const handleImageUpload = (url: string) => updateField('image_url', url)

  const addInquiryType = () => {
    const tempId = `temp-${Date.now()}`
    setInquiryTypes((prev) => [...prev, { id: tempId, label: 'New Type', value: 'new_type' }])
    setExpandedTypes((prev) => [...prev, tempId])
    setNewItemId(tempId)
  }

  const updateInquiryTypeLocal = (id: string | number, patch: Partial<InquiryType>) =>
    setInquiryTypes((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)))

  const deleteTypeLocal = (id: string | number) => {
    if (typeof id === 'number') setDeletedTypeIds((prev) => [...prev, id])
    setInquiryTypes((prev) => prev.filter((t) => t.id !== id))
  }

  const reorderTypes = (index: number, dir: number) =>
    setInquiryTypes((prev) => {
      const next = [...prev]
      const target = index + dir
      if (target < 0 || target >= next.length) return prev
      ;[next[index], next[target]] = [next[target], next[index]]
      return next
    })

  const saveAll = async () => {
    setSaving(true)
    setMessage('')
    setError('')
    try {
      await api.put('/contact/settings', settings)
      for (const id of deletedTypeIds) await api.delete(`/contact/inquiry-types/${id}`)
      for (const type of inquiryTypes) {
        const payload = { label: type.label, value: type.value }
        if (typeof type.id === 'number') await api.put(`/contact/inquiry-types/${type.id}`, payload)
        else await api.post('/contact/inquiry-types', payload)
      }
      const [settingsRes, typesRes] = await Promise.all([
        api.get('/contact/settings'),
        api.get('/contact/inquiry-types'),
      ])
      const savedSettings = { ...defaultSettings, ...settingsRes.data }
      const savedTypes = (typesRes.data || []).map(
        (t: { id: number; value: string; label: string }) => ({
          id: t.id,
          value: t.value,
          label: t.label,
        }),
      )
      setSettings(savedSettings)
      setInquiryTypes(savedTypes)
      setBackupSettings(savedSettings)
      setBackupInquiryTypes(savedTypes)
      setDeletedTypeIds([])
      setMessage('✨ All contact data saved beautifully!')
      setTimeout(() => setMessage(''), 3000)
    } catch {
      setError('Could not save. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleUndo = () => {
    setSettings(backupSettings)
    setInquiryTypes(backupInquiryTypes)
    setDeletedTypeIds([])
    setMessage('Changes reverted.')
    setTimeout(() => setMessage(''), 2000)
  }

  const confirmDelete = () => {
    if (deleteTarget !== null) {
      deleteTypeLocal(deleteTarget)
      setDeleteTarget(null)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100/60">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full animate-spin opacity-20" />
            <Loader2 size={32} className="animate-spin text-emerald-500 absolute inset-0 m-auto" />
          </div>
          <p className="text-sm text-slate-600 animate-pulse">Loading contact settings...</p>
        </div>
      </div>
    )
  }

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100/60">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-emerald-600 flex items-center gap-2">
              <Zap size={14} /> Contact Editor
            </p>
            <h1 className="mt-3 text-4xl font-bold text-slate-900 sm:text-5xl">
              Contact Page Settings
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <UndoButton onClick={handleUndo} />
            <button
              onClick={saveAll}
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-6 py-3 font-semibold text-white transition-all hover:shadow-xl hover:shadow-emerald-500/30 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 duration-200"
            >
              {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
              <span>{saving ? 'Saving...' : 'Save All Changes'}</span>
            </button>
          </div>
        </div>

        <div className="space-y-8">
          <div className="rounded-2xl border border-slate-200 bg-white/80 backdrop-blur-sm p-6 sm:p-8 shadow-sm transition-all duration-300 hover:shadow-lg hover:border-emerald-300">
            <div className="mb-6 border-b border-slate-200 pb-6">
              <h2 className="text-2xl font-bold text-slate-900">Contact Details</h2>
              <p className="mt-2 text-sm text-slate-600">Update the main contact information.</p>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              <Field label="Heading">
                <input
                  className={formInput}
                  value={settings.heading}
                  onChange={(e) => updateField('heading', e.target.value)}
                  placeholder="Get in Touch"
                />
              </Field>
              <Field label="Email">
                <input
                  className={formInput}
                  value={settings.email}
                  onChange={(e) => updateField('email', e.target.value)}
                  placeholder="hello@example.com"
                />
              </Field>
              <Field label="Phone">
                <input
                  className={formInput}
                  value={settings.phone}
                  onChange={(e) => updateField('phone', e.target.value)}
                  placeholder="+123 456 7890"
                />
              </Field>
              <Field label="Location">
                <input
                  className={formInput}
                  value={settings.location}
                  onChange={(e) => updateField('location', e.target.value)}
                  placeholder="City, Country"
                />
              </Field>
              <div className="md:col-span-2">
                <Field label="Image">
                  <MediaPicker currentUrl={settings.image_url} onUpload={handleImageUpload} />
                </Field>
              </div>
              <div className="md:col-span-2">
                <Field label="Image Caption">
                  <input
                    className={formInput}
                    value={settings.image_caption}
                    onChange={(e) => updateField('image_caption', e.target.value)}
                    placeholder="Our office in Addis Ababa"
                  />
                </Field>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white/80 backdrop-blur-sm p-6 sm:p-8 shadow-sm transition-all duration-300 hover:shadow-lg hover:border-emerald-300">
            <div className="mb-6 flex items-center justify-between border-b border-slate-200 pb-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Inquiry Types</h2>
                <p className="mt-2 text-sm text-slate-600">
                  Manage inquiry options shown on the contact form.
                </p>
              </div>
              <button
                onClick={addInquiryType}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-4 py-2 font-semibold text-white transition-all hover:shadow-xl hover:shadow-emerald-500/30 active:scale-95"
              >
                <Plus size={18} /> Add Type
              </button>
            </div>

            <div className="space-y-3">
              {inquiryTypes.length === 0 ? (
                <div className="rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center hover:border-emerald-300 hover:bg-emerald-50 transition-all">
                  <p className="text-slate-600">No inquiry types yet. Add one to get started.</p>
                </div>
              ) : (
                inquiryTypes.map((type, idx) => {
                  const isOpen = expandedTypes.includes(String(type.id))
                  const isNew = String(type.id) === newItemId
                  return (
                    <div
                      key={String(type.id)}
                      ref={isNew ? newItemRef : null}
                      className={`rounded-2xl border bg-white/80 backdrop-blur-sm shadow-sm transition-all duration-300 hover:shadow-lg hover:border-emerald-300 hover:scale-[1.01] cursor-pointer ${
                        isNew
                          ? 'border-emerald-400 ring-2 ring-emerald-400/30 shadow-xl shadow-emerald-100/50'
                          : 'border-slate-200'
                      }`}
                    >
                      <button
                        onClick={() => toggleType(type.id)}
                        className="flex w-full items-center justify-between p-5 text-left"
                      >
                        <div className="flex items-center gap-4">
                          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 text-sm font-bold text-white shadow-md">
                            {String(idx + 1).padStart(2, '0')}
                          </span>
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600">
                              {type.value}
                            </p>
                            <h3 className="text-base font-semibold text-slate-900 line-clamp-1">
                              {type.label}
                            </h3>
                          </div>
                        </div>
                        <ChevronDown
                          size={18}
                          className={`text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                        />
                      </button>

                      <div
                        className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}
                      >
                        <div className="border-t border-slate-100 bg-slate-50/50 p-5 space-y-4">
                          <Field label="Label">
                            <input
                              className={formInput}
                              value={type.label}
                              placeholder="e.g. General Inquiry"
                              onChange={(e) =>
                                updateInquiryTypeLocal(type.id, {
                                  label: e.target.value,
                                  value: e.target.value.toLowerCase().replace(/\s+/g, '_'),
                                })
                              }
                            />
                          </Field>
                          <div className="flex items-center justify-between gap-2 border-t border-slate-200 pt-4">
                            <div className="flex gap-2">
                              <IconButton
                                label="Move up"
                                disabled={idx === 0}
                                onClick={() => reorderTypes(idx, -1)}
                              >
                                <ArrowUp size={16} />
                              </IconButton>
                              <IconButton
                                label="Move down"
                                disabled={idx === inquiryTypes.length - 1}
                                onClick={() => reorderTypes(idx, 1)}
                              >
                                <ArrowDown size={16} />
                              </IconButton>
                            </div>
                            <IconButton
                              label="Delete"
                              danger
                              onClick={() => setDeleteTarget(type.id)}
                            >
                              <Trash2 size={16} />
                            </IconButton>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={deleteTarget !== null}
        title="Delete Inquiry Type"
        message="Are you sure you want to delete this inquiry type?"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      <Toast message={message} error={error} />
    </section>
  )
}
