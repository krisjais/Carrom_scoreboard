'use client';
import { useState } from 'react';
import { User, Users, HeartHandshake, Trophy, Play, Crown, Target, X } from 'lucide-react';
import MatchTimer from './MatchTimer';

/* ── Inline Modal ─────────────────────────────────── */
function InlineModal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(6,11,24,0.85)', backdropFilter: 'blur(8px)' }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full max-w-sm rounded-2xl overflow-hidden animate-fade-in"
        style={{ background: '#16161E', border: '1px solid rgba(201,168,76,0.2)', boxShadow: '0 24px 64px rgba(0,0,0,0.6)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4"
          style={{ borderBottom: '1px solid #1E1E2A', background: '#111118' }}>
          <p className="text-[14px] font-bold" style={{ color: '#F4F4F6' }}>{title}</p>
          <button onClick={onClose} className="p-1.5 rounded-lg transition-colors"
            style={{ color: '#4A4A5E' }}
            onMouseEnter={e => e.currentTarget.style.color = '#F4F4F6'}
            onMouseLeave={e => e.currentTarget.style.color = '#4A4A5E'}>
            <X size={15} />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

/* ── Main MatchCard ───────────────────────────────── */
export default function MatchCard({ match, onUpdateResult, showActions = false }) {
  const isSingle = match.matchType === 'single';

  const getName = (entity, model) => {
    if (!entity) return 'BYE';
    if (model === 'Player' || isSingle) return entity.name || 'Unknown';
    if (entity.players?.length > 0) return entity.players.map(p => p.name || 'Unknown').join(' & ');
    return 'Team';
  };

  const nameA = getName(match.teamA, match.teamAModel);
  const nameB = getName(match.teamB, match.teamBModel);
  const isWinnerA = match.winner && match.teamA && match.winner === match.teamA._id;
  const isWinnerB = match.winner && match.teamB && match.winner === match.teamB._id;
  const statusClass = match.status === 'live' ? 'live' : match.status === 'completed' ? 'completed' : '';

  return (
    <div className={`match-card ${statusClass}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className={`badge badge-${match.status}`}>
            {match.status === 'live' && (
              <span className="w-1.5 h-1.5 rounded-full inline-block pulse-badge" style={{ background: '#F87171' }} />
            )}
            {match.status}
          </span>
          {match.isBye && (
            <span className="badge" style={{ background: 'rgba(245,158,11,0.1)', color: '#FCD34D', border: '1px solid rgba(245,158,11,0.2)' }}>BYE</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {match.boards && match.boards.length > 0 && (
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded"
              style={{ background: 'rgba(201,168,76,0.1)', color: '#C9A84C', border: '1px solid rgba(201,168,76,0.2)' }}>
              Board {match.boards.length}
            </span>
          )}
          <span className="text-[11px] tabular-nums" style={{ color: '#6B8FAD' }}>
            R{match.round} · M{match.bracketPosition + 1}
          </span>
        </div>
      </div>

      {/* Players + Score */}
      <div className="flex items-stretch gap-2">
        <div className="flex-1 flex flex-col items-center justify-center py-4 px-3 rounded-xl text-center"
          style={{ background: isWinnerA ? 'rgba(34,197,94,0.07)' : 'rgba(255,255,255,0.02)', border: `1px solid ${isWinnerA ? 'rgba(34,197,94,0.2)' : 'rgba(255,255,255,0.05)'}` }}>
          {isWinnerA && <Crown size={11} className="mb-1" style={{ color: '#4ADE80' }} />}
          <p className="text-[13px] font-semibold leading-tight" style={{ color: isWinnerA ? '#4ADE80' : '#F0F4FF' }}>{nameA}</p>
          {match.status !== 'upcoming' && (
            <p className="text-[26px] font-black mt-1.5 leading-none" style={{ background: 'linear-gradient(135deg, #C9A84C, #FFD97D)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              {match.scoreA ?? 0}
            </p>
          )}
          {match.boardsWonA > 0 && <p className="text-[10px] mt-1" style={{ color: '#C9A84C' }}>{match.boardsWonA} board{match.boardsWonA > 1 ? 's' : ''}</p>}
        </div>

        <div className="flex flex-col items-center justify-center flex-shrink-0">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-[9px] font-black"
            style={{ background: 'linear-gradient(135deg, #A8832A, #C9A84C)', color: '#060C18', boxShadow: '0 2px 10px rgba(201,168,76,0.3)' }}>
            VS
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center py-4 px-3 rounded-xl text-center"
          style={{ background: isWinnerB ? 'rgba(34,197,94,0.07)' : 'rgba(255,255,255,0.02)', border: `1px solid ${isWinnerB ? 'rgba(34,197,94,0.2)' : 'rgba(255,255,255,0.05)'}` }}>
          {match.isBye ? (
            <p className="text-[12px] italic" style={{ color: '#6B8FAD' }}>BYE</p>
          ) : (
            <>
              {isWinnerB && <Crown size={11} className="mb-1" style={{ color: '#4ADE80' }} />}
              <p className="text-[13px] font-semibold leading-tight" style={{ color: isWinnerB ? '#4ADE80' : '#F0F4FF' }}>{nameB}</p>
              {match.status !== 'upcoming' && (
                <p className="text-[26px] font-black mt-1.5 leading-none" style={{ background: 'linear-gradient(135deg, #C9A84C, #FFD97D)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                  {match.scoreB ?? 0}
                </p>
              )}
              {match.boardsWonB > 0 && <p className="text-[10px] mt-1" style={{ color: '#C9A84C' }}>{match.boardsWonB} board{match.boardsWonB > 1 ? 's' : ''}</p>}
            </>
          )}
        </div>
      </div>

      {/* Timer + Progress bar */}
      {match.status === 'live' && (
        <div className="mt-3 space-y-2">
          <MatchTimer
            matchType={match.matchType}
            startedAt={match.startedAt}
            status={match.status}
          />
          <div>
            <div className="flex justify-between text-[10px] mb-1" style={{ color: '#6B8FAD' }}>
              <span>{match.scoreA}/25 pts · {match.boardsWonA}/8 boards</span>
              <span>{match.scoreB}/25 pts · {match.boardsWonB}/8 boards</span>
            </div>
            <div className="flex gap-0.5 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
              <div style={{ width: `${Math.min((match.scoreA / 25) * 50, 50)}%`, background: 'linear-gradient(90deg, #C9A84C, #FFD97D)', transition: 'width 0.3s' }} />
              <div style={{ flex: 1 }} />
              <div style={{ width: `${Math.min((match.scoreB / 25) * 50, 50)}%`, background: 'linear-gradient(270deg, #C9A84C, #FFD97D)', transition: 'width 0.3s' }} />
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="mt-3 pt-3 flex items-center justify-between" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <span className="text-[10px] flex items-center gap-1.5" style={{ color: '#6B8FAD' }}>
          {match.matchType === 'single' ? <><User size={11} /> Singles</> : match.matchType === 'double' ? <><Users size={11} /> Doubles</> : <><HeartHandshake size={11} /> Mixed</>}
          {match.genderGroup && match.genderGroup !== 'open' && <span>· {match.genderGroup}</span>}
        </span>
        {match.status === 'completed' && <span className="text-[10px] flex items-center gap-1 font-semibold" style={{ color: '#4ADE80' }}><Trophy size={10} /> Done</span>}
        {match.firstStrike && match.status === 'live' && (
          <span className="text-[10px]" style={{ color: '#C9A84C' }}>First: {match.firstStrike === 'A' ? nameA.split(' ')[0] : nameB.split(' ')[0]}</span>
        )}
      </div>

      {showActions && !match.isBye && match.status !== 'completed' && onUpdateResult && (
        <div className="mt-3 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <AdminActions match={match} onUpdateResult={onUpdateResult} nameA={nameA} nameB={nameB} />
        </div>
      )}
    </div>
  );
}

/* ── Admin Actions with in-app modals ─────────────── */
function AdminActions({ match, onUpdateResult, nameA, nameB }) {
  const [tossOpen, setTossOpen]   = useState(false);
  const [boardOpen, setBoardOpen] = useState(false);
  const [overrideOpen, setOverrideOpen] = useState(false);

  // Board form state
  const [coinsLeftA, setCoinsLeftA] = useState(0);
  const [coinsLeftB, setCoinsLeftB] = useState(0);
  const [queen, setQueen]           = useState('none');
  const [foulsA, setFoulsA]         = useState(0);
  const [foulsB, setFoulsB]         = useState(0);

  // Override state
  const [overScoreA, setOverScoreA] = useState(match.scoreA || 0);
  const [overScoreB, setOverScoreB] = useState(match.scoreB || 0);

  function handleToss(winner) {
    setTossOpen(false);
    onUpdateResult(match._id, { status: 'live', firstStrike: winner });
  }

  function handleBoardSubmit() {
    setBoardOpen(false);
    // Calculate remaining seconds from the timer
    const DURATIONS = { single: 10 * 60, double: 15 * 60, mixed: 15 * 60 };
    const total     = DURATIONS[match.matchType] || 600;
    const started   = match.startedAt ? new Date(match.startedAt).getTime() : Date.now();
    const elapsed   = Math.floor((Date.now() - started) / 1000);
    const remaining = Math.max(0, total - elapsed);

    onUpdateResult(match._id, {
      type: 'board',
      coinsLeftA:      Number(coinsLeftA),
      coinsLeftB:      Number(coinsLeftB),
      queenCoveredBy:  queen === 'none' ? null : queen,
      foulsA:          Number(foulsA),
      foulsB:          Number(foulsB),
      remainingSeconds: remaining,
    });
    setCoinsLeftA(0); setCoinsLeftB(0); setQueen('none'); setFoulsA(0); setFoulsB(0);
  }

  function handleOverride(winnerId) {
    setOverrideOpen(false);
    onUpdateResult(match._id, { winner: winnerId, scoreA: Number(overScoreA), scoreB: Number(overScoreB), status: 'completed' });
  }

  return (
    <>
      {/* ── Set Live button ── */}
      {match.status === 'upcoming' && (
        <button onClick={() => setTossOpen(true)}
          className="btn-secondary w-full text-[12px] flex items-center justify-center gap-2 py-2.5">
          <Play size={13} /> Set Live — Record Toss
        </button>
      )}

      {/* ── Live actions ── */}
      {match.status === 'live' && (
        <div className="space-y-2">
          <button onClick={() => setBoardOpen(true)}
            className="btn-primary w-full text-[12px] flex items-center justify-center gap-2 py-2.5">
            <Target size={13} /> Submit Board Result
          </button>

          <div className="rounded-lg p-3 text-[11px]" style={{ background: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.15)' }}>
            <p className="font-semibold mb-1.5" style={{ color: '#C9A84C' }}>Scoring Rules</p>
            <div className="space-y-0.5 mb-2" style={{ color: '#6B8FAD' }}>
              <p>🪙 Coin = <strong style={{ color: '#F4F4F6' }}>10 pts</strong> &nbsp;·&nbsp; 👑 Queen = <strong style={{ color: '#EF4444' }}>50 pts</strong> &nbsp;·&nbsp; ⏱ /min = <strong style={{ color: '#4ADE80' }}>20 pts</strong></p>
            </div>
            <div className="flex justify-between" style={{ color: '#6B8FAD' }}>
              <span>{nameA.split(' ')[0]}: {match.scoreA}pts · {match.boardsWonA}B</span>
              <span>{nameB.split(' ')[0]}: {match.scoreB}pts · {match.boardsWonB}B</span>
            </div>
            <p className="mt-1" style={{ color: '#3D5A80' }}>First to 25 pts or 8 boards wins</p>
          </div>

          <button onClick={() => setOverrideOpen(true)}
            className="w-full text-[11px] py-2 rounded-lg transition-colors"
            style={{ color: '#4A4A5E', background: 'transparent', border: '1px solid #1E1E2A' }}
            onMouseEnter={e => { e.currentTarget.style.color = '#8B8B9E'; e.currentTarget.style.borderColor = '#2A2A3A'; }}
            onMouseLeave={e => { e.currentTarget.style.color = '#4A4A5E'; e.currentTarget.style.borderColor = '#1E1E2A'; }}>
            Manual override / declare winner
          </button>
        </div>
      )}

      {/* ══ TOSS MODAL ══ */}
      <InlineModal isOpen={tossOpen} onClose={() => setTossOpen(false)} title="Toss — Who strikes first?">
        <p className="text-[13px] mb-5" style={{ color: '#6B8FAD' }}>
          Select the player who won the toss and will strike first.
        </p>
        <div className="flex gap-3">
          <button onClick={() => handleToss('A')}
            className="flex-1 py-3 rounded-xl font-bold text-[13px] transition-all"
            style={{ background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.3)', color: '#E8C96A' }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(201,168,76,0.2)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(201,168,76,0.1)'}>
            {nameA}
          </button>
          <button onClick={() => handleToss('B')}
            className="flex-1 py-3 rounded-xl font-bold text-[13px] transition-all"
            style={{ background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.3)', color: '#E8C96A' }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(201,168,76,0.2)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(201,168,76,0.1)'}>
            {nameB}
          </button>
        </div>
      </InlineModal>

      {/* ══ BOARD RESULT MODAL ══ */}
      <InlineModal isOpen={boardOpen} onClose={() => setBoardOpen(false)} title={`Board ${(match.boards?.length || 0) + 1} Result`}>
        <div className="space-y-4">
          {/* Coins left */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider mb-1.5" style={{ color: '#4A4A5E' }}>
                {nameA.split(' ')[0]}'s coins left
              </label>
              <input type="number" min="0" max="9" value={coinsLeftA}
                onChange={e => setCoinsLeftA(e.target.value)}
                className="input-field text-center text-[15px] font-bold" />
              <p className="text-[10px] mt-1" style={{ color: '#3D5A80' }}>Scored by {nameB.split(' ')[0]}</p>
            </div>
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider mb-1.5" style={{ color: '#4A4A5E' }}>
                {nameB.split(' ')[0]}'s coins left
              </label>
              <input type="number" min="0" max="9" value={coinsLeftB}
                onChange={e => setCoinsLeftB(e.target.value)}
                className="input-field text-center text-[15px] font-bold" />
              <p className="text-[10px] mt-1" style={{ color: '#3D5A80' }}>Scored by {nameA.split(' ')[0]}</p>
            </div>
          </div>

          {/* Queen */}
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider mb-2" style={{ color: '#4A4A5E' }}>
              🔴 Queen covered by
            </label>
            <div className="flex gap-2">
              {[
                { val: 'none', label: 'Not covered' },
                { val: 'A',    label: nameA.split(' ')[0] },
                { val: 'B',    label: nameB.split(' ')[0] },
              ].map(opt => (
                <button key={opt.val} onClick={() => setQueen(opt.val)}
                  className="flex-1 py-2 rounded-lg text-[12px] font-semibold transition-all"
                  style={{
                    background: queen === opt.val ? 'rgba(201,168,76,0.15)' : 'rgba(255,255,255,0.03)',
                    border: queen === opt.val ? '1px solid rgba(201,168,76,0.4)' : '1px solid #1E1E2A',
                    color: queen === opt.val ? '#E8C96A' : '#6B8FAD',
                  }}>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Fouls */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider mb-1.5" style={{ color: '#4A4A5E' }}>
                Fouls by {nameA.split(' ')[0]}
              </label>
              <input type="number" min="0" value={foulsA}
                onChange={e => setFoulsA(e.target.value)}
                className="input-field text-center" />
            </div>
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider mb-1.5" style={{ color: '#4A4A5E' }}>
                Fouls by {nameB.split(' ')[0]}
              </label>
              <input type="number" min="0" value={foulsB}
                onChange={e => setFoulsB(e.target.value)}
                className="input-field text-center" />
            </div>
          </div>

          {/* Preview score */}
          <div className="rounded-lg p-3 text-[11px]" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid #1E1E2A' }}>
            <p className="font-semibold mb-2" style={{ color: '#4A4A5E' }}>Score preview (before time bonus)</p>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span style={{ color: '#8B8B9E' }}>{nameA.split(' ')[0]} coins scored:</span>
                <span style={{ color: '#F4F4F6' }}>{Number(coinsLeftB)} × 10 = <strong>{Number(coinsLeftB) * 10}</strong></span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: '#8B8B9E' }}>{nameB.split(' ')[0]} coins scored:</span>
                <span style={{ color: '#F4F4F6' }}>{Number(coinsLeftA)} × 10 = <strong>{Number(coinsLeftA) * 10}</strong></span>
              </div>
              {queen !== 'none' && (
                <div className="flex justify-between">
                  <span style={{ color: '#8B8B9E' }}>Queen (50 pts) → {queen === 'A' ? nameA.split(' ')[0] : nameB.split(' ')[0]}:</span>
                  <span style={{ color: '#EF4444' }}>+50</span>
                </div>
              )}
              {(Number(foulsA) > 0 || Number(foulsB) > 0) && (
                <div className="flex justify-between">
                  <span style={{ color: '#8B8B9E' }}>Fouls (−10 each):</span>
                  <span style={{ color: '#F87171' }}>
                    {nameA.split(' ')[0]}: −{Number(foulsA) * 10} · {nameB.split(' ')[0]}: −{Number(foulsB) * 10}
                  </span>
                </div>
              )}
              <div className="pt-1 mt-1 flex justify-between font-bold" style={{ borderTop: '1px solid #1E1E2A', color: '#F4F4F6' }}>
                <span>{nameA.split(' ')[0]}: {Math.max(0, Number(coinsLeftB) * 10 + (queen === 'A' ? 50 : 0) - Number(foulsA) * 10)} pts</span>
                <span>{nameB.split(' ')[0]}: {Math.max(0, Number(coinsLeftA) * 10 + (queen === 'B' ? 50 : 0) - Number(foulsB) * 10)} pts</span>
              </div>
              <p className="text-[10px] mt-1" style={{ color: '#3A3A52' }}>
                + 20 pts/min remaining will be added to the board winner (proportional for partial minutes)
              </p>
            </div>
          </div>

          <button onClick={handleBoardSubmit} className="btn-primary w-full py-3 text-[13px]">
            Submit Board Result
          </button>
        </div>
      </InlineModal>

      {/* ══ OVERRIDE MODAL ══ */}
      <InlineModal isOpen={overrideOpen} onClose={() => setOverrideOpen(false)} title="Manual Override">
        <p className="text-[12px] mb-4" style={{ color: '#6B8FAD' }}>
          Manually set scores and declare a winner.
        </p>
        <div className="flex gap-3 mb-4">
          <div className="flex-1">
            <label className="block text-[11px] font-semibold uppercase tracking-wider mb-1.5" style={{ color: '#4A4A5E' }}>
              {nameA.split(' ')[0]} Score
            </label>
            <input type="number" min="0" value={overScoreA}
              onChange={e => setOverScoreA(e.target.value)}
              className="input-field text-center text-[15px] font-bold" />
          </div>
          <div className="flex-1">
            <label className="block text-[11px] font-semibold uppercase tracking-wider mb-1.5" style={{ color: '#4A4A5E' }}>
              {nameB.split(' ')[0]} Score
            </label>
            <input type="number" min="0" value={overScoreB}
              onChange={e => setOverScoreB(e.target.value)}
              className="input-field text-center text-[15px] font-bold" />
          </div>
        </div>
        <p className="text-[11px] mb-3 font-semibold uppercase tracking-wider" style={{ color: '#4A4A5E' }}>Declare Winner</p>
        <div className="flex gap-3">
          <button onClick={() => handleOverride(match.teamA?._id)}
            className="flex-1 py-3 rounded-xl font-bold text-[13px] transition-all"
            style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.25)', color: '#4ADE80' }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(34,197,94,0.2)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(34,197,94,0.1)'}>
            {nameA.split(' ')[0]} Wins
          </button>
          <button onClick={() => handleOverride(match.teamB?._id)}
            className="flex-1 py-3 rounded-xl font-bold text-[13px] transition-all"
            style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.25)', color: '#4ADE80' }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(34,197,94,0.2)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(34,197,94,0.1)'}>
            {nameB.split(' ')[0]} Wins
          </button>
        </div>
      </InlineModal>
    </>
  );
}
