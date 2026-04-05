import { useMemo, useState } from 'react';
import { AlertTriangle, CheckCircle, Lock, Search } from 'lucide-react';
import {
  annualBusinessSummary,
  benchmarkCategories,
  benchmarkCategoryDatasets,
  benchmarkCategorySummaries,
  currentBusinessBenchmarkCategory,
  currentBusinessBenchmarkCategoryProfile,
  mockDashboardStats,
  yearlyBusinessDataset,
  type BenchmarkCategoryKey,
} from '@/data/mockData';
import { formatCurrency } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const yourBusiness = {
  revenue: annualBusinessSummary.totalRevenue,
  customers: annualBusinessSummary.totalCustomers,
  products: annualBusinessSummary.totalProducts,
  salesCount: annualBusinessSummary.totalOrders,
  revenueGrowth: annualBusinessSummary.revenueGrowth,
  averageOrderValue: annualBusinessSummary.averageOrderValue,
};

const recentSixMonths = yearlyBusinessDataset.slice(-6);

const toPercentile = (yours: number, average: number) => {
  if (average <= 0) {
    return 50;
  }

  return Math.max(35, Math.min(92, Math.round(50 + ((yours - average) / average) * 60)));
};

const percentileToScore = (percentile: number) => {
  if (percentile >= 82) return 'A';
  if (percentile >= 74) return 'A-';
  if (percentile >= 67) return 'B+';
  if (percentile >= 60) return 'B';
  return 'C+';
};

const percentileToRank = (percentile: number) => {
  if (percentile >= 74) return 'top' as const;
  if (percentile >= 60) return 'mid' as const;
  return 'low' as const;
};

const rankColors = {
  top: 'bg-success/15 text-success',
  mid: 'bg-warning/15 text-warning',
  low: 'bg-destructive/15 text-destructive',
};

const insightColors = {
  strength: 'bg-success/15 text-success',
  weakness: 'bg-destructive/15 text-destructive',
  opportunity: 'bg-primary/15 text-primary',
};

export default function Benchmarks() {
  const [selectedCategory, setSelectedCategory] = useState<BenchmarkCategoryKey>(
    currentBusinessBenchmarkCategory,
  );

  const selectedCategoryProfile = useMemo(
    () =>
      benchmarkCategories.find((category) => category.key === selectedCategory) ??
      currentBusinessBenchmarkCategoryProfile,
    [selectedCategory],
  );

  const selectedDataset = benchmarkCategoryDatasets[selectedCategory];
  const selectedSummary = benchmarkCategorySummaries[selectedCategory];
  const excludedCategories = benchmarkCategories
    .filter((category) => category.key !== selectedCategory)
    .map((category) => category.label);

  const percentiles = [
    { label: 'Revenue', value: toPercentile(yourBusiness.revenue, selectedSummary.totalRevenue) },
    { label: 'Customer Base', value: toPercentile(yourBusiness.customers, selectedSummary.totalCustomers) },
    { label: 'Product Range', value: toPercentile(yourBusiness.products, selectedSummary.totalProducts) },
    { label: 'Sales Volume', value: toPercentile(yourBusiness.salesCount, selectedSummary.totalOrders) },
    { label: 'Avg Order Value', value: toPercentile(yourBusiness.averageOrderValue, selectedSummary.averageOrderValue) },
    { label: 'Growth Rate', value: toPercentile(yourBusiness.revenueGrowth, selectedSummary.revenueGrowth) },
  ];

  const comparisons = [
    { label: 'Annual Revenue', yours: yourBusiness.revenue, avg: selectedSummary.totalRevenue, format: (value: number) => formatCurrency(value) },
    { label: 'Customers', yours: yourBusiness.customers, avg: selectedSummary.totalCustomers, format: (value: number) => value.toString() },
    { label: 'Products Listed', yours: yourBusiness.products, avg: selectedSummary.totalProducts, format: (value: number) => value.toString() },
    { label: 'Completed Orders', yours: yourBusiness.salesCount, avg: selectedSummary.totalOrders, format: (value: number) => value.toString() },
    { label: 'Avg Order Value', yours: yourBusiness.averageOrderValue, avg: selectedSummary.averageOrderValue, format: (value: number) => formatCurrency(value) },
    { label: 'Growth Rate', yours: yourBusiness.revenueGrowth, avg: selectedSummary.revenueGrowth, format: (value: number) => `${value}%` },
  ];

  const categories = [
    {
      name: 'Revenue Performance',
      percentile: percentiles[0].value,
      detail: `Benchmarked only against ${selectedCategoryProfile.label.toLowerCase()} peers.`,
    },
    {
      name: 'Customer Retention',
      percentile: percentiles[1].value,
      detail: `Customer scale is compared inside the same category instead of cross-industry traffic.`,
    },
    {
      name: 'Product Diversity',
      percentile: percentiles[2].value,
      detail: `Catalog depth is judged against similar ${selectedCategoryProfile.label.toLowerCase()} stores.`,
    },
    {
      name: 'Sales Velocity',
      percentile: percentiles[3].value,
      detail: `Order throughput reflects the peer group behavior for this business genre.`,
    },
    {
      name: 'Avg Order Value',
      percentile: percentiles[4].value,
      detail: `Basket size is normalized against same-genre stores with similar buying patterns.`,
    },
    {
      name: 'Growth Trajectory',
      percentile: percentiles[5].value,
      detail: `Growth is compared with businesses in the same category cohort for a fairer baseline.`,
    },
  ].map((category) => ({
    ...category,
    score: percentileToScore(category.percentile),
    rank: percentileToRank(category.percentile),
  }));

  const insights = [
    {
      type: 'strength' as const,
      icon: CheckCircle,
      title: 'Category-specific revenue comparison',
      text: `Your completed annual revenue is ${formatCurrency(annualBusinessSummary.totalRevenue)} versus ${formatCurrency(selectedSummary.totalRevenue)} for the ${selectedCategoryProfile.label.toLowerCase()} peer average.`,
    },
    {
      type: 'opportunity' as const,
      icon: Search,
      title: 'Peer customer base is genre-aware',
      text: `The current benchmark uses ${selectedCategoryProfile.peerCount} businesses from the ${selectedCategoryProfile.label.toLowerCase()} cohort, so grocery or fashion stores are not mixed into this comparison.`,
    },
    {
      type: 'strength' as const,
      icon: CheckCircle,
      title: 'Average order value stays meaningful',
      text: `Your average order value is ${formatCurrency(annualBusinessSummary.averageOrderValue)}, compared against a same-category baseline of ${formatCurrency(selectedSummary.averageOrderValue)}.`,
    },
    {
      type: 'weakness' as const,
      icon: AlertTriangle,
      title: 'Low-stock products still need attention',
      text: `${mockDashboardStats.lowStockItems} products are below target stock levels. Keeping best-sellers available is important before chasing more category growth.`,
    },
  ];

  const peerRevenueTrend = selectedDataset.slice(-6).map((month) => month.revenue);
  const yourRevenueTrend = recentSixMonths.map((month) => month.revenue);
  const maxRevenue = Math.max(...yourRevenueTrend, ...peerRevenueTrend) * 1.1;

  return (
    <div className="space-y-6">
      <div className="page-header">
        <h1 className="page-title">Competitive Benchmarks</h1>
        <p className="page-description">Compare your business against peers from the same category, not unrelated industries.</p>
      </div>

      <div className="flex items-center gap-3 rounded-xl bg-muted px-5 py-3 text-sm text-muted-foreground">
        <Lock className="h-5 w-5 shrink-0 text-primary" />
        <span>
          <strong>Category-Aware Benchmarking:</strong> Peer averages are grouped by business genre first, so an electronics store is not compared against grocery, fashion, or home decor businesses.
        </span>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="stat-card animate-fade-in">
          <h3 className="mb-1 text-lg font-semibold text-foreground">Benchmark Category</h3>
          <p className="mb-4 text-sm text-muted-foreground">Choose the business genre that defines the peer cohort used in this comparison.</p>
          <div className="grid gap-4 sm:grid-cols-[220px_1fr]">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Company Genre</p>
              <Select
                value={selectedCategory}
                onValueChange={(value) => setSelectedCategory(value as BenchmarkCategoryKey)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {benchmarkCategories.map((category) => (
                    <SelectItem key={category.key} value={category.key}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="rounded-xl border border-border bg-muted/30 p-4">
              <p className="text-sm font-semibold text-foreground">{selectedCategoryProfile.label}</p>
              <p className="mt-1 text-sm text-muted-foreground">{selectedCategoryProfile.description}</p>
              <p className="mt-3 text-xs text-muted-foreground">
                Recommended classification for this store: <strong>{currentBusinessBenchmarkCategoryProfile.label}</strong>
              </p>
            </div>
          </div>
        </div>

        <div className="stat-card animate-fade-in">
          <h3 className="mb-1 text-lg font-semibold text-foreground">Excluded Cohorts</h3>
          <p className="mb-4 text-sm text-muted-foreground">These categories are kept out of the benchmark so the comparison stays fair.</p>
          <div className="space-y-3">
            {excludedCategories.map((category) => (
              <div key={category} className="rounded-lg border border-border bg-muted/30 px-4 py-3 text-sm text-foreground">
                {category}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="stat-card animate-fade-in">
          <h3 className="mb-1 text-lg font-semibold text-foreground">Your Percentile Ranking</h3>
          <p className="mb-5 text-sm text-muted-foreground">
            Among {selectedCategoryProfile.peerCount} registered businesses in {selectedCategoryProfile.label}
          </p>
          <div className="space-y-4">
            {percentiles.map((percentile) => (
              <div key={percentile.label} className="flex items-center gap-4">
                <span className="w-28 shrink-0 text-sm font-medium text-foreground">{percentile.label}</span>
                <div className="relative h-2 flex-1 rounded-full bg-muted">
                  <div
                    className="absolute top-1/2 h-3.5 w-3.5 -translate-y-1/2 rounded-full border-2 border-card bg-primary transition-all duration-1000"
                    style={{ left: `${percentile.value}%` }}
                  />
                </div>
                <span className="w-12 text-right text-sm font-semibold text-primary">{percentile.value}th</span>
              </div>
            ))}
          </div>
        </div>

        <div className="stat-card animate-fade-in">
          <h3 className="mb-1 text-lg font-semibold text-foreground">Performance vs Category Average</h3>
          <p className="mb-3 text-sm text-muted-foreground">Annual sample-year metrics against the selected genre average</p>
          <div className="mb-4 flex gap-5 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded bg-primary" /> Your Business</span>
            <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded bg-muted-foreground/40" /> Category Avg</span>
          </div>
          <div className="space-y-4">
            {comparisons.map((comparison) => {
              const maxValue = Math.max(comparison.yours, comparison.avg) * 1.15;

              return (
                <div key={comparison.label}>
                  <div className="mb-1 flex justify-between text-xs">
                    <span className="font-medium text-foreground">{comparison.label}</span>
                    <span className="text-muted-foreground">You: {comparison.format(comparison.yours)}</span>
                  </div>
                  <div className="relative h-2.5 overflow-hidden rounded-full bg-muted">
                    <div
                      className="absolute inset-y-0 left-0 rounded-full bg-muted-foreground/30"
                      style={{ width: `${(comparison.avg / maxValue) * 100}%` }}
                    />
                    <div
                      className="absolute inset-y-0 left-0 rounded-full bg-primary"
                      style={{ width: `${(comparison.yours / maxValue) * 100}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="stat-card animate-fade-in">
          <h3 className="mb-1 text-lg font-semibold text-foreground">Category Scores</h3>
          <p className="mb-4 text-sm text-muted-foreground">Your rank across key business dimensions inside this peer group</p>
          <div className="divide-y divide-border">
            {categories.map((category) => (
              <div key={category.name} className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm font-medium text-foreground">{category.name}</p>
                  <p className="text-xs text-muted-foreground">{category.detail}</p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-bold ${rankColors[category.rank]}`}>
                  {category.score}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="stat-card animate-fade-in">
          <h3 className="mb-1 text-lg font-semibold text-foreground">Actionable Insights</h3>
          <p className="mb-4 text-sm text-muted-foreground">Key areas for improvement based on same-category peers</p>
          <div className="space-y-3">
            {insights.map((insight, index) => (
              <div key={index} className="flex items-start gap-3 rounded-xl bg-muted p-3">
                <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${insightColors[insight.type]}`}>
                  <insight.icon className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-foreground">{insight.title}</h4>
                  <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{insight.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="stat-card animate-fade-in">
        <h3 className="mb-1 text-lg font-semibold text-foreground">1-Year Category Dataset</h3>
        <p className="mb-4 text-sm text-muted-foreground">
          Representative month-by-month peer data for {selectedCategoryProfile.label}.
        </p>
        <div className="overflow-x-auto">
          <div className="min-w-[760px]">
            <div className="grid grid-cols-[90px_1.3fr_0.9fr_1fr_1.1fr] rounded-lg bg-muted/60 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              <span>Month</span>
              <span>Peer Revenue</span>
              <span>Orders</span>
              <span>New Customers</span>
              <span>Avg Order Value</span>
            </div>
            {selectedDataset.map((month) => (
              <div
                key={month.name}
                className="grid grid-cols-[90px_1.3fr_0.9fr_1fr_1.1fr] border-b border-border px-4 py-3 text-sm last:border-b-0"
              >
                <span className="font-medium text-foreground">{month.name}</span>
                <span className="text-foreground">{formatCurrency(month.revenue)}</span>
                <span className="text-muted-foreground">{month.orders}</span>
                <span className="text-muted-foreground">{month.newCustomers}</span>
                <span className="text-muted-foreground">{formatCurrency(month.averageOrderValue)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="stat-card animate-fade-in">
        <h3 className="mb-1 text-lg font-semibold text-foreground">6-Month Revenue Trend vs Category Peers</h3>
        <p className="mb-3 text-sm text-muted-foreground">Your revenue trend against the selected peer cohort across the most recent six months</p>
        <div className="mb-4 flex gap-5 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded bg-primary" /> Your Revenue</span>
          <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded bg-muted-foreground/40" /> Peer Median</span>
        </div>
        <div className="flex h-44 items-end gap-4">
          {recentSixMonths.map((month, index) => (
            <div key={month.name} className="flex flex-1 flex-col items-center gap-1">
              <div className="flex h-36 items-end gap-1">
                <div
                  className="w-5 rounded-t bg-primary transition-all duration-700"
                  style={{ height: `${(yourRevenueTrend[index] / maxRevenue) * 140}px` }}
                />
                <div
                  className="w-5 rounded-t bg-muted-foreground/30 transition-all duration-700"
                  style={{ height: `${(peerRevenueTrend[index] / maxRevenue) * 140}px` }}
                />
              </div>
              <span className="text-[11px] text-muted-foreground">{month.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
