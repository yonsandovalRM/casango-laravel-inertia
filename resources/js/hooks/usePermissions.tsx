import { SharedData } from '@/types';
import { usePage } from '@inertiajs/react';

export const usePermissions = () => {
    const { auth } = usePage<SharedData>().props;
    const permissions = auth?.user?.permissions || [];

    const hasPermission = (permission: string) => {
        return permissions?.includes(permission);
    };
    const hasRole = (role: string) => {
        return auth?.user?.roles?.includes(role);
    };

    return {
        hasPermission,
        hasRole,
    };
};

export const PERMISSIONS = {
    plans: {
        create: 'create plans',
        edit: 'edit plans',
        delete: 'delete plans',
        view: 'view plans',
    },
    tenants: {
        edit: 'edit tenants',
        delete: 'delete tenants',
        view: 'view tenants',
    },
};

export const ROLES = {
    admin: 'admin',
    user: 'user',
};
