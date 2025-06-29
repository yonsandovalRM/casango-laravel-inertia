import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface WeeklyDatePickerProps {
    selectedDate: string;
    onDateSelect: (date: string) => void;
}

export const WeeklyDatePicker: React.FC<WeeklyDatePickerProps> = ({ selectedDate, onDateSelect }) => {
    const [currentWeekStart, setCurrentWeekStart] = useState<Date>(new Date());

    // Inicializar la semana actual al montar el componente
    useEffect(() => {
        const today = new Date();
        const dayOfWeek = today.getDay();
        const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // Ajustar para que lunes sea el primer día
        const monday = new Date(today);
        monday.setDate(today.getDate() + mondayOffset);
        setCurrentWeekStart(monday);
    }, []);

    const getWeekDays = (startDate: Date): Date[] => {
        const days: Date[] = [];
        for (let i = 0; i < 7; i++) {
            const day = new Date(startDate);
            day.setDate(startDate.getDate() + i);
            days.push(day);
        }
        return days;
    };

    const formatDay = (date: Date): string => {
        return date.toLocaleDateString('es-ES', {
            weekday: 'long',
        });
    };

    const formatDayNumber = (date: Date): string => {
        return date.getDate().toString();
    };

    const formatMonth = (date: Date): string => {
        return date.toLocaleDateString('es-ES', {
            month: 'short',
        });
    };

    const isToday = (date: Date): boolean => {
        const today = new Date();
        return date.toDateString() === today.toDateString();
    };

    const isPast = (date: Date): boolean => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const compareDate = new Date(date);
        compareDate.setHours(0, 0, 0, 0);
        return compareDate < today;
    };

    const isSelected = (date: Date): boolean => {
        return date.toISOString().split('T')[0] === selectedDate;
    };

    const handlePreviousWeek = () => {
        const newWeekStart = new Date(currentWeekStart);
        newWeekStart.setDate(currentWeekStart.getDate() - 7);
        setCurrentWeekStart(newWeekStart);
    };

    const handleNextWeek = () => {
        const newWeekStart = new Date(currentWeekStart);
        newWeekStart.setDate(currentWeekStart.getDate() + 7);
        setCurrentWeekStart(newWeekStart);
    };

    const handleDateClick = (date: Date) => {
        if (!isPast(date)) {
            onDateSelect(date.toISOString().split('T')[0]);
        }
    };

    const weekDays = getWeekDays(currentWeekStart);
    const currentMonth = currentWeekStart.toLocaleDateString('es-ES', {
        month: 'long',
        year: 'numeric',
    });

    return (
        <Card className="bg-card">
            <CardContent className="p-6">
                {/* Header con mes/año y navegación */}
                <div className="mb-6 flex items-center justify-between">
                    <Button variant="ghost" size="sm" onClick={handlePreviousWeek} className="hover:bg-accent">
                        <ChevronLeft className="h-4 w-4" />
                    </Button>

                    <h3 className="text-lg font-semibold text-foreground capitalize">{currentMonth}</h3>

                    <Button variant="ghost" size="sm" onClick={handleNextWeek} className="hover:bg-accent">
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>

                {/* Días de la semana */}
                <div className="grid grid-cols-7 gap-2">
                    {weekDays.map((date, index) => {
                        const isDateToday = isToday(date);
                        const isDatePast = isPast(date);
                        const isDateSelected = isSelected(date);

                        return (
                            <div
                                key={index}
                                onClick={() => handleDateClick(date)}
                                className={`cursor-pointer rounded-lg border p-3 text-center transition-all duration-200 ${
                                    isDatePast
                                        ? 'cursor-not-allowed border-border bg-gray-100 text-muted-foreground dark:bg-accent dark:text-gray-400'
                                        : isDateSelected
                                          ? 'scale-105 border-primary bg-primary text-white shadow-lg'
                                          : isDateToday
                                            ? 'border-primary bg-primary/10 text-primary hover:bg-primary/20'
                                            : 'border-border bg-card text-foreground hover:border-primary hover:bg-primary/10'
                                } `}
                            >
                                <div className="mb-1 text-xs font-medium capitalize">{formatDay(date).substring(0, 3)}</div>
                                <div className="text-lg font-bold">{formatDayNumber(date)}</div>
                                <div className="text-xs opacity-75">{formatMonth(date)}</div>
                                {isDateToday && <div className="mt-1 text-xs font-medium">Hoy</div>}
                            </div>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
};
