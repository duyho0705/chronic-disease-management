import React, { useEffect } from 'react';

interface MedicalHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientName?: string;
  patientAvatar?: string;
}

const MedicalHistoryModal: React.FC<MedicalHistoryModalProps> = ({
  isOpen,
  onClose,
  patientName = "Nguyễn Văn A",
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

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]"
        onClick={onClose}
      ></div>
      <div className="relative bg-white dark:bg-slate-900 w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200 border border-slate-200 dark:border-slate-800">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined font-bold">history</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Lịch sử khám bệnh - {patientName}</h2>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6 flex-1 overflow-y-auto custom-scrollbar bg-white dark:bg-slate-900">
          {/* Filters */}
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex-1 min-w-[240px] relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
              <input 
                className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-primary/30 outline-none text-slate-900 dark:text-white" 
                placeholder="Tìm kiếm chẩn đoán, bác sĩ..." 
                type="text" 
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-500 font-medium whitespace-nowrap">Khoảng ngày:</span>
              <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 focus-within:ring-1 focus-within:ring-primary/30 transition-all">
                <input className="bg-transparent border-none text-xs p-0 focus:ring-0 text-slate-600 dark:text-slate-300 outline-none w-24" type="date" />
                <span className="text-slate-400">→</span>
                <input className="bg-transparent border-none text-xs p-0 focus:ring-0 text-slate-600 dark:text-slate-300 outline-none w-24" type="date" />
              </div>
            </div>
            <button className="px-4 py-2 bg-slate-900 dark:bg-slate-700 text-white rounded-xl text-sm font-bold flex items-center gap-2 hover:opacity-90 transition-opacity active:scale-95">
              <span className="material-symbols-outlined text-sm font-bold">filter_list</span>
              Lọc
            </button>
          </div>

          {/* Table */}
          <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/50">
                    <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Ngày khám</th>
                    <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Bác sĩ</th>
                    <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Chẩn đoán</th>
                    <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Hình thức</th>
                    <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-4 py-4 text-sm font-bold text-slate-700 dark:text-slate-300">25/03/2024</td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <div className="size-6 rounded-full bg-slate-200 overflow-hidden border border-slate-100 dark:border-slate-700">
                          <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCE2djEH8Ges3W-VAgDMRwfRhpjBiJ0GRq2kcgeT6bKSvPXL_dIU5f6ktogGhLfB94Hx-ZzkCX_u-rLV6tUoLUZPd1eRqhykvrQ4Jfpr7ZlAw-9nrPx27rEBFZsYPg3oFSVcC9dZdDqDsMUWtghhxZ5PH49pH6NzjqLVCu5rPvMIUUAI0oPl5HrcFyD0wascdwIzNfTAIkULhGO-Tb2wtJ150Nu8CkiD_QSB4RL5BPH4wYtPVcR7EIWrhWcdO2hj33oPXJWUqHYDj4" alt="Doctor" />
                        </div>
                        <span className="text-sm font-medium text-slate-900 dark:text-white">BS. Lê Hoàng Nam</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Viêm họng cấp</span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="px-2 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-[11px] font-bold rounded-lg whitespace-nowrap">Tại phòng khám</span>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-1.5 text-primary hover:bg-primary/10 rounded-lg transition-colors" title="Xem chi tiết">
                          <span className="material-symbols-outlined text-lg font-bold">visibility</span>
                        </button>
                        <button className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Tải PDF">
                          <span className="material-symbols-outlined text-lg font-bold">picture_as_pdf</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-4 py-4 text-sm font-bold text-slate-700 dark:text-slate-300">10/02/2024</td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <div className="size-6 rounded-full bg-slate-200 overflow-hidden border border-slate-100 dark:border-slate-700">
                          <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCE2djEH8Ges3W-VAgDMRwfRhpjBiJ0GRq2kcgeT6bKSvPXL_dIU5f6ktogGhLfB94Hx-ZzkCX_u-rLV6tUoLUZPd1eRqhykvrQ4Jfpr7ZlAw-9nrPx27rEBFZsYPg3oFSVcC9dZdDqDsMUWtghhxZ5PH49pH6NzjqLVCu5rPvMIUUAI0oPl5HrcFyD0wascdwIzNfTAIkULhGO-Tb2wtJ150Nu8CkiD_QSB4RL5BPH4wYtPVcR7EIWrhWcdO2hj33oPXJWUqHYDj4" alt="Doctor" />
                        </div>
                        <span className="text-sm font-medium text-slate-900 dark:text-white">BS. Lê Hoàng Nam</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Tăng huyết áp vô căn</span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="px-2 py-1 bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-[11px] font-bold rounded-lg whitespace-nowrap">Tư vấn từ xa</span>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-1.5 text-primary hover:bg-primary/10 rounded-lg transition-colors">
                          <span className="material-symbols-outlined text-lg font-bold">visibility</span>
                        </button>
                        <button className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                          <span className="material-symbols-outlined text-lg font-bold">picture_as_pdf</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-4 py-4 text-sm font-bold text-slate-700 dark:text-slate-300">15/12/2023</td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <div className="size-6 rounded-full bg-slate-200 overflow-hidden border border-slate-100 dark:border-slate-700">
                          <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCE2djEH8Ges3W-VAgDMRwfRhpjBiJ0GRq2kcgeT6bKSvPXL_dIU5f6ktogGhLfB94Hx-ZzkCX_u-rLV6tUoLUZPd1eRqhykvrQ4Jfpr7ZlAw-9nrPx27rEBFZsYPg3oFSVcC9dZdDqDsMUWtghhxZ5PH49pH6NzjqLVCu5rPvMIUUAI0oPl5HrcFyD0wascdwIzNfTAIkULhGO-Tb2wtJ150Nu8CkiD_QSB4RL5BPH4wYtPVcR7EIWrhWcdO2hj33oPXJWUqHYDj4" alt="Doctor" />
                        </div>
                        <span className="text-sm font-medium text-slate-900 dark:text-white">BS. Nguyễn Thu Hà</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Kiểm tra định kỳ</span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="px-2 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-[11px] font-bold rounded-lg whitespace-nowrap">Tại phòng khám</span>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-1.5 text-primary hover:bg-primary/10 rounded-lg transition-colors">
                          <span className="material-symbols-outlined text-lg font-bold">visibility</span>
                        </button>
                        <button className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                          <span className="material-symbols-outlined text-lg font-bold">picture_as_pdf</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4">
          <span className="text-xs text-slate-500 font-medium">Hiển thị 3 trên 12 lượt khám</span>
          <div className="flex gap-2 w-full sm:w-auto">
            <button 
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors active:scale-95"
            >
              Đóng
            </button>
            <button className="flex-1 sm:flex-none px-4 py-2 bg-primary text-slate-900 rounded-xl text-sm font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95">
              Tạo lượt khám mới
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #d1e5d9; border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default MedicalHistoryModal;
