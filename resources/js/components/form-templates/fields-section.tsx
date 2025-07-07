import { Fields } from '@/components/form-templates/fields';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { FormFieldType } from '@/interfaces/form-template';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useForm } from '@inertiajs/react';
import { Edit2, Eye, GripVertical, Save, Settings, Trash2, X } from 'lucide-react';
import { useState } from 'react';

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

export const SortableFieldEditor = ({
    field,
    index,
    onUpdate,
    onRemove,
    isEditing,
    onToggleEdit,
}: {
    field: FormFieldType;
    index: number;
    onUpdate: (index: number, field: FormFieldType) => void;
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

    const [localField, setLocalField] = useState<FormFieldType>(field);
    const PERMIT_DEFAULT_VALUE = ['text', 'number', 'email', 'tel', 'url', 'textarea', 'select', 'radio', 'checkbox'];
    const PERMIT_OPTIONS = ['select', 'radio', 'checkbox'];
    const PERMIT_PLACEHOLDER = ['text', 'number', 'email', 'tel', 'url', 'textarea'];
    const [options, setOptions] = useState(field.options ? field.options.join('\n') : '');

    const handleSave = () => {
        const updatedField: FormFieldType = {
            ...localField,
            options: PERMIT_OPTIONS.includes(localField.type) ? options.split('\n').filter((opt: string) => opt.trim() !== '') : [],
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
                                    {field.is_required && (
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
                            {field.placeholder && PERMIT_PLACEHOLDER.includes(field.type) && (
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
                                <SelectContent className="max-h-[220px] overflow-y-auto">
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
                        <Label htmlFor={`name-${index}`} className="text-sm font-medium">
                            Nombre
                        </Label>
                        <Input
                            id={`name-${index}`}
                            value={localField.name}
                            onChange={(e) => setLocalField({ ...localField, name: e.target.value })}
                            placeholder="Nombre del campo"
                            className="mt-1"
                        />
                    </div>

                    {PERMIT_PLACEHOLDER.includes(localField.type) && (
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
                    )}
                    {PERMIT_DEFAULT_VALUE.includes(localField.type) && (
                        <div>
                            <Label htmlFor={`default-value-${index}`} className="text-sm font-medium">
                                Valor por defecto
                            </Label>
                            <Input
                                id={`default-value-${index}`}
                                value={localField.default_value || ''}
                                onChange={(e) => setLocalField({ ...localField, default_value: e.target.value })}
                                placeholder="Valor por defecto"
                                className="mt-1"
                            />
                        </div>
                    )}
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
                            checked={localField.is_required}
                            onCheckedChange={(checked) => setLocalField({ ...localField, is_required: checked })}
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

export const FormPreview = ({ fields, formName }: { fields: FormFieldType[]; formName: string }) => {
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
                                {field.is_required && <span className="text-red-500">*</span>}
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
