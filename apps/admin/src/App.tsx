import { useState } from 'react'
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import { NotificationProvider } from './components/NotificationContext'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import HeroEditor from './pages/HeroEditor'
import StoryEditor from './pages/StoryEditor'
import EcosystemEditor from './pages/EcosystemEditor'
import EducationEditor from './pages/EducationEditor'
import AwardsEditor from './pages/AwardsEditor'
import ContactEditor from './pages/ContactEditor'
import GalleryEditor from './pages/GalleryEditor'
import JourneyEditor from './pages/JourneyEditor'
import MediaEditor from './pages/MediaEditor'
import LeadershipEditor from './pages/LeadershipEditor'
import ImpactEditor from './pages/ImpactEditor'
import ContactMessages from './pages/ContactMessages'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!localStorage.getItem('token'))

  return (
    <Router>
      {isAuthenticated ? (
        <NotificationProvider>
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/hero" element={<HeroEditor />} />
              <Route path="/story/:sectionSlug" element={<StoryEditor />} />
              <Route path="/ecosystem" element={<EcosystemEditor />} />
              <Route path="/education" element={<EducationEditor />} />
              <Route path="/journey" element={<JourneyEditor />} />
              <Route path="/gallery" element={<GalleryEditor />} />
              <Route path="/media" element={<MediaEditor />} />
              <Route path="/achievements" element={<AwardsEditor />} />
              <Route path="/impact/:slug" element={<ImpactEditor />} />
              <Route path="/contact" element={<ContactEditor />} />
              <Route path="/contact-messages" element={<ContactMessages />} />
              <Route path="/leadership" element={<LeadershipEditor />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Layout>
        </NotificationProvider>
      ) : (
        <Login onLogin={() => setIsAuthenticated(true)} />
      )}
    </Router>
  )
}

export default App
