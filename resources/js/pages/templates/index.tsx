import { AppHeaderPage } from '@/components/app-header-page';
import { CreateTemplateDialog } from '@/components/form-templates/manage/create-template-dialog';
import { EditTemplateDialog } from '@/components/form-templates/manage/edit-template-dialog';
import { FormTemplateCard } from '@/components/form-templates/manage/form-template-card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FormTemplate } from '@/interfaces/form-template';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { Calendar, CheckCircle, FileText, Plus, User } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

export default function TemplatesIndex({ templates: initialTemplates }: { templates: FormTemplate[] }) {
    const { t } = useTranslation();
    const [templates, setTemplates] = useState<FormTemplate[]>(initialTemplates);
    const [selectedTemplate, setSelectedTemplate] = useState<FormTemplate | null>(null);
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());

    const userProfileTemplates = templates.filter((t) => t.type === 'user_profile');
    const bookingFormTemplates = templates.filter((t) => t.type === 'booking_form');
    const activeTemplates = templates.filter((t) => t.is_active);
    const inactiveTemplates = templates.filter((t) => !t.is_active);

    const toggleActive = (templateId: string) => {
        setTemplates((prev) => prev.map((template) => (template.id === templateId ? { ...template, is_active: !template.is_active } : template)));

        const template = templates.find((t) => t.id === templateId);
        toast.success(`${template?.name} ha sido ${template?.is_active ? 'desactivada' : 'activada'}.`);
    };

    const handleEdit = (template: FormTemplate) => {
        setSelectedTemplate(template);
        setIsEditDialogOpen(true);
    };

    const handleReplicate = (template: FormTemplate) => {
        const newTemplate: FormTemplate = {
            ...template,
            id: `${template.id}-copy-${Date.now()}`,
            name: `${template.name} (Copia)`,
            is_active: false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            fields: template.fields.map((field) => ({
                ...field,
                id: `${field.id}-copy-${Date.now()}`,
                form_template_id: `${template.id}-copy-${Date.now()}`,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            })),
        };

        setTemplates((prev) => [...prev, newTemplate]);
        /*  toast({
            title: 'Plantilla replicada',
            description: `Se ha creado una copia de ${template.name}.`,
        }); */
    };

    const handleSaveTemplate = (template: FormTemplate) => {
        if (selectedTemplate) {
            // Actualizar plantilla existente
            setTemplates((prev) => prev.map((t) => (t.id === template.id ? template : t)));
            /*  toast({
                title: 'Plantilla actualizada',
                description: `${template.name} ha sido actualizada correctamente.`,
            }); */
        } else {
            // Crear nueva plantilla
            setTemplates((prev) => [...prev, template]);
            /* toast({
                title: 'Plantilla creada',
                description: `${template.name} ha sido creada correctamente.`,
            }); */
        }
        setIsEditDialogOpen(false);
        setIsCreateDialogOpen(false);
        setSelectedTemplate(null);
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
        <AppLayout breadcrumbs={[{ title: t('formTemplates.title'), href: '/templates' }]}>
            <Head title={t('formTemplates.title')} />
            <AppHeaderPage
                title={t('formTemplates.title')}
                description={t('formTemplates.description')}
                actions={
                    <Button onClick={() => setIsCreateDialogOpen(true)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Nueva Plantilla
                    </Button>
                }
            />
            <div className="p-4">
                {/* Header */}
                <div className="mb-8">
                    {/* Stats */}
                    <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
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
                </div>

                {/* Tabs */}
                <Tabs defaultValue="all" className="w-full">
                    <TabsList className="mb-6 grid w-full md:w-auto md:grid-cols-4">
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
                                    onToggleActive={() => toggleActive(template.id)}
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
                                    onToggleActive={() => toggleActive(template.id)}
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
                                    onToggleActive={() => toggleActive(template.id)}
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
                                    onToggleActive={() => toggleActive(template.id)}
                                    onEdit={() => handleEdit(template)}
                                    onReplicate={() => handleReplicate(template)}
                                />
                            ))}
                        </div>
                    </TabsContent>
                </Tabs>

                {/* Dialogs */}
                <CreateTemplateDialog isOpen={isCreateDialogOpen} onClose={() => setIsCreateDialogOpen(false)} onSave={handleSaveTemplate} />

                <EditTemplateDialog
                    isOpen={isEditDialogOpen}
                    template={selectedTemplate}
                    onClose={() => {
                        setIsEditDialogOpen(false);
                        setSelectedTemplate(null);
                    }}
                    onSave={handleSaveTemplate}
                />
            </div>
        </AppLayout>
    );
}
