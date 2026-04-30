export default function RulesPage() {
  const rules = [
    {
      number: '01',
      title: 'Board & Equipment',
      icon: '🎯',
      color: '#60A5FA',
      points: [
        'Board size: 74 cm × 74 cm',
        'Striker diameter: 41–43 mm',
        'Coins: 9 White, 9 Black, 1 Red (Queen)',
      ],
    },
    {
      number: '02',
      title: 'Match Types',
      icon: '👥',
      color: '#C9A84C',
      points: [
        'Singles: 1 vs 1 player',
        'Doubles: 2 vs 2 players',
        'Mixed Doubles: 1 Male + 1 Female per team',
      ],
    },
    {
      number: '03',
      title: 'Objective',
      icon: '🏆',
      color: '#4ADE80',
      points: [
        'Score 25 points to win the match',
        'OR win 8 boards to win the match',
        'Whichever condition is met first wins',
      ],
    },
    {
      number: '04',
      title: 'Toss',
      icon: '🪙',
      color: '#F59E0B',
      points: [
        'Conduct a toss before the match',
        'Winner chooses: first strike OR color (white/black)',
        'Recorded in the system before match starts',
      ],
    },
    {
      number: '05',
      title: 'Break Shot',
      icon: '💥',
      color: '#F472B6',
      points: [
        'Striker placed on the baseline',
        'Must hit the center cluster to break',
        'Invalid break = opponent gets the turn',
      ],
    },
    {
      number: '06',
      title: 'Turn Rules',
      icon: '🔄',
      color: '#A78BFA',
      points: [
        'Pocket a coin = continue your turn',
        'Miss (no coin pocketed) = turn passes to opponent',
        'In Doubles: alternate turns within the team',
      ],
    },
    {
      number: '07',
      title: 'Queen Rules',
      icon: '👑',
      color: '#EF4444',
      points: [
        'Pocket the Queen (red coin) during your turn',
        'Must cover it by pocketing one of your coins on the very next shot',
        'If not covered, Queen returns to the center of the board',
        'Queen = 3 bonus points when successfully covered',
      ],
    },
    {
      number: '08',
      title: 'Fouls',
      icon: '⚠️',
      color: '#F87171',
      points: [
        'Striker falls into a pocket = foul',
        'Double hit (striker hits same coin twice) = foul',
        'Illegal touch (touching coins without striking) = foul',
        'Penalty: return one of your pocketed coins to the board',
        'In scoring: each foul = −1 point deducted',
      ],
    },
    {
      number: '09',
      title: 'Scoring',
      icon: '📊',
      color: '#C9A84C',
      points: [
        'Each opponent coin remaining on board = 1 point',
        'Queen covered = 3 bonus points',
        'Each foul committed = −1 point penalty',
        'Board winner = player/team with higher board score',
      ],
    },
    {
      number: '10',
      title: 'End of Board',
      icon: '✅',
      color: '#4ADE80',
      points: [
        'Board ends when all coins are pocketed',
        'Queen must be covered for the board to end',
        'If Queen is not covered, it returns to center and play continues',
        'Submit board result in admin panel after each board',
      ],
    },
    {
      number: '11',
      title: 'Doubles Rules',
      icon: '🤝',
      color: '#60A5FA',
      points: [
        'Partners sit opposite each other',
        'Turns alternate between team members',
        'Team penalties apply (foul by one = penalty for team)',
        'Both players contribute to team score',
      ],
    },
  ];

  return (
    <div className="w-full space-y-8 animate-fade-in">

      {/* Header */}
      <div>
        <p className="text-[11px] uppercase tracking-widest font-semibold mb-2" style={{ color: '#4A4A5E' }}>
          ICF Official
        </p>
        <h1 className="text-[26px] font-bold mb-1" style={{ color: '#F4F4F6' }}>
          Carrom Rules
        </h1>
        <p className="text-[13px]" style={{ color: '#6B8FAD' }}>
          Official ICF Tournament Format rules used in this championship.
        </p>
      </div>

      {/* Quick summary */}
      <div className="rounded-xl p-5"
        style={{ background: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.2)' }}>
        <p className="text-[12px] font-bold uppercase tracking-wider mb-3" style={{ color: '#C9A84C' }}>
          Quick Summary
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { label: 'Win by Points', value: '25 pts', color: '#4ADE80' },
            { label: 'Win by Boards', value: '8 boards', color: '#60A5FA' },
            { label: 'Queen Value', value: '3 pts', color: '#EF4444' },
          ].map(s => (
            <div key={s.label} className="text-center py-3 rounded-lg"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <p className="text-[22px] font-black" style={{ color: s.color }}>{s.value}</p>
              <p className="text-[11px] mt-0.5" style={{ color: '#4A4A5E' }}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Rules list */}
      <div className="space-y-3">
        {rules.map(rule => (
          <div key={rule.number} className="rounded-xl overflow-hidden"
            style={{ background: '#16161E', border: '1px solid #1E1E2A' }}>
            {/* Rule header */}
            <div className="flex items-center gap-4 px-5 py-4"
              style={{ borderBottom: '1px solid #1E1E2A', background: 'rgba(6,11,24,0.4)' }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-[18px] flex-shrink-0"
                style={{ background: `${rule.color}12`, border: `1px solid ${rule.color}22` }}>
                {rule.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold tabular-nums px-2 py-0.5 rounded"
                    style={{ background: `${rule.color}15`, color: rule.color }}>
                    Rule {rule.number}
                  </span>
                </div>
                <p className="text-[14px] font-bold mt-0.5" style={{ color: '#F4F4F6' }}>{rule.title}</p>
              </div>
            </div>

            {/* Rule points */}
            <div className="px-5 py-4 space-y-2">
              {rule.points.map((point, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
                    style={{ background: rule.color, opacity: 0.6 }} />
                  <p className="text-[13px] leading-relaxed" style={{ color: '#8B8B9E' }}>{point}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Footer note */}
      <div className="rounded-xl p-4 text-center"
        style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid #1E1E2A' }}>
        <p className="text-[12px]" style={{ color: '#3A3A52' }}>
          These rules follow the ICF (International Carrom Federation) Official Tournament Format.
        </p>
      </div>
    </div>
  );
}
