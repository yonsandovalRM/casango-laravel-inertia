import { CategoryProvider } from '@/components/categories/category-context';
import { ManageCategory } from '@/components/categories/manage-category';
import { CategoryResource } from '@/interfaces/category';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { TFunction } from 'i18next';
import { withTranslation } from 'react-i18next';

export default withTranslation()(CategoriesIndex);
interface CategoriesIndexProps {
    t: TFunction;
    categories: CategoryResource[];
}

function CategoriesIndex({ t, categories }: CategoriesIndexProps) {
    return (
        <AppLayout breadcrumbs={[{ title: t('categories.title'), href: '/categories' }]}>
            <Head title={t('categories.title')} />

            <CategoryProvider>
                <ManageCategory categories={categories} t={t} />
            </CategoryProvider>
        </AppLayout>
    );
}
