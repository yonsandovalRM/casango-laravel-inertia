import { router } from '@inertiajs/react';
import { Button } from '../ui/button';

export function CTASection() {
    return (
        <section className="bg-background px-6 py-24">
            <div className="mx-auto max-w-3xl text-center">
                <h2 className="mb-6 font-outfit text-4xl font-bold text-foreground">¿Listo para simplificar tu agenda?</h2>
                <p className="mb-12 text-xl text-muted-foreground">Únete a miles de profesionales que ya optimizaron su gestión de citas</p>
                <div className="flex flex-col justify-center gap-4 sm:flex-row">
                    <Button
                        size="lg"
                        className="bg-blue-600 px-8 py-4 text-lg font-medium hover:bg-blue-700"
                        onClick={() => router.visit(route('tenants.create'))}
                    >
                        Comenzar gratis
                    </Button>
                    <Button variant="outline" size="lg" className="px-8 py-4 text-lg font-medium">
                        Solicitar demo
                    </Button>
                </div>
            </div>
        </section>
    );
}
