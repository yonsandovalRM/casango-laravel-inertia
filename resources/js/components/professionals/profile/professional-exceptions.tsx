import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ExceptionResource } from '@/interfaces/professional';
import { useForm } from '@inertiajs/react';
import { es } from 'date-fns/locale';
import { CalendarDaysIcon, Clock2Icon, TrashIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function ProfessionalExceptions({ exceptions }: { exceptions: ExceptionResource[] }) {
    const { t } = useTranslation();
    const {
        data,
        setData,
        post,
        processing,
        errors,
        delete: destroy,
        reset,
    } = useForm({
        date: '',
        start_time: '',
        end_time: '',
        reason: '',
    });

    const handleDelete = (id: string) => {
        destroy(route('professional.exceptions.destroy', { exception: id }));
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post(route('professional.exceptions.store'), {
            onSuccess: () => {
                handleClose();
            },
        });
    };

    const handleClose = () => {
        reset();
    };

    const formatTime = (time: string) => {
        return time.split(':').slice(0, 2).join(':');
    };

    return (
        <div className="mt-2">
            <form onSubmit={handleSubmit}>
                <Card className="col-span-2 flex-1">
                    <CardContent>
                        <div className="grid grid-cols-1 gap-8 space-y-4 xl:grid-cols-3">
                            <div>
                                <Calendar
                                    locale={es}
                                    mode="single"
                                    selected={data.date ? new Date(data.date) : undefined}
                                    onSelect={(date) => setData('date', date?.toISOString() ?? '')}
                                    className="bg-transparent p-0"
                                />
                                <InputError message={errors.date} />
                            </div>
                            <div className="col-span-2 space-y-4">
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-6">
                                        <div>
                                            <Label htmlFor="time-from">{t('professional.exceptions.form.start_time')}</Label>
                                            <div className="relative flex w-full items-center gap-2">
                                                <Clock2Icon className="pointer-events-none absolute left-2.5 size-4 text-muted-foreground select-none" />
                                                <Input
                                                    id="time-from"
                                                    type="time"
                                                    value={data.start_time}
                                                    onChange={(e) => setData('start_time', e.target.value)}
                                                    className="appearance-none pl-8 [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                                                />
                                                <InputError message={errors.start_time} />
                                            </div>
                                        </div>
                                        <div>
                                            <Label htmlFor="time-to">{t('professional.exceptions.form.end_time')}</Label>
                                            <div className="relative flex w-full items-center gap-2">
                                                <Clock2Icon className="pointer-events-none absolute left-2.5 size-4 text-muted-foreground select-none" />
                                                <Input
                                                    id="time-to"
                                                    type="time"
                                                    value={data.end_time}
                                                    onChange={(e) => setData('end_time', e.target.value)}
                                                    className="appearance-none pl-8 [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                                                />
                                                <InputError message={errors.end_time} />
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <Label htmlFor="reason">{t('professional.exceptions.form.reason')}</Label>
                                        <Textarea id="reason" name="reason" value={data.reason} onChange={(e) => setData('reason', e.target.value)} />
                                        <InputError message={errors.reason} />
                                    </div>
                                </div>
                                <Button type="submit" disabled={processing} className="mt-4 w-full">
                                    {processing ? t('professional.exceptions.form.saving') : t('professional.exceptions.form.save')}
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </form>

            <div className="mt-4 flex w-full flex-col gap-6">
                {exceptions.length === 0 && <EmptyState text="No exceptions found" />}
                {exceptions.map((exception: ExceptionResource) => (
                    <Card key={exception.id} className="group transition-all hover:shadow-md" aria-labelledby={`exception-${exception.id}-title`}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                            <div className="flex items-center space-x-3">
                                <CalendarDaysIcon className="h-5 w-5 text-muted-foreground" />
                                <h3 id={`exception-${exception.id}-title`} className="text-lg leading-tight font-semibold">
                                    {new Date(exception.date).toLocaleDateString('es-ES', {
                                        weekday: 'long',
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                    })}
                                </h3>
                            </div>

                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDelete(exception.id)}
                                className="rounded-full opacity-0 transition-opacity group-hover:opacity-100"
                                aria-label={`Eliminar excepción del ${exception.date}`}
                            >
                                <TrashIcon className="h-4 w-4 text-destructive" />
                            </Button>
                        </CardHeader>

                        <CardContent className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">{t('professional.exceptions.form.start_time')}</p>
                                <p className="font-medium">{formatTime(exception.start_time)}</p>
                            </div>

                            <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">{t('professional.exceptions.form.end_time')}</p>
                                <p className="font-medium">{formatTime(exception.end_time)}</p>
                            </div>

                            {exception.reason && (
                                <div className="col-span-full space-y-1">
                                    <p className="text-sm text-muted-foreground">{t('professional.exceptions.form.reason')}</p>
                                    <p className="font-medium text-pretty">{exception.reason}</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
