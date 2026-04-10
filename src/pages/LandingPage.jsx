import React, { useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  Code2, Users, TrendingUp, Bell, Star, GitBranch, Trophy,
  ChevronDown, ArrowRight, Zap, Globe, BarChart3, Layers
} from 'lucide-react'
import { authService } from '../services'

gsap.registerPlugin(ScrollTrigger)

const FEATURES = [
  { icon: Users, title: 'Social Feed', desc: 'Share posts, like, comment — a LinkedIn-level professional feed for dev culture.' },
  { icon: BarChart3, title: 'Coding Stats', desc: 'LeetCode, CodeChef, Codeforces, and GitHub — all aggregated in one sleek profile.' },
  { icon: Trophy, title: 'Leaderboards', desc: 'Compete globally or within your circle. Rankings, charts, tables, live stats.' },
  { icon: GitBranch, title: 'GitHub Insights', desc: 'Contribution graph, pinned repos, top languages — your OSS story visualized.' },
  { icon: Bell, title: 'Notifications', desc: 'Likes, follows, comments — instant feedback on your activity.' },
  { icon: Globe, title: 'Skill Search', desc: 'Find developers by technology. Build your network by expertise.' },
]

const STATS = [
  { value: '12K+', label: 'Developers' },
  { value: '3.2M', label: 'Commits tracked' },
  { value: '480K', label: 'Problems solved' },
  { value: '96%', label: 'Satisfaction' },
]

export default function LandingPage() {
  const heroRef = useRef(null)
  const taglineRef = useRef(null)
  const ctaRef = useRef(null)
  const featuresRef = useRef(null)
  const statsRef = useRef(null)
  const scrollIndicatorRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero entrance
      gsap.timeline()
        .fromTo('.hero-eyebrow',
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }
        )
        .fromTo('.hero-title .word',
          { y: 80, opacity: 0, rotateX: -60 },
          { y: 0, opacity: 1, rotateX: 0, duration: 1, stagger: 0.12, ease: 'power4.out' },
          '-=0.4'
        )
        .fromTo('.hero-subtitle',
          { y: 24, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out' },
          '-=0.5'
        )
        .fromTo('.hero-ctas',
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' },
          '-=0.4'
        )
        .fromTo('.hero-mockup',
          { y: 50, opacity: 0, scale: 0.94 },
          { y: 0, opacity: 1, scale: 1, duration: 1.0, ease: 'power3.out' },
          '-=0.5'
        )

      // Scroll indicator bob
      gsap.to(scrollIndicatorRef.current, {
        y: 10, repeat: -1, yoyo: true, duration: 1.2, ease: 'sine.inOut'
      })

      // Features scroll reveal
      gsap.fromTo('.feature-card',
        { y: 60, opacity: 0 },
        {
          y: 0, opacity: 1, stagger: 0.08, duration: 0.7, ease: 'power3.out',
          scrollTrigger: { trigger: featuresRef.current, start: 'top 80%' }
        }
      )

      // Stats count-up reveal
      gsap.fromTo('.stat-item',
        { y: 40, opacity: 0 },
        {
          y: 0, opacity: 1, stagger: 0.1, duration: 0.6, ease: 'power3.out',
          scrollTrigger: { trigger: statsRef.current, start: 'top 85%' }
        }
      )

      // Parallax on hero bg orbs
      gsap.to('.hero-orb-1', {
        yPercent: -30,
        scrollTrigger: { trigger: heroRef.current, start: 'top top', end: 'bottom top', scrub: 2 }
      })
      gsap.to('.hero-orb-2', {
        yPercent: -15,
        scrollTrigger: { trigger: heroRef.current, start: 'top top', end: 'bottom top', scrub: 1.5 }
      })

    }, heroRef)

    return () => ctx.revert()
  }, [])

  const handleGoogleLogin = () => {
    window.location.href = authService.getGoogleLoginUrl()
  }

  return (
    <div style={{ minHeight: '100vh', overflowX: 'hidden' }}>
      {/* ── HERO / LOGIN SECTION ── */}
      <section ref={heroRef} style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '80px 24px 60px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Ambient background orbs */}
        <div className="hero-orb-1" style={{
          position: 'absolute', top: '-15%', right: '-5%',
          width: 700, height: 700, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(61,122,111,0.14) 0%, transparent 65%)',
          pointerEvents: 'none',
        }} />
        <div className="hero-orb-2" style={{
          position: 'absolute', bottom: '-10%', left: '-8%',
          width: 600, height: 600, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(200,168,106,0.10) 0%, transparent 65%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', top: '45%', left: '45%',
          width: 400, height: 400, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(44,62,80,0.06) 0%, transparent 70%)',
          transform: 'translate(-50%,-50%)',
          pointerEvents: 'none',
        }} />

        {/* Eyebrow */}
        <div className="hero-eyebrow" style={{ marginBottom: 24, display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className="badge badge-teal">
            <Zap size={10} style={{ marginRight: 4 }} /> Now in Beta
          </span>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>
            The dev network built by developers
          </span>
        </div>

        {/* Title */}
        <h1 className="hero-title" style={{
          textAlign: 'center',
          fontSize: 'clamp(2.8rem, 7vw, 6.5rem)',
          fontFamily: 'Space Grotesk, sans-serif',
          fontWeight: 800,
          lineHeight: 1.05,
          letterSpacing: '-0.03em',
          maxWidth: 900,
          marginBottom: 28,
          perspective: '600px',
        }}>
          {['Where', 'developers', 'ship,', 'connect', '&', 'compete.'].map((w, i) => (
            <span key={i} className="word" style={{
              display: 'inline-block',
              marginRight: '0.28em',
              color: i === 3 ? 'var(--accent-primary)' : i === 5 ? 'var(--accent-gold)' : 'var(--text-primary)',
            }}>
              {w}
            </span>
          ))}
        </h1>

        {/* Subtitle */}
        <p className="hero-subtitle" style={{
          textAlign: 'center',
          fontSize: 'clamp(1rem, 2vw, 1.2rem)',
          color: 'var(--text-secondary)',
          maxWidth: 600,
          lineHeight: 1.7,
          marginBottom: 44,
        }}>
          Track your LeetCode progress. Showcase your GitHub contributions. Compete on leaderboards. 
          Share what you're building. All in one professional platform.
        </p>

        {/* CTAs */}
        <div className="hero-ctas" style={{ display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 64 }}>
          <button className="btn btn-primary btn-xl" onClick={handleGoogleLogin} style={{ gap: 12 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>
          <button className="btn btn-secondary btn-xl" onClick={() => navigate('/feed')}>
            Explore Demo <ArrowRight size={18} />
          </button>
        </div>

        {/* Mock UI card preview */}
        <div className="hero-mockup" style={{
          width: '100%', maxWidth: 860,
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: 16,
        }}>
          {[
            { label: 'LeetCode Solved', value: '487', icon: Code2, color: 'var(--accent-gold)' },
            { label: 'GitHub Stars', value: '1.2K', icon: Star, color: 'var(--triton-3)' },
            { label: 'Global Rank', value: '#342', icon: Trophy, color: 'var(--accent-warm)' },
          ].map((s, i) => (
            <div key={i} className="glass-card" style={{ padding: '20px 24px', textAlign: 'center' }}>
              <s.icon size={24} style={{ color: s.color, marginBottom: 10, margin: '0 auto 10px' }} />
              <div style={{ fontFamily: 'Space Grotesk', fontWeight: 800, fontSize: '2rem', color: 'var(--text-primary)', lineHeight: 1 }}>
                {s.value}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 6, letterSpacing: '0.04em' }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* Scroll indicator */}
        <div ref={scrollIndicatorRef} style={{
          position: 'absolute', bottom: 36, left: '50%', transform: 'translateX(-50%)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
          color: 'var(--text-faint)', cursor: 'pointer',
        }} onClick={() => featuresRef.current?.scrollIntoView({ behavior: 'smooth' })}>
          <span style={{ fontSize: '0.68rem', letterSpacing: '0.14em', textTransform: 'uppercase' }}>Scroll</span>
          <ChevronDown size={18} />
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <section ref={statsRef} style={{
        padding: '56px 24px',
        borderTop: '1px solid var(--border-light)',
        borderBottom: '1px solid var(--border-light)',
        background: 'var(--bg-secondary)',
      }}>
        <div style={{ maxWidth: 860, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 24 }}>
          {STATS.map((s, i) => (
            <div key={i} className="stat-item" style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'Space Grotesk', fontWeight: 800, fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', color: 'var(--accent-primary)', letterSpacing: '-0.03em' }}>
                {s.value}
              </div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section ref={featuresRef} style={{ padding: '96px 24px', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <span className="section-label" style={{ display: 'block', marginBottom: 12 }}>Platform Features</span>
          <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontFamily: 'Space Grotesk', fontWeight: 700, letterSpacing: '-0.02em' }}>
            Everything a developer needs,
            <br /><span className="gradient-text">in one place.</span>
          </h2>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 20,
        }}>
          {FEATURES.map((f, i) => (
            <div key={i} className="feature-card glass-card" style={{ padding: '28px 24px' }}>
              <div style={{
                width: 44, height: 44, borderRadius: 12,
                background: 'rgba(61,122,111,0.12)',
                border: '1px solid var(--border-accent)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: 16,
              }}>
                <f.icon size={20} color="var(--accent-primary)" />
              </div>
              <h3 style={{ fontFamily: 'Space Grotesk', fontSize: '1.05rem', fontWeight: 700, marginBottom: 10, color: 'var(--text-primary)' }}>
                {f.title}
              </h3>
              <p style={{ fontSize: '0.88rem', lineHeight: 1.7, color: 'var(--text-secondary)' }}>
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section style={{ padding: '80px 24px', background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-light)' }}>
        <div style={{ maxWidth: 860, margin: '0 auto', textAlign: 'center' }}>
          <span className="section-label" style={{ display: 'block', marginBottom: 12 }}>How it works</span>
          <h2 style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.6rem)', fontFamily: 'Space Grotesk', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 52 }}>
            Get started in <span className="gradient-text">3 steps</span>
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 32 }}>
            {[
              { step: '01', title: 'Sign in with Google', desc: 'One click — no password, no forms. Your Google account is all you need.' },
              { step: '02', title: 'Connect your profiles', desc: 'Link your GitHub, LeetCode, CodeChef and Codeforces to auto-populate your stats.' },
              { step: '03', title: 'Start connecting', desc: 'Post updates, follow devs, compete on leaderboards, and build your technical brand.' },
            ].map((s, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{
                  fontFamily: 'JetBrains Mono', fontWeight: 700, fontSize: '0.7rem',
                  color: 'var(--accent-primary)', letterSpacing: '0.1em', marginBottom: 12,
                }}>
                  {s.step}
                </div>
                <h3 style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '1.05rem', marginBottom: 10 }}>{s.title}</h3>
                <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BOTTOM ── */}
      <section style={{ padding: '100px 24px', textAlign: 'center' }}>
        <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontFamily: 'Space Grotesk', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 20 }}>
          Ready to level up your<br /><span className="gradient-text">dev profile?</span>
        </h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 36, fontSize: '1.05rem' }}>
          Join 12,000+ developers already on DevConnect.
        </p>
        <button className="btn btn-primary btn-xl" onClick={handleGoogleLogin} style={{ gap: 12, margin: '0 auto' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.47 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Get started free
        </button>
      </section>
    </div>
  )
}
