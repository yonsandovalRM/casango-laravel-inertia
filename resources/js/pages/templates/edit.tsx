import { AppHeaderPage } from '@/components/app-header-page';
import { FormTemplateForm } from '@/components/form-templates/form-template-form';
import { FormTemplate } from '@/interfaces/form-template';
import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

interface EditTemplateProps {
    template: FormTemplate;
}

export default function EditTemplate({ template }: EditTemplateProps) {
    const { t } = useTranslation();

    const handleCancel = () => {
        router.visit(route('form-templates.index'));
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: t('formTemplates.title'), href: route('form-templates.index') },
                { title: 'Editar Plantilla', href: route('form-templates.edit', template.id) },
            ]}
        >
            <Head title={`Editar ${template.name}`} />
            <AppHeaderPage title={`Editar: ${template.name}`} description="Modifica la información y campos de la plantilla." />
            <div className="p-6">
                <FormTemplateForm template={template} isEdit onCancel={handleCancel} />
            </div>
        </AppLayout>
    );
}
