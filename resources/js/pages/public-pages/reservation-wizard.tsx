import { BookingConfirmation } from '@/components/bookings/booking-confirmation';
import { ProfessionalSelection } from '@/components/bookings/professional-selection';
import { TimeSelection } from '@/components/bookings/time-selection';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import BookingLayout from '@/layouts/booking-layout';
import { ArrowLeft, CheckCircle, Clock, User } from 'lucide-react';
import React, { useState } from 'react';

interface ReservationWizardProps {
    service: any;
    onBack: () => void;
}

type Step = 'professional' | 'time' | 'confirmation';

export default function ReservationWizard({ service, onBack }: ReservationWizardProps) {
    const [currentStep, setCurrentStep] = useState<Step>('professional');
    const [selectedProfessional, setSelectedProfessional] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [selectedTime, setSelectedTime] = useState(null);
    const [availability, setAvailability] = useState(null);

    const steps = [
        { id: 'professional', title: 'Profesional', icon: User, completed: !!selectedProfessional },
        { id: 'time', title: 'Horario', icon: Clock, completed: !!selectedTime },
        { id: 'confirmation', title: 'Confirmación', icon: CheckCircle, completed: false },
    ];

    const handleProfessionalSelect = (professional: any, date: string) => {
        setSelectedProfessional(professional);
        setSelectedDate(date);
        setCurrentStep('time');
    };

    const handleTimeSelect = (timeSlot: any, availabilityData: any) => {
        setSelectedTime(timeSlot);
        setAvailability(availabilityData);
        setCurrentStep('confirmation');
    };

    const handleBackToProfessional = () => {
        setCurrentStep('professional');
        setSelectedTime(null);
        setAvailability(null);
    };

    const handleBackToTime = () => {
        setCurrentStep('time');
    };

    return (
        <BookingLayout>
            <div className="min-h-screen p-4">
                <div className="mx-auto max-w-6xl">
                    {/* Header */}
                    <div className="mb-6 flex items-center">
                        <Button variant="ghost" onClick={onBack} className="mr-4 hover:bg-background">
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

                    {/* Steps Indicator */}
                    <Card className="mb-8 bg-card">
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                {steps.map((step, index) => {
                                    const Icon = step.icon;
                                    const isActive = currentStep === step.id;
                                    const isCompleted = step.completed;

                                    return (
                                        <React.Fragment key={step.id}>
                                            <div className="flex flex-col items-center">
                                                <div
                                                    className={`mb-2 flex h-12 w-12 items-center justify-center rounded-full transition-all ${
                                                        isActive
                                                            ? 'bg-primary text-primary-foreground'
                                                            : isCompleted
                                                              ? 'bg-green-500 text-white'
                                                              : 'bg-secondary text-secondary-foreground'
                                                    } `}
                                                >
                                                    <Icon className="h-5 w-5" />
                                                </div>
                                                <span
                                                    className={`text-sm font-medium ${
                                                        isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-500'
                                                    }`}
                                                >
                                                    {step.title}
                                                </span>
                                            </div>
                                            {index < steps.length - 1 && (
                                                <div
                                                    className={`mx-4 h-0.5 flex-1 transition-all ${isCompleted ? 'bg-green-500' : 'bg-secondary'} `}
                                                />
                                            )}
                                        </React.Fragment>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Step Content */}
                    {currentStep === 'professional' && (
                        <ProfessionalSelection service={service} onProfessionalSelect={handleProfessionalSelect} hideHeader={true} />
                    )}

                    {currentStep === 'time' && selectedProfessional && (
                        <TimeSelection
                            service={service}
                            professional={selectedProfessional}
                            selectedDate={selectedDate}
                            onTimeSelect={handleTimeSelect}
                            onBack={handleBackToProfessional}
                            hideHeader={true}
                        />
                    )}

                    {currentStep === 'confirmation' && selectedProfessional && selectedTime && (
                        <BookingConfirmation
                            service={service}
                            professional={selectedProfessional}
                            selectedDate={selectedDate}
                            selectedTime={selectedTime}
                            availability={availability}
                            onBack={handleBackToTime}
                            hideHeader={true}
                        />
                    )}
                </div>
            </div>
        </BookingLayout>
    );
}
