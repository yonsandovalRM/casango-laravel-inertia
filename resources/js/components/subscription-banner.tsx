import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';
import { AlertTriangle, Clock, CreditCard, X } from 'lucide-react';
import React from 'react';

interface SubscriptionBannerProps {
    subscription: any;
}

export function SubscriptionBanner({ subscription }: SubscriptionBannerProps) {
    const [dismissed, setDismissed] = React.useState(false);

    if (!subscription || dismissed) return null;

    // Banner para período de prueba próximo a expirar
    if (subscription.on_trial && subscription.days_until_expiry <= 3) {
        return (
            <Alert className="mb-4 border-blue-200 bg-blue-50">
                <Clock className="h-4 w-4 text-blue-600" />
                <AlertDescription className="flex items-center justify-between">
                    <span>Tu período de prueba expira en {subscription.days_until_expiry} días. Suscríbete para continuar sin interrupciones.</span>
                    <div className="ml-4 flex items-center gap-2">
                        <Button size="sm" asChild>
                            <Link href={route('tenant.subscription.index')}>Suscribirse</Link>
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => setDismissed(true)}>
                            <X className="h-3 w-3" />
                        </Button>
                    </div>
                </AlertDescription>
            </Alert>
        );
    }

    // Banner para período de gracia
    if (subscription.on_grace_period) {
        return (
            <Alert className="mb-4 border-orange-200 bg-orange-50">
                <AlertTriangle className="h-4 w-4 text-orange-600" />
                <AlertDescription className="flex items-center justify-between">
                    <span>
                        <strong>Acción requerida:</strong> Tu cuenta está en período de gracia. Tienes {subscription.days_until_expiry} días para
                        actualizar tu método de pago.
                    </span>
                    <div className="ml-4 flex items-center gap-2">
                        <Button size="sm" variant="destructive" asChild>
                            <Link href={route('tenant.subscription.index')}>
                                <CreditCard className="mr-1 h-3 w-3" />
                                Actualizar Pago
                            </Link>
                        </Button>
                    </div>
                </AlertDescription>
            </Alert>
        );
    }

    // Banner para suscripción que requiere pago
    if (subscription.needs_payment) {
        return (
            <Alert className="mb-4 border-red-200 bg-red-50">
                <CreditCard className="h-4 w-4 text-red-600" />
                <AlertDescription className="flex items-center justify-between">
                    <span>
                        <strong>Suscripción suspendida:</strong> Tu acceso está limitado. Actualiza tu método de pago para reactivar tu cuenta.
                    </span>
                    <Button size="sm" variant="destructive" asChild>
                        <Link href={route('tenant.subscription.index')}>Reactivar Cuenta</Link>
                    </Button>
                </AlertDescription>
            </Alert>
        );
    }

    return null;
}
