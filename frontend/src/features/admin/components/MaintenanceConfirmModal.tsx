import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';

interface MaintenanceConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isEnabling: boolean;
}

const MaintenanceConfirmModal: React.FC<MaintenanceConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  isEnabling,
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
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 text-left font-display">
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] transition-all duration-300"
        onClick={onClose}
      ></div>

      <div className="relative bg-white dark:bg-slate-900 w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in duration-300 border border-primary/10 transition-all max-h-[90vh]">
        {/* Header section with glassmorphism like doctor */}
        <div className="px-8 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-20 rounded-t-3xl">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl flex items-center justify-center ${isEnabling ? 'bg-amber-500/10 text-amber-500' : 'bg-emerald-500/10 text-emerald-500'
              }`}>
              <span className="material-symbols-outlined font-bold">
                {isEnabling ? 'report_problem' : 'health_and_safety'}
              </span>
            </div>
            <div>
              <h2 className="text-[19px] font-extrabold text-slate-900 dark:text-white leading-tight">
                {isEnabling ? 'Xác nhận Bảo trì hệ thống' : 'Khôi phục Hoạt động'}
              </h2>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6 md:p-8 space-y-8 overflow-y-auto custom-scrollbar flex-1 text-left bg-white dark:bg-slate-900">
          <div className="flex flex-col items-center text-center space-y-4 py-4">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center relative ${isEnabling ? 'bg-amber-500/10 text-amber-500 shadow-xl shadow-amber-500/10' : 'bg-emerald-500/10 text-emerald-500 shadow-xl shadow-emerald-500/10'
              }`}>
              {isEnabling && <div className="absolute inset-0 bg-amber-500/10 rounded-full animate-ping"></div>}
              <span className="material-symbols-outlined text-[42px] font-bold relative z-10">
                {isEnabling ? 'warning' : 'task_alt'}
              </span>
            </div>
            <div className="space-y-2">
              <p className="text-[17px] font-black text-slate-800 dark:text-white leading-tight">
                {isEnabling ? 'Bạn sắp ngắt kết nối toàn bộ hệ thống?' : 'Bạn muốn mở lại quyền truy cập hệ thống?'}
              </p>
              <p className="text-[14px] font-medium text-slate-500 leading-relaxed px-4">
                {isEnabling
                  ? 'Sau khi kích hoạt, Người dùng và Bác sĩ sẽ không thể truy cập vào dữ liệu và ứng dụng cho đến khi chế độ này được tắt.'
                  : 'Hệ thống sẽ hoạt động bình thường trở lại. Mọi kết nối sẽ được khôi phục ngay lập tức cho tất cả người dùng.'
                }
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl border-l-4 bg-red-50 border-red-400 text-red-700">
            <p className="text-[14px] font-medium">
              Lưu ý: Hành động này sẽ được ghi nhận vào Nhật ký hệ thống
            </p>
          </div>
        </div>

        {/* Modal Footer - Glassmorphic like doctor but with admin button layout */}
        <div className="px-8 py-5 bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-md border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3 sticky bottom-0 z-20 transition-all rounded-b-3xl">
          <button
            onClick={onClose}
            className="px-6 py-2.5 text-sm font-bold text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all active:scale-95"
            type="button"
          >
            Hủy bỏ
          </button>
          <button
            onClick={onConfirm}
            className={`px-10 py-2.5 text-sm font-extrabold text-white rounded-xl transition-all shadow-xl flex items-center gap-2 active:scale-95 transform ${isEnabling
              ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/20'
              : 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/20'
              }`}
            type="button"
          >
            <span className="material-symbols-outlined font-bold text-[18px]">
              {isEnabling ? 'warning' : 'task_alt'}
            </span>
            {isEnabling ? 'Kích hoạt Bảo trì' : 'Khôi phục Hệ thống'}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default MaintenanceConfirmModal;
