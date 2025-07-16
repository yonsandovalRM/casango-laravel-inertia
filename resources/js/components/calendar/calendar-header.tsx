import { CalendarView } from '@/interfaces/calendar';
import { ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import React from 'react';
import { Button } from '../ui/button';

interface CalendarHeaderProps {
    currentDate: Date;
    view: CalendarView;
    showFilters: boolean;
    filteredBookingsCount: number;
    onNavigate: (direction: 'prev' | 'next', view: CalendarView) => void;
    onViewChange: (view: CalendarView) => void;
    onResetToToday: () => void;
    onToggleFilters: () => void;
}

export const CalendarHeader: React.FC<CalendarHeaderProps> = ({
    currentDate,
    view,
    showFilters,
    filteredBookingsCount,
    onNavigate,
    onViewChange,
    onResetToToday,
    onToggleFilters,
}) => {
    const formatHeaderDate = () => {
        if (view === 'week') {
            return currentDate.toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
            });
        } else if (view === 'day') {
            return currentDate.toLocaleDateString('es-ES', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            });
        }
        return '';
    };

    return (
        <div className="border-b border-border bg-card p-4">
            <div className="flex flex-col items-center justify-between space-y-4 md:space-y-0 lg:flex-row">
                <div className="flex items-center space-x-4">
                    <Button variant="ghost" onClick={() => onNavigate('prev', view)}>
                        <ChevronLeft size={20} />
                    </Button>
                    <Button variant="ghost" onClick={() => onNavigate('next', view)}>
                        <ChevronRight size={20} />
                    </Button>
                    <Button
                        variant="ghost"
                        onClick={onResetToToday}
                        className="rounded-lg px-3 py-2 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20"
                    >
                        Hoy
                    </Button>
                    <Button
                        variant="ghost"
                        onClick={onToggleFilters}
                        className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                            showFilters
                                ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400'
                                : 'text-muted-foreground hover:bg-gray-100 dark:hover:bg-blue-900/20'
                        }`}
                    >
                        <Filter size={16} />
                        Filtros
                    </Button>
                </div>

                <h1 className="text-xl font-semibold text-foreground">{formatHeaderDate()}</h1>

                <div className="flex items-center space-x-2">
                    <div className="text-sm text-muted-foreground">
                        {filteredBookingsCount} cita{filteredBookingsCount !== 1 ? 's' : ''}
                    </div>
                    <div className="flex items-center space-x-2">
                        <Button
                            variant="ghost"
                            onClick={() => onViewChange('week')}
                            className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                                view === 'week' ? 'bg-blue-600 text-white' : 'text-muted-foreground hover:bg-gray-100 dark:hover:bg-blue-900/20'
                            }`}
                        >
                            Semana
                        </Button>
                        <Button
                            variant="ghost"
                            onClick={() => onViewChange('day')}
                            className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                                view === 'day' ? 'bg-blue-600 text-white' : 'text-muted-foreground hover:bg-gray-100 dark:hover:bg-blue-900/20'
                            }`}
                        >
                            Día
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};
