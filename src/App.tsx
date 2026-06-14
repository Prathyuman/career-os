import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import NeuralLattice from './components/NeuralLattice'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import DashboardPage from './pages/DashboardPage'
import ProfilePage from './pages/ProfilePage'
import ResumeAnalyzerPage from './pages/ResumeAnalyzerPage'
import GitHubAnalyzerPage from './pages/GitHubAnalyzerPage'
import SkillGapPage from './pages/SkillGapPage'
import RoadmapPage from './pages/RoadmapPage'
import CoursesPage from './pages/CoursesPage'
import CertificationsPage from './pages/CertificationsPage'
import ProjectsPage from './pages/ProjectsPage'
import InternshipsPage from './pages/InternshipsPage'
import JobsPage from './pages/JobsPage'
import InterviewPage from './pages/InterviewPage'
import ProgressPage from './pages/ProgressPage'
import SettingsPage from './pages/SettingsPage'
import AdminPage from './pages/AdminPage'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

function AppLayout({ children, showNav = true, showFooter = true }: { children: React.ReactNode; showNav?: boolean; showFooter?: boolean }) {
  return (
    <div className="relative min-h-screen">
      <NeuralLattice />
      <div className="relative z-10">
        {showNav && <Navbar />}
        <main>{children}</main>
        {showFooter && <Footer />}
      </div>
    </div>
  )
}

function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<AppLayout showNav={true} showFooter={true}><HomePage /></AppLayout>} />
        <Route path="/login" element={<AppLayout showNav={false} showFooter={false}><LoginPage /></AppLayout>} />
        <Route path="/signup" element={<AppLayout showNav={false} showFooter={false}><SignupPage /></AppLayout>} />
        <Route path="/forgot-password" element={<AppLayout showNav={false} showFooter={false}><ForgotPasswordPage /></AppLayout>} />
        <Route path="/dashboard" element={<AppLayout showNav={true} showFooter={false}><DashboardPage /></AppLayout>} />
        <Route path="/profile" element={<AppLayout showNav={true} showFooter={false}><ProfilePage /></AppLayout>} />
        <Route path="/resume-analyzer" element={<AppLayout showNav={true} showFooter={false}><ResumeAnalyzerPage /></AppLayout>} />
        <Route path="/github-analyzer" element={<AppLayout showNav={true} showFooter={false}><GitHubAnalyzerPage /></AppLayout>} />
        <Route path="/skill-gap" element={<AppLayout showNav={true} showFooter={false}><SkillGapPage /></AppLayout>} />
        <Route path="/roadmap" element={<AppLayout showNav={true} showFooter={false}><RoadmapPage /></AppLayout>} />
        <Route path="/courses" element={<AppLayout showNav={true} showFooter={false}><CoursesPage /></AppLayout>} />
        <Route path="/certifications" element={<AppLayout showNav={true} showFooter={false}><CertificationsPage /></AppLayout>} />
        <Route path="/projects" element={<AppLayout showNav={true} showFooter={false}><ProjectsPage /></AppLayout>} />
        <Route path="/internships" element={<AppLayout showNav={true} showFooter={false}><InternshipsPage /></AppLayout>} />
        <Route path="/jobs" element={<AppLayout showNav={true} showFooter={false}><JobsPage /></AppLayout>} />
        <Route path="/interview" element={<AppLayout showNav={true} showFooter={false}><InterviewPage /></AppLayout>} />
        <Route path="/progress" element={<AppLayout showNav={true} showFooter={false}><ProgressPage /></AppLayout>} />
        <Route path="/settings" element={<AppLayout showNav={true} showFooter={false}><SettingsPage /></AppLayout>} />
        <Route path="/admin" element={<AppLayout showNav={true} showFooter={false}><AdminPage /></AppLayout>} />
      </Routes>
    </>
  )
}

export default App
