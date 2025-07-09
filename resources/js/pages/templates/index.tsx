import { AppHeaderPage } from '@/components/app-header-page';
import { FormTemplateCard } from '@/components/form-templates/manage/form-template-card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FormTemplate } from '@/interfaces/form-template';
import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { Calendar, CheckCircle, FileText, Plus, User } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

export default function TemplatesIndex({ templates }: { templates: FormTemplate[] }) {
    const { t } = useTranslation();
    const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());

    const userProfileTemplates = templates.filter((t) => t.type === 'user_profile');
    const bookingFormTemplates = templates.filter((t) => t.type === 'booking_form');
    const activeTemplates = templates.filter((t) => t.is_active);

    const handleToggleActive = (template: FormTemplate) => {
        router.patch(
            route('form-templates.toggle', template.id),
            {},
            {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success(`${template.name} ha sido ${template.is_active ? 'desactivada' : 'activada'}.`);
                },
                onError: () => {
                    toast.error('Error al cambiar el estado de la plantilla.');
                },
            },
        );
    };

    const handleEdit = (template: FormTemplate) => {
        router.visit(route('form-templates.edit', template.id));
    };

    const handleReplicate = (template: FormTemplate) => {
        router.post(
            route('form-templates.duplicate', template.id),
            {},
            {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success(`Se ha creado una copia de ${template.name}.`);
                },
                onError: () => {
                    toast.error('Error al duplicar la plantilla.');
                },
            },
        );
    };

    const handleCreateNew = () => {
        router.visit(route('form-templates.create'));
    };

    const toggleExpanded = (templateId: string) => {
        setExpandedCards((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(templateId)) {
                newSet.delete(templateId);
            } else {
                newSet.add(templateId);
            }
            return newSet;
        });
    };

    return (
        <AppLayout breadcrumbs={[{ title: t('formTemplates.title'), href: route('form-templates.index') }]}>
            <Head title={t('formTemplates.title')} />
            <AppHeaderPage
                title={t('formTemplates.title')}
                description={t('formTemplates.description')}
                actions={
                    <Button onClick={handleCreateNew}>
                        <Plus className="mr-2 h-4 w-4" />
                        Nueva Plantilla
                    </Button>
                }
            />
            <div className="p-6">
                {/* Stats */}
                <div className="mb-8 grid grid-cols-2 gap-6 md:grid-cols-4">
                    <div className="rounded-lg border bg-card p-4 shadow-sm">
                        <div className="flex items-center">
                            <FileText className="mr-2 h-5 w-5 text-blue-500" />
                            <div>
                                <p className="text-sm text-muted-foreground">Total</p>
                                <p className="text-xl font-semibold">{templates.length}</p>
                            </div>
                        </div>
                    </div>
                    <div className="rounded-lg border bg-card p-4 shadow-sm">
                        <div className="flex items-center">
                            <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                            <div>
                                <p className="text-sm text-muted-foreground">Activas</p>
                                <p className="text-xl font-semibold">{activeTemplates.length}</p>
                            </div>
                        </div>
                    </div>
                    <div className="rounded-lg border bg-card p-4 shadow-sm">
                        <div className="flex items-center">
                            <User className="mr-2 h-5 w-5 text-purple-500" />
                            <div>
                                <p className="text-sm text-muted-foreground">Usuario</p>
                                <p className="text-xl font-semibold">{userProfileTemplates.length}</p>
                            </div>
                        </div>
                    </div>
                    <div className="rounded-lg border bg-card p-4 shadow-sm">
                        <div className="flex items-center">
                            <Calendar className="mr-2 h-5 w-5 text-orange-500" />
                            <div>
                                <p className="text-sm text-muted-foreground">Reserva</p>
                                <p className="text-xl font-semibold">{bookingFormTemplates.length}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <Tabs defaultValue="all" className="w-full">
                    <TabsList className="mb-6 flex h-full w-full flex-col lg:grid lg:grid-cols-4">
                        <TabsTrigger value="all">Todas ({templates.length})</TabsTrigger>
                        <TabsTrigger value="user_profile">
                            <User className="mr-2 h-4 w-4" />
                            Usuario ({userProfileTemplates.length})
                        </TabsTrigger>
                        <TabsTrigger value="booking_form">
                            <Calendar className="mr-2 h-4 w-4" />
                            Reserva ({bookingFormTemplates.length})
                        </TabsTrigger>
                        <TabsTrigger value="active">
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Activas ({activeTemplates.length})
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="all">
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {templates.map((template) => (
                                <FormTemplateCard
                                    key={template.id}
                                    template={template}
                                    isExpanded={expandedCards.has(template.id)}
                                    onToggleExpanded={() => toggleExpanded(template.id)}
                                    onToggleActive={() => handleToggleActive(template)}
                                    onEdit={() => handleEdit(template)}
                                    onReplicate={() => handleReplicate(template)}
                                />
                            ))}
                        </div>
                    </TabsContent>

                    <TabsContent value="user_profile">
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {userProfileTemplates.map((template) => (
                                <FormTemplateCard
                                    key={template.id}
                                    template={template}
                                    isExpanded={expandedCards.has(template.id)}
                                    onToggleExpanded={() => toggleExpanded(template.id)}
                                    onToggleActive={() => handleToggleActive(template)}
                                    onEdit={() => handleEdit(template)}
                                    onReplicate={() => handleReplicate(template)}
                                />
                            ))}
                        </div>
                    </TabsContent>

                    <TabsContent value="booking_form">
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {bookingFormTemplates.map((template) => (
                                <FormTemplateCard
                                    key={template.id}
                                    template={template}
                                    isExpanded={expandedCards.has(template.id)}
                                    onToggleExpanded={() => toggleExpanded(template.id)}
                                    onToggleActive={() => handleToggleActive(template)}
                                    onEdit={() => handleEdit(template)}
                                    onReplicate={() => handleReplicate(template)}
                                />
                            ))}
                        </div>
                    </TabsContent>

                    <TabsContent value="active">
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {activeTemplates.map((template) => (
                                <FormTemplateCard
                                    key={template.id}
                                    template={template}
                                    isExpanded={expandedCards.has(template.id)}
                                    onToggleExpanded={() => toggleExpanded(template.id)}
                                    onToggleActive={() => handleToggleActive(template)}
                                    onEdit={() => handleEdit(template)}
                                    onReplicate={() => handleReplicate(template)}
                                />
                            ))}
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </AppLayout>
    );
}
