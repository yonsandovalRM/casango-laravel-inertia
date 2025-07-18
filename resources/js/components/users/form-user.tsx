import InputError from '@/components/input-error';
import { Role } from '@/interfaces/role';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

type FormUserProps = {
    data: any;
    setData: (name: string, value: any) => void;
    errors: any;
    roles: Role[];
};

export const FormUser = ({ data, setData, errors, roles }: FormUserProps) => {
    return (
        <div>
            <div className="grid flex-1 auto-rows-min gap-6 px-4">
                <div className="flex flex-col gap-6">
                    <div className="space-y-6 pb-4">
                        <div>
                            <Label htmlFor="name" required>
                                Nombre
                            </Label>
                            <Input id="name" name="name" value={data.name} onChange={(e) => setData('name', e.target.value)} placeholder="Nombre" />
                            <InputError message={errors.name} />
                        </div>
                        <div>
                            <Label htmlFor="email" required>
                                Correo electrónico
                            </Label>
                            <Input
                                id="email"
                                name="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                placeholder="Correo electrónico"
                            />
                            <InputError message={errors.email} />
                        </div>
                        <div>
                            <Label htmlFor="role" required>
                                Rol
                            </Label>
                            <Select name="role" value={data.role} onValueChange={(value) => setData('role', value)}>
                                <SelectTrigger autoFocus>
                                    <SelectValue placeholder="Selecciona un rol" />
                                </SelectTrigger>
                                <SelectContent>
                                    {roles.map((role) => (
                                        <SelectItem key={role.id} value={role.name}>
                                            {role.display_name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <InputError message={errors.role} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
