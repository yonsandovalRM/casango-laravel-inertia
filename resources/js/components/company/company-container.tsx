import { CompanyEditView } from '@/components/company/company-edit-view';
import { CompanyReadView } from '@/components/company/company-read-view';
import { Button } from '@/components/ui/button';
import { PERMISSIONS, usePermissions } from '@/hooks/use-permissions';
import { CompanyResource } from '@/interfaces/company';
import { Edit, Eye } from 'lucide-react';
import React, { useState } from 'react';

interface CompanyContainerProps {
    company: CompanyResource;
    t: any;
}

export const CompanyContainer: React.FC<CompanyContainerProps> = ({ company, t }) => {
    const { hasPermission } = usePermissions();

    const canEdit = hasPermission(PERMISSIONS.company.edit);
    const [isEditing, setIsEditing] = useState(false);

    const toggleEdit = () => {
        if (canEdit) {
            setIsEditing(!isEditing);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header with Toggle Button */}
            {canEdit && (
                <div className="flex justify-end">
                    <Button onClick={toggleEdit} variant={isEditing ? 'outline' : 'default'}>
                        {isEditing ? (
                            <>
                                <Eye className="mr-2 h-4 w-4" />
                                {t('company.view_mode')}
                            </>
                        ) : (
                            <>
                                <Edit className="mr-2 h-4 w-4" />
                                {t('company.edit_mode')}
                            </>
                        )}
                    </Button>
                </div>
            )}

            {/* Content */}
            {isEditing ? <CompanyEditView company={company} t={t} /> : <CompanyReadView company={company} t={t} />}
        </div>
    );
};
