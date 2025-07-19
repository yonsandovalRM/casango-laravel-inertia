import { Button } from '@/components/ui/button';
import { CompanyResource } from '@/interfaces/company';
import { Building2, Camera, X } from 'lucide-react';
import React from 'react';

interface CompanyHeaderProps {
    company?: CompanyResource;
    logoPreview?: string | null;
    coverPreview?: string | null;
    isEditing?: boolean;
    onLogoUpload?: () => void;
    onCoverUpload?: () => void;
    onRemoveLogo?: () => void;
    onRemoveCover?: () => void;
    companyName?: string;
}

export const CompanyHeader: React.FC<CompanyHeaderProps> = ({
    company,
    logoPreview,
    coverPreview,
    isEditing = false,
    onLogoUpload,
    onCoverUpload,
    onRemoveLogo,
    onRemoveCover,
    companyName,
}) => {
    const displayLogoUrl = logoPreview || (company?.logo ? `/storage/${company.logo}` : null);
    const displayCoverUrl = coverPreview || (company?.cover_image ? `/storage/${company.cover_image}` : null);

    return (
        <div className="overflow-hidden rounded-2xl border border-border bg-card">
            <div className="relative h-48 sm:h-64">
                {displayCoverUrl ? (
                    <img src={displayCoverUrl} alt="Cover" className="h-full w-full object-cover" />
                ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900"></div>
                )}

                {/* Cover Upload Controls - Solo en modo edición */}
                {isEditing && (
                    <div className="absolute top-4 right-4 flex gap-2">
                        <Button
                            type="button"
                            onClick={onCoverUpload}
                            size="sm"
                            variant="secondary"
                            className="bg-opacity-90 hover:bg-opacity-100 rounded-full p-3 shadow-lg"
                        >
                            <Camera className="h-5 w-5" />
                        </Button>
                        {displayCoverUrl && (
                            <Button
                                type="button"
                                onClick={onRemoveCover}
                                size="sm"
                                variant="secondary"
                                className="bg-opacity-90 hover:bg-opacity-100 rounded-full p-3 shadow-lg"
                            >
                                <X className="h-5 w-5" />
                            </Button>
                        )}
                    </div>
                )}

                {/* Logo Section */}
                <div className="absolute -bottom-16 left-8">
                    <div className="relative">
                        <div className="h-32 w-32 overflow-hidden rounded-2xl border-4 border-border bg-card shadow-xl">
                            {displayLogoUrl ? (
                                <img src={displayLogoUrl} alt="Logo" className="h-full w-full object-cover" />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center bg-accent">
                                    <Building2 className="h-12 w-12 text-foreground" />
                                </div>
                            )}
                        </div>

                        {/* Logo Upload Controls - Solo en modo edición */}
                        {isEditing && (
                            <div className="absolute -right-2 -bottom-2 flex gap-1">
                                <Button type="button" onClick={onLogoUpload} size="sm" variant="secondary" className="rounded-full p-2 shadow-lg">
                                    <Camera className="h-4 w-4" />
                                </Button>
                                {displayLogoUrl && (
                                    <Button type="button" onClick={onRemoveLogo} size="sm" variant="secondary" className="rounded-full p-2 shadow-lg">
                                        <X className="h-4 w-4" />
                                    </Button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="px-8 pt-20 pb-8">
                <div className="flex flex-col gap-6">
                    <div>
                        <h1 className="font-outfit text-3xl font-bold text-foreground">{companyName || company?.name || 'Nombre de la empresa'}</h1>
                        {company?.tagline && <p className="mt-2 text-lg text-muted-foreground">{company.tagline}</p>}
                    </div>

                    {company?.description && <p className="max-w-3xl leading-relaxed text-muted-foreground">{company.description}</p>}
                </div>
            </div>
        </div>
    );
};
