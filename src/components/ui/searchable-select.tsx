import React, { useState, useRef, useEffect } from 'react';
import { Input } from './input';
import { Label } from './label';
import { Search, ChevronDown, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchableSelectProps {
  label?: string;
  placeholder?: string;
  value: string;
  onValueChange: (value: string) => void;
  options: string[];
  className?: string;
  required?: boolean;
  error?: string;
}

export const SearchableSelect: React.FC<SearchableSelectProps> = ({
  label,
  placeholder = "Search...",
  value,
  onValueChange,
  options,
  className,
  required = false,
  error
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredOptions, setFilteredOptions] = useState<string[]>(options);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filter options based on search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredOptions(options);
    } else {
      const filtered = options.filter(option =>
        option.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredOptions(filtered);
    }
  }, [searchTerm, options]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle option selection
  const handleOptionSelect = (option: string) => {
    onValueChange(option);
    setIsOpen(false);
    setSearchTerm('');
  };

  // Handle input focus
  const handleInputFocus = () => {
    setIsOpen(true);
    setSearchTerm('');
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setIsOpen(true);
  };

  // Handle clear selection
  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onValueChange('');
    setSearchTerm('');
  };

  // Get display value
  const getDisplayValue = () => {
    if (value) {
      return value;
    }
    return searchTerm || '';
  };

  return (
    <div className={cn("relative", className)} ref={containerRef}>
      {label && (
        <Label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
      )}
      
      <div className="relative">
        <div className="relative">
          <Input
            ref={inputRef}
            type="text"
            placeholder={placeholder}
            value={getDisplayValue()}
            onChange={handleInputChange}
            onFocus={() => {}} // No-op to prevent dropdown opening on focus
            onClick={handleInputFocus} // Only open dropdown on click
            className={cn(
              "pr-10 cursor-pointer",
              error ? "border-red-500" : "",
              isOpen ? "ring-2 ring-blue-500 border-blue-500" : ""
            )}
            readOnly={!isOpen}
          />
          
          <div className="absolute inset-y-0 right-0 flex items-center pr-2">
            {value && (
              <button
                type="button"
                onClick={handleClear}
                className="p-1 hover:bg-gray-100 rounded mr-1"
              >
                <X className="h-4 w-4 text-gray-400" />
              </button>
            )}
            <ChevronDown 
              className={cn(
                "h-4 w-4 text-gray-400 transition-transform",
                isOpen ? "rotate-180" : ""
              )} 
            />
          </div>
        </div>

        {isOpen && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option, index) => (
                <div
                  key={index}
                  className="px-4 py-2 cursor-pointer hover:bg-gray-100 text-sm"
                  onClick={() => handleOptionSelect(option)}
                >
                  {option}
                </div>
              ))
            ) : (
              <div className="px-4 py-2 text-gray-400 text-sm">
                No options found
              </div>
            )}
          </div>
        )}
      </div>

      {error && (
        <p className="text-sm text-red-500 mt-1">{error}</p>
      )}
    </div>
  );
}; 