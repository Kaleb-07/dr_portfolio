import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight, Clock3, Crown, Image, Mail, Trophy, Zap } from 'lucide-react'
import api from '../api'

const sectionCards = [
  { title: 'Awards', description: 'Recognition entries & order.', path: '/achievements', icon: Trophy, accent: 'from-amber-500 to-yellow-500' },
  { title: 'Leadership', description: 'Executive profiles & board.', path: '/impact/leadership', icon: Crown, accent: 'from-purple-500 to-pink-500' },
  { title: 'Timeline', description: 'Career milestones & story beats.', path: '/story', icon: Clock3, accent: 'from-blue-500 to-cyan-500' },
]

export default function Dashboard() {
  const [messageCount, setMessageCount] = useState<number | '?'>('?')
  const [messageError, setMessageError] = useState(false)
  const [galleryCount, setGalleryCount] = useState<number | '?'>('?')
  const [galleryError, setGalleryError] = useState(false)

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await api.get('/contact/messages')
        const messages = res.data || []
        setMessageCount(messages.length)
      } catch {
        setMessageError(true)
        setMessageCount('?')
      }
    }
    const fetchGallery = async () => {
      try {
        const res = await api.get('/cms/sections/about_gallery')
        setGalleryCount(res.data?.blocks?.length || 0)
      } catch {
        setGalleryError(true)
        setGalleryCount('?')
      }
    }
    fetchMessages()
    fetchGallery()
  }, [])

  return (
    <section className="mx-auto max-w-7xl">
      <div className="mb-12">
        <div className="mb-6 flex items-center gap-3">
          <div className="h-1 w-12 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500" />
          <p className="text-xs font-bold uppercase tracking-widest text-emerald-600">Dashboard</p>
        </div>
        <h1 className="text-5xl font-light text-slate-900 mb-4">Welcome back</h1>
        <p className="max-w-2xl text-lg font-light text-slate-600">At a glance - see what's new and where to go next.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 mb-12">
        <Link to="/contact" className="group relative overflow-hidden rounded-2xl border border-slate-200/60 bg-white/70 backdrop-blur-sm p-6 sm:p-8 transition-all duration-300 hover:border-indigo-300 hover:shadow-lg">
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-200">
                <Mail size={24} />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-indigo-600 mb-1">Contact Inbox</p>
                <h3 className="text-2xl font-semibold text-slate-900">Messages</h3>
                <p className="text-sm text-slate-600 mt-1">{messageError ? 'Could not load count' : messageCount === null ? 'Loading…' : `${messageCount} total`}</p>
              </div>
            </div>
            <ArrowUpRight className="text-indigo-400 group-hover:translate-x-1 transition-transform" size={20} />
          </div>
        </Link>

        <Link to="/media" className="group relative overflow-hidden rounded-2xl border border-slate-200/60 bg-white/70 backdrop-blur-sm p-6 sm:p-8 transition-all duration-300 hover:border-pink-300 hover:shadow-lg">
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-500 to-rose-500 text-white shadow-lg shadow-pink-200">
                <Image size={24} />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-rose-600 mb-1">Visual Archive</p>
                <h3 className="text-2xl font-semibold text-slate-900">Gallery</h3>
                <p className="text-sm text-slate-600 mt-1">{galleryError ? 'Could not load count' : galleryCount === null ? 'Loading…' : `${galleryCount} image${galleryCount !== 1 ? 's' : ''} uploaded`}</p>
              </div>
            </div>
            <ArrowUpRight className="text-rose-400 group-hover:translate-x-1 transition-transform" size={20} />
          </div>
        </Link>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-slate-900 mb-6">Jump to Editor</h2>
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {sectionCards.map((card) => {
            const Icon = card.icon
            return (
              <Link key={card.title} to={card.path} className="group relative rounded-2xl border border-slate-200/60 bg-white/70 backdrop-blur-sm p-6 transition-all duration-300 hover:border-slate-300 hover:shadow-lg">
                <div className="relative z-10">
                  <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${card.accent} text-white shadow-md transition-transform group-hover:scale-110`}>
                    <Icon size={22} />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-1">{card.title}</h3>
                  <p className="text-sm text-slate-600">{card.description}</p>
                  <div className="mt-4 flex justify-end">
                    <ArrowUpRight className="text-slate-400 group-hover:text-slate-600 transition-colors" size={18} />
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>

      <div className="rounded-2xl bg-gradient-to-r from-slate-100 to-slate-50 border border-slate-200/60 p-6 sm:p-8">
        <div className="flex items-start gap-4">
          <Zap className="h-6 w-6 text-emerald-600 flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Pro Tip</h3>
            <p className="text-sm font-light text-slate-600 leading-relaxed">Use the editors to manage the CMS content that feeds the public site.</p>
          </div>
        </div>
      </div>
    </section>
  )
}
