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
  Role,
  Education,
  FoundationItem,
  QuickFact,
  createRole,
  createEducation,
  createFoundationItem,
  reorderArray,
  iconOptions,
} from './ImpactShared'

// Helpers for highlights
const toHighlightsArray = (s: string): string[] =>
  s.split('\n').filter((line) => line.trim() !== '')

export default function PublicServiceEditor() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  // Hero banner
  const [pubHeroEyebrow, setPubHeroEyebrow] = useState('')
  const [pubHeroTitle, setPubHeroTitle] = useState('Public Service & Policy Impact')
  const [pubHeroDescription, setPubHeroDescription] = useState(
    'Dr. Girma Ababi serves the nation through advisory roles, federation leadership, and innovation boards.',
  )

  // Overview (below banner)
  const [pubEyebrow, setPubEyebrow] = useState('')
  const [pubOverview, setPubOverview] = useState<Overview>({
    title: '',
    subtitle: '',
    description: '',
  })

  // Quick Facts
  const [pubQuickFacts, setPubQuickFacts] = useState<QuickFact[]>([])
  const [factsEyebrow, setFactsEyebrow] = useState('Quick Facts')
  const [factsTitle, setFactsTitle] = useState('At a Glance')

  // Policy & Leadership Roles
  const [pubRoles, setPubRoles] = useState<Role[]>([])
  const [rolesEyebrow, setRolesEyebrow] = useState('Policy & Leadership')
  const [rolesTitle, setRolesTitle] = useState('Advisory & Board Roles')

  // Academic Pedigree
  const [pubEducation, setPubEducation] = useState<Education[]>([])
  const [eduEyebrow, setEduEyebrow] = useState('Academic Pedigree')
  const [eduTitle, setEduTitle] = useState('Degrees & Qualifications')

  // Foundation Items
  const [pubFoundationItems, setPubFoundationItems] = useState<FoundationItem[]>([])
  const [foundItemsEyebrow, setFoundItemsEyebrow] = useState('Focus Areas')
  const [foundItemsTitle, setFoundItemsTitle] = useState('Foundation Initiatives')

  const [expandedPubRoles, setExpandedPubRoles] = useState<string[]>([])
  const [expandedPubEducation, setExpandedPubEducation] = useState<string[]>([])
  const [expandedPubFoundation, setExpandedPubFoundation] = useState<string[]>([])
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

  const resetAll = () => {
    setPubHeroEyebrow('')
    setPubHeroTitle('Public Service & Policy Impact')
    setPubHeroDescription('Dr. Girma Ababi serves the nation through advisory roles, federation leadership, and innovation boards.')
    setPubEyebrow('')
    setPubOverview({ title: '', subtitle: '', description: '' })
    setPubQuickFacts([])
    setPubRoles([])
    setPubEducation([])
    setPubFoundationItems([])
    setFactsEyebrow('Quick Facts')
    setFactsTitle('At a Glance')
    setRolesEyebrow('Policy & Leadership')
    setRolesTitle('Advisory & Board Roles')
    setEduEyebrow('Academic Pedigree')
    setEduTitle('Degrees & Qualifications')
    setFoundItemsEyebrow('Focus Areas')
    setFoundItemsTitle('Foundation Initiatives')
    setExpandedPubRoles([])
    setExpandedPubEducation([])
    setExpandedPubFoundation([])
  }

  const applyData = (data: any) => {
    resetAll()
    if (!data || Object.keys(data).length === 0) return

    setPubHeroEyebrow(data.heroEyebrow || '')
    setPubHeroTitle(data.heroTitle || 'Public Service & Policy Impact')
    setPubHeroDescription(data.heroDescription || 'Dr. Girma Ababi serves the nation through advisory roles, federation leadership, and innovation boards.')

    setPubEyebrow(data.eyebrow || '')
    if (data.overview) setPubOverview(data.overview)

    setFactsEyebrow(data.factsEyebrow || 'Quick Facts')
    setFactsTitle(data.factsTitle || 'At a Glance')
    if (Array.isArray(data.quickFacts)) setPubQuickFacts(data.quickFacts)

    setRolesEyebrow(data.rolesEyebrow || 'Policy & Leadership')
    setRolesTitle(data.rolesTitle || 'Advisory & Board Roles')
    if (Array.isArray(data.roles)) {
      setPubRoles(data.roles.map((r: any) => ({
        ...r,
        highlights: Array.isArray(r.highlights) ? r.highlights : toHighlightsArray(r.highlights || ''),
      })))
    }

    setEduEyebrow(data.eduEyebrow || 'Academic Pedigree')
    setEduTitle(data.eduTitle || 'Degrees & Qualifications')
    if (Array.isArray(data.education)) setPubEducation(data.education)

    setFoundItemsEyebrow(data.foundItemsEyebrow || 'Focus Areas')
    setFoundItemsTitle(data.foundItemsTitle || 'Foundation Initiatives')
    if (Array.isArray(data.foundationItems)) setPubFoundationItems(data.foundationItems)
  }

  const fetchData = async () => {
    const res = await api.get('/impact/public-service')
    const data = res.data || {}
    applyData(data)
    backupRef.current = { data: structuredClone(data) }
    return data
  }

  useEffect(() => {
    let active = true
    const load = async () => {
      setLoading(true)
      setError('')
      try {
        if (active) await fetchData()
      } catch {
        if (active) setError('Could not load public-service data.')
      } finally {
        if (active) setLoading(false)
      }
    }
    load()
    return () => { active = false }
  }, [])

  const handleUndo = () => {
    if (!backupRef.current) return
    applyData(backupRef.current.data)
    setMessage('↩ Reverted to last saved version')
    setTimeout(() => setMessage(''), 3000)
  }

  const saveAll = async () => {
    setSaving(true)
    setMessage('')
    setError('')
    try {
      // Ensure highlights are arrays
      const rolesPayload = pubRoles.map((r) => ({
        ...r,
        highlights: Array.isArray(r.highlights) ? r.highlights : toHighlightsArray(r.highlights as any),
      }))

      const payload = {
        heroEyebrow: pubHeroEyebrow,
        heroTitle: pubHeroTitle,
        heroDescription: pubHeroDescription,
        eyebrow: pubEyebrow,
        title: pubOverview.title,
        overview: pubOverview,
        factsEyebrow,
        factsTitle,
        quickFacts: pubQuickFacts,
        rolesEyebrow,
        rolesTitle,
        roles: rolesPayload,
        eduEyebrow,
        eduTitle,
        education: pubEducation,
        foundItemsEyebrow,
        foundItemsTitle,
        foundationItems: pubFoundationItems,
      }
      await api.put('/impact/public-service', payload)
      await fetchData()
      setMessage('✨ Public Service saved successfully!')
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
        <p className="ml-3 text-slate-600">Loading Public Service...</p>
      </div>
    )
  }

  return (
    <>
      <EditorShell
        slug="public-service"
        saving={saving}
        onSave={saveAll}
        onUndo={handleUndo}
        message={message}
        error={error}
      >
        {/* Hero Banner */}
        {/* <Card title="Hero Banner" description="The banner at the top of the Public Service page.">
          <div className="grid gap-6 md:grid-cols-2">
            <Field label="Eyebrow">
              <input
                className={formInput}
                value={pubHeroEyebrow}
                onChange={(e) => setPubHeroEyebrow(e.target.value)}
              />
            </Field>
            <Field label="Title">
              <input
                className={formInput}
                value={pubHeroTitle}
                onChange={(e) => setPubHeroTitle(e.target.value)}
              />
            </Field>
            <div className="md:col-span-2">
              <Field label="Description">
                <textarea
                  className={formInput}
                  rows={4}
                  value={pubHeroDescription}
                  onChange={(e) => setPubHeroDescription(e.target.value)}
                />
              </Field>
            </div>
          </div>
        </Card> */}

        {/* Hero Section */}
        <Card title="Hero Section" description="Title, subtitle, and description.">
          <div className="grid gap-6 md:grid-cols-2">
            <Field label="Eyebrow">
              <input
                className={formInput}
                value={pubEyebrow}
                onChange={(e) => setPubEyebrow(e.target.value)}
              />
            </Field>
            <Field label="Title">
              <input
                className={formInput}
                value={pubOverview.title}
                onChange={(e) => setPubOverview((p) => ({ ...p, title: e.target.value }))}
              />
            </Field>
            {/* <Field label="Subtitle">
              <input
                className={formInput}
                value={pubOverview.subtitle}
                onChange={(e) => setPubOverview((p) => ({ ...p, subtitle: e.target.value }))}
              />
            </Field> */}
            <div className="md:col-span-2">
              <Field label="Description">
                <textarea
                  className={formInput}
                  rows={4}
                  value={pubOverview.description}
                  onChange={(e) => setPubOverview((p) => ({ ...p, description: e.target.value }))}
                />
              </Field>
            </div>
          </div>
        </Card>

        {/* Quick Facts
        <Card
          title={factsTitle}
          description="Three summary facts displayed under the hero copy."
          onAdd={() => {
            const fact: QuickFact = { id: `fact-${Date.now()}`, label: 'New Fact', value: '' }
            setPubQuickFacts((prev) => [...prev, fact])
            setExpandedPubRoles((prev) => [...prev, fact.id])
            setFocusId(fact.id)
          }}
        >
          <div className="grid gap-4 md:grid-cols-2 mb-6">
            <Field label="Section Eyebrow">
              <input
                className={formInput}
                value={factsEyebrow}
                onChange={(e) => setFactsEyebrow(e.target.value)}
              />
            </Field>
            <Field label="Section Title">
              <input
                className={formInput}
                value={factsTitle}
                onChange={(e) => setFactsTitle(e.target.value)}
              />
            </Field>
          </div>
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
                onDelete={() =>
                  askConfirm('Delete quick fact?', 'This cannot be undone.', () => {
                    setPubQuickFacts((prev) => prev.filter((f) => f.id !== fact.id))
                    setExpandedPubRoles((prev) => prev.filter((id) => id !== fact.id))
                  })
                }
                upDisabled={idx === 0}
                downDisabled={idx === pubQuickFacts.length - 1}
              >
                <Field label="Label">
                  <input
                    className={formInput}
                    value={fact.label}
                    onChange={(e) =>
                      setPubQuickFacts((prev) =>
                        prev.map((f) =>
                          f.id === fact.id ? { ...f, label: e.target.value } : f,
                        ),
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
                        prev.map((f) =>
                          f.id === fact.id ? { ...f, value: e.target.value } : f,
                        ),
                      )
                    }
                  />
                </Field>
              </ExpandableItem>
            ))
          )}
        </Card> */}

        {/* Policy & Leadership Roles */}
        <Card
          title={rolesTitle}
          description="Advisory, federation, innovation, and policy roles."
          onAdd={() => {
            const r = createRole('advisory')
            setPubRoles((prev) => [...prev, r])
            setExpandedPubRoles((prev) => [...prev, r.id])
            setFocusId(r.id)
          }}
        >
          <div className="grid gap-4 md:grid-cols-2 mb-6">
            <Field label="Section Eyebrow">
              <input
                className={formInput}
                value={rolesEyebrow}
                onChange={(e) => setRolesEyebrow(e.target.value)}
              />
            </Field>
            <Field label="Section Title">
              <input
                className={formInput}
                value={rolesTitle}
                onChange={(e) => setRolesTitle(e.target.value)}
              />
            </Field>
          </div>
          {pubRoles.length === 0 ? (
            <EmptyState message="No roles." />
          ) : (
            pubRoles.map((role, idx) => (
              <ExpandableItem
                key={role.id}
                item={role}
                idx={idx}
                expanded={expandedPubRoles}
                setExpanded={setExpandedPubRoles}
                headerLabel={role.category}
                headerValue={role.title}
                isFocused={role.id === focusId}
                refProp={newRef}
                onUp={() => setPubRoles((prev) => reorderArray(prev, idx, -1))}
                onDown={() => setPubRoles((prev) => reorderArray(prev, idx, 1))}
                onDelete={() =>
                  askConfirm('Delete role?', 'This cannot be undone.', () => {
                    setPubRoles((prev) => prev.filter((r) => r.id !== role.id))
                    setExpandedPubRoles((prev) => prev.filter((id) => id !== role.id))
                  })
                }
                upDisabled={idx === 0}
                downDisabled={idx === pubRoles.length - 1}
              >
                <Field label="Title">
                  <input
                    className={formInput}
                    value={role.title}
                    onChange={(e) =>
                      setPubRoles((prev) =>
                        prev.map((r) =>
                          r.id === role.id ? { ...r, title: e.target.value } : r,
                        ),
                      )
                    }
                  />
                </Field>
                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Organization">
                    <input
                      className={formInput}
                      value={role.organization}
                      onChange={(e) =>
                        setPubRoles((prev) =>
                          prev.map((r) =>
                            r.id === role.id ? { ...r, organization: e.target.value } : r,
                          ),
                        )
                      }
                    />
                  </Field>
                  <Field label="Period">
                    <input
                      className={formInput}
                      value={role.period}
                      onChange={(e) =>
                        setPubRoles((prev) =>
                          prev.map((r) =>
                            r.id === role.id ? { ...r, period: e.target.value } : r,
                          ),
                        )
                      }
                    />
                  </Field>
                </div>
                <Field label="Description">
                  <textarea
                    className={formInput}
                    rows={4}
                    value={role.description}
                    onChange={(e) =>
                      setPubRoles((prev) =>
                        prev.map((r) =>
                          r.id === role.id ? { ...r, description: e.target.value } : r,
                        ),
                      )
                    }
                  />
                </Field>
                <Field label="Highlights (one per line)">
                  <textarea
                    className={formInput}
                    rows={3}
                    value={Array.isArray(role.highlights) ? role.highlights.join('\n') : role.highlights}
                    onChange={(e) => {
                      const updated = [...pubRoles]
                      updated[idx] = { ...updated[idx], highlights: e.target.value.split('\n') }
                      setPubRoles(updated)
                    }}
                  />
                </Field>
                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Category">
                    <select
                      className={formInput}
                      value={role.category}
                      onChange={(e) =>
                        setPubRoles((prev) =>
                          prev.map((r) =>
                            r.id === role.id ? { ...r, category: e.target.value } : r,
                          ),
                        )
                      }
                    >
                      <option value="advisory">advisory</option>
                      <option value="federation">federation</option>
                      <option value="innovation">innovation</option>
                      <option value="policy">policy</option>
                    </select>
                  </Field>
                  <Field label="Icon">
                    <select
                      className={formInput}
                      value={role.icon}
                      onChange={(e) =>
                        setPubRoles((prev) =>
                          prev.map((r) =>
                            r.id === role.id ? { ...r, icon: e.target.value } : r,
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
                </div>
              </ExpandableItem>
            ))
          )}
        </Card>

        {/* Academic Pedigree */}
        <Card
          title={eduTitle}
          description="Degrees and qualifications."
          onAdd={() => {
            const e = createEducation()
            setPubEducation((prev) => [...prev, e])
            setExpandedPubEducation((prev) => [...prev, e.id])
            setFocusId(e.id)
          }}
        >
          <div className="grid gap-4 md:grid-cols-2 mb-6">
            <Field label="Section Eyebrow">
              <input
                className={formInput}
                value={eduEyebrow}
                onChange={(e) => setEduEyebrow(e.target.value)}
              />
            </Field>
            <Field label="Section Title">
              <input
                className={formInput}
                value={eduTitle}
                onChange={(e) => setEduTitle(e.target.value)}
              />
            </Field>
          </div>
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
                onDelete={() =>
                  askConfirm('Delete degree?', 'This cannot be undone.', () => {
                    setPubEducation((prev) => prev.filter((e) => e.id !== edu.id))
                    setExpandedPubEducation((prev) => prev.filter((id) => id !== edu.id))
                  })
                }
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

        {/* Foundation Items */}
        <Card
          title={foundItemsTitle}
          description="Key focus areas."
          onAdd={() => {
            const f = createFoundationItem()
            setPubFoundationItems((prev) => [...prev, f])
            setExpandedPubFoundation((prev) => [...prev, f.id])
            setFocusId(f.id)
          }}
        >
          <div className="grid gap-4 md:grid-cols-2 mb-6">
            <Field label="Section Eyebrow">
              <input
                className={formInput}
                value={foundItemsEyebrow}
                onChange={(e) => setFoundItemsEyebrow(e.target.value)}
              />
            </Field>
            <Field label="Section Title">
              <input
                className={formInput}
                value={foundItemsTitle}
                onChange={(e) => setFoundItemsTitle(e.target.value)}
              />
            </Field>
          </div>
          {pubFoundationItems.length === 0 ? (
            <EmptyState message="No foundation items." />
          ) : (
            pubFoundationItems.map((item, idx) => (
              <ExpandableItem
                key={item.id}
                item={item}
                idx={idx}
                expanded={expandedPubFoundation}
                setExpanded={setExpandedPubFoundation}
                headerLabel="Item"
                headerValue={item.title}
                isFocused={item.id === focusId}
                refProp={newRef}
                onUp={() => setPubFoundationItems((prev) => reorderArray(prev, idx, -1))}
                onDown={() => setPubFoundationItems((prev) => reorderArray(prev, idx, 1))}
                onDelete={() =>
                  askConfirm('Delete item?', 'This cannot be undone.', () => {
                    setPubFoundationItems((prev) => prev.filter((i) => i.id !== item.id))
                    setExpandedPubFoundation((prev) => prev.filter((id) => id !== item.id))
                  })
                }
                upDisabled={idx === 0}
                downDisabled={idx === pubFoundationItems.length - 1}
              >
                <Field label="Title">
                  <input
                    className={formInput}
                    value={item.title}
                    onChange={(e) =>
                      setPubFoundationItems((prev) =>
                        prev.map((i) =>
                          i.id === item.id ? { ...i, title: e.target.value } : i,
                        ),
                      )
                    }
                  />
                </Field>
                <Field label="Description">
                  <textarea
                    className={formInput}
                    rows={3}
                    value={item.description}
                    onChange={(e) =>
                      setPubFoundationItems((prev) =>
                        prev.map((i) =>
                          i.id === item.id ? { ...i, description: e.target.value } : i,
                        ),
                      )
                    }
                  />
                </Field>
                <Field label="Icon">
                  <select
                    className={formInput}
                    value={item.icon}
                    onChange={(e) =>
                      setPubFoundationItems((prev) =>
                        prev.map((i) =>
                          i.id === item.id ? { ...i, icon: e.target.value } : i,
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
