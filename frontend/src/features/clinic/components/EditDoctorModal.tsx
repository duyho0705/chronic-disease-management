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
        specialty: 'Nội khoa',
        maxPatients: '150',
        status: 'ACTIVE'
    });

    const [showPassword, setShowPassword] = useState(false);

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
                password: '',
                specialty: initialData.specialty || 'Nội khoa',
                maxPatients: initialData.maxPatients ? String(initialData.maxPatients) : '150',
                status: initialData.status && initialData.status.includes('INACTIVE') ? 'INACTIVE' : 'ACTIVE'
            });
        } else {
            document.body.style.overflow = 'unset';
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

        if (!formData.email.trim()) {
            errors.email = 'Vui lòng nhập email đăng nhập';
        } else if (!/^\S+@\S+\.\S+/.test(formData.email)) {
            errors.email = 'Email không hợp lệ';
        }

        const phoneRegex = /^(0|\+84)(\d{9})$/;
        if (!formData.phone.trim()) {
            errors.phone = 'Vui lòng nhập số điện thoại';
        } else if (!phoneRegex.test(formData.phone.trim().replace(/\s/g, ''))) {
            errors.phone = 'Số điện thoại không hợp lệ (10 số)';
        }

        if (formData.password.trim() && formData.password.length < 6) {
            errors.password = 'Mật khẩu phải từ 6 ký tự';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = () => {
        if (validateForm()) {
            onSave(formData);
        }
    };

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-slate-900/10 backdrop-blur-[2px] transition-all duration-300" onClick={onClose}></div>

            <div className="relative bg-white dark:bg-slate-900 w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in duration-300 border border-slate-200 dark:border-slate-800 max-h-[95vh]">
                {/* Modal Header */}
                <div className="px-6 md:px-8 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between sticky top-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md z-20">
                    <div>
                        <h2 className="text-[20px] font-bold text-slate-900 dark:text-white tracking-tight leading-tight">Cập nhật hồ sơ bác sĩ</h2>
                    </div>
                </div>

                {/* Form Content */}
                <div className="px-6 md:px-8 pt-3 pb-6 overflow-y-auto custom-scrollbar flex-1 bg-white dark:bg-slate-900/50 text-left">
                    <div className="space-y-6">
                        {/* Section 1: Account & Personal Info */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 pb-1.5 pl-2 border-l-4 border-l-primary">
                                <h3 className="font-bold text-slate-700 dark:text-slate-100 text-[16px]">Tài khoản & Cá nhân</h3>
                            </div>

                            <div className="bg-white dark:bg-slate-900 p-4 lg:p-5 rounded-2xl border border-slate-300 dark:border-slate-800 shadow-sm">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-3">
                                    {/* Name */}
                                    <div className="space-y-1.5 flex-1 lg:col-span-2">
                                        <label className="text-[14px] font-medium text-slate-500 ml-1">Họ và tên bác sĩ <span className="text-red-500">*</span></label>
                                        <input
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            className={`w-full px-4 h-[40px] rounded-xl border ${formErrors.name ? 'border-red-500/50' : 'border-slate-400 dark:border-slate-700'} bg-white dark:bg-slate-900 shadow-sm text-[14px] font-medium text-slate-700 dark:text-slate-200 outline-none focus:border-primary transition-all`}
                                        />
                                        {formErrors.name && <p className="text-[11px] font-bold text-red-500 ml-1 mt-1">{formErrors.name}</p>}
                                    </div>

                                    {/* Phone */}
                                    <div className="space-y-1.5">
                                        <label className="text-[14px] font-medium text-slate-500 ml-1">Số điện thoại <span className="text-red-500">*</span></label>
                                        <div className="relative">
                                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[20px] text-slate-400">call</span>
                                            <input
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                className={`w-full pl-11 pr-4 h-[40px] rounded-xl border ${formErrors.phone ? 'border-red-500/50' : 'border-slate-400 dark:border-slate-700'} bg-white dark:bg-slate-900 shadow-sm text-[14px] font-medium text-slate-700 dark:text-slate-200 outline-none focus:border-primary`}
                                            />
                                        </div>
                                        {formErrors.phone && <p className="text-[11px] font-bold text-red-500 ml-1 mt-1">{formErrors.phone}</p>}
                                    </div>

                                    {/* Email */}
                                    <div className="space-y-1.5 lg:col-span-2">
                                        <label className="text-[14px] font-medium text-slate-500 ml-1">Email đăng nhập <span className="text-red-500">*</span></label>
                                        <div className="relative">
                                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[20px] text-slate-400">mail</span>
                                            <input
                                                name="email"
                                                type="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                className={`w-full pl-11 pr-4 h-[40px] rounded-xl border ${formErrors.email ? 'border-red-500/50' : 'border-slate-400 dark:border-slate-700'} bg-white dark:bg-slate-900 shadow-sm text-[14px] font-medium text-slate-700 dark:text-slate-200 outline-none focus:border-primary`}
                                            />
                                        </div>
                                        {formErrors.email && <p className="text-[11px] font-bold text-red-500 ml-1 mt-1">{formErrors.email}</p>}
                                    </div>

                                    <div className="space-y-1.5 font-sans">
                                        <label className="text-[14px] font-medium text-slate-500 ml-1">Đổi mật khẩu (Tuỳ chọn)</label>
                                        <div className="relative">
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                name="password"
                                                value={formData.password}
                                                onChange={handleChange}
                                                placeholder="••••••••"
                                                className={`w-full px-4 pr-12 h-[40px] rounded-xl border ${formErrors.password ? 'border-red-500/50' : 'border-slate-400 dark:border-slate-700'} bg-white dark:bg-slate-900 shadow-sm text-[14px] font-medium outline-none focus:border-primary`}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-colors flex items-center justify-center p-1 active:scale-100"
                                            >
                                                <span className="material-symbols-outlined text-[20px]">
                                                    {showPassword ? 'visibility' : 'visibility_off'}
                                                </span>
                                            </button>
                                        </div>
                                        {formErrors.password && <p className="text-[11px] font-bold text-red-500 ml-1 mt-1">{formErrors.password}</p>}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Professional Profile */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 pb-1.5 pl-2 border-l-4 border-l-emerald-500">
                                <h3 className="font-bold text-slate-700 dark:text-slate-100 text-[16px]">Hồ sơ chuyên môn</h3>
                            </div>

                            <div className="bg-white dark:bg-slate-900 p-4 lg:p-5 rounded-2xl border border-slate-300 dark:border-slate-800 shadow-sm grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                                {/* Specialty */}
                                <div className="space-y-1.5">
                                    <label className="text-[14px] font-medium text-slate-500 ml-1">Chuyên khoa</label>
                                    <Dropdown
                                        options={['Nội khoa', 'Sản phụ khoa', 'Nhi khoa', 'Tim mạch', 'Thần kinh', 'Da liễu', 'Khác']}
                                        value={formData.specialty}
                                        onChange={(specialty: string) => setFormData(prev => ({ ...prev, specialty }))}
                                    />
                                </div>

                                {/* Max Patients */}
                                <div className="space-y-1.5">
                                    <label className="text-[14px] font-medium text-slate-500 ml-1">Tải lượng (bn/tuần)</label>
                                    <Dropdown
                                        options={['50', '100', '150', '200', '500']}
                                        value={formData.maxPatients}
                                        onChange={(maxPatients: string) => setFormData(prev => ({ ...prev, maxPatients }))}
                                    />
                                </div>

                                {/* Status */}
                                <div className="space-y-1.5">
                                    <label className="text-[14px] font-medium text-slate-500 ml-1">Trạng thái</label>
                                    <Dropdown
                                        options={[
                                            { label: 'Đang hoạt động', value: 'ACTIVE' },
                                            { label: 'Tạm nghỉ', value: 'INACTIVE' }
                                        ]}
                                        value={formData.status}
                                        onChange={(status: string) => setFormData(prev => ({ ...prev, status }))}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Modal Footer */}
                <div className="px-6 md:px-8 py-5 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end sticky bottom-0 z-20">
                    <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                        <button
                            onClick={onClose}
                            className="px-6 py-2.5 text-[14px] font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition-all active:scale-100"
                            type="button"
                        >
                            Hủy bỏ
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={isSaving}
                            className="px-8 py-2.5 bg-primary text-white text-[14px] font-bold rounded-xl shadow-lg shadow-primary/25 hover:bg-primary/90 transition-all flex items-center gap-2 disabled:opacity-50 active:scale-100"
                        >
                            {isSaving ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                                    <span>Đang lưu...</span>
                                </>
                            ) : (
                                <>
                                    <span className="material-symbols-outlined font-bold text-[20px]">save</span>
                                    <span>Lưu thay đổi</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
