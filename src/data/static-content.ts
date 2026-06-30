import { personalStory } from './about'
// import other section data as needed, e.g.:
// import { heroContent } from './hero'
// import { leadershipData } from './leadership'
// ... etc.

export const staticSiteContent = {
  sections: {
    about_story: {
      title: 'The Story',
      description: 'A life dedicated to healthcare leadership and transformation.',
      eyebrow: 'The Story',
      subtitle: 'A life in <em class="text-teal-mid not-italic">service</em>',
      image_url: '/image.png',
      image_alt: 'Dr. Girma Ababi Portrait',
      metadata: {
        quote: "We don't just build healthcare facilities; we build the future of our nation's wellness.",
        attribution: 'Dr. Girma Ababi, Founder',
      },
      blocks: [],   // leave empty → your component's fallback will split personalStory
    },
    // hero: { ... },
    // leadership: { ... },
    // … add every section your CMS sends
  },
  navigation: {
    links: [
      { label: 'Home', href: '/' },
      { label: 'About', href: '/about' },
      { label: 'Work', href: '/work' },
      // … add your static nav items
    ],
  },
}
