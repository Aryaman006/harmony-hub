'use client';

import { 
  Users, 
  CreditCard, 
  Activity, 
  AlertCircle,
  Loader2
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

const iconMap: Record<string, any> = {
  Users,
  AlertCircle,
  CreditCard,
  Activity
};

export default function DashboardPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/integration/dashboard/stats`, {
        headers: {
          'x-api-key': 'TRAVELHEALTH_SECURE_KEY' // Hardcoded for demo/dev as per integration_layer .env
        }
      });
      if (!res.ok) throw new Error('Failed to fetch dashboard data');
      const json = await res.json();
      return json.data;
    }
  });

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[60vh] items-center justify-center text-red-500">
        Error loading dashboard data. Please check if the backend is running.
      </div>
    );
  }

  const stats = data?.stats || [];
  const latestActivities = data?.latestActivities || [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Partner Dashboard</h1>
        <p className="mt-2 text-sm text-slate-600">Welcome back! Here's what's happening with your users.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat: any) => {
          const Icon = iconMap[stat.icon] || Activity;
          return (
            <div key={stat.name} className="flex items-center rounded-xl bg-white p-6 shadow-sm border border-slate-200">
              <div className={`mr-4 flex h-12 w-12 items-center justify-center rounded-lg ${stat.bg}`}>
                <Icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">{stat.name}</p>
                <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl bg-white p-6 shadow-sm border border-slate-200 min-h-[300px]">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">API Usage Over Time</h3>
          <div className="flex items-center justify-center h-full text-slate-400 font-mono">
            [Chart: Request Count]
          </div>
        </div>
        <div className="rounded-xl bg-white p-6 shadow-sm border border-slate-200 min-h-[300px]">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Latest Activity</h3>
          <div className="space-y-4">
             {latestActivities.length > 0 ? latestActivities.map((activity: any) => (
               <div key={activity.id} className="flex items-center justify-between border-b border-slate-100 pb-3 last:border-0">
                 <div className="flex items-center space-x-3">
                   <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                     <Activity className="h-4 w-4 text-blue-600" />
                   </div>
                   <div>
                     <p className="text-sm font-medium text-slate-900">User {activity.user} - {activity.event}</p>
                     <p className="text-xs text-slate-500">{new Date(activity.time).toLocaleString()}</p>
                   </div>
                 </div>
                 <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded">
                   {activity.event}
                 </span>
               </div>
             )) : (
               <div className="text-center py-12 text-slate-400">No recent activity</div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
}
