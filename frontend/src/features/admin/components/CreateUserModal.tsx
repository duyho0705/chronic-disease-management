import React, { useEffect, useState } from 'react';
import Dropdown from '../../../components/ui/Dropdown';

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  isSaving: boolean;
  onSave: (userData: any) => Promise<void>;
  availableClinics: any[];
}

const CreateUserModal: React.FC<CreateUserModalProps> = ({
  isOpen,
  onClose,
  isSaving,
  onSave,
  availableClinics,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    username: '',
    role: 'Quản lý phòng khám',
    clinic: '',
    status: 'Hoạt động',
    password: '',
    confirmPassword: '',
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Set default clinic if not set
      if (!formData.clinic && availableClinics.length > 0) {
        setFormData(prev => ({ ...prev, clinic: availableClinics[0].name }));
      }
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    if (!formData.name) errors.name = 'Vui lòng nhập họ và tên';
    if (!formData.email) errors.email = 'Vui lòng nhập email';
    if (!formData.username) errors.username = 'Vui lòng nhập tên đăng nhập';
    if (!formData.password) errors.password = 'Vui lòng nhập mật khẩu';
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Mật khẩu xác nhận không khớp';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      // Map Role text to Backend Role Code
      const roleMapping: any = {
        'Quản trị viên': 'ADMIN',
        'Bác sĩ': 'DOCTOR',
        'Quản lý phòng khám': 'CLINIC_MANAGER',
        'Bệnh nhân': 'PATIENT'
      };

      // Find Clinic ID by name
      const selectedClinicObj = availableClinics.find(c => c.name === formData.clinic);

      const apiData = {
        fullName: formData.name,
        email: formData.email,
        phone: formData.phone,
        role: roleMapping[formData.role] || formData.role,
        clinicId: selectedClinicObj ? selectedClinicObj.id : null,
        password: formData.password
      };

      onSave(apiData);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 font-display text-left">
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] transition-all duration-300"
        onClick={onClose}
      ></div>

      <div className="relative bg-white dark:bg-slate-900 w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in duration-300 border border-primary/10 transition-all max-h-[92vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900 sticky top-0 z-20">
          <div className="flex items-center gap-3 text-left">
            <div className="bg-[#3bb9f3]/10 p-2.5 rounded-xl text-[#3bb9f3] flex items-center justify-center">
              <span className="material-symbols-outlined font-bold">person_add</span>
            </div>
            <h2 className="text-[20px] font-extrabold text-slate-900 dark:text-white tracking-tight">Thêm người dùng mới</h2>
          </div>
        </div>

        {/* Form Content */}
        <div className="p-6 md:p-8 space-y-8 overflow-y-auto custom-scrollbar flex-1 bg-white dark:bg-slate-900 text-left">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Personal Info (Narrower - 5/12) */}
            <div className="lg:col-span-5 space-y-6 text-left">
              <div className="flex items-center gap-2 pb-2 border-primary/10 pl-1 border-l-4 border-l-primary">
                <h3 className="font-extrabold text-slate-900 dark:text-slate-100 text-[16x] lowercase first-letter:uppercase">Thông tin cá nhân</h3>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[14px] font-bold text-slate-500 ml-1">Họ và tên <span className="text-red-500">*</span></label>
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    autoComplete="off"
                    className={`w-full px-4 py-2.5 rounded-xl border-2 ${formErrors.name ? 'border-red-500/50' : 'border-slate-200 dark:border-slate-700'} bg-slate-100 dark:bg-slate-800/60 text-slate-900 dark:text-white text-[14px] font-bold transition-all outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 shadow-sm text-left`}
                  />
                  {formErrors.name && <p className="text-[11px] font-bold text-red-500 ml-1">{formErrors.name}</p>}
                </div>

                <div className="space-y-1.5">
                  <label className="text-[14px] font-bold text-slate-500 ml-1">Email <span className="text-red-500">*</span></label>
                  <input
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    autoComplete="off"
                    className={`w-full px-4 py-2.5 rounded-xl border-2 ${formErrors.email ? 'border-red-500/50' : 'border-slate-200 dark:border-slate-700'} bg-slate-100 dark:bg-slate-800/60 text-slate-900 dark:text-white text-[14px] font-bold transition-all outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 shadow-sm text-left`}
                  />
                  {formErrors.email && <p className="text-[11px] font-bold text-red-500 ml-1">{formErrors.email}</p>}
                </div>

                <div className="space-y-1.5">
                  <label className="text-[14px] font-bold text-slate-500 ml-1">Số điện thoại</label>
                  <input
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    autoComplete="off"
                    className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/60 text-slate-900 dark:text-white text-[14px] font-bold transition-all outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 shadow-sm text-left"
                  />
                </div>
              </div>
            </div>

            {/* Right: Account & Permissions (Wider - 7/12) */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="flex items-center gap-2 pb-2 border-indigo-500/10 pl-1 border-l-4 border-l-indigo-500">
                <h3 className="font-extrabold text-slate-900 dark:text-slate-100 text-[16px] lowercase first-letter:uppercase">Thiết lập tài khoản</h3>
              </div>

              <div className="p-6 bg-indigo-50/20 dark:bg-indigo-900/10 rounded-2xl border border-indigo-500/10 space-y-5 text-left relative overflow-visible">
                <div className="space-y-1.5">
                  <label className="text-[14px] font-bold text-slate-500 ml-1">Tên đăng nhập <span className="text-red-500">*</span></label>
                  <input
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    autoComplete="off"
                    className={`w-full px-4 py-2.5 rounded-xl border-2 ${formErrors.username ? 'border-red-500/50' : 'border-slate-200 dark:border-slate-700'} bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white text-[14px] font-bold transition-all outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 shadow-sm text-left`}
                  />
                  {formErrors.username && <p className="text-[11px] font-bold text-red-500 ml-1">{formErrors.username}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4 relative z-30">
                  <div className="space-y-1.5 relative">
                    <label className="text-[14px] font-bold text-slate-500 ml-1">Vai trò</label>
                    <Dropdown
                      options={['Quản trị viên', 'Bác sĩ', 'Quản lý phòng khám', 'Bệnh nhân']}
                      value={formData.role}
                      onChange={(role) => setFormData(prev => ({ ...prev, role }))}
                      className="text-left"
                    />
                  </div>
                  <div className="space-y-1.5 relative">
                    <label className="text-[14px] font-bold text-slate-500 ml-1">Phòng khám</label>
                    <Dropdown
                      options={availableClinics.map(c => c.name)}
                      value={formData.clinic}
                      onChange={(clinic) => setFormData(prev => ({ ...prev, clinic }))}
                      className="text-left"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 relative z-10">
                  <div className="space-y-1.5">
                    <label className="text-[14px] font-bold text-slate-500 ml-1">Mật khẩu <span className="text-red-500">*</span></label>
                    <div className="relative group">
                      <input
                        name="password"
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={handleChange}
                        autoComplete="new-password"
                        className={`w-full px-4 py-2.5 rounded-xl border-2 ${formErrors.password ? 'border-red-500/50' : 'border-slate-200 dark:border-slate-700'} bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white text-[14px] font-bold transition-all outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 shadow-sm text-left pr-12`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center w-8 h-8 rounded-lg text-slate-400 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all"
                      >
                        <span className="material-symbols-outlined text-[20px]">
                          {showPassword ? "visibility" : "visibility_off"}
                        </span>
                      </button>
                    </div>
                    {formErrors.password && <p className="text-[11px] font-bold text-red-500 ml-1">{formErrors.password}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[14px] font-bold text-slate-500 ml-1">Xác nhận <span className="text-red-500">*</span></label>
                    <div className="relative group">
                      <input
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className={`w-full px-4 py-2.5 rounded-xl border-2 ${formErrors.confirmPassword ? 'border-red-500/50' : 'border-slate-200 dark:border-slate-700'} bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white text-[14px] font-bold transition-all outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 shadow-sm text-left pr-12`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center w-8 h-8 rounded-lg text-slate-400 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all"
                      >
                        <span className="material-symbols-outlined text-[20px]">
                          {showConfirmPassword ? "visibility" : "visibility_off"}
                        </span>
                      </button>
                    </div>
                    {formErrors.confirmPassword && <p className="text-[11px] font-bold text-red-500 ml-1">{formErrors.confirmPassword}</p>}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-8 py-5 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3 sticky bottom-0 z-20 transition-all">
          <button
            onClick={onClose}
            className="px-6 py-2.5 text-sm font-bold text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"
            type="button"
          >
            Hủy bỏ
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSaving}
            className="px-10 py-2.5 text-sm font-extrabold text-white bg-[#3bb9f3] hover:bg-[#2fa8e2] rounded-xl transition-all shadow-xl shadow-[#3bb9f3]/20 flex items-center gap-2 disabled:opacity-50 disabled:cursor-wait"
            type="button"
          >
            {isSaving ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Đang lưu...
              </div>
            ) : (
              "Tạo tài khoản"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateUserModal;
