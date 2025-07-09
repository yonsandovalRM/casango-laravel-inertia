import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { FormField, FormTemplate } from '@/interfaces/form-template';
import { Calendar, Edit, Plus, Trash2, User } from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface EditTemplateDialogProps {
    isOpen: boolean;
    template: FormTemplate | null;
    onClose: () => void;
    onSave: (template: FormTemplate) => void;
}

export const EditTemplateDialog: React.FC<EditTemplateDialogProps> = ({ isOpen, template, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        type: 'user_profile' as 'user_profile' | 'booking_form',
    });

    const [fields, setFields] = useState<FormField[]>([]);

    useEffect(() => {
        if (template) {
            setFormData({
                name: template.name,
                description: template.description,
                type: template.type,
            });
            setFields([...template.fields].sort((a, b) => a.order - b.order));
        }
    }, [template]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!template) return;

        const updatedTemplate: FormTemplate = {
            ...template,
            name: formData.name,
            description: formData.description,
            type: formData.type,
            updated_at: new Date().toISOString(),
            fields: fields.map((field, index) => ({
                ...field,
                order: index + 1,
                updated_at: new Date().toISOString(),
            })),
        };

        onSave(updatedTemplate);
    };

    const addField = () => {
        const newField: FormField = {
            id: `field-${Date.now()}`,
            form_template_id: template?.id || '',
            label: '',
            name: '',
            type: 'text',
            options: null,
            placeholder: null,
            validation_rules: null,
            order: fields.length + 1,
            is_required: false,
            default_value: null,
            deleted_at: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        };
        setFields((prev) => [...prev, newField]);
    };

    const removeField = (index: number) => {
        setFields((prev) => prev.filter((_, i) => i !== index));
    };

    const updateField = (index: number, updates: Partial<FormField>) => {
        setFields((prev) => prev.map((field, i) => (i === index ? { ...field, ...updates } : field)));
    };

    const moveField = (index: number, direction: 'up' | 'down') => {
        if ((direction === 'up' && index === 0) || (direction === 'down' && index === fields.length - 1)) {
            return;
        }

        const newFields = [...fields];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        [newFields[index], newFields[targetIndex]] = [newFields[targetIndex], newFields[index]];
        setFields(newFields);
    };

    if (!template) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Edit className="h-5 w-5" />
                        Editar Plantilla: {template.name}
                    </DialogTitle>
                    <DialogDescription>Modifica la información y campos de la plantilla.</DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Info */}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="name">Nombre de la plantilla</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                                placeholder="Ej: Perfil de Usuario"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="type">Tipo de plantilla</Label>
                            <Select
                                value={formData.type}
                                onValueChange={(value: 'user_profile' | 'booking_form') => setFormData((prev) => ({ ...prev, type: value }))}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="user_profile">
                                        <div className="flex items-center gap-2">
                                            <User className="h-4 w-4" />
                                            Perfil de Usuario
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="booking_form">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="h-4 w-4" />
                                            Formulario de Reserva
                                        </div>
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Descripción</Label>
                        <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                            placeholder="Describe el propósito de esta plantilla..."
                            rows={3}
                            required
                        />
                    </div>

                    {/* Fields Section */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold">Campos del formulario</h3>
                            <Button type="button" onClick={addField} variant="outline" size="sm">
                                <Plus className="mr-2 h-4 w-4" />
                                Agregar Campo
                            </Button>
                        </div>

                        {fields.map((field, index) => (
                            <div key={field.id} className="space-y-4 rounded-lg border bg-card p-4">
                                <div className="flex items-center justify-between">
                                    <h4 className="font-medium">Campo #{index + 1}</h4>
                                    <div className="flex items-center gap-2">
                                        <Button type="button" onClick={() => moveField(index, 'up')} variant="ghost" size="sm" disabled={index === 0}>
                                            ↑
                                        </Button>
                                        <Button
                                            type="button"
                                            onClick={() => moveField(index, 'down')}
                                            variant="ghost"
                                            size="sm"
                                            disabled={index === fields.length - 1}
                                        >
                                            ↓
                                        </Button>
                                        <Button
                                            type="button"
                                            onClick={() => removeField(index)}
                                            variant="ghost"
                                            size="sm"
                                            className="text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-900 dark:hover:text-red-400"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label>Etiqueta</Label>
                                        <Input
                                            value={field.label}
                                            onChange={(e) => updateField(index, { label: e.target.value })}
                                            placeholder="Ej: Nombre completo"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Nombre interno</Label>
                                        <Input
                                            value={field.name}
                                            onChange={(e) => updateField(index, { name: e.target.value })}
                                            placeholder="Ej: full_name"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Tipo de campo</Label>
                                        <Select value={field.type} onValueChange={(value) => updateField(index, { type: value })}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="text">Texto</SelectItem>
                                                <SelectItem value="textarea">Área de texto</SelectItem>
                                                <SelectItem value="date">Fecha</SelectItem>
                                                <SelectItem value="select">Lista desplegable</SelectItem>
                                                <SelectItem value="checkbox">Casillas de verificación</SelectItem>
                                                <SelectItem value="file">Archivo</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label>Placeholder</Label>
                                        <Input
                                            value={field.placeholder || ''}
                                            onChange={(e) => updateField(index, { placeholder: e.target.value || null })}
                                            placeholder="Texto de ayuda..."
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Valor por defecto</Label>
                                        <Input
                                            value={field.default_value || ''}
                                            onChange={(e) => updateField(index, { default_value: e.target.value || null })}
                                            placeholder="Valor inicial..."
                                        />
                                    </div>
                                </div>
                                {(field.type === 'select' || field.type === 'checkbox') && (
                                    <div className="space-y-2">
                                        <Label>Opciones (separadas por comas)</Label>
                                        <Textarea
                                            value={field.options ? JSON.parse(field.options).join(', ') : ''}
                                            onChange={(e) => {
                                                const options = e.target.value
                                                    .split(',')
                                                    .map((s) => s.trim())
                                                    .filter(Boolean);
                                                updateField(index, {
                                                    options: options.length > 0 ? JSON.stringify(options) : null,
                                                });
                                            }}
                                            placeholder="Opción 1, Opción 2, Opción 3..."
                                            rows={2}
                                        />
                                    </div>
                                )}
                                <div className="flex items-center gap-4">
                                    <label className="flex items-center gap-2" htmlFor={`required-${field.id}`}>
                                        <Switch
                                            id={`required-${field.id}`}
                                            checked={field.is_required}
                                            onCheckedChange={(checked) => updateField(index, { is_required: !!checked })}
                                        />
                                        <span className="text-sm">Campo requerido</span>
                                    </label>
                                </div>
                            </div>
                        ))}

                        {fields.length === 0 && (
                            <div className="py-8 text-center text-muted-foreground">
                                <p>No hay campos en esta plantilla.</p>
                                <p className="text-sm">Haz clic en "Agregar Campo" para comenzar.</p>
                            </div>
                        )}
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={!formData.name || !formData.description}>
                            Guardar Cambios
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};
