import { useContext } from 'react';
import { useAuth } from '@/context/AuthContext';
export const roleProfiles = {
    admin: {
        label: 'Admin',
        title: 'Owner & Admin',
        permissions: {
            customers: true,
            benchmarks: true,
            analytics: true,
            profit: true,
            assistant: true,
            manageInventory: true,
            manageEmployees: true,
        },
    },
    manager: {
        label: 'Manager',
        title: 'Operations Manager',
        permissions: {
            customers: true,
            benchmarks: true,
            analytics: true,
            profit: true,
            assistant: true,
            manageInventory: true,
            manageEmployees: true,
        },
    },
    employee: {
        label: 'Employee',
        title: 'Store Associate',
        permissions: {
            customers: false,
            benchmarks: false,
            analytics: true,
            profit: false,
            assistant: false,
            manageInventory: false,
            manageEmployees: false,
        },
    },
};
const RoleContext = {
    Provider: ({ children }) => <>{children}</>,
};
export function RoleProvider({ children }) {
    return <RoleContext.Provider>{children}</RoleContext.Provider>;
}
export function useRole() {
    useContext(RoleContext);
    const { currentUser } = useAuth();
    if (!currentUser) {
        throw new Error('useRole must be used while authenticated.');
    }
    return {
        role: currentUser.role,
        profile: {
            ...roleProfiles[currentUser.role],
            name: currentUser.name,
            initials: currentUser.initials,
        },
    };
}
