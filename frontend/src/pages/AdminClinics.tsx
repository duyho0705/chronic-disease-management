import { useState } from 'react';
import AdminLayout from '../layouts/AdminLayout';

export default function AdminClinics() {
  const [regionFilter, setRegionFilter] = useState('Tất cả khu vực');
  const [statusFilter, setStatusFilter] = useState('Tất cả trạng thái');

  return (
    <AdminLayout>
      <section className="p-4 md:p-8 space-y-6 md:space-y-8">
        {/* Header Section - Synchronized with Doctor UI */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">Quản lý mạng lưới cơ sở</h2>
            <p className="text-sm text-slate-500 mt-1 font-medium opacity-70">Cấu hình và theo dõi hiệu suất toàn hệ thống Vitality DamDiep.</p>
          </div>
          <button className="bg-primary text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-primary/20 text-[14px]">
            <span className="material-symbols-outlined font-bold">add</span>
            Thêm Phòng khám mới
          </button>
        </div>

        {/* Filter Bar */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 flex flex-wrap gap-6 items-center shadow-sm border border-primary/5">
          <div className="flex flex-col gap-1 min-w-[200px]">
            <label className="text-[11px] uppercase font-bold text-slate-400 tracking-widest ml-1">Khu vực</label>
            <select 
              value={regionFilter}
              onChange={(e) => setRegionFilter(e.target.value)}
              className="bg-primary/5 dark:bg-slate-800 border-none rounded-xl text-[14px] font-bold py-2.5 px-4 focus:ring-2 focus:ring-primary/20 transition-all outline-none italic-none"
            >
              <option>Tất cả khu vực</option>
              <option>Miền Bắc</option>
              <option>Miền Trung</option>
              <option>Miền Nam</option>
            </select>
          </div>
          <div className="flex flex-col gap-1 min-w-[200px]">
            <label className="text-[11px] uppercase font-bold text-slate-400 tracking-widest ml-1">Trạng thái</label>
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-primary/5 dark:bg-slate-800 border-none rounded-xl text-[14px] font-bold py-2.5 px-4 focus:ring-2 focus:ring-primary/20 transition-all outline-none italic-none"
            >
              <option>Tất cả trạng thái</option>
              <option>Đang hoạt động</option>
              <option>Tạm dừng</option>
            </select>
          </div>
          <button className="mt-5 text-primary font-bold text-[14px] px-6 py-2.5 hover:bg-primary/5 rounded-xl transition-all">Đặt lại lọc</button>
        </div>

        {/* Clinic Cards - Using Doctor Page Styling */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          {/* Featured Clinic Card */}
          <div className="xl:col-span-8 bg-white dark:bg-slate-900 rounded-2xl p-8 relative overflow-hidden group shadow-sm border border-primary/10">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-50"></div>
            
            <div className="relative z-10">
              <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">
                <div className="flex gap-5">
                  <div className="w-20 h-20 rounded-xl bg-primary/5 flex items-center justify-center text-primary shrink-0 border border-primary/10 overflow-hidden">
                    <img 
                      alt="Clinic" 
                      className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500 hover:scale-110" 
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuA3kZBMSp6LgYmVrcMcCocw4oqLOcrCTMTb1OdhdK3C8F7Og-N0nH6BklExSvolTx-O2nHMRV68tv5f-ulgsznVoZMj0RSdErDuVCneOJL8njKFinK7dsuproCjujY20-dPT91rWNHnyfQfGoxbxy74GYDyFHPfLXtSO-xVwrzXFuKxogFG6YjVKmq4kueiVDbybp8wGJaGc1SqpBZ6WYbx4A9yrSlmr6UYrj8IDvjonMJ-aAe4LcvWjahfKRd18_2iMJo52FRZWAk"
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">Cơ sở Đa khoa Quận 1</h3>
                    <p className="text-sm text-slate-500 font-medium flex items-center gap-1.5 mt-1.5 opacity-80 leading-relaxed">
                      <span className="material-symbols-outlined text-primary text-[18px]">location_on</span>
                      123 Lê Lợi, Phường Bến Thành, Quận 1, TP. HCM
                    </p>
                  </div>
                </div>
                <span className="px-5 py-2 rounded-full bg-emerald-500 text-white text-sm font-bold shadow-sm whitespace-nowrap inline-flex">Đang hoạt động</span>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10 p-5 bg-primary/[0.03] dark:bg-slate-800/20 rounded-xl border border-primary/5">
                <div>
                  <p className="text-xs uppercase tracking-widest font-bold text-slate-400 mb-1">Người quản trị</p>
                  <p className="text-base font-bold text-slate-900 dark:text-white">BS. Nguyễn Văn An</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest font-bold text-slate-400 mb-1">Đội ngũ Bác sĩ</p>
                  <p className="text-base font-bold text-slate-900 dark:text-white">24 Chuyên khoa</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest font-bold text-slate-400 mb-1">Dữ liệu hồ sơ</p>
                  <p className="text-base font-bold text-slate-900 dark:text-white">1,240 Bệnh nhân</p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <button className="flex-1 bg-primary text-white py-3 rounded-xl text-[14px] font-bold transition-all hover:bg-primary/90 flex items-center justify-center gap-2 group shadow-lg shadow-primary/20">
                  <span className="material-symbols-outlined text-xl group-hover:scale-110 transition-transform">visibility</span>
                  Quản lý chi tiết
                </button>
                <button className="flex-1 bg-white dark:bg-slate-800 border border-primary/10 py-3 rounded-xl text-[14px] font-bold text-slate-700 dark:text-slate-200 transition-all hover:bg-slate-50 flex items-center justify-center gap-2 group">
                  <span className="material-symbols-outlined text-xl group-hover:rotate-12 transition-transform">edit</span>
                  Cấu hình mạng lưới
                </button>
                <button className="w-12 bg-primary/5 hover:bg-primary/10 hover:text-primary rounded-xl transition-all flex items-center justify-center text-slate-400">
                  <span className="material-symbols-outlined">more_vert</span>
                </button>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="xl:col-span-4 bg-primary/5 dark:bg-slate-900 rounded-2xl p-8 border border-primary/10 flex flex-col justify-between shadow-sm">
            <div>
              <h4 className="text-[16px] font-extrabold text-slate-900 dark:text-white mb-8 flex items-center gap-2 uppercase tracking-wide">
                <span className="material-symbols-outlined text-primary text-xl">insights</span>
                Thống kê tháng này
              </h4>
              <div className="space-y-8">
                <div>
                  <div className="flex justify-between text-[13px] font-bold text-slate-600 dark:text-slate-400 mb-2">
                    <span>Lượt thăm khám mới</span>
                    <span className="text-emerald-500">+12%</span>
                  </div>
                  <div className="h-2 bg-white dark:bg-slate-800 rounded-full overflow-hidden shadow-inner ring-1 ring-primary/5">
                    <div className="h-full bg-primary w-[75%] rounded-full shadow-[0_0_10px_rgba(59,185,243,0.3)]"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[13px] font-bold text-slate-600 dark:text-slate-400 mb-2">
                    <span>Hài lòng bệnh nhân</span>
                    <span className="text-primary font-extrabold">4.8/5</span>
                  </div>
                  <div className="h-2 bg-white dark:bg-slate-800 rounded-full overflow-hidden shadow-inner ring-1 ring-primary/5">
                    <div className="h-full bg-emerald-500 w-[92%] rounded-full shadow-[0_0_10px_rgba(16,185,129,0.3)]"></div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-12 pt-8 border-t border-primary/10">
              <p className="text-[13px] text-slate-500 font-medium leading-relaxed italic opacity-80">
                Hiệu suất tại cơ sở Quận 1 tiếp tục thuộc nhóm dẫn đầu mạng lưới toàn quốc.
              </p>
              <div className="mt-8 h-20 w-full bg-primary/5 rounded-xl relative overflow-hidden">
                <svg className="absolute bottom-0 w-full h-12" preserveAspectRatio="none" viewBox="0 0 100 20">
                  <path className="text-primary/10" d="M0 20 V10 Q25 0 50 10 T100 5 V20 Z" fill="currentColor"></path>
                </svg>
              </div>
            </div>
          </div>

          {/* Grid of Clinics */}
          <div className="xl:col-span-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-4">
            {[
              { name: "Nha khoa Vitality Pearl", loc: "45 Thảo Điền, Quận 2, TP. HCM", icon: "health_and_safety", status: "Bận", statusColor: "amber", docs: "8", patients: "450" },
              { name: "Xét nghiệm Vitality Lab", loc: "210 Trần Hưng Đạo, Quận 5", icon: "biotech", status: "Hoạt động", statusColor: "emerald", docs: "15", patients: "200+" },
              { name: "Nhi khoa Vitality Kids", loc: "88 Nguyễn Cơ Thạch, Quận 2", icon: "child_care", status: "Hoạt động", statusColor: "emerald", docs: "12", patients: "890" }
            ].map((item, idx) => (
              <div key={idx} className="bg-white dark:bg-slate-900 border border-primary/5 p-6 rounded-2xl hover:border-primary/30 transition-all group hover:shadow-xl hover:shadow-primary/5">
                <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center text-primary border border-primary/10 group-hover:rotate-6 transition-transform">
                    <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>{item.icon}</span>
                  </div>
                  <span className={`px-4 py-1.5 rounded-full text-white text-[13px] font-bold shadow-sm whitespace-nowrap inline-flex ${
                    item.statusColor === 'emerald' ? 'bg-emerald-500' : 'bg-amber-500'
                  }`}>
                    {item.status}
                  </span>
                </div>
                <h4 className="font-extrabold text-slate-900 dark:text-white text-[16px] mb-1.5 tracking-tight group-hover:text-primary transition-colors">{item.name}</h4>
                <p className="text-[13px] text-slate-400 font-medium line-clamp-1 mb-6 opacity-80">{item.loc}</p>
                
                <div className="flex items-center justify-between text-[13px] font-bold py-4 border-t border-primary/5">
                  <div className="flex items-center gap-1.5 text-slate-500">
                    <span className="material-symbols-outlined text-xl opacity-40">person</span>
                    Bác sĩ: {item.docs}
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-500">
                    <span className="material-symbols-outlined text-xl opacity-40">groups</span>
                    BN: {item.patients}
                  </div>
                </div>
                
                <div className="flex gap-2.5 mt-6 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all">
                  <button className="flex-1 bg-slate-900 text-white dark:bg-white dark:text-slate-900 py-2.5 rounded-xl text-[13px] font-bold shadow-lg hover:scale-[1.03] transition-transform">Chi tiết cơ sở</button>
                  <button className="w-12 h-10 bg-primary/5 dark:bg-slate-800 rounded-xl flex items-center justify-center hover:bg-primary/20 text-primary transition-colors border border-primary/10">
                    <span className="material-symbols-outlined text-xl">settings</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Center - Small Footer Style */}
        <div className="mt-16 border-t border-primary/10 pt-10 flex flex-col items-center">
          <button className="group flex items-center gap-3 px-10 py-3.5 rounded-full border-2 border-primary/20 text-slate-600 dark:text-slate-400 font-bold text-[14px] hover:bg-primary hover:text-white hover:border-primary transition-all shadow-lg hover:shadow-primary/30">
            Xem toàn hệ thống cơ sở
            <span className="material-symbols-outlined group-hover:translate-y-1 transition-transform">expand_more</span>
          </button>
          <p className="mt-6 text-[12px] font-bold text-slate-400 uppercase tracking-widest opacity-60">Hiển thị 4 trong tổng số 18 phòng khám mạng lưới</p>
        </div>
      </section>
    </AdminLayout>
  );
}
