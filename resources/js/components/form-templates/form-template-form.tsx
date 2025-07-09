import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { FormField, FormTemplate } from '@/interfaces/form-template';
import { useForm } from '@inertiajs/react';
import { Calendar, Plus, Trash2, User } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { CardContent, CardHeader, CardItem } from '../ui/card';

interface FormTemplateFormProps {
    template?: FormTemplate;
    isEdit?: boolean;
    onCancel: () => void;
}

type FormData = {
    name: string;
    description: string;
    type: 'user_profile' | 'booking_form';
    is_active: boolean;
    fields: Omit<FormField, 'id' | 'form_template_id' | 'created_at' | 'updated_at' | 'deleted_at'>[];
};

export const FormTemplateForm: React.FC<FormTemplateFormProps> = ({ template, isEdit = false, onCancel }) => {
    const [fields, setFields] = useState<(FormField | Omit<FormField, 'id' | 'form_template_id' | 'created_at' | 'updated_at' | 'deleted_at'>)[]>([]);

    const { data, setData, post, put, processing, errors, reset } = useForm<FormData>({
        name: template?.name || '',
        description: template?.description || '',
        type: template?.type || 'user_profile',
        is_active: template?.is_active ?? true,
        fields: [],
    });

    useEffect(() => {
        if (template) {
            setFields([...template.fields].sort((a, b) => a.order - b.order));
        }
    }, [template]);

    // Sync fields with form data
    useEffect(() => {
        setData(
            'fields',
            fields.map((field, index) => ({
                id: 'id' in field ? field.id : undefined,
                label: field.label,
                name: field.name,
                type: field.type,
                options: field.options,
                placeholder: field.placeholder,
                validation_rules: field.validation_rules,
                order: index + 1,
                is_required: field.is_required,
                default_value: field.default_value,
            })),
        );
    }, [fields, setData]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (isEdit && template) {
            put(route('form-templates.update', template.id));
        } else {
            post(route('form-templates.store'));
        }
    };

    const addField = () => {
        setFields((prev) => [
            ...prev,
            {
                label: '',
                name: '',
                type: 'text',
                options: null,
                placeholder: null,
                validation_rules: null,
                order: prev.length + 1,
                is_required: false,
                default_value: null,
            },
        ]);
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

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                    <Label htmlFor="name">Nombre de la plantilla</Label>
                    <Input
                        id="name"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        placeholder="Ej: Perfil de Usuario"
                        className={errors.name ? 'border-red-500' : ''}
                    />
                    {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="type">Tipo de plantilla</Label>
                    <Select value={data.type} onValueChange={(value: 'user_profile' | 'booking_form') => setData('type', value)}>
                        <SelectTrigger className={errors.type ? 'border-red-500' : ''}>
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
                    {errors.type && <p className="text-sm text-red-500">{errors.type}</p>}
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                    id="description"
                    value={data.description}
                    onChange={(e) => setData('description', e.target.value)}
                    placeholder="Describe el propósito de esta plantilla..."
                    rows={3}
                    className={errors.description ? 'border-red-500' : ''}
                />
                {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
            </div>

            {/* Active Toggle */}
            <div className="flex items-center space-x-2">
                <Switch id="is_active" checked={data.is_active} onCheckedChange={(checked) => setData('is_active', checked)} />
                <Label htmlFor="is_active">Plantilla activa</Label>
            </div>

            {/* Fields Section */}
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Campos del formulario</h3>
                    <Button type="button" onClick={addField} variant="outline" size="sm">
                        <Plus className="mr-2 h-4 w-4" />
                        Agregar Campo
                    </Button>
                </div>

                {fields.map((field, index) => (
                    <CardItem key={index}>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <h4 className="font-medium">Campo #{index + 1}</h4>
                                <div className="flex items-center gap-2">
                                    {isEdit && (
                                        <>
                                            <Button
                                                type="button"
                                                onClick={() => moveField(index, 'up')}
                                                variant="ghost"
                                                size="sm"
                                                disabled={index === 0}
                                            >
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
                                        </>
                                    )}
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
                        </CardHeader>
                        <CardContent className="space-y-4 p-6">
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                                <div className="space-y-2">
                                    <Label>Etiqueta</Label>
                                    <Input
                                        value={field.label}
                                        onChange={(e) => updateField(index, { label: e.target.value })}
                                        placeholder="Ej: Nombre completo"
                                        className={
                                            errors.fields && Array.isArray(errors.fields) && errors.fields[index]?.label ? 'border-red-500' : ''
                                        }
                                    />
                                    {errors.fields && Array.isArray(errors.fields) && errors.fields[index]?.label && (
                                        <p className="text-sm text-red-500">{errors.fields[index].label}</p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label>Nombre interno</Label>
                                    <Input
                                        value={field.name}
                                        onChange={(e) => updateField(index, { name: e.target.value })}
                                        placeholder="Ej: full_name"
                                        className={
                                            errors.fields && Array.isArray(errors.fields) && errors.fields[index]?.name ? 'border-red-500' : ''
                                        }
                                    />
                                    {errors.fields && Array.isArray(errors.fields) && errors.fields[index]?.name && (
                                        <p className="text-sm text-red-500">{errors.fields[index].name}</p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label>Tipo de campo</Label>
                                    <Select value={field.type} onValueChange={(value) => updateField(index, { type: value })}>
                                        <SelectTrigger
                                            className={
                                                errors.fields && Array.isArray(errors.fields) && errors.fields[index]?.type ? 'border-red-500' : ''
                                            }
                                        >
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="text">Texto</SelectItem>
                                            <SelectItem value="textarea">Área de texto</SelectItem>
                                            <SelectItem value="date">Fecha</SelectItem>
                                            <SelectItem value="time">Hora</SelectItem>
                                            <SelectItem value="datetime-local">Fecha y hora</SelectItem>
                                            <SelectItem value="select">Lista desplegable</SelectItem>
                                            <SelectItem value="checkbox">Casillas de verificación</SelectItem>
                                            <SelectItem value="radio">Botones de radio</SelectItem>
                                            <SelectItem value="file">Archivo</SelectItem>
                                            <SelectItem value="email">Email</SelectItem>
                                            <SelectItem value="number">Número</SelectItem>
                                            <SelectItem value="tel">Teléfono</SelectItem>
                                            <SelectItem value="url">URL</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.fields && Array.isArray(errors.fields) && errors.fields[index]?.type && (
                                        <p className="text-sm text-red-500">{errors.fields[index].type}</p>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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

                            {(field.type === 'select' || field.type === 'checkbox' || field.type === 'radio') && (
                                <div className="space-y-2">
                                    <Label>Opciones (separadas por comas)</Label>
                                    <Textarea
                                        value={(() => {
                                            try {
                                                return field.options ? JSON.parse(field.options).join(', ') : '';
                                            } catch {
                                                return '';
                                            }
                                        })()}
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

                            <div className="flex items-center gap-6">
                                <label className="flex items-center gap-2" htmlFor={`required-${index}`}>
                                    <Switch
                                        id={`required-${index}`}
                                        checked={field.is_required}
                                        onCheckedChange={(checked) => updateField(index, { is_required: !!checked })}
                                    />
                                    <span className="text-sm">Campo requerido</span>
                                </label>
                            </div>
                        </CardContent>
                    </CardItem>
                ))}

                {fields.length === 0 && (
                    <div className="py-8 text-center text-muted-foreground">
                        <p>No hay campos agregados aún.</p>
                        <p className="text-sm">Haz clic en "Agregar Campo" para comenzar.</p>
                    </div>
                )}

                {errors.fields && <p className="text-sm text-red-500">{errors.fields}</p>}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-6 pt-6">
                <Button type="submit" disabled={processing}>
                    {processing ? 'Guardando...' : isEdit ? 'Actualizar Plantilla' : 'Crear Plantilla'}
                </Button>
                <Button type="button" variant="outline" onClick={onCancel}>
                    Cancelar
                </Button>
            </div>
        </form>
    );
};
