import React, { useState, useEffect, useRef } from 'react'
import { postService } from '../services'
import { useAuth } from '../context/AuthContext'
import PostCard from '../components/PostCard'
import PostForm from '../components/PostForm'
import EditPostModal from '../components/EditPostModal'
import LiveSessionsPanel from '../components/LiveSessionsPanel'
import { TrendingUp, Flame, Rss } from 'lucide-react'
import { MOCK_POSTS } from '../data/mockData'
import { gsap } from 'gsap'
import toast from 'react-hot-toast'

const TABS = [
  { id: 'feed', label: 'My Feed', icon: Rss },
  { id: 'all', label: 'All Posts', icon: Flame },
  { id: 'trending', label: 'Trending', icon: TrendingUp },
]

export default function FeedPage() {
  const { user } = useAuth()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('all')
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [editingPost, setEditingPost] = useState(null)
  const headerRef = useRef(null)
  const loaderRef = useRef(null)

  // Infinite Scroll Observer
  useEffect(() => {
    if (!hasMore || loading) return
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        fetchPosts(page + 1)
      }
    }, { threshold: 0.1 })
    if (loaderRef.current) observer.observe(loaderRef.current)
    return () => observer.disconnect()
  }, [hasMore, loading, page])


  useEffect(() => {
    gsap.fromTo(headerRef.current,
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }
    )
    fetchPosts(1, tab)
  }, [tab])

  const fetchPosts = async (pg = 1, activeTab = tab) => {
    setLoading(true)
    try {
      let data
      if (activeTab === 'feed') {
        const res = await postService.getFeed(pg, 10)
        data = res.data
      } else if (activeTab === 'trending') {
        const res = await postService.getTrending()
        data = res.data
      } else {
        const res = await postService.getAllPosts(pg, 10)
        data = res.data
      }
      const arr = Array.isArray(data) ? data : []
      // Attach mock user info
      const enriched = arr.map(p => ({ ...p, user: p.user || { name: 'Developer', initials: 'DV' } }))
      if (pg === 1) setPosts(enriched.length ? enriched : MOCK_POSTS)
      else setPosts(prev => [...prev, ...enriched])
      setHasMore(arr.length === 10)
      setPage(pg)
    } catch {
      if (pg === 1) setPosts(MOCK_POSTS)
      setHasMore(false)
    } finally {
      setLoading(false)
    }
  }

  const handleNewPost = (newPost) => {
    setPosts(prev => [{ ...newPost, user: { name: user?.name || 'You', initials: 'YO' }, likes: 0, comments: 0, liked: false, score: 0 }, ...prev])
  }

  const handleDeletePost = (id) => {
    setPosts(prev => prev.filter(p => p.id !== id))
  }

  const handleEditSave = (updated) => {
    setPosts(prev => prev.map(p => p.id === updated.id ? { ...p, content: updated.content } : p))
    setEditingPost(null)
    toast.success('Post updated!')
  }

  return (
    <div className="responsive-padding responsive-grid-feed" style={{ maxWidth: 1060, margin: '0 auto', padding: '24px 20px 100px', display: 'grid', gridTemplateColumns: '1fr 300px', gap: 24, alignItems: 'start' }}>
      {/* ── Left: Feed ── */}
      <div>
        <div ref={headerRef} style={{ marginBottom: 24 }}>
          <div className="tabs-bar" style={{ marginBottom: 20 }}>
            {TABS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                className={`tab-item${tab === id ? ' active' : ''}`}
                onClick={() => setTab(id)}
                style={{ display: 'flex', alignItems: 'center', gap: 6, border: 'none', background: 'none', cursor: 'pointer' }}
              >
                <Icon size={15} /> {label}
              </button>
            ))}
          </div>
          <PostForm onPost={handleNewPost} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {loading && page === 1 ? (
            Array.from({ length: 3 }).map((_, i) => <PostSkeleton key={i} />)
          ) : posts.length === 0 ? (
            <EmptyFeed tab={tab} />
          ) : (
            posts.map(post => (
              <PostCard key={post.id} post={post} onDelete={handleDeletePost} onEdit={setEditingPost} />
            ))
          )}
          {!loading && hasMore && (
            <div ref={loaderRef} style={{ height: 40 }} />
          )}
          {loading && page > 1 && (
            <div style={{ textAlign: 'center', padding: 20 }}>
              <div className="spinner" style={{ margin: '0 auto' }} />
            </div>
          )}
        </div>
      </div>

      {/* ── Right: Live Sessions + Quick Stats ── */}
      <div className="hide-on-mobile" style={{ display: 'flex', flexDirection: 'column', gap: 16, position: 'sticky', top: 24 }}>
        <LiveSessionsPanel />

        {/* Trending tags */}
        <div className="glass-card" style={{ padding: 16 }}>
          <div style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '0.85rem', marginBottom: 12 }}>🔥 Trending Tags</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {['LeetCode', 'Go', 'System Design', 'TypeScript', 'Open Source', 'Rust', 'AI', 'Competitive'].map(t => (
              <span key={t} className="skill-tag" style={{ fontSize: '0.72rem', cursor: 'pointer' }}>{t}</span>
            ))}
          </div>
        </div>
      </div>

      {editingPost && (
        <EditPostModal post={editingPost} onSave={handleEditSave} onClose={() => setEditingPost(null)} />
      )}
    </div>
  )
}

function PostSkeleton() {
  return (
    <div className="post-card">
      <div style={{ display: 'flex', gap: 12, marginBottom: 14 }}>
        <div className="skeleton" style={{ width: 44, height: 44, borderRadius: '50%', flexShrink: 0 }} />
        <div style={{ flex: 1 }}>
          <div className="skeleton" style={{ height: 14, width: '40%', marginBottom: 8 }} />
          <div className="skeleton" style={{ height: 12, width: '25%' }} />
        </div>
      </div>
      <div className="skeleton" style={{ height: 14, marginBottom: 8 }} />
      <div className="skeleton" style={{ height: 14, width: '85%', marginBottom: 8 }} />
      <div className="skeleton" style={{ height: 14, width: '65%' }} />
    </div>
  )
}

function EmptyFeed({ tab }) {
  return (
    <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
      <div style={{ fontSize: '3rem', marginBottom: 16 }}>
        {tab === 'feed' ? '📡' : tab === 'trending' ? '🔥' : '📝'}
      </div>
      <h3 style={{ marginBottom: 8, color: 'var(--text-secondary)' }}>
        {tab === 'feed' ? 'Your feed is empty' : 'No posts yet'}
      </h3>
      <p style={{ fontSize: '0.875rem' }}>
        {tab === 'feed' ? 'Follow some developers to see their posts here.' : 'Be the first to post something!'}
      </p>
    </div>
  )
}
