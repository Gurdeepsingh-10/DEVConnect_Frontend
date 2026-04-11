import React, { useState, useEffect } from 'react'
import { postService } from '../services'

import PostCard from '../components/PostCard'
import { TrendingUp, Flame } from 'lucide-react'
import { gsap } from 'gsap'

export default function TrendingPage() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadTrending()
  }, [])

  useEffect(() => {
    if (!loading) {
      gsap.fromTo('.trending-post',
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.08, duration: 0.5, ease: 'power3.out' }
      )
    }
  }, [loading])

  const loadTrending = async () => {
    setLoading(true)
    try {
      const { data } = await postService.getTrending()
      setPosts(Array.isArray(data) ? data : [])
    } catch {
      setPosts([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="responsive-padding" style={{ maxWidth: 680, margin: '0 auto', padding: '24px 20px 100px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 28 }}>
        <div style={{
          width: 44, height: 44, borderRadius: 12,
          background: 'linear-gradient(135deg, var(--accent-warm), var(--accent-rose))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Flame size={22} color="#fff" />
        </div>
        <div>
          <h1 style={{ fontFamily: 'Space Grotesk', fontWeight: 800, fontSize: '1.6rem', letterSpacing: '-0.02em', lineHeight: 1 }}>
            Trending
          </h1>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: 3 }}>
            Top posts by engagement (likes × 2 + comments × 3)
          </p>
        </div>
      </div>

      {loading ? (
        Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="post-card skeleton" style={{ height: 180, marginBottom: 16 }} />
        ))
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {posts.map((post, i) => (
            <div key={post.id} className="trending-post" style={{ position: 'relative', opacity: 0 }}>
              {/* Rank badge */}
              <div style={{
                position: 'absolute', top: -10, left: -10,
                zIndex: 2,
              }}>
                <span className={`rank-badge rank-${i < 3 ? i + 1 : 'other'}`} style={{ width: 28, height: 28, fontSize: '0.7rem' }}>
                  #{i + 1}
                </span>
              </div>
              <PostCard post={post} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
