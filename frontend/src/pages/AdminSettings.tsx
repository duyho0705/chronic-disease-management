import AdminLayout from '../layouts/AdminLayout';
import { useState } from 'react';

export default function AdminSettings() {
  const [showToast, setShowToast] = useState(false);

  const handleSave = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <AdminLayout>
      <section className="p-4 md:p-8 space-y-8 animate-in fade-in duration-700 font-display">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">Cấu hình Hệ thống</h2>
            <p className="text-[16px] text-slate-500 mt-1 font-medium">Thiết lập tham số vận hành, bảo mật và thông báo mạng lưới DamDiep.</p>
          </div>
          <button
            onClick={handleSave}
            className="bg-primary text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all text-[14px]"
          >
            Lưu cấu hình hệ thống
          </button>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">

          {/* Section 1: Vital Signs Thresholds */}
          <section className="col-span-12 lg:col-span-8 bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-sm border border-primary/5">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-xl text-primary">
                  <span className="material-symbols-outlined font-bold">vital_signs</span>
                </div>
                <h3 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">Ngưỡng cảnh báo sinh tồn</h3>
              </div>
              <button className="text-sm font-bold text-primary hover:underline uppercase">Khôi phục mặc định</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {/* Blood Pressure */}
              <div className="space-y-4">
                <label className="text-sm font-bold uppercase text-slate-400">Huyết áp (mmHg)</label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-slate-400 uppercase">Tâm thu tối đa</span>
                    <input className="w-full bg-primary/5 dark:bg-slate-800 border-none rounded-xl px-4 py-3 text-base font-bold focus:ring-2 focus:ring-primary shadow-sm outline-none" type="number" defaultValue="140" />
                  </div>
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-slate-400 uppercase">Tâm trương tối đa</span>
                    <input className="w-full bg-primary/5 dark:bg-slate-800 border-none rounded-xl px-4 py-3 text-base font-bold focus:ring-2 focus:ring-primary shadow-sm outline-none" type="number" defaultValue="90" />
                  </div>
                </div>
              </div>

              {/* Blood Sugar */}
              <div className="space-y-4">
                <label className="text-sm font-bold uppercase text-slate-400">Đường huyết (mmol/L)</label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-slate-400 uppercase">Ngưỡng thấp</span>
                    <input className="w-full bg-primary/5 dark:bg-slate-800 border-none rounded-xl px-4 py-3 text-base font-bold focus:ring-2 focus:ring-primary shadow-sm outline-none" step="0.1" type="number" defaultValue="4.0" />
                  </div>
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-slate-400 uppercase">Ngưỡng cao</span>
                    <input className="w-full bg-primary/5 dark:bg-slate-800 border-none rounded-xl px-4 py-3 text-base font-bold focus:ring-2 focus:ring-primary shadow-sm outline-none" step="0.1" type="number" defaultValue="7.8" />
                  </div>
                </div>
              </div>

              {/* Heart Rate */}
              <div className="space-y-4">
                <label className="text-sm font-bold uppercase text-slate-400">Nhịp tim (BPM)</label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-slate-400 uppercase">Tối thiểu</span>
                    <input className="w-full bg-primary/5 dark:bg-slate-800 border-none rounded-xl px-4 py-3 text-base font-bold focus:ring-2 focus:ring-primary shadow-sm outline-none" type="number" defaultValue="60" />
                  </div>
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-slate-400 uppercase">Tối đa</span>
                    <input className="w-full bg-primary/5 dark:bg-slate-800 border-none rounded-xl px-4 py-3 text-base font-bold focus:ring-2 focus:ring-primary shadow-sm outline-none" type="number" defaultValue="100" />
                  </div>
                </div>
              </div>

              {/* SpO2 */}
              <div className="space-y-4">
                <label className="text-sm font-bold uppercase text-slate-400">Oxy (SpO2 %)</label>
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-400 uppercase">Cảnh báo khi dưới</span>
                  <div className="relative">
                    <input className="w-full bg-primary/5 dark:bg-slate-800 border-none rounded-xl px-4 py-3 text-base font-bold focus:ring-2 focus:ring-primary shadow-sm outline-none" type="number" defaultValue="94" />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">%</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section 2: Password Policy */}
          <section className="col-span-12 lg:col-span-4 bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-sm border border-primary/5 flex flex-col">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-amber-500/10 rounded-xl text-amber-500">
                <span className="material-symbols-outlined font-bold">lock_reset</span>
              </div>
              <h3 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">Chính sách bảo mật</h3>
            </div>
            <div className="space-y-8 flex-1">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-base font-bold">Độ dài tối thiểu</p>
                  <p className="text-sm text-slate-500 font-medium opacity-70">Khuyến nghị: 12 ký tự</p>
                </div>
                <input className="w-16 bg-primary/5 dark:bg-slate-800 border-none rounded-xl p-2 text-center font-extrabold text-primary outline-none focus:ring-2 focus:ring-primary" type="number" defaultValue="8" />
              </div>

              <div className="space-y-4">
                {[
                  { label: "Yêu cầu ký tự đặc biệt (!@#$)", checked: true },
                  { label: "Yêu cầu chữ hoa & số", checked: true },
                  { label: "Ngăn chặn mật khẩu cũ", checked: false },
                ].map((item, idx) => (
                  <label key={idx} className="flex items-center justify-between group cursor-pointer p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl hover:bg-primary/5 transition-all">
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{item.label}</span>
                    <input defaultChecked={item.checked} className="w-5 h-5 rounded border-slate-300 text-primary focus:ring-primary cursor-pointer" type="checkbox" />
                  </label>
                ))}
              </div>

              <div className="pt-6 border-t border-primary/5">
                <p className="text-sm font-bold text-slate-400 uppercase mb-3">Đổi mật khẩu định kỳ</p>
                <select className="w-full bg-primary/5 dark:bg-slate-800 border-none rounded-xl px-4 py-3 text-base font-bold focus:ring-2 focus:ring-primary shadow-sm outline-none appearance-none cursor-pointer">
                  <option>Mỗi 30 ngày</option>
                  <option selected>Mỗi 90 ngày</option>
                  <option>Mỗi 180 ngày</option>
                  <option>Không bao giờ</option>
                </select>
              </div>
            </div>
          </section>

          {/* Section 3: Notification Toggles */}
          <section className="col-span-12 lg:col-span-7 bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-sm border border-primary/5 overflow-hidden">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-blue-500/10 rounded-xl text-blue-500">
                <span className="material-symbols-outlined font-bold">mail</span>
              </div>
              <h3 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">Cấu hình thông báo</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-primary/5">
                    <th className="pb-4 text-sm font-bold uppercase text-slate-400">Sự kiện hệ thống</th>
                    <th className="pb-4 text-sm font-bold uppercase text-slate-400 text-center">Email</th>
                    <th className="pb-4 text-sm font-bold uppercase text-slate-400 text-center">SMS</th>
                    <th className="pb-4 text-sm font-bold uppercase text-slate-400 text-center">Push</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-primary/5">
                  {[
                    { label: "Chỉ số sinh tồn xấu", sub: "Khi bệnh nhân vượt ngưỡng cảnh báo", e: true, s: true, p: true },
                    { label: "Lịch hẹn mới", sub: "Khi bệnh nhân đặt lịch online", e: true, s: false, p: true },
                    { label: "Bảo trì hệ thống", sub: "Thông báo nâng cấp server", e: true, s: false, p: true },
                  ].map((row, idx) => (
                    <tr key={idx} className="group">
                      <td className="py-6">
                        <p className="text-base font-extrabold text-slate-800 dark:text-slate-100">{row.label}</p>
                        <p className="text-sm text-slate-500 font-medium opacity-70">{row.sub}</p>
                      </td>
                      {[row.e, row.s, row.p].map((val, i) => (
                        <td key={i} className="py-6 text-center">
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" defaultChecked={val} className="sr-only peer" />
                            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-5 rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary shadow-inner transition-all"></div>
                          </label>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Section 4: General Config (Dark Theme Block) */}
          <section className="col-span-12 lg:col-span-5 bg-slate-900 text-white rounded-2xl p-8 shadow-xl shadow-slate-900/20 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-4 mb-10">
                <div className="p-3 bg-white/10 rounded-xl">
                  <span className="material-symbols-outlined text-white font-bold">tune</span>
                </div>
                <h3 className="text-2xl font-black tracking-tight text-white/90">Cấu hình chung</h3>
              </div>

              <div className="space-y-8">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-slate-400">Ngôn ngữ</label>
                    <select className="w-full bg-white/10 border-none rounded-xl px-4 py-3 text-sm font-bold text-white focus:ring-2 focus:ring-primary cursor-pointer appearance-none">
                      <option className="bg-slate-900 border-none">Tiếng Việt</option>
                      <option className="bg-slate-900 border-none">English</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-slate-400">Múi giờ</label>
                    <select className="w-full bg-white/10 border-none rounded-xl px-4 py-3 text-sm font-bold text-white focus:ring-2 focus:ring-primary cursor-pointer appearance-none">
                      <option className="bg-slate-900 border-none">(GMT+07) Hanoi</option>
                      <option className="bg-slate-900 border-none">(GMT+00) UTC</option>
                    </select>
                  </div>
                </div>

                <div className="p-6 bg-white/5 rounded-2xl border border-white/10 group">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary text-[20px] font-bold">api</span>
                      <span className="text-sm font-bold uppercase opacity-80">Quản lý API Key</span>
                    </div>
                    <button className="text-[11px] font-extrabold uppercase bg-primary text-white px-3 py-1 rounded-full shadow-lg shadow-primary/20 hover:scale-105 transition-all">Làm mới</button>
                  </div>
                  <div className="flex gap-2 items-center bg-black/20 p-3 rounded-lg">
                    <input className="flex-1 bg-transparent border-none text-primary font-mono text-sm focus:ring-0 truncate" readOnly type="password" value="sk_live_51MvR8kL6vJtE2X9_damdiep_key" />
                    <button className="p-2 hover:text-primary transition-all"><span className="material-symbols-outlined text-[18px]">content_copy</span></button>
                  </div>
                </div>

                <div className="flex items-center justify-between p-6 bg-red-500/10 rounded-2xl border border-red-500/20">
                  <div>
                    <p className="text-sm font-extrabold text-red-400 uppercase mb-1">Chế độ bảo trì</p>
                    <p className="text-[13px] text-white/60 font-medium">Khóa truy cập cho người dùng cuối</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-12 h-6 bg-white/10 rounded-full peer peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:start-[4px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-red-500 transition-all"></div>
                  </label>
                </div>
              </div>
            </div>

            <div className="mt-10 p-4 border-t border-white/5 flex group cursor-pointer hover:text-primary transition-colors">
              <span className="text-sm font-bold uppercase opacity-50 group-hover:opacity-100">Kiểm tra kết nối máy chủ</span>
              <span className="material-symbols-outlined text-[18px] ml-auto">link</span>
            </div>
          </section>
        </div>

        {/* Action Footer Mobile-friendly */}
        <div className="flex items-center justify-end gap-6 pt-10 px-4">
          <button className="text-[14px] font-bold text-slate-400 hover:text-slate-600 uppercase transition-colors">Hủy bỏ</button>
          <button
            onClick={handleSave}
            className="px-10 py-4 bg-primary text-white rounded-xl font-extrabold shadow-xl shadow-primary/20 hover:scale-[1.03] active:scale-95 transition-all text-base"
          >
            Lưu tất cả cấu hình
          </button>
        </div>

        {/* Success Toast - Doctor Style */}
        {showToast && (
          <div className="fixed bottom-10 right-10 bg-slate-900 text-white px-8 py-5 rounded-2xl shadow-2xl flex items-center gap-5 z-[200] animate-in slide-in-from-bottom-5 duration-300 border border-primary/20">
            <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/40">
              <span className="material-symbols-outlined text-white font-bold text-[20px]">check</span>
            </div>
            <div>
              <p className="font-extrabold text-[15px] tracking-tight">Đã cập nhật hệ thống!</p>
              <p className="text-[13px] text-slate-400 font-medium leading-none mt-1">Các thay đổi đã được áp dụng ngay lập tức.</p>
            </div>
            <button onClick={() => setShowToast(false)} className="ml-4 p-2 hover:bg-white/10 rounded-full transition-all">
              <span className="material-symbols-outlined text-slate-500 text-[18px]">close</span>
            </button>
          </div>
        )}
      </section>
    </AdminLayout>
  );
}
