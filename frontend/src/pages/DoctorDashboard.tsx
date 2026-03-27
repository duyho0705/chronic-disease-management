import React, { useState, useEffect } from 'react';
import TopBar from '../components/common/TopBar';
import PatientDetailModal from '../features/patient/components/PatientDetailModal';
import AdviceModal from '../features/patient/components/AdviceModal';
import Toast from '../components/ui/Toast';
import PrescriptionModal from '../features/prescription/components/PrescriptionModal';
import RescheduleModal from '../features/patient/components/RescheduleModal';
import Dropdown from '../components/ui/Dropdown';

import { Link } from 'react-router-dom';
import { ROUTES } from '../constants/routes';

export default function DoctorDashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPrescriptionModalOpen, setIsPrescriptionModalOpen] = useState(false);
  const [isAddingNewMedicine, setIsAddingNewMedicine] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [isPatientDetailModalOpen, setIsPatientDetailModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);

  // Advice Modal State
  const [isAdviceModalOpen, setIsAdviceModalOpen] = useState(false);
  const [adviceCategory, setAdviceCategory] = useState('Theo dõi');
  const [adviceContent, setAdviceContent] = useState('');
  const [isAdviceSaving, setIsAdviceSaving] = useState(false);
  const [advicePatientName, setAdvicePatientName] = useState('');

  // Toast State
  const [showToast, setShowToast] = useState(false);
  const [toastTitle, setToastTitle] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error' | 'warning'>('success');

  const handleSaveAdvice = async () => {
    setIsAdviceSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsAdviceSaving(false);
    setIsAdviceModalOpen(false);
    setAdviceContent('');
    setToastTitle(`Đã gửi lời khuyên đến ${advicePatientName} thành công!`);
    setToastType('success');
    setShowToast(true);
  };
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
  // const [adviceCategory, setAdviceCategory] = useState('Dinh dưỡng'); // Duplicate, removed
  // const [adviceContent, setAdviceContent] = useState(''); // Duplicate, removed
  const [currentMonth, setCurrentMonth] = useState(10); // November (0-indexed)
  const [currentYear, setCurrentYear] = useState(2024);
  const [isSaving, setIsSaving] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Cảnh báo chỉ số', message: 'Bệnh nhân Nguyễn Văn An có chỉ số đường huyết cao bất thường.', time: '5 phút trước', type: 'warning' },
    { id: 2, title: 'Lịch hẹn mới', message: 'Bạn có một yêu cầu đặt lịch hẹn mới từ Lê Thị Bình.', time: '2 giờ trước', type: 'info' }
  ]);
  const [dashboardTimeRange, setDashboardTimeRange] = useState('7 ngày qua');

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

    setMedications([...medications, { ...newMedForm, id: Date.now() }]);
    setNewMedForm({ name: '', dosage: '', frequency: '', duration: '', intakeType: '' });
    setIsAddingNewMedicine(false);
  };

  const handleSaveReschedule = async () => {
    setIsSaving(true);
    // Simulate API call processing
    await new Promise(r => setTimeout(r, 1200));
    setIsSaving(false);
    setIsModalOpen(false);
    setToastTitle('Đặt lịch thành công');
    setShowToast(true);
  };

  // const handleSaveAdvice = async () => { // Duplicate, removed
  //   setIsSaving(true);
  //   // Process Advice Sending
  //   await new Promise(r => setTimeout(r, 1000));
  //   setIsSaving(false);
  //   setIsAdviceModalOpen(false);
  //   setToastTitle('Gửi lời khuyên thành công');
  //   setShowToast(true);
  // };

  const handleSavePrescription = async () => {
    setIsSaving(true);
    // Process Prescription Saving
    await new Promise(r => setTimeout(r, 1500));
    setIsSaving(false);
    setIsPrescriptionModalOpen(false);
    setToastTitle('Kê đơn thành công');
    setShowToast(true);
  };
  return (
    <>
      <div className="flex min-h-screen font-display bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100">
        {/* Sidebar Navigation - Responsive Collapsible */}
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
            <Link className="flex items-center gap-3 px-4 py-3 bg-primary text-white rounded-2xl font-medium shadow-lg shadow-primary/10 transition-all" to={ROUTES.DOCTOR.DASHBOARD}>
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>dashboard</span>
              <span>Bảng điều khiển</span>
            </Link>
            <Link className="flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-slate-400 hover:bg-primary/10 hover:text-primary rounded-2xl font-medium transition-all" to={ROUTES.DOCTOR.PATIENTS}>
              <span className="material-symbols-outlined">groups</span>
              <span>Danh sách bệnh nhân</span>
            </Link>
            <Link className="flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-slate-400 hover:bg-primary/10 hover:text-primary rounded-2xl font-medium transition-all" to={ROUTES.DOCTOR.ANALYTICS}>
              <span className="material-symbols-outlined">analytics</span>
              <span>Phân tích nguy cơ</span>
            </Link>
            <Link className="flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-slate-400 hover:bg-primary/10 hover:text-primary rounded-2xl font-medium transition-all" to={ROUTES.DOCTOR.PRESCRIPTIONS}>
              <span className="material-symbols-outlined">prescriptions</span>
              <span>Đơn thuốc điện tử</span>
            </Link>
            <Link className="flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-slate-400 hover:bg-primary/10 hover:text-primary rounded-2xl font-medium transition-all" to={ROUTES.DOCTOR.APPOINTMENTS}>
              <span className="material-symbols-outlined">calendar_today</span>
              <span>Lịch hẹn khám</span>
            </Link>
            <Link className="flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-slate-400 hover:bg-primary/10 hover:text-primary rounded-2xl font-medium transition-all" to={ROUTES.DOCTOR.MESSAGES}>
              <span className="material-symbols-outlined">chat</span>
              <span>Tin nhắn</span>
              <span className="ml-auto bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full">5</span>
            </Link>
          </nav>
          <div className="p-4 mt-auto">
            <div className="bg-primary/5 rounded-lg p-4 border border-primary/10">
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
          <TopBar
            setIsSidebarOpen={setIsSidebarOpen}
            notifications={notifications}
            setNotifications={setNotifications}
          />

          <div className="p-4 md:p-8 space-y-6 md:space-y-8">
            {/* Summary Cards */}
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-primary/5 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined size-6">person</span>
                  </div>
                  <span className="text-xs font-bold text-green-500 flex items-center">+2.4% <span className="material-symbols-outlined text-xs">trending_up</span></span>
                </div>
                <h3 className="text-slate-500 text-sm font-medium">Tổng bệnh nhân</h3>
                <p className="text-3xl font-extrabold mt-1">1,250</p>
              </div>
              <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-primary/5 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center text-red-500">
                    <span className="material-symbols-outlined size-6">emergency</span>
                  </div>
                  <span className="px-2 py-1 bg-red-500 text-white text-[10px] font-bold rounded-full">Cảnh báo</span>
                </div>
                <h3 className="text-slate-500 text-sm font-medium">Nguy cơ cao</h3>
                <p className="text-3xl font-extrabold mt-1 text-red-500">12</p>
              </div>
              <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-primary/5 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center text-blue-500">
                    <span className="material-symbols-outlined size-6">event_upcoming</span>
                  </div>
                </div>
                <h3 className="text-slate-500 text-sm font-medium">Lịch hẹn chờ</h3>
                <p className="text-3xl font-extrabold mt-1">08</p>
              </div>
              <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-primary/5 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center text-amber-500">
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
                  <Link className="text-primary text-sm font-bold hover:underline cursor-pointer" to={ROUTES.DOCTOR.ANALYTICS}>Xem tất cả</Link>
                </div>
                <div className="space-y-4">
                  {/* Patient Card 1 */}
                  <div className="bg-white dark:bg-slate-900 p-4 md:p-5 rounded-lg border-l-4 border-l-red-500 border border-primary/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm hover:shadow-md transition-shadow">
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
                      <p className="text-[14px] font-bold text-slate-400">Xu hướng HA</p>
                      <div className="flex items-center gap-2">
                        <p className="text-red-500 font-extrabold text-base md:text-lg">165/105</p>
                        <span className="text-[10px] text-red-500 font-medium sm:hidden block leading-none">(+12)</span>
                      </div>
                      <p className="text-[10px] text-red-400 font-bold hidden sm:block">Tăng mạnh (+12)</p>
                    </div>
                    <div className="flex flex-row sm:flex-col gap-2 w-full sm:w-auto">
                      <span className="flex-1 sm:flex-none bg-red-500 text-white text-[11px] font-bold px-4 py-1.5 rounded-full text-center shadow-sm shadow-red-500/20 uppercase tracking-wider whitespace-nowrap">Nguy cấp</span>
                      <div className="flex gap-2">
                        <Link to={ROUTES.DOCTOR.MESSAGES} className="flex-1 sm:flex-none bg-primary/10 hover:bg-primary/20 text-primary text-xs font-bold py-2 px-4 rounded-lg transition-colors flex items-center justify-center">
                          <span className="material-symbols-outlined text-base">chat</span>
                        </Link>
                        <button
                          onClick={() => { setIsAdviceModalOpen(true); setAdvicePatientName('Nguyễn Văn A'); }}
                          className="flex-1 sm:flex-none bg-primary/10 hover:bg-primary/20 text-primary text-xs font-bold py-2 px-4 rounded-lg transition-colors flex items-center justify-center">
                          <span className="material-symbols-outlined text-base">campaign</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Patient Card 2 */}
                  <div className="bg-white dark:bg-slate-900 p-4 md:p-5 rounded-lg border-l-4 border-l-amber-500 border border-primary/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm hover:shadow-md transition-shadow">
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
                      <p className="text-[14px] font-bold text-slate-400">Nhịp tim</p>
                      <p className="text-amber-500 font-extrabold text-base md:text-lg">112 bpm</p>
                      <p className="text-[10px] text-amber-400 font-bold hidden sm:block">Không ổn định</p>
                    </div>
                    <div className="flex flex-row sm:flex-col gap-2 w-full sm:w-auto">
                      <span className="flex-1 sm:flex-none bg-amber-500 text-white text-[11px] font-bold px-4 py-1.5 rounded-full text-center shadow-sm shadow-amber-500/20 uppercase tracking-wider whitespace-nowrap">Cần theo dõi</span>
                      <div className="flex gap-2">
                        <Link to={ROUTES.DOCTOR.MESSAGES} className="flex-1 sm:flex-none bg-primary/10 hover:bg-primary/20 text-primary text-xs font-bold py-2 px-4 rounded-lg transition-colors flex items-center justify-center">
                          <span className="material-symbols-outlined text-base">chat</span>
                        </Link>
                        <button
                          onClick={() => { setIsAdviceModalOpen(true); setAdvicePatientName('Trần Thị B'); }}
                          className="flex-1 sm:flex-none bg-primary/10 hover:bg-primary/20 text-primary text-xs font-bold py-2 px-4 rounded-lg transition-colors flex items-center justify-center">
                          <span className="material-symbols-outlined text-base">campaign</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Trend Chart Placeholder */}
                <div className="bg-white dark:bg-slate-900 p-6 rounded-lg border border-primary/5 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-[17px] font-bold">Xu hướng sức khỏe cộng đồng</h3>
                      <p className="text-[14px] text-slate-500">Thống kê dữ liệu lâm sàng theo tuần</p>
                    </div>
                    <Dropdown
                      options={['7 ngày qua', '30 ngày qua']}
                      value={dashboardTimeRange}
                      onChange={setDashboardTimeRange}
                      className="min-w-[140px]"
                    />
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
                  <div className="flex justify-between mt-4 px-2 text-[10px] font-bold text-slate-400 tracking-wide">
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
                      className="flex items-center gap-4 p-4 bg-white dark:bg-slate-900 hover:border-primary transition-all rounded-lg border border-primary/10 shadow-sm text-left group">
                      <div className="w-10 h-10 bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white rounded-lg flex items-center justify-center transition-colors">
                        <span className="material-symbols-outlined">description</span>
                      </div>
                      <span className="font-bold text-[14px]">Kê đơn thuốc mới</span>
                    </button>
                    <button
                      onClick={() => setIsAdviceModalOpen(true)}
                      className="flex items-center gap-4 p-4 bg-white dark:bg-slate-900 hover:border-primary transition-all rounded-lg border border-primary/10 shadow-sm text-left group">
                      <div className="w-10 h-10 bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white rounded-lg flex items-center justify-center transition-colors">
                        <span className="material-symbols-outlined">send</span>
                      </div>
                      <span className="font-bold text-[14px]">Gửi lời khuyên</span>
                    </button>
                    <button
                      onClick={() => setIsModalOpen(true)}
                      className="flex items-center gap-4 p-4 bg-white dark:bg-slate-900 hover:border-primary transition-all rounded-lg border border-primary/10 shadow-sm text-left group">
                      <div className="w-10 h-10 bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white rounded-lg flex items-center justify-center transition-colors">
                        <span className="material-symbols-outlined">event</span>
                      </div>
                      <span className="font-bold text-[14px]">Đặt lịch tái khám</span>
                    </button>
                  </div>
                </section>

                {/* Recent Appointments */}
                <section className="mt-8">
                  <h2 className="text-[18px] font-extrabold mb-6 tracking-tight">Lịch hẹn sắp tới</h2>
                  <div className="bg-white dark:bg-slate-900 rounded-2xl border border-primary/5 shadow-sm divide-y divide-primary/5 overflow-hidden">
                    <div className="p-5 flex items-center gap-5 hover:bg-slate-50 transition-colors cursor-pointer group">
                      <div className="flex-shrink-0 text-left min-w-[70px]">
                        <p className="text-[12px] font-bold text-slate-400 mb-1">Hôm nay</p>
                        <p className="text-xl font-black text-primary leading-tight">14:30</p>
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <p className="font-bold truncate text-[15px] text-slate-900 dark:text-white mb-0.5">Lê Văn C</p>
                        <p className="text-[13px] text-slate-500 font-medium">Khám định kỳ Tiểu đường</p>
                      </div>
                      <span className="material-symbols-outlined text-slate-300 group-hover:text-primary transition-all text-xl">chevron_right</span>
                    </div>
                    <div className="p-5 flex items-center gap-5 hover:bg-slate-50 transition-colors cursor-pointer group">
                      <div className="flex-shrink-0 text-left min-w-[70px]">
                        <p className="text-[12px] font-bold text-slate-400 mb-1">Hôm nay</p>
                        <p className="text-xl font-black text-primary leading-tight">15:15</p>
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <p className="font-bold truncate text-[15px] text-slate-900 dark:text-white mb-0.5">Phạm Minh H</p>
                        <p className="text-[13px] text-slate-500 font-medium">Tư vấn xét nghiệm</p>
                      </div>
                      <span className="material-symbols-outlined text-slate-300 group-hover:text-primary transition-all text-xl">chevron_right</span>
                    </div>
                    <div className="p-5 flex items-center gap-5 hover:bg-slate-50 transition-colors cursor-pointer group bg-slate-50/30">
                      <div className="flex-shrink-0 text-left min-w-[70px] opacity-60">
                        <p className="text-[12px] font-bold text-slate-400 mb-1">Mai</p>
                        <p className="text-xl font-black text-slate-400 leading-tight">09:00</p>
                      </div>
                      <div className="flex-1 overflow-hidden opacity-60">
                        <p className="font-bold truncate text-[15px] text-slate-900 dark:text-white mb-0.5">Hoàng Thu T</p>
                        <p className="text-[13px] text-slate-500 font-medium">Kiểm tra hậu phẫu</p>
                      </div>
                      <span className="material-symbols-outlined text-slate-300 group-hover:text-primary transition-all text-xl">chevron_right</span>
                    </div>
                  </div>
                  <Link
                    to={ROUTES.DOCTOR.APPOINTMENTS}
                    className="w-full mt-4 py-3 border border-dashed border-primary/30 text-primary font-bold text-[14px] rounded-lg hover:bg-primary/5 transition-colors flex items-center justify-center"
                  >
                    Xem toàn bộ lịch trình
                  </Link>
                </section>
              </aside>
            </div>

            {/* Patient Management Table */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-extrabold">Quản lý bệnh nhân gần đây</h2>
                <div className="flex gap-2">
                  <button className="px-4 py-2 bg-white dark:bg-slate-800 border border-primary/10 rounded-md text-[14px] font-bold">Lọc theo khoa</button>
                  <button className="px-4 py-2 bg-white dark:bg-slate-800 border border-primary/10 rounded-md text-[14px] font-bold">Xuất báo cáo</button>
                </div>
              </div>
              <div className="bg-white dark:bg-slate-900 rounded-lg border border-primary/5 shadow-sm pb-32">
                <div className="">
                  <div className="min-w-[800px]">
                    <table className="w-full text-left">
                      <thead className="bg-primary/5 border-b border-primary/5">
                        <tr>
                          <th className="px-6 py-4 text-[14px] font-bold text-slate-500">Bệnh nhân</th>
                          <th className="px-6 py-4 text-[14px] font-bold text-slate-500">Chỉ số gần nhất</th>
                          <th className="px-6 py-4 text-[14px] font-bold text-slate-500">Tình trạng</th>
                          <th className="px-6 py-4 text-[14px] font-bold text-slate-500">Cập nhật lần cuối</th>
                          <th className="px-6 py-4 text-[14px] font-bold text-slate-500 text-right rounded-tr-2xl">Thao tác</th>
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
                                <p className="text-[16px] font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors tracking-tight">Lê Văn C</p>
                                <p className="text-[13px] text-slate-400 dark:text-slate-500 font-medium tracking-tight">Mã hồ sơ: #SK-2034</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex gap-4">
                              <div className="text-[13px]">
                                <p className="text-slate-400 font-medium">Glucose</p>
                                <p className="font-bold text-[14px] text-slate-700 dark:text-slate-200">7.2 mmol/L</p>
                              </div>
                              <div className="text-[13px]">
                                <p className="text-slate-400 font-medium">SpO2</p>
                                <p className="font-bold text-[14px] text-slate-700 dark:text-slate-200">98%</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="px-4 py-1.5 bg-emerald-500 text-white text-[13px] font-bold rounded-full shadow-sm whitespace-nowrap inline-flex">Ổn định</span>
                          </td>
                          <td className="px-6 py-4 text-[14px] text-slate-500 font-medium">10 phút trước</td>
                          <td className="px-6 py-4 text-right relative">
                            <button
                              onClick={() => setActiveMenu(activeMenu === 'bn1' ? null : 'bn1')}
                              className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-primary hover:bg-primary/5 rounded-full transition-all ml-auto">
                              <span className="material-symbols-outlined text-[22px]">more_vert</span>
                            </button>

                            {activeMenu === 'bn1' && (
                              <>
                                <div className="fixed inset-0 z-[100]" onClick={() => setActiveMenu(null)}></div>
                                <div className="absolute right-6 top-12 w-56 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 py-2.5 z-[110] animate-in fade-in zoom-in-95 slide-in-from-top-2 duration-200 overflow-hidden text-left">
                                  <button
                                    onClick={() => { setSelectedPatient({ name: 'Nguyễn Văn A', id: 'BN-001', risk: 'Bình thường' }); setIsPatientDetailModalOpen(true); setActiveMenu(null); }}
                                    className="w-full px-4 py-3 text-left hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-3 group">
                                    <span className="material-symbols-outlined text-slate-400 group-hover:text-primary text-xl">visibility</span>
                                    <span className="text-sm font-bold text-slate-600 dark:text-slate-300">Xem chi tiết hồ sơ</span>
                                  </button>
                                  <button
                                    onClick={() => { setIsAdviceModalOpen(true); setAdvicePatientName('Lê Văn C'); setActiveMenu(null); }}
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
                        <tr className="hover:bg-primary/5 transition-colors group">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div
                                className="w-9 h-9 md:w-11 md:h-11 rounded-xl bg-slate-200 shrink-0 object-cover ring-2 ring-primary/5"
                                data-alt="Patient Phạm Minh H avatar"
                                style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAVWHXZK60rwm9MmaiA29VqP8ASQil3c591s5uuDkVdKwjsRUz9RHL00AwcIvKfnm7sTOXzKNKN-nbUXzpn8_j5rS9-8y8-OLkWoG_bIJ-tvNu7kA5TN0IqYWvQTamN9pwGFHfvgkGuyil2rYepRAyvMBn9AzFgopcwac8GX4iwy5aaHqtE6N4CzrwJf_kIMQWAO0QGQRpmQCZwYxcMQqaUSBGFRzbKGyvoidiTokz-2varrt7wx1PwpL0TgtgO3T9xoYBE0wh875k')" }}>
                              </div>
                              <div>
                                <p className="text-[16px] font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors tracking-tight">Phạm Minh H</p>
                                <p className="text-[13px] text-slate-400 dark:text-slate-500 font-medium tracking-tight">Mã hồ sơ: #SK-2155</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex gap-4">
                              <div className="text-[13px]">
                                <p className="text-slate-400 font-medium">Huyết áp</p>
                                <p className="font-bold text-[14px] text-slate-700 dark:text-slate-200">135/85</p>
                              </div>
                              <div className="text-[13px]">
                                <p className="text-slate-400 font-medium">BMI</p>
                                <p className="font-bold text-[14px] text-slate-700 dark:text-slate-200">24.5</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="px-4 py-1.5 bg-amber-500 text-white text-[13px] font-bold rounded-full shadow-sm whitespace-nowrap inline-flex">Cần kiểm tra</span>
                          </td>
                          <td className="px-6 py-4 text-[13px] text-slate-500">2 giờ trước</td>
                          <td className="px-6 py-4 text-right relative">
                            <button
                              onClick={() => setActiveMenu(activeMenu === 'bn2' ? null : 'bn2')}
                              className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-primary hover:bg-primary/5 rounded-full transition-all ml-auto">
                              <span className="material-symbols-outlined">more_vert</span>
                            </button>

                            {activeMenu === 'bn2' && (
                              <>
                                <div className="fixed inset-0 z-[100]" onClick={() => setActiveMenu(null)}></div>
                                <div className="absolute right-6 top-12 w-64 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 py-2.5 z-[110] animate-in fade-in zoom-in-95 slide-in-from-top-2 duration-200 overflow-hidden text-left">
                                  <button
                                    onClick={() => { setSelectedPatient({ name: 'Phạm Minh H', id: '#SK-2155', risk: 'Cần theo dõi' }); setIsPatientDetailModalOpen(true); setActiveMenu(null); }}
                                    className="w-full px-4 py-3 text-left hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-3 group">
                                    <span className="material-symbols-outlined text-slate-400 group-hover:text-primary text-xl">visibility</span>
                                    <span className="text-sm font-bold text-slate-600 dark:text-slate-300">Xem chi tiết hồ sơ</span>
                                  </button>
                                  <button
                                    onClick={() => { setIsAdviceModalOpen(true); setAdvicePatientName('Phạm Minh H'); setActiveMenu(null); }}
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

        <RescheduleModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          currentMonth={currentMonth}
          setCurrentMonth={setCurrentMonth}
          currentYear={currentYear}
          setCurrentYear={setCurrentYear}
          selectedDay={selectedDay}
          setSelectedDay={setSelectedDay}
          selectedTime={selectedTime}
          setSelectedTime={setSelectedTime}
          isSaving={isSaving}
          onSave={handleSaveReschedule}
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
          formErrors={formErrors as any}
          setFormErrors={setFormErrors as any}
          addMedicationToPrescription={addMedicationToPrescription}
          isSaving={isSaving}
          onSave={handleSavePrescription}
          patientName="Nguyễn Văn A"
        />

        {selectedPatient && (
          <PatientDetailModal
            isOpen={isPatientDetailModalOpen}
            onClose={() => setIsPatientDetailModalOpen(false)}
            patient={selectedPatient}
          />
        )}

        <AdviceModal
          isOpen={isAdviceModalOpen}
          onClose={() => setIsAdviceModalOpen(false)}
          adviceCategory={adviceCategory}
          setAdviceCategory={setAdviceCategory}
          adviceContent={adviceContent}
          setAdviceContent={setAdviceContent}
          isSaving={isAdviceSaving}
          onSave={handleSaveAdvice}
          patientName={advicePatientName}
        />

        <Toast
          show={showToast}
          title={toastTitle}
          onClose={() => setShowToast(false)}
        />
        {/* MODAL REMOVED - Redirecting to appointments instead */}
      </div>

      <style>{`
        @keyframes toast-progress {
          from { transform: scaleX(1); }
          to { transform: scaleX(0); }
        }
      `}</style>
    </>
  );
}
