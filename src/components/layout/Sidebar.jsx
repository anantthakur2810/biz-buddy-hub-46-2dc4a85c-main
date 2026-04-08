import { Link, useLocation } from 'react-router-dom';
import { BarChart3, ChevronLeft, ChevronRight, HelpCircle, LayoutDashboard, LogOut, Package, Settings, ShoppingCart, UserPlus, Users, } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger, } from '@/components/ui/tooltip';
import { useAuth } from '@/context/AuthContext';
import { useRole } from '@/context/RoleContext';
import { BrandMark } from './BrandMark';
import { EmployeeManagementDialog } from './EmployeeManagementDialog';
const navigation = [
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
export function Sidebar({ collapsed, onToggle }) {
    const location = useLocation();
    const { logout } = useAuth();
    const { profile } = useRole();
    const visibleNavigation = navigation.filter((item) => !item.permission || profile.permissions[item.permission]);
    const NavItem = ({ item, isActive }) => {
        const content = (<Link to={item.href} className={cn('sidebar-item', isActive && 'active', collapsed && 'justify-center px-2')}>
        <item.icon className="h-5 w-5 shrink-0"/>
        {!collapsed && <span>{item.name}</span>}
      </Link>);
        if (collapsed) {
            return (<Tooltip delayDuration={0}>
          <TooltipTrigger asChild>{content}</TooltipTrigger>
          <TooltipContent side="right" className="font-medium">
            {item.name}
          </TooltipContent>
        </Tooltip>);
        }
        return content;
    };
    return (<TooltipProvider>
      <aside className={cn('fixed left-0 top-0 z-40 h-screen border-r border-sidebar-border bg-sidebar transition-all duration-300', collapsed ? 'w-16' : 'w-64')}>
        <div className="flex h-full flex-col">
          <div className={cn('flex h-16 items-center border-b border-sidebar-border', collapsed ? 'justify-center px-2' : 'gap-3 px-6')}>
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-sidebar-primary shadow-sm">
              <BrandMark className="h-5 w-5 text-sidebar-primary-foreground"/>
            </div>
            {!collapsed && (<div>
                <h1 className="text-lg font-semibold text-sidebar-foreground">BizFlow</h1>
                <p className="text-xs text-sidebar-foreground/60">Business Manager</p>
              </div>)}
          </div>

          <nav className="flex-1 space-y-1 px-3 py-4">
            {!collapsed && (<p className="mb-2 px-3 text-xs font-medium uppercase tracking-wider text-sidebar-foreground/40">
                Main Menu
              </p>)}
            {visibleNavigation.map((item) => {
            const isActive = location.pathname === item.href;
            return <NavItem key={item.name} item={item} isActive={isActive}/>;
        })}
          </nav>

          <div className="border-t border-sidebar-border px-3 py-4">
            {!collapsed && (<p className="mb-2 px-3 text-xs font-medium uppercase tracking-wider text-sidebar-foreground/40">
                Support
              </p>)}
            {secondaryNavigation.map((item) => {
            const isActive = location.pathname === item.href;
            return <NavItem key={item.name} item={item} isActive={isActive}/>;
        })}
          </div>

          <div className="border-t border-sidebar-border p-4">
            <div className={cn('rounded-lg bg-sidebar-accent', collapsed ? 'p-2' : 'p-3')}>
              <div className={cn('flex items-center', collapsed ? 'justify-center' : 'gap-3')}>
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sidebar-primary text-sm font-medium text-sidebar-primary-foreground">
                  {profile.initials}
                </div>
                {!collapsed && (<div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-sidebar-foreground">{profile.name}</p>
                    <p className="truncate text-xs text-sidebar-foreground/60">{profile.title}</p>
                  </div>)}
              </div>

              {!collapsed && (<div className="mt-3 space-y-2">
                  <EmployeeManagementDialog />
                  <Button variant="outline" size="sm" className="w-full gap-2" onClick={logout}>
                    <LogOut className="h-4 w-4"/>
                    Log Out
                  </Button>
                </div>)}
            </div>
          </div>

          <div className="border-t border-sidebar-border p-2">
            <Button variant="ghost" size="sm" onClick={onToggle} className={cn('w-full text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground', collapsed ? 'justify-center' : 'justify-end')}>
              {collapsed ? (<ChevronRight className="h-4 w-4"/>) : (<>
                  <span className="text-xs">Collapse</span>
                  <ChevronLeft className="ml-1 h-4 w-4"/>
                </>)}
            </Button>
          </div>
        </div>
      </aside>
    </TooltipProvider>);
}
