import AdminLayout from '../layouts/AdminLayout';
import { useState } from 'react';

export default function AdminReports() {
  const [reportType, setReportType] = useState('Month');

  return (
    <AdminLayout>
      <section className="p-4 md:p-8 space-y-8 animate-in fade-in duration-700 font-display">
        {/* Header & Filters */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">Báo cáo hợp nhất</h2>
            <p className="text-[16px] text-slate-500 mt-1 font-medium">Phân tích dữ liệu vận hành toàn hệ thống Vitality DamDiep.</p>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <div className="bg-primary/5 dark:bg-slate-800 rounded-xl p-1 flex gap-1 border border-primary/5">
              {['Ngày', 'Tháng', 'Quý'].map((type) => (
                <button
                  key={type}
                  onClick={() => setReportType(type)}
                  className={`px-5 py-2 text-[11px] font-extrabold uppercase rounded-lg transition-all ${reportType === type ? 'bg-primary text-white shadow-md' : 'text-slate-500 hover:bg-white dark:hover:bg-slate-700'
                    }`}
                >
                  Theo {type}
                </button>
              ))}
            </div>
            <button className="flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-slate-900 border border-primary/10 text-slate-700 dark:text-slate-200 text-[13px] font-bold rounded-xl hover:bg-slate-50 shadow-sm">
              <span className="material-symbols-outlined text-[18px]">calendar_today</span>
              01/10/2023 - 31/10/2023
            </button>
            <div className="flex gap-2">
              <button className="w-10 h-10 flex items-center justify-center bg-white dark:bg-slate-900 border border-primary/10 text-slate-500 rounded-xl hover:text-primary transition-all shadow-sm">
                <span className="material-symbols-outlined text-[20px]">picture_as_pdf</span>
              </button>
              <button className="w-10 h-10 flex items-center justify-center bg-white dark:bg-slate-900 border border-primary/10 text-slate-500 rounded-xl hover:text-primary transition-all shadow-sm">
                <span className="material-symbols-outlined text-[20px]">description</span>
              </button>
            </div>
          </div>
        </div>

        {/* High-level Stats Bento - Match Simplified Look */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { label: 'Chỉ số hài lòng (NPS)', value: '78.5', trend: '+2.4', trendType: 'up', icon: 'sentiment_very_satisfied', color: 'emerald' },
            { label: 'Thời gian khám TB', value: '24', unit: 'phút', trend: '+3m', trendType: 'up-warning', icon: 'schedule', color: 'blue' },
            { label: 'Tỷ lệ tái khám', value: '92', unit: '%', trend: '+5%', trendType: 'up', icon: 'event_repeat', color: 'primary' },
            { label: 'Tỷ lệ giữ chân', value: '84', unit: '%', trend: 'Ổn định', trendType: 'check', icon: 'favorite', color: 'red' }
          ].map((stat, idx) => (
            <div key={idx} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-primary/5 shadow-sm transition-all group hover:shadow-md">
              <div className="flex justify-between items-start mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.color === 'primary' ? 'bg-primary/10 text-primary' :
                    stat.color === 'emerald' ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600' :
                      stat.color === 'blue' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600' :
                        stat.color === 'amber' ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-600' :
                          stat.color === 'red' ? 'bg-red-50 dark:bg-red-900/20 text-red-600' :
                            'bg-slate-100 dark:bg-slate-800 text-slate-600'
                  }`}>
                  <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>{stat.icon}</span>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 ${stat.trendType === 'up' ? 'bg-emerald-500 text-white' :
                    stat.trendType === 'up-warning' ? 'bg-amber-500 text-white' :
                      'bg-primary text-white'
                  }`}>
                  {stat.trend}
                </span>
              </div>
              <p className="text-slate-500 text-[15px] font-medium mt-1">{stat.label}</p>
              <h3 className={`text-2xl font-black ${stat.color === 'red' && false ? 'text-red-500' : 'text-slate-900 dark:text-white'} tracking-tight mt-1`}>
                {stat.value}
                {stat.unit && <span className="text-[14px] font-bold ml-1 opacity-50">{stat.unit}</span>}
              </h3>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Patient Growth Trend Chart */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-primary/5 relative overflow-hidden">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h4 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">Xu hướng tăng trưởng hệ thống</h4>
                <p className="text-[16px] font-medium text-slate-500 mt-1">Dữ liệu tổng hợp từ 4 chi nhánh chính toàn quốc</p>
              </div>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary"></span>
                  <span className="text-[11px] font-bold text-slate-400 uppercase">Mới</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary/20"></span>
                  <span className="text-[11px] font-bold text-slate-400 uppercase">Cũ</span>
                </div>
              </div>
            </div>

            <div className="relative h-64 w-full flex items-end gap-6 px-4">
              <div className="absolute inset-0 flex flex-col justify-between text-[10px] font-bold text-slate-300 pointer-events-none opacity-50">
                {[3000, 2000, 1000, 0].map(v => (
                  <div key={v} className="border-b border-slate-100 dark:border-slate-800 w-full pb-1 flex justify-between">
                    <span>{v}</span>
                  </div>
                ))}
              </div>
              {[
                { m: 'T5', h1: '40%', h2: '20%' },
                { m: 'T6', h1: '45%', h2: '25%' },
                { m: 'T7', h1: '50%', h2: '30%' },
                { m: 'T8', h1: '55%', h2: '28%' },
                { m: 'T9', h1: '60%', h2: '35%' },
                { m: 'T10', h1: '65%', h2: '42%' }
              ].map((bar, idx) => (
                <div key={idx} className="flex-1 group relative flex flex-col justify-end items-center gap-1.5 h-full z-10">
                  <div className="w-full bg-primary/10 rounded-t-lg group-hover:bg-primary/20 transition-all cursor-pointer" style={{ height: bar.h1 }}></div>
                  <div className="w-full bg-primary rounded-t-lg shadow-sm" style={{ height: bar.h2 }}></div>
                  <span className="text-[11px] font-extrabold text-slate-400 mt-2">{bar.m}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Revenue Breakdown */}
          <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-primary/5 flex flex-col">
            <h4 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white mb-2">Phân bổ doanh thu</h4>
            <p className="text-[16px] font-medium text-slate-500 mb-10">Mạng lưới chi nhánh tháng 10</p>
            <div className="space-y-8 flex-1">
              {[
                { name: "Vitality Quận 1", val: "1.2 tỷ", p: "45%" },
                { name: "Vitality Thảo Điền", val: "850 tr", p: "30%" },
                { name: "Phú Mỹ Hưng", val: "600 tr", p: "20%" },
                { name: "Cầu Giấy (Mới)", val: "150 tr", p: "5%" }
              ].map((item, idx) => (
                <div key={idx} className="space-y-3">
                  <div className="flex justify-between items-end">
                    <span className="text-[14px] font-bold text-slate-700 dark:text-slate-200">{item.name}</span>
                    <span className="text-[14px] font-extrabold text-primary">{item.val}</span>
                  </div>
                  <div className="w-full bg-slate-50 dark:bg-slate-800 h-2 rounded-full overflow-hidden shadow-inner">
                    <div className="bg-primary h-full rounded-full shadow-[0_0_8px_rgba(59,185,243,0.3)]" style={{ width: item.p }}></div>
                  </div>
                </div>
              ))}
            </div>
            <button className="mt-10 py-3.5 w-full bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-[13px] font-bold rounded-xl border border-primary/10 hover:bg-slate-50 transition-all flex items-center justify-center gap-2 group">
              Xem chi tiết tài chính
              <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </button>
          </div>
        </div>

        {/* Detailed Clinic Performance Table - Same as Doctor Dashboard Style */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-sm border border-primary/5">
          <div className="p-8 border-b border-primary/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h4 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">Chi tiết hiệu suất phòng khám</h4>
              <p className="text-[16px] font-medium text-slate-500 mt-1">Phân tích tải trọng và trạng thái vận hành</p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 border border-primary/10 rounded-xl text-[13px] font-bold text-slate-600 hover:bg-slate-50 transition-all">
              <span className="material-symbols-outlined text-[18px]">filter_list</span>
              Lọc kết quả
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="px-8 py-4 text-[15px] text-slate-500 leading-none">
                  <th className="font-medium px-8 py-5">Phòng khám</th>
                  <th className="font-medium px-6 py-5">Số ca khám</th>
                  <th className="font-medium px-6 py-5">Doanh thu TB/Ca</th>
                  <th className="font-medium px-6 py-5">Chỉ số Adherence</th>
                  <th className="font-medium px-6 py-5 text-right">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-primary/5">
                {[
                  { name: "Vitality Quận 1", cases: "1,240", rev: "980,000đ", ad: "95%", status: "Tốt", color: "emerald" },
                  { name: "Vitality Thảo Điền", cases: "860", rev: "1,150,000đ", ad: "91%", status: "Tốt", color: "emerald" },
                  { name: "Vitality Phú Mỹ Hưng", cases: "720", rev: "820,000đ", ad: "84%", status: "Ổn định", color: "primary" },
                  { name: "Vitality Cầu Giấy (Mới)", cases: "310", rev: "1,050,000đ", ad: "68%", status: "Cần lưu ý", color: "amber" }
                ].map((row, idx) => (
                  <tr key={idx} className="hover:bg-primary/5 transition-colors group">
                    <td className="px-8 py-5 text-[16px] font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors tracking-tight">{row.name}</td>
                    <td className="px-6 py-5 text-[15px] font-extrabold text-slate-700 dark:text-slate-300">{row.cases}</td>
                    <td className="px-6 py-5 text-[14px] font-medium text-slate-500">{row.rev}</td>
                    <td className="px-6 py-5">
                      <span className={`px-4 py-1 rounded-full text-[13px] font-bold shadow-sm inline-flex ${parseInt(row.ad) >= 90 ? 'bg-emerald-500 text-white' :
                        parseInt(row.ad) >= 80 ? 'bg-primary text-white' :
                          'bg-amber-500 text-white'
                        }`}>
                        {row.ad}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className={`inline-flex items-center gap-2 text-${row.color === 'emerald' ? 'emerald-500' : row.color === 'amber' ? 'amber-500' : 'primary'} font-extrabold text-[14px]`}>
                        <span className={`w-2 h-2 rounded-full bg-${row.color === 'emerald' ? 'emerald-500' : row.color === 'amber' ? 'amber-500' : 'primary'} animate-pulse`}></span>
                        {row.status}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-6 bg-primary/5 text-center">
            <button className="text-[13px] font-bold text-primary hover:underline underline-offset-4 uppercase">Tải xuống toàn bộ báo cáo phân tích (CSV)</button>
          </div>
        </div>
      </section>

      {/* Absolute FAB - Standard insights call */}
      <button className="fixed bottom-8 right-8 w-14 h-14 bg-primary text-white rounded-2xl shadow-xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-[160] group border-4 border-white dark:border-slate-900">
        <span className="material-symbols-outlined text-[24px] group-hover:rotate-12 transition-transform">insights</span>
      </button>
    </AdminLayout>
  );
}
