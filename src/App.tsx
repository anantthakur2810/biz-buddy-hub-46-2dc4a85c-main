import { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { RestrictedAccess } from '@/components/layout/RestrictedAccess';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { CartProvider } from '@/context/CartContext';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { RoleProvider, useRole } from '@/context/RoleContext';
import { AppRole } from '@/types';
import Benchmarks from './pages/Benchmarks';
import Customers from './pages/Customers';
import Dashboard from './pages/Dashboard';
import Employees from './pages/Employees';
import Inventory from './pages/Inventory';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import Sales from './pages/Sales';
import Store from './pages/Store';

const queryClient = new QueryClient();

function AuthenticatedLayoutRoute({ children }: { children: ReactNode }) {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  return <AppLayout>{children}</AppLayout>;
}

function ProtectedLayoutRoute({
  allowedRoles,
  children,
}: {
  allowedRoles: AppRole[];
  children: ReactNode;
}) {
  const { currentUser } = useAuth();
  const { role } = useRole();

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(role)) {
    return (
      <AppLayout>
        <RestrictedAccess
          title="Role-Based Access"
          message="This section is available only in Admin and Manager views. Sign in with a higher-level account if you want to demo this panel."
        />
      </AppLayout>
    );
  }

  return <AppLayout>{children}</AppLayout>;
}

function LoginRoute() {
  const { currentUser } = useAuth();

  if (currentUser) {
    return <Navigate to="/" replace />;
  }

  return <Login />;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <CartProvider>
        <AuthProvider>
          <RoleProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/login" element={<LoginRoute />} />
                <Route path="/" element={<AuthenticatedLayoutRoute><Dashboard /></AuthenticatedLayoutRoute>} />
                <Route
                  path="/customers"
                  element={<ProtectedLayoutRoute allowedRoles={['admin', 'manager']}><Customers /></ProtectedLayoutRoute>}
                />
                <Route path="/sales" element={<AuthenticatedLayoutRoute><Sales /></AuthenticatedLayoutRoute>} />
                <Route path="/inventory" element={<AuthenticatedLayoutRoute><Inventory /></AuthenticatedLayoutRoute>} />
                <Route
                  path="/employees"
                  element={<ProtectedLayoutRoute allowedRoles={['admin', 'manager']}><Employees /></ProtectedLayoutRoute>}
                />
                <Route
                  path="/benchmarks"
                  element={<ProtectedLayoutRoute allowedRoles={['admin', 'manager']}><Benchmarks /></ProtectedLayoutRoute>}
                />
                <Route path="/store" element={<Store />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </RoleProvider>
        </AuthProvider>
      </CartProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
