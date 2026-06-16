import type { NavLink } from '@/types'

export const mainNavigation: NavLink[] = [
  { label: 'Home', path: '/' },
  { label: 'About', path: '/about' },
  { label: 'Leadership', path: '/leadership' },
  { label: 'Ecosystem', path: '/ecosystem' },
  { label: 'Public Service', path: '/public-service' },
  { label: 'Education', path: '/education' },
  { label: 'Awards', path: '/awards-recognition' },
  { label: 'Foundation', path: '/foundation' },
  { label: 'Media', path: '/media-speaking' },
  { label: 'Gallery', path: '/gallery' },
  { label: 'Contact', path: '/contact' },
]

export const footerSections = [
  {
    title: 'Profile',
    links: [
      { label: 'About', path: '/about' },
      { label: 'Leadership', path: '/leadership' },
      { label: 'Education', path: '/education' },
      { label: 'Awards', path: '/awards-recognition' },
    ],
  },
  {
    title: 'Impact',
    links: [
      { label: 'Healthcare Ecosystem', path: '/ecosystem' },
      { label: 'Public Service', path: '/public-service' },
      { label: 'Foundation', path: '/foundation' },
    ],
  },
  {
    title: 'Media',
    links: [
      { label: 'Media & Speaking', path: '/media-speaking' },
      { label: 'Gallery', path: '/gallery' },
    ],
  },
  {
    title: 'Connect',
    links: [
      { label: 'Contact', path: '/contact' },
    ],
  },
]
