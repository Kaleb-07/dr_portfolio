import { lazy, Suspense } from 'react'
import type { ReactNode } from 'react'
import { Navigate, Routes, Route } from 'react-router-dom'
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
const Login = lazy(() => import('@/admin/pages/Login.jsx'))
const Dashboard = lazy(() => import('@/admin/pages/Dashboard.jsx'))
const HeroEditor = lazy(() => import('@/admin/pages/HeroEditor.jsx'))
const CmsEditor = lazy(() => import('@/admin/pages/CmsEditor.jsx'))
const StoryEditor = lazy(() => import('@/admin/pages/StoryEditor.jsx'))
const JourneyEditor = lazy(() => import('@/admin/pages/JourneyEditor.jsx'))
const AdminLayout = lazy(() => import('@/admin/layout/AdminLayout.jsx'))
const ContactEditor = lazy(() => import('@/admin/pages/ContactEditor.jsx'))
const ContactMessages = lazy(() => import('@/admin/pages/ContactMessages.jsx'))

function RequireAdmin({ children }: { children: ReactNode }) {
  const token = localStorage.getItem('token')

  if (!token) {
    return <Navigate to="/admin/login" replace />
  }

  return children
}

function SectionPlaceholder({ title }: { title: string }) {
  return (
    <section className="mx-auto max-w-4xl border border-rule bg-paper-card p-6 sm:p-8">
      <p className="section-tag">Editor</p>
      <h1 className="mt-3 font-serif text-4xl font-light text-ink">{title}</h1>
      <p className="mt-4 max-w-2xl text-sm font-light leading-relaxed text-ink-mid">
        This editor shell is ready for the next CMS phase.
      </p>
    </section>
  )
}

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
        <Route path="/contact" element={<ContactPage />} /> {/* 👈 public contact page */}
        {/* Admin login – outside the protected group */}
        <Route path="/admin/login" element={<Login />} />
        {/* Protected admin routes */}
        <Route
          path="/admin"
          element={
            <RequireAdmin>
              <AdminLayout />
            </RequireAdmin>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="story" element={<StoryEditor />} />
          <Route path="story/:sectionSlug" element={<StoryEditor />} />
          <Route path="content" element={<CmsEditor />} />
          <Route path="hero" element={<HeroEditor />} />

          {/* ✅ CONTACT ROUTES MOVED INSIDE /admin */}
          <Route path="contact" element={<ContactEditor />} />
          <Route path="contact/messages" element={<ContactMessages />} />

          <Route path="awards" element={<SectionPlaceholder title="Awards" />} />
          <Route path="leadership" element={<SectionPlaceholder title="Leadership" />} />
          <Route path="timeline" element={<SectionPlaceholder title="Timeline" />} />
          <Route path="profile" element={<SectionPlaceholder title="Profile" />} />
          <Route path="profile/journey" element={<JourneyEditor />} />
          <Route path="profile/education" element={<SectionPlaceholder title="Education" />} />
          <Route path="profile/gallery" element={<SectionPlaceholder title="Gallery" />} />
          <Route path="ecosystem" element={<SectionPlaceholder title="Ecosystem" />} />
          <Route
            path="ecosystem/vision"
            element={<SectionPlaceholder title="Ecosystem Vision" />}
          />
          <Route
            path="ecosystem/breakdown"
            element={<SectionPlaceholder title="Ecosystem Breakdown" />}
          />
          <Route path="impact" element={<SectionPlaceholder title="Impact" />} />
          <Route
            path="impact/public-service"
            element={<SectionPlaceholder title="Public Service" />}
          />
          <Route path="impact/leadership" element={<SectionPlaceholder title="Leadership" />} />
          <Route path="impact/foundation" element={<SectionPlaceholder title="Foundation" />} />
          <Route path="achievements" element={<SectionPlaceholder title="Achievements" />} />
          <Route
            path="achievements/awards"
            element={<SectionPlaceholder title="Awards & Recognition" />}
          />
          <Route
            path="achievements/media"
            element={<SectionPlaceholder title="Media & Speaking" />}
          />
        </Route>
        {/* 404 catch-all */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  )
}
