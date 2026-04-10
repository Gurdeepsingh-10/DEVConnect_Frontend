import React, { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'

export default function Loader({ onComplete }) {
  const loaderRef = useRef(null)
  const textRef = useRef(null)
  const dcRef = useRef(null)
  const barRef = useRef(null)
  const [phase, setPhase] = useState('devconnect')

  useEffect(() => {
    let completed = false
    const handleComplete = () => {
      if (completed) return
      completed = true
      onComplete()
    }

    const tl = gsap.timeline()
    const el = textRef.current
    const dc = dcRef.current
    const bar = barRef.current

    if (el && dc && bar) {
      // Phase 1: DevConnect letters stagger in
      tl.fromTo(el.querySelectorAll('.letter'),
        { y: 60, opacity: 0, rotateX: -90 },
        {
          y: 0, opacity: 1, rotateX: 0,
          duration: 0.9, stagger: 0.05,
          ease: 'power4.out',
        }
      )
      // progress bar grows
      .fromTo(bar, { scaleX: 0 }, { scaleX: 1, duration: 1.4, ease: 'power2.out' }, '<0.3')
      // hold
      .addPause('+=0.3')
      // Phase 2: DevConnect shrinks / fades, DC appears
      .to(el, { opacity: 0, scale: 0.6, duration: 0.45, ease: 'power3.in' })
      .fromTo(dc,
        { scale: 2.4, opacity: 0, filter: 'blur(20px)' },
        { scale: 1, opacity: 1, filter: 'blur(0px)', duration: 0.7, ease: 'expo.out' }
      )
      // DC golden glow pulse
      .to(dc, { textShadow: '0 0 40px rgba(200,168,106,0.8)', duration: 0.35, yoyo: true, repeat: 1, ease: 'sine.inOut' })
      // Phase 3: exit — loader slides up
      .to(loaderRef.current, {
        yPercent: -100,
        duration: 0.9,
        ease: 'power4.inOut',
        delay: 0.25,
        onComplete: handleComplete,
      })
    }

    // Failsafe: auto-skip after 4.5s no matter what
    const timer = setTimeout(handleComplete, 4500)

    return () => {
      tl.kill()
      clearTimeout(timer)
    }
  }, [onComplete])

  const word = 'DevConnect'

  return (
    <div 
      ref={loaderRef} 
      className="loader-overlay" 
      style={{ perspective: '800px', cursor: 'pointer' }}
      onClick={() => onComplete()}
      title="Click to skip"
    >
      {/* Ambient glow orbs */}
      <div style={{
        position: 'absolute', width: 500, height: 500,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(61,122,111,0.18) 0%, transparent 70%)',
        top: '20%', left: '30%', transform: 'translate(-50%,-50%)',
        pointerEvents: 'none',
        animation: 'float 5s ease-in-out infinite',
      }} />
      <div style={{
        position: 'absolute', width: 350, height: 350,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(200,168,106,0.12) 0%, transparent 70%)',
        bottom: '20%', right: '25%',
        pointerEvents: 'none',
        animation: 'float 6s ease-in-out infinite reverse',
      }} />

      {/* DevConnect word */}
      <div ref={textRef} style={{
        position: 'absolute',
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        fontFamily: 'Space Grotesk, sans-serif',
        fontWeight: 700,
        fontSize: 'clamp(2.5rem, 7vw, 5.5rem)',
        letterSpacing: '-0.03em',
        color: 'var(--text-primary)',
        transformStyle: 'preserve-3d',
      }}>
        {word.split('').map((ch, i) => (
          <span key={i} className="letter" style={{
            display: 'inline-block',
            color: i < 3 ? 'var(--accent-primary)' : 'var(--text-primary)',
          }}>
            {ch}
          </span>
        ))}
      </div>

      {/* DC monogram (hidden initially) */}
      <div ref={dcRef} style={{
        position: 'absolute',
        fontFamily: 'Space Grotesk, sans-serif',
        fontWeight: 800,
        fontSize: 'clamp(4rem, 14vw, 10rem)',
        letterSpacing: '-0.05em',
        opacity: 0,
        background: 'linear-gradient(135deg, var(--triton-3) 0%, var(--accent-gold) 60%, var(--accent-warm) 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        userSelect: 'none',
      }}>
        dc
      </div>

      {/* Progress bar */}
      <div style={{
        position: 'absolute', bottom: '18%', left: '50%', transform: 'translateX(-50%)',
        width: 'min(280px, 60vw)', height: 2,
        background: 'var(--border-medium)',
        borderRadius: 999,
        overflow: 'hidden',
      }}>
        <div ref={barRef} style={{
          width: '100%', height: '100%',
          background: 'linear-gradient(90deg, var(--triton-2), var(--accent-gold))',
          transformOrigin: 'left center',
          transform: 'scaleX(0)',
        }} />
      </div>

      {/* Tagline */}
      <p style={{
        position: 'absolute', bottom: 'calc(18% - 28px)',
        left: '50%', transform: 'translateX(-50%)',
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: '0.7rem',
        letterSpacing: '0.18em',
        color: 'var(--text-muted)',
        textTransform: 'uppercase',
        whiteSpace: 'nowrap',
      }}>
        Where Developers Connect
      </p>
    </div>
  )
}
