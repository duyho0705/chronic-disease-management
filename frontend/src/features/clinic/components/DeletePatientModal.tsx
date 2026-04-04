import { useEffect } from 'react';
import { createPortal } from 'react-dom';

interface DeletePatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: (patientId: string) => Promise<void>;
  isDeleting: boolean;
  patientData: any;
}

export default function DeletePatientModal({
  isOpen,
  onClose,
  onDelete,
  isDeleting,
  patientData
}: DeletePatientModalProps) {
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

  if (!isOpen || !patientData) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 text-left font-display">
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] transition-all duration-300"
        onClick={onClose}
      ></div>

      <div className="relative bg-white dark:bg-slate-900 w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in duration-300 border border-red-500/10 transition-all max-h-[90vh]">
        {/* Header section */}
        <div className="px-8 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-20 rounded-t-3xl">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl flex items-center justify-center bg-red-500/10 text-red-500">
              <span className="material-symbols-outlined font-bold">
                person_off
              </span>
            </div>
            <div>
              <h2 className="text-[19px] font-extrabold text-slate-900 dark:text-white leading-tight">
                Xóa hồ sơ bệnh nhân
              </h2>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6 md:p-8 space-y-8 overflow-y-auto custom-scrollbar flex-1 text-left bg-white dark:bg-slate-900">
          <div className="flex flex-col items-center text-center space-y-4 py-4">
            <div className="w-20 h-20 rounded-full flex items-center justify-center relative bg-red-500/10 text-red-500 shadow-xl shadow-red-500/10">
              <div className="absolute inset-0 bg-red-500/10 rounded-full animate-ping"></div>
              <span className="material-symbols-outlined text-[42px] font-bold relative z-10">
                warning
              </span>
            </div>
            <div className="space-y-4 w-full">
              <p className="text-[17px] font-black text-slate-800 dark:text-white leading-tight">
                Bạn có chắc chắn muốn xóa bệnh nhân này?
              </p>

              <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700 text-left mx-auto max-w-sm">
                <p className="text-[14px] font-bold text-slate-700 dark:text-slate-300 mb-1">{patientData.name}</p>
                <p className="text-[13px] text-slate-500 font-medium">Mã hồ sơ: {patientData.id}</p>
                <p className="text-[13px] text-slate-500 font-medium">Căn bệnh: {patientData.condition}</p>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl border-l-4 bg-red-50 border-red-400 text-red-700">
            <p className="text-[14px] font-medium italic-none">
              Cảnh báo: Hành động này không thể phục hồi!
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-8 py-5 bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-md border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3 sticky bottom-0 z-20 transition-all rounded-b-3xl">
          <button
            onClick={onClose}
            className="px-6 py-2.5 text-sm font-bold text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"
            type="button"
          >
            Hủy bỏ
          </button>
          <button
            onClick={() => onDelete(patientData.dbId)}
            disabled={isDeleting}
            className="px-8 py-2.5 text-sm font-extrabold text-white rounded-xl transition-all shadow-xl flex items-center gap-2 transform bg-red-500 hover:bg-red-600 shadow-red-500/20 disabled:opacity-50"
            type="button"
          >
            {isDeleting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Đang loại bỏ...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined font-bold text-[18px]">
                  delete_forever
                </span>
                Xác nhận xóa ngay
              </>
            )}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
