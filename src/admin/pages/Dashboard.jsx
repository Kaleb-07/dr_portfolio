import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight, Clock3, Crown, Image, Mail, Sparkles, Trophy, Zap } from 'lucide-react'
import api from '../api'

/* --------------- Section navigation cards (Hero removed) --------------- */
const sectionCards = [
  {
    title: 'Awards',
    description: 'Recognition entries & order.',
    path: '/admin/awards',
    icon: Trophy,
    accent: 'from-amber-500 to-yellow-500',
  },
  {
    title: 'Leadership',
    description: 'Executive profiles & board.',
    path: '/admin/leadership',
    icon: Crown,
    accent: 'from-purple-500 to-pink-500',
  },
  {
    title: 'Timeline',
    description: 'Career milestones & story beats.',
    path: '/admin/timeline',
    icon: Clock3,
    accent: 'from-blue-500 to-cyan-500',
  },
]

export default function Dashboard() {
  // ---------- Messages ----------
  const [messageCount, setMessageCount] = useState(null) // total messages
  const [newMessageCount, setNewMessageCount] = useState(0) // new since last visit
  const [messageError, setMessageError] = useState(false)

  // ---------- Gallery ----------
  const [galleryCount, setGalleryCount] = useState(null)
  const [galleryError, setGalleryError] = useState(false)

  useEffect(() => {
    const lastSeen = localStorage.getItem('admin_last_message_seen')
    const lastSeenDate = lastSeen ? new Date(lastSeen) : null

    const fetchMessages = async () => {
      try {
        const res = await api.get('/contact/messages')
        const messages = res.data || []
        setMessageCount(messages.length)

        if (lastSeenDate) {
          const newMsgs = messages.filter((m) => new Date(m.created_at) > lastSeenDate)
          setNewMessageCount(newMsgs.length)
        } else {
          // first visit – all messages considered new
          setNewMessageCount(messages.length)
        }
      } catch {
        setMessageError(true)
        setMessageCount('?')
      }
    }

    const fetchGallery = async () => {
      try {
        const res = await api.get('/cms/sections/about_gallery')
        const blocks = res.data?.blocks || []
        setGalleryCount(blocks.length)
      } catch {
        setGalleryError(true)
        setGalleryCount('?')
      }
    }

    fetchMessages()
    fetchGallery()
  }, [])

  const handleMessageClick = () => {
    // Mark all messages as seen
    localStorage.setItem('admin_last_message_seen', new Date().toISOString())
    setNewMessageCount(0)
  }

  return (
    <section className="mx-auto max-w-7xl">
      {/* Welcome Header */}
      <div className="mb-12">
        <div className="mb-6 flex items-center gap-3">
          <div className="h-1 w-12 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500"></div>
          <p className="text-xs font-bold uppercase tracking-widest text-emerald-600">Dashboard</p>
        </div>
        <h1 className="text-5xl font-light text-slate-900 mb-4">Welcome back</h1>
        <p className="max-w-2xl text-lg font-light text-slate-600">
          At a glance – see what’s new and where to go next.
        </p>
      </div>

      {/* ═══════ Notification Cards ═══════ */}
      <div className="grid gap-6 md:grid-cols-2 mb-12">
        {/* ── Messages Card ── */}
        <Link
          to="/admin/contact/messages"
          onClick={handleMessageClick}
          className="group relative overflow-hidden rounded-2xl border border-slate-200/60 bg-white/70 backdrop-blur-sm p-6 sm:p-8 transition-all duration-300 hover:border-indigo-300 hover:shadow-lg"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-blue-50 opacity-0 group-hover:opacity-100 transition-opacity"></div>

          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-200">
                  <Mail size={24} />
                </div>
                {newMessageCount > 0 && (
                  <span className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white">
                    {newMessageCount}
                  </span>
                )}
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-indigo-600 mb-1">
                  Contact Inbox
                </p>
                <h3 className="text-2xl font-semibold text-slate-900">Messages</h3>
                <p className="text-sm text-slate-600 mt-1">
                  {messageError
                    ? 'Could not load count'
                    : messageCount === null
                      ? 'Loading…'
                      : newMessageCount > 0
                        ? `${newMessageCount} new message${newMessageCount !== 1 ? 's' : ''}`
                        : `${messageCount} message${messageCount !== 1 ? 's' : ''} total`}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {newMessageCount > 0 ? (
                <span className="animate-pulse inline-flex items-center justify-center h-8 px-3 rounded-full bg-red-100 text-red-600 text-sm font-bold">
                  New
                </span>
              ) : (
                messageCount > 0 && (
                  <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-indigo-100 text-indigo-600 text-sm font-bold">
                    {messageCount}
                  </span>
                )
              )}
              <ArrowUpRight
                className="text-indigo-400 group-hover:translate-x-1 transition-transform"
                size={20}
              />
            </div>
          </div>
        </Link>

        {/* ── Gallery Card ── */}
        <Link
          to="/admin/profile/gallery"
          className="group relative overflow-hidden rounded-2xl border border-slate-200/60 bg-white/70 backdrop-blur-sm p-6 sm:p-8 transition-all duration-300 hover:border-pink-300 hover:shadow-lg"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-pink-50 to-rose-50 opacity-0 group-hover:opacity-100 transition-opacity"></div>

          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-500 to-rose-500 text-white shadow-lg shadow-pink-200">
                <Image size={24} />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-rose-600 mb-1">
                  Visual Archive
                </p>
                <h3 className="text-2xl font-semibold text-slate-900">Gallery</h3>
                <p className="text-sm text-slate-600 mt-1">
                  {galleryError
                    ? 'Could not load count'
                    : galleryCount === null
                      ? 'Loading…'
                      : `${galleryCount} image${galleryCount !== 1 ? 's' : ''} uploaded`}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {galleryCount > 0 && (
                <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-rose-100 text-rose-600 text-sm font-bold">
                  {galleryCount}
                </span>
              )}
              <ArrowUpRight
                className="text-rose-400 group-hover:translate-x-1 transition-transform"
                size={20}
              />
            </div>
          </div>
        </Link>
      </div>

      {/* ═══════ Jump to Editor ═══════ */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-slate-900 mb-6">Jump to Editor</h2>
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {sectionCards.map((card) => {
            const Icon = card.icon
            return (
              <Link
                key={card.title}
                to={card.path}
                className="group relative rounded-2xl border border-slate-200/60 bg-white/70 backdrop-blur-sm p-6 transition-all duration-300 hover:border-slate-300 hover:shadow-lg"
              >
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/0 to-white/0 group-hover:from-slate-50 group-hover:to-slate-100 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                <div className="relative z-10">
                  <div
                    className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${card.accent} text-white shadow-md transition-transform group-hover:scale-110`}
                  >
                    <Icon size={22} />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-1">{card.title}</h3>
                  <p className="text-sm text-slate-600">{card.description}</p>
                  <div className="mt-4 flex justify-end">
                    <ArrowUpRight
                      className="text-slate-400 group-hover:text-slate-600 transition-colors"
                      size={18}
                    />
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Pro tip */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-100 to-slate-50 border border-slate-200/60 p-6 sm:p-8">
        <div className="flex items-start gap-4">
          <Zap className="h-6 w-6 text-emerald-600 flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Pro Tip</h3>
            <p className="text-sm font-light text-slate-600 leading-relaxed">
              Click on <strong>Messages</strong> to review and reply to contact form submissions.
              Use <strong>Gallery</strong> to manage the visual archive – upload, reorder, or remove
              images. All changes are saved per section.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
