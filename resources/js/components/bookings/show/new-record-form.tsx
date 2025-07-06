import { Fields } from '@/components/templates/fields';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Template } from '@/interfaces/template';
import { useForm } from '@inertiajs/react';
import { FileText, Save } from 'lucide-react';
import { useState } from 'react';

interface NewRecordFormProps {
    template: Template;
    bookingId: string;
    onSubmit: (data: any) => void;
}

export function NewRecordForm({ template, bookingId, onSubmit }: NewRecordFormProps) {
    const [formData, setFormData] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const form = useForm({
        booking_id: bookingId,
        template_id: template.id,
        fields: {},
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await onSubmit({
                booking_id: bookingId,
                template_id: template.id,
                fields: formData,
            });

            // Reset form after successful submission
            setFormData({});
        } catch (error) {
            console.error('Error submitting form:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!template || !template.fields) {
        return (
            <div className="py-8 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-background">
                    <FileText className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="mb-2 text-lg font-medium text-foreground">Sin plantilla configurada</h3>
                <p className="text-muted-foreground">No hay una plantilla de ficha configurada para este servicio.</p>
            </div>
        );
    }

    return (
        <Card>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        {template.fields.map((field) => (
                            <div key={field.id} className="space-y-2">
                                <Label htmlFor={field.id} className="text-sm font-medium text-foreground">
                                    {field.label}
                                    {field.required && <span className="ml-1 text-red-500">*</span>}
                                </Label>
                                <Fields field={field} form={form} />
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-end space-x-3 border-t pt-6">
                        <Button type="button" variant="outline" onClick={() => setFormData({})} disabled={isSubmitting}>
                            Limpiar
                        </Button>
                        <Button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700">
                            <Save className="mr-2 h-4 w-4" />
                            {isSubmitting ? 'Guardando...' : 'Guardar Ficha'}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
