import { useState } from 'react'
import { Loader2, X } from 'lucide-react'
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
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  // Reset fields when modal opens with new current values
  if (open && (name !== currentName || email !== currentEmail)) {
    setName(currentName)
    setEmail(currentEmail)
    setOldPassword('')
    setNewPassword('')
    setConfirmPassword('')
    setMessage('')
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('')
    setError('')

    if (!name.trim() || !email.trim()) {
      setError('Name and email are required.')
      return
    }

    // If any password field is filled, all must be filled and valid
    const changingPassword = oldPassword || newPassword || confirmPassword
    if (changingPassword) {
      if (!oldPassword || !newPassword || !confirmPassword) {
        setError('All password fields are required to change the password.')
        return
      }
      if (newPassword.length < 6) {
        setError('New password must be at least 6 characters.')
        return
      }
      if (newPassword !== confirmPassword) {
        setError('Passwords do not match.')
        return
      }
    }

    setSaving(true)
    try {
      const payload: any = { name: name.trim(), email: email.trim() }
      if (changingPassword) {
        payload.oldPassword = oldPassword
        payload.newPassword = newPassword
      }

      await api.put('/auth/profile', payload)

      onProfileUpdate(name.trim(), email.trim())
      setMessage('Profile updated successfully.')
      setTimeout(onClose, 1500)
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Failed to update profile.'
      setError(msg)
    } finally {
      setSaving(false)
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-slate-400 hover:text-slate-700"
        >
          <X size={20} />
        </button>
        <h2 className="text-xl font-bold text-slate-900 mb-4">Edit Profile</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Your name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="admin@example.com"
            />
          </div>

          <hr className="border-slate-200" />

          <p className="text-sm font-semibold text-slate-700">Change Password (optional)</p>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Current Password
            </label>
            <input
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="••••••••"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="••••••••"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Confirm New Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="••••••••"
            />
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}
          {message && <p className="text-emerald-600 text-sm">{message}</p>}

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-teal-600 text-white font-semibold py-2 rounded-lg hover:bg-teal-700 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {saving ? <Loader2 size={18} className="animate-spin" /> : null}
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  )
}
