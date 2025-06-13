import { Head } from '@inertiajs/react';

import AppearanceTabs from '@/components/appearance-tabs';
import HeadingSmall from '@/components/heading-small';
import { type BreadcrumbItem } from '@/types';

import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { withTranslation } from 'react-i18next';

export default withTranslation()(Appearance);
function Appearance({ t }: { t: any }) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('profile.appearance.title'),
            href: '/settings/appearance',
        },
    ];
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('profile.appearance.title')} />

            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall title={t('profile.appearance.title')} description={t('profile.appearance.description')} />
                    <AppearanceTabs />
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
