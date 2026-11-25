import { useEffect, useState } from 'react';
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

const NAV = [
  { label: 'Dashboard', roles: ['ADMIN', 'RESIDENT', 'SECURITY', 'MAINTENANCE'] },
  { label: 'Apartments', roles: ['ADMIN', 'SECURITY', 'RESIDENT', 'MAINTENANCE'] },
  { label: 'Residents', roles: ['ADMIN', 'SECURITY'] },
  { label: 'Visitors', roles: ['ADMIN', 'SECURITY', 'RESIDENT'] },
  { label: 'Maintenance', roles: ['ADMIN', 'RESIDENT', 'MAINTENANCE'] },
  { label: 'Announcements', roles: ['ADMIN', 'RESIDENT', 'SECURITY', 'MAINTENANCE'] },
  { label: 'Users', roles: ['ADMIN'] },
];

function StatCard({ label, value }: { label: string; value: number | null }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="mt-2 text-3xl font-semibold text-gray-900">{value === null ? '—' : value}</p>
    </div>
  );
}

function Dashboard() {
  const { user, logout } = useAuth();
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

  const navItems = NAV.filter((item) => item.roles.includes(user.role));

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="hidden w-64 flex-col bg-[#2E4A3B] p-6 text-white lg:flex">
        <div className="mb-10 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="h-6 w-6"
            >
              <path d="M3 10.5 12 3l9 7.5" />
              <path d="M5 9.5V21h14V9.5" />
              <path d="M9 21v-6h6v6" />
            </svg>
          </div>
          <span className="font-semibold">Estate Management</span>
        </div>

        <nav className="space-y-1">
          {navItems.map((item, index) => (
            <div
              key={item.label}
              className={`rounded-lg px-3 py-2 text-sm ${
                index === 0 ? 'bg-white/15 font-medium' : 'text-white/70'
              }`}
            >
              {item.label}
            </div>
          ))}
        </nav>
      </aside>

      {/* Main area */}
      <div className="flex-1">
        <header className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
          <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{user.name}</p>
              <p className="text-xs uppercase tracking-wide text-gray-500">{user.role}</p>
            </div>
            <button
              onClick={logout}
              className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
            >
              Log out
            </button>
          </div>
        </header>

        <main className="p-6">
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
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
