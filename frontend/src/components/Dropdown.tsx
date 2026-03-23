import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

interface DropdownOption {
  label: string;
  value: string;
}

interface DropdownProps {
  options: DropdownOption[] | string[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export default function Dropdown({
  options,
  value,
  onChange,
  className = ""
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Normalize options to { label, value } objects
  const normalizedOptions: DropdownOption[] = options.map(opt => 
    typeof opt === 'string' ? { label: opt, value: opt } : opt
  );

  const selectedOption = normalizedOptions.find(opt => opt.value === value) || normalizedOptions[0];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`
          group flex items-center justify-between gap-3 px-4 py-1.5 
          w-full bg-white dark:bg-slate-800 
          border border-slate-200 dark:border-slate-700 
          rounded-xl shadow-sm hover:shadow-md 
          transition-all duration-300 ease-out
          ${isOpen ? 'ring-2 ring-primary/20 border-primary-light/40' : 'hover:border-slate-300 dark:hover:border-slate-600'}
        `}
      >
        <span className="text-[13px] font-bold text-slate-700 dark:text-slate-200 tracking-tight">
          {selectedOption?.label}
        </span>
        <ChevronDown 
          className={`
            w-3.5 h-3.5 text-slate-400 group-hover:text-primary 
            transition-transform duration-300 ease-in-out
            ${isOpen ? 'rotate-180 text-primary' : ''}
          `} 
        />
      </button>

      {/* Dropdown Menu */}
      <div 
        className={`
          absolute right-0 top-full mt-2 w-full 
          bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl
          border border-slate-200/50 dark:border-slate-700/50 
          rounded-xl shadow-2xl shadow-slate-300/40 dark:shadow-black/60
          z-[110] overflow-hidden origin-top-right
          transition-all duration-400 cubic-bezier(0.16, 1, 0.3, 1) transform
          ${isOpen 
            ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto' 
            : 'opacity-0 -translate-y-4 scale-90 pointer-events-none'
          }
        `}
      >
        <div className="p-1.5">
          {normalizedOptions.map((option) => {
            const isSelected = option.value === value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`
                  w-full flex items-center justify-between px-4 py-2 
                  text-[13px] font-bold rounded-lg transition-all duration-200
                  ${isSelected 
                    ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                    : 'text-slate-600 dark:text-slate-400 hover:bg-primary/10 hover:text-primary dark:hover:bg-primary/20 dark:hover:text-primary-light'
                  }
                `}
              >
                <span>{option.label}</span>
                {isSelected && <Check className="w-3.5 h-3.5" strokeWidth={3} />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
