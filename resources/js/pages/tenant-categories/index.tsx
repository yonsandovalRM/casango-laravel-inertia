import { AppHeaderPage } from '@/components/app-header-page';
import { CreateTenantCategory } from '@/components/tenant-categories/create-tenant-category';
import { EditTenantCategory } from '@/components/tenant-categories/edit-tenant-cateogry';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CardContent, CardFooter, CardHeader, CardItem } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { EmptyState } from '@/components/ui/empty-state';
import { PERMISSIONS, usePermissions } from '@/hooks/use-permissions';
import { TenantCategoryResource } from '@/interfaces/tenant-category';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { Edit2, TrashIcon } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function TenantCategoriesIndex({ tenant_categories }: { tenant_categories: TenantCategoryResource[] }) {
    const { hasPermission } = usePermissions();
    const [openDialog, setOpenDialog] = useState(false);
    const [openDialogEdit, setOpenDialogEdit] = useState(false);
    const [selectedTenantCategoryId, setSelectedTenantCategoryId] = useState<string | null>(null);
    const [selectedTenantCategory, setSelectedTenantCategory] = useState<TenantCategoryResource | null>(null);

    const { t } = useTranslation();

    const handleDelete = (tenantCategoryId: string) => {
        setOpenDialog(true);
        setSelectedTenantCategoryId(tenantCategoryId);
    };

    const onDelete = () => {
        if (!selectedTenantCategoryId) return;
        router.delete(route('tenant-categories.destroy', { tenantCategory: selectedTenantCategoryId }));
        setSelectedTenantCategoryId(null);
        setOpenDialog(false);
    };

    const handleEdit = (tenantCategory: TenantCategoryResource) => {
        setSelectedTenantCategory(tenantCategory);
        setOpenDialogEdit(true);
    };

    const handleCancelEdit = () => {
        setSelectedTenantCategory(null);
        setOpenDialogEdit(false);
    };

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('ui.menu.dashboard'),
            href: '/dashboard',
        },
        {
            title: t('tenantCategories.title'),
            href: route('tenant-categories.index'),
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('tenantCategories.title')} />
            <AppHeaderPage
                title={t('tenantCategories.title')}
                description={t('tenantCategories.description')}
                actions={hasPermission(PERMISSIONS.tenantCategories.create) ? <CreateTenantCategory /> : null}
            />
            <div className="p-6">
                {tenant_categories?.length === 0 && hasPermission(PERMISSIONS.tenantCategories.create) && (
                    <EmptyState text={t('tenantCategories.list_empty.text')} action={<CreateTenantCategory />} />
                )}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
                    {tenant_categories?.map((tenant_category) => (
                        <CardItem key={tenant_category.id}>
                            <CardHeader>
                                <div className="flex items-center justify-between gap-2">
                                    <h4 className="text-lg font-bold">{tenant_category.name}</h4>
                                    <div>
                                        <Badge variant={tenant_category.is_active ? 'default' : 'destructive'}>
                                            {tenant_category.is_active ? 'Activa' : 'Inactiva'}
                                        </Badge>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center justify-between gap-2"></div>
                                <p className="text-sm text-muted-foreground">{tenant_category.description}</p>
                            </CardContent>
                            <CardFooter className="flex justify-end gap-2">
                                <Button variant="outline" onClick={() => handleEdit(tenant_category)}>
                                    <Edit2 className="size-4" />
                                </Button>

                                <Button variant="soft-destructive" onClick={() => handleDelete(tenant_category.id)}>
                                    <TrashIcon className="size-4" />
                                </Button>
                            </CardFooter>
                        </CardItem>
                    ))}
                </div>
            </div>
            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                <DialogContent className="max-h-[80vh] max-w-4xl overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">{t('tenantCategories.deleteDialog.title')}</DialogTitle>
                        <DialogDescription>{t('tenantCategories.deleteDialog.description')}</DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="soft-destructive" onClick={() => setOpenDialog(false)}>
                            {t('tenantCategories.deleteDialog.cancel')}
                        </Button>
                        <Button variant="destructive" onClick={onDelete}>
                            {t('tenantCategories.deleteDialog.delete')}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            <EditTenantCategory tenantCategory={selectedTenantCategory} open={openDialogEdit} setOpen={handleCancelEdit} />
        </AppLayout>
    );
}
