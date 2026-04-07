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
        dbId: '',
        id: '',
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        licenseNumber: '',
        degree: 'Bác sĩ',
        specialty: 'Nội khoa',
        bio: '',
        maxPatients: '150',
        status: 'ACTIVE',
        avatarUrl: ''
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});
    const [avatarError, setAvatarError] = useState(false);

    useEffect(() => {
        if (isOpen && initialData) {
            document.body.style.overflow = 'hidden';
            setFormErrors({});
            setAvatarError(false);
            setFormData({
                dbId: initialData.dbId || '',
                id: initialData.id || '',
                name: initialData.name || '',
                email: initialData.email || '',
                phone: initialData.phone || '',
                password: '', // Keep empty unless user wants to change
                confirmPassword: '',
                licenseNumber: initialData.licenseNumber || '',
                degree: initialData.degree || 'Bác sĩ',
                specialty: initialData.specialty || 'Nội khoa',
                bio: initialData.bio || '',
                maxPatients: initialData.maxPatients ? String(initialData.maxPatients) : '150',
                status: initialData.status === 'Đang hoạt động' || initialData.status === 'ACTIVE' ? 'ACTIVE' : 'INACTIVE',
                avatarUrl: initialData.img || initialData.avatarUrl || ''
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

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setAvatarError(false);
            const previewUrl = URL.createObjectURL(file);
            setFormData(prev => ({ ...prev, avatarUrl: previewUrl }));
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

        if (formData.password && formData.password.length < 6) {
            errors.password = 'Mật khẩu phải từ 6 ký tự';
        }

        if (formData.password && formData.confirmPassword !== formData.password) {
            errors.confirmPassword = 'Mật khẩu xác nhận không trùng khớp';
        }

        if (!formData.licenseNumber.trim()) {
            errors.licenseNumber = 'Vui lòng nhập số CCHN';
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

            <div className="relative bg-white dark:bg-slate-900 w-full max-w-4xl rounded-3xl shadow-2xl flex flex-col animate-in fade-in zoom-in duration-300 border border-slate-200 dark:border-slate-800">
                {/* Modal Header - No divider, No X button */}
                <div className="px-6 md:px-8 py-5 flex items-center justify-between sticky top-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md z-20 rounded-t-3xl">
                    <h2 className="text-[19px] font-bold text-slate-900 dark:text-white tracking-tight leading-tight italic-none">Cập nhật hồ sơ bác sĩ</h2>
                </div>

                {/* Form Content - Integrated Avatar & Compact */}
                <div className="px-6 md:px-8 pt-4 pb-4 flex-1 bg-white dark:bg-slate-900/50 text-left">
                    <div className="space-y-4">
                        {/* Section 1: Account & Personal Info */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 pb-1 ml-1">
                                <div className="text-slate-400 dark:text-slate-500 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-[24px]">account_circle</span>
                                </div>
                                <h3 className="font-bold text-slate-500 dark:text-slate-100 text-[15px] italic-none ml-1">Thông tin tài khoản</h3>
                            </div>

                            <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/50 shadow-sm font-display">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-3">
                                    {/* Avatar Selection Inside Form - No divider */}
                                    <div className="md:col-span-2 flex items-center gap-5 pb-1 mb-1">
                                        <div
                                            onClick={() => document.getElementById('avatar-input-edit')?.click()}
                                            className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 flex flex-col items-center justify-center cursor-pointer overflow-hidden group relative transition-all hover:border-primary shrink-0"
                                        >
                                            {formData.avatarUrl && !avatarError ? (
                                                <img
                                                    src={formData.avatarUrl}
                                                    alt="Preview"
                                                    className="w-full h-full object-cover"
                                                    onError={() => setAvatarError(true)}
                                                />
                                            ) : (
                                                <span className="material-symbols-outlined text-slate-400 group-hover:text-primary text-[28px] transition-colors">add_a_photo</span>
                                            )}
                                        </div>
                                        <div className="space-y-0.5">
                                            <p className="text-[13px] font-bold text-slate-700 dark:text-slate-200">Ảnh chân dung bác sĩ</p>
                                            <button
                                                type="button"
                                                onClick={() => document.getElementById('avatar-input-edit')?.click()}
                                                className="text-[14px] font-bold text-primary hover:underline text-left"
                                            >
                                                Tải ảnh lên
                                            </button>
                                            <input
                                                id="avatar-input-edit"
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={handleAvatarChange}
                                            />
                                        </div>
                                    </div>

                                    {/* Name */}
                                    <div className="space-y-1 min-w-0">
                                        <label className="text-[14px] font-medium text-slate-500 ml-1">Họ và tên bác sĩ <span className="text-red-500">*</span></label>
                                        <input
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            placeholder="Nhập họ tên bác sĩ"
                                            autoComplete="off"
                                            className={`w-full px-4 h-[42px] rounded-xl border ${formErrors.name ? 'border-red-500/50' : 'border-slate-400 dark:border-slate-700'} bg-white dark:bg-slate-900 shadow-sm text-[13.5px] font-medium text-slate-700 dark:text-slate-200 outline-none focus:border-primary focus:shadow-lg focus:shadow-primary/10 focus:ring-4 focus:ring-primary/5 transition-all`}
                                        />
                                        {formErrors.name && <p className="text-[11px] font-bold text-red-500 ml-1 mt-1">{formErrors.name}</p>}
                                    </div>

                                    {/* Phone */}
                                    <div className="space-y-1 min-w-0">
                                        <label className="text-[14px] font-medium text-slate-500 ml-1">Số điện thoại <span className="text-red-500">*</span></label>
                                        <div className="relative">
                                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[18px] text-slate-400">call</span>
                                            <input
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                placeholder="Nhập số điện thoại"
                                                autoComplete="off"
                                                className={`w-full pl-10 pr-4 h-[42px] rounded-xl border ${formErrors.phone ? 'border-red-500/50' : 'border-slate-400 dark:border-slate-700'} bg-white dark:bg-slate-900 shadow-sm text-[13.5px] font-medium text-slate-700 dark:text-slate-200 outline-none focus:border-primary focus:shadow-lg focus:shadow-primary/10 focus:ring-4 focus:ring-primary/5 transition-all`}
                                            />
                                        </div>
                                        {formErrors.phone && <p className="text-[11px] font-bold text-red-500 ml-1 mt-1">{formErrors.phone}</p>}
                                    </div>

                                    {/* Email */}
                                    <div className="space-y-1 min-w-0">
                                        <label className="text-[14px] font-medium text-slate-500 ml-1">Email đăng nhập <span className="text-red-500">*</span></label>
                                        <div className="relative">
                                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[18px] text-slate-400">mail</span>
                                            <input
                                                name="email"
                                                type="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                placeholder="Nhập email"
                                                autoComplete="off"
                                                className={`w-full pl-10 pr-4 h-[42px] rounded-xl border ${formErrors.email ? 'border-red-500/50' : 'border-slate-400 dark:border-slate-700'} bg-white dark:bg-slate-900 shadow-sm text-[13.5px] font-medium text-slate-700 dark:text-slate-200 outline-none focus:border-primary focus:shadow-lg focus:shadow-primary/10 focus:ring-4 focus:ring-primary/5 transition-all`}
                                            />
                                        </div>
                                        {formErrors.email && <p className="text-[11px] font-bold text-red-500 ml-1 mt-1">{formErrors.email}</p>}
                                    </div>

                                    {/* Password */}
                                    <div className="space-y-1 min-w-0">
                                        <label className="text-[14px] font-medium text-slate-500 ml-1">Đổi mật khẩu</label>
                                        <div className="relative">
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                name="password"
                                                value={formData.password}
                                                onChange={handleChange}
                                                placeholder="Bỏ trống nếu không đổi"
                                                autoComplete="new-password"
                                                className={`w-full px-4 pr-11 h-[42px] rounded-xl border ${formErrors.password ? 'border-red-500/50' : 'border-slate-400 dark:border-slate-700'} bg-white dark:bg-slate-900 shadow-sm text-[13.5px] font-medium outline-none focus:border-primary focus:shadow-lg focus:shadow-primary/10 focus:ring-4 focus:ring-primary/5 transition-all`}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-colors flex items-center justify-center p-1"
                                            >
                                                <span className="material-symbols-outlined text-[18px]">
                                                    {showPassword ? 'visibility' : 'visibility_off'}
                                                </span>
                                            </button>
                                        </div>
                                        {formErrors.password && <p className="text-[11px] font-bold text-red-500 ml-1 mt-1">{formErrors.password}</p>}
                                    </div>

                                    {/* Confirm Password */}
                                    <div className="space-y-1 min-w-0">
                                        <label className="text-[14px] font-medium text-slate-500 ml-1">Xác nhận mật khẩu mới</label>
                                        <div className="relative">
                                            <input
                                                type={showConfirmPassword ? "text" : "password"}
                                                name="confirmPassword"
                                                value={formData.confirmPassword}
                                                onChange={handleChange}
                                                placeholder="Bỏ trống nếu không đổi"
                                                autoComplete="new-password"
                                                className={`w-full px-4 pr-11 h-[42px] rounded-xl border ${formErrors.confirmPassword ? 'border-red-500/50' : 'border-slate-400 dark:border-slate-700'} bg-white dark:bg-slate-900 shadow-sm text-[13.5px] font-medium outline-none focus:border-primary focus:shadow-lg focus:shadow-primary/10 focus:ring-4 focus:ring-primary/5 transition-all`}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-colors flex items-center justify-center p-1"
                                            >
                                                <span className="material-symbols-outlined text-[18px]">
                                                    {showConfirmPassword ? 'visibility' : 'visibility_off'}
                                                </span>
                                            </button>
                                        </div>
                                        {formErrors.confirmPassword && <p className="text-[11px] font-bold text-red-500 ml-1 mt-1">{formErrors.confirmPassword}</p>}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Professional Profile - Compact */}
                        <div className="space-y-2 font-display">
                            <div className="flex items-center gap-2 pb-0.5 ml-1">
                                <div className="text-slate-400 dark:text-slate-500 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-[20px]">clinical_notes</span>
                                </div>
                                <h3 className="font-bold text-slate-500 dark:text-slate-100 text-[15px] italic-none ml-1">Hồ sơ chuyên môn</h3>
                            </div>

                            <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                {/* Degree */}
                                <div className="space-y-1">
                                    <label className="text-[14px] font-medium text-slate-500 ml-1">Học hàm</label>
                                    <Dropdown
                                        options={['Bác sĩ', 'Bác sĩ CKI', 'Bác sĩ CKII', 'Thạc sĩ', 'Tiến sĩ', 'Phó Giáo sư', 'Giáo sư']}
                                        value={formData.degree}
                                        onChange={(degree: string) => setFormData(prev => ({ ...prev, degree }))}
                                    />
                                </div>

                                {/* License Number */}
                                <div className="space-y-1">
                                    <label className="text-[14px] font-medium text-slate-500 ml-1">Số chứng chỉ hành nghề <span className="text-red-500">*</span></label>
                                    <input
                                        name="licenseNumber"
                                        value={formData.licenseNumber}
                                        onChange={handleChange}
                                        placeholder="Nhập chứng chỉ"
                                        autoComplete="off"
                                        className={`w-full px-4 h-[42px] rounded-xl border ${formErrors.licenseNumber ? 'border-red-500/50' : 'border-slate-400 dark:border-slate-700'} bg-white dark:bg-slate-900 shadow-sm text-[13px] font-medium outline-none focus:border-primary focus:shadow-lg focus:shadow-primary/10 focus:ring-4 focus:ring-primary/5 transition-all`}
                                    />
                                    {formErrors.licenseNumber && <p className="text-[10px] text-red-500 ml-1">{formErrors.licenseNumber}</p>}
                                </div>

                                {/* Specialty */}
                                <div className="space-y-1">
                                    <label className="text-[14px] font-medium text-slate-500 ml-1">Chuyên khoa</label>
                                    <Dropdown
                                        options={['Nội khoa', 'Sản phụ khoa', 'Nhi khoa', 'Tim mạch', 'Thần kinh', 'Da liễu', 'Khác']}
                                        value={formData.specialty}
                                        onChange={(specialty: string) => setFormData(prev => ({ ...prev, specialty }))}
                                    />
                                </div>

                                {/* Status */}
                                <div className="space-y-1">
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

                                {/* Bio */}
                                <div className="space-y-1 lg:col-span-4">
                                    <label className="text-[14px] font-medium text-slate-500 ml-1">Giới thiệu tóm tắt (Bio)</label>
                                    <textarea
                                        name="bio"
                                        value={formData.bio}
                                        onChange={handleChange}
                                        rows={2}
                                        placeholder="Nhập ghi chú tóm tắt..."
                                        className="w-full px-4 py-2 rounded-xl border border-slate-400 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm text-[13px] font-medium outline-none focus:border-primary focus:shadow-lg focus:shadow-primary/10 focus:ring-4 focus:ring-primary/5 transition-all resize-none"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Modal Footer - No divider */}
                <div className="px-6 md:px-8 py-5 bg-white dark:bg-slate-900 flex items-center justify-end sticky bottom-0 z-20 rounded-b-3xl">
                    <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                        <button
                            onClick={onClose}
                            className="px-6 py-2.5 text-[14px] font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition-all active:scale-95"
                            type="button"
                        >
                            Hủy bỏ
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={isSaving}
                            className="px-8 py-2.5 bg-primary text-white text-[14px] font-bold rounded-xl shadow-lg shadow-primary/25 hover:bg-primary/90 transition-all flex items-center gap-2 active:scale-95"
                        >
                            {isSaving ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                                    <span>Đang lưu...</span>
                                </>
                            ) : (
                                <>
                                    <span className="material-symbols-outlined text-[20px]">save</span>
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
