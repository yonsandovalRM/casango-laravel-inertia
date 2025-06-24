import React from 'react';
import Select from 'react-select';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area'; // Asegúrate de tener esta importación correcta

interface OptionType {
  value: string;
  label: string;
}

interface SelectAutocompleteProps<T> {
  options: T[];
  value?: string | number | null | (string | number)[];
  onChange?: (value: string | number | null | (string | number)[]) => void;
  placeholder?: string;
  className?: string;
  isDisabled?: boolean;
  isLoading?: boolean;
  isClearable?: boolean;
  isSearchable?: boolean;
  getOptionValue?: (option: T) => string | number;
  getOptionLabel?: (option: T) => string;
  isMulti?: boolean;
  maxMenuHeight?: number;
}

const SelectAutocomplete = <T,>({
  options,
  value,
  onChange,
  placeholder = 'Seleccionar...',
  className,
  isDisabled = false,
  isLoading = false,
  isClearable = true,
  isSearchable = true,
  getOptionValue = (option: any) => option.id,
  getOptionLabel = (option: any) => option.name,
  isMulti = false,
  maxMenuHeight = 200,
}: SelectAutocompleteProps<T>) => {
  const transformOptions = (items: T[]): OptionType[] => {
    return items.map((item) => ({
      value: String(getOptionValue(item)),
      label: getOptionLabel(item),
    }));
  };

  const findSelectedOption = (
    currentValue: string | number | null | (string | number)[] | undefined
  ): OptionType | OptionType[] | null => {
    if (currentValue === null || currentValue === undefined) return null;
    
    if (isMulti && Array.isArray(currentValue)) {
      return currentValue.map(val => {
        const foundItem = options.find((item) => 
          String(getOptionValue(item)) === String(val)
        );
        return foundItem 
          ? { 
              value: String(getOptionValue(foundItem)), 
              label: getOptionLabel(foundItem) 
            } 
          : null;
      }).filter(Boolean) as OptionType[];
    }
    
    const foundItem = options.find((item) => 
      String(getOptionValue(item)) === String(currentValue)
    );
    
    return foundItem 
      ? { 
          value: String(getOptionValue(foundItem)), 
          label: getOptionLabel(foundItem) 
        } 
      : null;
  };

  const handleChange = (selected: any) => {
    if (!onChange) return;
    
    if (isMulti && Array.isArray(selected)) {
      onChange(selected.map(item => item.value));
    } else if (!isMulti && !Array.isArray(selected) && selected) {
      onChange(selected.value);
    } else {
      onChange(null);
    }
  };

  // Componente personalizado para el MenuList con ScrollArea
  const CustomMenuList = (props: any) => {
    return (
      <ScrollArea className="h-[200px] rounded-md border">
        {props.children}
      </ScrollArea>
    );
  };

  return (
    <Select
      options={transformOptions(options)}
      value={findSelectedOption(value)}
      onChange={handleChange}
      placeholder={placeholder}
      isDisabled={isDisabled}
      isLoading={isLoading}
      isClearable={isClearable}
      isSearchable={isSearchable}
      isMulti={isMulti}
      className="react-select-container"
      classNamePrefix="react-select"
      components={{ MenuList: CustomMenuList }}
      maxMenuHeight={maxMenuHeight}
    />
  );
};

SelectAutocomplete.displayName = 'SelectAutocomplete';

export { SelectAutocomplete };