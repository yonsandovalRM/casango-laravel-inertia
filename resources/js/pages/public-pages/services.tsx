import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useServices } from '@/hooks/use-services';
import { CompanyResource } from '@/interfaces/company';
import BookingLayout from '@/layouts/booking-layout';
import { Head, router } from '@inertiajs/react';
import { Calendar, Clock, Filter, Search, User } from 'lucide-react';
import { useState } from 'react';

const Services = ({ company }: { company: CompanyResource }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [sortBy, setSortBy] = useState('price');

    const { categories, filteredServices } = useServices(searchTerm, selectedCategory, sortBy);

    const handleServiceSelect = (service: any) => {
        router.visit(route('home.bookings.service', service.id));
    };

    return (
        <BookingLayout>
            <Head title="Reserva tu Cita Profesional" />

            <div className="min-h-screen p-4 pt-24">
                <div className="mx-auto max-w-6xl">
                    {/* Header */}
                    <div className="mb-8 text-center">
                        <h1 className="mb-2 font-outfit text-5xl font-bold text-foreground">Encuentra el servicio que necesitas</h1>
                        <p className="text-lg text-muted-foreground">Encuentra y reserva servicios con los mejores profesionales</p>
                    </div>

                    {/* Search and Filters */}
                    <div className="mb-8 rounded-2xl bg-card p-6 shadow-lg">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                            {/* Search */}
                            <div className="relative">
                                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                                <Input
                                    placeholder="Buscar servicio o profesional..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>

                            {/* Category Filter */}
                            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                                <SelectTrigger>
                                    <Filter className="mr-2 h-4 w-4" />
                                    <SelectValue placeholder="Categoría" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todas las categorías</SelectItem>
                                    {categories.map((category) => (
                                        <SelectItem key={category} value={category}>
                                            {category}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            {/* Sort */}
                            <Select value={sortBy} onValueChange={setSortBy}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Ordenar por" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="price">Precio (menor a mayor)</SelectItem>
                                    <SelectItem value="price_desc">Precio (mayor a menor)</SelectItem>
                                    <SelectItem value="duration">Duración (menor a mayor)</SelectItem>
                                    <SelectItem value="name">Nombre (A-Z)</SelectItem>
                                </SelectContent>
                            </Select>

                            {/* Results count */}
                            <div className="flex items-center justify-center text-sm text-gray-600">
                                {filteredServices.length} servicios encontrados
                            </div>
                        </div>
                    </div>

                    {/* Services Grid */}
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {filteredServices.map((service) => (
                            <Card
                                key={service.id}
                                className="group cursor-pointer transition-all duration-300 hover:shadow-xl"
                                onClick={() => handleServiceSelect(service)}
                            >
                                <CardHeader className="pb-4">
                                    <div className="mb-2 flex items-start justify-between">
                                        <Badge variant="secondary" className="text-xs">
                                            {service.category.name}
                                        </Badge>
                                        <div className="text-right">
                                            <div className="text-2xl font-bold text-primary">${Number(service.price).toLocaleString()}</div>
                                            <div className="text-sm text-muted-foreground">{company.currency}</div>
                                        </div>
                                    </div>
                                    <CardTitle className="transition-colors group-hover:text-primary">{service.name}</CardTitle>
                                    <CardDescription className="line-clamp-2">{service.description}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="mb-4 flex items-center justify-between">
                                        <div className="flex items-center text-sm text-muted-foreground">
                                            <Clock className="mr-1 h-4 w-4" />
                                            {service.duration} min
                                        </div>
                                        <div className="flex items-center text-sm text-muted-foreground">
                                            <User className="mr-1 h-4 w-4" />
                                            {service.professionals_count}
                                        </div>
                                    </div>

                                    <Button
                                        className="w-full"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleServiceSelect(service);
                                        }}
                                    >
                                        <Calendar className="mr-2 h-4 w-4" />
                                        Reservar Cita
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {filteredServices.length === 0 && (
                        <div className="py-12 text-center">
                            <div className="mb-4 text-muted-foreground">
                                <Search className="mx-auto h-16 w-16" />
                            </div>
                            <h3 className="mb-2 text-xl font-semibold text-muted-foreground">No se encontraron servicios</h3>
                            <p className="text-muted-foreground">Intenta con otros términos de búsqueda o filtros</p>
                        </div>
                    )}
                </div>
            </div>
        </BookingLayout>
    );
};

export default Services;
