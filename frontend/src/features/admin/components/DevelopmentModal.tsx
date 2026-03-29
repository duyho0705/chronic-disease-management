import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';

interface DevelopmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  featureName?: string;
}

const DevelopmentModal: React.FC<DevelopmentModalProps> = ({
  isOpen,
  onClose,
  featureName = "Chức năng này"
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 text-left font-display">
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] transition-all duration-300"
        onClick={onClose}
      ></div>

      <div className="relative bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in duration-300 border border-primary/10 transition-all">
        {/* Header with system blue accent */}
        <div className="px-8 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-20 rounded-t-3xl">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <span className="material-symbols-outlined font-bold">construction</span>
            </div>
            <div>
              <h2 className="text-[19px] font-extrabold text-slate-900 dark:text-white leading-tight">
                Thông báo
              </h2>
            </div>
          </div>
        </div>

        {/* Development Content Area */}
        <div className="p-8 space-y-8 flex flex-col items-center text-center">
          <div className="w-24 h-24 rounded-full bg-primary/5 flex items-center justify-center relative">
            <div className="absolute inset-0 bg-primary/10 rounded-full animate-pulse"></div>
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary/20 bg-white dark:bg-slate-800 shadow-xl z-10 transition-transform hover:scale-110 duration-500">
              <span className="material-symbols-outlined text-4xl text-primary font-bold animate-bounce">rocket_launch</span>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
              Chức năng đang phát triển
            </h3>
            <p className="text-[15px] font-medium text-slate-600 dark:text-slate-400 leading-relaxed px-2">
              <span className="text-primary font-bold">{featureName}</span> hiện đang trong quá trình hoàn thiện để mang lại trải nghiệm tốt nhất. Chúng tôi sẽ thông báo cho bạn ngay khi sẵn sàng sử dụng!
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-5 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3 rounded-b-3xl">
          <button
            onClick={onClose}
            className="px-8 py-2.5 text-sm font-extrabold text-white bg-primary hover:bg-primary-dark rounded-xl transition-all shadow-lg shadow-primary/20 active:scale-95 transform"
            type="button"
          >
            Đã hiểu
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default DevelopmentModal;
