export interface UserResource extends UserFormData {
    id: string;
    created_at: string;
    updated_at: string;
    deleted_at: string;
    role_display_name: string;
}

export type UserFormData = {
    name: string;
    email: string;
    role: string;
};
