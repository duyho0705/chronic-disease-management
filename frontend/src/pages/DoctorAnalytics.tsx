import { useState, useEffect } from 'react';
import TopBar from '../components/common/TopBar';
import PatientDetailModal from '../features/patient/components/PatientDetailModal';
import AdviceModal from '../features/patient/components/AdviceModal';
import Toast from '../components/ui/Toast';
import { doctorApi } from '../api/doctor';

export default function DoctorAnalytics() {
    const [patients, setPatients] = useState<any[]>([]);
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [pRes, sRes] = await Promise.all([
                doctorApi.getMyPatients({ riskLevel: 'HIGH_RISK', size: 10 }),
                doctorApi.getPatientStats()
            ]);
            if (pRes.success) setPatients(pRes.data.content || []);
            if (sRes.success) setStats(sRes.data);
        } catch (error) {
            console.error('Failed to fetch analytics data', error);
        } finally {
            setLoading(false);
        }
    };
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [notifications, setNotifications] = useState([
        { id: 1, title: 'Cảnh báo chỉ số', message: 'Bệnh nhân Nguyễn Văn An có chỉ số đường huyết cao bất thường.', time: '5 phút trước', type: 'warning' },
        { id: 2, title: 'Lịch hẹn mới', message: 'Bạn có một yêu cầu đặt lịch hẹn mới từ Lê Thị Bình.', time: '2 giờ trước', type: 'info' }
    ]);
    const [isPatientDetailModalOpen, setIsPatientDetailModalOpen] = useState(false);
    const [selectedPatient, setSelectedPatient] = useState<any>(null);
    const [chartType, setChartType] = useState<'bp' | 'glucose'>('bp');

    // Advice Modal State
    const [isAdviceModalOpen, setIsAdviceModalOpen] = useState(false);
    const [adviceCategory, setAdviceCategory] = useState('Theo dõi');
    const [adviceContent, setAdviceContent] = useState('');
    const [isAdviceSaving, setIsAdviceSaving] = useState(false);
    const [advicePatientName, setAdvicePatientName] = useState('');

    const [showToast, setShowToast] = useState(false);
    const [toastTitle, setToastTitle] = useState('');
    const [toastType, setToastType] = useState<'success' | 'error' | 'warning'>('success');

    const handleSaveAdvice = async () => {
        setIsAdviceSaving(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsAdviceSaving(false);
        setIsAdviceModalOpen(false);
        setAdviceContent('');
        setToastTitle(`Đã gửi lời khuyên đến ${advicePatientName} thành công!`);
        setToastType('success');
        setShowToast(true);
    };
    return (
        <div className="flex min-h-screen font-display bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100">
            {/* Sidebar Navigation */}
            <aside className={`fixed left-0 top-0 bottom-0 bg-white dark:bg-slate-900 border-r border-primary/10 flex flex-col z-[150] transition-transform duration-300 w-72 lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} shadow-2xl lg:shadow-none shadow-primary/10`}>
                <div className="p-6 flex items-center gap-3 border-b border-primary/5">
                    <div className="w-10 h-10 bg-primary flex items-center justify-center rounded-xl text-white shadow-lg shadow-primary/20">
                        <span className="material-symbols-outlined fill-1">health_metrics</span>
                    </div>
                    <div>
                        <h1 className="text-xl font-extrabold text-slate-900 dark:text-white leading-none">DamDiep</h1>
                    </div>
                </div>
                <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto custom-scrollbar">
                    <a className="flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-slate-400 hover:bg-primary/10 hover:text-primary rounded-2xl font-medium transition-all" href="/doctor">
                        <span className="material-symbols-outlined">dashboard</span>
                        <span>Bảng điều khiển</span>
                    </a>
                    <a className="flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-slate-400 hover:bg-primary/10 hover:text-primary rounded-2xl font-medium transition-all" href="/doctor/patients">
                        <span className="material-symbols-outlined">groups</span>
                        <span>Danh sách bệnh nhân</span>
                    </a>
                    <a className="flex items-center gap-3 px-4 py-3 bg-primary text-white rounded-2xl font-medium shadow-lg shadow-primary/10 transition-all" href="/doctor/analytics">
                        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>analytics</span>
                        <span>Phân tích nguy cơ</span>
                    </a>
                    <a className="flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-slate-400 hover:bg-primary/10 hover:text-primary rounded-2xl font-medium transition-all" href="/doctor/prescriptions">
                        <span className="material-symbols-outlined">prescriptions</span>
                        <span>Đơn thuốc điện tử</span>
                    </a>
                    <a className="flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-slate-400 hover:bg-primary/10 hover:text-primary rounded-2xl font-medium transition-all" href="/doctor/appointments">
                        <span className="material-symbols-outlined">calendar_today</span>
                        <span>Lịch hẹn khám</span>
                    </a>
                    <a className="flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-slate-400 hover:bg-primary/10 hover:text-primary rounded-2xl font-medium transition-all" href="/doctor/messages">
                        <span className="material-symbols-outlined">chat</span>
                        <span>Tin nhắn</span>
                        <span className="ml-auto bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full">5</span>
                    </a>
                </nav>
                <div className="p-4 mt-auto">
                    <div className="bg-primary/5 rounded-lg p-4 border border-primary/10">
                        <div className="flex items-center gap-3 mb-3">
                            <div
                                className="w-10 h-10 rounded-full bg-slate-200"
                                data-alt="Bác sĩ Lê Minh Tâm portrait profile"
                                style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDvD1gNLm_sBMkVyq8FuYHA20LjP97yY90_RzaDO9mjZaL9ubIXYPTKQeV1FDlhsH3p7qndF3QILzvglilx1ly9Sb7AtePxkBlVz8-5HPGNI5wMlA1c27CCvjNz865bvs_Y9uYkK2245BaMa66pFJCTPXK2wTV6-A4oQjShYdPHNg1nx01j-yW7I48c8aShwiEDSx2B_FE04UGkIxELFaJ-Ho65BrMgC_LF9Yk0dKK7BGEGWjFX4zFwmnNWi44sq8khTm_Q-D-Iig4')" }}>
                            </div>
                            <div className="overflow-hidden">
                                <p className="text-sm font-bold truncate">BS. Lê Minh Tâm</p>
                                <p className="text-xs text-slate-500">Chuyên khoa Nội</p>
                            </div>
                        </div>
                        <button className="w-full flex items-center justify-center gap-2 py-2 text-sm font-bold text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                            <span className="material-symbols-outlined text-sm">logout</span>
                            Đăng xuất
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 lg:ml-72 min-h-screen flex flex-col transition-all duration-300">
                {/* Mobile Sidebar Overlay */}
                {isSidebarOpen && (
                    <div
                        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[140] lg:hidden animate-in fade-in duration-300"
                        onClick={() => setIsSidebarOpen(false)}
                    ></div>
                )}
                <TopBar
                    setIsSidebarOpen={setIsSidebarOpen}
                    notifications={notifications}
                    setNotifications={setNotifications}
                />

                <div className="p-4 md:p-8 space-y-6 md:space-y-8">
                    {/* Header Section */}
                    <div className="mb-8">
                        <h2 className="text-[22px] font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">Phân tích nguy cơ</h2>
                        <p className="text-slate-500 text-[15px] font-medium mt-1">Hệ thống giám sát và dự báo rủi ro sức khỏe bệnh nhân</p>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-primary/5">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-sm font-medium text-slate-500 mb-1">Tổng bệnh nhân</p>
                                    <h3 className="text-3xl font-extrabold mt-1 text-slate-900 dark:text-white">{stats?.totalPatients || 0}</h3>
                                </div>
                                <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/30 rounded-xl flex items-center justify-center text-blue-500">
                                    <span className="material-symbols-outlined text-3xl">monitoring</span>
                                </div>
                            </div>
                            <div className="mt-4 flex items-center text-[14px] text-blue-600 dark:text-blue-400 font-bold">
                                <span className="material-symbols-outlined text-[14px] mr-1">trending_up</span>
                                +12% so với tháng trước
                            </div>
                        </div>
                        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-primary/5">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-sm font-medium text-slate-500 mb-1">Nguy cơ cao</p>
                                    <h3 className="text-3xl font-extrabold mt-1 text-red-500">{stats?.highRiskCount || 0}</h3>
                                </div>
                                <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center text-red-500">
                                    <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>warning</span>
                                </div>
                            </div>
                            <p className="text-[14px] text-slate-500 dark:text-slate-400 mt-4 italic font-medium">Cần can thiệp khẩn cấp ngay</p>
                        </div>
                        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-primary/5">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-sm font-medium text-slate-500 mb-1">Cần theo dõi</p>
                                    <h3 className="text-3xl font-extrabold mt-1 text-orange-500">{stats?.monitoringCount || 0}</h3>
                                </div>
                                <div className="w-12 h-12 bg-orange-50 dark:bg-orange-900/30 rounded-xl flex items-center justify-center text-orange-500">
                                    <span className="material-symbols-outlined text-3xl">trending_down</span>
                                </div>
                            </div>
                            <div className="mt-4 flex items-center text-[14px] text-orange-500 dark:text-orange-400 font-bold">
                                Dự báo tăng 5% tới
                            </div>
                        </div>
                        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-primary/5">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-sm font-medium text-slate-500 mb-1">Ổn định</p>
                                    <h3 className="text-3xl font-extrabold mt-1 text-primary">{stats?.stableCount || 0}</h3>
                                </div>
                                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                                    <span className="material-symbols-outlined text-3xl"
                                        style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                                </div>
                            </div>
                            <div className="mt-4 flex items-center text-[14px] text-primary dark:text-primary/80 font-bold">
                                Duy trì trạng thái tốt
                            </div>
                        </div>
                    </div>

                    {/* Middle Section: Chart & AI Insights */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                        {/* Chart Section */}
                        <div className="lg:col-span-2 bg-white p-8 rounded-lg shadow-sm border border-slate-100">
                            <div className="flex justify-between items-center mb-8">
                                <div>
                                    <h4 className="text-lg font-bold">Xu hướng sức khỏe cộng đồng</h4>
                                    <p className="text-sm text-slate-500">Biến động chỉ số trung bình (7 ngày qua)</p>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setChartType('bp')}
                                        className={`px-4 py-2 text-xs font-bold rounded-lg border transition-all ${chartType === 'bp' ? 'bg-primary/5 text-primary border-emerald-100 shadow-sm' : 'text-slate-500 hover:bg-slate-50 border-transparent'}`}>
                                        Huyết áp
                                    </button>
                                    <button
                                        onClick={() => setChartType('glucose')}
                                        className={`px-4 py-2 text-xs font-bold rounded-lg border transition-all ${chartType === 'glucose' ? 'bg-primary/5 text-primary border-emerald-100 shadow-sm' : 'text-slate-500 hover:bg-slate-50 border-transparent'}`}>
                                        Đường huyết
                                    </button>
                                </div>
                            </div>
                            {/* Chart Simulation */}
                            <div className="h-64 flex items-end justify-between gap-4 px-4 border-b border-slate-100 pb-2">
                                <div className="w-full flex flex-col items-center group">
                                    <div
                                        className="w-full bg-primary/20 group-hover:bg-primary/30 transition-colors rounded-t-lg h-32 relative">
                                        <div
                                            className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                            124</div>
                                    </div>
                                    <span className="text-[10px] mt-2 text-slate-400 font-bold">T2</span>
                                </div>
                                <div className="w-full flex flex-col items-center group">
                                    <div className="w-full bg-primary/30 h-40 rounded-t-lg relative"></div>
                                    <span className="text-[10px] mt-2 text-slate-400 font-bold">T3</span>
                                </div>
                                <div className="w-full flex flex-col items-center group">
                                    <div className="w-full bg-primary/40 h-48 rounded-t-lg relative"></div>
                                    <span className="text-[10px] mt-2 text-slate-400 font-bold">T4</span>
                                </div>
                                <div className="w-full flex flex-col items-center group">
                                    <div className="w-full bg-primary/60 h-56 rounded-t-lg relative"></div>
                                    <span className="text-[10px] mt-2 text-slate-400 font-bold">T5</span>
                                </div>
                                <div className="w-full flex flex-col items-center group">
                                    <div className="w-full bg-primary/40 h-44 rounded-t-lg relative"></div>
                                    <span className="text-[10px] mt-2 text-slate-400 font-bold">T6</span>
                                </div>
                                <div className="w-full flex flex-col items-center group">
                                    <div className="w-full bg-primary/30 h-36 rounded-t-lg relative"></div>
                                    <span className="text-[10px] mt-2 text-slate-400 font-bold">T7</span>
                                </div>
                                <div className="w-full flex flex-col items-center group">
                                    <div className="w-full bg-primary/80 h-60 rounded-t-lg relative"></div>
                                    <span className="text-[10px] mt-2 text-slate-400 font-bold">CN</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-6 mt-6">
                                <div className="flex items-center gap-2">
                                    <span className="w-3 h-3 rounded-full bg-primary/80"></span>
                                    <span className="text-[14px] text-slate-500">Trung bình nhóm nguy cơ</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="w-3 h-3 rounded-full bg-slate-200"></span>
                                    <span className="text-[14px] text-slate-500">Ngưỡng an toàn (120 mmHg)</span>
                                </div>
                            </div>
                        </div>
                        {/* AI Insights Panel */}
                        <div className="bg-white p-8 rounded-lg shadow-sm border border-slate-100 space-y-4">
                            <div className="flex items-center gap-2 mb-4">
                                <span className="material-symbols-outlined text-primary"
                                    style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                                <h4 className="text-lg font-bold">AI Insights</h4>
                            </div>
                            <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800 border-l-4 border-red-500">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="material-symbols-outlined text-red-500 text-sm">emergency</span>
                                    <span className="text-xs font-extrabold text-red-500 uppercase tracking-wider">Cảnh báo khẩn</span>
                                </div>
                                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Bệnh nhân Trần Anh có SpO2 giảm đột ngột (88%)
                                </p>
                                <a href="/doctor/messages" className="inline-block mt-3 text-[13px] font-bold text-primary hover:underline">Liên hệ ngay →</a>
                            </div>
                            <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800 border-l-4 border-orange-500">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="material-symbols-outlined text-orange-500 text-sm">groups_2</span>
                                    <span className="text-xs font-extrabold text-orange-600 uppercase tracking-wider">Phân tích cụm</span>
                                </div>
                                <p className="text-sm text-slate-900 dark:text-slate-100 font-semibold">Phát hiện cụm 15 bệnh nhân tại Quận 7 có dấu hiệu tăng huyết áp.</p>
                            </div>
                            <div className="p-4 rounded-lg bg-primary/5 border-l-4 border-primary">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="material-symbols-outlined text-primary text-sm">query_stats</span>
                                    <span className="text-xs font-extrabold text-primary uppercase tracking-wider">Dự báo biến chứng</span>
                                </div>
                                <p className="text-sm text-slate-900 dark:text-slate-100 font-semibold">Nguy cơ suy thận độ 1 tăng 12% ở nhóm tiểu đường Type 2.</p>
                            </div>
                        </div>
                    </div>

                    {/* Patient Table Section */}
                    <div className="bg-white rounded-lg shadow-sm border border-slate-100 overflow-hidden">
                        <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center">
                            <h4 className="text-xl font-extrabold text-slate-900 dark:text-white">Bệnh nhân nguy cơ cao</h4>
                            <button
                                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-100 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors">
                                <span className="material-symbols-outlined text-sm">filter_list</span>
                                Lọc dữ liệu
                            </button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-primary/5 border-b border-primary/5">
                                        <th className="px-8 py-4 text-[14px] font-bold text-slate-500">Bệnh nhân</th>
                                        <th className="px-8 py-4 text-[14px] font-bold text-slate-500">Chỉ số mới nhất</th>
                                        <th className="px-8 py-4 text-[14px] font-bold text-slate-500">Phân tích từ AI</th>
                                        <th className="px-8 py-4 text-[14px] font-bold text-slate-500 text-right whitespace-nowrap">Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {loading ? (
                                        <tr>
                                            <td colSpan={4} className="px-8 py-10 text-center text-slate-500">Đang tải bệnh nhân nguy cơ...</td>
                                        </tr>
                                    ) : patients.length > 0 ? (
                                        patients.map((p, i) => (
                                            <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                                                <td className="px-8 py-5">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold">
                                                            {p.fullName?.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <p className="text-[16px] font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors tracking-tight">{p.fullName}</p>
                                                            <p className="text-[13px] text-slate-400 dark:text-slate-500 font-medium tracking-tight">Mã hồ sơ: {p.patientCode}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-5">
                                                    <div className="flex items-center gap-2">
                                                        <span className={`text-[15px] font-extrabold text-red-500`}>{p.latestBp || p.latestGlucose || 'N/A'}</span>
                                                        <span className={`material-symbols-outlined text-red-500 text-[14px]`}>arrow_upward</span>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-5">
                                                    <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-[13px] font-bold gap-2 text-white shadow-sm whitespace-nowrap bg-red-500`}>
                                                        <span className="material-symbols-outlined text-[13px] font-variation-settings: 'FILL' 1" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
                                                        {p.chronicCondition || 'Cần kiểm tra ngay'}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-5 text-right">
                                                    <div className="flex justify-end gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                                                        <a href="/doctor/messages" className="p-2 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-all flex items-center justify-center cursor-pointer">
                                                            <span className="material-symbols-outlined text-xl">chat</span>
                                                        </a>
                                                        <button onClick={() => { setSelectedPatient(p); setIsPatientDetailModalOpen(true); }} className="p-2 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-all">
                                                            <span className="material-symbols-outlined text-xl">visibility</span>
                                                        </button>
                                                        <button className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all" onClick={() => { setAdvicePatientName(p.fullName); setIsAdviceModalOpen(true); }}>
                                                            <span className="material-symbols-outlined text-xl">campaign</span>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={4} className="px-8 py-10 text-center text-slate-500 italic">Không có bệnh nhân nguy cơ cao nào</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        {/* Pagination Footer - Redesigned */}
                        <div className="px-8 py-6 bg-slate-50/50 dark:bg-slate-800/20 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
                            <p className="text-[14px] font-medium text-slate-500">
                                Hiển thị <span className="font-bold text-slate-900 dark:text-white">1</span> đến <span className="font-bold text-slate-900 dark:text-white">3</span> trong số <span className="font-bold text-slate-900 dark:text-white">42</span> ca
                            </p>
                            <div className="flex items-center gap-3">
                                <button className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-primary transition-all disabled:opacity-30" disabled>
                                    <span className="material-symbols-outlined text-[20px]">chevron_left</span>
                                </button>
                                <div className="flex items-center gap-1.5">
                                    <button className="w-10 h-10 rounded-xl bg-primary text-white text-sm font-black shadow-lg shadow-primary/20">1</button>
                                    <button className="w-10 h-10 rounded-xl hover:bg-white dark:hover:bg-slate-900 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 text-sm font-bold text-slate-500 transition-all">2</button>
                                    <button className="w-10 h-10 rounded-xl hover:bg-white dark:hover:bg-slate-900 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 text-sm font-bold text-slate-500 transition-all">3</button>
                                </div>
                                <button className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-primary transition-all">
                                    <span className="material-symbols-outlined text-[20px]">chevron_right</span>
                                </button>
                            </div>
                        </div>
                    </div>

                </div>
            </main>

            {selectedPatient && (
                <PatientDetailModal
                    isOpen={isPatientDetailModalOpen}
                    onClose={() => setIsPatientDetailModalOpen(false)}
                    patient={selectedPatient}
                />
            )}

            <AdviceModal
                isOpen={isAdviceModalOpen}
                onClose={() => setIsAdviceModalOpen(false)}
                adviceCategory={adviceCategory}
                setAdviceCategory={setAdviceCategory}
                adviceContent={adviceContent}
                setAdviceContent={setAdviceContent}
                isSaving={isAdviceSaving}
                onSave={handleSaveAdvice}
                patientName={advicePatientName}
            />

            <Toast
                show={showToast}
                title={toastTitle}
                type={toastType}
                onClose={() => setShowToast(false)}
            />
        </div>
    );
}