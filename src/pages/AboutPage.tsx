import { useEffect } from 'react'
import PageBanner from '@/components/layout/PageBanner'
import { seoPages } from '@/lib/seo'
import {
  AboutStory,
  AboutPhilosophy,
  AboutValues,
  AboutVision,
  AboutTimeline,
} from '@/features/about'

export default function AboutPage() {
  useEffect(() => {
    document.title = seoPages.about.title
  }, [])

  return (
    <>
      <PageBanner
        title="The Story"
        description="A life dedicated to healthcare leadership and transformation."
      />
      <AboutStory />
      <AboutPhilosophy />
      <AboutValues />
      <AboutVision />
      <AboutTimeline />
    </>
  )
}

