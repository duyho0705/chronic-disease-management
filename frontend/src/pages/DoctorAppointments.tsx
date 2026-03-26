import { useState } from 'react';
import TopBar from '../components/common/TopBar';
import RescheduleModal from '../features/patient/components/RescheduleModal';
import Toast from '../components/ui/Toast';

export default function DoctorAppointments() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [notifications, setNotifications] = useState([
        { id: 1, title: 'Cảnh báo chỉ số', message: 'Bệnh nhân Nguyễn Văn An có chỉ số đường huyết cao bất thường.', time: '5 phút trước', type: 'warning' },
        { id: 2, title: 'Lịch hẹn mới', message: 'Bạn có một yêu cầu đặt lịch hẹn mới từ Lê Thị Bình.', time: '2 giờ trước', type: 'info' }
    ]);
    const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
    const [selectedDay, setSelectedDay] = useState<number>(1);
    const [selectedTime, setSelectedTime] = useState<string>('09:00');
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [isSaving, setIsSaving] = useState(false);
    const [toast, setToast] = useState({ show: false, title: '', type: 'success' as 'success' | 'warning' | 'error' });
    const [activeView, setActiveView] = useState<'month' | 'week' | 'day'>('month');

    const handleSaveReschedule = async () => {
        setIsSaving(true);
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsSaving(false);
        setIsRescheduleModalOpen(false);
        setToast({ show: true, title: 'Đặt lịch thành công!', type: 'success' });
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
                    <a className="flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-slate-400 hover:bg-primary/10 hover:text-primary rounded-xl font-medium transition-all" href="/doctor">
                        <span className="material-symbols-outlined">dashboard</span>
                        <span>Bảng điều khiển</span>
                    </a>
                    <a className="flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-slate-400 hover:bg-primary/10 hover:text-primary rounded-xl font-medium transition-all" href="/doctor/patients">
                        <span className="material-symbols-outlined">groups</span>
                        <span>Danh sách bệnh nhân</span>
                    </a>
                    <a className="flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-slate-400 hover:bg-primary/10 hover:text-primary rounded-xl font-medium transition-all" href="/doctor/analytics">
                        <span className="material-symbols-outlined">analytics</span>
                        <span>Phân tích nguy cơ</span>
                    </a>
                    <a className="flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-slate-400 hover:bg-primary/10 hover:text-primary rounded-xl font-medium transition-all" href="/doctor/prescriptions">
                        <span className="material-symbols-outlined">prescriptions</span>
                        <span>Đơn thuốc điện tử</span>
                    </a>

                    <a className="flex items-center gap-3 px-4 py-3 bg-primary text-white rounded-xl font-medium shadow-lg shadow-primary/10 transition-all" href="/doctor/appointments">
                        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>calendar_today</span>
                        <span>Lịch hẹn khám</span>
                    </a>
                    <a className="flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-slate-400 hover:bg-primary/10 hover:text-primary rounded-xl font-medium transition-all" href="/doctor/messages">
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
                {/* Top Bar */}
                <TopBar
                    setIsSidebarOpen={setIsSidebarOpen}
                    notifications={notifications}
                    setNotifications={setNotifications}
                />

                <div className="p-8 space-y-8">

                    {/* Title & Actions */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-[22px] font-extrabold tracking-tight text-slate-900 dark:text-slate-100">Lịch
                                hẹn khám</h1>
                            <p className="text-slate-500 dark:text-slate-400 mt-1">Chào buổi sáng, BS. Nguyễn. Bạn có 24
                                lịch hẹn trong hôm nay.</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setIsRescheduleModalOpen(true)}
                                className="flex items-center gap-2 px-5 py-2.5 bg-primary text-slate-900 font-bold text-sm rounded-lg hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
                                <span className="material-symbols-outlined text-lg">add_circle</span>
                                <span>Thêm lịch hẹn mới</span>
                            </button>
                        </div>
                    </div>
                    {/* Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div
                            className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Tổng lịch hẹn hôm nay
                                </p>
                                <div
                                    className="size-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                    <span className="material-symbols-outlined text-3xl">event_available</span>
                                </div>
                            </div>
                            <div className="flex items-end justify-between">
                                <span className="text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">24</span>
                                <span className="text-xs font-bold text-primary flex items-center gap-0.5">
                                    <span className="material-symbols-outlined text-xs">trending_up</span>
                                    +5%
                                </span>
                            </div>
                        </div>
                        <div
                            className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Khám trực tiếp</p>
                                <div
                                    className="size-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                                    <span className="material-symbols-outlined text-3xl">person_search</span>
                                </div>
                            </div>
                            <div className="flex items-end justify-between">
                                <span className="text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">14</span>
                                <span className="text-xs font-bold text-primary flex items-center gap-0.5">
                                    <span className="material-symbols-outlined text-xs">trending_up</span>
                                    +2%
                                </span>
                            </div>
                        </div>
                        <div
                            className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Tư vấn trực tuyến</p>
                                <div
                                    className="size-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                                    <span className="material-symbols-outlined text-3xl">video_camera_front</span>
                                </div>
                            </div>
                            <div className="flex items-end justify-between">
                                <span className="text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">10</span>
                                <span className="text-xs font-bold text-red-500 flex items-center gap-0.5">
                                    <span className="material-symbols-outlined text-xs">trending_down</span>
                                    -1%
                                </span>
                            </div>
                        </div>
                        <div
                            className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Đang chờ xác nhận</p>
                                <div
                                    className="size-12 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-500">
                                    <span className="material-symbols-outlined text-3xl">hourglass_empty</span>
                                </div>
                            </div>
                            <div className="flex items-end justify-between">
                                <span className="text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">3</span>
                                <span className="text-xs font-bold text-slate-400 flex items-center gap-0.5">
                                    <span className="material-symbols-outlined text-xs">horizontal_rule</span>
                                    0%
                                </span>
                            </div>
                        </div>
                    </div>
                    {/* Main Dashboard Layout */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* Calendar Section */}
                        <div className="lg:col-span-8 space-y-4">
                            <div
                                className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
                                <div
                                    className="p-6 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <h3 className="text-lg font-bold">Tháng 10, 2023</h3>
                                        <div
                                            className="flex border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
                                            <button
                                                className="px-2 py-1 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors border-r border-slate-200 dark:border-slate-700">
                                                <span
                                                    className="material-symbols-outlined text-lg leading-none">chevron_left</span>
                                            </button>
                                            <button
                                                className="px-2 py-1 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                                                <span
                                                    className="material-symbols-outlined text-lg leading-none">chevron_right</span>
                                            </button>
                                        </div>
                                    </div>
                                    <div className="flex bg-slate-100 dark:bg-slate-700 p-1 rounded-lg">
                                        <button
                                            onClick={() => setActiveView('month')}
                                            className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${activeView === 'month' ? 'bg-white dark:bg-slate-600 shadow-sm text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-700'}`}>
                                            Tháng
                                        </button>
                                        <button
                                            onClick={() => setActiveView('week')}
                                            className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${activeView === 'week' ? 'bg-white dark:bg-slate-600 shadow-sm text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-700'}`}>
                                            Tuần
                                        </button>
                                        <button
                                            onClick={() => setActiveView('day')}
                                            className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${activeView === 'day' ? 'bg-white dark:bg-slate-600 shadow-sm text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-700'}`}>
                                            Ngày
                                        </button>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <div
                                        className="grid grid-cols-7 gap-px bg-slate-200 dark:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
                                        {/* Weekdays */}
                                        <div
                                            className="bg-slate-50 dark:bg-slate-800 p-2 text-center text-xs font-bold text-slate-400">
                                            CN</div>
                                        <div
                                            className="bg-slate-50 dark:bg-slate-800 p-2 text-center text-xs font-bold text-slate-400">
                                            T2</div>
                                        <div
                                            className="bg-slate-50 dark:bg-slate-800 p-2 text-center text-xs font-bold text-slate-400">
                                            T3</div>
                                        <div
                                            className="bg-slate-50 dark:bg-slate-800 p-2 text-center text-xs font-bold text-slate-400">
                                            T4</div>
                                        <div
                                            className="bg-slate-50 dark:bg-slate-800 p-2 text-center text-xs font-bold text-slate-400">
                                            T5</div>
                                        <div
                                            className="bg-slate-50 dark:bg-slate-800 p-2 text-center text-xs font-bold text-slate-400">
                                            T6</div>
                                        <div
                                            className="bg-slate-50 dark:bg-slate-800 p-2 text-center text-xs font-bold text-slate-400">
                                            T7</div>
                                        {/* Calendar Days (Static example) */}
                                        {/* Offset */}
                                        <div className="bg-white dark:bg-slate-800 min-h-[100px] p-2 opacity-50"></div>
                                        <div className="bg-white dark:bg-slate-800 min-h-[100px] p-2 opacity-50"></div>
                                        <div className="bg-white dark:bg-slate-800 min-h-[100px] p-2 opacity-50"></div>
                                        {/* Start 1st */}
                                        <div className="bg-white dark:bg-slate-800 min-h-[100px] p-2">
                                            <span className="text-sm font-medium">1</span>
                                        </div>
                                        <div className="bg-white dark:bg-slate-800 min-h-[100px] p-2">
                                            <span className="text-sm font-medium">2</span>
                                        </div>
                                        <div className="bg-white dark:bg-slate-800 min-h-[100px] p-2">
                                            <span className="text-sm font-medium">3</span>
                                        </div>
                                        <div className="bg-white dark:bg-slate-800 min-h-[100px] p-2">
                                            <span className="text-sm font-medium">4</span>
                                        </div>
                                        <div
                                            onClick={() => { setSelectedDay(5); setIsRescheduleModalOpen(true); }}
                                            className="bg-primary/5 dark:bg-primary/10 min-h-[100px] p-2 relative ring-2 ring-inset ring-primary cursor-pointer hover:bg-primary/10 transition-colors">
                                            <span
                                                className="text-sm font-bold text-primary underline underline-offset-4 decoration-2">5</span>
                                            <div className="mt-2 space-y-1">
                                                <div
                                                    className="text-[10px] p-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded border-l-2 border-blue-500 truncate">
                                                    8:00 - Nguyễn Vy</div>
                                                <div
                                                    className="text-[10px] p-1 bg-primary/20 dark:bg-primary/30 text-primary-dark rounded border-l-2 border-primary truncate">
                                                    9:30 - Trần Đạt</div>
                                                <div
                                                    className="text-[10px] p-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 rounded border-l-2 border-slate-400 truncate">
                                                    +22 khác</div>
                                            </div>
                                        </div>
                                        <div
                                            className="bg-white dark:bg-slate-800 min-h-[100px] p-2 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer">
                                            <span className="text-sm font-medium">6</span>
                                            <div className="mt-2 flex gap-1 flex-wrap">
                                                <div className="size-1.5 rounded-full bg-blue-500"></div>
                                                <div className="size-1.5 rounded-full bg-amber-500"></div>
                                            </div>
                                        </div>
                                        <div
                                            className="bg-white dark:bg-slate-800 min-h-[100px] p-2 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer">
                                            <span className="text-sm font-medium">7</span>
                                        </div>
                                        <div
                                            className="bg-white dark:bg-slate-800 min-h-[100px] p-2 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer">
                                            <span className="text-sm font-medium">8</span>
                                        </div>
                                        <div
                                            className="bg-white dark:bg-slate-800 min-h-[100px] p-2 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer">
                                            <span className="text-sm font-medium">9</span>
                                        </div>
                                        <div
                                            className="bg-white dark:bg-slate-800 min-h-[100px] p-2 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer">
                                            <span className="text-sm font-medium">10</span>
                                            <div className="mt-2 flex gap-1 flex-wrap">
                                                <div className="size-1.5 rounded-full bg-red-500"></div>
                                            </div>
                                        </div>
                                        {/* Fill the rest simple for UI look */}
                                        <div className="bg-white dark:bg-slate-800 min-h-[100px] p-2"><span
                                            className="text-sm font-medium">11</span></div>
                                        <div className="bg-white dark:bg-slate-800 min-h-[100px] p-2"><span
                                            className="text-sm font-medium">12</span></div>
                                        <div className="bg-white dark:bg-slate-800 min-h-[100px] p-2"><span
                                            className="text-sm font-medium">13</span></div>
                                        <div className="bg-white dark:bg-slate-800 min-h-[100px] p-2"><span
                                            className="text-sm font-medium">14</span></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Agenda Section */}
                        <div className="lg:col-span-4 space-y-6">
                            <div
                                className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col h-full">
                                <div className="p-6 border-b border-slate-100 dark:border-slate-700">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-[15px] font-bold text-slate-900 dark:text-white">Lịch trình hôm nay</h3>
                                        <span className="text-[13px] text-slate-500 font-medium">05/10/2023</span>
                                    </div>
                                </div>
                                <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[600px]">
                                    {/* Appointment 1 */}
                                    <div
                                        className="group p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border-l-4 border-blue-500 transition-all hover:shadow-md">
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex items-center gap-3">
                                                <div className="size-10 rounded-full overflow-hidden bg-slate-200">
                                                    <img className="size-full object-cover"
                                                        data-alt="Hình ảnh bệnh nhân nữ trẻ trung"
                                                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuCb0o6sygn-tTBsZBoC65Kab2XSzD5kyvM0cQCp7q3D7d-DPRbS2WPN-J9qW4defKHVTm4Ne5MybPvbpX15y3nuJcGH_ZMAV8Ing63zo37JBptWi-L8G3hT8XrQ_Y473osbARM671qPBYZj2fWD5e3VlCBHz0VkMgjBoMngTblCw01LasrKK3QeulfZg6OlsV6ZaIikF3_Vh00RGRscipZqgzhWRIHE_P_3CLik_L6Z8JdHIrdntfvNFNm9etpeHf4onJOFuVdE42s" />
                                                </div>
                                                <div>
                                                    <h4 className="text-[15px] font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">
                                                        Nguyễn T. Bảo Vy</h4>
                                                    <p className="text-[13px] text-slate-500 font-medium">Khám sức khỏe tổng quát</p>
                                                </div>
                                            </div>
                                            <span className="text-sm font-bold text-slate-900 dark:text-white bg-blue-100 dark:bg-blue-900/40 px-3 py-1 rounded-lg">8:00</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <span className="material-symbols-outlined text-[18px] text-blue-500">location_on</span>
                                                <span className="text-[13px] font-medium text-slate-600">Tại phòng khám</span>
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    className="p-1.5 text-slate-400 hover:text-primary dark:hover:text-primary transition-colors">
                                                    <span className="material-symbols-outlined text-lg">edit_calendar</span>
                                                </button>
                                                <button
                                                    className="p-1.5 text-slate-400 hover:text-red-500 transition-colors">
                                                    <span className="material-symbols-outlined text-lg">cancel</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Appointment 2 */}
                                    <div
                                        className="group p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border-l-4 border-primary transition-all hover:shadow-md">
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex items-center gap-3">
                                                <div className="size-10 rounded-full overflow-hidden bg-slate-200">
                                                    <img className="size-full object-cover"
                                                        data-alt="Hình ảnh bệnh nhân nam trung niên"
                                                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuCGrkxIzbuHaZxef3rzbpLYbiAtdG822jvnMg2FKb_FlHFGO3kjrxrd6ruHNX0QMyzUDOcM9-m2KiMjMnlZ4cc6Y8qZwSSQfjr8jlyE6qFhZlWewFHYSjcFEaAKDbtZMDQBIFjuscvq6ZD-3KgWQS4xgGzxC_UYtU5a6JMxdbAJNaQEHi89I5qWDZZbDBHCDEKZOw0DMTYDiOvm-wwKau6eh0tmbI-YZdP5k3ceDFtlqN2FUICg8b-fN4bGfyj839rsFb-kIUZYZbU" />
                                                </div>
                                                <div>
                                                    <h4 className="text-[15px] font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">
                                                        Trần Văn Đạt</h4>
                                                    <p className="text-[13px] text-slate-500 font-medium">Tư vấn triệu chứng ho</p>
                                                </div>
                                            </div>
                                            <span className="text-sm font-bold text-slate-900 dark:text-white bg-primary/20 px-3 py-1 rounded-lg">9:30</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <span className="material-symbols-outlined text-[18px] text-primary">video_call</span>
                                                <span className="text-[13px] font-medium text-slate-600">Trực tuyến</span>
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    className="px-5 py-2 bg-primary text-slate-900 text-[15px] font-medium rounded-full shadow-lg shadow-primary/20 active:scale-95 transition-all">Bắt
                                                    đầu cuộc gọi</button>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Appointment 3 */}
                                    <div
                                        className="group p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border-l-4 border-slate-300 dark:border-slate-600 transition-all hover:shadow-md opacity-70">
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex items-center gap-3">
                                                <div className="size-10 rounded-full overflow-hidden bg-slate-200">
                                                    <img className="size-full object-cover"
                                                        data-alt="Hình ảnh bệnh nhân nam thanh niên"
                                                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuDtH3dN-8KIzsDFEDv2W-iFSfo0ZO8hy2FXS7WoKI-vVxzjEP-j9jUP8zWwjwAlwLq_gCWb_zuDW8bAl5rRVOQWmU4uWhVmjT8QMey3PPmHxvRR8jJk9lM59VD1QMfhrNSJKy6TdBxERjsqW3lSqgE1CdbXNa4dy9ngK_POeINMMJgE69M3KAAaJzqk6XMxP8p3HVpUdBy7BncgoGRGn_N1fWdWRWsdvPLMyKHqT_-FVfXPJsXM2tdtJvGMqDCXD2HqoSXEZ7q6zkI" />
                                                </div>
                                                <div>
                                                    <h4 className="text-[15px] font-bold text-slate-900 dark:text-white">Lê Minh Tuấn</h4>
                                                    <p className="text-[13px] text-slate-500 font-medium">Kiểm tra kết quả xét nghiệm
                                                    </p>
                                                </div>
                                            </div>
                                            <span className="text-sm font-bold text-slate-400 px-3 py-1 rounded-lg">11:00</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <span className="material-symbols-outlined text-[18px] text-slate-400">hourglass_top</span>
                                                <span className="text-[13px] font-medium text-slate-400">Đang chờ xác
                                                    nhận</span>
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    className="px-4 py-1.5 bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-[13px] font-medium rounded-full active:scale-95 transition-all">Xác
                                                    nhận</button>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Empty/Add slot */}
                                    <button
                                        onClick={() => setIsRescheduleModalOpen(true)}
                                        className="w-full p-4 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl flex items-center justify-center gap-2 text-slate-400 hover:text-primary hover:border-primary transition-all">
                                        <span className="material-symbols-outlined">add_circle</span>
                                        <span className="text-sm font-medium">Đặt lịch cho giờ trống tiếp theo</span>
                                    </button>
                                </div>
                                <div
                                    className="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-b-2xl border-t border-slate-100 dark:border-slate-700">
                                    <div className="flex gap-2">
                                        <button className="flex-1 px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-[12px] rounded-full hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors">
                                            Dời lịch hàng loạt
                                        </button>
                                        <button className="flex-1 px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-[12px] rounded-full hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors">
                                            Xuất file CSV
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </main>

            <RescheduleModal
                isOpen={isRescheduleModalOpen}
                onClose={() => setIsRescheduleModalOpen(false)}
                currentMonth={currentMonth}
                setCurrentMonth={setCurrentMonth}
                currentYear={currentYear}
                setCurrentYear={setCurrentYear}
                selectedDay={selectedDay}
                setSelectedDay={setSelectedDay}
                selectedTime={selectedTime}
                setSelectedTime={setSelectedTime}
                isSaving={isSaving}
                onSave={handleSaveReschedule}
            />

            {toast.show && (
                <Toast
                    show={toast.show}
                    title={toast.title}
                    type={toast.type}
                    onClose={() => setToast({ ...toast, show: false })}
                />
            )}
        </div>
    );
}