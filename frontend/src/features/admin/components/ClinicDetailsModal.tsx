import React, { useEffect } from 'react';

interface ClinicDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  clinic: any;
}

const ClinicDetailsModal: React.FC<ClinicDetailsModalProps> = ({
  isOpen,
  onClose,
  clinic,
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

  if (!isOpen || !clinic) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] transition-all duration-300"
        onClick={onClose}
      ></div>

      <div className="relative bg-white dark:bg-slate-900 w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in duration-300 border border-primary/10 transition-all max-h-[92vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900 sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-500/10 p-2.5 rounded-xl text-indigo-500 flex items-center justify-center">
              <span className="material-symbols-outlined font-bold">visibility</span>
            </div>
            <div>
              <h2 className="text-[20px] font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">Chi tiết phòng khám</h2>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8 space-y-8 overflow-y-auto custom-scrollbar flex-1 bg-white dark:bg-slate-900 text-left">
          {/* Hero Section with Image & Basic Info */}
          <div className="flex flex-col md:flex-row gap-8 items-start pb-8 border-b border-slate-100 dark:border-slate-800">
            <div className="w-full md:w-48 h-48 rounded-2xl overflow-hidden border-4 border-white dark:border-slate-800 shadow-xl flex-shrink-0 bg-slate-100 flex items-center justify-center">
              {clinic.image ? (
                <img src={clinic.image} alt={clinic.name} className="w-full h-full object-cover" />
              ) : (
                <span className="material-symbols-outlined text-6xl text-slate-300">home_health</span>
              )}
            </div>
            <div className="space-y-4 flex-1">
              <div className="space-y-1">
                <span className={`px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-widest text-white ${clinic.status === 'Hoạt động' ? 'bg-emerald-500' : 'bg-red-500'}`}>
                  {clinic.status}
                </span>
                <h3 className="text-3xl font-black text-slate-900 dark:text-white leading-tight">{clinic.name}</h3>
                <div className="flex items-center gap-2 text-slate-500 font-medium">
                  <span className="material-symbols-outlined text-sm">location_on</span>
                  <span className="text-sm">{clinic.address}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 pt-2">
                <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/50">
                  <p className="text-[14px] font-medium text-slate-500 mb-1">Số lượng bác sĩ</p>
                  <p className="text-xl font-black text-slate-900 dark:text-white">{clinic.doctors}</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/50">
                  <p className="text-[14px] font-medium text-slate-500 mb-1">Số lượng bệnh nhân</p>
                  <p className="text-xl font-black text-slate-900 dark:text-white">1,240</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/50">
                  <p className="text-[14px] font-medium text-slate-500 mb-1">Lượt khám tháng này</p>
                  <p className="text-xl font-black text-primary">+342</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 pt-4">
            {/* Contact Info */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 pb-2 border-l-4 border-l-indigo-500 pl-3">
                <h3 className="font-extrabold text-slate-900 dark:text-slate-100 text-sm tracking-wide lowercase first-letter:uppercase">Thông tin liên hệ</h3>
              </div>
              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 flex-shrink-0">
                    <span className="material-symbols-outlined text-[20px]">call</span>
                  </div>
                  <div>
                    <p className="text-[13px] font-medium text-slate-500 ">Số hotline</p>
                    <p className="text-[15px] font-bold text-slate-900 dark:text-white leading-tight">{clinic.phone}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 flex-shrink-0">
                    <span className="material-symbols-outlined text-[20px]">mail</span>
                  </div>
                  <div>
                    <p className="text-[13px] font-medium text-slate-500 ">Email hỗ trợ</p>
                    <p className="text-[15px] font-bold text-slate-900 dark:text-white leading-tight">support.{clinic.id.toLowerCase()}@vitality.com</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Admin Info */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 pb-2 border-l-4 border-l-emerald-500 pl-3">
                <h3 className="font-extrabold text-slate-900 dark:text-slate-100 text-sm tracking-wide lowercase first-letter:uppercase">Người quản lý trực tiếp</h3>
              </div>
              <div className="bg-emerald-50/20 dark:bg-emerald-900/10 p-6 rounded-2xl border border-emerald-500/10 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-600 flex-shrink-0">
                  <span className="material-symbols-outlined text-2xl">manage_accounts</span>
                </div>
                <div>
                  <p className="text-sm font-black text-slate-900 dark:text-white">Nguyễn Văn Quản Lý</p>
                  <p className="text-[13px] font-medium text-slate-500 italic">Quản lý cấp cao hệ thống</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-5 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3 sticky bottom-0 z-20">
          <button
            onClick={onClose}
            className="px-10 py-2.5 text-sm font-extrabold text-white bg-slate-900 dark:bg-slate-800 hover:opacity-90 rounded-xl transition-all shadow-xl active:scale-95"
            type="button"
          >
            Đóng thông tin
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClinicDetailsModal;
