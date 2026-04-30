export default function Loading() {
  return (
    <div style={{ padding: '36px 48px' }}>
      <div style={{ maxWidth: '960px' }}>
        <div className="skeleton h-4 w-32 rounded mb-3" />
        <div className="skeleton h-9 w-64 rounded-xl mb-2" />
        <div className="skeleton h-4 w-48 rounded mb-8" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
          {[1,2,3,4].map(i => <div key={i} className="skeleton rounded-xl" style={{ height: '160px' }} />)}
        </div>
      </div>
    </div>
  );
}
