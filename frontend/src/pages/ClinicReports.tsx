import { useState } from 'react';
import ClinicSidebar from '../components/common/ClinicSidebar';
import TopBar from '../components/common/TopBar';

export default function ClinicReports() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [reportTimeRange, setReportTimeRange] = useState('30 ngày');
    const [notifications, setNotifications] = useState([
        { id: 1, title: 'Báo cáo mới', description: 'Có báo cáo tổng quát tháng 12 vừa được tạo.', time: '5 phút trước', read: false },
        { id: 2, title: 'Cảnh báo nguy cơ', description: 'Bệnh nhân Nguyễn Văn An có chỉ số bất thường.', time: '1 giờ trước', read: false },
    ]);

    return (
        <div className="flex min-h-screen font-display bg-[#f6f8f7] dark:bg-slate-950 text-slate-900 dark:text-slate-100 italic-none">
            {/* Sidebar Navigation - Shared Component */}
            <ClinicSidebar 
                isSidebarOpen={isSidebarOpen} 
                userName="Admin Sarah"
                userRole="Senior Manager"
                userAvatar="https://lh3.googleusercontent.com/aida-public/AB6AXuDs9fuTZde7EUIINhAwZDAYbGdWhfZuvszHFDZODEHBxXo3hRWmKfCmGfg6Xgckf0DONyYs8LQEOXng1sISGQVj9ec2pSs--Gz-xPlj6elGIG3KtZTO9U-57mPPcUxuNMtJbLamHmXAsWrVwobD4Ai-pKgNGU0yfv596RmDCRUawQMx8gmW7E2J_we-R_YITLa95pCcbtDZf6tkb7C6bWKKzwepNG2pc4L5uji1KMHQetqk8390TVAlxrRao3qco3laKWLu0uA-BmQ"
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
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight leading-tight">Báo cáo Tổng hợp</h2>
                            <p className="text-sm font-medium text-slate-500 italic-none">Xem và xuất dữ liệu báo cáo hoạt động phòng khám</p>
                        </div>
                        <div className="flex flex-wrap items-center gap-4">
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
                        </div>
                    </div>
                    {/* Metric Cards (Bento Style) */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group border border-primary/5">
                            <div className="flex justify-between items-start mb-4">
                                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                                    <span className="material-symbols-outlined size-6" style={{ fontVariationSettings: "'FILL' 1" }}>groups</span>
                                </div>
                                <span className="text-emerald-500 font-bold text-sm">+4.2%</span>
                            </div>
                            <h3 className="text-slate-500 text-sm font-medium">Tổng số bệnh nhân</h3>
                            <p className="text-3xl font-black mt-1 text-slate-900 dark:text-white">1,250</p>
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
                    </div>

                    {/* Charts Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Xu hướng bệnh nhân */}
                        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-sm border border-primary/5">
                            <div className="flex justify-between items-start mb-8">
                                <div>
                                    <h3 className="text-[22px] font-bold text-slate-900 dark:text-white tracking-tight">Xu hướng bệnh nhân</h3>
                                    <p className="text-[15px] text-slate-500 font-medium italic-none">Lượng bệnh nhân nội trú & ngoại trú hàng ngày</p>
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

                            <div className="relative h-64 w-full mt-4 flex items-end justify-between px-2 italic-none">
                                <div className="absolute inset-0 border-b-2 border-slate-100 dark:border-slate-800 flex flex-col justify-between">
                                    <div className="border-t border-slate-50 dark:border-slate-800 w-full h-0"></div>
                                    <div className="border-t border-slate-50 dark:border-slate-800 w-full h-0"></div>
                                    <div className="border-t border-slate-50 dark:border-slate-800 w-full h-0"></div>
                                    <div className="border-t border-slate-50 dark:border-slate-800 w-full h-0"></div>
                                </div>
                                <div className="z-10 w-full h-full relative flex items-end justify-around">
                                    {[50, 65, 75, 50, 95, 60].map((h, i) => (
                                        <div key={i} className="w-4 bg-primary/20 h-full rounded-t-full relative group italic-none flex items-end overflow-hidden">
                                            <div className="bg-primary w-full rounded-t-full transition-all duration-700" style={{ height: `${h}%` }}></div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="flex justify-between mt-6 px-4 text-[13px] font-medium text-slate-500 italic-none">
                                <span>Thứ 2</span>
                                <span>Thứ 3</span>
                                <span>Thứ 4</span>
                                <span>Thứ 5</span>
                                <span>Thứ 6</span>
                                <span>Thứ 7</span>
                            </div>
                        </div>

                        {/* Bệnh mãn tính Chart */}
                        <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-sm border border-primary/5 flex flex-col items-center">
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
                                    <span className="text-3xl font-black text-slate-900 dark:text-white italic-none">1.2k</span>
                                    <span className="text-[12px] font-bold text-slate-400">Ca bệnh</span>
                                </div>
                            </div>
                            <div className="mt-8 w-full space-y-4">
                                {[
                                    { label: 'Tiểu đường', rate: '40%', color: 'bg-primary' },
                                    { label: 'Cao huyết áp', rate: '35%', color: 'bg-[#3b6470]' },
                                    { label: 'Tim mạch', rate: '25%', color: 'bg-[#c9e9d3]' }
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                                            <span className="text-sm font-bold text-slate-600 dark:text-slate-400">{item.label}</span>
                                        </div>
                                        <span className="text-sm font-black text-slate-900 dark:text-white">{item.rate}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Doctor Performance Table */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-primary/5 overflow-hidden">
                        <div className="px-8 py-6 flex justify-between items-center border-b border-slate-50 dark:border-slate-800">
                            <h3 className="text-[20px] font-bold text-slate-900 dark:text-white tracking-tight">Hiệu suất bác sĩ</h3>
                            <button className="text-sm font-bold text-primary flex items-center gap-1 hover:underline">
                                Tất cả bác sĩ <span className="material-symbols-outlined text-sm">open_in_new</span>
                            </button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-slate-50 dark:bg-slate-800/50 font-display">
                                        <th className="px-8 py-5 text-[15px] font-medium text-slate-500">Tên bác sĩ</th>
                                        <th className="px-8 py-5 text-[15px] font-medium text-slate-500">Số ca khám</th>
                                        <th className="px-8 py-5 text-[15px] font-medium text-slate-500">Điểm đánh giá</th>
                                        <th className="px-8 py-5 text-[15px] font-medium text-slate-500">Trạng thái</th>
                                        <th className="px-8 py-5 text-[15px] font-medium text-slate-500 text-right">Hành động</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                                    {[
                                        {
                                            name: 'BS. Trần Ngọc Minh', dept: 'Khoa Nội', cases: 342, rating: '4.9', status: 'Đang trực', active: true,
                                            img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBFqPS8mYLnxySv4UFUNqM86Dn0L1O090weVBjY9cPfHwWRVd3DmgURNwrRvLo2IzNtsFywzuSgys6agXvIPIbNMtGsmxCni9zbscXzsbIk0BNvBLrFoEGtfhd4wu0j85J6A5sEV6Ch1qmnlpSXvXJekBVujWm62k2FfubufJF-jJyMCPJ1Ec7GnBsmd4skpmN2xjKghbgjLVDu5n3zjoYzIumlmnESXgqmkuEbuKDfg_B03G86kPWzbIinddLMKfWAH4SmO-2q96U'
                                        },
                                        {
                                            name: 'BS. Lê Thị Phương', dept: 'Khoa Tim mạch', cases: 289, rating: '4.8', status: 'Đang trực', active: true,
                                            img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCUTzVeQgZvYJvp25K5b3SJWqv_sVttWxS1vAvvHT9wiGN2yLzQ-3oAHKIkgZ22edtprAse17xme-Dc16m2BYnY8cqnl8jPdwEV3VkL_23FaJrmXWsf_HpxjDa8wLjwKC46RMjz0_R5p_vGWKHcfgfKo-hLtA8soDc3C54XU7amRf7SHtKvqvVizk21eV4-h2opICd24JqqQH6E93ctZLszdOI3wTL1J8L6BaJ8lR6aZvxdk7Ah3nD632tPuO9Ei9G1bsnS_LamyO4'
                                        },
                                        {
                                            name: 'BS. Phạm Hoàng Anh', dept: 'Khoa Nhi', cases: 215, rating: '4.7', status: 'Nghỉ phép', active: false,
                                            img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDMy2AWoRyHiE0Nzhr-JHk1uEkSntBx5R2aJvRxDnRWWo1JRozld-kbNktX8TokrrCArrhIbpGIn6kj8BCnIc1llHCUBp_jeO-3q-8AyJrxi8-xZsKQX3CRFfD2f3zZm4Q76EeC3KmgNv-BW5E9a2qup_FnjH6yv3gQUsZspjFPgPXEfVdyMZlq_I7iw2fxeyEkkhRiWi47hD5-LIOn-uQ9BayWj6KaZTaXOb9z2VrqBsEf4FnCE-pQRNOfQ7xjtjceUOQANmRxfTw'
                                        }
                                    ].map((dr, idx) => (
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
                                            <td className="px-8 py-5 text-sm font-bold text-slate-700 dark:text-slate-300">{dr.cases} ca</td>
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
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
