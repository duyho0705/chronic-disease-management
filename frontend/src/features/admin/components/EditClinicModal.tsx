import React, { useEffect, useState } from 'react';

interface EditClinicModalProps {
  isOpen: boolean;
  onClose: () => void;
  clinic: any;
  isSaving: boolean;
  onSave: (clinicData: any) => Promise<void>;
}

const EditClinicModal: React.FC<EditClinicModalProps> = ({
  isOpen,
  onClose,
  clinic,
  isSaving,
  onSave,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    clinicCode: '',
    adminFullName: 'Quản lý hiện tại', // Assuming we don't always edit admin account here but maybe just clinic info
    adminEmail: 'admin@clinic.com',
    status: 'ACTIVE',
    imageUrl: '',
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && clinic) {
      setFormData({
        name: clinic.name || '',
        address: clinic.address || '',
        phone: clinic.phone || '',
        clinicCode: clinic.id || '', // or whatever code
        adminFullName: clinic.adminFullName || 'Nguyễn Văn Quản Lý',
        adminEmail: clinic.adminEmail || 'admin.clinic@vitality.com',
        status: clinic.status === 'Hoạt động' ? 'ACTIVE' : 'INACTIVE',
        imageUrl: clinic.image || '',
      });
    }
  }, [isOpen, clinic]);

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
    if (!formData.name) errors.name = 'Vui lòng nhập tên phòng khám';
    if (!formData.address) errors.address = 'Vui lòng nhập địa chỉ';
    if (!formData.phone) errors.phone = 'Vui lòng nhập số điện thoại';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSave({ ...clinic, ...formData });
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] transition-all duration-300"
        onClick={onClose}
      ></div>

      <div className="relative bg-white dark:bg-slate-900 w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in duration-300 border border-primary/10 transition-all max-h-[92vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900 sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <div className="bg-[#3bb9f3]/10 p-2.5 rounded-xl text-[#3bb9f3] flex items-center justify-center">
              <span className="material-symbols-outlined font-bold">edit_note</span>
            </div>
            <div>
              <h2 className="text-[20px] font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">Chỉnh sửa phòng khám</h2>
            </div>
          </div>
        </div>

        {/* Form Content */}
        <div className="p-6 md:p-8 space-y-8 overflow-y-auto custom-scrollbar flex-1 bg-white dark:bg-slate-900 text-left">

          {/* Avatar Section */}
          <div className="flex flex-col items-center mb-8 relative group">
            <div className="relative w-28 h-28 rounded-2xl overflow-hidden border-4 border-white dark:border-slate-800 shadow-xl group-hover:shadow-amber-500/20 transition-all duration-300">
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
            <p className="text-[16px] font-bold text-slate-500 mt-3">Ảnh đại diện phòng khám</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Left: Clinic Info */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 pb-2 border-primary/10 pl-1 border-l-4 border-l-amber-500">
                <h3 className="font-extrabold text-slate-900 dark:text-slate-100 text-sm tracking-wide">Thông tin cơ sở</h3>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[13px] font-bold text-slate-500 ml-1">Tên phòng khám</label>
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-4 py-2.5 rounded-xl border-2 ${formErrors.name ? 'border-red-500/50' : 'border-slate-50 dark:border-slate-800'} bg-slate-50 dark:bg-slate-800/40 text-[14px] font-medium transition-all outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/5 shadow-sm`}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[13px] font-bold text-slate-500 ml-1">Mã định danh</label>
                    <input
                      readOnly
                      value={formData.clinicCode}
                      className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-50 dark:border-slate-800 bg-slate-100 dark:bg-slate-800/20 text-[14px] font-bold text-slate-400 outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[13px] font-bold text-slate-500 ml-1">Số điện thoại</label>
                    <input
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`w-full px-4 py-2.5 rounded-xl border-2 ${formErrors.phone ? 'border-red-500/50' : 'border-slate-50 dark:border-slate-800'} bg-slate-50 dark:bg-slate-800/40 text-[14px] font-medium transition-all outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/5 shadow-sm`}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[13px] font-bold text-slate-500 ml-1">Địa chỉ</label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    rows={3}
                    className={`w-full px-4 py-2.5 rounded-xl border-2 ${formErrors.address ? 'border-red-500/50' : 'border-slate-50 dark:border-slate-800'} bg-slate-50 dark:bg-slate-800/40 text-[14px] font-medium transition-all outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/5 resize-none shadow-sm`}
                  />
                </div>
              </div>
            </div>

            {/* Right: Admin & Status */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 pb-2 border-emerald-500/10 pl-1 border-l-4 border-l-emerald-500">
                <h3 className="font-extrabold text-slate-900 dark:text-slate-100 text-sm tracking-wide">Trạng thái & Quản trị</h3>
              </div>

              <div className="p-6 bg-slate-50/50 dark:bg-slate-800/30 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-6">
                <div className="space-y-2">
                  <label className="text-[13px] font-bold text-slate-500 ml-1">Trạng thái hoạt động</label>
                  <div className="flex gap-2">
                    {['ACTIVE', 'INACTIVE'].map((status) => (
                      <button
                        key={status}
                        type="button"
                        onClick={() => setFormData({ ...formData, status })}
                        className={`flex-1 py-2.5 rounded-xl border-2 font-bold text-sm transition-all ${formData.status === status
                          ? status === 'ACTIVE'
                            ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                            : 'bg-red-500 border-red-500 text-white shadow-lg shadow-red-500/20'
                          : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-400 hover:border-slate-200'
                          }`}
                      >
                        {status === 'ACTIVE' ? 'Hoạt động' : 'Ngưng hoạt động'}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4 pt-2">
                  <div className="space-y-1.5">
                    <label className="text-[13px] font-bold text-slate-500 ml-1">Email phòng khám</label>
                    <input
                      name="adminEmail"
                      value={formData.adminEmail}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-50 dark:border-slate-800 bg-white dark:bg-slate-900 text-[14px] font-medium transition-all outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 shadow-sm"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[13px] font-bold text-slate-500 ml-1">Người quản lý phòng khám</label>
                    <input
                      name="adminFullName"
                      value={formData.adminFullName}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-50 dark:border-slate-800 bg-white dark:bg-slate-900 text-[14px] font-medium transition-all outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 shadow-sm"
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
            className="px-6 py-2.5 text-sm font-bold text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"
            type="button"
          >
            Hủy bỏ
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSaving}
            className="px-10 py-2.5 text-sm font-extrabold text-white bg-[#3bb9f3] hover:bg-[#32a8dd] rounded-xl transition-all shadow-xl shadow-[#3bb9f3]/20 flex items-center gap-2 disabled:opacity-50"
            type="button"
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin"></div>
                Đang lưu...
              </>
            ) : (
              <>
                Cập nhật thay đổi
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditClinicModal;
