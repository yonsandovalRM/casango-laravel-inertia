import { NavFooter } from '@/components/nav-footer';
import NavMain from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { PERMISSIONS, ROLES } from '@/hooks/use-permissions';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { BookOpen, Building2, Calendar, Globe, LayoutGrid, Package, Tags, Users } from 'lucide-react';
import { withTranslation } from 'react-i18next';
import AppLogo from './app-logo';

export default withTranslation()(AppSidebar);
function AppSidebar({ t }: { t: any }) {
    const mainNavItems: NavItem[] = [
        {
            title: t('ui.menu.dashboard'),
            href: '/dashboard',
            icon: LayoutGrid,
            permission: null,
        },
        {
            title: t('ui.menu.plans'),
            href: route('plans.index'),
            icon: Package,
            permission: PERMISSIONS.plans.view,
        },
        {
            title: t('ui.menu.business'),
            href: route('tenants.index'),
            icon: Building2,
            permission: PERMISSIONS.tenants.view,
        },
        {
            title: t('ui.menu.professional_profile'),
            href: route('professional.me'),
            icon: Users,
            permission: ROLES.professional,
        },
        {
            title: t('ui.menu.history_client_bookings'),
            href: route('bookings.client'),
            icon: Calendar,
            permission: null,
        },
        {
            title: t('ui.menu.history_professional_bookings'),
            href: route('bookings.professional'),
            icon: Calendar,
            permission: null,
        },
        {
            title: t('ui.menu.bookings'),
            href: route('bookings.index'),
            icon: Calendar,
            permission: null,
        },
    ];

    const adminNavItems: NavItem[] = [
        {
            title: t('ui.menu.company'),
            href: route('company.index'),
            icon: Building2,
            permission: PERMISSIONS.company.view,
        },
        {
            title: t('ui.menu.professionals'),
            href: route('professionals.index'),
            icon: Users,
            permission: PERMISSIONS.professionals.view,
        },
        {
            title: t('ui.menu.users'),
            href: route('users.index'),
            icon: Users,
            permission: PERMISSIONS.users.view,
        },

        {
            title: t('ui.menu.services'),
            href: route('services.index'),
            icon: Package,
            permission: PERMISSIONS.services.view,
        },
        {
            title: t('ui.menu.categories'),
            href: route('categories.index'),
            icon: Tags,
            permission: PERMISSIONS.categories.view,
        },
    ];
    const footerNavItems: NavItem[] = [
        {
            title: t('ui.menu.website'),
            href: route('home'),
            icon: Globe,
        },
        {
            title: t('ui.menu.documentation'),
            href: 'https://laravel.com/docs/starter-kits#react',
            icon: BookOpen,
        },
    ];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} navTitle={t('ui.menu.platform')} />
            </SidebarContent>
            {adminNavItems.length > 0 && (
                <SidebarContent>
                    <NavMain items={adminNavItems} navTitle={t('ui.menu.admin')} />
                </SidebarContent>
            )}

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
