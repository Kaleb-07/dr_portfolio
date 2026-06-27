import { useEffect, useMemo, useRef, useState } from 'react'
import { ChevronDown, Loader2, Plus, Save, Trash2, ArrowUp, ArrowDown } from 'lucide-react'
import api from '../api'

const fallbackAwards = [
  { id: 'award-1', title: 'University Recognition', organization: 'Academic Institution', year: new Date().getFullYear(), description: 'Recognition for sustained contribution.', image: '', category: 'professional' },
]

const fallbackMedia = [
  { id: 'media-1', title: 'Press Interview', type: 'interview', source: 'Newsroom', date: new Date().toISOString().slice(0, 10), description: 'Interview feature.', url: '', thumbnail: '' },
]

const emptyAward = () => ({ id: `award-${Date.now()}`, title: '', organization: '', year: new Date().getFullYear(), description: '', image: '', category: 'professional' })
const emptyMedia = () => ({ id: `media-${Date.now()}`, title: '', type: 'interview', source: '', date: new Date().toISOString().slice(0, 10), description: '', url: '', thumbnail: '' })
const reorderArray = (arr: any[], idx: number, dir: number) => {
  const next = [...arr]
  const target = idx + dir
  if (target < 0 || target >= next.length) return arr
  ;[next[idx], next[target]] = [next[target], next[idx]]
  return next
}

function Toast({ message, error }: { message: string; error: string }) {
  if (!message && !error) return null
  return <div className={`fixed bottom-6 right-6 rounded-lg px-5 py-3.5 text-sm font-medium shadow-lg ${error ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-700'}`}>{message || error}</div>
}

export default function AchievementEditor() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [awardEyebrow, setAwardEyebrow] = useState('Awards & Recognition')
  const [awardTitle, setAwardTitle] = useState('Honours that reflect a life of impact')
  const [awardDescription, setAwardDescription] = useState('Recognition from institutions and peers for sustained excellence in healthcare leadership, service, and innovation.')
  const [awards, setAwards] = useState<any[]>([])
  const [mediaEyebrow, setMediaEyebrow] = useState('Media & Speaking')
  const [mediaTitle, setMediaTitle] = useState('Voices of leadership')
  const [mediaDescription, setMediaDescription] = useState('Interviews, keynotes, podcasts, and press coverage that amplify the vision for healthcare transformation.')
  const [media, setMedia] = useState<any[]>([])
  const awardRef = useRef<HTMLDivElement>(null)
  const mediaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let active = true
    ;(async () => {
      setLoading(true)
      try {
        const res = await api.get('/cms/site-content')
        const sections = res.data?.sections || {}
        const awardsData = sections.recognition_awards || {}
        const mediaData = sections.media_gallery || {}
        if (!active) return
        setAwardEyebrow(awardsData.eyebrow || 'Awards & Recognition')
        setAwardTitle(awardsData.title || 'Honours that reflect a life of impact')
        setAwardDescription(awardsData.description || 'Recognition from institutions and peers for sustained excellence in healthcare leadership, service, and innovation.')
        setAwards((awardsData.blocks?.length ? awardsData.blocks : fallbackAwards).map((a: any, idx: number) => ({ id: a.id || `award-${idx}`, title: a.title || '', organization: a.organization || '', year: a.year || new Date().getFullYear(), description: a.description || '', image: a.image || '', category: a.category || 'professional' })))
        setMediaEyebrow(mediaData.eyebrow || 'Media & Speaking')
        setMediaTitle(mediaData.title || 'Voices of leadership')
        setMediaDescription(mediaData.description || 'Interviews, keynotes, podcasts, and press coverage that amplify the vision for healthcare transformation.')
        setMedia((mediaData.blocks?.length ? mediaData.blocks : fallbackMedia).map((m: any, idx: number) => ({ id: m.id || `media-${idx}`, title: m.title || '', type: m.type || 'interview', source: m.source || '', date: m.date || new Date().toISOString().slice(0, 10), description: m.description || '', url: m.url || '', thumbnail: m.thumbnail || '' })))
      } catch {
        setAwards(fallbackAwards.map((a: any) => ({ ...a })))
        setMedia(fallbackMedia.map((m: any) => ({ ...m })))
      } finally {
        if (active) setLoading(false)
      }
    })()
    return () => {
      active = false
    }
  }, [])

  const save = async () => {
    setSaving(true)
    setMessage('')
    setError('')
    try {
      await api.put('/cms/sections/recognition_awards', { section: { eyebrow: awardEyebrow, title: awardTitle, description: awardDescription }, blocks: awards })
      await api.put('/cms/sections/media_speaking', { section: { eyebrow: mediaEyebrow, title: mediaTitle, description: mediaDescription }, blocks: media })
      setMessage('Saved successfully')
    } catch {
      setError('Save failed')
    } finally {
      setSaving(false)
    }
  }

  const awardCount = useMemo(() => awards.length, [awards])
  const mediaCount = useMemo(() => media.length, [media])

  if (loading) return <div className="flex min-h-[50vh] items-center justify-center"><Loader2 className="animate-spin text-emerald-500" size={32} /></div>

  return (
    <div className="space-y-8">
      <Toast message={message} error={error} />
      <div className="flex items-end justify-between border-b border-rule pb-6">
        <div>
          <p className="section-tag">Achievements</p>
          <h1 className="mt-2 font-serif text-4xl font-light text-ink">Awards & Media</h1>
        </div>
        <button onClick={save} disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-teal px-5 py-3 text-white">
          {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
          Save
        </button>
      </div>
      <section ref={awardRef} className="rounded-2xl border border-rule bg-paper-card p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-widest text-emerald-600">{awardEyebrow}</p>
            <h2 className="font-serif text-2xl">{awardTitle}</h2>
            <p className="text-sm text-ink-mid">{awardDescription}</p>
          </div>
          <button type="button" onClick={() => setAwards((p) => [...p, emptyAward()])} className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm"><Plus size={14} /> Add Award</button>
        </div>
        <div className="mt-4 space-y-3">
          {awards.map((award, idx) => (
            <details key={award.id} className="rounded-xl border border-rule bg-white p-4">
              <summary className="cursor-pointer list-none font-medium flex items-center justify-between">
                <span>{award.title || `Award ${idx + 1}`}</span>
                <ChevronDown size={16} />
              </summary>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <input className="rounded-lg border px-3 py-2" value={award.title} onChange={(e) => setAwards((p) => p.map((it, i) => i === idx ? { ...it, title: e.target.value } : it))} placeholder="Title" />
                <input className="rounded-lg border px-3 py-2" value={award.organization} onChange={(e) => setAwards((p) => p.map((it, i) => i === idx ? { ...it, organization: e.target.value } : it))} placeholder="Organization" />
                <input className="rounded-lg border px-3 py-2" value={award.year} onChange={(e) => setAwards((p) => p.map((it, i) => i === idx ? { ...it, year: e.target.value } : it))} placeholder="Year" />
                <input className="rounded-lg border px-3 py-2" value={award.image} onChange={(e) => setAwards((p) => p.map((it, i) => i === idx ? { ...it, image: e.target.value } : it))} placeholder="Image URL" />
                <textarea className="md:col-span-2 rounded-lg border px-3 py-2" rows={3} value={award.description} onChange={(e) => setAwards((p) => p.map((it, i) => i === idx ? { ...it, description: e.target.value } : it))} placeholder="Description" />
              </div>
              <div className="mt-3 flex justify-end gap-2">
                <button type="button" onClick={() => setAwards((p) => reorderArray(p, idx, -1))}><ArrowUp size={16} /></button>
                <button type="button" onClick={() => setAwards((p) => reorderArray(p, idx, 1))}><ArrowDown size={16} /></button>
                <button type="button" onClick={() => setAwards((p) => p.filter((_, i) => i !== idx))}><Trash2 size={16} /></button>
              </div>
            </details>
          ))}
        </div>
        <p className="mt-3 text-xs text-ink-muted">{awardCount} awards loaded</p>
      </section>

      <section ref={mediaRef} className="rounded-2xl border border-rule bg-paper-card p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-widest text-emerald-600">{mediaEyebrow}</p>
            <h2 className="font-serif text-2xl">{mediaTitle}</h2>
            <p className="text-sm text-ink-mid">{mediaDescription}</p>
          </div>
          <button type="button" onClick={() => setMedia((p) => [...p, emptyMedia()])} className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm"><Plus size={14} /> Add Media</button>
        </div>
        <div className="mt-4 space-y-3">
          {media.map((item, idx) => (
            <details key={item.id} className="rounded-xl border border-rule bg-white p-4">
              <summary className="cursor-pointer list-none font-medium flex items-center justify-between">
                <span>{item.title || `Media ${idx + 1}`}</span>
                <ChevronDown size={16} />
              </summary>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <input className="rounded-lg border px-3 py-2" value={item.title} onChange={(e) => setMedia((p) => p.map((it, i) => i === idx ? { ...it, title: e.target.value } : it))} placeholder="Title" />
                <input className="rounded-lg border px-3 py-2" value={item.type} onChange={(e) => setMedia((p) => p.map((it, i) => i === idx ? { ...it, type: e.target.value } : it))} placeholder="Type" />
                <input className="rounded-lg border px-3 py-2" value={item.source} onChange={(e) => setMedia((p) => p.map((it, i) => i === idx ? { ...it, source: e.target.value } : it))} placeholder="Source" />
                <input className="rounded-lg border px-3 py-2" value={item.date} onChange={(e) => setMedia((p) => p.map((it, i) => i === idx ? { ...it, date: e.target.value } : it))} placeholder="Date" />
                <textarea className="md:col-span-2 rounded-lg border px-3 py-2" rows={3} value={item.description} onChange={(e) => setMedia((p) => p.map((it, i) => i === idx ? { ...it, description: e.target.value } : it))} placeholder="Description" />
              </div>
              <div className="mt-3 flex justify-end gap-2">
                <button type="button" onClick={() => setMedia((p) => reorderArray(p, idx, -1))}><ArrowUp size={16} /></button>
                <button type="button" onClick={() => setMedia((p) => reorderArray(p, idx, 1))}><ArrowDown size={16} /></button>
                <button type="button" onClick={() => setMedia((p) => p.filter((_, i) => i !== idx))}><Trash2 size={16} /></button>
              </div>
            </details>
          ))}
        </div>
        <p className="mt-3 text-xs text-ink-muted">{mediaCount} media entries loaded</p>
      </section>
    </div>
  )
}
