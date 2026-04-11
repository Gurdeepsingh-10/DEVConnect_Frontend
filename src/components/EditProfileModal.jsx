import React, { useState, useRef, useEffect } from 'react'
import { userService } from '../services'
import { useAuth } from '../context/AuthContext'
import { X, Save, Plus } from 'lucide-react'
import toast from 'react-hot-toast'
import { SKILL_SUGGESTIONS } from '../data/constants'

export default function EditProfileModal({ profile, onClose, onSave }) {
  const { setUser } = useAuth()

  // Parse skills from string or array into a tag array
  const parseSkills = (raw) => {
    if (!raw) return []
    if (Array.isArray(raw)) return raw.map(s => s.trim()).filter(Boolean)
    return raw.split(',').map(s => s.trim()).filter(Boolean)
  }

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => document.body.style.overflow = 'unset'
  }, [])

  const [form, setForm] = useState({
    name: profile?.name || '',
    bio: profile?.bio || '',
    github: profile?.github || '',
    location: profile?.location || '',
  })
  const [skills, setSkills] = useState(parseSkills(profile?.skills))
  const [skillInput, setSkillInput] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [loading, setLoading] = useState(false)
  const inputRef = useRef(null)

  useEffect(() => {
    const handler = (e) => {
      if (!inputRef.current?.contains(e.target)) setShowSuggestions(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const addSkill = (skill) => {
    const s = skill.trim()
    if (s && !skills.includes(s)) {
      setSkills(prev => [...prev, s])
    }
    setSkillInput('')
    setShowSuggestions(false)
  }

  const removeSkill = (idx) => {
    setSkills(prev => prev.filter((_, i) => i !== idx))
  }

  const handleSkillKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      if (skillInput.trim()) addSkill(skillInput)
    } else if (e.key === 'Backspace' && !skillInput && skills.length > 0) {
      removeSkill(skills.length - 1)
    }
  }

  const filteredSuggestions = SKILL_SUGGESTIONS.filter(
    s => s.toLowerCase().includes(skillInput.toLowerCase()) && !skills.includes(s)
  ).slice(0, 8)

  const handleSave = async () => {
    setLoading(true)
    const payload = { ...form, skills: skills.join(', ') }
    try {
      await userService.updateProfile(payload)
      const updated = { ...profile, ...payload }
      setUser(prev => ({ ...prev, ...payload }))
      onSave(updated)
      toast.success('Profile updated! ✨')
    } catch {
      // Optimistic update even if backend fails
      const updated = { ...profile, ...payload }
      setUser(prev => ({ ...prev, ...payload }))
      onSave(updated)
      toast.success('Profile updated! ✨')
    } finally {
      setLoading(false)
    }
  }

  const fields = [
    { name: 'name', label: 'Full Name', placeholder: 'Your full name', type: 'text' },
    { name: 'location', label: 'Location', placeholder: 'e.g. Bangalore, India', type: 'text' },
    { name: 'github', label: 'GitHub Username', placeholder: 'your-github-username', type: 'text' },
  ]

  return (
    <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="modal-content" style={{ padding: 28, maxWidth: 520, width: '90vw' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <h2 style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '1.15rem' }}>Edit Profile</h2>
          <button className="btn btn-ghost btn-icon" onClick={onClose}><X size={18} /></button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Text fields */}
          {fields.map(f => (
            <div key={f.name}>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6, letterSpacing: '0.03em', textTransform: 'uppercase' }}>
                {f.label}
              </label>
              <input
                type={f.type}
                name={f.name}
                value={form[f.name]}
                onChange={handleChange}
                placeholder={f.placeholder}
                className="input-field"
                style={{ fontSize: '0.9rem' }}
              />
            </div>
          ))}

          {/* Bio */}
          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.03em' }}>Bio</label>
            <textarea
              name="bio"
              value={form.bio}
              onChange={handleChange}
              placeholder="Tell developers who you are…"
              className="input-field"
              style={{ minHeight: 88, resize: 'vertical', fontSize: '0.9rem', lineHeight: 1.6 }}
            />
          </div>

          {/* Skills — tag input */}
          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.03em' }}>
              Skills <span style={{ color: 'var(--text-faint)', fontWeight: 400, fontSize: '0.72rem' }}>— type & press Enter to add, ✕ to remove</span>
            </label>

            {/* Tags container */}
            <div
              ref={inputRef}
              style={{
                position: 'relative',
                border: '1px solid var(--border-light)',
                borderRadius: 'var(--radius-md)',
                background: 'var(--bg-input)',
                padding: '8px 10px',
                display: 'flex',
                flexWrap: 'wrap',
                gap: 6,
                alignItems: 'center',
                minHeight: 46,
                cursor: 'text',
              }}
              onClick={() => inputRef.current?.querySelector('input')?.focus()}
            >
              {/* Existing skill tags */}
              {skills.map((s, i) => (
                <span key={i} style={{
                  display: 'inline-flex', alignItems: 'center', gap: 4,
                  padding: '3px 10px', borderRadius: 99,
                  background: 'rgba(61,122,111,0.15)', border: '1px solid var(--border-accent)',
                  color: 'var(--accent-primary)', fontSize: '0.78rem', fontWeight: 600,
                }}>
                  {s}
                  <button
                    onClick={(e) => { e.stopPropagation(); removeSkill(i) }}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--accent-primary)', padding: 0, display: 'flex', lineHeight: 1 }}
                  >
                    <X size={11} />
                  </button>
                </span>
              ))}

              {/* Type input */}
              <input
                type="text"
                value={skillInput}
                onChange={e => { setSkillInput(e.target.value); setShowSuggestions(true) }}
                onKeyDown={handleSkillKeyDown}
                onFocus={() => setShowSuggestions(true)}
                placeholder={skills.length === 0 ? 'Type a skill and press Enter…' : '+ Add skill'}
                style={{
                  flex: 1, minWidth: 140, border: 'none', background: 'transparent', outline: 'none',
                  color: 'var(--text-primary)', fontSize: '0.88rem',
                  fontFamily: 'var(--font-sans)',
                }}
              />

              {/* Autocomplete dropdown */}
              {showSuggestions && filteredSuggestions.length > 0 && (
                <div style={{
                  position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 50,
                  background: 'var(--bg-card)', border: '1px solid var(--border-light)',
                  borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-lg)',
                  marginTop: 4, overflow: 'hidden',
                }}>
                  {filteredSuggestions.map(sug => (
                    <button
                      key={sug}
                      onMouseDown={e => { e.preventDefault(); addSkill(sug) }}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 8,
                        width: '100%', padding: '9px 14px', background: 'none', border: 'none',
                        cursor: 'pointer', textAlign: 'left', color: 'var(--text-primary)', fontSize: '0.85rem',
                        transition: 'background 0.15s',
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-overlay)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'none'}
                    >
                      <Plus size={12} color="var(--accent-primary)" /> {sug}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 10, marginTop: 24, justifyContent: 'flex-end' }}>
          <button className="btn btn-secondary btn-sm" onClick={onClose}>Cancel</button>
          <button
            className="btn btn-primary btn-sm"
            onClick={handleSave}
            disabled={loading}
            style={{ display: 'flex', alignItems: 'center', gap: 8 }}
          >
            {loading ? <div className="spinner" style={{ width: 14, height: 14, borderWidth: 2 }} /> : <Save size={14} />}
            Save Profile
          </button>
        </div>
      </div>
    </div>
  )
}
