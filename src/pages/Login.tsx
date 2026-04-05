import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { LockKeyhole, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/AuthContext';
import { BrandMark } from '@/components/layout/BrandMark';
import { toast } from 'sonner';

export default function Login() {
  const { currentUser, login } = useAuth();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  if (currentUser) {
    return <Navigate to="/" replace />;
  }

  const handleLogin = () => {
    const result = login(phone, password);

    if (!result.success) {
      toast.error(result.message);
      return;
    }

    toast.success('Login successful.');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-background to-secondary/70 px-4 py-10">
      <div className="w-full max-w-md rounded-3xl border border-border bg-card p-8 shadow-lg">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
            <BrandMark className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Biz Buddy Hub</h1>
            <p className="text-sm text-muted-foreground">Sign in to continue to your panel</p>
          </div>
        </div>

        <div className="space-y-5">
          <div className="grid gap-2">
            <Label htmlFor="phone">Phone Number</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="phone"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                className="pl-9"
                placeholder="Enter phone number"
              />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <LockKeyhole className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="pl-9"
                placeholder="Enter password"
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    handleLogin();
                  }
                }}
              />
            </div>
          </div>

          <Button className="w-full" size="lg" onClick={handleLogin}>
            Open Panel
          </Button>
        </div>
      </div>
    </div>
  );
}
