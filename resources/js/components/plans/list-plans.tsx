import { PERMISSIONS, usePermissions } from '@/hooks/use-permissions';
import { PlanResource } from '@/interfaces/plan';
import { router } from '@inertiajs/react';
import { CheckIcon, SparklesIcon, TrashIcon } from 'lucide-react';
import { withTranslation } from 'react-i18next';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card, CardContent, CardFooter } from '../ui/card';
import { DialogConfirm } from '../ui/dialog-confirm';
import { EmptyState } from '../ui/empty-state';
import CreatePlan from './create-plan';
import EditPlan from './edit-plan';

export default withTranslation()(ListPlans);
function ListPlans({ plans, t }: { plans: PlanResource[]; t: any }) {
    const { hasPermission } = usePermissions();

    const handleDelete = (id: string) => {
        router.delete(route('plans.destroy', id));
    };
    return (
        <>
            {plans?.length === 0 && hasPermission(PERMISSIONS.plans.create) && (
                <EmptyState text={t('plans.list.list_empty.title')} action={<CreatePlan />} />
            )}

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
                {plans?.map((plan) => (
                    <Card key={plan.id} className="flex flex-col gap-6">
                        <CardContent className="mb-4 flex flex-1 flex-col gap-2">
                            <div className="flex items-center justify-between gap-2">
                                <h4 className="text-lg font-bold">{plan.name}</h4>
                                {plan.is_popular && (
                                    <Badge variant="outline">
                                        <SparklesIcon className="size-4" />
                                        {t('plans.list.card.popular')}
                                    </Badge>
                                )}
                            </div>
                            <p className="text-sm text-muted-foreground">{plan.description}</p>
                            {plan.is_free ? (
                                <p className="text-md font-bold text-green-600 dark:text-green-400">{t('plans.list.card.free')}</p>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <p className="text-sm">{plan.currency}</p>
                                    <p className="text-md font-bold">
                                        {plan.price_monthly}
                                        <span className="text-sm">/{t('plans.list.card.monthly')}</span>
                                    </p>
                                </div>
                            )}
                            <p className="text-sm text-muted-foreground">
                                {plan.trial_days} {t('plans.list.card.trial_days')}
                            </p>

                            <div className="flex-1 text-sm">
                                {plan.features.map((feature) => (
                                    <p key={feature} className="flex items-center gap-2 text-sm">
                                        <CheckIcon className="size-4 text-green-500 dark:text-green-400" />
                                        {feature}
                                    </p>
                                ))}
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-end gap-2">
                            {hasPermission(PERMISSIONS.plans.edit) && <EditPlan plan={plan} />}
                            {hasPermission(PERMISSIONS.plans.delete) && (
                                <DialogConfirm
                                    variant="destructive"
                                    title={t('plans.list.dialog.title')}
                                    description={t('plans.list.dialog.description')}
                                    onConfirm={() => handleDelete(plan.id)}
                                    onCancel={() => {}}
                                >
                                    <Button variant="soft-destructive">
                                        <TrashIcon className="size-4" />
                                        {t('plans.list.dialog.action')}
                                    </Button>
                                </DialogConfirm>
                            )}
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </>
    );
}
