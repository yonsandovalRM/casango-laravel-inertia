import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CompanyScheduleObject, ProfessionalScheduleResource } from '@/interfaces/schedules';
import { router } from '@inertiajs/react';
import { Clock, Info, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface ProfessionalScheduleProps {
    isFullTime: boolean;
    professional_schedules: ProfessionalScheduleResource[];
    company_schedules: CompanyScheduleObject;
}

interface DaySchedule {
    day_of_week: string;
    open_time: string;
    close_time: string;
    break_start_time: string;
    break_end_time: string;
    is_open: boolean;
    has_break: boolean;
}

const DAYS_OF_WEEK = [
    { key: 'monday', label: 'Lunes', value: '1' },
    { key: 'tuesday', label: 'Martes', value: '2' },
    { key: 'wednesday', label: 'Miércoles', value: '3' },
    { key: 'thursday', label: 'Jueves', value: '4' },
    { key: 'friday', label: 'Viernes', value: '5' },
    { key: 'saturday', label: 'Sábado', value: '6' },
    { key: 'sunday', label: 'Domingo', value: '0' },
];

export function ProfessionalSchedule({ isFullTime, professional_schedules, company_schedules }: ProfessionalScheduleProps) {
    // Inicializar horarios existentes o crear horarios por defecto
    const initializeSchedules = (): DaySchedule[] => {
        return DAYS_OF_WEEK.map((day) => {
            const existingSchedule = professional_schedules.find((schedule) => schedule.day_of_week === day.key);

            return existingSchedule
                ? {
                      day_of_week: existingSchedule.day_of_week,
                      open_time: existingSchedule.open_time,
                      close_time: existingSchedule.close_time,
                      break_start_time: existingSchedule.break_start_time || '13:00',
                      break_end_time: existingSchedule.break_end_time || '14:00',
                      is_open: existingSchedule.is_open,
                      has_break: existingSchedule.has_break || false,
                  }
                : {
                      day_of_week: day.key,
                      open_time: '09:00',
                      close_time: '18:00',
                      break_start_time: '13:00',
                      break_end_time: '14:00',
                      is_open: false,
                      has_break: false,
                  };
        });
    };

    const [schedules, setSchedules] = useState<DaySchedule[]>(initializeSchedules());

    const handleScheduleChange = (dayIndex: number, field: keyof DaySchedule, value: string | boolean) => {
        setSchedules((prev) => prev.map((schedule, index) => (index === dayIndex ? { ...schedule, [field]: value } : schedule)));
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // si un day tiene has_break en false, debe tener break_start_time y break_end_time en null
        const activeSchedules = schedules.map((schedule) => {
            if (!schedule.has_break) {
                return {
                    ...schedule,
                    break_start_time: null,
                    break_end_time: null,
                };
            }
            return schedule;
        });
        router.put(route('professional.schedule.update'), {
            schedules: activeSchedules as any,
        });
    };

    const copyScheduleToAll = (sourceIndex: number) => {
        const sourceSchedule = schedules[sourceIndex];
        setSchedules((prev) =>
            prev.map((schedule) => ({
                ...schedule,
                open_time: sourceSchedule.open_time,
                close_time: sourceSchedule.close_time,
                break_start_time: sourceSchedule.break_start_time,
                break_end_time: sourceSchedule.break_end_time,
                has_break: sourceSchedule.has_break,
            })),
        );
    };

    const toggleAllDays = (isOpen: boolean) => {
        setSchedules((prev) =>
            prev.map((schedule) => ({
                ...schedule,
                is_open: isOpen,
            })),
        );
    };

    return (
        <div className="space-y-6">
            {isFullTime ? (
                <div>
                    <Alert className="mb-4">
                        <Info className="size-4" />
                        <AlertDescription>Actualmente se está usando el horario de la empresa</AlertDescription>
                    </Alert>
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Clock className="size-5" />
                                Horario de la Empresa
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-3">
                                {Object.entries(company_schedules).map(([day, schedule]) => (
                                    <div key={day} className="flex items-center justify-between rounded-lg border p-3">
                                        <span className="font-medium capitalize">{day}</span>
                                        <span className="text-sm text-muted-foreground">{schedule}</span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                    <Card>
                        <CardHeader className="mb-4 flex flex-row items-center justify-between">
                            <CardTitle className="flex items-center gap-2">
                                <Clock className="size-5" />
                                Configurar Horario Personal
                            </CardTitle>
                            <div className="flex gap-2">
                                <Button type="button" variant="outline" size="sm" onClick={() => toggleAllDays(true)}>
                                    <Plus className="mr-1 size-4" />
                                    Activar Todos
                                </Button>
                                <Button type="button" variant="outline" size="sm" onClick={() => toggleAllDays(false)}>
                                    <Trash2 className="mr-1 size-4" />
                                    Desactivar Todos
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {schedules.map((schedule, index) => (
                                <div key={schedule.day_of_week} className="space-y-4 rounded-lg border p-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <Checkbox
                                                id={`day-${schedule.day_of_week}`}
                                                checked={schedule.is_open}
                                                onCheckedChange={(checked) => handleScheduleChange(index, 'is_open', checked as boolean)}
                                            />
                                            <Label htmlFor={`day-${schedule.day_of_week}`} className="text-base font-medium">
                                                {DAYS_OF_WEEK.find((d) => d.key === schedule.day_of_week)?.label}
                                            </Label>
                                        </div>
                                        {schedule.is_open && (
                                            <Button type="button" variant="ghost" size="sm" onClick={() => copyScheduleToAll(index)}>
                                                Copiar a todos
                                            </Button>
                                        )}
                                    </div>

                                    {schedule.is_open && (
                                        <div className="ml-6 space-y-4">
                                            {/* Horario de trabajo */}
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <Label htmlFor={`open-${schedule.day_of_week}`}>Hora de Apertura</Label>
                                                    <Input
                                                        id={`open-${schedule.day_of_week}`}
                                                        type="time"
                                                        value={schedule.open_time}
                                                        onChange={(e) => handleScheduleChange(index, 'open_time', e.target.value)}
                                                    />
                                                </div>
                                                <div>
                                                    <Label htmlFor={`close-${schedule.day_of_week}`}>Hora de Cierre</Label>
                                                    <Input
                                                        id={`close-${schedule.day_of_week}`}
                                                        type="time"
                                                        value={schedule.close_time}
                                                        onChange={(e) => handleScheduleChange(index, 'close_time', e.target.value)}
                                                    />
                                                </div>
                                            </div>

                                            {/* Descanso */}
                                            <div className="space-y-3">
                                                <div className="flex items-center gap-2">
                                                    <Checkbox
                                                        id={`break-${schedule.day_of_week}`}
                                                        checked={schedule.has_break}
                                                        onCheckedChange={(checked) => handleScheduleChange(index, 'has_break', checked as boolean)}
                                                    />
                                                    <Label htmlFor={`break-${schedule.day_of_week}`}>Incluir horario de descanso</Label>
                                                </div>

                                                {schedule.has_break && (
                                                    <div className="ml-6 grid grid-cols-2 gap-4">
                                                        <div>
                                                            <Label htmlFor={`break-start-${schedule.day_of_week}`}>Inicio del Descanso</Label>
                                                            <Input
                                                                id={`break-start-${schedule.day_of_week}`}
                                                                type="time"
                                                                value={schedule.break_start_time}
                                                                onChange={(e) => handleScheduleChange(index, 'break_start_time', e.target.value)}
                                                            />
                                                        </div>
                                                        <div>
                                                            <Label htmlFor={`break-end-${schedule.day_of_week}`}>Fin del Descanso</Label>
                                                            <Input
                                                                id={`break-end-${schedule.day_of_week}`}
                                                                type="time"
                                                                value={schedule.break_end_time}
                                                                onChange={(e) => handleScheduleChange(index, 'break_end_time', e.target.value)}
                                                            />
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}

                            <div className="flex justify-end gap-2 pt-4">
                                <Button type="submit">Guardar Horarios</Button>
                            </div>
                        </CardContent>
                    </Card>
                </form>
            )}
        </div>
    );
}
