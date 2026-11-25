import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { Layout } from '../../components/Layout';
import { useAuth } from '../../contexts/AuthContext';
import { apiGet, apiPost } from '../../lib/api';

type Apartment = {
  id: number;
  unitNumber: string;
  block: string | null;
  status: string;
};

const inputClass =
  'w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-gray-900 focus:border-[#6C7A5C] focus:ring-2 focus:ring-[#6C7A5C]/20 focus:outline-none';

function Apartments() {
  const { user } = useAuth();
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [loading, setLoading] = useState(true);
  const [unitNumber, setUnitNumber] = useState('');
  const [block, setBlock] = useState('');
  const [status, setStatus] = useState('vacant');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  async function load() {
    const data = await apiGet<Apartment[]>('/api/apartments');
    setApartments(data ?? []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleAdd(e: FormEvent) {
    e.preventDefault();
    setError('');
    setSaving(true);

    const result = await apiPost<Apartment>('/api/apartments', {
      unitNumber,
      block: block || undefined,
      status,
    });

    setSaving(false);

    if (!result.ok) {
      setError(result.error || 'Could not add apartment');
      return;
    }

    setUnitNumber('');
    setBlock('');
    setStatus('vacant');
    load();
  }

  if (!user) return null;

  return (
    <Layout title="Apartments">
      {user.role === 'ADMIN' && (
        <form
          onSubmit={handleAdd}
          className="mb-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
        >
          <h2 className="text-lg font-semibold text-gray-900">Add an apartment</h2>

          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <input
              className={inputClass}
              placeholder="Unit number (e.g. A101)"
              value={unitNumber}
              onChange={(e) => setUnitNumber(e.target.value)}
            />
            <input
              className={inputClass}
              placeholder="Block (optional)"
              value={block}
              onChange={(e) => setBlock(e.target.value)}
            />
            <select
              className={inputClass}
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="vacant">Vacant</option>
              <option value="occupied">Occupied</option>
            </select>
          </div>

          {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={saving}
            className="mt-4 rounded-xl bg-[#2E4A3B] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#25392e] disabled:opacity-60"
          >
            {saving ? 'Adding…' : 'Add apartment'}
          </button>
        </form>
      )}

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
            <tr>
              <th className="px-6 py-3">Unit</th>
              <th className="px-6 py-3">Block</th>
              <th className="px-6 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading && (
              <tr>
                <td colSpan={3} className="px-6 py-6 text-gray-500">
                  Loading…
                </td>
              </tr>
            )}
            {!loading && apartments.length === 0 && (
              <tr>
                <td colSpan={3} className="px-6 py-6 text-gray-500">
                  No apartments yet.
                </td>
              </tr>
            )}
            {apartments.map((a) => (
              <tr key={a.id}>
                <td className="px-6 py-3 font-medium text-gray-900">{a.unitNumber}</td>
                <td className="px-6 py-3 text-gray-600">{a.block ?? '—'}</td>
                <td className="px-6 py-3">
                  <span
                    className={`rounded-full px-3 py-0.5 text-xs font-semibold uppercase tracking-wide ${
                      a.status === 'occupied'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-green-100 text-green-700'
                    }`}
                  >
                    {a.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}

export default Apartments;
