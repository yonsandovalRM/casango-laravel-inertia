import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { FormField } from '@/interfaces/template';

export function Fields({ field, form }: { field: FormField; form: any }) {
    const baseProps = {
        id: field.id,
        placeholder: field.placeholder,
        required: field.required,
    };

    switch (field.type) {
        case 'text':
        case 'email':
        case 'phone':
        case 'number':
            return <Input {...baseProps} type={field.type} value={form[field.id]} onChange={(e) => form.setData(field.id, e.target.value)} />;

        case 'date':
        case 'time':
            return <Input {...baseProps} type={field.type} value={form[field.id]} onChange={(e) => form.setData(field.id, e.target.value)} />;

        case 'textarea':
            return <Textarea {...baseProps} rows={3} value={form[field.id]} onChange={(e) => form.setData(field.id, e.target.value)} />;

        case 'select':
            return (
                <Select value={form[field.id]} onValueChange={(value) => form.setData(field.id, value)}>
                    <SelectTrigger>
                        <SelectValue placeholder={field.placeholder} />
                    </SelectTrigger>
                    <SelectContent>
                        {field.options?.map((option, idx) => (
                            <SelectItem key={idx} value={option.toLowerCase().replace(/\s+/g, '-')}>
                                {option}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            );

        case 'checkbox':
            return (
                <div className="space-y-2">
                    {field.options?.map((option, idx) => (
                        <div key={idx} className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                id={`${field.id}-${idx}`}
                                className="rounded"
                                checked={form[field.id]}
                                onChange={(e) => form.setData(field.id, e.target.checked)}
                            />
                            <Label htmlFor={`${field.id}-${idx}`} className="text-sm">
                                {option}
                            </Label>
                        </div>
                    ))}
                </div>
            );

        case 'radio':
            return (
                <div className="space-y-2">
                    {field.options?.map((option, idx) => (
                        <div key={idx} className="flex items-center space-x-2">
                            <input
                                type="radio"
                                id={`${field.id}-${idx}`}
                                name={field.id}
                                className="rounded-full"
                                checked={form[field.id]}
                                onChange={(e) => form.setData(field.id, e.target.value)}
                            />
                            <Label htmlFor={`${field.id}-${idx}`} className="text-sm">
                                {option}
                            </Label>
                        </div>
                    ))}
                </div>
            );

        case 'switch':
            return (
                <div className="flex items-center space-x-2">
                    <Switch id={field.id} checked={form[field.id]} onCheckedChange={(checked) => form.setData(field.id, checked)} />
                    <Label htmlFor={field.id} className="text-sm">
                        {field.placeholder || 'Activar/Desactivar'}
                    </Label>
                </div>
            );

        case 'file':
        case 'image':
            return (
                <Input
                    {...baseProps}
                    type="file"
                    accept={field.type === 'image' ? 'image/*' : undefined}
                    value={form[field.id]}
                    onChange={(e) => form.setData(field.id, e.target.value)}
                />
            );

        default:
            return <Input {...baseProps} value={form[field.id]} onChange={(e) => form.setData(field.id, e.target.value)} />;
    }
}
