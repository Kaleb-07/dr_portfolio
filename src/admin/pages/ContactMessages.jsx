import { useEffect, useState } from 'react'
import api from '../api'
import {
  Loader2,
  Trash2,
  Mail,
  Phone,
  Calendar,
  MessageSquare,
  ChevronDown,
  Zap,
} from 'lucide-react'

const IconButton = ({ label, onClick, children, disabled, danger = false }) => (
  <button
    type="button"
    aria-label={label}
    title={label}
    disabled={disabled}
    onClick={onClick}
    className={`inline-flex h-9 w-9 items-center justify-center rounded-lg transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-40 ${
      danger
        ? 'bg-red-50 text-red-600 hover:bg-red-100 hover:scale-110 active:scale-95'
        : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:scale-110 active:scale-95'
    }`}
  >
    {children}
  </button>
)

export default function ContactMessages() {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)
  const [expanded, setExpanded] = useState(false)

  const fetchMessages = async () => {
    try {
      const res = await api.get('/contact/messages')
      setMessages(res.data)
    } catch (err) {
      console.error('Failed to load messages:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMessages()
  }, [])

  const deleteMessage = async (id) => {
    await api.delete(`/contact/messages/${id}`)
    setMessages((prev) => prev.filter((m) => m.id !== id))
    if (selected?.id === id) setSelected(null)
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 size={32} className="animate-spin text-emerald-500" />
      </div>
    )
  }

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100/60 py-10 px-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10">
          <p className="text-xs font-bold uppercase tracking-widest text-emerald-600 flex items-center gap-2">
            <Zap size={14} /> Messages
          </p>
          <h1 className="mt-3 text-4xl font-bold text-slate-900 sm:text-5xl">Contact Messages</h1>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_1.5fr]">
          {/* List Card */}
          <div className="rounded-2xl border border-slate-200 bg-white/80 backdrop-blur-sm p-6 shadow-sm transition-all duration-300 hover:shadow-lg hover:border-emerald-300">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Inbox</h2>
            <div className="space-y-2 max-h-[70vh] overflow-y-auto">
              {messages.length === 0 ? (
                <div className="rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
                  <p className="text-slate-600">No messages yet.</p>
                </div>
              ) : (
                messages.map((m) => (
                  <div
                    key={m.id}
                    onClick={() => setSelected(m)}
                    className={`rounded-2xl border bg-white/80 backdrop-blur-sm shadow-sm transition-all duration-300 hover:shadow-lg hover:border-emerald-300 cursor-pointer ${
                      selected?.id === m.id
                        ? 'border-emerald-400 ring-2 ring-emerald-400/30 shadow-xl shadow-emerald-100/50'
                        : 'border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between p-5">
                      <div className="flex items-center gap-4">
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 text-sm font-bold text-white shadow-md">
                          {m.name.charAt(0).toUpperCase()}
                        </span>
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600">
                            {m.inquiry_type}
                          </p>
                          <h3 className="text-base font-semibold text-slate-900 line-clamp-1">
                            {m.subject}
                          </h3>
                          <p className="text-sm text-slate-500">{m.name}</p>
                        </div>
                      </div>
                      <ChevronDown size={18} className="text-slate-400" />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Detail Card */}
          <div className="rounded-2xl border border-slate-200 bg-white/80 backdrop-blur-sm p-6 shadow-sm transition-all duration-300 hover:shadow-lg hover:border-emerald-300">
            {selected ? (
              <>
                <div className="flex items-center justify-between mb-6 border-b border-slate-200 pb-6">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-emerald-600 flex items-center gap-2">
                      <MessageSquare size={14} /> Message Details
                    </p>
                    <h2 className="mt-2 text-2xl font-bold text-slate-900">{selected.subject}</h2>
                  </div>
                  <IconButton label="Delete" danger onClick={() => deleteMessage(selected.id)}>
                    <Trash2 size={16} />
                  </IconButton>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Mail size={16} className="text-emerald-500" />
                      <span className="font-medium">Email:</span> {selected.email}
                    </div>
                    {selected.phone && (
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Phone size={16} className="text-emerald-500" />
                        <span className="font-medium">Phone:</span> {selected.phone}
                      </div>
                    )}
                    {selected.organization && (
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <span className="font-medium">Organization:</span> {selected.organization}
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Calendar size={16} className="text-emerald-500" />
                      <span className="font-medium">Date:</span>{' '}
                      {new Date(selected.created_at).toLocaleString()}
                    </div>
                  </div>

                  <div className="border-t border-slate-200 pt-4">
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">
                      Message
                    </p>
                    <div className="rounded-xl bg-slate-50 p-4 text-sm text-slate-700 whitespace-pre-wrap">
                      {selected.message}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
                <MessageSquare size={32} className="mx-auto text-slate-400 mb-2" />
                <p className="text-slate-600">Select a message to read</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
