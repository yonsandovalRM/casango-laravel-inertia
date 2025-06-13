import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { usePermissions } from '@/hooks/use-permissions';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { withTranslation } from 'react-i18next';

export default withTranslation()(NavMain);
function NavMain({ items = [], t }: { items: NavItem[]; t: any }) {
    const page = usePage();
    const { hasPermission } = usePermissions();

    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarGroupLabel>{t('ui.menu.platform')}</SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) => {
                    if (item.permission && !hasPermission(item.permission)) {
                        return null;
                    }
                    return (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton asChild isActive={page.url.startsWith(item.href)} tooltip={{ children: item.title }}>
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
