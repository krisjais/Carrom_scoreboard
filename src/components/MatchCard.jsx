'use client';
import { User, Users, HeartHandshake, Trophy, Play, Crown, Target, AlertCircle } from 'lucide-react';

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
          {/* ICF board count */}
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
        {/* Side A */}
        <div className="flex-1 flex flex-col items-center justify-center py-4 px-3 rounded-xl text-center"
          style={{
            background: isWinnerA ? 'rgba(34,197,94,0.07)' : 'rgba(255,255,255,0.02)',
            border: `1px solid ${isWinnerA ? 'rgba(34,197,94,0.2)' : 'rgba(255,255,255,0.05)'}`,
          }}>
          {isWinnerA && <Crown size={11} className="mb-1" style={{ color: '#4ADE80' }} />}
          <p className="text-[13px] font-semibold leading-tight" style={{ color: isWinnerA ? '#4ADE80' : '#F0F4FF' }}>{nameA}</p>
          {match.status !== 'upcoming' && (
            <p className="text-[26px] font-black mt-1.5 leading-none" style={{
              background: 'linear-gradient(135deg, #C9A84C, #FFD97D)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>{match.scoreA ?? 0}</p>
          )}
          {/* Boards won */}
          {match.boardsWonA > 0 && (
            <p className="text-[10px] mt-1" style={{ color: '#C9A84C' }}>{match.boardsWonA} board{match.boardsWonA > 1 ? 's' : ''}</p>
          )}
        </div>

        {/* VS */}
        <div className="flex flex-col items-center justify-center flex-shrink-0 gap-1">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-[9px] font-black"
            style={{ background: 'linear-gradient(135deg, #A8832A, #C9A84C)', color: '#060C18', boxShadow: '0 2px 10px rgba(201,168,76,0.3)' }}>
            VS
          </div>
        </div>

        {/* Side B */}
        <div className="flex-1 flex flex-col items-center justify-center py-4 px-3 rounded-xl text-center"
          style={{
            background: isWinnerB ? 'rgba(34,197,94,0.07)' : 'rgba(255,255,255,0.02)',
            border: `1px solid ${isWinnerB ? 'rgba(34,197,94,0.2)' : 'rgba(255,255,255,0.05)'}`,
          }}>
          {match.isBye ? (
            <p className="text-[12px] italic" style={{ color: '#6B8FAD' }}>BYE</p>
          ) : (
            <>
              {isWinnerB && <Crown size={11} className="mb-1" style={{ color: '#4ADE80' }} />}
              <p className="text-[13px] font-semibold leading-tight" style={{ color: isWinnerB ? '#4ADE80' : '#F0F4FF' }}>{nameB}</p>
              {match.status !== 'upcoming' && (
                <p className="text-[26px] font-black mt-1.5 leading-none" style={{
                  background: 'linear-gradient(135deg, #C9A84C, #FFD97D)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                }}>{match.scoreB ?? 0}</p>
              )}
              {match.boardsWonB > 0 && (
                <p className="text-[10px] mt-1" style={{ color: '#C9A84C' }}>{match.boardsWonB} board{match.boardsWonB > 1 ? 's' : ''}</p>
              )}
            </>
          )}
        </div>
      </div>

      {/* ICF win progress bar */}
      {match.status === 'live' && (
        <div className="mt-3">
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
      )}

      {/* Footer */}
      <div className="mt-3 pt-3 flex items-center justify-between" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <span className="text-[10px] flex items-center gap-1.5" style={{ color: '#6B8FAD' }}>
          {match.matchType === 'single' ? <><User size={11} /> Singles</>
            : match.matchType === 'double' ? <><Users size={11} /> Doubles</>
            : <><HeartHandshake size={11} /> Mixed</>}
          {match.genderGroup && match.genderGroup !== 'open' && <span>· {match.genderGroup}</span>}
        </span>
        {match.status === 'completed' && (
          <span className="text-[10px] flex items-center gap-1 font-semibold" style={{ color: '#4ADE80' }}>
            <Trophy size={10} /> Done
          </span>
        )}
        {match.firstStrike && match.status === 'live' && (
          <span className="text-[10px]" style={{ color: '#C9A84C' }}>
            First strike: {match.firstStrike === 'A' ? nameA : nameB}
          </span>
        )}
      </div>

      {/* Admin actions */}
      {showActions && !match.isBye && match.status !== 'completed' && onUpdateResult && (
        <div className="mt-3 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <AdminActions match={match} onUpdateResult={onUpdateResult} nameA={nameA} nameB={nameB} />
        </div>
      )}
    </div>
  );
}

function AdminActions({ match, onUpdateResult, nameA, nameB }) {
  const handleSetLive = () => {
    const firstStrike = window.confirm(`Did ${nameA} win the toss?\nOK = ${nameA} strikes first\nCancel = ${nameB} strikes first`) ? 'A' : 'B';
    onUpdateResult(match._id, { status: 'live', firstStrike });
  };

  const handleBoardResult = () => {
    const coinsLeftB = parseInt(prompt(`Coins left by ${nameB} on board (scored by ${nameA}):`, '0') || '0');
    const coinsLeftA = parseInt(prompt(`Coins left by ${nameA} on board (scored by ${nameB}):`, '0') || '0');
    const queenInput = prompt(`Who covered the Queen? Enter A, B, or leave blank for none:`, '');
    const queenCoveredBy = queenInput === 'A' ? 'A' : queenInput === 'B' ? 'B' : null;
    const foulsA = parseInt(prompt(`Fouls by ${nameA} this board:`, '0') || '0');
    const foulsB = parseInt(prompt(`Fouls by ${nameB} this board:`, '0') || '0');

    onUpdateResult(match._id, {
      type: 'board',
      coinsLeftA,
      coinsLeftB,
      queenCoveredBy,
      foulsA,
      foulsB,
    });
  };

  const handleDeclareWinner = (winnerId) => {
    const scoreA = parseInt(document.getElementById(`sA-${match._id}`)?.value) || 0;
    const scoreB = parseInt(document.getElementById(`sB-${match._id}`)?.value) || 0;
    onUpdateResult(match._id, { winner: winnerId, scoreA, scoreB, status: 'completed' });
  };

  return (
    <div className="space-y-2">
      {match.status === 'upcoming' && (
        <button onClick={handleSetLive} className="btn-secondary w-full text-[12px] flex items-center justify-center gap-2 py-2.5">
          <Play size={13} /> Set Live (Toss)
        </button>
      )}

      {match.status === 'live' && (
        <>
          {/* ICF board submission */}
          <button onClick={handleBoardResult}
            className="btn-primary w-full text-[12px] flex items-center justify-center gap-2 py-2.5">
            <Target size={13} /> Submit Board Result
          </button>

          {/* ICF progress */}
          <div className="rounded-lg p-3 text-[11px]" style={{ background: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.15)' }}>
            <p className="font-semibold mb-1" style={{ color: '#C9A84C' }}>ICF Win Conditions</p>
            <div className="flex justify-between" style={{ color: '#6B8FAD' }}>
              <span>{nameA}: {match.scoreA}pts · {match.boardsWonA} boards</span>
              <span>{nameB}: {match.scoreB}pts · {match.boardsWonB} boards</span>
            </div>
            <p className="mt-1" style={{ color: '#3D5A80' }}>First to 25 pts or 8 boards wins</p>
          </div>

          {/* Manual override */}
          <details className="mt-1">
            <summary className="text-[11px] cursor-pointer" style={{ color: '#3D5A80' }}>Manual override</summary>
            <div className="mt-2 space-y-2">
              <div className="flex gap-2">
                <input id={`sA-${match._id}`} type="number" min="0" placeholder="Score A"
                  className="input-field text-center text-[12px] py-2" defaultValue={match.scoreA} />
                <input id={`sB-${match._id}`} type="number" min="0" placeholder="Score B"
                  className="input-field text-center text-[12px] py-2" defaultValue={match.scoreB} />
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleDeclareWinner(match.teamA?._id)} className="btn-primary flex-1 text-[11px] py-2">
                  {nameA.split(' ')[0]} Wins
                </button>
                <button onClick={() => handleDeclareWinner(match.teamB?._id)} className="btn-primary flex-1 text-[11px] py-2">
                  {nameB.split(' ')[0]} Wins
                </button>
              </div>
            </div>
          </details>
        </>
      )}
    </div>
  );
}
