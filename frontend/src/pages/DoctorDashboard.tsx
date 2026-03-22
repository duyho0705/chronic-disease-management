import { useState } from 'react';

export default function DoctorDashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAdviceModalOpen, setIsAdviceModalOpen] = useState(false);
  const [isPrescriptionModalOpen, setIsPrescriptionModalOpen] = useState(false);
  const [isAddingNewMedicine, setIsAddingNewMedicine] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [medications, setMedications] = useState([
    { id: 1, name: 'Metformin 500mg', intakeType: 'Uống sau khi ăn', dosage: '1 viên', frequency: 'Sáng 1, Tối 1', duration: '30 ngày' },
    { id: 2, name: 'Paracetamol 500mg', intakeType: 'Khi sốt trên 38.5 độ', dosage: '1 viên', frequency: 'Cách 4-6 giờ', duration: '5 ngày' }
  ]);

  const [newMedForm, setNewMedForm] = useState({
    name: '',
    dosage: '',
    frequency: '',
    duration: '',
    intakeType: ''
  });

  const [formErrors, setFormErrors] = useState<Record<string, boolean>>({});
  const [selectedTime, setSelectedTime] = useState('09:00');
  const [selectedDay, setSelectedDay] = useState(5);
  const [adviceCategory, setAdviceCategory] = useState('Dinh dưỡng');
  const [adviceContent, setAdviceContent] = useState('');
  const [currentMonth, setCurrentMonth] = useState(10); // November (0-indexed)
  const [currentYear, setCurrentYear] = useState(2024);
  const [showToast, setShowToast] = useState(false);
  const [toastTitle, setToastTitle] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const removeMedication = (id: number) => {
    setMedications(medications.filter(m => m.id !== id));
  };

  const addMedicationToPrescription = () => {
    const errors: Record<string, boolean> = {};
    if (!newMedForm.name) errors.name = true;
    if (!newMedForm.dosage) errors.dosage = true;
    if (!newMedForm.frequency) errors.frequency = true;
    if (!newMedForm.duration) errors.duration = true;
    if (!newMedForm.intakeType) errors.intakeType = true;

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const newId = medications.length > 0 ? Math.max(...medications.map(m => m.id)) + 1 : 1;
    setMedications([...medications, { id: newId, ...newMedForm }]);
    setIsAddingNewMedicine(false);
    setNewMedForm({ name: '', dosage: '', frequency: '', duration: '', intakeType: '' });
    setFormErrors({});
  };
  return (
    <div className="flex min-h-screen font-display bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100">
      {/* Sidebar Navigation - Responsive Collapsible */}
      <aside className={`fixed left-0 top-0 bottom-0 bg-white dark:bg-slate-900 border-r border-primary/10 flex flex-col z-[150] transition-transform duration-300 w-72 lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} shadow-2xl lg:shadow-none shadow-primary/10`}>
        <div className="p-6 flex items-center gap-3 border-b border-primary/5">
          <div className="w-10 h-10 bg-primary flex items-center justify-center rounded-xl text-white shadow-lg shadow-primary/20">
            <span className="material-symbols-outlined fill-1">health_metrics</span>
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 dark:text-white leading-none">Sống Khỏe</h1>
            <p className="text-xs text-primary font-semibold uppercase tracking-wider">Hệ thống quản lý</p>
          </div>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto custom-scrollbar">
          <a className="flex items-center gap-3 px-4 py-3 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/10 transition-all" href="/doctor">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>dashboard</span>
            <span>Bảng điều khiển</span>
          </a>
          {[
            { name: 'Danh sách bệnh nhân', icon: 'groups' },
            { name: 'Phân tích nguy cơ', icon: 'analytics' },
            { name: 'Đơn thuốc điện tử', icon: 'prescriptions' },
            { name: 'Lịch hẹn khám', icon: 'calendar_today' },
          ].map((item, idx) => (
            <a key={idx} className="flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-slate-400 hover:bg-primary/10 hover:text-primary rounded-xl font-bold transition-all" href="#">
              <span className="material-symbols-outlined">{item.icon}</span>
              <span>{item.name}</span>
            </a>
          ))}
          <a className="flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-slate-400 hover:bg-primary/10 hover:text-primary rounded-xl font-bold transition-all" href="/doctor/messages">
            <span className="material-symbols-outlined">chat</span>
            <span>Tin nhắn</span>
            <span className="ml-auto bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full">5</span>
          </a>
        </nav>
        <div className="p-4 mt-auto">
          <div className="bg-primary/5 rounded-2xl p-4 border border-primary/10">
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-10 h-10 rounded-full bg-slate-200"
                data-alt="Bác sĩ Lê Minh Tâm portrait profile"
                style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDvD1gNLm_sBMkVyq8FuYHA20LjP97yY90_RzaDO9mjZaL9ubIXYPTKQeV1FDlhsH3p7qndF3QILzvglilx1ly9Sb7AtePxkBlVz8-5HPGNI5wMlA1c27CCvjNz865bvs_Y9uYkK2245BaMa66pFJCTPXK2wTV6-A4oQjShYdPHNg1nx01j-yW7I48c8aShwiEDSx2B_FE04UGkIxELFaJ-Ho65BrMgC_LF9Yk0dKK7BGEGWjFX4zFwmnNWi44sq8khTm_Q-D-Iig4')" }}>
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

      {/* Main Content Area - Responsive Flex */}
      <main className="flex-1 lg:ml-72 min-h-screen flex flex-col transition-all duration-300">
        {/* Mobile Sidebar Overlay */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[140] lg:hidden animate-in fade-in duration-300"
            onClick={() => setIsSidebarOpen(false)}
          ></div>
        )}
        {/* Top Bar - Responsive Header */}
        <header className="h-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-primary/5 px-4 md:px-8 flex items-center justify-between sticky top-0 z-[100] transition-all">
          <div className="flex items-center gap-4 flex-1 text-left">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden w-10 h-10 flex items-center justify-center text-slate-600 dark:text-slate-400 bg-background-light dark:bg-slate-800 rounded-xl"
            >
              <span className="material-symbols-outlined">menu</span>
            </button>
            <div className="hidden sm:block w-64 lg:w-96 relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
              <input
                className="w-full pl-10 pr-4 py-2.5 bg-background-light dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-primary/50 placeholder-slate-400 text-sm"
                placeholder="Tìm kiếm bệnh nhân..."
                type="text"
              />
            </div>
          </div>
          <div className="flex items-center gap-2 md:gap-4 ml-4">
            <button className="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center rounded-xl bg-background-light dark:bg-slate-800 text-slate-600 relative">
              <span className="material-symbols-outlined text-xl">notifications</span>
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            </button>
            <div className="hidden xs:block h-8 w-px bg-slate-200 dark:bg-slate-700 mx-1 md:mx-2"></div>
            <button className="bg-primary hover:bg-primary/90 text-slate-900 font-bold px-3 py-2 md:px-4 md:py-2.5 rounded-xl text-xs md:text-sm flex items-center gap-2 transition-all shadow-lg shadow-primary/20">
              <span className="material-symbols-outlined text-lg">add</span>
              <span className="hidden md:inline">Thêm bệnh nhân</span>
            </button>
          </div>
        </header>

        <div className="p-4 md:p-8 space-y-6 md:space-y-8">
          {/* Summary Cards */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-primary/5 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined size-6">person</span>
                </div>
                <span className="text-xs font-bold text-green-500 flex items-center">+2.4% <span className="material-symbols-outlined text-xs">trending_up</span></span>
              </div>
              <h3 className="text-slate-500 text-sm font-medium">Tổng bệnh nhân</h3>
              <p className="text-3xl font-extrabold mt-1">1,250</p>
            </div>
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-primary/5 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center text-red-500">
                  <span className="material-symbols-outlined size-6">emergency</span>
                </div>
                <span className="px-2 py-1 bg-red-500 text-white text-[10px] font-bold rounded-full">Cảnh báo</span>
              </div>
              <h3 className="text-slate-500 text-sm font-medium">Nguy cơ cao</h3>
              <p className="text-3xl font-extrabold mt-1 text-red-500">12</p>
            </div>
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-primary/5 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center text-blue-500">
                  <span className="material-symbols-outlined size-6">event_upcoming</span>
                </div>
              </div>
              <h3 className="text-slate-500 text-sm font-medium">Lịch hẹn chờ</h3>
              <p className="text-3xl font-extrabold mt-1">08</p>
            </div>
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-primary/5 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center text-amber-500">
                  <span className="material-symbols-outlined size-6">mail</span>
                </div>
              </div>
              <h3 className="text-slate-500 text-sm font-medium">Tin nhắn mới</h3>
              <p className="text-3xl font-extrabold mt-1">05</p>
            </div>
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* High Risk Patients Section */}
            <section className="lg:col-span-2 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-extrabold flex items-center gap-2">
                  <span className="material-symbols-outlined text-red-500">warning</span>
                  Phân tích nguy cơ cao
                </h2>
                <button className="text-primary text-sm font-bold hover:underline">Xem tất cả</button>
              </div>
              <div className="space-y-4">
                {/* Patient Card 1 */}
                <div className="bg-white dark:bg-slate-900 p-4 md:p-5 rounded-2xl border-l-4 border-l-red-500 border border-primary/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-4">
                    <div
                      className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-slate-100 overflow-hidden flex-shrink-0"
                      data-alt="Portrait of patient Nguyễn Văn A"
                      style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBUstbGh5q911TPTLus7gX2RIO2ML_RSZbjV67EFkDBw0zf6vQQzS7IP3LwXkWI6OWS4mwx5KhEFyn-NJ5T-OeMOhMLb321T1uEw1ypz_mfVSy4RJSGZA4h5NHgwDOx8syKTRjqsnQ5cRRZlRIs0lxo8cA7nJHIBpBUgVAUxh3e6QkBpGR5iW1WaEsU3Xu5JdVd5WA_HjKsBFimtKG_GF5CgYz-JAa03FTdaPVVyoP_Kqd8-PCCC03jKnqOMbqTRYOC5StfAJMV2wM')" }}>
                    </div>
                    <div>
                      <p className="font-bold text-base md:text-lg text-slate-900 dark:text-white">Nguyễn Văn A</p>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                        <span>65 tuổi</span>
                        <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                        <span className="truncate max-w-[150px]">Tăng huyết áp vô căn</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center sm:flex-col justify-between w-full sm:w-auto sm:text-center px-0 sm:px-6 py-3 sm:py-0 border-y sm:border-y-0 border-slate-50 dark:border-slate-800">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Xu hướng HA</p>
                    <div className="flex items-center gap-2">
                      <p className="text-red-500 font-extrabold text-base md:text-lg">165/105</p>
                      <span className="text-[10px] text-red-500 font-medium sm:hidden block leading-none">(+12)</span>
                    </div>
                    <p className="text-[10px] text-red-400 font-bold hidden sm:block uppercase">Tăng mạnh (+12)</p>
                  </div>
                  <div className="flex flex-row sm:flex-col gap-2 w-full sm:w-auto">
                    <span className="flex-1 sm:flex-none bg-red-100 text-red-600 text-[10px] font-bold px-3 py-1.5 rounded-full text-center">Nguy cấp</span>
                    <button className="flex-1 sm:flex-none bg-primary/10 hover:bg-primary/20 text-primary text-xs font-bold py-2 px-4 rounded-lg transition-colors">Chi tiết</button>
                  </div>
                </div>

                {/* Patient Card 2 */}
                <div className="bg-white dark:bg-slate-900 p-4 md:p-5 rounded-2xl border-l-4 border-l-amber-500 border border-primary/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-4">
                    <div
                      className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-slate-100 overflow-hidden flex-shrink-0"
                      data-alt="Portrait of patient Trần Thị B"
                      style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCCDiBOPC4Ri1uCn0UiQKsD0FNq2ppk_uufmJ8W853OiEN3FNDmSyauZYh6rl-IhcTT89g2n_dlyl37uVr1KjOwv8CLC6IjiAM1cZBiELmdPBdGK70zx7052NrAvmXu7gXJ3sHiz3GEMfdCHKfb_Bnid5RhmQZawRE1pPFWJcTLkQhUj8qmOgQ87zWDN9l5Ob5D6U3Ab--WDeLBpzwytlNhMQDzDRPCqyY7Ga_WkyOVyTF0KbP3EH2JiGgiSX7mIfXPQx5acbe6Hmc')" }}>
                    </div>
                    <div>
                      <p className="font-bold text-base md:text-lg text-slate-900 dark:text-white">Trần Thị B</p>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                        <span>52 tuổi</span>
                        <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                        <span className="truncate max-w-[150px]">Rối loạn nhịp tim</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center sm:flex-col justify-between w-full sm:w-auto sm:text-center px-0 sm:px-6 py-3 sm:py-0 border-y sm:border-y-0 border-slate-50 dark:border-slate-800">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Nhịp tim</p>
                    <p className="text-amber-500 font-extrabold text-base md:text-lg">112 bpm</p>
                    <p className="text-[10px] text-amber-400 font-bold hidden sm:block uppercase">Không ổn định</p>
                  </div>
                  <div className="flex flex-row sm:flex-col gap-2 w-full sm:w-auto">
                    <span className="flex-1 sm:flex-none bg-amber-100 text-amber-600 text-[10px] font-bold px-3 py-1.5 rounded-full text-center">Cần theo dõi</span>
                    <button className="flex-1 sm:flex-none bg-primary/10 hover:bg-primary/20 text-primary text-xs font-bold py-2 px-4 rounded-lg transition-colors">Chi tiết</button>
                  </div>
                </div>
              </div>

              {/* Trend Chart Placeholder */}
              <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-primary/5 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="font-bold">Xu hướng sức khỏe cộng đồng</h3>
                    <p className="text-xs text-slate-500">Thống kê dữ liệu lâm sàng theo tuần</p>
                  </div>
                  <select className="text-xs border-primary/10 rounded-lg bg-background-light dark:bg-slate-800 focus:ring-primary">
                    <option>7 ngày qua</option>
                    <option>30 ngày qua</option>
                  </select>
                </div>
                <div className="h-48 flex items-end justify-between gap-2 px-2">
                  <div className="w-full bg-primary/20 rounded-t-lg relative group h-[40%]">
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity">42</div>
                  </div>
                  <div className="w-full bg-primary/30 rounded-t-lg relative group h-[60%]"></div>
                  <div className="w-full bg-primary/40 rounded-t-lg relative group h-[55%]"></div>
                  <div className="w-full bg-primary/60 rounded-t-lg relative group h-[75%]"></div>
                  <div className="w-full bg-primary rounded-t-lg relative group h-[90%]"></div>
                  <div className="w-full bg-primary/80 rounded-t-lg relative group h-[85%]"></div>
                  <div className="w-full bg-primary/70 rounded-t-lg relative group h-[70%]"></div>
                </div>
                <div className="flex justify-between mt-4 px-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  <span>Th2</span><span>Th3</span><span>Th4</span><span>Th5</span><span>Th6</span><span>Th7</span><span>CN</span>
                </div>
              </div>
            </section>

            {/* Sidebar Content */}
            <aside className="space-y-8">
              {/* Quick Actions */}
              <section>
                <h2 className="text-xl font-extrabold mb-4">Thao tác nhanh</h2>
                <div className="grid grid-cols-1 gap-3">
                  <button
                    onClick={() => setIsPrescriptionModalOpen(true)}
                    className="flex items-center gap-4 p-4 bg-white dark:bg-slate-900 hover:border-primary transition-all rounded-2xl border border-primary/10 shadow-sm text-left group">
                    <div className="w-10 h-10 bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white rounded-xl flex items-center justify-center transition-colors">
                      <span className="material-symbols-outlined">description</span>
                    </div>
                    <span className="font-bold text-sm">Kê đơn thuốc mới</span>
                  </button>
                  <button
                    onClick={() => setIsAdviceModalOpen(true)}
                    className="flex items-center gap-4 p-4 bg-white dark:bg-slate-900 hover:border-primary transition-all rounded-2xl border border-primary/10 shadow-sm text-left group">
                    <div className="w-10 h-10 bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white rounded-xl flex items-center justify-center transition-colors">
                      <span className="material-symbols-outlined">send</span>
                    </div>
                    <span className="font-bold text-sm">Gửi lời khuyên</span>
                  </button>
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-4 p-4 bg-white dark:bg-slate-900 hover:border-primary transition-all rounded-2xl border border-primary/10 shadow-sm text-left group">
                    <div className="w-10 h-10 bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white rounded-xl flex items-center justify-center transition-colors">
                      <span className="material-symbols-outlined">event</span>
                    </div>
                    <span className="font-bold text-sm">Đặt lịch tái khám</span>
                  </button>
                </div>
              </section>

              {/* Recent Appointments */}
              <section>
                <h2 className="text-xl font-extrabold mb-4">Lịch hẹn sắp tới</h2>
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-primary/5 shadow-sm divide-y divide-primary/5 overflow-hidden">
                  <div className="p-4 flex items-center gap-4">
                    <div className="flex-shrink-0 text-center">
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Hôm nay</p>
                      <p className="text-lg font-extrabold text-primary leading-none">14:30</p>
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <p className="font-bold truncate text-sm">Lê Văn C</p>
                      <p className="text-xs text-slate-500">Khám định kỳ Tiểu đường</p>
                    </div>
                    <span className="material-symbols-outlined text-slate-300">chevron_right</span>
                  </div>
                  <div className="p-4 flex items-center gap-4">
                    <div className="flex-shrink-0 text-center">
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Hôm nay</p>
                      <p className="text-lg font-extrabold text-primary leading-none">15:15</p>
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <p className="font-bold truncate text-sm">Phạm Minh H</p>
                      <p className="text-xs text-slate-500">Tư vấn xét nghiệm</p>
                    </div>
                    <span className="material-symbols-outlined text-slate-300">chevron_right</span>
                  </div>
                  <div className="p-4 flex items-center gap-4 bg-background-light dark:bg-slate-800/50">
                    <div className="flex-shrink-0 text-center opacity-50">
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Mai</p>
                      <p className="text-lg font-extrabold text-slate-400 leading-none">09:00</p>
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <p className="font-bold truncate text-sm opacity-50">Hoàng Thu T</p>
                      <p className="text-xs text-slate-500">Kiểm tra hậu phẫu</p>
                    </div>
                    <span className="material-symbols-outlined text-slate-300">chevron_right</span>
                  </div>
                </div>
                <button className="w-full mt-4 py-3 border border-dashed border-primary/30 text-primary font-bold text-sm rounded-xl hover:bg-primary/5 transition-colors">
                  Xem toàn bộ lịch trình
                </button>
              </section>
            </aside>
          </div>

          {/* Patient Management Table */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-extrabold">Quản lý bệnh nhân gần đây</h2>
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-white dark:bg-slate-800 border border-primary/10 rounded-lg text-xs font-bold">Lọc theo khoa</button>
                <button className="px-4 py-2 bg-white dark:bg-slate-800 border border-primary/10 rounded-lg text-xs font-bold">Xuất báo cáo</button>
              </div>
            </div>
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-primary/5 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <div className="min-w-[800px]">
                  <table className="w-full text-left">
                    <thead className="bg-primary/5 border-b border-primary/5">
                      <tr>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase rounded-tl-2xl">Bệnh nhân</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Chỉ số gần nhất</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Tình trạng</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Cập nhật lần cuối</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-right rounded-tr-2xl">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-primary/5">
                      <tr className="hover:bg-primary/5 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div
                              className="w-8 h-8 rounded-full bg-slate-200"
                              data-alt="Patient Lê Văn C avatar"
                              style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBJEsF1IgDAZeuRPhLHaETdduvDn0twzgerBYISsu1tmyhYPZUrXiZR1mfQ0OWEP-jGEPlV2VzQcbWcusjUKCa_2Dtm0-leXmrRQvCS2y_3HimgCcjd-B3S40Prl4L-3riU5-mixukjTxc51XQ8vKFAsOcUiotrLEN2amViOh_IXjuESo6OGTG_yqQ0kup5LPHi5wdUkRbGAwk1WTQtE1rxscpA2ZH7E_6XCLaXZM_tK9LzC5sQNdUIApT3pQ30RJM5n8bnHoo7qf0')" }}>
                            </div>
                            <div>
                              <p className="text-sm font-bold">Lê Văn C</p>
                              <p className="text-[10px] text-slate-400">ID: #SK-2034</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-3">
                            <div className="text-xs">
                              <p className="text-slate-400">Glucose</p>
                              <p className="font-bold">7.2 mmol/L</p>
                            </div>
                            <div className="text-xs">
                              <p className="text-slate-400">SpO2</p>
                              <p className="font-bold">98%</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-1 bg-green-100 text-green-600 text-[10px] font-bold rounded-md">Ổn định</span>
                        </td>
                        <td className="px-6 py-4 text-xs text-slate-500">10 phút trước</td>
                        <td className="px-6 py-4 text-right relative">
                          <button
                            onClick={() => setActiveMenu(activeMenu === 'bn1' ? null : 'bn1')}
                            className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-primary hover:bg-primary/5 rounded-full transition-all ml-auto">
                            <span className="material-symbols-outlined">more_vert</span>
                          </button>

                          {activeMenu === 'bn1' && (
                            <>
                              <div className="fixed inset-0 z-20" onClick={() => setActiveMenu(null)}></div>
                              <div className="absolute right-6 top-12 w-56 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 py-2 z-30 animate-in fade-in slide-in-from-top-2 duration-200 overflow-hidden text-left">
                                <button className="w-full px-4 py-3 text-left hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-3 group">
                                  <span className="material-symbols-outlined text-slate-400 group-hover:text-primary text-xl">visibility</span>
                                  <span className="text-sm font-bold text-slate-600 dark:text-slate-300">Xem chi tiết hồ sơ</span>
                                </button>
                                <button
                                  onClick={() => { setIsAdviceModalOpen(true); setActiveMenu(null); }}
                                  className="w-full px-4 py-3 text-left hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-3 group">
                                  <span className="material-symbols-outlined text-slate-400 group-hover:text-primary text-xl">send</span>
                                  <span className="text-sm font-bold text-slate-600 dark:text-slate-300">Gửi lời khuyên</span>
                                </button>
                                <button
                                  onClick={() => { setIsPrescriptionModalOpen(true); setActiveMenu(null); }}
                                  className="w-full px-4 py-3 text-left hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-3 group">
                                  <span className="material-symbols-outlined text-slate-400 group-hover:text-primary text-xl">description</span>
                                  <span className="text-sm font-bold text-slate-600 dark:text-slate-300">Kê đơn thuốc</span>
                                </button>
                                <div className="border-t border-slate-100 dark:border-slate-800 my-1"></div>
                                <button
                                  onClick={() => { setIsModalOpen(true); setActiveMenu(null); }}
                                  className="w-full px-4 py-3 text-left hover:bg-primary/10 dark:hover:bg-primary/20 transition-colors flex items-center gap-3 group">
                                  <span className="material-symbols-outlined text-primary text-xl">event</span>
                                  <span className="text-sm font-bold text-primary">Đặt lịch tái khám</span>
                                </button>
                              </div>
                            </>
                          )}
                        </td>
                      </tr>
                      <tr className="hover:bg-primary/5 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div
                              className="w-8 h-8 rounded-full bg-slate-200"
                              data-alt="Patient Phạm Minh H avatar"
                              style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAVWHXZK60rwm9MmaiA29VqP8ASQil3c591s5uuDkVdKwjsRUz9RHL00AwcIvKfnm7sTOXzKNKN-nbUXzpn8_j5rS9-8y8-OLkWoG_bIJ-tvNu7kA5TN0IqYWvQTamN9pwGFHfvgkGuyil2rYepRAyvMBn9AzFgopcwac8GX4iwy5aaHqtE6N4CzrwJf_kIMQWAO0QGQRpmQCZwYxcMQqaUSBGFRzbKGyvoidiTokz-2varrt7wx1PwpL0TgtgO3T9xoYBE0wh875k')" }}>
                            </div>
                            <div>
                              <p className="text-sm font-bold">Phạm Minh H</p>
                              <p className="text-[10px] text-slate-400">ID: #SK-2155</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-3">
                            <div className="text-xs">
                              <p className="text-slate-400">Huyết áp</p>
                              <p className="font-bold">135/85</p>
                            </div>
                            <div className="text-xs">
                              <p className="text-slate-400">BMI</p>
                              <p className="font-bold">24.5</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-1 bg-amber-100 text-amber-600 text-[10px] font-bold rounded-md">Cần kiểm tra</span>
                        </td>
                        <td className="px-6 py-4 text-xs text-slate-500">2 giờ trước</td>
                        <td className="px-6 py-4 text-right relative">
                          <button
                            onClick={() => setActiveMenu(activeMenu === 'bn2' ? null : 'bn2')}
                            className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-primary hover:bg-primary/5 rounded-full transition-all ml-auto">
                            <span className="material-symbols-outlined">more_vert</span>
                          </button>

                          {activeMenu === 'bn2' && (
                            <>
                              <div className="fixed inset-0 z-20" onClick={() => setActiveMenu(null)}></div>
                              <div className="absolute right-6 bottom-full mb-2 w-56 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 py-2 z-30 animate-in fade-in slide-in-from-bottom-2 duration-200 overflow-hidden text-left">
                                <button className="w-full px-4 py-3 text-left hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-3 group">
                                  <span className="material-symbols-outlined text-slate-400 group-hover:text-primary text-xl">visibility</span>
                                  <span className="text-sm font-bold text-slate-600 dark:text-slate-300">Xem chi tiết hồ sơ</span>
                                </button>
                                <button
                                  onClick={() => { setIsAdviceModalOpen(true); setActiveMenu(null); }}
                                  className="w-full px-4 py-3 text-left hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-3 group">
                                  <span className="material-symbols-outlined text-slate-400 group-hover:text-primary text-xl">send</span>
                                  <span className="text-sm font-bold text-slate-600 dark:text-slate-300">Gửi lời khuyên</span>
                                </button>
                                <button
                                  onClick={() => { setIsPrescriptionModalOpen(true); setActiveMenu(null); }}
                                  className="w-full px-4 py-3 text-left hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-3 group">
                                  <span className="material-symbols-outlined text-slate-400 group-hover:text-primary text-xl">description</span>
                                  <span className="text-sm font-bold text-slate-600 dark:text-slate-300">Kê đơn thuốc</span>
                                </button>
                                <div className="border-t border-slate-100 dark:border-slate-800 my-1"></div>
                                <button
                                  onClick={() => { setIsModalOpen(true); setActiveMenu(null); }}
                                  className="w-full px-4 py-3 text-left hover:bg-primary/10 dark:hover:bg-primary/20 transition-colors flex items-center gap-3 group">
                                  <span className="material-symbols-outlined text-primary text-xl">event</span>
                                  <span className="text-sm font-bold text-primary">Đặt lịch tái khám</span>
                                </button>
                              </div>
                            </>
                          )}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Rescheduling Appointment Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]"
            onClick={() => setIsModalOpen(false)}
          ></div>

          <div className="relative bg-white dark:bg-slate-900 w-full max-w-4xl rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] md:max-h-[90vh] animate-in fade-in zoom-in duration-200 border border-primary/10 transition-all mx-2 md:mx-4">
            <div className="px-6 md:px-10 py-5 md:py-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900 sticky top-0 z-10 transition-all">
              <div>
                <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-white">Đặt lịch tái khám</h2>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-all"
              >
                <span className="material-symbols-outlined font-bold">close</span>
              </button>
            </div>

            <div className="p-6 md:p-10 overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold border-l-4 border-primary pl-2">Thông tin bệnh nhân</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                        <span className="material-symbols-outlined text-slate-400 text-sm">person</span>
                      </div>
                      <select className="w-full pl-12 pr-10 py-3.5 bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-primary/50 text-slate-900 dark:text-white font-bold text-sm appearance-none bg-none outline-none shadow-sm transition-all">
                        <option value="1">Nguyễn Văn A - ID: BN-8842</option>
                        <option value="2">Trần Thị B - ID: BN-8839</option>
                        <option value="3">Lê Văn C - ID: BN-2034</option>
                      </select>
                      <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-400 font-bold">
                        <span className="material-symbols-outlined">expand_more</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-bold border-l-4 border-primary pl-2">Chọn ngày khám</label>
                    <div className="p-8 border border-slate-100 dark:border-slate-800 rounded-3xl bg-white dark:bg-slate-800/20 shadow-sm">
                      <div className="flex items-center justify-between mb-6">
                        <button
                          type="button"
                          onClick={() => {
                            if (currentMonth === 0) {
                              setCurrentMonth(11);
                              setCurrentYear(prev => prev - 1);
                            } else {
                              setCurrentMonth(prev => prev - 1);
                            }
                          }}
                          className="p-2 hover:bg-primary/10 rounded-xl transition-all text-slate-400 hover:text-primary active:scale-90"
                        >
                          <span className="material-symbols-outlined font-bold">chevron_left</span>
                        </button>
                        <span className="text-sm font-bold text-primary px-4">
                          Tháng {currentMonth + 1}, {currentYear}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            if (currentMonth === 11) {
                              setCurrentMonth(0);
                              setCurrentYear(prev => prev + 1);
                            } else {
                              setCurrentMonth(prev => prev + 1);
                            }
                          }}
                          className="p-2 hover:bg-primary/10 rounded-xl transition-all text-slate-400 hover:text-primary active:scale-90"
                        >
                          <span className="material-symbols-outlined font-bold">chevron_right</span>
                        </button>
                      </div>
                      <div className="grid grid-cols-7 text-center text-xs font-extrabold text-slate-400 mb-2 uppercase tracking-widest opacity-60">
                        <div>S</div><div>M</div><div>T</div><div>W</div><div>T</div><div>F</div><div>S</div>
                      </div>
                      <div className="grid grid-cols-7 gap-3">
                        {[27, 28, 29, 30, 31].map(d => <div key={d} className="text-xs h-10 flex items-center justify-center text-slate-300 font-medium">{d}</div>)}
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16].map(d => (
                          <button
                            key={d}
                            type="button"
                            onClick={() => setSelectedDay(d)}
                            className={`text-xs font-extrabold h-10 flex items-center justify-center rounded-xl transition-all ${selectedDay === d
                              ? 'bg-primary text-slate-900 shadow-xl shadow-primary/20 transform scale-110 z-10'
                              : 'hover:bg-primary/10 hover:text-primary'
                              }`}
                          >
                            {d}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="space-y-3">
                    <label className="text-sm font-bold border-l-4 border-primary pl-2">Hình thức khám bệnh</label>
                    <div className="flex gap-4">
                      <label className="flex-1 cursor-pointer group">
                        <input defaultChecked className="peer hidden" name="resched-type" type="radio" />
                        <div className="flex flex-col items-center gap-3 px-4 py-5 rounded-2xl border-2 border-slate-100 dark:border-slate-800 peer-checked:border-primary peer-checked:bg-primary/5 peer-checked:text-primary transition-all hover:border-primary/30">
                          <span className="material-symbols-outlined text-3xl font-light group-hover:scale-110 transition-transform">person_pin_circle</span>
                          <span className="text-[10px] font-extrabold uppercase tracking-widest">Trực tiếp</span>
                        </div>
                      </label>
                      <label className="flex-1 cursor-pointer group">
                        <input className="peer hidden" name="resched-type" type="radio" />
                        <div className="flex flex-col items-center gap-3 px-4 py-5 rounded-2xl border-2 border-slate-100 dark:border-slate-800 peer-checked:border-primary peer-checked:bg-primary/5 peer-checked:text-primary transition-all hover:border-primary/30">
                          <span className="material-symbols-outlined text-3xl font-light group-hover:scale-110 transition-transform">videocam</span>
                          <span className="text-[10px] font-extrabold uppercase tracking-widest">Online</span>
                        </div>
                      </label>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-bold border-l-4 border-primary pl-2">Giờ khám ưu tiên</label>
                    <div className="grid grid-cols-4 gap-3">
                      {['08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '14:00', '14:30'].map(time => (
                        <button
                          key={time}
                          type="button"
                          onClick={() => setSelectedTime(time)}
                          className={`py-3 text-xs font-extrabold rounded-xl border-2 transition-all ${selectedTime === time
                            ? 'border-primary bg-primary/5 text-primary scale-105 shadow-sm shadow-primary/10'
                            : 'border-slate-50 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 hover:border-primary/30'
                            }`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-bold border-l-4 border-primary pl-2">Ghi chú lâm sàng</label>
                    <textarea
                      className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-primary/50 text-slate-900 dark:text-white placeholder:text-slate-400 text-sm font-medium transition-all shadow-sm outline-none resize-none"
                      placeholder="BS ghi chú thêm dặn dò cho bệnh nhân tại đây..."
                      rows={3}
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-10 py-6 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3 sticky bottom-0 z-10 transition-all">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-8 py-3 text-sm font-bold text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl transition-all"
              >
                Hủy bỏ
              </button>
              <button
                onClick={async () => {
                  setIsSaving(true);
                  // Simulate API call processing
                  await new Promise(r => setTimeout(r, 1200));
                  setIsSaving(false);
                  setIsModalOpen(false);
                  setToastTitle('Đặt lịch thành công');
                  setShowToast(true);
                  // Auto-hide toast after 3.5 seconds
                  setTimeout(() => setShowToast(false), 3500);
                }}
                disabled={isSaving}
                className="px-10 py-3 text-sm font-extrabold text-slate-900 bg-primary hover:bg-primary/90 rounded-xl transition-all shadow-xl shadow-primary/20 flex items-center gap-3 active:scale-95 transform disabled:opacity-50 disabled:cursor-wait"
              >
                {isSaving ? (
                  <>
                    <div className="w-5 h-5 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin"></div>
                    Đang lưu...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined font-bold">send</span>
                    Lưu &amp; Gửi thông báo
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Professional Advice Modal */}
      {isAdviceModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]"
            onClick={() => setIsAdviceModalOpen(false)}
          ></div>

          <div className="relative bg-white dark:bg-slate-900 w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in duration-300 border border-primary/10 transition-all max-h-[90vh]">
            {/* Header section with glassmorphism */}
            <div className="px-8 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-20">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2.5 rounded-xl text-primary">
                  <span className="material-symbols-outlined font-bold">campaign</span>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white leading-tight">Gửi lời khuyên sức khỏe</h2>
                </div>
              </div>
              <button
                onClick={() => setIsAdviceModalOpen(false)}
                className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all text-slate-400 hover:text-red-500"
              >
                <span className="material-symbols-outlined font-bold">close</span>
              </button>
            </div>

            {/* Advice Content Area */}
            <div className="p-6 md:p-8 space-y-8 overflow-y-auto custom-scrollbar flex-1 bg-white dark:bg-slate-900">
              {/* Patient Profile Banner - Responsive Stack */}
              <div className="flex flex-col sm:flex-row items-center gap-4 md:gap-6 p-5 md:p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 relative group overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-700"></div>
                <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-slate-200 overflow-hidden shadow-inner flex-shrink-0 border-2 border-primary/20 relative z-10"
                  style={{ backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuBUstbGh5q911TPTLus7gX2RIO2ML_RSZbjV67EFkDBw0zf6vQQzS7IP3LwXkWI6OWS4mwx5KhEFyn-NJ5T-OeMOhMLb321T1uEw1ypz_mfVSy4RJSGZA4h5NHgwDOx8syKTRjqsnQ5cRRZlRIs0lxo8cA7nJHIBpBUgVAUxh3e6QkBpGR5iW1WaEsU3Xu5JdVd5WA_HjKsBFimtKG_GF5CgYz-JAa03FTdaPVVyoP_Kqd8-PCCC03jKnqOMbqTRYOC5StfAJMV2wM')`, backgroundSize: 'cover' }}>
                </div>
                <div className="relative z-10 flex-1 text-center sm:text-left">
                  <div className="flex flex-col sm:flex-row items-center gap-2">
                    <p className="font-extrabold text-slate-900 dark:text-white text-lg">Nguyễn Văn A</p>
                    <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-[10px] font-bold rounded-md">65 tuổi</span>
                  </div>
                  <p className="text-[10px] md:text-xs text-slate-500 font-bold uppercase tracking-widest opacity-70">BN quản lý thường trực • ID: BN-123456</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                {/* Left side: Category Selection */}
                <div className="space-y-4">
                  <label className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-lg">category</span>
                    Chọn nhóm tư vấn
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { icon: 'restaurant', label: 'Dinh dưỡng', color: 'bg-green-50 text-green-600 border-green-100' },
                      { icon: 'fitness_center', label: 'Vận động', color: 'bg-blue-50 text-blue-600 border-blue-100' },
                      { icon: 'pill', label: 'Dùng thuốc', color: 'bg-purple-50 text-purple-600 border-purple-100' },
                      { icon: 'monitoring', label: 'Theo dõi', color: 'bg-amber-50 text-amber-600 border-amber-100' }
                    ].map((cat, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setAdviceCategory(cat.label)}
                        className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${adviceCategory === cat.label
                          ? `${cat.color} border-current ring-1 ring-current shadow-md scale-[1.02]`
                          : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 hover:border-primary/30 text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
                      >
                        <span className="material-symbols-outlined text-2xl">{cat.icon}</span>
                        <span className="text-xs font-bold leading-none">{cat.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Right side: Advice Content */}
                <div className="space-y-4">
                  <label className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2 underline decoration-primary/30 underline-offset-4">
                    <span className="material-symbols-outlined text-primary text-lg">edit_note</span>
                    Lời khuyên từ bác sĩ
                  </label>
                  <div className="relative group">
                    <textarea
                      className="w-full rounded-2xl border-2 border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-sm font-medium focus:ring-4 focus:ring-primary/10 focus:border-primary min-h-[160px] p-6 outline-none transition-all shadow-sm resize-none group-hover:bg-white dark:group-hover:bg-slate-800"
                      placeholder="BS nhập lời khuyên chi tiết..."
                      value={adviceContent}
                      onChange={(e) => setAdviceContent(e.target.value)}
                    ></textarea>
                    <div className="absolute bottom-4 right-4 text-[10px] font-bold text-slate-400 bg-white dark:bg-slate-900 px-2 py-1 rounded-md border border-slate-100 dark:border-slate-800">
                      {adviceContent.length} / 500
                    </div>
                  </div>
                </div>
              </div>

              {/* Suggestions Section */}
              <div className="space-y-4 text-left">
                <p className="text-[11px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-widest pl-1">Gợi ý mẫu tư vấn nhanh</p>
                <div className="flex flex-wrap gap-3">
                  {[
                    { text: 'Hạn chế muối trong thức ăn', icon: 'restaurant' },
                    { text: 'Đi bộ 30 phút mỗi ngày', icon: 'directions_walk' },
                    { text: 'Theo dõi huyết áp hàng ngày', icon: 'monitor_heart' },
                    { text: 'Uống đủ 2L nước mỗi ngày', icon: 'water_drop' },
                    { text: 'Tránh các chất kích thích', icon: 'smoke_free' }
                  ].map((template, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setAdviceContent(prev => prev ? prev + ', ' + template.text : template.text)}
                      className="px-5 py-2.5 bg-white dark:bg-slate-800 hover:bg-primary text-slate-600 dark:text-slate-400 hover:text-slate-900 border border-slate-200 dark:border-slate-700 rounded-full text-xs font-bold transition-all shadow-sm active:scale-95 flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined text-sm opacity-70">{template.icon}</span>
                      {template.text}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Premium Footer */}
            <div className="px-8 py-6 bg-slate-50 dark:bg-slate-900/50 flex gap-4 border-t border-slate-100 dark:border-slate-800 sticky bottom-0 z-20">
              <button
                onClick={() => setIsAdviceModalOpen(false)}
                className="flex-1 py-3.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-500 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
                type="button"
              >
                Hủy bỏ
              </button>
              <button
                onClick={async () => {
                  setIsSaving(true);
                  // Process Advice Sending
                  await new Promise(r => setTimeout(r, 1000));
                  setIsSaving(false);
                  setIsAdviceModalOpen(false);
                  setToastTitle('Gửi lời khuyên thành công');
                  setShowToast(true);
                  setTimeout(() => setShowToast(false), 3500);
                }}
                disabled={isSaving}
                className="flex-[1.8] py-3.5 rounded-xl bg-primary hover:bg-primary/90 text-slate-900 font-extrabold text-sm shadow-xl shadow-primary/25 transition-all active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-wait"
                type="button"
              >
                {isSaving ? (
                  <>
                    <div className="w-5 h-5 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin"></div>
                    Đang gửi...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined font-bold">send</span>
                    Gửi tư vấn đến bệnh nhân
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Prescription Modal - Redesigned to match test.html 100% */}
      {isPrescriptionModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]"
            onClick={() => {
              setIsPrescriptionModalOpen(false);
              setIsAddingNewMedicine(false);
            }}
          ></div>

          <div className={`relative flex flex-col lg:flex-row h-fit max-h-[92vh] md:max-h-[85vh] transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] ${isAddingNewMedicine ? 'max-w-7xl w-full' : 'max-w-4xl w-full'} mx-2 md:mx-4`}>
            {/* Left Panel: Original Prescription UI (Restored to 100% test.html style) */}
            <div className={`bg-white dark:bg-slate-900 rounded-xl md:rounded-2xl shadow-2xl flex flex-col flex-shrink-0 transition-all duration-700 overflow-hidden ${isAddingNewMedicine ? 'w-full lg:w-[65%]' : 'w-full'}`}>
              <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <span className="material-symbols-outlined text-primary">description</span>
                  </div>
                  <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">Kê đơn thuốc mới</h2>
                </div>
                {!isAddingNewMedicine && (
                  <button onClick={() => setIsPrescriptionModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                    <span className="material-symbols-outlined font-bold">close</span>
                  </button>
                )}
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-8 text-left custom-scrollbar bg-white dark:bg-slate-900">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2 text-left">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Bệnh nhân</label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">search</span>
                      <select className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all appearance-none bg-none text-slate-900 dark:text-white font-medium">
                        <option>Nguyễn Văn A</option>
                        <option>Trần Thị B</option>
                      </select>
                      <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">expand_more</span>
                    </div>
                  </div>
                  <div className="space-y-2 text-left">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Chẩn đoán hiện tại</label>
                    <input className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all text-slate-900 dark:text-white font-medium" defaultValue="Viêm họng cấp / Theo dõi đái tháo đường" />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2 text-left">
                      <span className="material-symbols-outlined text-primary">pill</span>
                      Danh sách loại thuốc
                    </h3>
                    <button
                      onClick={() => setIsAddingNewMedicine(true)}
                      className="flex items-center gap-1 text-sm font-bold text-primary hover:bg-primary/10 px-3 py-1.5 rounded-lg transition-colors active:scale-95"
                    >
                      <span className="material-symbols-outlined text-sm">add_circle</span>
                      Thêm thuốc
                    </button>
                  </div>
                  <div className="overflow-hidden border border-slate-100 dark:border-slate-800 rounded-xl shadow-sm bg-white dark:bg-slate-900/50">
                    <table className="w-full text-left">
                      <thead className="bg-slate-50 dark:bg-slate-800/50 text-xs font-bold uppercase text-slate-500 dark:text-slate-400 tracking-wider">
                        <tr>
                          <th className="px-4 py-3">Tên thuốc & Hàm lượng</th>
                          <th className="px-4 py-3">Liều dùng</th>
                          <th className="px-4 py-3">Tần suất</th>
                          <th className="px-4 py-3">Thời gian</th>
                          <th className="px-4 py-3 text-right">Thao tác</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {medications.length > 0 ? medications.map((med) => (
                          <tr key={med.id} className="text-sm hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group">
                            <td className="px-4 py-4 text-left">
                              <div className="font-medium text-slate-900 dark:text-white">{med.name}</div>
                              <p className="text-xs text-slate-400">{med.intakeType}</p>
                            </td>
                            <td className="px-4 py-4 text-slate-900 dark:text-white">{med.dosage}</td>
                            <td className="px-4 py-4 text-slate-900 dark:text-white">{med.frequency}</td>
                            <td className="px-4 py-4 font-medium text-slate-900 dark:text-white">{med.duration}</td>
                            <td className="px-4 py-4 text-right">
                              <button onClick={() => removeMedication(med.id)} className="p-1.5 text-slate-400 hover:text-red-500 transition-colors active:scale-90">
                                <span className="material-symbols-outlined text-lg">delete</span>
                              </button>
                            </td>
                          </tr>
                        )) : (
                          <tr>
                            <td colSpan={5} className="px-4 py-10 text-center">
                              <div className="flex flex-col items-center justify-center gap-2 text-slate-400">
                                <span className="material-symbols-outlined text-3xl opacity-30">pending_actions</span>
                                <p className="text-sm font-medium italic">Chưa có thuốc nào được thêm</p>
                              </div>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                  <div className="space-y-3 text-left">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                      <span className="material-symbols-outlined text-slate-400 text-sm">edit_note</span>
                      Ghi chú dược sĩ/bệnh nhân
                    </label>
                    <textarea rows={3} className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all resize-none text-slate-900 dark:text-white text-sm" placeholder="Nhập hướng dẫn sử dụng thuốc chi tiết..." />
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-primary/5 rounded-xl border border-primary/10">
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-primary">event_repeat</span>
                        <div className="text-left">
                          <p className="text-sm font-bold text-slate-900 dark:text-white">Hẹn tái khám</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">Tự động nhắc lịch cho bệnh nhân</p>
                        </div>
                      </div>
                      <input type="checkbox" defaultChecked className="w-5 h-5 rounded-lg border-primary text-primary focus:ring-primary" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Ngày tái khám dự kiến</label>
                      <div className="relative">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">calendar_today</span>
                        <input type="date" defaultValue="2023-12-25" className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all text-slate-900 dark:text-white font-medium" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="sticky bottom-0 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 px-6 py-4 flex items-center justify-end gap-3 z-10">
                <button onClick={() => setIsPrescriptionModalOpen(false)} className="px-6 py-2.5 rounded-lg font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">Hủy</button>
                <button
                  onClick={async () => {
                    setIsSaving(true);
                    // Process Prescription Saving
                    await new Promise(r => setTimeout(r, 1500));
                    setIsSaving(false);
                    setIsPrescriptionModalOpen(false);
                    setToastTitle('Kê đơn thành công');
                    setShowToast(true);
                    setTimeout(() => setShowToast(false), 3500);
                  }}
                  disabled={isSaving}
                  className="px-8 py-2.5 rounded-lg font-bold bg-primary text-slate-900 hover:shadow-lg hover:shadow-primary/20 transition-all flex items-center gap-2 active:scale-95 disabled:opacity-50 disabled:cursor-wait"
                >
                  {isSaving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin"></div>
                      Đang lưu...
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-lg">send</span>
                      Lưu &amp; Gửi
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Right Panel: Add Medicine (Matching Original Style) */}
            {isAddingNewMedicine && (
              <div className="flex-1 mt-6 lg:mt-0 lg:ml-6 bg-white dark:bg-slate-900 rounded-xl md:rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right-10 md:slide-in-from-bottom-10 lg:slide-in-from-right-10 duration-700 relative w-full">
                <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-4 md:px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded-lg text-primary">
                      <span className="material-symbols-outlined">pill</span>
                    </div>
                    <div className="text-left">
                      <h3 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">Thêm thuốc mới</h3>
                    </div>
                  </div>
                  <button onClick={() => setIsAddingNewMedicine(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                    <span className="material-symbols-outlined font-bold">close</span>
                  </button>
                </div>

                <div className="p-8 space-y-6 flex-1 overflow-y-auto text-left custom-scrollbar bg-white dark:bg-slate-900">
                  <div className="space-y-2 text-left">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Tên thuốc & Hàm lượng</label>
                    <input type="text" placeholder="VD: Augmentin 1g" className={`w-full px-4 py-3 rounded-lg border ${formErrors.name ? 'border-red-500 bg-red-50/50' : 'border-slate-200 dark:border-slate-700'} bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all text-slate-900 dark:text-white font-medium shadow-sm`} value={newMedForm.name} onChange={(e) => { setNewMedForm({ ...newMedForm, name: e.target.value }); setFormErrors({ ...formErrors, name: false }); }} />
                    {formErrors.name && <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider pl-1">Vui lòng nhập tên thuốc</p>}
                  </div>

                  <div className="space-y-2 text-left">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Hướng dẫn uống thuốc</label>
                    <input type="text" placeholder="VD: Uống sau khi ăn sáng 30p" className={`w-full px-4 py-3 rounded-lg border ${formErrors.intakeType ? 'border-red-500 bg-red-50/50' : 'border-slate-200 dark:border-slate-700'} bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all text-slate-900 dark:text-white font-medium shadow-sm`} value={newMedForm.intakeType} onChange={(e) => { setNewMedForm({ ...newMedForm, intakeType: e.target.value }); setFormErrors({ ...formErrors, intakeType: false }); }} />
                    {formErrors.intakeType && <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider pl-1">Vui lòng nhập hướng dẫn</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2 text-left">
                      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Liều dùng</label>
                      <input type="text" placeholder="1 viên" className={`w-full px-4 py-3 rounded-lg border ${formErrors.dosage ? 'border-red-500 bg-red-50/50' : 'border-slate-200 dark:border-slate-700'} bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all text-slate-900 dark:text-white font-medium shadow-sm`} value={newMedForm.dosage} onChange={(e) => { setNewMedForm({ ...newMedForm, dosage: e.target.value }); setFormErrors({ ...formErrors, dosage: false }); }} />
                      {formErrors.dosage && <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider pl-1">Trống</p>}
                    </div>
                    <div className="space-y-2 text-left">
                      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Thời gian</label>
                      <input type="text" placeholder="7 ngày" className={`w-full px-4 py-3 rounded-lg border ${formErrors.duration ? 'border-red-500 bg-red-50/50' : 'border-slate-200 dark:border-slate-700'} bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all text-slate-900 dark:text-white font-medium shadow-sm`} value={newMedForm.duration} onChange={(e) => { setNewMedForm({ ...newMedForm, duration: e.target.value }); setFormErrors({ ...formErrors, duration: false }); }} />
                      {formErrors.duration && <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider pl-1">Trống</p>}
                    </div>
                  </div>

                  <div className="space-y-2 text-left">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Tần suất dùng</label>
                    <input type="text" placeholder="VD: Sáng 1, Trưa 1, Tối 1" className={`w-full px-4 py-3 rounded-lg border ${formErrors.frequency ? 'border-red-500 bg-red-50/50' : 'border-slate-200 dark:border-slate-700'} bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all text-slate-900 dark:text-white font-medium shadow-sm`} value={newMedForm.frequency} onChange={(e) => { setNewMedForm({ ...newMedForm, frequency: e.target.value }); setFormErrors({ ...formErrors, frequency: false }); }} />
                    {formErrors.frequency && <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider pl-1">Vui lòng nhập tần suất</p>}
                  </div>
                </div>

                <div className="sticky bottom-0 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 px-6 py-4 flex items-center justify-end z-10">
                  <button onClick={addMedicationToPrescription} className="w-full py-3.5 bg-primary text-slate-900 rounded-xl font-bold hover:shadow-lg hover:shadow-primary/20 transition-all active:scale-95 flex items-center justify-center gap-2 shadow-md">
                    <span className="material-symbols-outlined text-lg">library_add</span>
                    Lưu vào đơn thuốc
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      {/* Success Toast Notification - Compact Green Version */}
      {showToast && (
        <div className="fixed top-6 right-6 z-[200] animate-in slide-in-from-right-12 fade-in duration-500">
          <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-3xl border border-emerald-500/50 shadow-xl rounded-2xl p-0.5 overflow-hidden w-fit min-w-[260px]">
            <div className="px-5 py-3.5 flex items-center gap-3 bg-emerald-500/5">
              <div className="w-9 h-9 bg-emerald-500 text-white rounded-xl flex items-center justify-center shadow-md shadow-emerald-500/30">
                <span className="material-symbols-outlined font-extrabold text-xl">check_circle</span>
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400 tracking-tight">{toastTitle}</p>
              </div>
              <button onClick={() => setShowToast(false)} className="w-7 h-7 flex items-center justify-center text-slate-300 hover:text-emerald-500 hover:bg-emerald-500/10 rounded-full transition-all">
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>
            {/* Countdown Progress Bar */}
            <div className="h-1 bg-slate-100 dark:bg-slate-800 w-full overflow-hidden">
              <div className="h-full bg-emerald-500 origin-left animate-[toast-progress_3.5s_linear_forwards]"></div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes toast-progress {
          from { transform: scaleX(1); }
          to { transform: scaleX(0); }
        }
      `}</style>
    </div>
  );
}
