import React, { useState, useEffect } from 'react'
import { sessionService } from '../services'
import { MOCK_LIVE_SESSIONS } from '../data/mockData'
import { formatRelativeTime } from '../utils'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import { Radio, Plus, X, Loader2, ExternalLink } from 'lucide-react'

export default function LiveSessionsPanel() {
  const { user } = useAuth()
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [streamUrl, setStreamUrl] = useState('')
  const [starting, setStarting] = useState(false)

  useEffect(() => {
    fetchSessions()
    const interval = setInterval(fetchSessions, 30000) // refresh every 30s
    return () => clearInterval(interval)
  }, [])

  const fetchSessions = async () => {
    try {
      const { data } = await sessionService.getLiveSessions()
      setSessions(Array.isArray(data) && data.length > 0 ? data : MOCK_LIVE_SESSIONS)
    } catch {
      setSessions(MOCK_LIVE_SESSIONS)
    } finally {
      setLoading(false)
    }
  }

  const handleStart = async () => {
    if (!title.trim()) { toast.error('Add a session title'); return }
    setStarting(true)
    try {
      await sessionService.startSession(title, description, streamUrl)
      toast.success('🔴 Live session started!')
      setShowForm(false)
      setTitle(''); setDescription(''); setStreamUrl('')
      fetchSessions()
    } catch {
      toast.error('Could not start session')
    } finally {
      setStarting(false)
    }
  }

  return (
    <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
      {/* Header */}
      <div style={{
        padding: '14px 16px',
        borderBottom: '1px solid var(--border-light)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 8, height: 8, borderRadius: '50%', background: '#e05a6a',
            animation: 'pulse 1.5s ease-in-out infinite',
          }} />
          <span style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '0.85rem' }}>
            Live Sessions
          </span>
        </div>
        {user && (
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => setShowForm(f => !f)}
            style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '4px 8px', fontSize: '0.75rem' }}
          >
            {showForm ? <X size={12} /> : <Plus size={12} />}
            {showForm ? 'Cancel' : 'Go Live'}
          </button>
        )}
      </div>

      {/* Start session form */}
      {showForm && (
        <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border-light)', background: 'var(--bg-overlay)' }}>
          <input
            type="text"
            placeholder="Session title (e.g. Grinding DP Problems)"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="input-field"
            style={{ marginBottom: 8, fontSize: '0.82rem', padding: '8px 10px' }}
          />
          <input
            type="text"
            placeholder="Short description (optional)"
            value={description}
            onChange={e => setDescription(e.target.value)}
            className="input-field"
            style={{ marginBottom: 8, fontSize: '0.82rem', padding: '8px 10px' }}
          />
          <input
            type="text"
            placeholder="Stream URL / YouTube / Twitch (optional)"
            value={streamUrl}
            onChange={e => setStreamUrl(e.target.value)}
            className="input-field"
            style={{ marginBottom: 10, fontSize: '0.82rem', padding: '8px 10px' }}
          />
          <button
            className="btn btn-primary"
            style={{ width: '100%', fontSize: '0.82rem', padding: '8px' }}
            onClick={handleStart}
            disabled={starting}
          >
            {starting ? <Loader2 size={13} style={{ animation: 'spin 1s linear infinite' }} /> : <Radio size={13} />}
            {starting ? 'Starting…' : 'Start Live Session'}
          </button>
        </div>
      )}

      {/* Sessions list */}
      <div style={{ maxHeight: 280, overflowY: 'auto' }}>
        {loading ? (
          <div style={{ padding: 20, textAlign: 'center' }}>
            <div className="spinner" style={{ width: 20, height: 20, borderWidth: 2, margin: '0 auto' }} />
          </div>
        ) : sessions.length === 0 ? (
          <div style={{ padding: '20px 16px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.82rem' }}>
            No live sessions right now.<br />Be the first to go live!
          </div>
        ) : (
          sessions.map((s, i) => (
            <div
              key={s.id}
              style={{
                padding: '12px 16px',
                borderBottom: i < sessions.length - 1 ? '1px solid var(--border-light)' : 'none',
                transition: 'background 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-overlay)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#26de81', flexShrink: 0 }} />
                    <span style={{ fontWeight: 700, fontSize: '0.82rem', color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {s.title}
                    </span>
                  </div>
                  {s.description && (
                    <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {s.description}
                    </div>
                  )}
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-faint)' }}>
                    by {s.host?.name || `User ${s.host_id?.slice(0, 6)}`} · {formatRelativeTime(s.created_at)}
                  </div>
                </div>
                {s.stream_url && (
                  <a href={s.stream_url} target="_blank" rel="noopener noreferrer"
                    style={{ color: 'var(--accent-primary)', flexShrink: 0 }}>
                    <ExternalLink size={13} />
                  </a>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
