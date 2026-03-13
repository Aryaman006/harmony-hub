import {
  Plus, Search, MoreVertical, UserCheck, UserX, RefreshCw, Eye, Loader2,
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

const API = import.meta.env.VITE_API_URL;
const SECRET = import.meta.env.VITE_ADMIN_SECRET;

function adminFetch(path: string) {
  return fetch(`${API}${path}`, { headers: { 'x-admin-secret': SECRET! } }).then(r => r.json());
}

export default function UsersPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['admin-users', statusFilter],
    queryFn: () => adminFetch(`/admin/users${statusFilter ? `?status=${statusFilter}` : ''}`),
  });

  const users = (data?.data || []).filter((u: any) =>
    !search || u.external_user_id?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">User Management</h1>
          <p className="text-sm text-muted-foreground">View and manage your activated users and their subscriptions.</p>
        </div>
        <button className="inline-flex items-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors">
          <Plus className="mr-2 h-4 w-4" />
          Activate New User
        </button>
      </div>

      <div className="flex items-center space-x-4 bg-card p-4 rounded-xl border border-border shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input type="text" placeholder="Search users by ID..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full rounded-lg border border-border bg-background pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all" />
        </div>
        <select className="rounded-lg border border-border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="expired">Expired</option>
        </select>
      </div>

      {isLoading ? (
        <div className="flex h-48 items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-secondary border-b border-border text-secondary-foreground font-semibold uppercase tracking-wider text-xs">
              <tr>
                <th className="px-6 py-4">External ID</th>
                <th className="px-6 py-4">Partner</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Members</th>
                <th className="px-6 py-4">Expiry Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {users.length === 0 && (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">No users found</td></tr>
              )}
              {users.map((user: any) => (
                <tr key={user._id} className="hover:bg-secondary/50 transition-colors">
                  <td className="px-6 py-4 font-mono font-medium text-foreground">{user.external_user_id}</td>
                  <td className="px-6 py-4 text-secondary-foreground">{user.partner_name}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${user.status === 'active' ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'}`}>
                      {user.status === 'active' ? <UserCheck className="mr-1 h-3 w-3" /> : <UserX className="mr-1 h-3 w-3" />}
                      {user.status?.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-secondary-foreground">{user.member_count ?? '—'} Members</td>
                  <td className="px-6 py-4 text-muted-foreground">{user.end_date ? new Date(user.end_date).toLocaleDateString('en-GB') : '—'}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end space-x-2">
                      <button className="p-1 text-muted-foreground hover:text-primary transition-colors" title="Renew"><RefreshCw className="h-4 w-4" /></button>
                      <button className="p-1 text-muted-foreground hover:text-foreground transition-colors" title="View"><Eye className="h-4 w-4" /></button>
                      <button className="p-1 text-muted-foreground hover:text-foreground transition-colors"><MoreVertical className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
