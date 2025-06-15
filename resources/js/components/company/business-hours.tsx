import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Schedule } from '@/interfaces/company';
import { DAYS_OF_WEEK } from '@/pages/company';
import { withTranslation } from 'react-i18next';

interface Props {
    t: any;
    data: any;
    handleScheduleChange: (dayOfWeek: string, field: keyof Schedule, value: any) => void;
}

export default withTranslation()(BusinessHours);

function BusinessHours({ t, data, handleScheduleChange }: Props) {
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
                                            onCheckedChange={(checked) => handleScheduleChange(day, 'is_open', checked)}
                                        />
                                        <span className="text-sm text-muted-foreground">{t('company.form.open')}</span>
                                    </Label>
                                </div>

                                {schedule.is_open && (
                                    <>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <Label className="mb-1 block text-xs font-medium text-muted-foreground">
                                                    {t('company.form.open_time')}
                                                </Label>
                                                <Input
                                                    type="time"
                                                    value={schedule.open_time}
                                                    onChange={(e) => handleScheduleChange(day, 'open_time', e.target.value)}
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
                                                    onChange={(e) => handleScheduleChange(day, 'close_time', e.target.value)}
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
                                        onCheckedChange={(checked) => handleScheduleChange(day, 'has_break', checked)}
                                    />
                                    <Label htmlFor={`has-break-${day}`} className="block text-xs font-medium text-muted-foreground">
                                        {t('company.form.has_break')}
                                    </Label>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    {schedule.has_break && (
                                        <>
                                            <div>
                                                <Label className="mb-1 block text-xs font-medium text-muted-foreground">
                                                    {t('company.form.break_start')}
                                                </Label>
                                                <Input
                                                    type="time"
                                                    value={schedule.break_start_time || ''}
                                                    onChange={(e) => handleScheduleChange(day, 'break_start_time', e.target.value)}
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
                                                    onChange={(e) => handleScheduleChange(day, 'break_end_time', e.target.value)}
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
