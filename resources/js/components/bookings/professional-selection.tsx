import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useProfessionals } from '@/hooks/use-professionals';
import { ArrowLeft, Calendar, Clock, DollarSign, User } from 'lucide-react';
import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { TimeSelection } from './time-selection';

interface ProfessionalSelectionProps {
    service: any;
    onBack: () => void;
}

export const ProfessionalSelection: React.FC<ProfessionalSelectionProps> = ({ service, onBack }) => {
    const [selectedProfessional, setSelectedProfessional] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [showTimeSelection, setShowTimeSelection] = useState(false);

    const { professionals, loading } = useProfessionals(service.id, selectedDate);

    const handleProfessionalSelect = (professional: any) => {
        setSelectedProfessional(professional);
        setShowTimeSelection(true);
    };

    const handleBackToProfessionals = () => {
        setShowTimeSelection(false);
        setSelectedProfessional(null);
    };

    if (showTimeSelection && selectedProfessional) {
        return <TimeSelection service={service} professional={selectedProfessional} selectedDate={selectedDate} onBack={handleBackToProfessionals} />;
    }

    return (
        <div className="min-h-screen p-4">
            <div className="mx-auto max-w-6xl">
                {/* Header */}
                <div className="mb-6 flex items-center">
                    <Button variant="ghost" onClick={onBack}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Volver a servicios
                    </Button>
                </div>

                {/* Service Info */}
                <Card className="mb-8 bg-card">
                    <CardHeader>
                        <div className="flex items-start justify-between">
                            <div>
                                <CardTitle className="mb-2 text-2xl">{service.name}</CardTitle>
                                <p className="text-muted-foreground">{service.description}</p>
                            </div>
                            <div className="text-right">
                                <div className="text-3xl font-bold text-blue-600">${Number(service.price).toLocaleString()}</div>
                                <div className="text-sm text-muted-foreground">{service.duration} minutos</div>
                            </div>
                        </div>
                    </CardHeader>
                </Card>

                {/* Date Selection */}
                <Card className="mb-8 bg-card">
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <Calendar className="mr-2 h-5 w-5" />
                            Selecciona una fecha
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            min={new Date().toISOString().split('T')[0]}
                            className="w-full rounded-lg border border-input p-3 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                        />
                    </CardContent>
                </Card>

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
                ) : (
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {professionals.map((professional) => (
                            <Card
                                key={professional.id}
                                className="group cursor-pointer bg-card transition-all duration-300 hover:shadow-xl"
                                onClick={() => handleProfessionalSelect(professional)}
                            >
                                <CardHeader>
                                    <div className="mb-3 flex items-center space-x-4">
                                        <Avatar className="h-12 w-12">
                                            <AvatarImage src={professional.photo} />
                                            <AvatarFallback className="bg-blue-100 text-blue-600">
                                                {professional.user.name
                                                    .split(' ')
                                                    .map((n) => n[0])
                                                    .join('')}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1">
                                            <h3 className="text-lg font-semibold transition-colors group-hover:text-blue-600">
                                                {professional.title} {professional.user.name}
                                            </h3>
                                        </div>
                                    </div>

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
                                            className="w-full transition-colors group-hover:bg-blue-600"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleProfessionalSelect(professional);
                                            }}
                                        >
                                            <Calendar className="mr-2 h-4 w-4" />
                                            Ver horarios disponibles
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

                {!loading && professionals.length === 0 && (
                    <div className="py-12 text-center">
                        <div className="mb-4 text-muted-foreground">
                            <User className="mx-auto h-16 w-16" />
                        </div>
                        <h3 className="mb-2 text-xl font-semibold text-muted-foreground">No hay profesionales disponibles</h3>
                        <p className="text-muted-foreground">Intenta seleccionar otra fecha</p>
                    </div>
                )}
            </div>
        </div>
    );
};
