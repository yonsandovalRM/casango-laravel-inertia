import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { Plus } from 'lucide-react';

export default function TemplatesIndex() {
    const breadcrumbs = [
        {
            title: 'Templates',
            href: route('templates.index'),
        },
    ];
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Templates" />
            <div className="p-4">
                <h1>Templates</h1>
            </div>
            <div className="p-4">
                <Button asChild>
                    <Link href={route('templates.builder')}>
                        <Plus />
                        Create Template
                    </Link>
                </Button>
            </div>
        </AppLayout>
    );
}
