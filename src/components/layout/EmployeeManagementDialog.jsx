import { useMemo, useState } from 'react';
import { Plus, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/AuthContext';
import { useRole } from '@/context/RoleContext';
import { toast } from 'sonner';
export function EmployeeManagementDialog() {
    const { users, addEmployee } = useAuth();
    const { profile } = useRole();
    const [open, setOpen] = useState(false);
    const [form, setForm] = useState({
        name: '',
        phone: '',
        password: '',
        title: '',
    });
    const employees = useMemo(() => users.filter((user) => user.role === 'employee'), [users]);
    if (!profile.permissions.manageEmployees) {
        return null;
    }
    const handleSubmit = () => {
        const result = addEmployee(form);
        if (!result.success) {
            toast.error(result.message);
            return;
        }
        toast.success(result.message);
        setForm({
            name: '',
            phone: '',
            password: '',
            title: '',
        });
        setOpen(false);
    };
    return (<Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="mt-2 w-full gap-2">
          <Plus className="h-4 w-4"/>
          Add Employee
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[560px]">
        <DialogHeader>
          <DialogTitle>Employee Accounts</DialogTitle>
          <DialogDescription>
            Admin and Manager accounts can create employee logins directly from here.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-5 py-2">
          <div className="grid gap-4 rounded-xl border border-border bg-muted/30 p-4">
            <div className="grid gap-2">
              <Label htmlFor="employee-name">Employee Name</Label>
              <Input id="employee-name" value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} placeholder="Riya Sharma"/>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="employee-phone">Phone Number</Label>
                <Input id="employee-phone" value={form.phone} onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))} placeholder="9876500010"/>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="employee-password">Password</Label>
                <Input id="employee-password" type="password" value={form.password} onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))} placeholder="Emp@123"/>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="employee-title">Job Title</Label>
              <Input id="employee-title" value={form.title} onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))} placeholder="Cashier"/>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card">
            <div className="flex items-center gap-2 border-b border-border px-4 py-3">
              <Users className="h-4 w-4 text-primary"/>
              <div>
                <p className="text-sm font-semibold text-foreground">Current Employees</p>
                <p className="text-xs text-muted-foreground">{employees.length} employee account(s)</p>
              </div>
            </div>
            <div className="max-h-56 space-y-2 overflow-y-auto p-4">
              {employees.map((employee) => (<div key={employee.id} className="flex items-center justify-between rounded-lg border border-border bg-muted/30 px-3 py-2">
                  <div>
                    <p className="text-sm font-medium text-foreground">{employee.name}</p>
                    <p className="text-xs text-muted-foreground">{employee.title}</p>
                  </div>
                  <p className="text-xs font-medium text-muted-foreground">{employee.phone}</p>
                </div>))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Create Employee</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>);
}
