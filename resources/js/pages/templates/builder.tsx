import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { Plus } from 'lucide-react';

const fieldTypes = [
    { value: 'text', label: 'Texto' },
    { value: 'number', label: 'Número' },
    { value: 'email', label: 'Email' },
    { value: 'phone', label: 'Teléfono' },
    { value: 'date', label: 'Fecha' },
    { value: 'time', label: 'Hora' },
    { value: 'textarea', label: 'Área de texto' },
    { value: 'select', label: 'Selección' },
    { value: 'checkbox', label: 'Checkbox' },
    { value: 'radio', label: 'Radio' },
    { value: 'file', label: 'Archivo' },
    { value: 'image', label: 'Imagen' },
    { value: 'switch', label: 'Interruptor' },
];

export default function TemplatesIndex({ company, template }: { company: any; template: any }) {
    const breadcrumbs = [
        {
            title: 'Templates',
            href: route('templates.index'),
        },
    ];
    console.log(company, template);
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
