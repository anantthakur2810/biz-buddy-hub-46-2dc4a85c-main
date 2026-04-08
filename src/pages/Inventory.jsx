import { useState } from 'react';
import { Plus, Search, MoreHorizontal, Package, AlertTriangle, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { InventoryForecast } from '@/components/dashboard/InventoryForecast';
import { useRole } from '@/context/RoleContext';
import { mockProducts } from '@/data/mockData';
import { cn, formatCurrency } from '@/lib/utils';
import { toast } from 'sonner';
const categories = [...new Set(mockProducts.map((product) => product.category))];
export default function Inventory() {
    const { profile } = useRole();
    const [products, setProducts] = useState(mockProducts);
    const [searchQuery, setSearchQuery] = useState('');
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isAdjustStockDialogOpen, setIsAdjustStockDialogOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [stockAdjustment, setStockAdjustment] = useState({ type: 'add', amount: 0 });
    const [newProduct, setNewProduct] = useState({
        name: '',
        sku: '',
        category: '',
        price: 0,
        cost: 0,
        quantity: 0,
        minStock: 10,
    });
    const filteredProducts = products.filter((product) => product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchQuery.toLowerCase()));
    const handleAddProduct = () => {
        const product = {
            id: Date.now().toString(),
            ...newProduct,
            createdAt: new Date(),
        };
        setProducts([product, ...products]);
        setNewProduct({
            name: '',
            sku: '',
            category: '',
            price: 0,
            cost: 0,
            quantity: 0,
            minStock: 10,
        });
        setIsAddDialogOpen(false);
        toast.success('Product added successfully');
    };
    const handleEditProduct = () => {
        if (!selectedProduct)
            return;
        setProducts(products.map(p => p.id === selectedProduct.id ? selectedProduct : p));
        setIsEditDialogOpen(false);
        setSelectedProduct(null);
        toast.success('Product updated successfully');
    };
    const handleAdjustStock = () => {
        if (!selectedProduct)
            return;
        const newQuantity = stockAdjustment.type === 'add'
            ? selectedProduct.quantity + stockAdjustment.amount
            : Math.max(0, selectedProduct.quantity - stockAdjustment.amount);
        setProducts(products.map(p => p.id === selectedProduct.id ? { ...p, quantity: newQuantity } : p));
        setIsAdjustStockDialogOpen(false);
        setSelectedProduct(null);
        setStockAdjustment({ type: 'add', amount: 0 });
        toast.success(`Stock ${stockAdjustment.type === 'add' ? 'increased' : 'decreased'} successfully`);
    };
    const handleDeleteProduct = (productId) => {
        setProducts(products.filter(p => p.id !== productId));
        toast.success('Product deleted successfully');
    };
    const openEditDialog = (product) => {
        setSelectedProduct({ ...product });
        setIsEditDialogOpen(true);
    };
    const openAdjustStockDialog = (product) => {
        setSelectedProduct(product);
        setStockAdjustment({ type: 'add', amount: 0 });
        setIsAdjustStockDialogOpen(true);
    };
    const getStockStatus = (product) => {
        if (product.quantity === 0) {
            return { label: 'Out of Stock', style: 'bg-destructive/10 text-destructive border-destructive/20' };
        }
        if (product.quantity <= product.minStock) {
            return { label: 'Low Stock', style: 'bg-warning/10 text-warning border-warning/20' };
        }
        return { label: 'In Stock', style: 'bg-success/10 text-success border-success/20' };
    };
    const totalValue = filteredProducts.reduce((sum, p) => sum + (p.price * p.quantity), 0);
    const lowStockCount = filteredProducts.filter(p => p.quantity <= p.minStock).length;
    const canManageInventory = profile.permissions.manageInventory;
    return (<div className="space-y-6">
      <div className="page-header flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-title">Inventory</h1>
          <p className="page-description">Manage your product stock and pricing</p>
        </div>
        {canManageInventory && (<Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4"/>
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Add New Product</DialogTitle>
                <DialogDescription>
                  Enter the product details below.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Product Name</Label>
                    <Input id="name" value={newProduct.name} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} placeholder="Product name"/>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="sku">SKU</Label>
                    <Input id="sku" value={newProduct.sku} onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })} placeholder="SKU-001"/>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label>Category</Label>
                  <Select value={newProduct.category} onValueChange={(value) => setNewProduct({ ...newProduct, category: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category"/>
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (<SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="price">Selling Price</Label>
                    <Input id="price" type="number" min={0} step={0.01} value={newProduct.price} onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) || 0 })}/>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="cost">Cost Price</Label>
                    <Input id="cost" type="number" min={0} step={0.01} value={newProduct.cost} onChange={(e) => setNewProduct({ ...newProduct, cost: parseFloat(e.target.value) || 0 })}/>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="quantity">Initial Quantity</Label>
                    <Input id="quantity" type="number" min={0} value={newProduct.quantity} onChange={(e) => setNewProduct({ ...newProduct, quantity: parseInt(e.target.value) || 0 })}/>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="minStock">Minimum Stock</Label>
                    <Input id="minStock" type="number" min={0} value={newProduct.minStock} onChange={(e) => setNewProduct({ ...newProduct, minStock: parseInt(e.target.value) || 0 })}/>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddProduct}>Add Product</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>)}
      </div>

      {!canManageInventory && (<div className="rounded-xl border border-border bg-card p-4 text-sm text-muted-foreground shadow-sm">
          You are in Employee view. Inventory is visible for day-to-day operations, but product creation, editing, and stock adjustments stay locked to Manager and Admin roles.
        </div>)}

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="stat-card flex items-center gap-4">
          <div className="rounded-lg bg-primary/10 p-3">
            <Package className="h-6 w-6 text-primary"/>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Products</p>
            <p className="text-2xl font-semibold">{filteredProducts.length}</p>
          </div>
        </div>
        <div className="stat-card flex items-center gap-4">
          <div className="rounded-lg bg-success/10 p-3">
            <Package className="h-6 w-6 text-success"/>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Inventory Value</p>
            <p className="text-2xl font-semibold">{formatCurrency(totalValue)}</p>
          </div>
        </div>
        <div className="stat-card flex items-center gap-4">
          <div className="rounded-lg bg-warning/10 p-3">
            <AlertTriangle className="h-6 w-6 text-warning"/>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Low Stock Items</p>
            <p className="text-2xl font-semibold">{lowStockCount}</p>
          </div>
        </div>
      </div>

      <InventoryForecast />

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"/>
        <Input placeholder="Search products..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9"/>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Product</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead className="text-right">Quantity</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.map((product) => {
            const stockStatus = getStockStatus(product);
            return (<TableRow key={product.id} className="table-row-hover">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-sm">
                        <Package className="h-5 w-5 text-muted-foreground"/>
                      </div>
                      <span className="font-medium">{product.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-sm text-muted-foreground">
                    {product.sku}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{product.category}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div>
                      <span className="font-semibold">{formatCurrency(product.price)}</span>
                      <p className="text-xs text-muted-foreground">Cost: {formatCurrency(product.cost)}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className={cn('font-medium', product.quantity <= product.minStock && 'text-warning', product.quantity === 0 && 'text-destructive')}>
                      {product.quantity}
                    </span>
                    <p className="text-xs text-muted-foreground">Min: {product.minStock}</p>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={stockStatus.style}>
                      {stockStatus.label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {canManageInventory ? (<DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4"/>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openEditDialog(product)}>
                            Edit Product
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openAdjustStockDialog(product)}>
                            Adjust Stock
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteProduct(product.id)}>
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>) : (<span className="text-xs text-muted-foreground">View only</span>)}
                  </TableCell>
                </TableRow>);
        })}
          </TableBody>
        </Table>
      </div>

      {/* Edit Product Dialog */}
      <Dialog open={isEditDialogOpen && canManageInventory} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>
              Update the product details below.
            </DialogDescription>
          </DialogHeader>
          {selectedProduct && (<div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-name">Product Name</Label>
                  <Input id="edit-name" value={selectedProduct.name} onChange={(e) => setSelectedProduct({ ...selectedProduct, name: e.target.value })}/>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-sku">SKU</Label>
                  <Input id="edit-sku" value={selectedProduct.sku} onChange={(e) => setSelectedProduct({ ...selectedProduct, sku: e.target.value })}/>
                </div>
              </div>
              <div className="grid gap-2">
                <Label>Category</Label>
                <Select value={selectedProduct.category} onValueChange={(value) => setSelectedProduct({ ...selectedProduct, category: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category"/>
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (<SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-price">Selling Price</Label>
                  <Input id="edit-price" type="number" min={0} step={0.01} value={selectedProduct.price} onChange={(e) => setSelectedProduct({ ...selectedProduct, price: parseFloat(e.target.value) || 0 })}/>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-cost">Cost Price</Label>
                  <Input id="edit-cost" type="number" min={0} step={0.01} value={selectedProduct.cost} onChange={(e) => setSelectedProduct({ ...selectedProduct, cost: parseFloat(e.target.value) || 0 })}/>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-minStock">Minimum Stock Level</Label>
                <Input id="edit-minStock" type="number" min={0} value={selectedProduct.minStock} onChange={(e) => setSelectedProduct({ ...selectedProduct, minStock: parseInt(e.target.value) || 0 })}/>
              </div>
            </div>)}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditProduct}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Adjust Stock Dialog */}
      <Dialog open={isAdjustStockDialogOpen && canManageInventory} onOpenChange={setIsAdjustStockDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Adjust Stock</DialogTitle>
            <DialogDescription>
              {selectedProduct && (<>Adjust stock for <strong>{selectedProduct.name}</strong>. Current quantity: <strong>{selectedProduct.quantity}</strong></>)}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex gap-2">
              <Button type="button" variant={stockAdjustment.type === 'add' ? 'default' : 'outline'} className="flex-1 gap-2" onClick={() => setStockAdjustment({ ...stockAdjustment, type: 'add' })}>
                <Plus className="h-4 w-4"/>
                Add Stock
              </Button>
              <Button type="button" variant={stockAdjustment.type === 'subtract' ? 'default' : 'outline'} className="flex-1 gap-2" onClick={() => setStockAdjustment({ ...stockAdjustment, type: 'subtract' })}>
                <Minus className="h-4 w-4"/>
                Remove Stock
              </Button>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="adjust-amount">Quantity</Label>
              <Input id="adjust-amount" type="number" min={0} value={stockAdjustment.amount} onChange={(e) => setStockAdjustment({ ...stockAdjustment, amount: parseInt(e.target.value) || 0 })} placeholder="Enter quantity"/>
            </div>
            {selectedProduct && stockAdjustment.amount > 0 && (<p className="text-sm text-muted-foreground">
                New quantity will be: <strong>
                  {stockAdjustment.type === 'add'
                ? selectedProduct.quantity + stockAdjustment.amount
                : Math.max(0, selectedProduct.quantity - stockAdjustment.amount)}
                </strong>
              </p>)}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAdjustStockDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAdjustStock} disabled={stockAdjustment.amount <= 0}>
              Confirm Adjustment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>);
}
