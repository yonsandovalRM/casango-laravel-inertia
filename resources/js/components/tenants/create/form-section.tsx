import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ReactNode } from 'react';

interface FormSectionProps {
    title: string;
    description: string;
    icon: ReactNode;
    children: ReactNode;
}

export function FormSection({ title, description, icon, children }: FormSectionProps) {
    return (
        <Card className="border-0 shadow-lg backdrop-blur-sm">
            <CardHeader className="pb-6">
                <div className="mb-2 flex items-center gap-3">
                    <div className="rounded-lg bg-blue-100 p-2 text-blue-600 dark:bg-blue-950 dark:text-blue-400">{icon}</div>
                    <div>
                        <h2 className="font-outfit text-xl font-semibold text-foreground">{title}</h2>
                        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-6">{children}</CardContent>
        </Card>
    );
}
