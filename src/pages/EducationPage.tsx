import { useEffect } from 'react'
import PageBanner from '@/components/layout/PageBanner'
import { seoPages } from '@/lib/seo'
import {
  EducationListSection,
  EducationMembershipsSection,
} from '@/features/education'

export default function EducationPage() {
  useEffect(() => {
    document.title = seoPages.education.title
  }, [])

  return (
    <>
      <PageBanner
        title="Education & Credentials"
        description="Academic excellence from leading institutions worldwide."
      />
      <EducationListSection />
      <EducationMembershipsSection />
    </>
  )
}

