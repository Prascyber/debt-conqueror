import { LayoutDashboard, Briefcase, Users, Activity } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/authStore';

export const Sidebar = () => {
  const { user } = useAuthStore();
  const isAdmin = user?.role === 'admin';

  const navItems = [
    {
      label: 'Dashboard',
      icon: LayoutDashboard,
      path: '/dashboard',
      roles: ['admin', 'agent']
    },
    {
      label: 'Cases',
      icon: Briefcase,
      path: '/cases',
      roles: ['admin', 'agent']
    },
    {
      label: 'Agents',
      icon: Users,
      path: '/agents',
      roles: ['admin']
    },
    {
      label: 'Activity Log',
      icon: Activity,
      path: '/activity',
      roles: ['admin', 'agent']
    }
  ];

  const filteredNavItems = navItems.filter(item => 
    item.roles.includes(user?.role || '')
  );

  return (
    <aside className="w-64 border-r bg-card min-h-[calc(100vh-4rem)]">
      <nav className="p-4 space-y-1">
        {filteredNavItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )
            }
          >
            <item.icon className="h-5 w-5" />
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};
