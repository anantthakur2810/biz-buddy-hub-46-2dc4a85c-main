import { annualBusinessSummary, mockCustomers, mockProducts, mockSales, yearlyBusinessDataset } from '@/data/mockData';
const roundMetric = (value) => Math.round(value * 100) / 100;
const monthNames = yearlyBusinessDataset.map((month) => month.name);
const completedSales = mockSales.filter((sale) => sale.status === 'completed');
const productLookup = mockProducts.reduce((lookup, product) => {
    lookup[product.id] = product;
    return lookup;
}, {});
const customerOrderCounts = completedSales.reduce((lookup, sale) => {
    lookup[sale.customerId] = (lookup[sale.customerId] ?? 0) + 1;
    return lookup;
}, {});
const monthlyProfitDataset = yearlyBusinessDataset.map((month, monthIndex) => {
    const monthlyCompletedSales = completedSales.filter((sale) => sale.createdAt.getFullYear() === annualBusinessSummary.year &&
        sale.createdAt.getMonth() === monthIndex);
    const profit = roundMetric(monthlyCompletedSales.reduce((sum, sale) => {
        const saleProfit = sale.items.reduce((itemSum, item) => {
            const product = productLookup[item.productId];
            return itemSum + (item.unitPrice - product.cost) * item.quantity;
        }, 0);
        return sum + saleProfit;
    }, 0));
    const averageOrderValue = monthlyCompletedSales.length > 0
        ? roundMetric(month.revenue / monthlyCompletedSales.length)
        : 0;
    return {
        ...month,
        profit,
        margin: month.revenue > 0 ? roundMetric((profit / month.revenue) * 100) : 0,
        averageOrderValue,
    };
});
const latestMonthMetrics = monthlyProfitDataset[monthlyProfitDataset.length - 1];
const previousMonthMetrics = monthlyProfitDataset[monthlyProfitDataset.length - 2];
const productPerformance = mockProducts
    .map((product) => {
    const relevantItems = completedSales.flatMap((sale) => sale.items
        .filter((item) => item.productId === product.id)
        .map((item) => ({
        ...item,
        saleDate: sale.createdAt,
    })));
    const unitsSold = relevantItems.reduce((sum, item) => sum + item.quantity, 0);
    const revenue = roundMetric(relevantItems.reduce((sum, item) => sum + item.total, 0));
    const profit = roundMetric(relevantItems.reduce((sum, item) => sum + (item.unitPrice - product.cost) * item.quantity, 0));
    return {
        product,
        unitsSold,
        revenue,
        profit,
        margin: revenue > 0 ? roundMetric((profit / revenue) * 100) : 0,
    };
})
    .sort((left, right) => right.profit - left.profit);
const categoryPerformance = Object.values(productPerformance.reduce((lookup, entry) => {
    const category = entry.product.category;
    const current = lookup[category] ?? { name: category, revenue: 0, profit: 0, unitsSold: 0 };
    lookup[category] = {
        name: category,
        revenue: roundMetric(current.revenue + entry.revenue),
        profit: roundMetric(current.profit + entry.profit),
        unitsSold: current.unitsSold + entry.unitsSold,
    };
    return lookup;
}, {})).sort((left, right) => right.revenue - left.revenue);
export const analyticsHighlights = {
    averageOrderValue: annualBusinessSummary.averageOrderValue,
    repeatCustomerRate: roundMetric((Object.values(customerOrderCounts).filter((count) => count > 1).length /
        Math.max(Object.keys(customerOrderCounts).length, 1)) * 100),
    topCategory: categoryPerformance[0],
    newCustomersThisMonth: latestMonthMetrics.newCustomers,
    bestSellingProduct: productPerformance[0],
};
export const profitabilityInsights = {
    thisMonthProfit: latestMonthMetrics.profit,
    annualGrossProfit: roundMetric(productPerformance.reduce((sum, entry) => sum + entry.profit, 0)),
    profitGrowth: previousMonthMetrics.profit > 0
        ? roundMetric(((latestMonthMetrics.profit - previousMonthMetrics.profit) / previousMonthMetrics.profit) * 100)
        : 0,
    profitMargin: annualBusinessSummary.totalRevenue > 0
        ? roundMetric((productPerformance.reduce((sum, entry) => sum + entry.profit, 0) / annualBusinessSummary.totalRevenue) * 100)
        : 0,
    topProducts: productPerformance.slice(0, 5),
};
export const inventoryForecast = mockProducts
    .map((product) => {
    const productStats = productPerformance.find((entry) => entry.product.id === product.id);
    const averageMonthlyDemand = roundMetric((productStats?.unitsSold ?? 0) / 12);
    const daysUntilStockout = averageMonthlyDemand > 0
        ? Math.max(1, Math.round((product.quantity / averageMonthlyDemand) * 30))
        : null;
    const suggestedReorder = averageMonthlyDemand > 0
        ? Math.max(product.minStock * 2 - product.quantity, Math.ceil(averageMonthlyDemand * 2))
        : Math.max(product.minStock - product.quantity, 0);
    const urgency = daysUntilStockout === null
        ? 'low'
        : daysUntilStockout <= 21
            ? 'high'
            : daysUntilStockout <= 45
                ? 'medium'
                : 'low';
    return {
        product,
        averageMonthlyDemand,
        daysUntilStockout,
        suggestedReorder,
        urgency,
    };
})
    .sort((left, right) => {
    const urgencyScore = { high: 0, medium: 1, low: 2 };
    return urgencyScore[left.urgency] - urgencyScore[right.urgency];
});
const topCustomer = [...mockCustomers].sort((left, right) => right.totalPurchases - left.totalPurchases)[0];
export const assistantRecommendations = [
    {
        id: 'restock',
        question: 'What should I restock first?',
        answer: (() => {
            const topRisk = inventoryForecast[0];
            if (!topRisk) {
                return 'Inventory looks balanced right now, so no immediate restock is required.';
            }
            const stockoutText = topRisk.daysUntilStockout === null
                ? 'demand is still light'
                : `stock could run out in about ${topRisk.daysUntilStockout} days`;
            return `${topRisk.product.name} should be restocked first because ${stockoutText}. A sensible next purchase is about ${topRisk.suggestedReorder} units based on recent demand.`;
        })(),
    },
    {
        id: 'profit',
        question: 'Where is profit leaking?',
        answer: (() => {
            const weakestMargin = [...productPerformance]
                .filter((entry) => entry.revenue > 0)
                .sort((left, right) => left.margin - right.margin)[0];
            if (!weakestMargin) {
                return 'There is not enough completed sales data yet to identify a low-margin product.';
            }
            return `${weakestMargin.product.name} is the weakest profit performer among sold products at about ${weakestMargin.margin}% margin. Review its pricing, supplier cost, or bundle it with stronger-margin accessories.`;
        })(),
    },
    {
        id: 'customers',
        question: 'Who are my best customers?',
        answer: topCustomer
            ? `${topCustomer.name} is currently the top customer with total purchases of ${topCustomer.totalPurchases.toLocaleString('en-IN', {
                style: 'currency',
                currency: 'INR',
                minimumFractionDigits: 2,
            })}. Repeat-purchase campaigns should target similar high-value customers.`
            : 'There is not enough customer purchase history yet to rank your top buyers.',
    },
    {
        id: 'growth',
        question: 'What is the next growth move?',
        answer: (() => {
            const strongestCategory = categoryPerformance[0];
            const recentRevenue = latestMonthMetrics.revenue;
            const previousRevenue = previousMonthMetrics.revenue;
            if (!strongestCategory) {
                return 'Add more sales data before making growth recommendations.';
            }
            const trend = recentRevenue >= previousRevenue ? 'up' : 'down';
            return `${strongestCategory.name} is your strongest category, and the latest monthly revenue trend is ${trend}. The next growth move should be pushing higher-margin bundles in that category while restocking the fastest movers.`;
        })(),
    },
];
export const roleDashboardSummary = {
    employeeFocus: [
        'Track daily sales and keep fast-moving items available.',
        'Use the inventory forecast to prioritize shelf replenishment.',
    ],
    managerFocus: [
        'Review margin performance and restock timing together.',
        'Use the assistant prompts to spot the next operational action.',
    ],
};
export const businessTrendDataset = monthNames.map((name, index) => ({
    name,
    revenue: yearlyBusinessDataset[index].revenue,
    profit: monthlyProfitDataset[index].profit,
    averageOrderValue: monthlyProfitDataset[index].averageOrderValue,
}));
