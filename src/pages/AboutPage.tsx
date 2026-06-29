import { useEffect } from 'react'
import PageBanner from '@/components/layout/PageBanner'
import { seoPages } from '@/lib/seo'
import { useSiteContent } from '@/hooks/useSiteContent'
import {
  AboutStory,
  AboutPhilosophy,
  AboutValues,
  AboutVision,
  AboutTimeline,
} from '@/features/about'

export default function AboutPage() {
  const { content } = useSiteContent()
  const section = content?.sections?.about_story

  useEffect(() => {
    document.title = seoPages.about.title
  }, [])

  return (
    <>
      <PageBanner
        title={section?.title || 'The Story'}
        description={section?.description || 'A life dedicated to healthcare leadership and transformation.'}
      />
      <AboutStory />
      <AboutPhilosophy />
      <AboutValues />
      <AboutVision />
      <AboutTimeline />
    </>
  )
}