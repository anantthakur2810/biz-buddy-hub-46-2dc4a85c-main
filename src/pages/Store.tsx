import { useState } from 'react';
import { ShoppingCart, Search, Plus, Minus, Trash2, ShoppingBag, ArrowLeft, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/context/CartContext';
import { mockProducts } from '@/data/mockData';
import { toast } from 'sonner';

const categories = ['All', ...new Set(mockProducts.map((product) => product.category))];

export default function Store() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeTab, setActiveTab] = useState('browse');
  const [customerInfo, setCustomerInfo] = useState({ name: '', email: '', phone: '', address: '' });
  
  const { items, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, totalAmount } = useCart();

  const filteredProducts = mockProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(price);
  };

  const handleCheckout = () => {
    if (!customerInfo.name || !customerInfo.phone) {
      toast.error('Please fill in required fields');
      return;
    }
    toast.success('Order placed successfully! We will contact you shortly.');
    clearCart();
    setCustomerInfo({ name: '', email: '', phone: '', address: '' });
    setActiveTab('browse');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">BizFlow Store</span>
          </div>
          <Button 
            variant="outline" 
            className="relative"
            onClick={() => setActiveTab('cart')}
          >
            <ShoppingCart className="h-5 w-5" />
            {totalItems > 0 && (
              <Badge className="absolute -right-2 -top-2 h-5 w-5 rounded-full p-0 text-xs">
                {totalItems}
              </Badge>
            )}
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="browse">Browse Products</TabsTrigger>
            <TabsTrigger value="cart">Cart ({totalItems})</TabsTrigger>
          </TabsList>

          {/* Browse Tab */}
          <TabsContent value="browse" className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative max-w-md flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                {categories.map(category => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredProducts.map(product => {
                const cartItem = items.find(item => item.product.id === product.id);
                const isOutOfStock = product.quantity === 0;

                return (
                  <Card key={product.id} className="overflow-hidden">
                    <div className="aspect-square bg-muted flex items-center justify-center">
                      <Package className="h-16 w-16 text-muted-foreground/50" />
                    </div>
                    <CardContent className="p-4">
                      <div className="mb-2 flex items-start justify-between gap-2">
                        <h3 className="font-medium leading-tight">{product.name}</h3>
                        <Badge variant="secondary" className="shrink-0">{product.category}</Badge>
                      </div>
                      <p className="mb-3 text-lg font-bold text-primary">{formatPrice(product.price)}</p>
                      <div className="flex items-center justify-between">
                        <span className={`text-sm ${isOutOfStock ? 'text-destructive' : 'text-muted-foreground'}`}>
                          {isOutOfStock ? 'Out of Stock' : `${product.quantity} in stock`}
                        </span>
                        {cartItem ? (
                          <div className="flex items-center gap-2">
                            <Button size="icon" variant="outline" className="h-8 w-8" onClick={() => updateQuantity(product.id, cartItem.quantity - 1)}>
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-8 text-center font-medium">{cartItem.quantity}</span>
                            <Button size="icon" variant="outline" className="h-8 w-8" onClick={() => updateQuantity(product.id, cartItem.quantity + 1)} disabled={cartItem.quantity >= product.quantity}>
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        ) : (
                          <Button size="sm" onClick={() => addToCart(product)} disabled={isOutOfStock}>
                            <Plus className="mr-1 h-4 w-4" /> Add
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {filteredProducts.length === 0 && (
              <div className="py-12 text-center text-muted-foreground">
                <Package className="mx-auto mb-4 h-12 w-12" />
                <p>No products found</p>
              </div>
            )}
          </TabsContent>

          {/* Cart Tab */}
          <TabsContent value="cart">
            {items.length === 0 ? (
              <div className="py-12 text-center">
                <ShoppingCart className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
                <h2 className="mb-2 text-xl font-semibold">Your cart is empty</h2>
                <p className="mb-4 text-muted-foreground">Add some products to get started</p>
                <Button onClick={() => setActiveTab('browse')}>
                  <ArrowLeft className="mr-2 h-4 w-4" /> Continue Shopping
                </Button>
              </div>
            ) : (
              <div className="grid gap-6 lg:grid-cols-3">
                <div className="space-y-4 lg:col-span-2">
                  {items.map(({ product, quantity }) => (
                    <Card key={product.id}>
                      <CardContent className="flex items-center gap-4 p-4">
                        <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-muted">
                          <Package className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium truncate">{product.name}</h3>
                          <p className="text-sm text-muted-foreground">{formatPrice(product.price)} each</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button size="icon" variant="outline" className="h-8 w-8" onClick={() => updateQuantity(product.id, quantity - 1)}>
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center">{quantity}</span>
                          <Button size="icon" variant="outline" className="h-8 w-8" onClick={() => updateQuantity(product.id, quantity + 1)}>
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <p className="w-24 text-right font-medium">{formatPrice(product.price * quantity)}</p>
                        <Button size="icon" variant="ghost" className="text-destructive" onClick={() => removeFromCart(product.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <Card className="h-fit">
                  <CardContent className="p-6 space-y-4">
                    <h2 className="text-lg font-semibold">Order Summary</h2>
                    <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{formatPrice(totalAmount)}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span className="text-primary">Free</span></div>
                    <Separator />
                    <div className="flex justify-between text-lg font-bold"><span>Total</span><span>{formatPrice(totalAmount)}</span></div>
                    <Separator />
                    <div className="space-y-3">
                      <h3 className="font-medium">Customer Information</h3>
                      <div><Label>Name *</Label><Input value={customerInfo.name} onChange={(e) => setCustomerInfo(p => ({ ...p, name: e.target.value }))} /></div>
                      <div><Label>Phone *</Label><Input value={customerInfo.phone} onChange={(e) => setCustomerInfo(p => ({ ...p, phone: e.target.value }))} /></div>
                      <div><Label>Email</Label><Input type="email" value={customerInfo.email} onChange={(e) => setCustomerInfo(p => ({ ...p, email: e.target.value }))} /></div>
                      <div><Label>Address</Label><Input value={customerInfo.address} onChange={(e) => setCustomerInfo(p => ({ ...p, address: e.target.value }))} /></div>
                    </div>
                    <Button className="w-full" size="lg" onClick={handleCheckout}>Place Order</Button>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
