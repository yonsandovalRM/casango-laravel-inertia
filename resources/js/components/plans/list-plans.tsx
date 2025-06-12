import { PERMISSIONS, usePermissions } from '@/hooks/use-permissions';
import { PlanResource } from '@/interfaces/plan';
import { router } from '@inertiajs/react';
import { CheckIcon, SparklesIcon, TrashIcon } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card, CardContent, CardFooter } from '../ui/card';
import { DialogConfirm } from '../ui/dialog-confirm';
import { ListEmpty } from '../ui/list-empty';
import { CreatePlan } from './create-plan';
import { EditPlan } from './edit-plan';

export const ListPlans = ({ plans }: { plans: PlanResource[] }) => {
    const { hasPermission } = usePermissions();

    const handleDelete = (id: string) => {
        router.delete(route('plans.destroy', id));
    };
    return (
        <>
            {plans?.length === 0 && hasPermission(PERMISSIONS.plans.create) && (
                <ListEmpty
                    title="No hay planes disponibles"
                    description="Los planes son la forma en que tus usuarios pueden acceder a tus servicios."
                    action={<CreatePlan />}
                />
            )}

            <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
                {plans?.map((plan) => (
                    <Card key={plan.id} className="flex flex-col gap-4">
                        <CardContent className="mb-4 flex flex-1 flex-col gap-2">
                            <div className="flex items-center justify-between gap-2">
                                <h4 className="text-lg font-bold">{plan.name}</h4>
                                {plan.is_popular && (
                                    <Badge variant="outline">
                                        <SparklesIcon className="size-4" />
                                        Popular
                                    </Badge>
                                )}
                            </div>
                            <p className="text-sm text-muted-foreground">{plan.description}</p>
                            {plan.is_free ? (
                                <p className="text-md font-bold text-green-600 dark:text-green-400">Gratis</p>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <p className="text-sm">{plan.currency}</p>
                                    <p className="text-md font-bold">
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
                            {hasPermission(PERMISSIONS.plans.edit) && <EditPlan plan={plan} />}
                            {hasPermission(PERMISSIONS.plans.delete) && (
                                <DialogConfirm
                                    variant="destructive"
                                    title="Eliminar plan"
                                    description="¿Estás seguro de querer eliminar este plan?"
                                    onConfirm={() => handleDelete(plan.id)}
                                    onCancel={() => {}}
                                >
                                    <Button variant="outline">
                                        <TrashIcon className="size-4" />
                                        Eliminar
                                    </Button>
                                </DialogConfirm>
                            )}
                        </CardFooter>
                    </Card>
                ))}
                {plans?.length !== 0 && hasPermission(PERMISSIONS.plans.create) && (
                    <Card className="flex flex-col items-center justify-center gap-4 border-none shadow-none">
                        <CreatePlan />
                    </Card>
                )}
            </div>
        </>
    );
};
