import { profitabilityInsights } from '@/lib/businessInsights';
import { formatCurrency } from '@/lib/utils';
export function ProfitabilityPanel() {
    return (<div className="stat-card animate-fade-in">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Profit Tracking</h3>
          <p className="text-sm text-muted-foreground">Gross profit visibility by month and by product.</p>
        </div>
        <div className="rounded-xl bg-success/10 px-3 py-2 text-right">
          <p className="text-xs uppercase tracking-wide text-success">Annual Margin</p>
          <p className="text-lg font-semibold text-success">{profitabilityInsights.profitMargin}%</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-border bg-muted/40 p-4">
          <p className="text-sm text-muted-foreground">Profit This Month</p>
          <p className="mt-2 text-2xl font-semibold text-foreground">{formatCurrency(profitabilityInsights.thisMonthProfit)}</p>
          <p className="mt-2 text-sm text-success">Change vs last month: {profitabilityInsights.profitGrowth}%</p>
        </div>
        <div className="rounded-xl border border-border bg-muted/40 p-4">
          <p className="text-sm text-muted-foreground">Annual Gross Profit</p>
          <p className="mt-2 text-2xl font-semibold text-foreground">{formatCurrency(profitabilityInsights.annualGrossProfit)}</p>
          <p className="mt-2 text-sm text-muted-foreground">Based on completed orders and current product costs</p>
        </div>
        <div className="rounded-xl border border-border bg-muted/40 p-4">
          <p className="text-sm text-muted-foreground">Top Profit Driver</p>
          <p className="mt-2 text-lg font-semibold text-foreground">{profitabilityInsights.topProducts[0]?.product.name ?? 'N/A'}</p>
          <p className="mt-2 text-sm text-muted-foreground">
            {profitabilityInsights.topProducts[0]
            ? `${formatCurrency(profitabilityInsights.topProducts[0].profit)} profit`
            : 'No product data yet'}
          </p>
        </div>
      </div>

      <div className="mt-5 space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Top Profitable Products</h4>
          <span className="text-xs text-muted-foreground">Yearly sample data</span>
        </div>
        {profitabilityInsights.topProducts.slice(0, 4).map((entry) => (<div key={entry.product.id} className="flex items-center justify-between rounded-lg border border-border bg-card p-3">
            <div>
              <p className="text-sm font-medium text-foreground">{entry.product.name}</p>
              <p className="text-xs text-muted-foreground">{entry.unitsSold} units sold • {entry.margin}% margin</p>
            </div>
            <p className="text-sm font-semibold text-success">{formatCurrency(entry.profit)}</p>
          </div>))}
      </div>
    </div>);
}
