'use client';

import { 
  Plus, 
  Search, 
  MoreVertical, 
  UserCheck, 
  UserX,
  RefreshCw,
  Eye,
  Loader2
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

const API = process.env.NEXT_PUBLIC_API_URL;
const SECRET = process.env.NEXT_PUBLIC_ADMIN_SECRET;

function adminFetch(path: string) {
  return fetch(`${API}${path}`, {
    headers: { 'x-admin-secret': SECRET! }
  }).then(r => r.json());
}

export default function UsersPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['admin-users', statusFilter],
    queryFn: () => adminFetch(`/admin/users${statusFilter ? `?status=${statusFilter}` : ''}`)
  });

  const users = (data?.data || []).filter((u: any) =>
    !search || u.external_user_id?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">User Management</h1>
          <p className="text-sm text-slate-500">View and manage your activated users and their subscriptions.</p>
        </div>
        <button className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 transition-colors">
          <Plus className="mr-2 h-4 w-4" />
          Activate New User
        </button>
      </div>

      <div className="flex items-center space-x-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search users by ID..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full rounded-lg border border-slate-200 pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>
        <select 
          className="rounded-lg border border-slate-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="expired">Expired</option>
        </select>
      </div>

      {isLoading ? (
        <div className="flex h-48 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">External ID</th>
                <th className="px-6 py-4">Partner</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Members</th>
                <th className="px-6 py-4">Expiry Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.length === 0 && (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-slate-400">No users found</td></tr>
              )}
              {users.map((user: any) => (
                <tr key={user._id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-mono font-medium text-slate-900">{user.external_user_id}</td>
                  <td className="px-6 py-4 text-slate-600">{user.partner_name}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {user.status === 'active' ? <UserCheck className="mr-1 h-3 w-3" /> : <UserX className="mr-1 h-3 w-3" />}
                      {user.status?.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{user.member_count ?? '—'} Members</td>
                  <td className="px-6 py-4 text-slate-500">
                    {user.end_date ? new Date(user.end_date).toLocaleDateString('en-GB') : '—'}
                  </td>
                  <td className="px-6 py-4 text-right">
                     <div className="flex justify-end space-x-2">
                       <button className="p-1 text-slate-400 hover:text-blue-600 transition-colors" title="Renew Subscription">
                         <RefreshCw className="h-4 w-4" />
                       </button>
                       <button className="p-1 text-slate-400 hover:text-slate-600 transition-colors" title="View Details">
                         <Eye className="h-4 w-4" />
                       </button>
                       <button className="p-1 text-slate-400 hover:text-slate-600 transition-colors">
                         <MoreVertical className="h-4 w-4" />
                       </button>
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
