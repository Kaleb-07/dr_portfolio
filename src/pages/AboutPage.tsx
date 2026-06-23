import { useEffect } from 'react'
import PageBanner from '@/components/layout/PageBanner'
import { useSiteContent } from '@/hooks/useSiteContent'
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

  const { content } = useSiteContent()
  const banner = content?.sections?.about_banner

  return (
    <>
      <PageBanner
        title={banner?.title || 'The Story'}
        description={banner?.description || 'A life dedicated to healthcare leadership and transformation.'}
      />
      <AboutStory />
      <AboutPhilosophy />
      <AboutValues />
      <AboutVision />
      <AboutTimeline />
    </>
  )
}

