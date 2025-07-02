import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';

import { BookingResource } from '@/interfaces/booking';

export default function FiltersBookings({ bookings }: { bookings: BookingResource[] }) {
    return (
        <Card>
            <CardContent className="p-4">
                <div className="grid grid-cols-1 items-center gap-4 lg:grid-cols-4">
                    <div className="relative flex items-center">
                        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
                        <Input placeholder="Buscar por servicio, profesional o cliente..." className="pl-10" />
                    </div>

                    <Select>
                        <SelectTrigger>
                            <SelectValue placeholder="Estado" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todos los estados</SelectItem>
                            <SelectItem value="confirmed">Confirmada</SelectItem>
                            <SelectItem value="pending">Pendiente</SelectItem>
                            <SelectItem value="cancelled">Cancelada</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select>
                        <SelectTrigger>
                            <SelectValue placeholder="Servicio" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todos los servicios</SelectItem>
                        </SelectContent>
                    </Select>

                    <div className="flex items-center text-sm text-muted-foreground">{bookings.length} reservas</div>
                </div>
            </CardContent>
        </Card>
    );
}
