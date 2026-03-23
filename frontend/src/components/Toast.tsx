import React from 'react';

interface ToastProps {
  show: boolean;
  title: string;
  type?: 'success' | 'error' | 'warning';
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ show, title, type = 'success', onClose }) => {
  React.useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) return null;

  const config = {
    success: {
      bg: 'bg-emerald-500/5',
      border: 'border-emerald-500/50',
      iconBg: 'bg-emerald-500',
      icon: 'check_circle',
      text: 'text-emerald-600 dark:text-emerald-400',
      progress: 'bg-emerald-500'
    },
    error: {
      bg: 'bg-red-500/5',
      border: 'border-red-500/50',
      iconBg: 'bg-red-500',
      icon: 'error',
      text: 'text-red-600 dark:text-red-400',
      progress: 'bg-red-500'
    },
    warning: {
      bg: 'bg-amber-500/5',
      border: 'border-amber-500/50',
      iconBg: 'bg-amber-500',
      icon: 'warning',
      text: 'text-amber-600 dark:text-amber-400',
      progress: 'bg-amber-500'
    }
  }[type];

  return (
    <div className="fixed top-6 right-6 z-[300] animate-in slide-in-from-right-12 fade-in duration-500">
      <div className={`bg-white/95 dark:bg-slate-900/95 backdrop-blur-3xl border ${config.border} shadow-xl rounded-2xl p-0.5 overflow-hidden w-fit min-w-[280px]`}>
        <div className={`px-5 py-3.5 flex items-center gap-3 ${config.bg}`}>
          <div className={`w-9 h-9 ${config.iconBg} text-white rounded-xl flex items-center justify-center shadow-md shadow-slate-200/50`}>
            <span className="material-symbols-outlined font-extrabold text-xl">{config.icon}</span>
          </div>
          <div className="flex-1 text-left">
            <p className={`text-[15px] font-bold ${config.text} tracking-tight`}>{title}</p>
          </div>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center text-slate-300 hover:text-primary hover:bg-primary/10 rounded-full transition-all">
            <span className="material-symbols-outlined text-base">close</span>
          </button>
        </div>
        {/* Countdown Progress Bar */}
        <div className="h-1 bg-slate-100 dark:bg-slate-800 w-full overflow-hidden">
          <div className={`h-full ${config.progress} origin-left animate-[toast-progress_3.5s_linear_forwards]`}></div>
        </div>
      </div>
      <style>{`
        @keyframes toast-progress {
          from { transform: scaleX(1); }
          to { transform: scaleX(0); }
        }
      `}</style>
    </div>
  );
};

export default Toast;
