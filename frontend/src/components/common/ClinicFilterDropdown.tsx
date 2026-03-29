import { useState } from 'react';

interface ClinicFilterDropdownProps {
    value: string;
    options: string[];
    onChange: (value: string) => void;
    minWidth?: string;
}

export default function ClinicFilterDropdown({ value, options, onChange, minWidth = '180px' }: ClinicFilterDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="bg-slate-50 dark:bg-slate-800 border-2 border-transparent hover:border-primary/20 rounded-2xl text-[14px] font-bold py-3.5 px-6 flex items-center justify-between gap-3 transition-all active:scale-95 group"
                style={{ minWidth }}
            >
                <span className="text-slate-700 dark:text-slate-200 group-hover:text-primary transition-colors">{value}</span>
                <span className={`material-symbols-outlined text-slate-400 group-hover:text-primary transition-all duration-300 ${isOpen ? 'rotate-180' : ''}`}>expand_more</span>
            </button>
            {isOpen && (
                <>
                    <div className="fixed inset-0 z-[100]" onClick={() => setIsOpen(false)}></div>
                    <div className="absolute top-full left-0 mt-2 w-full min-w-[200px] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 p-2 z-[110] animate-in fade-in slide-in-from-top-2 duration-200">
                        {options.map((opt) => (
                            <button
                                key={opt}
                                onClick={() => { onChange(opt); setIsOpen(false); }}
                                className={`w-full text-left px-4 py-2.5 rounded-xl text-[14px] font-bold transition-colors ${value === opt ? 'bg-primary/10 text-primary' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                            >
                                {opt}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
