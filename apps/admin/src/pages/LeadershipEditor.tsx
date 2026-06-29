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
  createRole,
  reorderArray,
  iconOptions,
} from './ImpactShared'

// Helpers for highlights conversion
const toHighlightsArray = (s: string): string[] =>
  s.split('\n').filter((line) => line.trim() !== '')

export default function LeadershipEditor() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  // Hero banner
  const [leadHeroEyebrow, setLeadHeroEyebrow] = useState('')
  const [leadHeroTitle, setLeadHeroTitle] = useState('Leadership & Impact')
  const [leadHeroDescription, setLeadHeroDescription] = useState(
    'Executive leadership spanning healthcare organizations, boards, and institutions.',
  )

  // Overview (hero section below banner)
  const [leadEyebrow, setLeadEyebrow] = useState('')
  const [leadOverview, setLeadOverview] = useState<Overview>({
    title: '',
    subtitle: '',
    description: '',
  })

  // Executive Roles
  const [executiveRoles, setExecutiveRoles] = useState<Role[]>([])
  const [execEyebrow, setExecEyebrow] = useState('Executive')
  const [execTitle, setExecTitle] = useState(
    'Founder & <em class="text-teal-mid not-italic">executive</em> leadership',
  )
  const [execDescription, setExecDescription] = useState('')

  // Governance / Board Roles
  const [governanceRoles, setGovernanceRoles] = useState<Role[]>([])
  const [govEyebrow, setGovEyebrow] = useState('Governance')
  const [govTitle, setGovTitle] = useState(
    'Board & <em class="text-teal-mid not-italic">advisory</em> memberships',
  )
  const [govDescription, setGovDescription] = useState(
    'Governance roles across healthcare institutions, civil society, and professional organisations.',
  )

  const [expandedExecRoles, setExpandedExecRoles] = useState<string[]>([])
  const [expandedGovRoles, setExpandedGovRoles] = useState<string[]>([])
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
    setLeadHeroEyebrow('')
    setLeadHeroTitle('Leadership & Impact')
    setLeadHeroDescription('Executive leadership spanning healthcare organizations, boards, and institutions.')
    setLeadEyebrow('')
    setLeadOverview({ title: '', subtitle: '', description: '' })
    setExecutiveRoles([])
    setGovernanceRoles([])
    setExecEyebrow('Executive')
    setExecTitle('Founder & <em class="text-teal-mid not-italic">executive</em> leadership')
    setExecDescription('')
    setGovEyebrow('Governance')
    setGovTitle('Board & <em class="text-teal-mid not-italic">advisory</em> memberships')
    setGovDescription('Governance roles across healthcare institutions, civil society, and professional organisations.')
    setExpandedExecRoles([])
    setExpandedGovRoles([])
  }

  const applyData = (data: any) => {
    resetAll()
    if (!data || Object.keys(data).length === 0) return

    setLeadHeroEyebrow(data.heroEyebrow || '')
    setLeadHeroTitle(data.heroTitle || 'Leadership & Impact')
    setLeadHeroDescription(data.heroDescription || 'Executive leadership spanning healthcare organizations, boards, and institutions.')

    setLeadEyebrow(data.eyebrow || '')
    if (data.overview) setLeadOverview(data.overview)

    setExecEyebrow(data.execEyebrow || 'Executive')
    setExecTitle(data.execTitle || 'Founder & <em class="text-teal-mid not-italic">executive</em> leadership')
    setExecDescription(data.execDescription || '')

    // Ensure highlights are arrays
    const exec = Array.isArray(data.executiveRoles) ? data.executiveRoles : []
    setExecutiveRoles(exec.map((r: any) => ({
      ...r,
      highlights: Array.isArray(r.highlights) ? r.highlights : toHighlightsArray(r.highlights || ''),
    })))

    setGovEyebrow(data.govEyebrow || 'Governance')
    setGovTitle(data.govTitle || 'Board & <em class="text-teal-mid not-italic">advisory</em> memberships')
    setGovDescription(data.govDescription || 'Governance roles across healthcare institutions, civil society, and professional organisations.')

    const gov = Array.isArray(data.governanceRoles) ? data.governanceRoles : []
    setGovernanceRoles(gov.map((r: any) => ({
      ...r,
      highlights: Array.isArray(r.highlights) ? r.highlights : toHighlightsArray(r.highlights || ''),
    })))
  }

  const fetchData = async () => {
    const res = await api.get('/impact/leadership')
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
        if (active) setError('Could not load leadership data.')
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
      // Make sure highlights are arrays before sending
      const execPayload = executiveRoles.map((r) => ({
        ...r,
        highlights: Array.isArray(r.highlights) ? r.highlights : toHighlightsArray(r.highlights as any),
      }))
      const govPayload = governanceRoles.map((r) => ({
        ...r,
        highlights: Array.isArray(r.highlights) ? r.highlights : toHighlightsArray(r.highlights as any),
      }))

      const payload = {
        heroEyebrow: leadHeroEyebrow,
        heroTitle: leadHeroTitle,
        heroDescription: leadHeroDescription,
        eyebrow: leadEyebrow,
        title: leadOverview.title,
        overview: leadOverview,
        execEyebrow,
        execTitle,
        execDescription,
        executiveRoles: execPayload,
        govEyebrow,
        govTitle,
        govDescription,
        governanceRoles: govPayload,
      }
      await api.put('/impact/leadership', payload)
      await fetchData()
      setMessage('✨ Leadership saved successfully!')
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
        <p className="ml-3 text-slate-600">Loading Leadership...</p>
      </div>
    )
  }

  return (
    <>
      <EditorShell
        slug="leadership"
        saving={saving}
        onSave={saveAll}
        onUndo={handleUndo}
        message={message}
        error={error}
      >
        {/* Hero Banner */}
        {/* <Card title="Hero Banner" description="The banner at the top of the Leadership page.">
          <div className="grid gap-6 md:grid-cols-2">
            <Field label="Eyebrow (small tag)">
              <input
                className={formInput}
                value={leadHeroEyebrow}
                onChange={(e) => setLeadHeroEyebrow(e.target.value)}
              />
            </Field>
            <Field label="Title">
              <input
                className={formInput}
                value={leadHeroTitle}
                onChange={(e) => setLeadHeroTitle(e.target.value)}
              />
            </Field>
            <div className="md:col-span-2">
              <Field label="Description">
                <textarea
                  className={formInput}
                  rows={4}
                  value={leadHeroDescription}
                  onChange={(e) => setLeadHeroDescription(e.target.value)}
                />
              </Field>
            </div>
          </div>
        </Card> */}

        {/* Hero Section (below banner) */}
        <Card title="Hero Section" description="Title, subtitle, and description.">
          {/* <Field label="Eyebrow">
            <input
              className={formInput}
              value={leadEyebrow}
              onChange={(e) => setLeadEyebrow(e.target.value)}
            />
          </Field> */}
          <Field label="Title">
            <input
              className={formInput}
              value={leadOverview.title}
              onChange={(e) => setLeadOverview((p) => ({ ...p, title: e.target.value }))}
            />
          </Field>
          {/* <Field label="Subtitle">
            <input
              className={formInput}
              value={leadOverview.subtitle}
              onChange={(e) => setLeadOverview((p) => ({ ...p, subtitle: e.target.value }))}
            />
          </Field> */}
          <Field label="Description">
            <textarea
              className={formInput}
              rows={3}
              value={leadOverview.description}
              onChange={(e) => setLeadOverview((p) => ({ ...p, description: e.target.value }))}
            />
          </Field>
        </Card>

        {/* Executive Roles */}
        <Card
          title={execTitle}
          description="Founder & executive positions."
          onAdd={() => {
            const r = createRole('executive')
            setExecutiveRoles((prev) => [...prev, r])
            setExpandedExecRoles((prev) => [...prev, r.id])
            setFocusId(r.id)
          }}
        >
          <div className="grid gap-4 md:grid-cols-2 mb-6">
            <Field label="Section Eyebrow">
              <input
                className={formInput}
                value={execEyebrow}
                onChange={(e) => setExecEyebrow(e.target.value)}
              />
            </Field>
            <Field label="Section Title">
              <input
                className={formInput}
                value={execTitle}
                onChange={(e) => setExecTitle(e.target.value)}
              />
            </Field>
            <div className="md:col-span-2">
              <Field label="Section Description">
                <textarea
                  className={formInput}
                  rows={3}
                  value={execDescription}
                  onChange={(e) => setExecDescription(e.target.value)}
                />
              </Field>
            </div>
          </div>
          {executiveRoles.length === 0 ? (
            <EmptyState message="No executive roles." />
          ) : (
            executiveRoles.map((role, idx) => (
              <ExpandableItem
                key={role.id}
                item={role}
                idx={idx}
                expanded={expandedExecRoles}
                setExpanded={setExpandedExecRoles}
                headerLabel={role.category}
                headerValue={role.title}
                isFocused={role.id === focusId}
                refProp={newRef}
                onUp={() => setExecutiveRoles((prev) => reorderArray(prev, idx, -1))}
                onDown={() => setExecutiveRoles((prev) => reorderArray(prev, idx, 1))}
                onDelete={() =>
                  askConfirm('Delete role?', 'This cannot be undone.', () => {
                    setExecutiveRoles((prev) => prev.filter((r) => r.id !== role.id))
                    setExpandedExecRoles((prev) => prev.filter((id) => id !== role.id))
                  })
                }
                upDisabled={idx === 0}
                downDisabled={idx === executiveRoles.length - 1}
              >
                <Field label="Title">
                  <input
                    className={formInput}
                    value={role.title}
                    onChange={(e) =>
                      setExecutiveRoles((prev) =>
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
                        setExecutiveRoles((prev) =>
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
                        setExecutiveRoles((prev) =>
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
                      setExecutiveRoles((prev) =>
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
                      const updated = [...executiveRoles]
                      updated[idx] = { ...updated[idx], highlights: e.target.value.split('\n') }
                      setExecutiveRoles(updated)
                    }}
                  />
                </Field>
                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Category">
                    <select
                      className={formInput}
                      value={role.category}
                      onChange={(e) =>
                        setExecutiveRoles((prev) =>
                          prev.map((r) =>
                            r.id === role.id ? { ...r, category: e.target.value } : r,
                          ),
                        )
                      }
                    >
                      <option value="executive">executive</option>
                      <option value="founder">founder</option>
                    </select>
                  </Field>
                  <Field label="Icon">
                    <select
                      className={formInput}
                      value={role.icon}
                      onChange={(e) =>
                        setExecutiveRoles((prev) =>
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

        {/* Governance Roles */}
        <Card
          title={govTitle}
          description="Board and advisory memberships."
          onAdd={() => {
            const r = createRole('board')
            setGovernanceRoles((prev) => [...prev, r])
            setExpandedGovRoles((prev) => [...prev, r.id])
            setFocusId(r.id)
          }}
        >
          <div className="grid gap-4 md:grid-cols-2 mb-6">
            <Field label="Section Eyebrow">
              <input
                className={formInput}
                value={govEyebrow}
                onChange={(e) => setGovEyebrow(e.target.value)}
              />
            </Field>
            <Field label="Section Title">
              <input
                className={formInput}
                value={govTitle}
                onChange={(e) => setGovTitle(e.target.value)}
              />
            </Field>
            <div className="md:col-span-2">
              <Field label="Section Description">
                <textarea
                  className={formInput}
                  rows={3}
                  value={govDescription}
                  onChange={(e) => setGovDescription(e.target.value)}
                />
              </Field>
            </div>
          </div>
          {governanceRoles.length === 0 ? (
            <EmptyState message="No governance roles." />
          ) : (
            governanceRoles.map((role, idx) => (
              <ExpandableItem
                key={role.id}
                item={role}
                idx={idx}
                expanded={expandedGovRoles}
                setExpanded={setExpandedGovRoles}
                headerLabel={role.category}
                headerValue={role.title}
                isFocused={role.id === focusId}
                refProp={newRef}
                onUp={() => setGovernanceRoles((prev) => reorderArray(prev, idx, -1))}
                onDown={() => setGovernanceRoles((prev) => reorderArray(prev, idx, 1))}
                onDelete={() =>
                  askConfirm('Delete role?', 'This cannot be undone.', () => {
                    setGovernanceRoles((prev) => prev.filter((r) => r.id !== role.id))
                    setExpandedGovRoles((prev) => prev.filter((id) => id !== role.id))
                  })
                }
                upDisabled={idx === 0}
                downDisabled={idx === governanceRoles.length - 1}
              >
                <Field label="Title">
                  <input
                    className={formInput}
                    value={role.title}
                    onChange={(e) =>
                      setGovernanceRoles((prev) =>
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
                        setGovernanceRoles((prev) =>
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
                        setGovernanceRoles((prev) =>
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
                      setGovernanceRoles((prev) =>
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
                      const updated = [...governanceRoles]
                      updated[idx] = { ...updated[idx], highlights: e.target.value.split('\n') }
                      setGovernanceRoles(updated)
                    }}
                  />
                </Field>
                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Category">
                    <select
                      className={formInput}
                      value={role.category}
                      onChange={(e) =>
                        setGovernanceRoles((prev) =>
                          prev.map((r) =>
                            r.id === role.id ? { ...r, category: e.target.value } : r,
                          ),
                        )
                      }
                    >
                      <option value="board">board</option>
                      <option value="advisory">advisory</option>
                    </select>
                  </Field>
                  <Field label="Icon">
                    <select
                      className={formInput}
                      value={role.icon}
                      onChange={(e) =>
                        setGovernanceRoles((prev) =>
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
