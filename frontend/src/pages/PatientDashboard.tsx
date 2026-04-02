import React from 'react';
import { useNavigate } from 'react-router-dom';

const PatientDashboard: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* 1. Profile Summary */}
            <section className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row gap-8 items-center text-left">
                <div className="h-24 w-24 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden border-4 border-primary/10 shrink-0">
                    <img alt="Patient Avatar" className="h-full w-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDtszSUkFV8-ySPzx5ShEcygZMGlLkCDs4d0864MNknx5EExH89OU4c8yPh8OVN1hs4lphO6fiLk2zNxiEVtKYNCEmFI8wlHiQWp_eNhWhDrDTnx0CzMMhMxEazQTGHz9vkoPO8nr1skAG0vHgWNL9WYSMCVUQCb0F38yyb4j9YXgtT9zCiHC8m8luedS4ciJqp8z63x9_AVk2Iy6aAsM3rPa-p8uNkLf-Ai8Ztas1voDuD-ytltUPtIAtEVk2Zdfo5YiyAOwuAFVk" />
                </div>
                <div className="flex-1 grid grid-cols-2 lg:grid-cols-4 gap-6 w-full">
                    <div>
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Chẩn đoán</p>
                        <p className="text-base font-bold text-primary">Tiểu đường Tuýp 2</p>
                    </div>
                    <div>
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Nhóm máu</p>
                        <p className="text-base font-bold text-slate-900 dark:text-white">O+</p>
                    </div>
                    <div>
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Thể trạng</p>
                        <p className="text-base font-bold text-slate-900 dark:text-white">170cm | 68kg</p>
                    </div>
                    <div>
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Tiền sử</p>
                        <p className="text-base font-bold text-slate-900 dark:text-white">Tăng huyết áp</p>
                    </div>
                </div>
                <button
                    onClick={() => navigate('/patient/profile')}
                    className="px-6 py-2 border border-slate-200 dark:border-slate-700 rounded-xl font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors whitespace-nowrap active:scale-95 text-slate-700 dark:text-slate-300"
                >
                    Chỉnh sửa hồ sơ
                </button>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* 3. Health Metrics Input & Charts */}
                <div className="lg:col-span-2 space-y-6 text-left">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">show_chart</span>
                            Chỉ số sức khỏe & Xu hướng
                        </h2>
                        <button
                            onClick={() => navigate('/patient/metrics')}
                            className="text-primary font-bold text-sm flex items-center gap-1 hover:underline active:scale-95"
                        >
                            <span className="material-symbols-outlined text-sm">add_circle</span> Nhập chỉ số mới
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Metric 1 */}
                        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                            <div className="flex justify-between mb-4">
                                <p className="text-sm font-medium text-slate-500">Đường huyết (mmol/L)</p>
                                <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs font-bold rounded">Cận cao</span>
                            </div>
                            <div className="flex items-baseline gap-2 mb-6">
                                <p className="text-3xl font-bold">6.5</p>
                                <p className="text-red-500 text-sm font-bold flex items-center">
                                    <span className="material-symbols-outlined text-sm">trending_up</span> 0.2%
                                </p>
                            </div>
                            <div className="h-32 w-full">
                                <svg className="h-full w-full" viewBox="0 0 400 100">
                                    <path d="M0,80 Q50,60 100,70 T200,40 T300,50 T400,30" fill="none" stroke="#3bb9f3" strokeLinecap="round" strokeWidth="4"></path>
                                    <path d="M0,80 Q50,60 100,70 T200,40 T300,50 T400,30 V100 H0 Z" fill="url(#grad1)"></path>
                                    <defs>
                                        <linearGradient id="grad1" x1="0%" x2="0%" y1="0%" y2="100%">
                                            <stop offset="0%" style={{ stopColor: '#3bb9f3', stopOpacity: 0.2 }}></stop>
                                            <stop offset="100%" style={{ stopColor: '#3bb9f3', stopOpacity: 0 }}></stop>
                                        </linearGradient>
                                    </defs>
                                </svg>
                            </div>
                            <div className="flex justify-between mt-2 text-[10px] font-bold text-slate-400 uppercase">
                                <span>T2</span><span>T3</span><span>T4</span><span>T5</span><span>T6</span><span>T7</span><span>CN</span>
                            </div>
                        </div>
                        {/* Metric 2 */}
                        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                            <div className="flex justify-between mb-4">
                                <p className="text-sm font-medium text-slate-500">Huyết áp (mmHg)</p>
                                <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-bold rounded">Ổn định</span>
                            </div>
                            <div className="flex items-baseline gap-2 mb-6">
                                <p className="text-3xl font-bold">120/80</p>
                                <p className="text-green-500 text-sm font-bold flex items-center">
                                    <span className="material-symbols-outlined text-sm">trending_down</span> 1.0%
                                </p>
                            </div>
                            <div className="h-32 w-full flex items-end gap-2 px-2">
                                <div className="flex-1 bg-primary/20 rounded-t h-1/2"></div>
                                <div className="flex-1 bg-primary/40 rounded-t h-3/4"></div>
                                <div className="flex-1 bg-primary/60 rounded-t h-2/3"></div>
                                <div className="flex-1 bg-primary rounded-t h-full"></div>
                                <div className="flex-1 bg-primary/80 rounded-t h-3/4"></div>
                                <div className="flex-1 bg-primary/50 rounded-t h-2/3"></div>
                                <div className="flex-1 bg-primary/30 rounded-t h-1/2"></div>
                            </div>
                            <div className="flex justify-between mt-2 text-[10px] font-bold text-slate-400 uppercase">
                                <span>T2</span><span>T3</span><span>T4</span><span>T5</span><span>T6</span><span>T7</span><span>CN</span>
                            </div>
                        </div>
                    </div>
                    {/* Secondary Metrics Row */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center gap-4 shadow-sm">
                            <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-xl text-red-500">
                                <span className="material-symbols-outlined filled">favorite</span>
                            </div>
                            <div>
                                <p className="text-[14px] text-slate-500">Nhịp tim</p>
                                <p className="text-lg font-bold">72 bpm</p>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center gap-4 shadow-sm">
                            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl text-blue-500">
                                <span className="material-symbols-outlined filled">air</span>
                            </div>
                            <div>
                                <p className="text-[14px] text-slate-500">SpO2</p>
                                <p className="text-lg font-bold">98%</p>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center gap-4 shadow-sm">
                            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl text-purple-500">
                                <span className="material-symbols-outlined filled">science</span>
                            </div>
                            <div>
                                <p className="text-[14px] text-slate-500">HbA1c</p>
                                <p className="text-lg font-bold">6.8%</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Sidebar Widgets */}
                <div className="space-y-6 text-left">
                    {/* 4. Automatic Alerts */}
                    <div className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 p-4 rounded-xl">
                        <div className="flex items-center gap-2 text-red-600 dark:text-red-400 mb-2 font-bold">
                            <span className="material-symbols-outlined">warning</span>
                            Cảnh báo quan trọng
                        </div>
                        <p className="text-sm text-red-700 dark:text-red-300">Đường huyết sáng nay cao hơn mức bình thường. Vui lòng kiểm tra lại chế độ ăn uống và thông báo cho bác sĩ.</p>
                    </div>

                    {/* 2. Medication Management */}
                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-white dark:bg-slate-900">
                            <h3 className="font-bold flex items-center gap-2 text-slate-900 dark:text-white">
                                <span className="material-symbols-outlined text-primary">pill</span>
                                Lịch uống thuốc
                            </h3>
                            <button
                                onClick={() => navigate('/patient/prescriptions')}
                                className="text-[14px] text-primary font-bold hover:underline"
                            >
                                Xem tất cả
                            </button>
                        </div>
                        <div className="p-4 space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                    <span className="material-symbols-outlined text-lg">done</span>
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-bold">Metformin 500mg</p>
                                    <p className="text-[13px] text-slate-500">08:00 Sáng- Đã uống</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full border-2 border-primary flex items-center justify-center text-primary animate-pulse">
                                    <span className="material-symbols-outlined text-lg">alarm</span>
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-bold">Lisinopril 10mg</p>
                                    <p className="text-[13px] text-slate-500">01:00 Chiều - Cần uống</p>
                                </div>
                                <button className="bg-primary text-slate-900 px-3 py-1 rounded-lg text-xs font-bold active:scale-95 transition-transform">Đã uống</button>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                                    <span className="material-symbols-outlined text-lg">schedule</span>
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-bold">Atorvastatin 20mg</p>
                                    <p className="text-[13px] text-slate-500">09:00 Tối - Chờ</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 5. Follow-up Appointments */}
                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-4 text-left">
                        <h3 className="font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-white">
                            <span className="material-symbols-outlined text-primary">event_note</span>
                            Lịch khám sắp tới
                        </h3>
                        <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border-l-4 border-primary relative overflow-hidden group">
                            <div className="flex justify-between items-start mb-2 relative z-10">
                                <div>
                                    <p className="text-xs font-bold text-primary uppercase tracking-widest">Ngày 15 Tháng 10</p>
                                    <p className="text-base font-bold text-slate-900 dark:text-white">Khám định kỳ Tiểu đường</p>
                                </div>
                                <span className="material-symbols-outlined text-slate-400 cursor-pointer">more_vert</span>
                            </div>
                            <div className="relative z-10">
                                <div className="flex items-center gap-2 text-xs text-slate-500">
                                    <span className="material-symbols-outlined text-sm">person_pin</span>
                                    BS. Lê Minh Tâm
                                </div>
                                <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                                    <span className="material-symbols-outlined text-sm">schedule</span>
                                    09:30 - 10:30 Sáng
                                </div>
                            </div>
                            <button className="w-full mt-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-white dark:hover:bg-slate-800 transition-colors relative z-10">
                                Đặt lại lịch
                            </button>
                        </div>
                    </div>

                    {/* 6. Doctor Chat */}
                    <div className="bg-primary/10 dark:bg-primary/5 rounded-xl border border-primary/20 p-4 flex items-center gap-4 group cursor-pointer hover:bg-primary/15 transition-all text-left">
                        <div className="h-12 w-12 rounded-full bg-primary/20 flex-shrink-0 relative overflow-hidden">
                            <img alt="Doctor" className="object-cover h-full w-full" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAcFUhTbj4SPfWKM3951CEKYvigAczulFrCd8MjzxK28AaIMv7rvM-pUcSN0_6i5RwtX13a876QeZic-WXjKbruzJO_MU1VLhaf8sTaTC6xMBJBLlegIlBVQ7-ay4KFBKDc9Kp4d4VxiW4W55X3BgzMhYJVpEUOsX5zvapaAutwwZ5jNXGYRXvYYdfIxJ3NoXT7vE_s_WQFoBz8nq_gOTbZG2UuGnw6hWILVqM-4JvKFVl6gyFJVzgir_vEEj_UoPOP31YKYoxzHN8" />
                            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-slate-900 rounded-full"></span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold truncate">BS. Lê Minh Tâm</p>
                            <p className="text-xs text-slate-500">Đang trực tuyến</p>
                        </div>
                        <button className="bg-primary p-2 rounded-full text-slate-900 shadow-md hover:scale-110 transition-transform active:scale-95">
                            <span className="material-symbols-outlined">send</span>
                        </button>
                    </div>
                </div>
            </div>

            <style>{`
                .material-symbols-outlined { font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
                .filled { font-variation-settings: 'FILL' 1; }
            `}</style>
        </div>
    );
};

export default PatientDashboard;
