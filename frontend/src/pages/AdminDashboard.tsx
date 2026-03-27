import { useState } from 'react';
import AdminLayout from '../layouts/AdminLayout';

export default function AdminDashboard() {
  const [dashboardTimeRange, setDashboardTimeRange] = useState('7 ngày qua');

  return (
    <AdminLayout>
      <section className="p-4 md:p-8 space-y-6 md:space-y-8">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">Tổng quan hệ thống</h2>
            <p className="text-sm text-slate-500 mt-1 font-medium opacity-70">Quản lý toàn mạng lưới bệnh lý mãn tính DamDiep</p>
          </div>
          <div className="flex gap-2">
            <button className="px-5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-primary/10 text-slate-700 dark:text-slate-200 text-[14px] font-bold hover:bg-slate-50 transition-all shadow-sm">Xuất báo cáo</button>
            <button className="px-5 py-2.5 rounded-xl bg-primary text-white text-[14px] font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2">
              <span className="material-symbols-outlined text-xl">add_business</span>
              Thêm phòng khám
            </button>
          </div>
        </div>

        {/* Total Metrics - Standard Doctor Card Design */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: 'Tổng số Bệnh nhân', value: '12,840', trend: '+8%', trendType: 'up', icon: 'groups', color: 'primary' },
            { label: 'Phòng khám hoạt động', value: '24', sub: 'Chi nhánh toàn quốc', icon: 'medical_services', color: 'emerald' },
            { label: 'Đội ngũ Bác sĩ', value: '156', trend: '92%', trendType: 'check', icon: 'clinical_notes', color: 'blue' },
            { label: 'Cảnh báo rủi ro cao', value: '42', trend: 'Khẩn cấp', trendType: 'warning', icon: 'warning', color: 'red' }
          ].map((metric, idx) => (
            <div key={idx} className={`p-6 rounded-2xl bg-white dark:bg-slate-900 shadow-sm border border-primary/5 hover:border-primary/20 transition-all relative overflow-hidden group`}>
              <div className={`absolute -right-4 -top-4 w-24 h-24 bg-${metric.color === 'red' ? 'red' : 'primary'}/5 rounded-full group-hover:scale-110 transition-transform duration-500`}></div>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">{metric.label}</p>
              <div className="flex items-baseline gap-2">
                <span className={`text-4xl font-extrabold ${metric.color === 'red' ? 'text-red-500' : 'text-slate-900 dark:text-white'}`}>{metric.value}</span>
                {metric.trend && (
                  <span className={`px-2 py-0.5 rounded-lg text-sm font-bold flex items-center ${
                    metric.trendType === 'warning' ? 'bg-red-500 text-white shadow-sm' : 
                    'bg-emerald-500 text-white shadow-sm'
                  }`}>
                    {metric.trend}
                  </span>
                )}
              </div>
              {metric.sub && <p className="mt-4 text-sm text-slate-500 font-medium opacity-70">{metric.sub}</p>}
              {!metric.sub && (
                <div className="mt-6 h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className={`h-full bg-${metric.color === 'red' ? 'red-500' : 'primary'} w-[75%] rounded-full shadow-sm`}></div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Comparison Chart Section */}
          <div className="lg:col-span-2 space-y-8">
            <div className="p-8 rounded-2xl bg-white dark:bg-slate-900 shadow-sm border border-primary/5">
              <div className="flex justify-between items-center mb-10">
                <h3 className="text-xl font-extrabold tracking-tight">Lưu lượng bệnh nhân theo cơ sở</h3>
                <select 
                  className="bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-[12px] font-bold px-4 py-2 focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                  value={dashboardTimeRange}
                  onChange={(e) => setDashboardTimeRange(e.target.value)}
                >
                  <option>7 ngày qua</option>
                  <option>30 ngày qua</option>
                </select>
              </div>
              <div className="h-64 flex items-end justify-between gap-4 px-4">
                {[
                  { label: 'SK Quận 1', h: '90%', v: '2,450' },
                  { label: 'SK Ba Đình', h: '75%', v: '1,920' },
                  { label: 'SK Hải Châu', h: '60%', v: '1,500' },
                  { label: 'SK Lê Chân', h: '45%', v: '1,100' },
                  { label: 'Cần Thơ', h: '30%', v: '850' }
                ].map((bar, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-4 group">
                    <div className="w-full bg-primary/10 hover:bg-primary/20 rounded-t-xl group relative cursor-pointer transition-all duration-300" style={{ height: bar.h }}>
                      <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap z-10 shadow-xl">{bar.v} lượt</div>
                      <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-t-xl shadow-[0_0_15px_rgba(59,185,243,0.3)]"></div>
                    </div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase text-center leading-tight tracking-tight">{bar.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Performance - Standard Table Look */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-primary/5 overflow-hidden">
              <div className="p-6 border-b border-primary/5 flex justify-between items-center">
                <h3 className="text-xl font-extrabold tracking-tight">Hiệu suất mạng lưới</h3>
                <button className="text-primary text-[14px] font-bold hover:underline">Tất cả</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-primary/5 text-[12px] font-bold text-slate-500 uppercase tracking-widest">
                      <th className="py-4 px-6">Phòng khám</th>
                      <th className="py-4 px-6">Lưu lượng</th>
                      <th className="py-4 px-6 text-right"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-primary/5">
                    {[
                      { name: "Sống Khỏe Quận 1", location: "TP. HCM", patients: "2,450", status: "Hoạt động", color: "emerald" },
                      { name: "Sống Khỏe Ba Đình", location: "Hà Nội", patients: "1,920", status: "Bận", color: "orange" },
                      { name: "Sống Khỏe Hải Châu", location: "Đà Nẵng", patients: "1,500", status: "Hoạt động", color: "emerald" }
                    ].map((clinic, idx) => (
                      <tr key={idx} className="hover:bg-primary/5 transition-colors group">
                        <td className="py-5 px-6">
                          <div>
                            <p className="text-[16px] font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors tracking-tight">{clinic.name}</p>
                            <p className="text-[13px] text-slate-400 font-medium">{clinic.location}</p>
                          </div>
                        </td>
                        <td className="py-5 px-6 text-[14px] font-extrabold text-slate-900 dark:text-white">{clinic.patients}</td>
                        <td className="py-5 px-6 text-right">
                          <span className={`px-4 py-1.5 rounded-full text-white text-[13px] font-bold shadow-sm whitespace-nowrap inline-flex ${
                            clinic.color === 'emerald' ? 'bg-emerald-500' : 'bg-amber-500'
                          }`}>
                            {clinic.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Activity Section - Standard Sidebar Widget Look */}
          <div className="space-y-8">
            <div className="p-8 rounded-2xl bg-white dark:bg-slate-900 shadow-sm border border-primary/5">
              <h3 className="text-xl font-extrabold tracking-tight mb-8 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>activity_zone</span>
                Hoạt động hệ thống
              </h3>
              <div className="space-y-8 relative">
                <div className="absolute left-4 top-2 bottom-8 w-0.5 bg-primary/5"></div>
                {[
                  { title: "Nâng cấp bảo mật", sub: "Hoàn tất tại HCM Cluster", time: "12 phút trước", icon: "security_update_good", color: "blue" },
                  { title: "Phòng khám mới", sub: "SK Hải Phòng đã kết nối", time: "1 giờ trước", icon: "add_location_alt", color: "primary" },
                  { title: "Lỗi đồng bộ dữ liệu", sub: "Đã xử lý tại SK Ba Đình", time: "3 giờ trước", icon: "sync_problem", color: "red" }
                ].map((act, idx) => (
                  <div key={idx} className="flex gap-5 relative z-10">
                    <div className={`w-8 h-8 rounded-full bg-white dark:bg-slate-900 border-2 border-primary/10 flex items-center justify-center shadow-sm`}>
                      <span className={`material-symbols-outlined text-[14px] font-bold ${act.color === 'red' ? 'text-red-500' : 'text-primary'}`}>{act.icon}</span>
                    </div>
                    <div>
                      <p className={`text-[15px] font-bold ${act.color === 'red' ? 'text-red-500' : 'text-slate-900 dark:text-white'} leading-none mb-1.5`}>{act.title}</p>
                      <p className="text-[13px] text-slate-500 font-medium opacity-80">{act.sub}</p>
                      <p className="text-[11px] text-slate-400 font-bold mt-2 uppercase tracking-tighter">{act.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-10 py-3 bg-slate-50 dark:bg-slate-800 hover:bg-primary/10 hover:text-primary text-slate-500 text-[13px] font-bold rounded-xl transition-all uppercase tracking-widest">Xem log hệ thống</button>
            </div>

            {/* Coverage Map - Doctor Profile Widget Style */}
            <div className="group relative h-48 rounded-2xl overflow-hidden shadow-sm border border-primary/5">
              <img 
                alt="Network Map" 
                className="w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000 scale-110 group-hover:scale-100" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuD3HROnzkc-xxSzP30wBPEFT6ipvk5oSRzbajzcdFqhSm_go2pK94IBCGTuhAR28DqKDwiBe7TvgwN6rM0ahtT1Pmvxzk77cdK0R7pvjGvv0FeaHwq9AUVQiV42rF5SzrADIIne7Wm5CWJ8dOayw65-hQsmpU_d1Mn2XlkrQ7P6hx4DLa1R-XM_eLxz3vduOI9tXvxIRhvrJkJUBGAPB257mj8vA5lam88nxiyUqq7-_ndulBhsqmIndx-NjB9qTZBqpZAQXvXUjJY"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
              <div className="absolute bottom-5 left-6 right-6">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_8px_rgba(59,185,243,0.8)]"></span>
                  <p className="text-[11px] font-bold text-primary uppercase tracking-[0.2em] leading-none">Network Status</p>
                </div>
                <p className="text-white font-extrabold text-[16px]">24 Phòng khám / 12 Tỉnh thành</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </AdminLayout>
  );
}
