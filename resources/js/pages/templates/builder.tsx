import InputError from '@/components/input-error';
import { Fields } from '@/components/templates/fields';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { FormField } from '@/interfaces/template';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { closestCenter, DndContext, DragEndEvent, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Head, useForm } from '@inertiajs/react';
import { Edit2, Eye, GripVertical, Plus, Save, Settings, Trash2, X } from 'lucide-react';
import { useEffect, useState } from 'react';

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

const SortableFieldEditor = ({
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
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: field.id });
    const form = useForm({
        fields: {},
    });
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    const [localField, setLocalField] = useState<FormField>(field);
    const [options, setOptions] = useState(field.options ? field.options.join('\n') : '');

    const handleSave = () => {
        const updatedField: FormField = {
            ...localField,
            options: ['select', 'radio', 'checkbox'].includes(localField.type) ? options.split('\n').filter((opt: string) => opt.trim() !== '') : [],
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
            <div ref={setNodeRef} style={style} className="mb-4">
                <Card className="transition-all duration-200 hover:shadow-md">
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div
                                    {...attributes}
                                    {...listeners}
                                    className="cursor-grab rounded p-1 transition-colors hover:bg-muted active:cursor-grabbing"
                                >
                                    <GripVertical className="h-4 w-4 text-muted-foreground" />
                                </div>
                                <div className="flex items-center gap-2">
                                    <CardTitle className="text-sm font-medium">{field.label}</CardTitle>
                                    <Badge variant="outline" className="text-xs">
                                        {fieldTypes.find((t) => t.value === field.type)?.label}
                                    </Badge>
                                    {field.required && (
                                        <Badge variant="destructive" className="text-xs">
                                            Requerido
                                        </Badge>
                                    )}
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="ghost" size="sm" onClick={() => onToggleEdit(index)}>
                                    <Edit2 className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm" onClick={() => onRemove(index)}>
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                        <div className="space-y-1 text-sm text-muted-foreground">
                            {field.placeholder && (
                                <p>
                                    <span className="font-medium">Placeholder:</span> {field.placeholder}
                                </p>
                            )}
                            {field.options && field.options.length > 0 && (
                                <div>
                                    <span className="font-medium">Opciones:</span>
                                    <div className="mt-1 ml-2 flex flex-wrap gap-1">
                                        {field.options.map((option, idx) => (
                                            <Badge key={idx} variant="secondary" className="text-xs">
                                                {option}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div ref={setNodeRef} style={style} className="mb-4">
            <Card className="border-blue-200 bg-blue-50 shadow-lg dark:border-blue-900 dark:bg-blue-950/50">
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Settings className="h-4 w-4 text-blue-600 dark:text-blue-200" />
                            <CardTitle className="text-sm text-blue-700 dark:text-blue-200">Editando Campo</CardTitle>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="ghost" size="sm" onClick={handleSave}>
                                <Save className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={handleCancel}>
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor={`label-${index}`} className="text-sm font-medium">
                                Etiqueta
                            </Label>
                            <Input
                                id={`label-${index}`}
                                value={localField.label}
                                onChange={(e) => setLocalField({ ...localField, label: e.target.value })}
                                placeholder="Nombre del campo"
                                className="mt-1"
                            />
                        </div>
                        <div>
                            <Label htmlFor={`type-${index}`} className="text-sm font-medium">
                                Tipo
                            </Label>
                            <Select value={localField.type} onValueChange={(value) => setLocalField({ ...localField, type: value })}>
                                <SelectTrigger className="mt-1">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="max-h-[200px] overflow-y-auto">
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
                        <Label htmlFor={`placeholder-${index}`} className="text-sm font-medium">
                            Placeholder
                        </Label>
                        <Input
                            id={`placeholder-${index}`}
                            value={localField.placeholder || ''}
                            onChange={(e) => setLocalField({ ...localField, placeholder: e.target.value })}
                            placeholder="Texto de ayuda"
                            className="mt-1"
                        />
                    </div>

                    {['select', 'radio', 'checkbox'].includes(localField.type) && (
                        <div>
                            <Label htmlFor={`options-${index}`} className="text-sm font-medium">
                                Opciones (una por línea)
                            </Label>
                            <Textarea
                                id={`options-${index}`}
                                value={options}
                                onChange={(e) => setOptions(e.target.value)}
                                placeholder="Opción 1&#10;Opción 2&#10;Opción 3"
                                rows={4}
                                className="mt-1"
                            />
                        </div>
                    )}

                    <div className="flex items-center space-x-2 pt-2">
                        <Switch
                            id={`required-${index}`}
                            checked={localField.required}
                            onCheckedChange={(checked) => setLocalField({ ...localField, required: checked })}
                        />
                        <Label htmlFor={`required-${index}`} className="text-sm font-medium">
                            Campo requerido
                        </Label>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

const FormPreview = ({ fields, formName }: { fields: FormField[]; formName: string }) => {
    const form = useForm({
        fields: {},
    });
    return (
        <div className="rounded-lg border bg-background p-6 shadow-sm">
            <div className="mb-6">
                <h2 className="mb-2 text-2xl font-bold text-foreground">{formName}</h2>
                <p className="text-muted-foreground">Vista previa de tu formulario</p>
            </div>

            {fields.length === 0 ? (
                <div className="py-12 text-center text-muted-foreground">
                    <Eye className="mx-auto mb-4 h-12 w-12 opacity-50" />
                    <p className="mb-2 text-lg">Sin campos para mostrar</p>
                    <p className="text-sm">Agrega campos en la pestaña "Constructor" para ver la vista previa</p>
                </div>
            ) : (
                <form className="space-y-6">
                    {fields.map((field) => (
                        <div key={field.id} className="space-y-2">
                            <Label htmlFor={field.id} className="flex items-center gap-1 text-sm font-medium">
                                {field.label}
                                {field.required && <span className="text-red-500">*</span>}
                            </Label>
                            <Fields field={field} form={form} />
                        </div>
                    ))}

                    <div className="border-t pt-4">
                        <Button type="submit" className="w-full">
                            Enviar Formulario
                        </Button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default function FormTemplateBuilder({
    company,
    template,
}: {
    company?: { name: string };
    template?: { name?: string; description?: string; active_fields?: FormField[] };
}) {
    const [fields, setFields] = useState(template?.active_fields || []);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const { data, setData, put, processing, errors } = useForm({
        name: template?.name || `Ficha de Cliente - ${company?.name || 'Mi Empresa'}`,
        description: template?.description || `Ficha de datos del cliente para ${company?.name || 'Mi Empresa'}`,
        fields: template?.active_fields || [],
    });
    console.log({ template });
    useEffect(() => {
        setData('fields', fields);
    }, [fields]);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        }),
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = fields.findIndex((field) => field.id === active.id);
            const newIndex = fields.findIndex((field) => field.id === over.id);

            setFields((fields) => arrayMove(fields, oldIndex, newIndex));
        }
    };

    const addField = () => {
        const newField: FormField = {
            id: `field-${Date.now()}`,
            label: 'Nuevo Campo',
            type: 'text',
            placeholder: '',
            required: false,
            options: [],
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

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: route('dashboard') },
        { title: 'Constructor de Formularios', href: route('templates.builder') },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Constructor de Formularios" />
            <div className="min-h-screen bg-background">
                <div className="mx-auto max-w-7xl p-6">
                    {/* Header */}
                    <Card className="mb-6">
                        <CardHeader>
                            <CardTitle className="text-2xl font-bold">Constructor de Formularios</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div>
                                    <Label htmlFor="name" className="text-sm font-medium">
                                        Nombre del Formulario
                                    </Label>
                                    <Input
                                        id="name"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        placeholder="Nombre del formulario"
                                    />
                                    <InputError message={errors.name} />
                                </div>

                                <div>
                                    <Label htmlFor="description" className="text-sm font-medium">
                                        Descripción
                                    </Label>
                                    <Input
                                        id="description"
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        placeholder="Descripción del formulario"
                                    />
                                    <InputError message={errors.description} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Main Content with Tabs */}
                    <Tabs defaultValue="builder" className="space-y-6">
                        <div className="flex items-center justify-between">
                            <TabsList className="grid w-fit grid-cols-2">
                                <TabsTrigger value="builder" className="flex items-center gap-2">
                                    <Settings className="h-4 w-4" />
                                    Constructor
                                </TabsTrigger>
                                <TabsTrigger value="preview" className="flex items-center gap-2">
                                    <Eye className="h-4 w-4" />
                                    Vista Previa
                                </TabsTrigger>
                            </TabsList>

                            <div className="flex items-center gap-4">
                                <Badge variant="outline" className="text-sm">
                                    {fields.length} campo{fields.length !== 1 ? 's' : ''}
                                </Badge>
                                <Button
                                    type="button"
                                    onClick={handleSubmit}
                                    disabled={processing || fields.length === 0}
                                    className="flex items-center gap-2"
                                >
                                    {processing ? (
                                        <>
                                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-border border-t-transparent" />
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

                        <TabsContent value="builder" className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-xl font-semibold">
                                        <div className="mb-6 flex items-center justify-between">
                                            <h2 className="text-xl font-semibold text-foreground">Campos del Formulario</h2>
                                            <Button type="button" onClick={addField}>
                                                <Plus className="h-4 w-4" />
                                                Agregar Campo
                                            </Button>
                                        </div>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {fields.length === 0 ? (
                                        <div className="py-16 text-center text-muted-foreground">
                                            <Settings className="mx-auto mb-4 h-16 w-16 opacity-30" />
                                            <p className="mb-2 text-xl font-medium">No hay campos definidos</p>
                                            <p className="mb-6 text-sm">Agrega campos para crear tu formulario personalizado</p>
                                            <Button onClick={addField} className="mx-auto flex items-center gap-2">
                                                <Plus className="h-4 w-4" />
                                                Crear Primer Campo
                                            </Button>
                                        </div>
                                    ) : (
                                        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                                            <SortableContext items={fields.map((f) => f.id)} strategy={verticalListSortingStrategy}>
                                                <div className="space-y-4">
                                                    {fields.map((field, index) => (
                                                        <SortableFieldEditor
                                                            key={field.id}
                                                            field={field}
                                                            index={index}
                                                            onUpdate={updateField}
                                                            onRemove={removeField}
                                                            isEditing={editingIndex === index}
                                                            onToggleEdit={toggleEdit}
                                                        />
                                                    ))}
                                                </div>
                                            </SortableContext>
                                        </DndContext>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="preview" className="space-y-6">
                            <FormPreview fields={fields} formName={data.name} />
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </AppLayout>
    );
}
