import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { clinicApi } from '../api/clinic';
import ClinicSidebar from '../components/common/ClinicSidebar';
import TopBar from '../components/common/TopBar';
import Dropdown from '../components/ui/Dropdown';
import CreateDoctorModal from '../features/clinic/components/CreateDoctorModal';
import EditDoctorModal from '../features/clinic/components/EditDoctorModal';
import DoctorAssignmentModal from '../features/clinic/components/DoctorAssignmentModal';
import Toast from '../components/ui/Toast';
import DevelopmentModal from '../features/admin/components/DevelopmentModal';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

export default function ClinicDashboard() {
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [stats, setStats] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);

    const currentClinicId = localStorage.getItem('clinicId') || '1';


    const [notifications, setNotifications] = useState<any[]>([]);
    const [dashboardTimeRange, setDashboardTimeRange] = useState('6 tháng gần nhất');
    const [selectedChartMetric, setSelectedChartMetric] = useState('Lượng bệnh nhân');

    const doctors = stats?.doctorPerformances || [];
    const mainStats = {
        totalPatients: stats?.totalPatients || '0',
        highRiskAlerts: stats?.highRiskAlerts || '0',
        pendingFollowUps: stats?.pendingFollowUps || '0',
        patientGrowth: stats?.patientGrowth || '+0%',
        highRiskGrowth: stats?.highRiskGrowth || '0 ca',
        growthStats: stats?.growthStats || null,
        diseaseRatios: stats?.diseaseRatios?.map((dr: any) => ({
            ...dr,
            value: dr.percentage // Map percentage from backend to value used in frontend
        })) || [
                { color: 'bg-emerald-500', label: 'Tiểu đường', value: '40%' },
                { color: 'bg-amber-400', label: 'Cao huyết áp', value: '35%' },
                { color: 'bg-sky-400', label: 'Bệnh tim mạch', value: '25%' },
            ],
        chartData: selectedChartMetric === 'Lượng bệnh nhân'
            ? (stats?.patientGrowthChart && stats.patientGrowthChart.length > 0
                ? stats.patientGrowthChart.map((d: any) => ({
                    month: d.month,
                    value: d.value
                }))
                : [
                    { month: 'Tháng 12', value: 120 }, { month: 'Tháng 1', value: 156 }, { month: 'Tháng 2', value: 142 },
                    { month: 'Tháng 3', value: 188 }, { month: 'Tháng 4', value: 224 }
                ])
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
                    fill="#475569"
                    fontSize={14}
                    fontWeight={600}
                >
                    {payload.value}
                </text>
            </g>
        );
    };

    const getMetricSummary = () => {
        const color = selectedChartMetric === 'Chỉ số rủi ro' ? 'text-red-500' : selectedChartMetric === 'Tải lượng bác sĩ' ? 'text-emerald-500' : 'text-sky-500';
        const totalDoctorLoad = doctors.reduce((acc: number, d: any) => acc + (d.load || 0), 0);
        const avgLoad = doctors.length > 0 ? Math.round(totalDoctorLoad / doctors.length) : 0;

        const statsMap: Record<string, any[]> = {
            'Lượng bệnh nhân': [
                { label: 'Tăng trưởng', value: mainStats.patientGrowth, trend: mainStats.patientGrowth.startsWith('+'), icon: 'show_chart' },
                { label: 'Trung bình', value: mainStats.growthStats?.average || '0 ca/tháng', icon: 'analytics' },
                { label: 'Chỉ số rủi ro', value: mainStats.highRiskGrowth || '0 ca', trend: mainStats.highRiskGrowth?.startsWith('+') === false, icon: 'warning' }
            ],
            'Tải lượng bác sĩ': [
                { label: 'Tổng lượt khám', value: `${totalDoctorLoad} ca`, trend: true, icon: 'medical_services' },
                { label: 'TB/Bác sĩ', value: mainStats.growthStats?.peakMonth ? `Đỉnh: ${mainStats.growthStats.peakMonth}` : `${avgLoad} ca/tháng`, icon: 'person_apron' },
                { label: 'Đang quản lý', value: `${mainStats.totalPatients} Bệnh nhân`, icon: 'group' }
            ],
            'Chỉ số rủi ro': [
                { label: 'Tổng số rủi ro', value: `${mainStats.highRiskAlerts} ca`, trend: false, icon: 'emergency_home' },
                { label: 'Biến động', value: mainStats.highRiskGrowth || '0 ca', trend: mainStats.highRiskGrowth?.startsWith('+') === false, icon: 'analytics' },
                { label: 'Theo dõi sát', value: `${mainStats.pendingFollowUps} ca`, icon: 'pending' }
            ]
        };
        return { color, items: statsMap[selectedChartMetric] || [] };
    };


    // Modal & Toast States
    const [showCreateDoctorModal, setShowCreateDoctorModal] = useState(false);
    const [showEditDoctorModal, setShowEditDoctorModal] = useState(false);
    const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
    const [isSavingDoctor, setIsSavingDoctor] = useState(false);
    const [showAssignmentModal, setShowAssignmentModal] = useState(false);
    const [showExportModal, setShowExportModal] = useState(false);
    const [hoveredSegment, setHoveredSegment] = useState<number | null>(null);

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
                <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-4 border border-slate-100 dark:border-slate-800 rounded-xl shadow-xl">
                    <p className="text-[14.5px] font-bold text-slate-800 dark:text-slate-100 mb-1">{label}</p>
                    <div className="flex items-center gap-2">
                        <p className={`text-[15.5px] font-black ${getColor()}`}>
                            {payload[0].value} <span className="text-slate-500 font-medium text-[13px]">{getSuffix()}</span>
                        </p>
                    </div>
                </div>
            );
        }
        return null;
    };
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    const fetchDashboardData = async (isSilent = false) => {
        if (!isSilent) setIsLoading(true);
        else setIsUpdating(true);

        try {
            const periodMap: Record<string, string> = {
                '7 ngày qua': '7d',
                '30 ngày qua': '30d',
                '6 tháng gần nhất': '6m',
                'Năm nay': '1y'
            };
            const res = await clinicApi.getDashboard(currentClinicId, periodMap[dashboardTimeRange] || '6m');
            if (res.success) {
                setStats(res.data);
            }
        } catch (error) {
            console.error('Failed to fetch dashboard data:', error);
        } finally {
            setIsLoading(false);
            setIsUpdating(false);
        }
    };

    useEffect(() => {
        // First load gets the full skeleton
        // Subsequent time range changes only load the chart box
        fetchDashboardData(stats !== null);
    }, [currentClinicId, dashboardTimeRange]);

    const handleSaveDoctor = async (doctorData: any) => {
        setIsSavingDoctor(true);
        try {
            const res = await clinicApi.createDoctor(currentClinicId, doctorData);
            if (res.success) {
                fetchDashboardData();
                setShowCreateDoctorModal(false);
                setToastMessage(`Đã thêm bác sĩ ${doctorData.name} thành công!`);
                setShowToast(true);
            }
        } catch (error) {
            console.error('Failed to create doctor:', error);
            setToastMessage('Lỗi khi thêm bác sĩ');
            setShowToast(true);
        } finally {
            setIsSavingDoctor(false);
        }
    };

    const handleUpdateDoctor = async (doctorData: any) => {
        setIsSavingDoctor(true);
        try {
            const res = await clinicApi.updateDoctor(currentClinicId, doctorData.dbId, doctorData);
            if (res.success) {
                fetchDashboardData();
                setShowEditDoctorModal(false);
                setToastMessage(`Đã cập nhật bác sĩ ${doctorData.name} thành công!`);
                setShowToast(true);
            }
        } catch (error) {
            console.error('Failed to update doctor:', error);
            setToastMessage('Lỗi khi cập nhật bác sĩ');
            setShowToast(true);
        } finally {
            setIsSavingDoctor(false);
        }
    };

    const handleExportExcel = () => {
        setShowExportModal(true);
    };

    return (
        <div className="flex min-h-screen font-display bg-[#f6f8f7] dark:bg-slate-950 text-slate-900 dark:text-slate-100">
            {/* Sidebar Navigation */}
            <ClinicSidebar
                isSidebarOpen={isSidebarOpen}
                userName="Admin Sarah"
                userRole="Senior Manager"
                userAvatar="https://lh3.googleusercontent.com/aida-public/AB6AXuDs9fuTZde7EUIINhAwZDAYbGdWhfZuvszHFDZODEHBxXo3hRWmKfCmGfg6Xgckf0DONyYs8LQEOXng1sISGQVj9ec2pSs--Gz-xPlj6elGIG3KtZTO9U-57mPPcUxuNMtJbLamHmXAsWrVwobD4Ai-pKgNGU0yfv596RmDCRUawQMx8gmW7E2J_we-R_YITLa95pCcbtDZf6tkb7C6bWKKzwepNG2pc4L5uji1KMHQetqk8390TVAlxrRao3qco3laKWLu0uA-BmQ"
                isLoading={isLoading}
            />

            {/* Main Content Area */}
            <main className="flex-1 lg:ml-72 min-h-screen flex flex-col">
                {/* Mobile Sidebar Overlay */}
                {isSidebarOpen && (
                    <div
                        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[140] lg:hidden animate-in fade-in duration-300"
                        onClick={() => setIsSidebarOpen(false)}
                    ></div>
                )}
                {/* Header */}
                <TopBar
                    setIsSidebarOpen={setIsSidebarOpen}
                    notifications={notifications}
                    setNotifications={setNotifications}
                />

                <div className="p-8 space-y-8">
                    {/* Welcome Section */}
                    <section className="flex flex-wrap items-center justify-between gap-4">
                        <div className="space-y-1">
                            {isLoading ? (
                                <div className="space-y-2">
                                    <div className="h-7 bg-slate-200 dark:bg-slate-800 animate-pulse rounded w-64"></div>
                                    <div className="h-4 bg-slate-100 dark:bg-slate-800 animate-pulse rounded w-80"></div>
                                </div>
                            ) : (
                                <>
                                    <h3 className="text-[23px] font-bold tracking-tight text-slate-900 dark:text-white">Tổng quan vận hành hôm nay</h3>
                                    <p className="text-slate-600 dark:text-slate-400 font-semibold text-[15px]">
                                        {stats?.insights?.[0] || 'Thông tin vận hành phòng khám đang được cập nhật...'}
                                    </p>
                                </>
                            )}
                        </div>
                        <div className="flex flex-wrap gap-3">
                            {isLoading ? (
                                <>
                                    <div className="w-44 h-10 bg-white dark:bg-slate-800 animate-pulse rounded-xl shadow-sm border border-slate-100 dark:border-slate-800"></div>
                                    <div className="w-40 h-10 bg-primary/20 dark:bg-slate-800 animate-pulse rounded-xl shadow-sm"></div>
                                    <div className="w-48 h-10 bg-teal-50/50 dark:bg-slate-800 animate-pulse rounded-xl border border-teal-100/30"></div>
                                </>
                            ) : (
                                <>
                                    {stats?.insights?.length > 1 && (
                                        <div className="flex items-center gap-2 bg-amber-50 dark:bg-amber-900/20 px-4 py-2 rounded-xl border border-amber-100 dark:border-amber-800 animate-in fade-in slide-in-from-right duration-500">
                                            <span className="material-symbols-outlined text-amber-600 dark:text-amber-400 text-[20px] animate-pulse">new_releases</span>
                                            <p className="text-[14px] font-bold text-amber-700 dark:text-amber-300">
                                                Cảnh báo mới: {stats.insights[1]}
                                            </p>
                                        </div>
                                    )}
                                    <button
                                        onClick={handleExportExcel}
                                        className="bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all border border-slate-200 dark:border-slate-800 shadow-sm"
                                    >
                                        <span className="material-symbols-outlined text-emerald-500 text-[20px]">upload_file</span>
                                        Xuất Excel
                                    </button>
                                    <button
                                        onClick={() => setShowCreateDoctorModal(true)}
                                        className="bg-primary text-white px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2 hover:shadow-lg hover:shadow-primary/20 transition-all font-display whitespace-nowrap shadow-sm"
                                    >
                                        <span className="material-symbols-outlined text-[20px]">add</span>
                                        Thêm bác sĩ mới
                                    </button>
                                    <button
                                        onClick={() => {
                                            if (doctors.length > 0) {
                                                setShowAssignmentModal(true);
                                            } else {
                                                setToastMessage('Vui lòng thêm bác sĩ trước khi thực hiện phân công');
                                                setShowToast(true);
                                            }
                                        }}
                                        className="bg-indigo-500 text-white px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2 hover:shadow-lg hover:shadow-indigo-500/20 transition-all font-display whitespace-nowrap shadow-sm"
                                    >
                                        <span className="material-symbols-outlined text-[20px]">assignment_ind</span>
                                        Phân công bệnh nhân
                                    </button>
                                </>
                            )}
                        </div>
                    </section>

                    {/* Stats Bento Grid */}
                    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 font-display">
                        {isLoading ? (
                            [...Array(4)].map((_, i) => (
                                <div key={i} className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-primary/5 shadow-sm space-y-4">
                                    <div className="flex justify-between items-start">
                                        <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 animate-pulse rounded-lg"></div>
                                        <div className="h-5 bg-slate-100 dark:bg-slate-800 animate-pulse rounded-full w-12"></div>
                                    </div>
                                    <div className="h-4 bg-slate-100 dark:bg-slate-800/50 animate-pulse rounded w-32"></div>
                                    <div className="h-8 bg-slate-200 dark:bg-slate-800 animate-pulse rounded w-20"></div>
                                </div>
                            ))
                        ) : (
                            <>
                                {/* Total Patients */}
                                <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/60 dark:border-slate-800/80 shadow-sm hover:shadow-md transition-all duration-300">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                                            <span className="material-symbols-outlined size-6" style={{ fontVariationSettings: "'FILL' 1" }}>groups</span>
                                        </div>
                                        <span className={`text-[13px] font-bold flex items-center gap-1 ${mainStats.patientGrowth.includes('0%') ? 'text-slate-500' : (mainStats.patientGrowth.startsWith('+') ? 'text-emerald-500' : 'text-red-500')}`}>
                                            {mainStats.patientGrowth}
                                            <span className="material-symbols-outlined text-xs">{mainStats.patientGrowth.includes('0%') ? 'trending_flat' : (mainStats.patientGrowth.startsWith('+') ? 'trending_up' : 'trending_down')}</span>
                                        </span>
                                    </div>
                                    <h3 className="text-slate-500 text-sm font-medium">Tổng số bệnh nhân</h3>
                                    <p className="text-3xl font-extrabold mt-1 italic-none">{mainStats.totalPatients}</p>
                                </div>

                                {/* Disease Ratio */}
                                <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/60 dark:border-slate-800/80 shadow-sm hover:shadow-md transition-all duration-300">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center text-amber-500">
                                            <span className="material-symbols-outlined size-6" style={{ fontVariationSettings: "'FILL' 1" }}>monitoring</span>
                                        </div>
                                        <span className="px-2 py-1 bg-amber-50 dark:bg-amber-900/50 text-amber-600 text-[12px] font-bold rounded-full">
                                            {mainStats.diseaseRatios[0]?.label} {mainStats.diseaseRatios[0]?.value}
                                        </span>
                                    </div>
                                    <h3 className="text-slate-500 text-sm font-medium">Tỷ lệ bệnh theo loại</h3>
                                    <div className="flex items-baseline gap-2 mt-1">
                                        <p className="text-3xl font-extrabold italic-none">{mainStats.diseaseRatios[0]?.value}</p>
                                        <span className="text-slate-400 text-xs font-medium">/ {mainStats.diseaseRatios[1]?.label}</span>
                                    </div>
                                </div>

                                {/* High Risk Alerts */}
                                <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/60 dark:border-slate-800/80 shadow-sm hover:shadow-md transition-all duration-300">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center text-red-500">
                                            <span className="material-symbols-outlined size-6" style={{ fontVariationSettings: "'FILL' 1" }}>warning</span>
                                        </div>
                                        <span className="px-2 py-1 bg-red-500 text-white text-[12px] font-bold rounded-full animate-pulse">Cần chú ý</span>
                                    </div>
                                    <h3 className="text-slate-500 text-sm font-medium">Ca nguy cơ cao</h3>
                                    <div className="flex items-baseline gap-2 mt-1">
                                        <p className="text-3xl font-extrabold text-red-500 italic-none">{mainStats.highRiskAlerts}</p>
                                        <p className="text-[13px] text-red-400 font-bold">{mainStats.highRiskGrowth}</p>
                                    </div>
                                </div>

                                {/* Pending follow-up */}
                                <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/60 dark:border-slate-800/80 shadow-sm hover:shadow-md transition-all duration-300">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center text-blue-500">
                                            <span className="material-symbols-outlined size-6" style={{ fontVariationSettings: "'FILL' 1" }}>event_busy</span>
                                        </div>
                                    </div>
                                    <h3 className="text-slate-500 text-sm font-medium">Chưa tái khám</h3>
                                    <p className="text-3xl font-extrabold mt-1 italic-none">{mainStats.pendingFollowUps}</p>
                                </div>
                            </>
                        )}
                    </section>

                    {/* Charts Section */}
                    <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* New Patients Chart */}
                        <div className={`lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/60 dark:border-slate-800/70 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between relative ${isUpdating ? 'opacity-60 pointer-events-none' : ''}`}>
                            {isUpdating && (
                                <div className="absolute inset-0 bg-white/40 dark:bg-slate-900/40 backdrop-blur-[2px] z-10 flex items-center justify-center rounded-2xl">
                                    <div className="flex flex-col items-center gap-3">
                                        <div className="w-8 h-8 border-4 border-sky-500/30 border-t-sky-500 rounded-full animate-spin"></div>
                                        <p className="text-[12px] font-bold text-sky-600">Đang cập nhật biểu đồ...</p>
                                    </div>
                                </div>
                            )}
                            {isLoading ? (
                                <div className="space-y-12 animate-pulse">
                                    <div className="flex justify-between items-center">
                                        <div className="space-y-3">
                                            <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-48"></div>
                                            <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-64"></div>
                                        </div>
                                        <div className="w-32 h-10 bg-slate-100 dark:bg-slate-800 rounded-xl"></div>
                                    </div>
                                    <div className="flex items-end justify-between h-48 gap-4 px-4 overflow-hidden">
                                        {[...Array(6)].map((_, i) => (
                                            <div key={i} className="flex-1 space-y-4">
                                                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-t-2xl" style={{ height: `${Math.random() * 60 + 20}%` }}></div>
                                                <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded"></div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="grid grid-cols-3 gap-4 border-t border-slate-50 pt-8">
                                        <div className="space-y-3 flex flex-col items-center">
                                            <div className="w-16 h-3 bg-slate-100 dark:bg-slate-800 rounded"></div>
                                            <div className="w-12 h-6 bg-slate-200 dark:bg-slate-800 rounded"></div>
                                        </div>
                                        <div className="space-y-3 flex flex-col items-center">
                                            <div className="w-16 h-3 bg-slate-100 dark:bg-slate-800 rounded"></div>
                                            <div className="w-24 h-6 bg-slate-200 dark:bg-slate-800 rounded"></div>
                                        </div>
                                        <div className="space-y-3 flex flex-col items-center">
                                            <div className="w-16 h-3 bg-slate-100 dark:bg-slate-800 rounded"></div>
                                            <div className="w-20 h-6 bg-slate-200 dark:bg-slate-800 rounded"></div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div>
                                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                                            <div>
                                                <h2 className="text-[18px] font-bold text-slate-700 dark:text-white tracking-tight">Thống kê vận hành phòng khám</h2>
                                                <p className="text-[14px] text-slate-500 font-medium mt-1">Báo cáo chi tiết theo {selectedChartMetric.toLowerCase()}</p>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700/50">
                                                    {['Lượng bệnh nhân', 'Tải lượng bác sĩ', 'Chỉ số rủi ro'].map((m) => (
                                                        <button
                                                            key={m}
                                                            onClick={() => setSelectedChartMetric(m)}
                                                            className={`px-3 py-1.5 text-[13px] font-bold rounded-lg transition-all ${selectedChartMetric === m
                                                                ? `bg-white dark:bg-slate-700 ${selectedChartMetric === 'Chỉ số rủi ro' ? 'text-red-500' : selectedChartMetric === 'Tải lượng bác sĩ' ? 'text-emerald-500' : 'text-sky-500'} shadow-sm font-bold border border-slate-200/60`
                                                                : 'text-slate-600 hover:text-slate-700'
                                                                }`}
                                                        >
                                                            {m}
                                                        </button>
                                                    ))}
                                                </div>
                                                <Dropdown
                                                    options={['7 ngày qua', '30 ngày qua', '6 tháng gần nhất', 'Năm nay']}
                                                    value={dashboardTimeRange}
                                                    onChange={setDashboardTimeRange}
                                                    className="min-w-[150px]"
                                                />
                                            </div>
                                        </div>
                                        <div className="h-[220px] w-full mt-4">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <AreaChart data={mainStats.chartData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                                                    <defs>
                                                        <linearGradient id="colorValueClinic" x1="0" y1="0" x2="0" y2="1">
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
                                                        fill="url(#colorValueClinic)"
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
                                    </div>

                                    {/* Key Stats Bar at Bottom to Balance Height */}
                                    <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-50 dark:border-slate-800/50 mt-6 pb-2">
                                        {getMetricSummary().items.map((item, idx) => (
                                            <div key={idx} className={`flex flex-col items-center ${idx === 1 ? 'border-x border-slate-100 dark:border-slate-800/50' : ''}`}>
                                                <p className="text-[15px] font-semibold text-slate-500 mb-1.5 flex items-center gap-1.5">
                                                    <span className="material-symbols-outlined text-[22px]">{item.icon}</span>
                                                    {item.label}
                                                </p>
                                                <div className="flex items-center gap-1.5">
                                                    <span className={`text-[17px] font-black ${idx === 0 && item.trend !== undefined && !item.value.includes('0%') ? (item.trend ? 'text-emerald-500' : 'text-red-500') : getMetricSummary().color}`}>
                                                        {item.value}
                                                    </span>
                                                    {idx === 0 && item.trend !== undefined && (
                                                        <span className={`material-symbols-outlined text-[13px] ${item.value.includes('0%') ? getMetricSummary().color : (item.trend ? 'text-emerald-500' : 'text-red-500')}`}>
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

                        {/* Pathology Pie Chart */}
                        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/60 dark:border-slate-800/70 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between">
                            {isLoading ? (
                                <div className="space-y-10 animate-pulse">
                                    <div className="space-y-3">
                                        <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-40"></div>
                                        <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-32"></div>
                                    </div>
                                    <div className="relative w-48 h-48 mx-auto">
                                        <div className="w-full h-full rounded-full border-[10px] border-slate-100 dark:border-slate-800 flex items-center justify-center">
                                            <div className="w-16 h-6 bg-slate-200 dark:bg-slate-800 rounded"></div>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        {[...Array(3)].map((_, i) => (
                                            <div key={i} className="flex justify-between items-center p-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-3 h-3 rounded-full bg-slate-100 dark:bg-slate-800"></div>
                                                    <div className="w-20 h-4 bg-slate-100 dark:bg-slate-800 rounded"></div>
                                                </div>
                                                <div className="w-8 h-4 bg-slate-200 dark:bg-slate-800 rounded"></div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div>
                                        <h3 className="text-[18px] font-bold text-slate-700">Cơ cấu bệnh lý</h3>
                                        <p className="text-[14px] text-slate-500 font-medium mt-1">Phân tích theo danh mục</p>
                                    </div>
                                    <div className="relative w-48 h-48 mx-auto my-10">
                                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                                            <circle className="stroke-slate-100 dark:stroke-slate-800" cx="18" cy="18" fill="none" r="15" pathLength="100" strokeWidth="4"></circle>

                                            {/* Dynamic segments based on diseaseRatios */}
                                            {(() => {
                                                let currentOffset = 0;
                                                const totalValue = mainStats.diseaseRatios.reduce((acc: number, item: any) => acc + (parseInt(String(item.value).replace('%', '')) || 0), 0);

                                                // Pre-calculate all segment properties to keep offsets consistent
                                                const segments = mainStats.diseaseRatios.map((item: any, idx: number) => {
                                                    const percentage = parseInt(String(item.value).replace('%', '')) || 0;
                                                    if (percentage <= 0) return null;

                                                    const normalizedPercentage = (percentage / (totalValue || 100)) * 100;
                                                    const dashArray = `${normalizedPercentage} 100`;
                                                    const dashOffset = -currentOffset;
                                                    currentOffset += normalizedPercentage;

                                                    let strokeClass = "stroke-emerald-500";
                                                    if (item.color.includes("amber") || item.color.includes("yellow")) strokeClass = "stroke-amber-400";
                                                    if (item.color.includes("blue") || item.color.includes("sky")) strokeClass = "stroke-sky-400";
                                                    if (item.color.includes("indigo")) strokeClass = "stroke-indigo-400";
                                                    if (item.color.includes("teal")) strokeClass = "stroke-teal-500";
                                                    if (item.color.includes("primary")) strokeClass = "stroke-sky-500";
                                                    if (item.color.includes("emerald")) strokeClass = "stroke-emerald-500";
                                                    if (item.color.includes("slate") || item.color.includes("gray")) strokeClass = "stroke-slate-400";
                                                    if (item.color.includes("rose") || item.color.includes("pink")) strokeClass = "stroke-rose-400";

                                                    return { idx, strokeClass, dashArray, dashOffset };
                                                }).filter(Boolean);

                                                // Draw in two passes: non-hovered first, then hovered last to be on top
                                                return (
                                                    <>
                                                        {(segments as any[]).filter(s => s.idx !== hoveredSegment).map(s => (
                                                            <circle
                                                                key={s.idx}
                                                                className={`${s.strokeClass} cursor-pointer transition-all duration-300 ease-in-out`}
                                                                cx="18" cy="18" fill="none" r="15"
                                                                pathLength="100"
                                                                strokeDasharray={s.dashArray}
                                                                strokeDashoffset={s.dashOffset}
                                                                strokeWidth="4"
                                                                strokeLinecap="round"
                                                                onMouseEnter={() => setHoveredSegment(s.idx)}
                                                                onMouseLeave={() => setHoveredSegment(null)}
                                                            ></circle>
                                                        ))}
                                                        {(segments as any[]).filter(s => s.idx === hoveredSegment).map(s => (
                                                            <circle
                                                                key={s.idx}
                                                                className={`${s.strokeClass} cursor-pointer transition-all duration-300 ease-in-out`}
                                                                cx="18" cy="18" fill="none" r="15"
                                                                pathLength="100"
                                                                strokeDasharray={s.dashArray}
                                                                strokeDashoffset={s.dashOffset}
                                                                strokeWidth="6"
                                                                strokeLinecap="round"
                                                                onMouseEnter={() => setHoveredSegment(s.idx)}
                                                                onMouseLeave={() => setHoveredSegment(null)}
                                                                style={{ filter: 'drop-shadow(0 0 2px rgba(0,0,0,0.1))' }}
                                                            ></circle>
                                                        ))}
                                                    </>
                                                );
                                            })()}
                                        </svg>
                                        <div className="absolute inset-0 flex flex-col items-center justify-center font-display pointer-events-none">
                                            <span className="text-3xl font-bold text-slate-900 dark:text-white transition-all duration-300">
                                                {hoveredSegment !== null
                                                    ? mainStats.diseaseRatios[hoveredSegment].value
                                                    : mainStats.totalPatients}
                                            </span>
                                            <span className="text-[14px] font-medium text-slate-400 mt-1 transition-all duration-300 text-center px-4">
                                                {hoveredSegment !== null
                                                    ? mainStats.diseaseRatios[hoveredSegment].label
                                                    : 'Bệnh nhân'}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        {mainStats.diseaseRatios.map((item: any, idx: number) => (
                                            <div
                                                key={idx}
                                                className={`flex justify-between items-center p-3 rounded-xl border transition-all duration-300 cursor-pointer ${hoveredSegment === idx ? 'bg-white dark:bg-slate-700 shadow-md border-slate-200 dark:border-slate-600 scale-[1.02]' : 'bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-700/50'}`}
                                                onMouseEnter={() => setHoveredSegment(idx)}
                                                onMouseLeave={() => setHoveredSegment(null)}
                                            >
                                                <div className="flex items-center gap-3 min-w-0">
                                                    <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${item.color}`}></div>
                                                    <span className={`font-bold text-[13px] truncate transition-colors ${hoveredSegment === idx ? 'text-primary' : 'text-slate-700 dark:text-slate-200'}`}>{item.label}</span>
                                                </div>
                                                <span className="text-[13px] font-black text-slate-900 dark:text-white ml-2 flex-shrink-0">{item.value}</span>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    </section>

                    {/* Doctor Performance Table */}
                    <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800/70 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
                        <div className="px-8 py-6 border-b border-slate-50 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div>
                                {isLoading ? (
                                    <>
                                        <div className="h-7 bg-slate-200 dark:bg-slate-800 animate-pulse rounded w-48 mb-1.5"></div>
                                        <div className="h-4 bg-slate-100 dark:bg-slate-800 animate-pulse rounded w-64"></div>
                                    </>
                                ) : (
                                    <>
                                        <h3 className="text-[19px] font-semibold text-slate-900 dark:text-white tracking-tight">Hiệu suất Bác sĩ</h3>
                                        <p className="text-[14px] text-slate-500 font-medium">Tổng hợp đánh giá và tải lượng bệnh nhân</p>
                                    </>
                                )}
                            </div>
                            {isLoading ? (
                                <div className="h-5 bg-slate-100 dark:bg-slate-800 animate-pulse rounded w-28"></div>
                            ) : (
                                <button
                                    onClick={() => navigate('/clinic/doctors')}
                                    className="text-emerald-600 dark:text-emerald-400 font-bold text-sm flex items-center gap-1 transition-all hover:gap-2"
                                >
                                    Xem tất cả <span className="material-symbols-outlined text-sm">arrow_forward</span>
                                </button>
                            )}
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-slate-50 dark:bg-slate-800/50 font-display">
                                        <th className="px-8 py-5">
                                            {isLoading ? <div className="h-4 bg-slate-200 dark:bg-slate-800 animate-pulse rounded w-24"></div> : <span className="text-[15px] font-medium text-slate-700">Tên bác sĩ</span>}
                                        </th>
                                        <th className="px-8 py-5">
                                            {isLoading ? <div className="h-4 bg-slate-200 dark:bg-slate-800 animate-pulse rounded w-32"></div> : <span className="text-[15px] font-medium text-slate-700">Chuyên khoa</span>}
                                        </th>
                                        <th className="px-8 py-5">
                                            {isLoading ? <div className="h-4 bg-slate-200 dark:bg-slate-800 animate-pulse rounded w-16 mx-auto"></div> : <span className="text-[15px] font-medium text-slate-700 text-center block">Tải lượng</span>}
                                        </th>
                                        <th className="px-8 py-5">
                                            {isLoading ? <div className="h-4 bg-slate-200 dark:bg-slate-800 animate-pulse rounded w-20"></div> : <span className="text-[15px] font-medium text-slate-700">Đánh giá</span>}
                                        </th>
                                        <th className="px-8 py-5">
                                            {isLoading ? <div className="h-4 bg-slate-200 dark:bg-slate-800 animate-pulse rounded w-24"></div> : <span className="text-[15px] font-medium text-slate-700">Trạng thái</span>}
                                        </th>
                                        <th className="px-8 py-5 text-right">
                                            {isLoading ? <div className="h-4 bg-slate-200 dark:bg-slate-800 animate-pulse rounded w-16 ml-auto"></div> : <span className="text-[15px] font-medium text-slate-700">Thao tác</span>}
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                                    {isLoading ? (
                                        [...Array(4)].map((_, i) => (
                                            <tr key={`dr-row-skeleton-${i}`} className="animate-pulse">
                                                <td className="px-8 py-5">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-11 h-11 bg-slate-100/50 dark:bg-slate-800/50 rounded-full"></div>
                                                        <div className="space-y-2">
                                                            <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-24"></div>
                                                            <div className="h-3 bg-slate-50 dark:bg-slate-800/50 rounded w-16"></div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-5">
                                                    <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-28"></div>
                                                </td>
                                                <td className="px-8 py-5 text-center">
                                                    <div className="space-y-2 max-w-[120px] mx-auto">
                                                        <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-8 mx-auto"></div>
                                                        <div className="w-full h-1.5 bg-slate-50 dark:bg-slate-800 rounded-full"></div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-5">
                                                    <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-16"></div>
                                                </td>
                                                <td className="px-8 py-5">
                                                    <div className="h-7 bg-slate-100 dark:bg-slate-800 rounded-full w-24"></div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : doctors.map((dr: any, idx: number) => (
                                        <tr
                                            key={dr.dbId || idx}
                                            className="group hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-all cursor-pointer active:bg-slate-100"
                                            onClick={() => {
                                                setSelectedDoctor(dr);
                                                setShowEditDoctorModal(true);
                                            }}
                                        >
                                            <td className="px-8 py-5">
                                                <div className="flex items-center gap-4">
                                                    <div className="relative shrink-0">
                                                        <img
                                                            className="size-11 rounded-full object-cover border-2 border-primary/10"
                                                            src={dr.img || `https://ui-avatars.com/api/?name=${encodeURIComponent(dr.name)}&background=random`}
                                                            alt={dr.name}
                                                            onError={(e) => {
                                                                e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(dr.name)}&background=random`;
                                                            }}
                                                        />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-slate-700 dark:text-white transition-colors">
                                                            {dr.degree === 'Tiến sĩ' ? 'TS. ' : dr.degree === 'Thạc sĩ' ? 'ThS. ' : 'Bác sĩ '}
                                                            {dr.name}
                                                        </p>
                                                        <p className="text-[13px] text-slate-500 font-medium">{dr.id}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5 text-[14px] font-medium text-slate-700">{dr.specialty || 'Đa khoa'}</td>
                                            <td className="px-8 py-5">
                                                <div className="flex flex-col items-center gap-1.5 min-w-[100px]">
                                                    <span className="text-[15px] font-medium text-slate-700 dark:text-slate-200">{dr.load} ca</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5">
                                                <div className="flex items-center gap-1.5 text-amber-400">
                                                    <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                                    {dr.rating && dr.rating !== 'N/A' ? (
                                                        <>
                                                            <span className="text-[15px] font-bold text-slate-700 dark:text-slate-200">{dr.rating}</span>
                                                            <span className="text-[13.5px] text-slate-400 font-medium">({dr.reviews})</span>
                                                        </>
                                                    ) : (
                                                        <span className="text-[13.5px] text-slate-400 font-medium italic">Chưa có đánh giá</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-8 py-5">
                                                <span className={`px-4 py-1.5 rounded-full text-[13px] font-bold text-white shadow-sm whitespace-nowrap ${dr.active ? 'bg-emerald-500' : 'bg-slate-400'}`}>
                                                    {dr.status}
                                                </span>
                                            </td>
                                            <td className="px-8 py-5 text-right">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setSelectedDoctor(dr);
                                                        setShowEditDoctorModal(true);
                                                    }}
                                                    className="p-2 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-xl transition-all"
                                                    title="Chỉnh sửa"
                                                >
                                                    <span className="material-symbols-outlined text-[20px]">edit_square</span>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>
                </div>

                {/* Modals & Toasts */}
                <CreateDoctorModal
                    isOpen={showCreateDoctorModal}
                    onClose={() => setShowCreateDoctorModal(false)}
                    isSaving={isSavingDoctor}
                    onSave={handleSaveDoctor}
                />

                <EditDoctorModal
                    isOpen={showEditDoctorModal}
                    onClose={() => setShowEditDoctorModal(false)}
                    isSaving={isSavingDoctor}
                    onSave={handleUpdateDoctor}
                    initialData={selectedDoctor}
                />

                <DoctorAssignmentModal
                    isOpen={showAssignmentModal}
                    onClose={() => setShowAssignmentModal(false)}
                    doctorData={doctors[0]} // Using first doctor as example for general assignment
                />

                <DevelopmentModal
                    isOpen={showExportModal}
                    onClose={() => setShowExportModal(false)}
                    featureName="Xuất báo cáo Excel"
                />

                <Toast
                    show={showToast}
                    title={toastMessage}
                    onClose={() => setShowToast(false)}
                />
            </main>
        </div>
    );
}
