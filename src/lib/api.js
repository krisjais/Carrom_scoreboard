const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// ── In-memory cache ──────────────────────────────────
// Stores { data, timestamp } per cache key
const cache = new Map();
const CACHE_TTL = 30 * 1000; // 30 seconds

function getCached(key) {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.timestamp > CACHE_TTL) { cache.delete(key); return null; }
  return entry.data;
}

function setCached(key, data) {
  cache.set(key, { data, timestamp: Date.now() });
}

export function invalidateCache(pattern) {
  for (const key of cache.keys()) {
    if (key.includes(pattern)) cache.delete(key);
  }
}

// ── In-flight deduplication ──────────────────────────
// If the same GET is already in-flight, reuse the same promise
const inFlight = new Map();

// ── Core fetch ───────────────────────────────────────
async function apiFetch(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(error.error || 'API request failed');
  }
  return res.json();
}

// GET with cache + deduplication
async function apiGet(endpoint) {
  const cached = getCached(endpoint);
  if (cached) return cached;

  // Deduplicate in-flight requests
  if (inFlight.has(endpoint)) return inFlight.get(endpoint);

  const promise = apiFetch(endpoint)
    .then(data => { setCached(endpoint, data); inFlight.delete(endpoint); return data; })
    .catch(err  => { inFlight.delete(endpoint); throw err; });

  inFlight.set(endpoint, promise);
  return promise;
}

// ── Prefetch ─────────────────────────────────────────
// Call this to warm the cache before the user navigates
export function prefetch(matchType) {
  const key = `/matches${matchType ? `?matchType=${matchType}` : ''}`;
  if (!getCached(key)) apiGet(key).catch(() => {});
}

export function prefetchAll() {
  apiGet('/players').catch(() => {});
  apiGet('/matches').catch(() => {});
  apiGet('/leaderboard').catch(() => {});
  ['single', 'double', 'mixed'].forEach(t => {
    apiGet(`/matches?matchType=${t}`).catch(() => {});
  });
}

// ── Players ──────────────────────────────────────────
export const getPlayers = (gender) =>
  apiGet(`/players${gender ? `?gender=${gender}` : ''}`);

export const createPlayer = async (data) => {
  const result = await apiFetch('/players', { method: 'POST', body: JSON.stringify(data) });
  invalidateCache('/players');
  return result;
};

export const updatePlayer = async (id, data) => {
  const result = await apiFetch(`/players/${id}`, { method: 'PUT', body: JSON.stringify(data) });
  invalidateCache('/players');
  return result;
};

export const deletePlayer = async (id) => {
  const result = await apiFetch(`/players/${id}`, { method: 'DELETE' });
  invalidateCache('/players');
  return result;
};

// ── Matches ──────────────────────────────────────────
export const getMatches = (params = {}) => {
  const query = new URLSearchParams(params).toString();
  return apiGet(`/matches${query ? `?${query}` : ''}`);
};

export const generateMatches = async (matchType) => {
  const result = await apiFetch('/matches/generate', { method: 'POST', body: JSON.stringify({ matchType }) });
  invalidateCache('/matches');
  return result;
};

export const updateMatchResult = async (id, data) => {
  let result;
  if (data.type === 'board') {
    const { type, ...boardData } = data;
    result = await apiFetch(`/matches/${id}/board`, { method: 'PUT', body: JSON.stringify(boardData) });
  } else if (data.status === 'live' && data.firstStrike) {
    result = await apiFetch(`/matches/${id}/live`, { method: 'PUT', body: JSON.stringify({ firstStrike: data.firstStrike }) });
  } else {
    result = await apiFetch(`/matches/${id}/result`, { method: 'PUT', body: JSON.stringify(data) });
  }
  invalidateCache('/matches');
  return result;
};

export const advanceMatches = async (matchType, round) => {
  const result = await apiFetch('/matches/advance', { method: 'POST', body: JSON.stringify({ matchType, round }) });
  invalidateCache('/matches');
  return result;
};

export const clearMatches = async (matchType) => {
  const result = await apiFetch(`/matches/clear${matchType ? `?matchType=${matchType}` : ''}`, { method: 'DELETE' });
  invalidateCache('/matches');
  return result;
};

// ── Leaderboard ──────────────────────────────────────
export const getLeaderboard = (type = 'single') => apiGet(`/leaderboard?type=${type}`);
export const getAllLeaderboards = () => apiGet('/leaderboard?type=all');

// ── Admin ────────────────────────────────────────────
export const adminLogin = (password) =>
  apiFetch('/admin/login', { method: 'POST', body: JSON.stringify({ password }) });

export const getMatchRules = () => apiGet('/matches/rules');

// Teams (manual pairing for doubles/mixed)
export const getTeams = (matchType) =>
  apiGet(`/teams${matchType ? `?matchType=${matchType}` : ''}`);

export const createTeam = async (playerIds, matchType) => {
  const result = await apiFetch('/teams', { method: 'POST', body: JSON.stringify({ playerIds, matchType }) });
  invalidateCache('/teams');
  return result;
};

export const deleteTeam = async (id) => {
  const result = await apiFetch(`/teams/${id}`, { method: 'DELETE' });
  invalidateCache('/teams');
  return result;
};

export const generateMatchesFromTeams = async (matchType) => {
  const result = await apiFetch('/teams/generate-matches', { method: 'POST', body: JSON.stringify({ matchType }) });
  invalidateCache('/matches');
  return result;
};
