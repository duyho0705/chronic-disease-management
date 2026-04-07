import { useState, useEffect } from 'react';
import { clinicApi } from '../api/clinic';
import ClinicSidebar from '../components/common/ClinicSidebar';
import TopBar from '../components/common/TopBar';
import CreateDoctorModal from '../features/clinic/components/CreateDoctorModal';
import EditDoctorModal from '../features/clinic/components/EditDoctorModal';
import DeleteDoctorModal from '../features/clinic/components/DeleteDoctorModal';
import DoctorAssignmentModal from '../features/clinic/components/DoctorAssignmentModal';
import ClinicFilterDropdown from '../components/common/ClinicFilterDropdown';
import Toast from '../components/ui/Toast';

export default function ClinicDoctors() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const currentClinicId = localStorage.getItem('clinicId') || '1';

    // Edit Modal State
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedDoctor, setSelectedDoctor] = useState<any>(null);

    // Delete Modal State
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    // Assignment Modal State
    const [isAssignmentModalOpen, setIsAssignmentModalOpen] = useState(false);

    // Filter States
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('Tất cả bác sĩ');
    const [specialtyFilter, setSpecialtyFilter] = useState('Chuyên khoa');

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchTerm);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    const [doctors, setDoctors] = useState<any[]>([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [pageSize] = useState(10);

    const fetchDoctors = async (page = 0, isSilent = false) => {
        if (!isSilent) setIsLoading(true);
        try {
            const res = await clinicApi.getDoctors(currentClinicId, {
                keyword: debouncedSearch || undefined,
                page: page,
                size: pageSize
            });
            if (res.success) {
                const pageData = res.data;
                setDoctors(pageData.content || []);
                setTotalPages(pageData.totalPages || 0);
                setTotalElements(pageData.totalElements || 0);
                setCurrentPage(pageData.number || 0);
            }
        } catch (error) {
            console.error('Failed to fetch doctors:', error);
        } finally {
            if (!isSilent) setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchDoctors(0, false);
    }, [currentClinicId, debouncedSearch]);

    const [notifications, setNotifications] = useState<any[]>([]);

    // Toast State
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    const handleCreateDoctor = async (doctorData: any) => {
        setIsSaving(true);
        try {
            const res = await clinicApi.createDoctor(currentClinicId, doctorData);
            if (res.success) {
                fetchDoctors();
                setIsCreateModalOpen(false);
                setToastMessage(`Đã thêm bác sĩ ${doctorData.name} vào hệ thống!`);
                setShowToast(true);
            }
        } catch (error) {
            console.error('Failed to create doctor:', error);
            setToastMessage('Lỗi khi thêm bác sĩ');
            setShowToast(true);
        } finally {
            setIsSaving(false);
        }
    };

    const handleEditDoctor = async (doctorData: any) => {
        setIsEditing(true);
        try {
            const res = await clinicApi.updateDoctor(currentClinicId, doctorData.dbId, doctorData);
            if (res.success) {
                fetchDoctors();
                setIsEditing(false);
                setIsEditModalOpen(false);
                setToastMessage(`Đã cập nhật thông tin bác sĩ ${doctorData.name}`);
                setShowToast(true);
            }
        } catch (error) {
            console.error('Failed to edit doctor:', error);
            setToastMessage('Lỗi khi cập nhật thông tin');
            setShowToast(true);
        } finally {
            setIsEditing(false);
        }
    };

    const handleDeleteDoctor = async (doctorId: any) => {
        setIsDeleting(true);
        // Note: Modal works like DeletePatientModal
        const dbId = typeof doctorId === 'object' ? doctorId.dbId : doctorId;
        try {
            const res = await clinicApi.deleteDoctor(currentClinicId, dbId);
            if (res.success) {
                fetchDoctors();
                setIsDeleting(false);
                setIsDeleteModalOpen(false);
                setToastMessage('Đã gỡ bỏ hồ sơ bác sĩ khỏi hệ thống');
                setShowToast(true);
            }
        } catch (error) {
            console.error('Failed to delete doctor:', error);
            setToastMessage('Lỗi khi xóa hồ sơ');
            setShowToast(true);
        } finally {
            setIsDeleting(false);
        }
    };

    const specialties = ['Nội khoa', 'Sản phụ khoa', 'Nhi khoa', 'Tim mạch'];

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

                <div className="p-8 space-y-10">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        {isLoading ? (
                            <div className="space-y-2">
                                <div className="h-8 bg-slate-200 dark:bg-slate-800 animate-pulse rounded w-72"></div>
                                <div className="h-4 bg-slate-100 dark:bg-slate-800/50 animate-pulse rounded w-96"></div>
                            </div>
                        ) : (
                            <div className="space-y-1">
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Danh sách đội ngũ bác sĩ</h3>
                                <p className="text-slate-500 font-medium">Quản lý và điều phối nhân sự y tế trong phòng khám</p>
                            </div>
                        )}
                        
                        {isLoading ? (
                            <div className="w-52 h-12 bg-primary/20 animate-pulse rounded-2xl shadow-sm"></div>
                        ) : (
                            <button
                                onClick={() => setIsCreateModalOpen(true)}
                                className="bg-primary text-white px-6 py-3 rounded-2xl font-black text-[15px] flex items-center gap-3 hover:shadow-xl hover:shadow-primary/30 transition-all font-display whitespace-nowrap active:scale-95 group"
                            >
                                <span className="material-symbols-outlined font-black">add</span>
                                Thêm bác sĩ mới
                            </button>
                        )}
                    </div>

                    {/* Filters Bar (Standardized) */}
                    <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/60 dark:border-slate-800 shadow-sm flex flex-wrap items-center gap-6 transition-all duration-300 hover:shadow-md">
                        {isLoading ? (
                            <>
                                <div className="flex-1 min-w-[300px] h-12 bg-slate-50 dark:bg-slate-800 rounded-2xl animate-pulse"></div>
                                <div className="w-48 h-12 bg-slate-50 dark:bg-slate-800 rounded-2xl animate-pulse"></div>
                                <div className="w-48 h-12 bg-slate-50 dark:bg-slate-800 rounded-2xl animate-pulse"></div>
                                <div className="w-12 h-12 bg-slate-50 dark:bg-slate-800 rounded-2xl animate-pulse"></div>
                            </>
                        ) : (
                            <>
                                <div className="flex-1 min-w-[300px] relative group">
                                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">search</span>
                                    <input
                                        className="w-full pl-12 pr-6 py-3.5 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-primary/30 text-sm font-bold placeholder:text-slate-400 transition-all outline-none"
                                        placeholder="Tìm kiếm bác sĩ theo tên hoặc mã số..."
                                        type="text"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                                <div className="flex items-center gap-4 flex-wrap">
                                    <ClinicFilterDropdown
                                        value={statusFilter}
                                        options={['Tất cả bác sĩ', 'Đang hoạt động', 'Nghỉ phép', 'Đã đủ lịch']}
                                        onChange={setStatusFilter}
                                    />

                                    <ClinicFilterDropdown
                                        value={specialtyFilter}
                                        options={['Chuyên khoa', ...specialties]}
                                        onChange={setSpecialtyFilter}
                                    />

                                    <button className="bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-primary p-4 rounded-2xl transition-all hover:shadow-sm active:scale-95">
                                        <span className="material-symbols-outlined">tune</span>
                                    </button>
                                </div>
                            </>
                        )}
                    </div>

                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200/60 dark:border-slate-800/50 overflow-hidden transition-all duration-300 hover:shadow-md">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-slate-50 dark:bg-slate-800/50 font-display">
                                        <th className="px-8 py-5">
                                            {isLoading ? <div className="h-4 bg-slate-200 dark:bg-slate-700 animate-pulse rounded w-32"></div> : <span className="text-[15px] font-medium text-slate-500">Thông tin bác sĩ</span>}
                                        </th>
                                        <th className="px-6 py-5">
                                            {isLoading ? <div className="h-4 bg-slate-200 dark:bg-slate-700 animate-pulse rounded w-24"></div> : <span className="text-[15px] font-medium text-slate-500">Chuyên khoa</span>}
                                        </th>
                                        <th className="px-6 py-5">
                                            {isLoading ? <div className="h-4 bg-slate-200 dark:bg-slate-700 animate-pulse rounded w-20"></div> : <span className="text-[15px] font-medium text-slate-500">Liên hệ</span>}
                                        </th>
                                        <th className="px-6 py-5">
                                            {isLoading ? <div className="h-4 bg-slate-200 dark:bg-slate-700 animate-pulse rounded w-16 mx-auto"></div> : <span className="text-[15px] font-medium text-slate-500 text-center block">Bệnh nhân</span>}
                                        </th>
                                        <th className="px-6 py-5">
                                            {isLoading ? <div className="h-4 bg-slate-200 dark:bg-slate-700 animate-pulse rounded w-20"></div> : <span className="text-[15px] font-medium text-slate-500">Đánh giá</span>}
                                        </th>
                                        <th className="px-6 py-5">
                                            {isLoading ? <div className="h-4 bg-slate-200 dark:bg-slate-700 animate-pulse rounded w-20"></div> : <span className="text-[15px] font-medium text-slate-500">Trạng thái</span>}
                                        </th>
                                        <th className="px-8 py-5 text-right">
                                            {isLoading ? <div className="h-4 bg-slate-200 dark:bg-slate-700 animate-pulse rounded w-16 ml-auto"></div> : <span className="text-[15px] font-medium text-slate-500">Thao tác</span>}
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {isLoading ? (
                                        [...Array(6)].map((_, i) => (
                                            <tr key={`dr-skeleton-${i}`} className="animate-pulse">
                                                <td className="px-8 py-5">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-11 h-11 rounded-xl bg-slate-100 dark:bg-slate-800 shrink-0"></div>
                                                        <div className="space-y-2">
                                                            <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-24"></div>
                                                            <div className="h-3 bg-slate-50 dark:bg-slate-800/50 rounded w-32"></div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <div className="h-7 bg-slate-100 dark:bg-slate-800 rounded-lg w-20"></div>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <div className="space-y-2">
                                                        <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-40"></div>
                                                        <div className="h-3 bg-slate-50 dark:bg-slate-800/50 rounded w-28"></div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5 text-center">
                                                    <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-8 mx-auto"></div>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-16"></div>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <div className="h-7 bg-slate-100 dark:bg-slate-800 rounded-full w-24"></div>
                                                </td>
                                                <td className="px-8 py-5 text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-xl"></div>
                                                        <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-xl"></div>
                                                        <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-xl"></div>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : doctors.length > 0 ? (
                                        doctors.map((dr, idx) => (
                                            <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group">
                                                <td className="px-8 py-5">
                                                    <div className="flex items-center gap-4">
                                                        <img alt={dr.name} className="w-11 h-11 rounded-xl object-cover ring-2 ring-primary/10" src={dr.img} />
                                                        <div>
                                                            <p className="text-[16px] font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors tracking-tight">{dr.name}</p>
                                                            <p className="text-[14px] text-slate-400 dark:text-slate-500 font-medium mt-0.5">Mã số: {dr.id}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <span className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[14px] font-bold rounded-lg whitespace-nowrap">
                                                        {dr.specialty}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <p className="text-[14px] font-bold text-slate-700 dark:text-slate-300">{dr.email}</p>
                                                    <p className="text-[13px] text-slate-400 font-medium tracking-tight whitespace-nowrap">{dr.phone}</p>
                                                </td>
                                                <td className="px-6 py-5 text-center">
                                                    <span className="text-sm font-bold text-slate-900 dark:text-white">{dr.load}</span>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <div className="flex items-center gap-1.5 text-amber-400">
                                                        <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                                        <span className="text-[15px] font-bold text-slate-900 dark:text-white">{dr.rating}</span>
                                                        <span className="text-[14px] text-slate-500 font-medium">({dr.reviews})</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-[14px] font-bold text-white shadow-sm whitespace-nowrap ${dr.statusColor === 'primary' ? 'bg-emerald-500' :
                                                        dr.statusColor === 'amber' ? 'bg-amber-500' :
                                                            'bg-slate-400'
                                                        }`}>
                                                        {dr.status}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-5 text-right whitespace-nowrap">
                                                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-x-1 group-hover:translate-x-0">
                                                        <button onClick={() => { setSelectedDoctor(dr); setIsEditModalOpen(true); }} className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-primary transition-all">
                                                            <span className="material-symbols-outlined text-[22px]">edit</span>
                                                        </button>
                                                        <button onClick={() => { setSelectedDoctor(dr); setIsAssignmentModalOpen(true); }} className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-emerald-500 transition-all">
                                                            <span className="material-symbols-outlined text-[22px]">assignment_ind</span>
                                                        </button>
                                                        <button onClick={() => { setSelectedDoctor(dr); setIsDeleteModalOpen(true); }} className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-red-500 transition-all">
                                                            <span className="material-symbols-outlined text-[22px]">delete</span>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={7} className="px-8 py-20 text-center">
                                                <div className="flex flex-col items-center gap-3 text-slate-400">
                                                    <span className="material-symbols-outlined text-5xl opacity-20">person_off</span>
                                                    <p className="text-sm font-bold italic-none tracking-tight">Không tìm thấy bác sĩ phù hợp</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <div className="px-8 py-6 bg-slate-50/30 dark:bg-slate-800/30 flex items-center justify-between border-t border-slate-200 dark:border-slate-700">
                            {isLoading ? (
                                <>
                                    <div className="h-4 bg-slate-200 dark:bg-slate-800 animate-pulse rounded w-48"></div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse"></div>
                                        <div className="w-16 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse"></div>
                                        <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse"></div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <p className="text-[14px] font-medium text-slate-500">
                                        Hiển thị <span className="font-bold text-slate-900 dark:text-white">{doctors.length}</span> trên <span className="font-bold text-slate-900 dark:text-white">{totalElements}</span> bác sĩ
                                    </p>
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => fetchDoctors(currentPage - 1)}
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
                                            onClick={() => fetchDoctors(currentPage + 1)}
                                            disabled={currentPage >= totalPages - 1}
                                            className="p-2 rounded-xl bg-white dark:bg-slate-100 border border-slate-200 text-slate-400 hover:text-primary transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                                        >
                                            <span className="material-symbols-outlined text-[20px]">chevron_right</span>
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>


                </div>

                <CreateDoctorModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} isSaving={isSaving} onSave={handleCreateDoctor} />
                <EditDoctorModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} isSaving={isEditing} onSave={handleEditDoctor} initialData={selectedDoctor} />
                <DeleteDoctorModal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} isDeleting={isDeleting} onDelete={handleDeleteDoctor} doctorData={selectedDoctor} />
                <DoctorAssignmentModal isOpen={isAssignmentModalOpen} onClose={() => setIsAssignmentModalOpen(false)} doctorData={selectedDoctor} />

                <Toast
                    show={showToast}
                    title={toastMessage}
                    onClose={() => setShowToast(false)}
                />
            </main>
        </div>
    );
}
