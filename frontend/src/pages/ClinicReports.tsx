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
    const [notifications, setNotifications] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [activeFilter, setActiveFilter] = useState('Tất cả nhóm bệnh');

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
                const periodMap: Record<string, string> = {
                    '7 ngày': '7d',
                    '30 ngày': '30d',
                    '6 tháng gần nhất': '6m',
                    'Năm nay': '1y'
                };
                const res = await clinicApi.getDashboard(currentClinicId, periodMap[reportTimeRange] || '30d');
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
    }, [currentClinicId, reportTimeRange]);

    const mainStats = {
        totalPatients: stats?.totalPatients || '0',
        patientGrowth: stats?.patientGrowth || '+0%',
        growthStats: stats?.growthStats || null,
        diseaseRatios: stats?.diseaseRatios?.map((dr: any) => ({
            ...dr,
            value: dr.percentage
        })) || [],
        chartData: selectedChartMetric === 'Lượng bệnh nhân'
            ? (stats?.patientGrowthChart && stats.patientGrowthChart.length > 0
                ? stats.patientGrowthChart.map((d: any) => ({
                    month: d.month,
                    value: d.value,
                    inpatientValue: Math.floor(d.value * 0.4)
                }))
                : [])
            : selectedChartMetric === 'Tải lượng bác sĩ'
                ? (stats?.doctorLoadChart?.map((d: any) => ({
                    month: d.month,
                    value: d.value
                })) || [])
                : (stats?.riskIndexChart?.map((d: any) => ({
                    month: d.month,
                    value: d.value
                })) || [])
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
                    fontWeight={500}
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
                { label: 'Trung bình', value: mainStats.growthStats?.average || '0 ca/tháng', icon: 'analytics' },
                { label: 'Đỉnh điểm', value: mainStats.growthStats?.peakMonth || 'N/A', icon: 'leaderboard' }
            ],
            'Tải lượng bác sĩ': [
                { label: 'Tổng lượt khám', value: '250 ca', trend: true, icon: 'medical_services' },
                { label: 'TB/Bác sĩ', value: mainStats.growthStats?.average || '15 ca/ngày', icon: 'person_apron' },
                { label: 'Tháng cao điểm', value: mainStats.growthStats?.peakMonth || 'Tháng 3', icon: 'calendar_month' }
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
                                        <button className="flex items-center gap-2 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 px-4 py-2 rounded-xl text-sm font-bold border border-slate-200 dark:border-slate-800 hover:bg-slate-50 transition-all shadow-sm whitespace-nowrap">
                                            <span className="material-symbols-outlined text-[20px] text-emerald-500">upload_file</span>
                                            Excel
                                        </button>
                                        <button className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-xl text-sm font-bold hover:shadow-lg hover:shadow-primary/20 transition-all shadow-sm whitespace-nowrap">
                                            <span className="material-symbols-outlined text-[20px]">picture_as_pdf</span>
                                            PDF
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                    {/* Metric Cards (Bento Style) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {isLoading ? (
                            [...Array(4)].map((_, i) => (
                                <div key={i} className="bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm animate-pulse border border-slate-200/60 dark:border-slate-800/60 space-y-4 h-[180px] flex flex-col justify-between">
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
                                    <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full"></div>
                                </div>
                            ))
                        ) : (
                            <>
                                <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/60 dark:border-slate-800/80 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="w-12 h-12 bg-rose-100 dark:bg-rose-900/30 rounded-xl flex items-center justify-center text-rose-600">
                                            <span className="material-symbols-outlined size-6" style={{ fontVariationSettings: "'FILL' 1" }}>error</span>
                                        </div>
                                        <span className="text-rose-500 text-xs font-bold">Cần chú ý</span>
                                    </div>
                                    <h3 className="text-slate-500 text-sm font-medium">Bệnh nhân Nguy cơ cao</h3>
                                    <p className="text-3xl font-black mt-1 text-slate-900 dark:text-white">12 <span className="text-sm font-bold text-slate-400">ca</span></p>
                                    <p className="text-[13px] text-rose-500 mt-2 font-medium flex items-center gap-1">
                                        <span className="material-symbols-outlined text-[14px]">trending_up</span>
                                        +2 ca so với tuần trước
                                    </p>
                                </div>
                                <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/60 dark:border-slate-800/80 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center text-indigo-600">
                                            <span className="material-symbols-outlined size-6" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
                                        </div>
                                        <div className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-3 py-1 rounded-full text-[12px] font-bold">Tốt</div>
                                    </div>
                                    <h3 className="text-slate-500 text-sm font-medium">Tỷ lệ Tuân thủ</h3>
                                    <p className="text-3xl font-black mt-1 text-slate-900 dark:text-white">92%</p>
                                    <div className="mt-4 flex gap-1">
                                        <div className="h-1.5 flex-[4] bg-primary rounded-full"></div>
                                        <div className="h-1.5 flex-[1] bg-slate-100 dark:bg-slate-800 rounded-full"></div>
                                    </div>
                                </div>
                                <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/60 dark:border-slate-800/80 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center text-emerald-600">
                                            <span className="material-symbols-outlined size-6" style={{ fontVariationSettings: "'FILL' 1" }}>health_and_safety</span>
                                        </div>
                                        <div className="text-emerald-500 text-xs font-bold flex items-center gap-0.5">
                                            <span className="material-symbols-outlined text-[14px]">trending_up</span>
                                            +4.2%
                                        </div>
                                    </div>
                                    <h3 className="text-slate-500 text-sm font-medium">Tỷ lệ Cải thiện</h3>
                                    <p className="text-3xl font-black mt-1 text-slate-900 dark:text-white">76.4%</p>
                                    <p className="text-[12px] text-slate-400 mt-2 font-medium">Chuyển sang nhóm ổn định</p>
                                </div>
                                <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/60 dark:border-slate-800/80 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center text-blue-500">
                                            <span className="material-symbols-outlined size-6" style={{ fontVariationSettings: "'FILL' 1" }}>schedule</span>
                                        </div>
                                        <span className="text-slate-400 text-xs font-bold font-display text-[11px] uppercase tracking-wider tabular-nums">TB 15p</span>
                                    </div>
                                    <h3 className="text-slate-500 text-sm font-medium">Thời gian khám TB</h3>
                                    <p className="text-3xl font-black mt-1 text-slate-900 dark:text-white">18.5 <span className="text-sm font-bold text-slate-400">phút</span></p>
                                    <div className="mt-4 h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                        <div className="h-full bg-blue-500 w-[65%]"></div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Charts Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Xu hướng bệnh nhân */}
                        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-200/60 dark:border-slate-800/60 shadow-sm transition-all duration-300 hover:shadow-md">
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
                                                    <linearGradient id="colorValueOut" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.2} />
                                                        <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                                                    </linearGradient>
                                                    <linearGradient id="colorValueIn" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.1} />
                                                        <stop offset="95%" stopColor="#94a3b8" stopOpacity={0} />
                                                    </linearGradient>
                                                </defs>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(203, 213, 225, 0.4)" />
                                                <XAxis
                                                    dataKey="month"
                                                    axisLine={false}
                                                    tickLine={false}
                                                    tick={<CustomXAxisTick length={mainStats.chartData.length} />}
                                                    interval={mainStats.chartData.length > 15 ? 6 : 0}
                                                />
                                                <YAxis hide domain={['auto', 'auto']} />
                                                <Tooltip content={<CustomTooltip />} />
                                                <Area
                                                    type="monotone"
                                                    dataKey="value"
                                                    name="Ngoại trú"
                                                    stackId="1"
                                                    stroke="#0ea5e9"
                                                    strokeWidth={3}
                                                    fillOpacity={1}
                                                    fill="url(#colorValueOut)"
                                                    dot={(props: any) => {
                                                        const { cx, cy, index } = props;
                                                        if (mainStats.chartData.length > 15 && index % 7 !== 0 && index !== mainStats.chartData.length - 1) return null;
                                                        return <circle key={`dot-out-${index}`} cx={cx} cy={cy} r={4} fill="#fff" stroke="#0ea5e9" strokeWidth={2} />;
                                                    }}
                                                />
                                                <Area
                                                    type="monotone"
                                                    dataKey="inpatientValue"
                                                    name="Nội trú"
                                                    stackId="1"
                                                    stroke="#94a3b8"
                                                    strokeWidth={2}
                                                    strokeDasharray="5 5"
                                                    fillOpacity={1}
                                                    fill="url(#colorValueIn)"
                                                    dot={(props: any) => {
                                                        const { cx, cy, index } = props;
                                                        if (mainStats.chartData.length > 15 && index % 7 !== 0 && index !== mainStats.chartData.length - 1) return null;
                                                        return <circle key={`dot-in-${index}`} cx={cx} cy={cy} r={3} fill="#fff" stroke="#94a3b8" strokeWidth={2} />;
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
                                                    <span className={`text-lg font-bold ${idx === 0 && item.trend !== undefined && !item.value.includes('0%') ? (item.trend ? 'text-emerald-500' : 'text-rose-500') : getMetricSummary().color}`}>
                                                        {item.value}
                                                    </span>
                                                    {item.trend !== undefined && (
                                                        <span className={`material-symbols-outlined text-sm ${item.value.includes('0%') ? getMetricSummary().color : (item.trend ? 'text-emerald-500' : 'text-rose-500')}`}>
                                                            {item.value.includes('0%') ? 'trending_flat' : (item.trend ? 'trending_up' : 'trending_down')}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Health Status Analysis (Stacked Bars) */}
                        <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-200/60 dark:border-slate-800/60 shadow-sm transition-all duration-300 hover:shadow-md flex flex-col">
                            {isLoading ? (
                                <div className="w-full animate-pulse space-y-10">
                                    <div className="space-y-3 text-left">
                                        <div className="h-7 bg-slate-200 dark:bg-slate-800 rounded w-40"></div>
                                        <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-32"></div>
                                    </div>
                                    <div className="space-y-6">
                                        {[1, 2, 3, 4].map(i => (
                                            <div key={i} className="space-y-2">
                                                <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded w-20"></div>
                                                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-full"></div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="w-full text-left mb-8">
                                        <h3 className="text-[22px] font-bold text-slate-900 dark:text-white tracking-tight">Phân tích Trạng thái</h3>
                                        <p className="text-[15px] text-slate-500 font-medium italic-none">Sức khỏe bệnh nhân theo nhóm bệnh</p>
                                    </div>

                                    <div className="flex-1 space-y-7">
                                        {[
                                            { name: 'Tiểu đường', stable: 65, mid: 20, risk: 15, color: 'emerald' },
                                            { name: 'Huyết áp', stable: 75, mid: 15, risk: 10, color: 'blue' },
                                            { name: 'Tim mạch', stable: 50, mid: 30, risk: 20, color: 'amber' },
                                            { name: 'Khác', stable: 85, mid: 10, risk: 5, color: 'slate' }
                                        ].map((item, i) => (
                                            <div key={i} className="group cursor-default">
                                                <div className="flex justify-between items-end mb-2">
                                                    <span className="text-[14px] font-bold text-slate-700 dark:text-slate-300">{item.name}</span>
                                                    <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{item.stable + item.mid + item.risk}% Tổng ca</span>
                                                </div>
                                                <div className="h-3 flex w-full rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800/50 shadow-inner">
                                                    <div className="h-full bg-emerald-500 transition-all duration-500 hover:brightness-110" style={{ width: `${item.stable}%` }} title="Ổn định"></div>
                                                    <div className="h-full bg-amber-400 transition-all duration-500 hover:brightness-110" style={{ width: `${item.mid}%` }} title="Trung bình"></div>
                                                    <div className="h-full bg-rose-500 transition-all duration-500 hover:brightness-110" style={{ width: `${item.risk}%` }} title="Nguy cơ cao"></div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mt-10 pt-6 border-t border-slate-50 dark:border-slate-800 flex flex-wrap gap-4 justify-center">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                                            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-tighter">Ổn định</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-2.5 h-2.5 rounded-full bg-amber-400"></div>
                                            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-tighter">Trung bình</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-2.5 h-2.5 rounded-full bg-rose-500"></div>
                                            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-tighter">Nguy cơ cao</span>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Disease Analytics Table */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 shadow-sm transition-all duration-300 hover:shadow-md overflow-hidden">
                        <div className="px-8 py-6 flex justify-between items-center border-b border-slate-50 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-800/10">
                            <div>
                                <h3 className="text-[18px] font-bold text-slate-900 dark:text-white tracking-tight">Phân tích Xu hướng & Rủi ro Bệnh lý</h3>
                                <p className="text-[13px] text-slate-500 font-medium">Dữ liệu tổng hợp từ các chỉ số lâm sàng của bệnh nhân</p>
                            </div>
                            <div className="relative">
                                <button
                                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-bold transition-all ${isFilterOpen ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-primary/10 text-primary hover:bg-primary/20'}`}
                                >
                                    <span className="material-symbols-outlined text-[18px]">filter_list</span>
                                    {activeFilter}
                                </button>
                                
                                {isFilterOpen && (
                                    <>
                                        <div className="fixed inset-0 z-[160]" onClick={() => setIsFilterOpen(false)}></div>
                                        <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-2xl p-2 z-[170] animate-in fade-in zoom-in-95 duration-200">
                                            {[
                                                { label: 'Tất cả nhóm bệnh', icon: 'list' },
                                                { label: 'Nhóm Nguy cơ cao', icon: 'error', color: 'text-rose-500' },
                                                { label: 'Nhóm Ổn định', icon: 'check_circle', color: 'text-emerald-500' },
                                                { label: 'Nhóm đang theo dõi', icon: 'visibility', color: 'text-amber-500' }
                                            ].map((filter) => (
                                                <button
                                                    key={filter.label}
                                                    onClick={() => {
                                                        setActiveFilter(filter.label);
                                                        setIsFilterOpen(false);
                                                    }}
                                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[13px] font-bold transition-all ${activeFilter === filter.label ? 'bg-slate-50 dark:bg-slate-800 text-primary' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'}`}
                                                >
                                                    <span className={`material-symbols-outlined text-[18px] ${filter.color || ''}`}>{filter.icon}</span>
                                                    {filter.label}
                                                </button>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-slate-50/50 dark:bg-slate-800/30 font-display border-b border-slate-100 dark:border-slate-800">
                                        <th className="px-8 py-5 text-[15px] font-medium text-slate-700">Nhóm bệnh mãn tính</th>
                                        <th className="px-8 py-5 text-[15px] font-medium text-slate-700">Số ca mắc</th>
                                        <th className="px-8 py-5 text-[15px] font-medium text-slate-700">Chỉ số trung bình</th>
                                        <th className="px-8 py-5 text-[15px] font-medium text-slate-700 text-center">Biến động rủi ro</th>
                                        <th className="px-8 py-5 text-[15px] font-medium text-slate-700">Đánh giá chung</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                                    {[
                                        { name: 'Tiểu đường Type 2', cases: '124', index: '7.2 mmol/L', risk: '+5.2%', status: 'Cần theo dõi', color: 'text-rose-500' },
                                        { name: 'Cao huyết áp', cases: '89', index: '135/85 mmHg', risk: '-2.1%', status: 'Kiểm soát tốt', color: 'text-emerald-500' },
                                        { name: 'Bệnh tim mạch', cases: '45', index: '78 bpm', risk: '+0.5%', status: 'Ổn định', color: 'text-blue-500' },
                                        { name: 'Rối loạn mỡ máu', cases: '67', index: '5.4 mmol/L', risk: '+1.2%', status: 'Bình thường', color: 'text-slate-500' }
                                    ].map((item, idx) => (
                                        <tr key={idx} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-all">
                                            <td className="px-8 py-5">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-2 h-8 rounded-full ${item.color.replace('text', 'bg')}`}></div>
                                                    <span className="font-bold text-slate-900 dark:text-white italic-none">{item.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5 font-bold text-slate-700 dark:text-slate-300 tabular-nums">{item.cases} ca</td>
                                            <td className="px-8 py-5">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[14px] font-black text-slate-900 dark:text-white italic-none">{item.index.split(' ')[0]}</span>
                                                    <span className="text-[11px] font-bold text-slate-400 uppercase leading-none">{item.index.split(' ').slice(1).join(' ')}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5 text-center">
                                                <span className={`text-[13px] font-bold px-3 py-1 rounded-lg ${item.risk.startsWith('+') ? 'text-rose-500 bg-rose-50 dark:bg-rose-500/10' : 'text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10'}`}>
                                                    {item.risk} {item.risk.startsWith('+') ? '↑' : '↓'}
                                                </span>
                                            </td>
                                            <td className="px-8 py-5">
                                                <div className="flex items-center gap-2">
                                                    <div className={`w-2 h-2 rounded-full ${item.color.replace('text', 'bg')} animate-pulse`}></div>
                                                    <span className={`text-[13px] font-bold ${item.color}`}>{item.status}</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
