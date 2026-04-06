import { useState, useEffect } from 'react';
import ClinicSidebar from '../components/common/ClinicSidebar';
import TopBar from '../components/common/TopBar';
import { clinicApi } from '../api/clinic';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

export default function ClinicReports() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [reportTimeRange, setReportTimeRange] = useState('30 ngày');
    const [selectedChartMetric, setSelectedChartMetric] = useState('Lượng bệnh nhân');
    const [notifications, setNotifications] = useState([
        { id: 1, title: 'Báo cáo mới', description: 'Có báo cáo tổng quát tháng 12 vừa được tạo.', time: '5 phút trước', read: false },
        { id: 2, title: 'Cảnh báo nguy cơ', description: 'Bệnh nhân Nguyễn Văn An có chỉ số bất thường.', time: '1 giờ trước', read: false },
    ]);
    const [isLoading, setIsLoading] = useState(true);

    // Custom Tooltip for Recharts
    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            const getColor = () => {
                if (selectedChartMetric === 'Lượng bệnh nhân') return 'text-primary';
                if (selectedChartMetric === 'Tải lượng bác sĩ') return 'text-emerald-500';
                return 'text-red-500';
            };
            const getSuffix = () => {
                if (selectedChartMetric === 'Lượng bệnh nhân') return 'bệnh nhân mới';
                if (selectedChartMetric === 'Tải lượng bác sĩ') return 'ca khám/ngày';
                return 'ca nguy kịch';
            };
            return (
                <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-3 border border-slate-100 dark:border-slate-800 rounded-xl shadow-xl">
                    <p className="text-[13px] font-bold text-slate-700 dark:text-slate-200 mb-1">{label}</p>
                    <div className="flex items-center gap-2">
                        <p className={`text-[14px] font-black ${getColor()}`}>
                            {payload[0].value} <span className="text-slate-500 font-medium text-[12px]">{getSuffix()}</span>
                        </p>
                    </div>
                </div>
            );
        }
        return null;
    };

    const [stats, setStats] = useState<any>(null);
    const currentClinicId = localStorage.getItem('clinicId') || '1';

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const res = await clinicApi.getDashboard(currentClinicId);
                if (res.success) {
                    setStats(res.data);
                }
            } catch (error) {
                console.error('Failed to fetch dashboard stats:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchDashboardData();
    }, [currentClinicId]);

    const mainStats = {
        totalPatients: stats?.totalPatients || '0',
        patientGrowth: stats?.patientGrowth || '+0%',
        diseaseRatios: stats?.diseaseRatios || [
            { color: 'bg-primary', label: 'Tiểu đường', value: '40%' },
            { color: 'bg-[#3b6470]', label: 'Cao huyết áp', value: '35%' },
            { color: 'bg-[#c9e9d3]', label: 'Tim mạch', value: '25%' },
        ],
        chartData: selectedChartMetric === 'Lượng bệnh nhân' 
            ? (stats?.monthlyGrowth && stats.monthlyGrowth.length > 0
                ? stats.monthlyGrowth.map((val: number, i: number) => ({
                    month: `Tháng ${(new Date().getMonth() - 5 + i + 12) % 12 || 12}`,
                    value: Number(val)
                  }))
                : [
                    { month: 'Tháng 12', value: 120 }, { month: 'Tháng 1', value: 156 }, { month: 'Tháng 2', value: 142 }, 
                    { month: 'Tháng 3', value: 188 }, { month: 'Tháng 4', value: 224 }
                  ])
            : selectedChartMetric === 'Tải lượng bác sĩ'
            ? [
                { month: 'Tháng 12', value: 45 }, { month: 'Tháng 1', value: 48 }, { month: 'Tháng 2', value: 42 }, 
                { month: 'Tháng 3', value: 55 }, { month: 'Tháng 4', value: 60 }
              ]
            : [ // Chỉ số rủi ro
                { month: 'Tháng 12', value: 12 }, { month: 'Tháng 1', value: 8 }, { month: 'Tháng 2', value: 15 }, 
                { month: 'Tháng 3', value: 5 }, { month: 'Tháng 4', value: 3 }
            ]
    };

    const CustomXAxisTick = ({ x, y, payload, index, length }: any) => {
        let textAnchor: "start" | "middle" | "end" = "middle";
        if (index === 0) textAnchor = "start";
        else if (index === length - 1) textAnchor = "end";

        return (
            <g transform={`translate(${x},${y})`}>
                <text
                    x={0}
                    y={0}
                    dy={16}
                    textAnchor={textAnchor}
                    fill="#64748b"
                    fontSize={13}
                    fontWeight={700}
                >
                    {payload.value}
                </text>
            </g>
        );
    };

    const getMetricSummary = () => {
        const color = selectedChartMetric === 'Chỉ số rủi ro' ? 'text-red-500' : selectedChartMetric === 'Tải lượng bác sĩ' ? 'text-emerald-500' : 'text-sky-500';
        const statsMap: Record<string, any[]> = {
            'Lượng bệnh nhân': [
                { label: 'Tăng trưởng', value: mainStats.patientGrowth, trend: mainStats.patientGrowth.startsWith('+'), icon: 'show_chart' },
                { label: 'Trung bình', value: `${Math.round(parseInt(String(mainStats.totalPatients).replace(/,/g, '')) / 6)} ca/tháng`, icon: 'analytics' },
                { label: 'Đỉnh điểm', value: 'Tháng 3 (224 ca)', icon: 'leaderboard' }
            ],
            'Tải lượng bác sĩ': [
                { label: 'Tổng lượt khám', value: '250 ca', trend: true, icon: 'medical_services' },
                { label: 'TB/Bác sĩ', value: '15 ca/ngày', icon: 'person_apron' },
                { label: 'Ngày cao điểm', value: 'Thứ 2 (45 ca)', icon: 'calendar_month' }
            ],
            'Chỉ số rủi ro': [
                { label: 'Tỷ lệ rủi ro', value: '5.2%', trend: false, icon: 'emergency_home' },
                { label: 'Mới phát hiện', value: '12 ca/tháng', icon: 'new_releases' },
                { label: 'Đã xử lý', value: '95 ca', icon: 'task_alt' }
            ]
        };
        return { color, items: statsMap[selectedChartMetric] || [] };
    };

    return (
        <div className="flex min-h-screen font-display bg-[#f6f8f7] dark:bg-slate-950 text-slate-900 dark:text-slate-100 italic-none">
            {/* Sidebar Navigation - Shared Component */}
            <ClinicSidebar 
                isSidebarOpen={isSidebarOpen} 
                userName="Admin Sarah"
                userRole="Senior Manager"
                userAvatar="https://lh3.googleusercontent.com/aida-public/AB6AXuDs9fuTZde7EUIINhAwZDAYbGdWhfZuvszHFDZODEHBxXo3hRWmKfCmGfg6Xgckf0DONyYs8LQEOXng1sISGQVj9ec2pSs--Gz-xPlj6elGIG3KtZTO9U-57mPPcUxuNMtJbLamHmXAsWrVwobD4Ai-pKgNGU0yfv596RmDCRUawQMx8gmW7E2J_we-R_YITLa95pCcbtDZf6tkb7C6bWKKzwepNG2pc4L5uji1KMHQetqk8390TVAlxrRao3qco3laKWLu0uA-BmQ"
                isLoading={isLoading}
            />

            {/* Main Content Area */}
            <main className="flex-1 lg:ml-72 min-h-screen flex flex-col transition-all duration-300">
                {/* Mobile Sidebar Overlay */}
                {isSidebarOpen && (
                    <div
                        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[140] lg:hidden animate-in fade-in duration-300"
                        onClick={() => setIsSidebarOpen(false)}
                    ></div>
                )}

                {/* Top Header */}
                <TopBar
                    setIsSidebarOpen={setIsSidebarOpen}
                    notifications={notifications}
                    setNotifications={setNotifications}
                />

                {/* Content Area */}
                <div className="p-8 space-y-8">
                    {/* Header Controls */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 italic-none">
                        <div className="space-y-1">
                            {isLoading ? (
                                <>
                                    <div className="h-7 bg-slate-200 dark:bg-slate-800 animate-pulse rounded w-48"></div>
                                    <div className="h-4 bg-slate-100 dark:bg-slate-800 animate-pulse rounded w-64 mt-2"></div>
                                </>
                            ) : (
                                <>
                                    <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight leading-tight">Báo cáo Tổng hợp</h2>
                                    <p className="text-sm font-medium text-slate-500 italic-none">Xem và xuất dữ liệu báo cáo hoạt động phòng khám</p>
                                </>
                            )}
                        </div>
                        <div className="flex flex-wrap items-center gap-4">
                            {isLoading ? (
                                <>
                                    <div className="w-40 h-10 bg-slate-100 dark:bg-slate-800 animate-pulse rounded-xl"></div>
                                    <div className="w-48 h-10 bg-slate-100 dark:bg-slate-800 animate-pulse rounded-xl"></div>
                                </>
                            ) : (
                                <>
                                    <div className="flex bg-slate-200/50 dark:bg-slate-800 p-1 rounded-xl gap-1 border border-primary/5">
                                        <button
                                            onClick={() => setReportTimeRange('7 ngày')}
                                            className={`px-5 py-2 text-[13px] font-bold rounded-lg transition-all ${reportTimeRange === '7 ngày' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-500 hover:bg-white dark:hover:bg-slate-700'}`}
                                        >
                                            7 ngày
                                        </button>
                                        <button
                                            onClick={() => setReportTimeRange('30 ngày')}
                                            className={`px-5 py-2 text-[13px] font-bold rounded-lg transition-all ${reportTimeRange === '30 ngày' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-500 hover:bg-white dark:hover:bg-slate-700'}`}
                                        >
                                            30 ngày
                                        </button>
                                    </div>
                                    <div className="flex gap-2">
                                        <button className="flex items-center gap-2 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 px-5 py-2.5 rounded-xl text-sm font-bold border border-slate-200 dark:border-slate-800 hover:bg-slate-50 transition-colors shadow-sm whitespace-nowrap active:scale-95">
                                            <span className="material-symbols-outlined text-[20px] text-emerald-500">upload_file</span>
                                            Excel
                                        </button>
                                        <button className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:shadow-lg hover:shadow-primary/20 transition-all shadow-sm whitespace-nowrap active:scale-95">
                                            <span className="material-symbols-outlined text-[20px]">picture_as_pdf</span>
                                            PDF
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                    {/* Metric Cards (Bento Style) */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {isLoading ? (
                            [...Array(3)].map((_, i) => (
                                <div key={i} className="bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm animate-pulse border border-primary/5 space-y-4 h-[180px] flex flex-col justify-between">
                                    <div className="space-y-4">
                                        <div className="flex justify-between">
                                            <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-xl"></div>
                                            <div className="w-12 h-5 bg-slate-50 dark:bg-slate-800 rounded-full"></div>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-32"></div>
                                            <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-20"></div>
                                        </div>
                                    </div>
                                    <div className="h-4 bg-slate-50 dark:bg-slate-800 rounded w-32 mt-2"></div>
                                </div>
                            ))
                        ) : (
                            <>
                                <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group border border-primary/5">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                                            <span className="material-symbols-outlined size-6" style={{ fontVariationSettings: "'FILL' 1" }}>groups</span>
                                        </div>
                                        <span className="text-emerald-500 font-bold text-sm">{mainStats.patientGrowth}</span>
                                    </div>
                                    <h3 className="text-slate-500 text-sm font-medium">Tổng số bệnh nhân</h3>
                                    <p className="text-3xl font-black mt-1 text-slate-900 dark:text-white">{mainStats.totalPatients}</p>
                                    <div className="mt-4 h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                        <div className="h-full bg-primary w-[75%]"></div>
                                    </div>
                                </div>
                                <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group border border-primary/5">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center text-emerald-600">
                                            <span className="material-symbols-outlined size-6" style={{ fontVariationSettings: "'FILL' 1" }}>trending_up</span>
                                        </div>
                                        <span className="text-emerald-500 text-xs font-bold">Tháng này</span>
                                    </div>
                                    <h3 className="text-slate-500 text-sm font-medium">Lượt khám mới</h3>
                                    <p className="text-3xl font-black mt-1 text-slate-900 dark:text-white">+12%</p>
                                    <p className="text-[13px] text-slate-400 mt-2 font-medium">So với tháng trước</p>
                                </div>
                                <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group border border-primary/5">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center text-blue-500">
                                            <span className="material-symbols-outlined size-6" style={{ fontVariationSettings: "'FILL' 1" }}>event_available</span>
                                        </div>
                                        <div className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-3 py-1 rounded-full text-[12px] font-bold">Ổn định</div>
                                    </div>
                                    <h3 className="text-slate-500 text-sm font-medium">Tỷ lệ tái khám</h3>
                                    <p className="text-3xl font-black mt-1 text-slate-900 dark:text-white">85%</p>
                                    <div className="mt-4 flex gap-1">
                                        <div className="h-1.5 flex-1 bg-primary rounded-full"></div>
                                        <div className="h-1.5 flex-1 bg-primary rounded-full"></div>
                                        <div className="h-1.5 flex-1 bg-slate-100 dark:bg-slate-800 rounded-full"></div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Charts Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Xu hướng bệnh nhân */}
                        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-sm border border-primary/5">
                            {isLoading ? (
                                <div className="animate-pulse space-y-10">
                                    <div className="flex justify-between items-center">
                                        <div className="space-y-3">
                                            <div className="h-7 bg-slate-200 dark:bg-slate-800 rounded w-48"></div>
                                            <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-64"></div>
                                        </div>
                                        <div className="flex gap-4">
                                            <div className="w-20 h-4 bg-slate-100 dark:bg-slate-800 rounded"></div>
                                            <div className="w-20 h-4 bg-slate-100 dark:bg-slate-800 rounded"></div>
                                        </div>
                                    </div>
                                    <div className="h-64 bg-slate-50/50 dark:bg-slate-800/30 rounded-xl border border-slate-100 dark:border-slate-800 relative overflow-hidden">
                                        <div className="absolute inset-0 flex items-end justify-around px-4">
                                            {[1, 2, 3, 4, 5, 6].map(i => (
                                                <div key={i} className="w-5 bg-slate-100 dark:bg-slate-800 rounded-t-full" style={{ height: `${20 + (i * 10)}%` }}></div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="flex justify-between">
                                        {[1, 2, 3, 4, 5, 6].map(i => (
                                            <div key={i} className="w-12 h-3 bg-slate-50 dark:bg-slate-800 rounded"></div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                                        <div>
                                            <h3 className="text-[22px] font-bold text-slate-900 dark:text-white tracking-tight">Thống kê xu hướng</h3>
                                            <p className="text-[15px] text-slate-500 font-medium italic-none">Dữ liệu phân tích theo {selectedChartMetric.toLowerCase()}</p>
                                        </div>
                                        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                                            {['Lượng bệnh nhân', 'Tải lượng bác sĩ', 'Chỉ số rủi ro'].map((m) => (
                                                <button
                                                    key={m}
                                                    onClick={() => setSelectedChartMetric(m)}
                                                    className={`px-3 py-1.5 text-[11px] font-bold rounded-lg transition-all ${selectedChartMetric === m
                                                        ? `bg-white dark:bg-slate-700 ${selectedChartMetric === 'Chỉ số rủi ro' ? 'text-red-500' : selectedChartMetric === 'Tải lượng bác sĩ' ? 'text-emerald-500' : 'text-sky-500'} shadow-sm`
                                                        : 'text-slate-500 hover:text-slate-700'
                                                        }`}
                                                >
                                                    {m}
                                                </button>
                                            ))}
                                        </div>
                                        <div className="flex gap-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-2.5 h-2.5 rounded-full bg-primary"></div>
                                                <span className="text-[13px] font-bold text-slate-600 dark:text-slate-400">Ngoại trú</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-700"></div>
                                                <span className="text-[13px] font-bold text-slate-600 dark:text-slate-400">Nội trú</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="h-[300px] w-full mt-4">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <AreaChart data={mainStats.chartData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                                                <defs>
                                                    <linearGradient id="colorValueReport" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor={selectedChartMetric === 'Chỉ số rủi ro' ? '#ef4444' : selectedChartMetric === 'Tải lượng bác sĩ' ? '#10b981' : '#0ea5e9'} stopOpacity={0.2} />
                                                        <stop offset="95%" stopColor={selectedChartMetric === 'Chỉ số rủi ro' ? '#ef4444' : selectedChartMetric === 'Tải lượng bác sĩ' ? '#10b981' : '#0ea5e9'} stopOpacity={0} />
                                                    </linearGradient>
                                                </defs>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(203, 213, 225, 0.4)" />
                                                <XAxis
                                                    dataKey="month"
                                                    axisLine={false}
                                                    tickLine={false}
                                                    tick={<CustomXAxisTick length={mainStats.chartData.length} />}
                                                    interval={0}
                                                />
                                                <YAxis hide domain={['auto', 'auto']} />
                                                <Tooltip content={<CustomTooltip />} cursor={{ stroke: selectedChartMetric === 'Chỉ số rủi ro' ? '#ef4444' : selectedChartMetric === 'Tải lượng bác sĩ' ? '#10b981' : '#0ea5e9', strokeWidth: 1, strokeDasharray: '4 4' }} />
                                                <Area
                                                    type="monotone"
                                                    dataKey="value"
                                                    stroke={selectedChartMetric === 'Chỉ số rủi ro' ? '#ef4444' : selectedChartMetric === 'Tải lượng bác sĩ' ? '#10b981' : '#0ea5e9'}
                                                    strokeWidth={4}
                                                    fillOpacity={1}
                                                    fill="url(#colorValueReport)"
                                                    animationDuration={1500}
                                                    dot={{
                                                        r: 4,
                                                        fill: '#fff',
                                                        stroke: selectedChartMetric === 'Chỉ số rủi ro' ? '#ef4444' : selectedChartMetric === 'Tải lượng bác sĩ' ? '#10b981' : '#0ea5e9',
                                                        strokeWidth: 2,
                                                    }}
                                                    activeDot={{
                                                        r: 6,
                                                        fill: selectedChartMetric === 'Chỉ số rủi ro' ? '#ef4444' : selectedChartMetric === 'Tải lượng bác sĩ' ? '#10b981' : '#0ea5e9',
                                                        stroke: '#fff',
                                                        strokeWidth: 2,
                                                    }}
                                                />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>

                                    {/* Sync Stats Bar */}
                                    <div className="grid grid-cols-3 gap-4 pt-8 border-t border-slate-50 dark:border-slate-800/50 mt-6 pb-2">
                                        {getMetricSummary().items.map((item, idx) => (
                                            <div key={idx} className={`flex flex-col items-center ${idx === 1 ? 'border-x border-slate-100 dark:border-slate-800/50' : ''}`}>
                                                <p className="text-[14px] font-medium text-slate-500 mb-1 flex items-center gap-1">
                                                    <span className="material-symbols-outlined text-[16px]">{item.icon}</span>
                                                    {item.label}
                                                </p>
                                                <div className="flex items-center gap-1">
                                                    <span className={`text-lg font-bold ${idx === 0 && item.trend !== undefined ? (item.trend ? 'text-emerald-500' : 'text-red-500') : getMetricSummary().color}`}>
                                                        {item.value}
                                                    </span>
                                                    {idx === 0 && item.trend !== undefined && (
                                                        <span className={`material-symbols-outlined text-sm ${item.trend ? 'text-emerald-500' : 'text-red-500'}`}>
                                                            {item.trend ? 'trending_up' : 'trending_down'}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Bệnh mãn tính Chart */}
                        <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-sm border border-primary/5 flex flex-col items-center">
                            {isLoading ? (
                                <div className="w-full animate-pulse space-y-10">
                                    <div className="space-y-3 text-left">
                                        <div className="h-7 bg-slate-200 dark:bg-slate-800 rounded w-40"></div>
                                        <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-32"></div>
                                    </div>
                                    <div className="relative w-48 h-48 mx-auto">
                                        <div className="w-full h-full rounded-full border-[12px] border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center">
                                            <div className="w-12 h-6 bg-slate-200 dark:bg-slate-800 rounded mb-2"></div>
                                            <div className="w-14 h-3 bg-slate-100 dark:bg-slate-800 rounded"></div>
                                        </div>
                                    </div>
                                    <div className="space-y-4 pt-4">
                                        {[1, 2, 3].map(i => (
                                            <div key={i} className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-3 h-3 rounded-full bg-slate-100 dark:bg-slate-800"></div>
                                                    <div className="w-20 h-4 bg-slate-100 dark:bg-slate-800 rounded"></div>
                                                </div>
                                                <div className="w-10 h-4 bg-slate-200 dark:bg-slate-800 rounded"></div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="w-full text-left mb-8">
                                        <h3 className="text-[22px] font-bold text-slate-900 dark:text-white tracking-tight">Bệnh mãn tính</h3>
                                        <p className="text-[15px] text-slate-500 font-medium italic-none">Phân loại theo chuẩn ICD-10</p>
                                    </div>
                                    <div className="relative w-48 h-48 flex items-center justify-center">
                                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                                            <circle cx="50" cy="50" fill="transparent" r="40" stroke="currentColor" strokeWidth="12" className="text-slate-100 dark:text-slate-800"></circle>
                                            <circle cx="50" cy="50" fill="transparent" r="40" stroke="#4ade80" strokeDasharray="251.2" strokeDashoffset="150.72" strokeWidth="12"></circle>
                                            <circle className="rotate-[144deg] origin-center" cx="50" cy="50" fill="transparent" r="40" stroke="#3b6470" strokeDasharray="251.2" strokeDashoffset="200" strokeWidth="12"></circle>
                                            <circle className="rotate-[270deg] origin-center" cx="50" cy="50" fill="transparent" r="40" stroke="#c9e9d3" strokeDasharray="251.2" strokeDashoffset="188.4" strokeWidth="12"></circle>
                                        </svg>
                                        <div className="absolute flex flex-col items-center">
                                            <span className="text-3xl font-black text-slate-900 dark:text-white italic-none">{mainStats.totalPatients}</span>
                                            <span className="text-[12px] font-bold text-slate-400">Ca bệnh</span>
                                        </div>
                                    </div>
                                    <div className="mt-8 w-full space-y-4">
                                        {mainStats.diseaseRatios.map((item: any, i: number) => (
                                            <div key={i} className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                                                    <span className="text-sm font-bold text-slate-600 dark:text-slate-400">{item.label}</span>
                                                </div>
                                                <span className="text-sm font-black text-slate-900 dark:text-white">{item.value || item.percentage}</span>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Doctor Performance Table */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-primary/5 overflow-hidden">
                        <div className="px-8 py-6 flex justify-between items-center border-b border-slate-50 dark:border-slate-800">
                            {isLoading ? (
                                <>
                                    <div className="h-7 bg-slate-200 dark:bg-slate-800 animate-pulse rounded w-48"></div>
                                    <div className="h-5 bg-slate-100 dark:bg-slate-800 animate-pulse rounded w-28"></div>
                                </>
                            ) : (
                                <>
                                    <h3 className="text-[20px] font-bold text-slate-900 dark:text-white tracking-tight">Hiệu suất bác sĩ</h3>
                                    <button className="text-sm font-bold text-primary flex items-center gap-1 hover:underline">
                                        Tất cả bác sĩ <span className="material-symbols-outlined text-sm">open_in_new</span>
                                    </button>
                                </>
                            )}
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-slate-50 dark:bg-slate-800/50 font-display">
                                        <th className="px-8 py-5">
                                            {isLoading ? <div className="h-4 bg-slate-200 dark:bg-slate-700 animate-pulse rounded w-24"></div> : <span className="text-[15px] font-medium text-slate-500">Tên bác sĩ</span>}
                                        </th>
                                        <th className="px-8 py-5">
                                            {isLoading ? <div className="h-4 bg-slate-200 dark:bg-slate-700 animate-pulse rounded w-16"></div> : <span className="text-[15px] font-medium text-slate-500">Số ca khám</span>}
                                        </th>
                                        <th className="px-8 py-5">
                                            {isLoading ? <div className="h-4 bg-slate-200 dark:bg-slate-700 animate-pulse rounded w-20"></div> : <span className="text-[15px] font-medium text-slate-500">Điểm đánh giá</span>}
                                        </th>
                                        <th className="px-8 py-5">
                                            {isLoading ? <div className="h-4 bg-slate-200 dark:bg-slate-700 animate-pulse rounded w-20"></div> : <span className="text-[15px] font-medium text-slate-500">Trạng thái</span>}
                                        </th>
                                        <th className="px-8 py-5 text-right">
                                            {isLoading ? <div className="h-4 bg-slate-200 dark:bg-slate-700 animate-pulse rounded w-16 ml-auto"></div> : <span className="text-[15px] font-medium text-slate-500">Hành động</span>}
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                                    {isLoading ? (
                                        [1, 2, 3].map(i => (
                                            <tr key={`dr-skeleton-${i}`} className="animate-pulse">
                                                <td className="px-8 py-5">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-xl"></div>
                                                        <div className="space-y-2">
                                                            <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-28"></div>
                                                            <div className="h-3 bg-slate-50 dark:bg-slate-800/50 rounded w-20"></div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-5">
                                                    <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-12"></div>
                                                </td>
                                                <td className="px-8 py-5">
                                                    <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-14"></div>
                                                </td>
                                                <td className="px-8 py-5">
                                                    <div className="h-7 bg-slate-100 dark:bg-slate-800 rounded-full w-24"></div>
                                                </td>
                                                <td className="px-8 py-5 text-right">
                                                    <div className="w-8 h-8 bg-slate-50 dark:bg-slate-800 rounded ml-auto"></div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : stats?.doctorPerformances?.slice(0, 3).map((dr: any, idx: number) => (
                                        <tr key={idx} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                            <td className="px-8 py-5">
                                                <div className="flex items-center gap-3">
                                                    <img alt="Doctor Avatar" className="w-10 h-10 rounded-xl object-cover ring-2 ring-primary/10" src={dr.img} />
                                                    <div>
                                                        <p className="font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">{dr.name}</p>
                                                        <p className="text-[13px] text-slate-500 font-medium">{dr.dept}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5 text-sm font-bold text-slate-700 dark:text-slate-300">{dr.load}</td>
                                            <td className="px-8 py-5">
                                                <div className="flex items-center gap-1 text-amber-500">
                                                    <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                                    <span className="font-bold text-slate-900 dark:text-white">{dr.rating}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5">
                                                <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-[14px] font-bold text-white shadow-sm whitespace-nowrap ${dr.active ? 'bg-emerald-500' : 'bg-slate-400'}`}>
                                                    {dr.status}
                                                </span>
                                            </td>
                                            <td className="px-8 py-5 text-right">
                                                <button className="p-2 text-slate-400 hover:text-primary transition-colors">
                                                    <span className="material-symbols-outlined">more_vert</span>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {/* Pagination Footer - Redesigned */}
                        <div className="px-8 py-6 bg-slate-50/50 dark:bg-slate-800/20 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
                            {isLoading ? (
                                <>
                                    <div className="h-4 bg-slate-200 dark:bg-slate-800 animate-pulse rounded w-40"></div>
                                    <div className="flex gap-2">
                                        <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse"></div>
                                        <div className="w-24 h-10 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse"></div>
                                        <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse"></div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <p className="text-[14px] font-medium text-slate-500">
                                        Trang <span className="font-bold text-slate-900 dark:text-white">1</span> trên <span className="font-bold text-slate-900 dark:text-white">12</span>
                                    </p>
                                    <div className="flex items-center gap-3">
                                        <button className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-primary transition-all hover:shadow-sm disabled:opacity-30 disabled:hover:text-slate-400" disabled>
                                            <span className="material-symbols-outlined text-[20px]">chevron_left</span>
                                        </button>
                                        <div className="flex items-center gap-1.5">
                                            <button className="w-10 h-10 rounded-xl bg-primary text-white text-sm font-black shadow-lg shadow-primary/20 transition-all">1</button>
                                            <button className="w-10 h-10 rounded-xl bg-white dark:bg-slate-900 text-slate-500 hover:text-primary border border-transparent hover:border-slate-200 dark:hover:border-slate-700 text-sm font-bold transition-all">2</button>
                                            <button className="w-10 h-10 rounded-xl bg-white dark:bg-slate-900 text-slate-500 hover:text-primary border border-transparent hover:border-slate-200 dark:hover:border-slate-700 text-sm font-bold transition-all">3</button>
                                        </div>
                                        <button className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-primary transition-all hover:shadow-sm">
                                            <span className="material-symbols-outlined text-[20px]">chevron_right</span>
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
