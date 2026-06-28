import { useState, useRef } from 'react'
import { Upload, Loader2, X, Image as ImageIcon } from 'lucide-react'
import api from '../api'

interface MediaPickerProps {
  currentUrl?: string
  onUpload: (url: string) => void
}

export default function MediaPicker({ currentUrl, onUpload }: MediaPickerProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentUrl || null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append('file', file)

    setUploading(true)
    setError('')
    try {
      const res = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      const url = res.data.url
      setPreviewUrl(url)
      onUpload(url)
    } catch (err: any) {
      setError(err.response?.data?.error || 'Upload failed')
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const clearImage = () => {
    setPreviewUrl(null)
    onUpload('')
  }

  return (
    <div className="space-y-3">
      {previewUrl ? (
        <div className="relative group overflow-hidden rounded-xl border border-slate-200 w-full max-w-sm">
          <img src={previewUrl} alt="" className="w-full h-40 object-cover" />
          <button
            onClick={clearImage}
            className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm rounded-full p-1 text-slate-600 hover:text-red-600 hover:bg-white transition-all"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <div className="w-full max-w-sm h-40 flex items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 text-slate-400">
          <ImageIcon size={32} />
        </div>
      )}

      <div className="flex items-center gap-3">
        <label className="inline-flex items-center gap-2 rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer">
          <Upload size={16} />
          {uploading ? 'Uploading...' : 'Upload Image'}
          <input
            type="file"
            accept="image/*"
            className="sr-only"
            ref={fileInputRef}
            onChange={handleFileChange}
            disabled={uploading}
          />
        </label>
        {uploading && <Loader2 size={18} className="animate-spin text-emerald-500" />}
      </div>

      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  )
}
