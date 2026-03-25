import React, { useState } from 'react';
import AddHealthMetricModal from '../components/AddHealthMetricModal';
import Toast from '../components/Toast';

const PatientHealthMetrics: React.FC = () => {
    const [activeTab, setActiveTab] = useState('Tuần');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [toast, setToast] = useState({ show: false, title: '', type: 'success' as 'success' | 'warning' | 'error' });

    const handleSaveMetric = async () => {
        setIsSaving(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsSaving(false);
        setIsModalOpen(false);
        setToast({ 
            show: true, 
            title: 'Đã lưu chỉ số sức khỏe thành công!', 
            type: 'success' 
        });
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-700">
            {/* Title and CTA */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 text-left">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Chỉ số sức khỏe</h2>
                    <p className="text-slate-500 mt-1">Theo dõi các chỉ số sinh tồn của bạn trong thời gian thực</p>
                </div>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-primary/20 flex items-center justify-center gap-2 transition-transform active:scale-95"
                >
                    <span className="material-symbols-outlined font-bold">add</span>
                    Nhập chỉ số mới
                </button>
            </div>

            {/* Filters */}
            <div className="flex bg-white dark:bg-slate-900 p-1 rounded-xl border border-primary/10 w-fit text-left">
                {['Ngày', 'Tuần', 'Tháng', 'Năm'].map((tab) => (
                    <button 
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-6 py-1.5 text-sm transition-all duration-200 ${
                            activeTab === tab 
                            ? 'font-bold text-primary bg-primary/10 rounded-lg shadow-sm' 
                            : 'font-medium text-slate-500 hover:text-slate-900 dark:hover:text-white'
                        }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 text-left">
                {/* Card: Đường huyết */}
                <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-primary ring-2 ring-primary/10">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-primary/10 text-primary rounded-lg">
                            <span className="material-symbols-outlined text-xl font-bold">glucose</span>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 bg-primary/10 text-primary rounded-full uppercase tracking-wider">ỔN ĐỊNH</span>
                    </div>
                    <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Đường huyết</p>
                    <div className="flex items-baseline gap-1 mt-1">
                        <span className="text-2xl font-black text-slate-900 dark:text-white">5.6</span>
                        <span className="text-xs text-slate-400">mmol/L</span>
                    </div>
                    <div className="mt-2 flex items-center gap-1 text-primary">
                        <span className="material-symbols-outlined text-sm font-bold">trending_down</span>
                        <span className="text-xs font-bold">-2% so với hôm qua</span>
                    </div>
                </div>

                {/* Card: Huyết áp */}
                <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-primary/10">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
                            <span className="material-symbols-outlined text-xl font-bold">vital_signs</span>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 bg-orange-100 text-orange-600 rounded-full uppercase tracking-wider">Cần chú ý</span>
                    </div>
                    <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Huyết áp</p>
                    <div className="flex items-baseline gap-1 mt-1">
                        <span className="text-2xl font-black text-slate-900 dark:text-white">120/80</span>
                        <span className="text-xs text-slate-400">mmHg</span>
                    </div>
                    <div className="mt-2 flex items-center gap-1 text-orange-600">
                        <span className="material-symbols-outlined text-sm font-bold">trending_up</span>
                        <span className="text-xs font-bold">+5% so với hôm qua</span>
                    </div>
                </div>

                {/* Card: Nhịp tim */}
                <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-primary/10">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-red-100 text-red-600 rounded-lg">
                            <span className="material-symbols-outlined text-xl font-bold">favorite</span>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 bg-primary/10 text-primary rounded-full uppercase tracking-wider">ỔN ĐỊNH</span>
                    </div>
                    <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Nhịp tim</p>
                    <div className="flex items-baseline gap-1 mt-1">
                        <span className="text-2xl font-black text-slate-900 dark:text-white">72</span>
                        <span className="text-xs text-slate-400">bpm</span>
                    </div>
                    <div className="mt-2 flex items-center gap-1 text-slate-400">
                        <span className="material-symbols-outlined text-sm font-bold">horizontal_rule</span>
                        <span className="text-xs font-bold">0% không đổi</span>
                    </div>
                </div>

                {/* Card: Cân nặng */}
                <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-primary/10">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                            <span className="material-symbols-outlined text-xl font-bold">weight</span>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 bg-primary/10 text-primary rounded-full uppercase tracking-wider">ỔN ĐỊNH</span>
                    </div>
                    <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Cân nặng</p>
                    <div className="flex items-baseline gap-1 mt-1">
                        <span className="text-2xl font-black text-slate-900 dark:text-white">68.5</span>
                        <span className="text-xs text-slate-400">kg</span>
                    </div>
                    <div className="mt-2 flex items-center gap-1 text-primary">
                        <span className="material-symbols-outlined text-sm font-bold">trending_down</span>
                        <span className="text-xs font-bold">-1% tuần này</span>
                    </div>
                </div>

                {/* Card: SpO2 */}
                <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-primary/10">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-cyan-100 text-cyan-600 rounded-lg">
                            <span className="material-symbols-outlined text-xl font-bold">air</span>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 bg-primary/10 text-primary rounded-full uppercase tracking-wider">Bình thường</span>
                    </div>
                    <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Nồng độ Oxy (SpO2)</p>
                    <div className="flex items-baseline gap-1 mt-1">
                        <span className="text-2xl font-black text-slate-900 dark:text-white">98</span>
                        <span className="text-xs text-slate-400">%</span>
                    </div>
                    <div className="mt-2 flex items-center gap-1 text-slate-400">
                        <span className="material-symbols-outlined text-sm font-bold">horizontal_rule</span>
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
                        <select className="text-xs border-primary/20 rounded-lg bg-background-light dark:bg-slate-800 p-1.5 focus:ring-1 focus:ring-primary outline-none">
                            <option>Đường huyết (mmol/L)</option>
                            <option>Huyết áp (mmHg)</option>
                            <option>Nhịp tim (bpm)</option>
                        </select>
                    </div>
                    <div className="h-64 relative">
                        <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 800 200">
                            <defs>
                                <linearGradient id="gradient" x1="0%" x2="0%" y1="0%" y2="100%">
                                    <stop offset="0%" style={{ stopColor: 'rgba(74, 222, 128, 0.3)' }}></stop>
                                    <stop offset="100%" style={{ stopColor: 'rgba(74, 222, 128, 0)' }}></stop>
                                </linearGradient>
                            </defs>
                            <path d="M0,150 Q50,140 100,160 T200,130 T300,140 T400,110 T500,120 T600,90 T700,100 T800,80 L800,200 L0,200 Z" fill="url(#gradient)"></path>
                            <path d="M0,150 Q50,140 100,160 T200,130 T300,140 T400,110 T500,120 T600,90 T700,100 T800,80" fill="none" stroke="#4ade80" strokeWidth="3"></path>
                            <circle cx="100" cy="160" fill="#4ade80" r="4"></circle>
                            <circle cx="200" cy="130" fill="#4ade80" r="4"></circle>
                            <circle cx="300" cy="140" fill="#4ade80" r="4"></circle>
                            <circle cx="400" cy="110" fill="#4ade80" r="4"></circle>
                            <circle cx="500" cy="120" fill="#4ade80" r="4"></circle>
                            <circle cx="600" cy="90" fill="#4ade80" r="4"></circle>
                            <circle cx="700" cy="100" fill="#4ade80" r="4"></circle>
                            <circle cx="800" cy="80" fill="#4ade80" r="4"></circle>
                        </svg>
                        <div className="absolute bottom-0 w-full flex justify-between text-[10px] font-bold text-slate-400 pt-2">
                            <span>Thứ 2</span>
                            <span>Thứ 3</span>
                            <span>Thứ 4</span>
                            <span>Thứ 5</span>
                            <span>Thứ 6</span>
                            <span>Thứ 7</span>
                            <span>Chủ nhật</span>
                        </div>
                    </div>
                </div>

                {/* AI/Doctor Analysis */}
                <div className="bg-primary/5 dark:bg-primary/10 p-6 rounded-xl border border-primary/20 flex flex-col font-display">
                    <div className="flex items-center gap-2 mb-4">
                        <span className="material-symbols-outlined text-primary font-bold">auto_awesome</span>
                        <h3 className="font-bold text-slate-900 dark:text-white">Phân tích từ AI & Bác sĩ</h3>
                    </div>
                    <div className="space-y-4 flex-1">
                        <div className="bg-white dark:bg-slate-900 p-4 rounded-lg shadow-sm border border-primary/5">
                            <p className="text-sm text-slate-600 dark:text-slate-300 italic whitespace-normal font-bold leading-relaxed">"Chỉ số đường huyết của bạn đang có xu hướng giảm nhẹ và ổn định hơn so với tuần trước. Tuy nhiên, huyết áp ghi nhận vào buổi sáng đôi khi hơi cao. Hãy duy trì việc tập thể dục nhẹ nhàng và giảm muối trong khẩu phần ăn."</p>
                            <div className="mt-3 flex items-center gap-2">
                                <div className="size-6 bg-primary rounded-full flex items-center justify-center text-[10px] text-white font-bold font-display leading-none">BS</div>
                                <p className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest font-display">BS. Trần Thị Thu</p>
                            </div>
                        </div>
                        <div className="bg-primary/10 p-3 rounded-lg border border-primary/10">
                            <h4 className="text-xs font-extrabold text-primary flex items-center gap-1 mb-1 capitalize">
                                <span className="material-symbols-outlined text-sm font-bold">lightbulb</span> Lời khuyên tiêu dùng
                            </h4>
                            <p className="text-xs text-slate-700 dark:text-slate-200 font-bold leading-relaxed">Uống đủ 2L nước mỗi ngày và hạn chế caffeine sau 14:00 để ổn định nhịp tim.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent History Table */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-primary/10 overflow-hidden text-left font-display">
                <div className="p-6 border-b border-primary/10 flex items-center justify-between bg-white dark:bg-slate-900">
                    <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">Lịch sử nhập liệu gần đây</h3>
                    <button className="text-primary text-sm font-extrabold hover:underline">Xem tất cả</button>
                </div>
                <div className="overflow-x-auto overflow-y-hidden">
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
                                { time: 'Hôm nay, 08:30', name: 'Đường huyết', icon: 'glucose', value: '5.6 mmol/L', status: 'BÌNH THƯỜNG', statusColor: 'primary', note: 'Đo sau khi ăn sáng 1 tiếng.' },
                                { time: 'Hôm qua, 20:15', name: 'Huyết áp', icon: 'vital_signs', value: '125/85 mmHg', status: 'HƠI CAO', statusColor: 'orange' },
                                { time: 'Hôm qua, 07:00', name: 'Cân nặng', icon: 'weight', value: '68.5 kg', status: 'ỔN ĐỊNH', statusColor: 'primary' },
                                { time: '15 Thg 10, 10:00', name: 'Nhịp tim', icon: 'favorite', value: '75 bpm', status: 'BÌNH THƯỜNG', statusColor: 'primary' }
                            ].map((row, idx) => (
                                <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-900 dark:text-white">{row.time}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-2">
                                            <span className={`material-symbols-outlined text-${row.statusColor === 'primary' ? 'primary' : 'orange-500'} text-sm font-bold`}>{row.icon}</span>
                                            <span className="text-sm text-slate-600 dark:text-slate-300 font-bold">{row.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-black text-slate-900 dark:text-white">{row.value}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 text-[10px] font-black bg-${row.statusColor === 'primary' ? 'primary' : 'orange'}/10 text-${row.statusColor === 'primary' ? 'primary' : 'orange-600'} rounded-full`}>{row.status}</span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400 truncate max-w-[200px] font-bold">{(row as any).note || 'Không có ghi chú'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add Health Metric Modal */}
            <AddHealthMetricModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                onSave={handleSaveMetric}
                isSaving={isSaving}
            />

            {/* Toast Notification */}
            <Toast 
                show={toast.show}
                title={toast.title}
                type={toast.type}
                onClose={() => setToast({ ...toast, show: false })}
            />
        </div>
    );
};

export default PatientHealthMetrics;
