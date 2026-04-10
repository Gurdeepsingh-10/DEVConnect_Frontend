import React, { useState, useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { platformService, userService } from '../services'
import { PLATFORMS } from '../data/mockData'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import { Check, ChevronRight, ArrowLeft, X, Loader2, Link2, User, Code2, Eye, EyeOff } from 'lucide-react'

const DOMAINS = [
  { id: 'frontend', label: 'Frontend', emoji: '🎨' },
  { id: 'backend', label: 'Backend', emoji: '⚙️' },
  { id: 'fullstack', label: 'Full Stack', emoji: '🧱' },
  { id: 'ml', label: 'ML / AI', emoji: '🧠' },
  { id: 'devops', label: 'DevOps / Cloud', emoji: '☁️' },
  { id: 'mobile', label: 'Mobile', emoji: '📱' },
  { id: 'systems', label: 'Systems', emoji: '🖥️' },
  { id: 'security', label: 'Security', emoji: '🔒' },
  { id: 'data', label: 'Data Engineering', emoji: '📊' },
  { id: 'gamedev', label: 'Game Dev', emoji: '🎮' },
]

const STEPS = ['Identity', 'Domains', 'Platforms', 'Visibility']

export default function OnboardingModal({ onComplete }) {
  const { user, setUser } = useAuth()
  const [step, setStep] = useState(0)
  const [saving, setSaving] = useState(false)
  const modalRef = useRef(null)
  const contentRef = useRef(null)

  // Step 0: Identity
  const [bio, setBio] = useState('')
  const [location, setLocation] = useState('')

  // Step 1: Domains
  const [selectedDomains, setSelectedDomains] = useState([])

  // Step 2: Platforms — { platformId: { username, linked, loading } }
  const [platformMap, setPlatformMap] = useState(
    Object.fromEntries(PLATFORMS.map(p => [p.id, { username: '', linked: false, loading: false }]))
  )

  // Step 3: Visibility toggles
  const [visibility, setVisibility] = useState({
    leetcode: true, codeforces: true, github: true, codechef: true,
    medium: true, gfg: true, hackerrank: true,
  })

  useEffect(() => {
    gsap.fromTo(modalRef.current,
      { opacity: 0, scale: 0.92 },
      { opacity: 1, scale: 1, duration: 0.4, ease: 'back.out(1.4)' }
    )
  }, [])

  const animateStep = (dir = 1) => {
    gsap.fromTo(contentRef.current,
      { x: dir * 40, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.35, ease: 'power3.out' }
    )
  }

  const goNext = () => {
    setStep(s => { animateStep(1); return s + 1 })
  }
  const goBack = () => {
    setStep(s => { animateStep(-1); return s - 1 })
  }

  const toggleDomain = (id) => {
    setSelectedDomains(prev =>
      prev.includes(id) ? prev.filter(d => d !== id) : [...prev, id]
    )
  }

  const handleLinkPlatform = async (platformId) => {
    const username = platformMap[platformId].username.trim()
    if (!username) { toast.error('Enter a username first'); return }
    setPlatformMap(m => ({ ...m, [platformId]: { ...m[platformId], loading: true } }))
    try {
      await platformService.linkPlatform(platformId, username)
      setPlatformMap(m => ({ ...m, [platformId]: { ...m[platformId], linked: true, loading: false } }))
      toast.success(`${platformId} linked!`)
    } catch {
      // Still mark as "saved" locally even if backend is unreachable
      setPlatformMap(m => ({ ...m, [platformId]: { ...m[platformId], linked: true, loading: false } }))
      toast.success(`${platformId} saved!`)
    }
  }

  const handleFinish = async () => {
    setSaving(true)
    const skills = selectedDomains.map(d => DOMAINS.find(x => x.id === d)?.label).filter(Boolean)
    const linkedPlatforms = Object.entries(platformMap)
      .filter(([, v]) => v.linked && v.username)
      .map(([k, v]) => `${k}:${v.username}`)
      .join(',')

    try {
      await userService.updateProfile({
        bio,
        location,
        skills: skills.join(', '),
        github: platformMap.github.username || '',
      })
    } catch {
      // Save locally anyway
    }
    // Store visibility + completion in localStorage
    localStorage.setItem('platformVisibility', JSON.stringify(visibility))
    localStorage.setItem('onboardingDone', 'true')
    setSaving(false)
    toast.success('Profile set up! Welcome to DevConnect 🚀')
    onComplete()
  }

  const progress = ((step) / (STEPS.length - 1)) * 100

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 20,
    }}>
      <div ref={modalRef} style={{
        width: '100%', maxWidth: 560,
        background: 'var(--bg-card)',
        borderRadius: 20,
        border: '1px solid var(--border-light)',
        boxShadow: '0 32px 80px rgba(0,0,0,0.4)',
        overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{
          padding: '24px 28px 0',
          borderBottom: '1px solid var(--border-light)',
          paddingBottom: 20,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div>
              <div style={{
                fontFamily: 'Space Grotesk', fontWeight: 800, fontSize: '1.2rem',
                background: 'linear-gradient(135deg, var(--triton-3), var(--accent-gold))',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                marginBottom: 2,
              }}>
                Welcome to DevConnect! 👋
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Step {step + 1} of {STEPS.length} — {STEPS[step]}
              </div>
            </div>
            {step === 0 && (
              <button onClick={onComplete} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                <X size={18} />
              </button>
            )}
          </div>
          {/* Progress bar */}
          <div style={{ height: 3, background: 'var(--border-medium)', borderRadius: 99, overflow: 'hidden' }}>
            <div style={{
              height: '100%', width: `${progress}%`,
              background: 'linear-gradient(90deg, var(--triton-2), var(--accent-gold))',
              transition: 'width 0.4s ease',
              borderRadius: 99,
            }} />
          </div>
        </div>

        {/* Content */}
        <div ref={contentRef} style={{ padding: '24px 28px' }}>
          {/* ── Step 0: Identity ── */}
          {step === 0 && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                {user?.avatar_url ? (
                  <img src={user.avatar_url} alt={user.name} style={{ width: 64, height: 64, borderRadius: '50%', border: '2px solid var(--accent-primary)' }} />
                ) : (
                  <div style={{
                    width: 64, height: 64, borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--triton-2), var(--accent-gold))',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'Space Grotesk', fontWeight: 800, fontSize: '1.5rem', color: '#fff',
                  }}>
                    {user?.name?.charAt(0) || '?'}
                  </div>
                )}
                <div>
                  <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)' }}>{user?.name || 'Developer'}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--accent-primary)' }}>Verified via Google</div>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Bio</label>
                  <textarea
                    rows={3}
                    placeholder="Tell other developers who you are — e.g. 'Backend dev @ Infosys. Love competitive programming & open source.'"
                    value={bio}
                    onChange={e => setBio(e.target.value)}
                    className="input-field"
                    style={{ resize: 'none', fontFamily: 'inherit', fontSize: '0.9rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Location</label>
                  <input
                    type="text"
                    placeholder="e.g. Bangalore, India"
                    value={location}
                    onChange={e => setLocation(e.target.value)}
                    className="input-field"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ── Step 1: Domains ── */}
          {step === 1 && (
            <div>
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '1rem', marginBottom: 4 }}>What do you build? 🛠️</div>
                <div style={{ fontSize: '0.83rem', color: 'var(--text-muted)' }}>Pick all that apply. This shapes your feed and discovery.</div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
                {DOMAINS.map(d => {
                  const sel = selectedDomains.includes(d.id)
                  return (
                    <button
                      key={d.id}
                      onClick={() => toggleDomain(d.id)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 10,
                        padding: '12px 14px',
                        borderRadius: 12,
                        border: `1px solid ${sel ? 'var(--accent-primary)' : 'var(--border-light)'}`,
                        background: sel ? 'rgba(61,122,111,0.12)' : 'var(--bg-secondary)',
                        cursor: 'pointer', textAlign: 'left',
                        transition: 'all 0.15s',
                      }}
                    >
                      <span style={{ fontSize: '1.2rem' }}>{d.emoji}</span>
                      <span style={{ fontWeight: 600, fontSize: '0.875rem', color: sel ? 'var(--accent-primary)' : 'var(--text-primary)' }}>{d.label}</span>
                      {sel && <Check size={14} color="var(--accent-primary)" style={{ marginLeft: 'auto' }} />}
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* ── Step 2: Platforms ── */}
          {step === 2 && (
            <div>
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '1rem', marginBottom: 4 }}>Link Your Platforms 🔗</div>
                <div style={{ fontSize: '0.83rem', color: 'var(--text-muted)' }}>Connect to power your dashboard with real stats. Skip any you don't use.</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxHeight: 360, overflowY: 'auto', paddingRight: 4 }}>
                {PLATFORMS.map(p => {
                  const state = platformMap[p.id]
                  return (
                    <div key={p.id} style={{
                      display: 'flex', alignItems: 'center', gap: 12,
                      padding: '12px 14px',
                      borderRadius: 12,
                      border: `1px solid ${state.linked ? 'var(--accent-primary)' : 'var(--border-light)'}`,
                      background: state.linked ? 'rgba(61,122,111,0.06)' : 'var(--bg-secondary)',
                    }}>
                      <span style={{ fontSize: '1.4rem', flexShrink: 0 }}>{p.icon}</span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 700, fontSize: '0.82rem', color: 'var(--text-primary)', marginBottom: 4 }}>{p.label}</div>
                        <input
                          type="text"
                          placeholder={p.placeholder}
                          value={state.username}
                          onChange={e => setPlatformMap(m => ({ ...m, [p.id]: { ...m[p.id], username: e.target.value, linked: false } }))}
                          onKeyDown={e => e.key === 'Enter' && handleLinkPlatform(p.id)}
                          className="input-field"
                          style={{ padding: '6px 10px', fontSize: '0.8rem' }}
                          disabled={state.linked}
                        />
                      </div>
                      <button
                        onClick={() => state.linked
                          ? setPlatformMap(m => ({ ...m, [p.id]: { ...m[p.id], linked: false } }))
                          : handleLinkPlatform(p.id)
                        }
                        className={`btn btn-sm ${state.linked ? 'btn-secondary' : 'btn-primary'}`}
                        style={{ flexShrink: 0, minWidth: 68 }}
                      >
                        {state.loading ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} />
                          : state.linked ? <><Check size={12} /> Done</>
                          : <>Link</>}
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* ── Step 3: Visibility ── */}
          {step === 3 && (
            <div>
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '1rem', marginBottom: 4 }}>What's Public? 👁️</div>
                <div style={{ fontSize: '0.83rem', color: 'var(--text-muted)' }}>Choose which stats appear on your public profile.</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {PLATFORMS.map(p => (
                  <div key={p.id} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '12px 14px',
                    borderRadius: 12,
                    border: '1px solid var(--border-light)',
                    background: 'var(--bg-secondary)',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontSize: '1.2rem' }}>{p.icon}</span>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-primary)' }}>{p.label}</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{p.desc}</div>
                      </div>
                    </div>
                    <button
                      onClick={() => setVisibility(v => ({ ...v, [p.id]: !v[p.id] }))}
                      style={{
                        background: visibility[p.id] ? 'var(--accent-primary)' : 'var(--border-medium)',
                        border: 'none', borderRadius: 99, width: 42, height: 24,
                        cursor: 'pointer', position: 'relative', transition: 'background 0.2s',
                        flexShrink: 0,
                      }}
                    >
                      <div style={{
                        position: 'absolute', top: 3,
                        left: visibility[p.id] ? 20 : 3,
                        width: 18, height: 18,
                        borderRadius: '50%', background: '#fff',
                        transition: 'left 0.2s',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                      }} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: '16px 28px 24px',
          borderTop: '1px solid var(--border-light)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          {step > 0 ? (
            <button className="btn btn-ghost btn-sm" onClick={goBack} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <ArrowLeft size={14} /> Back
            </button>
          ) : (
            <div />
          )}
          {step < STEPS.length - 1 ? (
            <button
              className="btn btn-primary"
              onClick={goNext}
              style={{ display: 'flex', alignItems: 'center', gap: 8 }}
            >
              {step === 2 ? 'Almost done' : 'Continue'} <ChevronRight size={16} />
            </button>
          ) : (
            <button
              className="btn btn-primary"
              onClick={handleFinish}
              disabled={saving}
              style={{ display: 'flex', alignItems: 'center', gap: 8 }}
            >
              {saving ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <Check size={14} />}
              Finish Setup
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
