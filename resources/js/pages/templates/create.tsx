import { AppHeaderPage } from '@/components/app-header-page';
import { FormTemplateForm } from '@/components/form-templates/form-template-form';
import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

export default function CreateTemplate() {
    const { t } = useTranslation();

    const handleCancel = () => {
        router.visit(route('form-templates.index'));
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: t('formTemplates.title'), href: route('form-templates.index') },
                { title: 'Crear Plantilla', href: route('form-templates.create') },
            ]}
        >
            <Head title="Crear Plantilla" />
            <AppHeaderPage title="Crear Nueva Plantilla" description="Crea una nueva plantilla de formulario para datos de usuario o reservas." />
            <div className="p-6">
                <FormTemplateForm onCancel={handleCancel} />
            </div>
        </AppLayout>
    );
}
