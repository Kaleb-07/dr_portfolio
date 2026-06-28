import { useState, useMemo } from 'react'
import { AnimatedSection, Container } from '@/components/shared'
import { mediaItems } from '@/data/media'
import { useSiteContent } from '@/hooks/useSiteContent'
import { cn } from '@/lib/utils'
import type { MediaItem } from '@/types'

const mediaTypeLabels: Record<MediaItem['type'], string> = {
  interview: 'Interview',
  conference: 'Conference',
  podcast: 'Podcast',
  press: 'Press',
  speech: 'Speech',
  video: 'Video',
}

const allTypes: MediaItem['type'][] = [
  'interview',
  'conference',
  'podcast',
  'press',
  'speech',
  'video',
]

interface SectionMeta {
  sectionEyebrow?: string
  sectionTitle?: string
  sectionDescription?: string
}

export default function MediaListSection() {
  const [activeType, setActiveType] = useState<MediaItem['type'] | 'all'>('all')
  const { content } = useSiteContent()
  const section = content?.sections?.media_speaking

  const meta = (section?.metadata ?? {}) as SectionMeta
  const sectionEyebrow = meta.sectionEyebrow || 'Media & Speaking'
  const sectionTitle = meta.sectionTitle || 'Voices of leadership'
  const sectionDescription =
    meta.sectionDescription ||
    'Interviews, keynotes, podcasts, and press coverage that amplify the vision for healthcare transformation.'

  const filtered = useMemo(() => {
    const cmsMedia =
      section?.blocks?.map((block) => ({
        id: String(block.id),
        title: block.title || '',
        type: (block.metadata?.type || 'interview') as MediaItem['type'],
        source: String(block.metadata?.source || ''),
        date: String(block.metadata?.date || ''),
        description: block.body || '',
        url: String(block.metadata?.url || ''),
        thumbnail: String(block.image_url || ''),
      })) || []

    const sourceItems = cmsMedia.length ? cmsMedia : mediaItems
    if (activeType === 'all') return sourceItems
    return sourceItems.filter((item) => item.type === activeType)
  }, [activeType, section])

  return (
    <section className="section-padding bg-paper relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute bottom-10 -left-10 w-[300px] h-[300px] rounded-full blur-[90px] bg-teal-light" />
      </div>

      <Container className="relative z-10">
        <AnimatedSection>
          <div className="section-header">
            <span className="section-tag">{sectionEyebrow}</span>
            <span className="section-rule" />
          </div>
          <h2 className="font-serif text-4xl md:text-5xl font-light text-ink mb-4">
            {sectionTitle.includes('<em') ? (
              <span dangerouslySetInnerHTML={{ __html: sectionTitle }} />
            ) : (
              sectionTitle
            )}
          </h2>
          <p className="text-sm font-light text-ink-mid leading-relaxed max-w-xl mb-10">
            {sectionDescription}
          </p>
        </AnimatedSection>

        <AnimatedSection delay={0.1}>
          <div className="mb-10 flex flex-wrap gap-2">
            {(['all', ...allTypes] as const).map((type) => (
              <button
                key={type}
                onClick={() => setActiveType(type)}
                className={cn(
                  'font-mono text-[9px] tracking-[0.2em] uppercase px-4 py-2 transition-colors duration-200 cursor-pointer',
                  activeType === type
                    ? 'bg-teal text-white'
                    : 'border border-rule text-ink-muted hover:text-ink hover:border-ink/30 active:bg-teal active:text-white active:border-teal active:scale-95',
                )}
              >
                {type === 'all' ? 'All' : mediaTypeLabels[type]}
              </button>
            ))}
          </div>
        </AnimatedSection>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item, i) => (
            <AnimatedSection key={item.id} delay={i * 0.06}>
              <div className="bg-white border border-rule h-full p-6 group hover:border-teal-mid/50 hover:shadow-md transition-all duration-300 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-teal to-teal-mid origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />

                <div className="flex items-center justify-between mb-4">
                  <span className="badge-teal">{mediaTypeLabels[item.type]}</span>
                  <span className="font-mono text-[9px] tracking-[0.2em] uppercase text-ink-muted">
                    {item.date}
                  </span>
                </div>

                <h3 className="font-serif text-lg font-light text-ink mb-2 group-hover:text-teal transition-colors duration-300">
                  {item.title}
                </h3>
                <p className="font-mono text-[9px] tracking-widest uppercase text-teal-mid mb-3">
                  {item.source}
                </p>
                <p className="text-sm font-light text-ink-mid leading-relaxed">
                  {item.description}
                </p>

                {item.url && (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 mt-4 font-mono text-[9px] tracking-widest uppercase text-teal hover:text-teal-mid transition-colors duration-200 expanding-line pb-0.5"
                  >
                    View Source
                  </a>
                )}
              </div>
            </AnimatedSection>
          ))}
        </div>
      </Container>
    </section>
  )
}
