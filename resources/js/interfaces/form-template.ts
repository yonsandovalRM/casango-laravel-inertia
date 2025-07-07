export type FormTemplate = {
    id: string;
    name: string;
    description: string;
    type: string;
    is_active: boolean;
    fields: FormFieldType[];
};
export type FormFieldType = {
    id: string;
    label: string;
    name: string;
    type: string;
    is_required: boolean;
    options: string[];
    placeholder: string;
    default_value: string;
    order: number;
};

export interface FieldType {
    value: string;
    label: string;
}
