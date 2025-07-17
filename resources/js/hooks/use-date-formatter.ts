import { format, isValid, Locale, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { useMemo, useState } from 'react';

type DateInput = Date | string | number;
type DateFormatPreset = 'short' | 'medium' | 'long' | 'full' | 'numeric' | 'custom';

interface UseDateFormatterOptions {
    locale?: Locale;
    preset?: DateFormatPreset;
    customFormat?: string;
}

const defaultOptions: UseDateFormatterOptions = {
    locale: es,
    preset: 'medium',
};

const formatPresets: Record<DateFormatPreset, string> = {
    short: 'dd/MM/yyyy',
    medium: 'dd MMM yyyy',
    long: "dd 'de' MMMM 'de' yyyy",
    full: "EEEE, dd 'de' MMMM 'de' yyyy",
    numeric: 'yyyy-MM-dd',
    custom: '', // Se usará customFormat cuando el preset sea 'custom'
};

export function useDateFormatter(options: UseDateFormatterOptions = {}) {
    const [formatOptions] = useState({ ...defaultOptions, ...options });

    const formatDate = useMemo(() => {
        return (date: DateInput, overrideOptions?: UseDateFormatterOptions) => {
            const mergedOptions = { ...formatOptions, ...overrideOptions };
            const { locale, preset, customFormat } = mergedOptions;

            let dateObj: Date;

            if (date instanceof Date) {
                dateObj = date;
            } else if (typeof date === 'string') {
                // Intentar parsear ISO string o formato conocido
                dateObj = parseISO(date);
                if (!isValid(dateObj)) {
                    // Si falla, probar con Date constructor
                    dateObj = new Date(date);
                }
            } else if (typeof date === 'number') {
                dateObj = new Date(date);
            } else {
                throw new Error('Invalid date input');
            }

            if (!isValid(dateObj)) {
                return 'Fecha inválida';
            }

            const formatString = preset === 'custom' ? customFormat || 'dd/MM/yyyy' : formatPresets[preset || 'medium'];

            return format(dateObj, formatString, { locale });
        };
    }, [formatOptions]);

    return { formatDate };
}

// Ejemplo de uso:
/*
function MyComponent() {
  const { formatDate } = useDateFormatter();

  return (
    <div>
      <p>Fecha corta: {formatDate('2025-02-12', { preset: 'short' })}</p>
      <p>Fecha mediana: {formatDate('2025-02-12')}</p>
      <p>Fecha larga: {formatDate('2025-02-12', { preset: 'long' })}</p>
      <p>Fecha completa: {formatDate('2025-02-12', { preset: 'full' })}</p>
      <p>Formato numérico: {formatDate('2025-02-12', { preset: 'numeric' })}</p>
      <p>Personalizado: {formatDate('2025-02-12', { preset: 'custom', customFormat: 'MMMM yyyy' })}</p>
    </div>
  );
}
*/
