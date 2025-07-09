import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { cn, formatCurrency } from '@/lib/utils';
import { router } from '@inertiajs/react';
import { Check } from 'lucide-react';
import { useState } from 'react';

// Mock interfaces for the example
interface PlanResource {
    id: string;
    name: string;
    price_monthly: number;
    price_annual: number;
    currency: string;
    is_free: boolean;
    is_popular: boolean;
    features: string[];
    trial_days: number;
    created_at: string;
    updated_at: string;
}

export function PricingSection({ plans }: { plans: PlanResource[] }) {
    const [isAnnual, setIsAnnual] = useState(false);

    const getPrice = (plan: PlanResource) => {
        return isAnnual ? plan.price_annual : plan.price_monthly;
    };

    const getPeriod = () => {
        return isAnnual ? '/año' : '/mes';
    };

    const getAnnualDiscount = (plan: PlanResource) => {
        if (plan.is_free) return 0;
        const monthlyYearly = plan.price_monthly * 12;
        const discount = ((monthlyYearly - plan.price_annual) / monthlyYearly) * 100;
        return Math.round(discount);
    };

    return (
        <section id="pricing" className="bg-background px-6 py-24 transition-colors duration-300 dark:bg-background">
            <div className="container mx-auto">
                <div className="mb-16 text-center">
                    <h2 className="mb-6 font-outfit text-4xl font-bold text-foreground dark:text-white">Precios simples y transparentes</h2>
                    <p className="mb-8 text-xl text-muted-foreground dark:text-gray-300">Elige el plan que mejor se adapte a tu negocio</p>

                    {/* Billing Toggle */}
                    <div className="mb-4 flex items-center justify-center gap-6">
                        <span
                            className={cn(
                                'text-sm font-medium transition-colors',
                                !isAnnual ? 'text-foreground dark:text-white' : 'text-muted-foreground dark:text-gray-400',
                            )}
                        >
                            Mensual
                        </span>
                        <div className="relative">
                            <Switch checked={isAnnual} onCheckedChange={setIsAnnual} className="data-[state=checked]:bg-primary" />
                        </div>
                        <span
                            className={cn(
                                'text-sm font-medium transition-colors',
                                isAnnual ? 'text-foreground dark:text-white' : 'text-muted-foreground dark:text-gray-400',
                            )}
                        >
                            Anual
                        </span>
                        {isAnnual && (
                            <Badge
                                variant="secondary"
                                className="ml-2 border-green-200 bg-green-100 text-green-800 dark:border-green-700 dark:bg-green-900 dark:text-green-200"
                            >
                                Ahorra hasta 25%
                            </Badge>
                        )}
                    </div>
                </div>

                <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-3">
                    {plans.map((plan) => {
                        const discount = getAnnualDiscount(plan);

                        return (
                            <Card
                                key={plan.id}
                                className={cn(
                                    'relative border-2 shadow-xl transition-all duration-300 hover:shadow-2xl',
                                    plan.is_popular
                                        ? 'border-primary bg-primary/5 ring-2 ring-primary/20 dark:bg-primary/10'
                                        : 'border-border bg-card dark:border-gray-700 dark:bg-card',
                                )}
                            >
                                {plan.is_popular && (
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 transform">
                                        <Badge className="bg-primary px-4 py-1 text-sm font-semibold text-primary-foreground shadow-lg">
                                            Más popular
                                        </Badge>
                                    </div>
                                )}

                                <CardHeader className="pt-8 pb-8 text-center">
                                    <CardTitle className="mb-2 font-outfit text-xl font-semibold text-foreground dark:text-white">
                                        {plan.name}
                                    </CardTitle>

                                    <div className="space-y-2">
                                        <div className="flex items-baseline justify-center gap-1">
                                            <span className="text-5xl font-bold text-foreground dark:text-white">
                                                {plan.currency === 'CLP' ? '$' : '€'}
                                                {formatCurrency(getPrice(plan))}
                                            </span>
                                            <span className="text-lg text-muted-foreground dark:text-gray-400">{getPeriod()}</span>
                                        </div>

                                        {isAnnual && !plan.is_free && discount > 0 && (
                                            <div className="space-y-1">
                                                <p className="text-sm text-muted-foreground line-through dark:text-gray-400">
                                                    {plan.currency === 'CLP' ? '$' : '€'}
                                                    {formatCurrency(plan.price_monthly * 12)}/año
                                                </p>
                                                <Badge
                                                    variant="outline"
                                                    className="border-green-600 text-green-600 dark:border-green-400 dark:text-green-400"
                                                >
                                                    Ahorra {discount}%
                                                </Badge>
                                            </div>
                                        )}
                                    </div>
                                </CardHeader>

                                <CardContent className="flex h-full flex-col space-y-6 pb-6">
                                    <div className="flex-1 space-y-4">
                                        {plan.features.map((feature, index) => (
                                            <div key={index} className="flex items-start space-x-3">
                                                <div className="mt-0.5 flex-shrink-0">
                                                    <Check className="h-5 w-5 text-green-600 dark:text-green-400" />
                                                </div>
                                                <span className="text-sm leading-relaxed text-foreground dark:text-gray-200">{feature}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="flex flex-col gap-2 pt-6">
                                        <Button
                                            className={cn(
                                                'w-full py-3 font-semibold transition-all duration-200',
                                                plan.is_popular
                                                    ? 'bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 hover:shadow-xl'
                                                    : 'border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground dark:border-primary dark:text-primary dark:hover:bg-primary dark:hover:text-primary-foreground',
                                            )}
                                            variant={plan.is_popular ? 'default' : 'outline'}
                                            onClick={() =>
                                                router.visit(route('tenants.create', { plan: plan.id, billing: isAnnual ? 'annual' : 'monthly' }))
                                            }
                                        >
                                            {plan.trial_days > 0
                                                ? `Comenzar prueba de ${plan.trial_days} días`
                                                : plan.is_free
                                                  ? 'Comenzar gratis'
                                                  : 'Comenzar ahora'}
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                <div className="mt-16 text-center">
                    <p className="mb-4 text-sm text-muted-foreground">¿Tienes preguntas sobre nuestros planes?</p>
                    <Button variant="ghost" className="text-primary hover:text-primary/80 dark:text-primary dark:hover:text-primary/80">
                        Contacta con nuestro equipo
                    </Button>
                    <p className="text-center text-xs text-muted-foreground">Sin compromiso • Cancela cuando quieras</p>
                </div>
            </div>
        </section>
    );
}
