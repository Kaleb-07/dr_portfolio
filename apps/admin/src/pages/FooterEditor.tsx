import { useEffect, useMemo, useState } from 'react'
import { AlertCircle, CheckCircle2, Loader2, Save, Sparkles, Zap } from 'lucide-react'
import { FaFacebook, FaInstagram, FaLinkedinIn, FaXTwitter } from 'react-icons/fa6'
import api from '../api'
import UndoButton from '../components/UndoButton'

const formInput =
  'w-full rounded-xl border border-slate-200 bg-white/70 backdrop-blur px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/10 focus:bg-white shadow-sm hover:border-emerald-300 hover:shadow-md'

const labelClass = 'mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-600'

const defaultFooterContact = {
  heading: "Let's Connect",
  email: 'contact@liyanahealthcare.com',
  phone: '+251-XXX-XXXXXX',
  location: 'Addis Ababa, Ethiopia',
}

const defaultSocialLinks = [
  { id: 'linkedin', label: 'LinkedIn', href: 'https://linkedin.com/in/', icon: 'linkedin' },
  { id: 'x', label: 'X / Twitter', href: 'https://twitter.com/', icon: 'x' },
  { id: 'instagram', label: 'Instagram', href: 'https://instagram.com/', icon: 'instagram' },
  { id: 'facebook', label: 'Facebook', href: 'https://facebook.com/', icon: 'facebook' },
]

const socialOptions = [
  { value: 'linkedin', label: 'LinkedIn', Icon: FaLinkedinIn },
  { value: 'x', label: 'X / Twitter', Icon: FaXTwitter },
  { value: 'instagram', label: 'Instagram', Icon: FaInstagram },
  { value: 'facebook', label: 'Facebook', Icon: FaFacebook },
] as const

const socialIconMap = {
  linkedin: FaLinkedinIn,
  x: FaXTwitter,
  twitter: FaXTwitter,
  instagram: FaInstagram,
  facebook: FaFacebook,
} as const

type FooterContact = typeof defaultFooterContact
type SocialLink = {
  id: string
  label: string
  href: string
  icon: string
}

function Field({
  label,
  children,
  hint,
}: {
  label: string
  children: React.ReactNode
  hint?: string
}) {
  return (
    <label className="block">
      <span className={labelClass}>{label}</span>
      {children}
      {hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
    </label>
  )
}

function Toast({ message, error }: { message: string; error: string }) {
  if (!message && !error) return null
  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-lg px-5 py-3.5 text-sm font-medium shadow-lg ${
        error ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-700'
      }`}
    >
      {error ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
      <span>{message || error}</span>
    </div>
  )
}

function EditorShell({
  title,
  saving,
  onSave,
  message,
  error,
  undoButton,
  children,
}: {
  title: string
  saving: boolean
  onSave: () => void
  message: string
  error: string
  undoButton?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100/60">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-10 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-emerald-600">
              <Zap size={14} /> {title} Editor
            </p>
            <h1 className="mt-3 text-4xl font-bold text-slate-900">{title}</h1>
          </div>
          <div className="flex items-center gap-3">
            {undoButton}
            <button
              type="button"
              onClick={onSave}
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-6 py-3 font-semibold text-white transition-all hover:shadow-xl hover:shadow-emerald-500/30 active:scale-[0.98] disabled:opacity-50"
            >
              {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
              <span>{saving ? 'Saving...' : 'Save All Changes'}</span>
            </button>
          </div>
        </div>

        <div className="space-y-8">{children}</div>
      </div>
      <Toast message={message} error={error} />
    </section>
  )
}

function SocialIcon({ icon }: { icon: string }) {
  const Icon = socialIconMap[(icon as keyof typeof socialIconMap) || 'linkedin'] || FaLinkedinIn
  return <Icon size={14} />
}

export default function FooterEditor() {
  const [contact, setContact] = useState<FooterContact>(defaultFooterContact)
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>(defaultSocialLinks)
  const [backupContact, setBackupContact] = useState<FooterContact>(defaultFooterContact)
  const [backupSocialLinks, setBackupSocialLinks] = useState<SocialLink[]>(defaultSocialLinks)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    const load = async () => {
      setIsLoading(true)
      setError('')
      try {
        const [contactRes, contentRes] = await Promise.all([
          api.get('/contact/settings'),
          api.get('/cms/site-content'),
        ])

        if (!active) return

        const loadedContact = {
          ...defaultFooterContact,
          ...(contactRes.data || {}),
        }

        const footerMetadata = contentRes.data?.sections?.footer_settings?.metadata || {}
        const loadedSocialLinks = Array.isArray(footerMetadata.socialLinks)
          ? footerMetadata.socialLinks.map(
              (link: { id?: string; label?: string; href?: string; icon?: string }, index: number) => ({
                id: link.id || `social-${index + 1}`,
                label: link.label || '',
                href: link.href || '',
                icon: link.icon || 'linkedin',
              }),
            )
          : defaultSocialLinks

        setContact(loadedContact)
        setBackupContact(loadedContact)
        setSocialLinks(loadedSocialLinks)
        setBackupSocialLinks(loadedSocialLinks)
      } catch (err) {
        console.error('Failed to load footer settings:', err)
        if (active) {
          setError('Failed to load footer settings. Using defaults.')
          setContact(defaultFooterContact)
          setBackupContact(defaultFooterContact)
          setSocialLinks(defaultSocialLinks)
          setBackupSocialLinks(defaultSocialLinks)
        }
      } finally {
        if (active) setIsLoading(false)
      }
    }

    load()
    return () => {
      active = false
    }
  }, [])

  const updateContact = (field: keyof FooterContact, value: string) =>
    setContact((prev) => ({ ...prev, [field]: value }))

  const updateSocialLink = (index: number, patch: Partial<SocialLink>) =>
    setSocialLinks((prev) =>
      prev.map((item, i) => (i === index ? { ...item, ...patch } : item)),
    )

  const footerSectionPayload = useMemo(
    () => ({
      eyebrow: 'Footer',
      title: 'Footer & Social Media',
      description: 'Manage footer contact details and social media links.',
      metadata: {
        socialLinks: socialLinks.map((link) => ({
          id: link.id,
          label: link.label,
          href: link.href,
          icon: link.icon,
        })),
      },
    }),
    [socialLinks],
  )

  const saveAll = async () => {
    setIsSaving(true)
    setMessage('')
    setError('')
    try {
      await api.put('/contact/settings', contact)
      await api.put('/cms/sections/footer_settings', {
        section: footerSectionPayload,
        blocks: [],
      })

      const [contactRes, contentRes] = await Promise.all([
        api.get('/contact/settings'),
        api.get('/cms/site-content'),
      ])

      const savedContact = {
        ...defaultFooterContact,
        ...(contactRes.data || {}),
      }
      const footerMetadata = contentRes.data?.sections?.footer_settings?.metadata || {}
      const savedSocialLinks = Array.isArray(footerMetadata.socialLinks)
        ? footerMetadata.socialLinks.map(
            (link: { id?: string; label?: string; href?: string; icon?: string }, index: number) => ({
              id: link.id || `social-${index + 1}`,
              label: link.label || '',
              href: link.href || '',
              icon: link.icon || 'linkedin',
            }),
          )
        : socialLinks

      setContact(savedContact)
      setBackupContact(savedContact)
      setSocialLinks(savedSocialLinks)
      setBackupSocialLinks(savedSocialLinks)
      setMessage('Footer settings saved.')
    } catch (err) {
      console.error('Failed to save footer settings:', err)
      setError('Could not save footer settings. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleUndo = () => {
    setContact(backupContact)
    setSocialLinks(backupSocialLinks)
    setMessage('Changes reverted.')
    setTimeout(() => setMessage(''), 2000)
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100/60">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-emerald-500" size={32} />
          <p className="text-sm text-slate-600 animate-pulse">Loading footer settings...</p>
        </div>
      </div>
    )
  }

  return (
    <EditorShell
      title="Footer & Social Media"
      saving={isSaving}
      onSave={saveAll}
      message={message}
      error={error}
      undoButton={<UndoButton onClick={handleUndo} />}
    >
      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="space-y-8">
          <div className="rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-sm backdrop-blur-sm sm:p-8">
            <div className="mb-6 border-b border-slate-200 pb-6">
              <h2 className="text-2xl font-bold text-slate-900">Footer Contact</h2>
              <p className="mt-2 text-sm text-slate-600">
                This contact info is shown in the website footer and used as the public contact
                reference.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <Field label="Heading">
                <input
                  className={formInput}
                  value={contact.heading}
                  onChange={(e) => updateContact('heading', e.target.value)}
                  placeholder="Let's Connect"
                />
              </Field>
              <Field label="Email">
                <input
                  className={formInput}
                  value={contact.email}
                  onChange={(e) => updateContact('email', e.target.value)}
                  placeholder="contact@liyanahealthcare.com"
                />
              </Field>
              <Field label="Phone">
                <input
                  className={formInput}
                  value={contact.phone}
                  onChange={(e) => updateContact('phone', e.target.value)}
                  placeholder="+251-XXX-XXXXXX"
                />
              </Field>
              <Field label="Location">
                <input
                  className={formInput}
                  value={contact.location}
                  onChange={(e) => updateContact('location', e.target.value)}
                  placeholder="Addis Ababa, Ethiopia"
                />
              </Field>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-sm backdrop-blur-sm sm:p-8">
            <div className="mb-6 border-b border-slate-200 pb-6">
              <h2 className="text-2xl font-bold text-slate-900">Social Media</h2>
              <p className="mt-2 text-sm text-slate-600">
                Edit the social links that appear in the footer across the site.
              </p>
            </div>

            <div className="space-y-4">
              {socialLinks.map((link, index) => (
                <div
                  key={link.id}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-emerald-600 shadow-sm">
                        <SocialIcon icon={link.icon} />
                      </span>
                      <p className="text-sm font-semibold text-slate-900">
                        {link.label || `Link ${index + 1}`}
                      </p>
                    </div>
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-400">
                      Social
                    </span>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-[160px_1fr]">
                    <Field label="Icon">
                      <select
                        className={formInput}
                        value={link.icon}
                        onChange={(e) => updateSocialLink(index, { icon: e.target.value })}
                      >
                        {socialOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </Field>
                    <Field label="Label">
                      <input
                        className={formInput}
                        value={link.label}
                        onChange={(e) => updateSocialLink(index, { label: e.target.value })}
                        placeholder="LinkedIn"
                      />
                    </Field>
                    <div className="sm:col-span-2">
                      <Field label="URL">
                        <input
                          className={formInput}
                          value={link.href}
                          onChange={(e) => updateSocialLink(index, { href: e.target.value })}
                          placeholder="https://..."
                        />
                      </Field>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="sticky top-8 space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur-md">
              <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                <Sparkles size={14} className="text-emerald-500" /> Live Preview
              </h3>
              <div className="rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-slate-900">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  {contact.heading || "Let's Connect"}
                </p>
                <div className="mt-4 space-y-3 text-sm text-slate-600">
                  <p>{contact.location}</p>
                  <p>{contact.phone}</p>
                  <p>{contact.email}</p>
                </div>
                <div className="mt-5 flex gap-2">
                  {socialLinks.map((link) => {
                    const Icon = socialIconMap[(link.icon as keyof typeof socialIconMap) || 'linkedin']
                    return (
                      <span
                        key={link.id}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 text-emerald-700"
                      >
                        <Icon size={14} />
                      </span>
                    )
                  })}
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-emerald-100 p-6">
              <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-emerald-900">
                <Sparkles size={16} className="text-emerald-600" /> Editing Guide
              </h3>
              <p className="text-sm leading-relaxed text-emerald-800">
                Update the footer contact details here and click Save to update the website footer
                and the shared social links.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </EditorShell>
  )
}
