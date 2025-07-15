import { RescheduleModal } from '@/components/bookings/reschedule-modal';
import EventCard from '@/components/calendar/event-card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { BookingResource } from '@/interfaces/booking';
import { ProfessionalResource } from '@/interfaces/professional';
import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import {
    AlertCircle,
    Calendar,
    CheckCircle,
    ChevronLeft,
    ChevronRight,
    Clock,
    Filter,
    MapPin,
    Phone,
    Plus,
    Search,
    User,
    XCircle,
} from 'lucide-react';
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface BookingsIndexProps {
    professional: ProfessionalResource;
    bookings: BookingResource[];
}

// Interfaces para el calendario
interface BookingEvent {
    id: string;
    title: string;
    clientName: string;
    clientPhone?: string;
    serviceName: string;
    start: Date;
    end: Date;
    status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'no_show' | 'rescheduled';
    notes?: string;
    price: number;
    duration: number;
    bookingData: BookingResource;
}

// Configuración de colores por estado
const statusColors = {
    pending: { bg: '#fbbf24', text: '#92400e', border: '#f59e0b' },
    confirmed: { bg: '#10b981', text: '#065f46', border: '#059669' },
    cancelled: { bg: '#ef4444', text: '#991b1b', border: '#dc2626' },
    completed: { bg: '#6b7280', text: '#374151', border: '#4b5563' },
    no_show: { bg: '#f97316', text: '#9a3412', border: '#ea580c' },
    rescheduled: { bg: '#8b5cf6', text: '#5b21b6', border: '#7c3aed' },
};

const statusLabels = {
    pending: 'Pendiente',
    confirmed: 'Confirmada',
    cancelled: 'Cancelada',
    completed: 'Completada',
    no_show: 'No asistió',
    rescheduled: 'Reagendada',
};

// Componente del calendario profesional
const ProfessionalCalendar: React.FC<{
    bookings: BookingEvent[];
    onEventClick?: (booking: BookingEvent) => void;
    onCreateBooking?: (date: Date, hour: number) => void;
}> = ({ bookings, onEventClick, onCreateBooking }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [view, setView] = useState<'week' | 'day' | 'month'>('week');
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({
        status: 'all',
        search: '',
    });

    // Horas de trabajo (8 AM a 8 PM)
    const workingHours = useMemo(() => {
        const hours = [];
        for (let i = 8; i <= 20; i++) {
            hours.push(i);
        }
        return hours;
    }, []);

    // Filtrar eventos
    const filteredBookings = useMemo(() => {
        return bookings.filter((booking) => {
            const matchesStatus = filters.status === 'all' || booking.status === filters.status;
            const matchesSearch =
                filters.search === '' ||
                booking.clientName.toLowerCase().includes(filters.search.toLowerCase()) ||
                booking.serviceName.toLowerCase().includes(filters.search.toLowerCase());

            return matchesStatus && matchesSearch;
        });
    }, [bookings, filters]);

    // Obtener días de la semana
    const getWeekDays = (date: Date) => {
        const start = new Date(date);
        const day = start.getDay();
        const diff = start.getDate() - day + (day === 0 ? -6 : 1);
        start.setDate(diff);

        const days = [];
        for (let i = 0; i < 7; i++) {
            const currentDay = new Date(start);
            currentDay.setDate(start.getDate() + i);
            days.push(currentDay);
        }
        return days;
    };

    // Formatear hora
    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
        });
    };

    // Calcular posición del evento
    const getEventPosition = (booking: BookingEvent) => {
        const startMinutes = booking.start.getHours() * 60 + booking.start.getMinutes();
        const endMinutes = booking.end.getHours() * 60 + booking.end.getMinutes();
        const duration = endMinutes - startMinutes;

        const relativeStart = startMinutes - 8 * 60; // 8:00 AM = 0
        const top = Math.max(0, (relativeStart / 60) * 80); // 80px por hora
        const height = Math.max(30, (duration / 60) * 80); // Altura mínima 30px

        return { top, height };
    };

    // Filtrar eventos por día
    const getBookingsForDay = (date: Date) => {
        return filteredBookings.filter((booking) => {
            const bookingDate = new Date(booking.start);
            return bookingDate.toDateString() === date.toDateString();
        });
    };

    // Navegación
    const navigate = (direction: 'prev' | 'next') => {
        const newDate = new Date(currentDate);
        if (view === 'week') {
            newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
        } else if (view === 'day') {
            newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1));
        }
        setCurrentDate(newDate);
    };

    // Vista de semana
    const renderWeekView = () => {
        const weekDays = getWeekDays(currentDate);

        return (
            <div className="flex h-full flex-col">
                {/* Encabezado de días */}
                <div className="sticky top-0 z-20 grid grid-cols-8 border-b border-gray-200 bg-gray-50">
                    <div className="border-r border-gray-200 p-4 text-sm font-medium text-gray-500">
                        <Clock size={16} className="mx-auto" />
                    </div>
                    {weekDays.map((day, index) => {
                        const isToday = day.toDateString() === new Date().toDateString();
                        const dayBookings = getBookingsForDay(day);

                        return (
                            <div key={index} className="relative border-r border-gray-200 p-3 text-center">
                                <div className="text-sm font-medium text-gray-600">{day.toLocaleDateString('es-ES', { weekday: 'short' })}</div>
                                <div
                                    className={`text-xl font-bold ${
                                        isToday
                                            ? 'mx-auto flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600'
                                            : 'text-gray-800'
                                    }`}
                                >
                                    {day.getDate()}
                                </div>
                                {dayBookings.length > 0 && (
                                    <div className="mt-1 text-xs font-medium text-blue-600">
                                        {dayBookings.length} cita{dayBookings.length !== 1 ? 's' : ''}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Contenido de la semana */}
                <div className="flex-1 overflow-y-auto">
                    <div className="grid min-h-full grid-cols-8">
                        {/* Columna de horas */}
                        <div className="border-r border-gray-200 bg-gray-50">
                            {workingHours.map((hour) => (
                                <div key={hour} className="flex h-20 items-start justify-center border-b border-gray-100 pt-2">
                                    <span className="text-sm font-medium text-gray-600">{hour.toString().padStart(2, '0')}:00</span>
                                </div>
                            ))}
                        </div>

                        {/* Columnas de días */}
                        {weekDays.map((day, dayIndex) => (
                            <div key={dayIndex} className="relative border-r border-gray-200">
                                {workingHours.map((hour) => (
                                    <div
                                        key={hour}
                                        className="group relative h-20 cursor-pointer border-b border-gray-100 transition-colors hover:bg-blue-50"
                                        onClick={() => onCreateBooking?.(day, hour)}
                                    >
                                        {/* Línea de media hora */}
                                        <div className="absolute top-1/2 left-0 h-px w-full bg-gray-100"></div>

                                        {/* Botón para agregar cita */}
                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
                                            <Plus size={16} className="text-blue-500" />
                                        </div>
                                    </div>
                                ))}

                                {/* Eventos del día */}
                                {getBookingsForDay(day).map((booking) => {
                                    const { top, height } = getEventPosition(booking);
                                    const colors = statusColors[booking.status];

                                    return (
                                        <div
                                            key={booking.id}
                                            className="absolute right-1 left-1 z-10 cursor-pointer overflow-hidden rounded-lg shadow-sm transition-all hover:scale-105 hover:shadow-md"
                                            style={{
                                                top: `${top}px`,
                                                height: `${height}px`,
                                                backgroundColor: colors.bg,
                                                borderLeft: `4px solid ${colors.border}`,
                                            }}
                                            onClick={() => onEventClick?.(booking)}
                                        >
                                            <div className="h-full overflow-hidden p-2">
                                                <div className="text-sm leading-tight font-semibold text-white">
                                                    {formatTime(booking.start)} - {formatTime(booking.end)}
                                                </div>
                                                <div className="mt-1 truncate text-xs font-medium text-white">{booking.serviceName}</div>
                                                <div className="truncate text-xs text-white opacity-90">
                                                    <User size={10} className="mr-1 inline" />
                                                    {booking.clientName}
                                                </div>
                                                {booking.clientPhone && (
                                                    <div className="mt-1 truncate text-xs text-white opacity-80">
                                                        <Phone size={10} className="mr-1 inline" />
                                                        {booking.clientPhone}
                                                    </div>
                                                )}

                                                {/* Indicador de estado */}
                                                <div className="absolute top-1 right-1">
                                                    <div className="h-2 w-2 rounded-full" style={{ backgroundColor: colors.border }} />
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    };

    // Panel de filtros
    const renderFilters = () => {
        if (!showFilters) return null;

        return (
            <div className="border-b border-gray-200 bg-gray-50 p-4">
                <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-2">
                        <Search size={16} className="text-gray-500" />
                        <input
                            type="text"
                            placeholder="Buscar cliente o servicio..."
                            value={filters.search}
                            onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
                            className="rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <Filter size={16} className="text-gray-500" />
                        <select
                            value={filters.status}
                            onChange={(e) => setFilters((prev) => ({ ...prev, status: e.target.value }))}
                            className="rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="all">Todos los estados</option>
                            <option value="pending">Pendientes</option>
                            <option value="confirmed">Confirmadas</option>
                            <option value="cancelled">Canceladas</option>
                            <option value="completed">Completadas</option>
                            <option value="no_show">No asistió</option>
                            <option value="rescheduled">Reagendadas</option>
                        </select>
                    </div>

                    <button onClick={() => setFilters({ status: 'all', search: '' })} className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800">
                        Limpiar filtros
                    </button>
                </div>
            </div>
        );
    };

    return (
        <div className="flex h-full flex-col overflow-hidden rounded-lg bg-white shadow-lg">
            {/* Barra de herramientas */}
            <div className="border-b border-gray-200 bg-white p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <button onClick={() => navigate('prev')} className="rounded-lg p-2 transition-colors hover:bg-gray-100">
                            <ChevronLeft size={20} />
                        </button>
                        <button onClick={() => navigate('next')} className="rounded-lg p-2 transition-colors hover:bg-gray-100">
                            <ChevronRight size={20} />
                        </button>
                        <button
                            onClick={() => setCurrentDate(new Date())}
                            className="rounded-lg px-3 py-2 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-50"
                        >
                            Hoy
                        </button>
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                                showFilters ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
                            }`}
                        >
                            <Filter size={16} />
                            Filtros
                        </button>
                    </div>

                    <h1 className="text-xl font-semibold text-gray-900">
                        {currentDate.toLocaleDateString('es-ES', {
                            year: 'numeric',
                            month: 'long',
                        })}
                    </h1>

                    <div className="flex items-center space-x-2">
                        <div className="text-sm text-gray-600">
                            {filteredBookings.length} cita{filteredBookings.length !== 1 ? 's' : ''}
                        </div>
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={() => setView('week')}
                                className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                                    view === 'week' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'
                                }`}
                            >
                                Semana
                            </button>
                            <button
                                onClick={() => setView('day')}
                                className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                                    view === 'day' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'
                                }`}
                            >
                                Día
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Panel de filtros */}
            {renderFilters()}

            {/* Contenido del calendario */}
            <div className="flex-1 overflow-hidden">{renderWeekView()}</div>
        </div>
    );
};

export default function BookingsIndex({ professional, bookings }: BookingsIndexProps) {
    const { t } = useTranslation();
    const [selectedBooking, setSelectedBooking] = useState<BookingEvent | null>(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [openRescheduleModal, setOpenRescheduleModal] = useState(false);

    // Función para calcular la hora de finalización
    const calculateEndTime = (date: string, startTime: string, durationMinutes: number): Date => {
        const [hours, minutes] = startTime.split(':').map(Number);
        const startDate = new Date(date);
        startDate.setHours(hours, minutes);

        const endDate = new Date(startDate.getTime() + durationMinutes * 60000);
        return endDate;
    };

    // Transformar los bookings a eventos para el calendario
    const calendarEvents: BookingEvent[] = useMemo(() => {
        return bookings.map((booking) => ({
            id: booking.id,
            title: booking.service.name,
            clientName: booking.client.name,
            clientPhone: booking.phone,
            serviceName: booking.service.name,
            start: new Date(`${booking.date}T${booking.time}`),
            end: calculateEndTime(booking.date, booking.time, booking.service.duration),
            status: booking.status as any,
            notes: booking.notes,
            price: booking.total,
            duration: booking.service.duration,
            bookingData: booking,
        }));
    }, [bookings]);

    const handleEventClick = (event: BookingEvent) => {
        setSelectedBooking(event);
        setOpenDialog(true);
    };

    const handleCreateBooking = (date: Date, hour: number) => {
        console.log('Crear nueva cita:', date, hour);
        // Aquí puedes implementar la navegación a la creación de citas
        // router.visit('/create-booking', {
        //   data: { date: date.toISOString().split('T')[0], time: `${hour}:00` }
        // });
    };

    const handleGoToBooking = () => {
        if (selectedBooking) {
            router.visit(route('bookings.show', { booking: selectedBooking.id }), {
                preserveState: true,
                preserveScroll: true,
            });
        }
    };

    const handleConfirmBooking = () => {
        if (selectedBooking) {
            router.post(
                route('bookings.confirm', { booking: selectedBooking.id }),
                {},
                {
                    preserveState: true,
                    onSuccess: () => {
                        setOpenDialog(false);
                    },
                    onError: (errors) => {
                        console.error('Error al confirmar:', errors);
                    },
                },
            );
        }
    };

    const handleCancelBooking = () => {
        if (selectedBooking) {
            router.post(
                route('bookings.cancel', { booking: selectedBooking.id }),
                {},
                {
                    preserveState: true,
                    onSuccess: () => {
                        setOpenDialog(false);
                    },
                    onError: (errors) => {
                        console.error('Error al cancelar:', errors);
                    },
                },
            );
        }
    };

    const handleCompleteBooking = () => {
        if (selectedBooking) {
            router.post(
                route('bookings.complete', { booking: selectedBooking.id }),
                {},
                {
                    preserveState: true,
                    onSuccess: () => {
                        setOpenDialog(false);
                    },
                    onError: (errors) => {
                        console.error('Error al completar:', errors);
                    },
                },
            );
        }
    };

    const handleNoShowBooking = () => {
        if (selectedBooking) {
            router.post(
                route('bookings.no-show', { booking: selectedBooking.id }),
                {},
                {
                    preserveState: true,
                    onSuccess: () => {
                        setOpenDialog(false);
                    },
                    onError: (errors) => {
                        console.error('Error al marcar no show:', errors);
                    },
                },
            );
        }
    };

    const handleOpenReschedule = () => {
        setOpenDialog(false);
        setOpenRescheduleModal(true);
    };

    const handleRescheduleSuccess = () => {
        setOpenRescheduleModal(false);
        // Recargar la página para mostrar los cambios
        router.reload();
    };

    // Renderizar botones de acción según el estado
    const renderActionButtons = () => {
        if (!selectedBooking) return null;

        const status = selectedBooking.status;

        return (
            <div className="flex flex-wrap gap-2">
                {/* Botón Ver Detalles - siempre disponible */}
                <Button onClick={handleGoToBooking}>
                    <MapPin className="mr-2 h-4 w-4" />
                    Ver Detalles
                </Button>

                {/* Botones según el estado */}
                {status === 'pending' && (
                    <>
                        <Button onClick={handleConfirmBooking} className="bg-green-600 hover:bg-green-700">
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Confirmar
                        </Button>
                        <Button onClick={handleOpenReschedule} variant="outline">
                            <Calendar className="mr-2 h-4 w-4" />
                            Reagendar
                        </Button>
                        <Button onClick={handleCancelBooking} variant="outline" className="border-red-600 text-red-600 hover:bg-red-50">
                            <XCircle className="mr-2 h-4 w-4" />
                            Cancelar
                        </Button>
                    </>
                )}

                {status === 'confirmed' && (
                    <>
                        <Button onClick={handleCompleteBooking} className="bg-blue-600 hover:bg-blue-700">
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Completar
                        </Button>
                        <Button onClick={handleNoShowBooking} variant="outline" className="border-orange-600 text-orange-600 hover:bg-orange-50">
                            <AlertCircle className="mr-2 h-4 w-4" />
                            No Asistió
                        </Button>
                        <Button onClick={handleOpenReschedule} variant="outline">
                            <Calendar className="mr-2 h-4 w-4" />
                            Reagendar
                        </Button>
                        <Button onClick={handleCancelBooking} variant="outline" className="border-red-600 text-red-600 hover:bg-red-50">
                            <XCircle className="mr-2 h-4 w-4" />
                            Cancelar
                        </Button>
                    </>
                )}

                {status === 'cancelled' && <div className="text-sm text-gray-500 italic">Esta cita ha sido cancelada</div>}

                {status === 'completed' && (
                    <div className="flex items-center text-sm text-green-600 italic">
                        <CheckCircle className="mr-1 h-4 w-4" />
                        Cita completada
                    </div>
                )}

                {status === 'no_show' && (
                    <div className="flex items-center text-sm text-orange-600 italic">
                        <AlertCircle className="mr-1 h-4 w-4" />
                        Cliente no asistió
                    </div>
                )}

                {status === 'rescheduled' && (
                    <div className="flex items-center text-sm text-purple-600 italic">
                        <Calendar className="mr-1 h-4 w-4" />
                        Cita reagendada
                    </div>
                )}
            </div>
        );
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Dashboard', href: route('dashboard') },
                { title: t('bookings.index.title'), href: route('bookings.index') },
            ]}
        >
            <Head title={t('bookings.index.title')} />

            <div className="p-6">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Mi Agenda</h1>
                    <p className="text-gray-600">Gestiona tus citas y reservas</p>
                </div>

                <div className="h-[700px]">
                    <ProfessionalCalendar bookings={calendarEvents} onEventClick={handleEventClick} onCreateBooking={handleCreateBooking} />
                </div>
            </div>

            {/* Dialog para mostrar detalles del evento */}
            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Calendar className="h-5 w-5" />
                            Detalles de la Cita
                            {selectedBooking && (
                                <span
                                    className="ml-2 rounded-full px-2 py-1 text-xs font-medium text-white"
                                    style={{ backgroundColor: statusColors[selectedBooking.status].bg }}
                                >
                                    {statusLabels[selectedBooking.status]}
                                </span>
                            )}
                        </DialogTitle>
                    </DialogHeader>

                    {selectedBooking && <EventCard booking={selectedBooking.bookingData} />}

                    <DialogFooter>{renderActionButtons()}</DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Modal de reagendamiento */}
            <RescheduleModal
                open={openRescheduleModal}
                onOpenChange={setOpenRescheduleModal}
                booking={selectedBooking?.bookingData || null}
                onSuccess={handleRescheduleSuccess}
            />
        </AppLayout>
    );
}
