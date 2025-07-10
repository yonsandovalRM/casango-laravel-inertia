import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ProfessionalResource } from '@/interfaces/professional';
import { getInitials } from '@/lib/utils';
import { Mail } from 'lucide-react';

interface ProfessionalHeaderProps {
    professional: ProfessionalResource;
}

export const ProfessionalHeader = ({ professional }: ProfessionalHeaderProps) => {
    return (
        <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16 border-2 border-primary/20">
                <AvatarImage src={professional.photo || undefined} />
                <AvatarFallback className="bg-primary/10 text-lg font-semibold text-primary">{getInitials(professional.user.name)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
                <div className="text-lg font-bold text-foreground">
                    {professional.title} {professional.user.name}
                </div>
                <div className="mt-1 flex items-center space-x-2 text-sm text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    <span>{professional.user.email}</span>
                </div>
                {professional.specialty && (
                    <Badge variant="secondary" className="mt-2">
                        {professional.specialty}
                    </Badge>
                )}
            </div>
        </div>
    );
};
