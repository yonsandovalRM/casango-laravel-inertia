import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import { FormTemplate } from '@/interfaces/form-template';
import {
    Calendar,
    Calendar as CalendarIcon,
    CheckCircle,
    CheckSquare,
    ChevronDown,
    ChevronUp,
    Clock,
    Copy,
    Edit,
    FileText,
    Hash,
    List,
    MessageSquare,
    Type,
    Upload,
    User,
    XCircle,
} from 'lucide-react';
import React from 'react';

interface FormTemplateCardProps {
    template: FormTemplate;
    isExpanded: boolean;
    onToggleExpanded: () => void;
    onToggleActive: () => void;
    onEdit: () => void;
    onReplicate: () => void;
}

const getFieldIcon = (type: string) => {
    switch (type) {
        case 'text':
            return <Type className="h-4 w-4" />;
        case 'date':
            return <CalendarIcon className="h-4 w-4" />;
        case 'select':
            return <List className="h-4 w-4" />;
        case 'textarea':
            return <MessageSquare className="h-4 w-4" />;
        case 'file':
            return <Upload className="h-4 w-4" />;
        case 'checkbox':
            return <CheckSquare className="h-4 w-4" />;
        default:
            return <FileText className="h-4 w-4" />;
    }
};

const getFieldTypeColor = (type: string) => {
    switch (type) {
        case 'text':
            return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100';
        case 'date':
            return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
        case 'select':
            return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100';
        case 'textarea':
            return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100';
        case 'file':
            return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100';
        case 'checkbox':
            return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100';
        default:
            return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100';
    }
};

export const FormTemplateCard: React.FC<FormTemplateCardProps> = ({
    template,
    isExpanded,
    onToggleExpanded,
    onToggleActive,
    onEdit,
    onReplicate,
}) => {
    const sortedFields = [...template.fields].sort((a, b) => a.order - b.order);

    return (
        <Card className={`bg-card transition-all duration-200 hover:shadow-lg`}>
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <div className="mb-2 flex items-center gap-2">
                            {template.type === 'user_profile' ? (
                                <User className="h-5 w-5 text-purple-500" />
                            ) : (
                                <Calendar className="h-5 w-5 text-orange-500" />
                            )}
                            <CardTitle className="text-lg">{template.name}</CardTitle>
                        </div>
                        <CardDescription className="text-sm">{template.description}</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                        {template.is_active ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                            <XCircle className="h-5 w-5 text-muted-foreground" />
                        )}
                    </div>
                </div>

                <div className="mt-3 flex items-center justify-between">
                    <div className="flex gap-2">
                        <Badge variant={template.type === 'user_profile' ? 'default' : 'secondary'}>
                            {template.type === 'user_profile' ? 'Perfil Usuario' : 'Formulario Reserva'}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                            {template.fields.length} campos
                        </Badge>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="pt-0">
                {/* Quick field preview */}
                {!isExpanded && template.fields.length > 0 && (
                    <div className="mb-4">
                        <p className="mb-2 text-sm text-foreground">Campos principales:</p>
                        <div className="flex flex-wrap gap-1">
                            {sortedFields.slice(0, 3).map((field) => (
                                <Badge key={field.id} variant="outline" className={`text-xs ${getFieldTypeColor(field.type)}`}>
                                    {getFieldIcon(field.type)}
                                    <span className="ml-1">{field.label}</span>
                                </Badge>
                            ))}
                            {template.fields.length > 3 && (
                                <Badge variant="outline" className="text-xs text-muted-foreground">
                                    +{template.fields.length - 3} más
                                </Badge>
                            )}
                        </div>
                    </div>
                )}

                {/* Expanded fields view */}
                {isExpanded && (
                    <div className="mb-4">
                        <p className="mb-3 text-sm font-medium text-foreground">Campos del formulario ({template.fields.length}):</p>
                        <ScrollArea className="h-60">
                            <div className="space-y-2">
                                {sortedFields.map((field) => (
                                    <div key={field.id} className="flex items-center justify-between rounded-lg border border-border bg-card p-2">
                                        <div className="flex items-center gap-2">
                                            <Badge variant="outline" className={`text-xs ${getFieldTypeColor(field.type)}`}>
                                                {getFieldIcon(field.type)}
                                                <span className="ml-1">{field.type}</span>
                                            </Badge>
                                            <div>
                                                <p className="text-sm font-medium">{field.label}</p>
                                                <p className="text-xs text-muted-foreground">{field.name}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Badge variant="outline" className="text-xs">
                                                #{field.order}
                                            </Badge>
                                            {field.is_required && (
                                                <Badge
                                                    variant="outline"
                                                    className="border-red-200 text-xs text-red-600 dark:border-red-800 dark:text-red-400"
                                                >
                                                    Requerido
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-between border-t border-border pt-3">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                            <Switch checked={template.is_active} onCheckedChange={onToggleActive} />
                            <span className="text-sm text-muted-foreground">{template.is_active ? 'Activa' : 'Inactiva'}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-1">
                        <Button variant="ghost" size="sm" onClick={onToggleExpanded} className="h-8 w-8 p-0">
                            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        </Button>
                        <Button variant="ghost" size="sm" onClick={onEdit}>
                            <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={onReplicate}>
                            <Copy className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                {/* Template metadata */}
                <div className="mt-3 border-t border-border pt-3">
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>Actualizado: {new Date(template.updated_at).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Hash className="h-3 w-3" />
                            <span>{template.id.slice(0, 8)}...</span>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
