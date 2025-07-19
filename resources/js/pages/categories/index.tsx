import { CategoryProvider } from '@/components/categories/category-context';
import { ManageCategory } from '@/components/categories/manage-category';
import { CategoryResource } from '@/interfaces/category';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { TFunction } from 'i18next';
import { withTranslation } from 'react-i18next';
import { Toaster } from 'sonner';

interface CategoriesIndexProps {
    t: TFunction;
    categories: CategoryResource[];
    stats: {
        total_categories: number;
        active_categories: number;
        inactive_categories: number;
        categories_with_services: number;
        empty_categories: number;
        total_services: number;
        avg_services_per_category: number;
        most_used_category: {
            name: string;
            services_count: number;
        } | null;
        recent_categories: number;
    };
    chartData: {
        categories_by_status: Array<{
            name: string;
            value: number;
            color: string;
        }>;
        services_distribution: Array<{
            name: string;
            value: number;
            color: string;
        }>;
        monthly_growth: Array<{
            month: string;
            count: number;
        }>;
    };
}

function CategoriesIndex({ t, categories, stats, chartData }: CategoriesIndexProps) {
    const breadcrumbs = [
        {
            title: 'Dashboard',
            href: route('dashboard'),
        },
        {
            title: t('categories.title'),
            href: route('categories.index'),
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${t('categories.title')} - Dashboard`} />

            <CategoryProvider initialCategories={categories}>
                <ManageCategory categories={categories} stats={stats} chartData={chartData} t={t} />
            </CategoryProvider>

            {/* Toast notifications */}
            <Toaster
                position="top-right"
                toastOptions={{
                    duration: 4000,
                    style: {
                        background: 'white',
                        color: 'black',
                        border: '1px solid #e2e8f0',
                    },
                }}
            />
        </AppLayout>
    );
}

export default withTranslation()(CategoriesIndex);
