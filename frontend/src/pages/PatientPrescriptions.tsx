import React from 'react';

const PatientPrescriptions: React.FC = () => {
    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header Section */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 text-left">
                <div>
                    <h1 className="text-[26px] font-extrabold tracking-tight text-slate-900 dark:text-white">Đơn thuốc của tôi</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Quản lý và theo dõi các loại thuốc đang sử dụng cho bệnh mãn tính</p>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold text-sm hover:bg-slate-50 transition-colors shadow-sm">
                        <span className="material-symbols-outlined text-lg">history</span>
                        Lịch sử
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl font-bold text-sm shadow-lg shadow-primary/20 active:scale-95 transition-transform">
                        <span className="material-symbols-outlined text-lg">add_shopping_cart</span>
                        Yêu cầu cấp lại
                    </button>
                </div>
            </header>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 text-left">
                {/* Left Column: Active Prescriptions */}
                <div className="xl:col-span-2 space-y-6">
                    <section>
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-white">
                            <span className="material-symbols-outlined text-primary font-bold">pill</span>
                            Đang điều trị
                        </h2>
                        <div className="grid gap-4">
                            {/* Card 1 */}
                            <div className="bg-white dark:bg-slate-800/50 rounded-2xl p-5 border border-slate-100 dark:border-slate-700/50 shadow-sm flex flex-col md:flex-row gap-5 hover:shadow-md transition-all group">
                                <div className="w-full md:w-32 h-32 bg-slate-100 dark:bg-slate-700 rounded-xl flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                                    <span className="material-symbols-outlined text-5xl text-slate-400 group-hover:text-primary transition-colors">medication</span>
                                </div>
                                <div className="flex-1 flex flex-col justify-between">
                                    <div>
                                        <div className="flex justify-between items-start">
                                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Metformin 500mg</h3>
                                            <span className="bg-primary/20 text-primary-dark dark:text-primary px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Hạ đường huyết</span>
                                        </div>
                                        <div className="mt-2 space-y-2">
                                            <p className="text-sm flex items-center gap-2 text-slate-600 dark:text-slate-300">
                                                <span className="material-symbols-outlined text-base text-primary">schedule</span>
                                                <span className="font-medium">Tần suất: 2 lần/ngày (Sáng - Tối)</span>
                                            </p>
                                            <p className="text-sm flex items-center gap-2 text-slate-600 dark:text-slate-300">
                                                <span className="material-symbols-outlined text-base text-primary">info</span>
                                                <span className="font-medium">Hướng dẫn: Uống ngay sau khi ăn no</span>
                                            </p>
                                        </div>
                                    </div>
                                    <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-24 h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden shadow-inner">
                                                <div className="h-full bg-primary" style={{ width: '50%' }}></div>
                                            </div>
                                            <span className="text-xs font-bold text-slate-500">Còn lại: 15 ngày</span>
                                        </div>
                                        <button className="text-primary hover:underline text-sm font-bold flex items-center gap-1 transition-all">
                                            <span className="material-symbols-outlined text-lg">download</span>
                                            Tải PDF
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Card 2 */}
                            <div className="bg-white dark:bg-slate-800/50 rounded-2xl p-5 border border-slate-100 dark:border-slate-700/50 shadow-sm flex flex-col md:flex-row gap-5 hover:shadow-md transition-all group">
                                <div className="w-full md:w-32 h-32 bg-slate-100 dark:bg-slate-700 rounded-xl flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                                    <span className="material-symbols-outlined text-5xl text-slate-400 group-hover:text-blue-500 transition-colors">medical_services</span>
                                </div>
                                <div className="flex-1 flex flex-col justify-between">
                                    <div>
                                        <div className="flex justify-between items-start">
                                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Lisinopril 10mg</h3>
                                            <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Huyết áp</span>
                                        </div>
                                        <div className="mt-2 space-y-2">
                                            <p className="text-sm flex items-center gap-2 text-slate-600 dark:text-slate-300">
                                                <span className="material-symbols-outlined text-base text-blue-500">schedule</span>
                                                <span className="font-medium">Tần suất: 1 lần/ngày (Sáng)</span>
                                            </p>
                                            <p className="text-sm flex items-center gap-2 text-slate-600 dark:text-slate-300">
                                                <span className="material-symbols-outlined text-base text-blue-500">info</span>
                                                <span className="font-medium">Hướng dẫn: Uống trước khi ăn 30 phút</span>
                                            </p>
                                        </div>
                                    </div>
                                    <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-24 h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden shadow-inner">
                                                <div className="h-full bg-primary" style={{ width: '66%' }}></div>
                                            </div>
                                            <span className="text-xs font-bold text-slate-500">Còn lại: 20 ngày</span>
                                        </div>
                                        <button className="text-primary hover:underline text-sm font-bold flex items-center gap-1 transition-all">
                                            <span className="material-symbols-outlined text-lg">download</span>
                                            Tải PDF
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Prescription History Table */}
                    <section className="mt-10">
                        <h2 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">Lịch sử đơn thuốc</h2>
                        <div className="bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700/50 overflow-hidden shadow-sm">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm font-display">
                                    <thead>
                                        <tr className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 uppercase text-[10px] font-black tracking-widest">
                                            <th className="px-6 py-4">Ngày cấp</th>
                                            <th className="px-6 py-4">Bác sĩ kê đơn</th>
                                            <th className="px-6 py-4">Chẩn đoán</th>
                                            <th className="px-6 py-4">Trạng thái</th>
                                            <th className="px-6 py-4"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                                        {[
                                            { date: '15/10/2023', doctor: 'BS. Lê Minh Tâm', diagnosis: 'Tiểu đường Type 2', status: 'Hoàn thành' },
                                            { date: '12/09/2023', doctor: 'BS. Nguyễn Thu Thủy', diagnosis: 'Cao huyết áp', status: 'Hoàn thành' },
                                        ].map((row, idx) => (
                                            <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/30 transition-colors cursor-pointer">
                                                <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">{row.date}</td>
                                                <td className="px-6 py-4 font-medium text-slate-700 dark:text-slate-300">{row.doctor}</td>
                                                <td className="px-6 py-4 text-slate-500 dark:text-slate-400 font-medium">{row.diagnosis}</td>
                                                <td className="px-6 py-4">
                                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                                                        {row.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <button className="text-primary material-symbols-outlined font-bold hover:scale-110 transition-transform">visibility</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Right Column: Reminders & Alerts */}
                <div className="space-y-6">
                    <section className="bg-white dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-100 dark:border-slate-700/50 shadow-sm relative overflow-hidden">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Lịch uống thuốc hôm nay</h2>
                            <span className="text-primary text-[10px] font-black px-2 py-1 bg-primary/10 rounded uppercase tracking-widest">3 lần nữa</span>
                        </div>
                        <div className="space-y-6 relative before:content-[''] before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-100 dark:before:bg-slate-700">
                            {/* Slot 1 */}
                            <div className="relative pl-8 flex items-start gap-4 group">
                                <div className="absolute left-0 top-1.5 size-6 rounded-full bg-primary border-4 border-white dark:border-slate-800 z-10 flex items-center justify-center shadow-sm">
                                    <span className="material-symbols-outlined text-white text-[10px] font-black">check</span>
                                </div>
                                <div className="flex-1">
                                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">07:00 Sáng</p>
                                    <h4 className="font-bold text-slate-400 line-through tracking-tight">Lisinopril 10mg</h4>
                                    <p className="text-xs text-slate-400 italic">Đã uống lúc 07:05</p>
                                </div>
                            </div>
                            {/* Slot 2 */}
                            <div className="relative pl-8 flex items-start gap-4">
                                <div className="absolute left-0 top-1.5 size-6 rounded-full bg-primary border-4 border-white dark:border-slate-800 z-10 flex items-center justify-center shadow-sm">
                                    <span className="material-symbols-outlined text-white text-[10px] font-black">check</span>
                                </div>
                                <div className="flex-1">
                                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">08:00 Sáng</p>
                                    <h4 className="font-bold text-slate-400 line-through tracking-tight">Metformin 500mg</h4>
                                    <p className="text-xs text-slate-400 italic">Đã uống lúc 08:15</p>
                                </div>
                            </div>
                            {/* Slot 3 (Upcoming) */}
                            <div className="relative pl-8 flex items-start gap-4 group">
                                <div className="absolute left-0 top-1.5 size-6 rounded-full bg-slate-200 dark:bg-slate-600 border-4 border-white dark:border-slate-800 z-10 group-hover:scale-110 transition-transform"></div>
                                <div className="flex-1">
                                    <p className="text-[10px] text-primary font-black uppercase tracking-widest">19:00 Tối</p>
                                    <h4 className="font-bold text-slate-900 dark:text-white tracking-tight">Metformin 500mg</h4>
                                    <p className="text-xs text-slate-500 italic">Sắp đến giờ uống</p>
                                    <button className="mt-4 w-full py-2.5 bg-slate-100 dark:bg-slate-700 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-600 hover:bg-primary hover:text-white hover:border-primary transition-all">Đánh dấu đã uống</button>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="bg-primary/5 dark:bg-primary/10 rounded-2xl p-6 border border-primary/20 relative group overflow-hidden">
                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-4">
                                <span className="material-symbols-outlined text-primary fill-1 animate-pulse">notifications_active</span>
                                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Thông báo đơn thuốc</h2>
                            </div>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
                                Bạn còn **3 ngày** thuốc <strong>Metformin</strong>. Chúng tôi khuyên bạn nên yêu cầu cấp lại đơn ngay để không gián đoạn điều trị.
                            </p>
                            <button className="w-full bg-primary text-white font-black py-3.5 rounded-xl shadow-lg shadow-primary/20 flex items-center justify-center gap-2 hover:bg-primary/90 hover:-translate-y-1 transition-all active:scale-95 uppercase tracking-widest text-xs">
                                <span className="material-symbols-outlined text-lg">autorenew</span>
                                Tái cấp ngay
                            </button>
                        </div>
                        <div className="absolute -right-8 -bottom-8 size-32 bg-primary/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
                    </section>

                    {/* Pharmacy Location/Map Placeholder */}
                    <div className="rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-700/50 shadow-sm group">
                        <div className="h-32 bg-slate-200 dark:bg-slate-700 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAlIizGDVBuX_3nuF5iQl0R3NM2ni_b_96BIPUnCLr2rlhOeFBcLv7fI5jkDVWjLh4YV4MXYLiVSzsjNOqrnWEgtNA7QBHRg6hcGJJ2TFdzE7Phk8sq06w7kUXJyUvAr38Os363BL-6dQjmYTM_sUjEuXzRW9dfFrPivG2P1eVQh8iUUUMl5QHoTKMaL3Jr66jkXZmv8sj04yUF36eYTb4ARGyDGpslGnDcpd7o7lfaRNej94op17248eITtSjjX4KD9yH-VnpSV6U')" }}></div>
                        <div className="p-4 bg-white dark:bg-slate-800/50">
                            <h4 className="font-bold text-sm text-slate-900 dark:text-white">Nhà thuốc gần nhất</h4>
                            <p className="text-xs text-slate-500 mt-1">Pharmacity - 123 Lê Lợi, Quận 1</p>
                            <a className="text-primary text-[10px] font-black uppercase tracking-widest mt-3 block hover:underline" href="#">Chỉ đường</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PatientPrescriptions;
