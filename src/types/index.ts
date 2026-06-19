export interface LeadershipRole {
  id: string
  title: string
  organization: string
  period: string
  description: string
  highlights: string[]
  category: 'executive' | 'board' | 'advisory' | 'founder'
}

export interface TimelineItem {
  id: string
  year: number
  title: string
  subtitle: string
  description: string
  category: 'career' | 'education' | 'award' | 'milestone'
  icon?: string
}

export interface Award {
  id: string
  title: string
  organization: string
  year: number
  description: string
  image: string
  category: 'professional' | 'alumni' | 'industry' | 'leadership'
}

export interface Education {
  id: string
  institution: string
  degree: string
  field: string
  year: number
  description: string
  highlights: string[]
  logo?: string
}

export interface EcosystemNode {
  id: string
  name: string
  description: string
  category: EcosystemCategory
  metrics?: string[]
  link?: string
}

export type EcosystemCategory =
  | 'hospital'
  | 'diagnostics'
  | 'education'
  | 'research'
  | 'manufacturing'
  | 'digital-health'
  | 'insurance'
  | 'community-services'

export interface ImpactMetric {
  id: string
  value: string
  label: string
  description?: string
  icon?: string
}

export interface MediaItem {
  id: string
  title: string
  type: 'interview' | 'conference' | 'podcast' | 'press' | 'speech' | 'video'
  source: string
  date: string
  description: string
  url?: string
  thumbnail?: string
}

export interface GalleryItem {
  id: string
  src: string
  alt: string
  caption: string
  category: GalleryCategory
  date?: string
  location?: string
}

export type GalleryCategory =
  | 'leadership'
  | 'healthcare'
  | 'education'
  | 'awards'
  | 'community'
  | 'conferences'

export interface PublicServiceRole {
  id: string
  title: string
  organization: string
  period: string
  description: string
  highlights: string[]
  category: 'advisory' | 'federation' | 'policy' | 'innovation'
}

export interface FoundationProgram {
  id: string
  title: string
  description: string
  impact: string
  beneficiaries: string
  status: 'active' | 'completed' | 'upcoming'
}

export interface NavLink {
  label: string
  path: string
  children?: NavLink[]
}

export interface ContactFormData {
  name: string
  email: string
  organization: string
  phone?: string
  subject: string
  message: string
  inquiryType: 'partnership' | 'speaking' | 'media' | 'foundation' | 'other'
}

export interface SeoMeta {
  title: string
  description: string
  keywords?: string[]
  ogImage?: string
}

export interface EcosystemConnection {
  source: string
  target: string
  label: string
}

export interface Testimonial {
  id: string
  quote: string
  author: string
  title: string
  organization: string
}

export interface LegacySection {
  title: string
  description: string
  items: LegacyItem[]
}

export interface LegacyItem {
  title: string
  description: string
  metric?: string
}

export interface CoreValue {
  title: string
  description: string
  icon: string
}
