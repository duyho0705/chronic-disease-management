import { useState } from 'react';
import ClinicSidebar from '../components/common/ClinicSidebar';

export default function ClinicPatients() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="flex min-h-screen font-display bg-[#f6f8f7] dark:bg-slate-950 text-slate-900 dark:text-slate-100 italic-none">
            {/* Sidebar Navigation */}
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

                {/* Top Header */}
                <header className="sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-sm dark:shadow-none px-8 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-6 flex-1">
                        <div className="flex items-center gap-4 lg:hidden">
                            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 -ml-2 text-slate-600 dark:text-slate-400">
                                <span className="material-symbols-outlined">menu</span>
                            </button>
                        </div>
                        <h2 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white hidden sm:block">
                            Quản lý bệnh nhân
                        </h2>
                    </div>

                    <div className="flex items-center gap-4">
                        <button className="p-2 text-slate-400 hover:text-primary transition-colors relative group">
                            <span className="material-symbols-outlined">notifications</span>
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
                        </button>
                        <div className="flex items-center gap-3 pl-4 border-l border-slate-200 dark:border-slate-800">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-bold text-slate-900 dark:text-white leading-none">Admin Phan</p>
                                <p className="text-[10px] text-slate-500 font-semibold uppercase mt-1">Quản trị phòng khám</p>
                            </div>
                            <img alt="Profile" className="w-10 h-10 rounded-full object-cover ring-2 ring-primary/20" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAhz3jUpMXwMlfx4vkFE2PQocRa1fUZm_exfcZtNIO3omEOfJPzsmpoAUEta4pYlQCAGNbnMN60wtDwUBzeh6Skt6f2LftN1w5uYjdRkLWGGB6knT99igpO6d5k6SRNXRjbxKvEgAavokX42WwnAMV9StQBkWxamNSc5gQTzbCDvhUryU3G8QJRP-XMutLHlIyYSBAO6GZhvplKJaAlQMTdLlEqQQ7WjVyMtSe0BfK4F1DgrxVxPpouJzPGa6txZAPxvvDZnTmkZtw" />
                        </div>
                    </div>
                </header>

                {/* Content Canvas */}
                <div className="p-8 space-y-10">
                    {/* Header Section */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Danh sách bệnh nhân mãn tính</h3>
                            <p className="text-slate-500 font-medium mt-1">Quản lý và theo dõi sức khỏe bệnh nhân trong toàn phòng khám</p>
                        </div>
                        <button className="bg-primary text-slate-900 px-6 py-3 rounded-2xl font-bold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-primary/20 hover:scale-[0.98] transition-all shadow-sm">
                            <span className="material-symbols-outlined">person_add</span>
                            <span>Thêm bệnh nhân mới</span>
                        </button>
                    </div>

                    {/* Stats Bento Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { label: 'Tổng số bệnh nhân', val: '1,250', trend: '+12% so với tháng trước', icon: 'group', color: 'primary' },
                            { label: 'Nguy cơ cao', val: '24', trend: 'Cần can thiệp ngay', icon: 'warning', color: 'red' },
                            { label: 'Cần tái khám', val: '45', trend: 'Trong tuần này', icon: 'event_repeat', color: 'amber' },
                            { label: 'Mới xuất viện', val: '12', trend: '24 giờ qua', icon: 'logout', color: 'slate' }
                        ].map((stat, i) => (
                            <div key={i} className={`bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-primary/5 hover:shadow-md transition-shadow relative overflow-hidden group`}>
                                <div className="relative z-10">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">{stat.label}</p>
                                    <h4 className={`text-4xl font-black text-slate-900 dark:text-white leading-none ${stat.color === 'red' ? 'text-red-500 dark:text-red-400' : ''}`}>{stat.val}</h4>
                                    <p className={`mt-4 text-[11px] font-bold ${stat.color === 'red' ? 'text-red-400 animate-pulse' : 'text-primary/80'} italic`}>{stat.trend}</p>
                                </div>
                                <span className={`material-symbols-outlined absolute -right-6 -bottom-6 text-9xl ${stat.color === 'red' ? 'text-red-500/5' : 'text-primary/5'} group-hover:scale-110 transition-transform`}>{stat.icon}</span>
                            </div>
                        ))}
                    </div>

                    {/* Filters Bar */}
                    <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-primary/5 shadow-sm flex flex-wrap items-center gap-6">
                        <div className="flex-1 min-w-[300px] relative group">
                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">search</span>
                            <input
                                className="w-full pl-12 pr-6 py-3.5 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-primary/30 text-sm font-bold placeholder:text-slate-400 transition-all"
                                placeholder="Tìm kiếm theo tên hoặc mã bệnh nhân..."
                                type="text"
                            />
                        </div>
                        <div className="flex items-center gap-4 flex-wrap">
                            <select className="bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-3.5 pl-5 pr-12 text-sm font-bold text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-primary/20 appearance-none cursor-pointer">
                                <option>Tất cả bệnh lý</option>
                                <option>Tiểu đường (Diabetes)</option>
                                <option>Cao huyết áp (Hypertension)</option>
                                <option>Suy thận (CKD)</option>
                            </select>
                            <select className="bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-3.5 pl-5 pr-12 text-sm font-bold text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-primary/20 appearance-none cursor-pointer">
                                <option>Mức độ rủi ro</option>
                                <option>Bình thường</option>
                                <option>Theo dõi</option>
                                <option>Nguy cơ cao</option>
                            </select>
                            <button className="bg-slate-50 dark:bg-slate-800 text-slate-500 hover:text-primary p-4 rounded-2xl transition-all hover:shadow-sm">
                                <span className="material-symbols-outlined">tune</span>
                            </button>
                        </div>
                    </div>

                    {/* Patients Table Card */}
                    <div className="bg-white dark:bg-slate-900 rounded-[2rem] overflow-hidden shadow-sm border border-primary/5">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-slate-50 dark:bg-slate-800/50">
                                        <th className="px-8 py-5 text-[10px] uppercase font-black tracking-widest text-slate-400">Thông tin bệnh nhân</th>
                                        <th className="px-8 py-5 text-[10px] uppercase font-black tracking-widest text-slate-400">Cơ bản</th>
                                        <th className="px-8 py-5 text-[10px] uppercase font-black tracking-widest text-slate-400">Bệnh lý</th>
                                        <th className="px-8 py-5 text-[10px] uppercase font-black tracking-widest text-slate-400">Chỉ số mới nhất</th>
                                        <th className="px-8 py-5 text-[10px] uppercase font-black tracking-widest text-slate-400">Mức rủi ro</th>
                                        <th className="px-8 py-5 text-[10px] uppercase font-black tracking-widest text-slate-400">Bác sĩ phụ trách</th>
                                        <th className="px-8 py-5 text-[10px] uppercase font-black tracking-widest text-slate-400 text-right">Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {[
                                        {
                                            name: 'Nguyễn Thị An', id: 'SK-2024-0012', age: 68, gender: 'Nữ', condition: 'Tiểu đường Type 2',
                                            vitals: '135/85 mmHg', extra: 'Glu: 6.8 mmol/L', risk: 'MONITORING', riskColor: 'amber',
                                            dr: 'BS. Trần Vũ', drImg: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDgpPcqqyf6Xh0LWcndTQbzCG5IsON-lMCoeJQCWBHRD_R1V24TkyhMT9X_jZcXLJv7Ezke1Zrj_mNQRQL-g2LVSKuK9esw6xNta9hH1ol4jPGX4D8f9NydFkHbiKPwJQc_WgsuOvCfSgQOSfqti8oP5RHzs8LJq2Yn8wqmi2QTtJiHF2soBRJNoQRVrL0pdfhz1ehu28EMlnYxJFTvVrIwK9S-CtdAz2OYnSahTxju9G0vQUG-TVq660rO9N3O9SI5lx0ZGnl94CA',
                                            img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA6JY2xV6yW03cBHQsc_0V8lZdDia8hnAmqekP0qsH5BDigVbzFwES0eg9KzUjQWHM0kFwBKAUKjHKd5--DRMpJefyjNbnXF6MAsnPPZcdP7JxxsupnEFsBQmXHTlRCuehSqyBxTguz8KqNfSpfkeCIU9kcuR56aldq48f2spzI6ko9ndyNRoQC9iBURblqCv8x2VY0N0Y0Wm_5d4DmCG4D64mF7OdE3ONWx1JPnCGzryojkQqYOlLFXi6qYsu6EqoP3XMB39k3udI'
                                        },
                                        {
                                            name: 'Phạm Văn Hùng', id: 'SK-2024-0459', age: 54, gender: 'Nam', condition: 'Cao huyết áp',
                                            vitals: '165/105 mmHg', extra: 'Glu: 5.2 mmol/L', risk: 'HIGH RISK', riskColor: 'red',
                                            dr: 'BS. Lê Mai', drImg: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDHi0v4zOji5MinB7wBQzU2Ze5e4KkFFcEgzlRGJeWG32reZ9_o9NE-2qprq_uYidnejLexJd1ciYERppNgwEE262IgLq8-q9ESy-O0FS_fA9n2PD4K-86X5LJwMx6DnlZl0gDX9-ytADFMwDPRWQB1CNoTAuh1NflrYEGrFTUcTDDQzw_nBvH3mzYsdPJYEVqHTjvcw_rYJUY0-ddIyXBq63O7vBF5Kpw3riLY6hQxFoLzq4o4M-ajsfXINzyrI0ZtWbfxf3nhcMk',
                                            img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAmlVd4XHcBO80Rdv97APOR53L1BWNU0wkELXuJi5CW13gmVNAeTVSGQHjCOApZrrR5xskMFiqcfI6sGy1M36pRd8Tnob5QhdSZGEhcvKFIXd6L28rgW1wyCIA9XSQFcx1PAnOFcB1_XcrMmryMVdZY4i2YbrmPgWTXK56c1NuvW8pMOvq1pg9m-B-TCXs3xDHKnyLF42haeXAML_deUpPFR-kCsgMF_TWlmLIZwJiMkeQz2WTfIJeNQquMtF0pYd53ErUt0oGQ7g4'
                                        },
                                        {
                                            name: 'Lê Hoàng Nam', id: 'SK-2024-0231', age: 32, gender: 'Nam', condition: 'Hen suyễn',
                                            vitals: '118/75 mmHg', extra: 'SPO2: 98%', risk: 'STABLE', riskColor: 'emerald',
                                            dr: 'BS. Minh Phan', drImg: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAZqn4gqUIjCMg_m7eiQrwu0OPmBVVLJXky6wixBI0wzckCRW1VZ0Akr29yJpyMgVzUmBhXsfuhaQGj832o7dIsZupqlw-s3a1zoRGyxsFhbAaMr4-OXxZP8lPq9zh1Tb2Ts8qCEMh4l8vOXSi10L6LVMEMpVS5_Z-8wPJ3D9zzfYzu6iG9hGxIA1thwwuyizs-53CGVN7ZGSsq8Gy_8PyLFvbxnajrzPzhO0POp06ZSmkqxnpgH2eSZRja0JuyIXA1X75GW_v9a-g',
                                            img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuArYIacp7JXVXSsTrHAJtgzzJ_cRJp_AmOGzA-kZwKiebyScIUQeOpjVXST-t8851RqPwqrsibjKrpAX6quNwGsYuFB8eAN1_-25xXA0BV1T8PVG18tGaE8mR0Ko85uqX3nGD2doEy9Ha-mm2vGJYc9v7JhOjodMnV56oEidOXJtRBRJDjsv8r6e1DCNisi-_carOFNTdkPjRmH7SJ4YxvUxBPHm5iPbOh_VCtHwB3slfZg8H67HrFHFLjUOCVdb9QLwHJGRCmu98M'
                                        }
                                    ].map((patient, idx) => (
                                        <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group">
                                            <td className="px-8 py-5">
                                                <div className="flex items-center gap-4">
                                                    <img alt="Patient Photo" className="w-11 h-11 rounded-full object-cover ring-2 ring-primary/10" src={patient.img} />
                                                    <div>
                                                        <p className="text-sm font-black text-slate-900 dark:text-white group-hover:text-primary transition-colors">{patient.name}</p>
                                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">{patient.id}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5 text-sm text-slate-600 dark:text-slate-400 font-bold">
                                                {patient.age}t / {patient.gender}
                                            </td>
                                            <td className="px-8 py-5">
                                                <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-black px-3 py-1.5 rounded-lg uppercase tracking-wider">
                                                    {patient.condition}
                                                </span>
                                            </td>
                                            <td className="px-8 py-5">
                                                <div className="flex flex-col gap-0.5">
                                                    <span className={`text-sm font-black ${patient.riskColor === 'red' ? 'text-red-500' : 'text-slate-900 dark:text-white'}`}>{patient.vitals}</span>
                                                    <span className="text-[10px] text-slate-400 font-bold">{patient.extra}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5">
                                                <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tighter ${patient.riskColor === 'red' ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-300' :
                                                        patient.riskColor === 'amber' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-300' :
                                                            'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-300'
                                                    }`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full mr-2 ${patient.riskColor === 'red' ? 'bg-red-500 animate-pulse' :
                                                            patient.riskColor === 'amber' ? 'bg-amber-500' :
                                                                'bg-emerald-500'
                                                        }`}></span>
                                                    {patient.risk}
                                                </span>
                                            </td>
                                            <td className="px-8 py-5">
                                                <div className="flex items-center gap-3">
                                                    <img alt="Doctor" className="w-8 h-8 rounded-full border border-primary/20" src={patient.drImg} />
                                                    <span className="text-sm font-bold text-slate-600 dark:text-slate-400">{patient.dr}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5 text-right">
                                                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-x-1 group-hover:translate-x-0">
                                                    <button className="p-2 text-primary hover:bg-primary/10 rounded-xl transition-colors" title="Xem hồ sơ">
                                                        <span className="material-symbols-outlined text-lg">visibility</span>
                                                    </button>
                                                    <button className="p-2 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-xl transition-colors">
                                                        <span className="material-symbols-outlined text-lg">edit</span>
                                                    </button>
                                                    <button className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors">
                                                        <span className="material-symbols-outlined text-lg">delete</span>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination Footer */}
                        <div className="px-8 py-6 bg-slate-50 dark:bg-slate-800/30 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Hiển thị 1 đến 10 trong số 1,250 bệnh nhân</p>
                            <div className="flex items-center gap-2">
                                <button className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-primary transition-all disabled:opacity-30" disabled>
                                    <span className="material-symbols-outlined text-sm">chevron_left</span>
                                </button>
                                <div className="flex items-center gap-1.5">
                                    <button className="w-10 h-10 rounded-xl bg-primary text-slate-900 text-xs font-black shadow-lg shadow-primary/20 transition-all">1</button>
                                    <button className="w-10 h-10 rounded-xl hover:bg-white dark:hover:bg-slate-900 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 text-xs font-bold text-slate-500 transition-all">2</button>
                                    <button className="w-10 h-10 rounded-xl hover:bg-white dark:hover:bg-slate-900 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 text-xs font-bold text-slate-500 transition-all">3</button>
                                    <span className="px-1 text-slate-300 dark:text-slate-600 font-bold">...</span>
                                    <button className="w-10 h-10 rounded-xl hover:bg-white dark:hover:bg-slate-900 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 text-xs font-bold text-slate-500 transition-all">125</button>
                                </div>
                                <button className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-primary transition-all">
                                    <span className="material-symbols-outlined text-sm">chevron_right</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
