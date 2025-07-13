import { useEffect, useState } from 'react';

export const useScrollEffect = (threshold: number = 50) => {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY;
            setIsScrolled(scrollY > threshold);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });

        // Check initial scroll position
        handleScroll();

        return () => window.removeEventListener('scroll', handleScroll);
    }, [threshold]);

    return isScrolled;
};
