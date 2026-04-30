export default function Loading() {
  return (
    <div style={{ padding: '36px 48px' }}>
      <div style={{ maxWidth: '960px' }}>
        {/* Header skeleton */}
        <div className="skeleton h-4 w-24 rounded mb-3" />
        <div className="skeleton h-9 w-72 rounded-xl mb-2" />
        <div className="skeleton h-4 w-56 rounded mb-8" />

        {/* Stats skeleton */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '32px' }}>
          {[1,2,3].map(i => <div key={i} className="skeleton rounded-xl" style={{ height: '96px' }} />)}
        </div>

        {/* Section header */}
        <div className="skeleton h-5 w-36 rounded mb-4" />

        {/* Cards skeleton */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
          {[1,2,3].map(i => <div key={i} className="skeleton rounded-xl" style={{ height: '160px' }} />)}
        </div>
      </div>
    </div>
  );
}
