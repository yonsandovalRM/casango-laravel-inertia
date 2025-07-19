export const LogoIcon = ({ className }: { className?: string }) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 398.68 396.3" className={className}>
            <defs>
                <linearGradient id="gradient-primary" x1="160%" y1="30%" x2="10%" y2="100%">
                    <stop offset="30%" stopColor="#1477fb" />
                    <stop offset="100%" stopColor="#1fcff4" />
                </linearGradient>

                <linearGradient id="gradient-muted" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#fcde20" />
                    <stop offset="100%" stopColor="#ff9418" />
                </linearGradient>
            </defs>

            <g>
                <circle className="cls-1" cx="309.2" cy="277.23" r="22.58" fill="url(#gradient-muted)" />
                <path
                    className="cls-5"
                    d="M107.7,105.72c-6.64,3.58-12.7,8.1-17.99,13.37-5.36,5.36-9.94,11.48-13.57,18.19-5.89,10.94-9.24,23.44-9.24,36.73v-54.93c0-12.48,10.11-22.59,22.59-22.59,7.48,0,14.1,3.63,18.21,9.22Z"
                    fill="url(#gradient-primary)"
                />
                <path
                    className="cls-4"
                    d="M199.35,119.32c-13.96,14.02-22.59,33.35-22.59,54.69,0-17.87-14.47-32.36-32.34-32.36s-32.34,14.49-32.34,32.36v125.79h-45.18v-125.79c0-13.29,3.35-25.8,9.24-36.73,3.63-6.71,8.21-12.84,13.57-18.19,5.3-5.27,11.36-9.78,17.99-13.37,10.94-5.87,23.43-9.22,36.72-9.22,21.47,0,40.89,8.72,54.93,22.82Z"
                    fill="url(#gradient-primary)"
                />
                <path
                    className="cls-3"
                    d="M331.78,174.01v40.32c0,5.45-1.93,10.45-5.16,14.36-4.14,5.02-10.41,8.21-17.42,8.21-2.73,0-5.34-.48-7.77-1.37-3.8-1.39-7.12-3.79-9.66-6.84-3.22-3.91-5.16-8.91-5.16-14.36v-40.32c0-17.87-14.49-32.36-32.34-32.36s-32.36,14.49-32.36,32.36v125.79h-45.16v-125.79c0-21.34,8.63-40.67,22.59-54.69,14.04-14.1,33.46-22.82,54.93-22.82,42.81,0,77.5,34.71,77.5,77.52Z"
                    fill="url(#gradient-primary)"
                />
            </g>
        </svg>
    );
};
