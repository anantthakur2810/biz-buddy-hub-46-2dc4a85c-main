import { mockSales } from '@/data/mockData';
import { Badge } from '@/components/ui/badge';
import { cn, formatCurrency } from '@/lib/utils';
export function RecentSales() {
    const recentSales = mockSales.slice(0, 5);
    const getStatusStyle = (status) => {
        switch (status) {
            case 'completed':
                return 'bg-success/10 text-success border-success/20';
            case 'pending':
                return 'bg-warning/10 text-warning border-warning/20';
            case 'cancelled':
                return 'bg-destructive/10 text-destructive border-destructive/20';
            default:
                return 'bg-muted text-muted-foreground';
        }
    };
    return (<div className="stat-card animate-fade-in">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground">Recent Sales</h3>
        <p className="text-sm text-muted-foreground">Latest transactions</p>
      </div>
      <div className="space-y-4">
        {recentSales.map((sale) => (<div key={sale.id} className="flex items-center justify-between py-3 border-b border-border last:border-0">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
                {sale.customerName.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">{sale.customerName}</p>
                <p className="text-xs text-muted-foreground">
                  {sale.items.length} item{sale.items.length > 1 ? 's' : ''}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-foreground">{formatCurrency(sale.total)}</p>
              <Badge variant="outline" className={cn('text-xs capitalize', getStatusStyle(sale.status))}>
                {sale.status}
              </Badge>
            </div>
          </div>))}
      </div>
    </div>);
}
