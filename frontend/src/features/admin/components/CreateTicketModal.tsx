import { useState } from 'react';

interface CreateTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  isSaving: boolean;
}

export default function CreateTicketModal({ isOpen, onClose, onSave, isSaving }: CreateTicketModalProps) {
  const [formData, setFormData] = useState({
    subject: '',
    category: 'Kỹ thuật',
    priority: 'Trung bình',
    message: ''
  });

  const categories = ['Kỹ thuật', 'Hỗ trợ nghiệp vụ', 'Hạ tầng', 'Hệ thống', 'Yêu cầu tính năng', 'Khác'];
  const priorities = ['Khẩn cấp', 'Cao', 'Trung bình', 'Thấp'];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] transition-all duration-300" onClick={onClose}></div>
      
      <div className="relative bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in duration-300 border border-primary/10 transition-all">
        {/* Modal Header */}
        <div className="px-8 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900 sticky top-0 z-20 transition-all">
          <div className="flex items-center gap-4">
            <div className="bg-emerald-500/10 p-2.5 rounded-xl text-emerald-500 flex items-center justify-center">
              <span className="material-symbols-outlined font-bold">add_task</span>
            </div>
            <div>
              <h2 className="text-[19px] font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">Tạo yêu cầu hỗ trợ mới</h2>
              <p className="text-[13px] font-bold text-slate-400 mt-0.5">Vui lòng mô tả chi tiết vấn đề bạn đang gặp phải.</p>
            </div>
          </div>
          <button onClick={onClose} className="w-10 h-10 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 flex items-center justify-center transition-colors">
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-8 space-y-6 overflow-y-auto max-h-[75vh] custom-scrollbar bg-white dark:bg-slate-900 text-left">
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[14px] font-bold text-slate-500 ml-1">Tiêu đề yêu cầu</label>
              <input 
                type="text" 
                placeholder="Ví dụ: Lỗi không xuất được báo cáo..."
                className="w-full px-5 py-3.5 rounded-2xl border-2 border-slate-50 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-[14px] font-bold text-slate-700 dark:text-slate-200 focus:border-emerald-500 outline-none transition-all"
                value={formData.subject}
                onChange={(e) => setFormData({...formData, subject: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-[14px] font-bold text-slate-500 ml-1">Danh mục</label>
                <select 
                  className="w-full px-5 py-3.5 rounded-2xl border-2 border-slate-50 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-[14px] font-bold text-slate-700 dark:text-slate-200 focus:border-emerald-500 outline-none transition-all appearance-none cursor-pointer"
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                >
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[14px] font-bold text-slate-500 ml-1">Độ ưu tiên</label>
                <select 
                  className="w-full px-5 py-3.5 rounded-2xl border-2 border-slate-50 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-[14px] font-bold text-slate-700 dark:text-slate-200 focus:border-emerald-500 outline-none transition-all appearance-none cursor-pointer"
                  value={formData.priority}
                  onChange={(e) => setFormData({...formData, priority: e.target.value})}
                >
                  {priorities.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[14px] font-bold text-slate-500 ml-1">Nội dung chi tiết</label>
              <textarea 
                rows={4}
                placeholder="Mô tả cụ thể vấn đề hoặc yêu cầu tính năng..."
                className="w-full px-5 py-3.5 rounded-2xl border-2 border-slate-50 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-[14px] font-bold text-slate-700 dark:text-slate-200 focus:border-emerald-500 outline-none transition-all resize-none"
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
              ></textarea>
            </div>
          </div>

          <div className="p-4 bg-emerald-50 dark:bg-emerald-900/10 rounded-2xl border border-emerald-100 dark:border-emerald-900/20">
            <p className="text-[13px] text-emerald-700 dark:text-emerald-400 font-medium leading-relaxed">
              <span className="font-bold">Lưu ý:</span> Yêu cầu khẩn cấp sẽ được đội ngũ kỹ thuật phản hồi trong vòng tối đa 15 phút. Vui lòng đính kèm hình ảnh lỗi nếu có để được xử lý nhanh nhất.
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-8 py-5 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3 sticky bottom-0 z-20 transition-all">
          <button
            onClick={onClose}
            className="px-6 py-2.5 text-sm font-bold text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"
          >
            Hủy bỏ
          </button>
          <button
            onClick={() => onSave(formData)}
            disabled={isSaving || !formData.subject || !formData.message}
            className="px-8 py-2.5 text-sm font-extrabold text-white bg-emerald-500 disabled:bg-slate-300 rounded-xl transition-all flex items-center gap-2"
          >
            {isSaving ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                Đang gửi...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-lg">send</span>
                Gửi yêu cầu
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
