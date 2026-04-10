import React, { useState, Suspense, lazy, useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import Loader from './components/Loader'
import OnboardingModal from './components/OnboardingModal'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import ProtectedRoute from './components/ProtectedRoute'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// Lazy pages
const LandingPage = lazy(() => import('./pages/LandingPage'))
const FeedPage = lazy(() => import('./pages/FeedPage'))
const UserProfilePage = lazy(() => import('./pages/UserProfilePage'))
const SearchPage = lazy(() => import('./pages/SearchPage'))
const TrendingPage = lazy(() => import('./pages/TrendingPage'))
const NotificationsPage = lazy(() => import('./pages/NotificationsPage'))
const LeaderboardPage = lazy(() => import('./pages/LeaderboardPage'))
const SettingsPage = lazy(() => import('./pages/SettingsPage'))
const AuthCallbackPage = lazy(() => import('./pages/AuthCallbackPage'))

const NotFoundPage = () => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', textAlign: 'center', padding: 24 }}>
    <div style={{ fontFamily: 'Space Grotesk', fontWeight: 800, fontSize: 'clamp(5rem, 15vw, 10rem)', lineHeight: 1, background: 'linear-gradient(135deg, var(--triton-2), var(--accent-gold))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>404</div>
    <h2 style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '1.5rem', marginBottom: 12 }}>Page not found</h2>
    <p style={{ color: 'var(--text-muted)', marginBottom: 28 }}>The page you're looking for doesn't exist.</p>
    <a href="/" className="btn btn-primary">Go Home</a>
  </div>
)

const PageSuspense = ({ children }) => (
  <Suspense fallback={
    <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}>
      <div className="spinner" style={{ width: 28, height: 28, borderWidth: 3 }} />
    </div>
  }>
    {children}
  </Suspense>
)

// Page transition wrapper
function AnimatedPage({ children }) {
  const location = useLocation()
  const ref = React.useRef(null)

  useEffect(() => {
    if (ref.current) {
      gsap.fromTo(ref.current,
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.45, ease: 'power3.out' }
      )
    }
  }, [location.pathname])

  return <div ref={ref}>{children}</div>
}

// App shell with sidebar + header
function AppShell({ children }) {
  const { user } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()

  // Close sidebar on route change
  useEffect(() => setSidebarOpen(false), [location.pathname])

  const isPublicRoute = ['/', '/login', '/auth/callback'].includes(location.pathname)

  if (isPublicRoute) return <AnimatedPage>{children}</AnimatedPage>

  return (
    <div className="app-layout">
      {user && <Sidebar mobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />}
      <main className="main-content" style={{ paddingBottom: 0 }}>
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <AnimatedPage>
          <div style={{ paddingBottom: 80 }}>
            {children}
          </div>
        </AnimatedPage>
      </main>
    </div>
  )
}

// Redirect from / based on auth
function HomeRedirect() {
  const { user, loading } = useAuth()
  if (loading) return null
  return user ? <Navigate to="/feed" replace /> : <PageSuspense><LandingPage /></PageSuspense>
}

function AppRoutes() {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<HomeRedirect />} />
        <Route path="/login" element={<PageSuspense><LandingPage /></PageSuspense>} />
        <Route path="/auth/callback" element={<PageSuspense><AuthCallbackPage /></PageSuspense>} />
        <Route path="/feed" element={
          <ProtectedRoute>
            <PageSuspense><FeedPage /></PageSuspense>
          </ProtectedRoute>
        } />
        <Route path="/users/:userID" element={
          <ProtectedRoute>
            <PageSuspense><UserProfilePage /></PageSuspense>
          </ProtectedRoute>
        } />
        <Route path="/search" element={
          <ProtectedRoute>
            <PageSuspense><SearchPage /></PageSuspense>
          </ProtectedRoute>
        } />
        <Route path="/trending" element={
          <ProtectedRoute>
            <PageSuspense><TrendingPage /></PageSuspense>
          </ProtectedRoute>
        } />
        <Route path="/notifications" element={
          <ProtectedRoute>
            <PageSuspense><NotificationsPage /></PageSuspense>
          </ProtectedRoute>
        } />
        <Route path="/leaderboard" element={
          <ProtectedRoute>
            <PageSuspense><LeaderboardPage /></PageSuspense>
          </ProtectedRoute>
        } />
        <Route path="/settings" element={
          <ProtectedRoute>
            <PageSuspense><SettingsPage /></PageSuspense>
          </ProtectedRoute>
        } />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AppShell>
  )
}

export default function App() {
  const [loaderDone, setLoaderDone] = useState(false)
  const [showOnboarding, setShowOnboarding] = useState(false)

  // Check if onboarding is needed after auth loads
  const handleLoaderDone = () => {
    setLoaderDone(true)
    const done = localStorage.getItem('onboardingDone')
    const token = localStorage.getItem('authToken')
    if (token && !done) {
      setShowOnboarding(true)
    }
  }

  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          {!loaderDone && <Loader onComplete={handleLoaderDone} />}
          {loaderDone && (
            <>
              <AppRoutes />
              {showOnboarding && (
                <OnboardingModal onComplete={() => {
                  setShowOnboarding(false)
                  localStorage.setItem('onboardingDone', 'true')
                }} />
              )}
              <Toaster
                position="bottom-right"
                toastOptions={{
                  className: 'toast-container',
                  style: {
                    background: 'var(--bg-card)',
                    color: 'var(--text-primary)',
                    border: '1px solid var(--border-light)',
                    borderRadius: 'var(--radius-md)',
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.875rem',
                    boxShadow: 'var(--shadow-lg)',
                    backdropFilter: 'blur(20px)',
                  },
                  success: { iconTheme: { primary: 'var(--accent-primary)', secondary: '#fff' } },
                  error: { iconTheme: { primary: 'var(--accent-rose)', secondary: '#fff' } },
                  duration: 3000,
                }}
              />
            </>
          )}
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  )
}
