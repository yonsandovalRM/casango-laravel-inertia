import { Breadcrumbs } from '@/components/breadcrumbs';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useAppearance } from '@/store/theme-store';
import { type BreadcrumbItem as BreadcrumbItemType } from '@/types';
import { MoonIcon, SunIcon } from 'lucide-react';
import { Button } from './ui/button';

export function AppSidebarHeader({ breadcrumbs = [] }: { breadcrumbs?: BreadcrumbItemType[] }) {
    const { updateAppearance, appearance } = useAppearance();
    return (
        <header className="flex h-16 shrink-0 items-center gap-2 border-b border-sidebar-border px-6 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:px-4">
            <div className="flex w-full items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                    <SidebarTrigger className="-ml-1" />
                    <Breadcrumbs breadcrumbs={breadcrumbs} />
                </div>
                <div>
                    <Button variant="outline" onClick={() => updateAppearance(appearance === 'light' ? 'dark' : 'light')}>
                        {appearance === 'light' ? <SunIcon className="size-4" /> : <MoonIcon className="size-4" />}
                    </Button>
                </div>
            </div>
        </header>
    );
}
