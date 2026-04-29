'use client';
import { User, Users, HeartHandshake, Play, Crown } from 'lucide-react';

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
        <span className={`badge badge-${match.status}`}>
          {match.status === 'live' && (
            <span className="w-1.5 h-1.5 rounded-full inline-block pulse-badge" style={{ background: '#F87171' }} />
          )}
          {match.status}
        </span>
        <span className="text-[11px] tabular-nums" style={{ color: '#6B8FAD' }}>
          R{match.round} · M{match.bracketPosition + 1}
        </span>
      </div>

      {/* Players */}
      <div className="flex items-center gap-2">
        {/* Side A */}
        <div
          className="flex-1 rounded-lg px-3 py-3 text-center"
          style={{
            background: isWinnerA ? 'rgba(34,197,94,0.06)' : 'rgba(255,255,255,0.02)',
            border: `1px solid ${isWinnerA ? 'rgba(34,197,94,0.2)' : '#1F1F2E'}`,
          }}
        >
          {isWinnerA && <Crown size={10} className="mx-auto mb-1" style={{ color: '#4ADE80' }} />}
          <p className="text-[13px] font-semibold leading-tight" style={{ color: isWinnerA ? '#4ADE80' : '#F4F4F6' }}>
            {nameA}
          </p>
          {match.status !== 'upcoming' && (
            <p className="text-[22px] font-bold mt-1.5 leading-none" style={{ color: isWinnerA ? '#4ADE80' : '#818CF8' }}>
              {match.scoreA ?? '—'}
            </p>
          )}
        </div>

        {/* VS */}
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center text-[9px] font-bold flex-shrink-0"
          style={{ background: '#1A2A3A', color: '#6B8FAD' }}
        >
          VS
        </div>

        {/* Side B */}
        <div
          className="flex-1 rounded-lg px-3 py-3 text-center"
          style={{
            background: isWinnerB ? 'rgba(34,197,94,0.06)' : 'rgba(255,255,255,0.02)',
            border: `1px solid ${isWinnerB ? 'rgba(34,197,94,0.2)' : '#1F1F2E'}`,
          }}
        >
          {match.isBye ? (
            <p className="text-[12px] italic" style={{ color: '#6B8FAD' }}>BYE</p>
          ) : (
            <>
              {isWinnerB && <Crown size={10} className="mx-auto mb-1" style={{ color: '#4ADE80' }} />}
              <p className="text-[13px] font-semibold leading-tight" style={{ color: isWinnerB ? '#4ADE80' : '#F4F4F6' }}>
                {nameB}
              </p>
              {match.status !== 'upcoming' && (
                <p className="text-[22px] font-bold mt-1.5 leading-none" style={{ color: isWinnerB ? '#4ADE80' : '#818CF8' }}>
                  {match.scoreB ?? '—'}
                </p>
              )}
            </>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-3 pt-3 flex items-center justify-between" style={{ borderTop: '1px solid #1F1F2E' }}>
        <span className="text-[11px] flex items-center gap-1.5" style={{ color: '#6B8FAD' }}>
          {match.matchType === 'single' ? <><User size={11} /> Singles</>
            : match.matchType === 'double' ? <><Users size={11} /> Doubles</>
            : <><HeartHandshake size={11} /> Mixed</>}
          {match.genderGroup && match.genderGroup !== 'open' && <span>· {match.genderGroup}</span>}
        </span>
        {match.isBye && <span className="badge" style={{ background: 'rgba(245,158,11,0.1)', color: '#FCD34D' }}>BYE</span>}
      </div>

      {showActions && !match.isBye && match.status !== 'completed' && onUpdateResult && (
        <div className="mt-3 pt-3" style={{ borderTop: '1px solid #1F1F2E' }}>
          <AdminActions match={match} onUpdateResult={onUpdateResult} />
        </div>
      )}
    </div>
  );
}

function AdminActions({ match, onUpdateResult }) {
  const setLive = () => onUpdateResult(match._id, { status: 'live' });
  const declareWinner = (winnerId) => {
    const scoreA = parseInt(document.getElementById(`sA-${match._id}`)?.value) || 0;
    const scoreB = parseInt(document.getElementById(`sB-${match._id}`)?.value) || 0;
    onUpdateResult(match._id, { winner: winnerId, scoreA, scoreB, status: 'completed' });
  };

  return (
    <div className="space-y-2">
      {match.status === 'upcoming' && (
        <button onClick={setLive} className="btn-secondary w-full text-[12px] flex items-center justify-center gap-2 py-2">
          <Play size={12} /> Set Live
        </button>
      )}
      {match.status === 'live' && (
        <>
          <div className="flex gap-2">
            <input id={`sA-${match._id}`} type="number" min="0" placeholder="Score A" className="input-field text-center text-[13px] py-2" defaultValue={match.scoreA} />
            <input id={`sB-${match._id}`} type="number" min="0" placeholder="Score B" className="input-field text-center text-[13px] py-2" defaultValue={match.scoreB} />
          </div>
          <div className="flex gap-2">
            <button onClick={() => declareWinner(match.teamA?._id)} className="btn-primary flex-1 text-[12px] py-2">A Wins</button>
            <button onClick={() => declareWinner(match.teamB?._id)} className="btn-primary flex-1 text-[12px] py-2">B Wins</button>
          </div>
        </>
      )}
    </div>
  );
}
