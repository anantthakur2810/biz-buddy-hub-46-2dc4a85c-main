import { mockProducts } from '@/data/mockData';
import { AlertTriangle } from 'lucide-react';

export function LowStockAlert() {
  const lowStockProducts = mockProducts.filter(p => p.quantity <= p.minStock);

  if (lowStockProducts.length === 0) {
    return null;
  }

  return (
    <div className="stat-card animate-fade-in border-warning/30 bg-warning/5">
      <div className="flex items-center gap-3 mb-4">
        <div className="rounded-lg bg-warning/10 p-2">
          <AlertTriangle className="h-5 w-5 text-warning" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">Low Stock Alert</h3>
          <p className="text-sm text-muted-foreground">{lowStockProducts.length} items need restocking</p>
        </div>
      </div>
      <div className="space-y-3">
        {lowStockProducts.map((product) => (
          <div key={product.id} className="flex items-center justify-between rounded-lg bg-card p-3">
            <div>
              <p className="text-sm font-medium text-foreground">{product.name}</p>
              <p className="text-xs text-muted-foreground">SKU: {product.sku}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-destructive">{product.quantity} left</p>
              <p className="text-xs text-muted-foreground">Min: {product.minStock}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
