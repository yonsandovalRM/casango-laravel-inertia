import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { usePermissions } from '@/hooks/use-permissions';
import { isRouteActive } from '@/lib/utils';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { withTranslation } from 'react-i18next';

export default withTranslation()(NavMain);
function NavMain({ items = [], t, navTitle }: { items: NavItem[]; t: any; navTitle: string }) {
    const { url } = usePage();
    const { hasPermission, hasRole } = usePermissions();

    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarGroupLabel>{navTitle}</SidebarGroupLabel>

            <SidebarMenu>
                {items.map((item) => {
                    if (item.permission && !hasPermission(item.permission) && !hasRole(item.permission)) {
                        return null;
                    }

                    return (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton asChild isActive={isRouteActive(url, item.href)} tooltip={{ children: item.title }}>
                                <Link href={item.href} prefetch>
                                    {item.icon && <item.icon />}
                                    <span>{item.title}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    );
                })}
            </SidebarMenu>
        </SidebarGroup>
    );
}
