import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BookOpen, 
  Users, 
  CalendarDays, 
  Settings,
  Library,
  LogOut
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard, roles: ['admin', 'librarian', 'member'] },
  { name: 'Books', href: '/books', icon: BookOpen, roles: ['admin', 'librarian', 'member'] },
  { name: 'Members', href: '/members', icon: Users, roles: ['admin', 'librarian'] },
  { name: 'Loans', href: '/loans', icon: CalendarDays, roles: ['admin', 'librarian'] },
  { name: 'Settings', href: '/settings', icon: Settings, roles: ['admin'] },
];

export default function Sidebar() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const visibleNavigation = navigation.filter((item) => user && item.roles.includes(user.role));

  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-200 w-64">
      <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-200">
        <div className="p-2 bg-primary-600 rounded-lg">
          <Library className="w-6 h-6 text-white" />
        </div>
        <span className="text-xl font-bold text-gray-900">Library</span>
      </div>
      
      <nav className="flex-1 px-4 py-6 space-y-1">
        {visibleNavigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-primary-50 text-primary-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            {item.name}
          </NavLink>
        ))}
      </nav>
      
      <div className="px-4 py-4 border-t border-gray-200">
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
            <span className="text-sm font-medium text-primary-600">
              {user?.name?.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase() || 'NA'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{user?.name || 'Unknown'}</p>
            <p className="text-xs text-gray-500 truncate">{user?.email || '-'}</p>
            <p className="text-xs text-primary-600 capitalize">{user?.role || 'guest'}</p>
          </div>
          <button
            type="button"
            onClick={logout}
            className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700"
            title="Sign out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
