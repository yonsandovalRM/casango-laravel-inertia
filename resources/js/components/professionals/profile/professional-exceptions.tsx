import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ExceptionResource } from '@/interfaces/professional';
import { useForm } from '@inertiajs/react';
import { Clock2Icon } from 'lucide-react';

export function ProfessionalExceptions({ exceptions }: { exceptions: ExceptionResource[] }) {
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

    return (
        <div className="mt-2">
            <form onSubmit={handleSubmit}>
                <Card className="col-span-2 flex-1">
                    <CardContent>
                        <div className="grid grid-cols-3 gap-8 space-y-4">
                            <Calendar
                                mode="single"
                                selected={data.date ? new Date(data.date) : undefined}
                                onSelect={(date) => setData('date', date?.toISOString() ?? '')}
                                className="bg-transparent p-0"
                            />
                            <div className="col-span-2 space-y-4">
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="time-from">Start Time</Label>
                                            <div className="relative flex w-full items-center gap-2">
                                                <Clock2Icon className="pointer-events-none absolute left-2.5 size-4 text-muted-foreground select-none" />
                                                <Input
                                                    id="time-from"
                                                    type="time"
                                                    step="1"
                                                    defaultValue="10:30:00"
                                                    className="appearance-none pl-8 [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <Label htmlFor="time-to">End Time</Label>
                                            <div className="relative flex w-full items-center gap-2">
                                                <Clock2Icon className="pointer-events-none absolute left-2.5 size-4 text-muted-foreground select-none" />
                                                <Input
                                                    id="time-to"
                                                    type="time"
                                                    step="1"
                                                    defaultValue="12:30:00"
                                                    className="appearance-none pl-8 [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <Label htmlFor="reason">Reason</Label>
                                        <Textarea id="reason" name="reason" value={data.reason} onChange={(e) => setData('reason', e.target.value)} />
                                    </div>
                                </div>
                                <Button type="submit" disabled={processing} className="mt-4 w-full">
                                    {processing ? 'Saving...' : 'Save'}
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </form>

            <div className="flex w-full flex-col gap-4">
                {exceptions.length === 0 && <EmptyState text="No exceptions found" />}
                {exceptions.map((exception: ExceptionResource) => (
                    <div key={exception.id}>
                        <p>{exception.date}</p>
                        <p>{exception.start_time}</p>
                        <p>{exception.end_time}</p>
                        <p>{exception.reason}</p>
                        <button onClick={() => handleDelete(exception.id)}>Delete</button>
                    </div>
                ))}
            </div>
        </div>
    );
}
