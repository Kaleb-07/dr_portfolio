import { useEffect } from 'react'
import { seoPages } from '@/lib/seo'
import {
  HomeHero,
  HomeImpactBar,
  HomeTimeline,
  HomeEcosystem,
  HomeAwards,
  HomePhilosophy,
  HomeFoundation,
  HomeTestimonials,
  HomeContact,
} from '@/features/home'

export default function HomePage() {
  useEffect(() => {
    document.title = seoPages.home.title
  }, [])

  return (
    <>
      <HomeHero />
      <HomeImpactBar />
      {/* <HomeIdentities /> */}
      <HomeTimeline />
      <HomeEcosystem />
      <HomeFoundation />
      <HomeAwards />
      <HomeTestimonials />
      <HomePhilosophy />
      <HomeContact />
    </>
  )
}