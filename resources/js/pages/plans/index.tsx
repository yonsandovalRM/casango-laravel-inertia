import { CreatePlan } from '@/components/plans/create-plan';
import { EditPlan } from '@/components/plans/edit-plan';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { DialogConfirm } from '@/components/ui/dialog-confirm';
import AppLayout from '@/layouts/app-layout';
import { CheckIcon, SparklesIcon, TrashIcon } from 'lucide-react';
import { PlanResource } from '../interfaces/plan';

export default function PlansIndex({ plans }: { plans: PlanResource[] }) {
    return (
        <AppLayout>
            <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
                {plans?.map((plan) => (
                    <Card key={plan.id} className="flex flex-col gap-4">
                        <div className="flex items-center justify-between gap-2">
                            <h4 className="font-bold text-gray-800 dark:text-white">{plan.name}</h4>
                            {plan.is_popular && (
                                <p className="flex items-center gap-2 rounded-full bg-yellow-50 px-2 py-1 text-sm text-yellow-500 dark:bg-yellow-900/20 dark:text-yellow-400">
                                    <SparklesIcon className="size-4" />
                                    Popular
                                </p>
                            )}
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{plan.description}</p>
                        {plan.is_free ? (
                            <p className="text-sm text-green-500 dark:text-green-400">Grátis</p>
                        ) : (
                            <div className="flex items-center gap-2">
                                <p className="text-sm text-gray-500 dark:text-gray-400">{plan.currency}</p>
                                <p className="text-lg font-bold text-gray-800 dark:text-gray-200">
                                    {plan.price_monthly}
                                    <span className="text-sm text-gray-500 dark:text-gray-400">/mes</span>
                                </p>
                            </div>
                        )}

                        <div className="flex-1 text-sm text-gray-500 dark:text-gray-400">
                            {plan.features.map((feature) => (
                                <p key={feature} className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                    <CheckIcon className="size-4 text-green-500 dark:text-green-400" />
                                    {feature}
                                </p>
                            ))}
                        </div>
                        <div className="grid grid-cols-2 gap-4">
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
                        </div>
                    </Card>
                ))}
                {plans?.length !== 0 && (
                    <Card className="flex flex-col items-center justify-center gap-4 border-none shadow-none">
                        <CreatePlan />
                    </Card>
                )}
            </div>
            {plans?.length === 0 && (
                <div className="flex h-full w-full flex-col items-center justify-center gap-4 rounded-lg border border-gray-200 p-4 dark:border-gray-800">
                    <p className="text-center text-gray-500 dark:text-gray-400">No hay planes disponibles</p>
                    <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                        Los planes son la forma en que tus usuarios pueden acceder a tus servicios.
                    </p>
                    <CreatePlan />
                </div>
            )}
        </AppLayout>
    );
}
