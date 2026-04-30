export default function Loading() {
  return (
    <div style={{ padding: '36px 48px' }}>
      <div style={{ maxWidth: '960px' }}>
        <div className="skeleton h-4 w-24 rounded mb-3" />
        <div className="skeleton h-9 w-56 rounded-xl mb-2" />
        <div className="skeleton h-4 w-64 rounded mb-8" />
        <div className="skeleton rounded-2xl" style={{ height: '400px' }} />
      </div>
    </div>
  );
}
