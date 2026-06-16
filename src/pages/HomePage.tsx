import { useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'

import { AnimatedSection, Container, Button, Card, Timeline } from '@/components/shared'
import { cn } from '@/lib/utils'
import { impactMetrics } from '@/data/metrics'
import { timeline as timelineData } from '@/data/timeline'
import { ecosystemNodes } from '@/data/ecosystem'
import { publicServiceRoles } from '@/data/public-service'
import { awards } from '@/data/awards'
import { personalStory } from '@/data/about'
import { education } from '@/data/education'
import { contactInfo } from '@/data/contact'
import { foundationOverview } from '@/data/foundation'
import { siteConfig, identityItems } from '@/constants/site'
import { seoPages } from '@/lib/seo'

const ecosystemPreviewNodes = ecosystemNodes.slice(0, 6)
const featuredPublicService = publicServiceRoles.slice(0, 3)
const featuredAwards = awards.slice(0, 4)

export default function HomePage() {
  useEffect(() => {
    document.title = seoPages.home.title
  }, [])

  const timelineItems = useMemo(
    () =>
      timelineData.map((item) => ({
        year: String(item.year),
        title: item.title,
        subtitle: item.subtitle,
        milestone: item.category === 'milestone',
      })),
    [],
  )

  return (
    <>
      {/* Hero */}
      <section className="min-h-screen grid md:grid-cols-2">
        <div className="flex flex-col justify-center px-6 sm:px-12 lg:px-16 py-20 lg:py-0">
          <AnimatedSection>
            <p className="font-mono text-xs tracking-[0.2em] uppercase text-teal mb-6">
              {siteConfig.hero.eyebrow}
            </p>
          </AnimatedSection>
          <AnimatedSection delay={0.1}>
            <h1 className="font-serif text-5xl lg:text-7xl font-light leading-tight text-ink mb-6">
              He saw a broken system. <br />He <em className="text-teal-mid not-italic">built the cure.</em>
            </h1>
          </AnimatedSection>
          <AnimatedSection delay={0.2}>
            <p className="text-sm font-light text-ink-mid leading-relaxed max-w-md mb-10 border-l-2 border-teal pl-5">
              {siteConfig.hero.description}
            </p>
          </AnimatedSection>
          <AnimatedSection delay={0.3}>
            <div className="flex gap-4">
              <Link to="/about">
                <Button variant="primary" size="lg" className="bg-teal text-white">Explore Journey</Button>
              </Link>
              <Link to="/contact">
                <Button variant="ghost" size="lg" className="border border-ink-faint text-ink">Get in Touch</Button>
              </Link>
            </div>
          </AnimatedSection>
        </div>

        <div className="bg-paper-warm px-6 sm:px-12 lg:px-16 py-20 lg:py-0 flex flex-col justify-center">
          <AnimatedSection>
            <p className="font-mono text-[9px] tracking-[0.2em] uppercase text-teal mb-10">Who he is</p>
            <div className="space-y-0">
              {identityItems.map((item) => (
                <div key={item.num}>
                  <div className="flex gap-6 py-6">
                    <span className="font-mono text-[9px] tracking-widest uppercase text-teal shrink-0 w-6">{item.num}</span>
                    <div>
                      <h3 className="font-serif text-lg font-light text-ink">{item.title}</h3>
                      <p className="text-sm text-ink-muted font-light mt-1">{item.detail}</p>
                    </div>
                  </div>
                  <div className="border-rule" />
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Impact Bar */}
      <section className="bg-ink py-12">
        <Container>
          <div className="grid grid-cols-3 md:grid-cols-6">
            {impactMetrics.map((metric, i) => (
              <div
                key={metric.id}
                className={cn(
                  'text-center px-4 py-6',
                  i < impactMetrics.length - 1 && 'border-r border-white/10',
                )}
              >
                <p className="font-serif text-4xl font-light text-white mb-2">
                  {metric.value.replace('+', '')}<span className="text-teal-mid">+</span>
                </p>
                <p className="text-xs font-light text-white/45 leading-relaxed">{metric.label}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Story Section */}
      <section className="section-padding bg-paper">
        <Container>
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-20">
            <div className="lg:col-span-4 lg:sticky lg:top-24 lg:self-start">
              <AnimatedSection>
                <div className="section-header">
                  <span className="section-tag">The Vision</span>
                  <span className="section-rule" />
                </div>
                <blockquote className="font-serif text-2xl italic font-light text-ink leading-relaxed">
                  &ldquo;A healthier Africa is not just a dream. It is a <strong className="not-italic text-teal">blueprint</strong> we are building every day.&rdquo;
                </blockquote>
              </AnimatedSection>
            </div>
            <div className="lg:col-span-7 lg:col-start-6">
              <AnimatedSection>
                <div className="section-header">
                  <span className="section-tag">The Story</span>
                  <span className="section-rule" />
                </div>
                <h2 className="font-serif text-4xl md:text-5xl font-light text-ink mb-10">
                  From medical student to <em className="text-teal-mid not-italic">healthcare architect</em>
                </h2>
              </AnimatedSection>
              <div className="space-y-12">
                {[0, 1, 2].map((chapterIndex) => {
                  const chunkSize = Math.ceil(personalStory.length / 3)
                  const start = chapterIndex * chunkSize
                  const end = Math.min(start + chunkSize, personalStory.length)
                  const text = personalStory.slice(start, end)
                  if (!text) return null
                  return (
                    <AnimatedSection key={chapterIndex} delay={chapterIndex * 0.1}>
                      <p className="font-mono text-[9px] tracking-[0.2em] uppercase text-gold mb-3">
                        Chapter {String(chapterIndex + 1).padStart(2, '0')}
                      </p>
                      <p className="text-base font-light text-ink-mid leading-[1.9]">
                        {text}
                      </p>
                    </AnimatedSection>
                  )
                })}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Journey Timeline */}
      <section className="section-padding bg-paper-warm">
        <Container>
          <AnimatedSection>
            <div className="section-header">
              <span className="section-tag">Career Timeline</span>
              <span className="section-rule" />
            </div>
            <h2 className="font-serif text-4xl md:text-5xl font-light text-ink mb-12">
              From medical student to <em className="text-teal-mid not-italic">system architect</em>
            </h2>
          </AnimatedSection>
          <AnimatedSection delay={0.2}>
            <Timeline items={timelineItems} />
          </AnimatedSection>
        </Container>
      </section>

      {/* Ecosystem Preview */}
      <section className="section-padding bg-paper">
        <Container>
          <AnimatedSection>
            <div className="section-header">
              <span className="section-tag">Ecosystem</span>
              <span className="section-rule" />
            </div>
            <h2 className="font-serif text-4xl md:text-5xl font-light text-ink mb-4">
              The <em className="text-teal-mid not-italic">healthcare ecosystem</em>
            </h2>
            <p className="text-sm font-light text-ink-mid leading-relaxed max-w-2xl mb-12">
              An interconnected network of healthcare enterprises and initiatives built over three decades.
            </p>
          </AnimatedSection>
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {ecosystemPreviewNodes.map((node, i) => (
              <AnimatedSection key={node.id} delay={i * 0.05}>
                <Card className="bg-white border border-rule">
                  <p className="font-mono text-[9px] tracking-[0.2em] uppercase text-teal mb-3">{node.category}</p>
                  <h3 className="font-serif text-xl font-light text-ink mb-2">{node.name}</h3>
                  <p className="text-sm font-light text-ink-mid leading-relaxed">{node.description}</p>
                </Card>
              </AnimatedSection>
            ))}
          </div>
          <div className="text-center">
            <Link to="/ecosystem">
              <Button variant="primary" size="lg" className="bg-teal text-white">Explore Full Ecosystem</Button>
            </Link>
          </div>
        </Container>
      </section>

      {/* Public Service Preview */}
      <section className="section-padding bg-paper-warm">
        <Container>
          <AnimatedSection>
            <div className="section-header">
              <span className="section-tag">Public Service</span>
              <span className="section-rule" />
            </div>
            <h2 className="font-serif text-4xl md:text-5xl font-light text-ink mb-4">
              Shaping <em className="text-teal-mid not-italic">health systems</em>
            </h2>
            <p className="text-sm font-light text-ink-mid leading-relaxed max-w-2xl mb-12">
              Contributions to national and continental health policy.
            </p>
          </AnimatedSection>
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {featuredPublicService.map((role, i) => (
              <AnimatedSection key={role.id} delay={i * 0.1}>
                <Card className="bg-white border border-rule">
                  <p className="font-mono text-[9px] tracking-[0.2em] uppercase text-gold mb-2">{role.category}</p>
                  <h3 className="font-serif text-lg font-light text-ink mb-1">{role.title}</h3>
                  <p className="text-sm text-teal mb-1">{role.organization}</p>
                  <p className="text-xs text-ink-muted mb-3">{role.period}</p>
                  <p className="text-sm font-light text-ink-mid leading-relaxed">{role.description}</p>
                </Card>
              </AnimatedSection>
            ))}
          </div>
          <div className="text-center">
            <Link to="/public-service">
              <Button variant="primary" size="lg" className="bg-teal text-white">View All Public Service Roles</Button>
            </Link>
          </div>
        </Container>
      </section>

      {/* Education Preview */}
      <section className="section-padding bg-paper">
        <Container>
          <AnimatedSection>
            <div className="section-header">
              <span className="section-tag">Education</span>
              <span className="section-rule" />
            </div>
            <h2 className="font-serif text-4xl md:text-5xl font-light text-ink mb-12">
              Academic <em className="text-teal-mid not-italic">foundations</em>
            </h2>
          </AnimatedSection>
          <div className="grid md:grid-cols-3 gap-6">
            {education.map((item, i) => (
              <AnimatedSection key={item.id} delay={i * 0.1}>
                <Card className="bg-white border border-rule">
                  <p className="font-mono text-[9px] tracking-[0.2em] uppercase text-teal mb-2">{item.year}</p>
                  <h3 className="font-serif text-lg font-light text-ink mb-1">{item.degree}</h3>
                  <p className="text-sm text-ink-mid mb-3">{item.institution}</p>
                  <p className="text-sm font-light text-ink-muted leading-relaxed">{item.description}</p>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </Container>
      </section>

      {/* Awards Preview */}
      <section className="section-padding bg-ink text-white">
        <Container>
          <AnimatedSection>
            <div className="section-header">
              <span className="section-tag text-teal">Recognition</span>
              <span className="section-rule !bg-white/20" />
            </div>
            <h2 className="font-serif text-4xl md:text-5xl font-light text-white mb-12">
              Awards & <em className="text-teal-mid not-italic">honours</em>
            </h2>
          </AnimatedSection>
          <div className="grid sm:grid-cols-2 gap-6">
            {featuredAwards.map((award, i) => (
              <AnimatedSection key={award.id} delay={i * 0.1}>
                <div className="p-6 border border-white/10">
                  <p className="font-mono text-[9px] tracking-[0.2em] uppercase text-teal-mid mb-3">{award.category}</p>
                  <h3 className="font-serif text-lg font-light text-white mb-1">{award.title}</h3>
                  <p className="text-sm text-white/60 mb-1">{award.organization}</p>
                  <p className="font-mono text-[9px] tracking-[0.2em] uppercase text-gold">{award.year}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link to="/awards-recognition">
              <Button variant="ghost" size="lg" className="border border-white/20 text-white">View All Awards</Button>
            </Link>
          </div>
        </Container>
      </section>

      {/* Philosophy Section */}
      <section className="bg-teal text-white text-center py-24">
        <Container className="max-w-4xl mx-auto">
          <AnimatedSection>
            <p className="font-mono text-[9px] tracking-[0.2em] uppercase text-white/50 mb-8">
              {siteConfig.philosophy.label}
            </p>
            <blockquote className="font-serif text-3xl lg:text-5xl font-light italic leading-tight max-w-4xl mx-auto">
              &ldquo;{siteConfig.philosophy.quote.replace(/"/g, '')}&rdquo;
            </blockquote>
            <p className="mt-8 text-sm text-white/60">{siteConfig.philosophy.attribution}</p>
          </AnimatedSection>
        </Container>
      </section>

      {/* Foundation Section */}
      <section className="section-padding bg-paper">
        <Container>
          <AnimatedSection>
            <div className="section-header">
              <span className="section-tag">Foundation</span>
              <span className="section-rule" />
            </div>
          </AnimatedSection>
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
            <div>
              <AnimatedSection delay={0.1}>
                <h2 className="font-serif text-4xl md:text-5xl font-light text-ink mb-6">
                  The <em className="text-teal-mid not-italic">LUCS Foundation</em>
                </h2>
                <p className="text-sm font-light text-ink-mid leading-relaxed mb-8">
                  {foundationOverview.description}
                </p>
                <div className="space-y-4">
                  {['Community Health', 'Education Access', 'Healthcare Infrastructure', 'Professional Mentorship'].map((pillar) => (
                    <div key={pillar} className="flex items-center gap-4">
                      <span className="w-8 h-[0.5px] bg-teal shrink-0" />
                      <span className="text-sm font-light text-ink-mid">{pillar}</span>
                    </div>
                  ))}
                </div>
              </AnimatedSection>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { value: '5+', label: 'Community Impact Pillars' },
                { value: '4', label: 'Board Chairmanships' },
                { value: '1', label: 'CSO Board Chairmanship' },
                { value: '1000+', label: 'Lives Impacted' },
              ].map((stat, i) => (
                <AnimatedSection key={stat.label} delay={0.2 + i * 0.05}>
                  <div className="bg-white border border-rule p-6 text-center">
                    <p className="font-serif text-3xl font-light text-teal mb-1">{stat.value}</p>
                    <p className="text-xs font-light text-ink-muted">{stat.label}</p>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Contact Section */}
      <section className="section-padding bg-paper-warm">
        <Container>
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
            <div>
              <AnimatedSection>
                <div className="section-header">
                  <span className="section-tag">Connect</span>
                  <span className="section-rule" />
                </div>
                <h2 className="font-serif text-4xl md:text-5xl font-light text-ink mb-6">
                  Let&rsquo;s work <em className="text-teal-mid not-italic">together</em>
                </h2>
                <p className="text-sm font-light text-ink-mid leading-relaxed mb-8">
                  Whether you are exploring partnership opportunities, inviting me to speak, or collaborating on health policy — I would love to hear from you.
                </p>
                <Link to="/contact">
                  <Button variant="primary" size="lg" className="bg-teal text-white">Send a Message</Button>
                </Link>
              </AnimatedSection>
            </div>
            <div>
              <AnimatedSection delay={0.1}>
                <p className="font-mono text-[9px] tracking-[0.2em] uppercase text-gold mb-6">Inquiry Types</p>
                <div className="space-y-4">
                  {contactInfo.inquiryTypes.map((type) => (
                    <div key={type.value} className="flex items-start gap-4">
                      <span className="w-4 h-[0.5px] bg-teal mt-3 shrink-0" />
                      <div>
                        <p className="text-sm text-ink mb-1">{type.label}</p>
                        <p className="text-xs text-ink-muted">{type.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </AnimatedSection>
            </div>
          </div>
        </Container>
      </section>
    </>
  )
}
