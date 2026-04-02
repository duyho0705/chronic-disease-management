import React, { useEffect, useState } from 'react';
import Dropdown from '../../../components/ui/Dropdown';

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
  isSaving: boolean;
  onSave: (userData: any) => Promise<void>;
  availableClinics: any[];
}

const EditUserModal: React.FC<EditUserModalProps> = ({
  isOpen,
  onClose,
  user,
  isSaving,
  onSave,
  availableClinics,
}) => {
  // Use a helper to extract initial values cleanly
  const getInitialValues = (u: any) => {
    const roleMap: Record<string, string> = {
      'Quản trị viên': 'ADMIN',
      'Bác sĩ': 'DOCTOR',
      'Quản lý phòng khám': 'CLINIC_MANAGER',
      'Bệnh nhân': 'PATIENT',
      'Nhân viên': 'PATIENT'
    };

    return {
      name: u?.fullName || u?.name || u?.displayName || '',
      email: u?.email || u?.username || '',
      phone: (u?.phone && u?.phone !== '--') ? u?.phone : (u?.phoneNumber || ''),
      username: u?.email || u?.username || '',
      role: u?.rawRole || u?.roleCode || (u?.role && roleMap[u?.role]) || u?.role || 'PATIENT',
      clinic: u?.clinicId || null,
      status: u?.status === 'Hoạt động' || u?.status === 'ACTIVE' ? 'ACTIVE' : 'INACTIVE',
    };
  };

  const [formData, setFormData] = useState(getInitialValues(user));
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (user && isOpen) {
      console.log('User data received in Modal:', user);
      const values = getInitialValues(user);

      // If clinicId is missing but name is present, try to find it
      if (!values.clinic && (user.clinicName || user.clinic) && availableClinics.length > 0) {
        const cName = user.clinicName || user.clinic;
        const found = availableClinics.find((c: any) => c.name === cName);
        if (found) values.clinic = found.id;
      }

      setFormData(values);
    }
  }, [user, isOpen, availableClinics]);

  const inputClasses = "w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border-2 border-slate-100 dark:border-slate-800 text-[14px] font-bold text-slate-800 dark:text-white transition-all outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 shadow-sm";
  const labelClasses = "block text-[13px] font-bold text-slate-500/80 dark:text-slate-400 mb-1.5 ml-1";

  if (!isOpen || !user) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.name) errors.name = 'Vui lòng nhập họ và tên';
    if (!formData.email) errors.email = 'Vui lòng nhập email';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      // Create request object matching Backend's UpdateUserRequest
      const apiData = {
        fullName: formData.name,
        email: formData.email,
        phone: formData.phone,
        role: formData.role,
        clinicId: formData.clinic,
        status: formData.status
      };
      onSave(apiData);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 font-display">
      {/* Backdrop - Identical to Clinic Modal */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] transition-all duration-300 pointer-events-auto"
        onClick={onClose}
      ></div>

      <div className="relative bg-white dark:bg-slate-900 w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in duration-300 border border-primary/10 transition-all max-h-[95vh] z-10">
        {/* Modal Header - Identical Styling */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900 sticky top-0 z-20">
          <div className="flex items-center gap-3 text-left">
            <div className="bg-amber-500/10 p-2.5 rounded-xl text-amber-500 flex items-center justify-center">
              <span className="material-symbols-outlined font-bold">manage_accounts</span>
            </div>
            <div>
              <h2 className="text-[20px] font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">Chỉnh sửa người dùng</h2>
              <p className="text-slate-400 font-bold text-xs mt-0.5">Cập nhật thông tin và phân quyền tài khoản</p>
            </div>
          </div>
          {/* X Button Removed as requested */}
        </div>

        {/* Modal Body - Scrollable Content */}
        <div className="p-6 md:p-8 space-y-8 overflow-y-auto custom-scrollbar flex-1 bg-white dark:bg-slate-900 text-left">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Left Column: Basic Info */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 pb-2 border-primary/10 pl-1 border-l-4 border-l-primary">
                <h3 className="text-[15px] font-bold text-slate-800 dark:text-slate-200">Thông tin cá nhân</h3>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className={labelClasses}>Họ và tên</label>
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    autoComplete="off"
                    className={inputClasses}
                  />
                  {formErrors.name && <p className="text-red-500 text-[11px] font-bold mt-1 ml-1">{formErrors.name}</p>}
                </div>

                <div className="space-y-1.5">
                  <label className={labelClasses}>Email *</label>
                  <input
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    autoComplete="off"
                    className={inputClasses}
                  />
                  {formErrors.email && <p className="text-red-500 text-[11px] font-bold mt-1 ml-1">{formErrors.email}</p>}
                </div>

                <div className="space-y-1.5">
                  <label className={labelClasses}>Số điện thoại</label>
                  <input
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    autoComplete="off"
                    className={inputClasses}
                  />
                </div>
              </div>
            </div>

            {/* Right Column: Roles & Status */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 pb-2 border-amber-500/10 pl-1 border-l-4 border-l-amber-500">
                <h3 className="font-bold text-slate-800 dark:text-slate-100 text-[15px]">Phân quyền & Trạng thái</h3>
              </div>

              <div className="p-6 bg-amber-50/20 dark:bg-amber-900/10 rounded-2xl border border-amber-500/10 space-y-5 text-left">
                <div className="space-y-1.5 text-left">
                  <label className="text-[13px] font-bold text-slate-500 ml-1">Vai trò hệ thống</label>
                  <Dropdown
                    options={[
                      { label: 'Quản trị viên', value: 'ADMIN' },
                      { label: 'Bác sĩ', value: 'DOCTOR' },
                      { label: 'Quản lý phòng khám', value: 'CLINIC_MANAGER' },
                      { label: 'Bệnh nhân', value: 'PATIENT' }
                    ]}
                    value={formData.role}
                    onChange={(role) => setFormData(prev => ({ ...prev, role }))}
                    className="!bg-white dark:!bg-slate-900"
                  />
                </div>

                <div className="space-y-1.5 text-left">
                  <label className="text-[13px] font-bold text-slate-500 ml-1">Cơ sở công tác</label>
                  <Dropdown
                    options={availableClinics.map(c => ({ label: c.name, value: c.id }))}
                    value={formData.clinic}
                    onChange={(clinic) => setFormData(prev => ({ ...prev, clinic }))}
                    className="!bg-white dark:!bg-slate-900"
                  />
                </div>

                <div className="space-y-1.5 pt-2">
                  <label className="text-[13px] font-bold text-slate-500 ml-1 mb-2 block">Trạng thái tài khoản</label>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, status: 'ACTIVE' }))}
                      className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 transition-all font-bold text-sm ${formData.status === 'ACTIVE'
                        ? 'border-emerald-500 bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                        : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-400 opacity-60'
                        }`}
                    >
                      <span className="material-symbols-outlined text-[18px]">check_circle</span>
                      Hoạt động
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, status: 'INACTIVE' }))}
                      className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 transition-all font-bold text-sm ${formData.status === 'INACTIVE'
                        ? 'border-red-500 bg-red-500 text-white shadow-lg shadow-red-500/20'
                        : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-400 opacity-60'
                        }`}
                    >
                      <span className="material-symbols-outlined text-[18px]">block</span>
                      Tạm dừng
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer - Sticky like Clinic Modal */}
        <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3 bg-slate-50/50 dark:bg-slate-900/50 sticky bottom-0 z-20">
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
            className="px-10 py-2.5 text-sm font-extrabold text-white bg-primary hover:bg-primary/90 rounded-xl transition-all shadow-xl shadow-primary/20 flex items-center gap-2 transform active:scale-95 disabled:opacity-50"
            type="button"
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Đang lưu...
              </>
            ) : (
              "Lưu cập nhật"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditUserModal;
