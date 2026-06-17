import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { AnimatedSection, Container, Button } from '@/components/shared'

const schema = z.object({
  identity: z.string().min(1, 'Required'),
  email: z.string().email('Invalid email'),
  inquiryType: z.enum(['partnership', 'media', 'speaking', 'policy', 'other']),
  message: z.string().min(10, 'Minimum 10 characters'),
})

type FormValues = z.infer<typeof schema>

const inquiryLabels: Record<string, string> = {
  partnership: 'Foundation Partnership',
  media: 'Media & Press Kit',
  speaking: 'Keynote Speaking',
  policy: 'Policy Consultation',
  other: 'Other',
}

const channels = [
  'Strategic Partnerships',
  'Media & Press Kit',
  'Keynote Speaking',
  'Policy Consultation',
]

export default function PublicServiceContactSection() {
  const [success, setSuccess] = useState(false)

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { inquiryType: 'partnership' },
  })

  const onSubmit = async (_data: FormValues) => {
    await new Promise((r) => setTimeout(r, 1200))
    setSuccess(true)
  }

  return (
    <section className="section-padding bg-paper">
      <Container>
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-start">

          {/* Left */}
          <AnimatedSection>
            <h2 className="font-serif text-3xl lg:text-4xl font-light text-ink mb-6">
              Engagement Formalities
            </h2>
            <p className="text-sm font-light text-ink-mid leading-relaxed mb-10">
              For all high-level inquiries regarding board appointments, speaking
              engagements, or foundation partnerships, please utilize the formal
              channel below.
            </p>

            <ul className="space-y-4">
              {channels.map((ch, i) => (
                <AnimatedSection key={ch} delay={0.05 + i * 0.05}>
                  <li className="flex items-center gap-3 text-sm font-light text-ink-mid">
                    <span className="w-4 h-4 rounded-full border border-rule flex items-center justify-center shrink-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal" />
                    </span>
                    {ch}
                  </li>
                </AnimatedSection>
              ))}
            </ul>
          </AnimatedSection>

          {/* Right — form */}
          <AnimatedSection delay={0.1}>
            {success ? (
              <div className="border border-rule bg-white p-10 text-center">
                <p className="font-mono text-[9px] tracking-[0.2em] uppercase text-teal mb-3">Sent</p>
                <p className="font-serif text-2xl font-light text-ink">Inquiry received</p>
                <p className="mt-2 text-sm font-light text-ink-mid">We will follow up through formal channels.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="border border-rule bg-white p-8 space-y-6">

                {/* Full Identity */}
                <div>
                  <label className="block font-mono text-[9px] tracking-[0.2em] uppercase text-ink-mid mb-2">
                    Full Identity
                  </label>
                  <input
                    {...register('identity')}
                    placeholder="Full Identity / Organization"
                    className="w-full border-b border-rule bg-transparent py-2.5 text-sm text-ink outline-none transition-colors duration-200 focus:border-teal placeholder:text-ink-muted"
                  />
                  {errors.identity && <p className="mt-1 text-xs text-teal">{errors.identity.message}</p>}
                </div>

                {/* Email */}
                <div>
                  <label className="block font-mono text-[9px] tracking-[0.2em] uppercase text-ink-mid mb-2">
                    Email Address
                  </label>
                  <input
                    {...register('email')}
                    type="email"
                    placeholder="your@email.com"
                    className="w-full border-b border-rule bg-transparent py-2.5 text-sm text-ink outline-none transition-colors duration-200 focus:border-teal placeholder:text-ink-muted"
                  />
                  {errors.email && <p className="mt-1 text-xs text-teal">{errors.email.message}</p>}
                </div>

                {/* Inquiry Type */}
                <div>
                  <label className="block font-mono text-[9px] tracking-[0.2em] uppercase text-ink-mid mb-2">
                    Enquiry Type
                  </label>
                  <select
                    {...register('inquiryType')}
                    className="w-full border-b border-rule bg-transparent py-2.5 text-sm text-ink outline-none transition-colors duration-200 focus:border-teal"
                  >
                    {Object.entries(inquiryLabels).map(([val, label]) => (
                      <option key={val} value={val}>{label}</option>
                    ))}
                  </select>
                </div>

                {/* Message */}
                <div>
                  <label className="block font-mono text-[9px] tracking-[0.2em] uppercase text-ink-mid mb-2">
                    Message
                  </label>
                  <textarea
                    {...register('message')}
                    rows={4}
                    placeholder="Your message"
                    className="w-full border-b border-rule bg-transparent py-2.5 text-sm text-ink outline-none transition-colors duration-200 focus:border-teal resize-none placeholder:text-ink-muted"
                  />
                  {errors.message && <p className="mt-1 text-xs text-teal">{errors.message.message}</p>}
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full bg-teal text-white tracking-widest uppercase text-xs font-mono"
                >
                  {isSubmitting ? 'Submitting…' : 'Submit Inquiry'}
                </Button>
              </form>
            )}
          </AnimatedSection>
        </div>
      </Container>
    </section>
  )
}
