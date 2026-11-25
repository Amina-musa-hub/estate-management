import type { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

type NavItem = { label: string; path?: string; roles: string[] };

const ALL = ['ADMIN', 'RESIDENT', 'SECURITY', 'MAINTENANCE'];

const NAV: NavItem[] = [
  { label: 'Dashboard', path: '/dashboard', roles: ALL },
  { label: 'Apartments', path: '/apartments', roles: ALL },
  { label: 'Residents', roles: ['ADMIN', 'SECURITY'] },
  { label: 'Visitors', roles: ['ADMIN', 'SECURITY', 'RESIDENT'] },
  { label: 'Maintenance', roles: ['ADMIN', 'RESIDENT', 'MAINTENANCE'] },
  { label: 'Announcements', roles: ALL },
  { label: 'Users', roles: ['ADMIN'] },
];

export function Layout({ title, children }: { title: string; children: ReactNode }) {
  const { user, logout } = useAuth();

  if (!user) return null;

  const items = NAV.filter((item) => item.roles.includes(user.role));

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
          {items.map((item) =>
            item.path ? (
              <NavLink
                key={item.label}
                to={item.path}
                className={({ isActive }) =>
                  `block rounded-lg px-3 py-2 text-sm ${
                    isActive ? 'bg-white/15 font-medium' : 'text-white/70 hover:bg-white/10'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ) : (
              <div
                key={item.label}
                className="flex items-center justify-between rounded-lg px-3 py-2 text-sm text-white/40"
              >
                <span>{item.label}</span>
                <span className="text-[10px] uppercase tracking-wide">soon</span>
              </div>
            )
          )}
        </nav>
      </aside>

      {/* Main area */}
      <div className="flex-1">
        <header className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
          <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
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

        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
