export const AppHeaderPage = ({ title, description, actions }: { title: string; description?: string; actions?: React.ReactNode }) => {
    return (
        <div className="flex items-center justify-between border-b bg-card px-4 py-6">
            <div className="flex flex-col">
                <h1 className="text-2xl font-bold">{title}</h1>
                {description && <p className="text-sm text-muted-foreground">{description}</p>}
            </div>
            <div className="flex flex-row items-center">{actions}</div>
        </div>
    );
};
