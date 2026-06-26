import { useEffect, useState } from 'react'
import api from '../api'
import {
  Loader2,
  Trash2,
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  MessageSquare,
  Check,
  CheckCheck,
} from 'lucide-react'

const LuxuryContactMessages = () => {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)
  const [readMessages, setReadMessages] = useState(new Set())

  const STORAGE_KEY = 'luxury_messages_read_status'

  const fetchMessages = async () => {
    try {
      const res = await api.get('/contact/messages')
      setMessages(res.data)

      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        setReadMessages(new Set(JSON.parse(saved)))
      }
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

  const handleSelectMessage = async (message) => {
    setSelected(message)
    const newReadSet = new Set([...readMessages, message.id])
    setReadMessages(newReadSet)

    localStorage.setItem(STORAGE_KEY, JSON.stringify([...newReadSet]))

    try {
      await api.patch(`/contact/messages/${message.id}`, { read: true })
    } catch (err) {
      console.log('Message marked as read locally')
    }
  }

  const unreadCount = messages.filter((m) => !readMessages.has(m.id)).length

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 size={40} className="animate-spin text-emerald-500" />
          <p className="text-sm text-slate-600 font-semibold">Loading your messages</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full bg-gradient-to-br from-slate-50 via-white to-slate-50 font-sans">
      <div
        className={`
          ${selected ? 'hidden' : 'flex'} 
          md:flex md:w-96 md:border-r md:border-slate-200/60 md:bg-white/40 md:backdrop-blur-xl md:flex-col
          w-full absolute md:relative h-full md:h-auto z-40 md:z-auto
          bg-white
        `}
      >
        <div className="px-4 md:px-6 py-6 md:py-8 border-b border-slate-200/60">
          <div className="flex items-baseline gap-3">
            <h1 className="text-3xl font-black text-slate-900 font-serif tracking-tight">
              Messages
            </h1>
            {unreadCount > 0 && (
              <span className="px-3 py-1.5 rounded-full bg-rose-600 text-white text-xs font-black shadow-md shadow-rose-600/20">
                {unreadCount}
              </span>
            )}
          </div>
          <p className="text-sm font-semibold text-slate-600 mt-2">{messages.length} total</p>
        </div>

        <div className="flex-1 overflow-y-auto scroll-smooth">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full px-6">
              <div className="text-center">
                <MessageSquare size={40} className="mx-auto text-slate-300 mb-3" />
                <p className="text-slate-600 text-sm font-bold">No messages yet</p>
              </div>
            </div>
          ) : (
            <div className="space-y-1 p-4">
              {messages.map((message) => {
                const isSelected = selected?.id === message.id
                const isRead = readMessages.has(message.id)

                return (
                  <button
                    key={message.id}
                    onClick={() => handleSelectMessage(message)}
                    className={`w-full text-left px-4 py-3 rounded-2xl transition-all duration-200 group relative overflow-hidden ${
                      isSelected
                        ? 'bg-emerald-50 shadow-sm'
                        : 'hover:bg-slate-100/60 active:bg-slate-100'
                    }`}
                  >
                    {!isRead && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-rose-500 transition-opacity duration-300" />
                    )}

                    <div className="flex items-center gap-3">
                      <div
                        className={`h-12 w-12 rounded-full flex items-center justify-center font-semibold text-white transition-all duration-200 flex-shrink-0 ${
                          isSelected
                            ? 'bg-emerald-500 shadow-md'
                            : 'bg-emerald-400/80 group-hover:bg-emerald-500'
                        }`}
                      >
                        {message.name.charAt(0).toUpperCase()}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline gap-2">
                          <p
                            className={`text-sm font-black truncate ${
                              isRead ? 'text-slate-700' : 'text-slate-900 font-black'
                            }`}
                          >
                            {message.name}
                          </p>
                          {!isRead && (
                            <span className="h-2.5 w-2.5 rounded-full bg-rose-500 flex-shrink-0" />
                          )}
                        </div>
                        <p className="text-xs font-bold uppercase tracking-wide text-emerald-600 mt-0.5">
                          {message.inquiry_type}
                        </p>
                        <p className="text-sm font-semibold text-slate-700 truncate mt-1">
                          {message.subject}
                        </p>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col bg-white/30 md:bg-white/30 backdrop-blur-sm w-full">
        {selected ? (
          <>
            <div className="border-b border-slate-200/40 px-4 md:px-8 py-4 md:py-6 flex items-center justify-between bg-white/20 md:bg-white/20 backdrop-blur-sm">
              <div className="flex items-center gap-3 md:gap-4 min-w-0">
                <button
                  onClick={() => setSelected(null)}
                  className="md:hidden flex-shrink-0 p-2 hover:bg-emerald-50 text-emerald-600 rounded-lg transition-colors"
                >
                  <ArrowLeft size={20} />
                </button>

                <div className="h-12 md:h-14 w-12 md:w-14 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-black shadow-md text-lg flex-shrink-0">
                  {selected.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg md:text-2xl font-black text-slate-900 font-serif truncate">
                    {selected.subject}
                  </h2>
                  <p className="text-xs md:text-sm font-bold text-slate-700 mt-0.5 flex items-center gap-2">
                    {selected.name}
                    <span className="flex items-center gap-1 text-emerald-600 font-bold">
                      <CheckCheck size={14} />
                      Read
                    </span>
                  </p>
                </div>
              </div>
              <button
                onClick={() => deleteMessage(selected.id)}
                className="p-2 md:p-2.5 hover:bg-red-50 text-red-600 rounded-xl transition-colors duration-200 active:scale-95 flex-shrink-0"
                title="Delete message"
              >
                <Trash2 size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6 md:py-8">
              <div className="max-w-3xl space-y-6 md:space-y-8">
                <div className="grid grid-cols-2 gap-3 md:gap-6">
                  <div className="bg-white/60 backdrop-blur-sm rounded-xl md:rounded-2xl p-3 md:p-5 border border-slate-200/40">
                    <p className="text-xs font-black uppercase tracking-wider text-emerald-600 mb-2">
                      Email
                    </p>
                    <p className="text-slate-900 font-bold text-xs md:text-base break-all">
                      {selected.email}
                    </p>
                  </div>

                  {selected.phone && (
                    <div className="bg-white/60 backdrop-blur-sm rounded-xl md:rounded-2xl p-3 md:p-5 border border-slate-200/40">
                      <p className="text-xs font-black uppercase tracking-wider text-emerald-600 mb-2">
                        Phone
                      </p>
                      <p className="text-slate-900 font-bold text-xs md:text-base">
                        {selected.phone}
                      </p>
                    </div>
                  )}

                  {selected.organization && (
                    <div className="bg-white/60 backdrop-blur-sm rounded-xl md:rounded-2xl p-3 md:p-5 border border-slate-200/40">
                      <p className="text-xs font-black uppercase tracking-wider text-emerald-600 mb-2">
                        Organization
                      </p>
                      <p className="text-slate-900 font-bold text-xs md:text-base">
                        {selected.organization}
                      </p>
                    </div>
                  )}

                  <div className="bg-white/60 backdrop-blur-sm rounded-xl md:rounded-2xl p-3 md:p-5 border border-slate-200/40">
                    <p className="text-xs font-black uppercase tracking-wider text-emerald-600 mb-2">
                      Received
                    </p>
                    <p className="text-slate-900 font-bold text-xs md:text-base">
                      {new Date(selected.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-black uppercase tracking-wider text-emerald-600 mb-3">
                    Inquiry Type
                  </p>
                  <div className="inline-block">
                    <span className="px-3 md:px-4 py-1.5 md:py-2 bg-emerald-100 text-emerald-900 rounded-full text-xs md:text-sm font-black border border-emerald-300">
                      {selected.inquiry_type}
                    </span>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-black uppercase tracking-wider text-emerald-600 mb-3">
                    Message
                  </p>
                  <div className="bg-gradient-to-br from-slate-50 to-slate-100/50 rounded-xl md:rounded-2xl p-4 md:p-6 border border-slate-200/40 backdrop-blur-sm">
                    <p className="text-slate-800 leading-relaxed whitespace-pre-wrap text-xs md:text-base font-medium">
                      {selected.message}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full px-4 md:px-8">
            <div className="text-center">
              <MessageSquare size={56} className="mx-auto text-slate-300 mb-4" />
              <p className="text-slate-700 text-lg md:text-lg font-bold font-serif">
                Select a message to read
              </p>
              <p className="text-slate-500 text-xs md:text-sm mt-2 font-semibold">
                Messages will appear as read once selected
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default LuxuryContactMessages
