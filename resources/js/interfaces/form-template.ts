export type FormTemplate = {
    id: string;
    name: string;
    description: string;
    type: 'user_profile' | 'booking_form';
    is_active: boolean;
    fields: FormField[];
    created_at: string;
    updated_at: string;
};
export type FormField = {
    form_template_id: string;
    id: string;
    label: string;
    name: string;
    type: string;
    is_required: boolean;
    options: string | null;
    placeholder: string | null;
    default_value: string | null;
    validation_rules: string | null;
    deleted_at: string | null;
    created_at: string;
    updated_at: string;
    order: number;
};

export interface FieldType {
    value: string;
    label: string;
}
