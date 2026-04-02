import { useState, useEffect, useCallback } from 'react';
import ClinicSidebar from '../components/common/ClinicSidebar';
import TopBar from '../components/common/TopBar';
import CreatePatientModal from '../features/clinic/components/CreatePatientModal';
import EditPatientModal from '../features/clinic/components/EditPatientModal';
import DeletePatientModal from '../features/clinic/components/DeletePatientModal';
import ClinicFilterDropdown from '../components/common/ClinicFilterDropdown';
import Toast from '../components/ui/Toast';
import { clinicApi } from '../api/clinic';

export default function ClinicPatients() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // Filter States
    const [searchTerm, setSearchTerm] = useState('');
    const [conditionFilter, setConditionFilter] = useState('Tất cả bệnh lý');
    const [riskFilter, setRiskFilter] = useState('Mức độ rủi ro');

    // Edit/Delete Modal States
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedPatient, setSelectedPatient] = useState<any>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    // Toast State
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    const [patients, setPatients] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchPatients = useCallback(async () => {
        try {
            setIsLoading(true);
            const response = await clinicApi.getPatients({ keyword: searchTerm });
            if (response.success) {
                setPatients(response.data);
            }
        } catch (error) {
            console.error('Failed to fetch patients:', error);
        } finally {
            setIsLoading(false);
        }
    }, [searchTerm]);

    useEffect(() => {
        fetchPatients();
    }, [fetchPatients]);

    const [notifications, setNotifications] = useState([
        { id: 1, title: 'Báo cáo mới', description: 'Có báo cáo tổng quát tháng 12 vừa được tạo.', time: '5 phút trước', read: false },
        { id: 2, title: 'Cảnh báo nguy cơ', description: 'Bệnh nhân Nguyễn Văn An có chỉ số bất thường.', time: '1 giờ trước', read: false },
    ]);

    const handleSavePatient = async (patientData: any) => {
        try {
            setIsSaving(true);
            const response = await clinicApi.createPatient(patientData);
            if (response.success) {
                setToastMessage(`Đã thêm hồ sơ bệnh nhân ${patientData.name} thành công!`);
                setShowToast(true);
                setIsCreateModalOpen(false);
                fetchPatients();
            }
        } catch (error) {
            console.error('Failed to save patient:', error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleEditPatient = async (patientData: any) => {
        setIsEditing(true);
        setTimeout(() => {
            setIsEditing(false);
            setIsEditModalOpen(false);
            setToastMessage(`Đã cập nhật hồ sơ bệnh nhân ${patientData.name}!`);
            setShowToast(true);
            fetchPatients();
        }, 1500);
    };

    const handleDeletePatient = useCallback(async (patientId: string) => {
        try {
            setIsDeleting(true);
            // Simulating API delete call for now
            setTimeout(() => {
                setIsDeleting(false);
                setIsDeleteModalOpen(false);
                setToastMessage(`Đã loại bỏ hồ sơ bệnh nhân thành công`);
                setShowToast(true);
                fetchPatients();
            }, 1000);
        } catch (error) {
            console.error('Failed to delete patient:', error);
        }
    }, [fetchPatients]);

    const filteredPatients = patients.filter(p => {
        const matchesCondition = conditionFilter === 'Tất cả bệnh lý' || p.condition.includes(conditionFilter);
        const matchesRisk = riskFilter === 'Mức độ rủi ro' || p.riskLevel.includes(riskFilter);
        return matchesCondition && matchesRisk;
    });

    const availableDoctors = ['BS. Lê Thị Mai', 'BS. Nguyễn Văn Hùng', 'BS. Trần Thanh Vân'];

    return (
        <div className="flex min-h-screen font-display bg-[#f6f8f7] dark:bg-slate-950 text-slate-900 dark:text-slate-100 italic-none">
            <ClinicSidebar
                isSidebarOpen={isSidebarOpen}
                userName="Admin Sarah"
                userRole="Senior Manager"
                userAvatar="https://lh3.googleusercontent.com/aida-public/AB6AXuDs9fuTZde7EUIINhAwZDAYbGdWhfZuvszHFDZODEHBxXo3hRWmKfCmGfg6Xgckf0DONyYs8LQEOXng1sISGQVj9ec2pSs--Gz-xPlj6elGIG3KtZTO9U-57mPPcUxuNMtJbLamHmXAsWrVwobD4Ai-pKgNGU0yfv596RmDCRUawQMx8gmW7E2J_we-R_YITLa95pCcbtDZf6tkb7C6bWKKzwepNG2pc4L5uji1KMHQetqk8390TVAlxrRao3qco3laKWLu0uA-BmQ"
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

                <div className="p-8 space-y-10">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div className="space-y-1">
                            <h3 className="text-xl font-bold italic-none text-slate-900 dark:text-white tracking-tight">Hồ sơ bệnh nhân mãn tính</h3>
                            <p className="text-slate-500 font-medium">Theo dõi và quản lý dữ liệu lâm sàng diện rộng</p>
                        </div>
                        <button
                            onClick={() => setIsCreateModalOpen(true)}
                            className="bg-primary text-white px-6 py-3 rounded-2xl font-black text-[15px] flex items-center gap-3 hover:shadow-xl hover:shadow-primary/30 transition-all font-display whitespace-nowrap active:scale-95 group"
                        >
                            <span className="material-symbols-outlined font-black">add</span>
                            Thêm bệnh nhân mới
                        </button>
                    </div>

                    {/* Filters Bar (Standardized) */}
                    <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-primary/5 shadow-sm flex flex-wrap items-center gap-6">
                        <div className="flex-1 min-w-[300px] relative group">
                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">search</span>
                            <input
                                className="w-full pl-12 pr-6 py-3.5 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-primary/30 text-sm font-bold placeholder:text-slate-400 transition-all outline-none italic-none"
                                placeholder="Tìm kiếm theo tên bệnh nhân hoặc mã số hồ sơ..."
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-4 flex-wrap">
                            <ClinicFilterDropdown
                                value={conditionFilter}
                                options={['Tất cả bệnh lý', 'Tiểu đường', 'Cao huyết áp', 'Hen suyễn']}
                                onChange={setConditionFilter}
                                icon={<span className="material-symbols-outlined">filter_alt</span>}
                            />
                            <ClinicFilterDropdown
                                value={riskFilter}
                                options={['Mức độ rủi ro', 'STABLE', 'MONITORING', 'HIGH_RISK']}
                                onChange={setRiskFilter}
                                icon={<span className="material-symbols-outlined">analytics</span>}
                            />
                            <button className="p-3.5 bg-slate-50 dark:bg-slate-800 rounded-2xl text-slate-400 hover:text-primary transition-colors active:scale-95">
                                <span className="material-symbols-outlined">tune</span>
                            </button>
                        </div>
                    </div>

                    {/* Patient Table Container */}
                    <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-primary/5 shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50/50 dark:bg-slate-800/20 text-slate-500 text-[13px] font-black tracking-widest uppercase">
                                    <tr>
                                        <th className="px-8 py-6 w-1/3">Người bệnh</th>
                                        <th className="px-6 py-6">Hồ sơ & Bệnh lý</th>
                                        <th className="px-6 py-6">Phụ trách</th>
                                        <th className="px-6 py-6">Rủi ro</th>
                                        <th className="px-6 py-6">Trạng thái</th>
                                        <th className="px-8 py-6 text-right">Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {isLoading ? (
                                        <tr>
                                            <td colSpan={6} className="px-8 py-20 text-center">
                                                <div className="flex flex-col items-center gap-3 text-primary animate-pulse">
                                                    <span className="material-symbols-outlined text-5xl">sync</span>
                                                    <p className="text-sm font-bold italic-none tracking-tight">Đang tải dữ liệu bệnh nhân...</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : filteredPatients.length > 0 ? filteredPatients.map((p, idx) => (
                                        <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-all group">
                                            <td className="px-8 py-5">
                                                <div className="flex items-center gap-4">
                                                    <div className="relative">
                                                        <img
                                                            alt={p.name}
                                                            className="w-12 h-12 rounded-2xl object-cover ring-2 ring-white dark:ring-slate-800 shadow-sm"
                                                            src={p.img}
                                                        />
                                                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full"></div>
                                                    </div>
                                                    <div>
                                                        <p className="text-[15px] font-black text-slate-900 dark:text-white mb-0.5 italic-none leading-tight">{p.name}</p>
                                                        <p className="text-[12px] font-bold text-slate-400 font-mono tracking-tighter uppercase">{p.id} • {p.age} tuổi</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="space-y-1">
                                                    <p className="text-[14px] font-bold text-slate-700 dark:text-slate-300 italic-none">{p.condition}</p>
                                                    <p className="text-[12px] font-medium text-slate-400 flex items-center gap-1.5">
                                                        <span className="w-1.5 h-1.5 bg-primary/40 rounded-full"></span>
                                                        {p.location}
                                                    </p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-2.5">
                                                    <div className="w-8 h-8 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center text-slate-500">
                                                        <span className="material-symbols-outlined text-[18px]">medical_services</span>
                                                    </div>
                                                    <p className="text-[13.5px] font-bold text-slate-600 dark:text-slate-400 italic-none">{p.doctor}</p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-2">
                                                    <div className={`w-2 h-2 rounded-full ${p.riskLevel === 'HIGH_RISK' ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]' :
                                                        p.riskLevel === 'MONITORING' ? 'bg-amber-400' : 'bg-emerald-400'
                                                        }`}></div>
                                                    <span className={`text-[12.5px] font-black italic-none ${p.riskLevel === 'HIGH_RISK' ? 'text-red-600' :
                                                        p.riskLevel === 'MONITORING' ? 'text-amber-600' : 'text-emerald-600'
                                                        }`}>
                                                        {p.riskLevel}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <span className={`inline-flex px-4 py-1.5 rounded-full text-[13px] font-black italic-none shadow-sm ${p.status === 'Ổn định' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                                                    p.status === 'Cấp cứu' ? 'bg-red-50 text-red-600 border border-red-100 animate-pulse' :
                                                        'bg-blue-50 text-blue-600 border border-blue-100'
                                                    }`}>
                                                    {p.status}
                                                </span>
                                            </td>
                                            <td className="px-8 py-5 text-right">
                                                <div className="flex items-center justify-end gap-1 opacity-10 md:opacity-100 group-hover:opacity-100 transition-opacity">
                                                    <button className="p-2 text-primary hover:bg-primary/10 rounded-xl transition-colors active:scale-95" title="Xem hồ sơ">
                                                        <span className="material-symbols-outlined text-[20px]">visibility</span>
                                                    </button>
                                                    <button
                                                        onClick={() => { setSelectedPatient(p); setIsEditModalOpen(true); }}
                                                        className="p-2 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-xl transition-colors active:scale-95"
                                                        title="Chỉnh sửa"
                                                    >
                                                        <span className="material-symbols-outlined text-[20px]">edit</span>
                                                    </button>
                                                    <button
                                                        onClick={() => { setSelectedPatient(p); setIsDeleteModalOpen(true); }}
                                                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors active:scale-95"
                                                        title="Loại bỏ"
                                                    >
                                                        <span className="material-symbols-outlined text-[20px]">delete</span>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan={6} className="px-8 py-20 text-center">
                                                <div className="flex flex-col items-center gap-3 text-slate-400">
                                                    <span className="material-symbols-outlined text-4xl opacity-20">person_off</span>
                                                    <p className="text-sm font-bold italic-none tracking-tight">Không tìm thấy bệnh nhân phù hợp</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <div className="px-8 py-6 bg-slate-50/50 dark:bg-slate-800/20 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
                            <p className="text-[14px] font-medium text-slate-500">
                                Hiển thị <span className="font-bold text-slate-900 dark:text-white">{filteredPatients.length}</span> trên <span className="font-bold text-slate-900 dark:text-white">{patients.length}</span> hồ sơ
                            </p>
                            <div className="flex items-center gap-2">
                                <button className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-400 hover:bg-white dark:hover:bg-slate-800 transition-all disabled:opacity-30 disabled:cursor-not-allowed">
                                    <span className="material-symbols-outlined">chevron_left</span>
                                </button>
                                <div className="flex items-center gap-1 mx-2">
                                    <button className="w-9 h-9 flex items-center justify-center rounded-xl bg-primary text-white font-black text-sm">1</button>
                                </div>
                                <button className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-400 hover:bg-white dark:hover:bg-slate-800 transition-all disabled:opacity-30 disabled:cursor-not-allowed">
                                    <span className="material-symbols-outlined">chevron_right</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Modals */}
                <CreatePatientModal
                    isOpen={isCreateModalOpen}
                    onClose={() => setIsCreateModalOpen(false)}
                    isSaving={isSaving}
                    onSave={handleSavePatient}
                    availableDoctors={availableDoctors}
                />

                <EditPatientModal
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    isSaving={isEditing}
                    onSave={handleEditPatient}
                    patientData={selectedPatient}
                    availableDoctors={availableDoctors}
                />

                <DeletePatientModal
                    isOpen={isDeleteModalOpen}
                    onClose={() => setIsDeleteModalOpen(false)}
                    isDeleting={isDeleting}
                    onDelete={() => handleDeletePatient(selectedPatient?.id)}
                    patientData={selectedPatient}
                />

                <Toast
                    show={showToast}
                    title={toastMessage}
                    onClose={() => setShowToast(false)}
                />
            </main>
        </div>
    );
}
