import { useState, useRef, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion, useInView, type Variants } from 'framer-motion'
import { Container, Button } from '@/components/shared'
import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 5000,
})

const fallbackContact = {
  heading: 'Get in touch',
  email: 'info@liyanahealthcare.com',
  phone: '+251-11-XXX-XXXX',
  location: 'Addis Ababa, Ethiopia',
  image_url: '',
  image_caption: '',
}

const fallbackInquiryTypes = [
  { value: 'partnership', label: 'Partnerships' },
  { value: 'media', label: 'Media' },
  { value: 'speaking', label: 'Speaking' },
  { value: 'other', label: 'Policy' },
  { value: 'foundation', label: 'Foundation' },
]

const contactSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  organization: z.string().min(1, 'Organization is required'),
  phone: z.string().optional(),
  subject: z.string().min(1, 'Subject is required'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  inquiryType: z.string().min(1, 'Please select an inquiry type'),
})

type ContactFormValues = z.infer<typeof contactSchema>

export default function ContactFormSection() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [contactData, setContactData] = useState(fallbackContact)
  const [inquiryTypes, setInquiryTypes] = useState(fallbackInquiryTypes)

  const sectionRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-60px' })

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { inquiryType: '' },
  })

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const [settingsRes, typesRes] = await Promise.all([
          api.get('/contact/settings'),
          api.get('/contact/inquiry-types'),
        ])
        if (cancelled) return
        if (settingsRes.data && Object.keys(settingsRes.data).length) {
          setContactData((prev) => ({ ...prev, ...settingsRes.data }))
        }
        if (typesRes.data?.length) {
          setInquiryTypes(typesRes.data)
        }
      } catch (err) {
        console.warn('CMS offline – using default contact data', err)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const onSubmit = async (data: ContactFormValues) => {
    setIsSubmitting(true)
    try {
      await api.post('/contact/messages', data)
      setIsSubmitting(false)
      setIsSuccess(true)
    } catch (err) {
      setIsSubmitting(false)
      console.error('Failed to send message:', err)
    }
  }

  const formItemVariants: Variants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
    },
  }

  if (isSuccess) {
    return (
      <section className="section-padding bg-paper min-h-[50vh] flex items-center">
        <Container className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="text-center p-8 md:p-12 border border-rule bg-white shadow-sm max-w-xl mx-auto relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-teal to-teal-mid" />
            <p className="font-mono text-[9px] tracking-[0.2em] uppercase text-teal mb-4">Sent</p>
            <h2 className="font-serif text-4xl md:text-5xl font-light text-ink mb-4">
              Message sent
            </h2>
            <p className="text-sm font-light text-ink-mid max-w-md mx-auto leading-relaxed mb-6">
              Thank you for reaching out. I will review your inquiry and get back to you promptly.
            </p>
          </motion.div>
        </Container>
      </section>
    )
  }

  return (
    <section ref={sectionRef} className="relative overflow-hidden section-padding bg-paper">
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isInView ? { opacity: 0.15, scale: 1.1 } : {}}
          transition={{ duration: 1.8, ease: 'easeOut' }}
          className="absolute -right-20 top-20 w-[300px] md:w-[500px] h-[300px] md:h-[500px] rounded-full blur-[100px] bg-gold-light"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isInView ? { opacity: 0.12, scale: 1 } : {}}
          transition={{ duration: 2.2, ease: 'easeOut', delay: 0.3 }}
          className="absolute -left-20 bottom-10 w-[250px] md:w-[450px] h-[250px] md:h-[450px] rounded-full blur-[120px] bg-teal-light"
        />
      </div>

      <Container className="relative z-10">
        <div className="grid lg:grid-cols-5 gap-12 lg:gap-20">
          <div className="lg:col-span-2">
            <div className="mb-8">
              <div className="section-header mb-4">
                <motion.span
                  initial={{ opacity: 0, y: 10 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5 }}
                  className="section-tag"
                >
                  Information
                </motion.span>
                <motion.span
                  initial={{ scaleX: 0 }}
                  animate={isInView ? { scaleX: 1 } : {}}
                  transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
                  className="section-rule origin-left"
                />
              </div>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="font-serif text-3xl lg:text-4xl font-light text-ink"
              >
                {contactData.heading}
              </motion.h2>
            </div>

            <div className="space-y-6 mb-12">
              {[
                { label: 'Email', value: contactData.email },
                { label: 'Phone', value: contactData.phone },
                { label: 'Location', value: contactData.location },
              ].map((info, idx) => (
                <motion.div
                  key={info.label}
                  initial={{ opacity: 0, x: -16 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.2 + idx * 0.1, ease: 'easeOut' }}
                  className="group flex items-start gap-4 cursor-default"
                >
                  <span className="w-8 h-[0.5px] bg-teal mt-3 shrink-0 transition-all duration-300 group-hover:w-12 group-hover:bg-teal-mid" />
                  <div className="transition-transform duration-300 group-hover:translate-x-1">
                    <p className="text-xs text-ink-mid font-mono tracking-widest uppercase mb-0.5">
                      {info.label}
                    </p>
                    <p className="text-sm text-ink-mid font-light transition-colors duration-200 group-hover:text-teal">
                      {info.value}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="mt-10 max-w-sm w-full hidden lg:block"
            >
              <div className="border border-rule p-2 bg-white shadow-sm relative group">
                <img
                  src={contactData.image_url || '/image.png'}
                  alt="Contact Profile"
                  onError={(e) => {
                    ;(e.target as HTMLImageElement).src = '/lab-connect.png'
                  }}
                  className="w-full object-cover aspect-[4/5] hover:grayscale transition-all duration-700"
                />
              </div>
              <p className="mt-3 text-[9px] font-mono tracking-widest uppercase text-ink-muted text-center">
                {contactData.image_caption || 'Ready to collaborate'}
              </p>
            </motion.div>
          </div>

          <div className="lg:col-span-3">
            <div className="mb-8">
              <div className="section-header mb-4">
                <motion.span
                  initial={{ opacity: 0, y: 10 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5 }}
                  className="section-tag"
                >
                  Connect
                </motion.span>
                <motion.span
                  initial={{ scaleX: 0 }}
                  animate={isInView ? { scaleX: 1 } : {}}
                  transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
                  className="section-rule origin-left"
                />
              </div>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="font-serif text-4xl md:text-5xl font-light text-ink"
              >
                Send a <em className="text-teal-mid not-italic">message</em>
              </motion.h2>
            </div>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-6 bg-white p-8 border border-rule shadow-sm"
            >
              <motion.div
                variants={formItemVariants}
                initial="hidden"
                animate={isInView ? 'visible' : 'hidden'}
                className="grid md:grid-cols-2 gap-4 sm:gap-6"
              >
                <div>
                  <label className="block font-mono text-[9px] tracking-[0.2em] uppercase text-ink-mid mb-2">
                    Name <span className="text-teal-mid">*</span>
                  </label>
                  <input
                    {...register('name')}
                    className="w-full border border-rule bg-paper-warm px-4 py-3 text-sm text-ink outline-none transition-all duration-300 focus:border-teal focus:ring-1 focus:ring-teal/30 focus:bg-white"
                    placeholder="Your name"
                  />
                  {errors.name && <p className="mt-1 text-xs text-teal">{errors.name.message}</p>}
                </div>
                <div>
                  <label className="block font-mono text-[9px] tracking-[0.2em] uppercase text-ink-mid mb-2">
                    Email <span className="text-teal-mid">*</span>
                  </label>
                  <input
                    {...register('email')}
                    type="email"
                    className="w-full border border-rule bg-paper-warm px-4 py-3 text-sm text-ink outline-none transition-all duration-300 focus:border-teal focus:ring-1 focus:ring-teal/30 focus:bg-white"
                    placeholder="your@email.com"
                  />
                  {errors.email && <p className="mt-1 text-xs text-teal">{errors.email.message}</p>}
                </div>
              </motion.div>

              <motion.div
                variants={formItemVariants}
                initial="hidden"
                animate={isInView ? 'visible' : 'hidden'}
                transition={{ delay: 0.1 }}
                className="grid md:grid-cols-2 gap-4 sm:gap-6"
              >
                <div>
                  <label className="block font-mono text-[9px] tracking-[0.2em] uppercase text-ink-mid mb-2">
                    Organization <span className="text-teal-mid">*</span>
                  </label>
                  <input
                    {...register('organization')}
                    className="w-full border border-rule bg-paper-warm px-4 py-3 text-sm text-ink outline-none transition-all duration-300 focus:border-teal focus:ring-1 focus:ring-teal/30 focus:bg-white"
                    placeholder="Organization name"
                  />
                  {errors.organization && (
                    <p className="mt-1 text-xs text-teal">{errors.organization.message}</p>
                  )}
                </div>
                <div>
                  <label className="block font-mono text-[9px] tracking-[0.2em] uppercase text-ink-mid mb-2">
                    Phone <span className="text-ink-muted">(optional)</span>
                  </label>
                  <input
                    {...register('phone')}
                    className="w-full border border-rule bg-paper-warm px-4 py-3 text-sm text-ink outline-none transition-all duration-300 focus:border-teal focus:ring-1 focus:ring-teal/30 focus:bg-white"
                    placeholder="+1234567890"
                  />
                </div>
              </motion.div>

              <motion.div
                variants={formItemVariants}
                initial="hidden"
                animate={isInView ? 'visible' : 'hidden'}
                transition={{ delay: 0.15 }}
              >
                <label className="block font-mono text-[9px] tracking-[0.2em] uppercase text-ink-mid mb-2">
                  Inquiry Type <span className="text-teal-mid">*</span>
                </label>
                <select
                  {...register('inquiryType')}
                  className="w-full border border-rule bg-paper-warm px-4 py-3 text-sm text-ink outline-none transition-all duration-300 focus:border-teal focus:ring-1 focus:ring-teal/30 focus:bg-white"
                >
                  <option value="">Select type</option>
                  {inquiryTypes.map((type: any) => (
                    <option key={type.id || type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
                {errors.inquiryType && (
                  <p className="mt-1 text-xs text-teal">{errors.inquiryType.message}</p>
                )}
              </motion.div>

              <motion.div
                variants={formItemVariants}
                initial="hidden"
                animate={isInView ? 'visible' : 'hidden'}
                transition={{ delay: 0.2 }}
              >
                <label className="block font-mono text-[9px] tracking-[0.2em] uppercase text-ink-mid mb-2">
                  Subject <span className="text-teal-mid">*</span>
                </label>
                <input
                  {...register('subject')}
                  className="w-full border border-rule bg-paper-warm px-4 py-3 text-sm text-ink outline-none transition-all duration-300 focus:border-teal focus:ring-1 focus:ring-teal/30 focus:bg-white"
                  placeholder="Subject of your message"
                />
                {errors.subject && (
                  <p className="mt-1 text-xs text-teal">{errors.subject.message}</p>
                )}
              </motion.div>

              <motion.div
                variants={formItemVariants}
                initial="hidden"
                animate={isInView ? 'visible' : 'hidden'}
                transition={{ delay: 0.25 }}
              >
                <label className="block font-mono text-[9px] tracking-[0.2em] uppercase text-ink-mid mb-2">
                  Message <span className="text-teal-mid">*</span>
                </label>
                <textarea
                  {...register('message')}
                  rows={5}
                  className="w-full border border-rule bg-paper-warm px-4 py-3 text-sm text-ink outline-none transition-all duration-300 focus:border-teal focus:ring-1 focus:ring-teal/30 focus:bg-white resize-y"
                  placeholder="Your message (minimum 10 characters)"
                />
                {errors.message && (
                  <p className="mt-1 text-xs text-teal">{errors.message.message}</p>
                )}
              </motion.div>

              <motion.div
                variants={formItemVariants}
                initial="hidden"
                animate={isInView ? 'visible' : 'hidden'}
                transition={{ delay: 0.3 }}
                className="pt-2"
              >
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full bg-teal text-white shadow-sm hover:shadow-md transition-all duration-300"
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </Button>
              </motion.div>
            </form>
          </div>
        </div>
      </Container>
    </section>
  )
}
