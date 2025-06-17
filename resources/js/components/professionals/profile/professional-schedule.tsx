import { Alert, AlertDescription } from '@/components/ui/alert';
import { CompanyScheduleObject, ProfessionalScheduleFormData, ProfessionalScheduleResource } from '@/interfaces/schedules';
import { useForm } from '@inertiajs/react';
import { Info } from 'lucide-react';

interface ProfessionalScheduleProps {
    isFullTime: boolean;
    professional_schedules: ProfessionalScheduleResource[];
    company_schedules: CompanyScheduleObject;
}

export function ProfessionalSchedule({ isFullTime, professional_schedules, company_schedules }: ProfessionalScheduleProps) {
    const { data, setData, post, processing, errors } = useForm<ProfessionalScheduleFormData>({
        day_of_week: '0',
        open_time: '09:00',
        close_time: '18:00',
        break_start_time: '13:00',
        break_end_time: '14:00',
        is_open: true,
        has_break: true,
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post(route('professional.schedule.update', { _method: 'PUT' }));
    };

    return (
        <div>
            {isFullTime ? (
                <div>
                    <Alert variant="info" className="mb-4">
                        <AlertDescription className="flex items-center gap-2">
                            <Info className="size-4" />
                            <span>Actualmente se está usando el horario de la empresa</span>
                        </AlertDescription>
                    </Alert>
                    <div className="flex flex-col gap-2">
                        {Object.entries(company_schedules).map(([day, schedule]) => (
                            <div key={day} className="flex items-center gap-2">
                                <span className="font-sm">{day}</span>
                                <span className="text-sm text-muted-foreground">{schedule}</span>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <form onSubmit={handleSubmit}>{/* formulario  */}</form>
            )}
        </div>
    );
}
