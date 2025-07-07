import { FieldType } from '@/interfaces/form-template';

export function useFieldTypes(t: (key: string) => string): FieldType[] {
    return [
        { value: 'text', label: t('form_fields.types.text') },
        { value: 'textarea', label: t('form_fields.types.textarea') },
        { value: 'email', label: t('form_fields.types.email') },
        { value: 'number', label: t('form_fields.types.number') },
        { value: 'tel', label: t('form_fields.types.tel') },
        { value: 'date', label: t('form_fields.types.date') },
        { value: 'time', label: t('form_fields.types.time') },
        { value: 'datetime-local', label: t('form_fields.types.datetime') },
        { value: 'select', label: t('form_fields.types.select') },
        { value: 'checkbox', label: t('form_fields.types.checkbox') },
        { value: 'radio', label: t('form_fields.types.radio') },
        { value: 'file', label: t('form_fields.types.file') },
    ];
}
