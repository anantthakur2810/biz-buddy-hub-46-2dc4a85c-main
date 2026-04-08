import { CircleGauge, IndianRupee, Package, ShoppingCart, Users } from 'lucide-react';
import { AnalyticsOverview } from '@/components/dashboard/AnalyticsOverview';
import { BusinessAssistant } from '@/components/dashboard/BusinessAssistant';
import { InventoryForecast } from '@/components/dashboard/InventoryForecast';
import { LowStockAlert } from '@/components/dashboard/LowStockAlert';
import { ProfitabilityPanel } from '@/components/dashboard/ProfitabilityPanel';
import { RecentSales } from '@/components/dashboard/RecentSales';
import { RevenueChart } from '@/components/dashboard/RevenueChart';
import { StatCard } from '@/components/dashboard/StatCard';
import { useRole } from '@/context/RoleContext';
import { mockDashboardStats } from '@/data/mockData';
import { roleDashboardSummary } from '@/lib/businessInsights';
import { formatCurrency } from '@/lib/utils';
export default function Dashboard() {
    const stats = mockDashboardStats;
    const { profile } = useRole();
    return (<div className="space-y-6">
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-description">Welcome back! Here&apos;s an overview of your business.</p>
      </div>

      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="rounded-xl bg-primary/10 p-2 text-primary">
            <CircleGauge className="h-5 w-5"/>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Viewing as {profile.label}</p>
            <p className="mt-1 text-base font-semibold text-foreground">{profile.title}</p>
            <div className="mt-3 space-y-1 text-sm text-muted-foreground">
              {(profile.permissions.profit ? roleDashboardSummary.managerFocus : roleDashboardSummary.employeeFocus).map((line) => (<p key={line}>{line}</p>))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Revenue This Month" value={formatCurrency(stats.totalRevenue)} change={`${stats.revenueGrowth}% from last month`} changeType="positive" icon={IndianRupee} iconColor="bg-success/10 text-success"/>
        <StatCard title="Customers" value={stats.totalCustomers.toString()} change={`${stats.customerGrowth}% from last month`} changeType="positive" icon={Users} iconColor="bg-primary/10 text-primary"/>
        <StatCard title="Products" value={stats.totalProducts.toString()} change={`${stats.lowStockItems} low stock`} changeType="negative" icon={Package} iconColor="bg-accent/10 text-accent"/>
        <StatCard title="Sales This Month" value={stats.totalSales.toString()} change="Completed orders" changeType="neutral" icon={ShoppingCart} iconColor="bg-chart-4/10 text-chart-4"/>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <RevenueChart />
        <RecentSales />
      </div>

      {profile.permissions.analytics && <AnalyticsOverview />}

      {profile.permissions.profit ? (<div className="grid gap-6 lg:grid-cols-2">
          <ProfitabilityPanel />
          <InventoryForecast />
        </div>) : (<InventoryForecast />)}

      {profile.permissions.assistant && <BusinessAssistant />}

      <LowStockAlert />
    </div>);
}
