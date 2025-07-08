import { AppHeaderPage } from '@/components/app-header-page';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

export default function TemplatesIndex(props: any) {
    console.log({ props });
    const { t } = useTranslation();
    return (
        <AppLayout breadcrumbs={[{ title: t('templates.index.title'), href: '/templates' }]}>
            <Head title={t('templates.index.title')} />
            <AppHeaderPage title={t('templates.index.title')} description={t('templates.index.description')} />
            <div className="p-4"></div>
        </AppLayout>
    );
}
