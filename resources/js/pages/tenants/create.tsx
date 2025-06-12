import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlanResource } from '@/interfaces/plan';
import { useForm } from '@inertiajs/react';

export default function TenantsCreate({ plans }: { plans: PlanResource[] }) {
    const { data, setData, post, errors, processing } = useForm({
        name: 'alberto',
        domain: 'alberto',
        owner_name: 'alberto',
        owner_email: 'alberto@alberto.com',
        owner_password: '12345678',
        owner_password_confirmation: '12345678',
        plan_id: '1',
        category: 'restaurant',
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post(route('tenants.store'));
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="name" required>
                            Nombre
                        </Label>
                        <Input id="name" type="text" name="name" value={data.name} onChange={(e) => setData('name', e.target.value)} />
                        <InputError message={errors.name} />
                    </div>
                    <div>
                        <Label htmlFor="domain" required>
                            Dominio
                        </Label>
                        <Input id="domain" type="text" name="domain" value={data.domain} onChange={(e) => setData('domain', e.target.value)} />
                        <InputError message={errors.domain} />
                    </div>
                    <div>
                        <Label htmlFor="owner_name" required>
                            Nombre del propietario
                        </Label>
                        <Input
                            id="owner_name"
                            type="text"
                            name="owner_name"
                            value={data.owner_name}
                            onChange={(e) => setData('owner_name', e.target.value)}
                        />
                        <InputError message={errors.owner_name} />
                    </div>
                    <div>
                        <Label htmlFor="owner_email" required>
                            Email del propietario
                        </Label>
                        <Input
                            id="owner_email"
                            type="email"
                            name="owner_email"
                            value={data.owner_email}
                            onChange={(e) => setData('owner_email', e.target.value)}
                        />
                        <InputError message={errors.owner_email} />
                    </div>
                    <div>
                        <Label htmlFor="owner_password" required>
                            Contraseña del propietario
                        </Label>
                        <Input
                            type="password"
                            id="owner_password"
                            name="owner_password"
                            placeholder="Contraseña"
                            value={data.owner_password}
                            onChange={(e) => setData('owner_password', e.target.value)}
                            required
                        />
                        <InputError message={errors.owner_password} />
                    </div>
                    <div>
                        <Label htmlFor="owner_password_confirmation" required>
                            Confirmar contraseña
                        </Label>
                        <Input
                            id="owner_password_confirmation"
                            type="password"
                            name="owner_password_confirmation"
                            placeholder="Confirmar contraseña"
                            value={data.owner_password_confirmation}
                            onChange={(e) => setData('owner_password_confirmation', e.target.value)}
                            required
                        />
                        <InputError message={errors.owner_password_confirmation} />
                    </div>
                    <div>
                        <Label htmlFor="plan_id" required>
                            Plan
                        </Label>
                        <Select name="plan_id" value={data.plan_id} onValueChange={(value) => setData('plan_id', value)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecciona un plan" />
                            </SelectTrigger>
                            <SelectContent>
                                {plans.map((plan) => (
                                    <SelectItem key={plan.id} value={plan.id}>
                                        {plan.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <InputError message={errors.plan_id} />
                    </div>
                    <div>
                        <Label htmlFor="category" required>
                            Categoría
                        </Label>
                        <Select name="category" value={data.category} onValueChange={(value) => setData('category', value)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecciona una categoría" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="restaurant">Restaurante</SelectItem>
                                <SelectItem value="bar">Bar</SelectItem>
                                <SelectItem value="hotel">Hotel</SelectItem>
                                <SelectItem value="other">Otro</SelectItem>
                            </SelectContent>
                        </Select>
                        <InputError message={errors.category} />
                    </div>
                    <div className="col-span-2 flex justify-end">
                        <Button type="submit" disabled={processing}>
                            Crear
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    );
}
