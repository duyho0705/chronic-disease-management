import { useState, useEffect } from 'react';
import axios from '../api/axios';
import ClinicSidebar from '../components/common/ClinicSidebar';
import TopBar from '../components/common/TopBar';
import Dropdown from '../components/ui/Dropdown';
import CreateDoctorModal from '../features/clinic/components/CreateDoctorModal';
import DoctorAssignmentModal from '../features/clinic/components/DoctorAssignmentModal';
import Toast from '../components/ui/Toast';
import DevelopmentModal from '../features/admin/components/DevelopmentModal';

export default function ClinicDashboard() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [stats, setStats] = useState<any>(null);
    const currentClinicId = localStorage.getItem('clinicId') || '1';

    const doctors = stats?.doctorPerformances || [];
    const mainStats = {
        totalPatients: stats?.totalPatients || '0',
        highRiskAlerts: stats?.highRiskAlerts || '0',
        pendingFollowUps: stats?.pendingFollowUps || '0',
        patientGrowth: stats?.patientGrowth || '+0%',
        highRiskGrowth: stats?.highRiskGrowth || '+0 ca',
        diseaseRatios: stats?.diseaseRatios || [
            { color: 'bg-emerald-500', label: 'Tiểu đường', value: '40%' },
            { color: 'bg-amber-400', label: 'Cao huyết áp', value: '35%' },
            { color: 'bg-sky-400', label: 'Bệnh tim mạch', value: '25%' },
        ],
        chartData: stats?.patientGrowthChart || [
            { month: 'T.1', height: '30%', active: false },
            { month: 'T.2', height: '30%', active: false },
            { month: 'T.3', height: '30%', active: false },
            { month: 'T.4', height: '30%', active: false },
            { month: 'T.5', height: '30%', active: false },
            { month: 'T.6', height: '30%', active: false },
        ]
    };

    const [notifications, setNotifications] = useState([
        { id: 1, title: 'Báo cáo mới', description: 'Có báo cáo tổng quát tháng 12 vừa được tạo.', time: '5 phút trước', read: false },
        { id: 2, title: 'Cảnh báo nguy cơ', description: 'Bệnh nhân Nguyễn Văn An có chỉ số bất thường.', time: '1 giờ trước', read: false },
    ]);
    const [dashboardTimeRange, setDashboardTimeRange] = useState('Năm 2024');

    // Modal & Toast States
    const [showCreateDoctorModal, setShowCreateDoctorModal] = useState(false);
    const [isSavingDoctor, setIsSavingDoctor] = useState(false);
    const [showAssignmentModal, setShowAssignmentModal] = useState(false);
    const [showExportModal, setShowExportModal] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    const fetchDashboardData = async () => {
        try {
            const response = await axios.get(`/v1/clinics/${currentClinicId}/dashboard`);
            if (response.data.success) {
                setStats(response.data.data);
            }
        } catch (error) {
            console.error('Failed to fetch dashboard data:', error);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, [currentClinicId]);

    const handleSaveDoctor = async (doctorData: any) => {
        setIsSavingDoctor(true);
        try {
            const response = await axios.post(`/v1/clinics/${currentClinicId}/doctors`, doctorData);
            if (response.data.success) {
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
                            <h3 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">Chào buổi sáng, Quản trị viên</h3>
                            <p className="text-slate-500 font-medium">Hôm nay có 45 bệnh nhân cần theo dõi tái khám.</p>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            <button
                                onClick={handleExportExcel}
                                className="bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-800 px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-slate-50 transition-all active:scale-95"
                            >
                                <span className="material-symbols-outlined text-emerald-500">upload_file</span>
                                Xuất báo cáo Excel
                            </button>
                            <button
                                onClick={() => setShowCreateDoctorModal(true)}
                                className="bg-primary text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 hover:shadow-lg hover:shadow-primary/20 transition-all active:scale-95"
                            >
                                <span className="material-symbols-outlined">person_add</span>
                                Thêm bác sĩ mới
                            </button>
                            <button
                                onClick={() => setShowAssignmentModal(true)}
                                className="bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-teal-100 transition-all border border-teal-100/50 dark:border-teal-800/50 active:scale-95"
                            >
                                <span className="material-symbols-outlined">assignment_ind</span>
                                Phân công bệnh nhân
                            </button>
                        </div>
                    </section>

                    {/* Stats Bento Grid */}
                    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 font-display">
                        {/* Total Patients */}
                        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-primary/5 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-4">
                                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                                    <span className="material-symbols-outlined size-6" style={{ fontVariationSettings: "'FILL' 1" }}>groups</span>
                                </div>
                                <span className={`text-[13px] font-bold flex items-center gap-1 ${mainStats.patientGrowth.startsWith('+') ? 'text-emerald-500' : 'text-red-500'}`}>
                                    {mainStats.patientGrowth}
                                    <span className="material-symbols-outlined text-xs">{mainStats.patientGrowth.startsWith('+') ? 'trending_up' : 'trending_down'}</span>
                                </span>
                            </div>
                            <h3 className="text-slate-500 text-sm font-medium">Tổng số bệnh nhân</h3>
                            <p className="text-3xl font-extrabold mt-1 italic-none">{mainStats.totalPatients}</p>
                        </div>

                        {/* Disease Ratio */}
                        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-primary/5 shadow-sm hover:shadow-md transition-shadow">
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
                        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-primary/5 shadow-sm hover:shadow-md transition-shadow">
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
                        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-primary/5 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-4">
                                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center text-blue-500">
                                    <span className="material-symbols-outlined size-6" style={{ fontVariationSettings: "'FILL' 1" }}>event_busy</span>
                                </div>
                            </div>
                            <h3 className="text-slate-500 text-sm font-medium">Chưa tái khám</h3>
                            <p className="text-3xl font-extrabold mt-1 italic-none">{mainStats.pendingFollowUps}</p>
                        </div>
                    </section>

                    {/* Charts Section */}
                    <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* New Patients Chart */}
                        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col justify-between">
                            <div>
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
                                    <div>
                                        <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Bệnh nhân mới theo tháng</h3>
                                        <p className="text-sm text-slate-500 font-medium mt-1">Thống kê dữ liệu trong 6 tháng gần nhất</p>
                                    </div>
                                    <Dropdown
                                        options={['Năm 2024', 'Năm 2023']}
                                        value={dashboardTimeRange}
                                        onChange={setDashboardTimeRange}
                                        className="min-w-[140px]"
                                    />
                                </div>
                                <div className="flex items-end justify-between h-64 gap-3 md:gap-6 px-4">
                                    {mainStats.chartData.map((item: any, idx: number) => (
                                        <div key={idx} className="flex flex-col items-center flex-1 gap-4">
                                            <div className="w-full bg-slate-50 dark:bg-slate-800 rounded-t-2xl relative overflow-hidden group h-48 border border-primary/5">
                                                <div
                                                    style={{ height: item.height }}
                                                    className={`absolute bottom-0 w-full transition-all duration-700 rounded-t-2xl ${item.active ? 'bg-[#38bdf8] shadow-[0_-10px_20px_rgba(56,189,248,0.2)]' : 'bg-[#93e2fb] group-hover:bg-[#38bdf8]/60'}`}
                                                >
                                                    {item.active && <div className="absolute top-0 w-full h-2 bg-white/20"></div>}
                                                </div>
                                            </div>
                                            <span className={`text-[11px] font-black tracking-tighter ${item.active ? 'text-[#0ea5e9]' : 'text-slate-400'}`}>{item.month}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Key Stats Bar at Bottom to Balance Height */}
                            <div className="grid grid-cols-3 gap-4 pt-8 border-t border-slate-50 dark:border-slate-800/50 mt-6 pb-2">
                                <div className="flex flex-col items-center">
                                    <p className="text-[14px] font-medium text-slate-500 mb-1">Tăng trưởng</p>
                                    <div className="flex items-center gap-1">
                                        <span className={`text-lg font-bold ${mainStats.patientGrowth.startsWith('+') ? 'text-emerald-500' : 'text-red-500'}`}>{mainStats.patientGrowth}</span>
                                        <span className={`material-symbols-outlined text-sm ${mainStats.patientGrowth.startsWith('+') ? 'text-emerald-500' : 'text-red-500'}`}>{mainStats.patientGrowth.startsWith('+') ? 'trending_up' : 'trending_down'}</span>
                                    </div>
                                </div>
                                <div className="flex flex-col items-center border-x border-slate-100 dark:border-slate-800/50">
                                    <p className="text-[14px] font-medium text-slate-500 mb-1">Trung bình</p>
                                    <span className="text-lg font-bold text-slate-700 dark:text-slate-200">{Math.round(parseInt(String(mainStats.totalPatients).replace(/,/g, '')) / 6)} ca/tháng</span>
                                </div>
                                <div className="flex flex-col items-center">
                                    <p className="text-[14px] font-medium text-slate-500 mb-1">Đỉnh điểm</p>
                                    <span className="text-lg font-bold text-sky-500">T.3 (224 ca)</span>
                                </div>
                            </div>
                        </div>

                        {/* Pathology Pie Chart */}
                        <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col justify-between">
                            <div>
                                <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Cơ cấu bệnh lý</h3>
                                <p className="text-sm text-slate-500 font-medium">Phân tích theo danh mục</p>
                            </div>
                            <div className="relative w-48 h-48 mx-auto my-10">
                                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                                    <circle className="stroke-slate-50 dark:stroke-slate-800" cx="18" cy="18" fill="none" r="16" strokeWidth="4"></circle>
                                    <circle className="stroke-emerald-500" cx="18" cy="18" fill="none" r="16" strokeDasharray="40 100" strokeWidth="4"></circle>
                                    <circle className="stroke-amber-400" cx="18" cy="18" fill="none" r="16" strokeDasharray="35 100" strokeDashoffset="-40" strokeWidth="4"></circle>
                                    <circle className="stroke-sky-400" cx="18" cy="18" fill="none" r="16" strokeDasharray="25 100" strokeDashoffset="-75" strokeWidth="4"></circle>
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center font-display">
                                    <span className="text-3xl font-bold text-slate-900 dark:text-white">75%</span>
                                    <span className="text-[15px] font-medium text-slate-400 mt-1">Mãn tính</span>
                                </div>
                            </div>
                            <div className="space-y-4">
                                {mainStats.diseaseRatios.map((item: any, idx: number) => (
                                    <div key={idx} className="flex justify-between items-center bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-700/50">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                                            <span className="font-bold text-slate-600 dark:text-slate-300 text-sm">{item.label}</span>
                                        </div>
                                        <span className="font-black text-slate-900 dark:text-white text-sm">{item.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Doctor Performance Table */}
                    <section className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm overflow-hidden border border-slate-100 dark:border-slate-800">
                        <div className="px-8 py-6 border-b border-slate-50 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div>
                                <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Hiệu suất Bác sĩ</h3>
                                <p className="text-sm text-slate-500 font-medium">Tổng hợp đánh giá và tải lượng bệnh nhân</p>
                            </div>
                            <button className="text-emerald-600 dark:text-emerald-400 font-bold text-sm flex items-center gap-1 hover:underline active:scale-95 transition-all">
                                Xem tất cả <span className="material-symbols-outlined text-sm">arrow_forward</span>
                            </button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-slate-50 dark:bg-slate-800/50 font-display">
                                        <th className="px-8 py-5 text-[15px] font-medium text-slate-500">Tên Bác sĩ</th>
                                        <th className="px-8 py-5 text-[15px] font-medium text-slate-500">Chuyên khoa</th>
                                        <th className="px-8 py-5 text-[15px] font-medium text-slate-500 text-center">Tải lượng</th>
                                        <th className="px-8 py-5 text-[15px] font-medium text-slate-500">Đánh giá</th>
                                        <th className="px-8 py-5 text-[15px] font-medium text-slate-500">Trạng thái</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                                    {doctors.map((dr: any, idx: number) => (
                                        <tr key={idx} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors group cursor-pointer">
                                            <td className="px-8 py-5">
                                                <div className="flex items-center gap-4">
                                                    <div className="relative shrink-0">
                                                        <img className="size-11 rounded-full object-cover border-2 border-primary/10" src={dr.img} alt={dr.name} />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">{dr.name}</p>
                                                        <p className="text-[13px] text-slate-500 font-medium">{dr.id}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5 text-sm font-bold text-slate-600 dark:text-slate-400">{dr.dept}</td>
                                            <td className="px-8 py-5">
                                                <div className="flex flex-col items-center gap-1.5 min-w-[100px]">
                                                    <span className="text-sm font-black text-slate-900 dark:text-white">{dr.load}</span>
                                                    <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                                        <div className={`h-full ${dr.color === 'emerald' ? 'bg-emerald-500' : dr.color === 'amber' ? 'bg-amber-400' : 'bg-red-500'} ${dr.progress} rounded-full`}></div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5">
                                                <div className="flex items-center gap-1.5 text-amber-400">
                                                    <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                                    <span className="text-sm font-black text-slate-900 dark:text-white">{dr.rating}</span>
                                                    <span className="text-[13px] text-slate-400 font-medium">({dr.reviews})</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5">
                                                <span className={`px-4 py-1.5 rounded-full text-[13px] font-bold text-white shadow-sm whitespace-nowrap ${dr.active ? 'bg-emerald-500' : 'bg-slate-400'}`}>
                                                    {dr.status}
                                                </span>
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
