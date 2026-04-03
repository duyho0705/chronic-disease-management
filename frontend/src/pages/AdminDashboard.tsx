import { useState, useEffect } from 'react';
import AdminLayout from '../layouts/AdminLayout';
import Dropdown from '../components/ui/Dropdown';
import CreateClinicModal from '../features/admin/components/CreateClinicModal';
import Toast from '../components/ui/Toast';
import { adminApi } from '../api/admin';
import { clinicApi } from '../api/clinic';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

export default function AdminDashboard() {
  const [selectedChartMetric, setSelectedChartMetric] = useState('Lượng bệnh nhân');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastTitle, setToastTitle] = useState('');
  const [stats, setStats] = useState<any>(null);
  const [clinics, setClinics] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [timeRange, setTimeRange] = useState('DAY'); // 'DAY' or 'MONTH'
  const [isLoadingChart, setIsLoadingChart] = useState(true);

  useEffect(() => {
    fetchDashboardData(timeRange);
  }, [timeRange]);

  const fetchDashboardData = async (range: string = 'DAY') => {
    setIsLoadingChart(true);
    try {
      const res = await adminApi.getDashboardData(range);
      if (res && res.data) {
        setStats(res.data.stats);
        setClinics(res.data.clinicPerformances || []);
        setActivities(res.data.recentActivities || []);
        setChartData(res.data.chartData || []);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setIsLoadingChart(false);
    }
  };

  // Custom Chart Tooltip Component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/80 dark:bg-slate-900/90 backdrop-blur-md p-3 border border-slate-100 dark:border-slate-800 rounded-xl shadow-xl">
          <p className="text-[13px] font-bold text-slate-700 mb-1">{label}</p>
          <div className="flex items-center gap-2">
            <p className="text-[14px] font-medium text-slate-600 dark:text-white">
              {payload[0].value} <span className="text-slate-600 font-medium text-[12px]">bệnh nhân mới</span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  const handleExportExcel = () => {
    // Detailed Clinic Data for Export
    const reportData = [
      { id: 'TA-102', name: 'Phòng khám Đa khoa Tâm Anh', address: '108 Hoàng Như Tiếp, Long Biên, Hà Nội', doctors: 42, patients: 1240, growth: '+8.4%', status: 'Đang hoạt động' },
      { id: 'ND-204', name: 'Phòng khám Nhi Đồng 1', address: '341 Sư Vạn Hạnh, Quận 10, TP.HCM', doctors: 28, patients: 892, growth: '+3.2%', status: 'Đang hoạt động' },
      { id: 'VD-301', name: 'Vitality Dental Care', address: '25 Nguyễn Huệ, Quận 1, TP.HCM', doctors: 12, patients: 415, growth: '-1.5%', status: 'Ngưng hoạt động' },
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

  const handleCreateClinic = async (data: any) => {
    setIsSaving(true);
    try {
      // Call Real API
      await clinicApi.createClinic({
        name: data.name,
        address: data.address,
        phone: data.phone,
        clinicCode: data.clinicCode,
        adminFullName: data.adminFullName,
        adminEmail: data.adminEmail,
        adminPassword: data.adminPassword,
        imageUrl: data.imageUrl
      });

      setToastTitle(`Đã khởi tạo hệ thống cho ${data.name} thành công!`);
    } catch (error) {
      console.error('Failed to create clinic:', error);
      setToastTitle(`Lỗi tạo phòng khám (Chế độ Mock được kích hoạt)`);
    } finally {
      setIsSaving(false);
      setIsCreateModalOpen(false);
      setShowToast(true);
    }
  };

  return (
    <AdminLayout>
      <div className="p-4 md:p-8 space-y-8 animate-in fade-in duration-700 font-display text-left">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex-1 min-w-0">
            {isLoadingChart ? (
              <div className="space-y-3">
                <div className="h-8 bg-slate-200 dark:bg-slate-800 animate-pulse rounded w-72"></div>
                <div className="h-4 bg-slate-100 dark:bg-slate-800/50 animate-pulse rounded w-96"></div>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">Tổng quan</h2>
                <p className="text-[16px] text-slate-500 mt-1 font-medium italic-none">Theo dõi hiệu suất vận hành hệ thống</p>
              </>
            )}
          </div>
          <div className="flex gap-2">
            {isLoadingChart ? (
              <>
                <div className="w-32 h-10 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-lg shadow-sm"></div>
                <div className="w-32 h-10 bg-slate-100 dark:bg-slate-800/50 animate-pulse rounded-lg shadow-sm"></div>
              </>
            ) : (
              <>
                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl font-bold transition-all text-[13px] shadow-lg shadow-primary/20 active:scale-95 hover:shadow-primary/30"
                >
                  <span className="material-symbols-outlined text-[18px]">add</span>
                  Thêm phòng khám
                </button>
                <button
                  onClick={handleExportExcel}
                  className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-lg font-bold transition-all text-[13px] border border-primary/10 active:scale-95 shadow-sm"
                >
                  <span className="material-symbols-outlined text-[18px]">ios_share</span>
                  Xuất báo cáo
                </button>
              </>
            )}
          </div>
        </div>

        {/* Summary Cards Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {isLoadingChart || !stats ? (
            // Skeleton Summary Cards
            [...Array(4)].map((_, idx) => (
              <div key={`summary-skeleton-${idx}`} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-primary/5 shadow-sm animate-pulse text-left">
                <div className="flex justify-between items-start">
                  <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-xl"></div>
                  <div className="w-10 h-5 bg-slate-50 dark:bg-slate-800 rounded-lg"></div>
                </div>
                <div className="mt-4 space-y-2">
                  <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-24"></div>
                  <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-16"></div>
                </div>
              </div>
            ))
          ) : (
            <>
              {/* Card 1 */}
              <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-primary/5 shadow-sm flex flex-col justify-between group hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl flex items-center justify-center text-emerald-600">
                    <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>groups</span>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">{stats?.patientGrowth || '+0%'}</span>
                </div>
                <div className="mt-4">
                  <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{stats?.totalPatients || 0}</h3>
                  <p className="text-slate-500 text-[15px] font-medium mt-1 font-display">Tổng số bệnh nhân</p>
                </div>
              </div>

              {/* Card 2 */}
              <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-primary/5 shadow-sm flex flex-col justify-between group hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center text-blue-600">
                    <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>apartment</span>
                  </div>
                  <span className="text-[11px] font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded-lg uppercase tracking-wider">{stats?.clinicTrend || 'Ổn định'}</span>
                </div>
                <div className="mt-4">
                  <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{stats?.activeClinics || 0}</h3>
                  <p className="text-slate-500 text-[15px] font-medium mt-1 font-display">Phòng khám hoạt động</p>
                </div>
              </div>

              {/* Card 3 */}
              <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-primary/5 shadow-sm flex flex-col justify-between group hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl flex items-center justify-center text-indigo-600">
                    <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>stethoscope</span>
                  </div>
                  <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg">{stats?.doctorTrend || '+0 mới'}</span>
                </div>
                <div className="mt-4">
                  <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{stats?.totalDoctors || 0}</h3>
                  <p className="text-slate-500 text-[15px] font-medium mt-1 font-display">Đội ngũ Bác sĩ</p>
                </div>
              </div>

              {/* Card 4 - High Risk Level Style from Doctor */}
              <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-primary/5 shadow-sm flex flex-col justify-between group hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center text-red-600">
                    <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>warning</span>
                  </div>
                  <span className="px-2 py-1 bg-red-500 text-white text-[10px] font-bold rounded-full uppercase tracking-wider">Theo dõi</span>
                </div>
                <div className="mt-4">
                  <h3 className="text-3xl font-black text-red-600 tracking-tight">{stats?.highRiskAlerts || 0}</h3>
                  <p className="text-slate-500 text-[15px] font-medium mt-1 font-display">Cảnh báo rủi ro cao</p>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Main Layout Section: Chart and Activity */}
        <div className="grid grid-cols-12 gap-8">
          {/* Chart Section (Placeholder for real charts) */}
          <div className="col-span-12 lg:col-span-8 bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm relative group/chart overflow-hidden text-left">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
              <div>
                {isLoadingChart ? (
                  <div className="space-y-2">
                    <div className="h-6 bg-slate-200 dark:bg-slate-800 animate-pulse rounded w-64"></div>
                    <div className="h-4 bg-slate-100 dark:bg-slate-800/50 animate-pulse rounded w-48"></div>
                  </div>
                ) : (
                  <>
                    <h2 className="text-[19px] font-bold text-slate-900 dark:text-white tracking-tight">Thống kê vận hành hệ thống</h2>
                    <p className="text-[15px] text-slate-500 mt-1">Báo cáo chi tiết theo {selectedChartMetric.toLowerCase()}</p>
                  </>
                )}
              </div>
              <div className="flex items-center gap-6">
                {/* Time Range Selector */}
                {isLoadingChart ? (
                  <div className="w-40 h-10 bg-slate-100 dark:bg-slate-800 animate-pulse rounded-xl"></div>
                ) : (
                  <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                    <button
                      onClick={() => setTimeRange('DAY')}
                      className={`px-4 py-1.5 text-[13px] font-bold rounded-lg transition-all ${timeRange === 'DAY'
                        ? 'bg-white dark:bg-slate-700 text-[#3bb9f3] shadow-sm'
                        : 'text-slate-500 hover:text-slate-700'
                        }`}
                    >
                      Ngày
                    </button>
                    <button
                      onClick={() => setTimeRange('MONTH')}
                      className={`px-4 py-1.5 text-[13px] font-bold rounded-lg transition-all ${timeRange === 'MONTH'
                        ? 'bg-white dark:bg-slate-700 text-[#3bb9f3] shadow-sm'
                        : 'text-slate-500 hover:text-slate-700'
                        }`}
                    >
                      Tháng
                    </button>
                    <button
                      onClick={() => setTimeRange('YEAR')}
                      className={`px-4 py-1.5 text-[13px] font-bold rounded-lg transition-all ${timeRange === 'YEAR'
                        ? 'bg-white dark:bg-slate-700 text-[#3bb9f3] shadow-sm'
                        : 'text-slate-500 hover:text-slate-700'
                        }`}
                    >
                      Năm
                    </button>
                  </div>
                )}

                {isLoadingChart ? (
                  <div className="w-48 h-10 bg-slate-100 dark:bg-slate-800 animate-pulse rounded-xl"></div>
                ) : (
                  <Dropdown
                    options={['Lượng bệnh nhân', 'Lượt đặt lịch', 'Doanh thu', 'Tỷ lệ hài lòng']}
                    value={selectedChartMetric}
                    onChange={setSelectedChartMetric}
                    className="w-48"
                  />
                )}
              </div>
            </div>

            {/* Visual Chart Area */}
            <div className="h-[300px] w-full relative">
              {isLoadingChart ? (
                <div className="absolute inset-0 bg-slate-50 dark:bg-slate-800/50 animate-pulse rounded-xl flex flex-col justify-end p-8 gap-12">
                  <div className="flex items-end justify-between gap-4 h-full">
                    {[...Array(7)].map((_, i) => (
                      <div key={i} className={`bg-slate-200 dark:bg-slate-700/50 rounded-lg w-full`} style={{ height: `${20 + Math.random() * 60}%` }}></div>
                    ))}
                  </div>
                  <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-full"></div>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 30 }}>
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3bb9f3" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#3bb9f3" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(203, 213, 225, 0.4)" />
                    <XAxis
                      dataKey="label"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#475569', fontSize: 13, fontWeight: 500 }}
                      dy={18}
                      textAnchor="middle"
                    />
                    <YAxis
                      hide
                      domain={['auto', 'auto']}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#3bb9f3', strokeWidth: 1, strokeDasharray: '4 4' }} />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="#3bb9f3"
                      strokeWidth={4}
                      fillOpacity={1}
                      fill="url(#colorValue)"
                      animationDuration={2000}
                      dot={{
                        r: 6,
                        fill: '#fff',
                        stroke: '#3bb9f3',
                        strokeWidth: 3,
                        className: 'drop-shadow-md'
                      }}
                      activeDot={{
                        r: 8,
                        fill: '#3bb9f3',
                        stroke: '#fff',
                        strokeWidth: 3,
                        className: 'drop-shadow-lg'
                      }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Recent Activity (Placeholder logic) */}
          <div className="col-span-12 lg:col-span-4 bg-slate-50 dark:bg-slate-900/50 p-8 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col text-left">
            <div className="flex items-center justify-between mb-6">
              {isLoadingChart ? (
                <div className="h-6 bg-slate-200 dark:bg-slate-800 animate-pulse rounded w-48"></div>
              ) : (
                <h2 className="text-[19px] font-bold text-slate-900 dark:text-white tracking-tight">Hoạt động hệ thống</h2>
              )}
              {isLoadingChart ? (
                <div className="w-6 h-6 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-full"></div>
              ) : (
                <span className="material-symbols-outlined text-slate-400">history</span>
              )}
            </div>
            <div className="space-y-6 flex-1">
              {isLoadingChart ? (
                // Skeleton Activities
                [...Array(4)].map((_, idx) => (
                  <div key={`activity-skeleton-${idx}`} className="flex gap-4 animate-pulse">
                    <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 shrink-0"></div>
                    <div className="space-y-2 flex-1">
                      <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/2"></div>
                      <div className="h-3 bg-slate-100 dark:bg-slate-800/50 rounded w-full"></div>
                    </div>
                  </div>
                ))
              ) : activities.length > 0 ? (
                activities.map((act, idx) => (
                  <div key={idx} className="flex gap-4 group">
                    <div className="relative">
                      <div className={`w-10 h-10 rounded-full bg-${act.color || 'blue'}-100 dark:bg-${act.color || 'blue'}-900/30 flex items-center justify-center text-${act.color || 'blue'}-600 dark:text-${act.color || 'blue'}-400 z-10 relative`}>
                        <span className="material-symbols-outlined text-lg">{act.icon || 'history'}</span>
                      </div>
                      {idx !== activities.length - 1 && <div className="absolute top-10 left-1/2 -translate-x-1/2 w-0.5 h-full bg-slate-200 dark:bg-slate-800"></div>}
                    </div>
                    <div>
                      <p className="text-[15px] font-bold text-slate-900 dark:text-white">{act.title}</p>
                      <p className="text-[14px] text-slate-500 font-medium mt-0.5 leading-relaxed">{act.description}</p>
                      <span className="text-[13px] font-medium text-slate-400 dark:text-slate-500 mt-2 inline-block italic-none tracking-tight">{act.timeAgo}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-slate-400 py-10 opacity-50">
                  <span className="material-symbols-outlined text-4xl mb-2">inbox</span>
                  <p className="text-sm font-medium">Chưa có hoạt động mới</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Performance Table Section */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-primary/10 overflow-hidden shadow-sm font-display text-left">
          <div className="p-6 border-b border-primary/10 flex items-center justify-between">
            <div>
              {isLoadingChart ? (
                <>
                  <div className="h-6 bg-slate-200 dark:bg-slate-800 animate-pulse rounded w-64 mb-3"></div>
                  <div className="h-4 bg-slate-100 dark:bg-slate-800/50 animate-pulse rounded w-80"></div>
                </>
              ) : (
                <>
                  <h3 className="text-[19px] font-bold text-slate-900 dark:text-white">Danh sách chi nhánh mới</h3>
                  <p className="text-[15px] text-slate-500 mt-1">Lấy dữ liệu trực tiếp từ các phòng khám</p>
                </>
              )}
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 dark:bg-slate-800/50">
                  <th className="px-8 py-4">
                    {isLoadingChart ? <div className="h-4 bg-slate-200 dark:bg-slate-800 animate-pulse rounded w-24"></div> : <span className="text-[15px] font-medium text-slate-500">Tên Phòng Khám</span>}
                  </th>
                  <th className="px-6 py-4">
                    {isLoadingChart ? <div className="h-4 bg-slate-200 dark:bg-slate-800 animate-pulse rounded w-16"></div> : <span className="text-[15px] font-medium text-slate-500">Mã cơ sở</span>}
                  </th>
                  <th className="px-6 py-4">
                    {isLoadingChart ? <div className="h-4 bg-slate-200 dark:bg-slate-800 animate-pulse rounded w-16"></div> : <span className="text-[15px] font-medium text-slate-500">Liên Hệ</span>}
                  </th>
                  <th className="px-6 py-4">
                    {isLoadingChart ? <div className="h-4 bg-slate-200 dark:bg-slate-800 animate-pulse rounded w-12"></div> : <span className="text-[15px] font-medium text-slate-500">Bác Sĩ</span>}
                  </th>
                  <th className="px-6 py-4">
                    {isLoadingChart ? <div className="h-4 bg-slate-200 dark:bg-slate-800 animate-pulse rounded w-16"></div> : <span className="text-[15px] font-medium text-slate-500">Bệnh Nhân</span>}
                  </th>
                  <th className="px-6 py-4">
                    {isLoadingChart ? <div className="h-4 bg-slate-200 dark:bg-slate-800 animate-pulse rounded w-16"></div> : <span className="text-[15px] font-medium text-slate-500">Tăng Trưởng</span>}
                  </th>
                  <th className="px-6 py-4">
                    {isLoadingChart ? <div className="h-4 bg-slate-200 dark:bg-slate-800 animate-pulse rounded w-16"></div> : <span className="text-[15px] font-medium text-slate-500">Trạng Thái</span>}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                {isLoadingChart ? (
                  // Skeleton Rows
                  [...Array(4)].map((_, i) => (
                    <tr key={`clinic-skeleton-${i}`} className="animate-pulse">
                      <td className="px-8 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-slate-200 dark:bg-slate-800"></div>
                          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-48"></div>
                        </div>
                      </td>
                      <td className="px-6 py-4"><div className="h-6 bg-slate-100 dark:bg-slate-800 rounded w-12"></div></td>
                      <td className="px-6 py-4"><div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-24"></div></td>
                      <td className="px-6 py-4"><div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-8"></div></td>
                      <td className="px-6 py-4"><div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-12"></div></td>
                      <td className="px-6 py-4"><div className="h-4 bg-slate-300 dark:bg-slate-800 rounded w-16"></div></td>
                      <td className="px-6 py-4"><div className="h-6 bg-slate-200 dark:bg-slate-800 rounded-full w-24"></div></td>
                    </tr>
                  ))
                ) : (
                  clinics.map((clinic) => (
                    <tr key={clinic.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                      <td className="px-8 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[#3bb9f3]">
                            <span className="material-symbols-outlined text-[23px]">home_health</span>
                          </div>
                          <p className="text-sm font-bold text-slate-900 dark:text-white leading-none">{clinic.name}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <code className="text-xs font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md">{clinic.clinicCode}</code>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-slate-600 dark:text-slate-400">{clinic.phone}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-bold text-slate-900 dark:text-white">{clinic.doctorCount || 0}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-black text-slate-900 dark:text-white tracking-tight">{clinic.patientCount || 0}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-bold text-[#3bb9f3]">{clinic.growth}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 text-white text-[13px] font-bold rounded-full ${clinic.status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-red-500'}`}>
                          {clinic.status === 'ACTIVE' ? 'Hoạt động' : 'Ngưng hoạt động'}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <CreateClinicModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        isSaving={isSaving}
        onSave={handleCreateClinic}
      />

      <Toast
        show={showToast}
        title={toastTitle}
        onClose={() => setShowToast(false)}
      />
    </AdminLayout>
  );
}
