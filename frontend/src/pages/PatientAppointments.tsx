import React from 'react';

const PatientAppointments: React.FC = () => {
    return (
        <div className="flex flex-col lg:flex-row -m-8 h-[calc(100vh-64px)] overflow-hidden animate-in fade-in duration-700">
            {/* Main Content Area */}
            <div className="flex-1 p-8 space-y-8 overflow-y-auto custom-scrollbar">
                {/* Header Section */}
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Lịch hẹn</h2>
                        <p className="text-slate-500 dark:text-slate-400">Quản lý và theo dõi các buổi khám của bạn</p>
                    </div>
                    <button className="bg-primary hover:bg-primary/90 text-slate-900 px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-primary/20 active:scale-95">
                        <span className="material-symbols-outlined">add_circle</span>
                        Đặt lịch mới
                    </button>
                </header>

                {/* Upcoming Appointments */}
                <section>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">Lịch khám sắp tới</h3>
                        <span className="text-sm text-primary font-medium cursor-pointer hover:underline">Xem tất cả</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Appointment Card 1 */}
                        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all group">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex gap-4">
                                    <div className="size-16 rounded-xl overflow-hidden shadow-inner ring-1 ring-primary/10">
                                        <img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD7vXnp6aQPjZ60X4dViKy4wc9f4af2BaYYdWjq6ffrcLIsH6-nIjntF36ybndgEL8mwebC6vRSsI8QRjBXPV3P0IrWdH-E07u6jxXhVxOn1-NI6lORB2T18_nDSbYHuKxpSZnv6itE2edZIDKHLDxUfmox_g5NChHrkMqYINEZbd22S-Z54JU8oI_MSG0rH7iUZ3VueAzO6AwkFqlQ2mgjCn6QD6Zi66JkjKvOdH2kEC8F3DSs2wvfZA2n1GLEXkG-44UoVTQ1yK8" alt="Bác sĩ" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg text-slate-900 dark:text-white">BS. Nguyễn Văn An</h4>
                                        <p className="text-sm text-primary font-medium">Chuyên khoa Tim mạch</p>
                                    </div>
                                </div>
                                <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Trực tiếp</div>
                            </div>
                            <div className="space-y-3 mb-6">
                                <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                                    <span className="material-symbols-outlined text-sm">event</span>
                                    <span className="text-sm">Thứ Hai, 20 Tháng 10, 2023</span>
                                </div>
                                <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                                    <span className="material-symbols-outlined text-sm">schedule</span>
                                    <span className="text-sm">09:00 - 09:30</span>
                                </div>
                                <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                                    <span className="material-symbols-outlined text-sm">location_on</span>
                                    <span className="text-sm">Phòng khám Đa khoa Hoàn Mỹ, Quận 1</span>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <button className="flex-1 bg-primary text-slate-900 py-2.5 rounded-lg text-sm font-bold hover:bg-primary/90 transition-colors">Nhắc tôi</button>
                                <button className="px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">Hủy lịch</button>
                            </div>
                        </div>

                        {/* Appointment Card 2 */}
                        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all group">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex gap-4">
                                    <div className="size-16 rounded-xl overflow-hidden shadow-inner ring-1 ring-blue-100/50">
                                        <img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAvda6dwU3lWoctny-heWxDpNckP5ehOjM0MnSJHBC-Ni9fJSLUhDhINVjlLZcWCCyUGjkYHbPJ-eP7ZnyV9Lp-HEu9MB1jAxoJeebCMZfLsFcMNQGzZT19rq9k35Ijsd83tztLM11O4EUxoiL3EMBsqWza3nXCAQ41QN8s_C3JuOmzYwvrKQzHSjhtpXGUmjhYJgzm6LiiXBjWADsjD16ckFbsmmGNMtfhZJ_ZLL5DYPKG4wXtsLx5zj5ZaCg-cwJCncB5li2GG5c" alt="Bác sĩ" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg text-slate-900 dark:text-white">BS. Trần Thị Mai</h4>
                                        <p className="text-sm text-primary font-medium">Chuyên khoa Nội tiết</p>
                                    </div>
                                </div>
                                <div className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Online</div>
                            </div>
                            <div className="space-y-3 mb-6">
                                <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                                    <span className="material-symbols-outlined text-sm">event</span>
                                    <span className="text-sm">Thứ Sáu, 25 Tháng 10, 2023</span>
                                </div>
                                <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                                    <span className="material-symbols-outlined text-sm">schedule</span>
                                    <span className="text-sm">14:30 - 15:00</span>
                                </div>
                                <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                                    <span className="material-symbols-outlined text-sm text-blue-500">videocam</span>
                                    <span className="text-sm font-medium text-blue-500 underline cursor-pointer">Liên kết Google Meet</span>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <button className="flex-1 bg-primary text-slate-900 py-2.5 rounded-lg text-sm font-bold hover:bg-primary/90 transition-colors">Vào phòng chờ</button>
                                <button className="px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">Hủy lịch</button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* History Section */}
                <section>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">Lịch sử khám bệnh</h3>
                        <div className="flex gap-2">
                            <button className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 transition-colors">
                                <span className="material-symbols-outlined text-slate-500">filter_list</span>
                            </button>
                            <button className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 transition-colors">
                                <span className="material-symbols-outlined text-slate-500">search</span>
                            </button>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                                    <tr>
                                        <th className="px-6 py-4 text-sm font-bold text-slate-500 uppercase tracking-wider">Ngày khám</th>
                                        <th className="px-6 py-4 text-sm font-bold text-slate-500 uppercase tracking-wider">Bác sĩ</th>
                                        <th className="px-6 py-4 text-sm font-bold text-slate-500 uppercase tracking-wider">Chẩn đoán</th>
                                        <th className="px-6 py-4 text-sm font-bold text-slate-500 uppercase tracking-wider">Trạng thái</th>
                                        <th className="px-6 py-4 text-sm font-bold text-slate-500 uppercase tracking-wider text-right">Hành động</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {[
                                        { date: '15/09/2023', name: 'BS. Lê Minh Tâm', diagnosis: 'Huyết áp không ổn định, cần theo dõi...', status: 'Hoàn tất', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCAWRcfVWN7UNQqmFmR_QkId_S16yFYF9D4qL1HCEGGpY5-3KPhxBJEeulAkD4o2y_07OlomR2DODvdhokxKHN3E1plG2S--oSg0AY3yuX7o80xy_4YCf7qFJdn6vXq8whHu05-2d4Zg-Rl2V0DftvfFRyPCkoDMEAXzL1Wz-az_UgvAOmQm0titJ-mFiicY8k1KuO61LfKSQWY00nucGM2bOlz4Fts0NFY9qiNWYinazsxyStpDFQA_XF8kD-kw0PLRpx-MuaWf80' },
                                        { date: '02/08/2023', name: 'BS. Trần Thị Mai', diagnosis: 'Kiểm tra đường huyết định kỳ...', status: 'Hoàn tất', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBHm3n8TsfIzVQfdVxqHbQ4m_x4IQ07xSA4Jgj59fYOOYMD0E_wJEWw-OxpmjR6cmtM3cVQZCTN74PHKBPrmzlV8-38OaAqZtgaljrg8xFClIP-MO-6vwu56s9WYqeASCNgb5WrgWS7B56XFPgQhGum8Q1nDKhQSDy8hqMg23tLuihSDIHk2QIMDh4JNQCnhURiqgnkZYfMrc1pyYZ6pBcZIu-h4GC5Ucmz_1zNBVwQm79G31J6ybpsJAvurETNYKiLiLCXnoiIJxQ' },
                                        { date: '10/06/2023', name: 'BS. Ngô Bảo Châu', diagnosis: 'Tư vấn chế độ dinh dưỡng DASH...', status: 'Hoàn tất', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDaSQtZFsHveMivLG8NeYOxoptnO6nchyqB4PJU2S-UGDMDTLdCpnL9qSrqWG0oaoKK_UrXPdxOpOzvH7BWuA-7WAtGw3ZPVRPOyJzVMJvdhGDOXWYd5F6nXXuQZD3jSntCWMpL5Z7F4jlZaPeVhMmfmb6FsnoRTZbjtK2aRNB2o5RPHYiBLvvSX4ss-_fPwgtsFbNYnx3Jnm4f8Gi2gB6CXC6xDkcAP05ud_q-DHXtIv9yL0s0ZArs6g7zVCXW2pk-7PJSsIBwUF8' },
                                    ].map((row, idx) => (
                                        <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-700 dark:text-slate-300">{row.date}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-3">
                                                    <div className="size-8 rounded-full shadow-inner ring-1 ring-slate-100 overflow-hidden">
                                                        <img src={row.img} alt="Bác sĩ" className="w-full h-full object-cover" />
                                                    </div>
                                                    <span className="text-sm font-medium text-slate-900 dark:text-white">{row.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400 max-w-[200px] truncate">{row.diagnosis}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="px-2.5 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-xs font-bold">{row.status}</span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right">
                                                <button className="text-primary hover:text-primary/80 text-sm font-bold transition-colors">Xem kết quả</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>
            </div>

            {/* Right Sidebar */}
            <aside className="w-full lg:w-80 bg-white dark:bg-background-dark border-l border-slate-200 dark:border-slate-800 p-6 space-y-8 overflow-y-auto custom-scrollbar">
                {/* Mini Calendar */}
                <section>
                    <div className="flex items-center justify-between mb-4">
                        <h4 className="font-bold text-slate-900 dark:text-white">Lịch cá nhân</h4>
                        <span className="text-xs font-medium text-slate-400">Tháng 10, 2023</span>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                        <div className="grid grid-cols-7 gap-1 text-center mb-2">
                            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
                                <span key={d} className="text-[10px] font-bold text-slate-400 uppercase">{d}</span>
                            ))}
                        </div>
                        <div className="grid grid-cols-7 gap-1 text-center">
                            {/* Days before Oct 1 */}
                            {[26, 27, 28, 29, 30].map(d => (
                                <div key={d} className="py-2 text-xs text-slate-300">{d}</div>
                            ))}
                            {/* Days of Oct */}
                            {Array.from({ length: 30 }, (_, i) => i + 1).map(d => (
                                <div key={d} className={`py-2 text-xs font-medium cursor-pointer hover:bg-primary/20 hover:text-primary rounded-full transition-all ${
                                    d === 20 ? 'bg-primary text-slate-900 font-bold shadow-lg shadow-primary/20 scale-110' : 
                                    d === 25 ? 'bg-primary/20 text-primary font-bold' : ''
                                }`}>
                                    {d}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* My Doctors */}
                <section>
                    <h4 className="font-bold mb-4 text-slate-900 dark:text-white">Bác sĩ của tôi</h4>
                    <div className="space-y-4">
                        {[
                            { name: 'BS. Nguyễn Văn An', role: 'Tim mạch', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDNVrX73MBCojMqbDFUwQyjI6TdA9nhpJg97bUY7Cy5BH0fBKLpo0-lxHx_x4o3Ykku8a4AaBKnTcZGGmn71ZM1e407H0cfPqPoiQaRc6PrjsflrG9vG_-ermlc_z9IDMtBwLpnhEzau6AdP3uNvGQ2CceEV-shTXGY7z5WTfpYRKqYw7zLbKNS6nu_lI5CnDYSZsljSUzlk7eezyLBdKpuhMQR09YHhmv_8ADFNhr8IyQ7I492t-cAHTi521L3GeLVaBjXQAAdoBs' },
                            { name: 'BS. Trần Thị Mai', role: 'Nội tiết', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAOuaAUqu7v46DPyZxwQg5Y-0cRe__Q0CnlGfc2HJfaYT6sb3ZsCURc8yLMFAkOQwvB2K3ZFHxFuiJn5_MOhDlJt-JgImJ1V9h_zSkfpRWGPyENaTzz70uIqmaL6koedomRxRZ67aCI2B4BaUlMxZ-RKbvnnRxHT780Lfm8SbNcWX1Ij1kuSnBJRAy-YpXs8WG1wejPJIiMGdd2A18U_EakTYpLXmqsFsgRR9NnCw5k2TAIgCiA5y2JvQt150APFVQe9CbDS5GYJ_U' },
                            { name: 'BS. Ngô Bảo Châu', role: 'Nội khoa', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAxjKjDlrSiNxOWus-qSZvA8zg000ZqlSSZuCL0mxv0KS_9NbHYfZtIaXUgFCC7DUwXJcG01uHQkRLiHI_yEVRyMhIuRWJL_vyoPEh7N5AKXj39tl-Pm0_8iUk42jf3Pkj4vlPoR-toF0AqQmrkD9J_ccT_GMaQhd1DgQhVzZHGjW2r2B6hOGMRHqQtDYeS0blXcjW2fHo7Whot-dV2V0mgoarziD6utVOfiXlsalZ80NLJyIuvF0wiRSN7zC9m8XWFCSE1nWVYlGs' }
                        ].map((doc, idx) => (
                            <div key={idx} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 transition-all cursor-pointer group hover:shadow-sm">
                                <div className="flex items-center gap-3">
                                    <div className="size-10 rounded-full overflow-hidden shadow-inner ring-1 ring-slate-100">
                                        <img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" src={doc.img} alt={doc.name} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold leading-tight text-slate-900 dark:text-white">{doc.name}</p>
                                        <p className="text-[10px] text-slate-500 font-medium">{doc.role}</p>
                                    </div>
                                </div>
                                <span className="material-symbols-outlined text-primary text-xl group-hover:rotate-12 transition-transform">calendar_add_on</span>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Health Tip Widget */}
                <section className="bg-primary/10 p-5 rounded-2xl border border-primary/20 relative overflow-hidden group">
                    <div className="relative z-10">
                        <span className="material-symbols-outlined text-primary mb-2 animate-bounce">lightbulb</span>
                        <h5 className="font-bold text-sm mb-1 text-slate-900 dark:text-slate-100">Lời khuyên hôm nay</h5>
                        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">Đừng quên ghi lại chỉ số đường huyết trước buổi khám chiều nay để bác sĩ tư vấn chính xác hơn nhé!</p>
                    </div>
                    <div className="absolute -right-4 -bottom-4 size-24 bg-primary/20 rounded-full blur-2xl group-hover:bg-primary/30 transition-all"></div>
                </section>
            </aside>
        </div>
    );
};

export default PatientAppointments;
