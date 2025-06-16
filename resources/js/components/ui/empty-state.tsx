export const EmptyState = ({action, text}: {action: React.ReactNode, text: string}) => {
    return (
        <div className="col-span-full flex flex-col items-center justify-center gap-4 min-h-96">
            <img src="/images/empty-box.png" alt="Empty state" className="h-36 w-36" />
            <p className="text-sm text-muted-foreground">{text}</p>
            {action}
        </div>
    );
}