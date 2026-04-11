import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { userService, followService } from '../services'
import { SKILL_SUGGESTIONS } from '../data/constants'
import { useAuth } from '../context/AuthContext'
import { getInitials, debounce } from '../utils'
import { Search, MapPin, Users, X, Zap, Code2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { gsap } from 'gsap'

export default function SearchPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user: currentUser } = useAuth()
  const [query, setQuery] = useState(() => new URLSearchParams(location.search).get('skill') || '')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [followingMap, setFollowingMap] = useState({})
  const [hasSearched, setHasSearched] = useState(false)
  const containerRef = useRef(null)
  const pollRef = useRef(null)

  // Fetch real data from backend
  const fetchUsers = useCallback(async (q = '') => {
    setLoading(true)
    setHasSearched(true)
    try {
      const url = q.trim()
        ? `/search?skill=${encodeURIComponent(q)}`
        : `/search`
      const { data } = await userService.searchBySkill(q)
      const arr = Array.isArray(data) ? data : []
      setResults(arr)
      // Animate cards
      setTimeout(() => {
        gsap.fromTo('.user-card',
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, stagger: 0.07, duration: 0.45, ease: 'power3.out' }
        )
      }, 50)
    } catch (err) {
      setResults([])
    } finally {
      setLoading(false)
    }
  }, [])

  // Debounced version for typing
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedFetch = useCallback(debounce((q) => fetchUsers(q), 350), [fetchUsers])

  // Initial load + polling
  useEffect(() => {
    const initial = new URLSearchParams(location.search).get('skill') || ''
    fetchUsers(initial)

    // Poll every 30s to keep results fresh
    pollRef.current = setInterval(() => {
      const q = new URLSearchParams(window.location.search).get('skill') || ''
      fetchUsers(q)
    }, 30000)

    return () => clearInterval(pollRef.current)
  }, []) // eslint-disable-line

  const handleInput = (val) => {
    setQuery(val)
    navigate(`/search${val ? `?skill=${encodeURIComponent(val)}` : ''}`, { replace: true })
    debouncedFetch(val)
  }

  const handleFollow = async (userId) => {
    if (!currentUser) { toast.error('Please log in'); return }
    const was = followingMap[userId]
    setFollowingMap(m => ({ ...m, [userId]: !was }))
    try {
      if (was) await followService.unfollow(userId)
      else await followService.follow(userId)
      toast.success(was ? 'Unfollowed' : 'Following! 🎉')
    } catch {
      setFollowingMap(m => ({ ...m, [userId]: was }))
      toast.error('Something went wrong')
    }
  }

  const getSkillsArray = (skills) => {
    if (!skills) return []
    if (Array.isArray(skills)) return skills.map(s => s.trim()).filter(Boolean)
    return skills.split(',').map(s => s.trim()).filter(Boolean)
  }

  return (
    <div className="responsive-padding" style={{ maxWidth: 900, margin: '0 auto', padding: '24px 20px 100px' }}>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: 'Space Grotesk', fontWeight: 800, fontSize: '1.8rem', letterSpacing: '-0.02em', marginBottom: 8 }}>
          Discover Developers
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>Search by skill, tech, or name — refreshes automatically</p>
      </div>

      {/* Search input */}
      <div style={{ position: 'relative', marginBottom: 20 }}>
        <Search size={18} style={{
          position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
          color: 'var(--text-muted)', pointerEvents: 'none',
        }} />
        <input
          type="text"
          placeholder="e.g. TypeScript, Go, Machine Learning…"
          value={query}
          onChange={e => handleInput(e.target.value)}
          className="input-field"
          style={{ paddingLeft: 44, paddingTop: 14, paddingBottom: 14, fontSize: '0.95rem' }}
          autoFocus
        />
        {query && (
          <button
            onClick={() => handleInput('')}
            style={{
              position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
              background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)',
            }}
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Skill suggestions */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 28 }}>
        {SKILL_SUGGESTIONS.slice(0, 14).map(s => (
          <button
            key={s}
            className="skill-tag"
            style={{ cursor: 'pointer', opacity: query === s ? 1 : 0.8 }}
            onClick={() => handleInput(s)}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Results count */}
      <div style={{ marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
          {loading
            ? '🔍 Searching…'
            : hasSearched
              ? `${results.length} developer${results.length !== 1 ? 's' : ''} found`
              : ''}
        </span>
        {!loading && results.length > 0 && (
          <span style={{ fontSize: '0.72rem', color: 'var(--text-faint)' }}>• updates every 30s</span>
        )}
      </div>

      {/* Skeleton loaders */}
      {loading && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="glass-card skeleton" style={{ height: 170 }} />
          ))}
        </div>
      )}

      {/* Results grid */}
      {!loading && results.length === 0 && hasSearched && (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
          <Search size={48} style={{ margin: '0 auto 16px', opacity: 0.2 }} />
          <p style={{ fontWeight: 600, marginBottom: 8 }}>No developers found</p>
          <p style={{ fontSize: '0.85rem' }}>Try a different skill or technology</p>
        </div>
      )}

      {!loading && results.length > 0 && (
        <div ref={containerRef} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
          {results.map(u => {
            const userSkills = getSkillsArray(u.skills)
            const initials = getInitials(u.name || '')
            const isMe = currentUser?.id === u.id
            const isFollowing = followingMap[u.id]

            return (
              <div key={u.id} className="user-card glass-card" style={{ padding: '20px', opacity: 0 }}>
                {/* Avatar + info */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 12 }}>
                  {u.avatar_url ? (
                    <img
                      src={u.avatar_url}
                      alt={u.name}
                      style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--border-accent)', flexShrink: 0 }}
                      onError={e => { e.target.style.display = 'none'; e.target.nextSibling?.style && (e.target.nextSibling.style.display = 'flex') }}
                    />
                  ) : null}
                  <div
                    className="avatar-placeholder"
                    style={{
                      width: 44, height: 44, borderRadius: '50%', fontSize: '0.78rem', flexShrink: 0,
                      display: u.avatar_url ? 'none' : 'flex',
                    }}
                  >
                    {initials}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <Link to={`/users/${u.id}`} style={{ textDecoration: 'none' }}>
                      <div style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--text-primary)', marginBottom: 2 }}>
                        {u.name || 'Unknown User'}
                      </div>
                    </Link>
                    {u.location && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        <MapPin size={11} /> {u.location}
                      </div>
                    )}
                  </div>
                </div>

                {/* Bio */}
                {u.bio && (
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 10,
                    display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {u.bio}
                  </p>
                )}

                {/* Skills */}
                {userSkills.length > 0 && (
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
                    {userSkills.slice(0, 4).map(s => (
                      <button
                        key={s}
                        className="skill-tag"
                        style={{ fontSize: '0.7rem', padding: '2px 8px', cursor: 'pointer' }}
                        onClick={() => handleInput(s)}
                      >
                        {s}
                      </button>
                    ))}
                    {userSkills.length > 4 && (
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-faint)', alignSelf: 'center' }}>
                        +{userSkills.length - 4} more
                      </span>
                    )}
                  </div>
                )}

                {/* Stats */}
                <div style={{ display: 'flex', gap: 14, fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 14, flexWrap: 'wrap' }}>
                  {u.score > 0 && <span><Zap size={11} style={{ verticalAlign: 'middle' }} /> {u.score} XP</span>}
                  {u.followers > 0 && <span><Users size={11} style={{ verticalAlign: 'middle' }} /> {u.followers}</span>}
                  {u.leetcode_solved > 0 && <span><Code2 size={11} style={{ verticalAlign: 'middle' }} /> {u.leetcode_solved}</span>}
                </div>

                {/* Follow button */}
                {!isMe && (
                  <button
                    className={`btn btn-sm ${isFollowing ? 'btn-secondary' : 'btn-primary'}`}
                    style={{ width: '100%' }}
                    onClick={() => handleFollow(u.id)}
                  >
                    {isFollowing ? 'Following ✓' : '+ Follow'}
                  </button>
                )}
                {isMe && (
                  <Link to={`/users/${u.id}`} className="btn btn-secondary btn-sm" style={{ display: 'block', textAlign: 'center', textDecoration: 'none' }}>
                    View Profile
                  </Link>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
