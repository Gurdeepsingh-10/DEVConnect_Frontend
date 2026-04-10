import React, { useState, useEffect } from 'react'
import { notificationService } from '../services'
import { MOCK_NOTIFICATIONS } from '../data/mockData'
import { formatRelativeTime } from '../utils'
import { Heart, MessageCircle, UserPlus, Bell } from 'lucide-react'
import { gsap } from 'gsap'

const TYPE_CONFIG = {
  like: { icon: Heart, color: '#e05a6a', bg: 'rgba(224,90,106,0.10)' },
  comment: { icon: MessageCircle, color: 'var(--triton-2)', bg: 'rgba(61,122,111,0.10)' },
  follow: { icon: UserPlus, color: 'var(--accent-gold)', bg: 'rgba(200,168,106,0.10)' },
}

export default function NotificationsPage() {
  const [notifs, setNotifs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchNotifs()
  }, [])

  useEffect(() => {
    if (!loading) {
      gsap.fromTo('.notif-item',
        { x: -20, opacity: 0 },
        { x: 0, opacity: 1, stagger: 0.05, duration: 0.4, ease: 'power3.out' }
      )
    }
  }, [loading])

  const fetchNotifs = async () => {
    setLoading(true)
    try {
      const { data } = await notificationService.getAll()
      if (!data) setNotifs([])
      else setNotifs(Array.isArray(data) ? data : [])
    } catch {
      setNotifs(MOCK_NOTIFICATIONS)
    } finally {
      setLoading(false)
    }
  }

  const markRead = async (id) => {
    setNotifs(n => n.map(x => x.id === id ? { ...x, read: true } : x))
    try { await notificationService.markRead(id) } catch {}
  }

  const markAllRead = () => {
    setNotifs(n => n.map(x => ({ ...x, read: true })))
  }

  const unreadCount = notifs.filter(n => !n.read).length

  return (
    <div className="responsive-padding" style={{ maxWidth: 640, margin: '0 auto', padding: '24px 20px 100px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 12,
            background: 'rgba(61,122,111,0.12)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Bell size={20} color="var(--accent-primary)" />
          </div>
          <div>
            <h1 style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '1.4rem', lineHeight: 1 }}>Notifications</h1>
            {unreadCount > 0 && (
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 3 }}>
                {unreadCount} unread
              </p>
            )}
          </div>
        </div>
        {unreadCount > 0 && (
          <button className="btn btn-ghost btn-sm" onClick={markAllRead}>
            Mark all read
          </button>
        )}
      </div>

      {loading ? (
        Array.from({ length: 4 }).map((_, i) => (
          <div key={i} style={{ display: 'flex', gap: 12, padding: '16px 0', borderBottom: '1px solid var(--border-light)' }}>
            <div className="skeleton" style={{ width: 40, height: 40, borderRadius: '50%', flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <div className="skeleton" style={{ height: 14, width: '70%', marginBottom: 8 }} />
              <div className="skeleton" style={{ height: 12, width: '30%' }} />
            </div>
          </div>
        ))
      ) : notifs.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
          <Bell size={40} style={{ margin: '0 auto 16px', opacity: 0.3 }} />
          <p>No notifications yet.</p>
        </div>
      ) : (
        <div className="glass-card" style={{ overflow: 'hidden', padding: 0 }}>
          {notifs.map((n, i) => {
            const cfg = TYPE_CONFIG[n.type] || TYPE_CONFIG.like
            const Icon = cfg.icon
            return (
              <div
                key={n.id}
                className="notif-item"
                onClick={() => markRead(n.id)}
                style={{
                  display: 'flex', alignItems: 'flex-start', gap: 14, padding: '16px 20px',
                  borderBottom: i < notifs.length - 1 ? '1px solid var(--border-light)' : 'none',
                  background: n.read ? 'transparent' : 'rgba(61,122,111,0.04)',
                  cursor: 'pointer',
                  transition: 'background var(--duration-fast)',
                  opacity: 0,
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-overlay)'}
                onMouseLeave={e => e.currentTarget.style.background = n.read ? 'transparent' : 'rgba(61,122,111,0.04)'}
              >
                <div style={{
                  width: 38, height: 38, borderRadius: '50%',
                  background: cfg.bg,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <Icon size={16} color={cfg.color} />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-primary)', lineHeight: 1.5, marginBottom: 3 }}>
                    {n.message}
                  </p>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-faint)' }}>
                    {formatRelativeTime(n.created_at)}
                  </span>
                </div>
                {!n.read && (
                  <div style={{
                    width: 8, height: 8, borderRadius: '50%',
                    background: 'var(--accent-primary)',
                    marginTop: 8, flexShrink: 0,
                  }} />
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
