import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { authApi } from '../../api/auth';

interface AdminProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function AdminProfileModal({ isOpen, onClose, onSuccess }: AdminProfileModalProps) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    role: '',
    avatarUrl: '',
  });

  useEffect(() => {
    if (isOpen) {
      setSuccess(false);
      setError('');
      fetchProfile();
    }
  }, [isOpen]);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await authApi.getMe();
      if (res.success && res.data) {
        setFormData({
          fullName: res.data.fullName || '',
          email: res.data.email || '',
          phone: res.data.phone || '',
          role: res.data.role || '',
          avatarUrl: res.data.avatarUrl || '',
        });
      }
    } catch (err) {
      console.error('Failed to fetch profile', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Chỉ chấp nhận file ảnh (JPG, PNG, GIF, WebP)');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Dung lượng ảnh tối đa 5MB');
      return;
    }

    setUploading(true);
    setError('');
    try {
      const uploadRes = await authApi.uploadAvatar(file);
      // The upload API returns { success, message, data: "url" }
      const uploadedUrl = uploadRes?.data || uploadRes?.message;
      if (uploadedUrl && typeof uploadedUrl === 'string' && uploadedUrl.startsWith('http')) {
        setFormData(prev => ({ ...prev, avatarUrl: uploadedUrl }));
        // Auto-save avatar to backend immediately
        try {
          await authApi.updateProfile({ avatarUrl: uploadedUrl });
          localStorage.setItem('userAvatar', uploadedUrl);
        } catch { /* silent - will be saved when user clicks Lưu */ }
      } else {
        setError('Upload ảnh thất bại. Vui lòng thử lại.');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Upload ảnh thất bại. Vui lòng thử lại.');
    } finally {
      setUploading(false);
      // Reset file input
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.fullName.trim()) {
      setError('Họ và tên không được để trống');
      return;
    }

    setSaving(true);
    try {
      const res = await authApi.updateProfile({
        fullName: formData.fullName.trim(),
        phone: formData.phone ? formData.phone.trim() : '',
        avatarUrl: formData.avatarUrl || '',
      });
      if (res.success) {
        // Update localStorage for TopBar sync
        if (res.data?.fullName) localStorage.setItem('userName', res.data.fullName);
        if (res.data?.avatarUrl) {
          localStorage.setItem('userAvatar', res.data.avatarUrl);
        } else {
          localStorage.removeItem('userAvatar');
        }
        setSuccess(true);
        setTimeout(() => {
          onClose();
          onSuccess?.();
        }, 1200);
      } else {
        setError(res.message || 'Cập nhật hồ sơ thất bại');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const roleLabel = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'Quản trị viên hệ thống';
      case 'CLINIC_MANAGER': return 'Quản lý phòng khám';
      case 'DOCTOR': return 'Bác sĩ';
      case 'PATIENT': return 'Bệnh nhân';
      default: return role;
    }
  };

  if (!isOpen) return null;

  const avatarPresets = [
    'https://api.dicebear.com/7.x/micah/svg?seed=Admin&backgroundColor=b6e3f4',
    'https://api.dicebear.com/7.x/micah/svg?seed=Manager&backgroundColor=ffdfbf',
    'https://api.dicebear.com/7.x/micah/svg?seed=System&backgroundColor=c0aede',
    'https://api.dicebear.com/7.x/micah/svg?seed=Super&backgroundColor=ffd5dc',
    'https://api.dicebear.com/7.x/micah/svg?seed=Root&backgroundColor=d1d4f9',
    'https://api.dicebear.com/7.x/micah/svg?seed=Chief&backgroundColor=c2f5e0',
  ];

  const currentAvatar = formData.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.fullName || 'Admin')}&background=3b82f6&color=fff`;

  const inputClass = "w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-slate-400";

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 font-display">
      <div className="absolute inset-0 bg-slate-900/10 backdrop-blur-[2px] transition-all duration-300" onClick={onClose} />
      
      <div className="relative bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-300 border border-slate-200 dark:border-slate-800 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 pb-0 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>person</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Hồ sơ cá nhân</h3>
                <p className="text-xs text-slate-500">Quản lý thông tin tài khoản của bạn</p>
              </div>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center transition-colors">
              <span className="material-symbols-outlined text-slate-400 text-lg">close</span>
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="p-12 flex flex-col items-center gap-4">
            <div className="w-10 h-10 border-3 border-primary/20 border-t-primary rounded-full animate-spin" />
            <p className="text-sm text-slate-500 font-medium">Đang tải thông tin...</p>
          </div>
        ) : success ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-emerald-500 text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
            </div>
            <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Cập nhật thành công!</h4>
            <p className="text-sm text-slate-500">Hồ sơ cá nhân đã được cập nhật.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto custom-scrollbar">
            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/30 rounded-xl flex items-center gap-2">
                <span className="material-symbols-outlined text-red-500 text-lg shrink-0">error</span>
                <span className="text-sm text-red-600 dark:text-red-400 font-medium">{error}</span>
              </div>
            )}

            {/* Avatar Section */}
            <div className="flex flex-col items-center gap-4">
              {/* Avatar Preview */}
              <div className="relative group">
                <div className="w-24 h-24 rounded-full border-4 border-primary/20 bg-primary/5 overflow-hidden shadow-lg shadow-primary/10">
                  <img
                    key={currentAvatar}
                    src={currentAvatar}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.fullName || 'A')}&background=3b82f6&color=fff`;
                    }}
                  />
                </div>
                {/* Upload overlay on hover */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="absolute inset-0 w-24 h-24 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                >
                  {uploading ? (
                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <span className="material-symbols-outlined text-white text-2xl">photo_camera</span>
                  )}
                </button>
              </div>

              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
              />

              {/* Upload button */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-xl text-xs font-bold hover:bg-primary/20 transition-all disabled:opacity-50"
              >
                {uploading ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                    Đang tải lên...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-sm">upload</span>
                    Tải ảnh lên
                  </>
                )}
              </button>
              <p className="text-[11px] text-slate-400 -mt-2">JPG, PNG, WebP • Tối đa 5MB</p>

              {/* Avatar Presets */}
              <div className="flex flex-wrap justify-center gap-2">
                {avatarPresets.map((url, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, avatarUrl: url }))}
                    className={`w-9 h-9 rounded-full overflow-hidden border-2 transition-all hover:scale-110 ${
                      formData.avatarUrl === url ? 'border-primary shadow-md shadow-primary/30 scale-110' : 'border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <img src={url} alt={`Preset ${idx}`} className="w-full h-full bg-slate-100 object-cover" />
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, avatarUrl: '' }))}
                  className="h-9 px-3 rounded-full border border-slate-200 dark:border-slate-700 text-[11px] font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-center"
                >
                  Mặc định
                </button>
              </div>
            </div>

            {/* Role Badge */}
            <div className="flex items-center justify-center">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-xs font-bold">
                <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
                {roleLabel(formData.role)}
              </span>
            </div>

            {/* Full Name */}
            <div>
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 block">
                Họ và tên <span className="text-red-500">*</span>
              </label>
              <input
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Nhập họ và tên"
                required
                className={inputClass}
              />
            </div>

            {/* Email (read-only) */}
            <div>
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 block">Email</label>
              <input
                value={formData.email}
                readOnly
                className="w-full px-4 py-2.5 bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-500 dark:text-slate-400 cursor-not-allowed"
              />
              <p className="text-[11px] text-slate-400 mt-1 ml-1">Email không thể thay đổi</p>
            </div>

            {/* Phone */}
            <div>
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 block">Số điện thoại</label>
              <input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Nhập số điện thoại"
                className={inputClass}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={onClose} className="flex-1 py-2.5 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-xl text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
                Hủy
              </button>
              <button
                type="submit"
                disabled={saving || uploading || !formData.fullName.trim()}
                className="flex-1 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
              >
                {saving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Đang lưu...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-base">save</span>
                    Lưu thay đổi
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>,
    document.body
  );
}
