import { useState } from 'react';
import AdminLayout from '../layouts/AdminLayout';
import Dropdown from '../components/ui/Dropdown';

export default function AdminDashboard() {
  const [selectedChartMetric, setSelectedChartMetric] = useState('Lượng bệnh nhân');

  const handleExportExcel = () => {
    // Detailed Clinic Data for Export
    const reportData = [
      { id: 'TA-102', name: 'Phòng khám Đa khoa Tâm Anh', address: '108 Hoàng Như Tiếp, Long Biên, Hà Nội', doctors: 42, patients: 1240, growth: '+8.4%', status: 'Đang hoạt động' },
      { id: 'ND-204', name: 'Phòng khám Nhi Đồng 1', address: '341 Sư Vạn Hạnh, Quận 10, TP.HCM', doctors: 28, patients: 892, growth: '+3.2%', status: 'Đang hoạt động' },
      { id: 'VD-301', name: 'Vitality Dental Care', address: '25 Nguyễn Huệ, Quận 1, TP.HCM', doctors: 12, patients: 415, growth: '-1.5%', status: 'Tạm khóa' },
      { id: 'ML-009', name: 'Mediscan Central Lab', address: '12 Nguyễn Trãi, Quận 5, TP.HCM', doctors: 15, patients: 156, growth: '+2.0%', status: 'Đang hoạt động' }
    ];

    const today = new Date().toLocaleDateString('vi-VN');

    // Generating an HTML-based Excel format that tells Excel to auto-fit columns
    const excelContent = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <meta charset="utf-8" />
        <!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>Bao cao chi nhanh</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->
        <style>
          table { border-collapse: collapse; width: 100%; }
          th { background: #3bb9f3; color: white; height: 35px; text-align: left; font-weight: bold; padding: 5px; }
          td { border: 0.5pt solid #ccc; padding: 5px; mso-number-format:"\\@"; }
          .header-row { height: 40px; background-color: #3bb9f3; }
        </style>
      </head>
      <body>
        <h3>BÁO CÁO CƠ SỞ Y TẾ VITALITY - NGÀY ${today}</h3>
        <table>
          <thead>
            <tr class="header-row">
              <th>Mã ID</th>
              <th>Tên Cơ Sở/Phòng Khám</th>
              <th>Địa Chỉ Chi Tiết</th>
              <th>Đội Ngũ BS</th>
              <th>Lượng Bệnh Nhân</th>
              <th>Tăng Trưởng</th>
              <th>Trạng Thái</th>
            </tr>
          </thead>
          <tbody>
            ${reportData.map(item => `
              <tr>
                <td>${item.id}</td>
                <td>${item.name}</td>
                <td>${item.address}</td>
                <td>${item.doctors}</td>
                <td>${item.patients}</td>
                <td>${item.growth}</td>
                <td>${item.status}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </body>
      </html>
    `;

    const blob = new Blob([excelContent], { type: 'application/vnd.ms-excel' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Bao_cao_chi_nhanh_Vitality_${today.replace(/\//g, '-')}.xls`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <AdminLayout>
      <div className="p-4 md:p-8 space-y-8 animate-in fade-in duration-700 font-display">
        {/* Summary Cards Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Card 1 */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-primary/5 shadow-sm flex flex-col justify-between group hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl flex items-center justify-center text-emerald-600">
                <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>groups</span>
              </div>
              <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">+12.5%</span>
            </div>
            <div className="mt-4">
              <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">24,582</h3>
              <p className="text-slate-500 text-[15px] font-medium mt-1 font-display">Tổng số bệnh nhân</p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-primary/5 shadow-sm flex flex-col justify-between group hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center text-blue-600">
                <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>apartment</span>
              </div>
              <span className="text-[11px] font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded-lg uppercase tracking-wider">Ổn định</span>
            </div>
            <div className="mt-4">
              <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">42</h3>
              <p className="text-slate-500 text-[15px] font-medium mt-1 font-display">Phòng khám hoạt động</p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-primary/5 shadow-sm flex flex-col justify-between group hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl flex items-center justify-center text-indigo-600">
                <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>stethoscope</span>
              </div>
              <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg">+4 mới</span>
            </div>
            <div className="mt-4">
              <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">186</h3>
              <p className="text-slate-500 text-[15px] font-medium mt-1 font-display">Đội ngũ Bác sĩ</p>
            </div>
          </div>

          {/* Card 4 - High Risk Level Style from Doctor */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-primary/5 shadow-sm flex flex-col justify-between group hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center text-red-600">
                <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>warning</span>
              </div>
              <span className="px-2 py-1 bg-red-500 text-white text-[10px] font-bold rounded-full uppercase tracking-wider">Cần xử lý</span>
            </div>
            <div className="mt-4">
              <h3 className="text-3xl font-black text-red-600 tracking-tight">14</h3>
              <p className="text-slate-500 text-[15px] font-medium mt-1 font-display">Cảnh báo rủi ro cao</p>
            </div>
          </div>
        </div>

        {/* Main Layout Section: Chart and Activity */}
        <div className="grid grid-cols-12 gap-8">
          {/* Line Chart Section */}
          <div className="col-span-12 lg:col-span-8 bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm relative group/chart overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
              <div>
                <h2 className="text-[19px] font-bold text-slate-900 dark:text-white tracking-tight">Thống kê vận hành hệ thống</h2>
                <p className="text-[15px] text-slate-500 mt-1">Báo cáo chi tiết theo {selectedChartMetric.toLowerCase()}</p>
              </div>
              <div className="flex items-center gap-4">
                <Dropdown
                  options={['Lượng bệnh nhân', 'Lượt đặt lịch', 'Doanh thu', 'Tỷ lệ hài lòng']}
                  value={selectedChartMetric}
                  onChange={setSelectedChartMetric}
                  className="w-48"
                />
              </div>
            </div>

            {/* Visual Chart with Dots and Smooth Line */}
            <div className="h-[300px] w-full relative">

              <svg className="w-full h-full relative z-10" preserveAspectRatio="none" viewBox="0 0 800 240">
                <defs>
                  <linearGradient id="adminChartGradient" x1="0%" x2="0%" y1="0%" y2="100%">
                    <stop offset="0%" style={{ stopColor: '#3bb9f3', stopOpacity: 0.15 }}></stop>
                    <stop offset="100%" style={{ stopColor: '#3bb9f3', stopOpacity: 0 }}></stop>
                  </linearGradient>
                </defs>
                {/* Area under curve */}
                <path
                  d="M0,180 Q60,165 120,195 T240,150 T360,165 T480,120 T600,135 T720,105 T800,85 L800,240 L0,240 Z"
                  fill="url(#adminChartGradient)"
                />
                {/* Smooth line */}
                <path
                  d="M0,180 Q60,165 120,195 T240,150 T360,165 T480,120 T600,135 T720,105 T800,85"
                  fill="none"
                  stroke="#3bb9f3"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
                {/* Dots on points */}
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
                    className="drop-shadow-sm transition-transform hover:scale-125"
                  />
                ))}
              </svg>

              <div className="absolute bottom-0 w-full flex justify-between px-2 text-[10px] font-extrabold text-slate-400 pt-4 uppercase tracking-[0.15em]">
                <span>Thứ 2</span>
                <span>Thứ 3</span>
                <span>Thứ 4</span>
                <span>Thứ 5</span>
                <span>Thứ 6</span>
                <span>Thứ 7</span>
                <span>CN</span>
              </div>
            </div>
          </div>

          {/* Recent Activity Section */}
          <div className="col-span-12 lg:col-span-4 bg-slate-50 dark:bg-slate-900/50 p-8 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-[19px] font-bold text-slate-900 dark:text-white tracking-tight">Hoạt động hệ thống</h2>
              <span className="material-symbols-outlined text-slate-400">history</span>
            </div>
            <div className="space-y-6 flex-1">
              {/* Activity Item 1 */}
              <div className="flex gap-4 group">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 z-10 relative">
                    <span className="material-symbols-outlined text-lg">security</span>
                  </div>
                  <div className="absolute top-10 left-1/2 -translate-x-1/2 w-0.5 h-full bg-slate-200 dark:bg-slate-800 group-last:hidden"></div>
                </div>
                <div>
                  <p className="text-[15px] font-bold text-slate-900 dark:text-white">Nâng cấp bảo mật</p>
                  <p className="text-[14px] text-slate-500 font-medium mt-0.5 leading-relaxed">Cập nhật giao thức mã hóa cho hồ sơ bệnh án.</p>
                  <span className="text-[13px] font-medium text-slate-400 dark:text-slate-500 mt-2 inline-block">2 giờ trước</span>
                </div>
              </div>
              {/* Activity Item 2 */}
              <div className="flex gap-4 group">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 z-10 relative">
                    <span className="material-symbols-outlined text-lg">add_business</span>
                  </div>
                  <div className="absolute top-10 left-1/2 -translate-x-1/2 w-0.5 h-full bg-slate-200 dark:bg-slate-800 group-last:hidden"></div>
                </div>
                <div>
                  <p className="text-[15px] font-bold text-slate-900 dark:text-white">Phòng khám mới được thêm</p>
                  <p className="text-[14px] text-slate-500 font-medium mt-0.5 leading-relaxed">Chi nhánh Sống Khỏe Quận 7 đã hoàn tất cấu hình.</p>
                  <span className="text-[13px] font-medium text-slate-400 dark:text-slate-500 mt-2 inline-block">5 giờ trước</span>
                </div>
              </div>
              {/* Activity Item 3 */}
              <div className="flex gap-4 group">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-400 z-10 relative">
                    <span className="material-symbols-outlined text-lg">sync_problem</span>
                  </div>
                </div>
                <div>
                  <p className="text-[15px] font-bold text-slate-900 dark:text-white">Lỗi đồng bộ dữ liệu</p>
                  <p className="text-[14px] text-slate-500 font-medium mt-0.5 leading-relaxed">Phát hiện xung đột ID bệnh nhân tại Chi nhánh Thủ Đức.</p>
                  <span className="text-[13px] font-medium text-slate-400 dark:text-slate-500 mt-2 inline-block">Hôm qua</span>
                </div>
              </div>
            </div>
            <button className="w-full mt-6 py-3 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-[13px] font-bold rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm border border-slate-100 dark:border-slate-800">Xem tất cả nhật ký</button>
          </div>
        </div>

        {/* Performance Table Section */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-primary/10 overflow-hidden shadow-sm font-display">
          <div className="p-6 border-b border-primary/10 flex items-center justify-between bg-white dark:bg-slate-900">
            <div>
              <h3 className="text-[19px] font-bold text-slate-900 dark:text-white">Hiệu suất các chi nhánh</h3>
              <p className="text-[15px] text-slate-500 mt-1">Phân tích tải trọng và trạng thái vận hành</p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={handleExportExcel}
                className="text-primary text-[15px] font-bold hover:underline flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[18px]">download</span>
                Xuất báo cáo
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-background-light dark:bg-slate-800/50">
                  <th className="px-8 py-4 text-[15px] font-medium text-slate-500">Tên Phòng Khám</th>
                  <th className="px-8 py-4 text-[15px] font-medium text-slate-500">Lượng Bệnh Nhân</th>
                  <th className="px-8 py-4 text-[15px] font-medium text-slate-500 text-center">Tăng Trưởng</th>
                  <th className="px-8 py-4 text-[15px] font-medium text-slate-500 text-center">Trạng Thái</th>
                  <th className="px-8 py-4 text-[15px] font-medium text-slate-500 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                {/* Row 1 */}
                <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                  <td className="px-8 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                        <span className="material-symbols-outlined text-[23px]">home_health</span>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900 dark:text-white leading-none">Sống Khỏe - Quận 1</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-4 whitespace-nowrap">
                    <span className="text-sm font-black text-slate-900 dark:text-white tracking-tight">1,240</span>
                  </td>
                  <td className="px-8 py-4 text-center">
                    <span className="text-sm font-bold text-primary">+8.4%</span>
                  </td>
                  <td className="px-8 py-4 text-center">
                    <span className="px-3 py-1 bg-emerald-500 text-white text-[13px] font-bold rounded-full">Hoạt động</span>
                  </td>
                  <td className="px-8 py-4 text-right">
                    <button className="text-slate-400 hover:text-primary transition-colors">
                      <span className="material-symbols-outlined text-xl">chevron_right</span>
                    </button>
                  </td>
                </tr>
                {/* Row 2 */}
                <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                  <td className="px-8 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                        <span className="material-symbols-outlined text-[23px]">home_health</span>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900 dark:text-white leading-none">Sống Khỏe - Thủ Đức</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-4 whitespace-nowrap">
                    <span className="text-sm font-black text-slate-900 dark:text-white tracking-tight">892</span>
                  </td>
                  <td className="px-8 py-4 text-center">
                    <span className="text-sm font-bold text-primary">+3.2%</span>
                  </td>
                  <td className="px-8 py-4 text-center">
                    <span className="px-3 py-1 bg-emerald-500 text-white text-[13px] font-bold rounded-full">Hoạt động</span>
                  </td>
                  <td className="px-8 py-4 text-right">
                    <button className="text-slate-400 hover:text-primary transition-colors">
                      <span className="material-symbols-outlined text-xl">chevron_right</span>
                    </button>
                  </td>
                </tr>
                {/* Row 3 */}
                <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                  <td className="px-8 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                        <span className="material-symbols-outlined text-[23px]">home_health</span>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900 dark:text-white leading-none">Sống Khỏe - Bình Tân</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-4 whitespace-nowrap">
                    <span className="text-sm font-black text-slate-900 dark:text-white tracking-tight">415</span>
                  </td>
                  <td className="px-8 py-4 text-center">
                    <span className="text-sm font-bold text-red-500">-1.5%</span>
                  </td>
                  <td className="px-8 py-4 text-center">
                    <span className="px-3 py-1 bg-red-500 text-white text-[13px] font-bold rounded-full">Ngưng hoạt động</span>
                  </td>
                  <td className="px-8 py-4 text-right">
                    <button className="text-slate-400 hover:text-primary transition-colors">
                      <span className="material-symbols-outlined text-xl">chevron_right</span>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
