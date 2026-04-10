import React, { useState, useEffect, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { userService, followService, aiService } from '../services'
import {
  MOCK_CODING_STATS, MOCK_DNA, MOCK_DEV_STATS,
  MOCK_LEADERBOARD_USERS, MOCK_POSTS, ARCHETYPES, PLATFORMS
} from '../data/mockData'
import { getInitials, formatNumber, formatDate, getContribColor } from '../utils'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { FiGithub as Github } from 'react-icons/fi'
import {
  MapPin, Link2, Code2, Star, GitBranch, Trophy, Users, FileText,
  Edit3, ExternalLink, Activity, Award, Zap, BarChart3, TrendingUp,
  Brain, Dna, Target, Flame, RefreshCw
} from 'lucide-react'
import {
  RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, Tooltip, Cell, PieChart, Pie, Legend,
  LineChart, Line, CartesianGrid, AreaChart, Area
} from 'recharts'
import { gsap } from 'gsap'
import toast from 'react-hot-toast'
import EditProfileModal from '../components/EditProfileModal'

const TABS = ['Overview', 'Competitive', 'GitHub', 'Writing', 'DNA', 'Posts', 'Network']
const CHART_TOOLTIP_STYLE = {
  contentStyle: {
    background: 'var(--bg-card)', border: '1px solid var(--border-light)',
    borderRadius: 10, fontSize: '0.78rem', color: 'var(--text-primary)',
  },
  cursor: { fill: 'rgba(255,255,255,0.03)' },
}

// ─── Contribution Heatmap ────────────────────────────────────────────────────
function ContribHeatmap({ data, theme }) {
  if (!data || !data.length) return null
  const flat = data.flat()
  const max = Math.max(...flat, 1)
  return (
    <div style={{ overflowX: 'auto' }}>
      <div style={{ display: 'flex', gap: 3, minWidth: 680 }}>
        {data.map((week, wi) => (
          <div key={wi} style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {week.map((count, di) => (
              <div
                key={di}
                title={`${count} contributions`}
                style={{
                  width: 11, height: 11, borderRadius: 2,
                  background: getContribColor(count, theme),
                  transition: 'transform 0.1s',
                  cursor: 'default',
                }}
                onMouseEnter={e => { e.target.style.transform = 'scale(1.5)' }}
                onMouseLeave={e => { e.target.style.transform = 'scale(1)' }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── XP Progress bar ────────────────────────────────────────────────────────
function XPBar({ xp }) {
  const MAX_XP = 25000
  const pct = Math.min((xp / MAX_XP) * 100, 100)
  const rank = xp < 5000 ? 'Newbie' : xp < 10000 ? 'Apprentice' : xp < 18000 ? 'Expert' : 'Master'
  const nextRank = xp < 5000 ? 'Apprentice' : xp < 10000 ? 'Expert' : xp < 18000 ? 'Master' : '🏆 Legend'
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            padding: '3px 10px', borderRadius: 99,
            background: 'linear-gradient(135deg, var(--accent-gold), var(--accent-warm))',
            fontSize: '0.72rem', fontWeight: 700, color: '#fff',
          }}>{rank}</div>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{formatNumber(xp)} XP</span>
        </div>
        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>→ {nextRank}</span>
      </div>
      <div style={{ height: 8, background: 'var(--border-medium)', borderRadius: 99, overflow: 'hidden' }}>
        <div style={{
          height: '100%', width: `${pct}%`,
          background: 'linear-gradient(90deg, var(--triton-2), var(--accent-gold))',
          borderRadius: 99, transition: 'width 1s ease',
        }} />
      </div>
    </div>
  )
}

// ─── DNA Visualizer ──────────────────────────────────────────────────────────
function DNAVisualizer({ dna }) {
  if (!dna?.primary_archetype) return null
  const archInfo = ARCHETYPES[dna.primary_archetype] || { emoji: '🧬', color: 'var(--accent-primary)', desc: '' }
  const strengths = (dna.top_strengths || '').split(',').filter(Boolean)
  const careers = (dna.suggested_career_paths || '').split(',').filter(Boolean)
  const radarData = dna.skills_radar || []

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Archetype Card */}
      <div className="glass-card" style={{
        padding: 24,
        background: `linear-gradient(135deg, ${archInfo.color}15, transparent)`,
        border: `1px solid ${archInfo.color}40`,
        textAlign: 'center',
      }}>
        <div style={{ fontSize: '3.5rem', marginBottom: 12 }}>{archInfo.emoji}</div>
        <div style={{ fontFamily: 'Space Grotesk', fontWeight: 800, fontSize: '1.4rem', color: archInfo.color, marginBottom: 6 }}>
          {dna.primary_archetype}
        </div>
        <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.7, maxWidth: 480, margin: '0 auto' }}>
          {dna.coding_style_summary}
        </div>
      </div>

      <div className="responsive-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* Skills Radar */}
        {radarData.length > 0 && (
          <div className="glass-card" style={{ padding: 20 }}>
            <h4 style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '0.9rem', marginBottom: 12 }}>Skill Radar</h4>
            <ResponsiveContainer width="100%" height={200}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="var(--border-medium)" />
                <PolarAngleAxis dataKey="skill" tick={{ fill: 'var(--text-muted)', fontSize: 10 }} />
                <Radar dataKey="score" stroke="var(--accent-primary)" fill="var(--accent-primary)" fillOpacity={0.18} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Top Strengths */}
        <div className="glass-card" style={{ padding: 20 }}>
          <h4 style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '0.9rem', marginBottom: 12 }}>💪 Top Strengths</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {strengths.map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 24, height: 24, borderRadius: '50%',
                  background: `${archInfo.color}20`, border: `1px solid ${archInfo.color}40`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.65rem', fontWeight: 700, color: archInfo.color, flexShrink: 0,
                }}>{i + 1}</div>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-primary)', fontWeight: 600 }}>{s.trim()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Career Paths */}
      <div className="glass-card" style={{ padding: 20 }}>
        <h4 style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '0.9rem', marginBottom: 12 }}>🚀 Suggested Career Paths</h4>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {careers.map((c, i) => (
            <div key={i} style={{
              padding: '8px 16px', borderRadius: 99,
              background: `${archInfo.color}15`,
              border: `1px solid ${archInfo.color}30`,
              fontSize: '0.82rem', fontWeight: 600, color: archInfo.color,
            }}>{c.trim()}</div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Followers / Following Modal ─────────────────────────────────────────────
function NetworkModal({ title, users, onClose }) {
  const loading = false
  const profiles = users || []

  return (
    <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="modal-content" style={{ padding: 0, maxWidth: 420, width: '90vw', overflow: 'hidden' }}>
        <div style={{ padding: '18px 20px', borderBottom: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h3 style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '1rem' }}>{title}</h3>
          <button className="btn btn-ghost btn-icon" onClick={onClose}>
            {/* Import X from lucide - already imported at top */}
            <span style={{ fontSize: '1.2rem', lineHeight: 1, cursor: 'pointer' }} onClick={onClose}>✕</span>
          </button>
        </div>
        <div style={{ maxHeight: 420, overflowY: 'auto', padding: '8px 0' }}>
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: 32 }}>
              <div className="spinner" style={{ width: 24, height: 24, borderWidth: 2 }} />
            </div>
          ) : profiles.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '32px 20px', color: 'var(--text-muted)', fontSize: '0.88rem' }}>
              No users yet
            </div>
          ) : (
            profiles.map(u => (
              <Link
                key={u.id}
                to={`/users/${u.id}`}
                onClick={onClose}
                style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 20px', textDecoration: 'none', transition: 'background 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-overlay)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                {u.avatar_url ? (
                  <img src={u.avatar_url} alt={u.name} style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--border-accent)', flexShrink: 0 }} />
                ) : (
                  <div className="avatar-placeholder" style={{ width: 40, height: 40, borderRadius: '50%', fontSize: '0.72rem', flexShrink: 0 }}>
                    {getInitials(u.name || '')}
                  </div>
                )}
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)' }}>{u.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{u.location || u.bio?.slice(0, 40) || ''}</div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Main Component ──────────────────────────────────────────────────────────
export default function UserProfilePage() {
  const { userID } = useParams()
  const { user: currentUser } = useAuth()
  const { theme } = useTheme()
  const [profile, setProfile] = useState(null)
  const [stats, setStats] = useState(null)
  const [dna, setDna] = useState(null)
  const [posts, setPosts] = useState([])
  const [followers, setFollowers] = useState([])   // full user objects
  const [followingUsers, setFollowingUsers] = useState([])  // full user objects
  const [networkModal, setNetworkModal] = useState(null) // 'followers' | 'following' | null
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('Overview')
  const [isFollowing, setIsFollowing] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [analyzingDNA, setAnalyzingDNA] = useState(false)
  const [avatarError, setAvatarError] = useState(false)
  const headerRef = useRef(null)
  const pollRef = useRef(null)
  const isOwnProfile = currentUser?.id === userID

  const coding = MOCK_CODING_STATS

  const fetchAll = async () => {
    try {
      const [profRes, statsRes, dnaRes, postsRes, followersRes, followingRes] = await Promise.allSettled([
        userService.getUserById(userID),
        userService.getUserStats(userID),
        userService.getUserDNA(userID),
        userService.getUserPosts(userID),
        followService.getFollowers(userID),
        followService.getFollowing(userID),
      ])

      if (profRes.status === 'fulfilled' && profRes.value.data) {
        setProfile(profRes.value.data)
        setAvatarError(false)
      } else {
        setProfile(prev => prev || {
          id: userID,
          name: currentUser?.name || 'Developer',
          bio: '', skills: '', location: '',
          avatar_url: currentUser?.avatar_url || '',
        })
      }
      if (statsRes.status === 'fulfilled') setStats(statsRes.value.data)
      else setStats(prev => prev || MOCK_DEV_STATS)
      if (dnaRes.status === 'fulfilled') setDna(dnaRes.value.data)
      else setDna(prev => prev)
      if (postsRes.status === 'fulfilled') setPosts(postsRes.value.data || [])
      else setPosts(prev => prev.length ? prev : [])
      if (followersRes.status === 'fulfilled') {
        const arr = Array.isArray(followersRes.value.data) ? followersRes.value.data : []
        setFollowers(arr)
        if (currentUser) setIsFollowing(arr.some(u => u.id === currentUser.id))
      }
      if (followingRes.status === 'fulfilled') {
        const arr = Array.isArray(followingRes.value.data) ? followingRes.value.data : []
        setFollowingUsers(arr)
      }
    } catch {}
    finally { setLoading(false) }
  }

  useEffect(() => {
    setLoading(true)
    setAvatarError(false)
    // Immediately set from cached user data if viewing own profile
    if (isOwnProfile && currentUser) {
      setProfile(p => p || {
        id: userID,
        name: currentUser.name || '',
        avatar_url: currentUser.avatar_url || '',
        bio: '', skills: '', location: '', github: '',
      })
    }
    setFollowers([])
    setFollowingUsers([])
    fetchAll()
    pollRef.current = setInterval(fetchAll, 45000)
    return () => clearInterval(pollRef.current)
  }, [userID]) // eslint-disable-line

  useEffect(() => {
    if (!loading && headerRef.current) {
      gsap.fromTo(headerRef.current,
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }
      )
    }
  }, [loading])

  const handleAnalyzeDNA = async () => {
    setAnalyzingDNA(true)
    try {
      const { data } = await aiService.analyzeDNA()
      setDna(data)
      toast.success('DNA analyzed! 🧬')
    } catch {
      setDna(MOCK_DNA)
      toast.success('DNA analyzed! 🧬')
    } finally {
      setAnalyzingDNA(false)
    }
  }

  const handleFollow = async () => {
    const prev = isFollowing
    setIsFollowing(!prev)
    try {
      prev ? await followService.unfollow(userID) : await followService.follow(userID)
      toast.success(prev ? 'Unfollowed' : 'Following! 🎉')
      fetchAll() // Re-fetch to update counts
    } catch {
      setIsFollowing(prev)
    }
  }

  const skills = profile?.skills
    ? (typeof profile.skills === 'string'
      ? profile.skills.split(',').map(s => s.trim()).filter(Boolean)
      : profile.skills)
    : []

  if (loading && !profile) return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}>
      <div className="spinner" style={{ width: 32, height: 32, borderWidth: 3 }} />
    </div>
  )

  return (
    <div className="responsive-padding" style={{ maxWidth: 1060, margin: '0 auto', padding: '24px 20px 40px' }}>
      {showEditModal && (
        <EditProfileModal
          profile={profile}
          onClose={() => setShowEditModal(false)}
          onSave={(updated) => { setProfile(p => ({ ...p, ...updated })); setShowEditModal(false) }}
        />
      )}
      {networkModal && (
        <NetworkModal
          title={networkModal === 'followers' ? `Followers (${followers.length})` : `Following (${followingUsers.length})`}
          users={networkModal === 'followers' ? followers : followingUsers}
          onClose={() => setNetworkModal(null)}
        />
      )}

      {/* ── Hero Header ── */}
      <div ref={headerRef} className="glass-card" style={{ padding: '28px 28px 20px', marginBottom: 20, position: 'relative', overflow: 'hidden' }}>
        {/* Ambient glow */}
        <div style={{
          position: 'absolute', top: -80, right: -80,
          width: 300, height: 300, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(61,122,111,0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div className="responsive-hero-info" style={{ display: 'flex', alignItems: 'flex-start', gap: 20, flexWrap: 'wrap' }}>
          {/* Avatar */}
          <div style={{ position: 'relative', flexShrink: 0 }}>
            {profile?.avatar_url && !avatarError ? (
              <img
                src={profile.avatar_url}
                alt={profile.name}
                style={{ width: 88, height: 88, borderRadius: '50%', border: '3px solid var(--accent-primary)', objectFit: 'cover' }}
                onError={() => setAvatarError(true)}
              />
            ) : (
              <div style={{
                width: 88, height: 88, borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--triton-2), var(--accent-gold))',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'Space Grotesk', fontWeight: 800, fontSize: '2rem', color: '#fff',
                border: '3px solid var(--accent-primary)',
              }}>{getInitials(profile?.name || '')}</div>
            )}
          </div>

          {/* Info */}
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 4 }}>
              <h1 style={{ fontFamily: 'Space Grotesk', fontWeight: 800, fontSize: '1.6rem', letterSpacing: '-0.02em', margin: 0 }}>
                {profile?.name || 'Developer'}
              </h1>
              {dna?.primary_archetype && (
                <span style={{ fontSize: '0.72rem', padding: '3px 10px', borderRadius: 99, background: 'rgba(61,122,111,0.15)', color: 'var(--accent-primary)', fontWeight: 700, border: '1px solid var(--border-accent)' }}>
                  {ARCHETYPES[dna.primary_archetype]?.emoji} {dna.primary_archetype}
                </span>
              )}
            </div>
            {profile?.bio && (
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.6, marginBottom: 10, maxWidth: 500 }}>
                {profile.bio}
              </p>
            )}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 12 }}>
              {profile?.location && <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><MapPin size={12} />{profile.location}</span>}
              {profile?.github && (
                <a href={`https://github.com/${profile.github}`} target="_blank" rel="noopener noreferrer"
                  style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--accent-primary)', textDecoration: 'none' }}>
                  <Github size={12} />{profile.github}
                </a>
              )}
            </div>
            {skills.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {skills.slice(0, 8).map(s => (
                  <span key={s} className="skill-tag" style={{ fontSize: '0.72rem' }}>{s}</span>
                ))}
              </div>
            )}
          </div>

          {/* Stats + Actions */}
          <div className="responsive-hero-stats" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 14 }}>
            {/* Instagram-style follower / following counts + XP */}
            <div style={{ display: 'flex', gap: 20, fontSize: '0.78rem' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'Space Grotesk', fontWeight: 800, fontSize: '1.25rem', color: 'var(--accent-gold)' }}>{formatNumber(stats?.total_xp || 0)}</div>
                <div style={{ color: 'var(--text-muted)' }}>XP</div>
              </div>
              <button
                onClick={() => setNetworkModal('followers')}
                style={{ textAlign: 'center', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
              >
                <div style={{ fontFamily: 'Space Grotesk', fontWeight: 800, fontSize: '1.25rem', color: 'var(--text-primary)' }}>{followers.length}</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>Followers</div>
              </button>
              <button
                onClick={() => setNetworkModal('following')}
                style={{ textAlign: 'center', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
              >
                <div style={{ fontFamily: 'Space Grotesk', fontWeight: 800, fontSize: '1.25rem', color: 'var(--text-primary)' }}>{followingUsers.length}</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>Following</div>
              </button>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'Space Grotesk', fontWeight: 800, fontSize: '1.25rem', color: 'var(--accent-primary)' }}>{stats?.current_streak || 0}🔥</div>
                <div style={{ color: 'var(--text-muted)' }}>Streak</div>
              </div>
            </div>
            {/* Action buttons */}
            <div style={{ display: 'flex', gap: 8 }}>
              {isOwnProfile ? (
                <button className="btn btn-secondary btn-sm" onClick={() => setShowEditModal(true)} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Edit3 size={13} /> Edit Profile
                </button>
              ) : (
                <button
                  className={`btn btn-sm ${isFollowing ? 'btn-secondary' : 'btn-primary'}`}
                  onClick={handleFollow}
                >
                  {isFollowing ? 'Following ✓' : '+ Follow'}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* XP Bar */}
        <div style={{ marginTop: 20 }}>
          <XPBar xp={stats?.total_xp || 0} />
        </div>
      </div>

      {/* ── Quick Stats Row ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 12, marginBottom: 20 }}>
        {[
          { label: 'LeetCode', value: stats?.leetcode_solved || coding.leetcode.solved, icon: Code2, color: '#FFA116' },
          { label: 'Codeforces', value: stats?.codeforces_rating || coding.codeforces.rating, icon: Zap, color: '#1194F6' },
          { label: 'Commits', value: stats?.github_commits || coding.github.totalCommits, icon: GitBranch, color: '#26de81' },
          { label: 'Collab Score', value: stats?.collaboration_score || 74, icon: Users, color: 'var(--accent-primary)' },
          { label: 'Rep Score', value: `${stats?.reputation_score || 8.6}/10`, icon: Star, color: 'var(--accent-gold)' },
          { label: 'Articles', value: coding.medium.articles, icon: FileText, color: '#000' },
        ].map((s, i) => (
          <div key={i} className="glass-card" style={{ padding: '14px 16px', textAlign: 'center' }}>
            <s.icon size={18} style={{ color: s.color, margin: '0 auto 6px' }} />
            <div style={{ fontFamily: 'Space Grotesk', fontWeight: 800, fontSize: '1.3rem', color: 'var(--text-primary)', lineHeight: 1 }}>
              {typeof s.value === 'number' ? formatNumber(s.value) : s.value}
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 3 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* ── Tabs ── */}
      <div className="tabs-bar" style={{ marginBottom: 20, overflowX: 'auto' }}>
        {TABS.map(t => (
          <button
            key={t}
            className={`tab-item${activeTab === t ? ' active' : ''}`}
            onClick={() => setActiveTab(t)}
            style={{ border: 'none', background: 'none', cursor: 'pointer', whiteSpace: 'nowrap' }}
          >{t}</button>
        ))}
      </div>

      {/* ─────────────────── OVERVIEW TAB ─────────────────── */}
      {activeTab === 'Overview' && (
        <div className="responsive-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {/* LeetCode difficulty breakdown */}
          <div className="glass-card" style={{ padding: 20 }}>
            <h3 style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '0.92rem', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
              🧩 LeetCode Breakdown
            </h3>
            <div style={{ display: 'flex', gap: 12, marginBottom: 14 }}>
              {[
                { label: 'Easy', val: coding.leetcode.easy, color: '#26de81' },
                { label: 'Medium', val: coding.leetcode.medium, color: '#FFA116' },
                { label: 'Hard', val: coding.leetcode.hard, color: '#e05a6a' },
              ].map(d => (
                <div key={d.label} style={{ flex: 1, textAlign: 'center', padding: '10px 6px', borderRadius: 10, background: `${d.color}15`, border: `1px solid ${d.color}30` }}>
                  <div style={{ fontFamily: 'Space Grotesk', fontWeight: 800, fontSize: '1.4rem', color: d.color }}>{d.val}</div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: 2 }}>{d.label}</div>
                </div>
              ))}
            </div>
            <ResponsiveContainer width="100%" height={140}>
              <PieChart>
                <Pie data={[
                  { name: 'Easy', value: coding.leetcode.easy },
                  { name: 'Medium', value: coding.leetcode.medium },
                  { name: 'Hard', value: coding.leetcode.hard },
                ]} cx="50%" cy="50%" innerRadius={42} outerRadius={60} paddingAngle={3} dataKey="value">
                  {['#26de81', '#FFA116', '#e05a6a'].map((c, i) => <Cell key={i} fill={c} />)}
                </Pie>
                <Tooltip {...CHART_TOOLTIP_STYLE} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Skill radar */}
          <div className="glass-card" style={{ padding: 20 }}>
            <h3 style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '0.92rem', marginBottom: 14 }}>⚡ Skill Radar</h3>
            <ResponsiveContainer width="100%" height={220}>
              <RadarChart data={MOCK_DNA.skills_radar}>
                <PolarGrid stroke="var(--border-medium)" />
                <PolarAngleAxis dataKey="skill" tick={{ fill: 'var(--text-muted)', fontSize: 10 }} />
                <Radar dataKey="score" stroke="var(--accent-primary)" fill="var(--accent-primary)" fillOpacity={0.18} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Tag progress */}
          <div className="glass-card" style={{ padding: 20 }}>
            <h3 style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '0.92rem', marginBottom: 14 }}>🏷️ Topic Mastery</h3>
            {coding.leetcode.tagProgress?.map(t => (
              <div key={t.tag} style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: 4 }}>
                  <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>{t.tag}</span>
                  <span style={{ color: 'var(--text-muted)' }}>{t.solved}/{t.total}</span>
                </div>
                <div style={{ height: 6, background: 'var(--border-medium)', borderRadius: 99, overflow: 'hidden' }}>
                  <div style={{
                    height: '100%', width: `${(t.solved / t.total) * 100}%`,
                    background: 'linear-gradient(90deg, var(--triton-2), var(--accent-primary))',
                    borderRadius: 99,
                  }} />
                </div>
              </div>
            ))}
          </div>

          {/* GitHub language pie */}
          <div className="glass-card" style={{ padding: 20 }}>
            <h3 style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '0.92rem', marginBottom: 14 }}>🐙 Language Distribution</h3>
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie data={coding.github.topLanguages} cx="50%" cy="50%" innerRadius={45} outerRadius={65} paddingAngle={3} dataKey="percent" nameKey="name">
                  {coding.github.topLanguages.map((l, i) => <Cell key={i} fill={l.color} />)}
                </Pie>
                <Tooltip {...CHART_TOOLTIP_STYLE} formatter={(v) => `${v}%`} />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
              {coding.github.topLanguages.map(l => (
                <div key={l.name} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.72rem' }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: l.color }} />
                  <span style={{ color: 'var(--text-secondary)' }}>{l.name} {l.percent}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────── COMPETITIVE TAB ─────────────────── */}
      {activeTab === 'Competitive' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Rating cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14 }}>
            {[
              { label: 'LeetCode', val: coding.leetcode.contestRating, rank: `#${formatNumber(coding.leetcode.ranking)}`, color: '#FFA116', icon: '🧩' },
              { label: 'Codeforces', val: coding.codeforces.rating, rank: coding.codeforces.rank, color: '#1194F6', icon: '⚡' },
              { label: 'CodeChef', val: coding.codechef.rating, rank: `★ ${coding.codechef.stars} Stars`, color: '#5b4638', icon: '🍴' },
            ].map(p => (
              <div key={p.label} className="glass-card" style={{ padding: 20, textAlign: 'center', borderTop: `3px solid ${p.color}` }}>
                <div style={{ fontSize: '1.8rem', marginBottom: 6 }}>{p.icon}</div>
                <div style={{ fontFamily: 'Space Grotesk', fontWeight: 800, fontSize: '2rem', color: p.color }}>{p.val}</div>
                <div style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-primary)', marginBottom: 2 }}>{p.label}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{p.rank}</div>
              </div>
            ))}
          </div>

          {/* Codeforces rating history */}
          <div className="glass-card" style={{ padding: 20 }}>
            <h3 style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '0.92rem', marginBottom: 14 }}>⚡ Codeforces Rating History</h3>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={coding.codeforces.ratingHistory}>
                <defs>
                  <linearGradient id="cfGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1194F6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#1194F6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="var(--border-light)" strokeDasharray="3 3" />
                <XAxis dataKey="month" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} domain={['auto', 'auto']} />
                <Tooltip {...CHART_TOOLTIP_STYLE} />
                <Area type="monotone" dataKey="rating" stroke="#1194F6" strokeWidth={2} fill="url(#cfGrad)" dot={{ fill: '#1194F6', r: 4 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* CodeChef rating history */}
          <div className="glass-card" style={{ padding: 20 }}>
            <h3 style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '0.92rem', marginBottom: 14 }}>🍴 CodeChef Rating History</h3>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={coding.codechef.ratingHistory}>
                <defs>
                  <linearGradient id="ccGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#5b4638" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#5b4638" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="var(--border-light)" strokeDasharray="3 3" />
                <XAxis dataKey="month" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} domain={['auto', 'auto']} />
                <Tooltip {...CHART_TOOLTIP_STYLE} />
                <Area type="monotone" dataKey="rating" stroke="#5b4638" strokeWidth={2} fill="url(#ccGrad)" dot={{ fill: '#5b4638', r: 4 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Codeforces problems by rating */}
          <div className="glass-card" style={{ padding: 20 }}>
            <h3 style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '0.92rem', marginBottom: 14 }}>📊 Problems Solved by Rating</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={coding.codeforces.problemsByRating} barSize={22}>
                <XAxis dataKey="rating" tick={{ fill: 'var(--text-muted)', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip {...CHART_TOOLTIP_STYLE} />
                <Bar dataKey="solved" radius={[4, 4, 0, 0]}>
                  {coding.codeforces.problemsByRating.map((_, i) => (
                    <Cell key={i} fill={`hsl(${140 + i * 12}, 60%, 50%)`} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Recent LeetCode submissions */}
          <div className="glass-card" style={{ padding: 20 }}>
            <h3 style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '0.92rem', marginBottom: 14 }}>📝 Recent Submissions</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {coding.leetcode.recentSubmissions.map((s, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '10px 0', borderBottom: i < coding.leetcode.recentSubmissions.length - 1 ? '1px solid var(--border-light)' : 'none',
                  gap: 12,
                }}>
                  <span style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-primary)', flex: 1 }}>{s.title}</span>
                  <span style={{
                    fontSize: '0.7rem', padding: '2px 8px', borderRadius: 99, fontWeight: 600,
                    background: s.difficulty === 'Easy' ? '#26de8120' : s.difficulty === 'Medium' ? '#FFA11620' : '#e05a6a20',
                    color: s.difficulty === 'Easy' ? '#26de81' : s.difficulty === 'Medium' ? '#FFA116' : '#e05a6a',
                  }}>{s.difficulty}</span>
                  <span style={{
                    fontSize: '0.72rem', padding: '2px 8px', borderRadius: 99, fontWeight: 600,
                    background: s.status === 'Accepted' ? '#26de8115' : '#e05a6a15',
                    color: s.status === 'Accepted' ? '#26de81' : '#e05a6a',
                  }}>{s.status}</span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-faint)', flexShrink: 0 }}>{s.date}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────── GITHUB TAB ─────────────────── */}
      {activeTab === 'GitHub' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Stats row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 12 }}>
            {[
              { label: 'Total Commits', val: formatNumber(coding.github.totalCommits), color: '#26de81' },
              { label: 'Public Repos', val: coding.github.publicRepos, color: 'var(--accent-primary)' },
              { label: 'Total Stars', val: formatNumber(coding.github.stars), color: 'var(--accent-gold)' },
              { label: 'Followers', val: coding.github.followers, color: 'var(--triton-2)' },
            ].map((s, i) => (
              <div key={i} className="glass-card" style={{ padding: '16px', textAlign: 'center' }}>
                <div style={{ fontFamily: 'Space Grotesk', fontWeight: 800, fontSize: '1.6rem', color: s.color }}>{s.val}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Contribution heatmap */}
          <div className="glass-card" style={{ padding: 20 }}>
            <h3 style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '0.92rem', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Activity size={16} color="var(--accent-primary)" /> Contribution Heatmap (52 weeks)
            </h3>
            <ContribHeatmap data={coding.github.contributionCalendar} theme={theme} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 10, justifyContent: 'flex-end' }}>
              <span style={{ fontSize: '0.68rem', color: 'var(--text-faint)' }}>Less</span>
              {[0, 2, 5, 10, 15].map(n => (
                <div key={n} style={{ width: 10, height: 10, borderRadius: 2, background: getContribColor(n, theme) }} />
              ))}
              <span style={{ fontSize: '0.68rem', color: 'var(--text-faint)' }}>More</span>
            </div>
          </div>

          {/* Monthly commits trend */}
          <div className="glass-card" style={{ padding: 20 }}>
            <h3 style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '0.92rem', marginBottom: 14 }}>📈 Monthly Commit Trend</h3>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={coding.github.monthlyCommits}>
                <defs>
                  <linearGradient id="githubGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#26de81" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#26de81" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="var(--border-light)" strokeDasharray="3 3" />
                <XAxis dataKey="month" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip {...CHART_TOOLTIP_STYLE} />
                <Area type="monotone" dataKey="commits" stroke="#26de81" strokeWidth={2} fill="url(#githubGrad)" dot={{ fill: '#26de81', r: 4 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="responsive-grid-2" style={{ gap: 16 }}>
            {/* Commits by day */}
            <div className="glass-card" style={{ padding: 20 }}>
              <h3 style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '0.92rem', marginBottom: 14 }}>📅 Commits by Day of Week</h3>
              <ResponsiveContainer width="100%" height={160}>
                <BarChart data={coding.github.commitsByDay} barSize={24}>
                  <XAxis dataKey="day" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis hide />
                  <Tooltip {...CHART_TOOLTIP_STYLE} />
                  <Bar dataKey="commits" radius={[4, 4, 0, 0]}>
                    {coding.github.commitsByDay.map((_, i) => (
                      <Cell key={i} fill={i < 5 ? 'var(--accent-primary)' : 'var(--border-medium)'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Commit time heatmap by hour */}
            <div className="glass-card" style={{ padding: 20 }}>
              <h3 style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '0.92rem', marginBottom: 14 }}>⏰ Coding Hours</h3>
              <ResponsiveContainer width="100%" height={160}>
                <BarChart data={coding.github.commitsByHour.filter((_, i) => i % 3 === 0)} barSize={12}>
                  <XAxis dataKey="hour" tick={{ fill: 'var(--text-muted)', fontSize: 9 }} axisLine={false} tickLine={false} />
                  <YAxis hide />
                  <Tooltip {...CHART_TOOLTIP_STYLE} />
                  <Bar dataKey="commits" radius={[3, 3, 0, 0]} fill="var(--triton-2)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Pinned repos */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 12 }}>
            {coding.github.pinnedRepos.map(r => (
              <div key={r.name} className="glass-card" style={{ padding: 18, borderLeft: `3px solid ${r.color}` }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 6 }}>
                  <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--accent-primary)' }}>{r.name}</div>
                  <div style={{ display: 'flex', gap: 4, alignItems: 'center', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    <Star size={10} />{r.stars} <GitBranch size={10} />{r.forks}
                  </div>
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 10 }}>{r.desc}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.72rem' }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: r.color }} />
                  <span style={{ color: 'var(--text-muted)' }}>{r.lang}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─────────────────── WRITING TAB ─────────────────── */}
      {activeTab === 'Writing' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 14 }}>
            {[
              { label: 'Medium Followers', val: formatNumber(coding.medium.followers), color: '#000', icon: '✍️' },
              { label: 'Articles', val: coding.medium.articles, color: 'var(--accent-primary)', icon: '📄' },
              { label: 'Total Claps', val: formatNumber(coding.medium.totalClaps), color: 'var(--accent-gold)', icon: '👏' },
              { label: 'GFG Score', val: formatNumber(coding.gfg.score), color: '#2F8D46', icon: '🟢' },
              { label: 'HackerRank Stars', val: '★'.repeat(coding.hackerrank.stars), color: '#00EA64', icon: '🏅' },
            ].map((s, i) => (
              <div key={i} className="glass-card" style={{ padding: '16px', textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', marginBottom: 6 }}>{s.icon}</div>
                <div style={{ fontFamily: 'Space Grotesk', fontWeight: 800, fontSize: '1.4rem', color: s.color }}>{s.val}</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 3 }}>{s.label}</div>
              </div>
            ))}
          </div>
          {/* Recent articles */}
          <div className="glass-card" style={{ padding: 20 }}>
            <h3 style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '0.92rem', marginBottom: 14 }}>✍️ Recent Articles</h3>
            {coding.medium.recentArticles.map((a, i) => (
              <div key={i} style={{
                padding: '14px 0', borderBottom: i < coding.medium.recentArticles.length - 1 ? '1px solid var(--border-light)' : 'none',
              }}>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)', marginBottom: 6 }}>{a.title}</div>
                <div style={{ display: 'flex', gap: 16, fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  <span>👏 {formatNumber(a.claps)} claps</span>
                  <span>👀 {formatNumber(a.reads)} reads</span>
                  <span>{a.date}</span>
                </div>
              </div>
            ))}
          </div>
          {/* HackerRank badges */}
          <div className="glass-card" style={{ padding: 20 }}>
            <h3 style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '0.92rem', marginBottom: 14 }}>🏅 HackerRank Badges</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              {coding.hackerrank.badges.map(b => (
                <span key={b} style={{
                  padding: '6px 14px', borderRadius: 99, fontSize: '0.78rem', fontWeight: 600,
                  background: 'rgba(0,234,100,0.12)', color: '#00EA64', border: '1px solid rgba(0,234,100,0.3)',
                }}>{b}</span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────── DNA TAB ─────────────────── */}
      {activeTab === 'DNA' && (
        <div>
          {isOwnProfile && (
            <div className="glass-card" style={{ padding: '16px 20px', marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: 2 }}>🧬 AI Developer DNA Analysis</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Powered by AI. Analyzes your GitHub to generate your developer profile.</div>
              </div>
              <button
                className="btn btn-primary btn-sm"
                onClick={handleAnalyzeDNA}
                disabled={analyzingDNA}
                style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}
              >
                {analyzingDNA
                  ? <><RefreshCw size={13} style={{ animation: 'spin 1s linear infinite' }} /> Analyzing…</>
                  : <><Zap size={13} /> Analyze DNA</>}
              </button>
            </div>
          )}
          <DNAVisualizer dna={dna} />
        </div>
      )}

      {/* ─────────────────── POSTS TAB ─────────────────── */}
      {activeTab === 'Posts' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {posts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
              <FileText size={40} style={{ margin: '0 auto 16px', opacity: 0.3 }} />
              <p>No posts yet.</p>
            </div>
          ) : (
            posts.map(p => (
              <div key={p.id} className="glass-card" style={{ padding: 20 }}>
                <p style={{ fontSize: '0.9rem', lineHeight: 1.7, color: 'var(--text-primary)', marginBottom: 12 }}>{p.content}</p>
                <div style={{ display: 'flex', gap: 16, fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  <span>❤️ {p.likes || 0}</span>
                  <span>💬 {p.comments || 0}</span>
                  <span>{p.created_at ? formatDate(p.created_at) : ''}</span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* ─────────────────── NETWORK TAB ─────────────────── */}
      {activeTab === 'Network' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Instagram-style stat cards */}
          <div className="responsive-grid-2" style={{ marginBottom: 16 }}>
            <button
              className="glass-card"
              onClick={() => setNetworkModal('followers')}
              style={{ padding: 28, textAlign: 'center', cursor: 'pointer', border: 'none', background: 'var(--bg-card)', transition: 'all 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent-primary)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-light)'}
            >
              <div style={{ fontFamily: 'Space Grotesk', fontWeight: 800, fontSize: '2.8rem', color: 'var(--text-primary)', lineHeight: 1, marginBottom: 8 }}>
                {followers.length}
              </div>
              <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)', fontWeight: 600 }}>👥 Followers</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-faint)', marginTop: 6 }}>Click to view list</div>
            </button>
            <button
              className="glass-card"
              onClick={() => setNetworkModal('following')}
              style={{ padding: 28, textAlign: 'center', cursor: 'pointer', border: 'none', background: 'var(--bg-card)', transition: 'all 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent-primary)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-light)'}
            >
              <div style={{ fontFamily: 'Space Grotesk', fontWeight: 800, fontSize: '2.8rem', color: 'var(--text-primary)', lineHeight: 1, marginBottom: 8 }}>
                {followingUsers.length}
              </div>
              <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)', fontWeight: 600 }}>👣 Following</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-faint)', marginTop: 6 }}>Click to view list</div>
            </button>
          </div>

          {followers.length === 0 && followingUsers.length === 0 && (
            <div className="glass-card" style={{ padding: 32, textAlign: 'center', color: 'var(--text-muted)' }}>
              <Users size={40} style={{ margin: '0 auto 16px', opacity: 0.2 }} />
              <p style={{ fontWeight: 600, marginBottom: 8 }}>{isOwnProfile ? "You haven't connected with anyone yet" : 'No connections yet'}</p>
              {isOwnProfile && <p style={{ fontSize: '0.85rem' }}>Follow developers from the <a href="/search" style={{ color: 'var(--accent-primary)' }}>Search</a> page</p>}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
