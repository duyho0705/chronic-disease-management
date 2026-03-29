import React, { useEffect, useState } from 'react';
import Dropdown from '../../../components/ui/Dropdown';

interface CreatePatientModalProps {
    isOpen: boolean;
    onClose: () => void;
    isSaving: boolean;
    onSave: (patientData: any) => Promise<void>;
    availableDoctors: string[];
}

export default function CreatePatientModal({
    isOpen,
    onClose,
    isSaving,
    onSave,
    availableDoctors
}: CreatePatientModalProps) {
    const [formData, setFormData] = useState({
        name: '',
        age: '',
        gender: 'Nam',
        phone: '',
        address: '',
        condition: 'Tiểu đường Type 2',
        riskLevel: 'Theo dõi (MONITORING)',
        assignedDoctor: availableDoctors[0] || 'BS. Nguyễn Văn A',
        notes: ''
    });

    const [formErrors, setFormErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            // Reset state if needed when opened
            setFormErrors({});
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (formErrors[name]) {
            setFormErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const validateForm = () => {
        const errors: Record<string, string> = {};
        if (!formData.name.trim()) errors.name = 'Vui lòng nhập họ và tên bệnh nhân';
        if (!formData.age.trim() || isNaN(Number(formData.age))) errors.age = 'Vui lòng nhập tuổi hợp lệ';
        if (!formData.phone.trim()) errors.phone = 'Vui lòng nhập số điện thoại liên hệ';

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = () => {
        if (validateForm()) {
            onSave(formData);
        }
    };

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 font-display">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] transition-all duration-300"
                onClick={onClose}
            ></div>

            <div className="relative bg-white dark:bg-slate-900 w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in duration-300 border border-primary/10 transition-all max-h-[92vh]">
                {/* Modal Header */}
                <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900 sticky top-0 z-20">
                    <div className="flex items-center gap-4 text-left">
                        <div className="bg-primary/10 p-3 rounded-2xl text-primary flex items-center justify-center">
                            <span className="material-symbols-outlined font-black text-2xl">person_add</span>
                        </div>
                        <div>
                            <h2 className="text-[20px] font-black text-slate-900 dark:text-white tracking-tight leading-tight">Thêm hồ sơ bệnh nhân mới</h2>
                            <p className="text-[13px] font-medium text-slate-500 mt-0.5">Khởi tạo và phân công theo dõi sức khỏe chuyên sâu</p>
                        </div>
                    </div>
                </div>

                {/* Form Content */}
                <div className="p-5 md:p-6 space-y-5 overflow-y-auto custom-scrollbar flex-1 bg-slate-50/50 dark:bg-slate-900/50 text-left">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Left Column: Personal Information */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 pb-2 pl-2 border-l-4 border-l-primary">
                                <h3 className="font-extrabold text-slate-900 dark:text-slate-100 text-[15px] uppercase tracking-wider">Thông tin hành chính</h3>
                            </div>

                            <div className="space-y-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
                                <div className="space-y-1.5">
                                    <label className="text-[13px] font-bold text-slate-500 ml-1">Họ và tên bệnh nhân <span className="text-red-500">*</span></label>
                                    <input
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="VD: Nguyễn Văn An"
                                        className={`w-full px-4 py-[9px] rounded-xl border-2 ${formErrors.name ? 'border-red-500/50' : 'border-slate-100 dark:border-slate-800'} bg-slate-50/50 dark:bg-slate-800/40 text-[14px] font-bold text-slate-700 dark:text-slate-200 transition-all outline-none focus:border-primary focus:ring-4 focus:ring-primary/10`}
                                    />
                                    {formErrors.name && <p className="text-[11px] font-bold text-red-500 ml-1 mt-1">{formErrors.name}</p>}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-[13px] font-bold text-slate-500 ml-1">Tuổi <span className="text-red-500">*</span></label>
                                        <input
                                            name="age"
                                            value={formData.age}
                                            onChange={handleChange}
                                            placeholder="VD: 54"
                                            className={`w-full px-4 py-[9px] rounded-xl border-2 ${formErrors.age ? 'border-red-500/50' : 'border-slate-100 dark:border-slate-800'} bg-slate-50/50 dark:bg-slate-800/40 text-[14px] font-bold text-slate-700 dark:text-slate-200 transition-all outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 text-center`}
                                        />
                                        {formErrors.age && <p className="text-[11px] font-bold text-red-500 ml-1 mt-1">{formErrors.age}</p>}
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[13px] font-bold text-slate-500 ml-1">Giới tính</label>
                                        <Dropdown
                                            options={['Nam', 'Nữ', 'Khác']}
                                            value={formData.gender}
                                            onChange={(gender: string) => setFormData(prev => ({ ...prev, gender }))}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[13px] font-bold text-slate-500 ml-1">Số điện thoại liên hệ <span className="text-red-500">*</span></label>
                                    <div className="relative">
                                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[20px] text-slate-400">call</span>
                                        <input
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            placeholder="09xx.xxx.xxx"
                                            className={`w-full pl-11 pr-4 py-[9px] rounded-xl border-2 ${formErrors.phone ? 'border-red-500/50' : 'border-slate-100 dark:border-slate-800'} bg-slate-50/50 dark:bg-slate-800/40 text-[14px] font-bold text-slate-700 dark:text-slate-200 transition-all outline-none focus:border-primary focus:ring-4 focus:ring-primary/10`}
                                        />
                                    </div>
                                    {formErrors.phone && <p className="text-[11px] font-bold text-red-500 ml-1 mt-1">{formErrors.phone}</p>}
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[13px] font-bold text-slate-500 ml-1">Địa chỉ thường trú</label>
                                    <div className="relative">
                                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[20px] text-slate-400">location_on</span>
                                        <input
                                            name="address"
                                            value={formData.address}
                                            onChange={handleChange}
                                            placeholder="Số nhà, Đường, Quận/Huyện..."
                                            className="w-full pl-11 pr-4 py-[9px] rounded-xl border-2 border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-[14px] font-bold text-slate-700 dark:text-slate-200 transition-all outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
                                        />
                                    </div>
                                </div>

                                {/* Filler Info Banner */}
                                <div className="mt-2 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800/50 flex gap-3 items-start">
                                    <div className="bg-blue-100 dark:bg-blue-800/50 p-1.5 rounded-lg flex items-center justify-center shrink-0">
                                        <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 text-[18px]">verified_user</span>
                                    </div>
                                    <div>
                                        <h4 className="text-[13px] font-bold text-blue-900 dark:text-blue-300 mb-0.5">Xác thực danh tính</h4>
                                        <p className="text-[12px] text-blue-700/80 dark:text-blue-400/80 font-medium leading-relaxed">
                                            Vui lòng nhắc nhở bệnh nhân mang theo Thẻ BHYT và CCCD bản gốc trong lần khám đầu tiên để hoàn tất thủ tục.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Medical Profile & Assignment */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 pb-2 pl-2 border-l-4 border-l-amber-400">
                                <h3 className="font-extrabold text-slate-900 dark:text-slate-100 text-[15px] uppercase tracking-wider">Hồ sơ bệnh lý</h3>
                            </div>

                            <div className="space-y-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm relative">
                                {/* Decorative background element */}
                                <div className="absolute -right-4 -top-4 w-24 h-24 bg-amber-400/5 rounded-full blur-2xl"></div>

                                <div className="space-y-1.5 relative z-30">
                                    <label className="text-[13px] font-bold text-slate-500 ml-1">Nhóm bệnh lý chính</label>
                                    <Dropdown
                                        options={['Tiểu đường Type 1', 'Tiểu đường Type 2', 'Cao huyết áp', 'Bệnh tim mạch', 'Suy thận', 'Hen suyễn', 'Khác']}
                                        value={formData.condition}
                                        onChange={(condition: string) => setFormData(prev => ({ ...prev, condition }))}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4 relative z-20">
                                    <div className="col-span-2 space-y-1.5">
                                        <label className="text-[13px] font-bold text-slate-500 ml-1">Bác sĩ phụ trách</label>
                                        <div className="relative">
                                            <Dropdown
                                                options={availableDoctors}
                                                value={formData.assignedDoctor}
                                                onChange={(assignedDoctor: string) => setFormData(prev => ({ ...prev, assignedDoctor }))}
                                            />
                                        </div>
                                    </div>

                                    <div className="col-span-2 space-y-1.5 mt-2">
                                        <label className="text-[13px] font-bold text-slate-500 ml-1">Đánh giá rủi ro ban đầu</label>
                                        <div className="grid grid-cols-3 gap-2">
                                            {['Ổn định (STABLE)', 'Theo dõi (MONITORING)', 'Nguy cơ cao (HIGH RISK)'].map(level => {
                                                const isSelected = formData.riskLevel === level;
                                                const isDanger = level.includes('HIGH');
                                                const isWarning = level.includes('MONITORING');
                                                const isSafe = level.includes('STABLE');

                                                let selectedClasses = 'border-slate-200 text-slate-500 bg-white hover:bg-slate-50';
                                                let iconProps = { name: 'health_and_safety', color: 'text-slate-400' };

                                                if (isSelected) {
                                                    if (isDanger) {
                                                        selectedClasses = 'border-red-500 bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400 ring-2 ring-red-500/20';
                                                        iconProps = { name: 'warning', color: 'text-red-500' };
                                                    } else if (isWarning) {
                                                        selectedClasses = 'border-amber-500 bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400 ring-2 ring-amber-500/20';
                                                        iconProps = { name: 'info', color: 'text-amber-500' };
                                                    } else {
                                                        selectedClasses = 'border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400 ring-2 ring-emerald-500/20';
                                                        iconProps = { name: 'check_circle', color: 'text-emerald-500' };
                                                    }
                                                }

                                                return (
                                                    <button
                                                        key={level}
                                                        type="button"
                                                        onClick={() => setFormData(prev => ({ ...prev, riskLevel: level }))}
                                                        className={`flex flex-col items-center justify-center p-3 sm:p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer ${selectedClasses}`}
                                                    >
                                                        <span className={`material-symbols-outlined mb-1.5 ${iconProps.color}`} style={{ fontVariationSettings: "'FILL' 1" }}>
                                                            {iconProps.name}
                                                        </span>
                                                        <span className="text-[11px] sm:text-[12px] font-bold text-center leading-tight">
                                                            {level.split(' (')[0]}
                                                        </span>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-1.5 mt-2 relative z-10">
                                    <label className="text-[13px] font-bold text-slate-500 ml-1">Ghi chú lâm sàng ban đầu</label>
                                    <textarea
                                        name="notes"
                                        value={formData.notes}
                                        onChange={handleChange}
                                        placeholder="Tiền sử bệnh, dị ứng thuốc, các lưu ý khác..."
                                        rows={3}
                                        className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-[14px] font-medium text-slate-700 dark:text-slate-200 transition-all outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 resize-none custom-scrollbar"
                                    ></textarea>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Modal Footer */}
                <div className="px-6 md:px-8 py-5 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end sticky bottom-0 z-20 transition-all">
                    <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                        <button
                            onClick={onClose}
                            className="px-6 py-2.5 text-[14px] font-bold text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"
                            type="button"
                        >
                            Hủy bỏ
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={isSaving}
                            className="px-8 py-2.5 text-[14px] font-black text-white bg-primary hover:bg-primary/90 rounded-xl transition-all shadow-xl shadow-primary/20 flex items-center gap-2 disabled:opacity-50 disabled:cursor-wait"
                            type="button"
                        >
                            {isSaving ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    Đang xử lý...
                                </>
                            ) : (
                                <>
                                    <span className="material-symbols-outlined font-bold text-[20px]">how_to_reg</span>
                                    Xác nhận lưu
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
