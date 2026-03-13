import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  CreditCard,
  ScrollText,
  Settings,
  ChevronRight,
  Zap,
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Users', href: '/users', icon: Users },
  { name: 'Claims', href: '/claims', icon: CreditCard },
  { name: 'API Logs', href: '/api-logs', icon: ScrollText },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export default function Sidebar() {
  const { pathname } = useLocation();

  return (
    <div className="flex h-screen w-[260px] flex-col bg-sidebar-bg text-sidebar-foreground">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2.5 px-5 border-b border-sidebar-accent">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-gradient-start to-gradient-end">
          <Zap className="h-4 w-4 text-primary-foreground" />
        </div>
        <span className="text-[15px] font-semibold tracking-tight text-sidebar-foreground">Partner Portal</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-5 space-y-0.5">
        <p className="px-3 mb-3 text-[11px] font-semibold uppercase tracking-widest text-sidebar-muted">Menu</p>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                'group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium transition-all duration-200',
                isActive
                  ? 'bg-sidebar-accent text-sidebar-primary shadow-sm'
                  : 'text-sidebar-muted hover:bg-sidebar-accent/60 hover:text-sidebar-foreground'
              )}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-gradient-to-b from-gradient-start to-gradient-end" />
              )}
              <item.icon className={cn(
                'h-[18px] w-[18px] transition-colors',
                isActive ? 'text-sidebar-primary' : 'text-sidebar-muted group-hover:text-sidebar-foreground'
              )} />
              <span className="flex-1">{item.name}</span>
              {isActive && <ChevronRight className="h-3.5 w-3.5 text-sidebar-muted" />}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-sidebar-accent p-3">
        <div className="flex items-center gap-3 rounded-lg bg-sidebar-accent/50 p-3">
          <div className="h-9 w-9 rounded-full bg-gradient-to-br from-gradient-start to-gradient-end flex items-center justify-center text-xs font-bold text-primary-foreground shadow-md">
            TH
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="truncate text-sm font-medium text-sidebar-foreground">TravelHealth</span>
            <span className="truncate text-[11px] text-sidebar-muted flex items-center gap-1">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-success" />
              API Key Active
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
