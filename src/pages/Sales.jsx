import { useMemo, useState } from 'react';
import { MoreHorizontal, Plus, Receipt, Search } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, } from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from '@/components/ui/table';
import { mockCustomers, mockProducts, mockSales } from '@/data/mockData';
import { cn, formatCurrency } from '@/lib/utils';
import { format } from 'date-fns';
import { toast } from 'sonner';
export default function Sales() {
    const [sales, setSales] = useState(mockSales);
    const [searchQuery, setSearchQuery] = useState('');
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [selectedSale, setSelectedSale] = useState(null);
    const [saleToCancel, setSaleToCancel] = useState(null);
    const [newSale, setNewSale] = useState({
        customerId: '',
        productId: '',
        quantity: 1,
        paymentMethod: 'card',
    });
    const filteredSales = useMemo(() => sales.filter((sale) => sale.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sale.id.includes(searchQuery)), [sales, searchQuery]);
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
    const handleAddSale = () => {
        const customer = mockCustomers.find((entry) => entry.id === newSale.customerId);
        const product = mockProducts.find((entry) => entry.id === newSale.productId);
        if (!customer || !product) {
            toast.error('Please choose a customer and product.');
            return;
        }
        const sale = {
            id: Date.now().toString(),
            customerId: customer.id,
            customerName: customer.name,
            items: [
                {
                    productId: product.id,
                    productName: product.name,
                    quantity: newSale.quantity,
                    unitPrice: product.price,
                    total: product.price * newSale.quantity,
                },
            ],
            total: product.price * newSale.quantity,
            status: 'completed',
            paymentMethod: newSale.paymentMethod,
            createdAt: new Date(),
        };
        setSales((current) => [sale, ...current]);
        setNewSale({ customerId: '', productId: '', quantity: 1, paymentMethod: 'card' });
        setIsAddDialogOpen(false);
        toast.success(`Sale recorded for ${customer.name}.`);
    };
    const handlePrintReceipt = (sale) => {
        toast.success(`Receipt prepared for order #${sale.id}.`);
    };
    const handleCancelOrder = () => {
        if (!saleToCancel) {
            return;
        }
        setSales((current) => current.map((sale) => sale.id === saleToCancel.id
            ? {
                ...sale,
                status: 'cancelled',
            }
            : sale));
        toast.success(`Order #${saleToCancel.id} has been cancelled.`);
        setSaleToCancel(null);
    };
    const totalRevenue = filteredSales
        .filter((sale) => sale.status === 'completed')
        .reduce((sum, sale) => sum + sale.total, 0);
    return (<div className="space-y-6">
      <div className="page-header flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="page-title">Sales</h1>
          <p className="page-description">Track and manage your sales transactions</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4"/>
              New Sale
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Record New Sale</DialogTitle>
              <DialogDescription>Enter the sale details below.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label>Customer</Label>
                <Select value={newSale.customerId} onValueChange={(value) => setNewSale((current) => ({ ...current, customerId: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select customer"/>
                  </SelectTrigger>
                  <SelectContent>
                    {mockCustomers.map((customer) => (<SelectItem key={customer.id} value={customer.id}>
                        {customer.name}
                      </SelectItem>))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Product</Label>
                <Select value={newSale.productId} onValueChange={(value) => setNewSale((current) => ({ ...current, productId: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select product"/>
                  </SelectTrigger>
                  <SelectContent>
                    {mockProducts.map((product) => (<SelectItem key={product.id} value={product.id}>
                        {product.name} - {formatCurrency(product.price)}
                      </SelectItem>))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input id="quantity" type="number" min={1} value={newSale.quantity} onChange={(event) => setNewSale((current) => ({
            ...current,
            quantity: parseInt(event.target.value, 10) || 1,
        }))}/>
              </div>
              <div className="grid gap-2">
                <Label>Payment Method</Label>
                <Select value={newSale.paymentMethod} onValueChange={(value) => setNewSale((current) => ({ ...current, paymentMethod: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="card">Card</SelectItem>
                    <SelectItem value="transfer">Bank Transfer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddSale}>Record Sale</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="stat-card flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="rounded-lg bg-success/10 p-3">
            <Receipt className="h-6 w-6 text-success"/>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Revenue (Completed)</p>
            <p className="text-2xl font-semibold">{formatCurrency(totalRevenue)}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Total Transactions</p>
          <p className="text-2xl font-semibold">{filteredSales.length}</p>
        </div>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"/>
        <Input placeholder="Search sales..." value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} className="pl-9"/>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead className="text-right">Date</TableHead>
              <TableHead className="w-[70px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSales.map((sale) => (<TableRow key={sale.id} className="table-row-hover">
                <TableCell className="font-mono text-sm">#{sale.id}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                      {sale.customerName
                .split(' ')
                .map((namePart) => namePart[0])
                .join('')}
                    </div>
                    <span className="font-medium">{sale.customerName}</span>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {sale.items.length} item{sale.items.length > 1 ? 's' : ''}
                </TableCell>
                <TableCell className="capitalize text-muted-foreground">{sale.paymentMethod}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={cn('capitalize', getStatusStyle(sale.status))}>
                    {sale.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right font-semibold">{formatCurrency(sale.total)}</TableCell>
                <TableCell className="text-right text-muted-foreground">
                  {format(sale.createdAt, 'MMM d, yyyy')}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4"/>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setSelectedSale(sale)}>
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handlePrintReceipt(sale)}>
                        Print Receipt
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive" onClick={() => {
                if (sale.status === 'cancelled') {
                    toast.info(`Order #${sale.id} is already cancelled.`);
                    return;
                }
                setSaleToCancel(sale);
            }}>
                        Cancel Order
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={Boolean(selectedSale)} onOpenChange={(open) => {
            if (!open) {
                setSelectedSale(null);
            }
        }}>
        <DialogContent className="sm:max-w-[520px]">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
            <DialogDescription>Review items, totals, and payment details for this sale.</DialogDescription>
          </DialogHeader>
          {selectedSale && (<div className="space-y-4 py-2">
              <div className="grid gap-3 rounded-xl border border-border bg-muted/30 p-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Order ID</p>
                  <p className="mt-1 font-semibold">#{selectedSale.id}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Customer</p>
                  <p className="mt-1 font-semibold">{selectedSale.customerName}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Payment</p>
                  <p className="mt-1 font-semibold capitalize">{selectedSale.paymentMethod}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Status</p>
                  <Badge variant="outline" className={cn('mt-1 capitalize', getStatusStyle(selectedSale.status))}>
                    {selectedSale.status}
                  </Badge>
                </div>
              </div>

              <div className="overflow-hidden rounded-xl border border-border">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead>Product</TableHead>
                      <TableHead className="text-right">Qty</TableHead>
                      <TableHead className="text-right">Unit Price</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedSale.items.map((item) => (<TableRow key={`${selectedSale.id}-${item.productId}`}>
                        <TableCell className="font-medium">{item.productName}</TableCell>
                        <TableCell className="text-right">{item.quantity}</TableCell>
                        <TableCell className="text-right">{formatCurrency(item.unitPrice)}</TableCell>
                        <TableCell className="text-right">{formatCurrency(item.total)}</TableCell>
                      </TableRow>))}
                  </TableBody>
                </Table>
              </div>

              <div className="flex items-center justify-between rounded-lg border border-border p-4">
                <div>
                  <p className="text-sm text-muted-foreground">Order Date</p>
                  <p className="font-medium">{format(selectedSale.createdAt, 'MMM d, yyyy')}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Grand Total</p>
                  <p className="text-xl font-semibold">{formatCurrency(selectedSale.total)}</p>
                </div>
              </div>
            </div>)}
        </DialogContent>
      </Dialog>

      <AlertDialog open={Boolean(saleToCancel)} onOpenChange={(open) => {
            if (!open) {
                setSaleToCancel(null);
            }
        }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel this order?</AlertDialogTitle>
            <AlertDialogDescription>
              {saleToCancel
            ? `Order #${saleToCancel.id} for ${saleToCancel.customerName} will be marked as cancelled.`
            : 'This action cannot be undone.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep Order</AlertDialogCancel>
            <AlertDialogAction onClick={handleCancelOrder}>Cancel Order</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>);
}
