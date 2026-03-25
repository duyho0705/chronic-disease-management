import { useState } from 'react';
import PrescriptionModal from '../components/PrescriptionModal';
import AdviceModal from '../components/AdviceModal';
import Toast from '../components/Toast';
import TopBar from '../components/TopBar';
import PatientDetailModal from '../components/PatientDetailModal';
import MedicalHistoryModal from '../components/MedicalHistoryModal';

export default function DoctorMessages() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'all' | 'unread'>('all');
    const [isAdviceModalOpen, setIsAdviceModalOpen] = useState(false);
    const [isPrescriptionModalOpen, setIsPrescriptionModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
    const [isAddingNewMedicine, setIsAddingNewMedicine] = useState(false);
    const [medications, setMedications] = useState([
        { id: 1, name: 'Metformin 500mg', intakeType: 'Uống sau khi ăn', dosage: '1 viên', frequency: 'Sáng 1, Tối 1', duration: '30 ngày' },
        { id: 2, name: 'Paracetamol 500mg', intakeType: 'Khi sốt trên 38.5 độ', dosage: '1 viên', frequency: 'Cách 4-6 giờ', duration: '5 ngày' }
    ]);
    const [newMedForm, setNewMedForm] = useState({ name: '', dosage: '', frequency: '', duration: '', intakeType: '' });
    const [formErrors, setFormErrors] = useState({
        name: false,
        dosage: false,
        frequency: false,
        duration: false,
        intakeType: false
    });
    const [adviceCategory, setAdviceCategory] = useState('Dinh dưỡng');
    const [adviceContent, setAdviceContent] = useState('');
    const [showToast, setShowToast] = useState(false);
    const [toastTitle, setToastTitle] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [notifications, setNotifications] = useState([
        { id: 1, title: 'Cảnh báo chỉ số', message: 'Bệnh nhân Nguyễn Văn An có chỉ số đường huyết cao bất thường.', time: '5 phút trước', type: 'warning' },
        { id: 2, title: 'Lịch hẹn mới', message: 'Bạn có một yêu cầu đặt lịch hẹn mới từ Lê Thị Bình.', time: '2 giờ trước', type: 'info' }
    ]);

    const removeMedication = (id: number) => {
        setMedications(medications.filter(m => m.id !== id));
    };

    const addMedicationToPrescription = () => {
        const errors = {
            name: !newMedForm.name,
            dosage: !newMedForm.dosage,
            frequency: !newMedForm.frequency,
            duration: !newMedForm.duration,
            intakeType: !newMedForm.intakeType
        };

        if (Object.values(errors).some(v => v)) {
            setFormErrors(errors);
            return;
        }

        setMedications([...medications, { ...newMedForm, id: Date.now() }]);
        setNewMedForm({ name: '', dosage: '', frequency: '', duration: '', intakeType: '' });
        setIsAddingNewMedicine(false);
        setFormErrors({ name: false, dosage: false, frequency: false, duration: false, intakeType: false });
    };

    const handleSaveAdvice = async () => {
        setIsSaving(true);
        await new Promise(r => setTimeout(r, 1000));
        setIsSaving(false);
        setIsAdviceModalOpen(false);
        setToastTitle('Gửi tư vấn thành công');
        setShowToast(true);
    };

    const handleSavePrescription = async () => {
        setIsSaving(true);
        await new Promise(r => setTimeout(r, 1500));
        setIsSaving(false);
        setIsPrescriptionModalOpen(false);
        setToastTitle('Kê đơn thành công');
        setShowToast(true);
    };

    return (
        <div className="flex h-screen overflow-hidden font-display bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100">
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
                    {[
                        { name: 'Danh sách bệnh nhân', icon: 'groups', href: '/doctor/patients' },
                        { name: 'Phân tích nguy cơ', icon: 'analytics', href: '/doctor/analytics' },
                        { name: 'Đơn thuốc điện tử', icon: 'prescriptions', href: '/doctor/prescriptions' },
                        { name: 'Lịch hẹn khám', icon: 'calendar_today', href: '/doctor/appointments' },
                    ].map((item, idx) => (
                        <a key={idx} className="flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-slate-400 hover:bg-primary/10 hover:text-primary rounded-xl font-medium transition-all" href={item.href}>
                            <span className="material-symbols-outlined">{item.icon}</span>
                            <span>{item.name}</span>
                        </a>
                    ))}
                    <a className="flex items-center gap-3 px-4 py-3 bg-primary text-white rounded-xl font-medium shadow-lg shadow-primary/10 transition-all" href="/doctor/messages">
                        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>chat</span>
                        <span>Tin nhắn</span>
                        <span className="ml-auto bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full">5</span>
                    </a>
                </nav>
                <div className="p-4 mt-auto">
                    <div className="bg-primary/5 rounded-lg p-4 border border-primary/10">
                        <div className="flex items-center gap-3 mb-3">
                            <div
                                className="w-10 h-10 rounded-full bg-slate-200"
                                style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDvD1gNLm_sBMkVyq8FuYHA20LjP97yY90_RzaDO9mjZaL9ubIXYPTKQeV1FDlhsH3p7qndF3QILzvglilx1ly9Sb7AtePxkBlVz8-5HPGNI5wMlA1c27CCvjNz865bvs_Y9uYkK2245BaMa66pFJCTPXK2wTV6-A4oQjShYdPHNg1nx01j-yW7I48c8aShwiEDSx2B_FE04UGkIxELFaJ-Ho65BrMgC_LF9Yk0dKK7BGEGWjFX4zFwmnNWi44sq8khTm_Q-D-Iig4')", backgroundSize: 'cover' }}>
                            </div>
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
            <main className="flex-1 lg:ml-72 flex flex-col h-screen overflow-hidden transition-all duration-300">
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

                <div className="flex flex-1 overflow-hidden w-full">
                    {/* Left Column: Contact List */}
                    <section className="w-80 border-r border-slate-200 dark:border-slate-800 flex flex-col bg-white dark:bg-slate-900/50">
                        <div className="p-4 border-b border-slate-50 dark:border-slate-800">
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
                                <input
                                    className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/50"
                                    placeholder="Tìm kiếm bệnh nhân..."
                                    type="text"
                                />
                            </div>
                        </div>

                        <div className="flex border-b border-slate-200 dark:border-slate-800">
                            <button
                                onClick={() => setActiveTab('all')}
                                className={`flex-1 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'all' ? 'text-primary border-primary' : 'text-slate-500 border-transparent hover:text-slate-700'}`}>
                                Tất cả
                            </button>
                            <button
                                onClick={() => setActiveTab('unread')}
                                className={`flex-1 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'unread' ? 'text-primary border-primary' : 'text-slate-500 border-transparent hover:text-slate-700'}`}>
                                Chưa đọc
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto custom-scrollbar">
                            <div className="p-3 space-y-2">
                                {/* Nguyễn Văn A - Luôn hiển thị vì là chưa đọc */}
                                <div className="flex items-center gap-3 p-3 rounded-xl bg-primary/5 border border-primary/20 cursor-pointer">
                                    <div className="relative">
                                        <img className="size-12 rounded-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBoRl8NTd68SRL_B98uIoSixtoSFJ_WzA_ARggqrddikGEZU5TvmSR2m3O5T1qeyIddTDbGEQsvKPHA9OaIHqdKNbaEb5u1y6Z7lJWYLA551IOrhSYBeCp6TvkUP0oZmg2-z7exCQilm2RhKk0JK8sQVbBkzugjOEBNCgSHCs-VPqtPnPKKBpqqAOzq715qm4QoA0LGmVrHKy2xEvxEK6dE-Oul3-ud2Yg-oRnIg92B1uE_UK7HuaIQHwfRC0N3gSrAxqZqnfedqwU" alt="A" />
                                        <span className="absolute bottom-0 right-0 size-3 bg-green-500 border-2 border-white rounded-full"></span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-center mb-0.5">
                                            <h3 className="text-base font-bold truncate">Nguyễn Văn A</h3>
                                            <span className="text-xs text-slate-400">10:45</span>
                                        </div>
                                        <p className="text-sm text-slate-600 dark:text-slate-400 truncate font-semibold">Bác sĩ ơi, chỉ số huyết áp...</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="px-2 py-0.5 bg-red-100 text-red-600 text-xs rounded-md font-bold uppercase tracking-tighter">Nguy cơ cao</span>
                                        </div>
                                    </div>
                                    <div className="size-6 rounded-full bg-primary flex items-center justify-center text-xs text-white font-bold shadow-sm shadow-primary/30">2</div>
                                </div>

                                {/* Trần Thị B - Chỉ hiển thị khi tab là "Tất cả" */}
                                {activeTab === 'all' && (
                                    <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer">
                                        <img className="size-12 rounded-full object-cover grayscale opacity-70" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCBhD6WWkEmCMteDAhlg1khjJmteYcqGR_yWPtw7M8cvkR3Pz1-1ppF9o5AMWC6HaT2f-5pYOc8QcYtyOYqIwns5BwN129P-TJ0KCcF__-O9EC29r_C_OwDHLBNK4gPhThgBbxZTnZh6_65fKk1BuXOPABOf5XFyVqBB3elRY41Rw1LVHLJb67lK83eFMaCHBlpb8wxLmEDLfeNEowQbIJP7cHp5YfLb_9os0KnEGIqfCwFAk7CcH4yVH_nP5tWbnE2ExIYImKwspU" alt="B" />
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-center mb-0.5">
                                                <h3 className="text-base font-bold truncate text-slate-600 dark:text-slate-400">Trần Thị B</h3>
                                                <span className="text-xs text-slate-400 font-medium">Hôm qua</span>
                                            </div>
                                            <p className="text-sm text-slate-500 truncate font-medium">Vâng, tôi đã nhận được đơn thuốc.</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="px-2 py-0.5 bg-green-100 text-green-600 text-xs rounded-md font-bold uppercase tracking-tighter">Bình thường</span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Lê Văn C - Chỉ hiển thị khi tab là "Tất cả" */}
                                {activeTab === 'all' && (
                                    <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer">
                                        <img className="size-12 rounded-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAc-MU_mpYw71RWBRumDqWQSpX2jT6lqY_yymf4_8OwEvcAeGZzV7l3yAxJ5MF7jROH6_6fdNdNvtucQdPatsAfzP-B49W4vIFviX6tGN97yhtJTuP3BrvS6YgON1wqQxZEmplohMDKvuNYebXLrTKsq0q12FH8pdkhC93H4v8cZNbJLFkBV_JVSSRhTFssTOzM27hXOpef5uBaFNc9JV_YDbeJBtL4rMTTD0AGoZ3LRXHFIL1qr8Avgse8OBgMCCLHYBPdo6QmmNo" alt="C" />
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-center mb-0.5">
                                                <h3 className="text-base font-bold truncate text-slate-600 dark:text-slate-400">Lê Văn C</h3>
                                                <span className="text-xs text-slate-400 font-medium">Thứ 2</span>
                                            </div>
                                            <p className="text-sm text-slate-500 truncate font-medium">Cảm ơn bác sĩ nhiều lắm!</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="px-2 py-0.5 bg-green-100 text-green-600 text-xs rounded-md font-bold uppercase tracking-tighter">Bình thường</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </section>

                    {/* Middle Column: Chat Window */}
                    <section className="flex-1 flex flex-col bg-background-light dark:bg-background-dark">
                        {/* Chat Header */}
                        <div className="h-16 px-6 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="size-10 rounded-full bg-slate-200 overflow-hidden">
                                    <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBdl4_kksFbT62gfvrg2CtlonSa7Z4-XZM2ZIIqD7GDwP0MfR5hA225V5R9ZKlvhjbsete2hJmTwvUHA_aosstZHoV6tM2vXEU5Q7nW9_5dd5svAhpeCbuKH5HmqayCaC04rkWo-EfotJUxEp69MkUz4mEdX8saH1A0UNs5zJJID7n-JJeGjmcq0eSP0Mso0S5aDqFBNhamVQmSpaLrCkNv4TaoqSZ06oNBkzC6TNiRCcAwxJsvIX-khxQ-w5pAG3Of0yZJFNenY1M" alt="A" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold leading-none">Nguyễn Văn A</h3>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="size-2 rounded-full bg-green-500"></span>
                                        <span className="text-xs text-slate-500">Đang hoạt động • 10:45 AM</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"><span className="material-symbols-outlined">call</span></button>
                                <button className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"><span className="material-symbols-outlined">videocam</span></button>
                            </div>
                        </div>

                        {/* Chat History */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
                            <div className="flex justify-center">
                                <span className="text-[13px] bg-slate-200 dark:bg-slate-800 px-2 py-1 rounded-full text-slate-500 font-medium">Hôm nay</span>
                            </div>

                            <div className="flex gap-3 max-w-[80%]">
                                <img className="size-8 rounded-full self-end" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCugxZ95a_v-3AW68QiUMCSrPj_G-Cfl0ygNoDoBH7sjAURggNcXC4KC--moLZZMx3B4m2TOx_TS2VSfyS5bdD4YaETWmaqCLr3CZ7R9OdnTHG8Bgj9y_85jABmvPBkBLEG3k9NC8VUHMJaiWJj3VxNxeKgSWQO0R8WO6MAqJUiDUhV_5kwUUr6_pM0uyhB9LlpdE78cWs5v7fs5GdNu-IK_wZy9ueZZJtcxuEnj3qcCXD--kAUEoOF6ST-sWqLlqrhX0FhvBFloJs" alt="P" />
                                <div className="bg-white dark:bg-slate-800 p-3 rounded-2xl rounded-bl-none shadow-sm border border-slate-100 dark:border-slate-700">
                                    <p className="text-[15px]">Bác sĩ ơi, chỉ số huyết áp của tôi sáng nay đo là 160/95 mmHg. Tôi cảm thấy hơi chóng mặt, có cần điều chỉnh thuốc không ạ?</p>
                                    <span className="text-[13px] text-slate-400 mt-1 block font-bold">10:42 AM</span>
                                </div>
                            </div>

                            <div className="flex flex-row-reverse gap-3 max-w-[80%] ml-auto">
                                <div className="bg-primary text-white p-3 rounded-2xl rounded-br-none shadow-md">
                                    <p className="text-[15px]">Chào anh A, chỉ số 160/95 là khá cao. Anh hãy nghỉ ngơi tại chỗ trong 15-20 phút, tránh vận động mạnh và đo lại nhé.</p>
                                    <span className="text-[13px] opacity-70 mt-1 block text-right font-bold uppercase tracking-tighter">10:44 AM</span>
                                </div>
                            </div>

                            <div className="flex gap-3 max-w-[80%]">
                                <img className="size-8 rounded-full self-end" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAbj29KgBXLWBPKSZdaUeM5dWr-bzaBrxa3Dw06ijYcBv7WpYsmU9h9wHJI4ypLmiHnLjbeN_T8jHyd8Qhvi4Cj_v2O2TiOU06IqDmQ0GSixl8-bDsmQxuEgYA4Vfr4z0dld7KPJWUkoFonI5L0C3uYrACQqyPeSvoYFOj5lGL2m9-gAQbUit8mJzvKR7fBr9KqNks5Mlez4_BHEEe_Rr1mqNlJy6Er3yK2YSfLiI8LgKltFrE3Olj4Qx_LS47T4cc8LK8zvADUjmQ" alt="P" />
                                <div className="bg-white dark:bg-slate-800 p-3 rounded-2xl rounded-bl-none shadow-sm border border-slate-100 dark:border-slate-700">
                                    <p className="text-[15px]">Vâng, tôi đang nằm nghỉ rồi ạ. Tôi có nên uống thêm liều thuốc hạ áp dự phòng không?</p>
                                    <span className="text-[13px] text-slate-400 mt-1 block font-bold">10:45 AM</span>
                                </div>
                            </div>
                        </div>

                        {/* Message Input Area */}
                        <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
                            <div className="flex gap-2 mb-3 overflow-x-auto pb-1 no-scrollbar text-left">
                                <button
                                    onClick={() => setIsAdviceModalOpen(true)}
                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary text-xs font-extrabold rounded-full whitespace-nowrap hover:bg-primary hover:text-white transition-all">
                                    <span className="material-symbols-outlined text-sm">recommend</span> Gửi khuyến nghị
                                </button>
                                <button className="flex items-center gap-1.5 px-3 py-1.5 bg-red-100 text-red-600 text-xs font-extrabold rounded-full whitespace-nowrap hover:bg-red-500 hover:text-white transition-all">
                                    <span className="material-symbols-outlined text-sm">warning</span> Gửi cảnh báo
                                </button>
                                <button
                                    onClick={() => setIsPrescriptionModalOpen(true)}
                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-100 text-blue-600 text-xs font-extrabold rounded-full whitespace-nowrap hover:bg-blue-500 hover:text-white transition-all">
                                    <span className="material-symbols-outlined text-sm">medication</span> Đơn thuốc mới
                                </button>
                            </div>
                            <div className="flex items-end gap-2 px-1">
                                <div className="flex gap-1 mb-2">
                                    <button className="p-2 text-slate-400 hover:text-primary transition-colors"><span className="material-symbols-outlined">image</span></button>
                                    <button className="p-2 text-slate-400 hover:text-primary transition-colors"><span className="material-symbols-outlined">attach_file</span></button>
                                </div>
                                <div className="flex-1 relative">
                                    <textarea rows={1} className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-primary/50 resize-none outline-none" placeholder="Nhập tin nhắn..." />
                                </div>
                                <button className="bg-primary hover:bg-primary/90 text-white p-3 rounded-xl shadow-lg transition-transform active:scale-95 flex items-center justify-center">
                                    <span className="material-symbols-outlined font-bold">send</span>
                                </button>
                            </div>
                        </div>
                    </section>

                    {/* Right Column: Patient Summary */}
                    <section className="w-72 border-l border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col p-5 overflow-y-auto custom-scrollbar">
                        <div className="text-center mb-6">
                            <div className="size-20 mx-auto rounded-full border-4 border-primary/20 p-1 mb-3">
                                <img className="w-full h-full rounded-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAFISugC6Rpeutv2EMF1mKJgLNRCsl5qg11rlHsyeW10Tt4IwD3QZojRXX5GNm14e17phWogUWTZ9RbzM7u4B4JLFRLuUJHOm6CwJeyKFiNRnfIKR4EjL8PovYrTnfnrwp4tmXdx_mSmmk1h5zbrLbXWbNLQfGgExg9bpqRJ7FKBe7b4iOWCETJ8kbntW4QnsM9NZPvhI__l-PXLbH3vDpL6RlU37IfywN4bCq7fGM2znIa4C9kC0i69IVkBLa1reGlZjaIyPGD1CA" alt="Profile" />
                            </div>
                            <h3 className="font-bold text-xl mb-2">Nguyễn Văn A</h3>
                            <div className="flex flex-col text-[15px] font-medium text-slate-500">
                                <span>Giới tính: Nam</span>
                                <span>Tuổi: 85</span>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
                                <div className="flex items-center justify-between mb-4 px-1">
                                    <h4 className="text-[15px] font-medium text-slate-700 leading-none">Chỉ số sinh tồn</h4>
                                    <span className="text-[13px] text-primary font-black tracking-tighter">1 giờ trước</span>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between px-1">
                                        <div className="flex items-center gap-2">
                                            <span className="material-symbols-outlined text-red-500 text-sm">blood_pressure</span>
                                            <span className="text-[15px] font-medium text-slate-600 dark:text-slate-400">Huyết áp</span>
                                        </div>
                                        <span className="text-[15px] font-bold text-red-500">160/95</span>
                                    </div>
                                    <div className="flex items-center justify-between px-1">
                                        <div className="flex items-center gap-2">
                                            <span className="material-symbols-outlined text-blue-500 text-sm">favorite</span>
                                            <span className="text-[15px] font-medium text-slate-600 dark:text-slate-400">Nhịp tim</span>
                                        </div>
                                        <span className="text-[15px] font-bold text-slate-900 dark:text-white">82 bpm</span>
                                    </div>
                                    <div className="flex items-center justify-between px-1">
                                        <div className="flex items-center gap-2">
                                            <span className="material-symbols-outlined text-orange-500 text-sm">water_drop</span>
                                            <span className="text-[15px] font-medium text-slate-600 dark:text-slate-400">Đường huyết</span>
                                        </div>
                                        <span className="text-[15px] font-bold text-slate-900 dark:text-white">6.8 mmol/L</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <h4 className="text-[15px] font-medium text-slate-700 pl-1 mb-3">Lối tắt</h4>
                                {[
                                    { icon: 'description', label: 'Hồ sơ đầy đủ', action: () => setIsDetailModalOpen(true) },
                                    { icon: 'pill', label: 'Kê đơn thuốc', action: () => setIsPrescriptionModalOpen(true) },
                                    { icon: 'history', label: 'Lịch sử khám', action: () => setIsHistoryModalOpen(true) }
                                ].map((item, idx) => (
                                    <button
                                        key={idx}
                                        onClick={item.action}
                                        className="w-full flex items-center justify-between p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="material-symbols-outlined text-primary text-xl">{item.icon}</span>
                                            <span className="text-[15px] font-medium text-slate-700 dark:text-slate-300 tracking-tight">{item.label}</span>
                                        </div>
                                        <span className="material-symbols-outlined text-slate-300 group-hover:text-primary transition-all text-xl">chevron_right</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="mt-8 p-4 bg-orange-50 dark:bg-orange-950/20 rounded-2xl border border-orange-100 dark:border-orange-900/30 relative overflow-hidden group">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="material-symbols-outlined text-red-500 text-lg font-bold">info</span>
                                <h5 className="text-[15px] font-medium text-slate-700">Ghi chú nhanh</h5>
                            </div>
                            <p className="text-[14px] text-slate-600 dark:text-slate-400 italic font-medium leading-relaxed">
                                "Bệnh nhân có tiền sử cao huyết áp mãn tính, cần theo dõi sát sao vào buổi sáng."
                            </p>
                        </div>
                    </section>
                </div>
            </main>

            <AdviceModal
                isOpen={isAdviceModalOpen}
                onClose={() => setIsAdviceModalOpen(false)}
                adviceCategory={adviceCategory}
                setAdviceCategory={setAdviceCategory}
                adviceContent={adviceContent}
                setAdviceContent={setAdviceContent}
                isSaving={isSaving}
                onSave={handleSaveAdvice}
                patientName="Nguyễn Văn A"
            />

            <PatientDetailModal
                isOpen={isDetailModalOpen}
                onClose={() => setIsDetailModalOpen(false)}
                patient={{
                    id: 1,
                    name: "Nguyễn Văn A",
                    gender: "Nam",
                    age: 85,
                    email: "nguyenvan.a@example.com",
                    phone: "0901 222 333",
                    address: "123 Đường Lê Lợi, Quận 1, TP.HCM",
                    joinDate: "15/01/2024",
                    risk: "Cao",
                    lastVisit: "2 giờ trước",
                    bloodType: "A+",
                    height: "172 cm",
                    weight: "68 kg",
                    diagnose: "Tăng huyết áp vô căn, Đái tháo đường Tuýp 2",
                    vitals: {
                        bp: "160/95",
                        hr: "82",
                        temp: "36.8",
                        glu: "6.8"
                    }
                }}
            />

            <MedicalHistoryModal
                isOpen={isHistoryModalOpen}
                onClose={() => setIsHistoryModalOpen(false)}
                patientName="Nguyễn Văn A"
                patientAvatar="https://i.pravatar.cc/150?u=Nguyễn+Văn+A"
            />

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
                isSaving={isSaving}
                onSave={handleSavePrescription}
                patientName="Nguyễn Văn A"
            />

            <Toast
                show={showToast}
                title={toastTitle}
                onClose={() => setShowToast(false)}
            />
        </div>
    );
}