// resources/js/components/services/service-filters.tsx
import { CategoryResource } from '@/interfaces/category';
import { SERVICE_TYPE_OPTIONS, ServiceFilters, ServiceType } from '@/interfaces/service';
import { Search, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

interface ServiceFiltersProps {
    filters: ServiceFilters;
    onFiltersChange: (filters: ServiceFilters) => void;
    categories: CategoryResource[];
    companyAllowsVideoCalls: boolean;
}

export function ServiceFiltersComponent({ filters, onFiltersChange, categories, companyAllowsVideoCalls }: ServiceFiltersProps) {
    const { t } = useTranslation();

    const handleSearchChange = (value: string) => {
        onFiltersChange({ ...filters, search: value });
    };

    const handleCategoryChange = (value: string) => {
        onFiltersChange({
            ...filters,
            category_id: value === 'all' ? null : value,
        });
    };

    const handleServiceTypeChange = (value: string) => {
        onFiltersChange({
            ...filters,
            service_type: value === 'all' ? null : value,
        });
    };

    const handleStatusChange = (value: string) => {
        onFiltersChange({
            ...filters,
            is_active: value === 'all' ? null : value === 'active',
        });
    };

    const clearFilters = () => {
        onFiltersChange({
            search: '',
            category_id: null,
            service_type: null,
            is_active: null,
        });
    };

    const hasActiveFilters = filters.search || filters.category_id || filters.service_type || filters.is_active !== null;

    // Filter service type options based on company settings
    const availableServiceTypes = SERVICE_TYPE_OPTIONS.filter((option) => {
        if (!companyAllowsVideoCalls) {
            return option.value === ServiceType.IN_PERSON;
        }
        return true;
    });

    return (
        <div className="space-y-4 rounded-lg border bg-card p-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">{t('services.filters.title')}</h3>
                {hasActiveFilters && (
                    <Button variant="outline" size="sm" onClick={clearFilters} className="h-8">
                        <X className="mr-1 h-3 w-3" />
                        {t('services.filters.clear')}
                    </Button>
                )}
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {/* Search */}
                <div className="space-y-2">
                    <Label htmlFor="search">{t('services.filters.search')}</Label>
                    <div className="relative">
                        <Search className="absolute top-2.5 left-2 h-4 w-4 text-muted-foreground" />
                        <Input
                            id="search"
                            placeholder={t('services.filters.search_placeholder')}
                            value={filters.search}
                            onChange={(e) => handleSearchChange(e.target.value)}
                            className="pl-8"
                        />
                    </div>
                </div>

                {/* Category Filter */}
                <div className="space-y-2">
                    <Label>{t('services.filters.category')}</Label>
                    <Select value={filters.category_id || 'all'} onValueChange={handleCategoryChange}>
                        <SelectTrigger>
                            <SelectValue placeholder={t('services.filters.all_categories')} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">{t('services.filters.all_categories')}</SelectItem>
                            {categories.map((category) => (
                                <SelectItem key={category.id} value={category.id}>
                                    {category.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Service Type Filter */}
                <div className="space-y-2">
                    <Label>{t('services.filters.service_type')}</Label>
                    <Select value={filters.service_type || 'all'} onValueChange={handleServiceTypeChange}>
                        <SelectTrigger>
                            <SelectValue placeholder={t('services.filters.all_types')} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">{t('services.filters.all_types')}</SelectItem>
                            {availableServiceTypes.map((type) => (
                                <SelectItem key={type.value} value={type.value}>
                                    <div className="flex items-center gap-2">
                                        <span>{type.icon}</span>
                                        <span>{type.label}</span>
                                    </div>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Status Filter */}
                <div className="space-y-2">
                    <Label>{t('services.filters.status')}</Label>
                    <Select value={filters.is_active === null ? 'all' : filters.is_active ? 'active' : 'inactive'} onValueChange={handleStatusChange}>
                        <SelectTrigger>
                            <SelectValue placeholder={t('services.filters.all_statuses')} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">{t('services.filters.all_statuses')}</SelectItem>
                            <SelectItem value="active">{t('services.filters.active')}</SelectItem>
                            <SelectItem value="inactive">{t('services.filters.inactive')}</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {!companyAllowsVideoCalls && (
                <div className="rounded-md bg-yellow-50 p-3 text-sm text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-200">
                    <p>{t('services.filters.video_calls_disabled_notice')}</p>
                </div>
            )}
        </div>
    );
}
