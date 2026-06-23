import { AnimatedSection, Container } from '@/components/shared'
import { useSiteContent } from '@/hooks/useSiteContent'

export default function AboutVision() {
  const { content } = useSiteContent()
  const section = content?.sections.about_vision

  if (!section) return null

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-teal to-[#0b4e3d] text-white py-24 border-y border-rule/10">
      {/* Background soft ambient lights */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-0 right-1/4 w-[400px] h-[400px] rounded-full blur-[90px] bg-gold-light" />
      </div>

      <Container className="max-w-4xl mx-auto relative z-10">
        <AnimatedSection className="relative border border-white/10 p-12 md:p-16 bg-white/5 backdrop-blur-[2px] shadow-2xl">
          {/* Inner corners accents */}
          <div className="absolute top-4 left-4 w-4 h-4 border-t border-l border-white/20" />
          <div className="absolute top-4 right-4 w-4 h-4 border-t border-r border-white/20" />
          <div className="absolute bottom-4 left-4 w-4 h-4 border-b border-l border-white/20" />
          <div className="absolute bottom-4 right-4 w-4 h-4 border-b border-r border-white/20" />

          <p className="font-mono text-[9px] tracking-[0.25em] uppercase text-white/60 mb-6 text-center">
            {section.eyebrow}
          </p>
          <h2 className="font-serif text-4xl md:text-5xl font-light text-white mb-8 text-center">
            {section.title}
          </h2>
          <blockquote className="font-serif text-xl lg:text-2xl italic font-light text-white/90 leading-relaxed max-w-2xl mx-auto text-center">
            &ldquo;{section.description || (section.blocks && section.blocks.length ? section.blocks.map(b => b.body || b.description).join('\n\n') : '')}&rdquo;
          </blockquote>
        </AnimatedSection>
      </Container>
    </section>
  )
}
