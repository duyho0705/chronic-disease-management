import { useState } from 'react';
import ClinicSidebar from '../components/common/ClinicSidebar';
import TopBar from '../components/common/TopBar';
import CreateDoctorModal from '../features/clinic/components/CreateDoctorModal';
import EditDoctorModal from '../features/clinic/components/EditDoctorModal';
import DeleteDoctorModal from '../features/clinic/components/DeleteDoctorModal';
import DoctorAssignmentModal from '../features/clinic/components/DoctorAssignmentModal';

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

    const [doctorStatusFilter, setDoctorStatusFilter] = useState('Tất cả bác sĩ');
    const [notifications, setNotifications] = useState([
        { id: 1, title: 'Báo cáo mới', description: 'Có báo cáo tổng quát tháng 12 vừa được tạo.', time: '5 phút trước', read: false },
        { id: 2, title: 'Cảnh báo nguy cơ', description: 'Bệnh nhân Nguyễn Văn An có chỉ số bất thường.', time: '1 giờ trước', read: false },
    ]);

    const handleCreateDoctor = async (doctorData: any) => {
        setIsSaving(true);
        // FIXME: API call Mock
        setTimeout(() => {
            console.log('Saved doctor:', doctorData);
            setIsSaving(false);
            setIsCreateModalOpen(false);
        }, 1500);
    };

    const handleEditDoctor = async (doctorData: any) => {
        setIsEditing(true);
        // FIXME: API call Mock
        setTimeout(() => {
            console.log('Updated doctor:', doctorData);
            setIsEditing(false);
            setIsEditModalOpen(false);
        }, 1500);
    };

    const handleDeleteDoctor = async (doctorId: string) => {
        setIsDeleting(true);
        // FIXME: API call Mock
        setTimeout(() => {
            console.log('Deleted doctor:', doctorId);
            setIsDeleting(false);
            setIsDeleteModalOpen(false);
        }, 1500);
    };

    const filteredDoctors = MOCK_DOCTORS.filter(dr => 
        doctorStatusFilter === 'Tất cả bác sĩ' || dr.status === doctorStatusFilter
    );

    return (
        <div className="flex min-h-screen font-display bg-[#f6f8f7] dark:bg-slate-950 text-slate-900 dark:text-slate-100 italic-none">
            {/* Sidebar Navigation */}
            <ClinicSidebar isSidebarOpen={isSidebarOpen} />

            {/* Main Content Area */}
            <main className="flex-1 lg:ml-72 min-h-screen flex flex-col transition-all duration-300">
                {/* Mobile Sidebar Overlay */}
                {isSidebarOpen && (
                    <div
                        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[140] lg:hidden animate-in fade-in duration-300"
                        onClick={() => setIsSidebarOpen(false)}
                    ></div>
                )}

                {/* Header */}
                <TopBar 
                    setIsSidebarOpen={setIsSidebarOpen}
                    notifications={notifications}
                    setNotifications={setNotifications}
                    userName="Admin Sarah"
                    userRole="Senior Manager"
                    userAvatar="https://lh3.googleusercontent.com/aida-public/AB6AXuDs9fuTZde7EUIINhAwZDAYbGdWhfZuvszHFDZODEHBxXo3hRWmKfCmGfg6Xgckf0DONyYs8LQEOXng1sISGQVj9ec2pSs--Gz-xPlj6elGIG3KtZTO9U-57mPPcUxuNMtJbLamHmXAsWrVwobD4Ai-pKgNGU0yfv596RmDCRUawQMx8gmW7E2J_we-R_YITLa95pCcbtDZf6tkb7C6bWKKzwepNG2pc4L5uji1KMHQetqk8390TVAlxrRao3qco3laKWLu0uA-BmQ"
                    showSearch={true}
                    actionButton={
                        <button 
                            onClick={() => setIsCreateModalOpen(true)}
                            className="bg-primary text-white px-5 py-2.5 mr-4 rounded-xl font-bold text-sm flex items-center gap-2 hover:shadow-lg hover:shadow-primary/20 transition-all font-display whitespace-nowrap"
                        >
                            <span className="material-symbols-outlined text-sm">add</span>
                            <span>Thêm bác sĩ</span>
                        </button>
                    }
                />

                {/* Content Canvas */}
                <div className="p-8 space-y-10">
                    {/* Filters & Summary Bento Grid */}
                    <div className="grid grid-cols-12 gap-6">
                        {/* Filter Actions */}
                        <div className="col-span-12 lg:col-span-8 bg-white dark:bg-slate-900 rounded-2xl p-5 border border-primary/5 shadow-sm flex flex-wrap items-center gap-4 text-slate-500">
                            <span className="text-sm font-bold px-2">Bộ lọc trạng thái:</span>
                            {[
                                'Tất cả bác sĩ',
                                'Đang hoạt động',
                                'Nghỉ phép',
                                'Đã đủ lịch'
                            ].map((label, i) => (
                                <button
                                    key={i}
                                    onClick={() => setDoctorStatusFilter(label)}
                                    className={`px-5 py-2 rounded-xl font-bold text-sm flex items-center gap-2 transition-all ${doctorStatusFilter === label
                                            ? 'bg-primary text-white shadow-lg shadow-primary/10'
                                            : 'bg-slate-50 dark:bg-slate-800 text-slate-500 hover:text-primary hover:bg-primary/5'
                                        }`}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>

                        {/* Stats Mini Card */}
                        <div className="col-span-12 lg:col-span-4 bg-white dark:bg-slate-900 rounded-2xl border border-primary/5 p-5 flex items-center justify-between overflow-hidden relative group shadow-sm transition-all hover:shadow-md">
                            <div className="relative z-10">
                                <p className="text-sm font-medium text-slate-500 mb-1">Số lượng danh sách</p>
                                <h3 className="text-3xl font-black text-slate-900 dark:text-white">{filteredDoctors.length}</h3>
                            </div>
                            <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center relative z-10 group-hover:scale-110 transition-transform">
                                <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>medical_information</span>
                            </div>
                        </div>
                    </div>

                    {/* Doctor Directory Table */}
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
                                                    <div className="relative">
                                                        <img alt={dr.name} className="w-11 h-11 rounded-xl object-cover ring-2 ring-primary/10" src={dr.img} />
                                                    </div>
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
                                                <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-[14px] font-bold text-white shadow-sm whitespace-nowrap ${
                                                    dr.statusColor === 'primary' ? 'bg-emerald-500' : 
                                                    dr.statusColor === 'amber' ? 'bg-amber-500' : 
                                                    'bg-slate-400'
                                                }`}>
                                                    {dr.status}
                                                </span>
                                            </td>
                                            <td className="px-8 py-5 text-right whitespace-nowrap">
                                                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-x-1 group-hover:translate-x-0">
                                                    <button 
                                                        onClick={() => { setSelectedDoctor(dr); setIsEditModalOpen(true); }}
                                                        className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-primary hover:bg-primary/10 transition-all"
                                                    >
                                                        <span className="material-symbols-outlined text-[22px]">edit</span>
                                                    </button>
                                                    <button 
                                                        onClick={() => { setSelectedDoctor(dr); setIsAssignmentModalOpen(true); }}
                                                        className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-tertiary hover:bg-tertiary/10 transition-all"
                                                        title="Phân công Bệnh nhân"
                                                    >
                                                        <span className="material-symbols-outlined text-[22px]">assignment_ind</span>
                                                    </button>
                                                    <button 
                                                        onClick={() => { setSelectedDoctor(dr); setIsDeleteModalOpen(true); }}
                                                        className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"
                                                        title="Xoá Bác sĩ"
                                                    >
                                                        <span className="material-symbols-outlined text-[22px]">delete</span>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan={7} className="px-8 py-10 text-center">
                                                <div className="flex flex-col items-center justify-center min-h-[150px]">
                                                    <span className="material-symbols-outlined text-4xl text-slate-300 mb-2">person_off</span>
                                                    <p className="text-slate-500 font-medium">Không tìm thấy bác sĩ nào ứng với bộ lọc "{doctorStatusFilter}"</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination Footer - Redesigned */}
                        <div className="px-8 py-6 bg-slate-50/50 dark:bg-slate-800/20 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
                            <p className="text-[14px] font-medium text-slate-500">
                                Hiển thị <span className="font-bold text-slate-900 dark:text-white">1</span> đến <span className="font-bold text-slate-900 dark:text-white">4</span> trong số <span className="font-bold text-slate-900 dark:text-white">42</span> bác sĩ
                            </p>
                            <div className="flex items-center gap-3">
                                <button className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-primary transition-all hover:shadow-sm disabled:opacity-30 disabled:hover:text-slate-400" disabled title="Trang trước">
                                    <span className="material-symbols-outlined text-[20px]">chevron_left</span>
                                </button>
                                <div className="flex items-center gap-1.5">
                                    <button className="w-10 h-10 rounded-xl bg-primary text-white text-sm font-black shadow-lg shadow-primary/20 transition-all">1</button>
                                    <button className="w-10 h-10 rounded-xl bg-white dark:bg-slate-900 text-slate-500 hover:text-primary border border-transparent hover:border-slate-200 dark:hover:border-slate-700 text-sm font-bold transition-all">2</button>
                                    <button className="w-10 h-10 rounded-xl bg-white dark:bg-slate-900 text-slate-500 hover:text-primary border border-transparent hover:border-slate-200 dark:hover:border-slate-700 text-sm font-bold transition-all">3</button>
                                    <span className="px-2 text-slate-300 dark:text-slate-600 font-bold">...</span>
                                    <button className="w-10 h-10 rounded-xl bg-white dark:bg-slate-900 text-slate-500 hover:text-primary border border-transparent hover:border-slate-200 dark:hover:border-slate-700 text-sm font-bold transition-all">11</button>
                                </div>
                                <button className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-primary transition-all hover:shadow-sm" title="Trang sau">
                                    <span className="material-symbols-outlined text-[20px]">chevron_right</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Secondary Action Bento: Featured Specialists */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            { label: 'Hiệu suất khám bệnh', val: '94%', sub: 'Tăng 2% so với tháng trước', icon: 'monitoring', color: 'emerald', bar: true },
                            { label: 'Đánh giá trung bình', val: '4.85/5.0', sub: 'Dựa trên 1,248 phản hồi', icon: 'workspace_premium', color: 'amber', stars: true },
                            { label: 'Lịch hẹn tuần này', val: '312', sub: '+12% so với tuần trước', icon: 'date_range', color: 'indigo' }
                        ].map((card, i) => (
                            <div key={i} className="bg-white dark:bg-slate-900 p-6 xl:p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden group hover:shadow-md transition-all flex flex-col justify-between">
                                <div>
                                    <div className="flex items-start justify-between mb-6">
                                        <div className={`w-14 h-14 bg-${card.color}-500/10 rounded-2xl flex items-center justify-center text-${card.color}-600 dark:text-${card.color}-400 group-hover:scale-110 group-hover:bg-${card.color}-500 group-hover:text-white transition-all duration-300`}>
                                            <span className="material-symbols-outlined text-[28px]">{card.icon}</span>
                                        </div>
                                        <div className={`px-3 py-1.5 rounded-lg bg-${card.color}-500/5 text-${card.color}-600 dark:text-${card.color}-400 text-[12px] font-bold border border-${card.color}-500/10`}>
                                            {card.sub}
                                        </div>
                                    </div>
                                    <h4 className="font-semibold text-slate-500 dark:text-slate-400 text-[14px] mb-2">{card.label}</h4>
                                    <div className="text-4xl font-black text-slate-900 dark:text-white mb-6">
                                        {card.val}
                                    </div>
                                </div>
                                
                                {card.bar && (
                                    <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                                        <div className={`bg-${card.color}-500 h-full rounded-full transition-all duration-1000 group-hover:brightness-110`} style={{ width: '94%' }}></div>
                                    </div>
                                )}

                                {card.stars && (
                                    <div className="flex items-center gap-1.5">
                                        {[1, 2, 3, 4].map(s => <span key={s} className="material-symbols-outlined text-amber-500 text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>)}
                                        <span className="material-symbols-outlined text-amber-500 text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>star_half</span>
                                    </div>
                                )}

                                {i === 2 && (
                                    <div className={`text-[13px] font-bold text-${card.color}-600 dark:text-${card.color}-400 flex items-center gap-1.5`}>
                                        <span className="material-symbols-outlined text-[18px]">trending_up</span>
                                        Tăng trưởng ổn định
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <CreateDoctorModal
                    isOpen={isCreateModalOpen}
                    onClose={() => setIsCreateModalOpen(false)}
                    isSaving={isSaving}
                    onSave={handleCreateDoctor}
                />

                <EditDoctorModal
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    isSaving={isEditing}
                    onSave={handleEditDoctor}
                    initialData={selectedDoctor}
                />

                <DeleteDoctorModal
                    isOpen={isDeleteModalOpen}
                    onClose={() => setIsDeleteModalOpen(false)}
                    isDeleting={isDeleting}
                    onDelete={handleDeleteDoctor}
                    doctorData={selectedDoctor}
                />

                <DoctorAssignmentModal
                    isOpen={isAssignmentModalOpen}
                    onClose={() => setIsAssignmentModalOpen(false)}
                    doctorData={selectedDoctor}
                />
            </main>
        </div>
    );
}
