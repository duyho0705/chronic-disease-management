import { useState } from 'react';
import ClinicSidebar from '../components/common/ClinicSidebar';

export default function ClinicRiskAlerts() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="flex min-h-screen font-display bg-[#f6f8f7] dark:bg-slate-950 text-slate-900 dark:text-slate-100 italic-none">
            {/* Sidebar Navigation - Shared Component */}
            <ClinicSidebar isSidebarOpen={isSidebarOpen} />

            {/* Main Content Area */}
            <main className="flex-1 lg:ml-72 min-h-screen flex flex-col transition-all duration-300">
                {/* Mobile Sidebar Overlay */}
                {isSidebarOpen && (
                    <div
                        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[140] lg:hidden animate-in fade-in duration-300"
                        onClick={() => setIsSidebarOpen(false)}
                    ></div>
                )}

                {/* Top Header - Shared Style */}
                <header className="sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-sm dark:shadow-none px-8 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-6 flex-1">
                        <div className="flex items-center gap-4 lg:hidden">
                            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 -ml-2 text-slate-600 dark:text-slate-400">
                                <span className="material-symbols-outlined">menu</span>
                            </button>
                        </div>
                        <div className="flex items-center gap-4">
                            <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">Cảnh báo nguy cơ</h2>
                            <div className="h-6 w-[1px] bg-slate-200 dark:bg-slate-700"></div>
                            <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl gap-1">
                                <button className="px-4 py-1.5 text-xs font-bold rounded-lg transition-all bg-white dark:bg-slate-700 shadow-sm text-emerald-600">Hôm nay</button>
                                <button className="px-4 py-1.5 text-xs font-bold rounded-lg transition-all text-slate-500 hover:bg-white dark:hover:bg-slate-700">Tuần này</button>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="relative group hidden md:block">
                            <input className="bg-slate-100 dark:bg-slate-800 border-none rounded-full px-4 py-2 text-sm focus:ring-2 focus:ring-primary w-64 transition-all" placeholder="Tìm kiếm bệnh nhân..." type="text" />
                            <span className="material-symbols-outlined absolute right-3 top-2 text-slate-400">search</span>
                        </div>
                        <div className="h-8 w-[1px] bg-slate-200 dark:bg-slate-700 mx-2"></div>
                        <div className="flex items-center gap-2">
                            <button className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors relative">
                                <span className="material-symbols-outlined font-variation-settings: 'FILL' 1">notifications</span>
                                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                            </button>
                            <img alt="Manager Profile" className="w-10 h-10 rounded-full object-cover ring-2 ring-primary/20" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCDGjYIuSYp7DW1jpAZ9vD7op7gEIwRSfAVGcp9IMHUCV2y2NEZttUv8g72aAsVj6nLXq4ML38WuKKWYbxy94nSmkC5KiQUIfqUAyyFUr_89laFQY3oKjTGawWstmCiroviKt-PkwefqbwYkwk_95NBFrkKL8XZAdut5ikmVk4eXs106KAEYbQoOqqu9pbd3HCENpFNYQtEglWWMSwxgDHm62P358XDuQMTdTi8aCS_v6BwNiKsGF-x-kRs1aYBra37BiUXJuIiTs0" />
                        </div>
                    </div>
                </header>

                {/* Content Area */}
                <div className="p-8 space-y-8">
                    {/* Header info */}
                    <div className="flex justify-between items-end mb-4">
                        <div>
                            <p className="text-slate-500 font-medium">Hệ thống giám sát chỉ số sinh tồn thời gian thực</p>
                        </div>
                    </div>

                    {/* Quick Stats Bento Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group border border-primary/5">
                            <div className="relative z-10">
                                <p className="text-[10px] uppercase tracking-[0.15em] font-bold text-slate-400 mb-4">Tổng cảnh báo</p>
                                <h3 className="text-5xl font-extrabold text-slate-900 dark:text-white leading-none">24</h3>
                            </div>
                            <div className="mt-6 flex items-center text-primary text-xs font-bold gap-1">
                                <span className="material-symbols-outlined text-sm">trending_up</span>
                                +12% so với hôm qua
                            </div>
                            <div className="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:scale-110 transition-transform duration-500 text-slate-900 dark:text-white">
                                <span className="material-symbols-outlined text-9xl">notifications</span>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group border border-red-100 dark:border-red-900/30">
                            <div>
                                <div className="flex items-center gap-2 mb-4">
                                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                                    <p className="text-[10px] uppercase tracking-[0.15em] font-bold text-red-500">Khẩn cấp</p>
                                </div>
                                <h3 className="text-5xl font-extrabold text-red-500 leading-none">05</h3>
                            </div>
                            <p className="text-red-400/70 text-[10px] font-medium mt-4 italic">Cần can thiệp ngay lập tức</p>
                        </div>

                        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group border border-amber-100 dark:border-amber-900/30">
                            <div>
                                <div className="flex items-center gap-2 mb-4">
                                    <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                                    <p className="text-[10px] uppercase tracking-[0.15em] font-bold text-amber-600">Theo dõi</p>
                                </div>
                                <h3 className="text-5xl font-extrabold text-amber-600 leading-none">12</h3>
                            </div>
                            <p className="text-amber-500/60 text-[10px] font-medium mt-4 italic">Đang trong ngưỡng nguy cơ</p>
                        </div>

                        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-primary/5">
                            <div>
                                <p className="text-[10px] uppercase tracking-[0.15em] font-bold text-slate-400 mb-4">Đã xử lý</p>
                                <h3 className="text-5xl font-extrabold text-emerald-600 leading-none">07</h3>
                            </div>
                            <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-6 overflow-hidden">
                                <div className="bg-primary h-full w-[29%]"></div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Patient Risk Table */}
                        <div className="lg:col-span-2 space-y-6">
                            <div className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-sm border border-primary/5">
                                <div className="px-8 py-6 flex justify-between items-center border-b border-primary/5">
                                    <h4 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">Danh sách bệnh nhân nguy cơ cao</h4>
                                    <button className="text-primary text-sm font-bold flex items-center gap-1 hover:underline">
                                        Tải báo cáo <span className="material-symbols-outlined text-sm">download</span>
                                    </button>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="text-[10px] uppercase tracking-wider text-slate-400 font-extrabold bg-slate-50 dark:bg-slate-800/50">
                                                <th className="px-8 py-4">Bệnh nhân</th>
                                                <th className="px-4 py-4">Mã hồ sơ</th>
                                                <th className="px-4 py-4">Chỉ số sinh tồn</th>
                                                <th className="px-4 py-4">Thời điểm</th>
                                                <th className="px-4 py-4 text-center">Mức độ</th>
                                                <th className="px-8 py-4 text-right">Hành động</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                                            {[
                                                { name: 'Trần Văn Nam', age: 'Tăng huyết áp', id: '#SK-9921', value: '185/115', unit: 'mmHg', time: '10:45 AM', level: 'Đỏ', color: 'bg-red-500', isCritical: true, img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBI7ygq4AFreOxzUOj2UVcicMAVrEHiSh1OksnY0HwA7_LAMYc295gB2D92ho-bbQ_ByRjNB4V2J7uj-RsBiRud0dSOYg-buwkHYEZp1n3hyK6CSPzUJAGDLsRhW9l7vIoG4ff-OTxve_25MB96A3hUVO4Ow0sI37tZBoJxayMc299aFYSD2iFPynbECaLh1M0lDB1_4fzQvna3xn-W23IPia74sYyzm0ohbsdbUbrzvPo6aC_BEtVl-QtjoUUfYeFUlJEqkLcRrqc' },
                                                { name: 'Lê Thị Hoa', age: 'Tiểu đường Type 2', id: '#SK-8834', value: '15.5', unit: 'mmol/L', time: '09:12 AM', level: 'Vàng', color: 'bg-amber-500', isCritical: false, img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA9hoyvncJA5CHCRp-pCZTFsEijqRvNIdJvMtWl4IPb7U_ogxKkvZYACoCXTsQaLACGrvMA8PMNxiW4zL0GFlv6saSblJC_kKVh21UeW3nnPOGqP-qq570klEShJ3Gj78jLikkW8QQGScrJ5uoxcaRntQOFaUTi8F5ly4izboNswSleWR5p8bBNPPKjNo3BhyaZQovuqhf9lJ-GPidlTRh3PKRfgOpG10Hxs-f4AKhbZ0ZpbbPPrKU_43ovvxmEYGh2kG8ya1v4ujU' },
                                                { name: 'Phạm Hoàng Hải', age: 'Suy tim độ 2', id: '#SK-7721', value: '125', unit: 'bpm', time: '08:45 AM', level: 'Đỏ', color: 'bg-red-500', isCritical: true, img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBPzT6Tr0lu3TxhMRmtBqQhXHKO5KNM3Th6SsYMTzAHdGl7TFt_uZqvAHidfjh0QsCF9ga5rhJfaO0ebq5u0MO52_M3EDJhX5iIGivRpmHv1gUm2efF87TPgBSroWRskCjRaOQeNrticWKqBsCDBIGCJSgJvNUsUF_kV4bol44eApK48n21b--iqMe1CzZXhSBB2t9_D_Eblivn1SxIFf74VqS_Y5WneicmR0zq7OzgS8cf8xeyQZ7wA9MuAWfgnaedygvgMc9471g' }
                                            ].map((patient, idx) => (
                                                <tr key={idx} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                                    <td className="px-8 py-5">
                                                        <div className="flex items-center gap-3">
                                                            <img alt="Bệnh nhân" className="w-10 h-10 rounded-full object-cover ring-2 ring-primary/10" src={patient.img} />
                                                            <div>
                                                                <p className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">{patient.name}</p>
                                                                <p className="text-[10px] text-slate-500 font-medium italic-none">{patient.age}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-5 font-mono text-xs text-slate-500">{patient.id}</td>
                                                    <td className="px-4 py-5">
                                                        <div className="flex flex-col">
                                                            <span className={`text-sm font-extrabold ${patient.level === 'Đỏ' ? 'text-red-500' : 'text-amber-500'}`}>
                                                                {patient.level === 'Đỏ' ? 'HA ' : 'Glu '}{patient.value}
                                                            </span>
                                                            <span className="text-[10px] text-slate-400 font-medium">{patient.unit}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-5 text-xs text-slate-500 font-medium">{patient.time}</td>
                                                    <td className="px-4 py-5">
                                                        <div className="flex justify-center">
                                                            <span className={`px-3 py-1 ${patient.color} text-white text-[10px] font-extrabold rounded-full uppercase shadow-sm`}>
                                                                {patient.level}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-5 text-right space-x-1">
                                                        <button className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all active:scale-90" title="Can thiệp gấp">
                                                            <span className="material-symbols-outlined text-lg">call</span>
                                                        </button>
                                                        <button className="p-2 text-primary hover:bg-primary/5 rounded-lg transition-all active:scale-90" title="Xem hồ sơ">
                                                            <span className="material-symbols-outlined text-lg">visibility</span>
                                                        </button>
                                                        <button className="p-2 text-slate-400 hover:text-primary hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-all active:scale-90" title="Kê đơn nhanh">
                                                            <span className="material-symbols-outlined text-lg">prescriptions</span>
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        {/* Side Panels */}
                        <div className="space-y-6">
                            {/* AI Insights Card */}
                            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-primary/10 shadow-sm relative overflow-hidden group">
                                <div className="flex items-center gap-2 mb-4 text-emerald-600 dark:text-primary">
                                    <span className="material-symbols-outlined font-variation-settings: 'FILL' 1" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                                    <h5 className="text-xs font-bold uppercase tracking-widest">AI Insights</h5>
                                </div>
                                <p className="text-slate-700 dark:text-slate-300 font-medium leading-relaxed mb-6 text-sm">
                                    "Phát hiện <span className="text-red-500 font-bold">3 bệnh nhân</span> có xu hướng tăng huyết áp liên tục. Khuyến nghị kiểm tra phác đồ điều trị."
                                </p>
                                <div className="flex items-center gap-4">
                                    <div className="flex -space-x-2">
                                        {[1, 2, 3].map((_, i) => (
                                            <div key={i} className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-800 bg-slate-200" />
                                        ))}
                                    </div>
                                    <button className="text-primary text-xs font-bold hover:underline">Xem chi tiết</button>
                                </div>
                                <div className="absolute -right-12 -top-12 w-32 h-32 bg-primary/5 blur-3xl rounded-full group-hover:scale-150 transition-transform duration-700"></div>
                            </div>

                            {/* Quick Actions Card */}
                            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-primary/5">
                                <h5 className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-slate-400 mb-6">Truy cập nhanh</h5>
                                <div className="space-y-3">
                                    {[
                                        { icon: 'contact_phone', label: 'Trạm y tế gần nhất' },
                                        { icon: 'description', label: 'Xuất hồ sơ khẩn cấp' },
                                        { icon: 'history_edu', label: 'Lịch sử phác đồ' }
                                    ].map((action, idx) => (
                                        <button key={idx} className="w-full flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors group">
                                            <div className="flex items-center gap-3 text-slate-700 dark:text-slate-200">
                                                <span className="material-symbols-outlined text-primary text-lg">{action.icon}</span>
                                                <span className="text-sm font-bold">{action.label}</span>
                                            </div>
                                            <span className="material-symbols-outlined text-slate-300 group-hover:translate-x-1 group-hover:text-primary transition-all">chevron_right</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Team Status Card */}
                            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-primary/5">
                                <h5 className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-slate-400 mb-6">Trực cấp cứu</h5>
                                <div className="flex items-center gap-4">
                                    <div className="relative">
                                        <img alt="Trực ban" className="w-12 h-12 rounded-xl object-cover ring-2 ring-primary/20" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAblEzsD1Y4LmmLITIgNYTpxsVwTH-CuEIwKSyz2DiksI-eNLSYk1gZrmmqOVrcMKKM5jS7RPa_zzJz8mK_750j2GRZhTYhIwJ5ZsFDKSU2YJh8148ZzjqpUaDJpW-2FCH9ePgqjtR0J0okNk52zIt0VmcEuF9Jdgkxq32SfbJAoI8tmcGNm4EyWO-YasHos3g46VFbraimlZwxu9ZsDPQL5M2BVTYJo_ALwYMlxNUmvU_cE5dn9itLl5iLuaN2VukHSDXCWN41XNI" />
                                        <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full"></span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-900 dark:text-white">BS. Nguyễn Minh Anh</p>
                                        <p className="text-[10px] text-slate-500 font-medium tracking-tight">Hệ thống phản ứng nhanh</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
