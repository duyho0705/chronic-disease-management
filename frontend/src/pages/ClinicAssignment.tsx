import { useState, useEffect } from 'react';
import { clinicApi } from '../api/clinic';
import ClinicSidebar from '../components/common/ClinicSidebar';
import TopBar from '../components/common/TopBar';
import Toast from '../components/ui/Toast';
import Dropdown from '../components/ui/Dropdown';

export default function ClinicAssignment() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [notifications, setNotifications] = useState<any[]>([]);
    const currentClinicId = localStorage.getItem('clinicId') || '1';

    // Data States
    const [unassignedPatients, setUnassignedPatients] = useState<any[]>([]);
    const [availableDoctors, setAvailableDoctors] = useState<any[]>([]);
    const [selectedPatient, setSelectedPatient] = useState<any>(null);
    const [searchTerm, setSearchTerm] = useState('');

    // Form States
    const [formData, setFormData] = useState({
        patientName: '',
        contactNumber: '',
        emailAddress: '',
        address: '',
        assignmentDate: '',
        assignmentTime: '',
        procedure: '',
        doctorId: ''
    });

    // Toast State
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState<'success' | 'error' | 'warning'>('success');

    useEffect(() => {
        fetchInitialData();
    }, [currentClinicId]);

    const fetchInitialData = async () => {
        setIsLoading(true);
        try {
            const [patientsRes, doctorsRes] = await Promise.all([
                clinicApi.getPatients(currentClinicId, { size: 100 }),
                clinicApi.getAvailableDoctors(currentClinicId)
            ]);

            if (patientsRes.success) {
                setUnassignedPatients(patientsRes.data.content || []);
            }
            if (doctorsRes.success) {
                setAvailableDoctors(doctorsRes.data);
            }
        } catch (error) {
            console.error('Failed to fetch assignment data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSelectPatient = (patient: any) => {
        setSelectedPatient(patient);
        setFormData({
            ...formData,
            patientName: patient.name || '',
            contactNumber: patient.phone || '',
            emailAddress: patient.email || '',
            address: patient.address || '',
            doctorId: patient.doctorId || ''
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedPatient || !formData.doctorId) {
            setToastMessage('Vui lòng chọn bệnh nhân và bác sĩ');
            setToastType('warning');
            setShowToast(true);
            return;
        }

        setIsSubmitting(true);
        try {
            const res = await clinicApi.updatePatient(currentClinicId, selectedPatient.dbId || selectedPatient.id, {
                ...selectedPatient,
                doctorId: formData.doctorId
            });

            if (res.success) {
                setToastMessage(`Đã gán bệnh nhân ${formData.patientName} cho bác sĩ thành công!`);
                setToastType('success');
                setShowToast(true);
                fetchInitialData();
                setSelectedPatient(null);
                setFormData({
                    patientName: '',
                    contactNumber: '',
                    emailAddress: '',
                    address: '',
                    assignmentDate: '',
                    assignmentTime: '',
                    procedure: '',
                    doctorId: ''
                });
            }
        } catch (error) {
            console.error('Submit failed:', error);
            setToastMessage('Lỗi khi thực hiện gán bệnh nhân');
            setToastType('error');
            setShowToast(true);
        } finally {
            setIsSubmitting(false);
        }
    };

    const filteredPatients = unassignedPatients.filter(p =>
        p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.phone?.includes(searchTerm)
    );

    // Options for Custom Dropdowns
    const procedureOptions = [
        { label: 'Chọn quy trình', value: '' },
        { label: 'Điều trị Tiểu đường Type 1', value: 'T1' },
        { label: 'Điều trị Tiểu đường Type 2', value: 'T2' },
        { label: 'Quản lý Huyết áp Cao', value: 'HA' },
        { label: 'Theo dõi Tim mạch', value: 'TM' }
    ];

    const doctorOptions = [
        { label: 'Chọn Bác sĩ phụ trách', value: '' },
        ...availableDoctors.map(dr => ({
            label: `${dr.name} - ${dr.specialty}`,
            value: dr.id.toString()
        }))
    ];

    return (
        <div className="flex h-screen font-display bg-[#f6f8f7] dark:bg-slate-950 text-slate-900 dark:text-slate-100 italic-none overflow-hidden">
            <ClinicSidebar
                isSidebarOpen={isSidebarOpen}
                userName="Admin Sarah"
                userRole="Senior Manager"
                userAvatar="https://lh3.googleusercontent.com/aida-public/AB6AXuDs9fuTZde7EUIINhAwZDAYbGdWhfZuvszHFDZODEHBxXo3hRWmKfCmGfg6Xgckf0DONyYs8LQEOXng1sISGQVj9ec2pSs--Gz-xPlj6elGIG3KtZTO9U-57mPPcUxuNMtJbLamHmXAsWrVwobD4Ai-pKgNGU0yfv596RmDCRUawQMx8gmW7E2J_we-R_YITLa95pCcbtDZf6tkb7C6bWKKzwepNG2pc4L5uji1KMHQetqk8390TVAlxrRao3qco3laKWLu0uA-BmQ"
                isLoading={isLoading}
            />

            <main className="flex-1 lg:ml-72 h-screen flex flex-col transition-all duration-300 overflow-hidden">
                {isSidebarOpen && (
                    <div
                        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[140] lg:hidden"
                        onClick={() => setIsSidebarOpen(false)}
                    ></div>
                )}

                <TopBar
                    setIsSidebarOpen={setIsSidebarOpen}
                    notifications={notifications}
                    setNotifications={setNotifications}
                />

                <div className="p-8 flex-1 overflow-hidden flex flex-col space-y-6">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 flex-shrink-0">
                        <div className="space-y-1">
                            <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Hồ sơ Gán Bác sĩ Phụ trách</h3>
                            <p className="text-slate-500 font-medium">Điều phối và chỉ định nhân sự chuyên trách cho từng bệnh nhân</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start flex-1 overflow-hidden">
                        {/* Selector Column */}
                        <div className="lg:col-span-4 h-full flex flex-col overflow-hidden">
                            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 space-y-6 h-full flex flex-col">
                                <div className="space-y-4 flex-shrink-0">
                                    <h4 className="text-[17px] font-bold text-slate-700">Danh sách Chờ Điều phối</h4>
                                    <div className="relative">
                                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">search</span>
                                        <input
                                            type="text"
                                            placeholder="Tìm tên bệnh nhân..."
                                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-3">
                                    {isLoading ? (
                                        [...Array(5)].map((_, i) => (
                                            <div key={i} className="h-16 bg-slate-50 dark:bg-slate-800 rounded-2xl animate-pulse"></div>
                                        ))
                                    ) : filteredPatients.length > 0 ? (
                                        filteredPatients.map((p) => (
                                            <button
                                                key={p.dbId || p.id}
                                                onClick={() => handleSelectPatient(p)}
                                                className={`w-full flex items-center gap-3 p-3 rounded-2xl transition-all text-left ${selectedPatient?.dbId === p.dbId ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
                                            >
                                                <img src={p.img || `https://ui-avatars.com/api/?name=${encodeURIComponent(p.name)}`} className="w-10 h-10 rounded-xl object-cover border border-white/20" alt="" />
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-bold truncate">{p.name}</p>
                                                    <p className={`text-[13px] font-medium opacity-70 truncate`}>{p.condition || 'Chưa cập nhật'}</p>
                                                </div>
                                                {selectedPatient?.dbId === p.dbId && <span className="material-symbols-outlined text-[18px]">check_circle</span>}
                                            </button>
                                        ))
                                    ) : (
                                        <div className="text-center py-10 text-slate-400 italic text-sm">Không tìm thấy bệnh nhân</div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Form Column */}
                        <div className="lg:col-span-8 h-full overflow-hidden">
                            <div className="bg-white dark:bg-slate-900 rounded-[40px] p-8 md:p-12 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 relative overflow-hidden h-full flex flex-col md:flex-row gap-12">
                                <form onSubmit={handleSubmit} className="flex-1 space-y-6 relative z-10 overflow-y-auto custom-scrollbar pr-4 pb-1">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                                        <div className="col-span-2 space-y-1.5">
                                            <label className="text-[14px] font-medium text-slate-500 ml-1">Họ và tên Bệnh nhân</label>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="relative">
                                                    <input
                                                        type="text"
                                                        placeholder="Họ"
                                                        className="w-full px-4 h-[42px] rounded-lg border border-slate-400 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm text-[14px] font-medium text-slate-700 dark:text-slate-200 outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all"
                                                        value={formData.patientName.split(' ')[0] || ''}
                                                        readOnly={!!selectedPatient}
                                                    />
                                                </div>
                                                <div className="relative">
                                                    <input
                                                        type="text"
                                                        placeholder="Tên"
                                                        className="w-full px-4 h-[42px] rounded-lg border border-slate-400 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm text-[14px] font-medium text-slate-700 dark:text-slate-200 outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all"
                                                        value={formData.patientName.split(' ').slice(1).join(' ') || ''}
                                                        readOnly={!!selectedPatient}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-1.5 flex-1">
                                            <label className="text-[14px] font-medium text-slate-500 ml-1">Số điện thoại liên hệ</label>
                                            <div className="relative">
                                                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[20px] text-slate-400">call</span>
                                                <input
                                                    type="text"
                                                    placeholder="SĐT bệnh nhân"
                                                    className="w-full pl-11 pr-4 h-[42px] rounded-lg border border-slate-400 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm text-[14px] font-medium text-slate-700 dark:text-slate-200 outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all"
                                                    value={formData.contactNumber}
                                                    readOnly={!!selectedPatient}
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-1.5 flex-1">
                                            <label className="text-[14px] font-medium text-slate-500 ml-1">Địa chỉ Email</label>
                                            <div className="relative">
                                                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[20px] text-slate-400">mail</span>
                                                <input
                                                    type="email"
                                                    placeholder="email@example.com"
                                                    className="w-full pl-11 pr-4 h-[42px] rounded-lg border border-slate-400 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm text-[14px] font-medium text-slate-700 dark:text-slate-200 outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all"
                                                    value={formData.emailAddress}
                                                    readOnly={!!selectedPatient}
                                                />
                                            </div>
                                        </div>

                                        <div className="col-span-2 space-y-1.5">
                                            <label className="text-[14px] font-medium text-slate-500 ml-1">Địa chỉ cư trú</label>
                                            <div className="relative">
                                                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[20px] text-slate-400">location_on</span>
                                                <input
                                                    type="text"
                                                    placeholder="Nhập địa chỉ chi tiết"
                                                    className="w-full pl-11 pr-4 h-[42px] rounded-lg border border-slate-400 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm text-[14px] font-medium text-slate-700 dark:text-slate-200 outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all"
                                                    value={formData.address}
                                                    readOnly={!!selectedPatient}
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-1.5 flex-1">
                                            <label className="text-[14px] font-medium text-slate-500 ml-1">Ngày gán chỉ định</label>
                                            <div className="relative">
                                                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[20px] text-slate-400">calendar_today</span>
                                                <input
                                                    type="date"
                                                    className="w-full pl-11 pr-4 h-[42px] rounded-lg border border-slate-400 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm text-[14px] font-medium text-slate-700 dark:text-slate-200 outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all"
                                                    value={formData.assignmentDate}
                                                    onChange={(e) => setFormData({ ...formData, assignmentDate: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-1.5 flex-1">
                                            <label className="text-[14px] font-medium text-slate-500 ml-1">Giờ bắt đầu</label>
                                            <div className="relative">
                                                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[20px] text-slate-400">schedule</span>
                                                <input
                                                    type="time"
                                                    className="w-full pl-11 pr-4 h-[42px] rounded-lg border border-slate-400 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm text-[14px] font-medium text-slate-700 dark:text-slate-200 outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all"
                                                    value={formData.assignmentTime}
                                                    onChange={(e) => setFormData({ ...formData, assignmentTime: e.target.value })}
                                                />
                                            </div>
                                        </div>

                                        {/* Procedure & Doctor - Using Custom Dropdown */}
                                        <div className="space-y-1.5 flex-1">
                                            <label className="text-[14px] font-medium text-slate-500 ml-1">Chương trình Quản lý</label>
                                            <Dropdown
                                                options={procedureOptions}
                                                value={formData.procedure}
                                                onChange={(value: string) => setFormData({ ...formData, procedure: value })}
                                            />
                                        </div>
                                        <div className="space-y-1.5 flex-1">
                                            <label className="text-[14px] font-medium text-slate-500 ml-1">Bác sĩ Phân công</label>
                                            <div className="font-bold text-sky-500">
                                                <Dropdown
                                                    options={doctorOptions}
                                                    value={formData.doctorId}
                                                    onChange={(value: string) => setFormData({ ...formData, doctorId: value })}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-4">
                                        <button
                                            type="submit"
                                            disabled={isSubmitting || !selectedPatient}
                                            className="w-full md:w-auto px-12 py-3 bg-[#38bdf8] text-white rounded-xl font-black text-[16px] shadow-lg shadow-sky-500/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                                        >
                                            {isSubmitting ? (
                                                <div className="w-5 h-5 border-3 border-white/20 border-t-white rounded-full animate-spin"></div>
                                            ) : (
                                                "Xác nhận Gán chỉ định"
                                            )}
                                        </button>
                                    </div>
                                </form>

                            </div>
                        </div>
                    </div>
                </div>

                <Toast
                    show={showToast}
                    title={toastMessage}
                    type={toastType}
                    onClose={() => setShowToast(false)}
                />

                <style>{`
                    .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                    .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                    .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 20px; }
                    input[type="date"]::-webkit-calendar-picker-indicator,
                    input[type="time"]::-webkit-calendar-picker-indicator {
                        opacity: 0;
                        position: absolute;
                        right: 15px;
                        width: 25px;
                        cursor: pointer;
                    }
                `}</style>
            </main>
        </div>
    );
}
