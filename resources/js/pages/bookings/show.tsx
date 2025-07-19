import { AppHeaderPage } from '@/components/app-header-page';
import CloneFormData from '@/components/bookings/clone-form-data';
import DynamicForm from '@/components/bookings/dynamic-form';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookingResource } from '@/interfaces/booking';
import { FormTemplate } from '@/interfaces/form-template';
import AppLayout from '@/layouts/app-layout';
import { cn, formatTimeAMPM } from '@/lib/utils';
import { Head, useForm } from '@inertiajs/react';
import { Calendar, Check, CreditCard, Download, FileText, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface UserProfileData {
    id: number;
    user_id: number;
    form_template_id: number;
    data: any;
    is_visible_to_team: boolean;
}

interface BookingFormData {
    id: number;
    booking_id: number;
    form_template_id: number;
    data: any;
    is_visible_to_team: boolean;
}

interface BookingFormWithTemplate {
    template: FormTemplate;
    data: BookingFormData;
}

interface MappedFieldData {
    name: string;
    label: string;
    value: any;
    type: string;
}

interface FormDataGroup {
    template: FormTemplate;
    mapped_form_data: MappedFieldData[];
    has_data: boolean;
}

interface BookingHistory extends BookingResource {
    forms_data: FormDataGroup[];
}

type BookingShowProps = {
    booking: BookingResource;
    user_profile_data: UserProfileData;
    booking_forms_data: BookingFormWithTemplate[];
    user_profile_template: FormTemplate;
    booking_forms_templates: FormTemplate[];
    booking_history: BookingHistory[];
};

const FORM_TYPES = {
    USER_PROFILE: 'user_profile',
    BOOKING_FORM: 'booking_form',
} as const;

export default function BookingShow({
    booking,
    user_profile_data,
    booking_forms_data,
    user_profile_template,
    booking_forms_templates,
    booking_history,
}: BookingShowProps) {
    const { t } = useTranslation();

    const formatDate = (dateString: string): string => {
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('es-ES', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
            });
        } catch {
            return dateString;
        }
    };

    const formatDateTime = (dateString: string): string => {
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('es-ES', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
            });
        } catch {
            return dateString;
        }
    };

    // Form para perfil de usuario
    const formUserProfile = useForm<Record<string, any>>({});

    // Crear forms individuales para cada template (fuera del useEffect)
    const bookingFormsList = booking_forms_data.map((formWithTemplate) => ({
        templateId: formWithTemplate.template.id,
        form: useForm<Record<string, any>>(formWithTemplate.data?.data || {}),
    }));

    // Convertir a objeto para fácil acceso
    const bookingForms = bookingFormsList.reduce(
        (acc, { templateId, form }) => {
            acc[templateId] = form;
            return acc;
        },
        {} as Record<string, any>,
    );

    const [selectedBookingHistory, setSelectedBookingHistory] = useState<BookingHistory | null>(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [activeBookingFormTab, setActiveBookingFormTab] = useState<string>('');

    // Inicializar forms
    useEffect(() => {
        if (user_profile_data?.data) {
            formUserProfile.setData(user_profile_data.data);
        }

        // Establecer la primera tab como activa
        if (booking_forms_templates.length > 0) {
            setActiveBookingFormTab(booking_forms_templates[0].id);
        }
    }, [user_profile_data, booking_forms_templates]);

    const handleFormSubmit = (formType: string, templateId?: string) => {
        if (formType === FORM_TYPES.USER_PROFILE) {
            formUserProfile.post(route('bookings.form-data.store.user-profile', { booking: booking.id }), {
                preserveScroll: true,
                onSuccess: () => {
                    // Opcional: mostrar mensaje de éxito
                },
            });
        } else if (formType === FORM_TYPES.BOOKING_FORM && templateId) {
            const form = bookingForms[templateId];
            if (form) {
                form.post(route('bookings.form-data.store.booking-form', { booking: booking.id, templateId }), {
                    preserveScroll: true,
                    onSuccess: () => {
                        // Opcional: mostrar mensaje de éxito
                    },
                });
            }
        }
    };

    const handleBookingDetails = (historyBooking: BookingHistory) => {
        setSelectedBookingHistory(historyBooking);
        setOpenDialog(true);
    };

    const handleExportData = () => {
        window.open(route('bookings.form-data.export', { booking: booking.id }), '_blank');
    };

    const formatFieldValue = (field: MappedFieldData): string => {
        if (!field.value) return 'N/A';

        switch (field.type) {
            case 'date':
                try {
                    return formatDate(field.value);
                } catch {
                    return field.value;
                }
            case 'time':
                return field.value;
            case 'currency':
                return `${field.value}`;
            case 'email':
                return field.value;
            case 'tel':
                return field.value;
            case 'textarea':
                return field.value;
            case 'select':
            case 'radio':
                return field.value;
            case 'checkbox':
                return field.value ? 'Sí' : 'No';
            default:
                return String(field.value);
        }
    };

    const renderFieldsBySection = (fields: MappedFieldData[]) => {
        if (!fields || fields.length === 0) return null;

        return (
            <div className="space-y-3">
                {fields.map((field, index) => (
                    <div key={`${field.name}-${index}`} className="flex flex-col space-y-1">
                        <span className="text-sm font-medium text-muted-foreground">{field.label}:</span>
                        <span className="text-foreground">{formatFieldValue(field)}</span>
                    </div>
                ))}
            </div>
        );
    };

    const renderBookingFormTabs = () => {
        if (!booking_forms_templates || booking_forms_templates.length === 0) {
            return (
                <Alert>
                    <AlertDescription>No hay formularios de reserva configurados.</AlertDescription>
                </Alert>
            );
        }

        return (
            <Tabs value={activeBookingFormTab} onValueChange={setActiveBookingFormTab}>
                <TabsList className="grid w-full grid-cols-1 gap-1 sm:grid-cols-2 lg:grid-cols-3">
                    {booking_forms_templates.map((template) => (
                        <TabsTrigger key={template.id} value={template.id} className="flex items-center gap-2 text-sm">
                            <FileText className="h-4 w-4" />
                            <span className="truncate">{template.name}</span>
                        </TabsTrigger>
                    ))}
                </TabsList>

                {booking_forms_templates.map((template) => {
                    const form = bookingForms[template.id];
                    if (!form) return null;

                    return (
                        <TabsContent key={template.id} value={template.id}>
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <FileText className="h-5 w-5" />
                                        {template.name}
                                    </CardTitle>
                                    {template.description && <CardDescription>{template.description}</CardDescription>}
                                </CardHeader>
                                <CardContent>
                                    <DynamicForm
                                        template={template}
                                        data={form.data}
                                        setData={form.setData}
                                        errors={form.errors}
                                        onSubmit={() => handleFormSubmit(FORM_TYPES.BOOKING_FORM, template.id)}
                                        isProcessing={form.processing}
                                    />
                                </CardContent>
                            </Card>
                        </TabsContent>
                    );
                })}
            </Tabs>
        );
    };

    const renderHistoryFormsData = (formsData: FormDataGroup[]) => {
        return (
            <div className="space-y-4">
                {formsData.map((formGroup, index) => (
                    <div key={`${formGroup.template.id}-${index}`}>
                        <div className="mb-3 flex items-center gap-2">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            <h4 className="text-sm font-medium">{formGroup.template.name}</h4>
                            <Badge variant={formGroup.has_data ? 'default' : 'muted'} className="text-xs">
                                {formGroup.has_data ? 'Completado' : 'Sin datos'}
                            </Badge>
                        </div>

                        {formGroup.has_data ? (
                            renderFieldsBySection(formGroup.mapped_form_data)
                        ) : (
                            <p className="text-sm text-muted-foreground italic">No hay información registrada para este formulario.</p>
                        )}

                        {index < formsData.length - 1 && <Separator className="mt-4" />}
                    </div>
                ))}
            </div>
        );
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Dashboard', href: route('dashboard') },
                { title: t('bookings.index.title'), href: route('bookings.index') },
                { title: t('bookings.show.title'), href: route('bookings.show', { booking: booking.id }) },
            ]}
        >
            <Head title={t('bookings.show.title')} />
            <AppHeaderPage title={t('bookings.show.title')} description={t('bookings.show.description')} />

            <div className="space-y-6 p-6">
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Columna izquierda - Información básica */}
                    <div className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center justify-between">
                                    {t('bookings.show.client_section.title')}
                                    <Button variant="outline" size="sm" onClick={handleExportData}>
                                        <Download className="mr-2 h-4 w-4" />
                                        Exportar
                                    </Button>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex gap-4">
                                    <div className="flex items-center justify-center rounded-full bg-primary/10 p-4">
                                        <User className="h-4 w-4 text-primary" />
                                    </div>
                                    <div>
                                        <Label>{t('bookings.show.client_section.client_name')}</Label>
                                        <p className="font-medium">{booking.client.name}</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="flex items-center justify-center rounded-full bg-primary/10 p-4">
                                        <Calendar className="h-4 w-4 text-primary" />
                                    </div>
                                    <div>
                                        <Label>{t('bookings.show.client_section.date_time')}</Label>
                                        <p className="font-medium">
                                            {new Date(booking.date).toLocaleDateString('es-ES', {
                                                weekday: 'long',
                                                year: 'numeric',
                                                month: 'numeric',
                                                day: 'numeric',
                                            })}{' '}
                                            - {formatTimeAMPM(booking.time)}
                                        </p>
                                    </div>
                                </div>
                                <Separator className="my-4" />
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex items-center gap-4">
                                        <div
                                            className={cn('flex items-center justify-center rounded-full bg-primary/10 p-4', {
                                                'bg-green-500/10': booking.status === 'confirmed',
                                                'bg-yellow-500/10': booking.status === 'pending',
                                                'bg-red-500/10': booking.status === 'cancelled',
                                            })}
                                        >
                                            <Check
                                                className={cn('h-4 w-4', {
                                                    'text-green-500': booking.status === 'confirmed',
                                                    'text-yellow-500': booking.status === 'pending',
                                                    'text-red-500': booking.status === 'cancelled',
                                                })}
                                            />
                                        </div>
                                        <Label>{t('bookings.show.client_section.booking_status')}</Label>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div
                                            className={cn('flex items-center justify-center rounded-full bg-primary/10 p-4', {
                                                'bg-green-500/10': booking.payment_status === 'paid',
                                                'bg-yellow-500/10': booking.payment_status === 'pending',
                                                'bg-red-500/10': booking.payment_status === 'failed',
                                            })}
                                        >
                                            <CreditCard
                                                className={cn('h-4 w-4', {
                                                    'text-green-500': booking.payment_status === 'paid',
                                                    'text-yellow-500': booking.payment_status === 'pending',
                                                    'text-red-500': booking.payment_status === 'failed',
                                                })}
                                            />
                                        </div>
                                        <Label>{t('bookings.show.client_section.payment_status')}</Label>
                                    </div>
                                </div>
                                <div>
                                    <Label>{t('bookings.show.client_section.notes')}</Label>
                                    <p className="font-medium">{booking.notes || t('bookings.show.client_section.no_notes')}</p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Componente para clonar datos */}
                        <CloneFormData currentBooking={booking} bookingHistory={booking_history} />

                        {/* Historial de reservas */}
                        <Card>
                            <CardHeader>
                                <CardTitle>{t('bookings.show.history_section.title')}</CardTitle>
                                <CardDescription>{t('bookings.show.history_section.description')}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {booking_history.length > 0 ? (
                                    <ScrollArea className="h-64">
                                        <div className="space-y-4">
                                            {booking_history.map((pastBooking) => (
                                                <div key={pastBooking.id} className="border-b pb-4 last:border-0">
                                                    <div className="flex items-start justify-between">
                                                        <div className="flex-1 space-y-1">
                                                            <div className="flex items-center gap-2">
                                                                <p className="text-sm font-medium">{formatDate(pastBooking.date)}</p>
                                                                <Badge variant="muted" className="text-xs">
                                                                    {pastBooking.status}
                                                                </Badge>
                                                            </div>
                                                            <p className="text-sm text-muted-foreground">
                                                                {pastBooking.service?.name || 'Servicio no especificado'}
                                                            </p>
                                                            <div className="flex flex-wrap items-center gap-1">
                                                                {pastBooking.forms_data?.map((formGroup) => (
                                                                    <Badge
                                                                        key={formGroup.template.id}
                                                                        variant={formGroup.has_data ? 'outline' : 'muted'}
                                                                        className="text-xs"
                                                                    >
                                                                        {formGroup.template.name}
                                                                    </Badge>
                                                                ))}
                                                            </div>
                                                        </div>
                                                        <Button variant="ghost" size="sm" onClick={() => handleBookingDetails(pastBooking)}>
                                                            {t('bookings.view_details')}
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </ScrollArea>
                                ) : (
                                    <Alert>
                                        <AlertDescription>{t('bookings.show.history_section.no_history')}</AlertDescription>
                                    </Alert>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Columna derecha - Formularios */}
                    <div className="space-y-6 lg:col-span-2">
                        <Tabs defaultValue="profile">
                            <TabsList className="grid w-full max-w-md grid-cols-2">
                                <TabsTrigger value="profile">
                                    <User className="mr-2 h-4 w-4" />
                                    {t('bookings.show.client_profile.title')}
                                </TabsTrigger>
                                <TabsTrigger value="booking">
                                    <FileText className="mr-2 h-4 w-4" />
                                    Formularios de Reserva
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="profile">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>{t('bookings.show.client_profile.description')}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        {user_profile_template ? (
                                            <DynamicForm
                                                template={user_profile_template}
                                                data={formUserProfile.data}
                                                setData={formUserProfile.setData}
                                                errors={formUserProfile.errors}
                                                onSubmit={() => handleFormSubmit(FORM_TYPES.USER_PROFILE)}
                                                isProcessing={formUserProfile.processing}
                                            />
                                        ) : (
                                            <Alert>
                                                <AlertDescription>No hay un template de perfil de usuario configurado.</AlertDescription>
                                            </Alert>
                                        )}
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="booking">{renderBookingFormTabs()}</TabsContent>
                        </Tabs>
                    </div>
                </div>
            </div>

            {/* Dialog para mostrar detalles del historial */}
            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                <DialogContent className="max-h-[80vh] max-w-4xl overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Calendar className="h-5 w-5" />
                            Detalles de la Reserva
                        </DialogTitle>
                        <DialogDescription>
                            Información completa de la reserva del {selectedBookingHistory ? formatDate(selectedBookingHistory.date) : ''}
                        </DialogDescription>
                    </DialogHeader>
                    <ScrollArea className="max-h-96">
                        {selectedBookingHistory && (
                            <div className="space-y-6">
                                {/* Información básica */}
                                <div className="grid grid-cols-2 gap-4 rounded-lg bg-muted/50 p-4">
                                    <div>
                                        <span className="text-sm font-medium text-muted-foreground">Servicio:</span>
                                        <p>{selectedBookingHistory.service?.name || 'No especificado'}</p>
                                    </div>
                                    <div>
                                        <span className="text-sm font-medium text-muted-foreground">Estado:</span>
                                        <Badge variant="muted">{selectedBookingHistory.status}</Badge>
                                    </div>
                                    <div>
                                        <span className="text-sm font-medium text-muted-foreground">Fecha:</span>
                                        <p>{formatDate(selectedBookingHistory.date)}</p>
                                    </div>
                                    <div>
                                        <span className="text-sm font-medium text-muted-foreground">Total:</span>
                                        <p>${selectedBookingHistory.total}</p>
                                    </div>
                                </div>

                                {/* Datos de los formularios */}
                                {selectedBookingHistory.forms_data && selectedBookingHistory.forms_data.length > 0 ? (
                                    renderHistoryFormsData(selectedBookingHistory.forms_data)
                                ) : (
                                    <Alert>
                                        <AlertDescription>No hay información adicional disponible para esta reserva.</AlertDescription>
                                    </Alert>
                                )}
                            </div>
                        )}
                    </ScrollArea>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}

// Componente auxiliar Label
function Label({ children }: { children: React.ReactNode }) {
    return <p className="mb-1 text-sm text-muted-foreground">{children}</p>;
}
