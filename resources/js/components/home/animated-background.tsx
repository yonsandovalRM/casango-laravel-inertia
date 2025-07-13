const AnimatedBackground = () => {
    return (
        <div className="absolute inset-0 overflow-hidden">
            {/* Gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-purple-50/20 to-indigo-50/30 dark:from-blue-950/20 dark:via-purple-950/10 dark:to-indigo-950/20" />

            {/* Animated blobs */}
            <div className="absolute -top-40 -right-40 h-80 w-80 animate-pulse rounded-full bg-gradient-to-br from-blue-400/20 to-purple-400/20 blur-3xl" />
            <div className="absolute -bottom-40 -left-40 h-80 w-80 animate-pulse rounded-full bg-gradient-to-br from-purple-400/20 to-pink-400/20 blur-3xl delay-1000" />
            <div className="absolute top-1/2 left-1/2 h-60 w-60 -translate-x-1/2 -translate-y-1/2 animate-pulse rounded-full bg-gradient-to-br from-indigo-400/10 to-blue-400/10 blur-3xl delay-500" />

            {/* Floating particles */}
            <div className="absolute top-20 left-20 h-2 w-2 animate-bounce rounded-full bg-blue-400/60 delay-200" />
            <div className="absolute top-40 right-32 h-1 w-1 animate-bounce rounded-full bg-purple-400/60 delay-700" />
            <div className="absolute bottom-32 left-40 h-1.5 w-1.5 animate-bounce rounded-full bg-indigo-400/60 delay-1000" />
            <div className="absolute right-20 bottom-20 h-1 w-1 animate-bounce rounded-full bg-pink-400/60 delay-300" />

            {/* Grid pattern overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(59,130,246,0.1)_1px,transparent_0)] bg-[size:50px_50px] dark:bg-[radial-gradient(circle_at_1px_1px,rgba(99,102,241,0.05)_1px,transparent_0)]" />
        </div>
    );
};

export default AnimatedBackground;
