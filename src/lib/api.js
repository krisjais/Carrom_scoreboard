const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// ── Cache ─────────────────────────────────────────────
// Stale-while-revalidate: serve stale data instantly, refresh in background
const cache   = new Map(); // key → { data, ts }
const FRESH   = 60 * 1000;   // 60s — serve from cache, no network
const STALE   = 5 * 60 * 1000; // 5min — serve stale instantly + revalidate bg

function isFresh(ts)  { return Date.now() - ts < FRESH; }
function isStale(ts)  { return Date.now() - ts < STALE; }

function getCache(key) {
  const e = cache.get(key);
  if (!e) return { data: null, stale: false };
  if (isFresh(e.ts))  return { data: e.data, stale: false };
  if (isStale(e.ts))  return { data: e.data, stale: true };
  cache.delete(key);
  return { data: null, stale: false };
}

function setCache(key, data) {
  cache.set(key, { data, ts: Date.now() });
}

export function invalidateCache(pattern) {
  for (const key of cache.keys()) {
    if (key.includes(pattern)) cache.delete(key);
  }
}

// ── In-flight dedup ───────────────────────────────────
const inFlight = new Map();

// ── Core fetch ────────────────────────────────────────
async function apiFetch(endpoint, options = {}) {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });

  // 409 = conflict — return the data instead of throwing
  if (res.status === 409) {
    return res.json();
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || 'API request failed');
  }
  return res.json();
}

// ── GET with SWR ──────────────────────────────────────
function apiGet(endpoint, { background = false } = {}) {
  const { data, stale } = getCache(endpoint);

  // Fresh — return immediately, no network
  if (data && !stale) return Promise.resolve(data);

  // Stale — return cached data instantly, revalidate in background
  if (data && stale) {
    if (!inFlight.has(endpoint)) {
      const p = apiFetch(endpoint)
        .then(fresh => { setCache(endpoint, fresh); inFlight.delete(endpoint); return fresh; })
        .catch(() => { inFlight.delete(endpoint); });
      inFlight.set(endpoint, p);
    }
    return Promise.resolve(data); // instant return
  }

  // No cache — must wait for network (deduplicated)
  if (inFlight.has(endpoint)) return inFlight.get(endpoint);

  const p = apiFetch(endpoint)
    .then(data => { setCache(endpoint, data); inFlight.delete(endpoint); return data; })
    .catch(err  => { inFlight.delete(endpoint); throw err; });

  inFlight.set(endpoint, p);
  return p;
}

// ── Prefetch ──────────────────────────────────────────
export function prefetch(matchType) {
  const key = `/matches${matchType ? `?matchType=${matchType}` : ''}`;
  apiGet(key, { background: true });
}

export function prefetchAll() {
  [
    '/players',
    '/matches',
    '/leaderboard?type=all',
    '/matches?matchType=single',
    '/matches?matchType=double',
    '/matches?matchType=mixed',
  ].forEach(k => apiGet(k, { background: true }));
}

// ── Players ───────────────────────────────────────────
export const getPlayers = (gender) =>
  apiGet(`/players${gender ? `?gender=${gender}` : ''}`);

export const createPlayer = async (data) => {
  const r = await apiFetch('/players', { method: 'POST', body: JSON.stringify(data) });
  invalidateCache('/players');
  return r;
};

export const updatePlayer = async (id, data) => {
  const r = await apiFetch(`/players/${id}`, { method: 'PUT', body: JSON.stringify(data) });
  invalidateCache('/players');
  return r;
};

export const deletePlayer = async (id) => {
  const r = await apiFetch(`/players/${id}`, { method: 'DELETE' });
  invalidateCache('/players');
  return r;
};

// ── Matches ───────────────────────────────────────────
export const getMatches = (params = {}) => {
  const q = new URLSearchParams(params).toString();
  return apiGet(`/matches${q ? `?${q}` : ''}`);
};

export const generateMatches = async (matchType) => {
  const r = await apiFetch('/matches/generate', { method: 'POST', body: JSON.stringify({ matchType }) });
  invalidateCache('/matches');
  return r;
};

export const updateMatchResult = async (id, data) => {
  let r;
  if (data.type === 'board') {
    const { type, ...body } = data;
    r = await apiFetch(`/matches/${id}/board`, { method: 'PUT', body: JSON.stringify(body) });
  } else if (data.status === 'live' && data.firstStrike !== undefined) {
    r = await apiFetch(`/matches/${id}/live`, { method: 'PUT', body: JSON.stringify({ firstStrike: data.firstStrike }) });
  } else {
    r = await apiFetch(`/matches/${id}/result`, { method: 'PUT', body: JSON.stringify(data) });
  }
  invalidateCache('/matches');
  return r;
};

export const advanceMatches = async (matchType, round) => {
  const r = await apiFetch('/matches/advance', { method: 'POST', body: JSON.stringify({ matchType, round }) });
  invalidateCache('/matches');
  return r;
};

export const clearMatches = async (matchType) => {
  const r = await apiFetch(`/matches/clear${matchType ? `?matchType=${matchType}` : ''}`, { method: 'DELETE' });
  invalidateCache('/matches');
  return r;
};

// ── Leaderboard ───────────────────────────────────────
export const getLeaderboard    = (type = 'single') => apiGet(`/leaderboard?type=${type}`);
export const getAllLeaderboards = ()                => apiGet('/leaderboard?type=all');

// ── Admin ─────────────────────────────────────────────
export const adminLogin   = (password) =>
  apiFetch('/admin/login', { method: 'POST', body: JSON.stringify({ password }) });
export const getMatchRules = () => apiGet('/matches/rules');

// ── Teams ─────────────────────────────────────────────
export const getTeams = (matchType) =>
  apiGet(`/teams${matchType ? `?matchType=${matchType}` : ''}`);

export const createTeam = async (playerIds, matchType) => {
  const r = await apiFetch('/teams', { method: 'POST', body: JSON.stringify({ playerIds, matchType }) });
  invalidateCache('/teams');
  return r;
};

export const deleteTeam = async (id) => {
  const r = await apiFetch(`/teams/${id}`, { method: 'DELETE' });
  invalidateCache('/teams');
  return r;
};

export const generateMatchesFromTeams = async (matchType) => {
  const r = await apiFetch('/teams/generate-matches', { method: 'POST', body: JSON.stringify({ matchType }) });
  invalidateCache('/matches');
  return r;
};

export const reshuffleTeams = async (teamAId, teamBId, playerFromA, playerFromB) => {
  const r = await apiFetch('/teams/reshuffle', {
    method: 'POST',
    body: JSON.stringify({ teamAId, teamBId, playerFromA, playerFromB }),
  });
  invalidateCache('/teams');
  invalidateCache('/matches');
  return r;
};

// Resolve common player conflict before advancing
export const resolveConflict = async (matchType, round, rank2TeamId, removePlayerId, addPlayerId) => {
  const result = await apiFetch('/matches/resolve-conflict', {
    method: 'POST',
    body: JSON.stringify({ matchType, round, rank2TeamId, removePlayerId, addPlayerId }),
  });
  invalidateCache('/matches');
  invalidateCache('/teams');
  return result;
};
