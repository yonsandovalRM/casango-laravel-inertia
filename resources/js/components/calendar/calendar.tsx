import { EventClickArg, EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import { useEffect, useRef, useState } from 'react';

interface CalendarProps {
    events: EventInput[];
    onEventClick?: (event: EventClickArg) => void;
    onDateClick?: (date: DateClickArg) => void;
}

export default function Calendar({ events, onEventClick, onDateClick }: CalendarProps) {
    const calendarRef = useRef<FullCalendar>(null);
    const [calendarApi, setCalendarApi] = useState<any>(null);

    useEffect(() => {
        if (calendarRef.current) {
            setCalendarApi(calendarRef.current.getApi());
        }
    }, []);

    return (
        <div className="p-4">
            <FullCalendar
                ref={calendarRef}
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView="timeGridWeek"
                headerToolbar={{
                    left: 'prev,next today',
                    center: 'title',
                    right: 'dayGridMonth,timeGridWeek,timeGridDay',
                }}
                height="auto"
                events={events}
                eventClick={onEventClick}
                dateClick={onDateClick}
                displayEventTime={false}
                displayEventEnd={false}
                slotMinTime="08:00:00"
                slotMaxTime="20:00:00"
                locale="es"
                nowIndicator={true}
                editable={false}
                selectable={true}
                eventTimeFormat={{
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true,
                }}
                buttonText={{
                    today: 'Hoy',
                    month: 'Mes',
                    week: 'Semana',
                    day: 'Día',
                }}
            />
        </div>
    );
}
