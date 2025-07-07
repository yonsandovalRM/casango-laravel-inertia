import { AppHeaderPage } from '@/components/app-header-page';
import DynamicForm from '@/components/bookings/dynamic-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookingResource } from '@/interfaces/booking';
import { FormTemplate } from '@/interfaces/form-template';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import { format } from 'date-fns';
import { useEffect } from 'react';
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

type BookingShowProps = {
    booking: BookingResource;
    user_profile_data: UserProfileData;
    booking_form_data: BookingFormData;
    user_profile_template: FormTemplate;
    booking_form_template: FormTemplate;
    booking_history: BookingResource[];
};

const FORM_TYPES = {
    USER_PROFILE: 'user_profile',
    BOOKING_FORM: 'booking_form',
};

export default function BookingShow({
    booking,
    user_profile_data,
    booking_form_data,
    user_profile_template,
    booking_form_template,
    booking_history,
}: BookingShowProps) {
    const { t } = useTranslation();
    const formUserProfile = useForm();
    const formBooking = useForm();
    console.log(user_profile_data.data, booking_form_data.data);
    useEffect(() => {
        formUserProfile.setData(user_profile_data.data);
        formBooking.setData(booking_form_data.data.data);
    }, [user_profile_data, booking_form_data]);

    const handleFormSubmit = (formData: any, formType: string) => {
        if (formType === FORM_TYPES.USER_PROFILE) {
            formUserProfile.post(route('bookings.form-data.store.user-profile', { booking: booking.id }));
        } else {
            formBooking.post(route('bookings.form-data.store.booking-form', { booking: booking.id }));
        }
    };

    return (
        <AppLayout breadcrumbs={[{ title: t('bookings.index.title'), href: '/bookings' }]}>
            <Head title={t('bookings.show.title')} />
            <AppHeaderPage title={t('bookings.show.title')} description={t('bookings.show.description')} />

            <div className="space-y-6 p-4">
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Columna izquierda - Información básica */}
                    <div className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>{t('bookings.booking_details')}</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label>{t('bookings.client')}</Label>
                                    <p className="font-medium">{booking.client.name}</p>
                                </div>
                                <div>
                                    <Label>{t('bookings.date')}</Label>
                                    <p className="font-medium">{format(new Date(booking.date), 'PPp')}</p>
                                </div>
                                <div>
                                    <Label>{t('bookings.status')}</Label>
                                    <p className="font-medium capitalize">{booking.status}</p>
                                </div>
                                <div>
                                    <Label>{t('bookings.notes')}</Label>
                                    <p className="font-medium">{booking.notes || t('bookings.no_notes')}</p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Historial de reservas */}
                        <Card>
                            <CardHeader>
                                <CardTitle>{t('bookings.history')}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {booking_history.length > 0 ? (
                                    <ScrollArea className="h-64">
                                        <div className="space-y-4">
                                            {booking_history.map((pastBooking) => (
                                                <div key={pastBooking.id} className="border-b pb-4 last:border-0">
                                                    <div className="flex items-start justify-between">
                                                        <div>
                                                            <p className="font-medium">{format(new Date(pastBooking.date), 'PPp')}</p>
                                                            <p className="text-sm text-muted-foreground">{pastBooking.status}</p>
                                                        </div>
                                                        <Button variant="ghost" size="sm">
                                                            {t('bookings.view_details')}
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </ScrollArea>
                                ) : (
                                    <p className="py-4 text-center text-muted-foreground">{t('bookings.no_history')}</p>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Columna derecha - Formularios */}
                    <div className="space-y-6 lg:col-span-2">
                        <Tabs defaultValue="profile">
                            <TabsList className="grid w-full max-w-xs grid-cols-2">
                                <TabsTrigger value="profile">{t('bookings.client_profile')}</TabsTrigger>
                                <TabsTrigger value="booking">{t('bookings.booking_data')}</TabsTrigger>
                            </TabsList>

                            <TabsContent value="profile">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>{t('bookings.client_information')}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <DynamicForm
                                            template={user_profile_template}
                                            data={formUserProfile.data}
                                            setData={formUserProfile.setData}
                                            errors={formUserProfile.errors}
                                            onSubmit={(data: any) => handleFormSubmit(data, FORM_TYPES.USER_PROFILE)}
                                        />
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="booking">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>{t('bookings.booking_information')}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <DynamicForm
                                            template={booking_form_template}
                                            data={formBooking.data}
                                            setData={formBooking.setData}
                                            errors={formBooking.errors}
                                            onSubmit={(data: any) => handleFormSubmit(data, FORM_TYPES.BOOKING_FORM)}
                                        />
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

// Componente auxiliar Label
function Label({ children }: { children: React.ReactNode }) {
    return <p className="mb-1 text-sm text-muted-foreground">{children}</p>;
}
