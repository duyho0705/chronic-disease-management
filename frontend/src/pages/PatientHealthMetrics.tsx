import React, { useState } from 'react';

const PatientHealthMetrics: React.FC = () => {
    return (
        <div className="space-y-6 animate-in fade-in duration-700">
            {/* Title and CTA */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 text-left">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Chỉ số sức khỏe</h2>
                    <p className="text-slate-500 mt-1">Theo dõi các chỉ số sinh tồn của bạn trong thời gian thực</p>
                </div>
                <button className="bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-primary/20 flex items-center justify-center gap-2 transition-transform active:scale-95">
                    <span className="material-symbols-outlined">add</span>
                    Nhập chỉ số mới
                </button>
            </div>

            {/* Filters */}
            <div className="flex bg-white dark:bg-slate-900 p-1 rounded-xl border border-primary/10 w-fit text-left">
                <button className="px-6 py-1.5 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">Ngày</button>
                <button className="px-6 py-1.5 text-sm font-bold text-primary bg-primary/10 rounded-lg">Tuần</button>
                <button className="px-6 py-1.5 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">Tháng</button>
                <button className="px-6 py-1.5 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">Năm</button>
            </div>

            {/* Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 text-left">
                {/* Card: Đường huyết */}
                <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-primary/10 shadow-sm flex items-center gap-5 transition-all hover:shadow-md">
                    <div className="size-16 bg-primary/10 text-primary rounded-full flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-3xl fill-1">glucose</span>
                    </div>
                    <div>
                        <p className="text-slate-400 text-lg font-medium leading-tight">Đường huyết</p>
                        <div className="flex items-baseline gap-2 mt-1">
                            <span className="text-2xl font-black text-slate-900 dark:text-white">5.6</span>
                            <span className="text-lg font-black text-slate-900 dark:text-white">mmol/L</span>
                        </div>
                    </div>
                </div>

                {/* Card: Huyết áp */}
                <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-primary/10 shadow-sm flex items-center gap-5 transition-all hover:shadow-md">
                    <div className="size-16 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-3xl fill-1">vital_signs</span>
                    </div>
                    <div>
                        <p className="text-slate-400 text-lg font-medium leading-tight">Huyết áp</p>
                        <div className="flex items-baseline gap-2 mt-1">
                            <span className="text-2xl font-black text-slate-900 dark:text-white">120/80</span>
                            <span className="text-lg font-black text-slate-900 dark:text-white">mmHg</span>
                        </div>
                    </div>
                </div>

                {/* Card: Nhịp tim */}
                <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-primary/10 shadow-sm flex items-center gap-5 transition-all hover:shadow-md">
                    <div className="size-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-3xl fill-1" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
                    </div>
                    <div>
                        <p className="text-slate-400 text-lg font-medium leading-tight">Nhịp tim</p>
                        <div className="flex items-baseline gap-2 mt-1">
                            <span className="text-2xl font-black text-slate-900 dark:text-white">72</span>
                            <span className="text-lg font-black text-slate-900 dark:text-white">bpm</span>
                        </div>
                    </div>
                </div>

                {/* Card: Cân nặng */}
                <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-primary/10 shadow-sm flex items-center gap-5 transition-all hover:shadow-md">
                    <div className="size-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-3xl fill-1">weight</span>
                    </div>
                    <div>
                        <p className="text-slate-400 text-lg font-medium leading-tight">Cân nặng</p>
                        <div className="flex items-baseline gap-2 mt-1">
                            <span className="text-2xl font-black text-slate-900 dark:text-white">68.5</span>
                            <span className="text-lg font-black text-slate-900 dark:text-white">kg</span>
                        </div>
                    </div>
                </div>

                {/* Card: SpO2 */}
                <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-primary/10 shadow-sm flex items-center gap-5 transition-all hover:shadow-md">
                    <div className="size-16 bg-cyan-100 text-cyan-600 rounded-full flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-3xl fill-1">blood_pressure</span>
                    </div>
                    <div>
                        <p className="text-slate-400 text-lg font-medium leading-tight">SpO2</p>
                        <div className="flex items-baseline gap-2 mt-1">
                            <span className="text-2xl font-black text-slate-900 dark:text-white">98</span>
                            <span className="text-lg font-black text-slate-900 dark:text-white">%</span>
                        </div>
                    </div>
                </div>

                {/* Card: SpO2 */}
                <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-primary/10">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-cyan-100 text-cyan-600 rounded-lg">
                            <span className="material-symbols-outlined text-xl">air</span>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 bg-primary/10 text-primary rounded-full uppercase">Bình thường</span>
                    </div>
                    <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Nồng độ Oxy (SpO2)</p>
                    <div className="flex items-baseline gap-1 mt-1">
                        <span className="text-2xl font-black text-slate-900 dark:text-white">98</span>
                        <span className="text-xs text-slate-400">%</span>
                    </div>
                    <div className="mt-2 flex items-center gap-1 text-slate-400">
                        <span className="material-symbols-outlined text-sm">horizontal_rule</span>
                        <span className="text-xs font-bold">0% không đổi</span>
                    </div>
                </div>
            </div>

            {/* Chart and Analysis */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-left">
                {/* Detailed Chart */}
                <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-xl border border-primary/10">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="font-bold text-lg">Biểu đồ Đường huyết chi tiết</h3>
                            <p className="text-xs text-slate-500">Dữ liệu thu thập trong 7 ngày qua</p>
                        </div>
                        <select className="text-xs border-primary/20 rounded-lg bg-background-light dark:bg-slate-800 p-2 outline-none">
                            <option>Đường huyết (mmol/L)</option>
                            <option>Huyết áp (mmHg)</option>
                            <option>Nhịp tim (bpm)</option>
                        </select>
                    </div>
                    <div className="h-64 relative">
                        <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 800 200">
                            <defs>
                                <linearGradient id="gradient-metrics-v2" x1="0%" x2="0%" y1="0%" y2="100%">
                                    <stop offset="0%" style={{ stopColor: 'rgba(74, 222, 128, 0.3)' }}></stop>
                                    <stop offset="100%" style={{ stopColor: 'rgba(74, 222, 128, 0)' }}></stop>
                                </linearGradient>
                            </defs>
                            <path d="M0,150 Q50,140 100,160 T200,130 T300,140 T400,110 T500,120 T600,90 T700,100 T800,80 L800,200 L0,200 Z" fill="url(#gradient-metrics-v2)"></path>
                            <path d="M0,150 Q50,140 100,160 T200,130 T300,140 T400,110 T500,120 T600,90 T700,100 T800,80" fill="none" stroke="#4ade80" strokeWidth="3"></path>
                            <circle cx="100" cy="160" fill="#4ade80" r="4"></circle>
                            <circle cx="200" cy="130" fill="#4ade80" r="4"></circle>
                            <circle cx="300" cy="140" fill="#4ade80" r="4"></circle>
                            <circle cx="400" cy="110" fill="#4ade80" r="4"></circle>
                            <circle cx="500" cy="120" fill="#4ade80" r="4"></circle>
                            <circle cx="600" cy="90" fill="#4ade80" r="4"></circle>
                            <circle cx="700" cy="100" fill="#4ade80" r="4"></circle>
                        </svg>
                        <div className="absolute bottom-0 w-full flex justify-between text-[10px] font-bold text-slate-400 pt-2">
                            <span>Thứ 2</span>
                            <span>Thứ 3</span>
                            <span>Thứ 4</span>
                            <span>Thứ 5</span>
                            <span className="">Thứ 6</span>
                            <span>Thứ 7</span>
                            <span>Chủ nhật</span>
                        </div>
                    </div>
                </div>

                {/* AI/Doctor Analysis */}
                <div className="bg-primary/5 dark:bg-primary/10 p-6 rounded-xl border border-primary/20 flex flex-col">
                    <div className="flex items-center gap-2 mb-4">
                        <span className="material-symbols-outlined text-primary">auto_awesome</span>
                        <h3 className="font-bold text-slate-900 dark:text-white">Phân tích từ AI & Bác sĩ</h3>
                    </div>
                    <div className="space-y-4 flex-1">
                        <div className="bg-white dark:bg-slate-900 p-4 rounded-lg shadow-sm">
                            <p className="text-sm text-slate-600 dark:text-slate-300 italic">"Chỉ số đường huyết của bạn đang có xu hướng giảm nhẹ và ổn định hơn so với tuần trước. Tuy nhiên, huyết áp ghi nhận vào buổi sáng đôi khi hơi cao. Hãy duy trì việc tập thể dục nhẹ nhàng và giảm muối trong khẩu phần ăn."</p>
                            <div className="mt-3 flex items-center gap-2">
                                <div className="size-6 bg-primary rounded-full flex items-center justify-center text-[10px] text-white font-bold">BS</div>
                                <p className="text-[10px] font-bold text-slate-500 uppercase">BS. Trần Thị Thu</p>
                            </div>
                        </div>
                        <div className="bg-primary/20 p-3 rounded-lg">
                            <h4 className="text-xs font-bold text-primary flex items-center gap-1 mb-1">
                                <span className="material-symbols-outlined text-sm">lightbulb</span> Lời khuyên
                            </h4>
                            <p className="text-xs text-slate-700 dark:text-slate-200">Uống đủ 2L nước mỗi ngày và hạn chế caffeine sau 14:00 để ổn định nhịp tim.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent History Table */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-primary/10 overflow-hidden text-left">
                <div className="p-6 border-b border-primary/10 flex items-center justify-between">
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white">Lịch sử nhập liệu gần đây</h3>
                    <button className="text-primary text-sm font-bold hover:underline">Xem tất cả</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-background-light dark:bg-slate-800/50">
                                <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Thời gian</th>
                                <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Chỉ số</th>
                                <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Giá trị</th>
                                <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Trạng thái</th>
                                <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Ghi chú</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-primary/5">
                            {[
                                { time: 'Hôm nay, 08:30', metric: 'Đường huyết', icon: 'glucose', value: '5.6 mmol/L', status: 'BÌNH THƯỜNG', note: 'Đo sau khi ăn sáng 1 tiếng.', color: 'text-primary' },
                                { time: 'Hôm qua, 20:15', metric: 'Huyết áp', icon: 'vital_signs', value: '125/85 mmHg', status: 'HƠI CAO', note: 'Cảm thấy hơi chóng mặt nhẹ.', color: 'text-orange-500' },
                                { time: 'Hôm qua, 07:00', metric: 'Cân nặng', icon: 'weight', value: '68.5 kg', status: 'ỔN ĐỊNH', note: 'Đo lúc vừa ngủ dậy.', color: 'text-blue-500' },
                                { time: '15 Thg 10, 10:00', metric: 'Nhịp tim', icon: 'favorite', value: '75 bpm', status: 'BÌNH THƯỜNG', note: 'Đo sau khi đi bộ 15 phút.', color: 'text-red-500' },
                            ].map((row, idx) => (
                                <tr key={idx}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-slate-900 dark:text-white">{row.time}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-2">
                                            <span className={`material-symbols-outlined ${row.color} text-sm`}>{row.icon}</span>
                                            <span className="text-sm text-slate-600 dark:text-slate-300">{row.metric}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-bold text-slate-900 dark:text-white">{row.value}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 text-[10px] font-bold rounded-full uppercase ${row.status === 'ỔN ĐỊNH' || row.status === 'BÌNH THƯỜNG' ? 'bg-primary/10 text-primary' : 'bg-orange-100 text-orange-600'}`}>
                                            {row.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-slate-500 truncate max-w-[200px]">{row.note}</div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <style>{`
                .filled-icon { font-variation-settings: 'FILL' 1; }
            `}</style>
        </div>
    );
};

export default PatientHealthMetrics;
