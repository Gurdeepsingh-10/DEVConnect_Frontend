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
