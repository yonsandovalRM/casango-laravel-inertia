import { useAppearance } from '@/hooks/use-appearance';
import { colorSchemeDark, colorSchemeLight, themeQuartz } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import { useEffect, useState } from 'react';

const darkTheme = themeQuartz.withPart(colorSchemeDark).withParams({
    backgroundColor: 'rgb(25 26 31)',
    accentColor: 'rgb(11 12 14)',
    foregroundColor: '#fff',
    headerBackgroundColor: 'rgb(30 31 36)',
    rowHoverColor: 'rgb(30 31 36)',
});

const lightTheme = themeQuartz.withPart(colorSchemeLight).withParams({
    backgroundColor: 'rgb(255 255 255)',
    accentColor: 'rgb(11 12 14)',
    foregroundColor: 'rgb(11 12 14)',
    headerBackgroundColor: 'rgb(255 255 255)',
    rowHoverColor: 'rgb(250 250 250)',
});

export const GridView = ({ rowData, columnDefs }: { rowData: any[]; columnDefs: any[] }) => {
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        const htmlElement = document.documentElement;
        
        // Función para verificar si tiene la clase dark
        const checkDarkMode = () => {
            setIsDark(htmlElement.classList.contains('dark'));
        };
        
        // Verificar el estado inicial
        checkDarkMode();
        
        // Configurar el MutationObserver
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    checkDarkMode();
                }
            });
        });
        
        // Observar cambios en el atributo class del elemento html
        observer.observe(htmlElement, {
            attributes: true,
            attributeFilter: ['class']
        });
        
        // Limpieza al desmontar el componente
        return () => {
            observer.disconnect();
        };
    }, []);

    return (
        <div className="h-[calc(100vh-240px)] w-full ">
            <AgGridReact 
                rowData={rowData} 
                columnDefs={columnDefs as any} 
                theme={isDark ? darkTheme : lightTheme} 
                
            />
        </div>
    );
};