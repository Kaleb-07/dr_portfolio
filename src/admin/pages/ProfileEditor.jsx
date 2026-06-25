import { useEffect, useMemo, useState } from 'react'
import {
  AlertCircle,
  CheckCircle2,
  GraduationCap,
  Images,
  Loader2,
  Save,
  Sparkles,
} from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../api'
import JourneyEditor from './JourneyEditor.jsx'
import {
  education as fallbackEducation,
  professionalMemberships as fallbackMemberships,
} from '@/data/education'
import { galleryItems as fallbackGallery } from '@/data/gallery'

const sections = [
  { slug: 'journey', title: 'Journey', icon: Sparkles },
  { slug: 'education', title: 'Education', icon: GraduationCap },
  { slug: 'gallery', title: 'Gallery', icon: Images },
]

const formInput =
  'w-full rounded-xl border border-slate-200 bg-white/70 backdrop-blur px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:border-teal-400 focus:ring-4 focus:ring-teal-500/10 focus:bg-white shadow-sm hover:border-teal-300 hover:shadow-md'
const labelClass = 'mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-600'

function Field({ label, children, hint }) {
  return (
    <label className="block">
      <span className={labelClass}>{label}</span>
      {children}
      {hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
    </label>
  )
}

function Toast({ message, error }) {
  if (!message && !error) return null
  return (
    <div
      className={`fixed bottom-6 right-6 flex items-center gap-3 rounded-lg px-5 py-3.5 text-sm font-medium shadow-lg transition-all duration-300 ${
        error ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-700'
      }`}
    >
      {error ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
      <span>{message || error}</span>
    </div>
  )
}

const normalizeEducation = (entry) => ({
  id: entry.id || `edu-${Math.random().toString(36).slice(2)}`,
  institution: entry.institution || '',
  degree: entry.degree || '',
  field: entry.field || '',
  year: entry.year || new Date().getFullYear(),
  description: entry.description || '',
  highlights: Array.isArray(entry.highlights) ? entry.highlights : [],
})

const normalizeGallery = (entry) => ({
  id: entry.id || `gallery-${Math.random().toString(36).slice(2)}`,
  src: entry.src || '',
  alt: entry.alt || '',
  caption: entry.caption || '',
  category: entry.category || 'community',
  date: entry.date || '',
  location: entry.location || '',
})

export default function ProfileEditor() {
  const navigate = useNavigate()
  const { sectionSlug } = useParams()
  const activeSection = useMemo(
    () => sections.find((section) => section.slug === sectionSlug) ?? sections[0],
    [sectionSlug],
  )

  useEffect(() => {
    if (!sectionSlug) navigate('/admin/profile/journey', { replace: true })
  }, [navigate, sectionSlug])

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const [educationSection, setEducationSection] = useState({
    eyebrow: 'Credentials',
    title: 'Academic foundations',
    description: 'Academic training and professional credentials that shaped the journey.',
    membershipsEyebrow: 'Affiliations',
    membershipsTitle: 'Professional memberships',
    membershipsDescription:
      'Active roles across national and international professional bodies in healthcare leadership and community service.',
    education: fallbackEducation.map(normalizeEducation),
    memberships: [...fallbackMemberships],
  })

  const [gallerySection, setGallerySection] = useState({
    eyebrow: 'Visual Archive',
    title: 'A visual journey',
    description:
      'A curated archive of milestones, leadership moments, and community impact captured over the years.',
    items: fallbackGallery.map(normalizeGallery),
  })

  useEffect(() => {
    let active = true
    const load = async () => {
      setLoading(true)
      setError('')
      try {
        const response = await api.get('/cms/site-content')
        if (!active) return
        const sectionsData = response.data?.sections || {}
        const aboutEducation = sectionsData.about_education || {}
        const aboutGallery = sectionsData.about_gallery || {}

        setEducationSection((current) => ({
          ...current,
          eyebrow: aboutEducation.eyebrow || current.eyebrow,
          title: aboutEducation.title || current.title,
          description: aboutEducation.description || current.description,
          membershipsEyebrow: String(
            aboutEducation.metadata?.membership_eyebrow || current.membershipsEyebrow,
          ),
          membershipsTitle: String(
            aboutEducation.metadata?.membership_title || current.membershipsTitle,
          ),
          membershipsDescription: String(
            aboutEducation.metadata?.membership_description || current.membershipsDescription,
          ),
          education:
            Array.isArray(aboutEducation.blocks) && aboutEducation.blocks.length > 0
              ? aboutEducation.blocks.map((block) => ({
                  id: String(block.id),
                  institution: block.title || '',
                  degree: String(block.metadata?.degree || ''),
                  field: String(block.metadata?.field || ''),
                  year: Number(block.metadata?.year || new Date().getFullYear()),
                  description: block.body || '',
                  highlights: Array.isArray(block.metadata?.highlights)
                    ? block.metadata.highlights
                    : [],
                }))
              : current.education,
          memberships: Array.isArray(aboutEducation.metadata?.memberships)
            ? aboutEducation.metadata.memberships
            : current.memberships,
        }))

        setGallerySection((current) => ({
          ...current,
          eyebrow: aboutGallery.eyebrow || current.eyebrow,
          title: aboutGallery.title || current.title,
          description: aboutGallery.description || current.description,
          items:
            Array.isArray(aboutGallery.blocks) && aboutGallery.blocks.length > 0
              ? aboutGallery.blocks.map((block) => ({
                  id: String(block.id),
                  src: block.image_url || '',
                  alt: block.image_alt || block.title || '',
                  caption: block.body || '',
                  category: String(block.metadata?.category || 'community'),
                  date: String(block.metadata?.date || ''),
                  location: String(block.metadata?.location || ''),
                }))
              : current.items,
        }))
      } catch {
        setError('Could not load profile content. Using defaults.')
      } finally {
        if (active) setLoading(false)
      }
    }
    load()
    return () => {
      active = false
    }
  }, [])

  const saveSection = async () => {
    setSaving(true)
    setMessage('')
    setError('')
    try {
      if (activeSection.slug === 'education') {
        await api.put('/cms/sections/about_education', {
          section: {
            eyebrow: educationSection.eyebrow,
            title: educationSection.title,
            description: educationSection.description,
            metadata: {
              membership_eyebrow: educationSection.membershipsEyebrow,
              membership_title: educationSection.membershipsTitle,
              membership_description: educationSection.membershipsDescription,
              memberships: educationSection.memberships,
            },
          },
          blocks: educationSection.education.map((item) => ({
            title: item.institution,
            body: item.description,
            metadata: {
              degree: item.degree,
              field: item.field,
              year: item.year,
              highlights: item.highlights,
            },
          })),
        })
      } else if (activeSection.slug === 'gallery') {
        await api.put('/cms/sections/about_gallery', {
          section: {
            eyebrow: gallerySection.eyebrow,
            title: gallerySection.title,
            description: gallerySection.description,
          },
          blocks: gallerySection.items.map((item) => ({
            title: item.alt || item.caption,
            body: item.caption,
            image_url: item.src,
            image_alt: item.alt,
            metadata: {
              category: item.category,
              date: item.date,
              location: item.location,
            },
          })),
        })
      }
      setMessage(`${activeSection.title} saved.`)
    } catch {
      setError('Could not save profile content.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-80 items-center justify-center border border-rule bg-paper-card">
        <Loader2 size={26} className="animate-spin text-teal" />
      </div>
    )
  }

  const journeySelected = activeSection.slug === 'journey'
  const educationSelected = activeSection.slug === 'education'
  const gallerySelected = activeSection.slug === 'gallery'

  return (
    <section className="mx-auto max-w-6xl">
      <div className="mb-8 flex flex-col justify-between gap-4 border-b border-slate-200 pb-7 md:flex-row md:items-end">
        <div>
          <p className="section-tag flex items-center gap-2">
            <Sparkles size={14} />
            Profile Editor
          </p>
          <h1 className="mt-3 font-serif text-4xl font-light text-ink sm:text-5xl">
            {activeSection.title}
          </h1>
          <p className="mt-3 max-w-2xl text-sm font-light leading-relaxed text-ink-mid">
            Edit one profile section at a time using the sidebar selection.
          </p>
        </div>
        <button
          type="button"
          onClick={saveSection}
          disabled={saving || journeySelected}
          className="inline-flex items-center gap-2 self-start bg-teal px-5 py-2.5 font-sans text-xs font-medium uppercase tracking-[0.18em] text-white transition-colors hover:bg-teal-mid disabled:cursor-not-allowed disabled:opacity-70"
        >
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          {journeySelected ? 'Use Journey Save' : saving ? 'Saving' : 'Save Section'}
        </button>
      </div>

      <div className="mb-8 flex flex-wrap gap-2 border-b border-rule pb-4">
        {sections.map((section) => {
          const Icon = section.icon
          const active = activeSection.slug === section.slug
          return (
            <button
              key={section.slug}
              type="button"
              onClick={() => navigate(`/admin/profile/${section.slug}`)}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] transition-colors ${
                active ? 'bg-teal text-white' : 'border border-rule text-ink-muted hover:text-ink'
              }`}
            >
              <Icon size={14} />
              {section.title}
            </button>
          )
        })}
      </div>

      {journeySelected && (
        <div className="rounded-2xl border border-rule bg-paper-card p-6">
          <JourneyEditor />
        </div>
      )}

      {educationSelected && (
        <div className="grid gap-8 xl:grid-cols-[1fr_340px]">
          <div className="space-y-6">
            <section className="group rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur-sm sm:p-8">
              <div className="mb-5 border-b border-slate-200 pb-4">
                <h2 className="text-2xl font-bold text-slate-900">Education Hero Copy</h2>
              </div>
              <div className="grid gap-5 md:grid-cols-2">
                <Field label="Eyebrow">
                  <input
                    className={formInput}
                    value={educationSection.eyebrow}
                    onChange={(e) =>
                      setEducationSection((current) => ({ ...current, eyebrow: e.target.value }))
                    }
                  />
                </Field>
                <Field label="Headline">
                  <input
                    className={formInput}
                    value={educationSection.title}
                    onChange={(e) =>
                      setEducationSection((current) => ({ ...current, title: e.target.value }))
                    }
                  />
                </Field>
                <div className="md:col-span-2">
                  <Field label="Description">
                    <textarea
                      className={formInput}
                      rows={4}
                      value={educationSection.description}
                      onChange={(e) =>
                        setEducationSection((current) => ({
                          ...current,
                          description: e.target.value,
                        }))
                      }
                    />
                  </Field>
                </div>
                <Field label="Membership Eyebrow">
                  <input
                    className={formInput}
                    value={educationSection.membershipsEyebrow}
                    onChange={(e) =>
                      setEducationSection((current) => ({
                        ...current,
                        membershipsEyebrow: e.target.value,
                      }))
                    }
                  />
                </Field>
                <Field label="Membership Title">
                  <input
                    className={formInput}
                    value={educationSection.membershipsTitle}
                    onChange={(e) =>
                      setEducationSection((current) => ({
                        ...current,
                        membershipsTitle: e.target.value,
                      }))
                    }
                  />
                </Field>
                <div className="md:col-span-2">
                  <Field label="Membership Description">
                    <textarea
                      className={formInput}
                      rows={3}
                      value={educationSection.membershipsDescription}
                      onChange={(e) =>
                        setEducationSection((current) => ({
                          ...current,
                          membershipsDescription: e.target.value,
                        }))
                      }
                    />
                  </Field>
                </div>
              </div>
            </section>

            <section className="group rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur-sm sm:p-8">
              <div className="mb-5 border-b border-slate-200 pb-4">
                <h2 className="text-2xl font-bold text-slate-900">Education Entries</h2>
              </div>
              <div className="space-y-4">
                {educationSection.education.map((item, index) => (
                  <div key={item.id} className="rounded-xl border border-slate-200 bg-white/80 p-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <Field label="Institution">
                        <input
                          className={formInput}
                          value={item.institution}
                          onChange={(e) =>
                            setEducationSection((current) => ({
                              ...current,
                              education: current.education.map((row, i) =>
                                i === index ? { ...row, institution: e.target.value } : row,
                              ),
                            }))
                          }
                        />
                      </Field>
                      <Field label="Degree">
                        <input
                          className={formInput}
                          value={item.degree}
                          onChange={(e) =>
                            setEducationSection((current) => ({
                              ...current,
                              education: current.education.map((row, i) =>
                                i === index ? { ...row, degree: e.target.value } : row,
                              ),
                            }))
                          }
                        />
                      </Field>
                      <Field label="Field">
                        <input
                          className={formInput}
                          value={item.field}
                          onChange={(e) =>
                            setEducationSection((current) => ({
                              ...current,
                              education: current.education.map((row, i) =>
                                i === index ? { ...row, field: e.target.value } : row,
                              ),
                            }))
                          }
                        />
                      </Field>
                      <Field label="Year">
                        <input
                          className={formInput}
                          type="number"
                          value={item.year}
                          onChange={(e) =>
                            setEducationSection((current) => ({
                              ...current,
                              education: current.education.map((row, i) =>
                                i === index ? { ...row, year: Number(e.target.value) } : row,
                              ),
                            }))
                          }
                        />
                      </Field>
                      <div className="md:col-span-2">
                        <Field label="Description">
                          <textarea
                            className={formInput}
                            rows={3}
                            value={item.description}
                            onChange={(e) =>
                              setEducationSection((current) => ({
                                ...current,
                                education: current.education.map((row, i) =>
                                  i === index ? { ...row, description: e.target.value } : row,
                                ),
                              }))
                            }
                          />
                        </Field>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <aside className="space-y-4 rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-sm backdrop-blur-sm sm:p-6">
            <div className="flex items-center gap-2 border-b border-slate-200 pb-4">
              <GraduationCap size={18} className="text-teal" />
              <h3 className="font-serif text-2xl font-light text-ink">Education Preview</h3>
            </div>
            <p className="text-xs uppercase tracking-[0.22em] text-ink-muted">
              {educationSection.eyebrow}
            </p>
            <p className="font-serif text-3xl font-light text-ink">{educationSection.title}</p>
            <p className="text-sm leading-relaxed text-ink-mid">{educationSection.description}</p>
          </aside>
        </div>
      )}

      {gallerySelected && (
        <div className="grid gap-8 xl:grid-cols-[1fr_340px]">
          <div className="space-y-6">
            <section className="group rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur-sm sm:p-8">
              <div className="mb-5 border-b border-slate-200 pb-4">
                <h2 className="text-2xl font-bold text-slate-900">Gallery Hero Copy</h2>
              </div>
              <div className="grid gap-5 md:grid-cols-2">
                <Field label="Eyebrow">
                  <input
                    className={formInput}
                    value={gallerySection.eyebrow}
                    onChange={(e) =>
                      setGallerySection((current) => ({ ...current, eyebrow: e.target.value }))
                    }
                  />
                </Field>
                <Field label="Headline">
                  <input
                    className={formInput}
                    value={gallerySection.title}
                    onChange={(e) =>
                      setGallerySection((current) => ({ ...current, title: e.target.value }))
                    }
                  />
                </Field>
                <div className="md:col-span-2">
                  <Field label="Description">
                    <textarea
                      className={formInput}
                      rows={4}
                      value={gallerySection.description}
                      onChange={(e) =>
                        setGallerySection((current) => ({
                          ...current,
                          description: e.target.value,
                        }))
                      }
                    />
                  </Field>
                </div>
              </div>
            </section>

            <section className="group rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur-sm sm:p-8">
              <div className="mb-5 border-b border-slate-200 pb-4">
                <h2 className="text-2xl font-bold text-slate-900">Gallery Entries</h2>
              </div>
              <div className="space-y-4">
                {gallerySection.items.map((item, index) => (
                  <div key={item.id} className="rounded-xl border border-slate-200 bg-white/80 p-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <Field label="Image URL">
                        <input
                          className={formInput}
                          value={item.src}
                          onChange={(e) =>
                            setGallerySection((current) => ({
                              ...current,
                              items: current.items.map((row, i) =>
                                i === index ? { ...row, src: e.target.value } : row,
                              ),
                            }))
                          }
                        />
                      </Field>
                      <Field label="Alt Text">
                        <input
                          className={formInput}
                          value={item.alt}
                          onChange={(e) =>
                            setGallerySection((current) => ({
                              ...current,
                              items: current.items.map((row, i) =>
                                i === index ? { ...row, alt: e.target.value } : row,
                              ),
                            }))
                          }
                        />
                      </Field>
                      <Field label="Category">
                        <select
                          className={formInput}
                          value={item.category}
                          onChange={(e) =>
                            setGallerySection((current) => ({
                              ...current,
                              items: current.items.map((row, i) =>
                                i === index ? { ...row, category: e.target.value } : row,
                              ),
                            }))
                          }
                        >
                          {[
                            'leadership',
                            'healthcare',
                            'education',
                            'awards',
                            'community',
                            'conferences',
                          ].map((category) => (
                            <option key={category} value={category}>
                              {category}
                            </option>
                          ))}
                        </select>
                      </Field>
                      <Field label="Date">
                        <input
                          className={formInput}
                          value={item.date}
                          onChange={(e) =>
                            setGallerySection((current) => ({
                              ...current,
                              items: current.items.map((row, i) =>
                                i === index ? { ...row, date: e.target.value } : row,
                              ),
                            }))
                          }
                        />
                      </Field>
                      <Field label="Location">
                        <input
                          className={formInput}
                          value={item.location}
                          onChange={(e) =>
                            setGallerySection((current) => ({
                              ...current,
                              items: current.items.map((row, i) =>
                                i === index ? { ...row, location: e.target.value } : row,
                              ),
                            }))
                          }
                        />
                      </Field>
                      <div className="md:col-span-2">
                        <Field label="Caption">
                          <textarea
                            className={formInput}
                            rows={3}
                            value={item.caption}
                            onChange={(e) =>
                              setGallerySection((current) => ({
                                ...current,
                                items: current.items.map((row, i) =>
                                  i === index ? { ...row, caption: e.target.value } : row,
                                ),
                              }))
                            }
                          />
                        </Field>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <aside className="space-y-4 rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-sm backdrop-blur-sm sm:p-6">
            <div className="flex items-center gap-2 border-b border-slate-200 pb-4">
              <Images size={18} className="text-teal" />
              <h3 className="font-serif text-2xl font-light text-ink">Gallery Preview</h3>
            </div>
            <p className="text-xs uppercase tracking-[0.22em] text-ink-muted">
              {gallerySection.eyebrow}
            </p>
            <p className="font-serif text-3xl font-light text-ink">{gallerySection.title}</p>
            <p className="text-sm leading-relaxed text-ink-mid">{gallerySection.description}</p>
          </aside>
        </div>
      )}

      <Toast message={message} error={error} />
    </section>
  )
}
