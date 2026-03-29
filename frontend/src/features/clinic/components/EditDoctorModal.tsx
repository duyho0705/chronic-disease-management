import React, { useEffect, useState } from 'react';
import Dropdown from '../../../components/ui/Dropdown';

interface EditDoctorModalProps {
    isOpen: boolean;
    onClose: () => void;
    isSaving: boolean;
    onSave: (doctorData: any) => Promise<void>;
    initialData: any;
}

export default function EditDoctorModal({
    isOpen,
    onClose,
    isSaving,
    onSave,
    initialData
}: EditDoctorModalProps) {
    const [formData, setFormData] = useState({
        id: '',
        name: '',
        email: '',
        phone: '',
        password: '', // default empty for edit
        specialty: 'Tim mạch',
        maxPatients: '150',
        status: 'Đang hoạt động (ACTIVE)'
    });

    const [formErrors, setFormErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (isOpen && initialData) {
            document.body.style.overflow = 'hidden';
            setFormErrors({});
            setFormData({
                id: initialData.id || '',
                name: initialData.name || '',
                email: initialData.email || '',
                phone: initialData.phone || '',
                password: '', // Do not populate password natively
                specialty: initialData.specialty || 'Tim mạch',
                maxPatients: initialData.maxPatients ? String(initialData.maxPatients) : '150', // in case it's a number
                status: initialData.status === 'Đang hoạt động' ? 'Đang hoạt động (ACTIVE)' : 'Tạm nghỉ (INACTIVE)'
            });
        } else {
            document.body.style.overflow = 'unset';
            if (!isOpen) {
                // Rest initial data when closed
                setFormData({
                    id: '', name: '', email: '', phone: '', password: '', specialty: 'Tim mạch', maxPatients: '150', status: 'Đang hoạt động (ACTIVE)'
                });
            }
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, initialData]);

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
        if (!formData.name.trim()) errors.name = 'Vui lòng nhập họ tên bác sĩ';
        if (!formData.email.trim() || !/^\S+@\S+\.\S+$/.test(formData.email)) errors.email = 'Vui lòng nhập email hợp lệ';
        if (!formData.phone.trim()) errors.phone = 'Vui lòng nhập số điện thoại';
        if (formData.password.trim() && formData.password.length < 6) errors.password = 'Mật khẩu phải từ 6 ký tự';

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
                            <span className="material-symbols-outlined font-black text-2xl">edit_document</span>
                        </div>
                        <div>
                            <h2 className="text-[20px] font-black text-slate-900 dark:text-white tracking-tight leading-tight">Cập nhật hồ sơ bác sĩ</h2>
                            <p className="text-[13px] font-medium text-slate-500 mt-0.5">Sửa đổi thông tin và phân công nhiệm vụ (Mã: {formData.id})</p>
                        </div>
                    </div>
                </div>

                {/* Form Content */}
                <div className="p-5 md:p-6 space-y-5 overflow-y-auto custom-scrollbar flex-1 bg-slate-50/50 dark:bg-slate-900/50 text-left">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Left Column: Personal Information & Account */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 pb-2 pl-2 border-l-4 border-l-primary">
                                <h3 className="font-extrabold text-slate-900 dark:text-slate-100 text-[15px] uppercase tracking-wider">Tài khoản & Cá nhân</h3>
                            </div>

                            <div className="space-y-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
                                <div className="space-y-1.5">
                                    <label className="text-[13px] font-bold text-slate-500 ml-1">Họ và tên bác sĩ <span className="text-red-500">*</span></label>
                                    <input
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="VD: TS. BS. Nguyễn Văn An"
                                        className={`w-full px-4 py-[9px] rounded-xl border-2 ${formErrors.name ? 'border-red-500/50' : 'border-slate-100 dark:border-slate-800'} bg-slate-50/50 dark:bg-slate-800/40 text-[14px] font-bold text-slate-700 dark:text-slate-200 transition-all outline-none focus:border-primary focus:ring-4 focus:ring-primary/10`}
                                    />
                                    {formErrors.name && <p className="text-[11px] font-bold text-red-500 ml-1 mt-1">{formErrors.name}</p>}
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[13px] font-bold text-slate-500 ml-1">Email <span className="text-red-500">*</span></label>
                                    <div className="relative">
                                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[20px] text-slate-400">mail</span>
                                        <input
                                            name="email"
                                            type="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="an.nguyen@clinic.vn"
                                            className={`w-full pl-11 pr-4 py-[9px] rounded-xl border-2 ${formErrors.email ? 'border-red-500/50' : 'border-slate-100 dark:border-slate-800'} bg-slate-50/50 dark:bg-slate-800/40 text-[14px] font-bold text-slate-700 dark:text-slate-200 transition-all outline-none focus:border-primary focus:ring-4 focus:ring-primary/10`}
                                        />
                                    </div>
                                    {formErrors.email && <p className="text-[11px] font-bold text-red-500 ml-1 mt-1">{formErrors.email}</p>}
                                </div>
                                
                                <div className="space-y-1.5">
                                    <label className="text-[13px] font-bold text-slate-500 ml-1">Đổi mật khẩu (Tuỳ chọn)</label>
                                    <div className="relative">
                                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[20px] text-slate-400">key</span>
                                        <input
                                            name="password"
                                            type="text"
                                            value={formData.password}
                                            onChange={handleChange}
                                            placeholder="Gõ để đổi, bỏ trống để giữ nguyên"
                                            className={`w-full pl-11 pr-4 py-[9px] rounded-xl border-2 ${formErrors.password ? 'border-red-500/50' : 'border-slate-100 dark:border-slate-800'} bg-slate-50/50 dark:bg-slate-800/40 text-[14px] font-bold text-slate-700 dark:text-slate-200 transition-all outline-none focus:border-primary focus:ring-4 focus:ring-primary/10`}
                                        />
                                    </div>
                                    {formErrors.password ? (
                                        <p className="text-[11px] font-bold text-red-500 ml-1 mt-1">{formErrors.password}</p>
                                    ) : (
                                        <p className="text-[11px] font-bold text-slate-400 ml-1 mt-1">Để trống trường này nếu không có nhu cầu đổi mật khẩu cho bác sĩ.</p>
                                    )}
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[13px] font-bold text-slate-500 ml-1">Số điện thoại <span className="text-red-500">*</span></label>
                                    <div className="relative">
                                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[20px] text-slate-400">call</span>
                                        <input
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            placeholder="+84 902 345 678"
                                            className={`w-full pl-11 pr-4 py-[9px] rounded-xl border-2 ${formErrors.phone ? 'border-red-500/50' : 'border-slate-100 dark:border-slate-800'} bg-slate-50/50 dark:bg-slate-800/40 text-[14px] font-bold text-slate-700 dark:text-slate-200 transition-all outline-none focus:border-primary focus:ring-4 focus:ring-primary/10`}
                                        />
                                    </div>
                                    {formErrors.phone && <p className="text-[11px] font-bold text-red-500 ml-1 mt-1">{formErrors.phone}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Professional Profile */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 pb-2 pl-2 border-l-4 border-l-emerald-500">
                                <h3 className="font-extrabold text-slate-900 dark:text-slate-100 text-[15px] uppercase tracking-wider">Hồ sơ chuyên môn</h3>
                            </div>

                            <div className="space-y-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm relative">
                                {/* Decorative background element */}
                                <div className="absolute -right-4 -top-4 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none"></div>

                                <div className="space-y-1.5 relative z-30">
                                    <label className="text-[13px] font-bold text-slate-500 ml-1">Chuyên khoa</label>
                                    <Dropdown
                                        options={['Nội khoa', 'Sản phụ khoa', 'Nhi khoa', 'Tim mạch', 'Thần kinh', 'Da liễu', 'Khác']}
                                        value={formData.specialty}
                                        onChange={(specialty: string) => setFormData(prev => ({ ...prev, specialty }))}
                                    />
                                </div>

                                <div className="space-y-1.5 relative z-20">
                                    <label className="text-[13px] font-bold text-slate-500 ml-1">Tải trọng tối đa (bệnh nhân/tuần)</label>
                                    <Dropdown
                                        options={['50', '100', '150', '200', 'Không giới hạn']}
                                        value={formData.maxPatients}
                                        onChange={(maxPatients: string) => setFormData(prev => ({ ...prev, maxPatients }))}
                                    />
                                </div>

                                <div className="space-y-1.5 pt-2 relative z-10">
                                    <label className="text-[13px] font-bold text-slate-500 ml-1">Trạng thái hoạt động</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {['Đang hoạt động (ACTIVE)', 'Tạm nghỉ (INACTIVE)'].map(level => {
                                            const isSelected = formData.status === level;
                                            const isActive = level.includes('ACTIVE') && !level.includes('INACTIVE');
                                            
                                            let selectedClasses = 'border-slate-200 text-slate-500 bg-white hover:bg-slate-50';
                                            let iconProps = { name: 'person_off', color: 'text-slate-400' };

                                            if (isSelected) {
                                                if (isActive) {
                                                    selectedClasses = 'border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400 ring-2 ring-emerald-500/20';
                                                    iconProps = { name: 'check_circle', color: 'text-emerald-500' };
                                                } else {
                                                    selectedClasses = 'border-slate-400 bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 ring-2 ring-slate-400/20';
                                                    iconProps = { name: 'pause_circle', color: 'text-slate-500 dark:text-slate-400' };
                                                }
                                            } else if (isActive) {
                                                iconProps = { name: 'check_circle', color: 'text-slate-300 dark:text-slate-600' };
                                            }

                                            return (
                                                <button
                                                    key={level}
                                                    type="button"
                                                    onClick={() => setFormData(prev => ({ ...prev, status: level }))}
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
                                    Đang lưu...
                                </>
                            ) : (
                                <>
                                    <span className="material-symbols-outlined font-bold text-[20px]">save</span>
                                    Lưu thay đổi
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
