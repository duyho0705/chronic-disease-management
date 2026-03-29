import React, { useEffect, useState } from 'react';
import Dropdown from '../../../components/ui/Dropdown';

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  isSaving: boolean;
  onSave: (userData: any) => Promise<void>;
  availableClinics: string[];
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
    clinic: 'Hệ thống chính',
    status: 'Hoạt động',
    password: 'password123', // Demo default
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
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] transition-all duration-300"
        onClick={onClose}
      ></div>

      <div className="relative bg-white dark:bg-slate-900 w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in duration-300 border border-primary/10 transition-all max-h-[92vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900 sticky top-0 z-20">
          <div className="flex items-center gap-3 text-left">
            <div className="bg-primary/10 p-2.5 rounded-xl text-primary flex items-center justify-center">
              <span className="material-symbols-outlined font-bold">person_add</span>
            </div>
            <h2 className="text-[20px] font-extrabold text-slate-900 dark:text-white tracking-tight">Thêm người dùng mới</h2>
          </div>
        </div>

        {/* Form Content */}
        <div className="p-6 md:p-8 space-y-8 overflow-y-auto custom-scrollbar flex-1 bg-white dark:bg-slate-900 text-left">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Left: Personal Info */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 pb-2 border-primary/10 pl-1 border-l-4 border-l-primary">
                <h3 className="font-extrabold text-slate-900 dark:text-slate-100 text-sm tracking-wide lowercase first-letter:uppercase">Thông tin cá nhân</h3>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[13px] font-bold text-slate-500 ml-1">Họ và tên <span className="text-red-500">*</span></label>
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="VD: Nguyễn Văn Anh"
                    className={`w-full px-4 py-2.5 rounded-xl border-2 ${formErrors.name ? 'border-red-500/50' : 'border-slate-50 dark:border-slate-800'} bg-slate-50 dark:bg-slate-800/40 text-[14px] font-bold transition-all outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 shadow-sm`}
                  />
                  {formErrors.name && <p className="text-[11px] font-bold text-red-500 ml-1">{formErrors.name}</p>}
                </div>

                <div className="space-y-1.5">
                  <label className="text-[13px] font-bold text-slate-500 ml-1">Email <span className="text-red-500">*</span></label>
                  <input
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="email@example.com"
                    className={`w-full px-4 py-2.5 rounded-xl border-2 ${formErrors.email ? 'border-red-500/50' : 'border-slate-50 dark:border-slate-800'} bg-slate-50 dark:bg-slate-800/40 text-[14px] font-bold transition-all outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 shadow-sm`}
                  />
                  {formErrors.email && <p className="text-[11px] font-bold text-red-500 ml-1">{formErrors.email}</p>}
                </div>

                <div className="space-y-1.5">
                  <label className="text-[13px] font-bold text-slate-500 ml-1">Số điện thoại</label>
                  <input
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="09xx.xxx.xxx"
                    className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-50 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-[14px] font-bold transition-all outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 shadow-sm"
                  />
                </div>
              </div>
            </div>

            {/* Right: Account & Permissions */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 pb-2 border-indigo-500/10 pl-1 border-l-4 border-l-indigo-500">
                <h3 className="font-extrabold text-slate-900 dark:text-slate-100 text-sm tracking-wide lowercase first-letter:uppercase">Phân quyền & Tài khoản</h3>
              </div>

              <div className="p-6 bg-indigo-50/20 dark:bg-indigo-900/10 rounded-2xl border border-indigo-500/10 space-y-5">
                <div className="space-y-1.5">
                  <label className="text-[13px] font-bold text-slate-500 ml-1">Tên đăng nhập <span className="text-red-500">*</span></label>
                  <input
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="vd: can_bo_01"
                    className={`w-full px-4 py-2.5 rounded-xl border-2 ${formErrors.username ? 'border-red-500/50' : 'border-slate-50 dark:border-slate-800'} bg-white dark:bg-slate-900 text-[14px] font-bold transition-all outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 shadow-sm`}
                  />
                  {formErrors.username && <p className="text-[11px] font-bold text-red-500 ml-1">{formErrors.username}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[13px] font-bold text-slate-500 ml-1">Vai trò hệ thống</label>
                    <Dropdown
                      options={['Quản trị viên', 'Bác sĩ', 'Quản lý phòng khám', 'Nhân viên']}
                      value={formData.role}
                      onChange={(role) => setFormData(prev => ({ ...prev, role }))}
                      className="!bg-white dark:!bg-slate-900"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[13px] font-bold text-slate-500 ml-1">Cơ sở công tác</label>
                    <Dropdown
                      options={availableClinics}
                      value={formData.clinic}
                      onChange={(clinic) => setFormData(prev => ({ ...prev, clinic }))}
                      className="!bg-white dark:!bg-slate-900"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[13px] font-bold text-slate-500 ml-1">Mật khẩu mặc định</label>
                  <div className="relative">
                    <input
                      type="text"
                      readOnly
                      value={formData.password}
                      className="w-full pl-4 pr-10 py-2.5 rounded-xl border-2 border-slate-50 dark:border-slate-800 bg-slate-100 dark:bg-slate-900/50 text-[13px] font-mono font-bold text-slate-500 outline-none"
                    />
                    <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">lock</span>
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
            className="px-10 py-2.5 text-sm font-extrabold text-white bg-indigo-500 hover:bg-indigo-600 rounded-xl transition-all shadow-xl shadow-indigo-500/20 flex items-center gap-2 transform disabled:opacity-50 disabled:cursor-wait"
            type="button"
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Đang lưu...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined font-bold">person_add</span>
                Tạo tài khoản
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateUserModal;
