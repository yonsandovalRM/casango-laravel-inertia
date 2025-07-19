import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { RadioGroupItem } from '@/components/ui/radio-group';
import { PlanResource } from '@/interfaces/plan';
import { formatCurrency } from '@/lib/utils';
import { Check } from 'lucide-react';

interface PlanCardProps {
    plan: PlanResource;
    isSelected: boolean;
    billing: string;
}

export function PlanCard({ plan, isSelected, billing }: PlanCardProps) {
    return (
        <Label
            className={`relative flex cursor-pointer flex-col rounded-xl border-2 p-6 transition-all duration-200 hover:shadow-lg ${
                isSelected ? 'border-violet-500 shadow-lg' : 'border-border bg-accent hover:border-violet-500'
            } `}
        >
            <RadioGroupItem value={plan.id} className="absolute top-4 right-4" />

            {plan.is_popular && <Badge className="absolute -top-2 left-1/2 -translate-x-1/2 bg-blue-700 text-white">Más popular</Badge>}

            <div className="flex-1">
                <h3 className="mb-2 text-lg font-semibold text-foreground">{plan.name}</h3>
                <p className="mb-4 min-h-[40px] text-sm text-muted-foreground">{plan.description}</p>

                <div className="mb-6">
                    <span className="text-3xl font-bold text-foreground">
                        ${formatCurrency(billing === 'monthly' ? plan.price_monthly : plan.price_annual, plan.currency)}
                    </span>
                    <span className="ml-1 text-sm text-muted-foreground">{plan.currency}</span>
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-muted-foreground">{billing === 'monthly' ? 'Mensual' : 'Anual'}</span>
                    </div>
                </div>

                <ul className="space-y-2">
                    {plan.features.map((feature: string, index: number) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                            <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-600" />
                            <span className="text-muted-foreground">{feature}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </Label>
    );
}
