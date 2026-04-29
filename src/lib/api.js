const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

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

// Players
export const getPlayers = (gender) =>
  apiFetch(`/players${gender ? `?gender=${gender}` : ''}`);

export const createPlayer = (data) =>
  apiFetch('/players', { method: 'POST', body: JSON.stringify(data) });

export const updatePlayer = (id, data) =>
  apiFetch(`/players/${id}`, { method: 'PUT', body: JSON.stringify(data) });

export const deletePlayer = (id) =>
  apiFetch(`/players/${id}`, { method: 'DELETE' });

// Matches
export const getMatches = (params = {}) => {
  const query = new URLSearchParams(params).toString();
  return apiFetch(`/matches${query ? `?${query}` : ''}`);
};

export const generateMatches = (matchType) =>
  apiFetch('/matches/generate', { method: 'POST', body: JSON.stringify({ matchType }) });

export const updateMatchResult = (id, data) =>
  apiFetch(`/matches/${id}/result`, { method: 'PUT', body: JSON.stringify(data) });

export const advanceMatches = (matchType, round) =>
  apiFetch('/matches/advance', { method: 'POST', body: JSON.stringify({ matchType, round }) });

export const clearMatches = (matchType) =>
  apiFetch(`/matches/clear${matchType ? `?matchType=${matchType}` : ''}`, { method: 'DELETE' });

// Leaderboard
export const getLeaderboard = () => apiFetch('/leaderboard');

// Admin Auth
export const adminLogin = (password) =>
  apiFetch('/admin/login', { method: 'POST', body: JSON.stringify({ password }) });
