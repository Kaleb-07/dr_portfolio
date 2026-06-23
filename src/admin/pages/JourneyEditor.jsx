import {
  ArrowDown,
  ArrowUp,
  Loader2,
  Plus,
  Save,
  Trash2,
  Upload,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import api from '../api'

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

// ICON options and grid picker removed — timeline events use a compact form now

function buildTimelineEvents(events = []) {
  return events.map((event) => ({
    ...event,
    year: event.year || '',
    title: event.title || '',
  }))
}

export default function JourneyEditor() {
  const [content, setContent] = useState(null)
  const [draft, setDraft] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [deletedIds, setDeletedIds] = useState([])

  useEffect(() => {
    let active = true
    const load = async () => {
      setIsLoading(true)
      try {
        const response = await api.get('/cms/site-content')
        if (!active) return
            setContent(response.data)
            const timeline = buildTimelineEvents(response.data.timelineEvents || [])
            const about = response.data.sections?.about_story || {}
            const philosophy = response.data.sections?.leadership_philosophy || {}
            const principles = response.data.sections?.about_values || {}
            const vision = response.data.sections?.about_vision || {}
            setDraft({
              events: timeline,
              about: { eyebrow: about.eyebrow || '', title: about.title || '', description: about.description || '', image_url: about.image_url || '', image_alt: about.image_alt || '', blocks: about.blocks || [] },
              principles: { eyebrow: principles.eyebrow || '', title: principles.title || '', description: principles.description || '', blocks: principles.blocks || [] },
              vision: { eyebrow: vision.eyebrow || '', title: vision.title || '', description: vision.description || '', blocks: vision.blocks || [] },
              philosophy: { eyebrow: philosophy.eyebrow || '', title: philosophy.title || '', description: philosophy.description || '', subtitle: philosophy.subtitle || '', blocks: philosophy.blocks || [] },
            })
      } catch (e) {
        if (!active) return
        setError('Unable to load Journey content.')
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

  const addEvent = () => {
    setDraft((current) => ({
      ...current,
      events: [
        ...(current.events || []),
        {
          id: `new-${Date.now()}`,
          year: '',
          title: '',
          sort_order: (current.events || []).length + 1,
        },
      ],
    }))
  }

  const updateEvent = (index, patch) => {
    setDraft((current) => ({
      ...current,
      events: current.events.map((item, i) => (i === index ? { ...item, ...patch } : item)),
    }))
  }

  const reorder = (index, direction) => {
    setDraft((current) => {
      const next = [...current.events]
      const target = index + direction
      if (target < 0 || target >= next.length) return current
      const item = next[index]
      next[index] = next[target]
      next[target] = item
      return { ...current, events: next }
    })
  }

  const remove = (index) => {
    setDraft((current) => {
      const removed = current.events[index]
      if (typeof removed?.id === 'number') {
        setDeletedIds((ids) => [...ids, removed.id])
      }
      return { ...current, events: current.events.filter((_, i) => i !== index) }
    })
  }

  const updateImage = (index, file) => {
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => updateEvent(index, { image_url: String(reader.result || '') })
    reader.onerror = () => setError('Could not read the selected image.')
    reader.readAsDataURL(file)
  }

  const updateAboutImage = (file) => {
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => updateAbout({ image_url: String(reader.result || '') })
    reader.onerror = () => setError('Could not read the selected image.')
    reader.readAsDataURL(file)
  }

  // About Story block helpers
  const updateAbout = (patch) => {
    setDraft((current) => ({ ...current, about: { ...(current.about || {}), ...patch } }))
  }

  const addChapter = () => {
    setDraft((current) => ({
      ...current,
      about: {
        ...(current.about || {}),
        blocks: [
          ...((current.about && current.about.blocks) || []),
          { id: `new-${Date.now()}`, block_type: 'chapter', title: 'New Chapter', body: '', sort_order: ((current.about && current.about.blocks) || []).length + 1 },
        ],
      },
    }))
  }

  const updateChapter = (index, patch) => {
    setDraft((current) => ({
      ...current,
      about: {
        ...(current.about || {}),
        blocks: (current.about.blocks || []).map((b, i) => (i === index ? { ...b, ...patch } : b)),
      },
    }))
  }

  const removeChapter = (index) => {
    setDraft((current) => ({
      ...current,
      about: { ...(current.about || {}), blocks: (current.about.blocks || []).filter((_, i) => i !== index) },
    }))
  }

  const reorderChapter = (index, direction) => {
    setDraft((current) => {
      const next = [...(current.about.blocks || [])]
      const target = index + direction
      if (target < 0 || target >= next.length) return current
      const item = next[index]
      next[index] = next[target]
      next[target] = item
      return { ...current, about: { ...(current.about || {}), blocks: next } }
    })
  }

  // Leadership Philosophy helpers
  const updatePhilosophy = (patch) => {
    setDraft((current) => ({ ...current, philosophy: { ...(current.philosophy || {}), ...patch } }))
  }

  // Vision helpers
  const updateVision = (patch) => {
    setDraft((current) => ({ ...current, vision: { ...(current.vision || {}), ...patch } }))
  }

  const addQuote = () => {
    setDraft((current) => ({
      ...current,
      philosophy: {
        ...(current.philosophy || {}),
        blocks: [
          ...((current.philosophy && current.philosophy.blocks) || []),
          { id: `new-${Date.now()}`, block_type: 'quote', body: '', title: '', sort_order: ((current.philosophy && current.philosophy.blocks) || []).length + 1 },
        ],
      },
    }))
  }

  const updateQuote = (index, patch) => {
    setDraft((current) => ({
      ...current,
      philosophy: { ...(current.philosophy || {}), blocks: (current.philosophy.blocks || []).map((b, i) => (i === index ? { ...b, ...patch } : b)) },
    }))
  }

  const removeQuote = (index) => {
    setDraft((current) => ({
      ...current,
      philosophy: { ...(current.philosophy || {}), blocks: (current.philosophy.blocks || []).filter((_, i) => i !== index) },
    }))
  }

  const reorderQuote = (index, direction) => {
    setDraft((current) => {
      const next = [...(current.philosophy.blocks || [])]
      const target = index + direction
      if (target < 0 || target >= next.length) return current
      const item = next[index]
      next[index] = next[target]
      next[target] = item
      return { ...current, philosophy: { ...(current.philosophy || {}), blocks: next } }
    })
  }

  // Principles (About Values) helpers
  const updatePrinciples = (patch) => {
    setDraft((current) => ({ ...current, principles: { ...(current.principles || {}), ...patch } }))
  }

  const addPrinciple = () => {
    setDraft((current) => ({
      ...current,
      principles: {
        ...(current.principles || {}),
        blocks: [
          ...((current.principles && current.principles.blocks) || []),
          { id: `new-${Date.now()}`, block_type: 'value', title: 'New Principle', body: '', sort_order: ((current.principles && current.principles.blocks) || []).length + 1 },
        ],
      },
    }))
  }

  const updatePrinciple = (index, patch) => {
    setDraft((current) => ({
      ...current,
      principles: { ...(current.principles || {}), blocks: (current.principles.blocks || []).map((b, i) => (i === index ? { ...b, ...patch } : b)) },
    }))
  }

  const removePrinciple = (index) => {
    setDraft((current) => ({
      ...current,
      principles: { ...(current.principles || {}), blocks: (current.principles.blocks || []).filter((_, i) => i !== index) },
    }))
  }

  const reorderPrinciple = (index, direction) => {
    setDraft((current) => {
      const next = [...(current.principles.blocks || [])]
      const target = index + direction
      if (target < 0 || target >= next.length) return current
      const item = next[index]
      next[index] = next[target]
      next[target] = item
      return { ...current, principles: { ...(current.principles || {}), blocks: next } }
    })
  }

  const save = async () => {
    if (!draft) return
    setMessage('')
    setError('')
    setIsSaving(true)
    try {
      // delete removed timeline events
      for (const id of deletedIds) {
        await api.delete(`/cms/timeline-events/${id}`)
      }

      // save timeline events (only slug/year/title/sort_order)
      for (const [index, event] of (draft.events || []).entries()) {
        const payloadWithOrder = {
          slug: event.slug || null,
          year: event.year || null,
          title: event.title || '',
          sort_order: index + 1,
        }
        if (typeof event.id === 'number') {
          await api.put(`/cms/timeline-events/${event.id}`, payloadWithOrder)
        } else {
          await api.post('/cms/timeline-events', payloadWithOrder)
        }
      }

      // save about_story section
      if (draft.about) {
        const sectionPatch = {
          eyebrow: draft.about.eyebrow,
          title: draft.about.title,
          description: draft.about.description,
          image_url: draft.about.image_url,
          image_alt: draft.about.image_alt,
        }
        await api.put('/cms/sections/about_story', { section: sectionPatch, blocks: draft.about.blocks || [] })
      }

      // save about_vision section
      if (draft.vision) {
        const sectionPatch = {
          eyebrow: draft.vision.eyebrow,
          title: draft.vision.title,
          description: draft.vision.description,
        }
        await api.put('/cms/sections/about_vision', { section: sectionPatch, blocks: draft.vision.blocks || [] })
      }

      // save leadership_philosophy section
      if (draft.philosophy) {
        const sectionPatch = {
          eyebrow: draft.philosophy.eyebrow,
          title: draft.philosophy.title,
          description: draft.philosophy.description,
          subtitle: draft.philosophy.subtitle,
        }
        await api.put('/cms/sections/leadership_philosophy', { section: sectionPatch, blocks: draft.philosophy.blocks || [] })
      }

      // save about_values (Principles) section
      if (draft.principles) {
        const sectionPatch = {
          eyebrow: draft.principles.eyebrow,
          title: draft.principles.title,
          description: draft.principles.description,
        }
        await api.put('/cms/sections/about_values', { section: sectionPatch, blocks: draft.principles.blocks || [] })
      }

      setMessage('Journey saved successfully!')
      setDeletedIds([])
      setTimeout(() => setMessage(''), 3000)

      // refresh site content
      const response = await api.get('/cms/site-content')
      setContent(response.data)
      const timeline = buildTimelineEvents(response.data.timelineEvents || [])
      const about = response.data.sections?.about_story || {}
      const philosophy = response.data.sections?.leadership_philosophy || {}
      const principles = response.data.sections?.about_values || {}
      const vision = response.data.sections?.about_vision || {}
      setDraft({
        events: timeline,
        about: { eyebrow: about.eyebrow || '', title: about.title || '', description: about.description || '', image_url: about.image_url || '', image_alt: about.image_alt || '', blocks: about.blocks || [] },
        principles: { eyebrow: principles.eyebrow || '', title: principles.title || '', description: principles.description || '', blocks: principles.blocks || [] },
        vision: { eyebrow: vision.eyebrow || '', title: vision.title || '', description: vision.description || '', blocks: vision.blocks || [] },
        philosophy: { eyebrow: philosophy.eyebrow || '', title: philosophy.title || '', description: philosophy.description || '', subtitle: philosophy.subtitle || '', blocks: philosophy.blocks || [] },
      })
    } catch (e) {
      setError('Could not save Journey. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading || !draft) {
    return (
      <div className="flex min-h-96 items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 size={32} className="animate-spin text-teal-500" />
          <p className="text-sm text-slate-600">Loading journey content...</p>
        </div>
      </div>
    )
  }

  return (
    <section className="mx-auto max-w-7xl">
      <div className="mb-10 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-teal-600">Journey Editor</p>
          <h1 className="mt-3 text-4xl font-bold text-slate-900 sm:text-5xl">Journey</h1>
          {/* <p className="mt-3 max-w-3xl text-slate-600">Manage the chronological items that appear on the Journey timeline.</p> */}
        </div>
        <button
          type="button"
          onClick={save}
          disabled={isSaving}
          className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-teal-500 to-teal-600 px-6 py-3 font-semibold text-white transition-all hover:shadow-lg hover:shadow-teal-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
          <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
        </button>
      </div>

      <div className="space-y-6">
        {/* About Story */}
        <div className="mt-12 rounded-xl border border-slate-200 bg-white p-6">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">About Story</h2>
            </div>
            <div className="flex gap-2">
              <button type="button" className="inline-flex items-center gap-2 rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium text-slate-800" onClick={addChapter}>
                <Plus size={16} /> Add Chapter
              </button>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Eyebrow"><input className={formInput} value={(draft.about && draft.about.eyebrow) || ''} onChange={(e) => updateAbout({ eyebrow: e.target.value })} /></Field>
            <Field label="Title (HTML)"><input className={formInput} value={(draft.about && draft.about.title) || ''} onChange={(e) => updateAbout({ title: e.target.value })} /></Field>
            <Field label="Image URL"><input className={formInput} value={(draft.about && draft.about.image_url) || ''} onChange={(e) => updateAbout({ image_url: e.target.value })} /></Field>
            <Field label="Image Alt"><input className={formInput} value={(draft.about && draft.about.image_alt) || ''} onChange={(e) => updateAbout({ image_alt: e.target.value })} /></Field>
            <div className="md:col-span-2">
              <Field label="Description"><textarea className={formInput} rows={3} value={(draft.about && draft.about.description) || ''} onChange={(e) => updateAbout({ description: e.target.value })} /></Field>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            {((draft.about && draft.about.blocks) || []).map((block, index) => (
              <div key={block.id || index} className="rounded-lg border border-slate-200 p-4">
                <div className="mb-3 grid gap-3 md:grid-cols-2">
                  <Field label="Chapter Title"><input className={formInput} value={block.title || ''} onChange={(e) => updateChapter(index, { title: e.target.value })} /></Field>
                  <Field label="Order"><input className={formInput} type="number" value={block.sort_order || index + 1} onChange={(e) => updateChapter(index, { sort_order: Number(e.target.value) })} /></Field>
                  <div className="md:col-span-2">
                    <Field label="Body"><textarea className={formInput} rows={5} value={block.body || ''} onChange={(e) => updateChapter(index, { body: e.target.value })} /></Field>
                  </div>
                </div>
                <div className="flex gap-2 justify-end">
                  <button type="button" className="inline-flex items-center gap-2 border border-slate-200 px-3 py-1 text-xs" disabled={index === 0} onClick={() => reorderChapter(index, -1)}>
                    <ArrowUp size={14} />
                  </button>
                  <button type="button" className="inline-flex items-center gap-2 border border-slate-200 px-3 py-1 text-xs" disabled={index === ((draft.about && draft.about.blocks) || []).length - 1} onClick={() => reorderChapter(index, 1)}>
                    <ArrowDown size={14} />
                  </button>
                  <button type="button" className="inline-flex items-center gap-2 border border-slate-200 px-3 py-1 text-xs text-red-700" onClick={() => removeChapter(index)}>
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Principles / Values Editor */}
        <hr />
        <div className="mt-12 rounded-xl border border-slate-200 bg-white p-6">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Principles (Values)</h2>
              {/* <p className="text-sm text-slate-600">Edit the section title and the list of principles shown on the About page.</p> */}
            </div>
            <div className="flex gap-2">
              <button type="button" className="inline-flex items-center gap-2 rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium text-slate-800" onClick={addPrinciple}>
                <Plus size={16} /> Add Principle
              </button>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Eyebrow"><input className={formInput} value={(draft.principles && draft.principles.eyebrow) || ''} onChange={(e) => updatePrinciples({ eyebrow: e.target.value })} /></Field>
            <Field label="Title (HTML)"><input className={formInput} value={(draft.principles && draft.principles.title) || ''} onChange={(e) => updatePrinciples({ title: e.target.value })} /></Field>
            <div className="md:col-span-2">
              <Field label="Description"><textarea className={formInput} rows={3} value={(draft.principles && draft.principles.description) || ''} onChange={(e) => updatePrinciples({ description: e.target.value })} /></Field>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            {((draft.principles && draft.principles.blocks) || []).map((block, index) => (
              <div key={block.id || index} className="rounded-lg border border-slate-200 p-4">
                <div className="mb-3 grid gap-3 md:grid-cols-2">
                  <Field label="Principle Title"><input className={formInput} value={block.title || ''} onChange={(e) => updatePrinciple(index, { title: e.target.value })} /></Field>
                  <Field label="Order"><input className={formInput} type="number" value={block.sort_order || index + 1} onChange={(e) => updatePrinciple(index, { sort_order: Number(e.target.value) })} /></Field>
                  <div className="md:col-span-2">
                    <Field label="Description"><textarea className={formInput} rows={4} value={block.body || ''} onChange={(e) => updatePrinciple(index, { body: e.target.value })} /></Field>
                  </div>
                </div>
                <div className="flex gap-2 justify-end">
                  <button type="button" className="inline-flex items-center gap-2 border border-slate-200 px-3 py-1 text-xs" disabled={index === 0} onClick={() => reorderPrinciple(index, -1)}>
                    <ArrowUp size={14} />
                  </button>
                  <button type="button" className="inline-flex items-center gap-2 border border-slate-200 px-3 py-1 text-xs" disabled={index === ((draft.principles && draft.principles.blocks) || []).length - 1} onClick={() => reorderPrinciple(index, 1)}>
                    <ArrowDown size={14} />
                  </button>
                  <button type="button" className="inline-flex items-center gap-2 border border-slate-200 px-3 py-1 text-xs text-red-700" onClick={() => removePrinciple(index)}>
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Leadership Philosophy Editor */}
        <hr />
        <div className="mt-12 rounded-xl border border-slate-200 bg-white p-6">

        <div className="mb-4 flex items-center justify-between">
        <div>
            <h2 className="text-2xl font-bold text-slate-900">Leadership Philosophy</h2>
        </div>
        <div className="flex gap-2">
            <button type="button" className="inline-flex items-center gap-2 rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium text-slate-800" onClick={addQuote}>
            <Plus size={16} /> Add Quote
            </button>
        </div>
        </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Eyebrow"><input className={formInput} value={(draft.philosophy && draft.philosophy.eyebrow) || ''} onChange={(e) => updatePhilosophy({ eyebrow: e.target.value })} /></Field>
            <Field label="Title"><input className={formInput} value={(draft.philosophy && draft.philosophy.title) || ''} onChange={(e) => updatePhilosophy({ title: e.target.value })} /></Field>
            <div className="md:col-span-2">
              <Field label="Primary Quote"><textarea className={formInput} rows={3} value={(draft.philosophy && draft.philosophy.description) || ''} onChange={(e) => updatePhilosophy({ description: e.target.value })} /></Field>
            </div>
            <Field label="Attribution"><input className={formInput} value={(draft.philosophy && draft.philosophy.subtitle) || ''} onChange={(e) => updatePhilosophy({ subtitle: e.target.value })} /></Field>
          </div>

          <div className="mt-6 space-y-4">
            {((draft.philosophy && draft.philosophy.blocks) || []).map((block, index) => (
              <div key={block.id || index} className="rounded-lg border border-slate-200 p-4">
                <div className="mb-3 grid gap-3 md:grid-cols-2">
                  <Field label="Quote Text"><textarea className={formInput} rows={4} value={block.body || ''} onChange={(e) => updateQuote(index, { body: e.target.value })} /></Field>
                  <Field label="Attribution"><input className={formInput} value={block.title || ''} onChange={(e) => updateQuote(index, { title: e.target.value })} /></Field>
                </div>
                <div className="flex gap-2 justify-end">
                  <button type="button" className="inline-flex items-center gap-2 border border-slate-200 px-3 py-1 text-xs" disabled={index === 0} onClick={() => reorderQuote(index, -1)}>
                    <ArrowUp size={14} />
                  </button>
                  <button type="button" className="inline-flex items-center gap-2 border border-slate-200 px-3 py-1 text-xs" disabled={index === ((draft.philosophy && draft.philosophy.blocks) || []).length - 1} onClick={() => reorderQuote(index, 1)}>
                    <ArrowDown size={14} />
                  </button>
                  <button type="button" className="inline-flex items-center gap-2 border border-slate-200 px-3 py-1 text-xs text-red-700" onClick={() => removeQuote(index)}>
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline Events */}
        {/* Vision Section Editor */}
        <hr />
        <div className="mt-12 rounded-xl border border-slate-200 bg-white p-6">
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-slate-900">Vision</h2>
            <p className="text-sm text-slate-600">Edit the Vision section displayed above the timeline on the public About page.</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Eyebrow"><input className={formInput} value={(draft.vision && draft.vision.eyebrow) || ''} onChange={(e) => updateVision({ eyebrow: e.target.value })} /></Field>
            <Field label="Title"><input className={formInput} value={(draft.vision && draft.vision.title) || ''} onChange={(e) => updateVision({ title: e.target.value })} /></Field>
            <div className="md:col-span-2">
              <Field label="Quote / Description"><textarea className={formInput} rows={4} value={(draft.vision && draft.vision.description) || ''} onChange={(e) => updateVision({ description: e.target.value })} /></Field>
            </div>
          </div>
        </div>
        <hr />
        <div>
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Timeline Events</h2>
            </div>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-lg bg-teal-500 px-5 py-2.5 font-semibold text-white transition-all hover:bg-teal-600"
              onClick={addEvent}
            >
              <Plus size={18} /> Add Event
            </button>
          </div>

          <div className="space-y-4 mt-4">
            {draft.events.map((event, index) => (
              <div
                key={event.id || index}
                className="rounded-xl border border-slate-200 bg-white p-6 transition-all duration-200 hover:shadow-lg"
                style={{
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05), 0 2px 8px rgba(0, 0, 0, 0.04)',
                }}
              >
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-100 text-teal-600 font-bold">{index + 1}</div>
                    <h3 className="font-semibold text-slate-900">{event.title || 'Untitled Event'}</h3>
                  </div>

                  <div className="grid gap-4 md:grid-cols-[120px_minmax(0,1fr)]">
                    <Field label="Year">
                      <input
                        className={formInput}
                        value={event.year}
                        onChange={(e) => updateEvent(index, { year: e.target.value })}
                        placeholder="2024"
                      />
                    </Field>
                    <Field label="Title">
                      <input
                        className={formInput}
                        value={event.title}
                        onChange={(e) => updateEvent(index, { title: e.target.value })}
                        placeholder="Event title"
                      />
                    </Field>
                  </div>

                <div className="mt-6 flex items-center justify-between gap-2">
                  <div className="flex gap-2">
                    <IconButton label="Move up" disabled={index === 0} onClick={() => reorder(index, -1)}>
                      <ArrowUp size={16} />
                    </IconButton>
                    <IconButton
                      label="Move down"
                      disabled={index === draft.events.length - 1}
                      onClick={() => reorder(index, 1)}
                    >
                      <ArrowDown size={16} />
                    </IconButton>
                  </div>
                  <div className="flex items-center gap-2">
                    {/* <label className="inline-flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-slate-200 bg-slate-100 text-slate-600 transition-all hover:bg-slate-200"> */}
                      {/* <Upload size={18} /> */}
                      {/* <input type="file" accept="image/*" className="sr-only" onChange={(e) => updateImage(index, e.target.files?.[0])} /> */}
                    {/* </label> */}
                    <IconButton label="Delete" danger onClick={() => remove(index)}>
                      <Trash2 size={16} />
                    </IconButton>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Toast message={message} error={error} />
    </section>
  )
}
