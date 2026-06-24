import {
  ArrowDown,
  ArrowUp,
  Loader2,
  Plus,
  Save,
  Trash2,
  AlertCircle,
  CheckCircle2,
  Hospital,
  GraduationCap,
  Syringe,
  Microscope,
  Smartphone,
  Wallet,
  HeartPulse,
  Handshake,
  BriefcaseBusiness,
  Trophy,
  Landmark,
  Sparkles,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import api from '../api'
import {
  education as staticEducation,
  professionalMemberships as staticMemberships,
} from '@/data/education'

const formInput =
  'w-full rounded-xl border border-slate-200 bg-white/70 backdrop-blur px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:border-teal-400 focus:ring-4 focus:ring-teal-500/10 focus:bg-white shadow-sm hover:border-teal-300 hover:shadow-md'
const labelClass = 'mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-600'

const ICON_OPTIONS = [
  { value: 'hospital', label: 'Hospital', Icon: Hospital },
  { value: 'graduation-cap', label: 'Education', Icon: GraduationCap },
  { value: 'flask', label: 'Manufacturing', Icon: Syringe },
  { value: 'microscope', label: 'Research', Icon: Microscope },
  { value: 'mobile', label: 'Digital Health', Icon: Smartphone },
  { value: 'wallet', label: 'Financing', Icon: Wallet },
  { value: 'heart-pulse', label: 'Community Health', Icon: HeartPulse },
  { value: 'handshake', label: 'Mentorship', Icon: Handshake },
  { value: 'briefcase', label: 'Career', Icon: BriefcaseBusiness },
  { value: 'trophy', label: 'Award', Icon: Trophy },
  { value: 'landmark', label: 'Policy', Icon: Landmark },
  { value: 'sparkles', label: 'Milestone', Icon: Sparkles },
]

function IconPicker({ value, onChange, allowedValues }) {
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
            className={`flex flex-col items-center justify-center gap-2 rounded-lg border-2 px-3 py-4 text-center transition-all duration-200 transform hover:scale-105 ${
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

function Field({ label, children, hint }) {
  return (
    <label className="block">
      <span className={labelClass}>{label}</span>
      {children}
      {hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
    </label>
  )
}

function IconButton({ label, onClick, children, disabled, danger = false }) {
  return (
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
}

function Toast({ message, error }) {
  if (!message && !error) return null
  return (
    <div
      className={`fixed bottom-6 right-6 flex items-center gap-3 rounded-lg px-5 py-3.5 text-sm font-medium shadow-lg transition-all duration-300 animate-in slide-in-from-right ${
        error ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-700'
      }`}
    >
      {error ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
      <span>{message || error}</span>
    </div>
  )
}

function buildEducationDraft(section = {}) {
  return {
    eyebrow: section.eyebrow || 'Credentials',
    title: section.title || 'Academic foundations',
    description: section.description || '',
    blocks: (section.blocks || []).map((block) => ({
      id: block.id || `new-${Date.now()}`,
      block_type: block.block_type || 'education_item',
      institution: block.institution || block.title || '',
      degree: block.degree || block.subtitle || '',
      icon: block.icon || block.metadata?.icon || 'graduation-cap',
      field: block.field || block.metadata?.field || '',
      year: block.year || block.metadata?.year || '',
      description: block.description || block.body || '',
      
      highlights: Array.isArray(block.highlights)
        ? block.highlights
        : typeof block.metadata?.highlights === 'string'
          ? String(block.metadata.highlights)
              .split('\n')
              .map((line) => line.trim())
              .filter(Boolean)
          : block.metadata?.highlights || [],
      sort_order: block.sort_order || 0,
    })),
  }
}

export default function EducationEditor() {
  const [content, setContent] = useState(null)
  const [draft, setDraft] = useState(null)
  const [membershipsDraft, setMembershipsDraft] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    const loadEducation = async () => {
      setIsLoading(true)
      setError('')
      try {
        const response = await api.get('/cms/site-content')
        if (!active) return
        setContent(response.data)
        const section = response.data.sections?.education
        if (section && Array.isArray(section.blocks) && section.blocks.length > 0) {
          setDraft(buildEducationDraft(section))
        } else {
          // No CMS blocks yet: fall back to static data so admin can edit the same items shown on the public page
          const fallback = {
            eyebrow: (section && section.eyebrow) || 'Credentials',
            title: (section && section.title) || 'Academic foundations',
            description: (section && section.description) || '',
            blocks: (staticEducation || []).map((item, i) => ({
              id: item.id || `static-${i}`,
              block_type: 'education_item',
              title: item.institution || '',
              subtitle: item.degree || '',
              body: item.description || '',
              metadata: {
                field: item.field || '',
                year: item.year ? String(item.year) : '',
                highlights: item.highlights || [],
              },
              sort_order: i + 1,
            })),
          }
          setDraft(buildEducationDraft(fallback))
        }
        // Load memberships section (separate slug: education_memberships)
        const membershipsSection = response.data.sections?.education_memberships
        if (
          membershipsSection &&
          Array.isArray(membershipsSection.blocks) &&
          membershipsSection.blocks.length > 0
        ) {
          setMembershipsDraft({
            eyebrow: membershipsSection.eyebrow || 'Affiliations',
            title: membershipsSection.title || 'Professional memberships',
            description: membershipsSection.description || '',
            items: membershipsSection.blocks.map((b) => b.title || b.body || ''),
          })
        } else {
          setMembershipsDraft({
            eyebrow: (membershipsSection && membershipsSection.eyebrow) || 'Affiliations',
            title: (membershipsSection && membershipsSection.title) || 'Professional memberships',
            description:
              (membershipsSection && membershipsSection.description) ||
              'Active roles across national and international professional bodies in healthcare leadership and community service.',
            items: staticMemberships || [],
          })
        }
      } catch (e) {
        if (!active) return
        setError('Unable to load Education content.')
      } finally {
        if (!active) return
        setIsLoading(false)
      }
    }

    loadEducation()
    return () => {
      active = false
    }
  }, [])

  const addItem = () => {
    setDraft((current) => ({
      ...current,
      blocks: [
        ...(current.blocks || []),
        {
          id: `new-${Date.now()}`,
          block_type: 'education_item',
          institution: '',
          degree: '',
          field: '',
          icon: 'graduation-cap',
          year: '',
          description: '',
          highlights: [],
          sort_order: (current.blocks || []).length + 1,
        },
      ],
    }))
  }

  const updateItem = (index, patch) => {
    setDraft((current) => ({
      ...current,
      blocks: current.blocks.map((item, i) => (i === index ? { ...item, ...patch } : item)),
    }))
  }

  const removeItem = (index) => {
    setDraft((current) => ({
      ...current,
      blocks: current.blocks.filter((_, i) => i !== index),
    }))
  }

  const reorderItem = (index, direction) => {
    setDraft((current) => {
      const next = [...current.blocks]
      const target = index + direction
      if (target < 0 || target >= next.length) return current
      const item = next[index]
      next[index] = next[target]
      next[target] = item
      return { ...current, blocks: next }
    })
  }

  const saveSection = async () => {
    if (!draft) return
    setIsSaving(true)
    setMessage('')
    setError('')

    try {
      await api.put('/cms/sections/education', {
        section: {
          eyebrow: draft.eyebrow,
          title: draft.title,
          description: draft.description,
          metadata: {},
        },
        blocks: draft.blocks.map((block, index) => ({
          ...block,
          sort_order: index + 1,
          metadata: {
            field: block.field || null,
            year: block.year || null,
            highlights: block.highlights || [],
            icon: block.icon || block.metadata?.icon || null,
          },
          title: block.institution || null,
          subtitle: block.degree || null,
          body: block.description || null,
        })),
      })
      setMessage('Education section saved successfully.')
      await refreshContent()
    } catch (e) {
      const serverMessage = e?.response?.data?.error || e?.response?.data?.message
      console.error('Save Education error:', e)
      setError(serverMessage || 'Could not save Education section.')
    } finally {
      setIsSaving(false)
    }
  }

  const refreshContent = async () => {
    try {
      const response = await api.get('/cms/site-content')
      setContent(response.data)
      const section = response.data.sections?.education
      if (section && Array.isArray(section.blocks) && section.blocks.length > 0) {
        setDraft(buildEducationDraft(section))
      } else {
        const fallback = {
          eyebrow: (section && section.eyebrow) || 'Credentials',
          title: (section && section.title) || 'Academic foundations',
          description: (section && section.description) || '',
          blocks: (staticEducation || []).map((item, i) => ({
            id: item.id || `static-${i}`,
            block_type: 'education_item',
            title: item.institution || '',
            subtitle: item.degree || '',
            body: item.description || '',
            metadata: {
              field: item.field || '',
              year: item.year ? String(item.year) : '',
              highlights: item.highlights || [],
            },
            sort_order: i + 1,
          })),
        }
        setDraft(buildEducationDraft(fallback))
      }

      // refresh memberships draft
      const membershipsSection = response.data.sections?.education_memberships
      if (
        membershipsSection &&
        Array.isArray(membershipsSection.blocks) &&
        membershipsSection.blocks.length > 0
      ) {
        setMembershipsDraft({
          eyebrow: membershipsSection.eyebrow || 'Affiliations',
          title: membershipsSection.title || 'Professional memberships',
          description: membershipsSection.description || '',
          items: membershipsSection.blocks.map((b) => b.title || b.body || ''),
        })
      } else {
        setMembershipsDraft({
          eyebrow: (membershipsSection && membershipsSection.eyebrow) || 'Affiliations',
          title: (membershipsSection && membershipsSection.title) || 'Professional memberships',
          description:
            (membershipsSection && membershipsSection.description) ||
            'Active roles across national and international professional bodies in healthcare leadership and community service.',
          items: staticMemberships || [],
        })
      }
    } catch {
      setError('Unable to refresh content after save.')
    }
  }

  // ---------------------- Memberships handlers ----------------------
  const addMembership = () => {
    setMembershipsDraft((c) => ({ ...c, items: [...(c.items || []), 'New membership'] }))
  }

  const updateMembership = (index, value) => {
    setMembershipsDraft((c) => ({
      ...c,
      items: c.items.map((it, i) => (i === index ? value : it)),
    }))
  }

  const removeMembership = (index) => {
    setMembershipsDraft((c) => ({ ...c, items: c.items.filter((_, i) => i !== index) }))
  }

  const reorderMembership = (index, direction) => {
    setMembershipsDraft((c) => {
      const next = [...(c.items || [])]
      const target = index + direction
      if (target < 0 || target >= next.length) return c
      ;[next[index], next[target]] = [next[target], next[index]]
      return { ...c, items: next }
    })
  }

  const saveMemberships = async () => {
    if (!membershipsDraft) return
    setIsSaving(true)
    setMessage('')
    setError('')
    try {
      await api.put('/cms/sections/education_memberships', {
        section: {
          eyebrow: membershipsDraft.eyebrow,
          title: membershipsDraft.title,
          description: membershipsDraft.description,
          metadata: {},
        },
        blocks: (membershipsDraft.items || []).map((it, i) => ({
          block_type: 'membership',
          title: it,
          body: null,
          metadata: {},
          sort_order: i + 1,
        })),
      })
      setMessage('Memberships saved successfully.')
      await refreshContent()
    } catch (e) {
      const serverMessage = e?.response?.data?.error || e?.response?.data?.message
      console.error('Save Memberships error:', e)
      setError(serverMessage || 'Could not save Memberships.')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading || !draft) {
    return (
      <div className="flex min-h-80 items-center justify-center border border-rule bg-paper-card">
        <Loader2 size={26} className="animate-spin text-teal" />
      </div>
    )
  }

  return (
    <section className="mx-auto max-w-7xl space-y-8">
      <Toast message={message} error={error} />

      <div className="flex flex-col justify-between gap-4 border-b border-rule pb-7 lg:flex-row lg:items-end">
        <div>
          <p className="section-tag">Education Editor</p>
          <h1 className="mt-3 font-serif text-4xl font-light text-ink sm:text-5xl">
            Academic foundations
          </h1>
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-teal-500 to-teal-600 px-5 py-2.5 font-semibold text-white transition-all hover:shadow-xl hover:shadow-teal-500/30 hover:scale-105 active:scale-95"
          onClick={saveSection}
          disabled={isSaving}
        >
          <Save size={18} /> Save Foundations
        </button>
      </div>

      <div className="grid gap-6 ">
        <div className="space-y-4 rounded-3xl border border-rule bg-paper-card p-6 shadow-sm">
          <h2 className="text-2xl font-semibold text-slate-900">Section settings</h2>
          <Field label="Eyebrow / Tag" hint="Small label above the headline">
            <input
              className={formInput}
              value={draft.eyebrow}
              onChange={(e) => setDraft((current) => ({ ...current, eyebrow: e.target.value }))}
            />
          </Field>
          <Field label="Title" hint="The page headline for the education section">
            <textarea
              className={formInput}
              value={draft.title}
              onChange={(e) => setDraft((current) => ({ ...current, title: e.target.value }))}
            />
          </Field>
        </div>

        <div className="space-y-4 rounded-3xl border border-rule bg-paper-card p-6 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900">Credential items</h2>
              <p className="mt-1 text-sm text-slate-600">
                Edit each academic item, then save to update the Education page list.
              </p>
            </div>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-xl bg-teal px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-teal-600"
              onClick={addItem}
            >
              <Plus size={16} /> Add Item
            </button>
          </div>
          {/* //TODO: add icon picker for each item */}
          <div className="space-y-4">
            {draft.blocks.length === 0 && (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-600">
                No credential items yet. Use Add Item to create the first academic foundation entry.
              </div>
            )}

            {draft.blocks.map((item, index) => (
              <div
                key={item.id || index}
                className="rounded-3xl border border-rule bg-white p-5 shadow-sm"
              >
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-teal-600">
                      Item {index + 1}
                    </p>
                    <h3 className="text-lg font-semibold text-slate-900">
                      {item.institution || 'Untitled credential'}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <IconButton
                      label="Move up"
                      onClick={() => reorderItem(index, -1)}
                      disabled={index === 0}
                    >
                      <ArrowUp size={16} />
                    </IconButton>
                    <IconButton
                      label="Move down"
                      onClick={() => reorderItem(index, 1)}
                      disabled={index === draft.blocks.length - 1}
                    >
                      <ArrowDown size={16} />
                    </IconButton>
                    <IconButton label="Delete item" danger onClick={() => removeItem(index)}>
                      <Trash2 size={16} />
                    </IconButton>
                  </div>
                </div>

                <div className="grid gap-4 lg:grid-cols-2">
                  <Field label="Institution / Program">
                    <input
                      className={formInput}
                      value={item.institution}
                      onChange={(e) => updateItem(index, { institution: e.target.value })}
                    />
                  </Field>
                  <Field label="Degree / Credential">
                    <input
                      className={formInput}
                      value={item.degree}
                      onChange={(e) => updateItem(index, { degree: e.target.value })}
                    />
                  </Field>
                  <Field label="Field / Department">
                    <input
                      className={formInput}
                      value={item.field}
                      onChange={(e) => updateItem(index, { field: e.target.value })}
                    />
                  </Field>
                  <Field label="Year">
                    <input
                      className={formInput}
                      value={item.year}
                      onChange={(e) => updateItem(index, { year: e.target.value })}
                    />
                  </Field>
                </div>

                <Field label="Description">
                  <textarea
                    className={`${formInput} min-h-[120px]`}
                    rows={4}
                    value={item.description}
                    onChange={(e) => updateItem(index, { description: e.target.value })}
                  />
                </Field>

                <Field label="Highlights" hint="One highlight per line">
                  <textarea
                    className={`${formInput} min-h-[100px]`}
                    rows={4}
                    value={(item.highlights || []).join('\n')}
                    onChange={(e) =>
                      updateItem(index, {
                        highlights: e.target.value
                          .split('\n')
                          .map((line) => line.trim())
                          .filter(Boolean),
                      })
                    }
                  />
                </Field>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Memberships Editor */}
      <div className="grid gap-6 ">
        <div className="space-y-4 rounded-3xl border border-rule bg-paper-card p-6 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900">Affiliations / Memberships</h2>
            </div>
            <div className="flex items-center gap-2">
              {/* <button
                type="button"
                className="inline-flex items-center gap-2 rounded-xl bg-teal px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-teal-600"
                onClick={addMembership}
              >
                <Plus size={16} /> Add Item
              </button> */}
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-teal-500 to-teal-600 px-5 py-2.5 font-semibold text-white transition-all hover:shadow-xl"
                onClick={saveMemberships}
                disabled={isSaving}
              >
                <Save size={16} /> Save Memberships
              </button>
            </div>
          </div>
          {/* <h2 className="text-2xl font-semibold text-slate-900">Affiliations / Memberships</h2> */}
          {membershipsDraft && (
            <>
              <Field label="Eyebrow / Tag" hint="Small label above the headline">
                <input
                  className={formInput}
                  value={membershipsDraft.eyebrow}
                  onChange={(e) => setMembershipsDraft((c) => ({ ...c, eyebrow: e.target.value }))}
                />
              </Field>
              <Field label="Title" hint="The page headline for the memberships section">
                <input
                  className={formInput}
                  value={membershipsDraft.title}
                  onChange={(e) => setMembershipsDraft((c) => ({ ...c, title: e.target.value }))}
                />
              </Field>
              <Field label="Description" hint="Intro text shown below the title">
                <textarea
                  className={`${formInput} min-h-[80px]`}
                  rows={3}
                  value={membershipsDraft.description}
                  onChange={(e) =>
                    setMembershipsDraft((c) => ({ ...c, description: e.target.value }))
                  }
                />
              </Field>
            </>
          )}
        </div>

        <div className="space-y-4 rounded-3xl border border-rule bg-paper-card p-6 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900">Membership items</h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-xl bg-teal px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-teal-600"
                onClick={addMembership}
              >
                <Plus size={16} /> Add Item
              </button>
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-teal-500 to-teal-600 px-5 py-2.5 font-semibold text-white transition-all hover:shadow-xl"
                onClick={saveMemberships}
                disabled={isSaving}
              >
                <Save size={16} /> Save Memberships
              </button>
            </div>
          </div>
          <div className="space-y-4">
            {(!membershipsDraft || (membershipsDraft.items || []).length === 0) && (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-600">
                No membership items yet. Use Add Item to create one.
              </div>
            )}

            {((membershipsDraft && membershipsDraft.items) || []).map((m, i) => (
              <div key={i} className="rounded-3xl border border-rule bg-white p-4">
                <div className="mb-3 grid gap-3 md:grid-cols-2">
                  <Field label={`Membership ${i + 1}`}>
                    <input
                      className={formInput}
                      value={m}
                      onChange={(e) => updateMembership(i, e.target.value)}
                    />
                  </Field>
                </div>
                <div className="flex gap-2 justify-end">
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 border border-slate-200 px-3 py-1 text-xs"
                    disabled={i === 0}
                    onClick={() => reorderMembership(i, -1)}
                  >
                    <ArrowUp size={14} />
                  </button>
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 border border-slate-200 px-3 py-1 text-xs"
                    disabled={i === (membershipsDraft.items || []).length - 1}
                    onClick={() => reorderMembership(i, 1)}
                  >
                    <ArrowDown size={14} />
                  </button>
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 border border-slate-200 px-3 py-1 text-xs text-red-700"
                    onClick={() => removeMembership(i)}
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
