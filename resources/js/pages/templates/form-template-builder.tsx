import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Eye, EyeOff, GripVertical, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

const FormTemplateBuilder = () => {
    interface FormField {
        id: number;
        label: string;
        type: string;
        placeholder: string;
        required: boolean;
        options: string[];
    }

    const [template, setTemplate] = useState<{
        name: string;
        description: string;
        visibility: string;
        fields: FormField[];
    }>({
        name: '',
        description: '',
        visibility: 'private',
        fields: [],
    });

    const [previewMode, setPreviewMode] = useState(false);

    const fieldTypes = [
        { value: 'text', label: 'Texto' },
        { value: 'number', label: 'Número' },
        { value: 'email', label: 'Email' },
        { value: 'phone', label: 'Teléfono' },
        { value: 'date', label: 'Fecha' },
        { value: 'time', label: 'Hora' },
        { value: 'textarea', label: 'Área de texto' },
        { value: 'select', label: 'Selección' },
        { value: 'checkbox', label: 'Checkbox' },
        { value: 'radio', label: 'Radio' },
        { value: 'file', label: 'Archivo' },
        { value: 'image', label: 'Imagen' },
        { value: 'switch', label: 'Interruptor' },
    ];

    const addField = () => {
        const newField = {
            id: Date.now(),
            label: '',
            type: 'text',
            placeholder: '',
            required: false,
            options: [],
        };
        setTemplate((prev) => ({
            ...prev,
            fields: [...prev.fields, newField],
        }));
    };

    const updateField = (fieldId: number, updates: Partial<FormField>) => {
        setTemplate((prev) => ({
            ...prev,
            fields: prev.fields.map((field) => (field.id === fieldId ? { ...field, ...updates } : field)),
        }));
    };

    const removeField = (fieldId: number) => {
        setTemplate((prev) => ({
            ...prev,
            fields: prev.fields.filter((field) => field.id !== fieldId),
        }));
    };

    const moveField = (fieldId: number, direction: 'up' | 'down') => {
        setTemplate((prev) => {
            const fields = [...prev.fields];
            const index = fields.findIndex((f) => f.id === fieldId);
            const newIndex = direction === 'up' ? index - 1 : index + 1;

            if (newIndex >= 0 && newIndex < fields.length) {
                [fields[index], fields[newIndex]] = [fields[newIndex], fields[index]];
            }

            return { ...prev, fields };
        });
    };

    const addOption = (fieldId: number) => {
        updateField(fieldId, {
            options: [...(template.fields.find((f) => f.id === fieldId)?.options || []), ''],
        });
    };

    const updateOption = (fieldId: number, optionIndex: number, value: string) => {
        const field = template.fields.find((f) => f.id === fieldId);
        if (!field) return;
        const newOptions = [...field.options];
        newOptions[optionIndex] = value;
        updateField(fieldId, { options: newOptions });
    };

    const removeOption = (fieldId: number, optionIndex: number) => {
        const field = template.fields.find((f) => f.id === fieldId);
        if (!field) return;
        const newOptions = field.options.filter((_, index) => index !== optionIndex);
        updateField(fieldId, { options: newOptions });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Preparar datos para enviar
        const formData = {
            name: template.name,
            description: template.description,
            visibility: template.visibility,
            fields: template.fields.map((field, index) => ({
                label: field.label,
                type: field.type,
                placeholder: field.placeholder,
                required: field.required,
                options: field.options.length > 0 ? field.options : null,
                order: index,
            })),
        };

        console.log('📋 Datos del template a enviar:', formData);
        console.log('🔍 Validaciones:');
        console.log('- Nombre:', formData.name ? '✅' : '❌ Requerido');
        console.log('- Campos:', formData.fields.length > 0 ? '✅' : '❌ Mínimo 1 campo');
        console.log('- Campos válidos:', formData.fields.every((f) => f.label) ? '✅' : '❌ Todos los campos deben tener label');

        // Aquí harías la llamada a tu API Laravel
        // fetch('/api/form-templates', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(formData)
        // })
    };

    const renderFieldPreview = (field: FormField) => {
        const baseClasses = 'w-full p-2 border rounded-md';

        switch (field.type) {
            case 'textarea':
                return <textarea className={`${baseClasses} min-h-[80px]`} placeholder={field.placeholder} />;
            case 'select':
                return (
                    <select className={baseClasses}>
                        <option value="">Seleccionar...</option>
                        {field.options.map((option: string, idx: number) => (
                            <option key={idx} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>
                );
            case 'checkbox':
                return (
                    <div className="space-y-2">
                        {field.options.map((option: string, idx: number) => (
                            <label key={idx} className="flex items-center space-x-2">
                                <input type="checkbox" />
                                <span>{option}</span>
                            </label>
                        ))}
                    </div>
                );
            case 'radio':
                return (
                    <div className="space-y-2">
                        {field.options.map((option: string, idx: number) => (
                            <label key={idx} className="flex items-center space-x-2">
                                <input type="radio" name={`radio-${field.id}`} />
                                <span>{option}</span>
                            </label>
                        ))}
                    </div>
                );
            case 'switch':
                return <Switch />;
            case 'file':
            case 'image':
                return <input type="file" className={baseClasses} />;
            default:
                return <input type={field.type} className={baseClasses} placeholder={field.placeholder} />;
        }
    };

    return (
        <div className="mx-auto max-w-6xl space-y-6 p-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Constructor de Templates</h1>
                <Button onClick={() => setPreviewMode(!previewMode)} variant="outline" className="flex items-center gap-2">
                    {previewMode ? <EyeOff size={16} /> : <Eye size={16} />}
                    {previewMode ? 'Editor' : 'Vista previa'}
                </Button>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* Panel de Configuración */}
                <Card>
                    <CardHeader>
                        <CardTitle>Configuración del Template</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label htmlFor="name">Nombre del Template</Label>
                            <Input
                                id="name"
                                value={template.name}
                                onChange={(e) => setTemplate((prev) => ({ ...prev, name: e.target.value }))}
                                placeholder="Ej: Formulario de Evaluación"
                            />
                        </div>

                        <div>
                            <Label htmlFor="description">Descripción</Label>
                            <Textarea
                                id="description"
                                value={template.description}
                                onChange={(e) => setTemplate((prev) => ({ ...prev, description: e.target.value }))}
                                placeholder="Describe el propósito del formulario"
                                rows={3}
                            />
                        </div>

                        <div>
                            <Label htmlFor="visibility">Visibilidad</Label>
                            <Select value={template.visibility} onValueChange={(value) => setTemplate((prev) => ({ ...prev, visibility: value }))}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="private">Privado</SelectItem>
                                    <SelectItem value="team">Equipo</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                {/* Panel de Vista Previa */}
                <Card>
                    <CardHeader>
                        <CardTitle>Vista Previa</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {previewMode && template.fields.length > 0 ? (
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold">{template.name || 'Formulario'}</h3>
                                {template.description && <p className="text-sm text-gray-600">{template.description}</p>}
                                {template.fields.map((field) => (
                                    <div key={field.id} className="space-y-2">
                                        <label className="flex items-center gap-2 font-medium">
                                            {field.label}
                                            {field.required && <span className="text-red-500">*</span>}
                                        </label>
                                        {renderFieldPreview(field)}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="py-8 text-center text-gray-500">
                                {previewMode ? 'Agrega campos para ver la vista previa' : 'Haz clic en "Vista previa" para ver el formulario'}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Constructor de Campos */}
            {!previewMode && (
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Campos del Formulario</CardTitle>
                        <Button onClick={addField} className="flex items-center gap-2">
                            <Plus size={16} />
                            Agregar Campo
                        </Button>
                    </CardHeader>
                    <CardContent>
                        {template.fields.length === 0 ? (
                            <div className="py-8 text-center text-gray-500">No hay campos. Haz clic en "Agregar Campo" para comenzar.</div>
                        ) : (
                            <div className="space-y-4">
                                {template.fields.map((field, index) => (
                                    <Card key={field.id} className="border-l-4 border-l-blue-500">
                                        <CardContent className="p-4">
                                            <div className="flex items-start gap-4">
                                                <div className="flex flex-col gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => moveField(field.id, 'up')}
                                                        disabled={index === 0}
                                                    >
                                                        <GripVertical size={16} />
                                                    </Button>
                                                </div>

                                                <div className="grid flex-1 grid-cols-1 gap-4 md:grid-cols-2">
                                                    <div>
                                                        <Label>Etiqueta</Label>
                                                        <Input
                                                            value={field.label}
                                                            onChange={(e) => updateField(field.id, { label: e.target.value })}
                                                            placeholder="Nombre del campo"
                                                        />
                                                    </div>

                                                    <div>
                                                        <Label>Tipo</Label>
                                                        <Select value={field.type} onValueChange={(value) => updateField(field.id, { type: value })}>
                                                            <SelectTrigger>
                                                                <SelectValue />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {fieldTypes.map((type) => (
                                                                    <SelectItem key={type.value} value={type.value}>
                                                                        {type.label}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    </div>

                                                    <div>
                                                        <Label>Placeholder</Label>
                                                        <Input
                                                            value={field.placeholder}
                                                            onChange={(e) => updateField(field.id, { placeholder: e.target.value })}
                                                            placeholder="Texto de ayuda"
                                                        />
                                                    </div>

                                                    <div className="flex items-center space-x-2">
                                                        <Switch
                                                            checked={field.required}
                                                            onCheckedChange={(checked) => updateField(field.id, { required: checked })}
                                                        />
                                                        <Label>Campo requerido</Label>
                                                    </div>

                                                    {/* Opciones para select, radio, checkbox */}
                                                    {['select', 'radio', 'checkbox'].includes(field.type) && (
                                                        <div className="md:col-span-2">
                                                            <Label>Opciones</Label>
                                                            <div className="space-y-2">
                                                                {field.options.map((option, optionIndex) => (
                                                                    <div key={optionIndex} className="flex gap-2">
                                                                        <Input
                                                                            value={option}
                                                                            onChange={(e) => updateOption(field.id, optionIndex, e.target.value)}
                                                                            placeholder={`Opción ${optionIndex + 1}`}
                                                                        />
                                                                        <Button
                                                                            variant="outline"
                                                                            size="sm"
                                                                            onClick={() => removeOption(field.id, optionIndex)}
                                                                        >
                                                                            <Trash2 size={16} />
                                                                        </Button>
                                                                    </div>
                                                                ))}
                                                                <Button variant="outline" size="sm" onClick={() => addOption(field.id)}>
                                                                    <Plus size={16} />
                                                                    Agregar Opción
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="flex flex-col gap-2">
                                                    <Badge variant="secondary">#{index + 1}</Badge>
                                                    <Button variant="destructive" size="sm" onClick={() => removeField(field.id)}>
                                                        <Trash2 size={16} />
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* Botón de Guardar */}
            <div className="flex justify-end">
                <Button onClick={handleSubmit} className="px-8" disabled={!template.name || template.fields.length === 0}>
                    Guardar Template
                </Button>
            </div>
        </div>
    );
};

export default FormTemplateBuilder;
