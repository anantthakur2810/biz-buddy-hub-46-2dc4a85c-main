import { Layers3, ShoppingBag, TrendingUp, UserPlus } from 'lucide-react';
import { analyticsHighlights } from '@/lib/businessInsights';
import { formatCurrency } from '@/lib/utils';

const analyticsCards = [
  {
    label: 'Average Order Value',
    value: formatCurrency(analyticsHighlights.averageOrderValue),
    note: 'Completed orders across the sample year',
    icon: ShoppingBag,
  },
  {
    label: 'Repeat Customer Rate',
    value: `${analyticsHighlights.repeatCustomerRate}%`,
    note: 'Customers with more than one completed order',
    icon: TrendingUp,
  },
  {
    label: 'Top Category',
    value: analyticsHighlights.topCategory?.name ?? 'N/A',
    note: analyticsHighlights.topCategory
      ? `${formatCurrency(analyticsHighlights.topCategory.revenue)} in yearly revenue`
      : 'No category data available yet',
    icon: Layers3,
  },
  {
    label: 'New Customers This Month',
    value: analyticsHighlights.newCustomersThisMonth.toString(),
    note: 'Fresh additions in the latest month of data',
    icon: UserPlus,
  },
];

export function AnalyticsOverview() {
  return (
    <div className="stat-card animate-fade-in">
      <div className="mb-5">
        <h3 className="text-lg font-semibold text-foreground">Analytics Snapshot</h3>
        <p className="text-sm text-muted-foreground">A quick look at order quality, demand mix, and customer movement.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {analyticsCards.map((card) => (
          <div key={card.label} className="rounded-xl border border-border bg-muted/40 p-4">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground">{card.label}</p>
              <div className="rounded-lg bg-primary/10 p-2 text-primary">
                <card.icon className="h-4 w-4" />
              </div>
            </div>
            <p className="text-2xl font-semibold text-foreground">{card.value}</p>
            <p className="mt-2 text-sm text-muted-foreground">{card.note}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
