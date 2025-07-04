import { FormSection } from '@/components/tenants/create/form-section';
import { PlanCard } from '@/components/tenants/create/plan-card';
import { StepProgress } from '@/components/tenants/create/step-progress';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlanResource } from '@/interfaces/plan';
import { MOCK_CATEGORIES } from '@/interfaces/tenant';
import { useForm } from '@inertiajs/react';
import { Building2, Globe, Lock, Mail, ShieldCheck, Tag, User } from 'lucide-react';
import { useState } from 'react';

export default function TenantsCreate({ plans, plan }: { plans: PlanResource[]; plan: PlanResource }) {
    const [currentStep, setCurrentStep] = useState(1);
    const { data, setData, post, errors, processing } = useForm({
        name: 'Fast',
        subdomain: 'fast',
        owner_name: 'Fast',
        owner_email: 'fast@fast.com',
        owner_password: '12345678',
        owner_password_confirmation: '12345678',
        plan_id: plan?.id || plans.find((p) => p.is_popular)?.id,
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

    const steps = [
        { number: 1, title: 'Información del negocio', description: 'Datos básicos de tu empresa' },
        { number: 2, title: 'Plan y configuración', description: 'Selecciona tu plan ideal' },
        { number: 3, title: 'Cuenta de administrador', description: 'Crea tu cuenta de acceso' },
    ];

    return (
        <div className="min-h-screen">
            <div className="container mx-auto max-w-4xl px-4 py-12">
                {/* Header */}
                <div className="mb-12 text-center">
                    <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-950">
                        <Building2 className="h-8 w-8 text-blue-600" />
                    </div>
                    <h1 className="mb-4 font-outfit text-4xl font-bold text-foreground">Configura tu negocio</h1>
                    <p className="mx-auto max-w-2xl text-xl text-muted-foreground">
                        En solo unos minutos tendrás tu plataforma de citas lista para usar
                    </p>
                </div>

                {/* Progress Steps */}
                <StepProgress steps={steps} currentStep={currentStep} />

                <form onSubmit={handleSubmit} className="mt-12">
                    <div className="space-y-8">
                        {/* Step 1: Business Information */}
                        {currentStep === 1 && (
                            <FormSection
                                title="Información del negocio"
                                description="Cuéntanos sobre tu empresa para personalizar tu experiencia"
                                icon={<Building2 className="h-5 w-5" />}
                            >
                                <div className="grid gap-6 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="name" className="flex items-center gap-2 text-sm font-medium">
                                            <Building2 className="h-3 w-3" />
                                            Nombre del negocio
                                        </Label>
                                        <Input
                                            id="name"
                                            type="text"
                                            placeholder="Ej: Mi Restaurante"
                                            value={data.name}
                                            onChange={handleChangeName}
                                            className="h-12"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="category" className="flex items-center gap-2 text-sm font-medium">
                                            <Tag className="h-3 w-3" />
                                            Categoría del negocio
                                        </Label>
                                        <Select value={data.category} onValueChange={(value) => setData((prev) => ({ ...prev, category: value }))}>
                                            <SelectTrigger className="h-12">
                                                <SelectValue placeholder="Selecciona tu rubro" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {MOCK_CATEGORIES.map((category) => (
                                                    <SelectItem key={category.id} value={category.id}>
                                                        {category.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="subdomain" className="flex items-center gap-2 text-sm font-medium">
                                        <Globe className="h-3 w-3" />
                                        URL de tu plataforma
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            id="subdomain"
                                            type="text"
                                            placeholder="mi-negocio"
                                            value={data.subdomain}
                                            onChange={(e) => setData((prev) => ({ ...prev, subdomain: e.target.value }))}
                                            className="h-12 pr-28"
                                        />
                                        <span className="absolute top-1/2 right-3 -translate-y-1/2 rounded bg-accent px-2 py-1 text-sm text-muted-foreground">
                                            .micita.cl
                                        </span>
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        Esta será la dirección web donde tus clientes podrán agendar citas
                                    </p>
                                </div>

                                <div className="flex justify-end pt-4">
                                    <Button
                                        type="button"
                                        onClick={() => setCurrentStep(2)}
                                        className="h-12 px-8"
                                        disabled={!data.name || !data.category || !data.subdomain}
                                    >
                                        Continuar
                                    </Button>
                                </div>
                            </FormSection>
                        )}

                        {/* Step 2: Plan Selection */}
                        {currentStep === 2 && (
                            <FormSection
                                title="Selecciona tu plan"
                                description="Elige el plan que mejor se adapte a las necesidades de tu negocio"
                                icon={<ShieldCheck className="h-5 w-5" />}
                            >
                                <RadioGroup
                                    value={data.plan_id}
                                    onValueChange={(value) => setData((prev) => ({ ...prev, plan_id: value }))}
                                    className="grid gap-4 md:grid-cols-3"
                                >
                                    {plans.map((plan) => (
                                        <PlanCard key={plan.id} plan={plan} isSelected={data.plan_id === plan.id} />
                                    ))}
                                </RadioGroup>

                                <div className="flex justify-between pt-6">
                                    <Button type="button" variant="outline" onClick={() => setCurrentStep(1)} className="h-12 px-8">
                                        Anterior
                                    </Button>
                                    <Button type="button" onClick={() => setCurrentStep(3)} className="h-12 px-8">
                                        Continuar
                                    </Button>
                                </div>
                            </FormSection>
                        )}

                        {/* Step 3: Administrator Account */}
                        {currentStep === 3 && (
                            <FormSection
                                title="Crea tu cuenta de administrador"
                                description="Esta será tu cuenta principal para gestionar tu negocio"
                                icon={<User className="h-5 w-5" />}
                            >
                                <div className="grid gap-6 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="owner_name" className="flex items-center gap-2 text-sm font-medium">
                                            <User className="h-3 w-3" />
                                            Nombre completo
                                        </Label>
                                        <Input
                                            id="owner_name"
                                            type="text"
                                            placeholder="Tu nombre completo"
                                            value={data.owner_name}
                                            onChange={(e) => setData((prev) => ({ ...prev, owner_name: e.target.value }))}
                                            className="h-12"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="owner_email" className="flex items-center gap-2 text-sm font-medium">
                                            <Mail className="h-3 w-3" />
                                            Correo electrónico
                                        </Label>
                                        <Input
                                            id="owner_email"
                                            type="email"
                                            placeholder="tu@email.com"
                                            value={data.owner_email}
                                            onChange={(e) => setData((prev) => ({ ...prev, owner_email: e.target.value }))}
                                            className="h-12"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="owner_password" className="flex items-center gap-2 text-sm font-medium">
                                            <Lock className="h-3 w-3" />
                                            Contraseña
                                        </Label>
                                        <Input
                                            id="owner_password"
                                            type="password"
                                            placeholder="Mínimo 8 caracteres"
                                            value={data.owner_password}
                                            onChange={(e) => setData((prev) => ({ ...prev, owner_password: e.target.value }))}
                                            className="h-12"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="owner_password_confirmation" className="flex items-center gap-2 text-sm font-medium">
                                            <Lock className="h-3 w-3" />
                                            Confirmar contraseña
                                        </Label>
                                        <Input
                                            id="owner_password_confirmation"
                                            type="password"
                                            placeholder="Repite tu contraseña"
                                            value={data.owner_password_confirmation}
                                            onChange={(e) => setData((prev) => ({ ...prev, owner_password_confirmation: e.target.value }))}
                                            className="h-12"
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-between pt-6">
                                    <Button type="button" variant="outline" onClick={() => setCurrentStep(2)} className="h-12 px-8">
                                        Anterior
                                    </Button>
                                    <Button type="submit" disabled={processing} className="h-12 bg-blue-600 px-8 hover:bg-blue-700">
                                        {processing ? (
                                            <>
                                                <div className="mr-2 h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                                Creando...
                                            </>
                                        ) : (
                                            <>
                                                <ShieldCheck className="mr-2 h-3 w-3" />
                                                Crear mi negocio
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </FormSection>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}
