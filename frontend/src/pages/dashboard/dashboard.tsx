import { useEffect, useState } from 'react';
import { Layout } from '../../components/Layout';
import { useAuth } from '../../contexts/AuthContext';
import { apiGet } from '../../lib/api';

type Announcement = {
  id: number;
  title: string;
  body: string;
  createdAt: string;
  postedBy: { name: string };
};

type Counts = {
  apartments: number | null;
  residents: number | null;
  visitors: number | null;
  requests: number | null;
  users: number | null;
};

function StatCard({ label, value }: { label: string; value: number | null }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="mt-2 text-3xl font-semibold text-gray-900">{value === null ? '—' : value}</p>
    </div>
  );
}

function Dashboard() {
  const { user } = useAuth();
  const [counts, setCounts] = useState<Counts | null>(null);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  useEffect(() => {
    async function load() {
      const [apartments, residents, visitors, requests, users, news] = await Promise.all([
        apiGet<unknown[]>('/api/apartments'),
        apiGet<unknown[]>('/api/residents'),
        apiGet<unknown[]>('/api/visitors'),
        apiGet<unknown[]>('/api/maintenance-requests'),
        apiGet<unknown[]>('/api/users'),
        apiGet<Announcement[]>('/api/announcements'),
      ]);

      setCounts({
        apartments: apartments ? apartments.length : null,
        residents: residents ? residents.length : null,
        visitors: visitors ? visitors.length : null,
        requests: requests ? requests.length : null,
        users: users ? users.length : null,
      });
      setAnnouncements(news ? news.slice(0, 5) : []);
    }
    load();
  }, []);

  if (!user) return null;

  return (
    <Layout title="Dashboard">
      <h2 className="text-2xl font-semibold text-gray-900">Welcome back, {user.name}</h2>
      <p className="mt-1 text-sm text-gray-500">Here is what is happening on the estate.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard label="Apartments" value={counts ? counts.apartments : null} />
        <StatCard label="Residents" value={counts ? counts.residents : null} />
        <StatCard label="Visitors" value={counts ? counts.visitors : null} />
        <StatCard label="Maintenance requests" value={counts ? counts.requests : null} />
        <StatCard label="Users" value={counts ? counts.users : null} />
      </div>

      <section className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900">Latest announcements</h3>

        {announcements.length === 0 ? (
          <p className="mt-4 text-sm text-gray-500">No announcements yet.</p>
        ) : (
          <ul className="mt-4 divide-y divide-gray-100">
            {announcements.map((a) => (
              <li key={a.id} className="py-3">
                <p className="font-medium text-gray-900">{a.title}</p>
                <p className="text-sm text-gray-600">{a.body}</p>
                <p className="mt-1 text-xs text-gray-400">
                  {a.postedBy.name} · {new Date(a.createdAt).toLocaleDateString()}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </Layout>
  );
}

export default Dashboard;
