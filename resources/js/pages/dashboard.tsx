import { ChartAreaGradient } from '@/components/dashboard/ChartAreaGradient';
import { ChartAreaInteractive } from '@/components/dashboard/ChartAreaInteractive';
import { ChartBarLabelCustom } from '@/components/dashboard/ChartBarLabelCustom';
import { ChartRadialShape } from '@/components/dashboard/ChartRadialShape';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function Dashboard({ stats }: { stats: any }) {
    console.log(stats);
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="p-6">
                <ChartAreaInteractive />

                <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-3">
                    <ChartAreaGradient />

                    <ChartBarLabelCustom />

                    <ChartRadialShape />
                </div>
            </div>
        </AppLayout>
    );
}
