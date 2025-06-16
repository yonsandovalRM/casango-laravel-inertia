import { CategoryResource } from '@/interfaces/category';
import { TFunction } from 'i18next';
import { Edit, Trash2 } from 'lucide-react';
import { AppHeaderPage } from '../app-header-page';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { EmptyState } from '../ui/empty-state';
import { useCategory } from './category-context';
import { FormCategory } from './form-category';

export function ManageCategory({ categories, t }: { categories: CategoryResource[]; t: TFunction }) {
    const { setCategory, setOpen, onDelete } = useCategory();

    const handleCreate = () => {
        setCategory(null);
        setOpen(true);
    };
    const handleEdit = (category: CategoryResource) => {
        setCategory(category);
        setOpen(true);
    };

    return (
        <div>
            <AppHeaderPage
                title={t('categories.title')}
                description={t('categories.description')}
                actions={<Button onClick={handleCreate}>{t('categories.manage.create')}</Button>}
            />
            <div className="flex flex-col gap-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {categories.length === 0 && (
                        <EmptyState
                            action={<Button onClick={handleCreate}>{t('categories.manage.create')}</Button>}
                            text={t('categories.manage.no_categories')}
                        />
                    )}
                    {categories.map((category) => (
                        <Card key={category.id} className="group transition-all duration-200 hover:shadow-lg">
                            <CardHeader className="pb-3">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <CardTitle className="text-lg font-semibold text-foreground transition-colors">{category.name}</CardTitle>
                                    </div>
                                    <div className="ml-2 flex items-center gap-1">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleEdit(category)}
                                            className="h-8 w-8 p-0 opacity-0 transition-opacity group-hover:opacity-100"
                                        >
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => onDelete(category.id)}
                                            className="h-8 w-8 p-0 text-destructive opacity-0 transition-opacity group-hover:opacity-100 hover:text-destructive"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </CardHeader>

                            <CardContent className="pt-0">
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <Badge variant={category.is_active ? 'default' : 'secondary'} className="text-xs">
                                            {category.is_active ? 'Activo' : 'Inactivo'}
                                        </Badge>
                                    </div>

                                    <div className="flex items-center justify-between text-sm">
                                        <div className="flex items-center gap-1 text-muted-foreground">
                                            <span className="font-medium text-foreground">{category.name}</span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
            <FormCategory />
        </div>
    );
}
