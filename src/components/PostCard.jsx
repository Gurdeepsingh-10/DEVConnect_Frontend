import React, { useState, useEffect, useRef } from 'react'
import { Heart, MessageCircle, MoreHorizontal, Trash2, Edit3, Link2, Bookmark } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { likeService, commentService, postService } from '../services'
import { formatRelativeTime, getInitials, truncate } from '../utils'
import { gsap } from 'gsap'
import CommentSection from './CommentSection'
import toast from 'react-hot-toast'

export default function PostCard({ post, onDelete, onEdit }) {
  const { user } = useAuth()
  const [liked, setLiked] = useState(post.liked || false)
  const [likeCount, setLikeCount] = useState(post.likes || 0)
  const [showComments, setShowComments] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [isFollowing, setIsFollowing] = useState(false)
  const heartRef = useRef(null)
  const cardRef = useRef(null)
  const isOwner = user?.id === post.user_id

  const content = post.content || ''
  const isLong = content.length > 280

  useEffect(() => {
    gsap.fromTo(cardRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }
    )
  }, [])

  const handleLike = async () => {
    const newLiked = !liked
    setLiked(newLiked)
    setLikeCount(c => newLiked ? c + 1 : c - 1)

    // Heart pop animation
    gsap.timeline()
      .to(heartRef.current, { scale: 1.5, duration: 0.15, ease: 'power2.out' })
      .to(heartRef.current, { scale: 1, duration: 0.25, ease: 'elastic.out(1.5, 0.5)' })

    try {
      if (newLiked) await likeService.likePost(post.id)
      else await likeService.unlikePost(post.id)
    } catch {
      setLiked(!newLiked)
      setLikeCount(c => newLiked ? c - 1 : c + 1)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Delete this post?')) return
    try {
      await postService.deletePost(post.id)
      onDelete?.(post.id)
      toast.success('Post deleted')
    } catch {
      toast.error('Failed to delete post')
    }
  }

  const displayUser = post.user || { name: 'Developer', initials: 'DV' }

  return (
    <article ref={cardRef} className="post-card" style={{ opacity: 0 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
        <Link to={`/users/${post.user_id}`} style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none' }}>
          {displayUser.avatar_url ? (
            <img src={displayUser.avatar_url} alt={displayUser.name} className="avatar avatar-md" />
          ) : (
            <div className="avatar-placeholder avatar-md" style={{ fontSize: '0.78rem' }}>
              {displayUser.initials || getInitials(displayUser.name)}
            </div>
          )}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)', lineHeight: 1.3 }}>
              {displayUser.name}
              {!isOwner && !isFollowing && (
                <>
                  <span style={{ color: 'var(--text-muted)' }}>·</span>
                  <button 
                    onClick={(e) => { 
                      e.preventDefault(); 
                      setIsFollowing(true); 
                      toast.success(`Following ${displayUser.name}`); 
                    }} 
                    style={{ color: 'var(--accent-primary)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem', padding: 0 }}
                  >
                    Follow
                  </button>
                </>
              )}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              {formatRelativeTime(post.created_at)}
            </div>
          </div>
        </Link>

        {/* Menu */}
        <div style={{ position: 'relative' }}>
          <button
            className="btn btn-ghost btn-icon btn-sm"
            onClick={() => setShowMenu(s => !s)}
          >
            <MoreHorizontal size={16} />
          </button>
          {showMenu && (
            <div style={{
              position: 'absolute', right: 0, top: '100%', marginTop: 4,
              background: 'var(--bg-card)',
              border: '1px solid var(--border-light)',
              borderRadius: 'var(--radius-md)',
              boxShadow: 'var(--shadow-lg)',
              minWidth: 160,
              zIndex: 50,
              animation: 'scaleIn 0.15s var(--ease-out-expo)',
              overflow: 'hidden',
            }}>
              <button
                className="btn btn-ghost"
                style={{ width: '100%', justifyContent: 'flex-start', gap: 10, padding: '10px 14px', borderRadius: 0 }}
                onClick={() => { navigator.clipboard.writeText(window.location.href); setShowMenu(false); toast.success('Link copied!') }}
              >
                <Link2 size={15} /> Copy link
              </button>
              {isOwner && (
                <>
                  <button
                    className="btn btn-ghost"
                    style={{ width: '100%', justifyContent: 'flex-start', gap: 10, padding: '10px 14px', borderRadius: 0 }}
                    onClick={() => { setShowMenu(false); onEdit?.(post) }}
                  >
                    <Edit3 size={15} /> Edit post
                  </button>
                  <button
                    className="btn btn-ghost"
                    style={{ width: '100%', justifyContent: 'flex-start', gap: 10, padding: '10px 14px', borderRadius: 0, color: 'var(--accent-rose)' }}
                    onClick={() => { setShowMenu(false); handleDelete() }}
                  >
                    <Trash2 size={15} /> Delete post
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Tags */}
      {post.tags?.length > 0 && (
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
          {post.tags.map(t => (
            <span key={t} className="skill-tag" style={{ fontSize: '0.72rem', padding: '2px 8px' }}>
              #{t}
            </span>
          ))}
        </div>
      )}

      {/* Content */}
      <div style={{
        fontSize: '0.9rem',
        lineHeight: 1.75,
        color: 'var(--text-secondary)',
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word',
        fontFamily: content.includes('\n') && content.match(/[{}();]/) ? 'var(--font-mono)' : 'var(--font-sans)',
      }}>
        {isLong && !expanded ? truncate(content, 280) : content}
      </div>
      {isLong && (
        <button
          className="btn btn-ghost"
          style={{ padding: '4px 0', fontSize: '0.82rem', color: 'var(--accent-primary)', marginTop: 4 }}
          onClick={() => setExpanded(e => !e)}
        >
          {expanded ? 'Show less' : 'Read more'}
        </button>
      )}

      {/* Engagement score */}
      {post.score > 0 && (
        <div style={{
          marginTop: 12,
          padding: '6px 10px',
          background: 'rgba(61,122,111,0.07)',
          borderRadius: 'var(--radius-sm)',
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          fontSize: '0.75rem',
          color: 'var(--accent-primary)',
          fontWeight: 600,
        }}>
          <span>⚡</span> Engagement score: {post.score}
        </div>
      )}

      {/* Actions */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 4,
        marginTop: 16,
        paddingTop: 14,
        borderTop: '1px solid var(--border-light)',
      }}>
        {/* Like */}
        <button
          className={`btn btn-ghost btn-sm like-btn${liked ? ' liked' : ''}`}
          style={{ gap: 7, color: liked ? '#e05a6a' : 'var(--text-muted)' }}
          onClick={handleLike}
        >
          <Heart
            ref={heartRef}
            size={17}
            className="like-icon"
            fill={liked ? '#e05a6a' : 'none'}
            strokeWidth={2}
          />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', fontWeight: 600 }}>
            {likeCount}
          </span>
        </button>

        {/* Comment toggle */}
        <button
          className="btn btn-ghost btn-sm"
          style={{ gap: 7, color: showComments ? 'var(--accent-primary)' : 'var(--text-muted)' }}
          onClick={() => setShowComments(s => !s)}
        >
          <MessageCircle size={17} strokeWidth={2} />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', fontWeight: 600 }}>
            {post.comments || 0}
          </span>
        </button>

        <div style={{ flex: 1 }} />

        <button className="btn btn-ghost btn-sm" style={{ color: 'var(--text-muted)' }}>
          <Bookmark size={16} />
        </button>
      </div>

      {/* Comments */}
      {showComments && (
        <div style={{ marginTop: 16, borderTop: '1px solid var(--border-light)', paddingTop: 16 }}>
          <CommentSection postId={post.id} />
        </div>
      )}

      {/* Close menu on outside click */}
      {showMenu && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 40 }} onClick={() => setShowMenu(false)} />
      )}
    </article>
  )
}
