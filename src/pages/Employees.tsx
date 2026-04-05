import { useMemo, useState } from 'react';
import { Pencil, Trash2, UserPlus, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { AppUser, useAuth } from '@/context/AuthContext';
import { useRole } from '@/context/RoleContext';
import { toast } from 'sonner';

const emptyEmployeeForm = {
  name: '',
  phone: '',
  password: '',
  title: '',
};

export default function Employees() {
  const { users, addEmployee, updateEmployee, deleteEmployee } = useAuth();
  const { profile } = useRole();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [employeeToEdit, setEmployeeToEdit] = useState<AppUser | null>(null);
  const [employeeToDelete, setEmployeeToDelete] = useState<AppUser | null>(null);
  const [createForm, setCreateForm] = useState(emptyEmployeeForm);
  const [editForm, setEditForm] = useState(emptyEmployeeForm);

  const employees = useMemo(
    () => users.filter((user) => user.role === 'employee'),
    [users],
  );

  const openEditDialog = (employee: AppUser) => {
    setEmployeeToEdit(employee);
    setEditForm({
      name: employee.name,
      phone: employee.phone,
      password: employee.password,
      title: employee.title,
    });
    setIsEditDialogOpen(true);
  };

  const handleCreateEmployee = () => {
    const result = addEmployee(createForm);

    if (!result.success) {
      toast.error(result.message);
      return;
    }

    toast.success(result.message);
    setCreateForm(emptyEmployeeForm);
    setIsCreateDialogOpen(false);
  };

  const handleUpdateEmployee = () => {
    if (!employeeToEdit) {
      return;
    }

    const result = updateEmployee(employeeToEdit.id, editForm);

    if (!result.success) {
      toast.error(result.message);
      return;
    }

    toast.success(result.message);
    setEmployeeToEdit(null);
    setEditForm(emptyEmployeeForm);
    setIsEditDialogOpen(false);
  };

  const handleDeleteEmployee = () => {
    if (!employeeToDelete) {
      return;
    }

    const result = deleteEmployee(employeeToDelete.id);

    if (!result.success) {
      toast.error(result.message);
      return;
    }

    toast.success(result.message);
    setEmployeeToDelete(null);
  };

  return (
    <div className="space-y-6">
      <div className="page-header flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="page-title">Manage Employees</h1>
          <p className="page-description">
            Admin and Manager accounts can create, update, and remove employee logins from one place.
          </p>
        </div>
        <Button className="gap-2" onClick={() => setIsCreateDialogOpen(true)}>
          <UserPlus className="h-4 w-4" />
          Add Employee
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Employee Accounts</CardDescription>
            <CardTitle className="text-3xl">{employees.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Your Access Level</CardDescription>
            <CardTitle className="text-3xl">{profile.label}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Default Employee Role</CardDescription>
            <CardTitle className="text-2xl">Operations Access</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Employees can use sales and inventory views, while Admin and Manager retain sensitive controls.
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Users className="h-5 w-5 text-primary" />
              Employee Directory
            </CardTitle>
            <CardDescription>
              Update phone numbers, passwords, and job titles for employee accounts.
            </CardDescription>
          </div>
          <Badge variant="secondary" className="w-fit">
            {employees.length} account{employees.length === 1 ? '' : 's'}
          </Badge>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="overflow-hidden rounded-xl border border-border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Employee</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Job Title</TableHead>
                  <TableHead>Access</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {employees.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="py-10 text-center text-muted-foreground">
                      No employee accounts yet. Create one to unlock the employee panel login.
                    </TableCell>
                  </TableRow>
                ) : (
                  employees.map((employee) => (
                    <TableRow key={employee.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                            {employee.initials}
                          </div>
                          <div>
                            <p className="font-medium">{employee.name}</p>
                            <p className="text-sm text-muted-foreground">{employee.id}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{employee.phone}</TableCell>
                      <TableCell className="text-muted-foreground">{employee.title}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {employee.role}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-2"
                            onClick={() => openEditDialog(employee)}
                          >
                            <Pencil className="h-4 w-4" />
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-2 text-destructive hover:text-destructive"
                            onClick={() => setEmployeeToDelete(employee)}
                          >
                            <Trash2 className="h-4 w-4" />
                            Remove
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add Employee</DialogTitle>
            <DialogDescription>Create a new employee login for the staff panel.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="create-employee-name">Employee Name</Label>
              <Input
                id="create-employee-name"
                value={createForm.name}
                onChange={(event) => setCreateForm((current) => ({ ...current, name: event.target.value }))}
                placeholder="Riya Sharma"
              />
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="create-employee-phone">Phone Number</Label>
                <Input
                  id="create-employee-phone"
                  value={createForm.phone}
                  onChange={(event) => setCreateForm((current) => ({ ...current, phone: event.target.value }))}
                  placeholder="9876500010"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="create-employee-password">Password</Label>
                <Input
                  id="create-employee-password"
                  type="password"
                  value={createForm.password}
                  onChange={(event) => setCreateForm((current) => ({ ...current, password: event.target.value }))}
                  placeholder="Emp@123"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="create-employee-title">Job Title</Label>
              <Input
                id="create-employee-title"
                value={createForm.title}
                onChange={(event) => setCreateForm((current) => ({ ...current, title: event.target.value }))}
                placeholder="Cashier"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateEmployee}>Create Employee</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={isEditDialogOpen}
        onOpenChange={(open) => {
          setIsEditDialogOpen(open);
          if (!open) {
            setEmployeeToEdit(null);
            setEditForm(emptyEmployeeForm);
          }
        }}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Employee</DialogTitle>
            <DialogDescription>Update the login details for this employee account.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-employee-name">Employee Name</Label>
              <Input
                id="edit-employee-name"
                value={editForm.name}
                onChange={(event) => setEditForm((current) => ({ ...current, name: event.target.value }))}
              />
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="edit-employee-phone">Phone Number</Label>
                <Input
                  id="edit-employee-phone"
                  value={editForm.phone}
                  onChange={(event) => setEditForm((current) => ({ ...current, phone: event.target.value }))}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-employee-password">Password</Label>
                <Input
                  id="edit-employee-password"
                  type="password"
                  value={editForm.password}
                  onChange={(event) => setEditForm((current) => ({ ...current, password: event.target.value }))}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-employee-title">Job Title</Label>
              <Input
                id="edit-employee-title"
                value={editForm.title}
                onChange={(event) => setEditForm((current) => ({ ...current, title: event.target.value }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateEmployee}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={Boolean(employeeToDelete)}
        onOpenChange={(open) => {
          if (!open) {
            setEmployeeToDelete(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove employee account?</AlertDialogTitle>
            <AlertDialogDescription>
              {employeeToDelete
                ? `This will remove the login for ${employeeToDelete.name}. This action only affects the mock local account list.`
                : 'This action cannot be undone.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep Account</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteEmployee}>Remove Account</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
