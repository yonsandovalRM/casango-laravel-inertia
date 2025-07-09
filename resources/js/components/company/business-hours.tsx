import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Schedule } from '@/interfaces/company';
import { DAYS_OF_WEEK } from '@/pages/company';
import { useTranslation } from 'react-i18next';

interface BusinessHoursProps {
    data: any;
    handleScheduleChange?: (dayOfWeek: string, field: keyof Schedule, value: any) => void;
    canEdit?: boolean;
}

const formatTime = (time: string) => {
    if (!time) return '--:--';

    // Extraer horas y minutos
    const [hours, minutes] = time.split(':').map(Number);

    // Determinar AM/PM
    const period = hours >= 12 ? 'pm' : 'am';

    // Convertir a formato 12 horas
    const hours12 = hours % 12 || 12; // 0 se convierte en 12

    // Formatear con ceros a la izquierda si es necesario
    const formattedHours = hours12.toString().padStart(2, '0');
    const formattedMinutes = minutes.toString().padStart(2, '0');

    return `${formattedHours}:${formattedMinutes}${period}`;
};

export default function BusinessHours({ data, handleScheduleChange, canEdit = false }: BusinessHoursProps) {
    const { t } = useTranslation();

    if (!canEdit) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>{t('company.business_hours')}</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {DAYS_OF_WEEK.map((day) => {
                            const schedule = data.schedules.find((s: Schedule) => s.day_of_week === day) || {
                                day_of_week: day,
                                is_open: false,
                            };

                            return (
                                <div key={day} className="flex items-center justify-between rounded-lg border p-3">
                                    <span className="font-medium capitalize">{t(`company.days.${day}`)}</span>

                                    {schedule.is_open ? (
                                        <div className="flex items-center gap-2">
                                            <Badge variant="outline" className="border-green-500 text-green-600">
                                                {t('company.form.open')}
                                            </Badge>
                                            <span className="text-sm text-muted-foreground">
                                                {formatTime(schedule.open_time)} - {formatTime(schedule.close_time)}
                                            </span>
                                            {schedule.has_break && (
                                                <span className="text-sm text-muted-foreground">
                                                    ({t('company.form.break')}: {formatTime(schedule.break_start_time)} -{' '}
                                                    {formatTime(schedule.break_end_time)})
                                                </span>
                                            )}
                                        </div>
                                    ) : (
                                        <Badge variant="outline" className="border-red-500 text-red-600">
                                            {t('company.form.closed')}
                                        </Badge>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>{t('company.business_hours')}</CardTitle>
            </CardHeader>

            <CardContent>
                <div className="space-y-4">
                    {DAYS_OF_WEEK.map((day) => {
                        const schedule = data.schedules.find((s: Schedule) => s.day_of_week === day) || {
                            day_of_week: day,
                            open_time: '09:00',
                            close_time: '18:00',
                            break_start_time: '12:00',
                            break_end_time: '13:00',
                            is_open: true,
                            has_break: false,
                        };

                        return (
                            <div key={day} className="rounded-xl border border-border p-4 transition-shadow duration-200 hover:shadow-md">
                                <div className="mb-3 flex items-center justify-between">
                                    <h4 className="font-semibold text-foreground capitalize">{t(`company.days.${day}`)}</h4>
                                    <Label className="flex items-center gap-2">
                                        <Checkbox
                                            checked={schedule.is_open}
                                            onCheckedChange={(checked) => handleScheduleChange?.(day, 'is_open', checked)}
                                        />
                                        <span className="text-sm text-muted-foreground">{t('company.form.open')}</span>
                                    </Label>
                                </div>

                                {schedule.is_open && (
                                    <>
                                        <div className="grid grid-cols-2 gap-6">
                                            <div>
                                                <Label className="mb-1 block text-xs font-medium text-muted-foreground">
                                                    {t('company.form.open_time')}
                                                </Label>
                                                <Input
                                                    type="time"
                                                    value={schedule.open_time}
                                                    onChange={(e) => handleScheduleChange?.(day, 'open_time', e.target.value)}
                                                    className="appearance-none bg-background [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                                                />
                                            </div>
                                            <div>
                                                <Label className="mb-1 block text-xs font-medium text-muted-foreground">
                                                    {t('company.form.close_time')}
                                                </Label>
                                                <Input
                                                    type="time"
                                                    value={schedule.close_time}
                                                    onChange={(e) => handleScheduleChange?.(day, 'close_time', e.target.value)}
                                                    className="appearance-none bg-background [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                                                />
                                            </div>
                                        </div>
                                    </>
                                )}
                                <div className="my-4 flex items-center gap-2">
                                    <Checkbox
                                        id={`has-break-${day}`}
                                        checked={schedule.has_break}
                                        onCheckedChange={(checked) => handleScheduleChange?.(day, 'has_break', checked)}
                                    />
                                    <Label htmlFor={`has-break-${day}`} className="block text-xs font-medium text-muted-foreground">
                                        {t('company.form.has_break')}
                                    </Label>
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    {schedule.has_break && (
                                        <>
                                            <div>
                                                <Label className="mb-1 block text-xs font-medium text-muted-foreground">
                                                    {t('company.form.break_start')}
                                                </Label>
                                                <Input
                                                    type="time"
                                                    value={schedule.break_start_time || ''}
                                                    onChange={(e) => handleScheduleChange?.(day, 'break_start_time', e.target.value)}
                                                    className="appearance-none bg-background [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                                                />
                                            </div>
                                            <div>
                                                <Label className="mb-1 block text-xs font-medium text-muted-foreground">
                                                    {t('company.form.break_end')}
                                                </Label>
                                                <Input
                                                    type="time"
                                                    value={schedule.break_end_time || ''}
                                                    onChange={(e) => handleScheduleChange?.(day, 'break_end_time', e.target.value)}
                                                    className="appearance-none bg-background [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                                                />
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
}
