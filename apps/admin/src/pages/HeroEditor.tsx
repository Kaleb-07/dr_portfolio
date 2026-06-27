import { Image, Loader2, Save } from 'lucide-react'
import { useEffect, useState } from 'react'
import api from '../api'

interface Hero {
  name: string;
  title: string;
  subtitle: string;
  description: string;
  cta_1_label: string;
  cta_1_path: string;
  cta_2_label: string;
  cta_2_path: string;
  backgroundImage: string;
}

const emptyHero: Hero = {
  name: '',
  title: '',
  subtitle: '',
  description: '',
  cta_1_label: '',
  cta_1_path: '',
  cta_2_label: '',
  cta_2_path: '',
  backgroundImage: '',
}

interface TextField {
  name: keyof Hero;
  label: string;
  placeholder: string;
}

const textFields: TextField[] = [
  { name: 'name', label: 'Name', placeholder: 'Dr. Name' },
  { name: 'title', label: 'Title', placeholder: 'Primary hero heading' },
  { name: 'subtitle', label: 'Subtitle', placeholder: 'Supporting line' },
  { name: 'cta_1_label', label: 'Primary CTA Label', placeholder: 'Explore Work' },
  { name: 'cta_1_path', label: 'Primary CTA Path', placeholder: '/about' },
  { name: 'cta_2_label', label: 'Secondary CTA Label', placeholder: 'Contact' },
  { name: 'cta_2_path', label: 'Secondary CTA Path', placeholder: '/contact' },
  { name: 'backgroundImage', label: 'Background Image', placeholder: '/image.png' },
]

export default function HeroEditor() {
  const [hero, setHero] = useState<Hero>(emptyHero)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isSaving, setIsSaving] = useState<boolean>(false)
  const [message, setMessage] = useState<string>('')
  const [error, setError] = useState<string>('')

  useEffect(() => {
    let isMounted = true

    const loadHero = async () => {
      try {
        const response = await api.get('/hero')

        if (isMounted) {
          setHero({ ...emptyHero, ...response.data })
        }
      } catch {
        if (isMounted) {
          setError('Could not load hero content.')
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadHero()

    return () => {
      isMounted = false
    }
  }, [])

  const updateField = (field: keyof Hero, value: string) => {
    setHero((current) => ({ ...current, [field]: value }))
  }

  const saveHero = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setMessage('')
    setError('')
    setIsSaving(true)

    try {
      await api.put('/hero', hero)
      setMessage('Hero content saved.')
    } catch {
      setError('Could not save hero content.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <section className="mx-auto max-w-6xl">
      <div className="mb-8 flex flex-col justify-between gap-4 border-b border-rule pb-7 lg:flex-row lg:items-end">
        <div>
          <p className="section-tag">Hero Editor</p>
          <h1 className="mt-3 font-serif text-4xl font-light text-ink sm:text-5xl">Homepage Hero</h1>
        </div>
        <p className="max-w-xl text-sm font-light leading-relaxed text-ink-mid">
          Update the public homepage introduction, calls to action, and lead image.
        </p>
      </div>

      {isLoading ? (
        <div className="flex min-h-80 items-center justify-center border border-rule bg-paper-card">
          <Loader2 size={26} className="animate-spin text-teal" />
        </div>
      ) : (
        <form onSubmit={saveHero} className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="border border-rule bg-paper-card p-5 sm:p-6">
            <div className="grid gap-5 md:grid-cols-2">
              {textFields.map((field) => (
                <label
                  key={field.name}
                  className={field.name === 'title' || field.name === 'backgroundImage' ? 'md:col-span-2' : ''}
                >
                  <span className="mb-2 block font-mono text-[10px] uppercase tracking-[0.18em] text-ink-muted">
                    {field.label}
                  </span>
                  <input
                    type="text"
                    value={hero[field.name] || ''}
                    onChange={(event) => updateField(field.name, event.target.value)}
                    placeholder={field.placeholder}
                    className="w-full border border-rule bg-paper px-4 py-3 text-sm text-ink outline-none transition-colors placeholder:text-ink-faint focus:border-teal"
                  />
                </label>
              ))}

              <label className="md:col-span-2">
                <span className="mb-2 block font-mono text-[10px] uppercase tracking-[0.18em] text-ink-muted">
                  Description
                </span>
                <textarea
                  value={hero.description || ''}
                  onChange={(event) => updateField('description', event.target.value)}
                  rows={7}
                  placeholder="Hero description"
                  className="w-full resize-y border border-rule bg-paper px-4 py-3 text-sm leading-relaxed text-ink outline-none transition-colors placeholder:text-ink-faint focus:border-teal"
                />
              </label>
            </div>

            <div className="mt-6 flex flex-col gap-3 border-t border-rule pt-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                {message && <p className="text-xs font-medium text-teal">{message}</p>}
                {error && <p className="text-xs font-medium text-red-700">{error}</p>}
              </div>

              <button
                type="submit"
                disabled={isSaving}
                className="inline-flex items-center justify-center gap-2 bg-teal px-6 py-3 font-sans text-xs font-medium uppercase tracking-[0.18em] text-white transition-colors hover:bg-teal-mid disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                {isSaving ? 'Saving' : 'Save Hero'}
              </button>
            </div>
          </div>

          <aside className="border border-rule bg-paper-card p-5">
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-muted">Preview Asset</p>
            <div className="mt-4 aspect-[4/5] border border-rule bg-paper">
              {hero.backgroundImage ? (
                <img
                  src={hero.backgroundImage}
                  alt=""
                  className="h-full w-full object-cover"
                  onError={(event) => {
                    event.currentTarget.style.display = 'none'
                  }}
                />
              ) : (
                <div className="flex h-full items-center justify-center text-ink-muted">
                  <Image size={28} />
                </div>
              )}
            </div>
            <div className="mt-5 border-t border-rule pt-5">
              <p className="font-serif text-2xl font-light text-ink">{hero.name || 'Hero name'}</p>
              <p className="mt-2 text-sm leading-relaxed text-ink-mid">{hero.subtitle || 'Hero subtitle'}</p>
            </div>
          </aside>
        </form>
      )}
    </section>
  )
}
