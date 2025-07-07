import { FormPreview, SortableFieldEditor } from '@/components/form-templates/fields-section';
import InputError from '@/components/input-error';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FormFieldType } from '@/interfaces/form-template';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { closestCenter, DndContext, DragEndEvent, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Head, useForm } from '@inertiajs/react';
import { Eye, Plus, Save, Settings } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function FormTemplateCreate() {
    const [fields, setFields] = useState<FormFieldType[]>([]);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        description: '',
        fields: [],
        type: 'booking_form',
    });

    useEffect(() => {
        setData('fields', fields as never[]);
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
        const newField: FormFieldType = {
            id: `field-${Date.now()}`,
            label: 'Nuevo Campo',
            type: 'text',
            placeholder: '',
            is_required: false,
            options: [],
            name: '',
            default_value: '',
            order: 0,
        };
        setFields([...fields, newField as FormFieldType]);
        setEditingIndex(fields.length);
    };

    const updateField = (index: number, updatedField: FormFieldType) => {
        const newFields = [...fields];
        newFields[index] = updatedField;
        setFields(newFields);
    };

    const removeField = (index: number) => {
        const newFields = fields.filter((_: FormFieldType, i: number) => i !== index);
        setFields(newFields);
        if (editingIndex === index) {
            setEditingIndex(null);
        }
    };

    const toggleEdit = (index: number) => {
        setEditingIndex(editingIndex === index ? null : index);
    };

    const handleSubmit = () => {
        post(route('form-templates.store'));
    };

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: route('dashboard') },
        { title: 'Constructor de Formularios', href: route('form-templates.create') },
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

                                <div>
                                    <Label htmlFor="type" className="text-sm font-medium">
                                        Tipo de Formulario
                                    </Label>
                                    <Select value={data.type} onValueChange={(value) => setData('type', value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecciona un tipo de formulario" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="user_profile">Ficha de Cliente</SelectItem>
                                            <SelectItem value="booking_form">Formulario de Reserva</SelectItem>
                                        </SelectContent>
                                    </Select>
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
