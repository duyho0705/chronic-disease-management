import React, { useEffect, useState } from 'react';
import Dropdown from '../../../components/ui/Dropdown';

interface AddHealthMetricModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave?: (metricData: any) => void;
    isSaving?: boolean;
    initialType?: string;
}

const AddHealthMetricModal: React.FC<AddHealthMetricModalProps> = ({ isOpen, onClose, onSave, isSaving, initialType }) => {
    const [metricType, setMetricType] = useState('BLOOD_PRESSURE');
    const [value, setValue] = useState('');
    const [valueSecondary, setValueSecondary] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [time, setTime] = useState(new Date().toTimeString().slice(0, 5));
    const [notes, setNotes] = useState('');

    const metricOptions = [
        { label: 'Huyết áp', value: 'BLOOD_PRESSURE' },
        { label: 'Đường huyết', value: 'BLOOD_SUGAR' },
        { label: 'Nhịp tim', value: 'HEART_RATE' },
        { label: 'HbA1c', value: 'HBA1C' },
        { label: 'Nồng độ Oxy', value: 'SPO2' },
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!onSave) return;

        const measuredAt = `${date}T${time}:00`;
        onSave({
            metricType,
            value: parseFloat(value),
            valueSecondary: valueSecondary ? parseFloat(valueSecondary) : null,
            measuredAt,
            notes
        });
    };

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            // Reset form on open
            setValue('');
            setValueSecondary('');
            setNotes('');
            setMetricType(initialType || 'BLOOD_PRESSURE');
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, initialType]);

    if (!isOpen) return null;

    const isBloodPressure = metricType === 'BLOOD_PRESSURE';

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <div
                className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] transition-opacity"
                onClick={onClose}
            ></div>

            <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh] animate-in zoom-in-95 duration-200 border border-primary/10">
                <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800 text-left bg-primary/5 font-display">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Nhập chỉ số sức khỏe</h2>
                </div>

                <div className="p-8 overflow-y-auto custom-scrollbar text-left flex-1 space-y-6 font-display">
                    <form id="health-metric-form" onSubmit={handleSubmit} className="space-y-6">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Loại chỉ số</label>
                            <Dropdown
                                options={metricOptions}
                                value={metricType}
                                onChange={setMetricType}
                                className="z-[50]"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
                                    {isBloodPressure ? 'Tâm thu (mmHg)' : 'Giá trị'}
                                </label>
                                <input
                                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl h-[46px] px-4 focus:ring-2 focus:ring-primary focus:border-transparent text-slate-900 dark:text-white outline-none transition-all font-medium text-[15px]"
                                    placeholder={isBloodPressure ? "120" : "5.6"}
                                    type="number"
                                    step="0.01"
                                    required
                                    value={value}
                                    onChange={(e) => setValue(e.target.value)}
                                />
                            </div>
                            {isBloodPressure && (
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Tâm trương (mmHg)</label>
                                    <input
                                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl h-[46px] px-4 focus:ring-2 focus:ring-primary focus:border-transparent text-slate-900 dark:text-white outline-none transition-all font-medium text-[15px]"
                                        placeholder="80"
                                        type="number"
                                        step="0.01"
                                        required={isBloodPressure}
                                        value={valueSecondary}
                                        onChange={(e) => setValueSecondary(e.target.value)}
                                    />
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Ngày đo</label>
                                <input
                                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl h-[46px] px-4 focus:ring-2 focus:ring-primary focus:border-transparent text-slate-900 dark:text-white outline-none transition-all font-medium text-[15px]"
                                    type="date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Giờ đo</label>
                                <input
                                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl h-[46px] px-4 focus:ring-2 focus:ring-primary focus:border-transparent text-slate-900 dark:text-white outline-none transition-all font-medium text-[15px]"
                                    type="time"
                                    value={time}
                                    onChange={(e) => setTime(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Ghi chú / Triệu chứng</label>
                            <textarea
                                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 focus:ring-2 focus:ring-primary focus:border-transparent text-slate-900 dark:text-white outline-none transition-all resize-none font-medium text-[15px] h-28"
                                placeholder="Nhập tình trạng sức khỏe hiện tại của bạn hoặc cảm giác lúc này..."
                                rows={3}
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                            ></textarea>
                        </div>
                    </form>
                </div>

                <div className="px-8 py-6 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-5 z-10 font-display">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 rounded-full text-slate-600 dark:text-slate-400 font-bold hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors text-[14px]"
                    >
                        Hủy bỏ
                    </button>
                    <button
                        type="submit"
                        form="health-metric-form"
                        disabled={isSaving}
                        className={`px-8 py-2 bg-primary text-white font-bold rounded-full shadow-lg shadow-primary/20 hover:brightness-105 active:scale-95 transition-all flex items-center justify-center gap-2 text-[14px] ${isSaving ? 'opacity-70 cursor-not-allowed' : ''}`}
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
                            'Lưu chỉ số'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddHealthMetricModal;
