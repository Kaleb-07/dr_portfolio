import { useEffect } from 'react'
import PageBanner from '@/components/layout/PageBanner'
import { useSiteContent } from '@/hooks/useSiteContent'
import { seoPages } from '@/lib/seo'
import {
  EducationListSection,
  EducationMembershipsSection,
} from '@/features/education'

export default function EducationPage() {
  useEffect(() => {
    document.title = seoPages.education.title
  }, [])
  const { content } = useSiteContent()
  const section = content?.sections?.about_education

  return (
    <>
      <PageBanner
        title={section?.title || 'Education & Credentials'}
        description={section?.description || 'Academic excellence from leading institutions worldwide.'}
      />
      <EducationListSection />
      <EducationMembershipsSection />
    </>
  )
}
