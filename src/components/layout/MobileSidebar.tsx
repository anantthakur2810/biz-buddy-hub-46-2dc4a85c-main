import { Link, useLocation } from 'react-router-dom';
import {
  BarChart3,
  HelpCircle,
  LayoutDashboard,
  LucideIcon,
  LogOut,
  Package,
  Settings,
  ShoppingCart,
  UserPlus,
  Users,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { useRole } from '@/context/RoleContext';
import { BrandMark } from './BrandMark';
import { EmployeeManagementDialog } from './EmployeeManagementDialog';

type NavigationPermission = 'customers' | 'benchmarks' | 'manageEmployees';

type NavigationItem = {
  name: string;
  href: string;
  icon: LucideIcon;
  permission?: NavigationPermission;
};

const navigation: NavigationItem[] = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Customers', href: '/customers', icon: Users, permission: 'customers' },
  { name: 'Sales', href: '/sales', icon: ShoppingCart },
  { name: 'Inventory', href: '/inventory', icon: Package },
  { name: 'Manage Employees', href: '/employees', icon: UserPlus, permission: 'manageEmployees' },
  { name: 'Benchmarks', href: '/benchmarks', icon: BarChart3, permission: 'benchmarks' },
];

const secondaryNavigation = [
  { name: 'Settings', href: '/settings', icon: Settings },
  { name: 'Help', href: '/help', icon: HelpCircle },
];

interface MobileSidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MobileSidebar({ open, onOpenChange }: MobileSidebarProps) {
  const location = useLocation();
  const { logout } = useAuth();
  const { profile } = useRole();

  const visibleNavigation = navigation.filter(
    (item) => !item.permission || profile.permissions[item.permission],
  );

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-72 border-sidebar-border bg-sidebar p-0">
        <SheetHeader className="flex h-16 flex-row items-center gap-3 border-b border-sidebar-border px-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sidebar-primary shadow-sm">
            <BrandMark className="h-5 w-5 text-sidebar-primary-foreground" />
          </div>
          <div>
            <SheetTitle className="text-left text-lg font-semibold text-sidebar-foreground">BizFlow</SheetTitle>
            <p className="text-xs text-sidebar-foreground/60">{profile.title}</p>
          </div>
        </SheetHeader>

        <nav className="flex-1 space-y-1 px-3 py-4">
          <p className="mb-2 px-3 text-xs font-medium uppercase tracking-wider text-sidebar-foreground/40">
            Main Menu
          </p>
          {visibleNavigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => onOpenChange(false)}
                className={cn('sidebar-item', isActive && 'active')}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-sidebar-border px-3 py-4">
          <p className="mb-2 px-3 text-xs font-medium uppercase tracking-wider text-sidebar-foreground/40">
            Support
          </p>
          {secondaryNavigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => onOpenChange(false)}
                className={cn('sidebar-item', isActive && 'active')}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>

        <div className="absolute bottom-0 left-0 right-0 border-t border-sidebar-border p-4">
          <div className="rounded-lg bg-sidebar-accent p-3">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-sidebar-primary text-sm font-medium text-sidebar-primary-foreground">
                {profile.initials}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-sidebar-foreground">{profile.name}</p>
                <p className="truncate text-xs text-sidebar-foreground/60">{profile.title}</p>
              </div>
            </div>
            <div className="mt-3 space-y-2">
              <EmployeeManagementDialog />
              <Button variant="outline" size="sm" className="w-full gap-2" onClick={logout}>
                <LogOut className="h-4 w-4" />
                Log Out
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
