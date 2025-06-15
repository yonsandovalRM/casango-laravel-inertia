import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlanResource } from '@/interfaces/plan';
import { MOCK_CATEGORIES } from '@/interfaces/tenant';
import { Head, useForm } from '@inertiajs/react';
import { ShieldCheck } from 'lucide-react';

export default function TenantsCreate({ plans }: { plans: PlanResource[] }) {
    const { data, setData, post, errors, processing } = useForm({
        name: 'Fast',
        subdomain: 'fast',
        owner_name: 'Fast',
        owner_email: 'fast@fast.com',
        owner_password: '12345678',
        owner_password_confirmation: '12345678',
        plan_id: 'f1792f79-a96e-4dde-9cea-68c86eae4e0b',
        category: 'bar',
    });

    const handleChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
        setData('name', e.target.value);
        setData('subdomain', e.target.value.toLowerCase().replace(/[^a-z0-9]/g, ''));
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post(route('tenants.store'));
    };

    return (
        <div className="container mx-auto px-4 py-16">
            <Head title="Crear negocio" />
            <form onSubmit={handleSubmit}>
                <div>
                    <h1 className="text-2xl font-bold">Onboarding de empresa</h1>
                    <p className="text-sm text-muted-foreground">
                        Completa los siguientes campos para registrar tu negocio y comenzar a utilizar la plataforma.
                    </p>
                </div>
                <div className="mt-8 flex flex-col gap-16 md:flex-row">
                    <div className="w-full space-y-4 md:w-3/5">
                        <h2 className="text-sm font-medium">Información del negocio</h2>
                        <p className="text-xs text-muted-foreground">
                            Estos datos serán utilizados para identificar tu negocio y crear un espacio personalizado para ti.
                        </p>
                        <div>
                            <Label htmlFor="name" required>
                                Nombre
                            </Label>
                            <Input id="name" type="text" name="name" value={data.name} onChange={handleChangeName} />
                            <InputError message={errors.name} />
                        </div>
                        <div>
                            <Label htmlFor="subdomain" required>
                                Subdominio
                            </Label>
                            <div className="relative">
                                <Input
                                    id="subdomain"
                                    type="text"
                                    name="subdomain"
                                    value={data.subdomain}
                                    onChange={(e) => setData('subdomain', e.target.value)}
                                    className="pr-[105px]"
                                />
                                <span className="absolute top-1/2 right-3 -translate-y-1/2 transform text-sm text-muted-foreground">
                                    .casango.com
                                </span>
                            </div>
                            <InputError message={errors.subdomain} />
                        </div>
                        <div>
                            <Label htmlFor="category" required>
                                Categoría o rubro
                            </Label>
                            <Select name="category" value={data.category} onValueChange={(value) => setData('category', value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecciona una categoría" />
                                </SelectTrigger>
                                <SelectContent>
                                    {MOCK_CATEGORIES.map((category) => (
                                        <SelectItem key={category.id} value={category.id}>
                                            {category.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <InputError message={errors.category} />
                        </div>
                        <div>
                            <Label htmlFor="plan_id" required>
                                Selecciona un plan
                            </Label>
                            <RadioGroup
                                defaultValue="starter"
                                className="grid gap-3 md:grid-cols-2"
                                value={data.plan_id}
                                onValueChange={(value) => setData('plan_id', value)}
                            >
                                {plans.map((plan) => (
                                    <Label
                                        className="flex items-start gap-3 rounded-lg border p-3 has-[[data-state=checked]]:border-ring has-[[data-state=checked]]:bg-input/20"
                                        key={plan.id}
                                    >
                                        <RadioGroupItem value={plan.id} id={plan.name} className="data-[state=checked]:border-primary" />
                                        <div className="grid gap-1 font-normal">
                                            <div className="font-medium">{plan.name}</div>
                                            <div className="text-xs leading-snug text-balance text-muted-foreground">{plan.description}</div>
                                            <div className="text-xs leading-snug text-balance text-muted-foreground">
                                                {plan.price_monthly}
                                                <span className="text-xs leading-snug text-balance text-muted-foreground">{plan.currency}</span>
                                            </div>
                                        </div>
                                    </Label>
                                ))}
                            </RadioGroup>
                        </div>
                    </div>
                    <div className="w-full md:w-2/5">
                        <Card>
                            <CardHeader>
                                <CardTitle>Información de acceso</CardTitle>
                                <CardDescription>Estos datos serán utilizados para acceder a la plataforma y recibir notificaciones.</CardDescription>
                            </CardHeader>
                            <CardContent className="mb-4 space-y-4">
                                <div>
                                    <Label htmlFor="owner_name" required>
                                        Nombre
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
                                        Correo electrónico
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
                                        Contraseña
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
                            </CardContent>
                            <CardFooter className="flex justify-end">
                                <Button type="submit" disabled={processing} className="w-full">
                                    <ShieldCheck className="mr-2 h-4 w-4" />
                                    Crear empresa
                                </Button>
                            </CardFooter>
                        </Card>
                    </div>
                </div>
            </form>
        </div>
    );
}
