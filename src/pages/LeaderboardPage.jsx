import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useAuth } from '../context/AuthContext'
import { leaderboardService, followService } from '../services'
import { MOCK_LEADERBOARD_USERS } from '../data/mockData'
import { Link } from 'react-router-dom'
import { getInitials, formatNumber } from '../utils'
import { gsap } from 'gsap'
import {
  Trophy, Globe, Users, Code2, Star, GitBranch,
  Zap, TrendingUp, BarChart3, Award, RefreshCw, Flame
} from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
  RadarChart, PolarGrid, PolarAngleAxis, Radar,
  CartesianGrid, Legend,
  PieChart, Pie, AreaChart, Area,
} from 'recharts'

// ── Constants ───────────────────────────────────────────────────────────────
const BOARD_TABS = [
  { id: 'global', label: 'Global', icon: Globe },
  { id: 'network', label: 'My Network', icon: Users },
]

const METRIC_OPTS = [
  { id: 'score', label: 'Overall XP' },
  { id: 'leetcode', label: 'LeetCode' },
  { id: 'codeforces', label: 'Codeforces' },
  { id: 'github_stars', label: 'GitHub' },
  { id: 'followers', label: 'Followers' },
  { id: 'streak', label: 'Streak' },
]

const CHART_STYLE = {
  contentStyle: {
    background: 'var(--bg-card)', border: '1px solid var(--border-light)',
    borderRadius: 8, fontSize: '0.78rem', color: 'var(--text-primary)',
  },
  cursor: { fill: 'rgba(255,255,255,0.03)' },
}

const COLORS = ['#f7b731', '#3d7a6f', '#fd9644', '#45aaf2', '#26de81', '#8854d0', '#fc5c65', '#2bcbba']

// ── Podium Card ──────────────────────────────────────────────────────────────
function PodiumCard({ user, rank, metric }) {
  if (!user) return <div />
  const gold = rank === 1
  return (
    <div className="glass-card" style={{
      padding: '20px 16px', textAlign: 'center',
      border: gold ? '2px solid var(--accent-gold)' : '1px solid var(--border-light)',
      marginTop: gold ? 0 : 20, position: 'relative',
      background: gold ? 'linear-gradient(135deg, rgba(247,183,49,0.06), transparent)' : undefined,
    }}>
      {gold && (
        <div style={{ position: 'absolute', top: -16, left: '50%', transform: 'translateX(-50%)', fontSize: '1.8rem' }}>👑</div>
      )}
      <div style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        width: 28, height: 28, borderRadius: 99, fontSize: '0.72rem', fontWeight: 800, marginBottom: 10,
        background: rank === 1 ? 'var(--accent-gold)' : rank === 2 ? '#adb5bd' : '#cd7f32',
        color: '#fff',
      }}>#{rank}</div>
      {user.avatar_url ? (
        <img src={user.avatar_url} alt={user.name} style={{
          width: gold ? 68 : 52, height: gold ? 68 : 52, borderRadius: '50%',
          objectFit: 'cover', border: `3px solid ${gold ? 'var(--accent-gold)' : 'var(--border-light)'}`,
          margin: '0 auto 10px', display: 'block',
        }} />
      ) : (
        <div className="avatar-placeholder" style={{
          width: gold ? 68 : 52, height: gold ? 68 : 52,
          borderRadius: '50%', margin: '0 auto 10px',
          fontSize: gold ? '1.2rem' : '1rem',
        }}>
          {getInitials(user.name || '')}
        </div>
      )}
      <Link to={`/users/${user.id}`} style={{ textDecoration: 'none' }}>
        <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--text-primary)', marginBottom: 2 }}>
          {user.name}
        </div>
      </Link>
      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: 8 }}>
        {user.location || '—'}
      </div>
      <div style={{
        fontFamily: 'Space Grotesk', fontWeight: 800, fontSize: '1.4rem',
        color: gold ? 'var(--accent-gold)' : 'var(--accent-primary)',
      }}>
        {formatNumber(user[metric] || 0)}
      </div>
      <div style={{ fontSize: '0.68rem', color: 'var(--text-faint)' }}>
        {METRIC_OPTS.find(m => m.id === metric)?.label}
      </div>
    </div>
  )
}

// ── Main Component ───────────────────────────────────────────────────────────
export default function LeaderboardPage() {
  const { user: currentUser } = useAuth()
  const [boardTab, setBoardTab] = useState('global')
  const [metric, setMetric] = useState('score')
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState(null)
  const [followingMap, setFollowingMap] = useState({})
  const headerRef = useRef(null)
  const pollRef = useRef(null)

  const sortUsers = useCallback((arr, m) =>
    [...arr].sort((a, b) => (b[m] || 0) - (a[m] || 0)), [])

  const fetchLeaderboard = useCallback(async (tab = boardTab) => {
    try {
      const fn = tab === 'global'
        ? leaderboardService.getGlobal
        : leaderboardService.getNetwork
      const { data } = await fn()
      const arr = Array.isArray(data) && data.length > 0 ? data : MOCK_LEADERBOARD_USERS
      setUsers(sortUsers(arr, metric))
      setLastUpdated(new Date())
    } catch {
      setUsers(sortUsers(MOCK_LEADERBOARD_USERS, metric))
      setLastUpdated(new Date())
    } finally {
      setLoading(false)
    }
  }, [boardTab, metric, sortUsers])

  // Initial load
  useEffect(() => {
    setLoading(true)
    fetchLeaderboard(boardTab)
  }, [boardTab]) // eslint-disable-line

  // Re-sort when metric changes without refetch
  useEffect(() => {
    setUsers(prev => sortUsers(prev, metric))
  }, [metric, sortUsers])

  // Poll every 60s
  useEffect(() => {
    pollRef.current = setInterval(() => fetchLeaderboard(boardTab), 60000)
    return () => clearInterval(pollRef.current)
  }, [boardTab, fetchLeaderboard])

  // GSAP entry animations
  useEffect(() => {
    if (!loading && headerRef.current) {
      gsap.fromTo(headerRef.current, { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' })
      gsap.fromTo('.lb-row', { x: -24, opacity: 0 }, { x: 0, opacity: 1, stagger: 0.04, duration: 0.4, ease: 'power3.out', delay: 0.1 })
    }
  }, [loading, users])

  const topThree = users.slice(0, 3)
  const rest = users.slice(3)

  // ── Chart data ──────────────────────────────────────────────────────────
  const barData = users.slice(0, 8).map(u => ({
    name: (u.name || 'Dev').split(' ')[0],
    value: u[metric] || 0,
  }))

  const radarMetrics = ['leetcode', 'codeforces', 'github_stars', 'followers', 'posts', 'streak']
  const radarData = radarMetrics.map(m => {
    const max = Math.max(...users.map(u => u[m] || 1), 1)
    const entry = { metric: m.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase()) }
    topThree.forEach(u => {
      entry[(u.name || 'Dev').split(' ')[0]] = Math.round(((u[m] || 0) / max) * 100)
    })
    return entry
  })

  // Pie data: score distribution of top 8
  const pieData = users.slice(0, 8).map((u, i) => ({
    name: (u.name || 'Dev').split(' ')[0],
    value: u[metric] || 0,
    fill: COLORS[i % COLORS.length],
  }))

  // Streak leaderboard line
  const streakData = users.slice(0, 10).map(u => ({
    name: (u.name || 'Dev').split(' ')[0],
    streak: u.streak || 0,
    score: u.score || 0,
  }))

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null
    return (
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-light)', borderRadius: 8, padding: '8px 12px', fontSize: '0.8rem' }}>
        <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>{label}</div>
        {payload.map((p, i) => (
          <div key={i} style={{ color: p.color || 'var(--accent-primary)' }}>
            {p.name}: <strong>{formatNumber(p.value)}</strong>
          </div>
        ))}
      </div>
    )
  }

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}>
      <div className="spinner" style={{ width: 32, height: 32, borderWidth: 3 }} />
    </div>
  )

  return (
    <div className="responsive-padding" style={{ maxWidth: 1020, margin: '0 auto', padding: '24px 20px 100px' }}>

      {/* ── Header ── */}
      <div ref={headerRef} style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{
              width: 48, height: 48, borderRadius: 14,
              background: 'linear-gradient(135deg, var(--accent-gold), var(--accent-warm))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Trophy size={24} color="#fff" />
            </div>
            <div>
              <h1 style={{ fontFamily: 'Space Grotesk', fontWeight: 800, fontSize: '1.8rem', letterSpacing: '-0.02em' }}>
                Leaderboard
              </h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>Compete. Grow. Dominate.</p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {lastUpdated && (
              <span style={{ fontSize: '0.72rem', color: 'var(--text-faint)' }}>
                Updated {lastUpdated.toLocaleTimeString()}
              </span>
            )}
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => { setLoading(true); fetchLeaderboard(boardTab) }}
              style={{ display: 'flex', alignItems: 'center', gap: 6 }}
            >
              <RefreshCw size={13} /> Refresh
            </button>
          </div>
        </div>
      </div>

      {/* ── Board Tabs ── */}
      <div className="tabs-bar" style={{ marginBottom: 20 }}>
        {BOARD_TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            className={`tab-item${boardTab === id ? ' active' : ''}`}
            onClick={() => setBoardTab(id)}
            style={{ display: 'flex', alignItems: 'center', gap: 6, border: 'none', background: 'none', cursor: 'pointer' }}
          >
            <Icon size={14} /> {label}
          </button>
        ))}
      </div>

      {/* ── Metric Selector ── */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 28 }}>
        {METRIC_OPTS.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setMetric(id)}
            style={{
              padding: '6px 14px', borderRadius: 'var(--radius-full)', fontSize: '0.78rem', fontWeight: 600, border: '1px solid',
              borderColor: metric === id ? 'var(--accent-primary)' : 'var(--border-light)',
              background: metric === id ? 'rgba(61,122,111,0.12)' : 'var(--bg-card)',
              color: metric === id ? 'var(--accent-primary)' : 'var(--text-muted)',
              cursor: 'pointer', transition: 'all var(--duration-fast)',
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ── Top 3 Podium ── */}
      {topThree.length > 0 && (
        <div style={{ marginBottom: 32 }}>
          <div className="responsive-podium">
            {[topThree[1], topThree[0], topThree[2]].map((u, i) => {
              const rank = i === 0 ? 2 : i === 1 ? 1 : 3
              return <PodiumCard key={u?.id || i} user={u} rank={rank} metric={metric} />
            })}
          </div>
        </div>
      )}

      {/* ── Charts Row 1: Bar + Pie ── */}
      <div className="responsive-grid-2" style={{ marginBottom: 20 }}>
        {/* Bar chart */}
        <div className="glass-card" style={{ padding: 20 }}>
          <h3 style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '0.92rem', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <BarChart3 size={15} color="var(--accent-primary)" />
            Top 8 — {METRIC_OPTS.find(m => m.id === metric)?.label}
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={barData} barSize={22}>
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 11 }} />
              <YAxis hide />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" radius={[5, 5, 0, 0]}>
                {barData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie chart — score share */}
        <div className="glass-card" style={{ padding: 20 }}>
          <h3 style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '0.92rem', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Award size={15} color="var(--accent-gold)" />
            Score Distribution
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%" cy="50%"
                innerRadius={55} outerRadius={80}
                paddingAngle={3}
                dataKey="value"
              >
                {pieData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
              </Pie>
              <Tooltip formatter={(v) => formatNumber(v)} />
              <Legend iconSize={8} wrapperStyle={{ fontSize: '0.72rem' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── Charts Row 2: Radar + Streak Area ── */}
      <div className="responsive-grid-2" style={{ marginBottom: 28 }}>
        {/* Radar comparison — top 3 */}
        <div className="glass-card" style={{ padding: 20 }}>
          <h3 style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '0.92rem', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <TrendingUp size={15} color="var(--triton-2)" />
            Top 3 Multi-Metric Radar
          </h3>
          {topThree.length >= 2 ? (
            <ResponsiveContainer width="100%" height={220}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="var(--border-medium)" />
                <PolarAngleAxis dataKey="metric" tick={{ fill: 'var(--text-muted)', fontSize: 9 }} />
                {topThree.map((u, i) => (
                  <Radar
                    key={u.id}
                    dataKey={(u.name || 'Dev').split(' ')[0]}
                    stroke={COLORS[i]}
                    fill={COLORS[i]}
                    fillOpacity={0.1}
                    strokeWidth={2}
                  />
                ))}
                <Legend iconSize={8} wrapperStyle={{ fontSize: '0.73rem' }} />
                <Tooltip content={<CustomTooltip />} />
              </RadarChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              Need at least 2 users
            </div>
          )}
        </div>

        {/* Streak area chart */}
        <div className="glass-card" style={{ padding: 20 }}>
          <h3 style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '0.92rem', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Flame size={15} color="#fc5c65" />
            Streak & Score (Top 10)
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={streakData}>
              <defs>
                <linearGradient id="streakGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#fc5c65" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#fc5c65" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--accent-primary)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="var(--accent-primary)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="var(--border-light)" strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fill: 'var(--text-muted)', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="streak" stroke="#fc5c65" fill="url(#streakGrad)" strokeWidth={2} name="Streak (days)" />
              <Legend iconSize={8} wrapperStyle={{ fontSize: '0.73rem' }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── Full Rankings Table ── */}
      <div className="responsive-table-wrapper">
        <div className="glass-card" style={{ overflow: 'hidden', minWidth: 600 }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', gap: 8 }}>
          <BarChart3 size={16} color="var(--accent-primary)" />
          <h3 style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '0.95rem' }}>Full Rankings</h3>
          <span style={{ marginLeft: 'auto', fontSize: '0.72rem', color: 'var(--text-faint)' }}>{users.length} developers</span>
        </div>

        {/* Table header */}
        <div style={{
          display: 'grid', gridTemplateColumns: '56px 1fr 110px 100px 100px 90px',
          padding: '10px 20px', background: 'var(--bg-overlay)', borderBottom: '1px solid var(--border-light)',
        }}>
          {['Rank', 'Developer', 'XP', 'LeetCode', 'Streak', 'Posts'].map(h => (
            <span key={h} style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{h}</span>
          ))}
        </div>

        {users.map((u, i) => {
          const isMe = currentUser?.id === u.id
          return (
            <div
              key={u.id}
              className="lb-row"
              style={{
                display: 'grid', gridTemplateColumns: '56px 1fr 110px 100px 100px 90px',
                padding: '11px 20px', borderBottom: '1px solid var(--border-light)',
                background: isMe ? 'rgba(61,122,111,0.07)' : 'transparent',
                opacity: 0, transition: 'background 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = isMe ? 'rgba(61,122,111,0.1)' : 'var(--bg-overlay)'}
              onMouseLeave={e => e.currentTarget.style.background = isMe ? 'rgba(61,122,111,0.07)' : 'transparent'}
            >
              {/* Rank */}
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  width: 28, height: 28, borderRadius: 8, fontSize: '0.72rem', fontWeight: 800,
                  background: i === 0 ? 'var(--accent-gold)' : i === 1 ? '#adb5bd' : i === 2 ? '#cd7f32' : 'var(--bg-overlay)',
                  color: i < 3 ? '#fff' : 'var(--text-muted)',
                }}>
                  {i + 1}
                </span>
              </div>

              {/* Developer info */}
              <Link to={`/users/${u.id}`} style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', minWidth: 0 }}>
                {u.avatar_url ? (
                  <img src={u.avatar_url} alt={u.name} style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover', border: '1.5px solid var(--border-accent)', flexShrink: 0 }} />
                ) : (
                  <div className="avatar-placeholder" style={{ width: 32, height: 32, borderRadius: '50%', fontSize: '0.65rem', flexShrink: 0 }}>
                    {getInitials(u.name || '')}
                  </div>
                )}
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {u.name || 'Unknown'}
                    {isMe && <span style={{ marginLeft: 6, fontSize: '0.62rem', padding: '1px 6px', background: 'rgba(61,122,111,0.2)', color: 'var(--accent-primary)', borderRadius: 4, fontWeight: 700 }}>You</span>}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {u.location || '—'}
                  </div>
                </div>
              </Link>

              {/* XP/Score */}
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-gold)', alignSelf: 'center' }}>
                {formatNumber(u.score || 0)}
              </span>

              {/* LeetCode */}
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.83rem', color: '#FFA116', alignSelf: 'center' }}>
                {u.leetcode || u.leetcode_solved || '—'}
              </span>

              {/* Streak */}
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.83rem', color: '#fc5c65', alignSelf: 'center' }}>
                🔥 {u.streak || 0}d
              </span>

              {/* Posts */}
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.83rem', color: 'var(--text-secondary)', alignSelf: 'center' }}>
                {u.posts || 0}
              </span>
            </div>
          )
        })}

        {users.length === 0 && (
          <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--text-muted)' }}>
            <Users size={40} style={{ margin: '0 auto 16px', opacity: 0.2 }} />
            <p>{boardTab === 'network' ? 'Follow some developers to see your network leaderboard!' : 'No data available.'}</p>
          </div>
        )}
        </div>
      </div>
    </div>
  )
}
