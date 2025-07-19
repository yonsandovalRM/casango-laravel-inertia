import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { CompanyResource } from '@/interfaces/company';
import { router } from '@inertiajs/react';
import { AlertTriangle, Video, VideoOff } from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'react-toastify';

interface VideoCallSettingsProps {
    company?: CompanyResource;
    canEdit?: boolean;
    t: any;
}

export const VideoCallSettings: React.FC<VideoCallSettingsProps> = ({ company, canEdit = false, t }) => {
    const [localValue, setLocalValue] = useState(company?.allows_video_calls ?? false);

    const handleToggle = async (enabled: boolean) => {
        router.put(
            route('company.video-calls.update'),
            { allows_video_calls: enabled },
            {
                preserveScroll: true,
                onSuccess: () => {
                    if (enabled) {
                        toast.success(t('company.video_calls_enabled'));
                    } else {
                        toast.success(t('company.video_calls_disabled'));
                    }
                },
            },
        );

        setLocalValue(enabled);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    {localValue ? <Video className="h-5 w-5 text-green-600" /> : <VideoOff className="h-5 w-5 text-gray-500" />}
                    {t('company.video_calls')}
                </CardTitle>
                <CardDescription>{t('company.video_calls_description')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                        <div className="text-base font-medium">{t('company.allow_video_calls')}</div>
                        <div className="text-sm text-muted-foreground">
                            {localValue ? t('company.video_calls_enabled_description') : t('company.video_calls_disabled_description')}
                        </div>
                    </div>

                    {canEdit ? (
                        <Switch checked={localValue} onCheckedChange={handleToggle} className="data-[state=checked]:bg-green-600" />
                    ) : (
                        <div
                            className={`rounded-full px-3 py-1 text-sm font-medium ${
                                localValue
                                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                            }`}
                        >
                            {localValue ? t('common.enabled') : t('common.disabled')}
                        </div>
                    )}
                </div>

                {/* Warning when video calls are disabled */}
                {!localValue && canEdit && (
                    <Alert className="border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950">
                        <AlertTriangle className="h-4 w-4 text-orange-600" />
                        <AlertDescription className="text-orange-800 dark:text-orange-200">{t('company.video_calls_warning')}</AlertDescription>
                    </Alert>
                )}

                {/* Info about video call platforms */}
                {localValue && (
                    <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 dark:border-blue-800 dark:bg-blue-950">
                        <div className="flex items-start gap-2">
                            <Video className="mt-0.5 h-4 w-4 text-blue-600" />
                            <div className="text-sm">
                                <p className="font-medium text-blue-800 dark:text-blue-200">{t('company.video_call_platforms')}</p>
                                <p className="mt-1 text-blue-600 dark:text-blue-300">{t('company.video_call_platforms_description')}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Quick actions when editing */}
                {canEdit && (
                    <div className="border-t pt-2">
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                            <span>{t('company.last_updated')}</span>
                            <span>{company?.updated_at ? new Date(company.updated_at).toLocaleDateString() : t('common.never')}</span>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};
