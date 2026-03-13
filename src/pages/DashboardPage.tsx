import {
  Users,
  CreditCard,
  Activity,
  AlertCircle,
  Loader2,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';

const iconMap: Record<string, any> = { Users, AlertCircle, CreditCard, Activity };

const mockAreaData = [
  { name: 'Mon', requests: 1200 },
  { name: 'Tue', requests: 1900 },
  { name: 'Wed', requests: 1600 },
  { name: 'Thu', requests: 2400 },
  { name: 'Fri', requests: 2100 },
  { name: 'Sat', requests: 1800 },
  { name: 'Sun', requests: 2800 },
];

const mockBarData = [
  { name: 'Auth', count: 420 },
  { name: 'Claims', count: 310 },
  { name: 'Users', count: 280 },
  { name: 'Payments', count: 190 },
  { name: 'Reports', count: 150 },
];

const fallbackStats = [
  { name: 'Total Users', value: '2,847', icon: 'Users', change: '+12.5%', trending: 'up', bg: 'from-blue-500 to-blue-600' },
  { name: 'Active Claims', value: '184', icon: 'CreditCard', change: '+3.2%', trending: 'up', bg: 'from-emerald-500 to-emerald-600' },
  { name: 'API Calls', value: '12.4k', icon: 'Activity', change: '+8.1%', trending: 'up', bg: 'from-violet-500 to-violet-600' },
  { name: 'Error Rate', value: '0.12%', icon: 'AlertCircle', change: '-2.4%', trending: 'down', bg: 'from-amber-500 to-amber-600' },
];

export default function DashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/integration/dashboard/stats`, {
        headers: { 'x-api-key': 'TRAVELHEALTH_SECURE_KEY' },
      });
      if (!res.ok) throw new Error('Failed to fetch');
      return (await res.json()).data;
    },
    retry: 1,
  });

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const stats = data?.stats || fallbackStats;
  const latestActivities = data?.latestActivities || [];

  return (
    <div className="space-y-8">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">Welcome back! Here's an overview of your partner activity.</p>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground bg-secondary rounded-lg px-3 py-1.5">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
          All systems operational
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat: any, i: number) => {
          const Icon = iconMap[stat.icon] || Activity;
          const gradients = ['from-blue-500 to-blue-600', 'from-emerald-500 to-emerald-600', 'from-violet-500 to-violet-600', 'from-amber-500 to-amber-600'];
          const bg = stat.bg || gradients[i % 4];
          const isUp = stat.trending === 'up' || (stat.change && stat.change.startsWith('+'));
          return (
            <div key={stat.name} className="group relative overflow-hidden rounded-xl bg-card border border-border p-5 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-[13px] font-medium text-muted-foreground">{stat.name}</p>
                  <p className="text-2xl font-bold text-card-foreground tracking-tight">{stat.value}</p>
                  {stat.change && (
                    <div className={`flex items-center gap-1 text-xs font-medium ${isUp ? 'text-success' : 'text-danger'}`}>
                      {isUp ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                      {stat.change}
                      <span className="text-muted-foreground font-normal">vs last week</span>
                    </div>
                  )}
                </div>
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${bg} shadow-lg shadow-primary/20`}>
                  <Icon className="h-5 w-5 text-white" />
                </div>
              </div>
              <div className={`absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r ${bg} opacity-0 group-hover:opacity-100 transition-opacity`} />
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-7">
        <div className="lg:col-span-4 rounded-xl bg-card border border-border p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm font-semibold text-card-foreground">API Usage</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Request count over the last 7 days</p>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-medium text-success bg-success/10 rounded-full px-2.5 py-1">
              <TrendingUp className="h-3 w-3" />+18.2%
            </div>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={mockAreaData}>
              <defs>
                <linearGradient id="colorRequests" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
              <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
              <Area type="monotone" dataKey="requests" stroke="#3b82f6" strokeWidth={2} fill="url(#colorRequests)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="lg:col-span-3 rounded-xl bg-card border border-border p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm font-semibold text-card-foreground">Endpoint Breakdown</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Requests by endpoint</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={mockBarData} barSize={32}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
              <Bar dataKey="count" fill="#3b82f6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-xl bg-card border border-border p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-sm font-semibold text-card-foreground">Latest Activity</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Recent events from your integration</p>
          </div>
          <button className="flex items-center gap-1 text-xs font-medium text-primary hover:text-primary-glow transition-colors">
            View all <ArrowUpRight className="h-3 w-3" />
          </button>
        </div>
        <div className="space-y-3">
          {latestActivities.length > 0 ? (
            latestActivities.map((activity: any) => (
              <div key={activity.id} className="flex items-center justify-between rounded-lg border border-border/50 bg-secondary/30 p-3.5 transition-colors hover:bg-secondary/60">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-accent flex items-center justify-center">
                    <Activity className="h-4 w-4 text-accent-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-card-foreground">User {activity.user} — {activity.event}</p>
                    <p className="text-xs text-muted-foreground">{new Date(activity.time).toLocaleString()}</p>
                  </div>
                </div>
                <span className="text-[11px] font-semibold text-accent-foreground bg-accent rounded-full px-2.5 py-1">{activity.event}</span>
              </div>
            ))
          ) : (
            <div className="text-center py-12 text-muted-foreground text-sm">No recent activity to display</div>
          )}
        </div>
      </div>
    </div>
  );
}
