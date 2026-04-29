'use client';
import { useState } from 'react';
import { UserPlus, Check } from 'lucide-react';

export default function PlayerForm({ onSubmit, initialData, onCancel }) {
  const [name, setName]     = useState(initialData?.name || '');
  const [gender, setGender] = useState(initialData?.gender || 'male');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    try {
      await onSubmit({ name: name.trim(), gender });
      if (!initialData) { setName(''); setGender('male'); }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 items-end">
      <div className="flex-1 w-full">
        <label className="block text-[11px] font-semibold uppercase tracking-wider mb-1.5" style={{ color: '#4A4A5E' }}>
          Name
        </label>
        <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Player full name" className="input-field" required />
      </div>
      <div className="w-full sm:w-36">
        <label className="block text-[11px] font-semibold uppercase tracking-wider mb-1.5" style={{ color: '#4A4A5E' }}>
          Gender
        </label>
        <select value={gender} onChange={e => setGender(e.target.value)} className="input-field">
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
      </div>
      <div className="flex gap-2 w-full sm:w-auto">
        <button type="submit" disabled={loading} className="btn-primary w-full sm:w-auto flex items-center justify-center gap-2 whitespace-nowrap py-2.5 px-4">
          {loading ? 'Saving...' : initialData ? <><Check size={14} /> Update</> : <><UserPlus size={14} /> Add</>}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} className="btn-secondary px-4 py-2.5">Cancel</button>
        )}
      </div>
    </form>
  );
}
