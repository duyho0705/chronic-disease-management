import { useEffect } from 'react';
import { createPortal } from 'react-dom';

interface CancelAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isCancelling: boolean;
  appointmentData: any;
}

export default function CancelAppointmentModal({
  isOpen,
  onClose,
  onConfirm,
  isCancelling,
  appointmentData
}: CancelAppointmentModalProps) {

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

  if (!isOpen || !appointmentData) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 text-left font-display">
      <div
        className="absolute inset-0 bg-slate-900/10 backdrop-blur-[2px] transition-all duration-300"
        onClick={onClose}
      ></div>

      <div className="relative bg-white dark:bg-slate-900 w-full max-w-[500px] rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in duration-300 border border-slate-200 dark:border-slate-800 transition-all max-h-[95vh]">
        <div className="px-6 md:px-8 py-5 flex items-center justify-between sticky top-0 bg-white dark:bg-slate-900 z-20 rounded-t-3xl">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white leading-tight italic-none">
            Hủy lịch hẹn
          </h2>
        </div>

        <div className="px-6 md:px-8 pb-6 space-y-6 overflow-y-auto custom-scrollbar flex-1 text-left bg-white dark:bg-slate-900">
          <div className="pt-6 space-y-4">
            <p className="text-[15px] font-medium text-slate-600 dark:text-slate-400 leading-relaxed italic-none">
              Bạn có chắc chắn muốn hủy lịch hẹn của bệnh nhân <span className="font-bold text-slate-900 dark:text-slate-200">{appointmentData.patientName}</span> vào lúc <span className="font-bold text-slate-900 dark:text-slate-200">{appointmentData.time}</span> ngày <span className="font-bold text-slate-900 dark:text-slate-200">{appointmentData.date}</span> không?
            </p>
          </div>

          <div className="p-4 bg-orange-50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-900/20 rounded-xl flex items-center gap-3 font-display">
            <span className="material-symbols-outlined text-orange-500 text-[20px]">warning</span>
            <p className="text-[14px] font-medium text-orange-600 dark:text-orange-400 italic-none mb-0">
              Lịch hẹn đã hủy sẽ không thể khôi phục lại.
            </p>
          </div>
        </div>

        <div className="px-6 md:px-8 py-5 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between sticky bottom-0 z-20 rounded-b-3xl">
          <button
            onClick={onClose}
            className="px-6 py-2.5 text-sm font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition-all"
            type="button"
          >
            Đóng
          </button>
          <button
            onClick={onConfirm}
            disabled={isCancelling}
            className="px-8 py-2.5 text-sm font-bold text-white rounded-xl transition-all shadow-md flex items-center gap-2 bg-red-500 hover:bg-red-600 shadow-red-500/20"
            type="button"
          >
            {isCancelling ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Đang xử lý...
              </>
            ) : (
              'Xác nhận hủy'
            )}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
