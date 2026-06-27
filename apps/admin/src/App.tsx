import { useState } from 'react'
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import HeroEditor from './pages/HeroEditor'
import StoryEditor from './pages/StoryEditor'
import EcosystemEditor from './pages/EcosystemEditor'
import EducationEditor from './pages/EducationEditor'
import AwardsEditor from './pages/AwardsEditor'
import ContactEditor from './pages/ContactEditor'
import MediaEditor from './pages/MediaEditor'
import LeadershipEditor from './pages/LeadershipEditor'
import AchievementEditor from './pages/AchievementEditor'
import ImpactEditor from './pages/ImpactEditor'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!localStorage.getItem('token'))

  return (
    <Router>
      {isAuthenticated ? (
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/hero" element={<HeroEditor />} />
            <Route path="/story" element={<StoryEditor />} />
            <Route path="/ecosystem" element={<EcosystemEditor />} />
            <Route path="/education" element={<EducationEditor />} />
            <Route path="/awards" element={<AwardsEditor />} />
            <Route path="/achievements" element={<AchievementEditor />} />
            <Route path="/impact/:slug" element={<ImpactEditor />} />
            <Route path="/contact" element={<ContactEditor />} />
            <Route path="/media" element={<MediaEditor />} />
            <Route path="/leadership" element={<LeadershipEditor />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      ) : (
        <Login onLogin={() => setIsAuthenticated(true)} />
      )}
    </Router>
  )
}

export default App
