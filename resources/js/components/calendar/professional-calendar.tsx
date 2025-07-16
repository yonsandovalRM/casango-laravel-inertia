// components/calendar/professional-calendar.tsx
import { useCalendarLogic } from '@/hooks/use-calendar-logic';
import { BookingEvent, CalendarView, CalendarFilters as FilterType } from '@/interfaces/calendar';
import React, { useState } from 'react';
import { CalendarDayView } from './calendar-day-view';
import { CalendarFilters } from './calendar-filters';
import { CalendarHeader } from './calendar-header';
import { CalendarWeekView } from './calendar-week-view';

interface ProfessionalCalendarProps {
    bookings: BookingEvent[];
    onEventClick?: (booking: BookingEvent) => void;
    onCreateBooking?: (date: Date, hour: number) => void;
    workingHours?: { start: number; end: number };
    className?: string;
}

export const ProfessionalCalendar: React.FC<ProfessionalCalendarProps> = ({
    bookings,
    onEventClick,
    onCreateBooking,
    workingHours = { start: 8, end: 20 },
    className = '',
}) => {
    const [view, setView] = useState<CalendarView>('week');
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState<FilterType>({
        status: 'all',
        search: '',
    });

    const { currentDate, filteredBookings, workingHoursArray, navigate, resetToToday, getWeekDays, getBookingsForDay, formatTime, getEventPosition } =
        useCalendarLogic(bookings, filters, workingHours);

    const handleFiltersChange = (newFilters: FilterType) => {
        setFilters(newFilters);
    };

    const renderCalendarView = () => {
        switch (view) {
            case 'week':
                return (
                    <CalendarWeekView
                        currentDate={currentDate}
                        workingHours={workingHoursArray}
                        getWeekDays={getWeekDays}
                        getBookingsForDay={getBookingsForDay}
                        formatTime={formatTime}
                        getEventPosition={getEventPosition}
                        onEventClick={onEventClick}
                        onCreateBooking={onCreateBooking}
                    />
                );
            case 'day':
                return (
                    <CalendarDayView
                        currentDate={currentDate}
                        workingHours={workingHoursArray}
                        getBookingsForDay={getBookingsForDay}
                        formatTime={formatTime}
                        getEventPosition={getEventPosition}
                        onEventClick={onEventClick}
                        onCreateBooking={onCreateBooking}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <div className={`flex h-full flex-col overflow-hidden rounded-lg bg-white shadow-lg ${className}`}>
            <CalendarHeader
                currentDate={currentDate}
                view={view}
                showFilters={showFilters}
                filteredBookingsCount={filteredBookings.length}
                onNavigate={navigate}
                onViewChange={setView}
                onResetToToday={resetToToday}
                onToggleFilters={() => setShowFilters(!showFilters)}
            />

            <CalendarFilters show={showFilters} filters={filters} onFiltersChange={handleFiltersChange} />

            <div className="flex-1 overflow-hidden">{renderCalendarView()}</div>
        </div>
    );
};
