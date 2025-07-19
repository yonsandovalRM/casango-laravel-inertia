import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useProfessionals } from '@/hooks/use-professionals';
import { ProfessionalResource } from '@/interfaces/professional';
import { ServiceResource } from '@/interfaces/service';
import { ArrowLeft, Calendar, Clock, DollarSign, User } from 'lucide-react';
import React, { useState } from 'react';
import { ProfessionalHeader } from '../professionals/ui/professional-header';
import { WeeklyDatePicker } from './weekly-date-picker';

interface ProfessionalSelectionProps {
    service: ServiceResource;
    onBack?: () => void;
    onProfessionalSelect?: (professional: ProfessionalResource, date: string) => void;
    hideHeader?: boolean;
}

export const ProfessionalSelection: React.FC<ProfessionalSelectionProps> = ({ service, onBack, onProfessionalSelect, hideHeader = false }) => {
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const { professionals, loading } = useProfessionals(service.id, selectedDate);

    const handleProfessionalSelect = (professional: ProfessionalResource) => {
        onProfessionalSelect?.(professional, selectedDate);
    };

    const renderLoadingSkeleton = () => (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse">
                    <CardHeader>
                        <div className="flex items-center space-x-4">
                            <div className="h-12 w-12 rounded-full bg-muted"></div>
                            <div className="flex-1 space-y-2">
                                <div className="h-4 w-3/4 rounded bg-muted"></div>
                                <div className="h-3 w-1/2 rounded bg-muted"></div>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            <div className="h-3 rounded bg-muted"></div>
                            <div className="h-3 w-2/3 rounded bg-muted"></div>
                            <div className="h-10 rounded bg-muted"></div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );

    const renderEmptyState = () => (
        <div className="py-12 text-center">
            <div className="mb-4 text-muted-foreground">
                <User className="mx-auto h-16 w-16" />
            </div>
            <h3 className="mb-2 text-xl font-semibold text-muted-foreground">No hay profesionales disponibles</h3>
            <p className="text-muted-foreground">Intenta seleccionar otra fecha</p>
        </div>
    );

    return (
        <div className={hideHeader ? '' : 'min-h-screen p-4'}>
            <div className={hideHeader ? '' : 'mx-auto max-w-6xl'}>
                {/* Header */}
                {!hideHeader && onBack && (
                    <div className="mb-6 flex items-center">
                        <Button variant="ghost" onClick={onBack} className="mr-4 hover:bg-white/50">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Volver a servicios
                        </Button>
                    </div>
                )}

                {/* Service Info */}
                {!hideHeader && (
                    <Card className="mb-8 bg-white/80 backdrop-blur-sm">
                        <CardHeader>
                            <div className="flex items-start justify-between">
                                <div>
                                    <CardTitle className="mb-2 text-2xl">{service.name}</CardTitle>
                                    <p className="text-muted-foreground">{service.description}</p>
                                </div>
                                <div className="text-right">
                                    <div className="text-3xl font-bold text-primary">${Number(service.price).toLocaleString()}</div>
                                    <div className="text-sm text-muted-foreground">{service.duration} minutos</div>
                                </div>
                            </div>
                        </CardHeader>
                    </Card>
                )}

                {/* Date Selection */}
                <div className="mb-8">
                    <div className="mb-4">
                        <h2 className="flex items-center text-xl font-semibold text-foreground">
                            <Calendar className="mr-2 h-5 w-5" />
                            Selecciona una fecha
                        </h2>
                    </div>
                    <WeeklyDatePicker selectedDate={selectedDate} onDateSelect={setSelectedDate} />
                </div>

                {/* Professionals */}
                <div className="mb-6">
                    <h2 className="mb-4 text-2xl font-bold text-foreground">
                        Profesionales disponibles para{' '}
                        {new Date(selectedDate).toLocaleDateString('es-ES', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                        })}
                    </h2>
                </div>

                {loading ? (
                    renderLoadingSkeleton()
                ) : professionals.length === 0 ? (
                    renderEmptyState()
                ) : (
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {professionals.map((professional) => (
                            <Card
                                key={professional.id}
                                className="group cursor-pointer bg-card transition-all duration-300 hover:shadow-xl"
                                onClick={() => handleProfessionalSelect(professional)}
                            >
                                <CardHeader>
                                    <ProfessionalHeader professional={professional} />
                                    {professional.bio && <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">{professional.bio}</p>}
                                </CardHeader>

                                <CardContent>
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center text-sm text-muted-foreground">
                                                <DollarSign className="mr-1 h-4 w-4" />
                                                Precio personalizado
                                            </div>
                                            <Badge variant="outline">Disponible</Badge>
                                        </div>

                                        <div className="flex items-center text-sm text-muted-foreground">
                                            <Clock className="mr-1 h-4 w-4" />
                                            Duración personalizada disponible
                                        </div>

                                        <Button
                                            className="w-full"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleProfessionalSelect(professional);
                                            }}
                                        >
                                            <Calendar className="mr-2 h-4 w-4" />
                                            Seleccionar profesional
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
