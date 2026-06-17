import { useEffect } from 'react'
import PageBanner from '@/components/layout/PageBanner'
import { seoPages } from '@/lib/seo'
import { ContactFormSection } from '@/features/contact'

export default function ContactPage() {
  useEffect(() => {
    document.title = seoPages.contact.title
  }, [])

  return (
    <>
      <PageBanner title="Contact" description="Let's connect and create impact together." />
      <ContactFormSection />
    </>
  )
}

