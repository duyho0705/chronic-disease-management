import { useEffect, useState } from 'react';
import Dropdown from '../../../components/ui/Dropdown';

interface EditPatientModalProps {
    isOpen: boolean;
    onClose: () => void;
    isSaving: boolean;
    onSave: (patientData: any) => Promise<void>;
    patientData: any;
    availableDoctors: any[];
}

export default function EditPatientModal({
    isOpen,
    onClose,
    isSaving,
    onSave,
    patientData,
    availableDoctors
}: EditPatientModalProps) {
    const [formData, setFormData] = useState({
        name: '',
        age: '',
        gender: 'Nam',
        phone: '',
        email: '',
        address: '',
        condition: 'Tiểu đường Type 2',
        riskLevel: 'Theo dõi (MONITORING)',
        assignedDoctor: '',
        notes: '',
        password: '',
        confirmPassword: ''
    });

    const [formErrors, setFormErrors] = useState<Record<string, string>>({});

    // Map available doctors for Dropdown
    const doctorOptions = availableDoctors.map(d => ({
        label: d.name,
        value: d.id.toString()
    }));

    useEffect(() => {
        if (isOpen && patientData) {
            // Find doctor ID by name if doctorId not present in patientData, 
            // or use patientData.doctorId if available (which it should be in the new version)
            const currentDoctorId = patientData.doctorId ? patientData.doctorId.toString() : 
                                   (availableDoctors.find(d => d.name === patientData.doctor)?.id.toString() || (availableDoctors[0]?.id.toString() || ''));

            setFormData({
                name: patientData.name || '',
                age: patientData.age || '',
                gender: patientData.gender || 'Nam',
                phone: patientData.phone || '',
                email: patientData.email || '',
                address: patientData.address || '',
                condition: patientData.condition || 'Tiểu đường Type 2',
                riskLevel: patientData.riskLevel || 'Theo dõi (MONITORING)',
                assignedDoctor: currentDoctorId,
                notes: patientData.notes || '',
                password: '',
                confirmPassword: ''
            });
            setFormErrors({});
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, patientData, availableDoctors]);

    if (!isOpen || !patientData) return null;

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
        if (!formData.age.toString().trim() || isNaN(Number(formData.age))) errors.age = 'Vui lòng nhập tuổi hợp lệ';
        if (!formData.phone.trim()) errors.phone = 'Vui lòng nhập số điện thoại liên hệ';
        if (!formData.email.trim()) {
            errors.email = 'Vui lòng nhập email đăng nhập';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            errors.email = 'Email không hợp lệ';
        }

        if (formData.password) {
            if (formData.password.length < 6) errors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
            if (formData.password !== formData.confirmPassword) errors.confirmPassword = 'Mật khẩu xác nhận không khớp';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = () => {
        if (validateForm()) {
            onSave({ ...patientData, ...formData });
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
                            <span className="material-symbols-outlined font-black text-2xl">edit_square</span>
                        </div>
                        <div>
                            <h2 className="text-[20px] font-black text-slate-900 dark:text-white tracking-tight leading-tight">Cập nhật hồ sơ bệnh nhân</h2>
                            <p className="text-[13px] font-medium text-slate-500 mt-0.5">Mã hồ sơ: {patientData.id}</p>
                        </div>
                    </div>
                </div>

                {/* Form Content */}
                <div className="p-5 md:p-6 space-y-5 overflow-y-auto custom-scrollbar flex-1 bg-slate-50/50 dark:bg-slate-900/50 text-left">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Personal Information */}
                        <div className="space-y-4 text-left">
                            {/* Hidden inputs to trap autofill */}
                            <input autoComplete="new-password" type="text" style={{ display: 'none' }} />
                            <input autoComplete="new-password" type="password" style={{ display: 'none' }} />
                            <div className="flex items-center gap-2 pb-2 pl-2 border-l-4 border-l-primary">
                                <h3 className="font-extrabold text-slate-900 dark:text-slate-100 text-[15px] uppercase tracking-wider">Thông tin hành chính</h3>
                            </div>

                            <div className="space-y-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
                                <div className="space-y-1.5 text-left">
                                    <label className="text-[13px] font-bold text-slate-500 ml-1">Họ và tên bệnh nhân <span className="text-red-500">*</span></label>
                                    <input
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        autoComplete="new-password"
                                        className={`w-full px-4 py-[9px] rounded-xl border-2 ${formErrors.name ? 'border-red-500/50' : 'border-slate-100 dark:border-slate-800'} bg-slate-50/50 dark:bg-slate-800/40 text-[14px] font-bold text-slate-700 dark:text-slate-200 transition-all outline-none focus:border-primary focus:ring-4 focus:ring-primary/10`}
                                    />
                                    {formErrors.name && <p className="text-[11px] font-bold text-red-500 ml-1 mt-1">{formErrors.name}</p>}
                                </div>

                                <div className="grid grid-cols-2 gap-4 text-left">
                                    <div className="space-y-1.5">
                                        <label className="text-[13px] font-bold text-slate-500 ml-1">Tuổi <span className="text-red-500">*</span></label>
                                        <input
                                            name="age"
                                            value={formData.age}
                                            onChange={handleChange}
                                            autoComplete="new-password"
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

                                <div className="space-y-1.5 text-left">
                                    <label className="text-[13px] font-bold text-slate-500 ml-1">Số điện thoại liên hệ <span className="text-red-500">*</span></label>
                                    <div className="relative">
                                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[20px] text-slate-400">call</span>
                                        <input
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            autoComplete="new-password"
                                            className={`w-full pl-11 pr-4 py-[9px] rounded-xl border-2 ${formErrors.phone ? 'border-red-500/50' : 'border-slate-100 dark:border-slate-800'} bg-slate-50/50 dark:bg-slate-800/40 text-[14px] font-bold text-slate-700 dark:text-slate-200 transition-all outline-none focus:border-primary focus:ring-4 focus:ring-primary/10`}
                                        />
                                    </div>
                                    {formErrors.phone && <p className="text-[11px] font-bold text-red-500 ml-1 mt-1">{formErrors.phone}</p>}
                                </div>

                                <div className="space-y-1.5 text-left">
                                    <label className="text-[13px] font-bold text-slate-500 ml-1">Email đăng nhập <span className="text-red-500">*</span></label>
                                    <div className="relative">
                                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[20px] text-slate-400">mail</span>
                                        <input
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            autoComplete="new-password"
                                            className={`w-full pl-11 pr-4 py-[9px] rounded-xl border-2 ${formErrors.email ? 'border-red-500/50' : 'border-slate-100 dark:border-slate-800'} bg-slate-50/50 dark:bg-slate-800/40 text-[14px] font-bold text-slate-700 dark:text-slate-200 transition-all outline-none focus:border-primary focus:ring-4 focus:ring-primary/10`}
                                        />
                                    </div>
                                    {formErrors.email && <p className="text-[11px] font-bold text-red-500 ml-1 mt-1">{formErrors.email}</p>}
                                </div>

                                <div className="space-y-4 pt-2 border-t border-slate-100 dark:border-slate-800">
                                    <div className="flex items-center gap-2 pl-2 border-l-4 border-l-primary/50 mb-2">
                                        <h3 className="font-bold text-slate-700 dark:text-slate-300 text-[14px]">Thiết lập lại mật khẩu (Để trống nếu không đổi)</h3>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1.5 text-left">
                                            <label className="text-[13px] font-bold text-slate-500 ml-1">Mật khẩu mới</label>
                                            <div className="relative">
                                                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[20px] text-slate-400">lock</span>
                                                <input
                                                    type="password"
                                                    name="password"
                                                    value={formData.password}
                                                    onChange={handleChange}
                                                    autoComplete="new-password"
                                                    placeholder="••••••••"
                                                    className={`w-full pl-11 pr-4 py-[9px] rounded-xl border-2 ${formErrors.password ? 'border-red-500/50' : 'border-slate-100 dark:border-slate-800'} bg-slate-50/50 dark:bg-slate-800/40 text-[14px] font-bold text-slate-700 dark:text-slate-200 transition-all outline-none focus:border-primary focus:ring-4 focus:ring-primary/10`}
                                                />
                                            </div>
                                            {formErrors.password && <p className="text-[11px] font-bold text-red-500 ml-1 mt-1">{formErrors.password}</p>}
                                        </div>
                                        <div className="space-y-1.5 text-left">
                                            <label className="text-[13px] font-bold text-slate-500 ml-1">Xác nhận mật khẩu</label>
                                            <div className="relative">
                                                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[20px] text-slate-400">shield</span>
                                                <input
                                                    type="password"
                                                    name="confirmPassword"
                                                    value={formData.confirmPassword}
                                                    onChange={handleChange}
                                                    autoComplete="new-password"
                                                    placeholder="••••••••"
                                                    className={`w-full pl-11 pr-4 py-[9px] rounded-xl border-2 ${formErrors.confirmPassword ? 'border-red-500/50' : 'border-slate-100 dark:border-slate-800'} bg-slate-50/50 dark:bg-slate-800/40 text-[14px] font-bold text-slate-700 dark:text-slate-200 transition-all outline-none focus:border-primary focus:ring-4 focus:ring-primary/10`}
                                                />
                                            </div>
                                            {formErrors.confirmPassword && <p className="text-[11px] font-bold text-red-500 ml-1 mt-1">{formErrors.confirmPassword}</p>}
                                        </div>
                                    </div>
                                </div>


                            </div>
                        </div>

                        {/* Medical Profile */}
                        <div className="space-y-4 text-left">
                            <div className="flex items-center gap-2 pb-2 pl-2 border-l-4 border-l-amber-400">
                                <h3 className="font-extrabold text-slate-900 dark:text-slate-100 text-[15px] uppercase tracking-wider">Hồ sơ bệnh lý</h3>
                            </div>

                            <div className="space-y-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm relative">
                                <div className="space-y-1.5 text-left relative z-30">
                                    <label className="text-[13px] font-bold text-slate-500 ml-1">Nhóm bệnh lý chính</label>
                                    <Dropdown
                                        options={['Tiểu đường Type 1', 'Tiểu đường Type 2', 'Cao huyết áp', 'Bệnh tim mạch', 'Suy thận', 'Hen suyễn', 'Khác']}
                                        value={formData.condition}
                                        onChange={(condition: string) => setFormData(prev => ({ ...prev, condition }))}
                                    />
                                </div>

                                <div className="space-y-1.5 text-left relative z-20">
                                    <label className="text-[13px] font-bold text-slate-500 ml-1">Bác sĩ phụ trách</label>
                                    <Dropdown
                                        options={doctorOptions}
                                        value={formData.assignedDoctor}
                                        onChange={(assignedDoctor: string) => setFormData(prev => ({ ...prev, assignedDoctor }))}
                                    />
                                </div>

                                <div className="space-y-1.5 mt-2 text-left relative z-10">
                                    <label className="text-[13px] font-bold text-slate-500 ml-1">Đánh giá rủi ro hiện tại</label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {['Ổn định (STABLE)', 'Theo dõi (MONITORING)', 'Nguy cơ cao (HIGH RISK)'].map(level => {
                                            const isSelected = formData.riskLevel === level;
                                            const isDanger = level.includes('HIGH');
                                            const isWarning = level.includes('MONITORING');

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
                                                    className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all duration-200 cursor-pointer ${selectedClasses}`}
                                                >
                                                    <span className={`material-symbols-outlined mb-1.5 ${iconProps.color}`} style={{ fontVariationSettings: "'FILL' 1" }}>
                                                        {iconProps.name}
                                                    </span>
                                                    <span className="text-[11px] font-bold text-center leading-tight">
                                                        {level.split(' (')[0]}
                                                    </span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div className="space-y-1.5 mt-2 text-left relative z-10">
                                    <label className="text-[13px] font-bold text-slate-500 ml-1">Ghi chú lâm sàng</label>
                                    <textarea
                                        name="notes"
                                        value={formData.notes}
                                        onChange={handleChange}
                                        rows={3}
                                        className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-[14px] font-medium text-slate-700 dark:text-slate-200 transition-all outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 resize-none custom-scrollbar"
                                    ></textarea>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Modal Footer */}
                <div className="px-6 md:px-8 py-5 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end sticky bottom-0 z-20">
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
                                    Cập nhật hồ sơ
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
