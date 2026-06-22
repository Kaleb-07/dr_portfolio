import { ArrowDown, ArrowUp, Loader2, Plus, Save, Trash2 } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import api from '../api'

const emptyIdentity = { label: '', title: '', description: '', icon: '', image_url: '', sort_order: 0, is_active: 1 }
const emptyTimeline = {
  slug: '',
  year: '',
  title: '',
  subtitle: '',
  description: '',
  category: 'milestone',
  icon: '',
  sort_order: 0,
  is_active: 1,
}
const emptyNav = { parent_id: '', label: '', path: '', target: '_self', sort_order: 0, is_active: 1 }

const flattenNavigation = (items, depth = 0) =>
  items.flatMap((item) => [
    { ...item, depth },
    ...flattenNavigation(item.children || [], depth + 1),
  ])

const formInput =
  'w-full border border-rule bg-paper px-3 py-2.5 text-sm text-ink outline-none transition-colors placeholder:text-ink-faint focus:border-teal'
const labelClass = 'mb-1.5 block font-mono text-[9px] uppercase tracking-[0.18em] text-ink-muted'

function Field({ label, children }) {
  return (
    <label>
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
      className={`inline-flex h-9 w-9 items-center justify-center border transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
        danger
          ? 'border-red-200 text-red-700 hover:bg-red-50'
          : 'border-rule text-ink-muted hover:bg-paper-warm hover:text-ink'
      }`}
    >
      {children}
    </button>
  )
}

export default function CmsEditor() {
  const [content, setContent] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const navigationFlat = useMemo(() => flattenNavigation(content?.navigation || []), [content])

  const loadContent = async () => {
    setIsLoading(true)
    setError('')
    try {
      const response = await api.get('/cms/site-content')
      setContent(response.data)
    } catch {
      setError('Could not load CMS content.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadContent()
  }, [])

  const updateSection = (slug, patch) => {
    setContent((current) => ({
      ...current,
      sections: {
        ...current.sections,
        [slug]: { ...current.sections[slug], ...patch },
      },
    }))
  }

  const updateSectionBlock = (slug, index, patch) => {
    setContent((current) => {
      const section = current.sections[slug]
      const blocks = section.blocks.map((block, blockIndex) =>
        blockIndex === index ? { ...block, ...patch } : block,
      )
      return {
        ...current,
        sections: { ...current.sections, [slug]: { ...section, blocks } },
      }
    })
  }

  const saveSection = async (slug) => {
    setMessage('')
    setError('')
    setIsSaving(true)
    try {
      const section = content.sections[slug]
      await api.put(`/cms/sections/${slug}`, { section, blocks: section.blocks })
      setMessage('Section saved.')
      await loadContent()
    } catch {
      setError('Could not save section.')
    } finally {
      setIsSaving(false)
    }
  }

  const updateCollectionItem = (collection, id, patch) => {
    setContent((current) => ({
      ...current,
      [collection]: current[collection].map((item) => (item.id === id ? { ...item, ...patch } : item)),
    }))
  }

  const reorderCollection = (collection, id, direction) => {
    setContent((current) => {
      const list = [...current[collection]]
      const index = list.findIndex((item) => item.id === id)
      const target = index + direction
      if (target < 0 || target >= list.length) return current
      const moved = list[index]
      list[index] = list[target]
      list[target] = moved
      return {
        ...current,
        [collection]: list.map((item, sortIndex) => ({ ...item, sort_order: sortIndex + 1 })),
      }
    })
  }

  const saveCollection = async (collection, endpoint) => {
    setMessage('')
    setError('')
    setIsSaving(true)
    try {
      for (const item of content[collection]) {
        if (typeof item.id === 'number') {
          await api.put(`/cms/${endpoint}/${item.id}`, item)
        } else {
          const { id, ...payload } = item
          await api.post(`/cms/${endpoint}`, payload)
        }
      }
      setMessage('Collection saved.')
      await loadContent()
    } catch {
      setError('Could not save collection.')
    } finally {
      setIsSaving(false)
    }
  }

  const deleteItem = async (endpoint, id) => {
    setMessage('')
    setError('')
    try {
      await api.delete(`/cms/${endpoint}/${id}`)
      setMessage('Item deleted.')
      await loadContent()
    } catch {
      setError('Could not delete item.')
    }
  }

  const addCollectionItem = (collection, emptyItem) => {
    setContent((current) => ({
      ...current,
      [collection]: [...current[collection], { ...emptyItem, id: `new-${Date.now()}`, sort_order: current[collection].length + 1 }],
    }))
  }

  const updateNavigationItem = (id, patch) => {
    const updateTree = (items) =>
      items.map((item) => {
        if (item.id === id) return { ...item, ...patch }
        return { ...item, children: updateTree(item.children || []) }
      })

    setContent((current) => ({ ...current, navigation: updateTree(current.navigation) }))
  }

  const addNavigationItem = () => {
    setContent((current) => ({
      ...current,
      navigation: [
        ...current.navigation,
        { ...emptyNav, id: `new-${Date.now()}`, children: [], sort_order: current.navigation.length + 1 },
      ],
    }))
  }

  const saveNavigation = async () => {
    setMessage('')
    setError('')
    setIsSaving(true)
    try {
      for (const item of flattenNavigation(content.navigation)) {
        const payload = {
          parent_id: item.parent_id || null,
          label: item.label,
          path: item.path || null,
          target: item.target || '_self',
          sort_order: item.sort_order || 0,
          is_active: item.is_active === 0 ? 0 : 1,
        }
        if (typeof item.id === 'number') {
          await api.put(`/cms/navigation-items/${item.id}`, payload)
        } else {
          await api.post('/cms/navigation-items', payload)
        }
      }
      setMessage('Navigation saved.')
      await loadContent()
    } catch {
      setError('Could not save navigation.')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-80 items-center justify-center border border-rule bg-paper-card">
        <Loader2 size={26} className="animate-spin text-teal" />
      </div>
    )
  }

  const vision = content.sections.vision_agenda
  const aboutVision = content.sections.about_vision

  return (
    <section className="mx-auto max-w-7xl space-y-8">
      <div className="flex flex-col justify-between gap-4 border-b border-rule pb-7 lg:flex-row lg:items-end">
        <div>
          <p className="section-tag">CMS Editor</p>
          <h1 className="mt-3 font-serif text-4xl font-light text-ink sm:text-5xl">Live Website Content</h1>
        </div>
        <div className="text-sm font-light text-ink-mid">
          {message && <p className="text-teal">{message}</p>}
          {error && <p className="text-red-700">{error}</p>}
        </div>
      </div>

      <div className="border border-rule bg-paper-card p-5 sm:p-6">
        <div className="mb-5 flex items-center justify-between border-b border-rule pb-4">
          <h2 className="font-serif text-3xl font-light text-ink">Vision Agenda</h2>
          <button className="inline-flex items-center gap-2 bg-teal px-4 py-2.5 text-xs uppercase tracking-[0.16em] text-white" onClick={() => saveSection('vision_agenda')} disabled={isSaving}>
            <Save size={15} /> Save
          </button>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Eyebrow"><input className={formInput} value={vision.eyebrow || ''} onChange={(e) => updateSection('vision_agenda', { eyebrow: e.target.value })} /></Field>
          <Field label="Profile Label"><input className={formInput} value={vision.subtitle || ''} onChange={(e) => updateSection('vision_agenda', { subtitle: e.target.value })} /></Field>
          <Field label="Image URL"><input className={formInput} value={vision.image_url || ''} onChange={(e) => updateSection('vision_agenda', { image_url: e.target.value })} /></Field>
          <Field label="Image Alt"><input className={formInput} value={vision.image_alt || ''} onChange={(e) => updateSection('vision_agenda', { image_alt: e.target.value })} /></Field>
          <Field label="Title HTML"><textarea className={`${formInput} md:col-span-2`} rows={4} value={vision.title || ''} onChange={(e) => updateSection('vision_agenda', { title: e.target.value })} /></Field>
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {vision.blocks.map((block, index) => (
            <div key={block.id || index} className="border border-rule bg-paper p-4">
              <Field label="Label"><input className={formInput} value={block.eyebrow || ''} onChange={(e) => updateSectionBlock('vision_agenda', index, { eyebrow: e.target.value })} /></Field>
              <div className="mt-3">
                <Field label="Title"><input className={formInput} value={block.title || ''} onChange={(e) => updateSectionBlock('vision_agenda', index, { title: e.target.value })} /></Field>
              </div>
            </div>
          ))}
        </div>
      </div>

      <CollectionEditor
        title="Identity Items"
        items={content.identityItems}
        onAdd={() => addCollectionItem('identityItems', emptyIdentity)}
        onSave={() => saveCollection('identityItems', 'identity-items')}
        onDelete={(id) => deleteItem('identity-items', id)}
        onMove={(id, direction) => reorderCollection('identityItems', id, direction)}
        renderItem={(item) => (
          <div className="grid gap-3 md:grid-cols-[80px_minmax(0,1fr)]">
            <Field label="Number"><input className={formInput} value={item.label || ''} onChange={(e) => updateCollectionItem('identityItems', item.id, { label: e.target.value })} /></Field>
            <Field label="Title"><input className={formInput} value={item.title || ''} onChange={(e) => updateCollectionItem('identityItems', item.id, { title: e.target.value })} /></Field>
            <div className="md:col-span-2">
              <Field label="Description"><textarea className={formInput} rows={3} value={item.description || ''} onChange={(e) => updateCollectionItem('identityItems', item.id, { description: e.target.value })} /></Field>
            </div>
          </div>
        )}
      />

      <CollectionEditor
        title="Timeline Events"
        items={content.timelineEvents}
        onAdd={() => addCollectionItem('timelineEvents', emptyTimeline)}
        onSave={() => saveCollection('timelineEvents', 'timeline-events')}
        onDelete={(id) => deleteItem('timeline-events', id)}
        onMove={(id, direction) => reorderCollection('timelineEvents', id, direction)}
        renderItem={(item) => (
          <div className="grid gap-3 md:grid-cols-[90px_minmax(0,1fr)_160px]">
            <Field label="Year"><input className={formInput} value={item.year || ''} onChange={(e) => updateCollectionItem('timelineEvents', item.id, { year: e.target.value })} /></Field>
            <Field label="Title"><input className={formInput} value={item.title || ''} onChange={(e) => updateCollectionItem('timelineEvents', item.id, { title: e.target.value })} /></Field>
            <Field label="Category"><input className={formInput} value={item.category || ''} onChange={(e) => updateCollectionItem('timelineEvents', item.id, { category: e.target.value })} /></Field>
            <Field label="Subtitle"><input className={formInput} value={item.subtitle || ''} onChange={(e) => updateCollectionItem('timelineEvents', item.id, { subtitle: e.target.value })} /></Field>
            <div className="md:col-span-2">
              <Field label="Description"><textarea className={formInput} rows={3} value={item.description || ''} onChange={(e) => updateCollectionItem('timelineEvents', item.id, { description: e.target.value })} /></Field>
            </div>
          </div>
        )}
      />

      <div className="border border-rule bg-paper-card p-5 sm:p-6">
        <div className="mb-5 flex items-center justify-between border-b border-rule pb-4">
          <h2 className="font-serif text-3xl font-light text-ink">About Vision Quote</h2>
          <button className="inline-flex items-center gap-2 bg-teal px-4 py-2.5 text-xs uppercase tracking-[0.16em] text-white" onClick={() => saveSection('about_vision')} disabled={isSaving}>
            <Save size={15} /> Save
          </button>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Eyebrow"><input className={formInput} value={aboutVision.eyebrow || ''} onChange={(e) => updateSection('about_vision', { eyebrow: e.target.value })} /></Field>
          <Field label="Title"><input className={formInput} value={aboutVision.title || ''} onChange={(e) => updateSection('about_vision', { title: e.target.value })} /></Field>
          <div className="md:col-span-2">
            <Field label="Quote"><textarea className={formInput} rows={4} value={aboutVision.description || ''} onChange={(e) => updateSection('about_vision', { description: e.target.value })} /></Field>
          </div>
        </div>
      </div>

      <div className="border border-rule bg-paper-card p-5 sm:p-6">
        <div className="mb-5 flex flex-col gap-3 border-b border-rule pb-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="font-serif text-3xl font-light text-ink">Navigation</h2>
          <div className="flex gap-2">
            <button className="inline-flex items-center gap-2 border border-rule px-4 py-2.5 text-xs uppercase tracking-[0.16em] text-ink" onClick={addNavigationItem}>
              <Plus size={15} /> Add
            </button>
            <button className="inline-flex items-center gap-2 bg-teal px-4 py-2.5 text-xs uppercase tracking-[0.16em] text-white" onClick={saveNavigation} disabled={isSaving}>
              <Save size={15} /> Save
            </button>
          </div>
        </div>
        <div className="space-y-3">
          {navigationFlat.map((item) => (
            <div key={item.id} className="grid gap-3 border border-rule bg-paper p-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_120px_120px]">
              <div style={{ paddingLeft: item.depth * 20 }}>
                <Field label="Label"><input className={formInput} value={item.label || ''} onChange={(e) => updateNavigationItem(item.id, { label: e.target.value })} /></Field>
              </div>
              <Field label="Path"><input className={formInput} value={item.path || ''} onChange={(e) => updateNavigationItem(item.id, { path: e.target.value })} /></Field>
              <Field label="Parent">
                <select className={formInput} value={item.parent_id || ''} onChange={(e) => updateNavigationItem(item.id, { parent_id: e.target.value ? Number(e.target.value) : null })}>
                  <option value="">Top level</option>
                  {navigationFlat.filter((candidate) => candidate.id !== item.id).map((candidate) => (
                    <option key={candidate.id} value={candidate.id}>{`${'--'.repeat(candidate.depth)} ${candidate.label}`}</option>
                  ))}
                </select>
              </Field>
              <Field label="Order"><input className={formInput} type="number" value={item.sort_order || 0} onChange={(e) => updateNavigationItem(item.id, { sort_order: Number(e.target.value) })} /></Field>
              {typeof item.id === 'number' && (
                <div className="md:col-span-4">
                  <IconButton label="Delete" danger onClick={() => deleteItem('navigation-items', item.id)}><Trash2 size={15} /></IconButton>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function CollectionEditor({ title, items, onAdd, onSave, onDelete, onMove, renderItem }) {
  return (
    <div className="border border-rule bg-paper-card p-5 sm:p-6">
      <div className="mb-5 flex flex-col gap-3 border-b border-rule pb-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="font-serif text-3xl font-light text-ink">{title}</h2>
        <div className="flex gap-2">
          <button className="inline-flex items-center gap-2 border border-rule px-4 py-2.5 text-xs uppercase tracking-[0.16em] text-ink" onClick={onAdd}>
            <Plus size={15} /> Add
          </button>
          <button className="inline-flex items-center gap-2 bg-teal px-4 py-2.5 text-xs uppercase tracking-[0.16em] text-white" onClick={onSave}>
            <Save size={15} /> Save
          </button>
        </div>
      </div>
      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={item.id} className="grid gap-4 border border-rule bg-paper p-4 lg:grid-cols-[minmax(0,1fr)_120px]">
            {renderItem(item)}
            <div className="flex items-start gap-2 lg:justify-end">
              <IconButton label="Move up" disabled={index === 0} onClick={() => onMove(item.id, -1)}><ArrowUp size={15} /></IconButton>
              <IconButton label="Move down" disabled={index === items.length - 1} onClick={() => onMove(item.id, 1)}><ArrowDown size={15} /></IconButton>
              {typeof item.id === 'number' && <IconButton label="Delete" danger onClick={() => onDelete(item.id)}><Trash2 size={15} /></IconButton>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
