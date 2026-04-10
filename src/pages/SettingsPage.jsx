import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { useNavigate } from 'react-router-dom'
import EditProfileModal from '../components/EditProfileModal'
import { Settings, Sun, Moon, LogOut, Edit3, Shield, Bell, Palette } from 'lucide-react'
import toast from 'react-hot-toast'
import { getInitials } from '../utils'

export default function SettingsPage() {
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const [editOpen, setEditOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
    toast.success('Logged out successfully')
  }

  const sections = [
    {
      title: 'Profile', icon: Edit3,
      items: [
        {
          label: 'Edit Profile',
          desc: 'Update your bio, skills, location, and GitHub',
          action: () => setEditOpen(true),
          cta: 'Edit',
        },
      ],
    },
    {
      title: 'Appearance', icon: Palette,
      items: [
        {
          label: 'Theme',
          desc: `Currently using ${theme === 'dark' ? 'Dark' : 'Light'} mode`,
          action: toggleTheme,
          cta: theme === 'dark' ? (
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Sun size={15} /> Light Mode</span>
          ) : (
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Moon size={15} /> Dark Mode</span>
          ),
        },
      ],
    },
    {
      title: 'Account', icon: Shield,
      items: [
        {
          label: 'Sign Out',
          desc: 'Log out of your DevConnect account',
          action: handleLogout,
          cta: 'Sign Out',
          danger: true,
        },
      ],
    },
  ]

  return (
    <div className="responsive-padding" style={{ maxWidth: 640, margin: '0 auto', padding: '24px 20px 100px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 32 }}>
        <div style={{
          width: 44, height: 44, borderRadius: 12,
          background: 'var(--bg-overlay)',
          border: '1px solid var(--border-light)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Settings size={20} color="var(--text-secondary)" />
        </div>
        <div>
          <h1 style={{ fontFamily: 'Space Grotesk', fontWeight: 800, fontSize: '1.5rem', letterSpacing: '-0.02em', lineHeight: 1 }}>Settings</h1>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 3 }}>Manage your account preferences</p>
        </div>
      </div>

      {/* User card */}
      {user && (
        <div className="glass-card" style={{ padding: '20px', marginBottom: 28, display: 'flex', alignItems: 'center', gap: 16 }}>
          {user.avatar_url ? (
            <img src={user.avatar_url} alt={user.name} className="avatar avatar-lg" />
          ) : (
            <div className="avatar-placeholder avatar-lg" style={{ fontSize: '1.1rem' }}>
              {getInitials(user.name || 'U')}
            </div>
          )}
          <div>
            <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)' }}>{user.name}</div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: 2 }}>{user.email}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--accent-primary)', marginTop: 4, fontFamily: 'var(--font-mono)' }}>
              Joined DevConnect
            </div>
          </div>
        </div>
      )}

      {/* Settings sections */}
      {sections.map(({ title, icon: Icon, items }) => (
        <div key={title} style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <Icon size={14} color="var(--text-muted)" />
            <span className="section-label">{title}</span>
          </div>
          <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
            {items.map((item, i) => (
              <div key={item.label} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '18px 20px',
                borderBottom: i < items.length - 1 ? '1px solid var(--border-light)' : 'none',
              }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem', color: item.danger ? 'var(--accent-rose)' : 'var(--text-primary)' }}>
                    {item.label}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 2 }}>{item.desc}</div>
                </div>
                <button
                  className={`btn btn-sm ${item.danger ? 'btn-danger' : 'btn-secondary'}`}
                  onClick={item.action}
                  style={{ flexShrink: 0 }}
                >
                  {item.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}

      <p style={{ fontSize: '0.75rem', color: 'var(--text-faint)', textAlign: 'center', marginTop: 32 }}>
        DevConnect v1.0.0 — Built for developers, by developers
      </p>

      {editOpen && (
        <EditProfileModal
          user={user}
          onClose={() => setEditOpen(false)}
          onSave={() => setEditOpen(false)}
        />
      )}
    </div>
  )
}
