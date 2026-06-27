import { useState, useEffect } from 'react'
import { Save } from 'lucide-react'

export default function EducationEditor() {
  const [formData, setFormData] = useState({
    section_type: 'education',
    eyebrow: '',
    title: '',
    subtitle: '',
    description: '',
    image_url: '',
    image_alt: '',
    blocks: [],
  })
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const fetchEducation = async () => {
      setLoading(true)
      try {
        const response = await fetch('/api/cms/education')
        const data = await response.json()
        if (data.success && data.data) {
          setFormData({
            section_type: data.data.section_type || 'education',
            eyebrow: data.data.eyebrow || '',
            title: data.data.title || '',
            subtitle: data.data.subtitle || '',
            description: data.data.description || '',
            image_url: data.data.image_url || '',
            image_alt: data.data.image_alt || '',
            blocks: data.data.blocks || [],
          })
        }
      } catch (error) {
        console.error('Failed to fetch education:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchEducation()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/cms/education', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        alert('Education updated successfully!')
      }
    } catch (error) {
      console.error('Failed to save education:', error)
      alert('Failed to save changes')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="text-center py-12">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Education</h1>
        <p className="text-gray-600 mt-1">Manage education content</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Eyebrow</label>
            <input
              type="text"
              value={formData.eyebrow}
              onChange={(e) => setFormData({ ...formData, eyebrow: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save size={20} />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  )
}
