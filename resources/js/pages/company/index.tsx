import { CompanyContainer } from '@/components/company/company-container';
import { usePermissions } from '@/hooks/use-permissions';
import { CompanyResource } from '@/interfaces/company';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

interface Props {
    company: CompanyResource;
}

export default function CompanyIndex({ company }: Props) {
    const { t } = useTranslation();
    const { hasPermission } = usePermissions();

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('company.title'),
            href: route('company.index'),
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('company.title')} />
            <div className="p-6">
                <CompanyContainer company={company} t={t} />
            </div>
        </AppLayout>
    );
}

export const DAYS_OF_WEEK = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

export const LOCALES = [
    { label: 'Español', value: 'es-CL' },
    { label: 'English', value: 'en-US' },
];

export const CURRENCIES = ['CLP', 'USD', 'EUR'];

export const TIMEZONES = [
    'America/Santiago',
    'America/New_York',
    'America/Los_Angeles',
    'America/Chicago',
    'America/Denver',
    'America/Phoenix',
    'America/Mexico_City',
    'America/Bogota',
    'America/Caracas',
    'America/Sao_Paulo',
    'America/Buenos_Aires',
    'America/Lima',
];
