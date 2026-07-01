export interface HeroData {
  name: string
  title: string
  subtitle: string
  description: string
  cta: { label: string; path: string }[]
  backgroundImage: string
}

const heroData: HeroData = {
  name: 'Dr. Girma Ababi',
  title: 'Physician · Entrepreneur · Nation Builder',
  subtitle: 'He saw a broken system. He built the cure.',
  description:
    "Twenty years ago, a young doctor from Ethiopia made a decision that would reshape an entire nation's healthcare landscape — not by treating one patient at a time, but by building the institutions that treat millions.",
  cta: [
    { label: 'Explore Journey', path: '/timeline' },
    { label: 'Get in Touch', path: '/contact' },
  ],
  backgroundImage: '/hero-bg.jpg',
}

export default heroData
