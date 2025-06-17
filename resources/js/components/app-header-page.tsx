export const AppHeaderPage = ({ title, description, actions }: { title: string; description?: string; actions?: React.ReactNode }) => {
    return (
        <div className="mb-4 flex items-center justify-between">
            <div>
                <h1 className="text-2xl font-bold">{title}</h1>
                {description && <p className="text-sm text-muted-foreground">{description}</p>}
            </div>
            {actions}
        </div>
    );
};
