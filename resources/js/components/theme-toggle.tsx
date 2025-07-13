import { Button } from '@/components/ui/button';
import { useAppearance } from '@/store/theme-store';
import { Moon, Sun } from 'lucide-react';

export const ThemeToggle = () => {
    const { appearance, updateAppearance } = useAppearance();

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={() => {
                updateAppearance(appearance === 'dark' ? 'light' : 'dark');
            }}
            className="relative h-9 w-9 rounded-full transition-all duration-300 hover:scale-110 hover:bg-accent"
        >
            <Sun className="h-4 w-4 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
            <Moon className="absolute h-4 w-4 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
            <span className="sr-only">Toggle theme</span>
        </Button>
    );
};
