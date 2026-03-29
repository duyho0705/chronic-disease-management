import AdminLayout from '../layouts/AdminLayout';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../constants/routes';
import Dropdown from '../components/ui/Dropdown';

export default function AdminReports() {
  const [reportType, setReportType] = useState('Month');
  const [performanceFilter, setPerformanceFilter] = useState('Tất cả kết quả');

  const performanceData = [
    { name: "Vitality Quận 1", cases: "1,240", appts: "842", ad: "95%", status: "Tốt", color: "emerald" },
    { name: "Vitality Thảo Điền", cases: "860", appts: "624", ad: "91%", status: "Tốt", color: "emerald" },
    { name: "Vitality Phú Mỹ Hưng", cases: "720", appts: "415", ad: "84%", status: "Ổn định", color: "primary" },
    { name: "Vitality Cầu Giấy (Mới)", cases: "310", appts: "186", ad: "68%", status: "Cần lưu ý", color: "amber" }
  ];

  const filteredData = performanceData.filter(row => {
    if (performanceFilter === 'Tất cả kết quả') return true;
    return row.status === performanceFilter;
  });

  return (
    <AdminLayout>
      <section className="p-4 md:p-8 space-y-8 animate-in fade-in duration-700 font-display">
        {/* Header & Filters */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">Báo cáo hợp nhất</h2>
            <p className="text-[16px] text-slate-500 mt-1 font-medium">Phân tích dữ liệu vận hành toàn hệ thống</p>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <div className="bg-primary/5 dark:bg-slate-800 rounded-xl p-1 flex gap-1 border border-primary/5">
              {['Ngày', 'Tháng', 'Quý'].map((type) => (
                <button
                  key={type}
                  onClick={() => setReportType(type)}
                  className={`px-5 py-2 text-[14px] font-bold rounded-lg transition-all ${reportType === type ? 'bg-primary text-white shadow-md' : 'text-slate-500 hover:bg-white dark:hover:bg-slate-700'
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
                <span className={`px-2 py-0.5 rounded-full text-[13px] font-medium flex items-center gap-1 ${stat.trendType === 'up' ? 'bg-emerald-500 text-white' :
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
            <div className="flex items-center justify-between mb-8">
              <div>
                <h4 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">Xu hướng tăng trưởng hệ thống</h4>
                <p className="text-[15px] font-medium text-slate-500 mt-1">Dữ liệu tổng hợp từ các chi nhánh</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-primary mb-0.5"></span>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Lượng bệnh nhân</span>
              </div>
            </div>

            <div className="relative h-64 w-full">
              <svg className="w-full h-full relative z-10" preserveAspectRatio="none" viewBox="0 0 800 240">
                <defs>
                  <linearGradient id="reportsChartGradient" x1="0%" x2="0%" y1="0%" y2="100%">
                    <stop offset="0%" style={{ stopColor: '#3bb9f3', stopOpacity: 0.15 }}></stop>
                    <stop offset="100%" style={{ stopColor: '#3bb9f3', stopOpacity: 0 }}></stop>
                  </linearGradient>
                </defs>
                <path
                  d="M0,180 Q60,165 120,195 T240,150 T360,165 T480,120 T600,135 T720,105 T800,85 L800,240 L0,240 Z"
                  fill="url(#reportsChartGradient)"
                />
                <path
                  d="M0,180 Q60,165 120,195 T240,150 T360,165 T480,120 T600,135 T720,105 T800,85"
                  fill="none"
                  stroke="#3bb9f3"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
                {[
                  { x: 120, y: 195 }, { x: 240, y: 150 }, { x: 360, y: 165 },
                  { x: 480, y: 120 }, { x: 600, y: 135 }, { x: 720, y: 105 }, { x: 800, y: 85 }
                ].map((pt, i) => (
                  <circle
                    key={i}
                    cx={pt.x}
                    cy={pt.y}
                    r="6"
                    fill="#3bb9f3"
                    stroke="white"
                    strokeWidth="3"
                    className="drop-shadow-sm transition-transform hover:scale-125 cursor-pointer"
                  />
                ))}
              </svg>
              <div className="absolute bottom-0 w-full flex justify-between px-2 text-[10px] font-extrabold text-slate-300 dark:text-slate-600 pt-6 uppercase tracking-widest pointer-events-none">
                <span>Tháng 5</span>
                <span>Tháng 6</span>
                <span>Tháng 7</span>
                <span>Tháng 8</span>
                <span>Tháng 9</span>
                <span>Tháng 10</span>
              </div>
            </div>

            {/* Quick Analytics Summary Bar */}
            <div className="mt-12 pt-8 border-t border-slate-50 dark:border-slate-800">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                  { label: 'Tỷ lệ tăng trưởng', val: '+12.4%', icon: 'trending_up', color: 'emerald', sub: 'So với Tháng 5' },
                  { label: 'Tháng cao điểm', val: 'Tháng 10', icon: 'event', color: 'primary', sub: '1,240 ca' },
                  { label: 'Tỷ lệ quay lại', val: '84.2%', icon: 'replay', color: 'blue', sub: 'Bệnh nhân cũ' },
                  { label: 'Dự báo T11', val: '+5.8%', icon: 'bolt', color: 'amber', sub: 'Dự đoán AI' }
                ].map((item, i) => (
                  <div key={i} className="flex flex-col">
                    <div className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500 mb-1.5">
                      <span className={`material-symbols-outlined text-[18px] text-${item.color}-500`} style={{ fontVariationSettings: "'FILL' 1" }}>{item.icon}</span>
                      <span className="text-[14px] font-medium text-slate-600">{item.label}</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-[15px] font-bold text-slate-900 dark:text-white leading-none tracking-tight">{item.val}</span>
                      <span className="text-[13px] font-bold text-slate-600 dark:text-slate-500">{item.sub}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Revenue Breakdown */}
          <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-primary/5 flex flex-col">
            <h4 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white mb-2">Phân bổ bệnh nhân</h4>
            <p className="text-[15px] font-medium text-slate-500 mb-10">Mạng lưới chi nhánh tháng 10</p>
            <div className="space-y-6 flex-1">
              {[
                { name: "Vitality Quận 1", val: "1,240 Bệnh nhân", p: "45%", icon: 'home_health' },
                { name: "Vitality Thảo Điền", val: "860 Bệnh nhân", p: "30%", icon: 'home_health' },
                { name: "Phú Mỹ Hưng", val: "720 Bệnh nhân", p: "20%", icon: 'home_health' },
                { name: "Cầu Giấy (Mới)", val: "310 Bệnh nhân", p: "5%", icon: 'home_health' }
              ].map((item, idx) => (
                <div key={idx} className="group">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <span className="material-symbols-outlined text-[23px]">{item.icon}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[15px] font-medium text-slate-600">{item.name}</span>
                      <div className="flex items-baseline gap-2">
                        <span className="text-[14px] font-bold text-slate-900 dark:text-white">{item.val}</span>
                        <span className="text-[12px] font-medium text-slate-600">{item.p}</span>
                      </div>
                    </div>
                  </div>
                  <div className="w-full bg-slate-50 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-primary h-full rounded-full transition-all duration-1000" style={{ width: item.p }}></div>
                  </div>
                </div>
              ))}
            </div>
            <Link
              to={ROUTES.ADMIN.USERS}
              className="mt-10 py-3.5 w-full bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-[13px] font-bold rounded-xl border border-primary/10 hover:bg-slate-50 transition-all flex items-center justify-center gap-2 group"
            >
              Xem chi tiết bệnh nhân
              <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </Link>
          </div>
        </div>

        {/* Detailed Clinic Performance Table - Same as Doctor Dashboard Style */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-sm border border-primary/5">
          <div className="p-8 border-b border-primary/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h4 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">Chi tiết hiệu suất phòng khám</h4>
              <p className="text-[15px] font-medium text-slate-500 mt-1">Phân tích tải trọng và trạng thái vận hành</p>
            </div>
            <Dropdown
              options={['Tất cả kết quả', 'Tốt', 'Ổn định', 'Cần lưu ý']}
              value={performanceFilter}
              onChange={setPerformanceFilter}
              variant="badge"
              className="w-44"
            />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="px-8 py-4 text-[15px] text-slate-500 leading-none">
                  <th className="font-medium px-8 py-5">Phòng khám</th>
                  <th className="font-medium px-6 py-5">Số ca khám</th>
                  <th className="font-medium px-6 py-5">Lượt đặt lịch mới</th>
                  <th className="font-medium px-6 py-5">Tuân thủ điều trị</th>
                  <th className="font-medium px-6 py-5 text-right">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-primary/5">
                {filteredData.map((row, idx) => (
                  <tr key={idx} className="hover:bg-primary/5 transition-colors group">
                    <td className="px-8 py-5 text-[15px] font-bold text-slate-900 dark:text-white transition-colors tracking-tight">{row.name}</td>
                    <td className="px-6 py-5 text-[15px] font-extrabold text-slate-700 dark:text-slate-300">{row.cases}</td>
                    <td className="px-6 py-5 text-[15px] font-black text-emerald-600 dark:text-emerald-400">{row.appts}</td>
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
                        {row.status}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

    </AdminLayout>
  );
}
