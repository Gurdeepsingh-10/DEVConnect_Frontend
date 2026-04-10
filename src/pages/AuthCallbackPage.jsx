import React, { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import { gsap } from 'gsap'

/**
 * AuthCallbackPage
 * 
 * The backend redirects here after Google OAuth:
 *   /auth/callback?token=JWT&userId=XXX&name=YYY&success=true
 * 
 * This page reads those params, stores the token, and redirects to /feed.
 */
export default function AuthCallbackPage() {
  const { loginWithToken } = useAuth()
  const navigate = useNavigate()
  const logoRef = useRef(null)
  const hasRun = useRef(false)

  useEffect(() => {
    if (hasRun.current) return
    hasRun.current = true

    // Animate in
    gsap.fromTo(logoRef.current,
      { scale: 0.7, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.6, ease: 'back.out(1.7)' }
    )

    const params = new URLSearchParams(window.location.search)
    const token = params.get('token')
    const userId = params.get('userId')
    const name = params.get('name')
    const success = params.get('success')

    if (success === 'true' && token && userId) {
      const userInfo = {
        id: userId,
        name: decodeURIComponent(name || ''),
        avatar_url: null,
      }

      loginWithToken(token, userInfo)

      // If first time user (no onboarding done), mark as needing it
      const onboardingDone = localStorage.getItem('onboardingDone')
      if (!onboardingDone) {
        // App.jsx will show OnboardingModal because token exists but onboardingDone doesn't
        localStorage.removeItem('onboardingDone')
      }

      toast.success(`Welcome, ${userInfo.name.split(' ')[0]}! 🚀`, { duration: 3000 })
      setTimeout(() => navigate('/feed', { replace: true }), 1200)
    } else {
      toast.error('Login failed. Please try again.')
      setTimeout(() => navigate('/', { replace: true }), 2000)
    }
  }, [loginWithToken, navigate])

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      gap: 24,
      background: 'var(--bg-primary)',
    }}>
      <div ref={logoRef} style={{ textAlign: 'center' }}>
        {/* DC Logo */}
        <div style={{
          fontFamily: 'Space Grotesk, sans-serif',
          fontWeight: 800,
          fontSize: '5rem',
          letterSpacing: '-0.05em',
          background: 'linear-gradient(135deg, var(--triton-3) 0%, var(--accent-gold) 60%, var(--accent-warm) 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          lineHeight: 1,
          marginBottom: 16,
        }}>
          dc
        </div>

        {/* Spinner */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          <div className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} />
          <span>Completing sign-in…</span>
        </div>
      </div>
    </div>
  )
}
