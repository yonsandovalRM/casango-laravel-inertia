import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { RadioGroupItem } from '@/components/ui/radio-group';
import { PlanResource } from '@/interfaces/plan';
import { cn, formatCurrency } from '@/lib/utils';
import { Check } from 'lucide-react';

interface PlanCardProps {
    plan: PlanResource;
    isSelected: boolean;
}

export function PlanCard({ plan, isSelected }: PlanCardProps) {
    return (
        <Label
            className={`relative flex cursor-pointer flex-col rounded-xl border-2 p-6 transition-all duration-200 hover:shadow-lg ${
                isSelected ? 'border-blue-500 bg-primary text-white shadow-lg' : 'border-border bg-accent hover:border-primary'
            } `}
        >
            <RadioGroupItem value={plan.id} className="absolute top-4 right-4" />

            {plan.is_popular && <Badge className="absolute -top-2 left-1/2 -translate-x-1/2 bg-blue-700 text-white">Más popular</Badge>}

            <div className="flex-1">
                <h3 className={cn('mb-2 text-lg font-semibold', isSelected ? 'text-white' : 'text-foreground')}>{plan.name}</h3>
                <p className={cn('mb-4 min-h-[40px] text-sm', isSelected ? 'text-white' : 'text-muted-foreground')}>{plan.description}</p>

                <div className="mb-6">
                    <span className={cn('text-3xl font-bold', isSelected ? 'text-white' : 'text-foreground')}>
                        ${formatCurrency(plan.price_monthly, plan.currency)}
                    </span>
                    <span className={cn('ml-1 text-sm', isSelected ? 'text-white' : 'text-muted-foreground')}>{plan.currency}</span>
                </div>

                <ul className="space-y-2">
                    {plan.features.map((feature: string, index: number) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                            <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
                            <span className={cn('text-muted-foreground', isSelected ? 'text-white' : 'text-muted-foreground')}>{feature}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </Label>
    );
}
