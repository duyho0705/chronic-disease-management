import { useState } from 'react';
import ClinicSidebar from '../components/common/ClinicSidebar';
import TopBar from '../components/common/TopBar';
import CreateDoctorModal from '../features/clinic/components/CreateDoctorModal';
import EditDoctorModal from '../features/clinic/components/EditDoctorModal';
import DeleteDoctorModal from '../features/clinic/components/DeleteDoctorModal';
import DoctorAssignmentModal from '../features/clinic/components/DoctorAssignmentModal';
import ClinicFilterDropdown from '../components/common/ClinicFilterDropdown';
import Toast from '../components/ui/Toast';

const MOCK_DOCTORS = [
    {
        name: 'TS. BS. Nguyễn Văn An', id: 'D-4092', specialty: 'Nội khoa',
        email: 'an.nguyen@clinic.vn', phone: '+84 902 345 678', load: 128, rating: '4.9', reviews: 124,
        status: 'Đang hoạt động', statusColor: 'primary',
        img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD8l1TSR8QqNUTZi_iBf5NDAWqMisZHLRu3j73Axu4SkhNhEXD2SAg6QXf-qaRl3wE204eABtqWh54oW72o3YdXvWqKIoEH5KTU_hpURc9hEmJIVfRScevIKpEAq26goehjMxlI-2iXQVecGYAo1kwPSR79P-clKbRNtLOd2KfJ5YNE4lAgi_-CWsiTOoQAd397gmPHCt04ABZ26GJnQklEiY4q-CjnZ1bVmUUkOAIxcVrKFY7Sl7JwLW7zh-E-Itsukxb1ID7JwL8'
    },
    {
        name: 'ThS. BS. Lê Thị Bình', id: 'D-2184', specialty: 'Sản phụ khoa',
        email: 'binh.le@clinic.vn', phone: '+84 938 112 334', load: 84, rating: '4.8', reviews: 209,
        status: 'Nghỉ phép', statusColor: 'slate',
        img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA9yLvMk6BUhpq4FLxSu2u9WQO1rBsyOYInapLQflgOtYBkOYv4CWpEmrU8s0M4CSk9HIjSi9K6OZKi9SwTImJfAdAN4pXHZX4b2_T5fjnkOjUC1yopuqQd7IEiyV32OcQuX4QI4BQ8D7UB_6h0ibu7w5C1KNIDC4TNKFZMajlLwvW4RKVeZTYCdVtkivG8AMdhCpIvCnMhC-CWoEFOkyY48X3MMsPcmIXSwu7rdl870KnZ25XKOoS_dpgNYfgwx-9i1mfQVEzXL-U'
    },
    {
        name: 'BS. CKII. Phạm Quốc Cường', id: 'D-5521', specialty: 'Nhi khoa',
        email: 'cuong.pham@clinic.vn', phone: '+84 912 999 000', load: 242, rating: '5.0', reviews: 438,
        status: 'Đã đủ lịch', statusColor: 'amber',
        img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAboso0sxfLLQWXoAkyQ4PjrDzGtVk7eK9A5M0GARfNrFZo2qWjzE0dL0X0SVmT_iNZg4StUX18smTTwilILdTSs1KPADmQto-mphuFNckhqeFUCXDPYsu8U58Ax61i6698FZQi1PYDKwSIgdCXSBTM_KlijtOs3fNISYz3SaIIb3ttQJ-ssqPKMoPuDHNWKlTlaGU6jQ0jVdibdLxl_dZ5ewP6tnuGt8ByfYEgugWhUqDvJHydPhsYoPiygfdgy_4P9YF4YWIOnsc'
    },
    {
        name: 'BS. Hoàng Minh Thư', id: 'D-8832', specialty: 'Tim mạch',
        email: 'thu.hoang@clinic.vn', phone: '+84 977 444 555', load: 112, rating: '4.7', reviews: 89,
        status: 'Đang hoạt động', statusColor: 'primary',
        img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDUxtUCNo_eOW2i74f9dU2ke3O6DdFpNBqocx0VOIT6cKcbqDmYGlNCySrmpW4jb3yPPO0gvyNcggFq9jn0GsZXoCPmlZBJnP8aJUfU4v6lzivTFEc1ylw3JNb-sGeWVlEueNxMEuGrYnsb-nnyA84Oi5Sf336tH76LxB_vRKDHzz1FBJdVIgoJSfL9piK2ojcWK5DG7lxb8IoQapVNBHG8kMuLkEdXj5Q9wZx16HamSmVAQBXHG8kVj7N9ani-cxxqV-3mUBeWQLo'
    }
];

export default function ClinicDoctors() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

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
    const [statusFilter, setStatusFilter] = useState('Tất cả bác sĩ');
    const [specialtyFilter, setSpecialtyFilter] = useState('Chuyên khoa');

    const [doctors, setDoctors] = useState(MOCK_DOCTORS);

    const [notifications, setNotifications] = useState([
        { id: 1, title: 'Báo cáo mới', description: 'Có báo cáo tổng quát tháng 12 vừa được tạo.', time: '5 phút trước', read: false },
        { id: 2, title: 'Cảnh báo nguy cơ', description: 'Bệnh nhân Nguyễn Văn An có chỉ số bất thường.', time: '1 giờ trước', read: false },
    ]);

    // Toast State
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    const handleCreateDoctor = async (doctorData: any) => {
        setIsSaving(true);
        setTimeout(() => {
            const newDr = {
                ...doctorData,
                id: `D-${Math.floor(Math.random() * 9000) + 1000}`,
                load: 0, rating: '5.0', reviews: 0,
                status: 'Đang hoạt động', statusColor: 'primary',
                img: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=150&h=150'
            };
            setDoctors([newDr, ...doctors]);
            setIsSaving(false);
            setIsCreateModalOpen(false);
            setToastMessage(`Đã thêm bác sĩ ${doctorData.name} vào hệ thống!`);
            setShowToast(true);
        }, 1500);
    };

    const handleEditDoctor = async (doctorData: any) => {
        setIsEditing(true);
        setTimeout(() => {
            setDoctors(doctors.map(d => d.id === doctorData.id ? { ...d, ...doctorData } : d));
            setIsEditing(false);
            setIsEditModalOpen(false);
            setToastMessage(`Đã cập nhật thông tin bác sĩ ${doctorData.name}`);
            setShowToast(true);
        }, 1500);
    };

    const handleDeleteDoctor = async (doctorId: string) => {
        setIsDeleting(true);
        setTimeout(() => {
            setDoctors(doctors.filter(d => d.id !== doctorId));
            setIsDeleting(false);
            setIsDeleteModalOpen(false);
            setToastMessage('Đã gỡ bỏ hồ sơ bác sĩ khỏi hệ thống');
            setShowToast(true);
        }, 1500);
    };

    const filteredDoctors = doctors.filter(dr => {
        const matchesSearch = dr.name.toLowerCase().includes(searchTerm.toLowerCase()) || dr.id.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'Tất cả bác sĩ' || dr.status === statusFilter;
        const matchesSpecialty = specialtyFilter === 'Chuyên khoa' || dr.specialty === specialtyFilter;
        return matchesSearch && matchesStatus && matchesSpecialty;
    });

    const specialties = ['Nội khoa', 'Sản phụ khoa', 'Nhi khoa', 'Tim mạch'];

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
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Danh sách đội ngũ bác sĩ</h3>
                            <p className="text-slate-500 font-medium">Quản lý và điều phối nhân sự y tế trong phòng khám</p>
                        </div>
                        <button
                            onClick={() => setIsCreateModalOpen(true)}
                            className="bg-primary text-white px-6 py-3 rounded-2xl font-black text-[15px] flex items-center gap-3 hover:shadow-xl hover:shadow-primary/30 transition-all font-display whitespace-nowrap active:scale-95 group"
                        >
                            <span className="material-symbols-outlined font-black">add</span>
                            Thêm bác sĩ mới
                        </button>
                    </div>

                    {/* Filters Bar (Standardized) */}
                    <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-primary/5 shadow-sm flex flex-wrap items-center gap-6">
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
                    </div>

                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-primary/5 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-slate-50 dark:bg-slate-800/50 font-display">
                                        <th className="px-8 py-5 text-[15px] font-medium text-slate-500">Thông tin bác sĩ</th>
                                        <th className="px-6 py-5 text-[15px] font-medium text-slate-500">Chuyên khoa</th>
                                        <th className="px-6 py-5 text-[15px] font-medium text-slate-500">Liên hệ</th>
                                        <th className="px-6 py-5 text-[15px] font-medium text-slate-500 text-center">Bệnh nhân</th>
                                        <th className="px-6 py-5 text-[15px] font-medium text-slate-500">Đánh giá</th>
                                        <th className="px-6 py-5 text-[15px] font-medium text-slate-500">Trạng thái</th>
                                        <th className="px-8 py-5 text-[15px] font-medium text-slate-500 text-right">Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {filteredDoctors.length > 0 ? filteredDoctors.map((dr, idx) => (
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
                                    )) : (
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

                        <div className="px-8 py-6 bg-slate-50/50 dark:bg-slate-800/20 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
                            <p className="text-[14px] font-medium text-slate-500">
                                Hiển thị <span className="font-bold text-slate-900 dark:text-white">{filteredDoctors.length}</span> bác sĩ
                            </p>
                            <div className="flex items-center gap-3">
                                <button className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-primary transition-all disabled:opacity-30" disabled>
                                    <span className="material-symbols-outlined text-[20px]">chevron_left</span>
                                </button>
                                <div className="flex items-center gap-1.5">
                                    <button className="w-10 h-10 rounded-xl bg-primary text-white text-sm font-black shadow-lg shadow-primary/20 transition-all">1</button>
                                </div>
                                <button className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-primary transition-all">
                                    <span className="material-symbols-outlined text-[20px]">chevron_right</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            { label: 'Hiệu suất khám bệnh', val: '94%', sub: 'Tăng 2% so với tháng trước', icon: 'monitoring', color: 'emerald' },
                            { label: 'Đánh giá trung bình', val: '4.85/5.0', sub: 'Dựa trên 1,248 phản hồi', icon: 'workspace_premium', color: 'amber' },
                            { label: 'Lịch hẹn tuần này', val: '312', sub: '+12% so với tuần trước', icon: 'date_range', color: 'indigo' }
                        ].map((card, i) => (
                            <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
                                <div className="flex items-start justify-between mb-4">
                                    <div className={`w-12 h-12 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-600 dark:text-slate-400 group-hover:bg-primary group-hover:text-white transition-all`}>
                                        <span className="material-symbols-outlined">{card.icon}</span>
                                    </div>
                                    <div className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-bold rounded-lg uppercase tracking-wider">{card.sub}</div>
                                </div>
                                <h4 className="font-bold text-slate-500 text-[13px] mb-1">{card.label}</h4>
                                <div className="text-3xl font-black text-slate-900 dark:text-white">{card.val}</div>
                            </div>
                        ))}
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
