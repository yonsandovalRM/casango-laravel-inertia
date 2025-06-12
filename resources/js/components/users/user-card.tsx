import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { UserResource } from '@/interfaces/user';
import { MailIcon, ShieldCheckIcon } from 'lucide-react';
import { Badge } from '../ui/badge';

export const UserCard = ({ user, actions }: { user: UserResource; actions: React.ReactNode }) => {
    return (
        <Card className="rounded-2xl border shadow-sm">
            <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between text-lg font-bold">
                    <span>{user.name}</span>
                    <Badge variant="outline" className="flex items-center gap-1">
                        <ShieldCheckIcon className="h-4 w-4" />
                        {user.role}
                    </Badge>
                </CardTitle>
            </CardHeader>

            <CardContent className="flex-1 space-y-4">
                <div className="flex justify-between gap-4 text-sm">
                    <div>
                        <p className="flex items-center gap-1 text-muted-foreground">
                            <MailIcon className="h-4 w-4" />
                            Email
                        </p>
                    </div>
                </div>
            </CardContent>

            <CardFooter className="flex justify-end gap-2 pt-2">{actions}</CardFooter>
        </Card>
    );
};
