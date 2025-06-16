export interface CategoryResource {
    id: string;
    name: string;
    is_active: boolean;
}

export type CategoryFormData = {
    name: string;
    is_active: boolean;
};
