import { CreatePlan } from '@/components/plans/create-plan';
import { EditPlan } from '@/components/plans/edit-plan';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { DialogConfirm } from '@/components/ui/dialog-confirm';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { CheckIcon, SparklesIcon, TrashIcon } from 'lucide-react';
import { PlanResource } from '../../interfaces/plan';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Planes',
        href: '/plans',
    },
];

export default function PlansIndex({ plans }: { plans: PlanResource[] }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Planes" />

            <div className="px-4">
                <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
                    {plans?.map((plan) => (
                        <Card key={plan.id} className="flex flex-col gap-4">
                            <CardContent className="flex flex-1 flex-col gap-2">
                                <div className="flex items-center justify-between gap-2">
                                    <h4 className="font-bold">{plan.name}</h4>
                                    {plan.is_popular && (
                                        <Badge variant="outline">
                                            <SparklesIcon className="size-4" />
                                            Popular
                                        </Badge>
                                    )}
                                </div>
                                <p className="text-sm text-muted-foreground">{plan.description}</p>
                                {plan.is_free ? (
                                    <p className="text-lg font-bold text-green-600 dark:text-green-400">Gratis</p>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <p className="text-sm">{plan.currency}</p>
                                        <p className="text-lg font-bold">
                                            {plan.price_monthly}
                                            <span className="text-sm">/mes</span>
                                        </p>
                                    </div>
                                )}

                                <div className="flex-1 text-sm">
                                    {plan.features.map((feature) => (
                                        <p key={feature} className="flex items-center gap-2 text-sm">
                                            <CheckIcon className="size-4 text-green-500 dark:text-green-400" />
                                            {feature}
                                        </p>
                                    ))}
                                </div>
                            </CardContent>
                            <CardFooter className="grid grid-cols-2 gap-4">
                                <EditPlan plan={plan} />

                                <DialogConfirm
                                    variant="destructive"
                                    title="Eliminar plan"
                                    description="¿Estás seguro de querer eliminar este plan?"
                                    onConfirm={() => {}}
                                    onCancel={() => {}}
                                >
                                    <Button variant="outline">
                                        <TrashIcon className="size-4" />
                                        Eliminar
                                    </Button>
                                </DialogConfirm>
                            </CardFooter>
                        </Card>
                    ))}
                    {plans?.length !== 0 && (
                        <Card className="flex flex-col items-center justify-center gap-4 border-none shadow-none">
                            <CreatePlan />
                        </Card>
                    )}
                </div>
                {plans?.length === 0 && (
                    <div className="flex h-full w-full flex-col items-center justify-center gap-4 rounded-lg p-4">
                        <p className="text-center">No hay planes disponibles</p>
                        <p className="text-center text-sm">Los planes son la forma en que tus usuarios pueden acceder a tus servicios.</p>
                        <CreatePlan />
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
