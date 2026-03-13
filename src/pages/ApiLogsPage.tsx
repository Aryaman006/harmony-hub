import {
  ScrollText, Search, CheckCircle, XCircle, Clock, ChevronRight, Loader2,
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

const API = import.meta.env.VITE_API_URL;
const SECRET = import.meta.env.VITE_ADMIN_SECRET;
const PARTNER_ID = 'TravelHealth';

export default function ApiLogsPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const { data, isLoading } = useQuery({
    queryKey: ['partner-logs', PARTNER_ID],
    queryFn: () =>
      fetch(`${API}/admin/logs?partnerId=${PARTNER_ID}&limit=100`, {
        headers: { 'x-admin-secret': SECRET! },
      }).then(r => r.json()),
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
        <h1 className="text-2xl font-bold tracking-tight text-foreground">API Usage Logs</h1>
        <p className="text-sm text-muted-foreground">Monitor your integration performance and troubleshoot errors.</p>
      </div>

      <div className="flex items-center space-x-4 bg-card p-4 rounded-xl border border-border shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input type="text" placeholder="Search by endpoint..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full rounded-lg border border-border bg-background pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all" />
        </div>
        <select className="rounded-lg border border-border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="all">All Status</option>
          <option value="success">Success (2xx)</option>
          <option value="error">Errors (4xx/5xx)</option>
        </select>
      </div>

      {isLoading ? (
        <div className="flex h-48 items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
      ) : (
        <div className="space-y-3">
          {logs.length === 0 && (
            <div className="rounded-xl bg-card p-8 text-center text-muted-foreground border border-border">
              <ScrollText className="h-10 w-10 mx-auto mb-3 text-border" />
              No logs found
            </div>
          )}
          {logs.map((log: any) => (
            <div key={log._id} className="group flex items-center justify-between rounded-xl bg-card p-4 shadow-sm border border-border hover:border-primary/30 transition-all cursor-pointer">
              <div className="flex items-center space-x-4">
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${log.response_status < 400 ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'}`}>
                  {log.response_status < 400 ? <CheckCircle className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground font-mono">POST</span>
                    <span className="text-sm font-semibold text-foreground font-mono">{log.endpoint}</span>
                  </div>
                  <div className="flex items-center space-x-3 mt-1 text-xs text-muted-foreground">
                    <span className="flex items-center"><Clock className="mr-1 h-3 w-3" /> {log.response_time}ms</span>
                    <span>•</span>
                    <span>{new Date(log.createdAt).toLocaleString()}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <span className={`text-sm font-bold ${log.response_status < 400 ? 'text-success' : 'text-danger'}`}>{log.response_status}</span>
                <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
