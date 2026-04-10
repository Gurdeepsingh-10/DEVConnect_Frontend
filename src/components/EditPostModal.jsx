import React, { useState } from 'react'
import { postService } from '../services'
import toast from 'react-hot-toast'
import { X, Send } from 'lucide-react'

const MAX = 500

export default function EditPostModal({ post, onSave, onClose }) {
  const [content, setContent] = useState(post.content || '')
  const [loading, setLoading] = useState(false)
  const isOver = content.length > MAX

  const handleSave = async () => {
    if (!content.trim() || isOver) return
    setLoading(true)
    try {
      await postService.editPost(post.id, content.trim())
      onSave({ ...post, content: content.trim() })
    } catch {
      onSave({ ...post, content: content.trim() }) // mock
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="modal-content" style={{ padding: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <h2 style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '1.1rem' }}>Edit Post</h2>
          <button className="btn btn-ghost btn-icon" onClick={onClose}><X size={18} /></button>
        </div>
        <textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          className="input-field"
          style={{ minHeight: 160, resize: 'vertical', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: 16 }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.78rem', color: isOver ? 'var(--accent-rose)' : 'var(--text-muted)' }}>
            {MAX - content.length} chars remaining
          </span>
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn btn-secondary btn-sm" onClick={onClose}>Cancel</button>
            <button className="btn btn-primary btn-sm" onClick={handleSave} disabled={loading || isOver || !content.trim()} style={{ gap: 8 }}>
              {loading ? <div className="spinner" style={{ width: 14, height: 14, borderWidth: 2 }} /> : <Send size={14} />}
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
