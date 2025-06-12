import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSessionMessages } from '@/hooks/use-session-messages';
import { PlanResource } from '@/interfaces/plan';
import { useForm } from '@inertiajs/react';

export default function TenantsCreate({ plans }: { plans: PlanResource[] }) {
    const { error, message, success } = useSessionMessages();
    const { data, setData, post, errors, processing } = useForm({
        name: 'alberto',
        subdomain: 'alberto',
        owner_name: 'alberto',
        owner_email: 'alberto@alberto.com',
        owner_password: '12345678',
        owner_password_confirmation: '12345678',
        plan_id: 'b68e79e8-d6a1-4fd1-8e9f-5b81f1cdb4a4',
        category: 'restaurant',
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post(route('tenants.store'));
    };

    return (
        <div>
            {error && <div className="text-red-500">{error}</div>}
            {message && <div className="text-green-500">{message}</div>}
            {success && <div className="text-green-500">{success}</div>}
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
                        <Label htmlFor="subdomain" required>
                            Subdominio
                        </Label>
                        <Input
                            id="subdomain"
                            type="text"
                            name="subdomain"
                            value={data.subdomain}
                            onChange={(e) => setData('subdomain', e.target.value)}
                        />
                        <InputError message={errors.subdomain} />
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
