import { useEffect, useRef, useState } from 'react'
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
import api from '../api' // your axios instance

// Static fallback data (used if API fails or is empty)
import { ecosystemTitle, ecosystemDescription, ecosystemNodes } from '@/data/ecosystem'

// --------------- Helpers ---------------
const formInput =
  'w-full rounded-xl border border-slate-200 bg-white/70 backdrop-blur px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/10 focus:bg-white shadow-sm hover:border-emerald-300 hover:shadow-md'

const labelClass = 'mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-600'

const Field = ({ label, children }) => (
  <label className="block">
    <span className={labelClass}>{label}</span>
    {children}
  </label>
)

const IconButton = ({ label, onClick, children, disabled, danger = false }) => (
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

const Toast = ({ message, error }) => {
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

// --------------- Default item factories ---------------
const emptyMetaStat = () => ({ value: '0', label: 'New Stat' })
const emptyNetworkSector = () => ({
  label: 'NEW',
  title: 'New Sector',
  description: '',
  metric: '',
  category: 'hospital',
})
const emptyBreakdownSector = () => ({
  num: '0X',
  category: 'New',
  title: '',
  description: '',
  stats: [''],
  image: null,
  accent: false,
})

// --------------- Reorder helper ---------------
const reorderArray = (arr, idx, dir) => {
  const next = [...arr]
  const target = idx + dir
  if (target < 0 || target >= next.length) return arr
  ;[next[idx], next[target]] = [next[target], next[idx]]
  return next
}

// --------------- Main Component ---------------
export default function EcosystemEditor() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  // Hero
  const [heroTag, setHeroTag] = useState('')
  const [heroTitle, setHeroTitle] = useState('')
  const [heroDescription, setHeroDescription] = useState('')
  const [heroMeta, setHeroMeta] = useState([])

  // Network Diagram (System Generated)
  const [networkTag, setNetworkTag] = useState('')
  const [networkTitle, setNetworkTitle] = useState('')
  const [networkDescription, setNetworkDescription] = useState('')
  const [networkSectors, setNetworkSectors] = useState([])

  // Vision Quote
  const [visionQuote, setVisionQuote] = useState('')
  const [visionAttribution, setVisionAttribution] = useState('')
  const [visionMarker, setVisionMarker] = useState('99')

  // Breakdown
  const [breakdownTag, setBreakdownTag] = useState('')
  const [breakdownTitle, setBreakdownTitle] = useState('')
  const [breakdownDescription, setBreakdownDescription] = useState('')
  const [breakdownSectors, setBreakdownSectors] = useState([])
  const [financingNum, setFinancingNum] = useState('06')
  const [financingCategory, setFinancingCategory] = useState('Financing')
  const [financingTitle, setFinancingTitle] = useState('')
  const [financingDescription, setFinancingDescription] = useState('')

  // Expand/collapse tracking
  const [expandedMeta, setExpandedMeta] = useState([])
  const [expandedNetwork, setExpandedNetwork] = useState([])
  const [expandedBreakdown, setExpandedBreakdown] = useState([])

  const newRef = useRef(null)
  const [focusId, setFocusId] = useState(null)

  // Focus helper
  useEffect(() => {
    if (focusId && newRef.current) {
      newRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
      const timer = setTimeout(() => {
        newRef.current?.querySelector('input, textarea')?.focus()
      }, 350)
      return () => clearTimeout(timer)
    }
    const reset = setTimeout(() => setFocusId(null), 2500)
    return () => clearTimeout(reset)
  }, [focusId])

  // --------------- Load data from API ---------------
  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const res = await api.get('/cms/sections/liyana_framework')
        const eco = res.data?.metadata?.ecosystem || {}

        // Hero
        setHeroTag(eco.hero?.tag || 'Strategic Infrastructure')
        setHeroTitle(
          eco.hero?.title || 'Most investors build one piece… He built the entire chain.',
        )
        setHeroDescription(eco.hero?.description || '')
        setHeroMeta(eco.hero?.meta || [])

        // Network
        const net = eco.network || {}
        setNetworkTag(net.hero?.tag || 'System Generated')
        setNetworkTitle(net.hero?.title || 'The Ecosystem Core')
        setNetworkDescription(net.hero?.description || '')
        setNetworkSectors(net.sectors || [])

        // Vision
        setVisionQuote(eco.vision?.quote || '')
        setVisionAttribution(eco.vision?.attribution || '')
        setVisionMarker(eco.vision?.marker || '99')

        // Breakdown
        const bd = eco.breakdown || {}
        setBreakdownTag(bd.tag || 'Sector Breakdown')
        setBreakdownTitle(bd.title || 'Six sectors. One vision.')
        setBreakdownDescription(bd.description || '')
        setBreakdownSectors(bd.sectors || [])
        setFinancingNum(bd.financing?.num || '06')
        setFinancingCategory(bd.financing?.category || 'Financing')
        setFinancingTitle(bd.financing?.title || '')
        setFinancingDescription(bd.financing?.description || '')
      } catch (err) {
        console.warn('Using default ecosystem data', err)
        loadDefaults()
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  // Hardcoded fallback
  const loadDefaults = () => {
    setHeroTag('Strategic Infrastructure')
    setHeroTitle('Most investors build one piece… He built the entire chain.')
    setHeroDescription(ecosystemDescription)
    setHeroMeta([
      { value: '6', label: 'Integrated Sectors' },
      { value: '1000+', label: 'Employees' },
      { value: '2010', label: 'Established' },
      { value: 'Pan-African', label: 'Reach' },
    ])
    setNetworkTag('System Generated')
    setNetworkTitle('The Ecosystem Core')
    setNetworkDescription(
      'Six interconnected sectors — each reinforcing the next — forming a single, self-sustaining healthcare chain.',
    )
    setNetworkSectors(
      ecosystemNodes.map((node) => ({
        label: node.name.toUpperCase(),
        title: node.name,
        description: node.description,
        metric: node.metrics?.[0] || '',
        category: node.category,
      })),
    )
    setVisionQuote(
      'Healthcare is not a service to be bought, but a system to be built. Only through complete vertical integration can we guarantee the quality of care and the dignity of the patient.',
    )
    setVisionAttribution('Dr. Girma Ababi, Founder')
    setVisionMarker('99')
    setBreakdownTag('Sector Breakdown')
    setBreakdownTitle('Six sectors. One vision.')
    setBreakdownDescription(
      'Every sector of Liyana Healthcare is designed to reinforce the others — creating a self-sustaining, vertically integrated system that delivers care from lab to bedside.',
    )
    setBreakdownSectors([
      {
        num: '01',
        category: 'Delivery',
        title: 'Yanct Chain of Hospitals',
        description:
          'A comprehensive network of tertiary care facilities providing specialized surgical, cardiac, and oncology services across East Africa.',
        stats: ['900+ Specialized Beds', 'Pan-African Medical Hub'],
        image: null,
        accent: false,
      },
      {
        num: '02',
        category: 'Education',
        title: 'YLC Health Sciences',
        description:
          'Training the next generation of medical specialists through rigorous academic programs and clinical rotation integration.',
        stats: ['Chief Pipeline Under Development'],
        image: null,
        accent: false,
      },
      {
        num: '03',
        category: 'Manufacturing',
        title: 'Pharma Production',
        description:
          'On-shore manufacturing of essential generic medications to ensure supply chain sovereignty and healthcare affordability.',
        stats: [],
        image: '/lab-connect.png',
        accent: false,
      },
      {
        num: '04',
        category: 'Research',
        title: 'Medical Research',
        description:
          'Genomic studies and epidemiological research focused on local populations, driving evidence-based regional care.',
        stats: ['Signal Active', 'Liyana Research v3.0'],
        image: null,
        accent: true,
      },
      {
        num: '05',
        category: 'Technology',
        title: 'Digital Platforms',
        description:
          'Unified EMR systems and telemedicine portals that connect rural clinics to urban specialists instantly.',
        stats: ['Normal Rate'],
        image: null,
        accent: false,
      },
    ])
    setFinancingNum('06')
    setFinancingCategory('Financing')
    setFinancingTitle('Micro-Financing & Insurance')
    setFinancingDescription(
      'Closing the loop by making healthcare accessible. Our financing wing provides innovative micro-insurance models tailored for the self-employed and informal sectors.',
    )
  }

  // --------------- Save handler ---------------
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
      setMessage('✨ Ecosystem saved successfully!')
      setTimeout(() => setMessage(''), 3000)
    } catch (err) {
      console.error(err)
      setError('Save failed. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="animate-spin text-emerald-500" size={32} />
        <p className="ml-3 text-slate-600">Loading Ecosystem...</p>
      </div>
    )
  }

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100/60">
      <div className="mx-auto max-w-7xl px-6 py-10">
        {/* Header */}
        <div className="mb-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-emerald-600 flex items-center gap-2">
              <Zap size={14} /> Ecosystem Editor
            </p>
            <h1 className="mt-3 text-4xl font-bold text-slate-900">Ecosystem</h1>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-6 py-3 font-semibold text-white transition-all hover:shadow-xl hover:shadow-emerald-500/30 active:scale-[0.98] disabled:opacity-50"
          >
            {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            <span>{saving ? 'Saving...' : 'Save All Changes'}</span>
          </button>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
          {/* Left: Editor Cards */}
          <div className="space-y-8">
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
                      setExpandedMeta((prev) => [...prev, heroMeta.length])
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
                      onClick={() => setHeroMeta((prev) => prev.filter((_, i) => i !== idx))}
                    >
                      <Trash2 size={14} />
                    </IconButton>
                  </div>
                ))}
              </div>
            </Card>

            {/* 2. Network Diagram (System Generated) */}
            <Card title="Network Diagram" description="'System Generated' section.">
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
                <p className="text-sm font-semibold text-slate-700">
                  Sectors ({networkSectors.length})
                </p>
                <button
                  onClick={() => {
                    const s = emptyNetworkSector()
                    setNetworkSectors((prev) => [...prev, s])
                    setExpandedNetwork((prev) => [...prev, networkSectors.length])
                    setFocusId(s.label)
                  }}
                  className="inline-flex items-center gap-1 rounded-lg bg-emerald-500 px-3 py-1.5 text-xs font-semibold text-white"
                >
                  <Plus size={14} /> Add Sector
                </button>
              </div>
              {networkSectors.map((sector, idx) => (
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
                  onDelete={() => {
                    setNetworkSectors((prev) => prev.filter((_, i) => i !== idx))
                    setExpandedNetwork((prev) => prev.filter((id) => id !== String(idx)))
                  }}
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
              ))}
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
                    setExpandedBreakdown((prev) => [...prev, breakdownSectors.length])
                    setFocusId(s.num)
                  }}
                  className="inline-flex items-center gap-1 rounded-lg bg-emerald-500 px-3 py-1.5 text-xs font-semibold text-white"
                >
                  <Plus size={14} /> Add Sector
                </button>
              </div>
              {breakdownSectors.map((sec, idx) => (
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
                  onDelete={() => {
                    setBreakdownSectors((prev) => prev.filter((_, i) => i !== idx))
                    setExpandedBreakdown((prev) => prev.filter((id) => id !== String(idx)))
                  }}
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
              ))}
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
          </div>

          {/* Right: Live Preview (simplified) */}
          <aside className="space-y-6">
            <div className="sticky top-8 space-y-6">
              <div className="rounded-2xl border border-slate-200 bg-white/80 backdrop-blur-md p-6 shadow-sm hover:shadow-lg transition-all">
                <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                  <Eye size={14} className="text-emerald-500" /> Live Preview
                </h3>
                <div className="rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-slate-900 min-h-[160px]">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                    ECOSYSTEM
                  </p>
                  <p className="mt-2 text-sm font-semibold text-slate-900">{heroTitle}</p>
                  <p className="mt-1 text-xs text-slate-600">{heroTag}</p>
                  <div className="mt-4 border-t border-slate-200 pt-3">
                    <p className="text-xs font-semibold text-slate-700">{networkTitle}</p>
                    <p className="text-[11px] text-slate-500">{networkSectors.length} sectors</p>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Vision: {visionQuote.slice(0, 60)}…
                    </p>
                    <p className="text-[11px] text-slate-500 mt-1">Breakdown: {breakdownTitle}</p>
                  </div>
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

// --------------- Reusable Card ---------------
function Card({ title, description, children }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white/80 backdrop-blur-sm p-6 sm:p-8 shadow-sm transition-all duration-300 hover:shadow-lg hover:border-emerald-300">
      <div className="mb-6 border-b border-slate-200 pb-6">
        <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
        {description && <p className="mt-2 text-sm text-slate-600">{description}</p>}
      </div>
      {children}
    </div>
  )
}

// --------------- Expandable Item ---------------
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
