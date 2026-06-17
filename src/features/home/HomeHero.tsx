import { AnimatedSection } from '@/components/shared'

export default function HomeHero() {
  return (
    <section className="section-padding bg-paper min-h-[85vh] flex items-center pt-24 lg:pt-32">
      <div className="mx-auto max-w-6xl px-6 sm:px-12 lg:px-16 w-full">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <AnimatedSection>
              <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-teal mb-6">
                The Visionary Agenda
              </p>
            </AnimatedSection>

            <AnimatedSection delay={0.1}>
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-[4.75rem] lg:leading-[1.15] font-light text-ink mb-10">
                He saw a broken system. <br />
                <em className="text-teal-mid italic">He built the cure.</em>
              </h1>
            </AnimatedSection>

            {/* Split Grid */}
            <AnimatedSection delay={0.2}>
              <div className="border-t border-rule py-6 grid grid-cols-3 gap-6">
                <div>
                  <p className="font-mono text-[9px] tracking-widest uppercase text-ink-muted mb-2">Identity I</p>
                  <h3 className="font-serif text-lg sm:text-xl text-ink font-normal">Physician</h3>
                </div>
                <div>
                  <p className="font-mono text-[9px] tracking-widest uppercase text-ink-muted mb-2">Identity II</p>
                  <h3 className="font-serif text-lg sm:text-xl text-ink font-normal">Entrepreneur</h3>
                </div>
                <div>
                  <p className="font-mono text-[9px] tracking-widest uppercase text-ink-muted mb-2">Identity III</p>
                  <h3 className="font-serif text-lg sm:text-xl text-ink font-normal">Nation Builder</h3>
                </div>
              </div>
              <div className="border-b border-rule mb-8" />
            </AnimatedSection>

            {/* <AnimatedSection delay={0.3}>
              <p className="text-base sm:text-lg font-light text-ink-mid leading-relaxed max-w-xl">
                A lifetime dedicated to recalibrating the intersection of medical precision and systemic scalability. Dr. Liyana transforms clinical challenges into sustainable national infrastructures.
              </p>
            </AnimatedSection> */}
          </div>

          {/* Right Column */}
          <div className="lg:col-span-5 flex flex-col items-center lg:items-end w-full">
            <AnimatedSection delay={0.2} className="w-full max-w-sm">
              <p className="font-mono text-[9px] tracking-[0.25em] uppercase text-ink-muted text-center mb-3">
                DR. LIYANA — PROFILE
              </p>
              <div className="border border-rule p-2.5 bg-white shadow-sm">
                <img
                  src="/image.png"
                  alt="Dr. Liyana"
                  className="w-full grayscale object-cover aspect-square hover:grayscale-0 transition-all duration-700"
                />
              </div>
            </AnimatedSection>
          </div>
        </div>
      </div>
    </section>
  )
}
