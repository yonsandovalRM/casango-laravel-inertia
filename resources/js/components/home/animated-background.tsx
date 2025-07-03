const AnimatedBackground = () => {
    return (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
            {/* Forma circular grande */}
            <div
                className="absolute -top-20 -right-20 h-80 w-80 rotate-45 transform animate-pulse rounded-full bg-gradient-to-br from-blue-400/20 to-purple-400/20 transition-all duration-[8000ms] ease-in-out hover:scale-110"
                style={{
                    animation: 'float 8s ease-in-out infinite, morph 12s ease-in-out infinite',
                }}
            />

            {/* Forma oval flotante */}
            <div
                className="absolute top-1/4 -left-32 h-96 w-64 -rotate-12 transform rounded-[50%] bg-gradient-to-t from-cyan-300/15 to-blue-400/15 transition-all duration-[10000ms] ease-in-out"
                style={{
                    animation: 'float 10s ease-in-out infinite reverse, stretch 15s ease-in-out infinite',
                }}
            />

            {/* Forma romboidal */}
            <div
                className="absolute right-1/4 bottom-1/4 h-48 w-48 rotate-45 transform bg-gradient-to-bl from-indigo-400/20 to-blue-500/20 transition-all duration-[12000ms] ease-in-out"
                style={{
                    animation: 'float 12s ease-in-out infinite, rotate 20s linear infinite',
                }}
            />

            {/* Forma elíptica pequeña */}
            <div
                className="absolute top-1/2 right-1/3 h-64 w-32 rotate-12 transform rounded-full bg-gradient-to-r from-blue-300/10 to-purple-300/10 transition-all duration-[9000ms] ease-in-out"
                style={{
                    animation: 'float 9s ease-in-out infinite, pulse 6s ease-in-out infinite',
                }}
            />

            {/* Forma triangular */}
            <div
                className="absolute bottom-10 left-1/4 h-0 w-0 transition-all duration-[11000ms] ease-in-out"
                style={{
                    borderLeft: '60px solid transparent',
                    borderRight: '60px solid transparent',
                    borderBottom: '100px solid rgba(59, 130, 246, 0.1)',
                    animation: 'float 11s ease-in-out infinite, triangle-morph 14s ease-in-out infinite',
                }}
            />

            {/* Forma circular mediana */}
            <div
                className="absolute top-10 left-1/3 h-40 w-40 rounded-full bg-gradient-to-tr from-blue-200/15 to-cyan-200/15 transition-all duration-[7000ms] ease-in-out"
                style={{
                    animation: 'float 7s ease-in-out infinite reverse, scale-pulse 8s ease-in-out infinite',
                }}
            />

            <style>{`
                @keyframes float {
                    0%,
                    100% {
                        transform: translateY(0px) rotate(0deg);
                    }
                    50% {
                        transform: translateY(-20px) rotate(5deg);
                    }
                }

                @keyframes morph {
                    0%,
                    100% {
                        border-radius: 50%;
                        transform: scale(1) rotate(0deg);
                    }
                    25% {
                        border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
                        transform: scale(1.1) rotate(90deg);
                    }
                    50% {
                        border-radius: 50% 50% 20% 80% / 25% 75% 25% 75%;
                        transform: scale(0.9) rotate(180deg);
                    }
                    75% {
                        border-radius: 80% 20% 50% 50% / 75% 25% 75% 25%;
                        transform: scale(1.05) rotate(270deg);
                    }
                }

                @keyframes stretch {
                    0%,
                    100% {
                        transform: scaleY(1) scaleX(1) rotate(-12deg);
                    }
                    50% {
                        transform: scaleY(1.3) scaleX(0.8) rotate(-18deg);
                    }
                }

                @keyframes rotate {
                    0% {
                        transform: rotate(45deg);
                    }
                    100% {
                        transform: rotate(405deg);
                    }
                }

                @keyframes pulse {
                    0%,
                    100% {
                        opacity: 0.1;
                        transform: scale(1);
                    }
                    50% {
                        opacity: 0.2;
                        transform: scale(1.1);
                    }
                }

                @keyframes triangle-morph {
                    0%,
                    100% {
                        border-left-width: 60px;
                        border-right-width: 60px;
                        border-bottom-width: 100px;
                    }
                    50% {
                        border-left-width: 80px;
                        border-right-width: 40px;
                        border-bottom-width: 120px;
                    }
                }

                @keyframes scale-pulse {
                    0%,
                    100% {
                        transform: scale(1);
                    }
                    50% {
                        transform: scale(1.2);
                    }
                }
            `}</style>
        </div>
    );
};

export default AnimatedBackground;
