import React, { useState, useEffect, useCallback } from 'react';
import AddHealthMetricModal from '../features/health-metrics/components/AddHealthMetricModal';
import Toast from '../components/ui/Toast';
import Dropdown from '../components/ui/Dropdown';
import { patientApi } from '../api/patient';

const PatientHealthMetrics: React.FC = () => {
    const [activeTab, setActiveTab] = useState('WEEK');
    const [selectedMetric, setSelectedMetric] = useState('BLOOD_SUGAR');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [toast, setToast] = useState({ show: false, title: '', type: 'success' as 'success' | 'warning' | 'error' });

    const [summary, setSummary] = useState<any[]>([]);
    const [history, setHistory] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchData = useCallback(async () => {
        try {
            setIsLoading(true);
            const [summaryRes, historyRes] = await Promise.all([
                patientApi.getMetricsSummary(activeTab),
                patientApi.getHistory(0, 10)
            ]);

            if (summaryRes.success) setSummary(summaryRes.data);
            if (historyRes.success) setHistory(historyRes.data.content || []);
        } catch (error: any) {
            const msg = error.response?.data?.message || error.message || 'Lỗi không xác định';
            console.error('Failed to fetch metrics data:', msg);
            setToast({ show: true, title: `Lỗi tải dữ liệu: ${msg}`, type: 'error' });
        } finally {
            setIsLoading(false);
        }
    }, [activeTab]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleSaveMetric = async (metricData: any) => {
        try {
            setIsSaving(true);
            const response = await patientApi.recordMetric({
                ...metricData,
                unit: determineUnit(metricData.metricType)
            });

            if (response.success) {
                setToast({
                    show: true,
                    title: 'Đã lưu chỉ số sức khỏe thành công!',
                    type: 'success'
                });
                setIsModalOpen(false);
                fetchData();
            }
        } catch (error: any) {
            const msg = error.response?.data?.message || 'Lỗi không xác định';
            console.error('Failed to save metric:', msg);
            setToast({
                show: true,
                title: `Lưu thất bại: ${msg}`,
                type: 'error'
            });
        } finally {
            setIsSaving(false);
        }
    };

    const determineUnit = (type: string) => {
        switch (type) {
            case 'BLOOD_PRESSURE': return 'mmHg';
            case 'BLOOD_SUGAR': return 'mmol/L';
            case 'HEART_RATE': return 'bpm';
            case 'HBA1C': case 'SPO2': return '%';
            default: return '';
        }
    };

    const formatDate = (dateStr: string) => {
        const d = new Date(dateStr);
        return d.toLocaleString('vi-VN', {
            day: '2-digit', month: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    };

    const getStatusVn = (status: string) => {
        switch (status) {
            case 'NORMAL': return 'BÌNH THƯỜNG';
            case 'BORDERLINE_HIGH': return 'CẬN CAO';
            case 'HIGH': return 'HƠI CAO';
            case 'LOW': return 'THẤP';
            default: return status;
        }
    };

    const getMetricNameVn = (identifier: string | undefined | null) => {
        if (!identifier) return '';
        const type = String(identifier).toUpperCase().replace(' ', '_');
        if (type.includes('BLOOD_PRESSURE')) return 'Huyết áp';
        if (type.includes('BLOOD_SUGAR')) return 'Đường huyết';
        if (type.includes('HEART_RATE')) return 'Nhịp tim';
        if (type.includes('HBA1C')) return 'Điểm HbA1c';
        if (type.includes('SPO2')) return 'Nồng độ Oxy (SpO2)';
        return String(identifier);
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-700 font-display">
            {/* Title and CTA */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 text-left">
                <div>
                    <h2 className="text-[26px] font-black text-slate-900 dark:text-white tracking-tight">Chỉ số sức khỏe</h2>
                    <p className="text-slate-500 mt-1">Theo dõi các chỉ số sinh tồn của bạn trong thời gian thực</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-full font-bold text-sm shadow-lg shadow-primary/20 flex items-center justify-center gap-2 transition-all active:scale-95 font-display"
                >
                    <span className="material-symbols-outlined font-bold">add_circle</span>
                    Nhập chỉ số mới
                </button>
            </div>

            {/* Filters */}
            <div className="flex bg-white dark:bg-slate-900 p-1 rounded-xl border border-primary/10 w-fit text-left">
                {['DAY', 'WEEK', 'MONTH', 'YEAR'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-6 py-1.5 text-sm transition-all duration-200 ${activeTab === tab
                            ? 'font-bold text-primary bg-primary/10 rounded-lg shadow-sm'
                            : 'font-medium text-slate-500 hover:text-slate-900 dark:hover:text-white'
                            }`}
                    >
                        {tab === 'DAY' ? 'Ngày' : tab === 'WEEK' ? 'Tuần' : tab === 'MONTH' ? 'Tháng' : 'Năm'}
                    </button>
                ))}
            </div>

            {/* Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 text-left">
                {isLoading ? (
                    Array(5).fill(0).map((_, i) => (
                        <div key={i} className="h-32 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse border border-primary/5"></div>
                    ))
                ) : (
                    summary.map((item, idx) => (
                        <div key={idx} className={`bg-white dark:bg-slate-900 p-4 rounded-xl border ${idx === 0 ? 'border-primary ring-2 ring-primary/10' : 'border-primary/10'}`}>
                            <div className="flex justify-between items-start mb-4">
                                <div className={`p-2 rounded-lg ${item.metricType === 'BLOOD_PRESSURE' ? 'bg-orange-100 text-orange-600' :
                                        item.metricType === 'HEART_RATE' ? 'bg-red-100 text-red-600' :
                                            item.metricType === 'HBA1C' ? 'bg-purple-100 text-purple-600' :
                                                item.metricType === 'SPO2' ? 'bg-cyan-100 text-cyan-600' : 'bg-primary/10 text-primary'
                                    }`}>
                                    <span className="material-symbols-outlined text-xl font-bold">{item.icon}</span>
                                </div>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${item.status === 'NORMAL' ? 'bg-primary/10 text-primary' : 'bg-orange-100 text-orange-600'
                                    }`}>
                                    {getStatusVn(item.status)}
                                </span>
                            </div>
                            <p className="text-slate-500 text-[14px] font-bold uppercase">{getMetricNameVn(item.metricType)}</p>
                            <div className="flex items-baseline gap-1 mt-1">
                                <span className="text-2xl font-black text-slate-900 dark:text-white">
                                    {item.latestValue}
                                    {item.latestValueSecondary ? `/${item.latestValueSecondary}` : ''}
                                </span>
                                <span className="text-xs text-slate-400">{item.unit}</span>
                            </div>
                            <div className={`mt-2 flex items-center gap-1 ${item.trend === 'UP' ? 'text-orange-600' : item.trend === 'DOWN' ? 'text-primary' : 'text-slate-400'}`}>
                                <span className="material-symbols-outlined text-sm font-bold">
                                    {item.trend === 'UP' ? 'trending_up' : item.trend === 'DOWN' ? 'trending_down' : 'horizontal_rule'}
                                </span>
                                <span className="text-xs font-bold">{item.changePercentage} so với lần trước</span>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Chart and Analysis */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-left">
                <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-xl border border-primary/10">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="font-bold text-lg">Biểu đồ chi tiết</h3>
                            <p className="text-xs text-slate-500">Dữ liệu phân tích trong thời gian qua</p>
                        </div>
                        <Dropdown
                            options={[
                                { label: 'Đường huyết', value: 'BLOOD_SUGAR' },
                                { label: 'Huyết áp', value: 'BLOOD_PRESSURE' },
                                { label: 'Nhịp tim', value: 'HEART_RATE' },
                                { label: 'HbA1c', value: 'HBA1C' },
                                { label: 'Nồng độ Oxy', value: 'SPO2' }
                            ]}
                            value={selectedMetric}
                            onChange={setSelectedMetric}
                            className="w-full sm:w-52"
                        />
                    </div>
                    {/* Simplified Chart (Maintaining Visuals but could use a library like recharts later) */}
                    <div className="h-64 relative">
                        <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 800 200">
                            <defs>
                                <linearGradient id="gradient" x1="0%" x2="0%" y1="0%" y2="100%">
                                    <stop offset="0%" style={{ stopColor: '#3bb9f3', stopOpacity: 0.2 }}></stop>
                                    <stop offset="100%" style={{ stopColor: '#3bb9f3', stopOpacity: 0 }}></stop>
                                </linearGradient>
                            </defs>
                            <path d="M0,150 Q50,140 100,160 T200,130 T300,140 T400,110 T500,120 T600,90 T700,100 T800,80 L800,200 L0,200 Z" fill="url(#gradient)"></path>
                            <path d="M0,150 Q50,140 100,160 T200,130 T300,140 T400,110 T500,120 T600,90 T700,100 T800,80" fill="none" stroke="#3bb9f3" strokeWidth="4" strokeLinecap="round"></path>
                        </svg>
                        <div className="absolute bottom-0 w-full flex justify-between text-[10px] font-bold text-slate-400 pt-2">
                            <span>T2</span><span>T3</span><span>T4</span><span>T5</span><span>T6</span><span>T7</span><span>CN</span>
                        </div>
                    </div>
                </div>

                <div className="bg-primary/5 dark:bg-primary/10 p-6 rounded-xl border border-primary/20 flex flex-col font-display">
                    <div className="flex items-center gap-2 mb-4">
                        <span className="material-symbols-outlined text-primary font-bold">auto_awesome</span>
                        <h3 className="font-bold text-slate-900 dark:text-white">Phân tích từ AI & Bác sĩ</h3>
                    </div>
                    <div className="space-y-4 flex-1">
                        <div className="bg-white dark:bg-slate-900 p-4 rounded-lg shadow-sm border border-primary/5">
                            <p className="text-sm text-slate-600 dark:text-slate-300 italic font-bold leading-relaxed">
                                {summary.length > 0 && summary.find(s => s.metricType === 'BLOOD_PRESSURE')?.status !== 'NORMAL'
                                    ? "Chỉ số huyết áp của bạn đang hơi cao. Hãy chú ý nghỉ ngơi và hạn chế muối."
                                    : "Các chỉ số hiện tại của bạn đang nằm trong ngưỡng ổn định. Duy trì chế độ ăn uống này."
                                }
                            </p>
                            <div className="mt-3 flex items-center gap-2">
                                <div className="size-6 bg-primary rounded-full flex items-center justify-center text-[10px] text-white font-bold leading-none">AI</div>
                                <p className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">Hệ thống phân tích Damian</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent History Table */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-primary/10 overflow-hidden text-left font-display">
                <div className="p-6 border-b border-primary/10 flex items-center justify-between">
                    <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">Lịch sử nhập liệu gần đây</h3>
                </div>
                <div className="overflow-x-auto overflow-y-hidden">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-background-light dark:bg-slate-800/50">
                                <th className="px-6 py-3 text-xs font-bold text-slate-500">Thời gian</th>
                                <th className="px-6 py-3 text-xs font-bold text-slate-500">Chỉ số</th>
                                <th className="px-6 py-3 text-xs font-bold text-slate-500">Giá trị</th>
                                <th className="px-6 py-3 text-xs font-bold text-slate-500">Trạng thái</th>
                                <th className="px-6 py-3 text-xs font-bold text-slate-500">Ghi chú</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-primary/5">
                            {isLoading ? (
                                Array(3).fill(0).map((_, i) => (
                                    <tr key={i}><td colSpan={5} className="px-6 py-4 animate-pulse bg-slate-50 dark:bg-slate-800/50 h-10"></td></tr>
                                ))
                            ) : history.length === 0 ? (
                                <tr><td colSpan={5} className="px-6 py-10 text-center text-slate-400 font-bold">Chưa có dữ liệu lịch sử</td></tr>
                            ) : history.map((row, idx) => (
                                <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-900 dark:text-white">{formatDate(row.measuredAt)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm text-slate-600 dark:text-slate-300 font-bold">{getMetricNameVn(row.metricType || row.metricDisplayName || '')}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-black text-slate-900 dark:text-white">
                                        {row.value}{row.valueSecondary ? `/${row.valueSecondary}` : ''} {row.unit}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 text-[10px] font-black rounded-full ${row.status === 'NORMAL' ? 'bg-primary/10 text-primary' : 'bg-orange-100 text-orange-600'
                                            }`}>
                                            {getStatusVn(row.status)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400 truncate max-w-[200px] font-bold">{row.notes || 'Không có ghi chú'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <AddHealthMetricModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveMetric}
                isSaving={isSaving}
            />

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
