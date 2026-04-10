// ─────────────────────────────────────────────────────────────────────────────
// DevConnect V2 — Complete Mock Data
// ─────────────────────────────────────────────────────────────────────────────

// Contribution calendar generator
function generateContributions() {
  const weeks = []
  for (let w = 0; w < 53; w++) {
    const days = []
    for (let d = 0; d < 7; d++) {
      const r = Math.random()
      const count = r < 0.25 ? 0 : r < 0.55 ? Math.floor(Math.random() * 3) + 1
        : r < 0.8 ? Math.floor(Math.random() * 8) + 3 : Math.floor(Math.random() * 15) + 8
      days.push(count)
    }
    weeks.push(days)
  }
  return weeks
}

// Rating history generator
function generateRatingHistory(base, length = 12) {
  const result = []
  let val = base
  for (let i = 0; i < length; i++) {
    val += Math.floor((Math.random() - 0.4) * 60)
    val = Math.max(800, val)
    const month = new Date(2025, i + 1, 1).toLocaleString('default', { month: 'short' })
    result.push({ month, rating: val })
  }
  return result
}

// ── Coding Stats ──────────────────────────────────────────────────────────
export const MOCK_CODING_STATS = {
  leetcode: {
    username: 'dev_user',
    solved: 487,
    total: 2800,
    easy: 210,
    medium: 220,
    hard: 57,
    ranking: 34291,
    streak: 28,
    acceptanceRate: 68.4,
    contestRating: 1842,
    contestHistory: [
      { contest: 'Round 384', rank: 412, rating: 1810 },
      { contest: 'Round 385', rank: 298, rating: 1842 },
      { contest: 'Round 386', rank: 560, rating: 1820 },
      { contest: 'Round 387', rank: 201, rating: 1865 },
      { contest: 'Round 388', rank: 380, rating: 1842 },
    ],
    recentSubmissions: [
      { title: 'Two Sum', difficulty: 'Easy', status: 'Accepted', date: '2026-04-08' },
      { title: 'Merge K Sorted Lists', difficulty: 'Hard', status: 'Accepted', date: '2026-04-07' },
      { title: 'Graph BFS', difficulty: 'Medium', status: 'Accepted', date: '2026-04-06' },
      { title: 'Longest Palindrome', difficulty: 'Medium', status: 'Wrong Answer', date: '2026-04-05' },
      { title: 'Minimum Window Substring', difficulty: 'Hard', status: 'Accepted', date: '2026-04-04' },
    ],
    badges: ['50 Days Badge', '100 Problems', 'Daily Streak'],
    tagProgress: [
      { tag: 'Dynamic Programming', solved: 89, total: 210 },
      { tag: 'Graph', solved: 67, total: 145 },
      { tag: 'Tree', solved: 78, total: 160 },
      { tag: 'Binary Search', solved: 56, total: 98 },
      { tag: 'Two Pointer', solved: 45, total: 80 },
      { tag: 'Backtracking', solved: 34, total: 72 },
    ],
  },
  codechef: {
    username: 'dev_user_cc',
    rating: 1842,
    stars: 4,
    globalRank: 18240,
    countryRank: 1204,
    problemsSolved: 312,
    longestStreak: 45,
    currentStreak: 12,
    contests: 28,
    ratingHistory: generateRatingHistory(1600, 10),
  },
  codeforces: {
    handle: 'dev_user_cf',
    rating: 1650,
    maxRating: 1724,
    rank: 'Expert',
    contributions: 0,
    problemsSolved: 540,
    contests: 42,
    ratingHistory: generateRatingHistory(1200, 12),
    problemsByRating: [
      { rating: '800', solved: 80 },
      { rating: '900', solved: 75 },
      { rating: '1000', solved: 68 },
      { rating: '1100', solved: 60 },
      { rating: '1200', solved: 90 },
      { rating: '1300', solved: 70 },
      { rating: '1400', solved: 52 },
      { rating: '1500', solved: 32 },
      { rating: '1600', solved: 24 },
      { rating: '1700', solved: 8 },
    ],
  },
  github: {
    username: 'devuser',
    followers: 120,
    following: 85,
    publicRepos: 34,
    stars: 412,
    totalCommits: 2840,
    topLanguages: [
      { name: 'TypeScript', percent: 38, color: '#3178c6' },
      { name: 'Python', percent: 27, color: '#3572A5' },
      { name: 'Go', percent: 18, color: '#00ADD8' },
      { name: 'Rust', percent: 12, color: '#dea584' },
      { name: 'Shell', percent: 5, color: '#89e051' },
    ],
    contributionCalendar: generateContributions(),
    commitsByDay: [
      { day: 'Mon', commits: 12 }, { day: 'Tue', commits: 19 },
      { day: 'Wed', commits: 8 }, { day: 'Thu', commits: 22 },
      { day: 'Fri', commits: 15 }, { day: 'Sat', commits: 6 },
      { day: 'Sun', commits: 4 },
    ],
    commitsByHour: Array.from({ length: 24 }, (_, h) => ({
      hour: `${h}:00`,
      commits: h >= 9 && h <= 18 ? Math.floor(Math.random() * 20) + 5 : Math.floor(Math.random() * 5),
    })),
    pinnedRepos: [
      { name: 'devconnect-api', stars: 134, forks: 28, lang: 'Go', color: '#00ADD8', desc: 'REST API for DevConnect social platform' },
      { name: 'algo-viz', stars: 89, forks: 14, lang: 'TypeScript', color: '#3178c6', desc: 'Algorithm visualization tool' },
      { name: 'ml-toolkit', stars: 78, forks: 11, lang: 'Python', color: '#3572A5', desc: 'ML utilities for quick prototyping' },
      { name: 'rust-parser', stars: 56, forks: 8, lang: 'Rust', color: '#dea584', desc: 'Fast JSON/CSV parser in Rust' },
    ],
    monthlyCommits: [
      { month: 'May', commits: 89 }, { month: 'Jun', commits: 124 },
      { month: 'Jul', commits: 98 }, { month: 'Aug', commits: 145 },
      { month: 'Sep', commits: 112 }, { month: 'Oct', commits: 167 },
      { month: 'Nov', commits: 134 }, { month: 'Dec', commits: 78 },
      { month: 'Jan', commits: 201 }, { month: 'Feb', commits: 156 },
      { month: 'Mar', commits: 189 }, { month: 'Apr', commits: 210 },
    ],
  },
  medium: {
    username: '@devuser',
    followers: 2840,
    articles: 34,
    totalClaps: 18420,
    recentArticles: [
      { title: 'Building a Production-Ready Go API', claps: 2400, reads: 8900, date: '2026-03-15' },
      { title: 'Rust vs Go: Which to Choose in 2026', claps: 1800, reads: 6700, date: '2026-02-28' },
      { title: 'Deep Dive into React Server Components', claps: 1200, reads: 4200, date: '2026-02-10' },
    ],
  },
  gfg: {
    username: 'devuser_gfg',
    score: 3240,
    problemsSolved: 412,
    rank: 'Institute Rank #12',
    streak: 23,
  },
  hackerrank: {
    username: 'devuser_hr',
    stars: 5,
    badges: ['Problem Solving (Gold)', 'Python (Silver)', 'SQL (Gold)', 'Rest API (Silver)'],
    score: 1840,
    rank: 'Gold',
  },
}

// ── Developer Stats (from /users/{id}/stats) ─────────────────────────────
export const MOCK_DEV_STATS = {
  user_id: 'mock',
  total_xp: 18420,
  current_streak: 28,
  github_commits: 2840,
  leetcode_solved: 487,
  codeforces_rating: 1650,
  collaboration_score: 74,
  reputation_score: 8.6,
}

// ── DNA Profile ───────────────────────────────────────────────────────────
export const MOCK_DNA = {
  primary_archetype: 'The Architect',
  coding_style_summary: 'You are a systems-thinker who values clean abstractions and performance. You tend to reach for strongly-typed languages and favor well-structured, testable codebases over rapid prototyping.',
  top_strengths: 'Backend Systems,Algorithm Optimization,Open Source Contribution,Technical Writing',
  suggested_career_paths: 'Staff Engineer,Developer Advocate,Open Source Maintainer,Systems Architect',
  skills_radar: [
    { skill: 'Algorithms', score: 88 },
    { skill: 'System Design', score: 82 },
    { skill: 'Backend', score: 91 },
    { skill: 'Frontend', score: 64 },
    { skill: 'DevOps', score: 72 },
    { skill: 'ML/AI', score: 55 },
  ],
}

// ── Leaderboard Users ─────────────────────────────────────────────────────
export const MOCK_LEADERBOARD_USERS = [
  { id: '1', name: 'Arjun Sharma', avatar: null, initials: 'AS', location: 'Bangalore', skills: ['Go', 'Kubernetes'], leetcode: 892, codeforces: 2100, github_stars: 1240, followers: 340, score: 4820, streak: 142, posts: 89 },
  { id: '2', name: 'Priya Nair', avatar: null, initials: 'PN', location: 'Mumbai', skills: ['TypeScript', 'React'], leetcode: 756, codeforces: 1980, github_stars: 980, followers: 295, score: 4410, streak: 98, posts: 112 },
  { id: '3', name: 'Rishabh Jain', avatar: null, initials: 'RJ', location: 'Chennai', skills: ['Rust', 'WebAssembly'], leetcode: 812, codeforces: 1860, github_stars: 870, followers: 260, score: 4180, streak: 76, posts: 67 },
  { id: '4', name: 'Anika Verma', avatar: null, initials: 'AV', location: 'Delhi', skills: ['Python', 'ML'], leetcode: 698, codeforces: 1750, github_stars: 760, followers: 220, score: 3940, streak: 65, posts: 94 },
  { id: '5', name: 'Dev Patel', avatar: null, initials: 'DP', location: 'Pune', skills: ['Java', 'Spring'], leetcode: 645, codeforces: 1680, github_stars: 640, followers: 198, score: 3620, streak: 54, posts: 78 },
  { id: '6', name: 'Sneha Kumar', avatar: null, initials: 'SK', location: 'Hyderabad', skills: ['Kotlin', 'Android'], leetcode: 590, codeforces: 1620, github_stars: 580, followers: 175, score: 3340, streak: 42, posts: 55 },
  { id: '7', name: 'Karan Mehta', avatar: null, initials: 'KM', location: 'Ahmedabad', skills: ['C++', 'OpenCV'], leetcode: 530, codeforces: 1560, github_stars: 520, followers: 155, score: 3090, streak: 38, posts: 48 },
  { id: '8', name: 'Tanvi Reddy', avatar: null, initials: 'TR', location: 'Kolkata', skills: ['Swift', 'iOS'], leetcode: 487, codeforces: 1490, github_stars: 460, followers: 140, score: 2850, streak: 31, posts: 42 },
]

// ── Posts ─────────────────────────────────────────────────────────────────
export const MOCK_POSTS = [
  {
    id: 1, user_id: '1',
    user: { name: 'Arjun Sharma', initials: 'AS' },
    content: 'Just cracked a hard DP problem on LeetCode — "Edit Distance". Key insight: think about the subproblems recursively, then flip it to tabulation. Time: O(m*n), Space: O(n) with rolling array.',
    created_at: new Date(Date.now() - 3600000).toISOString(),
    likes: 42, comments: 8, liked: false, score: 108,
    tags: ['LeetCode', 'DP', 'Go'],
  },
  {
    id: 2, user_id: '2',
    user: { name: 'Priya Nair', initials: 'PN' },
    content: 'Open-sourced my new TypeScript library for managing complex form state with Zod validation 🎉 It auto-infers types from your schema and gives you dead-simple hooks.',
    created_at: new Date(Date.now() - 7200000).toISOString(),
    likes: 87, comments: 14, liked: true, score: 216,
    tags: ['TypeScript', 'OpenSource', 'React'],
  },
  {
    id: 3, user_id: '3',
    user: { name: 'Rishabh Jain', initials: 'RJ' },
    content: 'Achievement unlocked: 600-day streak on Codeforces 🔥 The secret? Even on my worst days I solve at least one problem. Consistency beats intensity every single time.',
    created_at: new Date(Date.now() - 14400000).toISOString(),
    likes: 134, comments: 22, liked: false, score: 334,
    tags: ['Codeforces', 'Streak', 'Competitive'],
  },
]

// ── Live Sessions ─────────────────────────────────────────────────────────
export const MOCK_LIVE_SESSIONS = [
  { id: 1, host_id: '1', title: '🔴 Live: Grinding DP Problems', description: 'Solving LeetCode hard problems for 2 hours', status: 'active', created_at: new Date(Date.now() - 1200000).toISOString(), host: { name: 'Arjun Sharma', initials: 'AS' } },
  { id: 2, host_id: '2', title: '🟢 Building a TypeScript Library', description: 'Form state management with generics', status: 'active', created_at: new Date(Date.now() - 3600000).toISOString(), host: { name: 'Priya Nair', initials: 'PN' } },
]

// ── Notifications ─────────────────────────────────────────────────────────
export const MOCK_NOTIFICATIONS = [
  { id: 1, type: 'like', message: 'Arjun Sharma liked your post about DP problems', created_at: new Date(Date.now() - 1800000).toISOString(), read: false },
  { id: 2, type: 'follow', message: 'Priya Nair started following you', created_at: new Date(Date.now() - 3600000).toISOString(), read: false },
  { id: 3, type: 'comment', message: 'Rishabh Jain commented: "Great explanation!"', created_at: new Date(Date.now() - 7200000).toISOString(), read: true },
  { id: 4, type: 'like', message: 'Dev Patel liked your comment', created_at: new Date(Date.now() - 14400000).toISOString(), read: true },
]

// ── Skill Suggestions ─────────────────────────────────────────────────────
export const SKILL_SUGGESTIONS = [
  'JavaScript', 'TypeScript', 'Python', 'Go', 'Rust', 'Java', 'C++', 'Kotlin',
  'Swift', 'React', 'Vue', 'Angular', 'Node.js', 'Django', 'FastAPI', 'Spring',
  'Docker', 'Kubernetes', 'AWS', 'GCP', 'ML', 'Deep Learning', 'WebAssembly',
  'Solidity', 'Flutter', 'Ruby', 'Scala', 'Elixir', 'GraphQL', 'Redis',
]

// ── Supported Platforms ───────────────────────────────────────────────────
export const PLATFORMS = [
  { id: 'github', label: 'GitHub', icon: '🐙', color: '#333', placeholder: 'your-github-username', desc: 'Repos, commits, stars, contributions' },
  { id: 'leetcode', label: 'LeetCode', icon: '🧩', color: '#FFA116', placeholder: 'leetcode-username', desc: 'Problems solved, contest rating, streak' },
  { id: 'codeforces', label: 'Codeforces', icon: '⚡', color: '#1194F6', placeholder: 'codeforces-handle', desc: 'Rating, rank, contest history' },
  { id: 'codechef', label: 'CodeChef', icon: '🍴', color: '#5b4638', placeholder: 'codechef-username', desc: 'Stars, rating, global rank' },
  { id: 'medium', label: 'Medium', icon: '✍️', color: '#000000', placeholder: '@your-medium-handle', desc: 'Articles, followers, total claps' },
  { id: 'gfg', label: 'GeeksForGeeks', icon: '🟢', color: '#2F8D46', placeholder: 'gfg-username', desc: 'Score, problems, institute rank' },
  { id: 'hackerrank', label: 'HackerRank', icon: '🏅', color: '#00EA64', placeholder: 'hackerrank-username', desc: 'Badges, stars, certifications' },
  { id: 'atcoder', label: 'AtCoder', icon: '🇯🇵', color: '#222222', placeholder: 'atcoder-username', desc: 'Rating, contest performance' },
  { id: 'kaggle', label: 'Kaggle', icon: '📊', color: '#20BEFF', placeholder: 'kaggle-username', desc: 'Notebooks, competitions, medals' },
]

// ── Archetype colors / icons ──────────────────────────────────────────────
export const ARCHETYPES = {
  'The Architect': { emoji: '🏛️', color: '#5b8dee', desc: 'Systems thinker who builds clean abstractions' },
  'The Algorithmic Ninja': { emoji: '⚡', color: '#f7b731', desc: 'Masters complex algorithms and data structures' },
  'The Open Source Evangelist': { emoji: '🌍', color: '#26de81', desc: 'Believes in collaborative, transparent development' },
  'The Full Stack Wizard': { emoji: '🧙', color: '#8854d0', desc: 'Comfortable across the entire software stack' },
  'The ML Pioneer': { emoji: '🧠', color: '#fd9644', desc: 'Pushing the boundaries of AI and machine learning' },
  'The DevOps Artisan': { emoji: '🛠️', color: '#45aaf2', desc: 'Infrastructure, reliability, and automation expert' },
}
