import { useState, useEffect, useRef } from 'react';
import { clinicApi } from '../api/clinic';
import Toast from '../components/ui/Toast';
import ClinicSidebar from '../components/common/ClinicSidebar';
import TopBar from '../components/common/TopBar';
import ChangePasswordModal from '../components/common/ChangePasswordModal';

export default function ClinicSettings() {
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [notifications, setNotifications] = useState<any[]>([]);
    const currentClinicId = localStorage.getItem('clinicId') || '1';
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);

    // Clinic Data State
    const [clinicData, setClinicData] = useState({
        name: '',
        address: '',
        phone: '',
        imageUrl: '',
        clinicCode: '',
        status: ''
    });

    // Toast State
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState<'success' | 'error' | 'warning'>('success');

    useEffect(() => {
        const fetchClinicProfile = async () => {
            setIsLoading(true);
            try {
                const res = await clinicApi.getProfile(currentClinicId);
                if (res.success) {
                    setClinicData(res.data);
                }
            } catch (error) {
                console.error('Failed to fetch clinic profile:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchClinicProfile();
    }, [currentClinicId]);

    const handleSaveProfile = async (e?: React.FormEvent | React.MouseEvent) => {
        if (e) {
            e.preventDefault();
        }
        setIsSaving(true);
        try {
            const res = await clinicApi.updateProfile(currentClinicId, {
                name: clinicData.name,
                address: clinicData.address,
                phone: clinicData.phone,
                imageUrl: clinicData.imageUrl
            });
            if (res.success) {
                localStorage.setItem('cachedClinicName', clinicData.name || '');
                localStorage.setItem('cachedClinicLogo', clinicData.imageUrl || '');
                window.dispatchEvent(new Event('clinicProfileUpdated'));
                
                setToastMessage('Cập nhật thông tin phòng khám thành công');
                setToastType('success');
                setShowToast(true);
            }
        } catch (error) {
            console.error('Failed to update clinic profile:', error);
            setToastMessage('Lỗi khi cập nhật thông tin');
            setToastType('error');
            setShowToast(true);
        } finally {
            setIsSaving(false);
        }
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        try {
            const res = await clinicApi.uploadFile(file);
            if (res.success && res.data) {
                setClinicData({ ...clinicData, imageUrl: res.data });
                setToastMessage('Đã tải ảnh lên thành công, hãy bấm Lưu để áp dụng');
                setToastType('success');
                setShowToast(true);
            }
        } catch (error) {
            console.error('Upload failed:', error);
            setToastMessage('Lỗi khi tải ảnh lên');
            setToastType('error');
            setShowToast(true);
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };


    return (
        <div className="flex min-h-screen font-display bg-[#f6f8f7] dark:bg-slate-950 text-slate-900 dark:text-slate-100 italic-none">
            <ClinicSidebar
                isSidebarOpen={isSidebarOpen}
                isLoading={isLoading}
            />

            <main className="flex-1 lg:ml-72 min-h-screen flex flex-col transition-all duration-300">
                {isSidebarOpen && (
                    <div
                        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[140] lg:hidden animate-in fade-in duration-300"
                        onClick={() => setIsSidebarOpen(false)}
                    ></div>
                )}

                <TopBar
                    setIsSidebarOpen={setIsSidebarOpen}
                    notifications={notifications}
                    setNotifications={setNotifications}
                />

                <div className="p-4 md:p-8 space-y-6 md:space-y-8 max-w-6xl mx-auto w-full animate-in fade-in duration-700">

                    {/* Unified Top Header Area */}
                    <div className="bg-white dark:bg-slate-900 p-4 md:p-8 rounded-3xl shadow-sm border border-primary/5 relative overflow-hidden group text-left">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                            {isLoading ? (
                                <div className="space-y-3">
                                    <div className="h-8 bg-slate-200 dark:bg-slate-800 animate-pulse rounded w-48 sm:w-64"></div>
                                    <div className="h-4 bg-slate-100 dark:bg-slate-800/50 animate-pulse rounded w-64 sm:w-96"></div>
                                </div>
                            ) : (
                                <div>
                                    <h2 className="text-lg md:text-2xl font-black tracking-tighter text-slate-900 dark:text-white leading-tight">Cấu hình phòng khám</h2>
                                    <p className="text-[13px] md:text-[16px] text-slate-500 mt-2 font-medium italic-none">Quản lý thông tin chung, nhận diện thương hiệu và bảo mật tài khoản</p>
                                </div>
                            )}

                            {isLoading ? (
                                <div className="w-48 h-12 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-xl shadow-lg shadow-emerald-500/5"></div>
                            ) : (
                                <button
                                    onClick={handleSaveProfile}
                                    disabled={isSaving}
                                    className={`px-6 py-2.5 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 hover:bg-emerald-500 hover:text-white rounded-full font-medium transition-all text-[14px] flex items-center gap-2 whitespace-nowrap shadow-lg shadow-emerald-500/5 hover:shadow-emerald-500/20 ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    <span className={`material-symbols-outlined font-medium text-[20px] ${isSaving ? 'animate-spin' : ''}`}>
                                        {isSaving ? 'progress_activity' : 'cloud_sync'}
                                    </span>
                                    {isSaving ? 'Đang lưu...' : 'Lưu thay đổi ngay'}
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 italic-none items-start">
                        {/* Profile Photo Section - Premium Redesign */}
                        <div className="lg:col-span-4 space-y-6">
                            <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-[40px] shadow-sm overflow-hidden group">
                                {/* Header Decorative Background */}
                                <div className="h-24 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent relative">
                                    <div className="absolute top-4 right-6 w-12 h-12 bg-white/40 dark:bg-white/5 backdrop-blur-md rounded-full border border-white/20"></div>
                                </div>

                                <div className="px-8 pb-8 -mt-12 flex flex-col items-center text-center">
                                    {/* Avatar with Ring & Upload Button */}
                                    <div className="flex flex-col items-center gap-4 mb-8">
                                        <div className="relative group">
                                            <div className="w-24 h-24 rounded-full border-4 border-primary/20 bg-primary/5 overflow-hidden shadow-lg shadow-primary/10">
                                                <img
                                                    src={clinicData.imageUrl || 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=200'}
                                                    className="w-full h-full object-cover"
                                                    alt="Clinic Logo"
                                                />
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => fileInputRef.current?.click()}
                                                disabled={isUploading}
                                                className="absolute inset-0 w-24 h-24 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                            >
                                                {isUploading ? (
                                                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                ) : (
                                                    <span className="material-symbols-outlined text-white text-2xl">photo_camera</span>
                                                )}
                                            </button>
                                        </div>

                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            onChange={handleFileChange}
                                            className="hidden"
                                            accept="image/*"
                                        />

                                        <button
                                            type="button"
                                            onClick={() => fileInputRef.current?.click()}
                                            disabled={isUploading}
                                            className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-xl text-[13px] font-bold hover:bg-primary/20 transition-all disabled:opacity-50"
                                        >
                                            {isUploading ? (
                                                <>
                                                    <div className="w-3.5 h-3.5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                                                    Đang tải lên...
                                                </>
                                            ) : (
                                                <>
                                                    <span className="material-symbols-outlined text-[16px]">upload</span>
                                                    Tải ảnh lên
                                                </>
                                            )}
                                        </button>
                                        <p className="text-[11px] text-slate-400 -mt-2">JPG, PNG, WebP • Tối đa 5MB</p>

                                        <div className="flex flex-wrap justify-center gap-2 mt-2">
                                            {[
                                                'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=200',
                                                'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&q=80&w=200',
                                                'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=200',
                                                'https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&q=80&w=200',
                                                'https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&q=80&w=200',
                                            ].map((url, idx) => (
                                                <button
                                                    key={idx}
                                                    type="button"
                                                    onClick={() => setClinicData(prev => ({ ...prev, imageUrl: url }))}
                                                    className={`w-8 h-8 rounded-full overflow-hidden border-2 transition-all hover:scale-110 ${
                                                        clinicData.imageUrl === url ? 'border-primary shadow-md shadow-primary/30 scale-110' : 'border-slate-200 dark:border-slate-700'
                                                    }`}
                                                >
                                                    <img src={url} alt={`Preset ${idx}`} className="w-full h-full object-cover bg-slate-100" />
                                                </button>
                                            ))}
                                            <button
                                                type="button"
                                                onClick={() => setClinicData(prev => ({ ...prev, imageUrl: '' }))}
                                                className="h-8 px-3 rounded-full border border-slate-200 dark:border-slate-700 text-[11px] font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-center"
                                            >
                                                Mặc định
                                            </button>
                                        </div>
                                    </div>

                                    {/* Name & Code */}
                                    <div className="space-y-2 mb-8 w-full">
                                        <h4 className="text-[17px] md:text-[20px] font-bold text-slate-900 dark:text-white leading-tight">{clinicData.name || 'Tên phòng khám'}</h4>
                                        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-50 dark:bg-slate-800/50 rounded-full border border-slate-100 dark:border-slate-800">
                                            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                                            <span className="text-[12px] font-bold text-slate-500 uppercase tracking-widest">{clinicData.clinicCode || 'CL-0000'}</span>
                                        </div>
                                    </div>

                                    {/* Status Cards */}
                                    <div className="w-full space-y-3">
                                        <div className="flex items-center justify-between p-4 bg-emerald-50/40 dark:bg-emerald-500/5 border border-emerald-100/50 dark:border-emerald-500/10 rounded-2xl transition-all hover:bg-emerald-50/60">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 border border-emerald-100 dark:border-emerald-500/20 flex items-center justify-center text-emerald-500">
                                                    <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                                                </div>
                                                <div className="text-left">
                                                    <p className="text-[11px] font-bold text-emerald-600/60 uppercase tracking-wider">Trạng thái</p>
                                                    <p className="text-[14px] font-bold text-emerald-700 dark:text-emerald-400">
                                                        {clinicData.status === 'ACTIVE' ? 'Hoạt động' : 'Tạm ngừng'}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between p-4 bg-blue-50/40 dark:bg-blue-500/5 border border-blue-100/50 dark:border-blue-500/10 rounded-2xl transition-all hover:bg-blue-50/60">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 border border-blue-100 dark:border-blue-500/20 flex items-center justify-center text-blue-500">
                                                    <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                                                </div>
                                                <div className="text-left">
                                                    <p className="text-[11px] font-bold text-blue-600/60 uppercase tracking-wider">Xác thực</p>
                                                    <p className="text-[14px] font-bold text-blue-700 dark:text-blue-400">Đã xác minh</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Profile Settings Form */}
                        <div className="lg:col-span-8">
                            <form onSubmit={handleSaveProfile} className="bg-white dark:bg-slate-900 rounded-[32px] p-6 md:p-10 border border-slate-200/60 dark:border-slate-800/80 shadow-sm space-y-6 md:space-y-8">
                                <div className="space-y-6">
                                    <h4 className="text-base md:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-3">
                                        <span className="material-symbols-outlined text-primary text-[22px]">info</span>
                                        Thông tin cơ bản
                                    </h4>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[14px] font-bold text-slate-900/80 dark:text-slate-200 ml-1">Tên Phòng khám</label>
                                            <div className="relative group/input">
                                                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/input:text-primary transition-colors text-[20px]">home_health</span>
                                                <input
                                                    type="text"
                                                    className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[18px] text-[14px] font-semibold text-slate-700 dark:text-slate-200 focus:ring-4 focus:ring-primary/5 focus:border-primary/50 outline-none transition-all shadow-sm"
                                                    value={clinicData.name}
                                                    onChange={e => setClinicData({ ...clinicData, name: e.target.value })}
                                                    placeholder="Nhập tên phòng khám"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[14px] font-bold text-slate-900/80 dark:text-slate-200 ml-1">Số điện thoại</label>
                                            <div className="relative group/input">
                                                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/input:text-primary transition-colors text-[20px]">call</span>
                                                <input
                                                    type="text"
                                                    className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[18px] text-[14px] font-semibold text-slate-700 dark:text-slate-200 focus:ring-4 focus:ring-primary/5 focus:border-primary/50 outline-none transition-all shadow-sm"
                                                    value={clinicData.phone}
                                                    onChange={e => setClinicData({ ...clinicData, phone: e.target.value })}
                                                    placeholder="Số điện thoại liên hệ"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2 md:col-span-2">
                                            <label className="text-[14px] font-bold text-slate-900/80 dark:text-slate-200 ml-1">Địa chỉ chi tiết</label>
                                            <div className="relative group/input">
                                                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/input:text-primary transition-colors text-[20px]">location_on</span>
                                                <input
                                                    type="text"
                                                    className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[18px] text-[14px] font-semibold text-slate-700 dark:text-slate-200 focus:ring-4 focus:ring-primary/5 focus:border-primary/50 outline-none transition-all shadow-sm"
                                                    value={clinicData.address}
                                                    onChange={e => setClinicData({ ...clinicData, address: e.target.value })}
                                                    placeholder="Số nhà, tên đường, Phường/Xã, Quận/Huyện, Tỉnh/Thành phố"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </form>
                            
                            {/* Account Security */}
                            <section className="bg-white dark:bg-slate-900 p-4 md:p-8 rounded-3xl border border-primary/5 shadow-sm mt-6 md:mt-8 text-left">
                                <div className="flex items-center gap-4 border-l-4 border-l-emerald-500 pl-4 mb-6">
                                    <h3 className="text-[19px] font-black tracking-tight text-slate-900 dark:text-white">Bảo mật tài khoản</h3>
                                </div>
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 md:p-5 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700/50">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center">
                                            <span className="material-symbols-outlined text-emerald-600 text-xl">lock_reset</span>
                                        </div>
                                        <div>
                                            <p className="text-[15px] font-bold text-slate-900 dark:text-slate-100 mb-0.5">Mật khẩu đăng nhập</p>
                                            <p className="text-[13.5px] font-medium text-slate-500">Thay đổi mật khẩu định kỳ để bảo vệ tài khoản quản trị</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setIsChangePasswordOpen(true)}
                                        className="px-5 py-2.5 text-[14px] font-bold text-emerald-600 bg-white dark:bg-slate-900 border border-emerald-500/20 rounded-xl hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all shadow-sm"
                                    >
                                        Đổi mật khẩu
                                    </button>
                                </div>
                            </section>
                        </div>
                    </div>
                </div>

                <ChangePasswordModal
                    isOpen={isChangePasswordOpen}
                    onClose={() => setIsChangePasswordOpen(false)}
                    onSuccess={() => {
                        setToastMessage('Đổi mật khẩu thành công!');
                        setToastType('success');
                        setShowToast(true);
                    }}
                />

                <Toast
                    show={showToast}
                    title={toastMessage}
                    type={toastType}
                    onClose={() => setShowToast(false)}
                />
            </main>
        </div>
    );
}
