import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { FormFieldType, FormTemplate } from '@/interfaces/form-template';
import { useEffect, useState } from 'react';
import InputError from '../input-error';

type DynamicFormProps = {
    template: FormTemplate;
    data: Record<string, any>;
    setData: (key: string, value: any) => void;
    errors: Partial<Record<string, string>>;
    onSubmit: (data: Record<string, any>) => void;
    isProcessing?: boolean;
};

export default function DynamicForm({ template, data, setData, errors, onSubmit, isProcessing = false }: DynamicFormProps) {
    const [formData, setFormData] = useState<Record<string, any>>({});

    // Inicializar formData con datos actuales o valores por defecto
    useEffect(() => {
        const initialData: Record<string, any> = {};

        template.fields.forEach((field) => {
            if (data[field.name] !== undefined) {
                initialData[field.name] = data[field.name];
            } else {
                initialData[field.name] = field.default_value || getDefaultValueForType(field.type);
            }
        });

        setFormData(initialData);
    }, [template.fields, data]);

    const getDefaultValueForType = (type: string): any => {
        switch (type) {
            case 'checkbox':
                return false;
            case 'number':
                return 0;
            case 'select':
            case 'radio':
                return '';
            default:
                return '';
        }
    };

    const handleFieldChange = (fieldName: string, value: any) => {
        setFormData((prev) => ({
            ...prev,
            [fieldName]: value,
        }));
        setData(fieldName, value);
    };

    const renderField = (field: FormFieldType) => {
        const value = formData[field.name];
        const hasError = errors[field.name];

        switch (field.type) {
            case 'text':
            case 'email':
            case 'tel':
            case 'url':
                return (
                    <Input
                        type={field.type}
                        placeholder={field.placeholder}
                        value={value || ''}
                        onChange={(e) => handleFieldChange(field.name, e.target.value)}
                        className={hasError ? 'border-destructive' : ''}
                    />
                );

            case 'number':
                return (
                    <Input
                        type="number"
                        placeholder={field.placeholder}
                        value={value || ''}
                        onChange={(e) => handleFieldChange(field.name, e.target.value)}
                        className={hasError ? 'border-destructive' : ''}
                    />
                );

            case 'date':
                return (
                    <Input
                        type="date"
                        value={value || ''}
                        onChange={(e) => handleFieldChange(field.name, e.target.value)}
                        className={hasError ? 'border-destructive' : ''}
                    />
                );

            case 'time':
                return (
                    <Input
                        type="time"
                        value={value || ''}
                        onChange={(e) => handleFieldChange(field.name, e.target.value)}
                        className={hasError ? 'border-destructive' : ''}
                    />
                );

            case 'datetime-local':
                return (
                    <Input
                        type="datetime-local"
                        value={value || ''}
                        onChange={(e) => handleFieldChange(field.name, e.target.value)}
                        className={hasError ? 'border-destructive' : ''}
                    />
                );

            case 'textarea':
                return (
                    <Textarea
                        placeholder={field.placeholder}
                        value={value || ''}
                        onChange={(e) => handleFieldChange(field.name, e.target.value)}
                        className={hasError ? 'border-destructive' : ''}
                        rows={4}
                    />
                );

            case 'select':
                return (
                    <Select value={value || ''} onValueChange={(selectedValue) => handleFieldChange(field.name, selectedValue)}>
                        <SelectTrigger className={hasError ? 'border-destructive' : ''}>
                            <SelectValue placeholder={field.placeholder} />
                        </SelectTrigger>
                        <SelectContent>
                            {field.options?.map((option: string) => (
                                <SelectItem key={option} value={option}>
                                    {option}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                );

            case 'checkbox':
                return (
                    <div className="flex items-center space-x-2">
                        <Checkbox id={field.name} checked={Boolean(value)} onCheckedChange={(checked) => handleFieldChange(field.name, checked)} />
                        <Label htmlFor={field.name} className="text-sm font-normal">
                            {field.label}
                        </Label>
                    </div>
                );

            case 'radio':
                return (
                    <RadioGroup value={value || ''} onValueChange={(selectedValue) => handleFieldChange(field.name, selectedValue)}>
                        {field.options?.map((option: string) => (
                            <div key={option} className="flex items-center space-x-2">
                                <RadioGroupItem value={option} id={`${field.name}-${option}`} />
                                <Label htmlFor={`${field.name}-${option}`} className="text-sm font-normal">
                                    {option}
                                </Label>
                            </div>
                        ))}
                    </RadioGroup>
                );

            case 'file':
                return (
                    <Input
                        type="file"
                        onChange={(e) => {
                            const file = e.target.files?.[0];
                            handleFieldChange(field.name, file);
                        }}
                        className={hasError ? 'border-destructive' : ''}
                    />
                );

            default:
                return (
                    <Input
                        type="text"
                        placeholder={field.placeholder}
                        value={value || ''}
                        onChange={(e) => handleFieldChange(field.name, e.target.value)}
                        className={hasError ? 'border-destructive' : ''}
                    />
                );
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    // Ordenar campos por orden
    const sortedFields = [...template.fields].sort((a, b) => (a.order || 0) - (b.order || 0));

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
                {sortedFields.map((field: FormFieldType) => (
                    <div key={field.id} className="space-y-2">
                        {field.type !== 'checkbox' && (
                            <Label htmlFor={field.name}>
                                {field.label}
                                {field.is_required && <span className="ml-1 text-destructive">*</span>}
                            </Label>
                        )}
                        {renderField(field)}
                        {errors[field.name] && <InputError message={errors[field.name]} />}
                    </div>
                ))}
            </div>
            <div className="flex justify-end space-x-2">
                <Button type="submit" disabled={isProcessing}>
                    {isProcessing ? 'Guardando...' : 'Guardar'}
                </Button>
            </div>
        </form>
    );
}
