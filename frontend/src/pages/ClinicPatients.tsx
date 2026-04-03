import { useState, useEffect } from 'react';
import axios from '../api/axios';
import ClinicSidebar from '../components/common/ClinicSidebar';
import TopBar from '../components/common/TopBar';
import CreatePatientModal from '../features/clinic/components/CreatePatientModal';
import EditPatientModal from '../features/clinic/components/EditPatientModal';
import DeletePatientModal from '../features/clinic/components/DeletePatientModal';
import ClinicFilterDropdown from '../components/common/ClinicFilterDropdown';
import Toast from '../components/ui/Toast';

export default function ClinicPatients() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const currentClinicId = localStorage.getItem('clinicId') || '1';

    // Filter States
    const [searchTerm, setSearchTerm] = useState('');
    const [conditionFilter, setConditionFilter] = useState('Tất cả bệnh lý');
    const [riskFilter, setRiskFilter] = useState('Mức độ rủi ro');
    const [statusFilter, setStatusFilter] = useState('Tất cả trạng thái');

    // Edit/Delete Modal States
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedPatient, setSelectedPatient] = useState<any>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    // Toast State
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchTerm);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm]);
    const [availableDoctors, setAvailableDoctors] = useState<string[]>([]);
    const [availableConditions, setAvailableConditions] = useState<string[]>([]);

    const [patients, setPatients] = useState<any[]>([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [pageSize] = useState(10);

    const [notifications, setNotifications] = useState([
        { id: 1, title: 'Báo cáo mới', description: 'Có báo cáo tổng quát tháng 12 vừa được tạo.', time: '5 phút trước', read: false },
        { id: 2, title: 'Cảnh báo nguy cơ', description: 'Bệnh nhân Nguyễn Văn An có chỉ số bất thường.', time: '1 giờ trước', read: false },
    ]);

    const [stats, setStats] = useState<any>(null);

    const fetchPatients = async (page = currentPage) => {
        try {
            const response = await axios.get(`/v1/clinics/${currentClinicId}/patients`, {
                params: {
                    keyword: debouncedSearch || undefined,
                    condition: conditionFilter !== 'Tất cả bệnh lý' ? conditionFilter : undefined,
                    riskLevel: riskFilter !== 'Mức độ rủi ro' ? riskFilter : undefined,
                    status: statusFilter !== 'Tất cả trạng thái' ? statusFilter : undefined,
                    page: page,
                    size: pageSize
                }
            });
            if (response.data.success) {
                const pageData = response.data.data;
                setPatients(pageData.content || []);
                setTotalPages(pageData.totalPages || 0);
                setTotalElements(pageData.totalElements || 0);
                setCurrentPage(pageData.number || 0);
            }
        } catch (error) {
            console.error('Failed to fetch patients:', error);
        }
    };

    const fetchStats = async () => {
        try {
            const response = await axios.get(`/v1/clinics/${currentClinicId}/dashboard`);
            if (response.data.success) {
                setStats(response.data.data);
            }
        } catch (error) {
            console.error('Failed to fetch stats:', error);
        }
    };

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const response = await axios.get(`/v1/clinics/${currentClinicId}/doctors/names`);
                if (response.data.success) {
                    setAvailableDoctors(response.data.data);
                }
            } catch (error) {
                console.error('Failed to fetch doctors:', error);
                setAvailableDoctors(['BS. Lê Thị Mai', 'BS. Nguyễn Văn Hùng', 'BS. Trần Thanh Vân']); // Fallback
            }
        };

        const fetchConditions = async () => {
            try {
                const response = await axios.get(`/v1/clinics/${currentClinicId}/conditions`);
                if (response.data.success) {
                    setAvailableConditions(response.data.data);
                }
            } catch (error) {
                console.error('Failed to fetch conditions:', error);
                setAvailableConditions(['Tiểu đường Type 1', 'Tiểu đường Type 2', 'Cao huyết áp', 'Bệnh tim mạch', 'Suy thận', 'Hen suyễn', 'Khác']); // Fallback
            }
        };

        fetchDoctors();
        fetchConditions();
        fetchStats();
    }, [currentClinicId]);

    useEffect(() => {
        fetchPatients(0);
    }, [debouncedSearch, conditionFilter, riskFilter, statusFilter]);

    const handleSavePatient = async (patientData: any) => {
        setIsSaving(true);
        try {
            const response = await axios.post(`/v1/clinics/${currentClinicId}/patients`, patientData);
            if (response.data.success) {
                fetchPatients();
                setIsCreateModalOpen(false);
                setToastMessage(`Đã thêm hồ sơ bệnh nhân ${patientData.name} thành công!`);
                setShowToast(true);
            }
        } catch (error) {
            console.error('Failed to save patient:', error);
            setToastMessage('Có lỗi xảy ra khi lưu hồ sơ. Vui lòng thử lại!');
            setShowToast(true);
        } finally {
            setIsSaving(false);
        }
    };

    const handleEditPatient = async (patientData: any) => {
        setIsEditing(true);
        try {
            // Use dbId for backend API, keep existing 'id' (patientCode) for UI consistency
            const response = await axios.put(`/v1/clinics/${currentClinicId}/patients/${patientData.dbId}`, patientData);
            if (response.data.success) {
                fetchPatients();
                setIsEditing(false);
                setIsEditModalOpen(false);
                setToastMessage(`Đã cập nhật hồ sơ bệnh nhân ${patientData.name}!`);
                setShowToast(true);
            }
        } catch (error) {
            console.error('Failed to edit patient:', error);
            setToastMessage('Lỗi khi cập nhật hồ sơ');
            setShowToast(true);
            setIsEditing(false);
        }
    };

    const handleDeletePatient = async (patientId: any) => {
        setIsDeleting(true);
        // Note: patientId passed from modal could be 'id' or 'dbId' depending on implementation
        // Since we want the database ID for the endpoint:
        const dbId = typeof patientId === 'object' ? patientId.dbId : patientId;
        try {
            const response = await axios.delete(`/v1/clinics/${currentClinicId}/patients/${dbId}`);
            if (response.data.success) {
                fetchPatients();
                setIsDeleting(false);
                setIsDeleteModalOpen(false);
                setToastMessage('Đã bỏ hồ sơ bệnh nhân khỏi danh sách theo dõi');
                setShowToast(true);
            }
        } catch (error) {
            console.error('Failed to delete patient:', error);
            setToastMessage('Lỗi khi xóa hồ sơ');
            setShowToast(true);
            setIsDeleting(false);
        }
    };



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

                <div className="p-8 space-y-6">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div className="space-y-1">
                            <h3 className="text-xl font-bold italic-none text-slate-900 dark:text-white tracking-tight">Hồ sơ bệnh nhân mãn tính</h3>
                            <p className="text-slate-500 font-medium">Theo dõi và quản lý dữ liệu lâm sàng diện rộng</p>
                        </div>
                        <button
                            onClick={() => setIsCreateModalOpen(true)}
                            className="bg-primary text-white px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2 hover:shadow-lg hover:shadow-primary/20 transition-all font-display whitespace-nowrap active:scale-95 group shadow-sm"
                        >
                            <span className="material-symbols-outlined text-[20px]">add</span>
                            Thêm bệnh nhân mới
                        </button>
                    </div>

                    {/* Stats Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white dark:bg-slate-900 p-7 rounded-[2rem] border border-slate-200 dark:border-slate-700 shadow-sm space-y-5 group hover:shadow-md transition-all">
                            <div className="flex items-center justify-between">
                                <div className="w-12 h-12 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-500 group-hover:text-primary transition-colors">
                                    <span className="material-symbols-outlined text-[24px]">analytics</span>
                                </div>
                                <span className={`px-4 py-1.5 bg-emerald-50 text-emerald-600 text-[11px] font-bold rounded-full uppercase tracking-wider border border-emerald-100/50`}>
                                    {stats?.patientGrowth || '+0%'} so với tháng trước
                                </span>
                            </div>
                            <div>
                                <p className="text-[14px] font-medium text-slate-500 mb-1">Hiệu suất khám bệnh</p>
                                <h4 className="text-3xl font-bold italic-none text-slate-900 dark:text-white">{stats?.totalPatients || '0'} ca</h4>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-slate-900 p-7 rounded-[2rem] border border-slate-200 dark:border-slate-700 shadow-sm space-y-5 group hover:shadow-md transition-all">
                            <div className="flex items-center justify-between">
                                <div className="w-12 h-12 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-500 group-hover:text-primary transition-colors">
                                    <span className="material-symbols-outlined text-[24px]">verified</span>
                                </div>
                                <span className="px-4 py-1.5 bg-slate-50 text-slate-500 text-[11px] font-bold rounded-full uppercase tracking-wider border border-slate-200/50">Dữ liệu thực tế</span>
                            </div>
                            <div>
                                <p className="text-[14px] font-medium text-slate-500 mb-1">Ca nguy cơ cao</p>
                                <h4 className="text-3xl font-bold italic-none text-slate-900 dark:text-white text-red-500">{stats?.highRiskAlerts || '0'}</h4>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-slate-900 p-7 rounded-[2rem] border border-slate-200 dark:border-slate-700 shadow-sm space-y-5 group hover:shadow-md transition-all">
                            <div className="flex items-center justify-between">
                                <div className="w-12 h-12 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-500 group-hover:text-primary transition-colors">
                                    <span className="material-symbols-outlined text-[24px]">calendar_month</span>
                                </div>
                                <span className="px-4 py-1.5 bg-emerald-50 text-emerald-600 text-[11px] font-bold rounded-full uppercase tracking-wider border border-emerald-100/50">{stats?.highRiskGrowth || '+0 ca'}</span>
                            </div>
                            <div>
                                <p className="text-[14px] font-medium text-slate-500 mb-1">Chờ tái khám</p>
                                <h4 className="text-3xl font-bold italic-none text-slate-900 dark:text-white">{stats?.pendingFollowUps || '0'}</h4>
                            </div>
                        </div>
                    </div>

                    {/* Filters Bar (Clean - No Background Container) */}
                    <div className="flex flex-wrap items-center gap-4">
                        <div className="w-full md:w-[450px] relative group">
                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors text-[20px]">search</span>
                            <input
                                className="w-full pl-12 pr-6 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full focus:ring-2 focus:ring-primary/20 text-sm font-medium transition-all outline-none italic-none shadow-sm"
                                placeholder="Tìm kiếm theo tên bệnh nhân"
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
                            />

                            <ClinicFilterDropdown
                                value={riskFilter}
                                options={['Mức độ rủi ro', 'Bình thường', 'Theo dõi', 'Nguy cơ cao']}
                                onChange={setRiskFilter}
                            />

                            <ClinicFilterDropdown
                                value={statusFilter}
                                options={['Tất cả trạng thái', 'Đang điều trị', 'Đang theo dõi', 'Ổn định']}
                                onChange={setStatusFilter}
                            />
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden font-display">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
                                        <th className="px-8 py-4 text-[15px] font-medium text-slate-700">Người bệnh</th>
                                        <th className="px-6 py-4 text-[15px] font-medium text-slate-700">Liên hệ</th>
                                        <th className="px-6 py-4 text-[15px] font-medium text-slate-700">Bệnh lý</th>
                                        <th className="px-6 py-4 text-[15px] font-medium text-slate-700">Phụ trách</th>
                                        <th className="px-6 py-4 text-[15px] font-medium text-slate-700">Rủi ro</th>
                                        <th className="px-6 py-4 text-[15px] font-medium text-slate-700">Trạng thái</th>
                                        <th className="px-8 py-4 text-[15px] font-medium text-slate-700 text-right">Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {patients.length > 0 ? patients.map((p, idx) => (
                                        <tr key={idx} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors group cursor-pointer border-b border-slate-50 dark:border-slate-800 last:border-0">
                                            <td className="px-8 py-4">
                                                <div className="flex items-center gap-4">
                                                    <img alt={p.name} className="w-11 h-11 rounded-xl object-cover ring-2 ring-primary/10" src={p.img} />
                                                    <div>
                                                        <p className="text-[14px] font-bold text-slate-700 dark:text-slate-200 transition-colors tracking-tight italic-none">{p.name}</p>
                                                        <p className="text-[12px] text-slate-500 font-medium">{p.age} tuổi</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="text-[14px] font-medium text-slate-600">
                                                    {p.phone}
                                                </p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-slate-700 text-[14px] font-bold">
                                                    {p.condition}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="text-[14px] font-bold text-slate-700">{p.doctor}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-[14px] font-bold text-slate-700 italic-none">
                                                    {p.riskLevel.includes('HIGH') ? 'Nguy cơ cao' : p.riskLevel.includes('MONITORING') ? 'Đang theo dõi' : 'Bình thường'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex px-4 py-1.5 rounded-full text-[12px] font-bold italic-none shadow-sm text-white ${p.status === 'Ổn định' ? 'bg-emerald-500' :
                                                    p.status === 'Đang theo dõi' ? 'bg-amber-500' :
                                                        'bg-blue-500'
                                                    }`}>
                                                    {p.status}
                                                </span>
                                            </td>
                                            <td className="px-8 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2 transition-all">
                                                    <button className="p-2 text-primary bg-primary/5 hover:bg-primary/10 rounded-lg transition-colors active:scale-95" title="Xem hồ sơ">
                                                        <span className="material-symbols-outlined text-[20px]">visibility</span>
                                                    </button>
                                                    <button
                                                        onClick={() => { setSelectedPatient(p); setIsEditModalOpen(true); }}
                                                        className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors active:scale-95"
                                                        title="Chỉnh sửa"
                                                    >
                                                        <span className="material-symbols-outlined text-[20px]">edit</span>
                                                    </button>
                                                    <button
                                                        onClick={() => { setSelectedPatient(p); setIsDeleteModalOpen(true); }}
                                                        className="p-2 text-red-500 bg-red-50 hover:bg-red-100 rounded-lg transition-colors active:scale-95"
                                                        title="Loại bỏ"
                                                    >
                                                        <span className="material-symbols-outlined text-[20px]">delete</span>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan={7} className="px-8 py-20 text-center">
                                                <div className="flex flex-col items-center">
                                                    <span className="material-symbols-outlined text-4xl opacity-20">person_off</span>
                                                    <p className="text-sm font-medium text-slate-500">Không tìm thấy bệnh nhân nào</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <div className="px-8 py-6 bg-slate-50/30 dark:bg-slate-800/30 flex items-center justify-between border-t border-slate-200 dark:border-slate-700">
                            <p className="text-[14px] font-medium text-slate-500">
                                Hiển thị <span className="font-bold text-slate-900 dark:text-white">{patients.length}</span> trên <span className="font-bold text-slate-900 dark:text-white">{totalElements}</span> hồ sơ
                            </p>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => fetchPatients(currentPage - 1)}
                                    disabled={currentPage === 0}
                                    className="p-2 rounded-xl bg-white dark:bg-slate-100 border border-slate-200 text-slate-400 hover:text-primary transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                                >
                                    <span className="material-symbols-outlined text-[20px]">chevron_left</span>
                                </button>
                                <div className="flex items-center gap-1.5">
                                    <button className="w-10 h-10 rounded-xl bg-primary text-white text-sm font-black shadow-lg shadow-primary/20 transition-all">
                                        {currentPage + 1}
                                    </button>
                                    <span className="text-sm font-medium text-slate-400 mx-1">/ {totalPages || 1}</span>
                                </div>
                                <button
                                    onClick={() => fetchPatients(currentPage + 1)}
                                    disabled={currentPage >= totalPages - 1}
                                    className="p-2 rounded-xl bg-white dark:bg-slate-100 border border-slate-200 text-slate-400 hover:text-primary transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                                >
                                    <span className="material-symbols-outlined text-[20px]">chevron_right</span>
                                </button>
                            </div>
                        </div>
                    </div>

                </div>

                <CreatePatientModal
                    isOpen={isCreateModalOpen}
                    onClose={() => setIsCreateModalOpen(false)}
                    isSaving={isSaving}
                    onSave={handleSavePatient}
                    availableDoctors={availableDoctors}
                    availableConditions={availableConditions}
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
                    onDelete={handleDeletePatient}
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
