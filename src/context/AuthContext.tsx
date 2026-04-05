import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { AppRole } from '@/types';

export type AppUser = {
  id: string;
  name: string;
  phone: string;
  password: string;
  role: AppRole;
  title: string;
  initials: string;
};

export type NewEmployeeInput = {
  name: string;
  phone: string;
  password: string;
  title: string;
};

export type UpdateEmployeeInput = {
  name: string;
  phone: string;
  password: string;
  title: string;
};

type AuthContextType = {
  currentUser: AppUser | null;
  users: AppUser[];
  login: (phone: string, password: string) => { success: boolean; message?: string };
  logout: () => void;
  addEmployee: (input: NewEmployeeInput) => { success: boolean; message: string };
  updateEmployee: (employeeId: string, input: UpdateEmployeeInput) => { success: boolean; message: string };
  deleteEmployee: (employeeId: string) => { success: boolean; message: string };
};

const USERS_STORAGE_KEY = 'biz-buddy-users';
const SESSION_STORAGE_KEY = 'biz-buddy-session';

export const seedUsers: AppUser[] = [
  {
    id: 'u-admin-1',
    name: 'Arjun Kumar',
    phone: '9876500001',
    password: 'Admin@123',
    role: 'admin',
    title: 'Owner & Admin',
    initials: 'AK',
  },
  {
    id: 'u-manager-1',
    name: 'Meera Patel',
    phone: '9876500002',
    password: 'Manager@123',
    role: 'manager',
    title: 'Operations Manager',
    initials: 'MP',
  },
  {
    id: 'u-employee-1',
    name: 'Rahul Singh',
    phone: '9876500003',
    password: 'Employee@123',
    role: 'employee',
    title: 'Store Associate',
    initials: 'RS',
  },
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const getStoredUsers = (): AppUser[] => {
  if (typeof window === 'undefined') {
    return seedUsers;
  }

  const storedUsers = window.localStorage.getItem(USERS_STORAGE_KEY);

  if (!storedUsers) {
    return seedUsers;
  }

  try {
    return JSON.parse(storedUsers) as AppUser[];
  } catch {
    return seedUsers;
  }
};

const getStoredSession = () => {
  if (typeof window === 'undefined') {
    return null;
  }

  return window.localStorage.getItem(SESSION_STORAGE_KEY);
};

const buildInitials = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');

const normalizeEmployeeInput = (input: NewEmployeeInput | UpdateEmployeeInput) => ({
  name: input.name.trim(),
  phone: input.phone.trim(),
  password: input.password.trim(),
  title: input.title.trim() || 'Store Associate',
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<AppUser[]>(getStoredUsers);
  const [currentUserId, setCurrentUserId] = useState<string | null>(getStoredSession);

  useEffect(() => {
    window.localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (currentUserId) {
      window.localStorage.setItem(SESSION_STORAGE_KEY, currentUserId);
    } else {
      window.localStorage.removeItem(SESSION_STORAGE_KEY);
    }
  }, [currentUserId]);

  const currentUser = useMemo(
    () => users.find((user) => user.id === currentUserId) ?? null,
    [currentUserId, users],
  );

  const login = (phone: string, password: string) => {
    const normalizedPhone = phone.trim();
    const user = users.find((entry) => entry.phone === normalizedPhone && entry.password === password);

    if (!user) {
      return { success: false, message: 'Invalid phone number or password.' };
    }

    setCurrentUserId(user.id);
    return { success: true };
  };

  const logout = () => {
    setCurrentUserId(null);
  };

  const addEmployee = (input: NewEmployeeInput) => {
    const { name, phone, password, title } = normalizeEmployeeInput(input);

    if (!name || !phone || !password) {
      return { success: false, message: 'Name, phone number, and password are required.' };
    }

    if (users.some((user) => user.phone === phone)) {
      return { success: false, message: 'That phone number is already in use.' };
    }

    const employee: AppUser = {
      id: `u-employee-${Date.now()}`,
      name,
      phone,
      password,
      role: 'employee',
      title,
      initials: buildInitials(name),
    };

    setUsers((previousUsers) => [employee, ...previousUsers]);
    return { success: true, message: 'Employee account created successfully.' };
  };

  const updateEmployee = (employeeId: string, input: UpdateEmployeeInput) => {
    const existingEmployee = users.find((user) => user.id === employeeId);

    if (!existingEmployee || existingEmployee.role !== 'employee') {
      return { success: false, message: 'Employee account not found.' };
    }

    const { name, phone, password, title } = normalizeEmployeeInput(input);

    if (!name || !phone || !password) {
      return { success: false, message: 'Name, phone number, and password are required.' };
    }

    if (users.some((user) => user.phone === phone && user.id !== employeeId)) {
      return { success: false, message: 'That phone number is already in use.' };
    }

    setUsers((previousUsers) =>
      previousUsers.map((user) =>
        user.id === employeeId
          ? {
              ...user,
              name,
              phone,
              password,
              title,
              initials: buildInitials(name),
            }
          : user,
      ),
    );

    return { success: true, message: 'Employee account updated successfully.' };
  };

  const deleteEmployee = (employeeId: string) => {
    const employee = users.find((user) => user.id === employeeId);

    if (!employee || employee.role !== 'employee') {
      return { success: false, message: 'Employee account not found.' };
    }

    setUsers((previousUsers) => previousUsers.filter((user) => user.id !== employeeId));

    if (currentUserId === employeeId) {
      setCurrentUserId(null);
    }

    return { success: true, message: 'Employee account removed successfully.' };
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        users,
        login,
        logout,
        addEmployee,
        updateEmployee,
        deleteEmployee,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}
