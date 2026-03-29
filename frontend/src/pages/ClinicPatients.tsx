import { useState } from 'react';
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

    // Mock patient data
    const originalPatients = [
        { id: 'BN-4092', name: 'Nguyễn Văn An', age: 54, phone: '0901.234.567', condition: 'Tiểu đường Type 2', riskLevel: 'Nguy cơ cao (HIGH RISK)', doctor: 'BS. Lê Thị Mai', location: 'Khu A - P.301', status: 'Đang điều trị', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBOCa1T_Z6YqfWzL2G57p_u-879P5Hw_-8p02pB_l5D7mK6s7387p89_vM_y8uL8v7_5-vS-LMXx9pY_Z_I=w150-h150' },
        { id: 'BN-8832', name: 'Trần Thị Bình', age: 42, phone: '0932.888.999', condition: 'Cao huyết áp', riskLevel: 'Theo dõi (MONITORING)', doctor: 'BS. Nguyễn Văn Hùng', location: 'Ngoại trú', status: 'Ổn định', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDDUxtUCNo_eOW2i74f9dU2ke3O6DdFpNBqocx0VOIT6cKcbqDmYGlNCySrmpW4jb3yPPO0gvyNcggFq9jn0GsZXoCPmlZBJnP8aJUfU4v6lzivTFEc1ylw3JNb-sGeWVlEueNxMEuGrYnsb-nnyA84Oi5Sf336tH76LxB_vRKDHzz1FBJdVIgoJSfL9piK2ojcWK5DG7lxb8IoQapVNBHG8kMuLkEdXj5Q9wZx16HamSmVAQBXHG8kVj7N9ani-cxxqV-3mUBeWQLo=w150-h150' },
        { id: 'BN-2184', name: 'Lê Hoàng Long', age: 67, phone: '0912.445.667', condition: 'Tiểu đường Type 1', riskLevel: 'Nguy cơ cao (HIGH RISK)', doctor: 'BS. Trần Thanh Vân', location: 'Khu B - P.105', status: 'Cấp cứu', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAboso0sxfLLQWXoAkyQ4PjrDzGtVk7eK9A5M0GARfNrFZo2qWjzE0dL0X0SVmT_iNZg4StUX18smTTwilILdTSs1KPADmQto-mphuFNckhqeFUCXDPYsu8U58Ax61i6698FZQi1PYDKwSIgdCXSBTM_KlijtOs3fNISYz3SaIIb3ttQJ-ssqPKMoPuDHNWKlTlaGU6jQ0jVdibdLxl_dZ5ewP6tnuGt8ByfYEgugWhUqDvJHydPhsYoPiygfdgy_4P9YF4YWIOnsc=w150-h150' },
        { id: 'BN-5521', name: 'Phạm Minh Đức', age: 31, phone: '0988.777.666', condition: 'Hen suyễn', riskLevel: 'Bình thường (STABLE)', doctor: 'BS. Lê Thị Mai', location: 'Ngoại trú', status: 'Ổn định', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA9yLvMk6BUhpq4FLxSu2u9WQO1rBsyOYInapLQflgOtYBkOYv4CWpEmrU8s0M4CSk9HIjSi9K6OZKi9SwTImJfAdAN4pXHZX4b2_T5fjnkOjUC1yopuqQd7IEiyV32OcQuX4QI4BQ8D7UB_6h0ibu7w5C1KNIDC4TNKFZMajlLwvW4RKVeZTYCdVtkivG8AMdhCpIvCnMhC-CWoEFOkyY48X3MMsPcmIXSwu7rdl870KnZ25XKOoS_dpgNYfgwx-9i1mfQVEzXL-U=w150-h150' },
        { id: 'BN-1102', name: 'Hoàng Kim Chi', age: 58, phone: '028.384.5555', condition: 'Tăng huyết áp', riskLevel: 'Theo dõi (MONITORING)', doctor: 'BS. Trần Thanh Vân', location: 'Khu A - P.305', status: 'Đang điều trị', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD8l1TSR8QqNUTZi_iBf5NDAWqMisZHLRu3j73Axu4SkhNhEXD2SAg6QXf-qaRl3wE204eABtqWh54oW72o3YdXvWqKIoEH5KTU_hpURc9hEmJIVfRScevIKpEAq26goehjMxlI-2iXQVecGYAo1kwPSR79P-clKbRNtLOd2KfJ5YNE4lAgi_-CWsiTOoQAd397gmPHCt04ABZ26GJnQklEiY4q-CjnZ1bVmUUkOAIxcVrKFY7Sl7JwLW7zh-E-Itsukxb1ID7JwL8=w150-h150' }
    ];

    const [patients, setPatients] = useState(originalPatients);

    const [notifications, setNotifications] = useState([
        { id: 1, title: 'Báo cáo mới', description: 'Có báo cáo tổng quát tháng 12 vừa được tạo.', time: '5 phút trước', read: false },
        { id: 2, title: 'Cảnh báo nguy cơ', description: 'Bệnh nhân Nguyễn Văn An có chỉ số bất thường.', time: '1 giờ trước', read: false },
    ]);

    const handleSavePatient = async (patientData: any) => {
        setIsSaving(true);
        setTimeout(() => {
            const newPatient = {
                ...patientData,
                id: `BN-${Math.floor(Math.random() * 9000) + 1000}`,
                doctor: patientData.assignedDoctor,
                location: 'Ngoại trú',
                status: 'Mới hồ sơ',
                img: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=150&h=150'
            };
            setPatients([newPatient, ...patients]);
            setIsSaving(false);
            setIsCreateModalOpen(false);
            setToastMessage(`Đã thêm hồ sơ bệnh nhân ${patientData.name} thành công!`);
            setShowToast(true);
        }, 1500);
    };

    const handleEditPatient = async (patientData: any) => {
        setIsEditing(true);
        setTimeout(() => {
            setPatients(patients.map(p => p.id === patientData.id ? { ...p, ...patientData, doctor: patientData.assignedDoctor } : p));
            setIsEditing(false);
            setIsEditModalOpen(false);
            setToastMessage(`Đã cập nhật hồ sơ bệnh nhân ${patientData.name}!`);
            setShowToast(true);
        }, 1500);
    };

    const handleDeletePatient = async (patientId: string) => {
        setIsDeleting(true);
        setTimeout(() => {
            setPatients(patients.filter(p => p.id !== patientId));
            setIsDeleting(false);
            setIsDeleteModalOpen(false);
            setToastMessage('Đã bỏ hồ sơ bệnh nhân khỏi danh sách theo dõi');
            setShowToast(true);
        }, 1500);
    };

    const filteredPatients = patients.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.id.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCondition = conditionFilter === 'Tất cả bệnh lý' || p.condition.includes(conditionFilter);
        const matchesRisk = riskFilter === 'Mức độ rủi ro' || p.riskLevel.includes(riskFilter.split(' (')[0]);
        return matchesSearch && matchesCondition && matchesRisk;
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
                            />

                            <ClinicFilterDropdown
                                value={riskFilter}
                                options={['Mức độ rủi ro', 'Bình thường', 'Theo dõi', 'Nguy cơ cao']}
                                onChange={setRiskFilter}
                            />

                            <button className="bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-primary p-4 rounded-2xl transition-all hover:shadow-sm active:scale-95">
                                <span className="material-symbols-outlined">tune</span>
                            </button>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-primary/5 overflow-hidden font-display">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-slate-50 dark:bg-slate-800/50 font-display">
                                        <th className="px-8 py-5 text-[15px] font-medium text-slate-500">Người bệnh</th>
                                        <th className="px-6 py-5 text-[15px] font-medium text-slate-500">Hồ sơ & Bệnh lý</th>
                                        <th className="px-6 py-5 text-[15px] font-medium text-slate-500">Phụ trách</th>
                                        <th className="px-6 py-5 text-[15px] font-medium text-slate-500">Rủi ro</th>
                                        <th className="px-6 py-5 text-[15px] font-medium text-slate-500">Trạng thái</th>
                                        <th className="px-8 py-5 text-[15px] font-medium text-slate-500 text-right font-display italic-none">Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {filteredPatients.length > 0 ? filteredPatients.map((p, idx) => (
                                        <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-all group">
                                            <td className="px-8 py-5">
                                                <div className="flex items-center gap-4">
                                                    <img alt={p.name} className="w-11 h-11 rounded-xl object-cover ring-2 ring-primary/10" src={p.img} />
                                                    <div>
                                                        <p className="text-[16px] font-black text-slate-900 dark:text-white group-hover:text-primary transition-colors tracking-tight italic-none">{p.name}</p>
                                                        <p className="text-[14px] text-slate-400 font-medium">{p.age} tuổi • {p.phone}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="space-y-1">
                                                    <p className="text-sm font-black text-slate-700 dark:text-slate-300 italic-none">{p.id}</p>
                                                    <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[11px] font-bold rounded uppercase tracking-wider italic-none">{p.condition}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <p className="text-[14px] font-bold text-slate-700 dark:text-slate-300">{p.doctor}</p>
                                                <p className="text-[12px] text-slate-400 font-medium italic-none tracking-tight">{p.location}</p>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex flex-col gap-1.5">
                                                    <span className={`text-[13px] font-bold italic-none ${p.riskLevel.includes('HIGH') ? 'text-red-500' : p.riskLevel.includes('MONITORING') ? 'text-amber-500' : 'text-emerald-500'}`}>
                                                        {p.riskLevel.split(' (')[0]}
                                                    </span>
                                                    <div className="w-24 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                                        <div className={`h-full rounded-full ${p.riskLevel.includes('HIGH') ? 'bg-red-500 w-full' : p.riskLevel.includes('MONITORING') ? 'bg-amber-500 w-[60%]' : 'bg-emerald-500 w-[30%]'}`}></div>
                                                    </div>
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
                                                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-x-1 group-hover:translate-x-0">
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
                                                    <span className="material-symbols-outlined text-5xl opacity-20">person_off</span>
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
                            <div className="flex items-center gap-3">
                                <button className="p-2 rounded-xl bg-white dark:bg-slate-100 border border-slate-200 text-slate-400 hover:text-primary transition-all disabled:opacity-30" disabled>
                                    <span className="material-symbols-outlined text-[20px]">chevron_left</span>
                                </button>
                                <div className="flex items-center gap-1.5">
                                    <button className="w-10 h-10 rounded-xl bg-primary text-white text-sm font-black shadow-lg shadow-primary/20 transition-all">1</button>
                                </div>
                                <button className="p-2 rounded-xl bg-white dark:bg-slate-100 border border-slate-200 text-slate-400 hover:text-primary transition-all">
                                    <span className="material-symbols-outlined text-[20px]">chevron_right</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            { label: 'Tỉ trọng bệnh lý', val: 'Tiểu đường chiếm 40%', sub: 'Cao huyết áp xếp thứ 2 (35%)', icon: 'pie_chart', color: 'primary' },
                            { label: 'Nguy cơ khẩn cấp', val: '24 ca cảnh báo', sub: 'Tăng 4 ca trong 24h qua', icon: 'priority_high', color: 'red' },
                            { label: 'Phân công bác sĩ', val: '98% hoàn tất', sub: 'Còn 2 hồ sơ chờ chỉ định', icon: 'assignment_turned_in', color: 'emerald' }
                        ].map((card, i) => (
                            <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
                                <div className="flex items-start justify-between mb-4">
                                    <div className={`w-12 h-12 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-600 dark:text-slate-400 group-hover:bg-primary group-hover:text-white transition-all`}>
                                        <span className="material-symbols-outlined">{card.icon}</span>
                                    </div>
                                    <div className={`px-3 py-1 ${card.color === 'red' ? 'bg-red-50 text-red-600' : card.color === 'emerald' ? 'bg-emerald-50 text-emerald-600' : 'bg-primary/5 text-primary'} text-[10px] font-bold rounded-lg uppercase tracking-wider`}>{card.sub}</div>
                                </div>
                                <h4 className="font-bold text-slate-500 text-[13px] mb-1 italic-none">{card.label}</h4>
                                <div className="text-xl font-black text-slate-900 dark:text-white italic-none">{card.val}</div>
                            </div>
                        ))}
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
