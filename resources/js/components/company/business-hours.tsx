import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Schedule } from '@/interfaces/company';
import { formatTime, validateSchedule } from '@/lib/company-utils';
import { DAYS_OF_WEEK } from '@/pages/company';
import { AlertTriangle, Clock } from 'lucide-react';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

interface BusinessHoursProps {
    data: any;
    handleScheduleChange?: (dayOfWeek: string, field: keyof Schedule, value: any) => void;
    canEdit?: boolean;
}

export default function BusinessHours({ data, handleScheduleChange, canEdit = false }: BusinessHoursProps) {
    const { t } = useTranslation();

    // Memoized schedule validation
    const scheduleErrors = useMemo(() => {
        if (!canEdit) return {};

        const errors: Record<string, string[]> = {};
        data.schedules?.forEach((schedule: Schedule) => {
            const dayErrors = validateSchedule(schedule);
            if (dayErrors.length > 0) {
                errors[schedule.day_of_week] = dayErrors;
            }
        });
        return errors;
    }, [data.schedules, canEdit]);

    const hasErrors = Object.keys(scheduleErrors).length > 0;

    if (!canEdit) {
        return <BusinessHoursReadOnly data={data} t={t} />;
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    {t('company.business_hours')}
                </CardTitle>
            </CardHeader>

            <CardContent>
                {hasErrors && (
                    <Alert variant="destructive" className="mb-4">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>{t('company.schedule_validation_errors')}</AlertDescription>
                    </Alert>
                )}

                <div className="space-y-4">
                    {DAYS_OF_WEEK.map((day) => {
                        const schedule = data.schedules?.find((s: Schedule) => s.day_of_week === day) || {
                            day_of_week: day,
                            open_time: '09:00',
                            close_time: '18:00',
                            break_start_time: '12:00',
                            break_end_time: '13:00',
                            is_open: true,
                            has_break: false,
                        };

                        const dayErrors = scheduleErrors[day] || [];
                        const hasError = dayErrors.length > 0;

                        return (
                            <ScheduleEditCard
                                key={day}
                                day={day}
                                schedule={schedule}
                                errors={dayErrors}
                                hasError={hasError}
                                onScheduleChange={handleScheduleChange}
                                t={t}
                            />
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
}

// Read-only component for viewing schedules
const BusinessHoursReadOnly: React.FC<{ data: any; t: any }> = ({ data, t }) => (
    <Card>
        <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                {t('company.business_hours')}
            </CardTitle>
        </CardHeader>
        <CardContent>
            <div className="space-y-4">
                {DAYS_OF_WEEK.map((day) => {
                    const schedule = data.schedules?.find((s: Schedule) => s.day_of_week === day) || {
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

// Individual schedule editing card
interface ScheduleEditCardProps {
    day: string;
    schedule: Schedule;
    errors: string[];
    hasError: boolean;
    onScheduleChange?: (dayOfWeek: string, field: keyof Schedule, value: any) => void;
    t: any;
}

const ScheduleEditCard: React.FC<ScheduleEditCardProps> = ({ day, schedule, errors, hasError, onScheduleChange, t }) => {
    return (
        <div
            className={`rounded-xl border p-4 transition-all duration-200 hover:shadow-md ${
                hasError ? 'border-red-300 bg-red-50/50 dark:border-red-600 dark:bg-red-900/10' : 'border-border'
            }`}
        >
            <div className="mb-3 flex items-center justify-between">
                <h4 className="font-semibold text-foreground capitalize">{t(`company.days.${day}`)}</h4>
                <Label className="flex items-center gap-2">
                    <Checkbox checked={schedule.is_open} onCheckedChange={(checked) => onScheduleChange?.(day, 'is_open', checked)} />
                    <span className="text-sm text-muted-foreground">{t('company.form.open')}</span>
                </Label>
            </div>

            {schedule.is_open && (
                <>
                    <div className="mb-4 grid grid-cols-2 gap-6">
                        <div>
                            <Label className="mb-1 block text-xs font-medium text-muted-foreground">{t('company.form.open_time')}</Label>
                            <Input
                                type="time"
                                value={schedule.open_time}
                                onChange={(e) => onScheduleChange?.(day, 'open_time', e.target.value)}
                                className={`appearance-none bg-background ${hasError ? 'border-red-300 focus:border-red-500' : ''}`}
                            />
                        </div>
                        <div>
                            <Label className="mb-1 block text-xs font-medium text-muted-foreground">{t('company.form.close_time')}</Label>
                            <Input
                                type="time"
                                value={schedule.close_time}
                                onChange={(e) => onScheduleChange?.(day, 'close_time', e.target.value)}
                                className={`appearance-none bg-background ${hasError ? 'border-red-300 focus:border-red-500' : ''}`}
                            />
                        </div>
                    </div>

                    <div className="mb-4 flex items-center gap-2">
                        <Checkbox
                            id={`has-break-${day}`}
                            checked={schedule.has_break}
                            onCheckedChange={(checked) => onScheduleChange?.(day, 'has_break', checked)}
                        />
                        <Label htmlFor={`has-break-${day}`} className="text-xs font-medium text-muted-foreground">
                            {t('company.form.has_break')}
                        </Label>
                    </div>

                    {schedule.has_break && (
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <Label className="mb-1 block text-xs font-medium text-muted-foreground">{t('company.form.break_start')}</Label>
                                <Input
                                    type="time"
                                    value={schedule.break_start_time || ''}
                                    onChange={(e) => onScheduleChange?.(day, 'break_start_time', e.target.value)}
                                    className={`appearance-none bg-background ${hasError ? 'border-red-300 focus:border-red-500' : ''}`}
                                />
                            </div>
                            <div>
                                <Label className="mb-1 block text-xs font-medium text-muted-foreground">{t('company.form.break_end')}</Label>
                                <Input
                                    type="time"
                                    value={schedule.break_end_time || ''}
                                    onChange={(e) => onScheduleChange?.(day, 'break_end_time', e.target.value)}
                                    className={`appearance-none bg-background ${hasError ? 'border-red-300 focus:border-red-500' : ''}`}
                                />
                            </div>
                        </div>
                    )}
                </>
            )}

            {/* Display errors for this day */}
            {hasError && (
                <div className="mt-3 space-y-1">
                    {errors.map((error, index) => (
                        <p key={index} className="text-xs text-red-600 dark:text-red-400">
                            {error}
                        </p>
                    ))}
                </div>
            )}
        </div>
    );
};
