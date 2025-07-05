import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import { Edit2, GripVertical, Plus, Save, Trash2, X } from 'lucide-react';
import { useEffect, useState } from 'react';

interface FormField {
    label: string;
    type: string;
    placeholder?: string;
    required: boolean;
    options?: string[] | null;
    [key: string]: any;
}

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

const FieldEditor = ({
    field,
    index,
    onUpdate,
    onRemove,
    isEditing,
    onToggleEdit,
}: {
    field: FormField;
    index: number;
    onUpdate: (index: number, field: FormField) => void;
    onRemove: (index: number) => void;
    isEditing: boolean;
    onToggleEdit: (index: number) => void;
}) => {
    const [localField, setLocalField] = useState<FormField>(field);
    const [options, setOptions] = useState(field.options ? field.options.join('\n') : '');

    const handleSave = () => {
        const updatedField: FormField = {
            ...localField,
            options: ['select', 'radio', 'checkbox'].includes(localField.type)
                ? options.split('\n').filter((opt: string) => opt.trim() !== '')
                : null,
        };
        onUpdate(index, updatedField);
        onToggleEdit(index);
    };

    const handleCancel = () => {
        setLocalField(field);
        setOptions(field.options ? field.options.join('\n') : '');
        onToggleEdit(index);
    };

    if (!isEditing) {
        return (
            <Card className="mb-4">
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <GripVertical className="h-4 w-4 cursor-move text-gray-400" />
                            <CardTitle className="text-sm">{field.label}</CardTitle>
                            <Badge variant="outline" className="text-xs">
                                {fieldTypes.find((t) => t.value === field.type)?.label}
                            </Badge>
                            {field.required && (
                                <Badge variant="destructive" className="text-xs">
                                    Requerido
                                </Badge>
                            )}
                        </div>
                        <div className="flex gap-2">
                            <Button variant="ghost" size="sm" onClick={() => onToggleEdit(index)}>
                                <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => onRemove(index)} className="text-red-600 hover:text-red-700">
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="pt-0">
                    <div className="text-sm text-gray-600">
                        {field.placeholder && (
                            <p>
                                <strong>Placeholder:</strong> {field.placeholder}
                            </p>
                        )}
                        {field.options && field.options.length > 0 && (
                            <div>
                                <strong>Opciones:</strong>
                                <ul className="ml-2 list-inside list-disc">
                                    {field.options.map((option, idx) => (
                                        <li key={idx}>{option}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="mb-4 border-blue-200 bg-blue-50">
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-sm">Editando Campo</CardTitle>
                    <div className="flex gap-2">
                        <Button variant="ghost" size="sm" onClick={handleSave} className="text-green-600 hover:text-green-700">
                            <Save className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={handleCancel} className="text-gray-600 hover:text-gray-700">
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor={`label-${index}`}>Etiqueta</Label>
                        <Input
                            id={`label-${index}`}
                            value={localField.label}
                            onChange={(e) => setLocalField({ ...localField, label: e.target.value })}
                            placeholder="Nombre del campo"
                        />
                    </div>
                    <div>
                        <Label htmlFor={`type-${index}`}>Tipo</Label>
                        <Select value={localField.type} onValueChange={(value) => setLocalField({ ...localField, type: value })}>
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
                </div>

                <div>
                    <Label htmlFor={`placeholder-${index}`}>Placeholder</Label>
                    <Input
                        id={`placeholder-${index}`}
                        value={localField.placeholder || ''}
                        onChange={(e) => setLocalField({ ...localField, placeholder: e.target.value })}
                        placeholder="Texto de ayuda"
                    />
                </div>

                {['select', 'radio', 'checkbox'].includes(localField.type) && (
                    <div>
                        <Label htmlFor={`options-${index}`}>Opciones (una por línea)</Label>
                        <Textarea
                            id={`options-${index}`}
                            value={options}
                            onChange={(e) => setOptions(e.target.value)}
                            placeholder="Opción 1&#10;Opción 2&#10;Opción 3"
                            rows={4}
                        />
                    </div>
                )}

                <div className="flex items-center space-x-2">
                    <Switch
                        id={`required-${index}`}
                        checked={localField.required}
                        onCheckedChange={(checked) => setLocalField({ ...localField, required: checked })}
                    />
                    <Label htmlFor={`required-${index}`}>Campo requerido</Label>
                </div>
            </CardContent>
        </Card>
    );
};

export default function FormTemplateBuilder({
    company,
    template,
}: {
    company: { name: string };
    template?: { name?: string; description?: string; active_fields?: FormField[] };
}) {
    const [fields, setFields] = useState<FormField[]>(template?.active_fields || []);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);

    const { data, setData, put, processing, errors } = useForm({
        name: template?.name || `Ficha de Cliente - ${company.name}`,
        description: template?.description || `Ficha de datos del cliente para ${company.name}`,
        fields: template?.active_fields || [],
    });

    useEffect(() => {
        setData('fields', fields);
    }, [fields]);

    const addField = () => {
        const newField: FormField = {
            label: 'Nuevo Campo',
            type: 'text',
            placeholder: '',
            required: false,
            options: null,
        };
        setFields([...fields, newField]);
        setEditingIndex(fields.length);
    };

    const updateField = (index: number, updatedField: FormField) => {
        const newFields = [...fields];
        newFields[index] = updatedField;
        setFields(newFields);
    };

    const removeField = (index: number) => {
        const newFields = fields.filter((_: FormField, i: number) => i !== index);
        setFields(newFields);
        if (editingIndex === index) {
            setEditingIndex(null);
        }
    };

    const toggleEdit = (index: number) => {
        setEditingIndex(editingIndex === index ? null : index);
    };

    const handleSubmit = () => {
        put(route('templates.update'));
    };

    const breadcrumbs = [
        {
            title: 'Templates',
            href: route('templates.builder'),
        },
        {
            title: 'Constructor de Formularios',
            href: route('templates.builder'),
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Constructor de Formularios" />

            <div className="mx-auto max-w-4xl p-6">
                <div className="space-y-6">
                    {/* Header */}
                    <div className="rounded-lg bg-white p-6 shadow-sm">
                        <h1 className="mb-6 text-2xl font-bold text-gray-900">Constructor de Formularios</h1>

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div>
                                <Label htmlFor="name">Nombre del Formulario</Label>
                                <Input
                                    id="name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="Nombre del formulario"
                                    className={errors.name ? 'border-red-500' : ''}
                                />
                                {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
                            </div>

                            <div>
                                <Label htmlFor="description">Descripción</Label>
                                <Input
                                    id="description"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    placeholder="Descripción del formulario"
                                    className={errors.description ? 'border-red-500' : ''}
                                />
                                {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Fields Section */}
                    <div className="rounded-lg bg-white p-6 shadow-sm">
                        <div className="mb-6 flex items-center justify-between">
                            <h2 className="text-xl font-semibold text-gray-900">Campos del Formulario</h2>
                            <Button type="button" onClick={addField} variant="outline" className="flex items-center gap-2">
                                <Plus className="h-4 w-4" />
                                Agregar Campo
                            </Button>
                        </div>

                        {fields.length === 0 ? (
                            <div className="py-12 text-center text-gray-500">
                                <p className="mb-2 text-lg">No hay campos definidos</p>
                                <p className="text-sm">Agrega campos para crear tu formulario personalizado</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {fields.map((field, index) => (
                                    <FieldEditor
                                        key={index}
                                        field={field}
                                        index={index}
                                        onUpdate={updateField}
                                        onRemove={removeField}
                                        isEditing={editingIndex === index}
                                        onToggleEdit={toggleEdit}
                                    />
                                ))}
                            </div>
                        )}

                        {errors.fields && <p className="mt-4 text-sm text-red-500">{errors.fields}</p>}
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end space-x-4">
                        <Button type="button" variant="outline" onClick={() => window.history.back()}>
                            Cancelar
                        </Button>
                        <Button type="button" onClick={handleSubmit} disabled={processing || fields.length === 0} className="flex items-center gap-2">
                            {processing ? (
                                <>
                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                    Guardando...
                                </>
                            ) : (
                                <>
                                    <Save className="h-4 w-4" />
                                    Guardar Formulario
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
