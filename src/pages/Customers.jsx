import { useMemo, useState } from 'react';
import { Mail, MoreHorizontal, Phone, Plus, Search } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from '@/components/ui/table';
import { mockCustomers } from '@/data/mockData';
import { formatCurrency } from '@/lib/utils';
import { format } from 'date-fns';
import { toast } from 'sonner';
const emptyCustomerForm = {
    name: '',
    email: '',
    phone: '',
    address: '',
};
export default function Customers() {
    const [customers, setCustomers] = useState(mockCustomers);
    const [searchQuery, setSearchQuery] = useState('');
    const [isCustomerDialogOpen, setIsCustomerDialogOpen] = useState(false);
    const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
    const [dialogMode, setDialogMode] = useState('add');
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [customerToDelete, setCustomerToDelete] = useState(null);
    const [customerForm, setCustomerForm] = useState(emptyCustomerForm);
    const filteredCustomers = useMemo(() => customers.filter((customer) => customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.phone.includes(searchQuery)), [customers, searchQuery]);
    const openAddDialog = () => {
        setDialogMode('add');
        setSelectedCustomer(null);
        setCustomerForm(emptyCustomerForm);
        setIsCustomerDialogOpen(true);
    };
    const openEditDialog = (customer) => {
        setDialogMode('edit');
        setSelectedCustomer(customer);
        setCustomerForm({
            name: customer.name,
            email: customer.email,
            phone: customer.phone,
            address: customer.address,
        });
        setIsCustomerDialogOpen(true);
    };
    const openDetailsDialog = (customer) => {
        setSelectedCustomer(customer);
        setIsDetailsDialogOpen(true);
    };
    const handleSaveCustomer = () => {
        const name = customerForm.name.trim();
        const email = customerForm.email.trim();
        const phone = customerForm.phone.trim();
        const address = customerForm.address.trim();
        if (!name || !email || !phone || !address) {
            toast.error('Please fill in all customer fields.');
            return;
        }
        if (dialogMode === 'add') {
            const customer = {
                id: Date.now().toString(),
                name,
                email,
                phone,
                address,
                createdAt: new Date(),
                totalPurchases: 0,
            };
            setCustomers((current) => [customer, ...current]);
            toast.success('Customer added successfully.');
        }
        else if (selectedCustomer) {
            setCustomers((current) => current.map((customer) => customer.id === selectedCustomer.id
                ? {
                    ...customer,
                    name,
                    email,
                    phone,
                    address,
                }
                : customer));
            setSelectedCustomer((current) => current
                ? {
                    ...current,
                    name,
                    email,
                    phone,
                    address,
                }
                : current);
            toast.success('Customer updated successfully.');
        }
        setCustomerForm(emptyCustomerForm);
        setIsCustomerDialogOpen(false);
    };
    const handleDeleteCustomer = () => {
        if (!customerToDelete) {
            return;
        }
        setCustomers((current) => current.filter((customer) => customer.id !== customerToDelete.id));
        toast.success(`${customerToDelete.name} was removed from your customer list.`);
        setCustomerToDelete(null);
    };
    return (<div className="space-y-6">
      <div className="page-header flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="page-title">Customers</h1>
          <p className="page-description">Manage your customer relationships</p>
        </div>
        <Button className="gap-2" onClick={openAddDialog}>
          <Plus className="h-4 w-4"/>
          Add Customer
        </Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"/>
        <Input placeholder="Search customers..." value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} className="pl-9"/>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Customer</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Address</TableHead>
              <TableHead className="text-right">Total Purchases</TableHead>
              <TableHead className="text-right">Joined</TableHead>
              <TableHead className="w-[70px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCustomers.map((customer) => (<TableRow key={customer.id} className="table-row-hover">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
                      {customer.name
                .split(' ')
                .map((namePart) => namePart[0])
                .join('')}
                    </div>
                    <span className="font-medium">{customer.name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-3.5 w-3.5 text-muted-foreground"/>
                      {customer.email}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Phone className="h-3.5 w-3.5"/>
                      {customer.phone}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">{customer.address}</TableCell>
                <TableCell className="text-right font-medium">
                  {formatCurrency(customer.totalPurchases)}
                </TableCell>
                <TableCell className="text-right text-muted-foreground">
                  {format(customer.createdAt, 'MMM d, yyyy')}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4"/>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => openDetailsDialog(customer)}>
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => openEditDialog(customer)}>
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive" onClick={() => setCustomerToDelete(customer)}>
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isCustomerDialogOpen} onOpenChange={(open) => {
            setIsCustomerDialogOpen(open);
            if (!open) {
                setSelectedCustomer(null);
                setCustomerForm(emptyCustomerForm);
                setDialogMode('add');
            }
        }}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{dialogMode === 'add' ? 'Add New Customer' : 'Edit Customer'}</DialogTitle>
            <DialogDescription>
              {dialogMode === 'add'
            ? "Enter the customer's information below."
            : 'Update the customer profile details below.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="customer-name">Full Name</Label>
              <Input id="customer-name" value={customerForm.name} onChange={(event) => setCustomerForm((current) => ({ ...current, name: event.target.value }))} placeholder="John Doe"/>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="customer-email">Email</Label>
              <Input id="customer-email" type="email" value={customerForm.email} onChange={(event) => setCustomerForm((current) => ({ ...current, email: event.target.value }))} placeholder="john@example.com"/>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="customer-phone">Phone</Label>
              <Input id="customer-phone" value={customerForm.phone} onChange={(event) => setCustomerForm((current) => ({ ...current, phone: event.target.value }))} placeholder="+1 234-567-8900"/>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="customer-address">Address</Label>
              <Input id="customer-address" value={customerForm.address} onChange={(event) => setCustomerForm((current) => ({ ...current, address: event.target.value }))} placeholder="123 Main St, City"/>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCustomerDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveCustomer}>
              {dialogMode === 'add' ? 'Add Customer' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDetailsDialogOpen} onOpenChange={(open) => {
            setIsDetailsDialogOpen(open);
            if (!open) {
                setSelectedCustomer(null);
            }
        }}>
        <DialogContent className="sm:max-w-[460px]">
          <DialogHeader>
            <DialogTitle>Customer Details</DialogTitle>
            <DialogDescription>Quick profile summary for the selected customer.</DialogDescription>
          </DialogHeader>
          {selectedCustomer && (<div className="space-y-4 py-2">
              <div className="rounded-xl border border-border bg-muted/30 p-4">
                <p className="text-lg font-semibold">{selectedCustomer.name}</p>
                <p className="text-sm text-muted-foreground">{selectedCustomer.address}</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-lg border border-border p-3">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Email</p>
                  <p className="mt-1 font-medium">{selectedCustomer.email}</p>
                </div>
                <div className="rounded-lg border border-border p-3">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Phone</p>
                  <p className="mt-1 font-medium">{selectedCustomer.phone}</p>
                </div>
                <div className="rounded-lg border border-border p-3">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Joined</p>
                  <p className="mt-1 font-medium">{format(selectedCustomer.createdAt, 'MMM d, yyyy')}</p>
                </div>
                <div className="rounded-lg border border-border p-3">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Lifetime Value</p>
                  <p className="mt-1 font-medium">{formatCurrency(selectedCustomer.totalPurchases)}</p>
                </div>
              </div>
            </div>)}
        </DialogContent>
      </Dialog>

      <AlertDialog open={Boolean(customerToDelete)} onOpenChange={(open) => {
            if (!open) {
                setCustomerToDelete(null);
            }
        }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete customer?</AlertDialogTitle>
            <AlertDialogDescription>
              {customerToDelete
            ? `This will remove ${customerToDelete.name} from the local customer list.`
            : 'This action cannot be undone.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep Customer</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteCustomer}>Delete Customer</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>);
}
