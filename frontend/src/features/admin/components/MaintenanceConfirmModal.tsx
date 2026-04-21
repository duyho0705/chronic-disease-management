import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';

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

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 text-left font-display">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-900/10 backdrop-blur-[2px]"
            onClick={onClose}
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative bg-white dark:bg-slate-900 w-full max-w-xl rounded-[32px] shadow-2xl overflow-hidden flex flex-col border border-primary/10 transition-all max-h-[90vh]"
          >
            {/* Header */}
            <div className="px-8 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-white/95 dark:bg-slate-900/95 backdrop-blur-md sticky top-0 z-20">
              <div>
                <h2 className="text-[20px] font-medium text-slate-900 dark:text-white leading-tight">
                  {isEnabling ? 'Thiết lập Bảo trì hệ thống' : 'Khôi phục Hoạt động'}
                </h2>
                <p className={`text-[11px] font-bold mt-1 uppercase tracking-wider ${isEnabling ? 'text-amber-500' : 'text-emerald-500'}`}>
                  {isEnabling ? 'Hành động can thiệp' : 'Hành động khôi phục'}
                </p>
              </div>
            </div>

            {/* Content Area */}
            <div className="p-6 md:p-8 space-y-6 overflow-y-auto custom-scrollbar flex-1 text-left bg-white dark:bg-slate-900">
              <div className="flex flex-col items-center text-center space-y-4 py-2">
                <div className={`w-20 h-20 rounded-full flex items-center justify-center relative ${isEnabling ? 'bg-amber-500/10 text-amber-500' : 'bg-emerald-500/10 text-emerald-500'
                  }`}>
                  {isEnabling && <div className="absolute inset-0 bg-amber-500/10 rounded-full animate-ping opacity-20"></div>}
                  <span className="material-symbols-outlined text-[42px] font-bold relative z-10">
                    {isEnabling ? 'construction' : 'verified_user'}
                  </span>
                </div>
                <div className="space-y-2">
                  <p className="text-[17px] font-bold text-slate-800 dark:text-white leading-tight px-4">
                    {isEnabling ? 'Bạn có chắc muốn ngắt kết nối toàn hệ thống?' : 'Bạn muốn mở lại quyền truy cập hệ thống?'}
                  </p>
                  <p className="text-[14px] font-medium text-slate-500 leading-relaxed px-6">
                    {isEnabling
                      ? 'Sau khi kích hoạt, Người dùng và Bác sĩ sẽ không thể truy cập vào dữ liệu cho đến khi chế độ bảo trì được tắt.'
                      : 'Hệ thống sẽ hoạt động bình thường trở lại. Mọi kết nối sẽ được khôi phục ngay lập tức cho toàn bộ người dùng.'
                    }
                  </p>
                </div>
              </div>

              <div className={`p-4 rounded-2xl border-l-[4px] ${isEnabling ? 'bg-amber-50 border-amber-400 text-amber-700' : 'bg-emerald-50 border-emerald-400 text-emerald-700'}`}>
                <p className="text-[13px] font-medium">
                  Lưu ý: Hành động này sẽ được ghi nhận chi tiết vào Nhật ký nhật ký hệ thống.
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-8 py-5 bg-slate-50/50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3 sticky bottom-0 z-20">
              <button
                onClick={onClose}
                className="px-6 py-2.5 text-sm font-bold text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"
                type="button"
              >
                Hủy bỏ
              </button>
              <button
                onClick={onConfirm}
                className={`px-8 py-2.5 text-sm font-extrabold text-white rounded-2xl transition-all shadow-xl flex items-center gap-2 active:scale-95 ${isEnabling
                  ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/30'
                  : 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/30'
                  }`}
                type="button"
              >
                <span className="material-symbols-outlined text-[20px]">
                  {isEnabling ? 'settings_suggest' : 'power_settings_new'}
                </span>
                {isEnabling ? 'Kích hoạt Bảo trì' : 'Khôi phục Hệ thống'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default MaintenanceConfirmModal;
