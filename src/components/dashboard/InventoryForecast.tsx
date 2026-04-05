import { Badge } from '@/components/ui/badge';
import { inventoryForecast } from '@/lib/businessInsights';

const urgencyStyles = {
  high: 'bg-destructive/10 text-destructive border-destructive/20',
  medium: 'bg-warning/10 text-warning border-warning/20',
  low: 'bg-success/10 text-success border-success/20',
};

export function InventoryForecast() {
  return (
    <div className="stat-card animate-fade-in">
      <div className="mb-5">
        <h3 className="text-lg font-semibold text-foreground">Smart Inventory Prediction</h3>
        <p className="text-sm text-muted-foreground">Forecasted stock risk based on average monthly sales in the sample year.</p>
      </div>
      <div className="space-y-3">
        {inventoryForecast.slice(0, 5).map((entry) => (
          <div key={entry.product.id} className="rounded-lg border border-border bg-card p-4">
            <div className="mb-2 flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-foreground">{entry.product.name}</p>
                <p className="text-xs text-muted-foreground">{entry.averageMonthlyDemand} avg units sold per month</p>
              </div>
              <Badge variant="outline" className={urgencyStyles[entry.urgency]}>
                {entry.urgency === 'high' ? 'Urgent' : entry.urgency === 'medium' ? 'Watch' : 'Stable'}
              </Badge>
            </div>
            <div className="grid gap-2 text-sm text-muted-foreground md:grid-cols-3">
              <p>On hand: <span className="font-medium text-foreground">{entry.product.quantity}</span></p>
              <p>
                Stock-out:
                <span className="font-medium text-foreground">
                  {' '}
                  {entry.daysUntilStockout === null ? 'No immediate risk' : `~${entry.daysUntilStockout} days`}
                </span>
              </p>
              <p>Suggested reorder: <span className="font-medium text-foreground">{entry.suggestedReorder}</span></p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
