import { PlanResource } from '@/interfaces/plan';
import { cn, formatCurrency } from '@/lib/utils';
import { router } from '@inertiajs/react';
import { Check } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

export function PricingSection({ plans }: { plans: PlanResource[] }) {
    return (
        <section id="pricing" className="bg-background px-6 py-24">
            <div className="container mx-auto">
                <div className="mb-16 text-center">
                    <h2 className="mb-6 font-outfit text-4xl font-bold text-foreground">Precios simples y transparentes</h2>
                    <p className="text-xl text-muted-foreground">Elige el plan que mejor se adapte a tu negocio</p>
                </div>

                <div className="grid gap-8 md:grid-cols-3">
                    {plans.map((plan) => (
                        <Card key={plan.id} className={cn('border-0 shadow-lg', plan.is_popular ? 'scale-105 bg-primary text-white' : 'bg-accent')}>
                            <CardHeader className="pb-8 text-center">
                                {plan.is_popular && <Badge className="mx-auto mb-4 bg-white text-blue-600">Más popular</Badge>}
                                <CardTitle className="font-outfit text-lg font-medium text-foreground">{plan.name}</CardTitle>
                                <div className="mt-4">
                                    <span className="text-4xl font-bold text-foreground">
                                        {plan.currency === 'CLP' ? '$' : '€'}
                                        {formatCurrency(plan.price_monthly)}
                                    </span>
                                    <span className={cn(plan.is_popular ? 'text-blue-200' : 'text-muted-foreground')}>/mes</span>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {plan.features.map((feature) => (
                                    <div key={feature} className="flex items-center space-x-3">
                                        <Check className={cn('h-5 w-5', plan.is_popular ? 'text-blue-200' : 'text-green-500')} />
                                        <span className={cn(plan.is_popular ? 'text-blue-200' : 'text-muted-foreground')}>{feature}</span>
                                    </div>
                                ))}
                                <Button
                                    className="mt-8 w-full"
                                    variant="outline"
                                    onClick={() => router.visit(route('tenants.create', { plan_id: plan.id }))}
                                >
                                    {plan.is_free ? 'Comenzar prueba' : 'Comenzar'}
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}
