import { useState } from 'react';
import ClinicSidebar from '../components/common/ClinicSidebar';
import TopBar from '../components/common/TopBar';
import CreatePatientModal from '../features/clinic/components/CreatePatientModal';

export default function ClinicPatients() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // Mock available doctors for assignments
    const availableDoctors = ['BS. Trần Vũ', 'BS. Lê Mai', 'BS. Minh Phan', 'BS. Nguyễn Văn Hùng'];

    const [notifications, setNotifications] = useState([
        { id: 1, title: 'Báo cáo mới', description: 'Có báo cáo tổng quát tháng 12 vừa được tạo.', time: '5 phút trước', read: false },
        { id: 2, title: 'Cảnh báo nguy cơ', description: 'Bệnh nhân Nguyễn Văn An có chỉ số bất thường.', time: '1 giờ trước', read: false },
    ]);

    const handleCreatePatient = async (data: any) => {
        setIsSaving(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));
        console.log("New Patient Created:", data);
        setIsSaving(false);
        setIsCreateModalOpen(false);
        // Toast notification could be triggered here
    };

    return (
        <div className="flex min-h-screen font-display bg-[#f6f8f7] dark:bg-slate-950 text-slate-900 dark:text-slate-100 italic-none">
            {/* Sidebar Navigation */}
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

                {/* Header */}
                <TopBar
                    setIsSidebarOpen={setIsSidebarOpen}
                    notifications={notifications}
                    setNotifications={setNotifications}
                />

                {/* Content Canvas */}
                <div className="p-8 space-y-10">
                    {/* Header Section */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div className="space-y-1">
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Danh sách bệnh nhân mãn tính</h3>
                            <p className="text-slate-500 font-medium">Quản lý và theo dõi sức khỏe bệnh nhân trong toàn phòng khám</p>
                        </div>
                        <button
                            onClick={() => setIsCreateModalOpen(true)}
                            className="bg-primary text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-primary/20 transition-all font-display"
                        >
                            <span className="material-symbols-outlined">person_add</span>
                            <span>Thêm bệnh nhân mới</span>
                        </button>
                    </div>

                    {/* Stats Bento Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { label: 'Tổng số bệnh nhân', val: '1,250', trend: '+12%', icon: 'groups', color: 'primary', trendIcon: 'trending_up', trendColor: 'text-emerald-500' },
                            { label: 'Nguy cơ cao', val: '24', trend: 'Cần chú ý', icon: 'warning', color: 'red', trendColor: 'text-red-500' },
                            { label: 'Cần tái khám', val: '45', trend: '45 ca', icon: 'event_repeat', color: 'amber', trendColor: 'text-amber-500' },
                            { label: 'Mới xuất viện', val: '12', trend: 'Hôm nay', icon: 'logout', color: 'slate', trendColor: 'text-slate-400' }
                        ].map((stat, i) => (
                            <div key={i} className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-primary/5 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start mb-4">
                                    <div className={`w-12 h-12 ${stat.color === 'primary' ? 'bg-primary/10 text-primary' : stat.color === 'red' ? 'bg-red-100 text-red-500' : stat.color === 'amber' ? 'bg-amber-100 text-amber-500' : 'bg-slate-100 text-slate-500'} rounded-lg flex items-center justify-center text-primary`}>
                                        <span className="material-symbols-outlined size-6" style={{ fontVariationSettings: "'FILL' 1" }}>{stat.icon}</span>
                                    </div>
                                    <span className={`${stat.trendColor} text-[13px] font-bold flex items-center gap-1`}>
                                        {stat.trend}
                                        {stat.trendIcon && <span className="material-symbols-outlined text-xs">trending_up</span>}
                                    </span>
                                </div>
                                <h3 className="text-slate-500 text-sm font-medium">{stat.label}</h3>
                                <p className={`text-3xl font-extrabold mt-1 ${stat.color === 'red' ? 'text-red-500' : ''}`}>{stat.val}</p>
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
                    <div className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-sm border border-primary/5">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-slate-50 dark:bg-slate-800/50 font-display">
                                        <th className="px-8 py-5 text-[15px] font-medium text-slate-500">Thông tin bệnh nhân</th>
                                        <th className="px-8 py-5 text-[15px] font-medium text-slate-500 text-center">Tuổi / Phái</th>
                                        <th className="px-8 py-5 text-[15px] font-medium text-slate-500">Bệnh lý</th>
                                        <th className="px-8 py-5 text-[15px] font-medium text-slate-500 text-center">Chỉ số mới nhất</th>
                                        <th className="px-8 py-5 text-[15px] font-medium text-slate-500">Mức rủi ro</th>
                                        <th className="px-8 py-5 text-[15px] font-medium text-slate-500">Bác sĩ phụ trách</th>
                                        <th className="px-8 py-5 text-[15px] font-medium text-slate-500 text-right">Thao tác</th>
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
                                                        <p className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">{patient.name}</p>
                                                        <p className="text-[13px] text-slate-500 font-medium mt-0.5">{patient.id}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5 text-sm text-slate-700 dark:text-slate-400 font-bold text-center">
                                                {patient.age}t / {patient.gender}
                                            </td>
                                            <td className="px-8 py-5">
                                                <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[12px] font-bold px-3 py-1.5 rounded-lg whitespace-nowrap">
                                                    {patient.condition}
                                                </span>
                                            </td>
                                            <td className="px-8 py-5">
                                                <div className="flex flex-col items-center gap-0.5 whitespace-nowrap">
                                                    <span className={`text-sm font-bold ${patient.riskColor === 'red' ? 'text-red-500' : 'text-slate-900 dark:text-white'}`}>{patient.vitals}</span>
                                                    <span className="text-[13px] text-slate-400 font-medium">{patient.extra}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5">
                                                <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-[13px] font-bold text-white whitespace-nowrap shadow-sm ${patient.riskColor === 'red' ? 'bg-red-500' :
                                                        patient.riskColor === 'amber' ? 'bg-amber-500' :
                                                            'bg-emerald-500'
                                                    }`}>
                                                    {patient.risk === 'MONITORING' ? 'Theo dõi' : patient.risk === 'HIGH RISK' ? 'Nguy cơ cao' : 'Ổn định'}
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
                                                        <span className="material-symbols-outlined text-[22px]">visibility</span>
                                                    </button>
                                                    <button className="p-2 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-xl transition-colors">
                                                        <span className="material-symbols-outlined text-[22px]">edit</span>
                                                    </button>
                                                    <button className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors">
                                                        <span className="material-symbols-outlined text-[22px]">delete</span>
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
                            <p className="text-[13px] font-bold text-slate-400 uppercase ">Hiển thị 1 đến 10 trong số 1,250 bệnh nhân</p>
                            <div className="flex items-center gap-2">
                                <button className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-primary transition-all disabled:opacity-30" disabled>
                                    <span className="material-symbols-outlined text-sm">chevron_left</span>
                                </button>
                                <div className="flex items-center gap-1.5">
                                    <button className="w-10 h-10 rounded-xl bg-primary text-slate-900 text-sm font-black shadow-lg shadow-primary/20 transition-all">1</button>
                                    <button className="w-10 h-10 rounded-xl hover:bg-white dark:hover:bg-slate-900 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 text-sm font-bold text-slate-500 transition-all">2</button>
                                    <button className="w-10 h-10 rounded-xl hover:bg-white dark:hover:bg-slate-900 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 text-sm font-bold text-slate-500 transition-all">3</button>
                                    <span className="px-1 text-slate-300 dark:text-slate-600 font-bold">...</span>
                                    <button className="w-10 h-10 rounded-xl hover:bg-white dark:hover:bg-slate-900 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 text-sm font-bold text-slate-500 transition-all">125</button>
                                </div>
                                <button className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-primary transition-all">
                                    <span className="material-symbols-outlined text-sm">chevron_right</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <CreatePatientModal
                    isOpen={isCreateModalOpen}
                    onClose={() => setIsCreateModalOpen(false)}
                    isSaving={isSaving}
                    onSave={handleCreatePatient}
                    availableDoctors={availableDoctors}
                />
            </main>
        </div>
    );
}
