import { useState, useEffect } from 'react';
import ClinicSidebar from '../components/common/ClinicSidebar';
import TopBar from '../components/common/TopBar';
import { clinicApi } from '../api/clinic';
import Toast from '../components/ui/Toast';

export default function ClinicSettings() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [notifications, setNotifications] = useState<any[]>([]);
    const currentClinicId = localStorage.getItem('clinicId') || '1';

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

    const handleSaveProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const res = await clinicApi.updateProfile(currentClinicId, {
                name: clinicData.name,
                address: clinicData.address,
                phone: clinicData.phone,
                imageUrl: clinicData.imageUrl
            });
            if (res.success) {
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

    return (
        <div className="flex min-h-screen font-display bg-[#f6f8f7] dark:bg-slate-950 text-slate-900 dark:text-slate-100 italic-none">
            <ClinicSidebar
                isSidebarOpen={isSidebarOpen}
                userName="Admin Sarah"
                userRole="Senior Manager"
                userAvatar="https://lh3.googleusercontent.com/aida-public/AB6AXuDs9fuTZde7EUIINhAwZDAYbGdWhfZuvszHFDZODEHBxXo3hRWmKfCmGfg6Xgckf0DONyYs8LQEOXng1sISGQVj9ec2pSs--Gz-xPlj6elGIG3KtZTO9U-57mPPcUxuNMtJbLamHmXAsWrVwobD4Ai-pKgNGU0yfv596RmDCRUawQMx8gmW7E2J_we-R_YITLa95pCcbtDZf6tkb7C6bWKKzwepNG2pc4L5uji1KMHQetqk8390TVAlxrRao3qco3laKWLu0uA-BmQ"
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

                <div className="p-8 space-y-8 max-w-5xl mx-auto w-full">


                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 italic-none">
                        {/* Profile Photo Section */}
                        <div className="lg:col-span-4 space-y-6">
                            <div className="bg-white dark:bg-slate-900 p-8 rounded-[32px] border border-slate-200/60 dark:border-slate-800/80 shadow-sm flex flex-col items-center text-center group">
                                <div className="relative mb-6">
                                    <div className="w-32 h-32 rounded-[40px] bg-primary/10 p-1 group-hover:bg-primary/20 transition-all duration-500">
                                        <img
                                            src={clinicData.imageUrl || 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=200'}
                                            className="w-full h-full object-cover rounded-[36px] shadow-lg"
                                            alt="Clinic Logo"
                                        />
                                    </div>
                                    <button className="absolute -bottom-2 -right-2 w-10 h-10 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl flex items-center justify-center text-primary shadow-lg hover:scale-110 active:scale-95 transition-all">
                                        <span className="material-symbols-outlined text-[20px]">photo_camera</span>
                                    </button>
                                </div>
                                <div>
                                    <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-1 group-hover:text-primary transition-colors">{clinicData.name || 'Tên phòng khám'}</h4>
                                    <p className="text-[13px] font-black text-primary bg-primary/5 px-3 py-1 rounded-full uppercase tracking-wider">{clinicData.clinicCode || 'CL-0000'}</p>
                                </div>
                                <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800 w-full grid grid-cols-2 gap-4">
                                    <div className="text-center">
                                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">Trạng thái</p>
                                        <span className={`text-[12px] font-black px-2 py-0.5 rounded-md ${clinicData.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-slate-500/10 text-slate-500'}`}>
                                            {clinicData.status === 'ACTIVE' ? 'HOẠT ĐỘNG' : 'TẠM NGỪNG'}
                                        </span>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">Xác thực</p>
                                        <div className="flex items-center justify-center gap-1 text-blue-500 font-bold text-[12px]">
                                            <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
                                            ĐÃ XÁC MINH
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Profile Settings Form */}
                        <div className="lg:col-span-8">
                            <form onSubmit={handleSaveProfile} className="bg-white dark:bg-slate-900 rounded-[32px] p-8 md:p-10 border border-slate-200/60 dark:border-slate-800/80 shadow-sm space-y-8">
                                <div className="space-y-6">
                                    <h4 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-3">
                                        <span className="w-1.5 h-6 bg-primary rounded-full"></span>
                                        Thông tin cơ bản
                                    </h4>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[14px] font-bold text-slate-600 dark:text-slate-400 ml-1">Tên Phòng khám</label>
                                            <div className="relative">
                                                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">home_health</span>
                                                <input
                                                    type="text"
                                                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl text-[14px] font-medium focus:ring-4 focus:ring-primary/5 focus:border-primary outline-none transition-all"
                                                    value={clinicData.name}
                                                    onChange={e => setClinicData({ ...clinicData, name: e.target.value })}
                                                    placeholder="Nhập tên phòng khám"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[14px] font-bold text-slate-600 dark:text-slate-400 ml-1">Số điện thoại</label>
                                            <div className="relative">
                                                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">call</span>
                                                <input
                                                    type="text"
                                                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl text-[14px] font-medium focus:ring-4 focus:ring-primary/5 focus:border-primary outline-none transition-all"
                                                    value={clinicData.phone}
                                                    onChange={e => setClinicData({ ...clinicData, phone: e.target.value })}
                                                    placeholder="Số điện thoại liên hệ"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2 md:col-span-2">
                                            <label className="text-[14px] font-bold text-slate-600 dark:text-slate-400 ml-1">Địa chỉ chi tiết</label>
                                            <div className="relative">
                                                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">location_on</span>
                                                <input
                                                    type="text"
                                                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl text-[14px] font-medium focus:ring-4 focus:ring-primary/5 focus:border-primary outline-none transition-all"
                                                    value={clinicData.address}
                                                    onChange={e => setClinicData({ ...clinicData, address: e.target.value })}
                                                    placeholder="Số nhà, tên đường, Phường/Xã, Quận/Huyện, Tỉnh/Thành phố"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6 pt-6 border-t border-slate-100 dark:border-slate-800">
                                    <h4 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-3">
                                        <span className="w-1.5 h-6 bg-blue-500 rounded-full"></span>
                                        Liên kết hình ảnh
                                    </h4>
                                    <div className="space-y-2">
                                        <label className="text-[14px] font-bold text-slate-600 dark:text-slate-400 ml-1">Logo URL (Preview)</label>
                                        <div className="relative">
                                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">link</span>
                                            <input
                                                type="text"
                                                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl text-[14px] font-medium focus:ring-4 focus:ring-primary/5 focus:border-primary outline-none transition-all"
                                                value={clinicData.imageUrl}
                                                onChange={e => setClinicData({ ...clinicData, imageUrl: e.target.value })}
                                                placeholder="https://example.com/logo.png"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-6 flex flex-col md:flex-row gap-4">
                                    <button
                                        type="submit"
                                        disabled={isSaving || isLoading}
                                        className="flex-1 px-8 py-4 bg-primary text-white rounded-2xl font-black text-[16px] shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-3"
                                    >
                                        {isSaving ? (
                                            <div className="w-6 h-6 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
                                        ) : (
                                            <>
                                                <span className="material-symbols-outlined">save</span>
                                                Lưu thay đổi Cấu hình
                                            </>
                                        )}
                                    </button>
                                    <button
                                        type="button"
                                        className="px-8 py-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-2xl font-bold text-[16px] hover:bg-slate-200 dark:hover:bg-slate-700 transition-all active:scale-95"
                                    >
                                        Hủy bỏ
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

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
