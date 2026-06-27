import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import { PageLoader } from '@/components/shared/PageLoader'

const HomePage = lazy(() => import('@/pages/HomePage'))
const AboutPage = lazy(() => import('@/pages/AboutPage'))
const LeadershipPage = lazy(() => import('@/pages/LeadershipPage'))
const EcosystemPage = lazy(() => import('@/pages/EcosystemPage'))
const PublicServicePage = lazy(() => import('@/pages/PublicServicePage'))
const EducationPage = lazy(() => import('@/pages/EducationPage'))
const AwardsPage = lazy(() => import('@/pages/AwardsPage'))
const FoundationPage = lazy(() => import('@/pages/FoundationPage'))
const MediaPage = lazy(() => import('@/pages/MediaPage'))
const GalleryPage = lazy(() => import('@/pages/GalleryPage'))
const ContactPage = lazy(() => import('@/pages/ContactPage'))
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'))

// Old admin routes removed - using new separate admin panel at apps/admin/

// Old admin components removed - using new separate admin panel at apps/admin/

export function AppRouter() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/leadership" element={<LeadershipPage />} />
        <Route path="/ecosystem" element={<EcosystemPage />} />
        <Route path="/public-service" element={<PublicServicePage />} />
        <Route path="/education" element={<EducationPage />} />
        <Route path="/awards-recognition" element={<AwardsPage />} />
        <Route path="/foundation" element={<FoundationPage />} />
        <Route path="/media-speaking" element={<MediaPage />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/contact" element={<ContactPage />} />

        {/* Old admin routes removed - use new admin panel at http://localhost:3001 */}

        {/* 404 catch-all */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  )
}
