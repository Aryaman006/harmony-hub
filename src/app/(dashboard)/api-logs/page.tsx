'use client';

import { 
  ScrollText, 
  Search, 
  CheckCircle, 
  XCircle,
  Clock,
  ChevronRight,
  Loader2
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

const API = process.env.NEXT_PUBLIC_API_URL;
const SECRET = process.env.NEXT_PUBLIC_ADMIN_SECRET;
// The current partner — in a real app this would come from an auth context
const PARTNER_ID = 'TravelHealth';

export default function ApiLogsPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const { data, isLoading } = useQuery({
    queryKey: ['partner-logs', PARTNER_ID],
    queryFn: () =>
      fetch(`${API}/admin/logs?partnerId=${PARTNER_ID}&limit=100`, {
        headers: { 'x-admin-secret': SECRET! }
      }).then(r => r.json())
  });

  const logs = (data?.data || []).filter((log: any) => {
    const matchSearch = !search || log.endpoint?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' 
      || (statusFilter === 'success' && log.response_status < 400) 
      || (statusFilter === 'error' && log.response_status >= 400);
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">API Usage Logs</h1>
        <p className="text-sm text-slate-500">Monitor your integration performance and troubleshoot errors.</p>
      </div>

      <div className="flex items-center space-x-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search by endpoint..." 
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
          <option value="all">All Status</option>
          <option value="success">Success (2xx)</option>
          <option value="error">Errors (4xx/5xx)</option>
        </select>
      </div>

      {isLoading ? (
        <div className="flex h-48 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      ) : (
        <div className="space-y-3">
          {logs.length === 0 && (
            <div className="rounded-xl bg-white p-8 text-center text-slate-400 border border-slate-200">
              <ScrollText className="h-10 w-10 mx-auto mb-3 text-slate-200" />
              No logs found
            </div>
          )}
          {logs.map((log: any) => (
            <div key={log._id} className="group flex items-center justify-between rounded-xl bg-white p-4 shadow-sm border border-slate-200 hover:border-blue-200 transition-all cursor-pointer">
              <div className="flex items-center space-x-4">
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                  log.response_status < 400 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                }`}>
                  {log.response_status < 400 ? <CheckCircle className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">POST</span>
                    <span className="text-sm font-semibold text-slate-900 font-mono">{log.endpoint}</span>
                  </div>
                  <div className="flex items-center space-x-3 mt-1 text-xs text-slate-500">
                    <span className="flex items-center"><Clock className="mr-1 h-3 w-3" /> {log.response_time}ms</span>
                    <span>•</span>
                    <span>{new Date(log.createdAt).toLocaleString()}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <span className={`text-sm font-bold ${log.response_status < 400 ? 'text-green-600' : 'text-red-600'}`}>
                  {log.response_status}
                </span>
                <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-blue-500 transition-colors" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
