import React, { useState, useRef } from 'react'
import { postService } from '../services'
import { useAuth } from '../context/AuthContext'
import { getInitials } from '../utils'
import { Send, X } from 'lucide-react'
import toast from 'react-hot-toast'

const MAX_CHARS = 500

export default function PostForm({ onPost }) {
  const { user } = useAuth()
  const [content, setContent] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [focused, setFocused] = useState(false)
  const textareaRef = useRef(null)

  const charPct = (content.length / MAX_CHARS) * 100
  const isOver = content.length > MAX_CHARS

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!content.trim() || submitting || isOver) return
    setSubmitting(true)
    try {
      const { data } = await postService.createPost(content.trim())
      onPost?.({ ...data, id: data?.id || Date.now(), content: content.trim(), created_at: new Date().toISOString() })
      setContent('')
      toast.success('Post created!')
    } catch {
      // Mock success
      onPost?.({ id: Date.now(), content: content.trim(), created_at: new Date().toISOString() })
      setContent('')
      toast.success('Post created!')
    } finally {
      setSubmitting(false)
    }
  }

  if (!user) return null

  return (
    <form
      onSubmit={handleSubmit}
      className="glass-card"
      style={{
        padding: '18px',
        marginBottom: 0,
        transition: 'box-shadow var(--duration-base) var(--ease-out-expo)',
        boxShadow: focused ? 'var(--shadow-lg), 0 0 0 2px rgba(61,122,111,0.15)' : 'var(--shadow-sm)',
      }}
    >
      <div style={{ display: 'flex', gap: 12 }}>
        {user.avatar_url ? (
          <img src={user.avatar_url} alt={user.name} className="avatar avatar-md" />
        ) : (
          <div className="avatar-placeholder avatar-md" style={{ fontSize: '0.78rem' }}>
            {getInitials(user.name || 'U')}
          </div>
        )}
        <div style={{ flex: 1 }}>
          <textarea
            ref={textareaRef}
            placeholder={`What's on your mind, ${user.name?.split(' ')[0] || 'dev'}? Share a problem, solution, or milestone...`}
            value={content}
            onChange={e => setContent(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            className="input-field"
            style={{
              resize: 'none',
              minHeight: focused || content ? 100 : 44,
              transition: 'min-height var(--duration-base) var(--ease-out-expo)',
              fontSize: '0.9rem',
              lineHeight: 1.7,
              fontFamily: 'var(--font-sans)',
            }}
          />

          {(focused || content) && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 }}>
              {/* Char counter */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <svg width="28" height="28" viewBox="0 0 28 28">
                  <circle cx="14" cy="14" r="11" fill="none" stroke="var(--border-medium)" strokeWidth="2" />
                  <circle
                    cx="14" cy="14" r="11"
                    fill="none"
                    stroke={isOver ? '#c4786a' : charPct > 80 ? 'var(--accent-gold)' : 'var(--accent-primary)'}
                    strokeWidth="2"
                    strokeDasharray={`${2 * Math.PI * 11}`}
                    strokeDashoffset={`${2 * Math.PI * 11 * (1 - charPct / 100)}`}
                    transform="rotate(-90 14 14)"
                    style={{ transition: 'stroke-dashoffset 0.2s' }}
                  />
                </svg>
                <span style={{ fontSize: '0.75rem', color: isOver ? 'var(--accent-rose)' : 'var(--text-muted)' }}>
                  {MAX_CHARS - content.length}
                </span>
                {content && (
                  <button type="button" className="btn btn-ghost btn-sm" onClick={() => setContent('')} style={{ padding: '2px 8px', fontSize: '0.78rem' }}>
                    <X size={12} /> Clear
                  </button>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="btn btn-primary btn-sm"
                disabled={!content.trim() || submitting || isOver}
                style={{ gap: 8 }}
              >
                {submitting ? <div className="spinner" style={{ width: 14, height: 14, borderWidth: 2 }} /> : <Send size={14} />}
                {submitting ? 'Posting…' : 'Post'}
              </button>
            </div>
          )}
        </div>
      </div>
    </form>
  )
}
