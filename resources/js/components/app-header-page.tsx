export const AppHeaderPage = ({ title, description, actions }: { title: string; description?: string; actions?: React.ReactNode }) => {
    return (
        <div className="flex items-center justify-between px-6 pt-6">
            <div className="flex flex-col">
                <h1 className="font-outfit text-2xl font-bold text-primary sm:text-3xl">{title}</h1>
                {description && <p className="text-sm text-foreground">{description}</p>}
            </div>
            <div className="flex flex-row items-center">{actions}</div>
        </div>
    );
};
