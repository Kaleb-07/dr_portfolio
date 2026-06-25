import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import {
  Loader2,
  Save,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  Zap,
  Sparkles,
  Eye,
} from 'lucide-react'
import api from '../api' // ensure this points to your axios instance

// Real data imports (adjust paths to match your project)
import {
  foundationOverview,
  programs as foundationPrograms,
  impactStories as foundationStories,
  futureVision,
} from '@/data/foundation'
import { leadershipRoles } from '@/data/leadership'
import { publicServiceRoles } from '@/data/public-service'

// --------------- Helpers (unchanged) ---------------
const formInput =
  'w-full rounded-xl border border-slate-200 bg-white/70 backdrop-blur px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/10 focus:bg-white shadow-sm hover:border-emerald-300 hover:shadow-md'

const labelClass = 'mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-600'

const Field = ({ label, children, hint }) => (
  <label className="block">
    <span className={labelClass}>{label}</span>
    {children}
    {hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
  </label>
)

const IconButton = ({ label, onClick, children, disabled, danger = false }) => (
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

const Toast = ({ message, error }) => {
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

// --------------- Icon options for frontend ---------------
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

// --------------- Default item factories ---------------
const createStat = () => ({
  id: `stat-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
  label: 'New Stat',
  value: '0',
})
const createProgram = () => ({
  id: `prog-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
  title: 'New Program',
  description: '',
  impact: '',
  beneficiaries: '',
  status: 'active',
  icon: 'FaHeartbeat',
})
const createStory = () => ({
  id: `story-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
  title: 'New Story',
  description: '',
  beneficiary: '',
})
const createRole = (category = 'board') => ({
  id: `role-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
  title: 'New Role',
  organization: '',
  period: '',
  description: '',
  highlights: '',
  category,
  icon: 'FaBuilding',
})
const createEducation = () => ({
  id: `edu-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
  degree: 'New Degree',
  institution: '',
  footer: '',
  highlight: false,
})
const createFoundationItem = () => ({
  id: `found-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
  title: 'New Item',
  description: '',
  icon: 'FaHandshake',
})

// --------------- Reorder helper ---------------
const reorderArray = (arr, idx, dir) => {
  const next = [...arr]
  const target = idx + dir
  if (target < 0 || target >= next.length) return arr
  ;[next[idx], next[target]] = [next[target], next[idx]]
  return next
}

const mergeDefined = (base, patch) =>
  Object.entries(patch || {}).reduce(
    (acc, [key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        acc[key] = value
      }
      return acc
    },
    { ...base },
  )

// --------------- Main Component ---------------
export default function ImpactEditor() {
  const { slug } = useParams()

  // Shared state
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  // Foundation
  const [foundOverview, setFoundOverview] = useState({
    title: '',
    description: '',
    vision: '',
    mission: '',
  })
  const [foundStats, setFoundStats] = useState([])
  const [foundPrograms, setFoundPrograms] = useState([])
  const [foundStories, setFoundStories] = useState([])
  const [foundVisionQuote, setFoundVisionQuote] = useState('')

  // Leadership
  const [leadOverview, setLeadOverview] = useState({
    title: 'Leadership & Impact',
    subtitle: 'Executive leadership spanning healthcare organizations, boards, and institutions.',
    description: '',
  })
  const [executiveRoles, setExecutiveRoles] = useState([])
  const [governanceRoles, setGovernanceRoles] = useState([])

  // Public Service
  const [pubOverview, setPubOverview] = useState({
    title: 'Public Service',
    subtitle: 'National & Continental Leadership',
    description: '',
  })
  const [pubQuickFacts, setPubQuickFacts] = useState([])
  const [pubRoles, setPubRoles] = useState([])
  const [pubEducation, setPubEducation] = useState([])
  const [pubFoundationItems, setPubFoundationItems] = useState([])

  // Expand/collapse tracking
  const [expandedFoundStats, setExpandedFoundStats] = useState([])
  const [expandedFoundPrograms, setExpandedFoundPrograms] = useState([])
  const [expandedFoundStories, setExpandedFoundStories] = useState([])
  const [expandedExecRoles, setExpandedExecRoles] = useState([])
  const [expandedGovRoles, setExpandedGovRoles] = useState([])
  const [expandedPubRoles, setExpandedPubRoles] = useState([])
  const [expandedPubEducation, setExpandedPubEducation] = useState([])
  const [expandedPubFoundation, setExpandedPubFoundation] = useState([])

  // New item focus
  const newRef = useRef(null)
  const [focusId, setFocusId] = useState(null)

  useEffect(() => {
    if (focusId && newRef.current) {
      newRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
      const timer = setTimeout(() => {
        const firstInput = newRef.current?.querySelector('input, textarea')
        firstInput?.focus()
      }, 350)
      const reset = setTimeout(() => setFocusId(null), 2500)
      return () => {
        clearTimeout(timer)
        clearTimeout(reset)
      }
    }
  }, [focusId])

  // --------------- Load data from API ---------------
  const loadData = async (slug) => {
    setLoading(true)
    setError('')
    try {
      const apiSlug = slug === 'foundation' ? 'foundation_story' : slug
      console.log('[ImpactEditor] GET /impact/:slug', { slug: apiSlug })
      const res = await api.get(`/impact/${apiSlug}`)
      const data = res.data || {}
      console.log('[ImpactEditor] GET response', { slug: apiSlug, data })
      if (data && Object.keys(data).length > 0) {
        applySectionData(slug, data)
        return
      }
      loadDefaultData(slug)
    } catch (err) {
      console.error('Failed to load section, using defaults:', err)
      loadDefaultData(slug)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData(slug)
  }, [slug])

  // --------------- Apply data from API ---------------
  const applySectionData = (slug, data) => {
    loadDefaultData(slug)
    switch (slug) {
      case 'foundation':
        setFoundOverview((prev) => mergeDefined(prev, data.overview))
        if (Array.isArray(data.stats) && data.stats.length > 0) setFoundStats(data.stats)
        if (Array.isArray(data.programs) && data.programs.length > 0) setFoundPrograms(data.programs)
        if (Array.isArray(data.impactStories) && data.impactStories.length > 0)
          setFoundStories(data.impactStories)
        if (data.futureVision) setFoundVisionQuote(data.futureVision)
        break
      case 'leadership':
        setLeadOverview((prev) => mergeDefined(prev, data.overview))
        if (Array.isArray(data.executiveRoles) && data.executiveRoles.length > 0)
          setExecutiveRoles(data.executiveRoles)
        if (Array.isArray(data.governanceRoles) && data.governanceRoles.length > 0)
          setGovernanceRoles(data.governanceRoles)
        break
      case 'public-service':
        setPubOverview((prev) => mergeDefined(prev, data.overview))
        if (Array.isArray(data.quickFacts) && data.quickFacts.length > 0)
          setPubQuickFacts(data.quickFacts)
        if (Array.isArray(data.roles) && data.roles.length > 0) setPubRoles(data.roles)
        if (Array.isArray(data.education) && data.education.length > 0) setPubEducation(data.education)
        if (Array.isArray(data.foundationItems) && data.foundationItems.length > 0)
          setPubFoundationItems(data.foundationItems)
        break
      default:
        break
    }
  }

  // --------------- Load defaults from imported data ---------------
  const loadDefaultData = (slug) => {
    switch (slug) {
      case 'foundation':
        setFoundOverview({
          title: foundationOverview.title,
          description: foundationOverview.description,
          vision: foundationOverview.vision,
          mission: foundationOverview.mission,
        })
        setFoundStats([
          { id: 'stat-1', label: 'Impact Pillars', value: '5+' },
          { id: 'stat-2', label: 'Board Chairmanships', value: '4' },
          { id: 'stat-3', label: 'CSO Board Chair', value: '1' },
          { id: 'stat-4', label: 'Lives Impacted', value: '1000+' },
        ])
        setFoundPrograms(foundationPrograms.map((p) => ({ ...p, icon: p.icon || 'FaHeartbeat' })))
        setFoundStories(foundationStories)
        setFoundVisionQuote(futureVision)
        break
      case 'leadership':
        setLeadOverview({
          title: 'Leadership & Impact',
          subtitle: '',
          description: '',
        })
        setExecutiveRoles(
          leadershipRoles
            .filter((r) => r.category === 'executive' || r.category === 'founder')
            .map((r) => ({
              ...r,
              highlights: Array.isArray(r.highlights) ? r.highlights.join('\n') : r.highlights,
              icon: r.icon || 'FaBuilding',
            })),
        )
        setGovernanceRoles(
          leadershipRoles
            .filter((r) => r.category === 'board' || r.category === 'advisory')
            .map((r) => ({
              ...r,
              highlights: Array.isArray(r.highlights) ? r.highlights.join('\n') : r.highlights,
              icon: r.icon || 'FaBuilding',
            })),
        )
        break
      case 'public-service':
        setPubOverview({
          title: 'Public Service & Policy Impact',
          subtitle: '',
          description:
            'Dr. Girma Ababi serves the nation through advisory roles, federation leadership, and innovation boards — shaping healthcare at the highest levels.',
        })
        setPubQuickFacts([
          { label: 'VP, Ethiopian Healthcare Federation', value: '2023 – Present' },
          { label: 'Ministry of Health Advisory Roles', value: '4 Positions' },
          { label: 'Policy & Innovation Boards', value: 'Ongoing' },
        ])
        setPubRoles(
          publicServiceRoles.map((r) => ({
            ...r,
            highlights: Array.isArray(r.highlights) ? r.highlights.join('\n') : r.highlights,
            icon: r.icon || 'FaBuilding',
          })),
        )
        setPubEducation([
          {
            id: 'edu-md',
            degree: 'Doctor of Medicine',
            institution: 'University of Gondar / Addis Ababa University',
            footer: 'Distinction in Clinical Practice',
            highlight: false,
          },
          {
            id: 'edu-pathology',
            degree: 'Pathology Specialty',
            institution: 'Advanced diagnostic systems and laboratory management integration.',
            footer: 'Specialized Fellowship',
            highlight: false,
          },
          {
            id: 'edu-stanford',
            degree: 'Stanford GSB Seed',
            institution: 'Strategic Management and Innovation program for high-growth enterprises.',
            footer: 'Executive Leadership',
            highlight: true,
          },
        ])
        setPubFoundationItems([
          {
            id: 'found-outreach',
            title: 'Community Outreach',
            description: 'Mobile screening units bringing diagnostics to remote regions.',
            icon: 'FaMapMarkerAlt',
          },
          {
            id: 'found-education',
            title: 'Education Access',
            description: 'Scholarship funds for aspiring medical technicians and clinical staff.',
            icon: 'FaBookOpen',
          },
          {
            id: 'found-advocacy',
            title: 'Policy Advocacy',
            description: 'Empowering patient rights and standardizing care ethics.',
            icon: 'FaUsers',
          },
        ])
        break
      default:
        break
    }
  }

  // --------------- Save handler (calls API) ---------------
  const saveAll = async () => {
    setSaving(true)
    setMessage('')
    setError('')
    try {
      let payload = {}
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
      console.log('[ImpactEditor] PUT /impact/:slug', { slug: apiSlug, payload })
      const response = await api.put(`/impact/${apiSlug}`, payload)
      console.log('[ImpactEditor] PUT response', { slug: apiSlug, response: response.data })
      await loadData(slug)
      setMessage(`Saved ${slug.replace(/-/g, ' ')} to the database.`)
    } catch (err) {
      console.error('Save failed:', err)
      setError('Save failed. Please check console or network tab.')
    } finally {
      setSaving(false)
    }
  }

  // --------------- Toggle expand ---------------
  const toggle = (id, list, setList) =>
    setList((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]))

  // --------------- Render ---------------
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100/60">
        <Loader2 size={32} className="animate-spin text-emerald-500" />
        <p className="ml-3 text-sm text-slate-600">Loading {slug}...</p>
      </div>
    )
  }

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
                onChange={(e) => setFoundOverview((prev) => ({ ...prev, title: e.target.value }))}
              />
            </Field>
            <Field label="Description">
              <textarea
                className={formInput}
                rows={4}
                value={foundOverview.description}
                onChange={(e) =>
                  setFoundOverview((prev) => ({ ...prev, description: e.target.value }))
                }
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
                  onChange={(e) =>
                    setFoundOverview((prev) => ({ ...prev, vision: e.target.value }))
                  }
                />
              </Field>
            </div>
            <div className="border-l-2 border-gold pl-4">
              <Field label="Mission">
                <textarea
                  className={formInput}
                  rows={4}
                  value={foundOverview.mission}
                  onChange={(e) =>
                    setFoundOverview((prev) => ({ ...prev, mission: e.target.value }))
                  }
                />
              </Field>
            </div>
          </div>
        </Card>

        {/* Stats */}
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

        {/* Programs */}
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
              <ProgramExpandableItem
                key={prog.id}
                prog={prog}
                idx={idx}
                expanded={expandedFoundPrograms}
                setExpanded={setExpandedFoundPrograms}
                isFocused={prog.id === focusId}
                refProp={newRef}
                onUpdate={(updated) =>
                  setFoundPrograms((prev) => prev.map((p) => (p.id === prog.id ? updated : p)))
                }
                onUp={() => setFoundPrograms((prev) => reorderArray(prev, idx, -1))}
                onDown={() => setFoundPrograms((prev) => reorderArray(prev, idx, 1))}
                onDelete={() => {
                  setFoundPrograms((prev) => prev.filter((p) => p.id !== prog.id))
                  setExpandedFoundPrograms((prev) => prev.filter((id) => id !== prog.id))
                }}
                upDisabled={idx === 0}
                downDisabled={idx === foundPrograms.length - 1}
              />
            ))
          )}
        </Card>

        {/* Impact Stories */}
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

        {/* Future Vision Quote */}
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
        <Card title="Hero Section" description="Title and subtitle for the Leadership page.">
          <Field label="Title">
            <input
              className={formInput}
              value={leadOverview.title}
              onChange={(e) => setLeadOverview((prev) => ({ ...prev, title: e.target.value }))}
            />
          </Field>
          <Field label="Subtitle">
            <input
              className={formInput}
              value={leadOverview.subtitle}
              onChange={(e) => setLeadOverview((prev) => ({ ...prev, subtitle: e.target.value }))}
            />
          </Field>
          <Field label="Description">
            <textarea
              className={formInput}
              rows={3}
              value={leadOverview.description}
              onChange={(e) =>
                setLeadOverview((prev) => ({ ...prev, description: e.target.value }))
              }
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
              <RoleExpandableItem
                key={role.id}
                role={role}
                idx={idx}
                expanded={expandedExecRoles}
                setExpanded={setExpandedExecRoles}
                categories={['executive', 'founder']}
                isFocused={role.id === focusId}
                refProp={newRef}
                onUpdate={(updated) =>
                  setExecutiveRoles((prev) => prev.map((r) => (r.id === role.id ? updated : r)))
                }
                onUp={() => setExecutiveRoles((prev) => reorderArray(prev, idx, -1))}
                onDown={() => setExecutiveRoles((prev) => reorderArray(prev, idx, 1))}
                onDelete={() => {
                  setExecutiveRoles((prev) => prev.filter((r) => r.id !== role.id))
                  setExpandedExecRoles((prev) => prev.filter((id) => id !== role.id))
                }}
                upDisabled={idx === 0}
                downDisabled={idx === executiveRoles.length - 1}
              />
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
              <RoleExpandableItem
                key={role.id}
                role={role}
                idx={idx}
                expanded={expandedGovRoles}
                setExpanded={setExpandedGovRoles}
                categories={['board', 'advisory']}
                isFocused={role.id === focusId}
                refProp={newRef}
                onUpdate={(updated) =>
                  setGovernanceRoles((prev) => prev.map((r) => (r.id === role.id ? updated : r)))
                }
                onUp={() => setGovernanceRoles((prev) => reorderArray(prev, idx, -1))}
                onDown={() => setGovernanceRoles((prev) => reorderArray(prev, idx, 1))}
                onDelete={() => {
                  setGovernanceRoles((prev) => prev.filter((r) => r.id !== role.id))
                  setExpandedGovRoles((prev) => prev.filter((id) => id !== role.id))
                }}
                upDisabled={idx === 0}
                downDisabled={idx === governanceRoles.length - 1}
              />
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
                onChange={(e) => setPubOverview((prev) => ({ ...prev, title: e.target.value }))}
              />
            </Field>
            <Field label="Subtitle">
              <input
                className={formInput}
                value={pubOverview.subtitle}
                onChange={(e) => setPubOverview((prev) => ({ ...prev, subtitle: e.target.value }))}
              />
            </Field>
            <div className="md:col-span-2">
              <Field label="Description">
                <textarea
                  className={formInput}
                  rows={4}
                  value={pubOverview.description}
                  onChange={(e) =>
                    setPubOverview((prev) => ({ ...prev, description: e.target.value }))
                  }
                />
              </Field>
            </div>
          </div>
        </Card>

        <Card
          title="Hero Quick Facts"
          description="Three summary facts displayed under the hero copy."
          onAdd={() => {
            const fact = { id: `fact-${Date.now()}`, label: 'New Fact', value: '' }
            setPubQuickFacts((prev) => [...prev, fact])
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
                onDelete={() => setPubQuickFacts((prev) => prev.filter((f) => f.id !== fact.id))}
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
          title="Policy & Leadership"
          description="Advisory, federation, innovation, and policy roles."
          onAdd={() => {
            const r = createRole('policy')
            setPubRoles((prev) => [...prev, r])
            setExpandedPubRoles((prev) => [...prev, r.id])
            setFocusId(r.id)
          }}
        >
          {pubRoles.length === 0 ? (
            <EmptyState message="No roles." />
          ) : (
            pubRoles.map((role, idx) => (
              <RoleExpandableItem
                key={role.id}
                role={role}
                idx={idx}
                expanded={expandedPubRoles}
                setExpanded={setExpandedPubRoles}
                categories={['advisory', 'federation', 'innovation', 'policy']}
                isFocused={role.id === focusId}
                refProp={newRef}
                onUpdate={(updated) =>
                  setPubRoles((prev) => prev.map((r) => (r.id === role.id ? updated : r)))
                }
                onUp={() => setPubRoles((prev) => reorderArray(prev, idx, -1))}
                onDown={() => setPubRoles((prev) => reorderArray(prev, idx, 1))}
                onDelete={() => {
                  setPubRoles((prev) => prev.filter((r) => r.id !== role.id))
                  setExpandedPubRoles((prev) => prev.filter((id) => id !== role.id))
                }}
                upDisabled={idx === 0}
                downDisabled={idx === pubRoles.length - 1}
              />
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
              <FoundationItemExpandableItem
                key={item.id}
                item={item}
                idx={idx}
                expanded={expandedPubFoundation}
                setExpanded={setExpandedPubFoundation}
                isFocused={item.id === focusId}
                refProp={newRef}
                onUpdate={(updated) =>
                  setPubFoundationItems((prev) => prev.map((i) => (i.id === item.id ? updated : i)))
                }
                onUp={() => setPubFoundationItems((prev) => reorderArray(prev, idx, -1))}
                onDown={() => setPubFoundationItems((prev) => reorderArray(prev, idx, 1))}
                onDelete={() => {
                  setPubFoundationItems((prev) => prev.filter((i) => i.id !== item.id))
                  setExpandedPubFoundation((prev) => prev.filter((id) => id !== item.id))
                }}
                upDisabled={idx === 0}
                downDisabled={idx === pubFoundationItems.length - 1}
              />
            ))
          )}
        </Card>
      </EditorShell>
    )
  }

  // Fallback for unknown slugs
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100/60">
      <p className="text-lg text-slate-600">
        Editor for <strong>{slug?.replace(/-/g, ' ')}</strong> not available.
      </p>
    </div>
  )
}

// --------------- Reusable sub‑components (unchanged) ---------------
function EditorShell({ slug, saving, onSave, message, error, children }) {
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
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-6 py-3 font-semibold text-white transition-all hover:shadow-xl hover:shadow-emerald-500/30 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
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
                <div className="rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-4 py-6">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    {slug} page
                  </p>
                  <p className="mt-2 text-sm text-slate-600">Saves directly to the database.</p>
                </div>
              </div>
              <div className="rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-emerald-100 p-6">
                <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-emerald-900">
                  <Sparkles size={16} className="text-emerald-600" /> Editing Guide
                </h3>
                <p className="text-sm leading-relaxed text-emerald-800">
                  Click <strong>Save All Changes</strong> to persist your edits to the server.
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

function Card({ title, description, onAdd, children }) {
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

function RoleExpandableItem({
  role,
  idx,
  expanded,
  setExpanded,
  categories,
  onUpdate,
  onUp,
  onDown,
  onDelete,
  upDisabled,
  downDisabled,
  isFocused,
  refProp,
}) {
  return (
    <ExpandableItem
      item={role}
      idx={idx}
      expanded={expanded}
      setExpanded={setExpanded}
      headerLabel={role.category}
      headerValue={role.title}
      isFocused={isFocused}
      refProp={refProp}
      onUp={onUp}
      onDown={onDown}
      onDelete={onDelete}
      upDisabled={upDisabled}
      downDisabled={downDisabled}
    >
      <Field label="Title">
        <input
          className={formInput}
          value={role.title}
          onChange={(e) => onUpdate({ ...role, title: e.target.value })}
        />
      </Field>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Organization">
          <input
            className={formInput}
            value={role.organization}
            onChange={(e) => onUpdate({ ...role, organization: e.target.value })}
          />
        </Field>
        <Field label="Period">
          <input
            className={formInput}
            value={role.period}
            onChange={(e) => onUpdate({ ...role, period: e.target.value })}
          />
        </Field>
      </div>
      <Field label="Description">
        <textarea
          className={formInput}
          rows={4}
          value={role.description}
          onChange={(e) => onUpdate({ ...role, description: e.target.value })}
        />
      </Field>
      <Field label="Highlights (one per line)">
        <textarea
          className={formInput}
          rows={3}
          value={role.highlights}
          onChange={(e) => onUpdate({ ...role, highlights: e.target.value })}
        />
      </Field>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Category">
          <select
            className={formInput}
            value={role.category}
            onChange={(e) => onUpdate({ ...role, category: e.target.value })}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Icon (react-icons/fa)">
          <select
            className={formInput}
            value={role.icon || 'FaBuilding'}
            onChange={(e) => onUpdate({ ...role, icon: e.target.value })}
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
  )
}

function ProgramExpandableItem({
  prog,
  idx,
  expanded,
  setExpanded,
  isFocused,
  refProp,
  onUpdate,
  onUp,
  onDown,
  onDelete,
  upDisabled,
  downDisabled,
}) {
  return (
    <ExpandableItem
      item={prog}
      idx={idx}
      expanded={expanded}
      setExpanded={setExpanded}
      headerLabel="Program"
      headerValue={prog.title}
      isFocused={isFocused}
      refProp={refProp}
      onUp={onUp}
      onDown={onDown}
      onDelete={onDelete}
      upDisabled={upDisabled}
      downDisabled={downDisabled}
    >
      <Field label="Title">
        <input
          className={formInput}
          value={prog.title}
          onChange={(e) => onUpdate({ ...prog, title: e.target.value })}
        />
      </Field>
      <Field label="Description">
        <textarea
          className={formInput}
          rows={4}
          value={prog.description}
          onChange={(e) => onUpdate({ ...prog, description: e.target.value })}
        />
      </Field>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Impact">
          <input
            className={formInput}
            value={prog.impact}
            onChange={(e) => onUpdate({ ...prog, impact: e.target.value })}
          />
        </Field>
        <Field label="Beneficiaries">
          <input
            className={formInput}
            value={prog.beneficiaries}
            onChange={(e) => onUpdate({ ...prog, beneficiaries: e.target.value })}
          />
        </Field>
      </div>
      <Field label="Status">
        <select
          className={formInput}
          value={prog.status}
          onChange={(e) => onUpdate({ ...prog, status: e.target.value })}
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
          onChange={(e) => onUpdate({ ...prog, icon: e.target.value })}
        >
          {iconOptions.map((icon) => (
            <option key={icon} value={icon}>
              {icon}
            </option>
          ))}
        </select>
      </Field>
    </ExpandableItem>
  )
}

function FoundationItemExpandableItem({
  item,
  idx,
  expanded,
  setExpanded,
  isFocused,
  refProp,
  onUpdate,
  onUp,
  onDown,
  onDelete,
  upDisabled,
  downDisabled,
}) {
  return (
    <ExpandableItem
      item={item}
      idx={idx}
      expanded={expanded}
      setExpanded={setExpanded}
      headerLabel="Item"
      headerValue={item.title}
      isFocused={isFocused}
      refProp={refProp}
      onUp={onUp}
      onDown={onDown}
      onDelete={onDelete}
      upDisabled={upDisabled}
      downDisabled={downDisabled}
    >
      <Field label="Title">
        <input
          className={formInput}
          value={item.title}
          onChange={(e) => onUpdate({ ...item, title: e.target.value })}
        />
      </Field>
      <Field label="Description">
        <textarea
          className={formInput}
          rows={3}
          value={item.description}
          onChange={(e) => onUpdate({ ...item, description: e.target.value })}
        />
      </Field>
      <Field label="Icon (react-icons/fa)">
        <select
          className={formInput}
          value={item.icon || 'FaHandshake'}
          onChange={(e) => onUpdate({ ...item, icon: e.target.value })}
        >
          {iconOptions.map((icon) => (
            <option key={icon} value={icon}>
              {icon}
            </option>
          ))}
        </select>
      </Field>
    </ExpandableItem>
  )
}

function EmptyState({ message }) {
  return (
    <div className="rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center hover:border-emerald-300 hover:bg-emerald-50 transition-all">
      <p className="text-slate-600">{message}</p>
    </div>
  )
}
