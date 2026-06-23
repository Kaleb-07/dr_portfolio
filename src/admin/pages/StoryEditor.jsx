import {
  ArrowDown,
  ArrowUp,
  BriefcaseBusiness,
  GraduationCap,
  Handshake,
  HeartPulse,
  Hospital,
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
} from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../api'

const STORY_SECTIONS = [
  {
    slug: 'vision-agenda',
    title: 'The Visionary Agenda',
    description: 'Hero story opener with identity cards and bold positioning.',
    backendSlug: 'vision_agenda',
    hint: 'Fill in each headline field separately using plain text only — no HTML or code. The "Teal Highlighted" word(s) will appear in color on the website automatically.',
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
    hint: 'Each framework card has a label, title, description, and icon. Write plain text only.',
  },
  {
    slug: 'foundation',
    title: 'Foundation',
    description: 'Manage the LUCS Foundation section, pillars, and statistics.',
    backendSlug: 'foundation_story',
    blockLabel: 'Foundation Pillar',
    hint: 'Edit the heading, intro text, pillars, and stat cards. Each pillar has a title and an icon.',
  },
  {
    slug: 'recognition-awards',
    title: 'Recognition & Awards',
    description: 'Manage the awards carousel content and section heading.',
    backendSlug: 'recognition_awards',
    blockLabel: 'Award Card',
    hint: 'Fill in every field for each award — title, description, organization, year, category, and image.',
  },
  {
    slug: 'leadership-philosophy',
    title: 'Leadership Philosophy',
    description: 'Manage the full-width quote section and attribution.',
    backendSlug: 'leadership_philosophy',
    hint: 'Write the quote and attribution as plain text. The styling is applied automatically on the website.',
  },
  {
    slug: 'testimonials',
    title: 'Testimonials',
    description: 'Manage the heading, CTA, and all testimonial cards.',
    backendSlug: 'testimonials_section',
    type: 'testimonials',
    hint: 'Edit the section tag, headline, body text, and the "Share Your Story" button. Then manage each testimonial\'s quote, author, role, organisation, and avatar.',
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

const FOUNDATION_ICONS = [
  'heart-pulse',
  'graduation-cap',
  'hospital',
  'handshake',
  'landmark',
  'microscope',
  'sparkles',
]

const FALLBACK_TESTIMONIALS = [
  {
    id: 'testimonial-health-minister',
    quote:
      "Dr. Girma Ababi is a visionary leader who has demonstrated that private sector innovation and public health goals can work hand in hand. His contributions to healthcare policy and his leadership at the Ethiopian Healthcare Federation have been invaluable to our nation's health transformation agenda.",
    author: 'H.E. Dr. Mekdes Daba',
    title: 'Minister of Health',
    organization: 'Federal Ministry of Health, Ethiopia',
    avatar_url: '/avatar_mekdes.png',
    sort_order: 0,
  },
  {
    id: 'testimonial-colleague-pathologist',
    quote:
      'I have known Dr. Girma Ababi since his days as Chief Resident in anatomical pathology. His clinical acumen was exceptional, and his transition from pathology to building an entire healthcare ecosystem is a testament to his extraordinary vision and determination. He is a true nation builder.',
    author: 'Prof. Yonas Desta',
    title: 'Professor of Anatomical Pathology',
    organization: 'Addis Ababa University',
    avatar_url: '/avatar_yonas.png',
    sort_order: 1,
  },
  {
    id: 'testimonial-board-colleague',
    quote:
      'Serving on a board chaired by Dr. Girma Ababi is an education in strategic governance. He brings clarity, integrity, and an unwavering focus on impact. His leadership style is both collaborative and decisive, and he has a rare ability to see around corners.',
    author: 'W/ro Tirunesh Ayele',
    title: 'Board Member',
    organization: 'Liyana Healthcare',
    avatar_url: '/avatar_tirunesh.png',
    sort_order: 2,
  },
  {
    id: 'testimonial-stanford-peer',
    quote:
      'Dr. Girma Ababi was a standout participant in the Stanford GSB Seed Transformation Program. His vision for an integrated healthcare system in Ethiopia was compelling, and his execution has been remarkable. He represents the very best of entrepreneurial leadership in emerging economies.',
    author: 'Prof. Hau Lee',
    title: 'Faculty Director, Seed Transformation Program',
    organization: 'Stanford Graduate School of Business',
    avatar_url: '',
    sort_order: 3,
  },
  {
    id: 'testimonial-foundation-partner',
    quote:
      "The LUCS Foundation under Dr. Girma Ababi's patronage has set a new standard for strategic philanthropy in Ethiopia. Their approach to community health, education access, and infrastructure development is thoughtful, sustainable, and deeply impactful.",
    author: 'Ato Solomon Assefa',
    title: 'Director of Programs',
    organization: 'LUCS Foundation',
    avatar_url: '',
    sort_order: 4,
  },
  {
    id: 'testimonial-international-rotarian',
    quote:
      "As a fellow Rotarian, I have witnessed Dr. Girma Ababi's commitment to service above self. His dedication to community health and his ability to mobilize resources for those who need them most exemplify the very best of Rotary's values.",
    author: 'PDG Dr. Tewodros Mamo',
    title: 'Past District Governor',
    organization: 'Rotary International District 9212',
    avatar_url: '',
    sort_order: 5,
  },
]

const getIconComponent = (iconValue) => {
  const found = ICON_OPTIONS.find((opt) => opt.value === iconValue)
  return found ? found.Icon : Sparkles
}

const formInput =
  'w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/10'
const labelClass = 'mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-600'

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
            className={`flex flex-col items-center justify-center gap-2 rounded-lg border-2 px-3 py-4 text-center transition-all duration-200 ${
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

function NewItemCard({ id, isNew, newItemRef, children }) {
  return (
    <div
      ref={isNew ? newItemRef : null}
      tabIndex={isNew ? -1 : undefined}
      className={`rounded-xl border bg-white p-6 transition-all duration-500 ${
        isNew
          ? 'border-teal-400 ring-2 ring-teal-400/30 shadow-xl shadow-teal-100'
          : 'border-slate-200 hover:shadow-lg'
      }`}
      style={{
        boxShadow: isNew
          ? '0 0 0 3px rgba(20,184,166,0.15), 0 6px 24px rgba(20,184,166,0.14)'
          : '0 1px 3px rgba(0,0,0,0.05), 0 2px 8px rgba(0,0,0,0.04)',
      }}
    >
      {isNew && (
        <div className="mb-4 flex items-center gap-2 rounded-lg bg-teal-50 px-3 py-2 text-xs font-semibold text-teal-700 border border-teal-200">
          <Sparkles size={13} />
          New item added — fill in the fields below
        </div>
      )}
      {children}
    </div>
  )
}

function stripHtml(html = '') {
  return html.replace(/<[^>]*>/g, '').trim()
}

function buildSectionDraft(section = {}) {
  return {
    eyebrow: section.eyebrow || '',
    title: stripHtml(section.title || ''),
    subtitle: stripHtml(section.subtitle || ''),
    title_highlight: section.metadata?.title_highlight || '',
    description: stripHtml(section.description || ''),
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

function buildTestimonials(list = []) {
  return list.map((item, i) => ({
    ...item,
    quote: item.quote || '',
    author: item.author || '',
    title: item.title || '',
    organization: item.organization || '',
    avatar_url: item.avatar_url || item.avatar || '',
    sort_order: item.sort_order ?? i,
  }))
}

function buildTestimonialSectionDraft(section = {}) {
  return {
    eyebrow: section.eyebrow || '',
    title: stripHtml(section.title || ''),
    description: stripHtml(section.description || ''),
    cta_text: section.metadata?.cta_text || '',
    cta_link: section.metadata?.cta_link || '',
  }
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
  const [deletedTestimonialIds, setDeletedTestimonialIds] = useState([])
  const [newItemId, setNewItemId] = useState(null)
  const newItemRef = useRef(null)

  const selectedSection = useMemo(
    () => STORY_SECTIONS.find((s) => s.slug === sectionSlug) ?? STORY_SECTIONS[0],
    [sectionSlug],
  )

  useEffect(() => {
    if (!sectionSlug) navigate(`/admin/story/${STORY_SECTIONS[0].slug}`, { replace: true })
  }, [navigate, sectionSlug])

  useEffect(() => {
    setMessage('')
    setError('')
    setDeletedIdentityIds([])
    setDeletedTimelineIds([])
    setDeletedTestimonialIds([])
    setNewItemId(null)

    if (selectedSection.type === 'timeline') {
      setDraft({ events: buildTimelineEvents([]) })
      return
    }
    if (selectedSection.type === 'identities') {
      setDraft({ identities: buildIdentityItems([]) })
      return
    }
    if (selectedSection.type === 'testimonials') {
      setDraft({
        ...buildTestimonialSectionDraft({}),
        testimonials: buildTestimonials(FALLBACK_TESTIMONIALS),
      })
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
    if (selectedSection.type === 'testimonials') {
      const sectionData = content.sections?.[selectedSection.backendSlug] || {}
      setDraft({
        ...buildTestimonialSectionDraft(sectionData),
        testimonials: buildTestimonials(
          content.testimonials?.length ? content.testimonials : FALLBACK_TESTIMONIALS,
        ),
      })
      return
    }
    if (selectedSection.backendSlug) {
      setDraft(buildSectionDraft(content.sections[selectedSection.backendSlug] || {}))
      return
    }
    setDraft(buildSectionDraft({}))
  }, [content, selectedSection])

  useEffect(() => {
    if (newItemId && newItemRef.current) {
      newItemRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
      newItemRef.current.focus?.()
      const t = setTimeout(() => setNewItemId(null), 2500)
      return () => clearTimeout(t)
    }
  }, [newItemId])

  const updateDraft = (patch) => setDraft((c) => ({ ...c, ...patch }))

  const updateBlock = (index, patch) => {
    if (!draft) return
    setDraft((c) => ({
      ...c,
      blocks: c.blocks.map((b, i) => (i === index ? { ...b, ...patch } : b)),
    }))
  }

  const updateBlockMetadata = (index, patch) => {
    if (!draft) return
    setDraft((c) => ({
      ...c,
      blocks: c.blocks.map((b, i) =>
        i === index ? { ...b, metadata: { ...(b.metadata || {}), ...patch } } : b,
      ),
    }))
  }

  const addBlock = () => {
    const id = `new-${Date.now()}`
    setDraft((c) => ({
      ...c,
      blocks: [
        ...(c.blocks || []),
        {
          id,
          block_type: c.blocks?.[0]?.block_type || 'content',
          eyebrow: '',
          title: '',
          body: '',
          image_url: '',
          image_alt: '',
          metadata: { icon: 'sparkles' },
          sort_order: (c.blocks || []).length + 1,
        },
      ],
    }))
    setNewItemId(id)
  }

  const removeBlock = (index) =>
    setDraft((c) => ({ ...c, blocks: c.blocks.filter((_, i) => i !== index) }))

  const reorderBlocks = (index, direction) => {
    if (!draft) return
    setDraft((c) => {
      const next = [...c.blocks]
      const target = index + direction
      if (target < 0 || target >= next.length) return c
      ;[next[index], next[target]] = [next[target], next[index]]
      return { ...c, blocks: next }
    })
  }

  const updateListItem = (key, index, patch) =>
    setDraft((c) => ({
      ...c,
      [key]: c[key].map((item, i) => (i === index ? { ...item, ...patch } : item)),
    }))

  const addListItem = (key, emptyItem) =>
    setDraft((c) => ({ ...c, [key]: [...(c[key] || []), emptyItem] }))

  const removeListItem = (key, index) =>
    setDraft((c) => ({ ...c, [key]: c[key].filter((_, i) => i !== index) }))

  const updateDraftImage = (file) =>
    readLocalImage(
      file,
      (url) => updateDraft({ image_url: url }),
      () => setError('Could not read image.'),
    )

  const updateBlockImage = (index, file) =>
    readLocalImage(
      file,
      (url) => updateBlock(index, { image_url: url }),
      () => setError('Could not read image.'),
    )

  // Timeline handlers
  const addTimelineEvent = () => {
    const id = `new-${Date.now()}`
    setDraft((c) => {
      const events = Array.isArray(c?.events) ? c.events : []
      return {
        ...c,
        events: [
          ...events,
          {
            id,
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
    setNewItemId(id)
  }

  const updateTimelineEvent = (index, patch) =>
    setDraft((c) => {
      if (!Array.isArray(c?.events)) return c
      return {
        ...c,
        events: c.events.map((item, i) => (i === index ? { ...item, ...patch } : item)),
      }
    })

  const reorderTimeline = (index, direction) => {
    setDraft((c) => {
      if (!Array.isArray(c?.events)) return c
      const next = [...c.events]
      const target = index + direction
      if (target < 0 || target >= next.length) return c
      ;[next[index], next[target]] = [next[target], next[index]]
      return { ...c, events: next }
    })
  }

  const removeTimelineEvent = (index) => {
    setDraft((c) => {
      if (!Array.isArray(c?.events)) return c
      const removed = c.events[index]
      if (typeof removed?.id === 'number') setDeletedTimelineIds((ids) => [...ids, removed.id])
      return { ...c, events: c.events.filter((_, i) => i !== index) }
    })
  }

  // Identity handlers
  const addIdentity = () => {
    setDraft((c) => {
      const identities = Array.isArray(c?.identities) ? c.identities : []
      return {
        ...c,
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

  const updateIdentity = (index, patch) =>
    setDraft((c) => {
      if (!Array.isArray(c?.identities)) return c
      return {
        ...c,
        identities: c.identities.map((item, i) => (i === index ? { ...item, ...patch } : item)),
      }
    })

  const updateIdentityImage = (index, file) =>
    readLocalImage(
      file,
      (url) => updateIdentity(index, { image_url: url }),
      () => setError('Could not read image.'),
    )

  const reorderIdentities = (index, direction) => {
    setDraft((c) => {
      if (!Array.isArray(c?.identities)) return c
      const next = [...c.identities]
      const target = index + direction
      if (target < 0 || target >= next.length) return c
      ;[next[index], next[target]] = [next[target], next[index]]
      return { ...c, identities: next.map((item, i) => ({ ...item, sort_order: i + 1 })) }
    })
  }

  const removeIdentity = (index) => {
    setDraft((c) => {
      if (!Array.isArray(c?.identities)) return c
      const removed = c.identities[index]
      if (typeof removed?.id === 'number') setDeletedIdentityIds((ids) => [...ids, removed.id])
      return { ...c, identities: c.identities.filter((_, i) => i !== index) }
    })
  }

  // Testimonial handlers
  const addTestimonial = () => {
    const id = `new-${Date.now()}`
    setDraft((c) => {
      const testimonials = Array.isArray(c?.testimonials) ? c.testimonials : []
      return {
        ...c,
        testimonials: [
          ...testimonials,
          {
            id,
            quote: '',
            author: '',
            title: '',
            organization: '',
            avatar_url: '',
            sort_order: testimonials.length + 1,
          },
        ],
      }
    })
    setNewItemId(id)
  }

  const updateTestimonial = (index, patch) =>
    setDraft((c) => {
      if (!Array.isArray(c?.testimonials)) return c
      return {
        ...c,
        testimonials: c.testimonials.map((item, i) => (i === index ? { ...item, ...patch } : item)),
      }
    })

  const updateTestimonialAvatar = (index, file) =>
    readLocalImage(
      file,
      (url) => updateTestimonial(index, { avatar_url: url }),
      () => setError('Could not read avatar image.'),
    )

  const reorderTestimonials = (index, direction) => {
    setDraft((c) => {
      if (!Array.isArray(c?.testimonials)) return c
      const next = [...c.testimonials]
      const target = index + direction
      if (target < 0 || target >= next.length) return c
      ;[next[index], next[target]] = [next[target], next[index]]
      return {
        ...c,
        testimonials: next.map((item, i) => ({ ...item, sort_order: i + 1 })),
      }
    })
  }

  const removeTestimonial = (index) => {
    setDraft((c) => {
      if (!Array.isArray(c?.testimonials)) return c
      const removed = c.testimonials[index]
      if (typeof removed?.id === 'number') setDeletedTestimonialIds((ids) => [...ids, removed.id])
      return { ...c, testimonials: c.testimonials.filter((_, i) => i !== index) }
    })
  }

  const saveSection = async () => {
    if (!draft || !selectedSection) return
    setMessage('')
    setError('')
    setIsSaving(true)
    try {
      if (selectedSection.type === 'timeline') {
        if (!Array.isArray(draft.events)) throw new Error('No events')
        for (const id of deletedTimelineIds) await api.delete(`/cms/timeline-events/${id}`)
        for (const [i, event] of draft.events.entries()) {
          const payload = { ...event, sort_order: i + 1 }
          if (typeof event.id === 'number')
            await api.put(`/cms/timeline-events/${event.id}`, payload)
          else {
            const { id, ...p } = payload
            await api.post('/cms/timeline-events', p)
          }
        }
        setMessage('Timeline saved!')
        setDeletedTimelineIds([])
        setTimeout(() => setMessage(''), 3000)
        await refreshContent()
      } else if (selectedSection.type === 'identities') {
        if (!Array.isArray(draft.identities)) throw new Error('No identities')
        for (const id of deletedIdentityIds) await api.delete(`/cms/identity-items/${id}`)
        for (const [i, identity] of draft.identities.entries()) {
          const payload = { ...identity, sort_order: i + 1 }
          if (typeof identity.id === 'number')
            await api.put(`/cms/identity-items/${identity.id}`, payload)
          else {
            const { id, ...p } = payload
            await api.post('/cms/identity-items', p)
          }
        }
        setMessage('Identity items saved!')
        setDeletedIdentityIds([])
        setTimeout(() => setMessage(''), 3000)
        await refreshContent()
      } else if (selectedSection.type === 'testimonials') {
        // Save section heading
        const sectionPatch = {
          eyebrow: draft.eyebrow,
          title: draft.title,
          description: draft.description,
          metadata: {
            cta_text: draft.cta_text,
            cta_link: draft.cta_link,
          },
        }
        await api.put(`/cms/sections/${selectedSection.backendSlug}`, {
          section: sectionPatch,
        })

        // Save testimonials list
        if (!Array.isArray(draft.testimonials)) throw new Error('No testimonials')
        for (const id of deletedTestimonialIds) await api.delete(`/cms/testimonials/${id}`)
        for (const [i, testimonial] of draft.testimonials.entries()) {
          const payload = { ...testimonial, sort_order: i + 1 }
          if (typeof testimonial.id === 'number')
            await api.put(`/cms/testimonials/${testimonial.id}`, payload)
          else {
            const { id, ...p } = payload
            await api.post('/cms/testimonials', p)
          }
        }
        setMessage('Testimonials section saved!')
        setDeletedTestimonialIds([])
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
            title_highlight: draft.title_highlight,
          },
        }
        await api.put(`/cms/sections/${selectedSection.backendSlug}`, {
          section: sectionPatch,
          blocks: draft.blocks,
        })
        setMessage('Section saved!')
        setTimeout(() => setMessage(''), 3000)
        await refreshContent()
      }
    } catch {
      setError('Could not save. Please try again.')
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
            <NewItemCard
              key={event.id || index}
              id={event.id}
              isNew={event.id === newItemId}
              newItemRef={newItemRef}
            >
              <div className="mb-4 flex items-center gap-3">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-lg font-bold text-sm ${
                    event.id === newItemId ? 'bg-teal-500 text-white' : 'bg-teal-100 text-teal-600'
                  }`}
                >
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
                    autoFocus={event.id === newItemId}
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
                      onChange={(v) => updateTimelineEvent(index, { icon: v })}
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
            </NewItemCard>
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
              className="rounded-xl border border-slate-200 bg-white p-6 transition-all duration-200 hover:shadow-lg"
              style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.05), 0 2px 8px rgba(0,0,0,0.04)' }}
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

  const renderTestimonialsEditor = () => {
    if (!draft) return null
    return (
      <div className="space-y-8">
        {/* ─── SECTION HEADING ─── */}
        <div
          className="rounded-xl border border-slate-200 bg-white p-6 sm:p-8"
          style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.05), 0 2px 8px rgba(0,0,0,0.04)' }}
        >
          <div className="mb-6 border-b border-slate-200 pb-6">
            <h2 className="text-2xl font-bold text-slate-900">Section Heading</h2>
            <p className="mt-2 text-sm text-slate-600">
              Edit the tag, headline, body, and the call‑to‑action button.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <Field label="Eyebrow (tag)" hint="Small label above the headline, e.g. 'Testimonials'">
              <input
                className={formInput}
                value={draft.eyebrow || ''}
                onChange={(e) => updateDraft({ eyebrow: e.target.value })}
                placeholder="Testimonials"
              />
            </Field>
            <Field
              label="Headline"
              hint="The big headline. The word(s) inside <span class='text-teal'>…</span> will be highlighted on the front‑end."
            >
              <input
                className={formInput}
                value={draft.title || ''}
                onChange={(e) => updateDraft({ title: e.target.value })}
                placeholder="Trusted by Leaders Across Africa"
              />
            </Field>
            <div className="md:col-span-2">
              <Field label="Description" hint="Supporting paragraph below the headline.">
                <textarea
                  className={formInput}
                  rows={4}
                  value={draft.description || ''}
                  onChange={(e) => updateDraft({ description: e.target.value })}
                  placeholder="From government ministers to academic pioneers..."
                />
              </Field>
            </div>
            <Field label="CTA Button Text" hint="e.g. 'Share Your Story'">
              <input
                className={formInput}
                value={draft.cta_text || ''}
                onChange={(e) => updateDraft({ cta_text: e.target.value })}
                placeholder="Share Your Story"
              />
            </Field>
            <Field label="CTA Button Link" hint="e.g. '/contact'">
              <input
                className={formInput}
                value={draft.cta_link || ''}
                onChange={(e) => updateDraft({ cta_link: e.target.value })}
                placeholder="/contact"
              />
            </Field>
          </div>
        </div>

        {/* ─── TESTIMONIAL CARDS ─── */}
        <div className="space-y-4">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h3 className="text-2xl font-bold text-slate-900">Testimonial Cards</h3>
              <p className="mt-1 text-sm text-slate-600">
                Add, edit, reorder, or remove testimonials. The public site shows the first 3.
              </p>
            </div>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-lg bg-teal-500 px-5 py-2.5 font-semibold text-white transition-all hover:bg-teal-600"
              onClick={addTestimonial}
            >
              <Plus size={18} /> Add Testimonial
            </button>
          </div>

          {draft.testimonials?.length > 0 ? (
            draft.testimonials.map((testimonial, index) => (
              <NewItemCard
                key={testimonial.id || index}
                id={testimonial.id}
                isNew={testimonial.id === newItemId}
                newItemRef={newItemRef}
              >
                <div className="mb-4 flex items-center gap-3">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-lg font-bold text-sm ${
                      testimonial.id === newItemId
                        ? 'bg-teal-500 text-white'
                        : 'bg-teal-100 text-teal-600'
                    }`}
                  >
                    {index + 1}
                  </div>
                  <h3 className="font-semibold text-slate-900">
                    {testimonial.author || 'Untitled Testimonial'}
                  </h3>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Author Name">
                    <input
                      className={formInput}
                      value={testimonial.author}
                      onChange={(e) => updateTestimonial(index, { author: e.target.value })}
                      placeholder="e.g., H.E. Dr. Mekdes Daba"
                      autoFocus={testimonial.id === newItemId}
                    />
                  </Field>
                  <Field label="Role / Title">
                    <input
                      className={formInput}
                      value={testimonial.title}
                      onChange={(e) => updateTestimonial(index, { title: e.target.value })}
                      placeholder="Minister of Health"
                    />
                  </Field>
                  <Field label="Organization">
                    <input
                      className={formInput}
                      value={testimonial.organization}
                      onChange={(e) => updateTestimonial(index, { organization: e.target.value })}
                      placeholder="Federal Ministry of Health, Ethiopia"
                    />
                  </Field>
                  <Field label="Avatar">
                    <div className="flex gap-2">
                      <input
                        className={formInput}
                        value={testimonial.avatar_url || ''}
                        onChange={(e) => updateTestimonial(index, { avatar_url: e.target.value })}
                        placeholder="URL or upload"
                      />
                      <label className="inline-flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-slate-200 bg-slate-100 text-slate-600 transition-all hover:bg-slate-200">
                        <Upload size={18} />
                        <input
                          type="file"
                          accept="image/*"
                          className="sr-only"
                          onChange={(e) => updateTestimonialAvatar(index, e.target.files?.[0])}
                        />
                      </label>
                    </div>
                    {testimonial.avatar_url && (
                      <div className="mt-2 overflow-hidden rounded-full border border-slate-200 w-14 h-14">
                        <img
                          src={testimonial.avatar_url}
                          alt="Avatar preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </Field>
                  <div className="md:col-span-2">
                    <Field label="Quote">
                      <textarea
                        className={formInput}
                        rows={4}
                        value={testimonial.quote}
                        onChange={(e) => updateTestimonial(index, { quote: e.target.value })}
                        placeholder="The testimonial quote..."
                      />
                    </Field>
                  </div>
                </div>
                <div className="mt-6 flex items-center justify-between gap-2 border-t border-slate-200 pt-4">
                  <div className="flex gap-2">
                    <IconButton
                      label="Move up"
                      disabled={index === 0}
                      onClick={() => reorderTestimonials(index, -1)}
                    >
                      <ArrowUp size={16} />
                    </IconButton>
                    <IconButton
                      label="Move down"
                      disabled={index === draft.testimonials.length - 1}
                      onClick={() => reorderTestimonials(index, 1)}
                    >
                      <ArrowDown size={16} />
                    </IconButton>
                  </div>
                  <IconButton label="Delete" danger onClick={() => removeTestimonial(index)}>
                    <Trash2 size={16} />
                  </IconButton>
                </div>
              </NewItemCard>
            ))
          ) : (
            <div className="rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 px-8 py-12 text-center">
              <p className="text-slate-600">
                No testimonials yet. Click “Add Testimonial” to begin.
              </p>
            </div>
          )}
        </div>
      </div>
    )
  }

  const renderGenericEditor = () => {
    if (!draft) return null

    const blocks = Array.isArray(draft.blocks) ? draft.blocks : []
    const isLeadership = selectedSection.slug === 'leadership-philosophy'
    const isFoundation = selectedSection.slug === 'foundation'
    const isLiyana = selectedSection.slug === 'liyana-framework'
    const isRecognition = selectedSection.slug === 'recognition-awards'
    const isVision = selectedSection.slug === 'vision-agenda'

    return (
      <div className="space-y-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
          <div className="space-y-6">
            <div
              className="rounded-xl border border-slate-200 bg-white p-6 sm:p-8"
              style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.05), 0 2px 8px rgba(0,0,0,0.04)' }}
            >
              <div className="mb-6 border-b border-slate-200 pb-6">
                <h2 className="text-2xl font-bold text-slate-900">{selectedSection.title}</h2>
                <p className="mt-2 text-sm text-slate-600">{selectedSection.description}</p>
              </div>

              {isVision && (
                <div className="grid gap-6">
                  <Field
                    label="Eyebrow / Section Label"
                    hint="Short label shown above the headline, e.g. 'My Story'"
                  >
                    <input
                      className={formInput}
                      value={draft.eyebrow ?? ''}
                      onChange={(e) => updateDraft({ eyebrow: e.target.value })}
                      placeholder="e.g., My Story"
                    />
                  </Field>
                  <Field
                    label="Headline — Line 1 (Normal text)"
                    hint="First line of the big headline. Plain text only."
                  >
                    <input
                      className={formInput}
                      value={draft.title ?? ''}
                      onChange={(e) => updateDraft({ title: e.target.value })}
                      placeholder="e.g., One doctor's blueprint for a"
                    />
                  </Field>
                  <Field
                    label="Headline — Line 2, Part A (Teal highlighted)"
                    hint="These word(s) appear in teal color on the website. Plain text only — no HTML."
                  >
                    <input
                      className={formInput}
                      value={draft.title_highlight ?? ''}
                      onChange={(e) => updateDraft({ title_highlight: e.target.value })}
                      placeholder="e.g., self-sufficient healthcare"
                    />
                  </Field>
                  <Field
                    label="Headline — Line 2, Part B (Normal text)"
                    hint="The remaining words on the second line after the teal text."
                  >
                    <input
                      className={formInput}
                      value={draft.subtitle ?? ''}
                      onChange={(e) => updateDraft({ subtitle: e.target.value })}
                      placeholder="e.g., Africa"
                    />
                  </Field>
                  <div className="border-t border-slate-200 pt-6">
                    <Field label="Hero Image" hint="Paste a direct image link or upload a file">
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
                      <Field label="Image Alt Text" hint="Describe the image for accessibility">
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
              )}

              {isLeadership && (
                <div className="grid gap-6">
                  <Field
                    label="Section Label"
                    hint="Small label shown above the quote, e.g. 'Leadership Philosophy'"
                  >
                    <input
                      className={formInput}
                      value={draft.eyebrow ?? ''}
                      onChange={(e) => updateDraft({ eyebrow: e.target.value })}
                      placeholder="e.g., Leadership Philosophy"
                    />
                  </Field>
                  <Field
                    label="Quote Text"
                    hint="Write the complete quote as plain text. Quotation marks are added automatically on the website."
                  >
                    <textarea
                      className={formInput}
                      rows={5}
                      value={draft.description ?? ''}
                      onChange={(e) => updateDraft({ description: e.target.value })}
                      placeholder="e.g., Healthcare is not a privilege — it is the foundation upon which every nation builds its future."
                    />
                  </Field>
                  <Field label="Attribution" hint="Who said this? e.g. 'Dr. Liyana, Founder & CEO'">
                    <input
                      className={formInput}
                      value={draft.subtitle ?? ''}
                      onChange={(e) => updateDraft({ subtitle: e.target.value })}
                      placeholder="e.g., Dr. Liyana, Founder & CEO"
                    />
                  </Field>
                </div>
              )}

              {isFoundation && (
                <div className="grid gap-6">
                  <Field label="Section Label">
                    <input
                      className={formInput}
                      value={draft.eyebrow ?? ''}
                      onChange={(e) => updateDraft({ eyebrow: e.target.value })}
                      placeholder="e.g., The Foundation"
                    />
                  </Field>
                  <div className="md:col-span-2">
                    <Field label="Section Title" hint="Plain text only">
                      <textarea
                        className={formInput}
                        rows={2}
                        value={draft.title ?? ''}
                        onChange={(e) => updateDraft({ title: e.target.value })}
                        placeholder="Enter the main title"
                      />
                    </Field>
                  </div>
                  <div className="md:col-span-2">
                    <Field label="Intro Paragraph" hint="The supporting text shown below the title">
                      <textarea
                        className={formInput}
                        rows={4}
                        value={draft.description ?? ''}
                        onChange={(e) => updateDraft({ description: e.target.value })}
                        placeholder="Write an introductory paragraph..."
                      />
                    </Field>
                  </div>
                </div>
              )}

              {!isVision && !isLeadership && !isFoundation && (
                <div className="grid gap-6 md:grid-cols-2">
                  <Field label="Eyebrow / Section Label">
                    <input
                      className={formInput}
                      value={draft.eyebrow ?? ''}
                      onChange={(e) => updateDraft({ eyebrow: e.target.value })}
                      placeholder="e.g., The Framework"
                    />
                  </Field>
                  <div className="md:col-span-2">
                    <Field label="Title" hint="Plain text only — no HTML needed">
                      <textarea
                        className={formInput}
                        rows={2}
                        value={draft.title ?? ''}
                        onChange={(e) => updateDraft({ title: e.target.value })}
                        placeholder="Enter the main title"
                      />
                    </Field>
                  </div>
                  <div className="md:col-span-2">
                    <Field label="Subtitle / Supporting Text">
                      <input
                        className={formInput}
                        value={draft.subtitle ?? ''}
                        onChange={(e) => updateDraft({ subtitle: e.target.value })}
                        placeholder="Supporting subtitle"
                      />
                    </Field>
                  </div>
                  <div className="md:col-span-2 border-t border-slate-200 pt-6">
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
              )}
            </div>

            {isFoundation && (
              <>
                <div
                  className="rounded-xl border border-slate-200 bg-white p-6 sm:p-8"
                  style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.05), 0 2px 8px rgba(0,0,0,0.04)' }}
                >
                  <div className="mb-6 flex items-center justify-between border-b border-slate-200 pb-6">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">Foundation Stats</h3>
                      <p className="mt-1 text-sm text-slate-600">
                        Key numbers displayed as stat cards
                      </p>
                    </div>
                    <button
                      type="button"
                      className="inline-flex items-center gap-2 rounded-lg bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-900 transition-all hover:bg-slate-200"
                      onClick={() => addListItem('stats', { value: '', label: '' })}
                    >
                      <Plus size={16} /> Add Stat
                    </button>
                  </div>
                  <div className="grid gap-4 md:grid-cols-4">
                    {(draft.stats || []).map((stat, index) => (
                      <div
                        key={index}
                        className="rounded-lg border border-slate-200 bg-slate-50 p-5"
                      >
                        <Field label="Number / Value">
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

                <div
                  className="rounded-xl border border-slate-200 bg-white p-6 sm:p-8"
                  style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.05), 0 2px 8px rgba(0,0,0,0.04)' }}
                >
                  <div className="mb-6 flex items-center justify-between border-b border-slate-200 pb-6">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">Pillars</h3>
                      <p className="mt-1 text-sm text-slate-600">
                        Manage the foundation pillars displayed on the page
                      </p>
                    </div>
                    <button
                      type="button"
                      className="inline-flex items-center gap-2 rounded-lg bg-teal-500 px-4 py-2 font-semibold text-white transition-all hover:bg-teal-600"
                      onClick={addBlock}
                    >
                      <Plus size={16} /> Add Pillar
                    </button>
                  </div>
                  <div className="space-y-5">
                    {blocks.length === 0 ? (
                      <div className="rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
                        <p className="text-slate-600">
                          No pillars yet. Click "Add Pillar" to get started.
                        </p>
                      </div>
                    ) : (
                      blocks.map((block, index) => {
                        const IconComp = getIconComponent(block.metadata?.icon || 'sparkles')
                        return (
                          <NewItemCard
                            key={block.id || index}
                            id={block.id}
                            isNew={block.id === newItemId}
                            newItemRef={newItemRef}
                          >
                            <div className="mb-4 flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-100 font-bold text-teal-700 text-sm">
                                  {index + 1}
                                </div>
                                <div className="flex items-center gap-2">
                                  <IconComp size={16} className="text-teal-600" />
                                  <h3 className="font-semibold text-slate-900">
                                    {block.title || 'Untitled Pillar'}
                                  </h3>
                                </div>
                              </div>
                              <span className="text-xs font-semibold text-slate-500 uppercase">
                                Pillar {index + 1}
                              </span>
                            </div>
                            <div className="grid gap-4 md:grid-cols-1">
                              <Field label="Pillar Title">
                                <input
                                  className={formInput}
                                  value={block.title || ''}
                                  onChange={(e) => updateBlock(index, { title: e.target.value })}
                                  placeholder="e.g., Community Health"
                                />
                              </Field>
                              <div className="md:col-span-1">
                                <Field label="Icon">
                                  <IconPicker
                                    value={block.metadata?.icon || 'sparkles'}
                                    onChange={(v) => updateBlockMetadata(index, { icon: v })}
                                    allowedValues={FOUNDATION_ICONS}
                                  />
                                </Field>
                              </div>
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
                          </NewItemCard>
                        )
                      })
                    )}
                  </div>
                </div>
              </>
            )}

            {!isLeadership && !isFoundation && (
              <div
                className="rounded-xl border border-slate-200 bg-white p-6 sm:p-8"
                style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.05), 0 2px 8px rgba(0,0,0,0.04)' }}
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
                    <Plus size={16} /> Add {selectedSection.blockLabel || 'Card'}
                  </button>
                </div>

                <div className="space-y-5">
                  {blocks.length === 0 ? (
                    <div className="rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
                      <p className="text-slate-600">
                        No cards yet. Click "Add {selectedSection.blockLabel || 'Card'}" to get
                        started.
                      </p>
                    </div>
                  ) : (
                    blocks.map((block, index) => (
                      <NewItemCard
                        key={block.id || index}
                        id={block.id}
                        isNew={block.id === newItemId}
                        newItemRef={newItemRef}
                      >
                        <div className="mb-4 flex items-center justify-between">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-100 font-bold text-teal-700 text-sm">
                            {index + 1}
                          </div>
                          <span className="text-xs font-semibold text-slate-500 uppercase">
                            {selectedSection.blockLabel || 'Card'} {index + 1}
                          </span>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                          {isVision && (
                            <>
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
                            </>
                          )}

                          {isLiyana && (
                            <>
                              <Field label="Label">
                                <input
                                  className={formInput}
                                  value={block.eyebrow || ''}
                                  onChange={(e) => updateBlock(index, { eyebrow: e.target.value })}
                                  placeholder="e.g., 01"
                                />
                              </Field>
                              <Field label="Title">
                                <input
                                  className={formInput}
                                  value={block.title || ''}
                                  onChange={(e) => updateBlock(index, { title: e.target.value })}
                                  placeholder="Framework item title"
                                />
                              </Field>
                              <div className="md:col-span-2">
                                <Field
                                  label="Description"
                                  hint="Describe what this framework item covers"
                                >
                                  <textarea
                                    className={formInput}
                                    rows={3}
                                    value={stripHtml(
                                      block.body || block.metadata?.description || '',
                                    )}
                                    onChange={(e) => updateBlock(index, { body: e.target.value })}
                                    placeholder="Write a short description..."
                                  />
                                </Field>
                              </div>
                              <div className="md:col-span-2">
                                <Field
                                  label="Icon"
                                  hint="Choose an icon that best represents this item"
                                >
                                  <IconPicker
                                    value={block.metadata?.icon || 'sparkles'}
                                    onChange={(v) => updateBlockMetadata(index, { icon: v })}
                                  />
                                </Field>
                              </div>
                            </>
                          )}

                          {isRecognition && (
                            <>
                              <div className="md:col-span-2">
                                <Field label="Award Title">
                                  <input
                                    className={formInput}
                                    value={block.title || ''}
                                    onChange={(e) => updateBlock(index, { title: e.target.value })}
                                    placeholder="e.g., Healthcare Leader of the Year"
                                  />
                                </Field>
                              </div>
                              <div className="md:col-span-2">
                                <Field
                                  label="Description"
                                  hint="Describe what this award is for and why it was received"
                                >
                                  <textarea
                                    className={formInput}
                                    rows={3}
                                    value={stripHtml(
                                      block.body || block.metadata?.description || '',
                                    )}
                                    onChange={(e) => updateBlock(index, { body: e.target.value })}
                                    placeholder="Write a short description..."
                                  />
                                </Field>
                              </div>
                              <Field label="Awarding Organization" hint="e.g., WHO, African Union">
                                <input
                                  className={formInput}
                                  value={block.metadata?.organization || ''}
                                  onChange={(e) =>
                                    updateBlockMetadata(index, { organization: e.target.value })
                                  }
                                  placeholder="Organization name"
                                />
                              </Field>
                              <Field label="Year Received">
                                <input
                                  className={formInput}
                                  value={block.metadata?.year || ''}
                                  onChange={(e) =>
                                    updateBlockMetadata(index, { year: e.target.value })
                                  }
                                  placeholder="e.g., 2023"
                                />
                              </Field>
                              <div className="md:col-span-2">
                                <Field
                                  label="Category"
                                  hint="e.g., Innovation, Leadership, Community Impact"
                                >
                                  <input
                                    className={formInput}
                                    value={block.metadata?.category || ''}
                                    onChange={(e) =>
                                      updateBlockMetadata(index, { category: e.target.value })
                                    }
                                    placeholder="Award category"
                                  />
                                </Field>
                              </div>
                              <div className="md:col-span-2">
                                <Field
                                  label="Award Image / Badge"
                                  hint="Upload a logo or badge image for this award"
                                >
                                  <div className="flex gap-2">
                                    <input
                                      className={formInput}
                                      value={block.image_url || ''}
                                      onChange={(e) =>
                                        updateBlock(index, { image_url: e.target.value })
                                      }
                                      placeholder="https://..."
                                    />
                                    <label className="inline-flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-slate-200 bg-slate-100 text-slate-600 transition-all hover:bg-slate-200">
                                      <Upload size={18} />
                                      <input
                                        type="file"
                                        accept="image/*"
                                        className="sr-only"
                                        onChange={(e) =>
                                          updateBlockImage(index, e.target.files?.[0])
                                        }
                                      />
                                    </label>
                                  </div>
                                </Field>
                              </div>
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
                      </NewItemCard>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          <aside className="space-y-6">
            <div className="sticky top-8 space-y-6">
              <div
                className="rounded-xl border border-slate-200 bg-white p-6"
                style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.05), 0 2px 8px rgba(0,0,0,0.04)' }}
              >
                <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                  Live Preview
                </h3>
                {isVision && (
                  <div className="rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 px-4 py-6">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                      {draft.eyebrow || 'Section label'}
                    </p>
                    <h4 className="mt-3 text-lg font-bold leading-snug text-slate-900">
                      {draft.title || 'Headline line 1'}
                      <br />
                      {draft.title_highlight ? (
                        <span className="text-teal-600 not-italic">{draft.title_highlight}</span>
                      ) : (
                        <span className="text-slate-300">Teal highlighted text</span>
                      )}{' '}
                      <span>{draft.subtitle || ''}</span>
                    </h4>
                    {draft.image_url && (
                      <div className="mt-4 overflow-hidden rounded-lg border border-slate-200">
                        <img src={draft.image_url} alt="" className="h-32 w-full object-cover" />
                      </div>
                    )}
                  </div>
                )}
                {isLeadership && (
                  <div className="rounded-lg border border-slate-200 bg-gradient-to-br from-teal-900 to-teal-700 px-6 py-8 text-white">
                    <p className="mb-4 font-mono text-[9px] tracking-[0.3em] uppercase text-white/50">
                      {draft.eyebrow || 'Future Vision'}
                    </p>
                    <div className="mx-auto mb-6 h-px w-12 bg-white/20" />
                    <blockquote className="font-serif text-base italic font-light leading-relaxed text-white/85">
                      &ldquo;{draft.description || 'Your quote will appear here'}&rdquo;
                    </blockquote>
                    {draft.subtitle && <div className="mt-6 h-px w-16 bg-amber-400/40 mx-auto" />}
                    {draft.subtitle && (
                      <p className="mt-4 text-center text-xs font-semibold tracking-wider text-white/60">
                        — {draft.subtitle}
                      </p>
                    )}
                  </div>
                )}
                {isFoundation && (
                  <div className="rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 px-4 py-5">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                      {draft.eyebrow || 'Section label'}
                    </p>
                    <h4 className="mt-2 text-base font-bold text-slate-900">
                      {draft.title || 'Title'}
                    </h4>
                    {draft.description && (
                      <p className="mt-2 text-xs text-slate-600 line-clamp-3">
                        {draft.description}
                      </p>
                    )}
                  </div>
                )}
                {!isVision && !isLeadership && !isFoundation && (
                  <div className="rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 px-4 py-6">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                      {draft.eyebrow || 'Section label'}
                    </p>
                    <h4 className="mt-3 text-lg font-bold text-slate-900">
                      {draft.title || selectedSection.title}
                    </h4>
                    {draft.subtitle && (
                      <p className="mt-1 text-sm text-slate-500">{draft.subtitle}</p>
                    )}
                    {draft.image_url && (
                      <div className="mt-4 overflow-hidden rounded-lg border border-slate-200">
                        <img src={draft.image_url} alt="" className="h-28 w-full object-cover" />
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div className="rounded-xl border border-teal-100 bg-gradient-to-br from-teal-50 to-cyan-50 p-6">
                <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-teal-900">
                  <Sparkles size={16} /> Editing Guide
                </h3>
                <p className="text-sm leading-relaxed text-teal-800">{selectedSection.hint}</p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    )
  }

  return (
    <section className="mx-auto max-w-7xl">
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

      {selectedSection.type === 'timeline'
        ? renderTimelineEditor()
        : selectedSection.type === 'identities'
          ? renderIdentityEditor()
          : selectedSection.type === 'testimonials'
            ? renderTestimonialsEditor()
            : renderGenericEditor()}

      <Toast message={message} error={error} />
    </section>
  )
}
