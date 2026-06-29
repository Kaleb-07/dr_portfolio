/* eslint-disable @typescript-eslint/no-explicit-any, react-hooks/set-state-in-effect */
import { useEffect, useRef, useState } from 'react'
import api from '../api'
import ConfirmDialog from '../components/ConfirmDialog'
import {
  formInput,
  Field,
  EditorShell,
  Card,
  ExpandableItem,
  EmptyState,
  Overview,
  Stat,
  Program,
  Story,
  createStat,
  createProgram,
  createStory,
  reorderArray,
  iconOptions,
} from './ImpactShared'

export default function FoundationEditor() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [foundEyebrow, setFoundEyebrow] = useState('')
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
  const [foundHeroEyebrow, setFoundHeroEyebrow] = useState('')
const [foundHeroTitle, setFoundHeroTitle] = useState('Foundation & Community Impact')
const [foundHeroDescription, setFoundHeroDescription] = useState('Building healthier communities through strategic philanthropy.')
  
  // Sub‑section headings
  const [foundStatsEyebrow, setFoundStatsEyebrow] = useState('Stats')
  const [foundStatsTitle, setFoundStatsTitle] = useState('Our Impact in Numbers')
  const [foundProgramsEyebrow, setFoundProgramsEyebrow] = useState('Programs')
  const [foundProgramsTitle, setFoundProgramsTitle] = useState('Our programs')
  const [foundStoriesEyebrow, setFoundStoriesEyebrow] = useState('Stories')
  const [foundStoriesTitle, setFoundStoriesTitle] = useState('Real stories of change')
  const [foundVisionEyebrow, setFoundVisionEyebrow] = useState('Vision')
  const [foundMissionEyebrow, setFoundMissionEyebrow] = useState('Mission')
  const [foundQuoteEyebrow, setFoundQuoteEyebrow] = useState('')
  const [foundQuoteTitle, setFoundQuoteTitle] = useState('')

  const [expandedFoundStats, setExpandedFoundStats] = useState<string[]>([])
  const [expandedFoundPrograms, setExpandedFoundPrograms] = useState<string[]>([])
  const [expandedFoundStories, setExpandedFoundStories] = useState<string[]>([])
  const newRef = useRef<HTMLDivElement | null>(null)
  const [focusId, setFocusId] = useState<string | null>(null)
  const backupRef = useRef<any>(null)
  const [confirm, setConfirm] = useState<{
    open: boolean
    title?: string
    message?: string
    onConfirm?: () => void
  }>({ open: false })

  const askConfirm = (title: string, message: string, onConfirm: () => void) => {
    setConfirm({ open: true, title, message, onConfirm })
  }

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

  // Reset
  const resetAll = () => {
    setFoundEyebrow('')
    setFoundOverview({ title: '', subtitle: '', description: '', vision: '', mission: '' })
    setFoundStats([])
    setFoundPrograms([])
    setFoundStories([])
    setFoundVisionQuote('')
    setFoundStatsEyebrow('Stats')
    setFoundStatsTitle('Our Impact in Numbers')
    setFoundProgramsEyebrow('Programs')
    setFoundProgramsTitle('Our programs')
    setFoundStoriesEyebrow('Stories')
    setFoundStoriesTitle('Real stories of change')
    setFoundVisionEyebrow('Vision')
    setFoundMissionEyebrow('Mission')
    setExpandedFoundStats([])
    setExpandedFoundPrograms([])
    setExpandedFoundStories([])
    setFoundQuoteEyebrow('')
    setFoundQuoteTitle('')
    setFoundHeroEyebrow('')
setFoundHeroTitle('Foundation & Community Impact')
setFoundHeroDescription('Building healthier communities through strategic philanthropy.')
  }

  const applyData = (data: any) => {
    resetAll()
    if (!data || Object.keys(data).length === 0) return

    // Main hero
    setFoundEyebrow(data.eyebrow || '')
    if (data.overview) setFoundOverview(data.overview)

    // Sub‑section headings (with fallback defaults)
    setFoundStatsEyebrow(data.statsEyebrow || 'Stats')
    setFoundStatsTitle(data.statsTitle || 'Our Impact in Numbers')
    setFoundProgramsEyebrow(data.programsEyebrow || 'Programs')
    setFoundProgramsTitle(data.programsTitle || 'Our programs')
    setFoundStoriesEyebrow(data.storiesEyebrow || 'Stories')
    setFoundStoriesTitle(data.storiesTitle || 'Real stories of change')
    setFoundVisionEyebrow(data.visionEyebrow || 'Vision')
    setFoundMissionEyebrow(data.missionEyebrow || 'Mission')
    setFoundQuoteEyebrow(data.quoteEyebrow || '')
    setFoundQuoteTitle(data.quoteTitle || '')
setFoundHeroEyebrow(data.heroEyebrow || '')
setFoundHeroTitle(data.heroTitle || 'Foundation & Community Impact')
setFoundHeroDescription(data.heroDescription || 'Building healthier communities through strategic philanthropy.')

    // Arrays
    if (Array.isArray(data.stats)) setFoundStats(data.stats)
    if (Array.isArray(data.programs)) setFoundPrograms(data.programs)
    if (Array.isArray(data.impactStories)) setFoundStories(data.impactStories)
    if (data.futureVision) setFoundVisionQuote(data.futureVision)
  }

  const fetchData = async () => {
    const res = await api.get('/impact/foundation_story')
    const data = res.data || {}
    applyData(data)
    backupRef.current = { data: structuredClone(data) }
    return data
  }

  // Initial load
  useEffect(() => {
    let active = true
    const load = async () => {
      setLoading(true)
      setError('')
      try {
        if (active) await fetchData()
      } catch {
        if (active) setError('Could not load foundation data.')
      } finally {
        if (active) setLoading(false)
      }
    }
    load()
    return () => { active = false }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Undo
  const handleUndo = () => {
    if (!backupRef.current) return
    applyData(backupRef.current.data)
    setMessage('↩ Reverted to last saved version')
    setTimeout(() => setMessage(''), 3000)
  }

  // Save
  const saveAll = async () => {
    setSaving(true)
    setMessage('')
    setError('')
    try {
      const payload = {
        eyebrow: foundEyebrow,
        title: foundOverview.title,
        overview: foundOverview,
        statsEyebrow: foundStatsEyebrow,
        statsTitle: foundStatsTitle,
        stats: foundStats,
        programsEyebrow: foundProgramsEyebrow,
        programsTitle: foundProgramsTitle,
        programs: foundPrograms,
        storiesEyebrow: foundStoriesEyebrow,
        storiesTitle: foundStoriesTitle,
        impactStories: foundStories,
        visionEyebrow: foundVisionEyebrow,
        missionEyebrow: foundMissionEyebrow,
        futureVision: foundVisionQuote,
        quoteEyebrow: foundQuoteEyebrow,
quoteTitle: foundQuoteTitle,
heroEyebrow: foundHeroEyebrow,
heroTitle: foundHeroTitle,
heroDescription: foundHeroDescription,
      }
      await api.put('/impact/foundation_story', payload)
      await fetchData()
      setMessage('✨ Foundation saved successfully!')
      setTimeout(() => setMessage(''), 3000)
    } catch {
      setError('Save failed.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin text-emerald-500" />
        <p className="ml-3 text-slate-600">Loading Foundation...</p>
      </div>
    )
  }

  return (
    <>
      <EditorShell
        slug="foundation"
        saving={saving}
        onSave={saveAll}
        onUndo={handleUndo}
        message={message}
        error={error}
      >
        {/* ── Hero Banner ─────────────────────────────────────── */}
<Card title="Hero Banner" description="The banner at the top of the Foundation page.">
  <div className="grid gap-6 md:grid-cols-2">
    <Field label="Title">
      <input
        className={formInput}
        value={foundHeroTitle}
        onChange={(e) => setFoundHeroTitle(e.target.value)}
      />
    </Field>
    <div className="md:col-span-2">
      <Field label="Description">
        <textarea
          className={formInput}
          rows={4}
          value={foundHeroDescription}
          onChange={(e) => setFoundHeroDescription(e.target.value)}
        />
      </Field>
    </div>
  </div>
</Card>
        {/* ── Overview ─────────────────────────────────────── */}
        <Card title="Overview" description="Main title and description.">
          <div className="grid gap-6 md:grid-cols-2">
            <Field label="Eyebrow">
              <input
                className={formInput}
                value={foundEyebrow}
                onChange={(e) => setFoundEyebrow(e.target.value)}
              />
            </Field>
            <Field label="Title">
              <input
                className={formInput}
                value={foundOverview.title}
                onChange={(e) =>
                  setFoundOverview((p) => ({ ...p, title: e.target.value }))
                }
              />
            </Field>
            <Field label="Description">
              <textarea
                className={formInput}
                rows={4}
                value={foundOverview.description}
                onChange={(e) =>
                  setFoundOverview((p) => ({ ...p, description: e.target.value }))
                }
              />
            </Field>
          </div>
        </Card>

        {/* ── Stats ────────────────────────────────────────── */}
        <Card
          title={foundStatsTitle}
          description="Key numbers displayed on the page."
          onAdd={() => {
            const s = createStat()
            setFoundStats((prev) => [...prev, s])
            setExpandedFoundStats((prev) => [...prev, s.id])
            setFocusId(s.id)
          }}
        >
          <div className="grid gap-4 md:grid-cols-2 mb-6">
            <Field label="Section Eyebrow">
              <input
                className={formInput}
                value={foundStatsEyebrow}
                onChange={(e) => setFoundStatsEyebrow(e.target.value)}
              />
            </Field>
            <Field label="Section Title">
              <input
                className={formInput}
                value={foundStatsTitle}
                onChange={(e) => setFoundStatsTitle(e.target.value)}
              />
            </Field>
          </div>
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
                onDelete={() =>
                  askConfirm('Delete stat?', 'This cannot be undone.', () => {
                    setFoundStats((prev) => prev.filter((s) => s.id !== stat.id))
                    setExpandedFoundStats((prev) => prev.filter((id) => id !== stat.id))
                  })
                }
                upDisabled={idx === 0}
                downDisabled={idx === foundStats.length - 1}
              >
                <Field label="Label">
                  <input
                    className={formInput}
                    value={stat.label}
                    onChange={(e) =>
                      setFoundStats((prev) =>
                        prev.map((s) =>
                          s.id === stat.id ? { ...s, label: e.target.value } : s,
                        ),
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
                        prev.map((s) =>
                          s.id === stat.id ? { ...s, value: e.target.value } : s,
                        ),
                      )
                    }
                  />
                </Field>
              </ExpandableItem>
            ))
          )}
        </Card>

        {/* ── Vision & Mission ─────────────────────────────── */}
        <Card title="Vision & Mission" description="Core statements.">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="border-l-2 border-teal pl-4">
              <Field label="Eyebrow">
                <input
                  className={formInput}
                  value={foundVisionEyebrow}
                  onChange={(e) => setFoundVisionEyebrow(e.target.value)}
                />
              </Field>
              <Field label="Vision">
                <textarea
                  className={formInput}
                  rows={4}
                  value={foundOverview.vision}
                  onChange={(e) =>
                    setFoundOverview((p) => ({ ...p, vision: e.target.value }))
                  }
                />
              </Field>
            </div>
            <div className="border-l-2 border-gold pl-4">
              <Field label="Eyebrow">
                <input
                  className={formInput}
                  value={foundMissionEyebrow}
                  onChange={(e) => setFoundMissionEyebrow(e.target.value)}
                />
              </Field>
              <Field label="Mission">
                <textarea
                  className={formInput}
                  rows={4}
                  value={foundOverview.mission}
                  onChange={(e) =>
                    setFoundOverview((p) => ({ ...p, mission: e.target.value }))
                  }
                />
              </Field>
            </div>
          </div>
        </Card>

        {/* ── Programs ─────────────────────────────────────── */}
        <Card
          title={foundProgramsTitle}
          description="Foundation programs and initiatives."
          onAdd={() => {
            const p = createProgram()
            setFoundPrograms((prev) => [...prev, p])
            setExpandedFoundPrograms((prev) => [...prev, p.id])
            setFocusId(p.id)
          }}
        >
          <div className="grid gap-4 md:grid-cols-2 mb-6">
            <Field label="Section Eyebrow">
              <input
                className={formInput}
                value={foundProgramsEyebrow}
                onChange={(e) => setFoundProgramsEyebrow(e.target.value)}
              />
            </Field>
            <Field label="Section Title">
              <input
                className={formInput}
                value={foundProgramsTitle}
                onChange={(e) => setFoundProgramsTitle(e.target.value)}
              />
            </Field>
          </div>
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
                onDelete={() =>
                  askConfirm('Delete program?', 'This cannot be undone.', () => {
                    setFoundPrograms((prev) => prev.filter((p) => p.id !== prog.id))
                    setExpandedFoundPrograms((prev) => prev.filter((id) => id !== prog.id))
                  })
                }
                upDisabled={idx === 0}
                downDisabled={idx === foundPrograms.length - 1}
              >
                <Field label="Title">
                  <input
                    className={formInput}
                    value={prog.title}
                    onChange={(e) =>
                      setFoundPrograms((prev) =>
                        prev.map((p) =>
                          p.id === prog.id ? { ...p, title: e.target.value } : p,
                        ),
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
                        prev.map((p) =>
                          p.id === prog.id ? { ...p, status: e.target.value } : p,
                        ),
                      )
                    }
                  >
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                    <option value="planned">Planned</option>
                  </select>
                </Field>
                <Field label="Icon">
                  <select
                    className={formInput}
                    value={prog.icon}
                    onChange={(e) =>
                      setFoundPrograms((prev) =>
                        prev.map((p) =>
                          p.id === prog.id ? { ...p, icon: e.target.value } : p,
                        ),
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

        {/* ── Stories ──────────────────────────────────────── */}
        <Card
          title={foundStoriesTitle}
          description="Real stories of change and impact."
          onAdd={() => {
            const s = createStory()
            setFoundStories((prev) => [...prev, s])
            setExpandedFoundStories((prev) => [...prev, s.id])
            setFocusId(s.id)
          }}
        >
          <div className="grid gap-4 md:grid-cols-2 mb-6">
            <Field label="Section Eyebrow">
              <input
                className={formInput}
                value={foundStoriesEyebrow}
                onChange={(e) => setFoundStoriesEyebrow(e.target.value)}
              />
            </Field>
            <Field label="Section Title">
              <input
                className={formInput}
                value={foundStoriesTitle}
                onChange={(e) => setFoundStoriesTitle(e.target.value)}
              />
            </Field>
          </div>
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
                onDelete={() =>
                  askConfirm('Delete story?', 'This cannot be undone.', () => {
                    setFoundStories((prev) => prev.filter((s) => s.id !== story.id))
                    setExpandedFoundStories((prev) => prev.filter((id) => id !== story.id))
                  })
                }
                upDisabled={idx === 0}
                downDisabled={idx === foundStories.length - 1}
              >
                <Field label="Title">
                  <input
                    className={formInput}
                    value={story.title}
                    onChange={(e) =>
                      setFoundStories((prev) =>
                        prev.map((s) =>
                          s.id === story.id ? { ...s, title: e.target.value } : s,
                        ),
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
  <div className="grid gap-4 md:grid-cols-2 mb-6">
    <Field label="Section Eyebrow">
      <input
        className={formInput}
        value={foundQuoteEyebrow}
        onChange={(e) => setFoundQuoteEyebrow(e.target.value)}
      />
    </Field>
    <Field label="Section Title">
      <input
        className={formInput}
        value={foundQuoteTitle}
        onChange={(e) => setFoundQuoteTitle(e.target.value)}
      />
    </Field>
  </div>
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