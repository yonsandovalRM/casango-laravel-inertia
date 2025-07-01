import { ProfessionalResource } from '@/interfaces/professional';
import { router } from '@inertiajs/react';
import { TFunction } from 'i18next';
import { Edit, Plus, Trash2 } from 'lucide-react';
import { AppHeaderPage } from '../app-header-page';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { EmptyState } from '../ui/empty-state';
import { FormProfessional } from './form-professional';
import { useProfessional } from './professional-context';

interface ManageProfessionalProps {
    professionals: ProfessionalResource[];
    t: TFunction;
}

export function ManageProfessional({ professionals, t }: ManageProfessionalProps) {
    const { setProfessional, setOpen, onDelete } = useProfessional();

    const handleDelete = (professionalId: string) => {
        onDelete(professionalId);
    };
    const handleCreate = () => {
        setProfessional(null);
        setOpen(true);
    };
    const handleEdit = (professional: ProfessionalResource) => {
        setProfessional(professional);
        setOpen(true);
    };

    const handleAssignServices = (professional: ProfessionalResource) => {
        router.visit(route('professionals.assign-services.show', professional.id));
    };

    return (
        <div>
            <AppHeaderPage
                title={t('professionals.title')}
                description={t('professionals.description')}
                actions={<Button onClick={handleCreate}>{t('professionals.manage.create')}</Button>}
            />
            <div className="flex flex-col gap-4 p-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {professionals.length === 0 && (
                        <EmptyState
                            action={<Button onClick={handleCreate}>{t('professionals.manage.create')}</Button>}
                            text={t('professionals.manage.no_professionals')}
                        />
                    )}
                    {professionals.map((professional) => (
                        <Card key={professional.id} className="group transition-all duration-200 hover:shadow-lg">
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <CardTitle className="text-lg font-semibold text-foreground transition-colors">
                                            {professional.title} {professional.user.name}
                                        </CardTitle>
                                        {professional.bio && (
                                            <CardDescription className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                                                {professional.bio}
                                            </CardDescription>
                                        )}
                                        {professional.profession && (
                                            <CardDescription className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                                                {professional.profession}
                                            </CardDescription>
                                        )}
                                        {professional.specialty && (
                                            <CardDescription className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                                                {professional.specialty}
                                            </CardDescription>
                                        )}
                                    </div>
                                    <div className="ml-2 flex items-center gap-1">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleEdit(professional)}
                                            className="h-8 w-8 p-0 opacity-0 transition-opacity group-hover:opacity-100"
                                        >
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => onDelete(professional.id)}
                                            className="h-8 w-8 p-0 text-destructive opacity-0 transition-opacity group-hover:opacity-100 hover:text-destructive"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </CardHeader>

                            <CardContent className="pt-0">
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <Badge variant={professional.is_company_schedule ? 'default' : 'secondary'} className="text-xs">
                                            {professional.is_company_schedule
                                                ? t('professionals.manage.company_schedule')
                                                : t('professionals.manage.custom_schedule')}
                                        </Badge>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button variant="outline" size="sm" className="w-full" onClick={() => handleAssignServices(professional)}>
                                    <Plus className="h-4 w-4" />
                                    {t('professionals.manage.assign_services')}
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </div>
            <FormProfessional professionals={professionals} />
        </div>
    );
}
