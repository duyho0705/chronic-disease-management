import React, { useState } from 'react';
import ClinicSidebar from '../components/common/ClinicSidebar';

export default function ClinicDashboard() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="flex min-h-screen font-display bg-[#f6f8f7] dark:bg-slate-950 text-slate-900 dark:text-slate-100">
            {/* Sidebar Navigation */}
            <ClinicSidebar isSidebarOpen={isSidebarOpen} />

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
                <header className="sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-sm dark:shadow-none px-8 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-6 flex-1">
                        <div className="flex items-center gap-4 lg:hidden">
                            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 -ml-2 text-slate-600 dark:text-slate-400">
                                <span className="material-symbols-outlined">menu</span>
                            </button>
                        </div>
                        <h2 className="font-bold tracking-tight text-emerald-600 dark:text-emerald-400 text-xl hidden md:block">Quản lý Tổng quan</h2>
                        <div className="relative max-w-md w-full">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                            <input className="w-full bg-[#f1f4f2] dark:bg-slate-800 border-none rounded-full py-2.5 pl-10 pr-4 focus:ring-2 focus:ring-primary text-sm transition-all" placeholder="Tìm kiếm bệnh nhân, hồ sơ..." type="text" />
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="w-10 h-10 flex items-center justify-center text-slate-500 hover:text-emerald-500 transition-colors">
                            <span className="material-symbols-outlined">notifications</span>
                        </button>
                        <button className="w-10 h-10 flex items-center justify-center text-slate-500 hover:text-emerald-500 transition-colors">
                            <span className="material-symbols-outlined">settings</span>
                        </button>
                        <div className="h-8 w-[1px] bg-slate-200 dark:bg-slate-700 mx-2"></div>
                        <div className="flex items-center gap-3">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-bold">Admin Clinic</p>
                                <p className="text-[10px] text-slate-500 font-semibold uppercase">Quản trị viên</p>
                            </div>
                            <img className="w-10 h-10 rounded-full object-cover border-2 border-primary-container" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBKRheNnvmBdt0vMs8PDJ82odwDIq3C70mz_jQEqPOlWAs-tlb3IFQk2APyUgfJYyFwYYx5kXde7gPvRZZFUaNT9l3taOL1HmlwY1wBSdmIxyv1Wvs75bp0JKM1e6RFPbTTnZeEoVyF1gxLpeV2NuYCkd6Q5l589kp5AyD7xnSwnal69vp9Uwylvy5jukOKBZ7--67XQhjj2IIp1gIkHSMBrqZ4g3RKqpRbh9MHNrHXbjtkNKKJvn2DfPRK09BrU9nMeLhEb1YpKBI" alt="Avatar" />
                        </div>
                    </div>
                </header>

                <div className="p-8 space-y-8">
                    {/* Welcome Section */}
                    <section className="flex flex-wrap items-center justify-between gap-4">
                        <div className="space-y-1">
                            <h3 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">Chào buổi sáng, Quản trị viên</h3>
                            <p className="text-slate-500 font-medium">Hôm nay có 45 bệnh nhân cần theo dõi tái khám.</p>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            <button className="bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-800 px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-slate-50 transition-all">
                                <span className="material-symbols-outlined text-emerald-500">upload_file</span>
                                Xuất báo cáo Excel
                            </button>
                            <button className="bg-primary text-slate-900 px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 hover:shadow-lg hover:shadow-primary/20 transition-all">
                                <span className="material-symbols-outlined">person_add</span>
                                Thêm bác sĩ mới
                            </button>
                            <button className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 hover:brightness-95 transition-all">
                                <span className="material-symbols-outlined">assignment_ind</span>
                                Phân công bệnh nhân
                            </button>
                        </div>
                    </section>

                    {/* Stats Bento Grid */}
                    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 font-display">
                        {/* Total Patients */}
                        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-primary/5 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-4">
                                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                                    <span className="material-symbols-outlined size-6" style={{ fontVariationSettings: "'FILL' 1" }}>groups</span>
                                </div>
                                <span className="text-emerald-500 text-xs font-bold flex items-center gap-1">+12% <span className="material-symbols-outlined text-xs">trending_up</span></span>
                            </div>
                            <h3 className="text-slate-500 text-sm font-medium">Tổng số bệnh nhân</h3>
                            <p className="text-3xl font-extrabold mt-1 italic-none">1,250</p>
                            <div className="mt-4 h-1.5 w-full bg-slate-50 dark:bg-slate-800 rounded-full overflow-hidden">
                                <div className="h-full bg-primary w-3/4"></div>
                            </div>
                        </div>

                        {/* Disease Ratio */}
                        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-primary/5 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-4">
                                <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center text-amber-500">
                                    <span className="material-symbols-outlined size-6" style={{ fontVariationSettings: "'FILL' 1" }}>monitoring</span>
                                </div>
                                <span className="px-2 py-1 bg-amber-50 dark:bg-amber-900/50 text-amber-600 text-[10px] font-bold rounded-full">Tiểu đường 40%</span>
                            </div>
                            <h3 className="text-slate-500 text-sm font-medium">Tỷ lệ bệnh theo loại</h3>
                            <div className="flex items-end gap-2 mt-1">
                                <p className="text-3xl font-extrabold italic-none">40%</p>
                                <span className="text-slate-400 text-xs font-medium mb-1">/ Cao huyết áp</span>
                            </div>
                            <div className="mt-4 flex gap-1">
                                <div className="h-1.5 w-1/2 bg-amber-400 rounded-full"></div>
                                <div className="h-1.5 w-1/3 bg-primary rounded-full"></div>
                            </div>
                        </div>

                        {/* High Risk Alerts */}
                        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-primary/5 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-4">
                                <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center text-red-500">
                                    <span className="material-symbols-outlined size-6" style={{ fontVariationSettings: "'FILL' 1" }}>warning</span>
                                </div>
                                <span className="px-2 py-1 bg-red-500 text-white text-[10px] font-bold rounded-full animate-pulse">Cần chú ý</span>
                            </div>
                            <h3 className="text-slate-500 text-sm font-medium">Ca nguy cơ cao</h3>
                            <p className="text-3xl font-extrabold mt-1 text-red-500 italic-none">24</p>
                            <p className="text-[10px] text-red-400 font-bold mt-2">+4 ca so với hôm qua</p>
                        </div>

                        {/* Pending follow-up */}
                        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-primary/5 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-4">
                                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center text-blue-500">
                                    <span className="material-symbols-outlined size-6" style={{ fontVariationSettings: "'FILL' 1" }}>event_busy</span>
                                </div>
                            </div>
                            <h3 className="text-slate-500 text-sm font-medium">Chưa tái khám</h3>
                            <p className="text-3xl font-extrabold mt-1 italic-none">45</p>
                            <button className="mt-4 w-full py-2 bg-primary/5 text-primary rounded-xl text-xs font-bold hover:bg-primary/10 transition-colors">Xem danh sách</button>
                        </div>
                    </section>

                    {/* Charts Section */}
                    <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* New Patients Chart */}
                        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-800">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
                                <div>
                                    <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Bệnh nhân mới theo tháng</h3>
                                    <p className="text-sm text-slate-500 font-medium mt-1">Thống kê dữ liệu trong 6 tháng gần nhất</p>
                                </div>
                                <select className="bg-slate-50 dark:bg-slate-800 text-xs font-bold rounded-lg border-slate-200 dark:border-slate-700 px-4 py-2 focus:ring-primary text-slate-900 dark:text-white outline-none">
                                    <option>Năm 2024</option>
                                    <option>Năm 2023</option>
                                </select>
                            </div>
                            <div className="flex items-end justify-between h-64 gap-3 md:gap-6 px-4">
                                {[
                                    { month: 'T.1', height: '66px', active: false },
                                    { month: 'T.2', height: '120px', active: false },
                                    { month: 'T.3', height: '180px', active: true },
                                    { month: 'T.4', height: '140px', active: false },
                                    { month: 'T.5', height: '100px', active: false },
                                    { month: 'T.6', height: '80px', active: false },
                                ].map((item, idx) => (
                                    <div key={idx} className="flex flex-col items-center flex-1 gap-4">
                                        <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-t-2xl relative overflow-hidden group h-48">
                                            <div 
                                                style={{ height: item.height }}
                                                className={`absolute bottom-0 w-full transition-all duration-700 ${item.active ? 'bg-primary shadow-[0_-10px_20px_rgba(74,222,128,0.3)]' : 'bg-primary/40 group-hover:bg-primary/60'}`}
                                            ></div>
                                        </div>
                                        <span className={`text-xs font-black ${item.active ? 'text-primary' : 'text-slate-400'}`}>{item.month}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Pathology Pie Chart */}
                        <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col justify-between">
                            <div>
                                <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Cơ cấu bệnh lý</h3>
                                <p className="text-sm text-slate-500 font-medium">Phân tích theo danh mục</p>
                            </div>
                            <div className="relative w-48 h-48 mx-auto my-10">
                                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                                    <circle className="stroke-slate-50 dark:stroke-slate-800" cx="18" cy="18" fill="none" r="16" strokeWidth="4"></circle>
                                    <circle className="stroke-emerald-500" cx="18" cy="18" fill="none" r="16" strokeDasharray="40 100" strokeWidth="4"></circle>
                                    <circle className="stroke-amber-400" cx="18" cy="18" fill="none" r="16" strokeDasharray="35 100" strokeDashoffset="-40" strokeWidth="4"></circle>
                                    <circle className="stroke-[#d1f9e1] dark:stroke-emerald-900" cx="18" cy="18" fill="none" r="16" strokeDasharray="25 100" strokeDashoffset="-75" strokeWidth="4"></circle>
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-3xl font-black text-slate-900 dark:text-white">75%</span>
                                    <span className="text-[10px] uppercase font-black text-slate-400 tracking-widest mt-1">Mãn tính</span>
                                </div>
                            </div>
                            <div className="space-y-4">
                                {[
                                    { color: 'bg-emerald-500', label: 'Tiểu đường', value: '40%' },
                                    { color: 'bg-amber-400', label: 'Cao huyết áp', value: '35%' },
                                    { color: 'bg-[#d1f9e1]', label: 'Bệnh tim mạch', value: '25%' },
                                ].map((item, idx) => (
                                    <div key={idx} className="flex justify-between items-center bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-700/50">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                                            <span className="font-bold text-slate-600 dark:text-slate-300 text-xs">{item.label}</span>
                                        </div>
                                        <span className="font-black text-slate-900 dark:text-white text-xs">{item.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Doctor Performance Table */}
                    <section className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-sm overflow-hidden border border-slate-100 dark:border-slate-800">
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
                                    <tr className="bg-slate-50 dark:bg-slate-800/50">
                                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500">Họ và Tên Bác sĩ</th>
                                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500">Chuyên khoa</th>
                                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500 text-center">Tải lượng</th>
                                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500">Đánh giá</th>
                                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500">Trạng thái</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                                    {[
                                        { 
                                            name: 'BS. Lê Thị Mai', id: 'DR-1024', dept: 'Nội tiết', load: 124, progress: 'w-4/5', color: 'emerald', rating: '4.9', reviews: 420, status: 'Đang trực', active: true,
                                            img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAhOoC9URZAHCP9v9d_l_e-tyh66ffAtXVouqi4DZSNPa_eq_JzHX993csJtIXauOlPnmXYsPpVSyauZnWxcYV0fodnKzn8Ihjmni-69lwmEZo5ugMwzJXx9nSknt0kftRkYZBXvjHcMHbqgeNSCgeYlaPo_sDnjYWhL--uhL42_WuhgMEh-Iqfvnzf5OGRgKBbIeVMbzn_qr-uoS-9lmem5CY9sVQPDjZIw4w-2r_lhCaOmqMuY1GKus8fSstMQoPp2EDUQSklumY'
                                        },
                                        { 
                                            name: 'BS. Nguyễn Văn Hùng', id: 'DR-1025', dept: 'Tim mạch', load: 98, progress: 'w-3/5', color: 'amber', rating: '4.7', reviews: 315, status: 'Nghỉ ca', active: false,
                                            img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDYDRWmp-LgjGpRKEb5U5aaxSuviEGGzdWXblGs06zhuwpWaZlFdSZwRT2bBxg6mk28k9IhyLFivR9v7kIzFi9BsQ5iyenuznuRy4WeKYvqDbbgdtig_kA2eVqY6q6ze5jElaX7E4cyXqg59-fMZc_Y_EJvSgAZw2Kz_Uc284VdQyqwMvZEUE6kdCYgSkePLdYKSeXpgGJ4gGuye7EP0h8WaOBKfRQsPZVZI-vVFKYCkcethQLzefVbnTo7d3bMBljYXQRbWQx7GIY'
                                        },
                                        { 
                                            name: 'BS. Trần Thanh Vân', id: 'DR-1026', dept: 'Tổng quát', load: 145, progress: 'w-full', color: 'red', rating: '4.8', reviews: 512, status: 'Đang trực', active: true,
                                            img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCOFydsdqg-2jcC8qqhrnbKLzToNMCULCj8kyNLPwDJhnwypFWphQdC-LNlWhR1UURPvoXudthuFIUnREVvDR3eG6N2BuB4kRtmEs8P7hPC-nb4GN4GLkD2iQyMw8ZQN6P-P7ZkkPs6VQ-zUcMD8ePKPeTJ1xBewyRCscMbjGLyYx4c2jHqTvKkKND5EyOo6ASSzGZxcY2awgm30cYlHU7j6MKaqo_oUJlqbZGFhXOVrVoPW-QHdyVIqGTLynA71J9L8LXuIVqh4O0'
                                        }
                                    ].map((dr, idx) => (
                                        <tr key={idx} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors group cursor-pointer">
                                            <td className="px-8 py-5">
                                                <div className="flex items-center gap-4">
                                                    <div className="relative shrink-0">
                                                        <img className="size-11 rounded-full object-cover border-2 border-primary/10" src={dr.img} alt={dr.name} />
                                                        {dr.active && <span className="absolute bottom-0 right-0 size-3 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full"></span>}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">{dr.name}</p>
                                                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{dr.id}</p>
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
                                                    <span className="text-[10px] text-slate-400 font-bold">({dr.reviews})</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5">
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${dr.active ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'}`}>
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
            </main>

            {/* Contextual FAB */}
            <button className="fixed bottom-8 right-8 w-16 h-16 bg-primary text-slate-900 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-50 shadow-primary/30">
                <span className="material-symbols-outlined text-3xl font-bold">add</span>
            </button>
        </div>
    );
}
