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
    users: {
        create: 'create users',
        edit: 'edit users',
        delete: 'delete users',
        view: 'view users',
    },
    invitations: {
        create: 'create invitations',
        view: 'view invitations',
    },
    company: {
        view: 'view company',
        edit: 'edit company',
    },
    services: {
        create: 'create services',
        edit: 'edit services',
        delete: 'delete services',
        view: 'view services',
    },
    categories: {
        create: 'create categories',
        edit: 'edit categories',
        delete: 'delete categories',
        view: 'view categories',
    },
    professional_profile: {
        edit: 'edit professional profile',
        view: 'view professional profile',
    },
    professionals: {
        view: 'view professionals',
        edit: 'edit professionals',
        delete: 'delete professionals',
    },
};

export const ROLES = {
    owner: 'owner',
    admin: 'admin',
    user: 'user',
    client: 'client',
    professional: 'professional',
};
