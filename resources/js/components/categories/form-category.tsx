import { AlertCircle, Info, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import InputError from '../input-error';
import { Alert, AlertDescription } from '../ui/alert';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { ScrollArea } from '../ui/scroll-area';
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from '../ui/sheet';
import { Switch } from '../ui/switch';
import { useCategory } from './category-context';

export function FormCategory() {
    const { t } = useTranslation();
    const { open, handleSubmit, handleCancel, data, setData, errors, processing, category, getStatistics } = useCategory();

    const stats = getStatistics();
    const isEditing = !!category?.id;

    return (
        <Sheet open={open} onOpenChange={handleCancel}>
            <SheetContent className="sm:max-w-lg">
                <SheetHeader>
                    <SheetTitle className="flex items-center gap-2">
                        {isEditing ? (
                            <>
                                <span>Editar Categoría</span>
                                <span className="text-sm font-normal text-muted-foreground">#{category?.id?.slice(-8)}</span>
                            </>
                        ) : (
                            'Crear Nueva Categoría'
                        )}
                    </SheetTitle>
                    <SheetDescription>
                        {isEditing ? 'Modifica los datos de la categoría seleccionada.' : 'Completa la información para crear una nueva categoría.'}
                    </SheetDescription>
                </SheetHeader>

                <ScrollArea className="h-[calc(100vh-180px)] pr-4">
                    <div id="category-form" className="space-y-6">
                        {/* Información contextual */}
                        {!isEditing && stats.total > 0 && (
                            <Alert>
                                <Info className="h-4 w-4" />
                                <AlertDescription>
                                    Actualmente tienes {stats.total} categorías, {stats.active} activas y {stats.inactive} inactivas.
                                </AlertDescription>
                            </Alert>
                        )}

                        {/* Información de la categoría editada */}
                        {isEditing && category && (
                            <div className="space-y-2 rounded-lg bg-muted p-4">
                                <h4 className="text-sm font-medium">Información actual</h4>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="text-muted-foreground">Servicios:</span>
                                        <span className="ml-2 font-medium">{category.services_count || 0}</span>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground">Creada:</span>
                                        <span className="ml-2 font-medium">{category.created_at_human}</span>
                                    </div>
                                    {category.performance_score && (
                                        <div className="col-span-2">
                                            <span className="text-muted-foreground">Rendimiento:</span>
                                            <span className="ml-2 font-medium">{category.performance_score}%</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Campos del formulario */}
                        <div className="space-y-6">
                            {/* Nombre de la categoría */}
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-sm font-medium">
                                    Nombre de la categoría
                                    <span className="ml-1 text-destructive">*</span>
                                </Label>
                                <Input
                                    id="name"
                                    value={data.name}
                                    onChange={(e) => setData({ ...data, name: e.target.value })}
                                    placeholder="Ej: Servicios de belleza, Consultas médicas..."
                                    className={errors.name ? 'border-destructive' : ''}
                                />
                                <InputError message={errors.name} />
                                {!errors.name && (
                                    <p className="text-xs text-muted-foreground">Elige un nombre descriptivo y único para la categoría.</p>
                                )}
                            </div>

                            {/* Estado de la categoría */}
                            <div className="space-y-4">
                                <Label className="text-sm font-medium">Estado de la categoría</Label>

                                <div className="flex items-center justify-between rounded-lg border p-4">
                                    <div className="space-y-1">
                                        <div className="text-sm font-medium">{data.is_active ? 'Categoría activa' : 'Categoría inactiva'}</div>
                                        <div className="text-xs text-muted-foreground">
                                            {data.is_active
                                                ? 'La categoría estará disponible para asignar a servicios'
                                                : 'La categoría no estará disponible para nuevos servicios'}
                                        </div>
                                    </div>
                                    <Switch checked={data.is_active} onCheckedChange={(checked) => setData({ ...data, is_active: checked })} />
                                </div>
                                <InputError message={errors.is_active} />
                            </div>

                            {/* Alternativa con checkbox (comentada) */}
                            {/* 
                            <div className="flex items-start gap-3">
                                <Checkbox
                                    id="is_active"
                                    checked={data.is_active}
                                    onCheckedChange={(checked) => setData({ ...data, is_active: checked as boolean })}
                                    className="mt-1"
                                />
                                <div className="space-y-1">
                                    <Label htmlFor="is_active" className="text-sm font-medium cursor-pointer">
                                        Categoría activa
                                    </Label>
                                    <p className="text-xs text-muted-foreground">
                                        Las categorías activas están disponibles para asignar a servicios.
                                    </p>
                                </div>
                                <InputError message={errors.is_active} />
                            </div>
                            */}

                            {/* Advertencias */}
                            {isEditing && category?.services_count && category.services_count > 0 && !data.is_active && (
                                <Alert>
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertDescription>
                                        Esta categoría tiene {category.services_count} servicio(s) asociado(s). Desactivarla puede afectar la
                                        visibilidad de estos servicios.
                                    </AlertDescription>
                                </Alert>
                            )}

                            {/* Información adicional para nuevas categorías */}
                            {!isEditing && (
                                <div className="rounded-lg bg-blue-50 p-4">
                                    <h4 className="mb-2 text-sm font-medium text-blue-900">💡 Consejos para crear categorías</h4>
                                    <ul className="space-y-1 text-xs text-blue-800">
                                        <li>• Usa nombres claros y descriptivos</li>
                                        <li>• Evita categorías demasiado específicas o generales</li>
                                        <li>• Piensa en cómo tus clientes buscarían estos servicios</li>
                                        <li>• Puedes cambiar el estado después de crearla</li>
                                    </ul>
                                </div>
                            )}
                        </div>

                        {/* Vista previa */}
                        {data.name && (
                            <div className="rounded-lg border bg-gray-50 p-4">
                                <h4 className="mb-2 text-sm font-medium">Vista previa</h4>
                                <div className="flex items-center gap-2">
                                    <div
                                        className={`rounded px-2 py-1 text-xs font-medium ${
                                            data.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                                        }`}
                                    >
                                        {data.is_active ? 'Activa' : 'Inactiva'}
                                    </div>
                                    <span className="font-medium">{data.name}</span>
                                </div>
                            </div>
                        )}
                    </div>
                </ScrollArea>

                <SheetFooter className="gap-2">
                    <SheetClose asChild>
                        <Button variant="outline" onClick={handleCancel} disabled={processing}>
                            Cancelar
                        </Button>
                    </SheetClose>
                    <Button onClick={handleSubmit} disabled={processing || !data.name.trim()} className="min-w-[100px]">
                        {processing ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                {isEditing ? 'Actualizando...' : 'Creando...'}
                            </>
                        ) : isEditing ? (
                            'Actualizar categoría'
                        ) : (
                            'Crear categoría'
                        )}
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}
