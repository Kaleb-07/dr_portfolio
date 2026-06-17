import { useState, useMemo } from 'react'
import { AnimatedSection, Container, Card } from '@/components/shared'
import { mediaItems } from '@/data/media'
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

const allTypes: MediaItem['type'][] = ['interview', 'conference', 'podcast', 'press', 'speech', 'video']

export default function MediaListSection() {
  const [activeType, setActiveType] = useState<MediaItem['type'] | 'all'>('all')

  const filtered = useMemo(() => {
    if (activeType === 'all') return mediaItems
    return mediaItems.filter((item) => item.type === activeType)
  }, [activeType])

  return (
    <section className="section-padding bg-paper">
      <Container>
        <AnimatedSection>
          <div className="section-header">
            <span className="section-tag">Media</span>
            <span className="section-rule" />
          </div>
          <h2 className="font-serif text-4xl md:text-5xl font-light text-ink mb-6">
            Media appearances & <em className="text-teal-mid not-italic">speaking</em>
          </h2>
        </AnimatedSection>

        {/* Filters */}
        <div className="mb-10 flex flex-wrap gap-2">
          {(['all', ...allTypes] as const).map((type) => (
            <button
              key={type}
              onClick={() => setActiveType(type)}
              className={cn(
                'font-mono text-[9px] tracking-[0.2em] uppercase px-4 py-2 transition-colors cursor-pointer',
                activeType === type
                  ? 'bg-teal text-white'
                  : 'border border-rule text-ink-muted hover:text-ink',
              )}
            >
              {type === 'all' ? 'All' : mediaTypeLabels[type]}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item, i) => (
            <AnimatedSection key={item.id} delay={i * 0.05}>
              <Card className="bg-white border border-rule h-full">
                <div className="flex items-center gap-3 mb-4">
                  <span className="font-mono text-[9px] tracking-[0.2em] uppercase text-teal bg-teal-light px-2 py-1">
                    {mediaTypeLabels[item.type]}
                  </span>
                </div>
                <h3 className="font-serif text-lg font-light text-ink mb-2">{item.title}</h3>
                <p className="text-xs text-teal mb-1">{item.source}</p>
                <p className="text-xs text-ink-muted mb-3">{item.date}</p>
                <p className="text-sm font-light text-ink-mid leading-relaxed">{item.description}</p>
              </Card>
            </AnimatedSection>
          ))}
        </div>
      </Container>
    </section>
  )
}
