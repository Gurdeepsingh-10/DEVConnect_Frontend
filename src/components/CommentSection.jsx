import React, { useState, useEffect } from 'react'
import { commentService } from '../services'
import { useAuth } from '../context/AuthContext'
import { formatRelativeTime, getInitials } from '../utils'
import { Trash2, Send } from 'lucide-react'
import toast from 'react-hot-toast'
import { MOCK_POSTS } from '../data/mockData'

export default function CommentSection({ postId }) {
  const { user } = useAuth()
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [text, setText] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchComments()
  }, [postId])

  const fetchComments = async () => {
    setLoading(true)
    try {
      const { data } = await commentService.getComments(postId)
      setComments(Array.isArray(data) ? data : [])
    } catch {
      // Use mock data
      setComments([
        { id: 1, user_id: 'u1', user: { name: 'Priya Nair', initials: 'PN' }, content: 'Great insight! I had the same experience with rolling array DP.', created_at: new Date(Date.now() - 3600000).toISOString() },
        { id: 2, user_id: 'u2', user: { name: 'Arjun Sharma', initials: 'AS' }, content: 'This is exactly what I needed today 🔥', created_at: new Date(Date.now() - 7200000).toISOString() },
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!text.trim() || submitting) return
    setSubmitting(true)
    const optimistic = {
      id: Date.now(), user_id: user?.id,
      user: { name: user?.name || 'You', initials: getInitials(user?.name || 'You') },
      content: text.trim(),
      created_at: new Date().toISOString(),
    }
    setComments(c => [optimistic, ...c])
    setText('')
    try {
      await commentService.addComment(postId, text.trim())
      toast.success('Comment added!')
    } catch {
      // keep optimistic
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (commentId) => {
    setComments(c => c.filter(x => x.id !== commentId))
    try {
      await commentService.deleteComment(commentId)
    } catch { /* ignore */ }
  }

  if (loading) return (
    <div style={{ display: 'flex', gap: 8, padding: '8px 0' }}>
      {[1,2].map(i => <div key={i} className="skeleton" style={{ height: 50, flex: 1, borderRadius: 8 }} />)}
    </div>
  )

  return (
    <div>
      {/* Add comment form */}
      {user && (
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 10, marginBottom: 16, alignItems: 'flex-end' }}>
          <div className="avatar-placeholder" style={{ width: 32, height: 32, borderRadius: '50%', fontSize: '0.7rem', flexShrink: 0 }}>
            {getInitials(user.name || 'U')}
          </div>
          <div style={{ flex: 1, position: 'relative' }}>
            <input
              type="text"
              placeholder="Add a comment…"
              value={text}
              onChange={e => setText(e.target.value)}
              className="input-field"
              style={{ paddingRight: 44, fontSize: '0.85rem', padding: '9px 44px 9px 14px' }}
              maxLength={500}
            />
            <button
              type="submit"
              disabled={!text.trim() || submitting}
              style={{
                position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)',
                background: 'none', border: 'none', cursor: 'pointer', padding: 4,
                color: text.trim() ? 'var(--accent-primary)' : 'var(--text-faint)',
                transition: 'color var(--duration-fast)',
              }}
            >
              <Send size={16} />
            </button>
          </div>
        </form>
      )}

      {/* Comments list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {comments.length === 0 && (
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', textAlign: 'center', padding: '12px 0' }}>
            No comments yet. Be the first!
          </p>
        )}
        {comments.map(c => (
          <div key={c.id} style={{ display: 'flex', gap: 10 }}>
            <div className="avatar-placeholder" style={{ width: 30, height: 30, borderRadius: '50%', fontSize: '0.65rem', flexShrink: 0 }}>
              {c.user?.initials || getInitials(c.user?.name || '?')}
            </div>
            <div style={{
              flex: 1,
              background: 'var(--bg-overlay)',
              borderRadius: 'var(--radius-md)',
              padding: '9px 12px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontWeight: 600, fontSize: '0.82rem', color: 'var(--text-primary)' }}>
                  {c.user?.name || 'Unknown'}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-faint)' }}>
                    {formatRelativeTime(c.created_at)}
                  </span>
                  {user?.id === c.user_id && (
                    <button
                      onClick={() => handleDelete(c.id)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-faint)', padding: 2 }}
                    >
                      <Trash2 size={13} />
                    </button>
                  )}
                </div>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                {c.content}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
