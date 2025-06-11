

export const InputError = ({ error }: { error: string }) => {
    if (!error) return null;
    return <p className="text-sm text-red-500">{error}</p>;
};
