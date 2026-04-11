import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Search, Bell, Moon, Sun, Menu, Home, TrendingUp, Trophy, User } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { getInitials } from '../utils'
import { debounce } from '../utils'

export default function Header({ onMenuClick }) {
  const { user } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const location = useLocation()
  const [searchVal, setSearchVal] = useState('')

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchVal.trim()) navigate(`/search?skill=${encodeURIComponent(searchVal.trim())}`)
  }

  const bottomLinks = [
    { path: '/feed', icon: Home, label: 'Feed' },
    { path: '/trending', icon: TrendingUp, label: 'Trending' },
    { path: '/leaderboard', icon: Trophy, label: 'Board' },
    { path: user ? `/users/${user.id}` : '/login', icon: User, label: 'Me' },
  ]

  return (
    <>
      {/* Top Header */}
      <header className="header">
        {/* Hamburger (mobile/tablet) */}
        <button
          className="btn btn-ghost btn-icon"
          onClick={onMenuClick}
          style={{ display: 'none', flexShrink: 0 }}
          id="menu-btn"
        >
          <Menu size={20} />
        </button>


        {/* Search */}
        <form onSubmit={handleSearch} style={{ flex: 1, maxWidth: 440, margin: '0 auto' }}>
          <div style={{ position: 'relative' }}>
            <Search size={16} style={{
              position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
              color: 'var(--text-muted)', pointerEvents: 'none',
            }} />
            <input
              type="text"
              placeholder="Search by skills… (e.g. 'React', 'Go')"
              value={searchVal}
              onChange={e => setSearchVal(e.target.value)}
              className="input-field"
              style={{ paddingLeft: 38, paddingTop: 9, paddingBottom: 9, fontSize: '0.85rem' }}
            />
          </div>
        </form>

        {/* Right actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          <button className="btn btn-ghost btn-icon" onClick={toggleTheme} title="Toggle theme">
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Bell - mobile only, inside top bar */}
          <Link to="/notifications" id="mobile-bell" className="btn btn-ghost btn-icon" style={{ position: 'relative', display: 'none' }}>
            <Bell size={18} />
            <span style={{
              position: 'absolute', top: 4, right: 4,
              width: 8, height: 8, borderRadius: '50%',
              background: 'var(--accent-primary)',
              border: '2px solid var(--bg-primary)',
            }} />
          </Link>

          {user ? (
            <Link to={`/users/${user.id}`} style={{ textDecoration: 'none' }}>
              {user.avatar_url ? (
                <img src={user.avatar_url} alt={user.name} className="avatar avatar-sm" style={{ cursor: 'pointer' }} />
              ) : (
                <div className="avatar-placeholder avatar-sm" style={{ cursor: 'pointer', fontSize: '0.7rem' }}>
                  {getInitials(user.name)}
                </div>
              )}
            </Link>
          ) : (
            <Link to="/login" className="btn btn-primary btn-sm">Sign In</Link>
          )}
        </div>
      </header>

      {/* Mobile Bottom Nav */}
      <nav className="bottom-nav">
        {bottomLinks.map(({ path, icon: Icon, label }) => (
          <Link
            key={path}
            to={path}
            className={`bottom-nav-item${location.pathname === path || (path.startsWith('/users') && location.pathname.startsWith('/users')) ? ' active' : ''}`}
          >
            <Icon size={22} />
            <span>{label}</span>
          </Link>
        ))}
      </nav>

      {/* Responsive show/hide */}
      <style>{`
        @media (max-width: 1024px) {
          #menu-btn { display: flex !important; }
          #mobile-bell { display: flex !important; }
          #sidebar-close { display: flex !important; }
          #mobile-sidebar-panels { display: block !important; }
        }
      `}</style>
    </>
  )
}
