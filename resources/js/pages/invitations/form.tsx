import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AcceptInvitationFormData } from '@/interfaces/invitation';
import AuthLayout from '@/layouts/auth-layout';

export default function InvitationForm({ token, name }: { token: string; name: string }) {
    const { data, setData, post, processing, errors, reset } = useForm<AcceptInvitationFormData>({
        name,
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('invitations.accept', { token }), {
            onFinish: () => reset('name', 'password', 'password_confirmation'),
        });
    };

    return (
        <AuthLayout title="Crear cuenta" description="Ingresa tus detalles a continuación para crear tu cuenta">
            <Head title="Crear cuenta" />
            <form className="flex flex-col gap-6" onSubmit={submit}>
                <div className="grid gap-6">
                    <div className="grid gap-2">
                        <Label htmlFor="name">¿Cómo quieres que te llamemos?</Label>
                        <Input
                            id="name"
                            type="text"
                            required
                            autoFocus
                            tabIndex={1}
                            autoComplete="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            disabled={processing}
                            placeholder="Nombre"
                        />
                        <InputError message={errors.name} className="mt-2" />
                        <p className="text-sm text-muted-foreground">
                            Este nombre lo recibimos desde la invitación, si deseas cambiarlo, puedes hacerlo ahora.
                        </p>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password">Ingresa una contraseña</Label>
                        <Input
                            id="password"
                            type="password"
                            required
                            tabIndex={3}
                            autoComplete="new-password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            disabled={processing}
                            placeholder="Contraseña"
                        />
                        <InputError message={errors.password} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password_confirmation">Confirma tu contraseña</Label>
                        <Input
                            id="password_confirmation"
                            type="password"
                            required
                            tabIndex={4}
                            autoComplete="new-password"
                            value={data.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            disabled={processing}
                            placeholder="Confirma tu contraseña"
                        />
                        <InputError message={errors.password_confirmation} />
                    </div>

                    <Button type="submit" className="mt-2 w-full" tabIndex={5} disabled={processing}>
                        {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                        Crear cuenta
                    </Button>
                </div>
            </form>
        </AuthLayout>
    );
}
