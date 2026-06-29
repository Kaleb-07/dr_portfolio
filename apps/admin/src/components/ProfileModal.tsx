/* eslint-disable react-hooks/set-state-in-effect */
import { X, Loader2, CheckCircle2 } from 'lucide-react'
import { useState, useEffect } from 'react'
import api from '../api'

interface ProfileModalProps {
  open: boolean
  onClose: () => void
  currentName: string
  currentEmail: string
  onProfileUpdate: (name: string, email: string) => void
}

export default function ProfileModal({
  open,
  onClose,
  currentName,
  currentEmail,
  onProfileUpdate,
}: ProfileModalProps) {
  const [name, setName] = useState(currentName)
  const [email, setEmail] = useState(currentEmail)
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    setName(currentName)
    setEmail(currentEmail)
    setPassword('')
    setMessage('')
    setError('')
  }, [open, currentName, currentEmail])

  const handleSave = async () => {
    setLoading(true)
    setMessage('')
    setError('')
    try {
      const res = await api.put('/auth/profile', {
        name,
        email,
        password: password || undefined,
      })
      setMessage('Profile updated!')
      onProfileUpdate(res.data.admin.name || name, res.data.admin.email || email)
      setTimeout(() => onClose(), 1500)
    } catch {
      setError('Update failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full mx-4 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800">Edit Profile</h2>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <label className="block">
            <span className="text-sm font-medium text-gray-700">Name</span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-gray-700">Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-gray-700">
              New Password (leave blank to keep)
            </span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
            />
          </label>

          {message && (
            <div className="flex items-center gap-2 text-sm text-emerald-600 bg-emerald-50 rounded-lg p-2">
              <CheckCircle2 size={16} />
              {message}
            </div>
          )}
          {error && <div className="text-sm text-red-600 bg-red-50 rounded-lg p-2">{error}</div>}
        </div>

        <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700 disabled:opacity-50"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : null}
            Save
          </button>
        </div>
      </div>
    </div>
  )
}
