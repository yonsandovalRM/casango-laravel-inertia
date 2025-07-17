export interface TenantCategoryResource {
    id: string;
    name: string;
    description: string;
    is_active: boolean;
}

export type TenantCategoryFormData = {
    name: string;
    description: string;
    is_active: boolean;
};
