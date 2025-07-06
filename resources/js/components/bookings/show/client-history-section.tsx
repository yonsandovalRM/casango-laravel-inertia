import { ClientHistory } from '@/interfaces/template';
import { Calendar, User } from 'lucide-react';

interface ClientHistorySectionProps {
    history: ClientHistory[];
}

export function ClientHistorySection({ history }: ClientHistorySectionProps) {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    if (!history || history.length === 0) {
        return (
            <div className="py-8 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-background">
                    <Calendar className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="mb-2 text-lg font-medium text-foreground">Sin historial previo</h3>
                <p className="text-muted-foreground">Este cliente no tiene registros anteriores.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <h3 className="mb-4 text-lg font-semibold text-foreground">Historial del Cliente ({history.length} registros)</h3>

            <div className="space-y-4">
                {history.map((record) => (
                    <div key={record.id} className="rounded-lg border p-4 transition-colors">
                        <div className="mb-3 flex items-start justify-between">
                            <div className="flex items-center space-x-2">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm font-medium text-foreground">{formatDate(record.date)}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <User className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm text-muted-foreground">{record.professional}</span>
                            </div>
                        </div>

                        <div className="space-y-2">
                            {record.fields.map((field, index) => (
                                <div key={index} className="grid grid-cols-1 gap-2 md:grid-cols-2">
                                    {Object.entries(field).map(([key, value]) => (
                                        <div key={key} className="text-sm">
                                            <span className="font-medium text-foreground">{key}:</span>
                                            <span className="ml-2 text-muted-foreground">{value}</span>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
