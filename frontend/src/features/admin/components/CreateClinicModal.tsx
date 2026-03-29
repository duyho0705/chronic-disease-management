import React, { useEffect, useState } from 'react';

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
    adminPassword: 'password123', // Default password for simplicity in creation
    adminPhone: '',
    imageUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=200',
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

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
    if (!formData.name) errors.name = 'Vui lòng nhập tên phòng khám';
    if (!formData.clinicCode) errors.clinicCode = 'Vui lòng nhập mã phòng khám';
    if (!formData.address) errors.address = 'Vui lòng nhập địa chỉ';
    if (!formData.phone) errors.phone = 'Vui lòng nhập số điện thoại';
    if (!formData.adminFullName) errors.adminFullName = 'Vui lòng nhập tên người quản lý';
    if (!formData.adminEmail) errors.adminEmail = 'Vui lòng nhập email quản lý';

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
      {/* Background/Backdrop exactly like Doctor's side */}
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] transition-all duration-300"
        onClick={onClose}
      ></div>

      <div className="relative bg-white dark:bg-slate-900 w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in duration-300 border border-primary/10 transition-all max-h-[92vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900 sticky top-0 z-20 transition-all">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2.5 rounded-xl text-primary flex items-center justify-center">
              <span className="material-symbols-outlined font-bold">domain_add</span>
            </div>
            <h2 className="text-[20px] font-extrabold text-slate-900 dark:text-white tracking-tight">Thêm phòng khám mới</h2>
          </div>
        </div>

        {/* Form Content */}
        <div className="p-6 md:p-8 space-y-8 overflow-y-auto custom-scrollbar flex-1 bg-white dark:bg-slate-900 text-left">

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Left: Clinic Info */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 pb-2 border-primary/10 pl-1 border-l-4 border-l-primary">
                <h3 className="font-extrabold text-slate-900 dark:text-slate-100 text-sm tracking-wide lowercase first-letter:uppercase">Thông tin cơ sở</h3>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[13px] font-bold text-slate-500 ml-1">Tên phòng khám <span className="text-red-500">*</span></label>
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="VD: Phòng khám Đa khoa Tâm Anh"
                    className={`w-full px-4 py-2.5 rounded-xl border-2 ${formErrors.name ? 'border-red-500/50' : 'border-slate-50 dark:border-slate-800'} bg-slate-50 dark:bg-slate-800/40 text-[14px] font-medium transition-all outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 shadow-sm`}
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
                      placeholder="PK-TA-001"
                      className={`w-full px-4 py-2.5 rounded-xl border-2 ${formErrors.clinicCode ? 'border-red-500/50' : 'border-slate-50 dark:border-slate-800'} bg-slate-50 dark:bg-slate-800/40 text-[14px] font-medium transition-all outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 shadow-sm`}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[13px] font-bold text-slate-500 ml-1">Số điện thoại <span className="text-red-500">*</span></label>
                    <input
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="024.xxx.xxx"
                      className={`w-full px-4 py-2.5 rounded-xl border-2 ${formErrors.phone ? 'border-red-500/50' : 'border-slate-50 dark:border-slate-800'} bg-slate-50 dark:bg-slate-800/40 text-[14px] font-medium transition-all outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 shadow-sm`}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[13px] font-bold text-slate-500 ml-1">Địa chỉ <span className="text-red-500">*</span></label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Số nhà, tên đường, khu vực..."
                    className={`w-full px-4 py-2.5 rounded-xl border-2 ${formErrors.address ? 'border-red-500/50' : 'border-slate-50 dark:border-slate-800'} bg-slate-50 dark:bg-slate-800/40 text-[14px] font-medium transition-all outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 resize-none shadow-sm shadow-slate-100/50`}
                  />
                  {formErrors.address && <p className="text-[11px] font-bold text-red-500 ml-1">{formErrors.address}</p>}
                </div>
              </div>
            </div>

            {/* Right: Admin Account */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 pb-2 border-emerald-500/10 pl-1 border-l-4 border-l-emerald-500">
                <h3 className="font-extrabold text-slate-900 dark:text-slate-100 text-sm tracking-wide lowercase first-letter:uppercase">Tài khoản quản trị</h3>
              </div>

              <div className="p-6 bg-emerald-50/20 dark:bg-emerald-900/10 rounded-2xl border border-emerald-500/10 space-y-5">
                <div className="space-y-1.5">
                  <label className="text-[13px] font-bold text-slate-500 ml-1">Họ và tên quản lý <span className="text-red-500">*</span></label>
                  <input
                    name="adminFullName"
                    value={formData.adminFullName}
                    onChange={handleChange}
                    placeholder="VD: Nguyễn Văn Anh"
                    className={`w-full px-4 py-2.5 rounded-xl border-2 ${formErrors.adminFullName ? 'border-red-500/50' : 'border-slate-50 dark:border-slate-800'} bg-white dark:bg-slate-900 text-[14px] font-medium transition-all outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 shadow-sm`}
                  />
                  {formErrors.adminFullName && <p className="text-[11px] font-bold text-red-500 ml-1">{formErrors.adminFullName}</p>}
                </div>

                <div className="space-y-1.5">
                  <label className="text-[13px] font-bold text-slate-500 ml-1">Email đăng nhập <span className="text-red-500">*</span></label>
                  <input
                    name="adminEmail"
                    value={formData.adminEmail}
                    onChange={handleChange}
                    placeholder="email@tamanh.com"
                    className={`w-full px-4 py-2.5 rounded-xl border-2 ${formErrors.adminEmail ? 'border-red-500/50' : 'border-slate-50 dark:border-slate-800'} bg-white dark:bg-slate-900 text-[14px] font-medium transition-all outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 shadow-sm`}
                  />
                  {formErrors.adminEmail && <p className="text-[11px] font-bold text-red-500 ml-1">{formErrors.adminEmail}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[13px] font-bold text-slate-500 ml-1">Mật khẩu ban đầu</label>
                    <div className="relative">
                      <input
                        type="text"
                        readOnly
                        value={formData.adminPassword}
                        className="w-full pl-4 pr-10 py-2.5 rounded-xl border-2 border-slate-50 dark:border-slate-800 bg-slate-100 dark:bg-slate-900/50 text-[13px] font-mono text-slate-500 outline-none"
                      />
                      <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">lock</span>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[13px] font-bold text-slate-500 ml-1">SĐT quản lý</label>
                    <input
                      name="adminPhone"
                      value={formData.adminPhone}
                      onChange={handleChange}
                      placeholder="09xx.xxx.xxx"
                      className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-50 dark:border-slate-800 bg-white dark:bg-slate-900 text-[14px] font-medium transition-all outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 shadow-sm"
                    />
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
            className="px-6 py-2.5 text-sm font-bold text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all active:scale-95"
            type="button"
          >
            Hủy bỏ
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSaving}
            className="px-10 py-2.5 text-sm font-extrabold text-slate-900 bg-primary hover:bg-primary/90 rounded-xl transition-all shadow-xl shadow-primary/20 flex items-center gap-2 active:scale-95 transform disabled:opacity-50 disabled:cursor-wait"
            type="button"
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin"></div>
                Đang lưu...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined font-bold">send</span>
                Kích hoạt & Gửi
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateClinicModal;
