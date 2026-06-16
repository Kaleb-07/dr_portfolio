import type { SeoMeta } from '@/types'

export const defaultSeo: SeoMeta = {
  title: 'Executive Healthcare Leader | Visionary Leadership & Impact',
  description:
    'Transforming healthcare through visionary leadership, innovation, and impact across Africa and beyond.',
}

export function generateSeoMeta(page: Partial<SeoMeta>): SeoMeta {
  return {
    ...defaultSeo,
    ...page,
    title: page.title ? `${page.title} | Executive Healthcare Leader` : defaultSeo.title,
  }
}

export const seoPages = {
  home: generateSeoMeta({
    title: 'Home',
    description:
      'Visionary healthcare executive transforming healthcare delivery across Africa through leadership, innovation, and strategic impact.',
  }),
  about: generateSeoMeta({
    title: 'About',
    description:
      'Learn about a distinguished career in healthcare leadership, from clinical practice to executive strategy and national policy influence.',
  }),
  leadership: generateSeoMeta({
    title: 'Leadership & Impact',
    description:
      'Executive leadership roles, board memberships, and organizational impact across the healthcare ecosystem.',
  }),
  ecosystem: generateSeoMeta({
    title: 'Healthcare Ecosystem',
    description:
      'Integrated healthcare ecosystem spanning hospitals, diagnostics, education, research, manufacturing, digital health, insurance, and community services.',
  }),
  'public-service': generateSeoMeta({
    title: 'Public Service',
    description:
      'National contributions through ministry advisory roles, healthcare federation leadership, policy development, and innovation programs.',
  }),
  education: generateSeoMeta({
    title: 'Education & Credentials',
    description:
      'Academic credentials from University of Gondar, Addis Ababa University, and Stanford Graduate School of Business.',
  }),
  awards: generateSeoMeta({
    title: 'Awards & Recognition',
    description:
      'Professional awards, alumni recognition, industry honors, and leadership awards celebrating healthcare impact.',
  }),
  foundation: generateSeoMeta({
    title: 'Foundation & Community Impact',
    description:
      'Community impact through foundation programs, healthcare access initiatives, and social responsibility projects.',
  }),
  media: generateSeoMeta({
    title: 'Media & Speaking',
    description:
      'Media appearances, conference speaking engagements, podcasts, interviews, and press coverage on healthcare leadership.',
  }),
  gallery: generateSeoMeta({
    title: 'Gallery',
    description:
      'Professional image library capturing leadership moments, healthcare impact, education, awards, and community engagement.',
  }),
  contact: generateSeoMeta({
    title: 'Contact',
    description:
      'Connect for partnership inquiries, speaking invitations, media requests, or foundation collaboration opportunities.',
  }),
}
