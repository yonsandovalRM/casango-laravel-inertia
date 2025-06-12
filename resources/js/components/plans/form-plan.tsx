import InputError from '@/components/input-error';
import { PlusIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { SortableFeature } from './sortable-feature';

type FormPlanProps = {
    data: any;
    setData: (name: string, value: any) => void;
    errors: any;
};

export const FormPlan = ({ data, setData, errors }: FormPlanProps) => {
    const [tempFeature, setTempFeature] = useState('');

    useEffect(() => {
        if (data.features.length === 0) {
            setTempFeature('');
        }
    }, [data.features, setTempFeature]);

    const handleAddFeature = () => {
        if (tempFeature.trim() === '') return;
        setData('features', [...data.features, tempFeature]);
        setTempFeature('');
    };
    const handleReorderFeatures = (newFeatures: string[]) => {
        setData('features', newFeatures);
    };
    const handleRemoveFeature = (index: number) => {
        const newFeatures = data.features.filter((_: string, i: number) => i !== index);
        setData('features', newFeatures);
    };
    const handleKeyDownTempFeature = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddFeature();
        }
    };
    return (
        <div>
            <div className="grid flex-1 auto-rows-min gap-6 px-4">
                <div className="flex flex-col gap-4">
                    <div className="space-y-6 pb-4">
                        <div>
                            <Label htmlFor="name" required>
                                Nombre
                            </Label>
                            <Input id="name" name="name" value={data.name} onChange={(e) => setData('name', e.target.value)} placeholder="Nombre" />
                            <InputError message={errors.name} />
                        </div>
                        <div>
                            <Label htmlFor="description" required>
                                Descripción
                            </Label>
                            <Input
                                id="description"
                                name="description"
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                placeholder="Adecuado para..."
                            />
                            <InputError message={errors.description} />
                        </div>
                        <div>
                            <Label htmlFor="price_monthly" required>
                                Precio mensual
                            </Label>
                            <Input
                                id="price_monthly"
                                type="number"
                                name="price_monthly"
                                value={data.price_monthly}
                                onChange={(e) => setData('price_monthly', e.target.value)}
                            />
                            <InputError message={errors.price_monthly} />
                        </div>
                        <div>
                            <Label htmlFor="price_annual" required>
                                Precio anual
                            </Label>
                            <Input
                                id="price_annual"
                                type="number"
                                name="price_annual"
                                value={data.price_annual}
                                onChange={(e) => setData('price_annual', e.target.value)}
                            />
                            <InputError message={errors.price_annual} />
                        </div>
                        <div>
                            <Label htmlFor="currency" required>
                                Moneda
                            </Label>
                            <Input id="currency" name="currency" value={data.currency} onChange={(e) => setData('currency', e.target.value)} />
                            <InputError message={errors.currency} />
                        </div>
                    </div>
                    <div>
                        <Label htmlFor="trial_days" required>
                            Días de prueba
                        </Label>
                        <Input id="trial_days" name="trial_days" value={data.trial_days} onChange={(e) => setData('trial_days', e.target.value)} />
                        <InputError message={errors.trial_days} />
                    </div>
                    <div>
                        <div>
                            <Label htmlFor="features" required>
                                Características
                            </Label>
                            <div className="space-y-2">
                                <div className="grid grid-cols-3 gap-2">
                                    <div className="col-span-2">
                                        <Input
                                            id="features"
                                            name="features"
                                            type="text"
                                            value={tempFeature}
                                            onChange={(e) => setTempFeature(e.target.value)}
                                            onKeyDown={handleKeyDownTempFeature}
                                            placeholder="Característica..."
                                        />
                                    </div>
                                    <Button type="button" variant="outline" onClick={handleAddFeature}>
                                        <PlusIcon className="size-4" />
                                        Agregar
                                    </Button>
                                </div>
                                <InputError message={errors.features} />
                                <SortableFeature
                                    features={data.features}
                                    handleReorderFeatures={handleReorderFeatures}
                                    handleRemoveFeature={handleRemoveFeature}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <Checkbox id="is_free" name="is_free" checked={data.is_free} onCheckedChange={(checked) => setData('is_free', checked)} />
                            <Label htmlFor="is_free">Es gratuito</Label>
                            <InputError message={errors.is_free} />
                        </div>
                        <div className="flex items-center gap-2">
                            <Checkbox
                                id="is_popular"
                                name="is_popular"
                                checked={data.is_popular}
                                onCheckedChange={(checked) => setData('is_popular', checked)}
                            />
                            <Label htmlFor="is_popular">Es popular</Label>
                            <InputError message={errors.is_popular} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
