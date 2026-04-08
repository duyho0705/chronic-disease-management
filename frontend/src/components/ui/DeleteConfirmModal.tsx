import React from 'react';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  isLoading?: boolean;
}

const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  isLoading = false
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 font-display">
      {/* Backdrop - Identical to EditUserModal */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] transition-all duration-300 pointer-events-auto"
        onClick={onClose}
      ></div>
      
      {/* Modal Content - Structured like EditUserModal but for small width */}
      <div className="relative bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in duration-300 border border-red-500/10 transition-all z-10">
        
        {/* Modal Header - Red themed to match EditUserModal structure */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900 sticky top-0 z-20 text-left">
          <div className="flex items-center gap-3">
            <div className="bg-red-500/10 p-2.5 rounded-xl text-red-500 flex items-center justify-center">
              <span className="material-symbols-outlined font-bold">delete_sweep</span>
            </div>
            <div>
              <h2 className="text-[18px] font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">{title}</h2>
              <p className="text-slate-400 font-bold text-[11px] mt-0.5 uppercase tracking-wider">Hành động nguy hiểm</p>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-8 text-left">
          <div className="p-5 bg-red-50/30 dark:bg-red-900/10 rounded-2xl border border-red-500/5">
            <p className="text-[15px] text-slate-600 dark:text-slate-300 font-bold leading-relaxed">
              {description}
            </p>
          </div>
        </div>

        {/* Modal Footer - Styled like EditUserModal */}
        <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3 bg-slate-50/50 dark:bg-slate-900/50 sticky bottom-0 z-20">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-6 py-2.5 text-sm font-bold text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"
            type="button"
          >
            Hủy bỏ
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="px-8 py-2.5 text-sm font-extrabold text-white bg-red-500 hover:bg-red-600 rounded-xl transition-all shadow-xl shadow-red-500/20 flex items-center gap-2 disabled:opacity-50"
            type="button"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              "Xác nhận xóa"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
