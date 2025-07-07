import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { FormFieldType, FormTemplate } from '@/interfaces/form-template';
import InputError from '../input-error';

type DynamicFormProps = {
    template: FormTemplate;
    data: any;
    setData: (key: string, value: any) => void;
    errors: any;
    onSubmit: (data: any) => void;
};

export default function DynamicForm({ template, data, setData, errors, onSubmit }: DynamicFormProps) {
    const renderField = (field: FormFieldType) => {
        switch (field.type) {
            case 'text':
            case 'email':
            case 'number':
            case 'tel':
            case 'date':
            case 'time':
                return (
                    <Input
                        type={field.type}
                        placeholder={field.placeholder}
                        value={data[field.name] as string}
                        onChange={(e) => setData(field.name, e.target.value)}
                    />
                );
            case 'textarea':
                return (
                    <Textarea
                        placeholder={field.placeholder}
                        value={data[field.name] as string}
                        onChange={(e) => setData(field.name, e.target.value)}
                    />
                );
            case 'select':
                return (
                    <Select onValueChange={(value) => setData(field.name, value)}>
                        <SelectTrigger>
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
                        <Switch
                            id={field.name}
                            defaultChecked={data[field.name] === 'true'}
                            onCheckedChange={(checked) => setData(field.name, checked.toString())}
                        />
                        <Label htmlFor={field.name}>{field.label}</Label>
                    </div>
                );
            default:
                return <Input type="text" />;
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(data);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
                {template.fields.map((field: FormFieldType) => (
                    <div key={field.id} className="space-y-2">
                        <Label htmlFor={field.name}>
                            {field.label}
                            {field.is_required && <span className="ml-1 text-destructive">*</span>}
                        </Label>
                        {renderField(field)}
                        <InputError message={(errors[field.name] as string) || ''} />
                    </div>
                ))}
            </div>
            <div className="flex justify-end">
                <Button type="submit">Save</Button>
            </div>
        </form>
    );
}
