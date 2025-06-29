import { SharedData } from '@/types';
import { usePage } from '@inertiajs/react';

export default function BookingFooter() {
    const {
        props: { company },
    } = usePage<SharedData>();
    return (
        <div className="flex h-16 items-center justify-center border-t bg-sidebar">
            <div className="flex items-center gap-2">
                <p className="text-sm text-muted-foreground">
                    &copy; {new Date().getFullYear()} {company.name} {company.tagline ? `- ${company.tagline}` : ''}
                </p>
            </div>
        </div>
    );
}
