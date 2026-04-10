import api, { BASE_URL } from './api'

// ── Auth ──────────────────────────────────────────────────────────────────
export const authService = {
  getGoogleLoginUrl: () => {
    const redirectUrl = `${window.location.origin}/auth/callback`
    return `${BASE_URL}/auth/google?redirect_url=${encodeURIComponent(redirectUrl)}`
  },
  getCurrentUser: () => api.get('/me'),
  logout: () => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('authUser')
  },
}

// ── Users ─────────────────────────────────────────────────────────────────
export const userService = {
  getUserById: (id) => api.get(`/users/${id}`),
  updateProfile: (data) => api.put('/profile', data),
  getUserPosts: (id) => api.get(`/users/${id}/posts`),
  searchBySkill: (skill) => api.get(`/search?skill=${encodeURIComponent(skill)}`),
  getUserStats: (id) => api.get(`/users/${id}/stats`),
  getUserDNA: (id) => api.get(`/users/${id}/dna`),
}

// ── Platform Integrations ─────────────────────────────────────────────────
export const platformService = {
  // platforms: github | leetcode | codechef | codeforces | medium | gfg | hackerrank
  linkPlatform: (platform, username, access_token = '') =>
    api.post(`/integrations/${platform}/link`, { username, access_token }),
}

// ── Posts ─────────────────────────────────────────────────────────────────
export const postService = {
  createPost: (content) => api.post('/posts', { content }),
  getAllPosts: (page = 1, limit = 10) => api.get(`/posts?page=${page}&limit=${limit}`),
  editPost: (id, content) => api.put(`/posts/${id}`, { content }),
  deletePost: (id) => api.delete(`/posts/${id}`),
  getTrending: () => api.get('/trending'),
  getFeed: (page = 1, limit = 10) => api.get(`/feed?page=${page}&limit=${limit}`),
  getAdvancedFeed: () => api.get('/feed/live'),
  getExtendedPosts: (type = '', tag = '') => api.get(`/posts/advanced?type=${type}&tag=${tag}`),
}

// ── Likes ─────────────────────────────────────────────────────────────────
export const likeService = {
  likePost: (postId) => api.post(`/posts/${postId}/like`),
  unlikePost: (postId) => api.delete(`/posts/${postId}/like`),
  getLikes: (postId) => api.get(`/posts/${postId}/likes`),
}

// ── Comments ──────────────────────────────────────────────────────────────
export const commentService = {
  addComment: (postId, content) => api.post(`/posts/${postId}/comment`, { content }),
  getComments: (postId) => api.get(`/posts/${postId}/comments`),
  deleteComment: (commentId) => api.delete(`/comments/${commentId}`),
}

// ── Follow ────────────────────────────────────────────────────────────────
export const followService = {
  follow: (userId) => api.post(`/follow/${userId}`),
  unfollow: (userId) => api.delete(`/follow/${userId}`),
  getFollowers: (userId) => api.get(`/followers/${userId}`),
  getFollowing: (userId) => api.get(`/following/${userId}`),
  isFollowing: (userId) => api.get(`/follow/${userId}/status`),
}

// ── Leaderboard ───────────────────────────────────────────────────────────
export const leaderboardService = {
  getGlobal: () => api.get('/leaderboard/global'),
  getNetwork: () => api.get('/leaderboard/network'),
}

// ── Notifications ─────────────────────────────────────────────────────────
export const notificationService = {
  getAll: () => api.get('/notifications'),
  markRead: (id) => api.put(`/notifications/${id}/read`),
}

// ── AI / DNA ──────────────────────────────────────────────────────────────
export const aiService = {
  analyzeDNA: () => api.post('/users/me/analyze-dna'),
  getDNA: (userId) => api.get(`/users/${userId}/dna`),
}

// ── Live Sessions ─────────────────────────────────────────────────────────
export const sessionService = {
  startSession: (title, description, stream_url = '') =>
    api.post('/sessions', { title, description, stream_url }),
  getLiveSessions: () => api.get('/sessions/live'),
}
