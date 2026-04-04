import { useState } from 'react';
import ClinicSidebar from '../components/common/ClinicSidebar';
import TopBar from '../components/common/TopBar';

export default function ClinicRiskAlerts() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [alertTimeFilter, setAlertTimeFilter] = useState('Hôm nay');
    const [notifications, setNotifications] = useState([
        { id: 1, title: 'Báo cáo mới', description: 'Có báo cáo tổng quát tháng 12 vừa được tạo.', time: '5 phút trước', read: false },
        { id: 2, title: 'Cảnh báo nguy cơ', description: 'Bệnh nhân Nguyễn Văn An có chỉ số bất thường.', time: '1 giờ trước', read: false },
    ]);
    const [isLoading, setIsLoading] = useState(true);

    useState(() => {
        const timer = setTimeout(() => setIsLoading(false), 1500);
        return () => clearTimeout(timer);
    });

    return (
        <div className="flex min-h-screen font-display bg-[#f6f8f7] dark:bg-slate-950 text-slate-900 dark:text-slate-100 italic-none">
            {/* Sidebar Navigation - Shared Component */}
            <ClinicSidebar
                isSidebarOpen={isSidebarOpen}
                userName="Admin Sarah"
                userRole="Senior Manager"
                userAvatar="https://lh3.googleusercontent.com/aida-public/AB6AXuDs9fuTZde7EUIINhAwZDAYbGdWhfZuvszHFDZODEHBxXo3hRWmKfCmGfg6Xgckf0DONyYs8LQEOXng1sISGQVj9ec2pSs--Gz-xPlj6elGIG3KtZTO9U-57mPPcUxuNMtJbLamHmXAsWrVwobD4Ai-pKgNGU0yfv596RmDCRUawQMx8gmW7E2J_we-R_YITLa95pCcbtDZf6tkb7C6bWKKzwepNG2pc4L5uji1KMHQetqk8390TVAlxrRao3qco3laKWLu0uA-BmQ"
                isLoading={isLoading}
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

                {/* Content Area */}
                <div className="p-8 space-y-8">
                    {/* Header Controls */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 italic-none mb-6">
                        <div className="space-y-1">
                            {isLoading ? (
                                <>
                                    <div className="h-7 bg-slate-200 dark:bg-slate-800 animate-pulse rounded w-48"></div>
                                    <div className="h-4 bg-slate-100 dark:bg-slate-800 animate-pulse rounded w-64 mt-2"></div>
                                </>
                            ) : (
                                <>
                                    <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight leading-tight">Cảnh báo Nguy cơ</h2>
                                    <p className="text-sm font-medium text-slate-500 italic-none">Theo dõi các chỉ số sinh tồn và cảnh báo khẩn cấp</p>
                                </>
                            )}
                        </div>
                        {isLoading ? (
                            <div className="w-48 h-10 bg-slate-100 dark:bg-slate-800 animate-pulse rounded-xl"></div>
                        ) : (
                            <div className="flex bg-slate-200/50 dark:bg-slate-800 p-1 rounded-xl gap-1 border border-primary/5">
                                <button
                                    onClick={() => setAlertTimeFilter('Hôm nay')}
                                    className={`px-6 py-2 text-[13px] font-bold rounded-lg transition-all ${alertTimeFilter === 'Hôm nay' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-500 hover:bg-white dark:hover:bg-slate-700'}`}
                                >
                                    Hôm nay
                                </button>
                                <button
                                    onClick={() => setAlertTimeFilter('Tuần này')}
                                    className={`px-6 py-2 text-[13px] font-bold rounded-lg transition-all ${alertTimeFilter === 'Tuần này' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-500 hover:bg-white dark:hover:bg-slate-700'}`}
                                >
                                    Tuần này
                                </button>
                            </div>
                        )}
                    </div>
                    {/* Quick Stats Bento Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {isLoading ? (
                            [1, 2, 3, 4].map(i => (
                                <div key={`stat-${i}`} className="bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm animate-pulse border border-primary/5 space-y-4">
                                    <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-24"></div>
                                    <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-16"></div>
                                    <div className="h-4 bg-slate-50 dark:bg-slate-800/50 rounded w-32 mt-4"></div>
                                </div>
                            ))
                        ) : (
                            <>
                                <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group border border-primary/5">
                                    <div className="relative z-10">
                                        <p className="text-sm font-medium text-slate-500 mb-4">Tổng cảnh báo</p>
                                        <h3 className="text-3xl font-black text-slate-900 dark:text-white leading-none">24</h3>
                                    </div>
                                    <div className="mt-6 flex items-center text-primary text-[13px] font-bold gap-1">
                                        <span className="material-symbols-outlined text-sm">trending_up</span>
                                        +12% so với hôm qua
                                    </div>
                                </div>

                                <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group border border-red-100 dark:border-red-900/30">
                                    <div>
                                        <div className="flex items-center gap-2 mb-4">
                                            <p className="text-sm font-bold text-red-500">Khẩn cấp</p>
                                        </div>
                                        <h3 className="text-3xl font-black text-red-500 leading-none">05</h3>
                                    </div>
                                    <p className="text-red-400/70 text-[13px] font-medium mt-4">Cần can thiệp ngay lập tức</p>
                                </div>

                                <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group border border-amber-100 dark:border-amber-900/30">
                                    <div>
                                        <div className="flex items-center gap-2 mb-4">
                                            <p className="text-sm font-bold text-amber-600">Theo dõi</p>
                                        </div>
                                        <h3 className="text-3xl font-black text-amber-600 leading-none">12</h3>
                                    </div>
                                    <p className="text-amber-500/60 text-[13px] font-medium mt-4">Đang trong ngưỡng nguy cơ</p>
                                </div>

                                <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm border border-primary/5">
                                    <div>
                                        <p className="text-sm font-medium text-slate-500 mb-4">Đã xử lý</p>
                                        <h3 className="text-3xl font-black text-emerald-600 leading-none">07</h3>
                                    </div>
                                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-6 overflow-hidden">
                                        <div className="bg-primary h-full w-[29%]"></div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Patient Risk Table */}
                        <div className="lg:col-span-2 space-y-6">
                            <div className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-sm border border-primary/5">
                                <div className="px-8 py-6 flex justify-between items-center border-b border-primary/5">
                                    {isLoading ? (
                                        <div className="h-7 bg-slate-200 dark:bg-slate-800 animate-pulse rounded w-72"></div>
                                    ) : (
                                        <h4 className="text-[20px] font-bold text-slate-900 dark:text-white tracking-tight">Danh sách bệnh nhân nguy cơ cao</h4>
                                    )}
                                    {isLoading ? (
                                        <div className="h-5 bg-slate-100 dark:bg-slate-800 animate-pulse rounded w-32"></div>
                                    ) : (
                                        <button className="text-primary text-sm font-bold flex items-center gap-1 hover:underline">
                                            Tải báo cáo <span className="material-symbols-outlined text-sm">download</span>
                                        </button>
                                    )}
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="bg-slate-50 dark:bg-slate-800/50 font-display">
                                                <th className="px-8 py-5">
                                                    {isLoading ? <div className="h-4 bg-slate-200 dark:bg-slate-700 animate-pulse rounded w-20"></div> : <span className="text-[15px] font-medium text-slate-500">Bệnh nhân</span>}
                                                </th>
                                                <th className="px-4 py-5">
                                                    {isLoading ? <div className="h-4 bg-slate-200 dark:bg-slate-700 animate-pulse rounded w-16"></div> : <span className="text-[15px] font-medium text-slate-500"> Mã hồ sơ</span>}
                                                </th>
                                                <th className="px-4 py-5">
                                                    {isLoading ? <div className="h-4 bg-slate-200 dark:bg-slate-700 animate-pulse rounded w-32"></div> : <span className="text-[15px] font-medium text-slate-500">Chỉ số sinh tồn</span>}
                                                </th>
                                                <th className="px-4 py-5">
                                                    {isLoading ? <div className="h-4 bg-slate-200 dark:bg-slate-700 animate-pulse rounded w-20"></div> : <span className="text-[15px] font-medium text-slate-500">Thời điểm</span>}
                                                </th>
                                                <th className="px-4 py-5 text-center">
                                                    {isLoading ? <div className="h-4 bg-slate-200 dark:bg-slate-700 animate-pulse rounded w-20 mx-auto"></div> : <span className="text-[15px] font-medium text-slate-500">Mức độ</span>}
                                                </th>
                                                <th className="px-8 py-5 text-right">
                                                    {isLoading ? <div className="h-4 bg-slate-200 dark:bg-slate-700 animate-pulse rounded w-20 ml-auto"></div> : <span className="text-[15px] font-medium text-slate-500">Hành động</span>}
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                                            {isLoading ? (
                                                [1, 2, 3].map(i => (
                                                    <tr key={`alert-skeleton-${i}`} className="animate-pulse">
                                                        <td className="px-8 py-5">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-xl"></div>
                                                                <div className="space-y-2">
                                                                    <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-24"></div>
                                                                    <div className="h-3 bg-slate-50 dark:bg-slate-800/50 rounded w-32"></div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-5">
                                                            <div className="h-4 bg-slate-50 dark:bg-slate-800/50 rounded w-14"></div>
                                                        </td>
                                                        <td className="px-4 py-5">
                                                            <div className="space-y-1">
                                                                <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-16"></div>
                                                                <div className="h-3 bg-slate-50 dark:bg-slate-800/50 rounded w-10"></div>
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-5">
                                                            <div className="h-4 bg-slate-50 dark:bg-slate-800/50 rounded w-16"></div>
                                                        </td>
                                                        <td className="px-4 py-5">
                                                            <div className="h-7 bg-slate-100 dark:bg-slate-800 rounded-full w-24 mx-auto"></div>
                                                        </td>
                                                        <td className="px-8 py-5 text-right flex justify-end gap-2">
                                                            <div className="w-8 h-8 bg-slate-50 dark:bg-slate-800 rounded"></div>
                                                            <div className="w-8 h-8 bg-slate-50 dark:bg-slate-800 rounded"></div>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : [
                                                { name: 'Trần Văn Nam', age: 'Tăng huyết áp', id: '#SK-9921', value: '185/115', unit: 'mmHg', time: '10:45 AM', level: 'Đỏ', color: 'bg-red-500', isCritical: true, img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBI7ygq4AFreOxzUOj2UVcicMAVrEHiSh1OksnY0HwA7_LAMYc295gB2D92ho-bbQ_ByRjNB4V2J7uj-RsBiRud0dSOYg-buwkHYEZp1n3hyK6CSPzUJAGDLsRhW9l7vIoG4ff-OTxve_25MB96A3hUVO4Ow0sI37tZBoJxayMc299aFYSD2iFPynbECaLh1M0lDB1_4fzQvna3xn-W23IPia74sYyzm0ohbsdbUbrzvPo6aC_BEtVl-QtjoUUfYeFUlJEqkLcRrqc' },
                                                { name: 'Lê Thị Hoa', age: 'Tiểu đường Type 2', id: '#SK-8834', value: '15.5', unit: 'mmol/L', time: '09:12 AM', level: 'Vàng', color: 'bg-amber-500', isCritical: false, img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA9hoyvncJA5CHCRp-pCZTFsEijqRvNIdJvMtWl4IPb7U_ogxKkvZYACoCXTsQaLACGrvMA8PMNxiW4zL0GFlv6saSblJC_kKVh21UeW3nnPOGqP-qq570klEShJ3Gj78jLikkW8QQGScrJ5uoxcaRntQOFaUTi8F5ly4izboNswSleWR5p8bBNPPKjNo3BhyaZQovuqhf9lJ-GPidlTRh3PKRfgOpG10Hxs-f4AKhbZ0ZpbbPPrKU_43ovvxmEYGh2kG8ya1v4ujU' },
                                                { name: 'Phạm Hoàng Hải', age: 'Suy tim độ 2', id: '#SK-7721', value: '125', unit: 'bpm', time: '08:45 AM', level: 'Đỏ', color: 'bg-red-500', isCritical: true, img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBPzT6Tr0lu3TxhMRmtBqQhXHKO5KNM3Th6SsYMTzAHdGl7TFt_uZqvAHidfjh0QsCF9ga5rhJfaO0ebq5u0MO52_M3EDJhX5iIGivRpmHv1gUm2efF87TPgBSroWRskCjRaOQeNrticWKqBsCDBIGCJSgJvNUsUF_kV4bol44eApK48n21b--iqMe1CzZXhSBB2t9_D_Eblivn1SxIFf74VqS_Y5WneicmR0zq7OzgS8cf8xeyQZ7wA9MuAWfgnaedygvgMc9471g' }
                                            ].map((patient, idx) => (
                                                <tr key={idx} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                                    <td className="px-8 py-5">
                                                        <div className="flex items-center gap-3">
                                                            <img alt="Bệnh nhân" className="w-10 h-10 rounded-xl object-cover ring-2 ring-primary/10" src={patient.img} />
                                                            <div>
                                                                <p className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">{patient.name}</p>
                                                                <p className="text-[13px] text-slate-500 font-medium">{patient.age}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-5 font-mono text-xs text-slate-500 font-medium">{patient.id}</td>
                                                    <td className="px-4 py-5">
                                                        <div className="flex flex-col">
                                                            <span className={`text-sm font-bold ${patient.level === 'Đỏ' ? 'text-red-500' : 'text-amber-500'}`}>
                                                                {patient.level === 'Đỏ' ? 'HA ' : 'Glu '}{patient.value}
                                                            </span>
                                                            <span className="text-[10px] text-slate-400 font-medium">{patient.unit}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-5 text-xs text-slate-500 font-medium">{patient.time}</td>
                                                    <td className="px-4 py-5">
                                                        <div className="flex justify-center">
                                                            <span className={`inline-flex px-4 py-1.5 ${patient.color} text-white text-[13px] font-bold rounded-full shadow-sm whitespace-nowrap`}>
                                                                {patient.level === 'Đỏ' ? 'Khẩn cấp' : 'Theo dõi'}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-5 text-right space-x-1">
                                                        <button className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all active:scale-95" title="Can thiệp gấp">
                                                            <span className="material-symbols-outlined text-[22px]">call</span>
                                                        </button>
                                                        <button className="p-2 text-primary hover:bg-primary/5 rounded-lg transition-all active:scale-95" title="Xem hồ sơ">
                                                            <span className="material-symbols-outlined text-[22px]">visibility</span>
                                                        </button>
                                                        <button className="p-2 text-slate-400 hover:text-primary hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-all active:scale-95" title="Kê đơn nhanh">
                                                            <span className="material-symbols-outlined text-[22px]">prescriptions</span>
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                {/* Pagination Footer - Redesigned */}
                                <div className="px-8 py-6 bg-slate-50/50 dark:bg-slate-800/20 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
                                    {isLoading ? (
                                        <>
                                            <div className="h-4 bg-slate-200 dark:bg-slate-800 animate-pulse rounded w-48"></div>
                                            <div className="flex gap-2">
                                                <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse"></div>
                                                <div className="w-20 h-10 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse"></div>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <p className="text-[14px] font-medium text-slate-500">
                                                Hiển thị <span className="font-bold text-slate-900 dark:text-white">1</span> đến <span className="font-bold text-slate-900 dark:text-white">3</span> trong số <span className="font-bold text-slate-900 dark:text-white">24</span> ca
                                            </p>
                                            <div className="flex items-center gap-3">
                                                <button className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-primary transition-all disabled:opacity-30" disabled>
                                                    <span className="material-symbols-outlined text-[20px]">chevron_left</span>
                                                </button>
                                                <div className="flex items-center gap-1.5">
                                                    <button className="w-10 h-10 rounded-xl bg-primary text-white text-sm font-black shadow-lg shadow-primary/20 transition-all">1</button>
                                                    <button className="w-10 h-10 rounded-xl bg-white dark:bg-slate-900 text-slate-500 hover:text-primary border border-transparent hover:border-slate-200 dark:hover:border-slate-700 text-sm font-bold transition-all">2</button>
                                                </div>
                                                <button className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-primary transition-all">
                                                    <span className="material-symbols-outlined text-[20px]">chevron_right</span>
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Side Panels */}
                        <div className="space-y-6">
                            {/* AI Insights Card */}
                            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-primary/10 shadow-sm relative overflow-hidden group">
                                {isLoading ? (
                                    <div className="animate-pulse space-y-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-4 h-4 bg-slate-200 dark:bg-slate-800 rounded-full"></div>
                                            <div className="w-20 h-4 bg-slate-200 dark:bg-slate-800 rounded"></div>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-full"></div>
                                            <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-[80%]"></div>
                                        </div>
                                        <div className="flex items-center gap-4 pt-2">
                                            <div className="flex -space-x-2">
                                                {[1, 2, 3].map(i => <div key={i} className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-800 border-2 border-white dark:border-slate-900"></div>)}
                                            </div>
                                            <div className="w-16 h-3 bg-slate-100 dark:bg-slate-800 rounded"></div>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <div className="flex items-center gap-2 mb-4 text-emerald-600 dark:text-primary">
                                            <span className="material-symbols-outlined font-variation-settings: 'FILL' 1" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                                            <h5 className="text-sm font-bold">AI Insights</h5>
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
                                    </>
                                )}
                            </div>

                            {/* Quick Actions Card */}
                            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-primary/5">
                                {isLoading ? (
                                    <div className="h-5 bg-slate-100 dark:bg-slate-800 animate-pulse rounded w-28 mb-6"></div>
                                ) : (
                                    <h5 className="text-sm font-bold text-slate-500 mb-6">Truy cập nhanh</h5>
                                )}
                                <div className="space-y-3">
                                    {isLoading ? (
                                        [1, 2, 3].map(i => (
                                            <div key={`action-${i}`} className="w-full h-14 bg-slate-50 dark:bg-slate-800/50 animate-pulse rounded-2xl"></div>
                                        ))
                                    ) : (
                                        [
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
                                        ))
                                    )}
                                </div>
                            </div>

                            {/* Team Status Card */}
                            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-primary/5">
                                {isLoading ? (
                                    <div className="h-5 bg-slate-100 dark:bg-slate-800 animate-pulse rounded w-28 mb-6"></div>
                                ) : (
                                    <h5 className="text-sm font-bold text-slate-500 mb-6">Trực cấp cứu</h5>
                                )}
                                {isLoading ? (
                                    <div className="flex items-center gap-4 animate-pulse">
                                        <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-xl"></div>
                                        <div className="space-y-2">
                                            <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-32"></div>
                                            <div className="h-3 bg-slate-50 dark:bg-slate-800/50 rounded w-24"></div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-4">
                                        <div className="relative">
                                            <img alt="Trực ban" className="w-12 h-12 rounded-xl object-cover ring-2 ring-primary/20" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAblEzsD1Y4LmmLITIgNYTpxsVwTH-CuEIwKSyz2DiksI-eNLSYk1gZrmmqOVrcMKKM5jS7RPa_zzJz8mK_750j2GRZhTYhIwJ5ZsFDKSU2YJh8148ZzjqpUaDJpW-2FCH9ePgqjtR0J0okNk52zIt0VmcEuF9Jdgkxq32SfbJAoI8tmcGNm4EyWO-YasHos3g46VFbraimlZwxu9ZsDPQL5M2BVTYJo_ALwYMlxNUmvU_cE5dn9itLl5iLuaN2VukHSDXCWN41XNI" />
                                            <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full"></span>
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-900 dark:text-white">BS. Nguyễn Minh Anh</p>
                                            <p className="text-[11px] text-slate-500 font-medium tracking-tight">Hệ thống phản ứng nhanh</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
