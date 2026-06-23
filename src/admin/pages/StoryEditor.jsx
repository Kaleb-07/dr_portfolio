import {
  ArrowDown,
  ArrowUp,
  BriefcaseBusiness,
  GraduationCap,
  Handshake,
  HeartPulse,
  Hospital,
  Image,
  Landmark,
  Loader2,
  Microscope,
  Plus,
  Save,
  Smartphone,
  Sparkles,
  Syringe,
  Trash2,
  Trophy,
  Upload,
  Wallet,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../api'
import { mapCmsHtml } from '@/lib/html'

const STORY_SECTIONS = [
  {
    slug: 'vision-agenda',
    title: 'The Visionary Agenda',
    description: 'Hero story opener with identity cards and bold positioning.',
    backendSlug: 'vision_agenda',
    hint: 'Edit the hero headline, supporting image, and identity blocks.',
  },
  {
    slug: 'career-timeline',
    title: 'Career Timeline',
    description: 'Chronologically manage story beats and milestone events.',
    type: 'timeline',
    hint: 'Add, reorder, and update career timeline events.',
  },
  {
    slug: 'liyana-framework',
    title: 'The Liyana Healthcare Framework',
    description: 'Manage the framework grid, ordering, descriptions, and selected icons.',
    backendSlug: 'liyana_framework',
    blockLabel: 'Framework Item',
    hint: 'Edit the section heading and every framework card visible in the grid.',
  },
  {
    slug: 'foundation',
    title: 'Foundation',
    description: 'Manage the LUCS Foundation preview section, pillars, and statistics.',
    backendSlug: 'foundation_story',
    blockLabel: 'Foundation Pillar',
    hint: 'Edit the heading, paragraph, CTA, pillars, icons, and stat cards.',
  },
  {
    slug: 'recognition-awards',
    title: 'Recognition & Awards',
    description: 'Manage the awards carousel content and section heading.',
    backendSlug: 'recognition_awards',
    blockLabel: 'Award Card',
    hint: 'Edit award title, organization, year, category, description, image, and order.',
  },
]
 

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

const formInput =
  'w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/10'
const labelClass = 'mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-600'

function Field({ label, children }) {
  return (
    <label className="block">
      <span className={labelClass}>{label}</span>
      {children}
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
          ? 'bg-red-50 text-red-600 hover:bg-red-100'
          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
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
      className={`fixed bottom-6 right-6 flex items-center gap-3 rounded-lg px-5 py-3.5 text-sm font-medium shadow-lg transition-all duration-300 ${
        error ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-700'
      }`}
    >
      {error ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
      <span>{message || error}</span>
    </div>
  )
}

function IconPicker({ value, onChange }) {
  return (
    <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
      {ICON_OPTIONS.map(({ value: optionValue, label, Icon }) => {
        const isSelected = value === optionValue
        return (
          <button
            key={optionValue}
            type="button"
            onClick={() => onChange(optionValue)}
            className={`group relative flex flex-col items-center justify-center gap-2 rounded-lg border-2 px-3 py-4 text-center transition-all duration-200 ${
              isSelected
                ? 'border-teal-500 bg-gradient-to-br from-teal-50 to-teal-100 text-teal-700 shadow-lg'
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

function buildSectionDraft(section = {}) {
  return {
    eyebrow: section.eyebrow || '',
    title: section.title || '',
    subtitle: section.subtitle || '',
    description: section.description || '',
    image_url: section.image_url || '',
    image_alt: section.image_alt || '',
    buttons: section.metadata?.cta || [],
    metrics: section.metadata?.metrics || [],
    stats: section.metadata?.stats || [],
    blocks: section.blocks || [],
    icon: section.metadata?.icon || '',
  }
}

function buildTimelineEvents(events = []) {
  return events.map((event) => ({
    ...event,
    year: event.year || '',
    title: event.title || '',
    subtitle: event.subtitle || '',
    description: event.description || '',
    category: event.category || 'milestone',
    icon: event.icon || '',
  }))
}

function buildIdentityItems(items = []) {
  return items.map((item) => ({
    ...item,
    label: item.label || '',
    title: item.title || '',
    description: item.description || '',
    icon: item.icon || '',
    image_url: item.image_url || '',
    sort_order: item.sort_order || 0,
    is_active: item.is_active === 0 ? 0 : 1,
  }))
}

function readLocalImage(file, onLoad, onError) {
  if (!file) return
  const reader = new FileReader()
  reader.onload = () => onLoad(String(reader.result || ''))
  reader.onerror = onError
  reader.readAsDataURL(file)
}

export default function StoryEditor() {
  const { sectionSlug } = useParams()
  const navigate = useNavigate()
  const [content, setContent] = useState(null)
  const [draft, setDraft] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [deletedIdentityIds, setDeletedIdentityIds] = useState([])
  const [deletedTimelineIds, setDeletedTimelineIds] = useState([])

  const selectedSection = useMemo(
    () => STORY_SECTIONS.find((section) => section.slug === sectionSlug) ?? STORY_SECTIONS[0],
    [sectionSlug],
  )

  useEffect(() => {
    if (!sectionSlug) {
      navigate(`/admin/story/${STORY_SECTIONS[0].slug}`, { replace: true })
    }
  }, [navigate, sectionSlug])

  useEffect(() => {
    setMessage('')
    setError('')
    setDeletedIdentityIds([])
    setDeletedTimelineIds([])

    if (selectedSection.type === 'timeline') {
      setDraft({ events: buildTimelineEvents([]) })
      return
    }

    if (selectedSection.type === 'identities') {
      setDraft({ identities: buildIdentityItems([]) })
      return
    }

    if (selectedSection.backendSlug) {
      setDraft(buildSectionDraft({}))
      return
    }

    setDraft(buildSectionDraft({}))
  }, [sectionSlug, selectedSection])

  useEffect(() => {
    let active = true

    const load = async () => {
      setIsLoading(true)
      setError('')
      try {
        const response = await api.get('/cms/site-content')
        if (!active) return
        setContent(response.data)
      } catch {
        if (!active) return
        setError('Unable to load Story content.')
      } finally {
        if (!active) return
        setIsLoading(false)
      }
    }

    load()

    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    if (!content) return

    if (selectedSection.type === 'timeline') {
      setDraft({ events: buildTimelineEvents(content.timelineEvents || []) })
      return
    }

    if (selectedSection.type === 'identities') {
      setDraft({ identities: buildIdentityItems(content.identityItems || []) })
      return
    }

    if (selectedSection.backendSlug) {
      setDraft(buildSectionDraft(content.sections[selectedSection.backendSlug] || {}))
      return
    }

    setDraft(buildSectionDraft({}))
  }, [content, selectedSection])

  const updateDraft = (patch) => {
    setDraft((current) => ({ ...current, ...patch }))
  }

  const updateBlock = (index, patch) => {
    if (!draft) return
    setDraft((current) => {
      const blocks = current.blocks.map((block, blockIndex) =>
        blockIndex === index ? { ...block, ...patch } : block,
      )
      return { ...current, blocks }
    })
  }

  const updateBlockMetadata = (index, patch) => {
    if (!draft) return
    setDraft((current) => {
      const blocks = current.blocks.map((block, blockIndex) =>
        blockIndex === index
          ? { ...block, metadata: { ...(block.metadata || {}), ...patch } }
          : block,
      )
      return { ...current, blocks }
    })
  }

  const addBlock = () => {
    setDraft((current) => ({
      ...current,
      blocks: [
        ...(current.blocks || []),
        {
          id: `new-${Date.now()}`,
          block_type: current.blocks?.[0]?.block_type || 'content',
          eyebrow: '',
          title: '',
          body: '',
          image_url: '',
          image_alt: '',
          metadata: { icon: 'sparkles' },
          sort_order: (current.blocks || []).length + 1,
        },
      ],
    }))
  }

  const removeBlock = (index) => {
    setDraft((current) => ({
      ...current,
      blocks: current.blocks.filter((_, itemIndex) => itemIndex !== index),
    }))
  }

  const reorderBlocks = (index, direction) => {
    if (!draft) return
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

  const updateListItem = (key, index, patch) => {
    setDraft((current) => ({
      ...current,
      [key]: current[key].map((item, itemIndex) =>
        itemIndex === index ? { ...item, ...patch } : item,
      ),
    }))
  }

  const addListItem = (key, emptyItem) => {
    setDraft((current) => ({ ...current, [key]: [...(current[key] || []), emptyItem] }))
  }

  const removeListItem = (key, index) => {
    setDraft((current) => ({
      ...current,
      [key]: current[key].filter((_, itemIndex) => itemIndex !== index),
    }))
  }

  const updateDraftImage = (file) => {
    readLocalImage(
      file,
      (imageUrl) => updateDraft({ image_url: imageUrl }),
      () => setError('Could not read the selected image.'),
    )
  }

  const updateBlockImage = (index, file) => {
    readLocalImage(
      file,
      (imageUrl) => updateBlock(index, { image_url: imageUrl }),
      () => setError('Could not read the selected image.'),
    )
  }

  const addTimelineEvent = () => {
    setDraft((current) => {
      const events = Array.isArray(current?.events) ? current.events : []
      return {
        ...current,
        events: [
          ...events,
          {
            id: `new-${Date.now()}`,
            year: '',
            title: '',
            subtitle: '',
            description: '',
            category: 'milestone',
            icon: '',
            sort_order: events.length + 1,
          },
        ],
      }
    })
  }

  const updateTimelineEvent = (index, patch) => {
    setDraft((current) => {
      if (!Array.isArray(current?.events)) return current
      return {
        ...current,
        events: current.events.map((item, itemIndex) =>
          itemIndex === index ? { ...item, ...patch } : item,
        ),
      }
    })
  }

  const addIdentity = () => {
    setDraft((current) => {
      const identities = Array.isArray(current?.identities) ? current.identities : []
      return {
        ...current,
        identities: [
          ...identities,
          {
            id: `new-${Date.now()}`,
            label: String(identities.length + 1).padStart(2, '0'),
            title: '',
            description: '',
            icon: '',
            image_url: '',
            sort_order: identities.length + 1,
            is_active: 1,
          },
        ],
      }
    })
  }

  const updateIdentity = (index, patch) => {
    setDraft((current) => {
      if (!Array.isArray(current?.identities)) return current
      return {
        ...current,
        identities: current.identities.map((item, itemIndex) =>
          itemIndex === index ? { ...item, ...patch } : item,
        ),
      }
    })
  }

  const updateIdentityImage = (index, file) => {
    readLocalImage(
      file,
      (imageUrl) => updateIdentity(index, { image_url: imageUrl }),
      () => setError('Could not read the selected image.'),
    )
  }

  const reorderIdentities = (index, direction) => {
    setDraft((current) => {
      if (!Array.isArray(current?.identities)) return current
      const next = [...current.identities]
      const target = index + direction
      if (target < 0 || target >= next.length) return current
      const item = next[index]
      next[index] = next[target]
      next[target] = item
      return {
        ...current,
        identities: next.map((identity, sortIndex) => ({ ...identity, sort_order: sortIndex + 1 })),
      }
    })
  }

  const removeIdentity = (index) => {
    setDraft((current) => {
      if (!Array.isArray(current?.identities)) return current
      const removed = current.identities[index]
      if (typeof removed?.id === 'number') {
        setDeletedIdentityIds((ids) => [...ids, removed.id])
      }
      return {
        ...current,
        identities: current.identities.filter((_, itemIndex) => itemIndex !== index),
      }
    })
  }

  const reorderTimeline = (index, direction) => {
    setDraft((current) => {
      if (!Array.isArray(current?.events)) return current
      const next = [...current.events]
      const target = index + direction
      if (target < 0 || target >= next.length) return current
      const item = next[index]
      next[index] = next[target]
      next[target] = item
      return { ...current, events: next }
    })
  }

  const removeTimelineEvent = (index) => {
    setDraft((current) => {
      if (!Array.isArray(current?.events)) return current
      const removed = current.events[index]
      if (typeof removed?.id === 'number') {
        setDeletedTimelineIds((ids) => [...ids, removed.id])
      }
      return { ...current, events: current.events.filter((_, itemIndex) => itemIndex !== index) }
    })
  }

  const saveSection = async () => {
    if (!draft || !selectedSection) return

    setMessage('')
    setError('')
    setIsSaving(true)

    try {
      if (selectedSection.type === 'timeline') {
        if (!Array.isArray(draft.events)) throw new Error('No timeline events to save')
        for (const id of deletedTimelineIds) {
          await api.delete(`/cms/timeline-events/${id}`)
        }
        for (const [index, event] of draft.events.entries()) {
          const payloadWithOrder = { ...event, sort_order: index + 1 }
          if (typeof event.id === 'number') {
            await api.put(`/cms/timeline-events/${event.id}`, payloadWithOrder)
          } else {
            const { id, ...payload } = payloadWithOrder
            await api.post('/cms/timeline-events', payload)
          }
        }
        setMessage('Timeline saved successfully!')
        setDeletedTimelineIds([])
        setTimeout(() => setMessage(''), 3000)
        await refreshContent()
      } else if (selectedSection.type === 'identities') {
        if (!Array.isArray(draft.identities)) throw new Error('No identity items to save')
        for (const id of deletedIdentityIds) {
          await api.delete(`/cms/identity-items/${id}`)
        }
        for (const [index, identity] of draft.identities.entries()) {
          const payloadWithOrder = { ...identity, sort_order: index + 1 }
          if (typeof identity.id === 'number') {
            await api.put(`/cms/identity-items/${identity.id}`, payloadWithOrder)
          } else {
            const { id, ...payload } = payloadWithOrder
            await api.post('/cms/identity-items', payload)
          }
        }
        setMessage('Identity items saved successfully!')
        setDeletedIdentityIds([])
        setTimeout(() => setMessage(''), 3000)
        await refreshContent()
      } else if (selectedSection.backendSlug) {
        const sectionPatch = {
          eyebrow: draft.eyebrow,
          title: draft.title,
          subtitle: draft.subtitle,
          description: draft.description,
          image_url: draft.image_url,
          image_alt: draft.image_alt,
          metadata: {
            cta: draft.buttons,
            icon: draft.icon,
            metrics: draft.metrics,
            stats: draft.stats,
          },
        }
        await api.put(`/cms/sections/${selectedSection.backendSlug}`, {
          section: sectionPatch,
          blocks: draft.blocks,
        })
        setMessage('Section saved successfully!')
        setTimeout(() => setMessage(''), 3000)
        await refreshContent()
      }
    } catch {
      setError('Could not save this section. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const refreshContent = async () => {
    try {
      const response = await api.get('/cms/site-content')
      setContent(response.data)
    } catch {
      setError('Could not refresh content after save.')
    }
  }

  const renderTimelineEditor = () => {
    if (!draft || !Array.isArray(draft.events)) return null

    return (
      <div className="space-y-6">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Career Timeline</h2>
            <p className="mt-2 text-sm text-slate-600">{selectedSection.description}</p>
          </div>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg bg-teal-500 px-5 py-2.5 font-semibold text-white transition-all hover:bg-teal-600"
            onClick={addTimelineEvent}
          >
            <Plus size={18} /> Add Event
          </button>
        </div>

        <div className="space-y-4">
          {draft.events.map((event, index) => (
            <div
              key={event.id || index}
              className="rounded-xl border border-slate-200 bg-white p-6 transition-all duration-200 hover:shadow-lg"
              style={{
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05), 0 2px 8px rgba(0, 0, 0, 0.04)',
              }}
            >
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-100 text-teal-600 font-bold">
                  {index + 1}
                </div>
                <h3 className="font-semibold text-slate-900">{event.title || 'Untitled Event'}</h3>
              </div>

              <div className="grid gap-4 md:grid-cols-[120px_minmax(0,1fr)]">
                <Field label="Year">
                  <input
                    className={formInput}
                    value={event.year}
                    onChange={(e) => updateTimelineEvent(index, { year: e.target.value })}
                    placeholder="2024"
                  />
                </Field>
                <Field label="Title">
                  <input
                    className={formInput}
                    value={event.title}
                    onChange={(e) => updateTimelineEvent(index, { title: e.target.value })}
                    placeholder="Event title"
                  />
                </Field>
                <Field label="Subtitle">
                  <input
                    className={formInput}
                    value={event.subtitle}
                    onChange={(e) => updateTimelineEvent(index, { subtitle: e.target.value })}
                    placeholder="Subtitle"
                  />
                </Field>
                <Field label="Category">
                  <select
                    className={formInput}
                    value={event.category}
                    onChange={(e) => updateTimelineEvent(index, { category: e.target.value })}
                  >
                    <option value="education">Education</option>
                    <option value="career">Career</option>
                    <option value="milestone">Milestone</option>
                    <option value="award">Award</option>
                  </select>
                </Field>
                <div className="md:col-span-2">
                  <Field label="Icon">
                    <IconPicker
                      value={
                        event.icon ||
                        (event.category === 'education' ? 'graduation-cap' : 'sparkles')
                      }
                      onChange={(value) => updateTimelineEvent(index, { icon: value })}
                    />
                  </Field>
                </div>
                <div className="md:col-span-2">
                  <Field label="Description">
                    <textarea
                      className={formInput}
                      rows={3}
                      value={event.description}
                      onChange={(e) => updateTimelineEvent(index, { description: e.target.value })}
                      placeholder="Event description"
                    />
                  </Field>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between gap-2">
                <div className="flex gap-2">
                  <IconButton
                    label="Move up"
                    disabled={index === 0}
                    onClick={() => reorderTimeline(index, -1)}
                  >
                    <ArrowUp size={16} />
                  </IconButton>
                  <IconButton
                    label="Move down"
                    disabled={index === draft.events.length - 1}
                    onClick={() => reorderTimeline(index, 1)}
                  >
                    <ArrowDown size={16} />
                  </IconButton>
                </div>
                <IconButton label="Delete" danger onClick={() => removeTimelineEvent(index)}>
                  <Trash2 size={16} />
                </IconButton>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const renderIdentityEditor = () => {
    if (!draft || !Array.isArray(draft.identities)) return null

    return (
      <div className="space-y-6">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Identity Items</h2>
            <p className="mt-2 text-sm text-slate-600">{selectedSection.description}</p>
          </div>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg bg-teal-500 px-5 py-2.5 font-semibold text-white transition-all hover:bg-teal-600"
            onClick={addIdentity}
          >
            <Plus size={18} /> Add Identity
          </button>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {draft.identities.map((identity, index) => (
            <div
              key={identity.id || index}
              className="group rounded-xl border border-slate-200 bg-white p-6 transition-all duration-200 hover:shadow-lg"
              style={{
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05), 0 2px 8px rgba(0, 0, 0, 0.04)',
              }}
            >
              <div className="mb-4 flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-teal-500 to-teal-600 font-bold text-white">
                  {identity.label.padStart(2, '0')}
                </div>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Item {index + 1}
                </span>
              </div>

              <div className="space-y-4">
                <Field label="Label">
                  <input
                    className={formInput}
                    value={identity.label}
                    onChange={(e) => updateIdentity(index, { label: e.target.value })}
                    placeholder="01"
                  />
                </Field>
                <Field label="Title">
                  <input
                    className={formInput}
                    value={identity.title}
                    onChange={(e) => updateIdentity(index, { title: e.target.value })}
                    placeholder="Identity title"
                  />
                </Field>
                <Field label="Icon Keyword">
                  <input
                    className={formInput}
                    value={identity.icon || ''}
                    onChange={(e) => updateIdentity(index, { icon: e.target.value })}
                    placeholder="Optional icon keyword"
                  />
                </Field>

                <Field label="Image">
                  <div className="flex gap-2">
                    <input
                      className={formInput}
                      value={identity.image_url || ''}
                      onChange={(e) => updateIdentity(index, { image_url: e.target.value })}
                      placeholder="/image.png"
                    />
                    <label className="inline-flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-slate-200 bg-slate-100 text-slate-600 transition-all hover:bg-slate-200">
                      <Upload size={18} />
                      <input
                        type="file"
                        accept="image/*"
                        className="sr-only"
                        onChange={(e) => updateIdentityImage(index, e.target.files?.[0])}
                      />
                    </label>
                  </div>
                </Field>

                {identity.image_url && (
                  <div className="overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
                    <img src={identity.image_url} alt="" className="h-40 w-full object-cover" />
                  </div>
                )}
              </div>

              <div className="mt-6 flex items-center justify-between gap-2 border-t border-slate-200 pt-4">
                <div className="flex gap-2">
                  <IconButton
                    label="Move up"
                    disabled={index === 0}
                    onClick={() => reorderIdentities(index, -1)}
                  >
                    <ArrowUp size={16} />
                  </IconButton>
                  <IconButton
                    label="Move down"
                    disabled={index === draft.identities.length - 1}
                    onClick={() => reorderIdentities(index, 1)}
                  >
                    <ArrowDown size={16} />
                  </IconButton>
                </div>
                <IconButton label="Delete" danger onClick={() => removeIdentity(index)}>
                  <Trash2 size={16} />
                </IconButton>
              </div>
            </div>
          ))}
        </div>

        {draft.identities.length === 0 && (
          <div className="rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 px-8 py-12 text-center">
            <p className="text-slate-600">No identity items yet. Add one to get started.</p>
          </div>
        )}
      </div>
    )
  }

  const renderGenericEditor = () => {
    if (!draft) return null

    const blocks = Array.isArray(draft.blocks) ? draft.blocks : []

    return (
      <div className="space-y-8">
        {/* Main Content Editor */}
        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
          {/* Left Column - Editor */}
          <div className="space-y-6">
            {/* Basic Section */}
            <div
              className="rounded-xl border border-slate-200 bg-white p-6 transition-all duration-200 sm:p-8"
              style={{
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05), 0 2px 8px rgba(0, 0, 0, 0.04)',
              }}
            >
              <div className="mb-6 border-b border-slate-200 pb-6">
                <h2 className="text-2xl font-bold text-slate-900">{selectedSection.title}</h2>
                <p className="mt-2 text-sm text-slate-600">{selectedSection.description}</p>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <Field label="Eyebrow">
                  <input
                    className={formInput}
                    value={draft.eyebrow ?? ''}
                    onChange={(e) => updateDraft({ eyebrow: e.target.value })}
                    placeholder="e.g., Primary copy"
                  />
                </Field>
                <Field label="Subtitle">
                  <input
                    className={formInput}
                    value={draft.subtitle ?? ''}
                    onChange={(e) => updateDraft({ subtitle: e.target.value })}
                    placeholder="Supporting subtitle"
                  />
                </Field>
                {selectedSection.slug === 'vision-agenda' ? (
                  <>
                    <div className="md:col-span-2">
                      <Field label="Title - Main Text">
                        <input
                          className={formInput}
                          value={draft.title ?? ''}
                          onChange={(e) => updateDraft({ title: e.target.value })}
                          placeholder="e.g., One doctor's blueprint for a"
                        />
                      </Field>
                      <p className="mt-1 text-xs text-slate-500">This appears on the first line</p>
                    </div>
                    <div className="md:col-span-2">
                      <Field label="Title - Highlighted Text">
                        <input
                          className={formInput}
                          value={draft.subtitle ?? ''}
                          onChange={(e) => updateDraft({ subtitle: e.target.value })}
                          placeholder="e.g., self-sufficient healthcare Africa"
                        />
                      </Field>
                      <p className="mt-1 text-xs text-slate-500">
                        This appears emphasized on the second line
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="md:col-span-2">
                    <Field label="Title">
                      <textarea
                        className={formInput}
                        rows={3}
                        value={draft.title ?? ''}
                        onChange={(e) => updateDraft({ title: e.target.value })}
                        placeholder="Enter the main title"
                      />
                    </Field>
                  </div>
                )}
                
              </div>

              <div className="mt-6 border-t border-slate-200 pt-6">
                <Field label="Hero Image">
                  <div className="flex gap-2">
                    <input
                      className={formInput}
                      value={draft.image_url ?? ''}
                      onChange={(e) => updateDraft({ image_url: e.target.value })}
                      placeholder="https://..."
                    />
                    <label className="inline-flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-slate-200 bg-slate-100 text-slate-600 transition-all hover:bg-slate-200">
                      <Upload size={18} />
                      <input
                        type="file"
                        accept="image/*"
                        className="sr-only"
                        onChange={(e) => updateDraftImage(e.target.files?.[0])}
                      />
                    </label>
                  </div>
                </Field>
                <div className="mt-4">
                  <Field label="Image Alt Text">
                    <input
                      className={formInput}
                      value={draft.image_alt ?? ''}
                      onChange={(e) => updateDraft({ image_alt: e.target.value })}
                      placeholder="Describe the image"
                    />
                  </Field>
                </div>
              </div>
            </div>

            {/* Foundation Stats */}
            {selectedSection.slug === 'foundation' && (
              <div
                className="rounded-xl border border-slate-200 bg-white p-6 sm:p-8"
                style={{
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05), 0 2px 8px rgba(0, 0, 0, 0.04)',
                }}
              >
                <div className="mb-6 flex items-center justify-between border-b border-slate-200 pb-6">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">Foundation Stats</h3>
                    <p className="mt-1 text-sm text-slate-600">Display cards with key statistics</p>
                  </div>
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 rounded-lg bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-900 transition-all hover:bg-slate-200"
                    onClick={() => addListItem('stats', { value: '', label: '' })}
                  >
                    <Plus size={16} /> Add
                  </button>
                </div>

                <div className="grid gap-4 md:grid-cols-4">
                  {(draft.stats || []).map((stat, index) => (
                    <div
                      key={index}
                      className="rounded-lg border border-slate-200 bg-slate-50 p-5 transition-all hover:border-slate-300"
                    >
                      <Field label="Value">
                        <input
                          className={formInput}
                          value={stat.value || ''}
                          onChange={(e) =>
                            updateListItem('stats', index, { value: e.target.value })
                          }
                          placeholder="e.g., $10M"
                        />
                      </Field>
                      <div className="mt-3">
                        <Field label="Label">
                          <input
                            className={formInput}
                            value={stat.label || ''}
                            onChange={(e) =>
                              updateListItem('stats', index, { label: e.target.value })
                            }
                            placeholder="e.g., Raised"
                          />
                        </Field>
                      </div>
                      <div className="mt-4 flex justify-end">
                        <IconButton
                          label="Delete"
                          danger
                          onClick={() => removeListItem('stats', index)}
                        >
                          <Trash2 size={16} />
                        </IconButton>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Blocks Editor */}
            <div
              className="rounded-xl border border-slate-200 bg-white p-6 sm:p-8"
              style={{
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05), 0 2px 8px rgba(0, 0, 0, 0.04)',
              }}
            >
              <div className="mb-6 flex items-center justify-between border-b border-slate-200 pb-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">
                    {selectedSection.blockLabel || 'Cards & Blocks'}
                  </h3>
                  <p className="mt-1 text-sm text-slate-600">
                    Manage every visible card in this section
                  </p>
                </div>
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-lg bg-teal-500 px-4 py-2 font-semibold text-white transition-all hover:bg-teal-600"
                  onClick={addBlock}
                >
                  <Plus size={16} /> Add Card
                </button>
              </div>

              <div className="space-y-5">
                {blocks.length === 0 ? (
                  <div className="rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
                    <p className="text-slate-600">No cards yet. Add one to get started.</p>
                  </div>
                ) : (
                  blocks.map((block, index) => (
                    <div
                      key={block.id || index}
                      className="rounded-lg border border-slate-200 bg-slate-50 p-5 transition-all hover:border-slate-300"
                    >
                      <div className="mb-4 flex items-center justify-between">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white font-bold text-slate-600">
                          {index + 1}
                        </div>
                        <span className="text-xs font-semibold text-slate-500 uppercase">Card</span>
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                        <Field label="Label">
                          <input
                            className={formInput}
                            value={block.eyebrow || ''}
                            onChange={(e) => updateBlock(index, { eyebrow: e.target.value })}
                            placeholder="Card label"
                          />
                        </Field>
                        <Field label="Title">
                          <input
                            className={formInput}
                            value={block.title || ''}
                            onChange={(e) => updateBlock(index, { title: e.target.value })}
                            placeholder="Card title"
                          />
                        </Field>
                        <Field label="Image">
                          <div className="flex gap-2">
                            <input
                              className={formInput}
                              value={block.image_url || ''}
                              onChange={(e) => updateBlock(index, { image_url: e.target.value })}
                              placeholder="https://..."
                            />
                            <label className="inline-flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-slate-200 bg-slate-100 text-slate-600 transition-all hover:bg-slate-200">
                              <Upload size={18} />
                              <input
                                type="file"
                                accept="image/*"
                                className="sr-only"
                                onChange={(e) => updateBlockImage(index, e.target.files?.[0])}
                              />
                            </label>
                          </div>
                        </Field>

                        {selectedSection.slug !== 'vision-agenda' && (
                          <>
                            <div className="md:col-span-2">
                              <Field label="Icon">
                                <IconPicker
                                  value={block.metadata?.icon || 'sparkles'}
                                  onChange={(value) => updateBlockMetadata(index, { icon: value })}
                                />
                              </Field>
                            </div>

                            {selectedSection.slug === 'recognition-awards' && (
                              <div className="grid gap-4 md:col-span-2 md:grid-cols-3">
                                <Field label="Organization">
                                  <input
                                    className={formInput}
                                    value={block.metadata?.organization || ''}
                                    onChange={(e) =>
                                      updateBlockMetadata(index, { organization: e.target.value })
                                    }
                                    placeholder="Org name"
                                  />
                                </Field>
                                <Field label="Year">
                                  <input
                                    className={formInput}
                                    value={block.metadata?.year || ''}
                                    onChange={(e) =>
                                      updateBlockMetadata(index, { year: e.target.value })
                                    }
                                    placeholder="2024"
                                  />
                                </Field>
                                <Field label="Category">
                                  <input
                                    className={formInput}
                                    value={block.metadata?.category || ''}
                                    onChange={(e) =>
                                      updateBlockMetadata(index, { category: e.target.value })
                                    }
                                    placeholder="Category"
                                  />
                                </Field>
                              </div>
                            )}
                          </>
                        )}
                      </div>

                      <div className="mt-4 flex items-center justify-between gap-2 border-t border-slate-200 pt-4">
                        <div className="flex gap-2">
                          <IconButton
                            label="Move up"
                            disabled={index === 0}
                            onClick={() => reorderBlocks(index, -1)}
                          >
                            <ArrowUp size={16} />
                          </IconButton>
                          <IconButton
                            label="Move down"
                            disabled={index === blocks.length - 1}
                            onClick={() => reorderBlocks(index, 1)}
                          >
                            <ArrowDown size={16} />
                          </IconButton>
                        </div>
                        <IconButton label="Delete" danger onClick={() => removeBlock(index)}>
                          <Trash2 size={16} />
                        </IconButton>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Preview & Help */}
          <aside className="space-y-6">
            {/* Preview */}
            <div
              className="sticky top-8 rounded-xl border border-slate-200 bg-white p-6 sm:p-8"
              style={{
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05), 0 2px 8px rgba(0, 0, 0, 0.04)',
              }}
            >
              <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-600">
                Live Preview
              </h3>
              <div className="rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-slate-900">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  {draft.eyebrow || 'Section label'}
                </p>
                {selectedSection.slug === 'vision-agenda' ? (
                  <h4 className="mt-3 text-lg font-bold text-slate-900">
                    {draft.title || selectedSection.title}
                    {draft.subtitle && (
                      <>
                        <br />
                        <em className="text-teal-600 italic font-normal">{draft.subtitle}</em>
                      </>
                    )}
                  </h4>
                ) : (
                  <h4 className="mt-3 text-lg font-bold text-slate-900">
                    {draft.title || selectedSection.title}
                  </h4>
                )}
                {draft.image_url && (
                  <div className="mt-4 overflow-hidden rounded-lg border border-slate-200">
                    <img src={draft.image_url} alt="" className="h-32 w-full object-cover" />
                  </div>
                )}
              </div>
            </div>

            {/* Help */}
            <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-teal-50 to-cyan-50 p-6 sm:p-8">
              <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-teal-900">
                <Sparkles size={18} /> Editing Guide
              </h3>
              <p className="text-sm leading-relaxed text-teal-800">{selectedSection.hint}</p>
            </div>
          </aside>
        </div>
      </div>
    )
  }

  if (isLoading || !draft) {
    return (
      <div className="flex min-h-96 items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 size={32} className="animate-spin text-teal-500" />
          <p className="text-sm text-slate-600">Loading story content...</p>
        </div>
      </div>
    )
  }

  return (
    <section className="mx-auto max-w-7xl">
      {/* Page Header */}
      <div className="mb-10 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-teal-600">Story Editor</p>
          <h1 className="mt-3 text-4xl font-bold text-slate-900 sm:text-5xl">
            {selectedSection.title}
          </h1>
          <p className="mt-3 max-w-3xl text-slate-600">{selectedSection.description}</p>
        </div>
        <button
          type="button"
          onClick={saveSection}
          disabled={isSaving}
          className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-teal-500 to-teal-600 px-6 py-3 font-semibold text-white transition-all hover:shadow-lg hover:shadow-teal-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
          <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
        </button>
      </div>

      {/* Content */}
      {selectedSection.type === 'timeline'
        ? renderTimelineEditor()
        : selectedSection.type === 'identities'
          ? renderIdentityEditor()
          : renderGenericEditor()}

      {/* Toast */}
      <Toast message={message} error={error} />
    </section>
  )
}
