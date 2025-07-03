import { Check } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

export function PricingSection() {
    return (
        <section id="pricing" className="bg-background px-6 py-24">
            <div className="container mx-auto">
                <div className="mb-16 text-center">
                    <h2 className="mb-6 font-outfit text-4xl font-bold text-foreground">Precios simples y transparentes</h2>
                    <p className="text-xl text-muted-foreground">Elige el plan que mejor se adapte a tu negocio</p>
                </div>

                <div className="grid gap-8 md:grid-cols-3">
                    <Card className="border-0 bg-accent shadow-lg">
                        <CardHeader className="pb-8 text-center">
                            <CardTitle className="font-outfit text-lg font-medium text-foreground">Básico</CardTitle>
                            <div className="mt-4">
                                <span className="text-4xl font-bold text-foreground">$29</span>
                                <span className="text-muted-foreground">/mes</span>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center space-x-3">
                                <Check className="h-5 w-5 text-green-500" />
                                <span className="text-muted-foreground">Hasta 500 citas/mes</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <Check className="h-5 w-5 text-green-500" />
                                <span className="text-muted-foreground">1 profesional</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <Check className="h-5 w-5 text-green-500" />
                                <span className="text-muted-foreground">Recordatorios email</span>
                            </div>
                            <Button className="mt-8 w-full" variant="outline">
                                Comenzar prueba
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="scale-105 border-0 bg-primary text-white shadow-xl">
                        <CardHeader className="pb-8 text-center">
                            <Badge className="mx-auto mb-4 bg-white text-blue-600">Más popular</Badge>
                            <CardTitle className="font-outfit text-lg font-medium">Profesional</CardTitle>
                            <div className="mt-4">
                                <span className="text-4xl font-bold">$79</span>
                                <span className="text-blue-200">/mes</span>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center space-x-3">
                                <Check className="h-5 w-5 text-white" />
                                <span>Citas ilimitadas</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <Check className="h-5 w-5 text-white" />
                                <span>Hasta 5 profesionales</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <Check className="h-5 w-5 text-white" />
                                <span>WhatsApp + Email</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <Check className="h-5 w-5 text-white" />
                                <span>Videollamadas</span>
                            </div>
                            <Button className="mt-8 w-full bg-white text-blue-600 hover:bg-gray-100">Comenzar prueba</Button>
                        </CardContent>
                    </Card>

                    <Card className="border-0 bg-accent shadow-lg">
                        <CardHeader className="pb-8 text-center">
                            <CardTitle className="font-outfit text-lg font-medium text-foreground">Enterprise</CardTitle>
                            <div className="mt-4">
                                <span className="text-4xl font-bold text-foreground">$199</span>
                                <span className="text-muted-foreground">/mes</span>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center space-x-3">
                                <Check className="h-5 w-5 text-green-500" />
                                <span className="text-muted-foreground dark:text-gray-300">Todo ilimitado</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <Check className="h-5 w-5 text-green-500" />
                                <span className="text-muted-foreground dark:text-gray-300">Soporte prioritario</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <Check className="h-5 w-5 text-green-500" />
                                <span className="text-muted-foreground dark:text-gray-300">Personalización completa</span>
                            </div>
                            <Button variant="outline" className="mt-8 w-full">
                                Contactar ventas
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>
    );
}
