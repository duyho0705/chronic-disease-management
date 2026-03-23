import React from 'react';

interface ToastProps {
  show: boolean;
  title: string;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ show, title, onClose }) => {
  if (!show) return null;

  return (
    <div className="fixed top-6 right-6 z-[300] animate-in slide-in-from-right-12 fade-in duration-500">
      <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-3xl border border-emerald-500/50 shadow-xl rounded-2xl p-0.5 overflow-hidden w-fit min-w-[260px]">
        <div className="px-5 py-3.5 flex items-center gap-3 bg-emerald-500/5">
          <div className="w-9 h-9 bg-emerald-500 text-white rounded-xl flex items-center justify-center shadow-md shadow-emerald-500/30">
            <span className="material-symbols-outlined font-extrabold text-xl">check_circle</span>
          </div>
          <div className="flex-1 text-left">
            <p className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400 tracking-tight">{title}</p>
          </div>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center text-slate-300 hover:text-emerald-500 hover:bg-emerald-500/10 rounded-full transition-all">
            <span className="material-symbols-outlined text-base">close</span>
          </button>
        </div>
        {/* Countdown Progress Bar */}
        <div className="h-1 bg-slate-100 dark:bg-slate-800 w-full overflow-hidden">
          <div className="h-full bg-emerald-500 origin-left animate-[toast-progress_3.5s_linear_forwards]"></div>
        </div>
      </div>
    </div>
  );
};

export default Toast;
