import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

interface ClinicFilterDropdownProps {
    value: string;
    options: string[];
    onChange: (value: string) => void;
}

export default function ClinicFilterDropdown({ value, options, onChange }: ClinicFilterDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

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
        <div className="relative font-display" ref={containerRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`
                    flex items-center justify-between gap-3 transition-all duration-300
                    bg-white dark:bg-slate-800 border rounded-full shadow-sm
                    h-11 px-6 min-w-[200px]
                    ${isOpen
                        ? 'border-primary shadow-lg shadow-primary/10 ring-4 ring-primary/5'
                        : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                    }
                `}
            >
                <span className={`text-[13px] font-bold transition-colors ${isOpen ? 'text-primary' : 'text-slate-700 dark:text-slate-200'}`}>
                    {value}
                </span>
                <ChevronDown
                    className={`
                        w-4 h-4 text-slate-400 transition-transform duration-300
                        ${isOpen ? 'rotate-180 text-primary' : ''}
                    `}
                />
            </button>

            {/* Dropdown Menu */}
            <div
                className={`
                    absolute left-0 right-0 top-full mt-2
                    bg-white dark:bg-slate-800
                    border border-slate-200 dark:border-slate-700
                    rounded-[1.25rem] shadow-xl z-[110] py-1.5
                    max-h-60 overflow-y-auto custom-scrollbar
                    transition-all duration-200
                    ${isOpen
                        ? 'opacity-100 translate-y-0 pointer-events-auto'
                        : 'opacity-0 -translate-y-2 pointer-events-none'
                    }
                `}
            >
                {options.map((opt) => {
                    const isSelected = value === opt;
                    return (
                        <button
                            key={opt}
                            type="button"
                            onClick={() => {
                                onChange(opt);
                                setIsOpen(false);
                            }}
                            className={`
                                w-full flex items-center justify-between px-5 py-2.25 
                                text-[13.5px] font-medium transition-all min-h-[40px]
                                ${isSelected
                                    ? 'bg-primary/5 text-primary'
                                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'
                                }
                            `}
                        >
                            <span className="font-display">{opt}</span>
                            {isSelected && <Check className="w-4 h-4" strokeWidth={3} />}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
