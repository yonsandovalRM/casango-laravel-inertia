import { AppHeaderPage } from '@/components/app-header-page';
import DynamicForm from '@/components/bookings/dynamic-form';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookingResource } from '@/interfaces/booking';
import { FormTemplate } from '@/interfaces/form-template';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
// Removed date-fns import as it's not available
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

interface MappedFieldData {
    name: string;
    label: string;
    value: any;
    type: string;
}

interface BookingHistory extends BookingResource {
    mapped_form_data: MappedFieldData[];
    basic_info: MappedFieldData[];
}

type BookingShowProps = {
    booking: BookingResource;
    user_profile_data: UserProfileData;
    booking_form_data: BookingFormData;
    user_profile_template: FormTemplate;
    booking_form_template: FormTemplate;
    booking_history: BookingHistory[];
};

const FORM_TYPES = {
    USER_PROFILE: 'user_profile',
    BOOKING_FORM: 'booking_form',
} as const;

export default function BookingShow({
    booking,
    user_profile_data,
    booking_form_data,
    user_profile_template,
    booking_form_template,
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
    const formUserProfile = useForm<Record<string, any>>({});
    const formBooking = useForm<Record<string, any>>({});
    const [selectedBookingHistory, setSelectedBookingHistory] = useState<BookingHistory | null>(null);
    const [openDialog, setOpenDialog] = useState(false);

    useEffect(() => {
        if (user_profile_data?.data) {
            formUserProfile.setData(user_profile_data.data);
        }
        if (booking_form_data?.data) {
            formBooking.setData(booking_form_data.data);
        }
    }, [user_profile_data, booking_form_data]);

    const handleFormSubmit = (formType: string) => {
        if (formType === FORM_TYPES.USER_PROFILE) {
            formUserProfile.post(route('bookings.form-data.store.user-profile', { booking: booking.id }), {
                preserveScroll: true,
                onSuccess: () => {
                    // Opcional: mostrar mensaje de éxito
                },
            });
        } else if (formType === FORM_TYPES.BOOKING_FORM) {
            formBooking.post(route('bookings.form-data.store.booking-form', { booking: booking.id }), {
                preserveScroll: true,
                onSuccess: () => {
                    // Opcional: mostrar mensaje de éxito
                },
            });
        }
    };

    const handleBookingDetails = (historyBooking: BookingHistory) => {
        setSelectedBookingHistory(historyBooking);
        setOpenDialog(true);
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
                                <CardTitle>{t('bookings.show.client_section.title')}</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label>{t('bookings.show.client_section.client_name')}</Label>
                                    <p className="font-medium">{booking.client.name}</p>
                                </div>
                                <div>
                                    <Label>{t('bookings.show.client_section.date')}</Label>
                                    <p className="font-medium">{formatDateTime(booking.date)}</p>
                                </div>
                                <div>
                                    <Label>{t('bookings.show.client_section.status')}</Label>
                                    <Badge variant="outline" className="capitalize">
                                        {booking.status}
                                    </Badge>
                                </div>
                                <div>
                                    <Label>{t('bookings.show.client_section.notes')}</Label>
                                    <p className="font-medium">{booking.notes || t('bookings.show.client_section.no_notes')}</p>
                                </div>
                            </CardContent>
                        </Card>

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
                                                                <Badge variant="secondary" className="text-xs">
                                                                    {pastBooking.status}
                                                                </Badge>
                                                            </div>
                                                            <p className="text-sm text-muted-foreground">
                                                                {pastBooking.service?.name || 'Servicio no especificado'}
                                                            </p>
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
                            <TabsList className="grid w-full max-w-xs grid-cols-2">
                                <TabsTrigger value="profile">{t('bookings.show.client_profile.title')}</TabsTrigger>
                                <TabsTrigger value="booking">{t('bookings.show.booking_information.title')}</TabsTrigger>
                            </TabsList>

                            <TabsContent value="profile">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>{t('bookings.show.client_profile.description')}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <DynamicForm
                                            template={user_profile_template}
                                            data={formUserProfile.data}
                                            setData={formUserProfile.setData}
                                            errors={formUserProfile.errors}
                                            onSubmit={() => handleFormSubmit(FORM_TYPES.USER_PROFILE)}
                                        />
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="booking">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>{t('bookings.show.booking_information.description')}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <DynamicForm
                                            template={booking_form_template}
                                            data={formBooking.data}
                                            setData={formBooking.setData}
                                            errors={formBooking.errors}
                                            onSubmit={() => handleFormSubmit(FORM_TYPES.BOOKING_FORM)}
                                        />
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            </div>

            {/* Dialog para mostrar detalles del historial */}
            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                <DialogContent className="max-h-[80vh] max-w-2xl overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">Detalles de la Reserva</DialogTitle>
                        <DialogDescription>Información completa de la reserva seleccionada</DialogDescription>
                    </DialogHeader>

                    {selectedBookingHistory && (
                        <div className="space-y-6">
                            {/* Datos del formulario */}
                            {renderFieldsBySection(selectedBookingHistory.mapped_form_data)}

                            {/* Mensaje si no hay datos */}
                            {selectedBookingHistory.mapped_form_data.length === 0 && (
                                <Alert>
                                    <AlertDescription>No hay información adicional disponible para esta reserva.</AlertDescription>
                                </Alert>
                            )}
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}

// Componente auxiliar Label
function Label({ children }: { children: React.ReactNode }) {
    return <p className="mb-1 text-sm text-muted-foreground">{children}</p>;
}
