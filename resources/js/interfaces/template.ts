export interface Template {
    id: string;
    name: string;
    description: string;
    fields: FormField[];
}

export interface FormField {
    id: string;
    label: string;
    type: string;
    required: boolean;
    placeholder: string;
    options: string[];
}

export interface ClientHistory {
    id: string;
    date: string;
    professional: string;
    booking_id: string;
    fields: ClientHistoryField[];
}

export interface ClientHistoryField {
    [key: string]: string;
}
