import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { AnimatedSection, Container, Button } from '@/components/shared'
import PageBanner from '@/components/layout/PageBanner'
import { contactInfo } from '@/data/contact'
import { seoPages } from '@/lib/seo'

const contactSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  organization: z.string().min(1, 'Organization is required'),
  phone: z.string().optional(),
  subject: z.string().min(1, 'Subject is required'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  inquiryType: z.enum(['partnership', 'speaking', 'media', 'foundation', 'other']),
})

type ContactFormValues = z.infer<typeof contactSchema>

export default function ContactPage() {
  useEffect(() => {
    document.title = seoPages.contact.title
  }, [])

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { inquiryType: 'partnership' },
  })

  const onSubmit = async (_data: ContactFormValues) => {
    setIsSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsSubmitting(false)
    setIsSuccess(true)
  }

  const { inquiryTypes } = contactInfo

  if (isSuccess) {
    return (
      <>
        <PageBanner title="Contact" description="Let's connect and create impact together." />
        <section className="section-padding bg-paper">
          <Container className="max-w-4xl mx-auto">
            <AnimatedSection className="text-center">
              <p className="font-mono text-[9px] tracking-[0.2em] uppercase text-teal mb-4">Sent</p>
              <h2 className="font-serif text-4xl md:text-5xl font-light text-ink mb-4">Message sent</h2>
              <p className="text-sm font-light text-ink-mid max-w-md mx-auto">
                Thank you for reaching out. I will review your inquiry and get back to you promptly.
              </p>
            </AnimatedSection>
          </Container>
        </section>
      </>
    )
  }

  return (
    <>
      <PageBanner title="Contact" description="Let's connect and create impact together." />

      <section className="section-padding bg-paper">
        <Container>
          <div className="grid lg:grid-cols-5 gap-12 lg:gap-20">
            {/* Form */}
            <div className="lg:col-span-3">
              <AnimatedSection>
                <div className="section-header">
                  <span className="section-tag">Connect</span>
                  <span className="section-rule" />
                </div>
                <h2 className="font-serif text-4xl md:text-5xl font-light text-ink mb-8">
                  Send a <em className="text-teal-mid not-italic">message</em>
                </h2>
              </AnimatedSection>
              <AnimatedSection delay={0.1}>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block font-mono text-[9px] tracking-[0.2em] uppercase text-ink-mid mb-2">
                        Name <span className="text-ink-muted">*</span>
                      </label>
                      <input
                        {...register('name')}
                        className="w-full border border-rule bg-white px-4 py-3 text-sm text-ink outline-none focus:border-teal"
                        placeholder="Your name"
                      />
                      {errors.name && <p className="mt-1 text-xs text-ink-muted">{errors.name.message}</p>}
                    </div>
                    <div>
                      <label className="block font-mono text-[9px] tracking-[0.2em] uppercase text-ink-mid mb-2">
                        Email <span className="text-ink-muted">*</span>
                      </label>
                      <input
                        {...register('email')}
                        type="email"
                        className="w-full border border-rule bg-white px-4 py-3 text-sm text-ink outline-none focus:border-teal"
                        placeholder="your@email.com"
                      />
                      {errors.email && <p className="mt-1 text-xs text-ink-muted">{errors.email.message}</p>}
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block font-mono text-[9px] tracking-[0.2em] uppercase text-ink-mid mb-2">
                        Organization <span className="text-ink-muted">*</span>
                      </label>
                      <input
                        {...register('organization')}
                        className="w-full border border-rule bg-white px-4 py-3 text-sm text-ink outline-none focus:border-teal"
                        placeholder="Organization name"
                      />
                      {errors.organization && <p className="mt-1 text-xs text-ink-muted">{errors.organization.message}</p>}
                    </div>
                    <div>
                      <label className="block font-mono text-[9px] tracking-[0.2em] uppercase text-ink-mid mb-2">
                        Phone <span className="text-ink-muted">(optional)</span>
                      </label>
                      <input
                        {...register('phone')}
                        className="w-full border border-rule bg-white px-4 py-3 text-sm text-ink outline-none focus:border-teal"
                        placeholder="+1234567890"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-mono text-[9px] tracking-[0.2em] uppercase text-ink-mid mb-2">
                      Inquiry Type <span className="text-ink-muted">*</span>
                    </label>
                    <select
                      {...register('inquiryType')}
                      className="w-full border border-rule bg-white px-4 py-3 text-sm text-ink outline-none focus:border-teal"
                    >
                      {inquiryTypes.map((type) => (
                        <option key={type.value} value={type.value}>{type.label}</option>
                      ))}
                    </select>
                    {errors.inquiryType && <p className="mt-1 text-xs text-ink-muted">{errors.inquiryType.message}</p>}
                  </div>

                  <div>
                    <label className="block font-mono text-[9px] tracking-[0.2em] uppercase text-ink-mid mb-2">
                      Subject <span className="text-ink-muted">*</span>
                    </label>
                    <input
                      {...register('subject')}
                      className="w-full border border-rule bg-white px-4 py-3 text-sm text-ink outline-none focus:border-teal"
                      placeholder="Subject of your message"
                    />
                    {errors.subject && <p className="mt-1 text-xs text-ink-muted">{errors.subject.message}</p>}
                  </div>

                  <div>
                    <label className="block font-mono text-[9px] tracking-[0.2em] uppercase text-ink-mid mb-2">
                      Message <span className="text-ink-muted">*</span>
                    </label>
                    <textarea
                      {...register('message')}
                      rows={5}
                      className="w-full border border-rule bg-white px-4 py-3 text-sm text-ink outline-none focus:border-teal resize-y"
                      placeholder="Your message (minimum 10 characters)"
                    />
                    {errors.message && <p className="mt-1 text-xs text-ink-muted">{errors.message.message}</p>}
                  </div>

                  <Button type="submit" variant="primary" size="lg" className="bg-teal text-white">
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </Button>
                </form>
              </AnimatedSection>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-2">
              <AnimatedSection>
                <div className="section-header">
                  <span className="section-tag">Information</span>
                  <span className="section-rule" />
                </div>
                <h2 className="font-serif text-3xl lg:text-4xl font-light text-ink mb-8">
                  Get in <em className="text-teal-mid not-italic">touch</em>
                </h2>
              </AnimatedSection>

              <AnimatedSection delay={0.1}>
                <div className="space-y-6 mb-10">
                  <div className="flex items-start gap-4">
                    <span className="w-8 h-[0.5px] bg-teal mt-3 shrink-0" />
                    <div>
                      <p className="text-xs text-ink-mid font-mono tracking-widest uppercase">Email</p>
                      <p className="text-sm text-ink-mid">{contactInfo.email}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <span className="w-8 h-[0.5px] bg-teal mt-3 shrink-0" />
                    <div>
                      <p className="text-xs text-ink-mid font-mono tracking-widest uppercase">Phone</p>
                      <p className="text-sm text-ink-mid">{contactInfo.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <span className="w-8 h-[0.5px] bg-teal mt-3 shrink-0" />
                    <div>
                      <p className="text-xs text-ink-mid font-mono tracking-widest uppercase">Location</p>
                      <p className="text-sm text-ink-mid">{contactInfo.location}</p>
                    </div>
                  </div>
                </div>
              </AnimatedSection>

              <AnimatedSection delay={0.2}>
                <p className="font-mono text-[9px] tracking-[0.2em] uppercase text-gold mb-4">Inquiry Types</p>
                <div className="space-y-4">
                  {inquiryTypes.map((type) => (
                    <div key={type.value} className="border border-rule bg-white p-4">
                      <p className="text-sm text-ink mb-1">{type.label}</p>
                      <p className="text-xs text-ink-muted">{type.description}</p>
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
