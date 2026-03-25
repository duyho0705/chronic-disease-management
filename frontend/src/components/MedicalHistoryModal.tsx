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
  patientAvatar
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
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8">
      {/* Backdrop (Matching RescheduleModal) */}
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]"
        onClick={onClose}
      ></div>

      {/* Modal Content (Design from test.html) */}
      <div className="relative w-full max-w-5xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh] md:max-h-[90vh] animate-in fade-in zoom-in duration-200 border border-slate-100 dark:border-slate-800 transition-all mx-2">

        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 md:px-8 py-5 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 sticky top-0 z-10 transition-all">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
              <span className="material-symbols-outlined font-bold" style={{ fontVariationSettings: "'FILL' 1" }}>history</span>
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">Lịch sử khám bệnh</h2>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 transition-colors"
          >
            <span className="material-symbols-outlined font-bold">close</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 custom-scrollbar bg-white dark:bg-slate-900">

          {/* Patient Summary Bar (Screenshot Style) */}
          <section className="bg-slate-50/50 dark:bg-slate-800/40 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800 flex flex-col md:flex-row items-stretch transition-all min-h-[112px]">
            <div className="w-28 h-28 md:w-32 md:h-full flex-shrink-0 bg-slate-200 dark:bg-slate-700">
              <img
                src={patientAvatar || `https://i.pravatar.cc/300?u=${encodeURIComponent(patientName)}`}
                className="w-full h-full object-cover"
                alt={patientName}
              />
            </div>
            <div className="flex-1 px-8 py-4 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex flex-col">
                <h3 className="text-[22px] font-bold text-slate-900 dark:text-white leading-tight">{patientName}</h3>
                <div className="flex flex-col mt-2 text-[15px] font-medium text-slate-500 dark:text-slate-400">
                  <p>Mã bệnh nhân: <span className="font-bold">BN-2024-8892</span></p>
                  <div className="flex items-center gap-4">
                    <span>Giới tính: Nam</span>
                  </div>
                  <span>Tuổi: 58</span>
                </div>
              </div>

              <div className="flex items-center gap-8 pl-6 border-l border-slate-200 dark:border-slate-700 h-10">
                <div className="text-right">
                  <p className="text-[14px] font-medium text-slate-400 mb-0.5">Tình trạng hiện tại</p>
                  <div className="flex items-center gap-2 justify-end">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-glow shadow-emerald-500/50"></span>
                    <span className="text-[18px] font-bold text-slate-900 dark:text-white">Ổn định</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Search & Filters (Matching option font) */}
          <section className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">search</span>
              <input
                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-[15px] font-medium focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-slate-400 dark:text-white outline-none shadow-sm"
                placeholder="Tìm kiếm chẩn đoán, bác sĩ..."
                type="text"
              />
            </div>
            <div className="flex gap-3">
              <div className="relative min-w-[220px]">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">calendar_today</span>
                <input
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-[15px] font-medium text-slate-600 dark:text-slate-300 cursor-pointer shadow-sm outline-none"
                  readOnly
                  type="text"
                  value="01/01/2024 - 31/12/2024"
                />
              </div>
              <button className="h-[52px] w-[52px] bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl flex items-center justify-center hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-sm">
                <span className="material-symbols-outlined text-slate-500">filter_list</span>
              </button>
            </div>
          </section>

          {/* Table Content (No-Line Style from test.html) */}
          <section className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left border-separate border-spacing-y-3">
              <thead>
                <tr className="text-[15px] font-medium text-slate-400 px-4">
                  <th className="px-6 py-4 font-medium">Ngày khám</th>
                  <th className="px-6 py-4 font-medium">Bác sĩ phụ trách</th>
                  <th className="px-6 py-4 font-medium">Chẩn đoán</th>
                  <th className="px-6 py-4 font-medium">Hình thức</th>
                  <th className="px-6 py-4 font-medium text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="text-[15px]">
                {[
                  { date: '24/05/2024', dr: 'BS. Nguyễn Thị Y', diag: 'Tăng huyết áp cấp tính', type: 'person', typeLabel: 'Trực tiếp', statusColor: 'bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400' },
                  { date: '10/04/2024', dr: 'BS. Lê Văn Nam', diag: 'Theo dõi đái tháo đường', type: 'videocam', typeLabel: 'Trực tuyến', statusColor: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' },
                  { date: '15/02/2024', dr: 'BS. Nguyễn Thị Y', diag: 'Kiểm tra định kỳ', type: 'person', typeLabel: 'Trực tiếp', statusColor: 'bg-primary/10 text-primary dark:bg-primary/90 dark:text-white' }
                ].map((row, i) => (
                  <tr key={i} className="bg-slate-50/50 dark:bg-slate-800/40 border-b border-transparent">
                    <td className="px-6 py-5 rounded-l-3xl font-bold text-slate-700 dark:text-slate-300">{row.date}</td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center overflow-hidden border border-white dark:border-slate-800">
                          <img
                            className="w-full h-full object-cover"
                            src={`https://i.pravatar.cc/150?u=${row.dr}`}
                            alt={row.dr}
                          />
                        </div>
                        <span className="font-medium text-slate-900 dark:text-white">{row.dr}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`px-4 py-2 rounded-xl text-[15px] font-medium ${row.statusColor}`}>
                        {row.diag}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2 text-slate-500 font-medium text-[15px]">
                        <span className="material-symbols-outlined text-[20px]">{row.type}</span>
                        {row.typeLabel}
                      </div>
                    </td>
                    <td className="px-6 py-5 rounded-r-3xl text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-primary/10 text-primary transition-all shadow-sm">
                          <span className="material-symbols-outlined text-[20px] font-bold">visibility</span>
                        </button>
                        <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-primary/10 text-primary transition-all shadow-sm">
                          <span className="material-symbols-outlined text-[20px] font-bold">download</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </div>

        {/* Modal Footer */}
        <div className="px-8 md:px-10 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/40 flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Pagination */}
          <div className="flex items-center gap-2">
            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 text-slate-400 hover:bg-white dark:hover:bg-slate-800 transition-all active:scale-95 shadow-sm">
              <span className="material-symbols-outlined text-[18px]">chevron_left</span>
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-primary text-slate-900 font-medium text-[15px] shadow-sm">1</button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800 transition-all font-medium text-[15px]">2</button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800 transition-all font-medium text-[15px]">3</button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 text-slate-400 hover:bg-white dark:hover:bg-slate-800 transition-all active:scale-95 shadow-sm">
              <span className="material-symbols-outlined text-[18px]">chevron_right</span>
            </button>
          </div>

          {/* CTA */}
          <button className="w-full md:w-auto px-6 py-2.5 bg-primary text-slate-900 rounded-xl font-medium text-[15px] flex items-center justify-center gap-2.5 shadow-lg shadow-primary/20 transition-all transform">
            <span className="material-symbols-outlined text-[20px]">add_circle</span>
            Tạo lượt khám mới
          </button>
        </div>
      </div>
    </div>
  );
};

export default MedicalHistoryModal;
