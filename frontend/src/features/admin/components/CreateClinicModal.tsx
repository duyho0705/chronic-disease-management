import React, { useEffect, useState } from 'react';

const autofillStyles = `
  input:-webkit-autofill,
  input:-webkit-autofill:hover, 
  input:-webkit-autofill:focus, 
  input:-webkit-autofill:active {
    -webkit-box-shadow: 0 0 0 30px #f8fafc inset !important;
    -webkit-text-fill-color: inherit !important;
  }
`;

interface CreateClinicModalProps {
  isOpen: boolean;
  onClose: () => void;
  isSaving: boolean;
  onSave: (clinicData: any) => Promise<void>;
}

const CreateClinicModal: React.FC<CreateClinicModalProps> = ({
  isOpen,
  onClose,
  isSaving,
  onSave,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    clinicCode: '',
    adminFullName: '',
    adminEmail: '',
    adminPassword: '',
    confirmPassword: '',
    imageUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=200',
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

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

  // Auto-generate clinic code from name
  useEffect(() => {
    if (formData.name && !formData.clinicCode) {
      const generatedCode = formData.name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[đĐ]/g, 'd')
        .replace(/[^a-z0-9 ]/g, '')
        .split(' ')
        .filter(word => word.length > 0)
        .map(word => word[0])
        .join('')
        .toUpperCase();

      setFormData(prev => ({ ...prev, clinicCode: generatedCode }));
    }
  }, [formData.name]);

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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, imageUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    // Clinic Info
    if (!formData.name.trim()) {
      errors.name = 'Vui lòng nhập tên phòng khám';
    } else if (formData.name.trim().length < 3) {
      errors.name = 'Tên phòng khám phải có ít nhất 3 ký tự';
    }

    if (!formData.clinicCode.trim()) {
      errors.clinicCode = 'Vui lòng nhập mã phòng khám';
    }

    if (!formData.address.trim()) {
      errors.address = 'Vui lòng nhập địa chỉ';
    }

    const phoneRegex = /^(0|84)(3|5|7|8|9)([0-9]{8})$/;
    if (!formData.phone.trim()) {
      errors.phone = 'Vui lòng nhập số điện thoại';
    } else if (!phoneRegex.test(formData.phone.trim())) {
      errors.phone = 'Số điện thoại không hợp lệ';
    }

    // Admin Info
    if (!formData.adminFullName.trim()) {
      errors.adminFullName = 'Vui lòng nhập tên người quản lý';
    } else if (formData.adminFullName.trim().length < 2) {
      errors.adminFullName = 'Họ tên quá ngắn';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.adminEmail.trim()) {
      errors.adminEmail = 'Vui lòng nhập email quản lý';
    } else if (!emailRegex.test(formData.adminEmail.trim())) {
      errors.adminEmail = 'Email không đúng định dạng';
    }

    if (!formData.adminPassword) {
      errors.adminPassword = 'Vui lòng nhập mật khẩu';
    } else if (formData.adminPassword.length < 6) {
      errors.adminPassword = 'Mật khẩu phải có ít nhất 6 ký tự';
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Vui lòng xác nhận mật khẩu';
    } else if (formData.adminPassword !== formData.confirmPassword) {
      errors.confirmPassword = 'Mật khẩu xác nhận không khớp';
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
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 text-left">
      <style>{autofillStyles}</style>
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] transition-all duration-300"
        onClick={onClose}
      ></div>

      <div className="relative bg-white dark:bg-slate-900 w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in duration-300 border border-primary/10 transition-all max-h-[92vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900 sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2.5 rounded-xl text-primary flex items-center justify-center">
              <span className="material-symbols-outlined font-bold">domain_add</span>
            </div>
            <h2 className="text-[18px] font-extrabold text-slate-900 dark:text-white tracking-tight">Thêm phòng khám mới</h2>
          </div>
        </div>

        {/* Form Content */}
        <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar flex-1 bg-white dark:bg-slate-900">

          {/* Avatar Section */}
          <div className="flex flex-col items-center mb-8 relative group">
            <div className="relative w-28 h-28 rounded-2xl overflow-hidden border-4 border-white dark:border-slate-800 shadow-xl group-hover:shadow-primary/20 transition-all duration-300">
              <img
                src={formData.imageUrl || 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=200'}
                alt="Clinic Avatar"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div
                className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <span className="material-symbols-outlined text-white text-3xl">photo_camera</span>
              </div>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleImageChange}
            />
            <p className="text-[15px] font-bold text-slate-500 mt-3">Ảnh đại diện phòng khám</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-stretch">
            {/* Left: Clinic Info */}
            <div className="flex flex-col space-y-4">
              <div className="flex items-center gap-2 pb-2 border-primary/10 pl-1 border-l-4 border-l-primary">
                <h3 className="font-extrabold text-slate-900 dark:text-slate-100 text-sm tracking-wide lowercase first-letter:uppercase">Thông tin cơ sở</h3>
              </div>

              <div className="p-6 bg-primary/20 dark:bg-primary/30 rounded-2xl border border-primary/20 space-y-5">
                <div className="space-y-1.5">
                  <label className="text-[13px] font-bold text-slate-500 ml-1">Tên phòng khám <span className="text-red-500">*</span></label>
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 rounded-xl border-2 ${formErrors.name ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'} bg-slate-50 dark:bg-slate-800/40 text-[14px] font-medium transition-all outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 shadow-sm`}
                  />
                  {formErrors.name && <p className="text-[11px] font-bold text-red-500 ml-1">{formErrors.name}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[13px] font-bold text-slate-500 ml-1">Mã định danh <span className="text-red-500">*</span></label>
                    <input
                      name="clinicCode"
                      value={formData.clinicCode}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 rounded-xl border-2 ${formErrors.clinicCode ? 'border-red-400' : 'border-slate-200 dark:border-slate-700'} bg-slate-50 dark:bg-slate-800/40 text-[14px] font-medium transition-all outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 shadow-sm`}
                    />
                    {formErrors.clinicCode && <p className="text-[11px] font-bold text-red-500 ml-1">{formErrors.clinicCode}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[13px] font-bold text-slate-500 ml-1">Số điện thoại <span className="text-red-500">*</span></label>
                    <input
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 rounded-xl border-2 ${formErrors.phone ? 'border-red-400' : 'border-slate-200 dark:border-slate-700'} bg-slate-50 dark:bg-slate-800/40 text-[14px] font-medium transition-all outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 shadow-sm`}
                      autoComplete="off"
                    />
                    {formErrors.phone && <p className="text-[11px] font-bold text-red-500 ml-1">{formErrors.phone}</p>}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[13px] font-bold text-slate-500 ml-1">Địa chỉ <span className="text-red-500">*</span></label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    rows={4}
                    className={`w-full px-3 py-2 rounded-xl border-2 ${formErrors.address ? 'border-red-400' : 'border-slate-200 dark:border-slate-700'} bg-slate-50 dark:bg-slate-800/40 text-[14px] font-medium transition-all outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 resize-none shadow-sm shadow-slate-100/50`}
                  />
                  {formErrors.address && <p className="text-[11px] font-bold text-red-500 ml-1">{formErrors.address}</p>}
                </div>
              </div>
            </div>

            {/* Right: Admin Account */}
            <div className="flex flex-col space-y-4 justify-between">
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-emerald-500/10 pl-1 border-l-4 border-l-emerald-500">
                  <h3 className="font-extrabold text-slate-900 dark:text-slate-100 text-sm tracking-wide lowercase first-letter:uppercase">Tài khoản quản trị</h3>
                </div>

                <div className="p-6 bg-emerald-500/20 dark:bg-emerald-500/30 rounded-2xl border border-emerald-500/20 space-y-5">
                  <div className="space-y-1.5">
                    <label className="text-[13px] font-bold text-slate-500 ml-1">Họ và tên quản lý <span className="text-red-500">*</span></label>
                    <input
                      name="adminFullName"
                      value={formData.adminFullName}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 rounded-xl border-2 ${formErrors.adminFullName ? 'border-red-400' : 'border-slate-200 dark:border-slate-700'} bg-slate-50 dark:bg-slate-800/40 text-[14px] font-medium transition-all outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 shadow-sm`}
                    />
                    {formErrors.adminFullName && <p className="text-[11px] font-bold text-red-500 ml-1">{formErrors.adminFullName}</p>}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[13px] font-bold text-slate-500 ml-1">Email đăng nhập <span className="text-red-500">*</span></label>
                    <input
                      name="adminEmail"
                      value={formData.adminEmail}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 rounded-xl border-2 ${formErrors.adminEmail ? 'border-red-400' : 'border-slate-200 dark:border-slate-700'} bg-slate-50 dark:bg-slate-800/40 text-[14px] font-medium transition-all outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 shadow-sm`}
                      autoComplete="off"
                    />
                    {formErrors.adminEmail && <p className="text-[11px] font-bold text-red-500 ml-1">{formErrors.adminEmail}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[13px] font-bold text-slate-500 ml-1">Mật khẩu <span className="text-red-500">*</span></label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          name="adminPassword"
                          value={formData.adminPassword}
                          onChange={handleChange}
                          className={`w-full pl-3 pr-10 py-2 rounded-xl border-2 ${formErrors.adminPassword ? 'border-red-400' : 'border-slate-200 dark:border-slate-700'} bg-slate-50 dark:bg-slate-800/40 text-[14px] font-medium transition-all outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 shadow-sm`}
                          autoComplete="new-password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                        >
                          <span className="material-symbols-outlined text-[20px]">
                            {showPassword ? 'visibility_off' : 'visibility'}
                          </span>
                        </button>
                      </div>
                      {formErrors.adminPassword && <p className="text-[11px] font-bold text-red-500 ml-1">{formErrors.adminPassword}</p>}
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[13px] font-bold text-slate-500 ml-1">Xác nhận mật khẩu <span className="text-red-500">*</span></label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          className={`w-full pl-3 pr-10 py-2 rounded-xl border-2 ${formErrors.confirmPassword ? 'border-red-400' : 'border-slate-200 dark:border-slate-700'} bg-slate-50 dark:bg-slate-800/40 text-[14px] font-medium transition-all outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 shadow-sm`}
                          autoComplete="new-password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                        >
                          <span className="material-symbols-outlined text-[20px]">
                            {showConfirmPassword ? 'visibility_off' : 'visibility'}
                          </span>
                        </button>
                      </div>
                      {formErrors.confirmPassword && <p className="text-[11px] font-bold text-red-500 ml-1">{formErrors.confirmPassword}</p>}
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit button aligned to the bottom of the grid row */}
              <div className="flex justify-end pt-4">
                <button
                  onClick={handleSubmit}
                  disabled={isSaving}
                  className="px-[30px] py-[10px] text-sm font-bold text-white bg-primary hover:bg-primary/90 rounded-xl transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-2 transform active:scale-95 disabled:opacity-50 disabled:cursor-wait"
                  type="button"
                >
                  {isSaving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Đang lưu...
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined font-medium">send</span>
                      Xác nhận tạo
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateClinicModal;
