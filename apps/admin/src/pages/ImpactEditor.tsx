import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Loader2, Save } from 'lucide-react'
import api from '../api'

const SECTION_MAP: Record<string, { endpoint: string; title: string; subtitle: string }> = {
  'public-service': { endpoint: 'public-service', title: 'Public Service', subtitle: 'National & Continental Leadership' },
  leadership: { endpoint: 'leadership', title: 'Leadership', subtitle: 'Executive leadership spanning healthcare organizations, boards, and institutions.' },
  foundation: { endpoint: 'foundation_story', title: 'Foundation', subtitle: 'Service and community impact' },
}

export default function ImpactEditor() {
  const { slug = 'public-service' } = useParams()
  const sectionMeta = SECTION_MAP[slug] || SECTION_MAP['public-service']
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({ eyebrow: '', title: '', subtitle: '', description: '' })

  useEffect(() => {
    let active = true
    ;(async () => {
      setLoading(true)
      try {
        const res = await api.get(`/impact/${sectionMeta.endpoint}`)
        const data = res.data || {}
        if (!active) return
        setFormData({
          eyebrow: data.eyebrow || sectionMeta.title,
          title: data.title || sectionMeta.title,
          subtitle: data.subtitle || sectionMeta.subtitle,
          description: data.description || '',
        })
      } catch {
        if (active) setFormData({ eyebrow: sectionMeta.title, title: sectionMeta.title, subtitle: sectionMeta.subtitle, description: '' })
      } finally {
        if (active) setLoading(false)
      }
    })()
    return () => {
      active = false
    }
  }, [sectionMeta.endpoint, sectionMeta.subtitle, sectionMeta.title])

  const titleLabel = useMemo(() => formData.title || sectionMeta.title, [formData.title, sectionMeta.title])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      await api.put(`/impact/${sectionMeta.endpoint}`, formData)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="flex min-h-[50vh] items-center justify-center"><Loader2 className="animate-spin text-emerald-500" size={32} /></div>

  return (
    <form onSubmit={handleSave} className="mx-auto max-w-4xl space-y-6">
      <div className="border-b border-rule pb-6">
        <p className="section-tag">Impact</p>
        <h1 className="mt-2 font-serif text-4xl font-light text-ink">{titleLabel}</h1>
      </div>
      <div className="rounded-2xl border border-rule bg-paper-card p-5 space-y-4">
        <input className="w-full rounded-lg border px-3 py-2" value={formData.eyebrow} onChange={(e) => setFormData((p) => ({ ...p, eyebrow: e.target.value }))} placeholder="Eyebrow" />
        <input className="w-full rounded-lg border px-3 py-2" value={formData.title} onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))} placeholder="Title" />
        <input className="w-full rounded-lg border px-3 py-2" value={formData.subtitle} onChange={(e) => setFormData((p) => ({ ...p, subtitle: e.target.value }))} placeholder="Subtitle" />
        <textarea className="w-full rounded-lg border px-3 py-2" rows={5} value={formData.description} onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))} placeholder="Description" />
      </div>
      <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-teal px-5 py-3 text-white">
        {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
        Save
      </button>
    </form>
  )
}
