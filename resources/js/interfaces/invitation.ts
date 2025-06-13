export interface InvitationResource extends InvitationFormData {
    id: string;
    token: string;
    expires_at: string;
    created_at: string;
    updated_at: string;
}

export type InvitationFormData = {
    name: string;
    email: string;
    role: string;
};
