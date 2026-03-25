import React, { useState } from 'react';
import PrescriptionModal from '../components/PrescriptionModal';
import Toast from '../components/Toast';
import TopBar from '../components/TopBar';

export default function DoctorPrescriptions() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState('Tất cả trạng thái');
    const [isPrescriptionModalOpen, setIsPrescriptionModalOpen] = useState(false);
    const [isAddingNewMedicine, setIsAddingNewMedicine] = useState(false);
    const [medications, setMedications] = useState<any[]>([]);
    const [isSavingPrescription, setIsSavingPrescription] = useState(false);
    const [showSuccessToast, setShowSuccessToast] = useState(false);
    const [newMedForm, setNewMedForm] = useState({
        name: '',
        dosage: '',
        frequency: '',
        duration: '',
        intakeType: '',
    });
    const [formErrors, setFormErrors] = useState({
        name: false,
        dosage: false,
        frequency: false,
        duration: false,
        intakeType: false,
    });

    const [notifications, setNotifications] = useState([
        { id: 1, title: 'Cảnh báo chỉ số', message: 'Bệnh nhân Nguyễn Văn An có chỉ số đường huyết cao bất thường.', time: '5 phút trước', type: 'warning' },
        { id: 2, title: 'Lịch hẹn mới', message: 'Bạn có một yêu cầu đặt lịch hẹn mới từ Lê Thị Bình.', time: '2 giờ trước', type: 'info' }
    ]);

    const addMedicationToPrescription = () => {
        const errors = {
            name: !newMedForm.name,
            dosage: !newMedForm.dosage,
            frequency: !newMedForm.frequency,
            duration: !newMedForm.duration,
            intakeType: !newMedForm.intakeType,
        };
        setFormErrors(errors);

        if (Object.values(errors).some(v => v)) return;

        setMedications([...medications, { ...newMedForm, id: Date.now() }]);
        setNewMedForm({
            name: '',
            dosage: '',
            frequency: '',
            duration: '',
            intakeType: '',
        });
        setIsAddingNewMedicine(false);
    };

    const removeMedication = (id: number) => {
        setMedications(medications.filter(m => m.id !== id));
    };

    const handleSavePrescription = async () => {
        setIsSavingPrescription(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsSavingPrescription(false);
        setIsPrescriptionModalOpen(false);
        setMedications([]);

        // Trigger success toast
        setShowSuccessToast(true);
    };

    return (
        <div className="flex min-h-screen font-display bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100">
            {/* Sidebar Navigation */}
            <aside className={`fixed left-0 top-0 bottom-0 bg-white dark:bg-slate-900 border-r border-primary/10 flex flex-col z-[150] transition-transform duration-300 w-72 lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} shadow-2xl lg:shadow-none shadow-primary/10`}>
                <div className="p-6 flex items-center gap-3 border-b border-primary/5">
                    <div className="w-10 h-10 bg-primary flex items-center justify-center rounded-xl text-white shadow-lg shadow-primary/20">
                        <span className="material-symbols-outlined fill-1">health_metrics</span>
                    </div>
                    <div>
                        <h1 className="text-xl font-extrabold text-slate-900 dark:text-white leading-none">DamDiep</h1>
                    </div>
                </div>
                <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto custom-scrollbar">
                    <a className="flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-slate-400 hover:bg-primary/10 hover:text-primary rounded-xl font-medium transition-all" href="/doctor">
                        <span className="material-symbols-outlined">dashboard</span>
                        <span>Bảng điều khiển</span>
                    </a>
                    <a className="flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-slate-400 hover:bg-primary/10 hover:text-primary rounded-xl font-medium transition-all" href="/doctor/patients">
                        <span className="material-symbols-outlined">groups</span>
                        <span>Danh sách bệnh nhân</span>
                    </a>
                    <a className="flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-slate-400 hover:bg-primary/10 hover:text-primary rounded-xl font-medium transition-all" href="/doctor/analytics">
                        <span className="material-symbols-outlined">analytics</span>
                        <span>Phân tích nguy cơ</span>
                    </a>
                    <a className="flex items-center gap-3 px-4 py-3 bg-primary text-white rounded-xl font-medium shadow-lg shadow-primary/10 transition-all" href="/doctor/prescriptions">
                        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>prescriptions</span>
                        <span>Đơn thuốc điện tử</span>
                    </a>
                    <a className="flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-slate-400 hover:bg-primary/10 hover:text-primary rounded-xl font-medium transition-all" href="/doctor/appointments">
                        <span className="material-symbols-outlined">calendar_today</span>
                        <span>Lịch hẹn khám</span>
                    </a>
                    <a className="flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-slate-400 hover:bg-primary/10 hover:text-primary rounded-xl font-medium transition-all" href="/doctor/messages">
                        <span className="material-symbols-outlined">chat</span>
                        <span>Tin nhắn</span>
                        <span className="ml-auto bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full">5</span>
                    </a>
                </nav>
                <div className="p-4 mt-auto">
                    <div className="bg-primary/5 rounded-lg p-4 border border-primary/10">
                        <div className="flex items-center gap-3 mb-3">
                            <div
                                className="w-10 h-10 rounded-full bg-slate-200 bg-cover bg-center"
                                data-alt="Bác sĩ Lê Minh Tâm portrait profile"
                                style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDvD1gNLm_sBMkVyq8FuYHA20LjP97yY90_RzaDO9mjZaL9ubIXYPTKQeV1FDlhsH3p7qndF3QILzvglilx1ly9Sb7AtePxkBlVz8-5HPGNI5wMlA1c27CCvjNz865bvs_Y9uYkK2245BaMa66pFJCTPXK2wTV6-A4oQjShYdPHNg1nx01j-yW7I48c8aShwiEDSx2B_FE04UGkIxELFaJ-Ho65BrMgC_LF9Yk0dKK7BGEGWjFX4zFwmnNWi44sq8khTm_Q-D-Iig4')" }}
                            ></div>
                            <div className="overflow-hidden">
                                <p className="text-sm font-bold truncate">BS. Lê Minh Tâm</p>
                                <p className="text-xs text-slate-500">Chuyên khoa Nội</p>
                            </div>
                        </div>
                        <button className="w-full flex items-center justify-center gap-2 py-2 text-sm font-bold text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                            <span className="material-symbols-outlined text-sm">logout</span>
                            Đăng xuất
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 lg:ml-72 min-h-screen flex flex-col transition-all duration-300">
                {/* Mobile Sidebar Overlay */}
                {isSidebarOpen && (
                    <div
                        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[140] lg:hidden animate-in fade-in duration-300"
                        onClick={() => setIsSidebarOpen(false)}
                    ></div>
                )}
                {/* Top Bar */}
                <TopBar
                    setIsSidebarOpen={setIsSidebarOpen}
                    notifications={notifications}
                    setNotifications={setNotifications}
                />

                <div className="p-8 space-y-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <h2 className="text-[22px] font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">Đơn thuốc điện tử</h2>
                            <p className="text-slate-500 mt-1">Quản lý và theo dõi phác đồ điều trị của bệnh nhân trực tiếp qua hệ thống</p>
                        </div>
                        <button
                            onClick={() => setIsPrescriptionModalOpen(true)}
                            className="bg-primary text-slate-900 font-bold px-6 py-3.5 rounded-2xl text-[15px] flex items-center justify-center gap-2.5 transition-all shadow-lg shadow-primary/20 active:scale-95"
                        >
                            <span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>add_circle</span>
                            Kê đơn thuốc mới
                        </button>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden group transition-all duration-300">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <p className="text-sm font-medium text-slate-500 mb-1">Tổng đơn thuốc</p>
                                    <h3 className="text-3xl font-black text-slate-900 tracking-tight">1,284</h3>
                                </div>
                                <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                    <span className="material-symbols-outlined text-2xl">description</span>
                                </div>
                            </div>
                            <div className="mt-4 flex items-center gap-1 text-primary text-[14px] font-bold">
                                <span className="material-symbols-outlined text-sm">trending_up</span>
                                +12% tháng này
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 border-t-4 border-t-primary relative overflow-hidden group transition-all duration-300">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <p className="text-sm font-medium text-slate-500 mb-1">Đang hiệu lực</p>
                                    <h3 className="text-3xl font-black text-slate-900 tracking-tight">452</h3>
                                </div>
                                <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                    <span className="material-symbols-outlined text-2xl">medication</span>
                                </div>
                            </div>
                            <p className="mt-4 text-[14px] text-slate-500 font-medium">Đang được bệnh nhân sử dụng</p>
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden group transition-all duration-300">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <p className="text-sm font-medium text-slate-500 mb-1">Chờ tái cấp</p>
                                    <h3 className="text-3xl font-black text-slate-900 tracking-tight">18</h3>
                                </div>
                                <div className="size-12 rounded-full bg-orange-50 flex items-center justify-center text-orange-400">
                                    <span className="material-symbols-outlined text-2xl">update</span>
                                </div>
                            </div>
                            <div className="mt-4 flex items-center gap-1 text-orange-500 text-[14px] font-bold">
                                <span className="material-symbols-outlined text-sm">priority_high</span>
                                Cần phê duyệt ngay
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden group transition-all duration-300">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <p className="text-sm font-medium text-slate-500 mb-1">Hoàn thành</p>
                                    <h3 className="text-3xl font-black text-slate-900 tracking-tight">814</h3>
                                </div>
                                <div className="size-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-400">
                                    <span className="material-symbols-outlined text-2xl">task_alt</span>
                                </div>
                            </div>
                            <p className="mt-4 text-[14px] text-blue-500 font-bold tracking-wide">Tỷ lệ hồi phục: 94.2%</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
                        {/* Table Section */}
                        <div className="xl:col-span-8 space-y-6">
                            <div className="bg-slate-50 p-4 rounded-2xl flex flex-col md:flex-row gap-4 items-center border border-slate-100">
                                <div className="relative w-full md:w-auto md:flex-1">
                                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">search</span>
                                    <input
                                        className="w-full pl-12 pr-4 py-3 bg-white border-2 border-transparent focus:border-primary/20 rounded-2xl focus:shadow-lg focus:shadow-primary/5 outline-none text-[15px] font-medium transition-all"
                                        placeholder="Tìm bệnh nhân hoặc mã đơn..."
                                        type="text"
                                    />
                                </div>
                                <div className="flex gap-2.5 w-full md:w-auto">
                                    {/* Custom Dropdown */}
                                    <div className="relative">
                                        <button
                                            onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
                                            className="bg-white border-2 border-transparent hover:border-primary/20 rounded-2xl text-[14px] font-bold py-3 px-5 flex items-center gap-3 transition-all active:scale-95 whitespace-nowrap shadow-sm"
                                        >
                                            <span className="text-slate-700">{selectedStatus}</span>
                                            <span className={`material-symbols-outlined text-slate-400 transition-transform duration-300 ${isStatusDropdownOpen ? 'rotate-180' : ''}`}>expand_more</span>
                                        </button>

                                        {isStatusDropdownOpen && (
                                            <div className="absolute top-full left-0 mt-2 w-full min-w-[200px] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 p-2 z-[100] animate-in fade-in slide-in-from-top-2 duration-200">
                                                {['Tất cả trạng thái', 'Đang hiệu lực', 'Hết hạn', 'Đã hủy'].map((status) => (
                                                    <button
                                                        key={status}
                                                        onClick={() => {
                                                            setSelectedStatus(status);
                                                            setIsStatusDropdownOpen(false);
                                                        }}
                                                        className={`w-full text-left px-4 py-2.5 rounded-xl text-[14px] font-medium transition-colors ${selectedStatus === status ? 'bg-primary/10 text-primary' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                                                    >
                                                        {status}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    <button className="bg-white p-3 rounded-2xl text-slate-500 hover:text-primary transition-all border-2 border-transparent hover:border-primary/20 active:scale-95 shadow-sm">
                                        <span className="material-symbols-outlined text-[22px]">calendar_month</span>
                                    </button>
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-slate-50/50">
                                                <th className="px-6 py-4 text-[13px] font-medium uppercase tracking-wider text-slate-400">Mã đơn</th>
                                                <th className="px-6 py-4 text-[13px] font-medium uppercase tracking-wider text-slate-400">Bệnh nhân</th>
                                                <th className="px-6 py-4 text-[13px] font-medium uppercase tracking-wider text-slate-400">Chẩn đoán</th>
                                                <th className="px-6 py-4 text-[13px] font-medium uppercase tracking-wider text-slate-400 text-right">Thao tác</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-50">
                                            {[
                                                { id: '#RX-8842', name: 'Nguyễn Văn Hùng', initial: 'NH', diagnosis: 'Viêm họng cấp tính, sốt nhẹ', status: 'Đang hiệu lực', color: 'emerald' },
                                                { id: '#RX-8839', name: 'Trần Thị Mai', initial: 'TM', diagnosis: 'Tăng huyết áp vô căn', status: 'Hết hạn', color: 'slate' },
                                                { id: '#RX-8831', name: 'Lê Anh Dũng', initial: 'LD', diagnosis: 'Phát ban do dị ứng', status: 'Đã hủy', color: 'red' },
                                                { id: '#RX-8825', name: 'Vũ Anh Kiệt', initial: 'VK', diagnosis: 'Đau dây thần kinh tọa', status: 'Đang hiệu lực', color: 'emerald' },
                                            ].map((row, i) => (
                                                <tr key={i} className="transition-colors group border-b border-slate-50/50 last:border-0">
                                                    <td className="px-6 py-5 text-[15px] font-medium text-slate-500">{row.id}</td>
                                                    <td className="px-6 py-5">
                                                        <div className="flex items-center gap-3">
                                                            <div className={`w-9 h-9 rounded-full bg-${row.color}-100 flex items-center justify-center text-[11px] font-bold text-${row.color}-600`}>
                                                                {row.initial}
                                                            </div>
                                                            <span className="text-[15px] font-bold text-slate-900 dark:text-white">{row.name}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-5 text-[15px] text-slate-600 dark:text-slate-400 font-medium max-w-[250px] truncate">{row.diagnosis}</td>
                                                    <td className="px-6 py-4 text-right">
                                                        <div className="flex items-center justify-end gap-1 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-primary transition-colors">
                                                                <span className="material-symbols-outlined text-lg">visibility</span>
                                                            </button>
                                                            <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-900 transition-colors">
                                                                <span className="material-symbols-outlined text-lg">print</span>
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <div className="p-6 flex items-center justify-between border-t border-slate-50 bg-slate-50/30">
                                    <p className="text-[13px] font-medium text-slate-400">Hiển thị 10/1,284 kết quả</p>
                                    <div className="flex gap-2.5">
                                        <button className="p-2.5 rounded-xl bg-white border border-slate-100 shadow-sm disabled:opacity-50 hover:bg-slate-50 transition-colors">
                                            <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                                        </button>
                                        <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-primary text-slate-900 text-[14px] font-bold shadow-md shadow-primary/20">1</button>
                                        <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-slate-100 text-[14px] font-bold text-slate-600 hover:bg-slate-50 transition-colors">2</button>
                                        <button className="p-2.5 rounded-xl bg-white border border-slate-100 shadow-sm hover:bg-slate-50 transition-colors">
                                            <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Section */}
                        <div className="xl:col-span-4 space-y-8">
                            <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                                <div className="flex items-center justify-between mb-6">
                                    <h4 className="text-[15px] font-bold uppercase tracking-tight text-slate-900 flex items-center gap-2">
                                        <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>pill</span>
                                        THUỐC HAY DÙNG
                                    </h4>
                                    <a className="text-[13px] font-medium text-primary hover:underline" href="#">Tất cả</a>
                                </div>
                                <div className="space-y-4">
                                    {[
                                        { name: 'Paracetamol 500mg', desc: 'Giảm đau, hạ sốt', color: 'primary' },
                                        { name: 'Amoxicillin 250mg', desc: 'Kháng sinh phổ rộng', color: 'blue' },
                                        { name: 'Vitamin C 1000mg', desc: 'Thực phẩm chức năng', color: 'orange' },
                                    ].map((med, i) => (
                                        <div key={i} className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer group border border-transparent hover:border-slate-100">
                                            <div className={`w-10 h-10 rounded-xl bg-${med.color === 'primary' ? 'primary' : med.color}-50 flex items-center justify-center text-${med.color === 'primary' ? 'primary' : med.color}-500`}>
                                                <span className="material-symbols-outlined">{med.desc.includes('Kháng sinh') ? 'vaccines' : 'medication'}</span>
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-[15px] font-bold text-slate-800 dark:text-white leading-tight">{med.name}</p>
                                                <p className="text-[13px] text-slate-500 font-medium mt-0.5">{med.desc}</p>
                                            </div>
                                            <button className="text-slate-200 group-hover:text-primary transition-colors">
                                                <span className="material-symbols-outlined text-lg">add_circle</span>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 border-l-4 border-l-blue-400">
                                <div className="flex items-center justify-between mb-6">
                                    <h4 className="text-[17px] font-medium uppercase tracking-tight text-slate-900 flex items-center gap-2">
                                        <span className="material-symbols-outlined text-blue-500 text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>history</span>
                                        MẪU ĐƠN GẦN ĐÂY
                                    </h4>
                                </div>
                                <div className="space-y-3">
                                    <div className="p-5 rounded-2xl bg-slate-50/50 hover:bg-white hover:shadow-lg transition-all cursor-pointer border-dashed border border-slate-200 group">
                                        <div className="flex justify-between items-start mb-1.5">
                                            <span className="text-[15px] font-bold text-slate-900 leading-tight">Điều trị Viêm xoang</span>
                                            <span className="text-[11px] bg-blue-100 text-blue-600 px-3 py-1 rounded-full font-bold uppercase tracking-widest shadow-sm">Linh động</span>
                                        </div>
                                        <p className="text-[13px] text-slate-500 font-medium line-clamp-2 leading-relaxed">Amoxicillin, Loratadine, Nước muối sinh lý, Xịt mũi Corticoid...</p>
                                    </div>
                                    <button className="w-full py-3.5 border-2 border-dashed border-slate-200 rounded-2xl text-[14px] font-bold text-slate-500 hover:border-primary hover:text-primary hover:bg-primary/5 transition-all mt-6 flex items-center justify-center gap-2.5 active:scale-[0.98]">
                                        <span className="material-symbols-outlined text-[20px] font-bold">save</span>
                                        Lưu đơn hiện tại làm mẫu
                                    </button>
                                </div>
                            </section>

                            <div className="bg-gradient-to-br from-primary to-emerald-600 rounded-2xl p-6 text-white relative overflow-hidden shadow-lg shadow-primary/20">
                                <div className="relative z-10">
                                    <h5 className="font-extrabold text-lg mb-2 leading-tight">Quy định Kê đơn mới nhất</h5>
                                    <p className="text-xs opacity-90 leading-relaxed mb-4 font-medium">Đảm bảo tuân thủ thông tư 27/2021/TT-BYT về đơn thuốc điện tử an toàn.</p>
                                    <button className="bg-white text-primary px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider shadow-md hover:bg-emerald-50 transition-colors">
                                        Xem hướng dẫn
                                    </button>
                                </div>
                                <div className="absolute -right-6 -bottom-6 opacity-20">
                                    <span className="material-symbols-outlined text-[120px] rotate-12">verified_user</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Prescription Modal */}
            <PrescriptionModal
                isOpen={isPrescriptionModalOpen}
                onClose={() => setIsPrescriptionModalOpen(false)}
                isAddingNewMedicine={isAddingNewMedicine}
                setIsAddingNewMedicine={setIsAddingNewMedicine}
                medications={medications}
                removeMedication={removeMedication}
                newMedForm={newMedForm}
                setNewMedForm={setNewMedForm}
                formErrors={formErrors}
                setFormErrors={setFormErrors}
                addMedicationToPrescription={addMedicationToPrescription}
                isSaving={isSavingPrescription}
                onSave={handleSavePrescription}
                patientName="Nguyễn Văn Hùng"
            />
            {/* Success Toast Notification */}
            <Toast
                show={showSuccessToast}
                title="Kê đơn thành công"
                onClose={() => setShowSuccessToast(false)}
                type="success"
            />
        </div>
    );
}
