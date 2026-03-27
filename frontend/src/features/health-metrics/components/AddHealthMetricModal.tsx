import React, { useEffect, useState } from 'react';
import Dropdown from '../../../components/ui/Dropdown';

interface AddHealthMetricModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave?: () => void;
    isSaving?: boolean;
}

const AddHealthMetricModal: React.FC<AddHealthMetricModalProps> = ({ isOpen, onClose, onSave, isSaving }) => {
    const [metricType, setMetricType] = useState('blood_pressure');

    const metricOptions = [
        { label: 'Huyết áp (Blood Pressure)', value: 'blood_pressure' },
        { label: 'Đường huyết (Blood Glucose)', value: 'blood_glucose' },
        { label: 'Nhịp tim (Heart Rate)', value: 'heart_rate' },
        { label: 'Cân nặng (Weight)', value: 'weight' },
        { label: 'Nồng độ Oxy (SpO2)', value: 'spo2' },
    ];

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            {/* Background Overlay (Skeleton/Simulated Background) */}
            <div className="fixed inset-0 z-0 overflow-hidden blur-sm opacity-40 pointer-events-none">
                <div className="p-8 max-w-7xl mx-auto">
                    <div className="flex justify-between items-center mb-8">
                        <div className="h-10 w-48 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
                        <div className="h-10 w-10 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
                    </div>
                    <div className="grid grid-cols-3 gap-6">
                        <div className="h-40 bg-slate-200 dark:bg-slate-700 rounded-xl"></div>
                        <div className="h-40 bg-slate-200 dark:bg-slate-700 rounded-xl"></div>
                        <div className="h-40 bg-slate-200 dark:bg-slate-700 rounded-xl"></div>
                    </div>
                    <div className="mt-8 h-64 bg-slate-200 dark:bg-slate-700 rounded-xl w-full"></div>
                </div>
            </div>

            {/* Modal Backdrop (Matched with Doctor's Backdrop) */}
            <div
                className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] transition-opacity"
                onClick={onClose}
            ></div>

            {/* Modal Container */}
            <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh] animate-in zoom-in-95 duration-200 border border-primary/10">

                {/* Modal Header */}
                <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800 text-left bg-primary/5 font-display">
                    <div className="flex items-center mb-0">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Nhập chỉ số sức khỏe</h2>
                    </div>
                </div>

                {/* Modal Content (Scrollable) */}
                <div className="p-8 overflow-y-auto custom-scrollbar text-left flex-1 space-y-6 font-display">
                    <form className="space-y-6">
                        {/* Metric Type Selection */}
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Loại chỉ số</label>
                            <Dropdown 
                                options={metricOptions}
                                value={metricType}
                                onChange={setMetricType}
                                className="z-[50]"
                            />
                        </div>

                        {/* Values Grid */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Tâm thu (mmHg)</label>
                                <input className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl h-[46px] px-4 focus:ring-2 focus:ring-primary focus:border-transparent text-slate-900 dark:text-white outline-none transition-all font-medium text-[15px]" placeholder="120" type="number" />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Tâm trương (mmHg)</label>
                                <input className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl h-[46px] px-4 focus:ring-2 focus:ring-primary focus:border-transparent text-slate-900 dark:text-white outline-none transition-all font-medium text-[15px]" placeholder="80" type="number" />
                            </div>
                        </div>

                        {/* Date and Time Grid */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Ngày đo</label>
                                <input className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl h-[46px] px-4 focus:ring-2 focus:ring-primary focus:border-transparent text-slate-900 dark:text-white outline-none transition-all font-medium text-[15px]" type="date" defaultValue="2023-10-27" />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Giờ đo</label>
                                <input className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl h-[46px] px-4 focus:ring-2 focus:ring-primary focus:border-transparent text-slate-900 dark:text-white outline-none transition-all font-medium text-[15px]" type="time" defaultValue="08:30" />
                            </div>
                        </div>

                        {/* Notes/Symptoms */}
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Ghi chú / Triệu chứng</label>
                            <textarea className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 focus:ring-2 focus:ring-primary focus:border-transparent text-slate-900 dark:text-white outline-none transition-all resize-none font-medium text-[15px] h-28" placeholder="Nhập tình trạng sức khỏe hiện tại của bạn hoặc cảm giác lúc này..." rows={3}></textarea>
                        </div>
                    </form>
                </div>

                {/* Modal Footer */}
                <div className="px-8 py-6 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-5 z-10 font-display">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 rounded-full text-slate-600 dark:text-slate-400 font-bold hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors text-[16px]"
                    >
                        Hủy bỏ
                    </button>
                    <button
                        onClick={onSave}
                        disabled={isSaving}
                        className={`px-10 py-3 bg-primary text-slate-900 font-bold rounded-full shadow-lg shadow-primary/20 hover:brightness-105 active:scale-95 transition-all flex items-center justify-center gap-2 text-[16px] ${isSaving ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        {isSaving ? (
                             <div className="flex items-center gap-2">
                                 <svg className="animate-spin h-5 w-5 text-slate-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                 </svg>
                                 <span>Đang lưu...</span>
                             </div>
                        ) : (
                            <>
                                <span className="material-symbols-outlined text-xl font-bold">save</span>
                                Lưu chỉ số
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddHealthMetricModal;
