import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  Home, TrendingUp, Search, Bell, User, Settings,
  LogOut, Trophy, Sun, Moon, Menu, X, Code2
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { getInitials } from '../utils'
import LiveSessionsPanel from './LiveSessionsPanel'

const NAV_LINKS = [
  { path: '/feed', label: 'Feed', icon: Home },
const NAV_LINKS = [
  { path: '/feed', label: 'Feed', icon: Home },
  { path: '/trending', label: 'Trending', icon: TrendingUp },
  { path: '/search', label: 'Search', icon: Search },
  { path: '/leaderboard', label: 'Leaderboard', icon: Trophy },
]

export default function Sidebar({ mobileOpen, onClose }) {
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const location = useLocation()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 'calc(var(--z-sticky) - 1)',
            background: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(4px)',
          }}
          onClick={onClose}
        />
      )}

      <aside
        className={`sidebar${mobileOpen ? ' open' : ''}`}
        style={{ zIndex: 'var(--z-sticky)' }}
      >
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', height: '100%', overflowY: 'auto', overflowX: 'hidden' }}>

          {/* Brand */}
          <div style={{
            padding: '20px 20px 16px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            borderBottom: '1px solid var(--border-light)',
          }}>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: 'linear-gradient(135deg, var(--triton-2), var(--triton-1))',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <span style={{ fontFamily: 'Space Grotesk', fontWeight: 800, fontSize: '0.95rem', color: '#fff' }}>dc</span>
              </div>
              <span style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                DevConnect
              </span>
            </Link>
            <button className="btn btn-ghost btn-icon" onClick={onClose} id="sidebar-close" style={{ display: 'none' }}>
              <X size={18} />
            </button>
          </div>

          {/* User Card */}
          {user && (
            <Link to={`/users/${user.id}`} style={{ textDecoration: 'none' }}>
              <div style={{
                margin: '16px 12px',
                padding: '14px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-light)',
                background: 'var(--bg-overlay)',
                display: 'flex', alignItems: 'center', gap: 12,
                transition: 'background var(--duration-fast)',
                cursor: 'pointer',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(61,122,111,0.08)'}
              onMouseLeave={e => e.currentTarget.style.background = 'var(--bg-overlay)'}
              >
                {user.avatar_url ? (
                  <img src={user.avatar_url} alt={user.name} className="avatar avatar-md" />
                ) : (
                  <div className="avatar-placeholder avatar-md">
                    {getInitials(user.name)}
                  </div>
                )}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {user.name}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {user.email}
                  </div>
                </div>
              </div>
            </Link>
          )}

          {/* Nav Links */}
          <nav style={{ flex: 1, padding: '0 12px', display: 'flex', flexDirection: 'column', gap: 2 }}>
            <div className="section-label" style={{ padding: '8px 8px 6px', marginTop: 4 }}>Navigation</div>
            {NAV_LINKS.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={`nav-link${location.pathname === path ? ' active' : ''}`}
                onClick={onClose}
              >
                <Icon size={18} />
                <span>{label}</span>
              </Link>
            ))}

            <div className="section-label" style={{ padding: '16px 8px 6px' }}>Account</div>
            <Link
              to={user ? `/users/${user.id}` : '/login'}
              className={`nav-link${location.pathname.startsWith('/users') ? ' active' : ''}`}
              onClick={onClose}
            >
              <User size={18} />
              <span>Profile</span>
            </Link>
            <Link
              to="/settings"
              className={`nav-link${location.pathname === '/settings' ? ' active' : ''}`}
              onClick={onClose}
            >
              <Settings size={18} />
              <span>Settings</span>
            </Link>
          </nav>

          {/* Mobile extra panels - Live & Trending shown inside collapsible sidebar */}
          <div id="mobile-sidebar-panels" style={{ padding: '16px 12px 0', display: 'none' }}>
            <div style={{ marginBottom: 16 }}>
              <LiveSessionsPanel />
            </div>
            
            <div className="glass-card" style={{ padding: 16 }}>
              <div style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '0.85rem', marginBottom: 12 }}>🔥 Trending Tags</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {['LeetCode', 'Go', 'System Design', 'TypeScript', 'Open Source', 'Rust', 'AI', 'Competitive'].map(t => (
                  <span key={t} className="skill-tag" style={{ fontSize: '0.72rem', cursor: 'pointer' }}>{t}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom actions */}
          <div style={{ padding: '12px', borderTop: '1px solid var(--border-light)' }}>
            <button
              className="nav-link"
              style={{ width: '100%', border: 'none', background: 'none', cursor: 'pointer', color: 'var(--accent-rose)' }}
              onClick={handleLogout}
            >
              <LogOut size={18} />
              <span>Log out</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}
