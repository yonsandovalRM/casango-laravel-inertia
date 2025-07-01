import { useCompany } from '@/hooks/use-company';

export default function BookingFooter() {
    const company = useCompany();
    console.log(company);
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
